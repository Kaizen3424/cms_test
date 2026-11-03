/**
 * Admin media-preview source registry.
 *
 * An uploaded image does not exist at its public `/images/...` URL until the
 * commit lands and the deployment that serves it finishes — and in local dev
 * `public/images` is never touched by an upload. Pointing a preview straight at
 * the public URL therefore produced a 404 and the "Not on live site" badge right
 * after a successful upload.
 *
 * This registry keeps a preview object URL per media path:
 *  - an upload registers the exact bytes the user picked (instant, no network),
 *  - a reload before the deploy falls back to reading the committed blob from
 *    the repository,
 *  - every preview component bound to the same path re-renders together.
 *
 * Pure DOM + promise logic only, so it can be unit-tested without React.
 */

/** Sentinel snapshot value: "the repository read failed for this path". */
export const PREVIEW_FAILED = '\u0000preview-failed';

const previewUrls = new Map<string, string>();
const previewFailures = new Set<string>();
const previewPending = new Map<string, Promise<void>>();
const previewListeners = new Set<() => void>();

function emitPreviewChange(): void {
  for (const listener of previewListeners) listener();
}

/** Subscribe to registry changes; returns an unsubscribe function. */
export function subscribePreview(listener: () => void): () => void {
  previewListeners.add(listener);
  return () => {
    previewListeners.delete(listener);
  };
}

/**
 * Repository media path for a field value, or `null` when the value is not a
 * repository path (remote URL, protocol-relative URL, inline data URL).
 */
export function mediaRepoPath(src: string | undefined): string | null {
  if (!src || src.startsWith('data:')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('//')) return null;
  const clean = src.split(/[?#]/, 1)[0];
  return clean.startsWith('/') ? clean : null;
}

/** Current snapshot for a path: object URL, failure sentinel, or empty. */
export function previewSnapshot(key: string): string {
  if (!key) return '';
  const url = previewUrls.get(key);
  if (url) return url;
  return previewFailures.has(key) ? PREVIEW_FAILED : '';
}

/** True when the path is known to be unreadable from the repository. */
export function isPreviewFailed(key: string): boolean {
  return previewFailures.has(key);
}

/** Remember the just-uploaded bytes so previews never wait for a deploy. */
export function rememberUploadedPreview(publicPath: string, file: Blob): void {
  const key = mediaRepoPath(publicPath);
  if (!key) return;
  const previous = previewUrls.get(key);
  previewUrls.set(key, URL.createObjectURL(file));
  previewFailures.delete(key);
  previewPending.delete(key);
  emitPreviewChange();
  // Revoke late: the previous URL may still be painted by an <img> that is
  // about to be swapped for the new one.
  if (previous) {
    setTimeout(() => URL.revokeObjectURL(previous), 60_000);
  }
}

/**
 * Read a committed media file from the repository (idempotent per path).
 * Marks the path as failed when the blob cannot be read, so the UI can show
 * its explicit "Not on live site" state instead of spinning forever.
 */
export async function loadRepoPreview(
  key: string,
  fetchBlob: (publicPath: string) => Promise<Blob>,
): Promise<void> {
  if (previewUrls.has(key) || previewFailures.has(key)) return;
  const inflight = previewPending.get(key);
  if (inflight) {
    await inflight.catch(() => undefined);
    return;
  }
  const task = (async () => {
    try {
      const blob = await fetchBlob(key);
      if (blob.size === 0) throw new Error('empty media blob');
      // A fresh upload may have landed while this read was in flight.
      if (!previewUrls.has(key)) {
        previewUrls.set(key, URL.createObjectURL(blob));
        previewFailures.delete(key);
      }
    } catch {
      // A local preview may have arrived meanwhile — then this is not a failure.
      if (!previewUrls.has(key)) previewFailures.add(key);
    } finally {
      previewPending.delete(key);
      emitPreviewChange();
    }
  })();
  previewPending.set(key, task);
  await task;
}

/** Forget a failure so the next attempt tries the repository again. */
export function clearPreviewFailure(key: string): void {
  if (previewFailures.delete(key)) emitPreviewChange();
}

/** Test-only: wipe all registry state. */
export function resetPreviewRegistry(): void {
  for (const url of previewUrls.values()) URL.revokeObjectURL(url);
  previewUrls.clear();
  previewFailures.clear();
  previewPending.clear();
}
