#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../client/src/i18n/locales");

const LEGAL_TITLES = {
  terminos: {
    es: "Términos y condiciones de Exentax",
    en: "Exentax Terms and Conditions",
    fr: "Conditions générales d'Exentax",
    de: "AGB von Exentax",
    pt: "Termos e condições da Exentax",
    ca: "Termes i condicions d'Exentax",
  },
  privacidad: {
    es: "Política de privacidad · Exentax",
    en: "Privacy policy · Exentax",
    fr: "Politique de confidentialité · Exentax",
    de: "Datenschutzerklärung · Exentax",
    pt: "Política de privacidade · Exentax",
    ca: "Política de privacitat · Exentax",
  },
  cookies: {
    es: "Política de cookies · Exentax",
    en: "Cookie policy · Exentax",
    fr: "Politique de cookies · Exentax",
    de: "Cookie-Richtlinie · Exentax",
    pt: "Política de cookies · Exentax",
    ca: "Política de galetes · Exentax",
  },
  reembolsos: {
    es: "Política de reembolsos · Exentax",
    en: "Refund policy · Exentax",
    fr: "Politique de remboursement · Exentax",
    de: "Erstattungsrichtlinie · Exentax",
    pt: "Política de reembolso · Exentax",
    ca: "Política de reemborsament · Exentax",
  },
  disclaimer: {
    es: "Disclaimer legal y fiscal · Exentax",
    en: "Legal and tax disclaimer · Exentax",
    fr: "Avertissement juridique et fiscal · Exentax",
    de: "Rechts- und Steuerhaftungsausschluss · Exentax",
    pt: "Aviso legal e fiscal · Exentax",
    ca: "Avís legal i fiscal · Exentax",
  },
};

const START_OG = {
  es: "Diseña tu estructura fiscal internacional",
  en: "Design your international tax structure",
  fr: "Concevez votre structure fiscale internationale",
  de: "Gestalten Sie Ihre internationale Steuerstruktur",
  pt: "Desenhe a sua estrutura fiscal internacional",
  ca: "Dissenya la teva estructura fiscal internacional",
};

const LINKS_OG = {
  ogTitle: {
    es: "Todos los enlaces de Exentax en un solo sitio",
    en: "All Exentax links in one place",
    fr: "Tous les liens d'Exentax au même endroit",
    de: "Alle Exentax-Links auf einen Blick",
    pt: "Todos os links da Exentax num só sítio",
    ca: "Tots els enllaços d'Exentax en un sol lloc",
  },
  ogDescription: {
    es: "WhatsApp, asesoría estratégica, calculadora fiscal y redes sociales: todos los puntos de contacto de Exentax reunidos en un único enlace.",
    en: "WhatsApp, strategy calls, the tax calculator and social channels: every Exentax touchpoint gathered into one shareable link.",
    fr: "WhatsApp, consultation stratégique, calculateur fiscal et réseaux sociaux : tous les points de contact d'Exentax réunis en un seul lien.",
    de: "WhatsApp, strategische Beratung, Steuerrechner und Social Media: alle Kontaktpunkte von Exentax in einem teilbaren Link.",
    pt: "WhatsApp, consultoria estratégica, calculadora fiscal e redes sociais: todos os pontos de contacto da Exentax num único link.",
    ca: "WhatsApp, consulta estratègica, calculadora fiscal i xarxes socials: tots els punts de contacte d'Exentax en un únic enllaç.",
  },
};

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

function insertAfterMatch(content, regex, line) {
  const m = content.match(regex);
  if (!m) return { content, ok: false };
  const idx = content.indexOf(m[0]);
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const indent = content.slice(lineStart, idx).match(/^\s*/)[0];
  const insert = `\n${indent}${line}`;
  return { content: content.slice(0, idx + m[0].length) + insert + content.slice(idx + m[0].length), ok: true };
}

