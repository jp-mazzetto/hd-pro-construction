import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import { buildPrerenderHead, getSeoConfig, getStaticPrerenderRoutes } from "./consts/seo";
import { appRoutes } from "./router";

interface PrerenderContext {
  url: string;
}

export async function prerender(context: PrerenderContext) {
  const pathname = new URL(context.url, "https://hdproconstruction.com").pathname;
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [pathname],
  });

  let html = "";
  (globalThis as { __HD_PRERENDER__?: boolean }).__HD_PRERENDER__ = true;
  try {
    html = renderToString(
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>,
    );
  } finally {
    (globalThis as { __HD_PRERENDER__?: boolean }).__HD_PRERENDER__ = false;
  }

  return {
    html,
    links: new Set(getStaticPrerenderRoutes()),
    head: buildPrerenderHead(getSeoConfig(pathname)),
  };
}
