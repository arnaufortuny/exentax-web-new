/*
 * blog-mid-cta-copy — single source of truth for the mid-article CTA (Task #11).
 * ---------------------------------------------------------------------------
 * Every blog article carries exactly one mid-article subtle CTA wrapped in
 * `<!-- exentax:calc-cta-v1 -->` markers (one block per article × 6 locales).
 * Before Task #11 each article rolled its own micro-pitch ("Pon números a tu
 * caso", "Mettez des chiffres sur votre cas", etc.) which drifted across
 * locales and was awkward to lint. Task #11 normalises every mid-article CTA
 * to one of the 5 approved phrasings:
 *
 *   1. calc_savings  → "Calcula cuánto ahorras (es gratis)"
 *   2. free_consult  → "Consulta gratuita sin compromiso"
 *   3. start_today   → "Empieza hoy 100% remoto"
 *   4. talk_to_team  → "Habla con nuestro equipo"
 *   5. discover_llc  → "Descubre si una LLC es para ti"
 *
 * Each phrasing carries a destination route key (resolved per locale via
 * `ROUTE_SLUGS`) and an optional hash. The variant chosen for each article
 * is derived from the editorial intent of its post-article CTA pattern
 * (`blog-cta-routes.ts`), so the mid-article hook always stays aligned with
 * the closing card without per-slug duplication.
 *
 * Editorial register matches `blog-cta-library.ts`:
 *   - DE uses formal "Sie".
 *   - FR uses formal "vous".
 *   - PT is European Portuguese (informal "tu" form to match the rest of
 *     the per-locale register).
 *   - CA is Catalan, "tu" form.
 *
 * The `BLOG_MID_CTA_COPY` constant and the `PATTERN_TO_VARIANT` map are
 * parsed from this file by `scripts/blog-mid-cta-rewrite.mjs` (rewriter)
 * and `scripts/blog-mid-cta-check.mjs` (CI guard). Keep the literal shape
 * intact: nested `{` / `}` blocks per variant and per language with
 * double-quoted string fields. Any drift will trip the parser.
 * ---------------------------------------------------------------------------
 */
import type { SupportedLang } from "@/i18n";
import type { RouteKey } from "@shared/routes";
import { ROUTE_SLUGS } from "@shared/routes";
import { getBlogCtaTarget } from "@/data/blog-cta-routes";
import type { BlogCtaPatternId } from "@/data/blog-cta-library";

export type BlogMidCtaVariantId =
  | "calc_savings"
  | "free_consult"
  | "start_today"
  | "talk_to_team"
  | "discover_llc";

export interface BlogMidCtaCopy {
  /** Visible label on the inline link — exactly one of the 5 approved phrasings. */
  label: string;
  /** Destination route key, resolved per locale via `ROUTE_SLUGS`. */
  route: RouteKey;
  /** Optional fragment appended to the resolved path (e.g. `#calculadora`). */
  hash?: string;
}

export const BLOG_MID_CTA_COPY: Record<
  BlogMidCtaVariantId,
  Record<SupportedLang, BlogMidCtaCopy>
