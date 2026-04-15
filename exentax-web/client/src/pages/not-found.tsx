import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";

export default function NotFound() {
  const { t } = useTranslation();
  const lp = useLangPath();

  return (
    <><SEO title={t("notFound.title")} noindex /><div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-heading text-6xl font-bold text-[#00E510] mb-4" data-testid="text-404">404</p>
          <h1 className="font-heading font-bold text-3xl text-[var(--text-1)] mb-4" data-testid="text-not-found-title">
            {t("notFound.title")}
          </h1>
          <p className="text-[var(--text-2)] mb-8 max-w-md mx-auto" data-testid="text-not-found-desc">
            {t("notFound.desc")}
          </p>
          <Link
            href={lp("home")}
            className="inline-flex items-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-7 py-3.5 rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200"
            data-testid="link-go-home"
          >
            {t("notFound.goHome")}
          </Link>
        </div>
      </div></>
  );
}
