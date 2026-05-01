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
 *   4. **Skip `analytics-events.spec.ts` in the local gate.** That
 *      spec needs the SSR pipeline to inject
 *      `window.__EXENTAX_E2E_TRACKING__`, which only happens when
 *      the dev server starts with `E2E_TEST_HOOKS=1`. The
 *      `npm run check` pre-warm intentionally does NOT set that
 *      flag (changing the pre-warm would have a wider blast radius
 *      on the dev server everyone shares). The full `e2e.yml`
 *      matrix already exercises that spec end-to-end with the hook
 *      on, so excluding it here is a defensible split, not a hole.
 *
 * Env knobs:
 *   SKIP_E2E=1                 → skip silently with exit 0
 *   PLAYWRIGHT_BROWSERS_PATH   → where to look for the chromium binary
 *                                (default `~/.cache/ms-playwright`)
 *   E2E_GATE_INCLUDE_ANALYTICS → set to "1" to NOT exclude
 *                                `analytics-events`. Only useful when
 *                                you have started the dev server with
 *                                `E2E_TEST_HOOKS=1` yourself.
 *
 * Exit codes:
 *   0  – tests passed, OR opted-out via SKIP_E2E=1.
 *   1  – tests failed, OR pre-flight failed (browsers / dev server).
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

// ---- 1b. Dev-server pre-flight ---------------------------------------------
//
// The specs need a live SPA on :5000 (`playwright.config.ts` sets
// `BASE_URL=http://localhost:${PORT}` with PORT defaulting to 5000).
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

const PROBE_URL = `http://localhost:${process.env.PORT || 5000}/sitemap.xml`;

async function probeServer(timeoutMs = 2500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(PROBE_URL, { signal: ctrl.signal });
    return r.status === 200;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

const serverUp = await probeServer();
if (!serverUp) {
  if (!process.env.DATABASE_URL) {
    log("");
    log(`no dev server on ${PROBE_URL.replace("/sitemap.xml", "")} and DATABASE_URL is unset.`);
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
  err(`❌ no dev server on ${PROBE_URL.replace("/sitemap.xml", "")} but DATABASE_URL is set.`);
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
const spawnEnv = { ...process.env };
delete spawnEnv.CI;
// Make the browsers path explicit so a `~/.cache/ms-playwright`
// resolved by us lines up with what Playwright will look at.
spawnEnv.PLAYWRIGHT_BROWSERS_PATH = browsersPath;

// ---- 3. Build the playwright argv ------------------------------------------
//
// `analytics-events` is excluded by default — see header comment.
// Forward any extra CLI args the caller passed (e.g. `--reporter=list`,
// a specific spec file) so this wrapper composes with normal Playwright
// usage and isn't a one-trick pony.
const extraArgs = process.argv.slice(2);
const baseArgs = ["playwright", "test", "--project=chromium"];
if (process.env.E2E_GATE_INCLUDE_ANALYTICS !== "1") {
  baseArgs.push("--grep-invert", "analytics events");
}
const finalArgs = [...baseArgs, ...extraArgs];

// ---- 4. Spawn ---------------------------------------------------------------
log(`running: npx ${finalArgs.join(" ")}`);
const child = spawn("npx", finalArgs, {
  cwd: WS_ROOT,
  stdio: "inherit",
  env: spawnEnv,
});

child.on("error", (e) => {
  err(`failed to spawn playwright: ${e.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    err(`playwright terminated by signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 1);
});
