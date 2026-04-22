import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import { BLOG_POSTS, getTranslatedSlug, BLOG_COUNTRIES, FEATURED_OWNER_SLUGS, type BlogCountryCode } from "@/data/blog-posts";
import { loadBlogContent, prefetchBlogContent, hasBlogTranslation } from "@/data/blog-posts-content";
import { loadBlogI18nForLang, subscribeBlogI18n, getLocalizedBlogMeta as getLocalizedMeta, isBlogI18nReady, prefetchBlogI18nForLang } from "@/data/blog-posts-i18n";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import { BRAND } from "@/lib/constants";
import { CATEGORY_ICON_MAP } from "@/components/blog/CategoryBadge";
import CountryDropdown from "@/components/blog/CountryDropdown";

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};


function BlogCard({ slug, title, excerpt, category, readTime, publishedAt, lang }: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  lang: SupportedLang;
}) {
  const { t } = useTranslation();
  const localized = getLocalizedMeta(slug, lang);
  const displayTitle = localized?.title || title;
  const displayExcerpt = localized?.excerpt || excerpt;
  const dateLocale = LANG_LOCALE_MAP[lang] ?? LANG_LOCALE_MAP.es;
  const formattedDate = new Date(publishedAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const prefetch = () => { void loadBlogContent(slug, lang); };

  return (
    <Link
      href={`/${lang}/blog/${getTranslatedSlug(slug, lang)}`}
      data-testid={`card-blog-${slug}`}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
    >
      <article className="group editorial-card glass-editorial flex flex-col h-full cursor-pointer overflow-hidden rounded-token-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
        <div className="p-7 sm:p-8 flex flex-col flex-1">
          {/* Eyebrow: muted category + read time */}
          <div className="flex items-center gap-2 mb-4 text-[12px] font-body text-[var(--text-3)]">
            <span className="font-semibold" data-testid={`label-category-${slug}`}>
              {t(`blogPost.categories.${category}`, category)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{readTime} {t("blogPost.minRead")}</span>
          </div>

          {/* Title, the protagonist */}
          <h2
            className="font-heading font-bold text-[22px] sm:text-[24px] leading-[1.2] tracking-[-0.025em] text-[var(--text-1)] mb-4 group-hover:text-[var(--green-hover)] transition-colors duration-200 line-clamp-3"
            data-testid={`title-blog-${slug}`}
          >
            {displayTitle}
          </h2>

          {/* Excerpt */}
          <p className="text-[var(--text-2)] text-[14.5px] leading-[1.65] mb-8 flex-1 line-clamp-3">
            {displayExcerpt}
          </p>

          {/* Footer with hairline divider */}
          <div className="flex items-center justify-between pt-5 mt-auto border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <img
                src="/ex-author-icon.png"
                alt={BRAND.NAME}
                className="w-5 h-5 rounded-full object-cover flex-shrink-0 overflow-hidden"
                style={{ clipPath: "circle(50%)" }}
                loading="lazy"
                data-testid="img-author-blog-list"
              />
              <time className="text-[var(--text-3)] text-[12.5px] font-body" dateTime={publishedAt}>
                {formattedDate}
              </time>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[var(--green-hover)] text-[13px] font-body font-semibold transition-transform duration-200 group-hover:translate-x-1">
              {t("blogPost.read")}
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndex() {
  const { t, i18n } = useTranslation();
  const ref = useReveal();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (!fromUrl) return null;
    // The URL slug is the ASCII-safe lowercased category name (see
    // client/src/lib/blog-categories.ts). Resolve it back to its display
    // value by matching against the categories present in BLOG_POSTS.
    const target = fromUrl
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const allCats = [...new Set(BLOG_POSTS.map((p) => p.category))];
    const matched = allCats.find((c) => {
      const slug = c
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return slug === target;
    });
    return matched || null;
  });
  const [activeCountry, setActiveCountry] = useState<BlogCountryCode | null>(() => {
    if (typeof window === "undefined") return null;
    const fromUrl = new URLSearchParams(window.location.search).get("country");
    const codes = BLOG_COUNTRIES as ReadonlyArray<string>;
    if (fromUrl && codes.includes(fromUrl.toUpperCase())) {
      return fromUrl.toUpperCase() as BlogCountryCode;
    }
    const stored = window.localStorage.getItem("exentax:blog:country");
    if (stored && codes.includes(stored)) return stored as BlogCountryCode;
    return null;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (activeCountry) {
      url.searchParams.set("country", activeCountry);
      window.localStorage.setItem("exentax:blog:country", activeCountry);
    } else {
      url.searchParams.delete("country");
      window.localStorage.removeItem("exentax:blog:country");
    }
    if (activeCategory) {
      const slug = activeCategory
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      url.searchParams.set("category", slug);
    } else {
      url.searchParams.delete("category");
    }
    const next = url.pathname + (url.search ? url.search : "") + url.hash;
    window.history.replaceState(null, "", next);
  }, [activeCountry, activeCategory]);
  const params = useParams<{ lang?: string }>();
  const urlLang = params?.lang as SupportedLang | undefined;
  const fallbackLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const candidate = urlLang ?? fallbackLang;
  const lang = SUPPORTED_LANGS.includes(candidate) ? candidate : "es";
  const [, forceRender] = useState(0);
  useEffect(() => {
    void loadBlogI18nForLang(lang);
    return subscribeBlogI18n(() => forceRender(n => n + 1));
  }, [lang]);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = w.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => {
      for (const l of SUPPORTED_LANGS) {
        if (l !== "es" && l !== lang) prefetchBlogI18nForLang(l);
      }
    }, { timeout: 4000 });
    return () => cancel(id as number);
  }, [lang]);

  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const i18nReady = isBlogI18nReady(lang);
  const availablePosts = useMemo(
    () => {
      if (lang !== "es" && !i18nReady) return BLOG_POSTS;
      return BLOG_POSTS.filter(p => hasBlogTranslation(p.slug, lang));
    },
    [lang, i18nReady]
  );

  const categories = useMemo(() => {
    const cats = [...new Set(availablePosts.map(p => p.category))];
    return cats.sort();
  }, [availablePosts]);

  const filteredPosts = useMemo(() => {
    const byDate = [...availablePosts].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Pin owner-focused featured posts to the top fold so they have a stable,
    // predictable presence across all 6 languages regardless of publish date.
    const noFilters = !search.trim() && !activeCategory && !activeCountry;
    const sorted = noFilters
      ? (() => {
          const featured: typeof byDate = [];
          const rest: typeof byDate = [];
          const featuredSet = new Set(FEATURED_OWNER_SLUGS);
          const orderIndex = new Map(
            FEATURED_OWNER_SLUGS.map((s, i) => [s, i] as const),
          );
          for (const post of byDate) {
            if (featuredSet.has(post.slug)) featured.push(post);
            else rest.push(post);
          }
          featured.sort(
            (a, b) =>
              (orderIndex.get(a.slug) ?? 0) - (orderIndex.get(b.slug) ?? 0),
          );
          return [...featured, ...rest];
        })()
      : byDate;

    return sorted.filter(post => {
      const matchesCategory = !activeCategory || post.category === activeCategory;
      if (!matchesCategory) return false;

      const matchesCountry =
        !activeCountry || !post.countries || post.countries.length === 0 || post.countries.includes(activeCountry);
      if (!matchesCountry) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const localized = getLocalizedMeta(post.slug, lang);
      const searchTitle = localized?.title || post.title;
      const searchExcerpt = localized?.excerpt || post.excerpt;
      const categoryLabel = t(`blogPost.categories.${post.category}`, post.category);
      return (
        searchTitle.toLowerCase().includes(q) ||
        searchExcerpt.toLowerCase().includes(q) ||
        categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [availablePosts, search, activeCategory, activeCountry, lang, t]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeCategory, activeCountry, lang]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount]
  );
  const hasMore = visibleCount < filteredPosts.length;

  useEffect(() => {
    const topSlugs = filteredPosts.slice(0, 5).map(p => p.slug);
    if (topSlugs.length === 0) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const cancel = w.cancelIdleCallback ?? window.clearTimeout;
    const id = schedule(() => {
      for (const s of topSlugs) prefetchBlogContent(s, lang);
    }, { timeout: 3000 });
    return () => cancel(id as number);
  }, [filteredPosts, lang]);

  return (
    <>
      <SEO
        title={t("blogPost.seoTitle")}
        description={t("blogPost.seoDescription")}
        ogTitle={(t("blogPost.ogTitle", { defaultValue: "" }) as string) || undefined}
        ogDescription={(t("blogPost.ogDescription", { defaultValue: "" }) as string) || undefined}
        keywords={t("blogPost.seoKeywords")}
        path={`/${lang}/blog`}
        breadcrumbs={[{ name: t("blogPost.breadcrumbBlog"), path: `/${lang}/blog` }]}
      />

      <section className="section-padding min-h-[60vh] bg-[var(--bg-0)]">
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="reveal mb-10 max-w-3xl mx-auto">
            <h1 className="font-heading font-bold text-[28px] sm:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)] mb-4" data-testid="heading-blog">
              {t("blogPost.heading")}
            </h1>
            <p className="text-[var(--text-2)] text-base sm:text-lg leading-relaxed" data-testid="subtitle-blog">
              {t("blogPost.subtitle")}
            </p>
          </div>

          <div className="reveal">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 mb-6 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[rgba(0,229,16,0.10)] via-[rgba(0,229,16,0.03)] to-[rgba(0,229,16,0.10)] blur-[10px] opacity-60 pointer-events-none" aria-hidden="true" />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none z-10" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("blogPost.searchPlaceholder")}
                  className="glass relative w-full pl-11 pr-10 py-3 rounded-full ring-1 ring-inset ring-[rgba(0,229,16,0.18)] text-[var(--text-1)] placeholder-[var(--text-3)] text-sm font-body shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,229,16,0.18)] focus:outline-none focus:ring-[rgba(0,229,16,0.55)] focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_0_0_3px_rgba(0,229,16,0.12),0_10px_30px_-12px_rgba(0,229,16,0.35)] transition-all duration-200"
                  data-testid="input-blog-search"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200 z-10"
                    aria-label={t("blogPost.clearSearch")}
                    data-testid="button-clear-search"
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>

              <CountryDropdown value={activeCountry} onChange={setActiveCountry} />
            </div>

            <div
              className="flex flex-nowrap gap-2 mb-8 overflow-x-auto sm:justify-center max-w-full mx-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
              role="tablist"
              aria-label={t("blogPost.allFilter")}
            >
              <button
                onClick={(e) => {
                  setActiveCategory(null);
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                }}
                className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 whitespace-nowrap ${
                  !activeCategory
                    ? "bg-[var(--green)] text-[#0B0D0C] shadow-[0_8px_24px_-10px_rgba(0,229,16,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                    : "border border-[rgba(11,13,12,0.18)] text-[var(--text-1)] bg-white hover:border-[rgba(0,229,16,0.55)] hover:bg-[rgba(0,229,16,0.06)] hover:text-[var(--green-hover)] shadow-[0_1px_2px_rgba(11,13,12,0.06)]"
                }`}
                data-testid="filter-all"
                role="tab"
                aria-selected={!activeCategory}
              >
                {t("blogPost.allFilter")}
              </button>
              {categories.map(cat => {
                const Icon = CATEGORY_ICON_MAP[cat] || CATEGORY_ICON_MAP["Guías"];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={(e) => {
                      setActiveCategory(isActive ? null : cat);
                      e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                    }}
                    className={`flex-shrink-0 snap-start inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-[var(--green)] text-[#0B0D0C] shadow-[0_8px_24px_-10px_rgba(0,229,16,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                        : "border border-[rgba(11,13,12,0.18)] text-[var(--text-1)] bg-white hover:border-[rgba(0,229,16,0.55)] hover:bg-[rgba(0,229,16,0.06)] hover:text-[var(--green-hover)] shadow-[0_1px_2px_rgba(11,13,12,0.06)]"
                    }`}
                    data-testid={`filter-${cat.toLowerCase()}`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <Icon />
                    {t(`blogPost.categories.${cat}`, cat)}
                  </button>
                );
              })}
            </div>

            {(search || activeCategory || activeCountry) && (
              <p className="mb-6 text-[var(--text-3)] text-[13px] font-body text-center" data-testid="text-search-results">
                {t("blogPost.articlesFound", { count: filteredPosts.length })}
                {search && <> {t("blogPost.forQuery")} "<span className="text-[var(--text-2)]">{search}</span>"</>}
                {activeCategory && <> {t("blogPost.inCategory")} <span className="text-[#00B70D] dark:text-[#4DFF5A] font-medium">{t(`blogPost.categories.${activeCategory}`, activeCategory)}</span></>}
                {activeCountry && <> {t("blogPost.inCountry")} <span className="text-[#00B70D] dark:text-[#4DFF5A] font-medium">{t(`blogPost.countries.${activeCountry}`, activeCountry)}</span></>}
              </p>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <>
              <div id="blog-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-7 text-left">
                {visiblePosts.map((post, i) => (
                  <div
                    key={post.slug}
                    style={{
                      opacity: 1,
                      animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both`,
                      animationDelay: `${Math.min(i % PAGE_SIZE, 5) * 60}ms`,
                    }}
                  >
                    <BlogCard {...post} lang={lang} />
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <p className="text-[var(--text-3)] text-[13px] font-body" data-testid="text-pagination-status">
                    {t("blogPost.showingCount", { shown: visiblePosts.length, total: filteredPosts.length })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="blog-load-more"
                    data-testid="button-load-more"
                  >
                    {t("blogPost.loadMore")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="reveal text-center py-20 glass-editorial">
              <p className="text-[var(--text-1)] text-lg font-heading font-semibold mb-2">{t("blogPost.noResults")}</p>
              <p className="text-[var(--text-3)] text-sm font-body">{t("blogPost.noResultsHint")}</p>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
