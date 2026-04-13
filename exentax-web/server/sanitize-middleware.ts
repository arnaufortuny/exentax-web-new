import type { Request, Response, NextFunction } from "express";
import { backendLabel, resolveRequestLang } from "./routes/shared";

const CHAR_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};
const ESCAPE_RE = /[&<>"']/g;

function sanitizeValue(val: string): string {
  return val.replace(ESCAPE_RE, (ch) => CHAR_MAP[ch] || ch);
}

const MAX_KEYS = 500;
const MAX_ARRAY_LEN = 200;
const MAX_DEPTH = 10;

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function sanitizeInPlace(obj: any, depth = 0): void {
  if (!obj || typeof obj !== "object") return;
  if (depth > MAX_DEPTH || obj instanceof Buffer || obj instanceof Uint8Array) return;

  if (Array.isArray(obj)) {
    const len = Math.min(obj.length, MAX_ARRAY_LEN);
    for (let i = 0; i < len; i++) {
      if (typeof obj[i] === "string") {
        obj[i] = sanitizeValue(obj[i]);
      } else if (typeof obj[i] === "object" && obj[i] !== null) {
        sanitizeInPlace(obj[i], depth + 1);
      }
    }
    return;
  }

  const keys = Object.keys(obj);
  for (let i = 0; i < Math.min(keys.length, MAX_KEYS); i++) {
    const key = keys[i];
    if (DANGEROUS_KEYS.has(key)) {
      delete obj[key];
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    if (typeof obj[key] === "string") {
      obj[key] = sanitizeValue(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInPlace(obj[key], depth + 1);
    }
  }
}

const SKIP_PATHS: string[] = [];

function countKeys(obj: any, depth = 0): number {
  if (!obj || typeof obj !== "object" || depth > MAX_DEPTH) return 0;
  if (obj instanceof Buffer || obj instanceof Uint8Array) return 0;
  let count = 0;
  if (Array.isArray(obj)) {
    if (obj.length > MAX_ARRAY_LEN) return MAX_KEYS + 1;
    for (const item of obj) count += countKeys(item, depth + 1);
  } else {
    const keys = Object.keys(obj);
    count += keys.length;
    for (const key of keys) count += countKeys(obj[key], depth + 1);
  }
  return count;
}

export function autoSanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (SKIP_PATHS.some(p => req.path === p || req.path.startsWith(p))) {
    return next();
  }

  sanitizeInPlace(req.query);
  sanitizeInPlace(req.params);

  if (req.method === "GET" || req.method === "OPTIONS" || req.method === "HEAD") {
    return next();
  }

  if (req.body && typeof req.body === "object" && !(req.body instanceof Buffer)) {
    const totalKeys = countKeys(req.body);
    if (totalKeys > MAX_KEYS) {
      return res.status(413).json({ ok: false, error: backendLabel("payloadTooComplex", resolveRequestLang(req)), code: "PAYLOAD_TOO_COMPLEX" });
    }
    sanitizeInPlace(req.body);
  }

  next();
}
