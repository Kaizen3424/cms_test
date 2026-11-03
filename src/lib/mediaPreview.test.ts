import { beforeEach, test } from 'vitest';
import assert from 'node:assert/strict';
import {
  PREVIEW_FAILED,
  clearPreviewFailure,
  isPreviewFailed,
  loadRepoPreview,
  mediaRepoPath,
  previewSnapshot,
  rememberUploadedPreview,
  resetPreviewRegistry,
  subscribePreview,
} from './mediaPreview';

beforeEach(() => {
  resetPreviewRegistry();
});

test('mediaRepoPath only accepts repository paths', () => {
  assert.equal(mediaRepoPath('/images/ladakh.jpg'), '/images/ladakh.jpg');
  assert.equal(mediaRepoPath('/images/ladakh.jpg?v=2'), '/images/ladakh.jpg');
  assert.equal(mediaRepoPath('https://images.example.com/a.jpg'), null);
  assert.equal(mediaRepoPath('//images.example.com/a.jpg'), null);
  assert.equal(mediaRepoPath('data:image/png;base64,AAA'), null);
  assert.equal(mediaRepoPath(undefined), null);
  assert.equal(mediaRepoPath(''), null);
});

test('an uploaded file registers an instant local preview', () => {
  const blob = new Blob(['bytes'], { type: 'image/jpeg' });
  rememberUploadedPreview('/images/ladakh.jpg', blob);

  const snapshot = previewSnapshot('/images/ladakh.jpg');
  assert.ok(snapshot.startsWith('blob:'), 'expected a local object URL');
  assert.notEqual(snapshot, PREVIEW_FAILED);
  assert.equal(previewSnapshot('/images/other.jpg'), '');
});

test('subscribers are notified when a preview is registered', () => {
  let calls = 0;
  const unsubscribe = subscribePreview(() => {
    calls += 1;
  });
  rememberUploadedPreview('/images/ladakh.jpg', new Blob(['bytes']));
  unsubscribe();
  rememberUploadedPreview('/images/faroe.jpg', new Blob(['bytes']));
  assert.equal(calls, 1, 'unsubscribed listeners must not fire');
});

test('a repository read fills the preview and clears a previous failure', async () => {
  const failing = async () => {
    throw new Error('not found');
  };
  await loadRepoPreview('/images/ladakh.jpg', failing);
  assert.equal(isPreviewFailed('/images/ladakh.jpg'), true);
  assert.equal(previewSnapshot('/images/ladakh.jpg'), PREVIEW_FAILED);

  clearPreviewFailure('/images/ladakh.jpg');
  assert.equal(isPreviewFailed('/images/ladakh.jpg'), false);

  const blob = new Blob(['committed'], { type: 'image/jpeg' });
  await loadRepoPreview('/images/ladakh.jpg', async () => blob);
  assert.ok(previewSnapshot('/images/ladakh.jpg').startsWith('blob:'));
  assert.equal(isPreviewFailed('/images/ladakh.jpg'), false);
});

test('a repository read is idempotent and never overwrites a fresh upload', async () => {
  let calls = 0;
  await loadRepoPreview('/images/ladakh.jpg', async () => {
    calls += 1;
    return new Blob(['committed'], { type: 'image/jpeg' });
  });
  await loadRepoPreview('/images/ladakh.jpg', async () => {
    calls += 1;
    return new Blob(['committed'], { type: 'image/jpeg' });
  });
  assert.equal(calls, 1, 'the blob must be read once per path');

  const uploaded = previewSnapshot('/images/ladakh.jpg');
  rememberUploadedPreview('/images/ladakh.jpg', new Blob(['newer']));
  assert.notEqual(previewSnapshot('/images/ladakh.jpg'), uploaded);
});

test('an empty blob counts as a failure', async () => {
  await loadRepoPreview('/images/empty.jpg', async () => new Blob([]));
  assert.equal(isPreviewFailed('/images/empty.jpg'), true);
});
