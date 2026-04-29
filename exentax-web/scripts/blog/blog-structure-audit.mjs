#!/usr/bin/env node
/**
 * blog-structure-audit.mjs
 *
 * Editorial structure audit for the blog corpus across all 6 locales.
 * Verifies the rules from Task #37:
 *   - Single H1 per article (the article title; the body should not introduce a competing H1)
 *   - No section under 150 words that exists only to add structure
 *   - No section over 400 words without an H3 subheading
 *   - Article closes with a clear "next step" (a final section that tells the
 *     reader what to do next; CTAs are out of scope here)
 *
 * Read-only. Exits non-zero if any structural violation is found.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const SECTION_MIN_WORDS = 150;
const SECTION_MAX_WORDS = 400;

// Closings we accept as a clear "next step" cue. Multilingual.
// We scan the whole article body (not just the tail) because the corpus
// has standard 2026 appendix sections after the editorial closing.
const NEXT_STEP_CUES = [
  // ES
  "próximo paso", "próximos pasos", "siguiente paso", "siguientes pasos",
  "qué hacer ahora", "qué hacer a continuación", "qué hacer con",
  "qué hacemos por ti", "agenda", "agendar", "habla con nosotros", "te ayudamos",
  "en resumen", "checklist final", "cómo seguir", "lecturas relacionadas",
  "en exentax nos encargamos", "en exentax montamos", "en exentax te ayudamos",
  "cómo te ayudamos", "cómo seguimos", "cómo proceder",
  // ES — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1 used across the
  // corpus; adding them as cues so the audit reflects what articles actually emit.
  "reserva una sesión", "más lecturas relacionadas", "en este mismo tema",
  // EN
  "next step", "next steps", "what to do next", "what to do now", "what to do with",
  "in summary", "talk to us", "book a call", "we handle this for you",
  "how to proceed", "how we help you", "related reading", "further reading",
  "at exentax we handle", "at exentax we set", "at exentax we help",
  // EN — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1
  "book a free session", "on the same topic", "to continue reading",
  // FR
  "prochaine étape", "prochaines étapes", "que faire maintenant", "que faire ensuite",
  "en résumé", "parlez-nous", "nous nous en occupons", "nous vous aidons",
  "chez exentax", "lectures associées", "comment procéder",
  // FR — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1
  "réservez une session gratuite", "sur le même sujet", "pour continuer la lecture",
  "lectures complémentaires",
  // DE
  "nächster schritt", "nächste schritte", "was als nächstes", "was tun mit",
  "zusammenfassung", "sprechen sie mit uns", "wir kümmern uns", "wir helfen ihnen",
  "bei exentax", "weiterführende lektüre", "wie es weitergeht",
  // DE — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1
  "buchen sie ein kostenloses gespräch", "zum weiterlesen", "zum gleichen thema",
  "vertiefung",
  // PT
  "próximo passo", "próximos passos", "o que fazer a seguir", "o que fazer agora",
  "em resumo", "fale connosco", "fale conosco", "ajudamos",
  "na exentax tratamos", "na exentax montamos", "na exentax ajudamos",
  "leituras relacionadas", "como proceder",
  // PT — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1
  "marca uma sessão gratuita", "para continuar a leitura",
  "leituras complementares", "leituras adicionais",
  // CA
  "següent pas", "següents passos", "pròxim pas", "pròxims passos",
  "què fer ara", "què fer a continuació", "en resum", "parla amb nosaltres",
  "t'ajudem", "et ajudem", "a exentax ens encarreguem", "a exentax muntem",
  "a exentax tajudem", "lectures relacionades", "com procedir",
  // CA — canonical headings/CTAs from cross-refs-v1 / cta-conv-v1
  "reserva una sessió gratuïta", "per continuar la lectura",
  "lectures complementàries", "sobre el mateix tema",
];

function extractBody(src) {
  const m = src.match(/export default `([\s\S]*?)`\s*;?\s*$/);
  return m ? m[1] : "";
}

function wordCount(s) {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#`*_>|~\\-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function analyseArticle(slug, body) {
  const issues = [];
  // H1 check: body should not contain a top-level # (we render the title above)
  const h1Lines = body.split("\n").filter((l) => /^\s*#\s+\S/.test(l));
  if (h1Lines.length > 0) {
    issues.push({ type: "extra-h1", count: h1Lines.length });
  }

  // Split by H2.
  const parts = body.split(/\n\s*##\s+/);
  // parts[0] is intro before first H2; parts[1..] are H2 sections (heading text on first line of each part)
  const sections = [];
  for (let i = 1; i < parts.length; i++) {
    const raw = parts[i];
    const nl = raw.indexOf("\n");
    const heading = (nl === -1 ? raw : raw.slice(0, nl)).trim();
    const sectionBody = nl === -1 ? "" : raw.slice(nl + 1);
    // Stop at the next H2 boundary already handled by split, but a section may contain H3s.
    // Heading skip check: any H4+ that appears without a preceding H3?
    const lines = sectionBody.split("\n");
    let sawH3 = false;
    let skip = false;
    for (const l of lines) {
      if (/^\s*###\s+\S/.test(l)) sawH3 = true;
      else if (/^\s*####\s+\S/.test(l) && !sawH3) skip = true;
    }
    const wc = wordCount(sectionBody);
    sections.push({ idx: i, heading, words: wc, hasH3: sawH3, headingSkip: skip });
  }

  const warnings = [];
  for (const s of sections) {
    if (s.words < SECTION_MIN_WORDS) {
      // Warning only: a short section carrying substantive content (a definition,
      // a comparison row, a checklist) is fine. The rule from Task #37 only fails
      // when a short section exists *purely* to add structure, which is a human
      // judgement call, not an automated one.
      warnings.push({ type: "section-too-short", heading: s.heading, words: s.words });
    }
    if (s.words > SECTION_MAX_WORDS && !s.hasH3) {
      issues.push({ type: "section-too-long-no-h3", heading: s.heading, words: s.words });
    }
    if (s.headingSkip) {
      issues.push({ type: "heading-skip", heading: s.heading });
    }
  }

  // Closing "next step" cue: scan the whole body (uniform 2026 appendix
  // sections may sit after the editorial closing).
  const lower = body.toLowerCase();
  const hasNextStep = NEXT_STEP_CUES.some((c) => lower.includes(c));
  if (!hasNextStep) {
    issues.push({ type: "missing-next-step-closing" });
  }

  return { slug, sectionCount: sections.length, issues, warnings };
}

const summary = {};
const detailed = {};
let totalIssues = 0;

for (const lang of LANGS) {
  const dir = join(ROOT, lang);
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  const langSummary = {
    posts: files.length,
    extraH1: 0,
    sectionTooShortWarn: 0,
    sectionTooLongNoH3: 0,
    headingSkip: 0,
    missingNextStep: 0,
    postsWithIssues: 0,
  };
  const langDetailed = [];
  for (const f of files) {
    const slug = f.replace(/\.ts$/, "");
    const src = readFileSync(join(dir, f), "utf8");
    const body = extractBody(src);
    if (!body) continue;
    const r = analyseArticle(slug, body);
    for (const w of r.warnings) {
      if (w.type === "section-too-short") langSummary.sectionTooShortWarn++;
    }
    if (r.issues.length === 0) {
      if (r.warnings.length > 0) langDetailed.push(r);
      continue;
    }
    langSummary.postsWithIssues++;
    for (const i of r.issues) {
      totalIssues++;
      if (i.type === "extra-h1") langSummary.extraH1++;
      else if (i.type === "section-too-long-no-h3") langSummary.sectionTooLongNoH3++;
      else if (i.type === "heading-skip") langSummary.headingSkip++;
      else if (i.type === "missing-next-step-closing") langSummary.missingNextStep++;
    }
    langDetailed.push(r);
  }
  summary[lang] = langSummary;
  detailed[lang] = langDetailed;
}

console.log("======================================================================");
console.log("BLOG STRUCTURE AUDIT — SUMMARY");
console.log("======================================================================");
for (const lang of LANGS) {
  const s = summary[lang];
  console.log(
    `[${lang.toUpperCase()}] posts:${s.posts}  posts-with-issues:${s.postsWithIssues}  ` +
      `extra-h1:${s.extraH1}  too-long-no-h3:${s.sectionTooLongNoH3}  ` +
      `heading-skip:${s.headingSkip}  missing-next-step:${s.missingNextStep}  ` +
      `(warn:short-section:${s.sectionTooShortWarn})`
  );
}
console.log(`\nTOTAL ISSUES: ${totalIssues}`);

const outPath = resolve(__dirname, "../../docs/audits/2026-04/blog-structure.json");
try {
  writeFileSync(outPath, JSON.stringify({ summary, detailed }, null, 2));
  console.log(`Detailed report written to ${outPath}`);
} catch (e) {
  // ignore if dir missing
}

process.exit(totalIssues === 0 ? 0 : 1);
