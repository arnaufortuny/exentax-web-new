import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";

export default function DisclaimerPage() {
  const { t } = useTranslation();
  return (
    <article><SEO title={t("legal.disclaimer.seoTitle")} description={t("legal.disclaimer.seoDescription")} path="/legal/disclaimer" keywords={t("legal.disclaimer.seoKeywords")} />
      <LegalLayout title={t("legal.disclaimer.title")} pdfHref={LEGAL_DOCS.DISCLAIMER}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.disclaimer.body")) }} />
      </LegalLayout></article>
  );
}
