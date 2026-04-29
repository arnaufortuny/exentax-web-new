#!/usr/bin/env node
/**
 * Single entry-point that runs every Discord regression script under
 * `scripts/discord/`. Wired into `npm run check` so any regression — bad
 * import path, missing `notify*` wrapper, non-neon embed colour, missing
 * component row, broken bot interaction handler — fails the build instead
 * of waiting for somebody to remember to run the scripts manually.
 *
 * Behaviour:
 *   - Always runs `test-discord-neon.ts` and `test-discord-bot-buttons.ts`.
 *   - Runs `test-discord-bot-e2e.ts` only when `DATABASE_URL` is set
 *     (the e2e exercises the live Postgres tables); otherwise skips it
 *     with a clear notice so local developers without a DB can still
 *     run the rest. CI sets `DATABASE_URL`, so the e2e always runs there.
 *   - Each child script gets a 180-second timeout so a hang cannot stall
 *     the whole CI gate.
 *   - All scripts are executed even if one fails, so the summary lists
 *     every regression in a single pass instead of forcing devs to
 *     re-run after each fix.
 *   - Exits non-zero if any script failed or timed out; exits 0 only
 *     when every executed script passed.
 *
 * Run: `npm run test:discord-regression` (from `exentax-web/`).
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 180_000;

const ALL_SCRIPTS = [
  {
    id: "neon",
    file: "test-discord-neon.ts",
    requires: [],
    description: "every embed uses the Exentax neon green",
  },
  {
    id: "bot-buttons",
    file: "test-discord-bot-buttons.ts",
    requires: [],
    description: "booking notifications go via the bot REST API with action rows",
  },
  {
    id: "bot-e2e",
    file: "test-discord-bot-e2e.ts",
    requires: ["DATABASE_URL"],
    description: "in-process end-to-end exercise of every slash command, button and modal",
  },
];

function runScript(script) {
  return new Promise((resolvePromise) => {
    const start = Date.now();
    const child = spawn(
      "npx",
      ["tsx", resolve(HERE, script.file)],
      { stdio: "inherit", env: process.env },
    );
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, TIMEOUT_MS);
    child.on("exit", (code, signal) => {
      clearTimeout(timer);
      const durationMs = Date.now() - start;
      resolvePromise({
        id: script.id,
        file: script.file,
        durationMs,
        timedOut,
        exitCode: code,
        signal,
        ok: !timedOut && code === 0,
      });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolvePromise({
        id: script.id,
        file: script.file,
        durationMs: Date.now() - start,
        timedOut: false,
        exitCode: null,
        signal: null,
        ok: false,
        error: err.message,
      });
    });
  });
}

const overallStart = Date.now();
const results = [];
const skipped = [];

for (const script of ALL_SCRIPTS) {
  const missing = script.requires.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    skipped.push({ ...script, missing });
    console.log(
      `\n=== SKIP scripts/discord/${script.file} (${script.description}) ===\n` +
      `  Missing required env: ${missing.join(", ")}. ` +
      `Set them to include this script in the regression run.`,
    );
    continue;
  }
  console.log(
    `\n=== RUN  scripts/discord/${script.file} (${script.description}) ===`,
  );
  // eslint-disable-next-line no-await-in-loop
  const result = await runScript(script);
  results.push(result);
}

const overallMs = Date.now() - overallStart;
const failed = results.filter((r) => !r.ok);

console.log("\n=== Discord regression summary ===");
for (const r of results) {
  const status = r.ok ? "PASS" : r.timedOut ? "TIMEOUT" : "FAIL";
  console.log(
    `  [${status}] ${r.file}  (${(r.durationMs / 1000).toFixed(1)}s` +
      (r.exitCode != null ? `, exit ${r.exitCode}` : "") +
      (r.signal ? `, signal ${r.signal}` : "") +
      ")",
  );
}
for (const s of skipped) {
  console.log(`  [SKIP] ${s.file}  (missing ${s.missing.join(", ")})`);
}
console.log(`  total: ${(overallMs / 1000).toFixed(1)}s`);

if (failed.length > 0) {
  console.error(
    `\n❌ Discord regression failed: ${failed.length}/${results.length} script(s) failed.`,
  );
  process.exit(1);
}

console.log(
  `\n✅ Discord regression OK — ${results.length}/${results.length} script(s) passed` +
    (skipped.length > 0 ? `, ${skipped.length} skipped` : "") +
    ".",
);
