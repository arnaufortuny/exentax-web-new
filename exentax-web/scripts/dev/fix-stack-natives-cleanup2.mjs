#!/usr/bin/env node
// Second cleanup pass: more flexible article/adjective/pronoun fixes.
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

// =============== DE ===============
// Map masc article forms -> fem equivalents.
const DE_FLIPS = {
  der: "die", Der: "Die",
  den: "die", Den: "Die",
  dem: "der", Dem: "Der",
  einen: "eine", Einen: "Eine",
  einem: "einer", Einem: "Einer",
  ein: "eine", Ein: "Eine",
  diesen: "diese", Diesen: "Diese",
  diesem: "dieser", Diesem: "Dieser",
  welchen: "welche", Welchen: "Welche",
};

// "des <root>en" / "eines <root>en" → singular feminine genitive
// We treat any of these as singular and fix to "der/einer <root>" (no -en).
const DE_GEN_FLIPS = {
  des: "der", Des: "Der",
  eines: "einer", Eines: "Einer",
};

// Adjective ending fixes when adjective directly precedes Architektur (masc → fem).
// We only flip the very-end masculine ending "-en" / "-er" when followed by Architektur(en).
// e.g. "richtigen Banking-Architektur" → "richtige Banking-Architektur".
// e.g. "kompletten Architektur" → "komplette Architektur".
// e.g. "passenden Architektur" → "passende Architektur".
// "ausgewogener Banking-Architektur" → "ausgewogene Banking-Architektur".
const DE_ROOT_RE = /(?:[A-ZÄÖÜ][\wäöüÄÖÜß-]*-)*(?:[Aa]rchitektur)(?:en)?/;

