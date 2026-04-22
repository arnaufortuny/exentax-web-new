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
                    <span className="section-chip">{t("problem.tag")}</span>
          <h2 className="section-h2 mb-5">
            {t("problem.title")}
          </h2>
          <p className="text-[15px] lg:text-base text-[var(--text-2)] leading-relaxed">
            {t("problem.subtitle1")}{" "}
            <span className="text-[#00E510] font-medium">{t("problem.subtitle2")}</span>
          </p>
        </div>

        {/* Stats row — unified card */}
        <div className="reveal mb-14 grid sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.number} className="exentax-card rounded-2xl p-8 flex flex-col">
              <span
                className="font-heading font-extrabold leading-[1] tracking-[-0.035em] mb-5"
                style={{ fontSize: "clamp(2.75rem, 5.2vw, 4rem)", color: stat.accent }}
              >
                {stat.number}
              </span>
              <p className="text-[14.5px] leading-relaxed text-[var(--text-2)]">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Problem cards grid — same card, same rhythm */}
        <div className="reveal mb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="exentax-card rounded-2xl p-8 flex flex-col">
              <h3
                className="font-heading font-extrabold leading-[1.05] tracking-[-0.025em] mb-5 text-[var(--text-1)]"
                style={{ fontSize: "clamp(1.5rem, 2.2vw, 1.875rem)" }}
              >
                {card.title}
              </h3>
              <p className="text-[14.5px] text-[var(--text-2)] leading-relaxed" style={{ whiteSpace: "pre-line" }}>
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
            className="neon-card is-red relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid rgba(255,23,68,0.35)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,23,68,0.04) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="mb-7">
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
            className="neon-card is-green relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid rgba(0,229,16,0.40)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(0,229,16,0.04) 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <div className="mb-7">
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
