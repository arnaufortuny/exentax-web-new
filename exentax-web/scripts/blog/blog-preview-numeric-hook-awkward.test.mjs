#!/usr/bin/env node
/*
 * blog-preview-numeric-hook-awkward.test.mjs
 * ----------------------------------------------------------------------------
 * Unit test for Task #12 — pin the "awkward-year-opener" rule used by
 * `blog-preview-numeric-hook-check.mjs` to audit metaDescription /
 * socialDescription / ogDescription across the localized blog variants.
 *
 * The rule lives in two helpers inside the audit script:
 *
 *   - `firstSentence(text)`           — segments off the first sentence,
 *                                       respecting common abbreviation
 *                                       periods ("art.", "EE.UU.", "U.S.")
 *                                       and thousand separators ("600.000")
 *                                       so the awkward-opener check sees the
 *                                       real opener instead of a fragment.
 *   - `isAwkwardNumericOpener(text)`  — flags previews whose first sentence
 *                                       (or leading non-whitespace fragment)
 *                                       is a bare 4-digit year (1900-2099)
 *                                       followed by a SERP-awkward soft
 *                                       separator: "." (full stop), ":" (also
 *                                       the French " :" form), " - ", " – ",
 *                                       " — ".
 *
 * Tasks #41 and #54 added these guards; production currently has zero
 * offenders. Without unit tests, a future refactor of the regexes could
 * silently weaken the rule and let dangling-label snippets slip back into
 * the SERP / social cards. This test pins the helpers' behaviour so any
 * regression fails fast in `check:serial` / CI / post-merge.
 *
 * Exits 0 on success, 1 on any mismatch.
 * ----------------------------------------------------------------------------
 */

import {
  firstSentence,
  isAwkwardNumericOpener,
} from "./blog-preview-numeric-hook-check.mjs";

// ---------------------------------------------------------------------------
// firstSentence fixtures
// ---------------------------------------------------------------------------
// The rule's awkward-year detection runs against `firstSentence(text)`, so
// any miss-segmentation here would silently change what the awkward rule
// inspects. The fixtures below pin the abbreviation-period and
// thousand-separator handling that protects multi-sentence localized copy.
const FIRST_SENTENCE_FIXTURES = [
  {
    name: 'firstSentence: keeps "art." as an abbreviation, not a terminator',
    text: "art. 27 del reglamento aplica aquí. Sigue otra frase.",
    expect: "art. 27 del reglamento aplica aquí.",
  },
  {
    name: 'firstSentence: keeps "EE.UU." as an abbreviation (compound dotted)',
    text: "EE.UU. recauda más de lo previsto. Otra frase aparte.",
    expect: "EE.UU. recauda más de lo previsto.",
  },
  {
    name: 'firstSentence: keeps "U.S." as an abbreviation (compound dotted)',
    text: "U.S. Treasury rules apply here. Next sentence follows.",
    expect: "U.S. Treasury rules apply here.",
  },
  {
    name: 'firstSentence: thousand separator "600.000" does not split',
    text: "Pagas 600.000 euros al año en impuestos. Y otra frase.",
    expect: "Pagas 600.000 euros al año en impuestos.",
  },
  {
    name: "firstSentence: returns the whole string when there is no terminator",
    text: "7 razones para abrir una LLC en Wyoming siendo no residente",
    expect: "7 razones para abrir una LLC en Wyoming siendo no residente",
  },
  {
    name: "firstSentence: empty string returns empty string",
    text: "",
    expect: "",
  },
  {
    name: "firstSentence: non-string input returns empty string",
    text: undefined,
    expect: "",
  },
];