function deFix(text) {
  let out = text;

  // 1) Article flip: <masc article> <optional adj-words 0..3> <ROOT>
  // We only flip the article token. Adjective endings handled separately.
  const articleAlt = Object.keys(DE_FLIPS).join("|");
  const reArt = new RegExp(
    `\\b(${articleAlt})((?:\\s+(?!(?:${articleAlt})\\b)[\\wäöüÄÖÜß*-]+){0,3})\\s+(${DE_ROOT_RE.source})\\b`,
    "g"
  );
  out = out.replace(reArt, (m, art, mid, root) => {
    return `${DE_FLIPS[art]}${mid} ${root}`;
  });

  // 2) Genitive: "des/eines <maybe adj> <ROOT>en" -> "der/einer <maybe adj-fem> <ROOT>"
  const genAlt = Object.keys(DE_GEN_FLIPS).join("|");
  const reGen = new RegExp(
    `\\b(${genAlt})((?:\\s+(?!(?:${articleAlt}|${genAlt})\\b)[\\wäöüÄÖÜß*-]+){0,3})\\s+([A-Za-zäöüÄÖÜß-]*?[Aa]rchitektur)(?:en)?\\b`,
    "g"
  );
  out = out.replace(reGen, (m, art, mid, root) => {
    return `${DE_GEN_FLIPS[art]}${mid} ${root}`;
  });

  // 3) Adjective ending fixups directly before *Architektur
  //    Patterns: "<adj>en <root>" -> "<adj>e <root>" (e.g. richtigen -> richtige)
  //    Only when preceded by fem article die/eine/diese/dieser/keine/jene
  out = out.replace(
    /\b(die|eine|diese|jene|keine|seine|ihre|unsere|eure|deine|meine|jede)\s+([\wäöüÄÖÜß]+)en\s+([A-Za-zäöüÄÖÜß-]*[Aa]rchitektur(?:en)?)\b/g,
    (m, art, adj, root) => {
      // Only flip if "<adj>en" is plausibly an adjective; skip if it's a known
      // word that legitimately ends in -en (rare). Safer: only known adjectives.
      const KNOWN = new Set([
        "richtig", "kompletten" /* placeholder */, "gut", "schlecht", "passend",
        "vollständig", "empfohlen", "minimal", "maximal", "optimal", "geeignet",
        "stabil", "klar", "ordentlich", "neu", "alt", "modern", "konkret",
        "sauber", "korrekt", "nützlich", "robust", "saubere", "ganz", "gesamt",
        "gestrafft", "umfassend", "skalierbar", "funktional", "operativ",
        "angemessen", "echt", "rein", "vorhandern" /* placeholder */,
      ]);
      // Heuristic: try removing "-en" and check if remainder + "e" is a valid German adjective.
      // We'll just do it for any -en ending that's not a known noun.
      const NOUN_ENDS = new Set([
        "Damen", "Herren", "Banken", "Frauen", "Wochen", "Hosen", "Türen",
        "Pflichten", "Zahlen", "Sachen", "Stunden", "Sorgen", "Tonnen",
      ]);
      if (NOUN_ENDS.has(adj + "en")) return m;
      return `${art} ${adj}e ${root}`;
    }
  );

  // 4) "ausgewogener/dreistufiger/<adj>er Banking-Architektur" -> "ausgewogene Banking-Architektur"
  out = out.replace(
    /\b([A-ZÄÖÜ][a-zäöüß]+)er\s+([A-Za-zäöüÄÖÜß-]*[Aa]rchitektur(?:en)?)\b/g,
    (m, adj, root) => {
      // Skip if "adj" is actually a real noun (like "Aufbau"), or "Innen", etc.
      const SKIP = new Set([
        "Aufbau", "Eltern", "Damen", "Herren", "Frauen", "Pflichten",
        "Banken", "Wochen", "Tonnen", "Hosen", "Türen", "Sachen",
      ]);
      if (SKIP.has(adj + "er") || SKIP.has(adj)) return m;
      return `${adj}e ${root}`;
    }
  );

  // 5) "wie eine Architektur zu entwerfen ist, der" → "die" (relative pronoun)
  out = out.replace(/Architektur zu entwerfen ist, der den Alltag/g, "Architektur zu entwerfen ist, die den Alltag");
  // generic: "Architektur, der" (relative) → "Architektur, die"
  out = out.replace(/Architektur, der ([a-zäöüA-ZÄÖÜß])/g, (m, next) => `Architektur, die ${next}`);

  // 6) "Architektur ... liest sich nützlicher, wenn er als" → "wenn sie als"
  out = out.replace(/Architektur liest sich nützlicher, wenn er als/g, "Architektur liest sich nützlicher, wenn sie als");
  out = out.replace(/Architektur liest sich nützlicher, wenn er ([a-zäöüA-ZÄÖÜß])/g, (m, next) => `Architektur liest sich nützlicher, wenn sie ${next}`);

  // 7) "ein <adj?> Architektur" inside relative clause continuations:
  //    e.g. "ein internationaler Zahlungsarchitektur" — "ein" → "eine", adj-er → adj-e
  out = out.replace(/\bein internationaler Zahlungsarchitektur\b/g, "eine internationale Zahlungsarchitektur");

  // 8) "den oder eine andere Architektur" — "den" here meant "den Stack" (acc masc) → "diese oder eine andere Architektur"
  out = out.replace(/\bden oder eine andere Architektur\b/g, "die eine oder die andere Architektur");

  // 9) "des Kontos im Banken-Architektur" → "im Banken-... " — "im" is dat. "im Architektur" should be "in der Architektur" but "im" itself is OK only with masc/neuter dative. "Im Banken-Architektur" = "im der Banken-Architektur"? No: contracted "im" = "in dem". Architektur is fem, dative fem = "in der". So "im" (in dem) is wrong. Replace "im <root>" → "in der <root>".
  out = out.replace(/\bim\s+([A-Za-z][\wäöüÄÖÜß-]*Architektur(?:en)?)\b/g, "in der $1");
  out = out.replace(/\bIm\s+([A-Za-z][\wäöüÄÖÜß-]*Architektur(?:en)?)\b/g, "In der $1");

  // 10) "vom <root>" already handled in cleanup1, but be sure
  out = out.replace(/\bvom\s+([A-Za-z][\wäöüÄÖÜß-]*Architektur(?:en)?)\b/g, "von der $1");

  // 11) "in die kohärente Architektur ordnet" → fine.
  // 12) Numeric: re-singularize stray "Architekturen" that came from "Stacks" sing-genitive.
  //     e.g. "des gesamten Banking-Architekturen" — already handled by step 2.

  return out;
}

