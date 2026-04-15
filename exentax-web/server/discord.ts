/**
 * Discord webhook notification service
 *
 * Channels:
 *   DISCORD_WEBHOOK_REGISTROS       → Newsletter, leads
 *   DISCORD_WEBHOOK_CALCULADORA     → Tax calculator results
 *   DISCORD_WEBHOOK_ACTIVIDAD       → Web visits
 *   DISCORD_WEBHOOK_AGENDA          → Bookings (create, reschedule, cancel, no-show)
 *   DISCORD_WEBHOOK_CONSENTIMIENTOS → Privacy/cookie consent
 *   DISCORD_WEBHOOK_ERRORES         → Critical server errors (fallback: registros)
 *
 * Identity: uses the webhook name and avatar configured in Discord.
 *           No username/avatar_url overrides from code.
 *
 * Timestamps: all embeds include full Madrid-local time
 *             (dd/MM/yyyy HH:mm:ss Europe/Madrid)
 *
 * Rate: one message per 1.5s per channel (~40 msg/min/channel)
 */

import { logger } from "./logger";
import { SITE_URL, DEFAULT_TIMEZONE } from "./server-constants";

// ─── Link builders ───────────────────────────────────────────────────────────

function adminLink(bookingId: string): string {
  return `${SITE_URL}/admin/agenda/${bookingId}`;
}

function clientLink(bookingId: string, manageToken?: string | null): string | null {
  if (!manageToken) return null;
  return `${SITE_URL}/booking/${bookingId}?token=${manageToken}`;
}

// ─── Channel routing ─────────────────────────────────────────────────────────

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

// ─── Color palette (Exentax brand) ──────────────────────────────────────────

const COLOR = {
  GREEN:       0x00E510,
  TEAL:        0x1ABC9C,
  RED:         0xDC2626,
  RED_INTENSE: 0xC0392B,
  ORANGE:      0xF39C12,
  PURPLE:      0x9B59B6,
  BLUE:        0x3498DB,
  GREY:        0x95A5A6,
} as const;

// ─── Timestamp helpers ──────────────────────────────────────────────────────

