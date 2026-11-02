/**
 * Content collections — the build-time counterpart of the patcms config
 * (src/cms/config.ts). The CMS writes plain JSON into `content/**`; Astro
 * reads those exact files here whenever Cloudflare rebuilds after a save
 * commit. Field names mirror the CMS schemas so new CMS fields can be
 * surfaced by adding them here.
 */
import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const posts = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string(),
    content: z.string(),
    coverImage: z.string().optional(),
    destination: z.string().optional(),
    author: z.string().optional(),
    readingTime: z.string().optional(),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    publishDate: z.string().optional(),
  }),
})

const destinations = defineCollection({
  loader: glob({ pattern: "*.json", base: "./content/destinations" }),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    description: z.string(),
    heroImage: z.string().optional(),
    bestTimeToVisit: z.string().optional(),
    climate: z.string().optional(),
    highlights: z.array(z.string()).optional().default([]),
  }),
})

/** File collections keyed by slug = filename (the CMS folder keys). */
export const collections = { posts, destinations }

/** Site- and author-level singletons live outside collections. */
export type SiteSettings = {
  siteTitle: string
  tagline: string
  heroHeading: string
  heroSubheading: string
  heroImage: string | undefined
  contactEmail: string | undefined
  footerText: string | undefined
  stats: { label: string; value: string }[]
}

export type AuthorProfile = {
  name: string
  role: string
  bio: string
  avatar: string | undefined
  quote: string | undefined
  location: string | undefined
  gear: string | undefined
}
