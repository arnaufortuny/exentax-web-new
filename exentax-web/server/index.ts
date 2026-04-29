import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { closePool, runColumnMigrations } from "./db";
import { logger } from "./logger";
import { registerCleanupIntervals, clearActiveTimers } from "./route-helpers";
import { startEmailRetryWorker } from "./email-retry-queue";
import { assertGuidePdfUrlReady } from "./email";
import { startDripWorker } from "./scheduled/drip-worker";
import { startDiscordAlertWorker } from "./discord-alerts";
import { backendLabel, resolveRequestLang } from "./routes/shared";
import { notifyCriticalError, startDiscordQueueWorker, clearPendingDiscordTimers } from "./discord";
import { SITE_URL, getBrandingEnvFallbacks } from "./server-constants";
import { correlationMiddleware } from "./correlation";
import { recordHttpRequest } from "./metrics";
import { registerObservabilityRoutes } from "./routes/observability";
import { geoMiddleware } from "./middleware/geo";
import { legacyRedirects } from "./middleware/legacy-redirects";

const REQUIRED_ENV_VARS: Array<{ name: string; prodOnly?: boolean; hint: string }> = [
  { name: "DATABASE_URL", hint: "PostgreSQL connection string" },
  { name: "FIELD_ENCRYPTION_KEY", prodOnly: true, hint: "64 hex chars (32 bytes) for AES-256-GCM PII encryption at rest" },
  { name: "GOOGLE_SERVICE_ACCOUNT_KEY", prodOnly: true, hint: "JSON service-account credentials for Calendar/Meet — booking flow depends on it" },
  { name: "DISCORD_BOT_TOKEN",          prodOnly: true, hint: "Discord bot token — used both for slash interactions and to deliver every notification (registros, agenda, errores, etc.)" },
  { name: "DISCORD_PUBLIC_KEY",         prodOnly: true, hint: "Discord application Ed25519 public key — required to verify inbound /api/discord/interactions" },
  { name: "DISCORD_APP_ID",             prodOnly: true, hint: "Discord application ID — required to register slash commands at startup" },
  { name: "DISCORD_GUILD_ID",           prodOnly: true, hint: "Guild whose member roles are checked for ADMIN_DISCORD_ROLE_ID gate" },
  { name: "ADMIN_DISCORD_ROLE_ID",      prodOnly: true, hint: "Discord role ID that gates every /agenda and /cita slash command (única superficie admin del proyecto)" },
  { name: "DISCORD_CHANNEL_REGISTROS",  prodOnly: true, hint: "Discord channel ID for #exentax-registros (lead/newsletter notifications; also fallback for #errores)" },
  { name: "DISCORD_CHANNEL_AGENDA",     prodOnly: true, hint: "Discord channel ID for #exentax-agenda (booking lifecycle + bot interactive controls)" },
  { name: "DISCORD_CHANNEL_CONSENTIMIENTOS", prodOnly: true, hint: "Discord channel ID for #exentax-consentimientos (GDPR consent log mirror with con_* IDs)" },
  // Bot-critical channels — without these the audit trail and error
  // surface for the *only admin surface of the project* go silent.
  // Must fail-fast in prod so a misconfigured deploy is caught at boot
  // instead of at first incident.
  { name: "DISCORD_CHANNEL_AUDITORIA",  prodOnly: true, hint: "Discord channel ID for #exentax-auditoria (mandatory audit trail of every /agenda /cita action and unauthorized attempt)" },
  { name: "DISCORD_CHANNEL_ERRORES",    prodOnly: true, hint: "Discord channel ID for #exentax-errores (system_error / validation_failed routing target — bot can't escalate without it)" },
];

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const missingVars: string[] = [];
for (const v of REQUIRED_ENV_VARS) {
  if (v.prodOnly && !isProd) continue;
  if (!process.env[v.name]) {
    missingVars.push(`${v.name} — ${v.hint}`);
  }
}
if (missingVars.length > 0) {
  if (isProd) {
    logger.error(`FATAL: Missing required environment variables:\n  ${missingVars.join("\n  ")}`, "startup");
    process.exit(1);
  } else {
    for (const msg of missingVars) {
      logger.warn(`[env] ${msg}`, "startup");
    }
  }
}

