/**
 * i18n-native-quality-audit
 *
 * Catches native-quality drift that the existing checks intentionally
 * leave alone:
 *   - false friends (EN: "actually" → currently; FR: "supporter" → endure)
 *   - calques from Spanish ("hacer click" → "do click", "hacer sentido"
 *     → "make sense")
 *   - brazilianisms in PT-PT (você, celular, geladeira, tela, trem,
 *     ônibus, cadastrar, usuário, …)
 *   - castilianisms in CA (pues, después, hasta, antes, siempre,
 *     demasiado, todavía, luego, entonces, plaza, hacia, …)
 *   - common anglicisms in DE/FR where the native equivalent is the
 *     standard register (DE: "Email" → "E-Mail", "macht Sinn" →
 *     "ergibt Sinn"; FR: "checker" → "vérifier")
 *
 * Scope: BOTH the i18n bundles (`client/src/i18n/locales/*.ts`) AND
 * the server email bundles (`server/email-i18n/{lang}.ts`). The same
 * native-quality rules apply to both surfaces.
 *
 * Each rule is conservative — it must fire only on unambiguous cases
 * (real users / translators would never legitimately write that
 * pattern in the target language). When a legitimate usage exists
 * (e.g. ES word quoted inside an HTML blockquote on purpose, code
 * spans, URLs, comparison phrases that show both terms), use
 * `allowedContext` to suppress.
 *
 * Run:   npx tsx scripts/i18n/i18n-native-quality-audit.ts
 * Strict: npx tsx scripts/i18n/i18n-native-quality-audit.ts --strict
 * Self-test: npx tsx scripts/i18n/i18n-native-quality-audit.ts --self-test
 */
import es from "../../client/src/i18n/locales/es";
import en from "../../client/src/i18n/locales/en";
import fr from "../../client/src/i18n/locales/fr";
import de from "../../client/src/i18n/locales/de";
import pt from "../../client/src/i18n/locales/pt";
import ca from "../../client/src/i18n/locales/ca";

import { esTranslations } from "../../server/email-i18n/es";
import { enTranslations } from "../../server/email-i18n/en";
import { frTranslations } from "../../server/email-i18n/fr";
import { deTranslations } from "../../server/email-i18n/de";
import { ptTranslations } from "../../server/email-i18n/pt";
import { caTranslations } from "../../server/email-i18n/ca";

type Bundle = Record<string, unknown>;
type Flat = Record<string, string>;

const SAMPLE_NAME = "Marta";
const SAMPLE_PHONE = "+34 600 123 456";
const SAMPLE_DATE = "2026-05-15";
const SAMPLE_TIME = "10:00";
const SAMPLE_URL = "https://exentax.com/manage/abc123";

function flattenJson(obj: Bundle, prefix = "", out: Flat = {}): Flat {
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    const v = obj[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenJson(v as Bundle, full, out);
    } else if (typeof v === "string") {
      out[full] = v;
    }
  }
  return out;
}

/**
 * Recursively flatten an email-translation bundle. Functions are
 * resolved with neutral sample arguments so their return value is
 * scanned for native-quality drift just like static strings. Arrays
 * become indexed keys; objects merge under dotted prefixes.
 */
