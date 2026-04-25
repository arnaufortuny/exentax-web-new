#!/usr/bin/env node
/*
 * blog-cta-validate.mjs
 * ----------------------------------------------------------------------------
 * Verifies the editorial CTA contract for every blog article in every
 * supported locale.
 *
 * Contract (Task #6 v2 — step 2; refined by Task #11; tightened post
 * Task #6 closure when `pricing_quote` was retired):
 *
 *  1. (RETIRED) The `pricing_quote` CTA pattern and its `calc_savings`
 *     mid-CTA variant were removed because their copy was deemed
 *     price-adjacent under Task #6's strict reading. As a consequence,
 *     no article is required to anchor to /<lang>#calculadora anymore.
 *     The four remaining approved mid-CTA variants (`free_consult`,
 *     `start_today`, `talk_to_team`, `discover_llc`) route to /servicios,
 *     /agendar or /contacto and intentionally do not link to the
 *     calculator hash.
 *
 *  2. CTAs must NEVER point to a different language hash. An EN article
 *     pointing to /es#calculadora is a critical bug because it sends the
 *     reader to a Spanish landing page mid-funnel. (The localised
 *     calculator hash on each /<lang> home page still exists and may be
 *     linked by editorial discretion; this rule only forbids the wrong
 *     locale.)
 *
 *  3. CTAs must NEVER point to legacy or unlocalised paths
 *     ("/calculadora", "/contact", "/contacto" without lang prefix, etc.).
 *
 *  4. As an editorial signal, an article should expose at least one
 *     contextual conversion entry — either an in-body calculator-hash
 *     anchor OR a contact link of the shape /<lang>/contacto. Articles
 *     that lack both are flagged as a warning (not fatal) so the editor
 *     can review them. (Calculator-hash anchors remain a valid editorial
 *     conversion signal even after the `pricing_quote` retirement.)
 *
 *  5. Trailing-paragraph contract (Task #47): the trailing line inside
 *     EVERY `<!-- exentax:cta-v1 -->` block (after stripping the optional
 *     inner `cta-conv-v1` sub-block) MUST verbatim match the canonical
 *     line built from the standardised CTA library:
 *
 *         <pattern.desc> <a href="<localized-route>"><pattern.primary></a>.
 *
 *     The `(pattern, route)` pair is resolved from the slug via the same
 *     map + heuristic the runtime uses (`blog-cta-routes.ts` →
 *     `getBlogCtaTarget`), and the localized URL is resolved from
 *     `shared/routes.ts` (ROUTE_SLUGS). Drift — including the legacy
 *     "Reserva una consulta con nuestro equipo" generic line, edits to
 *     the destination route, or any other off-pattern variant — is
 *     reported as the critical `off-pattern-cta-line` and fails the gate.
 *     A start tag without a matching end tag is reported as
 *     `malformed-cta-block`. A pattern that is declared in the routes map
 *     but missing from the library is reported as `unknown-cta-pattern`.
 *
 * Exits 0 when there are zero criticals; warnings never fail the gate.
 * Wired by `scripts/blog-validate-all.mjs`.
 * ----------------------------------------------------------------------------
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

const CALC_HASH = "#calculadora";

const ROUTES_FILE = path.join(ROOT, "client/src/data/blog-cta-routes.ts");
const LIBRARY_FILE = path.join(ROOT, "client/src/data/blog-cta-library.ts");
const SHARED_ROUTES_FILE = path.join(ROOT, "shared/routes.ts");

const CTA_PATTERNS = [
  "book_consultation",
  "llc_florida_specific",
  "llc_state_compare",
  "itin_help",
  "services_overview",
  "compliance_checkup",
];

// --- Parse shared/routes.ts → ROUTE_SLUGS[key][lang] = "lang-slug-fragment" -
function parseRouteSlugs() {
  const src = fs.readFileSync(SHARED_ROUTES_FILE, "utf8");
  const blockRx = /export const ROUTE_SLUGS[\s\S]*?=\s*\{([\s\S]*?)\n\};/m;
  const block = src.match(blockRx);
  if (!block) throw new Error("ROUTE_SLUGS block not found in shared/routes.ts");
  const map = {};
  const lineRx = /^\s*([a-z_]+):\s*\{([^}]*)\},?\s*$/gm;
  let m;
  while ((m = lineRx.exec(block[1])) !== null) {
    const key = m[1];
    const inner = m[2];
    map[key] = {};
    const cellRx = /(es|en|fr|de|pt|ca):\s*"([^"]*)"/g;
    let c;
    while ((c = cellRx.exec(inner)) !== null) {
      map[key][c[1]] = c[2];
    }
  }
  return map;
}

function getLocalizedPath(routeSlugs, key, lang) {
  const slug = routeSlugs[key]?.[lang];
  if (slug === undefined) throw new Error(`Unknown route ${key} for ${lang}`);
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

// --- Parse blog-cta-routes.ts MAP + HEURISTIC -------------------------------
function parseRoutes() {
  const src = fs.readFileSync(ROUTES_FILE, "utf8");
  const map = {};
  const entryRx = /^\s*"([^"]+)":\s*\{\s*route:\s*"([^"]+)"(?:,\s*secondaryRoute:\s*"[^"]+")?(?:,\s*pattern:\s*"([^"]+)")?\s*\}/gm;
  let m;
  while ((m = entryRx.exec(src)) !== null) {
    map[m[1]] = { route: m[2], pattern: m[3] };
  }
  // Mirror getBlogCtaTarget() heuristic in blog-cta-routes.ts.
  const heuristic = [
    { re: /\bnuevo-mexico\b/, route: "service_llc_nm", pattern: "llc_state_compare" },
    { re: /\bwyoming\b/,      route: "service_llc_wy", pattern: "llc_state_compare" },
    { re: /\bdelaware\b/,     route: "service_llc_de", pattern: "llc_state_compare" },
    { re: /\bflorida\b/,      route: "service_llc_fl", pattern: "llc_florida_specific" },
    { re: /\bitin\b/,         route: "service_itin",   pattern: "itin_help" },
  ];
  return { map, heuristic };
}

function getTarget(routes, slug) {
  if (slug in routes.map) return routes.map[slug];
  for (const h of routes.heuristic) {
    if (h.re.test(slug)) return { route: h.route, pattern: h.pattern };
  }
  return { route: "book", pattern: "book_consultation" };
}

// --- Parse blog-cta-library.ts → LIBRARY[pattern][lang] = {desc,primary} ----
function parseLibrary() {
  const src = fs.readFileSync(LIBRARY_FILE, "utf8");
  const lib = {};
  for (const p of CTA_PATTERNS) {
    const pRx = new RegExp(`\\n  ${p}:\\s*\\{([\\s\\S]*?)\\n  \\},`, "m");
    const pm = src.match(pRx);
    if (!pm) throw new Error(`Pattern ${p} not found in library`);
    const pBody = pm[1];
    lib[p] = {};
    for (const lang of LANGS) {
      const lRx = new RegExp(`\\n    ${lang}:\\s*\\{([\\s\\S]*?)\\n    \\},`);
      const lm = pBody.match(lRx);
      if (!lm) throw new Error(`Lang ${lang} not found in pattern ${p}`);
      const lBody = lm[1];
      const get = (field) => {
        const r = new RegExp(`${field}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
        const mm = lBody.match(r);
        if (!mm) throw new Error(`Field ${field} missing in ${p}/${lang}`);
        return mm[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      };
      lib[p][lang] = { desc: get("desc"), primary: get("primary") };
    }
  }
  return lib;
}

function buildExpectedTrailing(copy, url) {
  const desc = copy.desc.trim();
  const sep = /[.!?]$/.test(desc) ? "" : ".";
  return `${desc}${sep} <a href="${url}">${copy.primary}</a>.`;
}

// Lazy-loaded contract bundle so `checkArticle` can stay a free function.
let _contract = null;
function getContract() {
  if (_contract) return _contract;
  _contract = {
    routeSlugs: parseRouteSlugs(),
    routes: parseRoutes(),
    library: parseLibrary(),
  };
  return _contract;
}

/** Extract the trailing paragraph (the part after the optional inner
 *  cta-conv-v1 sub-block) from EVERY exentax:cta-v1 block in `src`.
 *  Returns an array of `{ index, trailing }` (1-based block index) so the
 *  caller can validate each block independently. An empty array means
 *  the file has no cta-v1 block. A `trailing` value of `null` indicates a
 *  malformed block (start tag without a matching end tag) — the caller
 *  treats that as a hard failure. */
