/**
 * Shared types for the CMS layer. Content value types are re-exported from
 * `src/lib/schema.ts` — the single source of truth for the content shape.
 */
export type {
  ContactSettings,
  HomeSettings,
  PhotoFrameContent,
  PhilosophySettings,
  PlaceContent as PlaceValue,
} from '../lib/schema';

/** Boot / session state of the CMS layer. */
export type CmsStatus = 'booting' | 'signed-out' | 'signed-in' | 'error';

/** Which settings singleton a call refers to. */
export type SettingsName = 'home' | 'philosophy' | 'contact';

/** Result of a publish (save to GitHub). Conflicts and validation failures are values, never throws. */
export type PublishResult =
  | { status: 'saved'; sha?: string }
  | { status: 'noop' }
  | { status: 'conflict'; fields: string[]; current: unknown; local: unknown }
  | { status: 'validation'; issues: Array<{ path: string; message: string }> };

/** Record of the last successful publish in this session. */
export interface PublishInfo {
  sha?: string;
  url?: string;
  at: string;
}

/** One commit in an entry's history, newest first (patcms `Revision`). */
export interface PlaceRevision {
  commitSha: string;
  message: string;
  authoredAt?: string;
  authorName?: string;
}

/** Result of an all-or-nothing bulk publish (patcms `saveMany`). */
export type BulkPublishResult =
  | { status: 'saved'; sha?: string; count: number }
  | { status: 'noop'; count: number }
  | {
      status: 'conflict';
      conflicts: Array<{ id: string; path: string; current?: unknown }>;
    }
  | { status: 'validation'; issues: Array<{ path: string; message: string }> };

/** Result of restoring an older version of an entry. */
export type RestorePlaceResult =
  | { status: 'restored'; sha?: string }
  | { status: 'noop' }
  | { status: 'conflict'; current: unknown }
  | { status: 'validation'; issues: Array<{ path: string; message: string }> };
