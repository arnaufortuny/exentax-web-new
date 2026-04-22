import { useEffect } from "react";
import i18n, { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import { BRAND, CONTACT } from "@/lib/constants";
import { resolveRoute, getLocalizedPath } from "@shared/routes";

// Dynamically loaded only when a blog post mounts SEO. Keeps the ~80 KB
// blog catalogue out of the eager SEO bundle that every page pulls in.
type BlogSlugHelpers = {
  getTranslatedSlug: (slug: string, lang: SupportedLang) => string;
  getAvailableLangsForSlug: (slug: string) => readonly string[];
};
let blogHelpersPromise: Promise<BlogSlugHelpers> | null = null;
function loadBlogHelpers(): Promise<BlogSlugHelpers> {
  if (!blogHelpersPromise) {
    blogHelpersPromise = Promise.all([
      import("@/data/blog-posts-slugs"),
      import("@/data/blog-posts-content"),
    ]).then(([slugs, content]) => ({
      getTranslatedSlug: slugs.getTranslatedSlug,
      getAvailableLangsForSlug: content.getAvailableLangsForSlug,
    }));
  }
  return blogHelpersPromise;
}

// og:locale uses underscore per OpenGraph spec (es_ES).
const LOCALE_MAP: Record<string, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_PT",
  ca: "ca_ES",
};

// hreflang uses the BCP-47 hyphen form (es-ES) — Google strongly prefers
// this over bare 2-letter codes for country-specific targeting. Server-side
// sitemaps already emit BCP-47 (`server/routes/public.ts` HREFLANG_BCP47);
// this map keeps the client tags in lockstep so auditors never see two
// different formats for the same page.
const HREFLANG_BCP47: Record<string, string> = {
  es: "es-ES",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  ca: "ca-ES",
};

function t(key: string): string {
  return i18n.t(key);
}

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  ogType?: string;
  breadcrumbs?: { name: string; path: string }[];
  noindex?: boolean;
  blogSlug?: string;
  ogTitle?: string;
  ogDescription?: string;
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

const BASE_TITLE = BRAND.TITLE;
const BASE_URL = CONTACT.SITE_URL;

