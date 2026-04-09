import img1 from "../assets/imgs/img1.webp";
import img2 from "../assets/imgs/img2.webp";
import img3 from "../assets/imgs/img3.webp";
import img4 from "../assets/imgs/img4.webp";
import img5 from "../assets/imgs/img5.webp";
import brickWalkwayBeforeAfterMilton from "../assets/imgs/services/brick-walkway-before-after-milton.jpeg";
import deckPatioRenovation from "../assets/imgs/services/deck-patio-renovation.jpeg";
import paintedHouseCurvedWalkway from "../assets/imgs/services/painted-house-curved-walkway.jpeg";
import excavationBeforeImg from "../assets/imgs/services/excavation/before.png";
import excavationAfterImg from "../assets/imgs/services/excavation/after.png";
import fencesBeforeImg from "../assets/imgs/services/fences/before.png";
import fencesAfterImg from "../assets/imgs/services/fences/after.png";
import landscapeBeforeImg from "../assets/imgs/services/landscape/before.png";
import landscapeAfterImg from "../assets/imgs/services/landscape/after.png";
import paversBeforeImg from "../assets/imgs/services/pavers/before.png";
import paversAfterImg from "../assets/imgs/services/pavers/after.png";
import stoneWallsBeforeImg from "../assets/imgs/services/stonewalls/before.png";
import stoneWallsAfterImg from "../assets/imgs/services/stonewalls/after.png";
import walkwaysBeforeImg from "../assets/imgs/services/walkweys/before.png";
import walkwaysAfterImg from "../assets/imgs/services/walkweys/after.png";

export type ServiceName =
  | "Pavers"
  | "Brick Work"
  | "Walkways"
  | "Stone Walls"
  | "Excavation"
  | "Fences"
  | "Paint"
  | "Landscape"
  | "Deck";

export interface InstagramPost {
  url: string;
  link: string;
  caption: string;
}

export interface Service {
  title: ServiceName;
  desc: string;
  imageSrc: string;
  imageAlt: string;
  imageBefore?: string;
  imageAfter?: string;
}

export type SubscriptionPlanName = "Basic Plan" | "Standard Plan" | "Premium Plan";

