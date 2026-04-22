#!/usr/bin/env node
/*
 * blog-content-lint.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for the blog price-and-address guard. Feeds the guard a set of
 * synthetic fixtures and verifies which ones it flags vs. ignores.
 *
 * Covers (per Task #25):
 *   - Forbidden price mentions in each locale (en / es / ca / pt / fr / de)
 *   - Forbidden address / mail-forwarding phrases
 *   - Every allowlisted amount: $25K, $591/day, $250K, 2.9%, $0
 *
 * Exits with code 0 on success and 1 on any mismatch so CI / post-merge /
 * pre-deploy can fail fast if the guard's own regexes regress.
 * ----------------------------------------------------------------------------
 */

import { analyzeText } from "./blog-content-lint.mjs";

// Each fixture is { name, text, expect: "flag" | "pass", kind?, locale? }.
// "flag" means the guard MUST report at least one finding for the line.
// "pass" means the guard MUST NOT report a finding for the line.
const FIXTURES = [
  // -------------------------------------------------------------------------
  // Forbidden price mentions — one per locale block in the guard's regex.
  // -------------------------------------------------------------------------
  {
    name: "en: state filing fee + dollar amount",
    text: "The state filing fee is $120 in Delaware.",
    expect: "flag",
    kind: "price",
    locale: "en",
  },
  {
    name: "en: registered agent fee",
    text: "A registered agent costs $99 per year.",
    expect: "flag",
    kind: "price",
    locale: "en",
  },
  {
    name: "es: tarifa estatal + dollar amount",
    text: "La tarifa estatal es $150 para formar la LLC.",
    expect: "flag",
    kind: "price",
    locale: "es",
  },
  {
    name: "es: cuota anual + dollar amount",
    text: "La cuota anual del agente registrado es $125.",
    expect: "flag",
    kind: "price",
    locale: "es",
  },
  {
    name: "ca: informe anual + dollar amount (shared es/ca keyword)",
    text: "Segons l'informe anual, la tarifa és de $175.",
    expect: "flag",
    kind: "price",
    locale: "ca",
  },
  {
    name: "pt: taxa estadual + dollar amount",
    text: "A taxa estadual é de $140 em Wyoming.",
    expect: "flag",
    kind: "price",
    locale: "pt",
  },
  {
    name: "pt: agente registado + dollar amount",
    text: "O agente registado custa $90 por ano.",
    expect: "flag",
    kind: "price",
    locale: "pt",
  },
  {
    name: "fr: frais de dépôt + dollar amount",
    text: "Les frais de dépôt s'élèvent à $160.",
    expect: "flag",
    kind: "price",
    locale: "fr",
  },
  {
    name: "fr: taxe de franchise + dollar amount",
    text: "La taxe de franchise est de $300 au Delaware.",
    expect: "flag",
    kind: "price",
    locale: "fr",
  },
  {
    name: "de: Anmeldegebühr + dollar amount",
    text: "Die Anmeldegebühr beträgt $150 in Delaware.",
    expect: "flag",
    kind: "price",
    locale: "de",
  },
  {
    name: "de: Gründungsgebühr + dollar amount",
    text: "Die Gründungsgebühr liegt bei $199 für eine LLC.",
    expect: "flag",
    kind: "price",
    locale: "de",
  },

  // -------------------------------------------------------------------------
  // Forbidden address / mail-forwarding phrases.
  // -------------------------------------------------------------------------
  {
    name: "address: concrete US street address",
    text: "Our office is at 1209 Orange Street in Wilmington.",
    expect: "flag",
    kind: "address",
  },
  {
    name: "address: Suite + number",
    text: "Delivered to Suite 400 of our partner building.",
    expect: "flag",
    kind: "address",
  },
  {
    name: "address: P.O. Box + number",
    text: "Mail forwarded to P.O. Box 1234 for the LLC.",
    expect: "flag",
    kind: "address",
  },
  {
    name: "address: virtual address service bundle",
    text: "We include virtual address service for your LLC.",
    expect: "flag",
    kind: "address",
  },
  {
    name: "address: mailing address included bundle",
    text: "We offer mailing address included with every LLC formation.",
    expect: "flag",
    kind: "address",
  },
  {
    name: "address: generic compliance phrasing must NOT flag",
    text: "A registered agent must have a physical address in the state.",
    expect: "pass",
  },

  // -------------------------------------------------------------------------
  // Allowlist — every legitimate amount must survive even alongside a
  // forbidden context word.
  // -------------------------------------------------------------------------
  {
    name: "allow: $25,000 IRS Form 5472 penalty (long form)",
    text: "The IRS imposes a $25,000 penalty under Form 5472 even when no state filing fee applies.",
    expect: "pass",
  },
  {
    name: "allow: $25K shorthand with '25K penalty' line marker",
    text: "The $25K penalty applies regardless of any state filing fee paid.",
    expect: "pass",
  },
  {
    name: "allow: $591 per day FinCEN BOI civil penalty",
    text: "FinCEN can charge $591 per day under BOI rules on top of any filing fee dispute.",
    expect: "pass",
  },
  {
    name: "allow: $591/día BOIR (Spanish framing)",
    text: "La multa de $591/día del BOIR se aplica aunque pagues la tarifa estatal.",
    expect: "pass",
  },
  {
    name: "allow: $250,000 FDIC insurance limit",
    text: "FDIC insures up to $250,000 per depositor, independent of any annual report.",
    expect: "pass",
  },
  {
    name: "allow: $250K FDIC shorthand",
    text: "FDIC covers $250K per depositor even if you owe a franchise tax.",
    expect: "pass",
  },
  {
    name: "allow: 2.9% Stripe processing rate",
    text: "Stripe charges 2.9% per transaction, which is separate from any annual report filing.",
    expect: "pass",
  },
  {
    name: "allow: $0 editorial 'LLC owes $0 federal tax'",
    text: "The LLC owes $0 in federal franchise tax when the owner is a non-resident.",
    expect: "pass",
  },

  // -------------------------------------------------------------------------
  // Fear-of-Hacienda phrasing (Task #25).
  // Emotional words are always flagged. Prison/jail words are allowed only
  // when the line carries a legal-reference marker (penalty/fine/IRC/§/years).
  // -------------------------------------------------------------------------
  {
    name: "fear: es 'te van a pillar'",
    text: "Si no declaras, te van a pillar tarde o temprano.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: es 'sustos' editorial",
    text: "Cierra tu LLC sin sustos a tres años vista.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: es 'pánico'",
    text: "No entres en pánico si no presentaste el formulario.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: en 'panic'",
    text: "Don't panic if Form 5472 is overdue.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: fr 'panique'",
    text: "Pas de panique, il existe des solutions.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: de 'Panik'",
    text: "Geraten Sie nicht in Panik bei einer verspäteten Einreichung.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: pt 'pânico'",
    text: "Não entres em pânico se não apresentaste o formulário.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "fear: es 'cárcel' WITHOUT legal context",
    text: "Si lo haces mal acabas en la cárcel.",
    expect: "flag",
    kind: "fear",
  },
  {
    name: "allow: en 'prison' WITH legal-reference context (fine + years)",
    text: "Penalty: $10,000 fine and up to 2 years in prison for willful violations.",
    expect: "pass",
  },
  {
    name: "allow: en 'imprisonment' WITH IRC reference",
    text: "Tax fraud | Up to $250,000 + 5 years imprisonment | IRC §7206",
    expect: "pass",
  },
  {
    name: "allow: es 'prisión' WITH article reference",
    text: "Sanciones: 1-5 años de prisión y multa por art. 305 CP.",
    expect: "pass",
  },

  // -------------------------------------------------------------------------
  // Clean lines — no forbidden context, no address pattern. Must pass.
  // -------------------------------------------------------------------------
  {
    name: "clean: plain editorial text",
    text: "An LLC is a popular vehicle for non-resident founders.",
    expect: "pass",
  },
  {
    name: "clean: dollar amount without forbidden context",
    text: "You might earn $5,000 in your first month of sales.",
    expect: "pass",
  },
];

