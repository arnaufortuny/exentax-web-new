import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { sanitizeHtml } from "@/lib/sanitize";
import { CONTACT } from "@/lib/constants";
import { trackWhatsAppClick } from "@/components/Tracking";
import { SiWhatsapp } from "react-icons/si";
import FaqAccordionList from "./FaqAccordionList";

export default function HomeFAQ() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const faqs = t("homeFaq.items", { returnObjects: true }) as { q: string; a: string }[];

  const items = faqs.map((faq, i) => ({
    id: String(i),
    question: faq.q,
    answer: (
      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(faq.a) }} />
    ),
  }));

  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <h2 className="section-h2">
            {t("homeFaq.title")}{" "}
            <span className="text-[#00E510]">
              {t("homeFaq.titleHighlight")}
            </span>
          </h2>
          <p className="mt-5 text-[var(--text-2)] text-base leading-relaxed max-w-lg mx-auto">{t("homeFaq.subtitle")}</p>
        </div>

        <div className="reveal">
          <FaqAccordionList
            items={items}
            testIdPrefix="home-faq"
            spacingClass="space-y-4"
          />
        </div>

        <div className="mt-20 reveal flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href={lp("faq")}
            className="inline-flex items-center justify-center gap-2 btn-primary px-8 py-3.5 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
            data-testid="button-home-faq-ver-todas"
          >
            {t("homeFaq.viewAll")}
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <a
            href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("homeFaq.cta.whatsapp"))}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("home_faq")}
            className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
            data-testid="button-home-faq-whatsapp"
          >
            <SiWhatsapp className="w-5 h-5" />
            {t("homeFaq.cta.whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
