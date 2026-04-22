#!/usr/bin/env node
/*
 * Pass 9 (audit 2026-04, EN parity): strip templated filler sentences that
 * read like AI placeholders rather than concrete editorial content. The
 * patterns below were flagged by reviewer pass 4 as low-signal boilerplate
 * and must not appear anywhere under client/src/data/blog-content.
 *
 * Strategy: locate every sentence containing one of the FILLER_PATTERNS and
 * delete the entire sentence (from the previous "." or paragraph start up to
 * and including its terminating "."). Run repeatedly to handle stacked
 * patterns. Also collapse the resulting double-spaces.
 *
 * Idempotent — re-running on a clean tree reports 0 removals.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "client/src/data/blog-content");

const FILLER_PATTERNS = [
  /[^.!?\n]*\bPractical detail worth pinning down\b[^.!?\n]*[.!?]\s*/g,
  /[^.!?\n]*\bConcrete take from our case files\b[^.!?\n]*[.!?]\s*/g,
  /[^.!?\n]*\bThis is one of the points we audit first\b[^.!?\n]*[.!?]\s*/g,
];

let totalRemoved = 0;
let touchedFiles = 0;

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith(".ts")) out.push(p);
  }
  return out;
}

for (const fp of walk(CONTENT)) {
  const orig = fs.readFileSync(fp, "utf8");
  let txt = orig;
  let removedHere = 0;
  for (const pat of FILLER_PATTERNS) {
    txt = txt.replace(pat, () => { removedHere++; return ""; });
  }
  // Collapse residual double-spaces and lonely leading spaces inside a
  // template literal line.
  txt = txt.replace(/  +/g, " ").replace(/\n /g, "\n");
  if (txt !== orig) {
    fs.writeFileSync(fp, txt);
    totalRemoved += removedHere;
    touchedFiles += 1;
  }
}

console.log(`Filler sentences removed: ${totalRemoved} (across ${touchedFiles} file(s)).`);
