/*
 * geo.ts
 * ----------------------------------------------------------------------------
 * Lightweight server-side geo resolver for the calculator country / currency
 * prefill (Task #11). Reads ISO-3166-1 alpha-2 country code from
 * reverse-proxy headers commonly set by major hosting providers; if none of
 * those are present, falls back to the first language tag from the
 * `accept-language` header (best-effort: `es-ES` -> `ES`, `pt-BR` -> `BR`,
 * `fr-FR` -> `FR`, `en` alone -> `""`). When nothing resolves, the country
 * stays empty and the client keeps its existing default.
 *
 * NO external geo-IP database is consulted, NO npm dependency is added, and
 * the raw IP is never echoed back to the client. Header lookup order:
 *
 *   1. cf-ipcountry            (Cloudflare)
 *   2. x-vercel-ip-country     (Vercel)
 *   3. fly-client-ip-country   (Fly.io)
 *   4. accept-language         (final best-effort fallback)
 *
 * Result is attached to `(req as any).geo = { country: "ES" | "MX" | ... | "" }`.
 * ----------------------------------------------------------------------------
 */
import type { Request, Response, NextFunction } from "express";

const ISO_RE = /^[A-Z]{2}$/;

function pickHeader(req: Request, name: string): string {
  const v = req.headers[name];
  if (typeof v === "string") return v.trim().toUpperCase();
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0].trim().toUpperCase();
  return "";
}

/**
 * Best-effort country extraction from an `accept-language` header.
 * Examples:
 *   "es-ES,en;q=0.9"       -> "ES"
 *   "pt-BR"                -> "BR"
 *   "fr-FR,fr;q=0.8"       -> "FR"
 *   "en"                   -> ""    (no region tag, cannot infer country)
 */
export function countryFromAcceptLanguage(header: string | undefined): string {
  if (!header || typeof header !== "string") return "";
  const first = header.split(",")[0]?.trim();
  if (!first) return "";
  const tag = first.split(";")[0]?.trim();
  if (!tag) return "";
  const parts = tag.split("-");
  if (parts.length < 2) return "";
  const region = parts[1]?.toUpperCase() || "";
  return ISO_RE.test(region) ? region : "";
}

export function resolveCountryFromHeaders(req: Request): string {
  const cf = pickHeader(req, "cf-ipcountry");
  if (ISO_RE.test(cf)) return cf;
  const vercel = pickHeader(req, "x-vercel-ip-country");
  if (ISO_RE.test(vercel)) return vercel;
  const fly = pickHeader(req, "fly-client-ip-country");
  if (ISO_RE.test(fly)) return fly;
  const al = req.headers["accept-language"];
  return countryFromAcceptLanguage(typeof al === "string" ? al : undefined);
}

export function geoMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const country = resolveCountryFromHeaders(req);
  (req as Request & { geo?: { country: string } }).geo = { country };
  next();
}
