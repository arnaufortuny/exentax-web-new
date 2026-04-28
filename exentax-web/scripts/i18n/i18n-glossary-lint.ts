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
  // ── W-8 series: keep the dash. ──
  {
    id: "W8 missing dash",
    bad: /\bW\s?8\s?(BEN|BEN-E|BEN E)\b/i,
    hint: "Use 'W-8BEN' or 'W-8BEN-E'.",
    allowedContext: /\bW-8BEN(-E)?\b/,
  },
  // ── Spanish AEAT model numbers ──
  // Must be 'modelo NNN' lower-case 'modelo'. 'Modelo' at sentence start
  // is OK (capitalised by punctuation rule), but never 'MODELO 720'.
  {
    id: "Modelo number all-caps",
    bad: /\bMODELO\s+(720|721|100|130|111|303|390|349)\b/,
    hint: "Use lowercase 'modelo 720' / 'modelo 100' (sentence-case form).",
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

let totalViolations = 0;
totalViolations += scan("UI strings (i18n bundles)", locales, true);
totalViolations += scan("Blog editorial content", blogs, false);

console.log();
console.log("═══════════════════════════════════════════════");
console.log(` Total violations: ${totalViolations}`);
console.log(`Result: ${exit === 0 ? "PASS ✓" : "FAIL ✗"}`);
console.log("═══════════════════════════════════════════════");
process.exit(exit);
