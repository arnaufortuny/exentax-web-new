/**
 * Lightweight in-process metrics.
 *
 * Deliberately additive and dependency-free: we don't pull in prom-client.
 * The exposed format (`text/plain`) is Prometheus-compatible enough for
 * scrapers but the primary consumer is internal — `/api/metrics` returns
 * a snapshot suitable for ad-hoc inspection and dashboards.
 *
 * What is tracked:
 *   - `http_requests_total{method,status_class}`  counter
 *   - `http_request_duration_ms_bucket{le}`       histogram (cumulative)
 *   - `process_uptime_seconds`                    gauge
 *   - `process_resident_memory_bytes`             gauge
 *   - `nodejs_event_loop_lag_ms`                  gauge (sampled)
 *   - circuit breaker states (gauge)
 *   - email retry queue size (gauge, snapshot on read)
 *   - discord queue size + drop count (gauge / counter)
 */
import { monitorEventLoopDelay } from "perf_hooks";

interface CounterMap { [key: string]: number }

const httpRequestsTotal: CounterMap = Object.create(null);
// Cumulative buckets in milliseconds (Prometheus convention).
const HISTOGRAM_BUCKETS_MS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
const httpDurationBuckets: number[] = HISTOGRAM_BUCKETS_MS.map(() => 0);
let httpDurationCount = 0;
let httpDurationSum = 0;

// Per-route histograms keyed by `${method} ${routeTemplate}`. We deliberately
// key by the registered template (e.g. `/api/booking/:bookingId`), never by
// the resolved URL, so cardinality stays bounded by the route table even if
// hostile callers fuzz path segments. Routes we have not seen before fall
// into the `__other` bucket — that prevents a label explosion if a future
// caller forgets to use `route.path`.
const PER_ROUTE_LIMIT = 200;
interface RouteStats {
  count: number;
  sumMs: number;
  buckets: number[];
  byStatusClass: Record<string, number>;
}
const perRoute: Map<string, RouteStats> = new Map();
function newRouteStats(): RouteStats {
  return {
    count: 0,
    sumMs: 0,
    buckets: HISTOGRAM_BUCKETS_MS.map(() => 0),
    byStatusClass: Object.create(null),
  };
}

let discordQueueSize = 0;
let discordDropTotal = 0;
let discordSendFailTotal = 0;
// Inbound interaction telemetry (Task #12 hardening): per-reason signature
// failures, replay-window rejections, unauthorised attempts and per-command
// invocation counters + dispatch latency. Kept in the same module as the
// existing discord_* gauges so a single Prometheus scrape carries the full
// picture of the bot's interaction endpoint.
const discordSignatureFailuresByReason: CounterMap = Object.create(null);
let discordReplayRejectedTotal = 0;
let discordUnauthorisedTotal = 0;
let discordAuditWriteFailureTotal = 0;
const discordInteractionsByType: CounterMap = Object.create(null);
const discordCommandTotal: CounterMap = Object.create(null);
const discordCommandDurationBuckets: number[] = HISTOGRAM_BUCKETS_MS.map(() => 0);
let discordCommandDurationCount = 0;
let discordCommandDurationSum = 0;
let emailRetryQueueSize = 0;
let alertFallbackTotal = 0;
let clientErrorTotal = 0;

const breakerStates: Record<string, "closed" | "open" | "half-open"> = {};

const elDelay = monitorEventLoopDelay({ resolution: 20 });
elDelay.enable();

export function recordHttpRequest(method: string, status: number, durationMs: number, route?: string): void {
  const klass = `${Math.floor(status / 100)}xx`;
  const key = `${method}:${klass}`;
  httpRequestsTotal[key] = (httpRequestsTotal[key] ?? 0) + 1;
  httpDurationCount++;
  httpDurationSum += durationMs;
  for (let i = 0; i < HISTOGRAM_BUCKETS_MS.length; i++) {
    if (durationMs <= HISTOGRAM_BUCKETS_MS[i]) httpDurationBuckets[i]++;
  }

  // Per-route slice. We bucket unknown routes into `__other` so cardinality
  // is hard-bounded; once `PER_ROUTE_LIMIT` distinct keys are registered,
  // additional routes also fall into `__other`. This keeps the metric usable
  // even after years of route churn or accidental dynamic paths.
  const routeTemplate = route && route.length > 0 ? route : "__other";
  const routeKey = `${method} ${routeTemplate}`;
  let stats = perRoute.get(routeKey);
  if (!stats) {
    if (perRoute.size >= PER_ROUTE_LIMIT) {
      const otherKey = `${method} __other`;
      stats = perRoute.get(otherKey);
      if (!stats) {
        stats = newRouteStats();
        perRoute.set(otherKey, stats);
      }
    } else {
      stats = newRouteStats();
      perRoute.set(routeKey, stats);
    }
  }
  stats.count++;
  stats.sumMs += durationMs;
  stats.byStatusClass[klass] = (stats.byStatusClass[klass] ?? 0) + 1;
  for (let i = 0; i < HISTOGRAM_BUCKETS_MS.length; i++) {
    if (durationMs <= HISTOGRAM_BUCKETS_MS[i]) stats.buckets[i]++;
  }
}

