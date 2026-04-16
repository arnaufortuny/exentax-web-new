import express, { type Express } from "express";
import fsp from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { PAGE_META, PAGE_META_I18N, PAGE_SEO_CONTENT, PAGE_SEO_CONTENT_I18N, FAQ_SCHEMA_ENTRIES, PAGE_SCHEMAS } from "./seo-content";
import { getAllLocalizedPaths, resolveServerRoute, getLocalizedPath } from "../shared/routes";
import type { SupportedLang } from "./server-constants";
import { BLOG_POSTS } from "../client/src/data/blog-posts";
import { BLOG_CONTENT_ES } from "../client/src/data/blog-posts-content-es";
import { BLOG_I18N } from "../client/src/data/blog-posts-i18n";
import { getTranslatedSlug, resolveToSpanishSlug } from "../client/src/data/blog-posts-slugs";
import { getRelatedPosts } from "../client/src/data/blog-related";
import { SITE_URL, SUPPORTED_LANGS, BRAND_NAME, INSTAGRAM_URL, TIKTOK_URL, LINKEDIN_URL, CONTACT_EMAIL } from "./server-constants";

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

function injectMeta(html: string, reqPath: string): string {
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
      meta = {
        title: i18nMeta?.metaTitle || post.metaTitle,
        description: i18nMeta?.metaDescription || post.metaDescription,
        canonical: canonicalPath,
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
      const prerenderContent = i18nPost?.content || BLOG_CONTENT_ES[post.slug] || "";
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
      `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${lang}/blog/${getTranslatedSlug(blogSlug!, lang)}" />`
    ).join("\n    ");
    const xDefaultLink = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/es/blog/${blogSlug}" />`;
    html = html.replace(HREFLANG_STRIP_RE, '');
    html = html.replace('</head>', `${hreflangLinks}\n    ${xDefaultLink}\n  </head>`);
  } else if (cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/) || cleanPath === "/blog") {
    const blogIndexHreflang = SUPPORTED.map(lang =>
      `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}/${lang}/blog" />`
    ).join("\n    ");
    const blogIndexXDefault = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}/es/blog" />`;
    html = html.replace(HREFLANG_STRIP_RE, '');
    html = html.replace('</head>', `${blogIndexHreflang}\n    ${blogIndexXDefault}\n  </head>`);
  } else {
    html = html.replace(HREFLANG_STRIP_RE, '');
    const resolved = resolveServerRoute(cleanPath);
    if (resolved) {
      const nonBlogHreflang = SUPPORTED.map(lang =>
        `<link rel="alternate" hreflang="${lang}" href="${BASE_URL}${getLocalizedPath(resolved.key, lang as SupportedLang)}" />`
      ).join("\n    ");
      const nonBlogXDefault = `<link rel="alternate" hreflang="x-default" href="${BASE_URL}${getLocalizedPath(resolved.key, "es")}" />`;
      html = html.replace('</head>', `    ${nonBlogHreflang}\n    ${nonBlogXDefault}\n  </head>`);
    } else {
      const canonicalLoc = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
      const fallbackHreflang = SUPPORTED.map(lang =>
        `<link rel="alternate" hreflang="${lang}" href="${canonicalLoc}" />`
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
<h1>Blog — ${(ARTICLE_META_I18N[blogLang2] || ARTICLE_META_I18N.es).section}</h1>
<nav><ul>${blogLinks}</ul></nav>
</article>`;
  }
  if (seoContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${seoContent}</div></div>`
    );
  }

  const allJsonLd: any[] = [];

  // `resolvedRoute` is null for the unprefixed root `/` (routeKey is
  // still "home" via the fallback on line 271). Use routeKey +
  // prerenderLang so the home/FAQ schemas reliably fire on `/` and
  // every `/{lang}`.
  if (routeKey === "faq") {
    allJsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_SCHEMA_ENTRIES,
    });
  }

  if (routeKey === "home") {
    allJsonLd.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": BRAND_NAME,
      "url": BASE_URL,
      "logo": `${BASE_URL}/icon-192.png`,
      "description": "Tax consulting for freelancers, digital nomads, and entrepreneurs. US LLC creation and management, tax optimization, and fiscal compliance.",
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
    // WebSite schema — identifies the site to search engines and clusters
    // language alternates. We intentionally do not claim a SearchAction /
    // sitelinks-search-box because the blog does not yet implement a
    // query-param-driven search endpoint; asserting it would be misleading.
    allJsonLd.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": BRAND_NAME,
      "url": BASE_URL,
      "inLanguage": [prerenderLang, ...SUPPORTED_LANGS.filter(l => l !== prerenderLang)],
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
    });
  }

  let pageSchemas = routeKey ? PAGE_SCHEMAS[routeKey] : undefined;
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
          "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
          "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
          "datePublished": publishedTime,
          "dateModified": modifiedTime,
          "mainEntityOfPage": articleUrl,
          "inLanguage": blogLang,
          "articleSection": post.category || (ARTICLE_META_I18N[blogLang] || ARTICLE_META_I18N.es).section,
          "wordCount": Math.round((BLOG_CONTENT_ES[post.slug] || "").split(/\s+/).length)
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

  const localizedPaths = getAllLocalizedPaths();
  const KNOWN_PATHS = new Set([
    ...Object.keys(PAGE_META),
    ...Object.keys(PAGE_META_I18N),
    ...localizedPaths,
    "/links", "/start",
  ]);
  const LANG_PREFIX_RE = /^\/(es|en|fr|de|pt|ca)(\/|$)/;

  app.use((req, res) => {
    const cleanPath = req.path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
    const langMatch = cleanPath.match(LANG_PREFIX_RE);
    const basePath = langMatch ? (cleanPath.slice(langMatch[1].length + 1) || "/") : cleanPath;
    const isBlogPost = basePath.startsWith("/blog/") && basePath !== "/blog";
    const isBlogIndex = basePath === "/blog";
    const isLangBlogRoute = !!langMatch && (isBlogPost || isBlogIndex);

    const isKnown = KNOWN_PATHS.has(cleanPath) || isBlogPost || isBlogIndex || isLangBlogRoute;

    let injected = injectMetaCached(indexHtml, req.path);

    if (!isKnown) {
      res.status(404);
      injected = injected.replace(
        /<meta name="robots" content="[^"]*"/,
        `<meta name="robots" content="noindex, nofollow"`
      );
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(injected);
  });
}
