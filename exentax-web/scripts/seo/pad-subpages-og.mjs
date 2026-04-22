#!/usr/bin/env node
/**
 * Pad short ogDescription fields in client/src/i18n/data/subpages.ts so
 * every service-subpage social preview meets 120 ≤ len ≤ 160. Mirrors
 * pad-static-og.mjs but targets the subpages bundle (5 services × 6 langs).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../../client/src/i18n/data/subpages.ts");

const TAILS = {
  es: [
    " Asesoría Exentax: tu LLC en EE. UU., sin sorpresas.",
    " Exentax acompaña tu LLC del diagnóstico al día a día.",
    " Consultores fiscales Exentax para no residentes.",
    " Exentax: estructura, banca y compliance de tu LLC.",
  ],
  en: [
    " Exentax: tax-led setup, banking and compliance for your US LLC.",
    " End-to-end Exentax support for non-resident LLC owners.",
    " Exentax: your US LLC ready in 48 h, no surprises.",
    " Exentax tax advisors for non-resident US LLC owners.",
  ],
  fr: [
    " Exentax : création, banque et conformité de votre LLC US.",
    " Cabinet fiscal Exentax pour LLC non-résidents.",
    " Exentax accompagne votre LLC, du diagnostic à la conformité.",
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
    " Consultores fiscais Exentax para titulares não residentes.",
    " Exentax acompanha a sua LLC, do diagnóstico ao dia a dia.",
    " Exentax: a sua LLC americana operacional em 48 horas.",
  ],
  ca: [
    " Exentax: constitució, banca i compliance de la teva LLC.",
    " Consultors fiscals Exentax per a titulars no residents.",
    " Exentax t'acompanya del diagnòstic a la compliance anual.",
    " Exentax: la teva LLC americana operativa en 48 hores.",
  ],
};

const MIN = 120, MAX = 160, TARGET = 150;

function pad(text, lang) {
  const t = (text || "").trim();
  if (!t || (t.length >= MIN && t.length <= MAX)) return t;
  if (t.length > MAX) {
    const slice = t.slice(0, MAX - 1);
    const sp = slice.lastIndexOf(" ");
    return (sp > MAX - 25 ? slice.slice(0, sp) : slice).replace(/[\s.,;:]+$/, "") + "…";
  }
  const base = t.replace(/[\s.]+$/, "") + ".";
  let best = null;
  for (const tail of TAILS[lang]) {
    const cand = (base + tail).replace(/\.\s*\./g, ".");
    if (cand.length <= MAX && (!best || Math.abs(TARGET - cand.length) < Math.abs(TARGET - best.length))) best = cand;
  }
  if (best && best.length >= MIN) return best;
  for (const tail of TAILS[lang]) {
    const cand = (base + tail).replace(/\.\s*\./g, ".");
    if (cand.length <= MAX && cand.length >= MIN) return cand;
  }
  return base + TAILS[lang][0];
}

const escape = (s) => s.replace(/"/g, '\\"');

const src = readFileSync(FILE, "utf8");
const lines = src.split("\n");

// Find language sections to know which language a given line belongs to.
const langStarts = [];
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^const\s+(es|en|fr|de|pt|ca)\s*:\s*SubpagesBase\s*=\s*\{/);
  if (m) langStarts.push({ lang: m[1], start: i });
}

let padded = 0;
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\s*)ogDescription:\s*"((?:[^"\\]|\\.)*)"(,?)\s*$/);
  if (!m) continue;
  let lang = "en";
  for (const ls of langStarts) if (i >= ls.start) lang = ls.lang;
  const newDesc = pad(m[2], lang);
  if (newDesc !== m[2]) {
    lines[i] = `${m[1]}ogDescription: "${escape(newDesc)}"${m[3]}`;
    padded++;
  }
}
writeFileSync(FILE, lines.join("\n"), "utf8");
console.log(`Padded subpages ogDescription fields: ${padded}`);