> = {
  calc_savings: {
    es: { label: "Calcula cuánto ahorras (es gratis)", route: "home", hash: "#calculadora" },
    en: { label: "Calculate how much you save — it is free", route: "home", hash: "#calculadora" },
    fr: { label: "Calculez combien vous économisez (c'est gratuit)", route: "home", hash: "#calculadora" },
    de: { label: "Berechnen Sie, wie viel Sie sparen — kostenlos", route: "home", hash: "#calculadora" },
    pt: { label: "Calcula quanto poupas (é grátis)", route: "home", hash: "#calculadora" },
    ca: { label: "Calcula quant estalvies (és gratis)", route: "home", hash: "#calculadora" },
  },

  free_consult: {
    es: { label: "Consulta gratuita sin compromiso", route: "book" },
    en: { label: "Free consultation, no strings attached", route: "book" },
    fr: { label: "Consultation gratuite sans engagement", route: "book" },
    de: { label: "Kostenlose Beratung, unverbindlich", route: "book" },
    pt: { label: "Consulta gratuita sem compromisso", route: "book" },
    ca: { label: "Consulta gratuïta sense compromís", route: "book" },
  },

  start_today: {
    es: { label: "Empieza hoy 100% remoto", route: "our_services" },
    en: { label: "Start today, 100% remote", route: "our_services" },
    fr: { label: "Lancez-vous aujourd'hui, 100% à distance", route: "our_services" },
    de: { label: "Starten Sie heute, 100% remote", route: "our_services" },
    pt: { label: "Começa hoje, 100% remoto", route: "our_services" },
    ca: { label: "Comença avui, 100% remot", route: "our_services" },
  },

  talk_to_team: {
    es: { label: "Habla con nuestro equipo", route: "book" },
    en: { label: "Talk to our team", route: "book" },
    fr: { label: "Parlez à notre équipe", route: "book" },
    de: { label: "Sprechen Sie mit unserem Team", route: "book" },
    pt: { label: "Fala com a nossa equipa", route: "book" },
    ca: { label: "Parla amb el nostre equip", route: "book" },
  },

  discover_llc: {
    es: { label: "Descubre si una LLC es para ti", route: "our_services" },
    en: { label: "Find out whether an LLC fits your case", route: "our_services" },
    fr: { label: "Découvrez si une LLC est faite pour vous", route: "our_services" },
    de: { label: "Finden Sie heraus, ob eine LLC zu Ihnen passt", route: "our_services" },
    pt: { label: "Descobre se uma LLC é para ti", route: "our_services" },
    ca: { label: "Descobreix si una LLC és per a tu", route: "our_services" },
  },
};

/**
 * Maps the editorial CTA pattern (post-article card) to a mid-article
 * variant so the inline mid-article hook always stays aligned with the
 * closing card without per-slug duplication.
 */
export const MID_CTA_PATTERN_TO_VARIANT: Record<BlogCtaPatternId, BlogMidCtaVariantId> = {
  pricing_quote: "calc_savings",
  book_consultation: "free_consult",
  services_overview: "start_today",
  compliance_checkup: "talk_to_team",
  itin_help: "talk_to_team",
  llc_state_compare: "discover_llc",
  llc_florida_specific: "discover_llc",
};

export const ALL_MID_CTA_VARIANTS = Object.keys(BLOG_MID_CTA_COPY) as BlogMidCtaVariantId[];

/** Resolve the mid-article variant for a given article slug. */
export function getMidCtaVariant(slug: string): BlogMidCtaVariantId {
  const target = getBlogCtaTarget(slug);
  const pattern: BlogCtaPatternId = target.pattern ?? "book_consultation";
  return MID_CTA_PATTERN_TO_VARIANT[pattern] ?? "free_consult";
}

/** Locale-resolved mid-article copy for an article slug. */
export function getMidCtaCopy(slug: string, lang: SupportedLang): BlogMidCtaCopy {
  const variant = getMidCtaVariant(slug);
  return BLOG_MID_CTA_COPY[variant][lang];
}

/** Localised destination URL for the mid-article CTA of an article slug. */
export function getMidCtaHref(slug: string, lang: SupportedLang): string {
  const copy = getMidCtaCopy(slug, lang);
  const slugPath = ROUTE_SLUGS[copy.route][lang];
  const path = slugPath ? `/${lang}/${slugPath}` : `/${lang}`;
  return copy.hash ? `${path}${copy.hash}` : path;
}

/** All approved labels grouped by locale — useful for audits and tests. */
export const APPROVED_MID_CTA_LABELS_BY_LANG: Record<SupportedLang, string[]> = (() => {
  const langs: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];
  const out = {} as Record<SupportedLang, string[]>;
  for (const lang of langs) {
    out[lang] = ALL_MID_CTA_VARIANTS.map((v) => BLOG_MID_CTA_COPY[v][lang].label);
  }
  return out;
})();
