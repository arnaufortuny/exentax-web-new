import { SUPPORTED_LANGS, type SupportedLang, BRAND_NAME } from "./server-constants";

export function resolveEmailLang(lang?: string | null): SupportedLang {
  if (!lang) return "es";
  const normalized = lang.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.includes(normalized)) return normalized as SupportedLang;
  return "es";
}

/**
 * Centralised i18n bundles for layout chrome that lives in
 * `email-layout.ts`: signature title, Google Meet block, phone-call
 * block. Keeping these next to the rest of the email copy guarantees
 * the translation team only ever has to look in ONE file (Task #1
 * Phase A — code structure: separate concerns from the layout file).
 *
 * The layout module re-exports these so existing call sites keep
 * working without churn; new code should import from here directly.
 */
export const SIGNATURE_TITLE_I18N: Record<SupportedLang, string> = {
  es: "Asesora Fiscal",
  en: "Tax Advisor",
  fr: "Conseillère Fiscale",
  de: "Steuerberaterin",
  pt: "Consultora Fiscal",
  ca: "Assessora Fiscal",
};

export const MEET_I18N: Record<SupportedLang, { title: string; joinBtn: string; joinSub: string; pending: string }> = {
  es: { title: "Videollamada Google Meet", joinBtn: "Unirme a la reunión", joinSub: "Únete desde cualquier dispositivo a la hora acordada.", pending: "Te enviaremos el enlace de Google Meet en las próximas horas, antes de la reunión." },
  en: { title: "Google Meet Video Call", joinBtn: "Join meeting", joinSub: "Join from any device at the scheduled time.", pending: "We'll send you the Google Meet link in the next few hours, before the meeting." },
  fr: { title: "Appel vidéo Google Meet", joinBtn: "Rejoindre la réunion", joinSub: "Rejoignez depuis n'importe quel appareil à l'heure prévue.", pending: "Nous vous enverrons le lien Google Meet dans les prochaines heures, avant la réunion." },
  de: { title: "Google Meet Videoanruf", joinBtn: "An Besprechung teilnehmen", joinSub: "Treten Sie zur geplanten Zeit von jedem Gerät bei.", pending: "Wir senden Ihnen den Google Meet Link in den nächsten Stunden vor dem Termin." },
  pt: { title: "Videochamada Google Meet", joinBtn: "Entrar na reunião", joinSub: "Entre de qualquer dispositivo no horário agendado.", pending: "Enviaremos o link do Google Meet nas próximas horas, antes da reunião." },
  ca: { title: "Videotrucada Google Meet", joinBtn: "Unir-me a la reunió", joinSub: "Uneix-te des de qualsevol dispositiu a l'hora acordada.", pending: "T'enviarem l'enllaç de Google Meet en les properes hores, abans de la reunió." },
};

export const PHONE_I18N: Record<SupportedLang, { title: string; intro: (phone: string) => string; sub: string; pendingTitle: string; pendingBody: string }> = {
  es: { title: "Llamada telefónica", intro: (p) => `Te llamaremos al <strong>${p}</strong> a la hora acordada.`, sub: "Asegúrate de tener cobertura y un sitio tranquilo para hablar.", pendingTitle: "Llamada telefónica", pendingBody: "Te llamaremos al teléfono que nos indicaste a la hora acordada." },
  en: { title: "Phone call", intro: (p) => `We'll call you at <strong>${p}</strong> at the scheduled time.`, sub: "Make sure you have coverage and a quiet place to talk.", pendingTitle: "Phone call", pendingBody: "We'll call you at the phone number you provided at the scheduled time." },
  fr: { title: "Appel téléphonique", intro: (p) => `Nous vous appellerons au <strong>${p}</strong> à l'heure prévue.`, sub: "Assurez-vous d'avoir du réseau et un endroit calme pour parler.", pendingTitle: "Appel téléphonique", pendingBody: "Nous vous appellerons au numéro que vous nous avez fourni à l'heure prévue." },
  de: { title: "Telefonanruf", intro: (p) => `Wir rufen Sie zum vereinbarten Zeitpunkt unter <strong>${p}</strong> an.`, sub: "Stellen Sie sicher, dass Sie Empfang und einen ruhigen Ort zum Sprechen haben.", pendingTitle: "Telefonanruf", pendingBody: "Wir rufen Sie zur vereinbarten Zeit unter der angegebenen Telefonnummer an." },
  pt: { title: "Chamada telefónica", intro: (p) => `Ligaremos para o <strong>${p}</strong> à hora agendada.`, sub: "Garanta que tem rede e um local tranquilo para falar.", pendingTitle: "Chamada telefónica", pendingBody: "Ligaremos para o número que nos indicou à hora agendada." },
  ca: { title: "Trucada telefònica", intro: (p) => `Et trucarem al <strong>${p}</strong> a l'hora acordada.`, sub: "Assegura't de tenir cobertura i un lloc tranquil per parlar.", pendingTitle: "Trucada telefònica", pendingBody: "Et trucarem al telèfon que ens vas indicar a l'hora acordada." },
};

/**
 * Localised "rights reserved" suffix shown in every email footer.
 * Centralised so future locale additions touch one place.
 */
export const FOOTER_RIGHTS_I18N: Record<SupportedLang, string> = {
  es: "Todos los derechos reservados",
  en: "All rights reserved",
  fr: "Tous droits réservés",
  de: "Alle Rechte vorbehalten",
  pt: "Todos os direitos reservados",
  ca: "Tots els drets reservats",
};

/**
 * Visible "Unsubscribe" link label rendered in the footer of MARKETING
 * emails only (drip nurture, calculator report, newsletter broadcast).
 * Booking/agenda emails — confirmation, reminder, reschedule,
 * cancellation, no-show, post-meeting follow-up, incomplete-booking
 * reminder — are operational/transactional and intentionally do NOT
 * surface this link, only a "you received this because…" disclaimer.
 */
export const UNSUB_LINK_I18N: Record<SupportedLang, string> = {
  es: "Darse de baja",
  en: "Unsubscribe",
  fr: "Se désinscrire",
  de: "Abmelden",
  pt: "Cancelar inscrição",
  ca: "Donar-se de baixa",
};

interface EmailTranslations {
  booking: {
    subjectPrefix: string;
    heading: (name: string) => string;
    intro: string;
    introDesc: string;
    honestNote: string;
    detailsTitle: string;
    dateLabel: string;
    timeLabel: string;
    prepareTitle: string;
    prepareItems: string[];
    coverTitle: string;
    coverItems: string[];
    weDoNote1: string;
    weDoNote2: string;
    ctaManage: string;
    orWrite: string;
    closing: string;
    refLabel: string;
    unsubNote: string;
  };
  reminder: {
    subject: (startTime: string) => string;
    heading: (name: string) => string;
    intro: string;
    detailsTitle: string;
    dateLabel: string;
    timeLabel: string;
    timezoneNote: string;
    briefTitle: string;
    briefDesc: string;
    prepareTitle: string;
    prepareItems: string[];
    prepareNote: string;
    addCalendarTitle: string;
    addCalendarDesc: string;
    addCalendarCta: string;
    icsAttachedNote: string;
    manageTitle: string;
    manageDesc: string;
    ctaManage: string;
    closing: string;
    unsubNote: string;
    calendarSummary: string;
    calendarDescription: (manageUrl: string | null) => string;
    phoneCallLocation: string;
  };
  calculator: {
    subjectPrefix: string;
    heading: (name: string) => string;
    intro: string;
    situationTitle: string;
    residenceLabel: string;
    incomeLabel: string;
    currentTitle: string;
    currentPrefix: string;
    optimizedTitle: string;
    optimizedPrefix: string;
    differenceTitle: string;
    perYear: string;
    disclaimer: string;
    keyIntro: string;
    keyItems: string[];
    failNote: string;
    whatWeDoTitle: string;
    whatWeDoIntro1: string;
    whatWeDoIntro2: string;
    whatWeDoItems: string[];
    whatWeDoDisclaimer: string;
    ctaIntro: string;
    ctaButton: string;
    ctaDesc: string;
    unsubNote: string;
  };
  reschedule: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    dateLabel: string;
    timeLabel: string;
    focusNote: string;
    manageNote: string;
    ctaManage: string;
    closing: string;
    unsubNote: string;
  };
  cancellation: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    dateLabel: string;
    timeLabel: string;
    rebookNote: string;
    ctaRebook: string;
    rebookDesc: string;
    whatsappNote: string;
    unsubNote: string;
  };
  noShow: {
    subject: string;
    heading: (name: string) => string;
    intro: string;
    understandNote: string;
    rebookIntro: string;
    ctaRebook: string;
    sessionDesc: string;
    whatsappIntro: string;
    closing: string;
    unsubNote: string;
  };
  followup: {
    subject: string;
    heading: (firstName: string) => string;
    intro: (firstName: string) => string;
    ctaLabel: string;
    closing: string;
    unsubNote: string;
  };
  incompleteBooking: {
    subject: string;
    heading: (firstName?: string | null) => string;
    intro1: string;
    intro2: string;
    intro3: string;
    ctaLabel: string;
    replyNote: string;
    closing: string;
    unsubNote: string;
  };
  drip: {
    // CTA labels (rendered as buttons; CTAs are placeholders in the
    // attached copy, e.g. "[Open my guide →]" — we strip the brackets and
    // arrow and render a real button instead).
    ctaOpenGuide: string;
    ctaCalculate: string;
    ctaBook: string;
    // Personalised salutation reused across all 6 steps. When `name`
    // is present we render "Hola {name}," / "Hi {name},"; when not we
    // fall back to the bare cultural greeting. Each locale implements
    // its own grammar (German keeps informal "Hallo {name}," to match
    // the rest of the brand voice).
    greeting: (name?: string | null) => string;
    // Closing line shown above the brand signature in every step.
    sigClosing: string;
    unsubNote: string;
    steps: Array<{
      subject: string;
      // Each paragraph is rendered through `bodyText()`; line break in
      // the attached copy → separate paragraph here.
      paragraphs: string[];
      // Optional postscript shown after the CTA / closing block.
      // Only used on the final step (day 15) to maximise reply-rate
      // without breaking the no-pressure voice.
      ps?: string;
    }>;
  };
  dateFormatter: (dateStr: string) => string;
  currencyFormatter: (amount: number) => string;
}

