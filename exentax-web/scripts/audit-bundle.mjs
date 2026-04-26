#!/usr/bin/env node
/**
 * audit-bundle.mjs (Task #30)
 *
 * Continuous bundle-size guard for the Vite client build. Complements the
 * componentes-audit (Task #25) so silent regressions — a heavy component
 * sneaking back into pages/* as a synchronous import, a vendor library
 * doubling in size, a locale dictionary that grew unchecked — fail the
 * build instead of degrading TTFB in production.
 *
 * Hard performance budget (PENDING.md §13, added 2026-04-26):
 *   Two top-level budgets gate the build with a non-zero exit code:
 *     - `dist/index.mjs`   server bundle ≤ 7 MB  (default; override via
 *                          BUNDLE_BUDGET_SERVER_MB).
 *     - `dist/public/`     total client output ≤ 30 MB (default; override
 *                          via BUNDLE_BUDGET_PUBLIC_MB).
 *   Both checks emit a single line of the form:
 *     bundle-budget: server <X> MB / 7 MB · public <Y> MB / 30 MB → OK|FAIL
 *   This is a HARD gate (exit 1 on FAIL); the existing per-chunk
 *   BUDGETS_KB table and the Discord-notification logic (audit-bundle-
 *   diff-notify-discord.mjs) remain as soft signals on top.
 *
 * Environment variables:
 *   BUNDLE_BUDGET_SERVER_MB   server-bundle ceiling in MB (default 7)
 *   BUNDLE_BUDGET_PUBLIC_MB   public-output ceiling in MB (default 30)
 *
 * Usage:
 *   node scripts/audit-bundle.mjs              # builds and audits
 *   node scripts/audit-bundle.mjs --no-build   # audits the existing dist
 *   node scripts/audit-bundle.mjs --json       # machine-readable JSON only
 *   node scripts/audit-bundle.mjs --history    # also append to the local
 *                                              # history (.local-audit/);
 *                                              # implicit when CI=true
 *   node scripts/audit-bundle.mjs --no-history # force-skip the history
 *                                              # write even if CI=true
 *
 * History (Task #51): the per-build history file is a build artifact, not
 * documentation. It lives in `.local-audit/bundle-audit-history.json`
 * (gitignored) and is written only when the operator opts in (`--history`)
 * or when running in CI (`CI=true`), so local builds do not dirty the
 * repo. See docs/auditoria-2026-04/RESUMEN.md → "Dónde vive el histórico".
 *
 * Exit codes:
 *   0  → all chunks within budget
 *   1  → at least one chunk exceeded its budget (CI gate)
 *   2  → build or filesystem error (no audit performed)
 */

import { spawnSync } from "node:child_process";
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS_DIR = path.resolve(ROOT, "dist/public/assets");
const SERVER_BUNDLE_PATH = path.resolve(ROOT, "dist/index.mjs");
const PUBLIC_DIR = path.resolve(ROOT, "dist/public");
const REPORT_DIR = path.resolve(ROOT, "docs/auditoria-2026-04");
const REPORT_PATH = path.resolve(REPORT_DIR, "bundle-audit.json");

// Hard performance budgets (PENDING.md §13). Both can be overridden via
// environment variables, so an operator with a justified regression can run
// the script with raised ceilings (e.g. for a one-off diagnostic) without
// editing the file. Defaults are aligned with the 2026-04 baseline:
// `dist/index.mjs` ~5.9 MB and `dist/public/` ~24 MB (see Sesión 5 notes).
const HARD_BUDGET_SERVER_MB = Number(process.env.BUNDLE_BUDGET_SERVER_MB ?? 7);
const HARD_BUDGET_PUBLIC_MB = Number(process.env.BUNDLE_BUDGET_PUBLIC_MB ?? 30);

// History lives in `.local-audit/` (gitignored) instead of `docs/` so local
// `npm run audit:bundle` runs do not dirty the repo with a new entry per
// build. The diff tool reads from the same location, and CI is responsible
// for persisting the history across runs (cache or upload-artifact step).
// See docs/auditoria-2026-04/RESUMEN.md → "Dónde vive el histórico".
const HISTORY_DIR = path.resolve(ROOT, ".local-audit");
const HISTORY_PATH = path.resolve(HISTORY_DIR, "bundle-audit-history.json");
const HISTORY_MAX_ENTRIES = 200;

