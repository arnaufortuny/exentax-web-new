/**
 * Task #42 — Per-injection footprint of every numeric hook.
 *
 * Persists `{ slug: { lang: { text, sha256, injectedAt, sourceJsonSha } } }`
 * at `scripts/blog/data/article-hook-snapshot.json`. The injector
 * (`blog-add-numeric-hook.mjs`) updates this file atomically after every
 * successful write so the auditor (`blog-numeric-hook-yearly-refresh.mjs`)
 * can tell with certainty whether the first paragraph of an article was
 * written by the injector ("I put this here") or by the editorial team ("a
 * human authored this"). Without that ground truth the auditor falls back to
 * a fragile heuristic ("short paragraph + digit + ≤ 320 chars") which mis-
 * classifies legitimate native numeric leads as drifted hooks.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_PATH = path.join(__dirname, "..", "data", "article-hook-snapshot.json");

export function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

export function fileSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export function loadSnapshot() {
  if (!fs.existsSync(SNAPSHOT_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
  } catch (err) {
    throw new Error(
      `article-hook-snapshot.json is unreadable (${err.message}). Refusing to silently overwrite — fix or delete it manually.`,
    );
  }
}

/**
 * Sort the snapshot deterministically (slugs alphabetical, langs in fixed
 * order) so diffs stay stable across runs.
 */
function canonicalize(snapshot) {
  const LANG_ORDER = ["es", "en", "fr", "de", "pt", "ca"];
  const out = {};
  for (const slug of Object.keys(snapshot).sort()) {
    const langs = snapshot[slug] || {};
    const sortedLangs = {};
    for (const lang of LANG_ORDER) {
      if (langs[lang]) sortedLangs[lang] = langs[lang];
    }
    // Preserve any unexpected language keys at the tail (defensive).
    for (const lang of Object.keys(langs).sort()) {
      if (!LANG_ORDER.includes(lang)) sortedLangs[lang] = langs[lang];
    }
    out[slug] = sortedLangs;
  }
  return out;
}

export function saveSnapshot(snapshot) {
  const canonical = canonicalize(snapshot);
  const json = `${JSON.stringify(canonical, null, 2)}\n`;
  const tmp = `${SNAPSHOT_PATH}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, json, "utf8");
  fs.renameSync(tmp, SNAPSHOT_PATH);
}

/**
 * Mutate `snapshot` in place by recording that `text` was injected for
 * `(slug, lang)` at `injectedAt`, alongside the SHA of the source JSON file
 * at injection time.
 */
export function recordInjection(snapshot, slug, lang, text, sourceJsonSha, injectedAt) {
  if (!snapshot[slug]) snapshot[slug] = {};
  snapshot[slug][lang] = {
    text,
    sha256: sha256(text),
    injectedAt,
    sourceJsonSha,
  };
}

export function getSnapshotEntry(snapshot, slug, lang) {
  return snapshot?.[slug]?.[lang] ?? null;
}
