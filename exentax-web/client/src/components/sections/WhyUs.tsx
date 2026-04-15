import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { CONTACT } from "@/lib/constants";
import { ReactNode } from "react";
import { useLangPath } from "@/hooks/useLangPath";

function IconTarget() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="10" stroke="#00E510" strokeWidth="2" />
      <circle cx="22" cy="22" r="5.5" stroke="#00E510" strokeWidth="1.5" />
      <circle cx="22" cy="22" r="1.8" fill="#00E510" />
      <line x1="22" y1="10" x2="22" y2="14" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="30" x2="22" y2="34" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="22" x2="14" y2="22" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="22" x2="34" y2="22" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M12 26l4-4 3 1 3-3" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 18l-4 4-3-1-3 3" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24l-4 4 2 2 4-4" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 24l4 4-2 2-4-4" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M10 22s4.5-7 12-7 12 7 12 7-4.5 7-12 7-12-7-12-7z" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="22" r="3.5" stroke="#00E510" strokeWidth="2" />
      <circle cx="22" cy="22" r="1.2" fill="#00E510" />
    </svg>
  );
}

function IconShieldCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <path d="M22 12l-8 4v5c0 4.5 3.2 8.7 8 9.8 4.8-1.1 8-5.3 8-9.8v-5l-8-4z" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 22l2.5 2.5 4.5-4.5" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const trustIcons: (() => ReactNode)[] = [IconTarget, IconHandshake, IconEye, IconShieldCheck];

export default function WhyUs() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const trustPoints = t("whyUs.trustPoints", { returnObjects: true }) as { title: string; desc: string }[];

  return (
    <section id="por-que" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-16 reveal max-w-3xl">
          <span className="section-label mb-3">{t("whyUs.tag")}</span>
          <h2 className="section-h2 mb-4">
            {t("whyUs.title")}
          </h2>
          <p className="section-green mb-6">
            {t("whyUs.subtitle")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("whyUs.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("whyUs.desc2")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {t("whyUs.desc3")}
          </p>
        </div>

        <div className="text-center mb-10 reveal">
          <span className="font-heading font-semibold text-2xl text-[var(--text-1)] relative inline-block pb-2">
            {t("whyUs.differentiator")}
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                className="draw-path"
                d="M2 7c30-5 60 2 90-2s70 4 106 1"
                stroke="#00E510"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {trustPoints.map((point, i) => {
            const Icon = trustIcons[i];
            return (
              <div
                key={point.title}
                className="reveal rounded-2xl p-6 lg:p-7 transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300 group"
                style={{
                  background: 'var(--card-bg)',
                  backdropFilter: 'blur(20px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                  border: '1px solid var(--border-subtle)',
                  borderLeftWidth: '3px',
                  borderLeftColor: '#00E510',
                  transitionDelay: `${i * 100}ms`,
                }}
                data-testid={`trust-point-${i}`}
              >
                <div className="mb-4">
                  <Icon />
                </div>
                <h3 className="font-heading font-bold text-lg text-[var(--text-1)] mb-2">
                  {point.title}
                </h3>
                <p className="text-[15px] text-[var(--text-2)] leading-relaxed">{point.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-20 glass-card rounded-[var(--radius-xl)] p-10 lg:p-14 text-center relative overflow-hidden border border-[rgba(0,229,16,0.22)]">
          <div className="relative z-10">
            <p className="section-h2 mb-4">
              {t("whyUs.ctaTitle")}
            </p>
            <p className="section-green mb-8 max-w-[700px] mx-auto">
              {t("whyUs.ctaSubtitle")}
            </p>
            <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed max-w-[620px] mx-auto mb-10">
              {t("whyUs.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link
                href={lp("book")}
                className="btn-pulse inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-5 sm:px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap w-full sm:w-auto"
                data-testid="button-whyus-agendar"
              >
                {t("whyUs.bookNow")}
              </Link>
              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whyUs.whatsappMsg"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-5 sm:px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap w-full sm:w-auto"
                data-testid="button-whyus-whatsapp"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("talkWhatsapp")}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
