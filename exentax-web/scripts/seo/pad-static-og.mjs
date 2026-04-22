#!/usr/bin/env node
/**
 * Pad short ogDesc / ogDescription fields in static i18n locale bundles
 * (es, en, fr, de, pt, ca) so every social preview meets 120 ≤ len ≤ 160.
 * Uses meaningful per-language tail clauses (Exentax brand voice).
 * Idempotent: skips fields already in the [120,160] window.
 *
 * Also nudges any ogTitle that is < 20 chars by appending the language
 * suffix " · Exentax" so the social card lead has enough text mass.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOC_DIR = resolve(__dirname, "../../client/src/i18n/locales");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const TAILS = {
  es: [
    " Asesoría fiscal Exentax para tu LLC en EE. UU.",
    " Exentax: estructura, banca y compliance de tu LLC.",
    " Exentax acompaña tu LLC del diagnóstico al día a día.",
    " Consultores fiscales Exentax para no residentes.",
  ],
  en: [
    " Exentax: tax-led setup, banking and compliance for your US LLC.",
    " Exentax tax advisors for non-resident US LLC owners.",
    " Exentax: your US LLC ready in 48 h, no surprises.",
    " End-to-end Exentax support for your US LLC.",
  ],
  fr: [
    " Exentax : création, banque et conformité de votre LLC US.",
    " Exentax accompagne votre LLC, du diagnostic à la conformité.",
    " Cabinet fiscal Exentax pour LLC non-résidents.",
    " Exentax : votre LLC américaine opérationnelle en 48 h.",
  ],
  de: [
    " Exentax: Gründung, Banking und Compliance Ihrer US-LLC.",
    " Steuerberater Exentax für nicht-ansässige LLC-Inhaber.",
    " Exentax begleitet Ihre LLC von der Diagnose bis zum Alltag.",
    " Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
  ],
  pt: [
    " Exentax: constituição, banca e compliance da sua LLC.",
    " Consultores fiscais Exentax para titulares de LLC não residentes.",
    " Exentax acompanha a sua LLC, do diagnóstico ao dia a dia.",
    " Exentax: a sua LLC americana operacional em 48 horas.",
  ],
  ca: [
    " Exentax: constitució, banca i compliance de la teva LLC.",
    " Consultors fiscals Exentax per a titulars de LLC no residents.",
    " Exentax t'acompanya del diagnòstic a la compliance anual.",
    " Exentax: la teva LLC americana operativa en 48 hores.",
  ],
};

const TITLE_SUFFIX = " · Exentax";
const MIN = 120;
const MAX = 160;
const TARGET = 150;

function pad(text, lang) {
  const t = (text || "").trim();
  if (!t) return t;
  if (t.length >= MIN && t.length <= MAX) return t;
  if (t.length > MAX) {
    const slice = t.slice(0, MAX - 1);
    const sp = slice.lastIndexOf(" ");
    return (sp > MAX - 25 ? slice.slice(0, sp) : slice).replace(/[\s.,;:]+$/, "") + "…";
  }
  const base = t.replace(/[\s.]+$/, "") + ".";
  const tails = TAILS[lang];
  let best = null;
  for (const tail of tails) {
    const cand = (base + tail).replace(/\.\s*\./g, ".");
    if (cand.length <= MAX && (!best || Math.abs(TARGET - cand.length) < Math.abs(TARGET - best.length))) {
      best = cand;
    }
  }
  if (best && best.length >= MIN) return best;
  for (const tail of tails) {
    const cand = (base + tail).replace(/\.\s*\./g, ".");
    if (cand.length <= MAX && cand.length >= MIN) return cand;
  }
  return base + tails[0]; // last resort
}

function escape(s) {
  return s.replace(/"/g, '\\"');
}

let totalPadded = 0;
let totalTitlePadded = 0;
for (const lang of LANGS) {
  const file = join(LOC_DIR, `${lang}.ts`);
  const src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  let changed = 0;
  for (let i = 0; i < lines.length; i++) {
    const md = lines[i].match(/^(\s*)(ogDescription|ogDesc):\s*"((?:[^"\\]|\\.)*)"(,?)\s*$/);
    if (md) {
      const padded = pad(md[3], lang);
      if (padded !== md[3]) {
        lines[i] = `${md[1]}${md[2]}: "${escape(padded)}"${md[4]}`;
        changed++;
      }
    }
    const mt = lines[i].match(/^(\s*)ogTitle:\s*"((?:[^"\\]|\\.)*)"(,?)\s*$/);
    if (mt) {
      const t = mt[2];
      if (t.length > 0 && t.length < 20) {
        const candidate = (t + TITLE_SUFFIX).slice(0, 60);
        if (candidate.length >= 20) {
          lines[i] = `${mt[1]}ogTitle: "${escape(candidate)}"${mt[3]}`;
          totalTitlePadded++;
        }
      }
    }
  }
  writeFileSync(file, lines.join("\n"), "utf8");
  console.log(`[${lang}.ts] padded ogDescription fields: ${changed}`);
  totalPadded += changed;
}
console.log(`Total ogDescription fields padded: ${totalPadded}`);
console.log(`Total ogTitle fields lengthened (<20): ${totalTitlePadded}`);
