/**
 * patcms configuration — the admin-side mirror of `src/lib/schema.ts`.
 *
 * Every field here must accept exactly what the zod schema in `src/lib/schema.ts`
 * accepts: same keys, same optionality, same enum options. The two cannot drift
 * because `content/*.json` must pass both (zod at build time, patcms on read/save).
 *
 * Image-bearing fields (`heroImage`, `frames[].url`, `interludeImageUrl`) are
 * intentionally plain `fields.string`, NOT `fields.image`: patcms validates image
 * fields against the configured media folder at the descriptor level regardless of
 * `pattern`, so remote URLs (everything `content/` holds today) would fail with
 * `INVALID_PATH` on every read and save. `fields.string` mirrors `placeSchema`'s
 * `z.string()` exactly. `cms.media.upload()` still returns `/images/...` public
 * paths that are valid values for these fields.
 */
import {
  boolean,
  datetime,
  defineCollection,
  defineConfig,
  defineFile,
  defineFiles,
  list,
  number,
  object,
  select,
  string,
  text,
} from 'patcms';

const placeFrames = list({
  label: 'Photo frames',
  summary: '{{caption}}',
  fields: {
    id: string({ label: 'Frame ID' }),
    url: string({ label: 'Image URL' }),
    caption: string({ label: 'Caption' }),
    locationDetail: string({ label: 'Location detail', required: false }),
    aspect: select({
      label: 'Aspect ratio',
      required: false,
      options: ['4/3', '3/4', '16/9', '1/1'],
    }),
    format: string({ label: 'Film format', required: false }),
  },
});

const places = defineCollection({
  name: 'places',
  label: 'Places',
  labelSingular: 'Place',
  folder: 'content/places',
  identifierField: 'name',
  previewPath: '/place/{{slug}}',
  thumbnail: 'heroImage',
  sortableFields: ['name', 'dispatchNumber'],
  schema: object({
    label: 'Place',
    fields: {
      name: string({ label: 'Name' }),
      country: string({ label: 'Country' }),
      region: string({ label: 'Region', required: false }),
      coordinatesText: string({ label: 'Coordinates' }),
      lat: number({ label: 'Latitude' }),
      lng: number({ label: 'Longitude' }),
      mapX: number({ label: 'Map X' }),
      mapY: number({ label: 'Map Y' }),
      status: select({ label: 'Status', options: ['published', 'draft'] }),
      dispatchNumber: number({ label: 'Dispatch number', int: true }),
      category: select({
        label: 'Category',
        options: ['High Altitude', 'Coastlines', 'Quiet Sanctuaries', 'Highlands', 'Deserts'],
      }),
      oneLineFragment: string({ label: 'One-line fragment' }),
      narrativeStory: text({ label: 'Narrative story' }),
      heroImage: string({ label: 'Hero image' }),
      heroAlt: string({ label: 'Hero alt text', required: false }),
      updatedAt: datetime({ label: 'Updated at', required: false }),
      subtitle: string({ label: 'Subtitle', required: false }),
      introLines: list({
        label: 'Intro lines',
        field: { name: 'line', schema: string({ label: 'Line' }) },
      }),
      frames: placeFrames,
    },
  }),
});

