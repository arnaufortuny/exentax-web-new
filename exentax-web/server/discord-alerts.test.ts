#!/usr/bin/env tsx
/*
 * discord-alerts.test.ts
 * ----------------------------------------------------------------------------
 * Unit tests for the Discord interaction-telemetry alert evaluator
 * (Task #32). Exercises the deterministic state machine in
 * `AlertEvaluator` with an injectable clock and a recording `notify` sink:
 *
 *   1. Warm-up: the first sample must NEVER trigger an alert (would
 *      otherwise misfire on every restart with non-zero counters).
 *   2. Below threshold: no notification is emitted.
 *   3. Threshold crossed: a single `firing` notification is emitted.
 *   4. Sustained incident: subsequent ticks do NOT spam Discord; a single
 *      `still_firing` reminder is emitted once `reminderMs` elapses.
 *   5. Recovery: a single `resolved` notification is emitted when the rate
 *      drops back below the threshold.
 *   6. Env override: `loadAlertConfig()` honours per-rule env vars and
 *      ignores invalid / non-positive values.
 *
 * Run with `npx tsx exentax-web/server/discord-alerts.test.ts`. Exits 0
 * on success, 1 on any failure so it can be wired into CI later.
 * ----------------------------------------------------------------------------
 */

import {
  AlertEvaluator,
  DEFAULT_RULES,
  loadAlertConfig,
  type AlertConfig,
  type AlertNotification,
  type AlertRule,
} from "./discord-alerts";
import type { MetricsSnapshot } from "./metrics";

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function record(name: string, ok: boolean, detail?: string): void {
  results.push({ name, ok, detail });
}

function makeSnapshot(overrides: {
  signature?: number;
  replay?: number;
  unauthorised?: number;
  dropped?: number;
} = {}): MetricsSnapshot {
  return {
    uptimeSeconds: 0,
    rssBytes: 0,
    heapUsedBytes: 0,
    eventLoopLagP99Ms: 0,
    http: { totals: {}, durationCount: 0, durationSumMs: 0, bucketsMs: [] },
    discord: {
      queueSize: 0,
      droppedTotal: overrides.dropped ?? 0,
      sendFailureTotal: 0,
      signatureFailures: { bad_signature: overrides.signature ?? 0 },
      replayRejectedTotal: overrides.replay ?? 0,
      unauthorisedTotal: overrides.unauthorised ?? 0,
      auditWriteFailureTotal: 0,
      interactionsByType: {},
      commandTotal: {},
      commandDurationCount: 0,
      commandDurationSumMs: 0,
      commandBucketsMs: [],
    },
    email: { retryQueueSize: 0 },
    alerts: { fallbackTotal: 0 },
    client: { errorsTotal: 0 },
    breakers: {},
  };
}

interface Harness {
  evaluator: AlertEvaluator;
  notifications: AlertNotification[];
  setNow: (ms: number) => void;
  rule: AlertRule;
}

function makeHarness(opts: { ruleId: string; reminderMin?: number; windowSec?: number; threshold?: number }): Harness {
  const rule = DEFAULT_RULES.find((r) => r.id === opts.ruleId);
  if (!rule) throw new Error(`Unknown rule: ${opts.ruleId}`);
  let now = 1_700_000_000_000;
  const notifications: AlertNotification[] = [];
  const config: AlertConfig = {
    windowSeconds: opts.windowSec ?? 60,
    reminderMs: (opts.reminderMin ?? 30) * 60_000,
    thresholds: { [rule.id]: opts.threshold ?? rule.threshold },
  };
  const evaluator = new AlertEvaluator({
    rules: [rule],
    config,
    notify: (n) => notifications.push(n),
    now: () => now,
  });
  return {
    evaluator,
    notifications,
    setNow: (ms) => { now = ms; },
    rule,
  };
}

