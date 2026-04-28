#!/usr/bin/env node
/*
 * blog-sources-validate.mjs
 * ----------------------------------------------------------------------------
 * Structural validator for `client/src/data/blog-sources.ts` (Task #6 v2 —
 * sources gate). Complements `blog-verify-source-urls.mjs`, which is the
 * **network** gate that pings the 27 canonical authority URLs cited inside
 * article bodies. This script is purely **offline / structural**:
 *
 *   1. Every base slug under `client/src/data/blog-content/es/` MUST appear
 *      as a key in `SOURCES_BY_SLUG`.
 *   2. Each entry must reference at least 3 sources. Authority signal: the
 *      `Sources` block at the bottom of every article should be non-trivial.
 *   3. Every `{ doc, section }` reference must resolve to an entry in
 *      `DOC_REGISTRY` whose `sections[]` contains the matching `section.id`.
 *      Stale doc ids or stale section ids are critical — they would render
 *      as a broken sources block at runtime.
 *   4. No duplicated `{ doc, section }` pair within the same slug bundle.
 *   5. The five-registry parity check (consistency-check.mjs) is the owner
 *      of slug presence; this script re-asserts it defensively.
 *
 * Optional companion: a tiny ping cache lives at
 * `data/blog-sources-pings.json` and stores the last seen status of every
 * external URL referenced by `blog-verify-source-urls.mjs`. This script
 * does NOT mutate the cache; it is read-only here. The cache is updated by
 * `blog-verify-source-urls.mjs --update-cache`.
 *
 * Exits 0 on zero criticals. Wired by `scripts/blog/blog-validate-all.mjs`.
 * ----------------------------------------------------------------------------
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const SOURCES_FILE = path.join(ROOT, "client/src/data/blog-sources.ts");
const ES_CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content/es");
// Single source of truth for the URL ping cache. Written by
// `blog-verify-source-urls.mjs`; read here to enforce freshness + liveness.
const PING_CACHE = path.join(ROOT, "reports/seo/source-url-verification.json");

const MIN_REFS_PER_SLUG = 3;
// A cache older than this is considered stale and CI fails (forcing the
// dev to re-run `node scripts/blog/blog-verify-source-urls.mjs`). 14 days is
// long enough to absorb noisy authority sites without letting rot pile up.
const PING_MAX_AGE_DAYS = 14;

function listEsSlugs() {
  return fs
    .readdirSync(ES_CONTENT_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => f.replace(/\.ts$/, ""));
}

function sliceLiteralBlock(src, marker) {
  const start = src.indexOf(marker);
  if (start < 0) return null;
  const eq = src.indexOf("=", start);
  // Find the first `{` or `[` after the `=`.
  const obj = src.indexOf("{", eq);
  const arr = src.indexOf("[", eq);
  let openIdx;
  let openCh;
  let closeCh;
  if (obj >= 0 && (arr < 0 || obj < arr)) {
    openIdx = obj; openCh = "{"; closeCh = "}";
  } else {
    openIdx = arr; openCh = "["; closeCh = "]";
  }
  let depth = 0;
  let i = openIdx;
  let inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === openCh) depth++;
    else if (c === closeCh) {
      depth--;
      if (depth === 0) break;
    }
  }
  return src.slice(openIdx, i + 1);
}

/** Strip TS type annotations from object literals so `new Function` can eval
 *  them. The blog-sources.ts file uses pure literals, but the DOC_REGISTRY
 *  entries reference shared constants by identifier (BANKING_STACK, etc.).
 *  We resolve those by parsing the surrounding `const X: SourceRef[] = [...]`
 *  declarations first, then substituting the identifier into SOURCES_BY_SLUG. */