// ---------------------------------------------------------------------------
// isAwkwardNumericOpener fixtures
// ---------------------------------------------------------------------------
// "fires" means the helper MUST return true (the snippet is an awkward
//   year-only opener and the audit MUST flag it).
// "passes" means the helper MUST return false (the snippet is safe and the
//   audit MUST let it through).
const AWKWARD_FIXTURES = [
  // ---- MUST FIRE -----------------------------------------------------------
  {
    name: 'fires: bare-year-with-period ("1970. What your bank reports...")',
    text: "1970. What your bank reports differently in 2026.",
    expect: "fires",
  },
  {
    name: 'fires: year-with-colon ("2014: tax filing changes")',
    text: "2014: tax filing changes you should plan for.",
    expect: "fires",
  },
  {
    name: 'fires: French-style year-space-colon ("2014 : ...")',
    text: "2014 : modifications fiscales pour la France.",
    expect: "fires",
  },
  {
    name: 'fires: year-with-hyphen ("2014 - changes")',
    text: "2014 - changes to filing deadlines for non-residents.",
    expect: "fires",
  },
  {
    name: 'fires: year-with-en-dash ("2014 – changes")',
    text: "2014 \u2013 changes to filing deadlines for non-residents.",
    expect: "fires",
  },
  {
    name: 'fires: year-with-em-dash ("2014 — changes")',
    text: "2014 \u2014 changes to filing deadlines for non-residents.",
    expect: "fires",
  },

  // ---- MUST PASS -----------------------------------------------------------
  {
    name: 'passes: range with no surrounding spaces ("2014-2024 changes")',
    text: "2014-2024 changes to BOIR filing windows for Wyoming LLCs.",
    expect: "passes",
  },
  {
    name: "passes: year not at the start of the snippet",
    text: "7 reasons to file in 2026 before the BOIR window closes.",
    expect: "passes",
  },
  {
    name: "passes: Spanish-master copy that is not an awkward opener",
    text: "7 pasos para constituir tu LLC en Wyoming siendo no residente.",
    expect: "passes",
  },
  {
    name: "passes: empty string",
    text: "",
    expect: "passes",
  },
  {
    name: "passes: non-string input (undefined)",
    text: undefined,
    expect: "passes",
  },
];

function runFirstSentence() {
  const failures = [];
  let passed = 0;
  for (const fx of FIRST_SENTENCE_FIXTURES) {
    const got = firstSentence(fx.text);
    if (got === fx.expect) {
      passed += 1;
      continue;
    }
    failures.push(
      `  ${fx.name}\n         expected firstSentence -> ${JSON.stringify(fx.expect)}\n         got                    -> ${JSON.stringify(got)}\n         input                  -> ${JSON.stringify(fx.text)}`,
    );
  }
  return { passed, total: FIRST_SENTENCE_FIXTURES.length, failures };
}

function runAwkward() {
  const failures = [];
  let passed = 0;
  for (const fx of AWKWARD_FIXTURES) {
    const got = isAwkwardNumericOpener(fx.text);
    const wantTrue = fx.expect === "fires";
    if (got === wantTrue) {
      passed += 1;
      continue;
    }
    failures.push(
      `  [${fx.expect.toUpperCase()}] ${fx.name}\n         expected isAwkwardNumericOpener -> ${wantTrue}, got ${got}.\n         input: ${JSON.stringify(fx.text)}`,
    );
  }
  return { passed, total: AWKWARD_FIXTURES.length, failures };
}

function run() {
  const fs = runFirstSentence();
  const aw = runAwkward();

  const allFailures = [...fs.failures, ...aw.failures];
  if (allFailures.length > 0) {
    console.error(
      `\n[blog-preview-numeric-hook-awkward.test] FAIL — ${allFailures.length} fixture${allFailures.length === 1 ? "" : "s"} mismatched (firstSentence: ${fs.failures.length}/${fs.total}, isAwkwardNumericOpener: ${aw.failures.length}/${aw.total}):\n`,
    );
    for (const f of allFailures) console.error(f);
    console.error(
      `\n[blog-preview-numeric-hook-awkward.test] If you intentionally changed the awkward-year-opener rule or the sentence-segmentation helper, update the fixtures in this file to match — but make sure the audit still rejects bare-year openers (period / colon / hyphen / en-dash / em-dash) on metaDescription, socialDescription and ogDescription for every non-ES variant.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-preview-numeric-hook-awkward.test] OK — firstSentence ${fs.passed}/${fs.total}, isAwkwardNumericOpener ${aw.passed}/${aw.total}.`,
  );
}

run();
