import type { SupportedLang } from "../index";

export interface ComparisonRow {
  label: string;
  values: string[];
}
export interface Comparison {
  kicker: string;
  h2: string;
  intro: string;
  columns: string[];
  highlightCol: number;
  rows: ComparisonRow[];
  note?: string;
  // LLC comparator selectors (4-state pages). Optional so the ITIN comparison
  // (which still uses a 3-column table) doesn't have to declare them.
  youLabel?: string;       // pill label for the fixed selector ("This page")
  compareLabel?: string;   // pill label for the interactive selector
}

export interface SubpageContent {
  cardKicker: string;
  cardTitle: string;
  cardDesc: string;
  breadcrumb: string;
  hero: {
    kicker: string;
    h1: string;
    h1green: string;
    subtitle: string;
    ctaPrimary: string;
    ctaWhatsapp: string;
    waText: string;
  };
  intro: { kicker: string; h2: string; paragraphs: string[] };
  features: { h2: string; items: { title: string; desc: string }[] };
  bestFor: { h2: string; items: string[] };
  whatsIncluded: { h2: string; items: string[] };
  comparison: Comparison;
  faq: { h2: string; items: { q: string; a: string }[] };
  cta: { h2: string; p: string; btn: string; btnSecondary: string };
  seo: { title: string; description: string; keywords: string; ogTitle?: string; ogDescription?: string };
  jsonLd: { name: string; serviceType: string };
}

type SubpageBase = Omit<SubpageContent, "comparison">;
interface SubpagesBase {
  llcNm: SubpageBase;
  llcWy: SubpageBase;
  llcDe: SubpageBase;
  llcFl: SubpageBase;
  itin: SubpageBase;
}

export interface SubpagesNamespace {
  llcNm: SubpageContent;
  llcWy: SubpageContent;
  llcDe: SubpageContent;
  llcFl: SubpageContent;
  itin: SubpageContent;
}

export interface NavSubpagesLabels {
  servicesOverview: string;
  servicesOverviewDesc: string;
  servicesLlcNm: string;
  servicesLlcNmDesc: string;
  servicesLlcWy: string;
  servicesLlcWyDesc: string;
  servicesLlcDe: string;
  servicesLlcDeDesc: string;
  servicesLlcFl: string;
  servicesLlcFlDesc: string;
  servicesItin: string;
  servicesItinDesc: string;
}

export interface SubpagesGridLabels {
  kicker: string;
  h2: string;
  cta: string;
}

