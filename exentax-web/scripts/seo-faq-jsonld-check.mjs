#!/usr/bin/env node
/*
 * seo-faq-jsonld-check.mjs
 * ----------------------------------------------------------------------------
 * Verifies that the FAQ page in every supported language ships a complete
 * FAQPage JSON-LD whose Q/A entries match the source-of-truth count and
 * language. Because the FAQ JSON-LD is built client-side from the React
 * tree (see client/src/pages/faq-page.tsx), the verification is performed
 * against the source data:
 *
 *   1. Read the FAQ section structure in
 *      client/src/components/sections/faq-data.tsx and derive the expected
 *      Q/A count per section (about/fit/llc/process/banking/compliance/
 *      advanced/tax).
 *   2. For every supported locale, open client/src/i18n/locales/<lang>.ts
 *      and confirm that faqData.sections.<key> exists and that every
 *      faqData.questions.<key>_<i> and faqData.answers.<key>_<i> entry is
 *      present, non-empty and not a placeholder/TODO.
 *   3. Confirm that faq-page.tsx still produces a single FAQPage JSON-LD
 *      whose mainEntity is built from useFaqSections() (i.e. covers every
 *      Q/A on the rendered page in the page's own language).
 *
 * Exits 0 when every check passes, 1 otherwise.
 * ----------------------------------------------------------------------------
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const errors = [];
const checks = [];
function ok(m) { checks.push(`✔ ${m}`); }
function fail(m) { errors.push(`✘ ${m}`); }

function read(rel) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) { fail(`missing file: ${rel}`); return ""; }
  return readFileSync(p, "utf8");
}

function deriveExpectedShape() {
  const src = read("client/src/components/sections/faq-data.tsx");
  const sectionRe = /title:\s*t\("faqData\.sections\.([a-z_]+)"\)[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
  const out = {};
  let m;
  while ((m = sectionRe.exec(src))) {
    const key = m[1];
    const block = m[2];
    const ids = [...block.matchAll(/faqData\.questions\.([a-z_]+_\d+)/g)].map((x) => x[1]);
    out[key] = ids;
  }
  return out;
}

const shape = deriveExpectedShape();
const sectionKeys = Object.keys(shape);
if (sectionKeys.length === 0) {
  fail("Could not derive FAQ section shape from faq-data.tsx");
} else {
  const totals = sectionKeys.map((k) => `${k}=${shape[k].length}`).join(", ");
  const total = sectionKeys.reduce((a, k) => a + shape[k].length, 0);
  ok(`FAQ shape derived (${sectionKeys.length} sections, ${total} Q/As) — ${totals}`);
}

function localeContainsKey(src, key, value) {
  // Match `key: "..."` or `key: \`...\`` allowing escaped quotes / multiline.
  const re = new RegExp(`\\b${key}\\b\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)`);
  const m = src.match(re);
  if (!m) return false;
  const v = m[1].slice(1, -1);
  if (!v.trim()) return false;
  if (/^TODO\b|placeholder|TBD/i.test(v)) return false;
  if (value) value.value = v;
  return true;
}

function extractBlock(src, key) {
  // Find `key: {` and return the body up to the matching closing brace.
  const start = src.search(new RegExp(`\\b${key}\\s*:\\s*\\{`));
  if (start < 0) return null;
  const open = src.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

// Substantive content thresholds (raw chars, after stripping HTML tags).
const MIN_Q_LEN = 10;
const MIN_A_LEN = 30;

function stripHtml(v) { return v.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); }
function isPlaceholderText(v) { return /^TODO\b|placeholder|TBD|lorem ipsum/i.test(v); }
function extractValue(block, id) {
  if (!block) return null;
  const re = new RegExp(`\\b${id}\\b\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|\`(?:[^\`\\\\]|\\\\.)*\`)`);
  const m = block.match(re);
  if (!m) return null;
  return m[1].slice(1, -1);
}

const faqByLang = {};
for (const lang of LANGS) {
  const src = read(`client/src/i18n/locales/${lang}.ts`);
  if (!src) continue;
  let langErrors = 0;

  const faqBlock = extractBlock(src, "faqData");
  if (!faqBlock) { fail(`[${lang}] faqData block missing`); continue; }
  const sectionsBlock = extractBlock(faqBlock, "sections");
  const questionsBlock = extractBlock(faqBlock, "questions");
  const answersBlock = extractBlock(faqBlock, "answers");

  faqByLang[lang] = { questions: {}, answers: {} };

  for (const sectionKey of sectionKeys) {
    const sectionTitle = extractValue(sectionsBlock, sectionKey);
    if (!sectionTitle) { fail(`[${lang}] faqData.sections.${sectionKey} missing`); langErrors++; }
    else if (!stripHtml(sectionTitle) || isPlaceholderText(sectionTitle)) {
      fail(`[${lang}] faqData.sections.${sectionKey} placeholder/empty`); langErrors++;
    }
    for (const id of shape[sectionKey]) {
      const q = extractValue(questionsBlock, id);
      const a = extractValue(answersBlock, id);
      if (q == null) { fail(`[${lang}] faqData.questions.${id} missing`); langErrors++; }
      else {
        const qt = stripHtml(q);
        if (!qt || isPlaceholderText(qt)) { fail(`[${lang}] faqData.questions.${id} placeholder/empty`); langErrors++; }
        else if (qt.length < MIN_Q_LEN) { fail(`[${lang}] faqData.questions.${id} too short (${qt.length} < ${MIN_Q_LEN})`); langErrors++; }
        faqByLang[lang].questions[id] = qt;
      }
      if (a == null) { fail(`[${lang}] faqData.answers.${id} missing`); langErrors++; }
      else {
        const at = stripHtml(a);
        if (!at || isPlaceholderText(at)) { fail(`[${lang}] faqData.answers.${id} placeholder/empty`); langErrors++; }
        else if (at.length < MIN_A_LEN) { fail(`[${lang}] faqData.answers.${id} too short (${at.length} < ${MIN_A_LEN})`); langErrors++; }
        faqByLang[lang].answers[id] = at;
      }
    }
  }
  if (langErrors === 0) ok(`[${lang}] every section + Q/A key present, non-placeholder, ≥${MIN_Q_LEN}/${MIN_A_LEN} chars`);
}

// Translation parity: every non-es Q/A must be translated (not byte-identical
// to the es baseline). This is what guarantees the rendered FAQPage JSON-LD
// per locale actually carries the localized text emitted on that page.
const baseline = faqByLang.es;
if (baseline) {
  for (const lang of LANGS) {
    if (lang === "es") continue;
    const f = faqByLang[lang]; if (!f) continue;
    let dups = 0;
    for (const sectionKey of sectionKeys) {
      for (const id of shape[sectionKey]) {
        const q = f.questions[id]; const qEs = baseline.questions[id];
        const a = f.answers[id];   const aEs = baseline.answers[id];
        if (q && qEs && q === qEs) { fail(`[${lang}] faqData.questions.${id} identical to es (untranslated)`); dups++; }
        if (a && aEs && a === aEs) { fail(`[${lang}] faqData.answers.${id} identical to es (untranslated)`); dups++; }
      }
    }
    if (dups === 0) ok(`[${lang}] every Q/A is translated (no byte-identical match against es)`);
  }
}

// Confirm faq-page.tsx still emits the FAQPage JSON-LD per page from the live
// section tree (so the language matches the visible content).
const pageSrc = read("client/src/pages/faq-page.tsx");
if (pageSrc) {
  const need = [
    [/"@type":\s*"FAQPage"/, "@type FAQPage"],
    [/useFaqSections\(\)/, "uses useFaqSections() (rendered Q/As)"],
    [/extractText\(item\.a\)/, "extractText(item.a) → answer text"],
    [/mainEntity/, "mainEntity array"],
  ];
  for (const [re, label] of need) {
    if (!re.test(pageSrc)) fail(`faq-page.tsx FAQPage JSON-LD missing: ${label}`);
  }
  if (errors.filter((e) => e.includes("faq-page.tsx")).length === 0) {
    ok(`faq-page.tsx emits FAQPage JSON-LD wired to the rendered Q/A tree`);
  }
}

console.log("\nSEO FAQ JSON-LD invariants\n--------------------------");
for (const c of checks) console.log(c);
if (errors.length) {
  console.log("\nFailures:");
  for (const e of errors) console.log(e);
  console.log(`\n${errors.length} failure(s).`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed.`);
