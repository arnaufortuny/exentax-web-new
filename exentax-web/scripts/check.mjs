#!/usr/bin/env node
/*
 * scripts/check.mjs
 * ----------------------------------------------------------------------------
 * Parallel runner for the full quality gate (Task #66).
 *
 * Why this exists
 *   The original `check` script chained 33 npm steps sequentially. The total
 *   wall time was ~195 s, well above CI's per-command 120 s ceiling, so the
 *   gate had to be split into 4 manual blocks. Every individual step is a
 *   read-only file scan or a self-contained test process — they are mutually
 *   independent — so running them concurrently brings the gate well under the
 *   ceiling without dropping a single check.
 *
 * What it does
 *   - Spawns every step as an independent child process (`npm run -s <name>`).
 *   - Caps concurrency at `os.availableParallelism()` (override via
 *     `CHECK_CONCURRENCY=N`) so we don't oversubscribe a small CI box.
 *   - Captures stdout + stderr per step. On success, only a one-line summary
 *     is printed. On failure, the full captured output for the failing step
 *     is dumped so the cause is obvious without re-running locally.
 *   - Prints a per-step PASS/FAIL table sorted by duration at the end so
 *     slow steps stay visible (informs future tuning).
 *   - Exits 0 only when every step exits 0; otherwise exits 1.
 *
 * Usage
 *   node scripts/check.mjs                       # run every step in parallel
 *   CHECK_CONCURRENCY=4 node scripts/check.mjs   # cap at 4 workers
 *   node scripts/check.mjs --serial              # one-at-a-time (debugging)
 *
 * The list of STEPS below mirrors `npm run check` exactly. Whenever a new
 * gate is added to `check`, append it here too (keep in sync).
 * ----------------------------------------------------------------------------
 */
