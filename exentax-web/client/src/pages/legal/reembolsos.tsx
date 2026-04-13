import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";

export default function ReembolsosPage() {
  const { t } = useTranslation();
  return (
    <article><SEO title={t("legal.reembolsos.seoTitle")} description={t("legal.reembolsos.seoDescription")} path="/legal/reembolsos" keywords={t("legal.reembolsos.seoKeywords")} />
      <LegalLayout title={t("legal.reembolsos.title")} pdfHref={LEGAL_DOCS.REEMBOLSOS}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.reembolsos.body")) }} />
      </LegalLayout></article>
  );
}
