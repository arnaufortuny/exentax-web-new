/*
 * legacy-redirects.test.mjs
 * ----------------------------------------------------------------------------
 * Smoke tests for the legacy 301-redirect middleware.
 *
 * Verifies:
 *   1. A known mapping (`/blog`) issues a 301 with the expected Location.
 *   2. A {lang} parametric entry expands and matches per-language.
 *   3. A regex entry rewrites with backref substitution.
 *   4. Unknown paths fall through (next() called, no redirect).
 *   5. Non-GET/HEAD methods fall through even on a known mapping (so a 301
 *      can never silently turn a POST into a GET replay).
 *
 * Uses node:test so the suite integrates with `npm run check` without adding
 * any new runtime dep.
 * ----------------------------------------------------------------------------
 */

import { test } from "node:test";
import assert from "node:assert/strict";

// The runner is invoked via `node --import tsx` (see npm script
// `test:redirects`) so the .ts middleware can be imported directly without
// a manual loader.register call.
const { createLegacyRedirects, compileRedirectMap, resolveRedirect } =
  await import("../server/middleware/legacy-redirects.ts");

/** Build a minimal Express-shaped mock request/response/next triple. */
function mockTriple({ method = "GET", path: reqPath = "/", originalUrl } = {}) {
  const req = { method, path: reqPath, originalUrl: originalUrl ?? reqPath };
  const res = {
    _status: null,
    _location: null,
    redirect(status, location) {
      this._status = status;
      this._location = location;
      return this;
    },
  };
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };
  return { req, res, next, getNextCalled: () => nextCalled };
}

test("compileRedirectMap expands {lang} into 6 entries", () => {
  const compiled = compileRedirectMap({
    "/{lang}/blog/index": "/{lang}/blog",
  });
  for (const lang of ["es", "en", "fr", "de", "pt", "ca"]) {
    assert.equal(compiled.exact.get(`/${lang}/blog/index`), `/${lang}/blog`);
  }
});

test("compileRedirectMap skips _doc and array values", () => {
  const compiled = compileRedirectMap({
    _doc: ["a comment"],
    _notes: "skipped too because key starts with underscore",
    "/foo": "/bar",
  });
  assert.equal(compiled.exact.size, 1);
  assert.equal(compiled.exact.get("/foo"), "/bar");
});

test("resolveRedirect is case-insensitive", () => {
  const compiled = compileRedirectMap({ "/Old-Path": "/new-path" });
  assert.equal(resolveRedirect("/old-path", compiled), "/new-path");
  assert.equal(resolveRedirect("/OLD-PATH", compiled), "/new-path");
});

test("resolveRedirect handles regex entries with backrefs", () => {
  const compiled = compileRedirectMap({
    "old-llc": {
      pattern: "^/old-llc-(\\w+)$",
      replacement: "/es/blog/llc-$1",
    },
  });
  assert.equal(resolveRedirect("/old-llc-wyoming", compiled), "/es/blog/llc-wyoming");
  assert.equal(resolveRedirect("/unrelated", compiled), null);
});

test("middleware: known mapping returns 301 with expected Location", () => {
  const mw = createLegacyRedirects({ "/blog": "/es/blog" });
  const { req, res, next, getNextCalled } = mockTriple({ path: "/blog" });
  mw(req, res, next);
  assert.equal(res._status, 301);
  assert.equal(res._location, "/es/blog");
  assert.equal(getNextCalled(), false);
});

test("middleware: preserves query string on redirect", () => {
  const mw = createLegacyRedirects({ "/blog": "/es/blog" });
  const { req, res, next } = mockTriple({
    path: "/blog",
    originalUrl: "/blog?utm_source=newsletter",
  });
  mw(req, res, next);
  assert.equal(res._status, 301);
  assert.equal(res._location, "/es/blog?utm_source=newsletter");
});

test("middleware: unknown path falls through (calls next, no redirect)", () => {
  const mw = createLegacyRedirects({ "/blog": "/es/blog" });
  const { req, res, next, getNextCalled } = mockTriple({ path: "/some/other/path" });
  mw(req, res, next);
  assert.equal(res._status, null);
  assert.equal(res._location, null);
  assert.equal(getNextCalled(), true);
});

test("middleware: non-GET/HEAD method falls through even on known mapping", () => {
  const mw = createLegacyRedirects({ "/blog": "/es/blog" });
  const { req, res, next, getNextCalled } = mockTriple({
    method: "POST",
    path: "/blog",
  });
  mw(req, res, next);
  assert.equal(res._status, null);
  assert.equal(getNextCalled(), true);
});

test("middleware: default JSON map contains the seeded /blog rule", async () => {
  // Smoke-test the real on-disk JSON loads and contains the seed entries
  // documented in the spec (so a typo in legacy-redirects.json fails CI).
  const mw = createLegacyRedirects();
  const { req, res, next } = mockTriple({ path: "/blog" });
  mw(req, res, next);
  assert.equal(res._status, 301);
  assert.equal(res._location, "/es/blog");
});
