/*
 * get-equivalent-url.test.mjs
 * ----------------------------------------------------------------------------
 * Regression tests for `getEquivalentUrl()` in `shared/routes.ts`.
 *
 * Background: wouter's `useLocation()` only exposes the pathname, so the
 * language switcher used to drop `?query` and `#hash` when changing locale.
 * The fix introduces a single helper that both switcher entry points
 * (LanguageSwitcher.tsx desktop + the inline mobile switcher in Navbar.tsx)
 * call. These tests pin its behaviour so neither can drift.
 *
 * Run via `node --import tsx exentax-web/tests/get-equivalent-url.test.mjs`.
 * Wired into `npm run test:redirects` (see package.json).
 * ----------------------------------------------------------------------------
 */

import { test } from "node:test";
import assert from "node:assert/strict";

const { getEquivalentUrl, getEquivalentPath } = await import(
  "../shared/routes.ts"
);

test("preserves both query string and hash when switching locales", () => {
  // /es/preguntas-frecuentes?utm=foo#bar → /en/faq?utm=foo#bar
  const out = getEquivalentUrl(
    "/es/preguntas-frecuentes",
    "en",
    "?utm=foo",
    "#bar",
  );
  assert.equal(out, "/en/faq?utm=foo#bar");
});

test("preserves hash alone (the #calculadora homepage anchor)", () => {
  const out = getEquivalentUrl("/es", "de", "", "#calculadora");
  assert.equal(out, "/de#calculadora");
});

test("preserves query alone", () => {
  const out = getEquivalentUrl("/es/agendar", "fr", "?ref=newsletter", "");
  assert.equal(out, "/fr/reserver?ref=newsletter");
});

test("falls back gracefully when search/hash are omitted", () => {
  const out = getEquivalentUrl("/es/agendar", "ca");
  assert.equal(out, "/ca/agendar");
  assert.equal(out, getEquivalentPath("/es/agendar", "ca"));
});

test("blog routes preserve sub-slug + query/hash", () => {
  const out = getEquivalentUrl(
    "/es/blog/abrir-llc-eua",
    "pt",
    "?utm=x",
    "#section",
  );
  assert.equal(out, "/pt/blog/abrir-llc-eua?utm=x#section");
});
