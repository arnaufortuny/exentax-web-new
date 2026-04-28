/**
 * Discord notification service — 100% via the Exentax bot REST API.
 *
 * NO Discord webhooks are used by this server any more. Every operational
 * event (registros, leads, calculadora, agenda, consentimientos, actividad,
 * errores, validaciones, auditoría) is delivered as a bot message via
 * `POST /channels/{channel_id}/messages` authenticated with the bot token.
 *
 * Why: a single bot identity owns every message, can be revoked / rotated
 * with one credential, supports interactive components (buttons), and lets
 * us PATCH messages we previously sent (used to update agenda notifications
 * after an admin action — see `editChannelMessage`).
 *
 * Required env (channel IDs, not webhook URLs):
 *   DISCORD_BOT_TOKEN                (the bot identity, shared with discord-bot.ts)
 *   DISCORD_CHANNEL_REGISTROS        → #exentax-registros (leads, newsletter)
 *   DISCORD_CHANNEL_CALCULADORA      → #exentax-calculadora
 *   DISCORD_CHANNEL_ACTIVIDAD        → #exentax-actividad
 *   DISCORD_CHANNEL_AGENDA           → #exentax-agenda
 *   DISCORD_CHANNEL_CONSENTIMIENTOS  → #exentax-consentimientos
 *   DISCORD_CHANNEL_ERRORES          → #exentax-errores  (fallback: registros)
 *   DISCORD_CHANNEL_AUDITORIA        → #sistema-auditoria
 *
 * Identity (Exentax brand):
 *   - The Exentax bot itself owns its username / avatar in Discord — we no
 *     longer send `username` / `avatar_url` overrides per message. The
 *     bot must be configured once in the Discord developer portal to use
 *     the neon-green icon and "Exentax" name.
 *   - `send()` still forces the Exentax neon green color (`0x00E510`) on
 *     every embed, regardless of any color requested by callers. The
 *     legacy palette (TEAL/RED/ORANGE/PURPLE/BLUE/GREY) survives only as
 *     internal documentation; status is conveyed through title,
 *     description and field content.
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

import { createHash } from "crypto";
import { z } from "zod";
import type {
  RESTPatchAPIChannelMessageJSONBody,
} from "discord-api-types/v10";
import { logger } from "./logger";
import { SITE_URL, DEFAULT_TIMEZONE } from "./server-constants";
import { setDiscordQueueSize, incDiscordDropped, incDiscordSendFailure, incAlertFallback } from "./metrics";

// Schema version for Discord notification payloads.
// Bump on breaking changes to the embed structure or envelope contract.
// Embedded into every outbound payload (footer suffix) and enforced by Zod.
export const DISCORD_PAYLOAD_VERSION = 1;
const PAYLOAD_VERSION_TAG = `· v${DISCORD_PAYLOAD_VERSION}`;

// SHA-256 digest of dedup keys to avoid leaking PII (emails, ids) in logs.
function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex").slice(0, 12);
}

// ─── Brand identity ──────────────────────────────────────────────────────────

const EXENTAX_NEON = 0x00E510;
const EXENTAX_USERNAME = "Exentax";
// Always point at the public production URL so the avatar resolves even from
// dev / preview environments where SITE_URL might be localhost (Discord can
// only fetch publicly reachable HTTPS images).
const EXENTAX_AVATAR_URL = "https://exentax.com/ex-icon-green.png";

// ─── Channel routing (bot REST API — no webhooks) ───────────────────────────
//
// SECURITY: Discord NEVER carries a `manage_token`. The token is the secret
// that authorises the CLIENT to self-manage their booking via the public
// `/booking/:id?token=…` URL. Posting it to Discord (even to a private
// channel) widens the blast radius if a member, screenshot or log is leaked.
// All admin actions are addressed by the public-safe `bookingId` and routed
// through the in-channel buttons / slash commands. There is no `clientLink()`
// helper anymore — if a future feature needs to send the client a magic
// link, it MUST do so via email (`sendBookingConfirmation`, etc.), not via
// Discord. The regression test in `tests/discord-no-token-leak.test.ts`
// asserts that no Discord payload ever contains `token=` or `manage_token`.

type Channel = "registros" | "calculadora" | "actividad" | "agenda" | "consentimientos" | "errores" | "auditoria";

const CHANNEL_ENV: Record<Channel, string> = {
  registros:       "DISCORD_CHANNEL_REGISTROS",
  calculadora:     "DISCORD_CHANNEL_CALCULADORA",
  actividad:       "DISCORD_CHANNEL_ACTIVIDAD",
  agenda:          "DISCORD_CHANNEL_AGENDA",
  consentimientos: "DISCORD_CHANNEL_CONSENTIMIENTOS",
  errores:         "DISCORD_CHANNEL_ERRORES",
  // #sistema-auditoria — every action triggered by the Discord agenda bot
  // (slash command or button) is echoed here for traceability.
  auditoria:       "DISCORD_CHANNEL_AUDITORIA",
};

const DISCORD_API_BASE = "https://discord.com/api/v10";

function getChannelId(channel: Channel): string | undefined {
  const id = process.env[CHANNEL_ENV[channel]];
  if (id) return id.trim() || undefined;
  // Errors fall back to the leads/registros channel so a missing #errores
  // configuration never silently swallows alerts.
  if (channel === "errores") {
    const fallback = process.env[CHANNEL_ENV.registros];
    return fallback ? fallback.trim() || undefined : undefined;
  }
  return undefined;
}

function channelMessagesUrl(channelId: string): string {
  return `${DISCORD_API_BASE}/channels/${channelId}/messages`;
}

function channelMessageUrl(channelId: string, messageId: string): string {
  return `${DISCORD_API_BASE}/channels/${channelId}/messages/${messageId}`;
}

function getBotToken(): string | undefined {
  const t = process.env.DISCORD_BOT_TOKEN;
  return t ? t.trim() || undefined : undefined;
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
  SEO_INDEXING:        "seo_indexing",
  ADMIN_ACTION:        "admin_action",
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export type Criticality = "info" | "business" | "warning" | "error";

const CRITICALITY_LABEL: Record<Criticality, string> = {
  info:     "Info",
  business: "Business",
  warning:  "Warning",
  error:    "Error",
};

// Centralized, neutral field labels for Discord embeds (English — the
// canonical neutral choice for technical bot content, matching the
// language used by Discord, Sentry, GitHub, etc.). Single source of truth
// across all notify* wrappers below.
const LABELS = {
  // Envelope metadata (always shown first)
  TIPO:        "Type",
  CRITICIDAD:  "Severity",
  ORIGEN:      "Origin",
  RUTA:        "Route",
  IDIOMA:      "Language",
  FUENTE:      "Source",
  USUARIO:     "User",
  IP:          "IP",
  REGISTRADO:  "Logged at",
  AVISO:       "Notice",
  // Booking / lead common fields
  ESTADO:      "Status",
  FECHA:       "Date",
  HORARIO:     "Time",
  ZONA_HORARIA:"Timezone",
  TZ_CLIENTE:  "Client TZ",
  NOMBRE:      "Name",
  EMAIL:       "Email",
  TELEFONO:    "Phone",
  ACTIVIDAD:   "Activity",
  PRIVACIDAD:  "Privacy",
  MARKETING:   "Marketing",
} as const;

const BOOL_YES = "Yes";
const BOOL_NO  = "No";

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
  seo_indexing:        "errores",
  admin_action:        "auditoria",
};

// ─── Color policy ────────────────────────────────────────────────────────────
//
// EVERY embed sent to Discord uses exclusively the Exentax neon green
// (`EXENTAX_NEON = 0x00E510`). The previous multi-colour palette
// (RED/ORANGE/YELLOW/BLUE/PURPLE/TEAL/GREY/RED_INTENSE) and the
// `CRITICALITY_COLOR` mapping have been removed. Severity / criticality is
// now communicated exclusively through the title prefix (icon + label)
// applied in `notifyEvent`, never through colour. The override is enforced
// in `send()` so callers cannot accidentally re-introduce a non-neon color.

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

interface EmbedFooter { text: string; icon_url?: string }

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: EmbedField[];
  footer?: EmbedFooter;
  timestamp: string;
}

interface DiscordButtonComponent {
  type: 2;
  style: number;
  label?: string;
  emoji?: { name?: string; id?: string; animated?: boolean };
  custom_id?: string;
  url?: string;
  disabled?: boolean;
}

interface DiscordSelectOption {
  label: string;
  value: string;
  description?: string;
  default?: boolean;
}

interface DiscordSelectMenuComponent {
  type: 3;
  custom_id: string;
  options: DiscordSelectOption[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  disabled?: boolean;
}

type DiscordRowChild = DiscordButtonComponent | DiscordSelectMenuComponent;

interface DiscordActionRow {
  type: 1;
  components: DiscordRowChild[];
}

interface DiscordPayload {
  // Bot REST `POST /channels/{id}/messages` payload. The bot identity
  // (username + avatar) is fixed by the bot configuration in the Discord
  // developer portal, so we no longer pass `username` / `avatar_url`.
  embeds: DiscordEmbed[];
  // Optional Discord message components (action rows with buttons). Only
  // attached to the LAST message of a partitioned series so the buttons
  // appear right under the most recent embed and there is exactly one
  // canonical button group per logical event.
  components?: DiscordActionRow[];
}

const DISCORD_FIELD_LIMIT = 25;
const DISCORD_FIELD_NAME_MAX = 256;
const DISCORD_FIELD_VALUE_MAX = 1024;
const DISCORD_DESC_MAX = 4096;
const DISCORD_FOOTER_MAX = 2048;
const DISCORD_TITLE_MAX = 256;
// Discord enforces a 6000-char total per embed (title + description + every
// field name + every field value + footer.text). We keep a small safety
// margin so the partitioner never builds a payload Discord would reject.
const DISCORD_EMBED_TOTAL_MAX = 6000;
const EMBED_TOTAL_SAFETY = 200;

// Zod schema for the outbound Discord payload. Validated right before send
// to catch contract regressions early (missing fields, oversized values, etc).
const discordEmbedFieldSchema = z.object({
  name: z.string().min(1).max(DISCORD_FIELD_NAME_MAX),
  value: z.string().min(1).max(DISCORD_FIELD_VALUE_MAX),
  inline: z.boolean().optional(),
});
const discordEmbedSchema = z.object({
  title: z.string().min(1).max(256),
  description: z.string().max(DISCORD_DESC_MAX).optional(),
  color: z.number().int().nonnegative().optional(),
  fields: z.array(discordEmbedFieldSchema).max(DISCORD_FIELD_LIMIT),
  footer: z.object({
    // Footer text is now a simple timestamp (yyyy-mm-dd HH:MM Europe/Madrid).
    // Payload schema versioning lives implicitly in code (DISCORD_PAYLOAD_VERSION
    // constant) — no longer required in the visible footer text.
    text: z.string().min(1).max(DISCORD_FOOTER_MAX),
    icon_url: z.string().url().optional(),
  }).optional(),
  timestamp: z.string().min(1),
});
const discordPayloadSchema = z.object({
  embeds: z.array(discordEmbedSchema).min(1).max(10),
  // Components are validated structurally only — Discord's component tree
  // is permissive (multiple types, nested versions) so we trust the
  // builders (`bookingActionRow`) to produce a valid shape and just
  // bound the row count to Discord's hard limit of 5 per message.
  // Components: each entry must be an action row (type=1) with a `components` array.
  // Stricter than the previous z.any() while still permissive enough to accept
  // every shape produced by `bookingActionRows` (buttons + string select menu).
  components: z.array(
    z.object({
      type: z.literal(1),
      components: z.array(z.object({
        type: z.number().int(),
      }).passthrough()).min(1),
    }).passthrough(),
  ).max(5).optional(),
});

// ─── Partitioning (no truncation) ────────────────────────────────────────────
// In place of the previous "clamp & drop" approach, long content is split into
// ordered parts so every byte of the report reaches Discord. We split at three
// levels:
//   1. Field value > 1024 chars  → multiple "Name (n/N)" fields
//   2. Description > 4096 chars  → multiple description chunks across parts
//   3. > 25 fields or > 6000 char total per embed → multiple "Parte n/N" embeds
// Splits prefer paragraph / line / sentence boundaries to preserve readability.

function chunkText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const out: string[] = [];
  let rest = text;
  while (rest.length > maxLen) {
    const window = rest.slice(0, maxLen);
    let cutAt = -1;
    const minCut = Math.floor(maxLen * 0.4);
    const paraIdx = window.lastIndexOf("\n\n");
    if (paraIdx >= minCut) cutAt = paraIdx + 2;
    else {
      const nlIdx = window.lastIndexOf("\n");
      if (nlIdx >= minCut) cutAt = nlIdx + 1;
      else {
        const sentIdx = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
        if (sentIdx >= minCut) cutAt = sentIdx + 2;
        else {
          const spIdx = window.lastIndexOf(" ");
          cutAt = spIdx >= minCut ? spIdx + 1 : maxLen;
        }
      }
    }
    out.push(rest.slice(0, cutAt).trimEnd());
    rest = rest.slice(cutAt);
  }
  if (rest.length > 0) out.push(rest);
  return out;
}

function splitFieldValue(f: EmbedField): EmbedField[] {
  // Account for closing fences in code blocks: keep splitting safe even when
  // the value ends with backticks (no special closing logic — Discord renders
  // the partial fence as plain text, which is acceptable for very long stacks).
  const valueCap = DISCORD_FIELD_VALUE_MAX - 16; // leave room for "(99/99)" name suffix accounting
  if (f.value.length <= DISCORD_FIELD_VALUE_MAX && f.name.length <= DISCORD_FIELD_NAME_MAX) {
    return [f];
  }
  const baseName = f.name.length > DISCORD_FIELD_NAME_MAX - 12
    ? f.name.slice(0, DISCORD_FIELD_NAME_MAX - 12)
    : f.name;
  if (f.value.length <= DISCORD_FIELD_VALUE_MAX) {
    return [{ name: baseName, value: f.value, inline: f.inline }];
  }
  const chunks = chunkText(f.value, valueCap);
  const total = chunks.length;
  return chunks.map((c, i) => ({
    name: `${baseName} (${i + 1}/${total})`,
    value: c,
    inline: f.inline,
  }));
}

function fieldSize(f: EmbedField): number {
  return f.name.length + f.value.length;
}

interface PartitionInput {
  baseTitle: string;
  description?: string;
  color: number;
  footer: EmbedFooter;
  headerFields: EmbedField[];   // repeated on every part
  bodyFields: EmbedField[];     // distributed across parts (already split)
  trailerFields: EmbedField[];  // appended only to the last part
  timestamp: string;
}

function partitionEmbeds(input: PartitionInput): DiscordEmbed[] {
  const { baseTitle, description, color, footer, headerFields, bodyFields, trailerFields, timestamp } = input;

  // Description partitioning (only triggers when very long; rare in our flows).
  const descChunks = description && description.length > 0
    ? chunkText(description, DISCORD_DESC_MAX - 32)
    : [];

  const headerSize = headerFields.reduce((a, f) => a + fieldSize(f), 0);
  const trailerSize = trailerFields.reduce((a, f) => a + fieldSize(f), 0);
  const footerSize = footer.text.length;
  // Title length includes worst-case " · Parte 99/99" suffix (~17 chars).
  const titleReserve = Math.min(DISCORD_TITLE_MAX, baseTitle.length + 20);
  const headerFieldCount = headerFields.length;
  const trailerFieldCount = trailerFields.length;

  // Group bodyFields into chunks that fit alongside header (always) and
  // trailer (only on last). We reserve trailer room on every chunk so the
  // last chunk is guaranteed to fit its trailer without having to spill.
  const baseReserve = titleReserve + footerSize + headerSize + trailerSize + EMBED_TOTAL_SAFETY;
  const bodyBudget = DISCORD_EMBED_TOTAL_MAX - baseReserve;
  const fieldsBudget = DISCORD_FIELD_LIMIT - headerFieldCount - trailerFieldCount;

  const bodyChunks: EmbedField[][] = [];
  let current: EmbedField[] = [];
  let currentSize = 0;
  for (const f of bodyFields) {
    const fs = fieldSize(f);
    const fits = current.length < Math.max(1, fieldsBudget) && (currentSize + fs) <= Math.max(fs, bodyBudget);
    if (!fits && current.length > 0) {
      bodyChunks.push(current);
      current = [];
      currentSize = 0;
    }
    current.push(f);
    currentSize += fs;
  }
  if (current.length > 0) bodyChunks.push(current);
  if (bodyChunks.length === 0) bodyChunks.push([]);

  // The final number of parts is whatever level needs the most.
  const total = Math.max(bodyChunks.length, descChunks.length || 1);
  while (bodyChunks.length < total) bodyChunks.push([]);

  const embeds: DiscordEmbed[] = [];
  for (let i = 0; i < total; i++) {
    const isLast = i === total - 1;
    const partSuffix = total > 1 ? ` · Parte ${i + 1}/${total}` : "";
    const titleRaw = baseTitle + partSuffix;
    const title = titleRaw.length > DISCORD_TITLE_MAX
      ? titleRaw.slice(0, DISCORD_TITLE_MAX)
      : titleRaw;

    const fields: EmbedField[] = [];
    for (const f of headerFields) fields.push(f);
    for (const f of bodyChunks[i]) fields.push(f);
    if (isLast) for (const f of trailerFields) fields.push(f);

    // Hard cap to 25 just in case our budget math underestimated something
    // (degraded but still safe — never exceeds Discord limits).
    const safeFields = fields.length > DISCORD_FIELD_LIMIT
      ? fields.slice(0, DISCORD_FIELD_LIMIT)
      : fields;

    const embed: DiscordEmbed = {
      title,
      color,
      fields: safeFields,
      footer,
      timestamp,
    };
    if (descChunks.length > 0) {
      const desc = i < descChunks.length ? descChunks[i] : undefined;
      if (desc) embed.description = desc;
    } else if (i === 0 && description) {
      embed.description = description;
    }
    embeds.push(embed);
  }
  return embeds;
}

// ─── Queue system ────────────────────────────────────────────────────────────
//
// Outbound payloads are persisted to the `discord_outbound_queue` Postgres
// table before any send attempt, so a process restart (deploy, crash,
// autoscaling event) cannot silently drop admin notifications. Items are
// claimed by a single worker per process using SELECT … FOR UPDATE SKIP
// LOCKED — identical semantics to `email_retry_queue` — so multiple
// instances cannot double-send the same row, and a worker that crashes
// mid-send releases the row after `STALE_CLAIM_MS` for another worker
// (or the next restart of this one) to retry.
//
// In environments where a Postgres connection is not available (unit tests
// that import discord.ts directly without DATABASE_URL) the persistence
// layer disables itself on first failure and the queue degrades to the
// pre-existing in-memory FIFO. The fallback log line is emitted ONLY when
// a row was acceptable for persistence (i.e. DB is available) but the
// insert / update itself failed.

const QUEUE_MAX = 80;
const DRAIN_INTERVAL_MS = 1_500;
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 8_000;
// A claim older than this is treated as abandoned (worker crashed after
// claiming but before the fetch completed) and becomes re-claimable. Must
// be safely larger than `FETCH_TIMEOUT_MS + worst-case retry backoff` so
// a slow Discord API call is never yanked out from under an in-flight
// handler. 5 minutes is conservative; raise if Discord rate-limit retries
// ever push beyond it.
const STALE_CLAIM_MS = 5 * 60_000;
const CLAIM_BATCH_SIZE = 8;

interface QueueItem { channelId: string; payload: DiscordPayload; attempt: number }

// In-memory mirror used as fallback when persistence is disabled (tests),
// and as the working set of currently-claimed rows when persistence is on.
const _memoryQueue: QueueItem[] = [];
let _drainTimer: NodeJS.Timeout | null = null;
// Cheap synchronous gauge — read by `/api/metrics`, scripts, and tests.
// Tracks pending+inflight items regardless of backend.
let _pendingCount = 0;
let _draining = false;
// Resolves to "db" or "memory" exactly once per process.
let _backendPromise: Promise<"db" | "memory"> | null = null;

type DiscordDbModule = typeof import("./db");
type DiscordSchemaModule = typeof import("../shared/schema");
let _dbCached: DiscordDbModule | null = null;
let _schemaCached: DiscordSchemaModule | null = null;

async function loadBackend(): Promise<"db" | "memory"> {
  // Skip persistence entirely when explicitly opted out (tests, scripts).
  if (process.env.DISCORD_QUEUE_BACKEND === "memory") return "memory";
  try {
    // `./db` throws synchronously at import time if DATABASE_URL is missing,
    // so dynamic import is the cheapest probe — no extra DB round-trip.
    _dbCached = await import("./db");
    _schemaCached = await import("../shared/schema");
    // Best-effort: rehydrate the gauge from the DB so /api/metrics reports
    // an accurate queue size even before the first drain tick after boot.
    try {
      const { sql } = await import("drizzle-orm");
      const r = await _dbCached.db.execute(
        sql`SELECT count(*)::int AS n FROM discord_outbound_queue WHERE attempts < max_attempts`,
      );
      const rows = (r as unknown as { rows: { n: number }[] }).rows ?? [];
      _pendingCount = rows[0]?.n ?? 0;
      try { setDiscordQueueSize(_pendingCount); } catch { /* noop */ }
      logger.info(`Discord queue: persistence enabled (${_pendingCount} pending row(s) recovered)`, "discord");
    } catch (err) {
      logger.warn(`Discord queue: rehydrate failed (table missing?): ${err instanceof Error ? err.message : String(err)}`, "discord");
    }
    return "db";
  } catch {
    logger.info("Discord queue: persistence disabled (no DATABASE_URL) — using in-memory FIFO", "discord");
    return "memory";
  }
}

