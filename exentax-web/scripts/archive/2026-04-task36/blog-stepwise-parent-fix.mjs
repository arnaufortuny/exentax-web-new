#!/usr/bin/env node
/**
 * blog-stepwise-parent-fix.mjs
 *
 * Editorial pass for Task #55: in a handful of articles the enumerated-run
 * collapse from blog-structure-trim.mjs (Pass 1) did not fire, because by
 * the time it ran the file already contained `## Step 1` followed by a
 * series of `### Step N` siblings (the first step acting as the de-facto
 * parent). Cosmetically odd; semantically those should sit under an
 * explicit `## Step-by-step process` (localised) parent with each step
 * as `### Step N` underneath.
 *
 * This script detects that shape and inserts the missing parent. Concretely:
 *   - Find the FIRST `## <enum-kind>` H2 (step / paso / étape / schritt /
 *     passo / pas / numbered) whose section already contains 2+ `### <same
 *     enum-kind>` siblings.
 *   - Walk forward collecting every subsequent H2/H3 until the next H2
 *     whose heading does NOT match the same enum kind. Anything inside
 *     this run keeps its content; only heading levels change:
 *       - the leading `## <kind>` becomes `### <kind>`
 *       - any later `## <kind>` in the run is demoted to `### <kind>`
 *       - existing `### *` lines are left alone
 *   - A new `## <ENUM_PARENT[kind][lang]>` heading is inserted at the
 *     start of the run, with no body of its own (the steps speak for
 *     themselves).
 *
 * Auto-generated appendix blocks marked with `<!-- exentax:* -->` are
 * left untouched. No prose is added or removed; only heading levels
 * change and a single parent heading line is inserted.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const ENUM_PARENT = {
  step:    { es: "Proceso paso a paso",      en: "Step-by-step process",       fr: "Processus étape par étape", de: "Schritt-für-Schritt-Prozess", pt: "Processo passo a passo",     ca: "Procés pas a pas" },
  problem: { es: "Problemas más comunes",    en: "Most common problems",       fr: "Problèmes les plus courants", de: "Häufigste Probleme",         pt: "Problemas mais comuns",      ca: "Problemes més comuns" },
  mistake: { es: "Errores frecuentes",       en: "Frequent mistakes",          fr: "Erreurs fréquentes",         de: "Häufige Fehler",              pt: "Erros frequentes",           ca: "Errors freqüents" },
  tip:     { es: "Consejos prácticos",       en: "Practical tips",             fr: "Conseils pratiques",         de: "Praktische Tipps",            pt: "Dicas práticas",             ca: "Consells pràctics" },
  myth:    { es: "Mitos a desmontar",        en: "Myths to debunk",            fr: "Mythes à déconstruire",      de: "Mythen entlarven",            pt: "Mitos a desmontar",          ca: "Mites a desmuntar" },
  case:    { es: "Casos prácticos",          en: "Practical cases",            fr: "Cas pratiques",              de: "Praxisfälle",                 pt: "Casos práticos",             ca: "Casos pràctics" },
  scenario:{ es: "Escenarios habituales",    en: "Common scenarios",           fr: "Scénarios courants",         de: "Häufige Szenarien",           pt: "Cenários comuns",            ca: "Escenaris habituals" },
  phase:   { es: "Fases del proceso",        en: "Phases of the process",      fr: "Phases du processus",        de: "Phasen des Prozesses",        pt: "Fases do processo",          ca: "Fases del procés" },
  numbered:{ es: "Puntos clave",             en: "Key points",                 fr: "Points clés",                de: "Kernpunkte",                  pt: "Pontos-chave",               ca: "Punts clau" },
};

const ENUM_PATTERNS = [
  { kind: "step",     re: /^(?:step|paso|étape|etape|schritt|passo|pas)\s+\d+\b/i },
  { kind: "phase",    re: /^(?:phase|fase)\s+\d+\b/i },
  { kind: "problem",  re: /^(?:problem|problema)\s+\d+\b/i },
  { kind: "mistake",  re: /^(?:mistake|error|erreur|fehler|erro|equívoco)\s+\d+\b/i },
  { kind: "tip",      re: /^(?:tip|consejo|conseil|tipp|dica|consell)\s+\d+\b/i },
  { kind: "myth",     re: /^(?:myth|mito|mythe|mythos)\s+\d+\b/i },
  { kind: "case",     re: /^(?:case|caso|cas|fall)\s+\d+\b/i },
  { kind: "scenario", re: /^(?:scenario|escenario|szenario|cenário|cenari)\s+\d+\b/i },
  { kind: "numbered", re: /^\d+[.)]\s+\S/ },
];

const APPENDIX_MARKER = /<!--\s*exentax:[a-z0-9-]+(?:-v\d+)?\s*-->/i;

function detectKind(heading) {
  for (const p of ENUM_PATTERNS) if (p.re.test(heading)) return p.kind;
  return null;
}

function extractBody(src) {
  const m = src.match(/^export default `([\s\S]*?)`\s*;?\s*$/m);
  if (!m) return null;
  return { prefix: src.slice(0, m.index) + "export default `", body: m[1], suffix: "`;\n" };
}

function splitAppendix(body) {
  const m = body.match(APPENDIX_MARKER);
  if (!m) return { editable: body, appendix: "" };
  let cut = m.index;
  while (cut > 0 && body[cut - 1] !== "\n") cut--;
  while (cut >= 2 && body[cut - 1] === "\n" && body[cut - 2] === "\n") cut--;
  return { editable: body.slice(0, cut), appendix: body.slice(cut) };
}

// Returns the patched editable region or null if no fix applies.
function applyFix(lang, editable) {
  // Collect H2/H3 heading line positions.
  const lines = editable.split("\n");
  const heads = [];
  for (let i = 0; i < lines.length; i++) {
    const m2 = lines[i].match(/^(##|###)\s+(.*)$/);
    if (m2) heads.push({ line: i, level: m2[1].length, text: m2[2].trim() });
  }
  if (heads.length === 0) return null;

  // Walk through H2 headings. The first ## whose text matches an enumerated
  // kind starts a candidate run. The run extends forward across any number
  // of consecutive `## <same kind>` headings AND any `### *` headings
  // between them (those are either same-kind step continuations or
  // subsections of a step). The run terminates at the first `## *`
  // heading whose text does NOT match the same enum kind. If the run
  // contains 3+ headings of the same enum kind (counting both `##` and
  // `###` levels), insert a parent `## ENUM_PARENT[kind][lang]` before
  // the run's first heading and demote every `## <kind>` inside the run
  // to `### <kind>`.
  for (let h = 0; h < heads.length; h++) {
    const start = heads[h];
    if (start.level !== 2) continue;
    const kind = detectKind(start.text);
    if (!kind) continue;

    // Skip if this H2 is already preceded by the localised parent (idempotency).
    if (h > 0 && heads[h - 1].level === 2 && heads[h - 1].text === ENUM_PARENT[kind][lang]) continue;

    // Determine run end: first H2 that doesn't match `kind`.
    let runEndExclusive = heads.length;
    for (let k = h + 1; k < heads.length; k++) {
      if (heads[k].level === 2 && detectKind(heads[k].text) !== kind) {
        runEndExclusive = k;
        break;
      }
    }

    // Count same-kind headings inside the run (any level).
    let sameKind = 0;
    for (let k = h; k < runEndExclusive; k++) {
      if (detectKind(heads[k].text) === kind) sameKind++;
    }
    if (sameKind < 3) continue;

    // Demote every H2 inside the run to H3.
    for (let k = h; k < runEndExclusive; k++) {
      if (heads[k].level !== 2) continue;
      const li = heads[k].line;
      lines[li] = lines[li].replace(/^##(\s+)/, "###$1");
    }

    // Insert parent H2 right before the start heading. Maintain the
    // blank-line rhythm: the line before `start.line` should be blank.
    const parentText = ENUM_PARENT[kind][lang];
    const insertion = ["## " + parentText, ""];
    if (start.line > 0 && lines[start.line - 1].trim() !== "") {
      insertion.unshift("");
    }
    lines.splice(start.line, 0, ...insertion);

    return lines.join("\n");
  }
  return null;
}

let touched = 0;
const perLang = {};
for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  let langTouched = 0;
  for (const f of files) {
    const path = join(dir, f);
    const src = readFileSync(path, "utf8");
    const ext = extractBody(src);
    if (!ext) continue;
    const { editable, appendix } = splitAppendix(ext.body);
    const patched = applyFix(lang, editable);
    if (patched == null || patched === editable) continue;
    let newBody = patched.replace(/\s+$/, "") + (appendix ? "\n\n" + appendix : "\n");
    newBody = newBody.replace(/\n{3,}/g, "\n\n");
    const out = ext.prefix + newBody + ext.suffix;
    writeFileSync(path, out);
    console.log(`  fixed ${lang}/${f}`);
    langTouched++;
    touched++;
  }
  perLang[lang] = langTouched;
}

console.log("\nblog-stepwise-parent-fix — files modified per locale:");
for (const lang of LANGS) console.log(`  ${lang}: ${perLang[lang]}`);
console.log(`Total modified: ${touched}`);