// =============== FR ===============
function frFix(text) {
  let out = text;

  // Article flips for any "<masc> ... configuration" patterns missed before
  // We do strict word-only replacement, ignoring intervening adjectives.
  const FR_ARTICLE_FLIPS = [
    [/\bun\s+(?:[a-zàâçéèêëîïôûùüÿñæœ-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^un\b/, "une")],
    [/\bUn\s+(?:[a-zàâçéèêëîïôûùüÿñæœA-Z-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^Un\b/, "Une")],
    [/\ble\s+(?:[a-zàâçéèêëîïôûùüÿñæœ-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^le\b/, "la")],
    [/\bLe\s+(?:[a-zàâçéèêëîïôûùüÿñæœA-Z-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^Le\b/, "La")],
    [/\bce\s+(?:[a-zàâçéèêëîïôûùüÿñæœ-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^ce\b/, "cette")],
    [/\bCe\s+(?:[a-zàâçéèêëîïôûùüÿñæœA-Z-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^Ce\b/, "Cette")],
    [/\bdu\s+(?:[a-zàâçéèêëîïôûùüÿñæœ-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^du\b/, "de la")],
    [/\bDu\s+(?:[a-zàâçéèêëîïôûùüÿñæœA-Z-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^Du\b/, "De la")],
    [/\bau\s+(?:[a-zàâçéèêëîïôûùüÿñæœ-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^au\b/, "à la")],
    [/\bAu\s+(?:[a-zàâçéèêëîïôûùüÿñæœA-Z-]+\s+){0,2}configuration\b/g, (m) => m.replace(/^Au\b/, "À la")],
  ];
  for (const [re, fn] of FR_ARTICLE_FLIPS) out = out.replace(re, fn);

  // Adjective endings that need feminization right after "configuration" or "configuration <ADJ>"
  // We use a list of common masc->fem adjective swaps.
  const FR_ADJ_SWAPS = [
    ["approprié", "appropriée"], ["adéquat", "adéquate"], ["adapté", "adaptée"],
    ["actuel", "actuelle"], ["correct", "correcte"], ["incorrect", "incorrecte"],
    ["complet", "complète"], ["incomplet", "incomplète"], ["cohérent", "cohérente"],
    ["incohérent", "incohérente"], ["équilibré", "équilibrée"],
    ["déséquilibré", "déséquilibrée"], ["optimal", "optimale"], ["minimal", "minimale"],
    ["maximal", "maximale"], ["packagé", "packagée"], ["mauvais", "mauvaise"],
    ["bon", "bonne"], ["plein", "pleine"], ["entier", "entière"],
    ["intégral", "intégrale"], ["général", "générale"], ["national", "nationale"],
    ["robuste", "robuste"], ["pratique", "pratique"], ["standard", "standard"],
    ["dédié", "dédiée"], ["recommandé", "recommandée"], ["actuel·le", "actuelle"],
    ["technique", "technique"], ["financier", "financière"], ["bancaire", "bancaire"],
    ["nouveau", "nouvelle"], ["ancien", "ancienne"], ["décrit", "décrite"],
  ];

  function fmFix(prefix) {
    for (const [m_, f_] of FR_ADJ_SWAPS) {
      // configuration ... <space> <adj-masc> (boundary)
      const re = new RegExp(
        `\\b(${prefix})((?:\\s+\\*?\\*?[a-zàâçéèêëîïôûùüÿñæœ-]+\\*?\\*?){0,2})\\s+${escapeRe(m_)}\\b`,
        "g"
      );
      out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
    }
  }
  fmFix("configuration");
  fmFix("Configuration");
  fmFix("\\*\\*configuration\\*\\*");
  fmFix("\\*\\*Configuration\\*\\*");

  // "C'est" continued — "configuration ... est correct" → "est correcte"
  out = out.replace(/\bconfiguration\b((?:\s+[^.]{0,40}?)?)\s+est\s+correct\b/g, "configuration$1 est correcte");
  out = out.replace(/\bConfiguration\b((?:\s+[^.]{0,40}?)?)\s+est\s+correct\b/g, "Configuration$1 est correcte");

  return out;
}

// =============== PT ===============
function ptFix(text) {
  let out = text;

  // Article + masculine adj flips for "arquitetura"
  const PT_ARTICLE_FLIPS = [
    [/\bo\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^o\b/, "a")],
    [/\bO\s+(?:[a-zàâãáéêíóôõúüçA-Z-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^O\b/, "A")],
    [/\bum\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^um\b/, "uma")],
    [/\bUm\s+(?:[a-zàâãáéêíóôõúüçA-Z-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^Um\b/, "Uma")],
    [/\beste\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^este\b/, "esta")],
    [/\bEste\s+(?:[a-zàâãáéêíóôõúüçA-Z-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^Este\b/, "Esta")],
    [/\besse\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^esse\b/, "essa")],
    [/\bdo\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^do\b/, "da")],
    [/\bno\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^no\b/, "na")],
    [/\bao\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^ao\b/, "à")],
    [/\bdeste\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^deste\b/, "desta")],
    [/\bnesse\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^nesse\b/, "nessa")],
    [/\bneste\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^neste\b/, "nesta")],
    [/\bpelo\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^pelo\b/, "pela")],
    [/\bseu\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^seu\b/, "sua")],
    [/\bnosso\s+(?:[a-zàâãáéêíóôõúüç-]+\s+){0,2}arquitetura\b/g, (m) => m.replace(/^nosso\b/, "nossa")],
  ];
  for (const [re, fn] of PT_ARTICLE_FLIPS) out = out.replace(re, fn);

  // Adjective fix after arquitetura
  const PT_ADJ_SWAPS = [
    ["correto", "correta"], ["adequado", "adequada"], ["completo", "completa"],
    ["antigo", "antiga"], ["típico", "típica"], ["alinhado", "alinhada"],
    ["equilibrado", "equilibrada"], ["mínimo", "mínima"], ["máximo", "máxima"],
    ["bancário", "bancária"], ["financeiro", "financeira"], ["operacional", "operacional"],
    ["dimensionado", "dimensionada"], ["recomendado", "recomendada"],
    ["bom", "boa"], ["mau", "má"], ["novo", "nova"], ["pequeno", "pequena"],
    ["grande", "grande"], ["completo,", "completa,"],
  ];
  function pmFix(prefix) {
    for (const [m_, f_] of PT_ADJ_SWAPS) {
      const re = new RegExp(
        `\\b(${prefix})((?:\\s+\\*?\\*?[a-zàâãáéêíóôõúüç-]+\\*?\\*?){0,2})\\s+${escapeRe(m_)}\\b`,
        "g"
      );
      out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
    }
  }
  pmFix("arquitetura");
  pmFix("Arquitetura");
  pmFix("\\*\\*arquitetura\\*\\*");
  pmFix("\\*\\*Arquitetura\\*\\*");

  return out;
}

