#!/usr/bin/env node
/**
 * blog-structure-trim.mjs
 *
 * Editorial pass for Task #48: tighten short blog sections that exist only
 * to add structure. Conservative, content-preserving transformations:
 *
 *   1. ENUMERATED RUNS — Sequences of H2s that follow an enumerated pattern
 *      (Step 1, Paso 1, Problem 1, Mistake 1, Tip 1, Phase 1, Case 1, ...)
 *      are collapsed under a single parent H2 with each item demoted to H3.
 *
 *   2. CLOSING BLOCK MERGE — Trailing H2s matching localized closing cues
 *      (Conclusion, Next steps, In summary, Related reading, How we approach
 *      it at Exentax, ...) that are each short (<150 words) are collapsed
 *      into a single closing H2, with each former heading kept as H3.
 *
 *   3. CONSECUTIVE SHORT H2 RUNS — Any other run of 2+ consecutive H2s that
 *      are each <150 words gets collapsed: first heading stays as H2, the
 *      rest become H3 inside it.
 *
 * Untouched on purpose:
 *   - Auto-generated appendix blocks marked with `<!-- exentax:*-v1 -->`.
 *     Everything from the first such marker to end-of-file is left as-is.
 *   - Article lead (text before the first H2).
 *   - Any H2 section that is already ≥150 words.
 *
 * No content is removed. Only heading levels are changed. Re-run the
 * blog-structure-audit afterwards to verify warnings dropped significantly.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const SECTION_MIN_WORDS = 150;

// Localised parent heading for collapsed enumerated runs.
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

const CLOSING_PARENT = {
  es: "Conclusión y próximos pasos", en: "Conclusion and next steps", fr: "Conclusion et prochaines étapes",
  de: "Fazit und nächste Schritte",  pt: "Conclusão e próximos passos", ca: "Conclusió i següents passos",
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

const CLOSING_RE = {
  es: /^(?:próximos?\s+pasos|conclusión|en\s+resumen|lecturas?\s+relacionadas?|cómo\s+(?:lo\s+)?abordamos|cómo\s+(?:te\s+)?ayudamos|cómo\s+seguimos|cómo\s+proceder|habla\s+con\s+nosotros|en\s+exentax|qué\s+hacer\s+(?:ahora|a\s+continuación)|checklist\s+final|lecturas?\s+adicionales?|para\s+terminar|resumen)/i,
  en: /^(?:next\s+steps?|conclusion|in\s+summary|related\s+(?:articles?|reading)|further\s+reading|how\s+we\s+approach|how\s+we\s+help|talk\s+to\s+us|book\s+a\s+call|at\s+exentax|what\s+to\s+do\s+(?:now|next)|final\s+checklist|to\s+wrap\s+up|summary|key\s+takeaways?)/i,
  fr: /^(?:prochaines?\s+étapes?|conclusion|en\s+résumé|lectures?\s+associées?|comment\s+(?:nous\s+)?l'?abordons|comment\s+nous\s+aidons|parlez-nous|chez\s+exentax|que\s+faire\s+(?:maintenant|ensuite)|pour\s+conclure|résumé)/i,
  de: /^(?:nächste[rn]?\s+schritte?|fazit|zusammenfassung|weiterführende\s+lektüre|so\s+(?:machen|gehen)\s+wir|wie\s+wir\s+helfen|sprechen\s+sie\s+mit\s+uns|bei\s+exentax|was\s+(?:als\s+nächstes|tun)|abschluss)/i,
  pt: /^(?:próximos?\s+passos|conclusão|em\s+resumo|leituras?\s+relacionadas?|como\s+(?:o\s+)?abordamos|como\s+ajudamos|fale\s+con(?:n)?osco|na\s+exentax|o\s+que\s+fazer\s+(?:agora|a\s+seguir)|para\s+concluir|resumo)/i,
  ca: /^(?:següents?\s+passos|pròxims?\s+passos|conclusió|en\s+resum|lectures?\s+relacionades?|com\s+(?:ho\s+)?abordem|com\s+ajudem|parla\s+amb\s+nosaltres|a\s+exentax|què\s+fer\s+(?:ara|a\s+continuació)|per\s+concloure|resum)/i,
};

const APPENDIX_MARKER = /<!--\s*exentax:[a-z0-9-]+(?:-v\d+)?\s*-->/i;

function wordCount(s) {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#`*_>|~\\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function extractBody(src) {
  const m = src.match(/^export default `([\s\S]*?)`\s*;?\s*$/);
  if (!m) return null;
  return { prefix: src.slice(0, m.index) + "export default `", body: m[1], suffix: "`;\n" };
}

// Split body into editable region + appendix region. Appendix starts at the
// first `<!-- exentax:*-v1 -->` marker (or earlier blank-line) and is left
// untouched.
function splitAppendix(body) {
  const m = body.match(APPENDIX_MARKER);
  if (!m) return { editable: body, appendix: "" };
  const idx = m.index;
  // Walk back to the start of the line/blank line so we don't split mid-paragraph.
  let cut = idx;
  while (cut > 0 && body[cut - 1] !== "\n") cut--;
  // Also include the blank line above the marker if present.
  while (cut >= 2 && body[cut - 1] === "\n" && body[cut - 2] === "\n") cut--;
  return { editable: body.slice(0, cut), appendix: body.slice(cut) };
}

// Parse editable region into { lead, sections: [{ heading, content }] } where
// sections are split on H2.
function parseSections(editable) {
  const parts = editable.split(/\n(?=\s*##\s+\S)/);
  // First part may itself start with ## (no leading content) — handle both.
  const sections = [];
  let lead = "";
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const m = p.match(/^\s*##\s+(.*)/);
    if (!m) {
      if (i === 0) lead = p;
      else sections.push({ heading: "", content: p });
      continue;
    }
    const nl = p.indexOf("\n");
    const heading = m[1].trim();
    const content = nl === -1 ? "" : p.slice(nl + 1);
    sections.push({ heading, content });
  }
  return { lead, sections };
}

function detectEnumKind(heading) {
  for (const p of ENUM_PATTERNS) if (p.re.test(heading)) return p.kind;
  return null;
}

function isClosing(lang, heading) {
  return CLOSING_RE[lang].test(heading);
}

// Re-emit a section list back to markdown text, using the supplied levels.
// section.level === 2 => "## heading", section.level === 3 => "### heading".
// Plain content (no heading) is emitted as-is.
function emitSections(lead, sections) {
  let out = lead.replace(/\s+$/, "");
  if (out.length > 0) out += "\n\n";
  for (const s of sections) {
    if (!s.heading) {
      out += s.content.replace(/^\s+/, "");
      if (!out.endsWith("\n")) out += "\n";
      continue;
    }
    const hashes = s.level === 3 ? "### " : "## ";
    out += hashes + s.heading + "\n\n" + s.content.replace(/^\s+/, "");
    if (!out.endsWith("\n")) out += "\n";
  }
  // Normalise excessive blank lines.
  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

// Apply the three transformations to the section list (in place).
function transform(lang, sections) {
  // Tag each section with word count and default level 2.
  for (const s of sections) {
    s.level = 2;
    s.words = wordCount(s.content);
  }
  const isShort = (s) => s.heading && s.level === 2 && s.words < SECTION_MIN_WORDS;

  // PASS 1: collapse enumerated runs (3+ consecutive H2s of the same kind).
  let i = 0;
  while (i < sections.length) {
    const s = sections[i];
    const kind = s.heading ? detectEnumKind(s.heading) : null;
    if (kind) {
      let j = i;
      while (j < sections.length) {
        const t = sections[j];
        if (!t.heading || detectEnumKind(t.heading) !== kind) break;
        j++;
      }
      const runLen = j - i;
      if (runLen >= 3) {
        // Insert a synthetic parent H2 with empty content; demote run members to H3.
        const parent = {
          heading: ENUM_PARENT[kind][lang],
          content: "",
          level: 2,
          words: 0,
          synthetic: true,
        };
        for (let k = i; k < j; k++) sections[k].level = 3;
        sections.splice(i, 0, parent);
        i = j + 1; // we inserted one
        continue;
      }
    }
    i++;
  }

  // PASS 2: collapse trailing closing block. Walk from end, gather a maximal
  // suffix of short H2s that match the closing cue. If 2+, fold under one
  // closing H2 with H3 sub-sections. (We allow long appendix-like H2s after
  // them — there shouldn't be any here since we already split off the
  // auto-generated appendix.)
  {
    // Find last H2 index.
    let last = -1;
    for (let k = sections.length - 1; k >= 0; k--) {
      if (sections[k].heading && sections[k].level === 2) { last = k; break; }
    }
    if (last >= 0) {
      let start = last;
      while (
        start - 1 >= 0 &&
        sections[start - 1].heading &&
        sections[start - 1].level === 2 &&
        isClosing(lang, sections[start - 1].heading) &&
        sections[start - 1].words < SECTION_MIN_WORDS
      ) start--;
      // Also include the last itself only if it's a closing cue & short.
      const includeLast =
        isClosing(lang, sections[last].heading) &&
        sections[last].words < SECTION_MIN_WORDS;
      if (includeLast && last - start + 1 >= 2) {
        const parent = {
          heading: CLOSING_PARENT[lang],
          content: "",
          level: 2,
          words: 0,
          synthetic: true,
        };
        for (let k = start; k <= last; k++) sections[k].level = 3;
        sections.splice(start, 0, parent);
      }
    }
  }

  // PASS 3: collapse remaining consecutive short H2 runs (2+) generically.
  // Skip synthetic parents we just inserted (those are level 2 with 0 words).
  i = 0;
  while (i < sections.length) {
    const s = sections[i];
    if (isShort(s) && !s.synthetic) {
      let j = i + 1;
      while (j < sections.length && isShort(sections[j]) && !sections[j].synthetic) j++;
      const runLen = j - i;
      if (runLen >= 2) {
        // Promote first as H2 parent (already H2); demote rest to H3.
        for (let k = i + 1; k < j; k++) sections[k].level = 3;
      }
      i = j;
    } else {
      i++;
    }
  }

  // PASS 4: tightened orphan demotion — only demote a short H2 to H3 when
  // its short-ness is a strong signal of fluff, not just under-150 words.
  // A "fluff signal" is one of:
  //   (a) the heading matches a closing cue (Conclusion / Next steps / In
  //       summary / Related reading / How we approach it at Exentax / ...)
  //   (b) the section is very short (<80 words) — clearly a stub
  //   (c) the immediately preceding H2 was also short and got demoted in
  //       PASS 1/2/3 (i.e. this section is trailing a short-section run)
  // Substantive short sections (80–149 words sitting next to long H2s)
  // are LEFT AS H2 to preserve semantic hierarchy. They show up as
  // warnings in the audit but are exactly the "definition / comparison /
  // checklist" sections the audit comment calls out as fine.
  for (let k = 1; k < sections.length; k++) {
    const s = sections[k];
    if (
      !s.heading ||
      s.level !== 2 ||
      s.synthetic ||
      s.words >= SECTION_MIN_WORDS
    ) continue;
    const cueMatch = isClosing(lang, s.heading);
    const veryShort = s.words < 80;
    // Look back for the previous H2 (any level-2 with heading).
    let p = k - 1;
    while (p >= 0 && !(sections[p].heading && sections[p].level === 2)) p--;
    const prevWasShortDemoted =
      p >= 0 &&
      sections[p].synthetic === true; // synthetic = was a run/closing parent
    if (p >= 0 && (cueMatch || veryShort || prevWasShortDemoted)) {
      sections[k].level = 3;
    }
  }

  return sections;
}

const stats = { perLang: {} };
let touched = 0;

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
    const { lead, sections } = parseSections(editable);
    if (sections.length === 0) continue;
    const before = JSON.stringify(sections.map((s) => [s.heading, s.content]));
    transform(lang, sections);
    const newEditable = emitSections(lead, sections);
    const newBody = newEditable.replace(/\s+$/, "") + (appendix ? "\n\n" + appendix : "\n");
    // Normalise excessive blank lines at the editable/appendix join.
    const cleanBody = newBody.replace(/\n{3,}/g, "\n\n");
    if (cleanBody !== ext.body) {
      const out = ext.prefix + cleanBody + ext.suffix;
      writeFileSync(path, out);
      langTouched++;
      touched++;
    }
    void before;
  }
  stats.perLang[lang] = langTouched;
}

console.log("blog-structure-trim — files modified per locale:");
for (const lang of LANGS) console.log(`  ${lang}: ${stats.perLang[lang]}`);
console.log(`Total modified: ${touched}`);
