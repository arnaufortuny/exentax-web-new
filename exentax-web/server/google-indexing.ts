/*
 * google-indexing.ts
 * ----------------------------------------------------------------------------
 * Per-URL submission of new/updated blog articles to Google's Indexing API
 * (`https://indexing.googleapis.com/v3/urlNotifications:publish`). This is the
 * Google counterpart to the per-article IndexNow path that lives in
 * `indexnow.ts` and runs on the same trigger.
 *
 * Policy decision (documented here so the next person doesn't have to relitigate
 * it from scratch):
 *
 *   Google's Indexing API is officially restricted to JobPosting and
 *   BroadcastEvent content. Our blog posts are neither: they are tax /
 *   regulatory articles. Google still accepts and processes publish
 *   notifications for non-qualifying URLs in practice (this is the well-known
 *   "non-supported but tolerated" path many SEO setups rely on), but it is
 *   not contractually guaranteed and can be revoked at any time.
 *
 *   To avoid making unauthorized API calls by default, this module is
 *   **opt-in**: it does nothing unless `GOOGLE_INDEXING_API_ENABLE=1` is set.
 *   When enabled, it submits blog post URLs that are new or whose
 *   `updatedAt` has changed, exactly like `indexnow.ts`. Submissions are
 *   capped per run (`GOOGLE_INDEXING_MAX_PER_RUN`, default 50) to stay well
 *   under the default 200/day publish quota even on a first deploy after
 *   enabling.
 *
 * Configuration:
 *   - GOOGLE_SERVICE_ACCOUNT_KEY   — already used by Gmail / Calendar /
 *                                    Search Console. The service-account
 *                                    must be granted Indexing API access in
 *                                    the GCP project AND added as a verified
 *                                    site owner in Search Console.
 *   - GOOGLE_INDEXING_API_ENABLE=1 — opt-in switch.
 *   - GOOGLE_INDEXING_MAX_PER_RUN  — per-run submission cap (default 50).
 *
 * State:
 *   - data/google-indexing-pinged.json — per-URL last-submitted updatedAt
 *     plus the last outcome summary (consumed by `seo-indexing-audit.mjs`).
 *
 * Retry policy mirrors `indexnow.ts` and `google-search-console.ts`:
 * 3 attempts with 1s/2s/4s backoff, only on 429/5xx/transport errors.
 * 4xx (other than 429) are surfaced immediately so misconfiguration is loud.
 * ----------------------------------------------------------------------------
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve as pathResolve } from "path";
import { google } from "googleapis";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { logger } from "./logger";
import { SITE_URL } from "./server-constants";
import type { SupportedLang } from "./server-constants";
import { BLOG_POSTS } from "../client/src/data/blog-posts";
import { getTranslatedSlug } from "../client/src/data/blog-posts-slugs";
import { getAvailableLangsForSlugServer } from "./routes/public";

const GOOGLE_INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";
const GOOGLE_INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";
const STATE_FILE = pathResolve(
  process.cwd(),
  "data",
  "google-indexing-pinged.json",
);
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 8_000;
const DEFAULT_MAX_PER_RUN = 50;
// Google's default publish quota for the Indexing API is 200/day per project.
// We track a rolling 24h window of actual publish calls to avoid silently
// hitting 429s if the per-run cap is bumped or multiple deploys land in the
// same day. Configurable via GOOGLE_INDEXING_DAILY_QUOTA for projects with a
// raised quota.
const DEFAULT_DAILY_QUOTA = 200;
const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000;
// Flag a warning in the audit report when remaining quota drops to ≤10% of
// the daily limit (e.g. ≤20 calls left on the default 200/day quota).
const QUOTA_WARN_REMAINING_PCT = 0.10;

export type GoogleIndexingPerUrlOutcome =
  | { status: "ok"; httpStatus: number; at: string }
  | { status: "failed"; httpStatus: number | null; error: string; at: string };

export type GoogleIndexingQuotaSnapshot = {
  limit: number;
  used24h: number;
  remaining24h: number;
  warning: boolean;
  windowStart: string;
};

export type GoogleIndexingRunSummary = {
  at: string;
  status: "ok" | "skipped" | "failed";
  reason?: string;
  total: number;
  submitted: number;
  failed: number;
  capped?: boolean;
  pendingAfterCap?: number;
  quotaCapped?: boolean;
  quota?: GoogleIndexingQuotaSnapshot;
};

type StoredEntry = {
  updatedAt: string;
  lastSubmitAt?: string;
  lastStatus?: "ok" | "failed";
  lastHttpStatus?: number | null;
  lastError?: string;
};

type StoredState = {
  exists: boolean;
  entries: Record<string, StoredEntry>;
  last?: GoogleIndexingRunSummary;
  callTimestamps: string[];
};

function isEnabled(): boolean {
  return process.env.GOOGLE_INDEXING_API_ENABLE === "1";
}

function getMaxPerRun(): number {
  const raw = (process.env.GOOGLE_INDEXING_MAX_PER_RUN || "").trim();
  if (!raw) return DEFAULT_MAX_PER_RUN;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_PER_RUN;
  return n;
}

function getDailyQuota(): number {
  const raw = (process.env.GOOGLE_INDEXING_DAILY_QUOTA || "").trim();
  if (!raw) return DEFAULT_DAILY_QUOTA;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_DAILY_QUOTA;
  return n;
}

function pruneTimestamps(timestamps: string[], now: number): string[] {
  const cutoff = now - QUOTA_WINDOW_MS;
  const out: string[] = [];
  for (const ts of timestamps) {
    const t = Date.parse(ts);
    if (Number.isFinite(t) && t >= cutoff) out.push(ts);
  }
  return out;
}

function quotaSnapshot(timestamps: string[], now: number): GoogleIndexingQuotaSnapshot {
  const limit = getDailyQuota();
  const used = timestamps.length;
  const remaining = Math.max(0, limit - used);
  return {
    limit,
    used24h: used,
    remaining24h: remaining,
    warning: remaining <= Math.ceil(limit * QUOTA_WARN_REMAINING_PCT),
    windowStart: new Date(now - QUOTA_WINDOW_MS).toISOString(),
  };
}

function loadState(): StoredState {
  try {
    if (!existsSync(STATE_FILE)) return { exists: false, entries: {}, callTimestamps: [] };
    const raw = readFileSync(STATE_FILE, "utf8");
    const data = JSON.parse(raw);
    const entries: Record<string, StoredEntry> = {};
    if (data && typeof data.entries === "object" && data.entries) {
      for (const [k, v] of Object.entries(data.entries)) {
        if (typeof k !== "string" || !v || typeof v !== "object") continue;
        const e = v as Partial<StoredEntry>;
        if (typeof e.updatedAt === "string") {
          entries[k] = {
            updatedAt: e.updatedAt,
            lastSubmitAt: typeof e.lastSubmitAt === "string" ? e.lastSubmitAt : undefined,
            lastStatus: e.lastStatus === "ok" || e.lastStatus === "failed" ? e.lastStatus : undefined,
            lastHttpStatus: typeof e.lastHttpStatus === "number" ? e.lastHttpStatus : null,
            lastError: typeof e.lastError === "string" ? e.lastError : undefined,
          };
        }
      }
    }
    const callTimestamps = Array.isArray(data?.callTimestamps)
      ? data.callTimestamps.filter((t: unknown): t is string => typeof t === "string")
      : [];
    return { exists: true, entries, last: data.last, callTimestamps };
  } catch (err) {
    logger.warn(
      `google-indexing: could not read state file: ${err instanceof Error ? err.message : String(err)}`,
      "google-indexing",
    );
    return { exists: true, entries: {}, callTimestamps: [] };
  }
}

function saveState(
  entries: Record<string, StoredEntry>,
  last: GoogleIndexingRunSummary,
  callTimestamps: string[],
): void {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(
      STATE_FILE,
      JSON.stringify(
        { entries, last, callTimestamps, updatedAt: new Date().toISOString() },
        null,
        2,
      ),
    );
  } catch (err) {
    logger.warn(
      `google-indexing: could not write state file: ${err instanceof Error ? err.message : String(err)}`,
      "google-indexing",
    );
  }
}

function buildBlogUrls(): { url: string; updatedAt: string }[] {
  const result: { url: string; updatedAt: string }[] = [];
  for (const post of BLOG_POSTS) {
    const langs = getAvailableLangsForSlugServer(post.slug);
    for (const lang of langs) {
      const langSlug = getTranslatedSlug(post.slug, lang as SupportedLang);
      const locSlug = langSlug && langSlug !== post.slug ? langSlug : post.slug;
      const url = `${SITE_URL}/${lang}/blog/${locSlug}`;
      result.push({ url, updatedAt: post.updatedAt || post.publishedAt });
    }
  }
  return result;
}

function isRetriable(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

async function getAccessToken(): Promise<{ token: string; clientEmail: string } | null> {
  const key = getGoogleServiceAccountKey();
  if (!key.private_key || !key.client_email) return null;
  const jwt = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [GOOGLE_INDEXING_SCOPE],
  });
  const tokens = await jwt.authorize();
  if (!tokens.access_token) return null;
  return { token: tokens.access_token, clientEmail: key.client_email };
}

async function publishUrlUpdate(
  token: string,
  url: string,
  options?: {
    // Called once per HTTP attempt (including retries) with the attempt's
    // timestamp. Used by the caller to count actual publish calls against
    // the rolling 24h quota — Google bills the request, not the outcome,
    // so retried 429/5xx attempts also count.
    onAttempt?: (at: string) => void;
    // Maximum number of attempts allowed for this URL (defaults to
    // MAX_RETRIES). The caller may shrink this when the remaining 24h
    // quota would not cover a full retry budget.
    maxAttempts?: number;
  },
): Promise<GoogleIndexingPerUrlOutcome> {
  const maxAttempts = Math.max(1, Math.min(MAX_RETRIES, options?.maxAttempts ?? MAX_RETRIES));
  let lastErr: { httpStatus: number | null; error: string } | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const at = new Date().toISOString();
    options?.onAttempt?.(at);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(GOOGLE_INDEXING_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      if (res.status >= 200 && res.status < 300) {
        return { status: "ok", httpStatus: res.status, at };
      }

      const text = await res.text().catch(() => "");
      lastErr = { httpStatus: res.status, error: `HTTP ${res.status}: ${text.slice(0, 300)}` };

      if (!isRetriable(res.status)) {
        return { status: "failed", httpStatus: res.status, error: lastErr.error, at };
      }
      if (attempt === maxAttempts) {
        return { status: "failed", httpStatus: res.status, error: lastErr.error, at };
      }
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `google-indexing: HTTP ${res.status} on attempt ${attempt}/${maxAttempts} for ${url}, retrying in ${delay}ms`,
        "google-indexing",
      );
      await new Promise((r) => setTimeout(r, delay));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      lastErr = { httpStatus: null, error: msg };
      if (attempt === maxAttempts) {
        return { status: "failed", httpStatus: null, error: msg, at };
      }
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `google-indexing: transport error on attempt ${attempt}/${maxAttempts} for ${url} (${msg}), retrying in ${delay}ms`,
        "google-indexing",
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  const at = new Date().toISOString();
  return {
    status: "failed",
    httpStatus: lastErr?.httpStatus ?? null,
    error: lastErr?.error ?? "exhausted retries",
    at,
  };
}

/**
 * Per-URL submission of an explicit list of URLs to Google's Indexing API.
 * Mirrors the shape of `submitIndexNowForUrls` in `server/indexnow.ts` so that
 * one-off republish scripts can render a per-URL audit table for both
 * channels with identical formatting.
 *
 * Differences vs. `pingGoogleIndexingForNewArticles`:
 *   - Caller provides the URL list directly (no `updatedAt` dedup, no
 *     first-run seeding, no per-run cap based on freshness state).
 *   - Does NOT touch `data/google-indexing-pinged.json`. State ownership
 *     stays with the post-deploy ping path; mixing writes here would corrupt
 *     the rolling 24h quota counters used by the automatic ping.
 *   - Still honors `GOOGLE_INDEXING_API_ENABLE=1` as the kill switch and
 *     still requires a valid `GOOGLE_SERVICE_ACCOUNT_KEY`. When either is
 *     missing, every URL is returned as a "skipped" row carrying the same
 *     reason string, instead of throwing — same convention IndexNow uses
 *     when `INDEXNOW_KEY` is absent.
 *   - The 200/day daily quota is NOT pre-checked here (the script's batch
 *     size is bounded by the caller). Google's own 429 response is surfaced
 *     per URL via the standard retry/backoff in `publishUrlUpdate`.
 */
