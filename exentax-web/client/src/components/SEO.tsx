import { useEffect } from "react";
import i18n, { SUPPORTED_LANGS } from "@/i18n";
import { getTranslatedSlug } from "@/data/blog-posts-slugs";
import { BRAND, CONTACT } from "@/lib/constants";

const LOCALE_MAP: Record<string, string> = {
  es: "es_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  ca: "ca_ES",
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
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

const BASE_TITLE = BRAND.TITLE;
const BASE_URL = CONTACT.SITE_URL;
export default function SEO({ title, description, path, keywords, image, jsonLd, ogType, breadcrumbs, noindex, blogSlug, articleMeta }: SEOProps) {
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
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType || 'website');
    if (path) setMeta('property', 'og:url', `${BASE_URL}${path}`);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:type', 'image/png');

    setMeta('property', 'og:locale', LOCALE_MAP[currentLang] || 'es_ES');
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
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);
    setMeta('name', 'twitter:image:alt', t("seo.twitterAlt"));
    setMeta('name', 'twitter:site', BRAND.TWITTER_HANDLE);

    const rawPath = path || "/";
    const normalizedPath = rawPath.replace(/^\/(es|en|fr|de|it|pt|ca)(\/|$)/, "/").replace(/^(?!\/)/, "/");
    const canonicalPath = blogSlug ? rawPath : normalizedPath;
    const fullUrl = `${BASE_URL}${canonicalPath}`;

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", fullUrl);
    }

    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach(tag => tag.remove());

    if (path && !noindex) {
      const isBlog = !!blogSlug;
      for (const lang of SUPPORTED_LANGS) {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = lang;
        if (isBlog) {
          const langSlug = getTranslatedSlug(blogSlug!, lang);
          link.href = `${BASE_URL}/${lang}/blog/${langSlug}`;
        } else {
          link.href = `${BASE_URL}/${lang}${normalizedPath === "/" ? "" : normalizedPath}`;
        }
        document.head.appendChild(link);
      }
      const xDefault = document.createElement("link");
      xDefault.rel = "alternate";
      xDefault.hreflang = "x-default";
      if (isBlog) {
        xDefault.href = `${BASE_URL}/es/blog/${blogSlug}`;
      } else {
        xDefault.href = fullUrl;
      }
      document.head.appendChild(xDefault);
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
  }, [title, description, path, keywords, image, jsonLd, ogType, breadcrumbs, noindex, articleMeta, currentLang]);

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