export interface SubscriptionPlanOffer {
  tier: SubscriptionPlanName;
  priceLabel: string;
  maxSqFtLabel: string;
  visitsLabel: string;
  features: string[];
  bestFor: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AboutFeature {
  title: string;
  description: string;
}

export const PHONE_NUMBER = "+17746882900";
export const DISPLAY_PHONE = "+1 (774) 688-2900";
export const DIRECT_SMS_PHONE = "+1 (774) 688-2900";
export const LOCATION_LABEL = "Serving all of Boston, Massachusetts";

// ── Instagram ───────────────────────────────────────────────────────────────────

export const instagramProfileUrl = "https://www.instagram.com/hd_pro_construction_inc/";

// ── SEO ──────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://hdproconstruction.com";
export const SITE_NAME = "HD Pro Construction INC";

export const SEO_TITLE =
  "HD Pro Construction | Pavers, Masonry, Landscaping & More – Boston, MA";

export const SEO_DESCRIPTION =
  "HD Pro Construction INC – Boston's trusted on-site contractor for Pavers, Brick Work, Walkways, Stone Walls, Excavation, Fences, Painting, Landscaping & Decks. We come to you! Serving Quincy, Milton, Cambridge & all Greater Boston. Free estimates!";

export const SEO_KEYWORDS = [
  // Services
  "paver installation Boston MA",
  "brick work Boston",
  "masonry contractor Boston",
  "walkway construction Boston",
  "stone wall contractor Massachusetts",
  "retaining wall Boston MA",
  "excavation contractor Boston",
  "site grading Massachusetts",
  "fence installation Boston MA",
  "house painting Boston",
  "exterior painting Boston MA",
  "interior painting Boston MA",
  "landscaping Boston MA",
  "landscape design Massachusetts",
  "deck construction Boston MA",
  "deck builder Boston",
  // On-site / at home
  "home improvement contractor Boston",
  "residential contractor Boston MA",
  "on-site contractor Greater Boston",
  "contractor at your home Boston",
  "outdoor home services Boston MA",
  // Near me
  "paver contractor near me",
  "masonry contractor near me",
  "landscaping near me Boston",
  "excavation near me Massachusetts",
  // Local cities
  "paver installation Quincy MA",
  "masonry contractor Milton MA",
  "landscaping Cambridge MA",
  "paver installation Brookline MA",
  "contractor Somerville MA",
  "paver Newton MA",
  "masonry Dedham MA",
  "landscaping Braintree MA",
  // Brand
  "HD Pro Construction",
  "HD Pro Construction INC",
  "construction company Boston MA",
  "outdoor contractor Boston",
  "free estimate construction Boston",
].join(", ");

export const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  telephone: DIRECT_SMS_PHONE,
  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/logo.webp`,
  description:
    "HD Pro Construction INC is a mobile, on-site construction and landscaping company serving residential customers throughout Greater Boston, MA. We come to your home to install pavers, brick work, walkways, stone walls, fences, decks, and more.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Greater Boston Area",
    addressLocality: "Boston",
    addressRegion: "MA",
    postalCode: "02108",
    addressCountry: "US",
  },
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 42.3601,
      longitude: -71.0589,
    },
    geoRadius: "50000",
  },
  areaServed: [
    { "@type": "City", name: "Boston", sameAs: "https://www.wikidata.org/wiki/Q100" },
    { "@type": "City", name: "Quincy" },
    { "@type": "City", name: "Milton" },
    { "@type": "City", name: "Cambridge" },
    { "@type": "City", name: "Somerville" },
    { "@type": "City", name: "Brookline" },
    { "@type": "City", name: "Newton" },
    { "@type": "City", name: "Dedham" },
    { "@type": "City", name: "Braintree" },
    { "@type": "City", name: "Weymouth" },
    { "@type": "City", name: "Malden" },
    { "@type": "City", name: "Medford" },
    { "@type": "City", name: "Waltham" },
    { "@type": "City", name: "Needham" },
    { "@type": "State", name: "Massachusetts" },
  ],
  sameAs: [instagramProfileUrl],
  priceRange: "$$",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:00",
      closes: "18:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "On-Site Construction & Landscaping Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Paver Installation",
          description:
            "Expert on-site installation of interlocking concrete and stone pavers for driveways, patios, and walkways in Boston, MA.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Brick Work & Masonry",
          description:
            "Professional on-site masonry services including brick walls, chimneys, and structural brick work across Greater Boston.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Walkway Construction",
          description:
            "Custom walkway design and installation at your home using pavers, brick, and natural stone in Boston and surrounding cities.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Stone Wall Construction",
          description:
            "Robust natural stone retaining walls and decorative stone walls built on-site throughout Massachusetts.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Excavation & Site Grading",
          description:
            "Precision site clearing, grading, and earth moving at residential and commercial properties in Boston, MA.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Fence Installation",
          description:
            "Quality residential and commercial fencing installed at your property throughout Greater Boston.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Interior & Exterior Painting",
          description:
            "High-end interior and exterior house painting services performed at your home in the Boston, MA area.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Landscaping",
          description:
            "Full-service landscape design and maintenance delivered at your property in Boston, MA.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Deck Construction",
          description:
            "Custom deck design and construction using premium materials, built at your home across Greater Boston.",
        },
      },
    ],
  },
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Plans", href: "/plans" },
];

export const SERVICE_TAGS: string[] = [
  "Pavers",
  "Brick",
  "Walkways",
  "Stone Walls",
  "Excavation",
  "Fences",
  "Paint",
  "Landscape",
  "Decks",
];

export const SMS_TEMPLATES: Record<ServiceName, string> = {
  Pavers:
    "Hi HD Pro Construction, I saw your website and I'd like a free estimate for a paver installation project.",
  "Brick Work":
    "Hi HD Pro Construction, I'm interested in brick work for my property and would like to request a free estimate.",
  Walkways:
    "Hi HD Pro Construction, I'd like to get a free estimate for building a new walkway at my property.",
  "Stone Walls":
    "Hi HD Pro Construction, I'm looking to build a stone wall and would like to request a free estimate.",
  Excavation:
    "Hi HD Pro Construction, I need excavation work done and would like to request a free estimate.",
  Fences:
    "Hi HD Pro Construction, I'm interested in installing a fence and would like a free estimate.",
  Paint:
    "Hi HD Pro Construction, I'd like a free estimate for a painting project (interior or exterior).",
  Landscape:
    "Hi HD Pro Construction, I'm interested in landscaping services and would like a free estimate.",
  Deck: "Hi HD Pro Construction, I'd like to request a free estimate for building a deck.",
};

export const DEFAULT_SMS_TEMPLATE =
  "Hi HD Pro Construction, I saw your website and I'd like to request a free estimate.";

export const PLAN_SMS_TEMPLATES: Record<SubscriptionPlanName, string> = {
  "Basic Plan":
    "Hi HD Pro Construction, I'd like to subscribe to the Basic Lawn Maintenance Plan ($100/month).",
  "Standard Plan":
    "Hi HD Pro Construction, I'd like to subscribe to the Standard Lawn Maintenance Plan ($140/month).",
  "Premium Plan":
    "Hi HD Pro Construction, I'd like to subscribe to the Premium Lawn Maintenance Plan ($180/month).",
};

export const SERVICES: Service[] = [
  {
    title: "Pavers",
    desc: "Expert installation of interlocking concrete and stone pavers.",
    imageSrc: paversBeforeImg,
    imageAlt: "Paver installation service.",
    imageBefore: paversBeforeImg,
    imageAfter: paversAfterImg,
  },
  {
    title: "Brick Work",
    desc: "Professional masonry for walls, chimneys, and structural needs.",
    imageSrc: brickWalkwayBeforeAfterMilton,
    imageAlt: "Before and after brick walkway restoration in Milton, Massachusetts.",
  },
  {
    title: "Walkways",
    desc: "Beautifully designed paths that add value to your property.",
    imageSrc: walkwaysBeforeImg,
    imageAlt: "Walkway installation service.",
    imageBefore: walkwaysBeforeImg,
    imageAfter: walkwaysAfterImg,
  },
  {
    title: "Stone Walls",
    desc: "Robust and aesthetic natural stone retaining walls.",
    imageSrc: stoneWallsBeforeImg,
    imageAlt: "Stone walls construction service.",
    imageBefore: stoneWallsBeforeImg,
    imageAfter: stoneWallsAfterImg,
  },
  {
    title: "Excavation",
    desc: "Precision site clearing, grading, and earth moving.",
    imageSrc: excavationBeforeImg,
    imageAlt: "Excavation service.",
    imageBefore: excavationBeforeImg,
    imageAfter: excavationAfterImg,
  },
  {
    title: "Fences",
    desc: "Quality residential and commercial fencing solutions.",
    imageSrc: fencesBeforeImg,
    imageAlt: "Fence installation service.",
    imageBefore: fencesBeforeImg,
    imageAfter: fencesAfterImg,
  },
  {
    title: "Paint",
    desc: "High-end interior and exterior painting services to transform your home's look.",
    imageSrc: paintedHouseCurvedWalkway,
    imageAlt: "Freshly painted home exterior with a decorative curved stone walkway.",
  },
  {
    title: "Landscape",
    desc: "Full-service landscape design and maintenance to create your dream outdoor oasis.",
    imageSrc: landscapeBeforeImg,
    imageAlt: "Landscape service.",
    imageBefore: landscapeBeforeImg,
    imageAfter: landscapeAfterImg,
  },
  {
    title: "Deck",
    desc: "Custom deck design and construction using premium materials built to last.",
    imageSrc: deckPatioRenovation,
    imageAlt: "Deck and patio renovation with new paving and graded soil.",
  },
];

export const IG_POSTS: InstagramPost[] = [
  {
    url: img1,
    link: "https://www.instagram.com/p/DLaxLm0J1f9/",
    caption: "High-quality paver project.",
  },
  {
    url: img2,
    link: "https://www.instagram.com/p/DIQtl7kuggE/",
    caption: "Professional masonry work.",
  },
  {
    url: img3,
    link: "https://www.instagram.com/p/C_CGh4CJkYu/",
    caption: "Modern outdoor walkway design.",
  },
  {
    url: img4,
    link: "https://www.instagram.com/p/DVWeq_yifvz/",
    caption: "Precision excavation and grading.",
  },
  {
    url: img5,
    link: "https://www.instagram.com/p/DOfirlYDTIz/",
    caption: "Premium stone wall construction.",
  },
];

export const ABOUT_FEATURES: AboutFeature[] = [
  {
    title: "Free Estimates",
    description: "We provide honest on-site evaluations for every project.",
  },
  {
    title: "Expert Team",
    description:
      "Licensed professionals with years of hard-won field experience.",
  },
];

export const LAWN_MAINTENANCE_PLANS: SubscriptionPlanOffer[] = [
  {
    tier: "Basic Plan",
    priceLabel: "$100/month",
    maxSqFtLabel: "Up to 3,000 sq ft",
    visitsLabel: "Biweekly mowing (2 visits per month)",
    features: ["Lawn edging", "Yard cleanup"],
    bestFor: "Perfect for small homes and townhouses.",
  },
  {
    tier: "Standard Plan",
    priceLabel: "$140/month",
    maxSqFtLabel: "Up to 5,000 sq ft lawn",
    visitsLabel: "Biweekly mowing",
    features: ["Edging and trimming", "Yard cleanup"],
    bestFor: "Ideal for medium-size properties.",
  },
  {
    tier: "Premium Plan",
    priceLabel: "$180/month",
    maxSqFtLabel: "Up to 8,000 sq ft lawn",
    visitsLabel: "Lawn mowing",
    features: ["Full edging and trimming", "Yard cleanup and maintenance"],
    bestFor: "Best for large properties.",
  },
];

export const REFERRAL_PROMOTION = {
  title: "Special Offer",
  headline: "Refer 3 new customers and get 1 month of landscape free.",
  helperText:
    "Start your loyalty cycle now and unlock recurring maintenance savings.",
};
