import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { BRAND, CONTACT } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import HeroStats, { useStatsHome } from "@/components/sections/HeroStats";

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5">
        <circle cx="24" cy="24" r="19" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[var(--text-2)] text-[15px] leading-relaxed">{text}</span>
    </div>
  );
}

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="24" cy="24" r="19" stroke="#FF6B6B" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 18.5L29.5 29.5" stroke="#FF6B6B" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29.5 18.5L18.5 29.5" stroke="#FF6B6B" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NeonCard({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 sm:p-7 border border-[rgba(0,229,16,0.20)] bg-[rgba(0,229,16,0.03)] ${className}`}>
      {title && <h4 className="font-heading font-bold text-base text-[#00E510] mb-5">{title}</h4>}
      {children}
    </div>
  );
}

function TimelineNode({ num, isLast = false }: { num: number; isLast?: boolean }) {
  return (
    <div className="hidden sm:flex flex-col items-center flex-shrink-0">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--bg-1)] border-2 border-[#00E510] flex items-center justify-center font-heading font-bold text-xl sm:text-2xl text-[#00E510] relative z-10 shadow-[0_0_20px_rgba(0,229,16,0.15)]">
        {num}
      </div>
      {!isLast && (
        <div className="w-0.5 bg-gradient-to-b from-[#00E510] via-[rgba(0,229,16,0.3)] to-[rgba(0,229,16,0.08)] flex-1 min-h-[40px]" />
      )}
    </div>
  );
}

function MobileTimelineNode({ num, isFirst = false }: { num: number; isFirst?: boolean }) {
  return (
    <div className="sm:hidden flex flex-col items-center">
      {!isFirst && (
        <div className="w-[2px] h-8 border-l-2 border-dashed border-[#00E510]/40" />
      )}
      <div className="w-12 h-12 rounded-full bg-[var(--bg-1)] border-2 border-[#00E510] flex items-center justify-center font-heading font-bold text-xl text-[#00E510] relative z-10 shadow-[0_0_20px_rgba(0,229,16,0.15)] mb-4">
        {num}
      </div>
    </div>
  );
}

function ProcessHero() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();
  const statsHome = useStatsHome();
  return (
    <>
      <SEO
        title={t("comoFuncionaPage.seoTitle")}
        description={t("comoFuncionaPage.seoDesc")}
        path="/como-trabajamos"
        breadcrumbs={[{ name: t("nav.howWeWork"), path: "/como-trabajamos" }]}
      />
      <section
        className="relative overflow-hidden pb-14"
      >
        <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 sm:pt-10 lg:pt-20">
          <div className="text-center max-w-[800px] mx-auto">
            <div className="reveal">
              <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-black dark:text-white mb-2" data-testid="heading-at-hero">
                {t("comoFunciona.hero.h1")}
              </h1>
              <p className="font-heading font-bold text-2xl sm:text-4xl lg:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] mb-6">
                <span className="relative inline-block text-[#00E510]">
                  {t("comoFunciona.hero.h2")}
                  <svg className="absolute top-full mt-2 lg:mt-4 left-0 w-full" style={{ height: '8px' }} viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                    <path className="draw-path" d="M2 7c40-6 80 6 140-3s80 5 156-2" stroke="#00E510" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </p>
              <p className="max-w-[680px] text-base lg:text-lg text-black/90 dark:text-white/80 leading-relaxed mb-8 mx-auto">
                {t("comoFunciona.hero.desc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
                <Link href={lp("/agendar-asesoria")} className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]" data-testid="button-at-hero-agendar">
                  {t("comoFunciona.hero.btnAgendar")}
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <a href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("comoFunciona.hero.waText"))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap sm:min-w-[220px] lg:min-w-[270px]" data-testid="button-at-hero-whatsapp">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("comoFunciona.hero.btnWhatsapp")}
                </a>
              </div>
              <HeroStats align="center" stats={statsHome} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PhasesIntro() {
  const { t } = useTranslation();
  const ref = useReveal();
  return (
    <section className="pt-4 pb-0 bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col gap-4 max-w-3xl">
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)]">
            {t("comoFunciona.intro.h2")}
          </h2>
          <p className="text-[var(--text-2)] text-lg leading-relaxed">
            {t("comoFunciona.intro.desc")}
          </p>
        </div>
      </div>
    </section>
  );
}

