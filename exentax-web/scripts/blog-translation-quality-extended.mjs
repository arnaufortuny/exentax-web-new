#!/usr/bin/env node
/**
 * Extended blog translation-quality audit (Bloque 7).
 *
 * Complements blog-translation-quality-audit.mjs (PT-BR + dup-paras) with
 * additional machine-translation tells detected via heuristics:
 *
 *   1. Language leakage — ES/CA tokens leaking into EN/FR/DE/PT bodies.
 *   2. DE register — should use "Sie" (formal). Flags "du", "dein", "dir".
 *   3. FR register — should use "vous". Flags singular informal "tu", "ton",
 *      "ta", "tes" (singular).
 *   4. Word-count ratio per locale vs ES origin (target ≥ 0.70).
 *   5. Untranslated paragraph detection — identical body block ES↔target
 *      indicates the paragraph was never translated.
 *   6. Common false-friends / machine-translation tells per language.
 *
 * Output: docs/auditoria-multiidioma/blog-translation-quality-ext.{json,md}
 *
 * REPORT-ONLY (does not block CI). Heuristics have ~5% false-positive rate;
 * each finding requires editorial confirmation.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_ROOT = join(ROOT, "client/src/data/blog-content");
const OUT_DIR = join(ROOT, "docs/auditoria-multiidioma");

const LANGS_NON_ES = ["en", "fr", "de", "pt", "ca"];

// ─── Per-language heuristics ────────────────────────────────────────────────

// 1. Language leakage: ES-specific tokens that should NOT appear in
//    EN/FR/DE/PT (CA shares many with ES, exclude).
const ES_LEAKAGE_TOKENS = [
  // Common ES-only function words
  /\b(?:nuestro|nuestra|nuestros|nuestras)\b/i,
  /\b(?:también|también|porque|porqué)\b/i,
  /\b(?:además|sin embargo)\b/i,
  /\b(?:fácilmente|rápidamente|legalmente)\b/i,
  /\b(?:según|aunque|mientras)\b/i,
  /\b(?:hacia|desde|hasta)\s+(?:el|la|los|las)\b/i,
];

// Avoid ES tokens that legitimately appear in other languages (España, LLC,
// IRPF, BOE, etc. are technical terms — kept as-is).

// Unicode-aware word boundary: previous/next char must NOT be a letter
// (including accented). Default JS \b only treats ASCII word chars, so it
// matches inside "êtes" → "tes" (false positive).
const NLB = "(?<![A-Za-zÀ-ÖØ-öø-ÿ])";  // negative lookbehind
const NLA = "(?![A-Za-zÀ-ÖØ-öø-ÿ])";   // negative lookahead

// 2. DE register check (must be Sie/Ihr/Ihnen formal)
//    Flag forbidden informal: du, dein/deine, dir (NOT dirigieren etc.)
const DE_INFORMAL = [
  new RegExp(`${NLB}[Dd]u${NLA}`, "g"),
  new RegExp(`${NLB}[Dd]ein(?:e|en|er|em|es)?${NLA}`, "g"),
  new RegExp(`${NLB}[Dd]ir${NLA}`, "g"),
  new RegExp(`${NLB}[Dd]ich${NLA}`, "g"),
];

// 3. FR register check (must be vous/votre)
//    Flag forbidden singular informal: tu, ton, ta, tes (singular only).
const FR_INFORMAL = [
  new RegExp(`${NLB}tu${NLA}(?!\\s+(?:peux|dois|veux|sais|fais|vois|connais|prends|comprends|trouves|attends))`, "gi"),
  new RegExp(`${NLB}ton\\s+\\w+`, "gi"),
  new RegExp(`${NLB}ta\\s+\\w+`, "gi"),
  new RegExp(`${NLB}tes\\s+\\w+`, "gi"),
];

// 4. Common false-friends / MT tells
const MT_TELLS = {
  en: [
    /\bactuality\b/i,         // "currently" should be "currently"
    /\bassist to\b/i,         // assist + to = ESL pattern
    /\bin order to be able to\b/i,  // pleonasm
    /\bsensible (?:information|data)\b/i,  // "sensitive" mistranslated
    /\b(?:must|have to) (?:realize|effectuate)\b/i,  // realize ≠ realizar
  ],
  fr: [
    /\bactuellement\b.*\bactuellement\b/i,  // overuse
    /\bnous (?:vous )?recommandons fortement\b.*\bnous (?:vous )?recommandons fortement\b/i,  // dup phrase
    /\bcomme par exemple\b/i,  // pleonasm
  ],
  de: [
    /\baktuell\b.*\baktuell\b.*\baktuell\b/i,  // 3+ "aktuell"
    /\bin Bezug auf\b.*\bin Bezug auf\b.*\bin Bezug auf\b/i,  // 3+
    /\bes ist wichtig zu beachten,?\s+dass\b.*\bes ist wichtig zu beachten,?\s+dass\b/i,
  ],
  pt: [
    /\batualmente\b.*\batualmente\b.*\batualmente\b/i,  // 3+
  ],
  ca: [
    /\bactualment\b.*\bactualment\b.*\bactualment\b/i,
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripMarkers(content) {
  const m = content.match(/export\s+default\s+`([\s\S]*)`\s*;?\s*$/);
  if (!m) return "";
  let body = m[1];
  // Strip review-anchor <li> blocks (auto-generated, contain quoted ES source
  // snippets — false positives for leakage / register checks).
  body = body.replace(/<li><span class="font-mono">[^<]*<\/span>[\s\S]*?<\/li>/g, "");
  // Strip HTML comments
  body = body.replace(/<!--[\s\S]*?-->/g, "");
  // Strip fenced code blocks
  body = body.replace(/```[\s\S]*?```/g, "");
  return body;
}

function paragraphsOf(body) {
  const blocks = body.split(/\n\s*\n/);
  return blocks.map((b) => b.trim()).filter((b) => {
    if (!b) return false;
    if (/^<!--/.test(b)) return false;
    if (b.startsWith("#")) return false;
    if (b.length < 40) return false;
    return true;
  });
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Audit ──────────────────────────────────────────────────────────────────

function loadAll() {
  const data = {}; // data[lang][slug] = body
  for (const lang of ["es", ...LANGS_NON_ES]) {
    data[lang] = {};
    const dir = join(BLOG_ROOT, lang);
    let files;
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
    } catch {
      files = [];
    }
    for (const f of files) {
      const slug = f.replace(/\.ts$/, "");
      const content = readFileSync(join(dir, f), "utf8");
      const body = stripMarkers(content);
      if (body) data[lang][slug] = body;
    }
  }
  return data;
}

function audit() {
  const all = loadAll();
  const findings = {
    leakage: [],          // {lang, slug, hits: [{pattern, sample}]}
    deRegister: [],       // {slug, hits, samples}
    frRegister: [],       // {slug, hits, samples}
    mtTells: [],          // {lang, slug, hits: [{pattern, sample}]}
    lowRatio: [],         // {lang, slug, ratio, esWords, langWords}
    untranslated: [],     // {lang, slug, count, samples}
  };

  for (const lang of LANGS_NON_ES) {
    const articles = all[lang];
    for (const slug of Object.keys(articles)) {
      const body = articles[slug];

      // 1. Language leakage — only check EN/FR/DE.
      //    PT/CA share too many Romance cognates with ES (e.g. "porque"
      //    valid in both) which generate false positives.
      if (lang === "en" || lang === "fr" || lang === "de") {
        const hits = [];
        for (const re of ES_LEAKAGE_TOKENS) {
          const m = body.match(re);
          if (m) hits.push({ pattern: re.source, sample: m[0] });
        }
        if (hits.length) findings.leakage.push({ lang, slug, count: hits.length, hits: hits.slice(0, 3) });
      }

      // 2. DE register
      if (lang === "de") {
        const samples = [];
        for (const re of DE_INFORMAL) {
          const matches = body.match(re);
          if (matches) {
            for (const m of matches.slice(0, 2)) samples.push(m);
          }
        }
        if (samples.length > 0) {
          findings.deRegister.push({ slug, count: samples.length, samples: [...new Set(samples)].slice(0, 5) });
        }
      }

      // 3. FR register
      if (lang === "fr") {
        const samples = [];
        for (const re of FR_INFORMAL) {
          const matches = body.match(re);
          if (matches) {
            for (const m of matches.slice(0, 2)) samples.push(m);
          }
        }
        if (samples.length > 0) {
          findings.frRegister.push({ slug, count: samples.length, samples: [...new Set(samples)].slice(0, 5) });
        }
      }

      // 4. MT tells per language
      const tells = MT_TELLS[lang] || [];
      const tellHits = [];
      for (const re of tells) {
        const m = body.match(re);
        if (m) tellHits.push({ pattern: re.source.slice(0, 80), sample: m[0].slice(0, 120) });
      }
      if (tellHits.length) findings.mtTells.push({ lang, slug, count: tellHits.length, hits: tellHits });

      // 5. Word-count ratio vs ES
      const esBody = all.es[slug];
      if (esBody) {
        const esW = wordCount(esBody);
        const langW = wordCount(body);
        const ratio = esW > 0 ? langW / esW : 0;
        if (ratio < 0.70 && esW > 200) {
          findings.lowRatio.push({ lang, slug, ratio: +ratio.toFixed(2), esWords: esW, langWords: langW });
        }
      }

      // 6. Untranslated paragraphs (identical to ES)
      if (esBody && lang !== "ca") {
        const esParas = new Set(paragraphsOf(esBody));
        const langParas = paragraphsOf(body);
        const same = [];
        for (const p of langParas) {
          if (esParas.has(p) && p.length > 100) same.push(p.slice(0, 100));
        }
        if (same.length) findings.untranslated.push({ lang, slug, count: same.length, samples: same.slice(0, 2) });
      }
    }
  }

  return findings;
}

const r = audit();

const summary = {
  generatedAt: new Date().toISOString(),
  languageLeakage: r.leakage.length,
  deRegisterIssues: r.deRegister.length,
  frRegisterIssues: r.frRegister.length,
  mtTells: r.mtTells.length,
  lowRatioArticles: r.lowRatio.length,
  untranslatedParagraphs: r.untranslated.length,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "blog-translation-quality-ext.json"),
  JSON.stringify({ summary, findings: r }, null, 2)
);

const md = [];
md.push("# Blog translation-quality EXTENDED audit (Bloque 7)");
md.push("");
md.push(`Generated: ${summary.generatedAt}`);
md.push("");
md.push("> REPORT-ONLY. Heuristic findings — verify each before editing.");
md.push("");
md.push("## Summary");
md.push("");
md.push(`- Language leakage (ES tokens in non-ES/CA): **${r.leakage.length}** articles`);
md.push(`- DE register issues (informal du/dein): **${r.deRegister.length}** articles`);
md.push(`- FR register issues (informal tu/ton): **${r.frRegister.length}** articles`);
md.push(`- MT tells per language: **${r.mtTells.length}** articles`);
md.push(`- Low ratio (< 0.70 vs ES, ≥200 ES words): **${r.lowRatio.length}** articles`);
md.push(`- Untranslated paragraphs (identical to ES): **${r.untranslated.length}** articles`);
md.push("");

function section(title, list, render) {
  md.push(`## ${title}`);
  md.push("");
  if (!list.length) { md.push("_None._"); md.push(""); return; }
  for (const e of list) md.push(render(e));
  md.push("");
}

section("Language leakage", r.leakage,
  (e) => `- **${e.lang}/${e.slug}** — ${e.count} hits — samples: ${e.hits.map((h) => `\`${h.sample}\``).join(", ")}`);

section("DE register (use Sie/Ihr)", r.deRegister,
  (e) => `- **de/${e.slug}** — ${e.count} informal hits — samples: ${e.samples.map((s) => `\`${s}\``).join(", ")}`);

section("FR register (use vous/votre)", r.frRegister,
  (e) => `- **fr/${e.slug}** — ${e.count} informal hits — samples: ${e.samples.map((s) => `\`${s}\``).join(", ")}`);

section("MT tells per language", r.mtTells,
  (e) => `- **${e.lang}/${e.slug}** — ${e.count} hits`);

section("Low word-count ratio (< 0.70 vs ES)", r.lowRatio,
  (e) => `- **${e.lang}/${e.slug}** — ratio ${e.ratio} (ES ${e.esWords} → ${e.lang.toUpperCase()} ${e.langWords})`);

section("Untranslated paragraphs (identical to ES)", r.untranslated,
  (e) => `- **${e.lang}/${e.slug}** — ${e.count} identical paragraphs`);

writeFileSync(join(OUT_DIR, "blog-translation-quality-ext.md"), md.join("\n") + "\n");

console.log(`[blog-translation-quality-extended] Wrote report:`);
console.log(`  - leakage: ${summary.languageLeakage} articles`);
console.log(`  - DE register: ${summary.deRegisterIssues} articles`);
console.log(`  - FR register: ${summary.frRegisterIssues} articles`);
console.log(`  - MT tells: ${summary.mtTells} articles`);
console.log(`  - low ratio: ${summary.lowRatioArticles} articles`);
console.log(`  - untranslated paragraphs: ${summary.untranslatedParagraphs} articles`);
console.log(`Output: docs/auditoria-multiidioma/blog-translation-quality-ext.{json,md}`);
