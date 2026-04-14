import type { Express } from "express";
import { type Server } from "http";
import { logger } from "./logger";
import crypto from "crypto";
import {
  checkCsrfOrigin,
} from "./route-helpers";
import { apiFail, apiNotFound } from "./routes/api-response";
import { SUPPORTED_LANGS, SITE_URL } from "./server-constants";
import {
  backendLabel, resolveRequestLang,
} from "./routes/shared";
import { registerPublicRoutes } from "./routes/public";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  activeIntervals?: ReturnType<typeof setInterval>[]
): Promise<Server> {

  const NOINDEX_PATHS = new Set(['/links', '/start']);
  const PUBLIC_PATHS = new Set([
    '/', '/sobre-las-llc', '/como-trabajamos', '/servicios',
    '/preguntas-frecuentes', '/agendar-asesoria', '/blog',
  ]);
  const KNOWN_PATHS = new Set([
    ...PUBLIC_PATHS,
    '/legal/terminos', '/legal/privacidad', '/legal/cookies',
    '/legal/reembolsos', '/legal/disclaimer',
    '/links', '/start',
  ]);
  for (const lang of SUPPORTED_LANGS) {
    for (const p of PUBLIC_PATHS) {
      KNOWN_PATHS.add(`/${lang}${p === '/' ? '' : p}`);
    }
  }

  const STATIC_EXT = /\.(js|css|map|woff2?|ttf|png|jpg|jpeg|gif|svg|ico|webp|avif|webmanifest|pdf|xml|txt|json)$/;
  const LANG_PREFIX_RE = /^\/(es|en|fr|de|pt|ca)(\/|$)/;

  function stripLangPrefix(path: string): string {
    const m = path.match(LANG_PREFIX_RE);
    if (!m) return path;
    const rest = path.slice(m[1].length + 1);
    return rest ? `/${rest}` : '/';
  }

  const NOINDEX_PREFIXES = ['/booking/'];

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
        res.setHeader('Link', `<${SITE_URL}${cleanPath === '/' ? '' : cleanPath}>; rel="canonical"`);
      }
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") return next();
    if (!req.path.startsWith("/api/")) return next();
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