function PhasesTimeline() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const days = [
    {
      day: t("comoFunciona.days.0.day"),
      title: t("comoFunciona.days.0.title"),
      items: (t("comoFunciona.days.0.items", { returnObjects: true }) as string[]),
    },
    {
      day: t("comoFunciona.days.1.day"),
      title: t("comoFunciona.days.1.title"),
      items: (t("comoFunciona.days.1.items", { returnObjects: true }) as string[]),
    },
    {
      day: t("comoFunciona.days.2.day"),
      title: t("comoFunciona.days.2.title"),
      items: (t("comoFunciona.days.2.items", { returnObjects: true }) as string[]),
    },
    {
      day: t("comoFunciona.days.3.day"),
      title: t("comoFunciona.days.3.title"),
      items: (t("comoFunciona.days.3.items", { returnObjects: true }) as string[]),
    },
  ];

  const phase1AnalyzeItems = t("comoFunciona.phases.phase1.analyze.items", { returnObjects: true }) as string[];
  const phase1TakeawayItems = t("comoFunciona.phases.phase1.takeaway.items", { returnObjects: true }) as string[];
  const phase2ProposalItems = t("comoFunciona.phases.phase2.proposal.items", { returnObjects: true }) as string[];
  const phase4ManagedItems = t("comoFunciona.phases.phase4.managed.items", { returnObjects: true }) as string[];
  const phase4HowItems = t("comoFunciona.phases.phase4.how.items", { returnObjects: true }) as string[];

  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Phase 1 */}
        <div className="reveal flex flex-col sm:flex-row gap-0 sm:gap-8 lg:gap-10" data-testid="card-phase-1">
          <MobileTimelineNode num={1} isFirst />
          <TimelineNode num={1} />
          <div className="flex-1 min-w-0 pb-12 sm:pb-20">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-body font-medium text-sm uppercase tracking-wider text-[var(--text-3)]">{t("comoFunciona.phases.phase1.label")}</span>
              <span className="inline-flex items-center bg-[rgba(0,229,16,0.10)] text-[#00E510] border border-[rgba(0,229,16,0.18)] font-body font-semibold text-xs px-3 py-1 rounded-full">{t("comoFunciona.phases.phase1.badge")}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-6">{t("comoFunciona.phases.phase1.title")}</h3>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="space-y-4">
                <p className="text-[var(--text-2)] text-lg leading-relaxed">
                  {t("comoFunciona.phases.phase1.p1a")} <span className="text-[var(--text-1)] font-medium">{t("comoFunciona.phases.phase1.p1b")}</span>
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase1.p2")}
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase1.p3a")} <span className="text-[#00E510] font-medium">{t("comoFunciona.phases.phase1.p3b")}</span> {t("comoFunciona.phases.phase1.p3c")}
                </p>
              </div>
              <NeonCard title={t("comoFunciona.phases.phase1.analyze.title")}>
                <div className="space-y-3">
                  {phase1AnalyzeItems.map((item) => (
                    <CheckItem key={item} text={item} />
                  ))}
                </div>
              </NeonCard>
            </div>

            <NeonCard title={t("comoFunciona.phases.phase1.takeaway.title")} className="mb-8">
              <div className="grid sm:grid-cols-2 gap-3">
                {phase1TakeawayItems.map((item) => (
                  <CheckItem key={item} text={item} />
                ))}
              </div>
              <p className="text-[var(--text-3)] text-sm leading-relaxed mt-5 italic">
                {t("comoFunciona.phases.phase1.takeaway.note")}
              </p>
            </NeonCard>

            <div className="bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 text-center">
              <p className="text-[var(--text-2)] leading-relaxed mb-6">{t("comoFunciona.phases.phase1.cta.desc")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href={lp("/agendar-asesoria")} className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap" data-testid="button-at-phase1-agendar">
                  {t("comoFunciona.phases.phase1.cta.btnAgendar")}
                </Link>
                <a href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("comoFunciona.phases.phase1.cta.waText"))}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap" data-testid="button-at-phase1-whatsapp">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t("comoFunciona.phases.phase1.cta.btnWhatsapp")}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="reveal flex flex-col sm:flex-row gap-0 sm:gap-8 lg:gap-10" data-testid="card-phase-2">
          <MobileTimelineNode num={2} />
          <TimelineNode num={2} />
          <div className="flex-1 min-w-0 pb-12 sm:pb-20">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-body font-medium text-sm uppercase tracking-wider text-[var(--text-3)]">{t("comoFunciona.phases.phase2.label")}</span>
              <span className="inline-flex items-center bg-[rgba(0,229,16,0.10)] text-[#00E510] border border-[rgba(0,229,16,0.18)] font-body font-semibold text-xs px-3 py-1 rounded-full">{t("comoFunciona.phases.phase2.badge")}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-6">{t("comoFunciona.phases.phase2.title")}</h3>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="space-y-4">
                <p className="text-[var(--text-2)] text-lg leading-relaxed">
                  {t("comoFunciona.phases.phase2.p1")}
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase2.p2")}
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase2.p3a")} <span className="text-[#00E510] font-medium">{t("comoFunciona.phases.phase2.p3b")}</span>
                </p>
              </div>
              <div className="bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-7">
                <p className="text-[var(--text-2)] leading-relaxed mb-1">{t("comoFunciona.phases.phase2.box.p1")}</p>
                <p className="text-[var(--text-1)] leading-relaxed font-medium mb-1">{t("comoFunciona.phases.phase2.box.p2")}</p>
                <p className="text-[var(--text-2)] leading-relaxed">{t("comoFunciona.phases.phase2.box.p3")}</p>
              </div>
            </div>

            <NeonCard title={t("comoFunciona.phases.phase2.proposal.title")}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phase2ProposalItems.map((item) => (
                  <CheckItem key={item} text={item} />
                ))}
              </div>
              <p className="text-[var(--text-3)] text-sm leading-relaxed mt-5 italic">
                {t("comoFunciona.phases.phase2.proposal.note")}
              </p>
            </NeonCard>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="reveal flex flex-col sm:flex-row gap-0 sm:gap-8 lg:gap-10" data-testid="card-phase-3">
          <MobileTimelineNode num={3} />
          <TimelineNode num={3} />
          <div className="flex-1 min-w-0 pb-12 sm:pb-20">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-body font-medium text-sm uppercase tracking-wider text-[var(--text-3)]">{t("comoFunciona.phases.phase3.label")}</span>
              <span className="inline-flex items-center bg-[rgba(0,229,16,0.10)] text-[#00E510] border border-[rgba(0,229,16,0.18)] font-body font-semibold text-xs px-3 py-1 rounded-full">{t("comoFunciona.phases.phase3.badge")}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-6">{t("comoFunciona.phases.phase3.title")}</h3>

            <div className="space-y-4 mb-8 max-w-[720px]">
              <p className="text-[var(--text-2)] text-lg leading-relaxed">
                {t("comoFunciona.phases.phase3.p1")}
              </p>
              <p className="text-[var(--text-2)] leading-relaxed">
                {t("comoFunciona.phases.phase3.p2a")} <span className="text-[#00E510] font-medium">{t("comoFunciona.phases.phase3.p2b")}</span>
              </p>
            </div>

            <div className="hidden lg:block mb-8">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {days.map((block, i) => (
                  <div key={block.day} className="reveal flex flex-col items-center" style={{ transitionDelay: `${i * 150}ms` }}>
                    <div className="relative flex items-center justify-center w-full mb-5">
                      {i > 0 && (
                        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-[#00E510]/40" />
                      )}
                      {i < days.length - 1 && (
                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-[#00E510]/40" />
                      )}
                      <div className="relative z-10">
                        <span className="inline-flex items-center justify-center bg-[var(--bg-1)] border-2 border-[#00E510] text-[#00E510] font-heading font-bold text-sm px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,229,16,0.15)] whitespace-nowrap">{block.day}</span>
                      </div>
                    </div>
                    <div className="bg-[var(--bg-1)] border border-[rgba(0,229,16,0.22)] rounded-[var(--radius-xl)] p-6 text-left w-full flex-1 flex flex-col">
                      <h4 className="font-heading font-semibold text-base text-[var(--text-1)] mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.items.map((item) => (
                          <CheckItem key={item} text={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden mb-8">
              <div className="space-y-0 max-w-md mx-auto">
                {days.map((block, i) => (
                  <div key={block.day} className="reveal flex flex-col items-center" style={{ transitionDelay: `${i * 150}ms` }}>
                    {i > 0 && (
                      <div className="w-[2px] h-6 border-l-2 border-dashed border-[#00E510]/40" />
                    )}
                    <span className="inline-flex items-center justify-center bg-[var(--bg-1)] border-2 border-[#00E510] text-[#00E510] font-heading font-bold text-sm px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(0,229,16,0.15)] whitespace-nowrap mb-3">{block.day}</span>
                    <div className="bg-[var(--bg-1)] border border-[rgba(0,229,16,0.22)] rounded-[var(--radius-xl)] p-5 sm:p-6 w-full">
                      <h4 className="font-heading font-semibold text-base text-[var(--text-1)] mb-4">{block.title}</h4>
                      <div className="space-y-3">
                        {block.items.map((item) => (
                          <CheckItem key={item} text={item} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-7 max-w-[720px]">
              <p className="text-[var(--text-2)] leading-relaxed">
                {t("comoFunciona.phases.phase3.result")}
              </p>
            </div>
          </div>
        </div>

        {/* Phase 4 */}
        <div className="reveal flex flex-col sm:flex-row gap-0 sm:gap-8 lg:gap-10" data-testid="card-phase-4">
          <MobileTimelineNode num={4} />
          <TimelineNode num={4} isLast />
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <span className="font-body font-medium text-sm uppercase tracking-wider text-[var(--text-3)]">{t("comoFunciona.phases.phase4.label")}</span>
              <span className="inline-flex items-center bg-[rgba(0,229,16,0.10)] text-[#00E510] border border-[rgba(0,229,16,0.18)] font-body font-semibold text-xs px-3 py-1 rounded-full">{t("comoFunciona.phases.phase4.badge")}</span>
            </div>
            <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-6">{t("comoFunciona.phases.phase4.title")}</h3>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <div className="space-y-4">
                <p className="text-[var(--text-2)] text-lg leading-relaxed">
                  {t("comoFunciona.phases.phase4.p1")}
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase4.p2")}
                </p>
                <p className="text-[var(--text-2)] leading-relaxed">
                  <span className="text-[#00E510] font-medium">{t("comoFunciona.phases.phase4.p3")}</span>
                </p>
              </div>
              <div className="bg-[var(--bg-2)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-7">
                <h4 className="font-heading font-bold text-base text-[var(--text-1)] mb-3">{t("comoFunciona.phases.phase4.support.title")}</h4>
                <p className="text-[var(--text-2)] leading-relaxed">
                  {t("comoFunciona.phases.phase4.support.desc")}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <NeonCard title={t("comoFunciona.phases.phase4.managed.title")}>
                <div className="space-y-3">
                  {phase4ManagedItems.map((item) => (
                    <CheckItem key={item} text={item} />
                  ))}
                </div>
              </NeonCard>
              <NeonCard title={t("comoFunciona.phases.phase4.how.title")}>
                <div className="space-y-3">
                  {phase4HowItems.map((item) => (
                    <CheckItem key={item} text={item} />
                  ))}
                </div>
              </NeonCard>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function DirectContactIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M15 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="24" r="3.5" stroke="#00E510" strokeWidth="2" />
      <path d="M22 27.5V33" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 33h8" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ResidenciaFiscalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="10" stroke="#00E510" strokeWidth="2" />
      <ellipse cx="22" cy="22" rx="4.5" ry="10" stroke="#00E510" strokeWidth="1.5" />
      <path d="M12 22h20" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 17h16" stroke="#00E510" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 27h16" stroke="#00E510" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function TransparenciaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <rect x="14" y="13" width="16" height="20" rx="2" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M18 18h8" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 22h8" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 26h5" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="27" cy="28" r="4" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M25.5 28l1 1 2-2" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhyUsSection() {
  const { t } = useTranslation();
  const ref = useReveal();

  const cards = [
    {
      icon: <DirectContactIcon />,
      title: t("comoFunciona.whyUs.cards.0.title"),
      paragraphs: (t("comoFunciona.whyUs.cards.0.paragraphs", { returnObjects: true }) as string[]),
      emphasis: t("comoFunciona.whyUs.cards.0.emphasis"),
    },
    {
      icon: <ResidenciaFiscalIcon />,
      title: t("comoFunciona.whyUs.cards.1.title"),
      paragraphs: (t("comoFunciona.whyUs.cards.1.paragraphs", { returnObjects: true }) as string[]),
      highlight: t("comoFunciona.whyUs.cards.1.highlight"),
    },
    {
      icon: <TransparenciaIcon />,
      title: t("comoFunciona.whyUs.cards.2.title"),
      paragraphs: (t("comoFunciona.whyUs.cards.2.paragraphs", { returnObjects: true }) as string[]),
      list: (t("comoFunciona.whyUs.cards.2.list", { returnObjects: true }) as string[]),
      afterList: (t("comoFunciona.whyUs.cards.2.afterList", { returnObjects: true }) as string[]),
      emphasis: t("comoFunciona.whyUs.cards.2.emphasis"),
    },
  ];

  return (
    <section className="pt-6 lg:pt-10 pb-[var(--section-gap)] bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("comoFunciona.whyUs.label")}</span>
          <h2 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[40px] leading-[1.12] text-[var(--text-1)] mb-6">
            {t("comoFunciona.whyUs.titlePrefix")} <span className="text-[#00E510]">{BRAND.NAME}</span>
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3">
            {t("comoFunciona.whyUs.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-3">
            {t("comoFunciona.whyUs.desc2")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-1)] leading-relaxed font-medium">
            {t("comoFunciona.whyUs.desc3")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <div
              key={card.title}
              data-testid={`card-why-exentax-${i}`}
              className="reveal group relative rounded-2xl p-7 lg:p-8 border border-[var(--border-subtle)] bg-[var(--bg-1)] overflow-hidden transition-all duration-300 hover:border-[#00E510]/40 hover:shadow-[0_0_24px_rgba(0,229,16,0.06)]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00E510] to-[#00E510]/30 rounded-t-2xl" />

              <div className="mb-5">{card.icon}</div>

              <h3 className="font-heading font-bold text-lg lg:text-xl text-[var(--text-1)] mb-4 leading-snug">{card.title}</h3>

              <div className="space-y-3">
                {card.paragraphs.map((p) => (
                  <p key={p} className="text-[15px] text-[var(--text-2)] leading-relaxed">{p}</p>
                ))}

                {(card as any).list && (
                  <div className="space-y-2.5 pl-1">
                    {(card as any).list.map((item: string) => (
                      <div key={item} className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5">
                          <circle cx="24" cy="24" r="19" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#00E510" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[15px] text-[var(--text-2)] leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(card as any).afterList?.map((p: string) => (
                  <p key={p} className="text-[15px] text-[var(--text-2)] leading-relaxed">{p}</p>
                ))}
              </div>

              {(card as any).highlight && (
                <p className="mt-5 pt-4 border-t border-[#00E510]/20 text-[#00E510] font-semibold text-[15px] leading-relaxed">{(card as any).highlight}</p>
              )}

              {card.emphasis && (
                <p className="mt-5 pt-4 border-t border-[var(--border-subtle)] text-[var(--text-1)] font-medium text-[15px] leading-relaxed">{card.emphasis}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function WhatWeDoNotSection() {
  const { t } = useTranslation();
  const ref = useReveal();
  const col1Items = t("comoFunciona.whatWeDoNot.col1", { returnObjects: true }) as string[];
  const col2Items = t("comoFunciona.whatWeDoNot.col2", { returnObjects: true }) as string[];
  return (
    <section className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal bg-[rgba(255,107,107,0.03)] border border-[rgba(255,107,107,0.15)] rounded-[var(--radius-lg)] p-8 lg:p-12">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-[var(--text-1)] mb-8">{t("comoFunciona.whatWeDoNot.title")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {col1Items.map((item, i) => (
                <div key={`not-1-${i}`} className="flex items-start gap-4">
                  <XIcon />
                  <p className="text-[var(--text-2)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {col2Items.map((item, i) => (
                <div key={`not-2-${i}`} className="flex items-start gap-4">
                  <XIcon />
                  <p className="text-[var(--text-2)] leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ComoFuncionaPage() {
  return (
    <article className="bg-[var(--bg-0)]">
      <ProcessHero />
      <WhyUsSection />
      <PhasesIntro />
      <PhasesTimeline />
      <WhatWeDoNotSection />
    </article>
  );
}
