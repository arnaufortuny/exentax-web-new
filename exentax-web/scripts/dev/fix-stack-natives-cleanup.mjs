#!/usr/bin/env node
// Cleanup pass after replace-stack-natives.mjs:
// fixes gender / article / adjective agreement leftovers in DE/FR/PT/CA.
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
];

// Helper: build a list of compound roots that may follow article
const DE_ROOTS = [
  "LLC-Banking-Architektur", "Banking-Architektur", "Banken-Architektur",
  "Bank-Architektur", "LLC-Architektur", "SaaS-LLC-Architektur",
  "Kaskaden-Architektur", "Reporting-Architektur", "Finanz-Architektur",
  "Broker-Architektur", "Dokumenten-Architektur", "Architektur",
];

// ============ DE rules ============
const deRules = [];

// 1) Genitive plural-looking forms that must become singular feminine genitive
//    "des <root>en" -> "der <root>" ; "eines <root>en" -> "einer <root>"
for (const root of DE_ROOTS) {
  deRules.push([new RegExp(`\\bdes\\s+(${escapeRoot(root)})en\\b`, "g"), `der $1`]);
  deRules.push([new RegExp(`\\beines\\s+(${escapeRoot(root)})en\\b`, "g"), `einer $1`]);
  // Singular feminine accusative: "den/diesen <root>" -> "die/diese <root>"
  deRules.push([new RegExp(`\\bden\\s+(${escapeRoot(root)})\\b`, "g"), `die $1`]);
  deRules.push([new RegExp(`\\bDen\\s+(${escapeRoot(root)})\\b`, "g"), `Die $1`]);
  deRules.push([new RegExp(`\\bdiesen\\s+(${escapeRoot(root)})\\b`, "g"), `diese $1`]);
  deRules.push([new RegExp(`\\bDiesen\\s+(${escapeRoot(root)})\\b`, "g"), `Diese $1`]);
  // Dative: "dem <root>" -> "der <root>" ; "diesem <root>" -> "dieser <root>"
  deRules.push([new RegExp(`\\bdem\\s+(${escapeRoot(root)})\\b`, "g"), `der $1`]);
  deRules.push([new RegExp(`\\bDem\\s+(${escapeRoot(root)})\\b`, "g"), `Der $1`]);
  deRules.push([new RegExp(`\\bdiesem\\s+(${escapeRoot(root)})\\b`, "g"), `dieser $1`]);
  deRules.push([new RegExp(`\\bDiesem\\s+(${escapeRoot(root)})\\b`, "g"), `Dieser $1`]);
  // Indefinite acc/nom masc -> fem
  deRules.push([new RegExp(`\\beinen\\s+(${escapeRoot(root)})\\b`, "g"), `eine $1`]);
  deRules.push([new RegExp(`\\bEinen\\s+(${escapeRoot(root)})\\b`, "g"), `Eine $1`]);
  deRules.push([new RegExp(`\\beinem\\s+(${escapeRoot(root)})\\b`, "g"), `einer $1`]);
  deRules.push([new RegExp(`\\bEinem\\s+(${escapeRoot(root)})\\b`, "g"), `Einer $1`]);
  // "ein <root>" used as masc nom -> "eine <root>"
  deRules.push([new RegExp(`\\bein\\s+(${escapeRoot(root)})\\b`, "g"), `eine $1`]);
  deRules.push([new RegExp(`\\bEin\\s+(${escapeRoot(root)})\\b`, "g"), `Eine $1`]);
  deRules.push([new RegExp(`\\bwelchen\\s+(${escapeRoot(root)})\\b`, "g"), `welche $1`]);
  deRules.push([new RegExp(`\\bWelchen\\s+(${escapeRoot(root)})\\b`, "g"), `Welche $1`]);
}

