/**
 * Discord webhook notification service
 *
 * Único canal de visibilidad operativa para todos los eventos del backend
 * (registros, leads, calculadora, agenda, consentimientos, actividad, errores
 * y validaciones). Google Sheets ha sido eliminado por completo.
 *
 * Canales (selección por tipo de evento):
 *   DISCORD_WEBHOOK_REGISTROS       → Leads, newsletter
 *   DISCORD_WEBHOOK_CALCULADORA     → Calculadora fiscal
 *   DISCORD_WEBHOOK_ACTIVIDAD       → Visitas web
 *   DISCORD_WEBHOOK_AGENDA          → Reservas (creadas, reagendadas, canceladas, no-show)
 *   DISCORD_WEBHOOK_CONSENTIMIENTOS → Privacidad / cookies
 *   DISCORD_WEBHOOK_ERRORES         → Errores críticos + validaciones (fallback: registros)
 *
 * Helper único: `notifyEvent(envelope)` — todos los `notify*` lo usan internamente.
 *
 * Payload normalizado (envelope):
 *   - `type`        → catálogo en `EVENT_TYPES`
 *   - `criticality` → `info | business | warning | error`
 *   - `channel`     → seleccionado a partir de `type` (o explícito)
 *   - `origin`      → módulo/ruta lógica (ej. "public/booking")
 *   - `route`       → ruta HTTP cuando aplique (ej. "/api/bookings/book")
 *   - `method`      → método HTTP cuando aplique
 *   - `language`    → idioma del usuario
 *   - `source`      → fuente / referrer / utm
 *   - `user`        → identificador del usuario (email) cuando aplique
 *   - `data`        → campos específicos del evento (ya formateados)
 *
 * Timestamp: ISO UTC + hora local Europe/Madrid con segundos.
 * Reintentos: backoff exponencial (max 3) ante 429/5xx o errores de red.
 * Errores definitivos: log interno (logger.warn) sin romper el flujo.
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

// ─── Event catalog & criticality ─────────────────────────────────────────────

export const EVENT_TYPES = {
  BOOKING_CREATED:     "booking_created",
  BOOKING_RESCHEDULED: "booking_rescheduled",
  BOOKING_CANCELLED:   "booking_cancelled",
  BOOKING_NO_SHOW:     "booking_no_show",
  LEAD_NEW:            "lead_new",
  LEAD_CALCULATOR:     "lead_calculator",
  LEAD_NEWSLETTER:     "lead_newsletter",
  CONSENT_LOGGED:      "consent_logged",
  USER_ACTIVITY:       "user_activity",
  VALIDATION_FAILED:   "validation_failed",
  SYSTEM_ERROR:        "system_error",
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type Criticality = "info" | "business" | "warning" | "error";

const CRITICALITY_LABEL: Record<Criticality, string> = {
  info:     "Info",
  business: "Negocio",
  warning:  "Advertencia",
  error:    "Error",
};

const TYPE_TO_CHANNEL: Record<EventType, Channel> = {
  booking_created:     "agenda",
  booking_rescheduled: "agenda",
  booking_cancelled:   "agenda",
  booking_no_show:     "agenda",
  lead_new:            "registros",
  lead_calculator:     "calculadora",
  lead_newsletter:     "registros",
  consent_logged:      "consentimientos",
  user_activity:       "actividad",
  validation_failed:   "errores",
  system_error:        "errores",
};

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
  if (!url) {
    logger.debug(`Discord webhook missing for channel '${channel}' — event dropped`, "discord");
    return;
  }
  enqueueItem({
    url,
    payload: {
      embeds: [clampEmbed(embed)],
    },
    attempt: 0,
  });
}

// ─── Normalized envelope / central helper ────────────────────────────────────

/**
 * Envelope normalizado para todos los eventos enviados a Discord.
 * Un único helper (`notifyEvent`) construye el embed final, añade los campos
 * de metadatos comunes (Tipo, Criticidad, Origen, Idioma, Fuente, etc.) y
 * encola el envío con reintentos.
 */
export interface EventEnvelope {
  type: EventType;
  criticality: Criticality;
  title: string;
  description?: string;
  color?: number;
  channel?: Channel;          // override; por defecto se deriva de `type`
  origin?: string | null;     // ej. "public/booking", "admin/agenda"
  route?: string | null;      // ej. "/api/bookings/book"
  method?: string | null;     // GET / POST / ...
  language?: string | null;
  source?: string | null;     // referrer / utm / canal de origen
  user?: string | null;       // identificador del usuario (email)
  ip?: string | null;
  fields?: EmbedField[];      // campos específicos del evento (orden preservado)
}

