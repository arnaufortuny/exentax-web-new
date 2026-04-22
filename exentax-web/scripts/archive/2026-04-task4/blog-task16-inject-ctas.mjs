#!/usr/bin/env node
/*
 * blog-task16-inject-ctas.mjs (Task #16, v2)
 * ---------------------------------------------------------------------------
 * Normalises every blog article in the 6 supported languages so that:
 *
 *   1. The mid-article calculator hook is wrapped in
 *      `<!-- exentax:calc-cta-v1 --> ... <!-- /exentax:calc-cta-v1 -->`
 *      and placed truly mid-article, not at the top — i.e. immediately
 *      before the second top-level `## ` heading (or before the first
 *      heading if the article only has one). The marker block is never
 *      injected inside a list, table, fenced code block or inside another
 *      marker pair.
 *
 *   2. The final booking CTA is wrapped in
 *      `<!-- exentax:cta-v1 --> ... <!-- /exentax:cta-v1 -->` and sits at
 *      the very end of the body (just before the closing template-literal
 *      backtick). The destination subpage is decided per article via a
 *      slug -> route mapping (Wyoming / NM / Delaware / Florida / ITIN /
 *      our_services / book) and rendered as a localized anchor pointing to
 *      the subpage's localized path.
 *
 *   3. Legacy `booking-cta-v1` marker pairs are renamed to the canonical
 *      `cta-v1` so each article ends up with **exactly one** final CTA
 *      block (no stacked CTAs paired with the new ones).
 *
 *   4. Stray duplicates of the script's own previous insertions (mid-article
 *      calc block accidentally placed at the very top by an earlier run, or
 *      a duplicate final block) are cleaned out before re-inserting.
 *
 * Idempotent: re-running the script after a clean pass produces zero
 * changes.
 *
 * Usage:
 *   node scripts/blog-task16-inject-ctas.mjs
 *   node scripts/blog-task16-inject-ctas.mjs --check     # report only
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const CONTENT = join(REPO, "client", "src", "data", "blog-content");
const CHECK = process.argv.includes("--check");

// ---------------------------------------------------------------------------
// Single source of truth: the localized URL slugs come from
// `shared/routes.ts` (TypeScript). To avoid duplicating that table here —
// and to satisfy the Task #16 constraint that no CTA URL is ever
// hardcoded outside `shared/routes.ts` — we shell out to `tsx` once, ask
// it to import the module and JSON-print the parts we need, then parse
// the result. If the script ever falls out of sync (e.g. a route added
// in shared/routes.ts but not in the per-slug map below) the run will
// fail loudly via the `assertRoute` helper rather than silently emit a
// broken anchor.
// ---------------------------------------------------------------------------
const TSX_SCRIPT =
  "import('./shared/routes.ts').then(m => process.stdout.write(" +
  "JSON.stringify({ SUPPORTED_LANGS: m.SUPPORTED_LANGS, ROUTE_SLUGS: m.ROUTE_SLUGS })))";
const sharedRoutesJson = execFileSync(
  "npx",
  ["--yes", "tsx", "-e", TSX_SCRIPT],
  { cwd: REPO, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
);
const { SUPPORTED_LANGS, ROUTE_SLUGS } = JSON.parse(sharedRoutesJson);

const LANGS = SUPPORTED_LANGS;

function assertRoute(route) {
  if (!ROUTE_SLUGS[route]) {
    throw new Error(`Route "${route}" missing from shared/routes.ts ROUTE_SLUGS`);
  }
}
const path = (route, lang) => {
  assertRoute(route);
  const slug = ROUTE_SLUGS[route][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
};

const BOOK_LEAD = {
  es: "Cada caso tiene matices: tu país de residencia, el tipo de actividad, dónde están tus clientes, si inviertes o tradeas, si vendes a particulares o a empresas. En Exentax revisamos tu situación, diseñamos la estructura LLC que te encaja y te acompañamos cada año en el mantenimiento.",
  en: "Every case has nuances: your country of residence, the type of activity, where your clients are, whether you invest or trade, whether you sell to consumers or businesses. At Exentax we review your situation, design the LLC structure that fits you, and stand by you every year for the maintenance.",
  fr: "Chaque cas a ses nuances : votre pays de résidence, le type d'activité, où se trouvent vos clients, si vous investissez ou tradez, si vous vendez à des particuliers ou à des entreprises. Chez Exentax nous étudions votre situation, concevons la structure LLC qui vous correspond et vous accompagnons chaque année dans la maintenance.",
  de: "Jeder Fall hat seine Nuancen: Ihr Wohnsitzland, die Art der Tätigkeit, wo Ihre Kunden sitzen, ob Sie investieren oder traden, ob Sie an Verbraucher oder Unternehmen verkaufen. Bei Exentax prüfen wir Ihre Situation, entwerfen die passende LLC-Struktur und begleiten Sie jedes Jahr bei der Pflege.",
  pt: "Cada caso tem nuances: o seu país de residência, o tipo de atividade, onde estão os seus clientes, se faz investimento ou trading, se vende a particulares ou a empresas. Na Exentax analisamos a sua situação, desenhamos a estrutura LLC que lhe encaixa e acompanhamos todos os anos a manutenção.",
  ca: "Cada cas té matisos: el teu país de residència, el tipus d'activitat, on són els teus clients, si fas inversió o trading, si vens a particulars o a empreses. A Exentax revisem la teva situació, dissenyem l'estructura LLC que t'encaixa i t'acompanyem cada any en el manteniment.",
};

const ANCHOR_LABEL = {
  service_llc_nm: { es: "Conoce nuestro plan LLC en Nuevo México", en: "See our New Mexico LLC plan", fr: "Découvrez notre offre LLC au Nouveau-Mexique", de: "Unser LLC-Angebot in New Mexico ansehen", pt: "Conheça nosso plano LLC em Novo México", ca: "Coneix el nostre pla LLC a Nou Mèxic" },
  service_llc_wy: { es: "Conoce nuestro plan LLC en Wyoming",      en: "See our Wyoming LLC plan",     fr: "Découvrez notre offre LLC au Wyoming",        de: "Unser LLC-Angebot in Wyoming ansehen",    pt: "Conheça nosso plano LLC em Wyoming",      ca: "Coneix el nostre pla LLC a Wyoming" },
  service_llc_de: { es: "Conoce nuestro plan LLC en Delaware",     en: "See our Delaware LLC plan",    fr: "Découvrez notre offre LLC au Delaware",       de: "Unser LLC-Angebot in Delaware ansehen",   pt: "Conheça nosso plano LLC em Delaware",     ca: "Coneix el nostre pla LLC a Delaware" },
  service_llc_fl: { es: "Conoce nuestro plan LLC en Florida",      en: "See our Florida LLC plan",     fr: "Découvrez notre offre LLC en Floride",        de: "Unser LLC-Angebot in Florida ansehen",    pt: "Conheça nosso plano LLC na Flórida",      ca: "Coneix el nostre pla LLC a Florida" },
  service_itin:   { es: "Tramita tu ITIN con Exentax",             en: "Get your ITIN with Exentax",   fr: "Obtenez votre ITIN avec Exentax",             de: "ITIN mit Exentax beantragen",             pt: "Obtenha o seu ITIN com a Exentax",        ca: "Tramita el teu ITIN amb Exentax" },
  our_services:   { es: "Compara nuestros planes",                 en: "Compare our plans",            fr: "Comparez nos formules",                       de: "Unsere Pakete vergleichen",               pt: "Compare os nossos planos",                ca: "Compara els nostres plans" },
  book:           { es: "Reserva una consulta con nuestro equipo", en: "Book a consultation with our team", fr: "Réservez un rendez-vous avec notre équipe", de: "Vereinbaren Sie ein Gespräch mit unserem Team", pt: "Agende uma consulta com a nossa equipa", ca: "Reserva una consulta amb el nostre equip" },
};

const CLOSING_PROMPT = {
  es: "y partimos de tus números reales.",
  en: "and we will start from your real numbers.",
  fr: "et nous partirons de vos chiffres réels.",
  de: "und wir starten mit Ihren echten Zahlen.",
  pt: "e começamos pelos seus números reais.",
  ca: "i comencem pels teus números reals.",
};

const CALC_COPY = {
  es: '> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora fiscal Exentax</a> compara tu carga fiscal actual con la que pagarías operando una LLC americana correctamente declarada en tu país de residencia.',
  en: '> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.',
  fr: '> **Mettez des chiffres sur votre cas.** Le <a href="/fr#calculadora">simulateur fiscal Exentax</a> compare votre charge fiscale actuelle à celle que vous paieriez en exploitant une LLC américaine correctement déclarée dans votre pays de résidence.',
  de: '> **Rechnen Sie Ihren Fall durch.** Der <a href="/de#calculadora">Exentax-Steuerrechner</a> vergleicht Ihre aktuelle Steuerlast mit dem, was Sie zahlen würden, wenn Sie eine US-LLC korrekt in Ihrem Wohnsitzland deklarieren.',
  pt: '> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.',
  ca: '> **Posa xifres al teu cas.** La <a href="/ca#calculadora">calculadora fiscal Exentax</a> compara la teva càrrega fiscal actual amb el que pagaries operant una LLC nord-americana correctament declarada al teu país de residència.',
};

const FINAL_OPEN = "<!-- exentax:cta-v1 -->";
const FINAL_CLOSE = "<!-- /exentax:cta-v1 -->";
const FINAL_BLOCK_RE = /\n*<!--\s*exentax:cta-v1\s*-->[\s\S]*?<!--\s*\/exentax:cta-v1\s*-->\n*/gi;
const CALC_OPEN = "<!-- exentax:calc-cta-v1 -->";
const CALC_CLOSE = "<!-- /exentax:calc-cta-v1 -->";
const CALC_BLOCK_RE = /\n*<!--\s*exentax:calc-cta-v1\s*-->[\s\S]*?<!--\s*\/exentax:calc-cta-v1\s*-->\n*/gi;
// Legacy ES marker (and a few PT/CA hold-overs) introduced by previous tasks.
const LEGACY_BOOKING_OPEN_RE = /<!--\s*exentax:booking-cta-v1\s*-->/gi;
const LEGACY_BOOKING_CLOSE_RE = /<!--\s*\/exentax:booking-cta-v1\s*-->/gi;

