#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content");
const I18N_DIR = path.join(ROOT, "client/src/data/blog-i18n");
const SLUGS_FILE = path.join(ROOT, "client/src/data/blog-posts-slugs.ts");
const POSTS_FILE = path.join(ROOT, "client/src/data/blog-posts.ts");
const FAQ_FILE = path.join(ROOT, "client/src/components/sections/faq-data.tsx");
const OUT_FILE = path.join(ROOT, "docs/blog/audit-2026.md");

const LANGS = ["es", "en", "ca", "de", "fr", "pt"];
const TARGET_TRANSLATIONS = ["en", "ca", "de", "fr", "pt"];

const readText = async (p) => fs.readFile(p, "utf8");

function stripBackticks(src) {
  const m = src.match(/export default\s*`([\s\S]*?)`;\s*$/);
  return m ? m[1] : src;
}

function htmlToText(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(s) {
  return htmlToText(s).split(/\s+/).filter(Boolean).length;
}

// ---------- Citation / claim taxonomy ----------
const LEGAL_KEYWORDS = [
  // Spain claims
  { re: /\bIRPF\b/i, area: "ES-IRPF" },
  { re: /\bautón?omo[s]?\b/i, area: "ES-RETA" },
  { re: /\bModelo\s?720\b/i, area: "ES-Modelo720" },
  { re: /\bModelo\s?721\b/i, area: "ES-Modelo721-cripto" },
  { re: /\bModelo\s?232\b/i, area: "ES-Modelo232-vinculadas" },
  { re: /\bHacienda\b/i, area: "ES-AEAT" },
  { re: /\bsanci[oó]n|multa|infracci[oó]n/i, area: "ES-sanciones" },
  { re: /\bresidencia fiscal|residente fiscal\b/i, area: "ES-Residencia" },
  { re: /\b183 d[ií]as\b/i, area: "ES-183d" },
  { re: /\bsociedad(es)? extranjera|transparencia fiscal internacional|CFC\b/i, area: "ES-TFI/CFC" },
  { re: /\batribuci[oó]n de rentas\b/i, area: "ES-AtribucionRentas" },
  { re: /\bDGT\b|consulta vinculante/i, area: "ES-DGT" },
  { re: /\bTEAC\b/i, area: "ES-TEAC" },
  { re: /\bIVA\b/i, area: "ES-IVA" },
  // USA
  { re: /\bForm\s?5472\b/i, area: "US-5472" },
  { re: /\bForm\s?1120\b/i, area: "US-1120" },
  { re: /\bForm\s?7004\b/i, area: "US-7004" },
  { re: /\bForm\s?W-?8\s?BEN(-E)?\b/i, area: "US-W8BEN" },
  { re: /\bECI\b|Effectively Connected Income/i, area: "US-ECI" },
  { re: /\bFDAP\b/i, area: "US-FDAP" },
  { re: /\bIRS\b/i, area: "US-IRS" },
  { re: /\bFinCEN\b|\bBOI\b|Corporate Transparency Act|\bCTA\b/i, area: "US-CTA/BOI" },
  { re: /\bFATCA\b/i, area: "US-FATCA" },
  { re: /\bBank Secrecy Act\b|\bBSA\b/i, area: "US-BSA" },
  { re: /\bdisregarded entity|pass-through|check[- ]the[- ]box\b/i, area: "US-CheckTheBox" },
  { re: /\bregistered agent\b/i, area: "US-RegisteredAgent" },
  // Treaty / OECD / EU
  { re: /\bCDI\b|convenio.*doble imposici[oó]n|tax treaty/i, area: "Treaty-CDI" },
  { re: /\bestablecimiento permanente|permanent establishment\b/i, area: "OECD-PE" },
  { re: /\bBEPS\b/i, area: "OECD-BEPS" },
  { re: /\bDAC\s?[6-8]\b/i, area: "EU-DAC" },
  { re: /\bATAD\b/i, area: "EU-ATAD" },
  { re: /\bCRS\b/i, area: "OECD-CRS" },
];

// Citation patterns that satisfy a legal claim
const CITATION_PATTERNS = [
  /Ley\s?(35\/2006|27\/2014|58\/2003|10\/2010|11\/2021)/i,
  /Real Decreto\s?\d+\/\d{4}/i,
  /Reglamento\s?(General de Gesti[oó]n|del IRPF|del IS)/i,
  /art[íi]culo\s?\d+(\.\d+)?\s+(de la )?Ley/i,
  /art\.\s?\d+\s+(LIRPF|LIS|LGT)/i,
  /\bIRC\s?(§|Section)\s?\d+/i,
  /\b26\s?USC\s?\d+/i,
  /\b31\s?USC\s?\d+/i,
  /Treas\.?\s?Reg\.?\s?\u00a7?\s?\d+/i,
  /Treasury Regulation\s?\d+/i,
  /301\.7701-[1-3]/,
  /\bRev\.?\s?(Proc|Rul)\.?\s?\d+/i,
  /\bIRS\s?Notice\s?\d+/i,
  /OECD\s?Model\s?(Tax\s?)?Convention/i,
  /Modelo\s?(Convenio)?\s?OCDE/i,
  /BOE-A-\d{4}-\d+/i,
  /STS\s?\d+\/\d{4}/i,
  /STJUE|TJUE|C-\d+\/\d+/i,
  /DGT\s?V\d+-\d+/i,
  /TEAC\s?\d+\/\d{4}/i,
  /\bFinCEN\s?(Notice|Guidance|FIN-)\b/i,
  /Corporate Transparency Act/i,
  /CDI\s?Espa[ñn]a-?(EE\.?UU\.?|Estados Unidos)/i,
];

const ANTI_LLC_PHRASES = [
  /\bilegal(es)?\b/i,
  /\bopaco\b|\bopacidad\b/i,
  /\bevadir\b|\bevasi[oó]n fiscal\b/i,
  /\bblanqueo\b/i,
  /\bocultar\b/i,
  /\bparaiso fiscal|paraíso fiscal\b/i,
];
const PRO_LLC_FRAMING = [
  /\blegal(es)?\b/i,
  /\bperfectamente legal\b/i,
  /\bplanificaci[oó]n fiscal l[ií]cita\b/i,
  /\belusi[oó]n fiscal l[ií]cita\b/i,
  /\beconom[ií]a de opci[oó]n\b/i,
];

const CTA_PATTERNS = [
  /\/contacto/i, /\/precios/i, /\/calculadora/i, /\/asesor/i,
  /\bExentax\b/i, /reserv(a|ar)|agend(a|ar)|hablemos|cont[aá]ctanos/i,
];

const BANK_MENTIONS = {
  Mercury: /\bMercury\b/g,
  Slash: /\bSlash\b/g,
  Wise: /\bWise(\s+Business)?\b/g,
  Relay: /\bRelay\b/g,
  Wallester: /\bWallester\b/g,
  Revolut: /\bRevolut\b/g,
  Brex: /\bBrex\b/g,
};

const YEAR_2026_RE = /\b2026\b/g;
const STALE_YEARS = /\b(2021|2022|2023|2024|2025)\b/g;

function countMatches(re, text) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function detectClaims(text) {
  const claims = [];
  for (const k of LEGAL_KEYWORDS) {
    if (k.re.test(text)) claims.push(k.area);
  }
  return [...new Set(claims)];
}

function detectCitations(text) {
  const hits = [];
  for (const re of CITATION_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  return [...new Set(hits)];
}

function internalLinks(text) {
  const re = /(?:href=["']|\]\()\/(es|en|ca|de|fr|pt)\/(blog\/[a-z0-9-]+|contacto|precios|calculadora|servicios|sobre)/g;
  return [...text.matchAll(re)].map((m) => m[0]);
}

function emDashTitle(title) {
  return (title.match(/—|–/g) || []).length;
}

// ---------- Loaders ----------
async function loadSlugs() {
  const src = await readText(SLUGS_FILE);
  // Slugs are keys at start of line: "  "slug": { ... }"
  const list = [...src.matchAll(/^\s{2}"([a-z0-9][a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]);
  return list;
}

async function loadEsMeta() {
  const src = await readText(POSTS_FILE);
  // Each entry looks like { slug: "...", title: "...", excerpt: "...", metaTitle: "...", metaDescription: "...", ... }
  const entries = {};
  const blockRe = /\{\s*slug:\s*"([^"]+)"[\s\S]*?(?=\},\s*\{|\}\s*\];)/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const slug = m[1];
    const block = m[0];
    const title = (block.match(/title:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || [])[1] || "";
    const excerpt = (block.match(/excerpt:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || [])[1] || "";
    const metaTitle = (block.match(/metaTitle:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || [])[1] || "";
    const metaDescription = (block.match(/metaDescription:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/) || [])[1] || "";
    const keywords = [...block.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    entries[slug] = { title, excerpt, metaTitle, metaDescription, keywords };
  }
  return entries;
}

async function loadLangMeta(lang) {
  const file = path.join(I18N_DIR, `${lang}.ts`);
  let src;
  try { src = await readText(file); } catch { return {}; }
  const entries = {};
  const re = /"([^"]+)":\s*\{\s*title:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*excerpt:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*metaTitle:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*,\s*metaDescription:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    entries[m[1]] = {
      title: m[2], excerpt: m[3], metaTitle: m[4], metaDescription: m[5],
    };
  }
  return entries;
}

async function loadContent(lang, slug) {
  const file = path.join(CONTENT_DIR, lang, `${slug}.ts`);
  try {
    const src = await readText(file);
    return stripBackticks(src);
  } catch {
    return null;
  }
}

// ---------- Main audit ----------
function scoreArticle({ text, title, metaTitle, metaDescription }) {
  if (!text) return null;
  const wc = wordCount(text);
  const claims = detectClaims(text);
  const citations = detectCitations(text);
  const links = internalLinks(text);
  const ctaHits = CTA_PATTERNS.reduce((a, re) => a + countMatches(re, text), 0);
  const banks = Object.fromEntries(
    Object.entries(BANK_MENTIONS).map(([k, re]) => [k, countMatches(re, text)])
  );
  const antiLlc = ANTI_LLC_PHRASES.reduce((a, re) => a + countMatches(re, text), 0);
  const proLlc = PRO_LLC_FRAMING.reduce((a, re) => a + countMatches(re, text), 0);
  const has2026 = countMatches(YEAR_2026_RE, text);
  const staleYears = countMatches(STALE_YEARS, text);
  const cfcMentioned = /CFC|transparencia fiscal internacional|TFI/i.test(text);
  const dac6 = /DAC\s?6/i.test(text);
  const atad = /ATAD/i.test(text);
  const treatyCited = /CDI|convenio.*doble imposici[oó]n|Article\s?5\s?OECD|art[íi]culo\s?5\s?OCDE/i.test(text);

  return {
    wc, claims, citations,
    citationGap: claims.length > 0 && citations.length === 0,
    citationCoverage: claims.length === 0 ? null : +(citations.length / claims.length).toFixed(2),
    internalLinks: links.length,
    ctaHits,
    banks,
    antiLlc, proLlc,
    has2026, staleYears,
    cfcMentioned, dac6, atad, treatyCited,
    titleLen: title.length,
    metaTitleLen: metaTitle.length,
    metaDescLen: metaDescription.length,
    titleEmDashes: emDashTitle(title),
    metaTitleEmDashes: emDashTitle(metaTitle),
  };
}

function pct(n, d) { return d === 0 ? "0%" : `${Math.round((n / d) * 100)}%`; }

async function main() {
  const slugs = await loadSlugs();
  const esMeta = await loadEsMeta();
  const langMeta = {};
  for (const lang of LANGS) langMeta[lang] = lang === "es" ? esMeta : await loadLangMeta(lang);

  const rows = [];
  for (const slug of slugs) {
    const row = { slug, langs: {} };
    for (const lang of LANGS) {
      const meta = langMeta[lang][slug] || {};
      const text = await loadContent(lang, slug);
      row.langs[lang] = {
        present: text != null,
        meta,
        score: scoreArticle({
          text: text || "",
          title: meta.title || "",
          metaTitle: meta.metaTitle || "",
          metaDescription: meta.metaDescription || "",
        }),
      };
    }
    rows.push(row);
  }

  // ---------- Aggregate ----------
  const total = rows.length;
  const esRows = rows.map((r) => {
    const l = r.langs.es;
    return { slug: r.slug, present: l.present, meta: l.meta || {}, score: l.score };
  });
  const present = (lang) => rows.filter((r) => r.langs[lang].present).length;

  const wcStats = (lang) => {
    const arr = rows.map((r) => r.langs[lang].score?.wc || 0).filter((n) => n > 0);
    arr.sort((a, b) => a - b);
    return {
      n: arr.length,
      min: arr[0] || 0,
      p25: arr[Math.floor(arr.length * 0.25)] || 0,
      median: arr[Math.floor(arr.length * 0.5)] || 0,
      p75: arr[Math.floor(arr.length * 0.75)] || 0,
      max: arr[arr.length - 1] || 0,
      under800: arr.filter((n) => n < 800).length,
      under1200: arr.filter((n) => n < 1200).length,
    };
  };

  // Banking balance
  const bankTotals = { Mercury: 0, Slash: 0, Wise: 0, Relay: 0, Wallester: 0, Revolut: 0, Brex: 0 };
  for (const r of esRows) {
    if (!r.score) continue;
    for (const k of Object.keys(bankTotals)) bankTotals[k] += r.score.banks[k] || 0;
  }
  const articlesMentioning = (k) => esRows.filter((r) => (r.score?.banks?.[k] || 0) > 0).length;

  // Citation gap candidates ES
  const esGaps = esRows
    .filter((r) => r.score && r.score.claims.length >= 3 && r.score.citations.length === 0)
    .map((r) => ({ slug: r.slug, claims: r.score.claims }));

  // CFC missing where likely needed
  const cfcCandidates = esRows.filter((r) => {
    if (!r.score) return false;
    const t = ((r.meta.title || "") + " " + (r.meta.excerpt || "")).toLowerCase();
    const likely = /residencia|residente|hacienda|autonomo|autónomo|espa[ñn]a|optimiza|estructura|holding|nomada|nómada|estonia|andorra|dubai|hong kong|portugal|nhr|beckham|paraiso|paraíso/.test(t);
    return likely && !r.score.cfcMentioned;
  });

  // Em-dash heavy titles ES
  const emDashTitles = esRows.filter((r) => (r.score?.titleEmDashes || 0) >= 1 || (((r.meta.title || "").match(/:/g)) || []).length >= 2);

  // Anti-LLC framing
  const antiFraming = esRows
    .filter((r) => (r.score?.antiLlc || 0) > 0)
    .map((r) => ({ slug: r.slug, antiLlc: r.score.antiLlc, proLlc: r.score.proLlc }));

  // Stale years (2021-2025) without 2026
  const staleRefs = esRows
    .filter((r) => r.score && r.score.staleYears > 0 && r.score.has2026 === 0)
    .map((r) => ({ slug: r.slug, staleYears: r.score.staleYears }));

  // SEO meta length issues
  const metaIssues = [];
  for (const r of esRows) {
    const tl = r.score?.metaTitleLen || 0;
    const dl = r.score?.metaDescLen || 0;
    const issues = [];
    if (tl < 30 || tl > 65) issues.push(`metaTitle ${tl}ch`);
    if (dl < 110 || dl > 165) issues.push(`metaDesc ${dl}ch`);
    if (issues.length) metaIssues.push({ slug: r.slug, issues: issues.join(", ") });
  }

  // Translation parity
  const translationGaps = {};
  for (const lang of TARGET_TRANSLATIONS) {
    translationGaps[lang] = rows.filter((r) => !r.langs[lang].present || !r.langs[lang].meta?.title).map((r) => r.slug);
  }

  // FAQ analysis
  let faqText = "";
  try { faqText = await readText(FAQ_FILE); } catch {}
  const faqClaims = detectClaims(faqText);
  const faqCitations = detectCitations(faqText);
  const faqQuestions = (faqText.match(/\bq:\s*\S/g) || []).length;
  const faqAnswers = (faqText.match(/\ba:\s*\S/g) || []).length;

  // ---------- Build report ----------
  const lines = [];
  const today = new Date().toISOString().slice(0, 10);
  lines.push(`# Auditoría integral del blog Exentax — 2026`);
  lines.push("");
  lines.push(`**Fecha:** ${today}  `);
  lines.push(`**Alcance:** ${total} artículos × ${LANGS.length} idiomas (${total * LANGS.length} ficheros) + FAQ.  `);
  lines.push(`**Línea editorial fijada por el cliente:** pro-LLC, respaldo a Exentax, veracidad 2026, sin alarmismo, citación legal precisa, inclusión de CFC/TFI cuando aplique.  `);
  lines.push(`**Naturaleza del documento:** sólo lectura — ningún contenido fue modificado en esta tarea.`);
  lines.push("");

  lines.push(`## 0. Marco legal de referencia para reescrituras`);
  lines.push("");
  lines.push(`Toda afirmación legal o regulatoria en el blog y la FAQ debe citar al menos una de estas fuentes reales (no inventar artículos):`);
  lines.push("");
  lines.push(`**España:** Ley 35/2006 IRPF (LIRPF), Ley 27/2014 IS (LIS), Ley 58/2003 General Tributaria (LGT) — en particular art. 15 (conflicto en aplicación de la norma) y art. 16 (simulación), Real Decreto 1065/2007 (Reglamento General de Gestión e Inspección), Real Decreto 439/2007 (RIRPF), Modelo 720 (declaración de bienes en el extranjero, umbral 50.000 € por categoría — atención: STJUE C-788/19 de 27/01/2022 anuló el régimen sancionador específico, sustituido por Ley 5/2022), Modelo 232 (operaciones vinculadas), Modelo 721 (criptoactivos en el extranjero), Modelo 100 (IRPF), DGT consultas vinculantes, doctrina del TEAC, CDI España–EE.UU. (BOE 22/12/1990, Protocolo de 2013 en vigor desde 27/11/2019).`);
  lines.push("");
  lines.push(`**EE.UU.:** Treas. Reg. §301.7701-1 a §301.7701-3 (check-the-box), IRC §882 (ECI de personas extranjeras), IRC §871 (FDAP), IRC §6038A y Treas. Reg. §1.6038A (Form 5472), Form 1120 pro forma, Corporate Transparency Act (31 USC §5336) y FinCEN BOI Rule (31 CFR §1010.380), Bank Secrecy Act, FATCA (IRC §1471–§1474), W-8BEN/W-8BEN-E.  `);
  lines.push(`**Estados:** New Mexico LLC Act (NMSA §53-19), Wyoming LLC Act (Wyo. Stat. §17-29), Delaware LLC Act (6 Del. C. §18).`);
  lines.push("");
  lines.push(`**EU/OCDE:** DAC6 (Directiva 2018/822, transpuesta por Ley 10/2020 y RD 243/2021), DAC7 (Directiva 2021/514), DAC8 (Directiva 2023/2226), ATAD I (2016/1164) y ATAD II (2017/952), CRS (Directiva 2014/107), OECD Model Tax Convention (Art. 5 establecimiento permanente, Art. 7 beneficios empresariales), BEPS Actions 5/6/7/13/15.`);
  lines.push("");
  lines.push(`**CFC / Transparencia Fiscal Internacional (España):** art. 100 LIS y art. 91 LIRPF — aplica cuando la entidad no residente está sometida a baja tributación (< 75% de la que correspondería en España) y obtiene rentas pasivas; con la modificación de Ley 11/2021 (lucha contra el fraude) se reforzó su ámbito. **Una LLC operativa de servicios profesionales ejecutados por el socio residente en España normalmente NO encaja en el supuesto de CFC pasiva, pero la renta se imputa por atribución de rentas (art. 87 LIRPF) si la LLC se considera entidad en régimen de atribución.**`);
  lines.push("");
  lines.push(`**Referencia "20 de febrero de 2020" del briefing:** ⚠️ **TO_VERIFY**. No se ha localizado en mi base de conocimiento un evento jurídico-fiscal español inequívoco de esa fecha exacta vinculado a LLCs o Modelo 720 (la sentencia del TJUE sobre Modelo 720 es **C-788/19, de 27/01/2022**; la STS sobre LLCs como entidades en atribución es de 2018). **Antes de citar esta fecha en cualquier artículo, debe verificarse manualmente** (BOE, CENDOJ, base de datos AEAT). No incluir hasta confirmación.`);
  lines.push("");

  lines.push(`## 1. Resumen ejecutivo`);
  lines.push("");
  lines.push(`| Métrica | Valor |`);
  lines.push(`|---|---|`);
  lines.push(`| Artículos catalogados | ${total} |`);
  lines.push(`| Idiomas soportados | ${LANGS.join(", ")} |`);
  for (const lang of LANGS) {
    lines.push(`| Contenido presente (${lang.toUpperCase()}) | ${present(lang)} / ${total} |`);
  }
  const es = wcStats("es");
  lines.push(`| ES — mediana de palabras | ${es.median} |`);
  lines.push(`| ES — artículos < 800 palabras | ${es.under800} (${pct(es.under800, total)}) |`);
  lines.push(`| ES — artículos < 1200 palabras | ${es.under1200} (${pct(es.under1200, total)}) |`);
  lines.push(`| ES — artículos con huecos de citación legal severos (3+ claims, 0 citas) | ${esGaps.length} |`);
  lines.push(`| ES — artículos con probable necesidad de CFC sin mencionarlo | ${cfcCandidates.length} |`);
  lines.push(`| ES — referencias 2021-2025 sin "2026" | ${staleRefs.length} |`);
  lines.push(`| ES — títulos con em-dash o doble dos puntos | ${emDashTitles.length} |`);
  lines.push(`| ES — meta-título / meta-descripción fuera de rango | ${metaIssues.length} |`);
  lines.push(`| FAQ — preguntas / respuestas | ${faqQuestions} / ${faqAnswers} |`);
  lines.push(`| FAQ — claims legales detectados | ${faqClaims.length} |`);
  lines.push(`| FAQ — citas legales detectadas | ${faqCitations.length} |`);
  lines.push("");

  lines.push(`## 2. Cobertura de palabras (todos los idiomas)`);
  lines.push("");
  lines.push(`| Idioma | n | min | p25 | mediana | p75 | max | < 800 |`);
  lines.push(`|---|---:|---:|---:|---:|---:|---:|---:|`);
  for (const lang of LANGS) {
    const s = wcStats(lang);
    lines.push(`| ${lang.toUpperCase()} | ${s.n} | ${s.min} | ${s.p25} | ${s.median} | ${s.p75} | ${s.max} | ${s.under800} |`);
  }
  lines.push("");
  lines.push(`> Estándar mínimo objetivo: 800 palabras / artículo. Guías "completa" o "guía 2026" deben superar 1500.`);
  lines.push("");

  lines.push(`## 3. Equilibrio de stack bancario en ES`);
  lines.push("");
  lines.push(`Total de menciones en cuerpos ES y nº de artículos donde aparece cada marca:`);
  lines.push("");
  lines.push(`| Banco / fintech | Menciones totales | Artículos donde aparece |`);
  lines.push(`|---|---:|---:|`);
  for (const k of Object.keys(bankTotals)) {
    lines.push(`| ${k} | ${bankTotals[k]} | ${articlesMentioning(k)} |`);
  }
  lines.push("");
  lines.push(`**Lectura editorial:** Mercury sigue siendo la opción ancla por madurez (Column NA, FDIC pass-through hasta $5M con sweep), pero el cliente ha pedido **promover Slash, Wise Business y Relay** y **moderar el peso relativo de Mercury**. Acción en Task #2: en cada guía bancaria ofrecer trío Mercury + Relay + Slash, y para multi-divisa Wise Business + Wallester (IBAN euro). Mantener Revolut como complemento, no como núcleo.`);
  lines.push("");

  lines.push(`## 4. Huecos de citación legal severos (ES)`);
  lines.push("");
  lines.push(`Artículos que mencionan ≥3 áreas legales/regulatorias **sin ninguna cita verificable**. Prioridad alta para Task #2:`);
  lines.push("");
  if (esGaps.length === 0) {
    lines.push(`_Ningún caso severo._`);
  } else {
    lines.push(`| # | Slug | Áreas legales mencionadas |`);
    lines.push(`|---:|---|---|`);
    esGaps.slice(0, 60).forEach((g, i) => {
      lines.push(`| ${i + 1} | \`${g.slug}\` | ${g.claims.join(", ")} |`);
    });
    if (esGaps.length > 60) lines.push(`| … | _y ${esGaps.length - 60} más_ | |`);
  }
  lines.push("");

  lines.push(`## 5. CFC / TFI: artículos donde falta y probablemente debería estar`);
  lines.push("");
  lines.push(`El cliente exige tratar CFC rules. Estos artículos hablan de residencia / autónomo en España / estructuras / nómadas / jurisdicciones de baja tributación, pero **no mencionan CFC ni transparencia fiscal internacional**:`);
  lines.push("");
  if (cfcCandidates.length === 0) {
    lines.push(`_Ninguno detectado._`);
  } else {
    cfcCandidates.slice(0, 60).forEach((r) => lines.push(`- \`${r.slug}\``));
    if (cfcCandidates.length > 60) lines.push(`- _y ${cfcCandidates.length - 60} más_`);
  }
  lines.push("");
  lines.push(`**Recomendación de bloque-tipo (≤120 palabras) a insertar donde aplique:**`);
  lines.push("");
  lines.push(`> "Si tu LLC es operativa (servicios reales que tú prestas) y tributa en EE.UU. como entidad transparente, en España las rentas no se imputan por el régimen de **transparencia fiscal internacional** (art. 100 LIS / art. 91 LIRPF), porque ese régimen aplica fundamentalmente a entidades que generan rentas pasivas con baja tributación. Lo que sí ocurre es que esos beneficios se integran en tu IRPF por **atribución de rentas** (art. 87 LIRPF), tributando como rendimientos de actividad económica. Esto **no es elusión**, es la mecánica que la propia normativa española prevé para entidades extranjeras consideradas transparentes."`);
  lines.push("");

  lines.push(`## 6. Veracidad 2026 — referencias temporales obsoletas`);
  lines.push("");
  lines.push(`Artículos que contienen años 2021-2025 sin actualización a 2026:`);
  lines.push("");
  if (staleRefs.length === 0) {
    lines.push(`_Ninguno._`);
  } else {
    staleRefs.slice(0, 80).forEach((r) => lines.push(`- \`${r.slug}\` (${r.staleYears} ocurrencias)`));
    if (staleRefs.length > 80) lines.push(`- _y ${staleRefs.length - 80} más_`);
  }
  lines.push("");

  lines.push(`## 7. Framing pro-LLC — riesgo de tono perjudicial`);
  lines.push("");
  lines.push(`Artículos donde aparecen términos potencialmente negativos (ilegal, opaco, evasión, ocultar, paraíso fiscal). **Revisar contexto** — pueden ser usos defensivos correctos (p. ej. "no es opaco frente a las autoridades"), pero deben quedar enmarcados de forma que defiendan la legalidad de la LLC:`);
  lines.push("");
  if (antiFraming.length === 0) {
    lines.push(`_Ningún caso._`);
  } else {
    lines.push(`| Slug | Términos negativos | Términos positivos |`);
    lines.push(`|---|---:|---:|`);
    antiFraming.slice(0, 50).forEach((r) => lines.push(`| \`${r.slug}\` | ${r.antiLlc} | ${r.proLlc} |`));
    if (antiFraming.length > 50) lines.push(`| _y ${antiFraming.length - 50} más_ | | |`);
  }
  lines.push("");

  lines.push(`## 8. Títulos con em-dash o doble dos puntos`);
  lines.push("");
  lines.push(`El cliente quiere **menos em-dashes y menos títulos en cascada**. Candidatos a reescribir título y metaTitle:`);
  lines.push("");
  if (emDashTitles.length === 0) {
    lines.push(`_Ninguno._`);
  } else {
    emDashTitles.slice(0, 60).forEach((r) => lines.push(`- \`${r.slug}\` → "${r.meta.title}"`));
    if (emDashTitles.length > 60) lines.push(`- _y ${emDashTitles.length - 60} más_`);
  }
  lines.push("");

  lines.push(`## 9. SEO — meta-título / meta-descripción fuera de rango (ES)`);
  lines.push("");
  lines.push(`Rangos objetivo: metaTitle 30-65 caracteres, metaDescription 110-165 caracteres.`);
  lines.push("");
  if (metaIssues.length === 0) {
    lines.push(`_Sin incidencias._`);
  } else {
    lines.push(`| Slug | Incidencias |`);
    lines.push(`|---|---|`);
    metaIssues.slice(0, 80).forEach((r) => lines.push(`| \`${r.slug}\` | ${r.issues} |`));
    if (metaIssues.length > 80) lines.push(`| _y ${metaIssues.length - 80} más_ | |`);
  }
  lines.push("");

  lines.push(`## 10. Paridad de traducciones`);
  lines.push("");
  for (const lang of TARGET_TRANSLATIONS) {
    const gaps = translationGaps[lang];
    lines.push(`### ${lang.toUpperCase()} — faltantes: ${gaps.length}`);
    if (gaps.length === 0) lines.push(`_OK._`);
    else {
      gaps.slice(0, 30).forEach((s) => lines.push(`- \`${s}\``));
      if (gaps.length > 30) lines.push(`- _y ${gaps.length - 30} más_`);
    }
    lines.push("");
  }

  lines.push(`## 11. CTAs e enlazado interno`);
  lines.push("");
  const noCta = esRows.filter((r) => r.score && r.score.ctaHits === 0);
  const fewLinks = esRows.filter((r) => r.score && r.score.internalLinks < 3);
  lines.push(`- Artículos ES sin ningún CTA detectado (Exentax / contacto / precios / calculadora / "reserva"): **${noCta.length}**`);
  lines.push(`- Artículos ES con < 3 enlaces internos: **${fewLinks.length}**`);
  lines.push("");
  if (noCta.length > 0) {
    lines.push(`**Sin CTA (primeros 30):**`);
    noCta.slice(0, 30).forEach((r) => lines.push(`- \`${r.slug}\``));
    lines.push("");
  }
  if (fewLinks.length > 0) {
    lines.push(`**Pocos enlaces internos (primeros 30):**`);
    fewLinks.slice(0, 30).forEach((r) => lines.push(`- \`${r.slug}\` (${r.score.internalLinks} enlaces)`));
    lines.push("");
  }

  lines.push(`## 12. FAQ — análisis específico`);
  lines.push("");
  lines.push(`- Preguntas detectadas: **${faqQuestions}**`);
  lines.push(`- Respuestas detectadas: **${faqAnswers}**`);
  lines.push(`- Áreas legales mencionadas en respuestas: ${faqClaims.length === 0 ? "_ninguna_" : faqClaims.join(", ")}`);
  lines.push(`- Citas legales formales detectadas: ${faqCitations.length === 0 ? "**0** — la FAQ debe citar al menos LIRPF, LIS, LGT, Treas. Reg. §301.7701-3, CDI España-EE.UU. y CTA/BOI" : faqCitations.join(", ")}`);
  lines.push("");

  lines.push(`## 13. Plan de prioridades sugerido (entrada a Task #2)`);
  lines.push("");
  lines.push(`**Tier S — máxima prioridad** (artículos pilar, alto tráfico potencial, alto riesgo legal sin citar):`);
  const tierS = [
    "llc-estados-unidos-guia-completa-2026",
    "form-5472-que-es-como-presentarlo",
    "pagar-cero-impuestos-legalmente-llc",
    "autonomo-espana-vs-llc-estados-unidos",
    "tributacion-pass-through-llc-como-funciona",
    "residentes-no-residentes-llc-diferencias",
    "fiscalidad-internacional-emprendedores-digitales",
    "nomada-digital-residencia-fiscal",
    "ventajas-desventajas-llc-no-residentes",
    "constituir-llc-proceso-paso-a-paso",
  ];
  tierS.forEach((s) => lines.push(`- \`${s}\``));
  lines.push("");
  lines.push(`**Tier A — alta prioridad** (compliance fundamental):`);
  const tierA = [
    "ein-numero-fiscal-llc-como-obtenerlo",
    "operating-agreement-llc-que-es",
    "mantenimiento-anual-llc-obligaciones",
    "registered-agent-que-es-por-que-necesitas",
    "prevencion-blanqueo-capitales-llc",
    "que-es-irs-guia-duenos-llc",
    "cuanto-cuesta-constituir-llc",
    "extension-irs-form-1120-como-solicitarla",
    "itin-ssn-que-son-como-obtenerlos",
    "nuevo-mexico-vs-wyoming-vs-delaware",
  ];
  tierA.forEach((s) => lines.push(`- \`${s}\``));
  lines.push("");
  lines.push(`**Tier B — media prioridad** (banca, operativa, vertical-specific). Resto del catálogo, agrupado por bloques:`);
  lines.push(`- **Banca y pagos:** cuenta-bancaria-mercury-llc-extranjero, bancos-vs-fintech-llc-donde-abrir-cuenta, evitar-bloqueos-mercury-wise-revolut, wise-business-llc-guia, pasarelas-pago-llc-stripe-paypal-dodo, due-diligence-bancario-llc-americana, tiempos-pagos-ach-wire-transfer, iban-swift-routing-number-que-son, cambiar-divisas-llc-mejores-opciones.`);
  lines.push(`- **Verticales:** llc-creadores-contenido-youtube-twitch, llc-agencias-marketing-digital, llc-desarrolladores-software-saas, amazon-ecommerce-llc-vender-online, criptomonedas-trading-llc-impuestos.`);
  lines.push(`- **Operativa España:** errores-fiscales-freelancers-espanoles, autonomos-espana-por-que-dejar-de-serlo, impuestos-clientes-internacionales-espana, iva-servicios-digitales-internacional.`);
  lines.push(`- **Resto:** todos los demás slugs hasta completar los ${total}.`);
  lines.push("");

  lines.push(`## 14. Estándar editorial obligatorio para Task #2 (a aplicar artículo por artículo)`);
  lines.push("");
  lines.push(`1. **Pro-LLC, pro-Exentax, sin alarmismo.** Toda afirmación de riesgo debe ir acompañada de "y así es como Exentax lo gestiona correctamente".`);
  lines.push(`2. **Citar la ley.** Cada afirmación legal lleva una referencia real (ver §0). Si una afirmación no se puede sostener con norma, se reformula o se elimina.`);
  lines.push(`3. **2026 en todas las cifras y fechas.** Umbrales, plazos, formularios, tipos impositivos: revisar y datar.`);
  lines.push(`4. **CFC/TFI tratado correctamente:** distinguir entre TFI (rentas pasivas, art. 100 LIS / art. 91 LIRPF) y atribución de rentas (art. 87 LIRPF) para LLCs operativas.`);
  lines.push(`5. **Elusión lícita ≠ evasión.** Citar art. 15 LGT (conflicto en aplicación de la norma) y art. 16 LGT (simulación) cuando se hable de planificación.`);
  lines.push(`6. **Hacienda con precisión.** Modelo 720 (50.000 €/categoría, régimen sancionador post-STJUE C-788/19), Modelo 232 (vinculadas), Modelo 721 (cripto en el extranjero).`);
  lines.push(`7. **Stack bancario equilibrado:** Mercury + Relay + Slash en banca operativa USD; Wise Business + Wallester en multi-divisa; Revolut como complemento.`);
  lines.push(`8. **Mínimo 800 palabras**, 1500 para guías "completas".`);
  lines.push(`9. **3+ enlaces internos** y **1 CTA explícito a Exentax** (precios, contacto o calculadora) por artículo.`);
  lines.push(`10. **Títulos sin em-dash y como máximo un dos puntos**. MetaTitle 30-65 ch, metaDescription 110-165 ch.`);
  lines.push(`11. **No tocar la fecha "20 de febrero de 2020"** del briefing hasta verificarla manualmente.`);
  lines.push(`12. **FAQ:** reescribir incluyendo citas a LIRPF, LIS, LGT, Treas. Reg. §301.7701-3, CDI España-EE.UU., 31 USC §5336 (CTA/BOI).`);
  lines.push("");

  lines.push(`## 15. Anexo — métricas por artículo (ES)`);
  lines.push("");
  lines.push(`| # | Slug | Palabras | Claims | Citas | Cob. | Enl. int. | CTA | 2026 | Stale | CFC | em-dash |`);
  lines.push(`|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|:-:|:-:|`);
  esRows.forEach((r, i) => {
    const s = r.score;
    if (!s) {
      lines.push(`| ${i + 1} | \`${r.slug}\` | ⛔ | – | – | – | – | – | – | – | – | – |`);
      return;
    }
    lines.push(
      `| ${i + 1} | \`${r.slug}\` | ${s.wc} | ${s.claims.length} | ${s.citations.length} | ${s.citationCoverage ?? "–"} | ${s.internalLinks} | ${s.ctaHits} | ${s.has2026} | ${s.staleYears} | ${s.cfcMentioned ? "✓" : "·"} | ${s.titleEmDashes ? "⚠" : "·"} |`
    );
  });
  lines.push("");

  lines.push(`---`);
  lines.push(`_Informe generado por \`scripts/blog-audit-2026.mjs\`. No modifica contenido. Próximo paso: aprobar Task #2 con el estándar editorial de §14 incorporado._`);

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, lines.join("\n"), "utf8");
  console.log(`OK → ${path.relative(ROOT, OUT_FILE)} (${lines.length} líneas)`);
  console.log(`Resumen: ${total} artículos, ES p50=${es.median} palabras, ${esGaps.length} con huecos legales severos, ${cfcCandidates.length} con CFC pendiente, ${staleRefs.length} con años obsoletos.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