// =============== CA ===============
function caFix(text) {
  let out = text;
  const CA_ARTICLE_FLIPS = [
    // "el arquitectura" → "l'arquitectura" (article+vowel)
    [/\bel\s+arquitectura\b/g, "l'arquitectura"],
    [/\bEl\s+arquitectura\b/g, "L'arquitectura"],
    [/\bla\s+arquitectura\b/g, "l'arquitectura"],
    [/\bLa\s+arquitectura\b/g, "L'arquitectura"],
    // For variants with adj between, prefer "l'<adj> arquitectura"... but Catalan usually puts adj after.
    [/\bel\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^el\b/, "l'").replace(/^l'\s+/, "l'")],
    [/\bEl\s+(?:[a-zàèéíïòóúüç·A-Z-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^El\b/, "L'").replace(/^L'\s+/, "L'")],
    [/\bun\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^un\b/, "una")],
    [/\bUn\s+(?:[a-zàèéíïòóúüç·A-Z-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^Un\b/, "Una")],
    [/\baquest\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^aquest\b/, "aquesta")],
    [/\bAquest\s+(?:[a-zàèéíïòóúüç·A-Z-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^Aquest\b/, "Aquesta")],
    [/\bdel\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^del\b/, "de l'")],
    [/\bDel\s+(?:[a-zàèéíïòóúüç·A-Z-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^Del\b/, "De l'")],
    [/\bal\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^al\b/, "a l'")],
    [/\bAl\s+(?:[a-zàèéíïòóúüç·A-Z-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^Al\b/, "A l'")],
    [/\bpel\s+(?:[a-zàèéíïòóúüç·-]+\s+){0,2}arquitectura\b/g, (m) => m.replace(/^pel\b/, "per l'")],
  ];
  for (const [re, fn] of CA_ARTICLE_FLIPS) out = out.replace(re, fn);

  // Adjective fix
  const CA_ADJ_SWAPS = [
    ["correcte", "correcta"], ["adequat", "adequada"], ["complet", "completa"],
    ["mínim", "mínima"], ["màxim", "màxima"], ["antic", "antiga"],
    ["típic", "típica"], ["equilibrat", "equilibrada"], ["alineat", "alineada"],
    ["bancari", "bancària"], ["financer", "financera"], ["operatiu", "operativa"],
    ["actual", "actual"], ["bo", "bona"], ["dolent", "dolenta"], ["nou", "nova"],
    ["recomanat", "recomanada"], ["dimensionat", "dimensionada"],
    ["complet,", "completa,"],
  ];
  function cmFix(prefix) {
    for (const [m_, f_] of CA_ADJ_SWAPS) {
      const re = new RegExp(
        `\\b(${prefix})((?:\\s+\\*?\\*?[a-zàèéíïòóúüç·-]+\\*?\\*?){0,2})\\s+${escapeRe(m_)}\\b`,
        "g"
      );
      out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
    }
  }
  cmFix("arquitectura");
  cmFix("Arquitectura");
  cmFix("l'arquitectura");
  cmFix("L'arquitectura");
  cmFix("\\*\\*arquitectura\\*\\*");
  cmFix("\\*\\*Arquitectura\\*\\*");

  return out;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FIX = { de: deFix, fr: frFix, pt: ptFix, ca: caFix };

let totalChanged = 0;
for (const lang of LANGS) {
  const dir = join(BASE, lang);
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".ts")) continue;
    const fp = join(dir, name);
    if (!statSync(fp).isFile()) continue;
    const original = readFileSync(fp, "utf8");
    const { s, slots } = protect(original, PROTECT_PATTERNS);
    const fixed = FIX[lang](s);
    const final = unprotect(fixed, slots);
    if (final !== original) {
      writeFileSync(fp, final);
      totalChanged++;
    }
  }
}
console.log(`Total files changed: ${totalChanged}`);
