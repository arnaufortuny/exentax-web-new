/**
 * Discord webhook notification service
 *
 * Sends structured embed notifications for key business events.
 * Privacy-safe: no full emails, phones, or IPs are transmitted.
 *
 * ENV:  DISCORD_WEBHOOK_URL  (optional — silently disabled if not set)
 * Rate: one message per 1.5 s = ~40 messages/min (Discord limit: 50/min per webhook)
 */

import { logger } from "./logger";
import { SITE_URL } from "./server-constants";

// ─── Event colours ────────────────────────────────────────────────────────────
const COLOURS = {
  booking_created:      0x2ECC71, // green
  booking_rescheduled:  0x3498DB, // blue
  booking_cancelled:    0xE67E22, // orange
  calculator_lead:      0x9B59B6, // purple
  newsletter_subscribe: 0x1ABC9C, // teal
  error_critical:       0xE74C3C, // red
} as const;

export type DiscordEventType = keyof typeof COLOURS;

// ─── Privacy helpers ──────────────────────────────────────────────────────────
function maskEmail(email: string): string {
  const atIdx = email.indexOf("@");
  if (atIdx <= 0) return "***";
  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 4 ? `****${digits.slice(-4)}` : "****";
}

function maskName(name: string | null | undefined): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0].slice(0, 1)}***`;
  return `${parts[0]} ${parts[1].slice(0, 1)}.`;
}

function maskIp(ip: string | null | undefined): string {
  if (!ip) return "—";
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
  return "—";
}

// ─── Discord payload types ────────────────────────────────────────────────────
interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordPayload {
  embeds: [{
    title: string;
    color: number;
    fields: EmbedField[];
    footer: { text: string };
    timestamp: string;
  }];
}

// ─── Rate-limiting queue ──────────────────────────────────────────────────────
const QUEUE_MAX = 50;
const DRAIN_INTERVAL_MS = 1_500; // ~40 messages/min

const _queue: DiscordPayload[] = [];
let _drainTimer: NodeJS.Timeout | null = null;

function _ensureDrainTimer(): void {
  if (_drainTimer) return;
  _drainTimer = setInterval(_drainQueue, DRAIN_INTERVAL_MS);
  _drainTimer.unref(); // don't block process exit
}

function _drainQueue(): void {
  const item = _queue.shift();
  if (!item) return;
  _sendPayload(item);
}

async function _sendPayload(payload: DiscordPayload): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.warn(`Discord webhook HTTP ${res.status}: ${body.slice(0, 200)}`, "discord");
    }
  } catch (err) {
    logger.warn(`Discord send error: ${err instanceof Error ? err.message : String(err)}`, "discord");
  }
}

// ─── Internal enqueue ─────────────────────────────────────────────────────────
function _enqueue(type: DiscordEventType, title: string, fields: EmbedField[]): void {
  if (!process.env.DISCORD_WEBHOOK_URL) return;

  const payload: DiscordPayload = {
    embeds: [{
      title,
      color: COLOURS[type],
      fields,
      footer: { text: `Exentax · ${SITE_URL}` },
      timestamp: new Date().toISOString(),
    }],
  };

  if (_queue.length >= QUEUE_MAX) {
    _queue.shift(); // drop oldest to avoid unbounded growth
    logger.warn("Discord queue full — oldest message dropped", "discord");
  }
  _queue.push(payload);
  _ensureDrainTimer();
}

// ─── Public notification functions ───────────────────────────────────────────

export function notifyBookingCreated(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string | null;
  language?: string | null;
  ip?: string | null;
}): void {
  _enqueue("booking_created", "📅 Nueva reserva", [
    { name: "ID",          value: `\`${opts.bookingId}\``,                               inline: true },
    { name: "Fecha",       value: `${opts.date} ${opts.startTime}–${opts.endTime}`,       inline: true },
    { name: "Idioma",      value: opts.language || "es",                                  inline: true },
    { name: "Cliente",     value: maskName(opts.name),                                    inline: true },
    { name: "Email",       value: maskEmail(opts.email),                                  inline: true },
    { name: "Teléfono",    value: maskPhone(opts.phone),                                  inline: true },
    { name: "Meet",        value: opts.meetLink ? "✓ generado" : "✗ no disponible",       inline: true },
    { name: "IP",          value: maskIp(opts.ip),                                        inline: true },
  ]);
}

