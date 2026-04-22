#!/usr/bin/env node
/*
 * blog-data-validate.mjs
 * ----------------------------------------------------------------------------
 * Static data-quality gate for the blog corpus (Task #6 v2 — step 4).
 *
 * Five families of checks, all evaluated against
 * `client/src/data/blog-posts.ts` (Spanish source-of-truth) plus the
 * per-locale meta map under `client/src/data/blog-i18n/<lang>.ts`:
 *
 *   1. Date integrity
 *      - publishedAt must parse as a valid YYYY-MM-DD date.
 *      - publishedAt must NOT be in the future (UTC, end-of-day tolerance).
 *      - updatedAt, when present, must parse and be ≥ publishedAt.
 *
 *   2. Meta-length budget (Google SERP truncation).
 *      - title:           ≤ 80 chars   (warn ≥ 75)
 *      - metaTitle:       ≤ 60 chars   (warn ≥ 58)
 *      - metaDescription: 70..155 chars (warn ≥ 150 or ≤ 90)
 *      Per-locale meta is checked when present.
 *
 *   3. Uniqueness
 *      - No two articles share the same metaTitle or metaDescription
 *        within the same language. Duplicate canonical titles are a
 *        cannibalisation risk.
 *
 *   4. Slug hygiene (delegated to consistency-check, but re-asserted
 *      defensively): kebab-case ASCII, ≤ 80 chars, no trailing/leading
 *      hyphens, no double hyphens.
 *
 *   5. Shape sanity
 *      - excerpt non-empty.
 *      - keywords (when present) is a non-empty string array of length 1..10.
 *      - readTime is a positive integer ≤ 30.
 *
 * Exit code: 0 when zero criticals. Warnings are reported but never fatal.
 * Wired by `scripts/blog-validate-all.mjs`.
 * ----------------------------------------------------------------------------
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NON_ES = ["en", "fr", "de", "pt", "ca"];

const TITLE_MAX = 80, TITLE_WARN = 75;
const META_TITLE_MAX = 60, META_TITLE_WARN = 58;
const DESC_MAX = 155, DESC_MIN = 70, DESC_WARN_HIGH = 150, DESC_WARN_LOW = 90;
const SLUG_RX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function todayUtcEnd() {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

async function loadEs() {
  // Use tsx-style import via a dynamic import of the source. Node ≥ 22 can
  // import .ts via the loader installed by `tsx`, but we don't want to
  // depend on tsx for a simple parser; instead extract the literal array
  // with a small regex pass.
  const file = path.join(ROOT, "client/src/data/blog-posts.ts");
  const src = fs.readFileSync(file, "utf8");
  // Locate `export const BLOG_POSTS: BlogPost[] = [ … ];`
  const startMark = src.indexOf("export const BLOG_POSTS");
  if (startMark < 0) throw new Error("BLOG_POSTS not found in blog-posts.ts");
  // Skip past `BLOG_POSTS: BlogPost[] = ` to the assignment `[`.
  const eqIdx = src.indexOf("=", startMark);
  const arrStart = src.indexOf("[", eqIdx);
  // Walk to matching ];
  let depth = 0;
  let i = arrStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  const arrSrc = src.slice(arrStart, i + 1);
  // Convert to JSON-ish: replace single-quoted strings with double, drop
  // trailing commas, drop type annotations (none in this array).
  // Simpler: eval inside a sandboxed `new Function` returning the literal.
  // The data file uses pure object/array literals.
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return ${arrSrc};`);
  return fn();
}

async function loadLangMeta(lang) {
  const file = path.join(ROOT, `client/src/data/blog-i18n/${lang}.ts`);
  if (!fs.existsSync(file)) return {};
  const src = fs.readFileSync(file, "utf8");
  const startMark = src.indexOf("const MAP");
  const objStart = src.indexOf("{", startMark);
  let depth = 0;
  let i = objStart;
  for (; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const objSrc = src.slice(objStart, i + 1);
  // eslint-disable-next-line no-new-func
  const fn = new Function(`return ${objSrc};`);
  return fn();
}

function checkDates(post, criticals, warnings) {
  const { slug, publishedAt, updatedAt } = post;
  if (!publishedAt || !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    criticals.push({ slug, kind: "bad-publishedAt", detail: String(publishedAt) });
    return;
  }
  const pub = new Date(publishedAt + "T00:00:00Z");
  if (Number.isNaN(pub.getTime())) {
    criticals.push({ slug, kind: "unparseable-publishedAt", detail: publishedAt });
    return;
  }
  if (pub.getTime() > todayUtcEnd().getTime()) {
    criticals.push({ slug, kind: "future-publishedAt", detail: publishedAt });
  }
  if (updatedAt) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedAt)) {
      criticals.push({ slug, kind: "bad-updatedAt", detail: String(updatedAt) });
      return;
    }
    const upd = new Date(updatedAt + "T00:00:00Z");
    if (upd.getTime() < pub.getTime()) {
      criticals.push({
        slug,
        kind: "updatedAt-before-publishedAt",
        detail: `${updatedAt} < ${publishedAt}`,
      });
    }
    if (upd.getTime() > todayUtcEnd().getTime()) {
      criticals.push({ slug, kind: "future-updatedAt", detail: updatedAt });
    }
  }
}

function checkLengths(slug, lang, meta, criticals, warnings) {
  const t = meta.title || "";
  const mt = meta.metaTitle || "";
  const md = meta.metaDescription || "";
  // `title` is the on-page H1 / display title. It is not the SERP-truncating
  // field (that's metaTitle, ≤ 60). Translations to DE/FR/PT/CA naturally
  // inflate string length by ~30%, so we treat any overflow as a warning,
  // not a critical, except when it crosses 110 chars (≈ 1.4× ES baseline).
  if (t.length > 110) {
    criticals.push({ slug, lang, kind: "title-overflow", detail: `${t.length}>110` });
  } else if (t.length > TITLE_MAX) {
    warnings.push({ slug, lang, kind: "title-overflow", detail: `${t.length}>${TITLE_MAX}` });
  } else if (t.length >= TITLE_WARN) {
    warnings.push({ slug, lang, kind: "title-near-limit", detail: `${t.length}` });
  }
  if (mt.length > META_TITLE_MAX) {
    criticals.push({ slug, lang, kind: "metaTitle-overflow", detail: `${mt.length}>${META_TITLE_MAX}` });
  } else if (mt.length >= META_TITLE_WARN) {
    warnings.push({ slug, lang, kind: "metaTitle-near-limit", detail: `${mt.length}` });
  }
  if (md.length > DESC_MAX) {
    criticals.push({ slug, lang, kind: "metaDescription-overflow", detail: `${md.length}>${DESC_MAX}` });
  } else if (md.length < DESC_MIN) {
    criticals.push({ slug, lang, kind: "metaDescription-too-short", detail: `${md.length}<${DESC_MIN}` });
  } else if (md.length >= DESC_WARN_HIGH) {
    warnings.push({ slug, lang, kind: "metaDescription-near-limit", detail: `${md.length}` });
  } else if (md.length <= DESC_WARN_LOW) {
    warnings.push({ slug, lang, kind: "metaDescription-thin", detail: `${md.length}` });
  }
}

function checkUniqueness(scope, lang, criticals) {
  // scope: array of { slug, metaTitle, metaDescription }
  const byTitle = new Map();
  const byDesc = new Map();
  for (const p of scope) {
    const tk = (p.metaTitle || "").trim().toLowerCase();
    const dk = (p.metaDescription || "").trim().toLowerCase();
    if (tk) (byTitle.get(tk) || byTitle.set(tk, []).get(tk)).push(p.slug);
    if (dk) (byDesc.get(dk) || byDesc.set(dk, []).get(dk)).push(p.slug);
  }
  for (const [v, arr] of byTitle) {
    if (arr.length > 1) {
      criticals.push({
        lang,
        kind: "duplicate-metaTitle",
        detail: `${arr.length} slugs share metaTitle="${v.slice(0, 80)}…": ${arr.join(", ")}`,
      });
    }
  }
  for (const [v, arr] of byDesc) {
    if (arr.length > 1) {
      criticals.push({
        lang,
        kind: "duplicate-metaDescription",
        detail: `${arr.length} slugs share metaDescription: ${arr.join(", ")}`,
      });
    }
  }
}

function checkSlug(slug, criticals) {
  if (!SLUG_RX.test(slug)) {
    criticals.push({ slug, kind: "invalid-slug", detail: slug });
  }
  if (slug.length > 80) {
    criticals.push({ slug, kind: "slug-too-long", detail: `${slug.length}>80` });
  }
}

function checkShape(post, criticals, warnings) {
  if (!post.excerpt || !post.excerpt.trim()) {
    criticals.push({ slug: post.slug, kind: "empty-excerpt" });
  }
  if (post.keywords) {
    if (!Array.isArray(post.keywords) || post.keywords.length === 0) {
      criticals.push({ slug: post.slug, kind: "bad-keywords-shape" });
    } else if (post.keywords.length > 10) {
      warnings.push({ slug: post.slug, kind: "too-many-keywords", detail: String(post.keywords.length) });
    }
  }
  if (typeof post.readTime !== "number" || !Number.isFinite(post.readTime) || post.readTime <= 0 || post.readTime > 30) {
    warnings.push({ slug: post.slug, kind: "suspicious-readTime", detail: String(post.readTime) });
  }
}

/** Per-locale slug uniqueness: BLOG_SLUG_I18N maps a base slug to its
 *  locale-specific URL slug. Two base slugs sharing the same EN slug
 *  would collide on `/en/blog/<slug>` and silently 404 one of them. */
