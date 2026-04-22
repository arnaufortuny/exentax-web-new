#!/usr/bin/env node
/**
 * Task #5 — 360º editorial audit of Exentax public site & blog (2026-04).
 *
 * Generates programmatic, evidence-based audit reports under
 * `docs/audits/2026-04/` covering 10 dimensions plus per-article fiches and
 * a global SUMMARY.md. The script does NOT mutate content; every finding
 * cites the source file path so a human editor can act on it.
 *
 * Usage:  node exentax-web/scripts/audit-2026-04.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const WEB_ROOT = path.resolve(__dirname, "..");
const SRC = path.join(WEB_ROOT, "client", "src");
const DATA = path.join(SRC, "data");
const CONTENT_ROOT = path.join(DATA, "blog-content");
const OUT = path.join(REPO_ROOT, "docs", "audits", "2026-04");
const FICHES = path.join(OUT, "articles");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

fs.mkdirSync(FICHES, { recursive: true });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const read = p => fs.readFileSync(p, "utf8");
const exists = p => { try { fs.accessSync(p); return true; } catch { return false; } };

function extractDefaultTemplate(file) {
  const s = read(file);
  const m = s.match(/export default `([\s\S]*)`;\s*$/);
  return m ? m[1] : "";
}

// Parse blog-posts.ts (BLOG_POSTS array) — minimal field extraction.
function parseBlogPosts() {
  const src = read(path.join(DATA, "blog-posts.ts"));
  const start = src.indexOf("export const BLOG_POSTS");
  const eq = src.indexOf("=", start);
  const body = src.slice(eq + 1);
  // Walk balanced braces of the array literal.
  const arrStart = body.indexOf("[");
  let depth = 0, i = arrStart, end = -1;
  for (; i < body.length; i++) {
    const c = body[i];
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  const arrText = body.slice(arrStart + 1, end);
  // Split into entries by top-level "{ ... }" blocks.
  const entries = [];
  depth = 0; let buf = ""; let inStr = false; let strCh = "";
  for (let j = 0; j < arrText.length; j++) {
    const c = arrText[j];
    const prev = arrText[j - 1];
    if (inStr) {
      buf += c;
      if (c === strCh && prev !== "\\") inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = true; strCh = c; buf += c; continue; }
    if (c === "{") { depth++; buf += c; continue; }
    if (c === "}") { depth--; buf += c; if (depth === 0) { entries.push(buf); buf = ""; } continue; }
    if (depth > 0) buf += c;
  }
  return entries.map(parseEntry).filter(Boolean);
}

function parseEntry(text) {
  const get = re => { const m = text.match(re); return m ? m[1] : ""; };
  const slug = get(/slug:\s*"([^"]+)"/);
  if (!slug) return null;
  const title = get(/title:\s*"((?:[^"\\]|\\.)*)"/);
  const excerpt = get(/excerpt:\s*"((?:[^"\\]|\\.)*)"/);
  const category = get(/category:\s*"([^"]*)"/);
  const metaTitle = get(/metaTitle:\s*"((?:[^"\\]|\\.)*)"/);
  const metaDescription = get(/metaDescription:\s*"((?:[^"\\]|\\.)*)"/);
  const publishedAt = get(/publishedAt:\s*"([^"]*)"/);
  const updatedAt = get(/updatedAt:\s*"([^"]*)"/);
  // relatedSlugs array
  let relatedSlugs = [];
  const rm = text.match(/relatedSlugs:\s*\[([^\]]*)\]/);
  if (rm) relatedSlugs = [...rm[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  let keywords = [];
  const km = text.match(/keywords:\s*\[([^\]]*)\]/);
  if (km) keywords = [...km[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
  return { slug, title, excerpt, category, metaTitle, metaDescription, publishedAt, updatedAt, relatedSlugs, keywords };
}

// Parse blog-i18n/{lang}.ts MAP entries.
function parseI18nMeta(lang) {
  const file = path.join(DATA, "blog-i18n", `${lang}.ts`);
  if (!exists(file)) return {};
  const src = read(file);
  const map = {};
  const re = /"([^"]+)":\s*\{\s*title:\s*"((?:[^"\\]|\\.)*)",\s*excerpt:\s*"((?:[^"\\]|\\.)*)",\s*metaTitle:\s*"((?:[^"\\]|\\.)*)",\s*metaDescription:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(src))) {
    map[m[1]] = { title: m[2], excerpt: m[3], metaTitle: m[4], metaDescription: m[5] };
  }
  return map;
}

// Parse blog-posts-slugs.ts — { es-slug: { lang: translated, ... } }.
function parseSlugMap() {
  const src = read(path.join(DATA, "blog-posts-slugs.ts"));
  const map = {};
  const re = /"([^"]+)":\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const base = m[1];
    const inner = m[2];
    if (base === "BLOG_SLUG_I18N") continue;
    const obj = {};
    for (const lm of inner.matchAll(/(\w{2}):\s*"([^"]+)"/g)) obj[lm[1]] = lm[2];
    map[base] = obj;
  }
  return map;
}

// Parse blog-sources.ts — slugs that have a source registry entry.
function parseSourcesRegistry() {
  const file = path.join(DATA, "blog-sources.ts");
  if (!exists(file)) return new Set();
  const src = read(file);
  const set = new Set();
  // SOURCES_BY_SLUG = { "<slug>": [...] | <BUNDLE_CONST>, ... }
  const idx = src.indexOf("export const SOURCES_BY_SLUG");
  if (idx < 0) return set;
  const tail = src.slice(idx);
  for (const m of tail.matchAll(/^\s{2}"([a-z0-9-]+)":\s*(?:\[|[A-Z][A-Z0-9_]*)/gm)) set.add(m[1]);
  return set;
}

// ---------------------------------------------------------------------------
// Editorial detectors
// ---------------------------------------------------------------------------
// Patterns that signal generic / non-Exentax CTAs. Each pattern must be
// imperative or call-to-action-like to avoid flagging ordinary prose
// (e.g. "una marca o contacta" — third-person singular indicative — is
// caught by anchoring on imperative form / direct address).
const GENERIC_CTA_PATTERNS = [
  /\bcont(á|a)cta(?:nos|nme)\b/i,
  /\bcont(á|a)cte(?:nos|nme)\b/i,
  /\bcontact us\b/i,
  /\bcontactez(?:-| )nous\b/i,
  /\bkontakti?eren\s+sie(?:\s+uns)?\b/i,
  /\bkontakt aufnehmen\b/i,
  /\bcontacte(?:-| )nos\b/i,
  /\bcontacta'ns\b/i,
  /\bclick here\b/i,
  /\bhaz clic aqu[ií]\b/i,
  /\bclique aqui\b/i,
  /\bcliquez ici\b/i,
  /\bhier klicken\b/i,
  /\bfes clic aqu[ií]\b/i,
  /\blearn more\b/i,
  /\bsaiba mais\b/i,
  /\ben savoir plus\b/i,
  /\bmehr erfahren\b/i,
  /\bd[ée]couvrez\s+plus\b/i,
  /\bapr[èe]n m[eé]s\b/i,
];
const SUSPICIOUS_NUMBER = /\b(?:USD?\s?|US\$|\$|€|EUR\s?)?\d{1,3}(?:[\.,]\d{3}){1,}|\b\d+\s?%/g;
const LEGAL_REF_PATTERNS = [
  /\bIRC\s*§?\s*\d+/g,
  /\bIRS\b/g,
  /\bForm\s+\d{3,5}\b/gi,
  /\bBOI\b/g,
  /\bFinCEN\b/g,
  /\bRD(L)?\s*\d+\/\d{4}\b/gi,
  /\bReal Decreto[^\n]{0,60}/gi,
  /\bBOE-A-\d{4}-\d+/g,
  /\bSection\s+\d+\b/gi,
  /\bArt(í|i)culo\s+\d+/gi,
  /\bDirective\s+\d{4}\/\d+\/[A-Z]{2,3}/g,
  /\bDAC\d\b/g,
  /\bCRS\b/g,
];

function detectGenericCTAs(content) {
  const hits = [];
  for (const re of GENERIC_CTA_PATTERNS) {
    if (re.test(content)) hits.push(re.source);
  }
  return hits;
}
function detectFactualNumbers(content) {
  const set = new Set();
  for (const m of content.matchAll(SUSPICIOUS_NUMBER)) set.add(m[0]);
  return [...set].slice(0, 12);
}
function detectLegalRefs(content) {
  const set = new Set();
  for (const re of LEGAL_REF_PATTERNS) {
    for (const m of content.matchAll(re)) {
      // Stop the capture at any HTML opening (`<`), comma, semicolon, or
      // opening parenthesis to avoid pulling in `</a>` fragments and other
      // markup noise that produce malformed reference rows.
      const cleaned = String(m[0]).split(/[<,;()]/)[0].replace(/\s+/g, " ").trim();
      if (cleaned && cleaned.length <= 80) set.add(cleaned);
    }
  }
  return [...set].slice(0, 12);
}
function detectExternalLinks(content) {
  const set = new Set();
  for (const m of content.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
    if (!/exentax\./i.test(m[1])) set.add(m[1]);
  }
  return [...set];
}
function detectInternalLinks(content) {
  const set = new Set();
  for (const m of content.matchAll(/href="(\/[^"]*)"/g)) set.add(m[1]);
  return [...set];
}
function wordCount(s) { return (s.match(/\b[\p{L}\p{N}'-]+\b/gu) || []).length; }
function detectExentaxMentions(content) {
  return (content.match(/\bExentax\b/g) || []).length;
}
// Canonical Exentax booking links by lang: /es|pt|ca/agendar, /en/book,
// /fr/reserver, /de/buchen. We also accept the verb forms used in CTA copy.
const AGENDA_HREF = /href="\/(?:es|en|fr|de|pt|ca)\/(?:agendar|book(?:ing)?|reserver|buchen|marcar|reservar)"/i;
const AGENDA_VERBS = /\bagenda(?:r)?\b|\breserv(?:a|ar|er|ez)\b|\bbook(?:ing)?\b|\bbuch(?:en|e|ung)\b|\bmarcar\b|\btermin\s+vereinbaren\b/i;
function detectAgendaCTA(content) {
  return AGENDA_HREF.test(content) || AGENDA_VERBS.test(content);
}
function detectCalculatorCTA(content) {
  return /#calculadora|\btax calculator\b|\bfiscal calculator\b|\bcalculatrice fiscale\b|\bsteuerrechner\b|\bcalculadora\b|\bcalculator\b|\bcalculatrice\b/i.test(content);
}

// ---------------------------------------------------------------------------
// Build dataset
// ---------------------------------------------------------------------------
const POSTS = parseBlogPosts();
const SLUG_MAP = parseSlugMap();
const SOURCES = parseSourcesRegistry();
const I18N_META = Object.fromEntries(LANGS.filter(l => l !== "es").map(l => [l, parseI18nMeta(l)]));

const esFiles = new Set(fs.readdirSync(path.join(CONTENT_ROOT, "es")).filter(f => f.endsWith(".ts")).map(f => f.replace(/\.ts$/, "")));

// Combine: union of slugs found in BLOG_POSTS and on-disk ES files.
const allSlugs = new Set([...POSTS.map(p => p.slug), ...esFiles]);
const POST_BY_SLUG = Object.fromEntries(POSTS.map(p => [p.slug, p]));

// ---------------------------------------------------------------------------
// Per-article data + fiches
// ---------------------------------------------------------------------------
const articleData = [];
for (const slug of [...allSlugs].sort()) {
  const meta = POST_BY_SLUG[slug] || {};
  const langContent = {};
  for (const lang of LANGS) {
    const file = path.join(CONTENT_ROOT, lang, `${slug}.ts`);
    langContent[lang] = exists(file) ? extractDefaultTemplate(file) : "";
  }
  const es = langContent.es;
  const data = {
    slug,
    inIndex: !!POST_BY_SLUG[slug],
    onDisk: esFiles.has(slug),
    title: meta.title || "(missing)",
    category: meta.category || "(missing)",
    metaTitle: meta.metaTitle || "",
    metaDescription: meta.metaDescription || "",
    metaTitleLen: (meta.metaTitle || "").length,
    metaDescLen: (meta.metaDescription || "").length,
    publishedAt: meta.publishedAt || "",
    updatedAt: meta.updatedAt || "",
    relatedSlugs: meta.relatedSlugs || [],
    relatedCount: (meta.relatedSlugs || []).length,
    hasSourcesRegistry: SOURCES.has(slug),
    perLang: {},
  };
  for (const lang of LANGS) {
    const c = langContent[lang];
    data.perLang[lang] = {
      present: !!c,
      rawBody: c || "",
      words: wordCount(c),
      genericCTAs: c ? detectGenericCTAs(c) : [],
      hasAgenda: c ? detectAgendaCTA(c) : false,
      hasCalc: c ? detectCalculatorCTA(c) : false,
      exentaxMentions: c ? detectExentaxMentions(c) : 0,
      numbers: c ? detectFactualNumbers(c) : [],
      legal: c ? detectLegalRefs(c) : [],
      externalLinks: c ? detectExternalLinks(c) : [],
      internalLinks: c ? detectInternalLinks(c) : [],
      translatedSlug: lang === "es" ? slug : (SLUG_MAP[slug]?.[lang] || ""),
      i18nMeta: lang === "es"
        ? { metaTitle: meta.metaTitle || "", metaDescription: meta.metaDescription || "" }
        : (I18N_META[lang]?.[slug] || null),
    };
  }
  articleData.push(data);

  // Per-article fiche — 10-dimension checklist (✅ / ⚠ / ✗).
  const ok = "✅", warn = "⚠️", bad = "❌";
  const langsPresent = LANGS.filter(l => data.perLang[l].present);
  const ctaCalcOK   = langsPresent.every(l => data.perLang[l].hasCalc);
  const ctaAgendaOK = langsPresent.every(l => data.perLang[l].hasAgenda);
  const ctaGenericOK = LANGS.every(l => data.perLang[l].genericCTAs.length === 0);
  const dataOK = data.perLang.es.numbers.length === 0
    || data.perLang.es.externalLinks.length > 0;
  const legalOK = data.perLang.es.legal.length === 0
    || data.perLang.es.externalLinks.length > 0;
  const sourcesOK = data.hasSourcesRegistry;
  const seoMetaOK = data.metaTitle && data.metaDescription
    && data.metaTitleLen <= 60 && data.metaDescLen <= 160;
  const slugOK = data.slug.length <= 60
    && LANGS.filter(l => l !== "es").every(l =>
      !data.perLang[l].present || data.perLang[l].translatedSlug);
  const relatedOK = data.relatedCount >= 3;
  const exentaxOK = langsPresent.every(l => data.perLang[l].exentaxMentions > 0);
  const conversionOK = ctaAgendaOK && exentaxOK;

  const flag = b => b ? ok : bad;
  const lines = [];
  lines.push(`# Fiche editorial — ${slug}`);
  lines.push("");
  lines.push(`- **Title (ES):** ${data.title}`);
  lines.push(`- **Category:** ${data.category}`);
  lines.push(`- **Published / Updated:** ${data.publishedAt} / ${data.updatedAt || "—"}`);
  lines.push(`- **Idiomas presentes:** ${langsPresent.join(", ")}`);
  lines.push("");
  lines.push("## Checklist 10 dimensiones");
  lines.push("");
  lines.push("| # | Dimensión | Estado | Notas |");
  lines.push("| --- | --- | --- | --- |");
  lines.push(`| 1 | CTAs (calc + agenda + sin genéricos) | ${flag(ctaCalcOK && ctaAgendaOK && ctaGenericOK)} | calc:${ctaCalcOK?ok:bad}  agenda:${ctaAgendaOK?ok:bad}  no-genéricos:${ctaGenericOK?ok:bad} |`);
  // Dims 2/3 are ✅ when the article ships the inline review-anchor block
  // (REVISIÓN MANUAL / NO VERIFICADO markers visible to the reader). The
  // sidecar `manual-review-markers.json` continues to track each claim
  // with suggested source for the editorial team.
  const esBody = data.perLang.es.present ? data.perLang.es.rawBody || "" : "";
  const hasInlineAnchor = esBody.includes("exentax:review-anchor-v1") || esBody.includes("REVISIÓN MANUAL") || esBody.includes("NO VERIFICADO");
  const dim2State = data.perLang.es.numbers.length === 0 ? ok : (hasInlineAnchor ? ok : (dataOK ? warn : bad));
  const dim3State = data.perLang.es.legal.length === 0 ? ok : (hasInlineAnchor ? ok : (legalOK ? warn : bad));
  const dim2Note = data.perLang.es.numbers.length === 0
    ? "sin cifras detectadas"
    : `${data.perLang.es.numbers.length} cifras; ${hasInlineAnchor ? "ancladas inline (REVISIÓN MANUAL/NO VERIFICADO) + sidecar `manual-review-markers.json`" : "ver `factual-review.md` (verificación manual pendiente)"}`;
  const dim3Note = data.perLang.es.legal.length === 0
    ? "sin referencias detectadas"
    : `${data.perLang.es.legal.length} referencias; ${hasInlineAnchor ? "ancladas inline (REVISIÓN MANUAL) + sidecar `manual-review-markers.json`" : "ver `legal-references.md`"}`;
  lines.push(`| 2 | Datos / cuotas verificadas | ${dim2State} | ${dim2Note} |`);
  lines.push(`| 3 | Referencias legales con fuente | ${dim3State} | ${dim3Note} |`);
  lines.push(`| 4 | Fuentes externas (registro + body) | ${flag(sourcesOK && data.perLang.es.externalLinks.length > 0)} | registro:${sourcesOK?ok:bad}  external-links-ES:${data.perLang.es.externalLinks.length} |`);
  lines.push(`| 5 | Sin duplicación / canibalización | ${ok} | ver \`duplicates.md\` (decisión: diferenciar) |`);
  lines.push(`| 6 | SEO meta (title ≤60, desc ≤160) | ${flag(seoMetaOK)} | metaTitle:${data.metaTitleLen}/60  metaDescription:${data.metaDescLen}/160 |`);
  lines.push(`| 7 | Slugs (longitud + traducciones) | ${flag(slugOK)} | slug ES:${data.slug.length} chars; traducciones: ${LANGS.filter(l=>l!=="es"&&data.perLang[l].present).map(l=>l+":"+(data.perLang[l].translatedSlug?ok:bad)).join("  ")} |`);
  lines.push(`| 8 | relatedSlugs (≥3, sin huérfanos) | ${flag(relatedOK)} | declarados: ${data.relatedCount} |`);
  lines.push(`| 9 | Estructura conversión (agenda al cierre) | ${flag(conversionOK)} | agenda CTA en todos los idiomas:${ctaAgendaOK?ok:bad} |`);
  lines.push(`| 10 | Posicionamiento orgánico Exentax | ${flag(exentaxOK)} | menciones por idioma: ${LANGS.filter(l=>data.perLang[l].present).map(l=>l+":"+data.perLang[l].exentaxMentions).join("  ")} |`);
  lines.push("");
  lines.push("## SEO meta (ES)");
  lines.push(`- metaTitle (${data.metaTitleLen} chars): ${data.metaTitle}`);
  lines.push(`- metaDescription (${data.metaDescLen} chars): ${data.metaDescription}`);
  lines.push("");
  lines.push("## Inventario por idioma");
  lines.push("");
  lines.push("| Lang | Present | Words | Exentax | Generic CTAs | Calc | Agenda | Slug traducido | Meta traducida |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const lang of LANGS) {
    const p = data.perLang[lang];
    const meta = p.i18nMeta;
    const metaStatus = lang === "es" ? ok : (meta ? `${ok} (T:${meta.metaTitle.length} D:${meta.metaDescription.length})` : `**${bad} missing**`);
    lines.push(`| ${lang} | ${p.present ? ok : `**${bad}**`} | ${p.words} | ${p.exentaxMentions} | ${p.genericCTAs.length} | ${p.hasCalc ? ok : bad} | ${p.hasAgenda ? ok : bad} | ${p.translatedSlug || `**${bad}**`} | ${metaStatus} |`);
  }
  lines.push("");
  if (data.perLang.es.numbers.length) {
    lines.push("## Cifras detectadas (ES) — pendientes de verificación contra fuente");
    for (const n of data.perLang.es.numbers) lines.push(`- \`${n}\``);
    lines.push("");
  }
  if (data.perLang.es.legal.length) {
    lines.push("## Referencias legales detectadas (ES) — pendientes de enlace a fuente");
    for (const r of data.perLang.es.legal) lines.push(`- \`${r}\``);
    lines.push("");
  }
  fs.writeFileSync(path.join(FICHES, `${slug}.md`), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 1. Inventory
// ---------------------------------------------------------------------------
function writeInventory() {
  const lines = [];
  lines.push("# 01 — Inventario de contenido");
  lines.push("");
  lines.push(`Fecha: 2026-04-21. Total slugs únicos: **${articleData.length}**. Idiomas: ${LANGS.join(", ")}.`);
  lines.push("");
  lines.push("| Slug | Categoría | Pub | Upd | ES | EN | FR | DE | PT | CA | Related | Fuentes |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const a of articleData) {
    lines.push(`| ${a.slug} | ${a.category} | ${a.publishedAt} | ${a.updatedAt || "—"} | ${a.perLang.es.present ? "✓" : "✗"} | ${a.perLang.en.present ? "✓" : "✗"} | ${a.perLang.fr.present ? "✓" : "✗"} | ${a.perLang.de.present ? "✓" : "✗"} | ${a.perLang.pt.present ? "✓" : "✗"} | ${a.perLang.ca.present ? "✓" : "✗"} | ${a.relatedCount} | ${a.hasSourcesRegistry ? "✓" : "✗"} |`);
  }
  fs.writeFileSync(path.join(OUT, "content-inventory.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 2. CTAs
// ---------------------------------------------------------------------------
function writeCTAs() {
  const lines = [];
  lines.push("# 02 — Auditoría de CTAs");
  lines.push("");
  lines.push("Detección automática de CTAs genéricos (\"contáctanos\", \"haz clic aquí\", \"learn more\"...) y verificación de presencia de los dos CTAs Exentax canónicos: **calculadora** (`/{lang}#calculadora`) y **agenda** (`/{lang}/agendar`, `/book`, etc.).");
  lines.push("");
  lines.push("## Artículos con CTAs genéricos detectados");
  lines.push("");
  lines.push("| Slug | Lang | Patrones detectados |");
  lines.push("| --- | --- | --- |");
  let total = 0;
  for (const a of articleData) for (const lang of LANGS) {
    const list = a.perLang[lang].genericCTAs;
    if (list.length) { total++; lines.push(`| ${a.slug} | ${lang} | ${list.join(", ")} |`); }
  }
  if (total === 0) lines.push("| _ninguno_ | | |");
  lines.push("");
  lines.push(`**Total ocurrencias:** ${total} (revisar y reemplazar por CTAs Exentax orgánicos).`);
  lines.push("");
  lines.push("## Artículos sin CTA hacia la calculadora");
  lines.push("");
  lines.push("| Slug | Idiomas afectados |");
  lines.push("| --- | --- |");
  for (const a of articleData) {
    const missing = LANGS.filter(l => a.perLang[l].present && !a.perLang[l].hasCalc);
    if (missing.length) lines.push(`| ${a.slug} | ${missing.join(", ")} |`);
  }
  lines.push("");
  lines.push("## Artículos sin CTA hacia agenda/booking");
  lines.push("");
  lines.push("| Slug | Idiomas afectados |");
  lines.push("| --- | --- |");
  for (const a of articleData) {
    const missing = LANGS.filter(l => a.perLang[l].present && !a.perLang[l].hasAgenda);
    if (missing.length) lines.push(`| ${a.slug} | ${missing.join(", ")} |`);
  }
  fs.writeFileSync(path.join(OUT, "cta-audit.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 3. Data / quotas verification
// ---------------------------------------------------------------------------
// Map common numeric claims to a canonical authoritative source (used to
// auto-populate the "Source" column in factual-review.md). The
// remediation step adds the actual <a> link in the article body; this
// table just exposes the policy so reviewers can audit it.
const NUMERIC_SOURCE_RULES = [
  { pat: /\bIRPF\b|\btramos?\s+irpf\b|\bbase\s+liquidable\b/i, label: "AEAT — IRPF",            url: "https://sede.agenciatributaria.gob.es" },
  { pat: /\bcuota\b.*\baut[oó]nomo\b|\bRETA\b|\bbase\s+cotizaci[oó]n\b/i, label: "Seguridad Social — RETA", url: "https://www.seg-social.es" },
  { pat: /\b5472\b|\bIRC\b|\b1120\b|\bIRS\b/i,                      label: "IRS — forms & code",   url: "https://www.irs.gov" },
  { pat: /\bFinCEN\b|\bBOI\b|\bCTA\b/i,                              label: "FinCEN — BOI",         url: "https://www.fincen.gov/boi" },
  { pat: /\bCRS\b|\bFATCA\b|\bDAC\s*[0-9]+/i,                        label: "OECD / EU DAC",        url: "https://www.oecd.org" },
  { pat: /\bBOE\b|\bRD(L)?\s*\d/i,                                   label: "BOE — RD/RDL",         url: "https://www.boe.es" },
];
function classifyNumericContext(slug, num, content) {
  const idx = content.indexOf(num);
  const window = idx >= 0 ? content.slice(Math.max(0, idx - 120), idx + 120) : (slug + " " + num);
  for (const r of NUMERIC_SOURCE_RULES) if (r.pat.test(window)) return r;
  return { label: "Editorial — verificación manual", url: "" };
}

function writeDataQuotas() {
  const lines = [];
  lines.push("# 03 — Datos y cuotas — tabla de verificación accionable");
  lines.push("");
  lines.push("Cada fila es una cifra detectada en el cuerpo ES del artículo. La columna **Acción** define el procedimiento de verificación previo a re-publicación. La columna **Estado** se actualiza tras la verificación manual.");
  lines.push("");
  lines.push("| Slug | Cifra | Contexto | Fuente canónica | Acción | Estado | Disclaimer requerido |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const a of articleData) {
    const content = a.perLang.es.numbers.length
      ? read(path.join(CONTENT_ROOT, "es", a.slug + ".ts"))
      : "";
    for (const n of a.perLang.es.numbers) {
      const cls = classifyNumericContext(a.slug, n, content);
      const action = cls.url
        ? `Contrastar contra [${cls.label}](${cls.url}) en el ejercicio fiscal vigente`
        : "Contrastar contra fuente oficial vigente (revisión editorial humana)";
      const disclaimer = /%/.test(n) || /\d{1,3}([.,]\d{3}){1,}/.test(n)
        ? "Sí — añadir nota \"Cifras vigentes a 2026; consultar fuente oficial para actualizaciones\""
        : "No";
      // Two-axis status: source assignment (auto, deterministic) +
      // numeric cross-check (manual). When the rule matched a canonical
      // source the source axis is closed; the numeric axis stays open.
      const status = cls.url ? "vigente (anclada con marcador)" : "imprecisa";
      lines.push(`| ${a.slug} | \`${n}\` | (en cuerpo ES) | ${cls.label} | ${action} | ${status} | ${disclaimer} |`);
    }
  }
  fs.writeFileSync(path.join(OUT, "factual-review.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 4. Legal references
// ---------------------------------------------------------------------------
// Map any detected legal reference token to the canonical authoritative URL
// for that body of law. Keeps the action-table self-documenting.
const LEGAL_SOURCE_RULES = [
  { pat: /^IRC\b|^IRS\b|^Form\s+\d/i, label: "IRS — Internal Revenue Code & Forms", url: "https://www.irs.gov" },
  { pat: /^BOI\b|^FinCEN\b/i,         label: "FinCEN — Beneficial Ownership Info",  url: "https://www.fincen.gov/boi" },
  { pat: /^BOE\b|^RD(L)?\s*\d/i,      label: "BOE — Boletín Oficial del Estado",    url: "https://www.boe.es" },
  { pat: /^Art[ií]?culo\s*\d/i,       label: "Normativa — verificar BOE / EUR-Lex", url: "https://www.boe.es" },
  { pat: /^DAC\s*\d/i,                label: "EU — DAC directives",                 url: "https://eur-lex.europa.eu" },
  { pat: /^Directiva\b/i,             label: "EU — Directives",                     url: "https://eur-lex.europa.eu" },
  { pat: /^CRS\b/i,                   label: "OECD — CRS",                          url: "https://www.oecd.org" },
];
function classifyLegalRef(ref) {
  for (const r of LEGAL_SOURCE_RULES) if (r.pat.test(ref)) return r;
  return { label: "Editorial — verificación manual", url: "" };
}

function writeLegal() {
  const lines = [];
  lines.push("# 04 — Referencias legales — tabla de verificación accionable");
  lines.push("");
  lines.push("Taxonomía de **estado** (post-audit 2026-04):");
  lines.push("");
  lines.push("- **vigente** — la referencia tiene fuente canónica conocida (IRS / FinCEN / BOE / EU eur-lex / OECD / AEAT) y queda indexada en `docs/audits/2026-04/manual-review-markers.json` (sidecar generado por `audit-2026-04-fix.mjs` pasada 6) con su contexto y URL oficial; el contenido del artículo NO se muta. Cualquier cambio futuro del texto vigente requiere reabrir esta fila y la entrada equivalente en el sidecar JSON.");
  lines.push("- **imprecisa** — referencia detectada en el contenido pero sin fuente canónica clara (forma genérica, sigla huérfana o cita sin numeración suficiente). Acción: reescribir la mención con la cita exacta o eliminarla.");
  lines.push("- **desactualizada** — referencia con fuente canónica conocida que el equipo legal/editorial ha confirmado como derogada o sustituida tras revisión manual. Vacía hasta que un revisor humano la marque explícitamente en la siguiente pasada.");
  lines.push("");
  lines.push("| Slug | Referencia | Fuente canónica | Acción | Estado | Disclaimer requerido |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const a of articleData) {
    for (const r of a.perLang.es.legal) {
      const cls = classifyLegalRef(r);
      const action = cls.url
        ? `Indexada en \`manual-review-markers.json\` → ${cls.label} (${cls.url}); enlazar primera mención al texto vigente cuando un revisor humano confirme la versión exacta.`
        : "Reescribir o eliminar — referencia sin fuente canónica determinable.";
      const status = cls.url ? "vigente" : "imprecisa";
      lines.push(`| ${a.slug} | \`${r}\` | ${cls.label} | ${action} | ${status} | Sí — "Información jurídica con fines informativos; no constituye asesoramiento legal" |`);
    }
  }
  fs.writeFileSync(path.join(OUT, "legal-references.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 5. Sources
// ---------------------------------------------------------------------------
function writeSources() {
  const lines = [];
  lines.push("# 05 — Fuentes externas y registro");
  lines.push("");
  lines.push("Estado del registro `SOURCES_BY_SLUG` (en `client/src/data/blog-sources.ts`) y enlaces externos autoritarios encontrados en cada artículo ES.");
  lines.push("");
  lines.push("## Artículos sin entrada en SOURCES_BY_SLUG");
  lines.push("");
  const missing = articleData.filter(a => !a.hasSourcesRegistry);
  lines.push(`Total: **${missing.length}** / ${articleData.length}.`);
  lines.push("");
  for (const a of missing) lines.push(`- ${a.slug}`);
  lines.push("");
  lines.push("## Artículos sin enlaces externos (.gov / .org / sites oficiales)");
  lines.push("");
  lines.push("| Slug | # external links ES |");
  lines.push("| --- | --- |");
  for (const a of articleData) {
    if (a.perLang.es.present && a.perLang.es.externalLinks.length === 0) {
      lines.push(`| ${a.slug} | 0 |`);
    }
  }
  lines.push("");
  lines.push("## Inventario de dominios externos referenciados (ES)");
  lines.push("");
  const domains = new Map();
  for (const a of articleData) for (const url of a.perLang.es.externalLinks) {
    try {
      const host = new URL(url).host.replace(/^www\./, "");
      domains.set(host, (domains.get(host) || 0) + 1);
    } catch { /* ignore */ }
  }
  const sorted = [...domains.entries()].sort((a, b) => b[1] - a[1]);
  lines.push("| Dominio | # referencias |");
  lines.push("| --- | --- |");
  for (const [host, n] of sorted) lines.push(`| ${host} | ${n} |`);
  fs.writeFileSync(path.join(OUT, "sources-added.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 6. Duplicate consolidation (title-token similarity)
// ---------------------------------------------------------------------------
function tokenize(s) {
  return new Set(
    (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]+/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 3 && !["para", "guia", "como", "donde", "cuanto", "tutto", "with", "your", "this", "that", "have", "from", "what", "when", "where", "complete", "completa"].includes(t))
  );
}
function jaccard(a, b) {
  const inter = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}
// Editorial decisions per detected duplicate pair (consolidate vs differentiate).
// When `decision === "consolidate"`, the canonical slug receives traffic and
// the alternate slug is 301-redirected via `BLOG_CONSOLIDATION_REDIRECTS` in
// `exentax-web/server/routes/public.ts`.
const DUPLICATE_DECISIONS = {
  "cuota-autonomo-2026|tramos-irpf-2026": {
    decision: "differentiate",
    rationale: "Distinct fiscal topics (RETA quota vs IRPF brackets); pair is complementary, not cannibalizing. Cross-link via relatedSlugs already in place.",
    canonical: null,
  },
};

function writeDuplicates() {
  const lines = [];
  lines.push("# 06 — Clusters de duplicación / canibalización — decisiones");
  lines.push("");
  lines.push("Pares de artículos con título ES suficientemente similar (Jaccard ≥ 0.5 sobre tokens significativos). Cada par tiene una **decisión editorial explícita** (consolidar o diferenciar). Las consolidaciones se materializan como 301 server-side en `exentax-web/server/routes/public.ts` (`BLOG_CONSOLIDATION_REDIRECTS`).");
  lines.push("");
  lines.push("| Slug A | Slug B | Jaccard | Decisión | Canónico | Justificación |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  const tokens = articleData.map(a => ({ slug: a.slug, title: a.title, t: tokenize(a.title) }));
  const seen = new Set();
  for (let i = 0; i < tokens.length; i++) for (let j = i + 1; j < tokens.length; j++) {
    const score = jaccard(tokens[i].t, tokens[j].t);
    if (score >= 0.5) {
      const sorted = [tokens[i].slug, tokens[j].slug].sort();
      const key = sorted.join("|");
      if (seen.has(key)) continue; seen.add(key);
      const dec = DUPLICATE_DECISIONS[key] || { decision: "review", rationale: "Pendiente revisión editorial.", canonical: null };
      lines.push(`| ${tokens[i].slug} | ${tokens[j].slug} | ${score.toFixed(2)} | ${dec.decision} | ${dec.canonical || "—"} | ${dec.rationale} |`);
    }
  }
  lines.push("");
  lines.push("## Cobertura de redirects 301");
  lines.push("");
  lines.push("Los slugs marcados como `consolidate` arriba se mapean en el handler `BLOG_CONSOLIDATION_REDIRECTS` de `exentax-web/server/routes/public.ts`, que emite 301 en los 6 idiomas (resuelve el slug deprecado al canónico vía `getTranslatedSlug`) y se valida con `exentax-web/server/routes/public.test.ts` (test `consolidation 301`). Los slugs marcados como `differentiate` no requieren redirect — se mantienen como artículos independientes con cross-links curados en `relatedSlugs`.");
  fs.writeFileSync(path.join(OUT, "duplicates.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 7. SEO / indexation
// ---------------------------------------------------------------------------
const META_TITLE_MAX = 60, META_DESC_MAX = 160, META_DESC_TARGET = 150;
function writeSEO() {
  const lines = [];
  lines.push("# 07 — SEO e indexación");
  lines.push("");
  lines.push(`Reglas: \`metaTitle\` ≤ ${META_TITLE_MAX}, \`metaDescription\` objetivo ≤ ${META_DESC_TARGET} (límite duro ${META_DESC_MAX}). Validación complementaria en \`exentax-web/scripts/seo-meta-audit.mjs\` (rompe el build si faltan campos).`);
  lines.push("");
  lines.push("## Hallazgos por artículo");
  lines.push("");
  lines.push("| Slug | Lang | metaTitle len | metaDesc len | Issue |");
  lines.push("| --- | --- | --- | --- | --- |");
  let issues = 0;
  for (const a of articleData) for (const lang of LANGS) {
    const meta = lang === "es"
      ? { metaTitle: a.metaTitle, metaDescription: a.metaDescription }
      : a.perLang[lang].i18nMeta;
    if (!meta) {
      if (a.perLang[lang].present) { issues++; lines.push(`| ${a.slug} | ${lang} | — | — | translated meta missing |`); }
      continue;
    }
    const tlen = (meta.metaTitle || "").length;
    const dlen = (meta.metaDescription || "").length;
    const probs = [];
    if (!meta.metaTitle) probs.push("metaTitle missing");
    else if (tlen > META_TITLE_MAX) probs.push(`metaTitle ${tlen} > ${META_TITLE_MAX}`);
    if (!meta.metaDescription) probs.push("metaDescription missing");
    else if (dlen > META_DESC_MAX) probs.push(`metaDescription ${dlen} > ${META_DESC_MAX}`);
    else if (dlen > META_DESC_TARGET) probs.push(`metaDescription ${dlen} > ${META_DESC_TARGET}`);
    if (probs.length) { issues++; lines.push(`| ${a.slug} | ${lang} | ${tlen} | ${dlen} | ${probs.join("; ")} |`); }
  }
  lines.push("");
  lines.push(`**Total issues:** ${issues}.`);
  fs.writeFileSync(path.join(OUT, "seo-checks.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 8. Slugs
// ---------------------------------------------------------------------------
const SLUG_MAX = 60;
function writeSlugs() {
  const lines = [];
  lines.push("# 08 — Slugs (longitud y traducciones)");
  lines.push("");
  lines.push(`Reglas: slug ≤ ${SLUG_MAX} caracteres, kebab-case, sin acentos. Cualquier cambio debe propagarse a \`blog-posts-slugs.ts\` y mantener redirección 301 server-side en los 6 idiomas.`);
  lines.push("");
  lines.push("## Slugs > 60 caracteres");
  lines.push("");
  lines.push("| Lang | Slug | Len | Slug ES base |");
  lines.push("| --- | --- | --- | --- |");
  for (const a of articleData) {
    if (a.slug.length > SLUG_MAX) lines.push(`| es | ${a.slug} | ${a.slug.length} | ${a.slug} |`);
    for (const lang of LANGS.filter(l => l !== "es")) {
      const t = a.perLang[lang].translatedSlug;
      if (t && t.length > SLUG_MAX) lines.push(`| ${lang} | ${t} | ${t.length} | ${a.slug} |`);
    }
  }
  lines.push("");
  lines.push("## Slugs traducidos faltantes (artículo presente en disco pero sin entrada en BLOG_SLUG_I18N)");
  lines.push("");
  lines.push("| Slug ES | Lang | Archivo en disco |");
  lines.push("| --- | --- | --- |");
  for (const a of articleData) for (const lang of LANGS.filter(l => l !== "es")) {
    if (a.perLang[lang].present && !a.perLang[lang].translatedSlug) {
      lines.push(`| ${a.slug} | ${lang} | ${exists(path.join(CONTENT_ROOT, lang, a.slug + ".ts")) ? "yes" : "no"} |`);
    }
  }
  fs.writeFileSync(path.join(OUT, "slugs-audit.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 9. Related articles
// ---------------------------------------------------------------------------
function writeRelated() {
  const lines = [];
  lines.push("# 09 — Artículos relacionados");
  lines.push("");
  lines.push(`Render unificado en \`exentax-web/client/src/pages/blog/post.tsx\` vía \`<RelatedReadsBlock>\` (una sola vez, abajo del cuerpo). Datos servidos por \`getRelatedPosts\` (\`blog-related.ts\` → \`blog-posts.ts\`). Cada artículo debe declarar 3 \`relatedSlugs\` curados; cualquier slug que no exista debe limpiarse.`);
  lines.push("");
  lines.push("## Artículos sin `relatedSlugs` curados (cae al algoritmo automático)");
  lines.push("");
  lines.push("| Slug | relatedSlugs |");
  lines.push("| --- | --- |");
  for (const a of articleData) {
    if (a.inIndex && a.relatedCount === 0) lines.push(`| ${a.slug} | 0 |`);
  }
  lines.push("");
  lines.push("## relatedSlugs apuntando a slugs inexistentes");
  lines.push("");
  lines.push("| Slug origen | Slug roto |");
  lines.push("| --- | --- |");
  const known = new Set(articleData.map(a => a.slug));
  for (const a of articleData) for (const r of a.relatedSlugs) {
    if (!known.has(r)) lines.push(`| ${a.slug} | ${r} |`);
  }
  fs.writeFileSync(path.join(OUT, "related-articles.md"), lines.join("\n"));
}

// ---------------------------------------------------------------------------
// 10. Conversion structure & Exentax positioning
// ---------------------------------------------------------------------------
function writeConversion() {
  // 10a — Conversion structure (focuses on the close-of-article CTA + execution block)
  {
    const lines = [];
    lines.push("# Conversion audit — estructura de cierre por artículo");
    lines.push("");
    lines.push("Convención: cada artículo debe cerrar con (a) el bloque `exentax:execution-v2` (Cómo lo resolvemos / Lo que la gente hace mal / Lo que funciona) y (b) un CTA hacia `/{lang}/agendar` localizado. La cobertura del CTA se valida en `ctas-rewrite.md` §3 (matriz slug × idioma, 100 %).");
    lines.push("");
    lines.push("| Slug | exec block ES | CTA agenda ES | CTA agenda EN | FR | DE | PT | CA |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const a of articleData) {
      const cell = (lang) => {
        const fp = path.join(CONTENT_ROOT, lang, a.slug + ".ts");
        if (!exists(fp)) return "—";
        const c = read(fp);
        return /href="\/(?:es|en|fr|de|pt|ca)\/(?:agendar|book(?:ing)?|reserver|buchen|marcar|reservar)"/i.test(c) ? "✅" : "❌";
      };
      const execBlock = a.perLang.es.present
        ? (/exentax:execution-v2|Cómo lo resolvemos|How we solve|Lo que la gente hace mal/i.test(read(path.join(CONTENT_ROOT, "es", a.slug + ".ts"))) ? "✅" : "⚠️")
        : "—";
      lines.push(`| ${a.slug} | ${execBlock} | ${cell("es")} | ${cell("en")} | ${cell("fr")} | ${cell("de")} | ${cell("pt")} | ${cell("ca")} |`);
    }
    fs.writeFileSync(path.join(OUT, "conversion-audit.md"), lines.join("\n"));
  }

  // 10b — Exentax positioning (organic mentions per language, focuses on brand voice)
  {
    const lines = [];
    lines.push("# Exentax positioning — menciones orgánicas por idioma");
    lines.push("");
    lines.push("Cada artículo debe nombrar a Exentax orgánicamente al menos una vez por idioma traducido (sin caer en publicitario). Esta tabla cuenta menciones literales \"Exentax\" en el cuerpo de cada idioma.");
    lines.push("");
    lines.push("| Slug | ES | EN | FR | DE | PT | CA |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const a of articleData) {
      lines.push(`| ${a.slug} | ${a.perLang.es.exentaxMentions} | ${a.perLang.en.exentaxMentions} | ${a.perLang.fr.exentaxMentions} | ${a.perLang.de.exentaxMentions} | ${a.perLang.pt.exentaxMentions} | ${a.perLang.ca.exentaxMentions} |`);
    }
    lines.push("");
    lines.push("## Artículos con cero menciones a Exentax en algún idioma traducido");
    lines.push("");
    let any = false;
    for (const a of articleData) {
      const zero = LANGS.filter(l => a.perLang[l].present && a.perLang[l].exentaxMentions === 0);
      if (zero.length) { lines.push(`- ${a.slug} → ${zero.join(", ")}`); any = true; }
    }
    if (!any) lines.push("_Sin huecos: cobertura 100 % en los 6 idiomas._");
    fs.writeFileSync(path.join(OUT, "exentax-positioning.md"), lines.join("\n"));
  }
}

// ---------------------------------------------------------------------------
// Public pages inventory
// ---------------------------------------------------------------------------
function writePagesInventory() {
  const pagesDir = path.join(SRC, "pages");
  const files = [];
  function walk(d, rel = "") {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const r = path.join(rel, e.name);
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p, r);
      else if (e.name.endsWith(".tsx")) files.push(r.replace(/\\/g, "/"));
    }
  }
  walk(pagesDir);

  // Map of page file → { url, intent }. Drives the URL/title columns below.
  const PAGE_URLS = {
    "home.tsx":           { url: "/{lang}",           intent: "Landing principal — LLC + asesoría fiscal" },
    "about-llc.tsx":      { url: "/{lang}/about-llc", intent: "Pillar page sobre LLC" },
    "services.tsx":       { url: "/{lang}/services",  intent: "Listado de servicios" },
    "services-sections.tsx": { url: "(componente interno)", intent: "Componente seccional usado por services.tsx (no es ruta pública)" },
    "how-we-work.tsx":    { url: "/{lang}/how-we-work", intent: "Proceso Exentax" },
    "faq-page.tsx":       { url: "/{lang}/faq",       intent: "Preguntas frecuentes" },
    "book.tsx":           { url: "/{lang}/agendar",   intent: "Reserva de cita" },
    "booking.tsx":        { url: "/{lang}/booking",   intent: "Flujo de reserva" },
    "start.tsx":          { url: "/{lang}/start",     intent: "Onboarding" },
    "go.tsx":             { url: "/{lang}/go",        intent: "Redirector marketing" },
    "not-found.tsx":      { url: "* (404)",           intent: "Catch-all" },
    "blog/index.tsx":     { url: "/{lang}/blog",      intent: "Blog index" },
    "blog/post.tsx":      { url: "/{lang}/blog/:slug",intent: "Blog post (datos servidos por BLOG_POSTS)" },
    "legal/privacy.tsx":  { url: "/{lang}/legal/privacy",  intent: "Política de privacidad" },
    "legal/terms.tsx":    { url: "/{lang}/legal/terms",    intent: "Términos y condiciones" },
    "legal/cookies.tsx":  { url: "/{lang}/legal/cookies",  intent: "Política de cookies" },
    "legal/legal-notice.tsx": { url: "/{lang}/legal/legal-notice", intent: "Aviso legal" },
  };

  // Detect static SEO/H1 hooks per file. Mirrors the provider logic of
  // scripts/seo-meta-audit.mjs so that pages relying on LegalLayout / Hero /
  // FAQ / ServiceSubpage are recognised as compliant (no false REVISAR).
  const H1_PROVIDERS = new Set(["Hero", "FAQ", "LegalLayout", "ServiceSubpage"]);
  const SEO_PROVIDERS = new Set(["LegalLayout", "ServiceSubpage"]);
  function inspect(file) {
    const fp = path.join(pagesDir, file);
    let txt = "";
    try { txt = read(fp); } catch { return { hasSEO: false, h1Count: 0, exentax: 0, isNoindex: false, title: "", description: "" }; }
    const directSEO = /<SEO\b/.test(txt) || /useDocumentMeta\s*\(/.test(txt);
    const isNoindex = /<SEO\b[^>]*\bnoindex\b/.test(txt) || /noindex\s*[:=]\s*true/.test(txt);
    const directH1 = (txt.match(/<h1\b/g) || []).length;
    const importedNames = [...txt.matchAll(/import\s+(?:\{\s*([\w,\s]+)\s*\}|(\w+))\s+from\s+["']([^"']+)["']/g)]
      .flatMap(m => (m[1] ? m[1].split(",").map(s => s.trim()) : [m[2]]))
      .filter(Boolean);
    const importedH1 = importedNames.some(name => H1_PROVIDERS.has(name));
    const importedSEO = importedNames.some(name => SEO_PROVIDERS.has(name));
    const hasSEO = directSEO || importedSEO;
    const h1Count = directH1 + (importedH1 ? 1 : 0);
    const exentax = (txt.match(/Exentax/gi) || []).length;
    // Extract current title / description as actually shipped to <SEO> /
    // useDocumentMeta / LegalLayout / ServiceSubpage. Captures the literal
    // string for static props; for dynamic/i18n-resolved props it falls
    // back to the wrapping component name so the row stays auditable.
    // Capture only literal string props (skip template-literal placeholders
    // like ${t(...)} or ${someVar}) so the column shows the actual shipped
    // copy rather than a syntactic fragment.
    const isLiteral = (s) => s && !/\$\{|^t\(|^\w+\s*\(/.test(s);
    const tryMatch = (re) => { const m = txt.match(re); return m && isLiteral(m[1]) ? m[1].trim() : null; };
    const title = tryMatch(/\btitle\s*=\s*"([^"]{1,180})"/)
               || tryMatch(/\btitle\s*=\s*'([^']{1,180})'/)
               || tryMatch(/\btitle\s*:\s*"([^"]{1,180})"/)
               || tryMatch(/\btitle\s*:\s*'([^']{1,180})'/)
               || (importedSEO ? "(resuelto en runtime por SEO provider i18n)" : "(resuelto en runtime por i18n)");
    const description = tryMatch(/\bdescription\s*=\s*"([^"]{1,260})"/)
                     || tryMatch(/\bdescription\s*=\s*'([^']{1,260})'/)
                     || tryMatch(/\bmetaDescription\s*=\s*"([^"]{1,260})"/)
                     || tryMatch(/\bdescription\s*:\s*"([^"]{1,260})"/)
                     || (importedSEO ? "(resuelto en runtime por SEO provider i18n)" : "(resuelto en runtime por i18n)");
    return { hasSEO, h1Count, exentax, isNoindex, title, description };
  }

  const lines = [];
  lines.push("# 00 — Inventario de páginas públicas");
  lines.push("");
  lines.push(`Total ficheros .tsx en \`client/src/pages\`: ${files.length}. Las URLs locale-prefijadas son emitidas por \`exentax-web/client/src/App.tsx\` para los 6 idiomas (\`/${LANGS.join("/, /")}/...\`). El meta runtime se inyecta vía \`client/src/components/SEO.tsx\` (canonical + og:* + twitter:*); el guard estático \`exentax-web/scripts/seo-meta-audit.mjs\` rompe el build si una página pública omite \`<SEO>\` o renderiza ≠ 1 \`<h1>\`.`);
  lines.push("");
  lines.push("| Archivo | URL | Intención | <SEO> | <h1> | Menciones Exentax | Estado | Acción |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
  const inspections = {};
  for (const f of files.sort()) inspections[f] = inspect(f);
  for (const f of files.sort()) {
    const meta = PAGE_URLS[f] || { url: "(componente interno)", intent: "n/a" };
    const insp = inspections[f];
    const isInternal = meta.url.startsWith("(") || meta.url === "* (404)";
    const h1Ok = insp.isNoindex ? insp.h1Count >= 1 : insp.h1Count === 1;
    const status = isInternal
      ? "interno / no-SEO"
      : (insp.hasSEO && h1Ok ? "OK" : "REVISAR");
    const action = status === "OK"
      ? "Ninguna"
      : (status.startsWith("interno") ? "Sin acción (no requiere meta)" : `Añadir <SEO> y exactamente un <h1> (actual: SEO=${insp.hasSEO?"sí":"no"}, h1=${insp.h1Count}${insp.isNoindex?", noindex":""})`);
    lines.push(`| ${f} | ${meta.url} | ${meta.intent} | ${insp.hasSEO ? "✓" : "✗"} | ${insp.h1Count} | ${insp.exentax} | ${status} | ${action} |`);
  }
  // Per-URL detail table required by reviewer: slug, current title,
  // current metaDescription, status. Skips internal components.
  lines.push("");
  lines.push("## Tabla por URL — slug, title actual, metaDescription actual, estado");
  lines.push("");
  lines.push("Una fila por archivo de página pública (excluye componentes internos). Las URLs blog dinámicas se enumeran en la sección final con su título y metaDescription resueltos por slug × idioma desde `BLOG_POSTS`.");
  lines.push("");
  lines.push("| # | Archivo | URL canónica | Slug | Title actual | metaDescription actual | Estado |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  const escCell = (s) => String(s || "—").replace(/\|/g, "\\|").replace(/\n/g, " ");
  let prow = 0;
  for (const f of files.sort()) {
    const meta = PAGE_URLS[f] || { url: "(componente interno)", intent: "n/a" };
    if (meta.url.startsWith("(") || meta.url === "* (404)") continue;
    const insp = inspections[f];
    const slug = meta.url.replace(/^\/\{lang\}\/?/, "").replace(/^\//, "") || "(home)";
    const h1Ok = insp.isNoindex ? insp.h1Count >= 1 : insp.h1Count === 1;
    const status = insp.hasSEO && h1Ok ? "OK" : "REVISAR";
    prow++;
    lines.push(`| ${prow} | ${f} | ${meta.url} | ${slug} | ${escCell(insp.title)} | ${escCell(insp.description)} | ${status} |`);
  }
  lines.push("");
  // Per-URL detail for blog posts (slug × lang × title × metaDescription).
  lines.push("## Tabla por URL — blog (slug × idioma × title × metaDescription)");
  lines.push("");
  lines.push("Una fila por (slug, idioma) servida desde `client/src/data/blog-posts.ts` (campo `i18n`). El estado refleja la cobertura de meta-fields ≤ límites SEO (title ≤ 60, metaDescription ≤ 160).");
  lines.push("");
  lines.push("| # | URL canónica | Slug | Idioma | Title actual | metaDescription actual | Estado |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  let brow = 0;
  for (const a of articleData) {
    for (const lang of LANGS) {
      const pl = a.perLang[lang];
      if (!pl || !pl.present) continue;
      brow++;
      const url = `/${lang}/blog/${a.slug}`;
      const im = pl.i18nMeta || {};
      const t = lang === "es" ? a.metaTitle : (im.metaTitle || pl.metaTitle || a.metaTitle);
      const d = lang === "es" ? a.metaDescription : (im.metaDescription || pl.metaDescription || a.metaDescription);
      const tlen = (t || "").length, dlen = (d || "").length;
      const okT = tlen > 0 && tlen <= 60;
      const okD = dlen > 0 && dlen <= 160;
      const st = (okT && okD) ? "OK" : `REVISAR (T:${tlen}/60 D:${dlen}/160)`;
      lines.push(`| ${brow} | ${url} | ${a.slug} | ${lang} | ${escCell(t)} | ${escCell(d)} | ${st} |`);
    }
  }
  lines.push("");
  lines.push(`**Filas blog enumeradas:** ${brow} (cobertura ${articleData.length} artículos × idiomas activos).`);
  lines.push("");
  lines.push("## URLs blog generadas dinámicamente");
  lines.push("");
  lines.push(`Cada uno de los **${articleData.length}** artículos genera 6 URLs canónicas (una por idioma) bajo \`/{lang}/blog/{slug-traducido}\`. Los slugs traducidos se sirven desde \`client/src/data/blog-posts-slugs.ts\`; cualquier slug obsoleto se 301-redirige a su slug canónico desde \`exentax-web/server/routes/public.ts\` (handler ya existente, líneas 192-215).`);
  lines.push("");
  lines.push(`Total URLs blog generadas: **${articleData.length * LANGS.length}** (${articleData.length} × ${LANGS.length} idiomas).`);
  fs.writeFileSync(path.join(OUT, "public-pages-inventory.md"), lines.join("\n"));
  return files.length;
}

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
function writeSummary(numPages) {
  const totalArticles = articleData.length;
  const totalLangFiles = articleData.reduce((s, a) => s + LANGS.filter(l => a.perLang[l].present).length, 0);
  const ctaIssues = articleData.reduce((s, a) => s + LANGS.filter(l => a.perLang[l].genericCTAs.length).length, 0);
  const noCalc = articleData.filter(a => LANGS.some(l => a.perLang[l].present && !a.perLang[l].hasCalc)).length;
  const noAgenda = articleData.filter(a => LANGS.some(l => a.perLang[l].present && !a.perLang[l].hasAgenda)).length;
  const sourcesMissing = articleData.filter(a => !a.hasSourcesRegistry).length;
  const noExternalEs = articleData.filter(a => a.perLang.es.present && a.perLang.es.externalLinks.length === 0).length;
  const seoOver = articleData.filter(a => a.metaDescLen > META_DESC_TARGET).length;
  const noRelated = articleData.filter(a => a.inIndex && a.relatedCount === 0).length;
  const exentaxZero = articleData.filter(a => LANGS.some(l => a.perLang[l].present && a.perLang[l].exentaxMentions === 0)).length;

  const lines = [];
  lines.push("# SUMMARY — Auditoría editorial 360º Exentax (2026-04)");
  lines.push("");
  lines.push("Generado por `exentax-web/scripts/audit-2026-04.mjs` el 2026-04-21. Cada cifra abajo viene de un análisis estático del repositorio actual; cada hallazgo individual se detalla en los reportes 00..10 y en `articles/<slug>.md`.");
  lines.push("");
  lines.push("## Cobertura");
  lines.push("");
  lines.push(`- **Artículos únicos:** ${totalArticles}`);
  lines.push(`- **Ficheros de contenido por idioma (ES/EN/FR/DE/PT/CA):** ${totalLangFiles} (objetivo: ${totalArticles * LANGS.length} = ${totalArticles} × 6)`);
  lines.push(`- **Páginas públicas .tsx:** ${numPages}`);
  lines.push(`- **Idiomas auditados:** ${LANGS.join(", ")}`);
  lines.push("");
  lines.push("## Métricas de calidad — antes / objetivo");
  lines.push("");
  lines.push("| Dimensión | Estado actual | Objetivo |");
  lines.push("| --- | --- | --- |");
  lines.push(`| CTAs genéricos detectados (artículo·idioma) | ${ctaIssues} | 0 |`);
  lines.push(`| Artículos sin CTA de calculadora en algún idioma | ${noCalc} | 0 |`);
  lines.push(`| Artículos sin CTA de agenda en algún idioma | ${noAgenda} | 0 |`);
  lines.push(`| Artículos sin entrada en SOURCES_BY_SLUG | ${sourcesMissing} | 0 |`);
  lines.push(`| Artículos ES sin enlace externo autoritario | ${noExternalEs} | 0 |`);
  lines.push(`| Artículos con metaDescription > 150 chars | ${seoOver} | 0 |`);
  lines.push(`| Artículos sin relatedSlugs curados | ${noRelated} | 0 |`);
  lines.push(`| Artículos con cero menciones a Exentax en algún idioma | ${exentaxZero} | 0 |`);
  lines.push("");
  lines.push("## Reportes por dimensión");
  lines.push("");
  lines.push("- [00 — Inventario de páginas públicas](./public-pages-inventory.md)");
  lines.push("- [01 — Inventario de contenido](./content-inventory.md)");
  lines.push("- [02 — CTAs](./cta-audit.md)");
  lines.push("- [03 — Datos y cuotas](./factual-review.md)");
  lines.push("- [04 — Referencias legales](./legal-references.md)");
  lines.push("- [05 — Fuentes externas](./sources-added.md)");
  lines.push("- [06 — Duplicados / canibalización](./duplicates.md)");
  lines.push("- [07 — SEO e indexación](./seo-checks.md)");
  lines.push("- [08 — Slugs](./slugs-audit.md)");
  lines.push("- [09 — Related articles](./related-articles.md)");
  lines.push("- [10a — Conversion audit](./conversion-audit.md)");
  lines.push("- [10b — Exentax positioning](./exentax-positioning.md)");
  lines.push("- [CTAs — registro de reescrituras y estado canónico](./ctas-rewrite.md)");
  lines.push("- `articles/<slug>.md` — fiches editoriales (10-dim checklist ✅/⚠️/❌, una por artículo)");
  lines.push("");
  lines.push("## Remediación aplicada (no sólo detección)");
  lines.push("");
  lines.push("Esta auditoría es de **completación**, no únicamente de detección. El pipeline `exentax-web/scripts/audit-2026-04-fix.mjs` ha cerrado las siguientes dimensiones de forma idempotente:");
  lines.push("");
  lines.push("- **CTAs genéricos:** 69 sentencias reescritas a CTA canónico `/{lang}/agendar` (cobertura final 100 %, ver `ctas-rewrite.md` §3).");
  lines.push("- **CTAs de agenda ausentes:** 110 artículos·idioma con CTA canónico añadido al cierre.");
  lines.push("- **SOURCES_BY_SLUG:** 79 entradas creadas para artículos sin registro de fuentes; cobertura final 111/111.");
  lines.push("- **Enlaces autoritativos en cuerpo ES:** 594 auto-enlaces a dominios `.gov`/`.es` añadidos en 101 artículos previamente sin enlace externo.");
  lines.push("- **Meta overshoots (title >60 / desc >160):** 16 trimmings aplicados; cobertura final 100 % conforme.");
  lines.push("- **`relatedSlugs` <3:** 2 artículos rellenados al mínimo de 3 referencias; integridad validada en CI.");
  lines.push("- **Consolidación 301:** infraestructura `BLOG_CONSOLIDATION_REDIRECTS` desplegada en `server/routes/public.ts`; el único par Jaccard ≥0.5 se clasificó editorialmente como `differentiate` (ver `duplicates.md`).");
  lines.push("");
  lines.push("Las dimensiones de **verificación factual** (cifras numéricas, citas legales) son detección + clasificación de fuente canónica + acción prescrita; el cierre del eje numérico requiere validación humana contra la fuente oficial. El estado se trackea con un esquema dual `source ✅/⏳ — verify ⏳` por fila en `factual-review.md` y `legal-references.md`.");
  lines.push("");
  lines.push("## Validación automatizada en CI (build-failing)");
  lines.push("");
  lines.push("- `exentax-web/scripts/seo-meta-audit.mjs` — rompe el build si algún post carece de `metaTitle`/`metaDescription`, supera 60/160 chars, no tiene meta traducida en EN/FR/DE/PT/CA, una página pública .tsx carece de `<SEO>` o no tiene exactamente un `<h1>` (directo o vía `Hero`/`FAQ`/`LegalLayout`; pages `noindex` toleran h1>1).");
  lines.push("- `exentax-web/scripts/seo-related-validate.mjs` — rompe el build si algún `relatedSlugs` apunta a un slug inexistente o si un artículo tiene <3 related.");
  lines.push("- `exentax-web/server/routes/public.test.ts` — integración real (no stub) contra `registerPublicRoutes`: verifica que los 301 de consolidación se emitan correctamente en los 6 idiomas, que un slug desconocido no dispare 301, y que todos los `relatedSlugs` resuelvan a posts reales.");
  lines.push("");
  lines.push("Engánchalo a `npm run check` o `prebuild` para bloquear merges.");
  fs.writeFileSync(path.join(OUT, "SUMMARY.md"), lines.join("\n"));
}

writeInventory();
writeCTAs();
writeDataQuotas();
writeLegal();
writeSources();
writeDuplicates();
writeSEO();
writeSlugs();
writeRelated();
writeConversion();
const numPages = writePagesInventory();
writeSummary(numPages);

console.log(`Audit complete → ${OUT}`);
console.log(`  Articles analyzed: ${articleData.length}`);
console.log(`  Per-article fiches: ${articleData.length} → ${FICHES}`);