export type GoogleIndexingPerUrlResult = {
  url: string;
  ok: boolean;
  status: number | null;
  at: string;
  error?: string;
};

export async function submitGoogleIndexingForUrls(
  urls: string[],
): Promise<{
  enabled: boolean;
  hasKey: boolean;
  results: GoogleIndexingPerUrlResult[];
}> {
  if (!isEnabled()) {
    const at = new Date().toISOString();
    return {
      enabled: false,
      hasKey: false,
      results: urls.map((url) => ({
        url,
        ok: false,
        status: null,
        at,
        error: "GOOGLE_INDEXING_API_ENABLE not set to 1",
      })),
    };
  }

  let auth: { token: string; clientEmail: string } | null = null;
  try {
    auth = await getAccessToken();
  } catch (err) {
    const at = new Date().toISOString();
    const msg = err instanceof Error ? err.message : String(err);
    return {
      enabled: true,
      hasKey: false,
      results: urls.map((url) => ({
        url,
        ok: false,
        status: null,
        at,
        error: `auth failure: ${msg}`,
      })),
    };
  }
  if (!auth) {
    const at = new Date().toISOString();
    return {
      enabled: true,
      hasKey: false,
      results: urls.map((url) => ({
        url,
        ok: false,
        status: null,
        at,
        error: "GOOGLE_SERVICE_ACCOUNT_KEY not set or missing access token",
      })),
    };
  }

  const results: GoogleIndexingPerUrlResult[] = [];
  for (const url of urls) {
    const outcome = await publishUrlUpdate(auth.token, url);
    if (outcome.status === "ok") {
      results.push({ url, ok: true, status: outcome.httpStatus, at: outcome.at });
    } else {
      results.push({
        url,
        ok: false,
        status: outcome.httpStatus,
        at: outcome.at,
        error: outcome.error,
      });
    }
  }
  return { enabled: true, hasKey: true, results };
}