function run() {
  let passed = 0;
  const failures = [];

  for (const fx of FIXTURES) {
    const findings = analyzeText(fx.text);
    const flagged = findings.length > 0;

    if (fx.expect === "flag") {
      if (!flagged) {
        failures.push(
          `  [MISS] ${fx.name}\n         expected guard to FLAG but it did not.\n         line: ${fx.text}`,
        );
        continue;
      }
      if (fx.kind && !findings.some((f) => f.kind === fx.kind)) {
        failures.push(
          `  [KIND] ${fx.name}\n         expected kind="${fx.kind}" but got: ${findings
            .map((f) => f.kind)
            .join(", ")}\n         line: ${fx.text}`,
        );
        continue;
      }
      passed += 1;
    } else {
      if (flagged) {
        failures.push(
          `  [FALSE+] ${fx.name}\n         expected guard to IGNORE but it flagged: ${JSON.stringify(
            findings,
          )}\n         line: ${fx.text}`,
        );
        continue;
      }
      passed += 1;
    }
  }

  const total = FIXTURES.length;
  if (failures.length > 0) {
    console.error(
      `\n[blog-content-lint.test] FAIL — ${failures.length} of ${total} fixture${total === 1 ? "" : "s"} mismatched:\n`,
    );
    for (const f of failures) console.error(f);
    console.error(
      `\n[blog-content-lint.test] If you intentionally changed the guard's regexes, update the fixtures in this file to match.`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-content-lint.test] OK — ${passed}/${total} fixtures matched the guard's expected behaviour.`,
  );
}

run();
