#!/usr/bin/env node
import { readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join, sep } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");

const FORBIDDEN_PATTERNS = [
  /-report\.json$/i,
  /-report\.md$/i,
  /^bundle-visualizer\.html$/i,
];

const ALLOWED_TOP_DIRS = new Set(["reports", "docs"]);

// Build artefacts, vendored deps, and agent state are excluded so the guard
// only inspects checked-in source. The rule itself ("no stray report files
// outside reports/ and docs/") still applies to every other directory,
// including scripts/archive.
const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  ".git",
  ".cache",
  ".local",
]);

function isAllowed(relPath) {
  const top = relPath.split(sep)[0];
  return ALLOWED_TOP_DIRS.has(top);
}

function isSkipped(relPath) {
  if (SKIP_DIRS.has(relPath)) return true;
  for (const skip of SKIP_DIRS) {
    if (relPath === skip || relPath.startsWith(skip + sep)) return true;
  }
  return false;
}

const offenders = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const rel = relative(PROJECT_ROOT, full);
    if (isSkipped(rel)) continue;
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      walk(full);
    } else if (st.isFile()) {
      if (isAllowed(rel)) continue;
      if (FORBIDDEN_PATTERNS.some((p) => p.test(name))) {
        offenders.push(rel);
      }
    }
  }
}

walk(PROJECT_ROOT);

if (offenders.length > 0) {
  console.error("✗ Stray report files detected outside reports/ and docs/:");
  for (const f of offenders) console.error(`  - ${f}`);
  console.error(
    "\nMove generated reports under reports/ (or docs/ for hand-written ones).",
  );
  console.error(
    "If a generator script wrote them at the project root, patch the script to write under reports/<area>/ instead.",
  );
  process.exit(1);
}

console.log("✓ No stray *-report.{json,md} or bundle-visualizer.html files at the project root.");