function loadSources() {
  const src = fs.readFileSync(SOURCES_FILE, "utf8");

  // 1. DOC_REGISTRY (object literal, no identifier refs).
  const docBlock = sliceLiteralBlock(src, "export const DOC_REGISTRY");
  if (!docBlock) throw new Error("DOC_REGISTRY not found in blog-sources.ts");
  // Drop trailing TS type annotation `as const` if any.
  // eslint-disable-next-line no-new-func
  const docRegistry = new Function(`return ${docBlock};`)();

  // 1b. OFFICIAL_SOURCES (object literal). External authority URLs cited by
  //     critical articles via `{ external: id }` refs.
  const extBlock = sliceLiteralBlock(src, "export const OFFICIAL_SOURCES");
  // eslint-disable-next-line no-new-func
  const officialSources = extBlock ? new Function(`return ${extBlock};`)() : {};

  // 2. Collect every helper bundle declared as `const NAME: SourceRef[] = [...]`
  //    or `const NAME = [...]`.
  const bundleRx = /\nconst\s+([A-Z][A-Z0-9_]*)\s*(?::\s*SourceRef\[\])?\s*=\s*\[/g;
  const bundles = {};
  let m;
  while ((m = bundleRx.exec(src)) !== null) {
    const name = m[1];
    // The match ends with the opening `[`. Start the walker right at that
    // bracket — using m.index would land on the type annotation `SourceRef[]`.
    const startBracket = bundleRx.lastIndex - 1;
    let depth = 0, i = startBracket, inStr = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (inStr) {
        if (c === "\\") { i++; continue; }
        if (c === inStr) inStr = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
      if (c === "[") depth++;
      else if (c === "]") { depth--; if (depth === 0) break; }
    }
    const arrSrc = src.slice(startBracket, i + 1);
    // eslint-disable-next-line no-new-func
    bundles[name] = new Function(`return ${arrSrc};`)();
  }

  // 3. SOURCES_BY_SLUG: substitute bare identifier references with their
  //    bundle literal before evaluating.
  const sosBlock = sliceLiteralBlock(src, "export const SOURCES_BY_SLUG");
  if (!sosBlock) throw new Error("SOURCES_BY_SLUG not found in blog-sources.ts");
  // Replace `: BUNDLE_NAME,` and `: BUNDLE_NAME\n` patterns with JSON inline.
  let resolved = sosBlock;
  for (const [name, value] of Object.entries(bundles)) {
    const litJson = JSON.stringify(value);
    // Direct alias:  "slug": BUNDLE,
    const aliasRx = new RegExp(`:\\s*${name}(?=\\s*[,\\n}])`, "g");
    resolved = resolved.replace(aliasRx, `: ${litJson}`);
    // Spread inside an inline array:  [...BUNDLE, { … }]
    const spreadRx = new RegExp(`\\.\\.\\.\\s*${name}\\b`, "g");
    resolved = resolved.replace(spreadRx, `...${litJson}`);
  }
  // eslint-disable-next-line no-new-func
  const sourcesBySlug = new Function(`return ${resolved};`)();

  return { docRegistry, sourcesBySlug, officialSources };
}

function readPingCache() {
  if (!fs.existsSync(PING_CACHE)) return null;
  try { return JSON.parse(fs.readFileSync(PING_CACHE, "utf8")); }
  catch { return null; }
}

/** Enforce that the URL ping cache exists, is fresh (< PING_MAX_AGE_DAYS),
 *  and reports zero dead URLs. Anything else is a CRITICAL — the gate fails
 *  so CI cannot ship articles whose external citations have rotted.
 *  Refresh the cache by running `node scripts/blog/blog-verify-source-urls.mjs`. */
function checkPingCacheLiveness(criticals) {
  const ping = readPingCache();
  const rel = path.relative(ROOT, PING_CACHE);
  if (!ping) {
    criticals.push({
      slug: "—",
      kind: "external-ping-cache-missing",
      detail: `${rel} is missing. Run: node scripts/blog/blog-verify-source-urls.mjs`,
    });
    return;
  }
  const generatedAt = ping.generatedAt ? new Date(ping.generatedAt) : null;
  if (!generatedAt || Number.isNaN(generatedAt.getTime())) {
    criticals.push({ slug: "—", kind: "external-ping-cache-bad", detail: rel });
    return;
  }
  const ageDays = (Date.now() - generatedAt.getTime()) / 86_400_000;
  if (ageDays > PING_MAX_AGE_DAYS) {
    criticals.push({
      slug: "—",
      kind: "external-ping-cache-stale",
      detail: `${rel} is ${ageDays.toFixed(1)}d old (> ${PING_MAX_AGE_DAYS}d). Re-run blog-verify-source-urls.mjs.`,
    });
  }
  // Liveness: a dead entry is `ok=false` AND not Cloudflare-gated (CF
  // challenges return 403 to bots while serving humans, so we treat them
  // as alive — same convention as `blog-verify-source-urls.mjs`).
  const dead = (ping.results || []).filter(
    (r) => r && r.ok === false && !r.cfGated,
  );
  for (const r of dead) {
    criticals.push({
      slug: "—",
      kind: "external-ping-dead",
      detail: `${r.citation || r.url} → status=${r.status ?? "?"} ${r.error ? `(${r.error})` : ""}`,
    });
  }
}

function main() {
  const criticals = [];
  const warnings = [];

  let docRegistry, sourcesBySlug, officialSources;
  try {
    ({ docRegistry, sourcesBySlug, officialSources } = loadSources());
  } catch (err) {
    console.error("blog-sources-validate crashed:", err.message);
    process.exit(2);
  }

  const docIds = new Set(Object.keys(docRegistry));
  const externalIds = new Set(Object.keys(officialSources || {}));
  const sectionsByDoc = {};
  for (const [docId, doc] of Object.entries(docRegistry)) {
    // sections is a Record<string, DocSection>; the key IS the section id.
    sectionsByDoc[docId] = new Set(Object.keys(doc.sections || {}));
  }

  const esSlugs = listEsSlugs();
  const declared = new Set(Object.keys(sourcesBySlug));

  // Rule 1: every ES slug present in SOURCES_BY_SLUG.
  for (const slug of esSlugs) {
    if (!declared.has(slug)) {
      criticals.push({ slug, kind: "missing-from-SOURCES_BY_SLUG" });
    }
  }
  // Reverse: any orphan keys in SOURCES_BY_SLUG?
  const esSet = new Set(esSlugs);
  for (const slug of declared) {
    if (!esSet.has(slug)) {
      criticals.push({ slug, kind: "orphan-in-SOURCES_BY_SLUG" });
    }
  }

  // Rules 2-4: per-bundle audits.
  for (const [slug, refs] of Object.entries(sourcesBySlug)) {
    if (!Array.isArray(refs)) {
      criticals.push({ slug, kind: "bundle-not-array" });
      continue;
    }
    if (refs.length < MIN_REFS_PER_SLUG) {
      criticals.push({
        slug,
        kind: "too-few-sources",
        detail: `${refs.length} < ${MIN_REFS_PER_SLUG}`,
      });
    }
    const seen = new Set();
    for (const ref of refs) {
      if (!ref || typeof ref !== "object") {
        criticals.push({ slug, kind: "ref-shape", detail: JSON.stringify(ref) });
        continue;
      }
      // External authority-URL ref shape: { external: id }
      if (Object.prototype.hasOwnProperty.call(ref, "external")) {
        const id = ref.external;
        if (!id || typeof id !== "string") {
          criticals.push({ slug, kind: "ref-missing-fields", detail: JSON.stringify(ref) });
          continue;
        }
        if (!externalIds.has(id)) {
          criticals.push({ slug, kind: "unknown-external", detail: id });
          continue;
        }
        const key = `external#${id}`;
        if (seen.has(key)) {
          warnings.push({ slug, kind: "duplicate-ref", detail: key });
        }
        seen.add(key);
        continue;
      }
      const { doc, section } = ref;
      if (!doc || !section) {
        criticals.push({ slug, kind: "ref-missing-fields", detail: JSON.stringify(ref) });
        continue;
      }
      if (!docIds.has(doc)) {
        criticals.push({ slug, kind: "unknown-doc", detail: doc });
        continue;
      }
      if (!sectionsByDoc[doc].has(section)) {
        criticals.push({
          slug,
          kind: "unknown-section",
          detail: `${doc}#${section}`,
        });
      }
      const key = `${doc}#${section}`;
      if (seen.has(key)) {
        warnings.push({ slug, kind: "duplicate-ref", detail: key });
      }
      seen.add(key);
    }
  }

  // Rule 5 (CRITICAL): URL ping cache must exist, be fresh, and report
  // zero dead authority URLs. This is what enforces external-source
  // liveness in CI without requiring the network on every `npm run check`.
  checkPingCacheLiveness(criticals);

  console.log(`blog-sources-validate ── ${esSlugs.length} ES slugs vs ${declared.size} declared bundles`);
  if (warnings.length) {
    console.log(`\n⚠  ${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 25)) {
      console.log(`   ${w.kind}  ${w.slug}  ${w.detail || ""}`);
    }
    if (warnings.length > 25) console.log(`   ... and ${warnings.length - 25} more`);
  }
  if (criticals.length) {
    console.error(`\n✖ ${criticals.length} critical sources issue(s):`);
    for (const c of criticals.slice(0, 60)) {
      console.error(`   ${c.kind}  ${c.slug}  ${c.detail || ""}`);
    }
    if (criticals.length > 60) console.error(`   ... and ${criticals.length - 60} more`);
    console.error("\nblog-sources-validate: FAIL\n");
    process.exit(1);
  }
  console.log("\n✓ blog-sources-validate: OK\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { loadSources };
