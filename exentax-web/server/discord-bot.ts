/**
 * Discord agenda bot — interactions endpoint, signature verification,
 * slash command registration and dispatch.
 *
 * Sole operations surface for the agenda. Only members carrying the role
 * `ADMIN_DISCORD_ROLE_ID` may invoke any command or button. Every authorised
 * action is persisted in `agenda_admin_actions` and echoed to Discord
 * (#sistema-auditoria channel + the originating message is updated in place
 * when applicable).
 *
 * Endpoint contract:
 *   POST /api/discord/interactions
 *     - Verifies the X-Signature-Ed25519 / X-Signature-Timestamp headers
 *       against `DISCORD_PUBLIC_KEY` using the raw request body.
 *     - Type 1 (PING)           → { type: 1 }
 *     - Type 2 (APP_COMMAND)    → handled by `handleSlashCommand`
 *     - Type 3 (MESSAGE_COMP)   → handled by `handleComponent`
 *     - Type 5 (MODAL_SUBMIT)   → handled by `handleModalSubmit`
 *
 * Security:
 *   - Signature verification fails closed (HTTP 401).
 *   - Role check fails closed (ephemeral error message; nothing executed).
 *   - Bot token is only used outbound (command registration, follow-up
 *     edits) — never returned to the caller.
 */
import crypto from "crypto";
import type { Request, Response, Express } from "express";
import type { RESTPatchAPIWebhookWithTokenMessageJSONBody } from "discord-api-types/v10";
import { logger } from "./logger";
import { dispatchSlashCommand, dispatchComponent, dispatchModalSubmit } from "./discord-bot-commands";
import {
  incDiscordSignatureFailure, incDiscordReplayRejected, incDiscordUnauthorised,
  incDiscordAuditWriteFailure,
  incDiscordInteractionType, recordDiscordCommand,
} from "./metrics";
import { logAdminAction } from "./storage";

// ─── Discord protocol constants ─────────────────────────────────────────────

export const INTERACTION_TYPE = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5,
} as const;

export const INTERACTION_RESPONSE_TYPE = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
  DEFERRED_UPDATE_MESSAGE: 6,
  UPDATE_MESSAGE: 7,
  MODAL: 9,
} as const;

// Message flag 1 << 6 (= 64) marks a response as "ephemeral" — only visible
// to the invoking user. We use this for every confirmation / error reply
// to keep the channel free of operational noise.
export const EPHEMERAL = 1 << 6;

// ─── Env / config ────────────────────────────────────────────────────────────

export const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY || "";
export const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
export const DISCORD_APP_ID = process.env.DISCORD_APP_ID || "";
export const ADMIN_DISCORD_ROLE_ID = process.env.ADMIN_DISCORD_ROLE_ID || "";

export function isBotConfigured(): boolean {
  return Boolean(DISCORD_PUBLIC_KEY && DISCORD_BOT_TOKEN && DISCORD_APP_ID && ADMIN_DISCORD_ROLE_ID);
}

// ─── Signature verification ──────────────────────────────────────────────────

// SPKI prefix that turns a raw 32-byte Ed25519 public key into a DER
// SubjectPublicKeyInfo so Node's `crypto.createPublicKey` can ingest it
// without an external dependency. Constant defined by RFC 8410 §4.
const ED25519_SPKI_HEADER = Buffer.from("302a300506032b6570032100", "hex");

let _cachedKey: crypto.KeyObject | null = null;
function getPublicKey(): crypto.KeyObject | null {
  if (_cachedKey) return _cachedKey;
  if (!DISCORD_PUBLIC_KEY || DISCORD_PUBLIC_KEY.length !== 64) return null;
  try {
    _cachedKey = crypto.createPublicKey({
      key: Buffer.concat([ED25519_SPKI_HEADER, Buffer.from(DISCORD_PUBLIC_KEY, "hex")]),
      format: "der",
      type: "spki",
    });
    return _cachedKey;
  } catch (err) {
    logger.error("Failed to materialise Discord public key", "discord-bot", err);
    return null;
  }
}

export function verifyDiscordSignature(rawBody: Buffer, signatureHex: string, timestamp: string): boolean {
  const key = getPublicKey();
  if (!key) return false;
  try {
    const sig = Buffer.from(signatureHex, "hex");
    if (sig.length !== 64) return false;
    const message = Buffer.concat([Buffer.from(timestamp, "utf8"), rawBody]);
    return crypto.verify(null, message, key, sig);
  } catch {
    return false;
  }
}

