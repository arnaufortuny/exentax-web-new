/**
 * Booking action handlers shared by the slash dispatcher, the button
 * component dispatcher and the modal submit dispatcher.
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
import crypto from "crypto";
import { logger } from "../../logger";
import {
  ActorContext, DiscordInteraction, DiscordCommandOption,
  INTERACTION_RESPONSE_TYPE, EPHEMERAL,
} from "../../discord-bot";
import {
  getAgendaById, updateAgenda, isSlotBooked, hasExistingBooking, insertAgenda,
  getBlockedDay, logAdminAction, SlotConflictError, generateId,
} from "../../storage";
import {
  sendCancellationEmail, sendNoShowRescheduleEmail, sendReminderEmail,
  sendRescheduleConfirmation, sendFollowupEmail,
} from "../../email";
import { enqueueEmail, triggerEmailDrain } from "../../email-retry-queue";
import { AGENDA_STATUSES, isCancelledStatus, SITE_URL, todayMadridISO } from "../../server-constants";
import {
  generateTimeSlots, getEndTime, isWeekday,
  scheduleReminderEmail, cancelReminderTimer,
  withSlotLock, withBookingLock, ISO_DATE_RE, isValidISODate,
} from "../../route-helpers";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "../../google-meet";
import {
  notifyBookingCreated, notifyBookingRescheduled, notifyBookingCancelled,
  notifyNoShow, notifyAdminAction, bookingActionRows,
} from "../../discord";
import type { InsertAgenda } from "../../../shared/schema";
import {
  replyEphemeral, deferEphemeral, followupEphemeral, getOpt,
  bookingDetailEmbed,
} from "./shared";
import { patchOriginatingMessage } from "./patch-message";

export async function showBooking(id: string, actor: ActorContext, res: Response): Promise<void> {
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

export async function confirmBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
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

export async function cancelBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
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

export async function noShowBooking(id: string, actor: ActorContext, interaction: DiscordInteraction, res: Response): Promise<void> {
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

export async function rescheduleBooking(
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

export async function sendManualEmail(id: string, tipo: string, actor: ActorContext, interaction: DiscordInteraction): Promise<void> {
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

export async function handleCreateBooking(
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
