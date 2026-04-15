import { SUPPORTED_LANGS, type SupportedLang } from "./server-constants";

export type RouteKey =
  | "home"
  | "how_we_work"
  | "our_services"
  | "about_llc"
  | "faq"
  | "book"
  | "legal_terms"
  | "legal_privacy"
  | "legal_cookies"
  | "legal_refunds"
  | "legal_disclaimer";

export const ROUTE_SLUGS: Record<RouteKey, Record<SupportedLang, string>> = {
  home:             { es: "",                          en: "",                           fr: "",                              de: "",                      pt: "",                         ca: "" },
  how_we_work:      { es: "como-trabajamos",           en: "how-we-work",                fr: "comment-nous-travaillons",      de: "wie-wir-arbeiten",      pt: "como-trabalhamos",         ca: "com-treballem" },
  our_services:     { es: "nuestros-servicios",        en: "our-services",               fr: "nos-services",                  de: "unsere-leistungen",     pt: "nossos-servicos",          ca: "els-nostres-serveis" },
  about_llc:        { es: "sobre-las-llc",             en: "about-llc",                  fr: "a-propos-des-llc",              de: "uber-llc",              pt: "sobre-llc",                ca: "sobre-les-llc" },
  faq:              { es: "preguntas-frecuentes",      en: "faq",                        fr: "questions-frequentes",          de: "haufige-fragen",        pt: "perguntas-frequentes",     ca: "preguntes-frequents" },
  book:             { es: "agendar",                   en: "book",                       fr: "reserver",                      de: "buchen",                pt: "agendar",                  ca: "agendar" },
  legal_terms:      { es: "legal/terminos",            en: "legal/terms",                fr: "legal/conditions",              de: "legal/agb",             pt: "legal/termos",             ca: "legal/termes" },
  legal_privacy:    { es: "legal/privacidad",          en: "legal/privacy",              fr: "legal/confidentialite",         de: "legal/datenschutz",     pt: "legal/privacidade",        ca: "legal/privacitat" },
  legal_cookies:    { es: "legal/cookies",             en: "legal/cookies",              fr: "legal/cookies",                 de: "legal/cookies",         pt: "legal/cookies",            ca: "legal/cookies" },
  legal_refunds:    { es: "legal/reembolsos",          en: "legal/refunds",              fr: "legal/remboursements",          de: "legal/erstattungen",    pt: "legal/reembolsos",         ca: "legal/reemborsaments" },
  legal_disclaimer: { es: "legal/disclaimer",          en: "legal/disclaimer",           fr: "legal/avertissement",           de: "legal/haftungsausschluss", pt: "legal/aviso-legal",     ca: "legal/avis-legal" },
};

export const ALL_ROUTE_KEYS = Object.keys(ROUTE_SLUGS) as RouteKey[];

const allLocalizedPaths = new Set<string>();
for (const key of ALL_ROUTE_KEYS) {
  for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
    const slug = ROUTE_SLUGS[key as RouteKey][lang];
    const fullPath = slug ? `/${lang}/${slug}` : `/${lang}`;
    allLocalizedPaths.add(fullPath);
  }
}

export function getAllLocalizedPaths(): Set<string> {
  return allLocalizedPaths;
}

export function getLocalizedPath(key: RouteKey, lang: SupportedLang): string {
  const slug = ROUTE_SLUGS[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

export function resolveServerRoute(path: string): { key: RouteKey; lang: SupportedLang } | null {
  const clean = path.replace(/\/+$/, "") || "/";
  for (const key of ALL_ROUTE_KEYS) {
    for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
      const slug = ROUTE_SLUGS[key as RouteKey][lang];
      const fullPath = slug ? `/${lang}/${slug}` : `/${lang}`;
      if (clean === fullPath) return { key: key as RouteKey, lang };
    }
  }
  return null;
}
