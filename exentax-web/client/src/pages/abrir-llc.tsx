import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { CONTACT } from "@/lib/constants";
import { useLangPath } from "@/hooks/useLangPath";
import { useReveal } from "@/hooks/useReveal";
import {
  getLocalizedPath,
  type SupportedLang,
  type RouteKey,
} from "@shared/routes";
import FaqAccordionList from "@/components/sections/FaqAccordionList";

interface FaqEntry {
  q: string;
  a: string;
}

interface PillarLocaleContent {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
  breadcrumb: string;
  hero: {
    kicker: string;
    h1: string;
    h1green: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  whatIsLLC: { kicker: string; h2: string; paragraphs: string[] };
  steps: { kicker: string; h2: string; intro: string; items: { title: string; desc: string }[] };
  states: { kicker: string; h2: string; intro: string; items: { name: string; tagline: string; pros: string; cta: string; href: RouteKey }[] };
  costs: { kicker: string; h2: string; intro: string; rows: { label: string; value: string }[] };
  compliance: { kicker: string; h2: string; intro: string; items: string[] };
  banking: { kicker: string; h2: string; paragraphs: string[] };
  taxResidence: { kicker: string; h2: string; paragraphs: string[] };
  faq: { h2: string; items: FaqEntry[] };
  cta: { h2: string; p: string; primary: string; secondary: string };
}

// Inline locale-content map. Co-locating the pillar copy here (instead of
// scattering it across the six i18n locale files) keeps the page reviewable
// in a single diff and makes future copy refreshes a single-file change.
const PILLAR_CONTENT: Record<SupportedLang, PillarLocaleContent> = {
  es: {
    metaTitle: "Abrir LLC en Estados Unidos: guía paso a paso 2026 | Exentax",
    metaDescription:
      "Abrir una LLC en Estados Unidos en 2-4 días: estado, EIN, cuenta Mercury, IRS Form 5472 y declaración en España. Guía completa con asesores fiscales expertos.",
    ogTitle: "Abrir LLC en Estados Unidos: la guía definitiva 2026",
    ogDescription:
      "Cómo abrir una LLC americana sin SSN, qué estado elegir, cuánto cuesta de verdad y cómo declararla en tu IRPF. Asesoría gratuita de 30 minutos.",
    keywords:
      "abrir LLC, abrir LLC Estados Unidos, abrir LLC EE.UU., LLC para no residentes, abrir LLC desde España, abrir LLC sin SSN, mejor estado LLC, LLC Wyoming, LLC Delaware, LLC Nuevo México, EIN sin SSN, cuenta Mercury extranjero, Form 5472, declarar LLC IRPF",
    breadcrumb: "Abrir LLC en EE.UU.",
    hero: {
      kicker: "GUÍA DEFINITIVA",
      h1: "Abrir una LLC en Estados Unidos en 2026",
      h1green: "Paso a paso, sin SSN, en 2-4 días.",
      subtitle:
        "Todo lo que necesitas para constituir una LLC americana siendo no residente: el estado correcto, el EIN, la cuenta bancaria operativa, la presentación anual ante el IRS y la declaración limpia en tu país de residencia. Sin promesas mágicas, sin paraísos fiscales.",
      ctaPrimary: "Quiero abrir mi LLC",
      ctaSecondary: "Ver el proceso completo",
    },
    whatIsLLC: {
      kicker: "QUÉ ES",
      h2: "Una LLC es una sociedad de responsabilidad limitada estadounidense",
      paragraphs: [
        "La Limited Liability Company (LLC) es la figura societaria más usada por emprendedores internacionales para operar con clientes globales desde una entidad estadounidense. Separa tu patrimonio personal del de tu negocio y, cuando la propiedad es 100% extranjera y no hay actividad económica en EE.UU., el Internal Revenue Service la trata como una entidad fiscalmente transparente.",
        "Eso significa, en la práctica, que la LLC no paga impuesto federal en EE.UU. siempre que el dueño no resida allí, no tenga oficina ni empleados allí, y los ingresos no provengan de clientes estadounidenses con presencia comercial efectiva (US trade or business). Los beneficios pasan a tu declaración personal en el país donde sí eres residente fiscal.",
        "La LLC sí mantiene cada año dos obligaciones formales con el IRS: Form 1120 (declaración corporativa) y Form 5472 (declaración informativa por ser propiedad extranjera). Saltarse cualquiera de las dos cuesta 25.000 USD por formulario. Por eso llevarla por libre rara vez compensa, y por eso este es el primer asunto sobre el que te preguntamos en la asesoría gratuita.",
      ],
    },
    steps: {
      kicker: "EL PROCESO",
      h2: "Cómo abrir tu LLC paso a paso",
      intro:
        "El proceso real, sin atajos. Cada paso lleva entre unas horas y dos días. La mayoría de clientes está operando con su LLC en menos de una semana.",
      items: [
        { title: "1. Elegir el estado", desc: "Nuevo México (más barato y privado), Wyoming (privacidad reforzada), Delaware (prestigio para venture capital) o Florida (útil si pasas tiempo en EE.UU.). El estado correcto depende de tu modelo de negocio." },
        { title: "2. Reservar el nombre y nombrar Registered Agent", desc: "Verificamos disponibilidad en el registro estatal y designamos a Exentax como tu Registered Agent durante el primer año (incluido en todos los planes)." },
        { title: "3. Presentar los Articles of Organization", desc: "El documento fundacional ante el Secretary of State del estado elegido. Constitución oficial en 24-48h en Nuevo México, Wyoming y Florida; 5-7 días hábiles en Delaware." },
        { title: "4. Redactar el Operating Agreement", desc: "El acuerdo de funcionamiento interno de la LLC, adaptado a tu residencia fiscal. Es lo que demuestra ante un banco o ante Hacienda quién es realmente el dueño y cómo se reparten los beneficios." },
        { title: "5. Obtener el EIN ante el IRS", desc: "Solicitamos el Employer Identification Number directamente al IRS por fax (Form SS-4). No necesitas SSN ni ITIN. Plazo: 1-3 semanas." },
        { title: "6. Apertura de cuenta bancaria operativa", desc: "Pre-validamos tu solicitud para Mercury, Wise Business o Relay y la dejamos lista para aprobación en primera ronda. Tarjetas físicas y virtuales, USD/EUR, ACH y SWIFT." },
        { title: "7. BOI Report en FinCEN", desc: "Declaración del Beneficial Owner ante FinCEN, obligatoria desde 2024 para toda LLC nueva. Lo presentamos en cuanto tienes el EIN." },
        { title: "8. Compliance anual", desc: "Cada año: Form 1120 + Form 5472, renovación de Registered Agent, Annual Report estatal donde aplique (Wyoming, Delaware, Florida; Nuevo México no lo exige) y revisión fiscal personalizada." },
      ],
    },
    states: {
      kicker: "QUÉ ESTADO ELEGIR",
      h2: "Cuatro estados, cuatro perfiles",
      intro:
        "No existe el estado universalmente mejor: existe el estado correcto para tu situación. Esta es la matriz que usamos en la asesoría gratuita.",
      items: [
        { name: "Nuevo México", tagline: "El más económico y privado", pros: "Sin Annual Report, sin impuesto estatal, propiedad anónima en el registro público. Recomendado por defecto para freelancers y consultores.", cta: "Ver plan Nuevo México", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Privacidad reforzada", pros: "Sin impuesto estatal, máxima protección del beneficiario en registros públicos. Buen encaje para proyectos en crecimiento y patrimonio sensible.", cta: "Ver plan Wyoming", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Marco legal premium", pros: "Court of Chancery, jurisprudencia corporativa madura, máxima credibilidad ante venture capital y bancos internacionales. Ideal para SaaS y startups.", cta: "Ver plan Delaware", href: "service_llc_de" },
        { name: "Florida", tagline: "Operativa con visado / E-2", pros: "Útil cuando el dueño pasa tiempo en EE.UU. o evalúa una visa de inversor. Estado con clima fiscal favorable y excelente acceso bancario.", cta: "Ver plan Florida", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "CUÁNTO CUESTA",
      h2: "Costes reales de abrir y mantener una LLC",
      intro:
        "Cifras orientativas en USD. La asesoría diagnóstica de 30 min ajusta el coste exacto a tu caso (incluida sin compromiso).",
      rows: [
        { label: "Tasa estatal Nuevo México", value: "≈ 50 USD (one-off, sin renovación)" },
        { label: "Tasa estatal Wyoming", value: "≈ 100 USD constitución + 60 USD/año (Annual Report)" },
        { label: "Tasa estatal Delaware", value: "≈ 90 USD constitución + 300 USD/año (Franchise Tax)" },
        { label: "Tasa estatal Florida", value: "≈ 125 USD constitución + 138,75 USD/año (Annual Report)" },
        { label: "Registered Agent (mercado)", value: "100-200 USD/año (incluido en todos los planes Exentax el primer año)" },
        { label: "Form 1120 + 5472 (anual, profesional)", value: "Variable. Sanción IRS por presentación tardía: 25.000 USD por formulario." },
        { label: "Cuenta Mercury / Wise / Relay", value: "0 USD apertura, sin mantenimiento" },
      ],
    },
    compliance: {
      kicker: "OBLIGACIONES ANUALES",
      h2: "Lo que tu LLC tiene que presentar cada año",
      intro:
        "Aunque la LLC no pague impuesto federal, sí mantiene obligaciones formales. Saltárselas convierte un setup limpio en una multa de cinco cifras.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — declaración corporativa anual.",
        "Form 5472 (Information Return of a 25% Foreign-Owned U.S. Corporation) — informativa por ser propiedad extranjera.",
        "Form 7004 (extensión automática) — cuando se necesita prorrogar 6 meses adicionales el plazo de 1120/5472.",
        "BOI Report ante FinCEN — Beneficial Ownership Information, actualización si cambian los datos del dueño.",
        "Annual Report estatal — obligatorio en Wyoming, Delaware y Florida; no aplica en Nuevo México.",
        "Renovación del Registered Agent — anual.",
        "Declaración personal en tu país de residencia — IRPF en España (incluido Modelo 720/721 cuando aplique), ISR en México, DIAN en Colombia, etc.",
      ],
    },
    banking: {
      kicker: "BANCA",
      h2: "Mercury, Wise Business o Relay: la cuenta operativa",
      paragraphs: [
        "Una LLC sin cuenta bancaria es papel mojado. Por eso pre-validamos tu solicitud antes de enviarla: descripción de actividad, documentación, prueba de domicilio, estructura societaria. Resultado: aprobación en primera ronda en 1-3 días hábiles.",
        "Mercury es el estándar para freelancers y SaaS: USD-first, ACH, wire, tarjetas físicas y virtuales. Wise Business funciona bien cuando facturas en múltiples divisas (EUR, GBP, USD). Relay es la opción más sólida si gestionas varias entidades o necesitas multi-user con permisos granulares.",
        "Las tres son fintech con licencia bancaria respaldada por bancos asegurados FDIC, no son bancos en sí mismas. Eso te da operativa moderna sin las fricciones de un banco tradicional, pero también significa que conviene tener una cuenta secundaria de respaldo. En la asesoría te explicamos cuál combinar con cuál según tu volumen.",
      ],
    },
    taxResidence: {
      kicker: "FISCALIDAD PERSONAL",
      h2: "Y en mi país, ¿cómo se declara?",
      paragraphs: [
        "La LLC es transparente en EE.UU. y, en la mayoría de países, también lo es para tu fisco local: los beneficios se imputan al socio y se declaran en tu IRPF (España), ISR (México), DIAN (Colombia), AFIP (Argentina) o equivalente. No es renta exenta, no es paraíso, no se esconde.",
        "En España, además, hay que vigilar Modelo 720 (bienes en el extranjero superiores a 50.000 €), Modelo 721 (criptomonedas en el extranjero superiores a 50.000 €) y aplicar correctamente el convenio para evitar la doble imposición entre España y Estados Unidos. Una mala estructuración puede convertir un ahorro fiscal en una contingencia.",
        "Por eso el plan no termina en la constitución: el seguimiento anual incluye revisión de tu declaración personal y coordinación con tu asesor local cuando es necesario.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes sobre abrir una LLC en EE.UU.",
      items: [
        { q: "¿Puedo abrir una LLC sin tener SSN ni ITIN?", a: "Sí. El EIN se solicita al IRS por fax con el Form SS-4 marcando \"Foreign\" como tipo de solicitante. Ni la LLC ni el dueño necesitan tener SSN para constituir, abrir cuenta bancaria u operar." },
        { q: "¿Qué estado elijo si soy freelancer o consultor?", a: "Nuevo México por defecto: el más económico, sin Annual Report, sin impuesto estatal y con privacidad del beneficiario en el registro público. Wyoming es el upgrade natural cuando se busca un perfil de privacidad reforzada." },
        { q: "¿Cuánto tarda el proceso completo?", a: "Constitución oficial en 24-48 h en Nuevo México, Wyoming y Florida; 5-7 días hábiles en Delaware. EIN: 1-3 semanas. Cuenta bancaria: 1-3 días hábiles tras tener el EIN. Plazo medio para operar: 2-4 semanas desde la firma." },
        { q: "¿Realmente la LLC paga 0 USD de impuesto federal en EE.UU.?", a: "Sí, siempre que el dueño no resida en EE.UU., no haya US trade or business y no haya ingresos de fuente americana. Pero la LLC sigue presentando Form 1120 + Form 5472 cada año (informativos, no liquidan impuesto). La sanción por no presentar es 25.000 USD por formulario." },
        { q: "¿Y los beneficios pasan a mi IRPF en España?", a: "Sí. La LLC es fiscalmente transparente: los beneficios se imputan al socio y se declaran en tu IRPF español como rendimientos de actividad económica. Aplica el convenio España-EE.UU. para evitar la doble imposición." },
        { q: "¿Qué pasa con Mercury si soy de Latinoamérica?", a: "Mercury acepta non-resident-owned LLCs con dueños de prácticamente cualquier país. La clave es presentar la solicitud bien pre-validada: descripción de actividad clara, documentación completa y coherencia entre el Operating Agreement y la solicitud." },
        { q: "¿La LLC puede facturar en EUR a clientes europeos?", a: "Sí. Wise Business o un IBAN europeo de Mercury IO te permiten cobrar en EUR. La LLC factura como entidad estadounidense; el IVA depende del régimen que aplique en tu país de residencia (B2B intracomunitario, OSS para B2C, etc.)." },
        { q: "¿Por qué no abrir una sociedad en Estonia o Dubai en vez de una LLC?", a: "Comparativa larga, pero el resumen es: para freelancers internacionales sin equipo en EE.UU., la LLC americana suele ganar en coste, banca, payment-rails (Stripe US) y reputación frente a Hacienda. Estonia y Dubai tienen sentido en escenarios concretos que evaluamos en la asesoría." },
      ],
    },
    cta: {
      h2: "Si quieres abrir tu LLC bien hecha desde el primer día",
      p: "Asesoría gratuita de 30 minutos: te decimos qué estado tiene sentido, cuánto te costará realmente y qué obligaciones vas a tener cada año en tu país. Sin compromiso.",
      primary: "Agendar mi asesoría gratuita",
      secondary: "Ver planes y precios",
    },
  },
  en: {
    metaTitle: "Open a US LLC in 2026: step-by-step guide for non-residents | Exentax",
    metaDescription:
      "Open a US LLC in 2-4 days as a non-resident: pick the state, get the EIN without SSN, open Mercury, file Form 1120 + 5472 with the IRS and declare profits at home.",
    ogTitle: "Open a US LLC in 2026: the definitive non-resident guide",
    ogDescription:
      "How to form a US LLC without an SSN, which state to pick, what it really costs and how to declare it at home. Free 30-min strategic call.",
    keywords:
      "open US LLC, open LLC USA, LLC for non-residents, open US LLC without SSN, best state for LLC, Wyoming LLC, Delaware LLC, New Mexico LLC, EIN without SSN, Mercury account non-resident, Form 5472, US LLC tax",
    breadcrumb: "Open a US LLC",
    hero: {
      kicker: "DEFINITIVE GUIDE",
      h1: "Open a US LLC in 2026",
      h1green: "Step by step, no SSN, in 2-4 days.",
      subtitle:
        "Everything you need to form a US LLC as a non-resident: the right state, the EIN, the operational bank account, the annual IRS filing, and a clean declaration in your country of tax residency. No magic promises, no offshore tricks.",
      ctaPrimary: "I want to open my LLC",
      ctaSecondary: "See the full process",
    },
    whatIsLLC: {
      kicker: "WHAT IT IS",
      h2: "An LLC is a US limited-liability company",
      paragraphs: [
        "The Limited Liability Company (LLC) is the entity international entrepreneurs use most often to operate with global clients from a US-based vehicle. It separates your personal assets from your business assets, and when the LLC is 100% foreign-owned with no US activity, the IRS treats it as a fiscally transparent entity.",
        "In practice that means $0 of US federal tax for the LLC itself, provided the owner does not live in the US, has no office or staff there, and no income comes from US clients with effective US trade or business. Profits flow through to your personal return in the country where you are tax-resident.",
        "The LLC does keep two annual obligations with the IRS: Form 1120 (corporate return) and Form 5472 (foreign-ownership information return). Skipping either of them costs $25,000 per form. That is why running the LLC alone rarely pays off, and why this is the first thing we ask about on the free strategic call.",
      ],
    },
    steps: {
      kicker: "THE PROCESS",
      h2: "How to open your LLC, step by step",
      intro:
        "The actual process, no shortcuts. Each step takes a few hours to two days. Most clients are operating with their LLC inside one week.",
      items: [
        { title: "1. Pick the state", desc: "New Mexico (cheapest and most private), Wyoming (reinforced privacy), Delaware (VC-grade prestige) or Florida (useful if you spend time in the US). The right state depends on your business model." },
        { title: "2. Reserve the name and appoint a Registered Agent", desc: "We check availability with the Secretary of State and act as your Registered Agent for the first year (included in every plan)." },
        { title: "3. File the Articles of Organization", desc: "The founding document with the Secretary of State of your chosen state. Official formation in 24-48h in NM, WY and FL; 5-7 business days in Delaware." },
        { title: "4. Draft the Operating Agreement", desc: "The internal operating rules of the LLC, tailored to your tax residency. This is what proves to a bank or to your home tax authority who actually owns the LLC and how profits are split." },
        { title: "5. Get the EIN from the IRS", desc: "We file Form SS-4 by fax marking 'Foreign' — no SSN or ITIN required. Timeline: 1-3 weeks." },
        { title: "6. Open the operational bank account", desc: "We pre-screen the application for Mercury, Wise Business or Relay so it lands approved on the first round. Physical and virtual cards, USD/EUR, ACH and SWIFT." },
        { title: "7. BOI Report at FinCEN", desc: "Beneficial Ownership Information report, mandatory for every new US entity since 2024. We file it as soon as the EIN is in hand." },
        { title: "8. Annual compliance", desc: "Every year: Form 1120 + Form 5472, Registered Agent renewal, state Annual Report where applicable (WY, DE, FL; not in NM) and a personalised tax review." },
      ],
    },
    states: {
      kicker: "WHICH STATE",
      h2: "Four states, four profiles",
      intro: "There is no universally best state — there is the right state for your situation. This is the matrix we use during the free call.",
      items: [
        { name: "New Mexico", tagline: "The cheapest and most private", pros: "No Annual Report, no state income tax, anonymous ownership in the public registry. Default recommendation for freelancers and consultants.", cta: "See the New Mexico plan", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Reinforced privacy", pros: "No state income tax, top-tier owner privacy in public records. Good fit for growing projects and sensitive net worth.", cta: "See the Wyoming plan", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Premium legal framework", pros: "Court of Chancery, mature corporate case law, top credibility with VCs and international banks. Ideal for SaaS and startups.", cta: "See the Delaware plan", href: "service_llc_de" },
        { name: "Florida", tagline: "Operating with a visa / E-2", pros: "Useful when the owner spends time in the US or is evaluating an investor visa. Favorable tax climate and excellent banking access.", cta: "See the Florida plan", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "REAL COST",
      h2: "What it really costs to open and maintain an LLC",
      intro: "Indicative figures in USD. The 30-min strategic call narrows the exact number to your case (free, no commitment).",
      rows: [
        { label: "New Mexico state fee", value: "≈ $50 (one-off, no renewal)" },
        { label: "Wyoming state fee", value: "≈ $100 formation + $60/yr (Annual Report)" },
        { label: "Delaware state fee", value: "≈ $90 formation + $300/yr (Franchise Tax)" },
        { label: "Florida state fee", value: "≈ $125 formation + $138.75/yr (Annual Report)" },
        { label: "Registered Agent (market)", value: "$100-200/yr (included free for the first year in every Exentax plan)" },
        { label: "Form 1120 + 5472 (annual, professional)", value: "Variable. IRS penalty for late filing: $25,000 per form." },
        { label: "Mercury / Wise / Relay account", value: "$0 to open, no monthly fees" },
      ],
    },
    compliance: {
      kicker: "ANNUAL OBLIGATIONS",
      h2: "What your LLC has to file every year",
      intro: "Even when the LLC owes $0 of federal tax, formal obligations remain. Skipping them turns a clean setup into a five-figure penalty.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — annual corporate return.",
        "Form 5472 (Information Return of a 25% Foreign-Owned US Corporation) — foreign-ownership information return.",
        "Form 7004 (automatic extension) — when an extra 6 months are needed for 1120/5472.",
        "BOI Report at FinCEN — Beneficial Ownership Information; refile when owner data changes.",
        "State Annual Report — required in Wyoming, Delaware and Florida; not required in New Mexico.",
        "Registered Agent renewal — annual.",
        "Personal return in your country of residence — IRPF in Spain (including Modelo 720/721 when applicable), ISR in Mexico, DIAN in Colombia, etc.",
      ],
    },
    banking: {
      kicker: "BANKING",
      h2: "Mercury, Wise Business or Relay: the operational account",
      paragraphs: [
        "An LLC with no bank account is paper. That is why we pre-screen the application before submission: business description, documentation, proof of address, ownership structure. Result: first-round approval in 1-3 business days.",
        "Mercury is the default for freelancers and SaaS: USD-first, ACH, wire, physical and virtual cards. Wise Business is the right choice when you bill in multiple currencies (EUR, GBP, USD). Relay is the most solid pick if you run several entities or need granular multi-user permissions.",
        "All three are fintechs backed by FDIC-insured banks, not banks themselves. That gives you modern operations without the friction of a traditional bank, but also means a backup secondary account is wise. We tell you which to pair with which on the call, based on your volume.",
      ],
    },
    taxResidence: {
      kicker: "PERSONAL TAX",
      h2: "And how do I declare it back home?",
      paragraphs: [
        "The LLC is transparent in the US and, in most countries, also transparent for your home tax authority: profits are imputed to the owner and declared in IRPF (Spain), ISR (Mexico), DIAN (Colombia), AFIP (Argentina) or equivalent. It is not exempt income, it is not offshore, it does not get hidden.",
        "In Spain you also have to watch Modelo 720 (foreign assets above €50,000), Modelo 721 (foreign-held crypto above €50,000) and apply the Spain-US double taxation treaty correctly. Bad structuring can turn tax savings into a liability.",
        "That is why the plan does not end at formation: annual follow-up includes a review of your personal return and coordination with your local accountant when needed.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "Can I open a US LLC without an SSN or ITIN?", a: "Yes. We file Form SS-4 by fax with the IRS marking 'Foreign' as the applicant type. Neither the LLC nor the owner needs an SSN to form, open a bank account or operate." },
        { q: "Which state should I pick as a freelancer or consultant?", a: "New Mexico by default: cheapest, no Annual Report, no state income tax, and owner privacy in the public registry. Wyoming is the natural upgrade when reinforced privacy is the priority." },
        { q: "How long does the full process take?", a: "Official formation in 24-48h in NM, WY and FL; 5-7 business days in Delaware. EIN: 1-3 weeks. Bank account: 1-3 business days after the EIN is in. Average time to operate: 2-4 weeks from signature." },
        { q: "Does the LLC really pay $0 of US federal tax?", a: "Yes — provided the owner does not live in the US, there is no US trade or business and no US-source income. But the LLC still files Form 1120 + Form 5472 every year (informational, no tax due). The penalty for not filing is $25,000 per form." },
        { q: "And do profits flow to my personal return?", a: "Yes. The LLC is fiscally transparent: profits are imputed to the owner and declared on your personal return as self-employment income. The Spain-US (or equivalent) tax treaty applies." },
        { q: "What about Mercury if I'm in Latin America?", a: "Mercury accepts non-resident-owned LLCs with owners from virtually any country. The key is a well-pre-screened application: clear activity description, complete documentation, coherence between the Operating Agreement and the application." },
        { q: "Can the LLC bill in EUR to European clients?", a: "Yes. Wise Business or a Mercury IO European IBAN let you collect in EUR. The LLC bills as a US entity; VAT treatment depends on the regime in your country of residence (intra-EU B2B, OSS for B2C, etc.)." },
        { q: "Why not open an Estonian or Dubai company instead?", a: "Long comparison, short answer: for international freelancers without a US team, a US LLC usually wins on cost, banking, payment rails (Stripe US) and credibility with your home tax authority. Estonia and Dubai make sense in specific scenarios we evaluate on the call." },
      ],
    },
    cta: {
      h2: "If you want your LLC done right from day one",
      p: "Free 30-min strategic call: we tell you which state makes sense, what it will really cost, and what your annual obligations look like at home. No commitment.",
      primary: "Book my free call",
      secondary: "See plans and pricing",
    },
  },
  fr: {
    metaTitle: "Ouvrir une LLC aux États-Unis en 2026 : le guide pas à pas | Exentax",
    metaDescription:
      "Ouvrir une LLC américaine en 2-4 jours en tant que non-résident : choisir l'État, obtenir l'EIN sans SSN, ouvrir Mercury, déposer Form 1120 + 5472 et déclarer en France.",
    ogTitle: "Ouvrir une LLC aux États-Unis : le guide définitif 2026",
    ogDescription:
      "Comment créer une LLC américaine sans SSN, quel État choisir, ce que ça coûte vraiment et comment la déclarer chez soi. Consultation stratégique gratuite de 30 min.",
    keywords:
      "ouvrir LLC, ouvrir LLC États-Unis, LLC pour non-résidents, ouvrir LLC sans SSN, meilleur État LLC, LLC Wyoming, LLC Delaware, LLC Nouveau-Mexique, EIN sans SSN, compte Mercury non-résident, Form 5472, fiscalité LLC France",
    breadcrumb: "Ouvrir une LLC américaine",
    hero: {
      kicker: "GUIDE DÉFINITIF",
      h1: "Ouvrir une LLC aux États-Unis en 2026",
      h1green: "Pas à pas, sans SSN, en 2-4 jours.",
      subtitle:
        "Tout ce qu'il faut pour créer une LLC américaine en tant que non-résident : le bon État, l'EIN, le compte bancaire opérationnel, les déclarations annuelles à l'IRS et une déclaration propre dans votre pays de résidence fiscale. Pas de promesses magiques, pas de paradis fiscal.",
      ctaPrimary: "Je veux ouvrir ma LLC",
      ctaSecondary: "Voir le processus complet",
    },
    whatIsLLC: {
      kicker: "QU'EST-CE QUE C'EST",
      h2: "Une LLC est une société américaine à responsabilité limitée",
      paragraphs: [
        "La Limited Liability Company (LLC) est la structure préférée des entrepreneurs internationaux pour opérer avec une clientèle mondiale depuis une entité américaine. Elle sépare votre patrimoine personnel de celui de l'entreprise et, lorsqu'elle appartient à 100 % à un non-résident sans activité aux États-Unis, l'IRS la traite comme une entité fiscalement transparente.",
        "Concrètement, cela veut dire 0 USD d'impôt fédéral pour la LLC tant que le propriétaire ne réside pas aux États-Unis, n'y a ni bureau ni salariés, et que les revenus ne proviennent pas d'une véritable US trade or business. Les bénéfices remontent dans votre déclaration personnelle dans votre pays de résidence.",
        "La LLC conserve deux obligations annuelles auprès de l'IRS : Form 1120 (déclaration corporate) et Form 5472 (déclaration informative liée à la propriété étrangère). Manquer l'une des deux coûte 25 000 USD par formulaire. C'est pour cela que la gérer seul paie rarement, et la première chose que nous validons en consultation stratégique gratuite.",
      ],
    },
    steps: {
      kicker: "LE PROCESSUS",
      h2: "Comment ouvrir votre LLC, étape par étape",
      intro:
        "Le processus réel, sans raccourcis. Chaque étape dure de quelques heures à deux jours. La plupart des clients opèrent en moins d'une semaine.",
      items: [
        { title: "1. Choisir l'État", desc: "Nouveau-Mexique (le moins cher et le plus privé), Wyoming (confidentialité renforcée), Delaware (prestige VC), Floride (utile si vous passez du temps aux USA). L'État dépend de votre modèle." },
        { title: "2. Réserver le nom et nommer un Registered Agent", desc: "Nous vérifions la disponibilité auprès du Secretary of State et agissons comme Registered Agent la première année (inclus dans tous les plans)." },
        { title: "3. Déposer les Articles of Organization", desc: "Le document fondateur auprès du Secretary of State. Constitution officielle en 24-48 h au NM, WY, FL ; 5-7 jours ouvrés au Delaware." },
        { title: "4. Rédiger l'Operating Agreement", desc: "L'accord interne de la LLC, adapté à votre résidence fiscale. C'est ce qui prouve à une banque ou à votre fisc qui possède réellement la LLC." },
        { title: "5. Obtenir l'EIN auprès de l'IRS", desc: "Nous déposons le Form SS-4 par fax en cochant 'Foreign'. Aucun SSN ni ITIN requis. Délai : 1-3 semaines." },
        { title: "6. Ouvrir le compte bancaire opérationnel", desc: "Pré-validation pour Mercury, Wise Business ou Relay. Cartes physiques et virtuelles, USD/EUR, ACH et SWIFT." },
        { title: "7. BOI Report auprès de FinCEN", desc: "Déclaration du bénéficiaire effectif, obligatoire depuis 2024 pour toute nouvelle LLC." },
        { title: "8. Compliance annuelle", desc: "Chaque année : Form 1120 + Form 5472, renouvellement du Registered Agent, Annual Report de l'État (WY, DE, FL ; pas au NM) et revue fiscale personnalisée." },
      ],
    },
    states: {
      kicker: "QUEL ÉTAT",
      h2: "Quatre États, quatre profils",
      intro: "Pas d'État universellement meilleur : il y a l'État qui correspond à votre situation. Voici la matrice utilisée en consultation.",
      items: [
        { name: "Nouveau-Mexique", tagline: "Le moins cher et le plus privé", pros: "Pas d'Annual Report, pas d'impôt d'État, propriété anonyme. Recommandation par défaut pour freelances et consultants.", cta: "Voir le plan Nouveau-Mexique", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Confidentialité renforcée", pros: "Pas d'impôt d'État, protection maximale du bénéficiaire dans les registres publics. Idéal pour projets en croissance.", cta: "Voir le plan Wyoming", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Cadre juridique premium", pros: "Court of Chancery, jurisprudence corporate mature, crédibilité maximale auprès des VC. Idéal SaaS et startups.", cta: "Voir le plan Delaware", href: "service_llc_de" },
        { name: "Floride", tagline: "Visa / E-2 friendly", pros: "Utile si vous passez du temps aux USA ou évaluez un visa investisseur. Bon climat fiscal et accès bancaire excellent.", cta: "Voir le plan Floride", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "COÛT RÉEL",
      h2: "Ce que coûte vraiment une LLC",
      intro: "Chiffres indicatifs en USD. La consultation stratégique de 30 min ajuste le coût exact à votre cas (gratuite).",
      rows: [
        { label: "Frais d'État Nouveau-Mexique", value: "≈ 50 USD (one-off, sans renouvellement)" },
        { label: "Frais d'État Wyoming", value: "≈ 100 USD constitution + 60 USD/an (Annual Report)" },
        { label: "Frais d'État Delaware", value: "≈ 90 USD constitution + 300 USD/an (Franchise Tax)" },
        { label: "Frais d'État Floride", value: "≈ 125 USD constitution + 138,75 USD/an (Annual Report)" },
        { label: "Registered Agent (marché)", value: "100-200 USD/an (inclus la 1ʳᵉ année dans tous les plans Exentax)" },
        { label: "Form 1120 + 5472 (annuel, professionnel)", value: "Variable. Pénalité IRS si retard : 25 000 USD par formulaire." },
        { label: "Compte Mercury / Wise / Relay", value: "0 USD à l'ouverture, sans frais mensuels" },
      ],
    },
    compliance: {
      kicker: "OBLIGATIONS ANNUELLES",
      h2: "Ce que votre LLC doit déposer chaque année",
      intro: "Même sans impôt fédéral à payer, les obligations formelles demeurent. Les ignorer transforme un setup propre en pénalité à cinq chiffres.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — déclaration corporate annuelle.",
        "Form 5472 (Information Return) — informative liée à la propriété étrangère.",
        "Form 7004 (extension automatique) — 6 mois supplémentaires si nécessaire.",
        "BOI Report auprès de FinCEN — bénéficiaire effectif, à mettre à jour si les données changent.",
        "Annual Report d'État — Wyoming, Delaware et Floride ; pas le Nouveau-Mexique.",
        "Renouvellement du Registered Agent — annuel.",
        "Déclaration personnelle dans votre pays de résidence — France, Belgique, Suisse, etc.",
      ],
    },
    banking: {
      kicker: "BANQUE",
      h2: "Mercury, Wise Business ou Relay : le compte opérationnel",
      paragraphs: [
        "Une LLC sans compte bancaire ne sert à rien. Nous pré-validons donc votre demande avant envoi : description d'activité, documentation, justificatif d'adresse, structure de propriété. Résultat : approbation en première intention en 1-3 jours ouvrés.",
        "Mercury est le standard des freelances et SaaS : USD-first, ACH, wire, cartes physiques et virtuelles. Wise Business convient quand vous facturez en plusieurs devises (EUR, GBP, USD). Relay est la pilule la plus solide pour gérer plusieurs entités ou des permissions multi-utilisateurs.",
        "Les trois sont des fintechs adossées à des banques assurées FDIC, pas des banques. Cela donne une opérativité moderne, mais un compte secondaire de secours est conseillé. Nous vous expliquons les combinaisons en fonction de votre volume.",
      ],
    },
    taxResidence: {
      kicker: "FISCALITÉ PERSONNELLE",
      h2: "Et chez moi, comment ça se déclare ?",
      paragraphs: [
        "La LLC est transparente aux USA et, dans la plupart des pays, transparente aussi pour votre fisc : les bénéfices sont imputés au propriétaire et déclarés dans votre déclaration personnelle (impôt sur le revenu BNC en France, IRPF en Espagne, etc.). Pas de revenu exonéré, pas d'offshore, rien de caché.",
        "En France, attention au formulaire 3916 (comptes à l'étranger), à la convention fiscale franco-américaine et au régime BNC/BIC adapté. Une mauvaise structuration transforme une économie d'impôt en risque.",
        "Le plan ne s'arrête donc pas à la constitution : le suivi annuel inclut une revue de votre déclaration personnelle et la coordination avec votre comptable local si besoin.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Puis-je ouvrir une LLC sans SSN ni ITIN ?", a: "Oui. L'EIN se demande à l'IRS par fax via Form SS-4 en cochant 'Foreign'. Ni la LLC ni le propriétaire n'ont besoin d'un SSN." },
        { q: "Quel État choisir si je suis freelance ou consultant ?", a: "Nouveau-Mexique par défaut : le moins cher, sans Annual Report, sans impôt d'État, propriété anonyme. Wyoming est l'upgrade naturel pour la confidentialité renforcée." },
        { q: "Combien de temps prend le processus complet ?", a: "Constitution officielle en 24-48 h au NM, WY, FL ; 5-7 jours ouvrés au Delaware. EIN : 1-3 semaines. Compte bancaire : 1-3 jours ouvrés après l'EIN." },
        { q: "La LLC paie-t-elle vraiment 0 USD d'impôt fédéral ?", a: "Oui, à condition que le propriétaire ne réside pas aux USA, qu'il n'y ait pas d'US trade or business et pas de revenus de source américaine. Mais Form 1120 + Form 5472 doivent être déposés chaque année." },
        { q: "Et les bénéfices remontent dans ma déclaration française ?", a: "Oui. La LLC est fiscalement transparente : les bénéfices sont imputés au propriétaire et déclarés en BNC ou BIC selon le cas. Convention franco-américaine applicable." },
        { q: "Mercury depuis l'Europe ?", a: "Mercury accepte les LLC à propriété étrangère depuis quasi tout pays. La clé est une demande bien pré-validée." },
        { q: "Je peux facturer en EUR à des clients européens ?", a: "Oui. Wise Business ou un IBAN européen Mercury IO permettent d'encaisser en EUR. Le traitement TVA dépend de votre pays de résidence." },
        { q: "Pourquoi pas une e-Residency estonienne ou Dubai ?", a: "Pour les freelances internationaux sans équipe aux USA, la LLC américaine gagne en général sur le coût, la banque et la crédibilité fiscale. Estonie et Dubai ont du sens dans des cas précis." },
      ],
    },
    cta: {
      h2: "Pour ouvrir votre LLC bien faite dès le premier jour",
      p: "Consultation stratégique gratuite de 30 min : on vous dit quel État a du sens, le coût réel et vos obligations annuelles. Sans engagement.",
      primary: "Réserver ma consultation gratuite",
      secondary: "Voir les plans et tarifs",
    },
  },
  de: {
    metaTitle: "US-LLC eröffnen 2026: Schritt-für-Schritt-Anleitung für Nicht-Residenten | Exentax",
    metaDescription:
      "US-LLC in 2-4 Tagen als Nicht-Resident eröffnen: Bundesstaat wählen, EIN ohne SSN, Mercury-Konto, Form 1120 + 5472 beim IRS und saubere Erklärung im Heimatland.",
    ogTitle: "US-LLC eröffnen 2026: der definitive Leitfaden",
    ogDescription:
      "Wie man eine US-LLC ohne SSN gründet, welcher Bundesstaat passt, was es wirklich kostet und wie man sie zuhause deklariert. Kostenloses 30-min Strategiegespräch.",
    keywords:
      "US LLC eröffnen, LLC USA gründen, LLC für Nicht-Residenten, LLC ohne SSN, bester Bundesstaat LLC, Wyoming LLC, Delaware LLC, New Mexico LLC, EIN ohne SSN, Mercury Konto Ausland, Form 5472, US LLC Steuer Deutschland",
    breadcrumb: "US-LLC eröffnen",
    hero: {
      kicker: "DEFINITIVER LEITFADEN",
      h1: "US-LLC eröffnen 2026",
      h1green: "Schritt für Schritt, ohne SSN, in 2-4 Tagen.",
      subtitle:
        "Alles, was Sie brauchen, um eine US-LLC als Nicht-Resident zu gründen: der richtige Bundesstaat, die EIN, das operative Bankkonto, die jährlichen IRS-Meldungen und eine saubere Erklärung in Ihrem Wohnsitzland. Keine magischen Versprechen, keine Offshore-Tricks.",
      ctaPrimary: "Ich will meine LLC eröffnen",
      ctaSecondary: "Den vollständigen Prozess sehen",
    },
    whatIsLLC: {
      kicker: "WAS IST DAS",
      h2: "Eine LLC ist eine US-Gesellschaft mit beschränkter Haftung",
      paragraphs: [
        "Die Limited Liability Company (LLC) ist die meistverwendete Rechtsform internationaler Unternehmer, um über eine US-Entität mit globaler Kundschaft zu arbeiten. Sie trennt Ihr Privatvermögen vom Geschäftsvermögen und wird vom IRS als steuerlich transparent behandelt, wenn sie zu 100 % einem Nicht-Residenten gehört und in den USA keine Geschäftstätigkeit ausübt.",
        "In der Praxis: 0 USD US-Bundessteuer für die LLC selbst, sofern der Inhaber nicht in den USA lebt, kein Büro/Personal dort hat und die Einnahmen nicht aus einer effektiven US trade or business stammen. Die Gewinne fließen in Ihre persönliche Steuererklärung im Wohnsitzland.",
        "Die LLC behält jedoch zwei jährliche Pflichten gegenüber dem IRS: Form 1120 (Körperschaftserklärung) und Form 5472 (Auslandsbesitz-Informationsmeldung). Jede vergessene Meldung kostet 25.000 USD. Deshalb ist DIY selten lohnend — und genau das prüfen wir im kostenlosen Erstgespräch.",
      ],
    },
    steps: {
      kicker: "DER PROZESS",
      h2: "So eröffnen Sie Ihre LLC, Schritt für Schritt",
      intro: "Der echte Ablauf, ohne Abkürzungen. Jeder Schritt dauert ein paar Stunden bis zwei Tage. Die meisten Mandanten arbeiten innerhalb einer Woche mit ihrer LLC.",
      items: [
        { title: "1. Bundesstaat wählen", desc: "New Mexico (am günstigsten, am privatesten), Wyoming (verstärkte Privatsphäre), Delaware (VC-tauglich), Florida (sinnvoll bei US-Aufenthalten)." },
        { title: "2. Namen reservieren und Registered Agent ernennen", desc: "Wir prüfen die Verfügbarkeit beim Secretary of State und übernehmen den Registered Agent im ersten Jahr (in jedem Plan enthalten)." },
        { title: "3. Articles of Organization einreichen", desc: "Das Gründungsdokument beim Secretary of State. Offizielle Gründung in 24-48 h in NM, WY, FL; 5-7 Werktage in Delaware." },
        { title: "4. Operating Agreement erstellen", desc: "Die interne Geschäftsordnung der LLC, abgestimmt auf Ihre steuerliche Ansässigkeit. Beweist Bank und Finanzamt, wer wirklich Eigentümer ist." },
        { title: "5. EIN beim IRS beantragen", desc: "Form SS-4 per Fax mit 'Foreign'. Kein SSN/ITIN nötig. Dauer: 1-3 Wochen." },
        { title: "6. Operatives Bankkonto eröffnen", desc: "Pre-Screening für Mercury, Wise Business oder Relay. Physische und virtuelle Karten, USD/EUR, ACH und SWIFT." },
        { title: "7. BOI Report bei FinCEN", desc: "Beneficial-Ownership-Meldung, Pflicht seit 2024 für jede neue LLC." },
        { title: "8. Jährliche Compliance", desc: "Jedes Jahr: Form 1120 + Form 5472, Registered-Agent-Verlängerung, Annual Report (WY, DE, FL; nicht in NM) und persönliche Steuerprüfung." },
      ],
    },
    states: {
      kicker: "WELCHER STAAT",
      h2: "Vier Bundesstaaten, vier Profile",
      intro: "Es gibt keinen pauschal besten Bundesstaat — es gibt den richtigen für Ihre Situation. Diese Matrix nutzen wir im Gespräch.",
      items: [
        { name: "New Mexico", tagline: "Am günstigsten und privatesten", pros: "Kein Annual Report, keine State-Steuer, anonymer Eigentümer im öffentlichen Register. Standard für Freiberufler.", cta: "New-Mexico-Plan ansehen", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Verstärkte Privatsphäre", pros: "Keine State-Steuer, maximaler Schutz des Inhabers in öffentlichen Registern. Gut für wachsende Projekte.", cta: "Wyoming-Plan ansehen", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Premium-Rechtsrahmen", pros: "Court of Chancery, ausgereiftes Wirtschaftsrecht, höchste Glaubwürdigkeit bei VCs. Ideal für SaaS und Startups.", cta: "Delaware-Plan ansehen", href: "service_llc_de" },
        { name: "Florida", tagline: "Visa-/E-2-tauglich", pros: "Sinnvoll bei US-Aufenthalten oder Investorenvisum. Günstiges Steuerklima, exzellenter Bankzugang.", cta: "Florida-Plan ansehen", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "ECHTE KOSTEN",
      h2: "Was eine LLC wirklich kostet",
      intro: "Richtwerte in USD. Das kostenlose Strategiegespräch passt die Kosten an Ihren Fall an.",
      rows: [
        { label: "Staatsgebühr New Mexico", value: "≈ 50 USD (einmalig, ohne Verlängerung)" },
        { label: "Staatsgebühr Wyoming", value: "≈ 100 USD Gründung + 60 USD/Jahr (Annual Report)" },
        { label: "Staatsgebühr Delaware", value: "≈ 90 USD Gründung + 300 USD/Jahr (Franchise Tax)" },
        { label: "Staatsgebühr Florida", value: "≈ 125 USD Gründung + 138,75 USD/Jahr (Annual Report)" },
        { label: "Registered Agent (Markt)", value: "100-200 USD/Jahr (im 1. Jahr in jedem Exentax-Plan inklusive)" },
        { label: "Form 1120 + 5472 (jährlich, professionell)", value: "Variabel. IRS-Strafe bei Verspätung: 25.000 USD pro Formular." },
        { label: "Mercury / Wise / Relay-Konto", value: "0 USD Eröffnung, ohne monatliche Gebühr" },
      ],
    },
    compliance: {
      kicker: "JAHRESPFLICHTEN",
      h2: "Was Ihre LLC jedes Jahr einreichen muss",
      intro: "Auch ohne Bundessteuer bleiben formale Pflichten. Wer sie versäumt, riskiert fünfstellige Strafen.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — jährliche Körperschaftserklärung.",
        "Form 5472 (Information Return) — Auslandsbesitz-Information.",
        "Form 7004 (automatische Verlängerung) — 6 zusätzliche Monate.",
        "BOI Report bei FinCEN — Aktualisierung bei Änderungen.",
        "State Annual Report — Wyoming, Delaware, Florida; nicht New Mexico.",
        "Registered-Agent-Verlängerung — jährlich.",
        "Persönliche Steuererklärung im Wohnsitzland — Anlage AUS in Deutschland, Anlage S, etc.",
      ],
    },
    banking: {
      kicker: "BANK",
      h2: "Mercury, Wise Business oder Relay: das operative Konto",
      paragraphs: [
        "Eine LLC ohne Bankkonto ist Papier. Wir pre-screenen den Antrag vor dem Versand: Geschäftsbeschreibung, Dokumente, Adressnachweis, Eigentümerstruktur. Ergebnis: First-Round-Approval in 1-3 Werktagen.",
        "Mercury ist Standard für Freiberufler und SaaS: USD-first, ACH, Wire, Karten. Wise Business passt bei mehreren Währungen (EUR, GBP, USD). Relay ist die solideste Wahl bei mehreren Entitäten oder Multi-User.",
        "Alle drei sind Fintechs mit FDIC-versicherten Banken im Hintergrund. Modern, aber ein Backup-Konto ist sinnvoll. Welche Kombination passt, klären wir im Gespräch.",
      ],
    },
    taxResidence: {
      kicker: "PRIVATE STEUER",
      h2: "Und wie deklariere ich das in meinem Land?",
      paragraphs: [
        "Die LLC ist in den USA transparent und in den meisten Ländern auch für die heimische Finanzverwaltung: Gewinne werden dem Inhaber zugerechnet und in der persönlichen Steuererklärung deklariert (Anlage AUS / Anlage S in Deutschland, IRPF in Spanien, etc.). Kein Offshore, nichts versteckt.",
        "In Deutschland ist die richtige Einordnung (gewerblich, Mitunternehmer, KapGes-Charakter) entscheidend; das DBA Deutschland-USA muss korrekt angewandt werden. Schlechte Strukturierung verwandelt Steuerersparnis in Risiko.",
        "Deshalb endet der Plan nicht mit der Gründung: Die jährliche Begleitung umfasst eine Prüfung Ihrer persönlichen Erklärung und die Abstimmung mit Ihrem Steuerberater vor Ort.",
      ],
    },
    faq: {
      h2: "Häufig gestellte Fragen",
      items: [
        { q: "Kann ich eine US-LLC ohne SSN oder ITIN eröffnen?", a: "Ja. EIN-Antrag per Fax mit Form SS-4, Markierung 'Foreign'. Weder LLC noch Inhaber benötigen eine SSN." },
        { q: "Welcher Bundesstaat eignet sich für Freiberufler?", a: "New Mexico standardmäßig: am günstigsten, kein Annual Report, keine State-Steuer, anonymer Inhaber. Wyoming als Upgrade für stärkere Privatsphäre." },
        { q: "Wie lange dauert der Gesamtprozess?", a: "Offizielle Gründung in 24-48 h in NM, WY, FL; 5-7 Werktage in Delaware. EIN: 1-3 Wochen. Bankkonto: 1-3 Werktage nach EIN." },
        { q: "Zahlt die LLC wirklich 0 USD Bundessteuer?", a: "Ja — solange der Inhaber nicht in den USA lebt, keine US trade or business und keine US-Quelleneinkünfte vorliegen. Form 1120 + Form 5472 müssen aber jährlich eingereicht werden." },
        { q: "Und die Gewinne fließen in meine deutsche Steuererklärung?", a: "Ja. Die LLC ist transparent: Gewinne werden dem Gesellschafter zugerechnet und in der persönlichen Erklärung angegeben. DBA Deutschland-USA gilt." },
        { q: "Mercury aus Deutschland?", a: "Mercury akzeptiert non-resident-owned LLCs aus praktisch jedem Land. Schlüssel ist ein gut vorbereiteter Antrag." },
        { q: "Kann die LLC in EUR an europäische Kunden fakturieren?", a: "Ja. Wise Business oder ein europäisches IBAN bei Mercury IO ermöglichen EUR-Eingänge. USt-Behandlung hängt vom Wohnsitzland ab." },
        { q: "Warum nicht stattdessen Estland (e-Residency) oder Dubai?", a: "Für internationale Freiberufler ohne US-Team gewinnt die US-LLC meist bei Kosten, Banking und Glaubwürdigkeit. Estland/Dubai machen in spezifischen Fällen Sinn." },
      ],
    },
    cta: {
      h2: "Für eine LLC, die vom ersten Tag an richtig aufgesetzt ist",
      p: "Kostenloses 30-min Strategiegespräch: Wir sagen Ihnen, welcher Bundesstaat passt, was es wirklich kostet und welche jährlichen Pflichten Sie zuhause haben. Unverbindlich.",
      primary: "Kostenloses Gespräch buchen",
      secondary: "Pläne und Preise ansehen",
    },
  },
  pt: {
    metaTitle: "Abrir uma LLC nos EUA: guia passo a passo 2026 | Exentax",
    metaDescription:
      "Abrir uma LLC americana em 2-4 dias como não-residente: escolher o estado, EIN sem SSN, conta Mercury, Form 1120 + 5472 no IRS e declaração limpa em Portugal/Brasil.",
    ogTitle: "Abrir uma LLC nos EUA: o guia definitivo 2026",
    ogDescription:
      "Como criar uma LLC americana sem SSN, que estado escolher, quanto realmente custa e como declarar no teu país. Consultoria estratégica gratuita de 30 min.",
    keywords:
      "abrir LLC, abrir LLC EUA, LLC para não residentes, abrir LLC sem SSN, melhor estado LLC, LLC Wyoming, LLC Delaware, LLC Novo México, EIN sem SSN, conta Mercury não residente, Form 5472",
    breadcrumb: "Abrir LLC nos EUA",
    hero: {
      kicker: "GUIA DEFINITIVO",
      h1: "Abrir uma LLC nos EUA em 2026",
      h1green: "Passo a passo, sem SSN, em 2-4 dias.",
      subtitle:
        "Tudo o que precisas para constituir uma LLC americana sendo não-residente: o estado correto, o EIN, a conta bancária operacional, as declarações anuais ao IRS e uma declaração limpa no teu país de residência fiscal. Sem promessas mágicas, sem offshore.",
      ctaPrimary: "Quero abrir a minha LLC",
      ctaSecondary: "Ver o processo completo",
    },
    whatIsLLC: {
      kicker: "O QUE É",
      h2: "Uma LLC é uma sociedade americana de responsabilidade limitada",
      paragraphs: [
        "A Limited Liability Company (LLC) é a estrutura mais usada por empreendedores internacionais para operar globalmente a partir de uma entidade americana. Separa o teu património pessoal do do negócio e, quando 100% pertence a um não-residente sem atividade nos EUA, o IRS trata-a como entidade fiscalmente transparente.",
        "Na prática: 0 USD de imposto federal para a LLC enquanto o dono não residir nos EUA, não tiver escritório/equipa lá e os rendimentos não vierem de uma verdadeira US trade or business. Os lucros fluem para a tua declaração pessoal no país onde és residente fiscal.",
        "A LLC mantém duas obrigações anuais com o IRS: Form 1120 (declaração corporativa) e Form 5472 (informativa por propriedade estrangeira). Falhar qualquer uma custa 25.000 USD por formulário. Por isso geri-la sozinho raramente compensa.",
      ],
    },
    steps: {
      kicker: "O PROCESSO",
      h2: "Como abrir a tua LLC, passo a passo",
      intro: "O processo real, sem atalhos. Cada passo demora horas a dois dias. A maioria dos clientes está a operar em menos de uma semana.",
      items: [
        { title: "1. Escolher o estado", desc: "Novo México (mais barato e privado), Wyoming (privacidade reforçada), Delaware (prestígio VC), Flórida (útil se passas tempo nos EUA)." },
        { title: "2. Reservar o nome e nomear Registered Agent", desc: "Verificamos disponibilidade no Secretary of State e atuamos como Registered Agent o primeiro ano (incluído em todos os planos)." },
        { title: "3. Apresentar os Articles of Organization", desc: "Documento fundador no Secretary of State. Constituição oficial em 24-48 h no NM, WY, FL; 5-7 dias úteis no Delaware." },
        { title: "4. Redigir o Operating Agreement", desc: "Acordo interno da LLC, adaptado à tua residência fiscal. É o que prova ao banco ou ao fisco quem realmente é o dono." },
        { title: "5. Obter o EIN no IRS", desc: "Form SS-4 por fax marcando 'Foreign'. Sem SSN/ITIN. Prazo: 1-3 semanas." },
        { title: "6. Abrir conta bancária operacional", desc: "Pré-validação para Mercury, Wise Business ou Relay. Cartões físicos e virtuais, USD/EUR, ACH e SWIFT." },
        { title: "7. BOI Report no FinCEN", desc: "Declaração do beneficiário efetivo, obrigatória desde 2024 para toda LLC nova." },
        { title: "8. Compliance anual", desc: "Cada ano: Form 1120 + Form 5472, renovação do Registered Agent, Annual Report estatal (WY, DE, FL; não no NM) e revisão fiscal personalizada." },
      ],
    },
    states: {
      kicker: "QUE ESTADO",
      h2: "Quatro estados, quatro perfis",
      intro: "Não existe estado universalmente melhor: existe o estado certo para a tua situação. Esta é a matriz que usamos na consultoria.",
      items: [
        { name: "Novo México", tagline: "O mais barato e privado", pros: "Sem Annual Report, sem imposto estatal, propriedade anónima no registo público. Recomendação por defeito para freelancers.", cta: "Ver plano Novo México", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Privacidade reforçada", pros: "Sem imposto estatal, máxima proteção do beneficiário em registos públicos. Bom para projetos em crescimento.", cta: "Ver plano Wyoming", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Quadro jurídico premium", pros: "Court of Chancery, jurisprudência madura, máxima credibilidade junto a VCs. Ideal para SaaS e startups.", cta: "Ver plano Delaware", href: "service_llc_de" },
        { name: "Flórida", tagline: "Operativa com visa / E-2", pros: "Útil se passas tempo nos EUA ou avalias visto de investidor. Bom clima fiscal e excelente acesso bancário.", cta: "Ver plano Flórida", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "CUSTO REAL",
      h2: "O que realmente custa abrir e manter uma LLC",
      intro: "Valores indicativos em USD. A consultoria gratuita de 30 min ajusta o custo exato ao teu caso.",
      rows: [
        { label: "Taxa estatal Novo México", value: "≈ 50 USD (one-off, sem renovação)" },
        { label: "Taxa estatal Wyoming", value: "≈ 100 USD constituição + 60 USD/ano (Annual Report)" },
        { label: "Taxa estatal Delaware", value: "≈ 90 USD constituição + 300 USD/ano (Franchise Tax)" },
        { label: "Taxa estatal Flórida", value: "≈ 125 USD constituição + 138,75 USD/ano (Annual Report)" },
        { label: "Registered Agent (mercado)", value: "100-200 USD/ano (incluído no 1.º ano em todos os planos Exentax)" },
        { label: "Form 1120 + 5472 (anual, profissional)", value: "Variável. Multa IRS por atraso: 25.000 USD por formulário." },
        { label: "Conta Mercury / Wise / Relay", value: "0 USD abertura, sem manutenção" },
      ],
    },
    compliance: {
      kicker: "OBRIGAÇÕES ANUAIS",
      h2: "O que a tua LLC tem de apresentar todos os anos",
      intro: "Mesmo sem imposto federal a pagar, as obrigações formais permanecem. Falhar transforma um setup limpo em multa de cinco dígitos.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — declaração corporativa anual.",
        "Form 5472 (Information Return) — informativa por propriedade estrangeira.",
        "Form 7004 (extensão automática) — 6 meses adicionais.",
        "BOI Report no FinCEN — atualização se mudarem dados do dono.",
        "Annual Report estatal — Wyoming, Delaware, Flórida; não no Novo México.",
        "Renovação do Registered Agent — anual.",
        "Declaração pessoal no teu país de residência — IRS Portugal, IRPF Brasil/Espanha, etc.",
      ],
    },
    banking: {
      kicker: "BANCA",
      h2: "Mercury, Wise Business ou Relay: a conta operacional",
      paragraphs: [
        "Uma LLC sem conta bancária é papel. Pré-validamos a tua candidatura antes do envio: descrição da atividade, documentação, comprovativo de morada, estrutura societária. Resultado: aprovação em primeira ronda em 1-3 dias úteis.",
        "Mercury é o standard para freelancers e SaaS: USD-first, ACH, wire, cartões. Wise Business funciona quando faturas em várias divisas. Relay é a opção mais sólida se geres várias entidades.",
        "As três são fintechs com licença bancária respaldada por bancos FDIC, não bancos. Conta secundária de respaldo é aconselhável. Explicamos a combinação certa na consultoria.",
      ],
    },
    taxResidence: {
      kicker: "FISCAL PESSOAL",
      h2: "E no meu país, como se declara?",
      paragraphs: [
        "A LLC é transparente nos EUA e, na maior parte dos países, também para o teu fisco local: os lucros são imputados ao dono e declarados na tua declaração pessoal (IRS Portugal, IRPF Brasil/Espanha). Não é rendimento isento, não é offshore, não se esconde.",
        "Em Portugal há que coordenar com a Modelo 3 (anexo J), o convénio Portugal-EUA para evitar dupla tributação e o regime de IVA aplicável aos serviços digitais internacionais.",
        "O plano não termina na constituição: o acompanhamento anual inclui revisão da tua declaração pessoal e coordenação com o teu contabilista local quando necessário.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "Posso abrir uma LLC sem SSN nem ITIN?", a: "Sim. O EIN pede-se ao IRS por fax com Form SS-4 marcando 'Foreign'. Nem a LLC nem o dono precisam de SSN." },
        { q: "Que estado escolher se sou freelancer ou consultor?", a: "Novo México por defeito: o mais barato, sem Annual Report, sem imposto estatal, propriedade anónima. Wyoming é o upgrade para privacidade reforçada." },
        { q: "Quanto demora o processo completo?", a: "Constituição oficial em 24-48 h no NM, WY, FL; 5-7 dias úteis no Delaware. EIN: 1-3 semanas. Conta bancária: 1-3 dias úteis após o EIN." },
        { q: "A LLC realmente paga 0 USD de imposto federal?", a: "Sim — desde que o dono não resida nos EUA, não haja US trade or business e não haja rendimentos de fonte americana. Mas Form 1120 + Form 5472 são obrigatórios todos os anos." },
        { q: "E os lucros vão para a minha declaração pessoal?", a: "Sim. A LLC é fiscalmente transparente: os lucros são imputados ao sócio. Convénio Portugal-EUA aplica para evitar dupla tributação." },
        { q: "Mercury funciona desde Portugal/Brasil?", a: "Mercury aceita non-resident-owned LLCs de praticamente qualquer país. A chave é uma candidatura bem pré-validada." },
        { q: "A LLC pode faturar em EUR a clientes europeus?", a: "Sim. Wise Business ou IBAN europeu Mercury IO permitem cobrar em EUR. IVA depende do país de residência." },
        { q: "Por que não Estónia ou Dubai?", a: "Para freelancers internacionais sem equipa nos EUA, a LLC americana ganha em custo, banca e credibilidade. Estónia e Dubai fazem sentido em casos específicos." },
      ],
    },
    cta: {
      h2: "Para abrir a tua LLC bem feita desde o primeiro dia",
      p: "Consultoria estratégica gratuita de 30 min: dizemos qual estado faz sentido, quanto realmente custa e quais as obrigações anuais no teu país. Sem compromisso.",
      primary: "Agendar a minha consultoria gratuita",
      secondary: "Ver planos e preços",
    },
  },
  ca: {
    metaTitle: "Obrir una LLC als Estats Units: guia pas a pas 2026 | Exentax",
    metaDescription:
      "Obrir una LLC americana en 2-4 dies sent no resident: escollir l'estat, EIN sense SSN, compte Mercury, Form 1120 + 5472 a l'IRS i declaració neta a l'IRPF.",
    ogTitle: "Obrir una LLC als EUA: la guia definitiva 2026",
    ogDescription:
      "Com crear una LLC americana sense SSN, quin estat triar, quant costa de debò i com declarar-la a casa. Assessoria estratègica gratuïta de 30 min.",
    keywords:
      "obrir LLC, obrir LLC EUA, LLC per a no residents, obrir LLC sense SSN, millor estat LLC, LLC Wyoming, LLC Delaware, LLC Nou Mèxic, EIN sense SSN, compte Mercury no resident, Form 5472",
    breadcrumb: "Obrir LLC als EUA",
    hero: {
      kicker: "GUIA DEFINITIVA",
      h1: "Obrir una LLC als Estats Units el 2026",
      h1green: "Pas a pas, sense SSN, en 2-4 dies.",
      subtitle:
        "Tot el que necessites per constituir una LLC americana sent no resident: l'estat correcte, l'EIN, el compte bancari operatiu, les declaracions anuals a l'IRS i una declaració neta al teu país de residència fiscal. Sense promeses màgiques, sense offshore.",
      ctaPrimary: "Vull obrir la meva LLC",
      ctaSecondary: "Veure el procés complet",
    },
    whatIsLLC: {
      kicker: "QUÈ ÉS",
      h2: "Una LLC és una societat americana de responsabilitat limitada",
      paragraphs: [
        "La Limited Liability Company (LLC) és l'estructura més usada per emprenedors internacionals per operar amb clientela global des d'una entitat americana. Separa el teu patrimoni personal del del negoci i, quan és 100% propietat d'un no resident sense activitat als EUA, l'IRS la tracta com una entitat fiscalment transparent.",
        "A la pràctica: 0 USD d'impost federal per a la LLC mentre el propietari no resideixi als EUA, no hi tingui oficina/personal i els ingressos no provinguin d'una veritable US trade or business. Els beneficis pugen a la teva declaració personal al país on ets resident fiscal.",
        "La LLC manté dues obligacions anuals amb l'IRS: Form 1120 (declaració corporativa) i Form 5472 (informativa per propietat estrangera). Saltar-se qualsevol de les dues costa 25.000 USD per formulari. Per això portar-la sol rarament compensa.",
      ],
    },
    steps: {
      kicker: "EL PROCÉS",
      h2: "Com obrir la teva LLC, pas a pas",
      intro: "El procés real, sense dreceres. Cada pas dura unes hores a dos dies. La majoria de clients està operant en menys d'una setmana.",
      items: [
        { title: "1. Escollir l'estat", desc: "Nou Mèxic (el més barat i privat), Wyoming (privacitat reforçada), Delaware (prestigi VC), Florida (útil si passes temps als EUA)." },
        { title: "2. Reservar el nom i nomenar Registered Agent", desc: "Verifiquem disponibilitat al Secretary of State i actuem com a Registered Agent el primer any (inclòs en tots els plans)." },
        { title: "3. Presentar els Articles of Organization", desc: "Document fundador al Secretary of State. Constitució oficial en 24-48 h al NM, WY, FL; 5-7 dies hàbils al Delaware." },
        { title: "4. Redactar l'Operating Agreement", desc: "Acord intern de la LLC, adaptat a la teva residència fiscal. És el que demostra al banc o a Hisenda qui n'és el propietari real." },
        { title: "5. Obtenir l'EIN a l'IRS", desc: "Form SS-4 per fax marcant 'Foreign'. Sense SSN/ITIN. Termini: 1-3 setmanes." },
        { title: "6. Apertura de compte bancari operatiu", desc: "Pre-validació per a Mercury, Wise Business o Relay. Targetes físiques i virtuals, USD/EUR, ACH i SWIFT." },
        { title: "7. BOI Report a FinCEN", desc: "Declaració del beneficiari efectiu, obligatòria des del 2024 per a tota LLC nova." },
        { title: "8. Compliance anual", desc: "Cada any: Form 1120 + Form 5472, renovació de Registered Agent, Annual Report estatal (WY, DE, FL; no a NM) i revisió fiscal personalitzada." },
      ],
    },
    states: {
      kicker: "QUIN ESTAT",
      h2: "Quatre estats, quatre perfils",
      intro: "No existeix l'estat universalment millor: existeix l'estat correcte per a la teva situació.",
      items: [
        { name: "Nou Mèxic", tagline: "El més barat i privat", pros: "Sense Annual Report, sense impost estatal, propietat anònima al registre públic. Recomanació per defecte per a freelancers.", cta: "Veure pla Nou Mèxic", href: "service_llc_nm" },
        { name: "Wyoming", tagline: "Privacitat reforçada", pros: "Sense impost estatal, màxima protecció del beneficiari en registres públics. Bo per a projectes en creixement.", cta: "Veure pla Wyoming", href: "service_llc_wy" },
        { name: "Delaware", tagline: "Marc legal premium", pros: "Court of Chancery, jurisprudència madura, màxima credibilitat davant VC. Ideal per a SaaS i startups.", cta: "Veure pla Delaware", href: "service_llc_de" },
        { name: "Florida", tagline: "Operativa amb visa / E-2", pros: "Útil si passes temps als EUA o avalues visat d'inversor. Bon clima fiscal i excel·lent accés bancari.", cta: "Veure pla Florida", href: "service_llc_fl" },
      ],
    },
    costs: {
      kicker: "COST REAL",
      h2: "Què costa realment obrir i mantenir una LLC",
      intro: "Xifres orientatives en USD. L'assessoria gratuïta de 30 min ajusta el cost exacte al teu cas.",
      rows: [
        { label: "Taxa estatal Nou Mèxic", value: "≈ 50 USD (one-off, sense renovació)" },
        { label: "Taxa estatal Wyoming", value: "≈ 100 USD constitució + 60 USD/any (Annual Report)" },
        { label: "Taxa estatal Delaware", value: "≈ 90 USD constitució + 300 USD/any (Franchise Tax)" },
        { label: "Taxa estatal Florida", value: "≈ 125 USD constitució + 138,75 USD/any (Annual Report)" },
        { label: "Registered Agent (mercat)", value: "100-200 USD/any (inclòs el 1r any en tots els plans Exentax)" },
        { label: "Form 1120 + 5472 (anual, professional)", value: "Variable. Sanció IRS per retard: 25.000 USD per formulari." },
        { label: "Compte Mercury / Wise / Relay", value: "0 USD obertura, sense manteniment" },
      ],
    },
    compliance: {
      kicker: "OBLIGACIONS ANUALS",
      h2: "El que la teva LLC ha de presentar cada any",
      intro: "Encara que no pagui impost federal, manté obligacions formals. Saltar-se-les converteix un setup net en multa de cinc dígits.",
      items: [
        "Form 1120 (Corporate Income Tax Return) — declaració corporativa anual.",
        "Form 5472 (Information Return) — informativa per propietat estrangera.",
        "Form 7004 (extensió automàtica) — 6 mesos addicionals.",
        "BOI Report a FinCEN — actualització si canvien dades del propietari.",
        "Annual Report estatal — Wyoming, Delaware, Florida; no a Nou Mèxic.",
        "Renovació del Registered Agent — anual.",
        "Declaració personal al teu país de residència — IRPF a Espanya/Catalunya, etc.",
      ],
    },
    banking: {
      kicker: "BANCA",
      h2: "Mercury, Wise Business o Relay: el compte operatiu",
      paragraphs: [
        "Una LLC sense compte bancari és paper mullat. Pre-validem la teva sol·licitud abans d'enviar-la: descripció d'activitat, documentació, prova de domicili, estructura societària. Resultat: aprovació en primera ronda en 1-3 dies hàbils.",
        "Mercury és l'estàndard per a freelancers i SaaS: USD-first, ACH, wire, targetes. Wise Business funciona quan factures en diverses divises. Relay és l'opció més sòlida si gestiones diverses entitats.",
        "Les tres són fintechs amb llicència bancària respaldada per bancs FDIC, no bancs. Compte secundari de reserva és aconsellable.",
      ],
    },
    taxResidence: {
      kicker: "FISCAL PERSONAL",
      h2: "I al meu país, com es declara?",
      paragraphs: [
        "La LLC és transparent als EUA i, a la majoria de països, també per al teu fisc local: els beneficis s'imputen al soci i es declaren a l'IRPF. No és renda exempta, no és paradís, no s'amaga.",
        "A Espanya cal vigilar Modelo 720 (béns a l'estranger superiors a 50.000 €), Modelo 721 (criptomonedes a l'estranger superiors a 50.000 €) i aplicar bé el conveni Espanya-EUA per evitar la doble imposició.",
        "El pla no acaba a la constitució: el seguiment anual inclou revisió de la teva declaració personal i coordinació amb el teu assessor local quan cal.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "Puc obrir una LLC sense tenir SSN ni ITIN?", a: "Sí. L'EIN es demana per fax amb Form SS-4 marcant 'Foreign'. Ni la LLC ni el propietari necessiten SSN." },
        { q: "Quin estat trio si sóc freelancer o consultor?", a: "Nou Mèxic per defecte: el més barat, sense Annual Report, sense impost estatal. Wyoming és l'upgrade per a privacitat reforçada." },
        { q: "Quant triga el procés complet?", a: "Constitució oficial en 24-48 h al NM, WY, FL; 5-7 dies hàbils al Delaware. EIN: 1-3 setmanes. Compte bancari: 1-3 dies hàbils després de l'EIN." },
        { q: "La LLC realment paga 0 USD d'impost federal?", a: "Sí — sempre que el propietari no resideixi als EUA, no hi hagi US trade or business i no hi hagi ingressos de font americana. Form 1120 + Form 5472 obligatoris cada any." },
        { q: "I els beneficis pugen al meu IRPF?", a: "Sí. La LLC és fiscalment transparent: els beneficis s'imputen al soci i es declaren a l'IRPF. Conveni Espanya-EUA aplica." },
        { q: "Mercury des de Catalunya/Espanya?", a: "Mercury accepta non-resident-owned LLCs de pràcticament qualsevol país. La clau és una sol·licitud ben pre-validada." },
        { q: "La LLC pot facturar en EUR a clients europeus?", a: "Sí. Wise Business o un IBAN europeu Mercury IO permeten cobrar en EUR. L'IVA depèn del país de residència." },
        { q: "Per què no Estònia o Dubai?", a: "Per a freelancers internacionals sense equip als EUA, la LLC americana guanya en cost, banca i credibilitat. Estònia i Dubai tenen sentit en casos concrets." },
      ],
    },
    cta: {
      h2: "Per obrir la teva LLC ben feta des del primer dia",
      p: "Assessoria estratègica gratuïta de 30 min: et diem quin estat té sentit, quant et costarà realment i quines obligacions anuals tindràs. Sense compromís.",
      primary: "Agendar la meva assessoria gratuïta",
      secondary: "Veure plans i preus",
    },
  },
};

export default function PillarOpenLlcPage() {
  const { i18n } = useTranslation();
  const lang = ((i18n.language || "es").split("-")[0] as SupportedLang) in PILLAR_CONTENT
    ? ((i18n.language || "es").split("-")[0] as SupportedLang)
    : "es";
  const c = PILLAR_CONTENT[lang];
  const lp = useLangPath();
  const heroRef = useReveal();

  const pillarUrl = `${CONTACT.SITE_URL}${lp("pillar_open_llc")}`;

  // Task #14 (GEO): the pillar emits a rich graph — Article + HowTo + FAQPage
  // + BreadcrumbList + ItemList of states — all sharing the canonical
  // Organization @id from `index.html`. The HowTo nests inside an Article so
  // search/AI engines understand this is editorial content describing a
  // procedure offered by the publisher, not a stand-alone "how-to".
  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.hero.h1,
    description: c.metaDescription,
    inLanguage: lang,
    mainEntityOfPage: { "@type": "WebPage", "@id": pillarUrl },
    url: pillarUrl,
    image: `${CONTACT.SITE_URL}/og-image.png`,
    author: {
      "@type": "Person",
      name: "Exentax Editorial Team",
      worksFor: { "@id": `${CONTACT.SITE_URL}/#organization` },
    },
    publisher: { "@id": `${CONTACT.SITE_URL}/#organization` },
    about: [
      { "@type": "Thing", name: "Limited Liability Company" },
      { "@type": "Thing", name: "US LLC for non-residents" },
      { "@type": "Thing", name: "EIN" },
      { "@type": "Thing", name: "Form 5472" },
    ],
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
  };

  const howToJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.hero.h1,
    description: c.metaDescription,
    inLanguage: lang,
    totalTime: "P4D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "350" },
    mainEntityOfPage: { "@id": pillarUrl },
    step: c.steps.items.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const faqJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const itemListJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.states.h2,
    itemListElement: c.states.items.map((s, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: s.name,
      url: `${CONTACT.SITE_URL}${getLocalizedPath(s.href, lang)}`,
    })),
  };

  return (
    <article data-page="pillar-open-llc" className="bg-[var(--bg-0)]">
      <SEO
        title={c.metaTitle}
        description={c.metaDescription}
        ogTitle={c.ogTitle}
        ogDescription={c.ogDescription}
        keywords={c.keywords}
        path={lp("pillar_open_llc")}
        breadcrumbs={[{ name: c.breadcrumb, path: lp("pillar_open_llc") }]}
        jsonLd={[articleJsonLd, howToJsonLd, faqJsonLd, itemListJsonLd]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-10 sm:pb-14">
        <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 sm:pt-10 lg:pt-20">
          <div className="text-center max-w-[820px] mx-auto reveal">
            <p className="font-heading text-[12px] sm:text-[13px] tracking-[0.18em] uppercase text-[var(--text-2)] mb-3" data-testid="kicker-pillar-llc">
              {c.hero.kicker}
            </p>
            <h1 className="font-heading font-bold text-[28px] sm:text-4xl lg:text-[clamp(36px,3.5vw,46px)] leading-[1.1] tracking-[-0.025em] text-black mb-2" data-testid="heading-pillar-llc-hero">
              {c.hero.h1}
            </h1>
            <p className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[clamp(30px,3vw,40px)] leading-[1.15] tracking-[-0.025em] mb-6 text-[#00E510]">
              {c.hero.h1green}
            </p>
            <p className="max-w-[680px] text-base lg:text-lg text-black/90 leading-relaxed mb-8 mx-auto" data-testid="subtitle-pillar-llc-hero">
              {c.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-2 justify-center">
              <Link href={lp("book")} className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full" data-testid="button-pillar-llc-hero-cta">
                {c.hero.ctaPrimary}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-1 flex-shrink-0"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
              <Link href={lp("our_services")} className="inline-flex items-center justify-center font-body font-semibold px-8 py-3.5 text-base rounded-full border border-[var(--border)] hover:border-[var(--text-3)] text-[var(--text-1)] bg-[var(--bg-0)] transition-colors" data-testid="button-pillar-llc-hero-services">
                {c.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is an LLC */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3 text-center">{c.whatIsLLC.kicker}</p>
        <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black text-center mb-6" data-testid="heading-pillar-what-is">
          {c.whatIsLLC.h2}
        </h2>
        <div className="space-y-4 text-[15px] sm:text-base text-black/85 leading-relaxed">
          {c.whatIsLLC.paragraphs.map((p, i) => (
            <p key={i} data-testid={`text-pillar-what-is-${i}`}>{p}</p>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3">{c.steps.kicker}</p>
          <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black mb-3" data-testid="heading-pillar-steps">
            {c.steps.h2}
          </h2>
          <p className="max-w-[680px] mx-auto text-[14px] sm:text-[15px] text-black/80 leading-relaxed">{c.steps.intro}</p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {c.steps.items.map((s, i) => (
            <li key={i} className="glass-card p-5" data-testid={`card-pillar-step-${i}`}>
              <h3 className="font-heading font-bold text-[16px] sm:text-[17px] mb-2 text-black">{s.title}</h3>
              <p className="text-[13.5px] sm:text-[14px] text-black/75 leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* States */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3">{c.states.kicker}</p>
          <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black mb-3" data-testid="heading-pillar-states">
            {c.states.h2}
          </h2>
          <p className="max-w-[680px] mx-auto text-[14px] sm:text-[15px] text-black/80 leading-relaxed">{c.states.intro}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {c.states.items.map((s, i) => (
            <div key={i} className="glass-card p-6 flex flex-col" data-testid={`card-pillar-state-${i}`}>
              <h3 className="font-heading font-bold text-[18px] mb-1 text-black">{s.name}</h3>
              <p className="font-heading text-[12.5px] tracking-[0.06em] uppercase text-[#00E510] mb-3">{s.tagline}</p>
              <p className="text-[14px] text-black/80 leading-relaxed mb-5 flex-1">{s.pros}</p>
              <Link href={lp(s.href)} className="inline-flex items-center justify-center font-body font-semibold px-5 py-2.5 text-[14px] rounded-full border border-[var(--border)] hover:border-[var(--text-3)] text-[var(--text-1)] bg-[var(--bg-0)] transition-colors" data-testid={`link-pillar-state-${i}`}>
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Costs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-8">
          <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3">{c.costs.kicker}</p>
          <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black mb-3" data-testid="heading-pillar-costs">
            {c.costs.h2}
          </h2>
          <p className="max-w-[680px] mx-auto text-[14px] sm:text-[15px] text-black/80 leading-relaxed">{c.costs.intro}</p>
        </div>
        <div className="glass-strong rounded-[var(--radius-lg)] overflow-hidden">
          <table className="w-full border-collapse text-left text-[14px] sm:text-[15px]">
            <tbody>
              {c.costs.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-black/[0.015]" : ""} data-testid={`row-pillar-cost-${i}`}>
                  <th scope="row" className="px-5 py-4 font-body font-semibold text-black/85 border-b border-[var(--glass-border-strong)] last:border-b-0 align-top w-[55%]">
                    {row.label}
                  </th>
                  <td className="px-5 py-4 text-black/85 border-b border-[var(--glass-border-strong)] last:border-b-0 align-top">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Compliance */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-8">
          <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3">{c.compliance.kicker}</p>
          <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black mb-3" data-testid="heading-pillar-compliance">
            {c.compliance.h2}
          </h2>
          <p className="max-w-[680px] mx-auto text-[14px] sm:text-[15px] text-black/80 leading-relaxed">{c.compliance.intro}</p>
        </div>
        <ul className="space-y-3">
          {c.compliance.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] sm:text-base text-black/85 leading-relaxed" data-testid={`item-pillar-compliance-${i}`}>
              <span aria-hidden="true" className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#00E510]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Banking */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3 text-center">{c.banking.kicker}</p>
        <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black text-center mb-6" data-testid="heading-pillar-banking">
          {c.banking.h2}
        </h2>
        <div className="space-y-4 text-[15px] sm:text-base text-black/85 leading-relaxed">
          {c.banking.paragraphs.map((p, i) => (<p key={i} data-testid={`text-pillar-banking-${i}`}>{p}</p>))}
        </div>
      </section>

      {/* Tax residence */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <p className="font-heading text-[11px] sm:text-[12px] tracking-[0.18em] uppercase text-[#00E510] mb-3 text-center">{c.taxResidence.kicker}</p>
        <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black text-center mb-6" data-testid="heading-pillar-tax-residence">
          {c.taxResidence.h2}
        </h2>
        <div className="space-y-4 text-[15px] sm:text-base text-black/85 leading-relaxed">
          {c.taxResidence.paragraphs.map((p, i) => (<p key={i} data-testid={`text-pillar-tax-residence-${i}`}>{p}</p>))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-[24px] sm:text-3xl lg:text-[34px] leading-tight tracking-[-0.02em] text-black" data-testid="heading-pillar-faq">
              {c.faq.h2}
            </h2>
          </div>
          <FaqAccordionList
            testIdPrefix="pillar-llc-faq"
            items={c.faq.items.map((f, i) => ({
              id: `pillar-llc-faq-${i}`,
              question: f.q,
              answer: <p className="whitespace-pre-line">{f.a}</p>,
            }))}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="font-heading font-bold text-[26px] sm:text-3xl lg:text-[36px] leading-tight tracking-[-0.02em] text-black mb-4" data-testid="heading-pillar-cta">
          {c.cta.h2}
        </h2>
        <p className="text-[15px] sm:text-base lg:text-lg text-black/80 leading-relaxed max-w-[640px] mx-auto mb-8">
          {c.cta.p}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={lp("book")} className="inline-flex items-center justify-center btn-primary px-8 py-3.5 text-base rounded-full" data-testid="button-pillar-cta-book">
            {c.cta.primary}
          </Link>
          <Link href={lp("our_services")} className="inline-flex items-center justify-center font-body font-semibold px-8 py-3.5 text-base rounded-full border border-[var(--border)] hover:border-[var(--text-3)] text-[var(--text-1)] bg-[var(--bg-0)] transition-colors" data-testid="button-pillar-cta-services">
            {c.cta.secondary}
          </Link>
        </div>
      </section>
    </article>
  );
}
