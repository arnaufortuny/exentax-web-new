#!/usr/bin/env node
/*
 * prune-legacy-slugs.mjs
 * ---------------------------------------------------------------------------
 * One-shot pruner for `BLOG_SLUG_LEGACY_I18N` in
 * `client/src/data/blog-posts-slugs.ts`.
 *
 * Background (see Task #17 + docs/audits/2026-04/legacy-slug-prune.md):
 *
 *   The legacy map collected ~330 historical localized slugs across audit
 *   pass 8 (slug-shortening). Every entry produces a 301 redirect to the
 *   current canonical localized slug, but the audit confirmed zero internal
 *   references to any of them — they exist solely to honor inbound external
 *   traffic (search engines, backlinks).
 *
 *   Most of those entries are cold (the legacy URL was canonical for too
 *   short a period to be indexed). Without GSC export available in this
 *   environment we apply a documented heuristic to keep the entries most
 *   likely to still receive non-trivial traffic and drop the rest. Dropped
 *   entries are recorded in `docs/audits/2026-04/legacy-slug-prune.md`
 *   and can be restored individually if a 404 spike is detected.
 *
 * Heuristic (the same logic that produced the on-disk map):
 *
 *   1. Group legacy entries by (esSlug, lang). When more than one alias
 *      exists for the same pair, keep only the longest one (closest to the
 *      original pre-shortening canonical, most likely to still be in
 *      Google's index).
 *
 *   2. Keep the resulting alias if any of the following holds:
 *        - lang === "en"  (highest international organic-search potential
 *          for a Spanish-fiscal site)
 *        - lang ∈ {fr, de} AND the article is one of the first
 *          FRDE_TOP=20 entries in BLOG_SLUG_I18N (cornerstone LLC content
 *          most likely to have built up backlinks in those languages)
 *        - lang ∈ {pt, ca} AND the article is one of the first
 *          PTCA_TOP=5 entries in BLOG_SLUG_I18N (foundational only)
 *
 *   3. Drop everything else.
 *
 * Idempotent: re-running on an already-pruned file is a no-op (the kept
 * entries already satisfy the heuristic; nothing else exists to drop).
 *
 * Re-run with:   node scripts/prune-legacy-slugs.mjs
 * Dry-run with:  node scripts/prune-legacy-slugs.mjs --dry-run
 * ---------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SLUG_FILE = path.join(ROOT, "client/src/data/blog-posts-slugs.ts");
const RECORD_FILE = path.resolve(ROOT, "../docs/audits/2026-04/legacy-slug-prune.md");

const DRY_RUN = process.argv.includes("--dry-run");

const FRDE_TOP = 20;
const PTCA_TOP = 5;

const src = fs.readFileSync(SLUG_FILE, "utf8");

const i18nMatch = src.match(/export const BLOG_SLUG_I18N[^=]*=\s*(\{[\s\S]*?\n\});/);
if (!i18nMatch) { console.error("BLOG_SLUG_I18N not found"); process.exit(1); }
const i18n = (new Function(`return (${i18nMatch[1]});`))();

const legacyMatch = src.match(/(export const BLOG_SLUG_LEGACY_I18N[^=]*=\s*)(\{[\s\S]*?\n\});/);
if (!legacyMatch) { console.error("BLOG_SLUG_LEGACY_I18N not found"); process.exit(1); }
const legacy = (new Function(`return (${legacyMatch[2]});`))();

const esOrder = Object.keys(i18n);
const esIndex = new Map(esOrder.map((s, i) => [s, i]));

function shouldKeep(es, lang) {
  if (lang === "en") return true;
  const idx = esIndex.get(es) ?? Number.POSITIVE_INFINITY;
  if ((lang === "fr" || lang === "de") && idx < FRDE_TOP) return true;
  if ((lang === "pt" || lang === "ca") && idx < PTCA_TOP) return true;
  return false;
}

// Step 1+2: dedupe + heuristic in a single pass that preserves the original
// declaration order of the kept entries.
const seenPair = new Map(); // key=`es|lang`, value=oldSlug already kept
const groups = {};          // key=`es|lang`, value=[oldSlug,…]
for (const [oldSlug, entry] of Object.entries(legacy)) {
  const key = `${entry.es}|${entry.lang}`;
  if (!groups[key]) groups[key] = [];
  groups[key].push(oldSlug);
}
// For each group pick the longest as the surviving alias.
const survivor = new Map(); // key -> oldSlug
for (const [key, slugs] of Object.entries(groups)) {
  survivor.set(key, slugs.slice().sort((a, b) => b.length - a.length)[0]);
}

const keep = [];   // [{ oldSlug, es, lang }] in original order
const drop = [];   // same shape
for (const [oldSlug, entry] of Object.entries(legacy)) {
  const key = `${entry.es}|${entry.lang}`;
  const surv = survivor.get(key);
  const isSurvivor = oldSlug === surv;
  const passesHeuristic = shouldKeep(entry.es, entry.lang);
  if (isSurvivor && passesHeuristic) {
    keep.push({ oldSlug, es: entry.es, lang: entry.lang });
  } else {
    drop.push({
      oldSlug,
      es: entry.es,
      lang: entry.lang,
      reason: !isSurvivor ? "duplicate-alias-for-pair" : "heuristic-cold-traffic",
    });
  }
}

console.log(`Original legacy entries: ${Object.keys(legacy).length}`);
console.log(`Kept:    ${keep.length}`);
console.log(`Dropped: ${drop.length}`);
const distK = {}, distD = {};
for (const e of keep) distK[e.lang] = (distK[e.lang] || 0) + 1;
for (const e of drop) distD[e.lang] = (distD[e.lang] || 0) + 1;
console.log("  keep by lang:", JSON.stringify(distK));
console.log("  drop by lang:", JSON.stringify(distD));

if (DRY_RUN) {
  console.log("\n--dry-run set, not writing files.");
  process.exit(0);
}

// --- Write the new BLOG_SLUG_LEGACY_I18N literal -------------------------
const lines = ["{"];
for (const { oldSlug, es, lang } of keep) {
  lines.push(`  ${JSON.stringify(oldSlug)}: { es: ${JSON.stringify(es)}, lang: ${JSON.stringify(lang)} },`);
}
// Trim trailing comma on last entry to match prior style.
if (lines.length > 1) lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, "");
lines.push("}");
const newLegacyLiteral = lines.join("\n");

const newSrc = src.replace(legacyMatch[0], `${legacyMatch[1]}${newLegacyLiteral};`);
fs.writeFileSync(SLUG_FILE, newSrc);
console.log(`Wrote ${path.relative(ROOT, SLUG_FILE)}`);

// --- Write the audit / restore record ------------------------------------
fs.mkdirSync(path.dirname(RECORD_FILE), { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const out = [];
out.push(`# Legacy blog-slug prune — ${today}`);
out.push("");
out.push("Generated by `exentax-web/scripts/prune-legacy-slugs.mjs` (Task #17).");
out.push("Re-run with `node exentax-web/scripts/prune-legacy-slugs.mjs`.");
out.push("");
out.push("## Why");
out.push("");
out.push("`BLOG_SLUG_LEGACY_I18N` accumulated ~330 historical localized slugs from");
out.push("audit pass 8 (slug shortening). Each entry exists solely to 301 inbound");
out.push("external traffic to the current canonical slug — the repo-wide audit done");
out.push("for Task #16 confirmed zero internal references to any of them.");
out.push("");
out.push("Most of those entries are cold: the legacy URL was canonical for too short");
out.push("a window to be indexed. We pruned the map to keep only the entries most");
out.push("likely to still receive non-trivial inbound traffic. Dropped entries are");
out.push("recorded below so any one of them can be restored individually if a 404");
out.push("spike is observed for a specific URL.");
out.push("");
out.push("## Heuristic");
out.push("");
out.push("1. **Dedupe per (esSlug, lang)** — keep the longest alias (closest to the");
out.push("   original pre-shortening canonical).");
out.push("2. **Keep** if `lang === \"en\"` (highest international organic-search");
out.push("   potential for a Spanish-fiscal site).");
out.push("3. **Keep** if `lang ∈ {fr, de}` AND the article is one of the first");
out.push(`   ${FRDE_TOP} entries in BLOG_SLUG_I18N (cornerstone LLC content).`);
out.push("4. **Keep** if `lang ∈ {pt, ca}` AND the article is one of the first");
out.push(`   ${PTCA_TOP} entries in BLOG_SLUG_I18N (foundational only).`);
out.push("5. Drop everything else.");
out.push("");
out.push("## Result");
out.push("");
out.push(`| Metric | Value |`);
out.push(`| --- | --- |`);
out.push(`| Original entries | ${Object.keys(legacy).length} |`);
out.push(`| Kept | ${keep.length} |`);
out.push(`| Dropped | ${drop.length} |`);
out.push(`| Kept by lang | ${Object.entries(distK).map(([k, v]) => `${k}=${v}`).join(", ")} |`);
out.push(`| Dropped by lang | ${Object.entries(distD).map(([k, v]) => `${k}=${v}`).join(", ")} |`);
out.push("");
out.push("## Restore procedure");
out.push("");
out.push("1. Find the row in the table below for the URL that 404'd.");
out.push("2. Add the entry back to `BLOG_SLUG_LEGACY_I18N` in");
out.push("   `client/src/data/blog-posts-slugs.ts` using the recorded `es` and");
out.push("   `lang` columns.");
out.push("3. Run `npm run check`.");
out.push("");
out.push("## Dropped entries");
out.push("");
out.push("| Old slug | ES base | Lang | Reason |");
out.push("| --- | --- | --- | --- |");
for (const d of drop) {
  out.push(`| \`${d.oldSlug}\` | \`${d.es}\` | ${d.lang} | ${d.reason} |`);
}
out.push("");
fs.writeFileSync(RECORD_FILE, out.join("\n"));
console.log(`Wrote ${path.relative(ROOT, RECORD_FILE)}`);