// Replay-protection window for inbound interactions. Discord's own
// signature spec proves the payload was minted by Discord but it does NOT
// itself constrain how stale the timestamp may be — without our own window
// a captured request could be replayed at any later time. 5 minutes is
// generous enough to survive clock skew + reasonable network latency
// (Discord docs themselves use ±5min in their official examples) and
// short enough to make replay capture effectively useless.
export const SIGNATURE_TIMESTAMP_WINDOW_SECONDS = 5 * 60;

export type SignatureCheck =
  | { ok: true }
  | { ok: false; reason: "missing" | "bad_format" | "bad_signature" | "replay_window" };

/**
 * Strict, structured signature + replay check for the inbound Discord
 * interaction request. The boolean variant above is preserved so existing
 * callers (and the E2E suite) keep their contract; the route layer uses
 * this richer variant to emit the right Prometheus counter and to return
 * a precise 401 reason without leaking which check failed in the public
 * response body.
 */
export function checkInboundSignature(
  rawBody: Buffer | undefined, signatureHex: string, timestampHeader: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): SignatureCheck {
  if (!rawBody || !signatureHex || !timestampHeader) {
    return { ok: false, reason: "missing" };
  }
  // The timestamp header is documented as a Unix epoch in seconds; reject
  // anything that is not a positive integer string before we even hash it.
  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts) || ts <= 0 || !/^\d+$/.test(timestampHeader)) {
    return { ok: false, reason: "bad_format" };
  }
  if (Math.abs(nowSeconds - ts) > SIGNATURE_TIMESTAMP_WINDOW_SECONDS) {
    return { ok: false, reason: "replay_window" };
  }
  if (!verifyDiscordSignature(rawBody, signatureHex, timestampHeader)) {
    return { ok: false, reason: "bad_signature" };
  }
  return { ok: true };
}

// ─── Discord API minimal shapes ──────────────────────────────────────────────
// Tipos minimalistas que cubren los campos que realmente leemos / escribimos
// (no instalamos `discord-api-types` para evitar peso del bundle).

export interface DiscordCommandOption {
  name: string;
  type?: number;
  value?: string | number | boolean;
  options?: DiscordCommandOption[];
  focused?: boolean;
}

export interface DiscordInteractionData {
  id?: string;
  name?: string;
  type?: number;
  custom_id?: string;
  component_type?: number;
  values?: string[];
  options?: DiscordCommandOption[];
  components?: DiscordMessageComponent[];
}

export interface DiscordEmbedRef {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
}

export interface DiscordMessageComponent {
  type: number;
  custom_id?: string;
  style?: number;
  label?: string;
  url?: string;
  disabled?: boolean;
  value?: string;
  components?: DiscordMessageComponent[];
}

// ─── Authorisation ───────────────────────────────────────────────────────────

export interface InteractionMember {
  user?: { id: string; username?: string; global_name?: string | null };
  roles?: string[];
}

export interface DiscordInteraction {
  id: string;
  application_id: string;
  type: number;
  token: string;
  data?: DiscordInteractionData;
  member?: InteractionMember;
  user?: { id: string; username?: string; global_name?: string | null };
  guild_id?: string;
  channel_id?: string;
  message?: { id: string; embeds?: DiscordEmbedRef[]; components?: DiscordMessageComponent[] };
}

export interface ActorContext {
  id: string;
  name: string;
  isAuthorised: boolean;
}

export function resolveActor(interaction: DiscordInteraction): ActorContext {
  const user = interaction.member?.user || interaction.user;
  const id = user?.id || "unknown";
  const name = user?.global_name || user?.username || id;
  const roles = interaction.member?.roles || [];
  const isAuthorised = ADMIN_DISCORD_ROLE_ID ? roles.includes(ADMIN_DISCORD_ROLE_ID) : false;
  return { id, name, isAuthorised };
}

// ─── HTTP entrypoint ─────────────────────────────────────────────────────────

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

/**
 * Derive a human-meaningful command label for metrics + audit. Slash
 * commands resolve to `<top> <subcommand>` (e.g. `agenda.bloquear`),
 * components and modals to `component:<custom_id_prefix>` so the per-
 * command counter stays bounded even when custom_ids carry booking IDs.
 */
