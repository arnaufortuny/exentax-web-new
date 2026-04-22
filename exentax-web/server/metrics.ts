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

let discordQueueSize = 0;
let discordDropTotal = 0;
let discordSendFailTotal = 0;
let emailRetryQueueSize = 0;
let alertFallbackTotal = 0;
let clientErrorTotal = 0;

const breakerStates: Record<string, "closed" | "open" | "half-open"> = {};

const elDelay = monitorEventLoopDelay({ resolution: 20 });
elDelay.enable();

export function recordHttpRequest(method: string, status: number, durationMs: number): void {
  const klass = `${Math.floor(status / 100)}xx`;
  const key = `${method}:${klass}`;
  httpRequestsTotal[key] = (httpRequestsTotal[key] ?? 0) + 1;
  httpDurationCount++;
  httpDurationSum += durationMs;
  for (let i = 0; i < HISTOGRAM_BUCKETS_MS.length; i++) {
    if (durationMs <= HISTOGRAM_BUCKETS_MS[i]) httpDurationBuckets[i]++;
  }
}

export function setDiscordQueueSize(n: number): void { discordQueueSize = n; }
export function incDiscordDropped(): void { discordDropTotal++; }
export function incDiscordSendFailure(): void { discordSendFailTotal++; }
export function setEmailRetryQueueSize(n: number): void { emailRetryQueueSize = n; }
export function incAlertFallback(): void { alertFallbackTotal++; }
export function incClientError(): void { clientErrorTotal++; }

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
  };
  discord: { queueSize: number; droppedTotal: number; sendFailureTotal: number };
  email: { retryQueueSize: number };
  alerts: { fallbackTotal: number };
  client: { errorsTotal: number };
  breakers: Record<string, "closed" | "open" | "half-open">;
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
    },
    discord: { queueSize: discordQueueSize, droppedTotal: discordDropTotal, sendFailureTotal: discordSendFailTotal },
    email: { retryQueueSize: emailRetryQueueSize },
    alerts: { fallbackTotal: alertFallbackTotal },
    client: { errorsTotal: clientErrorTotal },
    breakers: { ...breakerStates },
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

  lines.push(`# TYPE discord_queue_size gauge`);
  lines.push(`discord_queue_size ${snap.discord.queueSize}`);
  lines.push(`# TYPE discord_dropped_total counter`);
  lines.push(`discord_dropped_total ${snap.discord.droppedTotal}`);
  lines.push(`# TYPE discord_send_failure_total counter`);
  lines.push(`discord_send_failure_total ${snap.discord.sendFailureTotal}`);

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
  return lines.join("\n") + "\n";
}
