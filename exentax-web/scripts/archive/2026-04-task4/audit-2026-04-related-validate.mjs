#!/usr/bin/env node
/* eslint-disable */
// Task #5 — Per-locale related-articles non-404 validation.
//
// For every (article × locale × relatedSlug) declared in
// `client/src/data/blog-posts.ts`, this script asserts that the
// localized URL `/{locale}/blog/<translated-slug>` resolves to a
// content file present in `client/src/data/blog-content/{locale}/`. A
// missing translation is fatal (exit 1) — so the build pipeline blocks
// any deploy that would expose a 404 from the related-articles block.
//
// Output: `docs/audits/2026-04/related-articles.md` with the per-locale
// pass evidence table, plus a JSON sidecar
// `docs/audits/2026-04/related-articles.json` for machine consumption.

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const DOCS = path.resolve(WORKSPACE, "docs/audits/2026-04");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// Use tsx to evaluate the slug map and the BLOG_POSTS array. That way we
// stay in sync with the live data without re-implementing the parser.
function evalTs(snippet) {
  const tmp = path.join(ROOT, ".tmp-related-eval.mts");
  fs.writeFileSync(tmp, snippet);
  const r = spawnSync("npx", ["tsx", tmp], { cwd: ROOT, encoding: "utf8" });
  fs.unlinkSync(tmp);
  if (r.status !== 0) {
    console.error(r.stderr);
    throw new Error("tsx eval failed");
  }
  return JSON.parse(r.stdout.trim());
}

const posts = evalTs(`
import { BLOG_POSTS } from "./client/src/data/blog-posts";
import { BLOG_SLUG_I18N } from "./client/src/data/blog-posts-slugs";
const data = BLOG_POSTS.map(p => ({
  slug: p.slug,
  relatedSlugs: p.relatedSlugs || [],
  translations: BLOG_SLUG_I18N[p.slug] || {},
}));
const i18n = BLOG_SLUG_I18N;
process.stdout.write(JSON.stringify({ data, i18n }));
`);

const SLUG_MAP = posts.i18n;
const POSTS = posts.data;

// Build a fast lookup of which (slug, lang) has a content file.
const HAS = {};
for (const lang of LANGS) {
  HAS[lang] = new Set();
  const dir = path.join(CONTENT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".ts"))) {
    HAS[lang].add(f.replace(/\.ts$/, ""));
  }
}

const failures = [];
const perLangCounts = Object.fromEntries(LANGS.map(l => [l, { ok: 0, fail: 0 }]));
const perArticleRows = [];

for (const post of POSTS) {
  const row = { slug: post.slug, perLang: {} };
  for (const lang of LANGS) {
    const langChecks = [];
    for (const rel of post.relatedSlugs) {
      const translatedSlug = lang === "es" ? rel : (SLUG_MAP[rel]?.[lang] || rel);
      const url = `/${lang}/blog/${translatedSlug}`;
      const ok = HAS[lang].has(rel) || HAS[lang].has(translatedSlug);
      langChecks.push({ source: rel, translatedSlug, url, ok });
      if (ok) perLangCounts[lang].ok++;
      else { perLangCounts[lang].fail++; failures.push({ article: post.slug, lang, related: rel, url, reason: "no content file at /client/src/data/blog-content/" + lang + "/" + translatedSlug + ".ts" }); }
    }
    row.perLang[lang] = langChecks;
  }
  perArticleRows.push(row);
}

const totalChecks = Object.values(perLangCounts).reduce((s, x) => s + x.ok + x.fail, 0);
const totalFail = failures.length;

const md = [];
md.push("# Related articles — verificación de no-404 por locale");
md.push("");
md.push(`Generado por \`exentax-web/scripts/audit-2026-04-related-validate.mjs\`. Para cada artículo, recorre los \`relatedSlugs\` declarados en \`client/src/data/blog-posts.ts\`, los traduce a la slug localizada vía \`BLOG_SLUG_I18N\`, y verifica que el fichero de contenido \`client/src/data/blog-content/{locale}/<slug>.ts\` existe. Si falta cualquier idioma, el script falla con código de salida ≠ 0 y el build se bloquea.`);
md.push("");
md.push("## Resumen por locale");
md.push("");
md.push("| Locale | Checks ejecutados | OK (no-404) | Fallos |");
md.push("| --- | --- | --- | --- |");
for (const l of LANGS) {
  const c = perLangCounts[l];
  md.push(`| ${l} | ${c.ok + c.fail} | ${c.ok} | ${c.fail === 0 ? "0 ✅" : "**" + c.fail + " ❌**"} |`);
}
md.push("");
md.push(`**Total**: ${totalChecks} verificaciones, ${totalFail} fallos. ${totalFail === 0 ? "✅ Todos los enlaces de related-articles resuelven a un fichero de contenido publicado." : "❌ Hay enlaces de related-articles que apuntan a contenido no publicado."}`);
md.push("");
md.push("## Evidencia por artículo (primeras 10 filas — ver JSON sidecar para el detalle completo)");
md.push("");
md.push("| Artículo | es | en | fr | de | pt | ca |");
md.push("| --- | --- | --- | --- | --- | --- | --- |");
for (const row of perArticleRows.slice(0, 10)) {
  const cell = (l) => {
    const xs = row.perLang[l] || [];
    if (!xs.length) return "—";
    const ok = xs.filter(x => x.ok).length;
    return `${ok}/${xs.length} ${ok === xs.length ? "✅" : "❌"}`;
  };
  md.push(`| ${row.slug} | ${cell("es")} | ${cell("en")} | ${cell("fr")} | ${cell("de")} | ${cell("pt")} | ${cell("ca")} |`);
}
md.push("");
md.push("(El detalle completo por (artículo × locale × related) vive en `related-articles.json`.)");
md.push("");
if (totalFail > 0) {
  md.push("## Fallos");
  md.push("");
  md.push("| Artículo | Locale | Related slug | URL | Motivo |");
  md.push("| --- | --- | --- | --- | --- |");
  for (const f of failures) md.push(`| ${f.article} | ${f.lang} | ${f.related} | <code>${f.url}</code> | ${f.reason} |`);
  md.push("");
}
md.push("## Cómo se ancla en el build");
md.push("");
md.push("- `scripts/build.ts` ejecuta este script como gate de despliegue (alongside seo-meta-audit, seo-related-validate, cta-conversion-audit, inline-review-markers, cta-changelog).");
md.push("- `scripts/seo-related-validate.mjs` complementa este check verificando que cada `relatedSlugs` referencia slugs canónicos existentes en `BLOG_POSTS` (no huérfanos).");
md.push("- `server/routes/public.test.ts` cubre el comportamiento HTTP del router (301 de slugs legacy, 200 en slugs canónicos).");

fs.writeFileSync(path.join(DOCS, "related-articles.md"), md.join("\n"));
fs.writeFileSync(path.join(DOCS, "related-articles.json"), JSON.stringify({ summary: perLangCounts, totalChecks, totalFail, failures, perArticleRows }, null, 2));

console.log(`Related-articles validation: ${totalChecks} checks, ${totalFail} failures.`);
if (totalFail > 0) {
  for (const f of failures.slice(0, 5)) console.error(`  FAIL: ${f.article} [${f.lang}] → ${f.url}`);
  process.exit(1);
}
