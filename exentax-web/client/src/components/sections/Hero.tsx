import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { trackCTA, trackOutboundLink } from "@/components/Tracking";
import Calculator from "@/components/calculator";
import HeroStats from "@/components/sections/HeroStats";

export default function Hero() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  return (
    <section
      className="relative"
      style={{ paddingBottom: 56 }}
    >
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 sm:pt-10 lg:pt-20">
        <div className="flex flex-col items-center">
          <div className="text-center mb-10 lg:mb-14">
            <div className="reveal max-w-[800px] mx-auto">

              <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,48px)] leading-[1.1] tracking-[-0.025em] text-black dark:text-white mb-2" data-testid="heading-hero">
                {t("hero.h1")}
              </h1>
              <p className="font-heading font-bold text-2xl sm:text-4xl lg:text-[clamp(36px,3.5vw,48px)] leading-[1.1] tracking-[-0.025em] mb-6">
                <span className="relative inline-block text-[#00E510]">
                  {t("hero.h1Green")}
                  <svg
                    className="absolute top-full mt-2 lg:mt-4 left-0 w-full"
                    style={{ height: '8px' }}
                    viewBox="0 0 300 10"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="draw-path"
                      d="M2 7c40-6 80 6 140-3s80 5 156-2"
                      stroke="#00E510"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </p>

              <p className="max-w-[680px] mx-auto text-[15px] sm:text-base lg:text-lg text-black/90 dark:text-white/80 leading-relaxed mb-8" data-testid="subtitle-hero">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                <Link
                  href={lp("/agendar-asesoria")}
                  onClick={() => trackCTA("hero_book_consultation", "/agendar-asesoria")}
                  className="btn-pulse inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap"
                  data-testid="button-hero-agendar"
                >
                  {t("hero.cta")}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <a
                  href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("hero.whatsappMsg"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutboundLink(CONTACT.WHATSAPP_URL)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap"
                  data-testid="button-hero-whatsapp"
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("hero.talkToUs")}
                </a>
              </div>

              <HeroStats align="center" />
            </div>
          </div>

          <div className="reveal w-full max-w-[580px] rounded-[var(--radius-lg)]" style={{ transitionDelay: "200ms" }} data-testid="calculator-container">
            <Calculator compact />
          </div>
        </div>
      </div>

    </section>
  );
}
