import { useParams, Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BRAND, CONTACT } from "@/lib/constants";
import SEO from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { getBlogPost, BLOG_POSTS, getLocalizedMeta, getTranslatedSlug, resolveToSpanishSlug } from "@/data/blog-posts";
import { getLocalizedBlogContent } from "@/data/blog-posts-content";
import { sanitizeHtml } from "@/lib/sanitize";
import NotFound from "@/pages/not-found";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};

function parseMarkdown(content: string, agendarPath: string = "/agendar-asesoria"): string {
  const lines = content.split("\n");
  let html = "";
  let listType: "ul" | "ol" | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const ctaPattern = /Agenda tu asesoría(?:\sgratuita)?(?:\sfiscal)?(?:\sestratégica)?(?:\scon Exentax)?(?:\sde\s30\sminutos)?|Book your (?:free )?(?:30-minute )?(?:strategic )?(?:tax )?consultation(?:\swith Exentax)?|Réservez votre consultation(?:\sgratuite)?(?:\sstratégique)?(?:\savec Exentax)?(?:\sde\s30\sminutes)?|Buchen Sie Ihre(?:\skostenlose)?(?:\s30-minütige)?(?:\sstrategische)? Beratung(?:\smit Exentax)?|Prenota la tua consulenza(?:\sgratuita)?(?:\sstrategica)?(?:\scon Exentax)?(?:\sdi\s30\sminuti)?|Reserve sua consult(?:a|oria)(?:\sgratuita)?(?:\sestratégica)?(?:\scom (?:a )?Exentax)?(?:\sde\s30\sminutos)?|Reserva la teva consult(?:a|oria)(?:\sgratuïta)?(?:\sestratègica)?(?:\samb Exentax)?(?:\sde\s30\sminuts)?/g;

  function formatInline(text: string): string {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[var(--text-1)] font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(
        ctaPattern,
        `<a href="${agendarPath}" class="text-[#00E510] font-semibold hover:underline transition-colors duration-200">$&</a>`
      );
  }

  function closeList() {
    if (listType) {
      html += listType === "ol" ? "</ol>" : "</ul>";
      listType = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) continue;
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(cells);
      const nextLine = lines[i + 1];
      const isEndOfTable = !nextLine || !nextLine.startsWith("|");
      if (isEndOfTable) {
        html += '<div class="overflow-x-auto mb-8 rounded-xl border border-[var(--border)]"><table class="w-full text-left border-collapse">';
        tableRows.forEach((row, rowIdx) => {
          const tag = rowIdx === 0 ? "th" : "td";
          const rowClass = rowIdx === 0
            ? 'class="bg-[rgba(0,229,16,0.04)] border-b-2 border-[rgba(0,229,16,0.15)] text-[var(--text-1)] font-semibold text-sm"'
            : `class="border-b border-[var(--border)] text-[var(--text-2)] text-sm ${rowIdx === tableRows.length - 1 ? 'border-b-0' : ''}"`;
          html += `<tr ${rowClass}>`;
          row.forEach(cell => {
            html += `<${tag} class="px-5 py-3.5">${formatInline(cell)}</${tag}>`;
          });
          html += "</tr>";
        });
        html += "</table></div>";
        inTable = false;
        tableRows = [];
      }
      continue;
    }

    if (line.startsWith("## ")) {
      closeList();
      html += `<h2 class="font-heading font-bold text-[22px] sm:text-[26px] leading-[1.2] tracking-[-0.02em] text-[var(--text-1)] mt-12 mb-5 relative pl-0"><span class="absolute -left-4 top-0 bottom-0 w-1 rounded-full bg-[#00E510] hidden sm:block"></span>${formatInline(line.slice(3))}</h2>`;
    } else if (line.startsWith("### ")) {
      closeList();
      html += `<h3 class="font-heading font-semibold text-lg sm:text-xl leading-[1.2] text-[var(--text-1)] mt-8 mb-3">${formatInline(line.slice(4))}</h3>`;
    } else if (line.startsWith("- ")) {
      if (listType !== "ul") { closeList(); html += '<ul class="space-y-3 mb-7 ml-1">'; listType = "ul"; }
      html += `<li class="flex items-start gap-3 text-[var(--text-2)] text-base sm:text-[17px] leading-relaxed"><span class="w-1.5 h-1.5 rounded-full bg-[#00E510] mt-2.5 flex-shrink-0"></span><span>${formatInline(line.slice(2))}</span></li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") { closeList(); html += '<ol class="space-y-3 mb-7 ml-1 counter-reset-list">'; listType = "ol"; }
      const text = line.replace(/^\d+\.\s/, "");
      html += `<li class="flex items-start gap-3 text-[var(--text-2)] text-base sm:text-[17px] leading-relaxed list-item-numbered"><span class="w-6 h-6 rounded-full bg-[rgba(0,229,16,0.1)] text-[#00E510] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-body">${line.match(/^(\d+)/)?.[1]}</span><span>${formatInline(text)}</span></li>`;
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p class="text-[var(--text-2)] text-base sm:text-[17px] leading-[1.75] mb-5">${formatInline(line)}</p>`;
    }
  }
  closeList();
  return html;
}

