/**
 * CmsProvider — the React context over the patcms client.
 *
 * Value-domain rules honoured here:
 * - Repository JSON is never merged with Object.assign or a deep merge. The only
 *   merge in this file is the edit-buffer spread (`{ ...working, ...patch }`) on
 *   the host's own working copy — the same pattern patcms' reference panel uses —
 *   and, after a conflict, patches are composed on top of the REMOTE value so
 *   unrendered partner edits survive (per-field conflict recipe).
 * - Save conflicts come back as `PublishResult` values, never thrown. Only
 *   transport/auth failures (NETWORK, AUTH_EXPIRED, RATE_LIMIT, …) throw; they
 *   also set `error` in context.
 * - `noop` (zero-diff save) is success: no commit, no retry, no warning.
 * - Draft edits never touch the network: they update in-memory state and the
 *   IndexedDB draft store only. Publishing (the Publish button) is the single
 *   commit path.
 * - A publish is safe against edits typed while it is in flight: the newest
 *   working value is stashed and restored as the next draft after the commit
 *   lands, so no keystroke is lost and the user can publish it next.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { canonicalJson, isCMSError } from 'patcms';
import type { Entry, EntryValue, JsonValue, SaveResult } from 'patcms';
import { describeCmsError, restoreSession, signIn as authSignIn, signOut as authSignOut, watchAuthStatus } from './auth';
import { cms } from './client';
import * as drafts from './drafts';
import type { DraftKey } from './drafts';
import type {
  CmsStatus,
  ContactSettings,
  HomeSettings,
  PhilosophySettings,
  PlaceValue,
  PublishInfo,
  PublishResult,
  SettingsName,
} from './types';

export type { CmsStatus, PublishResult, SettingsName } from './types';
export type { PlaceValue, HomeSettings, PhilosophySettings, ContactSettings } from './types';

export interface PlaceRow {
  id: string;
  value: PlaceValue;
  hasDraft: boolean;
}

export interface CmsApi {
  status: CmsStatus;
  error?: string;
  signIn(token: string, remember: boolean): Promise<void>;
  signOut(): Promise<void>;
  refresh(): Promise<void>;
  places: Array<{ id: string; value: PlaceValue; hasDraft: boolean }>;
  settings: { home: HomeSettings; philosophy: PhilosophySettings; contact: ContactSettings };
  /** App-level keys (`places/<slug>`, `settings/<file>`) that currently hold a draft. */
  draftKeys: ReadonlySet<string>;
  updatePlaceDraft(id: string, patch: Partial<PlaceValue>): void;
  updateSettingsDraft(name: SettingsName, patch: Record<string, unknown>): void;
  discardDraft(key: string): Promise<void>;
  publishPlace(id: string): Promise<PublishResult>;
  publishSettings(name: SettingsName): Promise<PublishResult>;
  createPlace(value: PlaceValue): Promise<{ id: string }>;
  uploadMedia(file: File, folder?: string, options?: { overwrite?: boolean }): Promise<{ path: string }>;
  /**
   * Read an already-committed media file back from the repository as a Blob.
   * Used by admin previews as a fallback when the public `/images/…` URL is
   * not servable yet (upload committed but deploy still running, or local dev
   * where `public/images` has not been updated by the upload).
   */
  getMediaBlob(publicPath: string): Promise<Blob>;
  lastPublish?: PublishInfo;
}

const SETTINGS_NAMES: readonly SettingsName[] = ['home', 'philosophy', 'contact'];

/** Empty stand-ins so `settings` keeps its non-optional shape before boot completes. */
const EMPTY_HOME: HomeSettings = {
  manifestoTag: '',
  manifestoTitle: '',
  manifestoBody: '',
  manifestoCtaText: '',
  curatedBadge: '',
  curatedTitle: '',
  curatedSubtitle: '',
  curatedPlaceIds: [],
  offerBannerEnabled: false,
  offerBannerBadge: '',
  offerBannerTitle: '',
  offerBannerDescription: '',
  offerBannerCtaText: '',
  offerBannerCtaLink: '',
};