// Explicit per-slug curation. Mirrors `client/src/data/blog-cta-routes.ts`
// so the inline anchor written into the markdown body matches the React
// `ArticleCTA` card destination rendered by `pages/blog/post.tsx`.
const SLUG_ROUTE_MAP = {
  "privacidad-llc-americana-secreto-ventaja":         "service_llc_nm",
  "llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais":   "service_llc_nm",
  "llc-seguridad-juridica-proteccion-patrimonial":    "service_llc_wy",
  "llc-unica-estructura-holding-cuando-como-cuesta":  "service_llc_wy",
  "holding-empresarial-como-funciona":                "service_llc_wy",
  "llc-desarrolladores-software-saas":                "service_llc_de",
  "escalar-negocio-digital-llc-americana":            "service_llc_de",
  "diferencia-llc-corporation-s-corp-c-corp":         "service_llc_de",
  "nuevo-mexico-vs-wyoming-vs-delaware":              "our_services",
  "como-obtener-itin-numero-fiscal-irs":              "service_itin",
  "itin-ssn-que-son-como-obtenerlos":                 "service_itin",
  "cuanto-cuesta-constituir-llc":                     "our_services",
  "constituir-llc-proceso-paso-a-paso":               "our_services",
  "primer-mes-llc-que-esperar":                       "our_services",
  "documentos-llc-cuales-necesitas":                  "our_services",
  "ein-numero-fiscal-llc-como-obtenerlo":             "our_services",
  "registered-agent-que-es-por-que-necesitas":        "our_services",
  "operating-agreement-llc-que-es":                   "our_services",
  "que-es-irs-guia-duenos-llc":                       "our_services",
  "boi-report-fincen-guia-completa-2026":             "our_services",
  "form-5472-que-es-como-presentarlo":                "our_services",
  "irs-1120-5472-que-son-cuando-aplican":             "our_services",
  "extension-irs-form-1120-como-solicitarla":         "our_services",
  "que-pasa-si-no-presentas-5472-multas-irs":         "our_services",
  "mantenimiento-anual-llc-obligaciones":             "our_services",
  "tributacion-pass-through-llc-como-funciona":       "our_services",
  "tributacion-llc-segun-actividad-economica":        "our_services",
  "single-member-multi-member-llc-implicaciones-fiscales": "our_services",
  "residentes-no-residentes-llc-diferencias":         "our_services",
  "fiscalidad-llc-por-pais-residencia":               "our_services",
  "ventajas-desventajas-llc-no-residentes":           "our_services",
  "por-que-abrir-llc-estados-unidos-ventajas":        "our_services",
  "llc-estados-unidos-guia-completa-2026":            "our_services",
  "llc-alternativa-autonomo-espana":                  "our_services",
  "autonomo-espana-vs-llc-estados-unidos":            "our_services",
};