const settings = defineFiles({
  name: 'settings',
  label: 'Site settings',
  files: [
    defineFile('settings', {
      name: 'home',
      label: 'Home',
      file: 'content/settings/home.json',
      schema: object({
        label: 'Home settings',
        fields: {
          manifestoTag: string({ label: 'Manifesto tag' }),
          manifestoTitle: string({ label: 'Manifesto title' }),
          manifestoBody: text({ label: 'Manifesto body' }),
          manifestoCtaText: string({ label: 'Manifesto CTA text' }),
          curatedBadge: string({ label: 'Curated badge' }),
          curatedTitle: string({ label: 'Curated title' }),
          curatedSubtitle: string({ label: 'Curated subtitle' }),
          curatedPlaceIds: list({
            label: 'Curated place IDs',
            field: { name: 'id', schema: string({ label: 'Place ID' }) },
          }),
          offerBannerEnabled: boolean({ label: 'Offer banner enabled' }),
          offerBannerBadge: string({ label: 'Offer banner badge' }),
          offerBannerTitle: string({ label: 'Offer banner title' }),
          offerBannerDescription: text({ label: 'Offer banner description' }),
          offerBannerCtaText: string({ label: 'Offer banner CTA text' }),
          offerBannerCtaLink: string({ label: 'Offer banner CTA link' }),
        },
      }),
    }),
    defineFile('settings', {
      name: 'philosophy',
      label: 'Philosophy',
      file: 'content/settings/philosophy.json',
      schema: object({
        label: 'Philosophy settings',
        fields: {
          badge: string({ label: 'Badge' }),
          heroTitle: string({ label: 'Hero title' }),
          heroSubtitle: string({ label: 'Hero subtitle' }),
          manifestoParagraphs: list({
            label: 'Manifesto paragraphs',
            field: { name: 'paragraph', schema: text({ label: 'Paragraph' }) },
          }),
          principles: list({
            label: 'Principles',
            summary: '{{num}} — {{title}}',
            fields: {
              id: string({ label: 'ID' }),
              num: string({ label: 'Number' }),
              title: string({ label: 'Title' }),
              description: text({ label: 'Description' }),
            },
          }),
          interludeImageUrl: string({ label: 'Interlude image URL' }),
          interludeTag: string({ label: 'Interlude tag' }),
          interludeLocation: string({ label: 'Interlude location' }),
          interludeFilmNote: string({ label: 'Interlude film note' }),
          pullQuote: text({ label: 'Pull quote' }),
          closingHeadline: string({ label: 'Closing headline' }),
          closingSubtext: text({ label: 'Closing subtext' }),
        },
      }),
    }),
    defineFile('settings', {
      name: 'contact',
      label: 'Contact',
      file: 'content/settings/contact.json',
      schema: object({
        label: 'Contact settings',
        fields: {
          badge: string({ label: 'Badge' }),
          title: string({ label: 'Title' }),
          subtitle: string({ label: 'Subtitle' }),
          formTitle: string({ label: 'Form title' }),
          formSubtitle: string({ label: 'Form subtitle' }),
          hqDeskTitle: string({ label: 'HQ desk title' }),
          inquiryEmail: string({ label: 'Inquiry email' }),
          tollFreePhone: string({ label: 'Toll-free phone' }),
          internationalPhone: string({ label: 'International phone' }),
          operatingHours: string({ label: 'Operating hours' }),
          liveMonitoringNote: string({ label: 'Live monitoring note' }),
          outposts: list({
            label: 'Field outposts',
            summary: '{{name}}',
            fields: {
              id: string({ label: 'ID' }),
              name: string({ label: 'Name' }),
              address: string({ label: 'Address' }),
            },
          }),
          brandPromiseTitle: string({ label: 'Brand promise title' }),
          brandPromises: list({
            label: 'Brand promises',
            field: { name: 'promise', schema: string({ label: 'Promise' }) },
          }),
        },
      }),
    }),
  ],
});

export const config = defineConfig({
  site: { name: 'Atlas', url: 'https://atlas.example.workers.dev' },
  // `deploy.contexts` is intentionally omitted (verified against patcms
  // dist-types/status/classify.d.ts + Cloudflare docs, 2026-11): check runs are
  // the PRIMARY deploy-status source and need no context string, and Workers
  // Builds posts check runs on GitHub (commit statuses are GitLab-only).
  // `contexts` only gates the commit-status fallback, so absent = fallback off,
  // while the check-run path still works. Fine-grained PATs often cannot read
  // check-runs; the auth probe's `checksRead` capability gates the UI.
  media: { folder: 'public/images', publicFolder: '/images' },
  collections: [places, settings],
});
