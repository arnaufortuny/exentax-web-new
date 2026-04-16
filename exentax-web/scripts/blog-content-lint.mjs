#!/usr/bin/env node
/*
 * blog-content-lint.mjs
 * ----------------------------------------------------------------------------
 * Guard that scans the blog post data files and blocks any reintroduction of
 * forbidden price/fee mentions removed during Task #8.
 *
 * What it checks
 * --------------
 * For every line in `client/src/data/blog-posts*.ts`, the script flags:
 *
 *  1. Any `$<amount>` mention that sits in the same line as a forbidden
 *     LLC-services context word (state filing fee, franchise tax, registered
 *     agent service fee, EIN fee, annual report fee, formation/incorporation
 *     fee, and their es/ca/pt/fr/de translations).
 *  2. Any phrase that advertises a physical / mailing / virtual address bundled
 *     with the LLC service (we no longer publish concrete street addresses or
 *     "mail forwarding" pricing in the blog).
 *
 * Allowlist (legitimate amounts that MUST stay readable)
 * ------------------------------------------------------
 *  - $25,000 / $25K   IRS late-filing penalty for Form 5472 / 1120
 *  - $591/day         FinCEN BOI civil penalty (also $591 per day, $591/día)
 *  - $250,000 / $250K FDIC insurance coverage limit per depositor
 *  - 2.9%             Stripe / payment-processor base processing rate
 *  - $0               Used to state "the LLC owes $0 federal tax" — editorial
 *                     tax commentary, not a price/fee, so it is allowed.
 *
 *  Shorthand forms ($25K, $25k, $250K) are recognised so editorial copy can
 *  use compact phrasing inside meta descriptions and excerpts.
 *
 * Anything that matches the allowlist above is excluded from the report even
 * when it appears next to a forbidden context word.
 *
 * Exit code
 * ---------
 *  0  no findings
 *  1  one or more forbidden patterns detected (CI / pre-commit will fail)
 *
 * Usage
 * -----
 *  node scripts/blog-content-lint.mjs           # from exentax-web/
 *  npm run lint:blog                            # via package.json script
 * ----------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const DATA_DIR = join(REPO_DIR, "client", "src", "data");

const TARGET_PREFIX = "blog-posts";
const TARGET_SUFFIX = ".ts";

// ---------------------------------------------------------------------------
// Allowlist: regexes that match legitimate amounts and keep them readable.
// Order matters only for clarity; all are tried before flagging a line.
// ---------------------------------------------------------------------------
const ALLOWED_AMOUNT_PATTERNS = [
  /^\$\s?25[.,]?000$/i,           // IRS Form 5472/1120 penalty
  /^\$\s?25\s?k$/i,               // $25K shorthand for the same penalty
  /^\$\s?591$/i,                  // FinCEN BOI penalty (per day)
  /^\$\s?250[.,]?000$/i,          // FDIC insurance limit
  /^\$\s?250\s?k$/i,              // $250K shorthand for FDIC limit
  /^\$\s?0$/i,                    // "$0 federal tax" editorial usage
];

// Substrings that, when present anywhere on a line, mean the dollar amounts
// on that line are pre-vetted editorial references (IRS / BOI / FDIC / Stripe).
// We use line-level allowlisting in addition to per-amount allowlisting so
// shorthand forms like "$25K penalty" and split phrasings like "$591 per day"
// are not flagged.
const ALLOWED_LINE_MARKERS = [
  /\b25\s?k\b\s*(?:penalty|multa|amende|strafe|penalidade|sanci(?:o|ó)n)/i,
  /Form\s*5472/i,
  /BOI(?:R)?\b|Beneficial\s+Ownership/i,
  /FDIC/i,
  /\b2[.,]9\s?%/,                 // Stripe base rate (line-level)
];

// ---------------------------------------------------------------------------
// Forbidden context words. If a line contains any of these AND a non-allowed
// dollar amount, it is flagged.
// ---------------------------------------------------------------------------
const FORBIDDEN_CONTEXT = new RegExp(
  [
    // English
    "filing fee",
    "franchise tax",
    "registered agent",
    "annual report",
    "formation fee",
    "incorporation fee",
    "state fee",
    "EIN (?:application|filing|fee|cost|price)",
    // Spanish / Catalan
    "tarifa estatal",
    "tasa estatal",
    "cuota anual",
    "agente registrado",
    "informe anual",
    "impuesto de franquicia",
    "tarifa de formaci(?:o|ó)n",
    "coste de constituci(?:o|ó)n",
    // Portuguese
    "agente registado",
    "agente registrado",
    "taxa estadual",
    "imposto de franquia",
    "relat(?:o|ó)rio anual",
    // French
    "frais de d(?:e|é)p(?:o|ô)t",
    "agent enregistr(?:e|é)",
    "taxe de franchise",
    "rapport annuel",
    "frais de formation",
    // German
    "Anmeldegeb(?:u|ü)hr",
    "registrierter Vertreter",
    "Franchise[- ]?Steuer",
    "Jahresbericht",
    "Annual Report",
    "Gr(?:u|ü)ndungsgeb(?:u|ü)hr",
  ].join("|"),
  "i",
);

// Address-style mentions we no longer publish in blog copy. We deliberately
// keep these narrow so generic compliance education ("a Registered Agent must
// have a physical address in the state") is NOT flagged. We only block:
//   - concrete US street addresses (number + street name + street suffix)
//   - Suite / Ste / PO Box numbers (publishing a real mailing address)
//   - explicit sales pitches that bundle a mailing/virtual address with the
//     LLC service ("virtual address included", "mailing address service")
const FORBIDDEN_ADDRESS = new RegExp(
  [
    "\\b\\d{2,5}\\s+[A-Z][\\w.'-]+(?:\\s+[A-Z][\\w.'-]+)*\\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Dr|Drive|Ln|Lane|Way|Ct|Court|Pl|Place|Pkwy|Hwy)\\b",
    "\\b(?:Suite|Ste\\.?|P\\.?\\s?O\\.?\\s?Box)\\s+\\d+",
    "(?:virtual|mailing|business)\\s+address\\s+(?:service|included|provided|for\\s+(?:your|the)\\s+LLC)",
  ].join("|"),
);

// Matches dollar amounts including shorthand ($25K, $250k) and standard forms.
const DOLLAR_AMOUNT = /\$\s?\d[\d.,]*\s?[Kk]?/g;

// ---------------------------------------------------------------------------
function listBlogFiles() {
  return readdirSync(DATA_DIR)
    .filter((name) => name.startsWith(TARGET_PREFIX) && name.endsWith(TARGET_SUFFIX))
    .map((name) => join(DATA_DIR, name))
    .filter((path) => statSync(path).isFile());
}

function isAllowedAmount(amountLiteral) {
  const trimmed = amountLiteral.trim();
  return ALLOWED_AMOUNT_PATTERNS.some((rx) => rx.test(trimmed));
}

function lineIsAllowlisted(line) {
  return ALLOWED_LINE_MARKERS.some((rx) => rx.test(line));
}

function lineHasForbiddenAmount(line) {
  if (!FORBIDDEN_CONTEXT.test(line)) return null;
  if (lineIsAllowlisted(line)) return null;
  const amounts = line.match(DOLLAR_AMOUNT) ?? [];
  const offending = amounts.filter((a) => !isAllowedAmount(a));
  if (offending.length === 0) return null;
  return { kind: "price", amounts: offending };
}

function lineHasForbiddenAddress(line) {
  const m = line.match(FORBIDDEN_ADDRESS);
  return m ? { kind: "address", match: m[0] } : null;
}

function scanFile(filePath) {
  const findings = [];
  const lines = readFileSync(filePath, "utf8").split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const price = lineHasForbiddenAmount(line);
    if (price) findings.push({ line: i + 1, text: line.trim(), ...price });
    const address = lineHasForbiddenAddress(line);
    if (address) findings.push({ line: i + 1, text: line.trim(), ...address });
  }
  return findings;
}

function format(filePath, finding) {
  const rel = relative(REPO_DIR, filePath);
  const detail =
    finding.kind === "price"
      ? `forbidden price reference (${finding.amounts.join(", ")})`
      : `forbidden address reference ("${finding.match}")`;
  return `${rel}:${finding.line}  ${detail}\n    ${finding.text}`;
}

/**
 * Analyze a raw text body line-by-line and return the findings the guard
 * would report for it. Exported so the unit test can feed synthetic
 * fixtures without touching the real blog data files.
 */
