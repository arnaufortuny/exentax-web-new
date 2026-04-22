#!/usr/bin/env node
/*
 * seo-blog-i18n-meta-lengths.test.mjs
 * ----------------------------------------------------------------------------
 * Guard test for Task #7 (Verificar URLs alternates por idioma).
 *
 * Asserts that every non-ES blog metadata catalog keeps:
 *   - metaTitle.length       <= 60   (SERP title cut-off)
 *   - metaDescription.length <= 160  (SERP snippet cut-off)
 *
 * Reads the canonical blog-i18n source files directly and parses each entry
 * with a regex (no module imports — runs without TS compile). Exits 0 on
 * success, 1 on any over-length finding.
 * ----------------------------------------------------------------------------
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const TITLE_MAX = 60;
const DESC_MAX = 160;
const LANGS = ["en", "fr", "de", "pt", "ca"];

const ENTRY_RE = /"([^"]+)":\s*\{([^{}]*?)\}/g;
const META_TITLE_RE = /metaTitle:\s*"((?:[^"\\]|\\.)*)"/;
const META_DESC_RE = /metaDescription:\s*"((?:[^"\\]|\\.)*)"/;

const errors = [];
let totalEntries = 0;

for (const lang of LANGS) {
  const file = resolve(ROOT, `client/src/data/blog-i18n/${lang}.ts`);
  const src = readFileSync(file, "utf8");
  let m;
  let entries = 0;
  while ((m = ENTRY_RE.exec(src))) {
    entries++;
    totalEntries++;
    const slug = m[1];
    const body = m[2];
    const tm = body.match(META_TITLE_RE);
    const dm = body.match(META_DESC_RE);
    if (tm && tm[1].length > TITLE_MAX) {
      errors.push(`${lang}/${slug}: metaTitle ${tm[1].length} > ${TITLE_MAX}`);
    }
    if (dm && dm[1].length > DESC_MAX) {
      errors.push(`${lang}/${slug}: metaDescription ${dm[1].length} > ${DESC_MAX}`);
    }
  }
  console.log(`  ✓ ${lang}.ts — ${entries} entries scanned`);
}

if (errors.length) {
  console.error(`\nFAIL — ${errors.length} over-length finding(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(`\nOK — blog-i18n meta lengths within limits (${totalEntries} entries across ${LANGS.length} langs).`);
process.exit(0);