function commandLabelFor(interaction: DiscordInteraction): string {
  if (interaction.type === INTERACTION_TYPE.APPLICATION_COMMAND) {
    const top = interaction.data?.name || "unknown";
    const subRaw = interaction.data?.options?.[0];
    const sub = subRaw && subRaw.type === 1 ? subRaw.name : null;
    return sub ? `${top}.${sub}` : top;
  }
  if (interaction.type === INTERACTION_TYPE.MESSAGE_COMPONENT) {
    const id = interaction.data?.custom_id || "unknown";
    return `component:${id.split(":")[0]}`;
  }
  if (interaction.type === INTERACTION_TYPE.MODAL_SUBMIT) {
    const id = interaction.data?.custom_id || "unknown";
    return `modal:${id.split(":")[0]}`;
  }
  return `type:${interaction.type}`;
}

/**
 * Generate a short, opaque correlation id we can include in operator-facing
 * error replies. The id is unique enough to grep server logs for the
 * matching `[discord-bot] Dispatch failed errorId=…` line; we deliberately
 * keep it short (8 hex chars) to remain copy-pastable from a Discord
 * ephemeral message on a phone.
 */
function newErrorId(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function handleInteractionRequest(req: RequestWithRawBody, res: Response): Promise<void> {
  if (!isBotConfigured()) {
    res.status(503).json({ error: "discord_bot_not_configured" });
    return;
  }
  const signature = String(req.headers["x-signature-ed25519"] || "");
  const timestamp = String(req.headers["x-signature-timestamp"] || "");
  const sigCheck = checkInboundSignature(req.rawBody, signature, timestamp);
  if (!sigCheck.ok) {
    if (sigCheck.reason === "replay_window") {
      incDiscordReplayRejected();
      // Treat replay rejections separately in the log so on-call can spot
      // them without grepping a generic "bad_signature" haystack.
      logger.warn(`[discord-bot] Rejected interaction outside replay window (ts=${timestamp})`, "discord-bot");
    } else {
      incDiscordSignatureFailure(sigCheck.reason);
    }
    // Public response stays opaque ("bad_signature") so a probing attacker
    // cannot tell which gate stopped them. Operators rely on logs + the
    // reason-tagged Prometheus counter to triage.
    res.status(401).json({ error: sigCheck.reason === "missing" ? "missing_signature" : "bad_signature" });
    return;
  }
  const interaction = req.body as DiscordInteraction;
  if (!interaction || typeof interaction.type !== "number") {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }
  incDiscordInteractionType(interaction.type);

  // PING — Discord verification handshake. Must respond synchronously.
  if (interaction.type === INTERACTION_TYPE.PING) {
    res.status(200).json({ type: INTERACTION_RESPONSE_TYPE.PONG });
    return;
  }

  // Every non-PING type requires authorisation.
  const actor = resolveActor(interaction);
  if (!actor.isAuthorised) {
    incDiscordUnauthorised();
    const label = commandLabelFor(interaction);
    logger.warn(`[discord-bot] Unauthorised interaction from ${actor.id} (${actor.name}) type=${interaction.type} label=${label}`, "discord-bot");
    // Persist an audit row so a spike of unauthorised attempts shows up in
    // the same dashboard as authorised actions. The action prefix
    // `unauthorized:` keeps it visually distinct in `agenda_admin_actions`
    // and easy to query (`WHERE action LIKE 'unauthorized:%'`).
    //
    // FIRE-AND-FORGET on purpose: Discord enforces a 3s reply deadline. A
    // slow Postgres or open circuit breaker must never delay the deny
    // response — the metric `discord_unauthorised_total` already incremented
    // synchronously above gives us the realtime signal, and the audit log
    // is best-effort enrichment. Errors are logged, not surfaced.
    void logAdminAction({
      actorDiscordId: actor.id,
      actorDiscordName: actor.name,
      action: `unauthorized:${label}`,
      payload: { type: interaction.type, guildId: interaction.guild_id || null, channelId: interaction.channel_id || null },
    }).catch((err) => {
      // Bump a metric in addition to the warn line so a sustained DB
      // outage producing audit gaps shows up in dashboards/alerts and
      // not just in log search.
      incDiscordAuditWriteFailure();
      logger.warn(`[discord-bot] Failed to persist unauthorized audit row: ${err instanceof Error ? err.message : String(err)}`, "discord-bot");
    });
    res.status(200).json({
      type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: EPHEMERAL,
        content: "Error: No tienes permisos para usar el bot de agenda. Necesitas el rol de administrador.",
      },
    });
    return;
  }

  const label = commandLabelFor(interaction);
  const t0 = Date.now();
  try {
    switch (interaction.type) {
      case INTERACTION_TYPE.APPLICATION_COMMAND:
        await dispatchSlashCommand(interaction, actor, res);
        return;
      case INTERACTION_TYPE.MESSAGE_COMPONENT:
        await dispatchComponent(interaction, actor, res);
        return;
      case INTERACTION_TYPE.MODAL_SUBMIT:
        await dispatchModalSubmit(interaction, actor, res);
        return;
      default:
        res.status(200).json({
          type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { flags: EPHEMERAL, content: "Tipo de interacción no soportado." },
        });
        return;
    }
  } catch (err) {
    // Stable correlation id so the operator can copy/paste it back into a
    // bug report or grep the server logs. We never expose stack traces or
    // exception messages to Discord — they may contain PII (booking emails)
    // or implementation details that aid reconnaissance.
    const errorId = newErrorId();
    logger.error(`[discord-bot] Dispatch failed errorId=${errorId} type=${interaction.type} label=${label} actor=${actor.id}`, "discord-bot", err);
    if (!res.headersSent) {
      res.status(200).json({
        type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: EPHEMERAL,
          content: `Error: Error interno procesando la acción. errorId=\`${errorId}\` — comparte este código con el equipo técnico para revisar los logs.`,
        },
      });
    }
  } finally {
    try { recordDiscordCommand(label, Date.now() - t0); } catch { /* best-effort */ }
  }
}

