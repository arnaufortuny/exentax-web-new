import esLocale from "../client/src/i18n/locales/es";
import enLocale from "../client/src/i18n/locales/en";
import frLocale from "../client/src/i18n/locales/fr";
import deLocale from "../client/src/i18n/locales/de";
import ptLocale from "../client/src/i18n/locales/pt";
import caLocale from "../client/src/i18n/locales/ca";
import type { SupportedLang } from "./server-constants";

const FAQ_IDS: ReadonlyArray<string> = [
  "about_0","about_1","about_2","about_3","about_4","about_5","about_6","about_7",
  "fit_0","fit_1","fit_2","fit_3","fit_4",
  "llc_0","llc_1","llc_2","llc_3","llc_4","llc_5","llc_6","llc_7","llc_8","llc_9",
  "process_0","process_1","process_2","process_3","process_4","process_5","process_6","process_7","process_8","process_9",
  "banking_0","banking_1","banking_2","banking_3","banking_4","banking_5","banking_6","banking_7",
  "compliance_0","compliance_1","compliance_2","compliance_3","compliance_4","compliance_5","compliance_6","compliance_7","compliance_8","compliance_9","compliance_10",
  "advanced_0","advanced_1","advanced_2","advanced_3","advanced_4","advanced_5","advanced_6","advanced_7","advanced_8","advanced_9","advanced_10","advanced_11","advanced_12","advanced_13","advanced_14","advanced_15","advanced_16","advanced_17","advanced_18",
  "tax_0","tax_1","tax_2","tax_3","tax_4","tax_5","tax_6","tax_7",
];

type LocaleShape = { faqData?: { questions?: Record<string, string>; answers?: Record<string, string> } };

const LOCALES: Record<SupportedLang, LocaleShape> = {
  es: esLocale as LocaleShape,
  en: enLocale as LocaleShape,
  fr: frLocale as LocaleShape,
  de: deLocale as LocaleShape,
  pt: ptLocale as LocaleShape,
  ca: caLocale as LocaleShape,
};

function stripFaqMarkdown(input: string): string {
  if (!input) return "";
  return input
    .replace(/\{\{link:[^|}]+\|([^}]+)\}\}/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface FaqSchemaEntry {
  "@type": "Question";
  name: string;
  acceptedAnswer: { "@type": "Answer"; text: string };
}

function buildEntries(lang: SupportedLang): FaqSchemaEntry[] {
  const fd = LOCALES[lang]?.faqData;
  const fallback = LOCALES.es.faqData;
  if (!fd || !fd.questions || !fd.answers) return [];
  const out: FaqSchemaEntry[] = [];
  for (const id of FAQ_IDS) {
    const q = fd.questions[id] ?? fallback?.questions?.[id];
    const a = fd.answers[id] ?? fallback?.answers?.[id];
    if (!q || !a) continue;
    out.push({
      "@type": "Question",
      name: q.trim(),
      acceptedAnswer: { "@type": "Answer", text: stripFaqMarkdown(a) },
    });
  }
  return out;
}

export const FAQ_SCHEMA_ENTRIES_I18N: Record<SupportedLang, FaqSchemaEntry[]> = {
  es: buildEntries("es"),
  en: buildEntries("en"),
  fr: buildEntries("fr"),
  de: buildEntries("de"),
  pt: buildEntries("pt"),
  ca: buildEntries("ca"),
};
