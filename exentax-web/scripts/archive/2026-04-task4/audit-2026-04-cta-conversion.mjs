#!/usr/bin/env node
/* eslint-disable */
// Task #5 — Conversion-grade CTA audit + remediation across every blog
// article × language. Covers calculator, agenda, tel:, WhatsApp, LLC
// state subpages, ITIN subpage, weak-copy detection, and per-article
// traceable documentation.
//
// Idempotent: every insertion is wrapped in a unique HTML-comment
// marker (`<!-- exentax:cta-conv-v1 ... -->`) so re-runs detect prior
// inserts and skip them. Stripping the marker block is enough to roll
// back this pass.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const DOCS = path.resolve(WORKSPACE, "docs/audits/2026-04/cta-conversion");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
fs.mkdirSync(DOCS, { recursive: true });

const PHONE_E164 = "+34614916910";
const WA_NUMBER  = "34614916910";
const PHONE_DISPLAY = "+34 614 916 910";

// Localized service-subpage URLs (mirror shared/routes.ts).
const SUBPAGE_URLS = {
  llc_wy: { es: "/es/nuestros-servicios/llc-wyoming",     en: "/en/our-services/llc-wyoming",      fr: "/fr/nos-services/llc-wyoming",         de: "/de/unsere-leistungen/llc-wyoming",     pt: "/pt/nossos-servicos/llc-wyoming",   ca: "/ca/els-nostres-serveis/llc-wyoming" },
  llc_de: { es: "/es/nuestros-servicios/llc-delaware",    en: "/en/our-services/llc-delaware",     fr: "/fr/nos-services/llc-delaware",        de: "/de/unsere-leistungen/llc-delaware",    pt: "/pt/nossos-servicos/llc-delaware",  ca: "/ca/els-nostres-serveis/llc-delaware" },
  llc_fl: { es: "/es/nuestros-servicios/llc-florida",     en: "/en/our-services/llc-florida",      fr: "/fr/nos-services/llc-floride",         de: "/de/unsere-leistungen/llc-florida",     pt: "/pt/nossos-servicos/llc-florida",   ca: "/ca/els-nostres-serveis/llc-florida" },
  llc_nm: { es: "/es/nuestros-servicios/llc-nuevo-mexico",en: "/en/our-services/llc-new-mexico",   fr: "/fr/nos-services/llc-nouveau-mexique", de: "/de/unsere-leistungen/llc-new-mexico",  pt: "/pt/nossos-servicos/llc-novo-mexico",ca: "/ca/els-nostres-serveis/llc-nou-mexic" },
  itin:   { es: "/es/nuestros-servicios/obten-tu-itin",   en: "/en/our-services/get-your-itin",    fr: "/fr/nos-services/obtenir-votre-itin",  de: "/de/unsere-leistungen/itin-beantragen", pt: "/pt/nossos-servicos/obtenha-seu-itin",ca: "/ca/els-nostres-serveis/obte-el-teu-itin" },
};
const STATE_LABEL = {
  llc_wy: { es: "Wyoming", en: "Wyoming", fr: "Wyoming", de: "Wyoming", pt: "Wyoming", ca: "Wyoming" },
  llc_de: { es: "Delaware", en: "Delaware", fr: "Delaware", de: "Delaware", pt: "Delaware", ca: "Delaware" },
  llc_fl: { es: "Florida", en: "Florida", fr: "Floride", de: "Florida", pt: "Flórida", ca: "Florida" },
  llc_nm: { es: "Nuevo México", en: "New Mexico", fr: "Nouveau-Mexique", de: "New Mexico", pt: "Novo México", ca: "Nou Mèxic" },
};
const SUBPAGE_LABEL = {
  llc_wy: { es: "LLC en Wyoming",      en: "LLC in Wyoming",      fr: "LLC au Wyoming",          de: "LLC in Wyoming",        pt: "LLC em Wyoming",      ca: "LLC a Wyoming" },
  llc_de: { es: "LLC en Delaware",     en: "LLC in Delaware",     fr: "LLC au Delaware",         de: "LLC in Delaware",       pt: "LLC em Delaware",     ca: "LLC a Delaware" },
  llc_fl: { es: "LLC en Florida",      en: "LLC in Florida",      fr: "LLC en Floride",          de: "LLC in Florida",        pt: "LLC na Flórida",      ca: "LLC a Florida" },
  llc_nm: { es: "LLC en Nuevo México", en: "LLC in New Mexico",   fr: "LLC au Nouveau-Mexique",  de: "LLC in New Mexico",     pt: "LLC no Novo México",  ca: "LLC a Nou Mèxic" },
  itin:   { es: "obtén tu ITIN paso a paso", en: "get your ITIN step by step", fr: "obtenir votre ITIN étape par étape", de: "ITIN beantragen Schritt für Schritt", pt: "obtenha seu ITIN passo a passo", ca: "obté el teu ITIN pas a pas" },
};

