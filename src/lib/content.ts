import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  contactSettingsSchema,
  homeSettingsSchema,
  philosophySettingsSchema,
  type ContactSettings,
  type HomeSettings,
  type PhilosophySettings,
} from './schema';

const CONTENT_ROOT = join(process.cwd(), 'content', 'settings');

function readJson<T>(file: string, parse: (value: unknown) => T): T {
  const raw = readFileSync(join(CONTENT_ROOT, file), 'utf8');
  try {
    return parse(JSON.parse(raw));
  } catch (error) {
    throw new Error(`Invalid content file content/settings/${file}: ${(error as Error).message}`);
  }
}

let homeCache: HomeSettings | undefined;
let philosophyCache: PhilosophySettings | undefined;
let contactCache: ContactSettings | undefined;

export function getHomeSettings(): HomeSettings {
  homeCache ??= readJson('home.json', (v) => homeSettingsSchema.parse(v));
  return homeCache;
}

export function getPhilosophySettings(): PhilosophySettings {
  philosophyCache ??= readJson('philosophy.json', (v) => philosophySettingsSchema.parse(v));
  return philosophyCache;
}

export function getContactSettings(): ContactSettings {
  contactCache ??= readJson('contact.json', (v) => contactSettingsSchema.parse(v));
  return contactCache;
}
