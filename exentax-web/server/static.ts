import express, { type Express } from "express";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { PAGE_META, PAGE_META_I18N, PAGE_SEO_CONTENT, PAGE_SEO_CONTENT_I18N, FAQ_SCHEMA_ENTRIES, PAGE_SCHEMAS, PAGE_SCHEMAS_I18N } from "./seo-content";
import { FAQ_SCHEMA_ENTRIES_I18N } from "./faq-schema-i18n";
import { resolveServerRoute, getLocalizedPath } from "../shared/routes";
import type { SupportedLang } from "./server-constants";
import { logger } from "./logger";
import { maybeInjectE2eTrackingHook } from "./e2e-hook";
import { prepareSpaHtml } from "./spa-html";
import { BLOG_POSTS } from "../client/src/data/blog-posts";
import { BLOG_CONTENT_ES } from "../client/src/data/blog-content/es-all";
import { BLOG_CONTENT_EN } from "../client/src/data/blog-content/en-all";
import { BLOG_CONTENT_FR } from "../client/src/data/blog-content/fr-all";
import { BLOG_CONTENT_DE } from "../client/src/data/blog-content/de-all";
import { BLOG_CONTENT_PT } from "../client/src/data/blog-content/pt-all";
import { BLOG_CONTENT_CA } from "../client/src/data/blog-content/ca-all";
import { BLOG_I18N } from "../client/src/data/blog-i18n-all";
import { getTranslatedSlug, resolveToSpanishSlug } from "../client/src/data/blog-posts-slugs";
import { getRelatedPosts } from "../client/src/data/blog-related";
import { SITE_URL, SUPPORTED_LANGS, BRAND_NAME, INSTAGRAM_URL, TIKTOK_URL, LINKEDIN_URL, CONTACT_EMAIL, HREFLANG_BCP47 } from "./server-constants";

// Per-language content map for the SEO prerender block. Keys are the canonical
// Spanish slug (the same key used inside each <lang>-all.ts bundle). Used to
// emit a body that matches the URL's <html lang> so crawlers see localized
// content for /en/blog/..., /de/blog/..., etc. — not Spanish for every locale.
const BLOG_CONTENT_BY_LANG: Record<SupportedLang, Record<string, string>> = {
  es: BLOG_CONTENT_ES,
  en: BLOG_CONTENT_EN,
  fr: BLOG_CONTENT_FR,
  de: BLOG_CONTENT_DE,
  pt: BLOG_CONTENT_PT,
  ca: BLOG_CONTENT_CA,
};

function getLocalizedBlogContent(slug: string, lang: SupportedLang): string {
  const localized = BLOG_CONTENT_BY_LANG[lang]?.[slug];
  if (localized && localized.trim().length > 0) return localized;
  return BLOG_CONTENT_ES[slug] || "";
}

const RELATED_HEADING: Record<SupportedLang, string> = {
  es: "Artículos relacionados",
  en: "Related articles",
  fr: "Articles connexes",
  de: "Verwandte Artikel",
  pt: "Artigos relacionados",
  ca: "Articles relacionats",
};

function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let listType: "ul" | "ol" | null = null;

  function closeList() {
    if (listType) {
      html += listType === "ol" ? "</ol>" : "</ul>";
      listType = null;
    }
  }

  function fmtInline(t: string): string {
    return t
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  }

  for (const line of lines) {
    if (line.startsWith("### ")) {
      closeList();
      html += `<h3>${fmtInline(line.slice(4))}</h3>`;
    } else if (line.startsWith("## ")) {
      closeList();
      html += `<h2>${fmtInline(line.slice(3))}</h2>`;
    } else if (line.startsWith("- ")) {
      if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; }
      html += `<li>${fmtInline(line.slice(2))}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; }
      html += `<li>${fmtInline(line.replace(/^\d+\.\s/, ""))}</li>`;
    } else if (line.startsWith("|")) {
      continue;
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p>${fmtInline(line)}</p>`;
    }
  }
  closeList();
  return html;
}

