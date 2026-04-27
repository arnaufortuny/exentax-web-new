#!/usr/bin/env node
/*
 * blog-official-source-coverage.mjs
 * ----------------------------------------------------------------------------
 * Task #41 gate. Block any future blog article that ships without at least
 * one citation to an official authority domain.
 *
 * Background
 * ----------
 * Task #36 manually added missing official-source citations to the 10
 * remaining articles flagged by CONVERSION-MASTERPLAN-REPORT §4.2 ("artículos
 * sin ninguna fuente oficial"). The existing `blog-sources-validate.mjs` step
 * enforces that the structured `SOURCES_BY_SLUG` registry has ≥3 references
 * per slug, but it does NOT enforce that the article BODY contains at least
 * one inline anchor to an official domain — so a new article could ship with
 * a perfectly populated sources block while the prose itself has no
 * authority-grade external link, regressing the §4.2 E-E-A-T baseline.
 *
 * What it checks
 * --------------
 * For every `client/src/data/blog-content/{es,en,fr,de,pt,ca}/*.ts` file:
 *
 *   1. Extract every `<a href="https?://…" …>` anchor.
 *   2. The article passes when at least one anchor satisfies ALL of:
 *        a. The hostname ends with one of the §4.2 official-domain suffixes
 *           (irs.gov, fincen.gov, agenciatributaria.gob.es, seg-social.es,
 *           boe.es, hmrc.gov.uk, gov.uk, urssaf.fr, impots.gouv.fr,
 *           bundesfinanzministerium.de, gesetze-im-internet.de,
 *           portaldasfinancas.gov.pt, at.gov.pt, gencat.cat, oecd.org,
 *           europa.eu, eur-lex.europa.eu).
 *        b. The anchor opens in a new tab (`target="_blank"`).
 *        c. The anchor includes `rel="…noopener…"` (security + SEO contract
 *           already enforced 100% across the corpus per §4.2 of the report).
 *
 * Per-locale counts (articles total / with-official / without-official) are
 * printed for visibility on every run. Any article without at least one
 * compliant anchor is reported as a critical and the gate fails (exit 1).
 *
 * Wired into `scripts/blog-validate-all.mjs` as the `official-source-coverage`
 * step so `npm run blog:validate-all` (and CI) blocks regressions.
 * ----------------------------------------------------------------------------
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLOG_CONTENT_DIR = path.join(ROOT, "client/src/data/blog-content");

const LOCALES = ["es", "en", "fr", "de", "pt", "ca"];

// §4.2 narrow whitelist (CONVERSION-MASTERPLAN-REPORT.md). Entries are
// hostname suffixes; an anchor counts when its `URL.hostname` either equals
// the suffix or ends with `.<suffix>` (so `www.irs.gov` matches `irs.gov`
// and `sede.agenciatributaria.gob.es` matches `agenciatributaria.gob.es`).
const OFFICIAL_HOST_SUFFIXES = [
  "irs.gov",
  "fincen.gov",
  "agenciatributaria.gob.es",
  "seg-social.es",
  "boe.es",
  "hmrc.gov.uk",
  "gov.uk",
  "urssaf.fr",
  "impots.gouv.fr",
  "bundesfinanzministerium.de",
  "gesetze-im-internet.de",
  "portaldasfinancas.gov.pt",
  "at.gov.pt",
  "gencat.cat",
  "oecd.org",
  "europa.eu",
  "eur-lex.europa.eu",
];

const ANCHOR_RX = /<a\b([^>]*?)href=("|')(https?:\/\/[^"']+)\2([^>]*)>/gi;

function isOfficialHost(host) {
  const h = host.toLowerCase();
  return OFFICIAL_HOST_SUFFIXES.some(
    (suf) => h === suf || h.endsWith(`.${suf}`),
  );
}

function attrHas(attrs, name, valueRx) {
  const rx = new RegExp(`\\b${name}=("|')([^"']*)\\1`, "i");
  const m = attrs.match(rx);
  if (!m) return false;
  return valueRx.test(m[2]);
}

function articleHasOfficialAnchor(src) {
  ANCHOR_RX.lastIndex = 0;
  let m;
  while ((m = ANCHOR_RX.exec(src)) !== null) {
    const preAttrs = m[1] || "";
    const url = m[3];
    const postAttrs = m[4] || "";
    const attrs = `${preAttrs} ${postAttrs}`;
    let host;
    try { host = new URL(url).hostname; } catch { continue; }
    if (!isOfficialHost(host)) continue;
    if (!attrHas(attrs, "target", /^_blank$/i)) continue;
    if (!attrHas(attrs, "rel", /\bnoopener\b/i)) continue;
    return true;
  }
  return false;
}

function listLocaleArticles(locale) {
  const dir = path.join(BLOG_CONTENT_DIR, locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => path.join(dir, f));
}

function main() {
  console.log("blog-official-source-coverage ── §4.2 inline-citation gate\n");

  const criticals = [];
  const perLocale = {};
  let total = 0;
  let withOfficial = 0;

  for (const locale of LOCALES) {
    const files = listLocaleArticles(locale);
    let okCount = 0;
    const missing = [];
    for (const file of files) {
      const src = readFileSync(file, "utf8");
      if (articleHasOfficialAnchor(src)) {
        okCount += 1;
      } else {
        missing.push(path.relative(ROOT, file));
      }
    }
    perLocale[locale] = {
      total: files.length,
      ok: okCount,
      missing: missing.length,
    };
    total += files.length;
    withOfficial += okCount;
    for (const rel of missing) {
      criticals.push({ locale, file: rel });
    }
  }

  // Per-locale visibility table.
  const pad = (s, n) => String(s).padEnd(n, " ");
  const padR = (s, n) => String(s).padStart(n, " ");
  console.log(
    `  ${pad("locale", 8)} ${padR("articles", 9)} ${padR("with-official", 14)} ${padR("missing", 8)}`,
  );
  console.log(`  ${"-".repeat(8)} ${"-".repeat(9)} ${"-".repeat(14)} ${"-".repeat(8)}`);
  for (const locale of LOCALES) {
    const row = perLocale[locale];
    console.log(
      `  ${pad(locale, 8)} ${padR(row.total, 9)} ${padR(row.ok, 14)} ${padR(row.missing, 8)}`,
    );
  }
  console.log(`  ${"-".repeat(8)} ${"-".repeat(9)} ${"-".repeat(14)} ${"-".repeat(8)}`);
  console.log(
    `  ${pad("TOTAL", 8)} ${padR(total, 9)} ${padR(withOfficial, 14)} ${padR(total - withOfficial, 8)}\n`,
  );

  if (criticals.length) {
    console.error(
      `✖ ${criticals.length} article(s) without any §4.2 official-source citation:`,
    );
    for (const c of criticals.slice(0, 60)) {
      console.error(`   [${c.locale}] ${c.file}`);
    }
    if (criticals.length > 60) {
      console.error(`   ... and ${criticals.length - 60} more`);
    }
    console.error(
      "\nFix: add at least one inline `<a href=\"https://<official-domain>/...\" target=\"_blank\" rel=\"noopener\">` to each flagged article. Whitelist is defined in scripts/blog-official-source-coverage.mjs (mirrors CONVERSION-MASTERPLAN-REPORT.md §4.2).\n",
    );
    console.error("blog-official-source-coverage: FAIL\n");
    process.exit(1);
  }

  console.log("✓ blog-official-source-coverage: OK\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { articleHasOfficialAnchor, OFFICIAL_HOST_SUFFIXES };
