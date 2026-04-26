/*
 * legacy-redirects.ts
 * ----------------------------------------------------------------------------
 * Express middleware that 301-redirects legacy slugs to their current
 * canonical equivalents. Avoids 404s on URLs that may already be indexed by
 * Google after a slug rename.
 *
 * The map lives in `legacy-redirects.json` (colocated) so non-engineers can
 * append entries without touching TypeScript. Three entry shapes are
 * supported:
 *
 *   1. EXACT       — JSON key/value are plain strings, matched against
 *                    req.path case-insensitively.
 *                       "/blog/index": "/es/blog"
 *
 *   2. PARAMETRIC  — JSON key contains the literal token `{lang}`. The
 *                    loader auto-expands such an entry into one row per
 *                    supported language (es, en, fr, de, pt, ca). The same
 *                    `{lang}` token may appear in the value to preserve the
 *                    prefix.
 *                       "/{lang}/blog/index": "/{lang}/blog"
 *
 *   3. REGEX       — value is an object `{ pattern, replacement }`. `pattern`
 *                    is the RegExp source (anchored exactly as the author
 *                    writes it) and `replacement` accepts $1..$N backrefs.
 *                       "old-llc": { "pattern": "^/old-llc-(\\w+)$",
 *                                    "replacement": "/es/blog/llc-$1" }
 *
 * Keys starting with `_` (e.g. `_doc`, `_notes`) are ignored — useful for
 * inline documentation inside the JSON.
 *
 * The middleware preserves the original query string on every redirect.
 * It only intercepts safe (GET/HEAD) requests; POST/PUT/PATCH/DELETE fall
 * through so a 301 cannot accidentally turn a write into a GET replay.
 * ----------------------------------------------------------------------------
 */

import type { Request, Response, NextFunction, RequestHandler } from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPPORTED_LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;

interface RegexEntry {
  pattern: string;
  replacement: string;
}

type RawEntry = string | RegexEntry;
type RawMap = Record<string, RawEntry | string[]>;

interface CompiledRegex {
  re: RegExp;
  replacement: string;
}

export interface CompiledMap {
  exact: Map<string, string>;
  regex: CompiledRegex[];
}

function isRegexEntry(value: unknown): value is RegexEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as RegexEntry).pattern === "string" &&
    typeof (value as RegexEntry).replacement === "string"
  );
}

/**
 * Compile a raw JSON map into a fast-lookup structure.
 *
 * - Keys starting with `_` are skipped (treated as comments).
 * - Array values (e.g. for `_doc`) are also skipped.
 * - Keys containing `{lang}` are expanded into 6 concrete entries.
 * - Values that are RegexEntry objects compile into the regex bucket.
 * - All other entries land in the exact-match bucket. Keys are lowercased
 *   so lookups can be case-insensitive.
 */
export function compileRedirectMap(raw: RawMap): CompiledMap {
  const exact = new Map<string, string>();
  const regex: CompiledRegex[] = [];

  for (const [key, value] of Object.entries(raw)) {
    if (key.startsWith("_")) continue;
    if (Array.isArray(value)) continue;

    if (isRegexEntry(value)) {
      try {
        regex.push({
          re: new RegExp(value.pattern, "i"),
          replacement: value.replacement,
        });
      } catch {
        // Skip malformed regex rather than crash the server at boot.
      }
      continue;
    }

    if (typeof value !== "string") continue;

    if (key.includes("{lang}")) {
      for (const lang of SUPPORTED_LANGS) {
        const expandedKey = key.replaceAll("{lang}", lang).toLowerCase();
        const expandedValue = value.replaceAll("{lang}", lang);
        exact.set(expandedKey, expandedValue);
      }
    } else {
      exact.set(key.toLowerCase(), value);
    }
  }

  return { exact, regex };
}

/**
 * Resolve a request path against the compiled map. Returns the redirect
 * target string or `null` if no rule matches.
 */
export function resolveRedirect(
  reqPath: string,
  compiled: CompiledMap,
): string | null {
  const lower = reqPath.toLowerCase();
  const direct = compiled.exact.get(lower);
  if (direct) return direct;

  for (const { re, replacement } of compiled.regex) {
    const m = reqPath.match(re);
    if (m) {
      return reqPath.replace(re, replacement);
    }
  }
  return null;
}

function defaultJsonPath(): string {
  // Resolve relative to this source file so the middleware works whether
  // imported by `tsx` (dev) or compiled into `dist/` (prod).
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.join(here, "legacy-redirects.json");
}

/**
 * Factory: load the JSON map from disk and return an Express middleware.
 * Exported so tests can pass a custom map via `createLegacyRedirects(map)`.
 */
export function createLegacyRedirects(
  rawOrPath?: RawMap | string,
): RequestHandler {
  let raw: RawMap;
  if (rawOrPath && typeof rawOrPath === "object") {
    raw = rawOrPath;
  } else {
    const file = typeof rawOrPath === "string" ? rawOrPath : defaultJsonPath();
    try {
      raw = JSON.parse(readFileSync(file, "utf8")) as RawMap;
    } catch {
      raw = {};
    }
  }
  const compiled = compileRedirectMap(raw);

  return function legacyRedirects(req: Request, res: Response, next: NextFunction) {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const target = resolveRedirect(req.path, compiled);
    if (!target) return next();
    const qs = req.originalUrl.includes("?")
      ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
      : "";
    return res.redirect(301, target + qs);
  };
}

/** Default singleton middleware — wired into server/index.ts. */
export const legacyRedirects: RequestHandler = createLegacyRedirects();

export default legacyRedirects;