// Budgets are expressed in kilobytes (raw, on-disk after minify) and apply
// per category. Headroom over the 2026-04-22 baseline is roughly 10% so a
// noticeable regression fails CI but ordinary content growth does not.
//
// To raise a budget, document the change in docs/auditoria-2026-04/RESUMEN.md
// (section "Bundle por página") with the reason and the new measured size.
const BUDGETS_KB = {
  "entry-index": 560,        // baseline 499 KB → +12% headroom
  "vendor-react": 220,       // baseline 193 KB
  "vendor-query": 60,
  "vendor-router": 25,
  "vendor-i18n": 60,
  "page": 150,               // any single page chunk (home, post, services/*)
  "blog-post": 90,           // any single per-article blog chunk
  "blog-shared": 160,        // shared blog index/list/i18n bundles
  "locale": 320,             // per-locale i18n message bundles
  "css": 200,
  "other": 200,
};

const args = new Set(process.argv.slice(2));
const skipBuild = args.has("--no-build");
const jsonOnly = args.has("--json");
// History writes are opt-in: they happen only when `--history` is passed
// or when running in CI (`CI=true`). Local builds therefore do not touch
// the history file. `--no-history` is kept as an explicit skip flag for
// backward compatibility — it suppresses the write even when CI=true,
// matching its original "do not touch the history" semantics.
const writeHistory =
  !args.has("--no-history") && (args.has("--history") || process.env.CI === "true");

function log(...m) {
  if (!jsonOnly) console.log(...m);
}

function runViteBuild() {
  log("running vite build (client only)...");
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const r = spawnSync(npx, ["vite", "build"], {
    cwd: ROOT,
    stdio: jsonOnly ? "ignore" : "inherit",
    env: { ...process.env },
  });
  if (r.status !== 0) {
    console.error(`vite build failed (exit ${r.status})`);
    process.exit(2);
  }
}

function classify(file) {
  if (file.endsWith(".css")) return "css";
  if (!file.endsWith(".js")) return null;
  if (/^index-[^.]+\.js$/.test(file)) {
    // The main entry chunk is the largest index-*.js; smaller index-*.js
    // files are secondary chunks. We classify by name pattern only here
    // and pick the largest as the entry below.
    return "index-candidate";
  }
  if (file.startsWith("vendor-react")) return "vendor-react";
  if (file.startsWith("vendor-query")) return "vendor-query";
  if (file.startsWith("vendor-router")) return "vendor-router";
  if (file.startsWith("vendor-i18n")) return "vendor-i18n";
  if (/^blog-(es|en|fr|de|pt|ca)-/.test(file)) return "blog-post";
  if (file.startsWith("blog-posts")) return "blog-shared";
  if (/^(es|en|fr|de|pt|ca)-[^.]+\.js$/.test(file)) return "locale";
  // Page chunks are everything else: home, post, booking, services pages,
  // legal/*, etc. Vite emits one chunk per dynamic import().
  return "page";
}

function readAssets() {
  let entries;
  try {
    entries = readdirSync(ASSETS_DIR);
  } catch (err) {
    console.error(`cannot read assets dir at ${ASSETS_DIR}: ${err.message}`);
    process.exit(2);
  }

  const items = [];
  for (const file of entries) {
    const full = path.join(ASSETS_DIR, file);
    const st = statSync(full);
    if (!st.isFile()) continue;
    const cat = classify(file);
    if (!cat) continue;
    const buf = readFileSync(full);
    const gzip = gzipSync(buf);
    items.push({
      file,
      category: cat,
      bytes: st.size,
      gzip: gzip.length,
    });
  }

  // Promote the single largest "index-candidate" to "entry-index"; demote
  // the rest to "page" since they are async route bundles emitted by Vite
  // with the same hashed filename pattern.
  const candidates = items.filter((i) => i.category === "index-candidate");
  candidates.sort((a, b) => b.bytes - a.bytes);
  candidates.forEach((it, idx) => {
    it.category = idx === 0 ? "entry-index" : "page";
  });

  return items;
}