// ===== ESPAÑOL (canonical) =====
const es: SubpagesBase = {
  llcNm: {
    cardKicker: "LLC en Nuevo México",
    cardTitle: "LLC en Nuevo México: discreta, eficiente y sin renovación anual",
    cardDesc: "El estado más usado por nómadas digitales: cero impuesto estatal, sin informes anuales y privacidad por defecto.",
    breadcrumb: "LLC en Nuevo México",
    hero: {
      kicker: "LLC EN NUEVO MÉXICO",
      h1: "Tu LLC en Nuevo México",
      h1green: "discreta, sin informes y a coste mínimo",
      subtitle: "El estado preferido por nómadas digitales y emprendedores online: 0% impuesto estatal sobre la LLC, sin informe anual y con un nivel de privacidad real para los miembros.",
      ctaPrimary: "Agendar asesoría",
      ctaWhatsapp: "Hablar por WhatsApp",
      waText: "Hola, quiero abrir una LLC en Nuevo México. ¿Podemos hablar?",
    },
    intro: {
      kicker: "POR QUÉ NUEVO MÉXICO",
      h2: "El estado más eficiente para una LLC unipersonal",
      paragraphs: [
        "Nuevo México es, hoy, el estado más usado por freelancers, agencias remotas y creadores de contenido que viven fuera de Estados Unidos. La razón es simple: no exige informe anual, no cobra franchise tax, y permite no listar públicamente a los miembros de la LLC.",
        "Para un no residente que factura servicios desde el extranjero, esto se traduce en una estructura legal real, con EIN y cuenta bancaria estadounidense, manteniendo el coste anual al mínimo y evitando burocracia recurrente.",
      ],
    },
    features: {
      h2: "Por qué los nómadas digitales eligen Nuevo México",
      items: [
        { title: "Sin informe anual", desc: "Una vez constituida, no hay que presentar Annual Report al estado. Menos papeleo, menos riesgo de olvido, menos coste recurrente." },
        { title: "Sin franchise tax estatal", desc: "Nuevo México no aplica impuesto sobre el capital ni tasa anual de mantenimiento sobre la LLC." },
        { title: "Privacidad real de los miembros", desc: "Los nombres de los miembros no aparecen en el registro público estatal cuando se constituye correctamente con un agente registrado." },
        { title: "Mantenimiento mínimo", desc: "Solo necesitas mantener un agente registrado en el estado y cumplir tus obligaciones federales (BOI/CTA y declaración federal según tu caso)." },
      ],
    },
    bestFor: {
      h2: "Es para ti si...",
      items: [
        "Eres freelancer o consultor remoto facturando a clientes fuera de EE. UU.",
        "Quieres una estructura limpia, barata de mantener y sin papeleo estatal recurrente.",
        "Te importa que tu nombre no aparezca de forma pública en el registro de la LLC.",
        "Operas como nómada digital y necesitas una entidad legal con EIN y cuenta bancaria.",
        "No tienes empleados ni oficinas físicas en Estados Unidos.",
      ],
    },
    whatsIncluded: {
      h2: "Qué incluye nuestro servicio",
      items: [
        "Constitución completa de la LLC en Nuevo México con agente registrado el primer año.",
        "Solicitud y obtención del EIN (Employer Identification Number) ante el IRS.",
        "Operating Agreement personalizado para LLC unipersonal o multimiembro.",
        "Acompañamiento para abrir cuenta bancaria estadounidense (Mercury, Relay o equivalente).",
        "Reporte BOI (Beneficial Ownership Information) presentado correctamente desde el inicio.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes",
      items: [
        { q: "¿Es legal para un no residente abrir una LLC en Nuevo México?", a: "Sí. No necesitas ser ciudadano ni residente fiscal de Estados Unidos para ser miembro de una LLC en Nuevo México. Es la opción más utilizada por emprendedores internacionales precisamente por esa flexibilidad." },
        { q: "¿Tengo que pagar impuestos en EE. UU. si vivo fuera?", a: "Si la LLC es 'disregarded entity' (un solo miembro no residente) y no tiene actividad económica conectada con EE. UU. (ECI) ni presencia física allí, normalmente no genera impuesto federal sobre la renta. La obligación principal es presentar el formulario 5472 + 1120 informativo cada año." },
        { q: "¿Cuánto cuesta mantener la LLC cada año?", a: "Solo el coste del agente registrado a partir del segundo año. Nuevo México no cobra informe anual ni franchise tax, por eso es el estado más eficiente en mantenimiento." },
        { q: "¿Puedo cambiar mi LLC actual a Nuevo México?", a: "Sí, mediante un proceso llamado domesticación o, en algunos casos, disolviendo la entidad anterior y constituyendo una nueva. En la asesoría inicial te explicamos qué opción te conviene." },
      ],
    },
    cta: {
      h2: "¿Listo para constituir tu LLC en Nuevo México?",
      p: "Agenda una llamada y te confirmamos si Nuevo México es el estado adecuado para tu caso, los plazos reales y el coste total sin sorpresas.",
      btn: "Agendar asesoría",
      btnSecondary: "Ver todos los servicios",
    },
    seo: {
      title: "Nuevo México: 0% impuesto estatal para tu LLC | Exentax",
      description: "Cero impuesto estatal sobre la renta, sin informe anual y con anonimato real para nómadas digitales. EIN, banca y BOI llave en mano. Reserva tu llamada.",
      keywords: "LLC Nuevo México, LLC para no residentes, abrir LLC nómada digital, LLC sin informe anual",
      ogTitle: "LLC Nuevo México: privacidad real y mantenimiento mínimo",
      ogDescription: "LLC en Nuevo México sin informe anual, sin franchise tax y con privacidad real. EIN, banco y BOI. Asesoría Exentax: tu LLC en EE. UU., sin sorpresas.",
    },
    jsonLd: {
      name: "Constitución de LLC en Nuevo México para no residentes",
      serviceType: "Constitución de sociedad / Formación de LLC",
    },
  },
  llcWy: {
    cardKicker: "LLC en Wyoming",
    cardTitle: "LLC en Wyoming: privacidad fuerte y protección patrimonial",
    cardDesc: "El estado de referencia para quienes priorizan blindaje de activos, asset protection real y máxima privacidad legal.",
    breadcrumb: "LLC en Wyoming",
    hero: {
      kicker: "LLC EN WYOMING",
      h1: "Tu LLC en Wyoming",
      h1green: "privacidad fuerte y protección patrimonial",
      subtitle: "Wyoming es el estado de referencia para quienes priorizan blindaje patrimonial, charging order protection real para LLC unipersonales y máxima privacidad legal.",
      ctaPrimary: "Agendar asesoría",
      ctaWhatsapp: "Hablar por WhatsApp",
      waText: "Hola, quiero abrir una LLC en Wyoming. ¿Podemos hablar?",
    },
    intro: {
      kicker: "POR QUÉ WYOMING",
      h2: "El estado con mayor protección legal para los miembros",
      paragraphs: [
        "Wyoming fue el primer estado en regular las LLC en Estados Unidos y, desde entonces, su jurisprudencia ha evolucionado hacia una de las mayores protecciones patrimoniales del país. Su charging order protection se aplica también a LLC unipersonales, algo poco común a nivel federal.",
        "Es la opción habitual para inversores, holdings personales, emprendedores con activos a proteger y estructuras donde la privacidad no es un extra, sino un requisito.",
      ],
    },
    features: {
      h2: "Ventajas reales de constituir en Wyoming",
      items: [
        { title: "Charging order protection", desc: "Protección reforzada por ley estatal frente a acreedores personales del miembro, también para LLC de un solo miembro." },
        { title: "Privacidad legal", desc: "El estado no exige listar públicamente a los miembros ni a los managers en la documentación de constitución." },
        { title: "Jurisprudencia favorable", desc: "Tribunales con décadas de casos pro-LLC y reglas claras a favor de la separación entre persona y entidad." },
        { title: "Coste anual contenido", desc: "Annual report con tasa mínima ($60 base) calculada sobre activos en Wyoming, raramente más para no residentes." },
      ],
    },
    bestFor: {
      h2: "Es para ti si...",
      items: [
        "Quieres una LLC pensada como vehículo de protección patrimonial.",
        "Vas a operar una holding personal o tener activos dentro de la entidad.",
        "Te importa que un litigio personal no afecte a la propiedad de la LLC.",
        "Buscas una jurisdicción con jurisprudencia consolidada y predecible.",
        "Necesitas máxima privacidad sin renunciar a una estructura limpia.",
      ],
    },
    whatsIncluded: {
      h2: "Qué incluye nuestro servicio",
      items: [
        "Constitución de la LLC en Wyoming con agente registrado el primer año.",
        "Solicitud y obtención del EIN ante el IRS.",
        "Operating Agreement reforzado adaptado a Wyoming (charging order, transfer restrictions).",
        "Acompañamiento para abrir cuenta bancaria estadounidense.",
        "Reporte BOI (Beneficial Ownership Information) presentado correctamente.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes",
      items: [
        { q: "¿En qué se diferencia Wyoming de Nuevo México?", a: "Nuevo México es la opción más eficiente en coste y mantenimiento. Wyoming es la opción más fuerte en protección legal y jurisprudencia. Si tu prioridad es 'blindaje patrimonial', Wyoming es la mejor elección; si lo es 'mínimo papeleo', Nuevo México." },
        { q: "¿Es realmente privada una LLC en Wyoming?", a: "Sí. El estado no exige publicar los miembros ni los managers. El reporte BOI federal sí identifica al beneficiario real ante FinCEN, pero no es información pública." },
        { q: "¿Hay informe anual?", a: "Sí, Wyoming exige Annual Report con tasa mínima de $60. Es un trámite rápido que también gestionamos." },
        { q: "¿Puedo combinar Wyoming con otra LLC operativa?", a: "Sí. Una estructura habitual es una holding en Wyoming que es miembro único de una LLC operativa en otro estado. En la asesoría te indicamos si eso aporta valor en tu caso." },
      ],
    },
    cta: {
      h2: "¿Listo para constituir tu LLC en Wyoming?",
      p: "Agenda una llamada y revisamos juntos si Wyoming es la mejor jurisdicción para tu objetivo: protección patrimonial, holding personal o privacidad reforzada.",
      btn: "Agendar asesoría",
      btnSecondary: "Ver todos los servicios",
    },
    seo: {
      title: "Wyoming: blindaje patrimonial líder en EE. UU. | Exentax",
      description: "Blinda tu patrimonio con la única charging order exclusiva del país y anonimato societario probado. Compliance mínimo y caso law sólido. Habla con un experto.",
      keywords: "LLC Wyoming, asset protection LLC, LLC privacidad, LLC para no residentes, holding Wyoming",
      ogTitle: "LLC Wyoming: blindaje patrimonial líder en EE. UU.",
      ogDescription: "LLC en Wyoming con la mayor protección patrimonial de EE. UU.: charging order y privacidad legal. Asesoría Exentax: tu LLC en EE. UU., sin sorpresas.",
    },
    jsonLd: {
      name: "Constitución de LLC en Wyoming para no residentes",
      serviceType: "Constitución de sociedad / Formación de LLC",
    },
  },
  llcDe: {
    cardKicker: "LLC en Delaware",
    cardTitle: "LLC en Delaware: prestigio corporativo e inversores",
    cardDesc: "El estándar para startups, ronda de inversión y operaciones B2B que requieren la jurisdicción más reconocida del mundo.",
    breadcrumb: "LLC en Delaware",
    hero: {
      kicker: "LLC EN DELAWARE",
      h1: "Tu LLC en Delaware",
      h1green: "prestigio corporativo y acceso a inversores",
      subtitle: "Delaware es la jurisdicción más reconocida del mundo en derecho corporativo. Es el estándar de facto para startups, rondas de inversión y contratos B2B serios.",
      ctaPrimary: "Agendar asesoría",
      ctaWhatsapp: "Hablar por WhatsApp",
      waText: "Hola, quiero abrir una LLC en Delaware. ¿Podemos hablar?",
    },
    intro: {
      kicker: "POR QUÉ DELAWARE",
      h2: "La jurisdicción de referencia en derecho corporativo",
      paragraphs: [
        "Más del 65% de las empresas Fortune 500 están constituidas en Delaware. Su Court of Chancery es un tribunal especializado en derecho societario con más de 200 años de jurisprudencia, lo que ofrece máxima predictibilidad en disputas y contratos.",
        "Para emprendedores que buscan inversión externa, partners institucionales o clientes corporativos en Estados Unidos, Delaware suele ser un requisito implícito. La señal de credibilidad que aporta es difícil de replicar en otro estado.",
      ],
    },
    features: {
      h2: "Por qué Delaware es el estándar global",
      items: [
        { title: "Court of Chancery", desc: "Tribunal especializado en derecho corporativo, sin jurado y con jueces expertos. Resoluciones rápidas y predecibles." },
        { title: "Estándar para inversores", desc: "Los fondos de venture capital y business angels esperan, por defecto, una entidad en Delaware en sus term sheets." },
        { title: "Flexibilidad contractual", desc: "El Operating Agreement permite estructuras de governance complejas: clases de membership interests, vesting, drag-along, tag-along." },
        { title: "Jurisprudencia masiva", desc: "Décadas de casos publicados que dan certeza sobre cómo se interpretará casi cualquier cláusula." },
      ],
    },
    bestFor: {
      h2: "Es para ti si...",
      items: [
        "Buscas levantar capital o entrar en una aceleradora con base en EE. UU.",
        "Vendes a empresas grandes que exigen contratar con una entidad de Delaware.",
        "Estás construyendo una startup escalable y quieres flexibilidad para futuras rondas.",
        "Quieres una jurisdicción reconocida internacionalmente, sin justificaciones.",
        "Vas a tener varios socios o estructuras de equity más allá de la LLC unipersonal.",
      ],
    },
    whatsIncluded: {
      h2: "Qué incluye nuestro servicio",
      items: [
        "Constitución de la LLC en Delaware con agente registrado el primer año.",
        "Solicitud y obtención del EIN ante el IRS.",
        "Operating Agreement avanzado preparado para inversores.",
        "Acompañamiento para abrir cuenta bancaria estadounidense.",
        "Reporte BOI presentado correctamente desde el inicio.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes",
      items: [
        { q: "¿Cuál es la diferencia con Wyoming o Nuevo México?", a: "Delaware aporta prestigio y compatibilidad con inversores institucionales, a cambio de un coste de mantenimiento mayor (Franchise Tax fija de $300/año para LLC). Wyoming prioriza protección patrimonial; Nuevo México, eficiencia y privacidad." },
        { q: "¿Tengo que pagar impuestos en Delaware si no opero allí?", a: "La LLC paga la Franchise Tax fija anual ($300), pero si no genera ingresos atribuibles al estado, no paga income tax estatal. Las obligaciones federales son las mismas que cualquier LLC de no residentes." },
        { q: "¿Es buena opción para una LLC unipersonal?", a: "Si tu plan no incluye inversión externa ni clientes que exijan Delaware, suele ser excesivo. Para esos casos, Nuevo México o Wyoming son normalmente más eficientes." },
        { q: "¿Puedo convertir más adelante mi LLC en C-Corp?", a: "Sí. Es una conversión estándar en Delaware y es habitual cuando una startup recibe ronda de inversión." },
      ],
    },
    cta: {
      h2: "¿Listo para constituir tu LLC en Delaware?",
      p: "Agenda una llamada y validamos si Delaware es la jurisdicción correcta para tu modelo: startup, B2B o estructura preparada para inversión.",
      btn: "Agendar asesoría",
      btnSecondary: "Ver todos los servicios",
    },
    seo: {
      title: "Delaware: la LLC favorita de los inversores | Exentax",
      description: "La jurisdicción que exigen fondos VC, business angels y compradores B2B en EE. UU.: contratos sólidos, Court of Chancery y series LLC. Habla con un experto.",
      keywords: "LLC Delaware, LLC startup, LLC inversión, Delaware para no residentes, jurisdicción corporativa",
      ogTitle: "LLC Delaware: la favorita de inversores y B2B serios",
      ogDescription: "LLC en Delaware: jurisdicción de referencia para startups, inversión y contratos B2B en EE. UU. Exentax acompaña tu LLC del diagnóstico al día a día.",
    },
    jsonLd: {
      name: "Constitución de LLC en Delaware para no residentes",
      serviceType: "Constitución de sociedad / Formación de LLC",
    },
  },
  llcFl: {
    cardKicker: "LLC en Florida",
    cardTitle: "LLC en Florida: presencia real y mercado hispano",
    cardDesc: "El estado ideal cuando vas a vivir, viajar o tener clientes y proveedores reales en Estados Unidos, especialmente en Miami.",
    breadcrumb: "LLC en Florida",
    hero: {
      kicker: "LLC EN FLORIDA",
      h1: "Tu LLC en Florida",
      h1green: "presencia real, mercado hispano y dinámica de negocios",
      subtitle: "Florida es el estado natural cuando vas a viajar con frecuencia a EE. UU., tener clientes locales o construir un negocio con base en Miami y la comunidad hispana.",
      ctaPrimary: "Agendar asesoría",
      ctaWhatsapp: "Hablar por WhatsApp",
      waText: "Hola, quiero abrir una LLC en Florida. ¿Podemos hablar?",
    },
    intro: {
      kicker: "POR QUÉ FLORIDA",
      h2: "El estado con más conexión real con el mundo hispano",
      paragraphs: [
        "Florida concentra una de las comunidades hispanas más grandes y activas de Estados Unidos. Miami es el hub financiero, comercial y tecnológico para Latinoamérica, y tener una LLC con dirección en Florida facilita relaciones con clientes, proveedores y bancos locales.",
        "Es la opción habitual para emprendedores que sí van a pisar Estados Unidos, alquilar espacio, contratar localmente o vender a consumidores americanos, frente a estados puramente 'pantalla' como Nuevo México o Wyoming.",
        "Cifras 2026 (fuente: Florida Division of Corporations e Department of Revenue): constitución desde 125 $, Annual Report obligatorio antes del 1 de mayo de cada año por 138,75 $, agente registrado con dirección física en Florida obligatorio, 0 % de state income tax sobre personas físicas y un sales tax estatal base del 6 % cuando aplica.",
      ],
    },
    features: {
      h2: "Por qué Florida funciona para hispanohablantes",
      items: [
        { title: "Sin impuesto estatal sobre la renta personal", desc: "Florida no aplica state income tax sobre personas físicas. Para residentes fiscales en EE. UU. es uno de los estados más eficientes." },
        { title: "Comunidad hispana y bancarización", desc: "Bancos, profesionales y proveedores acostumbrados a tratar con clientes hispanohablantes y empresas latinoamericanas." },
        { title: "Hub para Latinoamérica", desc: "Miami es el puente natural entre EE. UU. y LatAm: vuelos directos, ferias, inversores y aceleradoras enfocadas en el mercado hispano." },
        { title: "Adecuado para presencia física", desc: "Si vas a alquilar oficina, contratar empleados o atender clientes en EE. UU., Florida evita el coste de registrar una LLC foránea (foreign qualification) en el estado donde realmente operas." },
      ],
    },
    bestFor: {
      h2: "Es para ti si...",
      items: [
        "Vas a viajar a EE. UU. y quieres operar desde Miami con cierta presencia real.",
        "Tu mercado son clientes hispanohablantes en EE. UU. o Latinoamérica.",
        "Necesitas relación bancaria y contable cómoda en español.",
        "Estás considerando residencia fiscal o visado en EE. UU. en el medio plazo.",
        "Vendes productos o servicios físicos en territorio estadounidense.",
      ],
    },
    whatsIncluded: {
      h2: "Qué incluye nuestro servicio",
      items: [
        "Constitución de la LLC en Florida con agente registrado el primer año.",
        "Solicitud y obtención del EIN ante el IRS.",
        "Operating Agreement adaptado a tu estructura de socios.",
        "Acompañamiento para abrir cuenta bancaria estadounidense, presencial u online.",
        "Reporte BOI presentado correctamente desde el inicio.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes",
      items: [
        { q: "¿Tengo que vivir en Florida para abrir la LLC?", a: "No. Cualquier persona, residente o no residente, puede ser miembro de una LLC en Florida. Lo único obligatorio es tener un agente registrado con dirección física en el estado." },
        { q: "¿Qué impuestos paga la LLC en Florida?", a: "Florida exige Annual Report ($138.75) cada año. No aplica state income tax a personas físicas. La LLC paga impuestos federales según su clasificación (disregarded entity, partnership, etc.) y sólo paga sales tax si vende bienes/servicios sujetos a ese impuesto en el estado." },
        { q: "¿Es buena para vender por Amazon FBA o e-commerce?", a: "Sí, especialmente si vas a tener inventario en EE. UU. o trabajar con proveedores locales. La cercanía con almacenes, freight forwarders y bancos en español es una ventaja operativa real." },
        { q: "¿Puedo cambiar de Nuevo México a Florida más adelante?", a: "Sí, mediante domesticación o constituyendo una nueva entidad en Florida. Te orientamos en la asesoría según tu fase y volumen." },
      ],
    },
    cta: {
      h2: "¿Listo para constituir tu LLC en Florida?",
      p: "Agenda una llamada y revisamos si Florida es el estado correcto para tu negocio, especialmente si tu mercado es hispano o vas a tener presencia real en EE. UU.",
      btn: "Agendar asesoría",
      btnSecondary: "Ver todos los servicios",
    },
    seo: {
      title: "Florida LLC: tu puerta al mercado hispano de Miami | Exentax",
      description: "Tu puerta de entrada al mercado hispano de Miami con presencia física real, banca en español y 0% de impuesto estatal. Con EIN y BOI. Reserva tu llamada.",
      keywords: "LLC Florida, LLC Miami, LLC para hispanos, LLC Amazon FBA Florida, abrir empresa Florida",
      ogTitle: "LLC Florida: tu puerta al mercado hispano de Miami",
      ogDescription: "LLC en Florida con presencia real, banca en español y conexión directa con el mercado hispano de Miami. Consultores fiscales Exentax para no residentes.",
    },
    jsonLd: {
      name: "Constitución de LLC en Florida para hispanohablantes y no residentes",
      serviceType: "Constitución de sociedad / Formación de LLC",
    },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Obtén tu ITIN para no residentes",
    cardDesc: "Tu Individual Taxpayer Identification Number gestionado de principio a fin con un Certifying Acceptance Agent.",
    breadcrumb: "Obtén tu ITIN",
    hero: {
      kicker: "ITIN PARA NO RESIDENTES",
      h1: "Obtén tu ITIN",
      h1green: "de principio a fin, sin enviar tu pasaporte por correo",
      subtitle: "Tramitamos tu Individual Taxpayer Identification Number (ITIN) ante el IRS con un Certifying Acceptance Agent autorizado: nada de enviar el pasaporte original a Estados Unidos.",
      ctaPrimary: "Agendar asesoría",
      ctaWhatsapp: "Hablar por WhatsApp",
      waText: "Hola, necesito tramitar mi ITIN. ¿Podemos hablar?",
    },
    intro: {
      kicker: "QUÉ ES EL ITIN",
      h2: "El número fiscal estadounidense para quienes no tienen SSN",
      paragraphs: [
        "El ITIN (Individual Taxpayer Identification Number) es el número fiscal que emite el IRS a personas que están obligadas a presentar declaraciones o formularios fiscales en EE. UU. pero no califican para un Social Security Number (SSN). Es imprescindible para muchos no residentes con LLC, ingresos inmobiliarios o retenciones en plataformas estadounidenses.",
        "El proceso oficial requiere enviar el pasaporte original al IRS o validarlo a través de un Certifying Acceptance Agent (CAA). Trabajamos con CAA acreditados para que no tengas que desprenderte de tu pasaporte ni asumir el riesgo de pérdida postal.",
      ],
    },
    features: {
      h2: "Cómo funciona nuestro servicio de ITIN",
      items: [
        { title: "Sin enviar el pasaporte", desc: "Validación de tu pasaporte a través de un Certifying Acceptance Agent. Conservas el original en todo momento." },
        { title: "Justificación correcta", desc: "Preparamos el motivo válido de solicitud (Exception 1, 2, 3 o declaración asociada) según tu caso real." },
        { title: "W-7 + soporte completo", desc: "Formulario W-7 cumplimentado, carta del CAA y documentación de respaldo lista para enviar al IRS." },
        { title: "Seguimiento real", desc: "Acompañamiento desde la presentación hasta la recepción del ITIN, incluyendo reenvíos si el IRS pide aclaraciones." },
      ],
    },
    bestFor: {
      h2: "Necesitas ITIN si...",
      items: [
        "Tienes una LLC en EE. UU. y debes presentar formularios informativos personales o asociados.",
        "Recibes pagos de plataformas estadounidenses que aplican retención del 30% por falta de ITIN.",
        "Tienes ingresos inmobiliarios o ganancias de capital en EE. UU. (formulario 1040-NR).",
        "Eres beneficiario de un trust o partnership con presencia fiscal en EE. UU.",
        "Has recibido una carta del IRS pidiéndote un número fiscal individual.",
      ],
    },
    whatsIncluded: {
      h2: "Qué incluye nuestro servicio",
      items: [
        "Análisis de tu motivo de solicitud (Exception aplicable y documentación de respaldo).",
        "Verificación del pasaporte a través de Certifying Acceptance Agent autorizado por el IRS.",
        "Preparación y revisión del formulario W-7 y de la carta de respaldo del CAA.",
        "Envío del expediente completo al IRS con número de seguimiento.",
        "Acompañamiento durante todo el proceso hasta la recepción del ITIN.",
      ],
    },
    faq: {
      h2: "Preguntas frecuentes",
      items: [
        { q: "¿Cuánto tarda el IRS en emitir el ITIN?", a: "El plazo oficial actual es de 8 a 11 semanas desde la recepción del expediente, aunque puede variar según la carga del IRS. Se notifica por carta postal a la dirección indicada en el W-7." },
        { q: "¿Tengo que viajar a Estados Unidos para obtenerlo?", a: "No. Trabajando con un Certifying Acceptance Agent puedes hacerlo todo a distancia desde tu país de residencia." },
        { q: "¿Caduca el ITIN?", a: "Sí. El ITIN caduca si no se utiliza en una declaración fiscal durante tres años consecutivos, o según el cronograma de renovación que publica el IRS. En esos casos, hay que renovarlo." },
        { q: "¿Puedo abrir una cuenta bancaria personal con el ITIN?", a: "Algunas instituciones lo aceptan, especialmente para clientes con vínculo con EE. UU. (LLC, propiedad inmobiliaria, residencia parcial). No es un sustituto del SSN, pero abre puertas que sin ITIN están cerradas." },
      ],
    },
    cta: {
      h2: "¿Listo para tramitar tu ITIN?",
      p: "Agenda una llamada y revisamos tu caso: motivo de solicitud, documentación necesaria y plazos reales con un Certifying Acceptance Agent.",
      btn: "Agendar asesoría",
      btnSecondary: "Ver todos los servicios",
    },
    seo: {
      title: "ITIN sin viajar a EE. UU.: lo gestionamos por ti | Exentax",
      description: "Olvídate del consulado y del envío del pasaporte: nuestro Certifying Acceptance Agent tramita tu ITIN ante el IRS con seguimiento real. Empieza hoy.",
      keywords: "ITIN, obtener ITIN, ITIN para no residentes, Certifying Acceptance Agent, W-7, número fiscal IRS",
      ogTitle: "ITIN sin viajar a EE. UU.: lo gestionamos por ti",
      ogDescription: "Tramitamos tu ITIN ante el IRS con Certifying Acceptance Agent: sin enviar tu pasaporte original. Asesoría Exentax: tu LLC en EE. UU., sin sorpresas.",
    },
    jsonLd: {
      name: "Tramitación de ITIN ante el IRS para no residentes",
      serviceType: "Servicio fiscal / Obtención de número de identificación fiscal",
    },
  },
};

// ===== ENGLISH =====
const en: SubpagesBase = {
  llcNm: {
    cardKicker: "New Mexico LLC",
    cardTitle: "New Mexico LLC: lean, private, no annual report",
    cardDesc: "The state most chosen by digital nomads: zero state tax on the LLC, no annual report and real member privacy.",
    breadcrumb: "New Mexico LLC",
    hero: {
      kicker: "NEW MEXICO LLC",
      h1: "Your New Mexico LLC",
      h1green: "lean, private and at minimum cost",
      subtitle: "Low-cost privacy for solo founders: a U.S. LLC with no annual report, no franchise tax and members kept off the public record — the leanest structure for digital nomads and online entrepreneurs.",
      ctaPrimary: "Book a consultation",
      ctaWhatsapp: "Chat on WhatsApp",
      waText: "Hi, I'd like to set up an LLC in New Mexico. Can we talk?",
    },
    intro: {
      kicker: "WHY NEW MEXICO",
      h2: "The most efficient state for a single-member LLC",
      paragraphs: [
        "Low-cost privacy for solo founders is exactly what makes New Mexico the state most used today by freelancers, remote agencies and content creators living outside the United States: no annual report, no franchise tax, and members can be kept off the public record.",
        "For a non-resident invoicing services from abroad, this means a real legal structure with EIN and a U.S. bank account, while keeping the annual cost minimal and avoiding recurring paperwork.",
      ],
    },
    features: {
      h2: "Why digital nomads choose New Mexico",
      items: [
        { title: "No annual report", desc: "Once formed, no Annual Report is filed with the state. Less paperwork, less risk of missed deadlines, less recurring cost." },
        { title: "No state franchise tax", desc: "New Mexico does not charge a capital tax or annual maintenance fee on LLCs." },
        { title: "Real member privacy", desc: "Members are not listed in the state public registry when the LLC is properly formed with a registered agent." },
        { title: "Minimal maintenance", desc: "You only need to keep a registered agent in the state and meet your federal obligations (BOI/CTA and the federal filing that fits your case)." },
      ],
    },
    bestFor: {
      h2: "It fits you if...",
      items: [
        "You are a remote freelancer or consultant invoicing clients outside the U.S.",
        "You want a clean structure, cheap to maintain and free of recurring state filings.",
        "You care that your name does not appear in the public LLC record.",
        "You operate as a digital nomad and need a legal entity with EIN and bank account.",
        "You have no employees or physical offices in the United States.",
      ],
    },
    whatsIncluded: {
      h2: "What our service includes",
      items: [
        "Full New Mexico LLC formation with registered agent for the first year.",
        "EIN (Employer Identification Number) application and processing with the IRS.",
        "Custom Operating Agreement for single-member or multi-member LLCs.",
        "Hands-on support to open a U.S. business bank account (Mercury, Relay or equivalent).",
        "BOI (Beneficial Ownership Information) report filed correctly from day one.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "Is it legal for a non-resident to open an LLC in New Mexico?", a: "Yes. You don't need to be a U.S. citizen or tax resident to be a member of a New Mexico LLC. It's the most-used choice by international entrepreneurs precisely because of that flexibility." },
        { q: "Do I need to pay U.S. taxes if I live abroad?", a: "If the LLC is a disregarded entity (single non-resident member) with no U.S. effectively connected income (ECI) and no physical presence in the U.S., it usually does not generate federal income tax. The main obligation is to file Form 5472 + 1120 informational return every year." },
        { q: "How much does it cost to keep the LLC running each year?", a: "Only the cost of the registered agent from the second year onwards. New Mexico does not charge an annual report or franchise tax, which is why it's the most efficient state in maintenance." },
        { q: "Can I move my current LLC to New Mexico?", a: "Yes, through a process called domestication or, in some cases, by dissolving the previous entity and forming a new one. We'll explain which option fits you in the initial consultation." },
      ],
    },
    cta: {
      h2: "Ready to form your New Mexico LLC?",
      p: "Book a call and we'll confirm whether New Mexico is the right state for your case, the real timeline and the total cost without surprises.",
      btn: "Book a consultation",
      btnSecondary: "See all services",
    },
    seo: {
      title: "New Mexico LLC: low-cost privacy for solo founders | Exentax",
      description: "The lowest-maintenance U.S. LLC for solo founders: no annual report, no franchise tax and full member anonymity. EIN, U.S. bank and BOI included. Get started.",
      keywords: "New Mexico LLC, LLC for non-residents, digital nomad LLC, LLC no annual report",
      ogTitle: "New Mexico LLC: real privacy, minimal upkeep",
      ogDescription: "New Mexico LLC with no annual report, no franchise tax and real privacy. EIN, U.S. bank and BOI. Exentax tax advisors for non-resident US LLC owners.",
    },
    jsonLd: { name: "New Mexico LLC formation for non-residents", serviceType: "Company incorporation / LLC formation" },
  },
  llcWy: {
    cardKicker: "Wyoming LLC",
    cardTitle: "Wyoming LLC: strong privacy and asset protection",
    cardDesc: "The benchmark state for those who prioritize asset protection, real charging order shielding and maximum legal privacy.",
    breadcrumb: "Wyoming LLC",
    hero: {
      kicker: "WYOMING LLC",
      h1: "Your Wyoming LLC",
      h1green: "strong privacy and asset protection",
      subtitle: "Gold-standard U.S. asset protection: Wyoming delivers the strongest charging order shield in the country (even for single-member LLCs) and maximum legal privacy for the members.",
      ctaPrimary: "Book a consultation",
      ctaWhatsapp: "Chat on WhatsApp",
      waText: "Hi, I'd like to set up an LLC in Wyoming. Can we talk?",
    },
    intro: {
      kicker: "WHY WYOMING",
      h2: "The state with the strongest legal protection for members",
      paragraphs: [
        "Gold-standard asset protection is Wyoming's signature: it was the first U.S. state to regulate LLCs and, since then, its case law has evolved into one of the strongest asset protections in the country, with charging order protection that also applies to single-member LLCs — uncommon at the federal level.",
        "It's the usual choice for investors, personal holdings, entrepreneurs with assets to protect and structures where privacy is not a bonus but a requirement.",
      ],
    },
    features: {
      h2: "Real advantages of forming in Wyoming",
      items: [
        { title: "Charging order protection", desc: "State-law protection against personal creditors of the member, also for single-member LLCs." },
        { title: "Legal privacy", desc: "The state does not require members or managers to be publicly listed in the formation documents." },
        { title: "Favourable case law", desc: "Courts with decades of pro-LLC rulings and clear rules favoring entity-owner separation." },
        { title: "Contained annual cost", desc: "Annual report with a low minimum fee ($60 base) calculated on Wyoming-located assets, rarely more for non-residents." },
      ],
    },
    bestFor: {
      h2: "It fits you if...",
      items: [
        "You want an LLC designed as an asset protection vehicle.",
        "You'll operate a personal holding or hold meaningful assets inside the entity.",
        "You care that a personal lawsuit doesn't reach the LLC ownership.",
        "You're looking for a jurisdiction with consolidated, predictable case law.",
        "You need maximum privacy without giving up a clean structure.",
      ],
    },
    whatsIncluded: {
      h2: "What our service includes",
      items: [
        "Wyoming LLC formation with registered agent for the first year.",
        "EIN application and processing with the IRS.",
        "Reinforced Operating Agreement tailored to Wyoming (charging order, transfer restrictions).",
        "Hands-on support to open a U.S. business bank account.",
        "BOI report filed correctly from day one.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "How is Wyoming different from New Mexico?", a: "New Mexico is the most efficient option in cost and maintenance. Wyoming is the strongest in legal protection and case law. If your priority is asset protection, Wyoming is the better fit; if it's minimal paperwork, New Mexico." },
        { q: "Is a Wyoming LLC really private?", a: "Yes. The state doesn't require disclosing members or managers. The federal BOI report does identify the beneficial owner to FinCEN, but it is not public information." },
        { q: "Is there an annual report?", a: "Yes, Wyoming requires an Annual Report with a $60 minimum fee. It's a quick filing we also handle for you." },
        { q: "Can I combine Wyoming with another operating LLC?", a: "Yes. A common structure is a Wyoming holding being the sole member of an operating LLC in another state. In the consultation we'll tell you whether that adds value in your case." },
      ],
    },
    cta: {
      h2: "Ready to form your Wyoming LLC?",
      p: "Book a call and we'll review together whether Wyoming is the best jurisdiction for your goal: asset protection, personal holding or reinforced privacy.",
      btn: "Book a consultation",
      btnSecondary: "See all services",
    },
    seo: {
      title: "Wyoming LLC: gold-standard U.S. asset protection | Exentax",
      description: "Shield your wealth with America's strongest charging-order statute and decades of pro-LLC case law. Anonymous filings and minimal compliance. Talk to an expert.",
      keywords: "Wyoming LLC, asset protection LLC, LLC privacy, LLC for non-residents, Wyoming holding",
      ogTitle: "Wyoming LLC: gold-standard US asset protection",
      ogDescription: "Wyoming LLC with the strongest U.S. asset protection: charging order shield and legal privacy. End-to-end Exentax support for non-resident LLC owners.",
    },
    jsonLd: { name: "Wyoming LLC formation for non-residents", serviceType: "Company incorporation / LLC formation" },
  },
  llcDe: {
    cardKicker: "Delaware LLC",
    cardTitle: "Delaware LLC: corporate prestige and investor-ready",
    cardDesc: "The standard for startups, fundraising rounds and B2B operations that demand the world's most recognized jurisdiction.",
    breadcrumb: "Delaware LLC",
    hero: {
      kicker: "DELAWARE LLC",
      h1: "Your Delaware LLC",
      h1green: "corporate prestige and access to investors",
      subtitle: "The choice of VCs and B2B buyers: Delaware is the world's most recognized jurisdiction in corporate law and the de facto standard for startups, fundraising rounds and serious B2B contracts.",
      ctaPrimary: "Book a consultation",
      ctaWhatsapp: "Chat on WhatsApp",
      waText: "Hi, I'd like to set up an LLC in Delaware. Can we talk?",
    },
    intro: {
      kicker: "WHY DELAWARE",
      h2: "The benchmark jurisdiction in corporate law",
      paragraphs: [
        "Delaware is the choice of VCs and Fortune 500 B2B buyers in the U.S.: more than 65% of Fortune 500 companies are formed there, and its Court of Chancery is a court specialized in corporate law with over 200 years of case law, providing maximum predictability in disputes and contracts.",
        "For entrepreneurs seeking outside investment, institutional partners or U.S. corporate clients, Delaware is often an implicit requirement. The credibility signal it provides is hard to replicate in any other state.",
      ],
    },
    features: {
      h2: "Why Delaware is the global standard",
      items: [
        { title: "Court of Chancery", desc: "Court specialized in corporate law, no juries, expert judges. Fast and predictable rulings." },
        { title: "Investor standard", desc: "Venture capital funds and angel investors expect, by default, a Delaware entity in their term sheets." },
        { title: "Contractual flexibility", desc: "The Operating Agreement allows complex governance: classes of membership interests, vesting, drag-along, tag-along." },
        { title: "Massive case law", desc: "Decades of published cases that give certainty about how almost any clause will be interpreted." },
      ],
    },
    bestFor: {
      h2: "It fits you if...",
      items: [
        "You aim to raise capital or join a U.S.-based accelerator.",
        "You sell to large companies that require contracting with a Delaware entity.",
        "You're building a scalable startup and want flexibility for future rounds.",
        "You want an internationally recognized jurisdiction, no justifications needed.",
        "You'll have several partners or equity structures beyond a single-member LLC.",
      ],
    },
    whatsIncluded: {
      h2: "What our service includes",
      items: [
        "Delaware LLC formation with registered agent for the first year.",
        "EIN application and processing with the IRS.",
        "Advanced Operating Agreement prepared for investors.",
        "Hands-on support to open a U.S. business bank account.",
        "BOI report filed correctly from day one.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "How is it different from Wyoming or New Mexico?", a: "Delaware brings prestige and compatibility with institutional investors, in exchange for higher maintenance cost (fixed Franchise Tax of $300/year for LLCs). Wyoming prioritizes asset protection; New Mexico, efficiency and privacy." },
        { q: "Do I have to pay taxes in Delaware if I don't operate there?", a: "The LLC pays the fixed annual Franchise Tax ($300), but if it doesn't generate income attributable to the state, it doesn't pay state income tax. Federal obligations are the same as any non-resident LLC." },
        { q: "Is it a good option for a single-member LLC?", a: "If your plan doesn't include outside investment or clients requiring Delaware, it's usually overkill. For those cases, New Mexico or Wyoming are normally more efficient." },
        { q: "Can I later convert my LLC into a C-Corp?", a: "Yes. It's a standard conversion in Delaware and is common when a startup receives a funding round." },
      ],
    },
    cta: {
      h2: "Ready to form your Delaware LLC?",
      p: "Book a call and we'll validate whether Delaware is the right jurisdiction for your model: startup, B2B or investment-ready structure.",
      btn: "Book a consultation",
      btnSecondary: "See all services",
    },
    seo: {
      title: "Delaware LLC: the choice of VCs and B2B buyers | Exentax",
      description: "Built for founders raising capital: the jurisdiction VCs, angels and Fortune 500 buyers expect, with the famed Court of Chancery on your side. Get started.",
      keywords: "Delaware LLC, startup LLC, investment LLC, Delaware for non-residents, corporate jurisdiction",
      ogTitle: "Delaware LLC: the VC and serious B2B benchmark",
      ogDescription: "Delaware LLC: the benchmark jurisdiction for startups, fundraising and B2B contracts in the U.S. Exentax tax advisors for non-resident US LLC owners.",
    },
    jsonLd: { name: "Delaware LLC formation for non-residents", serviceType: "Company incorporation / LLC formation" },
  },
  llcFl: {
    cardKicker: "Florida LLC",
    cardTitle: "Florida LLC: real presence and Hispanic market",
    cardDesc: "The right state when you'll actually live, travel or have real clients and suppliers in the United States, especially in Miami.",
    breadcrumb: "Florida LLC",
    hero: {
      kicker: "FLORIDA LLC",
      h1: "Your Florida LLC",
      h1green: "real presence, Hispanic market and business momentum",
      subtitle: "Your gateway to Miami's Latin market: Florida is the natural state when you'll travel often to the U.S., serve local clients or build a business rooted in Miami and the Hispanic community.",
      ctaPrimary: "Book a consultation",
      ctaWhatsapp: "Chat on WhatsApp",
      waText: "Hi, I'd like to set up an LLC in Florida. Can we talk?",
    },
    intro: {
      kicker: "WHY FLORIDA",
      h2: "The state with the strongest real connection to the Hispanic world",
      paragraphs: [
        "Florida is the gateway to Miami's Latin market: it hosts one of the largest and most active Hispanic communities in the United States, and Miami acts as the financial, commercial and tech hub for Latin America — having an LLC with a Florida address makes it easier to deal with local clients, suppliers and banks.",
        "It's the usual choice for entrepreneurs who actually set foot in the U.S., rent space, hire locally or sell to American consumers, as opposed to purely 'paper' states like New Mexico or Wyoming.",
        "2026 numbers (source: Florida Division of Corporations and Department of Revenue): formation from $125, mandatory Annual Report due by May 1 each year at $138.75, a registered agent with a physical Florida street address is required, no personal state income tax, and a 6% state sales tax base rate when it applies.",
      ],
    },
    features: {
      h2: "Why Florida works for Spanish speakers",
      items: [
        { title: "No state personal income tax", desc: "Florida levies no state income tax on individuals. For U.S. tax residents, it's one of the most efficient states." },
        { title: "Hispanic community and banking", desc: "Banks, professionals and providers used to dealing with Spanish-speaking clients and Latin American companies." },
        { title: "Hub for Latin America", desc: "Miami is the natural bridge between the U.S. and LatAm: direct flights, trade fairs, investors and accelerators focused on the Hispanic market." },
        { title: "Suited for physical presence", desc: "If you'll rent an office, hire employees or serve clients in the U.S., Florida avoids the cost of registering a foreign LLC in the state where you actually operate." },
      ],
    },
    bestFor: {
      h2: "It fits you if...",
      items: [
        "You'll travel to the U.S. and want to operate from Miami with some real presence.",
        "Your market is Spanish-speaking clients in the U.S. or Latin America.",
        "You need comfortable banking and accounting relations in Spanish.",
        "You're considering U.S. tax residency or a U.S. visa in the medium term.",
        "You sell physical products or services in U.S. territory.",
      ],
    },
    whatsIncluded: {
      h2: "What our service includes",
      items: [
        "Florida LLC formation with registered agent for the first year.",
        "EIN application and processing with the IRS.",
        "Operating Agreement tailored to your member structure.",
        "Hands-on support to open a U.S. business bank account, in person or online.",
        "BOI report filed correctly from day one.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "Do I need to live in Florida to open the LLC?", a: "No. Anyone, resident or non-resident, can be a member of a Florida LLC. The only requirement is to keep a registered agent with a physical address in the state." },
        { q: "What taxes does the LLC pay in Florida?", a: "Florida requires an Annual Report ($138.75) every year. It does not levy state income tax on individuals. The LLC pays federal taxes based on its classification (disregarded entity, partnership, etc.) and only pays sales tax if it sells goods/services subject to it in the state." },
        { q: "Is it good for selling on Amazon FBA or e-commerce?", a: "Yes, especially if you'll hold inventory in the U.S. or work with local suppliers. Proximity to warehouses, freight forwarders and Spanish-speaking banks is a real operational advantage." },
        { q: "Can I switch from New Mexico to Florida later on?", a: "Yes, through domestication or by forming a new entity in Florida. We'll guide you in the consultation depending on your stage and volume." },
      ],
    },
    cta: {
      h2: "Ready to form your Florida LLC?",
      p: "Book a call and we'll review whether Florida is the right state for your business, especially if your market is Hispanic or you'll have real presence in the U.S.",
      btn: "Book a consultation",
      btnSecondary: "See all services",
    },
    seo: {
      title: "Florida LLC: your gateway to Miami's Latin market | Exentax",
      description: "Land in Miami with a real U.S. footprint: bilingual banking, 0% state income tax and direct access to the Latin American consumer market. Book a call.",
      keywords: "Florida LLC, Miami LLC, LLC for Hispanics, Amazon FBA Florida LLC, open company Florida",
      ogTitle: "Florida LLC: your gateway to Miami's Latin market",
      ogDescription: "Florida LLC with real presence, Spanish-speaking banking and direct access to Miami's Hispanic market. Exentax: your US LLC ready in 48 h, no surprises.",
    },
    jsonLd: { name: "Florida LLC formation for Spanish speakers and non-residents", serviceType: "Company incorporation / LLC formation" },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Get your ITIN as a non-resident",
    cardDesc: "Your Individual Taxpayer Identification Number handled end-to-end through a Certifying Acceptance Agent.",
    breadcrumb: "Get your ITIN",
    hero: {
      kicker: "ITIN FOR NON-RESIDENTS",
      h1: "Get your ITIN",
      h1green: "end-to-end, without mailing your passport",
      subtitle: "Skip the IRS office and the passport courier: our authorized Certifying Acceptance Agent files your Individual Taxpayer Identification Number (ITIN) with the IRS end-to-end, so you start from anywhere in the world.",
      ctaPrimary: "Book a consultation",
      ctaWhatsapp: "Chat on WhatsApp",
      waText: "Hi, I need to apply for my ITIN. Can we talk?",
    },
    intro: {
      kicker: "WHAT THE ITIN IS",
      h2: "The U.S. tax number for those without an SSN",
      paragraphs: [
        "Skip the IRS office without leaving home: the ITIN (Individual Taxpayer Identification Number) is the tax number the IRS issues to people who must file U.S. tax returns or forms but don't qualify for a Social Security Number (SSN). It's essential for many non-residents with an LLC, U.S. real-estate income or withholding from American platforms.",
        "The official process requires shipping the original passport to the IRS or validating it through a Certifying Acceptance Agent (CAA). We work with accredited CAAs so you don't have to part with your passport or bear the risk of postal loss.",
      ],
    },
    features: {
      h2: "How our ITIN service works",
      items: [
        { title: "No mailing your passport", desc: "Passport validation through a Certifying Acceptance Agent. You keep the original at all times." },
        { title: "Correct justification", desc: "We prepare a valid application reason (Exception 1, 2, 3 or attached return) that fits your real case." },
        { title: "W-7 + full support", desc: "Form W-7 completed, CAA letter and supporting documentation ready to file with the IRS." },
        { title: "Real follow-up", desc: "Support from filing to ITIN delivery, including resubmissions if the IRS asks for clarifications." },
      ],
    },
    bestFor: {
      h2: "You need an ITIN if...",
      items: [
        "You have a U.S. LLC and must file personal informational forms tied to it.",
        "You receive payments from U.S. platforms applying 30% withholding due to lack of ITIN.",
        "You earn U.S. real-estate income or capital gains (Form 1040-NR).",
        "You're a beneficiary of a trust or partnership with U.S. tax presence.",
        "You received an IRS letter requesting an individual tax number.",
      ],
    },
    whatsIncluded: {
      h2: "What our service includes",
      items: [
        "Analysis of your application reason (applicable Exception and supporting documentation).",
        "Passport verification through an IRS-authorized Certifying Acceptance Agent.",
        "Preparation and review of Form W-7 and the CAA support letter.",
        "Submission of the full file to the IRS with tracking number.",
        "Support throughout the entire process until the ITIN is received.",
      ],
    },
    faq: {
      h2: "Frequently asked questions",
      items: [
        { q: "How long does the IRS take to issue the ITIN?", a: "The current official timeline is 8 to 11 weeks from receipt of the file, although it may vary with IRS workload. It's notified by mail to the address indicated on Form W-7." },
        { q: "Do I need to travel to the United States to get it?", a: "No. Working with a Certifying Acceptance Agent you can do the entire process remotely from your country of residence." },
        { q: "Does the ITIN expire?", a: "Yes. The ITIN expires if it isn't used in a tax return for three consecutive years, or according to the IRS renewal schedule. In those cases, it must be renewed." },
        { q: "Can I open a personal bank account with the ITIN?", a: "Some institutions accept it, especially for clients with U.S. ties (LLC, real estate, partial residency). It is not a substitute for the SSN, but it opens doors that are closed without an ITIN." },
      ],
    },
    cta: {
      h2: "Ready to apply for your ITIN?",
      p: "Book a call and we'll review your case: application reason, required documentation and real timelines with a Certifying Acceptance Agent.",
      btn: "Book a consultation",
      btnSecondary: "See all services",
    },
    seo: {
      title: "ITIN without leaving home: skip the IRS in person | Exentax",
      description: "Skip the IRS office and the embassy queue: our Certifying Acceptance Agent files your ITIN remotely with no original passport mailed. Start today.",
      keywords: "ITIN, get ITIN, ITIN for non-residents, Certifying Acceptance Agent, W-7, IRS tax number",
      ogTitle: "ITIN without travel to the US: we file it for you",
      ogDescription: "We file your ITIN with the IRS via a Certifying Acceptance Agent—no original passport mailed. End-to-end Exentax support for non-resident LLC owners.",
    },
    jsonLd: { name: "ITIN application processing with the IRS for non-residents", serviceType: "Tax service / Tax identification number processing" },
  },
};

// ===== FRANÇAIS =====
const fr: SubpagesBase = {
  llcNm: {
    cardKicker: "LLC au Nouveau-Mexique",
    cardTitle: "LLC au Nouveau-Mexique : discrète, efficace, sans rapport annuel",
    cardDesc: "L'État privilégié des nomades digitaux : zéro impôt d'État sur la LLC, pas de rapport annuel et confidentialité réelle.",
    breadcrumb: "LLC au Nouveau-Mexique",
    hero: {
      kicker: "LLC AU NOUVEAU-MEXIQUE",
      h1: "Votre LLC au Nouveau-Mexique",
      h1green: "discrète, sans rapport et à coût minimum",
      subtitle: "Zéro paperasse annuelle : une LLC américaine sans rapport annuel, sans franchise tax et avec une vraie confidentialité des membres — la structure la plus légère pour freelances et nomades digitaux.",
      ctaPrimary: "Réserver une consultation",
      ctaWhatsapp: "Discuter sur WhatsApp",
      waText: "Bonjour, je souhaite créer une LLC au Nouveau-Mexique. Pouvons-nous en parler ?",
    },
    intro: {
      kicker: "POURQUOI LE NOUVEAU-MEXIQUE",
      h2: "L'État le plus efficace pour une LLC unipersonnelle",
      paragraphs: [
        "Zéro paperasse annuelle : c'est précisément pour cela que le Nouveau-Mexique est aujourd'hui l'État le plus utilisé par les freelances, agences distantes et créateurs de contenu vivant hors des États-Unis — pas de rapport annuel, pas de franchise tax et la possibilité de ne pas inscrire publiquement les membres de la LLC.",
        "Pour un non-résident facturant des services depuis l'étranger, cela se traduit par une structure légale réelle, avec EIN et compte bancaire américain, en maintenant le coût annuel au minimum et en évitant la bureaucratie récurrente.",
      ],
    },
    features: {
      h2: "Pourquoi les nomades digitaux choisissent le Nouveau-Mexique",
      items: [
        { title: "Pas de rapport annuel", desc: "Une fois constituée, aucun Annual Report à déposer. Moins de papiers, moins de risque d'oubli, moins de coût récurrent." },
        { title: "Pas de franchise tax", desc: "Le Nouveau-Mexique n'applique ni impôt sur le capital ni taxe annuelle de maintien sur la LLC." },
        { title: "Confidentialité réelle", desc: "Les noms des membres n'apparaissent pas dans le registre public lorsque la LLC est correctement constituée avec un agent enregistré." },
        { title: "Maintenance minimale", desc: "Vous devez seulement maintenir un agent enregistré dans l'État et respecter vos obligations fédérales (BOI/CTA et déclaration fédérale selon votre cas)." },
      ],
    },
    bestFor: {
      h2: "C'est pour vous si...",
      items: [
        "Vous êtes freelance ou consultant à distance facturant des clients hors des États-Unis.",
        "Vous voulez une structure propre, peu coûteuse à maintenir, sans démarches récurrentes.",
        "Vous tenez à ce que votre nom n'apparaisse pas publiquement dans le registre.",
        "Vous travaillez en nomade digital et avez besoin d'une entité avec EIN et compte bancaire.",
        "Vous n'avez ni salariés ni bureaux physiques aux États-Unis.",
      ],
    },
    whatsIncluded: {
      h2: "Ce que comprend notre service",
      items: [
        "Constitution complète de la LLC au Nouveau-Mexique avec agent enregistré la première année.",
        "Demande et obtention de l'EIN auprès de l'IRS.",
        "Operating Agreement personnalisé (LLC unipersonnelle ou multi-membres).",
        "Accompagnement pour ouvrir un compte bancaire américain (Mercury, Relay ou équivalent).",
        "Rapport BOI (Beneficial Ownership Information) déposé correctement dès le départ.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Un non-résident peut-il légalement ouvrir une LLC au Nouveau-Mexique ?", a: "Oui. Vous n'avez besoin ni de la citoyenneté ni de la résidence fiscale américaine pour être membre d'une LLC au Nouveau-Mexique. C'est l'option la plus utilisée par les entrepreneurs internationaux pour cette flexibilité." },
        { q: "Dois-je payer des impôts aux États-Unis si je vis à l'étranger ?", a: "Si la LLC est 'disregarded entity' (un seul membre non-résident) sans activité économique connectée aux États-Unis (ECI) ni présence physique, elle ne génère normalement pas d'impôt fédéral. L'obligation principale est de déposer chaque année les formulaires 5472 + 1120 informatifs." },
        { q: "Quel est le coût annuel de maintien ?", a: "Seul le coût de l'agent enregistré à partir de la deuxième année. Le Nouveau-Mexique ne facture ni rapport annuel ni franchise tax, c'est pour cela qu'il est l'État le plus efficace." },
        { q: "Puis-je transférer ma LLC actuelle au Nouveau-Mexique ?", a: "Oui, via un processus de domestication ou, dans certains cas, en dissolvant l'entité précédente et en en constituant une nouvelle. Nous expliquons l'option adaptée lors de la consultation." },
      ],
    },
    cta: {
      h2: "Prêt à constituer votre LLC au Nouveau-Mexique ?",
      p: "Réservez un appel : nous confirmons si le Nouveau-Mexique est le bon État, les délais réels et le coût total sans surprise.",
      btn: "Réserver une consultation",
      btnSecondary: "Voir tous les services",
    },
    seo: {
      title: "LLC au Nouveau-Mexique : zéro paperasse annuelle | Exentax",
      description: "Zéro déclaration annuelle, zéro franchise tax et anonymat total pour les freelances et nomades : la LLC la plus légère des USA. EIN inclus. Réservez un appel.",
      keywords: "LLC Nouveau-Mexique, LLC non-résidents, LLC nomade digital, LLC sans rapport annuel",
      ogTitle: "LLC Nouveau-Mexique : confidentialité réelle, peu de coûts",
      ogDescription: "LLC au Nouveau-Mexique sans rapport annuel ni franchise tax, avec une vraie confidentialité. Exentax : création, banque et conformité de votre LLC US.",
    },
    jsonLd: { name: "Constitution de LLC au Nouveau-Mexique pour non-résidents", serviceType: "Constitution de société / Formation de LLC" },
  },
  llcWy: {
    cardKicker: "LLC au Wyoming",
    cardTitle: "LLC au Wyoming : confidentialité forte et protection patrimoniale",
    cardDesc: "L'État de référence pour ceux qui priorisent la protection des actifs, le charging order et la confidentialité maximale.",
    breadcrumb: "LLC au Wyoming",
    hero: {
      kicker: "LLC AU WYOMING",
      h1: "Votre LLC au Wyoming",
      h1green: "confidentialité forte et protection patrimoniale",
      subtitle: "Bouclier patrimonial américain : le Wyoming offre le charging order le plus solide des USA (même pour les LLC unipersonnelles) et une confidentialité légale maximale pour les associés.",
      ctaPrimary: "Réserver une consultation",
      ctaWhatsapp: "Discuter sur WhatsApp",
      waText: "Bonjour, je souhaite créer une LLC au Wyoming. Pouvons-nous en parler ?",
    },
    intro: {
      kicker: "POURQUOI LE WYOMING",
      h2: "L'État offrant la plus forte protection légale pour les membres",
      paragraphs: [
        "Le Wyoming est le bouclier patrimonial américain par excellence : premier État à avoir régulé les LLC, sa jurisprudence a évolué vers l'une des protections d'actifs les plus fortes du pays, avec une charging order qui s'applique aussi aux LLC unipersonnelles — une exception au niveau fédéral.",
        "C'est l'option habituelle pour investisseurs, holdings personnelles, entrepreneurs avec actifs à protéger et structures où la confidentialité est une exigence, pas un bonus.",
      ],
    },
    features: {
      h2: "Vrais avantages d'une LLC au Wyoming",
      items: [
        { title: "Charging order protection", desc: "Protection renforcée par la loi de l'État face aux créanciers personnels du membre, même pour les LLC unipersonnelles." },
        { title: "Confidentialité légale", desc: "L'État n'exige pas la publication des membres ni des managers dans les documents constitutifs." },
        { title: "Jurisprudence favorable", desc: "Tribunaux avec des décennies de décisions pro-LLC et règles claires en faveur de la séparation entité/personne." },
        { title: "Coût annuel maîtrisé", desc: "Annual Report avec taxe minimale (60 $) calculée sur les actifs au Wyoming, rarement plus pour les non-résidents." },
      ],
    },
    bestFor: {
      h2: "C'est pour vous si...",
      items: [
        "Vous voulez une LLC pensée comme véhicule de protection patrimoniale.",
        "Vous opérerez une holding personnelle ou des actifs dans l'entité.",
        "Vous souhaitez qu'un litige personnel n'atteigne pas la propriété de la LLC.",
        "Vous cherchez une juridiction à la jurisprudence consolidée et prévisible.",
        "Vous avez besoin d'une confidentialité maximale sans renoncer à une structure propre.",
      ],
    },
    whatsIncluded: {
      h2: "Ce que comprend notre service",
      items: [
        "Constitution de la LLC au Wyoming avec agent enregistré la première année.",
        "Demande et obtention de l'EIN auprès de l'IRS.",
        "Operating Agreement renforcé adapté au Wyoming (charging order, transfer restrictions).",
        "Accompagnement pour l'ouverture d'un compte bancaire américain.",
        "Rapport BOI déposé correctement dès le départ.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Quelle différence avec le Nouveau-Mexique ?", a: "Le Nouveau-Mexique est l'option la plus efficace en coût et maintenance. Le Wyoming est l'option la plus forte en protection légale. Si votre priorité est la protection patrimoniale, c'est le Wyoming ; si c'est le minimum de papiers, le Nouveau-Mexique." },
        { q: "Une LLC au Wyoming est-elle réellement confidentielle ?", a: "Oui. L'État n'exige pas la publication des membres ni des managers. Le rapport BOI fédéral identifie le bénéficiaire effectif auprès de FinCEN, mais cette information n'est pas publique." },
        { q: "Y a-t-il un rapport annuel ?", a: "Oui, le Wyoming exige un Annual Report avec une taxe minimale de 60 $. C'est une démarche rapide que nous gérons aussi." },
        { q: "Puis-je combiner Wyoming avec une autre LLC opérationnelle ?", a: "Oui. Une structure courante : holding au Wyoming membre unique d'une LLC opérationnelle dans un autre État. En consultation, nous indiquons si cela apporte de la valeur dans votre cas." },
      ],
    },
    cta: {
      h2: "Prêt à constituer votre LLC au Wyoming ?",
      p: "Réservez un appel et examinons ensemble si le Wyoming est la meilleure juridiction pour votre objectif : protection patrimoniale, holding ou confidentialité renforcée.",
      btn: "Réserver une consultation",
      btnSecondary: "Voir tous les services",
    },
    seo: {
      title: "LLC au Wyoming : bouclier patrimonial américain | Exentax",
      description: "Protégez vos actifs avec la charging order la plus solide des USA et une jurisprudence décennale favorable aux associés. Confidentialité totale. À discuter.",
      keywords: "LLC Wyoming, asset protection, LLC confidentialité, LLC non-résidents, holding Wyoming",
      ogTitle: "LLC Wyoming : protection patrimoniale n°1 aux USA",
      ogDescription: "LLC au Wyoming avec la plus forte protection patrimoniale des USA : charging order et confidentialité. Cabinet fiscal Exentax pour LLC non-résidents.",
    },
    jsonLd: { name: "Constitution de LLC au Wyoming pour non-résidents", serviceType: "Constitution de société / Formation de LLC" },
  },
  llcDe: {
    cardKicker: "LLC au Delaware",
    cardTitle: "LLC au Delaware : prestige juridique et investisseurs",
    cardDesc: "Le standard pour startups, levées de fonds et opérations B2B exigeant la juridiction la plus reconnue au monde.",
    breadcrumb: "LLC au Delaware",
    hero: {
      kicker: "LLC AU DELAWARE",
      h1: "Votre LLC au Delaware",
      h1green: "prestige juridique et accès aux investisseurs",
      subtitle: "Prête pour la levée de fonds : le Delaware est la juridiction la plus reconnue au monde en droit des sociétés et le standard de fait pour startups, fonds de VC et contrats B2B sérieux.",
      ctaPrimary: "Réserver une consultation",
      ctaWhatsapp: "Discuter sur WhatsApp",
      waText: "Bonjour, je souhaite créer une LLC au Delaware. Pouvons-nous en parler ?",
    },
    intro: {
      kicker: "POURQUOI LE DELAWARE",
      h2: "La juridiction de référence en droit des sociétés",
      paragraphs: [
        "Une LLC prête pour la levée de fonds passe par le Delaware : plus de 65 % des entreprises Fortune 500 y sont constituées et la Court of Chancery, tribunal spécialisé en droit des sociétés, apporte plus de 200 ans de jurisprudence et une prévisibilité maximale.",
        "Pour les entrepreneurs cherchant un investissement extérieur, des partenaires institutionnels ou des clients corporate aux États-Unis, le Delaware est souvent une exigence implicite. Le signal de crédibilité qu'il apporte est difficile à reproduire ailleurs.",
      ],
    },
    features: {
      h2: "Pourquoi le Delaware est le standard mondial",
      items: [
        { title: "Court of Chancery", desc: "Tribunal spécialisé en droit des sociétés, sans jury, avec des juges experts. Décisions rapides et prévisibles." },
        { title: "Standard pour investisseurs", desc: "Fonds VC et business angels attendent par défaut une entité au Delaware dans leurs term sheets." },
        { title: "Flexibilité contractuelle", desc: "L'Operating Agreement permet des structures complexes : classes de membership interests, vesting, drag-along, tag-along." },
        { title: "Jurisprudence massive", desc: "Décennies de cas publiés donnant une certitude sur l'interprétation de presque toute clause." },
      ],
    },
    bestFor: {
      h2: "C'est pour vous si...",
      items: [
        "Vous visez une levée de fonds ou une accélératrice basée aux États-Unis.",
        "Vous vendez à de grandes entreprises exigeant un contrat avec une entité Delaware.",
        "Vous construisez une startup scalable avec besoin de flexibilité pour de futures rondes.",
        "Vous voulez une juridiction reconnue internationalement, sans justification.",
        "Vous aurez plusieurs associés ou des structures d'equity au-delà de la LLC unipersonnelle.",
      ],
    },
    whatsIncluded: {
      h2: "Ce que comprend notre service",
      items: [
        "Constitution de la LLC au Delaware avec agent enregistré la première année.",
        "Demande et obtention de l'EIN auprès de l'IRS.",
        "Operating Agreement avancé préparé pour des investisseurs.",
        "Accompagnement pour l'ouverture d'un compte bancaire américain.",
        "Rapport BOI déposé correctement dès le départ.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Différence avec Wyoming ou Nouveau-Mexique ?", a: "Le Delaware apporte prestige et compatibilité avec les investisseurs institutionnels, contre un coût de maintenance plus élevé (Franchise Tax fixe de 300 $/an). Le Wyoming priorise la protection patrimoniale ; le Nouveau-Mexique, l'efficacité et la confidentialité." },
        { q: "Dois-je payer des impôts au Delaware si je n'y opère pas ?", a: "La LLC paie la Franchise Tax fixe annuelle (300 $), mais sans revenus attribuables à l'État, elle ne paie pas d'impôt sur le revenu d'État. Les obligations fédérales sont les mêmes que pour toute LLC de non-résident." },
        { q: "Est-ce une bonne option pour une LLC unipersonnelle ?", a: "Si votre plan n'inclut ni investissement extérieur ni clients exigeant le Delaware, c'est généralement excessif. Pour ces cas, Nouveau-Mexique ou Wyoming sont plus efficaces." },
        { q: "Puis-je convertir ma LLC en C-Corp plus tard ?", a: "Oui. C'est une conversion standard au Delaware, courante lorsqu'une startup reçoit une levée de fonds." },
      ],
    },
    cta: {
      h2: "Prêt à constituer votre LLC au Delaware ?",
      p: "Réservez un appel et nous validons si le Delaware est la juridiction adaptée : startup, B2B ou structure prête pour l'investissement.",
      btn: "Réserver une consultation",
      btnSecondary: "Voir tous les services",
    },
    seo: {
      title: "LLC au Delaware : prête pour la levée de fonds | Exentax",
      description: "La structure attendue par les fonds américains et les acheteurs B2B : Court of Chancery, séries LLC et contrats reconnus mondialement. Prenez rendez-vous.",
      keywords: "LLC Delaware, LLC startup, LLC investissement, Delaware non-résidents, juridiction corporate",
      ogTitle: "LLC Delaware : la référence VC et B2B sérieux",
      ogDescription: "LLC au Delaware : juridiction de référence pour startups, levées de fonds et contrats B2B aux USA. Exentax : votre LLC américaine opérationnelle en 48 h.",
    },
    jsonLd: { name: "Constitution de LLC au Delaware pour non-résidents", serviceType: "Constitution de société / Formation de LLC" },
  },
  llcFl: {
    cardKicker: "LLC en Floride",
    cardTitle: "LLC en Floride : présence réelle et marché hispanique",
    cardDesc: "L'État idéal lorsque vous allez vivre, voyager ou avoir des clients et fournisseurs réels aux États-Unis, surtout à Miami.",
    breadcrumb: "LLC en Floride",
    hero: {
      kicker: "LLC EN FLORIDE",
      h1: "Votre LLC en Floride",
      h1green: "présence réelle, marché hispanique et dynamique entrepreneuriale",
      subtitle: "Accès direct au marché latino : la Floride est l'État naturel quand vous voyagez fréquemment aux États-Unis, avez des clients locaux ou construisez une activité ancrée à Miami et dans la communauté hispanique.",
      ctaPrimary: "Réserver une consultation",
      ctaWhatsapp: "Discuter sur WhatsApp",
      waText: "Bonjour, je souhaite créer une LLC en Floride. Pouvons-nous en parler ?",
    },
    intro: {
      kicker: "POURQUOI LA FLORIDE",
      h2: "L'État avec la plus forte connexion réelle au monde hispanique",
      paragraphs: [
        "La Floride donne un accès direct au marché latino : elle concentre l'une des plus grandes communautés hispaniques actives des États-Unis, et Miami fait office de hub financier, commercial et tech pour l'Amérique latine — une LLC avec adresse en Floride facilite les relations avec clients, fournisseurs et banques locales.",
        "C'est l'option courante pour les entrepreneurs qui mettent vraiment les pieds aux États-Unis, louent un espace, embauchent localement ou vendent à des consommateurs américains, contrairement aux États purement 'paper' comme le Nouveau-Mexique ou le Wyoming.",
        "Chiffres 2026 (source : Florida Division of Corporations et Department of Revenue) : création à partir de 125 $, Annual Report obligatoire avant le 1er mai chaque année pour 138,75 $, agent enregistré avec adresse physique en Floride obligatoire, 0 % d'impôt d'État sur le revenu des personnes physiques et un taux de base de 6 % de sales tax d'État lorsqu'elle s'applique.",
      ],
    },
    features: {
      h2: "Pourquoi la Floride fonctionne pour les hispanophones",
      items: [
        { title: "Pas d'impôt d'État sur le revenu", desc: "La Floride n'applique pas de state income tax aux personnes physiques. Pour les résidents fiscaux américains, c'est l'un des États les plus efficaces." },
        { title: "Communauté hispanique et bancarisation", desc: "Banques, professionnels et fournisseurs habitués à traiter avec des clients hispanophones et entreprises latino-américaines." },
        { title: "Hub pour l'Amérique latine", desc: "Miami est le pont naturel entre les États-Unis et la LatAm : vols directs, salons, investisseurs et accélérateurs ciblant le marché hispanique." },
        { title: "Adapté à une présence physique", desc: "Si vous louez un bureau, embauchez ou servez des clients aux États-Unis, la Floride évite le coût d'enregistrer une LLC étrangère dans l'État où vous opérez réellement." },
      ],
    },
    bestFor: {
      h2: "C'est pour vous si...",
      items: [
        "Vous allez voyager aux États-Unis et opérer depuis Miami avec une présence réelle.",
        "Votre marché est constitué de clients hispanophones aux États-Unis ou en LatAm.",
        "Vous avez besoin d'une banque et d'une comptabilité confortables en espagnol.",
        "Vous envisagez la résidence fiscale ou un visa américain à moyen terme.",
        "Vous vendez des produits ou services physiques sur le territoire américain.",
      ],
    },
    whatsIncluded: {
      h2: "Ce que comprend notre service",
      items: [
        "Constitution de la LLC en Floride avec agent enregistré la première année.",
        "Demande et obtention de l'EIN auprès de l'IRS.",
        "Operating Agreement adapté à votre structure d'associés.",
        "Accompagnement pour ouvrir un compte bancaire américain, en présentiel ou en ligne.",
        "Rapport BOI déposé correctement dès le départ.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Faut-il vivre en Floride pour ouvrir la LLC ?", a: "Non. Toute personne, résidente ou non, peut être membre d'une LLC en Floride. La seule obligation est de maintenir un agent enregistré avec adresse physique dans l'État." },
        { q: "Quels impôts paie la LLC en Floride ?", a: "La Floride exige un Annual Report (138,75 $) chaque année. Pas de state income tax pour les personnes physiques. La LLC paie les impôts fédéraux selon sa classification, et la sales tax uniquement si elle vend des biens/services soumis à cette taxe dans l'État." },
        { q: "Est-ce bon pour Amazon FBA ou e-commerce ?", a: "Oui, surtout si vous aurez du stock aux États-Unis ou travaillerez avec des fournisseurs locaux. La proximité avec entrepôts, freight forwarders et banques en espagnol est un vrai avantage opérationnel." },
        { q: "Puis-je passer du Nouveau-Mexique à la Floride plus tard ?", a: "Oui, par domestication ou en constituant une nouvelle entité en Floride. Nous vous orientons en consultation selon votre étape et votre volume." },
      ],
    },
    cta: {
      h2: "Prêt à constituer votre LLC en Floride ?",
      p: "Réservez un appel : nous vérifions si la Floride est l'État adapté, surtout si votre marché est hispanique ou si vous aurez une présence réelle aux États-Unis.",
      btn: "Réserver une consultation",
      btnSecondary: "Voir tous les services",
    },
    seo: {
      title: "LLC en Floride : accès direct au marché latino | Exentax",
      description: "Posez le pied à Miami avec une vraie présence américaine, banque francophone et accès direct au marché latino-américain le plus dynamique. Réservez votre appel.",
      keywords: "LLC Floride, LLC Miami, LLC pour hispanophones, LLC Amazon FBA Floride, ouvrir entreprise Floride",
      ogTitle: "LLC Floride : votre porte d'entrée au marché hispanique",
      ogDescription: "LLC en Floride avec présence réelle, banque en espagnol et accès direct au marché hispanique de Miami. Cabinet fiscal Exentax pour LLC non-résidents.",
    },
    jsonLd: { name: "Constitution de LLC en Floride pour hispanophones et non-résidents", serviceType: "Constitution de société / Formation de LLC" },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Obtenez votre ITIN en tant que non-résident",
    cardDesc: "Votre Individual Taxpayer Identification Number traité de bout en bout via un Certifying Acceptance Agent.",
    breadcrumb: "Obtenir votre ITIN",
    hero: {
      kicker: "ITIN POUR NON-RÉSIDENTS",
      h1: "Obtenez votre ITIN",
      h1green: "de bout en bout, sans envoyer votre passeport",
      subtitle: "Sans ambassade ni envoi postal du passeport : notre Certifying Acceptance Agent agréé dépose votre Individual Taxpayer Identification Number (ITIN) auprès de l'IRS de bout en bout, pendant que vous restez chez vous.",
      ctaPrimary: "Réserver une consultation",
      ctaWhatsapp: "Discuter sur WhatsApp",
      waText: "Bonjour, j'ai besoin d'obtenir mon ITIN. Pouvons-nous en parler ?",
    },
    intro: {
      kicker: "QU'EST-CE QUE L'ITIN",
      h2: "Le numéro fiscal américain pour ceux sans SSN",
      paragraphs: [
        "Sans ambassade et géré à distance : l'ITIN (Individual Taxpayer Identification Number) est le numéro fiscal délivré par l'IRS aux personnes tenues de déposer des déclarations fiscales américaines mais inéligibles au Social Security Number (SSN). Il est indispensable pour de nombreux non-résidents avec LLC, revenus immobiliers ou retenues sur plateformes américaines.",
        "Le processus officiel exige d'envoyer le passeport original à l'IRS ou de le faire valider par un Certifying Acceptance Agent (CAA). Nous travaillons avec des CAA accrédités pour que vous n'ayez ni à vous séparer de votre passeport, ni à assumer le risque postal.",
      ],
    },
    features: {
      h2: "Comment fonctionne notre service ITIN",
      items: [
        { title: "Sans envoyer le passeport", desc: "Validation du passeport via un Certifying Acceptance Agent. Vous gardez l'original à tout moment." },
        { title: "Justification correcte", desc: "Nous préparons le motif valable (Exception 1, 2, 3 ou déclaration associée) selon votre cas réel." },
        { title: "W-7 + support complet", desc: "Formulaire W-7 rempli, lettre du CAA et pièces justificatives prêts à être envoyés à l'IRS." },
        { title: "Suivi réel", desc: "Accompagnement de la soumission jusqu'à la réception de l'ITIN, y compris renvois si l'IRS demande des compléments." },
      ],
    },
    bestFor: {
      h2: "Vous avez besoin d'un ITIN si...",
      items: [
        "Vous avez une LLC américaine et vous devez déposer les formulaires informatifs personnels associés.",
        "Vous recevez des paiements de plateformes américaines avec retenue de 30 % faute d'ITIN.",
        "Vous avez des revenus immobiliers ou des plus-values aux États-Unis (formulaire 1040-NR).",
        "Vous êtes bénéficiaire d'un trust ou d'un partnership avec présence fiscale américaine.",
        "Vous avez reçu une lettre de l'IRS vous demandant un numéro fiscal individuel.",
      ],
    },
    whatsIncluded: {
      h2: "Ce que comprend notre service",
      items: [
        "Analyse de votre motif (Exception applicable et pièces justificatives).",
        "Vérification du passeport par un Certifying Acceptance Agent autorisé par l'IRS.",
        "Préparation et révision du formulaire W-7 et de la lettre d'accompagnement du CAA.",
        "Envoi du dossier complet à l'IRS avec numéro de suivi.",
        "Accompagnement tout au long du processus jusqu'à la réception de l'ITIN.",
      ],
    },
    faq: {
      h2: "Questions fréquentes",
      items: [
        { q: "Combien de temps l'IRS met-il pour émettre l'ITIN ?", a: "Le délai officiel actuel est de 8 à 11 semaines à compter de la réception du dossier, mais il peut varier selon la charge de l'IRS. Notification par courrier à l'adresse indiquée sur le W-7." },
        { q: "Dois-je voyager aux États-Unis pour l'obtenir ?", a: "Non. En passant par un Certifying Acceptance Agent, vous pouvez tout faire à distance depuis votre pays de résidence." },
        { q: "L'ITIN expire-t-il ?", a: "Oui. L'ITIN expire s'il n'est pas utilisé dans une déclaration pendant trois années consécutives, ou selon le calendrier de renouvellement publié par l'IRS." },
        { q: "Puis-je ouvrir un compte bancaire personnel avec l'ITIN ?", a: "Certaines banques l'acceptent, surtout pour les clients ayant un lien réel avec les États-Unis (LLC, immobilier, résidence partielle). Ce n'est pas un substitut au SSN, mais cela ouvre des portes qui resteraient sinon fermées." },
      ],
    },
    cta: {
      h2: "Prêt à demander votre ITIN ?",
      p: "Réservez un appel : nous étudions votre dossier (motif, pièces et délais réels) avec un Certifying Acceptance Agent.",
      btn: "Réserver une consultation",
      btnSecondary: "Voir tous les services",
    },
    seo: {
      title: "ITIN sans ambassade : nous le gérons à distance | Exentax",
      description: "Évitez l'ambassade et l'envoi de votre passeport : notre Certifying Acceptance Agent dépose votre ITIN auprès de l'IRS et vous suit. Commencez ici.",
      keywords: "ITIN, obtenir ITIN, ITIN non-résidents, Certifying Acceptance Agent, W-7, numéro fiscal IRS",
      ogTitle: "ITIN sans voyager aux USA : on s'en charge pour vous",
      ogDescription: "Nous gérons votre ITIN auprès de l'IRS avec un Certifying Acceptance Agent, sans envoi du passeport. Cabinet fiscal Exentax pour LLC non-résidents.",
    },
    jsonLd: { name: "Traitement d'ITIN auprès de l'IRS pour non-résidents", serviceType: "Service fiscal / Obtention de numéro fiscal" },
  },
};