// ─── Outbound: edit a deferred response via the webhook follow-up API ────────
//
// When a command takes longer than 3 seconds we acknowledge with a deferred
// response (type 5/6) and then PATCH the original message via this URL. The
// interaction `token` stays valid for ~15 minutes which is plenty for any
// agenda action (Google Meet creation, email sending, etc.).
const DISCORD_API = "https://discord.com/api/v10";

export async function editOriginalResponse(token: string, body: RESTPatchAPIWebhookWithTokenMessageJSONBody): Promise<void> {
  const url = `${DISCORD_API}/webhooks/${DISCORD_APP_ID}/${token}/messages/@original`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      logger.warn(`[discord-bot] PATCH followup HTTP ${res.status}: ${text.slice(0, 200)}`, "discord-bot");
    }
  } catch (err) {
    logger.error("[discord-bot] Failed to PATCH original interaction response", "discord-bot", err);
  }
}

// ─── Slash command registration ──────────────────────────────────────────────
//
// Registered globally (no guild scope) on every cold start. Discord caches
// the manifest for ~1h on the client side, so deploys may need that long
// to propagate command name changes. We use "global" because the bot is
// only ever used in one guild and global registration is one HTTP call.

export function buildSlashCommandManifest() {
  const dateOption = { name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true };
  const timeOption = { name: "hora", description: "Hora (HH:MM, slot de 30min)", type: 3, required: true };
  return [
    {
      name: "ayuda",
      description: "Lista todos los comandos del bot de agenda Exentax",
    },
    {
      name: "agenda",
      description: "Consulta y gestión de la agenda de Exentax",
      options: [
        { type: 1, name: "hoy",    description: "Reservas de hoy" },
        { type: 1, name: "semana", description: "Reservas de los próximos 7 días" },
        {
          type: 1, name: "buscar", description: "Buscar reservas por ID, nombre o email",
          options: [{ name: "q", description: "Booking ID, nombre o email", type: 3, required: true }],
        },
        {
          type: 1, name: "libre", description: "Slots libres en un día",
          options: [{ name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true }],
        },
        {
          type: 1, name: "bloquear", description: "Bloquear un día",
          options: [
            { name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true },
            { name: "motivo", description: "Motivo (opcional)", type: 3, required: false },
          ],
        },
        {
          type: 1, name: "desbloquear", description: "Desbloquear un día",
          options: [{ name: "fecha", description: "Fecha (YYYY-MM-DD)", type: 3, required: true }],
        },
      ],
    },
    {
      name: "cita",
      description: "Acciones sobre una cita concreta",
      options: [
        {
          type: 1, name: "ver", description: "Ver detalle de una cita",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "confirmar", description: "Confirmar una cita pendiente",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "cancelar", description: "Cancelar una cita",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "noshow", description: "Marcar como no-show",
          options: [{ name: "id", description: "Booking ID", type: 3, required: true }],
        },
        {
          type: 1, name: "reprogramar", description: "Reprogramar a nueva fecha y hora",
          options: [
            { name: "id", description: "Booking ID", type: 3, required: true },
            dateOption,
            timeOption,
          ],
        },
        {
          type: 1, name: "email", description: "Enviar email manual al cliente",
          options: [
            { name: "id", description: "Booking ID", type: 3, required: true },
            {
              name: "tipo", description: "Tipo de email", type: 3, required: true,
              choices: [
                { name: "confirmación",       value: "confirmation" },
                { name: "recordatorio",       value: "recordatorio" },
                { name: "no-show / reagenda", value: "noshow" },
                { name: "seguimiento",        value: "seguimiento" },
              ],
            },
          ],
        },
        {
          type: 1, name: "nueva", description: "Crear una cita manualmente",
          options: [
            { name: "nombre", description: "Nombre del cliente", type: 3, required: true },
            { name: "email",  description: "Email del cliente",  type: 3, required: true },
            dateOption,
            timeOption,
            { name: "telefono", description: "Teléfono (opcional)", type: 3, required: false },
            { name: "notas",    description: "Notas internas",      type: 3, required: false },
            {
              name: "idioma", description: "Idioma del cliente (por defecto: es)",
              type: 3, required: false,
              choices: [
                { name: "Español",    value: "es" },
                { name: "English",    value: "en" },
                { name: "Français",   value: "fr" },
                { name: "Deutsch",    value: "de" },
                { name: "Português",  value: "pt" },
                { name: "Català",     value: "ca" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "newsletter",
      description: "Broadcast newsletter a suscriptores Exentax",
      options: [
        {
          type: 1, name: "enviar",
          description: "Enviar campaña a suscriptores activos (filtrable por idioma)",
          options: [
            { name: "asunto", description: "Subject del email (max 100 chars)", type: 3, required: true },
            { name: "html",   description: "URL HTTPS al HTML del email (incluir {{unsubscribe_url}})", type: 3, required: true },
            {
              name: "idioma", description: "Filtro idioma (por defecto: todos)",
              type: 3, required: false,
              choices: [
                { name: "Todos",     value: "all" },
                { name: "Español",   value: "es" },
                { name: "English",   value: "en" },
                { name: "Français",  value: "fr" },
                { name: "Deutsch",   value: "de" },
                { name: "Português", value: "pt" },
                { name: "Català",    value: "ca" },
              ],
            },
          ],
        },
        {
          type: 1, name: "status", description: "Estado de una campaña",
          options: [{ name: "id", description: "Campaign ID (CMP_…)", type: 3, required: true }],
        },
        {
          type: 1, name: "cancelar", description: "Cancelar una campaña en curso",
          options: [{ name: "id", description: "Campaign ID (CMP_…)", type: 3, required: true }],
        },
      ],
    },
  ];
}

/**
 * Compare the local manifest against what Discord currently has for the
 * application. Returns true when the live shape matches our manifest at
 * the (top-level command, subcommand, option name+type+required+choices)
 * level — i.e. anything Discord would actually surface to the user. We
 * intentionally do NOT compare cosmetic fields Discord normalises (id,
 * application_id, version, default_permission, name_localizations, etc.)
 * because those are server-assigned or undefined locally.
 */
function manifestEquivalent(local: ReturnType<typeof buildSlashCommandManifest>, live: unknown[]): boolean {
  type Opt = { type?: number; name: string; required?: boolean; choices?: Array<{ name: string; value: string | number }>; options?: Opt[] };
  type Cmd = { name: string; description?: string; options?: Opt[] };
  function normaliseOpt(o: Opt): unknown {
    return {
      type: o.type ?? null,
      name: o.name,
      required: o.required ?? false,
      choices: Array.isArray(o.choices)
        ? o.choices.map(c => ({ name: c.name, value: c.value })).sort((a, b) => String(a.value).localeCompare(String(b.value)))
        : null,
      options: Array.isArray(o.options) ? o.options.map(normaliseOpt) : null,
    };
  }
  function normaliseCmd(c: Cmd): unknown {
    return {
      name: c.name,
      description: c.description ?? "",
      options: Array.isArray(c.options) ? c.options.map(normaliseOpt) : null,
    };
  }
  const a = (local as Cmd[]).map(normaliseCmd).sort((x, y) => (x as { name: string }).name.localeCompare((y as { name: string }).name));
  const b = (live as Cmd[]).map(normaliseCmd).sort((x, y) => (x as { name: string }).name.localeCompare((y as { name: string }).name));
  return JSON.stringify(a) === JSON.stringify(b);
}

export async function registerSlashCommands(): Promise<void> {
  if (!isBotConfigured()) {
    logger.info("[discord-bot] Bot not configured (missing env vars) — skipping command registration", "discord-bot");
    return;
  }
  const url = `${DISCORD_API}/applications/${DISCORD_APP_ID}/commands`;
  const manifest = buildSlashCommandManifest();
  try {
    // Diff-before-PUT: Discord's PUT replaces the entire manifest atomically,
    // so an unconditional PUT on every cold start works correctly but bumps
    // each command's `version` field on the Discord side and consumes one
    // of the daily 200 global registration writes per application. Doing
    // a GET first lets us no-op when the live shape already matches — a
    // strict idempotency guarantee for ops scripts that may call this
    // helper repeatedly (CI, cold-restart loops, blue/green rollouts).
    let live: unknown[] | null = null;
    try {
      const liveRes = await fetch(url, {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      });
      if (liveRes.ok) {
        const body = await liveRes.json();
        if (Array.isArray(body)) live = body;
      } else {
        logger.warn(`[discord-bot] GET commands HTTP ${liveRes.status} — falling back to unconditional PUT`, "discord-bot");
      }
    } catch (err) {
      logger.warn(`[discord-bot] GET commands failed — falling back to unconditional PUT: ${err instanceof Error ? err.message : String(err)}`, "discord-bot");
    }
    if (live && manifestEquivalent(manifest, live)) {
      logger.info(`[discord-bot] Slash commands already up-to-date (${manifest.length} top-level) — no-op`, "discord-bot");
      return;
    }
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(manifest),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      logger.warn(`[discord-bot] Slash command registration HTTP ${res.status}: ${text.slice(0, 300)}`, "discord-bot");
      return;
    }
    logger.info(`[discord-bot] Registered ${manifest.length} top-level slash commands`, "discord-bot");
  } catch (err) {
    logger.error("[discord-bot] Slash command registration failed", "discord-bot", err);
  }
}

// ─── Outbound: Discord connectivity probe (used by /api/health/ready) ───────
//
// Calls GET /users/@me with the bot token. The endpoint is cheap, doesn't
// touch any guild and Discord rate-limits it generously per token, but we
// still cache the verdict for ~60s so a kubelet-style readiness probe
// doesn't hammer Discord every few seconds. The cache stores both the OK
// state and the most recent failure reason so the readiness JSON can
// surface something actionable instead of a generic 503.

interface DiscordPingResult { ok: boolean; message?: string; checkedAt: number }
let _pingCache: DiscordPingResult | null = null;
const PING_TTL_MS = 60_000;

export async function checkDiscordConnectivity(now: number = Date.now()): Promise<DiscordPingResult> {
  if (!isBotConfigured()) {
    return { ok: false, message: "bot not configured (missing env vars)", checkedAt: now };
  }
  if (_pingCache && now - _pingCache.checkedAt < PING_TTL_MS) {
    return _pingCache;
  }
  const url = `${DISCORD_API}/users/@me`;
  // 2.5s timeout — readiness probes need to be snappy; if Discord is
  // unreachable the probe should degrade quickly rather than block the
  // /api/health/ready response and trigger orchestrator timeouts.
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 2_500);
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      signal: ac.signal,
    });
    if (res.ok) {
      _pingCache = { ok: true, checkedAt: now };
    } else {
      _pingCache = { ok: false, message: `HTTP ${res.status}`, checkedAt: now };
    }
  } catch (err) {
    const msg = err instanceof Error ? (err.name === "AbortError" ? "timeout" : err.message) : String(err);
    _pingCache = { ok: false, message: msg, checkedAt: now };
  } finally {
    clearTimeout(timer);
  }
  return _pingCache;
}

/**
 * Test-only seam to clear the connectivity cache (used by readiness
 * unit tests). Production code never calls this — the TTL handles
 * staleness.
 */
export function _resetDiscordConnectivityCache(): void { _pingCache = null; }

// ─── Wire-up: mount the HTTP route ──────────────────────────────────────────

export function registerDiscordBotRoutes(app: Express): void {
  app.post("/api/discord/interactions", (req, res) => {
    void handleInteractionRequest(req as RequestWithRawBody, res);
  });
}
