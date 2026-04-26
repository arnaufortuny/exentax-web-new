#!/usr/bin/env node
/*
 * audit-markdown-quality.mjs
 * ----------------------------------------------------------------------------
 * Scans every blog content file (client/src/data/blog-content/{loc}/*.ts)
 * for common markdown quality issues and writes the results to
 * `audits/markdown-quality.json`.
 *
 * Checks
 * ------
 *  - heading depth jumps (e.g. ## directly to ####)
 *  - mixed list markers within a single file (-, *, +)
 *  - smart-quote / ASCII apostrophe inconsistency (per locale dominant style)
 *  - broken in-page anchors (link to #foo with no matching id)
 *  - trailing whitespace on lines
 *
 * Pass `--fix` to apply the safe corrections in place:
 *  - trailing whitespace removed
 *  - apostrophes normalised to the locale's dominant style
 *
 * Heading depth, mixed list markers and broken anchors are reported but not
 * auto-corrected because they typically need editorial intent.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const ROOT = join(REPO, "client", "src", "data", "blog-content");
const OUT = join(REPO, "audits");
mkdirSync(OUT, { recursive: true });

const FIX = process.argv.includes("--fix");
const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

function unwrap(content) {
  const m = content.match(/^(export default `)([\s\S]*)(`;?\s*)$/);
  if (!m) return null;
  return { prefix: m[1], body: m[2], suffix: m[3] };
}
const stripFences = (md) => md.replace(/```[\s\S]*?```/g, "");

const findings = {
  headingJumps: [],
  mixedListMarkers: [],
  smartQuoteMix: [],
  brokenAnchors: [],
  trailingWhitespace: [],
};
const fixes = { trailingWhitespace: 0, normalisedApostrophes: 0, files: [] };

for (const loc of LOCALES) {
  const dir = join(ROOT, loc);
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".ts")) continue;
    const path = join(dir, f);
    const raw = readFileSync(path, "utf8");
    const parts = unwrap(raw);
    if (!parts) continue;
    let body = parts.body;
    const sample = stripFences(body);
    const lines = sample.split("\n");
    const id = `${loc}/${f}`;

    // 1. heading jumps
    let prevH = 0;
    lines.forEach((ln, i) => {
      const m = ln.match(/^(#{1,6})\s+\S/);
      if (!m) return;
      const lvl = m[1].length;
      if (prevH && lvl > prevH + 1) {
        findings.headingJumps.push({ file: id, line: i + 1, from: prevH, to: lvl, text: ln.slice(0, 100) });
      }
      prevH = lvl;
    });

    // 2. mixed list markers
    const dash = (sample.match(/^- /gm) || []).length;
    const star = (sample.match(/^\* /gm) || []).length;
    const plus = (sample.match(/^\+ /gm) || []).length;
    if ([dash, star, plus].filter((n) => n > 0).length > 1) {
      findings.mixedListMarkers.push({ file: id, dash, star, plus });
    }

    // 3. smart-quote mix
    const ascii = (sample.match(/[A-Za-z]'[a-z]/g) || []).length;
    const curly = (sample.match(/[A-Za-z][\u2019][a-z]/g) || []).length;
    if (ascii > 0 && curly > 0) {
      findings.smartQuoteMix.push({ file: id, ascii, curly });
    }

    // 4. broken in-page anchors
    for (const a of sample.matchAll(/\(#([a-zA-Z0-9_-]+)\)/g)) {
      const anchor = a[1];
      const has =
        sample.includes(`{#${anchor}}`) ||
        sample.includes(`id="${anchor}"`) ||
        sample.includes(`<a name="${anchor}"`);
      if (!has) findings.brokenAnchors.push({ file: id, anchor });
    }

    // 5. trailing whitespace
    let trailingCount = 0;
    lines.forEach((ln, i) => {
      if (/[ \t]+$/.test(ln)) {
        trailingCount += 1;
        findings.trailingWhitespace.push({ file: id, line: i + 1 });
      }
    });

    if (FIX) {
      let changed = false;
      // remove trailing whitespace on every line
      const beforeTrail = body;
      body = body.replace(/[ \t]+(\n|$)/g, "$1");
      if (body !== beforeTrail) {
        fixes.trailingWhitespace += trailingCount;
        changed = true;
      }
      // normalise apostrophes when one style overwhelmingly dominates the other
      if (ascii > 0 && curly > 0 && ascii >= curly * 5) {
        // dominant ASCII → flatten the few stray curly contractions to ASCII
        const before = body;
        body = body.replace(/([A-Za-z])\u2019([a-z])/g, "$1'$2");
        if (body !== before) {
          fixes.normalisedApostrophes += curly;
          changed = true;
        }
      } else if (curly > 0 && ascii > 0 && curly >= ascii * 5) {
        const before = body;
        body = body.replace(/([A-Za-z])'([a-z])/g, "$1\u2019$2");
        if (body !== before) {
          fixes.normalisedApostrophes += ascii;
          changed = true;
        }
      }
      if (changed) {
        writeFileSync(path, parts.prefix + body + parts.suffix);
        fixes.files.push(id);
      }
    }
  }
}

const outFile = join(OUT, "markdown-quality.json");
let previousFixesApplied = null;
if (existsSync(outFile)) {
  try {
    const prev = JSON.parse(readFileSync(outFile, "utf8"));
    if (prev && prev.fixesApplied) previousFixesApplied = prev.fixesApplied;
  } catch {
    // ignore malformed previous report
  }
}

const fixesAppliedThisRun = FIX
  ? {
      appliedAt: new Date().toISOString(),
      trailingWhitespaceLinesRemoved: fixes.trailingWhitespace,
      smartQuoteMixesNormalised: fixes.normalisedApostrophes,
      filesTouched: fixes.files.length,
      files: fixes.files,
    }
  : previousFixesApplied; // preserve historical record on dry-run

const report = {
  generatedAt: new Date().toISOString(),
  scope: "client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts",
  auditor: "exentax-web/scripts/audit-markdown-quality.mjs",
  rules: {
    headingJumps: "Detect H{n} -> H{n+2} jumps within an article body.",
    mixedListMarkers: "Detect lists that mix '-', '*' and '+' markers in the same block.",
    smartQuoteMix: "Detect strings that mix ASCII apostrophes with curly apostrophes (\u2019).",
    brokenAnchors: "Detect intra-doc '#anchor' links pointing to a heading id that does not exist in the same article.",
    trailingWhitespace: "Detect lines inside markdown bodies that end with one or more spaces.",
  },
  summary: {
    headingJumps: findings.headingJumps.length,
    mixedListMarkers: findings.mixedListMarkers.length,
    smartQuoteMix: findings.smartQuoteMix.length,
    brokenAnchors: findings.brokenAnchors.length,
    trailingWhitespace: findings.trailingWhitespace.length,
  },
  findings,
  fixesApplied: fixesAppliedThisRun,
};
writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(`markdown-quality audit:`, report.summary);
if (FIX) console.log(`Applied fixes:`, { trailingWhitespace: fixes.trailingWhitespace, normalisedApostrophes: fixes.normalisedApostrophes, files: fixes.files.length });
