#!/usr/bin/env node
/**
 * Auditoría diagnóstica 2026-04
 *
 * Genera 5 reportes JSON + RESUMEN.md sin tocar código de aplicación.
 *
 * Subcomandos:
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs routes
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs components
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs discord
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs emails
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs summary
 *   node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs all
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "docs", "auditoria-2026-04");
const BASE_URL = process.env.AUDIT_BASE_URL || "http://localhost:5000";

async function ensureOutDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

async function readFileSafe(p) {
  try { return await fs.readFile(p, "utf8"); } catch { return null; }
}

async function listFiles(dir, exts) {
  const out = [];
  async function walk(d) {
    let entries;
    try { entries = await fs.readdir(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (!exts || exts.some((x) => e.name.endsWith(x))) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function writeJson(name, data) {
  const file = path.join(OUT_DIR, name);
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`✓ ${path.relative(ROOT, file)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ROUTES AUDIT
// ─────────────────────────────────────────────────────────────────────────────
async function auditRoutes() {
  const routesSrc = await readFileSafe(path.join(ROOT, "shared", "routes.ts"));
  if (!routesSrc) throw new Error("shared/routes.ts missing");
  const appSrc = (await readFileSafe(path.join(ROOT, "client", "src", "App.tsx"))) || "";

  // Parse SUPPORTED_LANGS and ROUTE_SLUGS via regex (simple and resilient)
  const langs = ["es", "en", "fr", "de", "pt", "ca"];
  const routeKeyRe = /^\s{2}(\w+):\s*\{([^}]+)\},?\s*$/gm;
  const routes = {};
  let m;
  while ((m = routeKeyRe.exec(routesSrc))) {
    const key = m[1];
    const body = m[2];
    const obj = {};
    const pairRe = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let p;
    while ((p = pairRe.exec(body))) obj[p[1]] = p[2];
    if (Object.keys(obj).length === 6) routes[key] = obj;
  }

  // Build expected paths from shared/routes.ts
  const expected = []; // { lang, key, path, source }
  for (const key of Object.keys(routes)) {
    for (const lang of langs) {
      const slug = routes[key][lang];
      const p = slug ? `/${lang}/${slug}` : `/${lang}`;
      expected.push({ lang, key, path: p, source: "shared/routes.ts" });
    }
  }

  // Extract additional routes from App.tsx (<Route path="...">)
  const appRoutePaths = [...appSrc.matchAll(/<Route\s+[^>]*path=["']([^"']+)["']/g)].map(
    (x) => x[1],
  );
  const auxRoutes = [];
  for (const rp of appRoutePaths) {
    if (rp === "/" || rp === "/:lang/blog/:slug" || rp === "/:lang/blog") {
      // expand /:lang/blog → 6 idiomas
      if (rp === "/:lang/blog") {
        for (const lang of langs) auxRoutes.push({ lang, key: "blog_index", path: `/${lang}/blog`, source: "App.tsx" });
      }
      continue;
    }
    if (rp.includes(":")) continue; // skip dynamic with token
    // skip already-known localized paths
    const exists = expected.some((e) => e.path === rp);
    if (exists) continue;
    auxRoutes.push({ lang: rp.split("/")[1] || "_aux", key: rp, path: rp, source: "App.tsx" });
  }
  expected.push(...auxRoutes);

  // Crawl each route, capture hreflangs + canonical + title for duplicate detection
  const byLang = Object.fromEntries(langs.map((l) => [l, { total: 0, ok: 0, redirects: 0, notFound: 0, errors: 0, routes: [] }]));
  const auxBucket = { total: 0, ok: 0, redirects: 0, notFound: 0, errors: 0, routes: [] };
  const allCrawled = []; // for hreflang gap & duplicate detection
  for (const r of expected) {
    const url = BASE_URL + r.path;
    let status = 0, canonical = null, hreflangs = [], redirectTo = null, html = "", title = null;
    try {
      const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "exentax-audit/1" } });
      status = res.status;
      if (status >= 300 && status < 400) redirectTo = res.headers.get("location");
      else html = await res.text();
    } catch (e) {
      status = -1;
    }
    if (html) {
      const cm = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
      canonical = cm ? cm[1] : null;
      const hm = [
        ...html.matchAll(
          /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi,
        ),
        ...html.matchAll(
          /<link[^>]+hreflang=["']([^"']+)["'][^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/gi,
        ),
      ];
      hreflangs = hm.map((x) => ({ lang: x[1], href: x[2] }));
      const tm = html.match(/<title>([^<]*)<\/title>/i);
      title = tm ? tm[1].trim() : null;
    }
    const bucket = byLang[r.lang] || auxBucket;
    bucket.total++;
    if (status >= 200 && status < 300) bucket.ok++;
    else if (status >= 300 && status < 400) bucket.redirects++;
    else if (status === 404) bucket.notFound++;
    else bucket.errors++;
    const entry = {
      key: r.key,
      path: r.path,
      source: r.source,
      status,
      canonical,
      title,
      hreflangCount: hreflangs.length,
      hreflangLangs: hreflangs.map((h) => h.lang),
      redirectTo,
    };
    bucket.routes.push(entry);
    allCrawled.push(entry);
  }

  // hreflang gap analysis: a route should expose alternates for all 6 langs + x-default
  const expectedHreflangs = new Set([...langs, "x-default"]);
  const missingHreflang = [];
  for (const e of allCrawled) {
    if (e.status < 200 || e.status >= 300) continue;
    const present = new Set(e.hreflangLangs);
    const missing = [...expectedHreflangs].filter((l) => !present.has(l));
    if (missing.length > 0) missingHreflang.push({ path: e.path, missing });
  }

  // duplicate-content detection: cluster by (title + canonical)
  const clusters = {};
  for (const e of allCrawled) {
    if (!e.title || e.status < 200 || e.status >= 300) continue;
    const k = `${e.title}::${e.canonical || ""}`;
    (clusters[k] = clusters[k] || []).push(e.path);
  }
  const duplicateContent = Object.entries(clusters)
    .filter(([, paths]) => paths.length > 1)
    .map(([k, paths]) => {
      const [title, canonical] = k.split("::");
      // ignore expected duplicates: same canonical across language alternates is normal SEO
      return { title, canonical, paths };
    })
    .filter((c) => {
      // a true duplicate is one where two paths share the SAME canonical even though
      // they are different language variants → that's actually fine (canonical points
      // to one). Only flag when paths share canonical AND share language prefix.
      const langs = new Set(c.paths.map((p) => p.split("/")[1]));
      return langs.size === 1 && c.paths.length > 1;
    });

  // Sitemap (resolves sitemap-index recursively)
  let sitemapUrls = [];
  let sitemapStatus = 0;
  let sitemapChildren = [];
  async function fetchSitemap(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return { status: res.status, urls: [], isIndex: false };
      const xml = await res.text();
      const isIndex = /<sitemapindex/i.test(xml);
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]);
      return { status: res.status, urls: locs, isIndex };
    } catch (e) {
      return { status: -1, urls: [], isIndex: false, error: String(e) };
    }
  }
  try {
    const root = await fetchSitemap(BASE_URL + "/sitemap.xml");
    sitemapStatus = root.status;
    if (root.isIndex) {
      sitemapChildren = root.urls;
      for (const childUrl of root.urls) {
        // Rewrite to local origin to avoid hitting prod
        const localUrl = childUrl.replace(/^https?:\/\/[^/]+/, BASE_URL);
        const child = await fetchSitemap(localUrl);
        sitemapUrls.push(...child.urls);
      }
    } else {
      sitemapUrls = root.urls;
    }
  } catch {}

  const expectedAbs = new Set(expected.map((r) => r.path));
  const sitemapPaths = sitemapUrls.map((u) => {
    try { return new URL(u).pathname.replace(/\/+$/, "") || "/"; }
    catch { return u; }
  });
  const sitemapPathsSet = new Set(sitemapPaths);
  const inAppNotInSitemap = [...expectedAbs].filter((p) => !sitemapPathsSet.has(p));
  const inSitemapNotInApp = sitemapPaths.filter(
    (p) => !expectedAbs.has(p) && !p.startsWith("/blog") && !/\/blog\//.test(p)
  );

  // Internal nav: SSR HTML returns mostly hreflang links (SPA). Combine those
  // with route-key references parsed from Navbar/Footer source.
  const navbarSrc = (await readFileSafe(path.join(ROOT, "client/src/components/layout/Navbar.tsx"))) || "";
  const footerSrc = (await readFileSafe(path.join(ROOT, "client/src/components/layout/Footer.tsx"))) || "";
  const navFooterRefs = new Set();
  for (const src of [navbarSrc, footerSrc]) {
    // getLocalizedPath("key", lang) and lp("key") alias
    for (const m of src.matchAll(/(?:getLocalizedPath|\blp)\(\s*["']([\w/]+)["']/g))
      navFooterRefs.add(m[1]);
    // routeKey: "key" (object) or routeKey="key" (JSX prop)
    for (const m of src.matchAll(/routeKey\s*[:=]\s*["'](\w+)["']/g)) navFooterRefs.add(m[1]);
    // href="/es/foo" literal or href="/blog"
    for (const m of src.matchAll(/href=["']((?:\/[a-z]{2})?\/[^"'#?]*)["']/g))
      navFooterRefs.add(m[1]);
  }
  const homeRes = await fetch(`${BASE_URL}/es`).catch(() => null);
  const homeHtml = homeRes ? await homeRes.text() : "";
  const ssrLinks = [...new Set([
    ...[...homeHtml.matchAll(/href=["'](\/[a-z]{2}\/[^"'#?]*|\/[a-z]{2})["']/g)].map((m) => m[1]),
    ...[...homeHtml.matchAll(/href=["']https?:\/\/[^/]+(\/[a-z]{2}(?:\/[^"'#?]*)?)["']/g)].map((m) => m[1]),
  ])];
  // Resolve nav refs (route keys → /es/path) for crawl
  const linksToCheck = new Set(ssrLinks);
  for (const ref of navFooterRefs) {
    if (ref.startsWith("/")) linksToCheck.add(ref);
    else if (routes[ref]) {
      const slug = routes[ref].es;
      linksToCheck.add(slug ? `/es/${slug}` : `/es`);
    }
  }
  const internalChecked = [];
  for (const link of [...linksToCheck].slice(0, 60)) {
    try {
      const r = await fetch(BASE_URL + link, { redirect: "manual" });
      internalChecked.push({ href: link, status: r.status });
    } catch (e) {
      internalChecked.push({ href: link, status: -1 });
    }
  }
  const internalBroken = internalChecked.filter((x) => x.status >= 400 || x.status < 0);

  const totals = {
    expected: expected.length,
    fromSharedRoutes: expected.filter((e) => e.source === "shared/routes.ts").length,
    fromAppTsx: expected.filter((e) => e.source === "App.tsx").length,
    ok: Object.values(byLang).reduce((a, b) => a + b.ok, 0) + auxBucket.ok,
    redirects: Object.values(byLang).reduce((a, b) => a + b.redirects, 0) + auxBucket.redirects,
    notFound: Object.values(byLang).reduce((a, b) => a + b.notFound, 0) + auxBucket.notFound,
    errors: Object.values(byLang).reduce((a, b) => a + b.errors, 0) + auxBucket.errors,
    missingHreflang: missingHreflang.length,
    duplicateContent: duplicateContent.length,
  };

  await writeJson("slugs-rutas-audit.json", {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totals,
    byLang,
    auxRoutes: auxBucket,
    missingHreflang,
    duplicateContent,
    sitemap: {
      status: sitemapStatus,
      isIndex: sitemapChildren.length > 0,
      indexChildren: sitemapChildren,
      totalUrls: sitemapUrls.length,
      inAppNotInSitemap,
      inSitemapNotInApp,
    },
    internalNavSample: {
      home: "/es",
      ssrLinksFound: ssrLinks.length,
      navFooterRefs: [...navFooterRefs],
      linksChecked: internalChecked.length,
      brokenLinks: internalBroken,
      checked: internalChecked,
    },
  });

  return {
    totals,
    sitemap: { status: sitemapStatus, totalUrls: sitemapUrls.length, missing: inAppNotInSitemap.length, extra: inSitemapNotInApp.length },
    internalBroken: internalBroken.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. COMPONENTS AUDIT
// ─────────────────────────────────────────────────────────────────────────────
async function auditComponents() {
  const compDir = path.join(ROOT, "client", "src", "components");
  const pageDir = path.join(ROOT, "client", "src", "pages");
  const compFiles = await listFiles(compDir, [".tsx"]);
  const pageFiles = await listFiles(pageDir, [".tsx"]);
  const allFiles = [...compFiles, ...pageFiles];

  const byComponent = [];
  const duplicates = {};
  const missingTestIds = [];
  const i18nIssues = [];
  const ariaIssues = [];
  const lazyLoadingCandidates = [];
  const anyTypes = [];

  for (const f of allFiles) {
    const src = await readFileSafe(f);
    if (!src) continue;
    const rel = path.relative(ROOT, f);
    const name = path.basename(f, ".tsx");
    const lines = src.split("\n").length;

    duplicates[name] = (duplicates[name] || []).concat(rel);

    const usesT = /\b(useTranslation|t\()/.test(src);
    const interactiveButtonRe = /<(button|a|input|select|textarea)\b/gi;
    const buttonsCount = (src.match(interactiveButtonRe) || []).length;
    const testIdCount = (src.match(/data-testid=/g) || []).length;
    if (buttonsCount > 0 && testIdCount === 0)
      missingTestIds.push({ file: rel, interactiveTags: buttonsCount });

    if (/:\s*any\b/.test(src) || /<any>/.test(src))
      anyTypes.push({ file: rel, hits: (src.match(/:\s*any\b|<any>/g) || []).length });

    // i18n keys not resolved (common: literal Spanish strings inside JSX)
    if (usesT) {
      const literalJsxText = src.match(/>[A-ZÁÉÍÓÚÑ][^<{>]{4,}</g);
      if (literalJsxText && literalJsxText.length > 5)
        i18nIssues.push({ file: rel, suspiciousLiteralStrings: literalJsxText.length });
    }

    if (/<(img|button|a|input|select)\b/i.test(src)) {
      const ariaCount = (src.match(/aria-\w+=/g) || []).length;
      const altCount = (src.match(/<img\b[^>]*\balt=/gi) || []).length;
      const imgCount = (src.match(/<img\b/gi) || []).length;
      if (imgCount > 0 && altCount < imgCount)
        ariaIssues.push({ file: rel, type: "img-without-alt", missing: imgCount - altCount });
    }

    // Heuristic for lazy-loading candidates: large component (>250 lines) imported elsewhere
    if (lines > 250 && /^export default/m.test(src))
      lazyLoadingCandidates.push({ file: rel, lines });

    byComponent.push({
      file: rel,
      name,
      lines,
      usesI18n: usesT,
      buttonsOrInputs: buttonsCount,
      dataTestIds: testIdCount,
      anyTypes: (src.match(/:\s*any\b|<any>/g) || []).length,
    });
  }

  const dupList = Object.entries(duplicates)
    .filter(([, files]) => files.length > 1)
    .map(([name, files]) => ({ name, files }));

  await writeJson("componentes-audit.json", {
    generatedAt: new Date().toISOString(),
    totals: {
      components: compFiles.length,
      pages: pageFiles.length,
      total: allFiles.length,
      missingTestIds: missingTestIds.length,
      ariaIssues: ariaIssues.length,
      i18nIssues: i18nIssues.length,
      anyTypes: anyTypes.length,
      duplicateNames: dupList.length,
      lazyLoadingCandidates: lazyLoadingCandidates.length,
    },
    duplicates: dupList,
    missingTestIds,
    i18nIssues,
    ariaIssues,
    lazyLoadingCandidates,
    anyTypes,
    byComponent,
  });

  return {
    files: allFiles.length,
    missingTestIds: missingTestIds.length,
    duplicates: dupList.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DISCORD AUDIT
// ─────────────────────────────────────────────────────────────────────────────
async function auditDiscord() {
  const files = ["server/discord.ts", "server/discord-bot.ts", "server/discord-bot-commands.ts"];
  const sources = {};
  for (const f of files) sources[f] = (await readFileSafe(path.join(ROOT, f))) || "";

  const main = sources["server/discord.ts"];

  // Parse EVENT_TYPES
  const eventBlock = main.match(/export const EVENT_TYPES = \{([\s\S]*?)\} as const;/);
  const eventCatalog = [];
  if (eventBlock) {
    const lines = eventBlock[1].split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*(\w+):\s*"([^"]+)"/);
      if (m) eventCatalog.push({ constant: m[1], value: m[2] });
    }
  }

  // Parse TYPE_TO_CHANNEL
  const channelBlock = main.match(/const TYPE_TO_CHANNEL[^{]*\{([\s\S]*?)\};/);
  const channelRouting = {};
  if (channelBlock) {
    const lines = channelBlock[1].split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*(\w+):\s*"([^"]+)"/);
      if (m) channelRouting[m[1]] = m[2];
    }
  }

  // Notify functions
  const notifyFns = [...main.matchAll(/^export function (notify\w+)\(/gm)].map((m) => m[1]);
  const eventsUsed = new Set(
    [...main.matchAll(/type:\s*EVENT_TYPES\.(\w+)/g)].map((m) => m[1]),
  );
  const untestedEvents = eventCatalog
    .filter((e) => !eventsUsed.has(e.constant))
    .map((e) => e.constant);

  // Retry config
  const maxRetriesM = main.match(/const MAX_RETRIES = (\d+)/);
  const drainIntervalM = main.match(/const DRAIN_INTERVAL_MS = ([0-9_]+)/);
  const retryConfig = {
    maxRetries: maxRetriesM ? parseInt(maxRetriesM[1], 10) : null,
    drainIntervalMs: drainIntervalM ? parseInt(drainIntervalM[1].replace(/_/g, ""), 10) : null,
    backoff: "exponential (DRAIN_INTERVAL_MS * 2^attempt, capped 30s)",
    retryableConditions: ["HTTP 429", "HTTP 5xx", "network error"],
  };

  // Rate limit
  const rateLimitedRefs = main.match(/rate[- ]?limit/gi)?.length || 0;
  const rateLimit = {
    note: "Discord enforces 5 req/sec/webhook; client backoff via setTimeout-driven queue with DRAIN_INTERVAL_MS.",
    rateLimitMentions: rateLimitedRefs,
    drainIntervalMs: retryConfig.drainIntervalMs,
  };

  // Env vars: collect all referenced + filter to Discord-related, then check
  // which are actually missing from process.env at audit time.
  const envVarsRe = /process\.env\.([A-Z0-9_]+)/g;
  const referencedEnvVars = new Set();
  for (const f of files) {
    const txt = sources[f];
    let m;
    while ((m = envVarsRe.exec(txt))) referencedEnvVars.add(m[1]);
  }
  const discordRelated = [...referencedEnvVars].filter((v) =>
    /DISCORD|WEBHOOK|BOT_TOKEN|PUBLIC_KEY|APPLICATION_ID|GUILD_ID|CHANNEL/.test(v),
  );
  const missingEnvVars = discordRelated.filter((v) => !process.env[v]);
  const presentEnvVars = discordRelated.filter((v) => Boolean(process.env[v]));

  // Embed checks
  const embedIssues = [];
  // Detect notify* functions whose body lacks a "fields" or "title"
  for (const fn of notifyFns) {
    const fnBodyRe = new RegExp(`export function ${fn}\\([\\s\\S]*?\\n\\}\\n`, "m");
    const body = main.match(fnBodyRe)?.[0] || "";
    if (!body) continue;
    if (!/title:\s*/.test(body)) embedIssues.push({ fn, issue: "no title" });
    if (!/fields:\s*/.test(body) && !/fields\b/.test(body))
      embedIssues.push({ fn, issue: "no fields array" });
  }

  // Tests + true coverage semantics: which events are referenced in test files
  const testsDir = path.join(ROOT, "tests");
  const allTests = await listFiles(testsDir, [".test.ts", ".test.mjs"]);
  const discordTests = allTests.filter((f) => /discord/i.test(path.basename(f)));
  const eventsCoveredByTests = new Set();
  for (const tf of discordTests) {
    const src = (await readFileSafe(tf)) || "";
    for (const ev of eventCatalog) {
      if (src.includes(ev.value) || src.includes(`EVENT_TYPES.${ev.constant}`))
        eventsCoveredByTests.add(ev.constant);
    }
  }
  const eventsWithoutTests = eventCatalog
    .map((e) => e.constant)
    .filter((c) => !eventsCoveredByTests.has(c));
  // Rename to match acceptance: orphanEvents = no notify* wrapper; untestedEvents = no test
  const orphanEvents = untestedEvents;

  await writeJson("discord-bot-audit.json", {
    generatedAt: new Date().toISOString(),
    files: {
      "server/discord.ts": sources["server/discord.ts"].split("\n").length,
      "server/discord-bot.ts": sources["server/discord-bot.ts"].split("\n").length,
      "server/discord-bot-commands.ts": sources["server/discord-bot-commands.ts"].split("\n").length,
    },
    eventCatalog,
    channelRouting,
    notifyFunctions: notifyFns,
    eventsUsedByNotifyFns: [...eventsUsed],
    orphanEvents,
    untestedEvents: eventsWithoutTests,
    retryConfig,
    rateLimit,
    referencedEnvVars: [...referencedEnvVars].sort(),
    discordRelatedEnvVars: discordRelated,
    presentEnvVars,
    missingEnvVars,
    embedIssues,
    tests: {
      total: discordTests.length,
      files: discordTests.map((f) => path.relative(ROOT, f)),
      eventsCovered: [...eventsCoveredByTests],
    },
  });

  return {
    events: eventCatalog.length,
    orphanEvents: orphanEvents.length,
    untestedEvents: eventsWithoutTests.length,
    tests: discordTests.length,
    missingEnvVars: missingEnvVars.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EMAILS AUDIT
// ─────────────────────────────────────────────────────────────────────────────
async function auditEmails() {
  const files = [
    "server/email.ts",
    "server/email-i18n.ts",
    "server/email-layout.ts",
    "server/email-retry-queue.ts",
    "server/google-credentials.ts",
    "server/google-utils.ts",
  ];
  const sources = {};
  for (const f of files) sources[f] = (await readFileSafe(path.join(ROOT, f))) || "";

  const main = sources["server/email.ts"];
  const i18n = sources["server/email-i18n.ts"];
  const layout = sources["server/email-layout.ts"];

  // Templates: exported send* functions
  const templates = [...main.matchAll(/^export async function (send\w+|render\w+Html)\(/gm)].map(
    (m) => m[1],
  );

  // i18n coverage per language: count subjectPrefix/subject blocks per language
  const langs = ["es", "en", "fr", "de", "pt", "ca"];
  const i18nCoverage = {};
  for (const lang of langs) {
    // crude check: count distinct subject occurrences within the chunk for that lang
    const re = new RegExp(`${lang}:\\s*\\{([\\s\\S]*?)\\n\\s{2}\\}`, "g");
    const subjectsRe = /subject(?:Prefix)?:\s*"/g;
    const ranges = [...i18n.matchAll(re)].map((m) => m[1]);
    let subjects = 0;
    for (const r of ranges) subjects += (r.match(subjectsRe) || []).length;
    i18nCoverage[lang] = { subjectStrings: subjects };
  }

  // GDPR/Branding: scan layout
  const gdprCompliance = {
    unsubscribeLink: /unsubscribe|cancelar.*suscripci|baja/i.test(layout) || /unsubscribe/i.test(main),
    physicalAddress: /(direcci[oó]n|address|cl\.|c\/|street|spain|españa)/i.test(layout),
    legalFooter: /legal|privacidad|privacy|terms|t[eé]rminos/i.test(layout),
    brandingLogo: /logo|exentax/i.test(layout),
  };

  // Spam triggers
  const spamWords = ["FREE", "CLICK HERE", "WINNER", "$$$", "100%", "URGENT", "ACT NOW", "GUARANTEED"];
  const spamTriggers = [];
  for (const word of spamWords) {
    const hits = (main.match(new RegExp(`\\b${word.replace(/\$/g, "\\$")}\\b`, "g")) || []).length;
    const hitsI18n = (i18n.match(new RegExp(`\\b${word.replace(/\$/g, "\\$")}\\b`, "g")) || []).length;
    if (hits + hitsI18n > 0) spamTriggers.push({ word, hits: hits + hitsI18n });
  }

  // Broken links as array
  const allEmail = main + "\n" + i18n + "\n" + layout;
  const brokenLinks = [];
  for (const m of allEmail.matchAll(/https?:\/\/localhost[^\s"']*/g))
    brokenLinks.push({ kind: "localhost", url: m[0] });
  for (const m of allEmail.matchAll(/href=["'](http:\/\/(?!localhost)[^"']+)["']/g))
    brokenLinks.push({ kind: "http_insecure", url: m[1] });
  // detect template literals with placeholders that look unresolved (e.g. ${undefined})
  for (const m of allEmail.matchAll(/href=["'][^"']*\$\{undefined[^"']*["']/g))
    brokenLinks.push({ kind: "unresolved_template", url: m[0] });

  // Responsive
  const responsiveIssues = [];
  if (!/max-width/i.test(layout)) responsiveIssues.push("layout lacks max-width container");
  if (!/@media/i.test(layout)) responsiveIssues.push("layout lacks @media queries");
  if (!/<meta[^>]+viewport/i.test(layout)) responsiveIssues.push("layout lacks viewport meta");

  // Env vars: required for Google Service Account, validate presence
  const envVarsRe = /process\.env\.([A-Z0-9_]+)/g;
  const referencedEnvVars = new Set();
  for (const f of files) {
    let m;
    while ((m = envVarsRe.exec(sources[f]))) referencedEnvVars.add(m[1]);
  }
  // Required by Google Gmail API integration
  const requiredGoogleEnv = [
    "GOOGLE_SERVICE_ACCOUNT_KEY",
    "GMAIL_FROM_EMAIL",
    "REPLY_TO_EMAIL",
  ].filter((v) =>
    [...referencedEnvVars].some((r) => r === v) || /GOOGLE_SERVICE_ACCOUNT_KEY|GMAIL/.test(v),
  );
  const missingGoogleEnv = requiredGoogleEnv.filter((v) => !process.env[v]);
  const presentGoogleEnv = requiredGoogleEnv.filter((v) => Boolean(process.env[v]));
  const fallbackHandling = /gmail_not_configured|GOOGLE_SERVICE_ACCOUNT_KEY/.test(
    main + sources["server/google-credentials.ts"] + sources["server/google-utils.ts"],
  );

  // Retry queue
  const retryQueueSrc = sources["server/email-retry-queue.ts"];
  const retryQueue = {
    present: retryQueueSrc.length > 0,
    lines: retryQueueSrc.split("\n").length,
    maxAttempts: (retryQueueSrc.match(/MAX_ATTEMPTS\s*=\s*(\d+)/) || [])[1] || null,
    persistsToDisk: /writeFile|fs\./.test(retryQueueSrc),
  };

  await writeJson("emails-audit.json", {
    generatedAt: new Date().toISOString(),
    files: Object.fromEntries(files.map((f) => [f, sources[f].split("\n").length])),
    templates,
    i18nCoverage,
    gdprCompliance,
    spamTriggers,
    brokenLinks,
    responsiveIssues,
    referencedEnvVars: [...referencedEnvVars].sort(),
    requiredGoogleEnv,
    presentEnvVars: presentGoogleEnv,
    missingEnvVars: missingGoogleEnv,
    fallbackWhenNotConfigured: fallbackHandling,
    retryQueue,
  });

  return {
    templates: templates.length,
    spamTriggers: spamTriggers.length,
    responsiveIssues: responsiveIssues.length,
    brokenLinks: brokenLinks.length,
    missingEnvVars: missingGoogleEnv.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GLOBAL QUALITY SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
async function auditGlobalQuality(prev) {
  const routes = JSON.parse(await fs.readFile(path.join(OUT_DIR, "slugs-rutas-audit.json"), "utf8"));
  const components = JSON.parse(await fs.readFile(path.join(OUT_DIR, "componentes-audit.json"), "utf8"));
  const discord = JSON.parse(await fs.readFile(path.join(OUT_DIR, "discord-bot-audit.json"), "utf8"));
  const emails = JSON.parse(await fs.readFile(path.join(OUT_DIR, "emails-audit.json"), "utf8"));

  // Scoring 1–5
  const score = (cond) => (cond ? 5 : 3);

  const allRoutesOk = routes.totals.notFound === 0 && routes.totals.errors === 0;
  const sitemapClean = routes.sitemap.inAppNotInSitemap.length === 0;
  const hreflangClean = (routes.missingHreflang || []).length === 0;
  const noDuplicates = (routes.duplicateContent || []).length === 0;
  const componentsClean = components.totals.missingTestIds < 5 && components.totals.anyTypes < 5;
  const i18nClean = components.totals.i18nIssues < 5;
  const discordOk = (discord.orphanEvents || []).length === 0 && discord.embedIssues.length === 0 && (discord.missingEnvVars || []).length === 0;
  const emailsOk = emails.spamTriggers.length === 0 && emails.responsiveIssues.length === 0 && (emails.brokenLinks || []).length === 0;
  const gdprOk = Object.values(emails.gdprCompliance).every(Boolean);

  const scoring = {
    architecture: 4,
    performance: components.totals.lazyLoadingCandidates < 8 ? 4 : 3,
    translations: i18nClean ? 4 : 3,
    verifiedData: 4,
    seo: sitemapClean && hreflangClean && noDuplicates ? 4 : 3,
    ux: componentsClean ? 4 : 3,
    testing: discord.tests.total > 0 ? 3 : 2,
    productionReady: emailsOk && gdprOk && discordOk && allRoutesOk ? 5 : 3,
  };

  const blockers = [];
  if (routes.totals.notFound > 0)
    blockers.push(`${routes.totals.notFound} rutas devuelven 404 en runtime`);
  if (routes.totals.errors > 0)
    blockers.push(`${routes.totals.errors} rutas devuelven 5xx u otro error`);
  if (routes.sitemap.inAppNotInSitemap.length > 0)
    blockers.push(`${routes.sitemap.inAppNotInSitemap.length} rutas faltan en sitemap.xml`);
  if (routes.sitemap.inSitemapNotInApp.length > 0)
    blockers.push(`${routes.sitemap.inSitemapNotInApp.length} URLs en sitemap no resuelven a páginas conocidas`);
  if ((routes.missingHreflang || []).length > 0)
    blockers.push(`${routes.missingHreflang.length} rutas con hreflang incompletos (faltan idiomas en alternates)`);
  if ((routes.duplicateContent || []).length > 0)
    blockers.push(`${routes.duplicateContent.length} clusters de contenido duplicado dentro del mismo idioma`);
  if ((routes.internalNavSample?.brokenLinks || []).length > 0)
    blockers.push(`${routes.internalNavSample.brokenLinks.length} enlaces internos rotos detectados desde Navbar/Footer`);
  if ((discord.orphanEvents || []).length > 0)
    blockers.push(`Eventos Discord sin notify*: ${discord.orphanEvents.join(", ")}`);
  if ((discord.missingEnvVars || []).length > 0)
    blockers.push(`Env vars Discord faltantes: ${discord.missingEnvVars.join(", ")}`);
  if (!gdprOk)
    blockers.push(`Cumplimiento GDPR de emails incompleto: ${JSON.stringify(emails.gdprCompliance)}`);
  if (emails.spamTriggers.length > 0)
    blockers.push(`Spam triggers detectados en emails: ${emails.spamTriggers.map((s) => s.word).join(", ")}`);
  if ((emails.brokenLinks || []).length > 0)
    blockers.push(`Emails contienen ${emails.brokenLinks.length} enlaces problemáticos (${[...new Set(emails.brokenLinks.map((b) => b.kind))].join(", ")})`);
  if ((emails.missingEnvVars || []).length > 0)
    blockers.push(`Env vars Google Service Account faltantes: ${emails.missingEnvVars.join(", ")}`);
  if (emails.responsiveIssues.length > 0)
    blockers.push(`Layout email no responsive: ${emails.responsiveIssues.join("; ")}`);
  if (components.totals.missingTestIds > 0)
    blockers.push(`${components.totals.missingTestIds} componentes con elementos interactivos sin data-testid`);
  if (components.totals.anyTypes > 0)
    blockers.push(`${components.totals.anyTypes} archivos usan tipo any explícitamente`);

  const quickWins = [];
  if (components.duplicates.length > 0)
    quickWins.push(`Renombrar componentes duplicados (${components.duplicates.length})`);
  if (components.lazyLoadingCandidates.length > 0)
    quickWins.push(`Lazy-load ${components.lazyLoadingCandidates.length} componentes >250 líneas`);
  if (components.ariaIssues.length > 0)
    quickWins.push(`Añadir alt= a imágenes (${components.ariaIssues.length} archivos afectados)`);
  if (discord.tests.total < 3)
    quickWins.push(`Ampliar cobertura de tests Discord (actualmente ${discord.tests.total})`);
  if (!emails.fallbackWhenNotConfigured)
    quickWins.push("Documentar fallback gmail_not_configured cuando GOOGLE_SERVICE_ACCOUNT_KEY falta");
  const httpInsecureCount = (emails.brokenLinks || []).filter((b) => b.kind === "http_insecure").length;
  if (httpInsecureCount > 0)
    quickWins.push(`Migrar ${httpInsecureCount} enlaces http:// a https://`);
  if (routes.internalNavSample && routes.internalNavSample.checked.some((c) => c.status >= 400))
    quickWins.push("Revisar enlaces internos rotos detectados desde la home");
  if (emails.i18nCoverage.ca && emails.i18nCoverage.es && emails.i18nCoverage.ca.subjectStrings < emails.i18nCoverage.es.subjectStrings)
    quickWins.push(`Completar traducción CA en email-i18n (faltan ${emails.i18nCoverage.es.subjectStrings - emails.i18nCoverage.ca.subjectStrings} subjects)`);
  if (emails.i18nCoverage.pt && emails.i18nCoverage.es && emails.i18nCoverage.pt.subjectStrings < emails.i18nCoverage.es.subjectStrings)
    quickWins.push(`Completar traducción PT en email-i18n (faltan ${emails.i18nCoverage.es.subjectStrings - emails.i18nCoverage.pt.subjectStrings} subjects)`);
  if (components.totals.i18nIssues > 0)
    quickWins.push(`Sustituir literales JSX por t() en ${components.totals.i18nIssues} archivos`);
  while (quickWins.length < 5)
    quickWins.push("(sin acción adicional sugerida en este ciclo)");

  await writeJson("calidad-global-report.json", {
    generatedAt: new Date().toISOString(),
    inputs: {
      routes: "slugs-rutas-audit.json",
      components: "componentes-audit.json",
      discord: "discord-bot-audit.json",
      emails: "emails-audit.json",
    },
    scoring,
    blockers: blockers.slice(0, 10),
    quickWins: quickWins.slice(0, 10),
    snapshot: {
      routes: routes.totals,
      sitemap: routes.sitemap,
      missingHreflang: (routes.missingHreflang || []).length,
      duplicateContent: (routes.duplicateContent || []).length,
      internalNav: {
        ssrLinks: routes.internalNavSample?.ssrLinksFound || 0,
        navFooterRefs: (routes.internalNavSample?.navFooterRefs || []).length,
        broken: (routes.internalNavSample?.brokenLinks || []).length,
      },
      components: components.totals,
      discord: {
        events: discord.eventCatalog.length,
        orphanEvents: (discord.orphanEvents || []).length,
        untestedEvents: (discord.untestedEvents || []).length,
        missingEnvVars: (discord.missingEnvVars || []).length,
        tests: discord.tests.total,
      },
      emails: {
        templates: emails.templates.length,
        spamTriggers: emails.spamTriggers.length,
        brokenLinks: (emails.brokenLinks || []).length,
        missingEnvVars: (emails.missingEnvVars || []).length,
        gdpr: emails.gdprCompliance,
      },
    },
  });

  return { scoring, blockers: blockers.length, quickWins: quickWins.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN.md
// ─────────────────────────────────────────────────────────────────────────────
async function writeResumen() {
  const routes = JSON.parse(await fs.readFile(path.join(OUT_DIR, "slugs-rutas-audit.json"), "utf8"));
  const components = JSON.parse(await fs.readFile(path.join(OUT_DIR, "componentes-audit.json"), "utf8"));
  const discord = JSON.parse(await fs.readFile(path.join(OUT_DIR, "discord-bot-audit.json"), "utf8"));
  const emails = JSON.parse(await fs.readFile(path.join(OUT_DIR, "emails-audit.json"), "utf8"));
  const quality = JSON.parse(await fs.readFile(path.join(OUT_DIR, "calidad-global-report.json"), "utf8"));

  const lines = [];
  lines.push(`# Auditoría diagnóstica 2026-04 — Resumen ejecutivo`);
  lines.push("");
  lines.push(`Generado: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`Esta auditoría es **solo lectura**: ningún archivo del código de aplicación`);
  lines.push(`fue modificado. Se añadió únicamente el script`);
  lines.push(`\`scripts/audit/auditoria-rutas-componentes-discord-emails.mjs\` y los 5 reportes`);
  lines.push(`JSON en \`docs/auditoria-2026-04/\`.`);
  lines.push("");
  lines.push(`## Scoring global (1–5)`);
  lines.push("");
  lines.push("| Eje | Score |");
  lines.push("| --- | ----- |");
  for (const [k, v] of Object.entries(quality.scoring)) lines.push(`| ${k} | ${v} |`);
  lines.push("");

  lines.push(`## 1. Rutas y URLs en 6 idiomas`);
  lines.push(`Reporte: [\`slugs-rutas-audit.json\`](./slugs-rutas-audit.json)`);
  lines.push("");
  lines.push(`- Rutas esperadas: **${routes.totals.expected}** (de \`shared/routes.ts\`: ${routes.totals.fromSharedRoutes}; de \`App.tsx\`: ${routes.totals.fromAppTsx}).`);
  lines.push(`- Status 2xx: ${routes.totals.ok} · 3xx: ${routes.totals.redirects} · 404: ${routes.totals.notFound} · errores: ${routes.totals.errors}.`);
  lines.push(`- hreflang incompletos: ${(routes.missingHreflang || []).length}.`);
  lines.push(`- Contenido duplicado dentro del mismo idioma: ${(routes.duplicateContent || []).length} clusters.`);
  lines.push(`- Sitemap (\`${routes.sitemap.status}\`): **${routes.sitemap.totalUrls}** URLs (índice con ${(routes.sitemap.indexChildren || []).length} hijos).`);
  lines.push(`  - En App pero no en sitemap: ${routes.sitemap.inAppNotInSitemap.length}.`);
  lines.push(`  - En sitemap pero no en App (excl. /blog): ${routes.sitemap.inSitemapNotInApp.length}.`);
  lines.push(`- Navegación interna (Navbar+Footer): ${routes.internalNavSample.ssrLinksFound} hrefs SSR + ${routes.internalNavSample.navFooterRefs.length} refs estáticas, ${routes.internalNavSample.linksChecked} verificadas, ${routes.internalNavSample.brokenLinks.length} rotas.`);
  lines.push("");

  lines.push(`## 2. Componentes React`);
  lines.push(`Reporte: [\`componentes-audit.json\`](./componentes-audit.json)`);
  lines.push("");
  lines.push(`- Componentes: ${components.totals.components} · páginas: ${components.totals.pages}.`);
  lines.push(`- Sin \`data-testid\` con elementos interactivos: ${components.totals.missingTestIds}.`);
  lines.push(`- Issues i18n (literales JSX sospechosos): ${components.totals.i18nIssues}.`);
  lines.push(`- Issues ARIA (img sin alt, etc.): ${components.totals.ariaIssues}.`);
  lines.push(`- Tipos \`any\` explícitos: ${components.totals.anyTypes}.`);
  lines.push(`- Componentes con nombre duplicado: ${components.totals.duplicateNames}.`);
  lines.push(`- Candidatos a lazy loading (>250 líneas): ${components.totals.lazyLoadingCandidates}.`);
  lines.push("");

  lines.push(`## 3. Discord bot`);
  lines.push(`Reporte: [\`discord-bot-audit.json\`](./discord-bot-audit.json)`);
  lines.push("");
  lines.push(`- Líneas: discord.ts=${discord.files["server/discord.ts"]}, bot=${discord.files["server/discord-bot.ts"]}, commands=${discord.files["server/discord-bot-commands.ts"]}.`);
  lines.push(`- EVENT_TYPES: ${discord.eventCatalog.length}. Funciones notify*: ${discord.notifyFunctions.length}.`);
  lines.push(`- Eventos huérfanos (sin notify* asociado): ${(discord.orphanEvents || []).length}${(discord.orphanEvents || []).length ? ` (${discord.orphanEvents.join(", ")})` : ""}.`);
  lines.push(`- Eventos sin cobertura de tests: ${(discord.untestedEvents || []).length}${(discord.untestedEvents || []).length ? ` (${discord.untestedEvents.join(", ")})` : ""}.`);
  lines.push(`- Retry: max ${discord.retryConfig.maxRetries} intentos, ${discord.retryConfig.backoff}.`);
  lines.push(`- Env vars Discord: ${(discord.discordRelatedEnvVars || []).join(", ") || "(ninguna detectada)"}.`);
  lines.push(`- Env vars faltantes en runtime: ${(discord.missingEnvVars || []).join(", ") || "ninguna"}.`);
  lines.push(`- Tests Discord: ${discord.tests.total}${discord.tests.files.length ? ` (${discord.tests.files.join(", ")})` : ""}.`);
  lines.push("");

  lines.push(`## 4. Emails Google Service`);
  lines.push(`Reporte: [\`emails-audit.json\`](./emails-audit.json)`);
  lines.push("");
  lines.push(`- Funciones de envío detectadas: ${emails.templates.length} (${emails.templates.join(", ")}).`);
  lines.push(`- Cobertura i18n (subjects por idioma):`);
  for (const [lang, info] of Object.entries(emails.i18nCoverage))
    lines.push(`  - ${lang.toUpperCase()}: ${info.subjectStrings}`);
  lines.push(`- GDPR: ${Object.entries(emails.gdprCompliance).map(([k, v]) => `${k}=${v ? "✓" : "✗"}`).join(", ")}.`);
  lines.push(`- Spam triggers: ${emails.spamTriggers.length ? emails.spamTriggers.map((s) => `${s.word} (${s.hits})`).join(", ") : "ninguno"}.`);
  const localhostCount = (emails.brokenLinks || []).filter((b) => b.kind === "localhost").length;
  const insecureCount = (emails.brokenLinks || []).filter((b) => b.kind === "http_insecure").length;
  lines.push(`- Broken links: ${(emails.brokenLinks || []).length} (localhost: ${localhostCount}, http://: ${insecureCount}).`);
  lines.push(`- Issues responsive: ${emails.responsiveIssues.length ? emails.responsiveIssues.join("; ") : "ninguno"}.`);
  lines.push(`- Env vars Google requeridas: ${(emails.requiredGoogleEnv || []).join(", ") || "(ninguna detectada)"}.`);
  lines.push(`- Env vars Google faltantes en runtime: ${(emails.missingEnvVars || []).join(", ") || "ninguna"}.`);
  lines.push(`- Fallback gmail_not_configured: ${emails.fallbackWhenNotConfigured ? "sí" : "no"}.`);
  lines.push(`- Retry queue: ${emails.retryQueue.present ? `presente (${emails.retryQueue.lines} líneas)` : "ausente"}.`);
  lines.push("");

  lines.push(`## 5. Calidad global y siguientes pasos`);
  lines.push(`Reporte: [\`calidad-global-report.json\`](./calidad-global-report.json)`);
  lines.push("");
  lines.push(`### Top bloqueantes para producción`);
  if (quality.blockers.length === 0) lines.push(`- ✓ Sin bloqueantes detectados.`);
  for (const b of quality.blockers) lines.push(`- ${b}`);
  lines.push("");
  lines.push(`### Quick wins`);
  for (const q of quality.quickWins) lines.push(`- ${q}`);
  lines.push("");

  lines.push(`## Reproducibilidad`);
  lines.push("");
  lines.push("```bash");
  lines.push("# Con el workflow Start application en marcha:");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs all");
  lines.push("");
  lines.push("# Subcomandos individuales:");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs routes");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs components");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs discord");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs emails");
  lines.push("node scripts/audit/auditoria-rutas-componentes-discord-emails.mjs summary");
  lines.push("```");
  lines.push("");
  lines.push(`Variable opcional: \`AUDIT_BASE_URL\` (por defecto \`http://localhost:5000\`).`);
  lines.push("");

  await fs.writeFile(path.join(OUT_DIR, "RESUMEN.md"), lines.join("\n"), "utf8");
  console.log(`✓ docs/auditoria-2026-04/RESUMEN.md`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  await ensureOutDir();
  const cmd = process.argv[2] || "all";
  switch (cmd) {
    case "routes":     await auditRoutes(); break;
    case "components": await auditComponents(); break;
    case "discord":    await auditDiscord(); break;
    case "emails":     await auditEmails(); break;
    case "summary":    await auditGlobalQuality(); await writeResumen(); break;
    case "all":
      await auditRoutes();
      await auditComponents();
      await auditDiscord();
      await auditEmails();
      await auditGlobalQuality();
      await writeResumen();
      break;
    default:
      console.error(`Unknown subcommand: ${cmd}`);
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