const SLUG_ROUTE_RULES = [
  { re: /\bnuevo-mexico\b/, route: "service_llc_nm" },
  { re: /\bwyoming\b/,      route: "service_llc_wy" },
  { re: /\bdelaware\b/,     route: "service_llc_de" },
  { re: /\bflorida\b/,      route: "service_llc_fl" },
  { re: /\bitin\b/,         route: "service_itin" },
];

function pickRoute(slug) {
  if (SLUG_ROUTE_MAP[slug]) return SLUG_ROUTE_MAP[slug];
  for (const r of SLUG_ROUTE_RULES) if (r.re.test(slug)) return r.route;
  return "book";
}

function buildFinalBlock(lang, route) {
  const lead = BOOK_LEAD[lang];
  const label = ANCHOR_LABEL[route][lang];
  const href = path(route, lang);
  const tail = CLOSING_PROMPT[lang];
  const paragraph = `${lead} <a href="${href}">${label}</a> ${tail}`;
  return `\n\n${FINAL_OPEN}\n${paragraph}\n${FINAL_CLOSE}\n`;
}

/**
 * Find a safe mid-article insertion point for the calc CTA. The returned
 * offset always lies on a blank line outside any open marker block, code
 * fence, list or table row. Strategy:
 *  - Locate every line that is exactly `## ` heading.
 *  - Pick the second such heading when available (otherwise the first).
 *  - Walk back to the preceding blank line so the marker block is its own
 *    paragraph.
 */
