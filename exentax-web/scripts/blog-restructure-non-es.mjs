#!/usr/bin/env node
/*
 * blog-restructure-non-es.mjs — Task #15
 *
 * Re-translate the body of every (slug × non-ES lang) pair so that the H2/H3
 * tree matches the ES master (rewritten in Task #1). Each call to the LLM
 * receives:
 *   - the ES master body (skeleton authority)
 *   - the current non-ES body (to preserve voice/glossary already in use)
 *   - explicit instructions to translate H2/H3 headings + body NATIVELY
 *     (not literal), preserve markers/CTAs/Sources block, match heading count.
 *
 * Idempotent: a checkpoint file (.local/blog-restructure-checkpoint.json)
 * tracks every (slug, lang) already processed and validated. Re-runs skip
 * those entries unless --force is passed.
 *
 * Provider auto-detection:
 *   - ANTHROPIC_API_KEY  → Anthropic Messages API (default model: claude-sonnet-4-5)
 *   - OPENAI_API_KEY     → OpenAI Chat Completions  (default model: gpt-4o-mini)
 * Override via --provider {anthropic|openai} and --model <name>.
 *
 * Usage:
 *   node scripts/blog-restructure-non-es.mjs                 # all pending
 *   node scripts/blog-restructure-non-es.mjs --lang en       # one lang
 *   node scripts/blog-restructure-non-es.mjs --slug xyz      # one slug
 *   node scripts/blog-restructure-non-es.mjs --limit 10      # first N pending
 *   node scripts/blog-restructure-non-es.mjs --dry-run       # show plan, no writes
 *   node scripts/blog-restructure-non-es.mjs --force         # ignore checkpoint
 *
 * Cost / scale: ~505 articles × ~3-5K chars each ≈ 8M chars per lang ≈ 40M
 * total. Always start with --limit 5 to validate quality before fan-out.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(ROOT, "..");
const CONTENT_DIR = resolve(ROOT, "client/src/data/blog-content");
const CHECKPOINT = resolve(REPO_ROOT, ".local/blog-restructure-checkpoint.json");
const LANGS = ["en", "fr", "de", "pt", "ca"];
const LANG_NAMES = {
  en: "English",
  fr: "French (français)",
  de: "German (Deutsch)",
  pt: "Portuguese (português europeu, with Brazilian fallbacks)",
  ca: "Catalan (català)",
};

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (k) => argv.includes(`--${k}`);
const opt = (k, d = null) => {
  const i = argv.indexOf(`--${k}`);
  return i === -1 ? d : argv[i + 1];
};

const ONLY_LANG = opt("lang");
const ONLY_SLUG = opt("slug");
const LIMIT = opt("limit") ? parseInt(opt("limit"), 10) : Infinity;
const DRY_RUN = flag("dry-run");
const FORCE = flag("force");
const PROVIDER = opt("provider", process.env.ANTHROPIC_API_KEY ? "anthropic" : "openai");
const MODEL = opt("model", PROVIDER === "anthropic" ? "claude-sonnet-4-5" : "gpt-4o-mini");

// ---------------------------------------------------------------------------
// Provider check
// ---------------------------------------------------------------------------
if (!DRY_RUN) {
  if (PROVIDER === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY (or pass --provider openai).");
    process.exit(2);
  }
  if (PROVIDER === "openai" && !process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY (or pass --provider anthropic).");
    process.exit(2);
  }
}

// ---------------------------------------------------------------------------
// Checkpoint
// ---------------------------------------------------------------------------
function loadCheckpoint() {
  if (!existsSync(CHECKPOINT)) return { done: {}, errors: {}, startedAt: new Date().toISOString() };
  try { return JSON.parse(readFileSync(CHECKPOINT, "utf8")); }
  catch { return { done: {}, errors: {}, startedAt: new Date().toISOString() }; }
}
function saveCheckpoint(cp) {
  mkdirSync(dirname(CHECKPOINT), { recursive: true });
  writeFileSync(CHECKPOINT, JSON.stringify(cp, null, 2));
}
const CP = loadCheckpoint();
const cpKey = (slug, lang) => `${lang}/${slug}`;

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------
function readArticle(lang, slug) {
  const p = resolve(CONTENT_DIR, lang, `${slug}.ts`);
  if (!existsSync(p)) return null;
  const raw = readFileSync(p, "utf8");
  const m = raw.match(/^([\s\S]*?export\s+default\s+`)([\s\S]*)(`\s*;?\s*)$/);
  if (!m) return null;
  return {
    path: p,
    prefix: m[1],
    body: m[2].replace(/\\`/g, "`").replace(/\\\$/g, "$").replace(/\\\\/g, "\\"),
    suffix: m[3],
  };
}
function writeArticle(art, newBody) {
  const escaped = newBody.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  writeFileSync(art.path, art.prefix + escaped + art.suffix);
}

// ---------------------------------------------------------------------------
// Structural extraction
// ---------------------------------------------------------------------------
function countHeadings(body) {
  return {
    h2: (body.match(/^##\s+/gm) || []).length,
    h3: (body.match(/^###\s+/gm) || []).length,
  };
}
function extractHeadings(body) {
  const out = [];
  for (const line of body.split(/\r?\n/)) {
    const m2 = line.match(/^##\s+(.+)$/);
    const m3 = line.match(/^###\s+(.+)$/);
    if (m2) out.push({ level: 2, text: m2[1].trim() });
    else if (m3) out.push({ level: 3, text: m3[1].trim() });
  }
  return out;
}
function hasMarker(body) {
  return /<!--\s*exentax:calc-cta-v1\s*-->/.test(body)
      && /<!--\s*\/exentax:calc-cta-v1\s*-->/.test(body);
}
function ctaCount(body, lang) {
  const ag = new RegExp(`href="/${lang}/(agendar|book|reservar|reserver|reserva)`, "g");
  const ca = new RegExp(`href="/${lang}/(calculadora|calculator|calculatrice|rechner)`, "g");
  return {
    booking: (body.match(ag) || []).length,
    calc: (body.match(ca) || []).length,
  };
}
function headingSequence(body) {
  // Sequence of levels (2 or 3) in document order — used for tree parity.
  const seq = [];
  for (const line of body.split(/\r?\n/)) {
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) seq.push(2);
    else if (/^###\s+/.test(line)) seq.push(3);
  }
  return seq;
}
function extractSourcesBlock(body) {
  // Heuristic: from the last heading whose text matches Sources/Fuentes/Quellen/Fontes/Fonts to EOF.
  const re = /(^##\s+(?:sources|fuentes|fontes|quellen|sources?|fonts)\b[\s\S]*$)/im;
  const m = body.match(re);
  return m ? m[1].trim() : null;
}
function extractInternalBlogLinks(body, lang) {
  const re = new RegExp(`/${lang}/blog/[a-z0-9-]+`, "g");
  return Array.from(new Set(body.match(re) || []));
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------
function buildPrompt(slug, lang, esBody, currentBody) {
  const esHeadings = extractHeadings(esBody)
    .map(h => `${"#".repeat(h.level)} ${h.text}`).join("\n");
  return `You are a senior bilingual editor for Exentax (a Spanish tax-advisory firm specialising in US LLCs for European residents). You are restructuring a blog article.

TASK: Rewrite the ${LANG_NAMES[lang]} version of the article so its H2/H3 tree matches the SPANISH MASTER exactly. Translate natively (idiomatic, not literal). Preserve the existing voice, terminology and tone of the current ${LANG_NAMES[lang]} version where possible.

HARD CONSTRAINTS (the output WILL be validated programmatically — failure means the file is rejected):
1. The output body must start at the first character of the article and end at the last (no \`export default\` wrapper, no backticks).
2. Heading count must match the ES master exactly: ${countHeadings(esBody).h2} H2 and ${countHeadings(esBody).h3} H3.
3. Heading order must mirror the ES master 1:1 (first heading in output = translation of first ES heading, etc.).
4. Preserve the exentax:calc-cta-v1 marker block intact (HTML comment open + blockquote + HTML comment close).
5. Preserve exactly 2 CTA links: one to /${lang}/${{en:"book",fr:"reserver",de:"book",pt:"agendar",ca:"reserva"}[lang] || "agendar"} (or whatever localized booking slug the current version already uses) and one to /${lang}/${{en:"calculator",fr:"calculatrice",de:"rechner",pt:"calculator",ca:"calculator"}[lang] || "calculadora"} (or whatever localized calculator slug the current version uses). Reuse the SAME paths the current version uses — do not invent new ones.
6. If the current version has a "Sources" / "Fuentes" / "Quellen" / "Sources" / "Fontes" / "Fonts" section at the bottom with external URLs, preserve that block verbatim at the end.
7. Internal links of the form /${lang}/blog/<slug> in the current version must be preserved verbatim.
8. Output must be ≥ 3000 characters.
9. Output ONLY the article body. No preface, no markdown fence, no commentary.

ES MASTER HEADING SKELETON (translate these into ${LANG_NAMES[lang]} preserving meaning + order):
${esHeadings}

ES MASTER FULL BODY (the structural authority — match its sections and depth):
\`\`\`
${esBody}
\`\`\`

CURRENT ${LANG_NAMES[lang].toUpperCase()} VERSION (preserve its localized terminology, CTA paths, internal links and Sources block):
\`\`\`
${currentBody}
\`\`\`

Now produce the rewritten ${LANG_NAMES[lang]} body.`;
}

// ---------------------------------------------------------------------------
// LLM callers
// ---------------------------------------------------------------------------
async function callAnthropic(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.content?.[0]?.text || "";
}
async function callOpenAI(prompt) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content || "";
}
async function llm(prompt) {
  // exponential backoff on transient errors
  let delay = 2000;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const out = PROVIDER === "anthropic" ? await callAnthropic(prompt) : await callOpenAI(prompt);
      // strip optional fences
      return out.replace(/^```[a-z]*\n?/i, "").replace(/```\s*$/, "").trim();
    } catch (e) {
      if (attempt === 5) throw e;
      const msg = String(e.message || e);
      if (!/(429|5\d\d|timeout|ECONN)/i.test(msg)) throw e;
      console.warn(`  retry ${attempt} after ${delay}ms: ${msg.slice(0, 120)}`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
  throw new Error("unreachable");
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function validate(newBody, esBody, currentBody, lang) {
  const errs = [];
  // 1. Heading count parity (cheap pre-check; final QA gate uses these too).
  const want = countHeadings(esBody);
  const got = countHeadings(newBody);
  if (got.h2 !== want.h2) errs.push(`H2 ${got.h2} vs ${want.h2}`);
  if (got.h3 !== want.h3) errs.push(`H3 ${got.h3} vs ${want.h3}`);
  // 2. Heading SEQUENCE parity (level-by-level tree match, not just totals).
  const wantSeq = headingSequence(esBody);
  const gotSeq = headingSequence(newBody);
  if (wantSeq.join("-") !== gotSeq.join("-")) {
    errs.push(`heading sequence mismatch (es=[${wantSeq.join(",")}] vs new=[${gotSeq.join(",")}])`);
  }
  // 3. Calc-CTA marker block intact.
  if (!hasMarker(newBody)) errs.push("missing calc-cta-v1 marker");
  // 4. Exactly one booking CTA + exactly one calculator CTA (canonical pair).
  const cta = ctaCount(newBody, lang);
  if (cta.booking !== 1) errs.push(`booking CTA count=${cta.booking} (need 1)`);
  if (cta.calc !== 1) errs.push(`calculator CTA count=${cta.calc} (need 1)`);
  // 5. Sources block preserved if present in current version.
  const curSrc = extractSourcesBlock(currentBody);
  if (curSrc && !extractSourcesBlock(newBody)) {
    errs.push("Sources block lost (was present in current version)");
  }
  // 6. Internal blog links preserved (no /lang/blog/<slug> dropped).
  const curLinks = extractInternalBlogLinks(currentBody, lang);
  const newLinks = new Set(extractInternalBlogLinks(newBody, lang));
  const dropped = curLinks.filter(l => !newLinks.has(l));
  if (dropped.length) errs.push(`internal blog links dropped: ${dropped.slice(0, 3).join(", ")}${dropped.length > 3 ? " +" + (dropped.length - 3) : ""}`);
  // 7. Length floor.
  if (newBody.length < 3000) errs.push(`length=${newBody.length} (<3000)`);
  return errs;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const ES_SLUGS = readdirSync(resolve(CONTENT_DIR, "es"))
  .filter(f => f.endsWith(".ts"))
  .map(f => f.replace(/\.ts$/, ""))
  .sort();

// Build pending queue: (slug, lang) where ES/non-ES H2 or H3 counts differ
const pending = [];
for (const slug of ES_SLUGS) {
  if (ONLY_SLUG && slug !== ONLY_SLUG) continue;
  const es = readArticle("es", slug);
  if (!es) continue;
  const esC = countHeadings(es.body);
  for (const lang of LANGS) {
    if (ONLY_LANG && lang !== ONLY_LANG) continue;
    if (!FORCE && CP.done[cpKey(slug, lang)]) continue;
    const cur = readArticle(lang, slug);
    if (!cur) continue;
    const cC = countHeadings(cur.body);
    const sameCount = cC.h2 === esC.h2 && cC.h3 === esC.h3;
    const sameSeq = headingSequence(cur.body).join("-") === headingSequence(es.body).join("-");
    if (sameCount && sameSeq) {
      // already in parity (counts AND sequence) → record as done
      CP.done[cpKey(slug, lang)] = { skipped: "already-in-parity", at: new Date().toISOString() };
      continue;
    }
    pending.push({ slug, lang, es, cur });
  }
}
saveCheckpoint(CP);

console.log(`Provider: ${PROVIDER} · Model: ${MODEL}`);
console.log(`Pending: ${pending.length} (limit ${LIMIT === Infinity ? "∞" : LIMIT})`);
if (DRY_RUN) {
  for (const p of pending.slice(0, 30)) console.log(`  ${p.lang}/${p.slug}`);
  if (pending.length > 30) console.log(`  …+${pending.length - 30}`);
  process.exit(0);
}

let processed = 0, ok = 0, fail = 0;
for (const item of pending) {
  if (processed >= LIMIT) break;
  processed++;
  const { slug, lang, es, cur } = item;
  process.stdout.write(`[${processed}/${Math.min(pending.length, LIMIT)}] ${lang}/${slug} … `);
  try {
    const prompt = buildPrompt(slug, lang, es.body, cur.body);
    const out = await llm(prompt);
    const errs = validate(out, es.body, cur.body, lang);
    if (errs.length) {
      // one auto-retry with explicit error feedback
      const retryPrompt = prompt + `\n\nPREVIOUS ATTEMPT FAILED VALIDATION: ${errs.join("; ")}. Fix and retry.`;
      const out2 = await llm(retryPrompt);
      const errs2 = validate(out2, es.body, cur.body, lang);
      if (errs2.length) {
        fail++;
        CP.errors[cpKey(slug, lang)] = { errs: errs2, at: new Date().toISOString() };
        saveCheckpoint(CP);
        console.log(`FAIL (${errs2.join("; ")})`);
        continue;
      }
      writeArticle(cur, out2);
    } else {
      writeArticle(cur, out);
    }
    ok++;
    CP.done[cpKey(slug, lang)] = { at: new Date().toISOString(), model: MODEL };
    delete CP.errors[cpKey(slug, lang)];
    saveCheckpoint(CP);
    console.log("ok");
  } catch (e) {
    fail++;
    CP.errors[cpKey(slug, lang)] = { errs: [String(e.message || e)], at: new Date().toISOString() };
    saveCheckpoint(CP);
    console.log(`ERROR (${String(e.message || e).slice(0, 100)})`);
  }
}

console.log(`\nDone. ok=${ok} fail=${fail} processed=${processed}/${pending.length}`);
console.log(`Checkpoint: ${CHECKPOINT}`);
console.log(`Next: npm run blog:final-qa  → expect 'Structural deltas vs ES: 0' once all pending are processed.`);
