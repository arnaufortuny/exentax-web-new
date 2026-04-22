import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";

export default function NotFound() {
  const { t } = useTranslation();
  const lp = useLangPath();

  const quickLinks: Array<{ key: "our_services" | "how_we_work" | "about_llc" | "faq" | "book"; label: string }> = [
    { key: "our_services", label: t("nav.services") },
    { key: "how_we_work", label: t("nav.howWeWork") },
    { key: "about_llc", label: t("nav.aboutLlc") },
    { key: "faq", label: t("nav.faq") },
    { key: "book", label: t("nav.bookConsultation") },
  ];

  return (
    <>
      <SEO title={t("notFound.title")} noindex />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="font-heading text-7xl md:text-8xl font-bold text-[#00E510] mb-4" data-testid="text-404">
            404
          </p>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[var(--text-1)] mb-4" data-testid="text-not-found-title">
            {t("notFound.title")}
          </h1>
          <p className="text-[var(--text-2)] mb-8 max-w-md mx-auto leading-relaxed" data-testid="text-not-found-desc">
            {t("notFound.desc")}
          </p>
          <Link
            href={lp("home")}
            className="inline-flex items-center btn-primary px-7 py-3.5 rounded-full mb-10"
            data-testid="link-go-home"
          >
            {t("notFound.goHome")}
          </Link>
          <nav aria-label={t("notFound.helpfulLinks")} className="border-t border-[var(--border-subtle)] pt-8">
            <p className="text-sm font-semibold text-[var(--text-3)] mb-4 uppercase tracking-wide">
              {t("notFound.exploreLabel")}
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {quickLinks.map((q) => (
                <li key={q.key}>
                  <Link
                    href={lp(q.key)}
                    className="text-[var(--text-2)] hover:text-[#00B70D] underline-offset-4 hover:underline transition-colors min-h-[44px] inline-flex items-center"
                    data-testid={`link-not-found-${q.key}`}
                  >
                    {q.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={lp("/blog")}
                  className="text-[var(--text-2)] hover:text-[#00B70D] underline-offset-4 hover:underline transition-colors min-h-[44px] inline-flex items-center"
                  data-testid="link-not-found-blog"
                >
                  {t("nav.blog")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