// ===== DEUTSCH =====
const de: SubpagesBase = {
  llcNm: {
    cardKicker: "LLC in New Mexico",
    cardTitle: "LLC in New Mexico: schlank, privat, ohne Jahresbericht",
    cardDesc: "Der von Digitalnomaden meistgewählte Bundesstaat: keine Staatssteuer auf die LLC, kein Jahresbericht, echte Privatsphäre.",
    breadcrumb: "LLC in New Mexico",
    hero: {
      kicker: "LLC IN NEW MEXICO",
      h1: "Ihre LLC in New Mexico",
      h1green: "schlank, privat und zu minimalen Kosten",
      subtitle: "Steueroptimiert für Selbstständige: eine US-LLC ohne Jahresbericht, ohne Franchise Tax und mit echter Privatsphäre der Gesellschafter — die schlankste Struktur für Freelancer und Digitalnomaden.",
      ctaPrimary: "Beratung buchen",
      ctaWhatsapp: "Auf WhatsApp schreiben",
      waText: "Hallo, ich möchte eine LLC in New Mexico gründen. Können wir sprechen?",
    },
    intro: {
      kicker: "WARUM NEW MEXICO",
      h2: "Der effizienteste Bundesstaat für eine Single-Member-LLC",
      paragraphs: [
        "Steueroptimiert für deutschsprachige Selbstständige: genau deshalb ist New Mexico heute der von Freelancern, Remote-Agenturen und Content Creators außerhalb der USA meistgenutzte Bundesstaat — kein Jahresbericht, keine Franchise Tax und Mitglieder müssen nicht öffentlich gelistet werden.",
        "Für Nicht-Ansässige, die Dienstleistungen aus dem Ausland fakturieren, bedeutet das eine echte juristische Struktur mit EIN und US-Bankkonto, bei minimalen Jahreskosten und ohne wiederkehrende Bürokratie.",
      ],
    },
    features: {
      h2: "Warum Digitalnomaden New Mexico wählen",
      items: [
        { title: "Kein Jahresbericht", desc: "Nach Gründung kein Annual Report. Weniger Papierkram, weniger Risiko verpasster Fristen, weniger laufende Kosten." },
        { title: "Keine staatliche Franchise Tax", desc: "New Mexico erhebt keine Kapitalsteuer und keine jährliche Verwaltungsgebühr auf LLCs." },
        { title: "Echte Privatsphäre", desc: "Mitglieder erscheinen nicht im öffentlichen Register, wenn die LLC mit Registered Agent ordnungsgemäß gegründet wird." },
        { title: "Minimale Wartung", desc: "Sie müssen nur einen Registered Agent im Bundesstaat halten und Ihre föderalen Pflichten erfüllen (BOI/CTA und passende Bundessteuererklärung)." },
      ],
    },
    bestFor: {
      h2: "Passend für Sie, wenn...",
      items: [
        "Sie als Remote-Freelancer oder Berater Kunden außerhalb der USA fakturieren.",
        "Sie eine saubere, günstig zu pflegende Struktur ohne wiederkehrende Bundesstaatsmeldungen wollen.",
        "Sie Wert darauf legen, dass Ihr Name nicht öffentlich im LLC-Register erscheint.",
        "Sie als Digitalnomade arbeiten und eine Rechtsform mit EIN und Bankkonto brauchen.",
        "Sie keine Mitarbeiter und keine physischen Büros in den USA haben.",
      ],
    },
    whatsIncluded: {
      h2: "Was unser Service umfasst",
      items: [
        "Vollständige LLC-Gründung in New Mexico mit Registered Agent für das erste Jahr.",
        "Beantragung und Erhalt der EIN beim IRS.",
        "Maßgeschneidertes Operating Agreement für Single- oder Multi-Member-LLC.",
        "Begleitung bei der Eröffnung eines US-Bankkontos (Mercury, Relay oder vergleichbar).",
        "BOI-Bericht (Beneficial Ownership Information) korrekt von Anfang an eingereicht.",
      ],
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        { q: "Darf ein Nicht-Ansässiger legal eine LLC in New Mexico eröffnen?", a: "Ja. Sie müssen weder US-Staatsbürger noch dort steuerlich ansässig sein. Es ist die meistgewählte Option internationaler Unternehmer wegen dieser Flexibilität." },
        { q: "Muss ich US-Steuern zahlen, wenn ich im Ausland lebe?", a: "Wenn die LLC ein 'disregarded entity' (ein Nicht-Ansässiger als alleiniges Mitglied) ohne effektiv mit den USA verbundenes Einkommen (ECI) und ohne physische US-Präsenz ist, fällt normalerweise keine US-Bundeseinkommensteuer an. Hauptpflicht: jährlich Form 5472 + 1120 informatorisch einreichen." },
        { q: "Wie hoch sind die jährlichen Unterhaltskosten?", a: "Nur die Kosten des Registered Agent ab dem zweiten Jahr. New Mexico erhebt keinen Annual Report und keine Franchise Tax." },
        { q: "Kann ich meine bestehende LLC nach New Mexico verlegen?", a: "Ja, per 'Domestication' oder, je nach Fall, durch Auflösung der vorherigen Einheit und Neugründung. In der Erstberatung erläutern wir die passende Option." },
      ],
    },
    cta: {
      h2: "Bereit, Ihre New-Mexico-LLC zu gründen?",
      p: "Buchen Sie ein Gespräch: Wir bestätigen, ob New Mexico der richtige Bundesstaat ist, die realen Fristen und die Gesamtkosten ohne Überraschungen.",
      btn: "Beratung buchen",
      btnSecondary: "Alle Leistungen ansehen",
    },
    seo: {
      title: "New Mexico LLC: steueroptimiert für Selbstständige | Exentax",
      description: "Steueroptimiert für deutsche Selbstständige: keine State Income Tax, kein Jahresbericht und volle Gesellschafter-Anonymität. Mit EIN, Bank, BOI. Termin sichern.",
      keywords: "LLC New Mexico, LLC für Nicht-Ansässige, Digitalnomade LLC, LLC ohne Jahresbericht",
      ogTitle: "New-Mexico-LLC: echte Privatsphäre, minimaler Aufwand",
      ogDescription: "LLC in New Mexico ohne Jahresbericht, ohne Franchise Tax und mit echter Privatsphäre. EIN inklusive. Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
    },
    jsonLd: { name: "LLC-Gründung in New Mexico für Nicht-Ansässige", serviceType: "Unternehmensgründung / LLC-Formation" },
  },
  llcWy: {
    cardKicker: "LLC in Wyoming",
    cardTitle: "LLC in Wyoming: starke Privatsphäre und Vermögensschutz",
    cardDesc: "Der Referenz-Bundesstaat für alle, die Vermögensschutz, echtes Charging Order und maximale juristische Privatsphäre priorisieren.",
    breadcrumb: "LLC in Wyoming",
    hero: {
      kicker: "LLC IN WYOMING",
      h1: "Ihre LLC in Wyoming",
      h1green: "starke Privatsphäre und Vermögensschutz",
      subtitle: "Vermögensschutz nach US-Standard: Wyoming bietet den stärksten Charging-Order-Schild der USA (auch für Single-Member-LLCs) und maximale juristische Privatsphäre für die Gesellschafter.",
      ctaPrimary: "Beratung buchen",
      ctaWhatsapp: "Auf WhatsApp schreiben",
      waText: "Hallo, ich möchte eine LLC in Wyoming gründen. Können wir sprechen?",
    },
    intro: {
      kicker: "WARUM WYOMING",
      h2: "Der Bundesstaat mit dem stärksten rechtlichen Schutz für Mitglieder",
      paragraphs: [
        "Vermögensschutz nach US-Standard ist die Stärke Wyomings: erster Bundesstaat, der LLCs reguliert hat, mit einer Rechtsprechung, die sich zu einem der stärksten Vermögensschutz-Regime des Landes entwickelt hat — Charging Order Protection gilt auch für Single-Member-LLCs, bundesweit selten.",
        "Übliche Wahl für Investoren, persönliche Holdings und Unternehmer mit zu schützenden Vermögenswerten – also überall dort, wo Privatsphäre kein Bonus, sondern Voraussetzung ist.",
      ],
    },
    features: {
      h2: "Echte Vorteile einer Wyoming-LLC",
      items: [
        { title: "Charging Order Protection", desc: "Verstärkter gesetzlicher Schutz vor persönlichen Gläubigern des Mitglieds, auch bei Single-Member-LLCs." },
        { title: "Juristische Privatsphäre", desc: "Der Bundesstaat verlangt keine öffentliche Auflistung von Mitgliedern oder Managern in Gründungsdokumenten." },
        { title: "Günstige Rechtsprechung", desc: "Gerichte mit jahrzehntelanger pro-LLC-Praxis und klaren Regeln zur Trennung Person/Einheit." },
        { title: "Geringe Jahreskosten", desc: "Annual Report mit Mindestgebühr (60 $), berechnet auf in Wyoming belegene Vermögenswerte - für Nicht-Ansässige selten mehr." },
      ],
    },
    bestFor: {
      h2: "Passend für Sie, wenn...",
      items: [
        "Sie eine LLC als Vermögensschutz-Vehikel wünschen.",
        "Sie eine persönliche Holding betreiben oder Vermögenswerte halten werden.",
        "Sie wollen, dass ein persönlicher Rechtsstreit das LLC-Eigentum nicht erreicht.",
        "Sie eine Jurisdiktion mit konsolidierter, vorhersehbarer Rechtsprechung suchen.",
        "Sie maximale Privatsphäre ohne Verzicht auf saubere Struktur brauchen.",
      ],
    },
    whatsIncluded: {
      h2: "Was unser Service umfasst",
      items: [
        "LLC-Gründung in Wyoming mit Registered Agent für das erste Jahr.",
        "EIN-Beantragung beim IRS.",
        "Verstärktes Operating Agreement für Wyoming (Charging Order, Transfer Restrictions).",
        "Begleitung bei der Eröffnung eines US-Bankkontos.",
        "BOI-Bericht korrekt von Anfang an eingereicht.",
      ],
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        { q: "Wie unterscheidet sich Wyoming von New Mexico?", a: "New Mexico ist effizienter in Kosten und Wartung. Wyoming ist stärker in rechtlichem Schutz und Rechtsprechung. Priorität Vermögensschutz: Wyoming. Priorität minimaler Papierkram: New Mexico." },
        { q: "Ist eine Wyoming-LLC wirklich privat?", a: "Ja. Der Bundesstaat verlangt keine Veröffentlichung von Mitgliedern oder Managern. Der föderale BOI-Bericht identifiziert den wirtschaftlich Berechtigten gegenüber FinCEN, ist aber keine öffentliche Information." },
        { q: "Gibt es einen Jahresbericht?", a: "Ja, Wyoming verlangt einen Annual Report mit Mindestgebühr 60 $. Eine schnelle Formalität, die wir für Sie übernehmen." },
        { q: "Kann ich Wyoming mit einer anderen operativen LLC kombinieren?", a: "Ja. Übliche Struktur: Wyoming-Holding als alleiniges Mitglied einer operativen LLC in einem anderen Bundesstaat. In der Beratung sagen wir Ihnen, ob das in Ihrem Fall Mehrwert bringt." },
      ],
    },
    cta: {
      h2: "Bereit, Ihre Wyoming-LLC zu gründen?",
      p: "Buchen Sie ein Gespräch und wir prüfen gemeinsam, ob Wyoming die beste Jurisdiktion für Ihr Ziel ist: Vermögensschutz, persönliche Holding oder verstärkte Privatsphäre.",
      btn: "Beratung buchen",
      btnSecondary: "Alle Leistungen ansehen",
    },
    seo: {
      title: "Wyoming LLC: Vermögensschutz nach US-Standard | Exentax",
      description: "Vermögensschutz auf höchstem US-Niveau: exklusive Charging-Order-Regelung und gesellschafterfreundliche Rechtsprechung seit Jahrzehnten. Jetzt anfragen.",
      keywords: "LLC Wyoming, Asset Protection LLC, LLC Privatsphäre, LLC Nicht-Ansässige, Wyoming Holding",
      ogTitle: "Wyoming-LLC: bester US-Vermögensschutz",
      ogDescription: "Wyoming-LLC mit dem stärksten US-Vermögensschutz: Charging Order Protection und juristische Privatsphäre. Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
    },
    jsonLd: { name: "LLC-Gründung in Wyoming für Nicht-Ansässige", serviceType: "Unternehmensgründung / LLC-Formation" },
  },
  llcDe: {
    cardKicker: "LLC in Delaware",
    cardTitle: "LLC in Delaware: höchstes Renommee und investor-ready",
    cardDesc: "Der Standard für Startups, Finanzierungsrunden und B2B-Geschäfte, die die anerkannteste Jurisdiktion der Welt verlangen.",
    breadcrumb: "LLC in Delaware",
    hero: {
      kicker: "LLC IN DELAWARE",
      h1: "Ihre LLC in Delaware",
      h1green: "höchstes Renommee im Gesellschaftsrecht und Zugang zu Investoren",
      subtitle: "Rechtssicherheit für Investoren: Delaware ist die weltweit anerkannteste Jurisdiktion im Gesellschaftsrecht und der De-facto-Standard für Startups, Finanzierungsrunden und ernsthafte B2B-Verträge.",
      ctaPrimary: "Beratung buchen",
      ctaWhatsapp: "Auf WhatsApp schreiben",
      waText: "Hallo, ich möchte eine LLC in Delaware gründen. Können wir sprechen?",
    },
    intro: {
      kicker: "WARUM DELAWARE",
      h2: "Die Referenz-Jurisdiktion im Gesellschaftsrecht",
      paragraphs: [
        "Maximale Rechtssicherheit für Investoren liefert Delaware: über 65 % der Fortune-500-Unternehmen sind dort gegründet, und der Court of Chancery — auf Gesellschaftsrecht spezialisiert — bringt mehr als 200 Jahre Rechtsprechung und höchste Vorhersehbarkeit.",
        "Für Unternehmer, die externes Investment, institutionelle Partner oder US-Großkunden suchen, ist Delaware oft eine implizite Voraussetzung. Das Glaubwürdigkeitssignal ist anderswo schwer zu reproduzieren.",
      ],
    },
    features: {
      h2: "Warum Delaware der globale Standard ist",
      items: [
        { title: "Court of Chancery", desc: "Auf Gesellschaftsrecht spezialisiert, ohne Geschworene, mit Experten-Richtern. Schnelle, vorhersehbare Entscheidungen." },
        { title: "Investor-Standard", desc: "VC-Fonds und Business Angels erwarten standardmäßig eine Delaware-Einheit in ihren Term Sheets." },
        { title: "Vertragliche Flexibilität", desc: "Operating Agreement erlaubt komplexe Governance: Klassen von Membership Interests, Vesting, Drag-Along, Tag-Along." },
        { title: "Massive Rechtsprechung", desc: "Jahrzehnte veröffentlichter Fälle geben Sicherheit über die Auslegung praktisch jeder Klausel." },
      ],
    },
    bestFor: {
      h2: "Passend für Sie, wenn...",
      items: [
        "Sie Kapital aufnehmen oder einen US-Accelerator anstreben.",
        "Sie an Großunternehmen verkaufen, die Verträge mit einer Delaware-Einheit verlangen.",
        "Sie ein skalierbares Startup mit Flexibilität für künftige Runden bauen.",
        "Sie eine international anerkannte Jurisdiktion ohne Erklärungsbedarf wollen.",
        "Sie mehrere Partner oder Equity-Strukturen über die Single-Member-LLC hinaus haben werden.",
      ],
    },
    whatsIncluded: {
      h2: "Was unser Service umfasst",
      items: [
        "LLC-Gründung in Delaware mit Registered Agent für das erste Jahr.",
        "EIN-Beantragung beim IRS.",
        "Fortgeschrittenes Operating Agreement, vorbereitet für Investoren.",
        "Begleitung bei der Eröffnung eines US-Bankkontos.",
        "BOI-Bericht korrekt von Anfang an eingereicht.",
      ],
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        { q: "Unterschied zu Wyoming oder New Mexico?", a: "Delaware bringt Prestige und Kompatibilität mit institutionellen Investoren - bei höheren Wartungskosten (Franchise Tax 300 $/Jahr für LLCs). Wyoming priorisiert Vermögensschutz; New Mexico Effizienz und Privatsphäre." },
        { q: "Muss ich in Delaware Steuern zahlen, wenn ich dort nicht operiere?", a: "Die LLC zahlt die jährliche fixe Franchise Tax (300 $). Ohne dem Bundesstaat zurechenbares Einkommen fällt keine staatliche Einkommensteuer an. Bundespflichten wie bei jeder LLC eines Nicht-Ansässigen." },
        { q: "Gute Wahl für eine Single-Member-LLC?", a: "Wenn Ihr Plan kein externes Investment und keine Kunden vorsieht, die Delaware verlangen, ist es meist überdimensioniert. Dann sind New Mexico oder Wyoming effizienter." },
        { q: "Kann ich später in eine C-Corp umwandeln?", a: "Ja. Standardprozess in Delaware, üblich bei Startups, die eine Finanzierungsrunde erhalten." },
      ],
    },
    cta: {
      h2: "Bereit, Ihre Delaware-LLC zu gründen?",
      p: "Buchen Sie ein Gespräch: Wir validieren, ob Delaware die richtige Jurisdiktion für Ihr Modell ist - Startup, B2B oder investor-ready.",
      btn: "Beratung buchen",
      btnSecondary: "Alle Leistungen ansehen",
    },
    seo: {
      title: "Delaware LLC: Rechtssicherheit für Investoren | Exentax",
      description: "Maximale Rechtssicherheit für Wachstumsunternehmen: Delawares Court of Chancery, Series LLC und der Standard, den jeder US-Investor erwartet. Jetzt starten.",
      keywords: "LLC Delaware, Startup LLC, Investment LLC, Delaware Nicht-Ansässige, Corporate-Jurisdiktion",
      ogTitle: "Delaware-LLC: Maßstab für VC und ernstes B2B",
      ogDescription: "Delaware-LLC: Referenz-Jurisdiktion für Startups, Finanzierungsrunden und B2B-Verträge mit US-Firmen. Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
    },
    jsonLd: { name: "LLC-Gründung in Delaware für Nicht-Ansässige", serviceType: "Unternehmensgründung / LLC-Formation" },
  },
  llcFl: {
    cardKicker: "LLC in Florida",
    cardTitle: "LLC in Florida: reale Präsenz und hispanischer Markt",
    cardDesc: "Der richtige Bundesstaat, wenn Sie tatsächlich in den USA leben, reisen oder reale Kunden und Lieferanten haben werden, besonders in Miami.",
    breadcrumb: "LLC in Florida",
    hero: {
      kicker: "LLC IN FLORIDA",
      h1: "Ihre LLC in Florida",
      h1green: "reale Präsenz, hispanischer Markt und Geschäftsdynamik",
      subtitle: "Tor zum lateinamerikanischen Markt: Florida ist der natürliche Bundesstaat, wenn Sie häufig in die USA reisen, lokale Kunden haben oder ein Geschäft in Miami und in der hispanischen Community aufbauen.",
      ctaPrimary: "Beratung buchen",
      ctaWhatsapp: "Auf WhatsApp schreiben",
      waText: "Hallo, ich möchte eine LLC in Florida gründen. Können wir sprechen?",
    },
    intro: {
      kicker: "WARUM FLORIDA",
      h2: "Der Bundesstaat mit der stärksten realen Verbindung zur hispanischen Welt",
      paragraphs: [
        "Florida ist das Tor zum lateinamerikanischen Markt: hier lebt eine der größten und aktivsten hispanischen Communities der USA, und Miami fungiert als Finanz-, Handels- und Tech-Hub für Lateinamerika — eine LLC mit Florida-Adresse erleichtert Beziehungen zu Kunden, Lieferanten und Banken vor Ort.",
        "Übliche Wahl für Unternehmer, die wirklich US-Boden betreten, Räume mieten, lokal einstellen oder an US-Verbraucher verkaufen - im Gegensatz zu reinen 'Paper-States' wie New Mexico oder Wyoming.",
        "Zahlen für 2026 (Quelle: Florida Division of Corporations und Department of Revenue): Gründung ab 125 $, jährlicher Annual Report bis zum 1. Mai für 138,75 $ Pflicht, ein Registered Agent mit physischer Adresse in Florida ist verpflichtend, keine staatliche Einkommensteuer für natürliche Personen und ein staatlicher Sales-Tax-Basissatz von 6 %, sofern er anfällt.",
      ],
    },
    features: {
      h2: "Warum Florida für Spanischsprachige funktioniert",
      items: [
        { title: "Keine staatliche Einkommensteuer", desc: "Florida erhebt keine staatliche Einkommensteuer auf Privatpersonen. Für US-Steueransässige einer der effizientesten Bundesstaaten." },
        { title: "Hispanische Community und Banken", desc: "Banken, Dienstleister und Anbieter, die es gewohnt sind, mit spanischsprachigen Kunden und lateinamerikanischen Firmen zu arbeiten." },
        { title: "Hub für Lateinamerika", desc: "Miami ist die natürliche Brücke USA-LatAm: Direktflüge, Messen, Investoren und Acceleratoren mit Fokus auf den hispanischen Markt." },
        { title: "Geeignet für physische Präsenz", desc: "Wenn Sie ein Büro mieten, Mitarbeiter einstellen oder US-Kunden bedienen, vermeidet Florida die Kosten einer 'Foreign Qualification' im operativen Bundesstaat." },
      ],
    },
    bestFor: {
      h2: "Passend für Sie, wenn...",
      items: [
        "Sie in die USA reisen und mit echter Präsenz aus Miami operieren.",
        "Ihr Markt aus spanischsprachigen Kunden in den USA oder Lateinamerika besteht.",
        "Sie komfortable Bank- und Buchhaltungsbeziehungen auf Spanisch brauchen.",
        "Sie mittelfristig eine US-Steueransässigkeit oder ein US-Visum erwägen.",
        "Sie physische Produkte oder Dienstleistungen auf US-Territorium verkaufen.",
      ],
    },
    whatsIncluded: {
      h2: "Was unser Service umfasst",
      items: [
        "LLC-Gründung in Florida mit Registered Agent für das erste Jahr.",
        "EIN-Beantragung beim IRS.",
        "Operating Agreement angepasst an Ihre Mitgliederstruktur.",
        "Begleitung bei der Eröffnung eines US-Bankkontos, vor Ort oder online.",
        "BOI-Bericht korrekt von Anfang an eingereicht.",
      ],
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        { q: "Muss ich in Florida wohnen, um die LLC zu eröffnen?", a: "Nein. Jede Person, ansässig oder nicht, kann Mitglied einer Florida-LLC sein. Pflicht ist nur ein Registered Agent mit physischer Adresse im Bundesstaat." },
        { q: "Welche Steuern zahlt die LLC in Florida?", a: "Florida verlangt einen Annual Report (138,75 $/Jahr). Keine staatliche Einkommensteuer auf Privatpersonen. Die LLC zahlt Bundessteuern entsprechend ihrer Klassifikation und Sales Tax nur, wenn sie betroffene Waren/Dienstleistungen im Bundesstaat verkauft." },
        { q: "Gut für Amazon FBA oder E-Commerce?", a: "Ja, vor allem mit Lager in den USA oder mit lokalen Lieferanten. Die Nähe zu Lagern, Freight Forwardern und spanischsprachigen Banken ist ein echter operativer Vorteil." },
        { q: "Kann ich später von New Mexico zu Florida wechseln?", a: "Ja, per Domestication oder durch Neugründung in Florida. Wir beraten je nach Phase und Volumen." },
      ],
    },
    cta: {
      h2: "Bereit, Ihre Florida-LLC zu gründen?",
      p: "Buchen Sie ein Gespräch: Wir prüfen, ob Florida der richtige Bundesstaat ist, vor allem bei hispanischem Markt oder realer US-Präsenz.",
      btn: "Beratung buchen",
      btnSecondary: "Alle Leistungen ansehen",
    },
    seo: {
      title: "Florida LLC: Tor zum lateinamerikanischen Markt | Exentax",
      description: "Ihr Zugang zum lateinamerikanischen Markt über Miami: physische Präsenz, spanischsprachiges Banking und 0% State Income Tax. Mit EIN und BOI. Jetzt anfragen.",
      keywords: "LLC Florida, LLC Miami, LLC für Hispanics, Amazon FBA Florida LLC, Firma Florida gründen",
      ogTitle: "Florida-LLC: Ihr Tor zum Hispanic-Markt in Miami",
      ogDescription: "Florida-LLC mit realer Präsenz, Banking auf Spanisch und direktem Zugang zum Hispanic-Markt von Miami. Exentax: Ihre US-LLC einsatzbereit in 48 Stunden.",
    },
    jsonLd: { name: "LLC-Gründung in Florida für Spanischsprachige und Nicht-Ansässige", serviceType: "Unternehmensgründung / LLC-Formation" },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Holen Sie sich Ihre ITIN als Nicht-Ansässiger",
    cardDesc: "Ihre Individual Taxpayer Identification Number end-to-end abgewickelt über einen Certifying Acceptance Agent.",
    breadcrumb: "ITIN beantragen",
    hero: {
      kicker: "ITIN FÜR NICHT-ANSÄSSIGE",
      h1: "Holen Sie sich Ihre ITIN",
      h1green: "end-to-end, ohne Ihren Reisepass zu verschicken",
      subtitle: "Ohne Botschaftstermin und ohne Versand des Original-Reisepasses: Unser autorisierter Certifying Acceptance Agent reicht Ihre Individual Taxpayer Identification Number (ITIN) beim IRS ein — alles aus einer Hand.",
      ctaPrimary: "Beratung buchen",
      ctaWhatsapp: "Auf WhatsApp schreiben",
      waText: "Hallo, ich brauche meine ITIN. Können wir sprechen?",
    },
    intro: {
      kicker: "WAS DIE ITIN IST",
      h2: "Die US-Steuernummer für Personen ohne SSN",
      paragraphs: [
        "Ohne Botschaft und alles aus einer Hand: Die ITIN (Individual Taxpayer Identification Number) ist die vom IRS vergebene Steuernummer für Personen, die US-Steuererklärungen einreichen müssen, aber keinen Anspruch auf eine Social Security Number (SSN) haben. Unverzichtbar für viele Nicht-Ansässige mit LLC, US-Immobilieneinkünften oder Quellensteuern auf US-Plattformen.",
        "Der offizielle Weg verlangt entweder den Versand des Original-Reisepasses an den IRS oder die Validierung über einen Certifying Acceptance Agent (CAA). Wir arbeiten mit akkreditierten CAAs, damit Sie Ihren Pass nicht aus der Hand geben und kein Postrisiko tragen müssen.",
      ],
    },
    features: {
      h2: "So funktioniert unser ITIN-Service",
      items: [
        { title: "Ohne Reisepass-Versand", desc: "Validierung des Reisepasses über einen Certifying Acceptance Agent. Sie behalten das Original jederzeit." },
        { title: "Korrekte Begründung", desc: "Wir bereiten den gültigen Antragsgrund (Exception 1, 2, 3 oder beigefügte Erklärung) passend zu Ihrem Fall vor." },
        { title: "W-7 + voller Support", desc: "Ausgefülltes Formular W-7, CAA-Begleitschreiben und Belege bereit zur Einreichung beim IRS." },
        { title: "Echtes Follow-up", desc: "Begleitung von der Einreichung bis zum Erhalt der ITIN, inklusive Nachreichungen bei IRS-Rückfragen." },
      ],
    },
    bestFor: {
      h2: "Sie brauchen eine ITIN, wenn...",
      items: [
        "Sie eine US-LLC haben und die zugehörigen persönlichen Informationsformulare einreichen müssen.",
        "Sie Zahlungen von US-Plattformen erhalten, die mangels ITIN 30 % Quellensteuer einbehalten.",
        "Sie US-Immobilieneinkünfte oder Kapitalgewinne haben (Form 1040-NR).",
        "Sie Begünstigter eines Trusts oder einer Partnership mit US-Steuerpräsenz sind.",
        "Sie ein IRS-Schreiben mit Aufforderung zur Steuernummer erhalten haben.",
      ],
    },
    whatsIncluded: {
      h2: "Was unser Service umfasst",
      items: [
        "Analyse Ihres Antragsgrunds (anwendbare Exception und Belege).",
        "Reisepass-Verifizierung über einen vom IRS autorisierten Certifying Acceptance Agent.",
        "Vorbereitung und Prüfung von Form W-7 und CAA-Begleitschreiben.",
        "Versand der vollständigen Akte an den IRS mit Tracking-Nummer.",
        "Begleitung bis zum Erhalt der ITIN.",
      ],
    },
    faq: {
      h2: "Häufige Fragen",
      items: [
        { q: "Wie lange braucht der IRS für die ITIN?", a: "Aktuell offiziell 8 bis 11 Wochen ab Aktenerhalt, je nach IRS-Auslastung. Die Mitteilung kommt per Post an die im W-7 angegebene Adresse." },
        { q: "Muss ich für die ITIN in die USA reisen?", a: "Nein. Mit einem Certifying Acceptance Agent erledigen Sie alles bequem aus Ihrem Wohnsitzland." },
        { q: "Läuft die ITIN ab?", a: "Ja. Die ITIN verfällt, wenn sie drei aufeinanderfolgende Jahre nicht in einer Steuererklärung verwendet wird, oder gemäß dem IRS-Erneuerungsplan. Dann ist eine Erneuerung nötig." },
        { q: "Kann ich mit der ITIN ein privates Bankkonto eröffnen?", a: "Manche Institute akzeptieren sie, vor allem bei klarem US-Bezug (LLC, Immobilien, Teilansässigkeit). Sie ersetzt keine SSN, öffnet aber Türen, die ohne ITIN verschlossen blieben." },
      ],
    },
    cta: {
      h2: "Bereit, Ihre ITIN zu beantragen?",
      p: "Buchen Sie ein Gespräch: Wir prüfen Antragsgrund, nötige Unterlagen und realistische Fristen gemeinsam mit einem Certifying Acceptance Agent.",
      btn: "Beratung buchen",
      btnSecondary: "Alle Leistungen ansehen",
    },
    seo: {
      title: "ITIN ohne Botschaft: alles aus einer Hand erledigt | Exentax",
      description: "Kein Botschaftstermin, kein Reisepassversand: unser Certifying Acceptance Agent reicht Ihre ITIN beim IRS ein und begleitet Sie bis zur Vergabe. Termin sichern.",
      keywords: "ITIN, ITIN beantragen, ITIN Nicht-Ansässige, Certifying Acceptance Agent, W-7, IRS Steuernummer",
      ogTitle: "ITIN ohne USA-Reise: wir erledigen es für Sie",
      ogDescription: "Wir wickeln Ihre ITIN beim IRS mit einem Certifying Acceptance Agent ab – ohne Reisepass-Versand. Steuerberater Exentax für nicht-ansässige LLC-Inhaber.",
    },
    jsonLd: { name: "ITIN-Bearbeitung beim IRS für Nicht-Ansässige", serviceType: "Steuerservice / Beantragung Steuernummer" },
  },
};

