import { resolveServerRoute, SUPPORTED_LANGS, type SupportedLang } from "../shared/routes";
import { BLOG_POSTS } from "../client/src/data/blog-posts";
import { BLOG_SLUG_I18N } from "../client/src/data/blog-posts-slugs";

const LANG_PREFIX_RE = /^\/(es|en|fr|de|pt|ca)(\/|$)/;
const NOINDEX_KNOWN_RE = /^\/booking\/[^/]+$/;
const HTML_TAG_RE = /<html\b([^>]*)>/i;
const ROBOTS_META_RE = /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?\s*>/i;

const KNOWN_BARE_PATHS: ReadonlySet<string> = new Set([
  "/", "/links", "/start", "/blog",
]);

let blogSlugsByLang: Map<SupportedLang, Set<string>> | null = null;

function getBlogSlugsByLang(): Map<SupportedLang, Set<string>> {
  if (blogSlugsByLang) return blogSlugsByLang;
  const map = new Map<SupportedLang, Set<string>>();
  for (const lang of SUPPORTED_LANGS) {
    map.set(lang, new Set<string>());
  }
  for (const post of BLOG_POSTS) {
    for (const lang of SUPPORTED_LANGS) {
      map.get(lang)!.add(post.slug);
    }
    const i18n = BLOG_SLUG_I18N[post.slug];
    if (i18n) {
      for (const lang of SUPPORTED_LANGS) {
        if (lang === "es") continue;
        const slug = i18n[lang];
        if (slug) map.get(lang)!.add(slug);
      }
    }
  }
  blogSlugsByLang = map;
  return map;
}

export function getLangFromPath(pathname: string): SupportedLang {
  const m = pathname.match(LANG_PREFIX_RE);
  return (m && (SUPPORTED_LANGS as readonly string[]).includes(m[1])
    ? (m[1] as SupportedLang)
    : "es");
}

export interface SpaPathClassification {
  known: boolean;
  noindex: boolean;
  lang: SupportedLang;
}

export function classifySpaPath(rawPath: string): SpaPathClassification {
  const cleanPath =
    rawPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  const lang = getLangFromPath(cleanPath);

  if (NOINDEX_KNOWN_RE.test(cleanPath)) {
    return { known: true, noindex: true, lang };
  }

  if (KNOWN_BARE_PATHS.has(cleanPath)) {
    return { known: true, noindex: false, lang };
  }

  const langOnlyMatch = cleanPath.match(/^\/(es|en|fr|de|pt|ca)$/);
  if (langOnlyMatch) {
    return { known: true, noindex: false, lang };
  }

  const langBlogIndexMatch = cleanPath.match(/^\/(es|en|fr|de|pt|ca)\/blog$/);
  if (langBlogIndexMatch) {
    return { known: true, noindex: false, lang };
  }

  const blogPostMatch = cleanPath.match(
    /^(?:\/(es|en|fr|de|pt|ca))?\/blog\/([^/]+)$/,
  );
  if (blogPostMatch) {
    const postLang = (blogPostMatch[1] as SupportedLang | undefined) ?? "es";
    const slug = blogPostMatch[2];
    const set = getBlogSlugsByLang().get(postLang);
    if (set?.has(slug)) {
      return { known: true, noindex: false, lang: postLang };
    }
    return { known: false, noindex: true, lang: postLang };
  }

  const resolved = resolveServerRoute(cleanPath);
  if (resolved) {
    return { known: true, noindex: false, lang: resolved.lang };
  }

  return { known: false, noindex: true, lang };
}

export function rewriteSpaHtml(
  html: string,
  lang: SupportedLang,
  noindex: boolean,
): string {
  let out = html;
  out = out.replace(HTML_TAG_RE, (_match, attrs: string) => {
    const cleanedAttrs = (attrs ?? "").replace(/\s+lang=["'][^"']*["']/i, "");
    return `<html lang="${lang}"${cleanedAttrs}>`;
  });
  if (noindex) {
    if (ROBOTS_META_RE.test(out)) {
      out = out.replace(
        ROBOTS_META_RE,
        `<meta name="robots" content="noindex, nofollow" />`,
      );
    } else {
      out = out.replace(
        /<\/head>/i,
        `<meta name="robots" content="noindex, nofollow" /></head>`,
      );
    }
  }
  return out;
}

export interface PreparedSpaHtml {
  html: string;
  status: 200 | 404;
  noindex: boolean;
  lang: SupportedLang;
}

export function prepareSpaHtml(html: string, urlPath: string): PreparedSpaHtml {
  const cls = classifySpaPath(urlPath);
  return {
    html: rewriteSpaHtml(html, cls.lang, cls.noindex),
    status: cls.known ? 200 : 404,
    noindex: cls.noindex,
    lang: cls.lang,
  };
}
