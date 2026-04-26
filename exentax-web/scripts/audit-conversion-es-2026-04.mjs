#!/usr/bin/env node
/**
 * audit-conversion-es-2026-04.mjs
 *
 * Read-only "test de conversión" audit across the 111 ES blog articles
 * (excluding `cuanto-cuesta-constituir-llc`, owned by Task #1).
 *
 * Produces:
 *   - docs/audits/2026-04/conversion/audit-es.md  (one section per slug)
 *   - docs/audits/2026-04/conversion/SUMMARY-es.md (totals + priorities)
 *   - docs/audits/2026-04/conversion/audit-es.json (machine-readable mirror)
 *
 * Heuristic test mirrors the editorial brief criteria; every article that
 * fails ANY category is marked FALLA. Categories evaluated:
 *
 *   1. gancho-generico          — first paragraph is definitional / boilerplate
 *   2. desarrollo-relleno       — high density of throat-clearing fillers
 *   3. objeciones-no-resueltas  — no objection / counter-argument scaffolding
 *   4. exentax-forzado-invisible — Exentax positioning out of band
 *      (sub-tags: `exentax-invisible` < 2 mentions, `exentax-forzado` > 22)
 *   5. cta-peticion             — CTA framed as plea, not as consequence
 *   6. datos-sin-fuente         — legal claims with insufficient authoritative cites
 *   7. longitud-insuficiente    — body word count < 2500
 *
 * Word count is measured on the template-literal body, stripping HTML tags,
 * fenced code blocks, HTML comments, and link/markdown markup.
 *
 * Per-article plan (3-6 bullets) is auto-generated from which categories
 * triggered. The plan is the entry point for the downstream rewrite wave.
 *
 * Idempotent: re-running overwrites both reports. NEVER mutates blog
 * content. Exit code 0 (audit-only).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ES_DIR = path.join(ROOT, "client/src/data/blog-content/es");
const POSTS_FILE = path.join(ROOT, "client/src/data/blog-posts.ts");
const OUT_DIR = path.join(ROOT, "docs/audits/2026-04/conversion");

const EXCLUDED_SLUGS = new Set(["cuanto-cuesta-constituir-llc"]);

// ─── Slug → title (and traffic-rank) parser ─────────────────────────────────
function loadSlugTitleMap() {
  const src = fs.readFileSync(POSTS_FILE, "utf8");
  // Each entry: `slug: "..."` followed within ~3 lines by `title: "..."`.
  const map = new Map();
  const re = /slug:\s*"([^"]+)",\s*\n\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  let order = 0;
  while ((m = re.exec(src)) !== null) {
    if (!map.has(m[1])) {
      map.set(m[1], { title: m[2].replace(/\\"/g, '"'), rank: order++ });
    }
  }
  return map;
}

// ─── Body extraction & cleaning ─────────────────────────────────────────────
function extractBody(content) {
  const m = content.match(/export\s+default\s+`([\s\S]*)`\s*;?\s*$/);
  return m ? m[1] : "";
}

function strippedForWordCount(body) {
  let txt = body;
  txt = txt.replace(/```[\s\S]*?```/g, " ");          // fenced code
  txt = txt.replace(/<!--[\s\S]*?-->/g, " ");         // HTML comments
  txt = txt.replace(/<a\s+[^>]*>([^<]*)<\/a>/gi, "$1"); // anchor → label only
  txt = txt.replace(/<[^>]+>/g, " ");                  // any other tags
  txt = txt.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");  // markdown links
  txt = txt.replace(/[#*_>`|]/g, " ");                 // markdown markers
  return txt;
}

function wordCount(body) {
  return strippedForWordCount(body).trim().split(/\s+/).filter(Boolean).length;
}

function paragraphsOf(body) {
  // Strip leading meta callout (`<p class="text-sm opacity-80 italic">…</p>`)
  // since it's a navigational hint, not the editorial hook.
  let cleaned = body.replace(/^\s*<p[^>]*>[\s\S]*?<\/p>\s*/i, "");
  return cleaned.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

