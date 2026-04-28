#!/usr/bin/env node
/*
 * blog-cta-position-autofix (Task #52, paso 2 — v3)
 * ----------------------------------------------------------------------------
 * Reposiciona los marcadores `<!-- exentax:calc-cta-v1 -->` y
 * `<!-- exentax:cta-v1 -->` en los 666 artículos.
 *
 * Reglas:
 *   1. `calc-cta-v1` → ~60 % del cuerpo (rango 50-70 %), tras una línea
 *      en blanco, fuera de listas, fuera de bloques HTML abiertos, no
 *      pegado a un `##`/`###`, no dentro de otros marcadores semánticos.
 *   2. `cta-v1` (junto con su wrapper más externo — `cta-conv-v1` y/o
 *      `cross-refs-v1` — cuando exista) → al final del cuerpo, antes del
 *      `review-anchor-v1`.
 *   3. Una línea en blanco arriba y otra abajo de cada marcador.
 *   4. Orden: calc-cta → … → cta-unit.
 *
 * El contenido entre los marcadores se preserva tal cual.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const BLOG_ROOT = join(REPO, "client/src/data/blog-content");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const DRY = process.argv.includes("--dry-run");

const HEADING_RE = /^\s{0,3}#{1,4}\s+\S/;
const LIST_RE = /^\s{0,3}([-*+]|\d+\.)\s+\S/;
const HTML_OPEN_RE = /^\s*<(table|aside|ul|ol|blockquote|details|summary|pre|code|figure|tr|tbody|thead)[\s>]/i;
const HTML_CLOSE_RE = /^\s*<\/(table|aside|ul|ol|blockquote|details|summary|pre|code|figure|tr|tbody|thead)\s*>/i;
const MARKER_LINE_RE = /<!--\s*\/?\s*exentax:[^>]*-->/;

function isBlank(l) { return l === undefined || /^\s*$/.test(l); }

function htmlDepthMap(lines) {
  const depths = new Array(lines.length).fill(0);
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    depths[i] = depth;
    const opens = HTML_OPEN_RE.test(lines[i]);
    const closes = HTML_CLOSE_RE.test(lines[i]);
    if (opens && !closes) depth++;
    else if (closes && !opens && depth > 0) depth--;
  }
  return depths;
}

function extractBodyAndShell(raw) {
  const start = raw.indexOf("`");
  const end = raw.lastIndexOf("`");
  if (start < 0 || end <= start) return null;
  return {
    prefix: raw.slice(0, start + 1),
    body: raw.slice(start + 1, end),
    suffix: raw.slice(end),
  };
}

/** Discover ALL paired exentax marker blocks on the body. */
function findAllPairedMarkers(lines) {
  const openRe = /<!--\s*exentax:([a-z0-9-]+v\d+)\s*-->/i;
  const closeRe = /<!--\s*\/\s*exentax:([a-z0-9-]+v\d+)\s*-->/i;
  const stack = [];
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const om = openRe.exec(l);
    const cm = closeRe.exec(l);
    if (cm) {
      // pop most recent matching open
      for (let s = stack.length - 1; s >= 0; s--) {
        if (stack[s].name === cm[1]) {
          blocks.push({ name: cm[1], open: stack[s].open, close: i });
          stack.splice(s, 1);
          break;
        }
      }
    }
    if (om && (!cm || om.index < cm.index)) {
      stack.push({ name: om[1], open: i });
    }
  }
  return blocks;
}

function excise(lines, range) {
  let s = range.open, e = range.close;
  if (isBlank(lines[e + 1])) e++;
  if (s > 0 && isBlank(lines[s - 1])) s--;
  return [...lines.slice(0, s), ...lines.slice(e + 1)];
}

function inAnyRange(idx, ranges) {
  return ranges.some(r => idx >= r.open && idx <= r.close);
}

