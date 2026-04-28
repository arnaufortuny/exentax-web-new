#!/usr/bin/env node
// Surgical third pass: fixes regressions from cleanup2 and remaining leftovers.
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

function deFix(s) {
  let out = s;

  // 1) Revert overshoot: prepositions that govern dative — "von/in/an/auf/aus/bei/mit/nach/zu + die <root>" → "der <root>"
  //    Only when describing the architecture as the prepositional object.
  out = out.replace(
    /\b(von|nach|zu|seit|aus|bei|mit|gegenüber)\s+die\s+([\w-]*[Aa]rchitektur(?:en)?)\b/g,
    "$1 der $2"
  );
  out = out.replace(
    /\b(Von|Nach|Zu|Seit|Aus|Bei|Mit|Gegenüber)\s+die\s+([\w-]*[Aa]rchitektur(?:en)?)\b/g,
    "$1 der $2"
  );

  // 2) "in die aktuelle Architektur welche Rolle spielt" should be dative — "in der aktuellen Architektur welche Rolle spielt"
  out = out.replace(
    /\bin die aktuelle Architektur welche Rolle spielt\b/g,
    "in der aktuellen Architektur welche Rolle spielt"
  );
  // generic: "in die <adj>e Architektur welche Rolle" - dative
  out = out.replace(
    /\bin die ([\wäöüÄÖÜß]+)e ([\w-]*Architektur) welche Rolle\b/g,
    "in der $1en $2 welche Rolle"
  );

  // 3) "Die Aufbau" → "Den Aufbau" (Aufbau is masc; was incorrectly flipped because of intervening Architektur match)
  out = out.replace(/\bDie Aufbau einer ([\w-]*Architektur)\b/g, "Den Aufbau einer $1");
  out = out.replace(/\bdie Aufbau einer ([\w-]*Architektur)\b/g, "den Aufbau einer $1");

  // 4) "die Devisenwechsel" → "der Devisenwechsel"
  out = out.replace(/\bdie Devisenwechsel\b/g, "der Devisenwechsel");

  // 5) "einen **Banking-Architektur**" / similar bold patterns: handle bold roots that escaped flips.
  const boldArt = /\b(einen|einem|ein|den|dem|der|des|diesen|diesem|welchen|eines)\s+\*\*([\w-]*[Aa]rchitektur(?:en)?)\*\*/g;
  const boldFlip = {
    einen: "eine", einem: "einer", ein: "eine",
    den: "die", dem: "der", der: "die", des: "der",
    diesen: "diese", diesem: "dieser", welchen: "welche", eines: "einer",
  };
  out = out.replace(boldArt, (m, art, root) => {
    const repl = boldFlip[art];
    // Singular "des/eines + Xen" (gen) → "der/einer + X"
    if ((art === "des" || art === "eines") && root.endsWith("en")) {
      return `${repl} **${root.slice(0, -2)}**`;
    }
    return `${repl} **${root}**`;
  });
  // Capitalized variants
  const boldArtCap = /\b(Einen|Einem|Ein|Den|Dem|Der|Des|Diesen|Diesem|Welchen|Eines)\s+\*\*([\w-]*[Aa]rchitektur(?:en)?)\*\*/g;
  const boldFlipCap = {
    Einen: "Eine", Einem: "Einer", Ein: "Eine",
    Den: "Die", Dem: "Der", Der: "Die", Des: "Der",
    Diesen: "Diese", Diesem: "Dieser", Welchen: "Welche", Eines: "Einer",
  };
  out = out.replace(boldArtCap, (m, art, root) => {
    const repl = boldFlipCap[art];
    if ((art === "Des" || art === "Eines") && root.endsWith("en")) {
      return `${repl} **${root.slice(0, -2)}**`;
    }
    return `${repl} **${root}**`;
  });

  // 6) "den richtigen **Architektur**, in dem" → "die richtige **Architektur**, in der"
  out = out.replace(
    /\bden richtigen \*\*Architektur\*\*, in dem jedes Tool\b/g,
    "die richtige **Architektur**, in der jedes Tool"
  );
  out = out.replace(
    /\bDen richtigen \*\*Architektur\*\*, in dem jedes Tool\b/g,
    "Die richtige **Architektur**, in der jedes Tool"
  );
  // Generic fallback for any "den richtigen **Architektur**"
  out = out.replace(
    /\b(den|Den)\s+richtigen\s+\*\*Architektur\*\*/g,
    (m, art) => `${art === "Den" ? "Die" : "die"} richtige **Architektur**`
  );
  // "in dem jedes Tool" right after "die richtige **Architektur**"
  out = out.replace(
    /\b(die|Die) richtige \*\*Architektur\*\*, in dem jedes\b/g,
    (m, a) => `${a} richtige **Architektur**, in der jedes`
  );

  // 7) "eine **<adj>er Banking-Architektur**" — adj-er should be adj-e
  //    e.g. "eine **dreistufiger Banking-Architektur**" → "eine **dreistufige Banking-Architektur**"
  out = out.replace(
    /\beine\s+\*\*([\wäöüÄÖÜß]+?)er\s+([\w-]*Architektur(?:en)?)\*\*/g,
    "eine **$1e $2**"
  );
  out = out.replace(
    /\bEine\s+\*\*([\wäöüÄÖÜß]+?)er\s+([\w-]*Architektur(?:en)?)\*\*/g,
    "Eine **$1e $2**"
  );

  // 8) "**Banking-Architektur**, gedacht als System" — context-free, keep as is
  // 9) Fix any "Architektur ... der" relative pronoun residues we missed:
  //    "wie ein Architektur zu entwerfen ist, der" was already fixed.

  // 10) "ein <adj>er <X-Architektur>" pattern (no bold) — adj-er → adj-e
  out = out.replace(
    /\beine\s+([\wäöüÄÖÜß]+)er\s+([A-Z][\w-]*Architektur(?:en)?)\b/g,
    (m, adj, root) => {
      // skip if "<adj>er" is a known noun (e.g., "Anbieter")
      const SKIP = new Set(["Anbiet", "Lieb", "Lehr", "Bürg", "Förd", "Vermitt"]);
      if (SKIP.has(adj)) return m;
      return `eine ${adj}e ${root}`;
    }
  );
  out = out.replace(
    /\bEine\s+([\wäöüÄÖÜß]+)er\s+([A-Z][\w-]*Architektur(?:en)?)\b/g,
    (m, adj, root) => {
      const SKIP = new Set(["Anbiet", "Lieb", "Lehr", "Bürg", "Förd", "Vermitt"]);
      if (SKIP.has(adj)) return m;
      return `Eine ${adj}e ${root}`;
    }
  );

  return out;
}

