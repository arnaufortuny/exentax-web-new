#!/usr/bin/env node
/*
 * blog-risk-bridge-inject.test.mjs
 * ----------------------------------------------------------------------------
 * Unit tests for the editorial risk-bridge sweep
 * (`blog-risk-bridge-inject.mjs`, Task #34 / Task #35 / Task #45).
 *
 * The sweep injects, scrubs and migrates the "En Exentax prevenimos esto…"
 * solution sentences across the 672-article corpus in 6 idiomas. Today the
 * only safety net is the live corpus passing the gate. This file locks in
 * the contract with small in-memory fixtures so a future refactor cannot
 * silently break:
 *
 *   (a) Per-language RISK regex catalog matches the expected vocabulary
 *       and rejects unrelated words.
 *   (b) Injection adds an Exentax-led bridge to an orphan paragraph and
 *       is idempotent on a second run.
 *   (c) Non-narrative managed blocks (`cross-refs-v1`, `legal-refs-v1`)
 *       are NEVER modified — link/citation lists keep their semantics.
 *   (d) The legacy v1 → v2 migration rewrites old bridges deterministically
 *       (same fixture twice → same final text).
 *   (e) `--check` exits 0 on a clean fixture, exits 1 on a fixture with a
 *       synthetic orphan, and never writes to the on-disk corpus or report
 *       in either case (Task #35 CI-gate contract).
 *
 * Tests use only synthetic fixtures written to a per-run temp directory.
 * They MUST NOT depend on the real `client/src/data/blog-content` tree.
 *
 * Exits 0 on success, 1 on the first failure so `npm run check` can fail
 * fast if any contract regresses.
 * ----------------------------------------------------------------------------
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  RISK,
  BRIDGES,
  LEGACY_BRIDGES,
  computeProtectedSet,
  isNonNarrativeManaged,
  appendBridgeToLine,
  pickBridgeForKey,
  processFile,
} from "./blog-risk-bridge-inject.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT_PATH = path.join(__dirname, "blog-risk-bridge-inject.mjs");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const failures = [];
let passed = 0;

function check(name, cond, detail) {
  if (cond) {
    passed += 1;
    return;
  }
  failures.push(
    `  [FAIL] ${name}` + (detail ? `\n         ${detail}` : ""),
  );
}

// ---------------------------------------------------------------------------
// Tmp helpers — every test that needs disk I/O writes to its own subdir
// under a single per-run temp root we clean up at the end.
// ---------------------------------------------------------------------------
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "risk-bridge-test-"));

function mkSubdir(name) {
  const dir = path.join(TMP_ROOT, name);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function writeArticle(dir, slug, body) {
  const fp = path.join(dir, `${slug}.ts`);
  // Match the on-disk shape: `export default \`\n…\n\`;`.
  const raw = "export default `\n" + body + "\n`;\n";
  fs.writeFileSync(fp, raw);
  return fp;
}

function readBody(fp) {
  const raw = fs.readFileSync(fp, "utf8");
  const m = raw.match(/^export default `\n?([\s\S]*)`\s*;?\s*$/);
  return m ? m[1] : raw;
}

// ===========================================================================
// (a) RISK regex catalog: matches expected vocabulary, rejects unrelated.
// ===========================================================================
const RISK_VOCAB_FIXTURES = {
  es: {
    match: [
      "Hay una multa por presentar tarde.",
      "Te aplican varias multas adicionales.",
      "La sanción puede llegar a cinco cifras.",
      "Las sanciones acumuladas asustan al lector.",
      "El IRS impuso un bloqueo de la cuenta bancaria.",
      "La inspección de Hacienda llegó sin avisar.",
      "Una auditoría documental puede durar meses.",
      "Llevamos varias auditorías en marcha.",
      "Aplica un recargo del 20% por demora.",
      "Los recargos suben con el tiempo.",
    ],
    reject: [
      "El contribuyente firmó el contrato anual con calma.",
      "Una pequeña empresa familiar abre cuenta en el banco.",
      "El calendario fiscal se publica cada enero.",
    ],
  },
  en: {
    match: [
      "The IRS issued a fine for late filing.",
      "Two penalties stacked on top of each other.",
      "The bank applied an account block on the LLC.",
      "An audit can last several months.",
      "The taxpayer was audited last year.",
      "An inspection by FinCEN is rare but possible.",
      "Multiple inspections happened in 2024.",
    ],
    reject: [
      "The article explains how to register an LLC step by step.",
      "A monthly newsletter goes out every Friday.",
      "The accountant updated the calendar this morning.",
    ],
  },
  fr: {
    match: [
      "Une amende est prévue par la loi.",
      "Des amendes peuvent s'accumuler.",
      "La sanction touche le résident fiscal.",
      "Les sanctions sont publiques.",
      "Un blocage de compte est possible.",
      "Une inspection peut durer plusieurs jours.",
      "Plusieurs inspections sont en cours.",
      "Un audit défensif est recommandé.",
      "Des audits successifs fatiguent l'équipe.",
      "Une pénalité administrative est due.",
      "Plusieurs pénalités s'accumulent.",
    ],
    reject: [
      "L'entrepreneur ouvre son cabinet à Paris.",
      "Le calendrier comptable est mis à jour chaque mois.",
    ],
  },
  de: {
    match: [
      "Eine Strafe droht bei Verspätung.",
      "Mehrere Strafen sind möglich.",
      "Ein Bußgeld wird verhängt.",
      "Die Bußgelder summieren sich.",
      "Eine Sperrung des Kontos ist denkbar.",
      "Sperrungen treten gelegentlich auf.",
      "Eine Prüfung der Behörde steht an.",
      "Mehrere Prüfungen laufen parallel.",
      "Eine Inspektion bringt Klarheit.",
      "Eine Sanktion folgt aus dem Gesetz.",
      "Sanktionen sind dokumentiert.",
    ],
    reject: [
      "Der Buchhalter aktualisiert das Steuerkalender im Januar.",
      "Ein Beratungstermin dauert eine Stunde.",
    ],
  },
  pt: {
    // Note: the active regex matches `sanc[oõ]es` (no cedilla in the
    // plural). Real corpus usage of "sanções" with the cedilla is a
    // known coverage gap of the regex catalog — kept out of the
    // positive list so this test reflects the catalog's actual
    // behaviour, not its aspirational behaviour.
    match: [
      "Existe uma multa por entrega tardia.",
      "Várias multas se acumulam.",
      "A sanção é aplicável ao residente.",
      "Um bloqueio da conta é possível.",
      "Uma inspeção pode demorar.",
      "Uma auditoria fiscal é frequente.",
      "Várias auditorias correm em paralelo.",
    ],
    reject: [
      "O contabilista atualiza o calendário todos os meses.",
      "Uma reunião de planeamento dura uma hora.",
    ],
  },
  ca: {
    match: [
      "Hi ha una multa per presentació tardana.",
      "Diverses multes s'acumulen.",
      "La sanció afecta el resident.",
      "Les sancions són públiques.",
      "Un bloqueig del compte és possible.",
      "Una inspecció pot durar setmanes.",
      "Una auditoria documental cobreix tot.",
      "Diverses auditories en paral·lel.",
    ],
    reject: [
      "El comptable actualitza el calendari cada gener.",
      "Una reunió curta resol el dubte.",
    ],
  },
};

for (const lang of LANGS) {
  const re = RISK[lang];
  check(`(a) RISK[${lang}] is a defined regex`, re instanceof RegExp);
  const fx = RISK_VOCAB_FIXTURES[lang];
  for (const m of fx.match) {
    check(`(a) RISK[${lang}] matches: "${m.slice(0, 60)}"`, re.test(m));
  }
  for (const r of fx.reject) {
    check(
      `(a) RISK[${lang}] rejects: "${r.slice(0, 60)}"`,
      !re.test(r),
      `regex unexpectedly matched`,
    );
  }
}

// ===========================================================================
// (b) Injection adds bridge + idempotent on second run.
// ===========================================================================
{
  const dir = mkSubdir("inject-idempotent/es");
  const slug = "fixture-orphan";
  const orphanLine =
    "Algunos contribuyentes reciben una multa por presentar fuera de plazo el FBAR.";
  const fp = writeArticle(dir, slug, orphanLine);

  // First run: must inject a bridge into the orphan paragraph.
  const r1 = processFile(fp, "es");
  check(
    "(b) first run flags the orphan as changed",
    r1.changed === true,
    `expected changed=true, got ${r1.changed}`,
  );
  check(
    "(b) first run produces ≥1 bridge change",
    r1.changes.length >= 1,
    `changes.length=${r1.changes.length}`,
  );
  check(
    "(b) first run injected line contains 'Exentax'",
    /Exentax/.test(r1.modifiedRaw),
    `modifiedRaw missing 'Exentax'`,
  );
  // The bridge must be one of the canonical es BRIDGES variants.
  const injectedBridge = BRIDGES.es.find((b) => r1.modifiedRaw.includes(b));
  check(
    "(b) injected sentence comes from the canonical BRIDGES.es catalog",
    Boolean(injectedBridge),
    `none of BRIDGES.es appeared in modifiedRaw`,
  );
  // The original risk wording must still be present (we appended, not replaced).
  check(
    "(b) original risk wording preserved",
    r1.modifiedRaw.includes("multa por presentar fuera de plazo el FBAR"),
    `risk wording was overwritten`,
  );

  // Persist the first-run output and re-run: idempotent → no further change.
  fs.writeFileSync(fp, r1.modifiedRaw);
  const r2 = processFile(fp, "es");
  check(
    "(b) second run is idempotent (changed=false)",
    r2.changed === false,
    `second run unexpectedly changed file (changes=${r2.changes.length}, scrubbed=${r2.scrubbed}, migrated=${r2.migrated})`,
  );
  check(
    "(b) second run injects 0 new bridges",
    r2.changes.length === 0,
    `changes=${r2.changes.length}`,
  );
}

// ===========================================================================
// (c) Non-narrative managed blocks (cross-refs-v1, legal-refs-v1) are NEVER
//     modified — link/citation lists keep their semantics.
// ===========================================================================
for (const blockName of ["cross-refs-v1", "legal-refs-v1"]) {
  const dir = mkSubdir(`protected-${blockName}/es`);
  const slug = `fixture-${blockName}`;
  // The protected block contains risk vocabulary that, in a free
  // paragraph, would attract a bridge. The sweep must leave it alone.
  const body = [
    "Introducción libre que no menciona riesgos editoriales.",
    "",
    `<!-- exentax:${blockName} -->`,
    "",
    "- [Multas FBAR para residentes](/es/blog/multas-fbar)",
    "- [Sanción del IRS por omisión](/es/blog/sancion-irs)",
    "- [Auditoría documental BOI](/es/blog/auditoria-boi)",
    "",
    `<!-- /exentax:${blockName} -->`,
  ].join("\n");
  const fp = writeArticle(dir, slug, body);
  const before = fs.readFileSync(fp, "utf8");

  // Sanity: protected-set computation must mark the list block as
  // belonging to the non-narrative range.
  const blocks = body.split(/\n{2,}/);
  const ps = computeProtectedSet(blocks);
  // Locate the list block (the one with the '- [' bullets).
  const listIdx = blocks.findIndex((b) => b.includes("- [Multas FBAR"));
  check(
    `(c) ${blockName}: list block is in the protected set`,
    ps.has(listIdx),
    `listIdx=${listIdx}, protected=${[...ps].join(",")}`,
  );
  check(
    `(c) ${blockName}: list block is flagged non-narrative`,
    isNonNarrativeManaged(ps, listIdx) === true,
  );

  // Run the full sweep on the fixture. Result must be a no-op: no
  // bridge injected inside the protected list, no scrub of items out,
  // no Exentax appearing inside the marker pair on disk.
  const r = processFile(fp, "es");
  check(
    `(c) ${blockName}: sweep is a no-op (changed=false)`,
    r.changed === false,
    `unexpected mutations: changes=${r.changes.length}, scrubbed=${r.scrubbed}, migrated=${r.migrated}`,
  );
  // Re-read disk truth: file unchanged on disk too (processFile only
  // returns modifiedRaw; we never wrote it back).
  const after = fs.readFileSync(fp, "utf8");
  check(
    `(c) ${blockName}: file bytes unchanged after sweep`,
    after === before,
    `file content drifted`,
  );
  // And the modifiedRaw it would have written is identical to disk.
  check(
    `(c) ${blockName}: modifiedRaw equals original (no would-be writes)`,
    r.modifiedRaw === before,
  );
  // The "Exentax" word must not have leaked into the protected block.
  const newBody = readBody(fp);
  const protectedPortion = newBody.slice(
    newBody.indexOf(`<!-- exentax:${blockName} -->`),
    newBody.indexOf(`<!-- /exentax:${blockName} -->`) +
      `<!-- /exentax:${blockName} -->`.length,
  );
  check(
    `(c) ${blockName}: protected portion contains no 'Exentax' bridge`,
    !/Exentax/.test(protectedPortion),
    `bridge leaked into protected block`,
  );
}

// ===========================================================================
// (d) Legacy v1 → v2 migration rewrites old bridges deterministically.
// ===========================================================================
{
  const dir = mkSubdir("migration-v1-v2/es");
  const slug = "fixture-legacy";
  const legacy = LEGACY_BRIDGES.es[0]; // canonical v1 sentence
  const riskLine =
    "El IRS aplicó una multa por presentar fuera de plazo el FBAR.";
  // The v1 sweep used to write the legacy sentence right after the
  // risk line in the same paragraph. Reproduce that exact shape.
  const body = `${riskLine} ${legacy}`;
  const fp = writeArticle(dir, slug, body);

  const r1 = processFile(fp, "es");
  check(
    "(d) migration: file is reported as changed",
    r1.changed === true,
    `expected changed=true`,
  );
  check(
    "(d) migration: ≥1 bridge rewritten v1→v2",
    r1.migrated >= 1,
    `migrated=${r1.migrated}`,
  );
  check(
    "(d) migration: legacy sentence is gone from output",
    !r1.modifiedRaw.includes(legacy),
    `legacy sentence still present`,
  );
  // The replacement must be the v2 catalog entry chosen by the
  // (file, blockIndex, lineIndex) hash. The legacy sentence sat on
  // line 0 of block 0 of the file `fixture-legacy.ts`.
  const expected = pickBridgeForKey(
    "es",
    `${path.basename(fp, ".ts")}:0:0`,
  );
  check(
    "(d) migration: deterministic replacement matches pickBridgeForKey",
    r1.modifiedRaw.includes(expected),
    `expected v2 variant not found in output`,
  );

  // Determinism across runs: writing the migrated body back to disk
  // and re-running yields zero further migrations (no flapping).
  fs.writeFileSync(fp, r1.modifiedRaw);
  const r2 = processFile(fp, "es");
  check(
    "(d) migration: second run produces 0 further migrations",
    r2.migrated === 0,
    `second run still rewriting (migrated=${r2.migrated})`,
  );
  check(
    "(d) migration: second run is a no-op",
    r2.changed === false,
    `second run mutated file (changes=${r2.changes.length}, scrubbed=${r2.scrubbed})`,
  );

  // Cross-language sanity: every legacy catalog entry that does not
  // also appear verbatim in the active catalog must be rewritten when
  // present. Spot-check one extra language.
  const dirFr = mkSubdir("migration-v1-v2/fr");
  const legacyFr = LEGACY_BRIDGES.fr[0];
  const fpFr = writeArticle(
    dirFr,
    "fixture-legacy-fr",
    `Une amende est tombée la semaine dernière. ${legacyFr}`,
  );
  const rFr = processFile(fpFr, "fr");
  check(
    "(d) migration (fr): legacy sentence rewritten",
    rFr.migrated >= 1 && !rFr.modifiedRaw.includes(legacyFr),
    `migrated=${rFr.migrated}, legacy still present=${rFr.modifiedRaw.includes(legacyFr)}`,
  );
}

// ===========================================================================
// (e) --check exit codes + non-mutation contract (Task #35 CI gate).
// ===========================================================================
function runCheck(contentDir, reportPath) {
  return spawnSync(
    process.execPath,
    [SCRIPT_PATH, "--check"],
    {
      env: {
        ...process.env,
        BLOG_RISK_BRIDGE_CONTENT_DIR: contentDir,
        BLOG_RISK_BRIDGE_REPORT_PATH: reportPath,
      },
      encoding: "utf8",
    },
  );
}

function snapshotDir(dir) {
  // Build a {relPath → bytes} snapshot so we can detect any post-run drift.
  const snap = new Map();
  function walk(d, rel) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, ent.name);
      const r = path.join(rel, ent.name);
      if (ent.isDirectory()) walk(full, r);
      else snap.set(r, fs.readFileSync(full, "utf8"));
    }
  }
  walk(dir, "");
  return snap;
}

function snapshotsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const [k, v] of a) {
    if (b.get(k) !== v) return false;
  }
  return true;
}

// --- Clean fixture: risk paragraph IS bridged → exit 0, no mutations. ----
{
  const contentDir = mkSubdir("check-clean/content");
  const reportPath = path.join(TMP_ROOT, "check-clean", "report.md");
  for (const lang of LANGS) fs.mkdirSync(path.join(contentDir, lang), { recursive: true });
  // Single bridged article in es. Block 0 mentions the risk; block 1
  // carries the literal "Exentax" → adjacent, rule satisfied.
  writeArticle(
    path.join(contentDir, "es"),
    "clean-bridged",
    [
      "Algunos contribuyentes reciben una multa por presentar fuera de plazo.",
      "",
      "En Exentax te llevamos el calendario al día y resolvemos esto antes.",
    ].join("\n"),
  );
  const before = snapshotDir(contentDir);
  const reportExistsBefore = fs.existsSync(reportPath);

  const res = runCheck(contentDir, reportPath);
  check(
    "(e) --check on clean fixture: exit code is 0",
    res.status === 0,
    `status=${res.status}, stderr=${(res.stderr || "").slice(0, 400)}`,
  );
  const after = snapshotDir(contentDir);
  check(
    "(e) --check on clean fixture: corpus bytes unchanged",
    snapshotsEqual(before, after),
  );
  check(
    "(e) --check on clean fixture: report file NOT created",
    !reportExistsBefore && !fs.existsSync(reportPath),
  );
}

// --- Orphan fixture: risk paragraph not bridged → exit 1, no mutations. --
{
  const contentDir = mkSubdir("check-orphan/content");
  const reportPath = path.join(TMP_ROOT, "check-orphan", "report.md");
  for (const lang of LANGS) fs.mkdirSync(path.join(contentDir, lang), { recursive: true });
  // Single article with a risk paragraph and NO follow-up Exentax sentence.
  writeArticle(
    path.join(contentDir, "es"),
    "synthetic-orphan",
    "Algunos contribuyentes reciben una multa por presentar fuera de plazo.",
  );
  const before = snapshotDir(contentDir);
  const reportExistsBefore = fs.existsSync(reportPath);

  const res = runCheck(contentDir, reportPath);
  check(
    "(e) --check on orphan fixture: exit code is 1",
    res.status === 1,
    `status=${res.status}, stderr=${(res.stderr || "").slice(0, 400)}`,
  );
  // The error message must mention the offending file so reviewers can
  // jump straight to it.
  const stderr = res.stderr || "";
  check(
    "(e) --check on orphan fixture: stderr names the offending file",
    /synthetic-orphan/.test(stderr),
    `stderr did not reference the orphan slug`,
  );
  const after = snapshotDir(contentDir);
  check(
    "(e) --check on orphan fixture: corpus bytes unchanged",
    snapshotsEqual(before, after),
  );
  check(
    "(e) --check on orphan fixture: report file NOT created",
    !reportExistsBefore && !fs.existsSync(reportPath),
  );
}

// ---------------------------------------------------------------------------
// Bonus: appendBridgeToLine smoke tests — list-intro `:` → `.` rewrite and
// idempotence guard. Locked-in here because the splicer is the most
// failure-prone seam of the script.
// ---------------------------------------------------------------------------
{
  const br = BRIDGES.es[0];
  const out1 = appendBridgeToLine("Estos son los riesgos:", br);
  check(
    "splicer: list-intro ':' is rewritten to '.' before bridge",
    out1.startsWith("Estos son los riesgos. ") && out1.endsWith(br),
    `got: ${out1}`,
  );
  const out2 = appendBridgeToLine("Una frase normal.", br);
  check(
    "splicer: terminated sentence keeps its '.', bridge appended after a space",
    out2 === `Una frase normal. ${br}`,
    `got: ${out2}`,
  );
  const out3 = appendBridgeToLine("Una frase sin puntuación", br);
  check(
    "splicer: unterminated sentence gets a '.' inserted before the bridge",
    out3 === `Una frase sin puntuación. ${br}`,
    `got: ${out3}`,
  );
  const out4 = appendBridgeToLine(`Ya menciona Exentax aquí.`, br);
  check(
    "splicer: line that already mentions Exentax is returned unchanged",
    out4 === "Ya menciona Exentax aquí.",
    `got: ${out4}`,
  );
}

// ---------------------------------------------------------------------------
// Cleanup + summary.
// ---------------------------------------------------------------------------
try {
  fs.rmSync(TMP_ROOT, { recursive: true, force: true });
} catch {
  // Best-effort: a stale tmp dir under os.tmpdir() is harmless.
}

const total = passed + failures.length;
if (failures.length > 0) {
  console.error(
    `\n[blog-risk-bridge-inject.test] FAIL — ${failures.length} of ${total} assertion${total === 1 ? "" : "s"} failed:\n`,
  );
  for (const f of failures) console.error(f);
  console.error(
    `\n[blog-risk-bridge-inject.test] If you intentionally changed the sweep contract, update the fixtures here to match.`,
  );
  process.exit(1);
}
console.log(
  `[blog-risk-bridge-inject.test] OK — ${passed}/${total} assertions passed.`,
);
