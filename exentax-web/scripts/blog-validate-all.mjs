#!/usr/bin/env node
/*
 * blog-validate-all.mjs
 * ----------------------------------------------------------------------------
 * One-shot orchestrator that runs the full blog-quality validation suite
 * (Task #6 v2 — step 5). Each step is a child node process so a failure in
 * one step doesn't shadow the others — the orchestrator collects every
 * exit code and reports a summary at the end.
 *
 * Steps (in order):
 *   1. blog-consistency-check.mjs    (5-registry parity gate)
 *   2. blog-content-lint.mjs         (forbidden price/address mentions)
 *   3. seo-check-links.mjs           (broken / under-linked internal links)
 *   4. blog-link-locale-lint.mjs     (cross-language blog link leak guard)
 *   5. blog-cta-validate.mjs         (calculator + contact CTA contract)
 *   6. blog-data-validate.mjs        (dates, meta length, uniqueness)
 *   7. seo-faq-jsonld-check.mjs      (FAQPage schema sanity)
 *   8. seo-sitemap-check.mjs         (sitemap shape)
 *   9. seo-sitemap-bcp47.test.mjs    (hreflang BCP-47 region tags, static + live)
 *
 * Optional (network):
 *   --with-external   also runs blog-verify-source-urls.mjs (HEAD/GET ping
 *                     against the canonical authority URLs cited by the
 *                     corpus). Disabled by default because it depends on
 *                     external availability.
 *
 * Exit code is 0 only when every step exits 0. Otherwise it returns 1 and
 * prints which step(s) failed.
 * ----------------------------------------------------------------------------
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const STEPS = [
  { id: "consistency", file: "scripts/blog-consistency-check.mjs", node: "node" },
  { id: "content-lint", file: "scripts/blog-content-lint.mjs", node: "node" },
  { id: "internal-links", file: "scripts/seo-check-links.mjs", node: "node" },
  { id: "locale-link-leak", file: "scripts/blog-link-locale-lint.mjs", node: "node" },
  { id: "cta", file: "scripts/blog-cta-validate.mjs", node: "node" },
  { id: "data", file: "scripts/blog-data-validate.mjs", node: "node" },
  { id: "sources", file: "scripts/blog-sources-validate.mjs", node: "node" },
  { id: "faq-jsonld", file: "scripts/seo-faq-jsonld-check.mjs", node: "node" },
  { id: "sitemap", file: "scripts/seo-sitemap-check.mjs", node: "node" },
  { id: "sitemap-bcp47", file: "scripts/seo-sitemap-bcp47.test.mjs", node: "node" },
  // Masterpiece audit reports a baseline score; we run it here so the
  // orchestrator surfaces any regression in scope (year-in-prose,
  // sources-block, calc-cta marker presence, etc.). Non-strict by default
  // (the strict variant is wired into `npm run check` via `seo:masterpiece-strict`).
  { id: "masterpiece-audit", file: "scripts/blog-masterpiece-audit.mjs", node: "node" },
];

const EXTRA_EXTERNAL = {
  id: "external-sources",
  file: "scripts/blog-verify-source-urls.mjs",
  node: "node",
};

function runStep(step) {
  const abs = path.join(ROOT, step.file);
  if (!fs.existsSync(abs)) {
    return { id: step.id, status: "skip", code: 0, reason: "script missing" };
  }
  const t0 = Date.now();
  const res = spawnSync(step.node, [abs], { cwd: ROOT, stdio: "inherit" });
  const ms = Date.now() - t0;
  return {
    id: step.id,
    status: res.status === 0 ? "ok" : "fail",
    code: res.status ?? 1,
    ms,
  };
}

function main() {
  const args = process.argv.slice(2);
  const withExternal = args.includes("--with-external");

  console.log("\n══ blog-validate-all ══════════════════════════════════════════\n");

  const queue = withExternal ? [...STEPS, EXTRA_EXTERNAL] : [...STEPS];
  const results = [];
  for (const step of queue) {
    console.log(`\n── [${step.id}] ${step.file}\n`);
    results.push(runStep(step));
  }

  console.log("\n══ summary ════════════════════════════════════════════════════\n");
  for (const r of results) {
    const tag =
      r.status === "ok" ? "✓ OK  "
      : r.status === "skip" ? "·· SKIP"
      : "✖ FAIL";
    const ms = r.ms !== undefined ? ` (${(r.ms / 1000).toFixed(1)}s)` : "";
    const reason = r.reason ? `  ${r.reason}` : "";
    console.log(`  ${tag}  ${r.id}${ms}${reason}`);
  }

  const failed = results.filter((r) => r.status === "fail");
  if (failed.length) {
    console.error(`\nblog-validate-all: ${failed.length} step(s) FAILED → ${failed.map((f) => f.id).join(", ")}\n`);
    process.exit(1);
  }
  console.log(`\nblog-validate-all: OK (${results.length} steps)\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