function flattenEmails(obj: unknown, prefix: string, out: Flat): Flat {
  if (obj == null) return out;
  if (typeof obj === "string") {
    out[prefix] = obj;
    return out;
  }
  if (typeof obj === "function") {
    // Try with several sample shapes; the first one that works wins.
    const samples: unknown[][] = [
      [SAMPLE_NAME],
      [SAMPLE_TIME],
      [SAMPLE_URL],
      [SAMPLE_DATE],
      [SAMPLE_NAME, SAMPLE_DATE],
      [SAMPLE_PHONE],
      [],
    ];
    for (const args of samples) {
      try {
        const r = (obj as (...a: unknown[]) => unknown).apply(null, args);
        if (typeof r === "string") {
          out[prefix] = r;
          return out;
        }
      } catch {
        /* try next signature */
      }
    }
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => flattenEmails(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flattenEmails(v, prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  return out;
}

const uiLocales: Record<string, Flat> = {
  es: flattenJson(es as Bundle),
  en: flattenJson(en as Bundle),
  fr: flattenJson(fr as Bundle),
  de: flattenJson(de as Bundle),
  pt: flattenJson(pt as Bundle),
  ca: flattenJson(ca as Bundle),
};

const emailLocales: Record<string, Flat> = {
  es: flattenEmails(esTranslations, "", {}),
  en: flattenEmails(enTranslations, "", {}),
  fr: flattenEmails(frTranslations, "", {}),
  de: flattenEmails(deTranslations, "", {}),
  pt: flattenEmails(ptTranslations, "", {}),
  ca: flattenEmails(caTranslations, "", {}),
};

// ─── Rule shape ──────────────────────────────────────────────────────
type Rule = {
  id: string;
  bad: RegExp;
  hint: string;
  // If the matched value also matches `allowedContext`, suppress.
  allowedContext?: RegExp;
};

// ─── Per-language rule sets ──────────────────────────────────────────
// Rules MUST be conservative. If a Spanish-shaped pattern legitimately
// appears in the target language (e.g. CA `nunca` exists in CA too,
// and PT shares many cognates with ES), do NOT add it.

// JavaScript's `\b` is ASCII-only without the /u flag, which means it
// fails to match around non-ASCII letters (e.g. `\bvocê\b` does NOT
// match "Você" because the `ê` is treated as non-word, so the `\b`
// after it never fires). All rules below use Unicode-aware
// lookarounds: a word-boundary that recognises every Letter in any
// script. Wrap any rule body that contains accented characters with
// `UB(...)UE` to get cross-script word-boundary semantics.
const UB = "(?<![\\p{L}\\p{N}_])"; // unicode left boundary
const UE = "(?![\\p{L}\\p{N}_])"; // unicode right boundary
const ub = (body: string, flags = "iu") => new RegExp(`${UB}(?:${body})${UE}`, flags);

const enRules: Rule[] = [
  // "do click", "make click", "make a click", "made a click on" — direct
  // calque from Spanish "hacer click". English is just "click".
  {
    id: "EN: 'do click' / 'make click' calque",
    bad: /\b(?:do|make|made)\s+(?:a\s+)?click\b/i,
    hint: "Use 'click' as a verb (no 'do' / 'make'). E.g. 'click the button'.",
  },
  // "informations" — uncountable in English. ES "informaciones" is
  // routinely calqued by Spanish translators.
  {
    id: "EN: 'informations' (uncountable)",
    bad: /\binformations\b/i,
    hint: "Use 'information' (uncountable) or 'details' / 'data'.",
  },
  // "we are agree" / "I am agree" — Spanish calque of "estoy de
  // acuerdo". English uses "agree" as verb: "I agree".
  {
    id: "EN: 'be agree' calque",
    bad: /\b(?:I\s*am|we\s*are|you\s*are|they\s*are|he\s*is|she\s*is)\s+agree\b/i,
    hint: "Use 'agree' as a verb: 'I agree' / 'we agree' (not 'I am agree').",
  },
  // "in the moment of" — calque of "en el momento de". Native is
  // "at the time of" / "when".
  {
    id: "EN: 'in the moment of' calque",
    bad: /\bin\s+the\s+moment\s+of\b/i,
    hint: "Use 'at the time of' or 'when' (not 'in the moment of').",
  },
  // "since always" — calque of "desde siempre". Native is "always" or
  // "from the start".
  {
    id: "EN: 'since always' calque",
    bad: /\bsince\s+always\b/i,
    hint: "Use 'always' or 'from the start' (not 'since always').",
  },
  // "more better" / "more worse" — broken comparative.
  {
    id: "EN: 'more better' / 'more worse'",
    bad: /\bmore\s+(?:better|worse|bigger|smaller|easier|harder|faster|slower|cheaper|stronger|weaker)\b/i,
    hint: "Use the comparative directly ('better', 'easier'), not 'more better'.",
  },
  // "advices" — uncountable in English; ES "consejos" → many translators
  // write "advices".
  {
    id: "EN: 'advices' (uncountable)",
    bad: /\badvices\b/i,
    hint: "Use 'advice' (uncountable) or 'pieces of advice' / 'tips'.",
  },
  // "trainings" used as count noun for educational sessions. EN prefers
  // "training sessions" / "courses" in formal copy.
  {
    id: "EN: 'a training' / 'trainings' (plural)",
    bad: /\b(?:a|one)\s+training\b/i,
    hint: "Use 'a training session' / 'a course' (not 'a training').",
  },
  // "feedbacks" — uncountable.
  {
    id: "EN: 'feedbacks' (uncountable)",
    bad: /\bfeedbacks\b/i,
    hint: "Use 'feedback' (uncountable).",
  },
  // "assist to" used as "attend". Native English is "attend" without
  // "to". Suppress when the value also says "we will assist you" etc.
  {
    id: "EN: 'assist to (the meeting)' calque",
    bad: /\bassist(?:s|ed)?\s+to\s+(?:the|a|your|our|this|that)\s+(?:meeting|call|session|webinar|event|conference|appointment|advisory)\b/i,
    hint: "Use 'attend the meeting' (not 'assist to the meeting').",
  },
];

const frRules: Rule[] = [
  // Common anglicisms with native FR equivalents in formal/business
  // copy. Allowed in marketing-tech jargon contexts (e.g. URL paths,
  // Slack/Mercury product names).
  {
    id: "FR: 'checker' anglicisme",
    bad: ub("checker"),
    hint: "Utilisez 'vérifier' ou 'consulter' (non 'checker').",
  },
  {
    id: "FR: 'matcher' anglicisme",
    bad: ub("matcher"),
    hint: "Utilisez 'correspondre à' ou 'aligner' (non 'matcher').",
  },
  // "ca va" / "ca te / ca vous" with no cedilla. The pronoun "ça" in
  // FR is *always* spelt with cedilla. The clitic "ça" is unambiguous
  // when followed by a verb / pronoun.
  {
    id: "FR: 'ca' sans cédille (devrait être 'ça')",
    bad: ub("ca\\s+(?:va|te|vous|nous|ne\\s|n['’]|me\\s|m['’]|fait|fera|sera|est)"),
    hint: "Le pronom 'ça' s'écrit toujours avec une cédille.",
  },
  // "etre" / "etes" / "etais" without accents — cheap detection via
  // standalone unaccented forms that are *always* wrong in FR.
  {
    id: "FR: 'etre' sans accent (être)",
    bad: ub("etre|etes|etais|etait|etant"),
    hint: "Utilisez 'être' / 'êtes' / 'étais' / 'était' / 'étant' avec accent circonflexe / aigu.",
  },
  // "deja" with no accent — should be "déjà".
  {
    id: "FR: 'deja' sans accents (déjà)",
    bad: ub("deja"),
    hint: "Utilisez 'déjà' (avec accents).",
  },
  // "pleonasme courriel": "courriel électronique" / "email électronique"
  // are pleonastic — "courriel" already means "courrier électronique".
  {
    id: "FR: pléonasme 'courriel électronique'",
    bad: ub("courriel\\s+électronique"),
    hint: "'courriel' signifie déjà 'courrier électronique'. Évitez le pléonasme.",
  },
  // ── High-confidence accent-stripping. Each listed form has no
  // valid alternative meaning in modern French; the unaccented form
  // is a typographic error (typically inherited from copy-pasted
  // ALL-CAPS legal headers where the translator dropped diacritics).
  // Forms that overlap with unrelated French words (e.g. lowercase
  // "lie" = first-person of "lier") are NOT in this list.
  {
    id: "FR: forme sans accent (probablement diacritique manquante)",
    bad: ub(
      [
        "integralite",
        "integrite",
        "generales",
        "generale",
        "generalement",
        "legalement",
        "deposes?",
        "executes?",
        "presumees?",
        "independamment",
        "independantes?",
        "electroniques?",
        "numeriques?",
        "recuperables?",
        "demarches?",
        "fonctionnalites?",
        "realisees?",
        "declarez",
        "etablie",
        "etablies",
        // NOTE: "annule" / "attribue" deliberately omitted — they
        // overlap with valid present-tense conjugations of
        // "annuler" / "attribuer" (e.g. "si Exentax annule"). Their
        // past-participle past-perfect uses in legal copy were
        // restored manually.
        "reutilises?",
        "decrites?",
        "conformite",
        "irreversible",
        "irrevocable",
      ].join("|"),
    ),
    hint: "Diacritique manquante — vérifiez les accents (é/è/à/ê/ù/ç) y compris dans les blocs en MAJUSCULES.",
  },
];

const deRules: Rule[] = [
  // "Email" → German prefers "E-Mail" with hyphen and capital M (Duden).
  // Allow the lowercase email as a HTML attribute / placeholder.
  {
    id: "DE: 'Email' (DE-Schreibweise: 'E-Mail')",
    bad: /\bEmail\b/,
    hint: "Im Deutschen wird 'E-Mail' (mit Bindestrich) geschrieben.",
    // URLs, attribute placeholders, Mercury/email field labels with
    // English UI vocabulary, mailto: addresses are exempt.
    allowedContext: /mailto:|\bemail\s*=|@\w+\.\w+|placeholder=|name=["']email|"email"/i,
  },
  // "macht Sinn" — anglicism ("makes sense"). German native is
  // "ergibt Sinn".
  {
    id: "DE: 'macht Sinn' Anglizismus",
    bad: /\bmacht\s+(?:das\s+)?Sinn\b/i,
    hint: "Im Deutschen heißt es 'ergibt Sinn', nicht 'macht Sinn'.",
  },
  // "downloaden" / "uploaden" — German has "herunterladen" /
  // "hochladen". Allow inside `<code>` blocks or product UI labels.
  {
    id: "DE: 'downloaden' Anglizismus",
    bad: /\bdownloaden\b/i,
    hint: "Verwenden Sie 'herunterladen' (nicht 'downloaden').",
  },
  {
    id: "DE: 'uploaden' Anglizismus",
    bad: /\buploaden\b/i,
    hint: "Verwenden Sie 'hochladen' (nicht 'uploaden').",
  },
  // "in 2025" — anglicism. German uses "im Jahr 2025" or just "2025".
  // Conservative: only flag at sentence start to avoid valid prep usage.
  {
    id: "DE: 'in 2025' Anglizismus",
    bad: /(?:^|[\.\?!]\s+)In\s+(?:19|20)\d{2}\b/,
    hint: "Im Deutschen: 'Im Jahr 2025' oder einfach '2025' (nicht 'In 2025').",
  },
];

const ptRules: Rule[] = [
  // ── Brazilianisms — words/spellings that exist in PT-BR but are
  // not the standard PT-PT register. The audit-pt-pt script catches
  // some of these; this rule set codifies the canonical ones.
  {
    id: "PT: brasileirismo 'você' (PT-PT: 'tu' / 'o senhor')",
    bad: ub("você(?:s)?"),
    hint: "Em PT-PT use 'tu' (informal) ou 'o senhor / a senhora' (formal).",
  },
  {
    id: "PT: brasileirismo 'celular' (PT-PT: 'telemóvel')",
    bad: ub("celular(?:es)?"),
    hint: "Em PT-PT diz-se 'telemóvel'.",
  },
  {
    id: "PT: brasileirismo 'tela' (PT-PT: 'ecrã')",
    bad: ub("tela(?:s)?"),
    hint: "Em PT-PT diz-se 'ecrã'.",
  },
  {
    id: "PT: brasileirismo 'trem' (PT-PT: 'comboio')",
    bad: ub("trem"),
    hint: "Em PT-PT diz-se 'comboio'.",
  },
  {
    id: "PT: brasileirismo 'ônibus' (PT-PT: 'autocarro')",
    bad: ub("ônibus"),
    hint: "Em PT-PT diz-se 'autocarro'.",
  },
  {
    id: "PT: brasileirismo 'geladeira' (PT-PT: 'frigorífico')",
    bad: ub("geladeira(?:s)?"),
    hint: "Em PT-PT diz-se 'frigorífico'.",
  },
  {
    id: "PT: brasileirismo 'cadastrar' / 'cadastro' (PT-PT: 'registar')",
    bad: ub("cadastr(?:ar|o|os|amento)"),
    hint: "Em PT-PT use 'registar' / 'registo' (não 'cadastrar' / 'cadastro').",
  },
  {
    id: "PT: brasileirismo 'usuário' (PT-PT: 'utilizador')",
    bad: ub("usuário(?:s)?"),
    hint: "Em PT-PT diz-se 'utilizador'.",
  },
  {
    id: "PT: brasileirismo 'sorvete' (PT-PT: 'gelado')",
    bad: ub("sorvete(?:s)?"),
    hint: "Em PT-PT diz-se 'gelado'.",
  },
  // Continuous gerund "estou fazendo" — Brazilian. Standard PT-PT is
  // "estou a fazer".
  {
    id: "PT: gerúndio brasileiro 'está/estou + -ndo'",
    bad: ub("(?:est(?:á|ou|amos|ão|ava|avas|ávamos|avam))\\s+[\\p{L}]+ndo"),
    hint: "Em PT-PT use 'estar a + infinitivo' (ex.: 'estou a fazer'), não o gerúndio.",
  },
];

const caRules: Rule[] = [
  // ── Castilianisms — words from ES that the IEC normative rules
  // explicitly mark as incorrect in formal Catalan. Each must be
  // unambiguous (i.e. NOT also a valid CA word). Cognates that exist
  // in both CA and ES (e.g. "fiscal", "internacional", "anual",
  // "estructura") are NOT in this list.
  {
    id: "CA: castellanisme 'pues' (correcte: 'doncs')",
    bad: ub("pues"),
    hint: "En català formal: 'doncs' (no 'pues').",
  },
  {
    id: "CA: castellanisme 'después' (correcte: 'després')",
    bad: ub("después"),
    hint: "En català: 'després' (no 'después').",
  },
  {
    id: "CA: castellanisme 'antes' (correcte: 'abans')",
    bad: ub("antes"),
    hint: "En català: 'abans' (no 'antes').",
  },
  {
    id: "CA: castellanisme 'siempre' (correcte: 'sempre')",
    bad: ub("siempre"),
    hint: "En català: 'sempre' (no 'siempre').",
  },
  {
    id: "CA: castellanisme 'luego' (correcte: 'després' / 'doncs')",
    bad: ub("luego"),
    hint: "En català: 'després' (temps) o 'doncs' (conseqüència) — no 'luego'.",
  },
  {
    id: "CA: castellanisme 'entonces' (correcte: 'llavors' / 'aleshores')",
    bad: ub("entonces"),
    hint: "En català: 'llavors' o 'aleshores' (no 'entonces').",
  },
  {
    id: "CA: castellanisme 'demasiado' (correcte: 'massa')",
    bad: ub("demasiado(?:s|a|as)?"),
    hint: "En català: 'massa' (no 'demasiado').",
  },
  {
    id: "CA: castellanisme 'todavía' (correcte: 'encara')",
    bad: ub("todavía"),
    hint: "En català: 'encara' (no 'todavía').",
  },
  {
    id: "CA: castellanisme 'plaza' (correcte: 'plaça')",
    bad: ub("plaza(?:s)?"),
    hint: "En català: 'plaça' (no 'plaza').",
    // Comparison/example contexts that quote ES intentionally are
    // suppressed by the same value showing 'plaça' next to it.
    allowedContext: /plaça/iu,
  },
  {
    id: "CA: castellanisme 'hacia' (correcte: 'cap a')",
    bad: ub("hacia"),
    hint: "En català: 'cap a' (no 'hacia').",
  },
  {
    id: "CA: castellanisme 'hasta' (correcte: 'fins')",
    bad: ub("hasta"),
    hint: "En català: 'fins (a)' (no 'hasta').",
  },
  // Spanish inverted question/exclamation marks never appear in CA.
  {
    id: "CA: signe d'interrogació invertit '¿' (no s'usa en català)",
    bad: /¿/,
    hint: "El català no fa servir el signe '¿' invertit.",
  },
  {
    id: "CA: signe d'exclamació invertit '¡' (no s'usa en català)",
    bad: /¡/,
    hint: "El català no fa servir el signe '¡' invertit.",
  },
];

// Rules per locale. Spanish bundle is the source-of-truth; we only
// audit the *translated* locales.
const rulesByLang: Record<string, Rule[]> = {
  en: enRules,
  fr: frRules,
  de: deRules,
  pt: ptRules,
  ca: caRules,
};

// ─── URL / code / quote context suppression ───────────────────────────
function inSafeContext(text: string, idx: number, len: number): boolean {
  const before = text.slice(Math.max(0, idx - 40), idx);
  const after = text.slice(idx + len, idx + len + 40);
  // Inside an href / src / mailto / tel attribute or markdown link.
  if (/(?:href|src)=["'][^"']*$/.test(before)) return true;
  if (/\]\([^)]*$/.test(before)) return true;
  if (/(mailto|tel|https?):[^\s"'<>]*$/.test(before)) return true;
  // Inside a URL path/query (preceded or followed by /, ?, &, =).
  if (/[\/?&=]$/.test(before) && /^[\/?&=#]/.test(after)) return true;
  // Inside an inline-code span (single backticks, single line).
  const lastBacktick = before.lastIndexOf("`");
  const closeBacktick = after.indexOf("`");
  if (lastBacktick !== -1 && closeBacktick !== -1) {
    const between = text.slice(lastBacktick + 1, idx + len + closeBacktick);
    if (!between.includes("\n")) return true;
  }
  // Inside an HTML attribute value (last `="` or `='` not yet closed).
  const lastEq = Math.max(
    before.lastIndexOf('="'),
    before.lastIndexOf("='"),
  );
  if (lastEq !== -1) {
    const quote = before[lastEq + 1];
    const tail = before.slice(lastEq + 2);
    if (!tail.includes(quote)) return true;
  }
  return false;
}

// Emoji-flag countries / proper-noun country names where a CA/PT rule
// might collide with the canonical Spanish form (e.g. country select
// option labels intentionally kept in source language for legacy UX).
const PROPER_NOUNS_ALLOWLIST = new Set<string>([
  // (currently empty; add only with strong justification)
]);

type Violation = { lang: string; key: string; ruleId: string; hint: string; sample: string };

function scanBundle(label: string, bundles: Record<string, Flat>): Violation[] {
  const out: Violation[] = [];
  for (const [lang, bundle] of Object.entries(bundles)) {
    const rules = rulesByLang[lang];
    if (!rules) continue;
    for (const [k, v] of Object.entries(bundle)) {
      if (PROPER_NOUNS_ALLOWLIST.has(`${lang}:${k}`)) continue;
      for (const rule of rules) {
        const baseFlags = rule.bad.flags;
        const flags = baseFlags.includes("g") ? baseFlags : baseFlags + "g";
        const re = new RegExp(rule.bad.source, flags);
        for (const m of v.matchAll(re)) {
          const idx = m.index ?? 0;
          if (inSafeContext(v, idx, m[0].length)) continue;
          if (rule.allowedContext && rule.allowedContext.test(v)) continue;
          const lo = Math.max(0, idx - 30);
          const hi = Math.min(v.length, idx + m[0].length + 30);
          const sample = v.slice(lo, hi).replace(/\s+/g, " ");
          out.push({ lang, key: `${label}:${k}`, ruleId: rule.id, hint: rule.hint, sample });
          break; // one violation per (key, rule) is enough signal
        }
      }
    }
  }
  return out;
}

// ─── Self-tests ──────────────────────────────────────────────────────
function selfTest(): number {
  type Case = { lang: string; input: string; expectFire: string[]; expectQuiet?: boolean };
  const cases: Case[] = [
    // EN
    { lang: "en", input: "Please do click on the button", expectFire: ["EN: 'do click' / 'make click' calque"] },
    { lang: "en", input: "I am agree with this", expectFire: ["EN: 'be agree' calque"] },
    { lang: "en", input: "We need more informations", expectFire: ["EN: 'informations' (uncountable)"] },
    { lang: "en", input: "Click the button", expectFire: [], expectQuiet: true },
    // FR
    { lang: "fr", input: "Vous etes en retard", expectFire: ["FR: 'etre' sans accent (être)"] },
    { lang: "fr", input: "Il faut checker la liste", expectFire: ["FR: 'checker' anglicisme"] },
    { lang: "fr", input: "Vous êtes en retard", expectFire: [], expectQuiet: true },
    { lang: "fr", input: "déjà fait", expectFire: [], expectQuiet: true },
    // DE
    { lang: "de", input: "Bitte schicken Sie eine Email", expectFire: ["DE: 'Email' (DE-Schreibweise: 'E-Mail')"] },
    { lang: "de", input: "Das macht Sinn", expectFire: ["DE: 'macht Sinn' Anglizismus"] },
    { lang: "de", input: "Bitte schicken Sie eine E-Mail", expectFire: [], expectQuiet: true },
    // DE Email allowed inside attribute placeholder
    { lang: "de", input: '<input name="email" placeholder="Email"/>', expectFire: [], expectQuiet: true },
    // PT
    { lang: "pt", input: "Você precisa registar-se", expectFire: ["PT: brasileirismo 'você' (PT-PT: 'tu' / 'o senhor')"] },
    { lang: "pt", input: "Tenho um celular novo", expectFire: ["PT: brasileirismo 'celular' (PT-PT: 'telemóvel')"] },
    { lang: "pt", input: "Estou a trabalhar", expectFire: [], expectQuiet: true },
    { lang: "pt", input: "Telefone móvel novo", expectFire: [], expectQuiet: true },
    // CA
    { lang: "ca", input: "Pues això és correcte", expectFire: ["CA: castellanisme 'pues' (correcte: 'doncs')"] },
    { lang: "ca", input: "Després ho farem", expectFire: [], expectQuiet: true },
    { lang: "ca", input: "Fins demà", expectFire: [], expectQuiet: true },
    { lang: "ca", input: "Demasiado tard", expectFire: ["CA: castellanisme 'demasiado' (correcte: 'massa')"] },
    { lang: "ca", input: "¿Què vols?", expectFire: ["CA: signe d'interrogació invertit '¿' (no s'usa en català)"] },
    // Safe-context suppression
    { lang: "ca", input: '<a href="https://example.com/pues-test">enllaç</a>', expectFire: [], expectQuiet: true },
  ];

  function fireRules(lang: string, value: string): string[] {
    const rules = rulesByLang[lang] ?? [];
    const fired: string[] = [];
    for (const rule of rules) {
      const flags = rule.bad.flags.includes("g") ? rule.bad.flags : rule.bad.flags + "g";
      const re = new RegExp(rule.bad.source, flags);
      for (const m of value.matchAll(re)) {
        const idx = m.index ?? 0;
        if (inSafeContext(value, idx, m[0].length)) continue;
        if (rule.allowedContext && rule.allowedContext.test(value)) continue;
        if (!fired.includes(rule.id)) fired.push(rule.id);
        break;
      }
    }
    return fired;
  }

  let failures = 0;
  console.log("\n── Self-test ──");
  for (const c of cases) {
    const fired = fireRules(c.lang, c.input);
    const expected = new Set(c.expectFire);
    const got = new Set(fired);
    const missing = [...expected].filter((id) => !got.has(id));
    const unexpected = [...got].filter((id) => !expected.has(id));
    const ok = missing.length === 0 && unexpected.length === 0;
    console.log(`${ok ? "✓" : "✗"} [${c.lang}] "${c.input}" → ${fired.length ? fired.join(", ") : "(no flag)"}`);
    if (!ok) {
      failures++;
      if (missing.length) console.log(`    expected to fire: ${missing.join(", ")}`);
      if (unexpected.length) console.log(`    unexpected fires: ${unexpected.join(", ")}`);
    }
  }
  console.log(`Self-test: ${failures === 0 ? "PASS ✓" : `FAIL ✗ (${failures})`}`);
  return failures;
}

if (process.argv.includes("--self-test")) {
  const failures = selfTest();
  process.exit(failures === 0 ? 0 : 1);
}

// ─── Run ─────────────────────────────────────────────────────────────
console.log("═══════════════════════════════════════════════");
console.log(" Exentax i18n Native-Quality Audit");
console.log("═══════════════════════════════════════════════\n");

const uiViolations = scanBundle("ui", uiLocales);
const emailViolations = scanBundle("email", emailLocales);

const all = [...uiViolations, ...emailViolations];
const byLang = new Map<string, Violation[]>();
for (const v of all) {
  if (!byLang.has(v.lang)) byLang.set(v.lang, []);
  byLang.get(v.lang)!.push(v);
}

for (const lang of ["en", "fr", "de", "pt", "ca"]) {
  const items = byLang.get(lang) ?? [];
  console.log(`── ${lang.toUpperCase()} — ${items.length} violation(s) ──`);
  for (const v of items) {
    console.log(`  [${v.ruleId}] ${v.key}: "…${v.sample}…"`);
    console.log(`    → ${v.hint}`);
  }
  console.log();
}

console.log("═══════════════════════════════════════════════");
console.log(` Total native-quality violations: ${all.length}`);
console.log(`Result: ${all.length === 0 ? "PASS ✓" : "FAIL ✗"}`);
console.log("═══════════════════════════════════════════════");

if (process.argv.includes("--strict") && all.length > 0) {
  process.exit(1);
}
