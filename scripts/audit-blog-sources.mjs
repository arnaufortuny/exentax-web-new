#!/usr/bin/env node
/**
 * Regenerates docs/auditoria-multiidioma/fuentes-y-referencias.json from the
 * current state of `exentax-web/client/src/data/blog-sources.ts` and the list
 * of blog slugs under `exentax-web/client/src/data/blog-content/es/`.
 *
 * The earlier version of this report was produced by phase 5 of
 * `scripts/auditoria-multiidioma.mjs` whose regex only recognised slugs
 * mapped to an inline array literal (`"slug": [ ... ]`) and missed every
 * slug mapped to a shared constant such as `BANKING_STACK`, `BOI_5472`,
 * `LLC_FUNDAMENTALS`, `SPAIN_TAX`, `INTL_JURISDICTIONS`, `NICHE_BUSINESS`,
 * `CRS_FATCA`, `W8_BROKER`. As a result it reported 79 false-positive
 * "missing" articles. This script parses `SOURCES_BY_SLUG` and
 * `OFFICIAL_SOURCES` directly (block-bounded regex) so the report mirrors
 * what the renderer actually emits at the bottom of every post.
 *
 * Usage:
 *   node scripts/audit-blog-sources.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "exentax-web");
const OUT_DIR = path.join(ROOT, "docs", "auditoria-multiidioma");
const SOURCES_FILE = path.join(APP, "client/src/data/blog-sources.ts");
const ES_DIR = path.join(APP, "client/src/data/blog-content/es");
const OUT_FILE = path.join(OUT_DIR, "fuentes-y-referencias.json");

function read(p) { return fs.readFileSync(p, "utf8"); }
function listSlugs() {
  return fs.readdirSync(ES_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""))
    .sort();
}

function sliceBlock(src, header) {
  const start = src.indexOf(header);
  if (start < 0) throw new Error(`Cannot find ${header} in blog-sources.ts`);
  let i = src.indexOf("{", start);
  if (i < 0) throw new Error(`Cannot find opening brace for ${header}`);
  let depth = 0;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error(`Unbalanced braces for ${header}`);
}

function extractSlugs(blockSrc) {
  const set = new Set();
  // Top-level keys inside the object: lines like `  "slug-name": ...`
  const re = /^\s{2}"([a-z][a-z0-9-]+)"\s*:/gm;
  let m;
  while ((m = re.exec(blockSrc)) !== null) set.add(m[1]);
  return set;
}

function extractExternalIds(blockSrc) {
  const set = new Set();
  const re = /\{\s*external\s*:\s*"([a-z0-9-]+)"\s*\}/g;
  let m;
  while ((m = re.exec(blockSrc)) !== null) set.add(m[1]);
  return set;
}

function extractOfficialIds(blockSrc) {
  const set = new Set();
  const re = /^\s{2}"([a-z0-9-]+)"\s*:\s*\{/gm;
  let m;
  while ((m = re.exec(blockSrc)) !== null) set.add(m[1]);
  return set;
}

const HIGH_RISK = [
  "boi-report-fincen-guia-completa-2026",
  "form-5472-que-es-como-presentarlo",
  "convenio-doble-imposicion-usa-espana-llc",
  "cuota-autonomo-2026",
  "cuotas-autonomos-2026-guia-completa",
  "dac7-plataformas-digitales-reporting-2026",
  "dac8-criptomonedas-reporting-fiscal-2026",
  "crs-cuentas-bancarias-llc-intercambio-informacion",
];

function main() {
  const src = read(SOURCES_FILE);
  const sourcesBlock = sliceBlock(src, "export const SOURCES_BY_SLUG");
  const officialBlock = sliceBlock(src, "export const OFFICIAL_SOURCES");

  const declared = extractSlugs(sourcesBlock);
  const referencedExternals = extractExternalIds(sourcesBlock);
  const officialIds = extractOfficialIds(officialBlock);
  const allSlugs = listSlugs();

  const missing = allSlugs.filter((s) => !declared.has(s));
  const orphanDeclared = [...declared].filter((s) => !allSlugs.includes(s));
  const danglingExternals = [...referencedExternals].filter((e) => !officialIds.has(e));
  const unusedExternals = [...officialIds].filter((e) => !referencedExternals.has(e));

  const findings = [];

  for (const slug of missing) {
    findings.push({
      article: slug,
      affirmation: "(artículo completo)",
      current_source: "ninguna",
      problem: "El artículo no declara entrada en SOURCES_BY_SLUG (blog-sources.ts) — el bloque de fuentes al pie no se renderiza con documentos respaldatorios.",
      recommended_source: "Mapear el artículo a uno o varios documentos internos del DOC_REGISTRY (docs/fact-check-2026.md, docs/banking-facts-2026.md, etc.) o añadir fuentes externas oficiales (AEAT, IRS, FinCEN, BOE, BCE).",
      priority: "media",
    });
  }

  for (const slug of orphanDeclared) {
    findings.push({
      article: slug,
      affirmation: "(entrada huérfana en SOURCES_BY_SLUG)",
      current_source: "Declarada en SOURCES_BY_SLUG",
      problem: "La entrada apunta a un slug que ya no existe en client/src/data/blog-content/es/.",
      recommended_source: "Eliminar la entrada huérfana o restaurar el artículo correspondiente.",
      priority: "baja",
    });
  }

  for (const ext of danglingExternals) {
    findings.push({
      article: "(global)",
      affirmation: `Referencia externa "${ext}" en SOURCES_BY_SLUG`,
      current_source: "Referenciada pero no definida",
      problem: "Algún artículo referencia una fuente externa que no está definida en OFFICIAL_SOURCES.",
      recommended_source: `Añadir la entrada "${ext}" a OFFICIAL_SOURCES o corregir la referencia.`,
      priority: "alta",
    });
  }

  for (const ext of unusedExternals) {
    findings.push({
      article: "(global)",
      affirmation: `Fuente externa "${ext}" definida en OFFICIAL_SOURCES`,
      current_source: "Definida pero no referenciada",
      problem: "La fuente externa está disponible pero ningún artículo la utiliza actualmente.",
      recommended_source: "Conservar para uso futuro o eliminar si quedó obsoleta.",
      priority: "informativa",
    });
  }

  // Note about external linking validation (kept from previous report).
  findings.push({
    article: "(global)",
    affirmation: "Enlaces externos en cuerpo de artículos",
    current_source: "Mixto — ver scripts/blog/blog-verify-source-urls.mjs y scripts/seo/seo-check-links.mjs",
    problem: "El proyecto cuenta con verificadores automatizados de URLs (HTTP 2xx) en scripts/. Esta auditoría no ejecuta peticiones HTTP.",
    recommended_source: "Ejecutar `node exentax-web/scripts/blog-verify-source-urls.mjs` y `node exentax-web/scripts/seo-check-links.mjs` periódicamente.",
    priority: "baja",
  });

  // High-risk fact claims always need a primary source.
  for (const slug of HIGH_RISK) {
    findings.push({
      article: slug,
      affirmation: "Cifras fiscales 2026 (cuotas, multas, plazos)",
      current_source: declared.has(slug) ? "Declarada en SOURCES_BY_SLUG" : "Falta en SOURCES_BY_SLUG",
      problem: "Artículo crítico para reputación y SEO; toda cifra debe estar respaldada por fuente oficial primaria.",
      recommended_source: {
        boi: "https://www.fincen.gov/boi",
        form_5472: "https://www.irs.gov/instructions/i5472",
        cdi_es_us: "https://sede.agenciatributaria.gob.es (CDI España–EE.UU.)",
        seguridad_social: "https://www.seg-social.es/wps/portal/wss/internet/Trabajadores",
        dac7: "https://eur-lex.europa.eu/eli/dir/2021/514",
        dac8: "https://eur-lex.europa.eu/eli/dir/2023/2226",
        crs_oecd: "https://www.oecd.org/tax/automatic-exchange/common-reporting-standard/",
        aeat: "https://sede.agenciatributaria.gob.es",
      },
      priority: declared.has(slug) ? "informativa" : "alta",
    });
  }

  const report = {
    generated_at: new Date().toISOString(),
    source: "scripts/audit-blog-sources.mjs",
    summary: {
      total_articles: allSlugs.length,
      articles_with_sources_declared: allSlugs.filter((s) => declared.has(s)).length,
      articles_missing_sources_block: missing.length,
      orphan_declared_entries: orphanDeclared.length,
      official_sources_defined: officialIds.size,
      official_sources_referenced: referencedExternals.size,
      dangling_external_refs: danglingExternals.length,
      unused_official_sources: unusedExternals.length,
      total_findings: findings.length,
    },
    findings,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2) + "\n");
  console.log(`wrote ${path.relative(ROOT, OUT_FILE)}`);
  console.log(JSON.stringify(report.summary, null, 2));

  // CI gate: when invoked with --check, exit non-zero if the canonical
  // counters drift from the expected fully-mapped state.
  if (process.argv.includes("--check")) {
    const s = report.summary;
    const errs = [];
    if (s.articles_missing_sources_block > 0) errs.push(`${s.articles_missing_sources_block} article(s) without SOURCES_BY_SLUG entry`);
    if (s.orphan_declared_entries > 0) errs.push(`${s.orphan_declared_entries} orphan entry/entries in SOURCES_BY_SLUG`);
    if (s.dangling_external_refs > 0) errs.push(`${s.dangling_external_refs} dangling external reference(s)`);
    if (errs.length) {
      console.error("audit-blog-sources --check FAILED:");
      for (const e of errs) console.error("  -", e);
      process.exit(1);
    }
    // Non-blocking warning: surface unused OFFICIAL_SOURCES so the catalogue
    // does not accumulate dead entries. Emits a GitHub Actions ::warning::
    // annotation when running on CI; otherwise prints to stderr. Does not
    // fail the job — see task #48.
    if (s.unused_official_sources > 0) {
      const list = unusedExternals.join(", ");
      const msg = `audit-blog-sources: ${s.unused_official_sources} unused OFFICIAL_SOURCES entry/entries (defined but not referenced by any article): ${list}. Consider removing them from blog-sources.ts or wiring them into the relevant article(s).`;
      if (process.env.GITHUB_ACTIONS === "true") {
        console.log(`::warning file=exentax-web/client/src/data/blog-sources.ts::${msg}`);
      } else {
        console.warn("WARNING:", msg);
      }
    }
    console.log(s.unused_official_sources > 0
      ? "audit-blog-sources --check: OK (with warnings)"
      : "audit-blog-sources --check: OK");
  }
}

main();
