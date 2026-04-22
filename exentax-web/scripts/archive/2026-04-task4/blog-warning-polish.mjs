#!/usr/bin/env node
/*
 * blog-warning-polish.mjs - Task #24
 *
 * Polishes the two largest classes of warnings flagged by
 * scripts/blog-final-qa.mjs across the blog corpus, in a fully
 * idempotent way:
 *
 *   1. em-dash usage ("—") inside body text - replaced with the ASCII
 *      hyphen sequence " - " so the QA reporter no longer flags them.
 *      Headings ("## ... — ...") are converted to use a colon for
 *      readability ("## ...: ...").
 *
 *   2. Articles must expose **exactly two** CTAs: one calculator link
 *      (/{lang}#calculadora or /{lang}/calculadora) and one localized
 *      booking link (/{lang}/agendar | /book | /reserver | /buchen).
 *      The script:
 *        - Keeps only the FIRST occurrence of each kind of CTA anchor;
 *          additional anchors are demoted to <strong> wrappers (so the
 *          surrounding prose still reads naturally).
 *        - If after demotion the article has zero booking CTAs, a
 *          standardized booking CTA block is appended right before the
 *          closing template literal.
 *        - If after demotion the article has zero calculator CTAs, a
 *          standardized calc CTA block is appended too.
 *
 * Idempotent: re-running the script on a polished corpus is a no-op.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const CONTENT_DIR = resolve(ROOT, "client/src/data/blog-content");

// Per-language CTA recognition. Mirrors the regexes used by
// scripts/blog-final-qa.mjs so the two stay in sync.
const BOOKING_ALIASES = "agendar|book|reservar|reserver|reserva|buchen";
const CALC_ALIASES = "calculadora|calculator|calculatrice|rechner";

// Standardized booking-CTA block per language.
const BOOKING_CTA_BLOCK = {
  es: `

<!-- exentax:booking-cta-v1 -->
¿Quieres aplicar este protocolo a tu caso? <a href="/es/agendar">Reserva una sesión con el equipo de Exentax</a> y revisamos tu LLC con números reales en treinta minutos, sin compromiso.
<!-- /exentax:booking-cta-v1 -->`,
  en: `

<!-- exentax:booking-cta-v1 -->
Want to apply this protocol to your own case? <a href="/en/book">Book a session with the Exentax team</a> and we will review your LLC with real numbers in thirty minutes, no strings attached.
<!-- /exentax:booking-cta-v1 -->`,
  fr: `

<!-- exentax:booking-cta-v1 -->
Vous souhaitez appliquer ce protocole à votre dossier ? <a href="/fr/reserver">Réservez une session avec l'équipe Exentax</a> et nous passerons votre LLC en revue avec des chiffres réels en trente minutes, sans engagement.
<!-- /exentax:booking-cta-v1 -->`,
  de: `

<!-- exentax:booking-cta-v1 -->
Möchten Sie dieses Protokoll auf Ihren Fall anwenden? <a href="/de/buchen">Buchen Sie eine Session mit dem Exentax-Team</a> und wir prüfen Ihre LLC in dreißig Minuten mit echten Zahlen, unverbindlich.
<!-- /exentax:booking-cta-v1 -->`,
  pt: `

<!-- exentax:booking-cta-v1 -->
Quer aplicar este protocolo ao seu caso? <a href="/pt/agendar">Agende uma sessão com a equipa Exentax</a> e revemos a sua LLC com números reais em trinta minutos, sem compromisso.
<!-- /exentax:booking-cta-v1 -->`,
  ca: `

<!-- exentax:booking-cta-v1 -->
Vols aplicar aquest protocol al teu cas? <a href="/ca/agendar">Reserva una sessió amb l'equip d'Exentax</a> i revisem la teva LLC amb números reals en trenta minuts, sense compromís.
<!-- /exentax:booking-cta-v1 -->`,
};

// Standardized calc-CTA block per language. Only used as a safety net
// for articles that somehow have zero calculator CTA anchors.
const CALC_CTA_BLOCK = {
  es: `

<!-- exentax:calc-cta-v1 -->
> **Pon números a tu caso.** La <a href="/es#calculadora">calculadora fiscal de Exentax</a> compara tu carga actual con la que tendrías operando con una LLC americana correctamente declarada en tu país de residencia.
<!-- /exentax:calc-cta-v1 -->`,
  en: `

<!-- exentax:calc-cta-v1 -->
> **Put numbers to your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current burden with what you would owe running a US LLC properly declared in your country of residence.
<!-- /exentax:calc-cta-v1 -->`,
  fr: `

<!-- exentax:calc-cta-v1 -->
> **Chiffrez votre cas.** La <a href="/fr#calculadora">calculatrice fiscale Exentax</a> compare votre charge actuelle à celle que vous auriez avec une LLC américaine correctement déclarée dans votre pays de résidence.
<!-- /exentax:calc-cta-v1 -->`,
  de: `

<!-- exentax:calc-cta-v1 -->
> **Rechnen Sie Ihren Fall durch.** Der <a href="/de#calculadora">Exentax-Steuerrechner</a> vergleicht Ihre aktuelle Belastung mit der, die Sie mit einer ordnungsgemäß in Ihrem Wohnsitzland deklarierten US-LLC hätten.
<!-- /exentax:calc-cta-v1 -->`,
  pt: `

<!-- exentax:calc-cta-v1 -->
> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal da Exentax</a> compara a sua carga atual com a que teria a operar com uma LLC americana corretamente declarada no seu país de residência.
<!-- /exentax:calc-cta-v1 -->`,
  ca: `

<!-- exentax:calc-cta-v1 -->
> **Posa números al teu cas.** La <a href="/ca#calculadora">calculadora fiscal d'Exentax</a> compara la teva càrrega actual amb la que tindries operant amb una LLC americana correctament declarada al teu país de residència.
<!-- /exentax:calc-cta-v1 -->`,
};

function fixEmDashesInBody(body) {
  let changed = body;
  // Headings: "## Foo — Bar" -> "## Foo: Bar".
  changed = changed.replace(/^(#{1,6}[^\n]*?) — /gm, "$1: ");
  // Generic spaced em-dash -> spaced hyphen.
  changed = changed.replace(/ — /g, " - ");
  // Stray em-dashes (no surrounding spaces) -> hyphen.
  changed = changed.replace(/—/g, "-");
  return changed;
}

// Walk every <a href="...">label</a>. For each, classify as booking,
// calc, or other. Keep the first booking and the first calc; demote
// subsequent booking/calc anchors to <strong>label</strong>.
function enforceTwoCtas(raw, lang) {
  const bookingRe = new RegExp(`^/${lang}/(${BOOKING_ALIASES})(/|#|$|\\?)`);
  const calcRe = new RegExp(`^/${lang}[/#](${CALC_ALIASES})(/|#|$|\\?)`);

  let bookingSeen = 0;
  let calcSeen = 0;

  // Greedy-but-bounded match: an anchor never spans a closing </a> tag.
  const out = raw.replace(
    /<a\s+href="([^"]+)"\s*>([\s\S]*?)<\/a>/g,
    (full, href, label) => {
      const isBooking = bookingRe.test(href);
      const isCalc = !isBooking && calcRe.test(href);
      if (isBooking) {
        bookingSeen++;
        if (bookingSeen === 1) return full;
        return `<strong>${label}</strong>`;
      }
      if (isCalc) {
        calcSeen++;
        if (calcSeen === 1) return full;
        return `<strong>${label}</strong>`;
      }
      return full;
    },
  );

  return { out, bookingSeen, calcSeen };
}

function injectBlock(raw, block, marker) {
  if (raw.includes(marker)) return raw;
  const m = raw.match(/^([\s\S]*?)(\n?)`\s*;?\s*$/);
  if (!m) return raw;
  const head = m[1];
  return `${head}${block}\n\`;\n`;
}

let touched = 0;
let emFixedFiles = 0;
let bookingInjected = 0;
let calcInjected = 0;
let demotedFiles = 0;

for (const lang of LANGS) {
  const dir = join(CONTENT_DIR, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const f of files) {
    const p = join(dir, f);
    const before = readFileSync(p, "utf8");
    let after = before;

    const dashed = fixEmDashesInBody(after);
    if (dashed !== after) {
      after = dashed;
      emFixedFiles++;
    }

    const beforeCtaPass = after;
    const { out, bookingSeen, calcSeen } = enforceTwoCtas(after, lang);
    after = out;
    if (after !== beforeCtaPass) demotedFiles++;

    if (bookingSeen === 0) {
      const injected = injectBlock(
        after,
        BOOKING_CTA_BLOCK[lang],
        "<!-- exentax:booking-cta-v1 -->",
      );
      if (injected !== after) {
        after = injected;
        bookingInjected++;
      }
    }
    if (calcSeen === 0) {
      const injected = injectBlock(
        after,
        CALC_CTA_BLOCK[lang],
        "<!-- exentax:calc-cta-v1 -->",
      );
      if (injected !== after) {
        after = injected;
        calcInjected++;
      }
    }

    if (after !== before) {
      writeFileSync(p, after);
      touched++;
    }
  }
}

console.log(
  `blog-warning-polish: touched ${touched} files (em-dash fixes in ${emFixedFiles}, ` +
    `extra-CTA demotion in ${demotedFiles}, booking CTA injected in ${bookingInjected}, ` +
    `calc CTA injected in ${calcInjected}).`,
);
