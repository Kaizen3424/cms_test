const SITE_NAME = 'Atlas — Photography Travel Explorer';
const SITE_URL = 'https://atlas.example.workers.dev';

export function absoluteUrl(path: string, site?: URL | string): string {
  const base = site ? String(site) : SITE_URL;
  return new URL(path, base).href;
}

export function organizationJsonLd(site?: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: SITE_NAME,
    url: absoluteUrl('/', site),
    description:
      'An expedition journal and cartographic explorer cataloging slow travel, high-altitude landscapes, and medium-format photo essays.',
  };
}

interface PlaceJsonLdInput {
  name: string;
  country: string;
  subtitle?: string;
  narrativeStory: string;
  heroImage: string;
  updatedAt?: string;
  site?: URL | string;
  slug: string;
}

export function placeJsonLd(input: PlaceJsonLdInput) {
  const url = absoluteUrl(`/place/${input.slug}`, input.site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${input.name}, ${input.country}`,
    description: input.subtitle ?? input.narrativeStory.slice(0, 180),
    image: [absoluteUrl(input.heroImage, input.site)],
    ...(input.updatedAt ? { dateModified: input.updatedAt } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/', input.site) },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  site?: URL | string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}
