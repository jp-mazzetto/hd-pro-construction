import {
  DIRECT_SMS_PHONE,
  LAWN_MAINTENANCE_PLANS,
  SERVICES,
  SITE_NAME,
  SITE_URL,
  instagramProfileUrl,
} from "./site";

export const INDEXABLE_ROUTES = ["/", "/services", "/plans"] as const;
export const PRIVATE_ROUTE_PREFIXES = ["/dashboard", "/admin"] as const;
export const NOINDEX_EXACT_ROUTES = ["/checkout", "/contract", "/success", "/cancel"] as const;

export const INDEX_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex, nofollow";
export const DEFAULT_OG_IMAGE_PATH = "/og-image.jpg";
export const DEFAULT_LOCALE = "en_US";

const BUSINESS_ADDRESS = {
  streetAddress: "Greater Boston Area",
  addressLocality: "Boston",
  addressRegion: "MA",
  postalCode: "02108",
  addressCountry: "US",
} as const;

const GEO_COORDINATES = {
  latitude: 42.3601,
  longitude: -71.0589,
} as const;

type JsonLdValue = Record<string, unknown>;

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  robots?: string;
  imagePath?: string;
  imageAlt?: string;
  locale?: string;
  ogType?: "website" | "article";
  structuredData?: JsonLdValue[];
}

export interface PrerenderHeadElement {
  type: "meta" | "link" | "script";
  props: Record<string, string>;
  children?: string;
}

interface PrerenderHead {
  lang: string;
  title: string;
  elements: Set<PrerenderHeadElement>;
}

const normalizePathname = (pathname: string): string => {
  if (!pathname) {
    return "/";
  }

  if (pathname === "/") {
    return pathname;
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
};

const buildCanonicalUrl = (path: string) => {
  const normalizedPath = normalizePathname(path);
  return normalizedPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
};

const stripRouteSlashes = (path: string) =>
  path.replace(/^\/+|\/+$/g, "");

const servicesTitleList = SERVICES.map((service) => service.title).join(", ");
const servicesKeywordList = SERVICES.map((service) =>
  `${service.title.toLowerCase()} service Boston`,
);
const plansKeywordList = LAWN_MAINTENANCE_PLANS.map((plan) =>
  `${plan.tier.toLowerCase()} lawn plan Boston`,
);

const LOCAL_BUSINESS_SCHEMA: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
  logo: `${SITE_URL}/logo.webp`,
  telephone: DIRECT_SMS_PHONE,
  description:
    "HD Pro Construction INC is an on-site contractor serving Greater Boston with masonry, excavation, landscaping and recurring outdoor maintenance.",
  address: {
    "@type": "PostalAddress",
    ...BUSINESS_ADDRESS,
  },
  geo: {
    "@type": "GeoCoordinates",
    ...GEO_COORDINATES,
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Massachusetts",
  },
  sameAs: [instagramProfileUrl],
  priceRange: "$$",
};

const SERVICES_OFFER_CATALOG_SCHEMA: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Construction and Outdoor Services",
  itemListElement: SERVICES.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.title,
      description: service.desc,
      areaServed: "Massachusetts",
      provider: {
        "@type": "HomeAndConstructionBusiness",
        name: SITE_NAME,
      },
    },
  })),
};

const parsePriceLabel = (priceLabel: string): string =>
  priceLabel.replace(/[^0-9.]/g, "");

const LAWN_PLAN_OFFERS_SCHEMA: JsonLdValue = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Lawn Cutting and Recurring Yard Maintenance",
  provider: {
    "@type": "HomeAndConstructionBusiness",
    name: SITE_NAME,
  },
  areaServed: "Massachusetts",
  offers: LAWN_MAINTENANCE_PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.tier,
    priceCurrency: "USD",
    price: parsePriceLabel(plan.priceLabel),
    availability: "https://schema.org/InStock",
    category: "Recurring lawn maintenance plan",
    description: `${plan.maxSqFtLabel}. ${plan.visitsLabel}. ${plan.features.join(", ")}.`,
    eligibleRegion: "US-MA",
    url: `${SITE_URL}/plans`,
  })),
};

const SEO_BY_ROUTE: Record<string, SeoConfig> = {
  "/": {
    title: "HD Pro Construction | Masonry, Pavers, Landscaping & Decks in Boston, MA",
    description:
      "On-site construction and outdoor services across Greater Boston: pavers, brick work, walkways, stone walls, excavation, fences, paint, landscape and decks.",
    canonicalPath: "/",
    keywords: [
      "construction company Boston MA",
      "paver installation Boston",
      "masonry contractor Massachusetts",
      "landscaping services Boston",
      ...servicesKeywordList,
    ].join(", "),
    robots: INDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    imageAlt: "HD Pro Construction on-site services in Greater Boston",
    structuredData: [LOCAL_BUSINESS_SCHEMA],
  },
  "/services": {
    title: "Construction Services in Boston, MA | Pavers, Masonry, Landscape & More",
    description: `Explore HD Pro Construction services in Greater Boston: ${servicesTitleList}. Request estimates and compare project options in one catalog.`,
    canonicalPath: "/services",
    keywords: [
      "construction services Boston",
      "masonry and excavation Boston MA",
      "outdoor contractor Massachusetts",
      ...servicesKeywordList,
    ].join(", "),
    robots: INDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    imageAlt: "HD Pro Construction service catalog for Boston and Massachusetts",
    structuredData: [SERVICES_OFFER_CATALOG_SCHEMA],
  },
  "/plans": {
    title: "Lawn Maintenance Plans in Boston, MA | Basic, Standard & Premium",
    description:
      "Compare recurring lawn maintenance plans with monthly pricing, visit frequency and yard coverage. Choose Basic, Standard or Premium for Massachusetts properties.",
    canonicalPath: "/plans",
    keywords: [
      "lawn maintenance plans Boston",
      "monthly yard service Massachusetts",
      "recurring lawn cutting plans",
      ...plansKeywordList,
    ].join(", "),
    robots: INDEX_ROBOTS,
    imagePath: DEFAULT_OG_IMAGE_PATH,
    imageAlt: "Lawn maintenance subscription plans by HD Pro Construction",
    structuredData: [LAWN_PLAN_OFFERS_SCHEMA],
  },
};