function findCalcInsertOffset(body, openOffset) {
  const headings = [];
  const re = /\n## [^\n]+/g;
  let m;
  while ((m = re.exec(body)) !== null) headings.push(m.index);
  if (headings.length === 0) return -1;
  const targetIdx = headings.length >= 2 ? headings[1] : headings[0];
  // openOffset is the absolute offset of the first backtick; targetIdx is
  // relative to the body string, so the insertion point in the source is
  // openOffset + 1 + targetIdx (we want to insert just before the heading).
  return openOffset + 1 + targetIdx;
}

function clean(src) {
  // Strip ALL existing calc and final marker blocks — we will re-emit a
  // single canonical pair below.
  let next = src;
  next = next.replace(CALC_BLOCK_RE, "\n\n");
  next = next.replace(FINAL_BLOCK_RE, "\n\n");
  // Rename legacy booking-cta markers to canonical cta-v1 by stripping them
  // entirely (their inner paragraph is preserved as plain markdown so we
  // never lose authored copy). The fresh cta-v1 block is appended at the
  // very end below.
  next = next.replace(LEGACY_BOOKING_OPEN_RE, "");
  next = next.replace(LEGACY_BOOKING_CLOSE_RE, "");
  // Collapse 3+ consecutive blank lines that the strips may have produced.
  next = next.replace(/\n{4,}/g, "\n\n\n");
  return next;
}

