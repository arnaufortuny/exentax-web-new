import { SITE_URL, BRAND_NAME, LEGAL_EMAIL, INSTAGRAM_URL, TIKTOK_URL, LINKEDIN_URL, type SupportedLang } from "./server-constants";
import { ROUTE_SLUGS, ALL_ROUTE_KEYS, getLocalizedPath, type RouteKey } from "./route-slugs";
const BASE_URL = SITE_URL.replace(/\/+$/, "");

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
}

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "Paga menos impuestos legalmente con tu LLC en EE.UU. | Exentax",
    description: "Reduce tu carga fiscal del 40% al 8-12% con una LLC en Estados Unidos. Constitución en 2 días, EIN, cuenta bancaria y compliance incluido. Asesoría estratégica personalizada.",
    canonical: BASE_URL,
  },
  "/blog": {
    title: "Blog de fiscalidad internacional y LLC en EE.UU. | Exentax",
    description: "Guías, estrategias y novedades sobre LLC en Estados Unidos, optimización fiscal, compliance IRS y ahorro de impuestos para freelancers y autónomos.",
    canonical: `${BASE_URL}/es/blog`,
  },
  "/blog/llc-estados-unidos-guia-completa-2026": {
    title: "LLC en Estados Unidos: guía completa para no residentes 2026 | Exentax",
    description: "Guía completa para constituir una LLC en EE.UU. siendo extranjero. Estados, costes, fiscalidad, errores frecuentes y cómo elegir la mejor opción.",
    canonical: `${BASE_URL}/es/blog/llc-estados-unidos-guia-completa-2026`,
  },
  "/blog/form-5472-que-es-como-presentarlo": {
    title: "Form 5472: qué es y cómo presentarlo correctamente | Exentax",
    description: "El Form 5472 es obligatorio para LLCs con dueños extranjeros. Aprende qué transacciones reportar, plazos de presentación y cómo cumplir sin complicaciones.",
    canonical: `${BASE_URL}/es/blog/form-5472-que-es-como-presentarlo`,
  },
  "/blog/nuevo-mexico-vs-wyoming-vs-delaware": {
    title: "Nuevo México vs Wyoming vs Delaware para tu LLC | Exentax",
    description: "Comparativa completa de los 3 mejores estados para constituir una LLC como no residente. Costes, privacidad, burocracia y para quién encaja cada uno.",
    canonical: `${BASE_URL}/es/blog/nuevo-mexico-vs-wyoming-vs-delaware`,
  },
  "/blog/ein-numero-fiscal-llc-como-obtenerlo": {
    title: "EIN: qué es y cómo obtener el número fiscal de tu LLC | Exentax",
    description: "El EIN es el número fiscal que el IRS asigna a tu LLC. Aprende cómo obtenerlo paso a paso siendo no residente, plazos, coste y errores frecuentes.",
    canonical: `${BASE_URL}/es/blog/ein-numero-fiscal-llc-como-obtenerlo`,
  },
  "/blog/cuenta-bancaria-mercury-llc-extranjero": {
    title: "Cómo abrir cuenta Mercury para tu LLC siendo extranjero | Exentax",
    description: "Guía paso a paso para abrir una cuenta bancaria en Mercury con tu LLC americana siendo no residente. Requisitos, plazos, documentos y alternativas.",
    canonical: `${BASE_URL}/es/blog/cuenta-bancaria-mercury-llc-extranjero`,
  },
  "/blog/autonomo-espana-vs-llc-estados-unidos": {
    title: "Autónomo en España vs LLC en EE.UU.: comparativa fiscal | Exentax",
    description: "Comparamos la carga fiscal de un autónomo en España (30-40%) con una LLC en Estados Unidos (hasta 0%). Números reales, ventajas y para quién tiene sentido.",
    canonical: `${BASE_URL}/es/blog/autonomo-espana-vs-llc-estados-unidos`,
  },
  "/blog/impuestos-clientes-internacionales-espana": {
    title: "Impuestos con clientes internacionales en España | Exentax",
    description: "Si facturas a clientes internacionales desde España, puedes reducir tu carga fiscal del 40% hasta un 0% legalmente. IVA, fiscalidad internacional y LLC explicados.",
    canonical: `${BASE_URL}/es/blog/impuestos-clientes-internacionales-espana`,
  },
  "/blog/pagar-cero-impuestos-legalmente-llc": {
    title: "¿Se puede pagar 0% de impuestos legalmente? | Exentax",
    description: "¿Es posible pagar cero impuestos de forma legal? Analizamos los 3 escenarios reales: LLC + residencia fiscal en país sin IRPF, Ley Beckham y régimen territorial.",
    canonical: `${BASE_URL}/es/blog/pagar-cero-impuestos-legalmente-llc`,
  },
  "/blog/nomada-digital-residencia-fiscal": {
    title: "Nómada digital: residencia fiscal y dónde tributar | Exentax",
    description: "Guía fiscal para nómadas digitales: regla de los 183 días, mejores países para tributar (Dubai, Portugal, Georgia, Paraguay) y cómo cambiar tu residencia fiscal.",
    canonical: `${BASE_URL}/es/blog/nomada-digital-residencia-fiscal`,
  },
  "/blog/criptomonedas-trading-llc-impuestos": {
    title: "Criptomonedas y trading con LLC: guía fiscal | Exentax",
    description: "Fiscalidad completa para traders de criptomonedas. Cómo tributar en España, ventajas de operar con LLC, Modelo 721, setup ideal y errores frecuentes.",
    canonical: `${BASE_URL}/es/blog/criptomonedas-trading-llc-impuestos`,
  },
  "/blog/iva-servicios-digitales-internacional": {
    title: "IVA en servicios digitales internacionales | Exentax",
    description: "Cuándo cobrar IVA en servicios digitales a clientes internacionales. Reglas B2B/B2C, operaciones intracomunitarias, Modelo 303/349, OSS y cómo la LLC simplifica todo.",
    canonical: `${BASE_URL}/es/blog/iva-servicios-digitales-internacional`,
  },
  "/blog/registered-agent-que-es-por-que-necesitas": {
    title: "Registered Agent: qué es y por qué lo necesitas | Exentax",
    description: "El Registered Agent es obligatorio para tu LLC. Qué hace, cuánto cuesta, qué pasa sin él y cómo elegir el mejor servicio de agente registrado en EE.UU.",
    canonical: `${BASE_URL}/es/blog/registered-agent-que-es-por-que-necesitas`,
  },
  "/blog/errores-fiscales-freelancers-espanoles": {
    title: "7 errores fiscales de freelancers españoles | Exentax",
    description: "Los 7 errores fiscales más costosos que cometen los freelancers en España. Deducciones, IVA internacional, pagos fraccionados y cómo evitar perder hasta 30.000€/año.",
    canonical: `${BASE_URL}/es/blog/errores-fiscales-freelancers-espanoles`,
  },
  "/blog/como-operar-llc-dia-a-dia": {
    title: "Cómo operar tu LLC en el día a día: guía práctica | Exentax",
    description: "Guía práctica para operar tu LLC americana: facturación, cobros, gastos, retiros y contabilidad. Todo lo que necesitas saber para el día a día de tu negocio.",
    canonical: `${BASE_URL}/es/blog/como-operar-llc-dia-a-dia`,
  },
  "/blog/operating-agreement-llc-que-es": {
    title: "Operating Agreement LLC: qué es y por qué lo necesitas | Exentax",
    description: "El Operating Agreement define las reglas internas de tu LLC. Qué incluye, por qué es imprescindible y cuándo actualizarlo. Guía completa para no residentes.",
    canonical: `${BASE_URL}/es/blog/operating-agreement-llc-que-es`,
  },
  "/blog/documentos-llc-cuales-necesitas": {
    title: "Documentos de tu LLC: cuáles necesitas y para qué sirven | Exentax",
    description: "Articles of Organization, EIN, Operating Agreement, BOI Report... Todos los documentos de tu LLC explicados: para qué sirven y cuándo los necesitas.",
    canonical: `${BASE_URL}/es/blog/documentos-llc-cuales-necesitas`,
  },
  "/blog/mantenimiento-anual-llc-obligaciones": {
    title: "Mantenimiento anual LLC: obligaciones, plazos y costes | Exentax",
    description: "Todo lo que necesitas hacer cada año para mantener tu LLC en regla: Annual Report, Form 5472, FBAR, Registered Agent. Plazos, costes y calendario completo.",
    canonical: `${BASE_URL}/es/blog/mantenimiento-anual-llc-obligaciones`,
  },
  "/blog/wise-business-llc-guia": {
    title: "Wise Business para tu LLC: guía completa | Exentax",
    description: "Wise Business para tu LLC: cómo abrirla, recibir pagos en múltiples divisas, convertir moneda y enviar dinero a tu cuenta personal. Guía completa.",
    canonical: `${BASE_URL}/es/blog/wise-business-llc-guia`,
  },
  "/blog/pasarelas-pago-llc-stripe-paypal-dodo": {
    title: "Pasarelas de pago para tu LLC: Stripe, PayPal y alternativas | Exentax",
    description: "Compara Stripe, PayPal y Dodo Payments para tu LLC americana. Comisiones, funcionalidades y cuál elegir según tu negocio. Guía completa.",
    canonical: `${BASE_URL}/es/blog/pasarelas-pago-llc-stripe-paypal-dodo`,
  },
  "/blog/amazon-ecommerce-llc-vender-online": {
    title: "Amazon y ecommerce con LLC: vender online desde cualquier país | Exentax",
    description: "Vende en Amazon, Shopify y Etsy con tu LLC americana. Acceso sin restricciones, Amazon FBA, Shopify Payments y cómo empezar desde cualquier país.",
    canonical: `${BASE_URL}/es/blog/amazon-ecommerce-llc-vender-online`,
  },
  "/blog/gastos-deducibles-llc-que-puedes-deducir": {
    title: "Gastos deducibles en tu LLC: qué puedes deducir | Exentax",
    description: "Guía completa de gastos deducibles en tu LLC americana: tecnología, servicios profesionales, marketing, viajes, formación. Qué sí y qué no puedes deducir.",
    canonical: `${BASE_URL}/es/blog/gastos-deducibles-llc-que-puedes-deducir`,
  },
  "/blog/residentes-no-residentes-llc-diferencias": {
    title: "LLC para residentes y no residentes: diferencias fiscales | Exentax",
    description: "Las diferencias fiscales entre tener una LLC como residente y no residente de EE.UU. Impuestos, obligaciones y por qué la LLC es tan ventajosa para extranjeros.",
    canonical: `${BASE_URL}/es/blog/residentes-no-residentes-llc-diferencias`,
  },
  "/blog/cambiar-divisas-llc-mejores-opciones": {
    title: "Cambiar divisas en tu LLC: Wise, Mercury y mejores opciones | Exentax",
    description: "Compara Wise, Mercury, bancos tradicionales y PayPal para cambiar divisas en tu LLC. Cómo ahorrar hasta 3-5% en cada conversión de moneda.",
    canonical: `${BASE_URL}/es/blog/cambiar-divisas-llc-mejores-opciones`,
  },
  "/blog/constituir-llc-proceso-paso-a-paso": {
    title: "Constituir una LLC paso a paso: guía completa | Exentax",
    description: "El proceso completo para constituir una LLC americana como no residente: elegir estado, nombre, Registered Agent, EIN, cuenta bancaria. Paso a paso.",
    canonical: `${BASE_URL}/es/blog/constituir-llc-proceso-paso-a-paso`,
  },
  "/blog/autonomos-espana-por-que-dejar-de-serlo": {
    title: "Por qué dejar de ser autónomo en España: alternativas legales | Exentax",
    description: "Si eres autónomo en España y facturas al extranjero, puedes estar pagando hasta un 47%. Hay alternativas legales como la LLC. Te explicamos las opciones.",
    canonical: `${BASE_URL}/es/blog/autonomos-espana-por-que-dejar-de-serlo`,
  },
  "/blog/bancos-vs-fintech-llc-donde-abrir-cuenta": {
    title: "Bancos vs Fintech para tu LLC: Mercury, Wise, Relay | Exentax",
    description: "Mercury, Wise, Relay y Revolut: ¿son bancos? ¿Son seguros? Diferencias entre bancos y fintech, FDIC, y cuál conviene para tu LLC americana.",
    canonical: `${BASE_URL}/es/blog/bancos-vs-fintech-llc-donde-abrir-cuenta`,
  },
  "/blog/tiempos-pagos-ach-wire-transfer": {
    title: "¿Cuánto tardan ACH y Wire Transfer? Tiempos reales | Exentax",
    description: "Tiempos reales de pago: ACH (1-3 días), Wire doméstico (horas), Wire internacional (1-5 días), Wise (1-2 días). Todo sobre plazos de pago en tu LLC.",
    canonical: `${BASE_URL}/es/blog/tiempos-pagos-ach-wire-transfer`,
  },
  "/blog/iban-swift-routing-number-que-son": {
    title: "IBAN, SWIFT y Routing Number: qué son y cuándo usarlos | Exentax",
    description: "IBAN, SWIFT/BIC y Routing Number explicados: qué son, cuándo usar cada uno, qué datos dar a clientes americanos, europeos e internacionales con tu LLC.",
    canonical: `${BASE_URL}/es/blog/iban-swift-routing-number-que-son`,
  },
  "/blog/cuanto-cuesta-constituir-llc": {
    title: "¿Cuánto cuesta constituir una LLC? Costes reales | Exentax",
    description: "Costes reales de constituir una LLC en Nuevo México, Wyoming y Delaware. Filing fees, Registered Agent, EIN, mantenimiento anual. Todo desglosado.",
    canonical: `${BASE_URL}/es/blog/cuanto-cuesta-constituir-llc`,
  },
  "/blog/ventajas-desventajas-llc-no-residentes": {
    title: "Ventajas y desventajas de una LLC para no residentes | Exentax",
    description: "Las ventajas reales (fiscalidad, protección, banca) y las desventajas reales (costes, compliance, complejidad) de una LLC. Sin filtros, sin humo.",
    canonical: `${BASE_URL}/es/blog/ventajas-desventajas-llc-no-residentes`,
  },
  "/blog/evitar-bloqueos-mercury-wise-revolut": {
    title: "Evitar bloqueos en Mercury, Wise y Revolut Business | Exentax",
    description: "Por qué bloquean cuentas de LLC en Mercury, Wise y Revolut. Cómo prevenirlo, qué documentación tener y qué hacer si te bloquean. Guía preventiva.",
    canonical: `${BASE_URL}/es/blog/evitar-bloqueos-mercury-wise-revolut`,
  },
  "/blog/que-es-irs-guia-duenos-llc": {
    title: "¿Qué es el IRS? Guía para dueños de LLC | Exentax",
    description: "El IRS es la agencia tributaria de EE.UU. Qué es, qué exige a dueños de LLC, plazos, multas y cómo cumplir con tus obligaciones fiscales. Guía completa.",
    canonical: `${BASE_URL}/es/blog/que-es-irs-guia-duenos-llc`,
  },
  "/blog/llc-seguridad-juridica-proteccion-patrimonial": {
    title: "LLC y seguridad jurídica: protección patrimonial | Exentax",
    description: "Una LLC separa tu patrimonio personal del negocio. Cómo funciona la protección, cuándo falla, y cómo mantenerla fuerte. Guía completa de seguridad jurídica.",
    canonical: `${BASE_URL}/es/blog/llc-seguridad-juridica-proteccion-patrimonial`,
  },
  "/blog/problemas-comunes-llc-como-evitarlos": {
    title: "7 problemas reales de una LLC en EE.UU. y cómo evitarlos | Exentax",
    description: "Form 5472 pendiente, bloqueos bancarios, pérdida de protección legal: los 7 problemas más comunes de una LLC americana y cómo prevenirlos con Exentax.",
    canonical: `${BASE_URL}/es/blog/problemas-comunes-llc-como-evitarlos`,
  },
  "/blog/fiscalidad-llc-por-pais-residencia": {
    title: "Cómo tributa tu LLC en tu país: España, México, Colombia, Argentina | Exentax",
    description: "Tu LLC americana paga $0 en EE.UU., pero debes declarar en tu país. Cómo funciona la tributación real en España, México, Colombia y Argentina.",
    canonical: `${BASE_URL}/es/blog/fiscalidad-llc-por-pais-residencia`,
  },
  "/blog/crs-cuentas-bancarias-llc-intercambio-informacion": {
    title: "CRS, cuentas bancarias y LLC: intercambio de información fiscal | Exentax",
    description: "¿Puede tu hacienda ver tu cuenta de Mercury? Cómo funciona el CRS, qué reportan las fintechs americanas y por qué la transparencia fiscal te beneficia.",
    canonical: `${BASE_URL}/es/blog/crs-cuentas-bancarias-llc-intercambio-informacion`,
  },
  "/blog/cuentas-bancarias-usa-reportan-hacienda-verdad": {
    title: "¿Las cuentas bancarias USA reportan a tu hacienda? La verdad | Exentax",
    description: "¿Mercury, Wise o Relay reportan a Hacienda en España o México? Cómo funciona el CRS, FATCA y qué información se comparte realmente.",
    canonical: `${BASE_URL}/es/blog/cuentas-bancarias-usa-reportan-hacienda-verdad`,
  },
  "/blog/privacidad-llc-americana-secreto-ventaja": {
    title: "Privacidad de una LLC americana: qué protege y qué no | Exentax",
    description: "Tu LLC en Nuevo México o Wyoming no publica tu nombre. Pero no es anónima. Te explicamos el nivel real de privacidad de una LLC americana.",
    canonical: `${BASE_URL}/es/blog/privacidad-llc-americana-secreto-ventaja`,
  },
  "/blog/boi-report-fincen-guia-completa-2026": {
    title: "BOI Report (FinCEN) 2026: guía completa para dueños de LLC | Exentax",
    description: "El BOI Report es obligatorio para toda LLC en EE.UU. Qué es, qué datos necesitas, plazos de presentación y cómo lo gestiona Exentax.",
    canonical: `${BASE_URL}/es/blog/boi-report-fincen-guia-completa-2026`,
  },
  "/blog/testaferros-prestanombres-llc-ilegal-riesgos": {
    title: "Testaferros y prestanombres en LLCs: por qué es ilegal | Exentax",
    description: "Poner tu LLC a nombre de otro es fraude fiscal y bancario. Alternativas legales para conseguir privacidad real en tu LLC americana.",
    canonical: `${BASE_URL}/es/blog/testaferros-prestanombres-llc-ilegal-riesgos`,
  },
  "/blog/separar-dinero-personal-llc-por-que-importa": {
    title: "Separar dinero personal y de tu LLC: por qué importa | Exentax",
    description: "Descubre por qué separar tus finanzas personales de las de tu LLC es la base de una estructura sólida. Protege tu patrimonio y simplifica tu gestión fiscal.",
    canonical: `${BASE_URL}/es/blog/separar-dinero-personal-llc-por-que-importa`,
  },
  "/blog/llc-creadores-contenido-youtube-twitch": {
    title: "LLC para creadores de contenido: YouTube, Twitch y podcasts | Exentax",
    description: "Cómo una LLC americana ayuda a creadores de contenido en YouTube, Twitch y podcasts a cobrar en dólares, facturar profesionalmente y operar sin fronteras.",
    canonical: `${BASE_URL}/es/blog/llc-creadores-contenido-youtube-twitch`,
  },
  "/blog/llc-agencias-marketing-digital": {
    title: "LLC para agencias de marketing digital | Exentax",
    description: "Cómo una LLC americana ayuda a agencias de marketing digital a facturar internacionalmente, cobrar en dólares y escalar sin límites geográficos.",
    canonical: `${BASE_URL}/es/blog/llc-agencias-marketing-digital`,
  },
  "/blog/primer-mes-llc-que-esperar": {
    title: "Tu primer mes con una LLC: qué esperar | Exentax",
    description: "Qué pasa exactamente después de constituir tu LLC: cuenta bancaria, primeras facturas, configuración de cobros y rutina operativa. Guía paso a paso del primer mes.",
    canonical: `${BASE_URL}/es/blog/primer-mes-llc-que-esperar`,
  },
  "/blog/llc-desarrolladores-software-saas": {
    title: "LLC para desarrolladores de software y SaaS | Exentax",
    description: "Por qué una LLC americana es la estructura ideal para desarrolladores de software y fundadores de SaaS. Cobro en dólares, Stripe, propiedad intelectual y más.",
    canonical: `${BASE_URL}/es/blog/llc-desarrolladores-software-saas`,
  },
  "/blog/escalar-negocio-digital-llc-americana": {
    title: "Cómo escalar tu negocio digital con una LLC americana | Exentax",
    description: "Una LLC americana no es solo fiscalidad. Es acceso a mercados globales, herramientas sin restricciones, credibilidad internacional y crecimiento sin burocracia.",
    canonical: `${BASE_URL}/es/blog/escalar-negocio-digital-llc-americana`,
  },
  "/blog/due-diligence-bancario-llc-americana": {
    title: "Due diligence bancario para tu LLC: qué verifican los bancos | Exentax",
    description: "Due diligence bancario para LLCs: qué documentos piden Mercury y otros bancos, qué verifican y cómo prepararte para abrir tu cuenta empresarial en EE.UU.",
    canonical: `${BASE_URL}/es/blog/due-diligence-bancario-llc-americana`,
  },
  "/blog/estructura-fiscal-optima-freelancer-internacional": {
    title: "Estructura fiscal óptima para freelancers internacionales 2026 | Exentax",
    description: "Compara autónomo vs LLC vs sociedad local para freelancers internacionales. Descubre la estructura fiscal que te ahorra más impuestos de forma legal.",
    canonical: `${BASE_URL}/es/blog/estructura-fiscal-optima-freelancer-internacional`,
  },
  "/blog/prevencion-blanqueo-capitales-llc": {
    title: "Prevención de blanqueo de capitales para tu LLC | Exentax",
    description: "Regulaciones AML, BSA, FATCA y CRS: cómo cumplir con la prevención de blanqueo de capitales si tienes una LLC en Estados Unidos. Guía completa.",
    canonical: `${BASE_URL}/es/blog/prevencion-blanqueo-capitales-llc`,
  },
  "/blog/fiscalidad-internacional-emprendedores-digitales": {
    title: "Fiscalidad internacional para emprendedores digitales | Exentax",
    description: "Residencia fiscal, doble imposición, establecimiento permanente: todo lo que un emprendedor digital necesita saber sobre fiscalidad internacional.",
    canonical: `${BASE_URL}/es/blog/fiscalidad-internacional-emprendedores-digitales`,
  },
  "/blog/extension-irs-form-1120-como-solicitarla": {
    title: "Form 7004: extensión del IRS para el Form 1120 | Exentax",
    description: "El Form 7004 te da 6 meses extra para presentar tu Form 1120. Es automático, gratis y lo usamos para todos nuestros clientes. Te explicamos cómo funciona.",
    canonical: `${BASE_URL}/es/blog/extension-irs-form-1120-como-solicitarla`,
  },
  "/blog/itin-ssn-que-son-como-obtenerlos": {
    title: "ITIN y SSN: qué son y cómo obtenerlos para tu LLC | Exentax",
    description: "ITIN vs SSN: qué necesitas para tu LLC como no residente, cómo solicitar el ITIN paso a paso y por qué en Exentax gestionamos todo el proceso por ti.",
    canonical: `${BASE_URL}/es/blog/itin-ssn-que-son-como-obtenerlos`,
  },
  "/blog/tributacion-pass-through-llc-como-funciona": {
    title: "Tributación Pass-Through de las LLC: cómo funciona | Exentax",
    description: "La tributación pass-through permite que tu LLC pague $0 de impuesto federal en EE.UU. Te explicamos cómo funciona, qué gastos puedes deducir y cómo aprovecharlo.",
    canonical: `${BASE_URL}/es/blog/tributacion-pass-through-llc-como-funciona`,
  },
  "/blog/por-que-abrir-llc-estados-unidos-ventajas": {
    title: "Por qué abrir una LLC en EE.UU.: privacidad, seguridad y ventajas fiscales | Exentax",
    description: "Privacidad, protección patrimonial, banca americana, fiscalidad optimizada y gastos deducibles: todas las ventajas reales de abrir una LLC en Estados Unidos.",
    canonical: `${BASE_URL}/es/blog/por-que-abrir-llc-estados-unidos-ventajas`,
  },
  "/links": {
    title: "Exentax",
    description: "Todos los enlaces de Exentax. WhatsApp, asesoría fiscal, calculadora fiscal, redes sociales.",
    canonical: `${BASE_URL}/links`,
    noindex: true,
  },
  "/start": {
    title: "Empieza aquí | Exentax",
    description: "Diseñamos estructuras fiscales internacionales para negocios digitales. Descubre si tiene sentido para tu caso en 60 segundos.",
    canonical: `${BASE_URL}/start`,
    noindex: true,
  },
  "/es": {
    title: "Paga menos impuestos legalmente con tu LLC en EE.UU. | Exentax",
    description: "Reduce tu carga fiscal del 40% al 8-12% con una LLC en Estados Unidos. Constitución en 2 días, EIN, cuenta bancaria y compliance incluido. Asesoría estratégica personalizada.",
    canonical: `${BASE_URL}/es`,
  },
  "/en": {
    title: "Pay less taxes legally with your US LLC | Exentax",
    description: "Reduce your tax burden from 40% to 8-12% with a US LLC. Formation in 2 days, EIN, bank account and compliance included. Personalized strategic consulting.",
    canonical: `${BASE_URL}/en`,
  },
  "/fr": {
    title: "Payez moins d'impôts légalement avec votre LLC aux USA | Exentax",
    description: "Réduisez votre charge fiscale de 40% à 8-12% avec une LLC aux États-Unis. Constitution en 2 jours, EIN, compte bancaire et compliance inclus.",
    canonical: `${BASE_URL}/fr`,
  },
  "/de": {
    title: "Zahlen Sie legal weniger Steuern mit Ihrer US-LLC | Exentax",
    description: "Reduzieren Sie Ihre Steuerlast von 40% auf 8-12% mit einer LLC in den USA. Gründung in 2 Tagen, EIN, Bankkonto und Compliance inklusive.",
    canonical: `${BASE_URL}/de`,
  },
  "/pt": {
    title: "Pague menos impostos legalmente com sua LLC nos EUA | Exentax",
    description: "Reduza sua carga tributária de 40% para 8-12% com uma LLC nos Estados Unidos. Constituição em 2 dias, EIN, conta bancária e compliance incluídos.",
    canonical: `${BASE_URL}/pt`,
  },
  "/ca": {
    title: "Paga menys impostos legalment amb la teva LLC als EUA | Exentax",
    description: "Redueix la teva càrrega fiscal del 40% al 8-12% amb una LLC als Estats Units. Constitució en 2 dies, EIN, compte bancari i compliance inclòs.",
    canonical: `${BASE_URL}/ca`,
  },
  "/es/como-trabajamos": {
    title: "Cómo funciona: tu LLC lista en 4 pasos | Exentax",
    description: "Asesoría estratégica → estructura personalizada → constitución en 2-4 días → compliance anual. Proceso claro, sin letra pequeña. Más de 127 clientes satisfechos.",
    canonical: `${BASE_URL}/es/como-trabajamos`,
  },
  "/en/how-we-work": {
    title: "How it works: your LLC ready in 4 steps | Exentax",
    description: "Strategic consulting → personalized structure → formation in 2-4 days → annual compliance. Clear process, no fine print. Over 127 satisfied clients.",
    canonical: `${BASE_URL}/en/how-we-work`,
  },
  "/fr/comment-nous-travaillons": {
    title: "Comment ça marche : votre LLC prête en 4 étapes | Exentax",
    description: "Conseil stratégique → structure personnalisée → constitution en 2-4 jours → compliance annuel. Processus clair, sans petits caractères.",
    canonical: `${BASE_URL}/fr/comment-nous-travaillons`,
  },
  "/de/wie-wir-arbeiten": {
    title: "So funktioniert's: Ihre LLC in 4 Schritten | Exentax",
    description: "Strategische Beratung → individuelle Struktur → Gründung in 2-4 Tagen → jährliche Compliance. Klarer Prozess, ohne Kleingedrucktes.",
    canonical: `${BASE_URL}/de/wie-wir-arbeiten`,
  },
  "/pt/como-trabalhamos": {
    title: "Como funciona: sua LLC pronta em 4 passos | Exentax",
    description: "Consultoria estratégica → estrutura personalizada → constituição em 2-4 dias → compliance anual. Processo claro, sem letras miúdas.",
    canonical: `${BASE_URL}/pt/como-trabalhamos`,
  },
  "/ca/com-treballem": {
    title: "Com funciona: la teva LLC llesta en 4 passos | Exentax",
    description: "Assessoria estratègica → estructura personalitzada → constitució en 2-4 dies → compliance anual. Procés clar, sense lletra petita.",
    canonical: `${BASE_URL}/ca/com-treballem`,
  },
  "/es/nuestros-servicios": {
    title: "Servicios de constitución LLC en EE.UU. | Exentax",
    description: "LLC en Nuevo México, Wyoming o Delaware. Incluye EIN, Operating Agreement, cuenta Mercury, compliance y soporte 12 meses. Consulta nuestros planes.",
    canonical: `${BASE_URL}/es/nuestros-servicios`,
  },
  "/en/our-services": {
    title: "US LLC formation services | Exentax",
    description: "LLC in New Mexico, Wyoming or Delaware. Includes EIN, Operating Agreement, Mercury account, compliance and 12-month support. Check our plans.",
    canonical: `${BASE_URL}/en/our-services`,
  },
  "/fr/nos-services": {
    title: "Services de constitution de LLC aux États-Unis | Exentax",
    description: "LLC au Nouveau-Mexique, Wyoming ou Delaware. Inclut EIN, Operating Agreement, compte Mercury, compliance et support 12 mois.",
    canonical: `${BASE_URL}/fr/nos-services`,
  },
  "/de/unsere-leistungen": {
    title: "LLC-Gründungsservices in den USA | Exentax",
    description: "LLC in New Mexico, Wyoming oder Delaware. Inklusive EIN, Operating Agreement, Mercury-Konto, Compliance und 12 Monate Support.",
    canonical: `${BASE_URL}/de/unsere-leistungen`,
  },
  "/pt/nossos-servicos": {
    title: "Serviços de constituição de LLC nos EUA | Exentax",
    description: "LLC no Novo México, Wyoming ou Delaware. Inclui EIN, Operating Agreement, conta Mercury, compliance e suporte 12 meses.",
    canonical: `${BASE_URL}/pt/nossos-servicos`,
  },
  "/ca/els-nostres-serveis": {
    title: "Serveis de constitució de LLC als EUA | Exentax",
    description: "LLC a Nou Mèxic, Wyoming o Delaware. Inclou EIN, Operating Agreement, compte Mercury, compliance i suport 12 mesos.",
    canonical: `${BASE_URL}/ca/els-nostres-serveis`,
  },
  "/es/preguntas-frecuentes": {
    title: "Preguntas frecuentes sobre LLC en EE.UU. | Exentax",
    description: "¿Es legal? ¿Cuánto cuesta? ¿Qué impuestos pago? Respondemos todas las dudas sobre LLC en Estados Unidos para freelancers y autónomos.",
    canonical: `${BASE_URL}/es/preguntas-frecuentes`,
  },
  "/en/faq": {
    title: "Frequently asked questions about US LLCs | Exentax",
    description: "Is it legal? How much does it cost? What taxes do I pay? We answer all questions about US LLCs for freelancers and self-employed professionals.",
    canonical: `${BASE_URL}/en/faq`,
  },
  "/fr/questions-frequentes": {
    title: "Questions fréquentes sur les LLC aux USA | Exentax",
    description: "Est-ce légal ? Combien ça coûte ? Quels impôts je paie ? Toutes les réponses sur les LLC aux États-Unis pour freelances et indépendants.",
    canonical: `${BASE_URL}/fr/questions-frequentes`,
  },
  "/de/haufige-fragen": {
    title: "Häufige Fragen zu US-LLCs | Exentax",
    description: "Ist es legal? Was kostet es? Welche Steuern zahle ich? Alle Antworten zu LLCs in den USA für Freelancer und Selbständige.",
    canonical: `${BASE_URL}/de/haufige-fragen`,
  },
  "/pt/perguntas-frequentes": {
    title: "Perguntas frequentes sobre LLC nos EUA | Exentax",
    description: "É legal? Quanto custa? Quais impostos pago? Respondemos todas as dúvidas sobre LLC nos Estados Unidos para freelancers e autônomos.",
    canonical: `${BASE_URL}/pt/perguntas-frequentes`,
  },
  "/ca/preguntes-frequents": {
    title: "Preguntes freqüents sobre LLC als EUA | Exentax",
    description: "És legal? Quant costa? Quins impostos pago? Responem tots els dubtes sobre LLC als Estats Units per a freelancers i autònoms.",
    canonical: `${BASE_URL}/ca/preguntes-frequents`,
  },
  "/es/agendar": {
    title: "Asesoría fiscal estratégica 30 min — Analiza tu ahorro fiscal | Exentax",
    description: "Reserva tu asesoría fiscal estratégica. En 30 minutos analizamos tu situación fiscal real y calculamos cuánto puedes ahorrar con una LLC.",
    canonical: `${BASE_URL}/es/agendar`,
  },
  "/en/book": {
    title: "30-min strategic tax consultation — Analyze your tax savings | Exentax",
    description: "Book your strategic tax consultation. In 30 minutes we analyze your real tax situation and calculate how much you can save with an LLC.",
    canonical: `${BASE_URL}/en/book`,
  },
  "/fr/reserver": {
    title: "Consultation fiscale stratégique 30 min | Exentax",
    description: "Réservez votre consultation fiscale stratégique. En 30 minutes nous analysons votre situation fiscale et calculons vos économies avec une LLC.",
    canonical: `${BASE_URL}/fr/reserver`,
  },
  "/de/buchen": {
    title: "30-min strategische Steuerberatung | Exentax",
    description: "Buchen Sie Ihre strategische Steuerberatung. In 30 Minuten analysieren wir Ihre Steuersituation und berechnen Ihre Ersparnis mit einer LLC.",
    canonical: `${BASE_URL}/de/buchen`,
  },
  "/pt/agendar": {
    title: "Consultoria fiscal estratégica 30 min | Exentax",
    description: "Agende sua consultoria fiscal estratégica. Em 30 minutos analisamos sua situação fiscal real e calculamos quanto você pode economizar com uma LLC.",
    canonical: `${BASE_URL}/pt/agendar`,
  },
  "/ca/agendar": {
    title: "Assessoria fiscal estratègica 30 min | Exentax",
    description: "Reserva la teva assessoria fiscal estratègica. En 30 minuts analitzem la teva situació fiscal real i calculem quant pots estalviar amb una LLC.",
    canonical: `${BASE_URL}/ca/agendar`,
  },
  "/es/sobre-las-llc": {
    title: "LLC en EE.UU. para no residentes — Guía completa 2026 | Exentax",
    description: "Todo sobre LLC en Estados Unidos: ventajas fiscales, cómo constituirla paso a paso, banca en dólares, Stripe, obligaciones IRS y errores a evitar.",
    canonical: `${BASE_URL}/es/sobre-las-llc`,
  },
  "/en/about-llc": {
    title: "US LLC for non-residents — Complete guide 2026 | Exentax",
    description: "Everything about US LLCs: tax advantages, step-by-step formation, dollar banking, Stripe, IRS obligations and mistakes to avoid.",
    canonical: `${BASE_URL}/en/about-llc`,
  },
  "/fr/a-propos-des-llc": {
    title: "LLC aux USA pour non-résidents — Guide complet 2026 | Exentax",
    description: "Tout sur les LLC aux États-Unis : avantages fiscaux, constitution étape par étape, banque en dollars, Stripe, obligations IRS et erreurs à éviter.",
    canonical: `${BASE_URL}/fr/a-propos-des-llc`,
  },
  "/de/uber-llc": {
    title: "US-LLC für Nicht-Einwohner — Vollständiger Leitfaden 2026 | Exentax",
    description: "Alles über US-LLCs: Steuervorteile, Schritt-für-Schritt-Gründung, Dollar-Banking, Stripe, IRS-Pflichten und Fehler die man vermeiden sollte.",
    canonical: `${BASE_URL}/de/uber-llc`,
  },
  "/pt/sobre-llc": {
    title: "LLC nos EUA para não residentes — Guia completo 2026 | Exentax",
    description: "Tudo sobre LLC nos Estados Unidos: vantagens fiscais, como constituir passo a passo, banco em dólares, Stripe, obrigações IRS e erros a evitar.",
    canonical: `${BASE_URL}/pt/sobre-llc`,
  },
  "/ca/sobre-les-llc": {
    title: "LLC als EUA per a no residents — Guia completa 2026 | Exentax",
    description: "Tot sobre LLC als Estats Units: avantatges fiscals, com constituir-la pas a pas, banca en dòlars, Stripe, obligacions IRS i errors a evitar.",
    canonical: `${BASE_URL}/ca/sobre-les-llc`,
  },
  "/es/legal/terminos": {
    title: "Términos y condiciones | Exentax",
    description: "Términos y condiciones de Exentax. Constitución y gestión de LLC en EE.UU., planificación fiscal internacional y asesoría continua para autónomos.",
    canonical: `${BASE_URL}/es/legal/terminos`,
  },
  "/es/legal/privacidad": {
    title: "Política de privacidad | Exentax",
    description: "Política de privacidad de Exentax. Cómo recopilamos, usamos y protegemos tus datos personales en los servicios de optimización fiscal.",
    canonical: `${BASE_URL}/es/legal/privacidad`,
  },
  "/es/legal/cookies": {
    title: "Política de cookies | Exentax",
    description: "Información sobre el uso de cookies en exentax.com. Asesoría especializada en optimización fiscal legal para autónomos y freelancers.",
    canonical: `${BASE_URL}/es/legal/cookies`,
  },
  "/es/legal/reembolsos": {
    title: "Política de reembolsos | Exentax",
    description: "Política de reembolsos de Exentax. Cancelaciones, devoluciones y garantías en los servicios de constitución LLC y optimización fiscal.",
    canonical: `${BASE_URL}/es/legal/reembolsos`,
  },
  "/es/legal/disclaimer": {
    title: "Disclaimer legal y fiscal | Exentax",
    description: "Disclaimer legal y fiscal de Exentax. Información sobre la naturaleza de nuestros servicios, limitaciones de responsabilidad y obligaciones del cliente.",
    canonical: `${BASE_URL}/es/legal/disclaimer`,
  },
};