function findInsertionPoint(lines, depths, lo, hi, targetPct, protectedRanges) {
  const offsets = [];
  let cum = 0;
  for (let i = lo; i < hi; i++) { offsets.push(cum); cum += lines[i].length + 1; }
  const total = cum;
  if (total === 0) return null;

  const candidates = [];
  for (let i = lo + 1; i < hi; i++) {
    if (depths[i] !== 0) continue;
    if (!isBlank(lines[i - 1])) continue;
    if (isBlank(lines[i])) continue;
    if (LIST_RE.test(lines[i])) continue;
    if (/^\s*>/.test(lines[i])) continue;
    if (MARKER_LINE_RE.test(lines[i])) continue;
    if (inAnyRange(i, protectedRanges)) continue;
    if (i - 2 >= lo && HEADING_RE.test(lines[i - 2])) continue;
    const off = offsets[i - lo];
    const pct = off / total;
    const isHeading = HEADING_RE.test(lines[i]);
    const score = Math.abs(pct - targetPct) + (isHeading ? 0.05 : 0);
    candidates.push({ i, pct, score });
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0];
}

/** Last non-blank, non-marker line in [lo, hi) that is NOT inside a protected range. */
function findLastContentLine(lines, lo, hi, protectedRanges) {
  for (let i = hi - 1; i >= lo; i--) {
    if (isBlank(lines[i])) continue;
    if (MARKER_LINE_RE.test(lines[i])) continue;
    if (inAnyRange(i, protectedRanges)) continue;
    return i;
  }
  return null;
}

