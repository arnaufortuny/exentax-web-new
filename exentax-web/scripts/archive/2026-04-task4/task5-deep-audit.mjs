#!/usr/bin/env node
/**
 * Task #5 — Deep audit of the 9 new fiscal-2026 articles across 6 languages.
 * Checks: H2 parity, outbound links to existing articles, CTA presence in body,
 * i18n metadata coherence (length budgets), no in-body H1, category distribution.
 * Editorial policy: Spanish-specific terms (autonomo, hacienda, IRPF, IVA, RETA,
 * SL, módulos) are intentionally retained in non-ES content to preserve
 * jurisdictional precision (consistent with 7+ preexisting EN/DE articles).
 */
import { readFileSync, readdirSync } from "node:fs";

const NEW_SLUGS = [
  "tramos-irpf-2026",
  "cuota-autonomo-2026",
  "gastos-deducibles-autonomos-2026",
  "iva-intracomunitario-servicios-europa",
  "retenciones-irpf-factura",
  "sociedad-limitada-espana-costes-ventajas",
  "modulos-vs-estimacion-directa-2026",
  "diferencia-llc-corporation-s-corp-c-corp",
  "facturar-sin-ser-autonomo-alternativas-2026",
];
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
let issues = 0;
const ok = (m) => console.log("  OK ", m);
const bad = (m) => { console.log("  FAIL", m); issues++; };

console.log("[A] H2 structural parity (|delta| <= 1 vs ES)");
for (const s of NEW_SLUGS) {
  const counts = {};
  for (const l of LANGS) {
    counts[l] = (readFileSync(`client/src/data/blog-content/${l}/${s}.ts`, "utf8").match(/^## /gm) || []).length;
  }
  const off = LANGS.filter((l) => Math.abs(counts[l] - counts.es) > 1);
  if (off.length === 0) ok(`${s} ${JSON.stringify(counts)}`);
  else bad(`${s} mismatch: ${JSON.stringify(counts)}`);
}

console.log("\n[B] Outbound links from each new ES article to existing articles (>= 3)");
const allEs = new Set(readdirSync("client/src/data/blog-content/es").filter((f) => f.endsWith(".ts")).map((f) => f.slice(0, -3)));
for (const s of NEW_SLUGS) {
  const c = readFileSync(`client/src/data/blog-content/es/${s}.ts`, "utf8");
  const linked = new Set();
  let m;
  const re = /\/es\/blog\/([a-z0-9-]+)/g;
  while ((m = re.exec(c)) !== null) if (m[1] !== s && allEs.has(m[1])) linked.add(m[1]);
  if (linked.size >= 3) ok(`${s}: ${linked.size}`);
  else bad(`${s}: ${linked.size} (<3)`);
}

console.log("\n[C] CTA link in body (calculadora|agendar|booking|asesoria) per lang");
for (const lang of LANGS) {
  for (const s of NEW_SLUGS) {
    const c = readFileSync(`client/src/data/blog-content/${lang}/${s}.ts`, "utf8");
    const re = new RegExp(`/${lang}#calculadora|/${lang}/calculadora|/${lang}/agendar|/${lang}/booking|/${lang}/asesoria`, "g");
    if ((c.match(re) || []).length < 1) bad(`${lang}/${s}: 0 CTA in body`);
  }
}
if (issues === 0) ok("all 54 files have >=1 in-body CTA");

console.log("\n[D] i18n metadata coherence (title/excerpt/metaTitle/metaDescription, lengths)");
for (const lang of ["en", "fr", "de", "pt", "ca"]) {
  const i18n = readFileSync(`client/src/data/blog-i18n/${lang}.ts`, "utf8");
  for (const s of NEW_SLUGS) {
    const blockRe = new RegExp(`"${s}":\\s*\\{([^}]+)\\}`, "s");
    const m = i18n.match(blockRe);
    if (!m) { bad(`${lang}/${s}: missing entry`); continue; }
    const block = m[1];
    for (const f of ["title", "excerpt", "metaTitle", "metaDescription"]) {
      if (!new RegExp(`${f}:\\s*"`).test(block)) bad(`${lang}/${s}: missing ${f}`);
    }
    const mt = block.match(/metaTitle:\s*"([^"]+)"/);
    if (mt && (mt[1].length < 30 || mt[1].length > 70)) bad(`${lang}/${s}: metaTitle ${mt[1].length}c (30-70)`);
    const md = block.match(/metaDescription:\s*"([^"]+)"/);
    if (md && (md[1].length < 80 || md[1].length > 170)) bad(`${lang}/${s}: metaDesc ${md[1].length}c (80-170)`);
  }
}

console.log("\n[E] No duplicate H1 in body (title comes from BLOG_POSTS)");
for (const lang of LANGS) {
  for (const s of NEW_SLUGS) {
    const body = readFileSync(`client/src/data/blog-content/${lang}/${s}.ts`, "utf8").replace(/^export default `/m, "");
    if (/^# [^\n]/m.test(body)) bad(`${lang}/${s}: in-body H1`);
  }
}

console.log("\n[F] Category distribution (BLOG_POSTS)");
const bp = readFileSync("client/src/data/blog-posts.ts", "utf8");
const cats = {};
for (const s of NEW_SLUGS) {
  const m = bp.match(new RegExp(`slug:\\s*"${s}"[\\s\\S]{0,500}?category:\\s*"([^"]+)"`));
  if (m) cats[m[1]] = (cats[m[1]] || 0) + 1;
}
ok(`distribution: ${JSON.stringify(cats)}`);

console.log(`\n${issues === 0 ? "PASS — deep audit clean (54 files)" : "FAIL — " + issues + " issue(s)"}`);
process.exit(issues === 0 ? 0 : 1);
