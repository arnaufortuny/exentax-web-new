#!/usr/bin/env node
/**
 * Auto-fixer for Task #38.
 *
 * For every preview/meta-description field whose first sentence does not
 * contain a digit, prepend a short digit-led clause derived from the
 * article's per-language numeric hook (`scripts/blog/data/article-numeric-hooks.json`).
 *
 * Idempotent: if the field already leads with a digit, it is left untouched.
 *
 * Files updated:
 *   - client/src/data/blog-posts.ts                    (es source of truth)
 *   - client/src/data/blog-i18n/{en,fr,de,pt,ca}.ts    (localized variants)
 *
 * Fields touched per entry: excerpt, metaDescription, socialDescription,
 * ogDescription.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(PROJECT_ROOT, "client", "src", "data");
const POSTS_FILE = path.join(DATA_DIR, "blog-posts.ts");
const I18N_DIR = path.join(DATA_DIR, "blog-i18n");
const HOOKS_FILE = path.join(__dirname, "data", "article-numeric-hooks.json");
const FIELDS = ["excerpt", "metaDescription", "socialDescription", "ogDescription"];
const I18N_LANGS = ["en", "fr", "de", "pt", "ca"];

const HOOKS = JSON.parse(fs.readFileSync(HOOKS_FILE, "utf8"));

// Mirror of `firstSentence`/abbreviation handling in
// `blog-preview-numeric-hook-check.mjs`. Keep these two in sync.
const ABBREVIATIONS = new Set([
  "art", "arts", "wyo", "stat", "inc", "ltd", "co", "corp", "sr", "sra",
  "vs", "pp", "pag", "fig", "no", "núm", "nº", "n", "p", "st", "mr", "mrs",
  "dr", "jr", "ee.uu", "u.s", "u.k", "d.c", "a.m", "p.m", "eu", "etc",
  "approx", "ca", "vol", "ed", "rev", "cf", "vgr", "vg", "z.b", "bzw",
  "u.a", "art\u00ed", "núms", "nums",
]);

function isAbbreviationPeriod(text, periodIdx) {
  let s = periodIdx - 1;
  while (s >= 0 && !/[\s,;:()"'—¡¿«»]/.test(text[s])) s--;
  const word = text.slice(s + 1, periodIdx);
  if (!word) return false;
  if (ABBREVIATIONS.has(word.toLowerCase())) return true;
  if (/[A-Za-z]\.[A-Za-z]/.test(word)) return true;
  if (word.includes(".")) return true;
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
    if (next && !/\s/.test(next)) {
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
  // Strict: first non-whitespace character must be a digit.
  return /^\s*\d/.test(text);
}

/**
 * Pull a short digit-LED clause from a numeric-hook sentence. The clause
 * MUST begin with a digit (0-9): we anchor at the first digit in the source
 * text and walk forward only — never back — so the resulting opener always
 * leads with a number when prepended. We then walk forward to the next
 * clause boundary (`,` `;` `:` `—` `(` or a sentence terminator that is NOT
 * inside a numeric thousand separator like `600.000`), and cap at maxWords.
 * Currency / comparator characters that immediately precede the digit
 * ("$", "€", "+", "-") are NOT included so the literal first character of
 * the returned clause is a digit. Returns null if no digit is found.
 */
