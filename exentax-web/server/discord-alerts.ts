/**
 * In-process alert evaluator for Discord interaction telemetry (Task #32).
 *
 * Task #12 wired Prometheus counters for:
 *   - `discord_signature_failures_total{reason}` (sum of all reasons)
 *   - `discord_replay_rejected_total`
 *   - `discord_unauthorised_total`
 *   - `discord_dropped_total`
 *
 * No external Alertmanager exists. This module closes the loop with a
 * dependency-free rule engine that:
 *
 *   1. Polls `metrics.snapshot()` on a fixed cadence (default 60 s).
 *   2. Maintains a per-rule rolling baseline so the *rate* (events / minute)
 *      is compared to a configurable threshold over a sliding window.
 *   3. Emits a single `system_error` notification (`#exentax-errores`) the
 *      first minute the threshold is crossed.
 *   4. Suppresses duplicates while the rule stays above threshold; emits a
 *      "still firing" reminder every `reminderMs` (default 30 min) so a
 *      sustained incident is one message + periodic pings, not a flood.
 *   5. Emits a single "resolved" notice the minute the rate falls back
 *      below the threshold.
 *
 * Thresholds are documented in `docs/deploy/DISCORD-SETUP.md` §11 and may
 * be overridden per-deploy via env vars (`DISCORD_ALERT_THRESHOLD_*`).
 *
 * The module is purposely self-contained: no DB, no timers besides the
 * single `setInterval` exposed by `startDiscordAlertWorker`. This keeps it
 * trivial to unit-test deterministically (`AlertEvaluator` accepts an
 * injectable `now()` and `notify()` so tests run without real time or a
 * live Discord channel).
 */

import { snapshot, type MetricsSnapshot } from "./metrics";
import { notifyEvent, EVENT_TYPES, type Criticality } from "./discord";
import { logger } from "./logger";

// ─── Rule definitions ────────────────────────────────────────────────────────

/**
 * Static description of one rule. The `read` callback turns a metrics
 * snapshot into a single cumulative counter value; the evaluator computes
 * the per-minute *rate* from successive samples.
 */
export interface AlertRule {
  /** Stable, lowercase identifier — used as dedup key suffix and env var. */
  id: string;
  /** Human-readable label for the embed title. */
  label: string;
  /** Underlying Prometheus metric name (shown in the embed). */
  metricName: string;
  /** Short explanation rendered as the embed description. */
  description: string;
  /** Default events-per-minute threshold above which the rule fires. */
  threshold: number;
  /** Reads the cumulative counter value out of a metrics snapshot. */
  read: (snap: MetricsSnapshot) => number;
}

/**
 * Default rule set. Every counter mentioned in Task #32 is covered. The
 * thresholds were chosen to balance noise vs. signal:
 *   - signature failures: 10/min — sustained spoof / misconfigured client.
 *   - replay rejections: 5/min — ±5 min window means real traffic should
 *     never trip this; >0 sustained signals NTP drift or replay attack.
 *   - unauthorised: 10/min — accidental clicks happen; sustained bursts
 *     mean someone is fuzzing the slash commands or the role config drifted.
 *   - dropped: 1/min — *any* drop is a lost notification; alert immediately.
 */
export const DEFAULT_RULES: AlertRule[] = [
  {
    id: "signature_failures",
    label: "Discord signature failures",
    metricName: "discord_signature_failures_total",
    description:
      "Inbound `/api/discord/interactions` requests failing Ed25519 signature " +
      "verification. Sustained spikes mean a misconfigured client or a spoof " +
      "attempt — see DISCORD-SETUP.md §11.",
    threshold: 10,
    read: (s) => Object.values(s.discord.signatureFailures).reduce((a, b) => a + b, 0),
  },
  {
    id: "replay_rejected",
    label: "Discord replay rejections",
    metricName: "discord_replay_rejected_total",
    description:
      "Inbound interactions rejected by the ±5 min anti-replay window. " +
      "Real Discord traffic should never trip this — investigate host clock " +
      "drift (NTP) or a replay attack.",
    threshold: 5,
    read: (s) => s.discord.replayRejectedTotal,
  },
  {
    id: "unauthorised",
    label: "Discord unauthorised attempts",
    metricName: "discord_unauthorised_total",
    description:
      "Slash commands invoked by Discord users that lack the admin role. " +
      "Sustained bursts mean the role config drifted or someone is fuzzing " +
      "the bot — cross-check `agenda_admin_actions` for `unauthorized:*` rows.",
    threshold: 10,
    read: (s) => s.discord.unauthorisedTotal,
  },
  {
    id: "dropped",
    label: "Discord queue drops",
    metricName: "discord_dropped_total",
    description:
      "Outbound notifications dropped from the in-memory queue (queue full / " +
      "circuit breaker open). Each drop is a lost embed — investigate " +
      "`circuit_breaker_state{name=\"discord-rest\"}` and Discord status.",
    threshold: 1,
    read: (s) => s.discord.droppedTotal,
  },
];

// ─── Configuration ───────────────────────────────────────────────────────────

