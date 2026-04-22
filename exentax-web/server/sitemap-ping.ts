/*
 * sitemap-ping.ts
 * ----------------------------------------------------------------------------
 * Detects real changes in the sitemap (sitemap-index + child sitemaps) between
 * deploys / process restarts and, only when something actually changed, asks
 * the search engines that still accept programmatic sitemap pings to recrawl.
 *
 * State of sitemap-ping endpoints in 2026 (documented here so the next person
 * doesn't re-add a deprecated endpoint):
 *
 *   - Google:  the public `https://www.google.com/ping?sitemap=...` endpoint
 *              was deprecated in June 2023 and now returns 404. The only
 *              programmatic path Google still supports is the Search Console
 *              Sitemaps API, which requires OAuth credentials. We submit
 *              `/sitemap.xml` via `server/google-search-console.ts` whenever
 *              `GOOGLE_SERVICE_ACCOUNT_KEY` is configured and the
 *              service-account email is added as an owner/full user on the
 *              Search Console property (`GOOGLE_SC_SITE_URL`).
 *
 *   - Bing:    the legacy `www.bing.com/ping?sitemap=...` endpoint was
 *              deprecated in May 2022 in favour of IndexNow. Bing now ingests
 *              IndexNow submissions for both individual URLs and sitemap URLs.
 *
 *   - IndexNow (Bing/Yandex/Seznam/...): the modern path. Accepts a list of
 *              URLs, including sitemap URLs themselves, and is what we use.
 *              Article-level IndexNow pings live in `indexnow.ts` and are
 *              orthogonal to this sitemap-level ping.
 *
 * What this module does:
 *   1. Fetches `sitemap.xml` + the three child sitemaps from the local server
 *      and computes a combined sha256 hash.
 *   2. Compares the hash with the previously-pinged hash stored in
 *      `data/sitemap-ping-state.json`.
 *   3. If the hash changed (or the state file does not exist yet), submits
 *      the sitemap URLs to IndexNow with simple exponential-backoff retries
 *      on transient errors (5xx / network).
 *   4. Persists the new hash + outcome and notifies Discord via
 *      `notifySeoIndexing()` (channel `errores`) so operators see every
 *      change without an admin dashboard. The on-disk state file is also
 *      read directly by `scripts/seo-indexing-audit.mjs`.
 *   5. Never throws and never blocks the deploy: every failure is logged and
 *      swallowed.
 * ----------------------------------------------------------------------------
 */
import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve as pathResolve } from "path";
import {
  submitSitemapToGoogle,
  type GoogleSitemapSubmitOutcome,
} from "./google-search-console";
import { logger } from "./logger";
import { notifySeoIndexing } from "./discord";
import { SITE_URL } from "./server-constants";

const STATE_FILE = pathResolve(process.cwd(), "data", "sitemap-ping-state.json");
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const SITEMAP_PATHS = [
  "/sitemap.xml",
  "/sitemap-pages.xml",
  "/sitemap-blog.xml",
  "/sitemap-faq.xml",
];
const FETCH_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 3;

const HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "exentax.com";
  }
})();

export type SitemapPingOutcome =
  | { status: "skipped"; reason: string; at: string; google?: GoogleSitemapSubmitOutcome }
  | { status: "unchanged"; hash: string; at: string; google?: GoogleSitemapSubmitOutcome }
  | { status: "ok"; hash: string; httpStatus: number; submitted: string[]; at: string; google?: GoogleSitemapSubmitOutcome }
  | { status: "failed"; hash: string; error: string; at: string; google?: GoogleSitemapSubmitOutcome };

type StoredState = {
  hash?: string;
  last?: SitemapPingOutcome;
  history?: SitemapPingOutcome[];
};

const MAX_HISTORY = 20;

// Note: the previous `getLastSitemapPingResult()` / `getSitemapPingHistory()`
// exports were removed when the admin sitemap-ping panel was retired in favour
// of Discord bot notifications (`notifySeoIndexing` in ./discord). State
// is still persisted to `data/sitemap-ping-state.json` so the
// `scripts/seo-indexing-audit.mjs` report can read it directly off disk.
let lastResult: SitemapPingOutcome | null = null;
let historyCache: SitemapPingOutcome[] | null = null;

function appendHistory(state: StoredState, outcome: SitemapPingOutcome): SitemapPingOutcome[] {
  const prev = Array.isArray(state.history) ? state.history : [];
  const next = [outcome, ...prev].slice(0, MAX_HISTORY);
  return next;
}