function buildI18nMeta(): Record<string, PageMeta> {
  const LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];
  const meta: Record<string, PageMeta> = {};

  const PAGE_TITLES: Record<RouteKey, Record<SupportedLang, string>> = {
    home: {
      es: "Paga menos impuestos legalmente con tu LLC en EE.UU. | Exentax",
      en: "Pay less taxes legally with your US LLC | Exentax",
      fr: "Payez moins d'impôts légalement avec votre LLC aux USA | Exentax",
      de: "Zahlen Sie legal weniger Steuern mit Ihrer US-LLC | Exentax",
      pt: "Pague menos impostos legalmente com sua LLC nos EUA | Exentax",
      ca: "Paga menys impostos legalment amb la teva LLC als EUA | Exentax",
    },
    our_services: {
      es: "Constitución y gestión de LLC en EE.UU. | Exentax",
      en: "US LLC Formation & Management for Non-Residents | Exentax",
      fr: "Constitution et gestion de LLC aux USA | Exentax",
      de: "US-LLC Gründung & Verwaltung für Nicht-Residenten | Exentax",
      pt: "Constituição e gestão de LLC nos EUA | Exentax",
      ca: "Constitució i gestió de LLC als EUA | Exentax",
    },
    how_we_work: {
      es: "Cómo funciona: tu LLC lista en 4 pasos | Exentax",
      en: "How It Works: Your LLC Ready in 4 Steps | Exentax",
      fr: "Comment ça marche : votre LLC en 4 étapes | Exentax",
      de: "So funktioniert es: Ihre LLC in 4 Schritten | Exentax",
      pt: "Como funciona: sua LLC pronta em 4 passos | Exentax",
      ca: "Com funciona: la teva LLC en 4 passos | Exentax",
    },
    about_llc: {
      es: "LLC en EE.UU. para no residentes — Guía completa 2026 | Exentax",
      en: "US LLC for non-residents · Complete guide 2026 | Exentax",
      fr: "LLC aux États-Unis pour non-résidents · Guide complet 2026 | Exentax",
      de: "US-LLC für Nicht-Residenten · Vollständiger Leitfaden 2026 | Exentax",
      pt: "LLC nos EUA para não residentes · Guia completo 2026 | Exentax",
      ca: "LLC als EUA per a no residents · Guia completa 2026 | Exentax",
    },
    faq: {
      es: "Preguntas frecuentes sobre LLC en EE.UU. | Exentax",
      en: "Frequently asked questions about US LLC | Exentax",
      fr: "Questions fréquentes sur les LLC aux États-Unis | Exentax",
      de: "Häufig gestellte Fragen zur US-LLC | Exentax",
      pt: "Perguntas frequentes sobre LLC nos EUA | Exentax",
      ca: "Preguntes freqüents sobre LLC als EUA | Exentax",
    },
    book: {
      es: "Asesoría fiscal gratuita 30 min | Exentax",
      en: "Free 30-min Tax Consultation | Exentax",
      fr: "Consultation fiscale gratuite 30 min | Exentax",
      de: "Kostenlose 30-Min-Steuerberatung | Exentax",
      pt: "Consultoria fiscal gratuita 30 min | Exentax",
      ca: "Assessoria fiscal gratuïta 30 min | Exentax",
    },
    legal_terms: {
      es: "Términos y condiciones | Exentax",
      en: "Terms and Conditions | Exentax",
      fr: "Conditions générales | Exentax",
      de: "Allgemeine Geschäftsbedingungen | Exentax",
      pt: "Termos e condições | Exentax",
      ca: "Termes i condicions | Exentax",
    },
    legal_privacy: {
      es: "Política de privacidad | Exentax",
      en: "Privacy Policy | Exentax",
      fr: "Politique de confidentialité | Exentax",
      de: "Datenschutzrichtlinie | Exentax",
      pt: "Política de privacidade | Exentax",
      ca: "Política de privacitat | Exentax",
    },
    legal_cookies: {
      es: "Política de cookies | Exentax",
      en: "Cookie Policy | Exentax",
      fr: "Politique de cookies | Exentax",
      de: "Cookie-Richtlinie | Exentax",
      pt: "Política de cookies | Exentax",
      ca: "Política de galetes | Exentax",
    },
    legal_refunds: {
      es: "Política de reembolsos | Exentax",
      en: "Refund Policy | Exentax",
      fr: "Politique de remboursement | Exentax",
      de: "Erstattungsrichtlinie | Exentax",
      pt: "Política de reembolso | Exentax",
      ca: "Política de reemborsament | Exentax",
    },
    legal_disclaimer: {
      es: "Disclaimer legal y fiscal | Exentax",
      en: "Legal and Tax Disclaimer | Exentax",
      fr: "Avertissement juridique et fiscal | Exentax",
      de: "Rechts- und Steuerhaftungsausschluss | Exentax",
      pt: "Aviso legal e fiscal | Exentax",
      ca: "Avís legal i fiscal | Exentax",
    },
  };

  const PAGE_DESCS: Record<RouteKey, Record<SupportedLang, string>> = {
    home: {
      es: "Reduce tu carga fiscal del 40% al 8-12% con una LLC en Estados Unidos. Constitución en 2 días, EIN, cuenta bancaria y compliance incluido. Asesoría estratégica personalizada.",
      en: "Reduce your tax burden from 40% to 8-12% with a US LLC. Formation in 2 days, EIN, bank account and compliance included. Strategic consultation.",
      fr: "Réduisez votre charge fiscale de 40% à 8-12% avec une LLC aux États-Unis. Constitution en 2 jours, EIN, compte bancaire et conformité inclus. Consultation stratégique.",
      de: "Reduzieren Sie Ihre Steuerlast von 40% auf 8-12% mit einer US-LLC. Gründung in 2 Tagen, EIN, Bankkonto und Compliance inklusive. Strategische Beratung.",
      pt: "Reduza sua carga tributária de 40% para 8-12% com uma LLC nos Estados Unidos. Constituição em 2 dias, EIN, conta bancária e compliance incluídos. Consultoria estratégica.",
      ca: "Redueix la teva càrrega fiscal del 40% al 8-12% amb una LLC als Estats Units. Constitució en 2 dies, EIN, compte bancari i compliance inclòs. Assessoria estratègica.",
    },
    our_services: {
      es: "LLC en Nuevo México, Wyoming o Delaware. Incluye EIN, Operating Agreement, cuenta Mercury, compliance y soporte 12 meses. Consulta nuestros planes.",
      en: "Form and manage your US LLC with expert support. Includes EIN, bank account, annual compliance and guidance on your international tax structure.",
      fr: "Constituez et gérez votre LLC américaine avec un support expert. Inclut EIN, compte bancaire, conformité annuelle et accompagnement dans votre structure fiscale internationale.",
      de: "Gründen und verwalten Sie Ihre US-LLC mit Expertenunterstützung. Beinhaltet EIN, Bankkonto, jährliche Compliance und Beratung zu Ihrer internationalen Steuerstruktur.",
      pt: "Constitua e gerencie sua LLC americana com suporte especializado. Inclui EIN, conta bancária, conformidade anual e acompanhamento na sua estrutura fiscal internacional.",
      ca: "Constitueix i gestiona la teva LLC als EUA amb suport expert. Inclou EIN, compte bancari, compliance anual i acompanyament en la teva estructura fiscal internacional.",
    },
    how_we_work: {
      es: "Asesoría estratégica, estructura personalizada, constitución en 2-4 días y compliance anual. Proceso claro, sin letra pequeña.",
      en: "Our process in 4 phases: free analysis, personalized structure, formation in 2-4 days and complete annual management. No surprises or fine print.",
      fr: "Notre processus en 4 phases : analyse gratuite, structure personnalisée, constitution en 2-4 jours et gestion annuelle complète. Sans surprises.",
      de: "Unser Prozess in 4 Phasen: kostenlose Analyse, personalisierte Struktur, Gründung in 2-4 Tagen und vollständige Jahresverwaltung. Ohne Überraschungen.",
      pt: "Nosso processo em 4 fases: análise gratuita, estrutura personalizada, constituição em 2-4 dias e gestão anual completa. Sem surpresas.",
      ca: "El nostre procés en 4 fases: anàlisi gratuïta, estructura personalitzada, constitució en 2-4 dies i gestió anual completa. Sense sorpreses.",
    },
    about_llc: {
      es: "Todo sobre LLC en Estados Unidos: ventajas fiscales, cómo constituirla paso a paso, banca en dólares, Stripe, obligaciones IRS y errores a evitar.",
      en: "Everything you need to know about US LLCs: tax benefits, how to invoice, legal protection, dollar banking and Stripe for non-residents.",
      fr: "Tout ce que vous devez savoir sur les LLC américaines : avantages fiscaux, facturation, protection juridique, banque en dollars et Stripe pour non-résidents.",
      de: "Alles, was Sie über US-LLCs wissen müssen: Steuervorteile, Rechnungsstellung, Rechtsschutz, Dollar-Banking und Stripe für Nicht-Residenten.",
      pt: "Tudo o que você precisa saber sobre LLCs americanas: benefícios fiscais, faturamento, proteção legal, conta em dólares e Stripe para não residentes.",
      ca: "Tot el que necessites saber sobre LLC als EUA: avantatges fiscals, com facturar, protecció legal, banca en dòlars i Stripe per a no residents.",
    },
    faq: {
      es: "¿Es legal? ¿Cuánto cuesta? ¿Qué impuestos pago? Respondemos todas las dudas sobre LLC en Estados Unidos para freelancers y autónomos.",
      en: "We answer all questions about US LLCs: legality, real savings, Wyoming/Delaware/New Mexico differences and tax obligations for freelancers.",
      fr: "Nous répondons à toutes les questions sur les LLC américaines : légalité, économies réelles, différences Wyoming/Delaware/Nouveau-Mexique et obligations fiscales.",
      de: "Wir beantworten alle Fragen zu US-LLCs: Legalität, reale Einsparungen, Wyoming/Delaware/New-Mexico-Unterschiede und Steuerpflichten für Freelancer.",
      pt: "Respondemos todas as dúvidas sobre LLCs americanas: legalidade, economia real, diferenças Wyoming/Delaware/Novo México e obrigações fiscais.",
      ca: "Responem totes les preguntes sobre LLC als EUA: legalitat, estalvi real, diferències Wyoming/Delaware/Nou Mèxic i obligacions fiscals.",
    },
    book: {
      es: "Reserva tu asesoría fiscal estratégica. En 30 minutos analizamos tu situación fiscal real y calculamos cuánto puedes ahorrar con una LLC.",
      en: "Book 30 min of strategic tax consultation. We analyze your situation and calculate your savings with a US LLC.",
      fr: "Réservez 30 min de consultation fiscale stratégique. Nous analysons votre situation et calculons vos économies avec une LLC américaine.",
      de: "Buchen Sie 30 Min strategische Steuerberatung. Wir analysieren Ihre Situation und berechnen Ihre Ersparnis mit einer US-LLC.",
      pt: "Reserve 30 minutos de consultoria fiscal estratégica. Analisamos sua situação e calculamos sua economia com uma LLC americana.",
      ca: "Reserva 30 min d'assessoria fiscal estratègica. Analitzem la teva situació i calculem el teu estalvi amb una LLC als EUA.",
    },
    legal_terms: {
      es: "Términos y condiciones de Exentax. Constitución y gestión de LLC en EE.UU., planificación fiscal internacional y asesoría continua para autónomos.",
      en: "Terms and conditions of Exentax. US LLC formation and management, international tax planning, and ongoing advisory for freelancers and entrepreneurs.",
      fr: "Conditions générales d'Exentax. Constitution et gestion de LLC aux États-Unis, planification fiscale internationale et conseil continu pour indépendants.",
      de: "AGB von Exentax. Gründung und Verwaltung von US-LLCs, internationale Steuerplanung und laufende Beratung für Freiberufler und Unternehmer.",
      pt: "Termos e condições da Exentax. Constituição e gestão de LLC nos EUA, planeamento fiscal internacional e assessoria contínua para freelancers.",
      ca: "Termes i condicions d'Exentax. Constitució i gestió de LLC als EUA, planificació fiscal internacional i assessoria contínua per a autònoms.",
    },
    legal_privacy: {
      es: "Política de privacidad de Exentax. Cómo recopilamos, usamos y protegemos tus datos personales en los servicios de optimización fiscal.",
      en: "Exentax privacy policy. How we collect, use, and protect your personal data in our tax optimization services.",
      fr: "Politique de confidentialité d'Exentax. Comment nous collectons, utilisons et protégeons vos données personnelles dans nos services d'optimisation fiscale.",
      de: "Datenschutzrichtlinie von Exentax. Wie wir Ihre personenbezogenen Daten in unseren Steueroptimierungsdiensten erheben, verwenden und schützen.",
      pt: "Política de privacidade da Exentax. Como coletamos, usamos e protegemos seus dados pessoais nos serviços de otimização fiscal.",
      ca: "Política de privacitat d'Exentax. Com recopilem, utilitzem i protegim les teves dades personals als serveis d'optimització fiscal.",
    },
    legal_cookies: {
      es: "Información sobre el uso de cookies en exentax.com. Asesoría especializada en optimización fiscal legal para autónomos y freelancers.",
      en: "Information about the use of cookies on exentax.com. Specialized advisory on legal tax optimization for freelancers.",
      fr: "Informations sur l'utilisation des cookies sur exentax.com. Conseil spécialisé en optimisation fiscale légale pour indépendants.",
      de: "Informationen über die Verwendung von Cookies auf exentax.com. Spezialisierte Beratung zur legalen Steueroptimierung für Freelancer.",
      pt: "Informações sobre o uso de cookies em exentax.com. Assessoria especializada em otimização fiscal legal para freelancers.",
      ca: "Informació sobre l'ús de galetes a exentax.com. Assessoria especialitzada en optimització fiscal legal per a autònoms.",
    },
    legal_refunds: {
      es: "Política de reembolsos de Exentax. Cancelaciones, devoluciones y garantías en los servicios de constitución LLC y optimización fiscal.",
      en: "Exentax refund policy. Cancellations, refunds, and guarantees for LLC formation and tax optimization services.",
      fr: "Politique de remboursement d'Exentax. Annulations, remboursements et garanties pour les services de constitution LLC et d'optimisation fiscale.",
      de: "Erstattungsrichtlinie von Exentax. Stornierungen, Erstattungen und Garantien für LLC-Gründungs- und Steueroptimierungsdienste.",
      pt: "Política de reembolso da Exentax. Cancelamentos, reembolsos e garantias nos serviços de constituição LLC e otimização fiscal.",
      ca: "Política de reemborsament d'Exentax. Cancel·lacions, devolucions i garanties als serveis de constitució LLC i optimització fiscal.",
    },
    legal_disclaimer: {
      es: "Disclaimer legal y fiscal de Exentax. Información sobre la naturaleza de nuestros servicios, limitaciones de responsabilidad y obligaciones del cliente.",
      en: "Exentax legal and tax disclaimer. Information about the nature of our services, liability limitations, and client obligations.",
      fr: "Avertissement juridique et fiscal d'Exentax. Informations sur la nature de nos services, limitations de responsabilité et obligations du client.",
      de: "Rechts- und Steuerhaftungsausschluss von Exentax. Informationen über die Art unserer Dienstleistungen, Haftungsbeschränkungen und Kundenpflichten.",
      pt: "Aviso legal e fiscal da Exentax. Informações sobre a natureza dos nossos serviços, limitações de responsabilidade e obrigações do cliente.",
      ca: "Avís legal i fiscal d'Exentax. Informació sobre la naturalesa dels nostres serveis, limitacions de responsabilitat i obligacions del client.",
    },
  };

  for (const key of ALL_ROUTE_KEYS) {
    for (const lang of LANGS) {
      const path = getLocalizedPath(key, lang);
      meta[path] = {
        title: PAGE_TITLES[key][lang],
        description: PAGE_DESCS[key][lang],
        canonical: `${BASE_URL}${path}`,
      };
    }
  }

  const BLOG_TITLES: Record<SupportedLang, string> = {
    es: "Blog sobre LLC, impuestos y fiscalidad internacional | Exentax",
    en: "Blog: US LLCs, international taxation & digital business | Exentax",
    fr: "Blog : LLC aux USA, fiscalité internationale et business digital | Exentax",
    de: "Blog: US-LLC, internationale Besteuerung & digitales Business | Exentax",
    pt: "Blog: LLC nos EUA, tributação internacional e negócios digitais | Exentax",
    ca: "Blog: LLC als EUA, fiscalitat internacional i negoci digital | Exentax",
  };
  const BLOG_DESCS: Record<SupportedLang, string> = {
    es: "Artículos sobre LLCs en EE.UU., fiscalidad internacional, Stripe, criptomonedas, nómadas digitales y optimización fiscal para freelancers.",
    en: "Articles on US LLCs, international taxation, Stripe, crypto, digital nomad tax planning and fiscal optimization for freelancers.",
    fr: "Articles sur les LLC américaines, la fiscalité internationale, Stripe, crypto, nomades numériques et optimisation fiscale pour freelances.",
    de: "Artikel über US-LLCs, internationale Besteuerung, Stripe, Krypto, digitale Nomaden und steuerliche Optimierung für Freelancer.",
    pt: "Artigos sobre LLCs americanas, tributação internacional, Stripe, cripto, nômades digitais e otimização fiscal para freelancers.",
    ca: "Articles sobre LLCs americanes, fiscalitat internacional, Stripe, cripto, nòmades digitals i optimització fiscal per a freelancers.",
  };
  for (const lang of LANGS) {
    meta[`/${lang}/blog`] = {
      title: BLOG_TITLES[lang],
      description: BLOG_DESCS[lang],
      canonical: `${BASE_URL}/${lang}/blog`,
    };
  }

  return meta;
}

