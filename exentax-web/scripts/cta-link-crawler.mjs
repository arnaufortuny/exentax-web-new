#!/usr/bin/env node
/**
 * cta-link-crawler — Live HTTP + static route consistency crawler
 * for the 6 supported locales (Task #19, step 3).
 *
 * Three checks:
 *
 *  (A) STATIC route-key consistency. Every entry in `ROUTE_SLUGS`
 *      from `shared/routes.ts` must define a slug for all 6
 *      locales (es / en / fr / de / pt / ca). A missing slug means
 *      the language switcher would point at an undefined URL.
 *
 *  (B) DISCOVERED-LINK consistency. The crawler reads the inventory
 *      produced by `cta-inventory.mjs` (regenerating it if missing)
 *      and, for every internal `<Link href={lp("KEY")}>` actually
 *      rendered by the codebase, asserts the route key exists in
 *      `ROUTE_SLUGS` for *all* 6 locales. This catches the FAQ
 *      `lp("booking")` ↔ `lp("book")` class of bugs where a
 *      component drifts out of sync with the registry — the broken
 *      link is invisible to (A) because the registry is fine.
 *      Plain absolute hrefs starting with `/` are recorded as
 *      language-agnostic targets and HTTP-checked too.
 *
 *  (C) LIVE HTTP smoke check. For every (registered route ∪
 *      discovered route) × locale, plus every literal `/blog/...`
 *      destination found by the inventory and a sample of 3 blog
 *      posts per language, we fetch `${BASE_URL}${path}` and assert
 *      the dev server replies < 400. Because the dev server is a
 *      Vite SPA fallback (it returns the shell for any path the
 *      Express layer hasn't claimed) this catches:
 *        - missing static asset routes
 *        - 5xx from server middleware
 *        - locale segments the Express layer rejects (e.g. via i18n
 *          guard middleware).
 *
 * Outputs (always written, even on success):
 *   reports/cta-crawler.json
 *   reports/cta-crawler.md
 *
 * Exit code: 1 if any HTTP failure, missing locale slug, or
 * discovered route key missing from `ROUTE_SLUGS`. Else 0.
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node scripts/cta-link-crawler.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];
const OUT_DIR = path.join(ROOT, "reports");
const BLOG_SAMPLE_PER_LANG = 3;
const HTTP_CONCURRENCY = 8;

async function loadRouteSlugs() {
  const src = await fs.readFile(path.join(ROOT, "shared/routes.ts"), "utf8");
  const block = src.match(/export const ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\}\s*(?:as const)?\s*;/);
  if (!block) throw new Error("ROUTE_SLUGS block not found");
  const body = block[1];
  // Match `key: { es: "x", en: "y", ... }` (multiline).
  const out = {};
  const entryRe = /^\s*([A-Za-z0-9_]+):\s*\{([^}]*)\}/gm;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    const key = m[1];
    const inner = m[2];
    const langs = {};
    const re = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let lm;
    while ((lm = re.exec(inner)) !== null) langs[lm[1]] = lm[2];
    out[key] = langs;
  }
  return out;
}

async function listBlogSlugs() {
  const dir = path.join(ROOT, "client/src/data/blog-content");
  const out = {};
  for (const lang of LOCALES) {
    const langDir = path.join(dir, lang);
    try {
      const files = await fs.readdir(langDir);
      out[lang] = files.filter((f) => f.endsWith(".ts")).map((f) => f.replace(/\.ts$/, ""));
    } catch {
      out[lang] = [];
    }
  }
  return out;
}

async function pHead(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual", headers: { "user-agent": "exentax-cta-crawler/1.0" } });
    return { status: res.status };
  } catch (e) {
    return { status: 0, error: e.message };
  }
}

async function runWithConcurrency(items, fn, concurrency) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function loadInventory() {
  // Prefer the existing inventory artifact (single source of truth);
  // regenerate it on demand if missing so the crawler is self-sufficient
  // in CI.
  const file = path.join(ROOT, "reports/cta-inventory.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    const { spawnSync } = await import("node:child_process");
    spawnSync(process.execPath, [path.join(ROOT, "scripts/cta-inventory.mjs")], { stdio: "inherit", cwd: ROOT });
    return JSON.parse(await fs.readFile(file, "utf8"));
  }
}

function classifyDestination(dest) {
  // The inventory stores either a route key (`book`, `legal_privacy`),
  // a literal blog path (`/blog`, `/blog/foo`), an absolute path
  // (`/something`), or `wa.me?text=...` / `mailto`. We only want
  // language-prefixable destinations here.
  if (!dest || dest === "—") return null;
  if (dest.startsWith("wa.me") || dest === "mailto") return null;
  if (dest.startsWith("/blog")) return { kind: "literal_blog", path: dest };
  if (dest.startsWith("/")) return { kind: "absolute", path: dest };
  if (/^[a-z][a-z0-9_]*$/.test(dest)) return { kind: "route_key", key: dest };
  return null;
}

async function crawl() {
  const routes = await loadRouteSlugs();
  const blogSlugs = await listBlogSlugs();
  const inventory = await loadInventory();
  const findings = [];

  // (A) Static consistency: every registered key must define all 6 locales.
  for (const [key, langs] of Object.entries(routes)) {
    for (const lang of LOCALES) {
      if (!(lang in langs)) {
        findings.push({ severity: "broken", kind: "missing_locale", route: key, lang });
      }
    }
  }

  // (B) Discovered-link consistency: every route key actually used by
  //     a `<Link href={lp("KEY")}>` in the codebase must exist in the
  //     registry for all 6 locales. Catches the FAQ
  //     `lp("booking")` ↔ `lp("book")` regression.
  const discoveredKeys = new Set();
  const discoveredAbsolute = new Set();
  const discoveredLiteralBlog = new Set();
  for (const row of inventory) {
    if (row.type !== "link") continue;
    const c = classifyDestination(row.destination);
    if (!c) continue;
    if (c.kind === "route_key") discoveredKeys.add(c.key);
    else if (c.kind === "absolute") discoveredAbsolute.add(c.path);
    else if (c.kind === "literal_blog") discoveredLiteralBlog.add(c.path);
  }
  for (const key of discoveredKeys) {
    if (!routes[key]) {
      const where = inventory
        .filter((r) => r.type === "link" && r.destination === key)
        .map((r) => `${r.file}:${r.line}`);
      findings.push({
        severity: "broken",
        kind: "unknown_route_key",
        route: key,
        lang: "*",
        msg: `discovered <Link href={lp("${key}")}> but key is not in ROUTE_SLUGS`,
        where,
      });
      continue;
    }
    for (const lang of LOCALES) {
      if (!(lang in routes[key])) {
        findings.push({
          severity: "broken",
          kind: "discovered_missing_locale",
          route: key,
          lang,
          msg: `<Link href={lp("${key}")}> renders, but ROUTE_SLUGS["${key}"] is missing ${lang}`,
        });
      }
    }
  }

  // (C) Live smoke check — registered routes ∪ discovered route keys
  //     ∪ discovered absolute paths ∪ literal /blog destinations
  //     ∪ sampled blog posts.
  const targets = [];
  const seen = new Set();
  function add(t) {
    const k = `${t.lang}|${t.path}`;
    if (seen.has(k)) return;
    seen.add(k);
    targets.push(t);
  }
  for (const [key, langs] of Object.entries(routes)) {
    for (const lang of LOCALES) {
      const slug = langs[lang];
      if (slug === undefined) continue;
      const p = slug ? `/${lang}/${slug}` : `/${lang}`;
      add({ kind: "route", key, lang, path: p });
    }
  }
  for (const key of discoveredKeys) {
    if (!routes[key]) continue; // already flagged above
    for (const lang of LOCALES) {
      const slug = routes[key][lang];
      if (slug === undefined) continue;
      const p = slug ? `/${lang}/${slug}` : `/${lang}`;
      add({ kind: "discovered_route", key, lang, path: p });
    }
  }
  for (const lang of LOCALES) {
    for (const p of discoveredAbsolute) add({ kind: "discovered_absolute", key: p, lang, path: p });
    for (const p of discoveredLiteralBlog) add({ kind: "discovered_blog_index", key: p, lang, path: `/${lang}${p}` });
    const slugs = blogSlugs[lang].slice(0, BLOG_SAMPLE_PER_LANG);
    for (const slug of slugs) add({ kind: "blog_post", key: "blogPost", lang, path: `/${lang}/blog/${slug}` });
  }

  const httpResults = await runWithConcurrency(
    targets,
    async (t) => ({ t, r: await pHead(`${BASE}${t.path}`) }),
    HTTP_CONCURRENCY,
  );

  for (const { t, r } of httpResults) {
    if (r.status === 0 || r.status >= 400) {
      findings.push({ severity: "broken", kind: t.kind, route: t.key, lang: t.lang, path: t.path, status: r.status, error: r.error });
    }
  }

  return {
    base: BASE,
    locales: LOCALES,
    routeKeyCount: Object.keys(routes).length,
    discoveredRouteKeyCount: discoveredKeys.size,
    discoveredAbsoluteCount: discoveredAbsolute.size,
    blogSlugCounts: Object.fromEntries(LOCALES.map((l) => [l, blogSlugs[l].length])),
    httpChecked: targets.length,
    findings,
  };
}

function toMd(result) {
  const broken = result.findings.filter((f) => f.severity === "broken");
  const lines = [
    "# Internal link crawler",
    "",
    `_Base: \`${result.base}\` · locales: ${result.locales.join(", ")} · registered route keys: ${result.routeKeyCount} · discovered route keys: ${result.discoveredRouteKeyCount} · discovered absolute paths: ${result.discoveredAbsoluteCount} · HTTP checks: ${result.httpChecked}_`,
    "",
    "Blog post counts per language:",
    "",
    ...Object.entries(result.blogSlugCounts).map(([l, n]) => `- ${l}: ${n}`),
    "",
    `**Findings:** broken=${broken.length}`,
    "",
  ];
  if (broken.length) {
    lines.push("## BROKEN", "");
    for (const f of broken) {
      const meta = [f.lang, f.route, f.path, f.status ? `HTTP ${f.status}` : f.error, f.msg, f.where ? `at ${f.where.join(", ")}` : null].filter(Boolean).join(" · ");
      lines.push(`- ${f.kind} — ${meta}`);
    }
  } else {
    lines.push("All registered + discovered routes resolve across the 6 locales and the sampled blog posts return < 400. ✅");
  }
  return lines.join("\n") + "\n";
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const result = await crawl();
  await fs.writeFile(path.join(OUT_DIR, "cta-crawler.json"), JSON.stringify(result, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "cta-crawler.md"), toMd(result));
  const broken = result.findings.filter((f) => f.severity === "broken").length;
  console.log(`[cta-crawler] httpChecked=${result.httpChecked} broken=${broken}`);
  console.log(`[cta-crawler] wrote reports/cta-crawler.{json,md}`);
  process.exit(broken ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(2); });
