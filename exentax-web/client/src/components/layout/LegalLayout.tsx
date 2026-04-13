import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface LegalLayoutProps {
  title: string;
  pdfHref?: string;
  children: ReactNode;
}

export default function LegalLayout({ title, pdfHref, children }: LegalLayoutProps) {
  const { t } = useTranslation();
  return (
    <section className="pt-10 lg:pt-14 pb-20 lg:pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[36px] leading-[1.15] tracking-[-0.02em] text-[var(--text-1)] text-center">
            {title}
          </h1>
        </div>

        {pdfHref && (
          <div className="flex justify-center mb-8">
            <a
              href={pdfHref}
              download
              className="inline-flex items-center gap-2 bg-[rgba(0,229,16,0.08)] text-[#00E510] hover:bg-[rgba(0,229,16,0.16)] border border-[#00E510]/20 rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
              data-testid="link-download-pdf"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t("legal.downloadPdf")}
            </a>
          </div>
        )}

        <div className="space-y-10 text-[var(--text-2)] text-base leading-relaxed legal-content">
          {children}
        </div>
      </div>
    </section>
  );
}
