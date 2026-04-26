#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join, sep } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const WEB_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(WEB_ROOT, "..");

const SCAN_TARGETS = [
  { root: WEB_ROOT, dir: "client" },
  { root: WEB_ROOT, dir: "server" },
  { root: WEB_ROOT, dir: "shared" },
  { root: WEB_ROOT, dir: "scripts" },
  { root: WEB_ROOT, dir: "docs" },
  { root: REPO_ROOT, dir: "docs" },
];

const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  ".cache",
  ".local",
  "archive",
]);

const SKIP_FILE_NAMES = new Set([
  "brand-casing-check.mjs",
]);

// Allow-list of relative paths (from REPO_ROOT) that may legitimately contain
// the wrong-cased brand string. Add entries only when a doc legitimately
// references the forbidden casing to teach contributors / agents NOT to use
// it (the rule itself, lint output description, etc.).
const ALLOWLIST = new Set([
  // docs/internal/* — these docs explain the brand-casing rule and the lint
  // output, so they reference "ExenTax" verbatim to teach what NOT to write.
  "docs/internal/AGENT-RULES.md",
  "docs/internal/ARCHITECTURE.md",
  "docs/internal/DEFINITIVE-STATUS.md",
  "docs/internal/PRODUCTION-READY-REPORT.md",
  "docs/internal/STACK.md",
  "docs/internal/TRANSLATION-GUIDE.md",
  "docs/internal/WHAT-NOT-TO-TOUCH.md",
]);

const FORBIDDEN = "ExenTax";

const offenders = [];

function isSkippedDir(name) {
  return SKIP_DIRS.has(name);
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (isSkippedDir(name)) continue;
      walk(full);
    } else if (st.isFile()) {
      if (SKIP_FILE_NAMES.has(name)) continue;
      const relFromRepo = relative(REPO_ROOT, full);
      if (ALLOWLIST.has(relFromRepo)) continue;
      let content;
      try {
        content = readFileSync(full, "utf8");
      } catch {
        continue;
      }
      const lines = content.split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (line.includes(FORBIDDEN)) {
          offenders.push({ file: relFromRepo, line: idx + 1, text: line.trim() });
        }
      });
    }
  }
}

for (const { root, dir } of SCAN_TARGETS) {
  walk(join(root, dir));
}

if (offenders.length > 0) {
  console.error(`✗ Forbidden brand casing "${FORBIDDEN}" detected:`);
  for (const o of offenders) {
    console.error(`  - ${o.file}:${o.line}  ${o.text}`);
  }
  console.error(
    `\nThe correct brand spelling is "Exentax" (capital E only).`,
  );
  console.error(
    `If you have a legitimate reason to keep "${FORBIDDEN}" verbatim (e.g. quoting an external source), add the file path to ALLOWLIST in scripts/brand-casing-check.mjs and document why.`,
  );
  process.exit(1);
}

console.log(
  `✓ No "${FORBIDDEN}" occurrences in exentax-web/{client,server,shared,scripts,docs} or root docs/.`,
);
