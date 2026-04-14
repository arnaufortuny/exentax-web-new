import { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";

function XIcon({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="#FF1744" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 18.5L29.5 29.5" stroke="#FF1744" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29.5 18.5L18.5 29.5" stroke="#FF1744" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type CarouselItem = {
  headline: string;
  desc: string;
  isNegative: boolean;
};

const PX_PER_MS = 0.025;

function CarouselCard({ item }: { item: CarouselItem }) {
  const neon = item.isNegative ? "#FF1744" : "#00E510";

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] mx-3 whitespace-normal">
      <div
        className="relative h-full rounded-2xl p-6 min-h-[200px] flex flex-col overflow-hidden"
        style={{
          background: 'var(--card-bg)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
          border: `1px solid ${neon}28`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${neon}, transparent)`, opacity: 0.45 }}
        />

        <h4 className="font-heading font-bold text-xl leading-tight mb-2.5" style={{ color: neon }}>
          {item.headline}
        </h4>
        <p className="text-[var(--text-3)] leading-relaxed text-sm flex-1" style={{ whiteSpace: "pre-line" }}>
          {item.desc}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: neon }} />
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${neon}30, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

function ProblemCarousel({ items }: { items: CarouselItem[] }) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const prevTimeRef = useRef(0);
  const halfRef = useRef(0);

  const doubled = [...items, ...items];

  const recalcHalf = useCallback(() => {
    const track = trackRef.current;
    if (track) halfRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const track: HTMLDivElement = el;
    recalcHalf();
    const ro = new ResizeObserver(recalcHalf);
    ro.observe(track);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf: number;
    function step(time: number) {
      if (!prevTimeRef.current) prevTimeRef.current = time;
      const dt = time - prevTimeRef.current;
      prevTimeRef.current = time;
      if (!prefersReduced && halfRef.current > 0) {
        posRef.current += PX_PER_MS * dt;
        if (posRef.current >= halfRef.current) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [recalcHalf]);

  return (
    <section className="relative w-full overflow-hidden py-4" aria-label={t("common.problemCarousel")} data-testid="problem-carousel">
      <div className="absolute inset-y-0 left-0 w-24 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--bg-0), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-32 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--bg-0), transparent)" }} />

      <div className="flex whitespace-nowrap will-change-transform" ref={trackRef}>
        {doubled.map((item, i) => (
          <CarouselCard key={i} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function Problem() {
  const { t } = useTranslation();
  const ref = useReveal();

  const carouselItems: CarouselItem[] = [
    { headline: t("problem.stat1.number"), desc: t("problem.stat1.desc"), isNegative: true },
    { headline: t("problem.stat2.number"), desc: t("problem.stat2.desc"), isNegative: false },
    { headline: t("problem.stat3.headline"), desc: t("problem.stat3.desc"), isNegative: false },
    ...(t("problem.cards", { returnObjects: true }) as { title: string; desc: string }[]).map(card => ({
      headline: card.title,
      desc: card.desc,
      isNegative: true,
    })),
  ];

  const problems = t("problem.problems", { returnObjects: true }) as string[];
  const solutions = t("problem.solutions", { returnObjects: true }) as string[];

  return (
    <section id="problema" className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-16">
          <div className="mb-12 max-w-3xl">
            <span className="section-label mb-3">{t("problem.tag")}</span>
            <h2 className="section-h2 mb-5">
              {t("problem.title")}
            </h2>
            <p className="text-base lg:text-lg text-[var(--text-2)]">
              {t("problem.subtitle1")}<br />
              <span className="text-[#00E510] font-medium">{t("problem.subtitle2")}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="reveal mb-20">
        <ProblemCarousel items={carouselItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <div className="relative grid lg:grid-cols-2 gap-5 mb-14">

            {/* Without structure — red */}
            <div
              data-testid="card-sin-estructura"
              className="relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid rgba(255,23,68,0.22)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,23,68,0.04) 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.2)' }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#FF1744" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl" style={{ color: '#FF1744' }}>{t("problem.withoutTitle")}</h3>
                </div>
                <div className="space-y-3.5">
                  {problems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 opacity-70">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#FF1744" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-[15px] leading-relaxed text-[var(--text-3)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* With Exentax — green */}
            <div
              data-testid="card-con-exentax"
              className="relative rounded-[var(--radius-xl)] p-8 lg:p-10 overflow-hidden"
              style={{
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: '1px solid rgba(0,229,16,0.25)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0,229,16,0.04) 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,229,16,0.1)', border: '1px solid rgba(0,229,16,0.2)' }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#00E510" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-[#00E510]">{t("problem.withTitle")}</h3>
                </div>
                <div className="space-y-3.5">
                  {solutions.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M5 13l4 4L19 7" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[15px] leading-relaxed text-[var(--text-2)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
