#!/usr/bin/env node
// Final pass: fix accented-word boundaries (\b doesn't follow é/à/...) and a few
// remaining surgical issues across DE/FR/PT/CA blog files.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..");
const BASE = join(REPO, "client/src/data/blog-content");

function processDir(lang, fixFn) {
  const dir = join(BASE, lang);
  let n = 0;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".ts")) continue;
    const fp = join(dir, name);
    if (!statSync(fp).isFile()) continue;
    const orig = readFileSync(fp, "utf8");
    const fixed = fixFn(orig);
    if (fixed !== orig) {
      writeFileSync(fp, fixed);
      n++;
    }
  }
  console.log(`${lang}: ${n} files changed`);
}

// ============= DE =============
function deFix(s) {
  let out = s;
  // 1) "im Architektur" / "Im Architektur" (no compound prefix) → "in der Architektur"
  out = out.replace(/\bim\s+(Architektur)(?!\w)/g, "in der $1");
  out = out.replace(/\bIm\s+(Architektur)(?!\w)/g, "In der $1");
  // 2) "im neuen/alten/aktuellen Architektur" → "in der ... Architektur"
  out = out.replace(/\bim\s+(neuen|alten|aktuellen|kompletten|gesamten)\s+([\w-]*Architektur)\b/g, "in der $1 $2");
  out = out.replace(/\bIm\s+(neuen|alten|aktuellen|kompletten|gesamten)\s+([\w-]*Architektur)\b/g, "In der $1 $2");
  // 3) "im <CompoundCapital>-Architektur" → "in der <Compound>-Architektur"
  out = out.replace(/\bim\s+([A-ZÄÖÜ][\wäöüÄÖÜß]*-Architektur(?:en)?)\b/g, "in der $1");
  out = out.replace(/\bIm\s+([A-ZÄÖÜ][\wäöüÄÖÜß]*-Architektur(?:en)?)\b/g, "In der $1");
  // 4) "in Ihrem/seinem/meinem/unserem/eurem/deinem/ihrem <X-Architektur or Architektur>" → fem dat "Ihrer/seiner/..."
  const possMap = {
    Ihrem: "Ihrer", ihrem: "ihrer",
    seinem: "seiner", Seinem: "Seiner",
    meinem: "meiner", Meinem: "Meiner",
    unserem: "unserer", Unserem: "Unserer",
    eurem: "eurer", Eurem: "Eurer",
    deinem: "deiner", Deinem: "Deiner",
  };
  for (const [m_, f_] of Object.entries(possMap)) {
    const re = new RegExp(`\\bin\\s+${m_}\\s+([\\w-]*[Aa]rchitektur(?:en)?)\\b`, "g");
    out = out.replace(re, `in ${f_} $1`);
  }
  // 5) "in Ihren <X-Architektur>" (acc fem) → "in Ihre <X-Architektur>"
  const possAccMap = {
    Ihren: "Ihre", ihren: "ihre",
    seinen: "seine", Seinen: "Seine",
    meinen: "meine", Meinen: "Meine",
    unseren: "unsere", Unseren: "Unsere",
    euren: "eure", Euren: "Eure",
    deinen: "deine", Deinen: "Deine",
  };
  for (const [m_, f_] of Object.entries(possAccMap)) {
    const re = new RegExp(`\\bin\\s+${m_}\\s+([\\w-]*[Aa]rchitektur(?:en)?)\\b`, "g");
    out = out.replace(re, `in ${f_} $1`);
  }

  // 6) Genitive double-die regression: "<die fem-noun> die Architektur" → "<die fem-noun> der Architektur"
  //    The second "die" before "Architektur" should be genitive "der".
  //    Specific: "die heimische Seite die Architektur" — fix this and similar patterns where
  //    the second "die" is preceded by a feminine genitive-position noun.
  out = out.replace(/\b(Seite|Hälfte|Basis|Grundlage|Konfiguration|Struktur|Kontrolle|Logik|Schicht|Funktion|Rolle|Komplexität|Stabilität|Verwaltung|Übersicht)\s+die\s+([\w-]*[Aa]rchitektur(?:en)?)\b/g, "$1 der $2");

  // 7) "ihren Bank-Architektur" (acc fem) → "ihre Bank-Architektur"
  out = out.replace(/\bihren\s+([\w-]*[Aa]rchitektur)\b/g, "ihre $1");
  out = out.replace(/\bIhren\s+([\w-]*[Aa]rchitektur)\b/g, "Ihre $1");
  out = out.replace(/\bseinen\s+([\w-]*[Aa]rchitektur)\b/g, "seine $1");
  out = out.replace(/\bunseren\s+([\w-]*[Aa]rchitektur)\b/g, "unsere $1");
  out = out.replace(/\bmeinen\s+([\w-]*[Aa]rchitektur)\b/g, "meine $1");
  out = out.replace(/\bdeinen\s+([\w-]*[Aa]rchitektur)\b/g, "deine $1");
  out = out.replace(/\beuren\s+([\w-]*[Aa]rchitektur)\b/g, "eure $1");

  return out;
}

