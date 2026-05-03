/*
 * tests/test-e2e-gate-wiring.test.mjs
 * ----------------------------------------------------------------------------
 * Lock-in test for the two-phase wiring of `scripts/test-e2e-gate.mjs`
 * (Task #89 → Task #90).
 *
 * Why this exists
 *   Task #89 split the e2e gate into two phases:
 *     - Phase 1 — every chromium spec EXCEPT `analytics events`,
 *       against the prewarmed dev server on :5000.
 *     - Phase 2 — `analytics events` only, against a dedicated dev
 *       server booted on `E2E_GATE_ANALYTICS_PORT` (default 5050)
 *       with `E2E_TEST_HOOKS=1` so SSR injects
 *       `window.__EXENTAX_E2E_TRACKING__`.
 *   A future refactor could silently revert the wrapper to a
 *   single-phase invocation (analytics excluded again) and `npm run
 *   check` would still go green — the analytics regression would
 *   only surface days later when the out-of-band `e2e.yml` matrix
 *   ran. This self-test grep-asserts the wiring on the raw script
 *   source so the regression turns the gate red in the SAME commit.
 *
 *   It is intentionally a string-match test, not a behavioural one:
 *   the goal is to catch a silent revert, not to re-run Playwright.
 * ----------------------------------------------------------------------------
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GATE_PATH = path.resolve(__dirname, "..", "scripts", "test-e2e-gate.mjs");
const CHECK_PATH = path.resolve(__dirname, "..", "scripts", "check.mjs");

const gateSrc = readFileSync(GATE_PATH, "utf8");
const checkSrc = readFileSync(CHECK_PATH, "utf8");

test("Phase 1 grep-inverts `analytics events`", () => {
  assert.match(
    gateSrc,
    /"--grep-invert"\s*,\s*"analytics events"/,
    "Phase 1 must pass `--grep-invert \"analytics events\"` to playwright " +
      "so the analytics specs run only in Phase 2 (Task #89).",
  );
});

test("Phase 2 grep-includes `analytics events`", () => {
  assert.match(
    gateSrc,
    /"--grep"\s*,\s*"analytics events"/,
    "Phase 2 must pass `--grep \"analytics events\"` so only the " +
      "analytics specs run against the dedicated dev server (Task #89).",
  );
});

test("Phase 2 spawns a dev server with E2E_TEST_HOOKS=1", () => {
  // The spawn env literal sets E2E_TEST_HOOKS so server/e2e-hook.ts
  // injects window.__EXENTAX_E2E_TRACKING__ before the React bundle
  // parses. Without it, the analytics specs' ensureHookEnabled helper
  // throws and Phase 2 fails — but only if Phase 2 actually runs.
  assert.match(
    gateSrc,
    /E2E_TEST_HOOKS:\s*"1"/,
    "Phase 2 must spawn its dedicated dev server with E2E_TEST_HOOKS=1 " +
      "so the SSR analytics hook fires (Task #89).",
  );
});

test("Phase 2 spawns its server on a different PORT than Phase 1", () => {
  // Phase 1 reuses the prewarmed :5000 server; Phase 2 must bind a
  // separate port via E2E_GATE_ANALYTICS_PORT (default 5050).
  assert.match(
    gateSrc,
    /E2E_GATE_ANALYTICS_PORT/,
    "Phase 2 must read its port from E2E_GATE_ANALYTICS_PORT (Task #89).",
  );
  assert.match(
    gateSrc,
    /E2E_GATE_ANALYTICS_PORT\s*\|\|\s*5050/,
    "Phase 2 must default E2E_GATE_ANALYTICS_PORT to 5050 (Task #89).",
  );
  // Sanity: the spawn env passes PORT=String(ANALYTICS_PORT) so the
  // dedicated dev server actually binds the analytics port — not 5000.
  assert.match(
    gateSrc,
    /PORT:\s*String\(ANALYTICS_PORT\)/,
    "Phase 2's spawn env must set PORT to the analytics port so the " +
      "dedicated server doesn't collide with the prewarmed :5000 server.",
  );
});

test("SKIP_E2E=1 short-circuits early", () => {
  assert.match(
    gateSrc,
    /process\.env\.SKIP_E2E\s*===\s*"1"/,
    "SKIP_E2E=1 must remain an early-exit opt-out so devs can triage " +
      "unrelated failures without hacking package.json.",
  );
});

test("E2E_GATE_SKIP_ANALYTICS=1 short-circuits Phase 2", () => {
  assert.match(
    gateSrc,
    /process\.env\.E2E_GATE_SKIP_ANALYTICS\s*===\s*"1"/,
    "E2E_GATE_SKIP_ANALYTICS=1 must remain a documented opt-out so the " +
      "rest of the gate stays green when the analytics dev server can't " +
      "boot locally (Task #89).",
  );
});

test("scripts/check.mjs registers test:lint-e2e-gate-wiring with weight 1", () => {
  // Match the STEPS-table entry exactly so a refactor that drops the
  // gate from `npm run check` (or changes its weight) trips this test.
  assert.match(
    checkSrc,
    /name:\s*"test:lint-e2e-gate-wiring"\s*,\s*weight:\s*1\s*\}/,
    "scripts/check.mjs STEPS must include " +
      "{ name: 'test:lint-e2e-gate-wiring', weight: 1 } so the wiring " +
      "lock-in runs as part of `npm run check` (Task #90).",
  );
});
