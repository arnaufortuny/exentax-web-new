#!/usr/bin/env node
/*
 * seo-slash-hygiene.test.mjs
 * ----------------------------------------------------------------------------
 * Self-tests for the slash hygiene check. Verifies that:
 *
 *   1. The path classifier correctly labels the three bug families and
 *      passes through clean paths and the bare host root.
 *   2. The sitemap href extractor surfaces both <loc> and xhtml:link href
 *      values, so the classifier sees alternates as well as canonical URLs.
 *   3. The first-party host filter only flags URLs on exentax.com or the
 *      live BASE_URL, not third-party links.
 *
 * The classifier and the extractor are re-implemented inline (not imported)
 * because the production script is a CLI entrypoint that runs scans on
 * import. The two implementations must stay byte-equivalent — see the
 * matching helpers in `seo-slash-hygiene.mjs`.
 * ----------------------------------------------------------------------------
 */

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const LANG_RE = LANGS.join("|");
const FIRST_PARTY_HOSTS = new Set(["exentax.com", "www.exentax.com"]);

function classify(p) {
  if (!p.startsWith("/")) return null;
  if (p === "/") return null;
  if (p.includes("//")) return "double-slash";
  if (p.length > 1 && p.endsWith("/")) return "trailing-slash";
  const dup = new RegExp(`^/(${LANG_RE})/(${LANG_RE})(/|$)`);
  if (dup.test(p)) return "duplicate-lang-prefix";
  return null;
}

function pathFromHref(href, baseUrl = "") {
  if (!href) return null;
  if (href.startsWith("//")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    try {
      const u = new URL(href);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      const allowed = new Set(FIRST_PARTY_HOSTS);
      if (baseUrl) {
        try { allowed.add(new URL(baseUrl).host); } catch {}
      }
      if (!allowed.has(u.host)) return null;
      return u.pathname + (u.search || "");
    } catch {
      return null;
    }
  }
  if (!href.startsWith("/")) return null;
  const q = href.indexOf("?"); const h = href.indexOf("#");
  let end = href.length;
  if (q >= 0) end = Math.min(end, q);
  if (h >= 0) end = Math.min(end, h);
  return href.slice(0, end);
}

function extractSitemapHrefs(xml) {
  const hrefs = [];
  const locRe = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = locRe.exec(xml))) hrefs.push(m[1]);
  const altRe = /<xhtml:link\b[^>]*\bhref="([^"]+)"/g;
  while ((m = altRe.exec(xml))) hrefs.push(m[1]);
  return hrefs;
}

const fails = [];
function assertEq(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "✓" : "✗"} ${label}  got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`);
  if (!ok) fails.push(label);
}

// 1. Classifier coverage.
assertEq("clean root", classify("/"), null);
assertEq("clean lang root", classify("/es"), null);
assertEq("clean blog index", classify("/en/blog"), null);
assertEq("clean blog post", classify("/fr/blog/le-slug"), null);
assertEq("double slash", classify("/es//blog"), "double-slash");
assertEq("trailing slash on /es/", classify("/es/"), "trailing-slash");
assertEq("trailing slash on post", classify("/de/blog/x/"), "trailing-slash");
assertEq("duplicate lang same", classify("/es/es/blog"), "duplicate-lang-prefix");
assertEq("duplicate lang cross", classify("/en/es/blog/foo"), "duplicate-lang-prefix");
assertEq("not duplicate (one lang)", classify("/es/blog"), null);

// 2. Sitemap extractor surfaces <loc> and alternates.
const dirtyXml = `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://exentax.com/es/blog/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://exentax.com/en//blog"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://exentax.com/es/blog"/>
  </url>
  <url>
    <loc>https://exentax.com/es/es/blog/foo</loc>
  </url>
</urlset>`;
const dirtyHrefs = extractSitemapHrefs(dirtyXml);
const dirtyKinds = dirtyHrefs.map((h) => {
  const p = pathFromHref(h);
  return p ? classify(p) : "ignored";
});
assertEq("dirty sitemap kinds", dirtyKinds, [
  "trailing-slash",
  "duplicate-lang-prefix",
  "double-slash",
  null,
]);

const cleanXml = `<urlset xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://exentax.com/es/blog</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://exentax.com/en/blog"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://exentax.com/es/blog"/>
  </url>
</urlset>`;
const cleanFlagged = extractSitemapHrefs(cleanXml)
  .map((h) => classify(pathFromHref(h) || ""))
  .filter(Boolean);
assertEq("clean sitemap → no flags", cleanFlagged, []);

// 3. Host filter — third party URLs are ignored, BASE_URL host is allowed.
assertEq("third party ignored", pathFromHref("https://google.com/es//blog"), null);
assertEq("first party kept", pathFromHref("https://exentax.com/es//blog"), "/es//blog");
assertEq("base url host kept", pathFromHref("http://localhost:5000/es/", "http://localhost:5000"), "/es/");
assertEq("base url host but other host ignored", pathFromHref("http://other:5000/es/", "http://localhost:5000"), null);
assertEq("relative path kept", pathFromHref("/es/blog/"), "/es/blog/");
assertEq("protocol-relative ignored", pathFromHref("//cdn.example.com/x"), null);
assertEq("non-http scheme ignored", pathFromHref("mailto:foo@bar.com"), null);

if (fails.length) {
  console.error(`\nFAIL — ${fails.length} assertion(s):`);
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nOK — slash hygiene self-tests passed.");
