/*
 * google-search-console.ts
 * ----------------------------------------------------------------------------
 * Programmatic submission of /sitemap.xml to Google via the Search Console
 * Sitemaps API.
 *
 * Why this module exists:
 *   Google deprecated its public `/ping?sitemap=` endpoint in June 2023. The
 *   only programmatic path Google still supports is the Search Console
 *   Sitemaps API:
 *     PUT https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}
 *   It requires an authenticated request with the
 *   `https://www.googleapis.com/auth/webmasters` scope. We reuse the same
 *   service-account JSON that already powers Gmail and Calendar
 *   (`GOOGLE_SERVICE_ACCOUNT_KEY`). The service-account email **must be added
 *   as an owner/full user on the Search Console property** for the call to
 *   succeed; otherwise Google returns 403 and we surface that in the audit
 *   report so the operator knows what to do.
 *
 * Configuration:
 *   - GOOGLE_SERVICE_ACCOUNT_KEY  — already used by email/calendar.
 *   - GOOGLE_SC_SITE_URL          — Search Console property identifier.
 *                                    Either a URL-prefix property
 *                                    (e.g. "https://exentax.com/") or a
 *                                    Domain property ("sc-domain:exentax.com").
 *                                    Defaults to "${SITE_URL}/" with a
 *                                    trailing slash.
 *   - GOOGLE_SC_DISABLE=1         — opt-out switch.
 *
 * Retry policy mirrors `sitemap-ping.ts` / `indexnow.ts`: 3 attempts with
 * 1s/2s/4s backoff, only on 429/5xx/transport errors.
 * ----------------------------------------------------------------------------
 */
import { google } from "googleapis";
import { getGoogleServiceAccountKey } from "./google-credentials.js";
import { logger } from "./logger";
import { SITE_URL } from "./server-constants";

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters";
const MAX_RETRIES = 3;

export type GoogleSitemapSubmitOutcome =
  | { status: "skipped"; reason: string; at: string }
  | { status: "ok"; httpStatus: number; siteUrl: string; sitemapUrl: string; at: string }
  | { status: "failed"; siteUrl: string; sitemapUrl: string; error: string; at: string };

function getSiteUrl(): string {
  const explicit = process.env.GOOGLE_SC_SITE_URL?.trim();
  if (explicit) return explicit;
  return SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;
}

function isRetriable(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

function statusFromError(err: unknown): number | null {
  const e = err as { code?: unknown; status?: unknown; response?: { status?: unknown } } | null;
  if (!e) return null;
  for (const v of [e.code, e.status, e.response?.status]) {
    if (typeof v === "number") return v;
    if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
  }
  return null;
}

/**
 * Submit a single sitemap URL to Google via the Search Console Sitemaps API.
 * Always non-blocking: never throws, returns a structured outcome instead.
 */
export async function submitSitemapToGoogle(sitemapUrl: string): Promise<GoogleSitemapSubmitOutcome> {
  const at = new Date().toISOString();

  if (process.env.GOOGLE_SC_DISABLE === "1") {
    return { status: "skipped", reason: "GOOGLE_SC_DISABLE=1", at };
  }

  const key = getGoogleServiceAccountKey();
  if (!key.private_key || !key.client_email) {
    return {
      status: "skipped",
      reason: "GOOGLE_SERVICE_ACCOUNT_KEY not set; cannot submit sitemap to Google Search Console",
      at,
    };
  }

  const siteUrl = getSiteUrl();
  let auth;
  try {
    auth = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: [GSC_SCOPE],
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`google-search-console: failed to build JWT: ${msg}`, "google-search-console");
    return { status: "failed", siteUrl, sitemapUrl, error: `JWT init: ${msg}`, at };
  }

  const webmasters = google.webmasters({ version: "v3", auth });

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await webmasters.sitemaps.submit({
        siteUrl,
        feedpath: sitemapUrl,
      });
      const httpStatus = typeof res.status === "number" ? res.status : 200;
      logger.info(
        `google-search-console: submitted ${sitemapUrl} to ${siteUrl} (HTTP ${httpStatus}${attempt > 1 ? `, attempt ${attempt}` : ""})`,
        "google-search-console",
      );
      return { status: "ok", httpStatus, siteUrl, sitemapUrl, at };
    } catch (err) {
      lastErr = err;
      const httpStatus = statusFromError(err);
      const msg = err instanceof Error ? err.message : String(err);

      // Permanent client-side failures (400/401/403/404) — don't retry.
      // 401/403 typically means the service account is not added as a user
      // on the Search Console property. Surface clearly so the operator can
      // fix the configuration.
      if (httpStatus !== null && !isRetriable(httpStatus)) {
        const hint =
          httpStatus === 401 || httpStatus === 403
            ? ` — make sure ${key.client_email} is added as an owner/full user on the "${siteUrl}" Search Console property`
            : "";
        const finalMsg = `HTTP ${httpStatus}: ${msg}${hint}`;
        logger.warn(`google-search-console: ${finalMsg}`, "google-search-console");
        return { status: "failed", siteUrl, sitemapUrl, error: finalMsg, at };
      }

      if (attempt === MAX_RETRIES) break;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `google-search-console: ${httpStatus ? `HTTP ${httpStatus}` : "transport error"} on attempt ${attempt}/${MAX_RETRIES} (${msg}), retrying in ${delay}ms`,
        "google-search-console",
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  const finalMsg = lastErr instanceof Error ? lastErr.message : String(lastErr ?? "unknown");
  logger.warn(
    `google-search-console: exhausted ${MAX_RETRIES} retries for ${sitemapUrl}: ${finalMsg}`,
    "google-search-console",
  );
  return { status: "failed", siteUrl, sitemapUrl, error: finalMsg, at };
}