function extractTrailingParagraphs(src) {
  const startTag = "<!-- exentax:cta-v1 -->";
  const endTag = "<!-- /exentax:cta-v1 -->";
  const out = [];
  let cursor = 0;
  let n = 0;
  while (true) {
    const startIdx = src.indexOf(startTag, cursor);
    if (startIdx === -1) break;
    n += 1;
    const endIdx = src.indexOf(endTag, startIdx + startTag.length);
    if (endIdx === -1) {
      out.push({ index: n, trailing: null });
      break;
    }
    let inner = src.slice(startIdx + startTag.length, endIdx);
    // Strip any inner conv sub-block, including a single trailing newline.
    inner = inner.replace(
      /<!-- exentax:cta-conv-v1 -->[\s\S]*?<!-- \/exentax:cta-conv-v1 -->\n?/,
      "",
    );
    out.push({ index: n, trailing: inner.trim() });
    cursor = endIdx + endTag.length;
  }
  return out;
}

function listArticles(lang) {
  const dir = path.join(ROOT, "client/src/data/blog-content", lang);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => ({ slug: f.replace(/\.ts$/, ""), file: path.join(dir, f) }));
}

function rel(p) {
  return path.relative(ROOT, p);
}

function checkArticle(lang, slug, file) {
  const src = fs.readFileSync(file, "utf8");
  const criticals = [];
  const warnings = [];

  // Note (post Task #6): the `pricing_quote` pattern and its
  // `calc_savings` mid-CTA variant were retired, so the per-locale gate
  // that used to *require* a `/${lang}${CALC_HASH}` anchor for
  // `pricing_quote` articles was removed. The four remaining approved
  // mid-CTA variants (`free_consult`, `start_today`, `talk_to_team`,
  // `discover_llc`) route to /servicios, /agendar or /contacto and
  // intentionally do not link to the calculator hash. We still tally
  // calculator-hash anchors here because:
  //   (a) the editorial signal "no-conversion-entry" warning below
  //       counts a calc-hash link as a valid conversion entry alongside
  //       /contacto, and
  //   (b) the cross-language leak guard checks for wrong-locale calc
  //       anchors — the calculator hash itself still exists on the
  //       localised home pages.
  const calcRx = new RegExp(`href=\"/${lang}${CALC_HASH}\"`, "g");
  const calcMatches = src.match(calcRx) || [];

  // Cross-language calculator hash leak (e.g. /es#calculadora inside an EN
  // article).
  for (const otherLang of LANGS) {
    if (otherLang === lang) continue;
    const wrongRx = new RegExp(`href=\"/${otherLang}${CALC_HASH}\"`, "g");
    if (wrongRx.test(src)) {
      criticals.push({
        lang,
        slug,
        file: rel(file),
        kind: "cross-language-cta",
        message: `Article points to /${otherLang}${CALC_HASH}; expected /${lang}${CALC_HASH}.`,
      });
    }
    const wrongContactRx = new RegExp(`href=\"/${otherLang}/contacto\"`, "g");
    if (wrongContactRx.test(src)) {
      criticals.push({
        lang,
        slug,
        file: rel(file),
        kind: "cross-language-contact",
        message: `Article points to /${otherLang}/contacto; expected /${lang}/contacto.`,
      });
    }
  }

  // Legacy / unlocalised CTA paths.
  const LEGACY = [
    /href=\"\/calculadora(?:["#?])/,
    /href=\"\/contacto(?:["#?])/,
    /href=\"\/contact(?:["#?])/,
    /href=\"#calculadora\"/,
  ];
  for (const rx of LEGACY) {
    if (rx.test(src)) {
      criticals.push({
        lang,
        slug,
        file: rel(file),
        kind: "legacy-cta",
        message: `Legacy / unlocalised CTA path matched ${rx}.`,
      });
    }
  }

  // Trailing-paragraph contract: the line inside <!-- exentax:cta-v1 -->,
  // after stripping any inner cta-conv-v1 sub-block, must verbatim match
  // the canonical "<desc> <a href=URL>primary</a>." line built from the
  // pattern declared for this slug+lang in blog-cta-library / -routes.
  // Catches editors reverting an article to a generic
  // "Reserva una consulta con nuestro equipo" line.
  const blocks = extractTrailingParagraphs(src);
  if (blocks.length > 0) {
    const { routes, library, routeSlugs } = getContract();
    const target = getTarget(routes, slug);
    const copy = library[target.pattern]?.[lang];
    if (!copy) {
      // Defensive: getTarget() always returns a pattern today (MAP entries,
      // HEURISTIC and DEFAULT all carry one), but if a future edit drops
      // the `pattern:` field from a routes entry, fail loudly instead of
      // silently waving the article through.
      criticals.push({
        lang,
        slug,
        file: rel(file),
        kind: "unknown-cta-pattern",
        message:
          `Slug resolves to pattern "${target.pattern}" but no copy exists ` +
          `for it in blog-cta-library.ts (lang ${lang}). Trailing-paragraph ` +
          `contract cannot be evaluated.`,
      });
    } else {
      const url = getLocalizedPath(routeSlugs, target.route, lang);
      const expected = buildExpectedTrailing(copy, url);
      for (const { index, trailing } of blocks) {
        if (trailing === null) {
          criticals.push({
            lang,
            slug,
            file: rel(file),
            kind: "malformed-cta-block",
            message:
              `cta-v1 block #${index} has an opening tag with no matching ` +
              `<!-- /exentax:cta-v1 -->.`,
          });
          continue;
        }
        if (trailing !== expected) {
          criticals.push({
            lang,
            slug,
            file: rel(file),
            kind: "off-pattern-cta-line",
            message:
              `Inline cta-v1 block #${index} trailing line drifted from the ` +
              `standardised pattern "${target.pattern}" for ${lang}.\n` +
              `       expected: ${expected}\n` +
              `       got:      ${trailing}`,
          });
        }
      }
    }
  }

  // Editorial signal: at least one conversion entry (calc OR contact).
  const hasContact = new RegExp(`href=\"/${lang}/contacto\"`).test(src);
  if (calcMatches.length === 0 && !hasContact) {
    warnings.push({
      lang,
      slug,
      file: rel(file),
      kind: "no-conversion-entry",
      message: `Neither calculator nor /${lang}/contacto link present.`,
    });
  }

  return { criticals, warnings };
}

