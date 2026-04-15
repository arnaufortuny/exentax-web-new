/**
 * Discord webhook notification service — Multi-canal
 *
 * Canales:
 *   DISCORD_WEBHOOK_REGISTROS       → Registros web (newsletter, leads)
 *   DISCORD_WEBHOOK_CALCULADORA     → Resultados de la calculadora fiscal
 *   DISCORD_WEBHOOK_ACTIVIDAD       → Actividad web (visitas, páginas)
 *   DISCORD_WEBHOOK_AGENDA          → Asesorías (crear, reagendar, cancelar)
 *   DISCORD_WEBHOOK_CONSENTIMIENTOS → Consentimientos de privacidad/cookies
 *
 * Rate: one message per 1.5 s per channel = ~40 messages/min/canal
 */

import { logger } from "./logger";
import { SITE_URL } from "./server-constants";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

function adminLink(bookingId: string): string {
  if (!ADMIN_TOKEN) return `${SITE_URL}/admin/agenda/${bookingId}`;
  return `${SITE_URL}/admin/agenda/${bookingId}?adminToken=${ADMIN_TOKEN}`;
}

type Channel = "registros" | "calculadora" | "actividad" | "agenda" | "consentimientos";

const CHANNEL_ENV: Record<Channel, string> = {
  registros:       "DISCORD_WEBHOOK_REGISTROS",
  calculadora:     "DISCORD_WEBHOOK_CALCULADORA",
  actividad:       "DISCORD_WEBHOOK_ACTIVIDAD",
  agenda:          "DISCORD_WEBHOOK_AGENDA",
  consentimientos: "DISCORD_WEBHOOK_CONSENTIMIENTOS",
};

function getWebhookUrl(channel: Channel): string | undefined {
  return process.env[CHANNEL_ENV[channel]];
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: EmbedField[];
  footer: { text: string; icon_url?: string };
  timestamp: string;
  thumbnail?: { url: string };
}

interface DiscordPayload {
  username: string;
  avatar_url: string;
  embeds: DiscordEmbed[];
}

const QUEUE_MAX = 80;
const DRAIN_INTERVAL_MS = 1_500;
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 8_000;

interface QueueItem { url: string; payload: DiscordPayload; attempt: number }

const _queue: QueueItem[] = [];
let _drainTimer: NodeJS.Timeout | null = null;

function _ensureDrainTimer(): void {
  if (_drainTimer) return;
  _drainTimer = setInterval(_drainQueue, DRAIN_INTERVAL_MS);
  _drainTimer.unref();
}

function _drainQueue(): void {
  const item = _queue.shift();
  if (!item) return;
  _sendPayload(item);
}

async function _sendPayload(item: QueueItem): Promise<void> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(item.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      const isRetryable = res.status === 429 || res.status >= 500;
      if (isRetryable && item.attempt < MAX_RETRIES) {
        const backoff = Math.min(DRAIN_INTERVAL_MS * 2 ** item.attempt, 30_000);
        logger.warn(`Discord HTTP ${res.status} — retry ${item.attempt + 1}/${MAX_RETRIES} in ${backoff}ms`, "discord");
        setTimeout(() => _enqueueItem({ ...item, attempt: item.attempt + 1 }), backoff);
      } else {
        logger.warn(`Discord webhook HTTP ${res.status}: ${body.slice(0, 300)}`, "discord");
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (item.attempt < MAX_RETRIES) {
      const backoff = Math.min(DRAIN_INTERVAL_MS * 2 ** item.attempt, 30_000);
      setTimeout(() => _enqueueItem({ ...item, attempt: item.attempt + 1 }), backoff);
    } else {
      logger.warn(`Discord send failed after ${MAX_RETRIES} retries: ${msg}`, "discord");
    }
  }
}

function _enqueueItem(item: QueueItem): void {
  if (_queue.length >= QUEUE_MAX) {
    _queue.shift();
    logger.warn("Discord queue full — oldest message dropped", "discord");
  }
  _queue.push(item);
  _ensureDrainTimer();
}

function _send(channel: Channel, embed: DiscordEmbed): void {
  const url = getWebhookUrl(channel);
  if (!url) return;
  const payload: DiscordPayload = {
    username: "Exentax Bot",
    avatar_url: `${SITE_URL}/ex-icon-green.png`,
    embeds: [embed],
  };
  _enqueueItem({ url, payload, attempt: 0 });
}