// ===== PORTUGUÊS =====
const pt: SubpagesBase = {
  llcNm: {
    cardKicker: "LLC no Novo México",
    cardTitle: "LLC no Novo México: discreta, eficiente e sem relatório anual",
    cardDesc: "O estado mais usado por nómadas digitais: zero imposto estadual sobre a LLC, sem relatório anual e privacidade real.",
    breadcrumb: "LLC no Novo México",
    hero: {
      kicker: "LLC NO NOVO MÉXICO",
      h1: "Sua LLC no Novo México",
      h1green: "discreta, sem relatórios e a custo mínimo",
      subtitle: "Estrutura enxuta e barata: uma LLC americana sem relatório anual, sem franchise tax e com privacidade real dos sócios — a opção mais leve para freelancers e nómadas digitais brasileiros.",
      ctaPrimary: "Agendar consultoria",
      ctaWhatsapp: "Falar pelo WhatsApp",
      waText: "Olá, quero abrir uma LLC no Novo México. Podemos conversar?",
    },
    intro: {
      kicker: "POR QUE NOVO MÉXICO",
      h2: "O estado mais eficiente para uma LLC unipessoal",
      paragraphs: [
        "Estrutura enxuta e barata: por isso o Novo México é hoje o estado mais usado por freelancers, agências remotas e criadores de conteúdo que vivem fora dos Estados Unidos — não exige relatório anual, não cobra franchise tax e permite não listar publicamente os membros da LLC.",
        "Para um não residente que fatura serviços do exterior, isso se traduz em uma estrutura legal real, com EIN e conta bancária americana, mantendo o custo anual ao mínimo e evitando burocracia recorrente.",
      ],
    },
    features: {
      h2: "Por que os nómadas digitais escolhem o Novo México",
      items: [
        { title: "Sem relatório anual", desc: "Após constituída, sem Annual Report no estado. Menos papelada, menos risco de esquecimento, menos custo recorrente." },
        { title: "Sem franchise tax estadual", desc: "Novo México não aplica imposto sobre o capital nem taxa anual de manutenção sobre a LLC." },
        { title: "Privacidade real dos membros", desc: "Os nomes dos membros não aparecem no registo público estadual quando a LLC é constituída corretamente com agente registado." },
        { title: "Manutenção mínima", desc: "Basta manter um agente registado no estado e cumprir as obrigações federais (BOI/CTA e declaração federal conforme o caso)." },
      ],
    },
    bestFor: {
      h2: "É para si se...",
      items: [
        "É freelancer ou consultor remoto faturando para clientes fora dos EUA.",
        "Quer uma estrutura limpa, barata de manter e sem papelada estadual recorrente.",
        "Faz questão de que seu nome não apareça publicamente no registo da LLC.",
        "Opera como nómada digital e precisa de uma entidade legal com EIN e conta bancária.",
        "Não tem empregados nem escritórios físicos nos Estados Unidos.",
      ],
    },
    whatsIncluded: {
      h2: "O que inclui o nosso serviço",
      items: [
        "Constituição completa da LLC no Novo México com agente registado no primeiro ano.",
        "Solicitação e obtenção do EIN junto ao IRS.",
        "Operating Agreement personalizado para LLC unipessoal ou multimembro.",
        "Acompanhamento para abrir conta bancária americana (Mercury, Relay ou equivalente).",
        "Relatório BOI (Beneficial Ownership Information) apresentado corretamente desde o início.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "É legal para um não residente abrir uma LLC no Novo México?", a: "Sim. Não é preciso ser cidadão nem residente fiscal dos EUA para ser membro de uma LLC no Novo México. É a opção mais usada por empreendedores internacionais justamente por essa flexibilidade." },
        { q: "Tenho que pagar impostos nos EUA se vivo fora?", a: "Se a LLC é 'disregarded entity' (um único membro não residente) sem atividade económica conectada aos EUA (ECI) nem presença física, normalmente não gera imposto federal. A obrigação principal é apresentar os formulários 5472 + 1120 informativos a cada ano." },
        { q: "Quanto custa manter a LLC por ano?", a: "Apenas o custo do agente registado a partir do segundo ano. Novo México não cobra relatório anual nem franchise tax, por isso é o estado mais eficiente em manutenção." },
        { q: "Posso transferir minha LLC atual para o Novo México?", a: "Sim, por meio de domesticação ou, em alguns casos, dissolvendo a entidade anterior e constituindo uma nova. Na consultoria inicial explicamos a melhor opção." },
      ],
    },
    cta: {
      h2: "Pronto para constituir sua LLC no Novo México?",
      p: "Agende uma chamada e confirmamos se Novo México é o estado certo, prazos reais e custo total sem surpresas.",
      btn: "Agendar consultoria",
      btnSecondary: "Ver todos os serviços",
    },
    seo: {
      title: "LLC no Novo México: estrutura enxuta e barata | Exentax",
      description: "A LLC americana mais enxuta para freelancers brasileiros: sem relatório anual, sem franchise tax e com anonimato real. EIN, banco e BOI inclusos. Comece hoje.",
      keywords: "LLC Novo México, LLC para não residentes, abrir LLC nómada digital, LLC sem relatório anual",
      ogTitle: "LLC Novo México: privacidade real e custo mínimo",
      ogDescription: "LLC no Novo México sem relatório anual, sem franchise tax e com privacidade real. EIN, banco e BOI. Exentax: constituição, banca e compliance da sua LLC.",
    },
    jsonLd: { name: "Constituição de LLC no Novo México para não residentes", serviceType: "Constituição de sociedade / Formação de LLC" },
  },
  llcWy: {
    cardKicker: "LLC no Wyoming",
    cardTitle: "LLC no Wyoming: privacidade forte e proteção patrimonial",
    cardDesc: "O estado de referência para quem prioriza blindagem patrimonial, charging order e máxima privacidade legal.",
    breadcrumb: "LLC no Wyoming",
    hero: {
      kicker: "LLC NO WYOMING",
      h1: "Sua LLC no Wyoming",
      h1green: "privacidade forte e proteção patrimonial",
      subtitle: "Blindagem patrimonial premium: Wyoming entrega o charging order mais forte dos EUA (também para LLCs unipessoais) e máxima privacidade legal para os sócios.",
      ctaPrimary: "Agendar consultoria",
      ctaWhatsapp: "Falar pelo WhatsApp",
      waText: "Olá, quero abrir uma LLC no Wyoming. Podemos conversar?",
    },
    intro: {
      kicker: "POR QUE WYOMING",
      h2: "O estado com a maior proteção legal aos membros",
      paragraphs: [
        "Blindagem patrimonial premium é o que diferencia Wyoming: foi o primeiro estado a regulamentar LLCs nos EUA e sua jurisprudência evoluiu para uma das proteções patrimoniais mais fortes do país, com charging order que se aplica também a LLCs unipessoais — algo raro a nível federal.",
        "É a opção habitual para investidores, holdings pessoais, empreendedores com ativos a proteger e estruturas em que a privacidade é requisito, não bônus.",
      ],
    },
    features: {
      h2: "Vantagens reais de constituir no Wyoming",
      items: [
        { title: "Charging order protection", desc: "Proteção reforçada por lei estadual frente a credores pessoais do membro, inclusive para LLCs unipessoais." },
        { title: "Privacidade legal", desc: "O estado não exige listar publicamente membros nem managers nos documentos de constituição." },
        { title: "Jurisprudência favorável", desc: "Tribunais com décadas de casos pró-LLC e regras claras a favor da separação entre pessoa e entidade." },
        { title: "Custo anual contido", desc: "Annual Report com taxa mínima (US$ 60) calculada sobre ativos no Wyoming, raramente mais para não residentes." },
      ],
    },
    bestFor: {
      h2: "É para si se...",
      items: [
        "Quer uma LLC pensada como veículo de proteção patrimonial.",
        "Vai operar uma holding pessoal ou ter ativos dentro da entidade.",
        "Quer garantir que um litígio pessoal não atinja a propriedade da LLC.",
        "Busca jurisdição com jurisprudência consolidada e previsível.",
        "Precisa de máxima privacidade sem renunciar a uma estrutura limpa.",
      ],
    },
    whatsIncluded: {
      h2: "O que inclui o nosso serviço",
      items: [
        "Constituição da LLC no Wyoming com agente registado no primeiro ano.",
        "Solicitação e obtenção do EIN junto ao IRS.",
        "Operating Agreement reforçado adaptado ao Wyoming (charging order, transfer restrictions).",
        "Acompanhamento para abrir conta bancária americana.",
        "Relatório BOI apresentado corretamente desde o início.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "Qual a diferença entre Wyoming e Novo México?", a: "Novo México é a opção mais eficiente em custo e manutenção. Wyoming é a opção mais forte em proteção legal. Se sua prioridade é blindagem patrimonial, Wyoming; se é mínimo papelório, Novo México." },
        { q: "Uma LLC no Wyoming é mesmo privada?", a: "Sim. O estado não exige publicar membros nem managers. O reporte BOI federal identifica o beneficiário real perante o FinCEN, mas não é informação pública." },
        { q: "Tem relatório anual?", a: "Sim, Wyoming exige Annual Report com taxa mínima de US$ 60. É um trâmite rápido que também gerenciamos." },
        { q: "Posso combinar Wyoming com outra LLC operacional?", a: "Sim. Estrutura comum: holding em Wyoming como membro único de uma LLC operacional em outro estado. Na consultoria indicamos se agrega valor no seu caso." },
      ],
    },
    cta: {
      h2: "Pronto para constituir sua LLC no Wyoming?",
      p: "Agende uma chamada: revisamos juntos se Wyoming é a melhor jurisdição para seu objetivo - proteção patrimonial, holding pessoal ou privacidade reforçada.",
      btn: "Agendar consultoria",
      btnSecondary: "Ver todos os serviços",
    },
    seo: {
      title: "LLC no Wyoming: blindagem patrimonial premium | Exentax",
      description: "Blindagem patrimonial premium dos EUA: charging order exclusiva, jurisprudência consolidada e anonimato societário para seus ativos. Fale com especialista.",
      keywords: "LLC Wyoming, asset protection LLC, LLC privacidade, LLC para não residentes, holding Wyoming",
      ogTitle: "LLC Wyoming: máxima proteção patrimonial nos EUA",
      ogDescription: "LLC no Wyoming com a maior proteção patrimonial dos EUA: charging order e privacidade legal. Exentax acompanha a sua LLC, do diagnóstico ao dia a dia.",
    },
    jsonLd: { name: "Constituição de LLC no Wyoming para não residentes", serviceType: "Constituição de sociedade / Formação de LLC" },
  },
  llcDe: {
    cardKicker: "LLC em Delaware",
    cardTitle: "LLC em Delaware: prestígio corporativo e investidores",
    cardDesc: "O padrão para startups, rodadas de investimento e operações B2B que exigem a jurisdição mais reconhecida do mundo.",
    breadcrumb: "LLC em Delaware",
    hero: {
      kicker: "LLC EM DELAWARE",
      h1: "Sua LLC em Delaware",
      h1green: "prestígio corporativo e acesso a investidores",
      subtitle: "Pronta para investidores e M&A: Delaware é a jurisdição mais reconhecida do mundo em direito societário e o padrão de facto para startups, rodadas de investimento e contratos B2B sérios.",
      ctaPrimary: "Agendar consultoria",
      ctaWhatsapp: "Falar pelo WhatsApp",
      waText: "Olá, quero abrir uma LLC em Delaware. Podemos conversar?",
    },
    intro: {
      kicker: "POR QUE DELAWARE",
      h2: "A jurisdição de referência em direito societário",
      paragraphs: [
        "Uma LLC pronta para investidores e M&A nos EUA passa por Delaware: mais de 65% das empresas Fortune 500 estão constituídas lá, e a Court of Chancery — tribunal especializado em direito societário — soma mais de 200 anos de jurisprudência e previsibilidade máxima.",
        "Para empreendedores que buscam investimento externo, parceiros institucionais ou clientes corporativos nos EUA, Delaware costuma ser requisito implícito. O sinal de credibilidade é difícil de reproduzir em outro estado.",
      ],
    },
    features: {
      h2: "Por que Delaware é o padrão global",
      items: [
        { title: "Court of Chancery", desc: "Tribunal especializado em direito corporativo, sem júri e com juízes especialistas. Decisões rápidas e previsíveis." },
        { title: "Padrão para investidores", desc: "Fundos de venture capital e business angels esperam, por padrão, uma entidade em Delaware nos seus term sheets." },
        { title: "Flexibilidade contratual", desc: "Operating Agreement permite governança complexa: classes de membership interests, vesting, drag-along, tag-along." },
        { title: "Jurisprudência massiva", desc: "Décadas de casos publicados que dão certeza sobre a interpretação de praticamente qualquer cláusula." },
      ],
    },
    bestFor: {
      h2: "É para si se...",
      items: [
        "Pretende levantar capital ou entrar em uma aceleradora baseada nos EUA.",
        "Vende para empresas grandes que exigem contrato com entidade em Delaware.",
        "Está a construir uma startup escalável e quer flexibilidade para futuras rodadas.",
        "Quer uma jurisdição reconhecida internacionalmente, sem justificativas.",
        "Vai ter vários sócios ou estruturas de equity além da LLC unipessoal.",
      ],
    },
    whatsIncluded: {
      h2: "O que inclui o nosso serviço",
      items: [
        "Constituição da LLC em Delaware com agente registado no primeiro ano.",
        "Solicitação e obtenção do EIN junto ao IRS.",
        "Operating Agreement avançado preparado para investidores.",
        "Acompanhamento para abrir conta bancária americana.",
        "Relatório BOI apresentado corretamente desde o início.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "Qual a diferença entre Delaware, Wyoming e Novo México?", a: "Delaware traz prestígio e compatibilidade com investidores institucionais, em troca de maior custo de manutenção (Franchise Tax fixa de US$ 300/ano). Wyoming prioriza proteção patrimonial; Novo México, eficiência e privacidade." },
        { q: "Tenho que pagar impostos em Delaware se não opero lá?", a: "A LLC paga a Franchise Tax fixa anual (US$ 300), mas se não gerar receita atribuível ao estado, não paga income tax estadual. As obrigações federais são as mesmas de qualquer LLC de não residentes." },
        { q: "É boa opção para LLC unipessoal?", a: "Se seu plano não inclui investimento externo nem clientes que exigem Delaware, costuma ser excessivo. Para esses casos, Novo México ou Wyoming costumam ser mais eficientes." },
        { q: "Posso converter mais tarde minha LLC em C-Corp?", a: "Sim. É uma conversão padrão em Delaware e é comum quando uma startup recebe rodada de investimento." },
      ],
    },
    cta: {
      h2: "Pronto para constituir sua LLC em Delaware?",
      p: "Agende uma chamada: validamos se Delaware é a jurisdição certa para seu modelo - startup, B2B ou estrutura preparada para investimento.",
      btn: "Agendar consultoria",
      btnSecondary: "Ver todos os serviços",
    },
    seo: {
      title: "LLC em Delaware: pronta para investidores e M&A | Exentax",
      description: "A jurisdição esperada por VCs, anjos e compradores B2B nos EUA: Court of Chancery e Series LLC para founders que vão captar. Fale com um especialista.",
      keywords: "LLC Delaware, LLC startup, LLC investimento, Delaware para não residentes, jurisdição corporativa",
      ogTitle: "LLC Delaware: referência para VCs e B2B sério",
      ogDescription: "LLC em Delaware: jurisdição de referência para startups, rodadas de investimento e contratos B2B. Exentax: constituição, banca e compliance da sua LLC.",
    },
    jsonLd: { name: "Constituição de LLC em Delaware para não residentes", serviceType: "Constituição de sociedade / Formação de LLC" },
  },
  llcFl: {
    cardKicker: "LLC na Flórida",
    cardTitle: "LLC na Flórida: presença real e mercado hispânico",
    cardDesc: "O estado ideal quando vai morar, viajar ou ter clientes e fornecedores reais nos EUA, especialmente em Miami.",
    breadcrumb: "LLC na Flórida",
    hero: {
      kicker: "LLC NA FLÓRIDA",
      h1: "Sua LLC na Flórida",
      h1green: "presença real, mercado hispânico e dinâmica de negócios",
      subtitle: "Sua ponte para o mercado de Miami: a Flórida é o estado natural quando viaja com frequência aos EUA, tem clientes locais ou está a construir um negócio com base em Miami e na comunidade hispânica.",
      ctaPrimary: "Agendar consultoria",
      ctaWhatsapp: "Falar pelo WhatsApp",
      waText: "Olá, quero abrir uma LLC na Flórida. Podemos conversar?",
    },
    intro: {
      kicker: "POR QUE FLÓRIDA",
      h2: "O estado com mais conexão real com o mundo hispânico",
      paragraphs: [
        "A Flórida é a ponte direta para o mercado de Miami: concentra uma das maiores e mais ativas comunidades hispânicas dos EUA, e Miami funciona como hub financeiro, comercial e tecnológico para a América Latina — ter uma LLC com endereço na Flórida facilita relações com clientes, fornecedores e bancos locais.",
        "É a opção habitual para empreendedores que de facto pisam em solo americano, alugam um espaço, contratam localmente ou vendem a consumidores nos EUA, em contraste com estados puramente 'de papel' como Novo México ou Wyoming.",
        "Números 2026 (fonte: Florida Division of Corporations e Department of Revenue): constituição a partir de 125 $, Annual Report obrigatório até 1 de maio de cada ano por 138,75 $, agente registado com morada física na Flórida obrigatório, 0 % de imposto estadual sobre o rendimento das pessoas singulares e uma taxa-base estadual de sales tax de 6 % quando aplicável.",
      ],
    },
    features: {
      h2: "Por que a Flórida funciona para falantes de espanhol",
      items: [
        { title: "Sem imposto estadual sobre a renda pessoal", desc: "A Flórida não aplica state income tax sobre pessoas físicas. Para residentes fiscais nos EUA é um dos estados mais eficientes." },
        { title: "Comunidade hispânica e bancarização", desc: "Bancos, profissionais e fornecedores acostumados a atender clientes hispano-falantes e empresas latino-americanas." },
        { title: "Hub para a América Latina", desc: "Miami é a ponte natural EUA-LatAm: voos diretos, feiras, investidores e aceleradoras focadas no mercado hispânico." },
        { title: "Adequada para presença física", desc: "Se vai alugar escritório, contratar funcionários ou atender clientes nos EUA, a Flórida evita o custo de registar uma LLC estrangeira no estado onde realmente opera." },
      ],
    },
    bestFor: {
      h2: "É para si se...",
      items: [
        "Vai viajar aos EUA e operar a partir de Miami com presença real.",
        "Seu mercado é de clientes hispano-falantes nos EUA ou na América Latina.",
        "Precisa de relação bancária e contábil cômoda em espanhol.",
        "Está a considerar residência fiscal ou visto nos EUA no médio prazo.",
        "Vende produtos ou serviços físicos em território americano.",
      ],
    },
    whatsIncluded: {
      h2: "O que inclui o nosso serviço",
      items: [
        "Constituição da LLC na Flórida com agente registado no primeiro ano.",
        "Solicitação e obtenção do EIN junto ao IRS.",
        "Operating Agreement adaptado à sua estrutura de sócios.",
        "Acompanhamento para abrir conta bancária americana, presencial ou online.",
        "Relatório BOI apresentado corretamente desde o início.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "Tenho que viver na Flórida para abrir a LLC?", a: "Não. Qualquer pessoa, residente ou não, pode ser membro de uma LLC na Flórida. A única obrigação é manter um agente registado com endereço físico no estado." },
        { q: "Que impostos a LLC paga na Flórida?", a: "A Flórida exige Annual Report (US$ 138,75) por ano. Não há state income tax para pessoas físicas. A LLC paga impostos federais conforme sua classificação e sales tax apenas se vender bens/serviços sujeitos a esse imposto no estado." },
        { q: "É boa para Amazon FBA ou e-commerce?", a: "Sim, especialmente se vai ter stock nos EUA ou trabalhar com fornecedores locais. A proximidade com armazéns, freight forwarders e bancos em espanhol é uma vantagem operacional real." },
        { q: "Posso mudar de Novo México para Flórida depois?", a: "Sim, via domesticação ou constituindo uma nova entidade na Flórida. Orientamos na consultoria conforme sua fase e volume." },
      ],
    },
    cta: {
      h2: "Pronto para constituir sua LLC na Flórida?",
      p: "Agende uma chamada: revisamos se a Flórida é o estado certo, especialmente se seu mercado é hispânico ou se vai ter presença real nos EUA.",
      btn: "Agendar consultoria",
      btnSecondary: "Ver todos os serviços",
    },
    seo: {
      title: "LLC na Flórida: ponte para o mercado de Miami | Exentax",
      description: "Sua ponte para o mercado hispano de Miami com presença real, banco em português e dolarização da receita americana. Inclui EIN e BOI. Agende sua chamada.",
      keywords: "LLC Flórida, LLC Miami, LLC para hispânicos, LLC Amazon FBA Flórida, abrir empresa Flórida",
      ogTitle: "LLC Flórida: a sua porta para o mercado hispânico",
      ogDescription: "LLC na Flórida com presença real, banco em espanhol e conexão direta com o mercado hispânico de Miami. Exentax: constituição, banca e compliance da sua LLC.",
    },
    jsonLd: { name: "Constituição de LLC na Flórida para falantes de espanhol e não residentes", serviceType: "Constituição de sociedade / Formação de LLC" },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Obtenha seu ITIN como não residente",
    cardDesc: "Seu Individual Taxpayer Identification Number gerido de ponta a ponta com um Certifying Acceptance Agent.",
    breadcrumb: "Obtenha seu ITIN",
    hero: {
      kicker: "ITIN PARA NÃO RESIDENTES",
      h1: "Obtenha seu ITIN",
      h1green: "de ponta a ponta, sem enviar seu passaporte pelo correio",
      subtitle: "Sem viajar aos EUA e sem enviar o passaporte original: nosso Certifying Acceptance Agent autorizado tramita o seu Individual Taxpayer Identification Number (ITIN) junto ao IRS de ponta a ponta.",
      ctaPrimary: "Agendar consultoria",
      ctaWhatsapp: "Falar pelo WhatsApp",
      waText: "Olá, preciso obter meu ITIN. Podemos conversar?",
    },
    intro: {
      kicker: "O QUE É O ITIN",
      h2: "O número fiscal americano para quem não tem SSN",
      paragraphs: [
        "Sem viajar aos EUA: o ITIN (Individual Taxpayer Identification Number) é o número fiscal emitido pelo IRS a pessoas obrigadas a apresentar declarações ou formulários fiscais nos EUA, mas que não se qualificam para um Social Security Number (SSN). É indispensável para muitos não residentes com LLC, renda imobiliária ou retenções em plataformas americanas.",
        "O processo oficial exige enviar o passaporte original ao IRS ou validá-lo via Certifying Acceptance Agent (CAA). Trabalhamos com CAAs credenciados para que não tenha que se desfazer do passaporte nem assumir o risco postal.",
      ],
    },
    features: {
      h2: "Como funciona o nosso serviço de ITIN",
      items: [
        { title: "Sem enviar o passaporte", desc: "Validação do passaporte por meio de Certifying Acceptance Agent. mantém o original o tempo todo." },
        { title: "Justificativa correta", desc: "Preparamos o motivo válido (Exception 1, 2, 3 ou declaração associada) conforme seu caso real." },
        { title: "W-7 + suporte completo", desc: "Formulário W-7 preenchido, carta do CAA e documentação de respaldo prontos para envio ao IRS." },
        { title: "Acompanhamento real", desc: "Suporte da apresentação até a recepção do ITIN, incluindo reenvios se o IRS solicitar esclarecimentos." },
      ],
    },
    bestFor: {
      h2: "precisa de ITIN se...",
      items: [
        "Tem uma LLC nos EUA e deve apresentar formulários informativos pessoais associados.",
        "Recebe pagamentos de plataformas americanas com retenção de 30% por falta de ITIN.",
        "Tem renda imobiliária ou ganhos de capital nos EUA (formulário 1040-NR).",
        "É beneficiário de trust ou partnership com presença fiscal nos EUA.",
        "Recebeu uma carta do IRS pedindo um número fiscal individual.",
      ],
    },
    whatsIncluded: {
      h2: "O que inclui o nosso serviço",
      items: [
        "Análise do seu motivo (Exception aplicável e documentação de respaldo).",
        "Verificação do passaporte por Certifying Acceptance Agent autorizado pelo IRS.",
        "Preparação e revisão do formulário W-7 e da carta de respaldo do CAA.",
        "Envio do dossiê completo ao IRS com número de rastreio.",
        "Acompanhamento até a recepção do ITIN.",
      ],
    },
    faq: {
      h2: "Perguntas frequentes",
      items: [
        { q: "Quanto o IRS demora para emitir o ITIN?", a: "O prazo oficial atual é de 8 a 11 semanas a partir do recebimento do dossiê, podendo variar conforme a carga do IRS. Notificação por carta no endereço indicado no W-7." },
        { q: "Tenho que viajar aos EUA para obtê-lo?", a: "Não. Trabalhando com um Certifying Acceptance Agent faz tudo à distância desde seu país de residência." },
        { q: "O ITIN expira?", a: "Sim. Expira se não for usado em uma declaração fiscal por três anos consecutivos, ou conforme o cronograma de renovação do IRS. Nesses casos, deve ser renovado." },
        { q: "Posso abrir conta bancária pessoal com o ITIN?", a: "Algumas instituições aceitam, especialmente para clientes com vínculo com os EUA (LLC, imóvel, residência parcial). Não substitui o SSN, mas abre portas que sem ITIN ficam fechadas." },
      ],
    },
    cta: {
      h2: "Pronto para tramitar seu ITIN?",
      p: "Agende uma chamada: revisamos seu caso (motivo, documentação e prazos reais) com um Certifying Acceptance Agent.",
      btn: "Agendar consultoria",
      btnSecondary: "Ver todos os serviços",
    },
    seo: {
      title: "ITIN sem viajar aos EUA: tudo gerido por nós | Exentax",
      description: "Evite o consulado e o envio do passaporte original: nosso Certifying Acceptance Agent registra seu ITIN no IRS e acompanha até a emissão. Solicite orçamento.",
      keywords: "ITIN, obter ITIN, ITIN para não residentes, Certifying Acceptance Agent, W-7, número fiscal IRS",
      ogTitle: "ITIN sem viajar aos EUA: tratamos disso por si",
      ogDescription: "Tramitamos seu ITIN no IRS com Certifying Acceptance Agent: sem enviar o passaporte original. Exentax acompanha a sua LLC, do diagnóstico ao dia a dia.",
    },
    jsonLd: { name: "Tramitação de ITIN junto ao IRS para não residentes", serviceType: "Serviço fiscal / Obtenção de número de identificação fiscal" },
  },
};