// Format-level validation for the Discord interaction endpoint envs. The
// presence check above already ensures these are set in production; the
// extra format checks catch the most common deployment foot-guns:
//   - DISCORD_PUBLIC_KEY copy/pasted with surrounding whitespace, the
//     "0x" prefix or the word "..." truncated by a copy buffer (Ed25519
//     public keys are exactly 32 raw bytes = 64 hex chars).
//   - Channel/role/app/guild IDs swapped for invite codes or names — they
//     must be Discord snowflakes (numeric, 17–20 digits in 2026).
// Mismatches here are configuration errors, not transient outages, so we
// fail fast in production and log loud warnings in dev.
function isHex64(v: string): boolean { return /^[0-9a-fA-F]{64}$/.test(v); }
function isSnowflake(v: string): boolean { return /^\d{17,20}$/.test(v); }
const FORMAT_CHECKS: Array<{ name: string; ok: (v: string) => boolean; expected: string; prodOnly?: boolean }> = [
  { name: "DISCORD_PUBLIC_KEY", ok: isHex64, expected: "64 hexadecimal characters (32-byte Ed25519 public key)", prodOnly: true },
  { name: "DISCORD_APP_ID",     ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_GUILD_ID",   ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "ADMIN_DISCORD_ROLE_ID", ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_CHANNEL_REGISTROS",        ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_CHANNEL_AGENDA",           ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_CHANNEL_CONSENTIMIENTOS",  ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_CHANNEL_AUDITORIA",        ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
  { name: "DISCORD_CHANNEL_ERRORES",          ok: isSnowflake, expected: "Discord snowflake (17–20 digits)", prodOnly: true },
];
const formatErrors: string[] = [];
for (const c of FORMAT_CHECKS) {
  const raw = process.env[c.name];
  if (!raw) continue; // presence enforced separately; absent envs already reported above
  if (raw !== raw.trim()) {
    formatErrors.push(`${c.name} has surrounding whitespace — strip it from the secret value`);
    continue;
  }
  if (!c.ok(raw)) {
    formatErrors.push(`${c.name} has wrong format — expected ${c.expected}`);
  }
}
if (formatErrors.length > 0) {
  if (isProd) {
    logger.error(`FATAL: Discord env format errors:\n  ${formatErrors.join("\n  ")}`, "startup");
    process.exit(1);
  } else {
    for (const msg of formatErrors) {
      logger.warn(`[env] ${msg}`, "startup");
    }
  }
}

let serverReady = false;
const activeIntervals: ReturnType<typeof setInterval>[] = [];
const STARTUP_HTML = "<!DOCTYPE html><html><head><title>Exentax</title></head><body></body></html>";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

const cspScriptSrc = isProd
  ? ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net"]
  : ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net"];
const cspStyleSrc = isProd
  ? ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
  : ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: cspScriptSrc,
      styleSrc: cspStyleSrc,
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://analytics.google.com", "https://connect.facebook.net", "https://www.facebook.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      frameSrc: ["'self'", "https://www.googletagmanager.com"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      workerSrc: ["'self'", "blob:"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      // scriptSrcAttr controls inline HTML event handlers (onclick=, onerror=,
      // onload=, ...). The codebase does NOT use any — React uses camelCase
      // onClick compiled to JS, and all HTML injection (dangerouslySetInnerHTML)
      // goes through client/src/lib/sanitize.ts (DOMPurify) which strips
      // handler attributes by default. Verified 2026-04 with
      // `grep -rnE 'onclick=|onerror=|onload=' client/src/` → 0 matches.
      // So `'none'` in production is strictly safer than `'unsafe-inline'`
      // and does not regress any feature. Dev keeps `'unsafe-inline'` so
      // browser extensions / React devtools aren't blocked.
      scriptSrcAttr: isProd ? ["'none'"] : ["'unsafe-inline'"],
      ...(isProd ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: isProd ? { maxAge: 63072000, includeSubDomains: true, preload: true } : false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  frameguard: { action: "sameorigin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  xContentTypeOptions: true,
  xXssProtection: false,
  dnsPrefetchControl: { allow: false },
}));

const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
  // Liveness AND readiness must be reachable during startup so the
  // orchestrator can distinguish "process up but not ready" from "process
  // dead". Both endpoints handle the not-ready state with their own
  // structured 503 JSON responses.
  const url = req.url || "";
  const probePath = url.split("?")[0];
  const isProbe = probePath === "/api/health" || probePath === "/api/health/ready";
  if (!serverReady && !isProbe) {
    res.writeHead(503, {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "5",
      "X-Robots-Tag": "noindex",
    });
    res.end(STARTUP_HTML);
    return;
  }
  app(req, res);
});


// Correlation ID propagation runs before any handler so every log line
// emitted while serving a request can be tagged with the inbound request id.
app.use(correlationMiddleware);

// Geo resolution from reverse-proxy headers (Task #11). Runs before API
// routes and the SPA fallback so /api/geo and any future handler can read
// `(req as any).geo.country`. No external geo DB; never echoes the raw IP.
app.use(geoMiddleware);

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  },
}));

app.use("/uploads", (_req, res) => {
  res.status(403).end();
});

// Default cache policy for /api/* responses: `no-store`. Concrete routes can
// still set their own `Cache-Control` (e.g. `/api/geo` uses `private,
// max-age=600`, sitemaps use `public, max-age=3600`) — we honour their choice
// and only fill the gap so JSON endpoints never get cached by proxies or
// browsers by accident. Wrapping `res.setHeader` lets us detect "did the
// route already set Cache-Control?" without a `finish` listener race.
// Mounted *before* /api/health so even the liveness probe gets the default.
app.use("/api", (_req, res, next) => {
  let routeSetCacheControl = false;
  const origSetHeader = res.setHeader.bind(res);
  res.setHeader = ((name: string, value: number | string | readonly string[]) => {
    if (typeof name === "string" && name.toLowerCase() === "cache-control") {
      routeSetCacheControl = true;
    }
    return origSetHeader(name, value);
  }) as typeof res.setHeader;
  const origEnd = res.end.bind(res);
  res.end = ((...args: unknown[]) => {
    if (!routeSetCacheControl && !res.getHeader("Cache-Control") && !res.headersSent) {
      origSetHeader("Cache-Control", "no-store");
    }
    return (origEnd as (...a: unknown[]) => unknown)(...args);
  }) as typeof res.end;
  next();
});

// Liveness — process is up. Intentionally does NOT touch the DB so a
// transient DB outage cannot cause the orchestrator to restart the
// process (which would only worsen recovery). Readiness is split into
// `/api/health/ready` and IS allowed to fail.
app.get("/api/health", (_req, res) => {
  if (!serverReady) {
    return res.status(503).json({ status: "starting" });
  }
  return res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

app.use((req, res, next) => {
  const host = req.hostname || req.headers.host?.split(":")[0] || "";
  if (host === "blog.exentax.com") {
    const blogPath = req.path === "/" ? "/blog" : `/blog${req.path}`;
    return res.redirect(301, `https://exentax.com${blogPath}`);
  }
  next();
});

app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()");
  next();
});

// SEO: normalise stray-slash URLs to their canonical form (see
// docs/seo/url-slash-policy.md). External links and old bookmarks may hit the
// site with a trailing slash, double slash, or duplicated language prefix —
// the SPA would otherwise render those as duplicate content or 404. We 301
// to the clean form so search engines and users converge on one canonical URL.
//
// Three bug families handled:
//   1. trailing slash       /es/blog/      -> /es/blog
//   2. double slashes       /es//blog      -> /es/blog
//   3. duplicated lang      /es/es/blog    -> /es/blog
//                           /en/es/blog/x  -> /es/blog/x  (drop the first prefix)
//
// Implementation note: also exported as `canonicalizeStraySlashPath` so the
// slash-hygiene CI gate can probe the live server with the same logic.
const STRAY_SLASH_LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;
const STRAY_SLASH_DUP_LANG_RE = new RegExp(
  `^/(${STRAY_SLASH_LANGS.join("|")})/(${STRAY_SLASH_LANGS.join("|")})(/|$)`,
);
export function canonicalizeStraySlashPath(p: string): string | null {
  let out = p;
  if (out.includes("//")) out = out.replace(/\/{2,}/g, "/");
  const m = out.match(STRAY_SLASH_DUP_LANG_RE);
  if (m) out = out.slice(("/" + m[1]).length);
  if (out.length > 1 && out.endsWith("/")) {
    out = out.replace(/\/+$/, "") || "/";
  }
  return out === p ? null : out;
}
app.use((req, res, next) => {
  // Only redirect safe, idempotent methods. 301 on POST/PUT/PATCH/DELETE is
  // dangerous because some clients replay the request as GET and silently
  // drop the body — better to let those land on the actual handler (or 404)
  // than to corrupt a write.
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const canonical = canonicalizeStraySlashPath(req.path);
  if (canonical !== null) {
    const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(301, canonical + qs);
  }
  next();
});

