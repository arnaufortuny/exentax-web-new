import { lazy, Suspense } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import HeroStats, { useStatsPrecios } from "@/components/sections/HeroStats";
import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";
import { useReveal } from "@/hooks/useReveal";
import { trackWhatsAppClick } from "@/components/Tracking";
import ExistingLlcCallout from "@/components/sections/ExistingLlcCallout";

const ServicesBelowFold = lazy(() => import("./services-sections"));

function PreciosHero() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const statsPrecios = useStatsPrecios();
  return (
    <>
      <SEO
        title={t("serviciosPage.seoTitle")}
        description={t("serviciosPage.seoDesc")}
        ogTitle={t("serviciosPage.ogTitle", { defaultValue: "" }) as string || undefined}
        ogDescription={t("serviciosPage.ogDesc", { defaultValue: "" }) as string || undefined}
        keywords={t("serviciosPage.seoKeywords")}
        path={lp("our_services")}
        breadcrumbs={[{ name: t("nav.services"), path: lp("our_services") }]}
      />
      <section className="relative overflow-hidden pb-14">
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 sm:pt-10 lg:pt-20">
          <div className="text-center max-w-[800px] mx-auto">
            <div className="reveal">
              <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-black mb-2" data-testid="heading-precios-hero">
                {t("precios.hero.h1")}
              </h1>
              <p className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] mb-6 text-[#00E510]">
                {t("precios.hero.h2green")}
              </p>

              <p className="max-w-[680px] text-base lg:text-lg text-black/90 leading-relaxed mb-8 mx-auto" data-testid="subtitle-precios-hero">
                {t("precios.hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
                <Link
                  href={lp("book")}
                  className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full"
                  data-testid="button-precios-hero-agendar"
                >
                  {t("precios.hero.btnAgendar")}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <a
                  href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("precios.hero.waText"))}`}
                  onClick={() => trackWhatsAppClick("services_hero")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full"
                  data-testid="button-precios-hero-whatsapp"
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("precios.hero.btnWhatsapp")}
                </a>
              </div>

              <HeroStats align="center" stats={statsPrecios} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceSubpagesGrid() {
  const { t } = useTranslation();
  const lp = useLangPath();
  const cards: { key: "service_llc_nm" | "service_llc_wy" | "service_llc_de" | "service_llc_fl" | "service_itin"; tag: string; i18n: string }[] = [
    { key: "service_llc_nm", tag: "llc-nm", i18n: "subpages.llcNm" },
    { key: "service_llc_wy", tag: "llc-wy", i18n: "subpages.llcWy" },
    { key: "service_llc_de", tag: "llc-de", i18n: "subpages.llcDe" },
    { key: "service_llc_fl", tag: "llc-fl", i18n: "subpages.llcFl" },
    { key: "service_itin", tag: "itin", i18n: "subpages.itin" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" aria-labelledby="services-subpages-heading">
      <div className="text-center mb-10">
        <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3">
          {t("serviciosPage.subpagesGrid.kicker")}
        </p>
        <h2 id="services-subpages-heading" className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black" data-testid="heading-services-subpages">
          {t("serviciosPage.subpagesGrid.h2")}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={lp(c.key)}
            className="block bg-[var(--card-bg)] border border-[var(--border)] rounded-[18px] p-6 transition-all duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
            data-testid={`card-services-subpage-${c.tag}`}
          >
            <p className="font-heading text-[11px] tracking-[0.16em] uppercase text-[var(--text-2)] mb-2">{t(`${c.i18n}.cardKicker`)}</p>
            <h3 className="font-heading font-bold text-[19px] sm:text-[20px] leading-tight text-black mb-2">
              {t(`${c.i18n}.cardTitle`)}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-black/75 leading-relaxed mb-4">
              {t(`${c.i18n}.cardDesc`)}
            </p>
            <span className="inline-flex items-center gap-1 font-body font-semibold text-[14px] text-[#00B80D]">
              {t("serviciosPage.subpagesGrid.cta")}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ServiciosPage() {
  return (
    <article data-page="services" className="bg-[var(--bg-0)]">
      <PreciosHero />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <ExistingLlcCallout variant="compact" testIdSuffix="precios" />
      </section>
      <ServiceSubpagesGrid />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} aria-hidden="true" />}>
        <ServicesBelowFold />
      </Suspense>
    </article>
  );
}
