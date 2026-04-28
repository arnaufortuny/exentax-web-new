import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { SOCIAL } from "@/lib/constants";
import { TRUSTPILOT_REVIEWS, type Review } from "@/data/reviewsData";

function StarRow({ rating = 5 }: { rating?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${filled} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="inline-flex items-center justify-center"
          style={{
            width: 22,
            height: 22,
            background: i < filled ? "#00B67A" : "#DCE0D9",
            borderRadius: 3,
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M12 2l2.6 7.4H22l-6 4.6 2.4 7.4L12 16.8 5.6 21.4 8 14 2 9.4h7.4z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="flex-shrink-0 inline-flex items-center justify-center font-heading font-bold text-[15px] text-[#0B0D0C]"
      style={{
        width: 44,
        height: 44,
        background: "#00E510",
        borderRadius: 999,
        boxShadow:
          "0 0 0 2px rgba(255,255,255,0.9), 0 8px 22px -6px rgba(0,229,16,0.55), 0 0 24px rgba(0,229,16,0.35)",
      }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

function FlagCircle({ code, label }: { code: string; label: string }) {
  const lower = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w160/${lower}.png`}
      srcSet={`https://flagcdn.com/w320/${lower}.png 2x`}
      alt=""
      width={18}
      height={18}
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        objectFit: "cover",
        objectPosition: "center",
        flexShrink: 0,
        display: "block",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      loading="lazy"
      role="img"
      aria-label={label}
    />
  );
}

function ReviewCard({ review, ctaLabel, trustpilotAlt }: { review: Review; ctaLabel: string; trustpilotAlt: string }) {
  return (
    <article
      className="glass-card snap-center flex-shrink-0 w-[82vw] sm:w-[340px] lg:w-[360px] flex flex-col p-6 sm:p-7"
      data-testid={`review-card-${review.id}`}
    >
      <header className="flex items-center justify-between mb-4">
        <img
          src="/img/partner-trustpilot.webp"
          alt={trustpilotAlt}
          width={112}
          height={28}
          className="h-7 w-auto object-contain opacity-85 brightness-0"
          loading="lazy"
        />
        <StarRow rating={review.rating} />
      </header>

      <div className="flex items-center gap-3 mb-4">
        <Avatar name={review.author} />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[14px] text-[var(--text-1)] truncate">
            {review.author}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-2)]">
            <FlagCircle code={review.countryCode} label={review.countryCode} />
            <span>{review.countryCode}</span>
            <span aria-hidden="true">·</span>
            <span>{review.dateLabel}</span>
          </div>
        </div>
      </div>

      <h3 className="font-body font-semibold normal-case tracking-normal text-[16px] sm:text-[17px] leading-snug text-[var(--text-1)] mb-2">
        {review.title}
      </h3>

      <p
        className="text-[14px] leading-relaxed text-[var(--text-2)] mb-5"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 6,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {review.body}
      </p>

      <div className="mt-auto">
        <a
          href={review.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-5 py-2.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
          data-testid={`button-review-${review.id}`}
        >
          {ctaLabel}
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7" /><path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const { t } = useTranslation();
  const ref = useReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollBy = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? (card as HTMLElement).offsetWidth + 32 : el.clientWidth * 0.9;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="reseñas" className="section-padding" ref={ref} data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl mx-auto text-center">
          <span className="section-chip">{t("testimonials.tag")}</span>
          <h2 className="section-h2 mb-4">
            {t("testimonials.title")}{" "}
            <span className="text-[#00E510]">{t("testimonials.titleHighlight")}</span>
          </h2>
          <p className="section-green mb-3">{t("testimonials.subtitle")}</p>
          <a
            href={SOCIAL.TRUSTPILOT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[#00E510] transition-colors"
            data-testid="link-trustpilot-verified"
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ width: 18, height: 18, background: "#00B67A", borderRadius: 3 }}
            >
              <svg width={11} height={11} viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2l2.6 7.4H22l-6 4.6 2.4 7.4L12 16.8 5.6 21.4 8 14 2 9.4h7.4z" />
              </svg>
            </span>
            {t("testimonials.verified")}
          </a>
        </div>

        <div className="relative reveal">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label={t("testimonials.prev")}
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,250,246,0.85) 100%)",
              border: "1.5px solid rgba(0,229,16,0.45)",
              boxShadow: "0 8px 24px -8px rgba(0,229,16,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
            data-testid="button-testimonials-prev"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#0B0D0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label={t("testimonials.next")}
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(245,250,246,0.85) 100%)",
              border: "1.5px solid rgba(0,229,16,0.45)",
              boxShadow: "0 8px 24px -8px rgba(0,229,16,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
            data-testid="button-testimonials-next"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#0B0D0C" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 sm:mx-0 px-[9vw] sm:px-12 lg:px-16 justify-start lg:justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            data-testid="testimonials-track"
          >
            <style>{`[data-testid="testimonials-track"]::-webkit-scrollbar{display:none}`}</style>
            {TRUSTPILOT_REVIEWS.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                ctaLabel={t("testimonials.cta")}
                trustpilotAlt={t("footer.trustpilotAlt")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
