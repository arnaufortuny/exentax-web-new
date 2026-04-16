import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import fs from "node:fs";
import path from "node:path";
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
  withSlotLock, withBookingLock, asyncHandler,
  ISO_DATE_RE, isValidISODate,
} from "../route-helpers";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "../google-meet";
import {
  notifyBookingRescheduled, notifyBookingCancelled,
  notifyNoShow,
} from "../discord";
import { apiOk, apiFail, apiNotFound, apiValidationFail } from "./api-response";
import { backendLabel, resolveRequestLang } from "./shared";

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
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
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
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("cannotRescheduleCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");

    const parseSchema = z.object({
      date: z.string().regex(ISO_DATE_RE).refine(isValidISODate),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
    }).strict();
    const parsed = parseSchema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { date, startTime } = parsed.data;

    if (row.meetingDate === date && row.startTime === startTime) return apiFail(res, 400, backendLabel("sameSlot", resolveRequestLang(req)), "SAME_SLOT");

    if (!isWeekday(date)) return apiFail(res, 400, backendLabel("weekdaysOnly", resolveRequestLang(req)), "INVALID_DATE");
    const todayStr = todayMadridISO();
    if (date < todayStr) return apiFail(res, 400, backendLabel("cannotReschedulePastDate", resolveRequestLang(req)), "PAST_DATE");
    const blockedDay = await getBlockedDay(date);
    if (blockedDay) return apiFail(res, 400, backendLabel("dateBlocked", resolveRequestLang(req)), "BLOCKED_DATE");
    const endTime = getEndTime(startTime);
    const validSlots = generateTimeSlots();
    if (!validSlots.includes(startTime)) return apiFail(res, 400, backendLabel("invalidTimeSlot", resolveRequestLang(req)), "INVALID_TIME");

    const slotKey = `${date}T${startTime}`;
    const newRescheduleCount = (row.rescheduleCount ?? 0) + 1;
    const nowIso = new Date().toISOString();

    const claimResult = await withBookingLock(bookingId, () =>
      withSlotLock(slotKey, async () => {
        const freshRow = await getAgendaById(bookingId);
        if (!freshRow || isCancelledStatus(freshRow.status)) return { error: "CANCELLED" as const };
        const booked = await isSlotBooked(date, startTime);
        if (booked) return { error: "SLOT_TAKEN" as const };
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
      })
    );
    if (claimResult.error === "CANCELLED") return apiFail(res, 400, backendLabel("alreadyCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");
    if (claimResult.error === "SLOT_TAKEN") return apiFail(res, 409, backendLabel("slotAlreadyBooked", resolveRequestLang(req)), "SLOT_TAKEN");

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
    logger.info(`[admin] Booking ${bookingId} rescheduled to ${date} ${startTime}`, "admin");
    return apiOk(res, { date, startTime, endTime, status: "rescheduled" });
  }));

  app.post("/api/admin/agenda/:bookingId/cancel", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("alreadyCancelled", resolveRequestLang(req)), "ALREADY_CANCELLED");

    const cancelResult = await withBookingLock(bookingId, async () => {
      const freshRow = await getAgendaById(bookingId);
      if (!freshRow || isCancelledStatus(freshRow.status)) return { error: true as const, row: null };
      const cancelledAt = new Date().toISOString();
      await updateAgenda(bookingId, { status: AGENDA_STATUSES.CANCELLED, cancelledAt });
      return { error: false as const, row: freshRow };
    });
    if (cancelResult.error) return apiFail(res, 400, backendLabel("alreadyCancelled", resolveRequestLang(req)), "ALREADY_CANCELLED");
    const confirmedRow = cancelResult.row!;

    if (confirmedRow.meetingDate && confirmedRow.startTime && confirmedRow.email) {
      cancelReminderTimer(confirmedRow.meetingDate, confirmedRow.startTime, confirmedRow.email);
    }
    if (confirmedRow.googleMeetEventId) {
      deleteGoogleMeetEvent(confirmedRow.googleMeetEventId).catch(err =>
        logger.error("Google Meet delete on admin cancel failed", "admin", err)
      );
    }

    sendCancellationEmail({
      clientName: confirmedRow.name || "",
      clientEmail: confirmedRow.email || "",
      date: confirmedRow.meetingDate || "",
      startTime: confirmedRow.startTime || "",
      endTime: confirmedRow.endTime || "",
      language: confirmedRow.language || null,
    }).catch(err => logger.error("Admin cancellation email failed:", "admin", err));

    notifyBookingCancelled({
      bookingId,
      name: confirmedRow.name || "",
      email: confirmedRow.email || "",
      phone: confirmedRow.phone,
      date: confirmedRow.meetingDate,
      startTime: confirmedRow.startTime,
      endTime: confirmedRow.endTime,
      language: confirmedRow.language,
      source: "admin",
    });
    logger.info(`[admin] Booking ${bookingId} cancelled`, "admin");
    return apiOk(res, { status: "cancelled" });
  }));

  app.post("/api/admin/agenda/:bookingId/no-show", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
    const row = await getAgendaById(bookingId);
    if (!row) return apiNotFound(res, "Reserva no encontrada");
    if (row.status === "no_show") return apiFail(res, 400, backendLabel("alreadyMarkedNoShow", resolveRequestLang(req)), "ALREADY_NO_SHOW");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("cannotMarkNoShowCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");

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
    logger.info(`[admin] Booking ${bookingId} marked as no-show`, "admin");
    return apiOk(res, { status: "no_show" });
  }));

  app.post("/api/admin/agenda/:bookingId/send-noshow", adminAuth, asyncHandler(async (req, res) => {
    const bookingId = String(req.params.bookingId || "");
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
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
    if (!bookingId || bookingId.length > 100) return apiFail(res, 400, backendLabel("invalidInput", resolveRequestLang(req)), "INVALID_ID");
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

  app.get("/api/admin/seo/snapshots", adminAuth, asyncHandler(async (req, res) => {
    const weeks = Math.max(1, Math.min(52, Number(req.query.weeks) || 12));
    const dir = process.env.SEO_RANKINGS_DIR
      ? path.resolve(process.env.SEO_RANKINGS_DIR)
      : path.resolve(process.cwd(), "seo-rankings");
    if (!fs.existsSync(dir)) {
      return apiOk(res, { dates: [], series: [], message: "no snapshots directory" });
    }
    const files = fs.readdirSync(dir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.csv$/.test(f))
      .sort();
    const recent = files.slice(-weeks);
    const dates = recent.map((f) => f.replace(/\.csv$/, ""));

    type Point = { date: string; position: number; impressions: number; clicks: number; hasData: boolean };
    type Key = string;
    const seriesMap = new Map<Key, {
      slug: string; lang: string; keyword: string; pageUrl: string; points: Point[];
    }>();

    for (const file of recent) {
      const date = file.replace(/\.csv$/, "");
      const text = fs.readFileSync(path.join(dir, file), "utf8");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) continue;
      const header = splitCsvLine(lines[0]);
      const idx = {
        slug: header.indexOf("slug"),
        lang: header.indexOf("lang"),
        keyword: header.indexOf("keyword"),
        pageUrl: header.indexOf("page_url"),
        impressions: header.indexOf("impressions"),
        clicks: header.indexOf("clicks"),
        position: header.indexOf("position"),
        hasData: header.indexOf("has_data"),
      };
      for (let i = 1; i < lines.length; i++) {
        const cols = splitCsvLine(lines[i]);
        const slug = cols[idx.slug] ?? "";
        const lang = cols[idx.lang] ?? "";
        if (!slug || !lang) continue;
        const key = `${slug}::${lang}`;
        let entry = seriesMap.get(key);
        if (!entry) {
          entry = {
            slug, lang,
            keyword: cols[idx.keyword] ?? "",
            pageUrl: cols[idx.pageUrl] ?? "",
            points: [],
          };
          seriesMap.set(key, entry);
        }
        entry.keyword = cols[idx.keyword] ?? entry.keyword;
        entry.pageUrl = cols[idx.pageUrl] ?? entry.pageUrl;
        entry.points.push({
          date,
          position: Number(cols[idx.position] ?? 0),
          impressions: Number(cols[idx.impressions] ?? 0),
          clicks: Number(cols[idx.clicks] ?? 0),
          hasData: cols[idx.hasData] === "1",
        });
      }
    }

    const series = Array.from(seriesMap.values()).map((s) => {
      const dataPoints = s.points.filter((p) => p.hasData && p.position > 0);
      const latest = dataPoints.at(-1) ?? null;
      const previous = dataPoints.length >= 2 ? dataPoints.at(-2) ?? null : null;
      const first = dataPoints[0] ?? null;
      const delta = latest && first ? latest.position - first.position : null;
      return { ...s, latest, previous, delta };
    });

    return apiOk(res, { dates, series });
  }));
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