export const PAGE_META_I18N: Record<string, PageMeta> = buildI18nMeta();

export const PAGE_SEO_CONTENT: Record<string, string> = {
  "home": `<article>
<h1>Exentax — Paga menos impuestos legalmente</h1>
<h2>Optimización fiscal internacional para autónomos y freelancers</h2>
<p>Estás pagando más impuestos de los necesarios. Y no tiene por qué ser así. Si facturas online, cobras desde distintas plataformas u operas en varios países, tu estructura fiscal no está optimizada.</p>
<p>En Exentax diseñamos estructuras fiscales internacionales legales para que pagues lo justo, con seguridad y sin improvisaciones. Reducimos tu carga fiscal del 40% hasta un 0% de forma completamente legal.</p>
<h2>¿Cuánto te cuesta no tener estructura?</h2>
<p>Configura tu situación y descúbrelo en 30 segundos con nuestra calculadora de ahorro fiscal. Disponible para España, Argentina, México, Colombia, Chile y Perú.</p>
<h3>Calculadora de ahorro fiscal gratuita</h3>
<p>Introduce tus ingresos mensuales, tu país de residencia fiscal y tu régimen actual. Compara al instante lo que pagas hoy con lo que pagarías con una LLC americana bien estructurada. Sin registro. Sin compromiso.</p>
<h2>Cómo nos diferenciamos</h2>
<ul>
<li>-37% reducción fiscal media para nuestros clientes</li>
<li>+31 clientes con estructura optimizada</li>
<li>Asesoría fiscal estratégica de 30 minutos por videollamada </li>
<li>Todo 100% remoto — sin necesidad de viajar a Estados Unidos</li>
<li>Compliance fiscal continuo — nunca estás solo</li>
</ul>
<h2>Servicios de constitución de LLC en Estados Unidos</h2>
<ul>
<li>LLC Nuevo México — El más económico, sin Annual Report</li>
<li>LLC Wyoming — Máxima privacidad y anonimato</li>
<li>LLC Delaware — Mejor marco legal para inversores</li>
</ul>
<p>Incluye: Articles of Organization, Operating Agreement, EIN (número fiscal ante el IRS), agente registrado, apertura de cuenta bancaria Mercury y soporte completo durante 12 meses.</p>
<h2>Mantenimiento anual de LLC</h2>
<ul>
<li>Mantenimiento Nuevo México — Declaraciones IRS incluidas</li>
<li>Mantenimiento Wyoming — Annual Report + compliance avanzado</li>
<li>Mantenimiento Delaware — Premium con optimización continua</li>
</ul>
<p>Declaraciones IRS (Form 1120, Form 5472), BOI Report, renovación agente registrado y compliance fiscal continuo. Annual Report en estados que lo exigen (Wyoming y Delaware).</p>
<h2>¿Para quién es Exentax?</h2>
<p>Freelancers, programadores, diseñadores, consultores, creadores de contenido, traders de criptomonedas y forex, e-commerce, SaaS, agencias de marketing y nómadas digitales que facturan internacionalmente.</p>
<h3>Países atendidos</h3>
<p>Trabajamos con autónomos y emprendedores de España, Argentina, México, Colombia, Chile y Perú. Nuestro equipo habla español e inglés y conoce la legislación fiscal de cada país.</p>
<p>Contacto: <a href="mailto:hola@exentax.com">hola@exentax.com</a> | <a href="https://wa.me/34614916910">WhatsApp +34 614 916 910</a></p>
<nav>
<a href="/es/sobre-las-llc">LLC en Estados Unidos — Guía completa 2026</a>
<a href="/es/como-trabajamos">Así trabajamos — Proceso paso a paso</a>
<a href="/es/nuestros-servicios">Planes y tarifas de constitución LLC</a>
<a href="/es/preguntas-frecuentes">Preguntas frecuentes sobre LLC y fiscalidad</a>
<a href="/es/agendar">Agendar asesoría fiscal estratégica</a>
</nav>
</article>`,

  "about_llc": `<article>
<h1>LLC en Estados Unidos para no residentes — Guía completa 2026</h1>
<h2>¿Qué es una LLC y por qué te interesa?</h2>
<p>Una LLC (Limited Liability Company) es una estructura empresarial en Estados Unidos que combina la protección de responsabilidad limitada con la flexibilidad fiscal. Para autónomos y freelancers no residentes, una LLC americana permite optimizar la carga fiscal del 40% hasta un 0% de forma completamente legal.</p>
<p>En esta guía explicamos todo lo que necesitas saber para abrir una LLC en Estados Unidos siendo extranjero: desde elegir el estado hasta las obligaciones fiscales anuales.</p>
<h2>Ventajas de una LLC en Estados Unidos para extranjeros</h2>
<ul>
<li>Sin impuesto federal sobre la renta para no residentes (Single-Member LLC clasificada como Disregarded Entity)</li>
<li>Protección de responsabilidad limitada — tu patrimonio personal protegido ante deudas empresariales</li>
<li>Acceso a cuentas bancarias americanas en dólares (Mercury, Relay)</li>
<li>Facturación internacional sin restricciones geográficas</li>
<li>Pasarelas de pago como Stripe, PayPal y Wise sin limitaciones</li>
<li>Privacidad y anonimato según el estado elegido (Wyoming ofrece máximo anonimato)</li>
<li>Credibilidad internacional con una empresa constituida en EE.UU.</li>
<li>Sin necesidad de residencia ni visa americana</li>
</ul>
<h2>Mejores estados para abrir una LLC en 2026</h2>
<h3>Nuevo México — El más económico para abrir una LLC</h3>
<p>Sin Annual Report, sin impuesto estatal sobre ingresos, la opción más económica para constituir y mantener una LLC. Ideal para quienes buscan el menor coste total de operación.</p>
<h3>Wyoming — Máxima privacidad para tu LLC</h3>
<p>Sin impuesto estatal, máximo anonimato (los miembros no son públicos), protección de activos superior y leyes empresariales modernas. Perfecto para quienes priorizan la privacidad.</p>
<h3>Delaware — Mejor marco legal y Court of Chancery</h3>
<p>Court of Chancery especializado en derecho empresarial, ideal para startups que buscan inversión. Recomendado si planeas levantar capital o trabajar con inversores estadounidenses.</p>
<h2>Cómo abrir una LLC en Estados Unidos paso a paso</h2>
<ol>
<li>Diagnóstico fiscal estratégico  — Analizamos tu situación fiscal, ingresos y país de residencia</li>
<li>Elección de estado — Recomendación personalizada entre Nuevo México, Wyoming y Delaware</li>
<li>Constitución de LLC — Presentación de Articles of Organization ante el estado elegido</li>
<li>Obtención del EIN — Número de identificación fiscal ante el IRS (equivalente al NIF)</li>
<li>Operating Agreement — Redacción del contrato operativo de tu LLC</li>
<li>Apertura de cuenta bancaria empresarial — Mercury o Relay en dólares</li>
<li>Configuración de Stripe y pasarelas de pago internacionales</li>
</ol>
<h2>Obligaciones fiscales de una LLC americana para no residentes</h2>
<ul>
<li>Form 5472 — Declaración informativa anual ante el IRS sobre transacciones con personas relacionadas</li>
<li>Form 1120 — Declaración de impuestos corporativos (con resultado cero para Single-Member LLC de no residente)</li>
<li>BOI Report — Declaración de beneficiarios efectivos ante FinCEN</li>
<li>Annual Report — Solo obligatorio en Wyoming y Delaware (Nuevo México no lo exige)</li>
<li>Renovación de Registered Agent — Agente registrado anual en el estado de constitución</li>
</ul>
<h2>¿Es legal tener una LLC en EE.UU. siendo residente fiscal en otro país?</h2>
<p>Sí, es completamente legal. La clave es la correcta declaración en tu país de residencia fiscal. Cada país tiene reglas diferentes y mecanismos específicos para declarar rentas del exterior. En Exentax te asesoramos sobre cómo hacerlo correctamente y optimizar tu carga fiscal total.</p>
<h2>¿Cuánto cuesta abrir y mantener una LLC?</h2>
<p>Constitución disponible en Nuevo México, Wyoming y Delaware. Sin costes ocultos ni permanencia. <a href="/es/nuestros-servicios">Consulta nuestros planes</a>.</p>
<p>En Exentax nos encargamos de todo el compliance fiscal por ti. <a href="/es/agendar">Agenda tu asesoría fiscal</a>.</p>
</article>`,

  "how_we_work": `<article>
<h1>Así Trabajamos — Optimización fiscal paso a paso</h1>
<h2>Un proceso claro, sin sorpresas</h2>
<p>En Exentax seguimos un proceso estructurado en 4 fases para optimizar tu fiscalidad de forma legal y segura. Todo 100% remoto, sin necesidad de viajar a Estados Unidos.</p>
<h2>Fase 1: Diagnóstico Fiscal Estratégico </h2>
<p>Videollamada de 30 minutos donde analizamos tu situación fiscal actual, tus ingresos, tu país de residencia fiscal y tu tipo de actividad profesional. Determinamos si una LLC americana es la mejor opción para tu caso concreto y calculamos tu ahorro estimado.</p>
<h2>Fase 2: Constitución de la LLC</h2>
<p>Nos encargamos de todo el proceso de constitución en el estado que mejor se ajuste a tu situación: Articles of Organization, Operating Agreement personalizado, obtención del EIN (número fiscal) ante el IRS, y designación de agente registrado. Proceso completado en 2-4 semanas.</p>
<h2>Fase 3: Apertura de Cuentas y Configuración</h2>
<p>Abrimos tu cuenta bancaria empresarial en Mercury o Relay para operar en dólares. Configuramos Stripe y las pasarelas de pago que necesites para facturar internacionalmente sin restricciones.</p>
<h2>Fase 4: Compliance Fiscal y Mantenimiento Continuo</h2>
<p>Gestión fiscal continua durante todo el año: presentación de Form 5472, Form 1120, BOI Report, renovación de agente registrado, Annual Report (Wyoming/Delaware), y asesoría fiscal permanente. Tu LLC siempre en regla con el IRS y las autoridades de tu país.</p>
<h2>¿Cuánto tiempo tarda todo el proceso?</h2>
<p>La constitución de la LLC tarda entre 2 y 4 semanas. La obtención del EIN puede tardar de 1 a 8 semanas adicionales según la carga del IRS. La apertura de cuenta bancaria es inmediata una vez tienes el EIN.</p>
<h2>¿Qué pasa después de la constitución?</h2>
<p>No te dejamos solo. El mantenimiento incluye todas las declaraciones fiscales, compliance continuo y acceso a asesoría siempre que lo necesites. <a href="/es/nuestros-servicios">Ver planes de mantenimiento</a>.</p>
<p><a href="/es/agendar">Agenda tu diagnóstico fiscal estratégico</a> y comienza el proceso hoy.</p>
</article>`,

  "our_services": `<article>
<h1>Planes y Tarifas — LLC en Estados Unidos para autónomos y freelancers</h1>
<h2>Constitución de LLC — Precio cerrado, sin sorpresas</h2>
<h3>LLC Nuevo México</h3>
<p>El estado más económico para abrir una LLC. Sin Annual Report ante el estado, sin impuesto estatal. Incluye: Articles of Organization, Operating Agreement, EIN, agente registrado 12 meses y apertura de cuenta bancaria Mercury. El mantenimiento anual más bajo del mercado.</p>
<h3>LLC Wyoming</h3>
<p>Máxima privacidad y anonimato. Sin impuesto estatal. Protección de activos superior. Incluye: Articles of Organization, Operating Agreement, EIN, agente registrado 12 meses y apertura de cuenta Mercury. Ideal para quienes valoran la discreción.</p>
<h3>LLC Delaware</h3>
<p>El mejor marco legal de EE.UU. con Court of Chancery especializado. Ideal para startups e inversores. Incluye: Articles of Organization, Operating Agreement, EIN, agente registrado 12 meses y apertura de cuenta Mercury. La opción preferida por venture capital.</p>
<h2>Mantenimiento Anual de LLC — Tu LLC siempre en regla</h2>
<h3>Mantenimiento Nuevo México</h3>
<p>Declaraciones IRS (Form 1120, Form 5472), BOI Report, renovación agente registrado, compliance fiscal anual y soporte experto. Nuevo México no requiere Annual Report, lo que reduce el coste anual.</p>
<h3>Mantenimiento Wyoming</h3>
<p>Todo lo del plan básico más Annual Report estatal, compliance FATCA/CRS, soporte prioritario y asesoría fiscal continua con revisiones periódicas.</p>
<h3>Mantenimiento Delaware</h3>
<p>Plan premium con compliance completo, Annual Report, Franchise Tax, optimización fiscal continua, soporte 24/7, asesoría ilimitada y revisión fiscal trimestral.</p>
<h2>Servicios adicionales</h2>
<ul>
<li>Obtención de ITIN (Individual Taxpayer Identification Number)</li>
<li>Asesoría fiscal estratégica de 30 minutos por videollamada (Google Meet)</li>
</ul>
<h2>¿Qué incluyen todos los planes de constitución?</h2>
<ul>
<li>Articles of Organization presentados ante el estado</li>
<li>Operating Agreement personalizado en inglés</li>
<li>Obtención del EIN (número fiscal IRS)</li>
<li>Agente registrado durante 12 meses</li>
<li>Apertura de cuenta bancaria Mercury en dólares</li>
<li>Configuración de Stripe para cobros internacionales</li>
<li>Soporte por email y WhatsApp durante todo el proceso</li>
</ul>
<p>Sin costes ocultos. Sin permanencia. Cancela cuando quieras. <a href="/es/agendar">Agenda tu asesoría fiscal</a>.</p>
</article>`,

  "faq": `<article>
<h1>Preguntas Frecuentes — LLC y Fiscalidad Internacional</h1>
<h2>Sobre LLC en Estados Unidos</h2>
<h3>¿Qué es una LLC?</h3>
<p>Una LLC (Limited Liability Company) es una estructura empresarial estadounidense que ofrece protección de responsabilidad limitada y flexibilidad fiscal. Para no residentes con Single-Member LLC, no hay impuesto federal sobre la renta en EE.UU.</p>
<h3>¿Necesito viajar a Estados Unidos para abrir una LLC?</h3>
<p>No. Todo el proceso es 100% remoto. Nos encargamos de la constitución, obtención del EIN, y apertura de cuenta bancaria sin que tengas que salir de tu país.</p>
<h3>¿Cuál es el mejor estado para mi LLC?</h3>
<p>Depende de tus prioridades: Nuevo México para menor coste, Wyoming para máxima privacidad, Delaware para el mejor marco legal (ideal si buscas inversores). <a href="/es/nuestros-servicios">Consulta los planes disponibles</a>.</p>
<h3>¿Cuánto tarda constituir una LLC?</h3>
<p>La constitución tarda entre 2 y 4 semanas. La obtención del EIN puede tardar de 1 a 8 semanas adicionales.</p>
<h3>¿Puedo tener una LLC siendo empleado por cuenta ajena?</h3>
<p>Sí. Puedes tener una LLC en EE.UU. mientras trabajas como empleado en tu país. Lo importante es que tus ingresos por la LLC sean de fuentes compatibles y declares correctamente en tu país de residencia.</p>
<h3>¿Qué diferencia hay entre una LLC y una Corporation (Inc)?</h3>
<p>La LLC es más flexible fiscalmente y tiene menos requisitos formales. Para no residentes, la Single-Member LLC es la estructura más eficiente porque no tributa a nivel federal en EE.UU. Una Corporation tributa al 21% federal.</p>
<h2>Sobre fiscalidad</h2>
<h3>¿Es legal optimizar impuestos con una LLC americana?</h3>
<p>Sí, es completamente legal. La optimización fiscal no es evasión. Se utilizan tratados internacionales y estructuras reconocidas por las autoridades fiscales.</p>
<h3>¿Tengo que declarar la LLC en mi país de residencia?</h3>
<p>Sí. La LLC debe declararse en tu país de residencia fiscal. En Exentax te asesoramos sobre cómo hacerlo correctamente.</p>
<h3>¿Qué formularios debo presentar al IRS?</h3>
<p>Form 1120 (declaración corporativa) junto con el Form 5472 (declaración informativa), ambos antes del 15 de marzo. También el BOI Report (beneficiarios efectivos) y el Annual Report estatal en Wyoming y Delaware (Nuevo México no lo exige). Nosotros nos encargamos de todo.</p>
<h3>¿Cómo afecta a mis impuestos personales tener una LLC en EE.UU.?</h3>
<p>Los ingresos de tu LLC se declaran según las reglas de tu país de residencia fiscal. La gran ventaja es que al no haber impuesto federal en EE.UU. para la LLC de no residente, no existe doble imposición. Además, puedes facturar sin IVA a clientes internacionales. Te asesoramos sobre la mejor forma de optimizar tu declaración.</p>
<h3>¿Qué pasa si no presento el Form 1120 + Form 5472 a tiempo?</h3>
<p>El IRS impone sanciones significativas por no presentar el Form 1120 y Form 5472 dentro de plazo. Es una obligación seria que en Exentax gestionamos siempre a tiempo.</p>
<h2>Sobre costes</h2>
<h3>¿Cuánto cuesta abrir una LLC?</h3>
<p>Ofrecemos planes de constitución en Nuevo México, Wyoming y Delaware. Incluye todo: constitución, EIN, agente registrado y cuenta bancaria. <a href="/es/agendar">Consulta con nosotros para tu presupuesto personalizado</a>.</p>
<h3>¿Cuánto cuesta el mantenimiento anual?</h3>
<p>El mantenimiento incluye declaraciones IRS, compliance y soporte. Annual Report incluido en estados que lo exigen. <a href="/es/agendar">Agenda una asesoría para conocer los costes</a>.</p>
<h3>¿Hay costes ocultos?</h3>
<p>No. Nuestros planes incluyen todo lo necesario. Sin permanencia, sin comisiones extra, sin sorpresas.</p>
<h2>Sobre cuentas bancarias y pagos</h2>
<h3>¿Puedo abrir una cuenta en Mercury o Relay sin viajar a EE.UU.?</h3>
<p>Sí. La apertura de cuenta bancaria en Mercury o Relay es 100% online. Solo necesitas tu LLC constituida y el EIN. Nosotros gestionamos todo el proceso.</p>
<h3>¿Puedo usar Stripe con mi LLC americana?</h3>
<p>Sí. Con una LLC en EE.UU. tienes acceso completo a Stripe sin las restricciones que aplican a cuentas de otros países. Puedes cobrar en dólares, euros y más de 135 divisas.</p>
<p>¿Más dudas? <a href="/es/agendar">Agenda una asesoría fiscal</a> o escríbenos a <a href="mailto:hola@exentax.com">hola@exentax.com</a>.</p>
</article>`,

  "book": `<article>
<h1>Asesoría Fiscal Estratégica — 30 Minutos por Videollamada</h1>
<h2>Diagnóstico fiscal personalizado para tu negocio digital</h2>
<p>Reserva una videollamada de 30 minutos con un asesor fiscal de Exentax. Analizamos tu situación fiscal actual y te indicamos si una LLC en Estados Unidos es la mejor opción para tu negocio digital.</p>
<h2>¿Qué incluye la asesoría fiscal estratégica?</h2>
<ul>
<li>Análisis completo de tu situación fiscal actual en tu país</li>
<li>Estimación personalizada de ahorro fiscal con estructura LLC</li>
<li>Recomendación de estado óptimo (Nuevo México, Wyoming o Delaware)</li>
<li>Respuesta a todas tus dudas sobre fiscalidad internacional</li>
<li>Plan de acción personalizado con pasos concretos</li>
<li>Simulación de costes: constitución + mantenimiento anual</li>
</ul>
<h2>¿Cómo funciona?</h2>
<ol>
<li>Selecciona fecha y hora disponible en el calendario</li>
<li>Rellena tus datos y cuéntanos brevemente tu situación</li>
<li>Recibe confirmación con enlace de Google Meet</li>
<li>Conéctate a la videollamada a la hora acordada</li>
</ol>
<h2>Horarios disponibles</h2>
<p>Lunes a viernes de 8:00 a 20:00 (hora de España peninsular, CET/CEST). Sesiones cada 30 minutos. Videollamada por Google Meet — sin necesidad de instalar nada.</p>
<h2>¿Para quién es esta asesoría?</h2>
<p>Para freelancers, autónomos, programadores, diseñadores, traders, creadores de contenido, agencias y cualquier profesional digital que facture más de 2.000€/mes y quiera explorar opciones de optimización fiscal legal.</p>
<p>Si la LLC no encaja contigo, te lo diremos directamente. <a href="https://wa.me/34614916910">También puedes contactarnos por WhatsApp</a>.</p>
</article>`,

  "/blog": `<article>
<h1>Blog — Fiscalidad internacional y LLC en Estados Unidos</h1>
<p>Artículos claros sobre optimización fiscal, LLC en Estados Unidos, compliance y estrategias legales para freelancers y emprendedores digitales de habla hispana.</p>
<nav>
<ul>
<li><a href="/blog/llc-estados-unidos-guia-completa-2026">LLC en Estados Unidos: guía completa para no residentes en 2026</a></li>
<li><a href="/blog/form-5472-que-es-como-presentarlo">Form 5472: qué es, quién debe presentarlo y cómo cumplir correctamente</a></li>
<li><a href="/blog/autonomo-espana-vs-llc-estados-unidos">Autónomo en España vs LLC en EE.UU.: comparativa fiscal completa</a></li>
<li><a href="/blog/nuevo-mexico-vs-wyoming-vs-delaware">Nuevo México vs Wyoming vs Delaware: qué estado elegir para tu LLC</a></li>
<li><a href="/blog/ein-numero-fiscal-llc-como-obtenerlo">EIN: qué es el número fiscal de tu LLC y cómo obtenerlo paso a paso</a></li>
<li><a href="/blog/cuenta-bancaria-mercury-llc-extranjero">Cómo abrir una cuenta Mercury para tu LLC desde cualquier país</a></li>
<li><a href="/blog/impuestos-clientes-internacionales-espana">Impuestos si tienes clientes internacionales en España</a></li>
<li><a href="/blog/pagar-cero-impuestos-legalmente-llc">¿Se puede pagar 0% de impuestos legalmente?</a></li>
<li><a href="/blog/nomada-digital-residencia-fiscal">Nómada digital: dónde tributar y residencia fiscal</a></li>
<li><a href="/blog/criptomonedas-trading-llc-impuestos">Criptomonedas y trading con LLC: fiscalidad completa</a></li>
<li><a href="/blog/iva-servicios-digitales-internacional">IVA en servicios digitales internacionales</a></li>
<li><a href="/blog/registered-agent-que-es-por-que-necesitas">Registered Agent: qué es y por qué lo necesitas</a></li>
<li><a href="/blog/errores-fiscales-freelancers-espanoles">7 errores fiscales que cometen los freelancers españoles</a></li>
<li><a href="/blog/como-operar-llc-dia-a-dia">Cómo operar tu LLC en el día a día: guía práctica</a></li>
<li><a href="/blog/operating-agreement-llc-que-es">Operating Agreement: qué es y por qué tu LLC lo necesita</a></li>
<li><a href="/blog/documentos-llc-cuales-necesitas">Documentos de tu LLC: cuáles necesitas y para qué sirve cada uno</a></li>
<li><a href="/blog/mantenimiento-anual-llc-obligaciones">Mantenimiento anual de tu LLC: obligaciones, plazos y costes</a></li>
<li><a href="/blog/wise-business-llc-guia">Wise Business para tu LLC: guía completa</a></li>
<li><a href="/blog/pasarelas-pago-llc-stripe-paypal-dodo">Pasarelas de pago para tu LLC: Stripe, PayPal y alternativas</a></li>
<li><a href="/blog/amazon-ecommerce-llc-vender-online">Amazon y ecommerce con LLC: cómo vender online desde cualquier país</a></li>
<li><a href="/blog/gastos-deducibles-llc-que-puedes-deducir">Gastos deducibles en tu LLC: qué puedes y qué no puedes deducir</a></li>
<li><a href="/blog/residentes-no-residentes-llc-diferencias">LLC para residentes y no residentes de EE.UU.: diferencias clave</a></li>
<li><a href="/blog/cambiar-divisas-llc-mejores-opciones">Cómo cambiar divisas en tu LLC: las mejores opciones</a></li>
<li><a href="/blog/constituir-llc-proceso-paso-a-paso">Constituir tu LLC: el proceso paso a paso</a></li>
<li><a href="/blog/autonomos-espana-por-que-dejar-de-serlo">Por qué dejar de ser autónomo en España</a></li>
<li><a href="/blog/bancos-vs-fintech-llc-donde-abrir-cuenta">Bancos vs Fintech: dónde abrir la cuenta de tu LLC</a></li>
<li><a href="/blog/tiempos-pagos-ach-wire-transfer">¿Cuánto tardan los pagos ACH y Wire Transfer?</a></li>
<li><a href="/blog/iban-swift-routing-number-que-son">IBAN, SWIFT y Routing Number: qué son</a></li>
<li><a href="/blog/cuanto-cuesta-constituir-llc">¿Cuánto cuesta constituir una LLC?</a></li>
<li><a href="/blog/ventajas-desventajas-llc-no-residentes">Ventajas y desventajas de una LLC para no residentes</a></li>
<li><a href="/blog/evitar-bloqueos-mercury-wise-revolut">Cómo evitar bloqueos en Mercury, Wise y Revolut</a></li>
<li><a href="/blog/que-es-irs-guia-duenos-llc">¿Qué es el IRS? Guía para dueños de LLC</a></li>
<li><a href="/blog/llc-seguridad-juridica-proteccion-patrimonial">LLC y seguridad jurídica: protección patrimonial</a></li>
</ul>
</nav>
</article>`,

  "/blog/llc-estados-unidos-guia-completa-2026": `<article>
<h1>LLC en Estados Unidos: guía completa para no residentes en 2026</h1>
<p>Una LLC (Limited Liability Company) es la estructura empresarial más utilizada por freelancers y emprendedores digitales no residentes. Combina protección patrimonial con fiscalidad favorable y es completamente legal.</p>
<h2>¿Qué es una LLC?</h2>
<p>Es una figura jurídica estadounidense que separa tus bienes personales de los del negocio. Para no residentes con una Single-Member LLC, el IRS la clasifica como Disregarded Entity: no paga impuesto federal en EE.UU.</p>
<h2>¿Por qué tantos freelancers eligen una LLC?</h2>
<ul><li>Fiscalidad optimizada: del 40-47% hasta un 0%</li><li>Protección patrimonial</li><li>Banca en dólares con Mercury</li><li>Acceso a Stripe y PayPal sin restricciones</li><li>100% remoto</li></ul>
<h2>Mejores estados para tu LLC</h2>
<p>Nuevo México (más económico), Wyoming (máxima privacidad) y Delaware (mejor marco legal). Cada estado tiene ventajas distintas según tu situación.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para saber cuál te conviene.</p>
</article>`,

  "/blog/form-5472-que-es-como-presentarlo": `<article>
<h1>Form 5472: qué es, quién debe presentarlo y cómo cumplir correctamente</h1>
<p>El Form 5472 es un formulario informativo del IRS obligatorio para LLCs con propietarios extranjeros. El IRS impone sanciones significativas por no presentarlo dentro de plazo.</p>
<h2>¿Quién debe presentarlo?</h2>
<p>Cualquier LLC con al menos un propietario no residente y no ciudadano de EE.UU. que haya tenido transacciones reportables durante el año fiscal.</p>
<h2>Transacciones que se reportan</h2>
<ul><li>Retiros de beneficios del dueño</li><li>Aportaciones de capital</li><li>Préstamos entre dueño y LLC</li><li>Pagos de gastos personales desde la LLC</li></ul>
<h2>Plazos y presentación</h2>
<p>Se presenta junto al Form 1120 antes del 15 de marzo. Si necesitas extensión, puedes solicitarla con el Form 7004 para extender el plazo hasta septiembre.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> — nos encargamos de todas las declaraciones ante el IRS.</p>
</article>`,

  "/blog/nuevo-mexico-vs-wyoming-vs-delaware": `<article>
<h1>Nuevo México vs Wyoming vs Delaware: qué estado elegir para tu LLC</h1>
<p>Los tres estados más populares para constituir una LLC como no residente. Comparamos costes, privacidad, burocracia y para quién encaja cada uno.</p>
<h2>Nuevo México</h2>
<p>El más económico. Sin Annual Report, sin impuesto estatal. Ideal para freelancers que buscan la opción más directa.</p>
<h2>Wyoming</h2>
<p>Máxima privacidad. Datos de miembros no son públicos. Annual Report de $60/año. Protección de activos superior.</p>
<h2>Delaware</h2>
<p>Mejor marco legal. Court of Chancery especializado. Franchise Tax de $300/año. Recomendado si planeas buscar inversión.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y te recomendamos el estado que encaja con tu caso.</p>
</article>`,

  "/blog/ein-numero-fiscal-llc-como-obtenerlo": `<article>
<h1>EIN: qué es el número fiscal de tu LLC y cómo obtenerlo paso a paso</h1>
<p>El EIN (Employer Identification Number) es el número de identificación fiscal del IRS para tu LLC. Sin él no puedes abrir cuenta bancaria, declarar impuestos ni operar legalmente.</p>
<h2>¿Para qué necesitas el EIN?</h2>
<ul><li>Abrir cuenta bancaria en Mercury o Relay</li><li>Declarar impuestos ante el IRS (Form 1120, Form 5472)</li><li>Cobrar con Stripe y PayPal</li><li>Contratar servicios y proveedores en EE.UU.</li></ul>
<h2>¿Cómo se obtiene?</h2>
<p>Como no residente, debes completar el Form SS-4 y enviarlo por fax al IRS. El EIN es gratuito. Plazo: 4-7 días hábiles por fax.</p>
<h2>EIN vs ITIN</h2>
<p>El EIN es para empresas; el ITIN es para personas físicas no residentes. Para operar tu LLC, solo necesitas el EIN.</p>
<p>En <a href="/es/nuestros-servicios">todos nuestros planes</a> la obtención del EIN está incluida.</p>
</article>`,

  "/blog/cuenta-bancaria-mercury-llc-extranjero": `<article>
<h1>Cómo abrir una cuenta Mercury para tu LLC desde cualquier país</h1>
<p>Mercury es la plataforma fintech preferida por dueños de LLC no residentes. Apertura 100% online, sin comisiones mensuales, transferencias ACH gratuitas y tarjeta de débito. Tus depósitos se custodian en Column NA con seguro FDIC.</p>
<h2>Requisitos</h2>
<ul><li>LLC constituida con Articles of Organization</li><li>EIN del IRS</li><li>Operating Agreement firmado</li><li>Pasaporte vigente</li><li>Descripción del negocio</li></ul>
<h2>Proceso paso a paso</h2>
<p>Solicitud online → verificación de identidad → verificación de empresa → aprobación en 1-3 días hábiles.</p>
<h2>Alternativas</h2>
<p>Relay, Wise Business y Brex son alternativas si Mercury no es la opción adecuada para tu caso.</p>
<p>En Exentax nos encargamos de la <a href="/es/como-trabajamos">apertura de tu cuenta Mercury</a> como parte del proceso de constitución.</p>
</article>`,

  "/blog/autonomo-espana-vs-llc-estados-unidos": `<article>
<h1>Autónomo en España vs LLC en EE.UU.: comparativa fiscal completa</h1>
<p>Comparamos la carga fiscal de un autónomo en España (30-40%) con una LLC en Estados Unidos (hasta 0% federal). Números reales con 60.000€ de facturación anual.</p>
<h2>Autónomo en España</h2>
<p>IRPF progresivo hasta el 47%, cuota de autónomos de 230-500€/mes, IVA. Carga fiscal total: 30-40%.</p>
<h2>LLC en Estados Unidos</h2>
<p>0% impuesto federal para Single-Member LLC de no residente. 0% impuesto estatal en Nuevo México y Wyoming. Mantenimiento anual con compliance completo incluido.</p>
<h2>¿Para quién tiene sentido la LLC?</h2>
<ul><li>Facturas más de 30.000€/año a clientes internacionales</li><li>Negocio 100% digital</li><li>Cobras en dólares</li><li>Quieres protección patrimonial</li></ul>
<p>Usa nuestra <a href="/">calculadora fiscal gratuita</a> para ver cuánto ahorrarías con tu facturación concreta.</p>
</article>`,

  "/blog/impuestos-clientes-internacionales-espana": `<article>
<h1>Impuestos si tienes clientes internacionales en España: lo que nadie te cuenta</h1>
<p>Si facturas a clientes internacionales desde España, tu situación fiscal es diferente a la de un autónomo con clientes nacionales. Existen opciones legales para reducir tu carga fiscal del 40% hasta un 0%.</p>
<h2>Ventajas fiscales automáticas</h2>
<ul><li>IVA no aplica en servicios B2B internacionales</li><li>Deducción por doble imposición internacional</li><li>Opciones de optimización fiscal avanzada</li></ul>
<h2>Opciones disponibles</h2>
<ul><li>Seguir como autónomo (30-40% carga fiscal)</li><li>LLC en EE.UU. (0% federal, estructura optimizada)</li><li>Cambio de residencia fiscal (0-10%)</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y analizamos tu caso concreto.</p>
</article>`,

  "/blog/pagar-cero-impuestos-legalmente-llc": `<article>
<h1>¿Se puede pagar 0% de impuestos legalmente?</h1>
<p>Analizamos los 3 escenarios reales donde la carga fiscal puede llegar a cero: LLC + país sin IRPF, Ley Beckham, y régimen territorial.</p>
<h2>Escenario 1: LLC + país con 0% IRPF</h2>
<p>LLC en EE.UU. (0% federal) + residencia en Dubai, Paraguay o Bahamas (0% IRPF) = 0% total. Requiere mudanza real.</p>
<h2>Escenario 2: LLC + Ley Beckham</h2>
<p>24% tipo fijo + exención de rentas extranjeras durante 6 años para nuevos residentes en España.</p>
<h2>Residente en España</h2>
<p>Sí, puedes pagar 0% de impuesto federal en EE.UU. con una LLC correctamente estructurada como no residente.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para saber qué aplica a tu caso.</p>
</article>`,

  "/blog/nomada-digital-residencia-fiscal": `<article>
<h1>Nómada digital: dónde tributar y cómo elegir tu residencia fiscal</h1>
<p>Si trabajas desde distintos países, tu residencia fiscal determina cuánto pagas. Guía completa con la regla de los 183 días, mejores países y errores graves.</p>
<h2>Mejores opciones</h2>
<ul><li>Portugal NHR: 20% tipo fijo</li><li>Dubai: 0% IRPF</li><li>Georgia: 1% para freelancers</li><li>Paraguay: 0% sobre rentas extranjeras</li></ul>
<h2>Setup ideal</h2>
<p>LLC en EE.UU. (0% federal) + residencia fiscal favorable (0-10%) + Mercury + Stripe.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y diseñamos tu estructura fiscal.</p>
</article>`,

  "/blog/criptomonedas-trading-llc-impuestos": `<article>
<h1>Criptomonedas y trading con LLC: fiscalidad completa para traders</h1>
<p>Fiscalidad del trading de criptomonedas en España (19-28%), ventajas de operar con LLC, Modelo 721 y setup ideal para traders.</p>
<h2>Tributación en España</h2>
<p>Ganancias patrimoniales del 19% al 28%. Modelo 721 obligatorio si tienes más de 50.000€ en exchanges extranjeros.</p>
<h2>Ventajas de la LLC para trading</h2>
<ul><li>Separación patrimonial</li><li>Acceso a exchanges profesionales</li><li>Deducción de gastos de trading</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para traders.</p>
</article>`,

  "/blog/iva-servicios-digitales-internacional": `<article>
<h1>IVA en servicios digitales internacionales: cuándo aplica y cuándo no</h1>
<p>Reglas claras del IVA para freelancers que venden servicios digitales a clientes internacionales. B2B, B2C, UE y fuera de UE.</p>
<h2>Servicios B2B</h2>
<ul><li>Clientes empresa en la UE: inversión del sujeto pasivo (0% IVA)</li><li>Clientes fuera de la UE: operación no sujeta</li></ul>
<h2>Servicios B2C</h2>
<p>Sistema OSS si superas 10.000€/año en ventas B2C intracomunitarias.</p>
<h2>Con LLC americana</h2>
<p>La LLC no está en el sistema IVA europeo. Facturas sin IVA directamente.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> sobre IVA internacional.</p>
</article>`,

  "/blog/registered-agent-que-es-por-que-necesitas": `<article>
<h1>Registered Agent: qué es y por qué es obligatorio para tu LLC</h1>
<p>Toda LLC necesita un Registered Agent para recibir documentos legales. Es obligatorio en todos los estados de EE.UU.</p>
<h2>Qué recibe</h2>
<ul><li>Notificaciones legales (Service of Process)</li><li>Correspondencia del estado</li><li>Documentos del IRS y FinCEN</li></ul>
<h2>Sin Registered Agent</h2>
<p>Tu LLC pierde el Good Standing y puede ser disuelta administrativamente.</p>
<p>En Exentax, el Registered Agent está <a href="/es/nuestros-servicios">incluido en todos nuestros planes</a>.</p>
</article>`,

  "/blog/errores-fiscales-freelancers-espanoles": `<article>
<h1>7 errores fiscales que cometen los freelancers españoles</h1>
<p>Los errores fiscales más costosos: deducciones no aplicadas, IVA incorrecto, pagos fraccionados, y no aprovechar la optimización internacional. Hasta 30.000€/año en pérdidas evitables.</p>
<h2>Errores principales</h2>
<ol><li>No deducir todos los gastos permitidos (3.000-4.000€/año)</li><li>Epígrafe IAE incorrecto</li><li>No aplicar tarifa plana</li><li>IVA incorrecto en operaciones internacionales</li><li>Pagos fraccionados mal</li><li>Ignorar fiscalidad internacional (15.000-20.000€/año)</li><li>No planificar al cierre del ejercicio</li></ol>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y revisamos tu situación.</p>
</article>`,

  "/blog/como-operar-llc-dia-a-dia": `<article>
<h1>Cómo operar tu LLC en el día a día: guía práctica</h1>
<p>Guía práctica para operar tu LLC americana desde cualquier país: facturación, cobros, gastos, retiros personales (Owner's Draw) y contabilidad básica.</p>
<h2>Operativa diaria</h2>
<ul><li>Separar finanzas personales y de negocio</li><li>Facturar como LLC (nombre legal, EIN, datos bancarios)</li><li>Cobros: Wire, ACH, Stripe, PayPal, Wise</li><li>Gastos ordinarios y necesarios del negocio</li><li>Owner's Draw para retiros personales</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para configurar tu operativa.</p>
</article>`,

  "/blog/operating-agreement-llc-que-es": `<article>
<h1>Operating Agreement: qué es y por qué tu LLC lo necesita</h1>
<p>El Operating Agreement es el documento interno más importante de tu LLC. Define las reglas de funcionamiento, clasificación fiscal y estructura de gestión.</p>
<h2>Qué incluye</h2>
<ul><li>Datos de la LLC y del miembro</li><li>Clasificación fiscal (Disregarded Entity)</li><li>Distribución de beneficios</li><li>Gestión (Member-Managed)</li><li>Condiciones de disolución</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para revisar tus documentos.</p>
</article>`,

  "/blog/documentos-llc-cuales-necesitas": `<article>
<h1>Documentos de tu LLC: cuáles necesitas y para qué sirve cada uno</h1>
<p>El kit legal completo de tu LLC: Articles of Organization, EIN, Operating Agreement, BOI Report, Certificado de Good Standing y IRS Confirmation Letter.</p>
<h2>Documentos esenciales</h2>
<ol><li>Articles of Organization</li><li>EIN (Employer Identification Number)</li><li>Operating Agreement</li><li>BOI Report</li><li>Certificado de Good Standing</li><li>IRS Confirmation Letter (CP 575)</li></ol>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y revisamos tu documentación.</p>
</article>`,

  "/blog/mantenimiento-anual-llc-obligaciones": `<article>
<h1>Mantenimiento anual de tu LLC: obligaciones, plazos y costes</h1>
<p>Para mantener tu LLC activa necesitas cumplir con obligaciones anuales: Annual Report, Form 5472+1120, FBAR, Registered Agent y BOI Report.</p>
<h2>Calendario anual</h2>
<ul><li>Form 1120 + Form 5472: antes del 15 de marzo (extensión hasta septiembre con Form 7004)</li><li>FBAR: antes del 15 de abril (si >$10K)</li><li>Annual Report: según estado</li><li>Renovar Registered Agent</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> sobre mantenimiento anual.</p>
</article>`,

  "/blog/wise-business-llc-guia": `<article>
<h1>Wise Business para tu LLC: guía completa</h1>
<p>Wise Business permite recibir, convertir y enviar dinero en 40+ divisas con tipo de cambio real. Complemento perfecto de Mercury.</p>
<h2>Funcionalidades</h2>
<ul><li>Cuentas en múltiples divisas</li><li>Tipo de cambio real (mid-market)</li><li>Datos bancarios locales</li><li>Tarjeta de débito</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para configurar Wise.</p>
</article>`,

  "/blog/pasarelas-pago-llc-stripe-paypal-dodo": `<article>
<h1>Pasarelas de pago para tu LLC: Stripe, PayPal y alternativas</h1>
<p>Compara las mejores pasarelas de pago para tu LLC: Stripe (2.9%+$0.30), PayPal (2.99%+$0.49) y Dodo Payments.</p>
<h2>Comparativa</h2>
<ul><li>Stripe: SaaS, productos digitales, API potente</li><li>PayPal: freelancers, B2B, reconocimiento de marca</li><li>Dodo Payments: ventas globales con IVA</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para elegir tu pasarela.</p>
</article>`,

  "/blog/amazon-ecommerce-llc-vender-online": `<article>
<h1>Amazon y ecommerce con LLC: cómo vender online desde cualquier país</h1>
<p>Con una LLC puedes vender en Amazon FBA, Shopify y Etsy sin restricciones geográficas. Acceso completo a los mayores marketplaces del mundo.</p>
<h2>Qué necesitas</h2>
<ul><li>LLC constituida</li><li>EIN</li><li>Cuenta Mercury</li><li>Pasaporte del propietario</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para lanzar tu ecommerce.</p>
</article>`,

  "/blog/gastos-deducibles-llc-que-puedes-deducir": `<article>
<h1>Gastos deducibles en tu LLC: qué puedes y qué no puedes deducir</h1>
<p>Todo gasto ordinario y necesario para tu negocio es deducible: tecnología, servicios profesionales, marketing, formación y viajes de negocio.</p>
<h2>Deducibles</h2>
<ul><li>Software y herramientas</li><li>Servicios profesionales</li><li>Marketing y publicidad</li><li>Hardware de trabajo</li><li>Formación profesional</li></ul>
<h2>No deducibles</h2>
<ul><li>Gastos personales</li><li>Multas y sanciones</li><li>Owner's Draws (son distribuciones)</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> sobre deducciones.</p>
</article>`,

  "/blog/residentes-no-residentes-llc-diferencias": `<article>
<h1>LLC para residentes y no residentes de EE.UU.: diferencias clave</h1>
<p>La fiscalidad cambia radicalmente según tu estatus: residente paga 30-40% (impuestos + Self-Employment Tax), no residente paga 0% federal en EE.UU.</p>
<h2>Diferencias principales</h2>
<ul><li>Residente: impuesto federal 10-37% + Self-Employment Tax 15.3%</li><li>No residente: 0% federal US, tributa en país de residencia</li><li>Formularios diferentes: Schedule C vs Form 5472</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para entender tu caso.</p>
</article>`,

  "/blog/cambiar-divisas-llc-mejores-opciones": `<article>
<h1>Cómo cambiar divisas en tu LLC: las mejores opciones</h1>
<p>Compara Wise (0.4-1.5%), Mercury wire (1-2%), bancos tradicionales (3-5%) y PayPal (4-6%) para convertir divisas en tu LLC.</p>
<h2>Flujo recomendado</h2>
<ol><li>Cobrar USD en Mercury</li><li>Transferir a Wise (ACH gratis)</li><li>Convertir al tipo de cambio real</li><li>Enviar a cuenta local</li></ol>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para optimizar tus conversiones.</p>
</article>`,

  "/blog/constituir-llc-proceso-paso-a-paso": `<article>
<h1>Constituir tu LLC: el proceso paso a paso</h1>
<p>El proceso completo: elegir estado, nombre, Registered Agent, Articles of Organization, EIN, Operating Agreement, BOI Report, cuenta bancaria y pasarelas de pago.</p>
<h2>Pasos principales</h2>
<ol><li>Elegir estado (NM, WY, DE)</li><li>Elegir nombre</li><li>Designar Registered Agent</li><li>Presentar Articles of Organization</li><li>Obtener EIN</li><li>Redactar Operating Agreement</li><li>Presentar BOI Report</li><li>Abrir cuenta bancaria</li></ol>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para que te guiemos.</p>
</article>`,

  "/blog/autonomos-espana-por-que-dejar-de-serlo": `<article>
<h1>Por qué dejar de ser autónomo en España (y qué alternativas tienes)</h1>
<p>Si eres autónomo en España facturando al extranjero, puedes estar pagando hasta un 47% entre IRPF, cuotas y IVA. Hay alternativas legales que reducen esa carga fiscal significativamente.</p>
<h2>Las cuentas del autónomo</h2>
<p>Con 60.000€/año: cuota ~3.600€, IRPF 24-37%, IVA 21%. Te quedan entre 32.000€ y 38.000€. Casi la mitad se va.</p>
<h2>La alternativa: LLC en EE.UU.</h2>
<ul><li>0% impuesto federal</li><li>Protección patrimonial completa</li><li>Acceso a banca americana</li><li>Sin cuota fija mensual</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> y analizamos tu caso.</p>
</article>`,

  "/blog/bancos-vs-fintech-llc-donde-abrir-cuenta": `<article>
<h1>Bancos vs Fintech: dónde abrir la cuenta de tu LLC</h1>
<p>Mercury, Wise, Relay y Revolut no son bancos — son fintechs que trabajan con bancos partners. Entender la diferencia es clave para la seguridad de tu dinero.</p>
<h2>Diferencias clave</h2>
<ul><li>Banco: licencia bancaria propia, FDIC directo</li><li>Fintech: tecnología financiera, FDIC a través de banco partner</li></ul>
<h2>Comparativa</h2>
<p>Mercury (FDIC hasta $5M), Relay (FDIC $250K), Wise (safeguarding, no FDIC), Revolut (FDIC $250K).</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para elegir la mejor opción.</p>
</article>`,

  "/blog/tiempos-pagos-ach-wire-transfer": `<article>
<h1>¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales</h1>
<p>Tiempos reales: ACH Standard 1-3 días, ACH Same-Day mismo día, Wire doméstico 2-6 horas, Wire internacional 1-5 días, Wise 1-2 días.</p>
<h2>Factores que afectan</h2>
<ul><li>Hora de envío y horario de corte</li><li>Días hábiles vs fines de semana</li><li>Bancos intermediarios en wires internacionales</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para configurar tus flujos de pago.</p>
</article>`,

  "/blog/iban-swift-routing-number-que-son": `<article>
<h1>IBAN, SWIFT y Routing Number: qué son y cuándo usarlos</h1>
<p>Routing Number (9 dígitos, EE.UU.), SWIFT/BIC (8-11 caracteres, internacional), IBAN (15-34 caracteres, Europa). Son las direcciones de tu cuenta bancaria.</p>
<h2>¿Qué dar a cada cliente?</h2>
<ul><li>Cliente americano: Routing Number + Account Number</li><li>Cliente europeo: SWIFT + Account o IBAN de Wise (SEPA)</li><li>Cliente LatAm: SWIFT + Account o datos locales de Wise</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para configurar tus cobros.</p>
</article>`,

  "/blog/cuanto-cuesta-constituir-llc": `<article>
<h1>¿Cuánto cuesta constituir una LLC? (Se constituye, no se "crea")</h1>
<p>La constitución incluye filing fee estatal, Registered Agent, EIN, Operating Agreement y BOI Report. Consulta nuestros planes para un presupuesto personalizado.</p>
<h2>Incluye</h2>
<ul><li>Filing fee estatal</li><li>Registered Agent</li><li>EIN</li><li>Operating Agreement</li><li>BOI Report</li></ul>
<h2>El coste de NO tener LLC</h2>
<p>Si facturas una cantidad significativa al año como autónomo pagando 40%, la diferencia con una LLC optimizada puede ser muy relevante. Usa nuestra calculadora para estimar tu ahorro.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para tu presupuesto exacto.</p>
</article>`,

  "/blog/ventajas-desventajas-llc-no-residentes": `<article>
<h1>Ventajas y desventajas de una LLC para no residentes</h1>
<h2>Ventajas</h2>
<ul><li>0% impuesto federal EE.UU.</li><li>Protección patrimonial</li><li>Acceso a banca y pagos internacionales</li><li>Credibilidad internacional</li><li>Sin cuota fija mensual</li></ul>
<h2>Desventajas</h2>
<ul><li>Obligaciones de compliance (Form 5472, FBAR)</li><li>Coste de mantenimiento anual</li><li>Complejidad fiscal internacional</li><li>Riesgo de bloqueos bancarios si no operas bien</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para analizar si te conviene.</p>
</article>`,

  "/blog/evitar-bloqueos-mercury-wise-revolut": `<article>
<h1>Cómo evitar bloqueos en Mercury, Wise y Revolut Business</h1>
<p>Los bloqueos ocurren por compliance KYC/AML. Prevención: completar perfil, escalar gradualmente, separar fondos personales y de negocio, documentar transacciones.</p>
<h2>Causas comunes</h2>
<ul><li>Movimientos inconsistentes con el perfil</li><li>Mezclar fondos personales y de negocio</li><li>No responder a verificaciones</li><li>Transacciones a países sancionados</li></ul>
<h2>Diversifica cuentas</h2>
<p>Mercury (principal) + Wise (conversiones) + Relay (respaldo). Nunca dependas de una sola cuenta.</p>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para configurar tus cuentas.</p>
</article>`,

  "/blog/que-es-irs-guia-duenos-llc": `<article>
<h1>¿Qué es el IRS? Guía completa para dueños de LLC</h1>
<p>El IRS (Internal Revenue Service) es la agencia tributaria de EE.UU. — equivalente a la AEAT en España o el SAT en México. Si tienes una LLC, el IRS te asigna el EIN y recibe tus declaraciones anuales.</p>
<h2>Obligaciones con el IRS</h2>
<ul><li>EIN: número fiscal de tu LLC</li><li>Form 1120 + Form 5472: declaración corporativa e informativa anual</li><li>Sanciones significativas por no presentar</li><li>Plazo: 15 de marzo (extensión hasta 15 de septiembre con Form 7004)</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para entender tus obligaciones.</p>
</article>`,

  "/blog/llc-seguridad-juridica-proteccion-patrimonial": `<article>
<h1>LLC y seguridad jurídica: cómo protege tu patrimonio personal</h1>
<p>La LLC (Limited Liability Company) separa legalmente tu patrimonio personal del de tu negocio. Si la LLC tiene un problema, tus bienes personales están protegidos.</p>
<h2>Protección vs autónomo</h2>
<ul><li>Autónomo: responsabilidad ilimitada (casa, ahorros en riesgo)</li><li>LLC: responsabilidad limitada (solo activos de la LLC)</li></ul>
<h2>Cómo mantener la protección</h2>
<ul><li>Separar cuentas personales y de negocio</li><li>Documentar todo (facturas, contratos)</li><li>Mantener Operating Agreement actualizado</li><li>Cumplir obligaciones fiscales</li></ul>
<p><a href="/es/agendar">Agenda una asesoría fiscal</a> para proteger tu patrimonio.</p>
</article>`,
};

