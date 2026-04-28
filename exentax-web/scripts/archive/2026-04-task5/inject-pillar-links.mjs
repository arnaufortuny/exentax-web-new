#!/usr/bin/env node
/**
 * Task #14 (GEO) — one-shot injection of "abrir LLC" pillar links into
 * the curated cluster of related blog articles.
 *
 * For each (cluster slug × locale), if the content file exists and does
 * not already link to the locale-matched pillar URL, prepend a single
 * localized "see also the pillar guide" paragraph right after the
 * opening backtick of the `export default ` template literal. Idempotent
 * by design: re-running the script after a successful pass is a no-op
 * because the pillar link is already present.
 *
 * Run once, then verify with `node scripts/blog-cluster-audit.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");

const CLUSTER_SLUGS = [
  "llc-estados-unidos-guia-completa-2026",
  "form-5472-que-es-como-presentarlo",
  "nuevo-mexico-vs-wyoming-vs-delaware",
  "ein-numero-fiscal-llc-como-obtenerlo",
  "cuenta-bancaria-mercury-llc-extranjero",
  "registered-agent-que-es-por-que-necesitas",
  "separar-dinero-personal-llc-por-que-importa",
];

const PILLAR_BY_LANG = {
  es: "abrir-llc-estados-unidos",
  en: "open-llc-usa",
  fr: "ouvrir-llc-etats-unis",
  de: "llc-usa-eroeffnen",
  pt: "abrir-llc-eua",
  ca: "obrir-llc-eua",
};

// Localized "see also the pillar" paragraph. Each one is a stand-alone
// HTML <p> so it renders cleanly in the existing blog template.
const LINK_PARA = {
  es: `\n\n<p class="text-sm opacity-80 italic"><strong>Guía pilar:</strong> si quieres el flujo completo paso a paso, consulta nuestra <a href="/es/abrir-llc-estados-unidos">guía definitiva para abrir una LLC en Estados Unidos en 2026</a>.</p>\n`,
  en: `\n\n<p class="text-sm opacity-80 italic"><strong>Pillar guide:</strong> for the full step-by-step flow, see our <a href="/en/open-llc-usa">definitive guide to opening a US LLC in 2026</a>.</p>\n`,
  fr: `\n\n<p class="text-sm opacity-80 italic"><strong>Guide pilier :</strong> pour le parcours complet pas à pas, consultez notre <a href="/fr/ouvrir-llc-etats-unis">guide définitif pour ouvrir une LLC aux États-Unis en 2026</a>.</p>\n`,
  de: `\n\n<p class="text-sm opacity-80 italic"><strong>Pillar-Leitfaden:</strong> Für den vollständigen Schritt-für-Schritt-Ablauf lesen Sie unseren <a href="/de/llc-usa-eroeffnen">definitiven Leitfaden zur LLC-Gründung in den USA im Jahr 2026</a>.</p>\n`,
  pt: `\n\n<p class="text-sm opacity-80 italic"><strong>Guia pilar:</strong> para o fluxo completo passo a passo, consulta o nosso <a href="/pt/abrir-llc-eua">guia definitivo para abrir uma LLC nos EUA em 2026</a>.</p>\n`,
  ca: `\n\n<p class="text-sm opacity-80 italic"><strong>Guia pilar:</strong> per al flux complet pas a pas, consulta la nostra <a href="/ca/obrir-llc-eua">guia definitiva per obrir una LLC als EUA el 2026</a>.</p>\n`,
};

// Pattern that matches an existing pillar link for a given locale (any
// of the three forms the audit accepts: full path, double-quoted slug,
// single-quoted slug). Mirrors the regex in blog-cluster-audit.mjs.
function pillarPathRegex(lang) {
  const slug = PILLAR_BY_LANG[lang];
  return new RegExp(`/${lang}/${slug}\\b|"${slug}"|'${slug}'`);
}

let injected = 0;
let alreadyOk = 0;
let missing = 0;

for (const slug of CLUSTER_SLUGS) {
  for (const lang of Object.keys(PILLAR_BY_LANG)) {
    const file = path.join(CONTENT, lang, `${slug}.ts`);
    if (!fs.existsSync(file)) {
      missing++;
      console.log(`SKIP  ${lang}/${slug}.ts — file not present`);
      continue;
    }
    const src = fs.readFileSync(file, "utf8");
    if (pillarPathRegex(lang).test(src)) {
      alreadyOk++;
      console.log(`OK    ${lang}/${slug}.ts — already links to /${lang}/${PILLAR_BY_LANG[lang]}`);
      continue;
    }
    // Find the opening backtick of `export default \``. Inject the link
    // paragraph right after it so it lands at the very top of the
    // article body — that maximises crawl signal weight without
    // disrupting whatever H2 structure the article already has.
    const openMatch = src.match(/export\s+default\s+`/);
    if (!openMatch) {
      console.log(`WARN  ${lang}/${slug}.ts — could not locate \`export default \\\`\`; skipping`);
      continue;
    }
    const insertAt = openMatch.index + openMatch[0].length;
    const next = src.slice(0, insertAt) + LINK_PARA[lang] + src.slice(insertAt);
    fs.writeFileSync(file, next, "utf8");
    injected++;
    console.log(`INJ   ${lang}/${slug}.ts — added pillar link`);
  }
}

console.log("");
console.log(`Done. injected=${injected}  already-ok=${alreadyOk}  missing=${missing}`);
