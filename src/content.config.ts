import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { placeSchema } from './lib/schema';

const places = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './content/places',
    generateId: ({ entry }) => entry.replace(/\.json$/, ''),
  }),
  schema: placeSchema,
});

export const collections = { places };