export interface AlertConfig {
  /** Sliding window over which the rate is computed, in seconds. */
  windowSeconds: number;
  /** Min interval between "still firing" reminders, in milliseconds. */
  reminderMs: number;
  /** Per-rule threshold (events per minute), keyed by rule id. */
  thresholds: Record<string, number>;
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Resolve config from env. Each rule supports an env override of the form
 * `DISCORD_ALERT_THRESHOLD_<RULE_ID_UPPER>`. Two global knobs control the
 * timing (`DISCORD_ALERT_WINDOW_SECONDS`, `DISCORD_ALERT_REMINDER_MINUTES`).
 * Unset / non-positive values fall back to the defaults so a partially
 * configured deploy is always safe (alerts on, reasonable thresholds).
 */
export function loadAlertConfig(rules: AlertRule[] = DEFAULT_RULES): AlertConfig {
  const thresholds: Record<string, number> = {};
  for (const r of rules) {
    thresholds[r.id] = envInt(
      `DISCORD_ALERT_THRESHOLD_${r.id.toUpperCase()}`,
      r.threshold,
    );
  }
  return {
    windowSeconds: envInt("DISCORD_ALERT_WINDOW_SECONDS", 60),
    reminderMs: envInt("DISCORD_ALERT_REMINDER_MINUTES", 30) * 60_000,
    thresholds,
  };
}

// ─── Notification envelope ───────────────────────────────────────────────────

export type AlertState = "firing" | "still_firing" | "resolved";

export interface AlertNotification {
  ruleId: string;
  ruleLabel: string;
  metricName: string;
  state: AlertState;
  ratePerMin: number;
  threshold: number;
  windowSeconds: number;
  firstFiredAt: number;
  description: string;
}

// ─── Evaluator (deterministic, side-effect-free state machine) ───────────────

interface RuleState {
  /** Cumulative counter value at the start of the current window. */
  baselineValue: number;
  /** Wall-clock timestamp at the start of the current window. */
  baselineAt: number;
  /** Whether the rule is currently above its threshold. */
  firing: boolean;
  /** First time the rule transitioned to firing in the active incident. */
  firstFiredAt: number | null;
  /** Last time we emitted a notification for this rule. */
  lastNotifiedAt: number | null;
  /** Last computed rate (debug / test convenience). */
  lastRatePerMin: number;
}

export interface RuleEvaluation {
  ruleId: string;
  ratePerMin: number;
  threshold: number;
  status: "ok" | "firing" | "still_firing" | "resolved" | "warming";
  notified: boolean;
  reason: string;
}

export interface EvaluatorOptions {
  rules: AlertRule[];
  config: AlertConfig;
  notify: (notif: AlertNotification) => void;
  now: () => number;
}

/**
 * Stateful evaluator. Hold one instance per process. `evaluate(snap)` is
 * idempotent w.r.t. side effects: it only calls `notify()` on state
 * transitions or when the reminder interval has elapsed.
 */
export class AlertEvaluator {
  private states = new Map<string, RuleState>();

  constructor(private opts: EvaluatorOptions) {}

  /** Reset all internal state — primarily for tests. */
  reset(): void {
    this.states.clear();
  }

  /**
   * Return the live state for a rule (read-only, intended for tests / a
   * future debug endpoint). Returns `undefined` before the first sample.
   */
  getState(ruleId: string): Readonly<RuleState> | undefined {
    return this.states.get(ruleId);
  }

