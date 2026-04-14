import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { sanitizeHtml } from "@/lib/sanitize";
import AccordionItem from "./AccordionItem";

export default function HomeFAQ() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = t("homeFaq.items", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <span className="section-label mb-3">{t("homeFaq.tag")}</span>
          <h2 className="section-h2">
            {t("homeFaq.title")}{" "}
            <span className="relative inline-block text-[#00E510]">
              {t("homeFaq.titleHighlight")}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  className="draw-path-now"
                  d="M2 8c50-6 100-2 140-4s100 2 156 2"
                  stroke="#00E510"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="mt-5 text-[var(--text-2)] text-base leading-relaxed max-w-lg mx-auto">{t("homeFaq.subtitle")}</p>
        </div>

        <div className="space-y-4 reveal">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              id={String(i)}
              question={faq.q}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              testIdPrefix="home-faq"
              variant="card"
            >
              <div className="mx-5 sm:mx-6 mb-5 pt-4 border-t border-[var(--border)]">
                <div
                  className="text-[var(--text-2)] text-[15px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }}
                />
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <Link
                    href={lp("/agendar-asesoria")}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#00E510] hover:underline"
                    data-testid={`link-faq-contact-${i}`}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {t("homeFaq.askUs")}
                  </Link>
                  <span className="text-[var(--border)]">|</span>
                  <Link
                    href={lp("/agendar-asesoria")}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-2)] hover:text-[#00E510] transition-colors"
                    data-testid={`link-faq-book-${i}`}
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {t("homeFaq.bookCall")}
                  </Link>
                </div>
              </div>
            </AccordionItem>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={lp("/preguntas-frecuentes")}
              className="inline-flex items-center justify-center gap-2 bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 w-full sm:w-auto sm:min-w-[220px]"
              data-testid="button-home-faq-ver-todas"
            >
              {t("homeFaq.viewAll")}
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link
              href={lp("/agendar-asesoria")}
              className="inline-flex items-center justify-center gap-2 border border-[#00E510]/50 hover:border-[#00E510]/80 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 w-full sm:w-auto sm:min-w-[220px]"
              data-testid="button-home-faq-agenda"
            >
              {t("homeFaq.talkToUs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
