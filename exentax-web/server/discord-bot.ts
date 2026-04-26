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
import { logger } from "./logger";
import { dispatchSlashCommand, dispatchComponent, dispatchModalSubmit } from "./discord-bot-commands";

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
  data?: any;
  member?: InteractionMember;
  user?: { id: string; username?: string; global_name?: string | null };
  guild_id?: string;
  channel_id?: string;
  message?: { id: string; embeds?: any[]; components?: any[] };
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

export async function handleInteractionRequest(req: RequestWithRawBody, res: Response): Promise<void> {
  if (!isBotConfigured()) {
    res.status(503).json({ error: "discord_bot_not_configured" });
    return;
  }
  const signature = String(req.headers["x-signature-ed25519"] || "");
  const timestamp = String(req.headers["x-signature-timestamp"] || "");
  const rawBody = req.rawBody;
  if (!signature || !timestamp || !rawBody) {
    res.status(401).json({ error: "missing_signature" });
    return;
  }
  if (!verifyDiscordSignature(rawBody, signature, timestamp)) {
    res.status(401).json({ error: "bad_signature" });
    return;
  }
  const interaction = req.body as DiscordInteraction;
  if (!interaction || typeof interaction.type !== "number") {
    res.status(400).json({ error: "invalid_payload" });
    return;
  }

  // PING — Discord verification handshake. Must respond synchronously.
  if (interaction.type === INTERACTION_TYPE.PING) {
    res.status(200).json({ type: INTERACTION_RESPONSE_TYPE.PONG });
    return;
  }

  // Every non-PING type requires authorisation.
  const actor = resolveActor(interaction);
  if (!actor.isAuthorised) {
    logger.warn(`[discord-bot] Unauthorised interaction from ${actor.id} (${actor.name}) type=${interaction.type}`, "discord-bot");
    res.status(200).json({
      type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        flags: EPHEMERAL,
        content: "Error: No tienes permisos para usar el bot de agenda. Necesitas el rol de administrador.",
      },
    });
    return;
  }

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
    logger.error(`[discord-bot] Dispatch failed type=${interaction.type}`, "discord-bot", err);
    if (!res.headersSent) {
      res.status(200).json({
        type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { flags: EPHEMERAL, content: "Error: Error interno procesando la acción. Revisa los logs del servidor." },
      });
    }
  }
}

// ─── Outbound: edit a deferred response via the webhook follow-up API ────────
//
// When a command takes longer than 3 seconds we acknowledge with a deferred
// response (type 5/6) and then PATCH the original message via this URL. The
// interaction `token` stays valid for ~15 minutes which is plenty for any
// agenda action (Google Meet creation, email sending, etc.).
const DISCORD_API = "https://discord.com/api/v10";

export async function editOriginalResponse(token: string, body: Record<string, unknown>): Promise<void> {
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

export async function registerSlashCommands(): Promise<void> {
  if (!isBotConfigured()) {
    logger.info("[discord-bot] Bot not configured (missing env vars) — skipping command registration", "discord-bot");
    return;
  }
  const url = `${DISCORD_API}/applications/${DISCORD_APP_ID}/commands`;
  const manifest = buildSlashCommandManifest();
  try {
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

// ─── Wire-up: mount the HTTP route ──────────────────────────────────────────

export function registerDiscordBotRoutes(app: Express): void {
  app.post("/api/discord/interactions", (req, res) => {
    void handleInteractionRequest(req as RequestWithRawBody, res);
  });
}
