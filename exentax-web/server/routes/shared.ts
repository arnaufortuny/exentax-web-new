import { SUPPORTED_LANGS } from "../server-constants";

const BACKEND_I18N: Record<string, Record<string, string>> = {
  validationFailed: {
    es: "Error de validacion", en: "Validation failed", fr: "Echec de la validation",
    de: "Validierung fehlgeschlagen", pt: "Falha na validacao", ca: "Error de validacio",
  },
  rateLimited: {
    es: "Demasiadas solicitudes", en: "Too many requests", fr: "Trop de requetes",
    de: "Zu viele Anfragen", pt: "Muitas solicitacoes", ca: "Massa sol-licituds",
  },
  notFound: {
    es: "No encontrado", en: "Not found", fr: "Non trouve",
    de: "Nicht gefunden", pt: "Nao encontrado", ca: "No trobat",
  },
  tooManyBookings: {
    es: "Demasiadas reservas desde esta IP. Por favor, intentelo mas tarde.",
    en: "Too many bookings from this IP. Please try later.",
    fr: "Trop de reservations depuis cette IP. Veuillez reessayer plus tard.",
    de: "Zu viele Buchungen von dieser IP. Bitte versuchen Sie es spaeter.",
    pt: "Muitas reservas deste IP. Por favor, tente mais tarde.",
    ca: "Massa reserves des d'aquesta IP. Si us plau, intenteu-ho mes tard.",
  },
  weekdaysOnly: {
    es: "Las reservas solo estan disponibles en dias laborables (lunes a viernes)",
    en: "Bookings are only available on weekdays (Monday to Friday)",
    fr: "Les reservations ne sont disponibles que les jours ouvrables (lundi a vendredi)",
    de: "Buchungen sind nur an Werktagen moeglich (Montag bis Freitag)",
    pt: "As reservas so estao disponiveis em dias uteis (segunda a sexta)",
    ca: "Les reserves nomes estan disponibles en dies laborables (dilluns a divendres)",
  },
  invalidTimeSlot: {
    es: "Horario invalido. Por favor, seleccione un horario disponible.",
    en: "Invalid time. Please select an available time slot.",
    fr: "Heure invalide. Veuillez selectionner un creneau disponible.",
    de: "Ungueltige Uhrzeit. Bitte waehlen Sie einen verfuegbaren Zeitslot.",
    pt: "Horario invalido. Por favor, selecione um horario disponivel.",
    ca: "Horari no valid. Si us plau, seleccioneu un horari disponible.",
  },
  cannotBookPastDate: {
    es: "No se puede reservar en una fecha pasada", en: "Cannot book on a past date", fr: "Impossible de reserver a une date passee",
    de: "Buchung an einem vergangenen Datum nicht moeglich", pt: "Nao e possivel reservar em uma data passada", ca: "No es pot reservar en una data passada",
  },
  dayNotAvailable: {
    es: "Este dia no esta disponible para reservas", en: "This day is not available for bookings", fr: "Ce jour n'est pas disponible pour les reservations",
    de: "Dieser Tag ist nicht fuer Buchungen verfuegbar", pt: "Este dia nao esta disponivel para reservas", ca: "Aquest dia no esta disponible per a reserves",
  },
  slotAlreadyBooked: {
    es: "Este horario ya esta reservado", en: "This time slot is already booked", fr: "Ce creneau est deja reserve",
    de: "Dieser Zeitslot ist bereits gebucht", pt: "Este horario ja esta reservado", ca: "Aquesta franja horaria ja esta reservada",
  },
  duplicateBooking: {
    es: "Ya existe una reserva duplicada", en: "A duplicate booking already exists", fr: "Une reservation en double existe deja",
    de: "Eine doppelte Buchung existiert bereits", pt: "Ja existe uma reserva duplicada", ca: "Ja existeix una reserva duplicada",
  },
  missingBookingIdOrToken: {
    es: "Falta el ID de reserva o el token", en: "Missing booking ID or token", fr: "ID de reservation ou jeton manquant",
    de: "Buchungs-ID oder Token fehlt", pt: "ID de reserva ou token ausente", ca: "Falta l'ID de reserva o el token",
  },
  bookingNotFound: {
    es: "Reserva no encontrada", en: "Booking not found", fr: "Reservation non trouvee",
    de: "Buchung nicht gefunden", pt: "Reserva nao encontrada", ca: "Reserva no trobada",
  },
  cannotRescheduleCancelled: {
    es: "No se puede reprogramar una reserva cancelada", en: "Cannot reschedule a cancelled booking", fr: "Impossible de reprogrammer une reservation annulee",
    de: "Eine stornierte Buchung kann nicht umgebucht werden", pt: "Nao e possivel reagendar uma reserva cancelada", ca: "No es pot reprogramar una reserva cancel-lada",
  },
  cannotReschedulePast: {
    es: "No se puede reprogramar una reserva pasada", en: "Cannot reschedule a past booking", fr: "Impossible de reprogrammer une reservation passee",
    de: "Eine vergangene Buchung kann nicht umgebucht werden", pt: "Nao e possivel reagendar uma reserva passada", ca: "No es pot reprogramar una reserva passada",
  },
  cannotReschedulePastDate: {
    es: "No se puede reprogramar a una fecha pasada", en: "Cannot reschedule to a past date", fr: "Impossible de reprogrammer a une date passee",
    de: "Umbuchung auf ein vergangenes Datum nicht moeglich", pt: "Nao e possivel reagendar para uma data passada", ca: "No es pot reprogramar a una data passada",
  },
  dateBlocked: {
    es: "Esta fecha esta bloqueada", en: "This date is blocked", fr: "Cette date est bloquee",
    de: "Dieses Datum ist gesperrt", pt: "Esta data esta bloqueada", ca: "Aquesta data esta bloquejada",
  },
  invalidTimeSlotShort: {
    es: "Horario invalido", en: "Invalid time slot", fr: "Creneau invalide",
    de: "Ungueltiger Zeitslot", pt: "Horario invalido", ca: "Horari no valid",
  },
  cannotReschedulePastTime: {
    es: "No se puede reprogramar a un horario pasado", en: "Cannot reschedule to a past time slot", fr: "Impossible de reprogrammer a un creneau passe",
    de: "Umbuchung auf einen vergangenen Zeitslot nicht moeglich", pt: "Nao e possivel reagendar para um horario passado", ca: "No es pot reprogramar a un horari passat",
  },
  sameSlot: {
    es: "El nuevo horario es el mismo que el actual", en: "The new time slot is the same as the current one", fr: "Le nouveau creneau est le meme que l'actuel",
    de: "Der neue Zeitslot ist derselbe wie der aktuelle", pt: "O novo horario e o mesmo que o atual", ca: "El nou horari es el mateix que l'actual",
  },
  alreadyCancelled: {
    es: "La reserva ya esta cancelada", en: "Booking is already cancelled", fr: "La reservation est deja annulee",
    de: "Buchung ist bereits storniert", pt: "A reserva ja esta cancelada", ca: "La reserva ja esta cancel-lada",
  },
  cannotCancelPast: {
    es: "No se puede cancelar una reserva pasada", en: "Cannot cancel a past booking", fr: "Impossible d'annuler une reservation passee",
    de: "Eine vergangene Buchung kann nicht storniert werden", pt: "Nao e possivel cancelar uma reserva passada", ca: "No es pot cancel-lar una reserva passada",
  },
  originNotAllowed: {
    es: "Origen no permitido", en: "Origin not allowed", fr: "Origine non autorisee",
    de: "Herkunft nicht erlaubt", pt: "Origem nao permitida", ca: "Origen no permes",
  },
  endpointNotFound: {
    es: "Endpoint no encontrado", en: "Endpoint not found", fr: "Endpoint non trouve",
    de: "Endpunkt nicht gefunden", pt: "Endpoint nao encontrado", ca: "Endpoint no trobat",
  },
  internalServerError: {
    es: "Error interno del servidor", en: "Internal server error", fr: "Erreur interne du serveur",
    de: "Interner Serverfehler", pt: "Erro interno do servidor", ca: "Error intern del servidor",
  },
  requestError: {
    es: "Error en la solicitud", en: "Request error", fr: "Erreur de requete",
    de: "Anfragefehler", pt: "Erro na solicitacao", ca: "Error en la sol-licitud",
  },
  resourceNotFound: {
    es: "Recurso no encontrado", en: "Resource not found", fr: "Ressource non trouvee",
    de: "Ressource nicht gefunden", pt: "Recurso nao encontrado", ca: "Recurs no trobat",
  },
  invalidInput: {
    es: "Entrada no valida", en: "Invalid input", fr: "Entree invalide",
    de: "Ungueltige Eingabe", pt: "Entrada invalida", ca: "Entrada no valida",
  },
  storageOperationFailed: {
    es: "Error en la operacion de almacenamiento", en: "Storage operation failed", fr: "Echec de l'operation de stockage",
    de: "Speichervorgang fehlgeschlagen", pt: "Falha na operacao de armazenamento", ca: "Error en l'operacio d'emmagatzematge",
  },
  zodInvalidEmail: {
    es: "Correo electronico no valido", en: "Invalid email", fr: "Email invalide",
    de: "Ungueltige E-Mail", pt: "Email invalido", ca: "Correu electronic no valid",
  },
  zodEmailTooLong: {
    es: "El correo es demasiado largo", en: "Email too long", fr: "Email trop long",
    de: "E-Mail ist zu lang", pt: "Email muito longo", ca: "El correu es massa llarg",
  },
  zodPhoneTooLong: {
    es: "El telefono es demasiado largo", en: "Phone too long", fr: "Telephone trop long",
    de: "Telefon ist zu lang", pt: "Telefone muito longo", ca: "El telefon es massa llarg",
  },
  zodPhoneMinDigits: {
    es: "El telefono debe tener al menos 7 digitos", en: "Phone must have at least 7 digits", fr: "Le telephone doit avoir au moins 7 chiffres",
    de: "Telefon muss mindestens 7 Ziffern haben", pt: "O telefone deve ter pelo menos 7 digitos", ca: "El telefon ha de tenir almenys 7 digits",
  },
  zodNotesTooLong: {
    es: "Las notas son demasiado largas", en: "Notes are too long", fr: "Les notes sont trop longues",
    de: "Notizen sind zu lang", pt: "As notas sao muito longas", ca: "Les notes son massa llargues",
  },
  zodContextTooLong: {
    es: "El contexto es demasiado largo", en: "Context too long", fr: "Contexte trop long",
    de: "Kontext ist zu lang", pt: "Contexto muito longo", ca: "El context es massa llarg",
  },
  zodActivityTooLong: {
    es: "La actividad es demasiado larga", en: "Activity too long", fr: "Activite trop longue",
    de: "Aktivitaet ist zu lang", pt: "Atividade muito longa", ca: "L'activitat es massa llarga",
  },
  zodInvalidTimeFormat: {
    es: "Formato de hora no valido", en: "Invalid time format", fr: "Format d'heure invalide",
    de: "Ungueltiges Zeitformat", pt: "Formato de hora invalido", ca: "Format d'hora no valid",
  },
  zodInvalidTime: {
    es: "Hora no valida", en: "Invalid time", fr: "Heure invalide",
    de: "Ungueltige Zeit", pt: "Hora invalida", ca: "Hora no valida",
  },
  zodInvalidDateFormat: {
    es: "Formato de fecha no valido. Use AAAA-MM-DD", en: "Invalid date format. Use YYYY-MM-DD", fr: "Format de date invalide. Utilisez AAAA-MM-JJ",
    de: "Ungueltiges Datumsformat. Verwenden Sie JJJJ-MM-TT", pt: "Formato de data invalido. Use AAAA-MM-DD", ca: "Format de data no valid. Useu AAAA-MM-DD",
  },
  zodInvalidDate: {
    es: "Fecha no valida", en: "Invalid date", fr: "Date invalide",
    de: "Ungueltiges Datum", pt: "Data invalida", ca: "Data no valida",
  },
  zodNameTooShort: {
    es: "El nombre es demasiado corto", en: "Name is too short", fr: "Le nom est trop court",
    de: "Name ist zu kurz", pt: "O nome e muito curto", ca: "El nom es massa curt",
  },
  zodNameTooLong: {
    es: "El nombre es demasiado largo", en: "Name is too long", fr: "Le nom est trop long",
    de: "Name ist zu lang", pt: "O nome e muito longo", ca: "El nom es massa llarg",
  },
  zodMustAcceptPrivacy: {
    es: "Debe aceptar la politica de privacidad", en: "You must accept the privacy policy", fr: "Vous devez accepter la politique de confidentialite",
    de: "Sie muessen die Datenschutzrichtlinie akzeptieren", pt: "Voce deve aceitar a politica de privacidade", ca: "Heu d'acceptar la politica de privacitat",
  },
  zodMustCommitAttendance: {
    es: "Debe confirmar su asistencia a la llamada", en: "You must commit to attending the call", fr: "Vous devez vous engager a assister a l'appel",
    de: "Sie muessen sich zur Teilnahme am Anruf verpflichten", pt: "Voce deve se comprometer a participar da chamada", ca: "Heu de comprometre-us a assistir a la trucada",
  },
  zodMonthlyProfitRequired: {
    es: "El beneficio mensual es obligatorio", en: "Monthly profit is required", fr: "Le benefice mensuel est requis",
    de: "Monatlicher Gewinn ist erforderlich", pt: "O lucro mensal e obrigatorio", ca: "El benefici mensual es obligatori",
  },
  zodInvalidDateShort: {
    es: "Formato de fecha no valido", en: "Invalid date format", fr: "Format de date invalide",
    de: "Ungueltiges Datumsformat", pt: "Formato de data invalido", ca: "Format de data no valid",
  },
  zodLastNameTooLong: {
    es: "El apellido es demasiado largo", en: "Last name is too long", fr: "Le nom de famille est trop long",
    de: "Nachname ist zu lang", pt: "O sobrenome e muito longo", ca: "El cognom es massa llarg",
  },
  zodNoteTooLong: {
    es: "La nota es demasiado larga", en: "Note is too long", fr: "La note est trop longue",
    de: "Notiz ist zu lang", pt: "A nota e muito longa", ca: "La nota es massa llarga",
  },
  tooManyRequestsWait: {
    es: "Demasiadas solicitudes. Por favor, espera unos minutos.",
    en: "Too many requests. Please wait a few minutes.",
    fr: "Trop de requetes. Veuillez patienter quelques minutes.",
    de: "Zu viele Anfragen. Bitte warten Sie einige Minuten.",
    pt: "Muitas solicitacoes. Por favor, aguarde alguns minutos.",
    ca: "Massa sol-licituds. Si us plau, espereu uns minuts.",
  },
  unsubError: {
    es: "Error", en: "Error", fr: "Erreur", de: "Fehler", pt: "Erro", ca: "Error",
  },
  unsubInvalidLink: {
    es: "Enlace de cancelacion invalido.",
    en: "Invalid unsubscribe link.",
    fr: "Lien de desinscription invalide.",
    de: "Ungueltiger Abmeldelink.",
    pt: "Link de cancelamento invalido.",
    ca: "Enllac de cancel-lacio invalid.",
  },
  unsubAlreadyTitle: {
    es: "Ya cancelado", en: "Already Unsubscribed", fr: "Deja desinscrit", de: "Bereits abgemeldet", pt: "Ja cancelado", ca: "Ja cancel-lat",
  },
  unsubAlreadyMsg: {
    es: "Ya te has dado de baja o el enlace no es valido.",
    en: "You have already been unsubscribed or the link is invalid.",
    fr: "Vous avez deja ete desinscrit ou le lien n'est pas valide.",
    de: "Sie wurden bereits abgemeldet oder der Link ist ungueltig.",
    pt: "Ja foi cancelado ou o link nao e valido.",
    ca: "Ja t'has donat de baixa o l'enllac no es valid.",
  },
  unsubSuccessTitle: {
    es: "Dado de baja", en: "Unsubscribed", fr: "Desinscrit", de: "Abgemeldet", pt: "Cancelado", ca: "Cancel-lat",
  },
  invalidJsonBody: {
    es: "JSON no valido en el cuerpo de la solicitud", en: "Invalid JSON in request body", fr: "JSON invalide dans le corps de la requete",
    de: "Ungueltiges JSON im Anfragekuerper", pt: "JSON invalido no corpo da solicitacao", ca: "JSON no valid al cos de la sol-licitud",
  },
  payloadTooLarge: {
    es: "El cuerpo de la solicitud es demasiado grande", en: "Request body too large", fr: "Corps de la requete trop volumineux",
    de: "Anfragekuerper zu gross", pt: "Corpo da solicitacao muito grande", ca: "El cos de la sol-licitud es massa gran",
  },
  payloadTooComplex: {
    es: "La solicitud contiene demasiados campos", en: "Request contains too many fields",
    fr: "La requete contient trop de champs", de: "Anfrage enthaelt zu viele Felder",
    pt: "A solicitacao contem muitos campos", ca: "La sol-licitud conte massa camps",
  },
  requestProcessingError: {
    es: "Error al procesar la solicitud", en: "Error processing request", fr: "Erreur lors du traitement de la requete",
    de: "Fehler bei der Verarbeitung der Anfrage", pt: "Erro ao processar a solicitacao", ca: "Error en processar la sol-licitud",
  },
  tooManyRequestsRetry: {
    es: "Demasiadas solicitudes. Intentalo de nuevo en un minuto.",
    en: "Too many requests. Please try again in a minute.",
    fr: "Trop de requetes. Veuillez reessayer dans une minute.",
    de: "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.",
    pt: "Muitas solicitacoes. Tente novamente em um minuto.",
    ca: "Massa sol-licituds. Torneu-ho a intentar en un minut.",
  },
  unsubSuccessMsg: {
    es: "Te has dado de baja exitosamente de nuestro boletin.",
    en: "You have been successfully unsubscribed from our newsletter.",
    fr: "Vous avez ete desinscrit avec succes de notre newsletter.",
    de: "Sie wurden erfolgreich von unserem Newsletter abgemeldet.",
    pt: "Foi cancelado com sucesso da nossa newsletter.",
    ca: "T'has donat de baixa correctament del nostre butlleti.",
  },
};

export function backendLabel(key: string, lang?: string | null, replacements?: Record<string, string>): string {
  const l = (lang || "es").toLowerCase().slice(0, 2);
  let text = BACKEND_I18N[key]?.[l] || BACKEND_I18N[key]?.["es"] || key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v);
    }
  }
  return text;
}

export function resolveRequestLang(req: { headers?: Record<string, string | string[] | undefined> }): string {
  const raw = req.headers?.["accept-language"];
  const accept = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] || "" : "";
  const first = accept.split(",")[0]?.split(";")[0]?.trim().split("-")[0]?.toLowerCase() || "";
  if (first && SUPPORTED_LANGS.includes(first)) return first;
  return "en";
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
