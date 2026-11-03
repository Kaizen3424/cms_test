/**
 * Shared admin primitives — toasts, the publish/conflict/validation flow,
 * image fields backed by patcms media upload, and the small style constants
 * every admin screen shares. The visual language is ported 1:1 from the
 * legacy Atlas admin views (#f7f6f2 canvas, #e60023 accent, editorial cards).
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
import { AlertTriangle, Check, Loader2, RotateCcw, Upload, X } from 'lucide-react';
import { useCms } from '../../../cms/provider';
import type { PlaceValue, PublishResult, SettingsName } from '../../../cms/provider';
import { parseDraftKey } from '../../../cms/drafts';

/** Mirrors `placeCategories` in src/lib/schema.ts (kept local to avoid bundling zod). */
export const PLACE_CATEGORIES = [
  'High Altitude',
  'Coastlines',
  'Quiet Sanctuaries',
  'Highlands',
  'Deserts',
] as const;

/* --------------------------------- styles --------------------------------- */

export const cardClass =
  'bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)]';
export const labelClass = 'block text-xs font-bold text-[#2a2a26] uppercase tracking-wider';
export const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-sm font-medium text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]';
export const inputMonoClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-[#fafaf8] border border-[#dcdcd5] text-xs font-mono text-[#1a1a1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]';

/* ------------------------------ upload errors ----------------------------- */

/** True when patcms rejected the upload because that filename already exists. */
function isConflictError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'CONFLICT'
  );
}

/** Plain-English text for an upload failure — never leaks the raw CMS message. */
function describeUploadError(error: unknown, filename: string): string {
  if (isConflictError(error)) {
    return `"${filename}" already exists in the media library and was not replaced.`;
  }
  const code =
    typeof error === 'object' && error !== null ? (error as { code?: unknown }).code : undefined;
  switch (code) {
    case 'VALIDATION':
      return `"${filename}" could not be uploaded. Use a PNG, JPG, or WebP under 90 MB (SVG files are not allowed).`;
    case 'AUTH_EXPIRED':
    case 'AUTH_REQUIRED':
      return 'Your session expired — sign in again to upload.';
    case 'FORBIDDEN':
      return 'That access key cannot write to this repository. Check its scopes.';
    case 'RATE_LIMIT':
      return 'GitHub rate limit reached. Wait a moment and retry.';
    case 'NETWORK':
      return 'Network error while uploading. Check your connection and retry.';
    default:
      return error instanceof Error ? error.message : 'Upload failed — try again.';
  }
}

/* --------------------------------- toasts --------------------------------- */