// ===== CATALÀ =====
const ca: SubpagesBase = {
  llcNm: {
    cardKicker: "LLC a Nou Mèxic",
    cardTitle: "LLC a Nou Mèxic: discreta, eficient i sense informe anual",
    cardDesc: "L'estat més usat per nòmades digitals: zero impost estatal sobre la LLC, sense informe anual i amb privacitat real.",
    breadcrumb: "LLC a Nou Mèxic",
    hero: {
      kicker: "LLC A NOU MÈXIC",
      h1: "La teva LLC a Nou Mèxic",
      h1green: "discreta, sense informes i a cost mínim",
      subtitle: "Cost mínim i sense paperasses: una LLC dels EUA sense informe anual, sense franchise tax i amb privacitat real per als membres — l'estructura més lleugera per a autònoms i nòmades digitals.",
      ctaPrimary: "Agendar assessoria",
      ctaWhatsapp: "Parlar per WhatsApp",
      waText: "Hola, vull obrir una LLC a Nou Mèxic. Podem parlar?",
    },
    intro: {
      kicker: "PER QUÈ NOU MÈXIC",
      h2: "L'estat més eficient per a una LLC unipersonal",
      paragraphs: [
        "Cost mínim i sense paperasses recurrents: per això Nou Mèxic s'ha convertit en l'estat més usat per freelancers, agències remotes i creadors de contingut que viuen fora dels Estats Units — no exigeix informe anual, no cobra franchise tax i permet no llistar públicament els membres de la LLC.",
        "Per a un no resident que factura serveis des de l'estranger, això es tradueix en una estructura legal real, amb EIN i compte bancari nord-americà, mantenint el cost anual al mínim i evitant burocràcia recurrent.",
      ],
    },
    features: {
      h2: "Per què els nòmades digitals trien Nou Mèxic",
      items: [
        { title: "Sense informe anual", desc: "Un cop constituïda, no cal presentar Annual Report a l'estat. Menys paperassa, menys risc d'oblit, menys cost recurrent." },
        { title: "Sense franchise tax estatal", desc: "Nou Mèxic no aplica impost sobre el capital ni taxa anual de manteniment sobre la LLC." },
        { title: "Privacitat real dels membres", desc: "Els noms dels membres no apareixen al registre públic estatal quan es constitueix correctament amb agent registrat." },
        { title: "Manteniment mínim", desc: "Només cal mantenir un agent registrat a l'estat i complir les obligacions federals (BOI/CTA i declaració federal segons el cas)." },
      ],
    },
    bestFor: {
      h2: "És per a tu si...",
      items: [
        "Ets freelance o consultor remot facturant a clients fora dels EUA.",
        "Vols una estructura neta, barata de mantenir i sense paperassa estatal recurrent.",
        "Vols que el teu nom no aparegui públicament al registre de la LLC.",
        "Operes com a nòmada digital i necessites una entitat legal amb EIN i compte bancari.",
        "No tens empleats ni oficines físiques als Estats Units.",
      ],
    },
    whatsIncluded: {
      h2: "Què inclou el nostre servei",
      items: [
        "Constitució completa de la LLC a Nou Mèxic amb agent registrat el primer any.",
        "Sol·licitud i obtenció de l'EIN davant l'IRS.",
        "Operating Agreement personalitzat per a LLC unipersonal o multimembre.",
        "Acompanyament per obrir compte bancari nord-americà (Mercury, Relay o equivalent).",
        "Informe BOI (Beneficial Ownership Information) presentat correctament des de l'inici.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "És legal per a un no resident obrir una LLC a Nou Mèxic?", a: "Sí. No cal ser ciutadà ni resident fiscal dels EUA per ser membre d'una LLC a Nou Mèxic. És l'opció més utilitzada per emprenedors internacionals precisament per aquesta flexibilitat." },
        { q: "He de pagar impostos als EUA si visc fora?", a: "Si la LLC és 'disregarded entity' (un sol membre no resident) i no té activitat econòmica connectada amb els EUA (ECI) ni presència física, normalment no genera impost federal. L'obligació principal és presentar els formularis 5472 + 1120 informatius cada any." },
        { q: "Quant costa mantenir la LLC cada any?", a: "Només el cost de l'agent registrat a partir del segon any. Nou Mèxic no cobra informe anual ni franchise tax, per això és l'estat més eficient en manteniment." },
        { q: "Puc canviar la meva LLC actual a Nou Mèxic?", a: "Sí, mitjançant un procés anomenat domesticació o, en alguns casos, dissolent l'entitat anterior i constituint-ne una de nova. A l'assessoria inicial t'expliquem quina opció et convé." },
      ],
    },
    cta: {
      h2: "A punt per constituir la teva LLC a Nou Mèxic?",
      p: "Agenda una trucada i et confirmem si Nou Mèxic és l'estat adequat per al teu cas, els terminis reals i el cost total sense sorpreses.",
      btn: "Agendar assessoria",
      btnSecondary: "Veure tots els serveis",
    },
    seo: {
      title: "LLC a Nou Mèxic: cost mínim i sense paperasses | Exentax",
      description: "La LLC americana més lleugera per a autònoms catalans: sense informe anual, sense franchise tax i amb anonimat. EIN, banc i BOI inclosos. Comença avui.",
      keywords: "LLC Nou Mèxic, LLC per a no residents, obrir LLC nòmada digital, LLC sense informe anual",
      ogTitle: "LLC Nou Mèxic: privacitat real i manteniment mínim",
      ogDescription: "LLC a Nou Mèxic sense informe anual, sense franchise tax i amb privacitat real. EIN, banc i BOI. Exentax: la teva LLC americana operativa en 48 hores.",
    },
    jsonLd: { name: "Constitució de LLC a Nou Mèxic per a no residents", serviceType: "Constitució de societat / Formació de LLC" },
  },
  llcWy: {
    cardKicker: "LLC a Wyoming",
    cardTitle: "LLC a Wyoming: privacitat forta i protecció patrimonial",
    cardDesc: "L'estat de referència per a qui prioritza el blindatge d'actius, el charging order i la màxima privacitat legal.",
    breadcrumb: "LLC a Wyoming",
    hero: {
      kicker: "LLC A WYOMING",
      h1: "La teva LLC a Wyoming",
      h1green: "privacitat forta i protecció patrimonial",
      subtitle: "El blindatge patrimonial dels EUA: Wyoming et dona el charging order més fort del país (també per a LLC unipersonals) i màxima privacitat legal per als membres.",
      ctaPrimary: "Agendar assessoria",
      ctaWhatsapp: "Parlar per WhatsApp",
      waText: "Hola, vull obrir una LLC a Wyoming. Podem parlar?",
    },
    intro: {
      kicker: "PER QUÈ WYOMING",
      h2: "L'estat amb la major protecció legal per als membres",
      paragraphs: [
        "Wyoming ofereix el blindatge patrimonial més sòlid dels EUA: va ser el primer estat a regular les LLC i la seva jurisprudència ha evolucionat cap a una de les majors proteccions patrimonials del país, amb charging order que s'aplica també a LLC unipersonals — cosa rara a nivell federal.",
        "És l'opció habitual per a inversors, holdings personals, emprenedors amb actius a protegir i estructures on la privacitat és requisit, no extra.",
      ],
    },
    features: {
      h2: "Avantatges reals de constituir a Wyoming",
      items: [
        { title: "Charging order protection", desc: "Protecció reforçada per llei estatal davant creditors personals del membre, també per a LLC unipersonals." },
        { title: "Privacitat legal", desc: "L'estat no exigeix llistar públicament membres ni managers en la documentació de constitució." },
        { title: "Jurisprudència favorable", desc: "Tribunals amb dècades de casos pro-LLC i regles clares a favor de la separació entre persona i entitat." },
        { title: "Cost anual contingut", desc: "Annual Report amb taxa mínima ($60) calculada sobre actius a Wyoming, rarament més per a no residents." },
      ],
    },
    bestFor: {
      h2: "És per a tu si...",
      items: [
        "Vols una LLC pensada com a vehicle de protecció patrimonial.",
        "Operaràs una holding personal o tindràs actius dins l'entitat.",
        "Vols garantir que un litigi personal no afecti la propietat de la LLC.",
        "Busques una jurisdicció amb jurisprudència consolidada i predictible.",
        "Necessites màxima privacitat sense renunciar a una estructura neta.",
      ],
    },
    whatsIncluded: {
      h2: "Què inclou el nostre servei",
      items: [
        "Constitució de la LLC a Wyoming amb agent registrat el primer any.",
        "Sol·licitud i obtenció de l'EIN davant l'IRS.",
        "Operating Agreement reforçat adaptat a Wyoming (charging order, transfer restrictions).",
        "Acompanyament per obrir compte bancari nord-americà.",
        "Informe BOI presentat correctament des de l'inici.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "En què es diferencia Wyoming de Nou Mèxic?", a: "Nou Mèxic és l'opció més eficient en cost i manteniment. Wyoming és l'opció més forta en protecció legal. Si la teva prioritat és blindatge patrimonial, Wyoming; si és mínim paperam, Nou Mèxic." },
        { q: "És realment privada una LLC a Wyoming?", a: "Sí. L'estat no exigeix publicar els membres ni els managers. L'informe BOI federal sí identifica el beneficiari real davant FinCEN, però no és informació pública." },
        { q: "Hi ha informe anual?", a: "Sí, Wyoming exigeix Annual Report amb taxa mínima de $60. És un tràmit ràpid que també gestionem." },
        { q: "Puc combinar Wyoming amb una altra LLC operativa?", a: "Sí. Una estructura habitual és una holding a Wyoming que és membre únic d'una LLC operativa en un altre estat. A l'assessoria t'indiquem si aporta valor en el teu cas." },
      ],
    },
    cta: {
      h2: "A punt per constituir la teva LLC a Wyoming?",
      p: "Agenda una trucada i revisem junts si Wyoming és la millor jurisdicció per al teu objectiu: protecció patrimonial, holding personal o privacitat reforçada.",
      btn: "Agendar assessoria",
      btnSecondary: "Veure tots els serveis",
    },
    seo: {
      title: "LLC a Wyoming: el blindatge patrimonial dels EUA | Exentax",
      description: "El blindatge patrimonial més fort dels EUA: charging order exclusiva, jurisprudència consolidada i anonimat societari per als teus actius. Parla amb un expert.",
      keywords: "LLC Wyoming, asset protection LLC, LLC privacitat, LLC per a no residents, holding Wyoming",
      ogTitle: "LLC Wyoming: blindatge patrimonial líder als EUA",
      ogDescription: "LLC a Wyoming amb la major protecció patrimonial dels EUA: charging order i privacitat legal. Exentax: constitució, banca i compliance de la teva LLC.",
    },
    jsonLd: { name: "Constitució de LLC a Wyoming per a no residents", serviceType: "Constitució de societat / Formació de LLC" },
  },
  llcDe: {
    cardKicker: "LLC a Delaware",
    cardTitle: "LLC a Delaware: prestigi corporatiu i inversors",
    cardDesc: "L'estàndard per a startups, rondes d'inversió i operacions B2B que requereixen la jurisdicció més reconeguda del món.",
    breadcrumb: "LLC a Delaware",
    hero: {
      kicker: "LLC A DELAWARE",
      h1: "La teva LLC a Delaware",
      h1green: "prestigi corporatiu i accés a inversors",
      subtitle: "Pensada per aixecar capital VC: Delaware és la jurisdicció més reconeguda del món en dret corporatiu i l'estàndard de facto per a startups, rondes d'inversió i contractes B2B seriosos.",
      ctaPrimary: "Agendar assessoria",
      ctaWhatsapp: "Parlar per WhatsApp",
      waText: "Hola, vull obrir una LLC a Delaware. Podem parlar?",
    },
    intro: {
      kicker: "PER QUÈ DELAWARE",
      h2: "La jurisdicció de referència en dret corporatiu",
      paragraphs: [
        "Per aixecar capital VC i tancar contractes B2B als EUA, Delaware és el camí estàndard: més del 65% de les empreses Fortune 500 hi estan constituïdes i la seva Court of Chancery — tribunal especialitzat en dret societari — aporta més de 200 anys de jurisprudència i màxima predictibilitat.",
        "Per a emprenedors que busquen inversió externa, partners institucionals o clients corporatius als EUA, Delaware sol ser un requisit implícit. El senyal de credibilitat que aporta és difícil de replicar en un altre estat.",
      ],
    },
    features: {
      h2: "Per què Delaware és l'estàndard global",
      items: [
        { title: "Court of Chancery", desc: "Tribunal especialitzat en dret corporatiu, sense jurat i amb jutges experts. Resolucions ràpides i predictibles." },
        { title: "Estàndard per a inversors", desc: "Els fons de venture capital i business angels esperen, per defecte, una entitat a Delaware en els seus term sheets." },
        { title: "Flexibilitat contractual", desc: "L'Operating Agreement permet estructures de governance complexes: classes de membership interests, vesting, drag-along, tag-along." },
        { title: "Jurisprudència massiva", desc: "Dècades de casos publicats que donen certesa sobre com s'interpretarà gairebé qualsevol clàusula." },
      ],
    },
    bestFor: {
      h2: "És per a tu si...",
      items: [
        "Busques aixecar capital o entrar en una acceleradora amb base als EUA.",
        "Vens a empreses grans que exigeixen contractar amb una entitat de Delaware.",
        "Estàs construint una startup escalable i vols flexibilitat per a futures rondes.",
        "Vols una jurisdicció reconeguda internacionalment, sense justificacions.",
        "Tindràs diversos socis o estructures d'equity més enllà de la LLC unipersonal.",
      ],
    },
    whatsIncluded: {
      h2: "Què inclou el nostre servei",
      items: [
        "Constitució de la LLC a Delaware amb agent registrat el primer any.",
        "Sol·licitud i obtenció de l'EIN davant l'IRS.",
        "Operating Agreement avançat preparat per a inversors.",
        "Acompanyament per obrir compte bancari nord-americà.",
        "Informe BOI presentat correctament des de l'inici.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "Quina és la diferència amb Wyoming o Nou Mèxic?", a: "Delaware aporta prestigi i compatibilitat amb inversors institucionals, a canvi d'un cost de manteniment major (Franchise Tax fixa de $300/any per a LLC). Wyoming prioritza protecció patrimonial; Nou Mèxic, eficiència i privacitat." },
        { q: "He de pagar impostos a Delaware si no opero allà?", a: "La LLC paga la Franchise Tax fixa anual ($300), però si no genera ingressos atribuïbles a l'estat, no paga income tax estatal. Les obligacions federals són les mateixes que qualsevol LLC de no residents." },
        { q: "És bona opció per a una LLC unipersonal?", a: "Si el teu pla no inclou inversió externa ni clients que exigeixin Delaware, sol ser excessiu. Per a aquests casos, Nou Mèxic o Wyoming són normalment més eficients." },
        { q: "Puc convertir més endavant la meva LLC en C-Corp?", a: "Sí. És una conversió estàndard a Delaware i és habitual quan una startup rep ronda d'inversió." },
      ],
    },
    cta: {
      h2: "A punt per constituir la teva LLC a Delaware?",
      p: "Agenda una trucada i validem si Delaware és la jurisdicció correcta per al teu model: startup, B2B o estructura preparada per a inversió.",
      btn: "Agendar assessoria",
      btnSecondary: "Veure tots els serveis",
    },
    seo: {
      title: "LLC a Delaware: pensada per aixecar capital VC | Exentax",
      description: "La jurisdicció que demanen fons VC i compradors B2B als EUA: Court of Chancery, series LLC i contractes reconeguts arreu del món. Reserva la teva trucada.",
      keywords: "LLC Delaware, LLC startup, LLC inversió, Delaware per a no residents, jurisdicció corporativa",
      ogTitle: "LLC Delaware: la favorita d'inversors i B2B seriós",
      ogDescription: "LLC a Delaware: jurisdicció de referència per a startups, inversió i contractes B2B als EUA. Exentax t'acompanya del diagnòstic a la compliance anual.",
    },
    jsonLd: { name: "Constitució de LLC a Delaware per a no residents", serviceType: "Constitució de societat / Formació de LLC" },
  },
  llcFl: {
    cardKicker: "LLC a Florida",
    cardTitle: "LLC a Florida: presència real i mercat hispà",
    cardDesc: "L'estat ideal quan vas a viure, viatjar o tenir clients i proveïdors reals als EUA, especialment a Miami.",
    breadcrumb: "LLC a Florida",
    hero: {
      kicker: "LLC A FLORIDA",
      h1: "La teva LLC a Florida",
      h1green: "presència real, mercat hispà i dinàmica de negoci",
      subtitle: "El teu pont català cap al mercat llatí: Florida és l'estat natural quan vas a viatjar amb freqüència als EUA, tenir clients locals o construir un negoci amb base a Miami i la comunitat hispana.",
      ctaPrimary: "Agendar assessoria",
      ctaWhatsapp: "Parlar per WhatsApp",
      waText: "Hola, vull obrir una LLC a Florida. Podem parlar?",
    },
    intro: {
      kicker: "PER QUÈ FLORIDA",
      h2: "L'estat amb més connexió real amb el món hispà",
      paragraphs: [
        "Florida és el pont català cap al mercat llatí: concentra una de les comunitats hispanes més grans i actives dels EUA, i Miami funciona com el hub financer, comercial i tecnològic per a Llatinoamèrica — tenir una LLC amb adreça a Florida facilita relacions amb clients, proveïdors i bancs locals.",
        "És l'opció habitual per a emprenedors que de debò trepitgen els EUA, lloguen un espai, contracten localment o venen a consumidors americans, en contrast amb estats purament 'de paper' com Nou Mèxic o Wyoming.",
        "Xifres 2026 (font: Florida Division of Corporations i Department of Revenue): constitució des de 125 $, Annual Report obligatori abans de l'1 de maig de cada any per 138,75 $, agent registrat amb adreça física a Florida obligatori, 0 % d'state income tax sobre persones físiques i una taxa estatal base de sales tax del 6 % quan s'aplica.",
      ],
    },
    features: {
      h2: "Per què Florida funciona per a hispanoparlants",
      items: [
        { title: "Sense impost estatal sobre la renda personal", desc: "Florida no aplica state income tax sobre persones físiques. Per a residents fiscals als EUA és un dels estats més eficients." },
        { title: "Comunitat hispana i bancarització", desc: "Bancs, professionals i proveïdors acostumats a tractar amb clients hispanoparlants i empreses llatinoamericanes." },
        { title: "Hub per a Llatinoamèrica", desc: "Miami és el pont natural EUA-LatAm: vols directes, fires, inversors i acceleradores enfocades al mercat hispà." },
        { title: "Adequat per a presència física", desc: "Si vas a llogar oficina, contractar empleats o atendre clients als EUA, Florida evita el cost de registrar una LLC forana en l'estat on realment operes." },
      ],
    },
    bestFor: {
      h2: "És per a tu si...",
      items: [
        "Vas a viatjar als EUA i vols operar des de Miami amb certa presència real.",
        "El teu mercat són clients hispanoparlants als EUA o Llatinoamèrica.",
        "Necessites relació bancària i comptable còmoda en castellà.",
        "Estàs considerant residència fiscal o visat als EUA a mitjà termini.",
        "Vens productes o serveis físics en territori nord-americà.",
      ],
    },
    whatsIncluded: {
      h2: "Què inclou el nostre servei",
      items: [
        "Constitució de la LLC a Florida amb agent registrat el primer any.",
        "Sol·licitud i obtenció de l'EIN davant l'IRS.",
        "Operating Agreement adaptat a la teva estructura de socis.",
        "Acompanyament per obrir compte bancari nord-americà, presencial o online.",
        "Informe BOI presentat correctament des de l'inici.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "He de viure a Florida per obrir la LLC?", a: "No. Qualsevol persona, resident o no resident, pot ser membre d'una LLC a Florida. L'únic obligatori és tenir un agent registrat amb adreça física a l'estat." },
        { q: "Quins impostos paga la LLC a Florida?", a: "Florida exigeix Annual Report ($138,75) cada any. No aplica state income tax a persones físiques. La LLC paga impostos federals segons la classificació i només paga sales tax si ven béns/serveis subjectes a aquest impost a l'estat." },
        { q: "És bona per vendre per Amazon FBA o e-commerce?", a: "Sí, especialment si vas a tenir inventari als EUA o treballar amb proveïdors locals. La proximitat amb magatzems, freight forwarders i bancs en castellà és un avantatge operatiu real." },
        { q: "Puc canviar de Nou Mèxic a Florida més endavant?", a: "Sí, mitjançant domesticació o constituint una nova entitat a Florida. T'orientem a l'assessoria segons la teva fase i volum." },
      ],
    },
    cta: {
      h2: "A punt per constituir la teva LLC a Florida?",
      p: "Agenda una trucada i revisem si Florida és l'estat correcte per al teu negoci, especialment si el teu mercat és hispà o vas a tenir presència real als EUA.",
      btn: "Agendar assessoria",
      btnSecondary: "Veure tots els serveis",
    },
    seo: {
      title: "LLC a Florida: pont català cap al mercat llatí | Exentax",
      description: "El teu pont entre Catalunya i el mercat llatí de Miami: presència física, banca en castellà i 0% d'impost estatal. Inclou EIN i BOI. Reserva la teva trucada.",
      keywords: "LLC Florida, LLC Miami, LLC per a hispans, LLC Amazon FBA Florida, obrir empresa Florida",
      ogTitle: "LLC Florida: la teva porta al mercat hispà de Miami",
      ogDescription: "LLC a Florida amb presència real, banca en castellà i connexió directa amb el mercat hispà de Miami. Exentax: la teva LLC americana operativa en 48 hores.",
    },
    jsonLd: { name: "Constitució de LLC a Florida per a hispanoparlants i no residents", serviceType: "Constitució de societat / Formació de LLC" },
  },
  itin: {
    cardKicker: "ITIN",
    cardTitle: "Obtén el teu ITIN com a no resident",
    cardDesc: "El teu Individual Taxpayer Identification Number gestionat de principi a fi amb un Certifying Acceptance Agent.",
    breadcrumb: "Obtén el teu ITIN",
    hero: {
      kicker: "ITIN PER A NO RESIDENTS",
      h1: "Obtén el teu ITIN",
      h1green: "de principi a fi, sense enviar el teu passaport per correu",
      subtitle: "Sense viatjar als EUA i sense enviar el passaport per correu: el nostre Certifying Acceptance Agent autoritzat tramita el teu Individual Taxpayer Identification Number (ITIN) davant l'IRS de principi a fi.",
      ctaPrimary: "Agendar assessoria",
      ctaWhatsapp: "Parlar per WhatsApp",
      waText: "Hola, necessito tramitar el meu ITIN. Podem parlar?",
    },
    intro: {
      kicker: "QUÈ ÉS L'ITIN",
      h2: "El número fiscal nord-americà per a qui no té SSN",
      paragraphs: [
        "Sense viatjar als EUA: l'ITIN (Individual Taxpayer Identification Number) és el número fiscal que emet l'IRS a les persones obligades a presentar declaracions o formularis fiscals als EUA però que no compleixen els requisits per al Social Security Number (SSN). És imprescindible per a molts no residents amb LLC, ingressos immobiliaris o retencions en plataformes nord-americanes.",
        "El procés oficial requereix enviar el passaport original a l'IRS o validar-lo a través d'un Certifying Acceptance Agent (CAA). Treballem amb CAA acreditats perquè no t'hagis de desprendre del passaport ni assumir el risc postal.",
      ],
    },
    features: {
      h2: "Com funciona el nostre servei d'ITIN",
      items: [
        { title: "Sense enviar el passaport", desc: "Validació del passaport a través d'un Certifying Acceptance Agent. Conserves l'original en tot moment." },
        { title: "Justificació correcta", desc: "Preparem el motiu vàlid (Exception 1, 2, 3 o declaració associada) segons el teu cas real." },
        { title: "W-7 + suport complet", desc: "Formulari W-7 emplenat, carta del CAA i documentació de suport llestos per enviar a l'IRS." },
        { title: "Seguiment real", desc: "Acompanyament des de la presentació fins a la recepció de l'ITIN, incloent reenviaments si l'IRS demana aclariments." },
      ],
    },
    bestFor: {
      h2: "Necessites ITIN si...",
      items: [
        "Tens una LLC als EUA i has de presentar formularis informatius personals associats.",
        "Reps pagaments de plataformes nord-americanes que apliquen retenció del 30% per manca d'ITIN.",
        "Tens ingressos immobiliaris o guanys de capital als EUA (formulari 1040-NR).",
        "Ets beneficiari d'un trust o partnership amb presència fiscal als EUA.",
        "Has rebut una carta de l'IRS demanant un número fiscal individual.",
      ],
    },
    whatsIncluded: {
      h2: "Què inclou el nostre servei",
      items: [
        "Anàlisi del teu motiu (Exception aplicable i documentació de suport).",
        "Verificació del passaport a través de Certifying Acceptance Agent autoritzat per l'IRS.",
        "Preparació i revisió del formulari W-7 i de la carta de suport del CAA.",
        "Enviament de l'expedient complet a l'IRS amb número de seguiment.",
        "Acompanyament durant tot el procés fins a la recepció de l'ITIN.",
      ],
    },
    faq: {
      h2: "Preguntes freqüents",
      items: [
        { q: "Quant triga l'IRS a emetre l'ITIN?", a: "El termini oficial actual és de 8 a 11 setmanes des de la recepció de l'expedient, encara que pot variar segons la càrrega de l'IRS. Es notifica per carta postal a l'adreça indicada al W-7." },
        { q: "He de viatjar als Estats Units per obtenir-lo?", a: "No. Treballant amb un Certifying Acceptance Agent pots fer-ho tot a distància des del teu país de residència." },
        { q: "Caduca l'ITIN?", a: "Sí. L'ITIN caduca si no s'utilitza en una declaració fiscal durant tres anys consecutius, o segons el calendari de renovació que publica l'IRS. En aquests casos, cal renovar-lo." },
        { q: "Puc obrir un compte bancari personal amb l'ITIN?", a: "Algunes institucions l'accepten, especialment per a clients amb vincle amb els EUA (LLC, propietat immobiliària, residència parcial). No és un substitut del SSN, però obre portes que sense ITIN estan tancades." },
      ],
    },
    cta: {
      h2: "A punt per tramitar el teu ITIN?",
      p: "Agenda una trucada i revisem el teu cas: motiu, documentació necessària i terminis reals amb un Certifying Acceptance Agent.",
      btn: "Agendar assessoria",
      btnSecondary: "Veure tots els serveis",
    },
    seo: {
      title: "ITIN sense viatjar als EUA: ho gestionem nosaltres | Exentax",
      description: "Sense consolat ni enviar el passaport original: el nostre Certifying Acceptance Agent presenta el teu ITIN davant l'IRS i et segueix sempre. Demana pressupost.",
      keywords: "ITIN, obtenir ITIN, ITIN per a no residents, Certifying Acceptance Agent, W-7, número fiscal IRS",
      ogTitle: "ITIN sense viatjar als EUA: ho gestionem per tu",
      ogDescription: "Tramitem el teu ITIN davant l'IRS amb Certifying Acceptance Agent: sense enviar el passaport original. Exentax: la teva LLC americana operativa en 48 hores.",
    },
    jsonLd: { name: "Tramitació d'ITIN davant l'IRS per a no residents", serviceType: "Servei fiscal / Obtenció de número de identificació fiscal" },
  },
};