// Linear-interpolated percentile from a cumulative bucket histogram. Returns
// null when the histogram is empty so callers can omit the series instead of
// reporting a misleading 0. The input must be cumulative and aligned with
// `HISTOGRAM_BUCKETS_MS`.
function percentileFromBuckets(buckets: number[], total: number, p: number): number | null {
  if (total <= 0) return null;
  const target = total * p;
  let prevBound = 0;
  let prevCount = 0;
  for (let i = 0; i < HISTOGRAM_BUCKETS_MS.length; i++) {
    const count = buckets[i];
    if (count >= target) {
      const upper = HISTOGRAM_BUCKETS_MS[i];
      const span = count - prevCount;
      if (span <= 0) return upper;
      const frac = (target - prevCount) / span;
      return Math.round(prevBound + (upper - prevBound) * frac);
    }
    prevBound = HISTOGRAM_BUCKETS_MS[i];
    prevCount = count;
  }
  // Above the last finite bound — return the top bound rather than +Inf so
  // dashboards stay numeric. Operators read this as "≥ 10s".
  return HISTOGRAM_BUCKETS_MS[HISTOGRAM_BUCKETS_MS.length - 1];
}

export function setDiscordQueueSize(n: number): void { discordQueueSize = n; }
export function incDiscordDropped(): void { discordDropTotal++; }
export function incDiscordSendFailure(): void { discordSendFailTotal++; }

// Inbound interaction telemetry — see header for rationale. Each helper is
// best-effort and self-contained: a counter increment must never throw or
// allocate beyond a single key lookup. `reason` for signature failures is
// one of: "missing", "bad_format", "bad_signature".
export function incDiscordSignatureFailure(reason: string): void {
  const k = reason || "unknown";
  discordSignatureFailuresByReason[k] = (discordSignatureFailuresByReason[k] ?? 0) + 1;
}
export function incDiscordReplayRejected(): void { discordReplayRejectedTotal++; }
export function incDiscordUnauthorised(): void { discordUnauthorisedTotal++; }
// Bumped from the catch around the fire-and-forget `logAdminAction` for
// unauthorised attempts. Lets ops detect when DB pressure is causing
// silent gaps in the audit trail without having to grep the warn logs.
export function incDiscordAuditWriteFailure(): void { discordAuditWriteFailureTotal++; }
export function incDiscordInteractionType(type: string | number): void {
  const k = String(type);
  discordInteractionsByType[k] = (discordInteractionsByType[k] ?? 0) + 1;
}
export function recordDiscordCommand(name: string, durationMs: number): void {
  const k = name || "unknown";
  discordCommandTotal[k] = (discordCommandTotal[k] ?? 0) + 1;
  discordCommandDurationCount++;
  discordCommandDurationSum += durationMs;
  for (let i = 0; i < HISTOGRAM_BUCKETS_MS.length; i++) {
    if (durationMs <= HISTOGRAM_BUCKETS_MS[i]) discordCommandDurationBuckets[i]++;
  }
}
export function setEmailRetryQueueSize(n: number): void { emailRetryQueueSize = n; }
export function incAlertFallback(): void { alertFallbackTotal++; }
export function incClientError(): void { clientErrorTotal++; }

// DB pool gauges are sampled lazily inside `snapshot()` to avoid coupling
// metrics.ts to db.ts at module-init time (which would create an import
// cycle: db -> logger; metrics is consumed by observability which loads on
// boot). The setter pattern lets the observability route push fresh values
// right before exposition.
let dbPoolTotal = 0;
let dbPoolIdle = 0;
let dbPoolWaiting = 0;
let dbPoolMax = 0;
let dbTotalQueries = 0;
let dbSlowQueries = 0;
export function setDbPoolStats(stats: { total: number; idle: number; waiting: number; max: number; totalQueries: number; slowQueries: number }): void {
  dbPoolTotal = stats.total;
  dbPoolIdle = stats.idle;
  dbPoolWaiting = stats.waiting;
  dbPoolMax = stats.max;
  dbTotalQueries = stats.totalQueries;
  dbSlowQueries = stats.slowQueries;
}

