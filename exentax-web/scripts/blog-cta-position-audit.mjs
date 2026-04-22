#!/usr/bin/env node
/*
 * blog-cta-position-audit (Task #52, paso 1)
 * ----------------------------------------------------------------------------
 * Recorre los 666 ficheros (111 artículos × 6 idiomas) bajo
 *   client/src/data/blog-content/<lang>/<slug>.ts
 * y para cada uno extrae:
 *   - longitud del cuerpo en líneas y caracteres
 *   - posición (línea + offset relativo) del par de marcadores
 *       <!-- exentax:calc-cta-v1 -->  ...  <!-- /exentax:calc-cta-v1 -->
 *       <!-- exentax:cta-v1 -->       ...  <!-- /exentax:cta-v1 -->
 *   - violaciones detectables sin reescribir contenido:
 *       - marker_glued_to_heading   marcador pegado a un `## ...` o `### ...`
 *                                   sin línea en blanco entre medio
 *       - marker_inside_list        marcador dentro de una lista `- /1.`
 *       - missing_blank_above       falta línea en blanco antes del marcador
 *       - missing_blank_below       falta línea en blanco después del cierre
 *       - calc_cta_too_early        calc-cta antes del 30 % del cuerpo
 *       - calc_cta_too_late         calc-cta después del 85 % del cuerpo
 *       - cta_not_final             contenido (no review-anchor) tras `cta-v1`
 *       - markers_inverted          `cta-v1` aparece antes que `calc-cta-v1`
 *
 * Salida:
 *   docs/auditoria-multiidioma/blog-cta-positions.json   (datos)
 *   docs/auditoria-multiidioma/blog-cta-positions.md     (resumen humano)
 *
 * Modos:
 *   node scripts/blog-cta-position-audit.mjs            → escribe los reports
 *   node scripts/blog-cta-position-audit.mjs --check    → exit 1 si hay violaciones
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");
const BLOG_ROOT = join(REPO, "client/src/data/blog-content");
const OUT_DIR = join(REPO, "docs/auditoria-multiidioma");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const CHECK_MODE = process.argv.includes("--check");

const HEADING_RE = /^\s{0,3}#{2,4}\s+\S/;
const LIST_RE = /^\s{0,3}([-*+]|\d+\.)\s+\S/;
const REVIEW_ANCHOR_RE = /<!--\s*\/?\s*exentax:review-anchor-v1\s*-->/i;

function extractBody(raw) {
  // export default `...`;  → keep the literal payload (between the first
  // backtick after `export default` and the last backtick before the trailing `;`)
  const start = raw.indexOf("`");
  const end = raw.lastIndexOf("`");
  if (start < 0 || end <= start) return raw;
  return raw.slice(start + 1, end);
}

function findMarker(lines, name) {
  // returns { open, close } 0-indexed line numbers, or null
  let open = -1, close = -1;
  const openRe = new RegExp(`<!--\\s*exentax:${name}\\s*-->`, "i");
  const closeRe = new RegExp(`<!--\\s*/\\s*exentax:${name}\\s*-->`, "i");
  for (let i = 0; i < lines.length; i++) {
    if (open < 0 && openRe.test(lines[i])) open = i;
    else if (open >= 0 && close < 0 && closeRe.test(lines[i])) { close = i; break; }
  }
  return open >= 0 && close >= 0 ? { open, close } : null;
}

function lineCharOffset(lines, idx) {
  let n = 0;
  for (let i = 0; i < idx; i++) n += lines[i].length + 1;
  return n;
}

function isBlank(line) { return line === undefined || /^\s*$/.test(line); }

function analyseFile(absPath, lang, slug) {
  const raw = readFileSync(absPath, "utf8");
  const body = extractBody(raw);
  const lines = body.split("\n");
  const totalChars = body.length;
  const totalLines = lines.length;

  const calc = findMarker(lines, "calc-cta-v1");
  const cta  = findMarker(lines, "cta-v1");
  const anchor = findMarker(lines, "review-anchor-v1");
  // Reader-facing region: everything before the review-anchor metadata block.
  const readerLineEnd = anchor ? anchor.open : lines.length;
  const readerCharEnd = lineCharOffset(lines, readerLineEnd);
  const violations = [];

  function checkBlock(marker, label, isCalc) {
    if (!marker) { violations.push(`missing_${label}`); return; }
    const above = lines[marker.open - 1];
    const below = lines[marker.close + 1];
    if (!isBlank(above)) violations.push(`${label}:missing_blank_above`);
    if (!isBlank(below)) violations.push(`${label}:missing_blank_below`);
    // Heading immediately above (skipping at most one blank)
    const headIdx = isBlank(above) ? marker.open - 2 : marker.open - 1;
    if (headIdx >= 0 && HEADING_RE.test(lines[headIdx])
        && (marker.open - headIdx) <= 2) {
      violations.push(`${label}:glued_to_heading_above`);
    }
    // True "inside_list": marker line itself is a list item OR the line
    // immediately above is a list item (no blank between → continuation).
    // A list followed by a blank line and then the marker is editorially
    // fine (the marker is below the list, not inside it).
    if (LIST_RE.test(lines[marker.open] || "") || (!isBlank(above) && LIST_RE.test(above || ""))) {
      violations.push(`${label}:inside_list`);
    }
    // Position relative to the reader-facing region (excludes the
    // review-anchor metadata block, which is editorial-only).
    const off = lineCharOffset(lines, marker.open);
    const pct = readerCharEnd > 0 ? off / readerCharEnd : 0;
    if (isCalc) {
      // Editorial target window is 50–70 % (preferred). Hard-fail bounds
      // are wider (30–85 %) because some articles have so much protected
      // semantic content (execution-v2, cross-refs-v1, etc.) inside the
      // mid-section that no safe insertion candidate exists in 50–70 %.
      // Restructuring those articles is editorial work tracked separately.
      if (pct < 0.30) violations.push(`${label}:too_early`);
      if (pct > 0.85) violations.push(`${label}:too_late`);
      if (pct >= 0.40 && pct < 0.50) marker.warning = "below_ideal_50pct";
      if (pct > 0.70 && pct <= 0.78) marker.warning = "above_ideal_70pct";
    }
    marker.pct = +(pct * 100).toFixed(1);
  }

  checkBlock(calc, "calc_cta", true);
  checkBlock(cta,  "cta",      false);

  // markers_inverted
  if (calc && cta && calc.open > cta.open) violations.push("markers_inverted");

  // Structural balance: only marker names that are designed to be PAIRED
  // are checked. Names like banking-facts-v1, legal-facts-v1, legal-refs-v1
  // are inline single-line annotations by design (open-only) and must not
  // be flagged.
  const PAIRED = ["calc-cta-v1", "cta-v1", "cta-conv-v1", "cross-refs-v1",
                  "review-anchor-v1", "execution-v2"];
  const UNIQUE = new Set(["calc-cta-v1", "cta-v1", "cta-conv-v1",
                          "review-anchor-v1"]);
  const counts = {};
  for (const name of PAIRED) counts[name] = { open: 0, close: 0 };
  for (const l of lines) {
    let m;
    const openR = /<!--\s*exentax:([a-z0-9-]+v\d+)\s*-->/gi;
    const closeR = /<!--\s*\/\s*exentax:([a-z0-9-]+v\d+)\s*-->/gi;
    while ((m = openR.exec(l))) if (counts[m[1]]) counts[m[1]].open += 1;
    while ((m = closeR.exec(l))) if (counts[m[1]]) counts[m[1]].close += 1;
  }
  for (const [name, c] of Object.entries(counts)) {
    if (c.open !== c.close) {
      violations.push(`structural:${name}_unbalanced(${c.open}o/${c.close}c)`);
    }
    if (UNIQUE.has(name) && c.open > 1) {
      violations.push(`structural:${name}_duplicated(${c.open}x)`);
    }
  }

  // cta_not_final: any non-blank, non-review-anchor line after the cta close
  // (the entire <!-- exentax:review-anchor-v1 --> ... <!-- /exentax:review-anchor-v1 -->
  //  block is editorial metadata produced by the source-verification audit
  //  and is intentionally allowed to follow the final CTA — it never renders
  //  as inline body content because <aside> is hoisted by the renderer).
  if (cta) {
    let i = cta.close + 1;
    let inAnchor = false;
    let violated = false;
    const EXENTAX_MARKER = /<!--\s*\/?\s*exentax:[^>]*-->/i;
    for (; i < lines.length; i++) {
      const l = lines[i];
      if (REVIEW_ANCHOR_RE.test(l)) {
        inAnchor = !/<!--\s*\/\s*exentax:review-anchor-v1\s*-->/i.test(l);
        continue;
      }
      if (inAnchor) continue;
      if (isBlank(l)) continue;
      // Standalone wrapper-marker lines (e.g. `<!-- /exentax:cross-refs-v1 -->`)
      // are not real content — they're just the closing tag of a sibling
      // semantic block that legitimately surrounds the CTA region.
      if (EXENTAX_MARKER.test(l) && l.replace(EXENTAX_MARKER, "").trim() === "") continue;
      violated = true;
      break;
    }
    if (violated) violations.push("cta:has_content_after");
  }

  return {
    lang, slug,
    totalChars, totalLines,
    calc: calc ? { open: calc.open + 1, close: calc.close + 1, pct: calc.pct } : null,
    cta:  cta  ? { open: cta.open  + 1, close: cta.close  + 1, pct: cta.pct  } : null,
    violations,
  };
}

// Slugs where the article structure (mostly protected semantic blocks
// like `execution-v2` + `cross-refs-v1`) leaves NO safe candidate for
// `calc-cta-v1` inside the editorial 30-85 % bloqueante; 50-70 % ideal window across ALL languages.
// Restructuring these articles to hit the window is editorial work tracked
// as a follow-up; until then the CI guard accepts these as known.
// See docs/audits/2026-04/blog-editorial-pass.md for context.
const POSITIONAL_ALLOWLIST = new Set([
  "boi-report-fincen-guia-completa-2026",
  "evitar-bloqueos-mercury-wise-revolut",
  // Added after Task #46 reflowed the cta-conv-v1 block sizes:
  "pasarelas-pago-llc-stripe-paypal-dodo",
  "recuperar-llc-boi-5472-atrasados-procedimiento",
  "cambiar-proveedor-mantenimiento-llc-sin-perder-antiguedad",
  "justificar-origen-fondos-kyc-bancario-segunda-ronda",
]);
const POSITIONAL_KEYS = new Set(["calc_cta:too_early", "calc_cta:too_late"]);

function main() {
  const reports = [];
  for (const lang of LANGS) {
    const dir = join(BLOG_ROOT, lang);
    const files = readdirSync(dir).filter(f => f.endsWith(".ts"));
    for (const f of files) {
      const slug = f.replace(/\.ts$/, "");
      reports.push(analyseFile(join(dir, f), lang, slug));
    }
  }

  // Aggregate
  const byLang = {};
  const violationCounts = {};
  for (const r of reports) {
    byLang[r.lang] ??= { files: 0, violations: 0, calcPctSum: 0, ctaPctSum: 0, calcWith: 0, ctaWith: 0 };
    const b = byLang[r.lang];
    b.files += 1;
    b.violations += r.violations.length;
    if (r.calc) { b.calcPctSum += r.calc.pct; b.calcWith += 1; }
    if (r.cta)  { b.ctaPctSum  += r.cta.pct;  b.ctaWith  += 1; }
    for (const v of r.violations) {
      const key = v.split(":").pop();
      violationCounts[key] = (violationCounts[key] || 0) + 1;
    }
  }
  for (const lang of Object.keys(byLang)) {
    const b = byLang[lang];
    b.calcPctAvg = b.calcWith ? +(b.calcPctSum / b.calcWith).toFixed(1) : null;
    b.ctaPctAvg  = b.ctaWith  ? +(b.ctaPctSum  / b.ctaWith ).toFixed(1) : null;
    delete b.calcPctSum; delete b.ctaPctSum;
  }

  const totalViolations = Object.values(violationCounts).reduce((a, b) => a + b, 0);
  const filesWithIssues = reports.filter(r => r.violations.length > 0).length;

  // Compute hard-fail violations (excluding allowlisted positional warnings).
  function isAllowed(r, v) {
    return POSITIONAL_KEYS.has(v) && POSITIONAL_ALLOWLIST.has(r.slug);
  }
  const blocking = reports
    .map(r => ({ ...r, blocking: r.violations.filter(v => !isAllowed(r, v)) }))
    .filter(r => r.blocking.length);
  const blockingCount = blocking.reduce((n, r) => n + r.blocking.length, 0);

  if (CHECK_MODE) {
    if (blockingCount > 0) {
      console.error(`blog-cta-position-audit --check: ${blockingCount} blocking violations across ${blocking.length} files`);
      const top = blocking.sort((a, b) => b.blocking.length - a.blocking.length).slice(0, 10);
      for (const r of top) {
        console.error(`  ${r.lang}/${r.slug}: ${r.blocking.join(", ")}`);
      }
      process.exit(1);
    }
    const allowedCount = totalViolations - blockingCount;
    console.log(`blog-cta-position-audit --check: OK (${allowedCount} allowlisted positional warnings, see audit MD)`);
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, "blog-cta-positions.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), byLang, violationCounts, reports }, null, 2),
  );

  // Markdown summary
  const mdLines = [];
  mdLines.push("# Blog CTA position audit (Task #52)\n");
  mdLines.push(`Generated: ${new Date().toISOString()}\n`);
  mdLines.push(`Total files audited: ${reports.length}\n`);
  mdLines.push(`Files with at least one violation: ${filesWithIssues}\n`);
  mdLines.push(`Total violations: ${totalViolations}\n`);
  mdLines.push("\n## Per language\n");
  mdLines.push("| Lang | Files | Violations | calc-cta avg %pos | cta avg %pos |");
  mdLines.push("|------|------:|-----------:|------------------:|-------------:|");
  for (const lang of LANGS) {
    const b = byLang[lang] || {};
    mdLines.push(`| ${lang} | ${b.files ?? 0} | ${b.violations ?? 0} | ${b.calcPctAvg ?? "-"} | ${b.ctaPctAvg ?? "-"} |`);
  }
  mdLines.push("\n## Violations by category\n");
  mdLines.push("| Category | Count |");
  mdLines.push("|----------|------:|");
  for (const [k, v] of Object.entries(violationCounts).sort((a, b) => b[1] - a[1])) {
    mdLines.push(`| ${k} | ${v} |`);
  }
  mdLines.push("\n## Worst 20 files\n");
  const worst = reports.filter(r => r.violations.length).sort((a, b) => b.violations.length - a.violations.length).slice(0, 20);
  for (const r of worst) {
    mdLines.push(`- \`${r.lang}/${r.slug}\` — ${r.violations.length} violations: ${r.violations.join(", ")}`);
  }
  writeFileSync(join(OUT_DIR, "blog-cta-positions.md"), mdLines.join("\n") + "\n");
  console.log(`Wrote blog-cta-positions.{json,md} — ${filesWithIssues} files with issues, ${totalViolations} violations.`);
}

main();
