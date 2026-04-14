import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReveal } from "@/hooks/useReveal";
import { useFaqSections, sectionIcons, extractText } from "./faq-data";
import AccordionItem from "./AccordionItem";

const ALL_CATEGORY = "all";

export default function FAQ({ asPage = false }: { asPage?: boolean } = {}) {
  const { t } = useTranslation();
  const allSections = useFaqSections();
  const ref = useReveal();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 max-w-3xl">
          {asPage ? (
            <>
              <span className="text-[13px] uppercase tracking-[0.2em] font-body font-semibold text-[#00E510] mb-4 block">
                {t("faqUI.sectionLabel")}
              </span>
              <h1 className="font-heading font-bold text-[28px] sm:text-[clamp(36px,3.5vw,44px)] leading-[1.1] tracking-[-0.025em] text-[var(--text-1)] mb-4">
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
                <span className="relative inline-block text-[#00E510]">
                  {t("faqUI.sectionTitleAccent")}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" height="10">
                    <path className="draw-path" d="M2 8 C30 2, 50 10, 80 5 S130 2, 160 7 S190 4, 198 6" stroke="#00E510" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
              </h2>
            </div>
          )}
        </div>

        <div>
          <div className="relative mb-6 reveal max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={11} cy={11} r={8} /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenItem(null); }}
              placeholder={t("faqUI.searchPlaceholder")}
              className="w-full pl-11 pr-10 py-3 rounded-full border-[1.5px] border-[rgba(0,229,16,0.3)] bg-transparent text-[var(--text-1)] placeholder-[var(--text-3)] text-sm font-body focus:outline-none focus:border-[#00E510] focus:shadow-[0_0_8px_rgba(0,229,16,0.2)] transition-all duration-200"
              data-testid="input-faq-search"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setActiveCategory(ALL_CATEGORY); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors duration-200"
                aria-label={t("faqUI.clearSearch")}
                data-testid="button-faq-clear"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          </div>

          <div
            ref={tabsRef}
            className="flex gap-2 flex-wrap mb-8 reveal"
            role="tablist"
            aria-label={t("faqUI.allCategories")}
          >
            <button
              role="tab"
              aria-selected={activeCategory === ALL_CATEGORY}
              onClick={() => handleCategoryChange(ALL_CATEGORY)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-150 ${
                activeCategory === ALL_CATEGORY
                  ? "bg-[#00E510] text-[#0B0D0C]"
                  : "bg-transparent text-[var(--text-3)] border border-[var(--border)] hover:border-[var(--text-3)] hover:text-[var(--text-2)]"
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
                className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-150 ${
                  activeCategory === section.icon
                    ? "bg-[#00E510] text-[#0B0D0C]"
                    : "bg-transparent text-[var(--text-3)] border border-[var(--border)] hover:border-[var(--text-3)] hover:text-[var(--text-2)]"
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
                className="text-[#00E510] hover:text-[#2FC10E] font-body font-semibold text-sm transition-colors"
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

          <div className="space-y-12">
            {filteredSections.map((section, si) => (
              <div key={section.icon} className="reveal">
                <div className="flex items-center gap-3 mb-6">
                  {sectionIcons[section.icon] && (
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-[rgba(0,229,16,0.08)] flex items-center justify-center" aria-hidden="true">
                      {sectionIcons[section.icon]}
                    </span>
                  )}
                  {asPage ? (
                    <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--text-1)]">
                      {getSectionTitle(section.icon)}
                    </h2>
                  ) : (
                    <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[var(--text-1)]">
                      {getSectionTitle(section.icon)}
                    </h3>
                  )}
                </div>
                <div className="space-y-0">
                  {section.items.map((faq, fi) => {
                    const id = `${si}-${fi}`;
                    return (
                      <AccordionItem
                        key={id}
                        id={id}
                        question={faq.q}
                        isOpen={openItem === id}
                        onToggle={() => setOpenItem(openItem === id ? null : id)}
                        testIdPrefix="faq"
                        variant="flat"
                      >
                        <div className="pb-5 text-[var(--text-2)] text-base leading-relaxed">
                          {faq.a}
                        </div>
                      </AccordionItem>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
