import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import SEO from "@/components/SEO";
import { useLangPath } from "@/hooks/useLangPath";
import { useReveal } from "@/hooks/useReveal";
import { trackWhatsAppClick } from "@/components/Tracking";
import { WhatsAppIcon } from "@/components/icons";
import FaqAccordionList from "@/components/sections/FaqAccordionList";
import { type RouteKey } from "@shared/routes";

interface FaqItem { q: string; a: string }
interface FeatureItem { title: string; desc: string }
interface ComparisonRow { label: string; values: string[] }

export interface ServiceSubpageProps {
  routeKey: RouteKey;
  i18nKey: string;
  trackingKey: string;
}

function GreenCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 48 48" fill="none" className="flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 24.5l5.2 5.2L32 19.4" stroke="#4CAF50" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function ServiceSubpage({ routeKey, i18nKey, trackingKey }: ServiceSubpageProps) {
  const { t } = useTranslation();
  const lp = useLangPath();
  const heroRef = useReveal();

  const k = (suffix: string) => `${i18nKey}.${suffix}`;
  const arr = <T,>(suffix: string): T[] => {
    const v = t(k(suffix), { returnObjects: true }) as unknown;
    return Array.isArray(v) ? (v as T[]) : [];
  };

  const features = arr<FeatureItem>("features.items");
  const bestFor = arr<string>("bestFor.items");
  const includes = arr<string>("whatsIncluded.items");
  const faqItems = arr<FaqItem>("faq.items");

  const cmpColumns = arr<string>("comparison.columns");
  const cmpRows = arr<ComparisonRow>("comparison.rows");
  const cmpHighlightRaw = t(k("comparison.highlightCol"), { defaultValue: "" });
  const cmpHighlight = typeof cmpHighlightRaw === "number"
    ? cmpHighlightRaw
    : Number.parseInt(String(cmpHighlightRaw), 10);
  const cmpNote = t(k("comparison.note"), { defaultValue: "" }) as string;
  const cmpYouLabel = t(k("comparison.youLabel"), { defaultValue: "" }) as string;
  const cmpCompareLabel = t(k("comparison.compareLabel"), { defaultValue: "" }) as string;
  // 4-column comparisons (the LLC pages) render an interactive 2-pane comparator
  // instead of a wide table: left pill is locked to this page's state, right pill
  // lets the visitor pick any of the other 3 to compare side-by-side.
  const isLlcComparator =
    cmpColumns.length === 4 &&
    Number.isFinite(cmpHighlight) &&
    cmpHighlight >= 0 &&
    cmpHighlight < cmpColumns.length;

  const seoTitle = t(k("seo.title"));
  const seoDesc = t(k("seo.description"));
  const seoKeywords = t(k("seo.keywords"));
  const seoOgTitle = t(k("seo.ogTitle"), { defaultValue: "" }) as string;
  const seoOgDesc = t(k("seo.ogDescription"), { defaultValue: "" }) as string;
  const breadcrumbName = t(k("breadcrumb"));

  // Task #14 (GEO): we emit a `ProfessionalService` (a more specific schema.org
  // type than `Service`) and reference the canonical Organization node defined
  // in `client/index.html` via `provider.@id`. This keeps a single
  // Organization entity across the graph so AI engines and Google merge the
  // signals (aggregateRating, sameAs, knowsAbout, contactPoint) onto the same
  // brand instead of treating every service page as a stand-alone vendor.
  const serviceJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Service", "ProfessionalService"],
    name: t(k("jsonLd.name")),
    serviceType: t(k("jsonLd.serviceType")),
    provider: { "@id": `${CONTACT.SITE_URL}/#organization` },
    brand: { "@id": `${CONTACT.SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Non-resident freelancers, autonomos, digital nomads, SaaS founders, e-commerce sellers and online businesses",
    },
    description: seoDesc,
    url: `${CONTACT.SITE_URL}${lp(routeKey)}`,
    inLanguage: lp(routeKey).split("/")[1] || "es",
  };

  const faqJsonLd: Record<string, unknown> | null = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  return (
    <article data-page={`service-${trackingKey}`} className="bg-[var(--bg-0)]">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        ogTitle={seoOgTitle || undefined}
        ogDescription={seoOgDesc || undefined}
        path={lp(routeKey)}
        breadcrumbs={[
          { name: t("nav.services"), path: lp("our_services") },
          { name: breadcrumbName, path: lp(routeKey) },
        ]}
        jsonLd={faqJsonLd ? [serviceJsonLd, faqJsonLd] : serviceJsonLd}
      />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ paddingBottom: 96 }}>
        <div ref={heroRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-10 sm:pt-16 lg:pt-24">
          <div className="text-center mx-auto reveal" style={{ maxWidth: 980 }}>
            <h1 className="display-wise text-black mb-4" data-testid={`heading-${trackingKey}-hero`}>
              {t(k("hero.h1"))}
            </h1>
            <p
              className="font-heading mx-auto mb-7"
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.35rem)",
                lineHeight: 1.2,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                maxWidth: 760,
                color: "#00E510",
                textWrap: "balance" as never,
              }}
              data-testid={`tagline-${trackingKey}-hero`}
            >
              {t(k("hero.h1green"))}
            </p>
            <p
              className="font-body text-black/75 mx-auto mb-10"
              style={{ fontSize: "clamp(1rem, 1.4vw, 1.25rem)", lineHeight: 1.55, maxWidth: 660, textWrap: "balance" as never }}
              data-testid={`subtitle-${trackingKey}-hero`}
            >
              {t(k("hero.subtitle"))}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={lp("book")}
                className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full"
                data-testid={`button-${trackingKey}-hero-agendar`}
              >
                {t(k("hero.ctaPrimary"))}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t(k("hero.waText")))}`}
                onClick={() => trackWhatsAppClick(`service_${trackingKey}_hero`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 btn-wa font-body font-semibold px-8 py-3.5 text-base rounded-full"
                data-testid={`button-${trackingKey}-hero-whatsapp`}
              >
                <WhatsAppIcon size={18} />
                {t(k("hero.ctaWhatsapp"))}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-h2" data-testid={`heading-${trackingKey}-intro`}>
              {t(k("intro.h2"))}
            </h2>
          </div>
          <div className="space-y-4 text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
            {arr<string>("intro.paragraphs").map((p, i) => (
              <p key={i} data-testid={`text-${trackingKey}-intro-${i}`}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      {features.length > 0 && (
        <section className="section-padding">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-h2" data-testid={`heading-${trackingKey}-features`}>
                {t(k("features.h2"))}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass-card p-6"
                  data-testid={`card-${trackingKey}-feature-${i}`}
                >
                  <h3 className="font-heading font-bold text-[17px] sm:text-[18px] mb-2 text-black">{f.title}</h3>
                  <p className="text-[14px] sm:text-[15px] text-black/75 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best for + What's included (two columns on desktop) */}
      {(bestFor.length > 0 || includes.length > 0) && (
        <section className="section-padding">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {bestFor.length > 0 && (
                <div data-testid={`block-${trackingKey}-bestfor`}>
                  <h2 className="section-h2 mb-6" data-testid={`heading-${trackingKey}-bestfor`}>
                    {t(k("bestFor.h2"))}
                  </h2>
                  <ul className="space-y-3">
                    {bestFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-3" data-testid={`item-${trackingKey}-bestfor-${i}`}>
                        <GreenCheck />
                        <span className="text-[15px] sm:text-base text-black/85 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {includes.length > 0 && (
                <div data-testid={`block-${trackingKey}-includes`}>
                  <h2 className="section-h2 mb-6" data-testid={`heading-${trackingKey}-includes`}>
                    {t(k("whatsIncluded.h2"))}
                  </h2>
                  <ul className="space-y-3">
                    {includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3" data-testid={`item-${trackingKey}-includes-${i}`}>
                        <GreenCheck />
                        <span className="text-[15px] sm:text-base text-black/85 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Comparison */}
      {cmpColumns.length > 0 && cmpRows.length > 0 && (
        <section className="section-padding" data-testid={`block-${trackingKey}-comparison`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="section-h2 mb-4" data-testid={`heading-${trackingKey}-comparison`}>
                {t(k("comparison.h2"))}
              </h2>
              <p className="max-w-[680px] mx-auto text-base lg:text-lg text-[var(--text-2)] leading-relaxed">
                {t(k("comparison.intro"))}
              </p>
            </div>
            {isLlcComparator ? (
              <LlcStateComparator
                trackingKey={trackingKey}
                columns={cmpColumns}
                rows={cmpRows}
                fixedIndex={cmpHighlight}
                youLabel={cmpYouLabel || "This page"}
                compareLabel={cmpCompareLabel || "Compare with"}
              />
            ) : (
            <div>
              {/* Mobile: stacked cards (one per comparison column) */}
              <div className="sm:hidden space-y-4" data-testid={`comparator-mobile-${trackingKey}`}>
                {cmpColumns.map((col, ci) => {
                  const isHl = ci === cmpHighlight;
                  return (
                    <div
                      key={ci}
                      className={`glass-strong rounded-[var(--radius-lg)] p-5 ${isHl ? "ring-2 ring-[#00E510] bg-[rgba(0,229,16,0.04)]" : ""}`}
                      data-testid={`col-mobile-${trackingKey}-comparison-${ci}`}
                    >
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--glass-border-strong)]">
                        {isHl && (
                          <span aria-hidden="true" className="inline-block w-2 h-2 rounded-full bg-[#00E510] shadow-[0_0_8px_rgba(0,229,16,0.6)]" />
                        )}
                        <h3 className={`font-heading font-bold text-[16px] ${isHl ? "text-[#00E510]" : "text-black"}`}>
                          {col}
                        </h3>
                      </div>
                      <dl className="space-y-3">
                        {cmpRows.map((row, ri) => {
                          const val = row.values[ci] ?? "";
                          const parts = val.split(" — ");
                          const primary = parts[0];
                          const detail = parts.length > 1 ? parts.slice(1).join(" — ") : null;
                          return (
                            <div key={ri} data-testid={`row-mobile-${trackingKey}-comparison-${ci}-${ri}`}>
                              <dt className="text-[12px] font-body text-black/55 uppercase tracking-[0.06em]">
                                {row.label}
                              </dt>
                              <dd className={`mt-1 text-[14px] leading-snug ${isHl ? "font-semibold text-black" : "font-medium text-black/85"}`}>
                                {primary}
                              </dd>
                              {detail && (
                                <dd className="mt-0.5 text-[12px] leading-snug text-black/55">
                                  {detail}
                                </dd>
                              )}
                            </div>
                          );
                        })}
                      </dl>
                    </div>
                  );
                })}
              </div>
              {/* Tablet/Desktop: original table */}
              <div className="hidden sm:block glass-strong rounded-[var(--radius-lg)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left text-[14px] sm:text-[15px]">
                  <thead>
                    <tr className="bg-[rgba(0,0,0,0.025)]">
                      <th className="px-5 py-4 font-heading text-[12px] tracking-[0.12em] uppercase text-black/55 border-b border-[var(--glass-border-strong)]" />
                      {cmpColumns.map((col, i) => {
                        const isHl = i === cmpHighlight;
                        return (
                          <th
                            key={i}
                            scope="col"
                            className={`px-5 py-4 font-heading font-bold text-[15px] sm:text-[16px] border-b border-[var(--glass-border-strong)] ${isHl ? "text-[#00E510] bg-[rgba(0,229,16,0.10)]" : "text-black"}`}
                            data-testid={`col-${trackingKey}-comparison-${i}`}
                          >
                            <span className="inline-flex items-center gap-2">
                              {isHl && (
                                <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E510] shadow-[0_0_8px_rgba(0,229,16,0.6)]" />
                              )}
                              {col}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {cmpRows.map((row, ri) => {
                      const isLast = ri === cmpRows.length - 1;
                      const cellBorder = isLast ? "" : "border-b border-[var(--glass-border-strong)]";
                      const zebra = ri % 2 === 1 ? "bg-black/[0.015]" : "";
                      return (
                        <tr key={ri} className={`align-top ${zebra}`} data-testid={`row-${trackingKey}-comparison-${ri}`}>
                          <th scope="row" className={`px-5 py-4 font-body font-semibold text-[14px] sm:text-[15px] text-black/85 ${cellBorder}`}>
                            {row.label}
                          </th>
                          {row.values.map((val, vi) => {
                            const isHl = vi === cmpHighlight;
                            const parts = val.split(" — ");
                            const primary = parts[0];
                            const detail = parts.length > 1 ? parts.slice(1).join(" — ") : null;
                            return (
                              <td
                                key={vi}
                                className={`px-5 py-4 ${cellBorder} ${isHl ? "bg-[rgba(0,229,16,0.08)]" : ""}`}
                              >
                                <div className={`text-[14px] sm:text-[15px] leading-snug ${isHl ? "font-semibold text-black" : "font-medium text-black/85"}`}>
                                  {primary}
                                </div>
                                {detail && (
                                  <div className="mt-1 text-[12px] sm:text-[12.5px] leading-snug text-black/55">
                                    {detail}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )}
            {cmpNote && (
              <p className="mt-4 text-[12px] sm:text-[13px] text-black/60 text-center">
                {cmpNote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="section-padding">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="section-h2" data-testid={`heading-${trackingKey}-faq`}>
                {t(k("faq.h2"))}
              </h2>
            </div>
            <FaqAccordionList
              testIdPrefix={`${trackingKey}-faq`}
              items={faqItems.map((f, i) => ({
                id: `${trackingKey}-faq-${i}`,
                question: f.q,
                answer: <p className="whitespace-pre-line">{f.a}</p>,
              }))}
            />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-h2 mb-5" data-testid={`heading-${trackingKey}-cta`}>
            {t(k("cta.h2"))}
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-2)] leading-relaxed max-w-[640px] mx-auto mb-8">
            {t(k("cta.p"))}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={lp("book")}
              className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full"
              data-testid={`button-${trackingKey}-cta-agendar`}
            >
              {t(k("cta.btn"))}
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link
              href={lp("our_services")}
              className="inline-flex items-center justify-center font-body font-semibold px-8 py-3.5 text-base rounded-full border border-[var(--border)] hover:border-[var(--text-3)] text-[var(--text-1)] bg-[var(--bg-0)] transition-colors"
              data-testid={`button-${trackingKey}-cta-services`}
            >
              {t(k("cta.btnSecondary"))}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

interface LlcStateComparatorProps {
  trackingKey: string;
  columns: string[];
  rows: ComparisonRow[];
  fixedIndex: number;
  youLabel: string;
  compareLabel: string;
}

function LlcStateComparator({
  trackingKey,
  columns,
  rows,
  fixedIndex,
  youLabel,
  compareLabel,
}: LlcStateComparatorProps) {
  const otherIndices = columns.map((_, i) => i).filter((i) => i !== fixedIndex);
  const [otherIndex, setOtherIndex] = useState<number>(otherIndices[0] ?? 0);

  const renderCell = (val: string, accent: boolean) => {
    const parts = val.split(" — ");
    const primary = parts[0];
    const detail = parts.length > 1 ? parts.slice(1).join(" — ") : null;
    return (
      <div>
        <div
          className={`text-[14px] sm:text-[15px] leading-snug ${
            accent
              ? "font-semibold text-black"
              : "font-medium text-black/85"
          }`}
        >
          {primary}
        </div>
        {detail && (
          <div className="mt-1 text-[12px] sm:text-[12.5px] leading-snug text-black/55">
            {detail}
          </div>
        )}
      </div>
    );
  };

  const renderPanel = (
    stateIndex: number,
    accent: boolean,
    kicker: string,
    extraTestId: string,
  ) => (
    <div
      className={`glass-strong rounded-[var(--radius-lg)] p-6 sm:p-7 ${
        accent ? "border-t-[3px] border-t-[#00E510]" : ""
      }`}
      data-testid={`comparator-${trackingKey}-${extraTestId}`}
    >
      <div className="mb-5">
        <span className="block font-body text-[12px] sm:text-[13px] text-black/55 mb-1">
          {kicker}
        </span>
        <span className="font-heading text-[20px] sm:text-[22px] font-bold leading-tight text-black inline-flex items-center gap-2">
          {accent && (
            <span
              aria-hidden="true"
              className="inline-block w-2 h-2 rounded-full bg-[#00E510] shadow-[0_0_10px_rgba(0,229,16,0.6)]"
            />
          )}
          {columns[stateIndex]}
        </span>
      </div>
      <ul className="divide-y divide-[var(--glass-border-strong)]">
        {rows.map((row, ri) => {
          const val = row.values[stateIndex] ?? "";
          const parts = val.split(" — ");
          const primary = parts[0];
          const detail = parts.length > 1 ? parts.slice(1).join(" — ") : null;
          return (
            <li
              key={ri}
              className="py-3 first:pt-0 last:pb-0"
              data-testid={`comparator-${trackingKey}-${extraTestId}-row-${ri}`}
            >
              <div className="font-body text-[12.5px] sm:text-[13px] text-black/55 mb-1">
                {row.label}
              </div>
              <div
                className={`font-body text-[14.5px] sm:text-[15px] leading-snug ${
                  accent
                    ? "font-semibold text-black"
                    : "font-medium text-black/85"
                }`}
              >
                {primary}
              </div>
              {detail && (
                <div className="mt-1 font-body text-[12.5px] sm:text-[13px] leading-snug text-black/55">
                  {detail}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div data-testid={`comparator-${trackingKey}`}>
      {/* Selector row: fixed left + interactive chips right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5">
        <div
          className="glass-strong rounded-[var(--radius-lg)] px-5 py-4 flex flex-col gap-1 border-t-[3px] border-t-[#00E510]"
          aria-label={`${youLabel}: ${columns[fixedIndex]}`}
          data-testid={`comparator-${trackingKey}-fixed`}
        >
          <span className="font-body text-[12px] sm:text-[13px] text-[#00E510]">
            {youLabel}
          </span>
          <span className="font-heading text-[18px] sm:text-[20px] font-bold leading-tight text-black inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E510] shadow-[0_0_8px_rgba(0,229,16,0.6)]" />
            {columns[fixedIndex]}
          </span>
        </div>
        <div
          className="glass-strong rounded-[var(--radius-lg)] px-5 py-4 flex flex-col gap-2"
          data-testid={`comparator-${trackingKey}-picker`}
        >
          <span className="font-body text-[12px] sm:text-[13px] text-black/55">
            {compareLabel}
          </span>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={compareLabel}>
            {otherIndices.map((i) => {
              const active = i === otherIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setOtherIndex(i)}
                  className={`font-body text-[13px] sm:text-[14px] font-semibold rounded-full px-4 py-1.5 border transition-colors ${
                    active
                      ? "bg-[rgba(0,229,16,0.12)] border-[#00E510] text-black"
                      : "bg-transparent border-[var(--glass-border-strong)] text-black/70 hover:border-[#00E510] hover:text-black:text-white"
                  }`}
                  data-testid={`comparator-${trackingKey}-option-${i}`}
                >
                  {columns[i]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two solid liquid-glass panels side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {renderPanel(fixedIndex, true, youLabel, "panel-fixed")}
        {renderPanel(otherIndex, false, compareLabel, "panel-other")}
      </div>
    </div>
  );
}