// 2) "vom <root>" -> "von der <root>"
for (const root of DE_ROOTS) {
  deRules.push([new RegExp(`\\bvom\\s+(${escapeRoot(root)})\\b`, "g"), `von der $1`]);
  deRules.push([new RegExp(`\\bVom\\s+(${escapeRoot(root)})\\b`, "g"), `Von der $1`]);
  // "im aktuellen Architektur" -> "in der aktuellen Architektur"
  deRules.push([new RegExp(`\\bim\\s+aktuellen\\s+(${escapeRoot(root)})\\b`, "g"), `in der aktuellen $1`]);
  deRules.push([new RegExp(`\\bim\\s+kompletten\\s+(${escapeRoot(root)})\\b`, "g"), `in der kompletten $1`]);
}

// 3) Common "Der <ADJ?> <root>" at section heading / start-of-sentence.
//    These are nominative masc ("der Stack") -> need feminine "die".
//    We do narrow, specific patterns.
const deCapPhrases = [
  ["Der minimal überlebensfähige Architektur", "Die minimal überlebensfähige Architektur"],
  ["der minimale Architektur", "die minimale Architektur"],
  ["Der gesamte digitale Architektur", "Die gesamte digitale Architektur"],
  ["Der Übergang zwischen altem und neuem Architektur", "Der Übergang zwischen alter und neuer Architektur"],
  ["Der optimale Finanz-Architektur", "Die optimale Finanz-Architektur"],
  ["Der Architektur ist nur die Hardware", "Die Architektur ist nur die Hardware"],
  ["Der Architektur ist nur das Hardware", "Die Architektur ist nur die Hardware"],
  ["Der Banking-Architektur", "Die Banking-Architektur"],
  ["Der Banken-Architektur", "Die Banken-Architektur"],
  ["Der LLC-Banking-Architektur", "Die LLC-Banking-Architektur"],
  ["Der LLC-Architektur", "Die LLC-Architektur"],
  ["Der Dokumenten-Architektur", "Die Dokumenten-Architektur"],
  ["Der empfohlene Banking-Architektur", "Die empfohlene Banking-Architektur"],
  ["Der richtige Banking-Architektur", "Die richtige Banking-Architektur"],
  ["Der richtige Banken-Architektur", "Die richtige Banken-Architektur"],
  ["Der richtige Architektur", "Die richtige Architektur"],
  ["Ausgewogener Banking-Architektur", "Ausgewogene Banking-Architektur"],
  ["Ausgewogener Banken-Architektur", "Ausgewogene Banken-Architektur"],
  ["Kompletter Architektur typischer Fall", "Komplette Architektur, typischer Fall"],
  ["der komplette Banken-Architektur", "die komplette Banken-Architektur"],
  ["der komplette Banking-Architektur", "die komplette Banking-Architektur"],
  ["den kompletten Architektur", "die komplette Architektur"],
  ["den kompletten Banking-Architektur", "die komplette Banking-Architektur"],
  ["Der minimal überlebensfähige", "Die minimal überlebensfähige"],
  ["der vollständige Banking-Architektur", "die vollständige Banking-Architektur"],
];
for (const [a, b] of deCapPhrases) {
  deRules.push([new RegExp(escapeRe(a), "g"), b]);
}

// 4) "wie ein Architektur zu entwerfen ist, der den Alltag aushält"
deRules.push([/\bwie ein Architektur zu entwerfen ist, der\b/g, "wie eine Architektur zu entwerfen ist, die"]);
deRules.push([/\bein Architektur, der\b/g, "eine Architektur, die"]);
deRules.push([/\bein Banken-Architektur mit\b/g, "eine Banken-Architektur mit"]);
deRules.push([/\bein Banking-Architektur mit\b/g, "eine Banking-Architektur mit"]);

// 5) "in dem jedes Tool eine Rolle übernimmt" after "die richtige Architektur" must become "in der jedes Tool"
deRules.push([/\bdie richtige \*\*Architektur\*\*, in dem jedes Tool\b/g, "die richtige **Architektur**, in der jedes Tool"]);
deRules.push([/\bdie richtige Architektur, in dem jedes Tool\b/g, "die richtige Architektur, in der jedes Tool"]);

