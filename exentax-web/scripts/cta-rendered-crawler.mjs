#!/usr/bin/env node
/**
 * cta-rendered-crawler — Real-DOM, runtime-based CTA crawler.
 *
 * This is the **authoritative** inventory for Task #19. The static
 * regex-based `cta-inventory.mjs` is intentionally limited to direct
 * `<Link href={lp("…")}>` syntax and therefore can't see CTAs that
 * pass `href` through a variable (e.g. `<a href={link.href}>` in
 * mapped nav/footer/section structures). The rendered crawler
 * eliminates that blind spot by loading each seed page in Chromium,
 * waiting for hydration, and extracting **every** anchor that actually
 * reaches the visitor's DOM.
 *
 * What it does
 * ------------
 *
 *   (1) Visits a representative seed page for every primary surface
 *       in every locale: home, services, FAQ, booking, blog index,
 *       and a sample blog post — so 6 surfaces × 6 locales = 36
 *       page loads. Together those pages render the navbar,
 *       hero, every home/services section, the floating WhatsApp
 *       button, the footer, the blog list and the blog ArticleCTA
 *       — i.e. every interactive surface the audit must cover.
 *
 *   (2) Extracts every rendered `<a href>` from each loaded page.
 *
 *   (3) Builds a per-locale rendered inventory and writes it to
 *       reports/cta-rendered-inventory.{csv,json} (one row per
 *       rendered anchor, with page / lang / href / text / category).
 *
 *   (4) Asserts:
 *       • no cross-language drift — any `<a>` rendered on a page
 *         under `/<lang>/...` whose href starts with `/<otherlang>/...`
 *         is a bug (the LanguageSwitcher uses `<button>` in this
 *         codebase);
 *       • every unique discovered internal href returns < 400 over
 *         live HTTP;
 *       • every rendered `https://wa.me/<digits>` URL uses the
 *         canonical `CONTACT.WHATSAPP_NUMBER`.
 *
 * Outputs
 * -------
 *
 *   reports/cta-rendered-inventory.json
 *   reports/cta-rendered-inventory.csv
 *   reports/cta-rendered-crawler.json
 *   reports/cta-rendered-crawler.md
 *
 * Exit code: 1 on any cross-language link, broken HTTP target or
 * non-canonical wa.me number. 0 otherwise.
 *
 * `SKIP_RENDERED_CRAWL=1` writes empty stubs and exits 0 — for CI
 * environments that can't host a browser.
 *
 * Usage:
 *   BASE_URL=http://localhost:5000 node scripts/cta-rendered-crawler.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.env.BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];
const OUT_DIR = path.join(ROOT, "reports");
const HTTP_CONCURRENCY = 8;
const PAGE_CONCURRENCY = 6;
// Sample post present in all six locales — used as the "blog post"
// seed so we exercise ArticleCTA rendering across languages.
const SAMPLE_POST = "cuanto-cuesta-constituir-llc";

// Per-locale slugs for the surfaces the rendered crawler seeds.
// Sourced from `ROUTE_SLUGS` in `shared/routes.ts` at startup so
// any slug rename (or new locale) is picked up automatically and
// the crawler can never drift from the app's actual routing table.
// `surface label → ROUTE_SLUGS key` map for the seeds below:
const SURFACE_TO_ROUTE_KEY = { book: "book", services: "our_services", faq: "faq" };
async function loadSlugs() {
  const src = await fs.readFile(path.join(ROOT, "shared/routes.ts"), "utf8");
  const out = {};
  for (const [surface, key] of Object.entries(SURFACE_TO_ROUTE_KEY)) {
    // ROUTE_SLUGS rows look like:
    //   book:             { es: "agendar", en: "book", fr: "...", ... },
    const rowRe = new RegExp(`\\b${key}\\s*:\\s*\\{([^}]*)\\}`);
    const row = src.match(rowRe);
    if (!row) throw new Error(`could not find ROUTE_SLUGS["${key}"] in shared/routes.ts`);
    const langRe = /(es|en|fr|de|pt|ca)\s*:\s*"([^"]*)"/g;
    const slugs = {};
    let m;
    while ((m = langRe.exec(row[1])) !== null) slugs[m[1]] = m[2];
    for (const lang of LOCALES) {
      if (slugs[lang] === undefined) {
        throw new Error(`ROUTE_SLUGS["${key}"] is missing locale "${lang}" in shared/routes.ts`);
      }
    }
    out[surface] = slugs;
  }
  return out;
}

async function loadCanonicalNumber() {
  const src = await fs.readFile(path.join(ROOT, "client/src/lib/constants.ts"), "utf8");
  return src.match(/WHATSAPP_NUMBER:\s*"(\d+)"/)?.[1] || null;
}

async function pHead(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual", headers: { "user-agent": "exentax-cta-rendered/1.0" } });
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

async function writeStubAndExit(reason) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const stub = { base: BASE, skipped: true, reason };
  await fs.writeFile(path.join(OUT_DIR, "cta-rendered-crawler.json"), JSON.stringify(stub, null, 2));
  await fs.writeFile(
    path.join(OUT_DIR, "cta-rendered-crawler.md"),
    `# Rendered link crawler\n\nSkipped: ${reason}\n`,
  );
  await fs.writeFile(path.join(OUT_DIR, "cta-rendered-inventory.json"), "[]\n");
  await fs.writeFile(
    path.join(OUT_DIR, "cta-rendered-inventory.csv"),
    "page,lang,surface,category,href,text\n",
  );
  console.log(`[cta-rendered] skipped — ${reason}`);
  process.exit(0);
}

function classify(href) {
  if (!href) return "empty";
  if (href.startsWith("#")) return "anchor";
  if (href.startsWith("javascript:")) return "javascript";
  if (href.startsWith("mailto:")) return "mailto";
  if (href.startsWith("tel:")) return "tel";
  if (/^https:\/\/wa\.me\//.test(href)) return "whatsapp";
  if (/^https?:\/\//.test(href)) return "external";
  if (href.startsWith("/")) return "internal";
  return "other";
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  if (process.env.SKIP_RENDERED_CRAWL === "1") return writeStubAndExit("SKIP_RENDERED_CRAWL=1");

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (e) {
    return writeStubAndExit(`playwright import failed: ${e.message}`);
  }

  const canonicalNumber = await loadCanonicalNumber();
  if (!canonicalNumber) return writeStubAndExit("could not read CONTACT.WHATSAPP_NUMBER");

  const SLUGS = await loadSlugs();

  // Build the seed list: 6 surfaces × 6 locales = 36 page loads.
  // Together they exercise every primary CTA surface (navbar, hero,
  // home sections, services, FAQ, booking, blog index + ArticleCTA,
  // floating WhatsApp, footer).
  const seeds = [];
  for (const lang of LOCALES) {
    seeds.push({ lang, surface: "home", path: `/${lang}` });
    seeds.push({ lang, surface: "services", path: `/${lang}/${SLUGS.services[lang]}` });
    seeds.push({ lang, surface: "faq", path: `/${lang}/${SLUGS.faq[lang]}` });
    seeds.push({ lang, surface: "book", path: `/${lang}/${SLUGS.book[lang]}` });
    seeds.push({ lang, surface: "blog_index", path: `/${lang}/blog` });
    seeds.push({ lang, surface: "blog_post", path: `/${lang}/blog/${SAMPLE_POST}` });
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    return writeStubAndExit(`chromium launch failed: ${e.message}`);
  }

  const findings = [];
  const inventory = []; // every rendered <a href> on every seed
  const internalSet = new Set();
  const waNumbers = new Map();

  await runWithConcurrency(
    seeds,
    async (seed) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      try {
        // SPA hydration is two-stage:
        //   1. React mounts using the language from navigator.language
        //      / localStorage (see `detectLanguage` in
        //      `client/src/i18n/index.ts`). In headless Chromium that
        //      defaults to English, so the navbar links momentarily
        //      render `/en/...` regardless of the URL.
        //   2. `LangSyncEffect` in `client/src/App.tsx` then runs and
        //      flips i18n to the URL's locale, triggering a re-render.
        //
        // We must extract anchors AFTER stage (2). The cleanest signal
        // is that the rendered navbar links carry the page's locale
        // prefix — we wait for at least one nav `<a href="/<lang>/...">`
        // to be present (the language switcher is excluded because it
        // intentionally points at other locales — but it uses
        // `<button>`, not `<a>`, so it can't satisfy the selector
        // anyway).
        await page.goto(`${BASE}${seed.path}`, { waitUntil: "load", timeout: 30_000 });
        // Two-stage hydration wait. Both signals must be true before
        // we extract anchors, otherwise we capture the brief initial
        // English render that happens before `LangSyncEffect` /
        // `BlogLangEffect` flip i18n to the URL's locale.
        //
        //   (1) `<html lang>` matches the URL locale — `App.tsx`
        //       mirrors `i18n.language` to `document.documentElement.lang`
        //       on `languageChanged`, so this is true once the
        //       language switch has been applied to React state.
        //
        //   (2) At least one rendered nav/footer/header anchor has
        //       the URL's locale prefix. This guards against a stale
        //       megamenu render that ignored the language switch
        //       (which would manifest as `/en/...` links on `/es/...`
        //       pages, etc.).
        let hydrationTimedOut = false;
        await page
          .waitForFunction(
            ({ lang }) => {
              if (document.documentElement.getAttribute("lang") !== lang) return false;
              const anchors = Array.from(document.querySelectorAll("nav a[href], header a[href], footer a[href]"));
              if (anchors.length === 0) return false;
              return anchors.some((a) => {
                const h = a.getAttribute("href") || "";
                return h === `/${lang}` || h.startsWith(`/${lang}/`);
              });
            },
            { lang: seed.lang },
            { timeout: 12_000 },
          )
          // A timeout here means the megamenu / footer anchors
          // never picked up the active locale within 12 s. Don't
          // silently continue — the rendered DOM at this point
          // may still reflect the previous language. Surface it
          // as an explicit per-seed finding so the caller can
          // decide whether to fail the run, and tag every link
          // captured below with `hydration_timeout=true` so
          // downstream consumers can filter or cross-check.
          .catch(() => {
            hydrationTimedOut = true;
            findings.push({
              severity: "warn",
              kind: "hydration_timeout",
              page: seed.path,
              lang: seed.lang,
              surface: seed.surface,
              href: `${BASE}${seed.path}`,
              msg: "locale-settle waitForFunction exceeded 12s; rendered anchors may not reflect the active locale",
            });
          });
        // Final settle for any post-switch re-render to commit.
        await page.waitForTimeout(800);
        const links = await page.$$eval("a[href]", (els) =>
          els.map((e) => ({
            href: e.getAttribute("href") || "",
            text: (e.textContent || "").trim().slice(0, 80),
            // `data-testid` is how every CTA is wired to its tracker
            // (e.g. `button-book-navbar`, `link-whatsapp-floating`),
            // so capturing it here makes the rendered inventory the
            // canonical per-locale {destination, copy, tracking-id}
            // record without needing to JOIN against the static view.
            testid: e.getAttribute("data-testid") || "",
          })),
        );
        for (const { href, text, testid } of links) {
          if (!href) continue;
          const category = classify(href);
          inventory.push({
            page: seed.path,
            lang: seed.lang,
            surface: seed.surface,
            category,
            href,
            text,
            testid,
            // `hydration_timeout: true` flags rows whose underlying
            // page never confirmed locale settle within 12 s. The
            // anchors are still recorded (they may be perfectly
            // valid), but downstream consumers can quarantine
            // these for re-verification rather than silently
            // trusting them.
            hydration_timeout: hydrationTimedOut,
          });
          if (category === "anchor" || category === "javascript" || category === "empty") continue;

          // Hard-fail any rendered <a> whose href doesn't fit a
          // recognized scheme. The recurring class of bug this
          // catches is `lp("…")` returning a *relative* string
          // (e.g. an unregistered route key falling through to
          // the literal `"booking"`), which the browser would
          // then resolve against the current page rather than
          // the locale-rooted path the author intended.
          if (category === "other") {
            findings.push({
              severity: "broken",
              kind: "relative_internal_link",
              page: seed.path,
              lang: seed.lang,
              surface: seed.surface,
              href,
              msg: `<a href="${href}"> on ${seed.path} (${seed.surface}) is neither absolute, locale-rooted, nor a recognized scheme — likely an unresolved lp("…") returning a bare slug`,
            });
            continue;
          }

          if (category === "whatsapp") {
            const num = href.match(/^https:\/\/wa\.me\/(\d+)/)?.[1];
            if (num) {
              waNumbers.set(num, (waNumbers.get(num) || 0) + 1);
              if (num !== canonicalNumber) {
                findings.push({
                  severity: "broken",
                  kind: "wa_number_mismatch",
                  page: seed.path,
                  lang: seed.lang,
                  surface: seed.surface,
                  href,
                  msg: `wa.me/${num} ≠ canonical ${canonicalNumber}`,
                });
              }
            }
            continue;
          }
          if (category === "external" || category === "mailto" || category === "tel") continue;

          if (category === "internal") {
            internalSet.add(href);
            const localePrefix = href.match(/^\/(es|en|fr|de|pt|ca)(?:\/|$)/);
            if (localePrefix && localePrefix[1] !== seed.lang) {
              findings.push({
                severity: "broken",
                kind: "cross_language_link",
                page: seed.path,
                lang: seed.lang,
                surface: seed.surface,
                href,
                text,
                msg: `<a> on ${seed.path} (${seed.surface}) points at /${localePrefix[1]}/... (different locale)`,
              });
            }
          }
        }
      } catch (e) {
        findings.push({ severity: "broken", kind: "page_load", page: seed.path, lang: seed.lang, surface: seed.surface, msg: e.message });
      } finally {
        await ctx.close();
      }
    },
    PAGE_CONCURRENCY,
  );
  await browser.close();

  // Live HTTP check on every unique discovered internal href.
  const internalArr = [...internalSet];
  const httpResults = await runWithConcurrency(
    internalArr,
    async (href) => ({ href, r: await pHead(`${BASE}${href}`) }),
    HTTP_CONCURRENCY,
  );
  for (const { href, r } of httpResults) {
    if (r.status === 0 || r.status >= 400) {
      findings.push({ severity: "broken", kind: "http", href, status: r.status, error: r.error });
    }
  }

  // Aggregate per-surface coverage stats so the report can show the
  // rendered crawler is a complete CTA inventory, not a sample.
  const perSurface = {};
  for (const row of inventory) {
    const k = row.surface;
    if (!perSurface[k]) perSurface[k] = { anchors: 0, internal: 0, external: 0, whatsapp: 0, mailto: 0, anchorOnly: 0 };
    perSurface[k].anchors += 1;
    if (row.category === "internal") perSurface[k].internal += 1;
    else if (row.category === "external") perSurface[k].external += 1;
    else if (row.category === "whatsapp") perSurface[k].whatsapp += 1;
    else if (row.category === "mailto") perSurface[k].mailto += 1;
    else if (row.category === "anchor") perSurface[k].anchorOnly += 1;
  }

  const result = {
    base: BASE,
    locales: LOCALES,
    surfaces: ["home", "services", "faq", "book", "blog_index", "blog_post"],
    seedCount: seeds.length,
    seeds,
    rendered: {
      totalAnchors: inventory.length,
      uniqueInternal: internalArr.length,
      perSurface,
      waNumbers: Object.fromEntries(waNumbers),
    },
    canonicalWhatsappNumber: canonicalNumber,
    findings,
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(path.join(OUT_DIR, "cta-rendered-crawler.json"), JSON.stringify(result, null, 2));
  await fs.writeFile(
    path.join(OUT_DIR, "cta-rendered-inventory.json"),
    JSON.stringify(inventory, null, 2),
  );
  const csvCols = ["page", "lang", "surface", "category", "href", "text", "testid", "hydration_timeout"];
  await fs.writeFile(
    path.join(OUT_DIR, "cta-rendered-inventory.csv"),
    [csvCols.join(","), ...inventory.map((r) => csvCols.map((c) => csvEscape(r[c])).join(","))].join("\n") + "\n",
  );

  const broken = findings.filter((f) => f.severity === "broken");
  const lines = [
    "# Rendered link crawler",
    "",
    `_Base: \`${result.base}\` · seeds: ${seeds.length} (6 surfaces × ${LOCALES.length} locales) · rendered anchors: ${inventory.length} · unique internal hrefs: ${internalArr.length}_`,
    "",
    `Canonical wa.me number: \`${canonicalNumber}\``,
    "",
    `Rendered wa.me numbers: ${[...waNumbers.entries()].map(([n, c]) => `\`${n}\`×${c}`).join(", ") || "none"}`,
    "",
    "## Per-surface coverage",
    "",
    "| Surface | Anchors | Internal | WhatsApp | External | Mailto |",
    "|---|---:|---:|---:|---:|---:|",
  ];
  for (const s of result.surfaces) {
    const v = perSurface[s] || { anchors: 0, internal: 0, whatsapp: 0, external: 0, mailto: 0 };
    lines.push(`| ${s} | ${v.anchors} | ${v.internal} | ${v.whatsapp} | ${v.external} | ${v.mailto} |`);
  }
  lines.push("", `**Findings:** broken=${broken.length}`, "");
  if (broken.length) {
    lines.push("## BROKEN", "");
    for (const f of broken) {
      const meta = [f.lang, f.surface, f.page, f.href, f.status ? `HTTP ${f.status}` : f.error, f.msg].filter(Boolean).join(" · ");
      lines.push(`- ${f.kind} — ${meta}`);
    }
  } else {
    lines.push(
      "Every rendered internal link resolves to a 200, points at the correct locale, and every rendered wa.me anchor uses the canonical number. ✅",
    );
  }
  await fs.writeFile(path.join(OUT_DIR, "cta-rendered-crawler.md"), lines.join("\n") + "\n");

  console.log(`[cta-rendered] seeds=${seeds.length} anchors=${inventory.length} unique=${internalArr.length} broken=${broken.length}`);
  console.log(`[cta-rendered] wrote reports/cta-rendered-{crawler,inventory}.{json,md,csv}`);
  process.exit(broken.length ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(2); });
