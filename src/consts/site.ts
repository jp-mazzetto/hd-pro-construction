import img1 from "../assets/imgs/img1.webp";
import img2 from "../assets/imgs/img2.webp";
import img3 from "../assets/imgs/img3.webp";
import img4 from "../assets/imgs/img4.webp";
import img5 from "../assets/imgs/img5.webp";
import backyardPaverPatioFence from "../assets/imgs/services/backyard-paver-patio-fence.jpeg";
import brickWalkwayBeforeAfterMilton from "../assets/imgs/services/brick-walkway-before-after-milton.jpeg";
import deckPatioRenovation from "../assets/imgs/services/deck-patio-renovation.jpeg";
import paintedHouseCurvedWalkway from "../assets/imgs/services/painted-house-curved-walkway.jpeg";
import paverDrivewayInstallation from "../assets/imgs/services/paver-driveway-installation.jpeg";
import paverInstallationTeam from "../assets/imgs/services/paver-installation-team.jpeg";
import paversBeforeAfterQuincy from "../assets/imgs/services/pavers-before-after-quincy.jpeg";
import walkwayFrontEntry from "../assets/imgs/services/walkway-front-entry.jpeg";
import walkwayLinearGrayPavers from "../assets/imgs/services/walkway-linear-gray-pavers.jpeg";

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
    imageSrc: paversBeforeAfterQuincy,
    imageAlt: "Before and after paver walkway renovation in Quincy, Massachusetts.",
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
    imageSrc: walkwayFrontEntry,
    imageAlt: "Finished front-entry walkway with pavers and dark border.",
  },
  {
    title: "Stone Walls",
    desc: "Robust and aesthetic natural stone retaining walls.",
    imageSrc: paverDrivewayInstallation,
    imageAlt: "Large paver installation area with stacked stone and border detailing.",
  },
  {
    title: "Excavation",
    desc: "Precision site clearing, grading, and earth moving.",
    imageSrc: paverInstallationTeam,
    imageAlt: "Contractor leveling a base during a paver installation project.",
  },
  {
    title: "Fences",
    desc: "Quality residential and commercial fencing solutions.",
    imageSrc: backyardPaverPatioFence,
    imageAlt: "Backyard patio paving project with a newly installed perimeter fence.",
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
    imageSrc: walkwayLinearGrayPavers,
    imageAlt: "Long landscaped paver walkway crossing a front yard.",
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
