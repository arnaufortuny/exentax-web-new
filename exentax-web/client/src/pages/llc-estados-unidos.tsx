import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { CONTACT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import HeroStats from "@/components/sections/HeroStats";
import { sanitizeHtml } from "@/lib/sanitize";


function GreenCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  return (
    <>
      <SEO
        title={t("llcUsPage.seoTitle")}
        description={t("llcUsPage.seoDesc")}
        path="/sobre-las-llc"
        breadcrumbs={[{ name: t("llcUsPage.breadcrumb"), path: "/sobre-las-llc" }]}
      />
      <section className="relative section-padding" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
          <div className="text-center max-w-[800px] mx-auto">
            <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-black dark:text-white mb-6">
              {t("llcUsPage.heroTitle")}{" "}
              <span className="relative inline-block text-[#00E510]">
                {t("llcUsPage.heroTitleAccent")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" height="10">
                  <path className="draw-path" d="M2 8c50-6 100-2 140-4s100 2 156 2" stroke="#00E510" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-base lg:text-lg text-black dark:text-white leading-relaxed mb-4 font-medium">
              {t("llcUsPage.heroSubtitle")}
            </p>
            <p className="text-base lg:text-lg text-black/90 dark:text-white/80 leading-relaxed mb-10 max-w-[680px] mx-auto">
              {t("llcUsPage.heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={lp("/agendar-asesoria")}
                className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                data-testid="button-llc-hero-agendar"
              >
                {t("llcUsPage.heroCta")}
              </Link>
              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("llcUsPage.heroWhatsappMsg"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap"
                data-testid="button-llc-hero-whatsapp"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("llcUsPage.heroWhatsapp")}
              </a>
            </div>

            <div className="mt-10">
              <HeroStats align="center" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function QueEsLLCSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const benefits = t("llcUsPage.keyBenefits", { returnObjects: true }) as string[];
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("llcUsPage.whatIsLabel")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("llcUsPage.whatIsTitle")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("llcUsPage.whatIsDesc")}
          </p>
        </div>

        <div className="reveal rounded-[var(--radius-lg)] p-6 lg:p-8" style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)" }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-4">
                {t("llcUsPage.whatItDoesTitle")}
              </h3>
              <p className="text-[var(--text-2)] leading-relaxed mb-6">
                {t("llcUsPage.whatItDoesDesc1")}
              </p>
              <p className="text-[var(--text-2)] leading-relaxed">
                {t("llcUsPage.whatItDoesDesc2")}
              </p>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-4">
                {t("llcUsPage.keyBenefitsTitle")}
              </h3>
              <div className="space-y-3">
                {Array.isArray(benefits) && benefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <GreenCheck />
                    <span className="text-sm text-[var(--text-1)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IconFiscal() {
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M14 30V18l8-6 8 6v12" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 30v-6h4v6" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 18h16" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="21" r="2" stroke="#00E510" strokeWidth="1.5" />
    </svg>
  );
}

function IconBank() {
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <rect x="14" y="16" width="16" height="12" rx="2" stroke="#00E510" strokeWidth="2" />
      <path d="M18 16v-2a4 4 0 018 0v2" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="22" r="2" stroke="#00E510" strokeWidth="1.5" />
      <path d="M22 24v2" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPayment() {
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <rect x="12" y="15" width="20" height="14" rx="2.5" stroke="#00E510" strokeWidth="2" />
      <path d="M12 20h20" stroke="#00E510" strokeWidth="2" />
      <circle cx="28" cy="25" r="1.5" fill="#00E510" />
      <circle cx="24" cy="25" r="1.5" stroke="#00E510" strokeWidth="1" fill="none" />
    </svg>
  );
}

function IconProtection() {
  return (
    <svg width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M22 12l-8 4v5c0 4.5 3.2 8.7 8 9.8 4.8-1.1 8-5.3 8-9.8v-5l-8-4z" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 22l2.5 2.5 4.5-4.5" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const benefitIcons = [IconFiscal, IconBank, IconPayment, IconProtection];
const benefitKeys = ["benefitTax", "benefitBank", "benefitPayment", "benefitProtection"];

function PorQueLLCSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("llcUsPage.whyLabel")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("llcUsPage.whyTitle")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("llcUsPage.whyDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {benefitKeys.map((key, i) => {
            const Icon = benefitIcons[i];
            return (
              <div
                key={key}
                className="reveal rounded-[var(--radius-lg)] p-6 lg:p-8 transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)", transitionDelay: `${i * 100}ms` }}
                data-testid={`card-beneficio-llc-${i}`}
              >
                <div className="mb-4">
                  <Icon />
                </div>
                <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-3">
                  {t(`llcUsPage.${key}Title`)}
                </h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                  {t(`llcUsPage.${key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const stepKeys = ["step1", "step2", "step3", "step4"];

function ProcesoSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("llcUsPage.processLabel")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("llcUsPage.processTitle")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("llcUsPage.processDesc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {stepKeys.map((key, i) => (
            <div
              key={key}
              className="reveal rounded-[var(--radius-lg)] p-6 lg:p-8"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)", transitionDelay: `${i * 100}ms` }}
              data-testid={`card-paso-${i}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#00E510] text-[#0B0D0C] flex items-center justify-center font-heading font-bold text-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-2">
                    {t(`llcUsPage.${key}Title`)}
                  </h3>
                  <p className="text-sm text-[var(--text-2)] leading-relaxed">
                    {t(`llcUsPage.${key}Desc`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const obligationKeys = ["obligation1", "obligation2", "obligation3"];

function ObligacionesSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("llcUsPage.complianceLabel")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("llcUsPage.complianceTitle")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("llcUsPage.complianceDesc")}
          </p>
        </div>

        <div className="reveal rounded-[var(--radius-lg)] p-5 max-w-[700px] mx-auto mb-10" style={{ background: "rgba(0,229,16,0.03)", border: "1px solid rgba(0,229,16,0.2)" }}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 48 48" fill="none" className="mb-3" aria-hidden="true">
              <circle cx="24" cy="24" r="19" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm text-[var(--text-2)] leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("llcUsPage.complianceNote")) }} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {obligationKeys.map((key, i) => (
            <div
              key={key}
              className="reveal rounded-[var(--radius-lg)] p-6 lg:p-8"
              style={{ background: "var(--bg-2)", border: "1px solid var(--border-subtle)", transitionDelay: `${i * 100}ms` }}
              data-testid={`card-obligacion-${i}`}
            >
              <h3 className="font-heading font-semibold text-lg text-[var(--text-1)] mb-3">
                {t(`llcUsPage.${key}Title`)}
              </h3>
              <p className="text-sm text-[var(--text-2)] leading-relaxed">
                {t(`llcUsPage.${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stateKeys = ["newMexico", "wyoming", "delaware"];
const stateAdvantageKeys = ["nmAdvantages", "wyAdvantages", "deAdvantages"];
const statePriceValues = [1099, 1399, 1699];

function EstadosSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-12 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("llcUsPage.statesLabel")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("llcUsPage.statesTitle")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("llcUsPage.statesDesc")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {stateKeys.map((key, i) => {
            const isPopular = key === "wyoming";
            const advantages = t(`llcUsPage.${stateAdvantageKeys[i]}`, { returnObjects: true }) as string[];
            return (
              <div
                key={key}
                className={`reveal rounded-[var(--radius-lg)] flex flex-col transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300 relative ${
                  isPopular
                    ? "shadow-[0_0_30px_rgba(74,222,128,0.1)]"
                    : ""
                }`}
                style={{
                  background: "var(--bg-2)",
                  border: isPopular ? "1px solid rgba(74,222,128,0.4)" : "1px solid var(--border-subtle)",
                  transitionDelay: `${i * 100}ms`,
                }}
                data-testid={`card-estado-${i}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#00E510] text-[#0B0D0C] text-xs font-body font-bold px-4 py-1.5 rounded-full shadow-[var(--shadow-green)]">
                      {t("llcUsPage.mostPopular")}
                    </span>
                  </div>
                )}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="text-center mb-6">
                    <h3 className="font-heading font-bold text-2xl text-[var(--text-1)] mb-2">{t(`llcUsPage.${key}`)}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                      <span className="text-[var(--text-3)] text-sm">{t("llcUsPage.from")}</span>
                      <span className="font-heading font-bold text-4xl text-[#00E510]">{statePriceValues[i].toLocaleString()}</span>
                      <span className="text-[var(--text-2)] text-lg">€</span>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent mb-6" />
                  <div className="space-y-3 flex-1 mb-8">
                    {Array.isArray(advantages) && advantages.map((v, vi) => (
                      <div key={vi} className="flex items-start gap-2.5">
                        <GreenCheck />
                        <span className="text-sm text-[var(--text-1)]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={lp("/servicios")}
                    className="inline-flex items-center justify-center w-full font-body font-semibold px-6 py-3 text-base rounded-full active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] shadow-[var(--shadow-green)]"
                    data-testid={`link-estado-${i}`}
                  >
                    {t("llcUsPage.viewDetails")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function LLCPage() {
  return (
    <article className="bg-[var(--bg-0)]">
      <HeroSection />
      <QueEsLLCSection />
      <PorQueLLCSection />
      <ProcesoSection />
      <ObligacionesSection />
      <EstadosSection />
    </article>
  );
}