// 6) "den richtigen **Architektur**" -> "die richtige **Architektur**"
deRules.push([/\bden richtigen \*\*Architektur\*\*\b/g, "die richtige **Architektur**"]);

// 7) "Architektur falsch gebaut" wording is OK.
//    "Stack entscheidet" -> "Architektur entscheidet" -> nominative subject — needs article? It was "Stack entscheidet" without article (informal). Keep as "Architektur entscheidet" — fine.

// 8) Pflichtenstack — already handled.

// 9) Specific genitive: "des Architekturen" -> "der Architektur" already covered.

// ============ FR rules ============
const frRules = [];

const frArticleFlips = [
  // Definite articles
  ["le configuration", "la configuration"],
  ["Le configuration", "La configuration"],
  // Indefinite
  ["un configuration", "une configuration"],
  ["Un configuration", "Une configuration"],
  // Demonstrative
  ["ce configuration", "cette configuration"],
  ["Ce configuration", "Cette configuration"],
  // Contractions
  ["du configuration", "de la configuration"],
  ["au configuration", "à la configuration"],
];
for (const [a, b] of frArticleFlips) {
  frRules.push([new RegExp(`\\b${escapeRe(a)}\\b`, "g"), b]);
}

// Adjective agreement (masc → fem) following "configuration" or "configuration <noun>"
const frAdj = [
  ["approprié", "appropriée"],
  ["adéquat", "adéquate"],
  ["adapté", "adaptée"],
  ["actuel", "actuelle"],
  ["correct", "correcte"],
  ["incorrect", "incorrecte"],
  ["complet", "complète"],
  ["incomplet", "incomplète"],
  ["cohérent", "cohérente"],
  ["incohérent", "incohérente"],
  ["équilibré", "équilibrée"],
  ["déséquilibré", "déséquilibrée"],
  ["optimal", "optimale"],
  ["minimal", "minimale"],
  ["maximal", "maximale"],
  ["primaire", "primaire"], // unchanged (epicene)
  ["packagé", "packagée"],
  ["typique", "typique"],
  ["mauvais", "mauvaise"],
  ["bon", "bonne"],
  ["plein", "pleine"],
  ["entier", "entière"],
];