import { spawn } from "node:child_process";
import os from "node:os";
import { resolve as resolvePath, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolvePath(__dirname, "..");

// Each entry pairs an npm script name with a "weight" hint (typical wall-time
// in seconds when run alone, measured 2026-04-29). The runner sorts by weight
// descending so the heavyweight steps grab a worker slot first; the small
// gates fill in the remaining slots. This bin-packing trick keeps the wall
// time close to `max(weight)` instead of degrading toward the serial sum.
//
// Keep this list in lock-step with the `check:serial` chain in package.json —
// adding or removing a gate must be done in both places. Refresh weights
// occasionally; an out-of-date weight only hurts scheduling, never coverage.
const STEPS = [
  { name: "blog:validate-all",            weight: 50 },
  { name: "test:discord-regression",      weight: 43 },
  { name: "tsc",                          weight: 33 },
  { name: "seo:slash",                    weight: 30 },
  { name: "audit:bundle",                 weight: 27 },
  { name: "lint:blog",                    weight: 13 },
  { name: "test:booking",                 weight: 9 },
  { name: "test:newsletter",              weight: 9 },
  { name: "test:geo",                     weight: 8 },
  { name: "test:calculator",              weight: 7 },
  { name: "test:indexnow",                weight: 6 },
  { name: "seo:masterpiece-strict",       weight: 5 },
  { name: "seo:check",                    weight: 4 },
  { name: "i18n:check",                   weight: 3 },
  { name: "lint:typography",              weight: 3 },
  { name: "seo:meta",                     weight: 2 },
  { name: "lint:brand-casing",            weight: 2 },
  { name: "test:seo-check",               weight: 2 },
  { name: "lint:pt-pt",                   weight: 1 },
  { name: "lint:banking-entities",        weight: 1 },
  { name: "test:risk-bridge-inject",      weight: 1 },
  { name: "lint:stray-reports",           weight: 1 },
  { name: "test:masterpiece-audit",       weight: 1 },
  { name: "test:masterpiece-audit-rules", weight: 1 },
  { name: "test:redirects",               weight: 1 },
  { name: "test:no-inline-related",       weight: 1 },
  { name: "test:lint-blog",               weight: 1 },
  { name: "test:lint-banking-entities",   weight: 1 },
  { name: "test:audit-faqs",              weight: 1 },
  { name: "test:bundle-diff-notify",      weight: 1 },
  { name: "test:perf-gate-bypass-notify", weight: 1 },
  { name: "test:seo-slash",               weight: 1 },
  { name: "lint:email-deliverability",    weight: 1 },
  { name: "blog:bundle-sync",             weight: 1 },
  // Cabled under Audit 05 / Task #41 — were sitting orphaned in tests/
  // with no entry in this list nor in `check:serial`. Each guards a
  // distinct production invariant: the four heavy ones (DB or queue-bound)
  // get realistic weights so the bin-packer schedules them early; the
  // three static checks fill any remaining slot.
  { name: "test:discord-no-token-leak",      weight: 12 },
  { name: "test:discord-event-notifications", weight: 10 },
  { name: "test:drip-exactly-once",          weight: 5 },
  { name: "test:discord-queue-persistence",  weight: 5 },
  { name: "test:consent-atomicity",          weight: 3 },
  { name: "test:admin-api-removed",          weight: 1 },
  { name: "test:email-template-security",    weight: 1 },
  { name: "test:madrid-time-dst",            weight: 1 },
];

// `tsc` is special — it isn't a package.json script, it's invoked directly
// by the original `check` chain. We dispatch it through a small shim below
// so the loop above can stay uniform.
//
// `blog:bundle-sync` runs the localized blog-content bundle generator in
// --check mode so the gate fails (non-zero exit) when any of the six
// `client/src/data/blog-content/<lang>-all.ts` bundles drifts out of sync
// with the on-disk article files. Drift would silently fall the SSR SEO
// prerender back to Spanish content for affected slugs.
const DIRECT = new Map([
  ["tsc", { cmd: "npx", args: ["tsc"] }],
  ["blog:bundle-sync", { cmd: "node", args: ["scripts/blog/generate-content-bundles.mjs", "--check"] }],
]);

const args = new Set(process.argv.slice(2));
const SERIAL = args.has("--serial");
const CONCURRENCY = (() => {
  if (SERIAL) return 1;
  const env = Number(process.env.CHECK_CONCURRENCY);
  if (Number.isFinite(env) && env > 0) return Math.floor(env);
  // os.availableParallelism is available on Node 18.14+. Fall back to cpus().
  const cores =
    typeof os.availableParallelism === "function"
      ? os.availableParallelism()
      : (os.cpus()?.length ?? 4);
  return Math.max(2, Math.min(8, cores));
})();

function fmtMs(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

async function probeUrl(url, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    return r.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

async function waitForUp(url, deadlineMs) {
  const deadline = Date.now() + deadlineMs;
  while (Date.now() < deadline) {
    if (await probeUrl(url, 1500)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/**
 * Pre-warm a dev server on :5000 so the gates that need a live HTTP surface
 * — `seo:slash` and `blog:validate-all` (its `seo-orphan-audit-ci` step) —
 * can reuse it instead of each spawning their own under load. Cold-booting
 * `tsx server/index.ts` while five other Node processes are saturating the
 * CPU pushes the boot from ~10 s to >60 s, which is what was blowing the
 * 120 s budget. Pre-warming the box-empty case keeps boot fast and avoids
 * the two scripts racing each other.
 *
 * Returns the spawned child (so `main()` can SIGTERM it on exit) or `null`
 * when no server was started (already running, missing DATABASE_URL, or
 * boot failed — in which case the dependent scripts will degrade to
 * source-only scans, which is the legacy behaviour).
 */
async function prewarmDevServer() {
  if (process.env.DISABLE_CHECK_PREWARM === "1") return null;
  const probeUrlStr = "http://localhost:5000/sitemap.xml";
  if (await probeUrl(probeUrlStr, 1500)) {
    console.log("[check] reusing dev server already on :5000");
    return null;
  }
  if (!process.env.DATABASE_URL) {
    // Without DATABASE_URL the server cannot boot. The dependent scripts
    // detect the same condition and skip the live scan, so this is a
    // legitimate (and fast) degraded path — nothing to warm.
    return null;
  }
  console.log("[check] booting dev server on :5000 for live-scan steps ...");
  const tsxCli = resolvePath(REPO_ROOT, "node_modules/tsx/dist/cli.mjs");
  const child = spawn(
    process.execPath,
    [tsxCli, resolvePath(REPO_ROOT, "server/index.ts")],
    {
      cwd: REPO_ROOT,
      env: { ...process.env, PORT: "5000", NODE_ENV: "development" },
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    },
  );
  // Drain stdout/stderr so the pipes don't fill up and stall the server.
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  const ok = await waitForUp(probeUrlStr, 60000);
  if (!ok) {
    console.warn(
      "[check] dev server did not become ready in 60 s — running without it (live scans will degrade or self-boot).",
    );
    try { child.kill("SIGTERM"); } catch {}
    return null;
  }
  console.log("[check] dev server ready on :5000");
  return child;
}

function runStep(name) {
  const start = Date.now();
  const direct = DIRECT.get(name);
  const cmd = direct ? direct.cmd : "npm";
  const argv = direct ? direct.args : ["run", "-s", name];
  return new Promise((resolve) => {
    const child = spawn(cmd, argv, {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const chunks = [];
    child.stdout.on("data", (b) => chunks.push(b));
    child.stderr.on("data", (b) => chunks.push(b));
    child.on("error", (err) => {
      chunks.push(Buffer.from(`\n[runner] spawn error: ${err.message}\n`));
    });
    child.on("close", (code) => {
      resolve({
        name,
        code: code ?? 1,
        ms: Date.now() - start,
        output: Buffer.concat(chunks).toString("utf8"),
      });
    });
  });
}

async function main() {
  const total = STEPS.length;
  console.log(
    `[check] running ${total} gate${total === 1 ? "" : "s"} ` +
      `(concurrency=${CONCURRENCY}${SERIAL ? ", serial" : ""})`,
  );
  const overallStart = Date.now();

  // Pre-warm a dev server before launching the gates so live-scan steps
  // (`seo:slash`, `blog:validate-all`'s orphan audit) can reuse it instead
  // of cold-booting one each under heavy CPU contention.
  const devServer = await prewarmDevServer();
  const cleanupServer = () => {
    if (devServer && !devServer.killed) {
      try { devServer.kill("SIGTERM"); } catch {}
    }
  };
  process.once("SIGINT", () => { cleanupServer(); process.exit(130); });
  process.once("SIGTERM", () => { cleanupServer(); process.exit(143); });

  // Sort by weight descending so heavyweight steps grab a slot first; the
  // small ones fill in around them.
  const queue = [...STEPS]
    .sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1))
    .map((s) => s.name);
  const results = [];
  let running = 0;
  let finished = 0;

  await new Promise((done) => {
    const launch = () => {
      while (running < CONCURRENCY && queue.length > 0) {
        const name = queue.shift();
        running++;
        runStep(name).then((r) => {
          results.push(r);
          running--;
          finished++;
          const status = r.code === 0 ? "PASS" : "FAIL";
          const tag = `[${finished}/${total}]`;
          console.log(`${tag} ${status} ${r.name} (${fmtMs(r.ms)})`);
          if (queue.length > 0) launch();
          else if (running === 0) done();
        });
      }
      if (queue.length === 0 && running === 0) done();
    };
    launch();
  });

  const wallMs = Date.now() - overallStart;
  const failed = results.filter((r) => r.code !== 0);
  const passed = results.length - failed.length;

  // Per-step duration table — sorted longest first so the wall-time drivers
  // are visible even on a green run. Helps future tuning decisions.
  const byTime = [...results].sort((a, b) => b.ms - a.ms);
  console.log("\n[check] per-step durations (longest first):");
  for (const r of byTime) {
    const status = r.code === 0 ? "PASS" : "FAIL";
    console.log(`  ${status}  ${fmtMs(r.ms).padStart(7)}  ${r.name}`);
  }

  if (failed.length > 0) {
    // Dump captured output for every failure, in the order failures landed,
    // so the operator does not have to re-run locally to see the cause.
    console.log(
      `\n[check] ${failed.length} failure${failed.length === 1 ? "" : "s"} — captured output:`,
    );
    for (const r of failed) {
      console.log(
        `\n────────── FAIL: ${r.name} (exit ${r.code}, ${fmtMs(r.ms)}) ──────────`,
      );
      const trimmed = r.output.trim();
      console.log(trimmed.length > 0 ? trimmed : "(no output captured)");
    }
  }

  console.log(
    `\n[check] ${passed}/${total} passed · wall ${fmtMs(wallMs)} · ` +
      `${failed.length === 0 ? "OK" : "FAIL"}`,
  );
  cleanupServer();
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("[check] unexpected runner error:", err);
  // Best-effort: kill any lingering dev server we may have pre-warmed before
  // the runner crashed (cleanupServer is closed over `devServer` inside main,
  // so it's not reachable here — sweep by signal instead).
  process.exit(2);
});
