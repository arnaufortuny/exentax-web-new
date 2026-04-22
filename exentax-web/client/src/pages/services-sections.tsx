import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import FaqAccordionList from "@/components/sections/FaqAccordionList";
import { useLangPath } from "@/hooks/useLangPath";
import { useReveal } from "@/hooks/useReveal";
import { trackWhatsAppClick } from "@/components/Tracking";
import type { RouteKey } from "@shared/routes";

function GreenCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface FAQItem {
  q: string;
  paragraphs: string[];
  list?: string[];
  note?: string;
}

function IconPrivacidad() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M22 12l-8 4v5c0 4.5 3.2 8.7 8 9.8 4.8-1.1 8-5.3 8-9.8v-5l-8-4z" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="21" r="2" stroke="#00E510" strokeWidth="1.5" />
      <path d="M22 23v2.5" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconBanca() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <rect x="13" y="18" width="18" height="12" rx="2" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M16 18v-3a6 6 0 0 1 12 0v3" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="24" r="2" stroke="#00E510" strokeWidth="1.5" />
    </svg>
  );
}

function IconCoste() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="9" stroke="#00E510" strokeWidth="2" />
      <path d="M22 16v12" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 19.5c0-1.1 1.3-2 3-2s3 .9 3 2-1.3 2-3 2-3 .9-3 2 1.3 2 3 2 3-.9 3-2" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTiempo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="9" stroke="#00E510" strokeWidth="2" />
      <path d="M22 17v5l3.5 3.5" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPerfil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="18" r="4.5" stroke="#00E510" strokeWidth="2" />
      <path d="M13 32v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// State catalogue used across pricing/comparison/maintenance sections. Each
// entry carries its own RouteKey so card CTAs can deep-link straight into
// the corresponding state subpage instead of always hitting the booking
// hub (Task #16).
const STATE_KEYS: Array<{ key: string; i18nKey: string; route: RouteKey }> = [
  { key: "nm", i18nKey: "llcUsPage.newMexico", route: "service_llc_nm" },
  { key: "wy", i18nKey: "llcUsPage.wyoming",   route: "service_llc_wy" },
  { key: "de", i18nKey: "llcUsPage.delaware",  route: "service_llc_de" },
  { key: "fl", i18nKey: "florida",             route: "service_llc_fl" },
];

function LLCPlansSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const plans = STATE_KEYS.map((s, i) => ({
    state: t(s.i18nKey),
    key: s.key,
    route: s.route,
    popular: i === 1,
    badge: t(`precios.services.plans.${s.key}.badge`),
    includes: t(`precios.services.plans.${s.key}.includes`, { returnObjects: true }) as string[],
  }));

  return (
    <section className="py-24 lg:py-32 relative bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
          <span className="section-label mb-4 block">{t("precios.services.label")}</span>
          <h2 className="page-h2 mb-4">
            {t("precios.services.h2")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.services.p1")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.services.p2")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.services.p3")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">{t("precios.services.p4")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.key}
              className={`reveal rounded-[var(--radius-lg)] flex flex-col relative overflow-hidden ${
                plan.popular
                  ? "bg-[var(--bg-2)] border border-[rgba(0,229,16,0.25)] shadow-[0_0_40px_rgba(0,229,16,0.10)]"
                  : "bg-[var(--bg-2)] border border-[var(--border-subtle)]"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
              data-testid={`card-llc-plan-${i}`}
            >
              <div className="p-8 flex flex-col flex-1">
                {plan.badge && (
                  <div className="flex justify-center -mt-4 mb-4">
                    <span className={`text-xs font-body font-bold px-4 py-1.5 rounded-full whitespace-nowrap ${
                      plan.popular
                        ? "bg-[#00E510] text-[#0B0D0C] shadow-[var(--shadow-green)]"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] border border-[var(--border)]"
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-heading font-bold text-2xl text-[var(--text-1)] mb-2">{plan.state}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-[var(--text-2)] text-sm italic">{t("precios.services.priceOnConsultation")}</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-6" />

                <h4 className="text-[13px] font-body font-semibold text-[var(--text-1)] mb-4">{t("precios.services.whatsIncluded")}</h4>
                <div className="space-y-3 flex-1 mb-8">
                  {plan.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <GreenCheck />
                      <span className="text-sm text-[var(--text-2)]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs text-[var(--text-2)] mb-4">{t("precios.services.accountReady")}</div>

                <Link
                  href={lp(plan.route)}
                  className="inline-flex items-center justify-center w-full btn-primary px-6 py-3 text-base rounded-full"
                  data-testid={`button-solicitar-llc-${i}`}
                >
                  {t("precios.services.btnSolicitar")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparativaSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const [activeState, setActiveState] = useState(0);
  const stateKey = STATE_KEYS[activeState].key;
  const stateName = t(STATE_KEYS[activeState].i18nKey);

  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <h2 className="font-heading font-bold text-[26px] sm:text-4xl lg:text-[36px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-4">
            {t("precios.comparativa.h2")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3">{t("precios.comparativa.p1")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">{t("precios.comparativa.p2")}</p>
        </div>

        <div className="flex justify-center mb-10 reveal">
          <div className="flex w-full sm:inline-flex sm:w-auto rounded-full p-1 bg-[var(--bg-2)] border border-[var(--border)]">
            {STATE_KEYS.map((item, i) => (
              <button
                key={item.key}
                onClick={() => setActiveState(i)}
                className={`flex-1 sm:flex-none px-3 sm:px-8 py-2.5 rounded-full text-xs sm:text-base font-body font-semibold transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap ${
                  activeState === i
                    ? "bg-[#00E510] text-[#0B0D0C] shadow-[var(--shadow-green)]"
                    : "text-[var(--text-2)] hover:text-[var(--text-1)]"
                }`}
                data-testid={`button-comparativa-${i}`}
              >
                {t(item.i18nKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal">
          <div className="glass-card p-6 sm:p-8 lg:p-10 rounded-[var(--radius-lg)]">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-10">
                <div className="space-y-1.5">
                  <span className="section-label">{t("precios.comparativa.labels.jurisdiction")}</span>
                  <h3 className="font-heading font-bold text-3xl text-[var(--text-1)]">{t("precios.comparativa.labels.llcIn")} {stateName}</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <IconPrivacidad />
                      <h4 className="font-heading font-bold text-sm text-[var(--text-1)]">{t("precios.comparativa.labels.privacy")}</h4>
                    </div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed">{t(`precios.comparativa.states.${stateKey}.privacy`)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <IconBanca />
                      <h4 className="font-heading font-bold text-sm text-[var(--text-1)]">{t("precios.comparativa.labels.banking")}</h4>
                    </div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed">{t(`precios.comparativa.states.${stateKey}.banking`)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <IconCoste />
                      <h4 className="font-heading font-bold text-sm text-[var(--text-1)]">{t("precios.comparativa.labels.annualCost")}</h4>
                    </div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed">{t(`precios.comparativa.states.${stateKey}.annualCost`)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <IconTiempo />
                      <h4 className="font-heading font-bold text-sm text-[var(--text-1)]">{t("precios.comparativa.labels.timeline")}</h4>
                    </div>
                    <p className="text-sm text-[var(--text-2)] leading-relaxed">{t(`precios.comparativa.states.${stateKey}.timeline`)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <IconPerfil />
                    <h4 className="font-heading font-bold text-sm text-[var(--text-1)]">{t("precios.comparativa.labels.idealProfile")}</h4>
                  </div>
                  <p className="text-[var(--text-2)] leading-relaxed">{t(`precios.comparativa.states.${stateKey}.idealProfile`)}</p>
                </div>
              </div>

              <div className="bg-[rgba(0,229,16,0.03)] border border-[rgba(0,229,16,0.08)] rounded-[var(--radius)] p-6 sm:p-8 flex flex-col">
                <h4 className="font-heading font-bold text-lg text-[var(--text-1)] mb-6">{t("precios.comparativa.labels.keyPoints")}</h4>
                <div className="space-y-5 flex-1">
                  {(t(`precios.comparativa.states.${stateKey}.highlights`, { returnObjects: true }) as string[]).map((h) => (
                    <div key={h} className="flex items-start gap-3">
                      <GreenCheck />
                      <span className="text-[var(--text-2)] leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-8 border-t border-[rgba(0,229,16,0.08)]">
                  <Link
                    href={lp(STATE_KEYS[activeState].route)}
                    className="inline-flex items-center justify-center w-full btn-primary px-6 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                    data-testid="button-comparativa-agendar"
                  >
                    {t("precios.comparativa.btnAgendar")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MaintenanceSection() {
  const { t } = useTranslation();
  const ref = useReveal();

  const plans = STATE_KEYS.map((s) => ({
    state: t(s.i18nKey),
    key: s.key,
    tagline: t(`precios.maintenance.plans.${s.key}.tagline`),
    items: t(`precios.maintenance.plans.${s.key}.items`, { returnObjects: true }) as string[],
  }));

  return (
    <section id="mantenimiento" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
          <span className="section-label mb-4 block">{t("precios.maintenance.label")}</span>
          <h2 className="page-h2 mb-4">
            {t("precios.maintenance.h2")}
          </h2>
          <p className="font-heading font-semibold text-[clamp(20px,2vw,24px)] text-[#00E510] mb-6">
            {t("precios.maintenance.taglineGreen")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.maintenance.p1")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.maintenance.p2")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.maintenance.p3")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">{t("precios.maintenance.p4")}</p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">{t("precios.maintenance.p5")}</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.key}
              className="reveal glass-card rounded-[var(--radius-lg)] p-8 flex flex-col border border-[var(--border-subtle)]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <h3 className="font-heading font-bold text-xl text-[var(--text-1)] mb-2">{t("precios.maintenance.renovacionPrefix")} {plan.state}</h3>
              <p className="text-sm text-[var(--text-2)] italic mb-2">{t("precios.maintenance.priceOnConsultation")}</p>
              <p className="text-sm text-[var(--text-2)] mb-8">{plan.tagline}</p>

              <div className="space-y-4 flex-1 mb-10">
                {plan.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <GreenCheck />
                    <span className="text-sm text-[var(--text-2)]">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("precios.maintenance.waTextRenewal", { state: plan.state }))}`}
                onClick={() => trackWhatsAppClick("services_renewal")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full gap-2 bg-transparent border border-[rgba(0,229,16,0.2)] hover:border-[#00E510] text-[var(--text-1)] font-body font-semibold px-6 py-3 text-sm rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("precios.maintenance.btnSolicitar")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFAQSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqItems = t("precios.faq.items", { returnObjects: true }) as FAQItem[];

  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-16 reveal max-w-3xl">
          <span className="section-label mb-4 block">{t("precios.faq.label")}</span>
          <h2 className="page-h2 mb-4">
            {t("precios.faq.h2")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("precios.faq.p")}
          </p>
        </div>

        <div className="reveal">
          <FaqAccordionList
            testIdPrefix="precios-faq"
            spacingClass="space-y-4"
            answerExtraClass="text-left"
            openId={openIndex !== null ? `precios-${openIndex}` : null}
            onToggle={(id) => {
              const i = Number(id.replace("precios-", ""));
              setOpenIndex(openIndex === i ? null : i);
            }}
            items={(Array.isArray(faqItems) ? faqItems : []).map((faq, i) => ({
              id: `precios-${i}`,
              question: faq.q,
              answer: (
                <>
                  {faq.paragraphs.map((p) => (
                    <p key={p} className="mb-3">{p}</p>
                  ))}
                  {faq.list && faq.list.length > 0 && (
                    <div className="grid gap-2 mt-2 mb-3">
                      {faq.list.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl bg-white border border-[rgba(0,229,16,0.32)] px-4 py-2.5 text-[15px] leading-relaxed text-[var(--text-1)] shadow-[0_1px_2px_rgba(11,13,12,0.04)]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                  {faq.note && <p>{faq.note}</p>}
                </>
              ),
            }))}
          />
        </div>

        <div className="mt-12 reveal flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Link
            href={lp("faq")}
            className="inline-flex items-center justify-center btn-primary rounded-full px-8 py-3.5 text-base transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 active:scale-[0.97] whitespace-nowrap shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] w-full sm:w-auto"
            data-testid="button-precios-ver-todas-preguntas"
          >
            {t("precios.faq.btnVerTodas")}
          </Link>
          <a
            href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("finalCta.whatsappMsg"))}`}
            onClick={() => trackWhatsAppClick("services_faq_advisor")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
            data-testid="button-precios-faq-whatsapp"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("finalCta.whatsappCta")}
          </a>
        </div>
      </div>
    </section>
  );
}

function PreciosCTAFinal() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  return (
    <section className="section-padding overflow-hidden bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="reveal relative rounded-[var(--radius-xl)] overflow-hidden bg-[var(--bg-2)] border border-[var(--border-subtle)] shadow-[var(--shadow)]">
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute -top-[20%] -left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,16,0.07)_0%,transparent_65%)]" />
            <div className="absolute -bottom-[15%] -right-[5%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(107,207,155,0.05)_0%,transparent_65%)]" />
          </div>
          <div className="relative z-10 px-10 py-16 lg:px-20 lg:py-20 text-center max-w-[800px] mx-auto">
            <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.08] tracking-[-0.03em] text-[var(--text-1)] mb-8">
              {t("precios.cta.h2")}
            </h2>
            <p className="text-[var(--text-2)] text-lg leading-relaxed mb-4 max-w-[600px] mx-auto">
              {t("precios.cta.p1")}
            </p>
            <p className="text-[var(--text-2)] text-lg leading-relaxed mb-12 max-w-[520px] mx-auto">
              {t("precios.cta.p2")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={lp("book")}
                className="btn-pulse inline-flex items-center justify-center btn-primary rounded-full px-8 py-3.5 text-base transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 active:scale-[0.97] whitespace-nowrap shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)]"
                data-testid="button-precios-cta-agendar"
              >
                {t("precios.cta.btnAgendar")}
              </Link>
              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("precios.cta.waText"))}`}
                onClick={() => trackWhatsAppClick("services_cta")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-2)] hover:text-[var(--text-1)] font-body font-semibold rounded-full px-9 py-4 text-sm transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap"
                data-testid="button-precios-cta-whatsapp"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("precios.cta.btnWhatsapp")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesBelowFold() {
  return (
    <>
      <ComparativaSection />
      <LLCPlansSection />
      <MaintenanceSection />
      <PricingFAQSection />
      <PreciosCTAFinal />
    </>
  );
}