// Pattern: "**configuration**" or "configuration <bancaire/...>" followed by space + adj
// "configuration <attr>" e.g. "configuration appropriée"
// We do contextual replacement: only when "configuration" precedes (within ~30 chars) and adj refers to it.
// Easier: directly replace within these specific phrases that we know occurred.
const frPhraseFixes = [
  ["**configuration** approprié", "**configuration** appropriée"],
  ["**configuration** adéquat", "**configuration** adéquate"],
  ["**configuration** adapté", "**configuration** adaptée"],
  ["**configuration** actuel", "**configuration** actuelle"],
  ["**configuration** correct", "**configuration** correcte"],
  ["**configuration** complet", "**configuration** complète"],
  ["**configuration** cohérent", "**configuration** cohérente"],
  ["**configuration** équilibré", "**configuration** équilibrée"],
  ["**configuration** optimal", "**configuration** optimale"],
  ["**configuration** typique", "**configuration** typique"],
  ["**configuration** mauvais", "**configuration** mauvaise"],
  // Plain (no bold)
  ["configuration approprié,", "configuration appropriée,"],
  ["configuration approprié.", "configuration appropriée."],
  ["configuration approprié ", "configuration appropriée "],
  ["configuration adéquat,", "configuration adéquate,"],
  ["configuration adéquat.", "configuration adéquate."],
  ["configuration adéquat ", "configuration adéquate "],
  ["configuration actuel,", "configuration actuelle,"],
  ["configuration actuel.", "configuration actuelle."],
  ["configuration actuel ", "configuration actuelle "],
  ["configuration cohérent,", "configuration cohérente,"],
  ["configuration cohérent.", "configuration cohérente."],
  ["configuration cohérent ", "configuration cohérente "],
  ["configuration complet,", "configuration complète,"],
  ["configuration complet.", "configuration complète."],
  ["configuration complet ", "configuration complète "],
  ["configuration équilibré,", "configuration équilibrée,"],
  ["configuration équilibré.", "configuration équilibrée."],
  ["configuration équilibré:", "configuration équilibrée:"],
  ["configuration équilibré ", "configuration équilibrée "],
  ["configuration optimal,", "configuration optimale,"],
  ["configuration optimal.", "configuration optimale."],
  ["configuration optimal ", "configuration optimale "],
  ["configuration mauvais,", "configuration mauvaise,"],
  ["configuration mauvais.", "configuration mauvaise."],
  ["configuration mauvais ", "configuration mauvaise "],
  // "configuration bancaire <adj>"
  ["configuration bancaire complet", "configuration bancaire complète"],
  ["configuration bancaire équilibré", "configuration bancaire équilibrée"],
  ["configuration bancaire correct", "configuration bancaire correcte"],
  ["configuration bancaire approprié", "configuration bancaire appropriée"],
  ["configuration bancaire actuel", "configuration bancaire actuelle"],
  ["configuration bancaire mauvais", "configuration bancaire mauvaise"],
  // capitalized headings
  ["Configuration bancaire complet", "Configuration bancaire complète"],
  ["Configuration bancaire équilibré", "Configuration bancaire équilibrée"],
  ["Configuration complet", "Configuration complète"],
  ["Configuration équilibré", "Configuration équilibrée"],
  ["Configuration approprié", "Configuration appropriée"],
  ["Configuration cohérent", "Configuration cohérente"],
  ["Configuration adéquat", "Configuration adéquate"],
  // "votre configuration ... actuel" / "votre configuration actuel" etc handled above.
];
for (const [a, b] of frPhraseFixes) {
  frRules.push([new RegExp(escapeRe(a), "g"), b]);
}

// Fix "Pourquoi un configuration bancaire" / "Construire un configuration bancaire" -> "une"
frRules.push([/\bPourquoi un configuration\b/g, "Pourquoi une configuration"]);
frRules.push([/\bConstruire un configuration\b/g, "Construire une configuration"]);
frRules.push([/\bmonter un configuration\b/g, "monter une configuration"]);
frRules.push([/\bMonter un configuration\b/g, "Monter une configuration"]);
frRules.push([/\bconcevoir un configuration\b/g, "concevoir une configuration"]);
frRules.push([/\bConcevoir un configuration\b/g, "Concevoir une configuration"]);

// "le configuration" => already handled by frArticleFlips.

// ============ PT rules ============
const ptRules = [];

const ptArticleFlips = [
  ["o arquitetura", "a arquitetura"],
  ["O arquitetura", "A arquitetura"],
  ["um arquitetura", "uma arquitetura"],
  ["Um arquitetura", "Uma arquitetura"],
  ["este arquitetura", "esta arquitetura"],
  ["Este arquitetura", "Esta arquitetura"],
  ["esse arquitetura", "essa arquitetura"],
  ["aquele arquitetura", "aquela arquitetura"],
  ["deste arquitetura", "desta arquitetura"],
  ["desse arquitetura", "dessa arquitetura"],
  ["do arquitetura", "da arquitetura"],
  ["no arquitetura", "na arquitetura"],
  ["ao arquitetura", "à arquitetura"],
  ["pelo arquitetura", "pela arquitetura"],
  ["seu arquitetura", "sua arquitetura"],
  ["nosso arquitetura", "nossa arquitetura"],
  ["meu arquitetura", "minha arquitetura"],
  ["teu arquitetura", "tua arquitetura"],
];
for (const [a, b] of ptArticleFlips) {
  ptRules.push([new RegExp(`\\b${escapeRe(a)}\\b`, "g"), b]);
}

