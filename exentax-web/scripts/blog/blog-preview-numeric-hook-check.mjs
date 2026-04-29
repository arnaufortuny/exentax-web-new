#!/usr/bin/env node
/**
 * Heuristic for Task #38 (numeric hook on previews & meta descriptions).
 *
 * Mirrors `blog-numeric-hook-check.mjs`, but instead of inspecting the article
 * body we inspect the short copy that powers SERP, social cards and on-site
 * teasers:
 *
 *   - Spanish source of truth: `client/src/data/blog-posts.ts`
 *       fields: excerpt, metaDescription, socialDescription, ogDescription
 *   - Localized variants:      `client/src/data/blog-i18n/{lang}.ts`
 *       fields: excerpt, metaDescription, socialDescription, ogDescription
 *
 * For every present field we require that the FIRST non-whitespace character
 * is a digit (0-9). This is the strict "lead with a number" projection of the
 * LOTE 6 numeric anchor rule onto the snippets that surface in Google SERP and
 * social previews — the digit must literally open the copy so the SERP/social
 * card renders a number-led teaser.
 *
 * Exit code: 0 if every field passes, 1 otherwise.
 *
 * Usage:
 *   node scripts/blog/blog-preview-numeric-hook-check.mjs [--list] [--lang es|en|fr|de|pt|ca]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(PROJECT_ROOT, "client", "src", "data");
const POSTS_FILE = path.join(DATA_DIR, "blog-posts.ts");
const I18N_DIR = path.join(DATA_DIR, "blog-i18n");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const FIELDS = ["excerpt", "metaDescription", "socialDescription", "ogDescription"];

const args = new Set(process.argv.slice(2));
const wantList = args.has("--list");
const langFilter = (() => {
  const idx = process.argv.indexOf("--lang");
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();

// Common short abbreviations whose trailing period must NOT be treated as a
// sentence terminator. Stored lowercase. Includes Spanish/Portuguese/Catalan
// /French/German/English forms. Compound dotted abbreviations such as
// "EE.UU.", "U.S.", "U.K." are detected separately by the embedded-period rule.
const ABBREVIATIONS = new Set([
  "art", "arts", "wyo", "stat", "inc", "ltd", "co", "corp", "sr", "sra",
  "vs", "pp", "pag", "fig", "no", "núm", "nº", "n", "p", "st", "mr", "mrs",
  "dr", "jr", "ee.uu", "u.s", "u.k", "d.c", "a.m", "p.m", "eu", "etc",
  "approx", "ca", "vol", "ed", "rev", "cf", "vgr", "vg", "z.b", "bzw",
  "u.a", "art\u00ed", "núms", "nums",
]);

function isAbbreviationPeriod(text, periodIdx) {
  // Walk back to the previous word boundary to recover the word that the
  // period closes.
  let s = periodIdx - 1;
  while (s >= 0 && !/[\s,;:()"'—¡¿«»]/.test(text[s])) s--;
  const word = text.slice(s + 1, periodIdx);
  if (!word) return false;
  if (ABBREVIATIONS.has(word.toLowerCase())) return true;
  // Multi-letter dotted abbreviation like "U.S", "EE.UU", "D.C".
  if (/[A-Za-z]\.[A-Za-z]/.test(word)) return true;
  // Word containing periods (chained abbreviation).
  if (word.includes(".")) return true;
  // Single-letter word followed by period (initial).
  if (word.length === 1 && /[A-Za-z]/.test(word)) return true;
  return false;
}

function firstSentence(text) {
  if (typeof text !== "string") return "";
  const trimmed = text.trim();
  if (!trimmed) return "";
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c !== "." && c !== "!" && c !== "?") continue;
    const next = trimmed[i + 1];
    // Sentence terminator must be followed by whitespace or end-of-string.
    if (next && !/\s/.test(next)) {
      // Allow thousand separator like 600.000.
      const prev = trimmed[i - 1] || "";
      if (c === "." && /\d/.test(prev) && /\d/.test(next)) continue;
      continue;
    }
    if (c === "." && isAbbreviationPeriod(trimmed, i)) continue;
    return trimmed.slice(0, i + 1);
  }
  return trimmed;
}

function leadsWithDigit(text) {
  if (typeof text !== "string") return false;
  // Strict: first non-whitespace character must be a digit (0-9).
  return /^\s*\d/.test(text);
}

/**
 * Task #41 / Task #54 — "awkward-numeric-opener" rule for previews.
 *
 * After LOTE 38 prepended a digit-led opener to every preview snippet, a
 * subset of localized entries ended up with a bare 4-digit YEAR followed by
 * a period and a fragment that no longer references the year (e.g. "1970.
 * What your bank reports..."). On a SERP/social card this reads as a
 * dangling label rather than a sentence.
 *
 * Task #41 covered the bare-year-with-period case. Task #54 extends the
 * same intent to the near-variants that produce the same awkward leading
 * label in a Google snippet:
 *
 *   - "YYYY:"   (colon, optionally with French-style space-before-colon)
 *   - "YYYY -"  (hyphen-minus surrounded by whitespace)
 *   - "YYYY \u2013" (en-dash surrounded by whitespace)
 *   - "YYYY \u2014" (em-dash surrounded by whitespace)
 *
 * In every case the soft separator must be followed by visible content (so
 * we never collapse a "2014-2024" range — which writes the dash without
 * surrounding spaces — into a false positive).
 *
 * This rule flags meta/social/og previews whose first sentence (as recovered
 * by `firstSentence` above) is JUST a bare year in the 1900-2099 range, OR
 * whose leading non-whitespace fragment is "YYYY" closed by one of the soft
 * separators listed above. The existing strict "must lead with digit" rule
 * (`leadsWithDigit`) is preserved untouched; this rule is additive.
 *
 * Spanish (master) is intentionally exempt — Task #41 explicitly forbids
 * touching `client/src/data/blog-posts.ts` (the master copy). The rewrite
 * lives in `client/src/data/blog-i18n/{en,fr,de,pt,ca}.ts`.
 *
 * `excerpt` is NOT in scope for this rule (the LOTE 38 numeric-hook anchor
 * is allowed to ride at the very head of the article teaser); only the
 * SERP/social copy fields are audited. Excerpt is still covered by the
 * strict-leads-with-digit invariant above.
 */
