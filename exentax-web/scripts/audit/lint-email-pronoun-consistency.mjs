#!/usr/bin/env node
/*
 * lint-email-pronoun-consistency.mjs
 * ----------------------------------------------------------------------------
 * Guard that scans every per-locale email i18n bundle under
 * `server/email-i18n/<lang>.ts` and fails the build if the two nurture
 * blocks (`calcDrip` and `drip`) drift apart in their form of address —
 * formal vs. informal pronouns — within the same language.
 *
 * Origin
 * ------
 * Task #40. We just fixed a French mismatch where `calcDrip` used the
 * formal "vous/votre/vos" while `drip` used the casual "tu/te/ton" —
 * something a manual copy review caught only after several rounds.
 * This lint locks the rule in: per language, both nurture sequences
 * MUST share the same register. Transactional blocks (booking,
 * reminder, calculator, reschedule, cancellation, noShow, followup,
 * incompleteBooking) are intentionally NOT scanned — they have their
 * own established voices and are out of scope for this guard.
 *
 * What it checks
 * --------------
 * For each language in {fr, de, es, pt, ca} (English skipped — no
 * formal/informal distinction), the script:
 *   1. Loads `server/email-i18n/<lang>.ts` as text.
 *   2. Brace-balances out the `calcDrip: { ... }` and `drip: { ... }`
 *      blocks, ignoring braces inside string literals.
 *   3. Counts word-bounded matches of the language's allowed informal
 *      and formal pronoun sets inside each block.
 *   4. Decides each block's register:
 *        - "informal"  → only informal markers found
 *        - "formal"    → only formal markers found
 *        - "mixed"     → BOTH found (drift inside one block)
 *        - "neutral"   → neither found (no signal — accepted as a no-op)
 *   5. Fails if either block is "mixed", or if both blocks have a
 *      definite register and they don't match.
 *
 * Allowed pronoun sets (deliberately conservative — only markers that
 * are unambiguous in second-person address are listed; ambiguous
 * possessives like Spanish "su", Portuguese/Catalan "seu/sua" or
 * sentence-start German "Sie/Ihre" are left out to avoid false
 * positives from third-person narration about Laura, Hacienda, etc.):
 *   - fr informal: tu, te, toi, ton, ta, tes
 *   - fr formal:   vous, votre, vos
 *   - de informal: du, dich, dir, dein, deine, deinem, deinen, deiner, deines
 *   - de formal:   Ihnen (case-sensitive — only formal in German)
 *   - es informal: tú, tu, te, ti, contigo
 *   - es formal:   usted, ustedes
 *   - pt informal: tu, te, ti, teu, tua, teus, tuas, contigo
 *   - pt formal:   você, vocês
 *   - ca informal: tu, et, teu, teva, teus, teves
 *   - ca formal:   vostè, vostès
 *
 * Exit code
 * ---------
 *  0  no drift
 *  1  one or more languages drift between calcDrip and drip
 *  2  no language files found at the expected path (misconfiguration)
 *
 * Usage
 * -----
 *  node scripts/audit/lint-email-pronoun-consistency.mjs   # from exentax-web/
 *  npm run lint:email-pronoun-consistency                  # via package.json
 * ----------------------------------------------------------------------------
 */

import { readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..", "..");
const EMAIL_I18N_DIR = join(REPO_DIR, "server", "email-i18n");

// English has no formal/informal pronoun distinction, so it is excluded
// from the scan on purpose. Adding "en" here would just produce empty
// counts and noise the CLI output.
const LANGUAGES = ["fr", "de", "es", "pt", "ca"];

// Per-language pronoun configuration. Each entry exposes a regex for
// the informal set and a regex for the formal set, plus a human
// label rendered in CLI output. Word boundaries are applied via `\b`
// in the patterns below; we keep the regexes case-insensitive
// EXCEPT for German "Ihnen" which is unambiguous only when capitalized
// (lowercase "ihnen" means "to them", not formal "to you").
const PRONOUN_SETS = {
  fr: {
    informal: {
      label: "tu/te/ton/ta/tes",
      regex: /\b(tu|te|toi|ton|ta|tes)\b/gi,
    },
    formal: {
      label: "vous/votre/vos",
      regex: /\b(vous|votre|vos)\b/gi,
    },
  },
  de: {
    informal: {
      label: "du/dich/dein",
      regex: /\b(du|dich|dir|dein|deine|deinem|deinen|deiner|deines)\b/gi,
    },
    formal: {
      // "Ihnen" is the only formal-you marker that is unambiguous in
      // German running text — capital "Sie" / "Ihr" / "Ihre" can also
      // be sentence-start third-person forms ("She wrote me…"), so we
      // omit them to keep the lint free of narration false positives.
      label: "Ihnen (formal)",
      regex: /\bIhnen\b/g,
    },
  },
  es: {
    informal: {
      label: "tú/te/tu",
      regex: /\b(tú|tu|te|ti|contigo)\b/gi,
    },
    formal: {
      label: "usted/ustedes",
      regex: /\b(usted|ustedes)\b/gi,
    },
  },
  pt: {
    informal: {
      label: "tu/te/teu",
      regex: /\b(tu|te|ti|teu|tua|teus|tuas|contigo)\b/gi,
    },
    formal: {
      label: "você/vocês",
      regex: /\b(você|vocês)\b/gi,
    },
  },
  ca: {
    informal: {
      label: "tu/et/teu",
      regex: /\b(tu|et|teu|teva|teus|teves)\b/gi,
    },
    formal: {
      label: "vostè/vostès",
      regex: /\b(vostè|vostès)\b/gi,
    },
  },
};

const SCANNED_BLOCKS = ["calcDrip", "drip"];

function existsSafe(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract the body of a top-level object property `name: { ... }` from
 * a TypeScript source text. Returns the substring including the outer
 * braces, or null if not found. Brace counting respects string
 * literals (single, double and template) so braces inside copy don't
 * unbalance the walker.
 */
function extractBlock(text, name) {
  const startRegex = new RegExp(`\\b${name}\\s*:\\s*\\{`, "g");
  const m = startRegex.exec(text);
  if (!m) return null;
  const openIdx = m.index + m[0].length - 1;
  let depth = 0;
  let inString = null; // null | '"' | "'" | "`"
  let escape = false;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === inString) inString = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c;
      continue;
    }
    if (c === "{") {
      depth += 1;
    } else if (c === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(openIdx, i + 1);
      }
    }
  }
  return null;
}

function countMatches(text, regex) {
  regex.lastIndex = 0;
  const samples = [];
  let m;
  let count = 0;
  while ((m = regex.exec(text)) !== null) {
    count += 1;
    if (samples.length < 3) samples.push(m[0]);
    if (m[0].length === 0) regex.lastIndex += 1;
  }
  return { count, samples };
}

function classify(blockText, sets) {
  const informal = countMatches(blockText, sets.informal.regex);
  const formal = countMatches(blockText, sets.formal.regex);
  let register;
  if (informal.count > 0 && formal.count > 0) register = "mixed";
  else if (informal.count > 0) register = "informal";
  else if (formal.count > 0) register = "formal";
  else register = "neutral";
  return { register, informal, formal };
}

/**
 * Public, importable analyzer used by both the CLI and the unit tests.
 * Returns one verdict per language with per-block classification and
 * an `issues` array describing every drift the lint would report.
 */
