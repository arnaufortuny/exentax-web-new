#!/usr/bin/env node
/*
 * seo-stray-slash-redirect.test.mjs
 * ----------------------------------------------------------------------------
 * Self-tests for `canonicalizeStraySlashPath` (the server middleware that
 * 301-redirects stray-slash URLs to their canonical form — see
 * docs/seo/url-slash-policy.md).
 *
 * The function is re-implemented inline here (mirrors `server/index.ts`) to
 * keep this a fast, dependency-free Node script in the same style as the
 * sibling `seo-slash-hygiene.test.mjs`. The two implementations must stay
 * byte-equivalent.
 *
 * Covers each of the three slash-bug families plus a few clean URLs that
 * must NOT redirect.
 * ----------------------------------------------------------------------------
 */

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];
const DUP_LANG_RE = new RegExp(`^/(${LANGS.join("|")})/(${LANGS.join("|")})(/|$)`);

function canonicalize(p) {
  let out = p;
  if (out.includes("//")) out = out.replace(/\/{2,}/g, "/");
  const m = out.match(DUP_LANG_RE);
  if (m) out = out.slice(("/" + m[1]).length);
  if (out.length > 1 && out.endsWith("/")) {
    out = out.replace(/\/+$/, "") || "/";
  }
  return out === p ? null : out;
}

const fails = [];
function assertEq(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "✓" : "✗"} ${label}  got=${JSON.stringify(got)}  want=${JSON.stringify(want)}`);
  if (!ok) fails.push(label);
}

// 1. Trailing slash family.
assertEq("trailing slash on /es/",        canonicalize("/es/"),                "/es");
assertEq("trailing slash on blog index",  canonicalize("/en/blog/"),           "/en/blog");
assertEq("trailing slash on blog post",   canonicalize("/de/blog/some-slug/"), "/de/blog/some-slug");

// 2. Double-slash family.
assertEq("double slash mid path",         canonicalize("/es//blog"),           "/es/blog");
assertEq("triple slash mid path",         canonicalize("/es///blog/foo"),      "/es/blog/foo");
assertEq("double slash + trailing",       canonicalize("/es//blog/"),          "/es/blog");

// 3. Duplicated language prefix family.
assertEq("dup lang same",                 canonicalize("/es/es/blog"),         "/es/blog");
assertEq("dup lang cross",                canonicalize("/en/es/blog/foo"),     "/es/blog/foo");
assertEq("dup lang at root",              canonicalize("/es/es"),              "/es");

// 4. Combined breakage gets normalised in one pass.
assertEq("combined: dup + trailing",      canonicalize("/es/es/blog/"),        "/es/blog");
assertEq("combined: double + dup",        canonicalize("/es//es/blog"),        "/es/blog");

// 5. Clean URLs must NOT redirect (function returns null).
assertEq("root unchanged",                canonicalize("/"),                   null);
assertEq("clean lang root",               canonicalize("/es"),                 null);
assertEq("clean blog index",              canonicalize("/en/blog"),            null);
assertEq("clean blog post",               canonicalize("/fr/blog/le-slug"),    null);
assertEq("clean nested",                  canonicalize("/es/legal/terminos"),  null);

if (fails.length) {
  console.error(`\nFAIL — ${fails.length} assertion(s):`);
  for (const f of fails) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nOK — stray-slash redirect self-tests passed.");