function kb(bytes) {
  return Math.round((bytes / 1024) * 10) / 10;
}

function mb(bytes) {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}

// Recursively sum the sizes of every regular file under `dir`. Returns 0
// when `dir` is missing so the caller can decide whether absence is a
// hard error (we treat it as 0 + warning, not a budget breach: the per-
// chunk audit above will already exit 2 if the build artefacts are gone).
function dirTotalBytes(dir) {
  let total = 0;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      total += dirTotalBytes(full);
    } else if (ent.isFile()) {
      try {
        total += statSync(full).size;
      } catch {
        /* ignore unreadable files */
      }
    }
  }
  return total;
}

function fileSizeBytes(file) {
  try {
    return statSync(file).size;
  } catch {
    return 0;
  }
}

function checkHardBudget() {
  const serverBytes = fileSizeBytes(SERVER_BUNDLE_PATH);
  const publicBytes = dirTotalBytes(PUBLIC_DIR);
  const serverMb = mb(serverBytes);
  const publicMb = mb(publicBytes);
  const serverOk = serverBytes <= HARD_BUDGET_SERVER_MB * 1024 * 1024;
  const publicOk = publicBytes <= HARD_BUDGET_PUBLIC_MB * 1024 * 1024;
  const ok = serverOk && publicOk;
  return {
    serverBytes,
    publicBytes,
    serverMb,
    publicMb,
    serverBudgetMb: HARD_BUDGET_SERVER_MB,
    publicBudgetMb: HARD_BUDGET_PUBLIC_MB,
    serverOk,
    publicOk,
    ok,
  };
}

// Strip Vite's content-hash suffix (e.g. `index-BeVLyp_w.js` → `index.js`)
// so the same logical chunk can be matched across commits in the history.
function stripHash(file) {
  return file.replace(/-[A-Za-z0-9_-]{6,}(\.[A-Za-z0-9]+)$/, "$1");
}

function gitCommit() {
  try {
    const r = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: ROOT,
      encoding: "utf-8",
    });
    if (r.status === 0) return r.stdout.trim() || null;
  } catch {
    /* git not available */
  }
  return null;
}

function readHistory() {
  try {
    const raw = readFileSync(HISTORY_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data?.entries)) return data;
  } catch {
    /* file missing or malformed → start fresh */
  }
  return { entries: [] };
}

function appendHistory(entry) {
  const history = readHistory();
  history.entries.push(entry);
  if (history.entries.length > HISTORY_MAX_ENTRIES) {
    history.entries = history.entries.slice(-HISTORY_MAX_ENTRIES);
  }
  mkdirSync(HISTORY_DIR, { recursive: true });
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2) + "\n", "utf-8");
}

function buildHistoryEntry(report, items) {
  const top5 = items
    .slice()
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5)
    .map((i) => ({
      base: stripHash(i.file),
      category: i.category,
      bytesKb: kb(i.bytes),
      gzipKb: kb(i.gzip),
    }));

  const summaryKb = {};
  for (const [cat, s] of Object.entries(report.summary)) {
    summaryKb[cat] = s.totalKb;
  }

  const entryItem = items.find((i) => i.category === "entry-index");

  return {
    generatedAt: report.generatedAt,
    commit: gitCommit(),
    totalKb: report.totalKb,
    totalGzipKb: report.totalGzipKb,
    entryIndexKb: entryItem ? kb(entryItem.bytes) : null,
    summaryKb,
    top5,
  };
}

function audit(items) {
  const offenders = [];
  const summary = {};

  for (const it of items) {
    const budget = BUDGETS_KB[it.category] ?? BUDGETS_KB.other;
    const overBudget = it.bytes > budget * 1024;
    if (overBudget) {
      offenders.push({
        file: it.file,
        category: it.category,
        bytesKb: kb(it.bytes),
        budgetKb: budget,
      });
    }
    const s = (summary[it.category] ||= { count: 0, totalKb: 0, maxKb: 0, maxFile: "" });
    s.count += 1;
    s.totalKb = Math.round((s.totalKb + it.bytes / 1024) * 10) / 10;
    if (it.bytes / 1024 > s.maxKb) {
      s.maxKb = kb(it.bytes);
      s.maxFile = it.file;
    }
  }

  return { offenders, summary };
}