/** Verify the React-rendered CTA surface (`ArticleCTA` + post.tsx) keeps
 *  the editorial contract: the booking-CTA card is rendered exactly once
 *  per post and carries the canonical `data-testid` hooks used by the
 *  testing suite. This catches accidental component renames, duplicate
 *  inserts, or removal of the testid (which would silently break the
 *  Playwright assertions). */
function checkReactSurface() {
  const criticals = [];
  const warnings = [];
  const cta = path.join(ROOT, "client/src/components/blog/ArticleCTA.tsx");
  const post = path.join(ROOT, "client/src/pages/blog/post.tsx");

  if (!fs.existsSync(cta)) {
    criticals.push({ kind: "missing-ArticleCTA-component", file: rel(cta), message: "ArticleCTA.tsx is missing." });
  } else {
    const src = fs.readFileSync(cta, "utf8");
    if (!/data-testid=\"article-cta-final\"/.test(src)) {
      criticals.push({ kind: "missing-cta-testid", file: rel(cta), message: 'ArticleCTA must expose data-testid="article-cta-final".' });
    }
    if (!/data-testid=\"text-post-cta\"/.test(src)) {
      warnings.push({ kind: "missing-cta-text-testid", file: rel(cta), message: 'ArticleCTA should expose data-testid="text-post-cta" on the title.' });
    }
  }

  if (!fs.existsSync(post)) {
    criticals.push({ kind: "missing-post-page", file: rel(post), message: "post.tsx is missing." });
  } else {
    // Count only real JSX renders. Strip block + line comments first so a
    // mention like `// React-rendered <ArticleCTA>` doesn't count.
    const src = fs.readFileSync(post, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "");
    const renders = (src.match(/<ArticleCTA\b/g) || []).length;
    if (renders === 0) {
      criticals.push({ kind: "ArticleCTA-not-rendered", file: rel(post), message: "post.tsx does not render <ArticleCTA />." });
    } else if (renders > 1) {
      criticals.push({ kind: "ArticleCTA-rendered-twice", file: rel(post), message: `post.tsx renders <ArticleCTA /> ${renders} times; expected exactly 1.` });
    }
  }
  return { criticals, warnings };
}

