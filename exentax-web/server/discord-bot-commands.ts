/**
 * Discord agenda bot — slash commands, button components and modal submits.
 *
 * Every action in this module:
 *   1. Reuses the SAME storage / Google Meet / email helpers as the legacy
 *      admin REST handlers so concurrency guarantees and side-effects stay
 *      identical (slot locking, reminder cancellation, Meet event cleanup,
 *      audit notifications via the Discord bot REST API).
 *   2. Persists an audit row in `agenda_admin_actions` (logAdminAction).
 *   3. Echoes the action to the audit channel via `notifyAdminAction`.
 *   4. Replies to the operator with an ephemeral confirmation embed and,
 *      when the interaction came from a booking message, updates that
 *      message's embed in place via the follow-up edit API.
 */
import type { Response } from "express";
import { z } from "zod";
import { logger } from "./logger";
import {
  ActorContext, DiscordInteraction, DiscordCommandOption,
  DiscordEmbedRef, DiscordMessageComponent,
  INTERACTION_RESPONSE_TYPE, EPHEMERAL,
  editOriginalResponse,
} from "./discord-bot";
import {
  getAgendaById, updateAgenda, isSlotBooked, getBlockedDay, insertBlockedDay,
  deleteBlockedDay, getAllBlockedDays, listAgendasFiltered, insertAgenda,
  hasExistingBooking, logAdminAction,
  SlotConflictError,
  generateId,
} from "./storage";
import {
  sendCancellationEmail, sendNoShowRescheduleEmail, sendBookingConfirmation,
  sendRescheduleConfirmation, sendReminderEmail, sendFollowupEmail,
} from "./email";
import { enqueueEmail, triggerEmailDrain } from "./email-retry-queue";
import { AGENDA_STATUSES, isCancelledStatus, SITE_URL, todayMadridISO } from "./server-constants";
import {
  generateTimeSlots, getEndTime, isWeekday,
  scheduleReminderEmail, cancelReminderTimer,
  withSlotLock, withBookingLock, ISO_DATE_RE, isValidISODate,
} from "./route-helpers";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "./google-meet";
import {
  notifyBookingCreated, notifyBookingRescheduled, notifyBookingCancelled,
  notifyNoShow, notifyAdminAction, bookingActionRows,
  editChannelMessage,
} from "./discord";
import type { InsertAgenda, Agenda } from "../shared/schema";
import crypto from "crypto";

// ─── Reply helpers ───────────────────────────────────────────────────────────

function replyEphemeral(res: Response, content: string, embeds?: DiscordEmbedRef[]): void {
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL, content, embeds },
  });
}

function deferEphemeral(res: Response): void {
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL },
  });
}

function deferUpdate(res: Response): void {
  res.status(200).json({ type: INTERACTION_RESPONSE_TYPE.DEFERRED_UPDATE_MESSAGE });
}

async function followupEphemeral(token: string, content: string, embeds?: DiscordEmbedRef[]): Promise<void> {
  await editOriginalResponse(token, { content, embeds: embeds || [], flags: EPHEMERAL });
}

// ─── Original message updater ────────────────────────────────────────────────
//
// When a button under a `#agenda` notification is clicked, we patch that
// originating message so the embed reflects the new booking status and
// records who performed the action. The buttons row is dropped from the
// patched message — the action is "spent" and further clicks would only
// duplicate work (the audit channel + DB still keep the full trail). Failures
// are non-fatal: the audit log + audit channel echo already carry the truth.
function statusLabel(action: string): string {
  switch (action) {
    case "cita.confirmar":   return "Confirmada";
    case "cita.cancelar":    return "Cancelada";
    case "cita.noshow":      return "No-show";
    case "cita.reprogramar": return "Reprogramada";
    case "cita.email.confirmation": return "Confirmación reenviada";
    case "cita.email.recordatorio": return "Recordatorio enviado";
    case "cita.email.noshow":       return "Email no-show enviado";
    case "cita.email.seguimiento":  return "Seguimiento enviado";
    default: return action;
  }
}

async function patchOriginatingMessage(
  interaction: DiscordInteraction, action: string, actor: ActorContext,
): Promise<void> {
  const channelId = interaction.channel_id;
  const messageId = interaction.message?.id;
  if (!channelId || !messageId) return; // not a button click — nothing to update
  const baseEmbeds = (interaction.message?.embeds || []) as DiscordEmbedRef[];
  const cloned = baseEmbeds.map(e => ({ ...e, fields: Array.isArray(e.fields) ? [...e.fields] : [] }));
  if (cloned.length === 0) {
    cloned.push({ title: "Reserva actualizada", color: 0x00E510, fields: [] });
  }
  const target = cloned[cloned.length - 1];
  const stamp = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid", hour12: false });
  const newField = {
    name: "Última acción",
    value: `${statusLabel(action)} · por **${actor.name}** \`${actor.id}\` · ${stamp}`,
    inline: false,
  };
  // Replace any prior "Última acción" so consecutive clicks don't pile up.
  target.fields = [
    ...target.fields.filter((f) => f?.name !== "Última acción"),
    newField,
  ];
  await editChannelMessage(channelId, messageId, { embeds: cloned, components: [] });
}

// ─── Option / id parsing ─────────────────────────────────────────────────────

