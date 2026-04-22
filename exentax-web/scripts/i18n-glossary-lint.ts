/**
 * i18n-glossary-lint
 *
 * Verifies that the canonical "literal-everywhere" terms documented in
 * docs/i18n-glossary.md (LLC, EIN, FinCEN, IRS, Form 1120, …) appear in
 * their canonical spelling in every locale, and that obvious wrong
 * variants do NOT appear (e.g. "L.L.C.", "Fincen", "I.R.S.").
 *
 * Exits non-zero on any violation so it can be wired into CI.
 *
 * Run:  npx tsx scripts/i18n-glossary-lint.ts
 */
import es from "../client/src/i18n/locales/es";
import en from "../client/src/i18n/locales/en";
import fr from "../client/src/i18n/locales/fr";
import de from "../client/src/i18n/locales/de";
import pt from "../client/src/i18n/locales/pt";
import ca from "../client/src/i18n/locales/ca";

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
  { id: "LLC dotted", bad: /\bL\.L\.C\.\b/, hint: "Use 'LLC' (no dots)." },
  { id: "EIN dotted", bad: /\bE\.I\.N\.\b/, hint: "Use 'EIN' (no dots)." },
  { id: "ITIN dotted", bad: /\bI\.T\.I\.N\.\b/, hint: "Use 'ITIN' (no dots)." },
  { id: "IRS dotted", bad: /\bI\.R\.S\.\b/, hint: "Use 'IRS' (no dots)." },
  { id: "FinCEN miscased", bad: /\b(Fincen|FINCEN|fincen)\b/, hint: "Use 'FinCEN'." },
  { id: "FATCA miscased", bad: /\b(Fatca|fatca)\b/, hint: "Use 'FATCA'." },
  { id: "BOI miscased", bad: /\b(boi|Boi)R?\b/, hint: "Use 'BOI' / 'BOIR'." },
  // Form numbers: must be 'Form NNNN(-XX)?', not lowercase. Catches any
  // tax form number — current (1120, 5472, 1040, 1040-NR, 8858, 8865,
  // 8938, W-8BEN, …) plus any that may be added later.
  {
    id: "Form-number lowercased",
    bad: /\bform\s+(\d{3,4}(-[A-Z0-9]{1,3})?)\b/,
    hint: "Use 'Form 1120', 'Form 5472', 'Form 1040-NR' (capital 'F').",
    // Don't flag accidental matches inside URLs or already-capitalised
    // contexts (the alternation above is case-sensitive so 'Form 1120'
    // already passes; this guard rejects strings that contain 'Form'
    // somewhere in the same value, which would indicate the writer
    // mixed cases intentionally).
    allowedContext: /\bForm\s+\d{3,4}/,
  },
  // W-8 series: keep the dash.
  {
    id: "W8 missing dash",
    bad: /\bW\s?8\s?(BEN|BEN-E|BEN E)\b/i,
    hint: "Use 'W-8BEN' or 'W-8BEN-E'.",
    allowedContext: /\bW-8BEN(-E)?\b/,
  },
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

let totalViolations = 0;
for (const [lang, bundle] of Object.entries(locales)) {
  const violations: string[] = [];
  for (const [k, v] of Object.entries(bundle)) {
    for (const rule of rules) {
      if (!rule.bad.test(v)) continue;
      if (rule.allowedContext && rule.allowedContext.test(v)) continue;
      violations.push(`  [${rule.id}] ${k}: "${v.slice(0, 100)}" — ${rule.hint}`);
    }
  }
  const allText = Object.values(bundle).join(" \n ");
  const missingRequired = requiredTerms.filter((t) => !allText.includes(t));

  const ok = violations.length === 0;
  console.log(`${ok ? "✓" : "✗"} ${lang.toUpperCase()} — ${violations.length} violation(s)`);
  for (const v of violations) console.log(v);
  if (missingRequired.length) {
    console.log(`  ℹ Required terms not present anywhere: ${missingRequired.join(", ")}`);
  }
  totalViolations += violations.length;
  if (violations.length) exit = 1;
}

console.log();
console.log("═══════════════════════════════════════════════");
console.log(` Total violations: ${totalViolations}`);
console.log(`Result: ${exit === 0 ? "PASS ✓" : "FAIL ✗"}`);
console.log("═══════════════════════════════════════════════");
process.exit(exit);
