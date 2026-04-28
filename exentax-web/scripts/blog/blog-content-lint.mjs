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
 *  node scripts/blog/blog-content-lint.mjs           # from exentax-web/
 *  npm run lint:blog                            # via package.json script
 * ----------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..", "..");
const DATA_DIR = join(REPO_DIR, "client", "src", "data");
const BLOG_CONTENT_DIR = join(DATA_DIR, "blog-content");

const TARGET_PREFIX = "blog-posts";
const TARGET_SUFFIX = ".ts";

// Per-locale article files that the renderer reads via dynamic import.
// Each subdirectory under blog-content/ is one locale (es, en, fr, de, pt, ca).
const BLOG_CONTENT_LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

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

// ---------------------------------------------------------------------------
// Task #25: fear-of-Hacienda phrasing.
// Editorial line is "alarm about cost of being autónomo in Spain", NOT fear
// of Hacienda. The patterns below split into two groups:
//
//   * EMOTIONAL: words like "pánico", "susto", "te van a pillar". These are
//     never legitimate in our blog. They are flagged on every line.
//   * PRISON: words like "cárcel", "prison", "imprisonment", "Gefängnis".
//     These ARE legitimate when citing actual legal penalties (Form 5472,
//     BOI Report, IRC §, "X years in prison" in a fines table). We allow
//     them only when the same line carries a legal-reference marker
//     (penalty/fine/multa/sanción/Strafe/amende/IRC/FinCEN/BOI/Form/§ + a
//     numeric duration in years/años/anos/ans/Jahre).
// ---------------------------------------------------------------------------
const FORBIDDEN_FEAR_EMOTIONAL = new RegExp(
  [
    "\\bte\\s+van\\s+a\\s+pillar\\b",
    "\\bsustos?\\b",
    "\\bp[áâa]nico\\b",
    "\\bpanic\\b",
    "\\bpanique\\b",
    "\\bPanik\\b",
  ].join("|"),
  "i",
);

const FORBIDDEN_FEAR_PRISON = new RegExp(
  [
    "\\bc[áa]rcel\\b",
    "\\bprison\\b",
    "\\bjail\\b",
    "\\bimprisonment\\b",
    "\\bGef[äa]ngnis\\b",
    "\\bprisi[oó]n\\b",
    "\\bprisão\\b",
  ].join("|"),
  "i",
);

const FEAR_LEGAL_MARKERS = [
  /\bpenalt(?:y|ies)\b|\bfines?\b|\bmultas?\b|\bsanci[oó]n(?:es)?\b|\bStrafen?\b|\bamendes?\b|\bsan(?:c|ç)(?:ã|a)o\b/i,
  /\bIRC\b|\bFinCEN\b|\bBOI\b|Form\s*\d{3,4}|§\s*\d/i,
  /\b\d+\s*(?:[-–]\s*\d+\s*)?(?:years?|a[nñ]os?|anos?|ans?|Jahre?)\b/i,
  /\bart(?:[ií]culo)?\.?\s*\d+/i,
];

function lineHasFearLegalMarker(line) {
  return FEAR_LEGAL_MARKERS.some((rx) => rx.test(line));
}

function lineHasForbiddenFear(line) {
  const emotional = line.match(FORBIDDEN_FEAR_EMOTIONAL);
  if (emotional) {
    return { kind: "fear", match: emotional[0] };
  }
  const prison = line.match(FORBIDDEN_FEAR_PRISON);
  if (prison && !lineHasFearLegalMarker(line)) {
    return { kind: "fear", match: prison[0] };
  }
  return null;
}

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
// Bare-URL rule (Task #38). Markdown links of the form `[domain.tld](https://domain.tld)`
// are prohibited — they look like raw dumps of search results, not editorial
// citations. A human-readable label is mandatory. We flag any markdown link
// where the visible text is a domain literal (with TLD) that matches the
// domain inside the parentheses, OR a plain "https://…" inside square brackets.
// ---------------------------------------------------------------------------
const BARE_URL_LINK = /\[\s*((?:https?:\/\/)?[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(?:\/[^\]]*)?)\s*\]\(\s*((?:https?:\/\/)?[^)]+)\s*\)/gi;

