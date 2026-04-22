#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOCALES = path.join(ROOT, "client/src/i18n/locales");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const WHATSAPP_URL = "https://wa.me/34614916910";

// Per-section CTA target. Sections not listed here are informational and
// receive NO CTA (per the contract: 0 or 1 CTA per answer).
//   target = "book" | "our_services" | "whatsapp"
const SECTION_CTA = {
  fit:        "book",
  process:    "book",
  banking:    "whatsapp",
  compliance: "book",
};

const SECTION_COUNT = {
  about: 8, fit: 5, llc: 10, process: 10, banking: 8, compliance: 11, advanced: 19, tax: 8,
};

// Per-language CTA labels keyed by target. We always emit the CTA as a
// {{link:href|label}} token so renderFaqMd renders it as a styled link.
// The leading sentinel "→ " makes re-runs idempotent.
const SENTINEL = "→ ";
const CTA = {
  es: {
    book:         { href: "book",         label: "Agenda una llamada de 30 minutos", suffix: " y revisamos tu caso a fondo." },
    our_services: { href: "our_services", label: "Mira nuestros servicios",         suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Escríbenos por WhatsApp",         suffix: " y te respondemos con pasos concretos." },
  },
  en: {
    book:         { href: "book",         label: "Book a 30-minute call",           suffix: " and we'll go through your case." },
    our_services: { href: "our_services", label: "See our services",                suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Message us on WhatsApp",          suffix: " and we'll come back with concrete steps." },
  },
  fr: {
    book:         { href: "book",         label: "Réservez un appel de 30 minutes", suffix: " et nous étudions votre cas." },
    our_services: { href: "our_services", label: "Découvrez nos services",          suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Écrivez-nous sur WhatsApp",       suffix: " et nous reviendrons avec des étapes concrètes." },
  },
  de: {
    book:         { href: "book",         label: "Buchen Sie ein 30-minütiges Gespräch", suffix: " und wir gehen Ihren Fall durch." },
    our_services: { href: "our_services", label: "Sehen Sie unsere Leistungen",     suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Schreiben Sie uns auf WhatsApp",  suffix: " und wir melden uns mit konkreten Schritten." },
  },
  pt: {
    book:         { href: "book",         label: "Reserve uma chamada de 30 minutos", suffix: " e revisamos seu caso a fundo." },
    our_services: { href: "our_services", label: "Veja nossos serviços",            suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Fale com a gente no WhatsApp",    suffix: " e respondemos com passos concretos." },
  },
  ca: {
    book:         { href: "book",         label: "Reserva una trucada de 30 minuts", suffix: " i revisem el teu cas a fons." },
    our_services: { href: "our_services", label: "Mira els nostres serveis",         suffix: "." },
    whatsapp:     { href: WHATSAPP_URL,   label: "Escriu-nos per WhatsApp",          suffix: " i et responem amb passos concrets." },
  },
};

function buildPlan() {
  const plan = []; // { key, target | null }
  for (const [section, n] of Object.entries(SECTION_COUNT)) {
    const target = SECTION_CTA[section] || null;
    for (let i = 0; i < n; i++) plan.push({ key: `${section}_${i}`, target });
  }
  return plan;
}

const ACTION_TARGETS = new Set(["book", "our_services"]);

// Returns the answers block boundaries inside src.
function answersBlock(src) {
  const start = src.indexOf("answers: {");
  if (start < 0) throw new Error("no answers block");
  let i = src.indexOf("{", start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") { depth--; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error("unbalanced answers block");
}

// In-place transform of the value of one answer key inside `answers` substring.
function transformAnswer(answers, key, mutate) {
  const re = new RegExp(`(\\b${key}\\s*:\\s*")((?:[^"\\\\]|\\\\.)*?)(",)`);
  const m = answers.match(re);
  if (!m) return { answers, found: false };
  const newValue = mutate(m[2]);
  return { answers: answers.replace(re, `$1${newValue}$3`), found: true };
}

// Strip any pre-existing CTA-like tokens from a value (in source-escaped form).
//  - Removes any {{link:book|...}} or {{link:our_services|...}} token.
//  - Removes any {{link:https://wa.me/...|...}} token (our own appended form).
//  - Removes any preceding sentinel "→ " and the surrounding "\\n\\n" if present.
//  - Removes raw <a href="https://wa.me/...">...</a> fragments left from prior runs.
function stripExistingCtas(value) {
  let v = value;

  // 1. Sentinel-tagged blocks we previously appended (idempotent rerun).
  //    Pattern: \\n\\n→ ...up to end of value (no closing quote inside per format).
  v = v.replace(/(?:\\n)+→\s.*$/u, "");

  // 2. Any remaining bare "→ {{link:...}} ..." or "→ <a ...>" sentence we
  //    might have missed; remove from sentinel to end of value.
  v = v.replace(/(?:\\n)+→\s.*$/u, "");

  // 3. Pre-existing inline CTA tokens (without sentinel) that target action
  //    routes. We remove only standalone CTA-style sentences: a leading
  //    space (or start) + the link token + optional trailing punctuation
  //    until the next "\\n" or end.
  // Token form: {{link:book|...}} or {{link:our_services|...}}
  const ACTION_TOKEN = /\{\{link:(?:book|our_services|https:\/\/wa\.me\/[^|}]+)\|([^}]+)\}\}/g;
  // Replace each action token with its plain label text so the surrounding
  // prose stays grammatical even when the CTA was woven into a sentence.
  v = v.replace(ACTION_TOKEN, "$1");
  // Clean stray double spaces left behind.
  v = v.replace(/[ \t]{2,}/g, " ");
  // Trim trailing whitespace and \\n escape sequences.
  v = v.replace(/(?:\\n|\s)+$/u, "");

  return v;
}

function buildCtaBlock(lang, target) {
  const c = CTA[lang][target];
  // Append as: \n\n + sentinel + {{link:href|label}} + suffix
  return `\\n\\n${SENTINEL}{{link:${c.href}|${c.label}}}${c.suffix}`;
}

function processLocale(lang) {
  const file = path.join(LOCALES, `${lang}.ts`);
  let src = fs.readFileSync(file, "utf8");
  const { start, end } = answersBlock(src);
  const before = src.slice(0, start);
  let answers = src.slice(start, end);
  const after = src.slice(end);

  let stripped = 0, appended = 0;
  for (const { key, target } of buildPlan()) {
    const r = transformAnswer(answers, key, (val) => {
      const cleaned = stripExistingCtas(val);
      if (cleaned !== val) stripped++;
      if (target) {
        appended++;
        return cleaned + buildCtaBlock(lang, target);
      }
      return cleaned;
    });
    if (!r.found) console.warn(`[${lang}] not found: ${key}`);
    answers = r.answers;
  }

  fs.writeFileSync(file, before + answers + after);
  return { stripped, appended };
}

function verify() {
  const errors = [];
  for (const lang of LANGS) {
    const file = path.join(LOCALES, `${lang}.ts`);
    const src = fs.readFileSync(file, "utf8");
    const { start, end } = answersBlock(src);
    const answers = src.slice(start, end);

    for (const { key, target } of buildPlan()) {
      const re = new RegExp(`\\b${key}\\s*:\\s*"((?:[^"\\\\]|\\\\.)*?)",`);
      const m = answers.match(re);
      if (!m) { errors.push(`${lang}/${key}: missing`); continue; }
      const v = m[1];

      // Count action-target link tokens.
      const tokens = v.match(/\{\{link:(?:book|our_services|https:\/\/wa\.me\/[^|}]+)\|[^}]+\}\}/g) || [];
      // Count raw <a href="https://wa.me/..."> fragments (should be zero now).
      const rawWa = (v.match(/<a\s+href=\\"https:\/\/wa\.me/g) || []).length;
      if (rawWa > 0) errors.push(`${lang}/${key}: raw HTML wa.me anchor present (${rawWa})`);

      if (target) {
        if (tokens.length !== 1) {
          errors.push(`${lang}/${key}: expected 1 CTA, got ${tokens.length}`);
          continue;
        }
        const t = tokens[0];
        const expectedHref = CTA[lang][target].href;
        const hrefM = t.match(/\{\{link:([^|]+)\|/);
        if (!hrefM || hrefM[1] !== expectedHref) {
          errors.push(`${lang}/${key}: wrong CTA href ${hrefM && hrefM[1]}, expected ${expectedHref}`);
        }
      } else {
        if (tokens.length !== 0) {
          errors.push(`${lang}/${key}: expected 0 CTAs, got ${tokens.length}`);
        }
      }
    }
  }
  return errors;
}

const arg = process.argv[2];
if (arg === "verify") {
  const errs = verify();
  if (errs.length === 0) console.log("FAQ verification PASSED.");
  else { console.error(`FAQ verification FAILED (${errs.length}):`); errs.slice(0, 30).forEach(e => console.error(" ", e)); process.exit(1); }
} else {
  let totalStripped = 0, totalAppended = 0;
  for (const lang of LANGS) {
    const r = processLocale(lang);
    console.log(`[${lang}] stripped ${r.stripped}, appended ${r.appended}`);
    totalStripped += r.stripped; totalAppended += r.appended;
  }
  console.log(`Total: stripped ${totalStripped}, appended ${totalAppended}`);
  const errs = verify();
  if (errs.length === 0) console.log("FAQ verification PASSED.");
  else { console.error(`FAQ verification FAILED (${errs.length}):`); errs.slice(0, 30).forEach(e => console.error(" ", e)); process.exit(1); }
}