const ptPhraseFixes = [
  // "**arquitetura** correto" → "**arquitetura** correta"
  ["**arquitetura** correto", "**arquitetura** correta"],
  ["**arquitetura** adequado", "**arquitetura** adequada"],
  ["**arquitetura** completo", "**arquitetura** completa"],
  ["**arquitetura** atual", "**arquitetura** atual"],
  ["**arquitetura** antigo", "**arquitetura** antiga"],
  ["**arquitetura** típico", "**arquitetura** típica"],
  ["**arquitetura** alinhado", "**arquitetura** alinhada"],
  ["**arquitetura** equilibrado", "**arquitetura** equilibrada"],
  ["**arquitetura** mínimo", "**arquitetura** mínima"],
  // "arquitetura bancária <adj-masc>"
  ["arquitetura bancária equilibrado", "arquitetura bancária equilibrada"],
  ["arquitetura bancária completo", "arquitetura bancária completa"],
  ["arquitetura bancária correto", "arquitetura bancária correta"],
  ["arquitetura bancária adequado", "arquitetura bancária adequada"],
  ["arquitetura bancária típico", "arquitetura bancária típica"],
  ["arquitetura bancária alinhado", "arquitetura bancária alinhada"],
  ["arquitetura bancária mínimo", "arquitetura bancária mínima"],
  ["arquitetura bancária novo", "arquitetura bancária nova"],
  ["arquitetura bancária antigo", "arquitetura bancária antiga"],
  // "Arquitetura bancária equilibrado" capitalized
  ["Arquitetura bancária equilibrado", "Arquitetura bancária equilibrada"],
  ["Arquitetura bancária completo", "Arquitetura bancária completa"],
  ["Arquitetura bancária típico", "Arquitetura bancária típica"],
  ["Arquitetura bancária mínimo", "Arquitetura bancária mínima"],
  // "Arquitetura completo típico" -> "Arquitetura completa típica"
  ["Arquitetura completo típico", "Arquitetura completa típica"],
  ["Arquitetura completo", "Arquitetura completa"],
  // "Stack típico" was capitalized — became "Arquitetura típico"
  ["Arquitetura típico", "Arquitetura típica"],
  ["Arquitetura típica.", "Arquitetura típica."],
  // "arquitetura completo" lowercase
  ["arquitetura completo,", "arquitetura completa,"],
  ["arquitetura completo.", "arquitetura completa."],
  ["arquitetura completo ", "arquitetura completa "],
  ["arquitetura completo:", "arquitetura completa:"],
  ["arquitetura típico,", "arquitetura típica,"],
  ["arquitetura típico.", "arquitetura típica."],
  ["arquitetura típico ", "arquitetura típica "],
  // "o arquitetura bancário" → already handled by article flip but adjective remains masc; needs fem
  // "o arquitetura ... típico" was "o stack ... típico" — turned into "a arquitetura ... típico" — adj should be "típica"
  ["arquitetura bancário", "arquitetura bancária"], // safety: any remaining masc adj on bancária base
  ["Arquitetura bancário", "Arquitetura bancária"],
  // "a arquitetura está correta" — already feminine; OK.
];
for (const [a, b] of ptPhraseFixes) {
  ptRules.push([new RegExp(escapeRe(a), "g"), b]);
}

// ============ CA rules ============
const caRules = [];

