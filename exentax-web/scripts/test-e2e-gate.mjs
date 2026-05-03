#!/usr/bin/env node
/*
 * scripts/test-e2e-gate.mjs
 * ----------------------------------------------------------------------------
 * Gate-friendly wrapper around `npx playwright test --project=chromium`
 * (Task #83 — wire the Playwright e2e suite into `npm run check` so a
 * broken `data-testid`, selector or flow turns the gate red on the
 * SAME commit, not "horas o días después" via `e2e.yml`).
 *
 * Why a wrapper instead of just `playwright test` directly
 *   1. **Browser absent → actionable message, not a cryptic crash.**
 *      Without the chromium binary in `~/.cache/ms-playwright`,
 *      Playwright explodes with a long stack about `chrome` not
 *      being executable. A dev seeing that for the first time will
 *      assume the gate itself is broken. We pre-flight the binary
 *      and exit with one clear line if it is missing.
 *   2. **`SKIP_E2E=1` is honoured.** Devs running `npm run check`
 *      while triaging an unrelated failure can opt out without
 *      hacking package.json.
 *   3. **No `CI=1` leak into Playwright.** The pre-warm in
 *      `scripts/check.mjs` already booted a dev server on :5000.
 *      `playwright.config.ts` consults `process.env.CI` to decide
 *      whether to spin up its own `npm run dev` — if CI=1 leaks in,
 *      Playwright would try to bind :5000 again and collide. We
 *      strip CI from the spawn env to guarantee no second server.
 *   4. **Cover `analytics-events.spec.ts` in the local gate too
 *      (Task #89).** That spec needs the SSR pipeline to inject
 *      `window.__EXENTAX_E2E_TRACKING__`, which only happens when
 *      the dev server starts with `E2E_TEST_HOOKS=1`. The
 *      `npm run check` pre-warm intentionally does NOT set that
 *      flag (changing the pre-warm would have a wider blast radius
 *      on the dev server everyone shares — booking, newsletter,
 *      SEO scans, etc., all depend on its current shape). Instead
 *      we run the gate in two phases:
 *        - Phase 1 — every chromium spec EXCEPT `analytics events`,
 *          against the prewarmed :5000 server.
 *        - Phase 2 — `analytics events` only, against a SECOND,
 *          dedicated dev server we boot on `E2E_GATE_ANALYTICS_PORT`
 *          (default 5050) with `E2E_TEST_HOOKS=1` set, then tear
 *          down before exiting.
 *      Both phases must pass for the gate to be green. Phase 2 is
 *      skipped (with a clear log line, not a silent pass) when
 *      DATABASE_URL is unset — the dev server cannot boot without
 *      a database, and that matches the "skip live scan" pattern
 *      the rest of the gate already follows. CI (`quality-pipeline.yml`)
 *      always provides DATABASE_URL, so the gate is enforced there.
 *
 * Env knobs:
 *   SKIP_E2E=1                  → skip the entire gate with exit 0.
 *   PLAYWRIGHT_BROWSERS_PATH    → where to look for the chromium binary
 *                                 (default `~/.cache/ms-playwright`).
 *   E2E_GATE_SKIP_ANALYTICS=1   → run only Phase 1 (the legacy
 *                                 behaviour from before Task #89).
 *                                 Useful when you know the analytics
 *                                 dev server can't boot in your env
 *                                 and want to keep the rest of the
 *                                 gate green.
 *   E2E_GATE_ANALYTICS_PORT=N   → port for the dedicated analytics
 *                                 dev server (default 5050). Set this
 *                                 if 5050 is already in use locally.
 *
 * Exit codes:
 *   0  – every phase passed, OR opted-out via SKIP_E2E=1.
 *   1  – any phase failed, OR pre-flight failed (browsers / dev server).
 * ----------------------------------------------------------------------------
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WS_ROOT = path.resolve(__dirname, "..");

const TAG = "[test:e2e:gate]";
function log(msg) { console.log(`${TAG} ${msg}`); }
function err(msg) { console.error(`${TAG} ${msg}`); }

if (process.env.SKIP_E2E === "1") {
  log("skipped (SKIP_E2E=1).");
  process.exit(0);
}

// ---- 1. Browser pre-flight --------------------------------------------------
//
// Playwright stores its browsers under `$PLAYWRIGHT_BROWSERS_PATH`
// (or `~/.cache/ms-playwright` on Linux/macOS, `%USERPROFILE%/AppData/
// Local/ms-playwright` on Windows). Each engine lives in a versioned
// directory like `chromium-1187/`, `chromium_headless_shell-1187/`,
// `firefox-XXXX/`, `webkit-XXXX/`. We accept either the full
// chromium build OR the slimmer `chromium_headless_shell` build —
// both can drive `--project=chromium`.

function resolveBrowsersPath() {
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    return process.env.PLAYWRIGHT_BROWSERS_PATH;
  }
  // Default per Playwright docs.
  if (process.platform === "win32") {
    const userProfile = process.env.USERPROFILE || os.homedir();
    return path.join(userProfile, "AppData", "Local", "ms-playwright");
  }
  return path.join(os.homedir(), ".cache", "ms-playwright");
}

function chromiumInstalled(browsersPath) {
  if (!existsSync(browsersPath)) return false;
  let entries;
  try {
    entries = readdirSync(browsersPath);
  } catch {
    return false;
  }
  // Match either `chromium-XXXX` or `chromium_headless_shell-XXXX`.
  return entries.some((name) => {
    if (!/^chromium(_headless_shell)?-\d+$/.test(name)) return false;
    const full = path.join(browsersPath, name);
    try {
      return statSync(full).isDirectory();
    } catch {
      return false;
    }
  });
}

const browsersPath = resolveBrowsersPath();
if (!chromiumInstalled(browsersPath)) {
  err("");
  err("❌ Playwright chromium binary not found.");
  err(`   Looked under: ${browsersPath}`);
  err("");
  err("   Fix it with one of:");
  err("");
  err("     # install chromium (≈170MB, one-time):");
  err(`     cd exentax-web && PLAYWRIGHT_BROWSERS_PATH=${browsersPath} \\`);
  err("       npx playwright install chromium");
  err("");
  err("     # or skip the e2e gate for this run only:");
  err("     SKIP_E2E=1 npm run check");
  err("");
  err("   The full 7-browser matrix still runs in CI via .github/workflows/e2e.yml;");
  err("   the gate here only adds chromium for fast local feedback.");
  process.exit(1);
}

// ---- 1b. Dev-server pre-flight (Phase 1: :5000) ----------------------------
//
// The non-analytics specs need a live SPA on :5000 (`playwright.config.ts`
// sets `BASE_URL=http://localhost:${PORT}` with PORT defaulting to 5000).
// Inside `npm run check`, `scripts/check.mjs::prewarmDevServer()`
// already booted one (when DATABASE_URL is set) or reused the one
// the "Start application" workflow exposes.
//
// If the server is unreachable AND we have no way to boot it
// (no DATABASE_URL), we exit 0 with a clear "skip" line rather than
// timing out every test — matching the legacy behaviour of
// `seo-orphan-audit-ci.mjs` and the gate's "0 bloqueos por
// puerto/Postgres/browsers ausentes" requirement (Task #83). The
// gate does NOT silently pass when the server IS reachable: a real
// drift still turns it red.

const MAIN_PORT = Number(process.env.PORT || 5000);
const MAIN_BASE = `http://localhost:${MAIN_PORT}`;
const MAIN_PROBE_URL = `${MAIN_BASE}/sitemap.xml`;

async function probeServer(url, timeoutMs = 2500) {
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

const mainServerUp = await probeServer(MAIN_PROBE_URL);
if (!mainServerUp) {
  if (!process.env.DATABASE_URL) {
    log("");
    log(`no dev server on ${MAIN_BASE} and DATABASE_URL is unset.`);
    log("skipping e2e gate — start a dev server (`npm run dev`) and rerun,");
    log("or set SKIP_E2E=1 to make this skip explicit.");
    log("");
    process.exit(0);
  }
  // DATABASE_URL is set but server still down — could happen if
  // `prewarmDevServer()` failed to bring it up in 60s. Fail loud so
  // the operator sees the boot failure rather than every spec
  // timing out one by one.
  err("");
  err(`❌ no dev server on ${MAIN_BASE} but DATABASE_URL is set.`);
  err("   The pre-warm in scripts/check.mjs should have booted one.");
  err("   Check the [check] log lines above for a 'dev server did not become ready' warning.");
  err("");
  process.exit(1);
}

// ---- 2. Build the spawn env ------------------------------------------------
//
// We strip CI from the env so playwright.config.ts does NOT spawn a
// second dev server (the `prewarmDevServer` in scripts/check.mjs
// already owns :5000, and a duplicate webServer would collide).
function buildSpawnEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.CI;
  // Make the browsers path explicit so a `~/.cache/ms-playwright`
  // resolved by us lines up with what Playwright will look at.
  env.PLAYWRIGHT_BROWSERS_PATH = browsersPath;
  return env;
}

// ---- 3. Helper: run a playwright invocation --------------------------------
//
// Returns the exit code. We spawn with `stdio: "inherit"` so the
// reporter output streams to the user in real time — this is a gate,
// not a CI runner that batches output.
const extraArgs = process.argv.slice(2);

function runPlaywright({ phase, args, env }) {
  return new Promise((resolve) => {
    const finalArgs = ["playwright", "test", "--project=chromium", ...args, ...extraArgs];
    log(`[${phase}] running: npx ${finalArgs.join(" ")}`);
    const child = spawn("npx", finalArgs, {
      cwd: WS_ROOT,
      stdio: "inherit",
      env,
    });
    child.on("error", (e) => {
      err(`[${phase}] failed to spawn playwright: ${e.message}`);
      resolve(1);
    });
    child.on("exit", (code, signal) => {
      if (signal) {
        err(`[${phase}] playwright terminated by signal ${signal}`);
        return resolve(1);
      }
      resolve(code ?? 1);
    });
  });
}

// ---- 4. Phase 1: every spec except `analytics events` ----------------------
//
// We grep-invert the analytics specs because the prewarmed dev server
// on :5000 doesn't have `E2E_TEST_HOOKS=1` set, so the spec's
// `ensureHookEnabled` helper would (correctly) throw. Phase 2 below
// boots a dedicated server with the flag and runs the analytics specs
// against it.

const phase1Code = await runPlaywright({
  phase: "phase1",
  args: ["--grep-invert", "analytics events"],
  env: buildSpawnEnv(),
});

// ---- 5. Phase 2: `analytics events` against a dedicated dev server ---------
//
// We boot a SECOND `tsx server/index.ts` on `E2E_GATE_ANALYTICS_PORT`
// (default 5050) with `E2E_TEST_HOOKS=1` so `server/e2e-hook.ts`
// injects `<script>window.__EXENTAX_E2E_TRACKING__=true;</script>`
// before the React bundle parses. The analytics specs then bypass
// the dev/localhost short-circuit in `Tracking.tsx::hasAnalyticsConsent`
// and assert on the real `window.dataLayer` push.
//
// The second server is teardown-on-exit (SIGTERM, then SIGKILL after
// 5s if it's stuck), and SIGINT/SIGTERM on the wrapper itself are
// trapped to avoid leaving a zombie tsx process bound to :5050.

const ANALYTICS_PORT = Number(process.env.E2E_GATE_ANALYTICS_PORT || 5050);
const ANALYTICS_BASE = `http://localhost:${ANALYTICS_PORT}`;
const ANALYTICS_PROBE_URL = `${ANALYTICS_BASE}/sitemap.xml`;

async function waitForUp(url, deadlineMs) {
  const deadline = Date.now() + deadlineMs;
  while (Date.now() < deadline) {
    if (await probeServer(url, 1500)) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

let analyticsServer = null;

function killAnalyticsServer() {
  if (!analyticsServer || analyticsServer.killed) return;
  try { analyticsServer.kill("SIGTERM"); } catch {}
  // Best-effort hard-kill backstop after 5s in case the dev server
  // traps SIGTERM. We do not block the wrapper on this.
  setTimeout(() => {
    if (analyticsServer && !analyticsServer.killed) {
      try { analyticsServer.kill("SIGKILL"); } catch {}
    }
  }, 5000).unref?.();
}

process.once("SIGINT", () => { killAnalyticsServer(); process.exit(130); });
process.once("SIGTERM", () => { killAnalyticsServer(); process.exit(143); });

async function runAnalyticsPhase() {
  if (process.env.E2E_GATE_SKIP_ANALYTICS === "1") {
    log("[phase2] skipped (E2E_GATE_SKIP_ANALYTICS=1).");
    return 0;
  }
  if (extraArgs.length > 0) {
    // Triage mode: the operator passed extra CLI args (e.g. a specific
    // spec file) so they're targeting Phase 1. Forwarding the same
    // args to Phase 2 alongside `--grep "analytics events"` would
    // produce "no tests found" and confuse the result. Skip Phase 2
    // and tell the operator how to run the analytics specs alone.
    log(`[phase2] skipped — extra CLI args (${extraArgs.join(" ")}) are forwarded to Phase 1 only.`);
    log("[phase2] To target the analytics specs explicitly, run:");
    log("[phase2]   E2E_GATE_ANALYTICS_PORT=5050 PORT=5050 E2E_TEST_HOOKS=1 npm run dev");
    log("[phase2]   BASE_URL=http://localhost:5050 npx playwright test --project=chromium --grep \"analytics events\"");
    return 0;
  }
  if (!process.env.DATABASE_URL) {
    // Without DATABASE_URL the dev server's `db.ts` throws at import
    // time. Skip with a clear line — same degraded path the prewarm
    // takes, and CI (`quality-pipeline.yml`) always supplies one so
    // the gate stays enforced where it matters.
    log("");
    log("[phase2] DATABASE_URL is unset — cannot boot a dedicated dev server");
    log("[phase2] for `analytics events`. Skipping Phase 2.");
    log("[phase2] (CI provides DATABASE_URL; the analytics gate is enforced there.)");
    log("");
    return 0;
  }
  // If somebody (or a previous gate run) already has a dev server on
  // the analytics port, reuse it instead of trying to bind. The
  // spec's `ensureHookEnabled` helper will throw a clear error if
  // that pre-existing server is missing `E2E_TEST_HOOKS=1`, so
  // reusing is safe — we won't silently green-light a bad setup.
  if (await probeServer(ANALYTICS_PROBE_URL, 1500)) {
    log(`[phase2] reusing dev server already on :${ANALYTICS_PORT}`);
    return runPlaywright({
      phase: "phase2",
      args: ["--grep", "analytics events"],
      env: buildSpawnEnv({
        BASE_URL: ANALYTICS_BASE,
        PORT: String(ANALYTICS_PORT),
      }),
    });
  }

  log(`[phase2] booting analytics dev server on :${ANALYTICS_PORT} with E2E_TEST_HOOKS=1 ...`);
  const tsxCli = path.resolve(WS_ROOT, "node_modules/tsx/dist/cli.mjs");
  analyticsServer = spawn(
    process.execPath,
    [tsxCli, path.resolve(WS_ROOT, "server/index.ts")],
    {
      cwd: WS_ROOT,
      env: {
        ...process.env,
        PORT: String(ANALYTICS_PORT),
        NODE_ENV: "development",
        E2E_TEST_HOOKS: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    },
  );
  // Drain stdout/stderr so the pipes don't fill and stall the server.
  // Capture the tail in case boot fails — operators want a hint why.
  const bootLogChunks = [];
  const captureBoot = (b) => {
    bootLogChunks.push(b);
    // Cap memory at ~64KB of boot log; rotate the oldest chunks out.
    let total = bootLogChunks.reduce((n, c) => n + c.length, 0);
    while (total > 65_536 && bootLogChunks.length > 1) {
      total -= bootLogChunks.shift().length;
    }
  };
  analyticsServer.stdout.on("data", captureBoot);
  analyticsServer.stderr.on("data", captureBoot);

  const ready = await waitForUp(ANALYTICS_PROBE_URL, 60_000);
  if (!ready) {
    err("");
    err(`❌ [phase2] analytics dev server did not become ready in 60 s on :${ANALYTICS_PORT}.`);
    const tail = Buffer.concat(bootLogChunks).toString("utf8").trim();
    if (tail.length > 0) {
      err("   --- boot log tail ---");
      for (const line of tail.split(/\r?\n/).slice(-20)) err(`   ${line}`);
      err("   ---------------------");
    }
    err("");
    killAnalyticsServer();
    return 1;
  }
  log(`[phase2] analytics dev server ready on :${ANALYTICS_PORT}`);

  const code = await runPlaywright({
    phase: "phase2",
    args: ["--grep", "analytics events"],
    env: buildSpawnEnv({
      BASE_URL: ANALYTICS_BASE,
      PORT: String(ANALYTICS_PORT),
    }),
  });

  killAnalyticsServer();
  return code;
}

const phase2Code = await runAnalyticsPhase();

// ---- 6. Combine and exit ---------------------------------------------------
const finalCode = phase1Code === 0 && phase2Code === 0 ? 0 : 1;
process.exit(finalCode);
