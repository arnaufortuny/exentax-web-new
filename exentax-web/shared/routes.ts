export const SUPPORTED_LANGS = ["es", "en", "fr", "de", "pt", "ca"] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export type RouteKey =
  | "home"
  | "how_we_work"
  | "our_services"
  | "about_llc"
  | "faq"
  | "book"
  | "pillar_open_llc"
  | "service_llc_nm"
  | "service_llc_wy"
  | "service_llc_de"
  | "service_llc_fl"
  | "service_itin"
  | "legal_terms"
  | "legal_privacy"
  | "legal_cookies"
  | "legal_refunds"
  | "legal_disclaimer";

export const ROUTE_SLUGS: Record<RouteKey, Record<SupportedLang, string>> = {
  home:             { es: "",                          en: "",                           fr: "",                              de: "",                      pt: "",                         ca: "" },
  how_we_work:      { es: "como-trabajamos",           en: "how-we-work",                fr: "comment-nous-travaillons",      de: "wie-wir-arbeiten",      pt: "como-trabalhamos",         ca: "com-treballem" },
  our_services:     { es: "servicios",                 en: "services",                   fr: "services",                      de: "leistungen",            pt: "servicos",                 ca: "serveis" },
  about_llc:        { es: "sobre-las-llc",             en: "about-llc",                  fr: "a-propos-des-llc",              de: "uber-llc",              pt: "sobre-llc",                ca: "sobre-les-llc" },
  faq:              { es: "preguntas-frecuentes",      en: "faq",                        fr: "questions-frequentes",          de: "haufige-fragen",        pt: "perguntas-frequentes",     ca: "preguntes-frequents" },
  book:             { es: "agendar",                   en: "book",                       fr: "reserver",                      de: "buchen",                pt: "agendar",                  ca: "agendar" },
  pillar_open_llc:  { es: "abrir-llc-estados-unidos",  en: "open-llc-usa",               fr: "ouvrir-llc-etats-unis",         de: "llc-usa-eroeffnen",     pt: "abrir-llc-eua",            ca: "obrir-llc-eua" },
  service_llc_nm:   { es: "servicios/llc-nuevo-mexico",     en: "services/llc-new-mexico",      fr: "services/llc-nouveau-mexique",     de: "leistungen/llc-new-mexico",     pt: "servicos/llc-novo-mexico",  ca: "serveis/llc-nou-mexic" },
  service_llc_wy:   { es: "servicios/llc-wyoming",          en: "services/llc-wyoming",         fr: "services/llc-wyoming",             de: "leistungen/llc-wyoming",        pt: "servicos/llc-wyoming",      ca: "serveis/llc-wyoming" },
  service_llc_de:   { es: "servicios/llc-delaware",         en: "services/llc-delaware",        fr: "services/llc-delaware",            de: "leistungen/llc-delaware",       pt: "servicos/llc-delaware",     ca: "serveis/llc-delaware" },
  service_llc_fl:   { es: "servicios/llc-florida",          en: "services/llc-florida",         fr: "services/llc-floride",             de: "leistungen/llc-florida",        pt: "servicos/llc-florida",      ca: "serveis/llc-florida" },
  service_itin:     { es: "servicios/obten-tu-itin",        en: "services/get-your-itin",       fr: "services/obtiens-ton-itin",        de: "leistungen/hol-deine-itin",     pt: "servicos/obtenha-seu-itin", ca: "serveis/obte-el-teu-itin" },
  legal_terms:      { es: "legal/terminos",            en: "legal/terms",                fr: "legal/conditions",              de: "legal/agb",             pt: "legal/termos",             ca: "legal/termes" },
  legal_privacy:    { es: "legal/privacidad",          en: "legal/privacy",              fr: "legal/confidentialite",         de: "legal/datenschutz",     pt: "legal/privacidade",        ca: "legal/privacitat" },
  legal_cookies:    { es: "legal/cookies",             en: "legal/cookies",              fr: "legal/cookies",                 de: "legal/cookies",         pt: "legal/cookies",            ca: "legal/cookies" },
  legal_refunds:    { es: "legal/reembolsos",          en: "legal/refunds",              fr: "legal/remboursements",          de: "legal/erstattungen",    pt: "legal/reembolsos",         ca: "legal/reemborsaments" },
  legal_disclaimer: { es: "legal/disclaimer",          en: "legal/disclaimer",           fr: "legal/avertissement",           de: "legal/haftungsausschluss", pt: "legal/aviso-legal",     ca: "legal/avis-legal" },
};

export const ALL_ROUTE_KEYS = Object.keys(ROUTE_SLUGS) as RouteKey[];

const slugToRouteMap = new Map<string, { key: RouteKey; lang: SupportedLang }>();
const allLocalizedPaths = new Set<string>();
for (const key of ALL_ROUTE_KEYS) {
  for (const lang of SUPPORTED_LANGS) {
    const slug = ROUTE_SLUGS[key][lang];
    const fullPath = slug ? `/${lang}/${slug}` : `/${lang}`;
    slugToRouteMap.set(fullPath, { key, lang });
    allLocalizedPaths.add(fullPath);
  }
}

export function getLocalizedPath(key: RouteKey, lang: SupportedLang): string {
  const slug = ROUTE_SLUGS[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

export function resolveRoute(path: string): { key: RouteKey; lang: SupportedLang } | null {
  const clean = path.replace(/\/+$/, "") || "/";
  const match = slugToRouteMap.get(clean);
  if (match) return match;
  return null;
}

export const resolveServerRoute = resolveRoute;

export function getAllLocalizedPaths(): Set<string> {
  return allLocalizedPaths;
}

export function getEquivalentPath(currentPath: string, targetLang: SupportedLang): string {
  const clean = currentPath.replace(/\/+$/, "") || "/";

  const blogMatch = clean.match(/^\/(es|en|fr|de|pt|ca)\/blog(\/.*)?$/);
  if (blogMatch) {
    const rest = blogMatch[2] || "";
    return `/${targetLang}/blog${rest}`;
  }
  if (clean === "/blog" || clean.startsWith("/blog/")) {
    return `/${targetLang}${clean}`;
  }

  const resolved = resolveRoute(clean);
  if (resolved) {
    return getLocalizedPath(resolved.key, targetLang);
  }

  return `/${targetLang}`;
}

export function getLangFromPath(pathname: string): SupportedLang | null {
  const seg = pathname.split("/")[1] as SupportedLang;
  return seg && (SUPPORTED_LANGS as readonly SupportedLang[]).includes(seg) ? seg : null;
}
