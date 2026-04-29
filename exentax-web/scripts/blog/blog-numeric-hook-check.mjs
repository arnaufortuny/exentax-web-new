#!/usr/bin/env node
/**
 * Heuristic for Task #33 (LOTE 6 — numeric hook).
 *
 * For every blog article (es/en/fr/de/pt/ca), extract the first 100 tokens of
 * the lead and check whether it contains at least one digit (0-9).
 *
 * "Lead" is defined as the body content from the first non-empty line of the
 * exported template literal, excluding HTML tags, headings (## ...) and link
 * targets, until 100 tokens have been consumed.
 *
 * Exit code: 0 if all articles pass, 1 otherwise.
 *
 * Usage: node scripts/blog/blog-numeric-hook-check.mjs [--list] [--lang es|en|fr|de|pt|ca]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const ROOT = path.join(PROJECT_ROOT, "client", "src", "data", "blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const args = new Set(process.argv.slice(2));
const wantList = args.has("--list");
const langFilter = (() => {
  const idx = process.argv.indexOf("--lang");
  if (idx > 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
})();

function extractLead(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/export default `([\s\S]*?)`;?\s*$/);
  if (!m) return null;
  const body = m[1];
  const beforeHeading = body.split(/^##\s/m)[0];
  const stripped = beforeHeading
    .replace(/<a [^>]*>/g, "")
    .replace(/<\/a>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const tokens = stripped.split(/\s+/).slice(0, 100);
  return tokens.join(" ");
}

const offenders = [];
let total = 0;

for (const lang of LANGS) {
  if (langFilter && lang !== langFilter) continue;
  const dir = path.join(ROOT, lang);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .sort();
  for (const file of files) {
    total += 1;
    const fp = path.join(dir, file);
    const lead = extractLead(fp);
    if (lead == null) continue;
    if (!/\d/.test(lead)) {
      offenders.push({ lang, file, lead: lead.slice(0, 240) });
    }
  }
}

console.log(`Total articles scanned: ${total}`);
console.log(`Articles without a digit in first 100 tokens: ${offenders.length}`);
const byLang = {};
for (const o of offenders) byLang[o.lang] = (byLang[o.lang] || 0) + 1;
console.log("By language:", JSON.stringify(byLang));

if (wantList) {
  for (const o of offenders) {
    console.log(`\n[${o.lang}/${o.file}]`);
    console.log(`  ${o.lead}`);
  }
}

process.exit(offenders.length > 0 ? 1 : 0);
