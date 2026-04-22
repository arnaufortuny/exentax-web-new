import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { trackWhatsAppClick } from "@/components/Tracking";

function CheckSvg() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-1.5">
      <path d="M3 8l4 4 6-6" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepCard({
  step,
  i,
  hasCta,
  ctaLabel,
  ctaHref,
  ctaTestId,
}: {
  step: { title: string; intro?: string; points?: string[]; footer?: string; desc?: string };
  i: number;
  hasCta: boolean;
  ctaLabel: string;
  ctaHref: string;
  ctaTestId: string;
}) {
  return (
    <div
      className="reveal neon-card is-green relative h-full p-7 sm:p-9 flex flex-col rounded-[28px] overflow-hidden"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(0,229,16,0.20)',
        borderTop: '2px solid #00E510',
        transitionDelay: `${i * 120}ms`,
      }}
      data-testid={`step-${i}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, rgba(0,229,16,0.10), transparent 60%)',
        }}
      />
      <div className="relative flex flex-col h-full">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-5 text-[20px] font-black"
          style={{
            background: '#00E510',
            color: '#0B0D0C',
            boxShadow: '0 8px 22px -6px rgba(0,229,16,0.45)',
          }}
          aria-hidden="true"
        >
          {i + 1}
        </div>
        <h3 className="text-[24px] sm:text-[26px] lg:text-[28px] text-[var(--text-1)] mb-3 break-words" style={{ hyphens: 'auto' }}>
          {step.title}
        </h3>
        {step.intro && (
          <p className="text-base lg:text-[17px] text-[#00E510] font-medium leading-relaxed mb-4">
            {step.intro}
          </p>
        )}
        {step.desc && (
          <p className="text-base lg:text-[17px] text-[var(--text-2)] leading-relaxed mb-3">
            {step.desc}
          </p>
        )}
        {step.points && (
          <div className="space-y-2.5 mt-1 mb-2">
            {step.points.map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <CheckSvg />
                <span className="text-base text-[var(--text-2)] leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        )}
        {step.footer && (
          <p className="mt-4 text-[15px] text-[var(--text-1)] leading-relaxed font-semibold">
            {step.footer}
          </p>
        )}
        {hasCta && (
          <div className="mt-auto pt-6">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 w-full btn-primary px-5 py-3 text-sm rounded-full"
              data-testid={ctaTestId}
            >
              {ctaLabel}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const steps = t("howItWorks.steps", { returnObjects: true }) as {
    title: string;
    intro: string;
    points?: string[];
    footer?: string;
    desc?: string;
  }[];

  return (
    <section id="como-funciona" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
          <h2 className="section-h2 mb-5">
            {t("howItWorks.title")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3 whitespace-pre-line">
            {t("howItWorks.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[#00E510] font-medium">
            {t("howItWorks.desc2")}
          </p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {steps.map((step, i) => (
            <StepCard
              key={step.title}
              step={step}
              i={i}
              hasCta={i === steps.length - 1}
              ctaLabel={t("howItWorks.stepCta")}
              ctaHref={lp("book")}
              ctaTestId="button-step-cta-agendar"
            />
          ))}
        </div>

        <div className="lg:hidden space-y-5 max-w-md mx-auto">
          {steps.map((step, i) => (
            <StepCard
              key={`m-${step.title}`}
              step={step}
              i={i}
              hasCta={i === steps.length - 1}
              ctaLabel={t("howItWorks.stepCta")}
              ctaHref={lp("book")}
              ctaTestId="button-step-cta-agendar-mobile"
            />
          ))}
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-base lg:text-lg text-[var(--text-1)] font-medium mb-6">
            {t("howItWorks.bottomText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={lp("book")}
              className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]"
              data-testid="button-howitworks-agendar"
            >
              {t("howItWorks.bottomCta")}
            </Link>
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("howItWorks.whatsappMsg"))}`}
              onClick={() => trackWhatsAppClick("how_it_works")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]"
              data-testid="button-howitworks-whatsapp"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("talkWhatsapp")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
