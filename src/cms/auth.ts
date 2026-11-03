/**
 * PAT sign-in / sign-out / session restore.
 *
 * Security contract (patcms ADR-0002):
 * - The token is typed into the sign-in form and handed straight to
 *   `cms.auth.signIn(token, { remember })`. The provider holds it in memory and,
 *   only when `remember` is true, persists it through the IndexedDB token store
 *   wired in `client.ts`. Session-only sign-ins stay in memory for the tab life.
 * - The token is never placed in a URL, query string, redirect, log line, or
 *   build environment. This module never reads or returns it.
 * - `restore()` re-probes a persisted token on boot; a failed probe wipes the
 *   stored token and throws, which the app answers with the sign-in form.
 */
import { isCMSError } from 'patcms';
import { cms } from './client';

/** Probe the token, adopt the session, and persist it only when `remember` is true. */
export async function signIn(token: string, remember: boolean): Promise<void> {
  await cms.auth.signIn(token, { remember });
}

/** Wipe the in-memory session and any persisted token. Drafts are kept (ADR-0002). */
export async function signOut(): Promise<void> {
  await cms.auth.signOut();
}

/**
 * Boot-time restore of a remembered session. Returns true when a session is
 * live; false when nothing is stored. Throws when a stored token fails the
 * re-probe (it has already been wiped by patcms at that point).
 */
export async function restoreSession(): Promise<boolean> {
  const session = await cms.auth.restore();
  return session !== undefined;
}

/** Subscribe to auth transitions; `signedIn` mirrors `signedIn` / `signedOut` states. */
export function watchAuthStatus(listener: (signedIn: boolean) => void): () => void {
  return cms.auth.onChange((status) => listener(status === 'signedIn'));
}

/** Human-readable text for a CMSError, safe to render. Never logs token material. */
export function describeCmsError(error: unknown): string {
  if (isCMSError(error)) {
    switch (error.code) {
      case 'AUTH_REQUIRED':
        return 'Sign in to continue.';
      case 'AUTH_EXPIRED':
        return 'Your access key lost write access. Sign in again.';
      case 'FORBIDDEN':
        return 'That access key cannot write to this repository. Check its scopes.';
      case 'RATE_LIMIT': {
        const retry = error.retryAt ? ` Try again after ${error.retryAt}.` : '';
        return `GitHub rate limit reached.${retry}`;
      }
      case 'NETWORK':
        return 'Network error reaching GitHub. Check your connection and retry.';
      case 'NOT_FOUND':
        return 'That content file no longer exists on the branch.';
      case 'VALIDATION':
        return 'The content did not pass validation.';
      case 'UNSUPPORTED':
        return 'This operation is not supported for that collection.';
      case 'INVALID_CONFIG':
        return 'The CMS configuration is invalid.';
      default:
        return error.message || 'Unexpected CMS error.';
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Unexpected error.';
}
