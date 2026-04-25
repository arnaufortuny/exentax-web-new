/*
 * blog-cta-routes — explicit per-slug CTA destination map for blog posts.
 *
 * Used by `pages/blog/post.tsx` (React `ArticleCTA`) and the markdown
 * injector script `scripts/blog-task16-inject-ctas.mjs` to keep the
 * post-article CTA destination consistent between the rendered card and
 * the inline body link.
 *
 * Each entry can specify:
 *   - `route`           primary destination (RouteKey, required)
 *   - `secondaryRoute`  optional secondary destination — used by
 *                       comparative articles where the reader may want
 *                       to dive into either of the compared topics.
 *
 * The mapping is curated per the editorial intent of each article: state
 * deep-dives go to the dedicated state subpage, the ITIN-themed posts
 * land on `service_itin`, the pricing / process posts land on the
 * services hub, the comparative articles get a primary + secondary
 * destination, and the rest fall back to the booking page.
 */
import type { RouteKey } from "@shared/routes";
import type { BlogCtaPatternId } from "@/data/blog-cta-library";

export interface BlogCtaTarget {
  route: RouteKey;
  secondaryRoute?: RouteKey;
  /**
   * Standardised CTA copy pattern (Task #15). When set, `ArticleCTA` pulls
   * its title / desc / primary label / WhatsApp message from the
   * `BLOG_CTA_LIBRARY`. When omitted, the legacy `blogPost.cta*` i18n keys
   * are used (default booking copy), preserving the previous behaviour.
   */
  pattern?: BlogCtaPatternId;
}

