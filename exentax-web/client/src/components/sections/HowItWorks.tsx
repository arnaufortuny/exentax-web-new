import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";

function CheckSvg() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <path d="M3 8l4 4 6-6" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepNumber({ num }: { num: number }) {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none" className="flex-shrink-0">
      <circle cx="28" cy="28" r="27" fill="var(--bg-1, #F7F8F7)" stroke="rgba(0,229,16,0.25)" strokeWidth="1.5"/>
      <circle cx="28" cy="28" r="21" fill="none" stroke="#00E510" strokeWidth="2">
        <animate attributeName="opacity" values="0.6;1;0.6" dur={`${2.2 + num * 0.3}s`} repeatCount="indefinite" />
      </circle>
      <text
        x="28"
        y="28"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#00E510"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        fontSize="22"
      >
        {num}
      </text>
    </svg>
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
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("howItWorks.tag")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] mb-4">
            {t("howItWorks.title")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3 whitespace-pre-line">
            {t("howItWorks.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[#00E510] font-medium">
            {t("howItWorks.desc2")}
          </p>
        </div>

        <div className="mt-16 hidden lg:block">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const hasCta = i === 2;
              return (
                <div key={step.title} className="reveal flex flex-col items-center" style={{ transitionDelay: `${i * 150}ms` }} data-testid={`step-${i}`}>
                  <div className="relative flex items-center justify-center w-full mb-6">
                    {i > 0 && (
                      <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-[#00E510]/40" />
                    )}
                    {i < steps.length - 1 && (
                      <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-[#00E510]/40" />
                    )}
                    <div className="w-14 h-14 flex items-center justify-center relative z-10">
                      <StepNumber num={i + 1} />
                    </div>
                  </div>
                  <div className="glass-card border border-[rgba(0,229,16,0.22)] rounded-[var(--radius-xl)] p-7 text-left w-full flex-1 flex flex-col">
                    <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-2">{step.title}</h3>
                    {step.intro && <p className="text-sm text-[#00E510] font-medium mb-3">{step.intro}</p>}
                    {step.desc && (
                      <p className="text-base text-[var(--text-2)] leading-relaxed mb-2">{step.desc}</p>
                    )}
                    {step.points && (
                      <div className="space-y-2 my-2">
                        {step.points.map((point) => (
                          <div key={point} className="flex items-start gap-2">
                            <CheckSvg />
                            <span className="text-base text-[var(--text-2)]">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.footer && (
                      <div className="mt-auto pt-3">
                        <p className="text-sm text-[var(--text-1)] leading-relaxed font-semibold">{step.footer}</p>
                      </div>
                    )}
                    {hasCta && (
                      <div className="mt-auto pt-4">
                        <Link
                          href={lp("/agendar-asesoria")}
                          className="inline-flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-5 py-2.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                          data-testid="button-step-cta-agendar"
                        >
                          {t("howItWorks.stepCta")}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 lg:hidden">
          <div className="space-y-0 max-w-md mx-auto">
            {steps.map((step, i) => {
              const hasCta = i === 2;
              return (
                <div key={`m-${step.title}`} className="reveal flex flex-col items-center" style={{ transitionDelay: `${i * 150}ms` }}>
                  {i > 0 && (
                    <div className="w-[2px] h-8 border-l-2 border-dashed border-[#00E510]/40" />
                  )}
                  <div className="w-12 h-12 flex items-center justify-center relative z-10 mb-3">
                    <StepNumber num={i + 1} />
                  </div>
                  <div className="glass-card border border-[rgba(0,229,16,0.22)] rounded-[var(--radius-xl)] p-5 sm:p-7 w-full">
                    <h3 className="font-heading font-semibold text-xl text-[var(--text-1)] mb-2">{step.title}</h3>
                    {step.intro && <p className="text-sm text-[#00E510] font-medium mb-3">{step.intro}</p>}
                    {step.desc && (
                      <p className="text-base text-[var(--text-2)] leading-relaxed mb-2">{step.desc}</p>
                    )}
                    {step.points && (
                      <div className="space-y-2 my-2">
                        {step.points.map((point) => (
                          <div key={point} className="flex items-start gap-2">
                            <CheckSvg />
                            <span className="text-base text-[var(--text-2)]">{point}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.footer && (
                      <div className="pt-3">
                        <p className="text-sm text-[var(--text-1)] leading-relaxed font-semibold">{step.footer}</p>
                      </div>
                    )}
                    {hasCta && (
                      <div className="pt-4">
                        <Link
                          href={lp("/agendar-asesoria")}
                          className="inline-flex items-center justify-center gap-2 w-full bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-5 py-2.5 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
                          data-testid="button-step-cta-agendar-mobile"
                        >
                          {t("howItWorks.stepCta")}
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-base lg:text-lg text-[var(--text-1)] font-medium mb-6">
            {t("howItWorks.bottomText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={lp("/agendar-asesoria")}
              className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]"
              data-testid="button-howitworks-agendar"
            >
              {t("howItWorks.bottomCta")}
            </Link>
            <a
              href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("howItWorks.whatsappMsg"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]"
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
