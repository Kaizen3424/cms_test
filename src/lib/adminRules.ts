/**
 * Pure admin helpers — ported from the legacy `src/utils/atlasRules.ts` and
 * retyped against the zod schemas in `src/lib/schema.ts` (single source of
 * truth). The legacy module also had `togglePlaceStatus`, which stamped the
 * fake `editedTimeAgo` field the migration removed; the editor now patches
 * `status` directly through the draft API instead.
 *
 * `PlaceWithId` is what the admin screens render: a place's CMS value plus the
 * patcms entry id (the slug), which lives on the entry row, not in the JSON.
 * (The provider's own `PlaceWithId` is the unflattened `{ id, value, hasDraft }`.)
 */
import type { PhotoFrameContent, PlaceContent } from './schema';

export type PlaceWithId = PlaceContent & { id: string };

export interface AtlasMetrics {
  publishedCount: number;
  draftCount: number;
  totalPhotosCount: number;
}

export function calculateAtlasMetrics(places: PlaceWithId[]): AtlasMetrics {
  let publishedCount = 0;
  let draftCount = 0;
  let totalPhotosCount = 0;

  for (const place of places) {
    if (place.status === 'published') {
      publishedCount++;
    } else {
      draftCount++;
    }
    totalPhotosCount += place.frames ? place.frames.length : 0;
  }

  return {
    publishedCount,
    draftCount,
    totalPhotosCount,
  };
}

export function filterPlaces(
  places: PlaceWithId[],
  query: string = '',
  statusFilter: 'all' | 'published' | 'draft' = 'all',
  categoryFilter?: string | null,
): PlaceWithId[] {
  const cleanQuery = query.trim().toLowerCase();

  return places.filter((place) => {
    // Status check
    if (statusFilter !== 'all' && place.status !== statusFilter) {
      return false;
    }

    // Category filter check
    if (categoryFilter && categoryFilter !== 'all') {
      if (place.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }
    }

    // Search query check
    if (!cleanQuery) return true;

    const matchesName = place.name.toLowerCase().includes(cleanQuery);
    const matchesCountry = place.country.toLowerCase().includes(cleanQuery);
    const matchesFragment = place.oneLineFragment.toLowerCase().includes(cleanQuery);
    const matchesCategory = place.category.toLowerCase().includes(cleanQuery);
    const matchesCoords = place.coordinatesText.toLowerCase().includes(cleanQuery);

    return matchesName || matchesCountry || matchesFragment || matchesCategory || matchesCoords;
  });
}

export function reorderFrames(
  frames: PhotoFrameContent[],
  fromIndex: number,
  toIndex: number,
): PhotoFrameContent[] {
  if (fromIndex < 0 || fromIndex >= frames.length || toIndex < 0 || toIndex >= frames.length) {
    return frames;
  }
  const result = [...frames];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
