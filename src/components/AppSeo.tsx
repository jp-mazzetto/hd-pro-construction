import { Helmet } from "react-helmet-async";

import {
  DEFAULT_LOCALE,
  DEFAULT_OG_IMAGE_PATH,
  INDEX_ROBOTS,
  getCanonicalUrl,
  type SeoConfig,
} from "../consts/seo";
import { SITE_NAME, SITE_URL } from "../consts/site";

type AppSeoProps = SeoConfig;

const AppSeo = ({
  title,
  description,
  canonicalPath,
  keywords,
  robots = INDEX_ROBOTS,
  imagePath = DEFAULT_OG_IMAGE_PATH,
  imageAlt = title,
  locale = DEFAULT_LOCALE,
  ogType = "website",
  structuredData = [],
}: AppSeoProps) => {
  if ((globalThis as { __HD_PRERENDER__?: boolean }).__HD_PRERENDER__) {
    return null;
  }

  const canonicalUrl = getCanonicalUrl(canonicalPath);
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta name="geo.region" content="US-MA" />
      <meta name="geo.placename" content="Greater Boston, Massachusetts" />
      <meta name="geo.position" content="42.3601;-71.0589" />
      <meta name="ICBM" content="42.3601, -71.0589" />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {structuredData.map((entry, index) => (
        <script key={`${canonicalPath}-jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default AppSeo;
