/**
 * GDPR retention purge — Exentax Web
 *
 * Hourly sweep that drops rows from the analytics / consent tables once
 * they exceed their documented retention period. The matrix lives here
 * so the auditor only has to read one file:
 *
 *   visits           → 180 days   (web analytics)
 *   consent_log      →  36 months (cookie / form consent audit trail)
 *   calculations     →  24 months (anonymous calculator usage)
 *   newsletter (unsub) → 12 months after the unsubscribe date
 *
 * Tables NOT touched here (regulatory hold):
 *   leads, agenda                    — AML/KYC, 7 years
 *   legal_document_versions          — immutable consent-version archive
 *
 * The whole sweep is best-effort: any one table failing is logged and
 * the others still run. Cadence is hourly with a startup grace period;
 * the Postgres `DELETE ... WHERE created_at < $cutoff` is index-friendly
 * (all four tables have a created-at index).
 */

import { logger } from "../logger";
import {
  purgeOldVisits,
  purgeOldConsentLog,
  purgeOldCalculations,
  purgeUnsubscribedNewsletter,
} from "../storage";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

const RETENTION = {
  visitsDays: 180,
  consentMonths: 36,
  calculationsMonths: 24,
  newsletterUnsubMonths: 12,
} as const;

const SWEEP_INTERVAL_MS = 6 * HOUR_MS;
const STARTUP_DELAY_MS = 5 * 60_000;

let _running = false;

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

export async function runRetentionPurge(): Promise<{
  visits: number;
  consent: number;
  calculations: number;
  newsletter: number;
}> {
  if (_running) return { visits: 0, consent: 0, calculations: 0, newsletter: 0 };
  _running = true;
  const result = { visits: 0, consent: 0, calculations: 0, newsletter: 0 };
  try {
    // Each block is independently try/catch'd so a transient failure on
    // one table never starves the others.
    try {
      result.visits = await purgeOldVisits(daysAgo(RETENTION.visitsDays));
    } catch (err) {
      logger.warn(`retention-purge visits failed: ${err instanceof Error ? err.message : String(err)}`, "retention");
    }
    try {
      result.consent = await purgeOldConsentLog(monthsAgo(RETENTION.consentMonths));
    } catch (err) {
      logger.warn(`retention-purge consent_log failed: ${err instanceof Error ? err.message : String(err)}`, "retention");
    }
    try {
      result.calculations = await purgeOldCalculations(monthsAgo(RETENTION.calculationsMonths));
    } catch (err) {
      logger.warn(`retention-purge calculations failed: ${err instanceof Error ? err.message : String(err)}`, "retention");
    }
    try {
      result.newsletter = await purgeUnsubscribedNewsletter(monthsAgo(RETENTION.newsletterUnsubMonths));
    } catch (err) {
      logger.warn(`retention-purge newsletter failed: ${err instanceof Error ? err.message : String(err)}`, "retention");
    }
    const total = result.visits + result.consent + result.calculations + result.newsletter;
    if (total > 0) {
      logger.info(
        `retention-purge swept: visits=${result.visits} consent=${result.consent} calc=${result.calculations} newsletter=${result.newsletter}`,
        "retention",
      );
    }
    return result;
  } finally {
    _running = false;
  }
}

export function startRetentionPurgeScheduler(): ReturnType<typeof setInterval> {
  // Skip the first immediate tick — wait STARTUP_DELAY_MS so the sweep
  // never collides with cold-start work (DB migrations, schedulers
  // catching up). After that, run every SWEEP_INTERVAL_MS.
  setTimeout(() => {
    void runRetentionPurge();
  }, STARTUP_DELAY_MS);
  return setInterval(() => {
    void runRetentionPurge();
  }, SWEEP_INTERVAL_MS);
}