// ===== COMPARISONS =====
// LLC comparison: same matrix shared by the 4 LLC subpages, only `highlightCol` differs.
// Columns are always in the same order: NM (0), WY (1), DE (2), FL (3).
const LLC_COMPARISON_BY_LANG: Record<SupportedLang, Omit<Comparison, "highlightCol">> = {
  es: {
    kicker: "COMPARATIVA RÁPIDA",
    h2: "Nuevo México vs Wyoming vs Delaware vs Florida",
    intro: "Los cuatro estados más utilizados por no residentes para abrir una LLC. La elección depende de tu perfil, no del precio.",
    columns: ["Nuevo México", "Wyoming", "Delaware", "Florida"],
    youLabel: "Esta página",
    compareLabel: "Comparar con",
    rows: [
      { label: "Privacidad", values: ["Alta — sin registro público de miembros", "Muy alta — anonimato real del propietario", "Media — agente y dirección públicos", "Baja — miembros y gestores en registro"] },
      { label: "Protección patrimonial", values: ["Sólida — charging order como remedio único", "Excelente — la más fuerte de EE. UU.", "Buena — sólida jurisprudencia corporativa", "Estándar — protección típica de LLC"] },
      { label: "Activos típicos", values: ["Servicios y rentas online", "Holding, inmuebles, inversiones", "Startups, equity, inversores institucionales", "Operativa local, e-commerce, inmuebles en FL"] },
      { label: "Perfil ideal", values: ["Nómada digital o freelance que factura fuera de EE. UU.", "Inversor o holding patrimonial", "Startup que va a levantar capital en EE. UU.", "Emprendedor con clientes o presencia en Florida"] },
      { label: "Característica destacada", values: ["Cero informe anual: mínima fricción", "Privacidad y protección líderes", "Prestigio corporativo reconocido", "Acceso directo al mercado y banca local"] },
    ],
    note: "Cada estado encaja con un objetivo distinto. En Exentax te ayudamos a elegir el que mejor protege tu actividad.",
  },
  en: {
    kicker: "QUICK COMPARISON",
    h2: "New Mexico vs Wyoming vs Delaware vs Florida",
    intro: "The four states most used by non-residents to form an LLC. The right pick depends on your profile, not on the price.",
    columns: ["New Mexico", "Wyoming", "Delaware", "Florida"],
    youLabel: "This page",
    compareLabel: "Compare with",
    rows: [
      { label: "Privacy", values: ["High — no public member registry", "Very high — true owner anonymity", "Medium — agent and address public", "Low — members and managers on file"] },
      { label: "Asset protection", values: ["Strong — charging order as sole remedy", "Excellent — strongest in the US", "Good — solid corporate case law", "Standard — typical LLC protection"] },
      { label: "Typical assets", values: ["Online services and remote income", "Holding, real estate, investments", "Startups, equity, institutional investors", "Local operations, e-commerce, FL real estate"] },
      { label: "Ideal profile", values: ["Digital nomad or freelancer billing outside the US", "Investor or asset-holding vehicle", "Startup planning to raise US capital", "Founder with clients or presence in Florida"] },
      { label: "Standout feature", values: ["Zero annual report — minimal friction", "Top-tier privacy and protection", "Recognized corporate prestige", "Direct access to local market and banking"] },
    ],
    note: "Each state fits a different goal. At Exentax we help you pick the one that best protects your business.",
  },
  fr: {
    kicker: "COMPARATIF RAPIDE",
    h2: "Nouveau-Mexique vs Wyoming vs Delaware vs Floride",
    intro: "Les quatre États les plus utilisés par les non-résidents pour créer une LLC. Le bon choix dépend de votre profil, pas du prix.",
    columns: ["Nouveau-Mexique", "Wyoming", "Delaware", "Floride"],
    youLabel: "Cette page",
    compareLabel: "Comparer avec",
    rows: [
      { label: "Confidentialité", values: ["Élevée — pas de registre public des membres", "Très élevée — anonymat réel du propriétaire", "Moyenne — agent et adresse publics", "Faible — membres et gérants au registre"] },
      { label: "Protection patrimoniale", values: ["Solide — charging order comme seul recours", "Excellente — la plus forte des États-Unis", "Bonne — solide jurisprudence en droit des sociétés", "Standard — protection typique d'une LLC"] },
      { label: "Actifs typiques", values: ["Services et revenus en ligne", "Holding, immobilier, investissements", "Startups, equity, investisseurs institutionnels", "Activité locale, e-commerce, immobilier en FL"] },
      { label: "Profil idéal", values: ["Nomade digital ou freelance facturant hors US", "Investisseur ou véhicule patrimonial", "Startup qui va lever des fonds aux US", "Entrepreneur avec clients ou présence en Floride"] },
      { label: "Atout distinctif", values: ["Zéro rapport annuel — friction minimale", "Confidentialité et protection au plus haut niveau", "Prestige juridique reconnu", "Accès direct au marché et à la banque locale"] },
    ],
    note: "Chaque État correspond à un objectif différent. Chez Exentax, nous vous aidons à choisir celui qui protège le mieux votre activité.",
  },
  de: {
    kicker: "SCHNELLER VERGLEICH",
    h2: "New Mexico vs Wyoming vs Delaware vs Florida",
    intro: "Die vier von Nicht-Ansässigen am häufigsten genutzten Bundesstaaten für eine LLC. Die richtige Wahl hängt von Ihrem Profil ab, nicht vom Preis.",
    columns: ["New Mexico", "Wyoming", "Delaware", "Florida"],
    youLabel: "Diese Seite",
    compareLabel: "Vergleichen mit",
    rows: [
      { label: "Privatsphäre", values: ["Hoch — kein öffentliches Mitgliederregister", "Sehr hoch — echte Anonymität des Inhabers", "Mittel — Agent und Adresse öffentlich", "Niedrig — Mitglieder und Geschäftsführer im Register"] },
      { label: "Vermögensschutz", values: ["Solide — Charging Order als einziges Rechtsmittel", "Exzellent — der stärkste in den USA", "Gut — gefestigte Corporate-Rechtsprechung", "Standard — typischer LLC-Schutz"] },
      { label: "Typische Aktiva", values: ["Online-Dienste und Remote-Einkommen", "Holding, Immobilien, Beteiligungen", "Startups, Equity, institutionelle Investoren", "Lokales Geschäft, E-Commerce, Immobilien in FL"] },
      { label: "Ideales Profil", values: ["Digitaler Nomade oder Freelancer mit Rechnungen außerhalb der USA", "Investor oder Vermögensholding", "Startup, das US-Kapital aufnehmen will", "Unternehmer mit Kunden oder Präsenz in Florida"] },
      { label: "Besondere Stärke", values: ["Kein Jahresbericht — minimale Bürokratie", "Spitzen-Privatsphäre und -Schutz", "Anerkanntes Renommee im Gesellschaftsrecht", "Direkter Zugang zu lokalem Markt und Banking"] },
    ],
    note: "Jeder Bundesstaat passt zu einem anderen Ziel. Bei Exentax helfen wir Ihnen, den zu wählen, der Ihr Geschäft am besten schützt.",
  },
  pt: {
    kicker: "COMPARATIVO RÁPIDO",
    h2: "Novo México vs Wyoming vs Delaware vs Flórida",
    intro: "Os quatro estados mais usados por não residentes para abrir uma LLC. A escolha depende do seu perfil, não do preço.",
    columns: ["Novo México", "Wyoming", "Delaware", "Flórida"],
    youLabel: "Esta página",
    compareLabel: "Comparar com",
    rows: [
      { label: "Privacidade", values: ["Alta — sem registo público de membros", "Muito alta — anonimato real do proprietário", "Média — agente e endereço públicos", "Baixa — membros e gestores no registo"] },
      { label: "Proteção patrimonial", values: ["Sólida — charging order como único recurso", "Excelente — a mais forte dos EUA", "Boa — sólida jurisprudência corporativa", "Padrão — proteção típica de LLC"] },
      { label: "Ativos típicos", values: ["Serviços e renda online", "Holding, imóveis, investimentos", "Startups, equity, investidores institucionais", "Operação local, e-commerce, imóveis na FL"] },
      { label: "Perfil ideal", values: ["Nómada digital ou freelancer faturando fora dos EUA", "Investidor ou veículo patrimonial", "Startup que vai captar capital nos EUA", "Empreendedor com clientes ou presença na Flórida"] },
      { label: "Característica destacada", values: ["Zero relatório anual — fricção mínima", "Privacidade e proteção de alto nível", "Prestígio corporativo reconhecido", "Acesso direto ao mercado e banco local"] },
    ],
    note: "Cada estado se encaixa em um objetivo diferente. Na Exentax ajudamos a escolher o que melhor protege seu negócio.",
  },
  ca: {
    kicker: "COMPARATIVA RÀPIDA",
    h2: "Nou Mèxic vs Wyoming vs Delaware vs Florida",
    intro: "Els quatre estats més utilitzats per no residents per obrir una LLC. L'elecció depèn del teu perfil, no del preu.",
    columns: ["Nou Mèxic", "Wyoming", "Delaware", "Florida"],
    youLabel: "Aquesta pàgina",
    compareLabel: "Comparar amb",
    rows: [
      { label: "Privacitat", values: ["Alta — sense registre públic de membres", "Molt alta — anonimat real del propietari", "Mitjana — agent i adreça públics", "Baixa — membres i gestors al registre"] },
      { label: "Protecció patrimonial", values: ["Sòlida — charging order com a únic recurs", "Excel·lent — la més forta dels EUA", "Bona — sòlida jurisprudència corporativa", "Estàndard — protecció típica de LLC"] },
      { label: "Actius típics", values: ["Serveis i ingressos en línia", "Holding, immobles, inversions", "Startups, equity, inversors institucionals", "Operativa local, e-commerce, immobles a FL"] },
      { label: "Perfil ideal", values: ["Nòmada digital o freelance que factura fora dels EUA", "Inversor o vehicle patrimonial", "Startup que captarà capital als EUA", "Emprenedor amb clients o presència a Florida"] },
      { label: "Característica destacada", values: ["Zero informe anual — mínima fricció", "Privacitat i protecció de primer nivell", "Prestigi corporatiu reconegut", "Accés directe al mercat i banca locals"] },
    ],
    note: "Cada estat encaixa amb un objectiu diferent. A Exentax t'ajudem a triar el que millor protegeix la teva activitat.",
  },
};