export type ToastTone = 'info' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast>(() => {});
let toastSequence = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => clearTimeout(timer));
      pending.clear();
    };
  }, []);

  const showToast = useCallback<ShowToast>((message, tone = 'info') => {
    toastSequence += 1;
    const id = toastSequence;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    const timer = setTimeout(() => {
      timers.current.delete(id);
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3800);
    timers.current.set(id, timer);
  }, []);

  const dotClass = (tone: ToastTone): string =>
    tone === 'success' ? 'bg-emerald-500' : tone === 'error' ? 'bg-[#e60023]' : 'bg-[#f7f6f2]';

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2 bg-[#1a1a18] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-medium border border-white/10"
          >
            <span className={`w-2 h-2 rounded-full ${dotClass(toast.tone)}`}></span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

/* ------------------------------ publish flow ------------------------------ */

export interface ConflictInfo {
  /** Draft key of the conflicting entry, e.g. `places/ladakh`. */
  key: string;
  fields: string[];
  current: Record<string, unknown>;
  local: Record<string, unknown>;
}

export interface ValidationInfo {
  issues: Array<{ path: string; message: string }>;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? { ...(value as Record<string, unknown>) } : {};
}

export interface PublishFlow {
  busy: boolean;
  conflict: ConflictInfo | null;
  validation: ValidationInfo | null;
  publish(key: string, action: () => Promise<PublishResult>, successMessage: string): Promise<void>;
  resolveConflict(choice: 'keep-mine' | 'load-server'): Promise<void>;
  dismissConflict(): void;
  dismissValidation(): void;
}

/**
 * Runs a `publishPlace` / `publishSettings` call and routes the four
 * `PublishResult` outcomes to the right UX: success/noop toasts, a validation
 * dialog listing issue paths, or a conflict dialog with keep/discard actions.
 * Transport failures throw out of the provider and land here as error toasts.
 */
function usePublishFlowState(): PublishFlow {
  const cms = useCms();
  const showToast = useToast();
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [validation, setValidation] = useState<ValidationInfo | null>(null);

  const publish = useCallback(
    async (key: string, action: () => Promise<PublishResult>, successMessage: string) => {
      setBusy(true);
      try {
        const result = await action();
        if (result.status === 'saved') {
          showToast(successMessage, 'success');
        } else if (result.status === 'noop') {
          showToast('No changes to publish', 'info');
        } else if (result.status === 'validation') {
          setValidation({ issues: result.issues });
        } else {
          setConflict({
            key,
            fields: result.fields,
            current: asRecord(result.current),
            local: asRecord(result.local),
          });
        }
      } catch (thrown) {
        showToast(thrown instanceof Error ? thrown.message : 'Publishing failed — try again.', 'error');
      } finally {
        setBusy(false);
      }
    },
    [showToast],
  );

  const resolveConflict = useCallback(
    async (choice: 'keep-mine' | 'load-server') => {
      const active = conflict;
      if (!active) return;
      setConflict(null);
      if (choice === 'load-server') {
        await cms.discardDraft(active.key);
        showToast('Loaded the server version — your local draft was discarded.', 'info');
        return;
      }
      const parsed = parseDraftKey(active.key);
      if (!parsed) return;
      if (parsed.collection === 'places') {
        // Re-apply the full local value on top of the remote base, then retry.
        cms.updatePlaceDraft(parsed.id, active.local as Partial<PlaceValue>);
        await publish(
          active.key,
          () => cms.publishPlace(parsed.id),
          'Published with your changes',
        );
      } else {
        const name = parsed.id as SettingsName;
        cms.updateSettingsDraft(name, active.local);
        await publish(
          active.key,
          () => cms.publishSettings(name),
          'Published with your changes',
        );
      }
    },
    [cms, conflict, publish, showToast],
  );

  const dismissConflict = useCallback(() => setConflict(null), []);
  const dismissValidation = useCallback(() => setValidation(null), []);

  return useMemo(
    () => ({
      busy,
      conflict,
      validation,
      publish,
      resolveConflict,
      dismissConflict,
      dismissValidation,
    }),
    [busy, conflict, validation, publish, resolveConflict, dismissConflict, dismissValidation],
  );
}

const PublishFlowContext = createContext<PublishFlow | null>(null);

/** Provides the single app-wide publish flow. */
export function PublishFlowProvider({ children }: { children: ReactNode }) {
  const flow = usePublishFlowState();
  return <PublishFlowContext.Provider value={flow}>{children}</PublishFlowContext.Provider>;
}

/**
 * The shared publish flow. One instance lives in the `PublishFlowProvider`
 * (AdminApp), so every screen shares one `busy` flag and one
 * conflict/validation state that survives navigation between admin screens.
 */
export function usePublishFlow(): PublishFlow {
  const flow = useContext(PublishFlowContext);
  if (!flow) throw new Error('usePublishFlow must be used within a PublishFlowProvider');
  return flow;
}

/* --------------------------------- dialogs -------------------------------- */

function summarizeValue(value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'string') {
    if (value.length === 0) return '""';
    return value.length > 90 ? `${value.slice(0, 90)}…` : value;
  }
  const json = JSON.stringify(value) ?? '—';
  return json.length > 90 ? `${json.slice(0, 90)}…` : json;
}

export function ConflictDialog({
  conflict,
  onResolve,
  onDismiss,
}: {
  conflict: ConflictInfo;
  onResolve: (choice: 'keep-mine' | 'load-server') => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#f9f9f7] rounded-3xl border border-[#e2dfd7] shadow-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute top-5 right-5 p-2 rounded-full text-[#71716b] hover:text-[#1a1a18] hover:bg-[#eeeee9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faecee] border border-[#e60023]/30 text-[11px] font-bold tracking-[0.18em] text-[#e60023] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e60023]"></span>
              Save conflict
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a18] tracking-tight">The server moved ahead</h2>
            <p className="text-xs text-[#71716b] mt-1 leading-relaxed">
              Someone published changes to <span className="font-mono">{conflict.key}</span> since you
              started editing. Review the affected fields and choose which version wins.
            </p>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {conflict.fields.map((field) => (
              <div key={field} className="p-3 rounded-xl border border-[#e5e5df] bg-white space-y-1">
                <p className="text-xs font-bold text-[#1a1a18] font-mono">{field}</p>
                <p className="text-[11px] text-[#71716b]">
                  <span className="font-semibold text-[#1a1a18]">Server:</span>{' '}
                  {summarizeValue(conflict.current[field])}
                </p>
                <p className="text-[11px] text-[#71716b]">
                  <span className="font-semibold text-[#e60023]">Yours:</span>{' '}
                  {summarizeValue(conflict.local[field])}
                </p>
              </div>
            ))}
            {conflict.fields.length === 0 && (
              <p className="text-xs text-[#71716b]">
                The branch moved, but no modeled field differs — publishing again will reconcile it.
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => onResolve('load-server')}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-[#dadad3] text-[#2b2b27] hover:bg-[#f6f6f2] transition-colors shadow-sm cursor-pointer"
            >
              Load server version
            </button>
            <button
              type="button"
              onClick={() => onResolve('keep-mine')}
              className="px-5 py-2.5 rounded-full bg-[#e60023] hover:bg-[#cc001f] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              Keep my version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ValidationDialog({
  validation,
  onDismiss,
}: {
  validation: ValidationInfo;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#f9f9f7] rounded-3xl border border-[#e2dfd7] shadow-2xl p-6 sm:p-8">
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute top-5 right-5 p-2 rounded-full text-[#71716b] hover:text-[#1a1a18] hover:bg-[#eeeee9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faecee] border border-[#e60023]/30 text-[11px] font-bold tracking-[0.18em] text-[#e60023] uppercase mb-2">
              <AlertTriangle className="w-3 h-3" />
              Validation
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a18] tracking-tight">Fix these before publishing</h2>
            <p className="text-xs text-[#71716b] mt-1">
              The draft is saved, but the repository schema rejected {validation.issues.length}{' '}
              {validation.issues.length === 1 ? 'field' : 'fields'}.
            </p>
          </div>

          <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {validation.issues.map((issue, index) => (
              <li key={`${issue.path}-${index}`} className="p-3 rounded-xl border border-[#e5e5df] bg-white">
                <p className="text-xs font-bold text-[#e60023] font-mono">{issue.path}</p>
                <p className="text-[11px] text-[#55554f] mt-0.5">{issue.message}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onDismiss}
              className="px-5 py-2.5 rounded-full bg-[#1a1a18] hover:bg-[#000] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
            >
              Back to editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- buttons -------------------------------- */

export function PublishButton({
  onClick,
  busy,
  label = 'Publish',
}: {
  onClick: () => void;
  busy: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#e60023] hover:bg-[#cc001f] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-wait"
    >
      <span>{busy ? 'Publishing…' : label}</span>
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
    </button>
  );
}

export function DiscardButton({
  onClick,
  disabled,
  label = 'Discard Draft',
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Revert to the last published version"
      className="px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white border border-[#dadad3] text-[#2b2b27] hover:bg-[#f6f6f2] transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RotateCcw className="w-4 h-4 text-[#70706a]" />
      <span>{label}</span>
    </button>
  );
}

export function DraftPill({ label = 'Draft edits' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[10px] font-bold uppercase tracking-wider text-[#e60023] whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-[#e60023] animate-pulse"></span>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: 'published' | 'draft' }) {
  const isDraft = status === 'draft';
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#e2e3e1] text-xs font-semibold text-[#1a1c1b] shadow-sm whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? 'bg-[#e60023]' : 'bg-emerald-600'}`}></span>
      {isDraft ? 'Draft' : 'Published'}
    </span>
  );
}

/* ------------------------------ media upload ------------------------------ */

export function UploadButton({
  onUploaded,
  disabled,
}: {
  onUploaded: (path: string) => void;
  disabled?: boolean;
}) {
  const cms = useCms();
  const showToast = useToast();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      let path: string;
      try {
        ({ path } = await cms.uploadMedia(file));
      } catch (thrown) {
        // Same filename already exists in the media library — offer a replace.
        if (!isConflictError(thrown)) throw thrown;
        const replace = window.confirm(
          `"${file.name}" already exists in the media library. Replace it with the selected file?\n\n` +
            'Tip: prefer a new filename — browsers may keep showing the old image for a while.',
        );
        if (!replace) return;
        ({ path } = await cms.uploadMedia(file, undefined, { overwrite: true }));
      }
      onUploaded(path);
      showToast('Image uploaded to the media library', 'success');
    } catch (thrown) {
      showToast(describeUploadError(thrown, file.name), 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || disabled}
        title="Upload an image to the media library"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#d2d2ca] bg-white hover:bg-[#f5f5f0] text-xs font-semibold text-[#30302b] transition-colors cursor-pointer flex-shrink-0 disabled:opacity-60 disabled:cursor-wait"
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Upload className="w-3.5 h-3.5 text-[#70706a]" />
        )}
        <span>{uploading ? 'Uploading…' : 'Upload'}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </>
  );
}

/** URL text input + Upload button. Remote URLs remain valid input. */
export function ImageField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className={inputMonoClass}
        />
        <UploadButton onUploaded={onChange} />
      </div>
      {hint && <p className="text-xs text-[#8c8c83]">{hint}</p>}
    </div>
  );
}

/* --------------------------------- helpers -------------------------------- */

/** Relative age of an ISO timestamp, for "Edited …" lines. */
export function timeAgo(iso: string | undefined): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Short wall-clock label for the last-publish record. */
export function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* --------------------------- media preview ---------------------------- */

/**
 * Always-visible image preview that never shows a silent grey box.
 * Every value change triggers a fresh fetch (cache-busted with a version
 * counter) so a stale browser-cached 404 (the deploy-lag poison from the
 * old immutable `/images/*` header rule) can never mask a new image. If
 * the image still fails to load, an explicit "Not on live site" badge
 * appears instead of leaving the placeholder background visible forever.
 */
export function MediaPreview({
  src,
  alt,
  class: className = '',
}: {
  src?: string;
  alt: string;
  class?: string;
}) {
  const [version, setVersion] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    setError(false);
    setVersion((v) => v + 1);
  }, [src]);

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-[#8c8c83]">
        No image yet
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-[#eae9e5] flex flex-col items-center justify-center gap-1 px-1 text-center">
        <span className="text-[10px] font-semibold text-[#71716b] uppercase tracking-wider bg-white px-2 py-1 rounded border border-[#dcdcd5]">
          Not on live site
        </span>
        <button
          type="button"
          onClick={() => {
            setError(false);
            setLoaded(false);
            setVersion((v) => v + 1);
          }}
          className="text-[10px] font-semibold text-[#e60023] hover:underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Cache-bust: every value change fetches a fresh URL, so a browser-cached
  // 404 (from the deploy window after an upload) can never mask the new image.
  // Query strings are ignored by static assets served through Cloudflare Workers.
  const sep = src.startsWith('data:') ? '' : src.includes('?') ? '&' : '?';
  const displaySrc = src.startsWith('data:') ? src : `${src}${sep}v=${version}`;

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-[#f5f5f0] animate-pulse" aria-hidden="true" />
      )}
      {/* Cache-bust: a value change fetches a fresh URL, so a browser-cached
          404 (from the deploy window right after an upload) can never mask
          the new image. Query strings are ignored by the static asset layer. */}
      <img
        src={displaySrc}
        alt={alt}
        onLoad={() => {
          setLoaded(true);
          setError(false);
        }}
        onError={() => setError(true)}
        className={`transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </>
  );
}

/** Collision-safe id for locally created list items (frames, tenets, outposts). */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
