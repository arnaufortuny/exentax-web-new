import { SUPPORTED_LANGS, type SupportedLang, BRAND_NAME } from "./server-constants";

export function resolveEmailLang(lang?: string | null): SupportedLang {
  if (!lang) return "es";
  const normalized = lang.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.includes(normalized)) return normalized as SupportedLang;
  return "es";
}

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
    subjectPrefix: string;
    heading: (name: string) => string;
    intro: string;
    timeLabel: string;
    directTitle: string;
    directDesc: string;
    prepareTitle: string;
    prepareItems: string[];
    prepareNote: string;
    imprevisto: string;
    closing: string;
    unsubNote: string;
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
  newsletterWelcome: {
    subject: string;
    heading: string;
    intro: string;
    aboutTitle: string;
    aboutItems: string[];
    cadenceNote: string;
    ctaIntro: string;
    ctaButton: string;
    ctaDesc: string;
    closing: string;
    unsubNote: string;
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
      subjectPrefix: "Mañana vemos tu caso",
      heading: (name) => `Hola ${name},`,
      intro: "Mañana tenemos la asesoría.",
      timeLabel: "Hora",
      directTitle: "La idea es ir al punto.",
      directDesc: "Ver cómo estás operando, qué estás pagando y si hay margen real de mejora.",
      prepareTitle: "Si puedes, ven con una idea clara de:",
      prepareItems: [
        "Cómo generas ingresos",
        "Dónde resides",
        "Cómo cobras actualmente",
        "Qué estás pagando",
      ],
      prepareNote: "Con eso en pocos minutos podemos darte una visión bastante clara.",
      imprevisto: "Si te surge cualquier imprevisto:",
      closing: "Nos vemos mañana,",
      unsubNote: "Has recibido este recordatorio porque tienes una asesoría programada en exentax.com.",
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
    newsletterWelcome: {
      subject: "Bienvenido a Exentax — empezamos contigo",
      heading: "Hola,",
      intro: "Gracias por suscribirte. A partir de ahora recibirás nuestros análisis sobre cómo estructurar bien una actividad internacional, sin teoría innecesaria y sin promesas vacías.",
      aboutTitle: "Qué te vamos a enviar",
      aboutItems: [
        "Cambios reales en regulación internacional (CRS, FATCA, DAC) y qué implican para tu LLC",
        "Cómo organizar la operativa para cobrar y mover dinero sin fricción",
        "Casos prácticos de no residentes que ya operan con estructura en EE.UU.",
        "Errores comunes que conviene evitar desde el principio",
      ],
      cadenceNote: "Solo te escribiremos cuando tengamos algo útil que aportar. Sin saturar la bandeja de entrada.",
      ctaIntro: "Si quieres ver cuanto antes cómo encajaría todo en tu caso:",
      ctaButton: "Reservar asesoría",
      ctaDesc: "Lo revisamos contigo y te decimos directamente qué tiene sentido y qué no.",
      closing: "Bienvenido a bordo,",
      unsubNote: "Has recibido este email porque te suscribiste a nuestro boletín en exentax.com.",
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
      subjectPrefix: "Tomorrow we review your case",
      heading: (name) => `Hi ${name},`,
      intro: "Tomorrow we have the consultation.",
      timeLabel: "Time",
      directTitle: "We'll get straight to the point.",
      directDesc: "We'll look at how you're operating, what you're paying, and whether there's real room for improvement.",
      prepareTitle: "If you can, come with a clear idea of:",
      prepareItems: [
        "How you generate income",
        "Where you reside",
        "How you currently get paid",
        "What you're paying in taxes",
      ],
      prepareNote: "With that, in just a few minutes we can give you a fairly clear picture.",
      imprevisto: "If something comes up:",
      closing: "See you tomorrow,",
      unsubNote: "You received this reminder because you have a consultation scheduled at exentax.com.",
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
    newsletterWelcome: {
      subject: "Welcome to Exentax — let's get started",
      heading: "Hi,",
      intro: "Thanks for subscribing. From now on you'll receive our analysis on how to properly structure an international activity, with no unnecessary theory and no empty promises.",
      aboutTitle: "What we'll be sending",
      aboutItems: [
        "Real changes in international regulation (CRS, FATCA, DAC) and what they mean for your LLC",
        "How to set up operations to collect and move money without friction",
        "Practical cases of non-residents already operating with a US structure",
        "Common mistakes worth avoiding from the start",
      ],
      cadenceNote: "We only write when we have something genuinely useful to share. No inbox flooding.",
      ctaIntro: "If you'd rather see how it would all fit your case sooner:",
      ctaButton: "Book a consultation",
      ctaDesc: "We'll review it with you and tell you straight what makes sense and what doesn't.",
      closing: "Welcome on board,",
      unsubNote: "You received this email because you subscribed to our newsletter at exentax.com.",
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
      subjectPrefix: "Demain nous voyons votre cas",
      heading: (name) => `Bonjour ${name},`,
      intro: "Demain nous avons la consultation.",
      timeLabel: "Heure",
      directTitle: "L'idée est d'aller droit au but.",
      directDesc: "Voir comment vous opérez, ce que vous payez et s'il y a une marge réelle d'amélioration.",
      prepareTitle: "Si possible, venez avec une idée claire de :",
      prepareItems: [
        "Comment vous générez des revenus",
        "Où vous résidez",
        "Comment vous encaissez actuellement",
        "Ce que vous payez",
      ],
      prepareNote: "Avec cela, en quelques minutes nous pouvons vous donner une vision assez claire.",
      imprevisto: "Si un imprévu survient :",
      closing: "À demain,",
      unsubNote: "Vous avez reçu ce rappel car vous avez une consultation programmée sur exentax.com.",
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
    newsletterWelcome: {
      subject: "Bienvenue chez Exentax — on démarre avec vous",
      heading: "Bonjour,",
      intro: "Merci pour votre inscription. À partir de maintenant, vous recevrez nos analyses sur la manière de bien structurer une activité internationale, sans théorie inutile et sans promesses vides.",
      aboutTitle: "Ce que nous allons vous envoyer",
      aboutItems: [
        "Changements réels de la réglementation internationale (CRS, FATCA, DAC) et leurs implications pour votre LLC",
        "Comment préparer l'opérationnel pour encaisser et déplacer des fonds sans friction",
        "Cas pratiques de non-résidents qui opèrent déjà avec une structure aux États-Unis",
        "Erreurs courantes qu'il vaut mieux éviter dès le départ",
      ],
      cadenceNote: "Nous n'écrivons que lorsque nous avons quelque chose de réellement utile à partager. Pas de boîte de réception saturée.",
      ctaIntro: "Si vous préférez voir rapidement comment cela s'appliquerait à votre cas :",
      ctaButton: "Réserver une consultation",
      ctaDesc: "Nous le revoyons avec vous et vous disons clairement ce qui a du sens et ce qui n'en a pas.",
      closing: "Bienvenue à bord,",
      unsubNote: "Vous avez reçu cet email car vous vous êtes inscrit à notre newsletter sur exentax.com.",
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
      subjectPrefix: "Morgen besprechen wir Ihren Fall",
      heading: (name) => `Hallo ${name},`,
      intro: "Morgen haben wir die Beratung.",
      timeLabel: "Uhrzeit",
      directTitle: "Die Idee ist, direkt zum Punkt zu kommen.",
      directDesc: "Wir schauen, wie Sie arbeiten, was Sie zahlen und ob es echten Verbesserungsspielraum gibt.",
      prepareTitle: "Wenn möglich, kommen Sie mit einer klaren Vorstellung von:",
      prepareItems: [
        "Wie Sie Einkommen generieren",
        "Wo Sie ansässig sind",
        "Wie Sie derzeit kassieren",
        "Was Sie zahlen",
      ],
      prepareNote: "Damit können wir Ihnen in wenigen Minuten ein recht klares Bild geben.",
      imprevisto: "Falls etwas dazwischenkommt:",
      closing: "Bis morgen,",
      unsubNote: "Sie haben diese Erinnerung erhalten, weil Sie eine Beratung auf exentax.com geplant haben.",
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
    newsletterWelcome: {
      subject: "Willkommen bei Exentax — wir starten mit Ihnen",
      heading: "Hallo,",
      intro: "Vielen Dank für Ihre Anmeldung. Ab sofort erhalten Sie unsere Analysen dazu, wie sich eine internationale Tätigkeit sauber strukturieren lässt — ohne überflüssige Theorie und ohne leere Versprechungen.",
      aboutTitle: "Was Sie von uns bekommen",
      aboutItems: [
        "Reale Änderungen der internationalen Regulierung (CRS, FATCA, DAC) und ihre Auswirkungen auf Ihre LLC",
        "Wie der Betrieb für reibungslosen Zahlungseingang und Geldtransfer vorbereitet wird",
        "Praxisfälle von Nichtansässigen, die bereits mit einer US-Struktur arbeiten",
        "Häufige Fehler, die sich von Anfang an vermeiden lassen",
      ],
      cadenceNote: "Wir schreiben Ihnen nur, wenn wir wirklich etwas Nützliches beizutragen haben. Kein überfülltes Postfach.",
      ctaIntro: "Wenn Sie zügig sehen möchten, wie das auf Ihren Fall passt:",
      ctaButton: "Beratung buchen",
      ctaDesc: "Wir besprechen es mit Ihnen und sagen Ihnen klar, was Sinn ergibt und was nicht.",
      closing: "Willkommen an Bord,",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie unseren Newsletter auf exentax.com abonniert haben.",
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
      subjectPrefix: "Amanhã vemos o seu caso",
      heading: (name) => `Olá ${name},`,
      intro: "Amanhã temos a consultoria.",
      timeLabel: "Hora",
      directTitle: "A ideia é ir direto ao ponto.",
      directDesc: "Ver como está a operar, o que está a pagar e se há margem real de melhoria.",
      prepareTitle: "Se puder, venha com uma ideia clara de:",
      prepareItems: [
        "Como gera rendimentos",
        "Onde reside",
        "Como recebe atualmente",
        "O que está a pagar",
      ],
      prepareNote: "Com isso, em poucos minutos podemos dar-lhe uma visão bastante clara.",
      imprevisto: "Se surgir algum imprevisto:",
      closing: "Até amanhã,",
      unsubNote: "Recebeu este lembrete porque tem uma consultoria agendada em exentax.com.",
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
    newsletterWelcome: {
      subject: "Bem-vindo à Exentax — começamos consigo",
      heading: "Olá,",
      intro: "Obrigado por se subscrever. A partir de agora vai receber as nossas análises sobre como estruturar bem uma atividade internacional, sem teoria desnecessária e sem promessas vazias.",
      aboutTitle: "O que lhe vamos enviar",
      aboutItems: [
        "Alterações reais na regulação internacional (CRS, FATCA, DAC) e o que implicam para a sua LLC",
        "Como preparar a operação para receber e mover dinheiro sem fricção",
        "Casos práticos de não residentes que já operam com estrutura nos EUA",
        "Erros comuns que convém evitar desde o início",
      ],
      cadenceNote: "Só lhe escrevemos quando tivermos algo realmente útil para partilhar. Sem encher a caixa de entrada.",
      ctaIntro: "Se quiser ver quanto antes como tudo encaixaria no seu caso:",
      ctaButton: "Marcar consultoria",
      ctaDesc: "Revemos consigo e dizemos-lhe diretamente o que faz sentido e o que não.",
      closing: "Bem-vindo a bordo,",
      unsubNote: "Recebeu este email porque se subscreveu na nossa newsletter em exentax.com.",
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
      subjectPrefix: "Demà veiem el teu cas",
      heading: (name) => `Hola ${name},`,
      intro: "Demà tenim l'assessoria.",
      timeLabel: "Hora",
      directTitle: "La idea és anar al gra.",
      directDesc: "Veure com estàs operant, què estàs pagant i si hi ha marge real de millora.",
      prepareTitle: "Si pots, vine amb una idea clara de:",
      prepareItems: [
        "Com generes ingressos",
        "On resideixes",
        "Com cobres actualment",
        "Què estàs pagant",
      ],
      prepareNote: "Amb això en pocs minuts podem donar-te una visió bastant clara.",
      imprevisto: "Si et sorgeix qualsevol imprevist:",
      closing: "Ens veiem demà,",
      unsubNote: "Has rebut aquest recordatori perquè tens una assessoria programada a exentax.com.",
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
    newsletterWelcome: {
      subject: "Benvingut a Exentax — comencem amb tu",
      heading: "Hola,",
      intro: "Gràcies per subscriure't. A partir d'ara rebràs les nostres anàlisis sobre com estructurar bé una activitat internacional, sense teoria innecessària ni promeses buides.",
      aboutTitle: "Què t'enviarem",
      aboutItems: [
        "Canvis reals en regulació internacional (CRS, FATCA, DAC) i què impliquen per a la teva LLC",
        "Com deixar l'operativa preparada per cobrar i moure diners sense fricció",
        "Casos pràctics de no residents que ja operen amb estructura als EUA",
        "Errors comuns que convé evitar des del principi",
      ],
      cadenceNote: "Només t'escriurem quan tinguem alguna cosa realment útil a aportar. Sense saturar la safata d'entrada.",
      ctaIntro: "Si vols veure ben aviat com encaixaria tot en el teu cas:",
      ctaButton: "Reservar assessoria",
      ctaDesc: "Ho revisem amb tu i et diem directament què té sentit i què no.",
      closing: "Benvingut a bord,",
      unsubNote: "Has rebut aquest email perquè t'has subscrit al nostre butlletí a exentax.com.",
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
