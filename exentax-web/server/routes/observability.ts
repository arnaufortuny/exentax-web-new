/**
 * Observability endpoints — additive, no business logic.
 *
 *   GET  /api/health          → liveness (process is up; never touches DB)
 *   GET  /api/health/ready    → readiness (DB reachable, migrations done, queue worker alive)
 *   GET  /api/metrics         → Prometheus-style metrics text snapshot
 *   POST /api/client-errors   → tiny ingestion endpoint for browser-side errors
 */
import type { Express, Request, Response } from "express";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { logger } from "../logger";
import { snapshot, renderPrometheus, setEmailRetryQueueSize, incClientError } from "../metrics";
import { getEmailRetryQueueSize, getEmailWorkerHeartbeat } from "../email-retry-queue";
import { getRegisteredBreakers } from "../circuit-breaker";
import { getDiscordQueueSize } from "../discord";
import { checkCsrfOrigin } from "../route-helpers";

interface ReadinessResult {
  status: "ready" | "degraded";
  ready: boolean;
  checks: Record<string, { ok: boolean; message?: string }>;
}

async function evaluateReadiness(): Promise<ReadinessResult> {
  const checks: ReadinessResult["checks"] = {};

  // DB reachability — must complete in <2s; the pool query_timeout is 30s
  // so we add our own short timeout to keep readiness probes fast.
  try {
    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, reject) => setTimeout(() => reject(new Error("db check timed out")), 2_000)),
    ]);
    checks.db = { ok: true };
  } catch (err) {
    checks.db = { ok: false, message: err instanceof Error ? err.message : String(err) };
  }

  // Circuit breakers — readiness degrades if any critical breaker is OPEN.
  const breakers = getRegisteredBreakers();
  const tripped = breakers.filter(b => b.state === "open").map(b => b.name);
  checks.breakers = {
    ok: tripped.length === 0,
    message: tripped.length === 0 ? undefined : `open: ${tripped.join(", ")}`,
  };

  // Email retry worker — must be running and have ticked at least once
  // within ~3 intervals. We allow `lastDrainAt === 0` for the first interval
  // after boot (the worker fires its first immediate drain ~5s after start).
  const hb = getEmailWorkerHeartbeat();
  const grace = Math.max(hb.intervalMs * 3, 30_000);
  const since = hb.lastDrainAt === 0 ? 0 : Date.now() - hb.lastDrainAt;
  const stale = hb.lastDrainAt !== 0 && since > grace;
  checks.emailWorker = {
    ok: hb.running && !stale,
    message: !hb.running
      ? "worker not running"
      : stale
        ? `last drain ${Math.round(since / 1000)}s ago (>${Math.round(grace / 1000)}s)`
        : hb.lastDrainAt === 0 ? "warming up" : `last drain ${Math.round(since / 1000)}s ago`,
  };

  const ready = Object.values(checks).every(c => c.ok);
  return { status: ready ? "ready" : "degraded", ready, checks };
}

const clientErrorSchema = z.object({
  message: z.string().min(1).max(2000),
  source: z.string().max(500).optional(),
  stack: z.string().max(5000).optional(),
  url: z.string().max(2000).optional(),
  // Browser useragent context for triage; never user PII.
  userAgent: z.string().max(500).optional(),
  // App-side classification ("react-error-boundary", "unhandledrejection", ...).
  kind: z.string().max(64).optional(),
});

// Lightweight in-memory rate limit: max N events per IP per window. The
// global /api rate limiter already protects the endpoint, this layer just
// dampens runaway loops on a single client tab.
const _clientErrSeen = new Map<string, { count: number; resetAt: number }>();
const CLIENT_ERR_WINDOW_MS = 60_000;
const CLIENT_ERR_PER_IP = 30;

