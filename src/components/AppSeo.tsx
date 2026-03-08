import { Helmet } from "react-helmet-async";

/**
 * Configura metadados SEO e social (Open Graph/Twitter) da landing page.
 */
const AppSeo = () => {
  return (
    <Helmet>
      <title>HD Pro Construction | Pavers, Masonry & Excavation in Boston</title>
      <meta
        name="description"
        content="HD Pro Construction INC specializes in Pavers, Brick work, Stone Walls, and Excavation services in Boston, MA. Request your free estimate today!"
      />
      <link rel="canonical" href="https://hdproconstruction.com/" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://hdproconstruction.com/" />
      <meta
        property="og:title"
        content="HD Pro Construction | Expert Outdoor Transformations"
      />
      <meta
        property="og:description"
        content="Professional masonry and excavation services in Boston. Built with integrity and precision."
      />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://hdproconstruction.com/" />
      <meta
        property="twitter:title"
        content="HD Pro Construction | Expert Outdoor Transformations"
      />
      <meta
        property="twitter:description"
        content="Professional masonry and excavation services in Boston. Built with integrity and precision."
      />
    </Helmet>
  );
};

export default AppSeo;