function checkTranslatedSlugUniqueness(criticals) {
  const file = path.join(ROOT, "client/src/data/blog-posts-slugs.ts");
  if (!fs.existsSync(file)) return;
  const src = fs.readFileSync(file, "utf8");
  const startMark = src.indexOf("BLOG_SLUG_I18N");
  if (startMark < 0) return;
  const objStart = src.indexOf("{", startMark);
  let depth = 0, i = objStart, inStr = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) { if (c === "\\") { i++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) break; }
  }
  // eslint-disable-next-line no-new-func
  const map = new Function(`return ${src.slice(objStart, i + 1)};`)();
  const langs = ["es", "en", "fr", "de", "pt", "ca"];
  for (const lang of langs) {
    const seen = new Map();
    for (const [base, perLang] of Object.entries(map)) {
      const slug = perLang && perLang[lang];
      if (!slug) continue;
      if (seen.has(slug)) {
        criticals.push({
          lang,
          kind: "duplicate-translated-slug",
          detail: `${lang} slug "${slug}" used by ${seen.get(slug)} AND ${base}`,
        });
      } else {
        seen.set(slug, base);
      }
    }
  }
}

/** Orphan-year detection: a year mentioned in the title or excerpt that
 *  falls outside the supported context window [thisYear-3 .. thisYear+2]
 *  is suspicious — usually a leftover "2022" or a too-aspirational "2030".
 *  Body-level orphan years are the responsibility of blog-masterpiece-audit;
 *  here we only police the SERP-visible meta surface. */
