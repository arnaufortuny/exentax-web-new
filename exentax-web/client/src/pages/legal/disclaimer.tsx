import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";

export default function DisclaimerPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  return (
    <article><SEO title={t("legal.disclaimer.seoTitle")} description={t("legal.disclaimer.seoDescription")} path={lp("legal_disclaimer")} keywords={t("legal.disclaimer.seoKeywords")} breadcrumbs={[{ name: t("legal.disclaimer.seoTitle"), path: lp("legal_disclaimer") }]} />
      <LegalLayout title={t("legal.disclaimer.title")} pdfHref={LEGAL_DOCS.DISCLAIMER}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.disclaimer.body")) }} />
      </LegalLayout></article>
  );
}
