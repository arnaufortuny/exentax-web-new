import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { closePool, db, runColumnMigrations } from "./db";
import { logger } from "./logger";
import { sql } from "drizzle-orm";
import { registerCleanupIntervals, clearActiveTimers } from "./route-helpers";
import { backendLabel, resolveRequestLang } from "./routes/shared";
import { notifyCriticalError } from "./discord";

const REQUIRED_ENV_VARS: Array<{ name: string; prodOnly?: boolean; hint: string }> = [
  { name: "DATABASE_URL", hint: "PostgreSQL connection string" },
];

const isProd = process.env.NODE_ENV === "production";
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
      scriptSrcAttr: ["'unsafe-inline'"],
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
  if (!serverReady && req.url !== "/api/health") {
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

app.get("/api/health", async (_req, res) => {
  if (!serverReady) {
    return res.status(503).json({ status: "starting" });
  }
  try {
    await db.execute(sql`SELECT 1`);
    return res.json({ status: "ok", db: "connected" });
  } catch {
    return res.status(503).json({ status: "degraded", db: "unreachable" });
  }
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

app.use((req, res, next) => {
  const p = req.path;
  if (p.length > 1 && p.endsWith("/")) {
    const clean = p.replace(/\/+$/, "") || "/";
    const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(301, clean + qs);
  }
  next();
});

app.use((req, res, next) => {
  const url = req.path.toLowerCase();
  if (url.match(/\.(ico|png|svg|webp)$/) && (url.includes("favicon") || url.includes("icon") || url.includes("apple-touch") || url === "/og-image.png")) {
    if (process.env.NODE_ENV === "development") {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.setHeader("Pragma", "no-cache");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
    }
  }
  if (url === "/site.webmanifest") {
    if (process.env.NODE_ENV === "development") {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
    }
    res.setHeader("Content-Type", "application/manifest+json");
  }
  next();
});

app.use((req, res, next) => {
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
getRateLimitStore().then(s => { _globalRlStore = s; }).catch(() => {});

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
  if (_globalRlStore) _globalRlStore.cleanup().catch(() => {});
}, 60_000));


registerCleanupIntervals(activeIntervals);


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
    }
  });

  next();
});

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

    const isProduction = process.env.NODE_ENV !== "development";
    if (isProduction) {
      await serveStatic(app);

      setTimeout(() => {
        const urls = [
          "https://www.google.com/ping?sitemap=https%3A%2F%2Fexentax.com%2Fsitemap.xml",
          "https://www.bing.com/ping?sitemap=https%3A%2F%2Fexentax.com%2Fsitemap.xml",
        ];
        urls.forEach(url => fetch(url).catch(e => logger.info(`Sitemap ping failed for ${url}: ${e instanceof Error ? e.message : String(e)}`, "express")));
        logger.info("Sitemap pings sent (Google + Bing)", "express");
      }, 5000);
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
      return res.status(status).json({ ok: false, error: safeMessage, code });
    });

    serverReady = true;
    logger.info("fully initialized", "express");

    import("./storage").then(({ seedInitialLegalVersions }) => {
      seedInitialLegalVersions().then(() => logger.info("Legal document versions seeded.", "startup")).catch(e => logger.error("legal version seed failed", "startup", e));
    });

    (async function recoverPendingReminders() {
      try {
        const { getFutureAgenda } = await import("./storage");
        const { scheduleReminderEmail, getMeetingTimestampMs, getEndTime } = await import("./route-helpers");
        const now = Date.now();
        const allMeetings = await getFutureAgenda();
        let scheduled = 0;
        for (const m of allMeetings) {
          if (!m.meetingDate || !m.startTime || !m.email) {
            logger.warn(`Skipping reminder recovery for booking ${m.id} — missing meetingDate/startTime/email`, "reminder");
            continue;
          }
          const meetingMs = getMeetingTimestampMs(m.meetingDate, m.startTime);
          const reminderMs = meetingMs - 3 * 60 * 60 * 1000;
          if (reminderMs <= now) continue;
          const endTime = m.endTime || getEndTime(m.startTime);
          scheduleReminderEmail({
            clientName: m.name,
            clientEmail: m.email,
            date: m.meetingDate,
            startTime: m.startTime,
            endTime,
            meetLink: m.googleMeet || null,
            manageUrl: null,
            language: null,
            agendaId: m.id,
          });
          scheduled++;
        }
        if (scheduled > 0) logger.info(`Recovered ${scheduled} pending meeting reminders`, "express");
      } catch (err) {
        logger.error("Failed to recover pending reminders", "startup", err);
      }
    })();

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

process.on("unhandledRejection", (reason: any) => {
  const message = reason?.message || String(reason);
  logger.error(`Unhandled promise rejection: ${message}`, "process");
  notifyCriticalError({ context: "unhandledRejection", message, code: reason?.code || null });
});

process.on("uncaughtException", (err: Error) => {
  logger.error(`Uncaught exception: ${err.message}`, "process", err);
  const recoverable = ["ECONNRESET", "EPIPE", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN"];
  if (recoverable.some(code => err.message?.includes(code) || (err as NodeJS.ErrnoException).code === code)) {
    logger.warn("Recoverable network error — continuing.", "process");
    return;
  }
  notifyCriticalError({ context: "uncaughtException", message: err.message, code: (err as NodeJS.ErrnoException).code || null });
  gracefulShutdown("uncaughtException");
});