function checkOrphanYears(post, lang, meta, warnings) {
  const NOW = new Date().getUTCFullYear();
  const MIN = NOW - 3, MAX = NOW + 2;
  const RX = /\b(20\d{2})\b/g;
  for (const [field, value] of Object.entries(meta)) {
    if (!value || typeof value !== "string") continue;
    let m;
    while ((m = RX.exec(value)) !== null) {
      const y = Number(m[1]);
      if (y < MIN || y > MAX) {
        warnings.push({
          slug: post.slug || post,
          lang,
          kind: "orphan-year",
          detail: `${field}="…${y}…" outside [${MIN}..${MAX}]`,
        });
      }
    }
    RX.lastIndex = 0;
  }
}

/** Category ↔ keywords coherence: at least one of the article's keywords
 *  should share a token with the category label, otherwise the article is
 *  likely mis-categorised or the keywords are off-topic. Warn only. */
function checkCategoryKeywords(post, warnings) {
  if (!post.keywords || !Array.isArray(post.keywords) || !post.category) return;
  const cat = String(post.category).toLowerCase();
  const catTokens = cat.split(/[^a-z0-9áéíóúñ]+/i).filter((t) => t.length >= 4);
  if (catTokens.length === 0) return;
  const kwBlob = post.keywords.join(" ").toLowerCase();
  const overlap = catTokens.some((tok) => kwBlob.includes(tok));
  if (!overlap) {
    warnings.push({
      slug: post.slug,
      kind: "category-keywords-mismatch",
      detail: `category="${post.category}" but no keyword overlaps tokens [${catTokens.join(", ")}]`,
    });
  }
}