const translations: Record<SupportedLang, EmailTranslations> = {
  es: {
    booking: {
      subjectPrefix: "Tu asesoría está confirmada",
      heading: (name) => `Hola ${name},`,
      intro: "Ya tenemos tu asesoría reservada.",
      introDesc: "La vamos a enfocar a entender bien cómo estás operando ahora mismo y ver si tiene sentido reordenarlo con una estructura más eficiente. Sin teoría innecesaria y sin planteamientos genéricos.",
      honestNote: "Si en tu caso no hay nada que optimizar, te lo diremos directamente.",
      detailsTitle: "Detalles de la asesoría",
      dateLabel: "Fecha",
      timeLabel: "Hora",
      prepareTitle: "Para que la asesoría tenga sentido",
      prepareItems: [
        "A qué te dedicas exactamente y cómo generas ingresos",
        "Dónde resides fiscalmente de verdad",
        "Cómo estás facturando actualmente",
        "Si trabajas con empresas, particulares o ambos",
        "En qué países están tus clientes",
        "Qué estás pagando hoy en impuestos (aunque sea aproximado)",
        "Si ya tienes una empresa o estructura montada",
        "Qué bancos o plataformas utilizas para cobrar",
      ],
      coverTitle: "Qué vamos a aterrizar contigo",
      coverItems: [
        "Si tiene sentido estructurar tu actividad a través de una entidad en EE.UU.",
        "Cómo organizar correctamente la parte fiscal sin incoherencias",
        "Cómo dejar la operativa preparada para cobrar y mover dinero sin fricción",
        "Qué tipo de cuentas y herramientas encajan en tu caso",
        "Qué obligaciones reales tendrías (sin tecnicismos innecesarios)",
      ],
      weDoNote1: "Nosotros no trabajamos solo la parte \"crear empresa\".",
      weDoNote2: "Dejamos la estructura preparada para que funcione en el día a día: desde la entidad hasta la operativa bancaria y el cumplimiento básico.",
      ctaManage: "Gestionar mi asesoría",
      orWrite: "O escribirnos directamente:",
      closing: "La diferencia no está en montar algo, sino en que tenga sentido y funcione.",
      refLabel: "Referencia",
      unsubNote: "Has recibido este email porque reservaste una asesoría en exentax.com.",
    },
    reminder: {
      subject: (startTime) => `Tu asesoría es hoy a las ${startTime} (Madrid)`,
      heading: (name) => `Hola ${name},`,
      intro: "En unas horas tenemos tu asesoría. Te dejo todo lo necesario en este email para que llegues sin pensar en nada.",
      detailsTitle: "Tu asesoría",
      dateLabel: "Fecha",
      timeLabel: "Hora",
      timezoneNote: "Hora peninsular (Europe/Madrid)",
      briefTitle: "Cómo la vamos a enfocar",
      briefDesc: "Vamos directos al grano: cómo estás operando hoy, qué estás pagando y si hay margen real de mejora. Sin teoría innecesaria.",
      prepareTitle: "Para sacarle partido en 30 minutos, ten claro:",
      prepareItems: [
        "Cómo generas ingresos exactamente",
        "Dónde resides fiscalmente hoy",
        "Cómo estás cobrando actualmente",
        "Qué estás pagando aproximadamente en impuestos y cuotas",
      ],
      prepareNote: "Con eso podemos darte una visión clara en muy poco tiempo.",
      addCalendarTitle: "Añade la asesoría a tu calendario",
      addCalendarDesc: "Para que no se te pase, puedes añadirla a tu calendario en un clic:",
      addCalendarCta: "Añadir a Google Calendar",
      icsAttachedNote: "También tienes adjunto un archivo .ics que abre directamente en Apple Calendar, Outlook o cualquier otro calendario.",
      manageTitle: "¿Necesitas cancelar o cambiar la hora?",
      manageDesc: "Si te surge cualquier imprevisto, puedes reagendar o cancelar la asesoría desde tu enlace personal sin escribirnos. Tarda 10 segundos:",
      ctaManage: "Cancelar o reagendar",
      closing: "Nos vemos en un rato,",
      unsubNote: "Has recibido este recordatorio porque tienes una asesoría programada en exentax.com.",
      calendarSummary: "Asesoría con Exentax",
      calendarDescription: (manageUrl) =>
        `Asesoría gratuita con Exentax (30 min).\n\nAnalizaremos tu situación actual y veremos si tiene sentido estructurar tu actividad con una LLC en EE.UU. Sin presión y sin teoría innecesaria.${manageUrl ? `\n\nGestionar la asesoría: ${manageUrl}` : ""}`,
      phoneCallLocation: "Llamada telefónica",
    },
    calculator: {
      subjectPrefix: "Tu estimación fiscal",
      heading: (name) => `Hola ${name},`,
      intro: "Hemos preparado una estimación a partir de los datos que nos has indicado.",
      situationTitle: "Tu situación",
      residenceLabel: "Residencia",
      incomeLabel: "Ingresos anuales",
      currentTitle: "Escenario actual",
      currentPrefix: "Estarías en torno a:",
      optimizedTitle: "Con una estructura bien planteada",
      optimizedPrefix: "Estimación:",
      differenceTitle: "Diferencia estimada",
      perYear: "al año",
      disclaimer: "Esto es una aproximación, no una promesa.",
      keyIntro: "La clave no está en \"tener una LLC\", sino en cómo se organiza todo alrededor:",
      keyItems: [
        "cómo facturas",
        "cómo cobras",
        "cómo mueves el dinero",
        "qué herramientas utilizas",
        "cómo cumples correctamente",
      ],
      failNote: "Ahí es donde la mayoría falla.",
      whatWeDoTitle: "Qué hacemos nosotros",
      whatWeDoIntro1: "No solo creamos la estructura.",
      whatWeDoIntro2: "La dejamos preparada para operar:",
      whatWeDoItems: [
        "entidad en EE.UU. configurada correctamente",
        "identificación fiscal para operar (EIN)",
        "cuentas para cobrar y mover dinero con normalidad",
        "base clara para cumplir sin problemas",
      ],
      whatWeDoDisclaimer: "(Si algo de esto no aplica en tu caso, se ajusta. No hay plantillas.)",
      ctaIntro: "Si quieres verlo bien aplicado a tu caso:",
      ctaButton: "Reservar asesoría",
      ctaDesc: "Lo revisamos contigo y te decimos qué tiene sentido y qué no.",
      unsubNote: "Has recibido este email porque usaste la calculadora en exentax.com.",
    },
    reschedule: {
      subject: "Tu asesoría ha sido actualizada",
      heading: (name) => `Hola ${name},`,
      intro: "Hemos actualizado tu asesoría.",
      dateLabel: "Nueva fecha",
      timeLabel: "Nueva hora",
      focusNote: "Mantiene el mismo enfoque: analizar tu caso con criterio y definir si hay una estructura viable.",
      manageNote: "Puedes gestionarla aquí si necesitas ajustarla:",
      ctaManage: "Gestionar mi asesoría",
      closing: "Nos vemos en la nueva hora,",
      unsubNote: "Has recibido este email porque reagendaste una asesoría en exentax.com.",
    },
    cancellation: {
      subject: "Asesoría cancelada",
      heading: (name) => `Hola ${name},`,
      intro: "Tu asesoría ha sido cancelada correctamente.",
      dateLabel: "Fecha",
      timeLabel: "Hora",
      rebookNote: "Si quieres retomarlo más adelante:",
      ctaRebook: "Reservar nueva asesoría",
      rebookDesc: "Cuando lo hagas, lo revisamos bien y con base, no con planteamientos genéricos.",
      whatsappNote: "Si necesitas comentar algo antes:",
      unsubNote: "Has recibido este email porque cancelaste una asesoría en exentax.com.",
    },
    noShow: {
      subject: "No hemos podido coincidir hoy",
      heading: (name: string) => `Hola ${name},`,
      intro: "Hoy teníamos prevista tu asesoría, pero no hemos podido coincidir.",
      understandNote: "Entendemos perfectamente que a veces surgen imprevistos.",
      rebookIntro: "Si sigues valorando estructurar bien tu situación, puedes reagendar fácilmente desde aquí:",
      ctaRebook: "Reagendar asesoría",
      sessionDesc: "La idea de esta asesoría es ir al punto y ver, con criterio, si tiene sentido hacer algo en tu caso, cómo plantearlo y qué conviene evitar desde el inicio.",
      whatsappIntro: "Si prefieres comentarlo antes de volver a reservar, también puedes escribirnos directamente por WhatsApp:",
      closing: "Quedamos atentos.",
      unsubNote: "Has recibido este email porque contactaste con exentax.com.",
    },
    followup: {
      subject: `${BRAND_NAME} — seguimiento rápido`,
      heading: (firstName: string) => `Hola, ${firstName}`,
      intro: (firstName: string) => `Hola ${firstName}, te escribo para hacer un seguimiento de nuestra conversación. Si tienes cualquier duda o quieres dar el siguiente paso, responde a este email — estoy a tu disposición.`,
      ctaLabel: "Reservar otra sesión",
      closing: "Quedamos atentos.",
      unsubNote: "Has recibido este email porque contactaste con exentax.com.",
    },
    incompleteBooking: {
      subject: "¿Todo bien? Tu asesoría se quedó a medias.",
      heading: (firstName) => firstName ? `Hola ${firstName},` : "Hola,",
      intro1: "Hace un momento empezaste a reservar tu asesoría gratuita con Exentax y no llegaste a completarla.",
      intro2: "Sin problema. Puede pasar.",
      intro3: "Puedes completar tu reserva cuando quieras.",
      ctaLabel: "Completar mi reserva →",
      replyNote: "Si prefieres escribirme directamente, responde a este email. Estoy aquí.",
      closing: "Un abrazo,",
      unsubNote: "Has recibido este email porque empezaste una reserva en exentax.com.",
    },
    drip: {
      ctaOpenGuide: "Abrir mi guía",
      ctaCalculate: "Calcular mi ahorro",
      ctaBook: "Reservar mi consulta gratuita",
      greeting: (name) => name ? `Hola ${name},` : "Hola,",
      sigClosing: "Un abrazo,",
      unsubNote: "Has recibido estos emails porque solicitaste la guía gratuita o reservaste una consulta en exentax.com.",
      steps: [
        {
          subject: "Aquí está tu guía. Pero primero léeme esto.",
          paragraphs: [
            "Antes de que abras la guía quiero ser directo contigo.",
            "Si estás pagando cuota de autónomo cada mes, estás pagando de más. No porque hagas algo mal. Sino porque nadie te explicó que había otra opción.",
            "Eso es exactamente lo que encontrarás aquí dentro.",
          ],
        },
        {
          subject: "¿Cuánto llevas pagado este año sin necesitarlo?",
          paragraphs: [
            "Haz el cálculo.",
            "Cuota de autónomo desde enero hasta hoy. Multiplícalo por los meses que llevas dado de alta. Ese número que te sale no es una inversión. Es dinero que se fue sin que tuvieras opción de retenerlo.",
            "Lo sé porque es lo que me cuentan todos los que llegan a Exentax. No es rabia. Es una mezcla de sorpresa y resignación. Como si hubiera sido inevitable.",
            "No lo era.",
            "Mañana te cuento cómo funciona la alternativa.",
          ],
        },
        {
          subject: "Te explico cómo funciona en menos de 2 minutos.",
          paragraphs: [
            "Una LLC americana es una empresa constituida en Estados Unidos.",
            "Si eres residente en España y tu LLC no tiene clientes americanos, no pagas impuesto de sociedades en USA. Y no existe nada parecido a la cuota de autónomo. Si un mes no facturas, ese mes no pagas nada fijo.",
            "Sí declaras tus beneficios en el IRPF español. Eso no cambia. Pero desaparece ese coste fijo mensual que sale de tu cuenta hagas lo que hagas.",
            "El proceso completo con nosotros tarda entre 5 y 15 días. Todo remoto. Sin viajar. Sin papeleos interminables.",
            "Así de simple.",
          ],
        },
        {
          subject: "Lo que me contó Laura cuando acabamos su LLC.",
          paragraphs: [
            "Laura es diseñadora freelance. Clientes en Alemania, Países Bajos y UK. Factura unos 48.000 euros al año.",
            "Me escribió tres semanas después de constituir su LLC. Solo decía una cosa: «Claudia, acabo de ver que este mes no me han cargado la cuota. No me lo creía.»",
            "Son 296 euros que antes salían solos cada mes. Sin preguntarle. Sin que ella pudiera hacer nada.",
            "Ahora son suyos.",
            "¿Cuánto sería en tu caso? Calcula exactamente lo que te quedarías tú.",
          ],
        },
        {
          subject: "Sé lo que estás pensando. Te respondo.",
          paragraphs: [
            "Cuando alguien llega hasta aquí siempre hay tres pensamientos rondando.",
            "Que si es legal. Que si Hacienda lo sabe. Que qué pasa con la pensión.",
            "Los tres tienen respuesta clara.",
            "Es completamente legal. El convenio de doble imposición entre España y Estados Unidos contempla exactamente esta estructura. Lo que no es legal es no declarar los beneficios en el IRPF, y eso es lo primero que revisamos con cada cliente.",
            "Hacienda conoce perfectamente las LLCs americanas. No es un secreto ni un truco. Es una estructura que miles de europeos usan correctamente cada año.",
            "La pensión es una decisión personal. Muchos de nuestros clientes destinan parte del ahorro a planes privados con mejor rentabilidad. Pero te lo explicamos sin presión para que decidas tú con toda la información.",
            "¿Tienes alguna duda que no está aquí? Respóndeme directamente. Leo todos los emails.",
          ],
        },
        {
          subject: "Solo te pido 30 minutos.",
          paragraphs: [
            "No para venderte nada.",
            "Para analizar tu situación contigo. Tus ingresos, tus clientes, lo que pagas ahora. Y decirte honestamente si una LLC tiene sentido para ti o no.",
            "Si no lo tiene, te lo digo. No me interesa que constituyas una LLC que no encaja con tu negocio.",
            "Si lo tiene, te explico exactamente cómo sería el proceso, cuánto ahorrarías, y qué necesitarías de tu parte. Que no es mucho.",
            "30 minutos. Sin compromiso. Sin presión.",
          ],
          ps: "P.S. Si prefieres empezar por email, también funciona. Cuéntame en una línea cuál es tu situación y te oriento sin compromiso.",
        },
      ],
    },
    dateFormatter: formatDateEs,
    currencyFormatter: (amount) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },

  en: {
    booking: {
      subjectPrefix: "Your consultation is confirmed",
      heading: (name) => `Hi ${name},`,
      intro: "Your consultation is booked.",
      introDesc: "We'll focus on understanding how you're currently operating and whether it makes sense to restructure with a more efficient setup. No unnecessary theory and no generic approaches.",
      honestNote: "If there's nothing to optimize in your case, we'll tell you directly.",
      detailsTitle: "Consultation details",
      dateLabel: "Date",
      timeLabel: "Time",
      prepareTitle: "For the consultation to be useful",
      prepareItems: [
        "What you do exactly and how you generate income",
        "Where you actually reside for tax purposes",
        "How you're currently invoicing",
        "Whether you work with companies, individuals, or both",
        "In which countries your clients are based",
        "What you're currently paying in taxes (even approximately)",
        "Whether you already have a company or structure in place",
        "What banks or platforms you use to collect payments",
      ],
      coverTitle: "What we'll go through with you",
      coverItems: [
        "Whether it makes sense to structure your activity through a US entity",
        "How to properly organize the tax side without inconsistencies",
        "How to set up operations to collect and move money without friction",
        "What type of accounts and tools fit your case",
        "What real obligations you'd have (without unnecessary jargon)",
      ],
      weDoNote1: "We don't just do the \"set up a company\" part.",
      weDoNote2: "We leave the structure ready to work day to day: from the entity to banking operations and basic compliance.",
      ctaManage: "Manage my appointment",
      orWrite: "Or write to us directly:",
      closing: "The difference isn't in setting something up, but in making sure it makes sense and works.",
      refLabel: "Reference",
      unsubNote: "You received this email because you booked a consultation at exentax.com.",
    },
    reminder: {
      subject: (startTime) => `Your consultation today at ${startTime} (Madrid)`,
      heading: (name) => `Hi ${name},`,
      intro: "Your consultation is in a few hours. Everything you need is in this email so you can show up without thinking about logistics.",
      detailsTitle: "Your consultation",
      dateLabel: "Date",
      timeLabel: "Time",
      timezoneNote: "Madrid time (Europe/Madrid)",
      briefTitle: "How we'll use the time",
      briefDesc: "Straight to the point: how you're operating today, what you're paying, and whether there's real room to improve. No unnecessary theory.",
      prepareTitle: "To get the most out of 30 minutes, have a clear picture of:",
      prepareItems: [
        "How you generate income, exactly",
        "Where you actually reside for tax purposes",
        "How you currently collect payments",
        "What you're roughly paying in taxes and fixed contributions",
      ],
      prepareNote: "With that, we can give you a clear read in very little time.",
      addCalendarTitle: "Add the meeting to your calendar",
      addCalendarDesc: "So you don't miss it, you can add it to your calendar in one click:",
      addCalendarCta: "Add to Google Calendar",
      icsAttachedNote: "We've also attached a .ics file that opens directly in Apple Calendar, Outlook or any other calendar app.",
      manageTitle: "Need to cancel or change the time?",
      manageDesc: "If something comes up, you can reschedule or cancel the consultation from your personal link without writing to us. It takes 10 seconds:",
      ctaManage: "Cancel or reschedule",
      closing: "See you in a bit,",
      unsubNote: "You received this reminder because you have a consultation scheduled at exentax.com.",
      calendarSummary: "Consultation with Exentax",
      calendarDescription: (manageUrl) =>
        `Free consultation with Exentax (30 min).\n\nWe'll review your current situation and see whether structuring your activity through a US LLC makes sense for you. No pressure and no unnecessary theory.${manageUrl ? `\n\nManage the consultation: ${manageUrl}` : ""}`,
      phoneCallLocation: "Phone call",
    },
    calculator: {
      subjectPrefix: "Your tax estimate",
      heading: (name) => `Hi ${name},`,
      intro: "We've prepared an estimate based on the data you provided.",
      situationTitle: "Your situation",
      residenceLabel: "Residence",
      incomeLabel: "Annual income",
      currentTitle: "Current scenario",
      currentPrefix: "You'd be around:",
      optimizedTitle: "With a well-structured setup",
      optimizedPrefix: "Estimate:",
      differenceTitle: "Estimated difference",
      perYear: "per year",
      disclaimer: "This is an approximation, not a promise.",
      keyIntro: "The key isn't in \"having an LLC\", but in how everything around it is organized:",
      keyItems: [
        "how you invoice",
        "how you collect payments",
        "how you move money",
        "what tools you use",
        "how you comply correctly",
      ],
      failNote: "That's where most people fail.",
      whatWeDoTitle: "What we do",
      whatWeDoIntro1: "We don't just create the structure.",
      whatWeDoIntro2: "We leave it ready to operate:",
      whatWeDoItems: [
        "US entity properly configured",
        "tax identification to operate (EIN)",
        "accounts to collect and move money normally",
        "clear foundation for seamless compliance",
      ],
      whatWeDoDisclaimer: "(If any of this doesn't apply to your case, it gets adjusted. No templates.)",
      ctaIntro: "If you want to see it applied to your case:",
      ctaButton: "Book a consultation",
      ctaDesc: "We'll review it with you and tell you what makes sense and what doesn't.",
      unsubNote: "You received this email because you used the calculator at exentax.com.",
    },
    reschedule: {
      subject: "Your consultation has been updated",
      heading: (name) => `Hi ${name},`,
      intro: "We've updated your consultation.",
      dateLabel: "New date",
      timeLabel: "New time",
      focusNote: "Same approach: analyze your case with judgment and determine if there's a viable structure.",
      manageNote: "You can manage it here if you need to adjust:",
      ctaManage: "Manage my appointment",
      closing: "See you at the new time,",
      unsubNote: "You received this email because you rescheduled a consultation at exentax.com.",
    },
    cancellation: {
      subject: "Consultation cancelled",
      heading: (name) => `Hi ${name},`,
      intro: "Your consultation has been cancelled successfully.",
      dateLabel: "Date",
      timeLabel: "Time",
      rebookNote: "If you want to pick it up later:",
      ctaRebook: "Book a new consultation",
      rebookDesc: "When you do, we'll review it properly and with substance, not with generic approaches.",
      whatsappNote: "If you need to discuss something first:",
      unsubNote: "You received this email because you cancelled a consultation at exentax.com.",
    },
    noShow: {
      subject: "We couldn't connect today",
      heading: (name: string) => `Hi ${name},`,
      intro: "We had your consultation scheduled for today, but we weren't able to connect.",
      understandNote: "We completely understand that things come up unexpectedly.",
      rebookIntro: "If you're still looking to structure your situation properly, you can easily reschedule from here:",
      ctaRebook: "Reschedule consultation",
      sessionDesc: "The goal of this session is to get straight to the point and assess, with clear criteria, whether it makes sense to take action in your case, how to approach it, and what to avoid from the start.",
      whatsappIntro: "If you'd prefer to discuss it before rebooking, you can also reach us directly on WhatsApp:",
      closing: "We'll be here.",
      unsubNote: "You received this email because you contacted exentax.com.",
    },
    followup: {
      subject: `${BRAND_NAME} — quick follow-up`,
      heading: (firstName: string) => `Hi, ${firstName}`,
      intro: (firstName: string) => `Hi ${firstName}, just checking in after our recent conversation. If you have any follow-up question or want to take the next step, simply reply to this email — I'm here to help.`,
      ctaLabel: "Book another session",
      closing: "We'll be here.",
      unsubNote: "You received this email because you contacted exentax.com.",
    },
    incompleteBooking: {
      subject: "Everything okay? Your advisory session was left incomplete.",
      heading: (firstName) => firstName ? `Hi ${firstName},` : "Hi,",
      intro1: "A moment ago you started booking your free advisory session with Exentax but didn't quite finish it.",
      intro2: "No worries at all. It happens.",
      intro3: "You can complete your booking whenever you're ready.",
      ctaLabel: "Complete my booking →",
      replyNote: "If you'd rather just write to me directly, reply to this email. I'm here.",
      closing: "Warmly,",
      unsubNote: "You received this email because you started a booking on exentax.com.",
    },
    drip: {
      ctaOpenGuide: "Open my guide",
      ctaCalculate: "Calculate my savings",
      ctaBook: "Book my free consultation",
      greeting: (name) => name ? `Hi ${name},` : "Hi,",
      sigClosing: "Warmly,",
      unsubNote: "You received these emails because you requested the free guide or booked a consultation at exentax.com.",
      steps: [
        {
          subject: "Your guide is here. But read this first.",
          paragraphs: [
            "Before you open the guide, I want to be straight with you.",
            "If you’re paying self-employment fees every month, you’re overpaying. Not because you’re doing anything wrong. But because nobody told you there was another option.",
            "That’s exactly what you’ll find inside.",
          ],
        },
        {
          subject: "How much have you paid this year that you didn’t have to?",
          paragraphs: [
            "Do the math.",
            "Monthly self-employment fees since January. Multiply by however many months you’ve been registered. That number isn’t an investment. It’s money that left your account and you had no say in it.",
            "I know because that’s what everyone tells me when they first reach out to Exentax. It’s not anger. It’s a mix of surprise and resignation. Like it was always going to be this way.",
            "It wasn’t.",
            "Tomorrow I’ll show you how the alternative works.",
          ],
        },
        {
          subject: "Let me explain how this works in under 2 minutes.",
          paragraphs: [
            "A US LLC is a company incorporated in the United States.",
            "If you’re a resident in Spain and your LLC has no US-based clients, you pay no corporate tax in the US. And there’s nothing like a fixed monthly self-employment contribution. If you don’t invoice one month, you pay nothing that month.",
            "You do declare your profits on your Spanish income tax return. That doesn’t change. But that fixed monthly fee that leaves your account no matter what disappears.",
            "The full process with us takes between 5 and 15 days. Fully remote. No travel. No endless paperwork.",
            "That’s it.",
          ],
        },
        {
          subject: "What Laura told me after we finished her LLC.",
          paragraphs: [
            "Laura is a freelance designer. Clients in Germany, the Netherlands and the UK. She earns around 48,000 euros a year.",
            "She messaged me three weeks after incorporating her LLC. Just one line: “Claudia, I just noticed the monthly fee didn’t come out this month. I couldn’t believe it.”",
            "That’s 296 euros that used to leave automatically every month. Without asking her. Without giving her any choice.",
            "Now it stays with her.",
            "How much would it be in your case?",
          ],
        },
        {
          subject: "I know what you’re thinking. Let me answer.",
          paragraphs: [
            "When someone gets this far, there are always three things on their mind.",
            "Whether it’s legal. Whether the tax authority knows. What happens to their pension.",
            "All three have a clear answer.",
            "It’s completely legal. The double taxation treaty between Spain and the United States covers exactly this structure. What isn’t legal is not declaring your profits on your income tax return, and that’s the first thing we review with every client.",
            "Tax authorities know all about US LLCs. It’s not a secret or a loophole. It’s a structure that thousands of Europeans use correctly every year.",
            "The pension is a personal decision. Many of our clients put part of their savings into private pension plans with better returns. We walk you through it without any pressure so you can decide with full information.",
            "Got a question that isn’t covered here? Reply directly. I read every email.",
          ],
        },
        {
          subject: "All I’m asking for is 30 minutes.",
          paragraphs: [
            "Not to sell you anything.",
            "To go through your situation together. Your income, your clients, what you’re paying now. And tell you honestly whether an LLC makes sense for you or not.",
            "If it doesn’t, I’ll tell you. I have no interest in you incorporating an LLC that doesn’t fit your business.",
            "If it does, I’ll walk you through exactly what the process looks like, how much you’d save, and what you’d need from your side. Which isn’t much.",
            "30 minutes. No commitment. No pressure.",
          ],
          ps: "P.S. If you’d rather start by email, that works too. Send me a one-liner about your situation and I’ll point you in the right direction — no obligation.",
        },
      ],
    },
    dateFormatter: formatDateEn,
    currencyFormatter: (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },

  fr: {
    booking: {
      subjectPrefix: "Votre consultation est confirmée",
      heading: (name) => `Bonjour ${name},`,
      intro: "Votre consultation est réservée.",
      introDesc: "Nous allons nous concentrer sur la compréhension de votre fonctionnement actuel et déterminer s'il est pertinent de le réorganiser avec une structure plus efficace. Sans théorie inutile et sans approches génériques.",
      honestNote: "S'il n'y a rien à optimiser dans votre cas, nous vous le dirons directement.",
      detailsTitle: "Détails de la consultation",
      dateLabel: "Date",
      timeLabel: "Heure",
      prepareTitle: "Pour que la consultation soit utile",
      prepareItems: [
        "Ce que vous faites exactement et comment vous générez des revenus",
        "Où vous résidez réellement d'un point de vue fiscal",
        "Comment vous facturez actuellement",
        "Si vous travaillez avec des entreprises, des particuliers ou les deux",
        "Dans quels pays se trouvent vos clients",
        "Ce que vous payez aujourd'hui en impôts (même approximativement)",
        "Si vous avez déjà une entreprise ou une structure en place",
        "Quelles banques ou plateformes vous utilisez pour encaisser",
      ],
      coverTitle: "Ce que nous allons aborder avec vous",
      coverItems: [
        "S'il est pertinent de structurer votre activité via une entité aux États-Unis",
        "Comment organiser correctement la partie fiscale sans incohérences",
        "Comment préparer l'opérationnel pour encaisser et déplacer des fonds sans friction",
        "Quel type de comptes et d'outils correspondent à votre cas",
        "Quelles obligations réelles vous auriez (sans jargon inutile)",
      ],
      weDoNote1: "Nous ne faisons pas que la partie \"créer une entreprise\".",
      weDoNote2: "Nous laissons la structure prête à fonctionner au quotidien : de l'entité aux opérations bancaires et à la conformité de base.",
      ctaManage: "Gérer mon rendez-vous",
      orWrite: "Ou écrivez-nous directement :",
      closing: "La différence n'est pas dans le fait de monter quelque chose, mais dans le fait que cela ait du sens et fonctionne.",
      refLabel: "Référence",
      unsubNote: "Vous avez reçu cet email car vous avez réservé une consultation sur exentax.com.",
    },
    reminder: {
      subject: (startTime) => `Votre consultation aujourd'hui à ${startTime} (Madrid)`,
      heading: (name) => `Bonjour ${name},`,
      intro: "Votre consultation a lieu dans quelques heures. Vous trouverez tout le nécessaire dans cet email pour ne pas avoir à y penser.",
      detailsTitle: "Votre consultation",
      dateLabel: "Date",
      timeLabel: "Heure",
      timezoneNote: "Heure de Madrid (Europe/Madrid)",
      briefTitle: "Comment nous allons utiliser le temps",
      briefDesc: "Droit au but : comment vous opérez aujourd'hui, ce que vous payez et s'il y a une vraie marge d'amélioration. Sans théorie inutile.",
      prepareTitle: "Pour tirer le meilleur des 30 minutes, ayez en tête :",
      prepareItems: [
        "Comment vous générez vos revenus, précisément",
        "Où vous résidez réellement sur le plan fiscal",
        "Comment vous encaissez aujourd'hui",
        "Ce que vous payez approximativement en impôts et cotisations fixes",
      ],
      prepareNote: "Avec cela, nous pouvons vous donner une vision claire en très peu de temps.",
      addCalendarTitle: "Ajoutez la consultation à votre agenda",
      addCalendarDesc: "Pour ne rien laisser au hasard, vous pouvez l'ajouter à votre agenda en un clic :",
      addCalendarCta: "Ajouter à Google Agenda",
      icsAttachedNote: "Vous avez aussi un fichier .ics en pièce jointe, qui s'ouvre directement dans Apple Calendar, Outlook ou tout autre agenda.",
      manageTitle: "Besoin d'annuler ou de changer l'heure ?",
      manageDesc: "Si un imprévu survient, vous pouvez reprogrammer ou annuler la consultation depuis votre lien personnel, sans nous écrire. Cela prend 10 secondes :",
      ctaManage: "Annuler ou reprogrammer",
      closing: "À tout à l'heure,",
      unsubNote: "Vous avez reçu ce rappel car vous avez une consultation programmée sur exentax.com.",
      calendarSummary: "Consultation avec Exentax",
      calendarDescription: (manageUrl) =>
        `Consultation gratuite avec Exentax (30 min).\n\nNous analyserons votre situation actuelle et verrons s'il est pertinent de structurer votre activité via une LLC aux États-Unis. Sans pression et sans théorie inutile.${manageUrl ? `\n\nGérer la consultation : ${manageUrl}` : ""}`,
      phoneCallLocation: "Appel téléphonique",
    },
    calculator: {
      subjectPrefix: "Votre estimation fiscale",
      heading: (name) => `Bonjour ${name},`,
      intro: "Nous avons préparé une estimation à partir des données que vous nous avez fournies.",
      situationTitle: "Votre situation",
      residenceLabel: "Résidence",
      incomeLabel: "Revenus annuels",
      currentTitle: "Scénario actuel",
      currentPrefix: "Vous seriez autour de :",
      optimizedTitle: "Avec une structure bien pensée",
      optimizedPrefix: "Estimation :",
      differenceTitle: "Différence estimée",
      perYear: "par an",
      disclaimer: "Ceci est une approximation, pas une promesse.",
      keyIntro: "La clé n'est pas d'\"avoir une LLC\", mais dans la façon dont tout est organisé autour :",
      keyItems: [
        "comment vous facturez",
        "comment vous encaissez",
        "comment vous déplacez l'argent",
        "quels outils vous utilisez",
        "comment vous vous conformez correctement",
      ],
      failNote: "C'est là que la plupart échouent.",
      whatWeDoTitle: "Ce que nous faisons",
      whatWeDoIntro1: "Nous ne créons pas seulement la structure.",
      whatWeDoIntro2: "Nous la laissons prête à opérer :",
      whatWeDoItems: [
        "entité aux États-Unis correctement configurée",
        "identification fiscale pour opérer (EIN)",
        "comptes pour encaisser et déplacer des fonds normalement",
        "base claire pour une conformité sans problèmes",
      ],
      whatWeDoDisclaimer: "(Si quelque chose ne s'applique pas à votre cas, on ajuste. Pas de modèles.)",
      ctaIntro: "Si vous voulez le voir appliqué à votre cas :",
      ctaButton: "Réserver une consultation",
      ctaDesc: "Nous le révisons avec vous et vous disons ce qui a du sens et ce qui n'en a pas.",
      unsubNote: "Vous avez reçu cet email car vous avez utilisé le calculateur sur exentax.com.",
    },
    reschedule: {
      subject: "Votre consultation a été mise à jour",
      heading: (name) => `Bonjour ${name},`,
      intro: "Nous avons mis à jour votre consultation.",
      dateLabel: "Nouvelle date",
      timeLabel: "Nouvelle heure",
      focusNote: "Même approche : analyser votre cas avec discernement et déterminer s'il existe une structure viable.",
      manageNote: "Vous pouvez la gérer ici si vous devez l'ajuster :",
      ctaManage: "Gérer mon rendez-vous",
      closing: "À la nouvelle heure,",
      unsubNote: "Vous avez reçu cet email car vous avez reprogrammé une consultation sur exentax.com.",
    },
    cancellation: {
      subject: "Consultation annulée",
      heading: (name) => `Bonjour ${name},`,
      intro: "Votre consultation a été annulée correctement.",
      dateLabel: "Date",
      timeLabel: "Heure",
      rebookNote: "Si vous souhaitez reprendre plus tard :",
      ctaRebook: "Réserver une nouvelle consultation",
      rebookDesc: "Quand vous le ferez, nous le réviserons correctement et avec rigueur, pas avec des approches génériques.",
      whatsappNote: "Si vous avez besoin de discuter avant :",
      unsubNote: "Vous avez reçu cet email car vous avez annulé une consultation sur exentax.com.",
    },
    noShow: {
      subject: "Nous n'avons pas pu nous retrouver aujourd'hui",
      heading: (name: string) => `Bonjour ${name},`,
      intro: "Votre consultation était prévue aujourd'hui, mais nous n'avons pas pu nous connecter.",
      understandNote: "Nous comprenons parfaitement que des imprévus peuvent survenir.",
      rebookIntro: "Si vous souhaitez toujours structurer votre situation correctement, vous pouvez facilement reprogrammer depuis ici :",
      ctaRebook: "Reprogrammer la consultation",
      sessionDesc: "L'objectif de cette consultation est d'aller à l'essentiel et d'évaluer, avec rigueur, s'il est pertinent d'agir dans votre cas, comment l'aborder et ce qu'il convient d'éviter dès le départ.",
      whatsappIntro: "Si vous préférez en discuter avant de réserver à nouveau, vous pouvez aussi nous écrire directement sur WhatsApp :",
      closing: "Nous restons à votre disposition.",
      unsubNote: "Vous avez reçu cet email car vous avez contacté exentax.com.",
    },
    followup: {
      subject: `${BRAND_NAME} — petit suivi`,
      heading: (firstName: string) => `Bonjour, ${firstName}`,
      intro: (firstName: string) => `Bonjour ${firstName}, je reviens vers vous suite à notre récent échange. Si vous avez la moindre question ou souhaitez avancer, répondez simplement à cet email — je reste à votre disposition.`,
      ctaLabel: "Réserver une autre session",
      closing: "Nous restons à votre disposition.",
      unsubNote: "Vous avez reçu cet email car vous avez contacté exentax.com.",
    },
    incompleteBooking: {
      subject: "Tout va bien ? Ta séance de conseil est restée incomplète.",
      heading: (firstName) => firstName ? `Bonjour ${firstName},` : "Bonjour,",
      intro1: "Il y a quelques instants tu as commencé à réserver ta séance de conseil gratuite avec Exentax sans aller jusqu'au bout.",
      intro2: "Pas de problème. Ça arrive.",
      intro3: "Tu peux finaliser ta réservation quand tu veux.",
      ctaLabel: "Finaliser ma réservation →",
      replyNote: "Si tu préfères m'écrire directement, réponds à cet email. Je suis là.",
      closing: "Bien à vous,",
      unsubNote: "Tu as reçu cet email parce que tu as commencé une réservation sur exentax.com.",
    },
    drip: {
      ctaOpenGuide: "Ouvrir mon guide",
      ctaCalculate: "Calculer mes économies",
      ctaBook: "Réserver ma consultation gratuite",
      greeting: (name) => name ? `Bonjour ${name},` : "Bonjour,",
      sigClosing: "Bien à vous,",
      unsubNote: "Vous avez reçu ces emails parce que vous avez demandé le guide gratuit ou réservé une consultation sur exentax.com.",
      steps: [
        {
          subject: "Ton guide est là. Mais lis ça d’abord.",
          paragraphs: [
            "Avant d’ouvrir le guide, je veux être direct avec toi.",
            "Si tu paies des cotisations chaque mois, tu paies trop. Non pas parce que tu fais quelque chose de mal. Mais parce que personne ne t’a expliqué qu’il existait une autre option.",
            "C’est exactement ce que tu vas trouver ici.",
          ],
        },
        {
          subject: "Combien as-tu payé cette année sans le devoir ?",
          paragraphs: [
            "Fais le calcul.",
            "Cotisations mensuelles depuis janvier. Multiplie par le nombre de mois depuis que tu t’es inscrit. Ce chiffre n’est pas un investissement. C’est de l’argent qui est parti sans que tu aies pu faire quoi que ce soit.",
            "Je le sais parce que c’est ce que me disent tous ceux qui arrivent chez Exentax. Ce n’est pas de la colère. C’est un mélange de surprise et de résignation. Comme si ça avait toujours été inévitable.",
            "Ça ne l’était pas.",
            "Demain je t’explique comment fonctionne l’alternative.",
          ],
        },
        {
          subject: "Je t’explique comment ça fonctionne en moins de 2 minutes.",
          paragraphs: [
            "Une LLC américaine est une société constituée aux États-Unis.",
            "Si tu es résident en France et que ta LLC n’a pas de clients américains, tu ne paies pas d’impôt sur les sociétés aux États-Unis. Et il n’existe rien de comparable aux cotisations mensuelles obligatoires. Si tu ne factures pas un mois, tu ne paies rien de fixe ce mois-là.",
            "Tu déclares bien tes bénéfices à l’impôt sur le revenu dans ton pays de résidence. Ça ne change pas. Mais cette charge fixe mensuelle qui sort quoi qu’il arrive disparaît.",
            "Le processus complet avec nous prend entre 5 et 15 jours. Entièrement à distance. Sans voyager. Sans paperasse interminable.",
            "C’est aussi simple que ça.",
          ],
        },
        {
          subject: "Ce que Laura m’a dit quand on a terminé sa LLC.",
          paragraphs: [
            "Laura est designer freelance. Des clients en Allemagne, aux Pays-Bas et au Royaume-Uni. Elle facture environ 48.000 euros par an.",
            "Elle m’a écrit trois semaines après avoir constitué sa LLC. Un seul message : “Claudia, je viens de voir que les cotisations n’ont pas été prélevées ce mois-ci. Je n’en revenais pas.”",
            "Ce sont 296 euros qui partaient automatiquement chaque mois. Sans lui demander. Sans qu’elle puisse rien y faire.",
            "Maintenant ils restent chez elle.",
            "Combien ce serait dans ton cas ?",
          ],
        },
        {
          subject: "Je sais ce que tu penses. Laisse-moi répondre.",
          paragraphs: [
            "Quand quelqu’un arrive jusqu’ici, il y a toujours trois questions qui tournent dans la tête.",
            "Si c’est légal. Si l’administration fiscale est au courant. Ce qu’il advient de la retraite.",
            "Les trois ont une réponse claire.",
            "C’est totalement légal. La convention fiscale entre la France et les États-Unis encadre exactement ce type de structure. Ce qui n’est pas légal, c’est de ne pas déclarer ses bénéfices à l’impôt sur le revenu, et c’est la première chose que nous vérifions avec chaque client.",
            "L’administration fiscale connaît parfaitement les LLC américaines. Ce n’est pas un secret ni une astuce. C’est une structure qu’utilisent correctement des milliers d’Européens chaque année.",
            "La retraite est une décision personnelle. Beaucoup de nos clients utilisent une partie de leurs économies pour alimenter des plans d’épargne retraite privés avec de meilleures performances. On t’explique tout sans pression pour que tu décides toi-même avec toutes les informations.",
            "Tu as une question qui n’est pas ici ? Réponds directement. Je lis tous les emails.",
          ],
        },
        {
          subject: "Je te demande juste 30 minutes.",
          paragraphs: [
            "Pas pour te vendre quoi que ce soit.",
            "Pour analyser ta situation ensemble. Tes revenus, tes clients, ce que tu paies maintenant. Et te dire honnêtement si une LLC a du sens pour toi ou pas.",
            "Si ce n’est pas le cas, je te le dis. Je n’ai aucun intérêt à ce que tu constitues une LLC qui ne correspond pas à ton activité.",
            "Si c’est le cas, je t’explique exactement comment se déroulerait le processus, combien tu économiserais, et ce dont tu aurais besoin de ton côté. Ce qui n’est pas grand-chose.",
            "30 minutes. Sans engagement. Sans pression.",
          ],
          ps: "P.S. Si tu préfères commencer par email, ça marche aussi. Envoie-moi une ligne sur ta situation et je t’oriente — sans engagement.",
        },
      ],
    },
    dateFormatter: formatDateFr,
    currencyFormatter: (amount) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },

  de: {
    booking: {
      subjectPrefix: "Ihre Beratung ist bestätigt",
      heading: (name) => `Hallo ${name},`,
      intro: "Ihre Beratung ist gebucht.",
      introDesc: "Wir werden uns darauf konzentrieren zu verstehen, wie Sie derzeit arbeiten und ob es sinnvoll ist, mit einer effizienteren Struktur umzuorganisieren. Ohne unnötige Theorie und ohne generische Ansätze.",
      honestNote: "Wenn es in Ihrem Fall nichts zu optimieren gibt, sagen wir Ihnen das direkt.",
      detailsTitle: "Beratungsdetails",
      dateLabel: "Datum",
      timeLabel: "Uhrzeit",
      prepareTitle: "Damit die Beratung sinnvoll ist",
      prepareItems: [
        "Was genau Sie tun und wie Sie Einkommen generieren",
        "Wo Sie tatsächlich steuerlich ansässig sind",
        "Wie Sie derzeit abrechnen",
        "Ob Sie mit Unternehmen, Privatpersonen oder beidem arbeiten",
        "In welchen Ländern Ihre Kunden sitzen",
        "Was Sie derzeit an Steuern zahlen (auch ungefähr)",
        "Ob Sie bereits ein Unternehmen oder eine Struktur haben",
        "Welche Banken oder Plattformen Sie zum Kassieren nutzen",
      ],
      coverTitle: "Was wir mit Ihnen besprechen werden",
      coverItems: [
        "Ob es sinnvoll ist, Ihre Aktivität über eine US-Einheit zu strukturieren",
        "Wie die steuerliche Seite korrekt und widerspruchsfrei organisiert wird",
        "Wie der Betrieb für reibungslosen Zahlungseingang und Geldtransfer vorbereitet wird",
        "Welche Art von Konten und Werkzeugen zu Ihrem Fall passen",
        "Welche realen Pflichten Sie hätten (ohne unnötigen Fachjargon)",
      ],
      weDoNote1: "Wir machen nicht nur den Teil \"Unternehmen gründen\".",
      weDoNote2: "Wir hinterlassen die Struktur bereit für den täglichen Betrieb: von der Einheit über die Bankoperationen bis zur grundlegenden Compliance.",
      ctaManage: "Meinen Termin verwalten",
      orWrite: "Oder schreiben Sie uns direkt:",
      closing: "Der Unterschied liegt nicht darin, etwas aufzubauen, sondern darin, dass es Sinn ergibt und funktioniert.",
      refLabel: "Referenz",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com gebucht haben.",
    },
    reminder: {
      subject: (startTime) => `Ihre Beratung heute um ${startTime} (Madrid)`,
      heading: (name) => `Hallo ${name},`,
      intro: "Ihre Beratung findet in wenigen Stunden statt. In dieser E-Mail finden Sie alles Notwendige, damit Sie sich um nichts mehr kümmern müssen.",
      detailsTitle: "Ihre Beratung",
      dateLabel: "Datum",
      timeLabel: "Uhrzeit",
      timezoneNote: "Madrider Zeit (Europe/Madrid)",
      briefTitle: "So nutzen wir die Zeit",
      briefDesc: "Direkt zum Punkt: Wie Sie heute arbeiten, was Sie zahlen und ob es echten Verbesserungsspielraum gibt. Ohne unnötige Theorie.",
      prepareTitle: "Damit Sie 30 Minuten optimal nutzen, sollten Sie wissen:",
      prepareItems: [
        "Wie Sie genau Einkommen generieren",
        "Wo Sie tatsächlich steuerlich ansässig sind",
        "Wie Sie derzeit Ihre Zahlungen einnehmen",
        "Was Sie ungefähr an Steuern und festen Beiträgen zahlen",
      ],
      prepareNote: "Damit können wir Ihnen in sehr kurzer Zeit ein klares Bild geben.",
      addCalendarTitle: "Beratung in Ihren Kalender eintragen",
      addCalendarDesc: "Damit nichts untergeht, können Sie sie mit einem Klick in Ihren Kalender übernehmen:",
      addCalendarCta: "Zu Google Kalender hinzufügen",
      icsAttachedNote: "Im Anhang finden Sie zusätzlich eine .ics-Datei, die sich direkt in Apple Kalender, Outlook oder jedem anderen Kalender öffnen lässt.",
      manageTitle: "Müssen Sie absagen oder die Uhrzeit ändern?",
      manageDesc: "Wenn etwas dazwischenkommt, können Sie die Beratung über Ihren persönlichen Link verschieben oder absagen, ohne uns zu schreiben. Dauert 10 Sekunden:",
      ctaManage: "Absagen oder verschieben",
      closing: "Bis gleich,",
      unsubNote: "Sie haben diese Erinnerung erhalten, weil Sie eine Beratung auf exentax.com geplant haben.",
      calendarSummary: "Beratung mit Exentax",
      calendarDescription: (manageUrl) =>
        `Kostenlose Beratung mit Exentax (30 Min.).\n\nWir analysieren Ihre aktuelle Situation und prüfen, ob es sinnvoll ist, Ihre Tätigkeit über eine US-LLC zu strukturieren. Ohne Druck und ohne unnötige Theorie.${manageUrl ? `\n\nBeratung verwalten: ${manageUrl}` : ""}`,
      phoneCallLocation: "Telefonanruf",
    },
    calculator: {
      subjectPrefix: "Ihre Steuerberechnung",
      heading: (name) => `Hallo ${name},`,
      intro: "Wir haben eine Schätzung auf Basis der Daten erstellt, die Sie uns mitgeteilt haben.",
      situationTitle: "Ihre Situation",
      residenceLabel: "Wohnsitz",
      incomeLabel: "Jahreseinkommen",
      currentTitle: "Aktuelles Szenario",
      currentPrefix: "Sie wären ungefähr bei:",
      optimizedTitle: "Mit einer gut durchdachten Struktur",
      optimizedPrefix: "Schätzung:",
      differenceTitle: "Geschätzte Differenz",
      perYear: "pro Jahr",
      disclaimer: "Dies ist eine Annäherung, kein Versprechen.",
      keyIntro: "Der Schlüssel liegt nicht darin, \"eine LLC zu haben\", sondern darin, wie alles drumherum organisiert ist:",
      keyItems: [
        "wie Sie abrechnen",
        "wie Sie kassieren",
        "wie Sie Geld bewegen",
        "welche Werkzeuge Sie nutzen",
        "wie Sie korrekt einhalten",
      ],
      failNote: "Dort scheitern die meisten.",
      whatWeDoTitle: "Was wir tun",
      whatWeDoIntro1: "Wir erstellen nicht nur die Struktur.",
      whatWeDoIntro2: "Wir hinterlassen sie betriebsbereit:",
      whatWeDoItems: [
        "US-Einheit korrekt konfiguriert",
        "Steueridentifikation zum Operieren (EIN)",
        "Konten zum normalen Kassieren und Geldtransfer",
        "klare Grundlage für problemlose Compliance",
      ],
      whatWeDoDisclaimer: "(Wenn etwas davon nicht auf Ihren Fall zutrifft, wird es angepasst. Keine Vorlagen.)",
      ctaIntro: "Wenn Sie es auf Ihren Fall angewandt sehen möchten:",
      ctaButton: "Beratung buchen",
      ctaDesc: "Wir besprechen es mit Ihnen und sagen Ihnen, was Sinn ergibt und was nicht.",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie den Rechner auf exentax.com verwendet haben.",
    },
    reschedule: {
      subject: "Ihre Beratung wurde aktualisiert",
      heading: (name) => `Hallo ${name},`,
      intro: "Wir haben Ihre Beratung aktualisiert.",
      dateLabel: "Neues Datum",
      timeLabel: "Neue Uhrzeit",
      focusNote: "Gleicher Ansatz: Ihren Fall mit Urteilsvermögen analysieren und feststellen, ob eine tragfähige Struktur möglich ist.",
      manageNote: "Sie können ihn hier verwalten, falls Sie anpassen müssen:",
      ctaManage: "Meinen Termin verwalten",
      closing: "Bis zum neuen Termin,",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com umgebucht haben.",
    },
    cancellation: {
      subject: "Beratung storniert",
      heading: (name) => `Hallo ${name},`,
      intro: "Ihre Beratung wurde erfolgreich storniert.",
      dateLabel: "Datum",
      timeLabel: "Uhrzeit",
      rebookNote: "Wenn Sie es später wieder aufgreifen möchten:",
      ctaRebook: "Neue Beratung buchen",
      rebookDesc: "Wenn Sie es tun, prüfen wir es gründlich und fundiert, nicht mit generischen Ansätzen.",
      whatsappNote: "Wenn Sie vorher etwas besprechen möchten:",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com storniert haben.",
    },
    noShow: {
      subject: "Wir konnten uns heute nicht treffen",
      heading: (name: string) => `Hallo ${name},`,
      intro: "Ihre Beratung war für heute geplant, aber wir konnten leider keine Verbindung herstellen.",
      understandNote: "Wir verstehen vollkommen, dass manchmal unvorhergesehene Dinge dazwischenkommen.",
      rebookIntro: "Wenn Sie weiterhin daran interessiert sind, Ihre Situation ordentlich zu strukturieren, können Sie hier ganz einfach einen neuen Termin vereinbaren:",
      ctaRebook: "Beratung neu planen",
      sessionDesc: "Das Ziel dieser Beratung ist es, direkt auf den Punkt zu kommen und mit klaren Kriterien zu prüfen, ob in Ihrem Fall Handlungsbedarf besteht, wie Sie vorgehen sollten und was Sie von Anfang an vermeiden sollten.",
      whatsappIntro: "Wenn Sie es lieber vorher besprechen möchten, bevor Sie erneut buchen, können Sie uns auch direkt über WhatsApp erreichen:",
      closing: "Wir sind für Sie da.",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie exentax.com kontaktiert haben.",
    },
    followup: {
      subject: `${BRAND_NAME} — kurze Nachfrage`,
      heading: (firstName: string) => `Hallo, ${firstName}`,
      intro: (firstName: string) => `Hallo ${firstName}, ich melde mich kurz nach unserem letzten Austausch. Wenn Sie noch Fragen haben oder den nächsten Schritt gehen möchten, antworten Sie einfach auf diese E-Mail — ich bin gerne für Sie da.`,
      ctaLabel: "Weitere Sitzung buchen",
      closing: "Wir sind für Sie da.",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie exentax.com kontaktiert haben.",
    },
    incompleteBooking: {
      subject: "Alles in Ordnung? Deine Beratung wurde nicht abgeschlossen.",
      heading: (firstName) => firstName ? `Hallo ${firstName},` : "Hallo,",
      intro1: "Vor kurzem hast du angefangen, deine kostenlose Beratung bei Exentax zu buchen, aber nicht zu Ende gebracht.",
      intro2: "Kein Problem. Das kann passieren.",
      intro3: "Du kannst deine Buchung jederzeit abschließen.",
      ctaLabel: "Meine Buchung abschließen →",
      replyNote: "Wenn du mir lieber direkt schreiben möchtest, antworte auf diese E-Mail. Ich bin da.",
      closing: "Beste Grüße,",
      unsubNote: "Du hast diese E-Mail erhalten, weil du auf exentax.com mit einer Buchung begonnen hast.",
    },
    drip: {
      ctaOpenGuide: "Meinen Leitfaden öffnen",
      ctaCalculate: "Meine Ersparnis berechnen",
      ctaBook: "Meine kostenlose Beratung buchen",
      greeting: (name) => name ? `Hallo ${name},` : "Hallo,",
      sigClosing: "Beste Grüße,",
      unsubNote: "Du erhältst diese E-Mails, weil du den kostenlosen Leitfaden angefordert oder eine Beratung auf exentax.com gebucht hast.",
      steps: [
        {
          subject: "Dein Leitfaden ist da. Aber lies das zuerst.",
          paragraphs: [
            "Bevor du den Leitfaden öffnest, möchte ich direkt mit dir sein.",
            "Wenn du jeden Monat Pflichtbeiträge zahlst, zahlst du zu viel. Nicht weil du etwas falsch machst. Sondern weil dir niemand erklärt hat, dass es eine andere Option gibt.",
            "Genau das findest du hier drin.",
          ],
        },
        {
          subject: "Wie viel hast du dieses Jahr gezahlt, ohne es zu müssen?",
          paragraphs: [
            "Rechne es durch.",
            "Monatliche Pflichtbeiträge seit Januar. Multipliziert mit der Anzahl der Monate, seit du angemeldet bist. Diese Zahl ist keine Investition. Es ist Geld, das gegangen ist, ohne dass du etwas dagegen tun konntest.",
            "Ich weiß das, weil mir das alle erzählen, die zu Exentax kommen. Es ist keine Wut. Es ist eine Mischung aus Überraschung und Resignation. Als wäre es immer unvermeidlich gewesen.",
            "War es nicht.",
            "Morgen erkläre ich dir, wie die Alternative funktioniert.",
          ],
        },
        {
          subject: "Ich erkläre dir in weniger als 2 Minuten, wie es funktioniert.",
          paragraphs: [
            "Eine US-LLC ist ein Unternehmen, das in den Vereinigten Staaten gegründet wurde.",
            "Wenn du in Deutschland wohnst und deine LLC keine amerikanischen Kunden hat, zahlst du in den USA keine Körperschaftsteuer. Und es gibt nichts Vergleichbares zu monatlichen Pflichtbeiträgen. Wenn du in einem Monat nichts fakturierst, zahlst du in diesem Monat nichts Fixes.",
            "Du erklärst deine Gewinne weiterhin in deiner deutschen Einkommensteuererklärung. Das ändert sich nicht. Aber dieser fixe monatliche Beitrag, der egal was passiert abgebucht wird, verschwindet.",
            "Der gesamte Prozess bei uns dauert zwischen 5 und 15 Tagen. Vollständig remote. Kein Reisen. Kein endloser Papierkram.",
            "So einfach ist das.",
          ],
        },
        {
          subject: "Was Laura mir sagte, als wir ihre LLC fertig hatten.",
          paragraphs: [
            "Laura ist freiberufliche Designerin. Kunden in Deutschland, den Niederlanden und Großbritannien. Sie fakturiert rund 48.000 Euro im Jahr.",
            "Sie schrieb mir drei Wochen nach der Gründung ihrer LLC. Nur eine Zeile: „Claudia, ich habe gerade gesehen, dass der Beitrag diesen Monat nicht abgebucht wurde. Ich konnte es nicht glauben.“",
            "Das sind 296 Euro, die jeden Monat automatisch abgingen. Ohne sie zu fragen. Ohne dass sie etwas dagegen tun konnte.",
            "Jetzt bleiben sie bei ihr.",
            "Wie viel wäre es in deinem Fall?",
          ],
        },
        {
          subject: "Ich weiß, was du denkst. Lass mich antworten.",
          paragraphs: [
            "Wenn jemand bis hierher kommt, gibt es immer drei Gedanken, die im Kopf kreisen.",
            "Ob es legal ist. Ob das Finanzamt es weiß. Was mit der Rente passiert.",
            "Alle drei haben eine klare Antwort.",
            "Es ist vollkommen legal. Das Doppelbesteuerungsabkommen zwischen Deutschland und den Vereinigten Staaten deckt genau diese Struktur ab. Was nicht legal ist, ist die Gewinne nicht in der Einkommensteuererklärung anzugeben, und das ist das Erste, was wir mit jedem Kunden überprüfen.",
            "Das Finanzamt kennt US-LLCs sehr gut. Es ist kein Geheimnis und kein Trick. Es ist eine Struktur, die Tausende von Europäern jedes Jahr korrekt nutzen.",
            "Die Rente ist eine persönliche Entscheidung. Viele unserer Kunden investieren einen Teil der Ersparnis in private Rentenversicherungen mit besseren Renditen. Wir erklären alles ohne Druck, damit du mit allen Informationen selbst entscheidest.",
            "Hast du eine Frage, die hier nicht beantwortet wird? Antworte direkt. Ich lese alle E-Mails.",
          ],
        },
        {
          subject: "Ich bitte dich nur um 30 Minuten.",
          paragraphs: [
            "Nicht um dir etwas zu verkaufen.",
            "Um deine Situation gemeinsam durchzugehen. Deine Einnahmen, deine Kunden, was du jetzt zahlst. Und dir ehrlich zu sagen, ob eine LLC für dich sinnvoll ist oder nicht.",
            "Wenn nicht, sage ich es dir. Es liegt nicht in meinem Interesse, dass du eine LLC gründest, die nicht zu deinem Unternehmen passt.",
            "Wenn ja, erkläre ich dir genau, wie der Prozess aussehen würde, wie viel du sparen würdest, und was du von deiner Seite brauchst. Was nicht viel ist.",
            "30 Minuten. Keine Verpflichtung. Kein Druck.",
          ],
          ps: "P.S. Wenn du lieber per E-Mail anfängst, geht das auch. Schreib mir eine Zeile zu deiner Situation und ich gebe dir eine erste Orientierung — unverbindlich.",
        },
      ],
    },
    dateFormatter: formatDateDe,
    currencyFormatter: (amount) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },

  pt: {
    booking: {
      subjectPrefix: "A sua consultoria está confirmada",
      heading: (name) => `Olá ${name},`,
      intro: "A sua consultoria está reservada.",
      introDesc: "Vamos focar-nos em entender bem como está a operar neste momento e ver se faz sentido reorganizar com uma estrutura mais eficiente. Sem teoria desnecessária e sem abordagens genéricas.",
      honestNote: "Se no seu caso não houver nada a otimizar, dizemos-lhe diretamente.",
      detailsTitle: "Detalhes da consultoria",
      dateLabel: "Data",
      timeLabel: "Hora",
      prepareTitle: "Para que a consultoria faça sentido",
      prepareItems: [
        "A que se dedica exatamente e como gera rendimentos",
        "Onde reside fiscalmente de verdade",
        "Como está a faturar atualmente",
        "Se trabalha com empresas, particulares ou ambos",
        "Em que países estão os seus clientes",
        "O que está a pagar hoje em impostos (mesmo aproximadamente)",
        "Se já tem uma empresa ou estrutura montada",
        "Que bancos ou plataformas utiliza para receber",
      ],
      coverTitle: "O que vamos abordar consigo",
      coverItems: [
        "Se faz sentido estruturar a sua atividade através de uma entidade nos EUA",
        "Como organizar corretamente a parte fiscal sem incoerências",
        "Como preparar a operação para receber e mover dinheiro sem fricção",
        "Que tipo de contas e ferramentas se adequam ao seu caso",
        "Que obrigações reais teria (sem tecnicismos desnecessários)",
      ],
      weDoNote1: "Nós não fazemos só a parte \"criar empresa\".",
      weDoNote2: "Deixamos a estrutura pronta para funcionar no dia a dia: desde a entidade até às operações bancárias e ao cumprimento básico.",
      ctaManage: "Gerir a minha consulta",
      orWrite: "Ou escreva-nos diretamente:",
      closing: "A diferença não está em montar algo, mas sim em que faça sentido e funcione.",
      refLabel: "Referência",
      unsubNote: "Recebeu este email porque marcou uma consultoria em exentax.com.",
    },
    reminder: {
      subject: (startTime) => `A sua consultoria hoje às ${startTime} (Madrid)`,
      heading: (name) => `Olá ${name},`,
      intro: "A sua consultoria é dentro de algumas horas. Tem aqui tudo o que precisa neste email para não ter de pensar em nada.",
      detailsTitle: "A sua consultoria",
      dateLabel: "Data",
      timeLabel: "Hora",
      timezoneNote: "Hora de Madrid (Europe/Madrid)",
      briefTitle: "Como vamos aproveitar o tempo",
      briefDesc: "Direto ao ponto: como está a operar hoje, o que está a pagar e se há margem real de melhoria. Sem teoria desnecessária.",
      prepareTitle: "Para tirar partido de 30 minutos, tenha claro:",
      prepareItems: [
        "Como gera rendimentos exatamente",
        "Onde reside fiscalmente de verdade",
        "Como recebe os pagamentos atualmente",
        "O que está a pagar aproximadamente em impostos e contribuições fixas",
      ],
      prepareNote: "Com isso podemos dar-lhe uma visão clara em muito pouco tempo.",
      addCalendarTitle: "Adicione a consultoria ao seu calendário",
      addCalendarDesc: "Para não falhar, pode adicioná-la ao seu calendário num clique:",
      addCalendarCta: "Adicionar ao Google Calendar",
      icsAttachedNote: "Tem também um ficheiro .ics em anexo que abre diretamente no Apple Calendar, Outlook ou qualquer outro calendário.",
      manageTitle: "Precisa de cancelar ou mudar a hora?",
      manageDesc: "Se surgir algum imprevisto, pode reagendar ou cancelar a consultoria a partir do seu link pessoal sem nos escrever. Demora 10 segundos:",
      ctaManage: "Cancelar ou reagendar",
      closing: "Até já,",
      unsubNote: "Recebeu este lembrete porque tem uma consultoria agendada em exentax.com.",
      calendarSummary: "Consultoria com Exentax",
      calendarDescription: (manageUrl) =>
        `Consultoria gratuita com Exentax (30 min).\n\nVamos analisar a sua situação atual e ver se faz sentido estruturar a sua atividade através de uma LLC nos EUA. Sem pressão e sem teoria desnecessária.${manageUrl ? `\n\nGerir a consultoria: ${manageUrl}` : ""}`,
      phoneCallLocation: "Chamada telefónica",
    },
    calculator: {
      subjectPrefix: "A sua estimativa fiscal",
      heading: (name) => `Olá ${name},`,
      intro: "Preparámos uma estimativa a partir dos dados que nos indicou.",
      situationTitle: "A sua situação",
      residenceLabel: "Residência",
      incomeLabel: "Rendimentos anuais",
      currentTitle: "Cenário atual",
      currentPrefix: "Estaria em torno de:",
      optimizedTitle: "Com uma estrutura bem pensada",
      optimizedPrefix: "Estimativa:",
      differenceTitle: "Diferença estimada",
      perYear: "por ano",
      disclaimer: "Isto é uma aproximação, não uma promessa.",
      keyIntro: "A chave não está em \"ter uma LLC\", mas sim em como tudo à volta está organizado:",
      keyItems: [
        "como fatura",
        "como recebe",
        "como move o dinheiro",
        "que ferramentas utiliza",
        "como cumpre corretamente",
      ],
      failNote: "É aí que a maioria falha.",
      whatWeDoTitle: "O que fazemos",
      whatWeDoIntro1: "Não criamos apenas a estrutura.",
      whatWeDoIntro2: "Deixamo-la pronta para operar:",
      whatWeDoItems: [
        "entidade nos EUA corretamente configurada",
        "identificação fiscal para operar (EIN)",
        "contas para receber e mover dinheiro normalmente",
        "base clara para cumprir sem problemas",
      ],
      whatWeDoDisclaimer: "(Se algo disto não se aplica ao seu caso, ajusta-se. Sem modelos.)",
      ctaIntro: "Se quiser vê-lo aplicado ao seu caso:",
      ctaButton: "Marcar consultoria",
      ctaDesc: "Revemos consigo e dizemos o que faz sentido e o que não faz.",
      unsubNote: "Recebeu este email porque usou a calculadora em exentax.com.",
    },
    reschedule: {
      subject: "A sua consultoria foi atualizada",
      heading: (name) => `Olá ${name},`,
      intro: "Atualizámos a sua consultoria.",
      dateLabel: "Nova data",
      timeLabel: "Nova hora",
      focusNote: "Mantém a mesma abordagem: analisar o seu caso com critério e definir se existe uma estrutura viável.",
      manageNote: "Pode geri-la aqui se precisar de ajustar:",
      ctaManage: "Gerir a minha consulta",
      closing: "Até à nova hora,",
      unsubNote: "Recebeu este email porque reagendou uma consultoria em exentax.com.",
    },
    cancellation: {
      subject: "Consultoria cancelada",
      heading: (name) => `Olá ${name},`,
      intro: "A sua consultoria foi cancelada corretamente.",
      dateLabel: "Data",
      timeLabel: "Hora",
      rebookNote: "Se quiser retomar mais tarde:",
      ctaRebook: "Marcar nova consultoria",
      rebookDesc: "Quando o fizer, revemos bem e com fundamento, não com abordagens genéricas.",
      whatsappNote: "Se precisar de falar antes:",
      unsubNote: "Recebeu este email porque cancelou uma consultoria em exentax.com.",
    },
    noShow: {
      subject: "Não conseguimos nos encontrar hoje",
      heading: (name: string) => `Olá ${name},`,
      intro: "A sua consulta estava agendada para hoje, mas não conseguimos nos conectar.",
      understandNote: "Compreendemos perfeitamente que por vezes surgem imprevistos.",
      rebookIntro: "Se continua a considerar estruturar bem a sua situação, pode reagendar facilmente a partir daqui:",
      ctaRebook: "Reagendar consulta",
      sessionDesc: "O objetivo desta consulta é ir diretamente ao ponto e avaliar, com critério, se faz sentido agir no seu caso, como abordar e o que convém evitar desde o início.",
      whatsappIntro: "Se preferir conversar antes de voltar a reservar, também pode escrever-nos diretamente pelo WhatsApp:",
      closing: "Ficamos atentos.",
      unsubNote: "Recebeu este email porque contactou exentax.com.",
    },
    followup: {
      subject: `${BRAND_NAME} — pequeno acompanhamento`,
      heading: (firstName: string) => `Olá, ${firstName}`,
      intro: (firstName: string) => `Olá ${firstName}, escrevo a seguir à nossa conversa recente. Se tiver alguma dúvida ou quiser avançar, basta responder a este email — estou aqui para ajudar.`,
      ctaLabel: "Marcar nova sessão",
      closing: "Ficamos atentos.",
      unsubNote: "Recebeu este email porque contactou exentax.com.",
    },
    incompleteBooking: {
      subject: "Está tudo bem? A tua assessoria ficou incompleta.",
      heading: (firstName) => firstName ? `Olá ${firstName},` : "Olá,",
      intro1: "Há pouco começaste a reservar a tua assessoria gratuita com o Exentax mas não chegaste a terminar.",
      intro2: "Sem problema. Acontece.",
      intro3: "Podes completar a tua reserva quando quiseres.",
      ctaLabel: "Completar a minha reserva →",
      replyNote: "Se preferires escrever-me diretamente, responde a este email. Estou aqui.",
      closing: "Um abraço,",
      unsubNote: "Recebeste este email porque começaste uma reserva em exentax.com.",
    },
    drip: {
      ctaOpenGuide: "Abrir o meu guia",
      ctaCalculate: "Calcular as minhas poupanças",
      ctaBook: "Reservar a minha consulta gratuita",
      greeting: (name) => name ? `Olá ${name},` : "Olá,",
      sigClosing: "Um abraço,",
      unsubNote: "Recebeu estes emails porque pediu o guia gratuito ou marcou uma consulta em exentax.com.",
      steps: [
        {
          subject: "O teu guia já chegou. Mas lê isto primeiro.",
          paragraphs: [
            "Antes de abrires o guia quero ser direto contigo.",
            "Se estás a pagar contribuições mensais obrigatórias todos os meses, estás a pagar a mais. Não porque estejas a fazer algo errado. Mas porque ninguém te explicou que havia outra opção.",
            "É exatamente isso que vais encontrar aqui dentro.",
          ],
        },
        {
          subject: "Quanto já pagaste este ano sem precisares?",
          paragraphs: [
            "Faz as contas.",
            "Contribuições mensais desde janeiro. Multiplica pelos meses em que estás registado. Esse número não é um investimento. É dinheiro que saiu da tua conta sem teres qualquer hipótese de o reter.",
            "Sei isso porque é o que me dizem todos os que chegam ao Exentax. Não é raiva. É uma mistura de surpresa e resignação. Como se fosse sempre assim que teria de ser.",
            "Não era.",
            "Amanhã conto-te como funciona a alternativa.",
          ],
        },
        {
          subject: "Explico-te como funciona em menos de 2 minutos.",
          paragraphs: [
            "Uma LLC americana é uma empresa constituída nos Estados Unidos.",
            "Se és residente em Espanha e a tua LLC não tem clientes americanos, não pagas imposto sobre o rendimento das empresas nos EUA. E não existe nada semelhante às contribuições mensais obrigatórias. Se num mês não faturares, esse mês não pagas nada de fixo.",
            "Sim, declaras os teus lucros no IRS português. Isso não muda. Mas desaparece esse custo fixo mensal que sai da conta independentemente do que aconteça.",
            "O processo completo connosco demora entre 5 e 15 dias. Tudo remoto. Sem viagens. Sem burocracia interminável.",
            "É assim tão simples.",
          ],
        },
        {
          subject: "O que a Laura me disse quando acabámos a LLC dela.",
          paragraphs: [
            "A Laura é designer freelance. Clientes na Alemanha, Países Baixos e Reino Unido. Fatura cerca de 48.000 euros por ano.",
            "Escreveu-me três semanas depois de constituir a LLC. Só dizia uma coisa: «Claudia, acabei de ver que este mês não me descontaram a contribuição. Não acreditei.»",
            "São 296 euros que antes saíam automaticamente todos os meses. Sem a consultar. Sem que ela pudesse fazer nada.",
            "Agora ficam com ela.",
            "Quanto seria no teu caso?",
          ],
        },
        {
          subject: "Sei o que estás a pensar. Deixa-me responder.",
          paragraphs: [
            "Quando alguém chega até aqui há sempre três pensamentos a rondar.",
            "Se é legal. Se as Finanças sabem. O que acontece à reforma.",
            "Os três têm resposta clara.",
            "É completamente legal. A convenção para evitar a dupla tributação entre Portugal e os Estados Unidos contempla exatamente esta estrutura. O que não é legal é não declarar os lucros no IRS, e é a primeira coisa que revemos com cada cliente.",
            "As Finanças conhecem perfeitamente as LLCs americanas. Não é um segredo nem um truque. É uma estrutura que milhares de europeus utilizam corretamente todos os anos.",
            "A reforma é uma decisão pessoal. Muitos dos nossos clientes destinam parte das poupanças a planos de poupança reforma privados com melhor rentabilidade. Mas explicamos tudo sem pressão para que decidas com toda a informação.",
            "Tens alguma dúvida que não está aqui? Responde diretamente. Leio todos os emails.",
          ],
        },
        {
          subject: "Só te peço 30 minutos.",
          paragraphs: [
            "Não para te vender nada.",
            "Para analisar a tua situação contigo. Os teus rendimentos, os teus clientes, o que pagas agora. E dizer-te honestamente se uma LLC faz sentido para ti ou não.",
            "Se não fizer, digo-te. Não me interessa que constituas uma LLC que não se adapta ao teu negócio.",
            "Se fizer, explico-te exatamente como seria o processo, quanto pouparias, e o que precisarias da tua parte. Que não é muito.",
            "30 minutos. Sem compromisso. Sem pressão.",
          ],
          ps: "P.S. Se preferires começar por email, também funciona. Envia-me uma linha sobre a tua situação e oriento-te — sem compromisso.",
        },
      ],
    },
    dateFormatter: formatDatePt,
    currencyFormatter: (amount) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },

  ca: {
    booking: {
      subjectPrefix: "La teva assessoria està confirmada",
      heading: (name) => `Hola ${name},`,
      intro: "Ja tenim la teva assessoria reservada.",
      introDesc: "La centrarem a entendre bé com estàs operant ara mateix i veure si té sentit reorganitzar-ho amb una estructura més eficient. Sense teoria innecessària i sense plantejaments genèrics.",
      honestNote: "Si en el teu cas no hi ha res a optimitzar, t'ho direm directament.",
      detailsTitle: "Detalls de l'assessoria",
      dateLabel: "Data",
      timeLabel: "Hora",
      prepareTitle: "Perquè l'assessoria tingui sentit",
      prepareItems: [
        "A què et dediques exactament i com generes ingressos",
        "On resideixes fiscalment de veritat",
        "Com estàs facturant actualment",
        "Si treballes amb empreses, particulars o ambdós",
        "En quins països estan els teus clients",
        "Què estàs pagant avui en impostos (encara que sigui aproximat)",
        "Si ja tens una empresa o estructura muntada",
        "Quins bancs o plataformes utilitzes per cobrar",
      ],
      coverTitle: "Què concretarem amb tu",
      coverItems: [
        "Si té sentit estructurar la teva activitat a través d'una entitat als EUA",
        "Com organitzar correctament la part fiscal sense incoherències",
        "Com deixar l'operativa preparada per cobrar i moure diners sense fricció",
        "Quin tipus de comptes i eines encaixen en el teu cas",
        "Quines obligacions reals tindries (sense tecnicismes innecessaris)",
      ],
      weDoNote1: "Nosaltres no treballem només la part \"crear empresa\".",
      weDoNote2: "Deixem l'estructura preparada perquè funcioni en el dia a dia: des de l'entitat fins a l'operativa bancària i el compliment bàsic.",
      ctaManage: "Gestionar la meva assessoria",
      orWrite: "O escriu-nos directament:",
      closing: "La diferència no està en muntar alguna cosa, sinó en que tingui sentit i funcioni.",
      refLabel: "Referència",
      unsubNote: "Has rebut aquest email perquè has reservat una assessoria a exentax.com.",
    },
    reminder: {
      subject: (startTime) => `La teva assessoria és avui a les ${startTime} (Madrid)`,
      heading: (name) => `Hola ${name},`,
      intro: "En unes hores tenim la teva assessoria. Et deixo tot el necessari en aquest correu perquè arribis sense haver de pensar en res.",
      detailsTitle: "La teva assessoria",
      dateLabel: "Data",
      timeLabel: "Hora",
      timezoneNote: "Hora peninsular (Europe/Madrid)",
      briefTitle: "Com l'enfocarem",
      briefDesc: "Anem al gra: com estàs operant avui, què estàs pagant i si hi ha marge real de millora. Sense teoria innecessària.",
      prepareTitle: "Per treure'n profit en 30 minuts, tingues clar:",
      prepareItems: [
        "Com generes ingressos exactament",
        "On resideixes fiscalment de veritat",
        "Com estàs cobrant actualment",
        "Què estàs pagant aproximadament en impostos i quotes fixes",
      ],
      prepareNote: "Amb això podem donar-te una visió clara en molt poc temps.",
      addCalendarTitle: "Afegeix l'assessoria al teu calendari",
      addCalendarDesc: "Perquè no se't passi, pots afegir-la al teu calendari amb un sol clic:",
      addCalendarCta: "Afegir a Google Calendar",
      icsAttachedNote: "També tens adjunt un fitxer .ics que s'obre directament a Apple Calendar, Outlook o qualsevol altre calendari.",
      manageTitle: "Necessites cancel·lar o canviar l'hora?",
      manageDesc: "Si et sorgeix qualsevol imprevist, pots reagendar o cancel·lar l'assessoria des del teu enllaç personal sense escriure'ns. Triga 10 segons:",
      ctaManage: "Cancel·lar o reagendar",
      closing: "Ens veiem aviat,",
      unsubNote: "Has rebut aquest recordatori perquè tens una assessoria programada a exentax.com.",
      calendarSummary: "Assessoria amb Exentax",
      calendarDescription: (manageUrl) =>
        `Assessoria gratuïta amb Exentax (30 min).\n\nAnalitzarem la teva situació actual i veurem si té sentit estructurar la teva activitat amb una LLC als EUA. Sense pressió i sense teoria innecessària.${manageUrl ? `\n\nGestionar l'assessoria: ${manageUrl}` : ""}`,
      phoneCallLocation: "Trucada telefònica",
    },
    calculator: {
      subjectPrefix: "La teva estimació fiscal",
      heading: (name) => `Hola ${name},`,
      intro: "Hem preparat una estimació a partir de les dades que ens has indicat.",
      situationTitle: "La teva situació",
      residenceLabel: "Residència",
      incomeLabel: "Ingressos anuals",
      currentTitle: "Escenari actual",
      currentPrefix: "Estaries al voltant de:",
      optimizedTitle: "Amb una estructura ben plantejada",
      optimizedPrefix: "Estimació:",
      differenceTitle: "Diferència estimada",
      perYear: "a l'any",
      disclaimer: "Això és una aproximació, no una promesa.",
      keyIntro: "La clau no està en \"tenir una LLC\", sinó en com s'organitza tot al voltant:",
      keyItems: [
        "com factures",
        "com cobres",
        "com mous els diners",
        "quines eines utilitzes",
        "com compleixes correctament",
      ],
      failNote: "Aquí és on la majoria falla.",
      whatWeDoTitle: "Què fem nosaltres",
      whatWeDoIntro1: "No només creem l'estructura.",
      whatWeDoIntro2: "La deixem preparada per operar:",
      whatWeDoItems: [
        "entitat als EUA configurada correctament",
        "identificació fiscal per operar (EIN)",
        "comptes per cobrar i moure diners amb normalitat",
        "base clara per complir sense problemes",
      ],
      whatWeDoDisclaimer: "(Si alguna cosa no s'aplica al teu cas, s'ajusta. Sense plantilles.)",
      ctaIntro: "Si vols veure-ho ben aplicat al teu cas:",
      ctaButton: "Reservar assessoria",
      ctaDesc: "Ho revisem amb tu i et diem què té sentit i què no.",
      unsubNote: "Has rebut aquest email perquè has fet servir la calculadora a exentax.com.",
    },
    reschedule: {
      subject: "La teva assessoria ha estat actualitzada",
      heading: (name) => `Hola ${name},`,
      intro: "Hem actualitzat la teva assessoria.",
      dateLabel: "Nova data",
      timeLabel: "Nova hora",
      focusNote: "Manté el mateix enfocament: analitzar el teu cas amb criteri i definir si hi ha una estructura viable.",
      manageNote: "Pots gestionar-la aquí si necessites ajustar-la:",
      ctaManage: "Gestionar la meva assessoria",
      closing: "Ens veiem a la nova hora,",
      unsubNote: "Has rebut aquest email perquè has reagendat una assessoria a exentax.com.",
    },
    cancellation: {
      subject: "Assessoria cancel·lada",
      heading: (name) => `Hola ${name},`,
      intro: "La teva assessoria ha estat cancel·lada correctament.",
      dateLabel: "Data",
      timeLabel: "Hora",
      rebookNote: "Si vols reprendre-ho més endavant:",
      ctaRebook: "Reservar nova assessoria",
      rebookDesc: "Quan ho facis, ho revisem bé i amb fonament, no amb plantejaments genèrics.",
      whatsappNote: "Si necessites comentar alguna cosa abans:",
      unsubNote: "Has rebut aquest email perquè has cancel·lat una assessoria a exentax.com.",
    },
    noShow: {
      subject: "No hem pogut coincidir avui",
      heading: (name: string) => `Hola ${name},`,
      intro: "Avui teníem prevista la teva assessoria, però no hem pogut coincidir.",
      understandNote: "Entenem perfectament que de vegades sorgeixen imprevistos.",
      rebookIntro: "Si segueixes valorant estructurar bé la teva situació, pots reagendar fàcilment des d'aquí:",
      ctaRebook: "Reagendar assessoria",
      sessionDesc: "La idea d'aquesta assessoria és anar al punt i veure, amb criteri, si té sentit fer alguna cosa en el teu cas, com plantejar-ho i què convé evitar des de l'inici.",
      whatsappIntro: "Si prefereixes comentar-ho abans de tornar a reservar, també pots escriure'ns directament per WhatsApp:",
      closing: "Quedem atents.",
      unsubNote: "Has rebut aquest email perquè has contactat amb exentax.com.",
    },
    followup: {
      subject: `${BRAND_NAME} — seguiment ràpid`,
      heading: (firstName: string) => `Hola, ${firstName}`,
      intro: (firstName: string) => `Hola ${firstName}, et torno a escriure després de la nostra conversa. Si tens qualsevol dubte o vols avançar, només cal que responguis a aquest correu — sóc aquí per ajudar-te.`,
      ctaLabel: "Reservar una nova sessió",
      closing: "Quedem atents.",
      unsubNote: "Has rebut aquest email perquè has contactat amb exentax.com.",
    },
    incompleteBooking: {
      subject: "Tot bé? La teva assessoria es va quedar a mitges.",
      heading: (firstName) => firstName ? `Hola ${firstName},` : "Hola,",
      intro1: "Fa uns moments has començat a reservar la teva assessoria gratuïta amb Exentax i no has acabat de completar-la.",
      intro2: "Cap problema. Passa.",
      intro3: "Pots completar la teva reserva quan vulguis.",
      ctaLabel: "Completar la meva reserva →",
      replyNote: "Si prefereixes escriure'm directament, respon a aquest email. Sóc aquí.",
      closing: "Una abraçada,",
      unsubNote: "Has rebut aquest email perquè has començat una reserva a exentax.com.",
    },
    drip: {
      ctaOpenGuide: "Obrir la meva guia",
      ctaCalculate: "Calcular el meu estalvi",
      ctaBook: "Reservar la meva consulta gratuïta",
      greeting: (name) => name ? `Hola ${name},` : "Hola,",
      sigClosing: "Una abraçada,",
      unsubNote: "Has rebut aquests emails perquè vas demanar la guia gratuïta o vas reservar una consulta a exentax.com.",
      steps: [
        {
          subject: "La teva guia ja és aquí. Però llegeix això primer.",
          paragraphs: [
            "Abans d’obrir la guia vull ser directe amb tu.",
            "Si estàs pagant quota mensual obligatòria cada mes, estàs pagant de més. No perquè facis res malament. Sinó perquè ningú t’havia explicat que hi havia una altra opció.",
            "Això és exactament el que trobaràs aquí dins.",
          ],
        },
        {
          subject: "Quant has pagat enguany sense necessitar-ho?",
          paragraphs: [
            "Fes el càlcul.",
            "Quota mensual des del gener fins avui. Multiplica-ho pels mesos que portes donat d’alta. Aquest número no és una inversió. És diners que han marxat sense que hagis pogut fer res per retenir-los.",
            "Ho sé perquè és el que em diuen tots els que arriben a Exentax. No és ràbia. És una barreja de sorpresa i resignació. Com si sempre hagués de ser així.",
            "No havia de ser.",
            "Demà et conto com funciona l’alternativa.",
          ],
        },
        {
          subject: "T’explico com funciona en menys de 2 minuts.",
          paragraphs: [
            "Una LLC americana és una empresa constituïda als Estats Units.",
            "Si ets resident a Espanya i la teva LLC no té clients americans, no pagues impost de societats als EUA. I no existeix res semblant a la quota mensual obligatòria. Si un mes no factures, aquell mes no pagues res fix.",
            "Sí que declares els teus beneficis a l’IRPF espanyol. Això no canvia. Però desapareix aquell cost fix mensual que surt del compte facturis o no.",
            "El procés complet amb nosaltres tarda entre 5 i 15 dies. Tot remot. Sense viatjar. Sense paperassa interminable.",
            "Tan simple com això.",
          ],
        },
        {
          subject: "El que em va dir la Laura quan vam acabar la seva LLC.",
          paragraphs: [
            "La Laura és dissenyadora freelance. Clients a Alemanya, Països Baixos i Regne Unit. Factura uns 48.000 euros l’any.",
            "Em va escriure tres setmanes després de constituir la seva LLC. Només deia una cosa: «Claudia, acabo de veure que aquest mes no m’han carregat la quota. No m’ho creia.»",
            "Són 296 euros que abans sortien sols cada mes. Sense preguntar-li. Sense que ella pogués fer res.",
            "Ara són seus.",
            "Quant seria en el teu cas?",
          ],
        },
        {
          subject: "Sé el que estàs pensant. Et responc.",
          paragraphs: [
            "Quan algú arriba fins aquí sempre hi ha tres pensaments que rondin.",
            "Si és legal. Si Hisenda ho sap. Què passa amb la pensió.",
            "Els tres tenen resposta clara.",
            "És completament legal. El conveni de doble imposició entre Espanya i els Estats Units contempla exactament aquesta estructura. El que no és legal és no declarar els beneficis a l’IRPF, i és el primer que revisem amb cada client.",
            "Hisenda coneix perfectament les LLCs americanes. No és cap secret ni cap truc. És una estructura que milers d’europeus utilitzen correctament cada any.",
            "La pensió és una decisió personal. Molts dels nostres clients destinen part de l’estalvi a plans privats amb millor rendibilitat. T’ho expliquem sense cap pressió perquè decideixis tu amb tota la informació.",
            "Tens alguna pregunta que no és aquí? Respon directament. Llegeixo tots els emails.",
          ],
        },
        {
          subject: "Només et demano 30 minuts.",
          paragraphs: [
            "No per vendre’t res.",
            "Per analitzar la teva situació amb tu. Els teus ingressos, els teus clients, el que pagues ara. I dir-te honestament si una LLC té sentit per a tu o no.",
            "Si no en té, t’ho dic. No m’interessa que constitueixis una LLC que no encaixa amb el teu negoci.",
            "Si en té, t’explico exactament com seria el procés, quant estalviaries, i el que necessitaries de la teva part. Que no és gaire.",
            "30 minuts. Sense compromís. Sense pressió.",
          ],
          ps: "P.S. Si prefereixes començar per email, també funciona. Envia’m una línia sobre la teva situació i t’oriento — sense compromís.",
        },
      ],
    },
    dateFormatter: formatDateCa,
    currencyFormatter: (amount) => new Intl.NumberFormat("ca-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
};

function formatDateEs(dateStr: string): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDateEn(dateStr: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatDateFr(dateStr: string): string {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateDe(dateStr: string): string {
  const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDatePt(dateStr: string): string {
  const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDateCa(dateStr: string): string {
  const days = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];
  const months = ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"];
  const d = new Date(dateStr + "T12:00:00");
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export function getEmailTranslations(lang?: string | null): EmailTranslations {
  return translations[resolveEmailLang(lang)];
}

export const COUNTRY_LABELS_I18N: Record<string, Record<string, string>> = {
  es: { espana: "España", mexico: "México", chile: "Chile", "reino-unido": "Reino Unido", belgica: "Bélgica", francia: "Francia", italia: "Italia", austria: "Austria" },
  en: { espana: "Spain", mexico: "Mexico", chile: "Chile", "reino-unido": "United Kingdom", belgica: "Belgium", francia: "France", italia: "Italy", austria: "Austria" },
  fr: { espana: "Espagne", mexico: "Mexique", chile: "Chili", "reino-unido": "Royaume-Uni", belgica: "Belgique", francia: "France", italia: "Italie", austria: "Autriche" },
  de: { espana: "Spanien", mexico: "Mexiko", chile: "Chile", "reino-unido": "Vereinigtes Königreich", belgica: "Belgien", francia: "Frankreich", italia: "Italien", austria: "Österreich" },
  pt: { espana: "Espanha", mexico: "México", chile: "Chile", "reino-unido": "Reino Unido", belgica: "Bélgica", francia: "França", italia: "Itália", austria: "Áustria" },
  ca: { espana: "Espanya", mexico: "Mèxic", chile: "Xile", "reino-unido": "Regne Unit", belgica: "Bèlgica", francia: "França", italia: "Itàlia", austria: "Àustria" },
};

export const IN_COUNTRY_I18N: Record<string, string> = { es: "en", en: "in", fr: "en", de: "in", pt: "em", ca: "a" };

export function resolveLocalLabel(raw: string, lang: string): string {
  if (!raw.includes("|")) return raw;
  const [regLabel, countryKey] = raw.split("|", 2);
  const countryName = COUNTRY_LABELS_I18N[lang]?.[countryKey] || COUNTRY_LABELS_I18N.es[countryKey] || countryKey;
  const prep = IN_COUNTRY_I18N[lang] || "en";
  return `${regLabel} ${prep} ${countryName}`;
}

export { type EmailTranslations };

// Calculator email "fidelity block": labels for the extra signals the
// calculator UI showed (best of three structures, signed deltas vs LLC,
// display currency, special regimes). Centralized here so all email
// localization lives in this file.
export interface CalculatorFidelityLabels {
  best: string;
  vsAuto: string;
  vsSoc: string;
  currency: string;
  opts: string;
  tarifa: string;
  micro: string;
  structure: Record<string, string>;
}

export const CALCULATOR_FIDELITY_I18N: Record<SupportedLang, CalculatorFidelityLabels> = {
  es: { best: "Estructura ganadora", vsAuto: "Frente a autónomo", vsSoc: "Frente a sociedad local", currency: "Divisa de visualización", opts: "Régimen especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autónomo", sociedad: "Sociedad local", llc: "LLC US" } },
  en: { best: "Winning structure", vsAuto: "Vs sole-trader", vsSoc: "Vs local company", currency: "Display currency", opts: "Special regime", tarifa: "Flat rate", micro: "Micro-entrepreneur", structure: { autonomo: "Sole trader", sociedad: "Local company", llc: "US LLC" } },
  fr: { best: "Structure gagnante", vsAuto: "Vs indépendant", vsSoc: "Vs société locale", currency: "Devise d'affichage", opts: "Régime spécial", tarifa: "Tarif plat", micro: "Micro-entrepreneur", structure: { autonomo: "Indépendant", sociedad: "Société locale", llc: "LLC US" } },
  de: { best: "Beste Struktur", vsAuto: "Vs Selbstständig", vsSoc: "Vs lokale GmbH", currency: "Anzeigewährung", opts: "Sonderregelung", tarifa: "Pauschaltarif", micro: "Micro-entrepreneur", structure: { autonomo: "Selbstständig", sociedad: "Lokale GmbH", llc: "US-LLC" } },
  pt: { best: "Estrutura vencedora", vsAuto: "Vs autônomo", vsSoc: "Vs sociedade local", currency: "Moeda de exibição", opts: "Regime especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autônomo", sociedad: "Sociedade local", llc: "LLC US" } },
  ca: { best: "Estructura guanyadora", vsAuto: "Davant d'autònom", vsSoc: "Davant de societat local", currency: "Divisa de visualització", opts: "Règim especial", tarifa: "Tarifa plana", micro: "Micro-entrepreneur", structure: { autonomo: "Autònom", sociedad: "Societat local", llc: "LLC US" } },
};

export function getCalculatorFidelityLabels(lang?: string | null): CalculatorFidelityLabels {
  return CALCULATOR_FIDELITY_I18N[resolveEmailLang(lang)];
}