const BASE_URL = SITE_URL;
const HREFLANG_STRIP_RE = new RegExp(
  `<link rel="alternate" hreflang="([^"]+)" href="${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*" \\/>`,
  'g'
);

// Single source of truth for BCP-47 hreflang tags lives in
// `server/server-constants.ts::HREFLANG_BCP47`. Re-imported above so
// `injectMeta` cannot drift from the sitemap generator or the dev middleware.

// Facebook Open Graph locale codes (underscore form, e.g. `es_ES`). One per
// supported language. Used to rewrite the hardcoded `og:locale` shipped in
// `client/index.html` and to emit exactly five `og:locale:alternate` tags per
// page (the five non-current supported languages). Validated by
// `scripts/seo/lote8-schema-og-validate.mjs`.
const FB_OG_LOCALE: Record<SupportedLang, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT",
  ca: "ca_ES",
};
const OG_LOCALE_STRIP_RE =
  /\s*<meta property="og:locale(?::alternate)?" content="[^"]*"\s*\/?>(?:\r?\n)?/g;

const ARTICLE_META_I18N: Record<SupportedLang, { section: string; tagLLC: string; tagOptimization: string; tagFreelancers: string }> = {
  es: { section: "Fiscalidad Internacional", tagLLC: "LLC Estados Unidos", tagOptimization: "Optimización Fiscal", tagFreelancers: "Freelancers" },
  en: { section: "International Taxation", tagLLC: "LLC United States", tagOptimization: "Tax Optimization", tagFreelancers: "Freelancers" },
  fr: { section: "Fiscalité Internationale", tagLLC: "LLC États-Unis", tagOptimization: "Optimisation Fiscale", tagFreelancers: "Freelances" },
  de: { section: "Internationale Besteuerung", tagLLC: "LLC USA", tagOptimization: "Steueroptimierung", tagFreelancers: "Freiberufler" },
  pt: { section: "Tributação Internacional", tagLLC: "LLC Estados Unidos", tagOptimization: "Otimização Fiscal", tagFreelancers: "Freelancers" },
  ca: { section: "Fiscalitat Internacional", tagLLC: "LLC Estats Units", tagOptimization: "Optimització Fiscal", tagFreelancers: "Freelancers" },
};

const META_CACHE = new Map<string, string>();
const META_CACHE_MAX = 200;

function injectMetaCached(html: string, reqPath: string): string {
  const key = reqPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const cached = META_CACHE.get(key);
  if (cached) {
    META_CACHE.delete(key);
    META_CACHE.set(key, cached);
    return cached;
  }
  const result = injectMeta(html, reqPath);
  if (META_CACHE.size >= META_CACHE_MAX) {
    const firstKey = META_CACHE.keys().next().value;
    if (firstKey) META_CACHE.delete(firstKey);
  }
  META_CACHE.set(key, result);
  return result;
}

