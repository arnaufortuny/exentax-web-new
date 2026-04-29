#!/usr/bin/env node
/**
 * LOTE 8 — Schema markup, Open Graph & Twitter Cards validator.
 *
 * Crawls a sample of every page type across the 6 supported languages,
 * pulls the served HTML over HTTP from the running app on
 * http://localhost:5000, then for each URL:
 *
 *  1. Extracts every <script type="application/ld+json"> block and runs
 *     `JSON.parse` on it strictly. Any syntax error is fatal.
 *  2. Verifies the catalogue of expected JSON-LD types per page kind:
 *       - Home (6 langs):   ProfessionalService(@id) + AggregateRating +
 *                           Organization + WebSite + BreadcrumbList
 *       - Pillar abrir-llc: BreadcrumbList + Article (HowTo when present)
 *       - About-LLC:        BreadcrumbList + Article
 *       - How-we-work:      BreadcrumbList + HowTo
 *       - Our-services:     BreadcrumbList + Service-typed entity
 *       - FAQ:              BreadcrumbList + FAQPage
 *       - Blog index:       BreadcrumbList (light)
 *       - Blog post:        BreadcrumbList + Article + (FAQPage when body
 *                           has the FAQ section)
 *  3. Counts the canonical Open Graph tags and verifies each og:locale:alternate
 *     for the 5 non-current languages is present.
 *  4. Counts the canonical Twitter Cards tags.
 *
 * Output:
 *   - `exentax-web/reports/seo/lote8-schema-og.md`  (per-URL table)
 *   - `exentax-web/reports/seo/lote8-schema-og.json` (machine-readable)
 *
 * Exit code 0 when every check passes, 1 otherwise. Designed to plug
 * into the `seo:check` pipeline with no extra dependencies.
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");
const OUT_DIR = join(REPO, "reports", "seo");
const BASE = process.env.LOTE8_BASE_URL || "http://localhost:5000";

const LANGS = ["es", "en", "fr", "de", "pt", "ca"];

// One-per-language route slugs. Mirrors `shared/routes.ts::ROUTE_SLUGS` but
// kept inline to avoid pulling the TypeScript module under tsx in CI.
const ROUTES = {
  home:        { es: "",                          en: "",                           fr: "",                              de: "",                      pt: "",                         ca: "" },
  about_llc:   { es: "sobre-las-llc",             en: "about-llc",                  fr: "a-propos-des-llc",              de: "uber-llc",              pt: "sobre-llc",                ca: "sobre-les-llc" },
  how_we_work: { es: "como-trabajamos",           en: "how-we-work",                fr: "comment-nous-travaillons",      de: "wie-wir-arbeiten",      pt: "como-trabalhamos",         ca: "com-treballem" },
  our_services:{ es: "servicios",                 en: "services",                   fr: "services",                      de: "leistungen",            pt: "servicos",                 ca: "serveis" },
  faq:         { es: "preguntas-frecuentes",      en: "faq",                        fr: "questions-frequentes",          de: "haufige-fragen",        pt: "perguntas-frequentes",     ca: "preguntes-frequents" },
  pillar:      { es: "abrir-llc-estados-unidos",  en: "open-llc-usa",               fr: "ouvrir-llc-etats-unis",         de: "llc-usa-eroeffnen",     pt: "abrir-llc-eua",            ca: "obrir-llc-eua" },
  service_nm:  { es: "servicios/llc-nuevo-mexico",en: "services/llc-new-mexico",    fr: "services/llc-nouveau-mexique",  de: "leistungen/llc-new-mexico", pt: "servicos/llc-novo-mexico", ca: "serveis/llc-nou-mexic" },
};

const BLOG_INDEX_BY_LANG = (l) => `/${l}/blog`;
// Per-language slug mirrors `client/src/data/blog-posts-slugs.ts::BLOG_SLUG_I18N`
// for the canonical pillar post `llc-estados-unidos-guia-completa-2026`.
const BLOG_POST_BY_LANG = {
  es: "/es/blog/llc-estados-unidos-guia-completa-2026",
  en: "/en/blog/llc-united-states-complete-guide-non-residents-2026",
  fr: "/fr/blog/llc-aux-etats-unis-guide-complet-pour-non-residents-en-2026",
  de: "/de/blog/llc-in-den-usa-vollstandiger-leitfaden-fur-nicht-residenten",
  pt: "/pt/blog/llc-estados-unidos-guia-completo-nao-residentes-2026",
  ca: "/ca/blog/llc-estats-units-guia-completa-no-residents-2026",
};

const LOCALE_MAP = { es: "es_ES", en: "en_US", fr: "fr_FR", de: "de_DE", pt: "pt_PT", ca: "ca_ES" };

const REQUIRED_OG = [
  "og:title", "og:description", "og:url", "og:type", "og:image",
  "og:locale", "og:site_name",
];
const REQUIRED_OG_IMAGE_EXTRAS = ["og:image:width", "og:image:height", "og:image:alt"];
const REQUIRED_TWITTER = [
  "twitter:card", "twitter:title", "twitter:description", "twitter:image",
];

function localized(key, lang) {
  const slug = ROUTES[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

// Pull every Spanish blog slug from `client/src/data/blog-posts.ts`. Lightweight
// regex extraction avoids loading the full TypeScript module under tsx in CI.
function loadAllBlogSlugs() {
  const file = join(REPO, "client", "src", "data", "blog-posts.ts");
  const txt = readFileSync(file, "utf8");
  const slugs = [];
  const re = /^\s+slug:\s*"([^"]+)"/gm;
  let m;
  while ((m = re.exec(txt)) !== null) slugs.push(m[1]);
  return slugs;
}

// Pull the per-language slug map from `client/src/data/blog-posts-slugs.ts` so
// the audit can request the canonical translated URL for every blog post in
// every supported language (113 × 6 = 678 article URLs). When a post has no
// translation entry for a given language, the Spanish slug is reused — that
// matches what `injectMeta::resolveToSpanishSlug` falls back to in production.
function loadBlogSlugI18n() {
  const file = join(REPO, "client", "src", "data", "blog-posts-slugs.ts");
  const txt = readFileSync(file, "utf8");
  const map = {};
  const startIdx = txt.indexOf("BLOG_SLUG_I18N");
  const endIdx = txt.indexOf("\n};", startIdx);
  const slice = txt.slice(startIdx, endIdx);
  const entryRe = /"([^"]+)":\s*\{([^}]+)\}/g;
  let m;
  while ((m = entryRe.exec(slice)) !== null) {
    const esSlug = m[1];
    const body = m[2];
    map[esSlug] = { es: esSlug };
    const fieldRe = /(es|en|fr|de|pt|ca):\s*"([^"]+)"/g;
    let f;
    while ((f = fieldRe.exec(body)) !== null) {
      map[esSlug][f[1]] = f[2];
    }
  }
  return map;
}

function buildSample() {
  const urls = [];
  for (const lang of LANGS) urls.push({ kind: "home",         lang, path: localized("home", lang) });
  for (const lang of LANGS) urls.push({ kind: "about_llc",    lang, path: localized("about_llc", lang) });
  for (const lang of LANGS) urls.push({ kind: "how_we_work",  lang, path: localized("how_we_work", lang) });
  for (const lang of LANGS) urls.push({ kind: "our_services", lang, path: localized("our_services", lang) });
  for (const lang of LANGS) urls.push({ kind: "faq",          lang, path: localized("faq", lang) });
  for (const lang of LANGS) urls.push({ kind: "pillar",       lang, path: localized("pillar", lang) });
  for (const lang of LANGS) urls.push({ kind: "service_nm",   lang, path: localized("service_nm", lang) });
  for (const lang of LANGS) urls.push({ kind: "blog_index",   lang, path: BLOG_INDEX_BY_LANG(lang) });
  for (const lang of LANGS) urls.push({ kind: "blog_post",    lang, path: BLOG_POST_BY_LANG[lang] });
  // Full per-language coverage of every blog post. For every Spanish slug we
  // request /{lang}/blog/{translated-slug}; when a translation entry is
  // missing the Spanish slug is reused (production server falls back via
  // resolveToSpanishSlug). 113 posts × 6 langs ≈ 678 article URLs.
  const seen = new Set(urls.map((u) => u.path));
  const slugI18n = loadBlogSlugI18n();
  for (const esSlug of loadAllBlogSlugs()) {
    const variants = slugI18n[esSlug] || { es: esSlug };
    for (const lang of LANGS) {
      const slug = variants[lang] || esSlug;
      const p = `/${lang}/blog/${slug}`;
      if (!seen.has(p)) {
        urls.push({ kind: "blog_post", lang, path: p });
        seen.add(p);
      }
    }
  }
  return urls;
}

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: "manual" });
  const status = res.status;
  const html = await res.text();
  return { status, html };
}

function extractJsonLdBlocks(html) {
  const out = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(m[1]);
  }
  return out;
}

// Tokenize a JSON document and report keys that appear more than once inside
// the same object. JSON.parse silently coerces duplicate keys (last write
// wins), which can mask broken schema authoring (e.g. two `"author"` lines
// pointing at different organizations). RFC 8259 §4 calls this behaviour
// "interoperably hazardous" and SEO crawlers parse the same way.
function findDuplicateJsonKeys(raw) {
  const dups = [];
  const stack = [{ kind: "root", keys: null }];
  let i = 0;
  const n = raw.length;
  function isWs(c) { return c === " " || c === "\t" || c === "\n" || c === "\r"; }
  function readString() {
    if (raw[i] !== '"') return null;
    let out = "";
    i++;
    while (i < n) {
      const c = raw[i];
      if (c === "\\") { out += raw[i] + raw[i + 1]; i += 2; continue; }
      if (c === '"') { i++; return out; }
      out += c; i++;
    }
    return null;
  }
  while (i < n) {
    const c = raw[i];
    if (isWs(c) || c === "," || c === ":") { i++; continue; }
    if (c === "{") { stack.push({ kind: "object", keys: new Map() }); i++; continue; }
    if (c === "[") { stack.push({ kind: "array", keys: null }); i++; continue; }
    if (c === "}" || c === "]") { stack.pop(); i++; continue; }
    if (c === '"') {
      const top = stack[stack.length - 1];
      const start = i;
      const s = readString();
      if (s === null) break;
      // Only treat strings as keys when followed (after whitespace) by ':'.
      let j = i;
      while (j < n && isWs(raw[j])) j++;
      const isKey = top && top.kind === "object" && raw[j] === ":";
      if (isKey) {
        const seen = top.keys.get(s) || 0;
        if (seen >= 1) dups.push(s);
        top.keys.set(s, seen + 1);
      }
      // skip the optional ':' so the value tokenization runs cleanly
      if (isKey) i = j + 1;
      continue;
    }
    // primitive (number/bool/null) — fast-forward to next delimiter
    while (i < n && raw[i] !== "," && raw[i] !== "}" && raw[i] !== "]") i++;
  }
  return [...new Set(dups)];
}

function parseBlocks(blocks) {
  const parsed = [];
  const errors = [];
  const duplicates = [];
  for (let i = 0; i < blocks.length; i++) {
    const raw = blocks[i].trim();
    try {
      parsed.push(JSON.parse(raw));
      const dups = findDuplicateJsonKeys(raw);
      if (dups.length > 0) duplicates.push({ index: i, keys: dups });
    } catch (err) {
      errors.push({ index: i, message: String(err && err.message || err), preview: raw.slice(0, 120) });
    }
  }
  return { parsed, errors, duplicates };
}

function flattenTypes(parsed) {
  const types = new Set();
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    const t = node["@type"];
    if (typeof t === "string") types.add(t);
    if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
    if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") walk(v);
    }
  }
  parsed.forEach(walk);
  return types;
}

function flattenIds(parsed) {
  const ids = new Set();
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (typeof node["@id"] === "string") ids.add(node["@id"]);
    if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") walk(v);
    }
  }
  parsed.forEach(walk);
  return ids;
}

function findRatings(parsed) {
  const found = [];
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    const t = node["@type"];
    if (t === "AggregateRating" || (Array.isArray(t) && t.includes("AggregateRating"))) {
      found.push(node);
    } else if (node.aggregateRating && typeof node.aggregateRating === "object") {
      found.push(node.aggregateRating);
    }
    if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") walk(v);
    }
  }
  parsed.forEach(walk);
  return found;
}

function expectedTypesFor(kind) {
  switch (kind) {
    case "home":         return ["ProfessionalService", "Organization", "WebSite", "BreadcrumbList"];
    case "about_llc":    return ["BreadcrumbList", "Article"];
    case "how_we_work":  return ["BreadcrumbList", "HowTo"];
    case "our_services": return ["BreadcrumbList", "Service"];
    case "faq":          return ["BreadcrumbList", "FAQPage"];
    // Pillar `abrir-llc` page: must expose Article (pillar piece)
    // AND HowTo (the constitution process), per LOTE 8 spec.
    case "pillar":       return ["BreadcrumbList", "Article", "HowTo"];
    case "service_nm":   return ["BreadcrumbList", "Service"];
    case "blog_index":   return ["BreadcrumbList"];
    case "blog_post":    return ["BreadcrumbList", "Article"];
    default:             return [];
  }
}

// Walk every node in the parsed JSON-LD graph and run `visit` on each.
function walkAll(parsed, visit) {
  function go(node) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { node.forEach(go); return; }
    visit(node);
    if (Array.isArray(node["@graph"])) node["@graph"].forEach(go);
    for (const v of Object.values(node)) {
      if (v && typeof v === "object") go(v);
    }
  }
  parsed.forEach(go);
}

function findFirstByType(parsed, type) {
  let hit = null;
  walkAll(parsed, (node) => {
    if (hit) return;
    const t = node["@type"];
    if (t === type || (Array.isArray(t) && t.includes(type))) hit = node;
  });
  return hit;
}

function extractMetaContent(html, attr, key) {
  const re = new RegExp(
    `<meta\\s+[^>]*${attr}=["']${key.replace(/[-/\\^$*+?.()|[\\]{}]/g, "\\$&")}["'][^>]*>`,
    "gi",
  );
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const cm = tag.match(/content=["']([^"']*)["']/i);
    if (cm) out.push(cm[1]);
  }
  return out;
}

// Look up the @id reference attached to a node's `key` property. Accepts
// either a flat `{ "@id": "…" }` reference or a fully expanded
// `{ "@type": "Organization", "@id": "…", ... }` record. Returns the @id
// string if present, otherwise null.
function refIdOf(node, key) {
  const v = node && node[key];
  if (!v || typeof v !== "object") return null;
  if (typeof v["@id"] === "string") return v["@id"];
  return null;
}

function findFirstByAnyType(parsed, types) {
  let hit = null;
  walkAll(parsed, (node) => {
    if (hit) return;
    const t = node["@type"];
    if (typeof t === "string" && types.includes(t)) hit = node;
    else if (Array.isArray(t) && t.some((x) => types.includes(x))) hit = node;
  });
  return hit;
}

function checkPage(entry) {
  const { html, status } = entry.response;
  const issues = [];
  const blocks = extractJsonLdBlocks(html);
  const { parsed, errors, duplicates } = parseBlocks(blocks);

  if (status !== 200) {
    issues.push(`HTTP ${status}`);
  }
  if (errors.length > 0) {
    issues.push(`${errors.length} JSON-LD parse error(s)`);
  }
  if (duplicates.length > 0) {
    const summary = duplicates.map((d) => `block#${d.index}=[${d.keys.join(",")}]`).join("; ");
    issues.push(`duplicate JSON keys: ${summary}`);
  }

  const types = flattenTypes(parsed);
  const ids = flattenIds(parsed);
  const expected = expectedTypesFor(entry.kind);
  const missing = expected.filter((t) => !types.has(t));
  if (missing.length > 0) issues.push(`missing types: ${missing.join(", ")}`);

  const orgId = `${BASE}/#organization`;

  // Home: must expose Organization @id + AggregateRating + the canonical
  // contact + sameAs fields that anchor brand entity recognition.
  // WebSite must additionally claim a SearchAction so Google can render the
  // sitelinks search box.
  if (entry.kind === "home") {
    const hasOrgId = [...ids].some((x) => /\/#organization$/.test(x));
    if (!hasOrgId) issues.push("missing @id for Organization");
    const ratings = findRatings(parsed);
    if (ratings.length === 0) issues.push("missing AggregateRating on home");
    const org = findFirstByType(parsed, "Organization");
    if (org) {
      for (const f of ["name", "url", "logo", "contactPoint", "sameAs"]) {
        if (!(f in org)) issues.push(`Organization missing ${f}`);
      }
    } else {
      issues.push("Organization node not found");
    }
    const ws = findFirstByType(parsed, "WebSite");
    if (ws) {
      for (const f of ["name", "url", "publisher"]) {
        if (!(f in ws)) issues.push(`WebSite missing ${f}`);
      }
      const pubId = refIdOf(ws, "publisher");
      if (!pubId || !/\/#organization$/.test(pubId)) {
        issues.push("WebSite.publisher does not reference Organization @id");
      }
      const action = ws.potentialAction;
      const actionList = Array.isArray(action) ? action : action ? [action] : [];
      const search = actionList.find((a) => a && (a["@type"] === "SearchAction" || (Array.isArray(a["@type"]) && a["@type"].includes("SearchAction"))));
      if (!search) {
        issues.push("WebSite missing potentialAction SearchAction");
      } else {
        const target = search.target;
        const tgt = typeof target === "string" ? target : target && typeof target === "object" ? target.urlTemplate : null;
        if (!tgt || !/\{search_term_string\}/.test(tgt)) {
          issues.push("SearchAction target missing {search_term_string}");
        }
        if (typeof search["query-input"] !== "string" || !/search_term_string/.test(search["query-input"])) {
          issues.push("SearchAction query-input missing search_term_string");
        }
      }
    } else {
      issues.push("WebSite node not found");
    }
  }

  // Article-bearing pages must expose every Schema.org-required Article
  // property: headline, image, author, publisher, datePublished, plus the
  // SEO-critical mainEntityOfPage and inLanguage. publisher must reference
  // the canonical Organization @id so the rich-results graph stays cohesive.
  if (["pillar", "about_llc", "blog_post"].includes(entry.kind)) {
    const article = findFirstByAnyType(parsed, ["Article", "BlogPosting", "NewsArticle"]);
    if (!article) {
      issues.push("Article node not found");
    } else {
      const required = ["headline", "image", "author", "publisher", "datePublished", "mainEntityOfPage", "inLanguage"];
      for (const f of required) {
        if (!(f in article)) issues.push(`Article missing ${f}`);
      }
      if (article.publisher && typeof article.publisher === "object") {
        for (const f of ["@type", "name"]) {
          if (!(f in article.publisher)) issues.push(`Article.publisher missing ${f}`);
        }
        const pubId = refIdOf(article, "publisher");
        if (!pubId || !/\/#organization$/.test(pubId)) {
          issues.push("Article.publisher does not reference Organization @id");
        }
      }
    }
  }

  // Pillar must additionally expose a HowTo describing the constitution flow.
  if (entry.kind === "pillar") {
    const howTo = findFirstByType(parsed, "HowTo");
    if (!howTo) issues.push("HowTo node not found on pillar");
    else if (!howTo.step && !howTo.steps) issues.push("HowTo missing step");
  }

  // FAQ must expose at least one Question/Answer pair.
  if (entry.kind === "faq") {
    const faq = findFirstByType(parsed, "FAQPage");
    if (faq) {
      const me = faq.mainEntity;
      const list = Array.isArray(me) ? me : me ? [me] : [];
      if (list.length === 0) issues.push("FAQPage with no mainEntity");
    }
  }

  // Service-bearing pages: enforce that at least one Service / Professional
  // Service node references the canonical Organization @id as `provider`.
  // We exclude the brand node itself — the base ProfessionalService block has
  // `@id={BASE}/#organization` and IS the organization, so it has no provider
  // (it would be self-referential and Schema.org doesn't require it).
  if (["our_services", "service_nm"].includes(entry.kind)) {
    let providerOk = false;
    let foundService = false;
    walkAll(parsed, (node) => {
      const t = node["@type"];
      const isService = t === "Service" || t === "ProfessionalService"
        || (Array.isArray(t) && (t.includes("Service") || t.includes("ProfessionalService")));
      if (!isService) return;
      const selfId = typeof node["@id"] === "string" ? node["@id"] : "";
      if (/\/#organization$/.test(selfId)) return; // brand node, skip
      foundService = true;
      const pid = refIdOf(node, "provider");
      if (pid && /\/#organization$/.test(pid)) providerOk = true;
    });
    if (!foundService) issues.push("no Service / ProfessionalService node found");
    else if (!providerOk) issues.push("Service.provider does not reference Organization @id");
  }

  // Open Graph
  const ogTags = {};
  for (const k of REQUIRED_OG) {
    const vals = extractMetaContent(html, "property", k);
    ogTags[k] = vals;
    if (vals.length === 0) issues.push(`OG missing: ${k}`);
  }
  const ogLocale = ogTags["og:locale"][0];
  if (ogLocale && ogLocale !== LOCALE_MAP[entry.lang]) {
    issues.push(`og:locale mismatch (${ogLocale} != ${LOCALE_MAP[entry.lang]})`);
  }
  const ogAlternates = extractMetaContent(html, "property", "og:locale:alternate");
  const expectedAlt = LANGS.filter((l) => l !== entry.lang).map((l) => LOCALE_MAP[l]);
  for (const exp of expectedAlt) {
    if (!ogAlternates.includes(exp)) issues.push(`OG missing locale:alternate ${exp}`);
  }
  if (ogAlternates.length !== expectedAlt.length) {
    issues.push(`OG locale:alternate cardinality ${ogAlternates.length} != ${expectedAlt.length}`);
  }
  const unexpectedAlt = ogAlternates.filter((x) => !expectedAlt.includes(x));
  if (unexpectedAlt.length > 0) {
    issues.push(`OG unexpected locale:alternate values: ${unexpectedAlt.join(", ")}`);
  }
  const dupAlt = ogAlternates.filter((x, i) => ogAlternates.indexOf(x) !== i);
  if (dupAlt.length > 0) {
    issues.push(`OG duplicated locale:alternate: ${[...new Set(dupAlt)].join(", ")}`);
  }

  // og:image must come with width/height/alt so Facebook + LinkedIn render
  // the share card without re-fetching the asset to determine dimensions.
  const ogImageExtras = {};
  for (const k of REQUIRED_OG_IMAGE_EXTRAS) {
    const vals = extractMetaContent(html, "property", k);
    ogImageExtras[k] = vals;
    if (vals.length === 0) issues.push(`OG missing: ${k}`);
  }
  if (ogImageExtras["og:image:width"][0] && !/^\d+$/.test(ogImageExtras["og:image:width"][0])) {
    issues.push(`og:image:width not numeric (${ogImageExtras["og:image:width"][0]})`);
  }
  if (ogImageExtras["og:image:height"][0] && !/^\d+$/.test(ogImageExtras["og:image:height"][0])) {
    issues.push(`og:image:height not numeric (${ogImageExtras["og:image:height"][0]})`);
  }

  // Twitter
  const twTags = {};
  for (const k of REQUIRED_TWITTER) {
    const vals = extractMetaContent(html, "name", k);
    twTags[k] = vals;
    if (vals.length === 0) issues.push(`Twitter missing: ${k}`);
  }
  if (twTags["twitter:card"][0] && twTags["twitter:card"][0] !== "summary_large_image") {
    issues.push(`twitter:card != summary_large_image`);
  }

  return {
    url: entry.url,
    kind: entry.kind,
    lang: entry.lang,
    status,
    blocksCount: blocks.length,
    parseErrors: errors,
    types: [...types].sort(),
    ogPresent: REQUIRED_OG.filter((k) => ogTags[k].length > 0),
    ogImageExtrasPresent: REQUIRED_OG_IMAGE_EXTRAS.filter((k) => ogImageExtras[k].length > 0),
    ogAlternatesCount: ogAlternates.length,
    twPresent: REQUIRED_TWITTER.filter((k) => twTags[k].length > 0),
    issues,
  };
}

async function main() {
  const sample = buildSample();
  const results = [];
  for (const entry of sample) {
    const url = `${BASE}${entry.path}`;
    let response;
    try {
      response = await fetchHtml(url);
    } catch (err) {
      results.push({
        url, kind: entry.kind, lang: entry.lang, status: 0,
        blocksCount: 0, parseErrors: [], types: [],
        ogPresent: [], ogAlternatesCount: 0, twPresent: [],
        issues: [`fetch error: ${err.message}`],
      });
      continue;
    }
    results.push(checkPage({ ...entry, url, response }));
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const reportJson = { base: BASE, generatedAt: new Date().toISOString(), results };
  writeFileSync(join(OUT_DIR, "lote8-schema-og.json"), JSON.stringify(reportJson, null, 2));

  const md = [];
  md.push("# LOTE 8 — Schema markup, Open Graph & Twitter Cards");
  md.push("");
  md.push(`Generado: ${reportJson.generatedAt}`);
  md.push(`Base URL: ${BASE}`);
  md.push(`Páginas auditadas: **${results.length}**`);
  md.push("");
  const failed = results.filter((r) => r.issues.length > 0);
  md.push(`Páginas con incidencias: **${failed.length}**`);
  md.push("");
  md.push("## Alcance y metodología");
  md.push("");
  md.push("Validador: `scripts/seo/lote8-schema-og-validate.mjs` (sin dependencias externas, ejecutable con `node`).");
  md.push("");
  md.push("Cobertura:");
  md.push("");
  md.push("- **9 tipos de página** × **6 idiomas** (es, en, fr, de, pt, ca): home, sobre las LLC, cómo trabajamos, servicios, FAQ, pillar `abrir-llc-estados-unidos`, servicio LLC NM, blog index y artículo de blog canónico (54 URLs).");
  md.push("- **Cobertura total de blog**: las 113 entradas de `client/src/data/blog-posts.ts` se auditan en sus 6 URLs traducidas (`/{lang}/blog/<translated-slug>`, mapeo `BLOG_SLUG_I18N`). Cuando un post no tiene traducción explícita en algún idioma, se usa el slug ES (la ruta cae a `resolveToSpanishSlug` en producción). 113 × 6 ≈ 678 URLs adicionales.");
  md.push("");
  md.push("Comprobaciones por URL:");
  md.push("");
  md.push("1. Cada bloque `<script type=\"application/ld+json\">` se parsea con `JSON.parse` estricto y, además, se tokeniza con un parser propio (`findDuplicateJsonKeys`) que detecta claves repetidas dentro del mismo objeto JSON (`JSON.parse` colapsa silenciosamente; RFC 8259 §4 lo marca como peligroso).");
  md.push("2. Catálogo de tipos esperados por página: home (`ProfessionalService` + `Organization` + `WebSite` + `BreadcrumbList`), pillar (`BreadcrumbList` + `Article` + `HowTo`), about_llc / blog_post (`BreadcrumbList` + `Article`), how_we_work (`BreadcrumbList` + `HowTo`), our_services / service_nm (`BreadcrumbList` + `Service`), faq (`BreadcrumbList` + `FAQPage`), blog_index (`BreadcrumbList`).");
  md.push("3. Home: `Organization` con `@id={BASE_URL}/#organization` y campos `name`, `url`, `logo`, `contactPoint`, `sameAs`; `AggregateRating` presente; `WebSite` con `name`, `url`, `publisher` referenciado por `@id` a la Organization, y `potentialAction` con `SearchAction` (target con `{search_term_string}` + `query-input` `\"required name=search_term_string\"`).");
  md.push("4. Cada `Article` (about_llc, pillar, blog_post) declara los campos requeridos: `headline`, `image`, `author`, `publisher`, `datePublished`, `mainEntityOfPage`, `inLanguage`. `Article.publisher` debe referenciar la Organization canónica vía `@id` (ya sea `{ \"@id\": \".../#organization\" }` o un objeto expandido que incluya `@id`).");
  md.push("5. Pillar: `HowTo` con al menos un `step`. FAQ: `FAQPage` con `mainEntity` no vacío. our_services / service_nm: al menos un nodo `Service` o `ProfessionalService` (excluyendo el nodo de marca con `@id={BASE_URL}/#organization`) con `provider` referenciado por `@id` a la Organization.");
  md.push("6. 7 etiquetas Open Graph canónicas presentes (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale`, `og:site_name`) + `og:image:width`/`og:image:height`/`og:image:alt` (width/height numéricos).");
  md.push("7. `og:locale` coincide con el idioma resuelto (FB locale: es_ES, en_US, fr_FR, de_DE, pt_PT, ca_ES). Cardinalidad **estricta** de `og:locale:alternate`: exactamente **5** valores, exactamente los 5 idiomas restantes, sin duplicados ni valores fuera de catálogo (`unexpected locale:alternate values` se reporta como incidencia).");
  md.push("8. 4 etiquetas Twitter Cards canónicas (`twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`).");
  md.push("");
  md.push("Ejecución reproducible:");
  md.push("");
  md.push("```bash");
  md.push("# 1. Levantar el dev workflow (puerto 5000)");
  md.push("npm run dev");
  md.push("# 2. Lanzar el validador en otra terminal");
  md.push("node scripts/seo/lote8-schema-og-validate.mjs");
  md.push("# Sale con código 0 cuando todo pasa, 1 si hay incidencias");
  md.push("```");
  md.push("");
  md.push("Cambios introducidos por LOTE 8 (sin tocar metadata/canonical/sitemap, exclusivo de schemas + OG/Twitter):");
  md.push("");
  md.push("- `server/static.ts::injectMeta`: reescribe `og:locale` por idioma resuelto y emite exactamente 5 `og:locale:alternate` con los otros idiomas soportados (sustituye los 8 alternates regionales hardcodeados que enviaba `client/index.html`).");
  md.push("- `server/static.ts::injectMeta`: añade `BreadcrumbList` JSON-LD para `/{lang}/blog` (faltaba; ya existía sólo para `Article` de cada post).");
  md.push("- `server/static.ts::injectMeta` y `server/seo-content.ts::PAGE_SCHEMAS.home`: ambos emisores dinámicos del nodo `WebSite` se eliminan en la home. El `WebSite` canónico vive sólo en `client/index.html` (id `#website`) con `publisher → /#organization` y `potentialAction.SearchAction`. Resultado: exactamente **1** nodo `WebSite` por página (deduplicación LOTE 8).");
  md.push("- `server/static.ts::injectMeta`: cada `Article` de blog enriquece su `author` y `publisher` con `@id={BASE_URL}/#organization` (antes sólo `@type` + `name` + `url`).");
  md.push("- `server/seo-content.ts`: 51 referencias a `Organization` (publisher / provider / author en `PAGE_SCHEMAS_I18N`) ahora incluyen `@id={BASE_URL}/#organization`. Excluidos los 3 `seller` de Offers, que mantienen su forma reducida.");
  md.push("- `client/index.html`: el `WebSite` base recibe `publisher: { @id: \".../#organization\" }` y `potentialAction.SearchAction` (sitelinks search box).");
  md.push("");
  md.push("Integración con CI:");
  md.push("");
  md.push("- El alcance del LOTE 8 prohíbe explícitamente modificar `package.json`, por lo que el script no se cablea a `npm run seo:check`. Sigue el mismo patrón standalone que el resto de auditorías por lote en `scripts/seo/` (`lote2-audit-canonical.mjs`, `lote2-audit-hreflang.mjs`, etc.). Para integrarlo en CI bastaría con añadir una entrada `\"seo:lote8\": \"node scripts/seo/lote8-schema-og-validate.mjs\"` y encadenarla a `seo:check` cuando se levante esa restricción.");
  md.push("");
  md.push("## Resumen por tipo");
  md.push("");
  md.push("| Tipo | OK | Con incidencias |");
  md.push("|---|---:|---:|");
  const byKind = new Map();
  for (const r of results) {
    const b = byKind.get(r.kind) || { ok: 0, ko: 0 };
    if (r.issues.length === 0) b.ok++; else b.ko++;
    byKind.set(r.kind, b);
  }
  for (const [k, b] of byKind) md.push(`| ${k} | ${b.ok} | ${b.ko} |`);
  md.push("");
  md.push("## Detalle por URL");
  md.push("");
  md.push("| URL | Tipos JSON-LD | OG | OG img | OG alt | Twitter | Incidencias |");
  md.push("|---|---|---:|---:|---:|---:|---|");
  for (const r of results) {
    md.push(
      `| \`${r.url.replace(BASE, "")}\` | ${r.types.join(", ")} | ${r.ogPresent.length}/${REQUIRED_OG.length} | ${r.ogImageExtrasPresent.length}/${REQUIRED_OG_IMAGE_EXTRAS.length} | ${r.ogAlternatesCount}/5 | ${r.twPresent.length}/${REQUIRED_TWITTER.length} | ${r.issues.length === 0 ? "✓" : r.issues.join("; ")} |`,
    );
  }
  md.push("");
  md.push("## Errores de parseo JSON-LD");
  md.push("");
  const parseFailed = results.filter((r) => r.parseErrors.length > 0);
  if (parseFailed.length === 0) {
    md.push("Sin errores. Cada bloque `<script type=\"application/ld+json\">` parsea con `JSON.parse` estricto.");
  } else {
    for (const r of parseFailed) {
      md.push(`### ${r.url}`);
      for (const e of r.parseErrors) {
        md.push(`- bloque ${e.index}: ${e.message}`);
        md.push(`  preview: \`${e.preview.replace(/\n/g, " ")}\``);
      }
    }
  }
  writeFileSync(join(OUT_DIR, "lote8-schema-og.md"), md.join("\n") + "\n");

  console.log(`LOTE 8: audited ${results.length} URLs, ${failed.length} with issues.`);
  console.log(`Report: ${join(OUT_DIR, "lote8-schema-og.md")}`);
  if (failed.length > 0) {
    console.error("LOTE 8: FAILED");
    for (const r of failed) {
      console.error(`  ${r.url}: ${r.issues.join("; ")}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