const caArticleFlips = [
  ["el arquitectura", "l'arquitectura"],
  ["El arquitectura", "L'arquitectura"],
  ["la arquitectura", "l'arquitectura"],
  ["La arquitectura", "L'arquitectura"],
  ["un arquitectura", "una arquitectura"],
  ["Un arquitectura", "Una arquitectura"],
  ["aquest arquitectura", "aquesta arquitectura"],
  ["Aquest arquitectura", "Aquesta arquitectura"],
  ["aqueix arquitectura", "aqueixa arquitectura"],
  ["aquell arquitectura", "aquella arquitectura"],
  ["del arquitectura", "de l'arquitectura"],
  ["al arquitectura", "a l'arquitectura"],
  ["pel arquitectura", "per l'arquitectura"],
  ["seu arquitectura", "seva arquitectura"],
  ["el seu arquitectura", "la seva arquitectura"],
  ["meu arquitectura", "meva arquitectura"],
  ["el meu arquitectura", "la meva arquitectura"],
  ["teu arquitectura", "teva arquitectura"],
  ["el teu arquitectura", "la teva arquitectura"],
  ["nostre arquitectura", "nostra arquitectura"],
  ["el nostre arquitectura", "la nostra arquitectura"],
  ["vostre arquitectura", "vostra arquitectura"],
  ["el vostre arquitectura", "la vostra arquitectura"],
];
for (const [a, b] of caArticleFlips) {
  caRules.push([new RegExp(`\\b${escapeRe(a)}\\b`, "g"), b]);
}

const caPhraseFixes = [
  ["**arquitectura** correcte", "**arquitectura** correcta"],
  ["**arquitectura** adequat", "**arquitectura** adequada"],
  ["**arquitectura** complet", "**arquitectura** completa"],
  ["**arquitectura** mínim", "**arquitectura** mínima"],
  ["**arquitectura** antic", "**arquitectura** antiga"],
  ["**arquitectura** típic", "**arquitectura** típica"],
  ["**arquitectura** equilibrat", "**arquitectura** equilibrada"],
  ["arquitectura bancària equilibrat", "arquitectura bancària equilibrada"],
  ["arquitectura bancària complet", "arquitectura bancària completa"],
  ["arquitectura bancària correcte", "arquitectura bancària correcta"],
  ["arquitectura bancària adequat", "arquitectura bancària adequada"],
  ["arquitectura bancària típic", "arquitectura bancària típica"],
  ["arquitectura bancària mínim", "arquitectura bancària mínima"],
  ["Arquitectura bancària equilibrat", "Arquitectura bancària equilibrada"],
  ["Arquitectura bancària complet", "Arquitectura bancària completa"],
  ["Arquitectura bancària típic", "Arquitectura bancària típica"],
  ["Arquitectura bancària mínim", "Arquitectura bancària mínima"],
  ["Arquitectura complet típic", "Arquitectura completa típica"],
  ["Arquitectura complet", "Arquitectura completa"],
  ["Arquitectura típic", "Arquitectura típica"],
  // CA bancari (masc) → bancària (fem) when describing arquitectura
  ["arquitectura bancari", "arquitectura bancària"],
  ["Arquitectura bancari", "Arquitectura bancària"],
  // "l'arquitectura mínim" → "l'arquitectura mínima"
  ["l'arquitectura mínim ", "l'arquitectura mínima "],
  ["L'arquitectura mínim ", "L'arquitectura mínima "],
  ["l'arquitectura mínim,", "l'arquitectura mínima,"],
  ["l'arquitectura mínim.", "l'arquitectura mínima."],
  ["l'arquitectura complet ", "l'arquitectura completa "],
  ["l'arquitectura complet,", "l'arquitectura completa,"],
  ["l'arquitectura complet.", "l'arquitectura completa."],
  ["l'arquitectura típic ", "l'arquitectura típica "],
  ["l'arquitectura típic,", "l'arquitectura típica,"],
  ["l'arquitectura típic.", "l'arquitectura típica."],
  ["l'arquitectura adequat ", "l'arquitectura adequada "],
  ["l'arquitectura adequat,", "l'arquitectura adequada,"],
  ["l'arquitectura adequat.", "l'arquitectura adequada."],
];
for (const [a, b] of caPhraseFixes) {
  caRules.push([new RegExp(escapeRe(a), "g"), b]);
}

const RULES = { de: deRules, fr: frRules, pt: ptRules, ca: caRules };

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeRoot(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
    }
  }
}
console.log(`Total files changed: ${totalChanged}`);