function extractDigitClause(text, maxWords = 22) {
  if (typeof text !== "string") return null;
  const digitIdx = text.search(/\d/);
  if (digitIdx < 0) return null;
  const isClauseBoundaryChar = (c, prev, next) => {
    if (c === "," || c === ";" || c === ":" || c === "—" || c === "(" || c === ")") return true;
    if (c === "." || c === "!" || c === "?") {
      const isThousandSep = c === "." && /\d/.test(prev || "") && /\d/.test(next || "");
      return !isThousandSep;
    }
    return false;
  };
  // Anchor start AT the first digit so the clause literally leads with 0-9.
  const start = digitIdx;
  // Walk forward to the next clause boundary (or end).
  let end = text.length;
  for (let k = digitIdx + 1; k < text.length; k++) {
    if (isClauseBoundaryChar(text[k], text[k - 1], text[k + 1])) {
      end = k;
      break;
    }
  }
  let clause = text.slice(start, end).trim();
  // Cap to maxWords. Because we anchored on the digit, simply truncate the
  // tail — the digit always sits in word 0.
  const words = clause.split(/\s+/);
  if (words.length > maxWords) {
    clause = words.slice(0, maxWords).join(" ");
  }
  clause = clause.replace(/[\s,;:—]+$/gu, "").trim();
  // Strip trailing connector words (preposition/article/conjunction left
  // hanging by the word cap) that read awkwardly as a clause ending.
  const TRAILING_STOP = new Set([
    "de", "del", "la", "el", "los", "las", "un", "una", "unos", "unas",
    "y", "o", "u", "e", "i", "que", "para", "por", "con", "sin", "en",
    "a", "al", "desde", "hasta", "como", "es", "son", "sobre", "entre",
    "of", "the", "a", "an", "and", "or", "for", "with", "to", "from",
    "in", "on", "at", "is", "are", "as", "by", "than", "until", "since",
    "et", "ou", "le", "les", "des", "du", "au", "aux", "pour", "avec",
    "sans", "sur", "entre", "depuis", "jusqu",
    "und", "oder", "der", "die", "das", "den", "dem", "des", "ein", "eine",
    "einen", "einer", "eines", "für", "mit", "ohne", "auf", "in", "an",
    "zu", "zum", "zur", "bis", "seit",
    "do", "da", "dos", "das", "no", "na", "nos", "nas", "para", "por",
    "com", "sem", "até", "desde", "como",
    "i", "el", "la", "els", "les", "del", "dels", "de", "que", "amb",
    "sense", "fins", "des", "com",
  ]);
  let trimmedWords = clause.split(/\s+/);
  // Always keep at least the digit-bearing first word.
  while (trimmedWords.length > 1) {
    const last = trimmedWords[trimmedWords.length - 1].toLowerCase().replace(/[.,;:!?]+$/u, "");
    if (!TRAILING_STOP.has(last)) break;
    trimmedWords = trimmedWords.slice(0, -1);
  }
  clause = trimmedWords.join(" ").replace(/[\s,;:—]+$/u, "").trim();
  // Final invariant: clause must start with a digit.
  if (!/^\d/.test(clause)) return null;
  return clause;
}

/** Per-field hard character cap used during rewrite. */
const FIELD_MAX_LEN = {
  metaDescription: 154,
};

/**
 * Build the rewritten value: `${digitClause}. ${original}`.
 *
 * For length-capped fields (metaDescription) we trim the ORIGINAL text from
 * the right at a word boundary so the digit-led opener always survives.
 */
function buildOpener(hook, maxWords) {
  const clause = extractDigitClause(hook, maxWords);
  if (!clause) return null;
  return /[.!?]$/.test(clause) ? clause : `${clause}.`;
}