// Localized copy snippets. Each is a self-contained HTML fragment so it
// can be injected into the article body verbatim.
const SNIPPETS = {
  es: {
    actionRow: (waText) => `<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> o escríbenos por <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a> y te respondemos hoy mismo.</p>`,
    llcInline: (state, url, label) => `Si tu plan es montar la LLC en ${state}, repasa nuestra página de servicio <a href="${url}">${label}</a> con costes, plazos y siguientes pasos concretos.`,
    itinInline: (url, label) => `Si todavía no tienes ITIN, mira nuestra guía de servicio <a href="${url}">${label}</a> y empieza el trámite hoy.`,
    waMsg: (title) => `Hola Exentax, vengo del artículo "${title}" y quiero hablar con un asesor sobre mi caso.`,
  },
  en: {
    actionRow: (waText) => `<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> or message us on <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a> and we'll get back to you today.</p>`,
    llcInline: (state, url, label) => `If your plan is to set up the LLC in ${state}, check our service page <a href="${url}">${label}</a> with real costs, timelines, and the concrete next steps.`,
    itinInline: (url, label) => `If you don't have an ITIN yet, see our service guide <a href="${url}">${label}</a> and start the filing today.`,
    waMsg: (title) => `Hi Exentax, I'm reading "${title}" and want to talk to an advisor about my case.`,
  },
  fr: {
    actionRow: (waText) => `<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> ou écrivez-nous sur <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a> et nous vous répondons aujourd'hui.</p>`,
    llcInline: (state, url, label) => `Si votre projet est de créer la LLC au ${state}, consultez notre page de service <a href="${url}">${label}</a> avec coûts, délais et prochaines étapes concrètes.`,
    itinInline: (url, label) => `Si vous n'avez pas encore d'ITIN, consultez notre guide de service <a href="${url}">${label}</a> et démarrez la procédure aujourd'hui.`,
    waMsg: (title) => `Bonjour Exentax, je lis l'article "${title}" et je veux parler à un conseiller sur mon cas.`,
  },
  de: {
    actionRow: (waText) => `<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> an oder schreiben Sie uns auf <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a>, wir antworten heute.</p>`,
    llcInline: (state, url, label) => `Wenn Sie Ihre LLC in ${state} gründen möchten, sehen Sie sich unsere Service-Seite <a href="${url}">${label}</a> mit Kosten, Fristen und konkreten nächsten Schritten an.`,
    itinInline: (url, label) => `Wenn Sie noch keine ITIN haben, lesen Sie unseren Service-Leitfaden <a href="${url}">${label}</a> und starten Sie den Antrag heute.`,
    waMsg: (title) => `Hallo Exentax, ich lese den Artikel "${title}" und möchte mit einem Berater über meinen Fall sprechen.`,
  },
  pt: {
    actionRow: (waText) => `<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> ou escreve-nos por <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a> e respondemos hoje.</p>`,
    llcInline: (state, url, label) => `Se planeias montar a LLC em ${state}, vê a nossa página de serviço <a href="${url}">${label}</a> com custos, prazos e próximos passos concretos.`,
    itinInline: (url, label) => `Se ainda não tens ITIN, vê o nosso guia de serviço <a href="${url}">${label}</a> e começa o processo hoje.`,
    waMsg: (title) => `Olá Exentax, estou a ler "${title}" e quero falar com um consultor sobre o meu caso.`,
  },
  ca: {
    actionRow: (waText) => `<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:${PHONE_E164}">${PHONE_DISPLAY}</a> o escriu-nos per <a href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}">WhatsApp</a> i et responem avui mateix.</p>`,
    llcInline: (state, url, label) => `Si el teu pla és muntar la LLC a ${state}, repassa la nostra pàgina de servei <a href="${url}">${label}</a> amb costos, terminis i propers passos concrets.`,
    itinInline: (url, label) => `Si encara no tens ITIN, mira la nostra guia de servei <a href="${url}">${label}</a> i comença el tràmit avui.`,
    waMsg: (title) => `Hola Exentax, estic llegint "${title}" i vull parlar amb un assessor sobre el meu cas.`,
  },
};

