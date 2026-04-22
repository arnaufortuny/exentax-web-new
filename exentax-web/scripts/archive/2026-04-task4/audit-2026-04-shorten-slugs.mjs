#!/usr/bin/env node
// Pass 8: Shorten translated slugs >60 chars to ≤60, preserving the old
// localized slug as a legacy alias so the existing 301 handler in
// `server/routes/public.ts` redirects old URLs to the new canonical ones.
//
// Strategy:
//   1. Walk BLOG_SLUG_I18N. For every (esSlug, lang) whose value is >60 chars,
//      shorten it at a word boundary (split on "-", keep prefix while joined
//      length ≤ 60, fall back to a hard 60-char cut if a single token blows
//      the budget). Ensure uniqueness within the same language.
//   2. Rewrite the BLOG_SLUG_I18N literal with the shortened values.
//   3. Append (or update) a `BLOG_SLUG_LEGACY_I18N` constant containing every
//      old localized slug → ES slug pair so `resolveToSpanishSlug` resolves
//      legacy URLs and the second handler in `public.ts` 301s them to the
//      canonical localized URL.
//   4. Regenerate `docs/audits/2026-04/slugs-audit.md`.
//
// Idempotent: re-running detects no >60 slugs and exits with no diff.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SLUG_FILE = path.join(ROOT, "client/src/data/blog-posts-slugs.ts");
const AUDIT_OUT = path.resolve(ROOT, "../docs/audits/2026-04/slugs-audit.md");

const src = fs.readFileSync(SLUG_FILE, "utf8");

// Extract object literal BLOG_SLUG_I18N
const i18nMatch = src.match(/export const BLOG_SLUG_I18N[^=]*=\s*(\{[\s\S]*?\n\});/);
if (!i18nMatch) { console.error("BLOG_SLUG_I18N not found"); process.exit(1); }
const i18nLiteral = i18nMatch[1];

// Build a JS object using eval-in-Function (literal is safe — it's our own file).
const i18n = (new Function(`return (${i18nLiteral});`))();

// Existing legacy map (if any).
let legacy = {};
const legacyMatch = src.match(/export const BLOG_SLUG_LEGACY_I18N[^=]*=\s*(\{[\s\S]*?\n\});/);
if (legacyMatch) legacy = (new Function(`return (${legacyMatch[1]});`))();

const LANGS = ["en", "fr", "de", "pt", "ca"];
const MAX = 60;

function shorten(slug, used) {
  if (slug.length <= MAX) return slug;
  const parts = slug.split("-");
  let acc = "";
  for (const p of parts) {
    const next = acc ? `${acc}-${p}` : p;
    if (next.length > MAX) break;
    acc = next;
  }
  if (!acc) acc = slug.slice(0, MAX).replace(/-+$/, "");
  // Ensure uniqueness — append "-2", "-3", … until free.
  let candidate = acc;
  let n = 2;
  while (used.has(candidate)) {
    const suffix = `-${n}`;
    candidate = acc.slice(0, MAX - suffix.length).replace(/-+$/, "") + suffix;
    n++;
  }
  return candidate;
}

// Track per-language used slugs (current canonical + legacy).
const usedByLang = {};
for (const lang of LANGS) {
  const set = new Set();
  for (const tr of Object.values(i18n)) {
    const v = tr?.[lang];
    if (v) set.add(v);
  }
  for (const [oldSlug, entry] of Object.entries(legacy)) {
    if (entry?.lang === lang) set.add(oldSlug);
  }
  usedByLang[lang] = set;
}

const renames = []; // {esSlug, lang, oldSlug, newSlug}

for (const [esSlug, tr] of Object.entries(i18n)) {
  for (const lang of LANGS) {
    const cur = tr?.[lang];
    if (!cur || cur.length <= MAX) continue;
    // Free the old slot before shortening — the new one is allowed to coincide
    // with the old prefix as long as it does not collide with *another* slug.
    usedByLang[lang].delete(cur);
    const next = shorten(cur, usedByLang[lang]);
    if (next === cur) { usedByLang[lang].add(cur); continue; }
    tr[lang] = next;
    usedByLang[lang].add(next);
    renames.push({ esSlug, lang, oldSlug: cur, newSlug: next });
    legacy[cur] = { es: esSlug, lang };
  }
}

