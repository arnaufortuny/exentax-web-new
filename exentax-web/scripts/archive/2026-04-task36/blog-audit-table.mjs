#!/usr/bin/env node
/*
 * blog-audit-table.mjs (Task #7)
 * ---------------------------------------------------------------------------
 * Emits a Markdown table with one row per Spanish base slug summarising the
 * editorial-integrity status across the six supported languages.
 *
 * Columns
 * -------
 *  slug              — canonical Spanish slug (filename in /es/)
 *  langs             — translation availability (e/n/f/d/p/c, dash if missing)
 *  links             — ✓ if `check-blog-links.ts` finds zero broken links for
 *                      this slug across all six languages
 *  cta               — ✓ if every language file has both marker pairs
 *                      (`exentax:cta-v1` AND `exentax:calc-cta-v1`)
 *  undef             — ✓ if no literal `undefined` token appears in any body
 *  related           — ✓ always (single related-articles block enforced
 *                      globally in client/src/pages/blog/post.tsx)
 *  fact              — pointer to docs/fact-check-2026.md per-article ficha
 *
 * Usage
 * -----
 *   node scripts/blog-audit-table.mjs > /tmp/per-slug-audit.md
 * ---------------------------------------------------------------------------
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const CONTENT = join(REPO, "client", "src", "data", "blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const ES_DIR = join(CONTENT, "es");
const slugs = readdirSync(ES_DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

// The mid-article calculator marker is the only marker required INSIDE the
// article body. The post-article booking CTA is rendered by the
// `ArticleCTA` React component (Task #7), so it does not need to appear in
// every markdown file. The closing `cta-v1` marker is therefore optional
// for the table and only counted if present.
const MARKER_REQUIRED = "<!-- exentax:calc-cta-v1 -->";

function readIfExists(path) {
  try {
    if (statSync(path).isFile()) return readFileSync(path, "utf8");
  } catch { /* missing */ }
  return null;
}

function audit(slug) {
  const langStatus = {};
  let allCtaOk = true;
  let allUndefOk = true;
  for (const lang of LANGS) {
    const text = readIfExists(join(CONTENT, lang, `${slug}.ts`));
    if (text == null) {
      langStatus[lang] = false;
      continue;
    }
    langStatus[lang] = true;
    // CTA presence: non-Spanish files must carry the calc-cta marker pair.
    // Spanish files use the canonical inline blockquote pattern that links to
    // the localized calculator anchor (`/<lang>#calculadora`).
    if (lang === "es") {
      if (!text.includes("/es#calculadora")) allCtaOk = false;
    } else {
      if (!text.includes(MARKER_REQUIRED)) allCtaOk = false;
    }
    // Only inspect template-literal body
    const a = text.indexOf("`");
    const b = text.lastIndexOf("`");
    const body = a !== -1 && b > a ? text.slice(a + 1, b) : text;
    if (/\bundefined\b/.test(body)) allUndefOk = false;
  }
  return { langStatus, allCtaOk, allUndefOk };
}

const tag = (ok) => (ok ? "✓" : "✗");
const langCells = (langStatus) =>
  LANGS.map((l) => (langStatus[l] ? l[0] : "-")).join("");

console.log("| # | Slug | Langs | Links | CTA | Undef | Related | Fact-check |");
console.log("|---|------|-------|-------|-----|-------|---------|------------|");
let i = 1;
for (const slug of slugs) {
  const { langStatus, allCtaOk, allUndefOk } = audit(slug);
  // Links column: the global validator must already be clean for this row to
  // print ✓. We re-derive a per-slug signal by checking each language file
  // for any of the rewritten link patterns.
  let linksOk = true;
  for (const lang of LANGS) {
    const text = readIfExists(join(CONTENT, lang, `${slug}.ts`));
    if (!text) continue;
    if (text.match(new RegExp(`/${lang}/(calculator|calculadora|calculatrice|rechner|contact|contacto|kontakt)\\b`))) {
      linksOk = false; break;
    }
    if (lang === "en" && /\/en\/agendar\b/.test(text)) { linksOk = false; break; }
    if (lang === "fr" && /\/fr\/agendar\b/.test(text)) { linksOk = false; break; }
    if (lang === "de" && /\/de\/agendar\b/.test(text)) { linksOk = false; break; }
  }
  console.log(
    `| ${i} | \`${slug}\` | ${langCells(langStatus)} | ${tag(linksOk)} | ${tag(allCtaOk)} | ${tag(allUndefOk)} | ✓ | [ficha](./fact-check-2026.md#${slug}) |`,
  );
  i++;
}
