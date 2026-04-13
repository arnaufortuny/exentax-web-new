import { ReactNode, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useLangPath } from "@/hooks/useLangPath";

export interface FAQEntry {
  q: string;
  a: ReactNode;
}

export interface FAQSection {
  title: string;
  icon: string;
  items: FAQEntry[];
}

export function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as ReactElement & { props: { children: ReactNode } }).props.children);
  }
  return "";
}

export const sectionIcons: Record<string, ReactElement> = {
  about: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="12" stroke="#00E510" strokeWidth="2" />
      <path d="M14 8v1M14 12v8" stroke="#00E510" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  fit: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <path d="M14 4l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" stroke="#00E510" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  llc: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <rect x="5" y="6" width="18" height="16" rx="2" stroke="#00E510" strokeWidth="2" />
      <path d="M5 11h18" stroke="#00E510" strokeWidth="2" />
      <path d="M10 15h8M10 18h5" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  process: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <path d="M6 14h16M18 10l4 4-4 4" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="14" r="2.5" fill="#00E510" />
    </svg>
  ),
  banking: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <rect x="4" y="8" width="20" height="14" rx="2" stroke="#00E510" strokeWidth="2" />
      <path d="M4 13h20" stroke="#00E510" strokeWidth="2" />
      <path d="M8 18h4" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  compliance: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <path d="M14 3l9 4v7c0 5-4 9-9 11-5-2-9-6-9-11V7l9-4z" stroke="#00E510" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 14l3 3 5-5" stroke="#00E510" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  advanced: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="#00E510" strokeWidth="2" />
      <path d="M14 4v20M4 14h20" stroke="#00E510" strokeWidth="2" />
      <path d="M7 7l14 14M21 7L7 21" stroke="#00E510" strokeWidth="1.5" opacity="0.5" />
    </svg>
  ),
  pricing: (
    <svg width={24} height={24} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="#00E510" strokeWidth="2" />
      <path d="M14 8v12M11 11c0-1.5 1.3-2 3-2s3 .5 3 2-1.3 2-3 2-3 .5-3 2 1.3 2 3 2 3-.5 3-2" stroke="#00E510" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

function fmtInline(text: string, lp: (p: string) => string): ReactNode {
  const re = /(\*\*[^*]+\*\*|\{\{link:[^}]+\}\})/;
  const parts: ReactNode[] = [];
  let remaining = text;
  let k = 0;
  while (remaining) {
    const m = remaining.match(re);
    if (!m || m.index === undefined) { parts.push(remaining); break; }
    if (m.index > 0) parts.push(remaining.slice(0, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={k++} className="text-[var(--text-1)]">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("{{link:")) {
      const inner = token.slice(7, -2);
      const pipeIdx = inner.indexOf("|");
      const href = inner.slice(0, pipeIdx);
      const label = inner.slice(pipeIdx + 1);
      parts.push(<Link key={k++} href={lp(href)} className="text-[#00E510] hover:underline font-semibold">{label}</Link>);
    }
    remaining = remaining.slice(m.index! + token.length);
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

function isBulletLine(l: string): boolean {
  const s = l.trimStart();
  return s.startsWith("- ") || s.startsWith("• ") || s.startsWith("· ");
}

function stripBullet(l: string): string {
  return l.replace(/^\s*[-•·]\s*/, "");
}

function renderFaqMd(md: string, lp: (p: string) => string): ReactNode {
  if (!md) return null;
  const rawLines = md.split("\n");
  const rendered: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (isBulletLine(line)) {
      const bullets: string[] = [];
      while (i < rawLines.length && isBulletLine(rawLines[i])) {
        bullets.push(stripBullet(rawLines[i]));
        i++;
      }
      rendered.push(
        <ul key={key++} className="list-disc pl-5 mt-2 mb-3 space-y-1.5">
          {bullets.map((b, j) => (
            <li key={j} className="leading-relaxed">{fmtInline(b, lp)}</li>
          ))}
        </ul>
      );
    } else {
      const paras: string[] = [line];
      i++;
      while (i < rawLines.length && rawLines[i].trim() && !isBulletLine(rawLines[i])) {
        paras.push(rawLines[i]);
        i++;
      }
      rendered.push(
        <p key={key++} className="mb-3 leading-relaxed">{fmtInline(paras.join(" "), lp)}</p>
      );
    }
  }

  return <>{rendered}</>;
}

export function useFaqSections(): FAQSection[] {
  const { t, i18n } = useTranslation();
  const lp = useLangPath();
  const lang = i18n.language;

  return useMemo(() => {
    const r = (key: string) => renderFaqMd(t(`faqData.answers.${key}`), lp);

    return [
      {
        title: t("faqData.sections.about"),
        icon: "about",
        items: [
          { q: t("faqData.questions.about_0"), a: r("about_0") },
          { q: t("faqData.questions.about_1"), a: r("about_1") },
          { q: t("faqData.questions.about_2"), a: r("about_2") },
          { q: t("faqData.questions.about_3"), a: r("about_3") },
          { q: t("faqData.questions.about_4"), a: r("about_4") },
          { q: t("faqData.questions.about_5"), a: r("about_5") },
          { q: t("faqData.questions.about_6"), a: r("about_6") },
          { q: t("faqData.questions.about_7"), a: r("about_7") },
        ],
      },
      {
        title: t("faqData.sections.fit"),
        icon: "fit",
        items: [
          { q: t("faqData.questions.fit_0"), a: r("fit_0") },
          { q: t("faqData.questions.fit_1"), a: r("fit_1") },
          { q: t("faqData.questions.fit_2"), a: r("fit_2") },
          { q: t("faqData.questions.fit_3"), a: r("fit_3") },
          { q: t("faqData.questions.fit_4"), a: r("fit_4") },
        ],
      },
      {
        title: t("faqData.sections.llc"),
        icon: "llc",
        items: [
          { q: t("faqData.questions.llc_0"), a: r("llc_0") },
          { q: t("faqData.questions.llc_1"), a: r("llc_1") },
          { q: t("faqData.questions.llc_2"), a: r("llc_2") },
          { q: t("faqData.questions.llc_3"), a: r("llc_3") },
          { q: t("faqData.questions.llc_4"), a: r("llc_4") },
          { q: t("faqData.questions.llc_5"), a: r("llc_5") },
          { q: t("faqData.questions.llc_6"), a: r("llc_6") },
          { q: t("faqData.questions.llc_7"), a: r("llc_7") },
          { q: t("faqData.questions.llc_8"), a: r("llc_8") },
          { q: t("faqData.questions.llc_9"), a: r("llc_9") },
        ],
      },
      {
        title: t("faqData.sections.process"),
        icon: "process",
        items: [
          { q: t("faqData.questions.process_0"), a: r("process_0") },
          { q: t("faqData.questions.process_1"), a: r("process_1") },
          { q: t("faqData.questions.process_2"), a: r("process_2") },
          { q: t("faqData.questions.process_3"), a: r("process_3") },
          { q: t("faqData.questions.process_4"), a: r("process_4") },
          { q: t("faqData.questions.process_5"), a: r("process_5") },
          { q: t("faqData.questions.process_6"), a: r("process_6") },
          { q: t("faqData.questions.process_7"), a: r("process_7") },
          { q: t("faqData.questions.process_8"), a: r("process_8") },
          { q: t("faqData.questions.process_9"), a: r("process_9") },
        ],
      },
      {
        title: t("faqData.sections.banking"),
        icon: "banking",
        items: [
          { q: t("faqData.questions.banking_0"), a: r("banking_0") },
          { q: t("faqData.questions.banking_1"), a: r("banking_1") },
          { q: t("faqData.questions.banking_2"), a: r("banking_2") },
          { q: t("faqData.questions.banking_3"), a: r("banking_3") },
          { q: t("faqData.questions.banking_4"), a: r("banking_4") },
          { q: t("faqData.questions.banking_5"), a: r("banking_5") },
          { q: t("faqData.questions.banking_6"), a: r("banking_6") },
          { q: t("faqData.questions.banking_7"), a: r("banking_7") },
        ],
      },
      {
        title: t("faqData.sections.compliance"),
        icon: "compliance",
        items: [
          { q: t("faqData.questions.compliance_0"), a: r("compliance_0") },
          { q: t("faqData.questions.compliance_1"), a: r("compliance_1") },
          { q: t("faqData.questions.compliance_2"), a: r("compliance_2") },
          { q: t("faqData.questions.compliance_3"), a: r("compliance_3") },
          { q: t("faqData.questions.compliance_4"), a: r("compliance_4") },
          { q: t("faqData.questions.compliance_5"), a: r("compliance_5") },
          { q: t("faqData.questions.compliance_6"), a: r("compliance_6") },
          { q: t("faqData.questions.compliance_7"), a: r("compliance_7") },
          { q: t("faqData.questions.compliance_8"), a: r("compliance_8") },
          { q: t("faqData.questions.compliance_9"), a: r("compliance_9") },
          { q: t("faqData.questions.compliance_10"), a: r("compliance_10") },
        ],
      },
      {
        title: t("faqData.sections.advanced"),
        icon: "advanced",
        items: [
          { q: t("faqData.questions.advanced_0"), a: r("advanced_0") },
          { q: t("faqData.questions.advanced_1"), a: r("advanced_1") },
          { q: t("faqData.questions.advanced_2"), a: r("advanced_2") },
          { q: t("faqData.questions.advanced_3"), a: r("advanced_3") },
          { q: t("faqData.questions.advanced_4"), a: r("advanced_4") },
          { q: t("faqData.questions.advanced_5"), a: r("advanced_5") },
          { q: t("faqData.questions.advanced_6"), a: r("advanced_6") },
          { q: t("faqData.questions.advanced_7"), a: r("advanced_7") },
          { q: t("faqData.questions.advanced_8"), a: r("advanced_8") },
        ],
      },
      {
        title: t("faqData.sections.pricing"),
        icon: "pricing",
        items: [
          { q: t("faqData.questions.pricing_0"), a: r("pricing_0") },
          { q: t("faqData.questions.pricing_1"), a: r("pricing_1") },
          { q: t("faqData.questions.pricing_2"), a: r("pricing_2") },
          { q: t("faqData.questions.pricing_3"), a: r("pricing_3") },
          { q: t("faqData.questions.pricing_4"), a: r("pricing_4") },
          { q: t("faqData.questions.pricing_5"), a: r("pricing_5") },
          { q: t("faqData.questions.pricing_6"), a: r("pricing_6") },
          { q: t("faqData.questions.pricing_7"), a: r("pricing_7") },
        ],
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
}