const EMPTY_PHILOSOPHY: PhilosophySettings = {
  badge: '',
  heroTitle: '',
  heroSubtitle: '',
  manifestoParagraphs: [],
  principles: [],
  interludeImageUrl: '',
  interludeTag: '',
  interludeLocation: '',
  interludeFilmNote: '',
  pullQuote: '',
  closingHeadline: '',
  closingSubtext: '',
};

const EMPTY_CONTACT: ContactSettings = {
  badge: '',
  title: '',
  subtitle: '',
  formTitle: '',
  formSubtitle: '',
  hqDeskTitle: '',
  inquiryEmail: '',
  tollFreePhone: '',
  internationalPhone: '',
  operatingHours: '',
  liveMonitoringNote: '',
  outposts: [],
  brandPromiseTitle: '',
  brandPromises: [],
};

const EMPTY_SETTINGS = {
  home: EMPTY_HOME,
  philosophy: EMPTY_PHILOSOPHY,
  contact: EMPTY_CONTACT,
};

interface SettingsValues {
  home: HomeSettings;
  philosophy: PhilosophySettings;
  contact: ContactSettings;
}

/** Canonical equality — the sanctioned comparison for repository values. */
function sameValue(a: unknown, b: unknown): boolean {
  return canonicalJson((a ?? null) as JsonValue) === canonicalJson((b ?? null) as JsonValue);
}

/** Modeled field names whose values differ between the remote entry and the local value. */
function conflictFields(current: Entry, local: EntryValue): string[] {
  return current.fields
    .filter((field) => field.type !== 'divider' && field.type !== 'slug' && field.type !== 'hidden')
    .map((field) => field.name)
    .filter((name) => !sameValue(current.value[name], local[name]));
}

function sortPlaces(rows: PlaceRow[]): PlaceRow[] {
  return [...rows].sort(
    (a, b) =>
      (a.value.dispatchNumber ?? Number.MAX_SAFE_INTEGER) -
        (b.value.dispatchNumber ?? Number.MAX_SAFE_INTEGER) ||
      a.value.name.localeCompare(b.value.name),
  );
}