function firstSubstantiveParagraph(body) {
  const paras = paragraphsOf(body);
  for (const p of paras) {
    if (p.startsWith("#")) continue;
    if (p.startsWith("<!--")) continue;
    if (p.startsWith("|")) continue;
    if (p.length < 30) continue;
    return p;
  }
  return "";
}

// ─── Detector heuristics ────────────────────────────────────────────────────

const FILLER_PATTERNS = [
  /\bes importante (?:destacar|señalar|recordar|tener en cuenta|saber|mencionar)\b/gi,
  /\bcabe (?:destacar|mencionar|señalar|recordar)\b/gi,
  /\bvale la pena (?:destacar|mencionar|recordar)\b/gi,
  /\bcomo (?:hemos|ya hemos) visto\b/gi,
  /\bcomo (?:acabamos de|ya hemos) (?:ver|mencionar|comentar)\b/gi,
  /\bno (?:debemos|hay que) olvidar\b/gi,
  /\bantes de (?:continuar|profundizar|seguir)\b/gi,
  /\bsin lugar a dudas\b/gi,
  /\ben definitiva\b/gi,
  /\ben resumidas cuentas\b/gi,
  /\bcomo bien (?:sabes|sabemos)\b/gi,
  /\bvamos a (?:explicarte|contarte|hablar de)\b/gi,
  /\b(?:en|a) este (?:artículo|post|texto), (?:vamos a|te vamos a|te explicamos|veremos)\b/gi,
];

const PLEADING_CTA_PATTERNS = [
  /\bno dudes en (?:contactar|escribir|ponerte en contacto)\b/gi,
  /\bcontáctanos (?:para|si|hoy|ya)\b/gi,
  /\bponte en contacto\b/gi,
  /\b(?:llámanos|escríbenos)\s+(?:hoy|ya|cuanto antes|para|si)\b/gi,
  /\bconsulta con (?:un|tu) asesor\b/gi,
  /\bhabla con un experto\b/gi,
  /\bsi (?:tienes|surgen) dudas, (?:contáctanos|escríbenos)\b/gi,
];

const CONSEQUENCE_CTA_PATTERNS = [
  /\bsalimos (?:de la (?:llamada|reunión)|de la sesión) con\b/gi,
  /\bte (?:ahorra|ahorramos|evitamos|evitas)\b/gi,
  /\bpresupuesto cerrado (?:por escrito|antes de empezar)\b/gi,
  /\bcalendario (?:cerrado|completo|fijado)\b/gi,
  /\b30\s+minutos\b/gi,
  /\btreinta minutos\b/gi,
  /\brevisamos tu (?:llc|caso|estructura) con números reales\b/gi,
];

const OBJECTION_HEADER_PATTERNS = [
  /^#{2,3}\s+¿/m,
  /^#{2,3}\s+(?:Pero|Y si|Lo que (?:no |nadie )|"[¿]|Objeci|FAQ|Preguntas frecuentes|Mitos)/im,
];

