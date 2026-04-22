#!/usr/bin/env node
/*
 * blog-emdash-cleanup.mjs
 * ----------------------------------------------------------------------------
 * Removes the U+2014 em-dash (—) from translated blog content files
 * (en/fr/de/pt/ca) following the same editorial convention adopted in the
 * Spanish master during Task #1: prefer comma-separated parentheticals over
 * em-dash interjections.
 *
 * Replacement rules, applied in order:
 *   1.  " — "   → ", "      (most common: word — word)
 *   2.  " —\n"  → ",\n"     (end-of-line dash)
 *   3.  "\n— "  → "\n"      (line-leading dash, e.g. lists; drop it)
 *   4.  " —"    → ","       (trailing dash before punctuation)
 *   5.  "— "    → ", "      (leading dash mid-string)
 *   6.  "—"     → ", "      (bare residual)
 *
 * After replacement, normalises double commas (", ,") and stray ",." back to
 * sane forms.
 *
 * Skips:
 *   - blog-content/es/  (master copy, already clean)
 *   - any file already free of em-dashes
 *
 * Idempotent: a second run is a no-op.
 *
 * Usage:
 *   node scripts/blog-emdash-cleanup.mjs            # writes
 *   node scripts/blog-emdash-cleanup.mjs --check    # report only, exit 1 on diff
 * ----------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const LANGS = ["en", "fr", "de", "pt", "ca"];
const CHECK = process.argv.includes("--check");

function clean(src) {
  let out = src
    .replace(/ — /g, ", ")
    .replace(/ —\n/g, ",\n")
    .replace(/\n— /g, "\n")
    .replace(/ —([.,;:!?\)])/g, "$1")
    .replace(/([\(])— /g, "$1")
    .replace(/— /g, ", ")
    .replace(/—/g, ", ");
  out = out
    .replace(/, ,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/\(\s*,\s*/g, "(")
    .replace(/\s*,\s*\)/g, ")");
  return out;
}

let totalChanged = 0;
const offenders = [];

for (const lang of LANGS) {
  const dir = resolve(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  let changedHere = 0;
  for (const f of files) {
    const path = resolve(dir, f);
    const src = readFileSync(path, "utf8");
    if (!src.includes("\u2014")) continue;
    const next = clean(src);
    if (next === src) continue;
    if (CHECK) {
      offenders.push(`${lang}/${f}`);
    } else {
      writeFileSync(path, next, "utf8");
    }
    changedHere++;
  }
  totalChanged += changedHere;
  console.log(`[${lang}] ${changedHere}/${files.length} files ${CHECK ? "would change" : "rewritten"}`);
}

if (CHECK && offenders.length) {
  console.error(`\nem-dash present in ${offenders.length} file(s):`);
  for (const o of offenders.slice(0, 10)) console.error(`  - ${o}`);
  if (offenders.length > 10) console.error(`  …and ${offenders.length - 10} more`);
  process.exit(1);
}

console.log(`\nTotal: ${totalChanged} file(s) ${CHECK ? "would change" : "updated"}.`);
