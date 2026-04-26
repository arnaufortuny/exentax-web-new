/**
 * HomeFinalCTA — sección de cierre conversión en home.tsx
 *
 * Filosofía: tras leer FAQ, el usuario tiene 3 caminos posibles:
 *   1. Calcular ahorro (intent: comparar números)
 *   2. Hablar por WhatsApp (intent: pregunta puntual)
 *   3. Reservar consulta (intent: ya decidido)
 *
 * Diseño: glass-accent con tinte verde sutil + brand stats de social proof
 * + 2 CTAs primarios + 1 secundario WhatsApp.
 *
 * Mobile: centrado completo. Desktop: layout 2 columnas con stats izq + CTAs der.
 */

import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { CONTACT } from "@/lib/constants";

export default function HomeFinalCTA() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const waUrl = `${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(
    t("homeFinalCta.waText", { defaultValue: "Hola Exentax, vengo de la home y quiero hablar con un asesor sobre mi caso." }) as string
  )}`;

  return (
    <section
      className="section-padding bg-[var(--bg-0)]"
      ref={ref}
      data-testid="section-home-final-cta"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal glass-accent p-8 sm:p-12 lg:p-16 text-center relative">
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="section-chip mb-5 inline-block">
              {t("homeFinalCta.kicker", { defaultValue: "ÚLTIMO PASO" })}
            </span>

            <h2 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)] mb-5">
              {t("homeFinalCta.title", { defaultValue: "¿Listo para tu LLC?" })}
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-2)] leading-relaxed mb-10 max-w-2xl mx-auto">
              {t("homeFinalCta.subtitle", {
                defaultValue:
                  "Constituimos tu LLC americana con compliance completo, banca operativa y soporte fiscal en tu país. 100% remoto, transparente, sin sorpresas.",
              })}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10">
              <Link
                href={lp("book")}
                className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-9 py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                data-testid="cta-final-agendar"
              >
                {t("homeFinalCta.ctaBook", { defaultValue: "Reservar consulta gratuita" })}
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 sm:px-9 py-4 text-base sm:text-lg font-semibold w-full sm:w-auto bg-[var(--bg-1)] text-[var(--text-1)] border border-[var(--border)] hover:bg-[var(--bg-2)] transition-colors"
                data-testid="cta-final-whatsapp"
              >
                {t("homeFinalCta.ctaWhatsapp", { defaultValue: "Hablar por WhatsApp" })}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto pt-8 border-t border-[rgba(0,0,0,0.06)]">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--text-1)]">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-3)] mt-1">
                  {t("homeFinalCta.stat1", { defaultValue: "Remoto" })}
                </div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--text-1)]">
                  7
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-3)] mt-1">
                  {t("homeFinalCta.stat2", { defaultValue: "Países cubiertos" })}
                </div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-2xl sm:text-3xl text-[var(--text-1)]">
                  {t("homeFinalCta.stat3Value", { defaultValue: "24h" })}
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-3)] mt-1">
                  {t("homeFinalCta.stat3", { defaultValue: "Respuesta" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
