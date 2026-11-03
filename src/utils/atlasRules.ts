import { Place, PhotoFrame, AtlasMetrics, PlaceStatus } from '../types/atlas';

export function calculateAtlasMetrics(places: Place[]): AtlasMetrics {
  let publishedCount = 0;
  let draftCount = 0;
  let totalPhotosCount = 0;

  for (const place of places) {
    if (place.status === 'published') {
      publishedCount++;
    } else {
      draftCount++;
    }
    totalPhotosCount += (place.frames ? place.frames.length : 0);
  }

  return {
    publishedCount,
    draftCount,
    totalPhotosCount,
  };
}

export function filterPlaces(
  places: Place[],
  query: string = '',
  statusFilter: 'all' | 'published' | 'draft' = 'all',
  categoryFilter?: string | null
): Place[] {
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
  frames: PhotoFrame[],
  fromIndex: number,
  toIndex: number
): PhotoFrame[] {
  if (fromIndex < 0 || fromIndex >= frames.length || toIndex < 0 || toIndex >= frames.length) {
    return frames;
  }
  const result = [...frames];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
}

export function togglePlaceStatus(place: Place): Place {
  const newStatus: PlaceStatus = place.status === 'published' ? 'draft' : 'published';
  return {
    ...place,
    status: newStatus,
    editedTimeAgo: 'Just now',
  };
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}