// SEO: 301-redirect legacy unprefixed Spanish URLs to their /es/... canonical.
// This eliminates duplicate-content risk and consolidates link equity.
// See docs/seo/audit-2026.md §2.1.
const LEGACY_ES_REDIRECTS: Record<string, string> = {
  "/sobre-las-llc":        "/es/sobre-las-llc",
  "/como-trabajamos":      "/es/como-trabajamos",
  "/nuestros-servicios":   "/es/servicios",
  "/servicios":            "/es/servicios",
  "/preguntas-frecuentes": "/es/preguntas-frecuentes",
  "/blog":                 "/es/blog",
  "/legal/terminos":       "/es/legal/terminos",
  "/legal/privacidad":     "/es/legal/privacidad",
  "/legal/cookies":        "/es/legal/cookies",
  "/legal/reembolsos":     "/es/legal/reembolsos",
  "/legal/disclaimer":     "/es/legal/disclaimer",
  // Task #23 + Task #16: hubs renamed per language to native segment + ITIN
  // slug switched to imperative-informal in FR/DE. All old subpage URLs 301
  // to their new home so search-engine link equity carries over and old
  // bookmarks keep working.
  "/es/nuestros-servicios":                          "/es/servicios",
  "/es/nuestros-servicios/llc-nuevo-mexico":         "/es/servicios/llc-nuevo-mexico",
  "/es/nuestros-servicios/llc-wyoming":              "/es/servicios/llc-wyoming",
  "/es/nuestros-servicios/llc-delaware":             "/es/servicios/llc-delaware",
  "/es/nuestros-servicios/llc-florida":              "/es/servicios/llc-florida",
  "/es/nuestros-servicios/obten-tu-itin":            "/es/servicios/obten-tu-itin",
  "/en/our-services":                                "/en/services",
  "/en/our-services/llc-new-mexico":                 "/en/services/llc-new-mexico",
  "/en/our-services/llc-wyoming":                    "/en/services/llc-wyoming",
  "/en/our-services/llc-delaware":                   "/en/services/llc-delaware",
  "/en/our-services/llc-florida":                    "/en/services/llc-florida",
  "/en/our-services/get-your-itin":                  "/en/services/get-your-itin",
  "/fr/nos-services":                                "/fr/services",
  "/fr/nos-services/llc-nouveau-mexique":            "/fr/services/llc-nouveau-mexique",
  "/fr/nos-services/llc-wyoming":                    "/fr/services/llc-wyoming",
  "/fr/nos-services/llc-delaware":                   "/fr/services/llc-delaware",
  "/fr/nos-services/llc-floride":                    "/fr/services/llc-floride",
  "/fr/nos-services/obtenir-votre-itin":             "/fr/services/obtiens-ton-itin",
  "/fr/services/obtenir-votre-itin":                 "/fr/services/obtiens-ton-itin",
  "/de/unsere-leistungen":                           "/de/leistungen",
  "/de/unsere-leistungen/llc-new-mexico":            "/de/leistungen/llc-new-mexico",
  "/de/unsere-leistungen/llc-wyoming":               "/de/leistungen/llc-wyoming",
  "/de/unsere-leistungen/llc-delaware":              "/de/leistungen/llc-delaware",
  "/de/unsere-leistungen/llc-florida":               "/de/leistungen/llc-florida",
  "/de/unsere-leistungen/itin-beantragen":           "/de/leistungen/hol-deine-itin",
  "/de/leistungen/itin-beantragen":                  "/de/leistungen/hol-deine-itin",
  "/pt/nossos-servicos":                             "/pt/servicos",
  "/pt/nossos-servicos/llc-novo-mexico":             "/pt/servicos/llc-novo-mexico",
  "/pt/nossos-servicos/llc-wyoming":                 "/pt/servicos/llc-wyoming",
  "/pt/nossos-servicos/llc-delaware":                "/pt/servicos/llc-delaware",
  "/pt/nossos-servicos/llc-florida":                 "/pt/servicos/llc-florida",
  "/pt/nossos-servicos/obtenha-seu-itin":            "/pt/servicos/obtenha-seu-itin",
  "/ca/els-nostres-serveis":                         "/ca/serveis",
  "/ca/els-nostres-serveis/llc-nou-mexic":           "/ca/serveis/llc-nou-mexic",
  "/ca/els-nostres-serveis/llc-wyoming":             "/ca/serveis/llc-wyoming",
  "/ca/els-nostres-serveis/llc-delaware":            "/ca/serveis/llc-delaware",
  "/ca/els-nostres-serveis/llc-florida":             "/ca/serveis/llc-florida",
  "/ca/els-nostres-serveis/obte-el-teu-itin":        "/ca/serveis/obte-el-teu-itin",
};
// Language-neutral shortcuts (e.g. for YouTube descriptions, social bios).
// These detect the visitor's Accept-Language header and 302-redirect to the
// matching localized URL — so the same shareable link works for any audience.
// 302 (not 301) because the destination depends on per-request headers, not
// on a stable canonical mapping.
const LANG_NEUTRAL_BOOK_PATHS = new Set(["/agendar", "/book"]);
const BOOK_SLUG_BY_LANG: Record<string, string> = {
  es: "agendar", en: "book", fr: "reserver",
  de: "buchen",  pt: "agendar", ca: "agendar",
};
function detectLangFromAcceptLanguage(header: string | undefined): string {
  const accept = (header || "").toLowerCase();
  for (const part of accept.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2);
    if (BOOK_SLUG_BY_LANG[code]) return code;
  }
  return "es";
}

