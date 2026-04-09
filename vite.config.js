import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

export default defineConfig(({ mode }) => {
  const rootDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, rootDir, "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:3333";

  return {
    plugins: [
      react(),
      vitePrerenderPlugin({
        renderTarget: "#root",
        prerenderScript: resolve(rootDir, "src/prerender.tsx"),
        additionalPrerenderRoutes: ["/services", "/plans", "/404"],
        previewMiddlewareFallback: "/404",
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
