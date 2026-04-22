#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../../client/src/i18n/data/subpages.ts");

// Service order in each language block: llcNm, llcWy, llcDe, llcFl, itin
// Language order in file: es, en, fr, de, pt, ca
const TITLES = {
  llcNm: {
    es: "LLC Nuevo México: privacidad real y mantenimiento mínimo",
    en: "New Mexico LLC: real privacy, minimal upkeep",
    fr: "LLC Nouveau-Mexique : confidentialité réelle, peu de coûts",
    de: "New-Mexico-LLC: echte Privatsphäre, minimaler Aufwand",
    pt: "LLC Novo México: privacidade real e custo mínimo",
    ca: "LLC Nou Mèxic: privacitat real i manteniment mínim",
  },
  llcWy: {
    es: "LLC Wyoming: blindaje patrimonial líder en EE. UU.",
    en: "Wyoming LLC: gold-standard US asset protection",
    fr: "LLC Wyoming : protection patrimoniale n°1 aux USA",
    de: "Wyoming-LLC: bester US-Vermögensschutz",
    pt: "LLC Wyoming: máxima proteção patrimonial nos EUA",
    ca: "LLC Wyoming: blindatge patrimonial líder als EUA",
  },
  llcDe: {
    es: "LLC Delaware: la favorita de inversores y B2B serios",
    en: "Delaware LLC: the VC and serious B2B benchmark",
    fr: "LLC Delaware : la référence VC et B2B sérieux",
    de: "Delaware-LLC: Maßstab für VC und ernstes B2B",
    pt: "LLC Delaware: referência para VCs e B2B sério",
    ca: "LLC Delaware: la favorita d'inversors i B2B seriós",
  },
  llcFl: {
    es: "LLC Florida: tu puerta al mercado hispano de Miami",
    en: "Florida LLC: your gateway to Miami's Latin market",
    fr: "LLC Floride : votre porte d'entrée au marché hispanique",
    de: "Florida-LLC: Ihr Tor zum Hispanic-Markt in Miami",
    pt: "LLC Flórida: a sua porta para o mercado hispânico",
    ca: "LLC Florida: la teva porta al mercat hispà de Miami",
  },
  itin: {
    es: "ITIN sin viajar a EE. UU.: lo gestionamos por ti",
    en: "ITIN without travel to the US: we file it for you",
    fr: "ITIN sans voyager aux USA : on s'en charge pour vous",
    de: "ITIN ohne USA-Reise: wir erledigen es für Sie",
    pt: "ITIN sem viajar aos EUA: tratamos disso por si",
    ca: "ITIN sense viatjar als EUA: ho gestionem per tu",
  },
};

// Language sections in file order
const LANG_ORDER = ["es", "en", "fr", "de", "pt", "ca"];
// Service order within each language
const SERVICE_ORDER = ["llcNm", "llcWy", "llcDe", "llcFl", "itin"];

let content = readFileSync(FILE, "utf8");

// Strategy: walk all `seo: {` blocks; track which language and which service we're in.
// We detect the start of each language section via lines like `const es: SubpagesBase = {` (only es) or by `\n  llcNm: {` for each lang inside SUBPAGES_BY_LANG—actually structure differs.
// Simpler: walk lines, maintain a stack of "language" by detecting `const <lang>: SubpagesBase = {` declarations.
// Inside, count `seo: {` occurrences in service order: llcNm, llcWy, llcDe, llcFl, itin (always 5 per lang block).

const lines = content.split("\n");
let currentLang = null;
let serviceIdx = 0;
const out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const langDecl = line.match(/^const\s+(es|en|fr|de|pt|ca)\s*:\s*SubpagesBase\s*=\s*\{/);
  if (langDecl) {
    currentLang = langDecl[1];
    serviceIdx = 0;
  }
  out.push(line);
  if (currentLang && /^\s+seo:\s*\{\s*$/.test(line) && serviceIdx < SERVICE_ORDER.length) {
    // Look ahead to check ogTitle isn't already present
    const lookahead = lines.slice(i + 1, i + 8).join("\n");
    if (!/ogTitle:/.test(lookahead)) {
      // Find the indent of the next content line (e.g., "      title:")
      const next = lines[i + 1] || "";
      const indent = (next.match(/^\s*/) || [""])[0];
      const svc = SERVICE_ORDER[serviceIdx];
      const ogTitle = TITLES[svc][currentLang];
      out.push(`${indent}ogTitle: ${JSON.stringify(ogTitle)},`);
    }
    serviceIdx++;
    if (serviceIdx >= SERVICE_ORDER.length) currentLang = null;
  }
}
writeFileSync(FILE, out.join("\n"), "utf8");
console.log("subpages.ts updated");