  evaluate(snap: MetricsSnapshot): RuleEvaluation[] {
    const results: RuleEvaluation[] = [];
    const now = this.opts.now();

    for (const rule of this.opts.rules) {
      const value = Math.max(0, rule.read(snap));
      const threshold = this.opts.config.thresholds[rule.id] ?? rule.threshold;

      let state = this.states.get(rule.id);
      if (!state) {
        // First sample: store as baseline only — we have nothing to
        // compute a rate against yet. This avoids a bogus "firing" if
        // the process is restarted while counters are already non-zero.
        state = {
          baselineValue: value,
          baselineAt: now,
          firing: false,
          firstFiredAt: null,
          lastNotifiedAt: null,
          lastRatePerMin: 0,
        };
        this.states.set(rule.id, state);
        results.push({
          ruleId: rule.id,
          ratePerMin: 0,
          threshold,
          status: "warming",
          notified: false,
          reason: "first sample (warming up)",
        });
        continue;
      }

      const elapsedSec = Math.max(1, (now - state.baselineAt) / 1000);
      const delta = Math.max(0, value - state.baselineValue);
      const ratePerMin = (delta / elapsedSec) * 60;
      state.lastRatePerMin = ratePerMin;

      let status: RuleEvaluation["status"];
      let notified = false;
      let reason: string;
      const fired = ratePerMin >= threshold;

      if (fired) {
        if (!state.firing) {
          // Transition: ok → firing
          state.firing = true;
          state.firstFiredAt = now;
          state.lastNotifiedAt = now;
          status = "firing";
          notified = true;
          reason = "rate >= threshold (first crossing)";
          this.opts.notify({
            ruleId: rule.id,
            ruleLabel: rule.label,
            metricName: rule.metricName,
            state: "firing",
            ratePerMin,
            threshold,
            windowSeconds: this.opts.config.windowSeconds,
            firstFiredAt: state.firstFiredAt,
            description: rule.description,
          });
        } else if (
          state.lastNotifiedAt != null &&
          now - state.lastNotifiedAt >= this.opts.config.reminderMs
        ) {
          // Sustained incident: emit one "still firing" reminder.
          state.lastNotifiedAt = now;
          status = "still_firing";
          notified = true;
          reason = "still firing reminder";
          this.opts.notify({
            ruleId: rule.id,
            ruleLabel: rule.label,
            metricName: rule.metricName,
            state: "still_firing",
            ratePerMin,
            threshold,
            windowSeconds: this.opts.config.windowSeconds,
            firstFiredAt: state.firstFiredAt!,
            description: rule.description,
          });
        } else {
          status = "firing";
          reason = "already firing (throttled)";
        }
      } else if (state.firing) {
        // Transition: firing → resolved
        const firedAt = state.firstFiredAt ?? now;
        state.firing = false;
        state.firstFiredAt = null;
        state.lastNotifiedAt = null;
        status = "resolved";
        notified = true;
        reason = "rate dropped below threshold";
        this.opts.notify({
          ruleId: rule.id,
          ruleLabel: rule.label,
          metricName: rule.metricName,
          state: "resolved",
          ratePerMin,
          threshold,
          windowSeconds: this.opts.config.windowSeconds,
          firstFiredAt: firedAt,
          description: rule.description,
        });
      } else {
        status = "ok";
        reason = "below threshold";
      }

      // Roll the baseline forward once the window has elapsed so the rate
      // tracks recent traffic instead of integrating since process start.
      if ((now - state.baselineAt) / 1000 >= this.opts.config.windowSeconds) {
        state.baselineValue = value;
        state.baselineAt = now;
      }

      results.push({
        ruleId: rule.id,
        ratePerMin,
        threshold,
        status,
        notified,
        reason,
      });
    }

    return results;
  }
}

// ─── Worker (production wiring) ──────────────────────────────────────────────

/**
 * Map an `AlertNotification` onto the existing `notifyEvent` envelope so
 * it lands in `#exentax-errores` alongside every other system error.
 *
 * Dedup key strategy: `notifyEvent` already has a 5-minute in-memory dedup
 * window keyed off `dedupKey`. We make the key carry the *state* and a
 * minute bucket so:
 *   - Two evaluator ticks within the same minute reporting the same state
 *     for the same rule are deduped (defensive against future config
 *     mistakes that might call the worker more often than once per minute).
 *   - A genuine state transition (`firing` → `resolved`, or a `still_firing`
 *     reminder 30 min later) is NOT deduped because either the state or
 *     the minute bucket changes.
 */
function deliverAlert(n: AlertNotification): void {
  const verb =
    n.state === "firing" ? "FIRING"
    : n.state === "still_firing" ? "STILL FIRING"
    : "RESOLVED";
  const criticality: Criticality = n.state === "resolved" ? "info" : "error";
  const minuteBucket = Math.floor(Date.now() / 60_000);

  notifyEvent({
    type: EVENT_TYPES.SYSTEM_ERROR,
    criticality,
    title: `${n.ruleLabel} — ${verb}`,
    description: n.description,
    origin: "discord-alerts",
    fields: [
      { name: "Metric", value: `\`${n.metricName}\``, inline: true },
      { name: "Rate", value: `${n.ratePerMin.toFixed(2)}/min`, inline: true },
      { name: "Threshold", value: `${n.threshold}/min`, inline: true },
      { name: "Window", value: `${n.windowSeconds}s`, inline: true },
      { name: "Firing since", value: new Date(n.firstFiredAt).toISOString(), inline: true },
      { name: "State", value: verb, inline: true },
    ],
    dedupKey: `discord_alert:${n.ruleId}:${n.state}:${minuteBucket}`,
  });
}

/**
 * Start the recurring alert evaluator. Returns the underlying interval
 * handle so `server/index.ts` can register it for graceful shutdown
 * alongside the other workers.
 */
export function startDiscordAlertWorker(
  intervalMs = 60_000,
): ReturnType<typeof setInterval> {
  const config = loadAlertConfig();
  const evaluator = new AlertEvaluator({
    rules: DEFAULT_RULES,
    config,
    now: Date.now,
    notify: deliverAlert,
  });

  logger.info(
    `[discord-alerts] enabled window=${config.windowSeconds}s reminder=${config.reminderMs / 60_000}min thresholds=${JSON.stringify(config.thresholds)}`,
    "discord-alerts",
  );

  const tick = () => {
    try {
      evaluator.evaluate(snapshot());
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn(`[discord-alerts] evaluate failed: ${msg}`, "discord-alerts");
    }
  };

  return setInterval(tick, intervalMs);
}
