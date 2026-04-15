import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";

export default function Problem() {
  const { t } = useTranslation();
  const ref = useReveal();

  const problems = t("problem.problems", { returnObjects: true }) as string[];
  const solutions = t("problem.solutions", { returnObjects: true }) as string[];
  const cards = t("problem.cards", { returnObjects: true }) as { title: string; desc: string }[];

  const stats = [
    {
      number: t("problem.stat1.number"),
      desc: t("problem.stat1.desc"),
      accent: "#FF1744",
    },
    {
      number: t("problem.stat2.number"),
      desc: t("problem.stat2.desc"),
      accent: "#00E510",
    },
    {
      number: t("problem.stat3.headline"),
      desc: t("problem.stat3.desc"),
      accent: "#00E510",
    },
  ];

  return (
    <section id="problema" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section intro */}
        <div className="reveal mb-14 max-w-3xl">
          <span className="section-label mb-3">{t("problem.tag")}</span>
          <h2 className="section-h2 mb-5">
            {t("problem.title")}
          </h2>
          <p className="text-[15px] lg:text-base text-[var(--text-2)] leading-relaxed">
            {t("problem.subtitle1")}{" "}
            <span className="text-[#00E510] font-medium">{t("problem.subtitle2")}</span>
          </p>
        </div>

        {/* Stats row */}
        <div className="reveal mb-12 grid sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.number}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background: "var(--card-bg)",
                backdropFilter: "blur(20px) saturate(1.5)",
                WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                border: `1px solid ${stat.accent}22`,
              }}
            >
              <span
                className="font-heading font-extrabold leading-none mb-3"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: stat.accent }}
              >
                {stat.number}
              </span>
              <p className="text-[14px] leading-relaxed text-[var(--text-3)]">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Problem cards grid */}
        <div className="reveal mb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="rounded-2xl p-6"
              style={{
                background: "var(--card-bg)",
                backdropFilter: "blur(20px) saturate(1.5)",
                WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                border: "1px solid rgba(255,23,68,0.15)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: "#FF1744" }} />
                <h3 className="font-heading font-semibold text-[15px] text-[var(--text-1)]">{card.title}</h3>
              </div>
              <p className="text-[14px] text-[var(--text-3)] leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison: without vs with structure */}
        <div className="reveal relative grid lg:grid-cols-2 gap-5 mb-2">

          {/* Without structure */}
          <div
            data-testid="card-sin-estructura"
            className="relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid rgba(255,23,68,0.22)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,23,68,0.04) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,23,68,0.1)", border: "1px solid rgba(255,23,68,0.2)" }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#FF1744" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl" style={{ color: "#FF1744" }}>{t("problem.withoutTitle")}</h3>
              </div>
              <div className="space-y-3.5">
                {problems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 opacity-60">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#FF1744" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[14.5px] leading-relaxed text-[var(--text-3)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* With Exentax */}
          <div
            data-testid="card-con-exentax"
            className="relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid rgba(0,229,16,0.25)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(0,229,16,0.04) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,229,16,0.1)", border: "1px solid rgba(0,229,16,0.2)" }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#00E510" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#00E510]">{t("problem.withTitle")}</h3>
              </div>
              <div className="space-y-3.5">
                {solutions.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                      <path d="M5 13l4 4L19 7" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14.5px] leading-relaxed text-[var(--text-2)]">{item}</span>
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