function rewrite(original, slug, lang, field) {
  const hook = HOOKS[slug]?.[lang] || HOOKS[slug]?.es || null;
  if (typeof hook !== "string" || !/\d/.test(hook)) return null;
  const trimmed = original.trim();
  const cap = FIELD_MAX_LEN[field];

  // Try increasingly compact openers when a length cap forces it.
  const wordBudgets = cap ? [22, 18, 14, 10, 8, 6] : [22];
  let opener = null;
  for (const wb of wordBudgets) {
    const candidate = buildOpener(hook, wb);
    if (!candidate) continue;
    opener = candidate;
    if (!cap || candidate.length + 1 <= cap - 8) break; // leave room for a tail
  }
  if (!opener) return null;
  if (trimmed.toLowerCase().startsWith(opener.toLowerCase().replace(/[.!?]$/, ""))) {
    return null;
  }

  let combined = `${opener} ${trimmed}`;
  if (cap && combined.length > cap) {
    const room = cap - opener.length - 1; // space separator
    if (room <= 8) {
      // Tail too small to be meaningful; keep just the digit-led opener.
      // If the opener itself overflows, fall back to a shorter one.
      if (opener.length > cap) {
        const shortOpener = buildOpener(hook, 8);
        combined = shortOpener && shortOpener.length <= cap ? shortOpener : opener.slice(0, cap);
      } else {
        combined = opener;
      }
    } else {
      let tail = trimmed.slice(0, room);
      const lastSentence = Math.max(
        tail.lastIndexOf(". "),
        tail.lastIndexOf("? "),
        tail.lastIndexOf("! "),
      );
      if (lastSentence > room * 0.4) {
        tail = tail.slice(0, lastSentence + 1);
      } else {
        const lastSpace = tail.lastIndexOf(" ");
        if (lastSpace > 10) tail = tail.slice(0, lastSpace);
        tail = tail.replace(/[\s,;:—]+$/u, "");
      }
      combined = `${opener} ${tail.trim()}`;
    }
  }
  return combined;
}

function jsQuote(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Locate every per-slug object literal in a file and return their absolute
 * positions plus the slug name. `scope` is "es" for blog-posts.ts and a
 * language code for blog-i18n/{lang}.ts.
 */
function collectSlugBlocks(text, scope) {
  const slugRe = scope === "es"
    ? /slug:\s*"([^"]+)"/g
    : /"([^"]+)":\s*\{/g;
  const blocks = [];
  let m;
  while ((m = slugRe.exec(text)) !== null) {
    const slug = m[1];
    let openIdx;
    if (scope === "es") {
      openIdx = m.index;
      while (openIdx > 0 && text[openIdx] !== "{") openIdx--;
    } else {
      openIdx = text.indexOf("{", m.index);
    }
    let depth = 0;
    let j = openIdx;
    for (; j < text.length; j++) {
      const c = text[j];
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    blocks.push({ slug, start: openIdx, end: j });
  }
  return blocks;
}

/**
 * Edit a file in place. Collects every (absolute-position, oldLiteral,
 * newLiteral) edit first, then applies them right-to-left so positions stay
 * stable.
 */
function processFile(filePath, scope) {
  const original = fs.readFileSync(filePath, "utf8");
  const blocks = collectSlugBlocks(original, scope);
  const edits = [];
  for (const { slug, start, end } of blocks) {
    const block = original.slice(start, end);
    for (const field of FIELDS) {
      const re = new RegExp(`(${field}:\\s*")((?:[^"\\\\]|\\\\.)*)(")`);
      const fm = block.match(re);
      if (!fm) continue;
      let value;
      try {
        value = JSON.parse(`"${fm[2]}"`);
      } catch {
        continue;
      }
      if (leadsWithDigit(value)) continue;
      const next = rewrite(value, slug, scope, field);
      if (!next) continue;
      const literalStart = start + fm.index;
      const literalEnd = literalStart + fm[0].length;
      const newLiteral = `${fm[1]}${jsQuote(next)}${fm[3]}`;
      edits.push({ start: literalStart, end: literalEnd, replacement: newLiteral });
    }
  }
  edits.sort((a, b) => b.start - a.start);
  let updated = original;
  for (const { start, end, replacement } of edits) {
    updated = updated.slice(0, start) + replacement + updated.slice(end);
  }
  if (updated !== original) fs.writeFileSync(filePath, updated);
  return edits.length;
}

let totalEdits = 0;
totalEdits += processFile(POSTS_FILE, "es");
for (const lang of I18N_LANGS) {
  totalEdits += processFile(path.join(I18N_DIR, `${lang}.ts`), lang);
}
console.log(`Edits applied: ${totalEdits}`);
