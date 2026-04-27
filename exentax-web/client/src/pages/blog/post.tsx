import { useParams, Link } from "wouter";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BRAND, CONTACT } from "@/lib/constants";
import ArticleCTA from "@/components/blog/ArticleCTA";
import SEO from "@/components/SEO";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { getBlogPost, getTranslatedSlug, resolveToSpanishSlug, getRelatedPosts, type BlogPost } from "@/data/blog-posts";
import { loadBlogContent, prefetchBlogContent, hasBlogTranslation } from "@/data/blog-posts-content";
import { loadBlogI18nForLang, subscribeBlogI18n, getLocalizedBlogMeta as getLocalizedMeta, isBlogI18nReady, prefetchBlogI18nForLang } from "@/data/blog-posts-i18n";
import { sanitizeHtml } from "@/lib/sanitize";
import NotFound from "@/pages/not-found";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import { trackWhatsAppClick, trackScrollDepth, trackTimeOnPage, trackBlogRead } from "@/components/Tracking";
import AiSummaryButtons from "@/components/blog/AiSummaryButtons";
import { renderSourcesBlockHtml } from "@/data/blog-sources";
import { extractFaqQA, buildFaqJsonLd } from "@/lib/blog-faq-extract";
import { categoryToSlug } from "@/lib/blog-categories";
import { getBlogCtaTarget } from "@/data/blog-cta-routes";

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};

export type TocItem = { id: string; text: string; level: 2 | 3; children: TocItem[] };

function slugifyHeading(text: string, used: Map<string, number>): string {
  let base = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  if (!base) base = "section";
  const count = used.get(base) || 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function stripHtmlTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseMarkdown(content: string, agendarPath: string = "/es/agendar"): { html: string; toc: TocItem[] } {
  const lines = content.split("\n");
  let html = "";
  let listType: "ul" | "ol" | null = null;
  let inTable = false;
  let tableRows: string[][] = [];
  let inQuote = false;
  let quoteBuffer: string[] = [];
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();

  // Auto-CTA detection disabled: per CTA contract (task #38) every article carries
  // exactly two explicit CTA blocks (mid + final) inserted directly into the
  // markdown. We use an impossible regex so any prose that happens to mention
  // "agenda tu asesoría" / "book your consultation" / etc. is rendered as plain
  // text and never silently turned into an extra link.
  const ctaPattern = /(?!x)x/g;

  function escapeAttr(s: string): string {
    return s
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatInline(text: string): string {
    let out = text.replace(
      /\[([^\]\n]+)\]\(([^)\s]+)\)/g,
      (_m, label: string, url: string) => `<a href="${escapeAttr(url)}">${label}</a>`,
    );
    out = out
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
    out = out.replace(/\*\*/g, "").replace(/(^|\s)\*(\s|$)/g, "$1$2");
    out = out.replace(
      ctaPattern,
      `<a href="${agendarPath}">$&</a>`
    );
    return out;
  }

  function closeList() {
    if (listType) {
      html += listType === "ol" ? "</ol>" : "</ul>";
      listType = null;
    }
  }

  function flushQuote() {
    if (!inQuote) return;
    const inner = quoteBuffer.map(t => `<p>${formatInline(t)}</p>`).join("");
    html += `<blockquote>${inner}</blockquote>`;
    quoteBuffer = [];
    inQuote = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.replace(/^\s+/, "").replace(/\s+$/, "");

    if (line.startsWith(">")) {
      closeList();
      const text = line.replace(/^>\s?/, "");
      if (!inQuote) inQuote = true;
      if (text.length > 0) quoteBuffer.push(text);
      continue;
    } else if (inQuote) {
      flushQuote();
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) continue;
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(cells);
      const nextLine = (lines[i + 1] || "").replace(/^\s+/, "").replace(/\s+$/, "");
      const isEndOfTable = !nextLine || !nextLine.startsWith("|");
      if (isEndOfTable) {
        html += '<div class="blog-table-wrap"><div class="blog-table-scroll"><table class="blog-table">';
        tableRows.forEach((row, rowIdx) => {
          if (rowIdx === 0) {
            html += "<thead><tr>";
            row.forEach(cell => { html += `<th>${formatInline(cell)}</th>`; });
            html += "</tr></thead><tbody>";
          } else {
            html += "<tr>";
            row.forEach(cell => { html += `<td>${formatInline(cell)}</td>`; });
            html += "</tr>";
          }
        });
        html += "</tbody></table></div></div>";
        inTable = false;
        tableRows = [];
      }
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      closeList();
      html += "<hr />";
    } else if (/^##\s*[^#]/.test(line) && !line.startsWith("###")) {
      closeList();
      const title = line.replace(/^##\s*/, "").replace(/^#+\s*/, "");
      const text = stripHtmlTags(formatInline(title));
      const id = slugifyHeading(text, usedIds);
      html += `<h2 id="${id}">${formatInline(title)}</h2>`;
      toc.push({ id, text, level: 2, children: [] });
    } else if (/^###\s*[^#]/.test(line) && !line.startsWith("####")) {
      closeList();
      const title = line.replace(/^###\s*/, "").replace(/^#+\s*/, "");
      const text = stripHtmlTags(formatInline(title));
      const id = slugifyHeading(text, usedIds);
      html += `<h3 id="${id}">${formatInline(title)}</h3>`;
      const child: TocItem = { id, text, level: 3, children: [] };
      if (toc.length > 0) toc[toc.length - 1].children.push(child);
      else toc.push(child);
    } else if (/^####\s*[^#]/.test(line)) {
      closeList();
      const title = line.replace(/^####\s*/, "").replace(/^#+\s*/, "");
      html += `<h4>${formatInline(title)}</h4>`;
    } else if (/^#\s+[^#]/.test(line)) {
      closeList();
      const title = line.replace(/^#\s*/, "");
      html += `<h2>${formatInline(title)}</h2>`;
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (listType !== "ul") { closeList(); html += "<ul>"; listType = "ul"; }
      html += `<li>${formatInline(line.slice(2))}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") { closeList(); html += "<ol>"; listType = "ol"; }
      const text = line.replace(/^\d+\.\s/, "");
      html += `<li>${formatInline(text)}</li>`;
    } else if (line.trim() === "") {
      closeList();
    } else {
      closeList();
      html += `<p>${formatInline(line)}</p>`;
    }
  }
  flushQuote();
  closeList();
  return { html, toc };
}

function ShareButtons({ title, slug, lang }: { title: string; slug: string; lang: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [igCopied, setIgCopied] = useState(false);
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

  const handleInstagram = () => {
    const openInstagram = () => {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    };
    navigator.clipboard.writeText(url).then(
      () => {
        setIgCopied(true);
        setTimeout(() => setIgCopied(false), 2400);
        openInstagram();
      },
      () => {
        openInstagram();
      }
    );
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
        href={`${CONTACT.WHATSAPP_BASE}?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#25D366] hover:bg-[rgba(37,211,102,0.06)] transition-colors duration-200"
        title={t("blogPost.shareOnWhatsApp")}
        data-testid="share-whatsapp"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#1877F2] hover:bg-[rgba(24,119,242,0.08)] transition-colors duration-200"
        title={t("blogPost.shareOnFacebook")}
        data-testid="share-facebook"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#0A66C2] hover:bg-[rgba(10,102,194,0.08)] transition-colors duration-200"
        title={t("blogPost.shareOnLinkedIn")}
        data-testid="share-linkedin"
      >
        <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <button
        onClick={handleInstagram}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[#E4405F] hover:bg-[rgba(228,64,95,0.08)] transition-colors duration-200 relative"
        title={igCopied ? t("blogPost.shareOnInstagramCopied") : t("blogPost.shareOnInstagram")}
        data-testid="share-instagram"
        aria-live="polite"
      >
        {igCopied ? (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#E4405F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        ) : (
          <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        )}
      </button>
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

// Deprecated (Task #7): retained for type compatibility but no longer rendered.
// The single related-articles block is `RelatedReadsBlock` below.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _SidebarRelated_unused({ posts, lang }: { posts: BlogPost[]; lang: string }) {
  const { t } = useTranslation();
  if (posts.length === 0) return null;
  const related = posts;

  return (
    <div className="glass-editorial p-5 sm:p-6">
      <div className="mb-4 px-1">
        <span
          className="block font-heading font-semibold text-[13px] text-[var(--text-2)]"
          data-testid="sidebar-related-title"
        >
          {t("blogPost.relatedTitle")}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {related.map(post => {
          const localized = getLocalizedMeta(post.slug, lang as SupportedLang);
          return (
            <li key={post.slug}>
              <Link
                href={`/${lang}/blog/${getTranslatedSlug(post.slug, lang)}`}
                data-testid={`sidebar-${post.slug}`}
                onMouseEnter={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
                onFocus={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
                onTouchStart={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
                className="sidebar-related-item group block rounded-2xl px-3 py-3.5 cursor-pointer transition-colors duration-200"
              >
                <span className="block text-[var(--text-3)] text-[12px] font-body font-medium">
                  {t(`blogPost.categories.${post.category}`, post.category)}
                </span>
                <h4 className="font-heading font-semibold text-[14.5px] leading-snug text-[var(--text-1)] mt-2 group-hover:text-[var(--green-hover)] transition-colors duration-200 line-clamp-3">
                  {localized?.title || post.title}
                </h4>
                <p className="text-[var(--text-3)] text-[11.5px] mt-2 font-body">
                  {post.readTime} {t("blogPost.minRead")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RelatedReadsBlock({ posts, lang }: { posts: BlogPost[]; lang: string }) {
  const { t } = useTranslation();
  if (posts.length === 0) return null;
  const related = posts;
  const dateLocale = LANG_LOCALE_MAP[lang] ?? LANG_LOCALE_MAP.es;

  return (
    <section className="mt-24 pt-16 border-t border-[var(--border)]" data-testid="bottom-related">
      <div className="mb-12">
        <h3 className="font-heading font-bold text-[28px] sm:text-[34px] leading-[1.1] tracking-[-0.028em] text-[var(--text-1)]">
          {t("blogPost.relatedTitle")}
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-9">
        {related.map(post => {
          const localized = getLocalizedMeta(post.slug, lang as SupportedLang);
          const formattedDate = new Date(post.publishedAt).toLocaleDateString(dateLocale, {
            year: "numeric", month: "short", day: "numeric",
          });
          return (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${getTranslatedSlug(post.slug, lang)}`}
              data-testid={`bottom-related-${post.slug}`}
              onMouseEnter={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
              onFocus={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
              onTouchStart={() => { void loadBlogContent(post.slug, lang as SupportedLang); }}
            >
              <article className="group editorial-card glass-editorial h-full p-7 sm:p-8 flex flex-col cursor-pointer">
                <div className="mb-5">
                  <span className="text-[var(--text-3)] text-[12.5px] font-body font-medium">
                    {t(`blogPost.categories.${post.category}`, post.category)}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-[19px] leading-[1.32] tracking-[-0.018em] text-[var(--text-1)] mb-4 line-clamp-3 transition-colors duration-200 group-hover:text-[var(--green-hover)]">
                  {localized?.title || post.title}
                </h4>
                <p className="text-[var(--text-2)] text-[14px] leading-[1.7] mb-8 line-clamp-3 flex-1 font-body">
                  {localized?.excerpt || post.excerpt}
                </p>
                <div className="flex items-center justify-between gap-4 pt-5 border-t border-[var(--border-subtle)] mt-auto">
                  <div className="flex items-center gap-2 text-[var(--text-3)] text-[12px] font-body min-w-0">
                    <time dateTime={post.publishedAt} className="truncate">{formattedDate}</time>
                    <span aria-hidden="true" className="opacity-50">·</span>
                    <span className="whitespace-nowrap">{post.readTime} {t("blogPost.minRead")}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[var(--text-1)] text-[12.5px] font-semibold transition-all duration-200 group-hover:gap-2.5 group-hover:text-[var(--green-hover)] whitespace-nowrap">
                    {t("blogPost.read")}
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TableOfContents({ items, title, variant }: { items: TocItem[]; title: string; variant: "desktop" | "mobile" }) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const flatIds = (() => {
    const out: string[] = [];
    for (const it of items) {
      out.push(it.id);
      for (const c of it.children) out.push(c.id);
    }
    return out;
  })();

  useEffect(() => {
    if (flatIds.length === 0) return;
    const elements = flatIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        if (visible.size > 0) {
          let bestId = "";
          let bestTop = Infinity;
          for (const id of visible.keys()) {
            const el = document.getElementById(id);
            if (!el) continue;
            const top = el.getBoundingClientRect().top;
            if (top < bestTop) { bestTop = top; bestId = id; }
          }
          if (bestId) setActiveId(bestId);
        } else {
          // pick last heading above viewport
          let lastAbove = "";
          for (const el of elements) {
            if (el.getBoundingClientRect().top < 140) lastAbove = el.id;
          }
          if (lastAbove) setActiveId(lastAbove);
        }
      },
      { rootMargin: "-120px 0px -65% 0px", threshold: [0, 1] }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatIds.join("|")]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 112;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    if (variant === "mobile") setOpen(false);
  };

  const renderItem = (item: TocItem, isChild = false) => {
    const isActive = activeId === item.id;
    return (
      <li key={item.id}>
        <a
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          aria-current={isActive ? "location" : undefined}
          data-testid={`toc-link-${item.id}`}
          className={`block rounded-md transition-colors duration-200 font-body ${isChild ? "pl-5 py-1.5 text-[12.5px]" : "pl-3 py-2 text-[13px] font-medium"} ${isActive ? "text-[var(--green-hover)] border-l-2 border-[var(--green-hover)] -ml-[2px]" : "text-[var(--text-3)] hover:text-[var(--text-1)] border-l-2 border-transparent -ml-[2px]"}`}
        >
          {item.text}
        </a>
        {item.children.length > 0 && (
          <ul className="mt-0.5 mb-1 flex flex-col">
            {item.children.map(c => renderItem(c, true))}
          </ul>
        )}
      </li>
    );
  };

  if (variant === "mobile") {
    return (
      <nav
        aria-label={title}
        className="lg:hidden glass-editorial p-4 mb-8"
        data-testid="toc-mobile"
      >
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="toc-mobile-list"
          data-testid="toc-mobile-toggle"
          className="w-full flex items-center justify-between gap-3 text-left"
        >
          <span className="font-heading font-semibold text-[13px] text-[var(--text-2)]">
            {title}
          </span>
          <svg
            width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className={`text-[var(--text-3)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        {open && (
          <ul id="toc-mobile-list" className="mt-3 flex flex-col gap-0.5">
            {items.map(it => renderItem(it))}
          </ul>
        )}
      </nav>
    );
  }

  return (
    <nav
      aria-label={title}
      className="glass-editorial p-5 sm:p-6"
      data-testid="toc-desktop"
    >
      <div className="mb-3 px-1">
        <span className="block font-heading font-semibold text-[13px] text-[var(--text-2)]">
          {title}
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
        {items.map(it => renderItem(it))}
      </ul>
    </nav>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string; lang?: string }>();
  const { slug } = params;
  const { t, i18n } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
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

  const resolvedSlug = slug ? resolveToSpanishSlug(slug, lang) : slug;
  const post = resolvedSlug ? getBlogPost(resolvedSlug) : undefined;

  const [contentText, setContentText] = useState<string | undefined>(undefined);
  const [contentLang, setContentLang] = useState<SupportedLang | undefined>(undefined);
  const [contentReady, setContentReady] = useState(false);

  const computedReadTime = useMemo(() => {
    if (!contentText) return post?.readTime ?? 0;
    const plain = contentText
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_~|`-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!plain) return post?.readTime ?? 0;
    const words = plain.split(" ").filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));
    return minutes;
  }, [contentText, post?.readTime]);
  const articleRef = useRef<HTMLDivElement>(null);
  // Tracks whether `blog_read` has already fired for the currently
  // mounted post. We deliberately lift this OUT of the scroll effect
  // so it survives re-runs caused by `computedReadTime` updating
  // once the lazy article body finishes loading. Reset by the
  // slug-keyed effect below when the visitor opens a new post.
  // Task #69.
  const blogReadFiredRef = useRef<string | null>(null);

  const postSlugForLoad = post?.slug;

  useEffect(() => {
    if (!post?.slug) return;
    const slugForEvent = post.slug;
    const readTimeForEvent = computedReadTime || post.readTime || 0;
    const startedAt = Date.now();
    const fired: Record<number, boolean> = { 25: false, 50: false, 75: false, 100: false };
    // Reset the once-per-slug guard when the visitor lands on a
    // different post; effect re-runs caused by `computedReadTime`
    // changing for the SAME slug keep the guard intact (the ref
    // already holds `slugForEvent`), so `blog_read` still fires
    // exactly once per post visit.
    if (blogReadFiredRef.current !== slugForEvent && blogReadFiredRef.current !== `${slugForEvent}:fired`) {
      blogReadFiredRef.current = slugForEvent;
    }
    const onScroll = () => {
      const doc = document.documentElement;
      const total = (doc.scrollHeight || 0) - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
      ([25, 50, 75, 100] as const).forEach(threshold => {
        if (!fired[threshold] && pct >= threshold) {
          fired[threshold] = true;
          try { trackScrollDepth(threshold, { slug: slugForEvent, language: lang }); } catch { /* best-effort */ }
        }
      });
      // Engaged-read signal — once the visitor crosses 50% scroll on
      // a blog post we treat it as a "read" for GA4 funnels (similar
      // to GA4's default "scroll" engagement event but keyed off the
      // article slug + language so per-post performance is visible).
      // Fires at most once per post visit (the guard lives on a ref
      // so effect re-runs from `computedReadTime` updating do not
      // re-fire it). Task #69.
      if (blogReadFiredRef.current === slugForEvent && pct >= 50) {
        blogReadFiredRef.current = `${slugForEvent}:fired`;
        try {
          trackBlogRead({
            slug: slugForEvent,
            language: lang,
            read_time: readTimeForEvent,
          });
        } catch { /* best-effort */ }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      const seconds = (Date.now() - startedAt) / 1000;
      if (seconds >= 3 && seconds <= 60 * 60) {
        try { trackTimeOnPage(seconds, { slug: slugForEvent, language: lang }); } catch { /* best-effort */ }
      }
    };
  }, [post?.slug, lang, computedReadTime, post?.readTime]);

  useEffect(() => {
    if (!post) return;
    const topSlugs = getRelatedPosts(
      post,
      (s) => hasBlogTranslation(s, lang),
      6,
    ).map(p => p.slug);
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
  }, [post, lang]);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const pattern = new RegExp(`^/([a-z]{2})/blog/([^/?#]+)`);
    const handle = (ev: Event) => {
      const target = ev.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const m = href.match(pattern);
      if (!m) return;
      const linkLang = m[1] as SupportedLang;
      const translatedSlug = m[2];
      if (!SUPPORTED_LANGS.includes(linkLang)) return;
      const canonical = resolveToSpanishSlug(translatedSlug, linkLang) ?? translatedSlug;
      void loadBlogContent(canonical, linkLang);
    };
    el.addEventListener("mouseover", handle);
    el.addEventListener("focusin", handle);
    el.addEventListener("touchstart", handle, { passive: true });
    return () => {
      el.removeEventListener("mouseover", handle);
      el.removeEventListener("focusin", handle);
      el.removeEventListener("touchstart", handle);
    };
  }, [contentText]);

  useEffect(() => {
    if (!postSlugForLoad) return;
    let cancelled = false;
    setContentReady(false);
    setContentText(undefined);
    setContentLang(undefined);
    (async () => {
      try {
        const direct = await loadBlogContent(postSlugForLoad, lang);
        if (cancelled) return;
        if (direct) {
          setContentText(direct);
          setContentLang(lang);
        }
      } finally {
        if (!cancelled) setContentReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [postSlugForLoad, lang]);

  if (!post && slug) {
    const directPost = getBlogPost(slug);
    if (directPost) {
      const correctSlug = getTranslatedSlug(directPost.slug, lang);
      if (correctSlug !== slug) {
        // Server issues a 301 for direct hits; this client-side fallback
        // covers SPA in-app navigation that misses the server route.
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `/${lang}/blog/${correctSlug}`);
        }
      }
    }
  }

  if (!post) return <NotFound />;

  if (!hasBlogTranslation(post.slug, lang)) {
    if (!isBlogI18nReady(lang)) {
      return <div style={{ minHeight: "100vh", background: "var(--bg-0, #F7F6F2)" }} />;
    }
    return (
      <>
        <SEO
          title={t("blogPost.seoTitle")}
          description={t("blogPost.seoDescription")}
          path={`/${lang}/blog`}
          noindex
        />
        <NotFound />
      </>
    );
  }

  const localized = getLocalizedMeta(post.slug, lang);
  const displayTitle = localized?.title || post.title;
  const displayMetaTitle = localized?.metaTitle || post.metaTitle;
  const displayMetaDesc = localized?.metaDescription || post.metaDescription;
  // Short variant for og:/twitter: card. Falls back to the long meta
  // description when no explicit social string is configured. Featured posts
  // get tightened copy in `blog-posts.ts` (es) / `blog-i18n/<lang>.ts`.
  const displaySocialDesc = localized?.socialDescription || post.socialDescription;
  // Persuasive social-card title (≤60). Generated per post per language by
  // scripts/seo/inject-blog-og.mjs and persisted in blog-posts.ts (es) /
  // blog-i18n/<lang>.ts. Falls back to metaTitle when absent.
  const displayOgTitle = localized?.ogTitle || post.ogTitle || displayMetaTitle;
  // Persuasive social-card description (120–160). Same source as ogTitle;
  // when absent we cascade socialDescription → metaDescription so previews
  // never go empty.
  const displayOgDesc = localized?.ogDescription || post.ogDescription || displaySocialDesc || displayMetaDesc;
  const displayKeywords = (localized?.keywords && localized.keywords.length
    ? localized.keywords
    : post.keywords && post.keywords.length
      ? post.keywords
      : undefined)?.join(", ");
  const dateLocale = LANG_LOCALE_MAP[lang] ?? LANG_LOCALE_MAP.es;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })
    : null;

  const parsed = contentText ? parseMarkdown(contentText, lp("book")) : { html: "", toc: [] as TocItem[] };
  // Inject the styled per-article Sources block (Task #12) right before the
  // final in-article CTA marker (`<!-- exentax:cta-v1 -->`) when present, so
  // the order is: body → sources → final CTA. When no marker exists in the
  // body, fall back to appending right before the React-rendered <ArticleCTA>.
  // Driven by SOURCES_BY_SLUG in client/src/data/blog-sources.ts; the legacy
  // "Sources:" line in the Markdown bodies has been stripped by
  // scripts/cleanup-blog-sources.mjs.
  // Anchor on the full CTA block boundary, not just the opening comment, so
  // the <aside> is never injected inside a <p> autocreated by the markdown
  // parser around the marker line. Match (in order of preference):
  //   1. <p><!-- exentax:cta-v1 --></p>   (marker wrapped in a paragraph)
  //   2. <!-- exentax:cta-v1 -->          (raw comment block)
  const sourcesHtml = post ? renderSourcesBlockHtml(post.slug, lang) : "";
  const CTA_MARKER_BLOCK_RE = /(<p>\s*<!--\s*exentax:cta-v1\s*-->\s*<\/p>|<!--\s*exentax:cta-v1\s*-->)/i;
  const articleHtml = sourcesHtml
    ? CTA_MARKER_BLOCK_RE.test(parsed.html)
      ? parsed.html.replace(CTA_MARKER_BLOCK_RE, `${sourcesHtml}$1`)
      : parsed.html + sourcesHtml
    : parsed.html;
  const tocItems = parsed.toc;
  const topLevelCount = tocItems.filter(i => i.level === 2).length;
  const showToc = topLevelCount >= 3;

  const isAvailable = (s: string) => hasBlogTranslation(s, lang);
  // Task #7: a single related-articles block (bottom grid) is rendered. The
  // sidebar duplicate was removed; the helper still expects an exclusion list
  // that we keep empty for clarity.
  const bottomRelated = getRelatedPosts(post, isAvailable, 3);

  const currentTranslatedSlug = getTranslatedSlug(post.slug, lang);
  const articleUrl = `${CONTACT.SITE_URL}/${lang}/blog/${currentTranslatedSlug}`;
  const categorySlug = categoryToSlug(post.category);
  const categoryLabel = t(`blogPost.categories.${post.category}`, post.category);
  const categoryPath = `/${lang}/blog?category=${encodeURIComponent(categorySlug)}`;

  // FAQPage JSON-LD: parsed from the article body so it always matches the
  // visible FAQ section. Articles without a FAQ block silently skip this
  // block (Google rejects empty FAQPage entities).
  const faqPairs = contentText ? extractFaqQA(contentText, lang) : [];
  const faqJsonLd = buildFaqJsonLd(faqPairs, articleUrl, lang);

  // Task #14 (GEO): BlogPosting now uses a Person author (Exentax editorial
  // team byline) and a publisher referenced by `@id` to the canonical
  // Organization in `index.html`. Authoritative entity authoring is one of
  // the strongest signals AI engines use when deciding which source to cite.
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": displayTitle,
    "description": displayMetaDesc,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": "Exentax Editorial Team",
      "jobTitle": "International tax & US LLC compliance specialists",
      "worksFor": { "@id": `${CONTACT.SITE_URL}/#organization` },
      "url": `${CONTACT.SITE_URL}/${lang}`,
    },
    "publisher": { "@id": `${CONTACT.SITE_URL}/#organization` },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "url": articleUrl,
    "image": `${CONTACT.SITE_URL}/og-image.png`,
    "inLanguage": lang,
    "articleSection": post.category,
    ...(displayKeywords ? { "keywords": displayKeywords } : {}),
    "about": {
      "@type": "Thing",
      "name": t("blogPost.seoAbout"),
    },
  };

  // Task #14 (GEO): a curated allow-list of procedural posts that genuinely
  // describe a step-by-step how-to. We deliberately keep the list short so
  // we never emit HowTo schema for opinion pieces or country-overview posts
  // (Google penalises HowTo on non-procedural content). Slugs are the
  // canonical Spanish slugs from `client/src/data/blog-posts.ts`.
  const HOWTO_PROCEDURAL_SLUGS: ReadonlySet<string> = new Set([
    "constituir-llc-proceso-paso-a-paso",
    "ein-numero-fiscal-llc-como-obtenerlo",
    "cuenta-bancaria-mercury-llc-extranjero",
    "form-5472-que-es-como-presentarlo",
    "extension-irs-form-1120-como-solicitarla",
    "boi-report-fincen-guia-completa-2026",
    "wise-business-llc-guia",
    "como-operar-llc-dia-a-dia",
    "registered-agent-que-es-por-que-necesitas",
    "operating-agreement-llc-que-es",
  ]);

  // Build a HowTo from the article's H2 headings (already extracted into
  // `tocItems` for the table-of-contents). We keep at most 12 steps and
  // require at least 3, otherwise the schema would mislead crawlers.
  const howToJsonLd: Record<string, unknown> | null = (() => {
    if (!HOWTO_PROCEDURAL_SLUGS.has(post.slug)) return null;
    const steps = parsed.toc
      .filter((i) => i.level === 2)
      .slice(0, 12)
      .map((s, idx) => ({
        "@type": "HowToStep",
        position: idx + 1,
        name: s.text,
        url: `${articleUrl}#${s.id}`,
      }));
    if (steps.length < 3) return null;
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: displayTitle,
      description: (localized?.excerpt?.trim() || post.excerpt?.trim() || displayMetaDesc),
      totalTime: "P30D",
      inLanguage: lang,
      mainEntityOfPage: { "@id": articleUrl },
      step: steps,
    };
  })();

  const allJsonLd: Record<string, unknown>[] = [blogPostingJsonLd];
  if (faqJsonLd) allJsonLd.push(faqJsonLd);
  if (howToJsonLd) allJsonLd.push(howToJsonLd);

  return (
    <>
      <SEO
        title={displayMetaTitle}
        description={displayMetaDesc}
        ogTitle={displayOgTitle}
        ogDescription={displayOgDesc}
        keywords={displayKeywords}
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
          { name: categoryLabel, path: categoryPath },
          { name: displayTitle, path: `/${lang}/blog/${currentTranslatedSlug}` },
        ]}
        jsonLd={allJsonLd}
      />

      <article className="bg-[var(--bg-0)]" style={{ paddingBottom: 64 }}>
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-20">
          <div className="reveal">
            <nav aria-label={t("blogPost.breadcrumbAriaLabel")} className="mb-8" data-testid="blog-breadcrumbs">
              <ol className="flex flex-wrap items-center gap-2 text-[12.5px] font-body">
                <li>
                  <Link href={`/${lang}`} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200">
                    {BRAND.NAME}
                  </Link>
                </li>
                <li className="text-[var(--text-3)] opacity-50">/</li>
                <li>
                  <Link href={`/${lang}/blog`} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200">
                    {t("blogPost.breadcrumbBlog")}
                  </Link>
                </li>
                <li className="text-[var(--text-3)] opacity-50">/</li>
                <li>
                  <Link
                    href={categoryPath}
                    className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200"
                    data-testid={`link-breadcrumb-category-${categorySlug}`}
                  >
                    {categoryLabel}
                  </Link>
                </li>
                <li className="text-[var(--text-3)] opacity-50">/</li>
                <li className="text-[var(--text-2)] min-w-0 break-words" aria-current="page">
                  {displayTitle}
                </li>
              </ol>
            </nav>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              <div className="flex-1 min-w-0 lg:max-w-[740px]">
                <div className="flex items-center gap-3 mb-7">
                  <span className="text-[var(--text-3)] text-[13px] font-body font-medium" data-testid="badge-post-category">
                    {t(`blogPost.categories.${post.category}`, post.category)}
                  </span>
                  <span className="text-[var(--text-3)] opacity-40">·</span>
                  <span className="text-[var(--text-3)] text-[13px] font-body" data-testid="text-post-readtime">{computedReadTime} {t("blogPost.minRead")}</span>
                </div>

                <h1 className="font-heading font-bold text-[clamp(30px,4.4vw,50px)] leading-[1.04] tracking-[-0.035em] text-[var(--text-1)] mb-8" data-testid="heading-post">
                  {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-6 border-b border-[var(--border)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 text-[var(--text-2)] text-[13.5px] font-body font-medium">
                      <img src="/ex-author-icon.png" alt={t("blogPost.authorAvatarAlt")} className="w-6 h-6 rounded-full object-cover flex-shrink-0 overflow-hidden" style={{ clipPath: "circle(50%)" }} loading="lazy" data-testid="img-author-blog-post" />
                      {t("blogPost.byExentax")}
                    </span>
                    <span className="text-[var(--text-3)] opacity-40">·</span>
                    <time className="text-[var(--text-3)] text-[13.5px] font-body" dateTime={post.publishedAt}>
                      {formattedDate}
                    </time>
                    {updatedDate && (
                      <>
                        <span className="text-[var(--text-3)] opacity-40">·</span>
                        <span className="text-[var(--text-3)] text-[13.5px] font-body">
                          {t("blogPost.updated")} {updatedDate}
                        </span>
                      </>
                    )}
                  </div>
                  <ShareButtons title={displayTitle} slug={post.slug} lang={lang} />
                </div>

                {showToc && (
                  <TableOfContents items={tocItems} title={t("blogPost.tocTitle")} variant="mobile" />
                )}

                <AiSummaryButtons title={displayTitle} slug={post.slug} lang={lang} />

                <div
                  ref={articleRef}
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(articleHtml) }}
                />

                <div className="mt-12 flex items-center justify-between pt-6 border-t border-[var(--border)]">
                  <span className="text-[var(--text-3)] text-[13.5px] font-body">{t("blogPost.wasHelpful")}</span>
                  <ShareButtons title={displayTitle} slug={post.slug} lang={lang} />
                </div>

                {/* Single source of truth for the post-article CTA card.
                    Task #7: hand-rolled buttons removed in favour of the
                    reusable `ArticleCTA` component. */}
                {(() => {
                  const target = getBlogCtaTarget(post.slug);
                  return (
                    <ArticleCTA
                      surface="blog_post_cta"
                      route={target.route}
                      secondaryRoute={target.secondaryRoute}
                      pattern={target.pattern}
                      slug={post.slug}
                    />
                  );
                })()}
              </div>

              <aside className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
                <div className="lg:sticky lg:top-28 flex flex-col gap-6">
                  {showToc && (
                    <div className="hidden lg:block">
                      <TableOfContents items={tocItems} title={t("blogPost.tocTitle")} variant="desktop" />
                    </div>
                  )}
                </div>
              </aside>
            </div>

            {/* Single related-articles block (Task #7): the duplicate
                SidebarRelated was removed in favour of this richer grid so that
                every reader (mobile and desktop) sees exactly one
                "Related Articles" section. */}
            <RelatedReadsBlock posts={bottomRelated} lang={lang} />
          </div>
        </div>
      </article>

    </>
  );
}
