import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { injectMeta } from "./static";
import { maybeInjectE2eTrackingHook } from "./e2e-hook";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      // Mirror the production HTML pipeline (`server/static.ts::injectMeta`)
      // so dev responses ship the same `<link rel="canonical">` and per-locale
      // `<link rel="alternate" hreflang>` tags Googlebot sees in production.
      // Without this, the audit script (and any local SEO debugging) would
      // see the generic placeholder canonical baked into `client/index.html`.
      // No caching here: `transformIndexHtml` re-injects HMR bookkeeping per
      // request, so the input HTML is never identical and a cache would just
      // burn memory.
      // Use `req.originalUrl` (not `req.path`): with the catch-all
      // `app.use("/{*path}", …)` mount, `req.path` strips the wildcard
      // capture, but the meta lookup needs the full path Googlebot would
      // request.
      const injected = injectMeta(page, req.originalUrl);
      // Task #38 — when `E2E_TEST_HOOKS=1`, inject the tiny inline
      // flag that flips `window.__EXENTAX_E2E_TRACKING__` to true so
      // `Tracking.tsx` actually pushes events into `window.dataLayer`
      // (instead of short-circuiting on `import.meta.env.DEV` /
      // localhost). No-op without the env var.
      const withE2eHook = maybeInjectE2eTrackingHook(injected);
      res.status(200).set({ "Content-Type": "text/html" }).end(withE2eHook);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
