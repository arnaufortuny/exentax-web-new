#!/usr/bin/env node
/**
 * audit-conversion-112x6.mjs
 *
 * Read-only conversion-grade audit across the 112 blog articles × 6
 * languages (es / en / fr / de / pt / ca = 672 article files). Mirrors
 * the contracts established by the archived Task #5 pass
 * (`scripts/archive/2026-04-task4/audit-2026-04-cta-conversion.mjs`)
 * but never mutates an article body — it only inspects, tallies, and
 * writes a CSV + markdown report.
 *
 * Entrypoint: `npm run audit:conversion`
 *
 * Contracts evaluated per (slug, lang) in this order:
 *   1. Calculator block (`<!-- exentax:calc-cta-v1 -->`, `Exentax-Rechner`,
 *      `calculadora Exentax`, `calculatrice Exentax`, `calculadora`,
 *      `calculator`).
 *   2. Agenda link to `/{lang}/(agendar|book|reserver|reservar|buchen)`
 *      using the localized booking slug per language.
 *   3. Action row with `tel:+34614916910` AND `wa.me/34614916910`
 *      (both must appear).
 *   4. Subpage LLC link if the article is LLC-related (slug contains one
 *      of `llc|5472|1120|ein|boi|mercury|fincen|wyoming|delaware`, or
 *      body has ≥3 mentions of "LLC").
 *   5. Subpage ITIN link if slug or body mentions `itin` ≥3 times.
 *
 * Output:
 *   - `reports/conversion/conversion-audit-112x6.csv` — one row per
 *     (slug, lang) with boolean columns for each contract.
 *   - `docs/audits/2026-04/conversion-audit-112x6.md` — aggregate
 *     totals, per-language coverage matrix, top-20 worst slugs, and
 *     weak-copy violations list with file:line.
 *
 * Idempotent: re-running overwrites both outputs.
 *
 * Exit code:
 *   - default mode → always 0 (audit-only, never blocks). Outputs the CSV +
 *     markdown report and prints a one-line summary to stdout.
 *   - `--strict` mode → exit 1 if any (slug, lang) pair fails to be fully
 *     conversion-grade (i.e. `fullyConversionGrade < slugs.length * LANGS.length`).
 *     Same pattern as `seo:masterpiece-strict`. Wired into the blog
 *     validation pipeline by `scripts/blog-validate-all.mjs` so any new
 *     article (or any rewrite that drops a CTA contract) breaks `npm run check`
 *     before it can reach production. The CSV + markdown report are still
 *     written before the non-zero exit so reviewers can inspect what regressed.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WORKSPACE = path.resolve(ROOT, "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");
const REPORTS_DIR = path.join(ROOT, "reports/conversion");
const DOCS_DIR = path.resolve(WORKSPACE, "docs/audits/2026-04");
const CSV_PATH = path.join(REPORTS_DIR, "conversion-audit-112x6.csv");
const MD_PATH = path.join(DOCS_DIR, "conversion-audit-112x6.md");

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// `--strict` flips the script from audit-only (always exit 0) to a real
// gate: any (slug, lang) pair that isn't fully conversion-grade trips a
// non-zero exit so the failure surfaces in `npm run check` (via
// `scripts/blog-validate-all.mjs`). Pattern mirrors `seo:masterpiece-strict`.
const STRICT = process.argv.includes("--strict");

// Localized booking slug per language (canonical paths from shared/routes.ts).
const AGENDA_SLUG = {
  es: "agendar",
  en: "book",
  fr: "reserver",
  de: "buchen",
  pt: "agendar",
  ca: "agendar",
};

// Localized service-page roots (LLC + ITIN subpages live under these).
// Canonical roots from shared/routes.ts (`our_services` key per locale).
const SERVICES_ROOT = {
  es: "servicios",
  en: "services",
  fr: "services",
  de: "leistungen",
  pt: "servicos",
  ca: "serveis",
};

// LLC state slug variants accepted under any services root.
const LLC_STATE_RE =
  /llc-(?:wyoming|delaware|florida|new-mexico|nuevo-mexico|nouveau-mexique|nou-mexic|novo-mexico|floride)/i;

// ITIN slug variants per language (any one of these counts as a hit).
// Canonical slugs from shared/routes.ts (`service_itin` key per locale).
const ITIN_SLUGS = [
  "get-your-itin",
  "obten-tu-itin",
  "obtiens-ton-itin",
  "hol-deine-itin",
  "obtenha-seu-itin",
  "obte-el-teu-itin",
];

// Calculator block markers — any one match satisfies contract #1.
const CALC_PATTERNS = [
  "<!-- exentax:calc-cta-v1 -->",
  "Exentax-Rechner",
  "calculadora Exentax",
  "calculatrice Exentax",
  "calculadora",
  "calculator",
];

// Slug-keywords that auto-classify an article as LLC-related.
const LLC_SLUG_KEYWORDS = [
  "llc", "5472", "1120", "ein", "boi", "mercury", "fincen", "wyoming", "delaware",
];

// Generic / weak-copy CTA phrases to flag (case-insensitive). Source
// strings kept verbatim per task brief.
const WEAK_COPY_PHRASES = [
  "haz clic aquí",
  "más información",
  "click here",
  "learn more",
  "contact us",
  "contáctanos",
  "saber más",
  "cliquez ici",
  "en savoir plus",
  "klicken sie hier",
  "mehr erfahren",
  "clique aqui",
  "saiba mais",
  "feu clic aquí",
  "més informació",
];

const PHONE_RE = /tel:\+?34614916910/;
const WA_RE = /wa\.me\/34614916910/;

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

function hasCalculator(body) {
  const lower = body.toLowerCase();
  for (const p of CALC_PATTERNS) {
    if (lower.includes(p.toLowerCase())) return true;
  }
  return false;
}

function hasAgenda(body, lang) {
  const slug = AGENDA_SLUG[lang];
  // Match `/{lang}/<slug>` exactly (allow trailing path/query/quote).
  const re = new RegExp(`/${lang}/${slug}(?:[/?"'#\\s]|$)`, "i");
  return re.test(body);
}

function hasTelAndWa(body) {
  return PHONE_RE.test(body) && WA_RE.test(body);
}

function isLLCArticle(slug, body) {
  const s = slug.toLowerCase();
  for (const kw of LLC_SLUG_KEYWORDS) {
    if (s.includes(kw)) return true;
  }
  const mentions = (body.match(/\bLLC\b/g) || []).length;
  return mentions >= 3;
}

function isITINArticle(slug, body) {
  const s = slug.toLowerCase();
  if (s.includes("itin")) return true;
  const mentions = (body.match(/\bITIN\b/gi) || []).length;
  return mentions >= 3;
}

function hasLLCSubpageLink(body, lang) {
  const root = SERVICES_ROOT[lang];
  // Look for `/{lang}/{servicesRoot}/llc-<state>`
  const re = new RegExp(
    `/${lang}/${root}/${LLC_STATE_RE.source}`,
    "i",
  );
  return re.test(body);
}

function hasITINSubpageLink(body, lang) {
  const root = SERVICES_ROOT[lang];
  const slugs = ITIN_SLUGS.map((s) => s.replace(/-/g, "\\-")).join("|");
  const re = new RegExp(`/${lang}/${root}/(?:${slugs})`, "i");
  return re.test(body);
}

function findWeakCopy(body) {
  const lines = body.split("\n");
  const hits = []; // { phrase, line }
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    for (const phrase of WEAK_COPY_PHRASES) {
      if (lower.includes(phrase.toLowerCase())) {
        hits.push({ phrase, line: i + 1 });
      }
    }
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Iterate
// ---------------------------------------------------------------------------
const slugSet = new Set();
for (const lang of LANGS) {
  const dir = path.join(CONTENT, lang);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".ts")) slugSet.add(f.replace(/\.ts$/, ""));
  }
}
const slugs = [...slugSet].sort();

const rows = []; // CSV rows
const weakViolations = []; // { lang, slug, file, line, phrase }
const totals = {
  articles: 0, // present (slug,lang) pairs
  fullyConversionGrade: 0,
  gaps: { calc: 0, agenda: 0, telWa: 0, llc: 0, itin: 0 },
  weakCopyHits: 0,
};
const perLang = {}; // lang -> { present, calc, agenda, telWa, llcReq, llcOk, itinReq, itinOk, full }
for (const lang of LANGS) {
  perLang[lang] = {
    present: 0,
    calc: 0,
    agenda: 0,
    telWa: 0,
    llcReq: 0,
    llcOk: 0,
    itinReq: 0,
    itinOk: 0,
    full: 0,
  };
}
// slug -> { gaps:int, missing:string[] }  (gaps = unmet *applicable* contracts)
const perSlugGaps = {};
// (slug, lang) pairs whose article file is missing on disk. Used by --strict
// to surface the i18n coverage holes by name (not just an aggregate count) so
// the next person to add an article in only one language gets a useful error.
const missingTranslations = []; // { slug, lang }

for (const slug of slugs) {
  for (const lang of LANGS) {
    const fp = path.join(CONTENT, lang, slug + ".ts");
    const body = readFileSafe(fp);
    if (body == null) {
      missingTranslations.push({ slug, lang });
      rows.push({
        slug,
        lang,
        present: 0,
        calc: 0,
        agenda: 0,
        telWa: 0,
        isLLC: 0,
        llcOk: 0,
        isITIN: 0,
        itinOk: 0,
        weakHits: 0,
        full: 0,
      });
      continue;
    }
    totals.articles++;
    perLang[lang].present++;

    const calc = hasCalculator(body);
    const agenda = hasAgenda(body, lang);
    const telWa = hasTelAndWa(body);
    const llcReq = isLLCArticle(slug, body);
    const itinReq = isITINArticle(slug, body);
    const llcOk = !llcReq || hasLLCSubpageLink(body, lang);
    const itinOk = !itinReq || hasITINSubpageLink(body, lang);

    const weak = findWeakCopy(body);
    if (weak.length) {
      totals.weakCopyHits += weak.length;
      for (const w of weak) {
        weakViolations.push({
          lang,
          slug,
          file: path.relative(WORKSPACE, fp),
          line: w.line,
          phrase: w.phrase,
        });
      }
    }

    if (calc) perLang[lang].calc++;
    else totals.gaps.calc++;
    if (agenda) perLang[lang].agenda++;
    else totals.gaps.agenda++;
    if (telWa) perLang[lang].telWa++;
    else totals.gaps.telWa++;
    if (llcReq) {
      perLang[lang].llcReq++;
      if (llcOk) perLang[lang].llcOk++;
      else totals.gaps.llc++;
    }
    if (itinReq) {
      perLang[lang].itinReq++;
      if (itinOk) perLang[lang].itinOk++;
      else totals.gaps.itin++;
    }

    const full = calc && agenda && telWa && llcOk && itinOk;
    if (full) {
      totals.fullyConversionGrade++;
      perLang[lang].full++;
    }

    // Track per-slug gap count (unmet applicable contracts).
    if (!perSlugGaps[slug]) perSlugGaps[slug] = { gaps: 0, missing: [] };
    const missing = [];
    if (!calc) missing.push(`${lang}:calc`);
    if (!agenda) missing.push(`${lang}:agenda`);
    if (!telWa) missing.push(`${lang}:telWa`);
    if (llcReq && !llcOk) missing.push(`${lang}:llc-sub`);
    if (itinReq && !itinOk) missing.push(`${lang}:itin-sub`);
    perSlugGaps[slug].gaps += missing.length;
    perSlugGaps[slug].missing.push(...missing);

    rows.push({
      slug,
      lang,
      present: 1,
      calc: calc ? 1 : 0,
      agenda: agenda ? 1 : 0,
      telWa: telWa ? 1 : 0,
      isLLC: llcReq ? 1 : 0,
      llcOk: llcOk ? 1 : 0,
      isITIN: itinReq ? 1 : 0,
      itinOk: itinOk ? 1 : 0,
      weakHits: weak.length,
      full: full ? 1 : 0,
    });
  }
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------
fs.mkdirSync(REPORTS_DIR, { recursive: true });
const csvHeader = [
  "slug",
  "lang",
  "present",
  "calc",
  "agenda",
  "telWa",
  "isLLC",
  "llcOk",
  "isITIN",
  "itinOk",
  "weakHits",
  "full",
].join(",");
const csvLines = [csvHeader];
for (const r of rows) {
  csvLines.push(
    [
      r.slug,
      r.lang,
      r.present,
      r.calc,
      r.agenda,
      r.telWa,
      r.isLLC,
      r.llcOk,
      r.isITIN,
      r.itinOk,
      r.weakHits,
      r.full,
    ].join(","),
  );
}
fs.writeFileSync(CSV_PATH, csvLines.join("\n") + "\n");

// ---------------------------------------------------------------------------
// Markdown report
// ---------------------------------------------------------------------------
fs.mkdirSync(DOCS_DIR, { recursive: true });
const md = [];
md.push("# Conversion-grade audit — 112 articles × 6 languages");
md.push("");
md.push(
  `Generated by \`exentax-web/scripts/audit-conversion-112x6.mjs\` (read-only). Re-run with \`npm run audit:conversion\`.`,
);
md.push("");
md.push("## Aggregate totals");
md.push("");
md.push("| Metric | Value |");
md.push("| --- | --- |");
md.push(`| Total article files audited | ${totals.articles} / ${slugs.length * LANGS.length} |`);
md.push(`| Fully conversion-grade (5/5 applicable contracts) | ${totals.fullyConversionGrade} |`);
md.push(`| Calculator gaps | ${totals.gaps.calc} |`);
md.push(`| Agenda gaps | ${totals.gaps.agenda} |`);
md.push(`| tel + WhatsApp gaps | ${totals.gaps.telWa} |`);
md.push(`| LLC subpage gaps (only LLC articles) | ${totals.gaps.llc} |`);
md.push(`| ITIN subpage gaps (only ITIN articles) | ${totals.gaps.itin} |`);
md.push(`| Weak-copy hits (line-level) | ${totals.weakCopyHits} |`);
md.push("");
md.push("## Per-language coverage matrix");
md.push("");
md.push(
  "Each cell is the percentage of present articles that satisfy the given contract. The LLC / ITIN columns are over the *applicable* subset (articles classified as LLC- or ITIN-related).",
);
md.push("");
md.push(
  "| Lang | Present | Calc | Agenda | tel+WA | LLC sub | ITIN sub | Full 5/5 |",
);
md.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
const pct = (num, den) => (den === 0 ? "—" : `${Math.round((num * 1000) / den) / 10}%`);
for (const lang of LANGS) {
  const p = perLang[lang];
  md.push(
    `| ${lang} | ${p.present} | ${pct(p.calc, p.present)} | ${pct(p.agenda, p.present)} | ${pct(p.telWa, p.present)} | ${pct(p.llcOk, p.llcReq)} (${p.llcOk}/${p.llcReq}) | ${pct(p.itinOk, p.itinReq)} (${p.itinOk}/${p.itinReq}) | ${pct(p.full, p.present)} |`,
  );
}
md.push("");
md.push("## Top 20 slugs with the most gaps");
md.push("");
md.push(
  "Gap count = number of unmet *applicable* contracts summed across the 6 languages. A slug at 30 means every contract is unmet in every language.",
);
md.push("");
md.push("| Rank | Slug | Total gaps | Sample missing |");
md.push("| --- | --- | --- | --- |");
const ranked = Object.entries(perSlugGaps)
  .map(([slug, v]) => ({ slug, ...v }))
  .sort((a, b) => b.gaps - a.gaps)
  .slice(0, 20);
ranked.forEach((r, i) => {
  const sample = r.missing.slice(0, 6).join(", ") + (r.missing.length > 6 ? `, …(+${r.missing.length - 6})` : "");
  md.push(`| ${i + 1} | ${r.slug} | ${r.gaps} | ${sample} |`);
});
md.push("");
md.push("## Weak-copy violations");
md.push("");
md.push(
  `Total: **${weakViolations.length}** line-level matches across **${new Set(weakViolations.map((w) => w.slug + ":" + w.lang)).size}** files. Phrases checked: ${WEAK_COPY_PHRASES.map((p) => `\`${p}\``).join(", ")}.`,
);
md.push("");
if (weakViolations.length === 0) {
  md.push("_No weak-copy phrases detected._");
} else {
  md.push("| File | Line | Phrase |");
  md.push("| --- | --- | --- |");
  for (const w of weakViolations) {
    md.push(`| ${w.file}:${w.line} | ${w.line} | ${w.phrase} |`);
  }
}
md.push("");
fs.writeFileSync(MD_PATH, md.join("\n"));

// ---------------------------------------------------------------------------
// One-line summary (stdout) — required by task brief.
// ---------------------------------------------------------------------------
const summary =
  `audit-conversion-112x6: ${totals.fullyConversionGrade}/${slugs.length * LANGS.length} fully conversion-grade · ` +
  `${totals.gaps.agenda} agenda gaps · ` +
  `${totals.gaps.telWa} tel-WA gaps · ` +
  `${totals.gaps.llc} LLC-subpage gaps · ` +
  `${totals.gaps.itin} ITIN-subpage gaps · ` +
  `${totals.weakCopyHits} weak-copy hits`;
console.log(summary);

// In strict mode, treat any missing conversion-grade pair (or any missing
// article file) as a CI-blocking failure. Mirrors the audit→strict pattern
// from `seo:masterpiece-strict` and is wired into `blog-validate-all.mjs`.
//
// Two independent gates evaluated in strict mode:
//   1. Structural CTAs: every (slug, lang) pair must satisfy its applicable
//      contracts (calculator, agenda, tel+WhatsApp, LLC sub, ITIN sub).
//   2. Weak-copy phrases: zero tolerance for the generic CTAs listed in
//      `WEAK_COPY_PHRASES` ("haz clic aquí", "learn more", "click here",
//      "cliquez ici", etc.). Closes the door before a new article or an
//      auto-translation can reintroduce them.
// Both gates run regardless of which one fails first so reviewers see the
// full picture in a single CI run.
if (STRICT) {
  const expected = slugs.length * LANGS.length;
  let strictFail = false;

  if (totals.fullyConversionGrade < expected) {
    const missingPairs = expected - totals.articles;
    const ctaGaps =
      totals.gaps.calc +
      totals.gaps.agenda +
      totals.gaps.telWa +
      totals.gaps.llc +
      totals.gaps.itin;
    // If the only thing missing is article files (no CTA contract failed on
    // any present article), say so explicitly — the author needs to know
    // they're looking at an i18n coverage hole, not a CTA regression.
    const onlyMissingTranslations = missingPairs > 0 && ctaGaps === 0;
    const header = onlyMissingTranslations
      ? `audit-conversion-112x6 [--strict]: FAIL — ${totals.fullyConversionGrade}/${expected} fully conversion-grade. ` +
        `All present articles pass every CTA contract; the gap is i18n coverage: ${missingPairs} (slug, lang) pair(s) have no article file.`
      : `audit-conversion-112x6 [--strict]: FAIL — ${totals.fullyConversionGrade}/${expected} fully conversion-grade ` +
        `(missing files: ${missingPairs}, calc gaps: ${totals.gaps.calc}, agenda gaps: ${totals.gaps.agenda}, ` +
        `tel-WA gaps: ${totals.gaps.telWa}, LLC-sub gaps: ${totals.gaps.llc}, ITIN-sub gaps: ${totals.gaps.itin}).`;
    console.error(header);
    if (missingPairs > 0) {
      const SAMPLE = 10;
      const sample = missingTranslations
        .slice(0, SAMPLE)
        .map((m) => `  - ${m.slug} [${m.lang}]`)
        .join("\n");
      const overflow =
        missingTranslations.length > SAMPLE
          ? `\n  …(+${missingTranslations.length - SAMPLE} more)`
          : "";
      console.error(
        `Missing article files (${missingTranslations.length} total, showing first ${Math.min(SAMPLE, missingTranslations.length)}):\n${sample}${overflow}`,
      );
    }
    console.error(
      `See ${path.relative(WORKSPACE, CSV_PATH)} and ${path.relative(WORKSPACE, MD_PATH)} for the per-(slug,lang) breakdown.`,
    );
    strictFail = true;
  }

  if (totals.weakCopyHits > 0) {
    const sampleN = Math.min(weakViolations.length, 10);
    const sample = weakViolations
      .slice(0, sampleN)
      .map((w) => `  - ${w.file}:${w.line} → "${w.phrase}"`)
      .join("\n");
    const more =
      weakViolations.length > sampleN
        ? `\n  …and ${weakViolations.length - sampleN} more (full list in ${path.relative(WORKSPACE, MD_PATH)}).`
        : "";
    console.error(
      `audit-conversion-112x6 [--strict]: FAIL — ${totals.weakCopyHits} weak-copy hit(s) ` +
        `across ${new Set(weakViolations.map((w) => w.slug + ":" + w.lang)).size} file(s). ` +
        `Replace generic CTAs with concrete ones (calculadora, agenda, tel+WhatsApp, sub-LLC, sub-ITIN).\n` +
        `${sample}${more}`,
    );
    strictFail = true;
  }

  if (strictFail) {
    process.exit(1);
  }
  console.log(
    `audit-conversion-112x6 [--strict]: OK — ${expected}/${expected} fully conversion-grade, 0 weak-copy hits.`,
  );
}

process.exit(0);