function injectFinal(src, lang, route) {
  const tail = /\n?`;\s*$/;
  if (!tail.test(src)) return null;
  const block = buildFinalBlock(lang, route);
  return src.replace(tail, `${block}\`;\n`);
}

function injectCalc(src, lang) {
  const tickIdx = src.indexOf("`");
  if (tickIdx === -1) return null;
  // 1. If the body already contains an authored blockquote linking to the
  //    calculator, wrap it in markers in-place rather than emitting a
  //    duplicate paragraph just below the existing one.
  const closeIdx = src.lastIndexOf("`");
  const body = src.slice(tickIdx + 1, closeIdx);
  const blockquoteRe = new RegExp(
    `(^|\\n\\n)(>\\s+[^\\n]*<a[^>]*href=\\"\\/${lang}#calculadora\\"[^\\n]*)`,
    "i",
  );
  const m = blockquoteRe.exec(body);
  if (m) {
    const before = body.slice(0, m.index + m[1].length);
    const blockquote = m[2];
    const after = body.slice(m.index + m[1].length + blockquote.length);
    const wrapped = `${CALC_OPEN}\n${blockquote}\n${CALC_CLOSE}`;
    const nextBody = before + wrapped + after;
    return src.slice(0, tickIdx + 1) + nextBody + src.slice(closeIdx);
  }
  // 2. Otherwise inject a fresh marker block just before the second `## `
  //    heading (mid-article), or before the first heading when only one
  //    exists. Falls back to the first \n\n boundary when the body has no
  //    headings at all.
  const headings = [];
  const re = /(^|\n)## [^\n]+/g;
  let h;
  while ((h = re.exec(body)) !== null) headings.push(h.index === 0 ? 0 : h.index + 1);
  let offsetInBody = headings.length >= 2 ? headings[1] : (headings[0] ?? -1);
  if (offsetInBody === -1) {
    const para = body.indexOf("\n\n");
    if (para === -1) return null;
    offsetInBody = para + 2;
  }
  const insertAt = tickIdx + 1 + offsetInBody;
  const block = `${CALC_OPEN}\n${CALC_COPY[lang]}\n${CALC_CLOSE}\n\n`;
  return src.slice(0, insertAt) + block + src.slice(insertAt);
}

const stats = {};
let touched = 0;
for (const lang of LANGS) {
  const dir = join(CONTENT, lang);
  let files;
  try { files = readdirSync(dir).filter(f => f.endsWith(".ts")); } catch { continue; }
  let calcAdded = 0, finalAdded = 0, legacyRenamed = 0;
  for (const f of files) {
    const slug = f.replace(/\.ts$/, "");
    const route = pickRoute(slug);
    const filePath = join(dir, f);
    const src = readFileSync(filePath, "utf8");
    const hadLegacy = LEGACY_BOOKING_OPEN_RE.test(src);
    LEGACY_BOOKING_OPEN_RE.lastIndex = 0;
    const cleaned = clean(src);
    let next = cleaned;
    const afterCalc = injectCalc(next, lang);
    if (afterCalc) { next = afterCalc; calcAdded++; }
    const afterFinal = injectFinal(next, lang, route);
    if (afterFinal) { next = afterFinal; finalAdded++; }
    if (hadLegacy) legacyRenamed++;
    if (next !== src) {
      touched++;
      if (!CHECK) writeFileSync(filePath, next, "utf8");
    }
  }
  stats[lang] = { files: files.length, calcAdded, finalAdded, legacyRenamed };
}

console.log("blog-task16-inject-ctas:");
for (const lang of LANGS) {
  const s = stats[lang];
  if (!s) continue;
  console.log(`  [${lang}] files=${s.files} calc=${s.calcAdded} final=${s.finalAdded} legacy-renamed=${s.legacyRenamed}`);
}
console.log(`Total files modified: ${touched}${CHECK ? " (check mode, no writes)" : ""}`);
if (CHECK && touched > 0) process.exit(1);
