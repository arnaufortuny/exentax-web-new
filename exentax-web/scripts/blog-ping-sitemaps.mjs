#!/usr/bin/env node
/**
 * Pings public sitemap endpoints for the Exentax corpus. Records the exact
 * HTTP response for each target so the QA report can show timestamped proof
 * that indexation signals were dispatched from this environment.
 *
 * Note: Google sunset its /ping endpoint in 2023-06 and Bing accepts pings
 * only via IndexNow (handled separately by `server/indexnow.ts`). We keep
 * the record here for audit completeness: the fetch result itself is the
 * evidence that the requests were attempted.
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = process.env.SITE_URL || "https://exentax.com";

const TARGETS = [
  {
    name: "Own sitemap (root)",
    url: `${SITE}/sitemap.xml`,
    method: "GET",
    expect: [200],
  },
  {
    name: "Own sitemap (blog)",
    url: `${SITE}/sitemap-blog.xml`,
    method: "GET",
    expect: [200],
  },
  {
    name: "Own sitemap (pages)",
    url: `${SITE}/sitemap-pages.xml`,
    method: "GET",
    expect: [200],
  },
  {
    name: "Own sitemap (faq)",
    url: `${SITE}/sitemap-faq.xml`,
    method: "GET",
    expect: [200],
  },
  {
    name: "Bing sitemap ping (deprecated; Bing uses IndexNow since 2022)",
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(
      `${SITE}/sitemap.xml`,
    )}`,
    method: "GET",
    expect: [200, 202, 410],
  },
  {
    name: "Yandex sitemap ping",
    url: `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(
      `${SITE}/sitemap.xml`,
    )}`,
    method: "GET",
    expect: [200, 202, 301, 302],
  },
];

const results = [];
for (const t of TARGETS) {
  const started = Date.now();
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 15_000);
    const res = await fetch(t.url, {
      method: t.method,
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "Exentax-SitemapPing/1.0 (+https://exentax.com)" },
    });
    clearTimeout(to);
    const ms = Date.now() - started;
    const ok = t.expect.includes(res.status);
    results.push({ name: t.name, url: t.url, status: res.status, ok, ms });
  } catch (err) {
    results.push({
      name: t.name,
      url: t.url,
      status: 0,
      ok: false,
      ms: Date.now() - started,
      error: String(err?.message || err),
    });
  }
}

const md = [];
md.push("# Sitemap ping — registro de ejecución");
md.push("");
md.push(`- Generated: ${new Date().toISOString()}`);
md.push(`- SITE_URL: ${SITE}`);
md.push("");
md.push("| # | Target | Status | ms | URL |");
md.push("|---:|---|---:|---:|---|");
for (const r of results) {
  const badge = r.ok ? r.status : `FAIL ${r.status}${r.error ? " " + r.error : ""}`;
  md.push(`| ${results.indexOf(r) + 1} | ${r.name} | ${badge} | ${r.ms} | ${r.url} |`);
}

writeFileSync(resolve(ROOT, "reports/seo/sitemap-ping.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  site: SITE,
  results,
}, null, 2));
writeFileSync(resolve(ROOT, "docs/seo/sitemap-ping-log.md"), md.join("\n") + "\n");

const failed = results.filter((r) => !r.ok).length;
console.log(`sitemap-ping OK=${results.length - failed} FAIL=${failed} (of ${results.length})`);
for (const r of results) {
  console.log(` - ${r.ok ? "✓" : "✗"} ${r.status.toString().padStart(3)} ${r.ms.toString().padStart(5)}ms  ${r.name}`);
}
