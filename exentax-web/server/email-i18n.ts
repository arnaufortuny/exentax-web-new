import { SUPPORTED_LANGS, type SupportedLang } from "./server-constants";

type Lang = SupportedLang;

export function resolveEmailLang(lang?: string | null): Lang {
  if (!lang) return "es";
  const normalized = lang.split("-")[0].toLowerCase();
  if (SUPPORTED_LANGS.includes(normalized)) return normalized as Lang;
  return "es";
}

interface EmailTranslations {
  booking: {
    label: string;
    heading: (name: string) => string;
    body1: string;
    body2: string;
    body2b?: string;
    dateLabel: string;
    timeLabel: string;
    formatLabel: string;
    formatValue: string;
    prepareTitle: string;
    prepareItems: string[];
    changeTime: string;
    ctaManage: string;
    ctaWhatsapp: string;
    honest: string;
    trackingNote?: string;
    signOff: string;
    unsubNote: string;
    privacyLabel: string;
  };
  reminder: {
    label: string;
    heading: (name: string) => string;
    body1: (time: string) => string;
    body2: string;
    body3: string;
    body4: string;
    body4b?: string;
    signOff: string;
    unsubNote: string;
  };
  calculator: {
    label: string;
    heading: string;
    body1: (localLabel: string, monthly: string, annual: string) => string;
    body1b?: string;
    payingLabel: string;
    withLLCLabel: string;
    savingsLabel: string;
    perYear: string;
    body2: string;
    body3: string;
    body3b?: string;
    body4: string;
    ctaButton: string;
    body5: string;
    honest: string;
    signOff: string;
    unsubNote: string;
    privacyLabel: string;
  };
  reschedule: {
    label: string;
    heading: (name: string) => string;
    body1: string;
    body2: string;
    dateLabel: string;
    timeLabel: string;
    formatLabel: string;
    formatValue: string;
    ctaManage: string;
    signOff: string;
    unsubNote: string;
  };
  cancellation: {
    label: string;
    heading: (name: string) => string;
    body1: string;
    body2: string;
    dateLabel: string;
    timeLabel: string;
    ctaRebook: string;
    signOff: string;
    unsubNote: string;
  };
  newsletter: {
    signOff: string;
    unsubNote: string;
    unsubLabel: string;
  };
  dateFormatter: (dateStr: string) => string;
  currencyFormatter: (amount: number) => string;
}