function processFile(absPath) {
  const raw = readFileSync(absPath, "utf8");
  const shell = extractBodyAndShell(raw);
  if (!shell) return { changed: false, reason: "no-body" };
  let lines = shell.body.split("\n");

  const all = findAllPairedMarkers(lines);
  const calc = all.find(b => b.name === "calc-cta-v1");
  const cta = all.find(b => b.name === "cta-v1");
  const anchor = all.find(b => b.name === "review-anchor-v1");
  if (!calc || !cta) return { changed: false, reason: "missing-markers" };

  // Outermost wrapper that strictly contains cta-v1 (chain through cta-conv,
  // cross-refs, etc.). The MOVE UNIT is this outermost block.
  let unit = cta;
  while (true) {
    const outer = all.find(b => b !== unit && b.open < unit.open && b.close > unit.close);
    if (!outer) break;
    unit = outer;
  }

  // Orphan cta-conv-v1: a conv block that is NEITHER inside the cta unit
  // (the common case where conv wraps or is wrapped by cta-v1) NOR equal to
  // it. Such an orphan is rare: it typically sits at the very end of the
  // file, after the anchor. When found we move it to sit immediately before
  // the cta unit so the phone/whatsapp prompt stays adjacent to the CTA.
  const conv = all.find(b => b.name === "cta-conv-v1");
  let orphanConv = null;
  if (conv) {
    const insideUnit = conv.open >= unit.open && conv.close <= unit.close;
    const wrapsUnit = conv.open <= unit.open && conv.close >= unit.close;
    if (!insideUnit && !wrapsUnit) orphanConv = conv;
  }

  // Capture content of the blocks to move
  const calcBlock = lines.slice(calc.open, calc.close + 1);
  const unitBlock = lines.slice(unit.open, unit.close + 1);
  const orphanBlock = orphanConv ? lines.slice(orphanConv.open, orphanConv.close + 1) : null;

  // Excise all (highest first to keep lower indices valid)
  const toExcise = [calc, unit, ...(orphanConv ? [orphanConv] : [])]
    .sort((a, b) => b.open - a.open);
  for (const r of toExcise) lines = excise(lines, r);

  // Recompute structure on cleaned body
  const all2 = findAllPairedMarkers(lines);
  const newAnchor = anchor ? all2.find(b => b.name === "review-anchor-v1") : null;
  const protectedRanges = all2; // every remaining paired block is protected

  const depths = htmlDepthMap(lines);
  const contentLo = 0;
  const contentHi = newAnchor ? newAnchor.open : lines.length;

  // Step 1: insert cta-unit at end of content region (before anchor).
  // Position must be AFTER the last paragraph and AFTER any protected
  // semantic block (cross-refs, etc.) so the final CTA truly closes the page.
  const lastIdx = findLastContentLine(lines, contentLo, contentHi, protectedRanges);
  let unitInsertAt = lastIdx === null ? contentHi : lastIdx + 1;
  for (const r of protectedRanges) {
    if (r.open >= contentLo && r.close < contentHi && r.close + 1 > unitInsertAt) {
      unitInsertAt = r.close + 1;
    }
  }
  if (unitInsertAt > contentHi) unitInsertAt = contentHi;
  const beforeUnit = (unitInsertAt > 0 && !isBlank(lines[unitInsertAt - 1])) ? [""] : [];
  const afterUnit = (!isBlank(lines[unitInsertAt])) ? [""] : [];
  // If we have an orphan cta-conv-v1, place it immediately BEFORE the cta
  // unit (separated by one blank line) so the phone/whatsapp prompt stays
  // adjacent to the final CTA.
  const tail = orphanBlock
    ? [...orphanBlock, "", ...unitBlock]
    : [...unitBlock];
  lines = [
    ...lines.slice(0, unitInsertAt),
    ...beforeUnit,
    ...tail,
    ...afterUnit,
    ...lines.slice(unitInsertAt),
  ];

  // Step 2: insert calc-cta at ~60% BEFORE the unit
  const all3 = findAllPairedMarkers(lines);
  const newUnit = all3.find(b => b.name === unit.name && b.open >= unitInsertAt - 2);
  const protectedRanges2 = all3;
  const depths2 = htmlDepthMap(lines);
  const calcLo = 0;
  const calcHi = newUnit ? newUnit.open : lines.length;

  // We want calc-cta to land near 60 % of the FINAL reader region (which
  // includes the cta-unit we just inserted at the end). Express that as a
  // target inside [calcLo, calcHi):
  //   target_in_calcHi = 0.60 * (calcHi_chars + unitChars) / calcHi_chars
  let calcHiChars = 0;
  for (let i = calcLo; i < calcHi; i++) calcHiChars += lines[i].length + 1;
  const unitChars = unitBlock.reduce((n, l) => n + l.length + 1, 0)
                  + (orphanBlock ? orphanBlock.reduce((n, l) => n + l.length + 1, 0) + 1 : 0);
  const targetPct = Math.min(0.78,
    calcHiChars > 0 ? 0.60 * (calcHiChars + unitChars) / calcHiChars : 0.60);
  const ins = findInsertionPoint(lines, depths2, calcLo, calcHi, targetPct, protectedRanges2);
  let calcInsertAt;
  if (ins) calcInsertAt = ins.i;
  else {
    // Fallback: scan forward from 50% mark for any safe position
    calcInsertAt = -1;
    for (let i = Math.floor(calcHi * 0.5); i < calcHi; i++) {
      if (depths2[i] === 0
          && !isBlank(lines[i]) && isBlank(lines[i - 1])
          && !LIST_RE.test(lines[i]) && !MARKER_LINE_RE.test(lines[i])
          && !/^\s*>/.test(lines[i])
          && !inAnyRange(i, protectedRanges2)) {
        calcInsertAt = i; break;
      }
    }
    if (calcInsertAt < 0) calcInsertAt = Math.max(1, Math.floor(calcHi / 2));
  }
  const beforeCalc = (calcInsertAt > 0 && !isBlank(lines[calcInsertAt - 1])) ? [""] : [];
  const afterCalc = (!isBlank(lines[calcInsertAt])) ? [""] : [];
  lines = [
    ...lines.slice(0, calcInsertAt),
    ...beforeCalc,
    ...calcBlock,
    ...afterCalc,
    ...lines.slice(calcInsertAt),
  ];

  // Collapse 3+ consecutive blank lines
  const collapsed = [];
  let blanks = 0;
  for (const l of lines) {
    if (isBlank(l)) { blanks++; if (blanks <= 2) collapsed.push(l); }
    else { blanks = 0; collapsed.push(l); }
  }

  const newBody = collapsed.join("\n");
  if (newBody === shell.body) return { changed: false, reason: "no-op" };
  if (!DRY) writeFileSync(absPath, shell.prefix + newBody + shell.suffix);
  return { changed: true };
}

function main() {
  let changed = 0, kept = 0, missing = 0;
  for (const lang of LANGS) {
    const dir = join(BLOG_ROOT, lang);
    const files = readdirSync(dir).filter(f => f.endsWith(".ts"));
    for (const f of files) {
      const r = processFile(join(dir, f));
      if (r.changed) changed++;
      else if (r.reason === "missing-markers") missing++;
      else kept++;
    }
  }
  console.log(`blog-cta-position-autofix${DRY ? " --dry-run" : ""}: changed=${changed} unchanged=${kept} missing-markers=${missing}`);
}

main();