export function setBreakerState(name: string, state: "closed" | "open" | "half-open"): void {
  breakerStates[name] = state;
}

function breakerStateValue(state: "closed" | "open" | "half-open"): number {
  // 0 = closed (healthy), 1 = half-open (probing), 2 = open (tripped).
  return state === "closed" ? 0 : state === "half-open" ? 1 : 2;
}

export interface MetricsSnapshot {
  uptimeSeconds: number;
  rssBytes: number;
  heapUsedBytes: number;
  eventLoopLagP99Ms: number;
  http: {
    totals: Record<string, number>;
    durationCount: number;
    durationSumMs: number;
    bucketsMs: { le: number; count: number }[];
    p50Ms: number | null;
    p95Ms: number | null;
    p99Ms: number | null;
    perRoute: Array<{
      method: string;
      route: string;
      count: number;
      sumMs: number;
      byStatusClass: Record<string, number>;
      p50Ms: number | null;
      p95Ms: number | null;
      p99Ms: number | null;
    }>;
  };
  discord: {
    queueSize: number;
    droppedTotal: number;
    sendFailureTotal: number;
    signatureFailures: Record<string, number>;
    replayRejectedTotal: number;
    unauthorisedTotal: number;
    auditWriteFailureTotal: number;
    interactionsByType: Record<string, number>;
    commandTotal: Record<string, number>;
    commandDurationCount: number;
    commandDurationSumMs: number;
    commandBucketsMs: { le: number; count: number }[];
  };
  email: { retryQueueSize: number };
  alerts: { fallbackTotal: number };
  client: { errorsTotal: number };
  breakers: Record<string, "closed" | "open" | "half-open">;
  db: { poolTotal: number; poolIdle: number; poolWaiting: number; poolMax: number; queriesTotal: number; slowQueriesTotal: number };
}

export function snapshot(): MetricsSnapshot {
  const mem = process.memoryUsage();
  return {
    uptimeSeconds: Math.round(process.uptime()),
    rssBytes: mem.rss,
    heapUsedBytes: mem.heapUsed,
    eventLoopLagP99Ms: Math.round(elDelay.percentile(99) / 1e6),
    http: {
      totals: { ...httpRequestsTotal },
      durationCount: httpDurationCount,
      durationSumMs: Math.round(httpDurationSum),
      bucketsMs: HISTOGRAM_BUCKETS_MS.map((le, i) => ({ le, count: httpDurationBuckets[i] })),
      p50Ms: percentileFromBuckets(httpDurationBuckets, httpDurationCount, 0.50),
      p95Ms: percentileFromBuckets(httpDurationBuckets, httpDurationCount, 0.95),
      p99Ms: percentileFromBuckets(httpDurationBuckets, httpDurationCount, 0.99),
      perRoute: Array.from(perRoute.entries()).map(([key, s]) => {
        const sp = key.indexOf(" ");
        const method = sp > 0 ? key.slice(0, sp) : key;
        const route = sp > 0 ? key.slice(sp + 1) : "__other";
        return {
          method,
          route,
          count: s.count,
          sumMs: Math.round(s.sumMs),
          byStatusClass: { ...s.byStatusClass },
          p50Ms: percentileFromBuckets(s.buckets, s.count, 0.50),
          p95Ms: percentileFromBuckets(s.buckets, s.count, 0.95),
          p99Ms: percentileFromBuckets(s.buckets, s.count, 0.99),
        };
      }),
    },
    discord: {
      queueSize: discordQueueSize,
      droppedTotal: discordDropTotal,
      sendFailureTotal: discordSendFailTotal,
      signatureFailures: { ...discordSignatureFailuresByReason },
      replayRejectedTotal: discordReplayRejectedTotal,
      unauthorisedTotal: discordUnauthorisedTotal,
      auditWriteFailureTotal: discordAuditWriteFailureTotal,
      interactionsByType: { ...discordInteractionsByType },
      commandTotal: { ...discordCommandTotal },
      commandDurationCount: discordCommandDurationCount,
      commandDurationSumMs: Math.round(discordCommandDurationSum),
      commandBucketsMs: HISTOGRAM_BUCKETS_MS.map((le, i) => ({ le, count: discordCommandDurationBuckets[i] })),
    },
    email: { retryQueueSize: emailRetryQueueSize },
    alerts: { fallbackTotal: alertFallbackTotal },
    client: { errorsTotal: clientErrorTotal },
    breakers: { ...breakerStates },
    db: {
      poolTotal: dbPoolTotal,
      poolIdle: dbPoolIdle,
      poolWaiting: dbPoolWaiting,
      poolMax: dbPoolMax,
      queriesTotal: dbTotalQueries,
      slowQueriesTotal: dbSlowQueries,
    },
  };
}

