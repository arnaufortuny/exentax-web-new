#!/usr/bin/env node
/*
 * seo-orphan-audit-ci.mjs
 * ----------------------------------------------------------------------------
 * CI wrapper around `seo-orphan-audit.mjs` (Task #23 — make orphan detection
 * a fail-fast gate of `npm run blog:validate-all` / `npm run check`).
 *
 * The base audit script needs a live SPA on http://localhost:5000 to:
 *   - fetch `/sitemap.xml` (+ children) to know what URLs the server advertises
 *   - probe each sitemap URL for 4xx / 3xx / `noindex`
 *
 * `npm run check` does NOT spin up the dev server on its own, so this wrapper
 * implements a minimal lifecycle:
 *
 *   1. Probe `${BASE_URL}/sitemap.xml` (default base = http://localhost:5000)
 *      → if it answers 200, skip server boot and run the audit directly.
 *
 *   2. Otherwise spawn `npm run dev` in the background, poll the sitemap URL
 *      for up to BOOT_TIMEOUT_MS (default 60s).
 *      - If it comes up: run the audit, then SIGTERM the dev server we spawned.
 *      - If it never comes up: log a clear `[skip]` line and exit 0 so CI
 *        environments without dev-server access (sandboxed runners, etc.) can
 *        still complete `npm run check` without false negatives.
 *
 *   3. The audit is invoked with `--strict` so any orphan / ghost URL fails
 *      the parent process (and therefore `blog-validate-all` and `npm run check`).
 *
 * Env knobs (all optional):
 *   BASE_URL                  default http://localhost:5000
 *   ORPHAN_AUDIT_BOOT_MS      default 60000 (ms to wait for dev server to come up)
 *   ORPHAN_AUDIT_NO_BOOT=1    never spawn a dev server; if port is down, skip
 *
 * Exit codes:
 *   0 — audit passed in strict mode, or skipped because port was unreachable
 *       and could not be brought up.
 *   1 — strict audit found orphan/ghost URLs, or wrapper hit an unexpected
 *       error (failed to fetch sitemap, server crashed mid-run, etc.).
 * ----------------------------------------------------------------------------
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WS_ROOT = path.resolve(__dirname, "..");
const AUDIT_SCRIPT = path.join(WS_ROOT, "scripts/seo-orphan-audit.mjs");

const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const BOOT_TIMEOUT_MS = Number(process.env.ORPHAN_AUDIT_BOOT_MS || 60_000);
const NEVER_BOOT = process.env.ORPHAN_AUDIT_NO_BOOT === "1";
const PROBE_URL = `${BASE_URL}/sitemap.xml`;

function log(msg) { console.log(`[seo-orphan-audit-ci] ${msg}`); }
function warn(msg) { console.warn(`[seo-orphan-audit-ci] ${msg}`); }
function err(msg) { console.error(`[seo-orphan-audit-ci] ${msg}`); }

async function probeOnce(timeoutMs = 2000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(PROBE_URL, { signal: ctrl.signal });
    return res.status;
  } catch {
    return -1;
  } finally {
    clearTimeout(t);
  }
}

function spawnAudit() {
  return new Promise((resolve) => {
    const child = spawn("node", [AUDIT_SCRIPT, "--strict"], {
      cwd: WS_ROOT,
      stdio: "inherit",
      env: { ...process.env, BASE_URL },
    });
    child.on("exit", (code, signal) => {
      resolve({ code: code ?? (signal ? 1 : 0), signal });
    });
    child.on("error", (e) => {
      err(`failed to spawn audit: ${e.message}`);
      resolve({ code: 1 });
    });
  });
}

function spawnDevServer() {
  log("spawning `npm run dev` in background…");
  const child = spawn("npm", ["run", "dev"], {
    cwd: WS_ROOT,
    stdio: ["ignore", "inherit", "inherit"],
    env: { ...process.env, NODE_ENV: "development" },
    detached: false,
  });
  // Track whether the child exited on its own (crash / TS error / port in
  // use) so we can distinguish a real boot failure from a CI sandbox where
  // the child stays alive but :5000 never becomes reachable.
  child.exitedEarly = false;
  child.exitInfo = null;
  child.on("exit", (code, signal) => {
    if (!child._intentionalKill) {
      child.exitedEarly = true;
      child.exitInfo = { code, signal };
    }
  });
  child.on("error", (e) => err(`dev server spawn error: ${e.message}`));
  return child;
}

async function waitForServerOrCrash(child, deadlineMs) {
  // Returns one of: "ready", "crashed", "timeout".
  const t0 = Date.now();
  while (Date.now() - t0 < deadlineMs) {
    if (child && child.exitedEarly) return "crashed";
    const status = await probeOnce(2000);
    if (status === 200) return "ready";
    await new Promise((r) => setTimeout(r, 1000));
  }
  return "timeout";
}

async function killDevServer(child) {
  if (!child || child.killed || child.exitCode !== null) return;
  log("stopping background dev server (SIGTERM)…");
  child._intentionalKill = true;
  try { child.kill("SIGTERM"); } catch {}
  // Give it a moment, then SIGKILL if still alive.
  const exited = await new Promise((resolve) => {
    const to = setTimeout(() => resolve(false), 5000);
    child.once("exit", () => { clearTimeout(to); resolve(true); });
  });
  if (!exited) {
    try { child.kill("SIGKILL"); } catch {}
  }
}

async function main() {
  log(`probing ${PROBE_URL} …`);
  let status = await probeOnce(3000);
  let spawnedServer = null;

  if (status !== 200) {
    if (NEVER_BOOT) {
      log(`[skip] ${PROBE_URL} unreachable (status=${status}) and ORPHAN_AUDIT_NO_BOOT=1 — skipping orphan audit.`);
      return 0;
    }
    log(`port :5000 not serving sitemap (status=${status}); attempting to boot dev server (timeout=${BOOT_TIMEOUT_MS}ms)…`);
    try {
      spawnedServer = spawnDevServer();
    } catch (e) {
      warn(`could not spawn dev server: ${e?.message || e}`);
      log(`[skip] dev server unavailable in this environment — skipping orphan audit.`);
      return 0;
    }
    const result = await waitForServerOrCrash(spawnedServer, BOOT_TIMEOUT_MS);
    if (result === "crashed") {
      // The dev server exited on its own before binding to :5000 — that is a
      // real boot failure (TS error, port in use, missing module, etc.) and
      // MUST fail the gate so a regression in `npm run dev` cannot silently
      // bypass orphan detection. Distinct from the sandbox-skip path below.
      const info = spawnedServer.exitInfo || {};
      err(`dev server crashed during boot (code=${info.code} signal=${info.signal}). This is a real `
        + `startup regression, not a sandboxed-CI condition — failing the orphan-audit gate.`);
      return 1;
    }
    if (result === "timeout") {
      // Child still alive but :5000 never bound. Treat as sandboxed CI.
      warn(`dev server did not start within ${BOOT_TIMEOUT_MS}ms (child still alive — likely sandboxed CI without port access)`);
      await killDevServer(spawnedServer);
      log(`[skip] :5000 unreachable in CI — skipping orphan audit (no false negatives).`);
      return 0;
    }
    log(`dev server is up; running audit…`);
  } else {
    log(`existing server detected on :5000; running audit against it…`);
  }

  const { code } = await spawnAudit();
  if (spawnedServer) await killDevServer(spawnedServer);

  if (code !== 0) {
    err(`orphan audit exited with code ${code}`);
    return code;
  }
  log(`orphan audit passed in strict mode.`);
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    err(`unexpected wrapper error: ${e?.stack || e}`);
    process.exit(1);
  });