export const PAGE_SCHEMAS: Record<string, object[]> = {
  "home": [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": BRAND_NAME,
      "alternateName": "Exentax LLC",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/icon-192.png`,
        "width": 192,
        "height": 192
      },
      "image": `${BASE_URL}/og-image.png`,
      "description": "Constitución y gestión de LLC en Estados Unidos para autónomos, freelancers y emprendedores digitales. Optimización fiscal legal e internacional.",
      "email": LEGAL_EMAIL,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1209 Mountain Road Place Northeast, STE R",
        "addressLocality": "Albuquerque",
        "addressRegion": "NM",
        "postalCode": "87110",
        "addressCountry": "US"
      },
      "sameAs": [
        INSTAGRAM_URL,
        TIKTOK_URL,
        LINKEDIN_URL
      ],
      "foundingDate": "2024",
      "legalName": "Exentax LLC",
      "areaServed": [
        { "@type": "Country", "name": "España" },
        { "@type": "Country", "name": "Argentina" },
        { "@type": "Country", "name": "México" },
        { "@type": "Country", "name": "Colombia" },
        { "@type": "Country", "name": "Chile" },
        { "@type": "Country", "name": "Perú" },
        { "@type": "Country", "name": "Portugal" },
        { "@type": "Country", "name": "Francia" },
        { "@type": "Country", "name": "Alemania" },
        { "@type": "Country", "name": "Italia" }
      ],
      "knowsAbout": [
        "LLC en Estados Unidos",
        "Optimización fiscal internacional",
        "Constitución de empresas en USA",
        "Compliance fiscal IRS",
        "Fiscalidad para nómadas digitales"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL }
      ]
    }
  ],
  "about_llc": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Sobre las LLC", "item": `${BASE_URL}/sobre-las-llc` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "LLC en Estados Unidos para no residentes — Guía completa 2026",
      "description": "Todo lo que necesitas saber sobre LLC en EE.UU.: ventajas fiscales, mejores estados, proceso de constitución paso a paso y obligaciones fiscales anuales.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "dateModified": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/sobre-las-llc`,
      "inLanguage": "es",
      "about": [
        { "@type": "Thing", "name": "LLC en Estados Unidos" },
        { "@type": "Thing", "name": "Constitución de empresa en USA" },
        { "@type": "Thing", "name": "Optimización fiscal internacional" }
      ],
      "articleSection": "Guías fiscales",
      "wordCount": 2500,
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", "h3"]
      }
    }
  ],
  "how_we_work": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Así Trabajamos", "item": `${BASE_URL}/como-trabajamos` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cómo constituir una LLC en Estados Unidos desde el extranjero",
      "description": "Proceso paso a paso de Exentax para constituir y gestionar tu LLC americana: desde el diagnóstico fiscal estratégico hasta el compliance anual.",
      "image": `${BASE_URL}/og-image.png`,
      "totalTime": "P30D",
      "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "0" },
      "supply": [
        { "@type": "HowToSupply", "name": "Documento de identidad (pasaporte)" },
        { "@type": "HowToSupply", "name": "Dirección de residencia fiscal" },
        { "@type": "HowToSupply", "name": "Descripción de actividad profesional" }
      ],
      "tool": [
        { "@type": "HowToTool", "name": "Videollamada por Google Meet" },
        { "@type": "HowToTool", "name": "Cuenta bancaria Mercury o Relay" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Diagnóstico Fiscal Estratégico",
          "text": "Videollamada de 30 minutos donde analizamos tu situación fiscal actual, tus ingresos, tu país de residencia y tu tipo de actividad. Determinamos si una LLC americana es la mejor opción.",
          "url": `${BASE_URL}/es/agendar`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Constitución de la LLC",
          "text": "Nos encargamos de todo: Articles of Organization, Operating Agreement, obtención del EIN ante el IRS, y designación de agente registrado. Todo 100% remoto en 2-4 semanas.",
          "url": `${BASE_URL}/sobre-las-llc`
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Apertura de Cuentas Bancarias",
          "text": "Abrimos tu cuenta bancaria empresarial en Mercury o Relay en dólares. Configuramos Stripe y las pasarelas de pago para facturar internacionalmente.",
          "url": `${BASE_URL}/es/nuestros-servicios`
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Compliance y Mantenimiento Anual",
          "text": "Gestión fiscal continua: Form 5472, Form 1120, BOI Report, renovación de agente registrado, Annual Report y asesoría fiscal permanente. Tu LLC siempre en regla.",
          "url": `${BASE_URL}/es/nuestros-servicios`
        }
      ]
    }
  ],
  "our_services": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Planes y Tarifas", "item": `${BASE_URL}/servicios` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Constitución LLC Nuevo México",
      "description": "Constitución completa de LLC en Nuevo México. Sin Annual Report, sin impuesto estatal. Incluye Articles of Organization, Operating Agreement, EIN, agente registrado y cuenta Mercury.",
      "brand": { "@type": "Brand", "name": BRAND_NAME },
      "offers": {
        "@type": "Offer",
        "url": `${BASE_URL}/es/nuestros-servicios`,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": BRAND_NAME }
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "127", "bestRating": "5" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Constitución LLC Wyoming",
      "description": "Constitución completa de LLC en Wyoming con máxima privacidad. Sin impuesto estatal, máximo anonimato. Incluye Articles of Organization, Operating Agreement, EIN, agente registrado y cuenta Mercury.",
      "brand": { "@type": "Brand", "name": BRAND_NAME },
      "offers": {
        "@type": "Offer",
        "url": `${BASE_URL}/es/nuestros-servicios`,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": BRAND_NAME }
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "127", "bestRating": "5" }
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Constitución LLC Delaware",
      "description": "Constitución completa de LLC en Delaware. El mejor marco legal de EE.UU., ideal para startups e inversores. Incluye Articles of Organization, Operating Agreement, EIN, agente registrado y cuenta Mercury.",
      "brand": { "@type": "Brand", "name": BRAND_NAME },
      "offers": {
        "@type": "Offer",
        "url": `${BASE_URL}/es/nuestros-servicios`,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": BRAND_NAME }
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "127", "bestRating": "5" }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Exentax — Constitución y gestión de LLC en EE.UU.",
      "description": "Servicio integral de constitución de LLC en Estados Unidos para autónomos, freelancers y emprendedores digitales. Incluye EIN, Operating Agreement, cuenta bancaria Mercury, compliance fiscal y soporte continuo.",
      "provider": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "serviceType": "Constitución y gestión de LLC",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Planes de constitución LLC",
        "itemListElement": [
          { "@type": "Offer", "name": "LLC Nuevo México", "priceCurrency": "EUR", "url": `${BASE_URL}/es/nuestros-servicios` },
          { "@type": "Offer", "name": "LLC Wyoming", "priceCurrency": "EUR", "url": `${BASE_URL}/es/nuestros-servicios` },
          { "@type": "Offer", "name": "LLC Delaware", "priceCurrency": "EUR", "url": `${BASE_URL}/es/nuestros-servicios` }
        ]
      },
      "url": `${BASE_URL}/es/nuestros-servicios`
    }
  ],
  "faq": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Preguntas Frecuentes", "item": `${BASE_URL}/es/preguntas-frecuentes` }
      ]
    }
  ],
  "book": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Asesoría Fiscal Estratégica", "item": `${BASE_URL}/es/agendar` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Asesoría Fiscal Estratégica — 30 Minutos",
      "description": "Videollamada de 30 minutos con un asesor fiscal de Exentax. Analizamos tu situación fiscal y te indicamos si una LLC en Estados Unidos es la mejor opción para tu negocio.",
      "provider": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "serviceType": "Asesoría fiscal",
      "areaServed": [
        { "@type": "Country", "name": "España" },
        { "@type": "Country", "name": "Argentina" },
        { "@type": "Country", "name": "México" },
        { "@type": "Country", "name": "Colombia" },
        { "@type": "Country", "name": "Chile" },
        { "@type": "Country", "name": "Perú" }
      ],
      "offers": {
        "@type": "Offer",
        "price": "50",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `${BASE_URL}/es/agendar`
      },
      "termsOfService": `${BASE_URL}/legal/terminos`,
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceType": "Videollamada Google Meet",
        "availableLanguage": ["es", "en"]
      }
    }
  ],
  "/blog": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Blog — Fiscalidad internacional y LLC en Estados Unidos",
      "description": "Artículos sobre optimización fiscal, LLC en Estados Unidos, compliance y estrategias legales para freelancers y emprendedores digitales.",
      "url": `${BASE_URL}/blog`,
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "inLanguage": "es"
    }
  ],
  "/blog/llc-estados-unidos-guia-completa-2026": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "LLC en Estados Unidos: guía completa", "item": `${BASE_URL}/blog/llc-estados-unidos-guia-completa-2026` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "LLC en Estados Unidos: guía completa para no residentes en 2026",
      "description": "Guía completa para constituir una LLC en EE.UU. siendo extranjero. Estados, costes, fiscalidad, errores frecuentes y cómo elegir la mejor opción.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "dateModified": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/llc-estados-unidos-guia-completa-2026`,
      "inLanguage": "es",
      "articleSection": "Guías",
      "wordCount": 1200
    }
  ],
  "/blog/form-5472-que-es-como-presentarlo": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Form 5472", "item": `${BASE_URL}/blog/form-5472-que-es-como-presentarlo` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Form 5472: qué es y cómo presentarlo correctamente",
      "description": "El Form 5472 es obligatorio para LLCs con dueños extranjeros. Aprende qué transacciones reportar, plazos de presentación y cómo cumplir sin complicaciones.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "dateModified": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/form-5472-que-es-como-presentarlo`,
      "inLanguage": "es",
      "articleSection": "Compliance",
      "wordCount": 1100
    }
  ],
  "/blog/nuevo-mexico-vs-wyoming-vs-delaware": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Nuevo México vs Wyoming vs Delaware", "item": `${BASE_URL}/blog/nuevo-mexico-vs-wyoming-vs-delaware` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Nuevo México vs Wyoming vs Delaware: qué estado elegir para tu LLC",
      "description": "Comparativa completa de los 3 mejores estados para constituir una LLC como no residente. Costes, privacidad, burocracia y para quién encaja cada uno.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/nuevo-mexico-vs-wyoming-vs-delaware`,
      "inLanguage": "es",
      "articleSection": "Comparativas",
      "wordCount": 1000
    }
  ],
  "/blog/ein-numero-fiscal-llc-como-obtenerlo": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "EIN: número fiscal de tu LLC", "item": `${BASE_URL}/blog/ein-numero-fiscal-llc-como-obtenerlo` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "EIN: qué es el número fiscal de tu LLC y cómo obtenerlo paso a paso",
      "description": "El EIN es el número fiscal que el IRS asigna a tu LLC. Aprende cómo obtenerlo paso a paso siendo no residente, plazos, coste y errores frecuentes.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/ein-numero-fiscal-llc-como-obtenerlo`,
      "inLanguage": "es",
      "articleSection": "Guías",
      "wordCount": 1100
    }
  ],
  "/blog/cuenta-bancaria-mercury-llc-extranjero": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Cuenta Mercury para tu LLC", "item": `${BASE_URL}/blog/cuenta-bancaria-mercury-llc-extranjero` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Cómo abrir una cuenta Mercury para tu LLC desde cualquier país",
      "description": "Guía paso a paso para abrir una cuenta bancaria en Mercury con tu LLC americana siendo no residente. Requisitos, plazos, documentos y alternativas.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/cuenta-bancaria-mercury-llc-extranjero`,
      "inLanguage": "es",
      "articleSection": "Herramientas",
      "wordCount": 1200
    }
  ],
  "/blog/autonomo-espana-vs-llc-estados-unidos": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Autónomo España vs LLC EE.UU.", "item": `${BASE_URL}/blog/autonomo-espana-vs-llc-estados-unidos` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Autónomo en España vs LLC en EE.UU.: comparativa fiscal completa",
      "description": "Comparamos la carga fiscal de un autónomo en España (30-40%) con una LLC en Estados Unidos (hasta 0%). Números reales, ventajas y para quién tiene sentido.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/autonomo-espana-vs-llc-estados-unidos`,
      "inLanguage": "es",
      "articleSection": "Comparativas",
      "wordCount": 1400
    }
  ],
  "/blog/impuestos-clientes-internacionales-espana": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Impuestos clientes internacionales España", "item": `${BASE_URL}/blog/impuestos-clientes-internacionales-espana` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Impuestos si tienes clientes internacionales en España: lo que nadie te cuenta",
      "description": "Si facturas a clientes internacionales desde España, puedes reducir tu carga fiscal del 40% hasta un 0% legalmente. IVA, fiscalidad internacional y LLC explicados.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "dateModified": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/impuestos-clientes-internacionales-espana`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1400
    }
  ],
  "/blog/pagar-cero-impuestos-legalmente-llc": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Pagar 0% impuestos legalmente", "item": `${BASE_URL}/blog/pagar-cero-impuestos-legalmente-llc` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "¿Se puede pagar 0% de impuestos legalmente? La verdad sobre la optimización fiscal",
      "description": "¿Es posible pagar cero impuestos de forma legal? Analizamos los 3 escenarios reales: LLC + residencia fiscal en país sin IRPF, Ley Beckham y régimen territorial.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/pagar-cero-impuestos-legalmente-llc`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1500
    }
  ],
  "/blog/nomada-digital-residencia-fiscal": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Nómada digital residencia fiscal", "item": `${BASE_URL}/blog/nomada-digital-residencia-fiscal` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Nómada digital: dónde tributar y cómo elegir tu residencia fiscal",
      "description": "Guía fiscal para nómadas digitales: regla de los 183 días, mejores países para tributar y cómo cambiar tu residencia fiscal.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/nomada-digital-residencia-fiscal`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1300
    }
  ],
  "/blog/criptomonedas-trading-llc-impuestos": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Criptomonedas y trading con LLC", "item": `${BASE_URL}/blog/criptomonedas-trading-llc-impuestos` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Criptomonedas y trading con LLC: fiscalidad completa para traders",
      "description": "Fiscalidad completa para traders de criptomonedas. Cómo tributar en España, ventajas de operar con LLC, Modelo 721, setup ideal y errores frecuentes.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/criptomonedas-trading-llc-impuestos`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1200
    }
  ],
  "/blog/iva-servicios-digitales-internacional": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "IVA servicios digitales", "item": `${BASE_URL}/blog/iva-servicios-digitales-internacional` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "IVA en servicios digitales internacionales: cuándo aplica y cuándo no",
      "description": "Cuándo cobrar IVA en servicios digitales a clientes internacionales. Reglas B2B/B2C, operaciones intracomunitarias, Modelo 303/349, OSS.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/iva-servicios-digitales-internacional`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1200
    }
  ],
  "/blog/registered-agent-que-es-por-que-necesitas": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Registered Agent", "item": `${BASE_URL}/blog/registered-agent-que-es-por-que-necesitas` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Registered Agent: qué es y por qué es obligatorio para tu LLC",
      "description": "El Registered Agent es obligatorio para tu LLC. Qué hace, cuánto cuesta, qué pasa sin él y cómo elegir el mejor servicio.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/registered-agent-que-es-por-que-necesitas`,
      "inLanguage": "es",
      "articleSection": "Guías",
      "wordCount": 900
    }
  ],
  "/blog/errores-fiscales-freelancers-espanoles": [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
        { "@type": "ListItem", "position": 3, "name": "Errores fiscales freelancers", "item": `${BASE_URL}/blog/errores-fiscales-freelancers-espanoles` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "7 errores fiscales que cometen los freelancers españoles (y cómo evitarlos)",
      "description": "Los 7 errores fiscales más costosos que cometen los freelancers en España. Deducciones, IVA internacional, pagos fraccionados y cómo evitar perder hasta 30.000€/año.",
      "image": `${BASE_URL}/og-image.png`,
      "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL },
      "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } },
      "datePublished": "2026-03-05",
      "mainEntityOfPage": `${BASE_URL}/blog/errores-fiscales-freelancers-espanoles`,
      "inLanguage": "es",
      "articleSection": "Fiscalidad",
      "wordCount": 1400
    }
  ],
  "/blog/como-operar-llc-dia-a-dia": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Cómo operar tu LLC", "item": `${BASE_URL}/blog/como-operar-llc-dia-a-dia` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Cómo operar tu LLC en el día a día: guía práctica", "description": "Guía práctica para operar tu LLC americana: facturación, cobros, gastos, retiros y contabilidad.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/como-operar-llc-dia-a-dia`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1100 }
  ],
  "/blog/operating-agreement-llc-que-es": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Operating Agreement LLC", "item": `${BASE_URL}/blog/operating-agreement-llc-que-es` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Operating Agreement: qué es y por qué tu LLC lo necesita", "description": "El Operating Agreement define las reglas internas de tu LLC. Qué incluye, por qué es imprescindible y cuándo actualizarlo.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/operating-agreement-llc-que-es`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 900 }
  ],
  "/blog/documentos-llc-cuales-necesitas": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Documentos de tu LLC", "item": `${BASE_URL}/blog/documentos-llc-cuales-necesitas` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Documentos de tu LLC: cuáles necesitas y para qué sirve cada uno", "description": "Articles of Organization, EIN, Operating Agreement, BOI Report... Todos los documentos de tu LLC explicados.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/documentos-llc-cuales-necesitas`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 900 }
  ],
  "/blog/mantenimiento-anual-llc-obligaciones": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Mantenimiento anual LLC", "item": `${BASE_URL}/blog/mantenimiento-anual-llc-obligaciones` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Mantenimiento anual de tu LLC: obligaciones, plazos y costes", "description": "Todo lo que necesitas hacer cada año para mantener tu LLC en regla: Annual Report, Form 5472, FBAR, Registered Agent.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/mantenimiento-anual-llc-obligaciones`, "inLanguage": "es", "articleSection": "Compliance", "wordCount": 1200 }
  ],
  "/blog/wise-business-llc-guia": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Wise Business LLC", "item": `${BASE_URL}/blog/wise-business-llc-guia` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Wise Business para tu LLC: guía completa", "description": "Wise Business para tu LLC: recibir pagos en múltiples divisas, convertir moneda y enviar dinero.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/wise-business-llc-guia`, "inLanguage": "es", "articleSection": "Herramientas", "wordCount": 1000 }
  ],
  "/blog/pasarelas-pago-llc-stripe-paypal-dodo": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Pasarelas de pago LLC", "item": `${BASE_URL}/blog/pasarelas-pago-llc-stripe-paypal-dodo` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Pasarelas de pago para tu LLC: Stripe, PayPal y alternativas", "description": "Compara Stripe, PayPal y Dodo Payments para tu LLC americana.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/pasarelas-pago-llc-stripe-paypal-dodo`, "inLanguage": "es", "articleSection": "Herramientas", "wordCount": 1100 }
  ],
  "/blog/amazon-ecommerce-llc-vender-online": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Amazon y ecommerce con LLC", "item": `${BASE_URL}/blog/amazon-ecommerce-llc-vender-online` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Amazon y ecommerce con LLC: cómo vender online desde cualquier país", "description": "Vende en Amazon, Shopify y Etsy con tu LLC americana sin restricciones.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/amazon-ecommerce-llc-vender-online`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1000 }
  ],
  "/blog/gastos-deducibles-llc-que-puedes-deducir": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Gastos deducibles LLC", "item": `${BASE_URL}/blog/gastos-deducibles-llc-que-puedes-deducir` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Gastos deducibles en tu LLC: qué puedes y qué no puedes deducir", "description": "Guía completa de gastos deducibles en tu LLC: tecnología, servicios, marketing, viajes, formación.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/gastos-deducibles-llc-que-puedes-deducir`, "inLanguage": "es", "articleSection": "Fiscalidad", "wordCount": 1200 }
  ],
  "/blog/residentes-no-residentes-llc-diferencias": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Residentes vs no residentes LLC", "item": `${BASE_URL}/blog/residentes-no-residentes-llc-diferencias` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "LLC para residentes y no residentes de EE.UU.: diferencias clave", "description": "Las diferencias fiscales entre tener una LLC como residente y no residente de EE.UU.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/residentes-no-residentes-llc-diferencias`, "inLanguage": "es", "articleSection": "Fiscalidad", "wordCount": 1100 }
  ],
  "/blog/cambiar-divisas-llc-mejores-opciones": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Cambiar divisas LLC", "item": `${BASE_URL}/blog/cambiar-divisas-llc-mejores-opciones` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Cómo cambiar divisas en tu LLC: las mejores opciones", "description": "Compara Wise, Mercury, bancos tradicionales y PayPal para cambiar divisas en tu LLC.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/cambiar-divisas-llc-mejores-opciones`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1000 }
  ],
  "/blog/constituir-llc-proceso-paso-a-paso": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Constituir LLC paso a paso", "item": `${BASE_URL}/blog/constituir-llc-proceso-paso-a-paso` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Constituir tu LLC: el proceso paso a paso", "description": "El proceso completo para constituir una LLC americana como no residente: elegir estado, nombre, Registered Agent, EIN, cuenta bancaria.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/constituir-llc-proceso-paso-a-paso`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 1200 }
  ],
  "/blog/autonomos-espana-por-que-dejar-de-serlo": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Dejar de ser autónomo en España", "item": `${BASE_URL}/blog/autonomos-espana-por-que-dejar-de-serlo` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Por qué dejar de ser autónomo en España (y qué alternativas tienes)", "description": "Si eres autónomo en España y facturas al extranjero, puedes estar pagando hasta un 47%. Hay alternativas legales como la LLC.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/autonomos-espana-por-que-dejar-de-serlo`, "inLanguage": "es", "articleSection": "Fiscalidad", "wordCount": 1100 }
  ],
  "/blog/bancos-vs-fintech-llc-donde-abrir-cuenta": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Bancos vs Fintech para LLC", "item": `${BASE_URL}/blog/bancos-vs-fintech-llc-donde-abrir-cuenta` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Bancos vs Fintech: dónde abrir la cuenta de tu LLC", "description": "Mercury, Wise, Relay y Revolut: ¿son bancos? ¿Son seguros? Diferencias entre bancos y fintech, FDIC, y cuál conviene para tu LLC.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/bancos-vs-fintech-llc-donde-abrir-cuenta`, "inLanguage": "es", "articleSection": "Herramientas", "wordCount": 1100 }
  ],
  "/blog/tiempos-pagos-ach-wire-transfer": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Tiempos ACH y Wire Transfer", "item": `${BASE_URL}/blog/tiempos-pagos-ach-wire-transfer` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "¿Cuánto tardan los pagos ACH y Wire Transfer? Tiempos reales", "description": "Tiempos reales de pago: ACH (1-3 días), Wire doméstico (horas), Wire internacional (1-5 días), Wise (1-2 días).", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/tiempos-pagos-ach-wire-transfer`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1000 }
  ],
  "/blog/iban-swift-routing-number-que-son": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "IBAN, SWIFT y Routing Number", "item": `${BASE_URL}/blog/iban-swift-routing-number-que-son` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "IBAN, SWIFT y Routing Number: qué son y cuándo usarlos", "description": "IBAN, SWIFT/BIC y Routing Number explicados: qué son, cuándo usar cada uno, qué datos dar a clientes.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/iban-swift-routing-number-que-son`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1000 }
  ],
  "/blog/cuanto-cuesta-constituir-llc": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Cuánto cuesta constituir LLC", "item": `${BASE_URL}/blog/cuanto-cuesta-constituir-llc` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "¿Cuánto cuesta constituir una LLC? Costes reales", "description": "Costes reales de constituir una LLC en Nuevo México, Wyoming y Delaware. Filing fees, Registered Agent, EIN, mantenimiento anual.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/cuanto-cuesta-constituir-llc`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 1200 }
  ],
  "/blog/ventajas-desventajas-llc-no-residentes": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Ventajas y desventajas LLC", "item": `${BASE_URL}/blog/ventajas-desventajas-llc-no-residentes` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Ventajas y desventajas de una LLC para no residentes: la verdad sin filtros", "description": "Las ventajas reales (fiscalidad, protección, banca) y las desventajas reales (costes, compliance, complejidad) de una LLC.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/ventajas-desventajas-llc-no-residentes`, "inLanguage": "es", "articleSection": "Comparativas", "wordCount": 1200 }
  ],
  "/blog/evitar-bloqueos-mercury-wise-revolut": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Evitar bloqueos Mercury Wise Revolut", "item": `${BASE_URL}/blog/evitar-bloqueos-mercury-wise-revolut` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "Cómo evitar bloqueos en Mercury, Wise y Revolut Business", "description": "Por qué bloquean cuentas de LLC en Mercury, Wise y Revolut. Cómo prevenirlo y qué hacer si te bloquean.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/evitar-bloqueos-mercury-wise-revolut`, "inLanguage": "es", "articleSection": "Operativa", "wordCount": 1200 }
  ],
  "/blog/que-es-irs-guia-duenos-llc": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "Qué es el IRS", "item": `${BASE_URL}/blog/que-es-irs-guia-duenos-llc` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "¿Qué es el IRS? Guía completa para dueños de LLC", "description": "El IRS es la agencia tributaria de EE.UU. Qué es, qué exige a dueños de LLC, plazos, multas y cómo cumplir.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/que-es-irs-guia-duenos-llc`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 1100 }
  ],
  "/blog/llc-seguridad-juridica-proteccion-patrimonial": [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${BASE_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": "LLC seguridad jurídica", "item": `${BASE_URL}/blog/llc-seguridad-juridica-proteccion-patrimonial` }
    ]},
    { "@context": "https://schema.org", "@type": "Article", "headline": "LLC y seguridad jurídica: cómo protege tu patrimonio personal", "description": "Una LLC separa tu patrimonio personal del negocio. Cómo funciona la protección y cómo mantenerla fuerte.", "image": `${BASE_URL}/og-image.png`, "author": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL }, "publisher": { "@type": "Organization", "name": BRAND_NAME, "url": BASE_URL, "logo": { "@type": "ImageObject", "url": `${BASE_URL}/icon-192.png` } }, "datePublished": "2026-03-05", "mainEntityOfPage": `${BASE_URL}/blog/llc-seguridad-juridica-proteccion-patrimonial`, "inLanguage": "es", "articleSection": "Guías", "wordCount": 1200 }
  ],
};