function main() {
  if (!skipBuild) runViteBuild();

  const items = readAssets();
  const { offenders, summary } = audit(items);

  // Per-category report table.
  const categories = Object.keys(summary).sort();
  const top = items
    .slice()
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 15)
    .map((i) => ({
      file: i.file,
      category: i.category,
      bytesKb: kb(i.bytes),
      gzipKb: kb(i.gzip),
    }));

  const totalKb = kb(items.reduce((s, i) => s + i.bytes, 0));
  const totalGzipKb = kb(items.reduce((s, i) => s + i.gzip, 0));

  const hardBudget = checkHardBudget();

  const report = {
    generatedAt: new Date().toISOString(),
    totalChunks: items.length,
    totalKb,
    totalGzipKb,
    budgetsKb: BUDGETS_KB,
    summary,
    top,
    offenders,
    hardBudget,
    pass: offenders.length === 0 && hardBudget.ok,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n", "utf-8");

  if (writeHistory) {
    appendHistory(buildHistoryEntry(report, items));
  }

  if (jsonOnly) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    log("");
    log(`Bundle audit — ${items.length} chunks · total ${totalKb} KB · gzip ${totalGzipKb} KB`);
    log("");
    log("Categoría        Chunks   Total (KB)   Mayor (KB)   Presupuesto (KB)   Mayor archivo");
    log("---------------- ------   ----------   ----------   ----------------   -------------");
    for (const cat of categories) {
      const s = summary[cat];
      const budget = BUDGETS_KB[cat] ?? BUDGETS_KB.other;
      log(
        `${cat.padEnd(16)} ${String(s.count).padStart(6)}   ${String(s.totalKb).padStart(10)}   ${String(s.maxKb).padStart(10)}   ${String(budget).padStart(16)}   ${s.maxFile}`,
      );
    }
    log("");
    log("Top 5 chunks por peso:");
    for (const t of top.slice(0, 5)) {
      log(`  ${String(t.bytesKb).padStart(7)} KB (gzip ${String(t.gzipKb).padStart(6)} KB)  ${t.file}  [${t.category}]`);
    }
    log("");
    if (offenders.length === 0) {
      log("OK · todos los chunks dentro del presupuesto.");
    } else {
      log(`FALLO · ${offenders.length} chunk(s) sobre el presupuesto:`);
      for (const o of offenders) {
        log(`  - ${o.file} (${o.category}) → ${o.bytesKb} KB > ${o.budgetKb} KB`);
      }
      log("");
      log("Si el aumento es justificado, sube el presupuesto correspondiente en");
      log("scripts/audit-bundle.mjs (BUDGETS_KB) y documenta el motivo en");
      log("docs/auditoria-2026-04/RESUMEN.md (sección 'Bundle por página').");
    }
    log("");
    log(`Reporte JSON: ${path.relative(ROOT, REPORT_PATH)}`);
    log("");
    log(
      `bundle-budget: server ${hardBudget.serverMb} MB / ${hardBudget.serverBudgetMb} MB · ` +
        `public ${hardBudget.publicMb} MB / ${hardBudget.publicBudgetMb} MB → ${hardBudget.ok ? "OK" : "FAIL"}`,
    );
    if (!hardBudget.ok) {
      if (!hardBudget.serverOk) {
        log(
          `  - server bundle ${hardBudget.serverMb} MB > ${hardBudget.serverBudgetMb} MB ` +
            `(override with BUNDLE_BUDGET_SERVER_MB=<n>)`,
        );
      }
      if (!hardBudget.publicOk) {
        log(
          `  - public output ${hardBudget.publicMb} MB > ${hardBudget.publicBudgetMb} MB ` +
            `(override with BUNDLE_BUDGET_PUBLIC_MB=<n>)`,
        );
      }
    }
  }

  // Hard gate (PENDING.md §13): exit 1 if either the per-chunk audit found
  // offenders OR the top-level server/public budget is exceeded.
  process.exit(offenders.length === 0 && hardBudget.ok ? 0 : 1);
}

main();
