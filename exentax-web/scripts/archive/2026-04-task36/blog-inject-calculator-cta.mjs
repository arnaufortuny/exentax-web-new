#!/usr/bin/env node
/*
 * blog-inject-calculator-cta.mjs
 * ----------------------------------------------------------------------------
 * Mirrors the ES master convention: every blog article has TWO CTAs — an
 * opening callout linking to the tax calculator + a closing CTA linking to
 * /{lang}/agendar (already injected by blog-inject-localized-cta.mjs).
 *
 * The translation pass (Task #3) preserved only the closing booking CTA. This
 * script restores the calculator callout in non-ES articles using a localized
 * blockquote wrapped in idempotent markers:
 *
 *   <!-- exentax:calc-cta-v1 -->
 *   > **{HOOK}** {LEAD} <a href="/{lang}/calculator">{ANCHOR}</a>{TAIL}
 *   <!-- /exentax:calc-cta-v1 -->
 *
 * Insertion point: after the first non-empty paragraph of body text.
 *
 * Idempotent — does nothing when the marker is already present, the file
 * already references the calculator route, or it is the ES master (which uses
 * /es/calculadora and the original Task #1 wording).
 *
 * Usage: node scripts/blog-inject-calculator-cta.mjs [--dry-run]
 * ----------------------------------------------------------------------------
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = resolve(ROOT, "client/src/data/blog-content");
const TARGET_LANGS = ["en", "fr", "de", "pt", "ca"];
const DRY = process.argv.includes("--dry-run");

const TEMPLATES = {
  en: {
    hook: "Put numbers on your case.",
    lead: "The",
    anchor: "Exentax tax calculator",
    tail: " compares your current tax burden with what you would pay running a US LLC properly declared in your country of residence.",
  },
  fr: {
    hook: "Mettez des chiffres sur votre cas.",
    lead: "Le",
    anchor: "calculateur fiscal Exentax",
    tail: " compare votre charge actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.",
  },
  de: {
    hook: "Konkretisieren Sie Ihren Fall mit Zahlen.",
    lead: "Der",
    anchor: "Exentax-Steuerrechner",
    tail: " vergleicht Ihre aktuelle Steuerlast mit der einer US-LLC, die in Ihrem Wohnsitzland korrekt deklariert ist.",
  },
  pt: {
    hook: "Coloque números no seu caso.",
    lead: "A",
    anchor: "calculadora fiscal da Exentax",
    tail: " compara a sua carga atual com a que teria a operar com uma LLC americana corretamente declarada no seu país de residência.",
  },
  ca: {
    hook: "Posa números al teu cas.",
    lead: "La",
    anchor: "calculadora fiscal d'Exentax",
    tail: " compara la teva càrrega actual amb la que tindries operant amb una LLC americana correctament declarada al teu país de residència.",
  },
};

const MARKER_OPEN = "<!-- exentax:calc-cta-v1 -->";
const MARKER_CLOSE = "<!-- /exentax:calc-cta-v1 -->";

function buildBlock(lang) {
  const t = TEMPLATES[lang];
  const url = `/${lang}/calculator`;
  return `${MARKER_OPEN}\n> **${t.hook}** ${t.lead} <a href="${url}">${t.anchor}</a>${t.tail}\n${MARKER_CLOSE}`;
}

function alreadyHasCalcCta(body, lang) {
  if (body.includes(MARKER_OPEN)) return true;
  // Recognize the existing calculator anchors used in the body
  const re = new RegExp(`href="/${lang}/(calculator|calculadora|calculatrice|rechner)"`);
  return re.test(body);
}

function injectInBody(body, lang) {
  // Find the end of the first non-empty paragraph (first blank line).
  // Body starts with the opening backtick stripped; we operate on the literal.
  const lines = body.split("\n");
  let firstParaEnd = -1;
  let inPara = false;
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (ln.trim() === "") {
      if (inPara) { firstParaEnd = i; break; }
    } else {
      inPara = true;
    }
  }
  if (firstParaEnd < 0) firstParaEnd = Math.min(2, lines.length);
  const block = buildBlock(lang);
  // Insert block followed by blank line
  lines.splice(firstParaEnd + 1, 0, block, "");
  return lines.join("\n");
}

let changed = 0;
let skipped = 0;
let touchedFiles = [];

for (const lang of TARGET_LANGS) {
  const dir = resolve(CONTENT_DIR, lang);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter(n => n.endsWith(".ts"))) {
    const path = resolve(dir, f);
    const raw = readFileSync(path, "utf8");
    const m = raw.match(/^(export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
    if (!m) { skipped++; continue; }
    const [, head, body, tail] = m;
    if (alreadyHasCalcCta(body, lang)) { skipped++; continue; }
    const newBody = injectInBody(body, lang);
    const newRaw = head + newBody + tail;
    if (!DRY) writeFileSync(path, newRaw);
    changed++;
    touchedFiles.push(`${lang}/${f}`);
  }
}

console.log(`blog-inject-calculator-cta: ${changed} files updated, ${skipped} skipped (${DRY ? "dry-run" : "applied"})`);
if (touchedFiles.length && touchedFiles.length <= 10) {
  for (const f of touchedFiles) console.log(`  + ${f}`);
}
