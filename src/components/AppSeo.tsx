import { Helmet } from "react-helmet-async";

import {
  LOCAL_BUSINESS_SCHEMA,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from "../consts/site";

/**
 * Configura metadados SEO, Open Graph, Twitter Card e JSON-LD LocalBusiness
 * da landing page para máxima indexação no Google.
 */
const AppSeo = () => (
  <Helmet>
    {/* ── Primary ── */}
    <title>{SEO_TITLE}</title>
    <meta name="description" content={SEO_DESCRIPTION} />
    <meta name="keywords" content={SEO_KEYWORDS} />
    <link rel="canonical" href={`${SITE_URL}/`} />

    {/* ── Robots ── */}
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />

    {/* ── Geo ── */}
    <meta name="geo.region" content="US-MA" />
    <meta name="geo.placename" content="Greater Boston, Massachusetts" />
    <meta name="geo.position" content="42.3601;-71.0589" />
    <meta name="ICBM" content="42.3601, -71.0589" />

    {/* ── Open Graph ── */}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:url" content={`${SITE_URL}/`} />
    <meta property="og:title" content={SEO_TITLE} />
    <meta property="og:description" content={SEO_DESCRIPTION} />
    <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta
      property="og:image:alt"
      content="HD Pro Construction – On-site Pavers and Masonry in Boston, MA"
    />
    <meta property="og:locale" content="en_US" />

    {/* ── Twitter Card ── */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={`${SITE_URL}/`} />
    <meta name="twitter:title" content={SEO_TITLE} />
    <meta name="twitter:description" content={SEO_DESCRIPTION} />
    <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
    <meta
      name="twitter:image:alt"
      content="HD Pro Construction – On-site Pavers and Masonry in Boston, MA"
    />

    {/* ── JSON-LD LocalBusiness Schema ── */}
    <script type="application/ld+json">
      {JSON.stringify(LOCAL_BUSINESS_SCHEMA)}
    </script>
  </Helmet>
);

export default AppSeo;
