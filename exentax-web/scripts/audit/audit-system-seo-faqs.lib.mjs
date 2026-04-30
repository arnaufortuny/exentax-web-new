/*
 * audit-system-seo-faqs.lib.mjs
 * ----------------------------------------------------------------------------
 * Pieces de `audit-system-seo-faqs.mjs` que necesitan ser importables sin
 * disparar la auditoría completa (por ejemplo, desde tests de regresión).
 *
 * Mantener este fichero pequeño y SIN side-effects al importar.
 * ----------------------------------------------------------------------------
 */

// Detección de residuos castellanos por idioma (Task #38, 2026-04-22).
//
// Cada idioma destino tiene su propio set: una palabra sólo se flaggea si NO
// existe — con la misma grafía y acentos — en el idioma destino.
//
// Criterio para añadir términos:
//   1. Confirmar que la grafía exacta (incluidos tildes/diéresis) es
//      privativa del castellano en ese idioma.
//   2. Preferir términos con acento castellano (á/é/í/ó/ú/ñ).
//   3. En caso de duda, no añadir: el coste de un falso positivo es alto.
export const SPANISH_TELLS_BY_LANG = {
  // pt: evitar "também" (PT estándar) y "autónomo/autónomos" (válido en pt-PT).
  pt: /\b(además|gestión|obligación|hoy en d[ií]a|según|cu[oó]ta|impuestos?|hacienda|trámites?|asesor[íi]a)\b/i,
  // ca: evitar "també" y "empresa" (cognados). "autònom" es CA, "autónomo" es ES.
  ca: /\b(además|gestión|obligación|aut[óo]nomos?|hoy en d[ií]a|según|cu[oó]ta|impuestos?|hacienda|trámites?|asesor[íi]a)\b/i,
  fr: /\b(además|gestión|obligación|aut[óo]nomos?|hoy en d[ií]a|también|según|cu[óo]ta|impuestos?|hacienda|trámites?|asesor[íi]a)\b/i,
  de: /\b(además|gestión|obligación|aut[óo]nomos?|hoy en d[ií]a|también|según|cu[óo]ta|impuestos?|hacienda|trámites?|asesor[íi]a)\b/i,
  // en: evitar "quota" (también inglés). El resto se mantiene.
  en: /\b(además|gestión|obligación|aut[óo]nomos?|hoy en d[ií]a|también|según|cuota|impuestos?|hacienda|trámites?|asesor[íi]a)\b/i,
};

export function matchesSpanishTells(lang, text) {
  if (!text || lang === "es") return false;
  const re = SPANISH_TELLS_BY_LANG[lang];
  return re ? re.test(text) : false;
}

// ---------------------------------------------------------------------------
// Blog-embedded FAQs (Task #49, 2026-04-22).
//
// Las FAQs de los posts del blog viven dentro del markdown de cada
// `client/src/data/blog-content/<lang>/<slug>.ts`, bajo un encabezado `### …`
// localizado, con pares **Pregunta?** Respuesta. Para que los lints/audits
// del blog puedan reutilizar la misma detección de residuos castellanos que
// el audit de FAQs de sistema, exponemos aquí:
//
//   - BLOG_FAQ_HEADINGS   : regex por idioma del encabezado de la sección.
//   - extractBlogFaqQAs() : extrae los pares Q/A del bloque FAQ del post.
//
// Mantener este módulo SIN side-effects al importar (lo consumen tests).
// ---------------------------------------------------------------------------
export const BLOG_FAQ_HEADINGS = {
  es: /###\s+(?:Preguntas frecuentes|FAQs?)\b/i,
  en: /###\s+(?:Frequently asked questions|FAQs?)\b/i,
  fr: /###\s+(?:Questions fr[ée]quentes|FAQs?)\b/i,
  de: /###\s+(?:H[äa]ufige Fragen|FAQs?)\b/i,
  pt: /###\s+(?:Perguntas frequentes|FAQs?)\b/i,
  ca: /###\s+(?:Preguntes freq[üu]ents|FAQs?)\b/i,
};

// Devuelve los pares { question, answer } del bloque FAQ embebido en `src`
// para el idioma `lang`. Si no hay sección FAQ, devuelve [].
//
// El bloque comienza en el encabezado `### …` y termina al toparse con el
// siguiente `## ` o un `### ` que no sea otra variante del propio encabezado
// FAQ. Las preguntas son `**…?**` y la respuesta es todo lo que sigue hasta
// la siguiente pregunta o el final del bloque.
export function extractBlogFaqQAs(src, lang) {
  if (!src) return [];
  const headingRe = BLOG_FAQ_HEADINGS[lang];
  if (!headingRe || !headingRe.test(src)) return [];
  const startIdx = src.search(headingRe);
  const tail = src.slice(startIdx);
  const stop = tail
    .slice(1)
    .search(/\n##\s+|\n###\s+(?!Preguntas frecuentes|Frequently|Questions fr|H[äa]ufige|Perguntas|Preguntes|FAQs?\b)/i);
  const block = stop > 0 ? tail.slice(0, stop + 1) : tail;
  const qas = [];
  const re = /\*\*([^*]+\?)\*\*\s*([\s\S]*?)(?=\n\s*\*\*[^*]+\?\*\*|\n##\s+|\n###\s+|$)/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    qas.push({ question: m[1].trim(), answer: m[2].trim() });
  }
  return qas;
}

// ---------------------------------------------------------------------------
// Paridad de cobertura de Q/A entre ES y traducciones (Task #56, 2026-04-30).
//
// El audit trata ES como source-of-truth y desde Task #49 ya marca cuando una
// traducción tiene MENOS Q/A que la versión ES (`blog-faq-coverage-gap`).
// Esta tarea añade el chequeo simétrico: si una traducción crece y supera al
// ES, queremos que ES se ponga al día — de lo contrario el post castellano se
// queda atrás silenciosamente.
//
// Devuelve el área de issue a emitir, o null si los conteos coinciden:
//   - "blog-faq-coverage-gap"     : la traducción tiene MENOS Q/A que ES.
//   - "blog-faq-coverage-gap-es"  : la traducción tiene MÁS Q/A que ES.
//   - null                        : misma cantidad (todo OK).
//
// Mantener este helper puro (sólo aritmética sobre los conteos) para que el
// test de regresión pueda fijar el contrato sin ejecutar la auditoría entera.
export function classifyBlogFaqCoverage(esQaCount, otherQaCount) {
  const es = Number(esQaCount) || 0;
  const other = Number(otherQaCount) || 0;
  if (other < es) return "blog-faq-coverage-gap";
  if (other > es) return "blog-faq-coverage-gap-es";
  return null;
}

// Helper de conveniencia: dado el src markdown de un post y su idioma,
// devuelve la lista de hallazgos (uno por Q o por A que dispara el regex).
// Cada hallazgo es { kind: "question"|"answer", index, text } donde `index`
// es la posición 0-based del par Q/A dentro del bloque FAQ.
export function findBlogFaqSpanishTells(src, lang) {
  if (lang === "es") return [];
  const qas = extractBlogFaqQAs(src, lang);
  const findings = [];
  qas.forEach((qa, idx) => {
    if (matchesSpanishTells(lang, qa.question)) {
      findings.push({ kind: "question", index: idx, text: qa.question });
    }
    if (matchesSpanishTells(lang, qa.answer)) {
      findings.push({ kind: "answer", index: idx, text: qa.answer });
    }
  });
  return findings;
}