function ShareButtons({ title, slug, lang }: { title: string; slug: string; lang: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const translatedSlug = getTranslatedSlug(slug, lang);
  const url = `${CONTACT.SITE_URL}/${lang}/blog/${translatedSlug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[var(--text-3)] text-xs font-body font-medium mr-1 hidden sm:inline">{t("blogPost.share")}</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#00E510] hover:bg-[rgba(0,229,16,0.06)] transition-colors duration-200"
        title={t("blogPost.shareOnX")}
        data-testid="share-x"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#0A66C2] hover:bg-[rgba(10,102,194,0.06)] transition-colors duration-200"
        title={t("blogPost.shareOnLinkedIn")}
        data-testid="share-linkedin"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a
        href={`${CONTACT.WHATSAPP_BASE}?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#25D366] hover:bg-[rgba(37,211,102,0.06)] transition-colors duration-200"
        title={t("blogPost.shareOnWhatsApp")}
        data-testid="share-whatsapp"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#00E510] hover:bg-[rgba(0,229,16,0.06)] transition-colors duration-200 relative"
        title={t("blogPost.copyLink")}
        data-testid="share-copy"
      >
        {copied ? (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        ) : (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        )}
      </button>
    </div>
  );
}

function SidebarRelated({ currentSlug, currentCategory, lang }: { currentSlug: string; currentCategory: string; lang: string }) {
  const { t } = useTranslation();
  const others = BLOG_POSTS.filter(p => p.slug !== currentSlug);
  const sameCategory = others.filter(p => p.category === currentCategory);
  const differentCategory = others.filter(p => p.category !== currentCategory);
  const related = [...sameCategory, ...differentCategory].slice(0, 5);
  if (related.length === 0) return null;

  return (
    <div>
      <h3 className="font-heading font-bold text-lg text-[var(--text-1)] mb-5" data-testid="sidebar-related-title">{t("blogPost.relatedTitle")}</h3>
      <div className="flex flex-col gap-4">
        {related.map(post => {
          const localized = getLocalizedMeta(post.slug, lang as SupportedLang);
          return (
          <Link key={post.slug} href={`/${lang}/blog/${getTranslatedSlug(post.slug, lang)}`} data-testid={`sidebar-${post.slug}`}>
            <div
              className="group rounded-2xl p-5 cursor-pointer transition-[border-color,box-shadow,transform] duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
              style={{
                background: "var(--bg-1)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,16,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span className="inline-block text-[#00E510] text-[10px] font-body font-semibold uppercase tracking-wider bg-[#00E510]/8 px-2 py-0.5 rounded-full">{t(`blogPost.categories.${post.category}`, post.category)}</span>
              <h4 className="font-heading font-bold text-sm text-[var(--text-1)] mt-2.5 group-hover:text-[#00E510] transition-colors duration-200 leading-snug line-clamp-2">
                {localized?.title || post.title}
              </h4>
              <p className="text-[var(--text-3)] text-xs mt-1.5 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {post.readTime} {t("blogPost.minRead")}
              </p>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const currentLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const lang = SUPPORTED_LANGS.includes(currentLang) ? currentLang : "es";

  const resolvedSlug = slug ? resolveToSpanishSlug(slug, lang) : slug;
  const post = resolvedSlug ? getBlogPost(resolvedSlug) : undefined;

  if (!post && slug) {
    const directPost = getBlogPost(slug);
    if (directPost) {
      const correctSlug = getTranslatedSlug(directPost.slug, lang);
      if (correctSlug !== slug) {
        window.location.replace(`/${lang}/blog/${correctSlug}`);
        return null;
      }
    }
  }

  if (!post) return <NotFound />;

  const localized = getLocalizedMeta(post.slug, lang);
  const displayTitle = localized?.title || post.title;
  const displayMetaTitle = localized?.metaTitle || post.metaTitle;
  const displayMetaDesc = localized?.metaDescription || post.metaDescription;
  const dateLocale = LANG_LOCALE_MAP[lang] || "es-ES";
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })
    : null;

  const localizedContent = lang !== "es" ? getLocalizedBlogContent(post.slug, lang) : undefined;
  const contentToRender = localizedContent || post.content;
  const articleHtml = parseMarkdown(contentToRender, lp("book"));
  const isInSpanish = lang !== "es" && !localizedContent;

  const currentTranslatedSlug = getTranslatedSlug(post.slug, lang);
  return (
    <>
      <SEO
        title={displayMetaTitle}
        description={displayMetaDesc}
        path={`/${lang}/blog/${currentTranslatedSlug}`}
        ogType="article"
        blogSlug={post.slug}
        articleMeta={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt || post.publishedAt,
          section: post.category,
          tags: [post.category, t("blogPost.seoTag1"), t("blogPost.seoTag2")],
        }}
        breadcrumbs={[
          { name: t("blogPost.breadcrumbBlog"), path: `/${lang}/blog` },
          { name: displayTitle, path: `/${lang}/blog/${currentTranslatedSlug}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": displayTitle,
          "description": displayMetaDesc,
          "datePublished": post.publishedAt,
          "dateModified": post.updatedAt || post.publishedAt,
          "author": {
            "@type": "Organization",
            "name": BRAND.NAME,
            "url": CONTACT.SITE_URL,
          },
          "publisher": {
            "@type": "Organization",
            "name": BRAND.NAME,
            "logo": {
              "@type": "ImageObject",
              "url": `${CONTACT.SITE_URL}/og-image.png`,
            },
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${CONTACT.SITE_URL}/${lang}/blog/${currentTranslatedSlug}`,
          },
          "url": `${CONTACT.SITE_URL}/${lang}/blog/${currentTranslatedSlug}`,
          "image": `${CONTACT.SITE_URL}/og-image.png`,
          "inLanguage": lang,
          "about": {
            "@type": "Thing",
            "name": t("blogPost.seoAbout"),
          },
        }}
      />

      <article className="bg-[var(--bg-0)]" style={{ paddingBottom: 56 }}>
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-20">
          <div className="reveal">
            <nav aria-label="Breadcrumb" className="mb-6" data-testid="blog-breadcrumbs">
              <ol className="flex items-center gap-1.5 text-sm font-body">
                <li>
                  <Link href={`/${lang}`} className="text-[var(--text-3)] hover:text-[#00E510] transition-colors duration-200">
                    {BRAND.NAME}
                  </Link>
                </li>
                <li className="text-[var(--text-3)]">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </li>
                <li>
                  <Link href={`/${lang}/blog`} className="text-[var(--text-3)] hover:text-[#00E510] transition-colors duration-200">
                    {t("blogPost.breadcrumbBlog")}
                  </Link>
                </li>
                <li className="text-[var(--text-3)]">
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </li>
                <li className="text-[var(--text-2)] truncate max-w-[200px] sm:max-w-[400px]" aria-current="page">
                  {displayTitle}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
              <div className="flex-1 min-w-0 lg:max-w-[720px]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center bg-[rgba(0,229,16,0.08)] text-[#00E510] border border-[rgba(0,229,16,0.15)] font-body font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full" data-testid="badge-post-category">
                    {t(`blogPost.categories.${post.category}`, post.category)}
                  </span>
                  <span className="text-[var(--text-3)] text-sm">{post.readTime} {t("blogPost.minRead")}</span>
                </div>

                <h1 className="font-heading font-bold text-[clamp(26px,3.5vw,40px)] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)] mb-6" data-testid="heading-post">
                  {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-3 mb-10 pb-8 border-b border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 text-[var(--text-2)] text-sm font-body font-medium">
                      <img src="/ex-author-icon.png" alt="Exentax" className="w-6 h-6 rounded-full object-cover flex-shrink-0 overflow-hidden" style={{ clipPath: "circle(50%)" }} loading="lazy" data-testid="img-author-blog-post" />
                      {t("blogPost.byExentax")}
                    </span>
                    <span className="text-[var(--text-3)] text-[10px]">·</span>
                    <time className="text-[var(--text-3)] text-sm" dateTime={post.publishedAt}>
                      {formattedDate}
                    </time>
                    {updatedDate && (
                      <>
                        <span className="text-[var(--text-3)] text-[10px]">·</span>
                        <span className="text-[var(--text-3)] text-sm">
                          {t("blogPost.updated")} {updatedDate}
                        </span>
                      </>
                    )}
                  </div>
                  <ShareButtons title={displayTitle} slug={post.slug} lang={lang} />
                </div>

                {isInSpanish && (
                  <div className="mb-6 rounded-xl px-5 py-3.5 flex items-center gap-3" style={{ background: "rgba(0,229,16,0.04)", border: "1px solid rgba(0,229,16,0.15)" }} data-testid="notice-article-lang">
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx={12} cy={12} r={10}/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span className="text-[var(--text-2)] text-sm font-body">{t("blogPost.articleInSpanish")}</span>
                  </div>
                )}

                <div
                  className="blog-content sm:pl-4"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(articleHtml) }}
                />

                <div className="mt-10 flex items-center justify-between pt-6 border-t border-[var(--border)]">
                  <span className="text-[var(--text-3)] text-sm font-body">{t("blogPost.wasHelpful")}</span>
                  <ShareButtons title={displayTitle} slug={post.slug} lang={lang} />
                </div>

                <div className="mt-10 rounded-2xl p-8 sm:p-10 text-center" style={{
                  background: "rgba(0,229,16,0.04)",
                  border: "1px solid rgba(0,229,16,0.18)",
                }}>
                  <p className="text-[var(--text-1)] font-heading font-bold text-xl sm:text-2xl leading-tight mb-3" data-testid="text-post-cta">
                    {t("blogPost.ctaTitle")}
                  </p>
                  <p className="text-[var(--text-2)] text-base leading-relaxed mb-6 max-w-md mx-auto">
                    {t("blogPost.ctaDesc")}
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    <Link href={lp("book")} className="inline-flex items-center justify-center whitespace-nowrap bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200" data-testid="button-post-agendar">
                      {t("blogPost.ctaBook")}
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                    <p className="text-[var(--text-3)] text-sm">{t("blogPost.ctaDirect")}</p>
                    <a
                      href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("blogPost.ctaWhatsappMsg"))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] hover:border-[#25D366] text-[var(--text-2)] hover:text-[#25D366] font-body font-semibold px-6 py-3.5 text-sm rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                      data-testid="button-post-whatsapp"
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      {t("blogPost.ctaWhatsapp")}
                    </a>
                  </div>
                </div>
              </div>

              <aside className="w-full lg:w-[300px] xl:w-[340px] flex-shrink-0">
                <div className="lg:sticky lg:top-28">
                  <SidebarRelated currentSlug={post.slug} currentCategory={post.category} lang={lang} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

    </>
  );
}