function madridTimestamp(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("es-ES", {
    timeZone: DEFAULT_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value || "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")} ${DEFAULT_TIMEZONE}`;
}

function madridISO(): string {
  return new Date().toISOString();
}

// ─── Discord types & limits ──────────────────────────────────────────────────

interface EmbedField { name: string; value: string; inline?: boolean }

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: EmbedField[];
  timestamp: string;
}

interface DiscordPayload {
  embeds: DiscordEmbed[];
}

const DISCORD_FIELD_LIMIT = 25;
const DISCORD_FIELD_NAME_MAX = 256;
const DISCORD_FIELD_VALUE_MAX = 1024;
const DISCORD_DESC_MAX = 4096;

function clampEmbed(embed: DiscordEmbed): DiscordEmbed {
  if (embed.description && embed.description.length > DISCORD_DESC_MAX) {
    embed.description = embed.description.slice(0, DISCORD_DESC_MAX - 3) + "...";
  }
  if (embed.fields.length > DISCORD_FIELD_LIMIT) {
    embed.fields = embed.fields.slice(0, DISCORD_FIELD_LIMIT - 1);
    embed.fields.push({ name: "Aviso", value: "Campos omitidos por limite de Discord.", inline: false });
  }
  for (const f of embed.fields) {
    if (f.name.length > DISCORD_FIELD_NAME_MAX) f.name = f.name.slice(0, DISCORD_FIELD_NAME_MAX - 3) + "...";
    if (f.value.length > DISCORD_FIELD_VALUE_MAX) f.value = f.value.slice(0, DISCORD_FIELD_VALUE_MAX - 3) + "...";
  }
  return embed;
}

// ─── Queue system ────────────────────────────────────────────────────────────

const QUEUE_MAX = 80;
const DRAIN_INTERVAL_MS = 1_500;
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 8_000;

interface QueueItem { url: string; payload: DiscordPayload; attempt: number }

const _queue: QueueItem[] = [];
let _drainTimer: NodeJS.Timeout | null = null;

function ensureDrainTimer(): void {
  if (_drainTimer) return;
  _drainTimer = setInterval(drainQueue, DRAIN_INTERVAL_MS);
  _drainTimer.unref();
}

function drainQueue(): void {
  const item = _queue.shift();
  if (!item) return;
  sendPayload(item);
}

async function sendPayload(item: QueueItem): Promise<void> {
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
        setTimeout(() => enqueueItem({ ...item, attempt: item.attempt + 1 }), backoff);
      } else {
        logger.warn(`Discord webhook HTTP ${res.status}: ${body.slice(0, 300)}`, "discord");
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (item.attempt < MAX_RETRIES) {
      const backoff = Math.min(DRAIN_INTERVAL_MS * 2 ** item.attempt, 30_000);
      setTimeout(() => enqueueItem({ ...item, attempt: item.attempt + 1 }), backoff);
    } else {
      logger.warn(`Discord send failed after ${MAX_RETRIES} retries: ${msg}`, "discord");
    }
  }
}

function enqueueItem(item: QueueItem): void {
  if (_queue.length >= QUEUE_MAX) {
    _queue.shift();
    logger.warn("Discord queue full — oldest message dropped", "discord");
  }
  _queue.push(item);
  ensureDrainTimer();
}

// ─── Core send ───────────────────────────────────────────────────────────────

function send(channel: Channel, embed: DiscordEmbed): void {
  const url = getWebhookUrl(channel);
  if (!url) return;
  enqueueItem({
    url,
    payload: {
      embeds: [clampEmbed(embed)],
    },
    attempt: 0,
  });
}

// ─── Field helpers ───────────────────────────────────────────────────────────

function langLabel(lang: string | null | undefined): string {
  const labels: Record<string, string> = { es: "ES", en: "EN", fr: "FR", de: "DE", pt: "PT", ca: "CA" };
  return labels[lang || "es"] || (lang || "es").toUpperCase();
}

function fmt(n: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

type FieldList = EmbedField[];

function push(fields: FieldList, name: string, value: string | null | undefined, inline = true): void {
  if (!value || !value.trim()) return;
  fields.push({ name, value: value.trim(), inline });
}

function pushAlways(fields: FieldList, name: string, value: string, inline = true): void {
  fields.push({ name, value, inline });
}

function pushLinks(fields: FieldList, bookingId: string, manageToken?: string | null): void {
  const cl = clientLink(bookingId, manageToken);
  if (cl) fields.push({ name: "Gestion cliente", value: `[Abrir](${cl})`, inline: true });
  fields.push({ name: "Panel admin", value: `[Gestionar](${adminLink(bookingId)})`, inline: true });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: AGENDA
// ═════════════════════════════════════════════════════════════════════════════

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
  monthlyProfit?: string | number | null;
  globalClients?: boolean | null;
  digitalOperation?: boolean | null;
  notes?: string | null;
  context?: string | null;
  shareNote?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
}): void {
  const fullName = `${opts.name}${opts.lastName ? " " + opts.lastName : ""}`;
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Confirmada", true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  pushAlways(fields, "Fecha", `**${opts.date}**`, true);
  pushAlways(fields, "Horario", `${opts.startTime} — ${opts.endTime}`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Nombre", fullName, true);
  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);

  if (opts.meetLink) pushAlways(fields, "Google Meet", `[Unirse](${opts.meetLink})`, true);
  push(fields, "Actividad", opts.activity);
  if (opts.monthlyProfit != null) pushAlways(fields, "Beneficio mensual", String(opts.monthlyProfit), true);
  if (opts.globalClients != null) pushAlways(fields, "Clientes internacionales", opts.globalClients ? "Si" : "No", true);
  if (opts.digitalOperation != null) pushAlways(fields, "Operacion digital", opts.digitalOperation ? "Si" : "No", true);

  if (opts.notes) pushAlways(fields, "Notas del cliente", opts.notes.slice(0, 500), false);
  if (opts.context) pushAlways(fields, "Contexto", opts.context.slice(0, 500), false);
  if (opts.shareNote) pushAlways(fields, "Nota adicional", opts.shareNote.slice(0, 300), false);

  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted ? "Aceptado" : "No", true);
  push(fields, "IP", opts.ip);

  pushLinks(fields, opts.bookingId, opts.manageToken);

  pushAlways(fields, "Registrado", ts, false);

  send("agenda", {
    title: `Nueva asesoria — ${opts.date} ${opts.startTime}`,
    description: `**${fullName}** ha reservado una asesoria fiscal.`,
    color: COLOR.GREEN,
    fields,
    timestamp: madridISO(),
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
  const sourceLabel = opts.source === "admin" ? "Admin" : "Cliente";
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Reagendada", true);
  pushAlways(fields, "Origen", sourceLabel, true);

  pushAlways(fields, "Fecha anterior", opts.oldDate ? `~~${opts.oldDate}${opts.oldStartTime ? " " + opts.oldStartTime : ""}~~` : "—", true);
  pushAlways(fields, "Nueva fecha", `**${opts.newDate}**`, true);
  pushAlways(fields, "Nuevo horario", `**${opts.newStartTime} — ${opts.newEndTime}**`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  pushAlways(fields, "Google Meet", opts.newMeetLink ? `[Unirse](${opts.newMeetLink})` : "Sin cambios", true);
  pushAlways(fields, "Reagendamientos", String(opts.rescheduleCount ?? 1), true);
  push(fields, "IP", opts.ip);

  pushLinks(fields, opts.bookingId, opts.manageToken);

  pushAlways(fields, "Registrado", ts, false);

  send("agenda", {
    title: `Asesoria reagendada — ${opts.newDate} ${opts.newStartTime}`,
    description: `**${opts.name}** ha cambiado la fecha de su asesoria. Origen: **${sourceLabel}**.`,
    color: COLOR.TEAL,
    fields,
    timestamp: madridISO(),
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
  const sourceLabel = opts.source === "admin" ? "Admin" : "Cliente";
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Cancelada", true);
  pushAlways(fields, "Origen", sourceLabel, true);

  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  if (opts.reason) pushAlways(fields, "Motivo", opts.reason.slice(0, 300), false);
  push(fields, "IP", opts.ip);

  pushAlways(fields, "Panel admin", `[Ver reserva](${adminLink(opts.bookingId)})`, true);

  pushAlways(fields, "Registrado", ts, false);

  send("agenda", {
    title: `Asesoria cancelada — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** ha cancelado su asesoria. Origen: **${sourceLabel}**.`,
    color: COLOR.RED,
    fields,
    timestamp: madridISO(),
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
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "No-show", true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);

  if (opts.meetLink) pushAlways(fields, "Google Meet", `[Enlace](${opts.meetLink})`, true);

  pushAlways(fields, "Panel admin", `[Gestionar](${adminLink(opts.bookingId)})`, true);

  pushAlways(fields, "Registrado", ts, false);

  send("agenda", {
    title: `No-show — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** no se presento a la asesoria. Contactar para reagendar.`,
    color: COLOR.ORANGE,
    fields,
    timestamp: madridISO(),
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: CALCULADORA
// ═════════════════════════════════════════════════════════════════════════════

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
  const ahorroAbs = Math.abs(opts.ahorro);
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  pushAlways(fields, "Pais", opts.country?.trim() || "No especificado", true);
  pushAlways(fields, "Regimen fiscal", opts.regime?.trim() || "No especificado", true);
  push(fields, "Actividad", opts.activity);

  if (opts.monthlyIncome != null) pushAlways(fields, "Ingresos mensuales", fmt(opts.monthlyIncome), true);
  if (opts.annualIncome != null) pushAlways(fields, "Ingresos anuales", fmt(opts.annualIncome), true);
  if (opts.localTax != null) pushAlways(fields, "Impuestos locales", fmt(opts.localTax), true);
  if (opts.llcTax != null) pushAlways(fields, "Impuestos LLC", fmt(opts.llcTax), true);
  pushAlways(fields, "Ahorro estimado", `**${fmt(opts.ahorro)}** / anual`, true);

  push(fields, "Nombre", opts.name);
  push(fields, "Telefono", opts.phone);

  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted ? "Aceptado" : "No", true);
  push(fields, "IP", opts.ip);
  if (opts.referrer) pushAlways(fields, "Referrer", opts.referrer.slice(0, 200), true);

  pushAlways(fields, "Registrado", ts, false);

  send("calculadora", {
    title: `Calculadora — ${fmt(opts.ahorro)} ahorro`,
    description: opts.country
      ? `Nuevo calculo desde **${opts.country}** (${opts.regime || "regimen no especificado"}).`
      : undefined,
    color: COLOR.GREEN,
    fields,
    timestamp: madridISO(),
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: REGISTROS WEB
// ═════════════════════════════════════════════════════════════════════════════

export function notifyNewsletterSubscribe(opts: {
  email: string;
  source?: string | null;
  language?: string | null;
  ip?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
}): void {
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "Email", opts.email, true);
  pushAlways(fields, "Fuente", opts.source || "footer", true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);
  push(fields, "IP", opts.ip);
  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted ? "Aceptado" : "No", true);

  pushAlways(fields, "Registrado", ts, false);

  send("registros", {
    title: "Nueva suscripcion newsletter",
    color: COLOR.TEAL,
    fields,
    timestamp: madridISO(),
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
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
  pushAlways(fields, "Fuente", opts.source, true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);

  pushAlways(fields, "Nombre", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);
  push(fields, "Actividad", opts.activity);
  push(fields, "IP", opts.ip);

  if (opts.bookingId) {
    pushAlways(fields, "Panel admin", `[Ver](${adminLink(opts.bookingId)})`, true);
  }

  pushAlways(fields, "Registrado", ts, false);

  send("registros", {
    title: `Nuevo lead — ${opts.source}`,
    description: `**${opts.name}** se ha registrado.`,
    color: COLOR.PURPLE,
    fields,
    timestamp: madridISO(),
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: ACTIVIDAD WEB
// ═════════════════════════════════════════════════════════════════════════════

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
  const page = opts.page || "/";
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "Pagina", page, true);
  pushAlways(fields, "Dispositivo", opts.device || "Desconocido", true);
  pushAlways(fields, "Visitante", opts.isNew ? "Nuevo" : "Recurrente", true);

  pushAlways(fields, "IP", opts.ip, true);
  pushAlways(fields, "Idioma", langLabel(opts.language), true);
  push(fields, "Pantalla", opts.screen);

  let browser = "";
  if (opts.userAgent) {
    const ua = opts.userAgent;
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = "Chrome";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Edge/i.test(ua)) browser = "Edge";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";
    else browser = ua.slice(0, 50);
  }
  push(fields, "Navegador", browser);
  push(fields, "Referrer", opts.referrer?.slice(0, 200));

  if (opts.utmSource) pushAlways(fields, "UTM Source", opts.utmSource, true);
  if (opts.utmMedium) pushAlways(fields, "UTM Medium", opts.utmMedium, true);
  if (opts.utmCampaign) pushAlways(fields, "UTM Campaign", opts.utmCampaign.slice(0, 100), true);
  if (opts.utmContent) pushAlways(fields, "UTM Content", opts.utmContent.slice(0, 100), true);

  if (opts.sessionId) pushAlways(fields, "Sesion", `\`${opts.sessionId.slice(0, 16)}\``, true);

  pushAlways(fields, "Registrado", ts, false);

  send("actividad", {
    title: `Visita — ${page}`,
    color: opts.isNew ? COLOR.GREEN : COLOR.GREY,
    fields,
    timestamp: madridISO(),
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: CONSENTIMIENTOS
// ═════════════════════════════════════════════════════════════════════════════

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
  const typeLabel = isCookie ? opts.formType.replace("cookies:", "") : opts.formType;
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "Tipo", typeLabel, true);
  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No aceptada", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted === true ? "Aceptado" : opts.marketingAccepted === false ? "Rechazado" : "N/A", true);

  pushAlways(fields, "Idioma", langLabel(opts.language), true);
  push(fields, "Version politica", opts.privacyVersion);
  push(fields, "IP", opts.ip);
  push(fields, "Email", opts.email);
  push(fields, "Fuente", opts.source);

  pushAlways(fields, "Registrado", ts, false);

  send("consentimientos", {
    title: isCookie ? `Consentimiento cookies — ${typeLabel}` : `Consentimiento — ${typeLabel}`,
    color: isCookie ? COLOR.ORANGE : COLOR.BLUE,
    fields,
    timestamp: madridISO(),
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CANAL: ERRORES CRITICOS
// ═════════════════════════════════════════════════════════════════════════════

export function notifyCriticalError(opts: {
  context: string;
  message: string;
  code?: string | null;
  path?: string | null;
  method?: string | null;
  statusCode?: number | null;
  stack?: string | null;
}): void {
  const ts = madridTimestamp();
  const fields: FieldList = [];

  pushAlways(fields, "Contexto", opts.context, true);
  pushAlways(fields, "Codigo", opts.code || "SERVER_ERROR", true);
  if (opts.statusCode) pushAlways(fields, "Status", String(opts.statusCode), true);

  if (opts.method) pushAlways(fields, "Metodo", opts.method, true);
  if (opts.path) pushAlways(fields, "Ruta", `\`${opts.path.slice(0, 200)}\``, true);

  pushAlways(fields, "Mensaje de error", `\`\`\`${opts.message.slice(0, 800)}\`\`\``, false);

  if (opts.stack && process.env.NODE_ENV !== "production") {
    pushAlways(fields, "Stack trace", `\`\`\`${opts.stack.slice(0, 600)}\`\`\``, false);
  }

  pushAlways(fields, "Registrado", ts, false);

  send("errores", {
    title: "Error critico del servidor",
    description: `Se ha producido un error en **${opts.context}**.`,
    color: COLOR.RED_INTENSE,
    fields,
    timestamp: madridISO(),
  });
}