function loadState(): StoredState {
  try {
    if (!existsSync(STATE_FILE)) return {};
    return JSON.parse(readFileSync(STATE_FILE, "utf8")) as StoredState;
  } catch (err) {
    logger.warn(
      `sitemap-ping: could not read state file: ${err instanceof Error ? err.message : String(err)}`,
      "sitemap-ping",
    );
    return {};
  }
}

function saveState(state: StoredState): void {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    logger.warn(
      `sitemap-ping: could not write state file: ${err instanceof Error ? err.message : String(err)}`,
      "sitemap-ping",
    );
  }
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAllSitemaps(localBase: string): Promise<string> {
  const parts: string[] = [];
  for (const path of SITEMAP_PATHS) {
    const res = await fetchWithTimeout(`${localBase}${path}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching ${path}`);
    }
    parts.push(await res.text());
  }
  return parts.join("\n---\n");
}

function getIndexNowKey(): string | null {
  const raw = (process.env.INDEXNOW_KEY || "").trim();
  if (!raw) return null;
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(raw)) return null;
  return raw;
}

function isRetriable(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

async function submitToIndexNow(key: string, urls: string[]): Promise<number> {
  const body = {
    host: HOST,
    key,
    keyLocation:
      process.env.INDEXNOW_KEY_LOCATION?.trim() || `${SITE_URL}/${key}.txt`,
    urlList: urls,
  };

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    let nonRetriable = false;
    try {
      const res = await fetchWithTimeout(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      if (res.status === 200 || res.status === 202) {
        if (attempt > 1) {
          logger.info(
            `sitemap-ping: IndexNow accepted on attempt ${attempt}/${MAX_RETRIES}`,
            "sitemap-ping",
          );
        }
        return res.status;
      }
      const text = await res.text().catch(() => "");
      const err = new Error(`IndexNow HTTP ${res.status}: ${text.slice(0, 200)}`);
      lastErr = err;
      if (!isRetriable(res.status)) {
        // Permanent client-side failure (e.g. 400/403/422) — surface
        // immediately and do not retry.
        nonRetriable = true;
        throw err;
      }
      if (attempt === MAX_RETRIES) throw err;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `sitemap-ping: IndexNow HTTP ${res.status} on attempt ${attempt}/${MAX_RETRIES}, retrying in ${delay}ms`,
        "sitemap-ping",
      );
      await new Promise((r) => setTimeout(r, delay));
    } catch (err) {
      lastErr = err;
      // Non-retriable HTTP error: rethrow without consuming further attempts.
      if (nonRetriable) throw err;
      // Network/transport errors are retriable.
      if (attempt === MAX_RETRIES) throw err;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `sitemap-ping: IndexNow transport error on attempt ${attempt}/${MAX_RETRIES} (${err instanceof Error ? err.message : String(err)}), retrying in ${delay}ms`,
        "sitemap-ping",
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr ?? new Error("sitemap-ping: exhausted retries");
}

/**
 * Compare current sitemap hash with last-pinged hash and, if changed, submit
 * the sitemap URLs to IndexNow. Always non-blocking, never throws.
 */
export async function pingSitemapIfChanged(localBase: string): Promise<SitemapPingOutcome> {
  const at = new Date().toISOString();
  let outcome: SitemapPingOutcome;
  try {
    const combined = await fetchAllSitemaps(localBase);
    const hash = createHash("sha256").update(combined).digest("hex");
    const state = loadState();

    if (state.hash === hash) {
      outcome = { status: "unchanged", hash, at };
      logger.info(
        `sitemap-ping: sitemap unchanged since last ping (hash=${hash.slice(0, 12)}…)`,
        "sitemap-ping",
      );
      const history = appendHistory(state, outcome);
      saveState({ hash, last: outcome, history });
      lastResult = outcome;
      historyCache = history;
      // No notification on "unchanged" — would be noise on every restart.
      return outcome;
    }

    const sitemapIndexUrl = `${SITE_URL}/sitemap.xml`;
    const key = getIndexNowKey();

    // Submit to Google Search Console and IndexNow in parallel. Both are
    // independently non-blocking; persistence of the new hash requires at
    // least one of them to succeed so that an outright misconfiguration
    // doesn't silently mark the change as "done".
    const [googleOutcome, indexNowResult] = await Promise.all([
      submitSitemapToGoogle(sitemapIndexUrl),
      key
        ? submitToIndexNow(key, SITEMAP_PATHS.map((p) => `${SITE_URL}${p}`))
            .then((httpStatus) => ({ ok: true as const, httpStatus }))
            .catch((err: unknown) => ({
              ok: false as const,
              error: err instanceof Error ? err.message : String(err),
            }))
        : Promise.resolve({ ok: false as const, error: "INDEXNOW_KEY not set" }),
    ]);

    const urls = SITEMAP_PATHS.map((p) => `${SITE_URL}${p}`);

    if (indexNowResult.ok) {
      outcome = {
        status: "ok",
        hash,
        httpStatus: indexNowResult.httpStatus,
        submitted: urls,
        at,
        google: googleOutcome,
      };
      logger.info(
        `sitemap-ping: submitted ${urls.length} sitemap URL(s) to IndexNow (HTTP ${indexNowResult.httpStatus}, hash=${hash.slice(0, 12)}…); Google Search Console: ${googleOutcome.status}.`,
        "sitemap-ping",
      );
      const history = appendHistory(state, outcome);
      saveState({ hash, last: outcome, history });
      lastResult = outcome;
      historyCache = history;
      notifySeoIndexing({
        source: "sitemap-ping",
        status: "ok",
        title: "Sitemap ping — OK",
        summary: `Sitemap actualizado (${urls.length} URL${urls.length === 1 ? "" : "s"}).`,
        fields: [
          { name: "IndexNow", value: `HTTP ${indexNowResult.httpStatus}` },
          { name: "Google SC", value: googleOutcome.status },
          { name: "Hash", value: hash.slice(0, 12) + "…" },
          { name: "URLs", value: String(urls.length) },
        ],
        dedupKey: `sitemap-ping:ok:${hash}`,
      });
      return outcome;
    }

    // IndexNow failed (either missing key or submission error). Decide
    // whether to persist based on whether Google succeeded.
    if (!key) {
      outcome = {
        status: "skipped",
        reason: "INDEXNOW_KEY not set; cannot submit sitemap to IndexNow",
        at,
        google: googleOutcome,
      };
      logger.warn(
        `sitemap-ping: sitemap changed but INDEXNOW_KEY is not configured — IndexNow skipped; Google Search Console: ${googleOutcome.status}`,
        "sitemap-ping",
      );
    } else {
      outcome = {
        status: "failed",
        hash,
        error: indexNowResult.error,
        at,
        google: googleOutcome,
      };
      logger.warn(
        `sitemap-ping: IndexNow submission failed: ${indexNowResult.error}; Google Search Console: ${googleOutcome.status}`,
        "sitemap-ping",
      );
    }

    // Persist the new hash only if at least one engine accepted the change,
    // so a fully-failed cycle is retried on the next start-up.
    const persistHash = googleOutcome.status === "ok" ? hash : state.hash;
    const history = appendHistory(state, outcome);
    saveState({ hash: persistHash, last: outcome, history });
    lastResult = outcome;
    historyCache = history;
    notifySeoIndexing({
      source: "sitemap-ping",
      status: outcome.status === "skipped" ? "skipped" : "failed",
      title: outcome.status === "skipped" ? "Sitemap ping — omitido" : "Sitemap ping — fallo",
      summary: outcome.status === "skipped" ? outcome.reason : outcome.error,
      fields: [
        { name: "Google SC", value: googleOutcome.status },
        ...(googleOutcome.status === "failed" && "error" in googleOutcome ? [{ name: "Google error", value: String(googleOutcome.error).slice(0, 300), inline: false }] : []),
        { name: "Hash", value: hash.slice(0, 12) + "…" },
      ],
      dedupKey: `sitemap-ping:${outcome.status}:${hash || "no-hash"}`,
    });
    return outcome;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    outcome = { status: "failed", hash: "", error: msg, at };
    logger.warn(`sitemap-ping: unexpected error: ${msg}`, "sitemap-ping");
    try {
      const state = loadState();
      const history = appendHistory(state, outcome);
      saveState({ hash: state.hash, last: outcome, history });
      historyCache = history;
    } catch {
      // best effort
    }
    lastResult = outcome;
    notifySeoIndexing({
      source: "sitemap-ping",
      status: "failed",
      title: "Sitemap ping — error inesperado",
      summary: msg.slice(0, 1000),
      dedupKey: `sitemap-ping:exception:${msg.slice(0, 80)}`,
    });
    return outcome;
  }
}
