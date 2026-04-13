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

function formatMessage(level: LogLevel, source: string, message: string): string {
  return `${formatTime()} [${level.toUpperCase()}] [${source}] ${message}`;
}

export const logger = {
  info(message: string, source = "app") {
    if (shouldLog("info")) {
      console.log(formatMessage("info", source, message));
    }
  },

  warn(message: string, source = "app") {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", source, message));
    }
  },

  error(message: string, source = "app", err?: unknown) {
    if (shouldLog("error")) {
      const line = formatMessage("error", source, message);
      if (err instanceof Error) {
        console.error(line, { name: err.name, message: err.message, stack: err.stack?.split("\n").slice(0, 5).join("\n") });
      } else if (err !== undefined) {
        console.error(line, err);
      } else {
        console.error(line);
      }
    }
  },

  debug(message: string, source = "app") {
    if (shouldLog("debug")) {
      console.log(formatMessage("debug", source, message));
    }
  },

  request(method: string, path: string, statusCode: number, durationMs: number, body?: unknown) {
    if (!shouldLog("info")) return;
    let line = `${formatTime()} [INFO] [http] ${method} ${path} ${statusCode} in ${durationMs}ms`;
    if (body && process.env.NODE_ENV !== "production") {
      line += ` :: ${JSON.stringify(redactSensitiveFields(body))}`;
    }
    console.log(line);
  },
};
