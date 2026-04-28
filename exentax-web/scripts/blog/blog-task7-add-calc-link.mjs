#!/usr/bin/env node
/**
 * blog-task7-add-calc-link.mjs (LOTE 6 — Conversión de artículos)
 * ----------------------------------------------------------------------------
 * Closes the 666 `[no-conversion-entry]` warnings reported by
 * `blog-cta-validate.mjs` by inserting a single, contextual sentence with
 * a `/<lang>#calculadora` anchor immediately BEFORE the existing
 * `<!-- exentax:calc-cta-v1 -->` mid-article block.
 *
 * The added line is editorial-natural ("put numbers on your case →
 * calculator"), idiomatic per locale, and links to the localised home
 * calculator hash that already exists in the runtime — i.e. the same
 * destination already used by the only article that previously satisfied
 * the warning (`crs-2-0-carf-por-que-usa-no-firmara-llc`).
 *
 * Skips files that already contain a `/<lang>#calculadora` or
 * `/<lang>/contacto` anchor (idempotent: re-running is a no-op).
 *
 * Skips files that lack a `<!-- exentax:calc-cta-v1 -->` block (none
 * today, but defensive).
 *
 * Wired by hand (no npm script): the insertion is a one-shot editorial
 * pass, not a recurring CI gate. The runtime guard is the existing
 * `blog-cta-validate.mjs` warning, which now goes from 666 to 0.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// Locale-native lead-in for the calculator anchor. Each line carries a
// numeric data point in the lead so it also helps the editorial "first
// paragraph hook should mention a number" heuristic when the article
// happens to lack one — but the line is placed mid-article, so it's a
// best-effort secondary win, not the main goal.
const CALC_LINE = {
  es: 'Antes de seguir, pon números a tu caso: la <a href="/es#calculadora">calculadora Exentax</a> compara, en menos de 2 minutos, tu carga fiscal actual con la que tendrías operando una LLC declarada en tu país de residencia.',
  en: 'Before going further, put numbers on your case: the <a href="/en#calculadora">Exentax calculator</a> compares, in under 2 minutes, your current tax bill with what you would carry running a US LLC properly declared in your country of residence.',
  fr: "Avant d'aller plus loin, mettez des chiffres sur votre cas : la <a href=\"/fr#calculadora\">calculatrice Exentax</a> compare, en moins de 2 minutes, votre charge fiscale actuelle avec celle d'une LLC américaine correctement déclarée dans votre pays de résidence.",
  de: 'Bevor Sie weiterlesen, bringen Sie Zahlen in Ihren Fall: Der <a href="/de#calculadora">Exentax-Rechner</a> vergleicht in unter 2 Minuten Ihre aktuelle Steuerlast mit der, die Sie mit einer im Wohnsitzland korrekt deklarierten US-LLC tragen würden.',
  pt: 'Antes de avançar, põe números ao teu caso: a <a href="/pt#calculadora">calculadora Exentax</a> compara, em menos de 2 minutos, a tua carga fiscal atual com a que terias com uma LLC americana corretamente declarada no teu país de residência.',
  ca: "Abans de continuar, posa números al teu cas: la <a href=\"/ca#calculadora\">calculadora Exentax</a> compara, en menys de 2 minuts, la teva càrrega fiscal actual amb la que tindries operant una LLC nord-americana ben declarada al teu país de residència.",
};

const MID_CTA_OPEN = "<!-- exentax:calc-cta-v1 -->";

function rel(p) { return path.relative(ROOT, p); }

function processFile(lang, slug, file) {
  const src = fs.readFileSync(file, "utf8");

  // Already has a /lang/contacto anchor or a /lang#calculadora anchor.
  const calcRx = new RegExp(`href=\"/${lang}#calculadora\"`);
  const contactRx = new RegExp(`href=\"/${lang}/contacto\"`);
  if (calcRx.test(src) || contactRx.test(src)) {
    return { status: "skip-already" };
  }

  const idx = src.indexOf(MID_CTA_OPEN);
  if (idx === -1) {
    return { status: "skip-no-mid" };
  }

  // Insert the calc lead-in line as a standalone paragraph immediately
  // before the mid-CTA marker. We rewind to the start of the line that
  // contains MID_CTA_OPEN and inject "<line>\n\n" there.
  let lineStart = src.lastIndexOf("\n", idx - 1);
  if (lineStart === -1) lineStart = 0; else lineStart += 1;

  const line = CALC_LINE[lang];
  const insertion = `${line}\n\n`;

  const next = src.slice(0, lineStart) + insertion + src.slice(lineStart);
  if (next === src) return { status: "noop" };

  fs.writeFileSync(file, next);
  return { status: "patched" };
}

function main() {
  const tally = { patched: 0, "skip-already": 0, "skip-no-mid": 0, noop: 0 };
  const perLang = {};
  for (const lang of LANGS) perLang[lang] = { ...tally };

  for (const lang of LANGS) {
    const dir = path.join(CONTENT, lang);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));
    for (const f of files) {
      const slug = f.replace(/\.ts$/, "");
      const r = processFile(lang, slug, path.join(dir, f));
      tally[r.status] += 1;
      perLang[lang][r.status] += 1;
    }
  }

  console.log("blog-task7-add-calc-link ──");
  for (const lang of LANGS) {
    console.log(`  ${lang}: patched=${perLang[lang].patched} already=${perLang[lang]["skip-already"]} no-mid=${perLang[lang]["skip-no-mid"]}`);
  }
  console.log(`\nTOTAL patched=${tally.patched} already=${tally["skip-already"]} no-mid=${tally["skip-no-mid"]}`);
}

main();
