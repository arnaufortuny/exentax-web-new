/**
 * Recurring SEO live-audit scheduler — Exentax Web (Task #49)
 *
 * Re-runs the same `scripts/seo/seo-live-audit.mjs` that the post-deploy
 * hook in `server/index.ts` already triggers once per release, but on a
 * recurring interval (default every 6 hours). The script's own Discord
 * envelope (`#exentax-errores`, EXENTAX_NEON colour, `[ERROR]/[AVISO]/
 * [INFO]` title prefix) is reused as-is — this scheduler only owns the
 * cadence, the spawn lifecycle, and the log surface.
 *
 * Why
 * ---
 * The post-deploy run (Task #42) only catches regressions that ship with
 * the next release. Silent regressions between deploys — CDN
 * mis-configuration, stale edge cache, partial rollout, expired robots
 * cache header — went unnoticed until the next push. A 6-hour cadence
 * shrinks the detection window from "until the next deploy" to "≤ 6 h".
 *
 * Cadence
 * -------
 * We use a plain `setInterval(intervalMs)`. `setInterval` fires the
 * FIRST tick `intervalMs` after start, so the recurring run cannot
 * collide with the post-deploy hook (T+20 s) at the default 6 h
 * cadence. Even with a low override (e.g. 10 min for QA), the
 * post-deploy script has long since exited before the first recurring
 * tick. No warmup setTimeout is necessary, which keeps the returned
 * handle a single, plain Timeout that the existing `activeIntervals`
 * shutdown loop can clear with one `clearInterval()`.
 *
 * Knobs
 * -----
 *   SEO_LIVE_AUDIT_RECURRING_DISABLE=1     Disables the recurring run
 *                                          INDEPENDENTLY of the
 *                                          post-deploy hook
 *                                          (`SEO_LIVE_AUDIT_DISABLE`).
 *   SEO_LIVE_AUDIT_RECURRING_INTERVAL_MS   Override the cadence (ms).
 *                                          Default 6 * 60 * 60 * 1000.
 *                                          Values < 60_000 are clamped
 *                                          up to 60 s to protect the
 *                                          server from accidental
 *                                          tight-loop misconfiguration.
 *
 * The scheduler reuses the same disable/spawn pattern as the post-deploy
 * hook (`server/index.ts`) so log triage is identical: each run logs
 * `[seo-live-audit] …` lines, FAILs are escalated to `logger.warn` and
 * the script itself posts the Discord embed when DISCORD_BOT_TOKEN +
 * DISCORD_CHANNEL_ERRORES are set. A second concurrent run is suppressed
 * by an in-process lock so a slow audit never overlaps with the next
 * tick.
 */

import { existsSync } from "node:fs";
import * as path from "node:path";
import { spawn } from "node:child_process";
import { logger } from "../logger";

const HOUR_MS = 60 * 60 * 1000;

export const DEFAULT_RECURRING_INTERVAL_MS = 6 * HOUR_MS;
export const MIN_RECURRING_INTERVAL_MS = 60_000;

interface SchedulerOpts {
  /**
   * Base URL the audit should hit. The recurring runner mirrors the
   * post-deploy hook and defaults to the loopback origin (`http://127.0.0.1:${port}`)
   * so the audit always exercises THIS process even when BASE_URL points
   * elsewhere for other tooling.
   */
  baseUrl: string;
}

let _running = false;

/**
 * Resolve the cadence from env, applying the documented floor. Exposed
 * for tests so we can lock the floor + default in place without spinning
 * up timers.
 */
export function resolveRecurringIntervalMs(
  raw: string | undefined,
  fallback = DEFAULT_RECURRING_INTERVAL_MS,
): number {
  if (typeof raw !== "string" || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  if (parsed < MIN_RECURRING_INTERVAL_MS) return MIN_RECURRING_INTERVAL_MS;
  return Math.floor(parsed);
}

/** Returns true when the recurring scheduler should NOT be started. */
export function isRecurringDisabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.SEO_LIVE_AUDIT_RECURRING_DISABLE === "1";
}

function locateScript(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "exentax-web/scripts/seo/seo-live-audit.mjs"),
    path.resolve(process.cwd(), "scripts/seo/seo-live-audit.mjs"),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

