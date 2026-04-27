#!/usr/bin/env node
/*
 * geo-middleware.test.mjs
 * ----------------------------------------------------------------------------
 * Smoke tests for server/middleware/geo.ts (Task #11). Verifies the header
 * lookup order (cf-ipcountry > x-vercel-ip-country > fly-client-ip-country >
 * accept-language fallback) and the accept-language best-effort parser.
 * No external dependencies — built on `node:test` and `node:assert`.
 *
 * Run with: node exentax-web/tests/geo-middleware.test.mjs
 * ----------------------------------------------------------------------------
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const middlewarePath = path.resolve(__dirname, "../server/middleware/geo.ts");
// tsx may live in exentax-web/node_modules/.bin (when installed locally) or
// in the workspace root node_modules/.bin (when the workspace is hoisted).
// Probe both to keep the test resilient to either layout.
const tsxBin = (() => {
  const candidates = [
    path.resolve(__dirname, "../node_modules/.bin/tsx"),
    path.resolve(__dirname, "../../node_modules/.bin/tsx"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
})();

// Helper script invoked once per fixture via tsx so we can import the TS
// source without a build step. Reads the fixture from the GEO_FIXTURE env var
// (avoids any argv quoting issues across shells) and prints a JSON result.
const HELPER = `
import { resolveCountryFromHeaders, countryFromAcceptLanguage, geoMiddleware } from ${JSON.stringify(middlewarePath)};
const fixture = JSON.parse(process.env.GEO_FIXTURE || "{}");
const req = { headers: fixture.headers || {} };
const out = {
  fromHeaders: resolveCountryFromHeaders(req),
  fromAcceptLang: countryFromAcceptLanguage(fixture.headers && fixture.headers["accept-language"]),
};
let attached = null;
geoMiddleware(req, {}, () => { attached = req.geo; });
out.attached = attached;
process.stdout.write(JSON.stringify(out));
`;

function runFixture(headers) {
  const r = spawnSync(tsxBin, ["--eval", HELPER], {
    encoding: "utf8",
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, GEO_FIXTURE: JSON.stringify({ headers }) },
  });
  if (r.status !== 0) {
    throw new Error(`helper exited ${r.status}: ${r.stderr}`);
  }
  return JSON.parse(r.stdout);
}

test("cf-ipcountry resolves to ES", () => {
  const out = runFixture({ "cf-ipcountry": "ES" });
  assert.equal(out.fromHeaders, "ES");
  assert.deepEqual(out.attached, { country: "ES" });
});

test("x-vercel-ip-country resolves to MX", () => {
  const out = runFixture({ "x-vercel-ip-country": "MX" });
  assert.equal(out.fromHeaders, "MX");
});

test("fly-client-ip-country resolves to GB", () => {
  const out = runFixture({ "fly-client-ip-country": "GB" });
  assert.equal(out.fromHeaders, "GB");
});

test("cf-ipcountry takes precedence over x-vercel-ip-country", () => {
  const out = runFixture({ "cf-ipcountry": "FR", "x-vercel-ip-country": "DE" });
  assert.equal(out.fromHeaders, "FR");
});

test("x-vercel-ip-country takes precedence over fly-client-ip-country", () => {
  const out = runFixture({ "x-vercel-ip-country": "IT", "fly-client-ip-country": "BE" });
  assert.equal(out.fromHeaders, "IT");
});

test("accept-language es-ES,en;q=0.9 -> ES", () => {
  const out = runFixture({ "accept-language": "es-ES,en;q=0.9" });
  assert.equal(out.fromAcceptLang, "ES");
  assert.equal(out.fromHeaders, "ES");
});

test("accept-language pt-BR -> BR", () => {
  const out = runFixture({ "accept-language": "pt-BR" });
  assert.equal(out.fromAcceptLang, "BR");
  assert.equal(out.fromHeaders, "BR");
});

test("accept-language fr-FR,fr;q=0.8 -> FR", () => {
  const out = runFixture({ "accept-language": "fr-FR,fr;q=0.8" });
  assert.equal(out.fromAcceptLang, "FR");
});

test("accept-language with no region tag -> empty", () => {
  const out = runFixture({ "accept-language": "en" });
  assert.equal(out.fromAcceptLang, "");
});

test("empty headers -> empty country", () => {
  const out = runFixture({});
  assert.equal(out.fromHeaders, "");
  assert.deepEqual(out.attached, { country: "" });
});

test("malformed cf-ipcountry falls through to accept-language", () => {
  const out = runFixture({ "cf-ipcountry": "ZZZ", "accept-language": "de-DE" });
  assert.equal(out.fromHeaders, "DE");
});

test("lowercase header value is normalized to uppercase ISO code", () => {
  const out = runFixture({ "cf-ipcountry": "es" });
  assert.equal(out.fromHeaders, "ES");
});
