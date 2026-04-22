#!/usr/bin/env node
/**
 * Regenerate `docs/seo/_link-graph.md` from the current content, preserving
 * the historical "Before" column (the state that existed before Task #24
 * rebalanced the link graph) and adding an "After" column showing the
 * post-Task-#32 distribution (hubs redirected to thematic siblings).
 *
 * Usage (from `exentax-web/`):
 *   node scripts/report-link-graph.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { computeGraph } from "./link-graph.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const DATA = path.join(ROOT, "client/src/data");
const DOCS = path.join(ROOT, "docs/seo");

const TRIM_COMMIT = "32f8803";

const HUBS = new Set([
  "form-5472-que-es-como-presentarlo",
  "cuenta-bancaria-mercury-llc-extranjero",
  "gastos-deducibles-llc-que-puedes-deducir",
  "constituir-llc-proceso-paso-a-paso",
  "tributacion-pass-through-llc-como-funciona",
  "boi-report-fincen-guia-completa-2026",
]);

function readFile(p) { return fs.readFileSync(p, "utf8"); }

function parseEsCategories() {
  const src = readFile(path.join(DATA, "blog-posts.ts"));
  const map = {};
  const rx = /slug:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let m;
  while ((m = rx.exec(src))) if (!map[m[1]]) map[m[1]] = m[2];
  return map;
}

// Parse an `_link-graph.md` markdown table row -> {slug: {before, after}}.
function parsePreviousReport() {
  // Pull the original _link-graph.md straight from the Task #24 commit so
  // re-runs of this script never compound their own output. The columns we
  // care about are "Before" (pre-#24) and "After" (post-#24).
  const prev = {};
  let src;
  try {
    src = execSync(`git show ${TRIM_COMMIT}:exentax-web/docs/seo/_link-graph.md`, {
      cwd: REPO_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return prev;
  }
  const cut = src.search(/^## /m);
  if (cut > 0) src = src.slice(0, cut);
  const rx = /^\|\s*`([^`]+)`\s*\|\s*([^|]*[A-Za-z][^|]*)\|\s*(\d+)\s*\|\s*(\d+)\s*\|/gm;
  let m;
  while ((m = rx.exec(src))) {
    prev[m[1]] = { before: Number(m[3]), after: Number(m[4]) };
  }
  return prev;
}

function main() {
  const after = computeGraph();
  const categories = parseEsCategories();
  const prev = parsePreviousReport();

  const lines = [];
  lines.push("# Internal link graph — before/after rebalance");
  lines.push("");
  lines.push(
    "_Counts are distinct source articles linking to the row, measured on the Spanish content (all languages inherit the same structure). The **Before** column is the state prior to Task #24 (`scripts/rebalance-links.mjs`). **After #24** is the state after Task #24 unwrapped over-concentrated hub links. **After #32** is the current state, after Task #32 (`scripts/redirect-hub-trims.mjs`) re-linked the unwrapped spots to thematically-adjacent siblings, so the SEO weight lands on under-linked neighbours instead of being thrown away._",
  );
  lines.push("");
  lines.push("| Article | Category | Before | After #24 | After #32 |");
  lines.push("|---|---|---:|---:|---:|");

  const sorted = [...after.allEsSlugs].sort(
    (a, b) => (after.incomingTotal[b] || 0) - (after.incomingTotal[a] || 0),
  );
  for (const s of sorted) {
    const before = prev[s]?.before ?? 0;
    const after24 = prev[s]?.after ?? (after.incomingTotal[s] || 0);
    const after32 = after.incomingTotal[s] || 0;
    lines.push(
      `| \`${s}\` | ${categories[s] || "-"} | ${before} | ${after24} | ${after32} |`,
    );
  }

  const under = (cnt) => after.allEsSlugs.filter((s) => (after.incomingTotal[s] || 0) < cnt).length;
  const over = (cnt) => after.allEsSlugs.filter((s) => (after.incomingTotal[s] || 0) > cnt).length;

  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Articles with <3 incoming links — **after #32**: ${under(3)}.`);
  lines.push(`- Articles with >10 incoming links — **after #32**: ${over(10)}.`);
  lines.push(
    `- Hub trims re-linked to siblings (rather than left as naked prose): across 6 hubs.`,
  );
  lines.push("");
  lines.push("## Hub redirect detail (Task #32)");
  lines.push("");
  lines.push("Each redirect below means: a source article that previously linked to a hub now points, in the same sentence and with the same anchor text, at the listed sibling instead. The sibling covers the same subtopic as the anchor word, so the prose still reads naturally.");
  lines.push("");
  lines.push("| Hub (now capped at 10) | Current incoming |");
  lines.push("|---|---:|");
  for (const hub of [...HUBS].sort()) {
    lines.push(`| \`${hub}\` | ${after.incomingTotal[hub] || 0} |`);
  }

  // Show which siblings received the redirected traffic, by diffing current
  // incoming against the post-#24 baseline stored in the previous report.
  lines.push("");
  lines.push("| Sibling that absorbed hub traffic | Before #32 | After #32 | Δ |");
  lines.push("|---|---:|---:|---:|");
  const diffs = [];
  for (const s of after.allEsSlugs) {
    if (HUBS.has(s)) continue;
    const before32 = prev[s]?.after ?? 0;
    const after32 = after.incomingTotal[s] || 0;
    const delta = after32 - before32;
    if (delta > 0) diffs.push({ s, before32, after32, delta });
  }
  diffs.sort((a, b) => b.delta - a.delta);
  for (const d of diffs) {
    lines.push(`| \`${d.s}\` | ${d.before32} | ${d.after32} | +${d.delta} |`);
  }

  fs.mkdirSync(DOCS, { recursive: true });
  fs.writeFileSync(path.join(DOCS, "_link-graph.md"), lines.join("\n") + "\n");
  console.log(`Wrote ${path.join(DOCS, "_link-graph.md")}`);
}

main();
