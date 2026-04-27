#!/usr/bin/env node
/*
 * lint-banned-banking-entities.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for the banned-banking-entity guard. Verifies:
 *   - The phrase table loads and contains the canonical "Revolut Payments USA"
 *     entry (the original Task #32 trigger).
 *   - Case-insensitive matching catches "revolut payments usa", "Revolut
 *     Payments USA", and "REVOLUT PAYMENTS USA".
 *   - Whitespace flexibility catches editorial wraps like "Revolut\nPayments
 *     USA" and "Revolut  Payments  USA".
 *   - Clean copy that mentions the correct entity ("Revolut Technologies
 *     Inc." with "Lead Bank") is NOT flagged.
 *   - Findings carry a usable line number, matched text, and reason field.
 *
 * Exits 0 on success, 1 on any mismatch so CI fails fast if the guard's
 * regex builder regresses.
 * ----------------------------------------------------------------------------
 */

import { analyzeText, loadTable } from "./lint-banned-banking-entities.mjs";

const FIXTURES = [
  {
    name: "exact phrase, lowercase",
    text: 'export const post = { body: "We use revolut payments usa as the partner." };',
    expect: "flag",
  },
  {
    name: "exact phrase, title case",
    text: 'export const post = { body: "Revolut Payments USA acts as the US partner." };',
    expect: "flag",
  },
  {
    name: "exact phrase, all caps",
    text: 'export const post = { body: "REVOLUT PAYMENTS USA is the entity." };',
    expect: "flag",
  },
  {
    name: "wrapped across lines",
    text: 'export const post = {\n  body: "Revolut\nPayments USA handles US accounts.",\n};',
    expect: "flag",
  },
  {
    name: "extra whitespace inside phrase",
    text: 'export const post = { body: "Revolut   Payments   USA partners with..." };',
    expect: "flag",
  },
  {
    name: "correct entity (Revolut Technologies Inc. + Lead Bank)",
    text: 'export const post = { body: "Revolut Business for US LLCs runs through Revolut Technologies Inc. with Lead Bank as banking partner." };',
    expect: "pass",
  },
  {
    name: "Revolut Business EU (legitimate, no USA suffix)",
    text: 'export const post = { body: "Revolut Business in the EU is regulated as Revolut Bank UAB." };',
    expect: "pass",
  },
  {
    name: "Lead Bank alone (legitimate)",
    text: 'export const post = { body: "Lead Bank is the FDIC-insured US partner." };',
    expect: "pass",
  },
];

function runFixtures(table) {
  let failures = 0;
  for (const fx of FIXTURES) {
    const findings = analyzeText(fx.text, table);
    const flagged = findings.length > 0;
    const ok = fx.expect === "flag" ? flagged : !flagged;
    if (!ok) {
      failures += 1;
      console.error(
        `FAIL  ${fx.name}\n      expected ${fx.expect}, got ${flagged ? "flag" : "pass"} (${findings.length} finding${findings.length === 1 ? "" : "s"})`,
      );
      for (const f of findings) {
        console.error(`        line ${f.line}: "${f.match}" (${f.phrase})`);
      }
    } else {
      console.log(`PASS  ${fx.name}`);
    }
  }
  return failures;
}

function runTableShape(table) {
  let failures = 0;
  if (!Array.isArray(table) || table.length === 0) {
    console.error("FAIL  table shape: phrases array is empty");
    return 1;
  }
  console.log(`PASS  table shape: ${table.length} phrase entr${table.length === 1 ? "y" : "ies"} loaded`);

  const hasRevolut = table.some(
    (entry) => entry.phrase.toLowerCase() === "revolut payments usa",
  );
  if (!hasRevolut) {
    failures += 1;
    console.error('FAIL  table content: missing canonical "Revolut Payments USA" entry');
  } else {
    console.log('PASS  table content: canonical "Revolut Payments USA" entry present');
  }
  return failures;
}

function runFindingShape(table) {
  let failures = 0;
  const text = 'line 1\nline 2 mentions Revolut Payments USA inline\nline 3';
  const findings = analyzeText(text, table);
  if (findings.length !== 1) {
    failures += 1;
    console.error(`FAIL  finding shape: expected exactly 1 finding, got ${findings.length}`);
    return failures;
  }
  const [finding] = findings;
  const checks = [
    ["line number", finding.line === 2],
    ["match text", typeof finding.match === "string" && /revolut payments usa/i.test(finding.match)],
    ["phrase field", finding.phrase === "Revolut Payments USA"],
    ["reason field non-empty", typeof finding.reason === "string" && finding.reason.length > 0],
    ["context text", typeof finding.text === "string" && finding.text.includes("Revolut Payments USA")],
  ];
  for (const [label, ok] of checks) {
    if (!ok) {
      failures += 1;
      console.error(`FAIL  finding shape: ${label}`);
    } else {
      console.log(`PASS  finding shape: ${label}`);
    }
  }
  return failures;
}

function main() {
  const table = loadTable();
  let failures = 0;
  failures += runTableShape(table);
  failures += runFixtures(table);
  failures += runFindingShape(table);

  if (failures > 0) {
    console.error(
      `\n[lint-banned-banking-entities.test] FAIL — ${failures} test${failures === 1 ? "" : "s"} failed.`,
    );
    process.exit(1);
  }
  console.log(`\n[lint-banned-banking-entities.test] OK — all tests passed.`);
}

main();
