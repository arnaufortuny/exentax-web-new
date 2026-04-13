import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";

export default function TerminosPage() {
  const { t } = useTranslation();
  return (
    <article><SEO title={t("legal.terminos.seoTitle")} description={t("legal.terminos.seoDescription")} path="/legal/terminos" keywords={t("legal.terminos.seoKeywords")} />
      <LegalLayout title={t("legal.terminos.title")} pdfHref={LEGAL_DOCS.TERMINOS}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.terminos.body")) }} />
      </LegalLayout></article>
  );
}
