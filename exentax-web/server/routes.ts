import type { Express } from "express";
import { type Server } from "http";
import { logger } from "./logger";
import crypto from "crypto";
import {
  checkCsrfOrigin,
} from "./route-helpers";
import { apiFail, apiNotFound } from "./routes/api-response";
import { SUPPORTED_LANGS, SITE_URL, HREFLANG_BCP47, type SupportedLang } from "./server-constants";
import { getAllLocalizedPaths, resolveServerRoute, getLocalizedPath } from "../shared/routes";
import {
  backendLabel, resolveRequestLang,
} from "./routes/shared";
import { registerPublicRoutes } from "./routes/public";
import { registerIndexNowRoutes } from "./indexnow";
import { registerDiscordBotRoutes, registerSlashCommands, isBotConfigured } from "./discord-bot";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  activeIntervals?: ReturnType<typeof setInterval>[]
): Promise<Server> {

  const NOINDEX_PATHS = new Set(['/links', '/start']);
  const localizedPaths = getAllLocalizedPaths();
  const KNOWN_PATHS = new Set([
    ...localizedPaths,
    '/links', '/start',
    '/blog',
  ]);
  for (const lang of SUPPORTED_LANGS) {
    KNOWN_PATHS.add(`/${lang}/blog`);
  }

  const STATIC_EXT = /\.(js|css|map|woff2?|ttf|png|jpg|jpeg|gif|svg|ico|webp|avif|webmanifest|pdf|xml|txt|json)$/;
  const LANG_PREFIX_RE = /^\/(es|en|fr|de|pt|ca)(\/|$)/;

  function stripLangPrefix(path: string): string {
    const m = path.match(LANG_PREFIX_RE);
    if (!m) return path;
    const rest = path.slice(m[0].length);
    return rest ? `/${rest}` : '/';
  }

  const NOINDEX_PREFIXES = ['/booking/', '/internal/'];

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/') && !STATIC_EXT.test(req.path)) {
      const cleanPath = req.path.replace(/\/+$/, '') || '/';
      const basePath = stripLangPrefix(cleanPath);
      const isBlogPost = basePath.startsWith('/blog/') && basePath !== '/blog';
      const isLangBlogPost = LANG_PREFIX_RE.test(cleanPath) && basePath.startsWith('/blog/') && basePath !== '/blog';
      const isNoindexPrefix = NOINDEX_PREFIXES.some(p => cleanPath.startsWith(p));
      if (NOINDEX_PATHS.has(cleanPath) || isNoindexPrefix || (!KNOWN_PATHS.has(cleanPath) && !isBlogPost && !isLangBlogPost)) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
      } else {
        res.setHeader('X-Robots-Tag', 'index, follow, max-snippet:-1, max-image-preview:large');
        const resolved = resolveServerRoute(cleanPath);
        const canonicalPath = resolved
          ? getLocalizedPath(resolved.key, resolved.lang)
          : (cleanPath === '/' ? '' : cleanPath);
        // Emit canonical + hreflang alternates as a single comma-separated
        // RFC 5988 `Link` header. This mirrors what `server/static.ts::injectMeta`
        // injects into the prerendered HTML in production, so the auditing
        // crawler can verify hreflang reciprocity uniformly across dev and
        // prod without depending on SSR HTML.
        const linkParts: string[] = [`<${SITE_URL}${canonicalPath}>; rel="canonical"`];
        if (resolved) {
          for (const lang of SUPPORTED_LANGS) {
            const altPath = getLocalizedPath(resolved.key, lang as SupportedLang);
            linkParts.push(`<${SITE_URL}${altPath}>; rel="alternate"; hreflang="${HREFLANG_BCP47[lang as SupportedLang]}"`);
          }
          const xDefaultPath = getLocalizedPath(resolved.key, 'es');
          linkParts.push(`<${SITE_URL}${xDefaultPath}>; rel="alternate"; hreflang="x-default"`);
        } else if (isBlogPost || isLangBlogPost) {
          // Blog post hreflang reciprocity is data-driven by BLOG_SLUG_I18N
          // and varies per-post (some langs don't have a translation). The
          // SSR-side `injectMeta` handles this with full slug knowledge; the
          // dev middleware skips alternates here to avoid emitting URLs that
          // would 301 to themselves and confuse Google. The audit script
          // verifies blog hreflang via the data layer.
        }
        res.setHeader('Link', linkParts.join(', '));
      }
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
    if (!req.path.startsWith("/api/")) return next();
    // Discord signs every interaction with Ed25519; the bot module verifies
    // the signature on the raw body. Discord does NOT send an Origin
    // header, so the standard same-origin CSRF check would always reject
    // these legitimate requests. The signature is a strictly stronger
    // proof of authenticity, so we exempt the path here.
    if (req.path === "/api/discord/interactions") return next();
    // E2E test-only routes are exempt from the same-origin CSRF check
    // because Playwright's APIRequestContext does not set an Origin
    // header matching the dev domain. The routes are gated behind an
    // `x-e2e-test: 1` request header AND only mounted when either
    // NODE_ENV !== "production" (local dev) or E2E_TEST_HOOKS=1 (CI
    // prod-bundle smoke), so this exemption is a no-op in real
    // production deployments.
    if (
      req.path.startsWith("/api/__test/") &&
      (process.env.NODE_ENV !== "production" || process.env.E2E_TEST_HOOKS === "1")
    ) {
      return next();
    }
    if (!checkCsrfOrigin(req)) {
      if (process.env.NODE_ENV !== "production") {
        logger.warn(`[csrf] blocked: origin="${req.headers.origin}" referer="${req.headers.referer}" host="${req.headers.host}"`, "auth");
      }
      return apiFail(res, 403, backendLabel("originNotAllowed", resolveRequestLang(req)), "FORBIDDEN");
    }
    next();
  });

  app.use((req, _res, next) => {
    if ((req.method === "PATCH" || req.method === "PUT" || req.method === "POST") && req.body && typeof req.body === "object" && "id" in req.body) {
      logger.warn(`ID override attempt stripped: ${req.method} ${req.path} — body.id="${req.body.id}"`, "security");
      delete req.body.id;
    }
    next();
  });

  registerPublicRoutes(app, activeIntervals);
  registerIndexNowRoutes(app);

  // Discord agenda bot — interactions endpoint + global slash command sync.
  // The express.raw body parser for /api/discord/interactions is mounted
  // earlier in `server/index.ts` (before express.json) so the Ed25519
  // signature can be verified against the byte-exact request body.
  if (isBotConfigured()) {
    registerDiscordBotRoutes(app);
    // Fire-and-forget global registration. Discord caches the manifest so
    // no-op syncs are cheap; failures are logged but never block startup
    // because the interactions endpoint can still serve previously
    // registered commands.
    registerSlashCommands().catch((err) => {
      logger.error(`[discord-bot] slash command sync failed: ${err?.message || err}`, "discord-bot");
    });
  } else {
    logger.warn("[discord-bot] not configured — skipping interactions endpoint and command sync", "discord-bot");
  }

  app.all("/api/{*rest}", (req, res) => {
    return apiNotFound(res, backendLabel("endpointNotFound", resolveRequestLang(req)));
  });

  app.use((err: any, req: any, res: any, _next: any) => {
    const errorId = crypto.randomBytes(4).toString("hex");
    const lang = resolveRequestLang(req);
    logger.error(`[${errorId}] Unhandled route error: ${err.message || err}`, "express", err);
    if (!res.headersSent) {
      let status = err.status || err.statusCode || 500;
      let code = err.code || "SERVER_ERROR";
      let safeMessage: string;
      if (err.name === "NotFoundError") {
        status = 404;
        code = "NOT_FOUND";
        safeMessage = err.message || backendLabel("resourceNotFound", lang);
      } else if (err.name === "ValidationError") {
        status = 400;
        code = "VALIDATION_ERROR";
        safeMessage = err.message || backendLabel("invalidInput", lang);
      } else if (err.name === "StorageError") {
        code = "STORAGE_ERROR";
        safeMessage = status >= 500 ? backendLabel("internalServerError", lang) : backendLabel("storageOperationFailed", lang);
      } else {
        safeMessage = status >= 500 ? backendLabel("internalServerError", lang) : (err.expose ? err.message : backendLabel("requestError", lang));
      }
      apiFail(res, status, safeMessage, code, { errorId });
    }
  });

  return httpServer;
}
