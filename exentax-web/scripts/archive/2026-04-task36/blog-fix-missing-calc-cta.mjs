#!/usr/bin/env node
/*
 * blog-fix-missing-calc-cta.mjs (Task #7)
 * ---------------------------------------------------------------------------
 * Closes the 16 CTA gaps reported by `blog-audit-table.mjs`. For every
 * non-Spanish article file that lacks the `<!-- exentax:calc-cta-v1 -->`
 * marker pair, inject a localized calculator CTA blockquote immediately
 * after the opening template literal.
 *
 * Idempotent: files that already contain the marker pair are skipped.
 * ---------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const CONTENT = join(REPO, "client", "src", "data", "blog-content");
const LANGS = ["en", "fr", "de", "pt", "ca"];

const COPY = {
  en: `> **Put numbers on your case.** The <a href="/en#calculadora">Exentax tax calculator</a> compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.`,
  fr: `> **Mettez des chiffres sur votre cas.** Le <a href="/fr#calculadora">simulateur fiscal Exentax</a> compare votre charge fiscale actuelle à celle que vous paieriez en exploitant une LLC américaine correctement déclarée dans votre pays de résidence.`,
  de: `> **Rechnen Sie Ihren Fall durch.** Der <a href="/de#calculadora">Exentax-Steuerrechner</a> vergleicht Ihre aktuelle Steuerlast mit dem, was Sie zahlen würden, wenn Sie eine US-LLC korrekt in Ihrem Wohnsitzland deklarieren.`,
  pt: `> **Coloque números no seu caso.** A <a href="/pt#calculadora">calculadora fiscal Exentax</a> compara a sua carga tributária atual com o que pagaria operando uma LLC norte-americana corretamente declarada no seu país de residência.`,
  ca: `> **Posa xifres al teu cas.** La <a href="/ca#calculadora">calculadora fiscal Exentax</a> compara la teva càrrega fiscal actual amb el que pagaries operant una LLC nord-americana correctament declarada al teu país de residència.`,
};

const OPEN = "<!-- exentax:calc-cta-v1 -->";
const CLOSE = "<!-- /exentax:calc-cta-v1 -->";

let injected = 0;
let skipped = 0;
const touched = [];

for (const lang of LANGS) {
  const dir = join(CONTENT, lang);
  let files;
  try { files = readdirSync(dir); } catch { continue; }
  for (const f of files) {
    if (!f.endsWith(".ts")) continue;
    const path = join(dir, f);
    const text = readFileSync(path, "utf8");
    if (text.includes(OPEN)) { skipped++; continue; }
    // Locate opening backtick of the default-export template literal.
    const tickIdx = text.indexOf("`");
    if (tickIdx === -1) { skipped++; continue; }
    // Inject the marker block immediately after the first backtick, on its own
    // lines, preserving the rest of the body.
    const block = `\n${OPEN}\n${COPY[lang]}\n${CLOSE}\n`;
    const next = text.slice(0, tickIdx + 1) + block + text.slice(tickIdx + 1);
    writeFileSync(path, next);
    injected++;
    touched.push(`${lang}/${f}`);
  }
}

console.log(`blog-fix-missing-calc-cta: injected ${injected}, skipped ${skipped}`);
if (touched.length) {
  console.log("Files touched:");
  for (const t of touched) console.log("  - " + t);
}
