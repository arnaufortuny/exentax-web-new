import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

const painIcons: ReactNode[] = [
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <line x1="2" y1="11" x2="22" y2="11"/>
    <circle cx="7" cy="16" r="1"/>
  </svg>,
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2"/>
    <path d="M7 11v-3a5 5 0 0 1 10 0v3"/>
  </svg>,
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4,18 9,11 13,14 20,6"/>
    <polyline points="17,6 20,6 20,9"/>
  </svg>,
  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
    <line x1="16" y1="3" x2="19" y2="6"/>
    <line x1="19" y1="3" x2="16" y2="6"/>
  </svg>,
];

export default function Origin() {
  const { t } = useTranslation();
  const ref1 = useReveal();

  const painPoints = t("origin.painPoints", { returnObjects: true }) as string[];

  return (
    <section id="nuestra-experiencia" className="section-padding bg-[var(--bg-1)]" ref={ref1}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
          <span className="section-label mb-3">{t("origin.tag")}</span>
          <h2 className="section-h2 mb-4">
            {t("origin.title")}
          </h2>
          <p className="section-green mt-1">
            {t("origin.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl reveal mb-12">
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("origin.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("origin.desc2")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-1)] font-medium leading-relaxed">
            {t("origin.desc3")}
          </p>
        </div>

        <div
          className="reveal glass-card rounded-[var(--radius-xl)] p-8 lg:p-12 relative overflow-hidden border border-[rgba(0,229,16,0.22)]"
        >
          <div className="relative z-10">
            <div className="text-center mb-10">
              <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3">
                {t("origin.patternIntro")}
              </p>
              <p className="text-base lg:text-lg text-[var(--text-1)] font-medium leading-relaxed mb-2">
                {t("origin.patternProblem")}
              </p>
              <p className="font-heading font-bold text-2xl lg:text-[28px] text-[#00E510] mt-6">
                {t("origin.problemsStart")}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {painPoints.map((text, i) => (
                <div
                  key={text}
                  className="flex flex-col items-center text-center gap-4 p-5 rounded-2xl transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300"
                  style={{
                    background: 'rgba(0,229,16,0.04)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0,229,16,0.15)',
                    transitionDelay: `${i * 100}ms`,
                  }}
                  data-testid={`origin-pain-${i}`}
                >
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,229,16,0.08)' }}>
                    {painIcons[i]}
                  </div>
                  <span className="text-base text-[var(--text-1)] font-medium leading-snug">{text}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-10 space-y-1">
              <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
                {t("origin.notEffort")}
              </p>
              <p className="text-base lg:text-lg text-[var(--text-1)] font-medium leading-relaxed">
                {t("origin.lackStructure")}
              </p>
              <p className="font-heading font-semibold text-base lg:text-lg text-[#00E510] mt-4">
                {t("origin.weDesign")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
