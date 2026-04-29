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
 *  10. seo-orphan-audit-ci.mjs       (Task #23 — fail-fast orphan/ghost-URL
 *      gate; live cross-check of app-canonical vs sitemap vs reachable-from-home
 *      ≤3 clicks. Boots a background dev server on :5000 if needed; skips
 *      cleanly when CI cannot bring the server up.)
 *  11. audit-conversion-112x6.mjs --strict  (post-Task #53 conversion-grade
 *      gate: any new article or rewrite that drops a CTA contract — calc,
 *      agenda link, tel+WhatsApp row, LLC sub-link, ITIN sub-link — breaks
 *      `npm run check` before it can reach production).
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
const ROOT = path.resolve(__dirname, "..", "..");

const STEPS = [
  { id: "consistency", file: "scripts/blog/blog-consistency-check.mjs", node: "node" },
  { id: "content-lint", file: "scripts/blog/blog-content-lint.mjs", node: "node" },
  { id: "internal-links", file: "scripts/seo/seo-check-links.mjs", node: "node" },
  { id: "locale-link-leak", file: "scripts/blog/blog-link-locale-lint.mjs", node: "node" },
  { id: "cta", file: "scripts/blog/blog-cta-validate.mjs", node: "node" },
  { id: "data", file: "scripts/blog/blog-data-validate.mjs", node: "node" },
  { id: "sources", file: "scripts/blog/blog-sources-validate.mjs", node: "node" },
  // Task #41 — block any future article that ships without at least one
  // inline anchor to a §4.2 official-authority domain (irs.gov, fincen.gov,
  // agenciatributaria.gob.es, boe.es, hmrc.gov.uk, oecd.org, eur-lex.europa.eu,
  // …). The `sources` step above guards the structured SOURCES_BY_SLUG
  // registry; this one guards the article BODY so a new post cannot ship
  // with zero inline citations to an authority and silently regress §4.2.
  { id: "official-source-coverage", file: "scripts/blog/blog-official-source-coverage.mjs", node: "node" },
  { id: "faq-jsonld", file: "scripts/seo/seo-faq-jsonld-check.mjs", node: "node" },
  { id: "sitemap", file: "scripts/seo/seo-sitemap-check.mjs", node: "node" },
  { id: "sitemap-bcp47", file: "scripts/seo/seo-sitemap-bcp47.test.mjs", node: "node" },
  // Task #23 — fail-fast orphan / ghost-URL gate. Cross-checks app-canonical
  // URLs (from `shared/routes.ts` + blog availability) against the live
  // `/sitemap.xml` tree AND a BFS reachability map (≤3 clicks from `/{lang}`),
  // and live-probes every sitemap entry for 4xx / 3xx / `noindex`. The CI
  // wrapper boots a background dev server on :5000 if one isn't already there;
  // when the port is unreachable in CI it skips with a clear log line so this
  // step never produces false negatives in sandboxed runners. The audit
  // script itself was not moved into `scripts/seo/` by Task #5 cleanup, so
  // both files live at `scripts/seo-orphan-audit*.mjs` (top-level).
  { id: "orphan-audit", file: "scripts/seo-orphan-audit-ci.mjs", node: "node" },
  // Masterpiece audit reports a baseline score; we run it here so the
  // orchestrator surfaces any regression in scope (year-in-prose,
  // sources-block, calc-cta marker presence, etc.). Non-strict by default
  // (the strict variant is wired into `npm run check` via `seo:masterpiece-strict`).
  { id: "masterpiece-audit", file: "scripts/blog/blog-masterpiece-audit.mjs", node: "node" },
  // GEO / LLM-discoverability surface — wired here (via the
  // `npm run blog:validate-all` orchestrator) instead of `package.json`
  // because the agent is not allowed to edit `package.json` directly.
  // These two audits guard:
  //   1. seo-llm-readiness — robots.txt AI-bot allow-listing, llms.txt /
  //      llms-full.txt presence, Organization @id, AggregateRating, HowTo,
  //      ProfessionalService SSR markup.
  //   2. blog-cluster-audit — pillar-page → cluster cross-link integrity for
  //      the `abrir-llc-*` family (42 expected internal links).
  { id: "seo-llm-readiness", file: "scripts/seo/seo-llm-readiness.mjs", node: "node" },
  { id: "blog-cluster-audit", file: "scripts/blog/blog-cluster-audit.mjs", node: "node" },
  // Post-Task #53 conversion-grade gate. The audit script itself is
  // read-only by default (writes the CSV + markdown report and exits 0);
  // adding `--strict` flips it into a real CI gate that exits 1 if any
  // (slug, lang) pair is missing one of the 5 conversion contracts. Wired
  // here — instead of in package.json — because `npm run check` is off-limits
  // and `blog:validate-all` is already inside `check`. Same indirection
  // pattern as `seo-llm-readiness` and `blog-cluster-audit` above.
  { id: "conversion-strict", file: "scripts/audit/audit-conversion-112x6.mjs", node: "node", args: ["--strict"] },
  // Task #38 — every article preview (excerpt) and meta description (incl.
  // socialDescription / ogDescription) must lead with a digit in its first
  // sentence, mirroring the body-lead numeric anchor enforced by
  // `blog-numeric-hook-check.mjs` for Task #33. Wired here (not in
  // package.json, which is off-limits to the agent) so any future article or
  // copy edit that drops the numeric hook from a SERP/social snippet breaks
  // `npm run check` before reaching production.
  { id: "preview-numeric-hook", file: "scripts/blog/blog-preview-numeric-hook-check.mjs", node: "node" },
];

const EXTRA_EXTERNAL = {
  id: "external-sources",
  file: "scripts/blog/blog-verify-source-urls.mjs",
  node: "node",
};

function runStep(step) {
  const abs = path.join(ROOT, step.file);
  if (!fs.existsSync(abs)) {
    return { id: step.id, status: "skip", code: 0, reason: "script missing" };
  }
  const t0 = Date.now();
  const res = spawnSync(step.node, [abs, ...(step.args ?? [])], {
    cwd: ROOT,
    stdio: "inherit",
  });
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
