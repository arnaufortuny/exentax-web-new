import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";

export default function PrivacidadPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  return (
    <article><SEO title={t("legal.privacidad.seoTitle")} description={t("legal.privacidad.seoDescription")} ogTitle={t("legal.privacidad.ogTitle", { defaultValue: "" }) as string || undefined} ogDescription={t("legal.privacidad.ogDescription", { defaultValue: "" }) as string || undefined} path={lp("legal_privacy")} keywords={t("legal.privacidad.seoKeywords")} breadcrumbs={[{ name: t("legal.privacidad.seoTitle"), path: lp("legal_privacy") }]} />
      <LegalLayout title={t("legal.privacidad.title")} pdfHref={LEGAL_DOCS.PRIVACIDAD}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.privacidad.body")) }} />
      </LegalLayout></article>
  );
}