app.use((req, res, next) => {
  const p = req.path;
  const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
  if (LANG_NEUTRAL_BOOK_PATHS.has(p)) {
    const lang = detectLangFromAcceptLanguage(req.headers["accept-language"] as string | undefined);
    return res.redirect(302, `/${lang}/${BOOK_SLUG_BY_LANG[lang]}${qs}`);
  }
  const direct = LEGACY_ES_REDIRECTS[p];
  if (direct) return res.redirect(301, direct + qs);
  if (p.startsWith("/blog/") && p.length > 6) {
    return res.redirect(301, `/es${p}${qs}`);
  }
  next();
});

// Legacy slug redirects (Medium #6). Map lives in
// server/middleware/legacy-redirects.json so non-engineers can edit it. Runs
// before the static/SPA fallback handler so renamed slugs return a clean 301
// instead of falling through to the SPA and rendering a 404 page that Google
// would index. See server/middleware/legacy-redirects.ts header for shape.
app.use(legacyRedirects);

app.use((req, res, next) => {
  const url = req.path.toLowerCase();
  // Cache policy: in dev we want hot-reload-friendly headers (no-cache);
  // in any non-development env (production OR staging) we cache for 24h.
  // `isProd` (declared above) covers production explicitly; here we use
  // `isDev` semantics — the same constant is reused for the static-serve
  // branch below to keep the policy consistent across the file.
  const cacheable = !isDev;
  if (url.match(/\.(ico|png|svg|webp)$/) && (url.includes("favicon") || url.includes("icon") || url.includes("apple-touch") || url === "/og-image.png")) {
    if (cacheable) {
      res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
    } else {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
    }
  }
  if (url === "/site.webmanifest") {
    res.setHeader("Cache-Control", cacheable
      ? "public, max-age=86400, must-revalidate"
      : "no-cache, must-revalidate");
    res.setHeader("Content-Type", "application/manifest+json");
  }
  next();
});

// Discord interactions endpoint must receive the *raw* request body so we
// can verify the Ed25519 signature byte-for-byte. This middleware runs
// BEFORE express.json so the body buffer is preserved on `req.rawBody`
// for /api/discord/interactions; for every other route it is a no-op.
app.use("/api/discord/interactions", express.raw({ type: "*/*", limit: "256kb" }), (req, _res, next) => {
  if (Buffer.isBuffer(req.body)) {
    (req as Request & { rawBody?: Buffer }).rawBody = req.body;
    try {
      req.body = req.body.length > 0 ? JSON.parse(req.body.toString("utf8")) : {};
    } catch {
      req.body = {};
    }
  }
  next();
});

app.use((req, res, next) => {
  // Discord interactions already had their raw body parsed above; let it
  // through without re-running the JSON parser (the request stream is
  // already consumed and `req.body` is the canonical JSON).
  if (req.path === "/api/discord/interactions") return next();
  const limit = "100kb";
  express.json({ limit })(req, res, (err) => {
    if (err) {
      const lang = resolveRequestLang(req);
      if (err.type === "entity.parse.failed") {
        return res.status(400).json({ ok: false, error: backendLabel("invalidJsonBody", lang), code: "INVALID_JSON" });
      }
      if (err.type === "entity.too.large") {
        return res.status(413).json({ ok: false, error: backendLabel("payloadTooLarge", lang), code: "PAYLOAD_TOO_LARGE" });
      }
      return res.status(400).json({ ok: false, error: backendLabel("requestProcessingError", lang), code: "REQUEST_ERROR" });
    }
    next();
  });
});

app.use(express.urlencoded({ extended: false, limit: "100kb" }));

import { autoSanitizeMiddleware } from "./sanitize-middleware";
app.use(autoSanitizeMiddleware);

import { getRateLimitStore, type RateLimitStore } from "./rate-limit-store";

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 200;

let _globalRlStore: RateLimitStore | null = null;
getRateLimitStore().then(s => { _globalRlStore = s; }).catch(err => {
  logger.warn(`[rate-limit] Failed to initialize store, using in-memory fallback: ${err instanceof Error ? err.message : String(err)}`, "rate-limit");
});

const _globalRlFallback = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAP_MAX = 10_000;

function getRateLimitKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    const first = forwarded.split(",")[0]?.trim();
    if (first && first !== "unknown") return first;
  }
  return req.ip || "unknown";
}

app.use("/api/", async (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");

  const key = getRateLimitKey(req);

  let allowed = true;
  if (_globalRlStore) {
    try {
      allowed = await _globalRlStore.check("globalApi", key, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    } catch {
      const now = Date.now();
      const entry = _globalRlFallback.get(key);
      if (!entry || now > entry.resetAt) {
        _globalRlFallback.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        allowed = true;
      } else {
        entry.count++;
        allowed = entry.count <= RATE_LIMIT_MAX;
      }
    }
  } else {
    const now = Date.now();
    const entry = _globalRlFallback.get(key);
    if (!entry || now > entry.resetAt) {
      _globalRlFallback.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      if (_globalRlFallback.size > RATE_LIMIT_MAP_MAX) {
        let toRemove = _globalRlFallback.size - RATE_LIMIT_MAP_MAX;
        for (const k of _globalRlFallback.keys()) {
          if (toRemove <= 0) break;
          _globalRlFallback.delete(k);
          toRemove--;
        }
      }
      allowed = true;
    } else {
      entry.count++;
      allowed = entry.count <= RATE_LIMIT_MAX;
    }
  }

  if (!allowed) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ ok: false, error: backendLabel("tooManyRequestsRetry", resolveRequestLang(req)), code: "RATE_LIMITED" });
  }
  next();
});

activeIntervals.push(setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of _globalRlFallback) {
    if (now > entry.resetAt) _globalRlFallback.delete(key);
  }
  if (_globalRlStore) _globalRlStore.cleanup().catch(err => {
    logger.warn(`[rate-limit] Store cleanup failed: ${err instanceof Error ? err.message : String(err)}`, "rate-limit");
  });
}, 60_000));


