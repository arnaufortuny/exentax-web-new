#!/usr/bin/env node
/*
 * blog-masterpiece-audit.mjs
 * ----------------------------------------------------------------------------
 * Task #38 — Audita las 606 piezas (101 slugs × 6 idiomas) del blog Exentax
 * contra las reglas v2 ("obra maestra") definidas en
 * `docs/seo/blog-editorial-rules-v2.md` y resumidas en `EDITORIAL_GUIDE.md §9`.
 *
 * No hace fail del pipeline. Genera dos reportes en `reports/seo/`:
 *   - baseline-606.json   →  detalle por slug × idioma
 *   - baseline-606.md     →  resumen humano (top issues, score medio por idioma)
 *
 * Reglas evaluadas (no duplica las de blog-content-lint.mjs):
 *
 *   1. v2-marker         → presencia de `<!-- exentax:execution-v2 -->` cerrado.
 *                          warning si ausente (tier-A/B excluidos del critical).
 *   2. calc-cta          → puntero a calculadora: marcador HTML O link inline
 *                          `/<lang>#calculadora|calculator`.
 *   3. min-length        → conteo de palabras del cuerpo. critical < 500,
 *                          warning < 800.
 *   4. year-in-prose     → años 2023..2039 en el body (excluye URLs / slugs).
 *                          warning por ocurrencia, critical si >= 3.
 *   5. sources-block     → `<!-- exentax:sources-v1 -->` cerrado con >= 3 URLs
 *                          primarias (irs/fincen/fdic/oecd/treasury/ec.europa/
 *                          boe/agenciatributaria).
 *   6. authority-block   → al menos uno de los 3 cierres "Lo que vemos /
 *                          Lo que la gente hace mal / Lo que funciona de verdad"
 *                          o equivalente por idioma.
 *
 * Uso:
 *   node scripts/blog-masterpiece-audit.mjs
 *   node scripts/blog-masterpiece-audit.mjs --strict  → exit 1 si score medio < 90
 * ----------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const CONTENT_DIR = join(REPO_DIR, "client", "src", "data", "blog-content");
const REPORT_DIR = join(REPO_DIR, "reports", "seo");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const STRICT = process.argv.includes("--strict");
const STRICT_THRESHOLD = 97;

// Rule weights — score sums to 100 when all rules pass.
const RULE_WEIGHTS = {
  "v2-marker": 25,
  "calc-cta": 15,
  "min-length": 20,
  "year-in-prose": 15,
  "sources-block": 15,
  "authority-block": 10,
};

const PRIMARY_SOURCE_HOSTS = [
  /\birs\.gov\b/i,
  /\bfincen\.gov\b/i,
  /\bfdic\.gov\b/i,
  /\boecd\.org\b/i,
  /\btreasury\.gov\b/i,
  /\bec\.europa\.eu\b/i,
  /\bboe\.es\b/i,
  /\bagenciatributaria\.gob\.es\b/i,
  /\bsec\.gov\b/i,
  /\bcftc\.gov\b/i,
];

const AUTHORITY_PATTERNS = [
  // ES
  /lo\s+que\s+vemos\s+(cada\s+)?(semana|d[ií]a)/i,
  /lo\s+que\s+la\s+gente\s+hace\s+mal/i,
  /lo\s+que\s+funciona\s+de\s+verdad/i,
  // EN
  /what\s+we\s+see\s+(every|each)\s+(week|day)/i,
  /what\s+people\s+get\s+wrong/i,
  /what\s+actually\s+works/i,
  // FR
  /ce\s+que\s+nous\s+voyons\s+chaque\s+semaine/i,
  /ce\s+que\s+les\s+gens\s+font\s+mal/i,
  /ce\s+qui\s+fonctionne\s+vraiment/i,
  // DE
  /was\s+wir\s+(jede|jeden)\s+(Woche|Tag)\s+sehen/i,
  /was\s+die\s+Leute\s+falsch\s+machen/i,
  /was\s+wirklich\s+funktioniert/i,
  // PT
  /o\s+que\s+vemos\s+(cada|todas?\s+as?)\s+semana/i,
  /o\s+que\s+as?\s+pessoas\s+fazem\s+mal/i,
  /o\s+que\s+funciona\s+de\s+verdade/i,
  // CA
  /el\s+que\s+veiem\s+cada\s+setmana/i,
  /el\s+que\s+la\s+gent\s+fa\s+malament/i,
  /el\s+que\s+funciona\s+de\s+veritat/i,
  // v2 anchors
  /m[eé]todo\s+exentax/i,
  /Exentax\s+method/i,
  /m[eé]thode\s+Exentax/i,
  /Exentax[- ]?Methode/i,
  /m[eé]todo\s+Exentax/i,
];

function listSlugs(lang) {
  const dir = join(CONTENT_DIR, lang);
  try {
    return readdirSync(dir)
      .filter((n) => n.endsWith(".ts"))
      .map((n) => n.replace(/\.ts$/, ""));
  } catch {
    return [];
  }
}

function extractBody(raw) {
  // Article files use `export default `…`;` template literals that may
  // contain escaped backticks (\`\`\` for code fences). A non-greedy
  // match would stop at the first inner backtick, undercounting words and
  // hiding year-in-prose violations. Greedy-match from the first backtick
  // to the closing `\`;` at the very end of the file.
  const m = raw.match(/`([\s\S]*)`\s*;\s*$/);
  return m ? m[1] : raw;
}

function countWords(text) {
  // Strip HTML tags + markdown link URLs (keep visible text), then count.
  const stripped = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*`_>]/g, " ");
  const words = stripped.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? [];
  return words.length;
}

function hasV2Marker(body) {
  return /<!--\s*exentax:execution-v2\s*-->/i.test(body) &&
         /<!--\s*\/\s*exentax:execution-v2\s*-->/i.test(body);
}

function hasCalcCta(body, lang) {
  if (/<!--\s*exentax:calc-cta-v1\s*-->/i.test(body)) return true;
  // Inline link patterns by lang
  const calcRx = new RegExp(`/${lang}#(calculadora|calculator|calc)`, "i");
  if (calcRx.test(body)) return true;
  // Generic mention with link to anchor
  if (/href="[^"]*#calculadora[^"]*"/i.test(body)) return true;
  if (/href="[^"]*#calculator[^"]*"/i.test(body)) return true;
  return false;
}

function findYearsInProse(body, slug = "") {
  // Strip URLs and HTML attributes first (slugs may contain -2026).
  let cleaned = body
    // Drop the editorial review-anchor block entirely. It is a transparency
    // aside that quotes article snippets verbatim for reviewer follow-up;
    // any year inside the quoted snippet is a *quote* of the body, not a
    // new editorial mention, and double-counting it would penalize content
    // that already passed the rule on the source line.
    .replace(/<!--\s*exentax:review-anchor-v1\s*-->[\s\S]*?<!--\s*\/\s*exentax:review-anchor-v1\s*-->/gi, " ")
    // Strip multi-line HTML comments (editorial annotations like
    // "<!-- ... fecha: 2026-04-21 -->" should not count as prose).
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/href="[^"]*"/g, " ")
    // Markdown links: [text](path) -> keep text only (paths often contain -2026 slugs).
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/<[^>]+>/g, " ");

  // Editorial rules v2 §3 prohibit *editorial* year mentions ("en 2026",
  // "actualizado 2026", "guía 2026") but not legal/regulatory citations.
  // Strip well-known legal-citation contexts so the audit only counts the
  // truly editorial usages of the year.
  const LEGAL_CONTEXTS = [
    // Spanish/Portuguese/Catalan: month + de + YEAR (legal dates)
    /\b(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|sept(?:iembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?|janeiro|fevereiro|março|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro|gener|febrer|març|abril|maig|juny|juliol|agost|setembre|octubre|novembre|desembre)\s+(?:de\s+)?(?:202[3-9]|203\d)\b/gi,
    // English: Month YEAR / of YEAR
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:of\s+)?(?:202[3-9]|203\d)\b/gi,
    // French: mois YEAR
    /\b(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(?:202[3-9]|203\d)\b/gi,
    // German: Monat YEAR
    /\b(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+(?:202[3-9]|203\d)\b/gi,
    // Spanish/Portuguese law refs: Ley/Lei X/YYYY, Orden ABC/###/YYYY, RD ###/YYYY
    /\b(?:Ley|Lei|Llei|Loi|Law|Gesetz|Orden|Ordem|Ordre|Ordnung|Order|Anordnung|Reglamento|Regulamento|Reglament|Règlement|Verordnung|RD|Real\s+Decreto|Royal\s+Decree|Decreto[- ]Lei|D[éeée]cret|Resoluci[oó]n|Resolu[çc][aã]o|Resolution|Beschluss|K[öo]nigliche[snr]?\s+Dekrets?|K[öo]niglichen\s+Dekret[es]?)\s+[A-ZÀ-Ý]{0,6}\/?[\d.]+\/(?:202[3-9]|203\d)\b/gi,
    // BOE / DOG / DOGC / EU Regulations / EUR-Lex (####/YYYY style)
    /\b(?:BOE-A|DOG-|DOGC-|Reg\.|Reglamento|Regulation|Directive|Directiva|Diretiva|Richtlinie)[\s\-]?[A-Z0-9\-]*\/?\d{1,4}\/(?:202[3-9]|203\d)\b/gi,
    // Directive/Regulation year-first format with optional (EU)/(UE) parens:
    // "Directive (EU) 2023/2226", "Reglamento UE 2023/1114", "EU-Richtlinie 2023/2226"
    /\b(?:EU-|UE-)?(?:Directive|Directiva|Diretiva|Richtlinie|Reglamento|Regulamento|Reglament|R[èe]glement|Verordnung|Regulation)\s*\(?\s*(?:UE|EU)?\s*\)?\s*(?:202[3-9]|203\d)\s*\/\s*\d+/gi,
    // Bare admin law refs: HFP/HAP/HAC/RD ABC/###/YYYY (e.g., "HFP/887/2023")
    /\b(?:HFP|HAP|HAC|RD|HFP[A-Z]*|EHA|AEAT)\/[\d.]+\/(?:202[3-9]|203\d)\b/gi,
    // Slash dates: dd/mm/YYYY, dd.mm.YYYY, dd-mm-YYYY (legal-style)
    /\b\d{1,2}[\.\/\-]\d{1,2}[\.\/\-](?:202[3-9]|203\d)\b/gi,
    // English day-month-year (no comma): "30 January 2024"
    /\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:202[3-9]|203\d)\b/gi,
    // German "1. Januar 2026", "26. Juli 2024"
    /\b\d{1,2}\.\s*(?:Januar|Februar|M[äa]rz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s+(?:202[3-9]|203\d)\b/gi,
    // FY YYYY / FY-YYYY / FY YYYY (no space)
    /\bFY[-\s]?(?:202[3-9]|203\d)\b/gi,
    // IRS forms / IRC § / CFR / U.S.C with year
    /(?:IRC|IRS|FinCEN|CFR|U\.S\.C\.|USC|Public\s+Law|PL)\s+[\w§\d.\-]+\s+(?:of\s+)?(?:202[3-9]|203\d)\b/gi,
    // "interim final rule of <month> YEAR", "ruling of YEAR", "rule of YEAR"
    /\b(?:rule|ruling|regla|règle|Regelung|regra|interim\s+final\s+rule|final\s+rule)\s+(?:of\s+)?\w*\s*(?:de\s+|of\s+|du\s+|von\s+|do\s+)?(?:202[3-9]|203\d)\b/gi,
    // "ejercicio fiscal YYYY" / "tax year YYYY" / "fiscal YYYY"
    /\b(?:ejercicio(?:\s+fiscal)?|fiscal\s+year|tax\s+year|exercice|Steuerjahr|exerc[ií]cio|exercici)\s+(?:202[3-9]|203\d)\b/gi,
    // §6038A / §5336 with YYYY
    /§\s*\d+[A-Z]?\s+(?:de\s+|of\s+)?(?:202[3-9]|203\d)\b/gi,
    // "1 de enero de YYYY", "January 1, YYYY"
    /\b\d{1,2}\s+de\s+\w+\s+de\s+(?:202[3-9]|203\d)\b/gi,
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:202[3-9]|203\d)\b/gi,
  ];
  for (const rx of LEGAL_CONTEXTS) cleaned = cleaned.replace(rx, " ");

  // Year-anchored slug: an article whose slug intrinsically targets a year
  // (e.g. "cuotas-autonomos-2026-guia-completa", "facturar-sin-ser-autonomo-alternativas-2026")
  // is allowed to mention that specific year editorially — the year is part
  // of the topic, not a stylistic violation. Other years still count.
  const slugYearMatch = String(slug).match(/-(202[3-9]|203\d)(?:-|$)/);
  if (slugYearMatch) {
    const slugYear = slugYearMatch[1];
    const slugYearRx = new RegExp(`\\b${slugYear}\\b`, "g");
    cleaned = cleaned.replace(slugYearRx, " ");
  }

  const matches = cleaned.match(/\b(202[3-9]|203\d)\b/g) ?? [];
  return matches.length;
}

// Parse SOURCES_BY_SLUG once: each slug maps to an array of {doc, section}
// refs. The blog post page renders these at runtime via renderSourcesBlockHtml,
// so a slug with >= 3 vetted refs counts as having a complete sources block
// from the reader perspective.
let SOURCES_BY_SLUG_INDEX = null;
// Count {doc: ...} occurrences inside a balanced [ ... ] array starting at startIdx
// (which must point to '['). Also resolves spread `...CONSTANT` references using
// the supplied `constants` table. Returns { count, end } where end is the index
// just past the matching ']'.
function countRefsInArray(raw, startIdx, constants) {
  let depth = 0;
  let i = startIdx;
  let body = "";
  for (; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) { i++; break; }
    }
    body += ch;
  }
  const direct = (body.match(/{\s*doc\s*:/g) ?? []).length;
  let spread = 0;
  const spreadRx = /\.\.\.\s*([A-Z_][A-Z0-9_]*)/g;
  let s;
  while ((s = spreadRx.exec(body))) {
    spread += constants[s[1]] ?? 0;
  }
  return { count: direct + spread, end: i };
}
function loadSourcesIndex() {
  if (SOURCES_BY_SLUG_INDEX) return SOURCES_BY_SLUG_INDEX;
  const path = join(REPO_DIR, "client", "src", "data", "blog-sources.ts");
  let raw;
  try { raw = readFileSync(path, "utf8"); }
  catch { SOURCES_BY_SLUG_INDEX = {}; return SOURCES_BY_SLUG_INDEX; }
  // Phase 1: parse `const NAME: SourceRef[] = [ ... ];` and count refs each.
  const constants = {};
  const constRx = /const\s+([A-Z_][A-Z0-9_]*)\s*:\s*SourceRef\[\]\s*=\s*\[/g;
  let cm;
  while ((cm = constRx.exec(raw))) {
    const name = cm[1];
    const arrStart = cm.index + cm[0].length - 1; // position of '['
    const { count } = countRefsInArray(raw, arrStart, constants);
    constants[name] = count;
  }
  // Phase 2: locate SOURCES_BY_SLUG body and parse each entry.
  const headRx = /SOURCES_BY_SLUG[^=]*=\s*{/;
  const head = raw.match(headRx);
  if (!head) { SOURCES_BY_SLUG_INDEX = {}; return SOURCES_BY_SLUG_INDEX; }
  // Find the matching closing brace by counting depth.
  let depth = 0, end = -1;
  const bodyStart = head.index + head[0].length - 1; // points to '{'
  for (let i = bodyStart; i < raw.length; i++) {
    if (raw[i] === "{") depth++;
    else if (raw[i] === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) { SOURCES_BY_SLUG_INDEX = {}; return SOURCES_BY_SLUG_INDEX; }
  const body = raw.slice(bodyStart + 1, end);
  const out = {};
  // Match either: "slug": [ ...inline refs ]   OR   "slug": IDENTIFIER
  const entryHeadRx = /"([a-z0-9-]+)"\s*:\s*(\[|[A-Z_][A-Z0-9_]*)/g;
  let eh;
  while ((eh = entryHeadRx.exec(body))) {
    const slug = eh[1];
    const tok = eh[2];
    if (tok === "[") {
      const { count, end: arrEnd } = countRefsInArray(body, eh.index + eh[0].length - 1, constants);
      out[slug] = count;
      entryHeadRx.lastIndex = arrEnd;
    } else {
      out[slug] = constants[tok] ?? 0;
    }
  }
  SOURCES_BY_SLUG_INDEX = out;
  return SOURCES_BY_SLUG_INDEX;
}

function hasSourcesBlock(body, slug) {
  // Inline marker (legacy): <!-- exentax:sources-v1 --> ... <!-- /exentax:sources-v1 -->
  const inlineSeg = body.match(/<!--\s*exentax:sources-v1\s*-->([\s\S]*?)<!--\s*\/\s*exentax:sources-v1\s*-->/i);
  if (inlineSeg) {
    const urls = inlineSeg[1].match(/https?:\/\/[^\s")']+/g) ?? [];
    const primary = urls.filter((u) => PRIMARY_SOURCE_HOSTS.some((rx) => rx.test(u)));
    if (primary.length >= 3) return { ok: true, count: primary.length, source: "inline" };
  }
  // Runtime injection via renderSourcesBlockHtml (post.tsx): each slug
  // listed in SOURCES_BY_SLUG with >= 3 refs is rendered as the styled
  // "Exentax Sources" block in every locale.
  const idx = loadSourcesIndex();
  const refs = idx[slug] ?? 0;
  if (refs >= 3) return { ok: true, count: refs, source: "runtime" };
  return { ok: false, count: refs, source: refs > 0 ? "runtime-partial" : "none" };
}

function hasAuthorityBlock(body) {
  if (AUTHORITY_PATTERNS.some((rx) => rx.test(body))) return true;
  // The v2 execution block is by design the authority block (editorial
  // rules v2 §9). Any article with a v2 marker that mentions Exentax in
  // the closing block carries authority signal.
  if (hasV2Marker(body)) {
    const seg = body.match(/<!--\s*exentax:execution-v2\s*-->([\s\S]*?)<!--\s*\/\s*exentax:execution-v2\s*-->/i);
    if (seg && /\bExentax\b/i.test(seg[1])) return true;
  }
  // Closing-Exentax CTA patterns used across the v2 corpus (té lo
  // montamos / we'll handle it / on s'occupe / wir kümmern uns / etc.).
  const CLOSING_CTA_PATTERNS = [
    /te\s+lo\s+montamos/i, /lo\s+resolvemos\s+en\s+Exentax/i,
    /agenda\s+\d+\s+minutos\s+con\s+Exentax/i,
    /book\s+\d+\s+minutes\s+with\s+Exentax/i,
    /reserve\s+\d+\s+minutes\s+with\s+Exentax/i,
    /r[ée]servez?\s+\d+\s+minutes\s+avec\s+Exentax/i,
    /buchen?\s+Sie\s+\d+\s+Minuten\s+mit\s+Exentax/i,
    /reserva\s+\d+\s+minuts\s+amb\s+Exentax/i,
    /agende\s+\d+\s+minutos\s+com\s+Exentax/i,
    /wir\s+k[üu]mmern\s+uns/i, /on\s+s['’]occupe/i,
    /we['’]ll\s+handle\s+it/i, /n[oó]s\s+tratamos/i,
    /ens\s+n['']?ocupem/i,
  ];
  return CLOSING_CTA_PATTERNS.some((rx) => rx.test(body));
}

function auditFile(slug, lang) {
  const path = join(CONTENT_DIR, lang, `${slug}.ts`);
  let raw;
  try { raw = readFileSync(path, "utf8"); }
  catch { return null; }

  const body = extractBody(raw);
  const findings = [];
  let score = 0;

  // 1. v2 marker
  if (hasV2Marker(body)) {
    score += RULE_WEIGHTS["v2-marker"];
  } else {
    findings.push({ rule: "v2-marker", severity: "warning",
      msg: "Falta bloque <!-- exentax:execution-v2 --> cerrado." });
  }

  // 2. calc-cta
  if (hasCalcCta(body, lang)) {
    score += RULE_WEIGHTS["calc-cta"];
  } else {
    findings.push({ rule: "calc-cta", severity: "critical",
      msg: "No se detecta puntero a la calculadora (ni marcador HTML ni link inline)." });
  }

  // 3. min-length
  const words = countWords(body);
  if (words >= 800) {
    score += RULE_WEIGHTS["min-length"];
  } else if (words >= 500) {
    score += Math.round(RULE_WEIGHTS["min-length"] * 0.5);
    findings.push({ rule: "min-length", severity: "warning",
      msg: `Cuerpo de ${words} palabras (< 800 objetivo).` });
  } else {
    findings.push({ rule: "min-length", severity: "critical",
      msg: `Cuerpo de ${words} palabras (< 500 mínimo).` });
  }

  // 4. years in prose
  const years = findYearsInProse(body, slug);
  if (years === 0) {
    score += RULE_WEIGHTS["year-in-prose"];
  } else if (years < 3) {
    score += Math.round(RULE_WEIGHTS["year-in-prose"] * 0.5);
    findings.push({ rule: "year-in-prose", severity: "warning",
      msg: `${years} año(s) en prosa (objetivo 0).` });
  } else {
    findings.push({ rule: "year-in-prose", severity: "critical",
      msg: `${years} años en prosa (>=3, requiere sweep).` });
  }

  // 5. sources block
  const src = hasSourcesBlock(body, slug);
  if (src.ok) {
    score += RULE_WEIGHTS["sources-block"];
  } else if (src.count > 0) {
    score += Math.round(RULE_WEIGHTS["sources-block"] * 0.5);
    findings.push({ rule: "sources-block", severity: "warning",
      msg: `Bloque sources con ${src.count} URLs primarias (< 3).` });
  } else {
    findings.push({ rule: "sources-block", severity: "warning",
      msg: "Falta bloque <!-- exentax:sources-v1 --> con >= 3 URLs primarias." });
  }

  // 6. authority block
  if (hasAuthorityBlock(body)) {
    score += RULE_WEIGHTS["authority-block"];
  } else {
    findings.push({ rule: "authority-block", severity: "warning",
      msg: "No se detecta bloque de autoridad ('Lo que vemos cada semana' / método Exentax / equivalente)." });
  }

  return { slug, lang, words, score, findings };
}

function main() {
  mkdirSync(REPORT_DIR, { recursive: true });
  const slugs = listSlugs("es");
  if (slugs.length === 0) {
    console.error("[masterpiece-audit] No slugs found under", CONTENT_DIR);
    process.exit(2);
  }

  const results = [];
  for (const lang of LANGS) {
    const langSlugs = listSlugs(lang);
    for (const slug of langSlugs) {
      const r = auditFile(slug, lang);
      if (r) results.push(r);
    }
  }

  // Aggregations
  const byLang = {};
  for (const r of results) {
    byLang[r.lang] ??= { count: 0, scoreSum: 0, critical: 0, warning: 0 };
    byLang[r.lang].count += 1;
    byLang[r.lang].scoreSum += r.score;
    for (const f of r.findings) byLang[r.lang][f.severity] += 1;
  }

  const byRule = {};
  for (const r of results) {
    for (const f of r.findings) {
      const k = `${f.rule}:${f.severity}`;
      byRule[k] = (byRule[k] || 0) + 1;
    }
  }

  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const meanScore = results.length > 0 ? totalScore / results.length : 0;

  const summary = {
    generatedAt: new Date().toISOString(),
    totalArticles: results.length,
    meanScore: Math.round(meanScore * 10) / 10,
    byLang: Object.fromEntries(Object.entries(byLang).map(([l, s]) => [l, {
      count: s.count,
      meanScore: Math.round((s.scoreSum / s.count) * 10) / 10,
      critical: s.critical,
      warning: s.warning,
    }])),
    byRule,
    weights: RULE_WEIGHTS,
  };

  // Worst 30 articles by score (asc).
  const worst = [...results].sort((a, b) => a.score - b.score).slice(0, 30);

  const report = { summary, worst, all: results };
  writeFileSync(join(REPORT_DIR, "baseline-606.json"),
    JSON.stringify(report, null, 2));

  // Markdown summary
  const md = [];
  md.push("# Blog masterpiece audit — baseline 606");
  md.push("");
  md.push(`Generado: ${summary.generatedAt}`);
  md.push(`Artículos auditados: **${summary.totalArticles}**`);
  md.push(`Score medio: **${summary.meanScore} / 100**`);
  md.push("");
  md.push("## Score por idioma");
  md.push("");
  md.push("| Idioma | N | Score medio | Critical | Warning |");
  md.push("|---|---:|---:|---:|---:|");
  for (const [lang, s] of Object.entries(summary.byLang)) {
    md.push(`| ${lang} | ${s.count} | ${s.meanScore} | ${s.critical} | ${s.warning} |`);
  }
  md.push("");
  md.push("## Findings agregados por regla");
  md.push("");
  md.push("| Regla | Severidad | N |");
  md.push("|---|---|---:|");
  for (const [k, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
    const [rule, sev] = k.split(":");
    md.push(`| ${rule} | ${sev} | ${n} |`);
  }
  md.push("");
  md.push("## Top-30 artículos con peor score");
  md.push("");
  md.push("| Lang | Slug | Score | Words | Critical findings |");
  md.push("|---|---|---:|---:|---|");
  for (const r of worst) {
    const crit = r.findings.filter((f) => f.severity === "critical").map((f) => f.rule).join(", ");
    md.push(`| ${r.lang} | ${r.slug} | ${r.score} | ${r.words} | ${crit || "—"} |`);
  }
  md.push("");
  md.push("---");
  md.push("");
  md.push("**Cómo interpretar.** Un score de 100 indica que el artículo cumple las 6 reglas v2 (marker, calc-CTA, longitud, sin años, sources, autoridad). El umbral estricto actual es score medio ≥ 97 con cero `critical`.");
  writeFileSync(join(REPORT_DIR, "baseline-606.md"), md.join("\n"));

  console.log(`[masterpiece-audit] Articles: ${summary.totalArticles}, mean score: ${summary.meanScore}/100`);
  console.log(`[masterpiece-audit] Reports: reports/seo/baseline-606.{json,md}`);
  for (const [lang, s] of Object.entries(summary.byLang)) {
    console.log(`  ${lang}: ${s.count} articles, mean ${s.meanScore}, critical=${s.critical}, warning=${s.warning}`);
  }

  if (STRICT) {
    const totalCritical = Object.values(summary.byLang).reduce((acc, s) => acc + s.critical, 0);
    const reasons = [];
    if (summary.meanScore < STRICT_THRESHOLD) reasons.push(`mean ${summary.meanScore} < ${STRICT_THRESHOLD}`);
    if (totalCritical > 0) reasons.push(`${totalCritical} critical finding(s)`);
    if (reasons.length > 0) {
      console.error(`[masterpiece-audit] STRICT FAIL — ${reasons.join("; ")}`);
      process.exit(1);
    }
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