export function analyzeText(text) {
  const findings = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const price = lineHasForbiddenAmount(line);
    if (price) findings.push({ line: i + 1, text: line.trim(), ...price });
    const address = lineHasForbiddenAddress(line);
    if (address) findings.push({ line: i + 1, text: line.trim(), ...address });
  }
  return findings;
}

export {
  ALLOWED_AMOUNT_PATTERNS,
  ALLOWED_LINE_MARKERS,
  FORBIDDEN_CONTEXT,
  FORBIDDEN_ADDRESS,
  isAllowedAmount,
  lineIsAllowlisted,
  lineHasForbiddenAmount,
  lineHasForbiddenAddress,
};

function main() {
  const files = listBlogFiles();
  if (files.length === 0) {
    console.error(`[blog-content-lint] No blog files found under ${DATA_DIR}`);
    process.exit(2);
  }

  let total = 0;
  for (const file of files) {
    const findings = scanFile(file);
    for (const f of findings) {
      total += 1;
      console.log(format(file, f));
    }
  }

  if (total > 0) {
    console.error(
      `\n[blog-content-lint] FAIL — ${total} forbidden mention${total === 1 ? "" : "s"} found across ${files.length} file${files.length === 1 ? "" : "s"}.`,
    );
    console.error(
      `[blog-content-lint] Allowed amounts: $25,000 (IRS), $591/day (BOI), $250,000 (FDIC), 2.9% (Stripe), $0 (editorial).`,
    );
    process.exit(1);
  }

  console.log(
    `[blog-content-lint] OK — scanned ${files.length} file${files.length === 1 ? "" : "s"}, no forbidden mentions.`,
  );
}

// Only auto-run when invoked as a CLI script, so unit tests can import
// the module without triggering a real scan of the blog data files.
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