export function injectMeta(html: string, reqPath: string): string {
  const cleanPath = reqPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  const SUPPORTED = SUPPORTED_LANGS as readonly string[] as SupportedLang[];
  const langBlogMatch = cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog\/([a-z0-9][a-z0-9-]+[a-z0-9])$/);
  const directBlogMatch = cleanPath.match(/^\/blog\/([a-z0-9][a-z0-9-]+[a-z0-9])$/);
  const isBlogArticle = !!langBlogMatch || !!directBlogMatch;
  const rawBlogSlug = langBlogMatch ? langBlogMatch[2] : directBlogMatch ? directBlogMatch[1] : null;
  const blogLang = (langBlogMatch ? langBlogMatch[1] : "es") as SupportedLang;
  const blogSlug = rawBlogSlug ? resolveToSpanishSlug(rawBlogSlug, blogLang) : rawBlogSlug;

  let meta = PAGE_META[cleanPath];

  if (!meta) {
    const resolvedMeta = resolveServerRoute(cleanPath);
    if (resolvedMeta) {
      const localizedPathCheck = getLocalizedPath(resolvedMeta.key, resolvedMeta.lang);
      meta = PAGE_META[localizedPathCheck];
    }
  }

  if (!meta && isBlogArticle && blogSlug) {
    const post = BLOG_POSTS.find(p => p.slug === blogSlug);
    if (post) {
      const i18nMeta = blogLang !== "es" ? BLOG_I18N[blogSlug]?.[blogLang] : undefined;
      const translatedSlug = getTranslatedSlug(post.slug, blogLang);
      const canonicalPath = blogLang === "es"
        ? `${BASE_URL}/es/blog/${post.slug}`
        : `${BASE_URL}/${blogLang}/blog/${translatedSlug}`;
      const articleKeywords = i18nMeta?.keywords || post.keywords;
      meta = {
        title: i18nMeta?.metaTitle || post.metaTitle,
        description: i18nMeta?.metaDescription || post.metaDescription,
        canonical: canonicalPath,
        keywords: articleKeywords && articleKeywords.length > 0
          ? articleKeywords.join(", ")
          : undefined,
      };
    }
  }

  if (!meta) {
    const langI18n = PAGE_META_I18N[cleanPath];
    if (langI18n) {
      meta = langI18n;
    }
  }

  if (!meta) return html;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${meta.description}"`
  );
  if (meta.keywords) {
    html = html.replace(
      /<meta name="keywords" content="[^"]*"/,
      `<meta name="keywords" content="${meta.keywords}"`
    );
  }
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${meta.canonical}"`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${meta.title}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${meta.description}"`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"/,
    `<meta property="og:url" content="${meta.canonical}"`
  );

  // OG locale rewrite — replaces the hardcoded es_ES + 8 alternates that
  // ship in `client/index.html` with the canonical 6-language matrix
  // (one og:locale + five og:locale:alternate). Resolved language uses
  // the same routeKey/lang resolution as the JSON-LD pipeline below.
  {
    const ogResolved = resolveServerRoute(cleanPath);
    const ogLang: SupportedLang =
      (ogResolved?.lang as SupportedLang | undefined) ??
      ((cleanPath.match(/^\/(es|en|fr|de|pt|ca)(?:\/|$)/)?.[1] as SupportedLang | undefined)) ??
      "es";
    const localeTag = `<meta property="og:locale" content="${FB_OG_LOCALE[ogLang]}" />`;
    const altTags = (SUPPORTED_LANGS as readonly string[])
      .filter((l) => l !== ogLang)
      .map((l) => `<meta property="og:locale:alternate" content="${FB_OG_LOCALE[l as SupportedLang]}" />`)
      .join("\n    ");
    html = html.replace(OG_LOCALE_STRIP_RE, "");
    html = html.replace(
      "</head>",
      `    ${localeTag}\n    ${altTags}\n  </head>`,
    );
  }

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${meta.title}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${meta.description}"`
  );

  if (isBlogArticle && blogSlug) {
    const post = BLOG_POSTS.find(p => p.slug === blogSlug);
    const i18nMetaForKeywords = post && blogLang !== "es" ? BLOG_I18N[post.slug]?.[blogLang] : undefined;
    const articleKeywords = i18nMetaForKeywords?.keywords || post?.keywords;
    if (articleKeywords && articleKeywords.length > 0) {
      const escapedKeywords = articleKeywords.join(", ").replace(/"/g, "&quot;");
      html = html.replace(
        /<meta name="keywords" content="[^"]*"/,
        `<meta name="keywords" content="${escapedKeywords}"`
      );
    }
    const publishedTime = post?.publishedAt || "2026-03-05";
    const modifiedTime = post?.updatedAt || publishedTime;
    const artI18n = ARTICLE_META_I18N[blogLang] || ARTICLE_META_I18N.es;
    const section = post?.category || artI18n.section;

    html = html.replace(
      /<meta property="og:type" content="[^"]*"/,
      `<meta property="og:type" content="article"`
    );
    const articleMeta = [
      `<meta property="article:author" content="${BRAND_NAME}" />`,
      `<meta property="article:publisher" content="${BASE_URL}" />`,
      `<meta property="article:published_time" content="${publishedTime}" />`,
      `<meta property="article:modified_time" content="${modifiedTime}" />`,
      `<meta property="article:section" content="${section}" />`,
      `<meta property="article:tag" content="${artI18n.tagLLC}" />`,
      `<meta property="article:tag" content="${artI18n.tagOptimization}" />`,
      `<meta property="article:tag" content="${artI18n.tagFreelancers}" />`,
    ].join("\n    ");
    const ogImageRegex = new RegExp(`<meta property="og:image" content="${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/og-image\\.png[^"]*"`);
    html = html.replace(
      ogImageRegex,
      `${articleMeta}\n    <meta property="og:image" content="${BASE_URL}/og-image.png"`
    );

    if (post) {
      const i18nPost = blogLang !== "es" ? BLOG_I18N[post.slug]?.[blogLang] : undefined;
      const prerenderTitle = i18nPost?.title || post.title;
      const prerenderExcerpt = i18nPost?.excerpt || post.excerpt;
      const prerenderContent = getLocalizedBlogContent(post.slug, blogLang);
      const related = getRelatedPosts(post.slug, blogLang, 3);
      const relatedHtml = related.length > 0
        ? `<aside><h2>${RELATED_HEADING[blogLang] || RELATED_HEADING.es}</h2><ul>${related.map(r => `<li><a href="${r.href}">${r.title}</a></li>`).join("")}</ul></aside>`
        : "";
      const prerender = `<article><h1>${prerenderTitle}</h1><p>${prerenderExcerpt}</p>${markdownToHtml(prerenderContent)}${relatedHtml}</article>`;
      html = html.replace(
        '<div id="root"></div>',
        `<div id="root"><div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${prerender}</div></div>`
      );
    }

    const hreflangLinks = SUPPORTED.map(lang =>
      `<link rel="alternate" hreflang="${HREFLANG_BCP47[lang]}" href="${BASE_URL}/${lang}/blog/${getTranslatedSlug(blogSlug!, lang)}" />`
    ).join("\n    ");
    const xDefaultLink = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/es/blog/${blogSlug}" />`;
    html = html.replace(HREFLANG_STRIP_RE, '');
    html = html.replace('</head>', `${hreflangLinks}\n    ${xDefaultLink}\n  </head>`);
  } else if (cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/) || cleanPath === "/blog") {
    const blogIndexHreflang = SUPPORTED.map(lang =>
      `<link rel="alternate" hreflang="${HREFLANG_BCP47[lang]}" href="${BASE_URL}/${lang}/blog" />`
    ).join("\n    ");
    const blogIndexXDefault = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/es/blog" />`;
    html = html.replace(HREFLANG_STRIP_RE, '');
    html = html.replace('</head>', `${blogIndexHreflang}\n    ${blogIndexXDefault}\n  </head>`);
  } else {
    html = html.replace(HREFLANG_STRIP_RE, '');
    const resolved = resolveServerRoute(cleanPath);
    if (resolved) {
      const nonBlogHreflang = SUPPORTED.map(lang =>
        `<link rel="alternate" hreflang="${HREFLANG_BCP47[lang]}" href="${BASE_URL}${getLocalizedPath(resolved.key, lang as SupportedLang)}" />`
      ).join("\n    ");
      const nonBlogXDefault = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${getLocalizedPath(resolved.key, "es")}" />`;
      html = html.replace('</head>', `    ${nonBlogHreflang}\n    ${nonBlogXDefault}\n  </head>`);
    } else {
      const canonicalLoc = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
      const fallbackHreflang = SUPPORTED.map(lang =>
        `<link rel="alternate" hreflang="${HREFLANG_BCP47[lang]}" href="${canonicalLoc}" />`
      ).join("\n    ");
      const fallbackXDefault = `<link rel="alternate" hreflang="x-default" href="${canonicalLoc}" />`;
      html = html.replace('</head>', `    ${fallbackHreflang}\n    ${fallbackXDefault}\n  </head>`);
    }
  }

  if (meta.noindex) {
    html = html.replace(
      /<meta name="robots" content="[^"]*"/,
      `<meta name="robots" content="noindex, nofollow"`
    );
  }

  const resolvedRoute = resolveServerRoute(cleanPath);
  const routeKey = resolvedRoute?.key ?? (cleanPath === "/" ? "home" : undefined);
  const prerenderLang = resolvedRoute?.lang ?? "es";
  let seoContent: string | undefined;
  if (routeKey) {
    if (prerenderLang === "es") {
      seoContent = PAGE_SEO_CONTENT[routeKey];
    } else {
      const langBucket = PAGE_SEO_CONTENT_I18N[prerenderLang as SupportedLang];
      seoContent = (langBucket as Record<string, string> | undefined)?.[routeKey] ?? PAGE_SEO_CONTENT[routeKey];
    }
    // Fallback H1: when no PAGE_SEO_CONTENT is registered for this route,
    // emit a minimal <h1> derived from the localized PAGE_META.title so
    // crawlers always see a primary heading on the prerendered HTML
    // (resolves audit "h1-missing" for service/legal subpages).
    if (!seoContent) {
      const h1Text = (meta.title || "").replace(/\s*\|\s*Exentax\s*$/i, "").trim();
      if (h1Text) {
        const safeH1 = h1Text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeDesc = (meta.description || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        seoContent = `<article><h1>${safeH1}</h1>${safeDesc ? `<p>${safeDesc}</p>` : ""}</article>`;
      }
    }
  }
  if (cleanPath === "/blog" || cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/)) {
    const blogLang2 = (cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/)?.[1] || "es") as SupportedLang;
    const blogLinks = BLOG_POSTS.map(post => {
      const slug = getTranslatedSlug(post.slug, blogLang2);
      const i18nData = blogLang2 !== "es" ? BLOG_I18N[post.slug]?.[blogLang2] : undefined;
      const title = i18nData?.title || post.title;
      return `<li><a href="/${blogLang2}/blog/${slug}">${title}</a></li>`;
    }).join("\n");
    seoContent = `<article>
<h1>Blog: ${(ARTICLE_META_I18N[blogLang2] || ARTICLE_META_I18N.es).section}</h1>
<nav><ul>${blogLinks}</ul></nav>
</article>`;
  }
  if (seoContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${seoContent}</div></div>`
    );
  }

  type JsonLdSchema = Record<string, unknown>;
  const allJsonLd: JsonLdSchema[] = [];

  // `resolvedRoute` is null for the unprefixed root `/` (routeKey is
  // still "home" via the fallback on line 271). Use routeKey +
  // prerenderLang so the home/FAQ schemas reliably fire on `/` and
  // every `/{lang}`.
  if (routeKey === "faq") {
    const faqLang = (prerenderLang as SupportedLang) || "es";
    const faqEntries = FAQ_SCHEMA_ENTRIES_I18N[faqLang] && FAQ_SCHEMA_ENTRIES_I18N[faqLang].length > 0
      ? FAQ_SCHEMA_ENTRIES_I18N[faqLang]
      : FAQ_SCHEMA_ENTRIES;
    allJsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "inLanguage": faqLang,
      "mainEntity": faqEntries,
    });
  }

  if (routeKey === "home") {
    allJsonLd.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": BRAND_NAME,
      "url": BASE_URL,
      "logo": `${BASE_URL}/icon-192.png`,
      "description": "Tax advisory for freelancers, digital nomads, and entrepreneurs. US LLC creation and management, tax optimization, and fiscal compliance.",
      "areaServed": "Worldwide",
      "priceRange": "$$",
      "sameAs": [
        INSTAGRAM_URL,
        TIKTOK_URL,
        LINKEDIN_URL
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": CONTACT_EMAIL,
        "contactType": "customer service",
        "availableLanguage": ["Spanish", "English", "French", "German", "Portuguese", "Catalan"]
      }
    });
    // WebSite schema is intentionally NOT emitted dynamically here: the
    // static block in `client/index.html` (id `#website`) already declares
    // publisher → /#organization and a SearchAction. Emitting another
    // WebSite would create two nodes with the same role on the home page,
    // which is valid JSON-LD but ambiguous for crawlers (LOTE 8 dedupe).
  }

  // Task #14 (GEO): prefer the per-language schema bucket when present,
  // so the pillar page (and any future locale-specific routes) ships
  // bot-visible Article/HowTo/FAQPage in the correct language; fall back
  // to PAGE_SCHEMAS otherwise.
  let pageSchemas: JsonLdSchema[] | undefined;
  if (routeKey) {
    const i18nBucket = PAGE_SCHEMAS_I18N[routeKey];
    pageSchemas = (i18nBucket?.[prerenderLang as SupportedLang] as JsonLdSchema[] | undefined)
      ?? (PAGE_SCHEMAS[routeKey] as JsonLdSchema[] | undefined);
  }
  if (!pageSchemas) {
    const blogIndexMatch = cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/);
    if (blogIndexMatch || cleanPath === "/blog") {
      const idxLang = (blogIndexMatch?.[1] || "es") as SupportedLang;
      const homeLabel =
        idxLang === "es" ? "Inicio" : idxLang === "en" ? "Home" :
        idxLang === "fr" ? "Accueil" : idxLang === "de" ? "Startseite" :
        idxLang === "pt" ? "Início" : "Inici";
      pageSchemas = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": homeLabel, "item": `${BASE_URL}/${idxLang}` },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/${idxLang}/blog` },
          ],
        },
      ];
    }
  }
  if (!pageSchemas && isBlogArticle && blogSlug) {
    const post = BLOG_POSTS.find(p => p.slug === blogSlug);
    if (post) {
      const publishedTime = post.publishedAt || "2026-03-05";
      const modifiedTime = post.updatedAt || publishedTime;
      const breadcrumbName = post.title.length > 60 ? post.title.slice(0, 57) + "..." : post.title;
      const articleUrl = `${BASE_URL}/${blogLang}/blog/${getTranslatedSlug(blogSlug, blogLang)}`;
      pageSchemas = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": blogLang === "es" ? "Inicio" : blogLang === "en" ? "Home" : blogLang === "fr" ? "Accueil" : blogLang === "de" ? "Startseite" : blogLang === "pt" ? "Início" : "Inici", "item": `${BASE_URL}/${blogLang}` },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/${blogLang}/blog` },
            { "@type": "ListItem", "position": 3, "name": breadcrumbName, "item": articleUrl }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": (blogLang !== "es" && BLOG_I18N[post.slug]?.[blogLang]?.title) || post.title,
          "description": (blogLang !== "es" && BLOG_I18N[post.slug]?.[blogLang]?.metaDescription) || post.metaDescription || post.excerpt,
          "image": `${BASE_URL}/og-image.png`,
          "author": { "@type": "Organization", "@id": `${BASE_URL}/#organization`, "name": BRAND_NAME, "url": BASE_URL },
          "publisher": { "@type": "Organization", "@id": `${BASE_URL}/#organization`, "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
          "datePublished": publishedTime,
          "dateModified": modifiedTime,
          "mainEntityOfPage": articleUrl,
          "inLanguage": blogLang,
          "articleSection": post.category || (ARTICLE_META_I18N[blogLang] || ARTICLE_META_I18N.es).section,
          "wordCount": Math.round(getLocalizedBlogContent(post.slug, blogLang).split(/\s+/).length)
        }
      ];
    }
  }
  if (pageSchemas) {
    allJsonLd.push(...pageSchemas);
  }

  if (allJsonLd.length > 0) {
    const jsonLdContent = allJsonLd.length === 1 ? JSON.stringify(allJsonLd[0]) : JSON.stringify(allJsonLd);
    html = html.replace(
      '</head>',
      `<script id="page-jsonld" type="application/ld+json">${jsonLdContent}</script>\n  </head>`
    );
  }

  return html;
}

