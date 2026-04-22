import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

const painIcons: ReactNode[] = [
  // Bank with subtle slash — banking friction
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <path d="M5 14 L18 7 L31 14" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 14 L31 14" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M9 17 L9 25 M15 17 L15 25 M21 17 L21 25 M27 17 L27 25" stroke="#00E510" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M4 28 L32 28" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M27 6 L31.5 10.5" stroke="#FF1744" strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
  </svg>,
  // Card with lock — payment platform blocks
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect x="4" y="9" width="22" height="15" rx="2.5" stroke="#00E510" strokeWidth="1.8"/>
    <path d="M4 14 L26 14" stroke="#00E510" strokeWidth="1.8"/>
    <path d="M8 19 L13 19" stroke="#00E510" strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="22" y="20" width="10" height="9" rx="1.5" stroke="#FF1744" strokeWidth="1.8" fill="#FFF8EE"/>
    <path d="M24.5 20 V18 a2.5 2.5 0 0 1 5 0 V20" stroke="#FF1744" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="27" cy="24.5" r="1" fill="#FF1744"/>
  </svg>,
  // Percent with up arrow — taxes too high
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="3.2" stroke="#00E510" strokeWidth="1.8"/>
    <circle cx="22" cy="22" r="3.2" stroke="#00E510" strokeWidth="1.8"/>
    <path d="M27 11 L9 29" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M28 14 L28 6 L20 6" stroke="#FF1744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 6 L29 15" stroke="#FF1744" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>,
  // Confused advisor — head with question mark
  <svg width={36} height={36} viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <circle cx="14" cy="11" r="4.5" stroke="#00E510" strokeWidth="1.8"/>
    <path d="M5 30 V27 a6 6 0 0 1 6-6 h6 a6 6 0 0 1 6 6 V30" stroke="#00E510" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25 8 a3 3 0 0 1 6 0 c0 2 -3 2.5 -3 4.5" stroke="#FF1744" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="28" cy="16.5" r="1.1" fill="#FF1744"/>
  </svg>,
];

export default function Origin() {
  const { t } = useTranslation();
  const ref1 = useReveal();

  const painPoints = t("origin.painPoints", { returnObjects: true }) as string[];

  return (
    <section id="nuestra-experiencia" className="section-padding" ref={ref1}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
                    <span className="section-chip">{t("origin.tag")}</span>
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
          className="reveal relative rounded-[32px] p-8 sm:p-10 lg:p-16 overflow-hidden"
          style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(28px) saturate(1.7)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.7)',
            border: '1px solid rgba(0,229,16,0.20)',
            borderTop: '2px solid #00E510',
          }}
        >
          {/* ambient liquid-glass glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 50% at 50% 0%, rgba(0,229,16,0.10), transparent 65%), radial-gradient(50% 40% at 100% 100%, rgba(0,229,16,0.06), transparent 70%)',
            }}
          />

          <div className="relative z-10">
            <div className="text-center mb-12 lg:mb-14 max-w-3xl mx-auto">
              <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3">
                {t("origin.patternIntro")}
              </p>
              <p className="text-base lg:text-lg text-[var(--text-1)] font-medium leading-relaxed">
                {t("origin.patternProblem")}
              </p>
              <p className="font-heading font-bold text-xl lg:text-2xl text-[#00E510] mt-7 tracking-tight">
                {t("origin.problemsStart")}
              </p>
            </div>

            {/* Pain points — no per-item boxes, just icon + label, separated by hairline dividers on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2 lg:divide-x lg:divide-[rgba(0,229,16,0.18)]">
              {painPoints.map((text, i) => (
                <div
                  key={text}
                  className="flex flex-col items-center text-center gap-4 px-3 lg:px-6"
                  style={{ transitionDelay: `${i * 80}ms` }}
                  data-testid={`origin-pain-${i}`}
                >
                  <div className="flex items-center justify-center">
                    {painIcons[i]}
                  </div>
                  <span className="text-[15px] lg:text-base text-[var(--text-1)] font-medium leading-snug max-w-[200px]">
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Closing statement — narrative climax */}
            <div className="text-center mt-14 lg:mt-16 max-w-2xl mx-auto">
              <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
                {t("origin.notEffort")}
              </p>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[var(--text-1)] mt-1 leading-[1.1]">
                {t("origin.lackStructure")}
              </h3>
              <p className="font-heading font-semibold text-base lg:text-lg text-[#00E510] mt-6">
                {t("origin.weDesign")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
