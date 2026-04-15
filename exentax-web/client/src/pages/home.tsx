import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { getLocalizedPath, type SupportedLang } from "@/lib/routes";
import Hero from "@/components/sections/Hero";
import BanksCarousel from "@/components/sections/BanksCarousel";
import Problem from "@/components/sections/Problem";

import ForWho from "@/components/sections/ForWho";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyUs from "@/components/sections/WhyUs";
import Origin from "@/components/sections/Origin";
import HomeFAQ from "@/components/sections/HomeFAQ";

function useHomeJsonLd(t: (key: string) => string, lang: string) {
  const S = CONTACT.SITE_URL;
  const l = lang as SupportedLang;
  const lp = (key: Parameters<typeof getLocalizedPath>[0]) => `${S}${getLocalizedPath(key, l)}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${S}/#webpage`,
      "url": lp("home"),
      "name": t("homePage.jsonLd.webPageName"),
      "description": t("homePage.jsonLd.webPageDesc"),
      "isPartOf": { "@id": `${S}/#website` },
      "about": { "@id": `${S}/#organization` },
      "inLanguage": lang,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".hero-desc", "p"],
      },
      "significantLink": [
        lp("our_services"),
        lp("book"),
        lp("about_llc"),
        lp("how_we_work"),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": t("homePage.jsonLd.itemListName"),
      "description": t("homePage.jsonLd.itemListDesc"),
      "numberOfItems": 3,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t("homePage.jsonLd.service1"), "url": lp("our_services") },
        { "@type": "ListItem", "position": 2, "name": t("homePage.jsonLd.service2"), "url": lp("our_services") },
        { "@type": "ListItem", "position": 3, "name": t("homePage.jsonLd.service3"), "url": lp("our_services") },
      ],
    },
  ];
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "es").split("-")[0];
  const lp = useLangPath();
  const homeJsonLd = useHomeJsonLd(t, lang);
  return (
    <article>
      <SEO
        path={lp("home")}
        title={t("homePage.seoTitle")}
        description={t("homePage.seoDesc")}
        keywords={t("homePage.seoKeywords")}
        jsonLd={homeJsonLd}
      />
      <Hero />
      <BanksCarousel />
      <Problem />
      <ForWho />
      <HowItWorks />
      <Services />
      <WhyUs />
      <Origin />
      <HomeFAQ />
    </article>
  );
}
