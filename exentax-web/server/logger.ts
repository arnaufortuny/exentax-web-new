import { getCurrentCorrelationId } from "./correlation";

/**
 * Mask a client IP for log output. Keeps just enough signal to differentiate
 * "many requests from one network" from "many requests from different
 * networks" while not retaining full PII per RGPD's data-minimisation
 * principle.
 *
 *   maskIp("203.0.113.42")           → "203.0.113.x"
 *   maskIp("2001:db8:abcd:1234::1")  → "2001:db8:abcd::"
 *   maskIp("unknown")                → "unknown"
 *
 * IPv4: drop the last octet. IPv6: keep only the first 3 hextets (the /48
 * routing prefix), zero the rest. Anything we can't parse cleanly is passed
 * through as `(masked)` so we never accidentally echo a raw value.
 */
export function maskIp(ip: string | null | undefined): string {
  if (!ip || typeof ip !== "string") return "(no-ip)";
  const trimmed = ip.trim();
  if (!trimmed || trimmed === "unknown") return "unknown";
  // IPv4-mapped IPv6 ("::ffff:1.2.3.4") → just mask the IPv4 tail
  const v4Match = trimmed.match(/^(?:::ffff:)?(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4Match) return `${v4Match[1]}.x`;
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":");
    if (parts.length >= 3) {
      return `${parts[0]}:${parts[1]}:${parts[2]}::`;
    }
    return "(masked)";
  }
  return "(masked)";
}

const REDACTED_PATTERNS = [
  "password", "passwordhash", "contrasena", "otp", "otpcode",
  "secret", "managetoken", "sessiontoken", "currentpassword", "newpassword",
  "apikey", "accesstoken", "refreshtoken", "authorization", "credential",
  "ein", "dni", "iban", "passport", "taxid", "routing", "accountnumber",
  "swift", "beneficiary", "fiscaladdress", "legalname", "filingnumber",
  "phone", "telefono", "address", "direccion",
];

const REDACTED_EXACT = new Set([
  "token",
]);

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return REDACTED_EXACT.has(lower) || REDACTED_PATTERNS.some(p => lower.includes(p));
}

function redactSensitiveFields(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitiveFields);
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactSensitiveFields(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

type LogLevel = "info" | "warn" | "error" | "debug";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const VALID_LEVELS = new Set<LogLevel>(["debug", "info", "warn", "error"]);
const envLevel = process.env.LOG_LEVEL as string | undefined;
const MIN_LEVEL: LogLevel = (envLevel && VALID_LEVELS.has(envLevel as LogLevel)) ? (envLevel as LogLevel) : (process.env.NODE_ENV === "production" ? "info" : "debug");

// Structured JSON output is opt-in via `LOG_FORMAT=json` and on by default in
// production so log aggregators can parse fields directly. The legacy
// human-readable line format remains the default in dev for ergonomic local
// debugging.
const LOG_FORMAT = (process.env.LOG_FORMAT || (process.env.NODE_ENV === "production" ? "json" : "text")).toLowerCase();
const USE_JSON = LOG_FORMAT === "json";

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[MIN_LEVEL];
}

function emit(level: LogLevel, source: string, message: string, extra?: Record<string, unknown>): void {
  const correlationId = getCurrentCorrelationId();
  if (USE_JSON) {
    const record: Record<string, unknown> = {
      ts: new Date().toISOString(),
      level,
      source,
      msg: message,
    };
    if (correlationId) record.correlationId = correlationId;
    if (extra) Object.assign(record, extra);
    const line = JSON.stringify(record);
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
    return;
  }
  const cid = correlationId ? ` cid=${correlationId}` : "";
  const line = `${formatTime()} [${level.toUpperCase()}] [${source}]${cid} ${message}`;
  if (level === "error") {
    if (extra && extra.err) {
      console.error(line, extra.err);
    } else {
      console.error(line);
    }
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info(message: string, source = "app") {
    if (shouldLog("info")) emit("info", source, message);
  },

  warn(message: string, source = "app") {
    if (shouldLog("warn")) emit("warn", source, message);
  },

  error(message: string, source = "app", err?: unknown) {
    if (!shouldLog("error")) return;
    if (err instanceof Error) {
      emit("error", source, message, {
        err: { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 8).join("\n") },
      });
    } else if (err !== undefined) {
      emit("error", source, message, { err });
    } else {
      emit("error", source, message);
    }
  },

  debug(message: string, source = "app") {
    if (shouldLog("debug")) emit("debug", source, message);
  },

  /**
   * High-priority alert line. Always emitted (regardless of LOG_LEVEL) and
   * tagged so log aggregators can route on it. Used as a *fallback* signal
   * when external alerting (Discord bot) is unavailable or has been
   * exhausted, so an outage of the notification channel doesn't make
   * critical errors invisible.
   */
  alert(message: string, source = "alert", extra?: Record<string, unknown>) {
    const correlationId = getCurrentCorrelationId();
    if (USE_JSON) {
      const record: Record<string, unknown> = {
        ts: new Date().toISOString(),
        level: "error",
        alert: true,
        source,
        msg: message,
      };
      if (correlationId) record.correlationId = correlationId;
      if (extra) Object.assign(record, extra);
      console.error(JSON.stringify(record));
    } else {
      const cid = correlationId ? ` cid=${correlationId}` : "";
      console.error(`${formatTime()} [ALERT] [${source}]${cid} ${message}`, extra ?? "");
    }
  },

  request(method: string, path: string, statusCode: number, durationMs: number, body?: unknown) {
    if (!shouldLog("info")) return;
    const correlationId = getCurrentCorrelationId();
    if (USE_JSON) {
      const record: Record<string, unknown> = {
        ts: new Date().toISOString(),
        level: "info",
        source: "http",
        msg: `${method} ${path} ${statusCode}`,
        method,
        path,
        status: statusCode,
        durationMs,
      };
      if (correlationId) record.correlationId = correlationId;
      if (body && process.env.NODE_ENV !== "production") {
        record.body = redactSensitiveFields(body);
      }
      console.log(JSON.stringify(record));
      return;
    }
    const cid = correlationId ? ` cid=${correlationId}` : "";
    let line = `${formatTime()} [INFO] [http]${cid} ${method} ${path} ${statusCode} in ${durationMs}ms`;
    if (body && process.env.NODE_ENV !== "production") {
      line += ` :: ${JSON.stringify(redactSensitiveFields(body))}`;
    }
    console.log(line);
  },
};
