import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { buildPrerenderHead, getSeoConfig, getStaticPrerenderRoutes } from "./consts/seo";
import { createAppMemoryRouter } from "./router";
import { createAppQueryClient } from "./lib/query-client";

interface PrerenderContext {
  url: string;
}

export async function prerender(context: PrerenderContext) {
  const pathname = new URL(context.url, "https://hdproconstruction.com").pathname;
  const router = createAppMemoryRouter(pathname);
  const queryClient = createAppQueryClient();

  let html = "";
  (globalThis as { __HD_PRERENDER__?: boolean }).__HD_PRERENDER__ = true;
  try {
    await router.load();

    html = renderToString(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
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
