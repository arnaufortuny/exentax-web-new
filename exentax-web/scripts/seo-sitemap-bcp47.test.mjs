#!/usr/bin/env node
/*
 * seo-sitemap-bcp47.test.mjs
 * ----------------------------------------------------------------------------
 * Verifies that every hreflang attribute the site can emit uses the full
 * BCP-47 region tag (es-ES, en-US, fr-FR, de-DE, pt-PT, ca-ES) instead of
 * the bare two-letter code. Google accepts both, but BCP-47 is the
 * documented best practice for region-specific Portuguese/Catalan and keeps
 * the sitemap in sync with `<html lang>` and `LanguageService.getLocaleTag`.
 *
 * Static checks (no server required):
 *   1. server/server-constants.ts — HREFLANG_BCP47 is the single source of
 *                                   truth and contains the expected map.
 *   2. server/routes/public.ts    — imports HREFLANG_BCP47 from
 *                                   `../server-constants` (no local copy).
 *   3. server/static.ts           — imports HREFLANG_BCP47 from
 *                                   `./server-constants` (no local copy).
 *   4. client/index.html          — top-level hreflang links use BCP-47 tags.
 *
 * Live checks (only when BASE_URL is reachable):
 *   4. /sitemap-pages.xml      — emits hreflang="pt-PT" and "ca-ES" at least
 *                                once and never the bare "pt"/"ca" codes.
 *   5. /sitemap-faq.xml        — same.
 *   6. /sitemap-blog.xml       — same.
 *
 * Live checks are skipped (with a notice, not a failure) when the dev server
 * is not running, so this file can run as a fast unit test in CI without a
 * full app boot.
 * ----------------------------------------------------------------------------
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const EXPECTED = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  ca: "ca-ES",
};
const REGION_TAGS = Object.values(EXPECTED);
const BARE_REGION_CODES = ["pt", "ca"]; // the two we're explicitly upgrading

const fails = [];
function assert(label, ok, detail) {
  console.log(`${ok ? "✓" : "✗"} ${label}${ok ? "" : `  — ${detail}`}`);
  if (!ok) fails.push(label);
}

// 1. The single source of truth lives in server/server-constants.ts.
function assertMap(file, label) {
  const src = readFileSync(resolve(REPO, file), "utf8");
  for (const [lang, tag] of Object.entries(EXPECTED)) {
    const re = new RegExp(`${lang}\\s*:\\s*["']${tag}["']`);
    assert(`${label}: ${lang} → ${tag}`, re.test(src), `pattern ${re} not found`);
  }
}
assertMap("server/server-constants.ts", "server-constants.ts HREFLANG_BCP47");

// 2+3. Both consumers must IMPORT HREFLANG_BCP47 from server-constants and
// must NOT keep a local copy of the literal map (otherwise they could drift
// from the source of truth, which is exactly what we are guarding against).
function assertImportsHreflangFromConstants(file, importPath) {
  const src = readFileSync(resolve(REPO, file), "utf8");
  // Either a named import, possibly multi-line, that mentions HREFLANG_BCP47
  // alongside other names. We accept any whitespace and trailing commas.
  const importRe = new RegExp(
    `import\\s*\\{[^}]*\\bHREFLANG_BCP47\\b[^}]*\\}\\s*from\\s*["']${importPath.replace(/[/.]/g, "\\$&")}["']`,
    "s"
  );
  assert(
    `${file} imports HREFLANG_BCP47 from "${importPath}"`,
    importRe.test(src),
    `expected named import of HREFLANG_BCP47 from "${importPath}"`
  );
  // Guard against a re-introduced local copy: a literal `HREFLANG_BCP47 =`
  // assignment / declaration anywhere in the file means someone duplicated
  // the constant locally, defeating the single-source-of-truth guarantee.
  const localDeclRe = /(?:const|let|var)\s+HREFLANG_BCP47\s*[:=]/;
  assert(
    `${file} does not redeclare HREFLANG_BCP47 locally`,
    !localDeclRe.test(src),
    "found a local `const/let/var HREFLANG_BCP47` declaration; remove it and use the import"
  );
}
assertImportsHreflangFromConstants("server/routes/public.ts", "../server-constants");
assertImportsHreflangFromConstants("server/static.ts", "./server-constants");

// 3. client/index.html top-level alternates.
{
  const html = readFileSync(resolve(REPO, "client/index.html"), "utf8");
  for (const tag of REGION_TAGS) {
    assert(`client/index.html has hreflang="${tag}"`, new RegExp(`hreflang="${tag}"`).test(html));
  }
  for (const bare of BARE_REGION_CODES) {
    const bareRe = new RegExp(`hreflang="${bare}"(?!-)`);
    assert(`client/index.html has no bare hreflang="${bare}"`, !bareRe.test(html));
  }
}

// 4-6. Live sitemap checks (best-effort).
const BASE_URL = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
async function fetchText(url, timeoutMs = 4000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return { status: res.status, body: await res.text() };
  } catch (e) {
    return { status: 0, body: "", error: String(e?.message || e) };
  } finally {
    clearTimeout(t);
  }
}

const SITEMAPS = ["/sitemap-pages.xml", "/sitemap-faq.xml", "/sitemap-blog.xml"];
let serverUp = true;
for (const path of SITEMAPS) {
  const { status, body } = await fetchText(`${BASE_URL}${path}`);
  if (status !== 200) {
    if (serverUp) console.log(`  (live sitemap checks skipped: ${BASE_URL}${path} → ${status || "unreachable"})`);
    serverUp = false;
    continue;
  }
  for (const tag of REGION_TAGS) {
    assert(`${path} contains hreflang="${tag}"`, body.includes(`hreflang="${tag}"`));
  }
  for (const bare of BARE_REGION_CODES) {
    const bareRe = new RegExp(`hreflang="${bare}"(?!-)`);
    assert(`${path} has no bare hreflang="${bare}"`, !bareRe.test(body));
  }
}

if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed.`);
  process.exit(1);
}
console.log(`\nAll BCP-47 hreflang assertions passed.`);
