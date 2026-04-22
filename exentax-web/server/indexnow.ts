import type { Express } from "express";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve as pathResolve } from "path";
import { fileURLToPath } from "url";

const __filename_indexnow = fileURLToPath(import.meta.url);
const __dirname_indexnow = dirname(__filename_indexnow);
import { logger } from "./logger";
import { SITE_URL } from "./server-constants";
import type { SupportedLang } from "./server-constants";
import { BLOG_POSTS } from "../client/src/data/blog-posts";
import { getTranslatedSlug } from "../client/src/data/blog-posts-slugs";
import { getAvailableLangsForSlugServer } from "./routes/public";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const STATE_FILE = pathResolve(process.cwd(), "data", "indexnow-pinged.json");
const HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "exentax.com";
  }
})();

function getKey(): string | null {
  const raw = (process.env.INDEXNOW_KEY || "").trim();
  if (!raw) return null;
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(raw)) {
    logger.warn(
      "INDEXNOW_KEY is set but does not match the IndexNow format (8-128 chars, [a-zA-Z0-9-]). Ignoring.",
      "indexnow",
    );
    return null;
  }
  return raw;
}

function getKeyLocation(key: string): string {
  return process.env.INDEXNOW_KEY_LOCATION?.trim() || `${SITE_URL}/${key}.txt`;
}

type PingedState = { exists: boolean; entries: Record<string, string> };

function loadPinged(): PingedState {
  try {
    if (!existsSync(STATE_FILE)) return { exists: false, entries: {} };
    const raw = readFileSync(STATE_FILE, "utf8");
    const data = JSON.parse(raw);
    const entries: Record<string, string> = {};
    if (data && typeof data.entries === "object" && data.entries) {
      for (const [k, v] of Object.entries(data.entries)) {
        if (typeof k === "string" && typeof v === "string") entries[k] = v;
      }
    } else if (Array.isArray(data?.urls)) {
      for (const u of data.urls) if (typeof u === "string") entries[u] = "";
    }
    return { exists: true, entries };
  } catch (err) {
    logger.warn(`IndexNow: could not read state file: ${err instanceof Error ? err.message : String(err)}`, "indexnow");
  }
  return { exists: true, entries: {} };
}

function savePinged(entries: Record<string, string>): void {
  try {
    mkdirSync(dirname(STATE_FILE), { recursive: true });
    writeFileSync(STATE_FILE, JSON.stringify({ entries, updatedAt: new Date().toISOString() }, null, 2));
  } catch (err) {
    logger.warn(`IndexNow: could not write state file: ${err instanceof Error ? err.message : String(err)}`, "indexnow");
  }
}

function buildBlogUrls(): { url: string; publishedAt: string; updatedAt: string }[] {
  const result: { url: string; publishedAt: string; updatedAt: string }[] = [];
  for (const post of BLOG_POSTS) {
    const langs = getAvailableLangsForSlugServer(post.slug);
    for (const lang of langs) {
      const langSlug = getTranslatedSlug(post.slug, lang as SupportedLang);
      const locSlug = langSlug && langSlug !== post.slug ? langSlug : post.slug;
      const url = `${SITE_URL}/${lang}/blog/${locSlug}`;
      result.push({ url, publishedAt: post.publishedAt, updatedAt: post.updatedAt || post.publishedAt });
    }
  }
  return result;
}

const INDEXNOW_MAX_RETRIES = 3;
const INDEXNOW_FETCH_TIMEOUT_MS = 8_000;

function isRetriableStatus(status: number): boolean {
  // 429 (rate limited) and 5xx (server side) are worth retrying. 4xx
  // (other than 429) usually mean a permanent client-side problem.
  return status === 429 || (status >= 500 && status < 600);
}

