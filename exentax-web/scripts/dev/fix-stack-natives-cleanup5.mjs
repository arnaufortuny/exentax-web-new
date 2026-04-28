#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "client/src/data/blog-content";
const LANGS = ["ca", "fr", "pt", "de"];

const URL_RE = /(href="[^"]*"|\]\([^)]*\)|\/[a-z0-9-]+(?:\/[a-z0-9-]+)+)/g;
const SUBSTACK_RE = /Substack/g;

function protect(input) {
  const tokens = [];
  let out = input.replace(URL_RE, (m) => {
    tokens.push(m);
    return `\u0000U${tokens.length - 1}\u0000`;
  });
  out = out.replace(SUBSTACK_RE, (m) => {
    tokens.push(m);
    return `\u0000U${tokens.length - 1}\u0000`;
  });
  return { out, tokens };
}
function restore(text, tokens) {
  return text.replace(/\u0000U(\d+)\u0000/g, (_, i) => tokens[Number(i)]);
}

function applyAll(text, rules) {
  let out = text;
  for (const [pat, rep] of rules) {
    out = out.replace(pat, rep);
  }
  return out;
}

const CA_RULES = [
  // Double-letter typos from over-replacement
  [/\bcompletaa\b/g, "completa"],
  [/\bCompletaa\b/g, "Completa"],
  [/\bcompletaaa\b/g, "completa"],
  [/\bmínimaa\b/g, "mínima"],
  [/\btípicaa\b/g, "típica"],
  [/\bequilibradaa\b/g, "equilibrada"],
  [/\bbancàriaa\b/g, "bancària"],
  [/\bantigaa\b/g, "antiga"],
  [/\bnovaa\b/g, "nova"],
  [/\badequadaa\b/g, "adequada"],
  [/\brecomanadaa\b/g, "recomanada"],
  [/\bcorrectaa\b/g, "correcta"],
  [/\boptimaa\b/g, "òptima"],
  [/\bòptimaa\b/g, "òptima"],

  // Bad article elisions: l'teva / l' teva → la teva
  [/\bl'\s*teva\b/g, "la teva"],
  [/\bl'\s*meva\b/g, "la meva"],
  [/\bl'\s*seva\b/g, "la seva"],
  [/\bl'\s*nostra\b/g, "la nostra"],
  [/\bl'\s*vostra\b/g, "la vostra"],
  [/\bL'\s*teva\b/g, "La teva"],
  [/\bL'\s*meva\b/g, "La meva"],
  [/\bL'\s*seva\b/g, "La seva"],
  [/\bL'\s*nostra\b/g, "La nostra"],
  [/\bL'\s*vostra\b/g, "La vostra"],

  // de l' seva / de l'teva  → de la seva / de la teva (covered above + de prefix kept)
  // (previous rules already turn l'teva → la teva, so "de l'teva" → "de la teva")

  // "Tot l'teva" / "Tot la teva" → "Tota la teva" (tot adj agreement)
  [/\bTot la teva\b/g, "Tota la teva"],
  [/\btot la teva\b/g, "tota la teva"],
  [/\bTot la seva\b/g, "Tota la seva"],
  [/\btot la seva\b/g, "tota la seva"],
  [/\bTot la meva\b/g, "Tota la meva"],
  [/\btot la meva\b/g, "tota la meva"],
  [/\bTot la nostra\b/g, "Tota la nostra"],
  [/\btot la nostra\b/g, "tota la nostra"],
  [/\bTot la vostra\b/g, "Tota la vostra"],
  [/\btot la vostra\b/g, "tota la vostra"],

  // CA agreement: "una petit arquitectura" → "una petita arquitectura"
  [/\buna petit arquitectura\b/g, "una petita arquitectura"],
  [/\buna gran petit arquitectura\b/g, "una petita arquitectura"],

  // "el nova" (referring to fem arquitectura) → "la nova"
  // Only when referring to architecture context to avoid false positives
  [/\bantiga i el nova\b/g, "antiga i la nova"],
  [/\bantic i el nova\b/g, "antic i la nova"],

  // Anchor cleanup: " l'arquitectura bancària completaa" already covered by completaa rule above.
];

// Use unicode-aware boundary helpers because JS \b doesn't treat accented letters as word chars.
const NW = "(?<![\\p{L}])";
const NW_E = "(?![\\p{L}])";
function uw(pattern) {
  return new RegExp(NW + pattern + NW_E, "gu");
}

const FR_RULES = [
  // Triple-e adjective typos
  [uw("équilibréeee"), "équilibrée"],
  [uw("équilibréee"), "équilibrée"],
  [uw("Équilibréeee"), "Équilibrée"],
  [uw("Équilibréee"), "Équilibrée"],
  [uw("recommandéeee"), "recommandée"],
  [uw("recommandéee"), "recommandée"],
  [uw("Recommandéeee"), "Recommandée"],
  [uw("Recommandéee"), "Recommandée"],
  [uw("adaptéeee"), "adaptée"],
  [uw("adaptéee"), "adaptée"],
  [uw("appropriéeee"), "appropriée"],
  [uw("appropriéee"), "appropriée"],
  [uw("cohérenteee"), "cohérente"],
  [uw("cohérentee"), "cohérente"],
  [uw("adéquateee"), "adéquate"],
  [uw("adéquatee"), "adéquate"],
  [uw("complèteee"), "complète"],
  [uw("complèteè"), "complète"],
  [uw("optimaleeé"), "optimale"],
  [uw("optimaleé"), "optimale"],
  [uw("correcteee"), "correcte"],
  [uw("correctee"), "correcte"],
];

const PT_RULES = [
  [/\bcompletaa\b/g, "completa"],
  [/\bCompletaa\b/g, "Completa"],
  [/\btípicaa\b/g, "típica"],
  [/\bmínimaa\b/g, "mínima"],
  [/\bequilibradaa\b/g, "equilibrada"],
  [/\bbancáriaa\b/g, "bancária"],
  [/\badequadaa\b/g, "adequada"],
  [/\brecomendadaa\b/g, "recomendada"],
  [/\bantigaa\b/g, "antiga"],
  [/\bnovaa\b/g, "nova"],
  [/\bcorretaa\b/g, "correta"],
];

const DE_RULES = [
  // No double-letter typos found in DE survey, but cover obvious ones if present.
  [/\bArchitekturr\b/g, "Architektur"],
  [/\bArchitekturenn\b/g, "Architekturen"],
];

const RULES_BY_LANG = { ca: CA_RULES, fr: FR_RULES, pt: PT_RULES, de: DE_RULES };

function walkDir(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walkDir(p));
    else if (entry.endsWith(".ts")) out.push(p);
  }
  return out;
}

let totalChanged = 0;
let totalEdits = 0;

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const rules = RULES_BY_LANG[lang];
  if (!rules.length) continue;
  for (const file of walkDir(dir)) {
    const original = readFileSync(file, "utf8");
    const { out: protectedText, tokens } = protect(original);
    const processed = applyAll(protectedText, rules);
    const restored = restore(processed, tokens);
    if (restored !== original) {
      writeFileSync(file, restored);
      const diff = (original.match(/\n/g)?.length ?? 0) - (restored.match(/\n/g)?.length ?? 0);
      totalChanged++;
      totalEdits += Math.abs(diff) || 1;
      console.log(`fixed: ${file}`);
    }
  }
}

console.log(`\nTotal files changed: ${totalChanged}`);