const CRITICALITY_COLOR: Record<Criticality, number> = {
  info:     COLOR.GREY,
  business: COLOR.GREEN,
  warning:  COLOR.ORANGE,
  error:    COLOR.RED_INTENSE,
};

export function notifyEvent(ev: EventEnvelope): void {
  const channel = ev.channel || TYPE_TO_CHANNEL[ev.type];
  const fields: FieldList = [];

  // Metadatos del envelope siempre primero — formato coherente.
  pushAlways(fields, "Tipo", ev.type, true);
  pushAlways(fields, "Criticidad", CRITICALITY_LABEL[ev.criticality], true);
  if (ev.origin) pushAlways(fields, "Origen", ev.origin, true);
  if (ev.method || ev.route) {
    const r = `${ev.method ? ev.method + " " : ""}${ev.route || ""}`.trim();
    if (r) pushAlways(fields, "Ruta", `\`${r.slice(0, 200)}\``, true);
  }
  if (ev.language) pushAlways(fields, "Idioma", langLabel(ev.language), true);
  if (ev.source) pushAlways(fields, "Fuente", ev.source.slice(0, 200), true);
  if (ev.user) pushAlways(fields, "Usuario", ev.user, true);
  if (ev.ip) pushAlways(fields, "IP", ev.ip, true);

  // Campos específicos del evento (data) tras los metadatos.
  if (ev.fields) for (const f of ev.fields) fields.push(f);

  pushAlways(fields, "Registrado", madridTimestamp(), false);

  send(channel, {
    title: ev.title,
    description: ev.description,
    color: ev.color ?? CRITICALITY_COLOR[ev.criticality],
    fields,
    timestamp: madridISO(),
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

// ─── Helpers comunes para los wrappers ───────────────────────────────────────

function bookingLinks(bookingId: string, manageToken?: string | null): EmbedField[] {
  const out: EmbedField[] = [];
  const cl = clientLink(bookingId, manageToken);
  if (cl) out.push({ name: "Gestion cliente", value: `[Abrir](${cl})`, inline: true });
  out.push({ name: "Panel admin", value: `[Gestionar](${adminLink(bookingId)})`, inline: true });
  return out;
}

// ═════════════════════════════════════════════════════════════════════════════
// EVENTOS DE NEGOCIO — wrappers tipados sobre notifyEvent
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
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Confirmada", true);
  pushAlways(fields, "Fecha", `**${opts.date}**`, true);
  pushAlways(fields, "Horario", `${opts.startTime} — ${opts.endTime}`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);
  pushAlways(fields, "Nombre", fullName, true);
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

  for (const f of bookingLinks(opts.bookingId, opts.manageToken)) fields.push(f);

  notifyEvent({
    type: EVENT_TYPES.BOOKING_CREATED,
    criticality: "business",
    title: `Nueva asesoria — ${opts.date} ${opts.startTime}`,
    description: `**${fullName}** ha reservado una asesoria fiscal.`,
    color: COLOR.GREEN,
    origin: "public/booking",
    route: "/api/bookings/book",
    method: "POST",
    language: opts.language || null,
    user: opts.email,
    ip: opts.ip || null,
    fields,
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
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Reagendada", true);
  pushAlways(fields, "Fecha anterior", opts.oldDate ? `~~${opts.oldDate}${opts.oldStartTime ? " " + opts.oldStartTime : ""}~~` : "—", true);
  pushAlways(fields, "Nueva fecha", `**${opts.newDate}**`, true);
  pushAlways(fields, "Nuevo horario", `**${opts.newStartTime} — ${opts.newEndTime}**`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);
  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);
  pushAlways(fields, "Google Meet", opts.newMeetLink ? `[Unirse](${opts.newMeetLink})` : "Sin cambios", true);
  pushAlways(fields, "Reagendamientos", String(opts.rescheduleCount ?? 1), true);

  for (const f of bookingLinks(opts.bookingId, opts.manageToken)) fields.push(f);

  notifyEvent({
    type: EVENT_TYPES.BOOKING_RESCHEDULED,
    criticality: "business",
    title: `Asesoria reagendada — ${opts.newDate} ${opts.newStartTime}`,
    description: `**${opts.name}** ha cambiado la fecha de su asesoria.`,
    color: COLOR.TEAL,
    origin: opts.source === "admin" ? "admin/agenda" : "public/booking",
    route: opts.source === "admin"
      ? `/api/admin/agenda/${opts.bookingId}/reschedule`
      : `/api/booking/${opts.bookingId}/reschedule`,
    method: "POST",
    language: opts.language || null,
    source: sourceLabel,
    user: opts.email,
    ip: opts.ip || null,
    fields,
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
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "Cancelada", true);
  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);
  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);

  if (opts.reason) pushAlways(fields, "Motivo", opts.reason.slice(0, 300), false);
  pushAlways(fields, "Panel admin", `[Ver reserva](${adminLink(opts.bookingId)})`, true);

  notifyEvent({
    type: EVENT_TYPES.BOOKING_CANCELLED,
    criticality: "warning",
    title: `Asesoria cancelada — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** ha cancelado su asesoria.`,
    color: COLOR.RED,
    origin: opts.source === "admin" ? "admin/agenda" : "public/booking",
    route: opts.source === "admin"
      ? `/api/admin/agenda/${opts.bookingId}/cancel`
      : `/api/booking/${opts.bookingId}/cancel`,
    method: "POST",
    language: opts.language || null,
    source: sourceLabel,
    user: opts.email,
    ip: opts.ip || null,
    fields,
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
  const fields: FieldList = [];

  pushAlways(fields, "ID Reserva", `\`${opts.bookingId}\``, true);
  pushAlways(fields, "Estado", "No-show", true);
  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);
  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Telefono", opts.phone?.trim() || "—", true);

  if (opts.meetLink) pushAlways(fields, "Google Meet", `[Enlace](${opts.meetLink})`, true);
  pushAlways(fields, "Panel admin", `[Gestionar](${adminLink(opts.bookingId)})`, true);

  notifyEvent({
    type: EVENT_TYPES.BOOKING_NO_SHOW,
    criticality: "warning",
    title: `No-show — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** no se presento a la asesoria. Contactar para reagendar.`,
    color: COLOR.ORANGE,
    origin: "admin/agenda",
    route: `/api/admin/agenda/${opts.bookingId}/no-show`,
    method: "POST",
    language: opts.language || null,
    user: opts.email,
    fields,
  });
}

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
  const fields: FieldList = [];

  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
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

  notifyEvent({
    type: EVENT_TYPES.LEAD_CALCULATOR,
    criticality: "business",
    title: `Calculadora — ${fmt(opts.ahorro)} ahorro`,
    description: opts.country
      ? `Nuevo calculo desde **${opts.country}** (${opts.regime || "regimen no especificado"}).`
      : undefined,
    color: COLOR.GREEN,
    origin: "public/calculator",
    route: "/api/calculator-leads",
    method: "POST",
    language: opts.language || null,
    source: opts.referrer ? opts.referrer.slice(0, 200) : null,
    user: opts.email,
    ip: opts.ip || null,
    fields,
  });
}

export function notifyNewsletterSubscribe(opts: {
  email: string;
  source?: string | null;
  language?: string | null;
  ip?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
}): void {
  const fields: FieldList = [];
  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted ? "Aceptado" : "No", true);

  notifyEvent({
    type: EVENT_TYPES.LEAD_NEWSLETTER,
    criticality: "business",
    title: "Nueva suscripcion newsletter",
    color: COLOR.TEAL,
    origin: "public/newsletter",
    route: "/api/newsletter/subscribe",
    method: "POST",
    language: opts.language || null,
    source: opts.source || "footer",
    user: opts.email,
    ip: opts.ip || null,
    fields,
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
  const fields: FieldList = [];
  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
  pushAlways(fields, "Nombre", opts.name, true);
  push(fields, "Telefono", opts.phone);
  push(fields, "Actividad", opts.activity);
  if (opts.bookingId) {
    pushAlways(fields, "Panel admin", `[Ver](${adminLink(opts.bookingId)})`, true);
  }

  notifyEvent({
    type: EVENT_TYPES.LEAD_NEW,
    criticality: "business",
    title: `Nuevo lead — ${opts.source}`,
    description: `**${opts.name}** se ha registrado.`,
    color: COLOR.PURPLE,
    origin: "public/lead",
    language: opts.language || null,
    source: opts.source,
    user: opts.email,
    ip: opts.ip || null,
    fields,
  });
}

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
  const fields: FieldList = [];

  pushAlways(fields, "Pagina", page, true);
  pushAlways(fields, "Dispositivo", opts.device || "Desconocido", true);
  pushAlways(fields, "Visitante", opts.isNew ? "Nuevo" : "Recurrente", true);
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

  if (opts.utmSource) pushAlways(fields, "UTM Source", opts.utmSource, true);
  if (opts.utmMedium) pushAlways(fields, "UTM Medium", opts.utmMedium, true);
  if (opts.utmCampaign) pushAlways(fields, "UTM Campaign", opts.utmCampaign.slice(0, 100), true);
  if (opts.utmContent) pushAlways(fields, "UTM Content", opts.utmContent.slice(0, 100), true);

  if (opts.sessionId) pushAlways(fields, "Sesion", `\`${opts.sessionId.slice(0, 16)}\``, true);

  notifyEvent({
    type: EVENT_TYPES.USER_ACTIVITY,
    criticality: "info",
    title: `Visita — ${page}`,
    color: opts.isNew ? COLOR.GREEN : COLOR.GREY,
    origin: "public/visitor",
    route: page,
    language: opts.language || null,
    source: opts.referrer ? opts.referrer.slice(0, 200) : null,
    ip: opts.ip,
    fields,
  });
}

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
  const fields: FieldList = [];

  pushAlways(fields, "Formulario", typeLabel, true);
  pushAlways(fields, "Privacidad", opts.privacyAccepted ? "Aceptada" : "No aceptada", true);
  pushAlways(fields, "Marketing", opts.marketingAccepted === true ? "Aceptado" : opts.marketingAccepted === false ? "Rechazado" : "N/A", true);
  push(fields, "Version politica", opts.privacyVersion);

  notifyEvent({
    type: EVENT_TYPES.CONSENT_LOGGED,
    criticality: "info",
    title: isCookie ? `Consentimiento cookies — ${typeLabel}` : `Consentimiento — ${typeLabel}`,
    color: isCookie ? COLOR.ORANGE : COLOR.BLUE,
    origin: isCookie ? "public/cookies" : `public/${typeLabel}`,
    language: opts.language || null,
    source: opts.source || null,
    user: opts.email || null,
    ip: opts.ip || null,
    fields,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// VALIDACIÓN FALLIDA
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Notifica una validación fallida (400). Se invoca una sola vez por petición
 * desde `apiValidationFail`. Los detalles se truncan para evitar ruido.
 */
export function notifyValidationFailed(opts: {
  route?: string | null;
  method?: string | null;
  language?: string | null;
  ip?: string | null;
  origin?: string | null;
  details?: Record<string, string>;
}): void {
  const fields: FieldList = [];
  if (opts.details) {
    const entries = Object.entries(opts.details).slice(0, 10);
    if (entries.length > 0) {
      const text = entries.map(([k, v]) => `• \`${k}\`: ${String(v).slice(0, 120)}`).join("\n");
      pushAlways(fields, "Campos invalidos", text.slice(0, 1000), false);
    }
  }

  notifyEvent({
    type: EVENT_TYPES.VALIDATION_FAILED,
    criticality: "warning",
    title: `Validacion fallida — ${opts.method || "?"} ${opts.route || "?"}`,
    description: "La peticion fue rechazada por validacion de esquema.",
    color: COLOR.ORANGE,
    origin: opts.origin || "api",
    route: opts.route || null,
    method: opts.method || null,
    language: opts.language || null,
    ip: opts.ip || null,
    fields,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// ERRORES CRITICOS
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
  const fields: FieldList = [];

  pushAlways(fields, "Contexto", opts.context, true);
  pushAlways(fields, "Codigo", opts.code || "SERVER_ERROR", true);
  if (opts.statusCode) pushAlways(fields, "Status", String(opts.statusCode), true);

  pushAlways(fields, "Mensaje de error", `\`\`\`${opts.message.slice(0, 800)}\`\`\``, false);

  if (opts.stack && process.env.NODE_ENV !== "production") {
    pushAlways(fields, "Stack trace", `\`\`\`${opts.stack.slice(0, 600)}\`\`\``, false);
  }

  notifyEvent({
    type: EVENT_TYPES.SYSTEM_ERROR,
    criticality: "error",
    title: "Error critico del servidor",
    description: `Se ha producido un error en **${opts.context}**.`,
    color: COLOR.RED_INTENSE,
    origin: opts.context,
    route: opts.path || null,
    method: opts.method || null,
    fields,
  });
}
