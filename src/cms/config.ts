import * as fields from "@mycms/core"
import { defineCollection, defineConfig, defineFiles, toAdminConfig } from "@mycms/core"
import { z } from "zod"

const media = {
  folder: "public/images",
  publicFolder: "/images",
} as const

// Post Schema
const postSchema = z.object({
  title: fields.string({ label: "Story Title", required: true }),
  slug: fields.slug(),
  excerpt: fields.text({ label: "Excerpt (Short Summary)", required: true }),
  content: fields.text({ label: "Field Notes & Story Content", required: true }),
  coverImage: fields.image({ label: "Cover Photograph", required: false }),
  destination: fields.relation({
    label: "Associated Destination",
    required: false,
    collection: "destinations",
    valueField: "{{slug}}",
    displayFields: ["name"],
  }),
  author: fields.string({ label: "Author Name", required: false, defaultValue: "Maya Lin" }),
  readingTime: fields.string({ label: "Estimated Reading Time", required: false, defaultValue: "5 min read" }),
  featured: fields.boolean({ label: "Featured on Homepage", defaultValue: false }),
  tags: fields.list({
    label: "Topics & Tags",
    required: false,
    field: { name: "tag", schema: fields.string({ label: "Tag" }) },
  }),
  publishDate: fields.datetime({ label: "Publish Date", required: false }),
})

// Destination Schema
const destinationSchema = z.object({
  name: fields.string({ label: "Destination Name", required: true }),
  country: fields.string({ label: "Country", required: true }),
  description: fields.text({ label: "Overview & Character", required: true }),
  heroImage: fields.image({ label: "Hero Landscape", required: false }),
  bestTimeToVisit: fields.string({ label: "Best Season to Visit", required: false }),
  climate: fields.string({ label: "Climate & Weather", required: false }),
  highlights: fields.list({
    label: "Curated Highlights",
    required: false,
    field: { name: "highlight", schema: fields.string({ label: "Highlight" }) },
  }),
})

// Settings Schema
const settingsSchema = z.object({
  siteTitle: fields.string({ label: "Site Title", required: true }),
  tagline: fields.string({ label: "Tagline", required: true }),
  heroHeading: fields.string({ label: "Hero Main Heading", required: true }),
  heroSubheading: fields.text({ label: "Hero Subheading Description", required: true }),
  heroImage: fields.image({ label: "Hero Banner Image", required: false }),
  contactEmail: fields.string({ label: "Contact Email", required: false, format: "email" }),
  footerText: fields.string({ label: "Footer Attribution", required: false }),
  stats: fields.list({
    label: "Homepage Metrics & Stats",
    required: false,
    summary: "{{fields.label}}: {{fields.value}}",
    fields: {
      label: fields.string({ label: "Metric Label", required: true }),
      value: fields.string({ label: "Value / Number", required: true }),
    },
  }),
})

// Author Schema
const authorSchema = z.object({
  name: fields.string({ label: "Explorer Name", required: true }),
  role: fields.string({ label: "Title / Role", required: true }),
  bio: fields.text({ label: "Biography", required: true }),
  avatar: fields.image({ label: "Profile Portrait", required: false }),
  quote: fields.text({ label: "Favorite Travel Philosophy / Quote", required: false }),
  location: fields.string({ label: "Current Location / Base", required: false }),
  gear: fields.string({ label: "Essential Gear & Camera", required: false }),
})

export const travelConfig = defineConfig({
  media,
  collections: [
    defineCollection({
      name: "posts",
      label: "Dispatches & Stories",
      labelSingular: "Story",
      icon: "article",
      folder: "content/posts",
      identifierField: "title",
      summary: "{{title}} ({{readingTime}})",
      previewPath: "/#story-{{slug}}",
      sortableFields: ["publishDate", "title", "readingTime"],
      thumbnail: "coverImage",
      media,
      schema: postSchema,
      decorations: [
        { before: "destination", label: "Classification" },
        { before: "content", label: "Story Text" },
      ],
    }),
    defineCollection({
      name: "destinations",
      label: "Destinations",
      labelSingular: "Destination",
      icon: "explore",
      folder: "content/destinations",
      identifierField: "name",
      summary: "{{name}} ({{country}})",
      previewPath: "/#destination-{{slug}}",
      sortableFields: ["name", "country"],
      thumbnail: "heroImage",
      media,
      schema: destinationSchema,
    }),
    defineFiles({
      name: "site",
      label: "Site & Profile",
      icon: "settings",
      media,
      files: [
        {
          name: "settings",
          label: "Site Settings",
          icon: "tune",
          file: "content/settings.json",
          schema: settingsSchema,
        },
        {
          name: "author",
          label: "Traveler Bio",
          icon: "person",
          file: "content/author.json",
          schema: authorSchema,
        },
      ],
    }),
  ],
})

export const travelAdminConfig = toAdminConfig(travelConfig)
