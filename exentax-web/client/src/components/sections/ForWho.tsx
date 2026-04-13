import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { CONTACT } from "@/lib/constants";
import { ReactNode } from "react";
import { useLangPath } from "@/hooks/useLangPath";

function IconGlobe() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="10" stroke="#00E510" strokeWidth="2" />
      <ellipse cx="22" cy="22" rx="4.5" ry="10" stroke="#00E510" strokeWidth="1.5" />
      <path d="M12 22h20" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 17h16" stroke="#00E510" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 27h16" stroke="#00E510" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <polyline points="32 15 24 23 20 19 12 27" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="26 15 32 15 32 21" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <rect x="12" y="14" width="20" height="14" rx="2" stroke="#00E510" strokeWidth="2" fill="none" />
      <polygon points="20 18 26 21 20 24" fill="#00E510" />
      <path d="M18 32h8" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 28v4" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <polygon points="22 13 12 18 22 23 32 18 22 13" stroke="#00E510" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <polyline points="12 23 22 28 32 23" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="12 28 22 33 32 28" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="18" cy="18" r="4" stroke="#00E510" strokeWidth="2" />
      <path d="M10 32v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="17" r="3" stroke="#00E510" strokeWidth="1.5" />
      <path d="M32 25a4 4 0 0 0-3-3.5" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 44 44" fill="none" className="flex-shrink-0">
      <rect x="2" y="2" width="40" height="40" rx="12" stroke="#00E510" strokeWidth="2" fill="none" />
      <circle cx="22" cy="22" r="10" stroke="#00E510" strokeWidth="2" />
      <polygon points="27 17 24.5 24.5 17 27 19.5 19.5 27 17" fill="rgba(0,229,16,0.15)" stroke="#00E510" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="22" cy="22" r="1.5" fill="#00E510" />
    </svg>
  );
}

const profileIcons: ReactNode[] = [
  <IconGlobe />,
  <IconTrendingUp />,
  <IconPlay />,
  <IconLayers />,
  <IconUsers />,
  <IconCompass />,
];

export default function ForWho() {
  const { t } = useTranslation();
  const ref = useReveal();
  const lp = useLangPath();

  const profiles = t("forWho.profiles", { returnObjects: true }) as { title: string; desc: string }[];
  const tags = t("forWho.tags", { returnObjects: true }) as string[];

  return (
    <section id="para-quien" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 reveal max-w-3xl">
          <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">{t("forWho.tag")}</span>
          <h2 className="font-heading font-bold text-[clamp(32px,2.5vw,34px)] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] mb-6">
            {t("forWho.title")}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("forWho.desc1")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed mb-4">
            {t("forWho.desc2")}
          </p>
          <p className="text-base lg:text-lg text-[var(--text-1)] font-medium leading-relaxed mb-6">
            {t("forWho.desc3")}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-body font-medium bg-[rgba(0,229,16,0.07)] text-[#00E510] border border-[rgba(0,229,16,0.12)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="reveal mb-16 glass-card rounded-[var(--radius-xl)] overflow-hidden border border-[rgba(0,229,16,0.22)]">
          <div className="p-4 sm:p-8 lg:p-12 text-center">
            <h3 className="font-heading font-bold text-2xl lg:text-[28px] leading-[1.15] text-[var(--text-1)] mb-2">
              {t("forWho.channelTitle")}
            </h3>
            <p className="font-heading font-bold text-2xl lg:text-[28px] leading-[1.15] text-[#00E510] mb-8">
              {t("forWho.structureMatters")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <Link
                href={lp("/agendar-asesoria")}
                className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 w-full sm:w-auto"
                data-testid="button-forwho-agendar-top"
              >
                {t("forWho.bookNow")}
              </Link>
              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("forWho.whatsappMsg1"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-6 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 w-full sm:w-auto"
                data-testid="button-forwho-whatsapp-top"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("talkWhatsapp")}
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mb-8 reveal">
          <span className="font-heading font-semibold text-2xl text-[var(--text-1)] relative inline-block pb-2">
            {t("forWho.fitsYou")}
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile, i) => (
            <div
              key={profile.title}
              className="reveal rounded-2xl p-6 flex flex-col transition-[color,background-color,border-color,box-shadow,opacity,transform,max-height] duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(0,229,16,0.04) 0%, var(--bg-1) 100%)',
                border: '1px solid rgba(0,229,16,0.12)',
                transitionDelay: `${i * 80}ms`,
              }}
              data-testid={`card-profile-${i}`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(0,229,16,0.08)', border: '1px solid rgba(0,229,16,0.15)' }} aria-hidden="true">
                {profileIcons[i]}
              </div>
              <h3 className="font-heading font-semibold text-base text-[var(--text-1)] mb-2">
                {profile.title}
              </h3>
              <p className="text-base text-[var(--text-2)] leading-relaxed">{profile.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center mt-12 reveal">
          <Link
            href={lp("/agendar-asesoria")}
            className="inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-5 sm:px-8 py-3.5 text-base rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap w-full sm:w-auto"
            data-testid="button-forwho-agendar"
          >
            {t("forWho.bookNow")}
          </Link>
          <a
            href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("forWho.whatsappMsg2"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#00E510]/40 hover:border-[#00E510]/70 text-[#00E510] font-body font-semibold px-5 sm:px-8 py-3.5 text-base rounded-full transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 whitespace-nowrap w-full sm:w-auto"
            data-testid="button-forwho-whatsapp"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("talkWhatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
