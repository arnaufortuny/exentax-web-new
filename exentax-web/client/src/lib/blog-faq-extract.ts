/**
 * Extract FAQ Q&A pairs from a blog article's Markdown body.
 *
 * Used by `pages/blog/post.tsx` to build a `FAQPage` JSON-LD on top of the
 * existing `BlogPosting` JSON-LD. The same parsing convention is used by
 * `scripts/blog/blog-consistency-check.mjs` so that the SEO gate can verify the
 * structured data matches the article body.
 *
 * Conventions (deterministic, locked across languages):
 *  - The FAQ section is a single `## …` heading per article (one of the
 *    accepted phrasings below per language).
 *  - Each question is wrapped in `**…?**` (bold) and is followed by its
 *    answer paragraph(s). Multi-paragraph answers are concatenated with a
 *    space (Google FAQPage answers are plain text without line breaks).
 *  - Parsing stops at the next `## ` heading or the end of file.
 *
 * Adding a new language: append the heading variants to `FAQ_HEADINGS`.
 */

import type { SupportedLang } from "@/i18n";

export interface FaqQA {
  question: string;
  answer: string;
}

const FAQ_HEADINGS: Record<SupportedLang, RegExp> = {
  es: /^##\s+(?:Preguntas frecuentes(?:\s+hoy)?(?:\s+\(FAQ\))?|FAQ)\s*$/im,
  en: /^##\s+(?:Frequently asked questions|FAQ|Common questions|Most common questions)\s*$/im,
  fr: /^##\s+(?:Questions fr[ée]quentes(?:\s+aujourd'hui)?|FAQ)\s*$/im,
  de: /^##\s+(?:H[äa]ufig gestellte Fragen|FAQ aktuell|FAQ|Wichtige Fragen)\s*$/im,
  pt: /^##\s+(?:Perguntas frequentes(?:\s+hoje)?|FAQ)\s*$/im,
  ca: /^##\s+(?:Preguntes freq[üu]ents(?:\s+avui)?|FAQ)\s*$/im,
};

const QA_REGEX =
  /\*\*\s*([^*\n][^*\n]*\?)\s*\*\*\s*\n+([\s\S]*?)(?=\n\s*\*\*\s*[^*\n][^*\n]*\?\s*\*\*|\n\s*<!--|\n\s*##\s|$)/g;

export function extractFaqQA(markdown: string, lang: SupportedLang): FaqQA[] {
  if (!markdown) return [];
  const re = FAQ_HEADINGS[lang] || FAQ_HEADINGS.es;
  const m = re.exec(markdown);
  if (!m || m.index === undefined) return [];
  const after = markdown.slice(m.index + m[0].length);
  const nextH2 = after.search(/^##\s+/m);
  const body = nextH2 >= 0 ? after.slice(0, nextH2) : after;

  const out: FaqQA[] = [];
  QA_REGEX.lastIndex = 0;
  let pair: RegExpExecArray | null;
  while ((pair = QA_REGEX.exec(body)) !== null) {
    const question = pair[1].trim();
    const answer = pair[2]
      .trim()
      // Strip injected HTML comments and stray markup that should not appear
      // in a structured-data answer.
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (question && answer && answer.length >= 20) {
      out.push({ question, answer });
    }
  }
  return out;
}

/**
 * Build a Schema.org `FAQPage` JSON-LD object from the parsed pairs.
 * Returns `null` when there is nothing usable so the caller can omit the
 * tag entirely (Google rejects empty `FAQPage` entities).
 */
export function buildFaqJsonLd(
  pairs: FaqQA[],
  url: string,
  lang: SupportedLang,
): Record<string, unknown> | null {
  if (!pairs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: lang,
    mainEntity: pairs.map((p) => ({
      "@type": "Question",
      name: p.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.answer,
      },
    })),
  };
}
