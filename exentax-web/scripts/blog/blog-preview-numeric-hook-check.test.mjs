#!/usr/bin/env node
/*
 * blog-preview-numeric-hook-check.test.mjs
 * ----------------------------------------------------------------------------
 * Unit test for Task #11 — pin the strict "first non-whitespace character must
 * be a digit (0-9)" rule used by `blog-preview-numeric-hook-check.mjs` to
 * audit every excerpt / metaDescription / socialDescription / ogDescription
 * across the blog (Spanish master + 5 localized variants).
 *
 * The rule itself lives in the `leadsWithDigit` helper, which the audit
 * script applies to every preview-snippet field. If a future refactor
 * accidentally weakens the regex (e.g. to allow currency symbols, leading
 * letters, leading punctuation, or anything that is not literally a digit),
 * this test fails before the audit silently lets bad copy ship.
 *
 * Exits with code 0 on success and 1 on any mismatch so check:serial / CI /
 * post-merge can fail fast if the regex regresses.
 * ----------------------------------------------------------------------------
 */

import { leadsWithDigit } from "./blog-preview-numeric-hook-check.mjs";

// Each fixture is { name, text, expect: "pass" | "fail" }.
// "pass" means leadsWithDigit MUST return true (the copy is valid: it leads
//        with a digit and would survive the audit).
// "fail" means leadsWithDigit MUST return false (the copy is offending: the
//        first non-whitespace character is not 0-9).
const FIXTURES = [
  // ---------------------------------------------------------------------------
  // Offending strings — the audit MUST flag these. If any of these starts
  // returning true, the rule has been weakened and bad copy could ship.
  // ---------------------------------------------------------------------------
  {
    name: "fail: starts with a capital letter (English)",
    text: "Wyoming LLC formation explained for non-residents.",
    expect: "fail",
  },
  {
    name: "fail: starts with a lowercase letter (Spanish)",
    text: "abrir una LLC en Wyoming siendo no residente.",
    expect: "fail",
  },
  {
    name: "fail: starts with a Spanish opener ¿",
    text: "¿7 pasos para abrir una LLC en Wyoming?",
    expect: "fail",
  },
  {
    name: "fail: starts with a Spanish opener ¡",
    text: "¡5 errores fatales al constituir tu LLC!",
    expect: "fail",
  },
  {
    name: "fail: starts with a dollar sign followed by digits",
    text: "$25,000 IRS Form 5472 penalty explained.",
    expect: "fail",
  },
  {
    name: "fail: starts with a euro sign followed by digits",
    text: "€10,000 threshold for the Spanish Modelo 720.",
    expect: "fail",
  },
  {
    name: "fail: starts with a hyphen-digit",
    text: "-5 days late and the IRS is already counting penalties.",
    expect: "fail",
  },
  {
    name: "fail: starts with an opening quote then digit",
    text: '"7 things every Wyoming LLC must file annually."',
    expect: "fail",
  },
  {
    name: "fail: starts with an opening guillemet then digit",
    text: "«7 errores que cometen los founders no residentes.",
    expect: "fail",
  },
  {
    name: "fail: starts with a parenthesis then digit",
    text: "(7) razones para no usar una LLC en Delaware.",
    expect: "fail",
  },
  {
    name: "fail: starts with an em-dash",
    text: "— 7 cosas que aprendí cerrando una LLC.",
    expect: "fail",
  },
  {
    name: "fail: empty string",
    text: "",
    expect: "fail",
  },
  {
    name: "fail: whitespace only",
    text: "   \t\n  ",
    expect: "fail",
  },
  {
    name: "fail: non-string input (undefined)",
    text: undefined,
    expect: "fail",
  },
  {
    name: "fail: non-string input (null)",
    text: null,
    expect: "fail",
  },
  {
    name: "fail: non-string input (number)",
    text: 7,
    expect: "fail",
  },

  // ---------------------------------------------------------------------------
  // Valid strings — the audit MUST pass these. If any of these starts
  // returning false, the rule has become too strict and clean copy would be
  // wrongly rejected.
  // ---------------------------------------------------------------------------
  {
    name: "pass: starts with a single digit then space",
    text: "7 pasos para abrir una LLC en Wyoming siendo no residente.",
    expect: "pass",
  },
  {
    name: "pass: starts with a multi-digit number",
    text: "112 errores fatales al constituir tu LLC desde España.",
    expect: "pass",
  },
  {
    name: "pass: starts with zero",
    text: "0 dólares en impuestos federales para una LLC unipersonal extranjera.",
    expect: "pass",
  },
  {
    name: "pass: starts with a year",
    text: "2026 trae cambios al BOIR para LLCs de no residentes.",
    expect: "pass",
  },
  {
    name: "pass: starts with a dollar amount where the digit is FIRST",
    text: "25,000 USD de multa del IRS bajo Form 5472.",
    expect: "pass",
  },
  {
    name: "pass: starts with a percentage",
    text: "21% federal corporate rate vs. LLC pass-through taxation.",
    expect: "pass",
  },
  {
    name: "pass: leading whitespace before a digit is tolerated",
    text: "   3 meses es el plazo para presentar el BOIR inicial.",
    expect: "pass",
  },
  {
    name: "pass: leading newline before a digit is tolerated",
    text: "\n5 razones para elegir Wyoming sobre Delaware en 2026.",
    expect: "pass",
  },
];

function run() {
  let passed = 0;
  const failures = [];

  for (const fx of FIXTURES) {
    const got = leadsWithDigit(fx.text);
    const wantTrue = fx.expect === "pass";

    if (got === wantTrue) {
      passed += 1;
      continue;
    }

    failures.push(
      `  [${fx.expect.toUpperCase()}] ${fx.name}\n         expected leadsWithDigit -> ${wantTrue}, got ${got}.\n         input: ${JSON.stringify(fx.text)}`,
    );
  }

  const total = FIXTURES.length;
  if (failures.length > 0) {
    console.error(
      `\n[blog-preview-numeric-hook-check.test] FAIL — ${failures.length} of ${total} fixture${total === 1 ? "" : "s"} mismatched:\n`,
    );
    for (const f of failures) console.error(f);
    console.error(
      `\n[blog-preview-numeric-hook-check.test] If you intentionally changed the digit-lead rule, update the fixtures in this file to match — but make sure the audit still rejects every preview snippet that does not literally start with a digit.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-preview-numeric-hook-check.test] OK — ${passed}/${total} fixtures matched the digit-lead rule.`,
  );
}

run();