function getBackend(): Promise<"db" | "memory"> {
  if (!_backendPromise) _backendPromise = loadBackend();
  return _backendPromise;
}

/**
 * Boot-time entrypoint. Probes the persistence backend, rehydrates the
 * gauge and starts the drain timer. Idempotent — safe to call from both
 * `server/index.ts` startup and the discord-bot route registration path.
 */
export async function startDiscordQueueWorker(): Promise<void> {
  await getBackend();
  ensureDrainTimer();
}

function ensureDrainTimer(): void {
  if (_drainTimer) return;
  _drainTimer = setInterval(() => { void drainTick(); }, DRAIN_INTERVAL_MS);
  _drainTimer.unref();
}

async function drainTick(): Promise<void> {
  if (_draining) return;
  _draining = true;
  try {
    const backend = await getBackend();
    if (backend === "db") {
      await drainDb();
    } else {
      await drainMemory();
    }
  } catch (err) {
    logger.warn(`Discord queue drain error: ${err instanceof Error ? err.message : String(err)}`, "discord");
  } finally {
    _draining = false;
  }
}

async function drainMemory(): Promise<void> {
  const item = _memoryQueue.shift();
  if (!item) return;
  // _pendingCount already accounts for in-memory items — leave it; we'll
  // decrement on success / fallback.
  await attemptSendOnce(item, /* persistedId */ null);
}

