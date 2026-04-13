import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { CONTACT } from "@/lib/constants";
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
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${S}/#webpage`,
      "url": S,
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
        `${S}/servicios`,
        `${S}/agendar-asesoria`,
        `${S}/sobre-las-llc`,
        `${S}/como-trabajamos`,
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": t("homePage.jsonLd.itemListName"),
      "description": t("homePage.jsonLd.itemListDesc"),
      "numberOfItems": 3,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t("homePage.jsonLd.service1"), "url": `${S}/servicios` },
        { "@type": "ListItem", "position": 2, "name": t("homePage.jsonLd.service2"), "url": `${S}/servicios` },
        { "@type": "ListItem", "position": 3, "name": t("homePage.jsonLd.service3"), "url": `${S}/servicios` },
      ],
    },
  ];
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "es").split("-")[0];
  const homeJsonLd = useHomeJsonLd(t, lang);
  return (
    <article>
      <SEO
        path="/"
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
