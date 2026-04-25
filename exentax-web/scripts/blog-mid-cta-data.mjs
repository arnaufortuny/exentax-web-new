#!/usr/bin/env node
/*
 * blog-mid-cta-data.mjs
 * ----------------------------------------------------------------------------
 * Shared parser used by `blog-mid-cta-rewrite.mjs` and
 * `blog-mid-cta-check.mjs` to load the single source-of-truth data from
 *   - client/src/data/blog-mid-cta-copy.ts   (variant → lang → label/route/hash)
 *   - client/src/data/blog-cta-routes.ts     (slug → pattern)
 *   - shared/routes.ts                       (route → lang → slug)
 *
 * The `.ts` files are parsed via tightly-scoped regexes (mirroring the
 * pattern used by `scripts/blog-cta-validate.mjs` for `blog-cta-library.ts`)
 * so we do not drag a TypeScript loader into the build pipeline.
 *
 * Exposes:
 *   LANGS, MID_CTA_VARIANTS, MID_CTA, ROUTE_SLUGS,
 *   getMidCtaVariantForSlug(slug),
 *   getMidCtaCopyForSlug(slug, lang),
 *   getMidCtaHref(slug, lang),
 *   buildMidCtaBlock(slug, lang).
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");

export const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const MID_CTA_FILE = path.join(REPO, "client/src/data/blog-mid-cta-copy.ts");
const ROUTES_FILE = path.join(REPO, "client/src/data/blog-cta-routes.ts");
const SHARED_ROUTES_FILE = path.join(REPO, "shared/routes.ts");

// ---------------------------------------------------------------------------
// Parse shared/routes.ts → ROUTE_SLUGS[routeKey][lang] = slug
// ---------------------------------------------------------------------------
function parseSharedRoutes() {
  const src = fs.readFileSync(SHARED_ROUTES_FILE, "utf8");
  const start = src.indexOf("ROUTE_SLUGS");
  const open = src.indexOf("{", start);
  if (open < 0) throw new Error("ROUTE_SLUGS opening brace not found");
  // find the matching close brace by counting (simple: it ends with }; before next `export`)
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end < 0) throw new Error("ROUTE_SLUGS closing brace not found");
  const body = src.slice(open + 1, end);

  const routeRx = /(\w+):\s*\{([^}]*)\}/g;
  const out = {};
  let m;
  while ((m = routeRx.exec(body))) {
    const key = m[1];
    const inner = m[2];
    const langs = {};
    const langRx = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let lm;
    while ((lm = langRx.exec(inner))) langs[lm[1]] = lm[2];
    out[key] = langs;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Parse client/src/data/blog-cta-routes.ts → { MAP, HEURISTIC, DEFAULT }
// ---------------------------------------------------------------------------
function parseBlogCtaRoutes() {
  const src = fs.readFileSync(ROUTES_FILE, "utf8");

  // MAP entries:  "slug": { route: "x", secondaryRoute: "y", pattern: "z" },
  const mapStart = src.indexOf("const MAP");
  const mapOpen = src.indexOf("{", mapStart);
  // close at matching brace
  let depth = 0;
  let mapClose = -1;
  for (let i = mapOpen; i < src.length; i += 1) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) { mapClose = i; break; }
    }
  }
  const mapBody = src.slice(mapOpen + 1, mapClose);
  const map = {};
  // entries are one per logical line: "slug": { route: "x", pattern: "y" },
  const entryRx = /"([^"]+)"\s*:\s*\{\s*([^}]*)\}/g;
  let m;
  while ((m = entryRx.exec(mapBody))) {
    const slug = m[1];
    const inner = m[2];
    const routeMatch = inner.match(/route:\s*"([^"]+)"/);
    const patternMatch = inner.match(/pattern:\s*"([^"]+)"/);
    map[slug] = {
      route: routeMatch ? routeMatch[1] : null,
      pattern: patternMatch ? patternMatch[1] : null,
    };
  }

  // DEFAULT
  const defaultMatch = src.match(/const DEFAULT[^=]*=\s*\{([^}]*)\}/);
  const defaultPattern = defaultMatch
    ? (defaultMatch[1].match(/pattern:\s*"([^"]+)"/) || [])[1] || "book_consultation"
    : "book_consultation";

  // HEURISTIC array:  { re: /\bnuevo-mexico\b/, route: "service_llc_nm", pattern: "llc_state_compare" }
  const hStart = src.indexOf("const HEURISTIC");
  const hOpen = src.indexOf("[", hStart);
  // matching ]
  let dep = 0;
  let hClose = -1;
  for (let i = hOpen; i < src.length; i += 1) {
    if (src[i] === "[") dep += 1;
    else if (src[i] === "]") {
      dep -= 1;
      if (dep === 0) { hClose = i; break; }
    }
  }
  const hBody = src.slice(hOpen + 1, hClose);
  const heuristic = [];
  const hRx = /\{\s*re:\s*\/([^/]+)\/[gimsuy]*\s*,\s*route:\s*"([^"]+)"\s*,\s*pattern:\s*"([^"]+)"\s*\}/g;
  let hm;
  while ((hm = hRx.exec(hBody))) {
    heuristic.push({
      re: new RegExp(hm[1]),
      route: hm[2],
      pattern: hm[3],
    });
  }

  return { map, heuristic, defaultPattern };
}

function getPatternForSlug(slug, parsedRoutes) {
  const { map, heuristic, defaultPattern } = parsedRoutes;
  if (slug in map && map[slug].pattern) return map[slug].pattern;
  for (const h of heuristic) if (h.re.test(slug)) return h.pattern;
  return defaultPattern;
}

// ---------------------------------------------------------------------------
// Parse client/src/data/blog-mid-cta-copy.ts → { variants, patternToVariant }
// ---------------------------------------------------------------------------
function parseMidCtaCopy() {
  const src = fs.readFileSync(MID_CTA_FILE, "utf8");

  const startTok = "export const BLOG_MID_CTA_COPY";
  const startIdx = src.indexOf(startTok);
  if (startIdx < 0) throw new Error("export const BLOG_MID_CTA_COPY not found in blog-mid-cta-copy.ts");
  const open = src.indexOf("{", startIdx);
  let depth = 0;
  let close = -1;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) { close = i; break; }
    }
  }
  if (close < 0) throw new Error("Closing brace for BLOG_MID_CTA_COPY not found");
  const body = src.slice(open + 1, close);

  // body has top-level keys (variant ids), each a nested object containing
  // per-language entries. Parse depth-aware to extract `variantId: { ... },`.
  const variants = {};
  let cursor = 0;
  while (cursor < body.length) {
    // skip ws + comments + commas
    while (cursor < body.length && /[\s,]/.test(body[cursor])) cursor += 1;
    // skip line comments
    if (body.slice(cursor, cursor + 2) === "//") {
      const nl = body.indexOf("\n", cursor);
      cursor = nl < 0 ? body.length : nl + 1;
      continue;
    }
    if (body.slice(cursor, cursor + 2) === "/*") {
      const endC = body.indexOf("*/", cursor);
      cursor = endC < 0 ? body.length : endC + 2;
      continue;
    }
    if (cursor >= body.length) break;
    // expect identifier
    const idMatch = body.slice(cursor).match(/^([A-Za-z_]\w*)\s*:\s*\{/);
    if (!idMatch) break;
    const variantId = idMatch[1];
    const objOpen = cursor + idMatch[0].length - 1;
    let d = 0;
    let objClose = -1;
    for (let j = objOpen; j < body.length; j += 1) {
      if (body[j] === "{") d += 1;
      else if (body[j] === "}") {
        d -= 1;
        if (d === 0) { objClose = j; break; }
      }
    }
    const variantBody = body.slice(objOpen + 1, objClose);
    // Parse per-language entries:  es: { label: "...", route: "..", hash: ".." },
    const langs = {};
    const langRx = /(es|en|fr|de|pt|ca):\s*\{\s*label:\s*"((?:[^"\\]|\\.)*)"\s*,\s*route:\s*"([^"]+)"(?:\s*,\s*hash:\s*"([^"]+)")?\s*,?\s*\}/g;
    let lm;
    while ((lm = langRx.exec(variantBody))) {
      langs[lm[1]] = {
        label: lm[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\"),
        route: lm[3],
        hash: lm[4] || null,
      };
    }
    if (Object.keys(langs).length !== LANGS.length) {
      throw new Error(`Variant ${variantId}: expected ${LANGS.length} languages, got ${Object.keys(langs).length}`);
    }
    variants[variantId] = langs;
    cursor = objClose + 1;
  }

  // Parse MID_CTA_PATTERN_TO_VARIANT map
  const ptvTok = "export const MID_CTA_PATTERN_TO_VARIANT";
  const ptvIdx = src.indexOf(ptvTok);
  if (ptvIdx < 0) throw new Error("export const MID_CTA_PATTERN_TO_VARIANT not found");
  const ptvOpen = src.indexOf("{", ptvIdx);
  let pd = 0;
  let ptvClose = -1;
  for (let i = ptvOpen; i < src.length; i += 1) {
    if (src[i] === "{") pd += 1;
    else if (src[i] === "}") {
      pd -= 1;
      if (pd === 0) { ptvClose = i; break; }
    }
  }
  const ptvBody = src.slice(ptvOpen + 1, ptvClose);
  const patternToVariant = {};
  const ptvRx = /([a-z_]\w*):\s*"([a-z_]\w*)"/g;
  let pm;
  while ((pm = ptvRx.exec(ptvBody))) patternToVariant[pm[1]] = pm[2];

  return { variants, patternToVariant };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
let _cache = null;
export function loadAll() {
  if (_cache) return _cache;
  const routeSlugs = parseSharedRoutes();
  const blogRoutes = parseBlogCtaRoutes();
  const { variants, patternToVariant } = parseMidCtaCopy();
  _cache = {
    routeSlugs,
    blogRoutes,
    variants,
    patternToVariant,
    midCtaVariantIds: Object.keys(variants),
  };
  return _cache;
}

export function getMidCtaVariantForSlug(slug) {
  const { blogRoutes, patternToVariant } = loadAll();
  const pattern = getPatternForSlug(slug, blogRoutes);
  return patternToVariant[pattern] ?? "free_consult";
}

export function getMidCtaCopyForSlug(slug, lang) {
  const { variants } = loadAll();
  const variant = getMidCtaVariantForSlug(slug);
  return variants[variant][lang];
}

export function getMidCtaHref(slug, lang) {
  const { routeSlugs } = loadAll();
  const copy = getMidCtaCopyForSlug(slug, lang);
  const slugPath = routeSlugs[copy.route][lang];
  const base = slugPath ? `/${lang}/${slugPath}` : `/${lang}`;
  return copy.hash ? `${base}${copy.hash}` : base;
}

/** Build the canonical `<!-- exentax:calc-cta-v1 --> ... <!-- /exentax:calc-cta-v1 -->`
 *  payload (without the wrapping markers — caller handles those). The shape is
 *  a single-line markdown blockquote with a single anchor:
 *    > <a href="{href}">{label}</a>
 */
export function buildMidCtaInner(slug, lang) {
  const copy = getMidCtaCopyForSlug(slug, lang);
  const href = getMidCtaHref(slug, lang);
  return `> <a href="${href}">${copy.label}</a>`;
}

export const APPROVED_LABELS_BY_LANG = (() => {
  const { variants } = loadAll();
  const out = {};
  for (const lang of LANGS) {
    out[lang] = Object.keys(variants).map((v) => variants[v][lang].label);
  }
  return out;
})();