if (renames.length === 0) {
  console.log("No slugs >60 chars to shorten — file is already canonical.");
} else {
  // Serialize i18n preserving stable key order.
  const i18nNew = "{\n" + Object.entries(i18n).map(([es, tr]) => {
    const inner = LANGS.filter(l => tr[l]).map(l => `${l}: ${JSON.stringify(tr[l])}`).join(", ");
    return `  ${JSON.stringify(es)}: { ${inner} }`;
  }).join(",\n") + "\n}";
  // Serialize legacy map.
  const legacyNew = "{\n" + Object.entries(legacy).map(([oldSlug, entry]) =>
    `  ${JSON.stringify(oldSlug)}: { es: ${JSON.stringify(entry.es)}, lang: ${JSON.stringify(entry.lang)} }`
  ).join(",\n") + "\n}";

  let out = src.replace(/export const BLOG_SLUG_I18N[^=]*=\s*\{[\s\S]*?\n\};/,
    `export const BLOG_SLUG_I18N: Record<string, Partial<Record<SupportedLang, string>>> = ${i18nNew};`);

  if (legacyMatch) {
    out = out.replace(/export const BLOG_SLUG_LEGACY_I18N[^=]*=\s*\{[\s\S]*?\n\};/,
      `export const BLOG_SLUG_LEGACY_I18N: Record<string, { es: string; lang: SupportedLang }> = ${legacyNew};`);
  } else {
    // Insert legacy const + augment buildReverseCache.
    const legacyDecl =
`\n/**\n * Legacy localized slugs (audit 2026-04 pass 8 — slug shortening). Each old\n * over-length localized slug maps back to its ES base + originating language\n * so resolveToSpanishSlug() can still find the article and the existing 301\n * handler in server/routes/public.ts redirects to the new canonical slug.\n * Idempotent — populated by scripts/audit-2026-04-shorten-slugs.mjs.\n */\nexport const BLOG_SLUG_LEGACY_I18N: Record<string, { es: string; lang: SupportedLang }> = ${legacyNew};\n`;
    out = out.replace(/(export function getTranslatedSlug)/, legacyDecl + "\n$1");
    // Augment buildReverseCache to merge legacy slugs.
    out = out.replace(/(reverseCache\[lang\] = map;\s*\n\s*return map;)/,
`  for (const [oldSlug, entry] of Object.entries(BLOG_SLUG_LEGACY_I18N)) {\n    if (entry.lang === lang) map[oldSlug] = entry.es;\n  }\n  $1`);
  }
  fs.writeFileSync(SLUG_FILE, out);
  console.log(`Shortened ${renames.length} slug(s); legacy map size = ${Object.keys(legacy).length}.`);
}

// Regenerate slugs-audit.md from the (possibly mutated) i18n.
const out = [];
out.push("# 08 — Slugs (longitud y traducciones)");
out.push("");
out.push("Reglas: slug ≤ 60 caracteres, kebab-case, sin acentos. Cualquier cambio se propaga en `client/src/data/blog-posts-slugs.ts` y los slugs antiguos se conservan en `BLOG_SLUG_LEGACY_I18N` para que `server/routes/public.ts` emita 301 desde la URL deprecada hacia la canónica.");
out.push("");
out.push("## Slugs > 60 caracteres");
out.push("");
const offenders = [];
for (const [es, tr] of Object.entries(i18n)) {
  for (const lang of LANGS) {
    const v = tr?.[lang];
    if (v && v.length > 60) offenders.push({ lang, slug: v, es, len: v.length });
  }
}
if (offenders.length === 0) {
  out.push("**Ninguno.** Todos los slugs están normalizados a ≤60 caracteres.");
} else {
  out.push("| Lang | Slug | Len | Slug ES base |");
  out.push("| --- | --- | --- | --- |");
  for (const o of offenders) out.push(`| ${o.lang} | ${o.slug} | ${o.len} | ${o.es} |`);
}
out.push("");
out.push("## Slugs deprecados (alias 301)");
out.push("");
const legacyKeys = Object.keys(legacy);
if (legacyKeys.length === 0) {
  out.push("Sin alias deprecados.");
} else {
  out.push("Cada entrada genera un 301 desde la URL deprecada hacia la canónica vía el handler genérico de `server/routes/public.ts`.");
  out.push("");
  out.push("| Lang | Slug deprecado (len) | ES base | Slug canónico actual |");
  out.push("| --- | --- | --- | --- |");
  for (const [oldSlug, entry] of Object.entries(legacy)) {
    const canonical = i18n[entry.es]?.[entry.lang] || entry.es;
    out.push(`| ${entry.lang} | \`${oldSlug}\` (${oldSlug.length}) | ${entry.es} | \`${canonical}\` (${canonical.length}) |`);
  }
}
out.push("");
out.push("## Renombrados en esta pasada");
out.push("");
if (renames.length === 0) {
  out.push("Sin cambios — los slugs ya estaban dentro del límite.");
} else {
  out.push("| Lang | ES base | Antes (len) | Después (len) |");
  out.push("| --- | --- | --- | --- |");
  for (const r of renames) {
    out.push(`| ${r.lang} | ${r.esSlug} | \`${r.oldSlug}\` (${r.oldSlug.length}) | \`${r.newSlug}\` (${r.newSlug.length}) |`);
  }
}
out.push("");
fs.writeFileSync(AUDIT_OUT, out.join("\n"));
console.log(`Audit refreshed → ${path.relative(process.cwd(), AUDIT_OUT)}`);