export function notifyBookingRescheduled(opts: {
  bookingId: string;
  name: string;
  email: string;
  oldDate?: string | null;
  oldStartTime?: string | null;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  language?: string | null;
}): void {
  _enqueue("booking_rescheduled", "🔄 Reserva reagendada", [
    { name: "ID",          value: `\`${opts.bookingId}\``,                                                    inline: true },
    { name: "Anterior",    value: opts.oldDate ? `${opts.oldDate} ${opts.oldStartTime || ""}` : "—",          inline: true },
    { name: "Nueva fecha", value: `${opts.newDate} ${opts.newStartTime}–${opts.newEndTime}`,                  inline: true },
    { name: "Cliente",     value: maskName(opts.name),                                                        inline: true },
    { name: "Email",       value: maskEmail(opts.email),                                                      inline: true },
    { name: "Idioma",      value: opts.language || "es",                                                      inline: true },
  ]);
}

export function notifyBookingCancelled(opts: {
  bookingId: string;
  name: string;
  email: string;
  date?: string | null;
  startTime?: string | null;
  language?: string | null;
}): void {
  _enqueue("booking_cancelled", "❌ Reserva cancelada", [
    { name: "ID",      value: `\`${opts.bookingId}\``,                                 inline: true },
    { name: "Fecha",   value: opts.date ? `${opts.date} ${opts.startTime || ""}` : "—", inline: true },
    { name: "Idioma",  value: opts.language || "es",                                    inline: true },
    { name: "Cliente", value: maskName(opts.name),                                      inline: true },
    { name: "Email",   value: maskEmail(opts.email),                                    inline: true },
  ]);
}

export function notifyCalculatorLead(opts: {
  leadId: string;
  email: string;
  country?: string | null;
  regime?: string | null;
  ahorro: number;
  annualIncome?: number | null;
  language?: string | null;
  ip?: string | null;
}): void {
  const fmt = (n: number) =>
    new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

  _enqueue("calculator_lead", "🧮 Resultado calculadora", [
    { name: "ID",           value: `\`${opts.leadId}\``,                     inline: true },
    { name: "País",         value: opts.country  || "—",                     inline: true },
    { name: "Régimen",      value: opts.regime   || "—",                     inline: true },
    { name: "Email",        value: maskEmail(opts.email),                     inline: true },
    { name: "Ingresos",     value: opts.annualIncome != null ? fmt(opts.annualIncome) : "—", inline: true },
    { name: "Ahorro est.",  value: fmt(opts.ahorro),                          inline: true },
    { name: "Idioma",       value: opts.language || "es",                    inline: true },
    { name: "IP",           value: maskIp(opts.ip),                           inline: true },
  ]);
}

export function notifyNewsletterSubscribe(opts: {
  email: string;
  source?: string | null;
}): void {
  _enqueue("newsletter_subscribe", "📧 Newsletter · nueva suscripción", [
    { name: "Email",  value: maskEmail(opts.email),   inline: true },
    { name: "Fuente", value: opts.source || "footer", inline: true },
  ]);
}

export function notifyCriticalError(opts: {
  context: string;
  message: string;
  code?: string | null;
  path?: string | null;
}): void {
  const fields: EmbedField[] = [
    { name: "Contexto", value: opts.context,                 inline: true },
    { name: "Código",   value: opts.code || "SERVER_ERROR",  inline: true },
  ];
  if (opts.path) fields.push({ name: "Ruta", value: opts.path.slice(0, 100), inline: true });
  fields.push({ name: "Mensaje", value: opts.message.slice(0, 500) });

  _enqueue("error_critical", "🚨 Error crítico", fields);
}
