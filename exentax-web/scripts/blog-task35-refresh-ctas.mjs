#!/usr/bin/env node
/*
 * blog-task35-refresh-ctas.mjs
 * ----------------------------------------------------------------------------
 * Refresh the inline body CTAs inside every blog article so they match the
 * reader's locale and the article's actual topic. Covers two tasks:
 *
 *   • Task #35 — pattern-align the trailing paragraph of the
 *     `<!-- exentax:cta-v1 -->` block.
 *   • Task #46 — localise the lead-in line and re-target the contextual
 *     service link inside the `<!-- exentax:cta-conv-v1 -->` block.
 *
 * Scope: 111 blog slugs × 6 locales = 666 files under
 * `client/src/data/blog-content/<lang>/*.ts`.
 *
 * Inputs (parsed, never mutated):
 *   • `client/src/data/blog-cta-routes.ts`   per-slug { route, pattern } map
 *                                             + heuristic fallback that
 *                                             mirrors `getBlogCtaTarget()`.
 *   • `client/src/data/blog-cta-library.ts`  canonical copy per
 *                                             (pattern, lang): title / desc
 *                                             / primary / whatsappMsg.
 *   • `shared/routes.ts`                     ROUTE_SLUGS — used to resolve
 *                                             the canonical localized URL
 *                                             for each route key.
 *
 * Pass 1 — exentax:cta-v1  (Task #35)
 *   For every article file with a `cta-v1` block, the trailing paragraph
 *   (the part after the optional inner `cta-conv-v1` block) is rewritten
 *   to a single-line paragraph of the shape:
 *
 *       <pattern.desc> <a href="<localized-route>"><pattern.primary></a>.
 *
 *   The inner `cta-conv-v1` block, the `calc-cta-v1` block, and any other
 *   markup are preserved verbatim by this pass.
 *
 * Pass 2 — exentax:cta-conv-v1  (Task #46)
 *   For every article file with a `cta-conv-v1` block, the inner contents
 *   are rebuilt as exactly:
 *
 *       <p data-testid="cta-action-row">…lead-in…</p>
 *
 *       <route+locale-specific contextual sentence with one anchor>
 *
 *   Two parts:
 *     a) Lead-in paragraph (phone + WhatsApp deep link). The existing
 *        per-article lead-in is preserved verbatim because it embeds an
 *        article-quoted WhatsApp message that this script cannot
 *        reconstruct without re-reading the article body. If a file is
 *        missing the lead-in altogether (5 legacy non-ES files), a
 *        generic localized fallback from `FALLBACK_LEAD_IN` is injected
 *        so the block is still well-formed.
 *     b) Contextual sentence: `buildConvContextSentence(route, lang, url)`
 *        renders one of four templates depending on the article's route
 *        target:
 *          - service_llc_{wy,nm,de,fl} → "LLC in <state>" sentence with
 *            the locale-correct preposition (FR uses "au" for masculine
 *            states + "en" for Floride; PT uses "em" for masculine + "na"
 *            for Florida; ES/EN/DE/CA are uniform).
 *          - service_itin              → "<lang> ITIN guide" sentence.
 *          - our_services              → "see the full services page".
 *          - book / anything else      → "book a free session".
 *        The anchor URL is the canonical (non-alias) localized route from
 *        `shared/routes.ts`, so the reader is not bounced through a
 *        server-side redirect.
 *
 * Editorial register matches the existing per-locale lead-in lines:
 *   ES tú · EN neutral · FR formal vous · DE formal Sie · PT-PT tu · CA tu.
 *
 * Untouched
 *   • `<!-- exentax:calc-cta-v1 -->` blocks — they carry the calculator
 *     hash anchor that `blog-cta-validate.mjs` enforces.
 *   • Body content, headings, FAQs, related-reading lists, sources, etc.
 *
 * Idempotency
 *   Re-running the script in either WRITE or DRY-RUN mode after a clean
 *   pass produces zero changes. The contract is verified by
 *   `blog-cta-validate.mjs` (which still passes).
 *
 * Usage
 *   node scripts/blog-task35-refresh-ctas.mjs            # WRITE mode
 *   node scripts/blog-task35-refresh-ctas.mjs --dry-run  # report only
 * ----------------------------------------------------------------------------
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content");
const ROUTES_FILE = path.join(ROOT, "client/src/data/blog-cta-routes.ts");
const LIBRARY_FILE = path.join(ROOT, "client/src/data/blog-cta-library.ts");
const SHARED_ROUTES_FILE = path.join(ROOT, "shared/routes.ts");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const PATTERNS = [
  "book_consultation",
  "llc_florida_specific",
  "llc_state_compare",
  "itin_help",
  "pricing_quote",
  "services_overview",
  "compliance_checkup",
];

// --- Parse shared/routes.ts → ROUTE_URL[routeKey][lang] = "/lang/slug" -------
function parseRouteSlugs() {
  const src = fs.readFileSync(SHARED_ROUTES_FILE, "utf8");
  const blockRx = /export const ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\};/m;
  const block = src.match(blockRx);
  if (!block) throw new Error("ROUTE_SLUGS block not found in shared/routes.ts");
  const map = {};
  // Each line: keyName: { es: "...", en: "...", ... },
  const lineRx = /^\s*([a-z_]+):\s*\{([^}]*)\},?\s*$/gm;
  let m;
  while ((m = lineRx.exec(block[1])) !== null) {
    const key = m[1];
    const inner = m[2];
    map[key] = {};
    const cellRx = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let c;
    while ((c = cellRx.exec(inner)) !== null) {
      map[key][c[1]] = c[2];
    }
  }
  return map;
}

function getLocalizedPath(routeSlugs, key, lang) {
  const slug = routeSlugs[key]?.[lang];
  if (slug === undefined) throw new Error(`Unknown route ${key} for ${lang}`);
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

// --- Parse blog-cta-routes.ts MAP + HEURISTIC -------------------------------
function parseRoutes() {
  const src = fs.readFileSync(ROUTES_FILE, "utf8");
  const map = {};
  const entryRx = /^\s*"([^"]+)":\s*\{\s*route:\s*"([^"]+)"(?:,\s*secondaryRoute:\s*"[^"]+")?(?:,\s*pattern:\s*"([^"]+)")?\s*\}/gm;
  let m;
  while ((m = entryRx.exec(src)) !== null) {
    map[m[1]] = { route: m[2], pattern: m[3] };
  }
  // Heuristic must mirror getBlogCtaTarget() exactly.
  const heuristic = [
    { re: /\bnuevo-mexico\b/, route: "service_llc_nm", pattern: "llc_state_compare" },
    { re: /\bwyoming\b/,      route: "service_llc_wy", pattern: "llc_state_compare" },
    { re: /\bdelaware\b/,     route: "service_llc_de", pattern: "llc_state_compare" },
    { re: /\bflorida\b/,      route: "service_llc_fl", pattern: "llc_florida_specific" },
    { re: /\bitin\b/,         route: "service_itin",   pattern: "itin_help" },
  ];
  return { map, heuristic };
}

function getTarget(routes, slug) {
  if (slug in routes.map) return routes.map[slug];
  for (const h of routes.heuristic) {
    if (h.re.test(slug)) return { route: h.route, pattern: h.pattern };
  }
  return { route: "book", pattern: "book_consultation" };
}

// --- Parse blog-cta-library.ts → LIBRARY[pattern][lang] = {title,desc,primary}
function parseLibrary() {
  const src = fs.readFileSync(LIBRARY_FILE, "utf8");
  const lib = {};
  for (const p of PATTERNS) {
    // Greedy match up to the closing "  }," at the pattern level.
    const pRx = new RegExp(`\\n  ${p}:\\s*\\{([\\s\\S]*?)\\n  \\},`, "m");
    const pm = src.match(pRx);
    if (!pm) throw new Error(`Pattern ${p} not found in library`);
    const pBody = pm[1];
    lib[p] = {};
    for (const lang of LANGS) {
      const lRx = new RegExp(`\\n    ${lang}:\\s*\\{([\\s\\S]*?)\\n    \\},`);
      const lm = pBody.match(lRx);
      if (!lm) throw new Error(`Lang ${lang} not found in pattern ${p}`);
      const lBody = lm[1];
      const get = (field) => {
        const r = new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
        const mm = lBody.match(r);
        if (!mm) throw new Error(`Field ${field} missing in ${p}/${lang}`);
        // Decode simple JS string escapes.
        return mm[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      };
      lib[p][lang] = {
        title: get("title"),
        desc: get("desc"),
        primary: get("primary"),
      };
    }
  }
  return lib;
}

// --- Localised contextual sentence for the cta-conv-v1 block ---------------
//
// Task #46: the inner `cta-conv-v1` block (phone + WhatsApp lead-in plus a
// contextual service link) used to hardcode the Spanish "Wyoming LLC"
// follow-up sentence in *every* article — even FL, NM, ITIN posts and even
// non-ES locales. We keep the lead-in `<p data-testid="cta-action-row">…</p>`
// (already localised per file) untouched and replace the trailing context
// sentence(s) with one sentence that matches the article's actual pattern
// and points to the article's actual route in the reader's locale.
//
// Stylistic register matches the lead-in line that ships with each locale:
//   ES: tú · EN: neutral · FR: vous · DE: Sie · PT-PT: tu · CA: tu

const STATE_LABELS = {
  service_llc_wy: { es: "Wyoming",    en: "Wyoming",    fr: "Wyoming",        de: "Wyoming",    pt: "Wyoming",    ca: "Wyoming" },
  service_llc_nm: { es: "Nuevo México", en: "New Mexico", fr: "Nouveau-Mexique", de: "New Mexico", pt: "Novo México", ca: "Nou Mèxic" },
  service_llc_de: { es: "Delaware",   en: "Delaware",   fr: "Delaware",       de: "Delaware",   pt: "Delaware",   ca: "Delaware" },
  service_llc_fl: { es: "Florida",    en: "Florida",    fr: "Floride",        de: "Florida",    pt: "Florida",    ca: "Florida" },
};

// Preposition for "in <state>" per (route, lang) — French uses "en" for Floride
// (feminine), "au" for the masculine states; PT uses "na" for Florida, "em"
// otherwise. ES/EN/DE/CA are uniform.
const STATE_PREP = {
  service_llc_wy: { es: "en", en: "in", fr: "au", de: "in", pt: "em", ca: "a" },
  service_llc_nm: { es: "en", en: "in", fr: "au", de: "in", pt: "em", ca: "a" },
  service_llc_de: { es: "en", en: "in", fr: "au", de: "in", pt: "em", ca: "a" },
  service_llc_fl: { es: "en", en: "in", fr: "en", de: "in", pt: "na", ca: "a" },
};

function buildStateSentence(routeKey, lang, url) {
  const s = STATE_LABELS[routeKey][lang];
  const p = STATE_PREP[routeKey][lang];
  switch (lang) {
    case "es":
      return `Si tu plan es montar la LLC ${p} ${s}, repasa nuestra página de servicio <a href="${url}">LLC ${p} ${s}</a> con costes, plazos y siguientes pasos concretos.`;
    case "en":
      return `If your plan is to set up the LLC ${p} ${s}, check our service page <a href="${url}">LLC ${p} ${s}</a> with real costs, timelines, and the concrete next steps.`;
    case "fr":
      return `Si votre projet est de créer la LLC ${p} ${s}, consultez notre page de service <a href="${url}">LLC ${p} ${s}</a> avec coûts, délais et prochaines étapes concrètes.`;
    case "de":
      return `Wenn Sie Ihre LLC ${p} ${s} gründen möchten, sehen Sie sich unsere Service-Seite <a href="${url}">LLC ${p} ${s}</a> mit Kosten, Fristen und konkreten nächsten Schritten an.`;
    case "pt":
      return `Se planeias montar a LLC ${p} ${s}, vê a nossa página de serviço <a href="${url}">LLC ${p} ${s}</a> com custos, prazos e próximos passos concretos.`;
    case "ca":
      return `Si el teu pla és muntar la LLC ${p} ${s}, repassa la nostra pàgina de servei <a href="${url}">LLC ${p} ${s}</a> amb costos, terminis i propers passos concrets.`;
    default:
      throw new Error(`Unsupported lang ${lang}`);
  }
}

function buildItinSentence(lang, url) {
  switch (lang) {
    case "es":
      return `Si todavía no tienes ITIN, mira nuestra guía de servicio <a href="${url}">obtén tu ITIN paso a paso</a> y empieza el trámite hoy.`;
    case "en":
      return `If you don't have an ITIN yet, see our service guide <a href="${url}">get your ITIN step by step</a> and start the filing today.`;
    case "fr":
      return `Si vous n'avez pas encore d'ITIN, consultez notre guide de service <a href="${url}">obtenir votre ITIN étape par étape</a> et démarrez la procédure aujourd'hui.`;
    case "de":
      return `Wenn Sie noch keine ITIN haben, lesen Sie unseren Service-Leitfaden <a href="${url}">ITIN beantragen Schritt für Schritt</a> und starten Sie den Antrag heute.`;
    case "pt":
      return `Se ainda não tens ITIN, vê o nosso guia de serviço <a href="${url}">obtém o teu ITIN passo a passo</a> e começa o processo hoje.`;
    case "ca":
      return `Si encara no tens ITIN, mira la nostra guia de servei <a href="${url}">obté el teu ITIN pas a pas</a> i comença el tràmit avui.`;
    default:
      throw new Error(`Unsupported lang ${lang}`);
  }
}

function buildServicesSentence(lang, url) {
  switch (lang) {
    case "es":
      return `Si quieres ver el detalle del proceso completo, repasa nuestra <a href="${url}">página de servicios</a> con precios, plazos y entregables.`;
    case "en":
      return `If you want to see the full process in detail, check our <a href="${url}">services page</a> with prices, timelines and deliverables.`;
    case "fr":
      return `Si vous souhaitez voir le processus complet en détail, consultez notre <a href="${url}">page des services</a> avec prix, délais et livrables.`;
    case "de":
      return `Wenn Sie den gesamten Prozess im Detail sehen möchten, sehen Sie sich unsere <a href="${url}">Leistungsseite</a> mit Preisen, Fristen und Leistungen an.`;
    case "pt":
      return `Se queres ver todo o processo em detalhe, vê a nossa <a href="${url}">página de serviços</a> com preços, prazos e entregáveis.`;
    case "ca":
      return `Si vols veure tot el procés amb detall, repassa la nostra <a href="${url}">pàgina de serveis</a> amb preus, terminis i lliurables.`;
    default:
      throw new Error(`Unsupported lang ${lang}`);
  }
}

function buildBookSentence(lang, url) {
  switch (lang) {
    case "es":
      return `Si prefieres hablarlo en directo, <a href="${url}">reserva una sesión gratuita</a> y revisamos tu caso real en treinta minutos.`;
    case "en":
      return `If you'd rather discuss it live, <a href="${url}">book a free session</a> and we'll review your real case in thirty minutes.`;
    case "fr":
      return `Si vous préférez en discuter de vive voix, <a href="${url}">réservez une session gratuite</a> et nous examinons votre cas réel en trente minutes.`;
    case "de":
      return `Wenn Sie es lieber persönlich besprechen möchten, <a href="${url}">buchen Sie ein kostenloses Gespräch</a> und wir prüfen Ihren konkreten Fall in dreißig Minuten.`;
    case "pt":
      return `Se preferes falar diretamente, <a href="${url}">marca uma sessão gratuita</a> e analisamos o teu caso real em trinta minutos.`;
    case "ca":
      return `Si prefereixes parlar-ne directament, <a href="${url}">reserva una sessió gratuïta</a> i revisem el teu cas real en trenta minuts.`;
    default:
      throw new Error(`Unsupported lang ${lang}`);
  }
}

function buildConvContextSentence(routeKey, lang, url) {
  if (routeKey in STATE_LABELS) return buildStateSentence(routeKey, lang, url);
  if (routeKey === "service_itin") return buildItinSentence(lang, url);
  if (routeKey === "our_services") return buildServicesSentence(lang, url);
  if (routeKey === "book") return buildBookSentence(lang, url);
  // Any other route falls back to the booking-style sentence.
  return buildBookSentence(lang, url);
}

const LEAD_IN_RX = /<p data-testid="cta-action-row">[\s\S]*?<\/p>/;

// Fallback lead-in (phone + WhatsApp) used only for the handful of legacy
// files where the original Spanish source was translated without the
// article-quoted WhatsApp message. This generic variant matches the wording
// of the per-article lead-in but drops the article-title quote.
const FALLBACK_LEAD_IN = {
  es: `<p data-testid="cta-action-row">¿Necesitas hablarlo ya? Llámanos al <a href="tel:+34614916910">+34 614 916 910</a> o escríbenos por <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20quiero%20hablar%20con%20un%20asesor%20sobre%20mi%20caso.">WhatsApp</a> y te respondemos hoy mismo.</p>`,
  en: `<p data-testid="cta-action-row">Want to discuss it now? Call us at <a href="tel:+34614916910">+34 614 916 910</a> or message us on <a href="https://wa.me/34614916910?text=Hi%20Exentax%2C%20I%20want%20to%20talk%20to%20an%20advisor%20about%20my%20case.">WhatsApp</a> and we'll get back to you today.</p>`,
  fr: `<p data-testid="cta-action-row">Envie d'en parler tout de suite ? Appelez-nous au <a href="tel:+34614916910">+34 614 916 910</a> ou écrivez-nous sur <a href="https://wa.me/34614916910?text=Bonjour%20Exentax%2C%20je%20veux%20parler%20%C3%A0%20un%20conseiller%20sur%20mon%20cas.">WhatsApp</a> et nous vous répondons aujourd'hui.</p>`,
  de: `<p data-testid="cta-action-row">Möchten Sie es jetzt besprechen? Rufen Sie uns unter <a href="tel:+34614916910">+34 614 916 910</a> an oder schreiben Sie uns auf <a href="https://wa.me/34614916910?text=Hallo%20Exentax%2C%20ich%20m%C3%B6chte%20mit%20einem%20Berater%20%C3%BCber%20meinen%20Fall%20sprechen.">WhatsApp</a>, wir antworten heute.</p>`,
  pt: `<p data-testid="cta-action-row">Queres falar agora? Liga-nos para <a href="tel:+34614916910">+34 614 916 910</a> ou escreve-nos por <a href="https://wa.me/34614916910?text=Ol%C3%A1%20Exentax%2C%20quero%20falar%20com%20um%20consultor%20sobre%20o%20meu%20caso.">WhatsApp</a> e respondemos hoje.</p>`,
  ca: `<p data-testid="cta-action-row">Vols parlar-ne ara? Truca'ns al <a href="tel:+34614916910">+34 614 916 910</a> o escriu-nos per <a href="https://wa.me/34614916910?text=Hola%20Exentax%2C%20vull%20parlar%20amb%20un%20assessor%20sobre%20el%20meu%20cas.">WhatsApp</a> i et responem avui mateix.</p>`,
};

function rewriteConvBlock(src, lang, target, routeSlugs) {
  const startTag = "<!-- exentax:cta-conv-v1 -->";
  const endTag = "<!-- /exentax:cta-conv-v1 -->";
  const startIdx = src.indexOf(startTag);
  if (startIdx === -1) return { changed: false, out: src };
  const endIdx = src.indexOf(endTag, startIdx);
  if (endIdx === -1) return { changed: false, out: src, malformed: true };

  const innerStart = startIdx + startTag.length;
  const inner = src.slice(innerStart, endIdx);

  const leadMatch = inner.match(LEAD_IN_RX);
  const leadIn = leadMatch ? leadMatch[0] : FALLBACK_LEAD_IN[lang];

  const url = getLocalizedPath(routeSlugs, target.route, lang);
  const sentence = buildConvContextSentence(target.route, lang, url);
  const newInner = `\n${leadIn}\n\n${sentence}\n`;

  if (newInner === inner) return { changed: false, out: src };

  const out = src.slice(0, innerStart) + newInner + src.slice(endIdx);
  return { changed: true, out };
}

// --- The rewrite per file ---------------------------------------------------
function buildTrailingParagraph(copy, url) {
  // Single line, ends with full stop. The pattern.desc already ends with a
  // period in the library — keep it that way and append the anchor sentence.
  const desc = copy.desc.trim();
  const sep = /[.!?]$/.test(desc) ? "" : ".";
  return `${desc}${sep} <a href="${url}">${copy.primary}</a>.`;
}

function rewriteCtaBlock(src, newTrailing) {
  const startTag = "<!-- exentax:cta-v1 -->";
  const endTag = "<!-- /exentax:cta-v1 -->";
  const startIdx = src.indexOf(startTag);
  if (startIdx === -1) return { changed: false, out: src };
  const endIdx = src.indexOf(endTag, startIdx);
  if (endIdx === -1) return { changed: false, out: src };

  const innerStart = startIdx + startTag.length;
  const inner = src.slice(innerStart, endIdx);

  // Detect optional cta-conv-v1 sub-block and preserve it verbatim.
  const convStart = inner.indexOf("<!-- exentax:cta-conv-v1 -->");
  let preserved = "";
  if (convStart !== -1) {
    const convEndTag = "<!-- /exentax:cta-conv-v1 -->";
    const convEnd = inner.indexOf(convEndTag, convStart);
    if (convEnd === -1) {
      // Malformed — bail out without touching this file.
      return { changed: false, out: src, malformed: true };
    }
    preserved = inner.slice(convStart, convEnd + convEndTag.length);
  }

  let newInner;
  if (preserved) {
    newInner = `\n${preserved}\n\n${newTrailing}\n`;
  } else {
    newInner = `\n${newTrailing}\n`;
  }

  if (newInner === inner) return { changed: false, out: src };

  const out = src.slice(0, innerStart) + newInner + src.slice(endIdx);
  return { changed: true, out };
}

// --- Main -------------------------------------------------------------------
function main() {
  const apply = !process.argv.includes("--dry-run");
  const routeSlugs = parseRouteSlugs();
  const routes = parseRoutes();
  const lib = parseLibrary();

  const stats = {
    scanned: 0, changed: 0, malformed: 0, skipped: 0,
    convChanged: 0, convMalformed: 0, convSkipped: 0,
    perPattern: Object.fromEntries(PATTERNS.map((p) => [p, 0])),
    perLang: Object.fromEntries(LANGS.map((l) => [l, 0])),
    convPerLang: Object.fromEntries(LANGS.map((l) => [l, 0])),
  };

  for (const lang of LANGS) {
    const dir = path.join(CONTENT_DIR, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith(".ts")) continue;
      const slug = f.replace(/\.ts$/, "");
      const file = path.join(dir, f);
      let src = fs.readFileSync(file, "utf8");
      stats.scanned++;
      const target = getTarget(routes, slug);
      const copy = lib[target.pattern][lang];
      const url = getLocalizedPath(routeSlugs, target.route, lang);
      const trailing = buildTrailingParagraph(copy, url);

      // 1. cta-v1 trailing-paragraph rewrite (Task #35).
      let fileChanged = false;
      const ctaRes = rewriteCtaBlock(src, trailing);
      if (ctaRes.malformed) {
        stats.malformed++;
      } else if (!src.includes("<!-- exentax:cta-v1 -->")) {
        stats.skipped++;
      } else if (ctaRes.changed) {
        stats.changed++;
        stats.perPattern[target.pattern]++;
        stats.perLang[lang]++;
        src = ctaRes.out;
        fileChanged = true;
      }

      // 2. cta-conv-v1 contextual-sentence rewrite (Task #46).
      const convRes = rewriteConvBlock(src, lang, target, routeSlugs);
      if (convRes.malformed) {
        stats.convMalformed++;
      } else if (!src.includes("<!-- exentax:cta-conv-v1 -->")) {
        stats.convSkipped++;
      } else if (convRes.changed) {
        stats.convChanged++;
        stats.convPerLang[lang]++;
        src = convRes.out;
        fileChanged = true;
      }

      if (fileChanged && apply) fs.writeFileSync(file, src);
    }
  }

  console.log("blog-task35-refresh-ctas ──");
  console.log(`  mode:     ${apply ? "WRITE" : "DRY-RUN"}`);
  console.log(`  scanned:  ${stats.scanned}`);
  console.log("  cta-v1 (Task #35):");
  console.log(`    changed:  ${stats.changed}`);
  console.log(`    skipped:  ${stats.skipped} (no cta-v1 block)`);
  console.log(`    malformed:${stats.malformed}`);
  console.log("    by pattern:");
  for (const p of PATTERNS) console.log(`      ${p.padEnd(22)} ${stats.perPattern[p]}`);
  console.log("    by lang:");
  for (const l of LANGS) console.log(`      ${l} ${stats.perLang[l]}`);
  console.log("  cta-conv-v1 (Task #46):");
  console.log(`    changed:  ${stats.convChanged}`);
  console.log(`    skipped:  ${stats.convSkipped} (no cta-conv-v1 block)`);
  console.log(`    malformed:${stats.convMalformed}`);
  console.log("    by lang:");
  for (const l of LANGS) console.log(`      ${l} ${stats.convPerLang[l]}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
