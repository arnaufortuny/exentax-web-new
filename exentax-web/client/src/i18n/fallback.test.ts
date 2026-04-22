#!/usr/bin/env tsx
/*
 * Tests for the i18n missing-key fallback contract (Task #24):
 *   1. lookupEsEmergency(key) — direct ES lookup
 *   2. humaniseKey(key)       — last-resort cosmetic rendering
 * The raw dotted key must never reach the user.
 *
 * Run: npx tsx client/src/i18n/fallback.test.ts (exits 1 on failure).
 */

interface BrowserGlobals {
  localStorage?: { getItem: (k: string) => null; setItem: () => void; removeItem: () => void };
  window?: { navigator: { language: string } };
  navigator?: { language: string };
  document?: { documentElement: { lang: string } };
}
const g = globalThis as BrowserGlobals & typeof globalThis;
g.localStorage ??= { getItem: () => null, setItem: () => undefined, removeItem: () => undefined };
g.navigator ??= { language: "es" };
g.window ??= { navigator: g.navigator };
g.document ??= { documentElement: { lang: "es" } };

const { lookupEsEmergency, humaniseKey } = await import("./index");
const es = (await import("./locales/es")).default as Record<string, unknown>;

type Result = { name: string; ok: boolean; detail?: string };
const results: Result[] = [];

function assertEq(name: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  results.push({ name, ok, detail: ok ? undefined : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}` });
}
function assertTruthy(name: string, actual: unknown) {
  results.push({ name, ok: Boolean(actual), detail: actual ? undefined : `expected truthy, got ${JSON.stringify(actual)}` });
}

const esNavHome = (es.nav as Record<string, string> | undefined)?.home;
assertTruthy("es bundle exposes nav.home", esNavHome);
assertEq("lookupEsEmergency('nav.home') === es.nav.home", lookupEsEmergency("nav.home"), esNavHome);
assertEq("lookupEsEmergency on missing key → undefined", lookupEsEmergency("totally.bogus.key"), undefined);

const deep = (((es.faqData as Record<string, unknown>)?.answers) as Record<string, string> | undefined)?.tax_7;
assertTruthy("es bundle exposes faqData.answers.tax_7", deep);
assertEq("lookupEsEmergency on deep nested key", lookupEsEmergency("faqData.answers.tax_7"), deep);
assertEq("lookupEsEmergency on object leaf → undefined", lookupEsEmergency("nav"), undefined);

assertEq("humaniseKey('cookie.policyLink')", humaniseKey("cookie.policyLink"), "Policy Link");
assertEq("humaniseKey('faq.tax_7')", humaniseKey("faq.tax_7"), "Tax 7");
assertEq("humaniseKey('foo.bar-baz')", humaniseKey("foo.bar-baz"), "Bar baz");
assertEq("humaniseKey('home')", humaniseKey("home"), "Home");
assertEq("humaniseKey('')", humaniseKey(""), "");

for (const k of ["a.b.c", "deep.nested.path.example", "single", "with.camelCaseLeaf"]) {
  const out = humaniseKey(k);
  results.push({ name: `humaniseKey('${k}') leaks no dots`, ok: !out.includes("."), detail: out.includes(".") ? `leaked: ${out}` : undefined });
}

const handlerLike = (key: string) => lookupEsEmergency(key) ?? humaniseKey(key);
assertTruthy("handler returns ES value for known key", handlerLike("nav.home"));
assertEq("handler humanises unknown key", handlerLike("brand.new.unseenKey"), "Unseen Key");
const totallyUnknown = handlerLike("not.a.real.key.at.all");
results.push({ name: "handler never returns raw dotted key", ok: !totallyUnknown.includes("."), detail: totallyUnknown.includes(".") ? `leaked: ${totallyUnknown}` : undefined });

const failed = results.filter((r) => !r.ok);
const passed = results.length - failed.length;
console.log("\ni18n fallback contract — test results");
console.log("─".repeat(60));
for (const r of results) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? "  — " + r.detail : ""}`);
console.log("─".repeat(60));
console.log(`  ${passed}/${results.length} passed${failed.length ? `, ${failed.length} FAILED` : ""}\n`);
process.exit(failed.length ? 1 : 0);
