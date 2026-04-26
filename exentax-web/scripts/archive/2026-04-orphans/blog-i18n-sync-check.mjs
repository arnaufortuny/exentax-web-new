#!/usr/bin/env node
// Validates EN/CA/DE/FR/PT synchronization with ES baseline:
// - Every ES slug is present in blog-i18n/{lang}.ts MAP
// - Every ES slug has a content file in blog-content/{lang}/
// - Every ES slug appears in blog-posts-slugs.ts under each lang key
// - Every relatedSlugs reference in blog-posts.ts points to an existing ES slug
// - Per-language translated slugs are unique (no two ES slugs map to the same target)
// - Translated slugs are URL-safe (lowercase ASCII letters/digits/hyphens only)
// Exits non-zero if any gap is found. Read-only.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data");
const ES_DIR = resolve(ROOT, "blog-content/es");
const LANGS = ["en", "ca", "de", "fr", "pt"];

const esSlugs = readdirSync(ES_DIR)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => f.replace(/\.ts$/, ""));

const slugsFile = readFileSync(resolve(ROOT, "blog-posts-slugs.ts"), "utf8");
const postsFile = readFileSync(resolve(ROOT, "blog-posts.ts"), "utf8");

const esSlugSet = new Set(esSlugs);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Cross-check: every relatedSlugs entry in blog-posts.ts must reference a real ES slug.
const relatedRefs = [];
const blockRe = /relatedSlugs:\s*\[([\s\S]*?)\]/g;
for (const m of postsFile.matchAll(blockRe)) {
  for (const s of m[1].matchAll(/"([^"]+)"/g)) relatedRefs.push(s[1]);
}
const brokenRelated = [...new Set(relatedRefs.filter((s) => !esSlugSet.has(s)))];

const report = {
  totalEs: esSlugs.length,
  ok: true,
  relatedSlugRefs: relatedRefs.length,
  brokenRelatedSlugs: brokenRelated,
  langs: {},
};
if (brokenRelated.length) report.ok = false;

for (const lang of LANGS) {
  const i18n = readFileSync(resolve(ROOT, `blog-i18n/${lang}.ts`), "utf8");
  const contentDir = resolve(ROOT, `blog-content/${lang}`);
  const contentFiles = readdirSync(contentDir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""));

  const missingI18n = esSlugs.filter((s) => !i18n.includes(`"${s}":`));
  const missingContent = esSlugs.filter((s) => !contentFiles.includes(s));

  // Each lang key in blog-posts-slugs.ts must appear at least once per slug entry.
  const slugMatches = [...slugsFile.matchAll(new RegExp(`${lang}:\\s*"([^"]+)"`, "g"))];
  const translatedSlugs = slugMatches.map((m) => m[1]);

  // Per-language uniqueness: no two ES slugs should map to the same translated slug.
  const counts = new Map();
  for (const s of translatedSlugs) counts.set(s, (counts.get(s) || 0) + 1);
  const duplicates = [...counts.entries()].filter(([, n]) => n > 1).map(([s, n]) => ({ slug: s, count: n }));

  // URL-safety: lowercase ASCII letters/digits/hyphens, no leading/trailing/double hyphens.
  const invalidSlugs = translatedSlugs.filter((s) => !SLUG_RE.test(s));

  const langOk =
    missingI18n.length === 0 &&
    missingContent.length === 0 &&
    slugMatches.length === esSlugs.length &&
    duplicates.length === 0 &&
    invalidSlugs.length === 0;
  if (!langOk) report.ok = false;

  report.langs[lang] = {
    i18nCovered: esSlugs.length - missingI18n.length,
    i18nMissing: missingI18n,
    contentCovered: esSlugs.length - missingContent.length,
    contentMissing: missingContent,
    slugMappings: slugMatches.length,
    duplicateSlugs: duplicates,
    invalidSlugs,
    ok: langOk,
  };
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