function getSubcommand(data: { name?: string; options?: DiscordCommandOption[] } | undefined): { name: string; options: DiscordCommandOption[] } {
  const sub = data?.options?.[0];
  if (sub && sub.type === 1) return { name: sub.name, options: sub.options || [] };
  return { name: data?.name || "", options: data?.options || [] };
}

function getOpt(options: DiscordCommandOption[], name: string): string | undefined {
  const o = options?.find?.((x) => x.name === name);
  if (!o) return undefined;
  return o.value == null ? undefined : String(o.value);
}

const ID_RE = /^[A-Za-z0-9_\-]{1,100}$/;
function validBookingId(id: string | undefined): id is string {
  return !!id && ID_RE.test(id);
}

// ─── Embeds ──────────────────────────────────────────────────────────────────

const NEON = 0x00E510;

function bookingDetailEmbed(b: Agenda): DiscordEmbedRef {
  const isPhone = b.meetingType === "phone_call";
  const modality = isPhone ? "Llamada telefónica" : "Google Meet";
  return {
    color: NEON,
    title: `Cita ${b.id}`,
    description: `**${b.name || "—"}** · ${b.email || "—"}`,
    fields: [
      { name: "Fecha",    value: `${b.meetingDate || "—"} ${b.startTime || ""}—${b.endTime || ""}`, inline: true },
      { name: "Estado",   value: b.status || "pending", inline: true },
      { name: "Teléfono", value: b.phone || "—", inline: true },
      { name: "Idioma",   value: b.language || "es", inline: true },
      { name: "Modalidad", value: modality, inline: true },
      { name: "Reagendamientos", value: String(b.rescheduleCount ?? 0), inline: true },
      ...(isPhone
        ? []
        : [{ name: "Google Meet", value: b.googleMeet ? `[Unirse](${b.googleMeet})` : "—", inline: true }]),
      ...(b.notes ? [{ name: "Notas",    value: String(b.notes).slice(0, 1000), inline: false }] : []),
      ...(b.context ? [{ name: "Contexto", value: String(b.context).slice(0, 1000), inline: false }] : []),
    ],
  };
}

function bookingListEmbed(title: string, rows: Agenda[]): DiscordEmbedRef {
  if (rows.length === 0) {
    return { color: NEON, title, description: "_Sin reservas en el rango seleccionado._" };
  }
  const lines = rows.slice(0, 25).map(r =>
    `• \`${r.id}\` · **${r.meetingDate} ${r.startTime}** · ${r.name || "—"} (${r.status || "pending"})`
  );
  return {
    color: NEON,
    title: `${title} — ${rows.length} resultado(s)`,
    description: lines.join("\n"),
  };
}

// ─── Slash dispatcher ────────────────────────────────────────────────────────

export async function dispatchSlashCommand(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const data = interaction.data || {};
  const top = data.name as string;
  const sub = getSubcommand(data);

  if (top === "ayuda") {
    return handleHelpCommand(actor, res);
  }
  if (top === "agenda") {
    return handleAgendaCommand(sub.name, sub.options, interaction, actor, res);
  }
  if (top === "cita") {
    return handleCitaCommand(sub.name, sub.options, interaction, actor, res);
  }
  if (top === "newsletter") {
    return handleNewsletterCommand(sub.name, sub.options, actor, res);
  }
  replyEphemeral(res, `Comando no reconocido: \`${top}\``);
}

// ─── /newsletter ────────────────────────────────────────────────────────────
//
// Broadcast a 10K+ suscriptores con rate-limit + retry. Pipeline:
//   1. /newsletter enviar asunto html [idioma] → crea campaign + jobs en DB
//   2. Worker drena en background (server/scheduled/newsletter-broadcast.ts)
//   3. /newsletter status id:<id>          → muestra progreso
//   4. /newsletter cancelar id:<id>        → marca campaign cancelled