function lineHasBareUrlLink(line) {
  let m;
  BARE_URL_LINK.lastIndex = 0;
  while ((m = BARE_URL_LINK.exec(line))) {
    const visible = m[1].trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    const target = m[2].trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    // Visible text starts with "http" → always a bare URL.
    if (m[1].trim().toLowerCase().startsWith("http")) {
      return { kind: "bare-url", match: m[0] };
    }
    // Visible text == target (or visible is the target's host) → bare URL.
    const visibleHost = visible.split("/")[0];
    const targetHost = target.split("/")[0];
    if (visibleHost === targetHost) {
      return { kind: "bare-url", match: m[0] };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
function listBlogFiles() {
  const rootFiles = readdirSync(DATA_DIR)
    .filter((name) => name.startsWith(TARGET_PREFIX) && name.endsWith(TARGET_SUFFIX))
    .map((name) => join(DATA_DIR, name))
    .filter((path) => statSync(path).isFile());

  const perLocaleFiles = [];
  for (const locale of BLOG_CONTENT_LOCALES) {
    const localeDir = join(BLOG_CONTENT_DIR, locale);
    let entries;
    try {
      entries = readdirSync(localeDir);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (!name.endsWith(TARGET_SUFFIX)) continue;
      const full = join(localeDir, name);
      if (statSync(full).isFile()) perLocaleFiles.push(full);
    }
  }

  return [...rootFiles, ...perLocaleFiles];
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
    const fear = lineHasForbiddenFear(line);
    if (fear) findings.push({ line: i + 1, text: line.trim(), ...fear });
    const bare = lineHasBareUrlLink(line);
    if (bare) findings.push({ line: i + 1, text: line.trim(), ...bare });
  }
  return findings;
}

function format(filePath, finding) {
  const rel = relative(REPO_DIR, filePath);
  let detail;
  if (finding.kind === "price") {
    detail = `forbidden price reference (${finding.amounts.join(", ")})`;
  } else if (finding.kind === "address") {
    detail = `forbidden address reference ("${finding.match}")`;
  } else if (finding.kind === "bare-url") {
    detail = `bare-URL markdown link (use a human label) — ${finding.match}`;
  } else {
    detail = `fear-of-Hacienda phrasing ("${finding.match}")`;
  }
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
    const fear = lineHasForbiddenFear(line);
    if (fear) findings.push({ line: i + 1, text: line.trim(), ...fear });
    const bare = lineHasBareUrlLink(line);
    if (bare) findings.push({ line: i + 1, text: line.trim(), ...bare });
  }
  return findings;
}

export {
  ALLOWED_AMOUNT_PATTERNS,
  ALLOWED_LINE_MARKERS,
  FORBIDDEN_CONTEXT,
  FORBIDDEN_ADDRESS,
  FORBIDDEN_FEAR_EMOTIONAL,
  FORBIDDEN_FEAR_PRISON,
  FEAR_LEGAL_MARKERS,
  isAllowedAmount,
  lineIsAllowlisted,
  lineHasForbiddenAmount,
  lineHasForbiddenAddress,
  lineHasForbiddenFear,
  lineHasFearLegalMarker,
};

// Audit 2026-04 pass 9 — build-failing guard against templated AI-style
// filler sentences in any blog-content/<lang>/*.ts file. Patterns were
// flagged by editorial review as low-signal boilerplate. Strip them with
// scripts/audit-2026-04-strip-fillers.mjs whenever a regression appears.
const FILLER_PATTERNS = [
  /\bPractical detail worth pinning down\b/g,
  /\bConcrete take from our case files\b/g,
  /\bThis is one of the points we audit first\b/g,
];
function scanContentDirForFillers() {
  const findings = [];
  const root = BLOG_CONTENT_DIR;
  if (!existsSyncSafe(root)) return findings;
  function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".ts")) {
        const txt = readFileSync(p, "utf8");
        const lines = txt.split("\n");
        for (let i = 0; i < lines.length; i++) {
          for (const pat of FILLER_PATTERNS) {
            const m = lines[i].match(pat);
            if (m) findings.push({ file: p, line: i + 1, match: m[0], text: lines[i].trim().slice(0, 160) });
          }
        }
      }
    }
  }
  walk(root);
  return findings;
}
function existsSyncSafe(p) {
  try { statSync(p); return true; } catch { return false; }
}

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
  // Editorial filler guard (audit 2026-04 pass 9).
  const fillerFindings = scanContentDirForFillers();
  for (const f of fillerFindings) {
    total += 1;
    const rel = relative(REPO_DIR, f.file);
    console.log(`${rel}:${f.line}  templated AI filler ("${f.match}") — strip with scripts/audit-2026-04-strip-fillers.mjs\n    ${f.text}`);
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