async function drainDb(): Promise<void> {
  const claimed = await claimDueRows();
  if (claimed.length === 0) return;
  // Process sequentially to preserve historical FIFO behaviour and avoid
  // bursting the Discord rate limit from a single host.
  for (const row of claimed) {
    let payload: DiscordPayload;
    try {
      payload = JSON.parse(row.payload) as DiscordPayload;
    } catch {
      logger.warn(`Discord queue: corrupt payload row ${row.id}, removing`, "discord");
      await deleteRow(row.id).catch(() => { /* swallow */ });
      decPending();
      continue;
    }
    const item: QueueItem = {
      channelId: row.channelId,
      payload,
      attempt: row.attempts ?? 0,
    };
    await attemptSendOnce(item, row.id);
  }
}

interface ClaimedRow {
  id: string;
  channelId: string;
  payload: string;
  attempts: number;
  maxAttempts: number;
}

async function claimDueRows(): Promise<ClaimedRow[]> {
  if (!_dbCached) return [];
  try {
    const { sql } = await import("drizzle-orm");
    const staleSeconds = Math.floor(STALE_CLAIM_MS / 1000);
    const result = await _dbCached.db.execute(sql`
      UPDATE discord_outbound_queue AS q
         SET claimed_at = to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
       WHERE q.id IN (
         SELECT id FROM discord_outbound_queue
          WHERE next_attempt_at <= to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            AND attempts < max_attempts
            AND (
              claimed_at IS NULL
              OR claimed_at < to_char((now() - (${staleSeconds} || ' seconds')::interval) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
            )
          ORDER BY next_attempt_at, fecha_creacion
          LIMIT ${CLAIM_BATCH_SIZE}
          FOR UPDATE SKIP LOCKED
       )
      RETURNING q.id,
                q.channel_id   AS "channelId",
                q.payload,
                q.attempts,
                q.max_attempts AS "maxAttempts"
    `);
    const rows = (result as unknown as { rows: ClaimedRow[] }).rows ?? [];
    return rows;
  } catch (err) {
    logger.warn(`Discord queue: claim failed: ${err instanceof Error ? err.message : String(err)}`, "discord");
    return [];
  }
}