function main() {
  const allCrit = [];
  const allWarn = [];
  const stats = {};

  // 1. React-rendered surface (component + page wiring).
  const surf = checkReactSurface();
  allCrit.push(...surf.criticals);
  allWarn.push(...surf.warnings);

  // 2. Per-article body scan.
  for (const lang of LANGS) {
    const items = listArticles(lang);
    stats[lang] = items.length;
    for (const { slug, file } of items) {
      const { criticals, warnings } = checkArticle(lang, slug, file);
      allCrit.push(...criticals);
      allWarn.push(...warnings);
    }
  }

  console.log("blog-cta-validate ──");
  for (const lang of LANGS) {
    console.log(`  ${lang}: ${stats[lang]} articles checked`);
  }

  if (allWarn.length) {
    console.log(`\n⚠  ${allWarn.length} warning(s):`);
    for (const w of allWarn.slice(0, 30)) {
      console.log(`   [${w.kind}] ${w.lang}/${w.slug}: ${w.message}`);
    }
    if (allWarn.length > 30) console.log(`   ... and ${allWarn.length - 30} more`);
  }

  if (allCrit.length) {
    console.error(`\n✖ ${allCrit.length} critical CTA issue(s):`);
    for (const c of allCrit) {
      console.error(`   [${c.kind}] ${c.file}: ${c.message}`);
    }
    console.error("\nblog-cta-validate: FAIL\n");
    process.exit(1);
  }

  console.log("\n✓ blog-cta-validate: OK\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkArticle };
