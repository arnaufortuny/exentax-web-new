import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import { trackCTA } from "@/components/Tracking";
import {
  BLOG_POSTS,
  FEATURED_OWNER_SLUGS,
  getTranslatedSlug,
} from "@/data/blog-posts";
import {
  getLocalizedBlogMeta,
  loadBlogI18nForLang,
  subscribeBlogI18n,
} from "@/data/blog-posts-i18n";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";

interface ExistingLlcCalloutProps {
  variant?: "section" | "compact";
  testIdSuffix?: string;
  showFeaturedPosts?: boolean;
}

const RAIL_SLUGS = FEATURED_OWNER_SLUGS.slice(0, 3);

export default function ExistingLlcCallout({
  variant = "section",
  testIdSuffix = "default",
  showFeaturedPosts = true,
}: ExistingLlcCalloutProps) {
  const { t, i18n } = useTranslation();
  const lp = useLangPath();
  const rawLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const lang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : "es";
  const [, forceRender] = useState(0);
  useEffect(() => {
    void loadBlogI18nForLang(lang);
    return subscribeBlogI18n(() => forceRender(n => n + 1));
  }, [lang]);

  const auditHref = lp(
    `/blog/${getTranslatedSlug(
      "auditoria-rapida-llc-12-puntos-30-minutos",
      lang,
    )}`,
  );
  const bookHref = lp("book");

  const railPosts = showFeaturedPosts
    ? RAIL_SLUGS.map(slug => BLOG_POSTS.find(p => p.slug === slug)).filter(
        (p): p is NonNullable<typeof p> => Boolean(p),
      )
    : [];

  return (
    <div
      className={
        variant === "section"
          ? "reveal mb-16 lg:mb-20"
          : "reveal mt-10 mb-4 max-w-3xl mx-auto"
      }
      data-testid={`existing-llc-callout-${testIdSuffix}`}
    >
      <div
        className="relative overflow-hidden rounded-[28px] p-7 sm:p-9 lg:p-11"
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(28px) saturate(1.7)",
          WebkitBackdropFilter: "blur(28px) saturate(1.7)",
          border: "1px solid rgba(0,229,16,0.22)",
          borderTop: "2px solid #00E510",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 0% 0%, rgba(0,229,16,0.10), transparent 65%)",
          }}
        />
        <div className="relative grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-8">
            <span
              className="inline-block font-body font-semibold text-[12px] sm:text-[13px] mb-3 px-3 py-1 rounded-full"
              style={{
                color: "#0FA958",
                background: "rgba(0,229,16,0.10)",
                border: "1px solid rgba(0,229,16,0.22)",
              }}
              data-testid={`existing-llc-tag-${testIdSuffix}`}
            >
              {t("existingLlc.tag")}
            </span>
            <h3
              className="text-[24px] sm:text-[28px] lg:text-[32px] leading-[1.1] text-[var(--text-1)] mb-3"
              data-testid={`existing-llc-title-${testIdSuffix}`}
            >
              {t("existingLlc.title")}
            </h3>
            <p className="text-base lg:text-[17px] text-[var(--text-2)] leading-relaxed">
              {t("existingLlc.desc")}
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3 lg:items-stretch">
            <Link
              href={auditHref}
              onClick={() =>
                trackCTA(`existing_llc_audit_${testIdSuffix}`, auditHref)
              }
              className="inline-flex items-center justify-center btn-primary px-6 py-3 text-base rounded-full whitespace-nowrap"
              data-testid={`button-existing-llc-audit-${testIdSuffix}`}
            >
              {t("existingLlc.btnAudit")}
            </Link>
            <Link
              href={bookHref}
              onClick={() =>
                trackCTA(`existing_llc_book_${testIdSuffix}`, bookHref)
              }
              className="inline-flex items-center justify-center font-body font-semibold px-6 py-3 text-base rounded-full whitespace-nowrap border border-[rgba(0,229,16,0.35)] text-[var(--text-1)] hover:bg-[rgba(0,229,16,0.06)] transition-colors"
              data-testid={`button-existing-llc-book-${testIdSuffix}`}
            >
              {t("existingLlc.btnBook")}
            </Link>
          </div>
        </div>

        {railPosts.length > 0 && (
          <div
            className="relative mt-8 pt-7 border-t border-[rgba(0,229,16,0.18)] grid sm:grid-cols-3 gap-4"
            data-testid={`existing-llc-rail-${testIdSuffix}`}
          >
            {railPosts.map(post => {
              const localized = getLocalizedBlogMeta(post.slug, lang);
              const title = localized?.title || post.title;
              const href = lp(
                `/blog/${getTranslatedSlug(post.slug, lang)}`,
              );
              return (
                <Link
                  key={post.slug}
                  href={href}
                  onClick={() =>
                    trackCTA(
                      `existing_llc_post_${post.slug}_${testIdSuffix}`,
                      href,
                    )
                  }
                  className="group block rounded-2xl p-4 border border-[rgba(0,229,16,0.18)] bg-white/40 hover:bg-[rgba(0,229,16,0.06)] hover:border-[rgba(0,229,16,0.45)] transition-colors"
                  data-testid={`existing-llc-post-${post.slug}-${testIdSuffix}`}
                >
                  <div className="text-[12px] font-body font-semibold text-[#0FA958] mb-2">
                    {t(`blogPost.categories.${post.category}`, post.category)}
                  </div>
                  <div className="text-[15px] sm:text-[15.5px] font-heading font-semibold text-[var(--text-1)] leading-snug group-hover:text-[var(--green-hover)] transition-colors line-clamp-3">
                    {title}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-body font-semibold text-[var(--green-hover)]">
                    {t("blogPost.read")}
                    <svg
                      width={12}
                      height={12}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