function ts(): string {
  return new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function flag(lang: string | null | undefined): string {
  const flags: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", pt: "🇵🇹", ca: "🏴" };
  return flags[lang || "es"] || "🌐";
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL: AGENDA (asesorías)
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyBookingCreated(opts: {
  bookingId: string;
  manageToken?: string | null;
  name: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string | null;
  language?: string | null;
  ip?: string | null;
  activity?: string | null;
  monthlyProfit?: number | null;
  globalClients?: boolean | null;
  digitalOperation?: boolean | null;
  notes?: string | null;
  context?: string | null;
  shareNote?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
}): void {
  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",      value: `\`${opts.bookingId}\``,                                    inline: true },
    { name: "📅 Fecha",            value: `**${opts.date}**`,                                          inline: true },
    { name: "🕐 Horario",         value: `${opts.startTime} — ${opts.endTime}`,                       inline: true },
    { name: "👤 Nombre completo", value: `${opts.name}${opts.lastName ? " " + opts.lastName : ""}`,   inline: true },
    { name: "📧 Email",           value: opts.email,                                                   inline: true },
    { name: "📱 Teléfono",        value: opts.phone || "No proporcionado",                             inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),              inline: true },
    { name: "🌐 IP",              value: opts.ip || "—",                                               inline: true },
    { name: "📹 Google Meet",     value: opts.meetLink ? `[Abrir enlace](${opts.meetLink})` : "No disponible", inline: true },
  ];

  if (opts.activity) fields.push({ name: "💼 Actividad", value: opts.activity, inline: true });
  if (opts.monthlyProfit != null) fields.push({ name: "💰 Beneficio mensual", value: `${opts.monthlyProfit.toLocaleString("es-ES")} €`, inline: true });
  if (opts.globalClients != null) fields.push({ name: "🌍 Clientes internacionales", value: opts.globalClients ? "Sí" : "No", inline: true });
  if (opts.digitalOperation != null) fields.push({ name: "💻 Operación digital", value: opts.digitalOperation ? "Sí" : "No", inline: true });
  if (opts.notes) fields.push({ name: "📝 Notas del cliente", value: opts.notes.slice(0, 500) });
  if (opts.context) fields.push({ name: "🔎 Contexto", value: opts.context.slice(0, 500) });
  if (opts.shareNote) fields.push({ name: "📋 Nota adicional", value: opts.shareNote.slice(0, 300) });

  fields.push({ name: "✅ Privacidad", value: opts.privacyAccepted ? "Aceptada" : "No", inline: true });
  fields.push({ name: "📣 Marketing", value: opts.marketingAccepted ? "Aceptado" : "No", inline: true });

  if (opts.manageToken) {
    fields.push({ name: "🔗 Gestión cliente", value: `[Abrir panel cliente](${SITE_URL}/booking/${opts.bookingId}?token=${opts.manageToken})` });
  }

  fields.push({ name: "⚙️ Admin", value: `[Gestionar reserva](${adminLink(opts.bookingId)})` });

  _send("agenda", {
    title: "📅 Nueva asesoría programada",
    description: `**${opts.name}** ha reservado una asesoría fiscal para el **${opts.date}** a las **${opts.startTime}**.`,
    color: 0x00E510,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

export function notifyBookingRescheduled(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  oldDate?: string | null;
  oldStartTime?: string | null;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  newMeetLink?: string | null;
  language?: string | null;
  rescheduleCount?: number | null;
  ip?: string | null;
  source?: string | null;
}): void {
  const sourceLabel = opts.source === "admin" ? "Panel admin" : "Cliente";
  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",    value: `\`${opts.bookingId}\``,                                                        inline: true },
    { name: "❌ Fecha anterior", value: opts.oldDate ? `${opts.oldDate} ${opts.oldStartTime || ""}` : "—",              inline: true },
    { name: "✅ Nueva fecha",   value: `**${opts.newDate}** ${opts.newStartTime} — ${opts.newEndTime}`,                 inline: true },
    { name: "👤 Cliente",       value: opts.name,                                                                        inline: true },
    { name: "📧 Email",         value: opts.email,                                                                       inline: true },
    { name: "📱 Teléfono",      value: opts.phone || "—",                                                                inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),                                inline: true },
    { name: "🔢 Nº reagendas",  value: String(opts.rescheduleCount ?? 1),                                               inline: true },
    { name: "📹 Google Meet",   value: opts.newMeetLink ? `[Abrir enlace](${opts.newMeetLink})` : "Sin cambios",         inline: true },
    { name: "📍 Origen",        value: sourceLabel,                                                                       inline: true },
  ];

  fields.push({ name: "⚙️ Admin", value: `[Gestionar reserva](${adminLink(opts.bookingId)})` });

  _send("agenda", {
    title: "🔄 Asesoría reagendada",
    description: `**${opts.name}** ha cambiado la fecha de su asesoría. Origen: **${sourceLabel}**.`,
    color: 0x3498DB,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

export function notifyBookingCancelled(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  date?: string | null;
  startTime?: string | null;
  language?: string | null;
  ip?: string | null;
  reason?: string | null;
  source?: string | null;
}): void {
  const sourceLabel = opts.source === "admin" ? "Panel admin" : "Cliente";
  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",  value: `\`${opts.bookingId}\``,                                       inline: true },
    { name: "📅 Fecha",        value: opts.date ? `${opts.date} ${opts.startTime || ""}` : "—",      inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),            inline: true },
    { name: "👤 Cliente",      value: opts.name,                                                      inline: true },
    { name: "📧 Email",        value: opts.email,                                                     inline: true },
    { name: "📱 Teléfono",     value: opts.phone || "—",                                              inline: true },
    { name: "📍 Origen",       value: sourceLabel,                                                     inline: true },
  ];
  if (opts.reason) fields.push({ name: "💬 Motivo", value: opts.reason.slice(0, 300) });

  fields.push({ name: "⚙️ Admin", value: `[Gestionar reserva](${adminLink(opts.bookingId)})` });

  _send("agenda", {
    title: "❌ Asesoría cancelada",
    description: `**${opts.name}** ha cancelado su asesoría del **${opts.date || "fecha desconocida"}**. Origen: **${sourceLabel}**.`,
    color: 0xE74C3C,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

export function notifyNoShow(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  date?: string | null;
  startTime?: string | null;
  language?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",  value: `\`${opts.bookingId}\``,                                       inline: true },
    { name: "📅 Fecha",        value: opts.date ? `${opts.date} ${opts.startTime || ""}` : "—",      inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),            inline: true },
    { name: "👤 Cliente",      value: opts.name,                                                      inline: true },
    { name: "📧 Email",        value: opts.email,                                                     inline: true },
    { name: "📱 Teléfono",     value: opts.phone || "—",                                              inline: true },
  ];

  fields.push({ name: "⚙️ Admin", value: `[Gestionar reserva](${adminLink(opts.bookingId)})` });

  _send("agenda", {
    title: "⚠️ No-show — Cliente no se presentó",
    description: `**${opts.name}** no se presentó a la asesoría del **${opts.date || "fecha desconocida"}**.`,
    color: 0xF39C12,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL: CALCULADORA
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyCalculatorLead(opts: {
  leadId: string;
  email: string;
  name?: string | null;
  country?: string | null;
  regime?: string | null;
  ahorro: number;
  annualIncome?: number | null;
  monthlyIncome?: number | null;
  localTax?: number | null;
  llcTax?: number | null;
  language?: string | null;
  ip?: string | null;
  marketingAccepted?: boolean;
  privacyAccepted?: boolean;
  userAgent?: string | null;
  referrer?: string | null;
}): void {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  const fields: EmbedField[] = [
    { name: "🆔 ID Lead",          value: `\`${opts.leadId}\``,                                        inline: true },
    { name: "📧 Email",            value: opts.email,                                                   inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),              inline: true },
    { name: "🌍 País",             value: opts.country || "No especificado",                            inline: true },
    { name: "📊 Régimen fiscal",   value: opts.regime || "No especificado",                             inline: true },
    { name: "🌐 IP",               value: opts.ip || "—",                                               inline: true },
  ];

  if (opts.annualIncome != null) fields.push({ name: "💶 Ingresos anuales", value: fmt(opts.annualIncome), inline: true });
  if (opts.monthlyIncome != null) fields.push({ name: "💶 Ingresos mensuales", value: fmt(opts.monthlyIncome), inline: true });
  if (opts.localTax != null) fields.push({ name: "🏛️ Impuestos locales", value: fmt(opts.localTax), inline: true });
  if (opts.llcTax != null) fields.push({ name: "🇺🇸 Impuestos LLC", value: fmt(opts.llcTax), inline: true });

  fields.push({ name: "💰 Ahorro estimado", value: `**${fmt(opts.ahorro)}**`, inline: true });

  if (opts.name) fields.push({ name: "👤 Nombre", value: opts.name, inline: true });
  fields.push({ name: "✅ Privacidad", value: opts.privacyAccepted ? "Aceptada" : "—", inline: true });
  fields.push({ name: "📣 Marketing", value: opts.marketingAccepted ? "Aceptado" : "No", inline: true });

  if (opts.referrer) fields.push({ name: "🔗 Referrer", value: opts.referrer.slice(0, 200), inline: true });

  const ahorroAbs = Math.abs(opts.ahorro);
  let emoji = "🟢";
  if (ahorroAbs < 3000) emoji = "🟡";
  if (ahorroAbs < 1000) emoji = "🔴";

  _send("calculadora", {
    title: `🧮 Resultado calculadora — ${emoji} ${fmt(opts.ahorro)} ahorro`,
    description: `Nuevo cálculo desde **${opts.country || "país desconocido"}** con un ahorro estimado de **${fmt(opts.ahorro)}** anuales.`,
    color: ahorroAbs >= 5000 ? 0x00E510 : ahorroAbs >= 2000 ? 0xF1C40F : 0xE67E22,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL: REGISTROS WEB (newsletter, leads genéricos)
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyNewsletterSubscribe(opts: {
  email: string;
  source?: string | null;
  language?: string | null;
  ip?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
}): void {
  _send("registros", {
    title: "📧 Nueva suscripción newsletter",
    description: `Nuevo suscriptor desde **${opts.source || "footer"}**.`,
    color: 0x1ABC9C,
    fields: [
      { name: "📧 Email",       value: opts.email,                                      inline: true },
      { name: "📍 Fuente",      value: opts.source || "footer",                          inline: true },
      { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(), inline: true },
      { name: "🌐 IP",          value: opts.ip || "—",                                   inline: true },
      { name: "✅ Privacidad",  value: opts.privacyAccepted ? "Aceptada" : "—",          inline: true },
      { name: "📣 Marketing",   value: opts.marketingAccepted ? "Aceptado" : "No",       inline: true },
    ],
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

export function notifyNewLead(opts: {
  leadId: string;
  name: string;
  email: string;
  phone?: string | null;
  source: string;
  language?: string | null;
  ip?: string | null;
  activity?: string | null;
}): void {
  _send("registros", {
    title: "🆕 Nuevo lead registrado",
    description: `**${opts.name}** se ha registrado desde **${opts.source}**.`,
    color: 0x9B59B6,
    fields: [
      { name: "🆔 ID Lead",   value: `\`${opts.leadId}\``,                                inline: true },
      { name: "👤 Nombre",    value: opts.name,                                             inline: true },
      { name: "📧 Email",     value: opts.email,                                            inline: true },
      { name: "📱 Teléfono",  value: opts.phone || "—",                                     inline: true },
      { name: "📍 Fuente",    value: opts.source,                                            inline: true },
      { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(), inline: true },
      { name: "🌐 IP",        value: opts.ip || "—",                                        inline: true },
    ],
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL: ACTIVIDAD WEB
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyWebVisit(opts: {
  ip: string;
  page?: string | null;
  referrer?: string | null;
  language?: string | null;
  device?: string | null;
  screen?: string | null;
  userAgent?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  sessionId?: string | null;
  isNew?: boolean;
}): void {
  const deviceEmoji = opts.device === "mobile" ? "📱" : opts.device === "tablet" ? "📲" : "🖥️";

  const fields: EmbedField[] = [
    { name: "📄 Página",            value: opts.page || "/",                                              inline: true },
    { name: `${deviceEmoji} Dispositivo`, value: opts.device || "Desconocido",                           inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),                inline: true },
    { name: "🌐 IP",                value: opts.ip,                                                       inline: true },
    { name: "📐 Pantalla",          value: opts.screen || "—",                                             inline: true },
    { name: "👤 Visitante",         value: opts.isNew ? "🆕 Nuevo" : "🔄 Recurrente",                    inline: true },
  ];

  if (opts.referrer) fields.push({ name: "🔗 Referrer", value: opts.referrer.slice(0, 200), inline: true });
  if (opts.utmSource) fields.push({ name: "📊 UTM Source", value: opts.utmSource, inline: true });
  if (opts.utmMedium) fields.push({ name: "📊 UTM Medium", value: opts.utmMedium, inline: true });
  if (opts.utmCampaign) fields.push({ name: "📊 UTM Campaign", value: opts.utmCampaign.slice(0, 100), inline: true });
  if (opts.utmContent) fields.push({ name: "📊 UTM Content", value: opts.utmContent.slice(0, 100), inline: true });
  if (opts.sessionId) fields.push({ name: "🔑 Sesión", value: `\`${opts.sessionId.slice(0, 16)}...\``, inline: true });

  let browserInfo = "—";
  if (opts.userAgent) {
    const ua = opts.userAgent;
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browserInfo = "Chrome";
    else if (/Firefox/i.test(ua)) browserInfo = "Firefox";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browserInfo = "Safari";
    else if (/Edge/i.test(ua)) browserInfo = "Edge";
    else if (/Opera|OPR/i.test(ua)) browserInfo = "Opera";
    else browserInfo = ua.slice(0, 50);
  }
  fields.push({ name: "🌐 Navegador", value: browserInfo, inline: true });

  _send("actividad", {
    title: `${opts.isNew ? "🆕" : "👁️"} Visita web · ${opts.page || "/"}`,
    color: opts.isNew ? 0x2ECC71 : 0x95A5A6,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANAL: CONSENTIMIENTOS
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyConsent(opts: {
  formType: string;
  email?: string | null;
  privacyAccepted?: boolean | null;
  marketingAccepted?: boolean | null;
  language?: string | null;
  source?: string | null;
  privacyVersion?: string | null;
  ip?: string | null;
}): void {
  const isCookie = opts.formType.startsWith("cookies:");
  const title = isCookie
    ? `🍪 Consentimiento cookies — ${opts.formType.replace("cookies:", "")}`
    : `📋 Consentimiento — ${opts.formType}`;

  const fields: EmbedField[] = [
    { name: "📝 Tipo",              value: opts.formType,                                               inline: true },
    { name: "✅ Privacidad",        value: opts.privacyAccepted ? "Aceptada" : "No aceptada",           inline: true },
    { name: "📣 Marketing",         value: opts.marketingAccepted === true ? "Aceptado" : opts.marketingAccepted === false ? "Rechazado" : "N/A", inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),              inline: true },
    { name: "🌐 IP",                value: opts.ip || "—",                                              inline: true },
    { name: "📋 Versión política",  value: opts.privacyVersion || "—",                                  inline: true },
  ];

  if (opts.email) fields.push({ name: "📧 Email", value: opts.email, inline: true });
  if (opts.source) fields.push({ name: "📍 Fuente", value: opts.source, inline: true });

  _send("consentimientos", {
    title,
    color: isCookie ? 0xF39C12 : 0x3498DB,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERRORES CRÍTICOS (se envía a registros)
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyCriticalError(opts: {
  context: string;
  message: string;
  code?: string | null;
  path?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "⚙️ Contexto", value: opts.context,                   inline: true },
    { name: "🏷️ Código",   value: opts.code || "SERVER_ERROR",    inline: true },
  ];
  if (opts.path) fields.push({ name: "📄 Ruta", value: opts.path.slice(0, 200), inline: true });
  fields.push({ name: "💬 Mensaje", value: `\`\`\`${opts.message.slice(0, 800)}\`\`\`` });

  _send("registros", {
    title: "🚨 Error crítico del servidor",
    color: 0xE74C3C,
    fields,
    footer: { text: `Exentax · ${ts()}` },
    timestamp: new Date().toISOString(),
  });
}
