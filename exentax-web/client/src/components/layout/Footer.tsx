import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { clearCookieConsent } from "@/components/CookieBanner";
import { BRAND, CONTACT, SOCIAL } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { trackNewsletterSubscribe, trackWhatsAppClick } from "@/components/Tracking";
import { clientLogger } from "@/lib/clientLogger";

function NewsletterSignup() {
  const { t, i18n } = useTranslation();
  const lp = useLangPath();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer", privacyAccepted: true, marketingAccepted: false, language: i18n.language }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        trackNewsletterSubscribe("footer", { language: i18n.language });
      } else {
        setStatus("error");
      }
    } catch (err) {
      clientLogger.warn("[footer] newsletter subscribe failed", err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <h4 className="font-heading font-semibold text-[13px] text-black/70 mb-2">
        {t("footer.newsletter.title")}
      </h4>

      {status === "success" ? (
        <p className="text-sm text-black font-semibold" data-testid="text-newsletter-success">{t("footer.newsletter.success")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-center px-2 sm:px-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.newsletter.placeholder")}
              aria-label={t("footer.newsletter.placeholder")}
              required
              disabled={status === "loading"}
              className="flex-1 min-w-0 max-w-full sm:max-w-[260px] px-4 py-2.5 rounded-full bg-black/10 border border-white/60 text-black text-sm placeholder:text-black/40 focus:outline-none focus:border-white disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="input-newsletter-email"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 rounded-full bg-black text-[#00E510] font-semibold text-sm hover:bg-black/90 transition-colors disabled:opacity-50 flex-shrink-0"
              data-testid="button-newsletter-subscribe"
            >
              {status === "loading" ? t("footer.newsletter.loading") : t("footer.newsletter.button")}
            </button>
          </div>

          <p className="text-[10px] text-black/50 leading-relaxed text-center px-2" data-testid="text-newsletter-privacy-disclaimer">
            {t("footer.newsletter.privacyCheck")}{" "}
            <Link href={lp("legal_privacy")} className="text-black/70 underline hover:text-black">{t("footer.newsletter.privacyPolicy")}</Link>.
          </p>
        </form>
      )}
      {status === "error" && (
        <p className="text-sm text-[var(--error)] mt-2" data-testid="text-newsletter-error">{t("footer.newsletter.error")}</p>
      )}
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const lp = useLangPath();

  const footerCompany = useMemo<{ label: string; href: string }[]>(() => [
    { label: t("footer.companyLinks.home"), href: lp("home") },
    { label: t("footer.companyLinks.services"), href: lp("our_services") },
    // Task #16: state subpages exposed as direct quick-links so the footer
    // is a viable navigation surface for visitors who already know the
    // jurisdiction they want.
    { label: t("llcUsPage.newMexico"), href: lp("service_llc_nm") },
    { label: t("llcUsPage.wyoming"),   href: lp("service_llc_wy") },
    { label: t("llcUsPage.delaware"),  href: lp("service_llc_de") },
    { label: t("llcUsPage.florida", { defaultValue: "Florida" }), href: lp("service_llc_fl") },
    { label: t("nav.servicesItin"), href: lp("service_itin") },
    { label: t("footer.companyLinks.howWeWork"), href: lp("how_we_work") },
    { label: t("footer.companyLinks.faq"), href: lp("faq") },
    { label: t("footer.companyLinks.blog"), href: lp("/blog") },
    { label: t("footer.companyLinks.talk"), href: lp("book") },
  ], [t, lp]);

  const footerLegal = useMemo(() => [
    { label: t("footer.legalLinks.terms"), href: lp("legal_terms") },
    { label: t("footer.legalLinks.privacy"), href: lp("legal_privacy") },
    { label: t("footer.legalLinks.cookies"), href: lp("legal_cookies") },
    { label: t("footer.legalLinks.refunds"), href: lp("legal_refunds") },
    { label: t("footer.legalLinks.disclaimer"), href: lp("legal_disclaimer") },
  ], [t, lp]);

  const socials = useMemo(() => {
    return [
    { href: SOCIAL.INSTAGRAM, label: t("footer.social.instagram"), id: "instagram", icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )},
    { href: SOCIAL.TIKTOK, label: t("footer.social.tiktok"), id: "tiktok", icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.95a8.27 8.27 0 004.76 1.5V7a4.83 4.83 0 01-1-.31z" />
      </svg>
    )},
    { href: SOCIAL.YOUTUBE, label: t("footer.social.youtube"), id: "youtube", icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )},
    { href: SOCIAL.FACEBOOK, label: t("footer.social.facebook"), id: "facebook", icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )},
    { href: `${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappDefault"))}`, label: t("footer.social.whatsapp"), id: "whatsapp", icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )},
  ];
  }, [t]);

  return (
    <footer className="relative" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-[28px] overflow-hidden" style={{ background: "#00E510" }}>
        <div className="px-6 sm:px-10 lg:px-16">

        <div className="pt-16 pb-12 text-center">
          <Link href={lp("home")} data-testid="link-footer-home">
            <img src="/ex-icon-green.png" alt={BRAND.NAME} width={112} height={112} className="h-28 w-auto object-contain mx-auto brightness-0" loading="lazy" decoding="async" data-testid="img-logo-footer" />
          </Link>
        </div>

        <div className="border-t border-white/40 pt-10 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14">
            <div className="col-span-2 md:col-span-1">
              <p className="font-body text-sm text-black/60 leading-relaxed max-w-[240px]">
                {t("footer.desc")}
              </p>
              <div className="flex items-center gap-3 mt-5">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={s.id === "whatsapp" ? () => trackWhatsAppClick("footer_social") : undefined}
                    className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center text-black/70 hover:bg-black hover:text-[#00E510] hover:border-black transition-all duration-200"
                    aria-label={s.label}
                    data-testid={`link-footer-social-${s.id}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-[13px] text-black/70 mb-5">
                {t("footer.navigation")}
              </h4>
              <div className="flex flex-col gap-2.5">
                {footerCompany.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[14px] text-black/80 hover:text-black font-medium transition-colors duration-150"
                    data-testid={`link-footer-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-[13px] text-black/70 mb-5">
                {t("footer.legal")}
              </h4>
              <div className="flex flex-col gap-2.5">
                {footerLegal.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[14px] text-black/80 hover:text-black font-medium transition-colors duration-150"
                    data-testid={`link-footer-${item.href.replace("/", "")}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-[13px] text-black/70 mb-5">
                {t("footer.contact")}
              </h4>
              <div className="flex flex-col gap-2.5">
                <a
                  href={`mailto:${CONTACT.EMAIL}`}
                  className="text-[14px] text-black/80 hover:text-black font-medium transition-colors duration-150"
                  data-testid="link-footer-email"
                >
                  {CONTACT.EMAIL}
                </a>
                <a
                  href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("whatsappFooter"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick("footer_contact")}
                  className="text-[14px] text-black/80 hover:text-black font-medium transition-colors duration-150"
                  data-testid="link-footer-whatsapp-contact"
                >
                  {CONTACT.WHATSAPP_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/40 pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <a
              href={SOCIAL.TRUSTPILOT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-100 transition-opacity"
              data-testid="link-trustpilot-footer"
            >
              <img src="/img/partner-trustpilot.webp" alt={t("footer.trustpilotAlt")} width={200} height={80} className="h-16 sm:h-20 w-auto object-contain opacity-95 brightness-0" loading="lazy" data-testid="img-trustpilot-footer" />
            </a>
          </div>
          <NewsletterSignup />
        </div>

        <div className="border-t border-white/40 pt-6 pb-6 flex flex-col items-center gap-2">
          <button
            onClick={() => clearCookieConsent()}
            className="text-[12px] text-black/30 hover:text-black/60 transition-colors cursor-pointer underline underline-offset-2"
            data-testid="footer-configure-cookies"
          >
            {t("footer.configureCookies")}
          </button>
          <p className="text-[12px] text-black/30 text-center">
            &copy; {new Date().getFullYear()} {BRAND.NAME} LLC &middot; {t("footer.copyright")}
          </p>
        </div>

        </div>
        </div>
      </div>
    </footer>
  );
}
