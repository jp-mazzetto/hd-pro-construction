import img1 from "../assets/imgs/img1.webp";
import img2 from "../assets/imgs/img2.webp";
import img3 from "../assets/imgs/img3.webp";
import img4 from "../assets/imgs/img4.webp";
import img5 from "../assets/imgs/img5.webp";

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
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AboutFeature {
  title: string;
  description: string;
}

export const PHONE_NUMBER = "+18572492409";
export const DISPLAY_PHONE = "+1 (857) 249-2409";
export const DIRECT_SMS_PHONE = "+1 (774) 688-2900";
export const LOCATION_LABEL = "Serving all of Boston, Massachusetts";

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
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

export const SERVICES: Service[] = [
  {
    title: "Pavers",
    desc: "Expert installation of interlocking concrete and stone pavers.",
  },
  {
    title: "Brick Work",
    desc: "Professional masonry for walls, chimneys, and structural needs.",
  },
  {
    title: "Walkways",
    desc: "Beautifully designed paths that add value to your property.",
  },
  {
    title: "Stone Walls",
    desc: "Robust and aesthetic natural stone retaining walls.",
  },
  {
    title: "Excavation",
    desc: "Precision site clearing, grading, and earth moving.",
  },
  {
    title: "Fences",
    desc: "Quality residential and commercial fencing solutions.",
  },
  {
    title: "Paint",
    desc: "High-end interior and exterior painting services to transform your home's look.",
  },
  {
    title: "Landscape",
    desc: "Full-service landscape design and maintenance to create your dream outdoor oasis.",
  },
  {
    title: "Deck",
    desc: "Custom deck design and construction using premium materials built to last.",
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
