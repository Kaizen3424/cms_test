/**
 * Local draft persistence.
 *
 * The IndexedDB draft store from `patcms/web` is injected into the client in
 * `client.ts`, so `cms.drafts.*` persists across reloads. patcms keys each
 * record internally as `${owner}/${repo}/${collection}/${slug}`; at this layer
 * we address drafts with an app-level key of `collection/id`, where `id` is the
 * entry slug for `places` (e.g. `places/ladakh`) and the file name for the
 * `settings` singletons (e.g. `settings/home`).
 *
 * Draft writes are debounced (keystroke bursts should not thrash IndexedDB).
 * `flushDraft` forces the pending write (used before publish/refresh) and
 * `cancelDraft` drops it (used after a successful publish, so a late write
 * cannot resurrect a deleted draft). Drafts are orthogonal to the token
 * lifecycle: they survive sign-out and refresh by design (ADR-0002).
 */
import type { Draft, Entry, EntryValue } from 'patcms';
import { cms } from './client';

export type CmsCollection = 'places' | 'settings';
export type DraftKey = `${CmsCollection}/${string}`;

/** Debounce window for draft writes, mirroring the patcms reference panel (~600 ms). */
const DRAFT_DEBOUNCE_MS = 500;

interface PendingDraft {
  entry: Entry;
  value: EntryValue;
  timer: ReturnType<typeof setTimeout>;
}

const pending = new Map<DraftKey, PendingDraft>();

/** Build the app-level draft key for an entry id (slug or settings file name). */
export function draftKey(collection: CmsCollection, id: string): DraftKey {
  return `${collection}/${id}`;
}

/** Split an app-level draft key back into its parts; undefined for foreign keys. */
export function parseDraftKey(key: string): { collection: CmsCollection; id: string } | undefined {
  const separator = key.indexOf('/');
  if (separator <= 0) return undefined;
  const collection = key.slice(0, separator);
  const id = key.slice(separator + 1);
  if ((collection !== 'places' && collection !== 'settings') || id.length === 0) return undefined;
  return { collection, id };
}

/** All stored drafts for a collection, indexed by entry id. */
export async function readDrafts(collection: CmsCollection): Promise<Map<string, Draft>> {
  const drafts = await cms.drafts.list(collection);
  return new Map(drafts.map((draft) => [draft.slug, draft]));
}

/** Queue a debounced IndexedDB write for this draft. Never touches the network. */
export function queueDraftSave(entry: Entry, value: EntryValue, key: DraftKey): void {
  const existing = pending.get(key);
  if (existing) clearTimeout(existing.timer);
  const timer = setTimeout(() => {
    pending.delete(key);
    void cms.drafts.save(entry, value);
  }, DRAFT_DEBOUNCE_MS);
  pending.set(key, { entry, value, timer });
}

/** Force any pending debounced write for this key to land immediately. */
export async function flushDraft(key: DraftKey): Promise<void> {
  const existing = pending.get(key);
  if (!existing) return;
  clearTimeout(existing.timer);
  pending.delete(key);
  await cms.drafts.save(existing.entry, existing.value);
}

/** Flush every pending debounced write (used before a full refresh). */
export async function flushAllDrafts(): Promise<void> {
  const keys = [...pending.keys()];
  await Promise.all(keys.map((key) => flushDraft(key)));
}

/** Drop a pending debounced write without persisting it. */
export function cancelDraft(key: DraftKey): void {
  const existing = pending.get(key);
  if (!existing) return;
  clearTimeout(existing.timer);
  pending.delete(key);
}

/** Delete a stored draft (and any pending write for it). */
export async function deleteDraft(key: DraftKey): Promise<void> {
  cancelDraft(key);
  const parsed = parseDraftKey(key);
  if (!parsed) return;
  await cms.drafts.delete({ collection: parsed.collection, slug: parsed.id });
}