export async function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  try {
    await fsp.access(distPath);
  } catch {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    maxAge: "1h",
    etag: true,
    lastModified: true,
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      } else if (filePath.match(/\.(js|css)$/) && filePath.includes("assets")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.match(/\.(woff2?|ttf|otf)$/) && filePath.includes("assets")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.match(/\.(woff2?|ttf|otf)$/) && !filePath.includes("assets")) {
        res.setHeader("Cache-Control", "public, max-age=604800, must-revalidate");
      } else if (filePath.match(/\.(png|jpg|jpeg|webp|avif|svg|gif)$/) && filePath.includes("assets")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.match(/\.(ico|png|webp|avif|webmanifest)$/) && !filePath.includes("assets")) {
        res.setHeader("Cache-Control", "public, max-age=86400, must-revalidate");
      }
      res.setHeader("Vary", "Accept-Encoding");
    },
  }));

  app.get("/assets/{*rest}", (_req, res) => {
    res.status(404).end();
  });

  const staticExtRegex = /\.(js|css|map|woff2?|ttf|png|jpg|jpeg|gif|svg|ico|webp|avif)$/;
  app.get(staticExtRegex, (_req, res) => {
    res.status(404).end();
  });

  const indexHtml = await fsp.readFile(path.resolve(distPath, "index.html"), "utf-8");

  app.use((req, res) => {
    let injected = injectMetaCached(indexHtml, req.path);

    // Task #38 — when `E2E_TEST_HOOKS=1`, inject the inline flag that
    // flips `window.__EXENTAX_E2E_TRACKING__` to true so the analytics
    // layer pushes events into `window.dataLayer` instead of
    // short-circuiting on dev / localhost. No-op in real production
    // (E2E_TEST_HOOKS is never set on real deploys). We do NOT route
    // this through `injectMetaCached` because the cache is keyed only
    // on `req.path` and we want to keep the cached SSR HTML pristine.
    injected = maybeInjectE2eTrackingHook(injected);

    // Single source of truth (`server/spa-html.ts`) used by both the dev
    // pipeline (`server/vite.ts`) and prod here. It:
    //   1. Rewrites `<html lang>` so the attribute matches the URL locale
    //      (Googlebot + screen readers see the right language for /en, /fr,
    //      /de, /pt, /ca instead of the baked-in `lang="es"`).
    //   2. Validates blog post slugs against the real `BLOG_POSTS` +
    //      `BLOG_SLUG_I18N` registries — unknown slugs return 404 +
    //      noindex instead of soft-200s that pollute the index.
    //   3. Forces noindex on `/booking/:token` (real SPA route, must not
    //      be indexed because the URL leaks the booking token in logs).
    const prepared = prepareSpaHtml(injected, req.path);

    if (prepared.status === 404) {
      res.status(404);
      // Server-side 404 logging — captures path + referrer (origin+path
      // only, no query/hash so we cannot accidentally leak tokens) + UA.
      // No PII: we never log query strings, cookies, or IPs here.
      const rawReferrer = (req.headers.referer || req.headers.referrer || "") as string;
      let referrer = "-";
      if (rawReferrer) {
        try {
          const u = new URL(rawReferrer);
          referrer = `${u.origin}${u.pathname}`;
        } catch {
          referrer = rawReferrer.split("?")[0].split("#")[0].slice(0, 200);
        }
      }
      const ua = (req.headers["user-agent"] || "") as string;
      const cleanPath = req.path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
      logger.info(
        `[404] path=${cleanPath} referrer=${referrer} ua="${ua.slice(0, 160)}"`,
        "static",
      );
    }

    if (prepared.noindex) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(prepared.html);
  });
}
