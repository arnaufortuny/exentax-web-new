/**
 * Discord webhook notification service — Multi-canal
 *
 * Canales:
 *   DISCORD_WEBHOOK_REGISTROS       → Registros web (newsletter, leads)
 *   DISCORD_WEBHOOK_CALCULADORA     → Resultados de la calculadora fiscal
 *   DISCORD_WEBHOOK_ACTIVIDAD       → Actividad web (visitas, páginas)
 *   DISCORD_WEBHOOK_AGENDA          → Asesorías (crear, reagendar, cancelar)
 *   DISCORD_WEBHOOK_CONSENTIMIENTOS → Consentimientos de privacidad/cookies
 *   DISCORD_WEBHOOK_ERRORES         → Errores críticos del servidor
 *
 * Rate: one message per 1.5 s per channel = ~40 messages/min/canal
 */

import { logger } from "./logger";
import { SITE_URL, BRAND_NAME, DEFAULT_TIMEZONE } from "./server-constants";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

function adminLink(bookingId: string): string {
  if (!ADMIN_TOKEN) return `${SITE_URL}/admin/agenda/${bookingId}`;
  return `${SITE_URL}/admin/agenda/${bookingId}?adminToken=${ADMIN_TOKEN}`;
}

function clientLink(bookingId: string, manageToken?: string | null): string | null {
  if (!manageToken) return null;
  return `${SITE_URL}/booking/${bookingId}?token=${manageToken}`;
}

type Channel = "registros" | "calculadora" | "actividad" | "agenda" | "consentimientos" | "errores";

const CHANNEL_ENV: Record<Channel, string> = {
  registros:       "DISCORD_WEBHOOK_REGISTROS",
  calculadora:     "DISCORD_WEBHOOK_CALCULADORA",
  actividad:       "DISCORD_WEBHOOK_ACTIVIDAD",
  agenda:          "DISCORD_WEBHOOK_AGENDA",
  consentimientos: "DISCORD_WEBHOOK_CONSENTIMIENTOS",
  errores:         "DISCORD_WEBHOOK_ERRORES",
};

function getWebhookUrl(channel: Channel): string | undefined {
  const url = process.env[CHANNEL_ENV[channel]];
  if (url) return url;
  if (channel === "errores") return process.env[CHANNEL_ENV.registros];
  return undefined;
}

const COLOR = {
  GREEN:        0x00E510,
  GREEN_DARK:   0x0AAC1A,
  TEAL:         0x1ABC9C,
  BLUE:         0x3498DB,
  BLUE_DARK:    0x2C3E50,
  PURPLE:       0x9B59B6,
  YELLOW:       0xF1C40F,
  ORANGE:       0xF39C12,
  RED:          0xDC2626,
  RED_INTENSE:  0xC0392B,
  GREY:         0x95A5A6,
} as const;

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
  author?: { name: string; icon_url?: string; url?: string };
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

const AVATAR_URL = `${SITE_URL}/ex-icon-green.png`;
const WEBHOOK_USERNAME = `${BRAND_NAME} · Notificaciones`;

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

const DISCORD_FIELD_LIMIT = 25;
const DISCORD_FIELD_NAME_MAX = 256;
const DISCORD_FIELD_VALUE_MAX = 1024;
const DISCORD_DESC_MAX = 4096;

function _clampEmbed(embed: DiscordEmbed): DiscordEmbed {
  if (embed.description && embed.description.length > DISCORD_DESC_MAX) {
    embed.description = embed.description.slice(0, DISCORD_DESC_MAX - 3) + "…";
  }
  if (embed.fields.length > DISCORD_FIELD_LIMIT) {
    embed.fields = embed.fields.slice(0, DISCORD_FIELD_LIMIT - 1);
    embed.fields.push({ name: "⚠️", value: "Algunos campos han sido omitidos por límite de Discord.", inline: false });
  }
  for (const f of embed.fields) {
    if (f.name.length > DISCORD_FIELD_NAME_MAX) f.name = f.name.slice(0, DISCORD_FIELD_NAME_MAX - 1) + "…";
    if (f.value.length > DISCORD_FIELD_VALUE_MAX) f.value = f.value.slice(0, DISCORD_FIELD_VALUE_MAX - 3) + "…";
  }
  return embed;
}

function _send(channel: Channel, embed: DiscordEmbed): void {
  const url = getWebhookUrl(channel);
  if (!url) return;
  const payload: DiscordPayload = {
    username: WEBHOOK_USERNAME,
    avatar_url: AVATAR_URL,
    embeds: [_clampEmbed(embed)],
  };
  _enqueueItem({ url, payload, attempt: 0 });
}