function frFix(s) {
  let out = s;
  // "configuration adapté" → "configuration adaptée" (no intervening words)
  // also "configuration <ADJ> recommandé" etc.
  const FR_ADJ = [
    ["approprié", "appropriée"], ["adéquat", "adéquate"], ["adapté", "adaptée"],
    ["actuel", "actuelle"], ["correct", "correcte"], ["complet", "complète"],
    ["cohérent", "cohérente"], ["équilibré", "équilibrée"], ["optimal", "optimale"],
    ["mauvais", "mauvaise"], ["recommandé", "recommandée"], ["dédié", "dédiée"],
    ["packagé", "packagée"], ["intégral", "intégrale"], ["plein", "pleine"],
    ["entier", "entière"], ["nouveau", "nouvelle"], ["ancien", "ancienne"],
  ];
  for (const [m_, f_] of FR_ADJ) {
    // Allow up to 3 short modifiers between "configuration" and the adj.
    const re = new RegExp(
      `\\b(configuration|Configuration)((?:\\s+(?!est\\b|sera\\b|était\\b)[a-zA-ZàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ-]+){0,3})\\s+${m_}\\b`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  return out;
}

function ptFix(s) {
  let out = s;
  const PT_ADJ = [
    ["correto", "correta"], ["adequado", "adequada"], ["completo", "completa"],
    ["antigo", "antiga"], ["típico", "típica"], ["alinhado", "alinhada"],
    ["equilibrado", "equilibrada"], ["mínimo", "mínima"], ["máximo", "máxima"],
    ["bancário", "bancária"], ["recomendado", "recomendada"],
    ["dimensionado", "dimensionada"], ["bom", "boa"], ["mau", "má"],
    ["novo", "nova"], ["pequeno", "pequena"], ["grande", "grande"],
  ];
  for (const [m_, f_] of PT_ADJ) {
    const re = new RegExp(
      `\\b(arquitetura|Arquitetura)((?:\\s+(?!é\\b|está\\b|era\\b|foi\\b)[a-zA-ZàâãáéêíóôõúüçÀÂÃÁÉÊÍÓÔÕÚÜÇ-]+){0,3})\\s+${m_}\\b`,
      "g"
    );
    out = out.replace(re, (mAll, p, mid) => `${p}${mid} ${f_}`);
  }
  return out;
}

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
  for (const [m_, f_] of CA_ADJ) {
    const re = new RegExp(
      `\\b(arquitectura|Arquitectura|l'arquitectura|L'arquitectura)((?:\\s+(?!és\\b|està\\b|era\\b|fou\\b)[a-zA-ZàèéíïòóúüçÀÈÉÍÏÒÓÚÜÇ·-]+){0,3})\\s+${m_}\\b`,
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