const AWKWARD_NUMERIC_OPENER_FIELDS = new Set([
  "metaDescription",
  "socialDescription",
  "ogDescription",
]);
const AWKWARD_NUMERIC_OPENER_LANG_EXEMPT = new Set(["es"]);

// Task #54 — soft separators that turn a leading bare year into a dangling
// SERP label. Colon may sit flush to the year ("2014:") or carry the French
// thin-space convention ("2014 :"); the dashes must have whitespace on both
// sides so legitimate ranges like "2014-2024" stay safe.
const AWKWARD_LEADING_YEAR_COLON_RE = /^(19|20)\d{2}\s*:\s+\S/u;
const AWKWARD_LEADING_YEAR_DASH_RE = /^(19|20)\d{2}\s+[-\u2013\u2014]\s+\S/u;

function isAwkwardNumericOpener(text) {
  if (typeof text !== "string") return false;
  const trimmed = text.trim();
  if (!trimmed) return false;
  // Task #41 — bare year forming the entire first sentence.
  const first = firstSentence(trimmed);
  if (first) {
    const inner = first.replace(/[.!?]+$/u, "").trim();
    if (/^(19|20)\d{2}$/.test(inner)) return true;
  }
  // Task #54 — bare year followed by a soft SERP-awkward separator.
  if (AWKWARD_LEADING_YEAR_COLON_RE.test(trimmed)) return true;
  if (AWKWARD_LEADING_YEAR_DASH_RE.test(trimmed)) return true;
  return false;
}

/**
 * Parse the Spanish blog-posts.ts. We extract per-slug objects by walking
 * `slug: "..."` markers and grabbing the surrounding object literal text.
 * We then read the small set of string fields we care about with a regex.
 */
