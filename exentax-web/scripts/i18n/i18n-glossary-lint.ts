/**
 * i18n-glossary-lint
 *
 * Verifies that the canonical "literal-everywhere" terms documented in
 * docs/i18n-glossary.md (LLC, EIN, FinCEN, IRS, Form 1120, …) appear in
 * their canonical spelling in every locale, and that obvious wrong
 * variants do NOT appear (e.g. "L.L.C.", "Fincen", "I.R.S.").
 *
 * Scope: BOTH the i18n bundles (`client/src/i18n/locales/*.ts`) and the
 * blog editorial content (`client/src/data/blog-content/<lang>/*.ts`).
 * The same canonical-only rules apply to both surfaces.
 *
 * Exits non-zero on any violation so it can be wired into CI.
 *
 * Run:  npx tsx scripts/i18n/i18n-glossary-lint.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import es from "../../client/src/i18n/locales/es";
import en from "../../client/src/i18n/locales/en";
import fr from "../../client/src/i18n/locales/fr";
import de from "../../client/src/i18n/locales/de";
import pt from "../../client/src/i18n/locales/pt";
import ca from "../../client/src/i18n/locales/ca";

type Bundle = Record<string, unknown>;
type Flat = Record<string, string>;

function flatten(obj: Bundle, prefix = "", out: Flat = {}): Flat {
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v as Bundle, full, out);
    } else if (typeof v === "string") {
      out[full] = v;
    }
  }
  return out;
}

const locales: Record<string, Flat> = {
  es: flatten(es as Bundle),
  en: flatten(en as Bundle),
  fr: flatten(fr as Bundle),
  de: flatten(de as Bundle),
  pt: flatten(pt as Bundle),
  ca: flatten(ca as Bundle),
};

// ─── Blog content loader ─────────────────────────────────────────────
// Each blog article lives at client/src/data/blog-content/<lang>/<slug>.ts
// and exports a default template literal (markdown + HTML). We treat
// each article as a single flat string keyed by `blog/<slug>`.

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT = join(__dirname, "..", "..", "client", "src", "data", "blog-content");

function loadBlog(lang: string): Flat {
  const out: Flat = {};
  const dir = join(BLOG_ROOT, lang);
  let files: string[];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  } catch {
    return out;
  }
  for (const f of files) {
    const raw = readFileSync(join(dir, f), "utf8");
    const m = raw.match(/export\s+default\s+`([\s\S]*)`\s*;?\s*$/);
    if (m) out[`blog/${f.replace(/\.ts$/, "")}`] = m[1];
  }
  return out;
}

const blogs: Record<string, Flat> = {
  es: loadBlog("es"),
  en: loadBlog("en"),
  fr: loadBlog("fr"),
  de: loadBlog("de"),
  pt: loadBlog("pt"),
  ca: loadBlog("ca"),
};

// ─── Forbidden variant patterns ──────────────────────────────────────
// Each rule fails when `bad` matches and the surrounding text isn't a
// known false positive (allowedContext).
type Rule = {
  id: string;
  bad: RegExp;
  hint: string;
  // If the matched value also matches `allowedContext`, suppress.
  allowedContext?: RegExp;
};
const rules: Rule[] = [
  // ── US tax-acronym dotted variants (forbidden) ──
  { id: "LLC dotted", bad: /\bL\.L\.C\.\b/, hint: "Use 'LLC' (no dots)." },
  { id: "EIN dotted", bad: /\bE\.I\.N\.\b/, hint: "Use 'EIN' (no dots)." },
  { id: "ITIN dotted", bad: /\bI\.T\.I\.N\.\b/, hint: "Use 'ITIN' (no dots)." },
  { id: "IRS dotted", bad: /\bI\.R\.S\.\b/, hint: "Use 'IRS' (no dots)." },
  { id: "SSN dotted", bad: /\bS\.S\.N\.\b/, hint: "Use 'SSN' (no dots)." },
  // ── Casing of canonical agencies / acronyms ──
  { id: "FinCEN miscased", bad: /\b(Fincen|FINCEN|fincen)\b/, hint: "Use 'FinCEN'." },
  { id: "FATCA miscased", bad: /\b(Fatca|fatca)\b/, hint: "Use 'FATCA'." },
  // 'BOI' / 'BOIR' must always be uppercase. Lowercase forms ('boi',
  // 'Boi') would never legitimately appear in fiscal context.
  { id: "BOI miscased", bad: /\b(boi|Boi)R?\b(?!\s*(?:de|à|au|de|do|um))/, hint: "Use 'BOI' / 'BOIR' (uppercase)." },
  { id: "OECD miscased", bad: /\b(Oecd|oecd|OECd)\b/, hint: "Use 'OECD' (uppercase)." },
  { id: "AEAT miscased", bad: /\b(Aeat|aeat)\b/, hint: "Use 'AEAT' (uppercase)." },
  // ── Tax form numbers must be 'Form NNNN(-XX)?', not lowercase. ──
  {
    id: "Form-number lowercased",
    bad: /\bform\s+(\d{3,4}(-[A-Z0-9]{1,3})?)\b/,
    hint: "Use 'Form 1120', 'Form 5472', 'Form 1040-NR' (capital 'F').",
    // Don't flag accidental matches when 'Form' is already capitalised
    // somewhere in the same value (the bad regex is case-sensitive).
    allowedContext: /\bForm\s+\d{3,4}/,
  },
  // ── Run-together 'Form' + number with no space (forbidden) ──
  // Catches `Form5472`, `form1120`, `FORM1040-NR`. Canonical is
  // `Form 5472` with a space between the brand keyword and number.
  {
    id: "Form-number run-together",
    bad: /\bForm(\d{3,4}(?:-[A-Z0-9]{1,3})?)\b/i,
    hint: "Use 'Form NNNN' with a space between 'Form' and the number (e.g. 'Form 5472').",
  },
  // ── W-8 series: keep the dash. ──
  {
    id: "W8 missing dash",
    bad: /\bW\s?8\s?(BEN|BEN-E|BEN E)\b/i,
    hint: "Use 'W-8BEN' or 'W-8BEN-E'.",
    allowedContext: /\bW-8BEN(-E)?\b/,
  },
  // ── W-8 with stray space or extra dash before BEN (forbidden) ──
  // Catches `W-8 BEN`, `W-8 BEN-E`, `W-8-BEN`. Canonical glues the
  // form code: `W-8BEN` / `W-8BEN-E`. No `allowedContext`: each bad
  // occurrence must be reported on its own merits (a single correct
  // `W-8BEN` somewhere else in the same article must NOT mask drift).
  // Case-sensitive on `BEN` to avoid colliding with the Catalan word
  // `ben` ("well") that legitimately follows `W-8` in prose.
  {
    id: "W-8 stray separator before BEN",
    bad: /\bW-8[\s\-]+BEN(?:[\s\-]?E)?\b/,
    hint: "Use 'W-8BEN' / 'W-8BEN-E' (no space or extra dash between '8' and 'BEN').",
  },
  // ── W-8 with the dash on the wrong side (forbidden) ──
  // Catches `W8-BEN`, `W8-BEN-E` (run-together 'W8' with a dash before
  // 'BEN', often produced by autocorrect or pasted from email subjects).
  // Lowercase slug occurrences inside URL paths and HTML comment
  // markers (e.g. `/blog/w8-ben-...`, `<!-- :w8-ben-... -->`) are
  // suppressed by `inUrlContext`. Case-sensitive on `BEN` because
  // lowercase `w8-ben` only legitimately appears as a URL slug.
  {
    id: "W-8 wrong dash position",
    bad: /\bW8-BEN(?:-E)?\b/,
    hint: "Use 'W-8BEN' / 'W-8BEN-E' (dash between W and 8, not between 8 and BEN).",
  },
  // ── Spanish AEAT model numbers ──
  // Must be 'modelo NNN' lower-case 'modelo'. 'Modelo' at sentence start
  // is OK (capitalised by punctuation rule), but never 'MODELO 720'.
  {
    id: "Modelo number all-caps",
    bad: /\bMODELO\s+(720|721|100|130|111|303|390|349)\b/,
    hint: "Use lowercase 'modelo 720' / 'modelo 100' (sentence-case form).",
  },
  // ── Run-together 'modelo' + AEAT number with no space (forbidden) ──
  // Catches `modelo720`, `Modelo720`, `MODELO720`. Canonical keeps the
  // space: `modelo 720`.
  {
    id: "Modelo number run-together",
    bad: /\bmodelo(720|721|100|130|111|303|390|349)\b/i,
    hint: "Use 'modelo NNN' with a space between 'modelo' and the number (e.g. 'modelo 720').",
  },
  // ── Spanish 'formulario' replacing canonical 'Form NNNN' (forbidden) ──
  // The glossary keeps US IRS form names literal across every locale:
  // `Form 5472`, not `formulario 5472`. Restricted to the US IRS form
  // numbers in active use so genuinely Spanish/European form names
  // (e.g. the French `formulario 3916`) are not flagged.
  {
    id: "Spanish 'formulario' + US IRS form number",
    bad: /\bformulario\s+(1040(?:-NR)?|1042(?:-[A-Z])?|1065|1099|1120|2553|5472|7004|8832|8804|8805|8938|940|941|944)\b/i,
    hint: "Use canonical 'Form NNNN' literal (e.g. 'Form 5472'), not 'formulario 5472'.",
  },
  // ── Brand-protected names: must keep canonical casing. ──
  // Mercury, Stripe, PayPal, Wise, Relay, Slash, Wallester, Revolut,
  // Adyen, Kraken, Tradovate, Interactive Brokers, Hotmart, Whop.
  {
    id: "PayPal miscased",
    bad: /\b(Paypal|PAYPAL|paypal)\b/,
    hint: "Use 'PayPal' (camel case).",
    // URLs / email addresses keep their lower-case form.
    allowedContext: /paypal\.(?:com|me)|@paypal/i,
  },
  {
    id: "Stripe miscased",
    bad: /\b(STRIPE|stripe)\b/,
    hint: "Use 'Stripe' (capitalised).",
    allowedContext: /stripe\.com|@stripe/i,
  },
  {
    id: "Mercury miscased",
    bad: /\b(MERCURY|mercury)\b(?!\.com|\.io)/,
    hint: "Use 'Mercury' (capitalised).",
    allowedContext: /mercury\.com|@mercury/i,
  },
  // ── Forbidden translation of brand: never localise the LLC acronym. ──
  // Catches "S.R.L." / "S.A.R.L." / "GmbH" / "Sàrl" used as a *substitute*
  // for "LLC" rather than as a comparison term in the same value.
  // (Comparison contexts contain both terms, so allowedContext suppresses.)
  {
    id: "LLC localised as SRL",
    bad: /\b(?:una|nuestra|tu|mi)\s+S\.?R\.?L\.?\b/,
    hint: "Don't substitute 'SRL' for 'LLC'. The brand is always 'LLC'.",
    allowedContext: /\bLLC\b/,
  },
  // ── HMRC must keep its canonical acronym ──
  { id: "HMRC miscased", bad: /\b(Hmrc|hmrc)\b/, hint: "Use 'HMRC' (uppercase)." },
];

// ─── Required term presence (literal-everywhere terms) ───────────────
// These should appear at least once across the locale bundle so we know
// the canonical spelling is in active use. They're informational rather
// than blocking.
const requiredTerms = ["LLC", "EIN", "FinCEN", "IRS", "Form 5472", "Form 1120"];

let exit = 0;
console.log("═══════════════════════════════════════════════");
console.log(" Exentax i18n Glossary Lint");
console.log("═══════════════════════════════════════════════\n");

// A match is "in URL/anchor context" if it sits inside a domain name,
// a hyperlink target, an HTML attribute value, a markdown link href,
// a URL slug, or an inline-code span. These are the only places where
// canonical fiscal terms legitimately appear in lowercase / mixed forms.
function inUrlContext(text: string, idx: number, len: number): boolean {
  const before = text.slice(Math.max(0, idx - 30), idx);
  const after = text.slice(idx + len, idx + len + 30);
  // Inside a domain (preceded by . or /): foo.fincen.gov, /boi
  if (/[\/\.\-]$/.test(before)) return true;
  // Followed by domain TLD or path/slug separator: fincen.gov, fincen/boi
  if (/^[\.\-\/]/.test(after)) return true;
  // Inside an href / src / markdown link: href="…fincen…", [text](…fincen…)
  if (/(?:href|src)=["'][^"']*$/.test(before)) return true;
  if (/\]\([^)]*$/.test(before)) return true;
  // Inside a backtick-fenced inline code span: `…fincen…`
  const lastBacktick = before.lastIndexOf("`");
  const closeBacktick = after.indexOf("`");
  if (lastBacktick !== -1 && closeBacktick !== -1) {
    const between = text.slice(lastBacktick + 1, idx + len + closeBacktick);
    if (!between.includes("\n")) return true;
  }
  return false;
}

function scan(label: string, bundles: Record<string, Flat>, checkRequired: boolean): number {
  console.log(`\n── ${label} ──`);
  let total = 0;
  for (const [lang, bundle] of Object.entries(bundles)) {
    const violations: string[] = [];
    for (const [k, v] of Object.entries(bundle)) {
      for (const rule of rules) {
        const flags = rule.bad.flags.includes("g") ? rule.bad.flags : rule.bad.flags + "g";
        const re = new RegExp(rule.bad.source, flags);
        for (const m of v.matchAll(re)) {
          const idx = m.index ?? 0;
          if (inUrlContext(v, idx, m[0].length)) continue;
          if (rule.allowedContext && rule.allowedContext.test(v)) continue;
          const lo = Math.max(0, idx - 30);
          const hi = Math.min(v.length, idx + m[0].length + 30);
          const sample = v.slice(lo, hi).replace(/\s+/g, " ");
          violations.push(`  [${rule.id}] ${k}: "…${sample}…" — ${rule.hint}`);
          break; // one violation per (key, rule) is enough signal
        }
      }
    }
    const ok = violations.length === 0;
    console.log(`${ok ? "✓" : "✗"} ${lang.toUpperCase()} — ${violations.length} violation(s) [${label}]`);
    for (const v of violations) console.log(v);
    if (checkRequired) {
      const allText = Object.values(bundle).join(" \n ");
      const missingRequired = requiredTerms.filter((t) => !allText.includes(t));
      if (missingRequired.length) {
        console.log(`  ℹ Required terms not present anywhere: ${missingRequired.join(", ")}`);
      }
    }
    total += violations.length;
    if (violations.length) exit = 1;
  }
  return total;
}

// ─── Self-tests for the rule set ─────────────────────────────────────
// Run with `npx tsx scripts/i18n-glossary-lint.ts --self-test` to
// verify the rule set still catches the documented drift variants
// (run-together, stray-space, wrong-dash, formulario+number) and
// stays quiet on canonical and false-positive contexts. These tests
// are also a regression guard for the W-8 rules: a single correct
// `W-8BEN` somewhere in the same value must NOT mask drift elsewhere.
function selfTest(): number {
  type Case = { input: string; expectFire: string[]; expectQuiet?: boolean };
  const cases: Case[] = [
    // Run-together
    { input: "Form5472", expectFire: ["Form-number run-together"] },
    { input: "form1120", expectFire: ["Form-number run-together"] },
    { input: "Modelo720", expectFire: ["Modelo number run-together"] },
    { input: "MODELO720", expectFire: ["Modelo number run-together"] },
    // W-8 stray space / extra dash
    { input: "Use a W-8 BEN form", expectFire: ["W-8 stray separator before BEN"] },
    { input: "Use a W-8 BEN-E form", expectFire: ["W-8 stray separator before BEN"] },
    { input: "Use a W-8-BEN form", expectFire: ["W-8 stray separator before BEN"] },
    // W-8 wrong dash position
    { input: "Use a W8-BEN form", expectFire: ["W-8 wrong dash position"] },
    { input: "Use a W8-BEN-E form", expectFire: ["W-8 wrong dash position"] },
    // Critical regression: canonical W-8BEN in same value must NOT
    // suppress drift elsewhere in that value. (Trailing words instead
    // of bare punctuation, because `inUrlContext` is intentionally
    // permissive about a trailing `.`/`-`/`/` to protect domain names.)
    {
      input: "We accept the W-8BEN; never write W-8 BEN or W8-BEN forms",
      expectFire: ["W-8 stray separator before BEN", "W-8 wrong dash position"],
    },
    // Spanish formulario + US IRS form
    { input: "presentar el formulario 5472 ante el IRS", expectFire: ["Spanish 'formulario' + US IRS form number"] },
    { input: "el formulario 1120 anual", expectFire: ["Spanish 'formulario' + US IRS form number"] },
    // ── False-positive guards (must stay quiet) ──
    { input: "Form 5472", expectFire: [], expectQuiet: true },
    { input: "modelo 720", expectFire: [], expectQuiet: true },
    { input: "W-8BEN", expectFire: [], expectQuiet: true },
    { input: "W-8BEN-E", expectFire: [], expectQuiet: true },
    // Catalan word `ben` ("well") next to W-8 must not collide with BEN.
    { input: "amb un W-8 ben fet, pots rebre els pagaments", expectFire: [], expectQuiet: true },
    // French form number kept literal in Spanish prose must not be flagged.
    { input: "el formulario 3916 francés", expectFire: [], expectQuiet: true },
    // 'el formulario W-8BEN-E' (no digit follows) must not be flagged.
    { input: "el formulario W-8BEN-E", expectFire: [], expectQuiet: true },
    // Lowercase slug context (URL path) must be suppressed by inUrlContext.
    { input: '<a href="/blog/w8-ben-and-w8-ben-e-the-complete-guide">guide</a>', expectFire: [], expectQuiet: true },
    { input: "<!-- exentax:lote7-native-v1:w8-ben-y-w8-ben-e-guia-completa -->", expectFire: [], expectQuiet: true },
  ];

  function fireRules(value: string): string[] {
    const fired: string[] = [];
    for (const rule of rules) {
      const flags = rule.bad.flags.includes("g") ? rule.bad.flags : rule.bad.flags + "g";
      const re = new RegExp(rule.bad.source, flags);
      for (const m of value.matchAll(re)) {
        const idx = m.index ?? 0;
        if (inUrlContext(value, idx, m[0].length)) continue;
        if (rule.allowedContext && rule.allowedContext.test(value)) continue;
        if (!fired.includes(rule.id)) fired.push(rule.id);
        break;
      }
    }
    return fired;
  }

  let failures = 0;
  console.log("\n── Self-test ──");
  for (const c of cases) {
    const fired = fireRules(c.input);
    const expected = new Set(c.expectFire);
    const got = new Set(fired);
    const missing = [...expected].filter((id) => !got.has(id));
    const unexpected = [...got].filter((id) => !expected.has(id));
    const ok = missing.length === 0 && unexpected.length === 0;
    console.log(`${ok ? "✓" : "✗"} "${c.input}" → ${fired.length ? fired.join(", ") : "(no flag)"}`);
    if (!ok) {
      failures++;
      if (missing.length) console.log(`    expected to fire: ${missing.join(", ")}`);
      if (unexpected.length) console.log(`    unexpected fires: ${unexpected.join(", ")}`);
    }
  }
  console.log(`Self-test: ${failures === 0 ? "PASS ✓" : `FAIL ✗ (${failures})`}`);
  return failures;
}

if (process.argv.includes("--self-test")) {
  const failures = selfTest();
  process.exit(failures === 0 ? 0 : 1);
}

let totalViolations = 0;
totalViolations += scan("UI strings (i18n bundles)", locales, true);
totalViolations += scan("Blog editorial content", blogs, false);

console.log();
console.log("═══════════════════════════════════════════════");
console.log(` Total violations: ${totalViolations}`);
console.log(`Result: ${exit === 0 ? "PASS ✓" : "FAIL ✗"}`);
console.log("═══════════════════════════════════════════════");
process.exit(exit);
