import { lazy, Suspense } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT, SOCIAL } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { trackCTA, trackWhatsAppClick } from "@/components/Tracking";

const Calculator = lazy(() => import("@/components/calculator"));

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const IconHeadphones = () => (
  <svg {...iconProps}>
    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    <path d="M21 14v3a3 3 0 0 1-3 3h-1v-7h4Z" />
    <path d="M3 14v3a3 3 0 0 0 3 3h1v-7H3Z" />
  </svg>
);
const IconAward = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" />
  </svg>
);
const IconGlobe = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z" />
  </svg>
);
const IconShield = () => (
  <svg {...iconProps}>
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconIdCard = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="12" r="2.2" />
    <path d="M14 11h5M14 14h4M6.5 16.5c.5-1.5 2-2 2.5-2s2 .5 2.5 2" />
  </svg>
);

type StatItem =
  | { kind: "value"; value: string; label: string; href?: string }
  | { kind: "icon"; Icon: React.ComponentType; label: string };

export default function Hero() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const stats: StatItem[] = [
    { kind: "value", value: "0%", label: t("heroStats.reductionLabel") },
    { kind: "value", value: "+50", label: t("heroStats.clientsLabel") },
    { kind: "value", value: "5.0★", label: t("heroStats.ratingLabel"), href: SOCIAL.TRUSTPILOT },
    { kind: "icon", Icon: IconHeadphones, label: t("heroStats.support247") },
    { kind: "icon", Icon: IconAward, label: t("heroStats.experts") },
    { kind: "icon", Icon: IconGlobe, label: t("heroStats.online100") },
    { kind: "icon", Icon: IconShield, label: t("heroStats.compliance") },
    { kind: "icon", Icon: IconIdCard, label: t("heroStats.itin") },
  ];

  return (
    <section className="relative overflow-hidden" style={{ paddingBottom: 96 }}>
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10 sm:pt-16 lg:pt-24">

        <div className="text-center mx-auto" style={{ maxWidth: 980 }}>
          <h1
            className="display-wise text-black mb-4"
            data-testid="heading-hero"
          >
            {t("hero.h1")}
          </h1>
          <p
            className="font-heading mx-auto mb-7 text-black/85"
            style={{
              fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
              lineHeight: 1.2,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              maxWidth: 760,
              textWrap: "balance" as never,
            }}
            data-testid="hero-tagline"
          >
            {t("hero.h1Green")}
          </p>

          <p
            className="font-body text-black/75 mx-auto mb-10"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)", lineHeight: 1.55, maxWidth: 660, textWrap: "balance" as never }}
            data-testid="subtitle-hero"
          >
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link
              href={lp("book")}
              onClick={() => trackCTA("hero_book_consultation", lp("book"))}
              className="btn-pulse inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full whitespace-nowrap"
              data-testid="button-hero-agendar"
            >
              {t("hero.cta")}
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("hero.whatsappMsg"))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick("hero")}
              className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full whitespace-nowrap"
              data-testid="button-hero-whatsapp"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("hero.talkToUs")}
            </a>
          </div>

        </div>

        <div className="neon-strip w-full mt-2" data-testid="hero-stats">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {stats.map((s, i) => {
              const isStarRating = s.kind === "value" && s.value.includes("★");
              const inner = (
                <div className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 text-center h-full">
                  {s.kind === "value" ? (
                    <span
                      className="font-heading font-extrabold leading-none mb-1.5"
                      style={{
                        fontSize: "clamp(24px, 2.6vw, 36px)",
                        color: isStarRating ? "#FFD700" : "#00E510",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.value}
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center justify-center mb-2 rounded-full text-[#00C80E]"
                      style={{
                        width: 36,
                        height: 36,
                        background: "rgba(0,229,16,0.10)",
                        border: "1px solid rgba(0,229,16,0.25)",
                      }}
                    >
                      <s.Icon />
                    </span>
                  )}
                  <span className="font-body text-[11px] sm:text-[12px] text-[var(--text-2)] font-medium leading-snug max-w-[150px]">
                    {s.label}
                  </span>
                </div>
              );
              // Vertical separator for desktop only (8-col), horizontal for mobile rows handled separately
              const borderCls = `${
                i % 2 === 0 ? "border-r border-black/[0.06]" : ""
              } ${i < stats.length - 4 ? "border-b border-black/[0.06] sm:border-b-0" : ""} sm:border-r sm:border-black/[0.06] ${
                ((i + 1) % 4 === 0) ? "sm:border-r-0 lg:border-r lg:border-black/[0.06]" : ""
              } ${i === stats.length - 1 ? "lg:border-r-0" : ""}`;

              if (s.kind === "value" && s.href) {
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${borderCls} hover:bg-[rgba(0,229,16,0.04)] transition-colors`}
                    data-testid={`stat-${i}`}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <div key={s.label} className={borderCls} data-testid={`stat-${i}`}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-[720px] mx-auto mt-16 lg:mt-20" data-testid="calculator-container">
          <Suspense fallback={<div style={{ minHeight: 520 }} aria-hidden="true" />}>
            <Calculator compact />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