const buildPrivateSeo = (path: string): SeoConfig => ({
  title: `${SITE_NAME} | Private Area`,
  description: "Private and transactional page.",
  canonicalPath: path,
  robots: NOINDEX_ROBOTS,
  imagePath: DEFAULT_OG_IMAGE_PATH,
});

const buildNotFoundSeo = (path: string): SeoConfig => ({
  title: `Page Not Found | ${SITE_NAME}`,
  description: "The requested page could not be found.",
  canonicalPath: path,
  robots: NOINDEX_ROBOTS,
  imagePath: DEFAULT_OG_IMAGE_PATH,
});

export const getSeoConfig = (pathname: string): SeoConfig => {
  const normalizedPath = normalizePathname(pathname);
  const exactMatch = SEO_BY_ROUTE[normalizedPath];

  if (exactMatch) {
    return exactMatch;
  }

  if (normalizedPath === "/404") {
    return buildNotFoundSeo(normalizedPath);
  }

  if (
    NOINDEX_EXACT_ROUTES.includes(normalizedPath as (typeof NOINDEX_EXACT_ROUTES)[number]) ||
    PRIVATE_ROUTE_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
  ) {
    return buildPrivateSeo(normalizedPath);
  }

  return buildNotFoundSeo(normalizedPath || "/404");
};

export const buildPrerenderHead = (seoConfig: SeoConfig): PrerenderHead => {
  const canonicalUrl = buildCanonicalUrl(seoConfig.canonicalPath);
  const robots = seoConfig.robots ?? INDEX_ROBOTS;
  const locale = seoConfig.locale ?? DEFAULT_LOCALE;
  const ogType = seoConfig.ogType ?? "website";
  const imagePath = seoConfig.imagePath ?? DEFAULT_OG_IMAGE_PATH;
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;
  const imageAlt = seoConfig.imageAlt ?? seoConfig.title;
  const tags: PrerenderHeadElement[] = [
    { type: "meta", props: { name: "description", content: seoConfig.description } },
    { type: "meta", props: { name: "robots", content: robots } },
    { type: "link", props: { rel: "canonical", href: canonicalUrl } },
    { type: "meta", props: { name: "geo.region", content: "US-MA" } },
    { type: "meta", props: { name: "geo.placename", content: "Greater Boston, Massachusetts" } },
    { type: "meta", props: { name: "geo.position", content: "42.3601;-71.0589" } },
    { type: "meta", props: { name: "ICBM", content: "42.3601, -71.0589" } },
    { type: "meta", props: { property: "og:type", content: ogType } },
    { type: "meta", props: { property: "og:site_name", content: SITE_NAME } },
    { type: "meta", props: { property: "og:url", content: canonicalUrl } },
    { type: "meta", props: { property: "og:title", content: seoConfig.title } },
    { type: "meta", props: { property: "og:description", content: seoConfig.description } },
    { type: "meta", props: { property: "og:image", content: imageUrl } },
    { type: "meta", props: { property: "og:image:width", content: "1200" } },
    { type: "meta", props: { property: "og:image:height", content: "630" } },
    { type: "meta", props: { property: "og:image:alt", content: imageAlt } },
    { type: "meta", props: { property: "og:locale", content: locale } },
    { type: "meta", props: { name: "twitter:card", content: "summary_large_image" } },
    { type: "meta", props: { name: "twitter:url", content: canonicalUrl } },
    { type: "meta", props: { name: "twitter:title", content: seoConfig.title } },
    {
      type: "meta",
      props: { name: "twitter:description", content: seoConfig.description },
    },
    { type: "meta", props: { name: "twitter:image", content: imageUrl } },
    { type: "meta", props: { name: "twitter:image:alt", content: imageAlt } },
  ];

  if (seoConfig.keywords) {
    tags.push({ type: "meta", props: { name: "keywords", content: seoConfig.keywords } });
  }

  for (const entry of seoConfig.structuredData ?? []) {
    tags.push({
      type: "script",
      props: {
        type: "application/ld+json",
      },
      children: JSON.stringify(entry),
    });
  }

  return {
    lang: "en",
    title: seoConfig.title,
    elements: new Set(tags),
  };
};

export const getCanonicalUrl = (path: string): string => buildCanonicalUrl(path);

export const getStaticPrerenderRoutes = (): string[] =>
  [...INDEXABLE_ROUTES, "/404"].map((route) =>
    route === "/" ? route : `/${stripRouteSlashes(route)}`,
  );