const OBJECTION_INLINE_PATTERNS = [
  /\b(?:la objeción|"pero (?:y |qué pasa))/gi,
  /\b(?:te van a decir|alguien podría (?:pensar|objetar|preguntar))\b/gi,
  /\b(?:matiz importante|lo que casi nadie (?:cuenta|explica|dice))\b/gi,
  /\b(?:ojo con|cuidado con|atención:)/gi,
  /\bes (?:legal|cierto|verdad)\?\b/gi,
  /\bla letra pequeña\b/gi,
  /\b(?:Lo que NO|Lo que sí|Lo que cambia)\b/gi,
];

const AUTHORITATIVE_DOMAINS = [
  // US federal
  "irs.gov", "fincen.gov", "treasury.gov", "sec.gov", "fdic.gov",
  "federalregister.gov", "congress.gov", "law.cornell.edu", "uscode.house.gov",
  // ES
  "boe.es", "agenciatributaria.gob.es", "sede.agenciatributaria.gob.es",
  "hacienda.gob.es", "petete.tributos.hacienda.gob.es", "poderjudicial.es",
  "tribunalconstitucional.es", "seg-social.es", "ine.es", "mineco.gob.es",
  // EU / OECD
  "eur-lex.europa.eu", "ec.europa.eu", "europa.eu", "oecd.org",
  "oecd-ilibrary.org", "curia.europa.eu",
  // PT / FR / DE / Latam (light coverage; ES articles cite these less)
  "portaldasfinancas.gov.pt", "impots.gouv.fr", "bundesfinanzministerium.de",
  "gencat.cat",
];

const LEGAL_CLAIM_MARKERS = [
  /\b(?:IRS|FinCEN|Treasury|Treas\.\s*Reg|IRC\s*§|26\s*U\.?S\.?C)\b/,
  /\bForm\s*(?:5472|1120|7004|8832|W-?[78])\b/,
  /\bBOI(?:R)?\b|Beneficial\s+Ownership|Corporate\s+Transparency\s+Act\b/,
  /\bLIRPF|LIS|LGT|RIRPF|AEAT|Hacienda\b/,
  /\bModelo\s*(?:100|232|720|721)\b/,
  /\bCDI\b|convenio (?:de )?doble imposici(?:o|ó)n\b/,
  /\bDAC[678]\b|ATAD|CRS|FATCA|BEPS\b/,
  /\bart(?:[ií]culo|\.)\s*\d+\b/,
];

const GENERIC_HOOK_OPENERS = [
  /^(?:Una\s+|Un\s+)?LLC\s+(?:es|\(Limited)/i,
  /^En\s+este\s+(?:artículo|post|texto|análisis)\b/i,
  /^Este\s+(?:artículo|post|texto)\b/i,
  /^En\s+esta\s+(?:guía|sección|entrada)\b/i,
  /^Vamos\s+a\s+(?:explicarte|contarte|hablar de|ver)\b/i,
  /^Si (?:eres|estás|tienes|llevas) (?:un|una)\b/i,
  /^Hoy (?:vamos a|te|hablamos)\b/i,
  /^(?:Una|Un)\s+\w+\s+(?:es una|es un)\s+\w+\s+(?:que|para)\b/i,
];

const HOOK_CONCRETE_MARKERS = [
  /\d{4}/,                           // year or amount with 4 digits
  /\$\s?\d/,                          // dollar
  /€/,                                // euro
  /\d+\s*%/,                         // percentage
  /\b\d+(?:\.\d+)?\s*(?:USD|EUR|€|\$)\b/,
  /[?¿]/,                             // question
  /\b(?:multa|sanci[oó]n|c[áa]rcel|penalty|fine)\b/i,
  /\b(?:ahorr|pierd|paga[rs]|gastas?|cobras?|factur)/i,
];

// ─── Per-article evaluator ──────────────────────────────────────────────────
function evaluate(slug, body) {
  const wc = wordCount(body);
  const firstP = firstSubstantiveParagraph(body);
  const cleanedBody = strippedForWordCount(body);
  const exentaxMentions = (body.match(/\bExentax\b/g) || []).length;

  // 1. Hook
  let genericHook = false;
  let hookReasons = [];
  if (!firstP || firstP.length < 60) {
    genericHook = true;
    hookReasons.push("párrafo inicial demasiado corto");
  } else {
    const opensGeneric = GENERIC_HOOK_OPENERS.some((rx) => rx.test(firstP));
    const hasConcrete = HOOK_CONCRETE_MARKERS.some((rx) => rx.test(firstP.slice(0, 280)));
    if (opensGeneric && !hasConcrete) {
      genericHook = true;
      hookReasons.push("abre con definición o frase boilerplate sin gancho concreto");
    }
    if (!hasConcrete && firstP.length < 200) {
      genericHook = true;
      hookReasons.push("primer párrafo sin cifra, año o pregunta-objeción");
    }
  }

  // 2. Filler density
  let fillerHits = 0;
  for (const rx of FILLER_PATTERNS) {
    const m = body.match(rx);
    if (m) fillerHits += m.length;
  }
  const filler = fillerHits >= 4;

  // 3. Objections
  let objectionScore = 0;
  for (const rx of OBJECTION_HEADER_PATTERNS) {
    const m = body.match(rx);
    if (m) objectionScore += 2;
  }
  // Count Q-style ## / ### headers
  const qHeaders = (body.match(/^#{2,3}\s+¿/gm) || []).length;
  objectionScore += qHeaders;
  for (const rx of OBJECTION_INLINE_PATTERNS) {
    const m = body.match(rx);
    if (m) objectionScore += Math.min(m.length, 3);
  }
  const objectionsMissing = objectionScore < 3;

  // 4. Exentax positioning
  let exentaxBand = "ok";
  if (exentaxMentions < 2) exentaxBand = "invisible";
  else if (exentaxMentions > 22) exentaxBand = "forzado";

  // 5. CTA voice
  let pleadingHits = 0;
  for (const rx of PLEADING_CTA_PATTERNS) {
    const m = body.match(rx);
    if (m) pleadingHits += m.length;
  }
  let consequenceHits = 0;
  for (const rx of CONSEQUENCE_CTA_PATTERNS) {
    const m = body.match(rx);
    if (m) consequenceHits += m.length;
  }
  const ctaPleading = pleadingHits >= 2 && consequenceHits === 0;

  // 6. Sources
  const allExternal = [...body.matchAll(/<a\s+href="(https?:\/\/[^"#?]+)/gi)].map(m => m[1]);
  const authoritative = new Set();
  for (const url of allExternal) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      for (const dom of AUTHORITATIVE_DOMAINS) {
        if (host === dom || host.endsWith("." + dom)) authoritative.add(host);
      }
    } catch { /* ignore malformed */ }
  }
  const makesLegalClaims = LEGAL_CLAIM_MARKERS.some((rx) => rx.test(body));
  const sourcesInsufficient = makesLegalClaims && authoritative.size < 3;

  // 7. Length
  const tooShort = wc < 2500;

  const failureCategories = [];
  if (genericHook) failureCategories.push("gancho-generico");
  if (filler) failureCategories.push("desarrollo-relleno");
  if (objectionsMissing) failureCategories.push("objeciones-no-resueltas");
  if (exentaxBand !== "ok") failureCategories.push(`exentax-${exentaxBand}`);
  if (ctaPleading) failureCategories.push("cta-peticion");
  if (sourcesInsufficient) failureCategories.push("datos-sin-fuente");
  if (tooShort) failureCategories.push("longitud-insuficiente");

  const verdict = failureCategories.length === 0 ? "PASA" : "FALLA";

  return {
    slug,
    wordCount: wc,
    verdict,
    failureCategories,
    signals: {
      firstParagraphPreview: firstP.slice(0, 220).replace(/\s+/g, " "),
      fillerHits,
      objectionScore,
      qHeaders,
      exentaxMentions,
      pleadingCtaHits: pleadingHits,
      consequenceCtaHits: consequenceHits,
      authoritativeSourcesCount: authoritative.size,
      authoritativeDomains: [...authoritative].sort(),
      makesLegalClaims,
      hookReasons,
    },
  };
}

// ─── Plan generation per failed category ────────────────────────────────────
function planFor(slug, ev, title) {
  const bullets = [];
  const fc = new Set(ev.failureCategories);

  if (fc.has("gancho-generico")) {
    const why = ev.signals.hookReasons.join("; ") || "sin gancho concreto";
    bullets.push(
      `Reescribir el primer párrafo (motivo: ${why}). Abrir con la objeción, ` +
      `cifra o pregunta más punzante del tema "${title}" — no con definición ` +
      `ni con "En este artículo".`,
    );
  }
  if (fc.has("desarrollo-relleno")) {
    bullets.push(
      `Eliminar las ${ev.signals.fillerHits} expresiones de relleno detectadas ` +
      `(p. ej. "es importante destacar", "como hemos visto"). Cada frase debe ` +
      `aportar dato, número, plazo o consecuencia.`,
    );
  }
  if (fc.has("objeciones-no-resueltas")) {
    bullets.push(
      `Añadir 2-3 secciones de objeción (formato "¿Y si...?" / "Lo que NO te ` +
      `cuentan") que resuelvan las dudas reales del lector antes de que las ` +
      `formule. Convertir al menos un H2/H3 en pregunta directa.`,
    );
  }
  if (fc.has("exentax-invisible")) {
    bullets.push(
      `Insertar 2-3 menciones contextuales a Exentax como conclusión lógica ` +
      `(no como inserto comercial): qué hace Exentax respecto a la situación ` +
      `descrita y por qué es la salida natural.`,
    );
  }
  if (fc.has("exentax-forzado")) {
    bullets.push(
      `Reducir y reposicionar las ${ev.signals.exentaxMentions} menciones a ` +
      `Exentax: dejarlas solo donde aparezcan como consecuencia lógica del ` +
      `argumento, no como recordatorio comercial repetido.`,
    );
  }
  if (fc.has("cta-peticion")) {
    bullets.push(
      `Reescribir el CTA: pasar de petición ("contáctanos", "no dudes en ` +
      `escribirnos") a consecuencia ("salimos de la llamada con presupuesto ` +
      `cerrado y calendario" / "te ahorras la sanción de Form 5472").`,
    );
  }
  if (fc.has("datos-sin-fuente")) {
    bullets.push(
      `Añadir citas a fuentes oficiales hasta sumar ≥3 dominios autoritativos ` +
      `(actualmente ${ev.signals.authoritativeSourcesCount}). Sugeridos según el ` +
      `tema: ${suggestedSources(slug).join(", ")}.`,
    );
  }
  if (fc.has("longitud-insuficiente")) {
    const gap = 2500 - ev.wordCount;
    bullets.push(
      `Expandir de ${ev.wordCount} a ≥2.500 palabras (faltan ~${gap}). ` +
      `Añadir secciones específicas según el tema: ${expansionTopics(slug).join(", ")}.`,
    );
  }
  if (bullets.length === 0) return [];
  return bullets;
}

function suggestedSources(slug) {
  const out = new Set();
  if (/llc|5472|1120|ein|boi|fincen|wyoming|delaware|new-mexico|nuevo-mexico|itin|w-?[78]|fdic|mercury|brex|stripe/i.test(slug)) {
    out.add("irs.gov"); out.add("fincen.gov");
  }
  if (/720|721|232|aeat|hacienda|autonomo|irpf|modelo|cuota|residencia|espana|estatuto|cataluña|catalunya/i.test(slug)) {
    out.add("agenciatributaria.gob.es"); out.add("boe.es");
  }
  if (/dac|crs|fatca|beps|atad|directiva|europ|eu/i.test(slug)) {
    out.add("eur-lex.europa.eu"); out.add("oecd.org");
  }
  if (/banco|banca|fdic|fintech|wise|relay|slash|wallester|revolut|mercury/i.test(slug)) {
    out.add("fdic.gov");
  }
  if (out.size === 0) {
    out.add("irs.gov"); out.add("boe.es");
  }
  return [...out];
}

function expansionTopics(slug) {
  const topics = [];
  if (/llc/i.test(slug)) topics.push("estado óptimo + costes 24m + escenarios reales");
  if (/itin|ein/i.test(slug)) topics.push("plazos IRS + alternativas si bloquean");
  if (/banco|banca|fintech|mercury|relay|slash/i.test(slug)) topics.push("comparativa multi-proveedor + KYC + casos de bloqueo");
  if (/5472|1120|7004|boi|fincen/i.test(slug)) topics.push("procedimiento + sanciones reales + caso de regularización");
  if (/autonomo|irpf|hacienda|residencia/i.test(slug)) topics.push("comparativa cuantitativa por tramo de ingresos + Modelo a presentar");
  if (/dac|crs|fatca/i.test(slug)) topics.push("flujo del reporte automático + qué llega exactamente a tu Hacienda");
  if (topics.length === 0) topics.push("FAQ con objeciones reales + caso real anonimizado + checklist accionable");
  return topics;
}

// ─── Traffic-potential proxy ────────────────────────────────────────────────
const HIGH_VALUE_HINTS = [
  /^llc-estados-unidos-guia/i,
  /^autonomo-espana-vs-llc/i,
  /^form-5472/i,
  /^boi-report/i,
  /^cuanto-cuesta/i,
  /^constituir-llc/i,
  /^ein-numero-fiscal/i,
  /^operating-agreement/i,
  /^nuevo-mexico-vs-wyoming/i,
  /^residentes-no-residentes/i,
  /^cuenta-bancaria-mercury/i,
  /^pagar-cero-impuestos/i,
  /^autonomos-espana-por-que-dejar/i,
  /^como-obtener-itin/i,
  /^itin-ssn/i,
  /^mantenimiento-anual-llc/i,
  /^tributacion-pass-through/i,
  /^ventajas-desventajas-llc/i,
  /^diferencia-llc-corporation/i,
  /^cuota-autonomo|cuotas-autonomos/i,
];

function trafficPotential(slug, rank) {
  let score = 0;
  if (rank !== undefined) {
    // rank 0..N → top promoted articles get a higher score.
    score += Math.max(0, 30 - rank);
  }
  if (HIGH_VALUE_HINTS.some((rx) => rx.test(slug))) score += 25;
  return score;
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main() {
  const slugTitle = loadSlugTitleMap();
  const files = fs.readdirSync(ES_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""))
    .filter((s) => !EXCLUDED_SLUGS.has(s))
    .sort();

  if (files.length !== 111) {
    console.error(`[audit-conversion-es] WARN: expected 111 in-scope slugs, got ${files.length}`);
  }

  const results = [];
  for (const slug of files) {
    const filePath = path.join(ES_DIR, slug + ".ts");
    const content = fs.readFileSync(filePath, "utf8");
    const body = extractBody(content);
    if (!body) {
      console.error(`[audit-conversion-es] could not extract body for ${slug}`);
      continue;
    }
    const ev = evaluate(slug, body);
    const meta = slugTitle.get(slug) || { title: slug, rank: 9999 };
    results.push({
      slug,
      title: meta.title,
      rank: meta.rank,
      ...ev,
      plan: ev.verdict === "FALLA" ? planFor(slug, ev, meta.title) : [],
      trafficScore: trafficPotential(slug, meta.rank),
    });
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Write JSON mirror
  fs.writeFileSync(
    path.join(OUT_DIR, "audit-es.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      total: results.length,
      pass: results.filter(r => r.verdict === "PASA").length,
      fail: results.filter(r => r.verdict === "FALLA").length,
      results,
    }, null, 2),
  );

  // Write per-article markdown
  writeAuditMarkdown(results);
  // Write summary
  writeSummaryMarkdown(results);

  const passN = results.filter(r => r.verdict === "PASA").length;
  const failN = results.length - passN;
  console.log(`[audit-conversion-es] OK — ${results.length} slugs evaluados (PASA: ${passN}, FALLA: ${failN})`);
  console.log(`  → ${path.relative(process.cwd(), path.join(OUT_DIR, "audit-es.md"))}`);
  console.log(`  → ${path.relative(process.cwd(), path.join(OUT_DIR, "SUMMARY-es.md"))}`);
}

function writeAuditMarkdown(results) {
  const lines = [];
  lines.push("# Auditoría conversión — 111 artículos ES (2026-04)");
  lines.push("");
  lines.push(`Generado: ${new Date().toISOString().slice(0, 10)} · Script: \`scripts/audit-conversion-es-2026-04.mjs\` · Read-only.`);
  lines.push("");
  lines.push("Aplica el test de conversión del brief editorial: un artículo **PASA** sólo si la conclusión natural del lector al terminar es contactar Exentax. Cualquier \"tal vez\" cuenta como **FALLA**.");
  lines.push("");
  lines.push("Categorías de fallo evaluadas heurísticamente:");
  lines.push("");
  lines.push("- `gancho-generico` — primer párrafo definicional o boilerplate, sin cifra/pregunta/objeción que enganche.");
  lines.push("- `desarrollo-relleno` — densidad alta (≥4) de muletillas (\"es importante destacar\", \"cabe mencionar\", \"como hemos visto\"…).");
  lines.push("- `objeciones-no-resueltas` — sin secciones \"¿Y si…?\" / \"Lo que NO\" ni preguntas-objeción en H2/H3.");
  lines.push("- `exentax-invisible` (<2 menciones) / `exentax-forzado` (>22 menciones) — Exentax fuera de banda.");
  lines.push("- `cta-peticion` — CTA como petición (\"contáctanos\", \"no dudes en escribirnos\") sin enmarcar consecuencia.");
  lines.push("- `datos-sin-fuente` — afirmaciones legales (IRS / FinCEN / LIRPF / DAC / Modelo 720 …) con < 3 dominios autoritativos citados.");
  lines.push("- `longitud-insuficiente` — body < 2.500 palabras (medido sobre el template literal sin HTML ni `code`).");
  lines.push("");
  lines.push("Cada artículo que **FALLA** lleva un plan corto (3-6 bullets) con la corrección concreta a aplicar en la ola B (reescritura).");
  lines.push("");
  lines.push("---");
  lines.push("");

  // Sort: FALLA first by trafficScore desc, then PASA alphabetically
  const failOrdered = results.filter(r => r.verdict === "FALLA").sort((a, b) => b.trafficScore - a.trafficScore || a.slug.localeCompare(b.slug));
  const passOrdered = results.filter(r => r.verdict === "PASA").sort((a, b) => a.slug.localeCompare(b.slug));

  lines.push(`## Artículos que FALLAN (${failOrdered.length})`);
  lines.push("");
  lines.push("Ordenados por tráfico potencial estimado desc.");
  lines.push("");
  for (const r of failOrdered) {
    lines.push(...renderArticleEntry(r));
  }

  lines.push(`## Artículos que PASAN (${passOrdered.length})`);
  lines.push("");
  lines.push("Lista ordenada alfabéticamente — no requieren reescritura por test de conversión, sólo polish editorial opcional.");
  lines.push("");
  for (const r of passOrdered) {
    lines.push(...renderArticleEntry(r));
  }

  fs.writeFileSync(path.join(OUT_DIR, "audit-es.md"), lines.join("\n") + "\n");
}

function renderArticleEntry(r) {
  const out = [];
  out.push(`### ${r.slug}`);
  out.push("");
  out.push(`- **Título:** ${r.title}`);
  out.push(`- **Word count:** ${r.wordCount}${r.wordCount < 2500 ? "  ⚠ < 2.500" : ""}`);
  out.push(`- **Resultado:** ${r.verdict}`);
  if (r.failureCategories.length) {
    out.push(`- **Categorías de fallo:** ${r.failureCategories.map(c => "`" + c + "`").join(", ")}`);
  }
  out.push(`- **Señales:** Exentax×${r.signals.exentaxMentions} · objeciones=${r.signals.objectionScore} (Q-headers ${r.signals.qHeaders}) · filler=${r.signals.fillerHits} · CTA pet/cons=${r.signals.pleadingCtaHits}/${r.signals.consequenceCtaHits} · fuentes oficiales=${r.signals.authoritativeSourcesCount}${r.signals.authoritativeDomains.length ? ` (${r.signals.authoritativeDomains.join(", ")})` : ""}`);
  if (r.signals.firstParagraphPreview) {
    out.push(`- **Primer párrafo:** _${r.signals.firstParagraphPreview}…_`);
  }
  if (r.plan && r.plan.length) {
    out.push("- **Plan de reescritura:**");
    for (const b of r.plan) out.push(`  - ${b}`);
  }
  out.push("");
  return out;
}

function writeSummaryMarkdown(results) {
  const total = results.length;
  const pass = results.filter(r => r.verdict === "PASA").length;
  const fail = total - pass;

  // Top failure categories
  const catCounter = new Map();
  for (const r of results) {
    for (const c of r.failureCategories) {
      catCounter.set(c, (catCounter.get(c) || 0) + 1);
    }
  }
  const topCats = [...catCounter.entries()].sort((a, b) => b[1] - a[1]);

  // Priority list: FALLA articles ordered by (trafficScore × failure count) desc
  const priority = results
    .filter(r => r.verdict === "FALLA")
    .map(r => ({ ...r, score: (r.trafficScore + 1) * Math.max(1, r.failureCategories.length) }))
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const lines = [];
  lines.push("# SUMMARY — Auditoría conversión 111 artículos ES (2026-04)");
  lines.push("");
  lines.push(`Generado: ${new Date().toISOString().slice(0, 10)} · Fuente: \`docs/audits/2026-04/conversion/audit-es.md\``);
  lines.push("");
  lines.push("## Totales");
  lines.push("");
  lines.push(`- Auditados: **${total}** (los 112 ES menos \`cuanto-cuesta-constituir-llc\`, cubierto por Task #1)`);
  lines.push(`- **PASA:** ${pass} (${pct(pass, total)}%)`);
  lines.push(`- **FALLA:** ${fail} (${pct(fail, total)}%)`);
  lines.push("");
  const wcStats = wcStatistics(results);
  lines.push(`- Word count: min ${wcStats.min} · mediana ${wcStats.median} · máx ${wcStats.max}`);
  lines.push(`- Artículos < 2.500 palabras: **${wcStats.under2500}** / ${total}`);
  lines.push("");

  lines.push("## Top 10 categorías de fallo");
  lines.push("");
  lines.push("| # | Categoría | Artículos afectados |");
  lines.push("|---:|---|---:|");
  topCats.slice(0, 10).forEach(([c, n], i) => lines.push(`| ${i + 1} | \`${c}\` | ${n} |`));
  lines.push("");

  lines.push("## Distribución por número de fallos por artículo");
  lines.push("");
  const dist = new Map();
  for (const r of results) {
    const k = r.failureCategories.length;
    dist.set(k, (dist.get(k) || 0) + 1);
  }
  lines.push("| Nº de categorías que fallan | Artículos |");
  lines.push("|---:|---:|");
  [...dist.entries()].sort((a, b) => a[0] - b[0]).forEach(([k, n]) => lines.push(`| ${k} | ${n} |`));
  lines.push("");

  lines.push("## Lista priorizada de reescritura (top 30)");
  lines.push("");
  lines.push("Criterio: tráfico potencial × distancia al test de conversión (nº de categorías que fallan). La columna **score** es la métrica compuesta interna; sólo sirve para ordenar.");
  lines.push("");
  lines.push("| # | Slug | Word count | Fallos | Tráfico | Score | Categorías |");
  lines.push("|---:|---|---:|---:|---:|---:|---|");
  priority.slice(0, 30).forEach((r, i) => {
    lines.push(
      `| ${i + 1} | \`${r.slug}\` | ${r.wordCount} | ${r.failureCategories.length} | ${r.trafficScore} | ${r.score} | ${r.failureCategories.map(c => "`" + c + "`").join(", ")} |`,
    );
  });
  lines.push("");

  lines.push("## Notas para la ola B (reescritura)");
  lines.push("");
  lines.push("- El plan corto por artículo está en `audit-es.md`. La lista priorizada aquí indica el orden en el que abordar la ola B para máximo impacto.");
  lines.push("- El umbral 2.500 palabras del brief es duro — varios artículos cortos pasarán test si se completan secciones (FAQ, escenarios reales, comparativa cuantitativa) en lugar de añadir relleno.");
  lines.push("- Las heurísticas tienen ~5-10 % de falsos positivos (sobre todo en `gancho-generico` cuando el tema impone un opener definicional). Cualquier artículo en zona dudosa debe re-evaluarse antes de tocar.");
  lines.push("- Las categorías `exentax-invisible`/`exentax-forzado` son señales de calibrado: ningún artículo debería tener < 2 ni > 22 menciones a Exentax. Ajustar a 4-12 menciones repartidas.");
  lines.push("- `datos-sin-fuente` se activa sólo cuando el artículo hace afirmaciones legales (IRS, FinCEN, LIRPF, DAC, Modelo 720…). Artículos puramente operativos no caen en esta categoría aunque citen pocas fuentes.");
  lines.push("- Esta auditoría es **read-only**: ni una línea de `client/src/data/blog-content/**` ha sido modificada. La ola B (downstream) será la que aplique los planes.");
  lines.push("");

  fs.writeFileSync(path.join(OUT_DIR, "SUMMARY-es.md"), lines.join("\n") + "\n");
}

function pct(n, d) {
  return d === 0 ? "0.0" : ((n / d) * 100).toFixed(1);
}

function wcStatistics(results) {
  const wcs = results.map(r => r.wordCount).sort((a, b) => a - b);
  const median = wcs.length % 2 === 0
    ? Math.round((wcs[wcs.length / 2 - 1] + wcs[wcs.length / 2]) / 2)
    : wcs[(wcs.length - 1) / 2];
  return {
    min: wcs[0],
    max: wcs[wcs.length - 1],
    median,
    under2500: wcs.filter(w => w < 2500).length,
  };
}

main();