const translations: Record<Lang, EmailTranslations> = {
  es: {
    booking: {
      label: "Reserva confirmada",
      heading: (name) => `Hola, ${name}. Ya tenemos tu llamada reservada.`,
      body1: "Durante estos <strong>30 minutos</strong> vamos a analizar tu situación real: cómo estás facturando, desde dónde operas y si una estructura internacional encaja contigo o no.",
      body2: "No es una llamada comercial. Es una conversación directa para darte claridad.",
      body2b: "Nuestro equipo de asesores fiscales internacionales revisará tu caso concreto y te indicará exactamente qué opciones tienes disponibles.",
      dateLabel: "Fecha",
      timeLabel: "Hora (zona horaria España)",
      formatLabel: "Formato",
      formatValue: "Google Meet · Videollamada",
      prepareTitle: "Para aprovechar bien la sesión, piensa en",
      prepareItems: ["Cómo generas tus ingresos exactamente", "En qué país resides fiscalmente", "Cuánto estás facturando hoy", "Qué dudas concretas quieres resolver"],
      changeTime: "Si necesitas cambiar la hora, escríbenos por WhatsApp y lo ajustamos.",
      ctaManage: "Gestionar mi cita",
      ctaWhatsapp: "Escríbenos por WhatsApp",
      honest: "Si tras analizarlo vemos que una LLC no tiene sentido para ti, te lo diremos directamente.",
      trackingNote: "Guarda este email como referencia. Tu código de asesoría aparece al final del mensaje.",
      signOff: "Nos vemos pronto",
      unsubNote: "Has recibido este email porque reservaste una asesoría en exentax.com.",
      privacyLabel: "Privacidad",
    },
    reminder: {
      label: "Recordatorio",
      heading: (name) => `Hola, ${name}. Mañana hablamos.`,
      body1: (time) => `Mañana tenemos nuestra asesoría a las <strong>${time}</strong>.`,
      body2: "Te dejamos aquí el enlace directo para conectarte:",
      body3: "Si surge cualquier imprevisto, avísanos con tiempo y lo reorganizamos.",
      body4: "Nos vemos mañana para analizar tu estructura con calma.",
      body4b: "Recuerda tener a mano la información de tu facturación actual y las preguntas que quieras resolver.",
      signOff: "Hasta mañana",
      unsubNote: "Has recibido este recordatorio porque tienes una asesoría programada en exentax.com.",
    },
    calculator: {
      label: "Tu estimación fiscal",
      heading: "Hemos calculado tu escenario.",
      body1: (localLabel, monthly, annual) => `Con los datos que nos has facilitado como <strong>${localLabel}</strong> con ingresos brutos de <strong>${monthly}/mes (${annual}/año)</strong>, este es tu panorama fiscal actual.`,
      body1b: "Hemos analizado los datos de tu simulación para darte una visión clara de lo que podrías optimizar con una estructura LLC en Estados Unidos.",
      payingLabel: "Hoy estarías pagando aproximadamente",
      withLLCLabel: "Con una estructura LLC bien planteada",
      savingsLabel: "Ahorro estimado",
      perYear: "anuales",
      body2: "Esto no es una promesa automática. Es una simulación basada en tu información.",
      body3: "La diferencia suele estar en cómo se estructura la operativa, no en \"trucos\".",
      body3b: "Miles de profesionales digitales ya trabajan con una LLC en USA para optimizar legalmente su carga fiscal. Nosotros te acompañamos en todo el proceso.",
      body4: "Si quieres revisar tu caso con detalle y validar qué aplica realmente en tu situación, puedes reservar una asesoría estratégica:",
      ctaButton: "Reservar mi asesoría",
      body5: "Diseñar bien la estructura desde el principio cambia completamente el juego.",
      honest: "Si tras analizarlo vemos que una LLC no tiene sentido para ti, te lo diremos directamente.",
      signOff: "El equipo de Exentax",
      unsubNote: "Has recibido este email porque usaste la calculadora en exentax.com.",
      privacyLabel: "Privacidad",
    },
    reschedule: {
      label: "Cita reagendada",
      heading: (name) => `${name}, tu cita ha sido reagendada`,
      body1: "Tu asesoría estratégica ha sido reagendada correctamente. Aquí tienes los nuevos detalles de tu sesión.",
      body2: "Si necesitas volver a modificarla, puedes hacerlo desde el enlace de gestión.",
      dateLabel: "Nueva fecha",
      timeLabel: "Hora (horario España)",
      formatLabel: "Formato",
      formatValue: "Google Meet · Videollamada",
      ctaManage: "Gestionar mi cita",
      signOff: "Nos vemos pronto",
      unsubNote: "Has recibido este email porque reagendaste una asesoría en exentax.com.",
    },
    cancellation: {
      label: "Cita cancelada",
      heading: (name) => `${name}, tu cita ha sido cancelada`,
      body1: "Tu asesoría estratégica ha sido cancelada correctamente. Si cambiaste de opinión o simplemente necesitas otro horario, puedes reservar una nueva cita en cualquier momento.",
      body2: "Estos eran los detalles de la cita cancelada:",
      dateLabel: "Fecha",
      timeLabel: "Hora (horario España)",
      ctaRebook: "Reservar nueva cita",
      signOff: "Seguimos aquí cuando lo necesites",
      unsubNote: "Has recibido este email porque cancelaste una asesoría en exentax.com.",
    },
    newsletter: {
      signOff: "El equipo de Exentax",
      unsubNote: "Recibes este email porque te suscribiste a las novedades de Exentax.",
      unsubLabel: "Cancelar suscripción",
    },
    dateFormatter: formatDateEs,
    currencyFormatter: (amount) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
  en: {
    booking: {
      label: "Booking confirmed",
      heading: (name) => `Hi ${name}, your call is scheduled.`,
      body1: "During these <strong>30 minutes</strong> we'll analyze your real situation: how you're billing, where you operate from, and whether an international structure fits your case.",
      body2: "This is not a sales call. It's a direct conversation to give you clarity.",
      body2b: "Our team of international tax advisors will review your specific case and tell you exactly what options are available to you.",
      dateLabel: "Date",
      timeLabel: "Time (Spain timezone)",
      formatLabel: "Format",
      formatValue: "Google Meet · Video call",
      prepareTitle: "To make the most of the session, think about",
      prepareItems: ["How exactly you generate your income", "In which country you are tax resident", "How much you're billing today", "What specific questions you want to resolve"],
      changeTime: "If you need to change the time, write to us on WhatsApp and we'll adjust it.",
      ctaManage: "Manage my appointment",
      ctaWhatsapp: "Write to us on WhatsApp",
      honest: "If after analyzing your case we see that an LLC doesn't make sense for you, we'll tell you directly.",
      trackingNote: "Save this email for reference. Your consultation code appears at the bottom of this message.",
      signOff: "See you soon",
      unsubNote: "You received this email because you booked a consultation at exentax.com.",
      privacyLabel: "Privacy",
    },
    reminder: {
      label: "Reminder",
      heading: (name) => `Hi ${name}, we speak tomorrow.`,
      body1: (time) => `Tomorrow we have our consultation at <strong>${time}</strong>.`,
      body2: "Here is the direct link to connect:",
      body3: "If anything comes up, let us know in advance and we'll reschedule.",
      body4: "See you tomorrow to analyze your structure calmly.",
      body4b: "Remember to have your current billing information and any questions you want to resolve handy.",
      signOff: "See you tomorrow",
      unsubNote: "You received this reminder because you have a scheduled consultation at exentax.com.",
    },
    calculator: {
      label: "Your tax estimate",
      heading: "We've calculated your scenario.",
      body1: (localLabel, monthly, annual) => `Based on the data you provided as a <strong>${localLabel}</strong> with gross income of <strong>${monthly}/month (${annual}/year)</strong>, this is your current tax overview.`,
      body1b: "We've analyzed your simulation data to give you a clear picture of what you could optimize with a US LLC structure.",
      payingLabel: "You'd currently be paying approximately",
      withLLCLabel: "With a well-structured LLC",
      savingsLabel: "Estimated savings",
      perYear: "per year",
      body2: "This is not an automatic promise. It's a simulation based on your information.",
      body3: "The difference usually lies in how operations are structured, not in \"tricks\".",
      body3b: "Thousands of digital professionals already work with a US LLC to legally optimize their tax burden. We guide you through the entire process.",
      body4: "If you want to review your case in detail and validate what really applies to your situation, you can book a strategic consultation:",
      ctaButton: "Book my consultation",
      body5: "Designing the structure well from the beginning changes the game completely.",
      honest: "If after analyzing it we see that an LLC doesn't make sense for you, we'll tell you directly.",
      signOff: "The Exentax Team",
      unsubNote: "You received this email because you used the calculator at exentax.com.",
      privacyLabel: "Privacy",
    },
    reschedule: {
      label: "Appointment rescheduled",
      heading: (name) => `${name}, your appointment has been rescheduled`,
      body1: "Your strategic consultation has been rescheduled successfully. Here are the new details for your session.",
      body2: "If you need to modify it again, you can do so from the management link.",
      dateLabel: "New date",
      timeLabel: "Time (Spain timezone)",
      formatLabel: "Format",
      formatValue: "Google Meet · Video call",
      ctaManage: "Manage my appointment",
      signOff: "See you soon",
      unsubNote: "You received this email because you rescheduled a consultation at exentax.com.",
    },
    cancellation: {
      label: "Appointment cancelled",
      heading: (name) => `${name}, your appointment has been cancelled`,
      body1: "Your strategic consultation has been cancelled successfully. If you changed your mind or simply need a different time, you can book a new appointment at any time.",
      body2: "These were the details of the cancelled appointment:",
      dateLabel: "Date",
      timeLabel: "Time (Spain timezone)",
      ctaRebook: "Book new appointment",
      signOff: "We're here whenever you need us",
      unsubNote: "You received this email because you cancelled a consultation at exentax.com.",
    },
    newsletter: {
      signOff: "The Exentax Team",
      unsubNote: "You received this email because you subscribed to Exentax updates.",
      unsubLabel: "Unsubscribe",
    },
    dateFormatter: formatDateEn,
    currencyFormatter: (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
  fr: {
    booking: {
      label: "Réservation confirmée",
      heading: (name) => `Bonjour ${name}, votre appel est planifié.`,
      body1: "Pendant ces <strong>30 minutes</strong>, nous analyserons votre situation réelle : comment vous facturez, d'où vous opérez et si une structure internationale correspond à votre cas.",
      body2: "Ce n'est pas un appel commercial. C'est une conversation directe pour vous donner de la clarté.",
      body2b: "Notre équipe de conseillers fiscaux internationaux examinera votre cas spécifique et vous indiquera exactement les options disponibles.",
      dateLabel: "Date",
      timeLabel: "Heure (fuseau horaire Espagne)",
      formatLabel: "Format",
      formatValue: "Google Meet · Appel vidéo",
      prepareTitle: "Pour profiter au mieux de la session, pensez à",
      prepareItems: ["Comment vous générez exactement vos revenus", "Dans quel pays vous résidez fiscalement", "Combien vous facturez aujourd'hui", "Quelles questions spécifiques vous voulez résoudre"],
      changeTime: "Si vous devez changer l'heure, écrivez-nous sur WhatsApp et nous ajusterons.",
      ctaManage: "Gérer mon rendez-vous",
      ctaWhatsapp: "Écrivez-nous sur WhatsApp",
      honest: "Si après analyse nous voyons qu'une LLC n'a pas de sens pour vous, nous vous le dirons directement.",
      trackingNote: "Conservez cet email comme référence. Votre code de consultation apparaît en bas du message.",
      signOff: "À bientôt",
      unsubNote: "Vous avez reçu cet email car vous avez réservé une consultation sur exentax.com.",
      privacyLabel: "Confidentialité",
    },
    reminder: {
      label: "Rappel",
      heading: (name) => `Bonjour ${name}, nous parlons demain.`,
      body1: (time) => `Demain nous avons notre consultation à <strong>${time}</strong>.`,
      body2: "Voici le lien direct pour vous connecter :",
      body3: "Si un imprévu survient, prévenez-nous à l'avance et nous réorganiserons.",
      body4: "À demain pour analyser votre structure calmement.",
      body4b: "N'oubliez pas d'avoir sous la main vos informations de facturation et les questions que vous souhaitez résoudre.",
      signOff: "À demain",
      unsubNote: "Vous avez reçu ce rappel car vous avez une consultation programmée sur exentax.com.",
    },
    calculator: {
      label: "Votre estimation fiscale",
      heading: "Nous avons calculé votre scénario.",
      body1: (localLabel, monthly, annual) => `Avec les données fournies en tant que <strong>${localLabel}</strong> avec des revenus bruts de <strong>${monthly}/mois (${annual}/an)</strong>, voici votre panorama fiscal actuel.`,
      body1b: "Nous avons analysé les données de votre simulation pour vous donner une vision claire de ce que vous pourriez optimiser avec une structure LLC aux États-Unis.",
      payingLabel: "Vous paieriez actuellement environ",
      withLLCLabel: "Avec une LLC bien structurée",
      savingsLabel: "Économie estimée",
      perYear: "par an",
      body2: "Ceci n'est pas une promesse automatique. C'est une simulation basée sur vos informations.",
      body3: "La différence réside généralement dans la structuration des opérations, pas dans des \"astuces\".",
      body3b: "Des milliers de professionnels du numérique travaillent déjà avec une LLC américaine pour optimiser légalement leur charge fiscale. Nous vous accompagnons tout au long du processus.",
      body4: "Si vous souhaitez examiner votre cas en détail, vous pouvez réserver une consultation stratégique :",
      ctaButton: "Réserver ma consultation",
      body5: "Bien concevoir la structure dès le départ change complètement la donne.",
      honest: "Si après analyse nous voyons qu'une LLC n'a pas de sens pour vous, nous vous le dirons directement.",
      signOff: "L'équipe Exentax",
      unsubNote: "Vous avez reçu cet email car vous avez utilisé le calculateur sur exentax.com.",
      privacyLabel: "Confidentialité",
    },
    reschedule: {
      label: "Rendez-vous reprogrammé",
      heading: (name) => `${name}, votre rendez-vous a été reprogrammé`,
      body1: "Votre consultation stratégique a été reprogrammée avec succès. Voici les nouveaux détails de votre session.",
      body2: "Si vous devez la modifier à nouveau, vous pouvez le faire depuis le lien de gestion.",
      dateLabel: "Nouvelle date",
      timeLabel: "Heure (fuseau horaire Espagne)",
      formatLabel: "Format",
      formatValue: "Google Meet · Appel vidéo",
      ctaManage: "Gérer mon rendez-vous",
      signOff: "À bientôt",
      unsubNote: "Vous avez reçu cet email car vous avez reprogrammé une consultation sur exentax.com.",
    },
    cancellation: {
      label: "Rendez-vous annulé",
      heading: (name) => `${name}, votre rendez-vous a été annulé`,
      body1: "Votre consultation stratégique a été annulée avec succès. Si vous avez changé d'avis ou avez besoin d'un autre horaire, vous pouvez réserver un nouveau rendez-vous à tout moment.",
      body2: "Voici les détails du rendez-vous annulé :",
      dateLabel: "Date",
      timeLabel: "Heure (fuseau horaire Espagne)",
      ctaRebook: "Réserver un nouveau rendez-vous",
      signOff: "Nous sommes là quand vous en avez besoin",
      unsubNote: "Vous avez reçu cet email car vous avez annulé une consultation sur exentax.com.",
    },
    newsletter: {
      signOff: "L'équipe Exentax",
      unsubNote: "Vous recevez cet email car vous êtes abonné(e) aux nouveautés Exentax.",
      unsubLabel: "Se désabonner",
    },
    dateFormatter: formatDateFr,
    currencyFormatter: (amount) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
  de: {
    booking: {
      label: "Buchung bestätigt",
      heading: (name) => `Hallo ${name}, Ihr Anruf ist geplant.`,
      body1: "In diesen <strong>30 Minuten</strong> analysieren wir Ihre reale Situation: wie Sie abrechnen, wo Sie tätig sind und ob eine internationale Struktur zu Ihrem Fall passt.",
      body2: "Dies ist kein Verkaufsgespräch. Es ist ein direktes Gespräch, um Ihnen Klarheit zu geben.",
      body2b: "Unser Team internationaler Steuerberater wird Ihren spezifischen Fall prüfen und Ihnen genau sagen, welche Optionen Ihnen zur Verfügung stehen.",
      dateLabel: "Datum",
      timeLabel: "Uhrzeit (Zeitzone Spanien)",
      formatLabel: "Format",
      formatValue: "Google Meet · Videogespräch",
      prepareTitle: "Um die Sitzung optimal zu nutzen, denken Sie an",
      prepareItems: ["Wie genau Sie Ihr Einkommen generieren", "In welchem Land Sie steuerlich ansässig sind", "Wie viel Sie heute abrechnen", "Welche konkreten Fragen Sie klären möchten"],
      changeTime: "Wenn Sie die Zeit ändern müssen, schreiben Sie uns auf WhatsApp und wir passen sie an.",
      ctaManage: "Meinen Termin verwalten",
      ctaWhatsapp: "Schreiben Sie uns auf WhatsApp",
      honest: "Wenn wir nach der Analyse sehen, dass eine LLC für Sie keinen Sinn ergibt, sagen wir Ihnen das direkt.",
      trackingNote: "Bewahren Sie diese E-Mail als Referenz auf. Ihr Beratungscode erscheint am Ende dieser Nachricht.",
      signOff: "Bis bald",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com gebucht haben.",
      privacyLabel: "Datenschutz",
    },
    reminder: {
      label: "Erinnerung",
      heading: (name) => `Hallo ${name}, morgen sprechen wir.`,
      body1: (time) => `Morgen haben wir unsere Beratung um <strong>${time}</strong>.`,
      body2: "Hier ist der direkte Link zum Verbinden:",
      body3: "Falls etwas dazwischenkommt, informieren Sie uns rechtzeitig und wir organisieren um.",
      body4: "Bis morgen, um Ihre Struktur in Ruhe zu analysieren.",
      body4b: "Vergessen Sie nicht, Ihre aktuellen Abrechnungsinformationen und Ihre Fragen bereit zu halten.",
      signOff: "Bis morgen",
      unsubNote: "Sie haben diese Erinnerung erhalten, weil Sie eine geplante Beratung auf exentax.com haben.",
    },
    calculator: {
      label: "Ihre Steuerberechnung",
      heading: "Wir haben Ihr Szenario berechnet.",
      body1: (localLabel, monthly, annual) => `Basierend auf den Daten, die Sie als <strong>${localLabel}</strong> mit Bruttoeinkommen von <strong>${monthly}/Monat (${annual}/Jahr)</strong> angegeben haben, ist dies Ihre aktuelle Steuerübersicht.`,
      body1b: "Wir haben Ihre Simulationsdaten analysiert, um Ihnen ein klares Bild davon zu geben, was Sie mit einer US-LLC-Struktur optimieren könnten.",
      payingLabel: "Sie würden derzeit ungefähr zahlen",
      withLLCLabel: "Mit einer gut strukturierten LLC",
      savingsLabel: "Geschätzte Ersparnis",
      perYear: "pro Jahr",
      body2: "Dies ist kein automatisches Versprechen. Es ist eine Simulation basierend auf Ihren Informationen.",
      body3: "Der Unterschied liegt meist darin, wie die Operationen strukturiert sind, nicht in \"Tricks\".",
      body3b: "Tausende digitale Fachleute arbeiten bereits mit einer US-LLC, um ihre Steuerlast legal zu optimieren. Wir begleiten Sie durch den gesamten Prozess.",
      body4: "Wenn Sie Ihren Fall im Detail prüfen möchten, können Sie eine strategische Beratung buchen:",
      ctaButton: "Meine Beratung buchen",
      body5: "Die Struktur von Anfang an richtig zu gestalten, verändert das Spiel komplett.",
      honest: "Wenn wir nach der Analyse sehen, dass eine LLC für Sie keinen Sinn ergibt, sagen wir Ihnen das direkt.",
      signOff: "Das Exentax-Team",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie den Rechner auf exentax.com verwendet haben.",
      privacyLabel: "Datenschutz",
    },
    reschedule: {
      label: "Termin verschoben",
      heading: (name) => `${name}, Ihr Termin wurde verschoben`,
      body1: "Ihre strategische Beratung wurde erfolgreich verschoben. Hier sind die neuen Details Ihrer Sitzung.",
      body2: "Falls Sie den Termin erneut ändern müssen, können Sie dies über den Verwaltungslink tun.",
      dateLabel: "Neues Datum",
      timeLabel: "Uhrzeit (Zeitzone Spanien)",
      formatLabel: "Format",
      formatValue: "Google Meet · Videoanruf",
      ctaManage: "Meinen Termin verwalten",
      signOff: "Bis bald",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com umgebucht haben.",
    },
    cancellation: {
      label: "Termin storniert",
      heading: (name) => `${name}, Ihr Termin wurde storniert`,
      body1: "Ihre strategische Beratung wurde erfolgreich storniert. Falls Sie es sich anders überlegt haben oder einen anderen Termin benötigen, können Sie jederzeit einen neuen buchen.",
      body2: "Dies waren die Details des stornierten Termins:",
      dateLabel: "Datum",
      timeLabel: "Uhrzeit (Zeitzone Spanien)",
      ctaRebook: "Neuen Termin buchen",
      signOff: "Wir sind für Sie da, wenn Sie uns brauchen",
      unsubNote: "Sie haben diese E-Mail erhalten, weil Sie eine Beratung auf exentax.com storniert haben.",
    },
    newsletter: {
      signOff: "Das Exentax-Team",
      unsubNote: "Sie erhalten diese E-Mail, weil Sie die Exentax-Neuigkeiten abonniert haben.",
      unsubLabel: "Abbestellen",
    },
    dateFormatter: formatDateDe,
    currencyFormatter: (amount) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
  pt: {
    booking: {
      label: "Reserva confirmada",
      heading: (name) => `Olá ${name}, a sua chamada está agendada.`,
      body1: "Durante estes <strong>30 minutos</strong> vamos analisar a sua situação real: como fatura, de onde opera e se uma estrutura internacional se adequa ao seu caso.",
      body2: "Não é uma chamada comercial. É uma conversa direta para lhe dar clareza.",
      body2b: "A nossa equipa de consultores fiscais internacionais irá analisar o seu caso específico e indicar-lhe exatamente que opções tem disponíveis.",
      dateLabel: "Data",
      timeLabel: "Hora (fuso horário Espanha)",
      formatLabel: "Formato",
      formatValue: "Google Meet · Videochamada",
      prepareTitle: "Para aproveitar ao máximo a sessão, pense em",
      prepareItems: ["Como gera exatamente os seus rendimentos", "Em que país reside fiscalmente", "Quanto está a faturar hoje", "Que dúvidas concretas quer resolver"],
      changeTime: "Se precisar de alterar a hora, escreva-nos no WhatsApp e ajustamos.",
      ctaManage: "Gerir a minha consulta",
      ctaWhatsapp: "Escreva-nos no WhatsApp",
      honest: "Se após a análise virmos que uma LLC não faz sentido para si, diremos diretamente.",
      trackingNote: "Guarde este email como referência. O seu código de consultoria aparece no final da mensagem.",
      signOff: "Até breve",
      unsubNote: "Recebeu este email porque marcou uma consultoria em exentax.com.",
      privacyLabel: "Privacidade",
    },
    reminder: {
      label: "Lembrete",
      heading: (name) => `Olá ${name}, amanhã falamos.`,
      body1: (time) => `Amanhã temos a nossa consultoria às <strong>${time}</strong>.`,
      body2: "Aqui fica o link direto para se conectar:",
      body3: "Se surgir algum imprevisto, avise-nos com antecedência e reorganizamos.",
      body4: "Até amanhã para analisar a sua estrutura com calma.",
      body4b: "Não se esqueça de ter à mão as informações da sua faturação atual e as questões que pretende resolver.",
      signOff: "Até amanhã",
      unsubNote: "Recebeu este lembrete porque tem uma consultoria agendada em exentax.com.",
    },
    calculator: {
      label: "A sua estimativa fiscal",
      heading: "Calculámos o seu cenário.",
      body1: (localLabel, monthly, annual) => `Com os dados fornecidos como <strong>${localLabel}</strong> com rendimentos brutos de <strong>${monthly}/mês (${annual}/ano)</strong>, este é o seu panorama fiscal atual.`,
      body1b: "Analisámos os dados da sua simulação para lhe dar uma visão clara do que poderia otimizar com uma estrutura LLC nos Estados Unidos.",
      payingLabel: "Atualmente estaria a pagar aproximadamente",
      withLLCLabel: "Com uma LLC bem estruturada",
      savingsLabel: "Poupança estimada",
      perYear: "por ano",
      body2: "Isto não é uma promessa automática. É uma simulação baseada nas suas informações.",
      body3: "A diferença costuma estar em como as operações são estruturadas, não em \"truques\".",
      body3b: "Milhares de profissionais digitais já trabalham com uma LLC americana para otimizar legalmente a sua carga fiscal. Acompanhamo-lo em todo o processo.",
      body4: "Se quiser rever o seu caso em detalhe, pode marcar uma consultoria estratégica:",
      ctaButton: "Marcar a minha consultoria",
      body5: "Desenhar bem a estrutura desde o início muda completamente o jogo.",
      honest: "Se após a análise virmos que uma LLC não faz sentido para si, diremos diretamente.",
      signOff: "A equipa Exentax",
      unsubNote: "Recebeu este email porque usou a calculadora em exentax.com.",
      privacyLabel: "Privacidade",
    },
    reschedule: {
      label: "Consulta reagendada",
      heading: (name) => `${name}, a sua consulta foi reagendada`,
      body1: "A sua consulta estratégica foi reagendada com sucesso. Seguem os novos detalhes da sessão.",
      body2: "Se precisar de a modificar novamente, pode fazê-lo a partir do link de gestão.",
      dateLabel: "Nova data",
      timeLabel: "Hora (fuso horário Espanha)",
      formatLabel: "Formato",
      formatValue: "Google Meet · Videochamada",
      ctaManage: "Gerir a minha consulta",
      signOff: "Até breve",
      unsubNote: "Recebeu este email porque reagendou uma consulta em exentax.com.",
    },
    cancellation: {
      label: "Consulta cancelada",
      heading: (name) => `${name}, a sua consulta foi cancelada`,
      body1: "A sua consulta estratégica foi cancelada com sucesso. Se mudou de ideias ou precisa de outro horário, pode agendar uma nova consulta a qualquer momento.",
      body2: "Estes eram os detalhes da consulta cancelada:",
      dateLabel: "Data",
      timeLabel: "Hora (fuso horário Espanha)",
      ctaRebook: "Agendar nova consulta",
      signOff: "Estamos aqui quando precisar",
      unsubNote: "Recebeu este email porque cancelou uma consulta em exentax.com.",
    },
    newsletter: {
      signOff: "A equipa Exentax",
      unsubNote: "Recebe este email porque subscreveu as novidades da Exentax.",
      unsubLabel: "Cancelar subscrição",
    },
    dateFormatter: formatDatePt,
    currencyFormatter: (amount) => new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount),
  },
  ca: {
    booking: {
      label: "Reserva confirmada",
      heading: (name) => `Hola, ${name}. Ja tenim la teva trucada reservada.`,
      body1: "Durant aquests <strong>30 minuts</strong> analitzarem la teva situació real: com estàs facturant, des d'on operes i si una estructura internacional encaixa amb tu o no.",
      body2: "No és una trucada comercial. És una conversa directa per donar-te claredat.",
      body2b: "El nostre equip d'assessors fiscals internacionals revisarà el teu cas concret i t'indicarà exactament quines opcions tens disponibles.",
      dateLabel: "Data",
      timeLabel: "Hora (zona horària Espanya)",
      formatLabel: "Format",
      formatValue: "Google Meet · Videotrucada",
      prepareTitle: "Per aprofitar bé la sessió, pensa en",
      prepareItems: ["Com generes els teus ingressos exactament", "En quin país resideixes fiscalment", "Quant estàs facturant avui", "Quins dubtes concrets vols resoldre"],
      changeTime: "Si necessites canviar l'hora, escriu-nos per WhatsApp i ho ajustem.",
      ctaManage: "Gestionar la meva cita",
      ctaWhatsapp: "Escriu-nos per WhatsApp",
      honest: "Si després d'analitzar-ho veiem que una LLC no té sentit per a tu, t'ho direm directament.",
      trackingNote: "Guarda aquest email com a referència. El teu codi d'assessoria apareix al final del missatge.",
      signOff: "Ens veiem aviat",
      unsubNote: "Has rebut aquest email perquè has reservat una assessoria a exentax.com.",
      privacyLabel: "Privadesa",
    },
    reminder: {
      label: "Recordatori",
      heading: (name) => `Hola, ${name}. Demà parlem.`,
      body1: (time) => `Demà tenim la nostra assessoria a les <strong>${time}</strong>.`,
      body2: "Et deixem aquí l'enllaç directe per connectar-te:",
      body3: "Si sorgeix qualsevol imprevist, avisa'ns amb temps i ho reorganitzem.",
      body4: "Ens veiem demà per analitzar la teva estructura amb calma.",
      body4b: "Recorda tenir a mà la informació de la teva facturació actual i les preguntes que vulguis resoldre.",
      signOff: "Fins demà",
      unsubNote: "Has rebut aquest recordatori perquè tens una assessoria programada a exentax.com.",
    },
    calculator: {
      label: "La teva estimació fiscal",
      heading: "Hem calculat el teu escenari.",
      body1: (localLabel, monthly, annual) => `Amb les dades que ens has facilitat com a <strong>${localLabel}</strong> amb ingressos bruts de <strong>${monthly}/mes (${annual}/any)</strong>, aquest és el teu panorama fiscal actual.`,
      body1b: "Hem analitzat les dades de la teva simulació per donar-te una visió clara del que podries optimitzar amb una estructura LLC als Estats Units.",
      payingLabel: "Avui estaries pagant aproximadament",
      withLLCLabel: "Amb una estructura LLC ben plantejada",
      savingsLabel: "Estalvi estimat",
      perYear: "anuals",
      body2: "Això no és una promesa automàtica. És una simulació basada en la teva informació.",
      body3: "La diferència sol estar en com s'estructura l'operativa, no en \"trucs\".",
      body3b: "Milers de professionals digitals ja treballen amb una LLC americana per optimitzar legalment la seva càrrega fiscal. T'acompanyem en tot el procés.",
      body4: "Si vols revisar el teu cas amb detall i validar què s'aplica realment a la teva situació, pots reservar una assessoria:",
      ctaButton: "Reservar la meva assessoria",
      body5: "Dissenyar bé l'estructura des del principi canvia completament el joc.",
      honest: "Si després d'analitzar-ho veiem que una LLC no té sentit per a tu, t'ho direm directament.",
      signOff: "L'equip d'Exentax",
      unsubNote: "Has rebut aquest email perquè has fet servir la calculadora a exentax.com.",
      privacyLabel: "Privadesa",
    },
    reschedule: {
      label: "Cita reagendada",
      heading: (name) => `${name}, la teva cita ha estat reagendada`,
      body1: "La teva assessoria estratègica ha estat reagendada correctament. Aquí tens els nous detalls de la teva sessió.",
      body2: "Si necessites tornar-la a modificar, pots fer-ho des de l'enllaç de gestió.",
      dateLabel: "Nova data",
      timeLabel: "Hora (horari Espanya)",
      formatLabel: "Format",
      formatValue: "Google Meet · Videotrucada",
      ctaManage: "Gestionar la meva cita",
      signOff: "Ens veiem aviat",
      unsubNote: "Has rebut aquest email perquè has reagendat una assessoria a exentax.com.",
    },
    cancellation: {
      label: "Cita cancel·lada",
      heading: (name) => `${name}, la teva cita ha estat cancel·lada`,
      body1: "La teva assessoria estratègica ha estat cancel·lada correctament. Si has canviat d'opinió o simplement necessites un altre horari, pots reservar una nova cita en qualsevol moment.",
      body2: "Aquests eren els detalls de la cita cancel·lada:",
      dateLabel: "Data",
      timeLabel: "Hora (horari Espanya)",
      ctaRebook: "Reservar nova cita",
      signOff: "Seguim aquí quan ho necessitis",
      unsubNote: "Has rebut aquest email perquè has cancel·lat una assessoria a exentax.com.",
    },
    newsletter: {
      signOff: "L'equip d'Exentax",
      unsubNote: "Reps aquest email perquè et vas subscriure a les novetats d'Exentax.",
      unsubLabel: "Cancel·lar subscripció",
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

export { type EmailTranslations, type Lang };
