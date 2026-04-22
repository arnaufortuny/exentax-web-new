#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../client/src/i18n/locales");

const COPY = {
  homePage: {
    es: "Tu LLC en EE.UU. en 48 h, sin sorpresas",
    en: "Your US LLC in 48 hours, no surprises",
    fr: "Votre LLC américaine en 48 h, sans surprise",
    de: "Ihre US-LLC in 48 Stunden – garantiert",
    pt: "A sua LLC nos EUA em 48 h, sem surpresas",
    ca: "La teva LLC als EUA en 48 h, sense sorpreses",
  },
  serviciosPage: {
    es: "Constituye tu LLC en EE.UU. con asesores expertos",
    en: "Form your US LLC with expert tax advisors",
    fr: "Créez votre LLC américaine avec fiscalistes experts",
    de: "Gründen Sie Ihre US-LLC mit Steuerexperten",
    pt: "Constitua a sua LLC nos EUA com consultores experts",
    ca: "Constitueix la teva LLC als EUA amb experts",
  },
  reservarPage: {
    es: "Asesoría LLC EE.UU. gratis · 30 min con expertos",
    en: "Free 30-min US LLC strategy call with experts",
    fr: "Consultation LLC USA gratuite · 30 min d'experts",
    de: "30 Min. kostenlose US-LLC-Beratung mit Experten",
    pt: "Consultoria LLC EUA grátis · 30 min com experts",
    ca: "Consultoria LLC EUA gratis · 30 min amb experts",
  },
  faqPage: {
    es: "79 respuestas claras sobre LLC en EE.UU.",
    en: "79 clear answers about US LLCs",
    fr: "79 réponses claires sur les LLC américaines",
    de: "79 klare Antworten zur US-LLC",
    pt: "79 respostas claras sobre LLC nos EUA",
    ca: "79 respostes clares sobre LLC als EUA",
  },
};

const LLC_OG = {
  ogTitle: {
    es: "LLC en EE.UU.: la guía 2026 para no residentes",
    en: "US LLC for non-residents: the 2026 guide",
    fr: "LLC américaine : le guide 2026 pour non-résidents",
    de: "US-LLC für Nicht-Residenten: der Leitfaden 2026",
    pt: "LLC nos EUA: o guia 2026 para não residentes",
    ca: "LLC als EUA: la guia 2026 per a no residents",
  },
  ogDesc: {
    es: "Qué es una LLC, cómo tributa y por qué es la mejor estructura para freelancers y negocios digitales internacionales. Explicado por asesores fiscales.",
    en: "What a US LLC is, how it's taxed and why it's the best structure for international freelancers and digital businesses. Explained by expert advisors.",
    fr: "Ce qu'est une LLC américaine, sa fiscalité et pourquoi c'est la meilleure structure pour freelances et entreprises digitales internationales aujourd'hui.",
    de: "Was eine US-LLC ist, wie sie besteuert wird und warum sie die beste Struktur für internationale Freelancer und digitale Unternehmen ist. Von Experten.",
    pt: "O que é uma LLC, como tributa e porque é a melhor estrutura para freelancers e negócios digitais internacionais. Por consultores especialistas.",
    ca: "Què és una LLC, com tributa i per què és la millor estructura per a freelancers i negocis digitals internacionals avui. Per assessors experts.",
  },
};

// Insertion patterns for camelCase namespaces using seoDesc/ogDesc style:
//   homePage, serviciosPage, reservarPage, faqPage, llcUsPage, comoFuncionaPage
// For each, we insert ogTitle right after seoTitle line (above ogDesc/seoDesc).

function insertAfterLine(content, anchorRegex, lineToInsert) {
  const m = content.match(anchorRegex);
  if (!m) return { content, ok: false };
  const idx = content.indexOf(m[0]);
  const endIdx = idx + m[0].length;
  // Find end of line
  const newlineIdx = content.indexOf("\n", endIdx);
  if (newlineIdx === -1) return { content, ok: false };
  const before = content.slice(0, newlineIdx + 1);
  const after = content.slice(newlineIdx + 1);
  // Detect indent of anchor line
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const indentMatch = content.slice(lineStart, idx).match(/^\s*/);
  const indent = indentMatch ? indentMatch[0] : " ";
  return { content: before + indent + lineToInsert + "\n" + after, ok: true };
}

// Already has ogTitle? Skip.
function hasKeyInBlock(content, blockName, key) {
  const blockStart = content.indexOf(blockName + ":");
  if (blockStart === -1) return false;
  const blockEnd = content.indexOf("\n  },", blockStart);
  const slice = content.slice(blockStart, blockEnd === -1 ? blockStart + 5000 : blockEnd);
  return slice.includes(key + ":");
}

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

for (const lang of LANGS) {
  const file = resolve(ROOT, `${lang}.ts`);
  let content = readFileSync(file, "utf8");
  let modified = false;

  // homePage / serviciosPage / reservarPage / faqPage : insert ogTitle right after `<block>: {` line, before seoTitle
  for (const block of ["homePage", "serviciosPage", "reservarPage", "faqPage"]) {
    if (hasKeyInBlock(content, block, "ogTitle")) continue;
    const ogTitle = COPY[block][lang];
    // Insert after seoTitle line so ordering is: seoTitle, seoDesc, ogTitle, ogDesc
    const re = new RegExp(`(${block}: \\{[\\s\\S]*?seoDesc:\\s*"[^"]*",)`, "m");
    const m = content.match(re);
    if (!m) {
      console.warn(`[${lang}] anchor not found for ${block}`);
      continue;
    }
    const anchor = m[1];
    const indent = (anchor.match(/\n(\s*)seoDesc:/) || [, " "])[1];
    const ins = `${indent}ogTitle: ${JSON.stringify(ogTitle)},`;
    content = content.replace(anchor, anchor + "\n" + ins);
    modified = true;
  }

  // llcUsPage: add ogTitle and ogDesc (currently has only seoTitle/seoDesc)
  {
    const llcStart = content.indexOf("llcUsPage:");
    const llcSlice = llcStart === -1 ? "" : content.slice(llcStart, llcStart + 1500);
    const alreadyHas = llcSlice.includes("ogTitle:") && llcSlice.indexOf("ogTitle:") < llcSlice.indexOf("breadcrumb:");
    if (!alreadyHas) {
    const re = /(llcUsPage:\s*\{[\s\S]*?seoDesc:\s*"[^"]*",)/m;
    const m = content.match(re);
    if (m) {
      const anchor = m[1];
      const indent = (anchor.match(/\n(\s*)seoDesc:/) || [, " "])[1];
      const ins =
        `${indent}ogTitle: ${JSON.stringify(LLC_OG.ogTitle[lang])},\n` +
        `${indent}ogDesc: ${JSON.stringify(LLC_OG.ogDesc[lang])},`;
      content = content.replace(anchor, anchor + "\n" + ins);
      modified = true;
    }
    }
  }

  if (modified) {
    writeFileSync(file, content, "utf8");
    console.log(`Updated ${lang}.ts`);
  } else {
    console.log(`No changes for ${lang}.ts`);
  }
}