function ts(): string {
  return new Date().toLocaleString("es-ES", {
    timeZone: DEFAULT_TIMEZONE,
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function flag(lang: string | null | undefined): string {
  const flags: Record<string, string> = { es: "🇪🇸", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", pt: "🇵🇹", ca: "🏴" };
  return flags[lang || "es"] || "🌐";
}

function safe(val: string | null | undefined, fallback = "No disponible"): string {
  return val?.trim() || fallback;
}

function makeFooter(): { text: string; icon_url: string } {
  return { text: `${BRAND_NAME} · ${ts()}`, icon_url: AVATAR_URL };
}

function makeAuthor(): { name: string; icon_url: string; url: string } {
  return { name: BRAND_NAME, icon_url: AVATAR_URL, url: SITE_URL };
}

function linksBlock(bookingId: string, manageToken?: string | null): EmbedField[] {
  const fields: EmbedField[] = [];
  const cl = clientLink(bookingId, manageToken);
  if (cl) {
    fields.push({ name: "🔗 Gestión cliente", value: `[Abrir panel cliente](${cl})`, inline: true });
  }
  fields.push({ name: "⚙️ Panel admin", value: `[Gestionar reserva](${adminLink(bookingId)})`, inline: true });
  return fields;
}

function divider(): EmbedField {
  return { name: "\u200B", value: "\u200B", inline: false };
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
  const fullName = `${opts.name}${opts.lastName ? " " + opts.lastName : ""}`;

  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",       value: `\`${opts.bookingId}\``,                            inline: true },
    { name: "📋 Estado",           value: "🟢 Confirmada",                                     inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),      inline: true },
    divider(),
    { name: "📅 Fecha",            value: `**${opts.date}**`,                                   inline: true },
    { name: "🕐 Horario",          value: `${opts.startTime} — ${opts.endTime}`,                inline: true },
    { name: "🌐 Zona horaria",     value: DEFAULT_TIMEZONE,                                     inline: true },
    divider(),
    { name: "👤 Nombre completo",  value: fullName,                                              inline: true },
    { name: "📧 Email",            value: opts.email,                                            inline: true },
    { name: "📱 Teléfono",         value: safe(opts.phone, "No proporcionado"),                  inline: true },
  ];

  if (opts.meetLink) {
    fields.push({ name: "📹 Google Meet", value: `[Unirse a la reunión](${opts.meetLink})`, inline: true });
  }
  if (opts.ip) {
    fields.push({ name: "🌐 IP",  value: opts.ip,                                               inline: true });
  }

  if (opts.activity || opts.monthlyProfit != null || opts.globalClients != null || opts.digitalOperation != null) {
    fields.push(divider());
    if (opts.activity) fields.push({ name: "💼 Actividad", value: opts.activity, inline: true });
    if (opts.monthlyProfit != null) fields.push({ name: "💰 Beneficio mensual", value: `${opts.monthlyProfit.toLocaleString("es-ES")} €`, inline: true });
    if (opts.globalClients != null) fields.push({ name: "🌍 Clientes internacionales", value: opts.globalClients ? "Sí" : "No", inline: true });
    if (opts.digitalOperation != null) fields.push({ name: "💻 Operación digital", value: opts.digitalOperation ? "Sí" : "No", inline: true });
  }

  if (opts.notes || opts.context || opts.shareNote) {
    fields.push(divider());
    if (opts.notes) fields.push({ name: "📝 Notas del cliente", value: opts.notes.slice(0, 500) });
    if (opts.context) fields.push({ name: "🔎 Contexto", value: opts.context.slice(0, 500) });
    if (opts.shareNote) fields.push({ name: "📋 Nota adicional", value: opts.shareNote.slice(0, 300) });
  }

  fields.push(divider());
  fields.push({ name: "✅ Privacidad", value: opts.privacyAccepted ? "Aceptada" : "No", inline: true });
  fields.push({ name: "📣 Marketing", value: opts.marketingAccepted ? "Aceptado" : "No", inline: true });

  fields.push(divider());
  fields.push(...linksBlock(opts.bookingId, opts.manageToken));

  _send("agenda", {
    title: "📅 Nueva asesoría programada",
    description: `**${fullName}** ha reservado una asesoría fiscal.\n📅 **${opts.date}** · 🕐 **${opts.startTime} — ${opts.endTime}**`,
    color: COLOR.GREEN,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}

export function notifyBookingRescheduled(opts: {
  bookingId: string;
  manageToken?: string | null;
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
  const sourceEmoji = opts.source === "admin" ? "🛡️" : "👤";

  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",       value: `\`${opts.bookingId}\``,                                                           inline: true },
    { name: "📋 Estado",           value: "🔄 Reagendada",                                                                    inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),                                     inline: true },
    divider(),
    { name: "❌ Fecha anterior",   value: opts.oldDate ? `~~${opts.oldDate} ${opts.oldStartTime || ""}~~` : "No disponible",  inline: true },
    { name: "✅ Nueva fecha",      value: `**${opts.newDate}**`,                                                               inline: true },
    { name: "🕐 Nuevo horario",    value: `**${opts.newStartTime} — ${opts.newEndTime}**`,                                    inline: true },
    { name: "🌐 Zona horaria",     value: DEFAULT_TIMEZONE,                                                                    inline: true },
    divider(),
    { name: "👤 Cliente",          value: opts.name,                                                                            inline: true },
    { name: "📧 Email",            value: opts.email,                                                                           inline: true },
    { name: "📱 Teléfono",         value: safe(opts.phone),                                                                     inline: true },
    divider(),
    { name: "📹 Google Meet",      value: opts.newMeetLink ? `[Unirse a la reunión](${opts.newMeetLink})` : "Sin cambios",     inline: true },
    { name: "🔢 Nº reagendamientos", value: String(opts.rescheduleCount ?? 1),                                                 inline: true },
    { name: `${sourceEmoji} Origen`, value: `**${sourceLabel}**`,                                                               inline: true },
  ];

  if (opts.ip) {
    fields.push({ name: "🌐 IP", value: opts.ip, inline: true });
  }

  fields.push(divider());
  fields.push(...linksBlock(opts.bookingId, opts.manageToken));

  _send("agenda", {
    title: "🔄 Asesoría reagendada",
    description: `**${opts.name}** ha cambiado la fecha de su asesoría.\n📅 **${opts.newDate}** · 🕐 **${opts.newStartTime} — ${opts.newEndTime}** · Origen: **${sourceLabel}**`,
    color: COLOR.BLUE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}

export function notifyBookingCancelled(opts: {
  bookingId: string;
  manageToken?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  language?: string | null;
  ip?: string | null;
  reason?: string | null;
  source?: string | null;
}): void {
  const sourceLabel = opts.source === "admin" ? "Panel admin" : "Cliente";
  const sourceEmoji = opts.source === "admin" ? "🛡️" : "👤";

  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",  value: `\`${opts.bookingId}\``,                                       inline: true },
    { name: "📋 Estado",      value: "🔴 Cancelada",                                                 inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),            inline: true },
    divider(),
    { name: "📅 Fecha",        value: safe(opts.date),                                                inline: true },
    { name: "🕐 Horario",      value: opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "No disponible", inline: true },
    { name: "🌐 Zona horaria", value: DEFAULT_TIMEZONE,                                               inline: true },
    divider(),
    { name: "👤 Cliente",      value: opts.name,                                                       inline: true },
    { name: "📧 Email",        value: opts.email,                                                      inline: true },
    { name: "📱 Teléfono",     value: safe(opts.phone),                                                inline: true },
    divider(),
    { name: `${sourceEmoji} Origen`, value: `**${sourceLabel}**`,                                      inline: true },
  ];

  if (opts.reason) {
    fields.push({ name: "💬 Motivo de cancelación", value: opts.reason.slice(0, 300) });
  }
  if (opts.ip) {
    fields.push({ name: "🌐 IP", value: opts.ip, inline: true });
  }

  fields.push(divider());
  fields.push({ name: "⚙️ Panel admin", value: `[Ver reserva](${adminLink(opts.bookingId)})`, inline: true });

  _send("agenda", {
    title: "❌ Asesoría cancelada",
    description: `**${opts.name}** ha cancelado su asesoría del **${opts.date || "fecha desconocida"}**.\nOrigen: **${sourceLabel}**`,
    color: COLOR.RED,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}

export function notifyNoShow(opts: {
  bookingId: string;
  manageToken?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  language?: string | null;
  meetLink?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "🆔 ID Reserva",  value: `\`${opts.bookingId}\``,                                       inline: true },
    { name: "📋 Estado",      value: "🟠 No-show",                                                   inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),            inline: true },
    divider(),
    { name: "📅 Fecha",        value: safe(opts.date),                                                inline: true },
    { name: "🕐 Horario",      value: opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "No disponible", inline: true },
    { name: "🌐 Zona horaria", value: DEFAULT_TIMEZONE,                                               inline: true },
    divider(),
    { name: "👤 Cliente",      value: opts.name,                                                       inline: true },
    { name: "📧 Email",        value: opts.email,                                                      inline: true },
    { name: "📱 Teléfono",     value: safe(opts.phone),                                                inline: true },
  ];

  if (opts.meetLink) {
    fields.push({ name: "📹 Google Meet", value: `[Enlace](${opts.meetLink})`, inline: true });
  }

  fields.push(divider());
  fields.push({ name: "⚙️ Panel admin", value: `[Gestionar reserva](${adminLink(opts.bookingId)})`, inline: true });

  _send("agenda", {
    title: "⚠️ No-show — Cliente no se presentó",
    description: `**${opts.name}** no se presentó a la asesoría del **${opts.date || "fecha desconocida"}**.\nSe recomienda contactar al cliente para reagendar.`,
    color: COLOR.ORANGE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
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
  phone?: string | null;
  country?: string | null;
  regime?: string | null;
  activity?: string | null;
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

  const ahorroAbs = Math.abs(opts.ahorro);
  let savingsEmoji = "🟢";
  if (ahorroAbs < 3000) savingsEmoji = "🟡";
  if (ahorroAbs < 1000) savingsEmoji = "🔴";

  const fields: EmbedField[] = [
    { name: "🆔 ID Lead",          value: `\`${opts.leadId}\``,                                        inline: true },
    { name: "📧 Email",            value: opts.email,                                                   inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),              inline: true },
    divider(),
    { name: "🌍 País",             value: safe(opts.country, "No especificado"),                        inline: true },
    { name: "📊 Régimen fiscal",   value: safe(opts.regime, "No especificado"),                         inline: true },
  ];

  if (opts.activity) {
    fields.push({ name: "💼 Actividad", value: opts.activity, inline: true });
  }

  fields.push(divider());

  if (opts.monthlyIncome != null) fields.push({ name: "💶 Ingresos mensuales", value: fmt(opts.monthlyIncome), inline: true });
  if (opts.annualIncome != null) fields.push({ name: "💶 Ingresos anuales", value: fmt(opts.annualIncome), inline: true });
  if (opts.localTax != null) fields.push({ name: "🏛️ Impuestos locales", value: fmt(opts.localTax), inline: true });
  if (opts.llcTax != null) fields.push({ name: "🇺🇸 Impuestos LLC", value: fmt(opts.llcTax), inline: true });
  fields.push({ name: `${savingsEmoji} Ahorro estimado`, value: `**${fmt(opts.ahorro)}** / año`, inline: true });

  if (opts.name || opts.phone) {
    fields.push(divider());
    if (opts.name) fields.push({ name: "👤 Nombre", value: opts.name, inline: true });
    if (opts.phone) fields.push({ name: "📱 Teléfono", value: opts.phone, inline: true });
  }

  fields.push(divider());
  fields.push({ name: "✅ Privacidad", value: opts.privacyAccepted ? "Aceptada" : "No", inline: true });
  fields.push({ name: "📣 Marketing", value: opts.marketingAccepted ? "Aceptado" : "No", inline: true });
  if (opts.ip) fields.push({ name: "🌐 IP", value: opts.ip, inline: true });

  if (opts.referrer) fields.push({ name: "🔗 Referrer", value: opts.referrer.slice(0, 200), inline: true });

  _send("calculadora", {
    title: `🧮 Resultado calculadora — ${savingsEmoji} ${fmt(opts.ahorro)} ahorro`,
    description: `Nuevo cálculo desde **${safe(opts.country, "país desconocido")}** (${safe(opts.regime, "régimen no especificado")}).\nAhorro estimado: **${fmt(opts.ahorro)}** anuales.`,
    color: ahorroAbs >= 5000 ? COLOR.GREEN : ahorroAbs >= 2000 ? COLOR.YELLOW : COLOR.ORANGE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
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
    description: `Nuevo suscriptor registrado desde **${safe(opts.source, "footer")}**.`,
    color: COLOR.TEAL,
    fields: [
      { name: "📧 Email",       value: opts.email,                                      inline: true },
      { name: "📍 Fuente",      value: safe(opts.source, "footer"),                      inline: true },
      { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(), inline: true },
      { name: "🌐 IP",          value: safe(opts.ip, "—"),                               inline: true },
      { name: "✅ Privacidad",  value: opts.privacyAccepted ? "Aceptada" : "No",         inline: true },
      { name: "📣 Marketing",   value: opts.marketingAccepted ? "Aceptado" : "No",       inline: true },
    ],
    author: makeAuthor(),
    footer: makeFooter(),
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
  bookingId?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "🆔 ID Lead",      value: `\`${opts.leadId}\``,                                inline: true },
    { name: "👤 Nombre",       value: opts.name,                                             inline: true },
    { name: "📧 Email",        value: opts.email,                                            inline: true },
    { name: "📱 Teléfono",     value: safe(opts.phone),                                      inline: true },
    { name: "📍 Fuente",       value: opts.source,                                            inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),    inline: true },
  ];

  if (opts.activity) fields.push({ name: "💼 Actividad", value: opts.activity, inline: true });
  if (opts.ip) fields.push({ name: "🌐 IP", value: opts.ip, inline: true });

  if (opts.bookingId) {
    fields.push(divider());
    fields.push({ name: "⚙️ Panel admin", value: `[Ver en admin](${adminLink(opts.bookingId)})`, inline: true });
  }

  _send("registros", {
    title: "🆕 Nuevo lead registrado",
    description: `**${opts.name}** se ha registrado desde **${opts.source}**.`,
    color: COLOR.PURPLE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
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
    { name: `${deviceEmoji} Dispositivo`, value: safe(opts.device, "Desconocido"),                        inline: true },
    { name: `${flag(opts.language)} Idioma`, value: (opts.language || "es").toUpperCase(),                inline: true },
    { name: "🌐 IP",                value: opts.ip,                                                       inline: true },
    { name: "📐 Pantalla",          value: safe(opts.screen, "—"),                                         inline: true },
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
    color: opts.isNew ? COLOR.GREEN_DARK : COLOR.GREY,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
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
    { name: "🌐 IP",                value: safe(opts.ip, "—"),                                          inline: true },
    { name: "📋 Versión política",  value: safe(opts.privacyVersion, "—"),                              inline: true },
  ];

  if (opts.email) fields.push({ name: "📧 Email", value: opts.email, inline: true });
  if (opts.source) fields.push({ name: "📍 Fuente", value: opts.source, inline: true });

  _send("consentimientos", {
    title,
    color: isCookie ? COLOR.ORANGE : COLOR.BLUE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERRORES CRÍTICOS (canal dedicado con fallback a registros)
// ═══════════════════════════════════════════════════════════════════════════════

export function notifyCriticalError(opts: {
  context: string;
  message: string;
  code?: string | null;
  path?: string | null;
  method?: string | null;
  statusCode?: number | null;
  stack?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "⚙️ Contexto",   value: opts.context,                   inline: true },
    { name: "🏷️ Código",     value: opts.code || "SERVER_ERROR",    inline: true },
  ];

  if (opts.method) fields.push({ name: "📡 Método", value: opts.method, inline: true });
  if (opts.path) fields.push({ name: "📄 Ruta", value: `\`${opts.path.slice(0, 200)}\``, inline: true });
  if (opts.statusCode) fields.push({ name: "🔢 Status", value: String(opts.statusCode), inline: true });

  fields.push(divider());
  fields.push({ name: "💬 Mensaje de error", value: `\`\`\`${opts.message.slice(0, 800)}\`\`\`` });

  if (opts.stack && process.env.NODE_ENV !== "production") {
    fields.push({ name: "📜 Stack trace", value: `\`\`\`${opts.stack.slice(0, 600)}\`\`\`` });
  }

  _send("errores", {
    title: "🚨 Error crítico del servidor",
    description: `Se ha producido un error en **${opts.context}**. Requiere atención inmediata.`,
    color: COLOR.RED_INTENSE,
    fields,
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}

export function notifySystemEvent(opts: {
  title: string;
  description: string;
  type?: "info" | "warning" | "success";
  fields?: EmbedField[];
}): void {
  const colorMap = {
    info: COLOR.BLUE,
    warning: COLOR.ORANGE,
    success: COLOR.GREEN,
  };

  _send("registros", {
    title: opts.title,
    description: opts.description,
    color: colorMap[opts.type || "info"],
    fields: opts.fields || [],
    author: makeAuthor(),
    footer: makeFooter(),
    timestamp: new Date().toISOString(),
  });
}