function analyzeBundle({ lang, source }) {
  const sets = PRONOUN_SETS[lang];
  if (!sets) {
    throw new Error(
      `[lint-email-pronoun-consistency] No pronoun set configured for language "${lang}".`,
    );
  }

  const blocks = {};
  for (const blockName of SCANNED_BLOCKS) {
    const body = extractBlock(source, blockName);
    if (body == null) {
      blocks[blockName] = { found: false };
      continue;
    }
    blocks[blockName] = { found: true, ...classify(body, sets) };
  }

  const issues = [];
  // Missing block is a hard misconfiguration — surface as an issue.
  for (const blockName of SCANNED_BLOCKS) {
    if (!blocks[blockName].found) {
      issues.push({
        kind: "missing-block",
        block: blockName,
        message: `Could not find \`${blockName}\` block.`,
      });
    }
  }
  // Within-block mixing → drift.
  for (const blockName of SCANNED_BLOCKS) {
    const b = blocks[blockName];
    if (b.found && b.register === "mixed") {
      issues.push({
        kind: "mixed-within-block",
        block: blockName,
        message:
          `\`${blockName}\` mixes informal (${sets.informal.label}; ` +
          `${b.informal.count} hit${b.informal.count === 1 ? "" : "s"}, ` +
          `e.g. ${b.informal.samples.map((s) => `"${s}"`).join(", ")}) ` +
          `and formal (${sets.formal.label}; ${b.formal.count} hit${b.formal.count === 1 ? "" : "s"}, ` +
          `e.g. ${b.formal.samples.map((s) => `"${s}"`).join(", ")}) pronouns.`,
      });
    }
  }
  // Between-block drift → the original Task #40 trigger.
  const cd = blocks.calcDrip;
  const dr = blocks.drip;
  if (
    cd.found &&
    dr.found &&
    cd.register !== "mixed" &&
    dr.register !== "mixed" &&
    cd.register !== "neutral" &&
    dr.register !== "neutral" &&
    cd.register !== dr.register
  ) {
    issues.push({
      kind: "register-mismatch",
      message:
        `\`calcDrip\` is ${cd.register} (${
          cd.register === "informal" ? sets.informal.label : sets.formal.label
        }) ` +
        `but \`drip\` is ${dr.register} (${
          dr.register === "informal" ? sets.informal.label : sets.formal.label
        }). ` +
        `Both nurture blocks must share the same form of address per language.`,
    });
  }

  return { lang, blocks, issues };
}

function loadLanguageFile(lang) {
  const file = join(EMAIL_I18N_DIR, `${lang}.ts`);
  if (!existsSafe(file)) {
    throw new Error(
      `[lint-email-pronoun-consistency] Missing language file ${relative(REPO_DIR, file)}`,
    );
  }
  return { file, source: readFileSync(file, "utf8") };
}

function formatVerdict(verdict, file) {
  const rel = relative(REPO_DIR, file);
  const lines = [];
  for (const issue of verdict.issues) {
    lines.push(`${rel}  [${verdict.lang}]  ${issue.message}`);
  }
  return lines.join("\n");
}

function main() {
  let totalIssues = 0;
  let scanned = 0;
  for (const lang of LANGUAGES) {
    const { file, source } = loadLanguageFile(lang);
    scanned += 1;
    const verdict = analyzeBundle({ lang, source });
    if (verdict.issues.length > 0) {
      totalIssues += verdict.issues.length;
      console.log(formatVerdict(verdict, file));
    }
  }

  if (scanned === 0) {
    console.error(
      `[lint-email-pronoun-consistency] No language files scanned under ${relative(REPO_DIR, EMAIL_I18N_DIR)}/.`,
    );
    process.exit(2);
  }

  if (totalIssues > 0) {
    console.error(
      `\n[lint-email-pronoun-consistency] FAIL — ${totalIssues} pronoun drift issue${totalIssues === 1 ? "" : "s"} across ${scanned} language file${scanned === 1 ? "" : "s"}.`,
    );
    console.error(
      `[lint-email-pronoun-consistency] Each language's calcDrip and drip blocks must use the same form of address.`,
    );
    process.exit(1);
  }

  console.log(
    `[lint-email-pronoun-consistency] OK — scanned ${scanned} language file${scanned === 1 ? "" : "s"} (${LANGUAGES.join(", ")}); calcDrip and drip share the same register in every locale.`,
  );
}

export {
  EMAIL_I18N_DIR,
  LANGUAGES,
  PRONOUN_SETS,
  SCANNED_BLOCKS,
  analyzeBundle,
  classify,
  countMatches,
  extractBlock,
  loadLanguageFile,
};

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