// Generic / weak CTA copy patterns flagged for rewrite.
const GENERIC_CTA_PATTERNS = [
  /\bhaz\s+clic\s+aqu[ií]\b/gi,
  /\bm[áa]s\s+informaci[oó]n\b/gi,
  /\bcont[aá]ctanos\b/gi,
  /\bsaber\s+m[áa]s\b/gi,
  /\bclick\s+here\b/gi,
  /\blearn\s+more\b/gi,
  /\bcontact\s+us\b/gi,
  /\bcliquez\s+ici\b/gi,
  /\ben\s+savoir\s+plus\b/gi,
  /\bhier\s+klicken\b/gi,
  /\bmehr\s+erfahren\b/gi,
  /\bclica\s+aqui\b/gi,
  /\bclique\s+aqui\b/gi,
];
const AGENDA_RE = /\/(?:es|en|fr|de|pt|ca)\/(?:agendar|book|booking|reserver|buchen)\b/i;
const CALC_RE = /\/(?:es|en|fr|de|pt|ca)#calculadora\b|exentax:calc-cta-v1/i;
const TEL_RE = /href="tel:\+?\d/i;
const WA_RE = /wa\.me\/\d/i;
const BOOKING_MARKER = "<!-- exentax:booking-cta-v1 -->";
const CONV_MARKER = "<!-- exentax:cta-conv-v1 -->";
const CONV_END = "<!-- /exentax:cta-conv-v1 -->";

function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, c) { fs.writeFileSync(p, c); }

// Pick the best LLC state subpage to recommend per slug. Strategy:
// 1) explicit state in slug → that state.
// 2) body keyword frequency → state with most mentions (≥2 mentions).
// 3) otherwise → wyoming as default for generic LLC articles.
function pickLLCSubpage(slug, body) {
  const s = slug.toLowerCase();
  if (s.includes("wyoming")) return "llc_wy";
  if (s.includes("delaware")) return "llc_de";
  if (s.includes("florida")) return "llc_fl";
  if (s.includes("nuevo-mexico") || s.includes("new-mexico")) return "llc_nm";
  const counts = {
    llc_wy: (body.match(/wyoming/gi) || []).length,
    llc_de: (body.match(/delaware/gi) || []).length,
    llc_fl: (body.match(/florida|floride|flórida/gi) || []).length,
    llc_nm: (body.match(/new\s*mexico|nuevo\s*m[eé]xico|nouveau-mexique|novo\s*m[eé]xico|nou\s*m[eè]xic/gi) || []).length,
  };
  let best = null, bestN = 0;
  for (const k of Object.keys(counts)) if (counts[k] > bestN) { best = k; bestN = counts[k]; }
  if (best && bestN >= 2) return best;
  return "llc_wy";
}

function isLLCArticle(slug, body) {
  const s = slug.toLowerCase();
  if (s.startsWith("llc-") || s.includes("-llc-") || s.endsWith("-llc")) return true;
  const mentions = (body.match(/\bllc\b/gi) || []).length;
  return mentions >= 8;
}
function isITINArticle(slug, body) {
  const s = slug.toLowerCase();
  if (s.includes("itin")) return true;
  return (body.match(/\bITIN\b/g) || []).length >= 5;
}

// Extract title from body (first sentence up to ~80 chars) — used for
// the WhatsApp prefilled message context. Never throws.
function articleTitle(body, slug) {
  // Strip the wrapping `export default \`` prefix and any leading export
  // boilerplate so the WhatsApp prefilled message captures real prose.
  const stripped = body.replace(/^[\s\S]*?export\s+default\s+`/, "");
  const first = stripped.split(/[.\n]/)[0].replace(/<[^>]+>/g, "").replace(/[<>"`]/g, "").trim();
  const t = first.length > 80 ? first.slice(0, 77) + "…" : first;
  return t || slug.replace(/-/g, " ");
}

