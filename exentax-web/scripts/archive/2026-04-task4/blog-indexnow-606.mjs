#!/usr/bin/env node
/**
 * blog-indexnow-606.mjs — Per-URL IndexNow submission for the full blog
 * universe (606 URLs = 101 articles × 6 langs).
 *
 * Runs the IndexNow submission cycle from the CLI (without waiting for the
 * automatic post-deploy hook in `server/sitemap-ping.ts`). Behavior:
 *
 *   • Builds the 606-URL list directly from `client/src/data/blog-posts.ts`
 *     and `client/src/data/blog-posts-slugs.ts` (mirroring the runtime
 *     resolution used by the React router).
 *   • Reads / writes `data/indexnow-pinged.json` so each URL is only
 *     submitted once per 24h window (anti-spam guarantee required by the
 *     IndexNow protocol).
 *   • Submits via POST https://api.indexnow.org/IndexNow when
 *     `INDEXNOW_KEY` is set; otherwise records a "skipped: missing key"
 *     entry and exits 0 (the script is intended to be safe to run in dev).
 *   • Appends a timestamped entry to `docs/seo/sitemap-ping-log.md` with
 *     submitted / skipped / failed counts.
 *
 * Usage:
 *   SITE_URL=https://exentax.com node scripts/blog-indexnow-606.mjs
 *   SITE_URL=https://exentax.com INDEXNOW_KEY=<key> node scripts/blog-indexnow-606.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = (process.env.SITE_URL || "https://exentax.com").replace(/\/$/, "");
const KEY = (process.env.INDEXNOW_KEY || "").trim();
const HOST = (() => { try { return new URL(SITE_URL).host; } catch { return "exentax.com"; } })();
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const STATE_PATH = resolve(ROOT, "data/indexnow-pinged.json");
const LOG_PATH = resolve(ROOT, "docs/seo/sitemap-ping-log.md");
const NOW = new Date().toISOString();
const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function read(rel) { return readFileSync(resolve(ROOT, rel), "utf8"); }

// ---------- 1. Extract slugs from blog-posts.ts ----------
const blogSrc = read("client/src/data/blog-posts.ts");
const baseSlugs = [...blogSrc.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const updatedAtBySlug = new Map();
{
  // Capture publishedAt + optional updatedAt to inform the dedup state.
  const rx = /slug:\s*"([a-z0-9-]+)"[\s\S]*?publishedAt:\s*"([^"]+)"(?:[\s\S]*?updatedAt:\s*"([^"]+)")?/g;
  let m;
  while ((m = rx.exec(blogSrc))) updatedAtBySlug.set(m[1], m[3] || m[2]);
}

// ---------- 2. Extract per-lang slug overrides from blog-posts-slugs.ts ----------
let slugOverrides = {};
const slugsSrc = read("client/src/data/blog-posts-slugs.ts");
{
  // Match `"<base-slug>": { en: "...", fr: "..." }` blocks.
  const rx = /"([a-z0-9-]+)":\s*\{([^}]+)\}/g;
  let m;
  while ((m = rx.exec(slugsSrc))) {
    const base = m[1];
    const body = m[2];
    const map = {};
    const kv = body.matchAll(/(es|en|fr|de|pt|ca):\s*"([a-z0-9-]+)"/g);
    for (const k of kv) map[k[1]] = k[2];
    slugOverrides[base] = map;
  }
}
function translatedSlug(baseSlug, lang) {
  const ov = slugOverrides[baseSlug]?.[lang];
  return ov || baseSlug;
}

// Reverse map (any-lang slug → ES base slug) so per-URL state can persist
// `lastUpdatedAt` correctly: blog dates are keyed by ES slug.
const reverseSlug = new Map();
for (const [base, map] of Object.entries(slugOverrides)) {
  reverseSlug.set(base, base);
  for (const v of Object.values(map || {})) reverseSlug.set(v, base);
}
function baseSlugFromUrl(u) {
  const last = u.split("/").pop();
  return reverseSlug.get(last) || last;
}

// ---------- 3. Build the 606-URL list ----------
const urls = [];
for (const baseSlug of baseSlugs) {
  for (const lang of LANGS) {
    urls.push(`${SITE_URL}/${lang}/blog/${translatedSlug(baseSlug, lang)}`);
  }
}
console.log(`Universe: ${urls.length} blog URLs.`);

// ---------- 4. Load dedup state ----------
const state = (() => {
  if (!existsSync(STATE_PATH)) return { exists: false, entries: {} };
  try { return { exists: true, ...JSON.parse(readFileSync(STATE_PATH, "utf8")) }; }
  catch { return { exists: true, entries: {} }; }
})();
state.entries = state.entries || {};

const cutoff = Date.now() - DEDUP_WINDOW_MS;
const toSubmit = [];
const skipped24h = [];
for (const u of urls) {
  const last = state.entries[u]?.lastPingedAt ? Date.parse(state.entries[u].lastPingedAt) : 0;
  if (Number.isFinite(last) && last > cutoff) skipped24h.push(u);
  else toSubmit.push(u);
}
console.log(`To submit: ${toSubmit.length}; deduplicated within 24h: ${skipped24h.length}.`);

// ---------- 5. Submit (or record skip) ----------
let outcome = { status: "skipped", reason: "", httpStatus: null, submitted: 0, failed: 0 };

async function submitChunk(chunk) {
  const body = { host: HOST, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList: chunk };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return res.status;
}

if (!KEY) {
  outcome = { status: "skipped", reason: "INDEXNOW_KEY not set in this environment (production deploy auto-submits via server/indexnow.ts).", httpStatus: null, submitted: 0, failed: 0 };
} else if (toSubmit.length === 0) {
  outcome = { status: "skipped", reason: "All 606 URLs already submitted within the 24h dedup window.", httpStatus: null, submitted: 0, failed: 0 };
} else {
  // Chunk to keep request bodies small (IndexNow accepts up to ~10k URLs but
  // we cap at 100 per request for safety + visible incremental progress).
  let submitted = 0, failed = 0, lastStatus = null;
  for (let i = 0; i < toSubmit.length; i += 100) {
    const chunk = toSubmit.slice(i, i + 100);
    try {
      const s = await submitChunk(chunk);
      lastStatus = s;
      if (s >= 200 && s < 300) {
        submitted += chunk.length;
        for (const u of chunk) state.entries[u] = { lastPingedAt: NOW, lastUpdatedAt: updatedAtBySlug.get(baseSlugFromUrl(u)) || null };
      } else {
        failed += chunk.length;
        console.warn(`IndexNow returned HTTP ${s} for chunk ${i}-${i + chunk.length}.`);
      }
    } catch (e) {
      failed += chunk.length;
      console.warn(`IndexNow submission error for chunk ${i}-${i + chunk.length}: ${e?.message || e}`);
    }
  }
  outcome = {
    status: failed === 0 ? "ok" : (submitted > 0 ? "partial" : "failed"),
    reason: failed > 0 ? `${failed} URLs failed in last batch (HTTP ${lastStatus})` : "",
    httpStatus: lastStatus,
    submitted, failed,
  };
}

// ---------- 6. Persist state + log ----------
mkdirSync(dirname(STATE_PATH), { recursive: true });
writeFileSync(STATE_PATH, JSON.stringify({ updatedAt: NOW, entries: state.entries }, null, 2), "utf8");

const logLine =
  `\n## ${NOW} — Per-URL IndexNow (606 blog URLs)\n` +
  `- Status: **${outcome.status}**${outcome.reason ? ` — ${outcome.reason}` : ""}\n` +
  `- Submitted now: **${outcome.submitted}** | Skipped (24h dedup): **${skipped24h.length}** | Failed: **${outcome.failed}**\n` +
  `- HTTP: ${outcome.httpStatus ?? "—"} | Key configured: ${KEY ? "yes" : "no"} | Site: ${SITE_URL}\n`;

if (existsSync(LOG_PATH)) appendFileSync(LOG_PATH, logLine, "utf8");
else writeFileSync(LOG_PATH, `# Sitemap & IndexNow ping log\n${logLine}`, "utf8");

console.log(`Outcome: ${outcome.status} (submitted=${outcome.submitted}, skipped24h=${skipped24h.length}, failed=${outcome.failed}). Log → ${LOG_PATH}`);
process.exit(outcome.status === "failed" ? 1 : 0);