registerCleanupIntervals(activeIntervals);

// Start the persistent email retry worker (drains email_retry_queue every minute).
activeIntervals.push(startEmailRetryWorker(60_000));

// Sanity-check email-asset env vars at boot (loud Discord alert if the
// drip lead-magnet still points at the default placeholder in prod).
assertGuidePdfUrlReady();

// Start the drip-sequence worker (advances drip_enrollments steps 2–6
// on the day-3/6/9/12/15 cadence). Step 1 fires inline at enroll time.
activeIntervals.push(startDripWorker(60_000));

// Task #32 — evaluate Discord interaction-telemetry alert rules every minute.
// Closes the observability loop opened by Task #12 (signature failures,
// replay rejections, unauthorised attempts, queue drops) by posting a
// throttled `system_error` notification to #exentax-errores when any of
// those counters cross their per-minute threshold. Thresholds and timing
// are documented in docs/deploy/DISCORD-SETUP.md §11 and overridable via
// `DISCORD_ALERT_THRESHOLD_*`, `DISCORD_ALERT_WINDOW_SECONDS` and
// `DISCORD_ALERT_REMINDER_MINUTES` env vars.
activeIntervals.push(startDiscordAlertWorker(60_000));

// Start the persistent Discord outbound worker. Probes the persistence
// backend (Postgres → memory fallback for envs without DATABASE_URL),
// rehydrates the queue gauge from any rows that survived a previous
// restart, and starts the drain timer so deferred sends resume
// automatically. Fire-and-forget — the worker registers its own
// setInterval (with .unref()) and any startup error is logged inside.
void startDiscordQueueWorker().catch((err) => {
  logger.warn(`Discord queue worker startup failed: ${err instanceof Error ? err.message : String(err)}`, "discord");
});


app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    if (bodyJson && typeof bodyJson === "object" && !Array.isArray(bodyJson)) {
      capturedJsonResponse = bodyJson;
    } else if (Array.isArray(bodyJson) && bodyJson.length > 20) {
      capturedJsonResponse = { _truncated: true, count: bodyJson.length };
    } else {
      capturedJsonResponse = bodyJson;
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      const safeBody = path.includes("/login") || path.includes("/password") || path.includes("/verify")
        ? undefined
        : capturedJsonResponse;
      logger.request(req.method, path, res.statusCode, duration, safeBody);
      // Skip metrics recording on the metrics endpoint itself to avoid
      // self-amplification when scrapers poll frequently.
      if (path !== "/api/metrics") {
        try {
          // `req.route?.path` is the *registered* template (e.g.
          // `/booking/:id`) so cardinality stays bounded by the route table.
          // Express also exposes `req.baseUrl` for sub-routers; combining
          // both reconstructs the full template.
          const tmpl = req.route?.path
            ? `${req.baseUrl || ""}${req.route.path}`
            : undefined;
          recordHttpRequest(req.method, res.statusCode, duration, tmpl);
        } catch (err) {
          // Metrics recording is best-effort: a failure here MUST NOT break
          // the request lifecycle, but it must also not be silent — a broken
          // counter would otherwise hide an entire dimension of traffic.
          logger.warn(`metrics recordHttpRequest failed: ${err instanceof Error ? err.message : String(err)}`, "metrics");
        }
      }
    }
  });

  next();
});

// Observability endpoints: readiness, metrics, client-error ingestion.
// Mounted after JSON body parsing (needed by /api/client-errors) but before
// `registerRoutes` so they are available even if a downstream registration
// fails or is unauthenticated.
registerObservabilityRoutes(app, () => serverReady);

const port = parseInt(process.env.PORT || "5000", 10);
httpServer.listen(
  {
    port,
    host: "0.0.0.0",
  },
  () => {
    logger.info(`listening on port ${port}`, "express");
  },
);