const ITIN_COMPARISON_BY_LANG: Record<SupportedLang, Comparison> = {
  es: {
    kicker: "COMPARATIVA RÁPIDA",
    h2: "Cómo se puede tramitar el ITIN",
    intro: "Tres caminos habituales para obtener un ITIN. La diferencia real está en si tienes que enviar el pasaporte y en quién responde por ti ante el IRS.",
    columns: ["Exentax (CAA)", "Pasaporte por correo al IRS", "Otros agentes/gestores"],
    highlightCol: 0,
    rows: [
      { label: "Pasaporte original", values: ["No sale de tus manos", "Lo envías al IRS varias semanas", "Depende del agente"] },
      { label: "Tiempo medio", values: ["8–11 semanas", "11–16 semanas si todo va bien", "Variable, sin compromiso"] },
      { label: "Atención al cliente", values: ["Español + inglés, end-to-end", "Solo formularios IRS en inglés", "Variable según el agente"] },
      { label: "Riesgo de rechazo IRS", values: ["Bajo (CAA verifica)", "Alto si falta documentación", "Medio"] },
    ],
    note: "CAA = Certifying Acceptance Agent autorizado por el IRS.",
  },
  en: {
    kicker: "QUICK COMPARISON",
    h2: "How to apply for an ITIN",
    intro: "Three common paths to get an ITIN. The real difference is whether you ship your passport and who answers to the IRS for you.",
    columns: ["Exentax (CAA)", "Mail passport to IRS", "Other agents"],
    highlightCol: 0,
    rows: [
      { label: "Original passport", values: ["Stays with you", "Mailed to IRS for weeks", "Depends on the agent"] },
      { label: "Average turnaround", values: ["8–11 weeks", "11–16 weeks when smooth", "Variable, no commitment"] },
      { label: "Customer support", values: ["Spanish + English, end-to-end", "IRS forms in English only", "Varies by agent"] },
      { label: "Risk of IRS rejection", values: ["Low (CAA verifies)", "High if anything is missing", "Medium"] },
    ],
    note: "CAA = Certifying Acceptance Agent authorized by the IRS.",
  },
  fr: {
    kicker: "COMPARATIF RAPIDE",
    h2: "Comment obtenir un ITIN",
    intro: "Trois chemins habituels pour obtenir un ITIN. La vraie différence: devez-vous envoyer votre passeport et qui répond pour vous auprès de l'IRS.",
    columns: ["Exentax (CAA)", "Passeport envoyé à l'IRS", "Autres agents"],
    highlightCol: 0,
    rows: [
      { label: "Passeport original", values: ["Reste chez vous", "Envoyé à l'IRS plusieurs semaines", "Dépend de l'agent"] },
      { label: "Délai moyen", values: ["8–11 semaines", "11–16 semaines si tout va bien", "Variable, sans engagement"] },
      { label: "Support client", values: ["Espagnol + anglais, de bout en bout", "Formulaires IRS en anglais uniquement", "Variable selon l'agent"] },
      { label: "Risque de refus IRS", values: ["Faible (CAA vérifie)", "Élevé si pièce manquante", "Moyen"] },
    ],
    note: "CAA = Certifying Acceptance Agent autorisé par l'IRS.",
  },
  de: {
    kicker: "SCHNELLER VERGLEICH",
    h2: "Wege zur Beantragung der ITIN",
    intro: "Drei übliche Wege, eine ITIN zu erhalten. Der echte Unterschied: Müssen Sie Ihren Reisepass einschicken und wer haftet gegenüber dem IRS.",
    columns: ["Exentax (CAA)", "Reisepass an IRS senden", "Andere Agenten"],
    highlightCol: 0,
    rows: [
      { label: "Originalpass", values: ["Bleibt bei Ihnen", "Wird wochenlang an IRS geschickt", "Hängt vom Agenten ab"] },
      { label: "Durchschnittliche Dauer", values: ["8–11 Wochen", "11–16 Wochen bei reibungslosem Ablauf", "Variabel, ohne Zusage"] },
      { label: "Kundenbetreuung", values: ["Spanisch + Englisch, end-to-end", "IRS-Formulare nur auf Englisch", "Variabel je nach Agent"] },
      { label: "Risiko der Ablehnung", values: ["Gering (CAA prüft)", "Hoch bei fehlenden Unterlagen", "Mittel"] },
    ],
    note: "CAA = vom IRS autorisierter Certifying Acceptance Agent.",
  },
  pt: {
    kicker: "COMPARATIVO RÁPIDO",
    h2: "Como solicitar o ITIN",
    intro: "Três caminhos habituais para obter um ITIN. A diferença real está em ter de enviar o passaporte e em quem responde por si ao IRS.",
    columns: ["Exentax (CAA)", "Passaporte enviado ao IRS", "Outros agentes"],
    highlightCol: 0,
    rows: [
      { label: "Passaporte original", values: ["Fica consigo", "Enviado ao IRS por semanas", "Depende do agente"] },
      { label: "Prazo médio", values: ["8–11 semanas", "11–16 semanas quando tudo flui", "Variável, sem compromisso"] },
      { label: "Atendimento ao cliente", values: ["Espanhol + inglês, do início ao fim", "Formulários do IRS apenas em inglês", "Variável conforme o agente"] },
      { label: "Risco de recusa do IRS", values: ["Baixo (CAA verifica)", "Alto se faltar documentação", "Médio"] },
    ],
    note: "CAA = Certifying Acceptance Agent autorizado pelo IRS.",
  },
  ca: {
    kicker: "COMPARATIVA RÀPIDA",
    h2: "Com tramitar l'ITIN",
    intro: "Tres camins habituals per obtenir un ITIN. La diferència real és si has d'enviar el passaport i qui respon per tu davant l'IRS.",
    columns: ["Exentax (CAA)", "Passaport per correu a l'IRS", "Altres agents"],
    highlightCol: 0,
    rows: [
      { label: "Passaport original", values: ["No surt de les teves mans", "L'envies a l'IRS unes setmanes", "Depèn de l'agent"] },
      { label: "Temps mitjà", values: ["8–11 setmanes", "11–16 setmanes si tot va bé", "Variable, sense compromís"] },
      { label: "Atenció al client", values: ["Espanyol + anglès, de cap a cap", "Formularis de l'IRS només en anglès", "Variable segons l'agent"] },
      { label: "Risc de rebuig de l'IRS", values: ["Baix (CAA verifica)", "Alt si falta documentació", "Mitjà"] },
    ],
    note: "CAA = Certifying Acceptance Agent autoritzat per l'IRS.",
  },
};

