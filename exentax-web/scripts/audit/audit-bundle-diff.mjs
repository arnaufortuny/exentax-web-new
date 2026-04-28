#!/usr/bin/env node
/**
 * audit-bundle-diff.mjs (Task #43)
 *
 * Reads the historical bundle audit log written by `audit-bundle.mjs` and
 * compares the latest entry with the previous one. Reports the change in:
 *   - total bundle size (`totalKb`, `totalGzipKb`)
 *   - the entry chunk (`entry-index`)
 *   - the 5 largest chunks of the latest run, matched by hash-stripped
 *     base name + category against the previous entry
 *
 * Any chunk (or the total / entry-index) that grew more than the regression
 * threshold (default 5%) makes the script exit with code 1, so it can be
 * wired to CI to comment on PRs / deploys without waiting for the absolute
 * budget to overflow.
 *
 * Usage:
 *   npm run audit:bundle:diff
 *   node scripts/audit/audit-bundle-diff.mjs --threshold=10   # custom % threshold
 *   node scripts/audit/audit-bundle-diff.mjs --json
 *
 * Exit codes:
 *   0  → no regression above threshold (or only a single history entry)
 *   1  → at least one regression above threshold
 *   2  → history file missing or unreadable
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
// History lives in `.local-audit/` (gitignored) — see audit-bundle.mjs.
const HISTORY_PATH = path.resolve(ROOT, ".local-audit/bundle-audit-history.json");

const argv = process.argv.slice(2);
const flag = (name, def) => {
  const m = argv.find((a) => a.startsWith(`--${name}=`));
  return m ? m.split("=")[1] : def;
};
const has = (name) => argv.includes(`--${name}`);

const THRESHOLD_PCT = Number(flag("threshold", "5"));
const JSON_ONLY = has("json");

function log(...m) {
  if (!JSON_ONLY) console.log(...m);
}

function readHistory() {
  try {
    const raw = readFileSync(HISTORY_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data?.entries)) return data.entries;
  } catch (err) {
    console.error(`No se pudo leer el histórico (${HISTORY_PATH}): ${err.message}`);
    console.error(
      "El histórico es opt-in: se escribe sólo con `--history` o cuando CI=true.",
    );
    console.error(
      "Para generar el primer registro en local ejecuta: `node scripts/audit/audit-bundle.mjs --history`",
    );
    console.error(
      "(o `npm run audit:bundle -- --history`). En CI, asegúrate de cachear `.local-audit/`.",
    );
    process.exit(2);
  }
  return [];
}

function pct(prev, curr) {
  if (prev == null || curr == null) return null;
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
}

function fmtKb(v) {
  return v == null ? "    n/a" : `${v.toFixed(1).padStart(7)} KB`;
}

function fmtPct(p) {
  if (p == null) return "   n/a ";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`.padStart(7);
}

function compareTop(prevTop5, currTop5) {
  // Match each current top chunk against the previous one by (base, category)
  // so a hashed-rename does not register as "new".
  const prevByKey = new Map(
    (prevTop5 || []).map((t) => [`${t.category}::${t.base}`, t]),
  );
  return currTop5.map((t) => {
    const prev = prevByKey.get(`${t.category}::${t.base}`);
    return {
      base: t.base,
      category: t.category,
      prevKb: prev ? prev.bytesKb : null,
      currKb: t.bytesKb,
      pct: prev ? pct(prev.bytesKb, t.bytesKb) : null,
      isNew: !prev,
    };
  });
}

function main() {
  const entries = readHistory();
  if (entries.length === 0) {
    if (JSON_ONLY) {
      process.stdout.write(
        JSON.stringify(
          { thresholdPct: THRESHOLD_PCT, status: "empty", entries: 0, pass: true },
          null,
          2,
        ) + "\n",
      );
    } else {
      log(
        "Histórico vacío — ejecuta `node scripts/audit/audit-bundle.mjs --history` " +
          "(o `npm run audit:bundle -- --history`) para crear el primer " +
          "registro. En CI es automático cuando CI=true.",
      );
    }
    process.exit(0);
  }
  if (entries.length === 1) {
    const only = entries[0];
    if (JSON_ONLY) {
      process.stdout.write(
        JSON.stringify(
          {
            thresholdPct: THRESHOLD_PCT,
            status: "single-entry",
            entries: 1,
            current: {
              generatedAt: only.generatedAt,
              commit: only.commit,
              totalKb: only.totalKb,
              totalGzipKb: only.totalGzipKb,
              entryIndexKb: only.entryIndexKb,
            },
            pass: true,
          },
          null,
          2,
        ) + "\n",
      );
    } else {
      log("Sólo hay un registro en el histórico (no hay con quién comparar todavía).");
      log(`  fecha:   ${only.generatedAt}`);
      log(`  commit:  ${only.commit ?? "(desconocido)"}`);
      log(`  total:   ${only.totalKb} KB (gzip ${only.totalGzipKb} KB)`);
      log("Tras el siguiente build con `npm run audit:bundle` aparecerá la comparativa.");
    }
    process.exit(0);
  }

  const curr = entries[entries.length - 1];
  const prev = entries[entries.length - 2];

  const totalPct = pct(prev.totalKb, curr.totalKb);
  const gzipPct = pct(prev.totalGzipKb, curr.totalGzipKb);
  const entryPct = pct(prev.entryIndexKb, curr.entryIndexKb);

  const topDiff = compareTop(prev.top5, curr.top5);

  const regressions = [];
  if (totalPct != null && totalPct > THRESHOLD_PCT) {
    regressions.push({ kind: "total", pct: totalPct, prevKb: prev.totalKb, currKb: curr.totalKb });
  }
  if (entryPct != null && entryPct > THRESHOLD_PCT) {
    regressions.push({
      kind: "entry-index",
      pct: entryPct,
      prevKb: prev.entryIndexKb,
      currKb: curr.entryIndexKb,
    });
  }
  for (const t of topDiff) {
    if (t.pct != null && t.pct > THRESHOLD_PCT) {
      regressions.push({
        kind: "chunk",
        base: t.base,
        category: t.category,
        pct: t.pct,
        prevKb: t.prevKb,
        currKb: t.currKb,
      });
    }
  }

  const result = {
    thresholdPct: THRESHOLD_PCT,
    previous: {
      generatedAt: prev.generatedAt,
      commit: prev.commit,
      totalKb: prev.totalKb,
      entryIndexKb: prev.entryIndexKb,
    },
    current: {
      generatedAt: curr.generatedAt,
      commit: curr.commit,
      totalKb: curr.totalKb,
      entryIndexKb: curr.entryIndexKb,
    },
    deltas: {
      totalKb: curr.totalKb - prev.totalKb,
      totalPct,
      gzipPct,
      entryIndexPct: entryPct,
    },
    top: topDiff,
    regressions,
    pass: regressions.length === 0,
  };

  if (JSON_ONLY) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    process.exit(regressions.length === 0 ? 0 : 1);
  }

  log("");
  log(`Bundle diff (umbral de regresión: >${THRESHOLD_PCT}%)`);
  log("");
  log(`  Anterior: ${prev.generatedAt}  commit ${prev.commit ?? "?"}`);
  log(`  Actual:   ${curr.generatedAt}  commit ${curr.commit ?? "?"}`);
  log("");
  const warn = (p) => (p != null && p > THRESHOLD_PCT ? " ⚠️" : "  ");
  log("  Métrica           Anterior          Actual           Δ");
  log("  ----------------  ---------------   ---------------  ---------");
  log(`  total             ${fmtKb(prev.totalKb)}   ${fmtKb(curr.totalKb)}   ${fmtPct(totalPct)}${warn(totalPct)}`);
  log(`  total (gzip)      ${fmtKb(prev.totalGzipKb)}   ${fmtKb(curr.totalGzipKb)}   ${fmtPct(gzipPct)}${warn(gzipPct)}`);
  log(`  entry-index       ${fmtKb(prev.entryIndexKb)}   ${fmtKb(curr.entryIndexKb)}   ${fmtPct(entryPct)}${warn(entryPct)}`);
  log("");
  log("  Top 5 chunks (actual)");
  log("  Δ        Anterior   Actual    Categoría        Chunk");
  log("  -------  --------   --------  ---------------  -----------------------------");
  for (const t of topDiff) {
    const marker = t.isNew
      ? "  NEW  "
      : t.pct != null && t.pct > THRESHOLD_PCT
        ? " ⚠️    "
        : "       ";
    const prevStr = t.prevKb == null ? "   n/a " : `${t.prevKb.toFixed(1).padStart(7)}`;
    const currStr = `${t.currKb.toFixed(1).padStart(7)}`;
    log(
      `  ${fmtPct(t.pct)}${marker}${prevStr}    ${currStr}   ${t.category.padEnd(15)}  ${t.base}`,
    );
  }
  log("");
  if (regressions.length === 0) {
    log(`OK · ningún chunk supera +${THRESHOLD_PCT}% respecto al registro anterior.`);
  } else {
    log(`FALLO · ${regressions.length} regresión(es) por encima de +${THRESHOLD_PCT}%:`);
    for (const r of regressions) {
      const label =
        r.kind === "chunk" ? `${r.category}/${r.base}` : r.kind;
      log(`  - ${label}: ${r.prevKb} KB → ${r.currKb} KB (${fmtPct(r.pct).trim()})`);
    }
    log("");
    log("Si el aumento es esperado (contenido nuevo, librería actualizada…), documenta");
    log("el motivo en docs/auditoria-2026-04/RESUMEN.md y, si procede, sube el");
    log("presupuesto correspondiente en scripts/audit/audit-bundle.mjs (BUDGETS_KB).");
  }

  process.exit(regressions.length === 0 ? 0 : 1);
}

main();
