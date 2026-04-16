import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import { BLOG_POSTS, getLocalizedMeta, getTranslatedSlug } from "@/data/blog-posts";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import { BRAND } from "@/lib/constants";

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};

function ComplianceIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 3V1M15 3V1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="16" width="4" height="1.5" rx="0.75" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

function GuiasIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="16" cy="14" r="1" fill="currentColor" opacity="0.35"/>
    </svg>
  );
}

function FiscalidadIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <rect x="2" y="3" width="20" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M6 15l4-4 3 2 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="18" cy="8" r="1.5" fill="currentColor" opacity="0.4"/>
      <path d="M6 18h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

function ComparativasIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <rect x="3" y="10" width="6" height="11" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="9" y="6" width="6" height="15" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <rect x="15" y="3" width="6" height="18" rx="1.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 14h2M11 10h2M17 7h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function HerramientasIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="1.2" fill="currentColor" opacity="0.25"/>
    </svg>
  );
}

function OperativaIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l3.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.35"/>
      <path d="M12 3v1M21 12h-1M12 21v-1M3 12h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

function LegalIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M5 3a2 2 0 012-2h7l5 5v14a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M14 1v5a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 13h6M9 16.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="9" y="9.5" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

const CATEGORY_ICON_MAP: Record<string, () => React.ReactElement> = {
  Todos: GuiasIcon,
  Compliance: ComplianceIcon,
  "Guías": GuiasIcon,
  Fiscalidad: FiscalidadIcon,
  Comparativas: ComparativasIcon,
  Herramientas: HerramientasIcon,
  Operativa: OperativaIcon,
  Legal: LegalIcon,
};

function CategoryBadge({ category }: { category: string }) {
  const { t } = useTranslation();
  const IconComponent = CATEGORY_ICON_MAP[category] || GuiasIcon;
  return (
    <span className="inline-flex items-center gap-1.5 bg-[rgba(0,229,16,0.08)] text-[#00E510] border border-[rgba(0,229,16,0.15)] font-body font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full" data-testid={`badge-${category.toLowerCase()}`}>
      <IconComponent />
      {t(`blogPost.categories.${category}`, category)}
    </span>
  );
}

