import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useLangPath } from "@/hooks/useLangPath";
import { BRAND } from "@/lib/constants";

export default function NavbarFunnel() {
  const { t } = useTranslation();
  const lp = useLangPath();

  return (
    <header className="fixed left-0 right-0 z-50 px-4 sm:px-6" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}>
      <div className="max-w-7xl mx-auto h-[72px] bg-[rgba(255,255,255,0.82)] backdrop-blur-[16px] border border-[rgba(0,0,0,0.06)] rounded-[20px] px-6 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

        <Link href={lp("home")} data-testid="link-funnel-home" className="flex items-center justify-center flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#00E510] focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-md">
          <img src="/logo-tight.png" alt={BRAND.NAME} width={600} height={110} className="w-[148px] h-auto object-contain block" fetchPriority="high" loading="eager" decoding="async" data-testid="img-logo-funnel" />
        </Link>

        <div className="flex-1" />

        <Link
          href={lp("book")}
          data-testid="link-funnel-consultation"
          className="inline-flex items-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-black px-6 py-3 text-[13px] rounded-full shadow-[0_10px_30px_rgba(0,229,16,0.18)] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 active:scale-95 whitespace-nowrap"
        >
          {t("nav.freeConsultation")}
        </Link>

      </div>
    </header>
  );
}
