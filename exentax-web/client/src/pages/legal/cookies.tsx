import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import LegalLayout from "@/components/layout/LegalLayout";
import { sanitizeHtml } from "@/lib/sanitize";
import { LEGAL_DOCS } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";

export default function CookiesPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  return (
    <article><SEO title={t("legal.cookies.seoTitle")} description={t("legal.cookies.seoDescription")} ogTitle={t("legal.cookies.ogTitle", { defaultValue: "" }) as string || undefined} ogDescription={t("legal.cookies.ogDescription", { defaultValue: "" }) as string || undefined} path={lp("legal_cookies")} keywords={t("legal.cookies.seoKeywords")} breadcrumbs={[{ name: t("legal.cookies.seoTitle"), path: lp("legal_cookies") }]} />
      <LegalLayout title={t("legal.cookies.title")} pdfHref={LEGAL_DOCS.COOKIES}>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(t("legal.cookies.body")) }} />
      </LegalLayout></article>
  );
}