export const FAQ_SCHEMA_ENTRIES = [
  {
    "@type": "Question" as const,
    "name": "¿Qué es una LLC?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Una LLC (Limited Liability Company) es una estructura empresarial estadounidense que ofrece protección de responsabilidad limitada y flexibilidad fiscal. Para no residentes con Single-Member LLC, no hay impuesto federal sobre la renta en EE.UU." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Necesito viajar a Estados Unidos para abrir una LLC?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "No. Todo el proceso es 100% remoto. En Exentax nos encargamos de la constitución, obtención del EIN, y apertura de cuenta bancaria sin que tengas que salir de tu país." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Cuál es el mejor estado para mi LLC?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Depende de tus prioridades: Nuevo México para menor coste, Wyoming para máxima privacidad, Delaware para el mejor marco legal e inversores. Consulta nuestros planes en exentax.com/servicios." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Cuánto tarda constituir una LLC?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "La constitución tarda entre 2 y 4 semanas. La obtención del EIN puede tardar de 1 a 8 semanas adicionales según la carga del IRS." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Es legal optimizar impuestos con una LLC americana?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Sí, es completamente legal. La optimización fiscal no es evasión. Se utilizan tratados internacionales y estructuras reconocidas por las autoridades fiscales de cada país." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Tengo que declarar la LLC en mi país de residencia?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Sí. La LLC debe declararse en tu país de residencia fiscal. En Exentax te asesoramos sobre cómo hacerlo correctamente según la legislación de España, Argentina, México, Colombia, Chile o Perú." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Qué formularios debo presentar al IRS?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Si eres foreign owner de una Single-Member LLC, debes presentar el Form 1120 junto con el Form 5472 cada año antes del 15 de marzo (o el 15 de septiembre si solicitas extensión con el Form 7004). También el BOI Report ante FinCEN y el Annual Report estatal en Wyoming y Delaware (Nuevo México no lo exige). En Exentax nos encargamos de preparar y presentar todo por ti." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Cuánto cuesta abrir una LLC en Estados Unidos?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Ofrecemos planes de constitución en Nuevo México, Wyoming y Delaware. Incluye constitución completa: Articles of Organization, Operating Agreement, EIN, agente registrado y apertura de cuenta bancaria Mercury. Agenda una asesoría para conocer los costes." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Cuánto cuesta el mantenimiento anual de una LLC?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "El mantenimiento incluye declaraciones IRS, compliance fiscal, renovación de agente registrado, Annual Report (en estados que lo exigen) y soporte continuo. Consulta nuestros planes en exentax.com/servicios." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Puedo tener una LLC siendo empleado por cuenta ajena?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Sí. Puedes tener una LLC en EE.UU. mientras trabajas como empleado en tu país. Lo importante es que tus ingresos por la LLC sean de fuentes compatibles y declares correctamente en tu país de residencia fiscal." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Qué diferencia hay entre una LLC y una Corporation?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "La LLC es más flexible fiscalmente y tiene menos requisitos formales. Para no residentes, la Single-Member LLC no tributa a nivel federal en EE.UU. (clasificada como Disregarded Entity). Una Corporation (C-Corp) tributa al 21% federal sobre beneficios." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Puedo abrir cuenta en Mercury sin viajar a Estados Unidos?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Sí. La apertura de cuenta bancaria en Mercury es 100% online. Solo necesitas tu LLC constituida y el EIN. En Exentax gestionamos todo el proceso de apertura por ti." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Puedo usar Stripe con mi LLC americana?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Sí. Con una LLC en EE.UU. tienes acceso completo a Stripe sin restricciones geográficas. Puedes cobrar en dólares, euros y más de 135 divisas a clientes de todo el mundo." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Cómo afecta a mis impuestos personales tener una LLC en Estados Unidos?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "Los ingresos de tu LLC se declaran según las reglas de tu país de residencia fiscal. La gran ventaja es que al no haber impuesto federal en EE.UU. para la LLC de no residente, no existe doble imposición. Además, facturas sin IVA a clientes internacionales. Te asesoramos sobre la mejor forma de optimizar tu declaración." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Qué pasa si no presento el Form 5472 a tiempo?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "El Form 5472 es una declaración informativa anual ante el IRS que debe presentarse dentro de plazo. En Exentax nos encargamos de prepararlo y presentarlo por ti como parte del servicio de mantenimiento, para que siempre estés al día con tus obligaciones." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Hay costes ocultos en vuestros servicios?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "No. Nuestros precios son cerrados e incluyen todo lo necesario: constitución, EIN, agente registrado, cuenta bancaria y configuración de Stripe. Sin permanencia, sin comisiones extra, sin sorpresas. Lo que ves en nuestra web es lo que pagas." }
  },
  {
    "@type": "Question" as const,
    "name": "¿Mi LLC tiene que cobrar IVA?",
    "acceptedAnswer": { "@type": "Answer" as const, "text": "No. Tu LLC americana no cobra IVA cuando provees servicios de consultoría, asesoramiento o desarrollo de software. EE.UU. no tiene IVA federal. Si tu cliente es una empresa en la UE (B2B), se aplica la inversión del sujeto pasivo y no pagas IVA. En Exentax te configuramos la facturación correctamente desde el primer día." }
  }
];