async function deleteRow(id: string): Promise<void> {
  if (!_dbCached || !_schemaCached) return;
  const { eq } = await import("drizzle-orm");
  await _dbCached.db
    .delete(_schemaCached.discordOutboundQueue)
    .where(eq(_schemaCached.discordOutboundQueue.id, id));
}

async function rescheduleRow(id: string, attempts: number, backoffMs: number, error: string): Promise<void> {
  if (!_dbCached || !_schemaCached) return;
  const { eq } = await import("drizzle-orm");
  await _dbCached.db
    .update(_schemaCached.discordOutboundQueue)
    .set({
      attempts,
      lastError: error.slice(0, 500),
      nextAttemptAt: new Date(Date.now() + backoffMs).toISOString(),
      // Release the claim so the row becomes eligible again at next_attempt_at.
      claimedAt: null,
    })
    .where(eq(_schemaCached.discordOutboundQueue.id, id));
}

function backoffForAttempt(attempt: number): number {
  // Same schedule as the previous in-memory retries: 1.5s, 3s, 6s capped at 30s.
  return Math.min(DRAIN_INTERVAL_MS * 2 ** attempt, 30_000);
}

function decPending(): void {
  if (_pendingCount > 0) _pendingCount--;
  try { setDiscordQueueSize(_pendingCount); } catch { /* noop */ }
}

function incPending(): void {
  _pendingCount++;
  try { setDiscordQueueSize(_pendingCount); } catch { /* noop */ }
}

/**
 * Single send attempt. On retryable failure the row is rescheduled (DB) or
 * re-queued (memory). On terminal failure (non-retryable HTTP, exhausted
 * retries) the row is deleted and the operational fallback alert fires.
 * On success the row is deleted.
 */