function withComparisons(lang: SupportedLang, base: SubpagesBase): SubpagesNamespace {
  const llc = LLC_COMPARISON_BY_LANG[lang];
  const itin = ITIN_COMPARISON_BY_LANG[lang];
  return {
    llcNm: { ...base.llcNm, comparison: { ...llc, highlightCol: 0 } },
    llcWy: { ...base.llcWy, comparison: { ...llc, highlightCol: 1 } },
    llcDe: { ...base.llcDe, comparison: { ...llc, highlightCol: 2 } },
    llcFl: { ...base.llcFl, comparison: { ...llc, highlightCol: 3 } },
    itin: { ...base.itin, comparison: itin },
  };
}

export const SUBPAGES_BY_LANG: Record<SupportedLang, SubpagesNamespace> = {
  es: withComparisons("es", es),
  en: withComparisons("en", en),
  fr: withComparisons("fr", fr),
  de: withComparisons("de", de),
  pt: withComparisons("pt", pt),
  ca: withComparisons("ca", ca),
};

export const NAV_SUBPAGES_BY_LANG: Record<SupportedLang, NavSubpagesLabels> = {
  es: {
    servicesOverview: "Servicios",
    servicesOverviewDesc: "Todos los servicios y rangos de inversión",
    servicesLlcNm: "Tu LLC en Nuevo México",
    servicesLlcNmDesc: "Discreta, eficiente, sin informe anual",
    servicesLlcWy: "Tu LLC en Wyoming",
    servicesLlcWyDesc: "Privacidad y protección patrimonial",
    servicesLlcDe: "Tu LLC en Delaware",
    servicesLlcDeDesc: "Prestigio corporativo e inversores",
    servicesLlcFl: "Tu LLC en Florida",
    servicesLlcFlDesc: "Presencia real y mercado hispano",
    servicesItin: "Obtén tu ITIN",
    servicesItinDesc: "Tu número fiscal sin enviar el pasaporte",
  },
  en: {
    servicesOverview: "Services",
    servicesOverviewDesc: "All services and investment ranges",
    servicesLlcNm: "Your New Mexico LLC",
    servicesLlcNmDesc: "Lean, private, no annual report",
    servicesLlcWy: "Your Wyoming LLC",
    servicesLlcWyDesc: "Privacy and asset protection",
    servicesLlcDe: "Your Delaware LLC",
    servicesLlcDeDesc: "Top legal prestige, investor-ready",
    servicesLlcFl: "Your Florida LLC",
    servicesLlcFlDesc: "Real presence and Hispanic market",
    servicesItin: "Get your ITIN",
    servicesItinDesc: "Your tax ID without mailing your passport",
  },
  fr: {
    servicesOverview: "Services",
    servicesOverviewDesc: "Tous les services et fourchettes d'investissement",
    servicesLlcNm: "Votre LLC au Nouveau-Mexique",
    servicesLlcNmDesc: "Discrète, efficace, sans rapport annuel",
    servicesLlcWy: "Votre LLC au Wyoming",
    servicesLlcWyDesc: "Confidentialité et protection patrimoniale",
    servicesLlcDe: "Votre LLC au Delaware",
    servicesLlcDeDesc: "Prestige corporatif et investisseurs",
    servicesLlcFl: "Votre LLC en Floride",
    servicesLlcFlDesc: "Présence réelle et marché hispanique",
    servicesItin: "Obtenez votre ITIN",
    servicesItinDesc: "Votre numéro fiscal sans envoyer votre passeport",
  },
  de: {
    servicesOverview: "Dienstleistungen",
    servicesOverviewDesc: "Alle Leistungen und Investitionsspannen",
    servicesLlcNm: "Ihre LLC in New Mexico",
    servicesLlcNmDesc: "Schlank, privat, kein Jahresbericht",
    servicesLlcWy: "Ihre LLC in Wyoming",
    servicesLlcWyDesc: "Privatsphäre und Vermögensschutz",
    servicesLlcDe: "Ihre LLC in Delaware",
    servicesLlcDeDesc: "Höchstes Renommee, investor-ready",
    servicesLlcFl: "Ihre LLC in Florida",
    servicesLlcFlDesc: "Reale Präsenz und hispanischer Markt",
    servicesItin: "Holen Sie sich Ihre ITIN",
    servicesItinDesc: "Steuernummer ohne Pass-Versand",
  },
  pt: {
    servicesOverview: "Serviços",
    servicesOverviewDesc: "Todos os serviços e faixas de investimento",
    servicesLlcNm: "Sua LLC no Novo México",
    servicesLlcNmDesc: "Discreta, eficiente, sem relatório anual",
    servicesLlcWy: "Sua LLC no Wyoming",
    servicesLlcWyDesc: "Privacidade e proteção patrimonial",
    servicesLlcDe: "Sua LLC em Delaware",
    servicesLlcDeDesc: "Prestígio corporativo e investidores",
    servicesLlcFl: "Sua LLC na Flórida",
    servicesLlcFlDesc: "Presença real e mercado hispânico",
    servicesItin: "Obtenha seu ITIN",
    servicesItinDesc: "Seu número fiscal sem enviar o passaporte",
  },
  ca: {
    servicesOverview: "Serveis",
    servicesOverviewDesc: "Tots els serveis i rangs d'inversió",
    servicesLlcNm: "La teva LLC a Nou Mèxic",
    servicesLlcNmDesc: "Discreta, eficient, sense informe anual",
    servicesLlcWy: "La teva LLC a Wyoming",
    servicesLlcWyDesc: "Privacitat i protecció patrimonial",
    servicesLlcDe: "La teva LLC a Delaware",
    servicesLlcDeDesc: "Prestigi corporatiu i inversors",
    servicesLlcFl: "La teva LLC a Florida",
    servicesLlcFlDesc: "Presència real i mercat hispà",
    servicesItin: "Obtén el teu ITIN",
    servicesItinDesc: "El teu número fiscal sense enviar el passaport",
  },
};

export const SUBPAGES_GRID_BY_LANG: Record<SupportedLang, SubpagesGridLabels> = {
  es: { kicker: "EXPLORA POR ESTADO", h2: "Encuentra el servicio que encaja con tu caso", cta: "Ver servicio" },
  en: { kicker: "EXPLORE BY STATE", h2: "Find the service that fits your case", cta: "See service" },
  fr: { kicker: "EXPLORER PAR ÉTAT", h2: "Trouvez le service adapté à votre cas", cta: "Voir le service" },
  de: { kicker: "NACH BUNDESSTAAT", h2: "Finden Sie die passende Leistung für Ihren Fall", cta: "Leistung ansehen" },
  pt: { kicker: "EXPLORE POR ESTADO", h2: "Encontre o serviço que se encaixa no seu caso", cta: "Ver serviço" },
  ca: { kicker: "EXPLORA PER ESTAT", h2: "Troba el servei que encaixa amb el teu cas", cta: "Veure servei" },
};