const MAP: Record<string, BlogCtaTarget> = {
  // --- New Mexico-anchored deep-dives -------------------------------------
  "privacidad-llc-americana-secreto-ventaja":         { route: "service_llc_nm", secondaryRoute: "our_services", pattern: "llc_state_compare" },
  "llc-no-paga-impuestos-eeuu-que-pasa-en-tu-pais":   { route: "service_llc_nm", pattern: "compliance_checkup" },

  // --- Wyoming-anchored deep-dives ----------------------------------------
  "llc-seguridad-juridica-proteccion-patrimonial":    { route: "service_llc_wy", secondaryRoute: "our_services", pattern: "llc_state_compare" },
  "llc-unica-estructura-holding-cuando-como-cuesta":  { route: "service_llc_wy", secondaryRoute: "our_services", pattern: "pricing_quote" },
  "holding-empresarial-como-funciona":                { route: "service_llc_wy", pattern: "services_overview" },

  // --- Delaware-anchored deep-dives ---------------------------------------
  "llc-desarrolladores-software-saas":                { route: "service_llc_de", secondaryRoute: "service_llc_wy", pattern: "llc_state_compare" },
  "escalar-negocio-digital-llc-americana":            { route: "service_llc_de", secondaryRoute: "service_llc_wy", pattern: "services_overview" },
  "diferencia-llc-corporation-s-corp-c-corp":         { route: "service_llc_de", pattern: "llc_state_compare" },

  // --- Florida-anchored deep-dives ----------------------------------------
  // (No purely-Florida slugs in the current corpus; the heuristic below
  // routes any future `florida` slug to the dedicated subpage with the
  // Florida-specific CTA pattern.)

  // --- Comparative state article ------------------------------------------
  "nuevo-mexico-vs-wyoming-vs-delaware":              { route: "our_services", secondaryRoute: "book", pattern: "llc_state_compare" },

  // --- ITIN-themed -------------------------------------------------------
  "como-obtener-itin-numero-fiscal-irs":              { route: "service_itin", pattern: "itin_help" },
  "itin-ssn-que-son-como-obtenerlos":                 { route: "service_itin", pattern: "itin_help" },

  // --- Pricing / process / "what is X" — services hub --------------------
  "cuanto-cuesta-constituir-llc":                     { route: "our_services", pattern: "pricing_quote" },
  "constituir-llc-proceso-paso-a-paso":               { route: "our_services", pattern: "services_overview" },
  "primer-mes-llc-que-esperar":                       { route: "our_services", pattern: "services_overview" },
  "documentos-llc-cuales-necesitas":                  { route: "our_services", pattern: "services_overview" },
  "ein-numero-fiscal-llc-como-obtenerlo":             { route: "our_services", pattern: "compliance_checkup" },
  "registered-agent-que-es-por-que-necesitas":        { route: "our_services", pattern: "compliance_checkup" },
  "operating-agreement-llc-que-es":                   { route: "our_services", pattern: "services_overview" },
  "que-es-irs-guia-duenos-llc":                       { route: "our_services", pattern: "compliance_checkup" },
  "boi-report-fincen-guia-completa-2026":             { route: "our_services", pattern: "compliance_checkup" },
  "form-5472-que-es-como-presentarlo":                { route: "our_services", pattern: "compliance_checkup" },
  "irs-1120-5472-que-son-cuando-aplican":             { route: "our_services", pattern: "compliance_checkup" },
  "extension-irs-form-1120-como-solicitarla":         { route: "our_services", pattern: "compliance_checkup" },
  "que-pasa-si-no-presentas-5472-multas-irs":         { route: "our_services", pattern: "compliance_checkup" },
  "mantenimiento-anual-llc-obligaciones":             { route: "our_services", pattern: "compliance_checkup" },
  "tributacion-pass-through-llc-como-funciona":       { route: "our_services", pattern: "services_overview" },
  "tributacion-llc-segun-actividad-economica":        { route: "our_services", pattern: "services_overview" },
  "single-member-multi-member-llc-implicaciones-fiscales": { route: "our_services", pattern: "services_overview" },
  "residentes-no-residentes-llc-diferencias":         { route: "our_services", pattern: "services_overview" },
  "fiscalidad-llc-por-pais-residencia":               { route: "our_services", pattern: "services_overview" },
  "ventajas-desventajas-llc-no-residentes":           { route: "our_services", pattern: "book_consultation" },
  "por-que-abrir-llc-estados-unidos-ventajas":        { route: "our_services", pattern: "book_consultation" },
  "llc-estados-unidos-guia-completa-2026":            { route: "our_services", pattern: "services_overview" },
  "llc-alternativa-autonomo-espana":                  { route: "our_services", pattern: "pricing_quote" },
  "autonomo-espana-vs-llc-estados-unidos":            { route: "our_services", pattern: "pricing_quote" },

  // --- CRS / FATCA / international info-exchange deep-dives --------------
  "crs-2-0-carf-por-que-usa-no-firmara-llc":          { route: "our_services", pattern: "compliance_checkup" },

  // --- Banking & ops fall back to booking ---------------------------------
  // (every slug not listed above resolves to `book` via DEFAULT)
};

const DEFAULT: BlogCtaTarget = { route: "book", pattern: "book_consultation" };

const HEURISTIC: Array<{ re: RegExp; route: RouteKey; pattern: BlogCtaPatternId }> = [
  { re: /\bnuevo-mexico\b/, route: "service_llc_nm", pattern: "llc_state_compare" },
  { re: /\bwyoming\b/,      route: "service_llc_wy", pattern: "llc_state_compare" },
  { re: /\bdelaware\b/,     route: "service_llc_de", pattern: "llc_state_compare" },
  { re: /\bflorida\b/,      route: "service_llc_fl", pattern: "llc_florida_specific" },
  { re: /\bitin\b/,         route: "service_itin",   pattern: "itin_help" },
];

export function getBlogCtaTarget(slug: string): BlogCtaTarget {
  if (slug in MAP) return MAP[slug];
  for (const r of HEURISTIC) if (r.re.test(slug)) return { route: r.route, pattern: r.pattern };
  return DEFAULT;
}

/** Convenience: primary route only. Kept for legacy callers. */
export function getBlogCtaRoute(slug: string): RouteKey {
  return getBlogCtaTarget(slug).route;
}
