import { test } from 'vitest';
import assert from 'node:assert/strict';
import {
  calculateAtlasMetrics,
  filterPlaces,
  reorderFrames,
  formatCoordinates,
  type PlaceWithId,
} from './adminRules';
import type { PhotoFrameContent } from './schema';

const mockPlaces: PlaceWithId[] = [
  {
    id: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    coordinatesText: '34.1526° N, 77.5771° E',
    lat: 34.1526,
    lng: 77.5771,
    mapX: 60.5,
    mapY: 37,
    status: 'published',
    dispatchNumber: 14,
    category: 'High Altitude',
    oneLineFragment: 'Six mornings above 4,000m.',
    narrativeStory: 'Thin air that tastes of dry granite...',
    heroImage: 'https://example.com/ladakh.jpg',
    introLines: ['Thin air that tastes of dry granite'],
    frames: [
      { id: 'f1', url: '1.jpg', caption: 'Monastery' },
      { id: 'f2', url: '2.jpg', caption: 'Pass' },
    ],
  },
  {
    id: 'faroe',
    name: 'Faroe Islands',
    country: 'North Atlantic',
    coordinatesText: '62.27° N, 6.78° W',
    lat: 62.27,
    lng: -6.78,
    mapX: 42.4,
    mapY: 16.5,
    status: 'draft',
    dispatchNumber: 15,
    category: 'Coastlines',
    oneLineFragment: 'Kalsoy lighthouse under mist',
    narrativeStory: 'Sea cliffs...',
    heroImage: 'https://example.com/faroe.jpg',
    introLines: ['Sea cliff lighthouse'],
    frames: [
      { id: 'f3', url: '3.jpg', caption: 'Cliff' },
    ],
  },
];

test('calculateAtlasMetrics computes counts correctly', () => {
  const metrics = calculateAtlasMetrics(mockPlaces);
  assert.equal(metrics.publishedCount, 1);
  assert.equal(metrics.draftCount, 1);
  assert.equal(metrics.totalPhotosCount, 3);
});

test('filterPlaces filters by query and status', () => {
  const publishedOnly = filterPlaces(mockPlaces, '', 'published');
  assert.equal(publishedOnly.length, 1);
  assert.equal(publishedOnly[0].id, 'ladakh');

  const draftOnly = filterPlaces(mockPlaces, '', 'draft');
  assert.equal(draftOnly.length, 1);
  assert.equal(draftOnly[0].id, 'faroe');

  const searchLadakh = filterPlaces(mockPlaces, 'India', 'all');
  assert.equal(searchLadakh.length, 1);
  assert.equal(searchLadakh[0].id, 'ladakh');

  const categoryFiltered = filterPlaces(mockPlaces, '', 'all', 'Coastlines');
  assert.equal(categoryFiltered.length, 1);
  assert.equal(categoryFiltered[0].id, 'faroe');
});

test('reorderFrames shifts items correctly', () => {
  const frames: PhotoFrameContent[] = [
    { id: '1', url: 'a', caption: 'A' },
    { id: '2', url: 'b', caption: 'B' },
    { id: '3', url: 'c', caption: 'C' },
  ];
  const reordered = reorderFrames(frames, 0, 2);
  assert.equal(reordered[0].id, '2');
  assert.equal(reordered[1].id, '3');
  assert.equal(reordered[2].id, '1');
});

test('reorderFrames ignores out-of-bounds moves', () => {
  const frames: PhotoFrameContent[] = [{ id: '1', url: 'a', caption: 'A' }];
  assert.equal(reorderFrames(frames, -1, 0), frames);
  assert.equal(reorderFrames(frames, 0, 3), frames);
});

test('formatCoordinates returns formatted string', () => {
  const str = formatCoordinates(34.1526, 77.5771);
  assert.equal(str, '34.1526° N, 77.5771° E');
  const southWest = formatCoordinates(-12.3456, -45.6789);
  assert.equal(southWest, '12.3456° S, 45.6789° W');
});
