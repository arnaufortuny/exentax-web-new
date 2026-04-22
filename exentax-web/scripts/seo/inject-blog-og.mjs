#!/usr/bin/env node
/**
 * Generate explicit, DISTINCT-from-meta ogTitle (≤60) and ogDescription
 * (120–160) for every blog post in every supported language and inject
 * them into:
 *   - client/src/data/blog-posts.ts          (Spanish master, multi-line entries)
 *   - client/src/data/blog-i18n/<lang>.ts    (en/fr/de/pt/ca, single-line entries)
 *
 * Source of truth:
 *   ogTitle       ⇐ post.title      (different from metaTitle by editorial design)
 *   ogDescription ⇐ post.excerpt    (different from metaDescription)
 *
 * Both fields are validated to differ from the corresponding meta field; on
 * accidental collision a per-language brand tail is appended/prepended so
 * social copy never duplicates SEO copy.
 *
 * Tail clauses are appended only when they fit *whole* into the [120,160]
 * window. The algorithm never truncates a tail mid-word.
 *
 * The script is destructive: existing ogTitle/ogDescription field values
 * are overwritten so re-runs converge on the latest tail pools.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const BP = join(ROOT, "client/src/data/blog-posts.ts");
const I18N = join(ROOT, "client/src/data/blog-i18n");
const LANGS_I18N = ["en", "fr", "de", "pt", "ca"];

// Per-language tail pools, sorted from short to long. Each tail is a
// fully-formed sentence — they are *never* truncated mid-word, the picker
// only appends one whole tail (or combines two whole tails) that fits.
const TAILS = {
  es: [
    " Habla con Exentax.",
    " Exentax te asesora.",
    " Asesoría Exentax LLC.",
    " Reserva 30 min con Exentax.",
    " Exentax: tu LLC en 48 h.",
    " Asesoría fiscal Exentax para tu LLC en EE. UU.",
    " Reserva 30 min con un asesor fiscal Exentax.",
    " Exentax: tu LLC americana operativa en 48 horas.",
    " Consultores fiscales Exentax para LLC no residentes.",
    " Exentax acompaña tu LLC del diagnóstico al día a día.",
  ],
  en: [
    " Talk to Exentax.",
    " Exentax tax advisors.",
    " Exentax: LLC done right.",
    " Book a free 30-min call.",
    " Exentax: US LLC in 48 h.",
    " Talk to an Exentax tax advisor for 30 minutes free.",
    " Exentax: tax-led LLC setup, banking and compliance.",
    " Exentax tax advisors for non-resident LLC owners.",
    " End-to-end Exentax support for your US LLC formation.",
    " Exentax: your US LLC ready in 48 hours, no surprises.",
  ],
  fr: [
    " Parlez à Exentax.",
    " Exentax, conseil fiscal.",
    " Exentax : LLC clé en main.",
    " 30 min offertes Exentax.",
    " Exentax : LLC en 48 h.",
    " Échangez 30 min avec un conseiller fiscal Exentax.",
    " Exentax : création, banque et conformité de votre LLC.",
    " Exentax accompagne votre LLC du diagnostic au quotidien.",
    " Cabinet fiscal Exentax pour LLC américaines non-résidents.",
    " Exentax : votre LLC américaine opérationnelle en 48 h.",
  ],
  de: [
    " Sprechen Sie mit Exentax.",
    " Exentax: Steuerberatung.",
    " Exentax: LLC kompakt.",
    " 30-Min-Beratung Exentax.",
    " Exentax: US-LLC in 48 h.",
    " Sprechen Sie 30 Minuten mit einem Exentax-Steuerberater.",
    " Exentax: Gründung, Banking und Compliance Ihrer LLC.",
    " Exentax begleitet Ihre LLC von der Diagnose bis zum Alltag.",
    " Exentax-Steuerberater für nicht-ansässige LLC-Inhaber.",
    " Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
  ],
  pt: [
    " Fale com a Exentax.",
    " Consultoria Exentax LLC.",
    " Exentax: LLC chave-na-mão.",
    " 30 min grátis Exentax.",
    " Exentax: LLC em 48 h.",
    " Fale 30 min com um consultor fiscal da Exentax.",
    " Exentax: constituição, banca e compliance da sua LLC.",
    " Exentax acompanha a sua LLC do diagnóstico ao dia a dia.",
    " Consultores fiscais Exentax para LLC não residentes.",
    " Exentax: a sua LLC americana operacional em 48 horas.",
  ],
  ca: [
    " Parla amb Exentax.",
    " Assessoria Exentax LLC.",
    " Exentax: LLC clau en mà.",
    " 30 min gratis amb Exentax.",
    " Exentax: LLC en 48 h.",
    " Parla 30 min amb un assessor fiscal d'Exentax.",
    " Exentax: constitució, banca i compliance de la teva LLC.",
    " Exentax acompanya la teva LLC del diagnòstic al dia a dia.",
    " Assessors fiscals Exentax per a propietaris de LLC.",
    " Exentax: la teva LLC americana operativa en 48 hores.",
  ],
};

const BRAND_SUFFIX = {
  es: " | Exentax",
  en: " | Exentax",
  fr: " | Exentax",
  de: " | Exentax",
  pt: " | Exentax",
  ca: " | Exentax",
};

const MIN = 120;
const MAX = 160;
const TARGET_HIGH = 158;
const TITLE_MAX = 60;

function truncateAtWord(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const sp = slice.lastIndexOf(" ");
  // Always prefer the last word boundary, even if it is below 60% of `max`.
  // Cutting mid-word produces stubs like "Leitfa" which look broken.
  const safe = sp > 0 ? slice.slice(0, sp) : slice;
  // Drop trailing partial-escape or punctuation residue.
  return safe.replace(/[.,;:\s\\]+$/, "");
}

// Per-language trailing stop words (articles, prepositions, conjunctions)
// that must NEVER be the last token of a truncated title — leaving them
// produces awkward dangling endings like "guia per a no residents el".
const TRAIL_STOPWORDS = {
  es: new Set(["a","ante","bajo","con","de","del","desde","el","la","las","lo","los","en","entre","hacia","hasta","para","por","según","sin","sobre","tras","y","e","o","u","ni","que","una","un","unos","unas","mi","tu","su","al","como","si","es","ser"]),
  en: new Set(["a","an","the","of","for","to","in","on","at","by","with","from","and","or","but","as","is","be","into","onto","via","over","under","than","then"]),
  fr: new Set(["le","la","les","un","une","des","de","du","au","aux","à","en","dans","sur","sous","par","pour","avec","sans","et","ou","mais","que","qui","ce","cet","cette","ces","est"]),
  de: new Set(["der","die","das","ein","eine","einen","einem","einer","den","dem","des","von","zu","zum","zur","im","in","an","am","auf","aus","bei","mit","nach","über","unter","und","oder","aber","für","ist","sind"]),
  pt: new Set(["a","o","as","os","um","uma","uns","umas","de","do","da","dos","das","em","no","na","nos","nas","para","por","com","sem","e","ou","mas","que","se","é"]),
  ca: new Set(["el","la","els","les","un","una","uns","unes","de","del","dels","des","a","al","als","en","amb","sense","per","i","o","però","que","si","és","ser","ha","han","fins","cap","com","des","sota","sobre"]),
};

function endsWithStopword(text, lang) {
  const m = text.trim().match(/([\p{L}\p{N}']+)\s*$/u);
  if (!m) return false;
  const last = m[1].toLowerCase();
  return (TRAIL_STOPWORDS[lang] || new Set()).has(last);
}

function dropTrailingStopwords(text, lang) {
  let t = text.trim().replace(/[.,;:\-–—\s\\]+$/, "");
  // Strip an orphan unclosed opening paren / bracket left behind by truncation.
  const stripOrphanOpener = (s) => {
    const opens = (s.match(/[\(\[]/g) || []).length;
    const closes = (s.match(/[\)\]]/g) || []).length;
    if (opens > closes) {
      // Drop the trailing fragment from the last unmatched opener.
      const lastOpen = Math.max(s.lastIndexOf("("), s.lastIndexOf("["));
      if (lastOpen > -1) return s.slice(0, lastOpen).trim().replace(/[.,;:\-–—\s\\]+$/, "");
    }
    return s;
  };
  t = stripOrphanOpener(t);
  while (endsWithStopword(t, lang)) {
    t = t.replace(/\s*[\p{L}\p{N}']+\s*$/u, "").replace(/[.,;:\-–—\s\\]+$/, "");
    if (!t) break;
    t = stripOrphanOpener(t);
  }
  return t;
}

function truncateTitleAtClause(text, max, lang) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  // Prefer cutting before an opening paren / colon / question mark so the
  // shortened title still reads as a complete thought.
  const cleanStops = [/\s*\([^)]*$/, /\s*\?\s/, /\s*:\s/];
  for (const re of cleanStops) {
    const idx = slice.search(re);
    if (idx > Math.floor(max * 0.5)) {
      const cut = slice.slice(0, idx).replace(/[.,;:\s\\]+$/, "");
      return dropTrailingStopwords(cut, lang);
    }
  }
  return dropTrailingStopwords(truncateAtWord(text, max), lang);
}

function buildBase(text) {
  return (text || "").trim().replace(/[\s.]+$/, "") + ".";
}

function pickTail(base, lang) {
  const tails = TAILS[lang] || TAILS.en;
  let best = null;
  for (const tail of tails) {
    const cand = base + tail;
    if (cand.length <= MAX) {
      if (!best || Math.abs(TARGET_HIGH - cand.length) < Math.abs(TARGET_HIGH - best.length)) {
        best = cand;
      }
    }
  }
  return best;
}

// Strip trailing ellipsis / mid-source horizontal-ellipsis residue so the
// generator never inherits a "…" from the raw post.title or post.excerpt.
function normalizeSource(text) {
  if (!text) return "";
  return String(text)
    .replace(/[\u2026]/g, ".")   // … → .
    .replace(/\.{3,}/g, ".")      // ... → .
    .replace(/\s+\./g, ".")       // " ." → "."
    .replace(/\.{2,}/g, ".")      // ".." → "."
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:\s]+$/, "");
}

// Find a sentence-complete prefix of `text` whose length is ≤ max. Walks
// punctuation boundaries (`.` `!` `?`) and falls back to clause boundaries
// (`;` `:` `,`) which are converted to a final period. Returns "" if no
// reasonable boundary exists above 60% of `max`.
function trimToCompleteSentence(text, max, lang) {
  const slice = text.slice(0, max);
  const minAccept = Math.floor(max * 0.6);
  // Prefer hard sentence stops.
  const hard = slice.match(/.*[.!?](?=\s|$)/s);
  if (hard && hard[0].length >= minAccept) {
    return dropTrailingStopwords(hard[0].trim().replace(/[.,;:]+$/, ""), lang) + ".";
  }
  // Fall back to clause stops; convert the boundary to a period.
  const clause = slice.match(/.*[;:,](?=\s|$)/s);
  if (clause && clause[0].length >= minAccept) {
    return dropTrailingStopwords(clause[0].trim().replace(/[.,;:]+$/, ""), lang) + ".";
  }
  return "";
}

function ensureSentencePunctuation(text) {
  const t = (text || "").trim();
  if (!t) return t;
  if (/[.!?\)\u201D"]\s*$/.test(t)) return t;
  return t + ".";
}

function padDesc(rawText, metaDesc, lang) {
  const t = normalizeSource(rawText);
  const meta = normalizeSource(metaDesc);
  // Always force a tail when text equals the meta description, even if length is in window.
  const mustDistinct = t === meta;
  if (!mustDistinct && t.length >= MIN && t.length <= MAX && !endsWithStopword(t, lang)) {
    const finished = ensureSentencePunctuation(t);
    if (finished.length <= MAX) return finished;
    // adding the period overflowed → fall through to truncation logic below
  }

  if (t.length > MAX) {
    // Prefer a sentence-complete cut; fall back to a clause cut promoted
    // to a period. Never emit a trailing ellipsis.
    const trimmed = trimToCompleteSentence(t, MAX, lang);
    if (trimmed && trimmed.length >= MIN) return trimmed;
    // Try a word cut at MAX-1; orphan-paren stripping may shorten it.
    const wc = dropTrailingStopwords(truncateAtWord(t, MAX - 1), lang);
    const wcDone = wc.replace(/[.,;:]+$/, "") + ".";
    if (wcDone.length >= MIN) return wcDone;
    // wc collapsed below MIN (e.g. truncation cut inside an unmatched
    // parenthesis and the orphan was stripped). Treat the cut text as a
    // new base and pad it with a brand-voice tail to land in window.
    const base2 = buildBase(wc.replace(/[.,;:]+$/, ""));
    const padded2 = pickTail(base2, lang);
    if (padded2 && padded2.length >= MIN && padded2.length <= MAX) return padded2;
    // Couldn't pad — also try tighter sentence trim and pad it.
    const altBase = trimmed ? buildBase(trimmed.replace(/[.,;:]+$/, "")) : base2;
    const altPadded = pickTail(altBase, lang);
    if (altPadded && altPadded.length >= MIN && altPadded.length <= MAX) return altPadded;
    return wcDone; // last-resort, may be < MIN — validator will surface it
  }
  const base = buildBase(t);
  const padded = pickTail(base, lang);
  if (padded && padded.length >= MIN) return padded;

  // Fallback: combine two tails if base + longest tail is still under MIN.
  const tails = TAILS[lang] || TAILS.en;
  const longest = tails.reduce((a, b) => (a.length >= b.length ? a : b));
  let combined = base + longest;
  if (combined.length < MIN) {
    for (const t2 of tails) {
      const c = combined + t2;
      if (c.length <= MAX) {
        combined = c;
        if (combined.length >= MIN) return combined;
      }
    }
  }
  if (combined.length > MAX) {
    const trimmed = trimToCompleteSentence(combined, MAX, lang);
    combined = trimmed || (dropTrailingStopwords(truncateAtWord(combined, MAX - 1), lang).replace(/[.,;:]+$/, "") + ".");
  }
  return combined;
}

function deriveOgTitle(rawTitle, metaTitle, lang) {
  const metaRaw = normalizeSource(metaTitle);
  const metaStripped = metaRaw.replace(/\s*[\|·—–-]\s*Exentax\s*$/i, "").trim();
  let base = normalizeSource(rawTitle);
  if (!base) base = metaStripped;
  base = base.replace(/\s*[\|·—–-]\s*Exentax\s*$/i, "").trim();
  const suffix = BRAND_SUFFIX[lang] || " | Exentax";

  // Build a list of candidate strategies in priority order; pick the first
  // that satisfies length, stopword, and distinctness constraints.
  const candidates = [];

  // 1) Raw title if it fits.
  if (base.length <= TITLE_MAX) candidates.push(base);

  // 2) Clean clause-boundary cut.
  if (base.length > TITLE_MAX) {
    candidates.push(truncateTitleAtClause(base, TITLE_MAX, lang));
  }

  // 3) Plain word-boundary cut, stop-word safe.
  if (base.length > TITLE_MAX) {
    candidates.push(dropTrailingStopwords(truncateAtWord(base, TITLE_MAX), lang));
  }

  // 5) metaTitle with brand suffix appended (forces distinctness vs metaTitle
  //    if metaTitle does not already carry the brand).
  if (metaStripped) {
    const withBrand = metaStripped + suffix;
    if (withBrand.length <= TITLE_MAX) candidates.push(withBrand);
  }

  // 5b) Truncated metaTitle + brand suffix — useful when metaStripped+suffix
  //     overflows TITLE_MAX (raw post.title equals metaTitle and both fit raw,
  //     so without this we have no distinct candidate).
  if (metaStripped && metaStripped.length + suffix.length > TITLE_MAX) {
    const room = TITLE_MAX - suffix.length;
    const cut = dropTrailingStopwords(truncateAtWord(metaStripped, room), lang);
    if (cut && cut.length >= 15) candidates.push(cut + suffix);
  }

  // 6) Bare metaTitle as ultimate fallback (only kept if distinct).
  if (metaStripped && metaStripped.length <= TITLE_MAX) candidates.push(metaStripped);

  for (const c0 of candidates) {
    if (!c0) continue;
    const c = dropTrailingStopwords(c0, lang).trim();
    if (c.length < 20 || c.length > TITLE_MAX) continue;
    if (endsWithStopword(c, lang)) continue;
    // Distinctness is required only against the literal metaTitle field.
    // When metaRaw carries " | Exentax" and the candidate equals metaStripped,
    // they are different strings — that is acceptable and persuasive.
    if (c === metaRaw.trim()) continue;
    return c;
  }
  // Absolute last resort: take metaStripped (already distinct from a
  // brand-suffixed metaRaw) and truncate it to fit if needed.
  const room = TITLE_MAX;
  const fall = metaStripped.length <= room ? metaStripped : truncateAtWord(metaStripped, room);
  return dropTrailingStopwords(fall, lang);
}

// Convert a captured TS-string-literal payload into raw text (so length and
// truncation operate on real characters), then back to a TS-string-literal
// payload on output.
function unescapeLit(s) {
  return s.replace(/\\(.)/g, (_, c) => {
    if (c === "n") return "\n";
    if (c === "t") return "\t";
    return c;
  });
}
function escapeQuotes(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// --------- blog-posts.ts (multi-line ES entries) ----------
function processBlogPostsTs() {
  const src = readFileSync(BP, "utf8");
  const lines = src.split("\n");
  let injected = 0;
  let updated = 0;

  // Identify entry block boundaries by `id:` / `slug:` lines and braces.
  // Scan for metaTitle as anchor; collect surrounding fields.
  for (let i = 0; i < lines.length; i++) {
    const mt = lines[i].match(/^(\s*)metaTitle:\s*"((?:[^"\\]|\\.)*)",?\s*$/);
    if (!mt) continue;
    const indent = mt[1];

    // Look up to 30 lines back for `title:` and `excerpt:` within the same block.
    let title = null;
    let excerpt = null;
    for (let k = i - 1; k >= Math.max(0, i - 30); k--) {
      if (/^\s*\}\s*,?\s*$/.test(lines[k])) break; // crossed into previous entry
      const tt = lines[k].match(/^\s*title:\s*"((?:[^"\\]|\\.)*)",?\s*$/);
      if (tt && title === null) title = unescapeLit(tt[1]);
      const ex = lines[k].match(/^\s*excerpt:\s*"((?:[^"\\]|\\.)*)",?\s*$/);
      if (ex && excerpt === null) excerpt = unescapeLit(ex[1]);
    }

    // Look forward up to 10 lines for metaDescription / ogTitle / ogDescription.
    let mdIdx = -1;
    let metaDesc = "";
    let ogIdx = -1;
    let ogdIdx = -1;
    for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
      if (/^\s*\}\s*,?\s*$/.test(lines[j])) break;
      const md = lines[j].match(/^\s*metaDescription:\s*"((?:[^"\\]|\\.)*)",?\s*$/);
      if (md && mdIdx < 0) {
        mdIdx = j;
        metaDesc = unescapeLit(md[1]);
      }
      if (/^\s*ogTitle:/.test(lines[j])) ogIdx = j;
      if (/^\s*ogDescription:/.test(lines[j])) ogdIdx = j;
    }
    if (mdIdx < 0) continue;

    const ogTitle = deriveOgTitle(title, unescapeLit(mt[2]), "es");
    const ogDesc = padDesc(excerpt, metaDesc, "es");
    const ogTitleLine = `${indent}ogTitle: "${escapeQuotes(ogTitle)}",`;
    const ogDescLine = `${indent}ogDescription: "${escapeQuotes(ogDesc)}",`;

    if (ogIdx >= 0 && ogdIdx >= 0) {
      lines[ogIdx] = ogTitleLine;
      lines[ogdIdx] = ogDescLine;
      updated++;
    } else {
      // Insert immediately after metaDescription line.
      lines.splice(mdIdx + 1, 0, ogTitleLine, ogDescLine);
      injected++;
    }
  }

  writeFileSync(BP, lines.join("\n"), "utf8");
  console.log(`[blog-posts.ts] injected=${injected}, updated=${updated}`);
}

// --------- blog-i18n/<lang>.ts (single-line entries) ----------
function processBlogI18n(lang) {
  const file = join(I18N, `${lang}.ts`);
  let src = readFileSync(file, "utf8");
  const lines = src.split("\n");
  let injected = 0;
  let updated = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("metaTitle:")) continue;
    const ttRe = /title:\s*"((?:[^"\\]|\\.)*)"/;
    const exRe = /excerpt:\s*"((?:[^"\\]|\\.)*)"/;
    const mtRe = /metaTitle:\s*"((?:[^"\\]|\\.)*)"/;
    const mdRe = /metaDescription:\s*"((?:[^"\\]|\\.)*)"/;
    const ttMatch = line.match(ttRe);
    const exMatch = line.match(exRe);
    const mtMatch = line.match(mtRe);
    const mdMatch = line.match(mdRe);
    if (!mtMatch || !mdMatch || !ttMatch || !exMatch) continue;

    const title = unescapeLit(ttMatch[1]);
    const excerpt = unescapeLit(exMatch[1]);
    const metaTitle = unescapeLit(mtMatch[1]);
    const metaDesc = unescapeLit(mdMatch[1]);
    const ogTitle = deriveOgTitle(title, metaTitle, lang);
    const ogDesc = padDesc(excerpt, metaDesc, lang);
    const ogPair = `, ogTitle: "${escapeQuotes(ogTitle)}", ogDescription: "${escapeQuotes(ogDesc)}"`;

    // Strip any existing ogTitle/ogDescription pair (in any order, anywhere in the line).
    let cleaned = line
      .replace(/,\s*ogTitle:\s*"(?:[^"\\]|\\.)*"/g, "")
      .replace(/,\s*ogDescription:\s*"(?:[^"\\]|\\.)*"/g, "");
    const hadOg = cleaned.length !== line.length;

    // Insert immediately after the metaDescription field.
    const newMd = cleaned.match(mdRe);
    const mdEnd = cleaned.indexOf(newMd[0]) + newMd[0].length;
    lines[i] = cleaned.slice(0, mdEnd) + ogPair + cleaned.slice(mdEnd);
    if (hadOg) updated++;
    else injected++;
  }

  writeFileSync(file, lines.join("\n"), "utf8");
  console.log(`[blog-i18n/${lang}.ts] injected=${injected}, updated=${updated}`);
}

processBlogPostsTs();
for (const l of LANGS_I18N) processBlogI18n(l);
console.log("Done.");
