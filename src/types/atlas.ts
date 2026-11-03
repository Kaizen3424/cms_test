export interface PhotoFrame {
  id: string;
  url: string;
  caption: string;
  locationDetail?: string;
  aspect?: '4/3' | '3/4' | '16/9' | '1/1';
  format?: string;
}

export type PlaceStatus = 'published' | 'draft';

export interface Place {
  id: string;
  name: string;
  country: string;
  region?: string;
  coordinatesText: string;
  lat: number;
  lng: number;
  mapX: number; // percentage on map projection (0 - 100)
  mapY: number; // percentage on map projection (0 - 100)
  status: PlaceStatus;
  dispatchNumber: number;
  category: 'High Altitude' | 'Coastlines' | 'Quiet Sanctuaries' | 'Highlands' | 'Deserts';
  oneLineFragment: string;
  narrativeStory: string;
  heroImage: string;
  thumbnailImage: string;
  editedTimeAgo: string;
  frames: PhotoFrame[];
  introLines: string[];
  subtitle?: string;
}

export type ViewMode =
  | 'home'
  | 'philosophy'
  | 'place'
  | 'contact'
  | 'admin-places'
  | 'admin-home'
  | 'admin-pages'
  | 'admin-editor';

export interface AtlasMetrics {
  publishedCount: number;
  draftCount: number;
  totalPhotosCount: number;
}

export interface HomePageSettings {
  // Editorial Manifesto Section
  manifestoTag: string;
  manifestoTitle: string;
  manifestoBody: string;
  manifestoCtaText: string;

  // Curated Places Section
  curatedBadge: string;
  curatedTitle: string;
  curatedSubtitle: string;
  curatedPlaceIds: string[];

  // Promotional Banner / Offers
  offerBannerEnabled: boolean;
  offerBannerBadge: string;
  offerBannerTitle: string;
  offerBannerDescription: string;
  offerBannerCtaText: string;
  offerBannerCtaLink: string;
}

export interface PhilosophyPrinciple {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface PhilosophySettings {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  manifestoParagraphs: string[];
  principles: PhilosophyPrinciple[];
  interludeImageUrl: string;
  interludeTag: string;
  interludeLocation: string;
  interludeFilmNote: string;
  pullQuote: string;
  closingHeadline: string;
  closingSubtext: string;
}

export interface FieldOutpost {
  id: string;
  name: string;
  address: string;
}

export interface ContactSettings {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  formSubtitle: string;
  hqDeskTitle: string;
  inquiryEmail: string;
  tollFreePhone: string;
  internationalPhone: string;
  operatingHours: string;
  liveMonitoringNote: string;
  outposts: FieldOutpost[];
  brandPromiseTitle: string;
  brandPromises: string[];
}
