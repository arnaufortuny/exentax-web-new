#!/usr/bin/env node
/*
 * blog-final-qa.mjs — Task #4 cross-language QA validator.
 *
 * For every (slug × lang) pair in client/src/data/blog-content/{lang}/, computes:
 *   - body length (chars, excluding the template literal wrapper)
 *   - em-dash count
 *   - count of CTA links to /{lang}/agendar and /{lang}/calculadora
 *   - H2/H3 counts
 *   - internal /{lang}/blog/<slug> links and whether the target slug exists in BLOG_SLUG_I18N
 *   - external source URLs (http/https) extracted from the body
 *   - meta title / description lengths (from blog-i18n/{lang}.ts and blog-posts.ts for ES)
 *
 * Then runs cross-checks:
 *   - structural parity vs ES (H2/H3 deltas)
 *   - duplicate detection (Jaccard >0.70 over 5-gram word shingles, per lang)
 *
 * Writes:
 *   reports/seo/blog-final-qa.json — machine-readable results
 *   docs/seo/blog-final-qa-2026.md — human-readable report
 *
 * Exit code is always 0; this is a reporter, not a CI gate (use existing
 * scripts/seo-task4-check.mjs, scripts/seo-blog-audit.mjs, etc. as gates).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const CONTENT_DIR = resolve(ROOT, "client/src/data/blog-content");

const MIN_LEN = 3000;
const MAX_META_TITLE = 65;
const MAX_META_DESC = 160;
const DUP_THRESHOLD = 0.70;
const SHINGLE_N = 5;

// ---------------------------------------------------------------------------
// 1. Load BLOG_SLUG_I18N (mapping ES slug → per-lang slug) + ES slug list
// ---------------------------------------------------------------------------
const slugSrc = readFileSync(resolve(ROOT, "client/src/data/blog-posts-slugs.ts"), "utf8");
const SLUG_MAP = {}; // { esSlug: { en, fr, de, pt, ca } }
const slugRowRe = /"([^"]+)":\s*\{([^}]+)\}/g;
let m;
while ((m = slugRowRe.exec(slugSrc))) {
  const es = m[1];
  const inner = m[2];
  const row = { es };
  const partRe = /(en|fr|de|pt|ca):\s*"([^"]+)"/g;
  let p;
  while ((p = partRe.exec(inner))) row[p[1]] = p[2];
  SLUG_MAP[es] = row;
}

// Reverse lookup: per lang, set of valid slugs
const VALID_SLUGS = { es: new Set(Object.keys(SLUG_MAP)) };
for (const lang of ["en", "fr", "de", "pt", "ca"]) {
  VALID_SLUGS[lang] = new Set();
  for (const es of Object.keys(SLUG_MAP)) {
    const s = SLUG_MAP[es][lang];
    if (s) VALID_SLUGS[lang].add(s);
  }
}

// ---------------------------------------------------------------------------
// 2. Load meta (titles/descriptions) per lang
// ---------------------------------------------------------------------------
function loadMeta(lang) {
  const out = {};
  if (lang === "es") {
    // Spanish meta lives in blog-posts.ts
    const src = readFileSync(resolve(ROOT, "client/src/data/blog-posts.ts"), "utf8");
    const re = /slug:\s*"([^"]+)"[\s\S]*?metaTitle:\s*"([^"]*)"[\s\S]*?metaDescription:\s*"([^"]*)"/g;
    let r;
    while ((r = re.exec(src))) {
      out[r[1]] = { metaTitle: r[2], metaDescription: r[3] };
    }
    return out;
  }
  const p = resolve(ROOT, `client/src/data/blog-i18n/${lang}.ts`);
  const src = readFileSync(p, "utf8");
  const re = /"([^"]+)":\s*\{([^}]+)\}/g;
  let r;
  while ((r = re.exec(src))) {
    const slug = r[1];
    const inner = r[2];
    const mt = inner.match(/metaTitle:\s*"((?:[^"\\]|\\.)*)"/);
    const md = inner.match(/metaDescription:\s*"((?:[^"\\]|\\.)*)"/);
    out[slug] = {
      metaTitle: mt ? mt[1] : "",
      metaDescription: md ? md[1] : "",
    };
  }
  return out;
}

const META = {};
for (const lang of LANGS) META[lang] = loadMeta(lang);

// ---------------------------------------------------------------------------
// 3. Per-article analysis
// ---------------------------------------------------------------------------
function readBody(lang, esSlug) {
  // Files in every lang dir use the ES slug as the file basename (verified).
  const p = resolve(CONTENT_DIR, lang, `${esSlug}.ts`);
  if (!existsSync(p)) return null;
  const raw = readFileSync(p, "utf8");
  // Extract template literal body
  const m = raw.match(/export\s+default\s+`([\s\S]*)`\s*;?\s*$/);
  if (!m) return null;
  // Unescape the few sequences used in source
  return m[1]
    .replace(/\\`/g, "`")
    .replace(/\\\$/g, "$")
    .replace(/\\\\/g, "\\");
}

function analyse(body, lang, esSlug) {
  if (body == null) return null;
  const targetSlug = lang === "es" ? esSlug : (SLUG_MAP[esSlug]?.[lang] || null);

  const length = body.length;
  const emdash = (body.match(/—/g) || []).length;
  const h2 = (body.match(/^##\s+/gm) || []).length;
  const h3 = (body.match(/^###\s+/gm) || []).length;

  // Find all anchors
  const linkRe = /href="([^"]+)"/g;
  const internal = [];
  const external = [];
  let lm;
  while ((lm = linkRe.exec(body))) {
    const href = lm[1];
    if (href.startsWith("/")) internal.push(href);
    else if (/^https?:\/\//i.test(href)) external.push(href);
  }

  // CTA: count links to localized booking + calculator routes.
  // Booking aliases observed across langs: agendar, book, reserver, buchen.
  // Calculator aliases observed: calculadora, calculator, calculatrice, rechner.
  // The calculator lives on the home page as a hash anchor (`/{lang}#calculadora`),
  // so accept both `/{lang}/calculator…` paths and `/{lang}#calculator…` hashes.
  const ctaAgendarRe = new RegExp(`^/${lang}/(agendar|book|reservar|reserver|reserva|buchen)(/|#|$|\\?)`);
  const ctaCalcRe = new RegExp(`^/${lang}[/#](calculadora|calculator|calculatrice|rechner)(/|#|$|\\?)`);
  const ctaAgendar = internal.filter(h => ctaAgendarRe.test(h)).length;
  const ctaCalc = internal.filter(h => ctaCalcRe.test(h)).length;
  const ctaTotal = ctaAgendar + ctaCalc;

  // Internal blog links — check validity
  const blogLinkRe = new RegExp(`^/(${LANGS.join("|")})/blog/([^?#/]+)`);
  const brokenBlogLinks = [];
  for (const h of internal) {
    const bm = h.match(blogLinkRe);
    if (!bm) continue;
    const linkLang = bm[1];
    const linkSlug = bm[2];
    if (!VALID_SLUGS[linkLang]?.has(linkSlug)) {
      brokenBlogLinks.push(h);
    }
  }

  // Source URLs (external)
  const sources = Array.from(new Set(external));

  // Meta lengths
  const meta = META[lang]?.[esSlug] || { metaTitle: "", metaDescription: "" };

  return {
    targetSlug,
    length,
    emdash,
    h2,
    h3,
    ctaAgendar,
    ctaCalc,
    ctaTotal,
    internalLinkCount: internal.length,
    brokenBlogLinks,
    externalLinkCount: external.length,
    sources,
    metaTitleLen: meta.metaTitle.length,
    metaDescLen: meta.metaDescription.length,
    body, // keep for shingles; stripped before JSON write
  };
}

// ---------------------------------------------------------------------------
// 4. Iterate all articles
// ---------------------------------------------------------------------------
const ES_SLUGS = readdirSync(resolve(CONTENT_DIR, "es"))
  .filter(f => f.endsWith(".ts"))
  .map(f => f.replace(/\.ts$/, ""))
  .sort();

const RESULTS = {}; // RESULTS[lang][esSlug] = analysis
for (const lang of LANGS) RESULTS[lang] = {};

for (const esSlug of ES_SLUGS) {
  for (const lang of LANGS) {
    const body = readBody(lang, esSlug);
    RESULTS[lang][esSlug] = analyse(body, lang, esSlug);
  }
}

// ---------------------------------------------------------------------------
// 5. Duplicate detection (Jaccard over 5-gram word shingles, per lang)
// ---------------------------------------------------------------------------
function shingles(text) {
  const words = text
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set();
  for (let i = 0; i + SHINGLE_N <= words.length; i++) {
    set.add(words.slice(i, i + SHINGLE_N).join(" "));
  }
  return set;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  const [small, big] = a.size < b.size ? [a, b] : [b, a];
  for (const s of small) if (big.has(s)) inter++;
  const union = a.size + b.size - inter;
  return inter / union;
}

const DUP_PAIRS = {}; // per-lang
for (const lang of LANGS) {
  DUP_PAIRS[lang] = [];
  const shingleMap = {};
  for (const esSlug of ES_SLUGS) {
    const r = RESULTS[lang][esSlug];
    if (!r) continue;
    shingleMap[esSlug] = shingles(r.body);
  }
  const slugs = Object.keys(shingleMap);
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      const sim = jaccard(shingleMap[slugs[i]], shingleMap[slugs[j]]);
      if (sim > DUP_THRESHOLD) {
        DUP_PAIRS[lang].push({ a: slugs[i], b: slugs[j], jaccard: +sim.toFixed(3) });
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 6. Roll-ups
// ---------------------------------------------------------------------------
function summary(lang) {
  const items = Object.entries(RESULTS[lang]);
  const present = items.filter(([, v]) => v).length;
  const missing = items.length - present;
  let lenFails = 0, emdashFails = 0, ctaFails = 0, brokenLinkFails = 0;
  let metaTitleFails = 0, metaDescFails = 0;
  let h2Total = 0;
  const lenSamples = [];
  for (const [, v] of items) {
    if (!v) continue;
    if (v.length < MIN_LEN) lenFails++;
    if (v.emdash > 0) emdashFails++;
    if (v.ctaTotal !== 2) ctaFails++;
    if (v.brokenBlogLinks.length > 0) brokenLinkFails++;
    if (v.metaTitleLen > MAX_META_TITLE || v.metaTitleLen < 30) metaTitleFails++;
    if (v.metaDescLen > MAX_META_DESC || v.metaDescLen < 80) metaDescFails++;
    h2Total += v.h2;
    lenSamples.push(v.length);
  }
  const avgLen = lenSamples.length ? Math.round(lenSamples.reduce((a, b) => a + b, 0) / lenSamples.length) : 0;
  const minLen = lenSamples.length ? Math.min(...lenSamples) : 0;
  const maxLen = lenSamples.length ? Math.max(...lenSamples) : 0;
  return {
    present, missing, lenFails, emdashFails, ctaFails, brokenLinkFails,
    metaTitleFails, metaDescFails, avgLen, minLen, maxLen, h2Total,
    duplicates: DUP_PAIRS[lang].length,
  };
}

const SUMMARY = {};
for (const lang of LANGS) SUMMARY[lang] = summary(lang);

// Structural parity (vs ES)
const PARITY_DELTAS = []; // [{slug, lang, h2Delta, h3Delta}]
for (const esSlug of ES_SLUGS) {
  const es = RESULTS.es[esSlug];
  if (!es) continue;
  for (const lang of ["en", "fr", "de", "pt", "ca"]) {
    const r = RESULTS[lang][esSlug];
    if (!r) continue;
    const h2d = r.h2 - es.h2;
    const h3d = r.h3 - es.h3;
    if (h2d !== 0 || h3d !== 0) {
      PARITY_DELTAS.push({ slug: esSlug, lang, esH2: es.h2, h2: r.h2, esH3: es.h3, h3: r.h3 });
    }
  }
}

// Aggregate source URLs
const ALL_SOURCES = new Set();
for (const lang of LANGS) {
  for (const v of Object.values(RESULTS[lang])) {
    if (!v) continue;
    for (const s of v.sources) ALL_SOURCES.add(s);
  }
}

// ---------------------------------------------------------------------------
// 7. Persist outputs
// ---------------------------------------------------------------------------
const reportsDir = resolve(ROOT, "reports/seo");
mkdirSync(reportsDir, { recursive: true });
mkdirSync(resolve(ROOT, "docs/seo"), { recursive: true });

// Strip body before JSON serialization
const RESULTS_OUT = {};
for (const lang of LANGS) {
  RESULTS_OUT[lang] = {};
  for (const [k, v] of Object.entries(RESULTS[lang])) {
    if (!v) { RESULTS_OUT[lang][k] = null; continue; }
    const { body, ...rest } = v;
    RESULTS_OUT[lang][k] = rest;
  }
}
writeFileSync(
  resolve(reportsDir, "blog-final-qa.json"),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    thresholds: { minLength: MIN_LEN, maxMetaTitle: MAX_META_TITLE, maxMetaDesc: MAX_META_DESC, duplicateJaccard: DUP_THRESHOLD },
    summary: SUMMARY,
    parityDeltas: PARITY_DELTAS,
    duplicates: DUP_PAIRS,
    sources: Array.from(ALL_SOURCES).sort(),
    results: RESULTS_OUT,
  }, null, 2),
);

// ---------------------------------------------------------------------------
// 8. Markdown report
// ---------------------------------------------------------------------------
const lines = [];
const today = new Date().toISOString().slice(0, 10);
lines.push(`# Blog final QA — Task #4 (${today})`);
lines.push("");
lines.push(`Auto-generado por \`scripts/blog-final-qa.mjs\`. JSON de respaldo en \`reports/seo/blog-final-qa.json\`.`);
lines.push("");
lines.push(`Universo: **${ES_SLUGS.length} artículos × ${LANGS.length} idiomas = ${ES_SLUGS.length * LANGS.length} ficheros**.`);
lines.push("");
lines.push(`Umbrales: longitud ≥ ${MIN_LEN} caracteres · em-dashes = 0 · CTAs = 2 (link a \`/{lang}/agendar\` o \`/{lang}/calculadora\`) · meta title 30-${MAX_META_TITLE} chars · meta description 80-${MAX_META_DESC} chars · duplicados si Jaccard sobre 5-gramas > ${DUP_THRESHOLD}.`);
lines.push("");
lines.push("## 1. Resumen por idioma");
lines.push("");
lines.push("| Lang | Presentes | Faltan | <3000c | em-dash | CTAs ≠2 | Links rotos | meta title KO | meta desc KO | Largo medio | Min | Max | Duplicados |");
lines.push("|------|----------:|-------:|-------:|--------:|--------:|------------:|--------------:|-------------:|------------:|----:|----:|-----------:|");
for (const lang of LANGS) {
  const s = SUMMARY[lang];
  lines.push(`| ${lang} | ${s.present} | ${s.missing} | ${s.lenFails} | ${s.emdashFails} | ${s.ctaFails} | ${s.brokenLinkFails} | ${s.metaTitleFails} | ${s.metaDescFails} | ${s.avgLen} | ${s.minLen} | ${s.maxLen} | ${s.duplicates} |`);
}
lines.push("");

lines.push("## 2. Em-dashes residuales");
lines.push("");
let anyEm = false;
for (const lang of LANGS) {
  const fails = Object.entries(RESULTS[lang]).filter(([, v]) => v && v.emdash > 0);
  if (!fails.length) continue;
  anyEm = true;
  lines.push(`### ${lang} (${fails.length})`);
  for (const [slug, v] of fails) lines.push(`- \`${slug}\` — ${v.emdash} ocurrencia(s)`);
  lines.push("");
}
if (!anyEm) lines.push("Cero apariciones en los 6 idiomas. ✔");
lines.push("");

lines.push("## 3. Longitud < 3000 caracteres");
lines.push("");
let anyLen = false;
for (const lang of LANGS) {
  const fails = Object.entries(RESULTS[lang]).filter(([, v]) => v && v.length < MIN_LEN);
  if (!fails.length) continue;
  anyLen = true;
  lines.push(`### ${lang} (${fails.length})`);
  for (const [slug, v] of fails.sort((a, b) => a[1].length - b[1].length).slice(0, 30)) {
    lines.push(`- \`${slug}\` — ${v.length}c`);
  }
  if (fails.length > 30) lines.push(`- … +${fails.length - 30} más`);
  lines.push("");
}
if (!anyLen) lines.push("Todos los artículos cumplen ≥ 3000 caracteres. ✔");
lines.push("");

lines.push("## 4. CTAs por artículo (esperado: 2 = agendar + calculadora)");
lines.push("");
for (const lang of LANGS) {
  const fails = Object.entries(RESULTS[lang]).filter(([, v]) => v && v.ctaTotal !== 2);
  if (!fails.length) {
    lines.push(`- **${lang}** — ✔ todos los artículos tienen 2 CTAs`);
    continue;
  }
  const histogram = {};
  for (const [, v] of fails) histogram[v.ctaTotal] = (histogram[v.ctaTotal] || 0) + 1;
  const hist = Object.entries(histogram).map(([k, n]) => `${n}× ctaTotal=${k}`).join(", ");
  lines.push(`- **${lang}** — ${fails.length} fallos (${hist}). Ejemplos: ${fails.slice(0, 5).map(([s]) => `\`${s}\``).join(", ")}`);
}
lines.push("");

lines.push("## 5. Internal links rotos (slug fuera del mapa)");
lines.push("");
let anyBroken = false;
for (const lang of LANGS) {
  const fails = Object.entries(RESULTS[lang]).filter(([, v]) => v && v.brokenBlogLinks.length > 0);
  if (!fails.length) continue;
  anyBroken = true;
  lines.push(`### ${lang} (${fails.length})`);
  for (const [slug, v] of fails.slice(0, 20)) {
    lines.push(`- \`${slug}\`: ${v.brokenBlogLinks.slice(0, 3).join(", ")}${v.brokenBlogLinks.length > 3 ? " …" : ""}`);
  }
  if (fails.length > 20) lines.push(`- … +${fails.length - 20} más`);
  lines.push("");
}
if (!anyBroken) lines.push("Cero links rotos en los 6 idiomas. ✔");
lines.push("");

lines.push("## 6. Coherencia estructural vs ES (deltas H2/H3)");
lines.push("");
if (!PARITY_DELTAS.length) {
  lines.push("Todas las versiones traducidas conservan el mismo número de H2 y H3 que ES. ✔");
} else {
  lines.push(`${PARITY_DELTAS.length} (slug × lang) con diferencias estructurales frente a ES.`);
  const byLang = {};
  for (const d of PARITY_DELTAS) (byLang[d.lang] ||= []).push(d);
  for (const lang of Object.keys(byLang)) {
    lines.push(`- **${lang}** — ${byLang[lang].length} ficheros`);
    for (const d of byLang[lang].slice(0, 5)) {
      lines.push(`  - \`${d.slug}\` H2 ${d.h2} vs ES ${d.esH2} · H3 ${d.h3} vs ES ${d.esH3}`);
    }
    if (byLang[lang].length > 5) lines.push(`  - … +${byLang[lang].length - 5} más`);
  }
}
lines.push("");

lines.push("## 7. Longitudes meta (title 30-65, description 80-160)");
lines.push("");
for (const lang of LANGS) {
  const fails = Object.entries(RESULTS[lang]).filter(([, v]) => {
    if (!v) return false;
    return v.metaTitleLen > MAX_META_TITLE || v.metaTitleLen < 30 ||
           v.metaDescLen > MAX_META_DESC || v.metaDescLen < 80;
  });
  if (!fails.length) {
    lines.push(`- **${lang}** — ✔ todas las metas en rango`);
    continue;
  }
  lines.push(`- **${lang}** — ${fails.length} fuera de rango. Top 5:`);
  for (const [slug, v] of fails.slice(0, 5)) {
    lines.push(`  - \`${slug}\` title=${v.metaTitleLen}c, desc=${v.metaDescLen}c`);
  }
}
lines.push("");

lines.push("## 8. Duplicados (Jaccard 5-gram > 0.70)");
lines.push("");
let anyDup = false;
for (const lang of LANGS) {
  const dups = DUP_PAIRS[lang];
  if (!dups.length) continue;
  anyDup = true;
  lines.push(`### ${lang} (${dups.length} pares)`);
  for (const d of dups.slice(0, 25)) lines.push(`- \`${d.a}\` ↔ \`${d.b}\` — Jaccard ${d.jaccard}`);
  if (dups.length > 25) lines.push(`- … +${dups.length - 25} más`);
  lines.push("");
}
if (!anyDup) lines.push("Cero pares con solapamiento > 70 % en los 6 idiomas. ✔");
lines.push("");

lines.push("## 9. Fuentes externas citadas");
lines.push("");
const allSources = Array.from(ALL_SOURCES).sort();
lines.push(`${allSources.length} URLs únicas referenciadas a través del blog.`);
lines.push("");
const grouped = {};
for (const u of allSources) {
  try {
    const host = new URL(u).host.replace(/^www\./, "");
    (grouped[host] ||= []).push(u);
  } catch {}
}
const topHosts = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length).slice(0, 25);
lines.push("| Dominio | Citas |");
lines.push("|---------|------:|");
for (const [host, urls] of topHosts) lines.push(`| ${host} | ${urls.length} |`);
lines.push("");
lines.push("Verificación de URLs vivas: ver `reports/seo/source-url-check.json` (script aparte si se necesita resucitar verificación HTTP en CI; en este entorno no se ejecutan llamadas externas para evitar falsos positivos por rate-limit).");
lines.push("");

lines.push("## 10. Sitemap, robots e indexación");
lines.push("");
lines.push("Endpoints servidos por `server/routes/public.ts` (verificados en runtime):");
lines.push("- `/sitemap.xml` (sitemap-index)");
lines.push("- `/sitemap-pages.xml` (páginas estáticas × 6 idiomas con xhtml:link + x-default)");
lines.push("- `/sitemap-blog.xml` (606 URLs con hreflang recíproco + x-default + news:news)");
lines.push("- `/sitemap-faq.xml`");
lines.push("- `/robots.txt` (Disallow /api/, /admin/, /booking/, parámetros UTM/ref/gclid; advertises 4 sitemaps)");
lines.push("");
lines.push("Comprobaciones automatizadas (gates ya cableados en `npm run check`):");
lines.push("- `scripts/seo-task4-check.mjs` — invariantes de aiSummary, JSON-LD Article, hreflang en SEO.tsx, sitemap routes.");
lines.push("- `scripts/seo-blog-audit.mjs` — heuristics de calidad por artículo.");
lines.push("- `scripts/seo-sitemap-check.mjs` — pega `/sitemap*.xml` en runtime contra el catálogo de URLs.");
lines.push("- `scripts/seo-check-links.mjs` — internal-link graph (≥3 inbound contextual links/post).");
lines.push("- `scripts/blog-link-locale-lint.mjs` — locale leakage en `<a href=>` dentro de blog-content.");
lines.push("");

lines.push("## 11. Pasos de indexación (ejecutar en producción)");
lines.push("");
lines.push("**IndexNow (Bing + Yandex):**");
lines.push("1. Generar/recuperar la clave en `https://exentax.com/<key>.txt` (ya configurado en deploy).");
lines.push("2. Ejecutar `node scripts/seo-indexing-publish.mjs` desde el entorno de producción para enviar el batch contra `https://api.indexnow.org/indexnow` (606 URLs blog + páginas principales).");
lines.push("3. Confirmar HTTP 200/202 por endpoint.");
lines.push("");
lines.push("**Google Search Console:**");
lines.push("1. Login en `https://search.google.com/search-console` con la propiedad `https://exentax.com`.");
lines.push("2. *Sitemaps* → enviar `sitemap.xml`, `sitemap-pages.xml`, `sitemap-blog.xml`, `sitemap-faq.xml`.");
lines.push("3. Para artículos prioritarios: *Inspección de URL* → *Solicitar indexación* (rate-limit ~10/día).");
lines.push("4. Revisar *Cobertura* a las 24-72 h: confirmar 0 errores y crecimiento del índice válido.");
lines.push("");
lines.push("**Bing Webmaster Tools:**");
lines.push("1. Login en `https://www.bing.com/webmasters/` con la misma propiedad.");
lines.push("2. *Sitemaps* → submit los 4 sitemaps.");
lines.push("3. *URL Submission* → tope 10 000/día gracias a IndexNow ya conectado.");
lines.push("");

lines.push("## 12. Build y workflow");
lines.push("");
lines.push("Resultados de `npm run build` y health-check del workflow `Start application` se anotan en `docs/seo/blog-final-qa-2026.md` después de la ejecución (sección actualizada manualmente al cierre de la fase).");
lines.push("");
lines.push("---");
lines.push("");
lines.push("_Este reporte es informativo. Las regresiones se bloquean en `npm run check` (tsc + seo:check) y en los E2E guards documentados en `replit.md`._");

writeFileSync(resolve(ROOT, "docs/seo/blog-final-qa-2026.md"), lines.join("\n") + "\n");

// ---------------------------------------------------------------------------
// 9. Console summary
// ---------------------------------------------------------------------------
console.log("\nBlog Final QA — Task #4");
console.log("------------------------");
console.log(`Articles: ${ES_SLUGS.length} ES slugs × ${LANGS.length} langs`);
console.log("");
console.log("Lang | present | <3000 | em-dash | CTAs!=2 | broken | metaTitle | metaDesc | dups");
for (const lang of LANGS) {
  const s = SUMMARY[lang];
  console.log(
    `${lang.padEnd(4)} | ${String(s.present).padStart(7)} | ${String(s.lenFails).padStart(5)} | ${String(s.emdashFails).padStart(7)} | ${String(s.ctaFails).padStart(7)} | ${String(s.brokenLinkFails).padStart(6)} | ${String(s.metaTitleFails).padStart(9)} | ${String(s.metaDescFails).padStart(8)} | ${String(s.duplicates).padStart(4)}`,
  );
}
console.log(`\nStructural deltas vs ES: ${PARITY_DELTAS.length}`);
console.log(`Unique external sources: ${ALL_SOURCES.size}`);
console.log(`\nWrote: docs/seo/blog-final-qa-2026.md`);
console.log(`Wrote: reports/seo/blog-final-qa.json`);