const CmsContext = createContext<CmsApi | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CmsStatus>('booting');
  const [error, setError] = useState<string | undefined>(undefined);
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [settings, setSettings] = useState<SettingsValues>(EMPTY_SETTINGS);
  const [draftKeys, setDraftKeys] = useState<ReadonlySet<string>>(new Set());
  const [lastPublish, setLastPublish] = useState<PublishInfo | undefined>(undefined);

  // Mirrors of committed entries and working values, readable synchronously.
  const placeEntriesRef = useRef(new Map<string, Entry>());
  const placeValuesRef = useRef(new Map<string, PlaceValue>());
  const settingsEntriesRef = useRef(new Map<SettingsName, Entry>());
  const settingsValuesRef = useRef<SettingsValues>(EMPTY_SETTINGS);
  // Remote entries to rebase onto after a conflict (keyed by draft key).
  const conflictBaseRef = useRef(new Map<string, Entry>());
  // Draft keys with a publish currently in flight, and the newest working value
  // captured for each while that publish runs (consumed by `publishEntry`).
  const publishingRef = useRef(new Set<DraftKey>());
  const midflightRef = useRef(new Map<DraftKey, EntryValue>());
  const statusRef = useRef<CmsStatus>('booting');
  const signingOutRef = useRef(false);

  const applyStatus = useCallback((next: CmsStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const setPlaceDraftFlag = useCallback((key: string, hasDraft: boolean) => {
    setDraftKeys((prev) => {
      const next = new Set(prev);
      if (hasDraft) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  /** Load every entry + draft from the client and rebuild the state. */
  const loadAll = useCallback(async () => {
    // listPaths is tree-only; `get` then reads each blob once and returns full
    // Entries (raw + sha), which drafts.save and entries.save need as their base.
    const [placeStubs, settingsStubs] = await Promise.all([
      cms.entries.listPaths('places'),
      cms.entries.listPaths('settings'),
    ]);

    const settingsSlugs = new Set(settingsStubs.map((stub) => stub.slug));
    const missing = SETTINGS_NAMES.filter((name) => !settingsSlugs.has(name));
    if (missing.length > 0) {
      throw new Error(`Settings file(s) missing on branch: ${missing.join(', ')}`);
    }

    const [placeEntries, settingsEntries] = await Promise.all([
      Promise.all(placeStubs.map((stub) => cms.entries.get('places', stub.slug))),
      Promise.all(SETTINGS_NAMES.map((name) => cms.entries.get('settings', name))),
    ]);

    const [placeDraftMap, settingsDraftMap] = await Promise.all([
      drafts.readDrafts('places'),
      drafts.readDrafts('settings'),
    ]);

    placeEntriesRef.current.clear();
    placeValuesRef.current.clear();
    settingsEntriesRef.current.clear();

    const placeRows: PlaceRow[] = placeEntries.map((entry) => {
      placeEntriesRef.current.set(entry.slug, entry);
      const draft = placeDraftMap.get(entry.slug);
      const value = (draft?.value ?? entry.value) as unknown as PlaceValue;
      placeValuesRef.current.set(entry.slug, value);
      return { id: entry.slug, value, hasDraft: draft !== undefined };
    });

    const values = {} as SettingsValues;
    const nextDraftKeys = new Set<string>();
    for (const entry of settingsEntries) {
      const name = entry.slug as SettingsName;
      settingsEntriesRef.current.set(name, entry);
      const draft = settingsDraftMap.get(name);
      (values as Record<SettingsName, unknown>)[name] =
        (draft?.value ?? entry.value) as unknown as HomeSettings;
      if (draft) nextDraftKeys.add(drafts.draftKey('settings', name));
    }
    for (const row of placeRows) {
      if (row.hasDraft) nextDraftKeys.add(drafts.draftKey('places', row.id));
    }

    settingsValuesRef.current = values;
    setPlaces(sortPlaces(placeRows));
    setSettings(values);
    setDraftKeys(nextDraftKeys);
  }, []);

  /** Shared publish path for places and settings singletons. */
  const publishEntry = useCallback(
    async (
      key: DraftKey,
      collection: drafts.CmsCollection,
      id: string,
      entry: Entry,
      value: EntryValue,
      applyFresh: (fresh: Entry) => void,
      applyWorking: (value: EntryValue) => void,
    ): Promise<PublishResult> => {
      // Mark the flight and reset the mid-flight stash: only edits that arrive
      // DURING this publish may restore themselves after it lands.
      publishingRef.current.add(key);
      midflightRef.current.delete(key);
      try {
        // Land any pending debounced draft write first so it cannot race the delete below.
        await drafts.flushDraft(key);

        const check = await cms.entries.validate(entry, value);
        if (!check.ok) {
          // No commit happened; the working value in state is still authoritative.
          midflightRef.current.delete(key);
          return {
            status: 'validation',
            issues: check.issues.map((issue) => ({ path: issue.path, message: issue.message })),
          };
        }

        let result: SaveResult;
        try {
          result = await cms.entries.save(entry, value);
        } catch (thrown) {
          midflightRef.current.delete(key);
          const message = describeCmsError(thrown);
          setError(message);
          throw thrown;
        }

        if (result.status === 'conflict') {
          // applyFresh never ran, so the working value already includes any
          // mid-flight edits — the stash would be stale. Drop it.
          midflightRef.current.delete(key);
          // Keep the remote entry as the base for the follow-up merged save and for
          // draft writes, so the next save diffs against the reconciled tree.
          conflictBaseRef.current.set(key, result.current);
          if (collection === 'places') placeEntriesRef.current.set(id, result.current);
          else settingsEntriesRef.current.set(id as SettingsName, result.current);
          return {
            status: 'conflict',
            fields: conflictFields(result.current, result.local),
            current: result.current.value,
            local: result.local,
          };
        }

        // Success (saved or noop). patcms 0.1.0 does not delete the draft itself
        // (docs say it does) — delete it here, and cancel any queued write.
        drafts.cancelDraft(key);
        conflictBaseRef.current.delete(key);
        try {
          await cms.drafts.delete({ collection, slug: id });
        } catch {
          // Best effort: a leftover draft is harmless (it equals the committed value).
        }
        applyFresh(result.entry);

        // Edits typed while the save was in flight were stashed (applyFresh just
        // overwrote the working value with the committed one). Restore the newest
        // stashed value as the next draft so no keystroke is lost; the user
        // commits it with the next Publish.
        const stashed = midflightRef.current.get(key);
        midflightRef.current.delete(key);
        if (stashed !== undefined && !sameValue(stashed, result.entry.value)) {
          applyWorking(stashed);
          setPlaceDraftFlag(key, true);
          drafts.queueDraftSave(result.entry, stashed, key);
        } else {
          setPlaceDraftFlag(key, false);
        }
        setLastPublish(
          result.status === 'saved'
            ? {
                sha: result.commitSha,
                url: `https://github.com/${cms.repository.owner}/${cms.repository.repo}/commit/${result.commitSha}`,
                at: new Date().toISOString(),
              }
            : { at: new Date().toISOString() },
        );
        return result.status === 'saved' ? { status: 'saved', sha: result.commitSha } : { status: 'noop' };
      } finally {
        publishingRef.current.delete(key);
      }
    },
    [setPlaceDraftFlag],
  );

  const publishPlace = useCallback(
    async (id: string): Promise<PublishResult> => {
      const entry = placeEntriesRef.current.get(id);
      if (!entry) throw new Error(`Unknown place: ${id}`);
      const key = drafts.draftKey('places', id);
      const value = placeValuesRef.current.get(id) ?? (entry.value as unknown as PlaceValue);
      return publishEntry(
        key,
        'places',
        id,
        entry,
        value as EntryValue,
        (fresh) => {
          placeEntriesRef.current.set(fresh.slug, fresh);
          const freshValue = fresh.value as unknown as PlaceValue;
          placeValuesRef.current.set(fresh.slug, freshValue);
          setPlaces((prev) =>
            sortPlaces([
              ...prev.filter((row) => row.id !== fresh.slug),
              { id: fresh.slug, value: freshValue, hasDraft: false },
            ]),
          );
        },
        (next) => {
          // Restore a mid-flight edit as the working draft (hasDraft is set by
          // publishEntry via setPlaceDraftFlag).
          placeValuesRef.current.set(id, next as unknown as PlaceValue);
          setPlaces((prev) =>
            sortPlaces([
              ...prev.filter((row) => row.id !== id),
              { id, value: next as unknown as PlaceValue, hasDraft: true },
            ]),
          );
        },
      );
    },
    [publishEntry],
  );

  const publishSettings = useCallback(
    async (name: SettingsName): Promise<PublishResult> => {
      const entry = settingsEntriesRef.current.get(name);
      if (!entry) throw new Error(`Unknown settings file: ${name}`);
      const key = drafts.draftKey('settings', name);
      const value =
        settingsValuesRef.current[name] ?? (entry.value as unknown as Record<string, unknown>);
      return publishEntry(
        key,
        'settings',
        name,
        entry,
        value as EntryValue,
        (fresh) => {
          settingsEntriesRef.current.set(name, fresh);
          const freshValue = fresh.value as unknown as Record<string, unknown>;
          settingsValuesRef.current = { ...settingsValuesRef.current, [name]: freshValue };
          setSettings((prev) => ({ ...prev, [name]: freshValue }));
        },
        (next) => {
          const workingValue = next as unknown as Record<string, unknown>;
          settingsValuesRef.current = { ...settingsValuesRef.current, [name]: workingValue };
          setSettings((prev) => ({ ...prev, [name]: workingValue }));
        },
      );
    },
    [publishEntry],
  );

  /** Merge a patch into the working copy (and the IndexedDB draft). No network. */
  const updatePlaceDraft = useCallback(
    (id: string, patch: Partial<PlaceValue>) => {
      const entry = placeEntriesRef.current.get(id);
      if (!entry) return;
      const key = drafts.draftKey('places', id);
      // After a conflict, compose picks on top of the REMOTE value so partner
      // edits the UI does not render survive the follow-up save.
      const base =
        conflictBaseRef.current.get(key)?.value ??
        (placeValuesRef.current.get(id) ?? entry.value) as unknown as PlaceValue;
      const next = { ...base, ...patch } as PlaceValue;
      placeValuesRef.current.set(id, next);
      setPlaces((prev) => prev.map((row) => (row.id === id ? { ...row, value: next, hasDraft: true } : row)));
      setPlaceDraftFlag(key, true);
      // While a publish of this entry is in flight, remember the newest working
      // value: the publish's applyFresh overwrites state with the committed
      // value, and publishEntry restores the stash afterwards.
      if (publishingRef.current.has(key)) midflightRef.current.set(key, next as EntryValue);
      drafts.queueDraftSave(entry, next as EntryValue, key);
    },
    [setPlaceDraftFlag],
  );

  const updateSettingsDraft = useCallback(
    (name: SettingsName, patch: Record<string, unknown>) => {
      const entry = settingsEntriesRef.current.get(name);
      if (!entry) return;
      const key = drafts.draftKey('settings', name);
      const base =
        conflictBaseRef.current.get(key)?.value ??
        (settingsValuesRef.current[name] ?? entry.value) as unknown as Record<string, unknown>;
      const next = { ...base, ...patch };
      settingsValuesRef.current = { ...settingsValuesRef.current, [name]: next };
      setSettings((prev) => ({ ...prev, [name]: next }));
      setPlaceDraftFlag(key, true);
      if (publishingRef.current.has(key)) midflightRef.current.set(key, next as EntryValue);
      drafts.queueDraftSave(entry, next as EntryValue, key);
    },
    [setPlaceDraftFlag],
  );

  /** Drop a draft and fall back to the last committed value. */
  const discardDraft = useCallback(
    async (key: string) => {
      const parsed = drafts.parseDraftKey(key);
      if (!parsed) return;
      await drafts.deleteDraft(key as DraftKey);
      conflictBaseRef.current.delete(key);
      const fresh = await cms.entries.get(parsed.collection, parsed.id);
      setPlaceDraftFlag(key, false);
      if (parsed.collection === 'places') {
        placeEntriesRef.current.set(parsed.id, fresh);
        const committed = fresh.value as unknown as PlaceValue;
        placeValuesRef.current.set(parsed.id, committed);
        setPlaces((prev) =>
          sortPlaces([
            ...prev.filter((row) => row.id !== parsed.id),
            { id: parsed.id, value: committed, hasDraft: false },
          ]),
        );
      } else {
        const name = parsed.id as SettingsName;
        settingsEntriesRef.current.set(name, fresh);
        const committed = fresh.value as unknown as Record<string, unknown>;
        settingsValuesRef.current = { ...settingsValuesRef.current, [name]: committed };
        setSettings((prev) => ({ ...prev, [name]: committed }));
      }
    },
    [setPlaceDraftFlag],
  );

  const signIn = useCallback(
    async (token: string, remember: boolean) => {
      setError(undefined);
      try {
        await authSignIn(token, remember);
        await loadAll();
        applyStatus('signed-in');
      } catch (thrown) {
        setError(describeCmsError(thrown));
        applyStatus('signed-out');
      }
    },
    [applyStatus, loadAll],
  );

  const signOut = useCallback(async () => {
    signingOutRef.current = true;
    try {
      await authSignOut();
    } finally {
      signingOutRef.current = false;
    }
    placeEntriesRef.current.clear();
    placeValuesRef.current.clear();
    settingsEntriesRef.current.clear();
    settingsValuesRef.current = EMPTY_SETTINGS;
    conflictBaseRef.current.clear();
    setPlaces([]);
    setSettings(EMPTY_SETTINGS);
    setDraftKeys(new Set());
    setLastPublish(undefined);
    setError(undefined);
    applyStatus('signed-out');
  }, [applyStatus]);

  const refresh = useCallback(async () => {
    // Flush pending draft writes so unsaved edits survive the reload via IndexedDB.
    await drafts.flushAllDrafts();
    await cms.refresh();
    await loadAll();
  }, [loadAll]);

  const createPlace = useCallback(async (value: PlaceValue): Promise<{ id: string }> => {
    let result: SaveResult;
    try {
      result = await cms.entries.create('places', value as EntryValue);
    } catch (thrown) {
      // Validation failures throw CMSError VALIDATION with `.issues` attached.
      setError(describeCmsError(thrown));
      throw thrown;
    }
    if (result.status === 'saved') {
      const fresh = result.entry;
      placeEntriesRef.current.set(fresh.slug, fresh);
      const freshValue = fresh.value as unknown as PlaceValue;
      placeValuesRef.current.set(fresh.slug, freshValue);
      setPlaces((prev) =>
        sortPlaces([
          ...prev.filter((row) => row.id !== fresh.slug),
          { id: fresh.slug, value: freshValue, hasDraft: false },
        ]),
      );
      return { id: fresh.slug };
    }
    const message =
      result.status === 'conflict'
        ? 'A place file with that name already exists on the branch.'
        : 'Nothing to create — the place already matches the branch.';
    setError(message);
    throw new Error(message);
  }, []);

  const uploadMedia = useCallback(async (file: File, _folder?: string, options?: { overwrite?: boolean }): Promise<{ path: string }> => {
    // patcms v1 uploads into the configured media folder (`public/images`);
    // a per-upload destination override does not exist, so `folder` is accepted
    // but unused. The returned path is the public path to store in a field.
    const bytes = new Uint8Array(await file.arrayBuffer());
    try {
      const uploaded = await cms.media.upload({ name: file.name, bytes }, options || {});
      return { path: uploaded.publicPath };
    } catch (thrown) {
      // CONFLICT (path exists), VALIDATION (empty / >90 MiB / .svg) — the UI decides.
      setError(describeCmsError(thrown));
      throw thrown;
    }
  }, []);

  /**
   * Fetch committed media bytes straight from the repository through the CMS
   * client (which caches blobs locally). This is the reliable preview source:
   * it works before the deployment that would serve `/images/…` exists.
   */
  const getMediaBlob = useCallback(async (publicPath: string): Promise<Blob> => {
    const media = await cms.media.get(publicPath);
    // `MediaBlob.bytes` is a Uint8Array; copy into a fresh ArrayBuffer so the
    // Blob owns its memory regardless of the underlying buffer's view offsets.
    return new Blob([media.bytes.slice()], { type: media.type ?? 'application/octet-stream' });
  }, []);

  // Boot: restore a remembered session, then load content. Also watch for a
  // mid-session expiry (signed-in → signed-out that we did not initiate).
  useEffect(() => {
    let active = true;
    const off = watchAuthStatus((signedIn) => {
      if (!signedIn && statusRef.current === 'signed-in' && !signingOutRef.current) {
        setError('Your session expired. Sign in again to continue.');
        applyStatus('signed-out');
      }
    });
    void (async () => {
      try {
        let restored = false;
        let restoreError: string | undefined;
        try {
          restored = await restoreSession();
        } catch (thrown) {
          restoreError = describeCmsError(thrown);
        }
        if (!active) return;
        if (!restored) {
          if (restoreError) setError(restoreError);
          applyStatus('signed-out');
          return;
        }
        await loadAll();
        if (!active) return;
        applyStatus('signed-in');
      } catch (thrown) {
        if (!active) return;
        setError(describeCmsError(thrown));
        applyStatus('error');
      }
    })();
    return () => {
      active = false;
      off();
    };
  }, [applyStatus, loadAll]);

  const value = useMemo<CmsApi>(
    () => ({
      status,
      error,
      signIn,
      signOut,
      refresh,
      places,
      settings,
      draftKeys,
      updatePlaceDraft,
      updateSettingsDraft,
      discardDraft,
      publishPlace,
      publishSettings,
      createPlace,
      uploadMedia,
      getMediaBlob,
      lastPublish,
    }),
    [
      status,
      error,
      signIn,
      signOut,
      refresh,
      places,
      settings,
      draftKeys,
      updatePlaceDraft,
      updateSettingsDraft,
      discardDraft,
      publishPlace,
      publishSettings,
      createPlace,
      uploadMedia,
      getMediaBlob,
      lastPublish,
    ],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsApi {
  const context = useContext(CmsContext);
  if (!context) throw new Error('useCms must be used within a CmsProvider');
  return context;
}

/** Type guard for patcms errors, re-exported for UI code. */
export { isCMSError };