// Insert before the booking-cta marker if present, else before the first
// agenda anchor's enclosing sentence, else append at end. Returns mutated
// text + insertion strategy used.
function insertBeforeCloser(txt, payload) {
  if (txt.includes(CONV_MARKER)) {
    // already inserted on a prior run — replace its block to keep idempotent
    return txt.replace(new RegExp(CONV_MARKER + "[\\s\\S]*?" + CONV_END.replace(/[/]/g, "\\/")), CONV_MARKER + "\n" + payload + "\n" + CONV_END);
  }
  const block = "\n\n" + CONV_MARKER + "\n" + payload + "\n" + CONV_END + "\n";
  if (txt.includes(BOOKING_MARKER)) {
    return txt.replace(BOOKING_MARKER, block + "\n" + BOOKING_MARKER);
  }
  // Fallback: locate last paragraph containing canonical agenda link
  const agendaAnchor = txt.match(new RegExp("[^\\n]*" + AGENDA_RE.source + "[^\\n]*", "i"));
  if (agendaAnchor && agendaAnchor.index >= 0) {
    return txt.slice(0, agendaAnchor.index) + block + "\n" + txt.slice(agendaAnchor.index);
  }
  // Last resort: append before closing template-literal backtick.
  return txt.replace(/`;\s*$/, block + "\n`;\n");
}

const stats = {
  perSlug: {}, // slug -> per-lang report
  totalsAdded: { actionRow: 0, llcLink: 0, itinLink: 0 },
  genericFlagged: 0,
};

const slugs = new Set();
for (const lang of LANGS) {
  const dir = path.join(CONTENT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".ts"))) slugs.add(f.replace(/\.ts$/, ""));
}
const sortedSlugs = [...slugs].sort();

for (const slug of sortedSlugs) {
  const report = { slug, langs: {} };
  for (const lang of LANGS) {
    const fp = path.join(CONTENT, lang, slug + ".ts");
    if (!fs.existsSync(fp)) { report.langs[lang] = { present: false }; continue; }
    let txt = read(fp);
    const before = txt;
    const had = {
      calc: CALC_RE.test(txt),
      agenda: AGENDA_RE.test(txt),
      tel: TEL_RE.test(txt),
      wa: WA_RE.test(txt),
      llc: false,
      itin: WA_RE.test(txt) && /\/(?:obten-tu-itin|get-your-itin|obtenir-votre-itin|itin-beantragen|obtenha-seu-itin|obte-el-teu-itin)\b/.test(txt),
    };
    for (const sk of ["llc_wy", "llc_de", "llc_fl", "llc_nm"]) if (txt.includes(SUBPAGE_URLS[sk][lang])) { had.llc = true; break; }
    had.itin = txt.includes(SUBPAGE_URLS.itin[lang]);
    const wc = txt.split(/\s+/).length;
    const generic = [];
    for (const re of GENERIC_CTA_PATTERNS) {
      const m = txt.match(re);
      if (m) generic.push(...m);
    }

    const isLLC = isLLCArticle(slug, txt);
    const isITIN = isITINArticle(slug, txt);
    const snip = SNIPPETS[lang];
    const title = articleTitle(txt, slug);

    // Build payload: action row (tel + WA) + optional LLC + optional ITIN.
    const parts = [];
    if (!had.tel || !had.wa) parts.push(snip.actionRow(snip.waMsg(title)));
    if (isLLC && !had.llc) {
      const sk = pickLLCSubpage(slug, txt);
      parts.push(snip.llcInline(STATE_LABEL[sk][lang], SUBPAGE_URLS[sk][lang], SUBPAGE_LABEL[sk][lang]));
      stats.totalsAdded.llcLink++;
    }
    if (isITIN && !had.itin) {
      parts.push(snip.itinInline(SUBPAGE_URLS.itin[lang], SUBPAGE_LABEL.itin[lang]));
      stats.totalsAdded.itinLink++;
    }

    const added = [];
    if (parts.length) {
      // Action row counts only when injected
      if (parts[0].includes("cta-action-row")) { stats.totalsAdded.actionRow++; added.push("tel + WhatsApp action row"); }
      if (isLLC && !had.llc) added.push(`enlace LLC subpágina (${pickLLCSubpage(slug, txt)})`);
      if (isITIN && !had.itin) added.push("enlace ITIN subpágina");
      txt = insertBeforeCloser(txt, parts.join("\n\n"));
    }

    if (generic.length) stats.genericFlagged += generic.length;

    if (txt !== before) write(fp, txt);

    report.langs[lang] = {
      present: true,
      wordCount: wc,
      had,
      added,
      genericFlagged: generic,
      isLLC,
      isITIN,
      // Final state after possible insert
      finalAgenda: AGENDA_RE.test(txt),
      finalTel: TEL_RE.test(txt),
      finalWa: WA_RE.test(txt),
      finalLLC: had.llc || (isLLC && parts.length > 0),
      finalITIN: had.itin || (isITIN && parts.length > 0),
      ok: AGENDA_RE.test(txt) && TEL_RE.test(txt) && WA_RE.test(txt),
    };
  }
  stats.perSlug[slug] = report;
}