export function renderPrometheus(): string {
  const snap = snapshot();
  const lines: string[] = [];
  lines.push(`# HELP process_uptime_seconds Process uptime in seconds.`);
  lines.push(`# TYPE process_uptime_seconds gauge`);
  lines.push(`process_uptime_seconds ${snap.uptimeSeconds}`);
  lines.push(`# TYPE process_resident_memory_bytes gauge`);
  lines.push(`process_resident_memory_bytes ${snap.rssBytes}`);
  lines.push(`# TYPE nodejs_heap_used_bytes gauge`);
  lines.push(`nodejs_heap_used_bytes ${snap.heapUsedBytes}`);
  lines.push(`# TYPE nodejs_event_loop_lag_ms gauge`);
  lines.push(`nodejs_event_loop_lag_ms ${snap.eventLoopLagP99Ms}`);

  lines.push(`# TYPE http_requests_total counter`);
  for (const [k, v] of Object.entries(snap.http.totals)) {
    const [method, status] = k.split(":");
    lines.push(`http_requests_total{method="${method}",status="${status}"} ${v}`);
  }
  lines.push(`# TYPE http_request_duration_ms histogram`);
  for (const b of snap.http.bucketsMs) {
    lines.push(`http_request_duration_ms_bucket{le="${b.le}"} ${b.count}`);
  }
  lines.push(`http_request_duration_ms_bucket{le="+Inf"} ${snap.http.durationCount}`);
  lines.push(`http_request_duration_ms_sum ${snap.http.durationSumMs}`);
  lines.push(`http_request_duration_ms_count ${snap.http.durationCount}`);

  // Aggregate latency percentiles (interpolated from the histogram). Emitted
  // as gauges so a Grafana single-stat panel can show "current p95" without
  // a recording rule.
  if (snap.http.p50Ms !== null) {
    lines.push(`# HELP http_request_duration_ms_quantile Interpolated request latency percentile.`);
    lines.push(`# TYPE http_request_duration_ms_quantile gauge`);
    lines.push(`http_request_duration_ms_quantile{quantile="0.5"} ${snap.http.p50Ms}`);
    if (snap.http.p95Ms !== null) lines.push(`http_request_duration_ms_quantile{quantile="0.95"} ${snap.http.p95Ms}`);
    if (snap.http.p99Ms !== null) lines.push(`http_request_duration_ms_quantile{quantile="0.99"} ${snap.http.p99Ms}`);
  }

  // Per-route series. Cardinality is bounded by the registered Express route
  // table because we record `req.route.path` (template) rather than the
  // resolved URL.
  if (snap.http.perRoute.length > 0) {
    lines.push(`# HELP http_route_requests_total Requests bucketed by route template and status class.`);
    lines.push(`# TYPE http_route_requests_total counter`);
    for (const r of snap.http.perRoute) {
      const safeRoute = r.route.replace(/"/g, "");
      for (const [klass, count] of Object.entries(r.byStatusClass)) {
        lines.push(`http_route_requests_total{method="${r.method}",route="${safeRoute}",status="${klass}"} ${count}`);
      }
    }
    lines.push(`# TYPE http_route_request_duration_ms_sum counter`);
    for (const r of snap.http.perRoute) {
      const safeRoute = r.route.replace(/"/g, "");
      lines.push(`http_route_request_duration_ms_sum{method="${r.method}",route="${safeRoute}"} ${r.sumMs}`);
    }
    lines.push(`# TYPE http_route_request_duration_ms_count counter`);
    for (const r of snap.http.perRoute) {
      const safeRoute = r.route.replace(/"/g, "");
      lines.push(`http_route_request_duration_ms_count{method="${r.method}",route="${safeRoute}"} ${r.count}`);
    }
    lines.push(`# HELP http_route_request_duration_ms_quantile Per-route latency percentile (interpolated).`);
    lines.push(`# TYPE http_route_request_duration_ms_quantile gauge`);
    for (const r of snap.http.perRoute) {
      const safeRoute = r.route.replace(/"/g, "");
      if (r.p50Ms !== null) lines.push(`http_route_request_duration_ms_quantile{method="${r.method}",route="${safeRoute}",quantile="0.5"} ${r.p50Ms}`);
      if (r.p95Ms !== null) lines.push(`http_route_request_duration_ms_quantile{method="${r.method}",route="${safeRoute}",quantile="0.95"} ${r.p95Ms}`);
      if (r.p99Ms !== null) lines.push(`http_route_request_duration_ms_quantile{method="${r.method}",route="${safeRoute}",quantile="0.99"} ${r.p99Ms}`);
    }
  }

  lines.push(`# TYPE discord_queue_size gauge`);
  lines.push(`discord_queue_size ${snap.discord.queueSize}`);
  lines.push(`# TYPE discord_dropped_total counter`);
  lines.push(`discord_dropped_total ${snap.discord.droppedTotal}`);
  lines.push(`# TYPE discord_send_failure_total counter`);
  lines.push(`discord_send_failure_total ${snap.discord.sendFailureTotal}`);

  lines.push(`# TYPE discord_signature_failures_total counter`);
  for (const [reason, n] of Object.entries(snap.discord.signatureFailures)) {
    lines.push(`discord_signature_failures_total{reason="${reason}"} ${n}`);
  }
  lines.push(`# TYPE discord_replay_rejected_total counter`);
  lines.push(`discord_replay_rejected_total ${snap.discord.replayRejectedTotal}`);
  lines.push(`# TYPE discord_unauthorised_total counter`);
  lines.push(`discord_unauthorised_total ${snap.discord.unauthorisedTotal}`);
  lines.push(`# HELP discord_audit_write_failure_total Failed writes of audit rows from the unauthorised-attempt fire-and-forget path. A non-zero rate means the audit trail is missing some unauthorised attempts (Postgres degraded or schema drift).`);
  lines.push(`# TYPE discord_audit_write_failure_total counter`);
  lines.push(`discord_audit_write_failure_total ${snap.discord.auditWriteFailureTotal}`);
  lines.push(`# TYPE discord_interactions_total counter`);
  for (const [type, n] of Object.entries(snap.discord.interactionsByType)) {
    lines.push(`discord_interactions_total{type="${type}"} ${n}`);
  }
  lines.push(`# TYPE discord_command_total counter`);
  for (const [name, n] of Object.entries(snap.discord.commandTotal)) {
    lines.push(`discord_command_total{name="${name}"} ${n}`);
  }
  lines.push(`# TYPE discord_command_duration_ms histogram`);
  for (const b of snap.discord.commandBucketsMs) {
    lines.push(`discord_command_duration_ms_bucket{le="${b.le}"} ${b.count}`);
  }
  lines.push(`discord_command_duration_ms_bucket{le="+Inf"} ${snap.discord.commandDurationCount}`);
  lines.push(`discord_command_duration_ms_sum ${snap.discord.commandDurationSumMs}`);
  lines.push(`discord_command_duration_ms_count ${snap.discord.commandDurationCount}`);

  lines.push(`# TYPE email_retry_queue_size gauge`);
  lines.push(`email_retry_queue_size ${snap.email.retryQueueSize}`);

  lines.push(`# TYPE alert_fallback_total counter`);
  lines.push(`alert_fallback_total ${snap.alerts.fallbackTotal}`);

  lines.push(`# TYPE client_errors_total counter`);
  lines.push(`client_errors_total ${snap.client.errorsTotal}`);

  lines.push(`# TYPE circuit_breaker_state gauge`);
  for (const [name, state] of Object.entries(snap.breakers)) {
    lines.push(`circuit_breaker_state{name="${name}"} ${breakerStateValue(state)}`);
  }

  lines.push(`# HELP db_pool_connections_total Active connections in the pg pool.`);
  lines.push(`# TYPE db_pool_connections_total gauge`);
  lines.push(`db_pool_connections_total ${snap.db.poolTotal}`);
  lines.push(`# TYPE db_pool_connections_idle gauge`);
  lines.push(`db_pool_connections_idle ${snap.db.poolIdle}`);
  lines.push(`# HELP db_pool_clients_waiting Clients queued waiting for a connection.`);
  lines.push(`# TYPE db_pool_clients_waiting gauge`);
  lines.push(`db_pool_clients_waiting ${snap.db.poolWaiting}`);
  lines.push(`# TYPE db_pool_max gauge`);
  lines.push(`db_pool_max ${snap.db.poolMax}`);
  lines.push(`# TYPE db_queries_total counter`);
  lines.push(`db_queries_total ${snap.db.queriesTotal}`);
  lines.push(`# HELP db_slow_queries_total Queries exceeding DB_SLOW_QUERY_MS threshold.`);
  lines.push(`# TYPE db_slow_queries_total counter`);
  lines.push(`db_slow_queries_total ${snap.db.slowQueriesTotal}`);

  return lines.join("\n") + "\n";
}