/**
 * Spawn the audit script once. Resolves when the child exits — the
 * caller does NOT need to await this (the scheduler fires it from a
 * `setInterval` and discards the promise), but tests rely on the
 * resolution to assert the spawn lifecycle. Failures are logged; this
 * function never throws so a single bad run never tears down the
 * scheduler.
 */
export function runSeoLiveAuditRecurring(opts: SchedulerOpts): Promise<void> {
  return new Promise((resolve) => {
    if (_running) {
      logger.info(
        "[seo-live-audit-recurring] previous run still in progress; skipping this tick",
        "seo",
      );
      resolve();
      return;
    }
    const script = locateScript();
    if (!script) {
      logger.warn(
        "[seo-live-audit-recurring] script not found in expected locations; skipping tick",
        "seo",
      );
      resolve();
      return;
    }
    _running = true;
    let child;
    try {
      child = spawn(process.execPath, [script], {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, BASE_URL: opts.baseUrl },
      });
    } catch (e) {
      _running = false;
      logger.warn(
        `[seo-live-audit-recurring] failed to spawn: ${e instanceof Error ? e.message : String(e)}`,
        "seo",
      );
      resolve();
      return;
    }

    // Mirror the post-deploy hook's log routing so operators see the
    // SAME shape of lines for both the once-per-deploy and the every-6h
    // run, and so the script's own `[seo-live-audit] FAIL` marker is
    // surfaced at warn level for log triage.
    const isAuditWarn = (line: string) =>
      line.startsWith("[seo-live-audit] FAIL") ||
      line.startsWith("[seo-live-audit] SKIPPED") ||
      /^\s*-\s/.test(line) ||
      /^sitemap[- ]/.test(line) ||
      /^route\b/i.test(line) ||
      /^robots\.txt/.test(line) ||
      /\bHTTP \d{3}\b/.test(line);

    child.stdout?.on("data", (b) => {
      for (const line of b.toString().split(/\r?\n/)) if (line) logger.info(line, "seo");
    });
    child.stderr?.on("data", (b) => {
      for (const line of b.toString().split(/\r?\n/)) {
        if (!line) continue;
        if (isAuditWarn(line)) logger.warn(line, "seo");
        else logger.info(line, "seo");
      }
    });
    child.on("error", (e) => {
      logger.warn(
        `[seo-live-audit-recurring] spawn error: ${e instanceof Error ? e.message : String(e)}`,
        "seo",
      );
    });
    child.on("exit", (code) => {
      _running = false;
      if (code && code !== 0) {
        logger.warn(
          `[seo-live-audit-recurring] exited with non-zero code ${code}`,
          "seo",
        );
      } else {
        logger.info(
          `[seo-live-audit-recurring] exited with code ${code}`,
          "seo",
        );
      }
      resolve();
    });
  });
}

/**
 * Start the recurring SEO live-audit. Returns a Timeout handle that the
 * caller should push into `activeIntervals` so it gets cleared on
 * shutdown alongside the other scheduled jobs.
 *
 * The first tick fires `intervalMs` after start (default = 6 h), which
 * is well after the post-deploy hook's audit (T+20 s) has finished —
 * so the two never collide. No warmup timer is necessary.
 *
 * If `SEO_LIVE_AUDIT_RECURRING_DISABLE=1` the function logs and returns
 * `null` — the caller treats null as "scheduler not started" and skips
 * the activeIntervals push.
 */
export function startSeoLiveAuditRecurringScheduler(
  opts: SchedulerOpts,
): NodeJS.Timeout | null {
  if (isRecurringDisabled()) {
    logger.info(
      "[seo-live-audit-recurring] SEO_LIVE_AUDIT_RECURRING_DISABLE=1 — recurring audit not scheduled",
      "seo",
    );
    return null;
  }
  const intervalMs = resolveRecurringIntervalMs(
    process.env.SEO_LIVE_AUDIT_RECURRING_INTERVAL_MS,
  );
  logger.info(
    `[seo-live-audit-recurring] scheduled — first run in ${Math.round(intervalMs / 1000)}s, then every ${Math.round(intervalMs / 1000)}s (BASE_URL=${opts.baseUrl})`,
    "seo",
  );
  return setInterval(() => {
    void runSeoLiveAuditRecurring(opts);
  }, intervalMs);
}
