/**
 * The Auto-push preference, shared by every admin screen.
 *
 * Auto-push commits a draft to the repository ~2.5s after its last edit (the
 * admin shell's AutoPublishAgent), and each commit triggers a Cloudflare
 * Workers build of the live site. The preference lives in localStorage so it
 * survives reloads; a module-level store keeps every `useAutoPushEnabled`
 * consumer in sync without prop drilling.
 *
 * Default is ON — that is the point of the feature — and turning it off falls
 * back to the classic flow: edits stay local drafts until Publish is pressed.
 */
import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'atlas:auto-push';

type Listener = () => void;

const listeners = new Set<Listener>();

function readInitial(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    // Storage unavailable (private mode, etc.) — default on for the session.
    return true;
  }
}

let enabled = readInitial();

export function getAutoPushEnabled(): boolean {
  return enabled;
}

export function setAutoPushEnabled(next: boolean): void {
  if (next === enabled) return;
  enabled = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
  } catch {
    // The in-memory value still applies for this session.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** `[enabled, setEnabled]` for the auto-push preference, synced across screens. */
export function useAutoPushEnabled(): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(subscribe, getAutoPushEnabled, () => true);
  return [value, setAutoPushEnabled];
}
