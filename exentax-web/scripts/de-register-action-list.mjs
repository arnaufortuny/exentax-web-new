#!/usr/bin/env node
/**
 * de-register-action-list.mjs — Genera lista accionable artículo×línea
 * para conversión DE register du→Sie.
 *
 * Para cada artículo en client/src/data/blog-content/de/*.ts con pronombres
 * informales (du/dein/deine/deinen/deinem/deiner/deines/dir/dich), reporta:
 *   - Línea
 *   - Texto original (truncado)
 *   - Sustituciones sugeridas (pronombres + conjugación verbal cuando es
 *     un patrón mecánico conocido)
 *   - Verbos en -st que requieren juicio editorial
 *
 * Output: docs/auditoria-multiidioma/de-register-action-list.md
 *
 * NO modifica ficheros. Es REPORT-ONLY para acelerar editorial humana.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DE = join(ROOT, "client/src/data/blog-content/de");
const OUT = join(ROOT, "docs/auditoria-multiidioma");

// Pronombres informales (con boundary unicode-aware)
const PRONOUN_RE = /(?<![A-Za-zÀ-ÖØ-öø-ÿ])([Dd]u|[Dd]ein(?:e|en|er|em|es)?|[Dd]ir|[Dd]ich)(?![A-Za-zÀ-ÖØ-öø-ÿ])/g;

// Sustituciones directas pronombres
const PRONOUN_MAP = {
  "du": "Sie", "Du": "Sie",
  "dir": "Ihnen", "Dir": "Ihnen",
  "dich": "Sie", "Dich": "Sie",
  "dein": "Ihr", "Dein": "Ihr",
  "deine": "Ihre", "Deine": "Ihre",
  "deinen": "Ihren", "Deinen": "Ihren",
  "deinem": "Ihrem", "Deinem": "Ihrem",
  "deiner": "Ihrer", "Deiner": "Ihrer",
  "deines": "Ihres", "Deines": "Ihres",
};

// Verbos en 2.persona singular comunes → 3.persona plural formal
const VERB_MAP = new Map([
  ["hast", "haben"], ["bist", "sind"], ["kannst", "können"],
  ["musst", "müssen"], ["willst", "wollen"], ["sollst", "sollen"],
  ["wirst", "werden"], ["machst", "machen"], ["weißt", "wissen"],
  ["siehst", "sehen"], ["gehst", "gehen"], ["nimmst", "nehmen"],
  ["gibst", "geben"], ["fährst", "fahren"], ["läufst", "laufen"],
  ["kommst", "kommen"], ["brauchst", "brauchen"], ["suchst", "suchen"],
  ["findest", "finden"], ["verstehst", "verstehen"], ["zahlst", "zahlen"],
  ["sparst", "sparen"], ["wartest", "warten"], ["arbeitest", "arbeiten"],
  ["denkst", "denken"], ["meinst", "meinen"], ["möchtest", "möchten"],
  ["entscheidest", "entscheiden"], ["erklärst", "erklären"],
  ["bezahlst", "bezahlen"], ["beantragst", "beantragen"],
  ["eröffnest", "eröffnen"], ["nutzt", "nutzen"], ["lebst", "leben"],
  ["wohnst", "wohnen"], ["betreibst", "betreiben"], ["bekommst", "bekommen"],
  ["erhältst", "erhalten"], ["hältst", "halten"], ["stehst", "stehen"],
  ["lässt", "lassen"], ["hörst", "hören"], ["liest", "lesen"],
  ["schreibst", "schreiben"], ["sagst", "sagen"], ["fragst", "fragen"],
  ["antwortest", "antworten"], ["bietest", "bieten"], ["verdienst", "verdienen"],
  ["sammelst", "sammeln"], ["startest", "starten"], ["beginnst", "beginnen"],
  ["führst", "führen"], ["bringst", "bringen"], ["wählst", "wählen"],
  ["benötigst", "benötigen"], ["möglicherweise", "möglicherweise"], // pass-through
  ["haftest", "haften"], ["erstellst", "erstellen"], ["unterscheidest", "unterscheiden"],
  ["änderst", "ändern"], ["überprüfst", "überprüfen"], ["betrachtest", "betrachten"],
  ["hilfst", "helfen"], ["versuchst", "versuchen"],
]);

function processArticle(slug, content) {
  const lines = content.split("\n");
  const findings = [];

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const matches = [...line.matchAll(PRONOUN_RE)];
    if (!matches.length) return;

    const suggestions = [];
    for (const m of matches) {
      const orig = m[1];
      const repl = PRONOUN_MAP[orig];
      if (!repl) continue;
      // Capitalization handling: "du" at sentence start should become "Sie"
      // "Du" stays as is (already capital). PRONOUN_MAP handles both.
      const startIdx = m.index ?? 0;
      const after = line.slice(startIdx + orig.length, startIdx + orig.length + 25);
      const verbMatch = after.match(/^\s+(\S+)/);
      const followedBy = verbMatch ? verbMatch[1].replace(/[,.;:!?].*$/, "") : null;

      let suggestion;
      if ((orig === "du" || orig === "Du") && followedBy && VERB_MAP.has(followedBy)) {
        suggestion = `${orig} ${followedBy} → ${repl} ${VERB_MAP.get(followedBy)}`;
      } else if ((orig === "du" || orig === "Du") && followedBy && /st$/.test(followedBy)) {
        suggestion = `${orig} ${followedBy} → ${repl} ${followedBy.slice(0, -2)}en   [VERIFY VERB]`;
      } else {
        suggestion = `${orig} → ${repl}`;
      }
      suggestions.push(suggestion);
    }

    findings.push({
      line: lineNum,
      excerpt: line.length > 120 ? line.slice(0, 120) + "..." : line,
      suggestions,
    });
  });

  return findings;
}

const articles = readdirSync(BLOG_DE)
  .filter((f) => f.endsWith(".ts"))
  .sort();

const allFindings = [];
let totalHits = 0;

for (const f of articles) {
  const slug = f.replace(/\.ts$/, "");
  const content = readFileSync(join(BLOG_DE, f), "utf8");
  const findings = processArticle(slug, content);
  if (findings.length > 0) {
    const hits = findings.reduce((sum, x) => sum + x.suggestions.length, 0);
    totalHits += hits;
    allFindings.push({ slug, hits, findings });
  }
}

allFindings.sort((a, b) => b.hits - a.hits);

mkdirSync(OUT, { recursive: true });
const md = [];
md.push("# DE register action list — line-by-line editorial work");
md.push("");
md.push(`Generated: ${new Date().toISOString()}`);
md.push(`Total articles flagged: **${allFindings.length}**`);
md.push(`Total hits to fix: **${totalHits}**`);
md.push("");
md.push("> Run `node scripts/blog-translation-quality-extended.mjs` after each batch to track progress.");
md.push("");
md.push("---");
md.push("");

for (const a of allFindings) {
  md.push(`## de/${a.slug}.ts (${a.hits} hits)`);
  md.push("");
  md.push("| Line | Suggestion(s) | Excerpt |");
  md.push("|---:|---|---|");
  for (const f of a.findings) {
    const sug = f.suggestions.map((s) => `\`${s}\``).join(" · ");
    const ex = f.excerpt.replace(/\|/g, "\\|");
    md.push(`| ${f.line} | ${sug} | ${ex} |`);
  }
  md.push("");
}

writeFileSync(join(OUT, "de-register-action-list.md"), md.join("\n") + "\n");
console.log(`[de-register-action-list] articles=${allFindings.length} totalHits=${totalHits}`);
console.log(`Output: docs/auditoria-multiidioma/de-register-action-list.md`);