async function attemptSendOnce(item: QueueItem, persistedId: string | null): Promise<void> {
  const token = getBotToken();
  if (!token) {
    logger.warn("Discord bot token missing — payload dropped", "discord");
    emitFallbackAlert(item, "DISCORD_BOT_TOKEN missing");
    if (persistedId) await deleteRow(persistedId).catch(() => { /* swallow */ });
    decPending();
    return;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(channelMessagesUrl(item.channelId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(item.payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (res.ok) {
      if (persistedId) await deleteRow(persistedId).catch(() => { /* swallow */ });
      decPending();
      return;
    }
    const body = await res.text().catch(() => "");
    const isRetryable = res.status === 429 || res.status >= 500;
    const nextAttempt = item.attempt + 1;
    if (isRetryable && nextAttempt < MAX_RETRIES) {
      const backoff = backoffForAttempt(item.attempt);
      logger.warn(`Discord HTTP ${res.status} — retry ${nextAttempt}/${MAX_RETRIES} in ${backoff}ms`, "discord");
      await scheduleRetry(item, persistedId, nextAttempt, backoff, `HTTP ${res.status}: ${body.slice(0, 200)}`);
      return;
    }
    logger.warn(`Discord bot HTTP ${res.status}: ${body.slice(0, 300)}`, "discord");
    emitFallbackAlert({ ...item, attempt: nextAttempt - 1 }, `HTTP ${res.status}: ${body.slice(0, 200)}`);
    if (persistedId) await deleteRow(persistedId).catch(() => { /* swallow */ });
    decPending();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const nextAttempt = item.attempt + 1;
    if (nextAttempt < MAX_RETRIES) {
      const backoff = backoffForAttempt(item.attempt);
      await scheduleRetry(item, persistedId, nextAttempt, backoff, msg);
      return;
    }
    logger.warn(`Discord send failed after ${MAX_RETRIES} retries: ${msg}`, "discord");
    emitFallbackAlert({ ...item, attempt: nextAttempt - 1 }, msg);
    if (persistedId) await deleteRow(persistedId).catch(() => { /* swallow */ });
    decPending();
  }
}

async function scheduleRetry(
  item: QueueItem, persistedId: string | null, nextAttempt: number, backoffMs: number, reason: string,
): Promise<void> {
  if (persistedId) {
    // DB-backed retry: bump attempts + push next_attempt_at into the future.
    // The row stays in the queue until success or exhaustion, so a restart
    // before the timer fires still picks it up.
    await rescheduleRow(persistedId, nextAttempt, backoffMs, reason).catch((err) => {
      logger.warn(`Discord queue: reschedule failed for ${persistedId}: ${err instanceof Error ? err.message : String(err)}`, "discord");
      // Persistence broken mid-flight — last-resort fallback so the alert
      // is not silently lost. The row may still be in the table with its
      // claim cleared on the next stale sweep.
      emitFallbackAlert({ ...item, attempt: nextAttempt - 1 }, `reschedule failed: ${err instanceof Error ? err.message : String(err)}`);
      decPending();
    });
    return;
  }
  // Memory-only fallback: re-queue after the backoff using a timer.
  setTimeout(() => {
    _memoryQueue.unshift({ ...item, attempt: nextAttempt });
    ensureDrainTimer();
  }, backoffMs).unref?.();
}

/**
 * Last-resort alert: Discord delivery is permanently broken for this message
 * OR persistence itself failed. We must not let the operational alert
 * disappear silently — emit a structured ALERT log line that infra-level
 * log alerting can route on. Title and event type are extracted from the
 * embed when available so the fallback retains the most actionable context,
 * never any PII fields.
 */
function emitFallbackAlert(item: QueueItem, reason: string): void {
  try { incDiscordSendFailure(); incAlertFallback(); } catch { /* noop */ }
  const embed = item.payload.embeds?.[0];
  const title = embed?.title?.slice(0, 200) ?? "discord-delivery-failed";
  const tipoField = embed?.fields?.find(f => f.name === "Tipo" || f.name === "Type");
  const eventType = tipoField?.value ?? "unknown";
  logger.alert(`Discord delivery failed: ${title}`, "discord-fallback", {
    eventType,
    reason: reason.slice(0, 300),
    attempts: item.attempt + 1,
  });
}

/**
 * Persist a new outbound payload. The synchronous part of this function
 * just bumps the gauge and starts the drain timer; the actual DB INSERT
 * (or memory push) happens in the background so the calling notify*
 * site stays fire-and-forget.
 */
function enqueueItem(item: QueueItem): void {
  // Optimistically reserve a slot in the gauge so /api/metrics shows back
  // pressure immediately. If persistence fails we still emit the fallback
  // alert and decrement.
  incPending();
  ensureDrainTimer();
  void persistAndQueue(item);
}

async function persistAndQueue(item: QueueItem): Promise<void> {
  const backend = await getBackend();
  if (backend === "memory") {
    if (_memoryQueue.length >= QUEUE_MAX) {
      _memoryQueue.shift();
      logger.warn("Discord queue full — oldest message dropped", "discord");
      try { incDiscordDropped(); } catch { /* metrics never break the path */ }
      decPending();
    }
    _memoryQueue.push(item);
    return;
  }
  try {
    if (!_dbCached || !_schemaCached) throw new Error("db not initialized");
    const { sql } = await import("drizzle-orm");
    // Bound the queue: if we're already at capacity, drop the OLDEST
    // unclaimed row. `discord_dropped_total` only counts genuine overflow
    // — restart loss is handled by persistence and never reaches this path.
    const sizeRes = await _dbCached.db.execute(
      sql`SELECT count(*)::int AS n FROM discord_outbound_queue WHERE attempts < max_attempts`,
    );
    const sizeRows = (sizeRes as unknown as { rows: { n: number }[] }).rows ?? [];
    const currentSize = sizeRows[0]?.n ?? 0;
    if (currentSize >= QUEUE_MAX) {
      const dropRes = await _dbCached.db.execute(sql`
        DELETE FROM discord_outbound_queue
         WHERE id = (
           SELECT id FROM discord_outbound_queue
            WHERE claimed_at IS NULL
            ORDER BY fecha_creacion ASC
            LIMIT 1
         )
        RETURNING id
      `);
      const dropped = (dropRes as unknown as { rows: { id: string }[] }).rows ?? [];
      if (dropped.length > 0) {
        logger.warn("Discord queue full — oldest persisted message dropped", "discord");
        try { incDiscordDropped(); } catch { /* noop */ }
        decPending();
      }
    }
    const { randomUUID } = await import("crypto");
    const row: import("../shared/schema").InsertDiscordOutboundJob = {
      id: randomUUID(),
      channelId: item.channelId,
      payload: JSON.stringify(item.payload),
      attempts: item.attempt,
      maxAttempts: MAX_RETRIES,
      lastError: null,
      nextAttemptAt: new Date().toISOString(),
      claimedAt: null,
    };
    await _dbCached.db.insert(_schemaCached.discordOutboundQueue).values(row);
  } catch (err) {
    // Persistence itself failed (DB outage, schema drift, full disk, …).
    // Per the queue contract this is the ONLY scenario in which we drop to
    // the fallback log line — the in-memory queue would otherwise also be
    // wiped by the same restart that motivated persistence in the first
    // place, so retrying in memory only would re-introduce the original
    // bug. Emit a structured alert so infra paging picks it up.
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`Discord queue: persist failed: ${msg}`, "discord");
    emitFallbackAlert(item, `persistence failed: ${msg.slice(0, 200)}`);
    decPending();
  }
}

export function getDiscordQueueSize(): number {
  return _pendingCount;
}

/**
 * Test-only: reset internal queue state and force a fresh backend probe.
 * Required by `tests/discord-queue-persistence.test.ts` which constructs
 * different DB scenarios within a single process.
 */
export function _resetDiscordQueueForTests(): void {
  _memoryQueue.length = 0;
  _pendingCount = 0;
  _backendPromise = null;
  _dbCached = null;
  _schemaCached = null;
  if (_drainTimer) { clearInterval(_drainTimer); _drainTimer = null; }
  try { setDiscordQueueSize(0); } catch { /* noop */ }
}

// ─── Core send ───────────────────────────────────────────────────────────────

function send(channel: Channel, embeds: DiscordEmbed[], components?: DiscordActionRow[]): void {
  const channelId = getChannelId(channel);
  if (!channelId) {
    // No channel ID configured for this channel. For low-priority/business
    // events that's expected ("silently dropped"); for critical errors we
    // still want an audit trail in the application log so an outage doesn't
    // hide behind a missing config.
    logger.debug(`Discord channel id missing for '${channel}' — event dropped`, "discord");
    if (channel === "errores") {
      try { incAlertFallback(); } catch { /* noop */ }
      const head = embeds[0];
      logger.alert(`Discord ERRORES channel unconfigured — alert not delivered`, "discord-fallback", {
        title: head?.title?.slice(0, 200),
      });
    }
    return;
  }
  if (embeds.length === 0) return;
  // Each part is sent as its own message so order is preserved by the FIFO
  // queue and so a failure on one part doesn't block the rest. Components
  // (button rows) are attached only to the LAST message — that way the
  // user sees exactly one set of action buttons right under the most
  // recent embed regardless of how many parts the report was split into.
  const lastIdx = embeds.length - 1;
  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i];
    // Brand policy: every embed must render in Exentax neon green. We force
    // the colour here regardless of any value the caller (or future code)
    // may have set, so the channel always reads as a single brand identity.
    embed.color = EXENTAX_NEON;
    const payload: DiscordPayload = {
      embeds: [embed],
      ...(i === lastIdx && components && components.length ? { components } : {}),
    };
    const parsed = discordPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      logger.warn(
        `Discord payload v${DISCORD_PAYLOAD_VERSION} failed schema validation for channel '${channel}': ${parsed.error.issues.slice(0, 3).map(i => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
        "discord",
      );
      continue;
    }
    enqueueItem({ channelId, payload, attempt: 0 });
  }
}

/**
 * Edit a previously-sent bot message in place.
 *
 * Used by the Discord agenda bot to update the original `#agenda` notification
 * after an admin clicks one of the action buttons (Confirmar / Cancelar /
 * No-show / Reprogramar / Email): we PATCH the message to record the new
 * status + the actor, and drop the components row so the action can't be
 * triggered twice.
 *
 * Failures are non-fatal — the audit log + audit channel echo already carry
 * the truth, and rate-limit / network errors must never break the calling
 * interaction. The `body` is forwarded verbatim and so should already conform
 * to Discord's message edit schema (`{ content?, embeds?, components? }`).
 */
export async function editChannelMessage(
  channelId: string, messageId: string, body: RESTPatchAPIChannelMessageJSONBody,
): Promise<void> {
  const token = getBotToken();
  if (!token) {
    logger.warn("editChannelMessage: bot token missing — skipped", "discord");
    return;
  }
  if (!channelId || !messageId) return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(channelMessageUrl(channelId, messageId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${token}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      logger.warn(`editChannelMessage HTTP ${res.status}: ${text.slice(0, 200)}`, "discord");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`editChannelMessage failed: ${msg}`, "discord");
  } finally {
    clearTimeout(timeout);
  }
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
  /** @deprecated Brand policy enforces EXENTAX_NEON for all embeds; this field is ignored. */
  color?: number;
  channel?: Channel;          // override; por defecto se deriva de `type`
  origin?: string | null;     // ej. "public/booking", "discord-bot/agenda"
  route?: string | null;      // ej. "/api/bookings/book"
  method?: string | null;     // GET / POST / ...
  language?: string | null;
  source?: string | null;     // referrer / utm / canal de origen
  user?: string | null;       // identificador del usuario (email)
  ip?: string | null;
  fields?: EmbedField[];      // campos específicos del evento (orden preservado)
  footer?: EmbedFooter;       // override del footer (por defecto: branded footer)
  dedupKey?: string | null;   // opcional: idempotencia por id de evento (TTL)
  // Optional Discord message components (action rows). Used by booking
  // notifications to attach the Confirmar/Reprogramar/Cancelar/No-show/
  // Email button row produced by `bookingActionRow`. Attached only to
  // the last message of a partitioned series — see `send()`.
  components?: DiscordActionRow[];
}

// ─── Idempotency (dedup TTL set) ─────────────────────────────────────────────
// Evita que reintentos del mismo evento (ej. doble click, retry de upstream)
// generen notificaciones duplicadas en Discord. Ventana acotada en memoria.
const DEDUP_TTL_MS = 5 * 60 * 1000;
const DEDUP_MAX = 500;
const _dedupSeen = new Map<string, number>();

function dedupSeenRecently(key: string): boolean {
  const now = Date.now();
  // Purga oportunista
  if (_dedupSeen.size > DEDUP_MAX) {
    for (const [k, ts] of _dedupSeen) {
      if (now - ts > DEDUP_TTL_MS) _dedupSeen.delete(k);
      if (_dedupSeen.size <= DEDUP_MAX / 2) break;
    }
  }
  const prev = _dedupSeen.get(key);
  if (prev != null && now - prev < DEDUP_TTL_MS) return true;
  _dedupSeen.set(key, now);
  return false;
}

// Severity is conveyed exclusively via a short ASCII tag in the title,
// since brand policy forces every embed to render in EXENTAX_NEON and
// also forbids any emoji/icon anywhere in notifications.
const CRITICALITY_PREFIX: Record<Criticality, string> = {
  info:     "[INFO]",
  business: "[INFO]",
  warning:  "[AVISO]",
  error:    "[ERROR]",
};

export function notifyEvent(ev: EventEnvelope): void {
  try {
    notifyEventUnsafe(ev);
  } catch (err) {
    // Webhook failure must never propagate to the caller — every notify* site
    // is fire-and-forget and a thrown error here would surface as an HTTP 500
    // (or worse, a double-fault inside the global error handler).
    logger.error(`Discord notify failed type=${ev.type} (non-fatal)`, "discord", err);
  }
}

function notifyEventUnsafe(ev: EventEnvelope): void {
  if (ev.dedupKey) {
    // Wrappers are responsible for namespacing the dedup key (e.g. include
    // the event type as a prefix) so we use it verbatim here.
    if (dedupSeenRecently(ev.dedupKey)) {
      // Hash the key before logging to avoid leaking PII (emails / ids).
      logger.debug(`Discord event deduped type=${ev.type} keyHash=${hashKey(ev.dedupKey)}`, "discord");
      return;
    }
  }
  const channel = ev.channel || TYPE_TO_CHANNEL[ev.type];

  // Header fields — envelope metadata, repeated on every part of the report
  // so any single Discord message stays self-describing even when split.
  const headerFields: FieldList = [];
  pushAlways(headerFields, LABELS.TIPO, ev.type, true);
  pushAlways(headerFields, LABELS.CRITICIDAD, CRITICALITY_LABEL[ev.criticality], true);
  if (ev.origin) pushAlways(headerFields, LABELS.ORIGEN, ev.origin, true);
  if (ev.method || ev.route) {
    const r = `${ev.method ? ev.method + " " : ""}${ev.route || ""}`.trim();
    if (r) pushAlways(headerFields, LABELS.RUTA, `\`${r.slice(0, 200)}\``, true);
  }
  if (ev.language) pushAlways(headerFields, LABELS.IDIOMA, langLabel(ev.language), true);
  if (ev.source) pushAlways(headerFields, LABELS.FUENTE, ev.source.slice(0, 200), true);
  if (ev.user) pushAlways(headerFields, LABELS.USUARIO, ev.user, true);
  if (ev.ip) pushAlways(headerFields, LABELS.IP, ev.ip, true);

  // Body fields — caller-provided event data. Long values (>1024 chars) are
  // expanded into ordered "Name (n/N)" fields so nothing is dropped.
  const bodyFields: FieldList = [];
  if (ev.fields) {
    for (const f of ev.fields) {
      for (const split of splitFieldValue(f)) bodyFields.push(split);
    }
  }

  // Trailer — appended only to the final part so the timestamp marks the end.
  const trailerFields: FieldList = [];
  pushAlways(trailerFields, LABELS.REGISTRADO, madridTimestamp(), false);

  const footer = ev.footer ?? brandFooter(channel);
  if (footer.text.length > DISCORD_FOOTER_MAX) {
    footer.text = footer.text.slice(0, DISCORD_FOOTER_MAX);
  }

  const titlePrefix = CRITICALITY_PREFIX[ev.criticality];
  const titleWithPrefix = ev.title.startsWith(titlePrefix)
    ? ev.title
    : `${titlePrefix} ${ev.title}`;

  const embeds = partitionEmbeds({
    baseTitle: titleWithPrefix,
    description: ev.description,
    color: EXENTAX_NEON,
    footer,
    headerFields,
    bodyFields,
    trailerFields,
    timestamp: madridISO(),
  });

  send(channel, embeds, ev.components);
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

/** Pushes a field only when the value is meaningful. Empty/nullish values are silently dropped. */
function push(fields: FieldList, name: string, value: string | null | undefined, inline = true): void {
  if (value == null) return;
  const trimmed = String(value).trim();
  if (!trimmed) return;
  fields.push({ name, value: trimmed, inline });
}

function pushAlways(fields: FieldList, name: string, value: string, inline = true): void {
  fields.push({ name, value, inline });
}

function pushBool(fields: FieldList, name: string, value: boolean | null | undefined, inline = true): void {
  if (value == null) return;
  fields.push({ name, value: value ? BOOL_YES : BOOL_NO, inline });
}

/** Adds page/referrer/UTM fields. Centralised so every wrapper preserves the same order and trimming. */
function pushTracking(fields: FieldList, opts: {
  page?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}): void {
  push(fields, "Ruta", opts.page);
  if (opts.referrer != null) push(fields, "Referrer", String(opts.referrer).slice(0, 200));
  push(fields, "UTM Source", opts.utmSource);
  push(fields, "UTM Medium", opts.utmMedium);
  push(fields, "UTM Campaign", opts.utmCampaign ? String(opts.utmCampaign).slice(0, 100) : null);
  push(fields, "UTM Content", opts.utmContent ? String(opts.utmContent).slice(0, 100) : null);
}

// ─── Helpers comunes para los wrappers ───────────────────────────────────────

// Single, audit-friendly identifier shown in every booking notification.
// Operators copy this directly into the bot's slash commands (`/cita ver
// id:<bookingId>`) — no secrets, no URLs, no admin dashboard required.
function bookingIdField(bookingId: string): EmbedField {
  return { name: "Booking ID", value: `\`${bookingId}\``, inline: true };
}

function brandFooter(extra?: string): EmbedFooter {
  // Footer minimalista: solo timestamp Europe/Madrid en formato yyyy-mm-dd HH:MM.
  // El brand identifier llega vía username del bot ("Exentax") + avatar.
  // El parámetro `extra` se preserva para compatibilidad pero no se renderiza.
  void extra;
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  const tsPretty = `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
  return { text: tsPretty, icon_url: EXENTAX_AVATAR_URL };
}

// ═════════════════════════════════════════════════════════════════════════════
// EVENTOS DE NEGOCIO — wrappers tipados sobre notifyEvent
// ═════════════════════════════════════════════════════════════════════════════

export function notifyBookingCreated(opts: {
  bookingId: string;
  name: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  meetLink?: string | null;
  meetingType?: "google_meet" | "phone_call" | null;
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
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  page?: string | null;
  referrer?: string | null;
  clientTimezone?: string | null;
}): void {
  const fullName = `${opts.name}${opts.lastName ? " " + opts.lastName : ""}`.trim();
  const fields: FieldList = [];

  pushAlways(fields, "Estado", "Confirmada", true);
  pushAlways(fields, "Fecha", `**${opts.date}**`, true);
  pushAlways(fields, "Horario", `${opts.startTime} — ${opts.endTime}`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);
  push(fields, "TZ cliente", opts.clientTimezone);

  pushAlways(fields, "Nombre", fullName, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);

  const modality = opts.meetingType === "phone_call" ? "Llamada telefónica" : "Google Meet";
  pushAlways(fields, "Modalidad", modality, true);
  if (opts.meetingType !== "phone_call" && opts.meetLink) pushAlways(fields, "Google Meet", `[Unirse](${opts.meetLink})`, true);
  push(fields, "Actividad", opts.activity);
  if (opts.monthlyProfit != null && String(opts.monthlyProfit).trim()) {
    pushAlways(fields, "Beneficio mensual", String(opts.monthlyProfit), true);
  }
  pushBool(fields, "Clientes internacionales", opts.globalClients);
  pushBool(fields, "Operacion digital", opts.digitalOperation);

  pushTracking(fields, opts);

  if (opts.notes) pushAlways(fields, "Notas del cliente", opts.notes, false);
  if (opts.context) pushAlways(fields, "Contexto", opts.context, false);
  if (opts.shareNote) pushAlways(fields, "Nota adicional", opts.shareNote, false);

  pushBool(fields, "Privacidad", opts.privacyAccepted);
  pushBool(fields, "Marketing", opts.marketingAccepted);

  fields.push(bookingIdField(opts.bookingId));

  notifyEvent({
    type: EVENT_TYPES.BOOKING_CREATED,
    criticality: "business",
    title: `Nueva asesoria — ${opts.date} ${opts.startTime}`,
    description: `**${fullName}** ha reservado una asesoria fiscal.`,
    origin: "public/booking",
    route: "/api/bookings/book",
    method: "POST",
    language: opts.language || null,
    source: opts.source || null,
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: `booking_created:${opts.bookingId}`,
    // The Discord agenda bot owns this booking lifecycle: every notification
    // carries the standard 5-button row so the team can confirm / reschedule
    // / cancel / mark no-show / resend email without leaving the channel.
    components: bookingActionRows(opts.bookingId),
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
  meetingType?: "google_meet" | "phone_call" | null;
  language?: string | null;
  rescheduleCount?: number | null;
  ip?: string | null;
  source?: string | null;
  page?: string | null;
}): void {
  const sourceLabel = opts.source === "admin" ? "Admin" : "Cliente";
  const fields: FieldList = [];

  pushAlways(fields, "Estado", "Reagendada", true);
  pushAlways(fields, "Fecha anterior", opts.oldDate ? `~~${opts.oldDate}${opts.oldStartTime ? " " + opts.oldStartTime : ""}~~` : "—", true);
  pushAlways(fields, "Nueva fecha", `**${opts.newDate}**`, true);
  pushAlways(fields, "Nuevo horario", `**${opts.newStartTime} — ${opts.newEndTime}**`, true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);

  const reModality = opts.meetingType === "phone_call" ? "Llamada telefónica" : "Google Meet";
  pushAlways(fields, "Modalidad", reModality, true);
  if (opts.meetingType !== "phone_call" && opts.newMeetLink) pushAlways(fields, "Google Meet", `[Unirse](${opts.newMeetLink})`, true);
  pushAlways(fields, "Reagendamientos", String(opts.rescheduleCount ?? 1), true);
  push(fields, "Ruta", opts.page);

  fields.push(bookingIdField(opts.bookingId));

  notifyEvent({
    type: EVENT_TYPES.BOOKING_RESCHEDULED,
    criticality: "business",
    title: `Asesoria reagendada — ${opts.newDate} ${opts.newStartTime}`,
    description: `**${opts.name}** ha cambiado la fecha de su asesoria. Origen: **${sourceLabel}**.`,
    origin: opts.source === "admin" ? "discord-bot/agenda" : "public/booking",
    route: opts.source === "admin"
      ? `discord:/cita reagendar:${opts.bookingId}`
      : `/api/booking/${opts.bookingId}/reschedule`,
    method: "POST",
    language: opts.language || null,
    source: sourceLabel,
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: `booking_rescheduled:${opts.bookingId}:${opts.newDate}:${opts.newStartTime}`,
    components: bookingActionRows(opts.bookingId),
  });
}

export function notifyBookingCancelled(opts: {
  bookingId: string;
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
  page?: string | null;
  meetingType?: "google_meet" | "phone_call" | null;
}): void {
  const sourceLabel = opts.source === "admin" ? "Admin" : "Cliente";
  const fields: FieldList = [];

  pushAlways(fields, "Estado", "Cancelada", true);
  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);

  const cancelModality = opts.meetingType === "phone_call" ? "Llamada telefónica" : "Google Meet";
  pushAlways(fields, "Modalidad", cancelModality, true);

  if (opts.reason) pushAlways(fields, "Motivo", opts.reason.slice(0, 400), false);
  push(fields, "Ruta", opts.page);
  fields.push(bookingIdField(opts.bookingId));

  notifyEvent({
    type: EVENT_TYPES.BOOKING_CANCELLED,
    criticality: "warning",
    title: `Asesoria cancelada — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** ha cancelado su asesoria. Origen: **${sourceLabel}**.`,
    origin: opts.source === "admin" ? "discord-bot/agenda" : "public/booking",
    route: opts.source === "admin"
      ? `discord:/cita cancelar:${opts.bookingId}`
      : `/api/booking/${opts.bookingId}/cancel`,
    method: "POST",
    language: opts.language || null,
    source: sourceLabel,
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: `booking_cancelled:${opts.bookingId}`,
  });
}

export function notifyNoShow(opts: {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  language?: string | null;
  meetLink?: string | null;
  meetingType?: "google_meet" | "phone_call" | null;
}): void {
  const fields: FieldList = [];

  pushAlways(fields, "Estado", "No-show", true);
  pushAlways(fields, "Fecha", opts.date || "—", true);
  pushAlways(fields, "Horario", opts.startTime ? `${opts.startTime}${opts.endTime ? " — " + opts.endTime : ""}` : "—", true);
  pushAlways(fields, "Zona horaria", DEFAULT_TIMEZONE, true);

  pushAlways(fields, "Cliente", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);

  const noShowModality = opts.meetingType === "phone_call" ? "Llamada telefónica" : "Google Meet";
  pushAlways(fields, "Modalidad", noShowModality, true);
  if (opts.meetingType !== "phone_call" && opts.meetLink) pushAlways(fields, "Google Meet", `[Enlace](${opts.meetLink})`, true);

  fields.push(bookingIdField(opts.bookingId));

  notifyEvent({
    type: EVENT_TYPES.BOOKING_NO_SHOW,
    criticality: "warning",
    title: `No-show — ${opts.date || "sin fecha"}`,
    description: `**${opts.name}** no se presento a la asesoria. Contactar para reagendar.`,
    origin: "discord-bot/agenda",
    route: `discord:/cita noshow:${opts.bookingId}`,
    method: "POST",
    language: opts.language || null,
    user: opts.email,
    fields,
    dedupKey: `booking_no_show:${opts.bookingId}`,
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
  page?: string | null;
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}): void {
  const fields: FieldList = [];

  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Pais", opts.country);
  push(fields, "Regimen fiscal", opts.regime);
  push(fields, "Actividad", opts.activity);

  if (opts.monthlyIncome != null) pushAlways(fields, "Ingresos mensuales", fmt(opts.monthlyIncome), true);
  if (opts.annualIncome != null) pushAlways(fields, "Ingresos anuales", fmt(opts.annualIncome), true);
  if (opts.localTax != null) pushAlways(fields, "Impuestos locales", fmt(opts.localTax), true);
  if (opts.llcTax != null) pushAlways(fields, "Impuestos LLC", fmt(opts.llcTax), true);
  pushAlways(fields, "Ahorro estimado", `**${fmt(opts.ahorro)}** / anual`, true);

  push(fields, "Nombre", opts.name);
  push(fields, "Telefono", opts.phone);

  pushTracking(fields, opts);

  pushBool(fields, "Privacidad", opts.privacyAccepted);
  pushBool(fields, "Marketing", opts.marketingAccepted);

  notifyEvent({
    type: EVENT_TYPES.LEAD_CALCULATOR,
    criticality: "business",
    title: `Calculadora — ${fmt(opts.ahorro)} ahorro`,
    description: opts.country
      ? `Nuevo calculo desde **${opts.country}**${opts.regime ? ` (${opts.regime})` : ""}.`
      : "Nuevo calculo de ahorro fiscal.",
    origin: "public/calculator",
    route: "/api/calculator-leads",
    method: "POST",
    language: opts.language || null,
    source: opts.source || (opts.referrer ? opts.referrer.slice(0, 200) : null),
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: opts.leadId ? `lead_calculator:${opts.leadId}` : null,
  });
}

export function notifyNewsletterSubscribe(opts: {
  email: string;
  source?: string | null;
  language?: string | null;
  ip?: string | null;
  privacyAccepted?: boolean;
  marketingAccepted?: boolean;
  page?: string | null;
  leadId?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
}): void {
  const fields: FieldList = [];

  pushAlways(fields, "Email", opts.email, true);
  if (opts.leadId) pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);

  pushTracking(fields, opts);

  pushBool(fields, "Privacidad", opts.privacyAccepted);
  pushBool(fields, "Marketing", opts.marketingAccepted);

  notifyEvent({
    type: EVENT_TYPES.LEAD_NEWSLETTER,
    criticality: "business",
    title: "Nueva suscripcion newsletter",
    description: `**${opts.email}** se ha suscrito a la newsletter.`,
    origin: "public/newsletter",
    route: "/api/newsletter/subscribe",
    method: "POST",
    language: opts.language || null,
    source: opts.source || "footer",
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: `lead_newsletter:${opts.email.toLowerCase()}`,
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
  page?: string | null;
}): void {
  const fields: FieldList = [];

  pushAlways(fields, "ID Lead", `\`${opts.leadId}\``, true);
  pushAlways(fields, "Nombre", opts.name, true);
  pushAlways(fields, "Email", opts.email, true);
  push(fields, "Telefono", opts.phone);
  push(fields, "Actividad", opts.activity);
  push(fields, "Ruta", opts.page);

  // Booking handling link only when we have a manage token (client portal access).
  // Admin-only links were removed per brand policy: Discord shows only the
  // client-facing booking handling URL.

  notifyEvent({
    type: EVENT_TYPES.LEAD_NEW,
    criticality: "business",
    title: `Nuevo lead — ${opts.source}`,
    description: `**${opts.name}** se ha registrado.`,
    origin: "public/lead",
    language: opts.language || null,
    source: opts.source,
    user: opts.email,
    ip: opts.ip || null,
    fields,
    dedupKey: `lead_new:${opts.leadId}`,
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

  pushTracking(fields, { utmSource: opts.utmSource, utmMedium: opts.utmMedium, utmCampaign: opts.utmCampaign, utmContent: opts.utmContent });

  if (opts.sessionId) pushAlways(fields, "Sesion", `\`${opts.sessionId.slice(0, 16)}\``, true);

  notifyEvent({
    type: EVENT_TYPES.USER_ACTIVITY,
    criticality: "info",
    title: `Visita — ${page}`,
    description: opts.isNew ? "Visitante nuevo." : "Visitante recurrente.",
    origin: "public/visitor",
    route: page,
    language: opts.language || null,
    source: opts.referrer ? opts.referrer.slice(0, 200) : null,
    ip: opts.ip,
    fields,
  });
}

export function notifyConsent(opts: {
  /**
   * Stable per-record identifier (e.g. `con_a1b2c3d4`). Returned by
   * `insertConsentLog` and re-used here so a Discord notification can be
   * traced back to a specific row in `consent_log` without operator guesswork
   * (mandatory for GDPR audit response). When omitted (legacy callers) a
   * placeholder `unknown` is shown — typecheck keeps this explicit.
   */
  consentId?: string | null;
  formType: string;
  email?: string | null;
  privacyAccepted?: boolean | null;
  marketingAccepted?: boolean | null;
  language?: string | null;
  source?: string | null;
  privacyVersion?: string | null;
  ip?: string | null;
  page?: string | null;
}): void {
  const isCookie = opts.formType.startsWith("cookies:");
  const typeLabel = isCookie ? opts.formType.replace("cookies:", "") : opts.formType;
  const fields: FieldList = [];

  // Consent ID first so audit responses can grep `con_…` across channels.
  pushAlways(fields, "Consent ID", `\`${opts.consentId || "unknown"}\``, true);
  pushAlways(fields, "Formulario", typeLabel, true);
  pushBool(fields, "Privacidad", opts.privacyAccepted ?? null);
  pushBool(fields, "Marketing", opts.marketingAccepted ?? null);
  push(fields, "Version politica", opts.privacyVersion);
  push(fields, "Ruta", opts.page);
  push(fields, "Email", opts.email);

  notifyEvent({
    type: EVENT_TYPES.CONSENT_LOGGED,
    criticality: "info",
    title: isCookie ? `Consentimiento cookies — ${typeLabel}` : `Consentimiento — ${typeLabel}`,
    description: `Registro de consentimiento (${typeLabel}).`,
    origin: isCookie ? "public/cookies" : `public/${typeLabel}`,
    language: opts.language || null,
    source: opts.source || null,
    user: opts.email || null,
    ip: opts.ip || null,
    fields,
    dedupKey: opts.consentId ? `consent:${opts.consentId}` : null,
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
    const entries = Object.entries(opts.details);
    if (entries.length > 0) {
      const text = entries.map(([k, v]) => `• \`${k}\`: ${String(v)}`).join("\n");
      pushAlways(fields, "Campos invalidos", text, false);
    }
  }

  notifyEvent({
    type: EVENT_TYPES.VALIDATION_FAILED,
    criticality: "warning",
    title: `Validacion fallida — ${opts.method || "?"} ${opts.route || "?"}`,
    description: "La peticion fue rechazada por validacion de esquema.",
    origin: opts.origin || "api",
    route: opts.route || null,
    method: opts.method || null,
    language: opts.language || null,
    ip: opts.ip || null,
    fields,
    dedupKey: `validation_failed:${opts.method || "?"}:${opts.route || "?"}:${opts.ip || "?"}`,
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

  pushAlways(fields, "Mensaje de error", `\`\`\`${opts.message}\`\`\``, false);

  if (opts.stack && process.env.NODE_ENV !== "production") {
    pushAlways(fields, "Stack trace", `\`\`\`${opts.stack}\`\`\``, false);
  }

  notifyEvent({
    type: EVENT_TYPES.SYSTEM_ERROR,
    criticality: "error",
    title: "Error critico del servidor",
    description: `Se ha producido un error en **${opts.context}**.`,
    origin: opts.context,
    route: opts.path || null,
    method: opts.method || null,
    fields,
    dedupKey: `system_error:${opts.context}:${opts.code || "ERR"}:${(opts.message || "").slice(0, 80)}`,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// SEO INDEXING (sitemap ping, IndexNow, Google Indexing API)
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Notifica el resultado de cualquier operación de indexación SEO automática:
 *   - Ping de sitemap (IndexNow + Google Search Console).
 *   - Envío por artículo a IndexNow.
 *   - Envío por artículo a Google Indexing API.
 *
 * Todo el feedback operativo de estos flujos llega exclusivamente al
 * canal correspondiente vía bot de Discord.
 */
export function notifySeoIndexing(opts: {
  source: string;                    // ej. "sitemap-ping", "indexnow", "google-indexing"
  status: "ok" | "skipped" | "failed";
  title: string;                     // título corto del evento
  summary?: string | null;           // descripción opcional
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  dedupKey?: string | null;
}): void {
  const criticality: Criticality =
    opts.status === "failed" ? "error" : opts.status === "skipped" ? "warning" : "info";

  const fields: FieldList = [];
  pushAlways(fields, "Estado", opts.status.toUpperCase(), true);
  if (opts.fields) {
    for (const f of opts.fields) {
      const v = (f.value ?? "").toString().trim();
      if (!v) continue;
      fields.push({ name: f.name, value: v, inline: f.inline ?? true });
    }
  }

  notifyEvent({
    type: EVENT_TYPES.SEO_INDEXING,
    criticality,
    title: opts.title,
    description: opts.summary || undefined,
    origin: opts.source,
    fields,
    dedupKey: opts.dedupKey ?? null,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// Discord agenda BOT — audit channel + interactive components
// ═════════════════════════════════════════════════════════════════════════════
//
// `notifyAdminAction` mirrors every action triggered from the bot
// (`/agenda`, `/cita`, button click, modal submit) into the dedicated audit
// channel `#sistema-auditoria` so the team has a single timeline of who
// touched what — completely independent of the database audit log.
//
// `bookingActionRow` builds the standard 5-button row attached to every
// booking notification published in `#agenda`. Custom IDs are namespaced
// `agenda:<verb>:<bookingId>` and parsed back in `discord-bot-commands`.

export interface AdminActionField { name: string; value: string; inline?: boolean }

export function notifyAdminAction(opts: {
  actor: { id: string; name: string };
  action: string;
  title: string;
  fields?: AdminActionField[];
  description?: string;
}): void {
  const fields: FieldList = [];
  pushAlways(fields, "Operador", `${opts.actor.name} (\`${opts.actor.id}\`)`, true);
  pushAlways(fields, "Acción",   `\`${opts.action}\``, true);
  if (opts.fields) for (const f of opts.fields) push(fields, f.name, f.value, f.inline);
  notifyEvent({
    type: EVENT_TYPES.ADMIN_ACTION,
    criticality: "info",
    title: opts.title,
    description: opts.description,
    origin: "discord-bot",
    fields,
    user: opts.actor.name,
  });
}

/**
 * Action rows attached to every booking message published in #agenda.
 *
 * Two rows are returned (Discord caps components at 5 rows / 5 buttons-per-row):
 *
 *   Row 1 — buttons (state mutations):
 *     Confirmar · Reprogramar · Cancelar · No-show
 *
 *   Row 2 — string select menu (manual email dispatch):
 *     Confirmación · Recordatorio · No-show / reagenda · Seguimiento
 *
 * Brand policy: NO emojis/icons anywhere — buttons, options, embeds and
 * status fields use plain text only. Severity is conveyed by `[INFO]`,
 * `[AVISO]`, `[ERROR]` text tags in titles.
 *
 * The select-menu was introduced after a UX review: a single generic "Email"
 * button hard-coded to the no-show template was unsafe — operators could
 * trigger the wrong template by accident on an active booking. Now every
 * email send is an explicit, named choice surfaced inline on the booking
 * message itself, so `/cita email` is a power-user fallback rather than the
 * required path.
 *
 * Custom IDs are namespaced `agenda:<verb>:<bookingId>` and parsed back in
 * `discord-bot-commands`. The select menu uses `agenda:email_select:<id>`
 * with `values[0]` ∈ `confirmation | recordatorio | noshow | seguimiento`.
 */
export function bookingActionRows(bookingId: string): DiscordActionRow[] {
  const safeId = bookingId.slice(0, 60);
  // Buttons carry no emoji — Discord still colour-codes them via `style`
  // (3=success/green, 1=primary/blue, 4=danger/red, 2=secondary/grey),
  // which gives operators an unambiguous visual cue without any icon.
  const mkBtn = (verb: string, label: string, style: number): DiscordButtonComponent => ({
    type: 2,
    style,
    label,
    custom_id: `agenda:${verb}:${safeId}`,
  });
  const mkOpt = (label: string, value: string, description: string) => ({
    label,
    value,
    description,
  });
  return [
    {
      type: 1,
      components: [
        mkBtn("confirm",    "Confirmar",   3),
        mkBtn("reschedule", "Reprogramar", 1),
        mkBtn("cancel",     "Cancelar",    4),
        mkBtn("noshow",     "No-show",     2),
      ],
    },
    {
      type: 1,
      components: [{
        type: 3, // string select menu
        custom_id: `agenda:email_select:${safeId}`,
        placeholder: "Enviar email manual…",
        min_values: 1,
        max_values: 1,
        options: [
          mkOpt("Confirmación",         "confirmation",  "Reenviar confirmación con datos de la reunión"),
          mkOpt("Recordatorio",         "recordatorio",  "Aviso 24h antes con enlace de Meet"),
          mkOpt("No-show / reagenda",   "noshow",        "Cliente no apareció — invitar a reagendar"),
          mkOpt("Seguimiento",          "seguimiento",   "Mensaje post-cita para continuar la relación"),
        ],
      }],
    },
  ];
}

/**
 * Backwards-compatible single-row helper. Kept so older imports keep
 * compiling, but new call sites should prefer `bookingActionRows`.
 *
 * @deprecated Use `bookingActionRows(id)` (returns BOTH the buttons row
 * and the email select-menu row).
 */
export function bookingActionRow(bookingId: string): DiscordActionRow {
  return bookingActionRows(bookingId)[0];
}
