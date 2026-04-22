/*
 * ArticleCTA — single source of truth for the post-article CTA card.
 * ---------------------------------------------------------------------------
 * Task #7 + #15. The blog body itself carries the inline CTA blocks wrapped in
 * the `<!-- exentax:cta-v1 -->` and `<!-- exentax:calc-cta-v1 -->` markers
 * (one mid-article calculator hook + one final booking link). This component
 * renders the **single** post-article booking card that lives in
 * `pages/blog/post.tsx`. Concentrating it here lets us:
 *
 *   - localise the booking destination via the routes table
 *     (`/<lang>/<book-slug>`);
 *   - share the same WhatsApp + analytics wiring across surfaces;
 *   - guarantee, by construction, that there is exactly one final booking CTA
 *     per article — no inline duplicates, no per-page hand-rolled buttons;
 *   - swap the headline / button copy via standardised CTA "patterns" from
 *     `data/blog-cta-library.ts` (Task #15) so each article can carry an
 *     editorially-aligned final card without per-article React forks.
 *
 * The mid-article calculator CTA is intentionally NOT a React component —
 * it is a Markdown contract enforced by `scripts/check-blog-links.ts`
 * (rule `missing-calc-cta`) and lives inside each article's `.ts` body
 * wrapped in `<!-- exentax:calc-cta-v1 -->` markers, so it can be edited
 * per article without touching React code.
 *
 * Analytics (Task #15)
 *   When the card mounts, we emit `cta_click` (impression flavour, via the
 *   existing `trackCTA` helper) tagged with `surface`, `cta_pattern`,
 *   `cta_route`, `slug`. Each interactive element (primary button, secondary
 *   button, WhatsApp link) emits its own `cta_click` on click with the same
 *   tags plus `cta_action`. Consent is honoured by `trackEvent` upstream.
 * ---------------------------------------------------------------------------
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { trackCTA, trackWhatsAppClick } from "@/components/Tracking";
import { useLangPath } from "@/hooks/useLangPath";
import type { RouteKey } from "@shared/routes";
import { SUPPORTED_LANGS, type SupportedLang } from "@/i18n";
import {
  getBlogCtaCopy,
  type BlogCtaPatternId,
} from "@/data/blog-cta-library";

export interface ArticleCTAProps {
  /** Tracking surface label forwarded to analytics. */
  surface?: string;
  /**
   * Optional destination for the primary button. Defaults to `book` to keep
   * the historical behaviour. Set to `service_llc_*`, `service_itin` or
   * `our_services` from `pages/blog/post.tsx` to deep-link the post-article
   * card into the most relevant subpage for the article (Task #16).
   */
  route?: RouteKey;
  /**
   * Optional secondary destination. When provided, an additional outline
   * button is rendered next to the primary one (used by comparative
   * articles where the reader may want to jump to either of the topics
   * being compared).
   */
  secondaryRoute?: RouteKey;
  /** Label for the secondary button. Falls back to the i18n key when empty. */
  secondaryLabel?: string;
  /**
   * Standardised CTA pattern id (Task #15). When provided, the card pulls
   * its title / desc / primary label / WhatsApp message from
   * `BLOG_CTA_LIBRARY` for the active locale; otherwise the legacy
   * `blogPost.cta*` i18n keys are used.
   */
  pattern?: BlogCtaPatternId;
  /** Article slug — used as `cta_slug` in analytics events. */
  slug?: string;
}

export function ArticleCTA({
  surface,
  route = "book",
  secondaryRoute,
  secondaryLabel,
  pattern,
  slug,
}: ArticleCTAProps) {
  const { t, i18n } = useTranslation();
  const lp = useLangPath();
  const trackingSurface = surface ?? "blog_post_cta_final";

  const rawLang = (i18n.language || "es").split("-")[0] as SupportedLang;
  const lang: SupportedLang = SUPPORTED_LANGS.includes(rawLang) ? rawLang : "es";

  const libCopy = pattern ? getBlogCtaCopy(pattern, lang) : null;
  const title = libCopy?.title ?? t("blogPost.ctaTitle");
  const desc = libCopy?.desc ?? t("blogPost.ctaDesc");
  const primaryLabel = libCopy?.primary ?? t("blogPost.ctaBook");
  const whatsappMsg = libCopy?.whatsappMsg ?? t("blogPost.ctaWhatsappMsg");

  // Standardised payload required by Task #15 — every cta_click event
  // carries surface, intent (the pattern id), slug and lang so GA4 can
  // segment performance by editorial intent and locale, not only by URL.
  const baseTags = {
    surface: trackingSurface,
    intent: pattern ?? "default",
    slug: slug ?? "",
    lang,
    cta_pattern: pattern ?? "default",
    cta_route: route,
  } as const;

  // Impression event — fires once per mount. Lets GA4 distinguish CTA reach
  // (impressions) from CTA pull (clicks) without an extra IntersectionObserver.
  useEffect(() => {
    trackCTA(`${pattern ?? "default"}_impression`, lp(route), title, {
      ...baseTags,
      cta_action: "impression",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="mt-14 cta-glass p-9 sm:p-14 text-center relative overflow-hidden"
      data-testid="article-cta-final"
      data-cta-pattern={pattern ?? "default"}
    >
      <h3
        className="relative text-[var(--text-1)] text-[28px] sm:text-[40px] mb-5"
        data-testid="text-post-cta"
      >
        {title}
      </h3>
      <p className="relative text-[var(--text-2)] text-base leading-relaxed mb-7 max-w-md mx-auto">
        {desc}
      </p>
      <div className="relative flex flex-col items-center gap-4">
        <Link
          href={lp(route)}
          onClick={() =>
            trackCTA(`${pattern ?? "default"}_primary`, lp(route), primaryLabel, {
              ...baseTags,
              cta_action: "primary",
            })
          }
          className="inline-flex items-center justify-center whitespace-nowrap bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
          data-testid="button-post-agendar"
        >
          {primaryLabel}
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        {secondaryRoute && (
          <Link
            href={lp(secondaryRoute)}
            onClick={() =>
              trackCTA(
                `${pattern ?? "default"}_secondary`,
                lp(secondaryRoute),
                secondaryLabel ?? t("blogPost.ctaBook"),
                { ...baseTags, cta_action: "secondary" },
              )
            }
            className="inline-flex items-center justify-center whitespace-nowrap border border-[rgba(0,229,16,0.32)] hover:border-[#00E510] text-[var(--text-1)] hover:text-[#00E510] font-body font-semibold px-6 py-3.5 text-sm rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
            data-testid="button-post-secondary"
          >
            {secondaryLabel ?? t("blogPost.ctaBook")}
          </Link>
        )}
        <p className="text-[var(--text-3)] text-sm">{t("blogPost.ctaDirect")}</p>
        <a
          href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(whatsappMsg)}`}
          onClick={() => {
            trackWhatsAppClick(trackingSurface, baseTags);
            trackCTA(
              `${pattern ?? "default"}_whatsapp`,
              CONTACT.WHATSAPP_URL,
              t("blogPost.ctaWhatsapp"),
              { ...baseTags, cta_action: "whatsapp" },
            );
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[var(--border)] hover:border-[#25D366] text-[var(--text-2)] hover:text-[#25D366] font-body font-semibold px-6 py-3.5 text-sm rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
          data-testid="button-post-whatsapp"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t("blogPost.ctaWhatsapp")}
        </a>
      </div>
    </div>
  );
}

export default ArticleCTA;