function clientErrAllowed(ip: string): boolean {
  const now = Date.now();
  const entry = _clientErrSeen.get(ip);
  if (!entry || now > entry.resetAt) {
    _clientErrSeen.set(ip, { count: 1, resetAt: now + CLIENT_ERR_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= CLIENT_ERR_PER_IP;
}

function ipFromReq(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.ip || "unknown";
}

export function registerObservabilityRoutes(
  app: Express,
  isReady: () => boolean,
): void {
  // Readiness — separate from /api/health (liveness) so kubelet-style probes
  // can decide independently whether to keep the process alive vs. route
  // traffic to it.
  app.get("/api/health/ready", async (_req, res) => {
    if (!isReady()) {
      res.status(503).json({ status: "starting", ready: false, checks: {} });
      return;
    }
    const result = await evaluateReadiness();
    res.status(result.ready ? 200 : 503).json(result);
  });

  // Metrics — text/plain Prometheus exposition. Protected by `METRICS_TOKEN`
  // bearer auth. Fail-closed in production: if the token is not configured we
  // refuse to serve metrics (operational metadata could leak sampling info,
  // queue sizes, breaker state, etc. to anonymous scrapers). In development
  // the endpoint is open for local inspection.
  app.get("/api/metrics", async (req, res) => {
    const required = (process.env.METRICS_TOKEN || "").trim();
    const isProd = process.env.NODE_ENV === "production";
    if (!required && isProd) {
      logger.warn("/api/metrics blocked: METRICS_TOKEN is not configured", "metrics");
      return res.status(503).json({ ok: false, code: "METRICS_TOKEN_REQUIRED" });
    }
    if (required) {
      const auth = String(req.headers["authorization"] || "");
      if (auth !== `Bearer ${required}`) {
        return res.status(401).end();
      }
    }
    // Refresh slow-changing gauges right before exposition so a scrape
    // always sees current values without a background polling loop.
    try {
      const size = await getEmailRetryQueueSize();
      setEmailRetryQueueSize(size);
    } catch { /* metrics path is best-effort */ }
    const accept = String(req.headers["accept"] || "");
    if (accept.includes("application/json")) {
      const snap = snapshot();
      snap.discord.queueSize = getDiscordQueueSize();
      return res.json(snap);
    }
    res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    res.send(renderPrometheus());
  });

  // Client error ingestion. Dev-only console mirroring continues to work in
  // the browser; this endpoint persists nothing and just emits a structured
  // log line with the correlationId already added by middleware.
  app.post("/api/client-errors", (req, res) => {
    // Same-origin check. The global CSRF middleware lives in `routes.ts`
    // which is registered AFTER this module in `server/index.ts`, so the
    // outer middleware never fires for /api/client-errors. We re-apply
    // the same `checkCsrfOrigin` helper here to close the gap.
    if (!checkCsrfOrigin(req)) {
      if (process.env.NODE_ENV !== "production") {
        logger.warn(`[csrf] /api/client-errors blocked: origin="${req.headers.origin}" referer="${req.headers.referer}"`, "auth");
      }
      return res.status(403).json({ ok: false, code: "FORBIDDEN" });
    }
    const ip = ipFromReq(req);
    if (!clientErrAllowed(ip)) {
      // Match the global limiter's contract: include `Retry-After` so the
      // browser-side queue can back off cleanly instead of hot-looping.
      res.setHeader("Retry-After", String(Math.ceil(CLIENT_ERR_WINDOW_MS / 1000)));
      return res.status(429).json({ ok: false, code: "RATE_LIMITED" });
    }
    const parsed = clientErrorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, code: "INVALID_PAYLOAD" });
    }
    const { message, source, stack, url, userAgent, kind } = parsed.data;
    incClientError();
    logger.warn(
      `[client-error] ${kind || "generic"} :: ${message.slice(0, 500)}${url ? ` @ ${url}` : ""}`,
      "client-error",
    );
    if (stack && process.env.NODE_ENV !== "production") {
      logger.debug(`[client-error] stack: ${stack.slice(0, 2000)}`, "client-error");
    }
    // Touch unused vars (kept in payload for future dashboards).
    void source; void userAgent;
    res.json({ ok: true });
  });
}
