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
import { db, getPoolStats } from "../db";
import { logger } from "../logger";
import { snapshot, renderPrometheus, setEmailRetryQueueSize, setDbPoolStats, incClientError } from "../metrics";
import { getEmailRetryQueueSize, getEmailWorkerHeartbeat } from "../email-retry-queue";
import { getRegisteredBreakers } from "../circuit-breaker";
import { getDiscordQueueSize, refreshPublishedQueueDepth, notifyEvent } from "../discord";
import { isBotConfigured, checkDiscordConnectivity } from "../discord-bot";
import { checkCsrfOrigin } from "../route-helpers";

// ─── Email retry queue overflow alert ────────────────────────────────────────
//
// We piggy-back on the metrics scrape (the only existing path that polls the
// queue size from the DB) to emit a Discord warning when the backlog grows
// past `EMAIL_RETRY_QUEUE_ALERT_THRESHOLD` (env, default 25). The alert is
// dedup-keyed and protected by a hysteresis flag so a sustained backlog only
// ever produces one notification per ~30 min, and we re-arm only after the
// queue drains below `threshold / 2` (low-watermark) to prevent flapping at
// the boundary. When the queue clears we emit a single follow-up "drained"
// info notice with a matching dedup key suffix so the operator timeline
// shows the close-out without spamming the channel.
const ALERT_THRESHOLD = Math.max(1, Number(process.env.EMAIL_RETRY_QUEUE_ALERT_THRESHOLD || 25));
let _queueAlertArmed = true;        // becomes false once we've alerted; re-arms below low-watermark
let _lastQueueAlertAt = 0;

function maybeAlertEmailRetryQueue(size: number): void {
  const lowWatermark = Math.max(1, Math.floor(ALERT_THRESHOLD / 2));
  // High-watermark: alert once per 30 min while size stays elevated.
  if (size >= ALERT_THRESHOLD && _queueAlertArmed) {
    _queueAlertArmed = false;
    _lastQueueAlertAt = Date.now();
    notifyEvent({
      type: "system_error",
      criticality: "warning",
      title: "Email retry queue backlog over threshold",
      description: [
        `**Current size**: \`${size}\``,
        `**Threshold**: \`${ALERT_THRESHOLD}\``,
        `Email retries are accumulating. Check Gmail API quota,`,
        `service-account credentials and the email worker heartbeat`,
        `(\`/api/health/ready\` → \`emailWorker\`).`,
      ].join("\n"),
      channel: "errores",
      origin: "metrics/email-retry-queue",
      // 30-min dedup so a sustained backlog produces at most one notice.
      dedupKey: `email_retry_queue_size_high_${Math.floor(Date.now() / (30 * 60_000))}`,
    });
    logger.warn(
      `[email-retry] queue size ${size} >= threshold ${ALERT_THRESHOLD} — Discord alert emitted`,
      "metrics",
    );
  } else if (size <= lowWatermark && !_queueAlertArmed) {
    // Re-arm and emit a single "cleared" notice so operators see the recovery.
    _queueAlertArmed = true;
    notifyEvent({
      type: "admin_action",
      criticality: "info",
      title: "Email retry queue drained",
      description: [
        `**Current size**: \`${size}\``,
        `**Low watermark**: \`${lowWatermark}\``,
        `Backlog is back to normal — alert re-armed.`,
      ].join("\n"),
      channel: "errores",
      origin: "metrics/email-retry-queue",
      dedupKey: `email_retry_queue_size_cleared_${_lastQueueAlertAt}`,
    });
    logger.info(
      `[email-retry] queue size ${size} <= low watermark ${lowWatermark} — alert re-armed`,
      "metrics",
    );
  }
}

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

  // Discord interaction endpoint connectivity. Only meaningful when the
  // bot is configured (prod). The check is cached for ~60s inside
  // `checkDiscordConnectivity` so a high-frequency readiness scrape does
  // not hammer Discord. We mark Discord as a degrading dependency only
  // in production — locally the bot is intentionally not configured and
  // we don't want a missing env to fail readiness for unrelated work.
  if (isBotConfigured()) {
    try {
      const ping = await checkDiscordConnectivity();
      checks.discord = {
        ok: ping.ok,
        message: ping.ok ? undefined : `discord ping failed: ${ping.message ?? "unknown"}`,
      };
    } catch (err) {
      checks.discord = { ok: false, message: err instanceof Error ? err.message : String(err) };
    }
  }

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

