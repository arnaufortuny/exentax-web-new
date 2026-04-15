import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";

import FAQ from "@/components/sections/FAQ";
import { useFaqSections, extractText } from "@/components/sections/faq-data";

export default function FAQPage() {
  const { t } = useTranslation();
  const lp = useLangPath();
  const allSections = useFaqSections();
  const faqJsonLd = useMemo(() => {
    const allItems = allSections.flatMap(s => s.items);
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allItems.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": extractText(item.a),
        },
      })),
    };
  }, [allSections]);

  return (
    <article>
      <SEO
        title={t("faqPage.seoTitle")}
        description={t("faqPage.seoDesc")}
        keywords={t("faqPage.seoKeywords")}
        path={lp("faq")}
        jsonLd={faqJsonLd}
        breadcrumbs={[{ name: t("faqPage.seoTitle"), path: lp("faq") }]}
      />
      <FAQ asPage />
    </article>
  );
}
