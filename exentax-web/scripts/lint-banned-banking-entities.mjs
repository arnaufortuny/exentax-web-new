#!/usr/bin/env node
/*
 * lint-banned-banking-entities.mjs
 * ----------------------------------------------------------------------------
 * Guard that scans every per-locale blog content file under
 * `client/src/data/blog-content/{ca,de,en,es,fr,pt}/` and fails the build if
 * any forbidden banking-entity phrase reappears in the published copy.
 *
 * Origin
 * ------
 * Task #32. We just corrected 475 articles across 6 languages that incorrectly
 * mentioned "Revolut Payments USA" — an entity that does not exist. The
 * correct entity is **Revolut Technologies Inc.** with **Lead Bank** as the
 * US banking partner for US LLCs. This script blocks any reintroduction of
 * that phantom entity (and any future invented entity we add to the table)
 * at PR time, before it can re-poison the blog.
 *
 * What it checks
 * --------------
 * For every `.ts` file under `client/src/data/blog-content/<locale>/`, the
 * script reports any case-insensitive match of any phrase listed in the
 * adjacent `lint-banned-banking-entities.json` table. Whitespace inside a
 * phrase is treated as "one or more whitespace chars" so editorial line
 * breaks ("Revolut Payments\nUSA") still get caught.
 *
 * The walker recursively scans every `.ts` file under `blog-content/`,
 * which covers the per-locale article files plus the root-level aggregator
 * `es-all.ts`. Files under `scripts/archive/` are not in the scan path at
 * all, mirroring the SOT rule we already follow with rg.
 *
 * Exit code
 * ---------
 *  0  no findings
 *  1  one or more forbidden phrases detected
 *  2  no blog files found at the expected path (misconfiguration)
 *
 * Usage
 * -----
 *  node scripts/lint-banned-banking-entities.mjs    # from exentax-web/
 *  npm run lint:banking-entities                    # via package.json (once wired)
 * ----------------------------------------------------------------------------
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_DIR = resolve(__dirname, "..");
const BLOG_CONTENT_DIR = join(REPO_DIR, "client", "src", "data", "blog-content");
const TABLE_PATH = join(__dirname, "lint-banned-banking-entities.json");
// Locale directories we expect to find under blog-content/. Kept as a
// human-readable hint in CLI output; the walker itself scans every `.ts`
// file under blog-content/ recursively so root-level aggregators like
// es-all.ts and any future top-level content file are also covered.
const LOCALES = ["ca", "de", "en", "es", "fr", "pt"];

function loadTable() {
  const raw = readFileSync(TABLE_PATH, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.phrases) || parsed.phrases.length === 0) {
    throw new Error(
      `[lint-banned-banking-entities] ${relative(REPO_DIR, TABLE_PATH)} must contain a non-empty 'phrases' array.`,
    );
  }
  return parsed.phrases.map((entry) => {
    if (!entry || typeof entry.phrase !== "string" || entry.phrase.trim() === "") {
      throw new Error(
        `[lint-banned-banking-entities] Every entry in ${relative(REPO_DIR, TABLE_PATH)} must have a non-empty 'phrase' string.`,
      );
    }
    return {
      phrase: entry.phrase,
      issue: typeof entry.issue === "string" ? entry.issue : null,
      reason: typeof entry.reason === "string" ? entry.reason : null,
      sot: typeof entry.sot === "string" ? entry.sot : null,
      regex: phraseToRegex(entry.phrase),
    };
  });
}

// Build a case-insensitive regex where any whitespace in the phrase matches
// one or more whitespace chars in the file. This catches editorial wrapping
// like "Revolut Payments\nUSA" without changing the published phrase.
function phraseToRegex(phrase) {
  const escaped = phrase
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "\\s+");
  return new RegExp(escaped, "gi");
}

function existsSafe(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

function listBlogContentFiles() {
  if (!existsSafe(BLOG_CONTENT_DIR)) return [];
  const out = [];
  walk(BLOG_CONTENT_DIR, out);
  return out.sort();
}

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      out.push(full);
    }
  }
}

// Public, importable analyzer used by both the CLI and the unit tests.
function analyzeText(text, table) {
  const findings = [];
  const lines = text.split("\n");
  for (const entry of table) {
    entry.regex.lastIndex = 0;
    let match;
    while ((match = entry.regex.exec(text)) !== null) {
      const before = text.slice(0, match.index);
      const lineNumber = before.split("\n").length;
      const lineText = lines[lineNumber - 1] ?? "";
      findings.push({
        line: lineNumber,
        column: match.index - before.lastIndexOf("\n"),
        match: match[0],
        phrase: entry.phrase,
        issue: entry.issue,
        reason: entry.reason,
        sot: entry.sot,
        text: lineText.trim().slice(0, 200),
      });
      if (match[0].length === 0) {
        entry.regex.lastIndex += 1;
      }
    }
  }
  return findings.sort((a, b) => a.line - b.line || a.column - b.column);
}

function scanFile(file, table) {
  const text = readFileSync(file, "utf8");
  return analyzeText(text, table);
}

function format(file, finding) {
  const rel = relative(REPO_DIR, file);
  const head = `${rel}:${finding.line}:${finding.column}  banned banking entity "${finding.match}"`;
  const tail = finding.reason ? `\n    ${finding.reason}` : "";
  const sot = finding.sot ? `\n    SOT: ${finding.sot}` : "";
  const ctx = finding.text ? `\n    > ${finding.text}` : "";
  return head + tail + sot + ctx;
}

function main() {
  const table = loadTable();
  const files = listBlogContentFiles();
  if (files.length === 0) {
    console.error(
      `[lint-banned-banking-entities] No blog files found under ${relative(REPO_DIR, BLOG_CONTENT_DIR)}/ (expected locales: ${LOCALES.join(", ")}).`,
    );
    process.exit(2);
  }

  let total = 0;
  for (const file of files) {
    const findings = scanFile(file, table);
    for (const f of findings) {
      total += 1;
      console.log(format(file, f));
    }
  }

  if (total > 0) {
    console.error(
      `\n[lint-banned-banking-entities] FAIL — ${total} forbidden mention${total === 1 ? "" : "s"} found across ${files.length} blog file${files.length === 1 ? "" : "s"}.`,
    );
    console.error(
      `[lint-banned-banking-entities] Phrase table: ${relative(REPO_DIR, TABLE_PATH)}`,
    );
    process.exit(1);
  }

  console.log(
    `[lint-banned-banking-entities] OK — scanned ${files.length} blog file${files.length === 1 ? "" : "s"} across ${LOCALES.length} locales, no banned banking entities found.`,
  );
}

export {
  BLOG_CONTENT_DIR,
  LOCALES,
  TABLE_PATH,
  analyzeText,
  loadTable,
  phraseToRegex,
};

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main();
}
