#!/usr/bin/env node
/*
 * blog-mid-cta-rewrite (Task #11)
 * ----------------------------------------------------------------------------
 * Rewrites the inner content of every `<!-- exentax:calc-cta-v1 -->` block
 * in every blog article (112 slugs × 6 locales = 672 files) so it matches
 * the single canonical mid-article CTA derived from
 * `client/src/data/blog-mid-cta-copy.ts` for the article's slug + locale.
 *
 * The canonical inner block is a single-line markdown blockquote with a
 * single anchor:
 *
 *     > <a href="{href}">{label}</a>
 *
 * where `{label}` is one of the 5 approved phrasings (locale-adapted) and
 * `{href}` is the locale-resolved URL of the variant's destination route.
 *
 * The rewrite is idempotent: running it twice in a row is a no-op (the
 * second run prints "0 files changed").
 *
 * Usage:
 *   node scripts/blog-mid-cta-rewrite.mjs           # rewrite in place
 *   node scripts/blog-mid-cta-rewrite.mjs --dry-run # preview only, never write
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LANGS, buildMidCtaInner } from "./blog-mid-cta-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..");
const BLOG_ROOT = path.join(REPO, "client/src/data/blog-content");

const DRY = process.argv.includes("--dry-run");

const OPEN = "<!-- exentax:calc-cta-v1 -->";
const CLOSE = "<!-- /exentax:calc-cta-v1 -->";

function listFilesForLang(lang) {
  const dir = path.join(BLOG_ROOT, lang);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => ({ slug: f.replace(/\.ts$/, ""), file: path.join(dir, f) }));
}

function rewriteFile(file, slug, lang) {
  const src = fs.readFileSync(file, "utf8");
  const startIdx = src.indexOf(OPEN);
  if (startIdx < 0) return { status: "missing-open" };
  const endIdx = src.indexOf(CLOSE, startIdx + OPEN.length);
  if (endIdx < 0) return { status: "missing-close" };
  // Detect duplicate calc-cta blocks; refuse to rewrite if more than one.
  const next = src.indexOf(OPEN, endIdx + CLOSE.length);
  if (next >= 0) return { status: "duplicate-open" };

  const innerStart = startIdx + OPEN.length;
  const innerEnd = endIdx;
  const newInner = `\n${buildMidCtaInner(slug, lang)}\n`;
  const before = src.slice(0, innerStart);
  const after = src.slice(innerEnd);
  const next2 = before + newInner + after;
  if (next2 === src) return { status: "unchanged" };
  if (!DRY) fs.writeFileSync(file, next2);
  return { status: "rewritten" };
}

function main() {
  const stats = {
    rewritten: 0,
    unchanged: 0,
    "missing-open": 0,
    "missing-close": 0,
    "duplicate-open": 0,
  };
  const failures = [];
  for (const lang of LANGS) {
    for (const { slug, file } of listFilesForLang(lang)) {
      const r = rewriteFile(file, slug, lang);
      stats[r.status] = (stats[r.status] ?? 0) + 1;
      if (r.status === "missing-open" || r.status === "missing-close" || r.status === "duplicate-open") {
        failures.push(`${lang}/${slug}: ${r.status}`);
      }
    }
  }
  console.log(`blog-mid-cta-rewrite${DRY ? " (dry-run)" : ""}:`);
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(16)} ${v}`);
  if (failures.length) {
    console.error(`\n[blog-mid-cta-rewrite] ${failures.length} structural failure(s):`);
    for (const f of failures.slice(0, 20)) console.error(`  - ${f}`);
    if (failures.length > 20) console.error(`  ... and ${failures.length - 20} more`);
    process.exit(1);
  }
}

main();
