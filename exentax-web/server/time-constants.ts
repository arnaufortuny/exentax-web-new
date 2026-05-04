// Centralized time-in-milliseconds constants.
//
// Background: round 7 audit found `60 * 60 * 1000` literal repeated 22 times
// across 9 files (drip-worker, retention-purge, reconcile-zombies, retry
// queue, etc.), each declaring a local `HOUR_MS` / `ONE_HOUR_MS` /
// `ONE_DAY_MS`. The values were always identical, so DRY'ing them up does
// not change runtime behavior — it just gives `tsc` and `grep` a single
// place to find the canonical definition.
//
// Import from here (or use `@/server/time-constants`) instead of redeclaring
// per module. If a future requirement needs minute-level precision tweaks
// (e.g. an hour billing window != 60 min), update here.

export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;
export const ONE_WEEK_MS = 7 * ONE_DAY_MS;

// Common operation timeouts (named to make intent obvious at the call site).
export const HTTP_FETCH_TIMEOUT_MS = 5 * ONE_SECOND_MS;
export const DB_QUERY_TIMEOUT_MS = 30 * ONE_SECOND_MS;

// Lease windows used by background workers (drip outbox, retry queue,
// booking draft sweep). Centralised so all workers expire stale claims at
// the same cadence.
export const STALE_CLAIM_LEASE_MS = 10 * ONE_MINUTE_MS;
