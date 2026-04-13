import type { Response } from "express";
import type { ZodError } from "zod";
import { backendLabel, resolveRequestLang } from "./shared";

function resolveLang(res: Response, lang?: string | null): string {
  if (lang) return lang;
  try { return resolveRequestLang(res.req); } catch { return "en"; }
}

export function apiOk(res: Response, data?: Record<string, any>, status = 200): Response {
  return res.status(status).json({ ok: true, ...data });
}

export function apiFail(res: Response, status: number, error: string, code: string, extra?: Record<string, any>): Response {
  return res.status(status).json({ ok: false, error, code, ...extra });
}

export function apiValidationFail(res: Response, zodError: ZodError, lang?: string | null): Response {
  const resolved = resolveLang(res, lang);
  const details: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".");
    if (!details[key]) {
      const msg = issue.message;
      const translated = backendLabel(msg, resolved);
      details[key] = translated !== msg ? translated : msg;
    }
  }
  return apiFail(res, 400, backendLabel("validationFailed", resolved), "VALIDATION_ERROR", { details });
}

export function apiRateLimited(res: Response, message?: string, retryAfterSeconds = 60, lang?: string | null): Response {
  const resolved = resolveLang(res, lang);
  res.setHeader("Retry-After", String(retryAfterSeconds));
  const msg = message ? backendLabel(message, resolved) : backendLabel("rateLimited", resolved);
  return apiFail(res, 429, msg, "RATE_LIMITED");
}

export function apiNotFound(res: Response, message?: string, lang?: string | null): Response {
  const resolved = resolveLang(res, lang);
  const msg = message ? backendLabel(message, resolved) : backendLabel("notFound", resolved);
  return apiFail(res, 404, msg, "NOT_FOUND");
}