/**
 * Submit new/updated blog URLs to Google's Indexing API. Always non-blocking,
 * never throws. Returns the run summary so callers (and tests) can inspect it.
 */
export async function pingGoogleIndexingForNewArticles(): Promise<GoogleIndexingRunSummary> {
  const at = new Date().toISOString();

  if (!isEnabled()) {
    const summary: GoogleIndexingRunSummary = {
      at,
      status: "skipped",
      reason: "GOOGLE_INDEXING_API_ENABLE not set to 1",
      total: 0,
      submitted: 0,
      failed: 0,
    };
    logger.debug(
      "google-indexing: GOOGLE_INDEXING_API_ENABLE!=1 — skipping per-article submission (Indexing API is officially JobPosting/BroadcastEvent only)",
      "google-indexing",
    );
    return summary;
  }

  const all = buildBlogUrls();
  const state = loadState();
  const nowMs = Date.parse(at);
  let timestamps = pruneTimestamps(state.callTimestamps, nowMs);

  // First-ever run after enabling: seed state with current URLs without
  // submitting anything, so we don't blast every existing article at once.
  if (!state.exists) {
    const seed: Record<string, StoredEntry> = {};
    for (const u of all) seed[u.url] = { updatedAt: u.updatedAt };
    const summary: GoogleIndexingRunSummary = {
      at,
      status: "skipped",
      reason: `seeded state with ${all.length} existing URL(s); no submission on first run`,
      total: all.length,
      submitted: 0,
      failed: 0,
      quota: quotaSnapshot(timestamps, nowMs),
    };
    saveState(seed, summary, timestamps);
    logger.info(
      `google-indexing: seeded state with ${all.length} existing URL(s); no submission on first run`,
      "google-indexing",
    );
    return summary;
  }

  const fresh = all.filter((u) => {
    const prev = state.entries[u.url];
    return prev === undefined || prev.updatedAt !== u.updatedAt;
  });

  if (fresh.length === 0) {
    const summary: GoogleIndexingRunSummary = {
      at,
      status: "ok",
      total: 0,
      submitted: 0,
      failed: 0,
      quota: quotaSnapshot(timestamps, nowMs),
    };
    logger.debug("google-indexing: no new or updated articles to submit", "google-indexing");
    // Update only the `last` summary, keep entries as-is.
    saveState(state.entries, summary, timestamps);
    return summary;
  }

  let auth: { token: string; clientEmail: string } | null = null;
  try {
    auth = await getAccessToken();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const summary: GoogleIndexingRunSummary = {
      at,
      status: "failed",
      reason: `auth failure: ${msg}`,
      total: fresh.length,
      submitted: 0,
      failed: fresh.length,
      quota: quotaSnapshot(timestamps, nowMs),
    };
    logger.warn(`google-indexing: auth failure: ${msg}`, "google-indexing");
    saveState(state.entries, summary, timestamps);
    return summary;
  }
  if (!auth) {
    const summary: GoogleIndexingRunSummary = {
      at,
      status: "skipped",
      reason: "GOOGLE_SERVICE_ACCOUNT_KEY not set or missing access token",
      total: fresh.length,
      submitted: 0,
      failed: 0,
      quota: quotaSnapshot(timestamps, nowMs),
    };
    logger.warn(
      "google-indexing: GOOGLE_SERVICE_ACCOUNT_KEY missing or invalid — skipping submission",
      "google-indexing",
    );
    saveState(state.entries, summary, timestamps);
    return summary;
  }

  const dailyQuota = getDailyQuota();
  const startingRemaining = Math.max(0, dailyQuota - timestamps.length);
  const perRunCap = getMaxPerRun();
  // Conservative URL-level cap: assume each URL could burn the full retry
  // budget (worst case 1 + 2 retries = MAX_RETRIES HTTP calls). Bumping
  // GOOGLE_INDEXING_MAX_PER_RUN can therefore never silently push outbound
  // calls past the rolling 24h quota.
  const conservativeQuotaUrlCap = Math.floor(startingRemaining / MAX_RETRIES);
  const effectiveCap = Math.min(perRunCap, conservativeQuotaUrlCap);
  const slice = fresh.slice(0, effectiveCap);
  const capped = fresh.length > effectiveCap;
  const quotaCapped = conservativeQuotaUrlCap < perRunCap && fresh.length > conservativeQuotaUrlCap;

  if (quotaCapped) {
    logger.warn(
      `google-indexing: rolling 24h quota nearly exhausted (${timestamps.length}/${dailyQuota} used, ${startingRemaining} remaining); deferring ${fresh.length - effectiveCap} URL(s) to next run`,
      "google-indexing",
    );
  }

  const entries = { ...state.entries };
  let okCount = 0;
  let failCount = 0;
  let attemptsCount = 0;

  for (const u of slice) {
    const remainingNow = Math.max(0, dailyQuota - timestamps.length);
    if (remainingNow <= 0) {
      logger.warn(
        `google-indexing: daily quota exhausted mid-run (${timestamps.length}/${dailyQuota}); stopping`,
        "google-indexing",
      );
      break;
    }
    // Cap retries for this URL by what's left in the 24h window so a
    // 429/5xx storm cannot push us past the daily quota even mid-run.
    const maxAttempts = Math.min(MAX_RETRIES, remainingNow);
    const outcome = await publishUrlUpdate(auth.token, u.url, {
      onAttempt: (at) => {
        // Every HTTP attempt — success, retried 429/5xx, or transport
        // error — counts against the daily quota. Google bills the
        // request, not the outcome.
        timestamps.push(at);
        attemptsCount++;
      },
      maxAttempts,
    });
    const prev = entries[u.url] ?? { updatedAt: u.updatedAt };
    if (outcome.status === "ok") {
      okCount++;
      entries[u.url] = {
        updatedAt: u.updatedAt,
        lastSubmitAt: outcome.at,
        lastStatus: "ok",
        lastHttpStatus: outcome.httpStatus,
        lastError: undefined,
      };
    } else {
      failCount++;
      // For URLs we've never successfully submitted before, leave
      // `updatedAt` empty so the `fresh` filter still matches them on the
      // next run and they get retried. Only previously-known URLs preserve
      // their last-known updatedAt.
      const keepUpdatedAt = state.entries[u.url]?.updatedAt ?? "";
      entries[u.url] = {
        ...prev,
        updatedAt: keepUpdatedAt,
        lastSubmitAt: outcome.at,
        lastStatus: "failed",
        lastHttpStatus: outcome.httpStatus,
        lastError: outcome.error,
      };
      logger.warn(
        `google-indexing: failed to submit ${u.url}: ${outcome.error}`,
        "google-indexing",
      );
    }
  }

  // Re-prune in case the run straddled the 24h boundary, then snapshot.
  timestamps = pruneTimestamps(timestamps, Date.now());
  const quota = quotaSnapshot(timestamps, Date.now());

  const summary: GoogleIndexingRunSummary = {
    at,
    // Persisted run summary uses ok/failed only (existing schema). The
    // Discord notification below upgrades a partial-failure run to "skipped"
    // (warning/orange) so operators can spot it immediately.
    status: failCount === slice.length && slice.length > 0 ? "failed" : "ok",
    total: fresh.length,
    submitted: okCount,
    failed: failCount,
    capped,
    pendingAfterCap: capped ? fresh.length - effectiveCap : 0,
    quotaCapped: quotaCapped || undefined,
    quota,
  };

  logger.info(
    `google-indexing: submitted ${okCount}/${slice.length} URL(s) in ${attemptsCount} HTTP call(s) (failed=${failCount}${capped ? `, ${fresh.length - effectiveCap} deferred to next run` : ""}; quota ${quota.used24h}/${quota.limit} in last 24h${quota.warning ? " — WARN" : ""})`,
    "google-indexing",
  );

  saveState(entries, summary, timestamps);

  try {
    const { notifySeoIndexing } = await import("./discord");
    const notifyStatus: "ok" | "skipped" | "failed" =
      failCount > 0 && okCount === 0
        ? "failed"
        : failCount > 0 || quota.warning || quotaCapped
          ? "skipped"
          : "ok";
    const titleSuffix =
      notifyStatus === "failed"
        ? `fallo (${failCount}/${slice.length})`
        : failCount > 0
          ? `parcial (${okCount} OK / ${failCount} fallidas)`
          : `${okCount}/${slice.length} URL${slice.length === 1 ? "" : "s"} aceptadas`;
    const deferred = capped ? fresh.length - effectiveCap : 0;
    const summaryParts: string[] = [];
    if (deferred > 0) {
      summaryParts.push(
        quotaCapped
          ? `${deferred} URL(s) diferidas por cuota 24h (${quota.used24h}/${quota.limit}).`
          : `${deferred} URL(s) diferidas a la próxima ejecución (cap=${perRunCap}).`,
      );
    }
    if (quota.warning && !quotaCapped) {
      summaryParts.push(`Cuota Google Indexing al límite: ${quota.used24h}/${quota.limit} en 24h.`);
    }
    notifySeoIndexing({
      source: "google-indexing",
      status: notifyStatus,
      title: `Google Indexing — ${titleSuffix}`,
      summary: summaryParts.length ? summaryParts.join(" ") : null,
      fields: [
        { name: "OK", value: String(okCount) },
        { name: "Failed", value: String(failCount) },
        { name: "Frescas", value: String(fresh.length) },
        ...(deferred > 0 ? [{ name: "Diferidas", value: String(deferred) }] : []),
        { name: "Cuota 24h", value: `${quota.used24h}/${quota.limit}${quota.warning ? " ⚠" : ""}` },
      ],
      dedupKey: `google-indexing:run:${at.slice(0, 16)}:${okCount}:${failCount}`,
    });
  } catch {
    // never break the run on notification failure
  }


  return summary;
}
