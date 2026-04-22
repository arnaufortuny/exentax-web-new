import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface LegalLayoutProps {
  title: string;
  pdfHref?: string;
  children: ReactNode;
}

/**
 * LegalLayout — "Liquid Glass" treatment aplicado a las 5 páginas legales
 * (terms, privacy, cookies, refunds, disclaimer) respetando el design
 * system Exentax:
 *   - Dark permanente `var(--bg-0)` como fondo base.
 *   - Panel principal con `backdrop-blur-xl` + tint verde neón ultra-sutil
 *     (3 % opacidad) — el verde marca la identidad sin competir con la
 *     legibilidad del cuerpo legal.
 *   - Border-radius 20 px para panel (botones siguen con 9999, regla
 *     intacta).
 *   - Shadow suave + borde interior `border-subtle` para separar del
 *     fondo.
 *   - Orbs de luz de fondo (`::before` y `::after` en CSS) dan la ilusión
 *     de vidrio líquido sin imágenes, solo gradientes radiales con
 *     blur — impacto de rendimiento mínimo.
 *   - Tipografía Space Grotesk en H1, Inter en body (hereda del root).
 *   - El botón PDF mantiene su forma neón pastilla (border-radius 9999).
 */
export default function LegalLayout({ title, pdfHref, children }: LegalLayoutProps) {
  const { t } = useTranslation();
  return (
    <section className="relative pt-10 lg:pt-14 pb-20 lg:pb-28 overflow-hidden">
      {/* Liquid-glass backdrop: orbes de luz verde ultra-suaves detrás
          del panel. Absolute-positioned, pointer-events none, decorativos. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle,rgba(0,229,16,0.08)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(0,229,16,0.05)_0%,transparent_60%)] blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[36px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] text-center">
            {title}
          </h1>
        </div>

        {pdfHref && (
          <div className="flex justify-center mb-8">
            <a
              href={pdfHref}
              download
              className="inline-flex items-center gap-2 bg-[rgba(0,229,16,0.08)] text-[#00E510] hover:bg-[rgba(0,229,16,0.16)] border border-[#00E510]/20 rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              data-testid="link-download-pdf"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t("legal.downloadPdf")}
            </a>
          </div>
        )}

        {/* Liquid-glass panel: translucent bg + blur + sutil tint verde. */}
        <div className="relative rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(240,238,233,0.45)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
          <div className="space-y-10 text-[var(--text-2)] text-base leading-relaxed legal-content">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
