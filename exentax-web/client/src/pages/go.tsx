import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import { BRAND, CONTACT, SOCIAL } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { CalculatorIcon, CalendarIcon, WhatsAppIcon } from "@/components/icons";
import { trackWhatsAppClick } from "@/components/Tracking";

function ExMark() {
  return (
    <img src="/ex-icon-green.png" alt={BRAND.NAME} width={144} height={144} className="w-36 h-36 object-contain" data-testid="img-logo-links" />
  );
}


function TikTokIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.95a8.27 8.27 0 004.76 1.5V7a4.83 4.83 0 01-1-.31z" />
    </svg>
  );
}


function UsersIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

const btnBase = "w-full py-3.5 px-6 rounded-full font-body font-semibold text-base text-center transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 inline-flex items-center justify-center gap-2";
const btnOutline = "border border-[var(--border)] text-[var(--text-1)] active:border-[#00E510]/40";
const iconCircle = "w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] active:text-[var(--text-1)] active:border-[#00E510]/40 transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200";

export default function GoPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  return (
    <>
    <SEO
      path={lp("/links")}
      title={t("links.seoTitle")}
      description={t("links.seoDescription")}
      ogTitle={t("links.ogTitle", { defaultValue: "" }) as string || undefined}
      ogDescription={t("links.ogDescription", { defaultValue: "" }) as string || undefined}
      noindex
    />
    <div className="min-h-screen relative flex flex-col items-center justify-start px-5 pt-4 pb-10 bg-[var(--bg-0)]">
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: BRAND.NAME, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
          }
        }}
        aria-label={t("blogPost.share")}
        className="absolute top-5 right-5 w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-3)] active:text-[var(--text-1)] active:border-[#00E510]/40 transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
        data-testid="button-share"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      </button>

      <div className="w-full max-w-[400px] flex flex-col items-center mt-4">
        <a href={lp("home")} data-testid="link-links-home">
          <ExMark />
        </a>

        <h1 className="font-heading !text-[18px] font-bold text-[var(--text-1)] mt-0 mb-1 text-center tracking-tight leading-tight">
          {t("links.h1Line1")}<br />{t("links.h1Line2")}
        </h1>
        <p className="font-body text-[13px] text-[var(--text-2)] mt-3 mb-6 text-center leading-relaxed px-2">
          {t("links.sub1Line1")}<br />
          {t("links.sub1Line2")}
        </p>
        <p className="font-body text-[13px] text-[var(--text-2)] -mt-3 mb-6 text-center leading-relaxed px-2">
          {t("links.sub2Line1")}<br />
          {t("links.sub2Line2")}
        </p>

        <div className="flex flex-col gap-3.5 w-full">
          <a
            href={lp("book")}
            className={`${btnBase} btn-primary`}
            data-testid="link-links-agenda"
          >
            <CalendarIcon />
            {t("links.cta")}
          </a>

          <a
            href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("links.whatsappMsg"))}`}
            onClick={() => trackWhatsAppClick("links_page")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} ${btnOutline}`}
            data-testid="link-links-whatsapp"
          >
            <WhatsAppIcon size={18} />
            {t("links.whatsapp")}
          </a>

          <a
            href={`${CONTACT.SITE_URL}/#calculadora`}
            className={`${btnBase} ${btnOutline}`}
            data-testid="link-links-calculadora"
          >
            <CalculatorIcon size={18} className="w-[18px] h-[18px]" />
            {t("links.calculator")}
          </a>

          <a
            href={lp("how_we_work")}
            className={`${btnBase} ${btnOutline}`}
            data-testid="link-links-como"
          >
            <UsersIcon />
            {t("links.howWeWork")}
          </a>

          <a
            href={lp("about_llc")}
            className={`${btnBase} ${btnOutline}`}
            data-testid="link-links-llc"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            {t("links.aboutLLC")}
          </a>

          <a
            href={CONTACT.SITE_URL}
            className={`${btnBase} ${btnOutline}`}
            data-testid="link-links-web"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {t("links.visitWeb")}
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <a href={`mailto:${CONTACT.EMAIL}`} aria-label={t("footer.social.email")} className={iconCircle} data-testid="icon-email">
            <EmailIcon />
          </a>
          <a href={SOCIAL.INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label={t("footer.social.instagram")} className={iconCircle} data-testid="icon-instagram">
            <InstagramIcon />
          </a>
          <a href={SOCIAL.TIKTOK} target="_blank" rel="noopener noreferrer" aria-label={t("footer.social.tiktok")} className={iconCircle} data-testid="icon-tiktok">
            <TikTokIcon />
          </a>
          <a href={SOCIAL.FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label={t("footer.social.facebook")} className={iconCircle} data-testid="icon-facebook">
            <FacebookIcon />
          </a>
          <a href={SOCIAL.YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label={t("footer.social.youtube")} className={iconCircle} data-testid="icon-youtube">
            <YouTubeIcon />
          </a>
        </div>

        <div className="flex items-center justify-center mt-8">
          <img src="/img/partner-trustpilot.webp" alt={t("footer.trustpilotAlt")} loading="lazy" decoding="async" className="h-12 w-auto object-contain" data-testid="img-partner-trustpilot-links" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-5">
          <a href={lp("legal_cookies")} className="text-xs text-[var(--text-3)] active:text-[var(--text-2)] transition-colors" data-testid="link-links-cookies">
            {t("links.cookies")}
          </a>
          <span className="text-[var(--text-3)]">·</span>
          <a href={lp("legal_privacy")} className="text-xs text-[var(--text-3)] active:text-[var(--text-2)] transition-colors" data-testid="link-links-privacidad">
            {t("links.privacy")}
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
