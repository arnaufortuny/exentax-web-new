import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";

export default function PrivacidadPage() {
  const { t } = useTranslation();
  return (
    <article><SEO title={t("legal.privacidad.seoTitle")} description={t("legal.privacidad.seoDescription")} path="/legal/privacidad" keywords={t("legal.privacidad.seoKeywords")} breadcrumbs={[{ name: t("legal.privacidad.seoTitle"), path: "/legal/privacidad" }]} />
      <LegalLayout title={t("legal.privacidad.title")} pdfHref={LEGAL_DOCS.PRIVACIDAD}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.privacidad.body")) }} />
      </LegalLayout></article>
  );
}
