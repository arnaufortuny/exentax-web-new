#!/usr/bin/env node
/**
 * blog-conversion-fill.mjs
 *
 * One-shot migration that closes the structural conversion gaps the
 * `audit:conversion` auditor reports across 112 articles × 6 languages
 * (672 article files):
 *
 *   - tel:+34614916910 link (669 gaps): every article must expose the
 *     canonical phone number alongside the wa.me/34614916910 WhatsApp
 *     link in the action row.
 *   - localized booking link (73 gaps): every article must point to
 *     `/{lang}/{book-slug}`.
 *   - LLC service-subpage link (619 gaps): every LLC-classified article
 *     must link to `/{lang}/{services-root}/llc-wyoming` (or the matching
 *     state subpage when the slug is state-specific). Wyoming is the
 *     default because it works under all six locales with the same slug.
 *   - ITIN service-subpage link (25 gaps): every ITIN-classified article
 *     must link to `/{lang}/{services-root}/{itin-slug}`.
 *
 * Strategy
 *   - All injections happen INSIDE the existing
 *     `<!-- exentax:cta-conv-v1 -->` sub-block (which is sibling to —
 *     and always parsed independently from — the strict
 *     `<!-- exentax:cta-v1 -->` trailing-paragraph block validated by
 *     `blog-cta-validate.mjs`). Nothing outside that conv sub-block is
 *     touched, so the strict CTA contract stays intact.
 *   - For the small set of articles that don't yet have a conv sub-block
 *     at all (the 6 `crs-2-0-carf-por-que-usa-no-firmara-llc.ts` files),
 *     a fresh conv sub-block is injected immediately above the
 *     `<!-- exentax:cta-v1 -->` block.
 *   - The migration is idempotent: re-running detects the canonical
 *     marker we add (`exentax:conv-fill-v1`) and short-circuits.
 *
 * Canonical contact + service paths come from `shared/routes.ts`.
 * Re-run safely with `node scripts/blog-conversion-fill.mjs`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const FILL_MARKER = "exentax:conv-fill-v1";

// --- Canonical routes (mirrored from shared/routes.ts) ---------------------
const BOOK_SLUG = {
  es: "agendar", en: "book", fr: "reserver",
  de: "buchen", pt: "agendar", ca: "agendar",
};
const SERVICES_ROOT = {
  es: "servicios", en: "services", fr: "services",
  de: "leistungen", pt: "servicos", ca: "serveis",
};
// LLC state subpage slug per language (suffix after services root).
const LLC_SLUG = {
  es: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-florida", "new-mexico": "llc-nuevo-mexico" },
  en: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-florida", "new-mexico": "llc-new-mexico" },
  fr: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-floride", "new-mexico": "llc-nouveau-mexique" },
  de: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-florida", "new-mexico": "llc-new-mexico" },
  pt: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-florida", "new-mexico": "llc-novo-mexico" },
  ca: { wyoming: "llc-wyoming", delaware: "llc-delaware", florida: "llc-florida", "new-mexico": "llc-nou-mexic" },
};
const ITIN_SLUG = {
  es: "obten-tu-itin", en: "get-your-itin", fr: "obtiens-ton-itin",
  de: "hol-deine-itin", pt: "obtenha-seu-itin", ca: "obte-el-teu-itin",
};

const PHONE_RE = /tel:\+?34614916910/;
const WA_RE = /wa\.me\/34614916910/;
const LLC_STATE_RE =
  /llc-(?:wyoming|delaware|florida|new-mexico|nuevo-mexico|nouveau-mexique|nou-mexic|novo-mexico|floride)/i;

// --- Localized copy snippets injected into the conv sub-block --------------
// Each snippet is one short paragraph kept on its own line so it never
// confuses Markdown rendering. Phrasing is conversion-focused, addresses
// the reader directly, and varies per channel so the action row reads
// naturally instead of as a list of redundant CTAs.
const COPY = {
  es: {
    wa: `O escríbenos por <a href="https://wa.me/34614916910">WhatsApp al +34 614 916 910</a> y te respondemos hoy mismo.`,
    tel: `O llámanos directamente al <a href="tel:+34614916910">+34 614 916 910</a> si prefieres voz.`,
    book: (url) => `¿Prefieres agenda? <a href="${url}">Reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.`,
    llc: (url, state) => `Para detalles concretos por estado, repasa nuestra <a href="${url}">página de LLC en ${state}</a> con costes y plazos cerrados.`,
    itin: (url) => `Si tu prioridad es el ITIN, consulta <a href="${url}">Obtén tu ITIN con Exentax</a> y lo gestionamos en paralelo.`,
  },
  en: {
    wa: `Or message us on <a href="https://wa.me/34614916910">WhatsApp at +34 614 916 910</a> and we'll get back to you today.`,
    tel: `Or call us directly at <a href="tel:+34614916910">+34 614 916 910</a> if you'd rather talk.`,
    book: (url) => `Prefer a calendar slot? <a href="${url}">Book a free session</a> and we'll review your real case in thirty minutes.`,
    llc: (url, state) => `For state-specific details, see our <a href="${url}">${state} LLC service page</a> with closed costs and timelines.`,
    itin: (url) => `If your priority is the ITIN, see <a href="${url}">Get your ITIN with Exentax</a> and we'll handle it in parallel.`,
  },
  fr: {
    wa: `Ou écrivez-nous sur <a href="https://wa.me/34614916910">WhatsApp au +34 614 916 910</a> et nous vous répondons aujourd'hui.`,
    tel: `Ou appelez-nous directement au <a href="tel:+34614916910">+34 614 916 910</a> si vous préférez la voix.`,
    book: (url) => `Vous préférez un créneau ? <a href="${url}">Réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.`,
    llc: (url, state) => `Pour les détails par État, consultez notre <a href="${url}">page service LLC ${state}</a> avec coûts et délais fermés.`,
    itin: (url) => `Si votre priorité est l'ITIN, consultez <a href="${url}">Obtenez votre ITIN avec Exentax</a> et nous le gérons en parallèle.`,
  },
  de: {
    wa: `Oder schreiben Sie uns auf <a href="https://wa.me/34614916910">WhatsApp unter +34 614 916 910</a> und wir antworten heute.`,
    tel: `Oder rufen Sie uns direkt an: <a href="tel:+34614916910">+34 614 916 910</a>, wenn Sie lieber sprechen möchten.`,
    book: (url) => `Lieber einen Termin? <a href="${url}">Buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.`,
    llc: (url, state) => `Für staatsspezifische Details siehe unsere <a href="${url}">${state}-LLC-Leistungsseite</a> mit festen Kosten und Fristen.`,
    itin: (url) => `Wenn Ihre Priorität die ITIN ist, siehe <a href="${url}">ITIN mit Exentax beantragen</a> und wir bearbeiten sie parallel.`,
  },
  pt: {
    wa: `Ou escreve-nos por <a href="https://wa.me/34614916910">WhatsApp para +34 614 916 910</a> e respondemos hoje mesmo.`,
    tel: `Ou liga-nos diretamente para <a href="tel:+34614916910">+34 614 916 910</a> se preferires falar.`,
    book: (url) => `Preferes agenda? <a href="${url}">Marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.`,
    llc: (url, state) => `Para detalhes por estado, consulta a nossa <a href="${url}">página de LLC no ${state}</a> com custos e prazos fechados.`,
    itin: (url) => `Se a tua prioridade é o ITIN, consulta <a href="${url}">Obtenha o seu ITIN com a Exentax</a> e tratamos em paralelo.`,
  },
  ca: {
    wa: `O escriu-nos per <a href="https://wa.me/34614916910">WhatsApp al +34 614 916 910</a> i et responem avui mateix.`,
    tel: `O truca'ns directament al <a href="tel:+34614916910">+34 614 916 910</a> si prefereixes parlar.`,
    book: (url) => `Prefereixes agenda? <a href="${url}">Reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.`,
    llc: (url, state) => `Per a detalls per estat, consulta la nostra <a href="${url}">pàgina del servei LLC a ${state}</a> amb costos i terminis tancats.`,
    itin: (url) => `Si la teva prioritat és l'ITIN, consulta <a href="${url}">Obté el teu ITIN amb Exentax</a> i ho gestionem en paral·lel.`,
  },
};

const STATE_LABEL = {
  es: { wyoming: "Wyoming", delaware: "Delaware", florida: "Florida", "new-mexico": "Nuevo México" },
  en: { wyoming: "Wyoming", delaware: "Delaware", florida: "Florida", "new-mexico": "New Mexico" },
  fr: { wyoming: "Wyoming", delaware: "Delaware", florida: "Floride", "new-mexico": "Nouveau-Mexique" },
  de: { wyoming: "Wyoming", delaware: "Delaware", florida: "Florida", "new-mexico": "New Mexico" },
  pt: { wyoming: "Wyoming", delaware: "Delaware", florida: "Florida", "new-mexico": "Novo México" },
  ca: { wyoming: "Wyoming", delaware: "Delaware", florida: "Florida", "new-mexico": "Nou Mèxic" },
};

// --- Classifier helpers ----------------------------------------------------
function classifyState(slug) {
  const s = slug.toLowerCase();
  if (s.includes("delaware")) return "delaware";
  if (s.includes("florida")) return "florida";
  if (s.includes("nuevo-mexico") || s.includes("new-mexico") || s.includes("nouveau-mexique") || s.includes("nou-mexic") || s.includes("novo-mexico")) return "new-mexico";
  if (s.includes("wyoming")) return "wyoming";
  return "wyoming"; // default
}

function isLLCArticle(slug, body) {
  const s = slug.toLowerCase();
  for (const kw of ["llc", "5472", "1120", "ein", "boi", "mercury", "fincen", "wyoming", "delaware"]) {
    if (s.includes(kw)) return true;
  }
  return (body.match(/\bLLC\b/g) || []).length >= 3;
}

function isITINArticle(slug, body) {
  if (slug.toLowerCase().includes("itin")) return true;
  return (body.match(/\bITIN\b/gi) || []).length >= 3;
}

function hasLocalizedAgendaLink(body, lang) {
  const slug = BOOK_SLUG[lang];
  return new RegExp(`/${lang}/${slug}(?:[/?"'#\\s]|$)`, "i").test(body);
}

function hasLLCSubpageLink(body, lang) {
  return new RegExp(`/${lang}/${SERVICES_ROOT[lang]}/${LLC_STATE_RE.source}`, "i").test(body);
}

function hasITINSubpageLink(body, lang) {
  return new RegExp(`/${lang}/${SERVICES_ROOT[lang]}/${ITIN_SLUG[lang]}\\b`).test(body);
}

// --- Patcher ---------------------------------------------------------------
function buildFillBlock(lang, slug, body) {
  const lines = [];
  if (!WA_RE.test(body)) {
    lines.push(COPY[lang].wa);
  }
  if (!PHONE_RE.test(body)) {
    lines.push(COPY[lang].tel);
  }
  if (!hasLocalizedAgendaLink(body, lang)) {
    const url = `/${lang}/${BOOK_SLUG[lang]}`;
    lines.push(COPY[lang].book(url));
  }
  if (isLLCArticle(slug, body) && !hasLLCSubpageLink(body, lang)) {
    const state = classifyState(slug);
    const url = `/${lang}/${SERVICES_ROOT[lang]}/${LLC_SLUG[lang][state]}`;
    lines.push(COPY[lang].llc(url, STATE_LABEL[lang][state]));
  }
  if (isITINArticle(slug, body) && !hasITINSubpageLink(body, lang)) {
    const url = `/${lang}/${SERVICES_ROOT[lang]}/${ITIN_SLUG[lang]}`;
    lines.push(COPY[lang].itin(url));
  }
  if (lines.length === 0) return null;
  // Indent block as a single sibling paragraph cluster, separated by blank
  // lines so Markdown renders each sentence as its own <p>.
  return [
    `<!-- ${FILL_MARKER} -->`,
    ...lines.flatMap((l) => [l, ""]),
    `<!-- /${FILL_MARKER} -->`,
  ].join("\n");
}

function patchFile(file, lang, slug) {
  const original = fs.readFileSync(file, "utf8");
  const fill = buildFillBlock(lang, slug, original);
  if (!fill) {
    return { changed: false, reason: "no-gaps" };
  }

  // Preferred insertion point: right before the closing
  // `<!-- /exentax:cta-conv-v1 -->` tag (so the new copy lives inside the
  // existing conv sub-block, sibling to the wa.me action row).
  const convClose = "<!-- /exentax:cta-conv-v1 -->";
  if (original.includes(convClose)) {
    const patched = original.replace(
      convClose,
      `\n${fill}\n${convClose}`,
    );
    fs.writeFileSync(file, patched);
    return { changed: true, reason: "filled-existing-conv" };
  }

  // Fallback: file has no conv sub-block (the 6 CRS articles). Inject a
  // brand-new conv block right above the cta-v1 trailing block.
  const ctaOpen = "<!-- exentax:cta-v1 -->";
  if (original.includes(ctaOpen)) {
    const newConv = [
      "<!-- exentax:cta-conv-v1 -->",
      fill,
      "<!-- /exentax:cta-conv-v1 -->",
      "",
      ctaOpen,
    ].join("\n");
    const patched = original.replace(ctaOpen, newConv);
    fs.writeFileSync(file, patched);
    return { changed: true, reason: "injected-new-conv" };
  }

  return { changed: false, reason: "no-insertion-anchor" };
}

// --- Main ------------------------------------------------------------------
let touched = 0;
let skipped = 0;
const reasons = {};
for (const lang of LANGS) {
  const dir = path.join(CONTENT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".ts")) continue;
    const slug = f.replace(/\.ts$/, "");
    const file = path.join(dir, f);
    const r = patchFile(file, lang, slug);
    if (r.changed) touched++;
    else skipped++;
    reasons[r.reason] = (reasons[r.reason] || 0) + 1;
  }
}
console.log(`blog-conversion-fill: touched=${touched} skipped=${skipped}`);
for (const [k, v] of Object.entries(reasons)) {
  console.log(`  ${k}: ${v}`);
}
