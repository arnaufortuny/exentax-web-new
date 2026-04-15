import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";

export default function TerminosPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  return (
    <article><SEO title={t("legal.terminos.seoTitle")} description={t("legal.terminos.seoDescription")} path={lp("legal_terms")} keywords={t("legal.terminos.seoKeywords")} breadcrumbs={[{ name: t("legal.terminos.seoTitle"), path: lp("legal_terms") }]} />
      <LegalLayout title={t("legal.terminos.title")} pdfHref={LEGAL_DOCS.TERMINOS}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.terminos.body")) }} />
      </LegalLayout></article>
  );
}