function parseSpanishPosts() {
  const raw = fs.readFileSync(POSTS_FILE, "utf8");
  const slugRe = /slug:\s*"([^"]+)"/g;
  const out = [];
  let match;
  while ((match = slugRe.exec(raw)) !== null) {
    const slug = match[1];
    // Find the start of this object literal: walk backwards to the nearest `{`.
    let i = match.index;
    while (i > 0 && raw[i] !== "{") i--;
    // Walk forward balancing braces to find the end.
    let depth = 0;
    let j = i;
    for (; j < raw.length; j++) {
      const c = raw[j];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const block = raw.slice(i, j);
    const fields = {};
    for (const f of FIELDS) {
      const re = new RegExp(`${f}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const fm = block.match(re);
      if (fm) fields[f] = JSON.parse(`"${fm[1]}"`);
    }
    out.push({ slug, fields });
  }
  return out;
}

/**
 * Parse a blog-i18n/{lang}.ts file. Each entry is one line of the form
 * `"slug": { title: "...", excerpt: "...", metaDescription: "...", ... },`.
 */
function parseI18nFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const entryRe = /"([^"]+)":\s*\{([\s\S]*?)\}\s*,?\s*\n/g;
  const out = [];
  let m;
  while ((m = entryRe.exec(raw)) !== null) {
    const slug = m[1];
    const block = m[2];
    if (!/(title|excerpt|metaDescription)/.test(block)) continue;
    const fields = {};
    for (const f of FIELDS) {
      const re = new RegExp(`${f}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const fm = block.match(re);
      if (fm) fields[f] = JSON.parse(`"${fm[1]}"`);
    }
    out.push({ slug, fields });
  }
  return out;
}

const offenders = [];
const awkwardOffenders = [];
let totalChecks = 0;
let awkwardChecks = 0;

function audit(lang, slug, fields) {
  for (const f of FIELDS) {
    const v = fields[f];
    if (typeof v !== "string" || !v.trim()) continue;
    totalChecks++;
    if (!leadsWithDigit(v)) {
      offenders.push({ lang, slug, field: f, sentence: v.slice(0, 80) });
    }
    // Task #41 — awkward-numeric-opener (additive). Only checks meta/social/og,
    // and skips ES (master is exempt per task scope).
    if (
      AWKWARD_NUMERIC_OPENER_FIELDS.has(f) &&
      !AWKWARD_NUMERIC_OPENER_LANG_EXEMPT.has(lang)
    ) {
      awkwardChecks++;
      if (isAwkwardNumericOpener(v)) {
        awkwardOffenders.push({
          lang,
          slug,
          field: f,
          sentence: v.slice(0, 100),
        });
      }
    }
  }
}

if (!langFilter || langFilter === "es") {
  for (const { slug, fields } of parseSpanishPosts()) {
    audit("es", slug, fields);
  }
}

for (const lang of LANGS.filter((l) => l !== "es")) {
  if (langFilter && lang !== langFilter) continue;
  const fp = path.join(I18N_DIR, `${lang}.ts`);
  if (!fs.existsSync(fp)) continue;
  for (const { slug, fields } of parseI18nFile(fp)) {
    audit(lang, slug, fields);
  }
}

console.log(`Total field checks: ${totalChecks}`);
console.log(`Offenders (no digit in first sentence): ${offenders.length}`);
const byLang = {};
const byField = {};
for (const o of offenders) {
  byLang[o.lang] = (byLang[o.lang] || 0) + 1;
  byField[o.field] = (byField[o.field] || 0) + 1;
}
console.log("By language:", JSON.stringify(byLang));
console.log("By field:   ", JSON.stringify(byField));

console.log(
  `\nAwkward-numeric-opener checks (meta/social/og, ES exempt): ${awkwardChecks}`,
);
console.log(`Awkward-numeric-opener offenders:                     ${awkwardOffenders.length}`);
const awkByLang = {};
const awkByField = {};
for (const o of awkwardOffenders) {
  awkByLang[o.lang] = (awkByLang[o.lang] || 0) + 1;
  awkByField[o.field] = (awkByField[o.field] || 0) + 1;
}
if (awkwardOffenders.length > 0) {
  console.log("Awkward by language:", JSON.stringify(awkByLang));
  console.log("Awkward by field:   ", JSON.stringify(awkByField));
}

if (wantList) {
  for (const o of offenders) {
    console.log(`\n[no-digit-lead | ${o.lang}/${o.slug}] ${o.field}`);
    console.log(`  ${o.sentence}`);
  }
  for (const o of awkwardOffenders) {
    console.log(`\n[awkward-numeric-opener | ${o.lang}/${o.slug}] ${o.field}`);
    console.log(`  ${o.sentence}`);
  }
}

const failed = offenders.length > 0 || awkwardOffenders.length > 0;
process.exit(failed ? 1 : 0);
