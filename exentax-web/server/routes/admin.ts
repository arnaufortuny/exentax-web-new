import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { z } from "zod";
import { logger } from "../logger";
import {
  getAgendaById, updateAgenda, isSlotBooked, getBlockedDay,
} from "../storage";
import {
  sendBookingConfirmation, sendCancellationEmail,
  sendRescheduleConfirmation, sendNoShowRescheduleEmail,
} from "../email";
import {
  AGENDA_STATUSES, isCancelledStatus, SITE_URL, todayMadridISO,
} from "../server-constants";
import {
  generateTimeSlots, getEndTime, isWeekday,
  scheduleReminderEmail, cancelReminderTimer,
  withSlotLock, asyncHandler,
  ISO_DATE_RE, isValidISODate,
} from "../route-helpers";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "../google-meet";
import {
  notifyBookingRescheduled, notifyBookingCancelled,
  notifyNoShow,
} from "../discord";
import { sheetsLogBookingUpdate } from "../google-sheets";
import { apiOk, apiFail, apiNotFound, apiValidationFail } from "./api-response";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  if (!ADMIN_TOKEN) {
    return apiFail(res, 503, "Admin no configurado", "NOT_CONFIGURED");
  }
  const token = String(req.query.adminToken || req.headers["x-admin-token"] || "");
  if (!token) {
    return apiFail(res, 401, "No autorizado", "UNAUTHORIZED");
  }
  const a = Buffer.from(token);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return apiFail(res, 401, "Token inválido", "INVALID_TOKEN");
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  app.get("/api/admin/verify", adminAuth, (_req: Request, res: Response) => {
    return apiOk(res, { valid: true });
  });

  app.get("/api/admin/agenda/:bookingId", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    const manageUrl = row.manageToken
      ? `${SITE_URL}/booking/${bookingId}?token=${row.manageToken}`
      : null;
    return apiOk(res, {
      booking: {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        meetingDate: row.meetingDate,
        startTime: row.startTime,
        endTime: row.endTime,
        googleMeet: row.googleMeet,
        notes: row.notes,
        context: row.context,
        status: row.status,
        language: row.language,
        ip: row.ip,
        monthlyProfit: row.monthlyProfit,
        globalClients: row.globalClients,
        digitalOperation: row.digitalOperation,
        shareNote: row.shareNote,
        privacy: row.privacy,
        marketing: row.marketing,
        rescheduleCount: row.rescheduleCount,
        lastRescheduledAt: row.lastRescheduledAt,
        cancelledAt: row.cancelledAt,
        reminderSent: row.reminderSent,
        bookingDate: row.bookingDate,
        createdAt: row.createdAt,
        manageUrl,
      },
    });
  }));

  app.post("/api/admin/agenda/:bookingId/reschedule", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, "No se puede reagendar una reserva cancelada", "BOOKING_CANCELLED");

    const parseSchema = z.object({
      date: z.string().regex(ISO_DATE_RE).refine(isValidISODate),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
    }).strict();
    const parsed = parseSchema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { date, startTime } = parsed.data;

    if (!isWeekday(date)) return apiFail(res, 400, "Solo días laborables", "INVALID_DATE");
    const todayStr = todayMadridISO();
    if (date < todayStr) return apiFail(res, 400, "No se puede reagendar a una fecha pasada", "PAST_DATE");
    const blockedDay = await getBlockedDay(date);
    if (blockedDay) return apiFail(res, 400, "Día bloqueado", "BLOCKED_DATE");
    const endTime = getEndTime(startTime);
    const validSlots = generateTimeSlots();
    if (!validSlots.includes(startTime)) return apiFail(res, 400, "Horario no válido", "INVALID_TIME");

    const slotKey = `${date}T${startTime}`;
    const newRescheduleCount = (row.rescheduleCount ?? 0) + 1;
    const nowIso = new Date().toISOString();

    const claimResult = await withSlotLock(slotKey, async () => {
      const booked = await isSlotBooked(date, startTime);
      if (booked) return { error: true as const };
      await updateAgenda(bookingId, {
        meetingDate: date,
        startTime,
        endTime,
        status: AGENDA_STATUSES.RESCHEDULED,
        googleMeet: null,
        googleMeetEventId: null,
        rescheduleCount: newRescheduleCount,
        lastRescheduledAt: nowIso,
      });
      return { error: false as const };
    });
    if (claimResult.error) return apiFail(res, 409, "Horario ya ocupado", "SLOT_TAKEN");

    if (row.meetingDate && row.startTime && row.email) {
      cancelReminderTimer(row.meetingDate, row.startTime, row.email);
    }

    const oldMeetEventId = row.googleMeetEventId;
    let newMeetLink: string | null = null;
    let newEventId: string | null = null;
    try {
      const meetResult = await createGoogleMeetEvent({
        clientName: row.name || "Cliente",
        clientEmail: row.email,
        date,
        startTime,
        endTime,
      });
      if (meetResult) {
        newMeetLink = meetResult.meetLink;
        newEventId = meetResult.eventId;
      }
    } catch (err) {
      logger.error("Google Meet create on admin reschedule failed:", "admin", err);
    }

    if (oldMeetEventId) {
      deleteGoogleMeetEvent(oldMeetEventId).catch(err =>
        logger.error("Google Meet delete on admin reschedule failed", "admin", err)
      );
    }

    if (newMeetLink || newEventId) {
      await updateAgenda(bookingId, {
        googleMeet: newMeetLink,
        googleMeetEventId: newEventId,
      });
    }

    const manageUrl = row.manageToken
      ? `${SITE_URL}/booking/${bookingId}?token=${row.manageToken}`
      : undefined;
    sendRescheduleConfirmation({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date,
      startTime,
      endTime,
      meetLink: newMeetLink,
      manageUrl: manageUrl || "",
      language: row.language || null,
    }).catch(err => logger.error("Admin reschedule email failed:", "admin", err));

    scheduleReminderEmail({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date,
      startTime,
      endTime,
      meetLink: newMeetLink,
      manageUrl: manageUrl || "",
      language: row.language || null,
      agendaId: bookingId,
    });

    notifyBookingRescheduled({
      bookingId,
      manageToken: row.manageToken,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone,
      oldDate: row.meetingDate,
      oldStartTime: row.startTime,
      newDate: date,
      newStartTime: startTime,
      newEndTime: endTime,
      newMeetLink,
      language: row.language,
      rescheduleCount: newRescheduleCount,
      source: "admin",
    });
    sheetsLogBookingUpdate({ bookingId, email: row.email || "", action: "rescheduled", newDate: date, newStartTime: startTime, newEndTime: endTime, rescheduleCount: newRescheduleCount });
    logger.info(`[admin] Booking ${bookingId} rescheduled to ${date} ${startTime}`, "admin");
    return apiOk(res, { date, startTime, endTime, status: "rescheduled" });
  }));

  app.post("/api/admin/agenda/:bookingId/cancel", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, "Ya está cancelada", "ALREADY_CANCELLED");

    const cancelledAt = new Date().toISOString();
    await updateAgenda(bookingId, { status: AGENDA_STATUSES.CANCELLED, cancelledAt });

    if (row.meetingDate && row.startTime && row.email) {
      cancelReminderTimer(row.meetingDate, row.startTime, row.email);
    }
    if (row.googleMeetEventId) {
      deleteGoogleMeetEvent(row.googleMeetEventId).catch(err =>
        logger.error("Google Meet delete on admin cancel failed", "admin", err)
      );
    }

    sendCancellationEmail({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date: row.meetingDate || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
      language: row.language || null,
    }).catch(err => logger.error("Admin cancellation email failed:", "admin", err));

    notifyBookingCancelled({
      bookingId,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone,
      date: row.meetingDate,
      startTime: row.startTime,
      endTime: row.endTime,
      language: row.language,
      source: "admin",
    });
    sheetsLogBookingUpdate({ bookingId, email: row.email || "", action: "cancelled" });
    logger.info(`[admin] Booking ${bookingId} cancelled`, "admin");
    return apiOk(res, { status: "cancelled" });
  }));

  app.post("/api/admin/agenda/:bookingId/no-show", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (row.status === "no_show") return apiFail(res, 400, "Ya marcada como no-show", "ALREADY_NO_SHOW");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, "No se puede marcar cancelada como no-show", "BOOKING_CANCELLED");

    await updateAgenda(bookingId, { status: AGENDA_STATUSES.NO_SHOW });

    if (row.meetingDate && row.startTime && row.email) {
      cancelReminderTimer(row.meetingDate, row.startTime, row.email);
    }

    notifyNoShow({
      bookingId,
      name: row.name || "",
      email: row.email || "",
      phone: row.phone,
      date: row.meetingDate,
      startTime: row.startTime,
      endTime: row.endTime,
      language: row.language,
      meetLink: row.googleMeet,
    });
    sheetsLogBookingUpdate({ bookingId, email: row.email || "", action: "no_show" });
    logger.info(`[admin] Booking ${bookingId} marked as no-show`, "admin");
    return apiOk(res, { status: "no_show" });
  }));

  app.post("/api/admin/agenda/:bookingId/send-noshow", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");

    await sendNoShowRescheduleEmail({
      clientName: row.name || "",
      clientEmail: row.email || "",
      language: row.language || null,
    });
    logger.info(`[admin] No-show email sent for ${bookingId}`, "admin");
    return apiOk(res, { sent: true });
  }));

  app.post("/api/admin/agenda/:bookingId/resend-confirmation", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, "ID inválido", "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");

    const manageUrl = row.manageToken
      ? `${SITE_URL}/booking/${bookingId}?token=${row.manageToken}`
      : "";

    await sendBookingConfirmation({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date: row.meetingDate || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
      meetLink: row.googleMeet || null,
      manageUrl,
      language: row.language || null,
    });
    logger.info(`[admin] Confirmation email resent for ${bookingId}`, "admin");
    return apiOk(res, { sent: true });
  }));
}