for (const lang of LANGS) {
  const file = resolve(ROOT, `${lang}.ts`);
  let content = readFileSync(file, "utf8");
  const original = content;

  // Legal blocks: each has seoTitle then seoDescription then ogDescription. Add ogTitle right after seoTitle, BEFORE seoDescription line.
  // We anchor on the unique seoTitle string, then insert ogTitle line right before seoDescription line.
  for (const key of Object.keys(LEGAL_TITLES)) {
    const ogTitle = LEGAL_TITLES[key][lang];
    // Look for legal.<key> block via the seoTitle followed by seoDescription within ~3 lines
    // Use the existing ogDescription line text as anchor (unique within the legal namespace)
    // Different style: locate the block's `ogDescription:` line that comes right AFTER the seoTitle for this key, and insert ogTitle BEFORE seoDescription.
    // Simpler: find first `ogDescription:` after this key's seoTitle that doesn't already have a preceding ogTitle.
    // We use a unique seoTitle per legal page (already different per language). To avoid hardcoding, we look for blocks: seoTitle:"...", seoDescription:"...", ogDescription
    // Instead, inject ogTitle:".." line right before each "ogDescription:" line in the legal namespace.
  }

  // Approach: for each occurrence of `ogDescription:` in the legal namespace (lines 1-800), insert ogTitle BEFORE it,
  // but we need 5 distinct titles assigned to 5 ordered legal blocks: terminos, privacidad, cookies, reembolsos, disclaimer.
  // Their order in the file is: terminos(line~26), privacidad(~92), cookies(~645), reembolsos(~681), disclaimer(~733).
  const orderedKeys = ["terminos", "privacidad", "cookies", "reembolsos", "disclaimer"];
  let cursor = 0;
  let blockIdx = 0;
  const lines = content.split("\n");
  const newLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Stop after legal namespace (~line 800)
    if (i < 1000 && /^\s+ogDescription:/.test(line) && blockIdx < orderedKeys.length) {
      // Check if line above already includes ogTitle
      const prev = newLines[newLines.length - 1] || "";
      if (!/ogTitle:/.test(prev)) {
        const indentMatch = line.match(/^(\s+)/);
        const indent = indentMatch ? indentMatch[1] : "      ";
        const key = orderedKeys[blockIdx];
        const title = LEGAL_TITLES[key][lang];
        newLines.push(`${indent}ogTitle: ${JSON.stringify(title)},`);
      }
      blockIdx++;
    }
    newLines.push(line);
  }
  content = newLines.join("\n");

  // start: insert ogTitle after seoTitle line in `start:` block
  {
    const startIdx = content.search(/\n\s+start:\s*\{/);
    if (startIdx !== -1) {
      const blockSlice = content.slice(startIdx, startIdx + 2000);
      if (!/ogTitle:/.test(blockSlice.split("\n").slice(0, 10).join("\n"))) {
        const re = /(start:\s*\{[\s\S]*?seoTitle:\s*"[^"]*",)/m;
        const m = content.match(re);
        if (m) {
          const anchor = m[1];
          const indent = (anchor.match(/\n(\s*)seoTitle:/) || [, "    "])[1];
          const ins = `${indent}ogTitle: ${JSON.stringify(START_OG[lang])},`;
          content = content.replace(anchor, anchor + "\n" + ins);
        }
      }
    }
  }

  // links: insert ogTitle and ogDescription after seoDescription line in `links:` block
  {
    const linksIdx = content.search(/\n\s+links:\s*\{/);
    if (linksIdx !== -1) {
      const blockSlice = content.slice(linksIdx, linksIdx + 2000);
      if (!/ogTitle:/.test(blockSlice.split("\n").slice(0, 10).join("\n"))) {
        const re = /(links:\s*\{[\s\S]*?seoDescription:\s*"[^"]*",)/m;
        const m = content.match(re);
        if (m) {
          const anchor = m[1];
          const indent = (anchor.match(/\n(\s*)seoDescription:/) || [, "    "])[1];
          const ins =
            `${indent}ogTitle: ${JSON.stringify(LINKS_OG.ogTitle[lang])},\n` +
            `${indent}ogDescription: ${JSON.stringify(LINKS_OG.ogDescription[lang])},`;
          content = content.replace(anchor, anchor + "\n" + ins);
        }
      }
    }
  }

  if (content !== original) {
    writeFileSync(file, content, "utf8");
    console.log(`Updated ${lang}.ts`);
  } else {
    console.log(`No changes for ${lang}.ts`);
  }
}
