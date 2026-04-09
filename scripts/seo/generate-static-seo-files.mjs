import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { SitemapStream, streamToPromise } from "sitemap";

const SITE_URL = process.env.SEO_SITE_URL ?? "https://hdproconstruction.com";
const INDEXABLE_ROUTES = ["/", "/services", "/plans"];
const LASTMOD = process.env.SEO_LASTMOD ?? new Date().toISOString();

const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const publicDir = join(projectRoot, "public");
const sitemapPath = join(publicDir, "sitemap.xml");
const robotsPath = join(publicDir, "robots.txt");

const buildSitemapXml = async () => {
  const sitemap = new SitemapStream({ hostname: SITE_URL });

  for (const route of INDEXABLE_ROUTES) {
    sitemap.write({
      url: route,
      lastmod: LASTMOD,
    });
  }

  sitemap.end();
  const buffer = await streamToPromise(sitemap);
  return buffer.toString("utf-8");
};

const buildRobotsTxt = () =>
  ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n");

await mkdir(publicDir, { recursive: true });
await writeFile(sitemapPath, await buildSitemapXml(), "utf-8");
await writeFile(robotsPath, buildRobotsTxt(), "utf-8");

console.log(`SEO static files generated: ${sitemapPath} and ${robotsPath}`);
