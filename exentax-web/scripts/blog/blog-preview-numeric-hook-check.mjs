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
let totalChecks = 0;

function audit(lang, slug, fields) {
  for (const f of FIELDS) {
    const v = fields[f];
    if (typeof v !== "string" || !v.trim()) continue;
    totalChecks++;
    if (!leadsWithDigit(v)) {
      offenders.push({ lang, slug, field: f, sentence: v.slice(0, 80) });
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

if (wantList) {
  for (const o of offenders) {
    console.log(`\n[${o.lang}/${o.slug}] ${o.field}`);
    console.log(`  ${o.sentence}`);
  }
}

process.exit(offenders.length > 0 ? 1 : 0);