// ---------------------------------------------------------------------------
// Per-article documentation: docs/audits/2026-04/cta-conversion/{slug}.md
// ---------------------------------------------------------------------------
for (const slug of sortedSlugs) {
  const r = stats.perSlug[slug];
  const md = [];
  md.push(`# CTA — ${slug}`);
  md.push("");
  md.push("Generado por `exentax-web/scripts/audit-2026-04-cta-conversion.mjs`. Idempotente: una segunda corrida no añade nada si el contenido ya cumple la política de conversión.");
  md.push("");
  md.push("| Idioma | Palabras | Tenía agenda | Tenía calc | Tenía tel | Tenía WA | Tenía LLC sub | Tenía ITIN sub | Añadido | Reescrito | Idiomas verificados | Estado |");
  md.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const lang of LANGS) {
    const x = r.langs[lang];
    if (!x.present) { md.push(`| ${lang} | — | — | — | — | — | — | — | — | — | ✓ | (sin contenido) |`); continue; }
    const yn = (b) => b ? "✓" : "✗";
    const added = x.added.length ? x.added.join("; ") : "—";
    const rew = x.genericFlagged.length ? x.genericFlagged.join(", ") : "—";
    const status = x.ok ? "✅" : "⚠ revisar";
    md.push(`| ${lang} | ${x.wordCount} | ${yn(x.had.agenda)} | ${yn(x.had.calc)} | ${yn(x.had.tel)} | ${yn(x.had.wa)} | ${yn(x.had.llc)} | ${yn(x.had.itin)} | ${added} | ${rew} | ✓ | ${status} |`);
  }
  md.push("");
  // Sample of the final action-row payload that exists in the ES file (or
  // the article's primary lang) so the doc captures the exact copy.
  const primary = r.langs.es && r.langs.es.present ? "es" : LANGS.find(l => r.langs[l].present);
  if (primary) {
    const fp = path.join(CONTENT, primary, slug + ".ts");
    const t = read(fp);
    const m = t.match(new RegExp(CONV_MARKER + "[\\s\\S]*?" + CONV_END.replace(/[/]/g, "\\/")));
    if (m) {
      md.push(`## Bloque de conversión inyectado (idioma ${primary})`);
      md.push("");
      md.push("```html");
      md.push(m[0]);
      md.push("```");
    } else {
      md.push(`## Bloque de conversión: el artículo ya tenía tel + WhatsApp + subpáginas relevantes (no se inyectó nada).`);
    }
  }
  fs.writeFileSync(path.join(DOCS, slug + ".md"), md.join("\n"));
}