function main(): void {
  // ── Test 1: warm-up never alerts even with high counter at boot ──
  {
    const h = makeHarness({ ruleId: "signature_failures" });
    h.evaluator.evaluate(makeSnapshot({ signature: 500 }));
    record(
      "warm-up: first sample with high counter does not notify",
      h.notifications.length === 0,
      `notifications=${h.notifications.length}`,
    );
  }

  // ── Test 2: rate below threshold → no alert ──
  {
    const h = makeHarness({ ruleId: "signature_failures", threshold: 10 });
    const t0 = 1_700_000_000_000;
    h.setNow(t0);
    h.evaluator.evaluate(makeSnapshot({ signature: 0 })); // baseline
    h.setNow(t0 + 60_000);
    h.evaluator.evaluate(makeSnapshot({ signature: 5 })); // 5/min < 10/min
    record(
      "below threshold: no alert fired",
      h.notifications.length === 0,
      `notifications=${h.notifications.length}`,
    );
  }

  // ── Test 3: rate above threshold → exactly one firing alert ──
  {
    const h = makeHarness({ ruleId: "signature_failures", threshold: 10 });
    const t0 = 1_700_000_000_000;
    h.setNow(t0);
    h.evaluator.evaluate(makeSnapshot({ signature: 0 }));
    h.setNow(t0 + 60_000);
    h.evaluator.evaluate(makeSnapshot({ signature: 30 })); // 30/min ≥ 10
    record(
      "threshold crossed: exactly one firing notification",
      h.notifications.length === 1 && h.notifications[0].state === "firing",
      `notifications=${h.notifications.map((n) => n.state).join(",")}`,
    );
    record(
      "firing notification carries correct rate and threshold",
      h.notifications[0]?.ratePerMin === 30 && h.notifications[0]?.threshold === 10,
      `rate=${h.notifications[0]?.ratePerMin} threshold=${h.notifications[0]?.threshold}`,
    );
  }

  // ── Test 4: sustained incident is throttled, then reminded ──
  {
    const h = makeHarness({ ruleId: "signature_failures", threshold: 10, reminderMin: 30 });
    const t0 = 1_700_000_000_000;
    h.setNow(t0);
    h.evaluator.evaluate(makeSnapshot({ signature: 0 }));
    h.setNow(t0 + 60_000);
    h.evaluator.evaluate(makeSnapshot({ signature: 30 })); // firing
    // Five more ticks within the 30-min reminder window — must stay quiet.
    // Each 5-min gap adds 150 events (30/min sustained, well above the
    // 10/min threshold) so the rule remains in `firing` throughout.
    let cumulative = 30;
    for (let i = 1; i <= 5; i++) {
      h.setNow(t0 + 60_000 + i * 5 * 60_000); // +5, +10, +15, +20, +25 min
      cumulative += 150;
      h.evaluator.evaluate(makeSnapshot({ signature: cumulative }));
    }
    const onlyFiring = h.notifications.length === 1 && h.notifications[0].state === "firing";
    record(
      "sustained incident: no spam during reminder window",
      onlyFiring,
      `notifications=${h.notifications.map((n) => n.state).join(",")}`,
    );

    // Now jump past the reminder interval — exactly one "still_firing".
    h.setNow(t0 + 60_000 + 31 * 60_000); // 31 min after firing started
    cumulative += 30 * 6;                 // 6 more minutes at 30/min
    h.evaluator.evaluate(makeSnapshot({ signature: cumulative }));
    const expected =
      h.notifications.length === 2 &&
      h.notifications[1].state === "still_firing" &&
      h.notifications[1].firstFiredAt === t0 + 60_000;
    record(
      "still firing reminder emitted once after reminder interval",
      expected,
      `notifications=${h.notifications.map((n) => n.state).join(",")} firstFiredAt=${h.notifications[1]?.firstFiredAt}`,
    );
  }

  // ── Test 5: resolution emits a single "resolved" notification ──
  {
    const h = makeHarness({ ruleId: "dropped", threshold: 1 });
    const t0 = 1_700_000_000_000;
    h.setNow(t0);
    h.evaluator.evaluate(makeSnapshot({ dropped: 0 }));
    h.setNow(t0 + 60_000);
    h.evaluator.evaluate(makeSnapshot({ dropped: 5 })); // firing (5/min ≥ 1)
    // Counter freezes — rate drops to 0 once the baseline rolls forward.
    h.setNow(t0 + 120_000);
    h.evaluator.evaluate(makeSnapshot({ dropped: 5 }));
    h.setNow(t0 + 180_000);
    h.evaluator.evaluate(makeSnapshot({ dropped: 5 }));
    const states = h.notifications.map((n) => n.state);
    record(
      "resolution: firing then resolved (no extra noise)",
      states.length === 2 && states[0] === "firing" && states[1] === "resolved",
      `states=${states.join(",")}`,
    );
  }

  // ── Test 6: signature failures aggregate across reasons ──
  {
    const h = makeHarness({ ruleId: "signature_failures", threshold: 10 });
    const t0 = 1_700_000_000_000;
    h.setNow(t0);
    // Inject multiple reason buckets via a custom snapshot.
    const snap = makeSnapshot();
    snap.discord.signatureFailures = { missing: 0, bad_format: 0, bad_signature: 0 };
    h.evaluator.evaluate(snap);
    h.setNow(t0 + 60_000);
    const snap2 = makeSnapshot();
    snap2.discord.signatureFailures = { missing: 4, bad_format: 4, bad_signature: 4 };
    h.evaluator.evaluate(snap2); // 12/min total ≥ 10
    record(
      "signature_failures: sums every reason bucket",
      h.notifications.length === 1 && h.notifications[0].state === "firing" && h.notifications[0].ratePerMin === 12,
      `rate=${h.notifications[0]?.ratePerMin}`,
    );
  }

  // ── Test 7: env overrides honoured, garbage rejected ──
  {
    const prev = {
      thresh: process.env.DISCORD_ALERT_THRESHOLD_DROPPED,
      window: process.env.DISCORD_ALERT_WINDOW_SECONDS,
      reminder: process.env.DISCORD_ALERT_REMINDER_MINUTES,
    };
    process.env.DISCORD_ALERT_THRESHOLD_DROPPED = "7";
    process.env.DISCORD_ALERT_WINDOW_SECONDS = "120";
    process.env.DISCORD_ALERT_REMINDER_MINUTES = "not-a-number";
    const cfg = loadAlertConfig();
    record(
      "env override: numeric threshold applied",
      cfg.thresholds.dropped === 7,
      `dropped=${cfg.thresholds.dropped}`,
    );
    record(
      "env override: window seconds applied",
      cfg.windowSeconds === 120,
      `windowSeconds=${cfg.windowSeconds}`,
    );
    record(
      "env override: invalid reminder falls back to default",
      cfg.reminderMs === 30 * 60_000,
      `reminderMs=${cfg.reminderMs}`,
    );
    // Restore env so the test is hermetic.
    if (prev.thresh === undefined) delete process.env.DISCORD_ALERT_THRESHOLD_DROPPED;
    else process.env.DISCORD_ALERT_THRESHOLD_DROPPED = prev.thresh;
    if (prev.window === undefined) delete process.env.DISCORD_ALERT_WINDOW_SECONDS;
    else process.env.DISCORD_ALERT_WINDOW_SECONDS = prev.window;
    if (prev.reminder === undefined) delete process.env.DISCORD_ALERT_REMINDER_MINUTES;
    else process.env.DISCORD_ALERT_REMINDER_MINUTES = prev.reminder;
  }

  // ── Test 8: every counter from Task #12 has a default rule ──
  {
    const requiredIds = new Set(["signature_failures", "replay_rejected", "unauthorised", "dropped"]);
    const presentIds = new Set(DEFAULT_RULES.map((r) => r.id));
    const missing = [...requiredIds].filter((id) => !presentIds.has(id));
    record(
      "default rules cover every Task #12 counter",
      missing.length === 0,
      `missing=${missing.join(",") || "(none)"}`,
    );
  }

  // ── Report ──
  let failed = 0;
  for (const r of results) {
    const tag = r.ok ? "PASS" : "FAIL";
    const detail = r.detail ? `  [${r.detail}]` : "";
    console.log(`${tag} ${r.name}${detail}`);
    if (!r.ok) failed++;
  }
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