// ============= FR =============
// Replace `\b<adj>` with proper boundary that handles accented endings.
// Use a custom non-word lookahead instead of `\b` after accented letters.
function frFix(s) {
  let out = s;
  const FR_ADJ = [
    ["approprié", "appropriée"], ["adéquat", "adéquate"], ["adapté", "adaptée"],
    ["actuel", "actuelle"], ["correct", "correcte"], ["complet", "complète"],
    ["cohérent", "cohérente"], ["équilibré", "équilibrée"], ["optimal", "optimale"],
    ["mauvais", "mauvaise"], ["recommandé", "recommandée"], ["dédié", "dédiée"],
    ["packagé", "packagée"], ["intégral", "intégrale"], ["plein", "pleine"],
    ["entier", "entière"], ["nouveau", "nouvelle"], ["ancien", "ancienne"],
    ["minimal", "minimale"], ["maximal", "maximale"], ["typique", "typique"],
  ];
  // Accent-aware boundary: not followed by a French word char.
  const FR_WORD = "[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ]";
  for (const [m_, f_] of FR_ADJ) {
    const re = new RegExp(
      `(configuration|Configuration)((?:\\s+(?!est(?!${FR_WORD})|sera(?!${FR_WORD})|était(?!${FR_WORD}))${FR_WORD}+){0,3})\\s+${m_}(?!${FR_WORD})`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  // Also handle "**configuration** <adj>" with bold
  for (const [m_, f_] of FR_ADJ) {
    const re = new RegExp(
      `(\\*\\*configuration\\*\\*|\\*\\*Configuration\\*\\*)((?:\\s+(?!est(?!${FR_WORD}))${FR_WORD}+){0,3})\\s+${m_}(?!${FR_WORD})`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  return out;
}

// ============= PT =============
function ptFix(s) {
  let out = s;
  const PT_ADJ = [
    ["correto", "correta"], ["adequado", "adequada"], ["completo", "completa"],
    ["antigo", "antiga"], ["típico", "típica"], ["alinhado", "alinhada"],
    ["equilibrado", "equilibrada"], ["mínimo", "mínima"], ["máximo", "máxima"],
    ["bancário", "bancária"], ["recomendado", "recomendada"],
    ["dimensionado", "dimensionada"], ["bom", "boa"], ["mau", "má"],
    ["novo", "nova"], ["pequeno", "pequena"],
  ];
  const PT_WORD = "[a-zA-ZàâãáéêíóôõúüçÀÂÃÁÉÊÍÓÔÕÚÜÇ]";
  for (const [m_, f_] of PT_ADJ) {
    const re = new RegExp(
      `(arquitetura|Arquitetura)((?:\\s+(?!é(?!${PT_WORD})|está(?!${PT_WORD})|era(?!${PT_WORD})|foi(?!${PT_WORD}))${PT_WORD}+){0,3})\\s+${m_}(?!${PT_WORD})`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  return out;
}

// ============= CA =============
function caFix(s) {
  let out = s;
  const CA_ADJ = [
    ["correcte", "correcta"], ["adequat", "adequada"], ["complet", "completa"],
    ["mínim", "mínima"], ["màxim", "màxima"], ["antic", "antiga"],
    ["típic", "típica"], ["equilibrat", "equilibrada"], ["alineat", "alineada"],
    ["bancari", "bancària"], ["recomanat", "recomanada"],
    ["dimensionat", "dimensionada"], ["bo", "bona"], ["dolent", "dolenta"],
    ["nou", "nova"],
  ];
  const CA_WORD = "[a-zA-ZàèéíïòóúüçÀÈÉÍÏÒÓÚÜÇ·]";
  for (const [m_, f_] of CA_ADJ) {
    const re = new RegExp(
      `(arquitectura|Arquitectura|l'arquitectura|L'arquitectura)((?:\\s+(?!és(?!${CA_WORD})|està(?!${CA_WORD}))${CA_WORD}+){0,3})\\s+${m_}(?!${CA_WORD})`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  return out;
}

processDir("de", deFix);
processDir("fr", frFix);
processDir("pt", ptFix);
processDir("ca", caFix);
