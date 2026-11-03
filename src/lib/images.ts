import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ImageSet {
  width: number;
  height: number;
  avif: Record<string, string>;
  jpg: Record<string, string>;
  fallback: string;
}

interface ImageManifest {
  generatedAt?: string;
  byId: Record<string, ImageSet>;
  urlToId: Record<string, string>;
}

let manifest: ImageManifest | null | undefined;

function loadManifest(): ImageManifest | null {
  if (manifest !== undefined) return manifest;
  try {
    const file = join(process.cwd(), 'src', 'data', 'image-manifest.json');
    manifest = JSON.parse(readFileSync(file, 'utf8')) as ImageManifest;
  } catch {
    manifest = null;
  }
  return manifest;
}

/**
 * Stored content values look like `/images/library/<id>/<id>-1600.jpg`.
 * The directory name is the stable asset id used by the manifest.
 */
export function idFromPath(src: string): string | null {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return null;
  const segments = src.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  return segments[segments.length - 2] ?? null;
}

export function getImageSet(src: string): ImageSet | null {
  const store = loadManifest();
  if (!store || !src) return null;
  const id = idFromPath(src);
  if (id && store.byId[id]) return store.byId[id];
  const mapped = store.urlToId[src];
  if (mapped && store.byId[mapped]) return store.byId[mapped];
  return null;
}

export function sortedVariants(map: Record<string, string> | undefined, widths?: number[]) {
  if (!map) return [];
  return Object.entries(map)
    .map(([width, url]) => ({ width: Number(width), url }))
    .filter((entry) => Number.isFinite(entry.width))
    .filter((entry) => !widths || widths.includes(entry.width))
    .sort((a, b) => a.width - b.width);
}

export function toSrcset(variants: Array<{ width: number; url: string }>): string {
  return variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
}
