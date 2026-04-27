import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { useLangPath } from "@/hooks/useLangPath";
import { useFaqSections, extractText } from "./faq-data";
import FaqAccordionList from "./FaqAccordionList";
import { CONTACT } from "@/lib/constants";
import { trackWhatsAppClick } from "@/components/Tracking";


const ALL_CATEGORY = "all";

export default function FAQ({ asPage = false }: { asPage?: boolean } = {}) {
  const { t } = useTranslation();
  const allSections = useFaqSections();
  const ref = useReveal();
  const lp = useLangPath();
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const tabsRef = useRef<HTMLDivElement>(null);

  const searchTerm = search.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    let sections = allSections;

    if (activeCategory !== ALL_CATEGORY) {
      sections = sections.filter((s) => s.icon === activeCategory);
    }

    if (searchTerm) {
      sections = sections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (faq) =>
              faq.q.toLowerCase().includes(searchTerm) ||
              extractText(faq.a).toLowerCase().includes(searchTerm)
          ),
        }))
        .filter((section) => section.items.length > 0);
    }

    return sections;
  }, [allSections, searchTerm, activeCategory]);

  const totalResults = searchTerm
    ? filteredSections.reduce((sum, s) => sum + s.items.length, 0)
    : 0;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setOpenItem(null);
    setSearch("");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const openFromHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (!raw) return;
      const id = decodeURIComponent(raw);
      const match = allSections.find((s) => id.startsWith(`${s.icon}_`));
      if (!match) return;
      setActiveCategory(ALL_CATEGORY);
      setSearch("");
      setOpenItem(id);
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-testid="faq-item-${id}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [allSections]);

  const getSectionTitle = useCallback((icon: string) => {
    const key = `faqUI.sectionTitles.${icon}` as const;
    const translated = t(key);
    return translated !== key ? translated : allSections.find(s => s.icon === icon)?.title || icon;
  }, [t, allSections]);

  const getCategoryLabel = useCallback((icon: string) => {
    const key = `faqUI.categories.${icon}` as const;
    const translated = t(key);
    return translated !== key ? translated : allSections.find(s => s.icon === icon)?.title || icon;
  }, [t, allSections]);

  return (
    <section id="faq" className="section-padding bg-[var(--bg-0)]" ref={ref}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${asPage ? "text-center" : ""}`}>
        <div className={`reveal mb-10 ${asPage ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}`}>
          {asPage ? (
            <>
              <h1 className="display-wise text-[var(--text-1)] mb-4">
                {t("faqUI.pageTitle")}
              </h1>
              <p className="text-[var(--text-2)] text-base sm:text-lg leading-relaxed">
                {t("faqUI.pageSubtitle")}
              </p>
            </>
          ) : (
            <div className="text-center">
              <h2 className="font-heading font-bold text-[28px] sm:text-4xl leading-[1.12] tracking-[-0.025em] text-[var(--text-1)] max-w-[700px] mx-auto">
                {t("faqUI.sectionTitle")}{" "}
                <br className="hidden sm:block" />
                <span className="inline-block text-[var(--green)]">
                  {t("faqUI.sectionTitleAccent")}
                </span>
              </h2>
            </div>
          )}
        </div>

        <div>
          <div className={`relative mb-6 reveal ${asPage ? "max-w-2xl mx-auto" : "max-w-2xl mx-auto"}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[rgba(0,229,16,0.10)] via-[rgba(0,229,16,0.03)] to-[rgba(0,229,16,0.10)] blur-[10px] opacity-60 pointer-events-none" aria-hidden="true" />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none z-10" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenItem(null); }}
              placeholder={t("faqUI.searchPlaceholder")}
              className="glass relative w-full pl-11 pr-10 py-3 rounded-full ring-1 ring-inset ring-[rgba(0,229,16,0.18)] text-[var(--text-1)] placeholder-[var(--text-3)] text-sm font-body shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_24px_-12px_rgba(0,229,16,0.18)] focus:outline-none focus:ring-[rgba(0,229,16,0.35)] transition-colors duration-200"
              data-testid="input-faq-search"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setActiveCategory(ALL_CATEGORY); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200 z-10"
                aria-label={t("faqUI.clearSearch")}
                data-testid="button-faq-clear"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>

          <div
            ref={tabsRef}
            className={`flex flex-nowrap gap-2 mb-8 reveal overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory ${asPage ? "sm:justify-center max-w-full mx-auto" : "sm:justify-center"}`}
            role="tablist"
            aria-label={t("faqUI.allCategories")}
          >
            <button
              role="tab"
              aria-selected={activeCategory === ALL_CATEGORY}
              onClick={() => handleCategoryChange(ALL_CATEGORY)}
              className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 whitespace-nowrap ${
                activeCategory === ALL_CATEGORY
                  ? "bg-[var(--green)] text-[#0B0D0C] shadow-[0_8px_24px_-10px_rgba(0,229,16,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                  : "text-[var(--text-1)] bg-white border border-[rgba(11,13,12,0.18)] hover:bg-[rgba(0,229,16,0.06)] hover:border-[rgba(0,229,16,0.55)] hover:text-[var(--green-hover)] shadow-[0_1px_2px_rgba(11,13,12,0.06)]"
              }`}
              data-testid="faq-tab-all"
            >
              {t("faqUI.allCategories")}
            </button>
            {allSections.map((section) => (
              <button
                key={section.icon}
                role="tab"
                aria-selected={activeCategory === section.icon}
                onClick={() => handleCategoryChange(section.icon)}
                className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-body font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeCategory === section.icon
                    ? "bg-[var(--green)] text-[#0B0D0C] shadow-[0_8px_24px_-10px_rgba(0,229,16,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                    : "text-[var(--text-1)] bg-white border border-[rgba(11,13,12,0.18)] hover:bg-[rgba(0,229,16,0.06)] hover:border-[rgba(0,229,16,0.55)] hover:text-[var(--green-hover)] shadow-[0_1px_2px_rgba(11,13,12,0.06)]"
                }`}
                data-testid={`faq-tab-${section.icon}`}
              >
                {getCategoryLabel(section.icon)}
              </button>
            ))}
          </div>

          {searchTerm && totalResults > 0 && (
            <p className="text-sm text-[var(--text-3)] mb-6 font-body">
              {t("faqUI.resultsFound", { count: totalResults })}
            </p>
          )}

          {searchTerm && totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-[var(--text-2)] text-base mb-2">
                {t("faqUI.noResults", { term: search })}
              </p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(ALL_CATEGORY); }}
                className="text-[var(--green)] hover:text-[var(--green-hover)] font-body font-semibold text-sm transition-colors"
                data-testid="button-faq-show-all"
              >
                {t("faqUI.showAll")}
              </button>
            </div>
          )}

          {filteredSections.length === 0 && !searchTerm && (
            <div className="py-12 text-center text-[var(--text-2)]">
              {t("faqUI.emptyCategory")}
            </div>
          )}

          <div className={`space-y-16 pb-8 ${asPage ? "max-w-3xl mx-auto text-left" : ""}`}>
            {filteredSections.map((section, si) => (
              <div key={section.icon} className="reveal">
                <div className="flex items-center gap-3 mb-6">
                  {asPage ? (
                    <h2 className="section-h2">
                      {getSectionTitle(section.icon)}
                    </h2>
                  ) : (
                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--text-1)]">
                      {getSectionTitle(section.icon)}
                    </h3>
                  )}
                </div>
                <FaqAccordionList
                  testIdPrefix="faq"
                  answerExtraClass="text-left"
                  openId={openItem}
                  onToggle={(id) => setOpenItem(openItem === id ? null : id)}
                  items={section.items.map((faq, fi) => ({
                    id: `${section.icon}_${fi}`,
                    question: faq.q,
                    answer: (
                      <>
                        {faq.a}
                        <div className="mt-5 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-body font-semibold text-[var(--green-hover)] bg-[rgba(0,229,16,0.08)] ring-1 ring-inset ring-[rgba(0,229,16,0.25)]">
                          {t("faqUI.expertBadge")}
                        </div>
                      </>
                    ),
                  }))}
                />
              </div>
            ))}
          </div>

          {asPage && (
            <div className="mt-20 reveal max-w-3xl mx-auto">
              <div className="glass relative overflow-hidden rounded-3xl px-6 sm:px-10 py-10 sm:py-12 text-center ring-1 ring-inset ring-[rgba(0,229,16,0.22)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_-30px_rgba(0,229,16,0.45)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,229,16,0.10)] via-transparent to-[rgba(0,229,16,0.06)] pointer-events-none" aria-hidden="true" />
                <div className="relative">
                  <h2 className="section-h2 mb-3" data-testid="text-faq-final-cta-title">
                    {t("faqUI.finalCta.title")}
                  </h2>
                  <p className="text-[var(--text-2)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-7">
                    {t("faqUI.finalCta.desc")}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <Link
                      href={lp("booking")}
                      className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
                      data-testid="button-faq-final-cta-booking"
                    >
                      {t("faqUI.finalCta.button")}
                    </Link>
                    <a
                      href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("faqUI.finalCta.whatsapp"))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick("faq_final_cta")}
                      className="inline-flex items-center justify-center btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full whitespace-nowrap w-full sm:w-auto"
                      data-testid="button-faq-final-cta-whatsapp"
                    >
                      {t("faqUI.finalCta.whatsapp")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