/**
 * Strip the query string and fragment from a client-reported URL before
 * logging it. Newsletter unsubscribe links and booking-management links carry
 * security-sensitive bearer tokens in `?manage_token=…` / `?token=…`; if the
 * client crashes on one of those pages and the token reaches our log
 * aggregator we'd be effectively persisting credentials. The path alone is
 * enough for triage and is much less sensitive.
 */
function stripUrlSecrets(rawUrl: string): string {
  // Don't trust URL parsing for client-reported strings — some browsers
  // send relative paths, fragments-only, or invalid URLs. Hand-roll the
  // truncation so we always strip `?` and `#` reliably.
  const trimmed = rawUrl.slice(0, 500);
  const qIdx = trimmed.indexOf("?");
  const hIdx = trimmed.indexOf("#");
  let cut = trimmed.length;
  if (qIdx >= 0) cut = Math.min(cut, qIdx);
  if (hIdx >= 0) cut = Math.min(cut, hIdx);
  return trimmed.slice(0, cut);
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
      // Side-effect: emit a Discord alert if the backlog crosses the
      // configured threshold (with hysteresis + dedup — see the helper
      // at the top of this file). Wrapped so any notification failure
      // never breaks the metrics endpoint itself.
      try { maybeAlertEmailRetryQueue(size); } catch (err) {
        logger.warn(`[metrics] retry-queue alert hook failed: ${err instanceof Error ? err.message : String(err)}`, "metrics");
      }
    } catch { /* metrics path is best-effort */ }
    try {
      setDbPoolStats(getPoolStats());
    } catch { /* metrics path is best-effort */ }
    const accept = String(req.headers["accept"] || "");
    // Reconcile the published Discord queue gauge against the DB COUNT
    // before either response shape (JSON or Prometheus). This guarantees
    // co-tenant processes serve the same `discord_queue_size` value
    // synchronously on each scrape (in addition to the periodic 1.5 s
    // drain-tick refresh).
    //
    // Wrapped in a 1 s timeout race to bound scrape latency under
    // degraded DB conditions: if the DB is slow / unreachable, we serve
    // the previously cached gauge and Prometheus gets an unblocked
    // response within ~1 s instead of hanging up to the 30 s
    // statement_timeout. Two SRE-visible degradation signals:
    //   - Hard failure (DB query throws): `refreshPublishedQueueDepth`
    //     logs WARN [discord] from its own catch block.
    //   - Slow query (race timeout wins): we log WARN [discord] HERE
    //     so degraded-but-not-failed states are observable on the
    //     scrape that experienced them, not just on subsequent ones.
    const REFRESH_BUDGET_MS = 1_000;
    const TIMEOUT_SENTINEL = Symbol("metrics-refresh-timeout");
    try {
      const winner = await Promise.race([
        refreshPublishedQueueDepth().then(() => "ok" as const),
        new Promise<typeof TIMEOUT_SENTINEL>((resolve) => setTimeout(() => resolve(TIMEOUT_SENTINEL), REFRESH_BUDGET_MS)),
      ]);
      if (winner === TIMEOUT_SENTINEL) {
        logger.warn(
          `metrics: refreshPublishedQueueDepth exceeded ${REFRESH_BUDGET_MS}ms budget; serving cached discord_queue_size=${getDiscordQueueSize()}`,
          "discord",
        );
      }
    } catch { /* best-effort */ }
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
    // The client-supplied URL can contain query strings with security-
    // sensitive tokens (manage_token, unsubscribe_token, ...). Drop the
    // query/hash before logging so an aggregated log search cannot reveal
    // them. Path is enough for triage; the correlationId already in the log
    // line stitches everything to the originating request.
    const safeUrl = url ? stripUrlSecrets(url) : "";
    logger.warn(
      `[client-error] ${kind || "generic"} :: ${message.slice(0, 500)}${safeUrl ? ` @ ${safeUrl}` : ""}`,
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
