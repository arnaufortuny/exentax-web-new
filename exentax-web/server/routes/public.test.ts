#!/usr/bin/env tsx
/*
 * public.test.ts
 * ---------------------------------------------------------------------------
 * Integration tests for `registerPublicRoutes` (NOT a stubbed copy):
 *
 *   1. `BLOG_CONSOLIDATION_REDIRECTS` shape is `Record<string, string>` and
 *      every canonical target resolves to a real `BLOG_POSTS` entry.
 *
 *   2. Behavioural: registers the actual production routes via
 *      `registerPublicRoutes(app)`, seeds an editorial entry through the
 *      test-only helper `__setConsolidationRedirectForTest`, and asserts
 *      the 301 + localized `Location` header in every supported language.
 *
 *   3. `relatedSlugs` integrity at runtime: every slug declared as a
 *      `relatedSlugs` reference resolves to a real `BLOG_POSTS` entry —
 *      mirrors the build-time check in `seo-related-validate.mjs`.
 *
 * Run with `npx tsx exentax-web/server/routes/public.test.ts`. Exits 0 on
 * success, 1 on first failure so it slots straight into CI.
 * ---------------------------------------------------------------------------
 */
import express from "express";
import http from "node:http";
import { AddressInfo } from "node:net";
import {
  BLOG_CONSOLIDATION_REDIRECTS,
  registerPublicRoutes,
  __setConsolidationRedirectForTest,
} from "./public.js";
import { BLOG_POSTS } from "../../client/src/data/blog-posts.js";
import { SUPPORTED_LANGS } from "../../shared/routes.js";
import { BLOG_SLUG_LEGACY_I18N, getTranslatedSlug } from "../../client/src/data/blog-posts-slugs.js";

let failures = 0;
function ok(name: string, cond: unknown, detail?: string) {
  if (cond) {
    console.log(`  ✓ ${name}`);
  } else {
    failures++;
    console.error(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}

async function main() {
  console.log("public.ts — integration: editorial redirects + related-slug integrity");

  // 1. Shape of consolidation map.
  ok("BLOG_CONSOLIDATION_REDIRECTS is an object", typeof BLOG_CONSOLIDATION_REDIRECTS === "object" && BLOG_CONSOLIDATION_REDIRECTS !== null);
  ok("all entries map string → string", Object.entries(BLOG_CONSOLIDATION_REDIRECTS).every(([k, v]) => typeof k === "string" && typeof v === "string"));

  const knownSlugs = new Set(BLOG_POSTS.map(p => p.slug));
  for (const [from, to] of Object.entries(BLOG_CONSOLIDATION_REDIRECTS)) {
    ok(`canonical "${to}" (from "${from}") exists in BLOG_POSTS`, knownSlugs.has(to));
  }

  // 2. Spin up the REAL production routes and seed a temporary entry.
  // Pick two real slugs so the slug-translation lookup can resolve in every
  // supported language; we use the alphabetically first two as a stable choice.
  const realSlugs = [...knownSlugs].sort();
  const fromSlug = realSlugs[0];
  const toSlug = realSlugs[1];
  __setConsolidationRedirectForTest(fromSlug, toSlug);

  const app = express();
  registerPublicRoutes(app);
  const server = http.createServer(app);
  await new Promise<void>(resolve => server.listen(0, resolve));
  const port = (server.address() as AddressInfo).port;

  async function fetchHead(p: string) {
    return new Promise<{ status: number; location?: string }>((resolve, reject) => {
      http.get({ host: "127.0.0.1", port, path: p }, res => {
        resolve({ status: res.statusCode || 0, location: res.headers.location });
        res.resume();
      }).on("error", reject);
    });
  }

  // 2a. The deprecated slug must 301 in every supported language.
  for (const lang of SUPPORTED_LANGS) {
    const r = await fetchHead(`/${lang}/blog/${fromSlug}`);
    ok(`[${lang}] deprecated slug → 301`, r.status === 301, `got status ${r.status}`);
    ok(`[${lang}] Location is /${lang}/blog/<canonical-or-localized>`,
      typeof r.location === "string" && r.location.startsWith(`/${lang}/blog/`),
      `got ${r.location}`);
  }

  // 2b. A non-deprecated slug (the canonical itself) must NOT 301 to itself
  //     via the consolidation handler — the slug-normalization layer may
  //     still return 301 to a localized variant, so we accept either 200
  //     (when ES requested) or 301 to a different slug under same lang.
  const rNonDep = await fetchHead(`/es/blog/${toSlug}`);
  // The canonical slug must not 301 back to itself (no infinite loop). Any
  // status is acceptable except a 301 whose Location equals the request path.
  ok("non-deprecated canonical slug does not loop", !(rNonDep.status === 301 && rNonDep.location === `/es/blog/${toSlug}`), `got ${rNonDep.status} ${rNonDep.location}`);

  // 2c. An unknown slug falls through (404 or next handler).
  const rUnknown = await fetchHead(`/es/blog/this-slug-definitely-does-not-exist`);
  ok("unknown slug falls through (no 301)", rUnknown.status !== 301, `got ${rUnknown.status} ${rUnknown.location}`);

  // Cleanup: remove the seeded entry so subsequent tests / processes are
  // unaffected by our mutation.
  __setConsolidationRedirectForTest(fromSlug, null);

  // 2d. Legacy localized slugs (audit pass 8 — slug shortening): every entry
  // in BLOG_SLUG_LEGACY_I18N must 301 to the current canonical localized slug
  // for the same article. Sample up to 12 entries to keep the test fast while
  // still covering all 5 non-ES languages.
  const legacyEntries = Object.entries(BLOG_SLUG_LEGACY_I18N);
  const seenLangs = new Set<string>();
  const sample: Array<[string, { es: string; lang: string }]> = [];
  for (const e of legacyEntries) {
    if (sample.length >= 12) break;
    if (seenLangs.size < 5 && seenLangs.has(e[1].lang)) continue;
    seenLangs.add(e[1].lang);
    sample.push(e as [string, { es: string; lang: string }]);
  }
  for (const [oldSlug, entry] of sample) {
    const canonical = getTranslatedSlug(entry.es, entry.lang);
    if (canonical === oldSlug) continue; // nothing to assert.
    const r = await fetchHead(`/${entry.lang}/blog/${oldSlug}`);
    ok(`[${entry.lang}] legacy slug "${oldSlug.slice(0, 40)}…" → 301`,
      r.status === 301, `got ${r.status}`);
    ok(`[${entry.lang}] legacy → canonical localized`,
      r.location === `/${entry.lang}/blog/${canonical}`,
      `got ${r.location}`);
  }

  await new Promise<void>(resolve => server.close(() => resolve()));

  // 3. relatedSlugs integrity (mirrors seo-related-validate.mjs at runtime).
  let badRelated = 0;
  for (const p of BLOG_POSTS) {
    for (const r of p.relatedSlugs || []) {
      if (!knownSlugs.has(r)) { badRelated++; console.error(`  ✗ ${p.slug} → relatedSlug "${r}" not in BLOG_POSTS`); }
    }
  }
  ok("every relatedSlug resolves to a real post", badRelated === 0, `${badRelated} broken refs`);

  console.log(failures === 0 ? "\nAll public.ts tests passed." : `\n${failures} failure(s).`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => { console.error(err); process.exit(1); });
