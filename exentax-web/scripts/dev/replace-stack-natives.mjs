#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dirname, "..", "..");
const BASE = join(REPO, "client/src/data/blog-content");

const LANGS = ["de", "fr", "pt", "ca"];

function protect(str, patterns) {
  const slots = [];
  let s = str;
  for (const re of patterns) {
    s = s.replace(re, (m) => {
      const idx = slots.length;
      slots.push(m);
      return `\u0001PROTECTED${idx}\u0001`;
    });
  }
  return { s, slots };
}
function unprotect(s, slots) {
  return s.replace(/\u0001PROTECTED(\d+)\u0001/g, (_, i) => slots[Number(i)]);
}

const PROTECT_PATTERNS = [
  /<!--[\s\S]*?-->/g,
  /href="[^"]*"/g,
  /\([^)\s]*\/blog\/[^)\s]*\)/g,
  /\bSubstack\b/g,
];

const RULES = {
  de: [
    [/\bKaskaden-Banking-Stacks?\b/g, (m) => m.endsWith("s") ? "Kaskaden-Banking-Architekturen" : "Kaskaden-Banking-Architektur"],
    [/\bLLC-Banking-Stacks?\b/g, (m) => m.endsWith("s") ? "LLC-Banking-Architekturen" : "LLC-Banking-Architektur"],
    [/\bBanking-Stacks\b/g, "Banking-Architekturen"],
    [/\bBanking-Stack\b/g, "Banking-Architektur"],
    [/\bBanken-Stacks\b/g, "Banken-Architekturen"],
    [/\bBanken-Stack\b/g, "Banken-Architektur"],
    [/\bBank-Stacks\b/g, "Bank-Architekturen"],
    [/\bBank-Stack\b/g, "Bank-Architektur"],
    [/\bBankstacks\b/g, "Bankarchitekturen"],
    [/\bBankstack\b/g, "Bankarchitektur"],
    [/\bLLC-Stacks\b/g, "LLC-Architekturen"],
    [/\bLLC-Stack\b/g, "LLC-Architektur"],
    [/\bSaaS-LLC-Stack\b/g, "SaaS-LLC-Architektur"],
    [/\bKaskaden-Stack\b/g, "Kaskaden-Architektur"],
    [/\bWise-Business-Stacks\b/g, "Wise-Business-Konfigurationen"],
    [/-Wise-Stack\b/g, "-Wise-Konfiguration"],
    [/\bWise-Stack\b/g, "Wise-Konfiguration"],
    [/\bUS-Stack\b/g, "US-Konfiguration"],
    [/\bTech-Stack\b/g, "Tech-Architektur"],
    [/\bReporting-Stacks\b/g, "Reporting-Architekturen"],
    [/\bPflichtenstacks\b/g, "Pflichtenkataloge"],
    [/\bPflichtenstack\b/g, "Pflichtenkatalog"],
    [/\bFinanz-Stacks\b/g, "Finanz-Architekturen"],
    [/\bFinanz-Stack\b/g, "Finanz-Architektur"],
    [/\bZahlungsstacks\b/g, "Zahlungsarchitekturen"],
    [/\bZahlungsstack\b/g, "Zahlungsarchitektur"],
    [/\bStack-Modell\b/g, "Architektur-Modell"],
    [/\bStack-Design\b/g, "Architektur-Design"],
    [/\bStacks\b/g, "Architekturen"],
    [/\bStack\b/g, "Architektur"],
    [/\bstacks\b/g, "Architekturen"],
    [/\bstack\b/g, "Architektur"],
  ],
  fr: [
    // Compound + adjective phrases first
    [/\bstack technologique\b/g, "configuration technologique"],
    [/\bStack technologique\b/g, "Configuration technologique"],
    [/\bstack financière\b/g, "configuration financière"],
    [/\bstack financier\b/g, "configuration financière"],
    [/\bStack financière\b/g, "Configuration financière"],
    [/\bStack financier\b/g, "Configuration financière"],
    [/\bstack opérationnelle\b/g, "configuration opérationnelle"],
    [/\bstack opérationnel\b/g, "configuration opérationnelle"],
    [/\bStack opérationnelle\b/g, "Configuration opérationnelle"],
    [/\bStack opérationnel\b/g, "Configuration opérationnelle"],
    [/\bstacks bancaires\b/g, "configurations bancaires"],
    [/\bStacks bancaires\b/g, "Configurations bancaires"],
    [/\bstack bancaire\b/g, "configuration bancaire"],
    [/\bStack bancaire\b/g, "Configuration bancaire"],
    // Articles + adjectives that change with feminine "configuration"
    [/\ble \*\*stack\*\* approprié\b/g, "la **configuration** appropriée"],
    [/\ble stack approprié\b/g, "la configuration appropriée"],
    [/\ble stack adéquat\b/g, "la configuration adéquate"],
    [/\ble stack adapté\b/g, "la configuration adaptée"],
    [/\ble stack actuel\b/g, "la configuration actuelle"],
    [/\bvotre stack actuel\b/g, "votre configuration actuelle"],
    [/\bun stack US primaire\b/g, "une configuration US primaire"],
    [/\bun stack cohérent\b/g, "une configuration cohérente"],
    [/\bun stack\b/g, "une configuration"],
    [/\bce stack\b/g, "cette configuration"],
    [/\bdu stack\b/g, "de la configuration"],
    [/\bau stack\b/g, "à la configuration"],
    [/\ble stack\b/g, "la configuration"],
    [/\bLe stack\b/g, "La configuration"],
    [/\bla stack\b/g, "la configuration"],
    [/\bLa stack\b/g, "La configuration"],
    [/\bune stack\b/g, "une configuration"],
    [/\bUne stack\b/g, "Une configuration"],
    [/\bvotre stack\b/g, "votre configuration"],
    [/\bVotre stack\b/g, "Votre configuration"],
    [/\bnotre stack\b/g, "notre configuration"],
    [/\bNotre stack\b/g, "Notre configuration"],
    [/\bstacks\b/g, "configurations"],
    [/\bStacks\b/g, "Configurations"],
    [/\bstack\b/g, "configuration"],
    [/\bStack\b/g, "Configuration"],
  ],
  pt: [
    [/\bstack tecnológico\b/g, "arquitetura tecnológica"],
    [/\bStack tecnológico\b/g, "Arquitetura tecnológica"],
    [/\bstack digital\b/g, "arquitetura digital"],
    [/\bStack digital\b/g, "Arquitetura digital"],
    [/\bstack financeira\b/g, "arquitetura financeira"],
    [/\bstack financeiro\b/g, "arquitetura financeira"],
    [/\bStack financeira\b/g, "Arquitetura financeira"],
    [/\bStack financeiro\b/g, "Arquitetura financeira"],
    [/\bstacks bancários\b/g, "arquiteturas bancárias"],
    [/\bstacks bancárias\b/g, "arquiteturas bancárias"],
    [/\bStacks bancários\b/g, "Arquiteturas bancárias"],
    [/\bStacks bancárias\b/g, "Arquiteturas bancárias"],
    [/\bstack bancário\b/g, "arquitetura bancária"],
    [/\bstack bancária\b/g, "arquitetura bancária"],
    [/\bStack bancário\b/g, "Arquitetura bancária"],
    [/\bStack bancária\b/g, "Arquitetura bancária"],
    [/\bo \*\*stack\*\* correto\b/g, "a **arquitetura** correta"],
    [/\bo stack correto\b/g, "a arquitetura correta"],
    [/\bo stack adequado\b/g, "a arquitetura adequada"],
    [/\bo stack completo\b/g, "a arquitetura completa"],
    [/\bo stack atual\b/g, "a arquitetura atual"],
    [/\bo stack antigo\b/g, "a arquitetura antiga"],
    [/\bo stack típico\b/g, "a arquitetura típica"],
    [/\bo stack alinhado\b/g, "a arquitetura alinhada"],
    [/\bo stack\b/g, "a arquitetura"],
    [/\bO stack\b/g, "A arquitetura"],
    [/\ba stack\b/g, "a arquitetura"],
    [/\bA stack\b/g, "A arquitetura"],
    [/\beste stack\b/g, "esta arquitetura"],
    [/\bEste stack\b/g, "Esta arquitetura"],
    [/\bdeste stack\b/g, "desta arquitetura"],
    [/\bnum stack\b/g, "numa arquitetura"],
    [/\bdo stack\b/g, "da arquitetura"],
    [/\bao stack\b/g, "à arquitetura"],
    [/\bno stack\b/g, "na arquitetura"],
    [/\bum stack\b/g, "uma arquitetura"],
    [/\bUm stack\b/g, "Uma arquitetura"],
    [/\bseu stack\b/g, "sua arquitetura"],
    [/\bnosso stack\b/g, "nossa arquitetura"],
    [/\bque stack\b/g, "que arquitetura"],
    [/\bstacks\b/g, "arquiteturas"],
    [/\bStacks\b/g, "Arquiteturas"],
    [/\bstack\b/g, "arquitetura"],
    [/\bStack\b/g, "Arquitetura"],
  ],
  ca: [
    [/\bstack tecnològic\b/g, "arquitectura tecnològica"],
    [/\bStack tecnològic\b/g, "Arquitectura tecnològica"],
    [/\bstack digital\b/g, "arquitectura digital"],
    [/\bStack digital\b/g, "Arquitectura digital"],
    [/\bstack financera\b/g, "arquitectura financera"],
    [/\bstack financer\b/g, "arquitectura financera"],
    [/\bStack financera\b/g, "Arquitectura financera"],
    [/\bStack financer\b/g, "Arquitectura financera"],
    [/\bstacks bancaris\b/g, "arquitectures bancàries"],
    [/\bstacks bancàries\b/g, "arquitectures bancàries"],
    [/\bStacks bancaris\b/g, "Arquitectures bancàries"],
    [/\bStacks bancàries\b/g, "Arquitectures bancàries"],
    [/\bstack bancari\b/g, "arquitectura bancària"],
    [/\bstack bancària\b/g, "arquitectura bancària"],
    [/\bStack bancari\b/g, "Arquitectura bancària"],
    [/\bStack bancària\b/g, "Arquitectura bancària"],
    [/\bel \*\*stack\*\* correcte\b/g, "l'**arquitectura** correcta"],
    [/\bel stack correcte\b/g, "l'arquitectura correcta"],
    [/\bel stack adequat\b/g, "l'arquitectura adequada"],
    [/\bel stack complet\b/g, "l'arquitectura completa"],
    [/\bl'stack\b/g, "l'arquitectura"],
    [/\bL'stack\b/g, "L'arquitectura"],
    [/\bel stack\b/g, "l'arquitectura"],
    [/\bEl stack\b/g, "L'arquitectura"],
    [/\bla stack\b/g, "l'arquitectura"],
    [/\bLa stack\b/g, "L'arquitectura"],
    [/\baquest stack\b/g, "aquesta arquitectura"],
    [/\bAquest stack\b/g, "Aquesta arquitectura"],
    [/\bdel stack\b/g, "de l'arquitectura"],
    [/\bal stack\b/g, "a l'arquitectura"],
    [/\bun stack\b/g, "una arquitectura"],
    [/\bUn stack\b/g, "Una arquitectura"],
    [/\bteu stack\b/g, "teva arquitectura"],
    [/\bel teu stack\b/g, "la teva arquitectura"],
    [/\bvostre stack\b/g, "vostra arquitectura"],
    [/\bnostre stack\b/g, "nostra arquitectura"],
    [/\bquina stack\b/g, "quina arquitectura"],
    [/\bstacks\b/g, "arquitectures"],
    [/\bStacks\b/g, "Arquitectures"],
    [/\bstack\b/g, "arquitectura"],
    [/\bStack\b/g, "Arquitectura"],
  ],
};

function processFile(filePath, lang) {
  const original = readFileSync(filePath, "utf8");
  const { s, slots } = protect(original, PROTECT_PATTERNS);
  let out = s;
  for (const [re, repl] of RULES[lang]) {
    out = out.replace(re, repl);
  }
  const final = unprotect(out, slots);
  if (final !== original) {
    writeFileSync(filePath, final);
    return true;
  }
  return false;
}

let totalChanged = 0;
for (const lang of LANGS) {
  const dir = join(BASE, lang);
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".ts")) continue;
    const fp = join(dir, name);
    if (!statSync(fp).isFile()) continue;
    if (processFile(fp, lang)) {
      totalChanged++;
      console.log(`changed: ${lang}/${name}`);
    }
  }
}
console.log(`\nTotal files changed: ${totalChanged}`);