(async () => {
  try {
    await runColumnMigrations();
    await registerRoutes(httpServer, app, activeIntervals);

    // Static-serve branch fires whenever we're NOT in dev. This covers
    // both real `production` deploys and any non-development env (e.g.
    // staging) where the Vite dev server should NOT be mounted.
    if (!isDev) {
      await serveStatic(app);

      // Sitemap-level ping. Detects real changes in /sitemap.xml between
      // restarts (hash-based) and submits sitemap URLs to IndexNow only when
      // the content actually changed. Google's public ping endpoint was
      // deprecated in 2023 and Bing's in 2022 — both are documented inside
      // server/sitemap-ping.ts. The old unconditional Bing ping was removed
      // because it returned 410 in 2026 and pinged on every restart.
      setTimeout(() => {
        const localBase = `http://127.0.0.1:${port}`;
        import("./sitemap-ping").then(({ pingSitemapIfChanged }) => {
          pingSitemapIfChanged(localBase).catch((e) =>
            logger.warn(
              `sitemap-ping invocation failed: ${e instanceof Error ? e.message : String(e)}`,
              "sitemap-ping",
            ),
          );
        }).catch((e) =>
          logger.warn(
            `sitemap-ping module load failed: ${e instanceof Error ? e.message : String(e)}`,
            "sitemap-ping",
          ),
        );
      }, 5000);

      setTimeout(() => {
        import("./indexnow").then(({ pingIndexNowForNewArticles }) => {
          pingIndexNowForNewArticles().catch(e =>
            logger.warn(`IndexNow ping failed: ${e instanceof Error ? e.message : String(e)}`, "indexnow"),
          );
        }).catch(e => logger.warn(`IndexNow module load failed: ${e instanceof Error ? e.message : String(e)}`, "indexnow"));
      }, 7000);

      // Per-article Google Indexing API submission (opt-in via
      // GOOGLE_INDEXING_API_ENABLE=1). Parallel to IndexNow but for Google.
      // See server/google-indexing.ts for the full rationale (Indexing API
      // is officially JobPosting/BroadcastEvent only, so this is opt-in).
      setTimeout(() => {
        import("./google-indexing").then(({ pingGoogleIndexingForNewArticles }) => {
          pingGoogleIndexingForNewArticles().catch(e =>
            logger.warn(
              `google-indexing ping failed: ${e instanceof Error ? e.message : String(e)}`,
              "google-indexing",
            ),
          );
        }).catch(e =>
          logger.warn(
            `google-indexing module load failed: ${e instanceof Error ? e.message : String(e)}`,
            "google-indexing",
          ),
        );
      }, 9000);

      // Indexing audit auto-publish (Task #26).
      // Once after each deploy, run scripts/seo-indexing-publish.mjs against
      // ourselves. The script writes the report to <cwd>/uploads/reports/indexing/
      // (also configurable via INDEXING_REPORTS_DIR). Critical findings show up
      // as a `[indexing-publish] WARN ...` line in the deploy logs. Disable by
      // setting INDEXING_AUDIT_DISABLE=1.
      if (process.env.INDEXING_AUDIT_DISABLE !== "1") {
        setTimeout(() => {
          (async () => {
            try {
              const { spawn } = await import("node:child_process");
              const { existsSync } = await import("node:fs");
              const path = await import("node:path");
              const candidates = [
                path.resolve(process.cwd(), "exentax-web/scripts/seo-indexing-publish.mjs"),
                path.resolve(process.cwd(), "scripts/seo-indexing-publish.mjs"),
              ];
              const script = candidates.find((p) => existsSync(p));
              if (!script) {
                logger.warn(`indexing-publish: script not found in ${candidates.join(", ")}`, "seo");
                return;
              }
              const baseUrl = process.env.BASE_URL || `http://127.0.0.1:${port}`;
              const child = spawn(process.execPath, [script], {
                stdio: ["ignore", "pipe", "pipe"],
                env: { ...process.env, BASE_URL: baseUrl },
              });
              child.stdout?.on("data", (b) => {
                for (const line of b.toString().split(/\r?\n/)) if (line) logger.info(line, "seo");
              });
              child.stderr?.on("data", (b) => {
                for (const line of b.toString().split(/\r?\n/)) {
                  if (!line) continue;
                  if (line.includes("[indexing-publish] WARN")) logger.warn(line, "seo");
                  else logger.info(line, "seo");
                }
              });
              child.on("error", (e) =>
                logger.warn(`indexing-publish spawn error: ${e.message}`, "seo"),
              );
              child.on("exit", (code) =>
                logger.info(`indexing-publish exited with code ${code}`, "seo"),
              );
            } catch (e) {
              logger.warn(
                `indexing-publish failed to launch: ${e instanceof Error ? e.message : String(e)}`,
                "seo",
              );
            }
          })();
        }, 15000);
      }
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const lang = resolveRequestLang(req);

      logger.error(`Internal Server Error: ${err.message || err}`, "express", err);

      if (status >= 500) {
        notifyCriticalError({
          context: "express",
          message: err.message || String(err),
          code: err.code || "SERVER_ERROR",
          path: req.path,
          method: req.method,
          statusCode: status,
          stack: err.stack || null,
        });
      }

      if (res.headersSent) {
        return next(err);
      }

      const safeMessage = status >= 500
        ? backendLabel("internalServerError", lang)
        : (err.expose ? err.message : backendLabel("requestError", lang));
      const code = err.code || (status >= 500 ? "SERVER_ERROR" : "REQUEST_ERROR");

      // For HTML/document requests, return a branded error page instead of
      // raw JSON so the user sees something usable in the browser. API and
      // fetch/XHR clients still get the JSON envelope.
      const accept = String(req.headers.accept || "");
      const wantsHtml =
        !req.path.startsWith("/api/") &&
        accept.includes("text/html");
      if (wantsHtml) {
        const isFiveHundred = status >= 500;
        const titles: Record<string, { title: string; desc: string; cta: string }> = {
          es: { title: isFiveHundred ? "Algo ha fallado" : "Solicitud no válida", desc: isFiveHundred ? "Hemos tenido un error inesperado en el servidor. Ya estamos avisados — vuelve a intentarlo en unos segundos." : "La solicitud no se ha podido procesar.", cta: "Volver al inicio" },
          en: { title: isFiveHundred ? "Something went wrong" : "Bad request", desc: isFiveHundred ? "An unexpected server error occurred. We've been notified — please try again in a few seconds." : "The request could not be processed.", cta: "Go to home" },
          ca: { title: isFiveHundred ? "Alguna cosa ha fallat" : "Sol·licitud no vàlida", desc: isFiveHundred ? "Hi ha hagut un error inesperat al servidor. Ja n'estem assabentats — torna-ho a provar d'aquí uns segons." : "La sol·licitud no s'ha pogut processar.", cta: "Tornar a l'inici" },
          de: { title: isFiveHundred ? "Etwas ist schiefgelaufen" : "Ungültige Anfrage", desc: isFiveHundred ? "Es gab einen unerwarteten Serverfehler. Wir wurden benachrichtigt — bitte versuche es in wenigen Sekunden erneut." : "Die Anfrage konnte nicht verarbeitet werden.", cta: "Zur Startseite" },
          fr: { title: isFiveHundred ? "Une erreur est survenue" : "Requête invalide", desc: isFiveHundred ? "Une erreur serveur inattendue s'est produite. Nous avons été notifiés — réessaie dans quelques secondes." : "La requête n'a pas pu être traitée.", cta: "Retour à l'accueil" },
          pt: { title: isFiveHundred ? "Algo deu errado" : "Requisição inválida", desc: isFiveHundred ? "Ocorreu um erro inesperado no servidor. Já fomos notificados — tente novamente em alguns segundos." : "A requisição não pôde ser processada.", cta: "Voltar ao início" },
        };
        const ui = titles[lang] || titles.es;
        const homeHref = `/${lang}`;
        const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${ui.title} | Exentax</title><style>html,body{margin:0;padding:0;background:#F8F7F4;color:#0A0F0C;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;-webkit-font-smoothing:antialiased}main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;text-align:center}h1{font-family:'Space Grotesk',Inter,sans-serif;font-weight:700;font-size:clamp(28px,5vw,40px);margin:0 0 12px;letter-spacing:-0.02em}.code{font-family:'Space Grotesk',Inter,sans-serif;font-weight:800;font-size:clamp(56px,10vw,88px);color:#00E510;line-height:1;margin:0 0 8px}p{color:#4A5C52;font-size:16px;line-height:1.6;max-width:520px;margin:0 auto 28px}a{display:inline-flex;align-items:center;gap:8px;background:#00E510;color:#0B0D0C;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:9999px;min-height:44px;box-shadow:0 4px 20px rgba(0,229,16,0.14)}a:hover{background:#00D10E}</style></head><body><main><div><p class="code">${status}</p><h1>${ui.title}</h1><p>${ui.desc}</p><a href="${homeHref}">${ui.cta}</a></div></main></body></html>`;
        res.status(status).setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        return res.end(html);
      }

      return res.status(status).json({ ok: false, error: safeMessage, code });
    });

    serverReady = true;
    logger.info("fully initialized", "express");

    // Branding env audit: in PRODUCTION every contact / social URL must be
    // explicitly set so a config drift on one channel (Instagram handle
    // changed, ADMIN_EMAIL rotated, etc.) doesn't silently fall back to
    // the dev defaults. In dev / staging missing vars are expected and
    // we stay quiet.
    const fallbacks = getBrandingEnvFallbacks();
    if (isProd && fallbacks.length > 0) {
      logger.warn(
        `[branding] ${fallbacks.length} env var(s) using hard-coded fallback in production: ${fallbacks.join(", ")} — set these in the production environment`,
        "startup",
      );
    }

    import("./storage").then(({ seedInitialLegalVersions }) => {
      seedInitialLegalVersions().then(() => logger.info("Legal document versions seeded.", "startup")).catch(e => logger.error("legal version seed failed", "startup", e));
    });

    async function recoverPendingReminders(reason: "startup" | "sweep") {
      try {
        const { getFutureAgenda, markReminderSent, unmarkReminderSent, getAgendaById } = await import("./storage");
        const { isCancelledStatus, AGENDA_STATUSES } = await import("./server-constants");
        const { scheduleReminderEmail, getMeetingTimestampMs, getEndTime } = await import("./route-helpers");
        const { sendReminderEmail } = await import("./email");
        const { SITE_URL } = await import("./server-constants");
        const now = Date.now();
        // getFutureAgenda already filters: meetingDate >= today AND status not cancelled/no_show AND reminderSent=false
        const allMeetings = await getFutureAgenda();
        let scheduled = 0;
        let sentNow = 0;
        for (const m of allMeetings) {
          if (!m.meetingDate || !m.startTime || !m.email) {
            logger.warn(`Skipping reminder recovery for booking ${m.id} — missing meetingDate/startTime/email`, "reminder");
            continue;
          }
          const meetingMs = getMeetingTimestampMs(m.meetingDate, m.startTime);
          // Mirror the 24h offset used by `scheduleReminderEmail` so the
          // recovery sweep agrees with the in-process timer about WHEN
          // a reminder is "due" (otherwise a restart could either drop
          // a reminder we already fired or fire one twice).
          const reminderMs = meetingMs - 24 * 60 * 60 * 1000;
          const endTime = m.endTime || getEndTime(m.startTime);
          const manageUrl = m.manageToken ? `${SITE_URL}/booking/${m.id}?token=${m.manageToken}` : null;
          const payload = {
            clientName: m.name,
            clientEmail: m.email,
            date: m.meetingDate,
            startTime: m.startTime,
            endTime,
            meetLink: m.googleMeet || null,
            manageUrl,
            language: m.language || null,
            agendaId: m.id,
          };
          if (reminderMs <= now && meetingMs > now) {
            // Reminder window passed while the process was down. Atomically
            // claim the row first (markReminderSent is conditional on
            // reminder_sent=false). If we lose the claim, another worker has
            // it. If we win but the email fails, revert the flag so the next
            // sweep retries instead of silently dropping the reminder.
            // Re-fetch the row to make sure it hasn't been cancelled or
            // rescheduled between the SELECT and now (mirrors timer guards).
            const fresh = await getAgendaById(m.id);
            if (!fresh || isCancelledStatus(fresh.status) || fresh.status === AGENDA_STATUSES.NO_SHOW) continue;
            if (fresh.meetingDate !== m.meetingDate || fresh.startTime !== m.startTime) continue;
            const claimed = await markReminderSent(m.id);
            if (!claimed) continue;
            try {
              await sendReminderEmail(payload);
              sentNow++;
            } catch (err) {
              logger.error(`Failed to send overdue reminder for booking ${m.id} — releasing claim for retry`, "reminder", err);
              try { await unmarkReminderSent(m.id); } catch (revertErr) {
                logger.error(`Failed to release reminder claim for booking ${m.id}`, "reminder", revertErr);
              }
            }
            continue;
          }
          if (reminderMs <= now) continue;
          // scheduleReminderEmail is idempotent (replaces an existing timer for the same key)
          scheduleReminderEmail(payload);
          scheduled++;
        }
        if (scheduled > 0 || sentNow > 0) {
          logger.info(`[${reason}] Reminders reconciled — scheduled=${scheduled} sentNow=${sentNow}`, "reminder");
        }
      } catch (err) {
        logger.error(`Failed to recover pending reminders (${reason})`, "reminder", err);
      }
    }

    void recoverPendingReminders("startup");
    // Periodic sweep: catches new bookings whose timer was lost, long-window
    // reminders that exceeded MAX_TIMEOUT, and any drift between memory and DB.
    activeIntervals.push(setInterval(() => { void recoverPendingReminders("sweep"); }, 60 * 60 * 1000));

    // Reportes periódicos (semanal lunes 9:00 + mensual día 1 9:00) → canal
    // Discord #exentax-actividad. Ver server/reports/periodic-reports.ts.
    try {
      const { startPeriodicReportsScheduler } = await import("./scheduled/periodic-reports");
      activeIntervals.push(startPeriodicReportsScheduler());
      logger.info("Periodic reports scheduler started (weekly Mon 09:00, monthly day 1 09:00, yearly hook audit Jan 15 09:00)", "reports");
    } catch (err) {
      logger.warn(`Periodic reports scheduler failed to start (non-fatal): ${err instanceof Error ? err.message : String(err)}`, "reports");
    }

    // Newsletter broadcast worker (drena jobs de campañas in_progress).
    // Trigger manual vía slash command /newsletter desde Discord.
    try {
      const { startBroadcastWorker } = await import("./scheduled/newsletter-broadcast");
      const t = startBroadcastWorker();
      if (t) activeIntervals.push(t);
      logger.info("Newsletter broadcast worker started", "newsletter");
    } catch (err) {
      logger.warn(`Newsletter broadcast worker failed to start (non-fatal): ${err instanceof Error ? err.message : String(err)}`, "newsletter");
    }

    // Recordatorio "Reserva incompleta": cada 5 min recoge drafts del flujo
    // de booking que no se llegaron a confirmar y manda el email de rescate.
    try {
      const { startIncompleteBookingsScheduler } = await import("./scheduled/incomplete-bookings");
      activeIntervals.push(startIncompleteBookingsScheduler());
      logger.info("Incomplete-booking reminder scheduler started (sweep every 5 min)", "incomplete-booking");
    } catch (err) {
      logger.warn(`Incomplete-booking scheduler failed to start (non-fatal): ${err instanceof Error ? err.message : String(err)}`, "incomplete-booking");
    }

    // GDPR retention purge: every 6h drops rows past their retention
    // window (visits 180d, consent_log 36mo, calculations 24mo,
    // unsubscribed newsletter 12mo). See `docs/compliance/README.md`
    // for the full retention matrix.
    try {
      const { startRetentionPurgeScheduler } = await import("./scheduled/retention-purge");
      activeIntervals.push(startRetentionPurgeScheduler());
      logger.info("Retention-purge scheduler started (sweep every 6h)", "retention");
    } catch (err) {
      logger.warn(`Retention-purge scheduler failed to start (non-fatal): ${err instanceof Error ? err.message : String(err)}`, "retention");
    }

    // Daily booking-system safety check (06:00 server time). Detects drift
    // between agenda, booking_drafts, blocked days, and Google Calendar
    // events. Silent on a clean run; posts a single embed to
    // `#sistema-errores` if any bucket has findings. See `server/scheduled/
    // reconcile-zombies.ts` and §7c of `docs/discord-bot-agenda.md`.
    try {
      const { startReconcileZombiesScheduler } = await import("./scheduled/reconcile-zombies");
      activeIntervals.push(startReconcileZombiesScheduler());
      logger.info("Reconcile-zombies scheduler started (daily 06:00 dry-run)", "reconcile");
    } catch (err) {
      logger.warn(`Reconcile-zombies scheduler failed to start (non-fatal): ${err instanceof Error ? err.message : String(err)}`, "reconcile");
    }

  } catch (err) {
    logger.error(`Fatal startup error: ${(err as Error).message}`, "express");
    process.exit(1);
  }
})();

