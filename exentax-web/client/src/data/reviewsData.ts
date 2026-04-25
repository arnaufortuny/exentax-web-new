export interface Review {
  id: string;
  author: string;
  countryCode: string;
  countryFlag: string;
  /** Literal source label (e.g. "16 feb 2026 (actualizada)" / "hace 3 días"). Preserved verbatim from Trustpilot. */
  dateLabel: string;
  /** ISO 8601 date (YYYY-MM-DD) of the review, used for SEO structured data. */
  datePublished: string;
  rating: number;
  title: string;
  body: string;
  url: string;
}

/**
 * Single source of truth for the aggregate review headline displayed across
 * the site. The number reflects Exentax's verified Trustpilot total at time
 * of writing — not the length of the showcased `TRUSTPILOT_REVIEWS` array,
 * which is just a curated sample. Anything that emits an `AggregateRating`
 * (Organization JSON-LD in `index.html`, runtime Review graph in `home.tsx`,
 * service prerenders in `server/seo-content.ts`, audit scripts) should read
 * from this constant so the values never drift.
 *
 * Bump these two numbers when refreshing the Trustpilot snapshot.
 */
export const TRUSTPILOT_AGGREGATE = {
  ratingValue: "5.0",
  reviewCount: 127,
  bestRating: "5",
  worstRating: "1",
} as const;

export const TRUSTPILOT_REVIEWS: Review[] = [
  {
    id: "sergio-ruiz",
    author: "Sergio Ruiz",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    dateLabel: "14 feb 2026",
    datePublished: "2026-02-14",
    rating: 5,
    title: "siempre pendiente de cada detalle y de…",
    body: "siempre pendiente de cada detalle y de que todo salga perfecto. Transmiten mucha confianza y hacen que todo el proceso sea fácil y tranquilo. Sin duda, un servicio de 10 y una empresa en la que se puede confiar totalmente.",
    url: "https://es.trustpilot.com/reviews/69908071d4bb6c790a773fa3",
  },
  {
    id: "diego-santaella",
    author: "Diego Santaella Ponce",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    dateLabel: "16 feb 2026 (actualizada)",
    datePublished: "2026-02-16",
    rating: 5,
    title: "Transparencia y trato cercano",
    body: "Desde el primer momento fueron claros con el precio y con el proceso. Sin sorpresas ni costes ocultos. Me explicaron exactamente qué debía hacer, cómo hacerlo y cuándo hacerlo para no tener problemas de cumplimiento. Se nota que no buscan vender por vender, sino que entiendas bien tu situación y tomes decisiones con criterio. Trato cercano, respuestas rápidas y, sobre todo, sinceridad.",
    url: "https://es.trustpilot.com/reviews/6990ab44a16d0ceb1c3a5468",
  },
  {
    id: "beatriz-munoz",
    author: "Beatriz Muñoz",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    dateLabel: "14 feb 2026",
    datePublished: "2026-02-14",
    rating: 5,
    title: "Por fin alguien profesional en fiscalidad internacional",
    body: "Llevaba tiempo mirando opciones y todo me sonaba igual, ademas precios exagerados. Aquí me lo bajaron a tierra. Me dijeron lo que encajaba conmigo y lo que no, un precio bastante aceptable. Profesionales y además formaron mi LLC en 2 dias. Sin presión, sin exageraciones. Salí entendiendo mi estructura y, sobre todo, tranquila. Además se encargaron de que me aprobaran la cuenta en Mercury. Eso vale mucho! Los recomiendo!",
    url: "https://es.trustpilot.com/reviews/6990c59988c763d7ee8bebff",
  },
  {
    id: "digitalonia",
    author: "Digitalonia",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    dateLabel: "6 abr 2026",
    datePublished: "2026-04-06",
    rating: 5,
    title: "Muy eficaz servicio ademas lo que mas…",
    body: "Muy eficaz servicio ademas lo que mas me gusto fue el acompañamiento, hasta tener todas las cuentas bancarias ayudandome a crearlas y aconsejando sobre llevar una correcta contabilidad. Sin duda si tengo que hacer otra LLC repetire!",
    url: "https://es.trustpilot.com/reviews/69d3c71c99c19dba903eda35",
  },
  {
    id: "jan-b",
    author: "Jan B",
    countryCode: "CO",
    countryFlag: "🇨🇴",
    dateLabel: "8 abr 2026",
    datePublished: "2026-04-08",
    rating: 5,
    title: "Opinión Honesta...",
    body: "Rápidos, dan mucha claridad y resuelven cualquier duda al instante! Súper Profesionales. He trabajado con varias empresas en el sector y siempre te intentan sacar dinero por todo y cuando dejas de trabajar te intentan cambiar de nombre para que sigas pagando. Con Exentax nada que ver, muy contento.",
    url: "https://es.trustpilot.com/reviews/69d69e1203cc0fe69be45054",
  },
  {
    id: "tintali",
    author: "Tintali",
    countryCode: "ES",
    countryFlag: "🇪🇸",
    dateLabel: "hace 3 días",
    datePublished: "2026-04-16",
    rating: 5,
    title: "Muy buena experiencia con Exentax",
    body: "Muy buena experiencia con Exentax. Todo el proceso ha sido claro, rápido y sin complicaciones. Destacaría sobre todo la atención, ya que resolvieron mis dudas en todo momento y me sentí bien acompañado durante el servicio. Sin duda lo recomendaría a quien busque algo cómodo y fiable.",
    url: "https://es.trustpilot.com/reviews/69e09c8e232f4a490543b32d",
  },
];
