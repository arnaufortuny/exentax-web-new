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
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("homeFaq.tag")}</span>
          <h2 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-5xl leading-[1.15] tracking-[-0.02em] text-[var(--text-1)]">
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
                  d="M2 8c50-6 100-2 140-4s100 2 156 2"
                  stroke="#00E510"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="mt-4 text-[var(--text-2)] text-base max-w-md mx-auto">{t("homeFaq.subtitle")}</p>
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
                  className="text-[var(--text-2)] text-base leading-relaxed"
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
              className="inline-flex items-center justify-center gap-2 bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[0_2px_16px_rgba(0,229,16,0.25)] transition-all duration-200 w-full sm:w-auto sm:min-w-[220px]"
              data-testid="button-home-faq-ver-todas"
            >
              {t("homeFaq.viewAll")}
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link
              href={lp("/agendar-asesoria")}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#00E510] text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-all duration-200 hover:bg-[#00E510] hover:text-[#0B0D0C] w-full sm:w-auto sm:min-w-[220px]"
              data-testid="button-home-faq-agenda"
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {t("homeFaq.talkToUs")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