function gracefulShutdown(signal: string) {
  logger.warn(`${signal} received — shutting down gracefully...`, "shutdown");
  serverReady = false;
  for (const iv of activeIntervals) clearInterval(iv);
  activeIntervals.length = 0;
  clearActiveTimers();
  // Discord retry timers live in their own module-local Set (memory-only
  // backoff). Clear them so SIGTERM doesn't leave the event loop awake
  // for up to backoffMs after every other interval has been cancelled.
  clearPendingDiscordTimers();
  httpServer.close(async () => {
    try { await closePool(); logger.info("DB pool closed.", "shutdown"); } catch (e) { logger.error("Pool close error", "shutdown", e); }
    logger.info("HTTP server closed.", "shutdown");
    process.exit(0);
  });
  const forceTimer = setTimeout(() => {
    logger.error("Forced shutdown after timeout.", "shutdown");
    process.exit(1);
  }, 10_000);
  forceTimer.unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

/**
 * Process-level error policy — DOCUMENTED, not improvised.
 *
 * `unhandledRejection`: log + notify Discord, then keep running.
 *   For an Express web app a single mishandled promise (e.g. a route that
 *   forgot `await` on a side-effect) must NOT tear down the pod and drop
 *   every in-flight request. The alert goes to #sistema-errores so an
 *   operator sees it within a minute and can decide whether the offending
 *   handler needs a hotfix; the pod keeps serving traffic in the meantime.
 *
 * `uncaughtException`: split by error code.
 *   - Network-level transient codes (ECONNRESET / EPIPE / ENOTFOUND /
 *     ECONNREFUSED / ETIMEDOUT / EAI_AGAIN) almost always come from a
 *     downstream socket dying mid-request and are NOT a sign that local
 *     state is corrupt → keep running, log a warn.
 *   - Anything else might mean local invariants are broken (e.g. a
 *     ReferenceError in a hot path) → notify and gracefully shutdown.
 *
 * This is the SAME policy used by booking, drip and email retry workers
 * (see header of each). Centralised here so any future change touches
 * one place.
 */
function handleUnhandledRejection(reason: any): void {
  // Mirrors the legacy inline handler: truthy `reason.message` (any type) is
  // preferred, with `String(reason)` as fallback. `reason.code` is forwarded
  // verbatim — Discord's notifyCriticalError tolerates any JSON-serialisable
  // shape there. Tightening the type checks would silently change the alert
  // payload for non-Error rejections (e.g. plain object throws).
  const message = reason?.message || String(reason);
  const code = reason?.code || null;
  logger.error(`Unhandled promise rejection: ${message}`, "process");
  notifyCriticalError({ context: "unhandledRejection", message, code });
}

const RECOVERABLE_NET_CODES = ["ECONNRESET", "EPIPE", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"] as const;

function handleUncaughtException(err: Error): void {
  logger.error(`Uncaught exception: ${err.message}`, "process", err);
  const errCode = (err as NodeJS.ErrnoException).code;
  const isRecoverable = RECOVERABLE_NET_CODES.some(code =>
    err.message?.includes(code) || errCode === code
  );
  if (isRecoverable) {
    logger.warn("Recoverable network error — continuing.", "process");
    return;
  }
  notifyCriticalError({ context: "uncaughtException", message: err.message, code: errCode || null });
  gracefulShutdown("uncaughtException");
}

process.on("unhandledRejection", handleUnhandledRejection);
process.on("uncaughtException", handleUncaughtException);
