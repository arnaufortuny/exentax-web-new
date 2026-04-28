#!/usr/bin/env node
/*
 * blog-mid-cta-check (Task #11)
 * ----------------------------------------------------------------------------
 * CI guard that verifies, for every blog article in every supported locale,
 * that the `<!-- exentax:calc-cta-v1 -->` mid-article CTA block carries
 * **exactly one** approved phrasing drawn from `blog-mid-cta-copy.ts`,
 * matching the variant assigned to the article's slug.
 *
 * For each `client/src/data/blog-content/<lang>/<slug>.ts` the check verifies:
 *
 *   1. exactly one `<!-- exentax:calc-cta-v1 --> ... <!-- /exentax:calc-cta-v1 -->`
 *      block exists in the file (`missing-block`, `duplicate-block`);
 *   2. the inner content equals the canonical block built from
 *      `buildMidCtaInner(slug, lang)` (`off-pattern`);
 *   3. zero generic alternatives appear elsewhere in the body — i.e. no
 *      sentence outside the marker block contains any of the 5 approved
 *      labels for that locale (`approved-label-leak`).
 *
 * Exit codes:
 *   0  every article matches its canonical mid-CTA
 *   1  at least one violation
 *
 * Wired into `npm run lint:blog`.
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LANGS,
  buildMidCtaInner,
  loadAll,
} from "./blog-mid-cta-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "..", "..");
const BLOG_ROOT = path.join(REPO, "client/src/data/blog-content");

const OPEN = "<!-- exentax:calc-cta-v1 -->";
const CLOSE = "<!-- /exentax:calc-cta-v1 -->";

function listFilesForLang(lang) {
  const dir = path.join(BLOG_ROOT, lang);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => ({ slug: f.replace(/\.ts$/, ""), file: path.join(dir, f) }));
}

function extractBlocks(src) {
  const blocks = [];
  let cursor = 0;
  while (true) {
    const startIdx = src.indexOf(OPEN, cursor);
    if (startIdx < 0) break;
    const endIdx = src.indexOf(CLOSE, startIdx + OPEN.length);
    if (endIdx < 0) {
      blocks.push({ startIdx, endIdx: -1, inner: null });
      break;
    }
    blocks.push({
      startIdx,
      endIdx,
      inner: src.slice(startIdx + OPEN.length, endIdx),
    });
    cursor = endIdx + CLOSE.length;
  }
  return blocks;
}

function buildApprovedLabelsByLang() {
  const { variants } = loadAll();
  const out = {};
  for (const lang of LANGS) {
    out[lang] = Object.keys(variants).map((v) => variants[v][lang].label);
  }
  return out;
}

function main() {
  const findings = [];
  const APPROVED = buildApprovedLabelsByLang();

  // Counters for the summary table.
  const perLang = {};
  for (const lang of LANGS) perLang[lang] = { files: 0, ok: 0, fail: 0 };

  for (const lang of LANGS) {
    for (const { slug, file } of listFilesForLang(lang)) {
      perLang[lang].files += 1;
      const src = fs.readFileSync(file, "utf8");
      const blocks = extractBlocks(src);

      if (blocks.length === 0) {
        findings.push({ lang, slug, kind: "missing-block", detail: "no calc-cta-v1 block" });
        perLang[lang].fail += 1;
        continue;
      }
      if (blocks.length > 1) {
        findings.push({
          lang, slug, kind: "duplicate-block",
          detail: `${blocks.length} calc-cta-v1 blocks found (expected exactly 1)`,
        });
        perLang[lang].fail += 1;
        continue;
      }
      const block = blocks[0];
      if (block.inner === null) {
        findings.push({ lang, slug, kind: "missing-block", detail: "open marker without close" });
        perLang[lang].fail += 1;
        continue;
      }

      const expected = `\n${buildMidCtaInner(slug, lang)}\n`;
      if (block.inner !== expected) {
        findings.push({
          lang, slug, kind: "off-pattern",
          detail: `mid-CTA does not match canonical for variant; got ${JSON.stringify(block.inner.trim())}, expected ${JSON.stringify(expected.trim())}`,
        });
        perLang[lang].fail += 1;
        continue;
      }

      // Approved-label leak detection: scan the rest of the file (everything
      // outside the marker block) for any of the 5 approved labels for this
      // locale. Each label must appear ONLY inside the canonical block.
      const before = src.slice(0, block.startIdx);
      const after = src.slice(block.endIdx + CLOSE.length);
      const outside = `${before}\n${after}`;
      let leaked = false;
      for (const label of APPROVED[lang]) {
        if (outside.includes(label)) {
          findings.push({
            lang, slug, kind: "approved-label-leak",
            detail: `approved label ${JSON.stringify(label)} appears outside the calc-cta-v1 block`,
          });
          leaked = true;
          break;
        }
      }
      if (leaked) {
        perLang[lang].fail += 1;
        continue;
      }

      perLang[lang].ok += 1;
    }
  }

  // Summary
  const total = LANGS.reduce((n, l) => n + perLang[l].files, 0);
  const totalOk = LANGS.reduce((n, l) => n + perLang[l].ok, 0);
  const totalFail = LANGS.reduce((n, l) => n + perLang[l].fail, 0);

  if (findings.length > 0) {
    console.error(`[blog-mid-cta-check] FAIL — ${findings.length} violation(s) across ${totalFail} file(s)`);
    const grouped = {};
    for (const f of findings) {
      grouped[f.kind] = (grouped[f.kind] ?? 0) + 1;
    }
    console.error(`  by kind:`, grouped);
    for (const f of findings.slice(0, 30)) {
      console.error(`  ${f.lang}/${f.slug}  ${f.kind}: ${f.detail}`);
    }
    if (findings.length > 30) {
      console.error(`  ... and ${findings.length - 30} more`);
    }
    process.exit(1);
  }

  console.log(`[blog-mid-cta-check] OK — ${totalOk}/${total} blog articles carry the canonical mid-article CTA.`);
}

main();
