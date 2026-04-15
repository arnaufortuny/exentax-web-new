import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { BRAND, CONTACT } from "@/lib/constants";
import Calculator from "@/components/calculator";
import NavbarFunnel from "@/components/layout/NavbarFunnel";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import SEO from "@/components/SEO";
import { BrandTick, BrandCross } from "@/components/calculator/BrandIcons";

function ArrowRight() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function WAIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function StartPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  const [calcVisible, setCalcVisible] = useState(false);
  const calcRef = useRef<HTMLDivElement>(null);

  const WA_LINK = `${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("start.waDefaultMsg"))}`;

  const hero = useReveal();
  const blockCalc = useReveal();
  const blockIdent = useReveal();
  const blockPos = useReveal();
  const blockWho = useReveal();
  const blockTrust = useReveal();
  const blockDecision = useReveal();
  const blockFear = useReveal();
  const blockClose = useReveal();

  useEffect(() => {
    const el = calcRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setCalcVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToCalc = () => {
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-0)", color: "var(--text-2)" }}>
      <SEO
        title={t("start.seoTitle")}
        description={t("start.seoDescription")}
        path="/start"
        noindex
      />

      <NavbarFunnel />

      <section className="px-5 pb-20 lg:pb-10 max-w-3xl mx-auto" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 160px)' }}>
        <div ref={hero} className="reveal text-center">
          <p className="font-body text-base sm:text-lg text-[var(--text-2)] mb-3">
            {t("start.heroSubtitle")}
          </p>
          <p className="font-heading font-semibold text-xl sm:text-2xl text-[var(--text-1)] mb-8">
            {t("start.heroHighlight")}{" "}
            <span className="relative inline-block text-[#00E510]">
              {t("start.heroHighlightBold")}
              <svg className="absolute top-full mt-0.5 left-0 w-full" style={{ height: '6px' }} viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
                <path className="draw-path" d="M2 7c30-5 60 2 90-2s70 4 106 1" stroke="#00E510" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </p>

          <h1 className="font-heading font-bold text-[clamp(32px,7vw,56px)] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)] mb-6">
            {t("start.heroTitle1")}<br />
            <span className="text-[var(--text-1)]">{t("start.heroTitle2")}{" "}
              <span className="relative inline-block">
                {t("start.heroTitle3")}
                <svg className="absolute top-full mt-1 left-0 w-full" style={{ height: '7px' }} viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                  <path className="draw-path" d="M2 7c40-6 80 6 140-3s80 5 156-2" stroke="#00E510" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="font-body text-base sm:text-lg text-[var(--text-2)] leading-relaxed max-w-[560px] mx-auto mb-10">
            {t("start.heroDesc1")}
            {" "}{t("start.heroDesc2")}
            <br /><br />
            {t("start.heroDesc3")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={scrollToCalc}
              className="inline-flex items-center justify-center gap-2 bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-4 text-sm rounded-full shadow-[0_0_24px_rgba(0,229,16,0.35)] hover:shadow-[0_0_40px_rgba(0,229,16,0.5)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
              data-testid="button-scroll-calc"
            >
              {t("start.heroBtn")}
              <ArrowRight />
            </button>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-1)] font-body font-semibold px-8 py-4 text-sm rounded-full hover:border-[var(--text-3)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
              data-testid="button-wa-hero"
            >
              <WAIcon />
              {t("start.heroWaBtn")}
            </a>
          </div>
        </div>
      </section>

      <section ref={blockCalc} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-4">
            {t("start.calcTitle1")}<br />
            <span className="text-[#00E510]">{t("start.calcTitle2")}</span>
          </h2>
          <p className="font-body text-base text-[var(--text-2)] max-w-[500px] mx-auto leading-relaxed">
            {t("start.calcDesc")}
          </p>
        </div>

        <div ref={calcRef}>
          {calcVisible && <Calculator />}
        </div>

        <p className="font-body text-xs text-[var(--text-3)] text-center mt-6 leading-relaxed">
          {t("start.calcDisclaimer")}
        </p>

        <div className="flex justify-center mt-5">
          <Link
            href={lp("book")}
            className="inline-flex items-center gap-2 bg-transparent border border-[rgba(0,229,16,0.3)] text-[#00E510] font-body font-semibold px-7 py-3 text-sm rounded-full hover:bg-[rgba(0,229,16,0.06)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 cursor-pointer no-underline"
            data-testid="link-agendar-start"
          >
            {t("start.calcCta")}
            <ArrowRight />
          </Link>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,229,16,0.15)] to-transparent mx-5 mb-24" />

      <section ref={blockIdent} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-6">
          {t("start.identTitle")}
        </h2>

        <div className="font-body text-lg text-[var(--text-2)] leading-relaxed mb-8 space-y-1">
          <p>{t("start.identDesc1")}</p>
          <p>{t("start.identDesc2")}</p>
          <p>{t("start.identDesc3")}</p>
          <p>{t("start.identDesc4")}</p>
        </div>

        <p className="font-heading font-bold text-xl text-[var(--text-1)] mb-8">
          <span className="border-b-2 border-[#00E510] pb-0.5">{t("start.identHighlight")}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {[t("start.identItem1"), t("start.identItem2"), t("start.identItem3"), t("start.identItem4")].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-1)] px-4 py-3.5">
              <BrandCross />
              <span className="font-body text-sm text-[var(--text-2)]">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[rgba(0,229,16,0.18)] bg-[rgba(0,229,16,0.04)] p-6">
          <p className="font-body text-base text-[var(--text-2)] leading-relaxed">
            {t("start.identNote1")}<br />
            <span className="text-[var(--text-1)] font-semibold">{t("start.identNote2")}</span>
          </p>
        </div>
      </section>

      <section ref={blockPos} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-6">
          {t("start.posTitle1")}<br />
          <span className="text-[#00E510]">{t("start.posTitle2")}</span>
        </h2>

        <p className="font-body text-lg text-[var(--text-2)] leading-relaxed mb-8">
          {t("start.posDesc1")}<br />
          {t("start.posDesc2")}
        </p>

        <div className="space-y-3 mb-8">
          {[t("start.posItem1"), t("start.posItem2"), t("start.posItem3")].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <BrandTick />
              <span className="font-body text-base text-[var(--text-1)]">{item}</span>
            </div>
          ))}
        </div>

        <p className="font-body text-base text-[var(--text-2)] leading-relaxed mb-4">
          {t("start.posNote")}
        </p>

        <div className="flex flex-wrap gap-2">
          {[t("start.posBadge1"), t("start.posBadge2"), t("start.posBadge3")].map((badge) => (
            <span key={badge} className="font-body text-sm font-semibold text-[#00E510] border border-[rgba(0,229,16,0.25)] rounded-full px-4 py-1.5">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,229,16,0.15)] to-transparent mx-5 mb-24" />

      <section ref={blockWho} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-10">
          {t("start.whoTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {[t("start.whoItem1"), t("start.whoItem2"), t("start.whoItem3"), t("start.whoItem4"), t("start.whoItem5"), t("start.whoItem6")].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-[rgba(0,229,16,0.12)] bg-[rgba(0,229,16,0.04)] px-4 py-4">
              <BrandTick />
              <span className="font-body text-sm text-[var(--text-2)] leading-snug">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-6 text-center">
          <p className="font-heading font-bold text-lg text-[var(--text-1)] mb-1">{t("start.whoNote1")}</p>
          <p className="font-body text-base text-[var(--text-2)]">{t("start.whoNote2")}</p>
        </div>
      </section>

      <section ref={blockTrust} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-6">
          {t("start.trustTitle")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {[t("start.trustItem1"), t("start.trustItem2"), t("start.trustItem3"), t("start.trustItem4")].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <BrandTick />
              <span className="font-body text-base text-[var(--text-2)]">{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.06)] p-6 mb-6">
          <p className="font-body text-sm text-[var(--text-2)] leading-relaxed">
            {t("start.trustWarning")}
          </p>
        </div>

        <p className="font-body text-base text-[var(--text-1)] font-semibold text-center">
          {t("start.trustClose")}
        </p>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,229,16,0.15)] to-transparent mx-5 mb-24" />

      <section ref={blockDecision} className="reveal px-5 pb-24 max-w-3xl mx-auto text-center">
        <h2 className="font-heading font-bold text-[clamp(24px,5vw,40px)] leading-[1.15] tracking-tight text-[var(--text-1)] mb-6">
          {t("start.decisionTitle1")}<br />
          {t("start.decisionTitle2")}{" "}
          <span className="relative inline-block text-[#00E510]">
            {t("start.decisionTitle3")}
            <svg className="absolute top-full mt-0.5 left-0 w-full" style={{ height: '6px' }} viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
              <path d="M2 7c30-5 60 2 90-2s70 4 106 1" stroke="#00E510" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        </h2>

        <div className="font-body text-lg text-[var(--text-2)] leading-relaxed mb-6 space-y-1 max-w-[440px] mx-auto">
          <p>{t("start.decisionDesc1")}</p>
          <p>{t("start.decisionDesc2")}</p>
        </div>

        <p className="font-body text-base text-[var(--text-2)] mb-8 max-w-[400px] mx-auto">
          {t("start.decisionNote1")}<br />
          <strong className="text-[var(--text-1)]">{t("start.decisionNote2")}</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
          <Link
            href={lp("book")}
            className="inline-flex items-center justify-center gap-2 bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-8 py-4 text-sm rounded-full shadow-[0_0_24px_rgba(0,229,16,0.35)] hover:shadow-[0_0_40px_rgba(0,229,16,0.5)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
            data-testid="button-agendar-decision"
          >
            {t("start.decisionCta")}
            <ArrowRight />
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-1)] font-body font-semibold px-8 py-4 text-sm rounded-full hover:border-[var(--text-3)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
            data-testid="button-wa-decision"
          >
            <WAIcon />
            {t("start.decisionWa")}
          </a>
        </div>

        <p className="font-body text-xs text-[var(--text-3)]">
          {t("start.decisionMeta")}
        </p>
      </section>

      <section ref={blockFear} className="reveal px-5 pb-24 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-[rgba(0,229,16,0.2)] bg-[rgba(0,229,16,0.04)] p-8">
          <h2 className="font-heading font-bold text-2xl text-[var(--text-1)] mb-6">
            {t("start.fearTitle")}
          </h2>

          <div className="space-y-3 mb-8">
            {[t("start.fearItem1"), t("start.fearItem2"), t("start.fearItem3"), t("start.fearItem4")].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <BrandTick />
                <span className="font-body text-base text-[var(--text-2)]">{item}</span>
              </div>
            ))}
          </div>

          <p className="font-body text-base text-[var(--text-1)] font-semibold">
            {t("start.fearClose")}
          </p>
        </div>
      </section>

      <section ref={blockClose} className="reveal px-5 pb-20 max-w-3xl mx-auto text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(0,229,16,0.2)] to-transparent mb-12" />

        <Link href="/" className="group inline-block mb-8" data-testid="link-start-home">
          <img src="/ex-icon-green.png" alt={BRAND.NAME} className="h-36 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity mx-auto" data-testid="img-logo-start" />
        </Link>

        <p className="font-body text-base text-[var(--text-2)] leading-relaxed max-w-[500px] mx-auto mb-8">
          {t("start.closeDesc1")}<br />
          {t("start.closeDesc2")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6">
          <Link href="/legal/cookies" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors" data-testid="link-start-cookies">
            {t("start.closeCookies")}
          </Link>
          <span className="text-[var(--text-3)]">·</span>
          <Link href="/legal/privacidad" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors" data-testid="link-start-privacy">
            {t("start.closePrivacy")}
          </Link>
        </div>
        <p className="font-body text-[11px] text-[var(--text-3)] mt-3 opacity-60">
          © {new Date().getFullYear()} {BRAND.NAME} LLC
        </p>
      </section>

    </div>
  );
}