function stripBrandSuffix(value: string): string {
  return value.replace(/\s*[|\-–—]\s*Exentax\s*$/i, "").trim();
}
export default function SEO({ title, description, path, keywords, image, jsonLd, ogType, breadcrumbs, noindex, blogSlug, ogTitle, ogDescription, articleMeta }: SEOProps) {
  const currentLang = (i18n.language || "es").split("-")[0];

  useEffect(() => {
    const fullTitle = title
      ? (title.includes(BASE_TITLE) ? title : `${title} | ${BASE_TITLE}`)
      : `${BASE_TITLE} | ${t("seo.defaultSubtitle")}`;
    document.title = fullTitle;

    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords || t("seo.defaultKeywords"));

    const ogImage = image || `${BASE_URL}/og-image.png`;
    const socialTitle = ogTitle || (title ? stripBrandSuffix(title) : fullTitle);
    const socialDescription = ogDescription || description;
    setMeta('property', 'og:title', socialTitle);
    setMeta('property', 'og:description', socialDescription);
    setMeta('property', 'og:type', ogType || 'website');
    if (path) setMeta('property', 'og:url', `${BASE_URL}${path}`);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:type', 'image/png');

    setMeta('property', 'og:locale', LOCALE_MAP[currentLang] || 'es_ES');
    setMultiMeta(
      'property',
      'og:locale:alternate',
      SUPPORTED_LANGS
        .filter((l) => l !== currentLang)
        .map((l) => LOCALE_MAP[l] || 'es_ES'),
    );
    setMeta('property', 'og:site_name', BRAND.NAME);

    if (ogType === 'article') {
      setMeta('property', 'article:author', BRAND.NAME);
      setMeta('property', 'article:publisher', CONTACT.SITE_URL);
      setMeta('property', 'article:published_time', articleMeta?.publishedTime || '');
      setMeta('property', 'article:modified_time', articleMeta?.modifiedTime || articleMeta?.publishedTime || '');
      setMeta('property', 'article:section', articleMeta?.section || t("seo.articleSection"));
      setMultiMeta('property', 'article:tag', articleMeta?.tags || [t("seo.articleTagLLC"), t("seo.articleTagOptimization"), t("seo.articleTagFreelancers")]);
    } else {
      removeMeta('property', 'article:author');
      removeMeta('property', 'article:publisher');
      removeMeta('property', 'article:published_time');
      removeMeta('property', 'article:modified_time');
      removeMeta('property', 'article:section');
      removeAllMeta('property', 'article:tag');
    }

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', socialTitle);
    setMeta('name', 'twitter:description', socialDescription);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:image:alt', t("seo.twitterAlt"));
    setMeta('name', 'twitter:site', BRAND.TWITTER_HANDLE);

    const rawPath = path || "/";
    const resolved = resolveRoute(rawPath);
    const canonicalUrl = resolved
      ? `${BASE_URL}${getLocalizedPath(resolved.key, resolved.lang)}`
      : blogSlug
        ? `${BASE_URL}${rawPath}`
        : `${BASE_URL}${rawPath}`;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    }

    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach(tag => tag.remove());

    let cancelled = false;
    if (path && !noindex) {
      const isBlog = !!blogSlug;
      if (isBlog) {
        // Blog pages need the catalogue to know which translations exist for
        // a given post, so load it on demand. Non-blog pages skip this entirely.
        void loadBlogHelpers().then((helpers) => {
          if (cancelled) return;
          const langsForHreflang = helpers.getAvailableLangsForSlug(blogSlug!) as SupportedLang[];
          for (const lang of langsForHreflang) {
            const link = document.createElement("link");
            link.rel = "alternate";
            link.hreflang = HREFLANG_BCP47[lang] || lang;
            link.href = `${BASE_URL}/${lang}/blog/${helpers.getTranslatedSlug(blogSlug!, lang)}`;
            document.head.appendChild(link);
          }
          const xDefault = document.createElement("link");
          xDefault.rel = "alternate";
          xDefault.hreflang = "x-default";
          xDefault.href = `${BASE_URL}/es/blog/${blogSlug}`;
          document.head.appendChild(xDefault);
        });
      } else {
        for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
          const link = document.createElement("link");
          link.rel = "alternate";
          link.hreflang = HREFLANG_BCP47[lang] || lang;
          if (resolved) {
            link.href = `${BASE_URL}${getLocalizedPath(resolved.key, lang)}`;
          } else {
            link.href = `${BASE_URL}/${lang}${rawPath === "/" ? "" : rawPath}`;
          }
          document.head.appendChild(link);
        }
        const xDefault = document.createElement("link");
        xDefault.rel = "alternate";
        xDefault.hreflang = "x-default";
        if (resolved) {
          xDefault.href = `${BASE_URL}${getLocalizedPath(resolved.key, "es")}`;
        } else {
          xDefault.href = `${BASE_URL}/es${rawPath === "/" ? "" : rawPath}`;
        }
        document.head.appendChild(xDefault);
      }
    }

    document.documentElement.setAttribute("lang", currentLang);

    const allJsonLd: Record<string, unknown>[] = [];

    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        allJsonLd.push(...jsonLd);
      } else {
        allJsonLd.push(jsonLd);
      }
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": t("seo.breadcrumbHome"), "item": BASE_URL },
          ...breadcrumbs.map((bc, i) => ({
            "@type": "ListItem",
            "position": i + 2,
            "name": bc.name,
            "item": `${BASE_URL}${bc.path}`,
          })),
        ],
      };
      allJsonLd.push(breadcrumbLd);
    }

    let jsonLdEl = document.getElementById('page-jsonld');
    if (allJsonLd.length > 0) {
      if (!jsonLdEl) {
        jsonLdEl = document.createElement('script');
        jsonLdEl.id = 'page-jsonld';
        jsonLdEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(jsonLdEl);
      }
      jsonLdEl.textContent = JSON.stringify(allJsonLd.length === 1 ? allJsonLd[0] : allJsonLd);
    } else if (jsonLdEl) {
      jsonLdEl.remove();
    }

    return () => {
      cancelled = true;
      const el = document.getElementById('page-jsonld');
      if (el) el.remove();
      const dynamicSelectors = [
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:type"]',
        'meta[property="og:url"]',
        'meta[property="og:image"]',
        'meta[property="og:image:width"]',
        'meta[property="og:image:height"]',
        'meta[property="og:image:type"]',
        'meta[property="og:locale"]',
        'meta[property="og:site_name"]',
        'meta[property="article:author"]',
        'meta[property="article:publisher"]',
        'meta[property="article:published_time"]',
        'meta[property="article:modified_time"]',
        'meta[property="article:section"]',
        'meta[property="article:tag"]',
        'meta[name="twitter:card"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
        'meta[name="twitter:image:alt"]',
        'meta[name="twitter:site"]',
        'meta[name="description"]',
        'meta[name="keywords"]',
        'meta[name="robots"]',
      ];
      dynamicSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(m => m.remove());
      });
    };
  }, [title, description, path, keywords, image, jsonLd, ogType, breadcrumbs, noindex, ogTitle, ogDescription, articleMeta, currentLang]);

  return null;
}

function setMeta(attr: 'name' | 'property', key: string, value?: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector);
  if (value) {
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  } else if (el) {
    el.remove();
  }
}

function removeMeta(attr: 'name' | 'property', key: string) {
  const el = document.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.remove();
}

function removeAllMeta(attr: 'name' | 'property', key: string) {
  document.querySelectorAll(`meta[${attr}="${key}"]`).forEach(el => el.remove());
}

function setMultiMeta(attr: 'name' | 'property', key: string, values: string[]) {
  removeAllMeta(attr, key);
  values.forEach(value => {
    const el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('content', value);
    document.head.appendChild(el);
  });
}
