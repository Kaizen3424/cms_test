/**
 * The single patcms client instance.
 *
 * - No token is ever set here. Tokens arrive only through `cms.auth.signIn()`
 *   (sign-in form) or `cms.auth.restore()` (persisted store) — never from env
 *   vars, URLs, or build-time injection.
 * - `patcms/web` provides the browser-only IndexedDB stores: remembered tokens
 *   and local drafts survive a reload; without them both would be memory-only.
 * - Construction is offline; no network call happens until an operation runs.
 */
import { createCMS } from 'patcms';
import { createIdbDraftStore, createIdbTokenStore } from 'patcms/web';
import { config } from './config';

export const cms = createCMS({
  config,
  repository: { owner: 'Kaizen3424', repo: 'cms_test', branch: 'main' },
  tokenStore: createIdbTokenStore(),
  drafts: createIdbDraftStore(),
});
