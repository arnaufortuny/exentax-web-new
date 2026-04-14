import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";

export default function CookiesPage() {
  const { t } = useTranslation();
  return (
    <article><SEO title={t("legal.cookies.seoTitle")} description={t("legal.cookies.seoDescription")} path="/legal/cookies" keywords={t("legal.cookies.seoKeywords")} breadcrumbs={[{ name: t("legal.cookies.seoTitle"), path: "/legal/cookies" }]} />
      <LegalLayout title={t("legal.cookies.title")} pdfHref={LEGAL_DOCS.COOKIES}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.cookies.body")) }} />
      </LegalLayout></article>
  );
}