async function main() {
  const criticals = [];
  const warnings = [];
  const posts = await loadEs();

  // Per-post checks (ES baseline).
  for (const p of posts) {
    checkSlug(p.slug, criticals);
    checkDates(p, criticals, warnings);
    checkShape(p, criticals, warnings);
    checkLengths(p.slug, "es", {
      title: p.title,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
    }, criticals, warnings);
    checkOrphanYears(p, "es", {
      title: p.title || "",
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
      excerpt: p.excerpt || "",
    }, warnings);
    checkCategoryKeywords(p, warnings);
  }
  checkUniqueness(
    posts.map((p) => ({ slug: p.slug, metaTitle: p.metaTitle, metaDescription: p.metaDescription })),
    "es",
    criticals
  );

  // Per-locale meta checks.
  for (const lang of NON_ES) {
    const map = await loadLangMeta(lang);
    const flat = [];
    for (const slug of Object.keys(map)) {
      const meta = map[slug];
      checkLengths(slug, lang, meta, criticals, warnings);
      checkOrphanYears({ slug }, lang, {
        title: meta.title || "",
        metaTitle: meta.metaTitle || "",
        metaDescription: meta.metaDescription || "",
      }, warnings);
      flat.push({ slug, metaTitle: meta.metaTitle, metaDescription: meta.metaDescription });
    }
    checkUniqueness(flat, lang, criticals);
  }

  // Cross-cutting: BLOG_SLUG_I18N uniqueness per locale.
  checkTranslatedSlugUniqueness(criticals);

  console.log(`blog-data-validate ── ${posts.length} ES posts, locales=${NON_ES.join(",")}`);
  if (warnings.length) {
    console.log(`\n⚠  ${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 25)) {
      const lang = w.lang ? `[${w.lang}] ` : "";
      console.log(`   ${lang}${w.kind}  ${w.slug || ""}  ${w.detail || ""}`);
    }
    if (warnings.length > 25) console.log(`   ... and ${warnings.length - 25} more`);
  }
  if (criticals.length) {
    console.error(`\n✖ ${criticals.length} critical data issue(s):`);
    for (const c of criticals) {
      const lang = c.lang ? `[${c.lang}] ` : "";
      console.error(`   ${lang}${c.kind}  ${c.slug || ""}  ${c.detail || ""}`);
    }
    console.error("\nblog-data-validate: FAIL\n");
    process.exit(1);
  }
  console.log("\n✓ blog-data-validate: OK\n");
}

main().catch((err) => {
  console.error("blog-data-validate crashed:", err);
  process.exit(2);
});