async function postIndexNow(key: string, urls: string[]): Promise<number> {
  if (urls.length === 0) return 0;
  const body = {
    host: HOST,
    key,
    keyLocation: getKeyLocation(key),
    urlList: urls,
  };

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= INDEXNOW_MAX_RETRIES; attempt++) {
    let nonRetriable = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), INDEXNOW_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(INDEXNOW_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));
      if (res.status === 200 || res.status === 202) {
        logger.info(
          `IndexNow: submitted ${urls.length} URL(s) — HTTP ${res.status}${attempt > 1 ? ` (attempt ${attempt})` : ""}`,
          "indexnow",
        );
        return res.status;
      }
      const text = await res.text().catch(() => "");
      const err = new Error(`IndexNow HTTP ${res.status}: ${text.slice(0, 300)}`);
      lastErr = err;
      if (!isRetriableStatus(res.status)) {
        // Permanent client-side failure (e.g. 400/403/422) — surface without retrying.
        nonRetriable = true;
        throw err;
      }
      if (attempt === INDEXNOW_MAX_RETRIES) throw err;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `IndexNow: HTTP ${res.status} on attempt ${attempt}/${INDEXNOW_MAX_RETRIES}, retrying in ${delay}ms`,
        "indexnow",
      );
      await new Promise(r => setTimeout(r, delay));
    } catch (err) {
      lastErr = err;
      // Re-throw immediately for permanent failures so the caller can log
      // and the URLs are not pinged again (state is updated only on success).
      if (nonRetriable) throw err;
      // Network / fetch errors are retriable.
      if (attempt === INDEXNOW_MAX_RETRIES) throw err;
      const delay = 1_000 * 2 ** (attempt - 1);
      logger.warn(
        `IndexNow: transport error on attempt ${attempt}/${INDEXNOW_MAX_RETRIES} (${err instanceof Error ? err.message : String(err)}), retrying in ${delay}ms`,
        "indexnow",
      );
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr ?? new Error("IndexNow: exhausted retries");
}

/**
 * Discover IndexNow key files shipped under `client/public/*.txt` (where each
 * file's basename equals the key and its body is the same key). We register a
 * dedicated Express route per discovered file so Bing/Yandex can verify host
 * ownership even when:
 *   - the `INDEXNOW_KEY` env var is not set in the runtime environment, or
 *   - the deploy hasn't yet rebuilt `dist/public` (e.g. file added between
 *     deploys).
 *
 * Without this, the SPA catch-all in `serveStatic` would respond to
 * `/<KEY>.txt` with HTML and IndexNow rejects the submissions with HTTP 403.
 */
export function discoverStaticKeyFiles(): { key: string; path: string }[] {
  const candidates = [
    pathResolve(process.cwd(), "client", "public"),
    pathResolve(process.cwd(), "exentax-web", "client", "public"),
    pathResolve(__dirname_indexnow, "..", "client", "public"),
    pathResolve(__dirname_indexnow, "..", "..", "client", "public"),
  ];
  const found: { key: string; path: string }[] = [];
  const seen = new Set<string>();
  for (const dir of candidates) {
    try {
      if (!existsSync(dir)) continue;
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".txt")) continue;
        const base = file.slice(0, -4);
        if (!/^[a-zA-Z0-9-]{8,128}$/.test(base)) continue;
        const full = pathResolve(dir, file);
        let body: string;
        try {
          body = readFileSync(full, "utf8").trim();
        } catch {
          continue;
        }
        if (body !== base) continue; // not an IndexNow key file
        if (seen.has(base)) continue;
        seen.add(base);
        found.push({ key: base, path: `/${file}` });
      }
    } catch {
      // ignore unreadable candidate dirs
    }
  }
  return found;
}

/**
 * Compute warnings about misconfiguration between the env-var key and the
 * static key files shipped under `client/public`. Pure function so it can be
 * unit-tested without spinning up Express.
 *
 * Conditions surfaced:
 *   - `INDEXNOW_KEY` env is set but does not match any discovered static file
 *     (Bing will pull `/<envKey>.txt` and get HTML/404 → 403 on submissions).
 *   - `INDEXNOW_KEY_LOCATION` is set but its basename does not match any known
 *     key (env or static), which is the same failure mode in disguise.
 */
