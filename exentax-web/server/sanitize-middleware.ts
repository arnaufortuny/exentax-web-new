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

export function sanitizeInPlace(obj: unknown, depth = 0): void {
  if (!obj || typeof obj !== "object") return;
  if (depth > MAX_DEPTH || obj instanceof Buffer || obj instanceof Uint8Array) return;

  if (Array.isArray(obj)) {
    const len = Math.min(obj.length, MAX_ARRAY_LEN);
    for (let i = 0; i < len; i++) {
      const v = obj[i];
      if (typeof v === "string") {
        obj[i] = sanitizeValue(v);
      } else if (typeof v === "object" && v !== null) {
        sanitizeInPlace(v, depth + 1);
      }
    }
    return;
  }

  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record);
  for (let i = 0; i < Math.min(keys.length, MAX_KEYS); i++) {
    const key = keys[i];
    if (DANGEROUS_KEYS.has(key)) {
      delete record[key];
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(record, key)) continue;
    const v = record[key];
    if (typeof v === "string") {
      record[key] = sanitizeValue(v);
    } else if (typeof v === "object" && v !== null) {
      sanitizeInPlace(v, depth + 1);
    }
  }
}

function countKeys(obj: unknown, depth = 0): number {
  if (!obj || typeof obj !== "object" || depth > MAX_DEPTH) return 0;
  if (obj instanceof Buffer || obj instanceof Uint8Array) return 0;
  let count = 0;
  if (Array.isArray(obj)) {
    if (obj.length > MAX_ARRAY_LEN) return MAX_KEYS + 1;
    for (const item of obj) count += countKeys(item, depth + 1);
  } else {
    const record = obj as Record<string, unknown>;
    const keys = Object.keys(record);
    count += keys.length;
    for (const key of keys) count += countKeys(record[key], depth + 1);
  }
  return count;
}

export function autoSanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
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