async function handleNewsletterCommand(
  sub: string, options: DiscordCommandOption[], actor: ActorContext, res: Response
): Promise<void> {
  await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: `newsletter ${sub}` });

  if (sub === "enviar") {
    const asunto = (getOpt(options, "asunto") || "").trim();
    const htmlUrl = (getOpt(options, "html") || "").trim();
    const idioma = (getOpt(options, "idioma") || "all").trim();

    if (!asunto || asunto.length > 200) {
      return replyEphemeral(res, "❌ Asunto inválido (1-200 chars)");
    }
    if (!htmlUrl.startsWith("https://")) {
      return replyEphemeral(res, "❌ La URL del HTML debe empezar con https://");
    }

    let html = "";
    try {
      const r = await fetch(htmlUrl, { headers: { "User-Agent": "Exentax-Newsletter/1.0" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      html = await r.text();
    } catch (err) {
      return replyEphemeral(res, `❌ No se pudo descargar el HTML: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!html.includes("{{unsubscribe_url}}")) {
      return replyEphemeral(res, "❌ El HTML debe incluir el placeholder {{unsubscribe_url}} (footer legal)");
    }

    try {
      const { createCampaign } = await import("./scheduled/newsletter-broadcast");
      const lang = idioma === "all" ? null : idioma;
      const { campaignId, recipients } = await createCampaign(asunto, html, lang, actor.id);
      return replyEphemeral(res,
        `✅ Campaign creada: \`${campaignId}\`\n` +
        `**Recipients**: ${recipients}\n` +
        `**Idioma**: ${lang ?? "todos"}\n` +
        `Worker drena en background a 2 emails/sec (~${Math.ceil(recipients / 7200)}h estimadas).\n` +
        `Status: \`/newsletter status id:${campaignId}\``
      );
    } catch (err) {
      return replyEphemeral(res, `❌ Error creando campaign: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (sub === "status") {
    const id = (getOpt(options, "id") || "").trim();
    if (!id || !id.startsWith("CMP_")) return replyEphemeral(res, "❌ Campaign ID inválido");
    try {
      const { getCampaignStatus } = await import("./scheduled/newsletter-broadcast");
      const r = await getCampaignStatus(id);
      if (!r.found || !r.campaign) return replyEphemeral(res, `❌ Campaign \`${id}\` no encontrada`);
      const c = r.campaign;
      const pct = c.totalRecipients ? ((c.sentCount! / c.totalRecipients) * 100).toFixed(1) : "0.0";
      return replyEphemeral(res,
        `**Campaign** \`${id}\`\n` +
        `**Subject**: ${c.subject}\n` +
        `**Status**: ${c.status}\n` +
        `**Progreso**: ${c.sentCount}/${c.totalRecipients} (${pct}%) · failed: ${c.failedCount}\n` +
        `**Idioma**: ${c.language ?? "todos"}\n` +
        `**Iniciada**: ${c.startedAt ? new Date(c.startedAt).toISOString() : "—"}\n` +
        `**Completada**: ${c.completedAt ? new Date(c.completedAt).toISOString() : "—"}`
      );
    } catch (err) {
      return replyEphemeral(res, `❌ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (sub === "cancelar") {
    const id = (getOpt(options, "id") || "").trim();
    if (!id || !id.startsWith("CMP_")) return replyEphemeral(res, "❌ Campaign ID inválido");
    try {
      const { cancelCampaign } = await import("./scheduled/newsletter-broadcast");
      const r = await cancelCampaign(id, actor.id);
      return replyEphemeral(res, r.ok ? `✅ ${r.message}` : `❌ ${r.message}`);
    } catch (err) {
      return replyEphemeral(res, `❌ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  replyEphemeral(res, `Subcomando \`/newsletter ${sub}\` no reconocido`);
}

// ─── /ayuda ─────────────────────────────────────────────────────────────────
//
// Single, self-contained reference card the operator can pull up from inside
// Discord without leaving for the docs site. Kept as one ephemeral embed so
// it never spams the channel and only the invoker sees it. The structure
// mirrors `docs/discord-bot-agenda.md` exactly — when adding a new command,
// update both places to keep them in sync.

async function handleHelpCommand(actor: ActorContext, res: Response): Promise<void> {
  await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "ayuda" });
  const fields = [
    {
      name: "Consulta de agenda",
      value: [
        "`/agenda hoy` — reservas de hoy (Madrid).",
        "`/agenda semana` — reservas de los próximos 7 días.",
        "`/agenda buscar q:<texto>` — busca por booking ID, nombre o email.",
        "`/agenda libre fecha:YYYY-MM-DD` — slots libres del día.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Bloqueo de días",
      value: [
        "`/agenda bloquear fecha:YYYY-MM-DD motivo:<texto>` — marca el día como no disponible.",
        "`/agenda desbloquear fecha:YYYY-MM-DD` — quita el bloqueo.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Gestión de una cita",
      value: [
        "`/cita ver id:<bookingId>` — ficha completa con botones de acción.",
        "`/cita confirmar id:<bookingId>` — pasa a estado `contacted`.",
        "`/cita cancelar id:<bookingId> motivo:<texto>` — cancela y libera el slot (envía email).",
        "`/cita noshow id:<bookingId>` — marca no-show (envía email de reagenda).",
        "`/cita reprogramar id:<bookingId>` — abre formulario para nueva fecha/hora.",
        "`/cita nueva nombre:<…> email:<…> fecha:<…> hora:<…> [telefono] [notas] [idioma]` — alta manual.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Envío manual de emails",
      value: [
        "`/cita email id:<bookingId> tipo:<confirmation|recordatorio|noshow|seguimiento>`.",
        "También disponible como menú desplegable bajo cada notificación de #agenda.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Botones bajo cada notificación de #agenda",
      value: [
        "**Confirmar** · **Reprogramar** · **Cancelar** · **No-show**",
        "Selector **Enviar email manual…** con las 4 plantillas.",
        "Tras cualquier acción, el embed original se actualiza con estado + operador + hora; los botones desaparecen para evitar duplicar la acción.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Identidad de las reservas",
      value: "Toda gestión usa el **bookingId** corto (p.ej. `bk_a1b2c3d4`). El `manage_token` es secreto del cliente y nunca aparece en Discord ni en logs.",
      inline: false,
    },
    {
      name: "Auditoría",
      value: [
        "Cada acción queda registrada en la tabla `agenda_admin_actions` (DB) y replicada en **#sistema-auditoria**.",
        "Solo miembros con el rol `ADMIN_DISCORD_ROLE_ID` pueden invocar comandos o pulsar botones.",
      ].join("\n"),
      inline: false,
    },
  ];
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: EPHEMERAL,
      embeds: [{
        title: "Bot de Agenda Exentax — Ayuda",
        description: "Referencia rápida de todos los comandos y componentes.",
        color: 0x00E510,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: "Documentación completa: docs/discord-bot-agenda.md" },
      }],
    },
  });
}

// ─── /agenda subcommands ────────────────────────────────────────────────────

async function handleAgendaCommand(
  sub: string, options: DiscordCommandOption[], interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  switch (sub) {
    case "hoy": {
      const today = todayMadridISO();
      const rows = await listAgendasFiltered({ from: today, to: today, limit: 100 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.hoy", payload: { from: today } });
      replyEphemeral(res, "", [bookingListEmbed(`Reservas de hoy (${today})`, rows)]);
      return;
    }
    case "semana": {
      const today = todayMadridISO();
      const end = addDaysISO(today, 7);
      const rows = await listAgendasFiltered({ from: today, to: end, limit: 200 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.semana", payload: { from: today, to: end } });
      replyEphemeral(res, "", [bookingListEmbed(`Próxima semana (${today} → ${end})`, rows)]);
      return;
    }
    case "buscar": {
      const q = getOpt(options, "q") || "";
      if (!q || q.length > 120) { replyEphemeral(res, "Error: Texto de búsqueda inválido."); return; }
      const rows = await listAgendasFiltered({ q, limit: 50 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.buscar", payload: { q } });
      replyEphemeral(res, "", [bookingListEmbed(`Resultados para "${q}"`, rows)]);
      return;
    }
    case "libre": {
      const fecha = getOpt(options, "fecha");
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      if (!isWeekday(fecha)) { replyEphemeral(res, "Error: Solo se reserva entre lunes y viernes."); return; }
      const blocked = await getBlockedDay(fecha);
      if (blocked) { replyEphemeral(res, `Aviso: Día \`${fecha}\` bloqueado${blocked.reason ? ` — ${blocked.reason}` : ""}.`); return; }
      const allSlots = generateTimeSlots();
      const taken = (await listAgendasFiltered({ from: fecha, to: fecha, limit: 100 }))
        .filter(r => !isCancelledStatus(r.status) && r.status !== AGENDA_STATUSES.NO_SHOW)
        .map(r => r.startTime);
      const free = allSlots.filter(s => !taken.includes(s));
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.libre", payload: { fecha } });
      replyEphemeral(res, "", [{
        color: NEON,
        title: `Slots libres ${fecha}`,
        description: free.length ? free.map(s => `\`${s}\``).join("  ") : "_Sin slots libres._",
      }]);
      return;
    }
    case "bloquear": {
      const fecha = getOpt(options, "fecha");
      const motivo = getOpt(options, "motivo") || null;
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      const row = await insertBlockedDay(fecha, motivo);
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.bloquear", payload: { fecha, motivo } });
      notifyAdminAction({ actor, action: "agenda.bloquear", title: `Día bloqueado · ${fecha}`, fields: [
        { name: "Fecha", value: fecha, inline: true },
        { name: "Motivo", value: motivo || "—", inline: true },
      ]});
      replyEphemeral(res, `Día \`${row.date}\` bloqueado${row.reason ? ` — ${row.reason}` : ""}.`);
      return;
    }
    case "desbloquear": {
      const fecha = getOpt(options, "fecha");
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      const removed = await deleteBlockedDay(fecha);
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.desbloquear", payload: { fecha, removed } });
      if (removed) {
        notifyAdminAction({ actor, action: "agenda.desbloquear", title: `OK Día desbloqueado · ${fecha}`, fields: [
          { name: "Fecha", value: fecha, inline: true },
        ]});
      }
      replyEphemeral(res, removed ? `OK Día \`${fecha}\` desbloqueado.` : `\`${fecha}\` no estaba bloqueado.`);
      return;
    }
    default:
      replyEphemeral(res, `Subcomando \`/agenda ${sub}\` no implementado.`);
  }
}

// ─── /cita subcommands ──────────────────────────────────────────────────────

async function handleCitaCommand(
  sub: string, options: DiscordCommandOption[], interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  if (sub === "nueva") return handleCreateBooking(options, interaction, actor, res);

  const id = getOpt(options, "id");
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  switch (sub) {
    case "ver":         return showBooking(id, actor, res);
    case "confirmar":   return confirmBooking(id, actor, interaction, res);
    case "cancelar":    return cancelBooking(id, actor, interaction, res);
    case "noshow":      return noShowBooking(id, actor, interaction, res);
    case "reprogramar": {
      const fecha = getOpt(options, "fecha");
      const hora  = getOpt(options, "hora");
      if (!fecha || !hora) { replyEphemeral(res, "Error: Fecha y hora son obligatorios."); return; }
      deferEphemeral(res);
      await rescheduleBooking(id, fecha, hora, actor, interaction);
      return;
    }
    case "email": {
      const tipo = getOpt(options, "tipo") || "";
      deferEphemeral(res);
      await sendManualEmail(id, tipo, actor, interaction);
      return;
    }
    default:
      replyEphemeral(res, `Subcomando \`/cita ${sub}\` no implementado.`);
  }
}

// ─── Booking actions (shared between slash + button) ────────────────────────

async function showBooking(id: string, actor: ActorContext, res: Response): Promise<void> {
  const row = await getAgendaById(id);
  if (!row) { replyEphemeral(res, "Error: Reserva no encontrada."); return; }
  await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.ver" });
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: EPHEMERAL,
      embeds: [bookingDetailEmbed(row)],
      components: bookingActionRows(id),
    },
  });
}

async function confirmBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
  const row = await getAgendaById(id);
  if (!row) { replyEphemeral(res, "Error: Reserva no encontrada."); return; }
  if (isCancelledStatus(row.status)) { replyEphemeral(res, "Error: La reserva está cancelada."); return; }
  await updateAgenda(id, { status: AGENDA_STATUSES.CONTACTED });
  await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.confirmar" });
  notifyAdminAction({ actor, action: "cita.confirmar", title: `OK Cita confirmada · ${id}`, fields: [
    { name: "Cliente", value: row.name || "—", inline: true },
    { name: "Fecha",   value: `${row.meetingDate} ${row.startTime}`, inline: true },
  ]});
  patchOriginatingMessage(interaction, "cita.confirmar", actor).catch(err =>
    logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
  replyEphemeral(res, `OK Cita \`${id}\` marcada como confirmada (status=contacted).`);
}

async function cancelBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
  const row = await getAgendaById(id);
  if (!row) { replyEphemeral(res, "Error: Reserva no encontrada."); return; }
  if (isCancelledStatus(row.status)) { replyEphemeral(res, "La reserva ya estaba cancelada."); return; }

  const result = await withBookingLock(id, async () => {
    const fresh = await getAgendaById(id);
    if (!fresh || isCancelledStatus(fresh.status)) return { ok: false as const };
    await updateAgenda(id, { status: AGENDA_STATUSES.CANCELLED, cancelledAt: new Date().toISOString() });
    return { ok: true as const, row: fresh };
  });
  if (!result.ok) { replyEphemeral(res, "La reserva ya estaba cancelada."); return; }
  const r = result.row;

  if (r.meetingDate && r.startTime && r.email) cancelReminderTimer(r.meetingDate, r.startTime, r.email);
  if (r.googleMeetEventId) {
    deleteGoogleMeetEvent(r.googleMeetEventId).catch(err =>
      logger.error("Google Meet delete on bot cancel failed", "discord-bot", err));
  }

  sendCancellationEmail({
    clientName: r.name || "", clientEmail: r.email || "",
    date: r.meetingDate || "", startTime: r.startTime || "", endTime: r.endTime || "",
    language: r.language || null,
  }).catch(err => logger.error("Bot cancellation email failed:", "discord-bot", err));

  notifyBookingCancelled({
    bookingId: id, name: r.name || "", email: r.email || "", phone: r.phone,
    date: r.meetingDate, startTime: r.startTime, endTime: r.endTime,
    language: r.language, source: "admin",
  });
  await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.cancelar" });
  notifyAdminAction({ actor, action: "cita.cancelar", title: `Cita cancelada · ${id}`, fields: [
    { name: "Cliente", value: r.name || "—", inline: true },
    { name: "Fecha",   value: `${r.meetingDate} ${r.startTime}`, inline: true },
  ]});
  patchOriginatingMessage(interaction, "cita.cancelar", actor).catch(err =>
    logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
  replyEphemeral(res, `Cita \`${id}\` cancelada. Email de cancelación enviado.`);
}

async function noShowBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
  const row = await getAgendaById(id);
  if (!row) { replyEphemeral(res, "Error: Reserva no encontrada."); return; }
  if (row.status === AGENDA_STATUSES.NO_SHOW) { replyEphemeral(res, "Ya estaba marcada como no-show."); return; }
  if (isCancelledStatus(row.status)) { replyEphemeral(res, "Error: No se puede marcar no-show: cancelada."); return; }

  await updateAgenda(id, { status: AGENDA_STATUSES.NO_SHOW });
  if (row.meetingDate && row.startTime && row.email) cancelReminderTimer(row.meetingDate, row.startTime, row.email);

  notifyNoShow({
    bookingId: id, name: row.name || "", email: row.email || "", phone: row.phone,
    date: row.meetingDate, startTime: row.startTime, endTime: row.endTime,
    language: row.language, meetLink: row.googleMeet,
  });
  await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.noshow" });
  notifyAdminAction({ actor, action: "cita.noshow", title: `No-show · ${id}`, fields: [
    { name: "Cliente", value: row.name || "—", inline: true },
    { name: "Fecha",   value: `${row.meetingDate} ${row.startTime}`, inline: true },
  ]});
  patchOriginatingMessage(interaction, "cita.noshow", actor).catch(err =>
    logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
  replyEphemeral(res, `Cita \`${id}\` marcada como no-show.`);
}

async function rescheduleBooking(
  id: string, date: string, startTime: string, actor: ActorContext, interaction: DiscordInteraction,
): Promise<void> {
  const token = interaction.token;
  const row = await getAgendaById(id);
  if (!row) { await followupEphemeral(token, "Error: Reserva no encontrada."); return; }
  if (isCancelledStatus(row.status)) { await followupEphemeral(token, "Error: La reserva está cancelada."); return; }

  if (!ISO_DATE_RE.test(date) || !isValidISODate(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    await followupEphemeral(token, "Error: Fecha u hora con formato inválido."); return;
  }
  if (row.meetingDate === date && row.startTime === startTime) {
    await followupEphemeral(token, "Error: La reserva ya está en ese mismo slot."); return;
  }
  if (!isWeekday(date)) { await followupEphemeral(token, "Error: Solo lunes a viernes."); return; }
  if (date < todayMadridISO()) { await followupEphemeral(token, "Error: Fecha en el pasado."); return; }
  if (await getBlockedDay(date)) { await followupEphemeral(token, "Error: Ese día está bloqueado."); return; }
  if (!generateTimeSlots().includes(startTime)) { await followupEphemeral(token, "Error: Hora fuera del horario laboral."); return; }

  const endTime = getEndTime(startTime);
  const slotKey = `${date}T${startTime}`;
  const newCount = (row.rescheduleCount ?? 0) + 1;
  const nowIso = new Date().toISOString();

  const claim = await withBookingLock(id, () =>
    withSlotLock(slotKey, async () => {
      const fresh = await getAgendaById(id);
      if (!fresh || isCancelledStatus(fresh.status)) return { error: "CANCELLED" as const };
      if (await isSlotBooked(date, startTime)) return { error: "SLOT_TAKEN" as const };
      try {
        await updateAgenda(id, {
          meetingDate: date, startTime, endTime,
          status: AGENDA_STATUSES.RESCHEDULED,
          googleMeet: null, googleMeetEventId: null,
          rescheduleCount: newCount, lastRescheduledAt: nowIso, reminderSent: false,
        });
      } catch (err) {
        if (err instanceof SlotConflictError) return { error: "SLOT_TAKEN" as const };
        throw err;
      }
      return { error: false as const };
    }),
  );
  if (claim.error === "CANCELLED") { await followupEphemeral(token, "Error: La reserva fue cancelada antes de reagendar."); return; }
  if (claim.error === "SLOT_TAKEN") { await followupEphemeral(token, "Error: Ese slot ya está ocupado."); return; }

  if (row.meetingDate && row.startTime && row.email) cancelReminderTimer(row.meetingDate, row.startTime, row.email);

  let newMeetLink: string | null = null;
  let newEventId: string | null = null;
  try {
    const meet = await createGoogleMeetEvent({
      clientName: row.name || "Cliente", clientEmail: row.email,
      date, startTime, endTime,
    });
    if (meet) { newMeetLink = meet.meetLink; newEventId = meet.eventId; }
  } catch (err) {
    logger.error("Google Meet create on bot reschedule failed:", "discord-bot", err);
  }
  if (row.googleMeetEventId) {
    deleteGoogleMeetEvent(row.googleMeetEventId).catch(err =>
      logger.error("Google Meet delete on bot reschedule failed", "discord-bot", err));
  }
  if (newMeetLink || newEventId) {
    await updateAgenda(id, { googleMeet: newMeetLink, googleMeetEventId: newEventId });
  }

  const manageUrl = row.manageToken ? `${SITE_URL}/booking/${id}?token=${row.manageToken}` : "";
  sendRescheduleConfirmation({
    clientName: row.name || "", clientEmail: row.email || "",
    date, startTime, endTime,
    meetLink: newMeetLink, manageUrl, language: row.language || null,
  }).catch(err => logger.error("Bot reschedule email failed:", "discord-bot", err));

  scheduleReminderEmail({
    clientName: row.name || "", clientEmail: row.email || "",
    date, startTime, endTime,
    meetLink: newMeetLink, manageUrl, language: row.language || null, agendaId: id,
  });

  notifyBookingRescheduled({
    bookingId: id, name: row.name || "", email: row.email || "",
    phone: row.phone,
    oldDate: row.meetingDate, oldStartTime: row.startTime,
    newDate: date, newStartTime: startTime, newEndTime: endTime,
    newMeetLink, language: row.language, rescheduleCount: newCount, source: "admin",
  });
  await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.reprogramar", payload: { date, startTime } });
  notifyAdminAction({ actor, action: "cita.reprogramar", title: `Cita reagendada · ${id}`, fields: [
    { name: "Cliente",       value: row.name || "—", inline: true },
    { name: "Anterior",      value: `${row.meetingDate} ${row.startTime}`, inline: true },
    { name: "Nueva",         value: `${date} ${startTime}`, inline: true },
  ]});
  patchOriginatingMessage(interaction, "cita.reprogramar", actor).catch(err =>
    logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
  await followupEphemeral(token, `Cita \`${id}\` reagendada a **${date} ${startTime}**.`);
}

async function sendManualEmail(id: string, tipo: string, actor: ActorContext, interaction: DiscordInteraction): Promise<void> {
  const token = interaction.token;
  const row = await getAgendaById(id);
  if (!row) { await followupEphemeral(token, "Error: Reserva no encontrada."); return; }

  const lang = row.language || null;
  const manageUrl = row.manageToken ? `${SITE_URL}/booking/${id}?token=${row.manageToken}` : "";

  if (tipo === "noshow") {
    await sendNoShowRescheduleEmail({
      clientName: row.name || "", clientEmail: row.email || "", language: lang,
    });
    await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.email.noshow" });
    notifyAdminAction({ actor, action: "cita.email.noshow", title: `Email no-show enviado · ${id}` });
    patchOriginatingMessage(interaction, "cita.email.noshow", actor).catch(err =>
      logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
    await followupEphemeral(token, `Email de no-show enviado a \`${row.email}\`.`);
    return;
  }
  if (tipo === "confirmation") {
    const jobId = await enqueueEmail("booking_confirmation", {
      clientName: row.name || "", clientEmail: row.email || "",
      date: row.meetingDate || "", startTime: row.startTime || "", endTime: row.endTime || "",
      meetLink: row.googleMeet || null, manageUrl,
      language: lang, agendaId: id,
    }, { reason: "discord_resend", immediate: true });
    triggerEmailDrain();
    await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.email.confirmation", payload: { jobId } });
    notifyAdminAction({ actor, action: "cita.email.confirmation", title: `Confirmación reenviada · ${id}` });
    patchOriginatingMessage(interaction, "cita.email.confirmation", actor).catch(err =>
      logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
    await followupEphemeral(token, `Email de confirmación encolado para \`${row.email}\`.`);
    return;
  }
  if (tipo === "recordatorio") {
    if (!row.meetingDate || !row.startTime || !row.endTime || !row.email) {
      await followupEphemeral(token, "Error: La reserva no tiene fecha/hora/email para enviar recordatorio.");
      return;
    }
    await sendReminderEmail({
      clientName: row.name || "", clientEmail: row.email,
      date: row.meetingDate, startTime: row.startTime, endTime: row.endTime,
      meetLink: row.googleMeet || null, manageUrl,
      language: lang,
    });
    await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.email.recordatorio" });
    notifyAdminAction({ actor, action: "cita.email.recordatorio", title: `Recordatorio enviado · ${id}` });
    patchOriginatingMessage(interaction, "cita.email.recordatorio", actor).catch(err =>
      logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
    await followupEphemeral(token, `Email de recordatorio enviado a \`${row.email}\`.`);
    return;
  }
  if (tipo === "seguimiento") {
    if (!row.email) { await followupEphemeral(token, "Error: La reserva no tiene email."); return; }
    await sendFollowupEmail({
      clientName: row.name || "", clientEmail: row.email, language: lang,
    });
    await logAdminAction({ bookingId: id, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.email.seguimiento" });
    notifyAdminAction({ actor, action: "cita.email.seguimiento", title: `Seguimiento enviado · ${id}` });
    patchOriginatingMessage(interaction, "cita.email.seguimiento", actor).catch(err =>
      logger.warn(`[discord-bot] patch original message failed: ${String(err)}`, "discord-bot"));
    await followupEphemeral(token, `Email de seguimiento enviado a \`${row.email}\`.`);
    return;
  }
  await followupEphemeral(token, "Error: Tipo de email no soportado.");
}

async function handleCreateBooking(
  options: DiscordCommandOption[], interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const nombre = getOpt(options, "nombre") || "";
  const email = (getOpt(options, "email") || "").trim().toLowerCase();
  const fecha = getOpt(options, "fecha") || "";
  const hora  = getOpt(options, "hora")  || "";
  const telefono = getOpt(options, "telefono") || null;
  const notas    = getOpt(options, "notas") || null;
  // Optional language. Falls back to Spanish — same default the public
  // booking form uses when no Accept-Language hint is available.
  const idiomaRaw = (getOpt(options, "idioma") || "es").toLowerCase();
  const SUPPORTED = new Set(["es", "en", "fr", "de", "pt", "ca"]);
  const idioma = SUPPORTED.has(idiomaRaw) ? idiomaRaw : "es";

  const schema = z.object({
    nombre: z.string().min(1).max(120),
    email:  z.string().email().max(160),
    fecha:  z.string().regex(ISO_DATE_RE).refine(isValidISODate),
    hora:   z.string().regex(/^\d{2}:\d{2}$/),
  });
  const parsed = schema.safeParse({ nombre, email, fecha, hora });
  if (!parsed.success) { replyEphemeral(res, "Error: Datos inválidos. Revisa nombre/email/fecha/hora."); return; }

  if (!isWeekday(fecha)) { replyEphemeral(res, "Error: Solo lunes a viernes."); return; }
  if (fecha < todayMadridISO()) { replyEphemeral(res, "Error: Fecha en el pasado."); return; }
  if (await getBlockedDay(fecha)) { replyEphemeral(res, "Error: Ese día está bloqueado."); return; }
  if (!generateTimeSlots().includes(hora)) { replyEphemeral(res, "Error: Hora fuera del horario laboral."); return; }

  deferEphemeral(res);

  const endTime = getEndTime(hora);
  const slotKey = `${fecha}T${hora}`;
  const bookingId = generateId();
  const manageToken = crypto.randomBytes(24).toString("hex");

  let meetLink: string | null = null;
  let meetEventId: string | null = null;
  try {
    const meet = await createGoogleMeetEvent({ clientName: nombre, clientEmail: email, date: fecha, startTime: hora, endTime });
    if (meet) { meetLink = meet.meetLink; meetEventId = meet.eventId; }
  } catch (err) {
    logger.error("Google Meet create on bot create-booking failed:", "discord-bot", err);
  }

  const result = await withSlotLock(slotKey, async () => {
    if (await isSlotBooked(fecha, hora)) return { error: "SLOT_TAKEN" as const };
    if (await hasExistingBooking(email)) return { error: "DUPLICATE" as const };
    const insertPayload: InsertAgenda = {
      id: bookingId,
      name: nombre,
      email,
      phone: telefono,
      meetingDate: fecha,
      startTime: hora,
      endTime,
      status: AGENDA_STATUSES.PENDING,
      notes: notas,
      googleMeet: meetLink,
      googleMeetEventId: meetEventId,
      manageToken,
      language: idioma,
      meetingType: "google_meet",
      privacy: true,
    };
    try {
      await insertAgenda(insertPayload);
    } catch (err) {
      if (err instanceof SlotConflictError) return { error: "SLOT_TAKEN" as const };
      throw err;
    }
    return { error: false as const };
  });

  if (result.error === "SLOT_TAKEN") {
    if (meetEventId) deleteGoogleMeetEvent(meetEventId).catch(() => {});
    await followupEphemeral(interaction.token, "Error: Ese slot ya está ocupado.");
    return;
  }
  if (result.error === "DUPLICATE") {
    if (meetEventId) deleteGoogleMeetEvent(meetEventId).catch(() => {});
    await followupEphemeral(interaction.token, "Error: Ya existe una reserva activa para ese email.");
    return;
  }

  const manageUrl = `${SITE_URL}/booking/${bookingId}?token=${manageToken}`;
  await enqueueEmail("booking_confirmation", {
    clientName: nombre, clientEmail: email,
    date: fecha, startTime: hora, endTime,
    meetLink, manageUrl, language: idioma, agendaId: bookingId,
  }, { reason: "discord_create", immediate: true });
  triggerEmailDrain();
  scheduleReminderEmail({
    clientName: nombre, clientEmail: email,
    date: fecha, startTime: hora, endTime,
    meetLink, manageUrl, language: idioma, agendaId: bookingId,
  });

  notifyBookingCreated({
    bookingId, name: nombre, email, phone: telefono,
    date: fecha, startTime: hora, endTime, meetLink, meetingType: "google_meet",
    language: idioma, source: "discord-bot",
    notes: notas,
  });
  await logAdminAction({ bookingId, actorDiscordId: actor.id, actorDiscordName: actor.name, action: "cita.nueva", payload: { fecha, hora, email } });
  notifyAdminAction({ actor, action: "cita.nueva", title: `Cita creada · ${bookingId}`, fields: [
    { name: "Cliente", value: nombre, inline: true },
    { name: "Email",   value: email, inline: true },
    { name: "Fecha",   value: `${fecha} ${hora}`, inline: true },
  ]});
  await followupEphemeral(interaction.token, `Cita creada \`${bookingId}\` para **${nombre}** el **${fecha} ${hora}**.`);
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

export async function dispatchComponent(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const customId = String(interaction.data?.custom_id || "");
  const parts = customId.split(":");
  if (parts[0] !== "agenda") { replyEphemeral(res, "Error: Componente no reconocido."); return; }
  const action = parts[1];
  const id = parts[2];
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  switch (action) {
    case "confirm":   return confirmBooking(id, actor, interaction, res);
    case "cancel":    return cancelBooking(id, actor, interaction, res);
    case "noshow":    return noShowBooking(id, actor, interaction, res);
    case "reschedule":
      // Open a modal so the operator can type the new date/time.
      res.status(200).json({
        type: INTERACTION_RESPONSE_TYPE.MODAL,
        data: {
          custom_id: `agenda:reschedule_modal:${id}`,
          title: `Reprogramar ${id}`.slice(0, 45),
          components: [
            { type: 1, components: [{ type: 4, custom_id: "fecha", label: "Fecha (YYYY-MM-DD)", style: 1, min_length: 10, max_length: 10, required: true }] },
            { type: 1, components: [{ type: 4, custom_id: "hora",  label: "Hora (HH:MM)",       style: 1, min_length: 5,  max_length: 5,  required: true }] },
          ],
        },
      });
      return;
    case "email_select": {
      // String select menu under the booking message. The operator picks
      // the exact template they want — never a hard-coded default — so
      // we can't accidentally send a no-show email to an active booking
      // (the original generic "Email" button was rejected in code review
      // for exactly that reason).
      const values: string[] = Array.isArray(interaction.data?.values) ? interaction.data!.values : [];
      const tipo = String(values[0] || "");
      const ALLOWED = new Set(["confirmation", "recordatorio", "noshow", "seguimiento"]);
      if (!ALLOWED.has(tipo)) { replyEphemeral(res, "Error: Tipo de email no válido."); return; }
      deferEphemeral(res);
      await sendManualEmail(id, tipo, actor, interaction);
      return;
    }
    default:
      replyEphemeral(res, `Error: Acción de botón no implementada: \`${action}\``);
  }
}

// ─── Modal submit ───────────────────────────────────────────────────────────

export async function dispatchModalSubmit(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const customId = String(interaction.data?.custom_id || "");
  const parts = customId.split(":");
  if (parts[0] !== "agenda" || parts[1] !== "reschedule_modal") {
    replyEphemeral(res, "Error: Modal no reconocido.");
    return;
  }
  const id = parts[2];
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  const components: DiscordMessageComponent[] = interaction.data?.components || [];
  const flat: Record<string, string> = {};
  for (const row of components) {
    for (const c of (row.components || [])) {
      if (c.custom_id) flat[c.custom_id] = String(c.value || "");
    }
  }
  const fecha = flat["fecha"];
  const hora  = flat["hora"];
  if (!fecha || !hora) { replyEphemeral(res, "Error: Faltan campos."); return; }

  deferEphemeral(res);
  await rescheduleBooking(id, fecha, hora, actor, interaction);
}

// ─── Misc helpers ───────────────────────────────────────────────────────────

function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
