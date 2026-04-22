/**
 * Client-side logger.
 *
 * - In development: mirrors warn/error to the browser console.
 * - Always: ships warn/error to `/api/client-errors` (best-effort, rate
 *   limited locally) so production crashes are visible server-side and can
 *   trigger backend alerting.
 */
const isDev = import.meta.env.DEV;

const REPORT_ENDPOINT = "/api/client-errors";

// Local rate limiting: cap how many reports we send per session to avoid a
// runaway loop (e.g. an effect throwing every render) hammering the backend.
const MAX_REPORTS_PER_SESSION = 50;
const MIN_INTERVAL_MS = 500;

let sentCount = 0;
let lastSentAt = 0;
const recentKeys = new Set<string>();
const RECENT_KEY_MAX = 50;

function recentlyReported(key: string): boolean {
  if (recentKeys.has(key)) return true;
  recentKeys.add(key);
  if (recentKeys.size > RECENT_KEY_MAX) {
    const first = recentKeys.values().next().value;
    if (first !== undefined) recentKeys.delete(first);
  }
  return false;
}

function asString(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === "string") return value;
  try { return JSON.stringify(value); } catch { return String(value); }
}

function buildPayload(args: unknown[], kind: string): Record<string, string> | null {
  if (args.length === 0) return null;
  const message = args.map(asString).filter(Boolean).join(" ").slice(0, 2000);
  if (!message) return null;
  const errArg = args.find(a => a instanceof Error) as Error | undefined;
  const stack = errArg?.stack?.slice(0, 5000);
  const url = typeof window !== "undefined" ? window.location.href.slice(0, 2000) : undefined;
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : undefined;
  const payload: Record<string, string> = { message, kind };
  if (stack) payload.stack = stack;
  if (url) payload.url = url;
  if (userAgent) payload.userAgent = userAgent;
  return payload;
}

function shipReport(payload: Record<string, string>): void {
  if (typeof fetch === "undefined") return;
  const now = Date.now();
  if (sentCount >= MAX_REPORTS_PER_SESSION) return;
  if (now - lastSentAt < MIN_INTERVAL_MS) return;
  // Dedupe identical messages within the session so a recurring error shows
  // up once but doesn't spam the backend.
  const key = `${payload.kind}|${payload.message}`;
  if (recentlyReported(key)) return;
  sentCount++;
  lastSentAt = now;
  // Best-effort: never throw, never block. `keepalive` lets the request
  // outlive a navigation (page-unload errors) when the browser allows it.
  try {
    void fetch(REPORT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => { /* swallow */ });
  } catch { /* swallow */ }
}

export const clientLogger = {
  warn(...args: unknown[]) {
    if (isDev) console.warn(...args);
    const payload = buildPayload(args, "warn");
    if (payload) shipReport(payload);
  },
  error(...args: unknown[]) {
    if (isDev) console.error(...args);
    const payload = buildPayload(args, "error");
    if (payload) shipReport(payload);
  },
  /**
   * Install global handlers. Idempotent; safe to call multiple times.
   * Captures uncaught errors and unhandled promise rejections that escape
   * React error boundaries (e.g. async work outside the render lifecycle).
   */
  init() {
    if (typeof window === "undefined") return;
    const w = window as Window & { __exentaxClientLoggerReady?: boolean };
    if (w.__exentaxClientLoggerReady) return;
    w.__exentaxClientLoggerReady = true;

    window.addEventListener("error", (event: ErrorEvent) => {
      const payload = buildPayload(
        [event.message || event.error || "window.onerror"],
        "window-error",
      );
      if (payload) {
        if (event.filename) payload.source = `${event.filename}:${event.lineno}:${event.colno}`;
        if (event.error instanceof Error && event.error.stack) {
          payload.stack = event.error.stack.slice(0, 5000);
        }
        shipReport(payload);
      }
    });

    window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const payload = buildPayload([reason], "unhandledrejection");
      if (payload) shipReport(payload);
    });
  },
};
