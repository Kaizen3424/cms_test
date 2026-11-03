import { z } from 'astro/zod';

export const photoFrameSchema = z.object({
  id: z.string(),
  url: z.string(),
  caption: z.string(),
  locationDetail: z.string().optional(),
  aspect: z.enum(['4/3', '3/4', '16/9', '1/1']).optional(),
  format: z.string().optional(),
});

export const placeCategories = [
  'High Altitude',
  'Coastlines',
  'Quiet Sanctuaries',
  'Highlands',
  'Deserts',
] as const;

export const placeSchema = z.object({
  name: z.string(),
  country: z.string(),
  region: z.string().optional(),
  coordinatesText: z.string(),
  lat: z.number(),
  lng: z.number(),
  mapX: z.number(),
  mapY: z.number(),
  status: z.enum(['published', 'draft']),
  dispatchNumber: z.number().int(),
  category: z.enum(placeCategories),
  oneLineFragment: z.string(),
  narrativeStory: z.string(),
  heroImage: z.string(),
  heroAlt: z.string().optional(),
  updatedAt: z.string().optional(),
  subtitle: z.string().optional(),
  introLines: z.array(z.string()),
  frames: z.array(photoFrameSchema),
});

export type PlaceContent = z.infer<typeof placeSchema>;
export type PhotoFrameContent = z.infer<typeof photoFrameSchema>;

export const homeSettingsSchema = z.object({
  manifestoTag: z.string(),
  manifestoTitle: z.string(),
  manifestoBody: z.string(),
  manifestoCtaText: z.string(),
  curatedBadge: z.string(),
  curatedTitle: z.string(),
  curatedSubtitle: z.string(),
  curatedPlaceIds: z.array(z.string()),
  offerBannerEnabled: z.boolean(),
  offerBannerBadge: z.string(),
  offerBannerTitle: z.string(),
  offerBannerDescription: z.string(),
  offerBannerCtaText: z.string(),
  offerBannerCtaLink: z.string(),
});

export const philosophyPrincipleSchema = z.object({
  id: z.string(),
  num: z.string(),
  title: z.string(),
  description: z.string(),
});

export const philosophySettingsSchema = z.object({
  badge: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  manifestoParagraphs: z.array(z.string()),
  principles: z.array(philosophyPrincipleSchema),
  interludeImageUrl: z.string(),
  interludeTag: z.string(),
  interludeLocation: z.string(),
  interludeFilmNote: z.string(),
  pullQuote: z.string(),
  closingHeadline: z.string(),
  closingSubtext: z.string(),
});

export const fieldOutpostSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
});

export const contactSettingsSchema = z.object({
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
  formTitle: z.string(),
  formSubtitle: z.string(),
  hqDeskTitle: z.string(),
  inquiryEmail: z.string(),
  tollFreePhone: z.string(),
  internationalPhone: z.string(),
  operatingHours: z.string(),
  liveMonitoringNote: z.string(),
  outposts: z.array(fieldOutpostSchema),
  brandPromiseTitle: z.string(),
  brandPromises: z.array(z.string()),
});

export type HomeSettings = z.infer<typeof homeSettingsSchema>;
export type PhilosophySettings = z.infer<typeof philosophySettingsSchema>;
export type ContactSettings = z.infer<typeof contactSettingsSchema>;