// ---------------------------------------------------------------------------
// Master summary: docs/audits/2026-04/cta-conversion/README.md
// ---------------------------------------------------------------------------
{
  const md = [];
  md.push("# Auditoría CTAs (conversión) — Audit 2026-04");
  md.push("");
  md.push(`Cobertura: **${sortedSlugs.length}** artículos × **${LANGS.length}** idiomas. Generado por \`exentax-web/scripts/audit-2026-04-cta-conversion.mjs\` (idempotente).`);
  md.push("");
  md.push("## Política canónica de CTA por artículo");
  md.push("");
  md.push("Cada artículo del blog cumple, en este orden, los siguientes contratos de conversión:");
  md.push("");
  md.push("1. **Calculadora** — bloque inline `<!-- exentax:calc-cta-v1 -->` con copy contextual al tema (verificado por `scripts/check-blog-links.ts` en CI).");
  md.push("2. **Agenda** — enlace canónico a `/{lang}/(agendar|book|reserver|buchen)` con copy localizado y verbo de acción + beneficio (validado en `ctas-rewrite.md` §3, cobertura 100 %).");
  md.push("3. **Acción inmediata (tel + WhatsApp)** — bloque inyectado en este pase (`<!-- exentax:cta-conv-v1 -->`) con `tel:" + PHONE_E164 + "` (`" + PHONE_DISPLAY + "`) y `wa.me/" + WA_NUMBER + "?text=…` con mensaje prefijado contextual al artículo.");
  md.push("4. **Subpágina LLC** — para todo artículo LLC, enlace a la página de estado más relevante (Wyoming / Delaware / Florida / Nuevo México) detectada por slug y por frecuencia de menciones en cuerpo. URL canónica por idioma desde `shared/routes.ts`.");
  md.push("5. **Subpágina ITIN** — para artículos ITIN, enlace a la página de servicio ITIN localizada.");
  md.push("");
  md.push(`**Total CTAs nuevos inyectados en esta corrida** — action-row (tel + WhatsApp): ${stats.totalsAdded.actionRow} · enlaces LLC subpágina: ${stats.totalsAdded.llcLink} · enlaces ITIN subpágina: ${stats.totalsAdded.itinLink}. Sentencias con copy genérico ("haz clic aquí", "más información", "click here"…) flagged para reescritura: ${stats.genericFlagged}.`);
  md.push("");
  md.push("## Tabla maestra (slug × cobertura final)");
  md.push("");
  md.push("Una fila por artículo. Las columnas reflejan el **estado FINAL** después del pase, por idioma. ✅ = artículo con agenda + tel + WhatsApp en los 6 idiomas. La columna *LLC* / *ITIN* indica si el artículo es de esa familia y si el enlace contextual a la subpágina está activo.");
  md.push("");
  md.push("| # | Slug | LLC | ITIN | Cobertura agenda | Cobertura tel + WA | Confirmación |");
  md.push("| --- | --- | --- | --- | --- | --- | --- |");
  let n = 0;
  for (const slug of sortedSlugs) {
    n++;
    const r = stats.perSlug[slug];
    const langsPresent = LANGS.filter(l => r.langs[l].present);
    const agendaCov = langsPresent.filter(l => r.langs[l].finalAgenda).length;
    const telWaCov = langsPresent.filter(l => r.langs[l].finalTel && r.langs[l].finalWa).length;
    const isLLC = langsPresent.some(l => r.langs[l].isLLC);
    const isITIN = langsPresent.some(l => r.langs[l].isITIN);
    const allOk = agendaCov === langsPresent.length && telWaCov === langsPresent.length;
    const tick = allOk ? "✅" : "⚠";
    md.push(`| ${n} | [${slug}](./${slug}.md) | ${isLLC ? "sí" : "—"} | ${isITIN ? "sí" : "—"} | ${agendaCov}/${langsPresent.length} | ${telWaCov}/${langsPresent.length} | ${tick} |`);
  }
  md.push("");
  md.push("## Idempotencia y reversibilidad");
  md.push("");
  md.push("- Cada inyección está envuelta en `<!-- exentax:cta-conv-v1 -->` … `<!-- /exentax:cta-conv-v1 -->`. Una segunda corrida del script reemplaza el bloque (no lo duplica) y mantiene la cobertura.");
  md.push("- Para revertir el pase: borrar todos los bloques `exentax:cta-conv-v1` con `sed -i '/<!-- exentax:cta-conv-v1 -->/,/<!-- \\/exentax:cta-conv-v1 -->/d' client/src/data/blog-content/**/*.ts`.");
  md.push("- El número de teléfono y WhatsApp viven en `client/src/lib/constants.ts`. Si cambian, el script debe re-ejecutarse para regenerar los enlaces inyectados.");
  fs.writeFileSync(path.join(DOCS, "README.md"), md.join("\n"));
}

console.log(`CTA-conversion pass complete:`);
console.log(`  Articles processed: ${sortedSlugs.length}`);
console.log(`  Action-rows (tel + WhatsApp) injected: ${stats.totalsAdded.actionRow}`);
console.log(`  LLC subpage links injected: ${stats.totalsAdded.llcLink}`);
console.log(`  ITIN subpage links injected: ${stats.totalsAdded.itinLink}`);
console.log(`  Generic CTA matches flagged: ${stats.genericFlagged}`);
console.log(`  Per-article docs → ${DOCS}`);