function BlogCard({ slug, title, excerpt, category, readTime, publishedAt }: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
}) {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const lang = SUPPORTED_LANGS.includes(currentLang) ? currentLang : "es";
  const localized = getLocalizedMeta(slug, lang);
  const displayTitle = localized?.title || title;
  const displayExcerpt = localized?.excerpt || excerpt;
  const dateLocale = LANG_LOCALE_MAP[lang] ?? LANG_LOCALE_MAP.es;
  const formattedDate = new Date(publishedAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/${lang}/blog/${getTranslatedSlug(slug, lang)}`} data-testid={`card-blog-${slug}`}>
      <article
        className="group relative rounded-2xl flex flex-col h-full cursor-pointer overflow-hidden transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1"
        style={{
          background: "var(--bg-1)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(0,229,16,0.35)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,229,16,0.08), 0 4px 16px rgba(0,0,0,0.06)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E510] to-[#2FC10E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-3 mb-4">
            <CategoryBadge category={category} />
            <span className="text-[var(--text-3)] text-xs font-body tabular-nums flex-shrink-0">{readTime} min</span>
          </div>

          <h2 className="font-heading font-bold text-lg sm:text-xl leading-[1.25] tracking-[-0.02em] text-[var(--text-1)] mb-3 group-hover:text-[#00E510] transition-colors duration-200 line-clamp-3" data-testid={`title-blog-${slug}`}>
            {displayTitle}
          </h2>

          <p className="text-[var(--text-2)] text-[15px] leading-relaxed mb-5 flex-1 line-clamp-3">
            {displayExcerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
            <div className="flex items-center gap-2">
              <img src="/ex-author-icon.png" alt={BRAND.NAME} className="w-5 h-5 rounded-full object-cover flex-shrink-0 overflow-hidden" style={{ clipPath: "circle(50%)" }} loading="lazy" data-testid="img-author-blog-list" />
              <time className="text-[var(--text-3)] text-xs font-body" dateTime={publishedAt}>{formattedDate}</time>
            </div>
            <span className="inline-flex items-center gap-1 text-[#00E510] text-sm font-body font-semibold group-hover:gap-2 transition-all duration-200">
              {t("blogPost.read")}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const currentLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const lang = SUPPORTED_LANGS.includes(currentLang) ? currentLang : "es";

  const categories = useMemo(() => {
    const cats = [...new Set(BLOG_POSTS.map(p => p.category))];
    return cats.sort();
  }, []);

  const filteredPosts = useMemo(() => {
    const sorted = [...BLOG_POSTS].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return sorted.filter(post => {
      const matchesCategory = !activeCategory || post.category === activeCategory;
      if (!matchesCategory) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const localized = getLocalizedMeta(post.slug, lang);
      const searchTitle = localized?.title || post.title;
      const searchExcerpt = localized?.excerpt || post.excerpt;
      return (
        searchTitle.toLowerCase().includes(q) ||
        searchExcerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory, lang]);

  return (
    <>
      <SEO
        title={t("blogPost.seoTitle")}
        description={t("blogPost.seoDescription")}
        keywords={t("blogPost.seoKeywords")}
        path={`/${lang}/blog`}
        breadcrumbs={[{ name: t("blogPost.breadcrumbBlog"), path: `/${lang}/blog` }]}
      />

      <section className="section-padding min-h-[60vh] bg-[var(--bg-0)]">
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-10 max-w-3xl">
            <span className="section-label mb-4" data-testid="pretitle-blog">{t("blogPost.pretitle")}</span>
            <h1 className="section-h2 mb-4" data-testid="heading-blog">
              {t("blogPost.heading")}
            </h1>
            <p className="text-[var(--text-2)] text-base sm:text-lg leading-relaxed" data-testid="subtitle-blog">
              {t("blogPost.subtitle")}
            </p>
          </div>

          <div className="reveal mb-8">
            <div className="relative mb-6 max-w-md">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("blogPost.searchPlaceholder")}
                className="w-full pl-10 pr-10 py-3 rounded-full border-[1.5px] border-[rgba(0,229,16,0.3)] bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] text-sm font-body focus:outline-none focus:border-[#00E510] focus:shadow-[0_0_8px_rgba(0,229,16,0.2)] transition-all duration-200"
                data-testid="input-blog-search"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200"
                  aria-label={t("blogPost.clearSearch")}
                  data-testid="button-clear-search"
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>

            <div className="flex gap-2 flex-wrap mb-4">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-150 ${
                  !activeCategory
                    ? "bg-[#00E510] text-[#0B0D0C]"
                    : "bg-transparent text-[var(--text-3)] border border-[var(--border)] hover:border-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
                data-testid="filter-all"
              >
                {t("blogPost.allFilter")}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-150 ${
                    activeCategory === cat
                      ? "bg-[#00E510] text-[#0B0D0C]"
                      : "bg-transparent text-[var(--text-3)] border border-[var(--border)] hover:border-[var(--text-3)] hover:text-[var(--text-2)]"
                  }`}
                  data-testid={`filter-${cat.toLowerCase()}`}
                >
                  {t(`blogPost.categories.${cat}`, cat)}
                </button>
              ))}
            </div>

            {(search || activeCategory) && (
              <p className="text-[var(--text-3)] text-sm font-body" data-testid="text-search-results">
                {t("blogPost.articlesFound", { count: filteredPosts.length })}
                {search && <> {t("blogPost.forQuery")} "<span className="text-[var(--text-2)]">{search}</span>"</>}
                {activeCategory && <> {t("blogPost.inCategory")} <span className="text-[#00E510]">{t(`blogPost.categories.${activeCategory}`, activeCategory)}</span></>}
              </p>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-9">
              {filteredPosts.map((post, i) => (
                <div
                  key={post.slug}
                  style={{
                    opacity: 1,
                    animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both`,
                    animationDelay: `${Math.min(i, 5) * 60}ms`,
                  }}
                >
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="reveal text-center py-20">
              <p className="text-[var(--text-3)] text-lg font-body mb-2">{t("blogPost.noResults")}</p>
              <p className="text-[var(--text-3)] text-sm font-body">{t("blogPost.noResultsHint")}</p>
            </div>
          )}
        </div>
      </section>

    </>
  );
}
