#!/usr/bin/env node
/*
 * blog-fix-broken-links.mjs (Task #7)
 * ---------------------------------------------------------------------------
 * One-shot batch fixer for the editorial issues detected by
 * `scripts/check-blog-links.ts`. Idempotent — running it twice produces no
 * additional changes.
 *
 * What it changes
 * ---------------
 *  1. Calculator references → home-page anchor.
 *     /{lang}/{calc-slug}   →   /{lang}#calculadora
 *     (the calculator is embedded as a section on the localized home page;
 *      a dedicated /<lang>/calculadora route never existed)
 *
 *  2. Contact route references → delinked (the inline "página de contacto"
 *     wording is replaced by plain text; every article already carries a
 *     marker-wrapped final CTA, so the inline duplicate was redundant).
 *     [text](/{lang}/contact*) → text
 *     <a href="/{lang}/contact*">text</a> → text
 *
 *  3. Wrong-slug booking links → canonical booking slug per language.
 *     /en/agendar   → /en/book
 *     /fr/agendar   → /fr/reserver
 *     /de/agendar   → /de/buchen
 *
 *  4. Hardcoded booking-CTA links living OUTSIDE the sanctioned marker
 *     blocks (`exentax:cta-v1`, `exentax:calc-cta-v1`) are delinked. The
 *     marker-wrapped final CTA already provides the sole booking link.
 *
 * Files touched: client/src/data/blog-content/{lang}/*.ts
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = join(ROOT, "client", "src", "data", "blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const CALC_SLUG = { es: "calculadora", en: "calculator", fr: "calculatrice",
                    de: "rechner",     pt: "calculadora", ca: "calculadora" };
const BOOK_SLUG = { es: "agendar", en: "book", fr: "reserver",
                    de: "buchen",  pt: "agendar", ca: "agendar" };

const MARKER_PAIRS = [
  ["<!-- exentax:cta-v1 -->",      "<!-- /exentax:cta-v1 -->"],
  ["<!-- exentax:calc-cta-v1 -->", "<!-- /exentax:calc-cta-v1 -->"],
];

function ctaRanges(text) {
  const out = [];
  for (const [open, close] of MARKER_PAIRS) {
    let i = 0;
    while (true) {
      const o = text.indexOf(open, i);
      if (o === -1) break;
      const c = text.indexOf(close, o);
      if (c === -1) break;
      out.push([o, c + close.length]);
      i = c + close.length;
    }
  }
  return out;
}
const inRange = (idx, ranges) => ranges.some(([a, b]) => idx >= a && idx < b);

// Replace [text](url) → text  and  <a href="url"...>text</a> → text
// Returns the new text. Does NOT touch occurrences inside the protected ranges.
function delinkAll(text, urlPattern, ranges) {
  // Markdown link
  let next = "";
  let last = 0;
  const md = new RegExp(`\\[([^\\]\\n]+)\\]\\(${urlPattern}(?:[^)]*)?\\)`, "g");
  let m;
  while ((m = md.exec(text)) !== null) {
    if (inRange(m.index, ranges)) continue;
    next += text.slice(last, m.index) + m[1];
    last = m.index + m[0].length;
  }
  next += text.slice(last);
  text = next;

  // <a href="url" ...>text</a>
  const ranges2 = ctaRanges(text); // ranges may have shifted but markers are stable strings
  next = "";
  last = 0;
  const html = new RegExp(`<a\\s+[^>]*href\\s*=\\s*["']${urlPattern}(?:[^"']*)?["'][^>]*>([^<]+)<\\/a>`, "gi");
  while ((m = html.exec(text)) !== null) {
    if (inRange(m.index, ranges2)) continue;
    next += text.slice(last, m.index) + m[1];
    last = m.index + m[0].length;
  }
  next += text.slice(last);
  return next;
}

function rewriteLinkUrl(text, fromUrl, toUrl, ranges) {
  // Markdown
  let next = "";
  let last = 0;
  const md = new RegExp(`(\\]\\()${escapeRe(fromUrl)}((?:[^)]*)?\\))`, "g");
  let m;
  while ((m = md.exec(text)) !== null) {
    next += text.slice(last, m.index) + m[1] + toUrl + m[2];
    last = m.index + m[0].length;
  }
  next += text.slice(last);
  text = next;
  // HTML
  next = "";
  last = 0;
  const html = new RegExp(`(href\\s*=\\s*["'])${escapeRe(fromUrl)}((?:[^"']*)?["'])`, "gi");
  while ((m = html.exec(text)) !== null) {
    next += text.slice(last, m.index) + m[1] + toUrl + m[2];
    last = m.index + m[0].length;
  }
  next += text.slice(last);
  return next;
}
function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

let totalChanged = 0;
const summary = { calc: 0, contact: 0, slugFix: 0, hardcodedCta: 0, files: 0 };

for (const lang of LANGS) {
  const dir = join(CONTENT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const path = join(dir, f);
    const before = readFileSync(path, "utf8");
    let text = before;

    // (1) Calculator → home anchor (cover the per-language slug AND the
    //     universal English "calculator" form that appears in non-ES files).
    const calcCandidates = [`/${lang}/${CALC_SLUG[lang]}`, `/${lang}/calculator`];
    for (const calcUrl of [...new Set(calcCandidates)]) {
      const c = (text.match(new RegExp(escapeRe(calcUrl), "g")) || []).length;
      if (c > 0) {
        text = rewriteLinkUrl(text, calcUrl, `/${lang}#calculadora`, ctaRanges(text));
        summary.calc += c;
      }
    }

    // (2) Contact → delink (cover /contact, /contacto, /kontakt variants)
    const contactPaths = [`/${lang}/contacto`, `/${lang}/contact`, `/${lang}/kontakt`];
    for (const cp of contactPaths) {
      const matches = (text.match(new RegExp(escapeRe(cp), "g")) || []).length;
      if (matches > 0) {
        text = delinkAll(text, escapeRe(cp), ctaRanges(text));
        summary.contact += matches;
      }
    }

    // (3) Wrong-slug booking links: only EN/FR/DE differ from "agendar"
    if (lang === "en") {
      const wrong = `/en/agendar`;
      const wn = (text.match(new RegExp(escapeRe(wrong), "g")) || []).length;
      if (wn > 0) {
        text = rewriteLinkUrl(text, wrong, `/en/${BOOK_SLUG.en}`, ctaRanges(text));
        summary.slugFix += wn;
      }
    } else if (lang === "fr") {
      const wn = (text.match(/\/fr\/agendar/g) || []).length;
      if (wn > 0) {
        text = rewriteLinkUrl(text, `/fr/agendar`, `/fr/${BOOK_SLUG.fr}`, ctaRanges(text));
        summary.slugFix += wn;
      }
    } else if (lang === "de") {
      const wn = (text.match(/\/de\/agendar/g) || []).length;
      if (wn > 0) {
        text = rewriteLinkUrl(text, `/de/agendar`, `/de/${BOOK_SLUG.de}`, ctaRanges(text));
        summary.slugFix += wn;
      }
    }

    // (4) Delink hardcoded booking CTAs OUTSIDE marker blocks
    const bookUrl = `/${lang}/${BOOK_SLUG[lang]}`;
    // Count in protected zones first (those stay)
    const ranges = ctaRanges(text);
    const occurrences = [];
    let re = new RegExp(escapeRe(bookUrl), "g");
    let mm;
    while ((mm = re.exec(text)) !== null) occurrences.push(mm.index);
    const outside = occurrences.filter((i) => !inRange(i, ranges)).length;
    if (outside > 0) {
      text = delinkAll(text, escapeRe(bookUrl), ranges);
      summary.hardcodedCta += outside;
    }

    if (text !== before) {
      writeFileSync(path, text);
      totalChanged++;
    }
  }
}

summary.files = totalChanged;
console.log("blog-fix-broken-links summary:");
console.log(`  files modified:        ${summary.files}`);
console.log(`  calculator links:      ${summary.calc} rewritten → /<lang>#calculadora`);
console.log(`  contact links:         ${summary.contact} delinked`);
console.log(`  wrong booking slugs:   ${summary.slugFix} rewritten`);
console.log(`  hardcoded CTA links:   ${summary.hardcodedCta} delinked (outside marker blocks)`);