export function computeIndexNowConfigWarnings(input: {
  envKey: string | null;
  envKeyLocation: string | null;
  staticKeys: string[];
}): string[] {
  const { envKey, envKeyLocation, staticKeys } = input;
  const warnings: string[] = [];
  const knownKeys = new Set<string>(staticKeys);
  if (envKey) knownKeys.add(envKey);

  if (envKey && staticKeys.length > 0 && !staticKeys.includes(envKey)) {
    warnings.push(
      `INDEXNOW_KEY env (${envKey}) does not match any client/public/<key>.txt ` +
        `(found: ${staticKeys.join(", ")}). Bing will request /${envKey}.txt and ` +
        `receive HTML, rejecting submissions with HTTP 403. Either remove the env ` +
        `var or rename the static file to match.`,
    );
  }

  if (envKeyLocation) {
    const m = envKeyLocation.match(/\/([a-zA-Z0-9-]{8,128})\.txt(?:[?#].*)?$/);
    const locKey = m ? m[1] : null;
    if (!locKey) {
      warnings.push(
        `INDEXNOW_KEY_LOCATION (${envKeyLocation}) does not look like a /<key>.txt URL.`,
      );
    } else if (!knownKeys.has(locKey)) {
      warnings.push(
        `INDEXNOW_KEY_LOCATION (${envKeyLocation}) points to /${locKey}.txt which is ` +
          `neither the env key nor a discovered static file (${[...knownKeys].join(", ") || "none"}).`,
      );
    }
  }

  return warnings;
}

export function registerIndexNowRoutes(app: Express): void {
  const registered = new Set<string>();
  const register = (key: string, source: string) => {
    const path = `/${key}.txt`;
    if (registered.has(path)) return;
    registered.add(path);
    app.get(path, (_req, res) => {
      res.header("Content-Type", "text/plain; charset=utf-8");
      res.header("Cache-Control", "public, max-age=86400");
      res.send(key);
    });
    logger.info(`IndexNow key endpoint registered at ${path} (source: ${source})`, "indexnow");
  };

  // 1) Static key files shipped with the client (deploy-independent).
  const staticFiles = discoverStaticKeyFiles();
  for (const { key } of staticFiles) {
    register(key, "client/public");
  }

  // 2) Env-var key (legacy / dynamic configuration override).
  const envKey = getKey();
  if (envKey) register(envKey, "INDEXNOW_KEY env");

  if (registered.size === 0) {
    logger.warn(
      "IndexNow: no key endpoint registered (no INDEXNOW_KEY env and no client/public/<key>.txt found). " +
        "Bing/IndexNow submissions will be rejected with HTTP 403 until a key is published.",
      "indexnow",
    );
  }

  // 3) Boot-time divergence check: env vs. static file. Even when both
  //    endpoints are served, if `INDEXNOW_KEY` is set to a value that does
  //    not match the static file Bing has cached, every submission will be
  //    rejected with 403. Fail loud at startup so the deploy is visible in
  //    logs instead of silently broken.
  const warnings = computeIndexNowConfigWarnings({
    envKey,
    envKeyLocation: process.env.INDEXNOW_KEY_LOCATION?.trim() || null,
    staticKeys: staticFiles.map((f) => f.key),
  });
  for (const w of warnings) {
    logger.warn(`IndexNow: ${w}`, "indexnow");
  }
}

/**
 * Submit an arbitrary list of URLs to IndexNow, one per request, capturing the
 * HTTP outcome per URL. Used by the `republish-tier-a-fase1.mjs` script (and
 * any future per-batch republish operation) so callers can produce a per-URL
 * audit log instead of a batched OK/fail summary.
 *
 * Honors the same `INDEXNOW_KEY` / `INDEXNOW_KEY_LOCATION` configuration as
 * the automatic post-deploy ping. Returns one entry per submitted URL.
 *
 * The state file (`data/indexnow-pinged.json`) is updated on success so the
 * automatic post-deploy ping does not re-submit these URLs in its own dedup
 * window. Failures are recorded but do not poison the state.
 */
export type IndexNowPerUrlResult = {
  url: string;
  ok: boolean;
  status: number | null;
  at: string;
  error?: string;
};

export async function submitIndexNowForUrls(
  urls: string[],
): Promise<{ key: string | null; results: IndexNowPerUrlResult[] }> {
  const key = getKey();
  if (!key) {
    return {
      key: null,
      results: urls.map((url) => ({
        url,
        ok: false,
        status: null,
        at: new Date().toISOString(),
        error: "INDEXNOW_KEY not set in this environment",
      })),
    };
  }
  // Note: this one-off republish path intentionally does NOT touch the
  // `data/indexnow-pinged.json` dedup state. That state is owned by two
  // separate consumers (`pingIndexNowForNewArticles` and the per-URL CLI
  // `scripts/blog-indexnow-606.mjs`) which use different value schemas;
  // mixing writes here would either lose history or corrupt the schema.
  // Per-URL audit logs go in `docs/seo/blog-overhaul-2026.md` instead.
  const results: IndexNowPerUrlResult[] = [];
  for (const url of urls) {
    const at = new Date().toISOString();
    try {
      const status = await postIndexNow(key, [url]);
      results.push({ url, ok: true, status, at });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const m = /^IndexNow HTTP (\d+):/.exec(msg);
      const status = m ? Number.parseInt(m[1], 10) : null;
      results.push({ url, ok: false, status, at, error: msg.slice(0, 300) });
    }
  }
  return { key, results };
}

export async function pingIndexNowForNewArticles(): Promise<void> {
  // Lazy import to avoid a circular import (discord.ts pulls in metrics which
  // does not depend on this module, but we keep this dynamic for safety).
  const { notifySeoIndexing } = await import("./discord");
  try {
    const key = getKey();
    if (!key) {
      logger.debug("IndexNow: INDEXNOW_KEY not set — skipping ping", "indexnow");
      return;
    }
    const all = buildBlogUrls();
    const state = loadPinged();

    // First-ever run: seed state with current URLs without pinging anything,
    // so we don't blast every existing article on initial deployment.
    if (!state.exists) {
      const seed: Record<string, string> = {};
      for (const u of all) seed[u.url] = u.updatedAt;
      savePinged(seed);
      logger.info(`IndexNow: seeded state with ${all.length} existing URL(s); no submission on first run`, "indexnow");
      return;
    }

    // A URL is "fresh" if we've never pinged it OR its updatedAt has changed.
    const fresh = all.filter((u) => {
      const prev = state.entries[u.url];
      return prev === undefined || prev !== u.updatedAt;
    });
    if (fresh.length === 0) {
      logger.debug("IndexNow: no new or updated articles to submit", "indexnow");
      return;
    }

    const entries = { ...state.entries };
    const BATCH = 100;
    let okCount = 0;
    let failCount = 0;
    const errors: string[] = [];
    for (let i = 0; i < fresh.length; i += BATCH) {
      const slice = fresh.slice(i, i + BATCH);
      const urls = slice.map((u) => u.url);
      try {
        await postIndexNow(key, urls);
        for (const u of slice) entries[u.url] = u.updatedAt;
        okCount += slice.length;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(
          `IndexNow: ping failed for batch (${slice.length} URLs): ${msg}`,
          "indexnow",
        );
        failCount += slice.length;
        if (errors.length < 3) errors.push(msg.slice(0, 200));
      }
    }
    savePinged(entries);
    // Status semantics:
    //   - all-failed    → failed (red)
    //   - any failure   → skipped (warning/orange) so partial outages are visible
    //   - all-OK        → ok (green)
    const status: "ok" | "skipped" | "failed" =
      failCount > 0 && okCount === 0
        ? "failed"
        : failCount > 0
          ? "skipped"
          : "ok";
    const titlePrefix =
      status === "failed"
        ? `fallo (${failCount} URL${failCount === 1 ? "" : "s"})`
        : status === "skipped"
          ? `parcial (${okCount} OK / ${failCount} fallidas)`
          : `${okCount} URL${okCount === 1 ? "" : "s"} enviadas`;
    notifySeoIndexing({
      source: "indexnow",
      status,
      title: `IndexNow — ${titlePrefix}`,
      summary:
        status === "failed"
          ? errors.join(" | ") || "Todas las tandas fallaron."
          : failCount > 0
            ? `${okCount} OK, ${failCount} con error: ${errors.join(" | ") || "(sin detalle)"}`
            : null,
      fields: [
        { name: "OK", value: String(okCount) },
        { name: "Failed", value: String(failCount) },
        { name: "Total fresco", value: String(fresh.length) },
      ],
      dedupKey: `indexnow:run:${new Date().toISOString().slice(0, 16)}:${okCount}:${failCount}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(
      `IndexNow: unexpected error during ping: ${msg}`,
      "indexnow",
    );
    notifySeoIndexing({
      source: "indexnow",
      status: "failed",
      title: "IndexNow — error inesperado",
      summary: msg.slice(0, 1000),
      dedupKey: `indexnow:exception:${msg.slice(0, 80)}`,
    });
  }
}
