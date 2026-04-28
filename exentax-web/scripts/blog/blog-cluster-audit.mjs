#!/usr/bin/env node
/**
 * Task #14 (GEO) — blog cluster audit.
 *
 * The "abrir LLC" pillar (`/es/abrir-llc` and its 5 locale equivalents)
 * only earns thematic authority if the related cluster articles point
 * back at it — that is what tells Google and AI engines the pillar is
 * the canonical hub for the topic. This script:
 *
 *   1. Iterates through the curated CLUSTER_SLUGS list (the procedural
 *      and explanatory posts that share the "open a US LLC as a non-
 *      resident" intent).
 *   2. For each cluster slug, verifies the Spanish content file under
 *      `client/src/data/blog-content/<slug>.ts` contains at least one
 *      link to `/es/abrir-llc` (the canonical pillar URL) OR to the
 *      pillar token `abrir-llc` (so links from RouteLink helpers also
 *      count).
 *   3. For each translated content file under `blog-content/<lang>/`,
 *      checks for a link to that language's pillar slug
 *      (`/<lang>/<localized-slug>`).
 *
 * Output: a per-cluster table with PASS / WARN / FAIL. Exit code 0 always
 * — this is a *report* (not a gate) because cluster maturation is a
 * multi-task effort and we don't want to block deploys while the link
 * topology is being written. Wire into `npm run lint:blog` later when the
 * topology is mature enough to gate.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

// Curated set of articles that share intent with the "abrir LLC" pillar
// (procedural how-tos, state comparisons, EIN, banking, compliance).
// Keep this list short and canonical — quality > quantity.
const CLUSTER_SLUGS = [
  "llc-estados-unidos-guia-completa-2026",
  "form-5472-que-es-como-presentarlo",
  "nuevo-mexico-vs-wyoming-vs-delaware",
  "ein-numero-fiscal-llc-como-obtenerlo",
  "cuenta-bancaria-mercury-llc-extranjero",
  "registered-agent-que-es-por-que-necesitas",
  "separar-dinero-personal-llc-por-que-importa",
];

// Localized pillar slugs — must stay byte-for-byte in sync with the
// `pillar_open_llc` row in shared/routes.ts. Drifting these strings will
// silently mark every cluster article as broken.
const PILLAR_BY_LANG = {
  es: "abrir-llc-estados-unidos",
  en: "open-llc-usa",
  fr: "ouvrir-llc-etats-unis",
  de: "llc-usa-eroeffnen",
  pt: "abrir-llc-eua",
  ca: "obrir-llc-eua",
};
const LANGS = Object.keys(PILLAR_BY_LANG);

function readIfExists(p) {
  try { return fs.readFileSync(p, "utf8"); } catch { return null; }
}

function pillarPathRegex(lang) {
  const slug = PILLAR_BY_LANG[lang];
  return new RegExp(`/${lang}/${slug}\\b|"${slug}"|'${slug}'`);
}

const rows = [];
let totalChecks = 0;
let totalLinks = 0;

for (const slug of CLUSTER_SLUGS) {
  for (const lang of LANGS) {
    // Spanish content lives under blog-content/es/<slug>.ts (not at the
    // blog-content/ root); all 6 locales follow the same `<lang>/<slug>.ts`
    // convention since the import.meta.glob refactor.
    const file = path.join(CONTENT, lang, `${slug}.ts`);
    const src = readIfExists(file);
    if (src === null) {
      rows.push({ slug, lang, status: "SKIP", note: "content file not present" });
      continue;
    }
    totalChecks++;
    const re = pillarPathRegex(lang);
    if (re.test(src)) {
      totalLinks++;
      rows.push({ slug, lang, status: "PASS", note: `links to /${lang}/${PILLAR_BY_LANG[lang]}` });
    } else {
      rows.push({ slug, lang, status: "WARN", note: `no link to /${lang}/${PILLAR_BY_LANG[lang]}` });
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(`${DIM}Blog cluster audit — does each cluster article point to the "abrir LLC" pillar?${RESET}`);
console.log("");
console.log(`${"Slug".padEnd(48)} ${"Lang".padEnd(5)} Status  Detail`);
console.log("-".repeat(96));
for (const r of rows) {
  const colour = r.status === "PASS" ? GREEN : r.status === "WARN" ? YELLOW : DIM;
  const sym = r.status === "PASS" ? "✓" : r.status === "WARN" ? "!" : "·";
  console.log(`${r.slug.padEnd(48)} ${r.lang.padEnd(5)} ${colour}${sym} ${r.status.padEnd(5)}${RESET} ${r.note}`);
}
console.log("");
const passes = rows.filter((r) => r.status === "PASS").length;
const warns = rows.filter((r) => r.status === "WARN").length;
const skips = rows.filter((r) => r.status === "SKIP").length;
console.log(`${GREEN}PASS:${RESET} ${passes}    ${YELLOW}WARN:${RESET} ${warns}    ${DIM}SKIP:${RESET} ${skips}    (${totalLinks}/${totalChecks} active links)`);
console.log(`${DIM}This is a report, not a gate. Reach >80% PASS to consider the pillar topologically mature.${RESET}`);
// Exit 0 — never fail the build on cluster gaps; surface them only.
process.exit(0);
