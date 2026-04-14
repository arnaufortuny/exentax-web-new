import type { Express } from "express";
import { logger } from "../logger";
import { z } from "zod";
import crypto from "crypto";
import { withTransaction } from "../db";
import { eq } from "drizzle-orm";
import * as schema from "../../shared/schema";

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
import {
  generateId, getAllDiasBloqueados, getDiaBloqueado, getBookedSlots, isSlotBooked,
  hasExistingBooking, insertAgenda, insertLead,
  insertVisita,
  upsertNewsletterSubscriber,
  getAgendaByIdAndToken, updateAgenda,
  findNewsletterByUnsubToken, updateNewsletterSuscriptor,
  insertConsentLog,
} from "../storage";
import { encryptField } from "../field-encryption";
import { sendBookingConfirmation, sendRescheduleConfirmation, sendCancellationEmail, sendCalculatorEmail } from "../email";
import { LEAD_SOURCES, DEFAULT_TIMEZONE, todayMadridISO, nowMadrid, SUPPORTED_LANGS, AGENDA_STATUSES, isCancelledStatus } from "../server-constants";
import { SITE_URL } from "../email-layout";
import { PAGE_META } from "../seo-content";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "../google-meet";
import {
  generateTimeSlots, getEndTime, isWeekday, scheduleReminderEmail, cancelReminderTimer, sanitizeInput,
  checkBookingRateLimit, checkCalcRateLimit, checkPublicDataRateLimit, checkVisitorRateLimit,
  checkNewsletterRateLimit, isNewVisitor, isBotVisitor, getClientIp, withSlotLock,
  asyncHandler, PHONE_MAX_LENGTH, isValidPhone, ISO_DATE_RE, isValidISODate,
} from "../route-helpers";
import { getAppSettings, backendLabel, resolveRequestLang } from "./shared";
import { BLOG_POSTS } from "../../client/src/data/blog-posts";
import { getTranslatedSlug } from "../../client/src/data/blog-posts-slugs";
import { apiFail, apiOk, apiRateLimited, apiNotFound, apiValidationFail } from "./api-response";
import {
  notifyBookingCreated, notifyBookingRescheduled, notifyBookingCancelled,
  notifyCalculatorLead, notifyNewsletterSubscribe,
} from "../discord";

let sitemapCache: { xml: string; generatedAt: number } | null = null;
const SITEMAP_CACHE_TTL = 3600_000;

let robotsCache: string | null = null;

// Cached privacy policy version (TTL: 10 min) — avoids a DB hit per consent log insertion
let _privacyVersionCache: string | null = null;
let _privacyVersionExpiry = 0;
async function getCachedPrivacyVersion(): Promise<string> {
  if (_privacyVersionCache && Date.now() < _privacyVersionExpiry) return _privacyVersionCache;
  try {
    const { getActiveLegalDocVersion } = await import("../storage/legal");
    const doc = await getActiveLegalDocVersion("privacy");
    _privacyVersionCache = doc?.version || "1.0";
  } catch { _privacyVersionCache = "1.0"; }
  _privacyVersionExpiry = Date.now() + 10 * 60_000;
  return _privacyVersionCache;
}

function logConsent(entry: Parameters<typeof insertConsentLog>[0]): void {
  insertConsentLog(entry).catch((err) =>
    logger.error(`Consent log failed [${entry.formType}]: ${err instanceof Error ? err.message : String(err)}`, "consent")
  );
}

export function registerPublicRoutes(app: Express, activeIntervals?: ReturnType<typeof setInterval>[]) {

  app.get("/api/bookings/blocked-days", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const rows = await getAllDiasBloqueados();
    return apiOk(res, { data: rows.map(r => r.date).filter(Boolean) });
  }));

  app.get("/api/bookings/config", async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const settings = getAppSettings();
    return apiOk(res, {
      priceEnabled: settings.bookingPriceEnabled,
      priceUSD: settings.consultationPriceUSD,
      priceCurrency: settings.consultationPriceCurrency || "EUR",
    });
  });

  const slotsQuerySchema = z.object({
    date: z.string().regex(ISO_DATE_RE, "zodInvalidDateFormat").refine(isValidISODate, "zodInvalidDate"),
  }).strict();

  app.get("/api/bookings/available-slots", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const parsed = slotsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return apiValidationFail(res, parsed.error);
    }
    const { date } = parsed.data;

    if (!isWeekday(date)) {
      return apiOk(res, { date, slots: [] });
    }

    const madridNow = nowMadrid();
    const todayStr = `${madridNow.getFullYear()}-${String(madridNow.getMonth() + 1).padStart(2, "0")}-${String(madridNow.getDate()).padStart(2, "0")}`;

    if (date < todayStr) {
      return apiOk(res, { date, slots: [] });
    }

    const [blockedDay, alreadyBooked] = await Promise.all([
      getDiaBloqueado(date),
      getBookedSlots(date),
    ]);

    if (blockedDay) {
      return apiOk(res, { date, slots: [], blocked: true });
    }

    const allSlots = generateTimeSlots();

    let nowHour = -1;
    let nowMin = -1;
    if (date === todayStr) {
      nowHour = madridNow.getHours();
      nowMin = madridNow.getMinutes();
    }

    const availableSlots = allSlots.filter((slot) => {
      if (alreadyBooked.has(slot)) return false;
      if (date === todayStr) {
        const [h, m] = slot.split(":").map(Number);
        if (h < nowHour || (h === nowHour && m <= nowMin)) return false;
      }
      return true;
    });

    return apiOk(res, { date, slots: availableSlots });
  }));

  const bookingRequestSchema = z.object({
    name: z.string().min(2, "zodNameTooShort").max(100, "zodNameTooLong").transform(sanitizeInput),
    lastName: z.string().max(100, "zodLastNameTooLong").transform(sanitizeInput).optional().default(""),
    email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong"),
    phone: z.string().max(PHONE_MAX_LENGTH, "zodPhoneTooLong").refine(isValidPhone, "zodPhoneMinDigits"),
    notes: z.string().max(1000, "zodNotesTooLong").transform(sanitizeInput).optional().nullable(),
    context: z.string().max(500, "zodContextTooLong").transform(sanitizeInput).optional().nullable(),
    activity: z.string().max(200, "zodActivityTooLong").transform(sanitizeInput).optional().nullable(),
    date: z.string().regex(ISO_DATE_RE, "zodInvalidDateShort").refine(isValidISODate, "zodInvalidDate"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "zodInvalidTimeFormat"),
    monthlyProfit: z.string().min(1, "zodMonthlyProfitRequired").max(100).transform(sanitizeInput),
    globalClients: z.boolean().optional().default(false),
    digitalOperation: z.boolean().optional().default(false),
    shareNote: z.string().max(2000, "zodNoteTooLong").transform(sanitizeInput).optional().default(""),
    attendanceCommitment: z.literal(true, { message: "zodMustCommitAttendance" }),
    privacyAccepted: z.boolean().refine(val => val === true, "zodMustAcceptPrivacy"),
    marketingAccepted: z.boolean().optional().default(false),
    language: z.string().max(10).optional().nullable(),
  }).strict();

  app.post("/api/bookings/book", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingRateLimit(ip))) {
      return apiRateLimited(res, "tooManyBookings");
    }

    const parsed = bookingRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return apiValidationFail(res, parsed.error);
    }

    const { name, lastName, date, startTime, notes, context, activity, monthlyProfit, globalClients, digitalOperation, shareNote, privacyAccepted, marketingAccepted, language } = parsed.data;
    const email = parsed.data.email.trim().toLowerCase();
    const phone = parsed.data.phone;

    if (!isWeekday(date)) {
      return apiFail(res, 400, backendLabel("weekdaysOnly", resolveRequestLang(req)), "INVALID_DATE");
    }

    const validSlots = generateTimeSlots();
    if (!validSlots.includes(startTime)) {
      return apiFail(res, 400, backendLabel("invalidTimeSlot", resolveRequestLang(req)), "INVALID_TIME");
    }

    const madridNow = nowMadrid();
    const todayMadridStr = `${madridNow.getFullYear()}-${String(madridNow.getMonth() + 1).padStart(2, "0")}-${String(madridNow.getDate()).padStart(2, "0")}`;
    if (date < todayMadridStr) {
      return apiFail(res, 400, backendLabel("cannotBookPastDate", resolveRequestLang(req)), "INVALID_DATE");
    }

    const blockedDayCheck = await getDiaBloqueado(date);
    if (blockedDayCheck) {
      return apiFail(res, 400, backendLabel("dayNotAvailable", resolveRequestLang(req)), "DAY_BLOCKED");
    }

    const slotKey = `${date}T${startTime}`;
    const result = await withSlotLock(slotKey, async () => {
        if (await isSlotBooked(date, startTime)) {
          return { error: true as const, status: 409 as const, message: backendLabel("slotAlreadyBooked", resolveRequestLang(req)), code: "SLOT_TAKEN" };
        }

        if (await hasExistingBooking(email)) {
          return { error: true as const, status: 409 as const, message: backendLabel("duplicateBooking", resolveRequestLang(req)), code: "DUPLICATE_BOOKING" };
        }

        const endTime = getEndTime(startTime);

        let meetLink: string | null = null;
        let meetEventId: string | null = null;
        try {
          const meetResult = await createGoogleMeetEvent({
            clientName: name,
            clientEmail: email,
            date,
            startTime,
            endTime,
            notes: notes || undefined,
            language: language || undefined,
          });
          if (meetResult) {
            meetLink = meetResult.meetLink;
            meetEventId = meetResult.eventId;
          }
        } catch (err) {
          logger.error("Google Meet creation failed:", "app", err);
        }

        const bookingLeadId = generateId("LEAD");
        const manageToken = crypto.randomBytes(24).toString("hex");
        const manageUrl = `${SITE_URL}/booking/${bookingLeadId}?token=${manageToken}`;

        await withTransaction(async (tx) => {
          await insertAgenda({
            id: bookingLeadId,
            name,
            email,
            phone,
            meetingDate: date,
            startTime: startTime,
            endTime: endTime,
            googleMeet: meetLink,
            googleMeetEventId: meetEventId,
            notes: notes || null,
            context: context || null,
            ip,
            privacy: privacyAccepted,
            marketing: marketingAccepted,
            monthlyProfit,
            globalClients: globalClients ? "Sí" : "No",
            digitalOperation: digitalOperation ? "Sí" : "No",
            shareNote,
            attendanceCommitment: "Sí",
            manageToken,
            bookingDate: todayMadridISO(),
            language: language || null,
          }, tx);

          await insertLead({
            id: bookingLeadId,
            firstName: name,
            lastName: lastName || "",
            email,
            phone,
            source: LEAD_SOURCES.BOOKING_WEB,
            usedCalculator: false,
            scheduledCall: true,
            privacyAccepted: privacyAccepted,
            termsAccepted: privacyAccepted,
            marketingAccepted: marketingAccepted,
            consentDateTime: new Date().toISOString(),
            closed: false,
            amount: (() => { const s = getAppSettings(); return s.bookingPriceEnabled ? String(s.consultationPriceUSD) : "0"; })(),
            economicActivity: activity || null,
            ip,
            date: todayMadridISO(),
          }, tx);

        });

        sendBookingConfirmation({
          clientName: name,
          clientEmail: email,
          phone,
          date,
          startTime,
          endTime,
          meetLink,
          notes: notes || null,
          context: context || null,
          clientIp: ip,
          privacyAccepted,
          marketingAccepted,
          beneficioMensual: monthlyProfit,
          clientesMundiales: globalClients,
          operaDigital: digitalOperation,
          notaCompartir: shareNote,
          manageUrl,
          language,
          agendaId: bookingLeadId,
        }).catch((err) => logger.error("Email send failed:", "app", err));

        scheduleReminderEmail({
          clientName: name,
          clientEmail: email,
          date,
          startTime,
          endTime,
          meetLink,
          manageUrl,
          language,
          agendaId: bookingLeadId,
        });

        notifyBookingCreated({ bookingId: bookingLeadId, name, email, phone, date, startTime, endTime, meetLink, language, ip });
        getCachedPrivacyVersion().then(privacyVersion =>
          logConsent({ formType: "booking", email, privacyAccepted: privacyAccepted, marketingAccepted: marketingAccepted, language: language || null, source: "/agendar-asesoria", privacyVersion, ip })
        ).catch(() => {});
        return { error: false as const, date, startTime, endTime, meetLink, status: "confirmed" };
      });

    if (result.error) return apiFail(res, result.status, result.message, result.code);
    return apiOk(res, { date: result.date, startTime: result.startTime, endTime: result.endTime, meetLink: result.meetLink, status: result.status }, 201);
  }));

  app.get("/api/booking/:bookingId", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const meetingDate = row.meetingDate ? new Date(row.meetingDate + "T12:00:00") : null;
    const isPast = meetingDate ? meetingDate < today : false;
    return apiOk(res, {
      id: row.id,
      nombre: row.name || "",
      fecha: row.meetingDate || "",
      horaInicio: row.startTime || "",
      horaFin: row.endTime || "",
      googleMeet: row.googleMeet || null,
      estado: row.status || "Pendiente",
      isPast,
    });
  }));

  app.post("/api/booking/:bookingId/reschedule", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("cannotRescheduleCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");
    if (row.meetingDate) {
      const madridNowCheck = nowMadrid();
      const todayCheck = `${madridNowCheck.getFullYear()}-${String(madridNowCheck.getMonth() + 1).padStart(2, "0")}-${String(madridNowCheck.getDate()).padStart(2, "0")}`;
      if (row.meetingDate < todayCheck) return apiFail(res, 400, backendLabel("cannotReschedulePast", resolveRequestLang(req)), "PAST_BOOKING");
      if (row.meetingDate === todayCheck && row.endTime) {
        const nowH = madridNowCheck.getHours();
        const nowM = madridNowCheck.getMinutes();
        const [endH, endM] = row.endTime.split(":").map(Number);
        if (endH < nowH || (endH === nowH && endM <= nowM)) return apiFail(res, 400, backendLabel("cannotReschedulePast", resolveRequestLang(req)), "PAST_BOOKING");
      }
    }
    const schema = z.object({
      date: z.string().regex(ISO_DATE_RE, "zodInvalidDate").refine(isValidISODate, "zodInvalidDate"),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, "zodInvalidTime"),
    }).strict();
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { date, startTime } = parsed.data;
    if (!isWeekday(date)) return apiFail(res, 400, backendLabel("weekdaysOnly", resolveRequestLang(req)), "INVALID_DATE");
    const madridNow = nowMadrid();
    const todayStr = `${madridNow.getFullYear()}-${String(madridNow.getMonth() + 1).padStart(2, "0")}-${String(madridNow.getDate()).padStart(2, "0")}`;
    if (date < todayStr) return apiFail(res, 400, backendLabel("cannotReschedulePastDate", resolveRequestLang(req)), "PAST_DATE");
    const blockedDay = await getDiaBloqueado(date);
    if (blockedDay) return apiFail(res, 400, backendLabel("dateBlocked", resolveRequestLang(req)), "BLOCKED_DATE");
    const validSlots = generateTimeSlots();
    if (!validSlots.includes(startTime)) return apiFail(res, 400, backendLabel("invalidTimeSlotShort", resolveRequestLang(req)), "INVALID_TIME");
    if (date === todayStr) {
      const [h, m] = startTime.split(":").map(Number);
      if (h < madridNow.getHours() || (h === madridNow.getHours() && m <= madridNow.getMinutes())) {
        return apiFail(res, 400, backendLabel("cannotReschedulePastTime", resolveRequestLang(req)), "PAST_TIME");
      }
    }
    const endTime = getEndTime(startTime);
    const slotKey = `${date}T${startTime}`;
    const slotResult = await withSlotLock(slotKey, async () => {
      const booked = await isSlotBooked(date, startTime);
      if (booked) return { error: true as const };
      await updateAgenda(bookingId, {
        meetingDate: date,
        startTime,
        endTime,
        status: AGENDA_STATUSES.REAGENDADA,
        googleMeet: null,
        googleMeetEventId: null,
      });
      return { error: false as const };
    });
    if (slotResult.error) return apiFail(res, 409, backendLabel("slotAlreadyBooked", resolveRequestLang(req)), "SLOT_TAKEN");

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
      logger.error("Google Meet create on reschedule failed:", "app", err);
    }

    if (oldMeetEventId) {
      deleteGoogleMeetEvent(oldMeetEventId).catch(err =>
        logger.error("Google Meet delete on reschedule failed", "app", err)
      );
    }

    await updateAgenda(bookingId, {
      googleMeet: newMeetLink,
      googleMeetEventId: newEventId,
    });

    const manageUrl = `${SITE_URL}/booking/${bookingId}?token=${token}`;
    sendRescheduleConfirmation({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date,
      startTime,
      endTime,
      meetLink: newMeetLink,
      manageUrl,
      language: row.language || null,
    }).catch((err) => logger.error("Reschedule email failed:", "email", err));
    scheduleReminderEmail({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date,
      startTime,
      endTime,
      meetLink: newMeetLink,
      manageUrl,
      language: row.language || null,
      agendaId: bookingId,
    });
    notifyBookingRescheduled({ bookingId, name: row.name || "", email: row.email || "", oldDate: row.meetingDate, oldStartTime: row.startTime, newDate: date, newStartTime: startTime, newEndTime: endTime, language: row.language });
    return apiOk(res, { date, startTime, endTime, status: "rescheduled" });
  }));

  app.post("/api/booking/:bookingId/cancel", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("alreadyCancelled", resolveRequestLang(req)), "ALREADY_CANCELLED");
    if (row.meetingDate) {
      const madridNowCancel = nowMadrid();
      const todayCancel = `${madridNowCancel.getFullYear()}-${String(madridNowCancel.getMonth() + 1).padStart(2, "0")}-${String(madridNowCancel.getDate()).padStart(2, "0")}`;
      if (row.meetingDate < todayCancel) return apiFail(res, 400, backendLabel("cannotCancelPast", resolveRequestLang(req)), "PAST_BOOKING");
      if (row.meetingDate === todayCancel && row.endTime) {
        const nowH = madridNowCancel.getHours();
        const nowM = madridNowCancel.getMinutes();
        const [endH, endM] = row.endTime.split(":").map(Number);
        if (endH < nowH || (endH === nowH && endM <= nowM)) return apiFail(res, 400, backendLabel("cannotCancelPast", resolveRequestLang(req)), "PAST_BOOKING");
      }
    }
    await updateAgenda(bookingId, { status: AGENDA_STATUSES.CANCELADA });
    if (row.meetingDate && row.startTime && row.email) {
      cancelReminderTimer(row.meetingDate, row.startTime, row.email);
    }
    if (row.googleMeetEventId) {
      deleteGoogleMeetEvent(row.googleMeetEventId).catch(err =>
        logger.error("Google Meet delete on public cancel failed", "app", err)
      );
    }
    sendCancellationEmail({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date: row.meetingDate || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
      language: row.language || null,
    }).catch((err) => logger.error("Cancellation email failed:", "email", err));
    notifyBookingCancelled({ bookingId, name: row.name || "", email: row.email || "", date: row.meetingDate, startTime: row.startTime, language: row.language });
    return apiOk(res, { status: "cancelled" });
  }));

  const calculatorLeadSchema = z.object({
    email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong"),
    phone: z.string().max(PHONE_MAX_LENGTH, "zodPhoneTooLong").transform(sanitizeInput).refine(isValidPhone, "zodPhoneMinDigits"),
    country: z.string().max(100).transform(sanitizeInput),
    regime: z.string().max(100).transform(sanitizeInput),
    activity: z.string().max(100).transform(sanitizeInput),
    income: z.number().min(0).max(10_000_000),
    incomeMode: z.enum(["monthly", "annual"]).optional().default("monthly"),
    annualIncome: z.number().min(0).max(120_000_000).optional(),
    effectiveRate: z.number().min(0).max(100).optional(),
    ahorro: z.number().min(0).max(120_000_000),
    sinLLC: z.number().min(0).max(120_000_000),
    conLLC: z.number().min(0).max(120_000_000),
    localLabel: z.string().max(100).transform(sanitizeInput),
    breakdown: z.array(z.object({
      label: z.string().max(200).transform(sanitizeInput),
      amount: z.number(),
    })).max(20),
    deductibleExpenses: z.number().min(0).max(1_000_000).optional().default(0),
    calcSpainIrpf: z.boolean().optional().default(false),
    privacyAccepted: z.boolean().refine(val => val === true, "zodMustAcceptPrivacy"),
    marketingAccepted: z.boolean().optional().default(false),
    language: z.string().max(10).optional().nullable(),
  }).strict();

  app.post("/api/calculator-leads", asyncHandler(async (req, res) => {
    const calcIp = getClientIp(req);
    if (!(await checkCalcRateLimit(calcIp))) {
      return apiRateLimited(res, "tooManyRequestsWait");
    }

    const parsed = calculatorLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      return apiValidationFail(res, parsed.error);
    }

    const expectedAhorro = parsed.data.sinLLC - parsed.data.conLLC;
    if (Math.abs(parsed.data.ahorro - expectedAhorro) > 1) {
      logger.warn(`Ahorro mismatch: claimed=${parsed.data.ahorro}, expected=${expectedAhorro}`, "calculator");
      parsed.data.ahorro = Math.max(0, expectedAhorro);
    }

    if (parsed.data.sinLLC < parsed.data.conLLC) {
      logger.warn(`sinLLC < conLLC: sinLLC=${parsed.data.sinLLC}, conLLC=${parsed.data.conLLC}`, "calculator");
    }

    const calcLeadId = generateId("LEAD");

    sendCalculatorEmail({ ...parsed.data, clientIp: calcIp, leadId: calcLeadId }).catch((err) =>
      logger.error("Calculator email failed:", "app", err)
    );
    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const annualIncome = parsed.data.annualIncome || (parsed.data.incomeMode === "annual" ? parsed.data.income : parsed.data.income * 12);
    const monthlyIncome = parsed.data.incomeMode === "annual" ? Math.round(parsed.data.income / 12) : parsed.data.income;
    const breakdownStr = parsed.data.breakdown.map(b => `${b.label}: ${b.amount}€`).join(" | ");

    await withTransaction(async (tx) => {
      const [existingLead] = await tx.select().from(schema.leads).where(eq(schema.leads.email, normalizedEmail)).limit(1);
      if (existingLead) {
        const newPhone = parsed.data.phone;
          const phoneValue = newPhone ? encryptField(newPhone) : (existingLead.phone || "");
          await tx.update(schema.leads).set({
          usedCalculator: true,
          phone: phoneValue,
          privacyAccepted: parsed.data.privacyAccepted,
          marketingAccepted: parsed.data.marketingAccepted,
          economicActivity: parsed.data.activity || existingLead.economicActivity || null,
          estimatedProfit: Number.isFinite(annualIncome) ? String(annualIncome) : (existingLead.estimatedProfit || null),
          ip: calcIp,
          date: todayMadridISO(),
        }).where(eq(schema.leads.id, existingLead.id));
      } else {
        const calcPhone = parsed.data.phone || "";
          await tx.insert(schema.leads).values({
          id: calcLeadId,
          firstName: normalizedEmail.split("@")[0],
          email: normalizedEmail,
          phone: calcPhone ? encryptField(calcPhone) : "",
          source: LEAD_SOURCES.CALCULATOR,
          usedCalculator: true,
          scheduledCall: false,
          privacyAccepted: parsed.data.privacyAccepted,
          termsAccepted: parsed.data.privacyAccepted,
          marketingAccepted: parsed.data.marketingAccepted,
          closed: false,
          amount: null,
          economicActivity: parsed.data.activity || null,
          estimatedProfit: Number.isFinite(annualIncome) ? String(annualIncome) : null,
          ip: calcIp,
          date: todayMadridISO(),
        });
      }

      const calcPhoneForCalc = parsed.data.phone || "";
        await tx.insert(schema.calculadora).values({
        id: calcLeadId,
        email: normalizedEmail,
        phone: calcPhoneForCalc ? encryptField(calcPhoneForCalc) : "",
        country: parsed.data.country,
        regime: parsed.data.regime,
        activity: parsed.data.activity,
        monthlyIncome: String(monthlyIncome),
        annualIncome: String(annualIncome),
        currentTaxes: String(parsed.data.sinLLC),
        llcCost: String(parsed.data.conLLC),
        estimatedSavings: String(parsed.data.ahorro),
        effectiveRate: parsed.data.effectiveRate ? `${parsed.data.effectiveRate}%` : "",
        deductibleExpenses: String(parsed.data.deductibleExpenses || 0),
        irpfSimulation: parsed.data.calcSpainIrpf ? "Sí" : "No",
        breakdown: breakdownStr,
        privacy: parsed.data.privacyAccepted,
        marketing: parsed.data.marketingAccepted,
        ip: calcIp,
        date: todayMadridISO(),
      });
    }).catch((err) => {
      logger.error("Calculator lead+row transaction failed:", "db", err);
      throw err;
    });

    if (parsed.data.marketingAccepted) {
      upsertNewsletterSubscriber(
        normalizedEmail,
        parsed.data.email,
        "calculadora",
        ["fiscalidad", "llc"]
      ).catch((err) => logger.error("calculator subscribe error:", "newsletter", err));
    }

    notifyCalculatorLead({ leadId: calcLeadId, email: normalizedEmail, country: parsed.data.country, regime: parsed.data.regime, ahorro: parsed.data.ahorro, annualIncome, language: parsed.data.language, ip: calcIp });
    getCachedPrivacyVersion().then(privacyVersion =>
      logConsent({ formType: "calculator", email: normalizedEmail, privacyAccepted: parsed.data.privacyAccepted, marketingAccepted: parsed.data.marketingAccepted, language: parsed.data.language || null, source: "/calculadora", privacyVersion, ip: calcIp })
    ).catch(() => {});
    return apiOk(res);
  }));

  // Cookie banner consent log — anonymous, no email required
  const cookieConsentSchema = z.object({
    tipo: z.string().max(60),
    aceptado: z.boolean(),
    version: z.string().max(20).optional(),
    idioma: z.string().max(10).optional(),
    referrer: z.string().max(200).optional(),
  }).strict();

  app.post("/api/consent", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    const parsed = cookieConsentSchema.safeParse(req.body);
    if (!parsed.success) return apiOk(res); // silent — never block the client
    const { tipo, aceptado, version, idioma, referrer } = parsed.data;
    logConsent({
      formType: `cookies:${tipo}`,
      email: null,
      privacyAccepted: true, // user has seen the banner; essential cookies always accepted
      marketingAccepted: tipo === "cookies_analiticas" ? aceptado : null,
      language: idioma || null,
      source: referrer || null,
      privacyVersion: version || null,
      ip,
    });
    return apiOk(res);
  }));

  const newsletterSubscribeSchema = z.object({
    email: z.string().email().max(255),
    source: z.string().max(50).optional(),
    privacyAccepted: z.boolean(),
    marketingAccepted: z.boolean().optional().default(false),
    language: z.string().max(10).optional().nullable(),
  }).strict();

  app.post("/api/newsletter/subscribe", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkNewsletterRateLimit(ip))) return apiRateLimited(res);
    const parsed = newsletterSubscribeSchema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { email, source, privacyAccepted, marketingAccepted, language } = parsed.data;
    if (!privacyAccepted) return apiFail(res, 400, "Debes aceptar la política de privacidad para continuar.", "PRIVACY_REQUIRED");
    const normalizedEmail = email.trim().toLowerCase();
    await upsertNewsletterSubscriber(normalizedEmail, "", source || "footer", ["general"]);
    notifyNewsletterSubscribe({ email: normalizedEmail, source: source || "footer" });
    getCachedPrivacyVersion().then(privacyVersion =>
      logConsent({ formType: "newsletter_footer", email: normalizedEmail, privacyAccepted: true, marketingAccepted: marketingAccepted ?? false, language: language || null, source: source || "footer", privacyVersion, ip })
    ).catch(() => {});
    return apiOk(res, { subscribed: true });
  }));

  const visitorSchema = z.object({
    consent: z.enum(["all", "essential"]).optional(),
    page: z.string().max(200).optional(),
    referrer: z.string().max(500).optional(),
    language: z.string().max(10).optional(),
    screen: z.string().max(20).optional(),
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    sessionId: z.string().max(64).optional(),
  }).strict();

  app.post("/api/visitor", async (req, res) => {
    try {
      const parsed = visitorSchema.safeParse(req.body);
      if (!parsed.success) return apiOk(res);
      const b = parsed.data;
      const consent = b.consent;
      if (consent !== "all") {
        return apiOk(res);
      }
      if (isBotVisitor(req as any)) {
        return apiOk(res);
      }
      const ip = getClientIp(req);
      if (!(await checkVisitorRateLimit(ip))) return apiOk(res);
      if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
        return apiOk(res);
      }
      const ua = req.headers["user-agent"] || null;
      const page = b.page ? sanitizeInput(b.page) : null;
      const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : null);

      const timestamp = new Date().toLocaleString("es-ES", {
        timeZone: DEFAULT_TIMEZONE,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });

      const uaLower = (ua || "").toLowerCase();
      let dispositivo: string | null = null;
      if (/mobile|android|iphone|ipad|ipod/i.test(uaLower)) dispositivo = /ipad|tablet/i.test(uaLower) ? "tablet" : "mobile";
      else if (uaLower) dispositivo = "desktop";

      insertVisita({
        date: timestamp,
        ip,
        page,
        referrer: str(b.referrer, 500),
        userAgent: ua,
        language: str(b.language, 10),
        screen: str(b.screen, 20),
        utmSource: str(b.utm_source, 100),
        utmMedium: str(b.utm_medium, 100),
        utmCampaign: str(b.utm_campaign, 200),
        utmContent: str(b.utm_content, 200),
        country: null,
        device: dispositivo,
        sessionId: str(b.sessionId, 64),
      }).catch((err) =>
        logger.error("DB append failed:", "visitor", err)
      );

      if (isNewVisitor(ip)) {
        logger.info(`New visitor: ${ip}`, "visitor");
      }

      return apiOk(res);
    } catch (err) {
      logger.error("Visitor tracking error", "visitor", err);
      return apiOk(res);
    }
  });


  app.get("/api/legal/versions", asyncHandler(async (_req, res) => {
    const { getActiveVersionsByType } = await import("../storage/legal");
    const versions = await getActiveVersionsByType();
    const result: Record<string, { version: string; effectiveDate: string }> = {};
    for (const [key, val] of Object.entries(versions)) {
      result[key] = { version: val.version, effectiveDate: val.effectiveDate };
    }
    return apiOk(res, { versions: result });
  }));

  app.get("/sitemap.xml", (_req, res) => {
    try {
    if (sitemapCache && Date.now() - sitemapCache.generatedAt < SITEMAP_CACHE_TTL) {
      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.header("X-Cache", "HIT");
      return res.send(sitemapCache.xml);
    }

    const today = new Date().toISOString().slice(0, 10);
    const pages = [
      { loc: "/", priority: "1.0", changefreq: "weekly", lastmod: today },
      { loc: "/sobre-las-llc", priority: "0.9", changefreq: "monthly", lastmod: today },
      { loc: "/como-trabajamos", priority: "0.9", changefreq: "monthly", lastmod: today },
      { loc: "/servicios", priority: "0.9", changefreq: "monthly", lastmod: today },
      { loc: "/preguntas-frecuentes", priority: "0.8", changefreq: "monthly", lastmod: today },
      { loc: "/agendar-asesoria", priority: "0.8", changefreq: "weekly", lastmod: today },
      { loc: "/blog", priority: "0.8", changefreq: "weekly", lastmod: today },
      { loc: "/legal/terminos", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" },
      { loc: "/legal/privacidad", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" },
      { loc: "/legal/cookies", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" },
      { loc: "/legal/reembolsos", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" },
      { loc: "/legal/disclaimer", priority: "0.3", changefreq: "yearly", lastmod: "2026-03-01" },
    ];

    let urls = "";
    for (const page of pages) {
      const loc = page.loc === "/" ? "" : page.loc;
      const fullLoc = `${SITE_URL}${loc}`;
      urls += `  <url>\n    <loc>${fullLoc}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n`;
      for (const lang of SUPPORTED_LANGS) {
        const langLoc = loc ? `/${lang}${loc}` : `/${lang}`;
        urls += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${langLoc}" />\n`;
      }
      urls += `    <xhtml:link rel="alternate" hreflang="x-default" href="${fullLoc}" />\n`;
      urls += `  </url>\n`;
    }

    const allPosts = BLOG_POSTS;
    for (const post of allPosts) {
      const postSlug = post.slug;
      const lastmod = post.updatedAt || post.publishedAt;
      urls += `  <url>\n    <loc>${SITE_URL}/es/blog/${escapeXml(postSlug)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n`;
      if (lastmod) urls += `    <lastmod>${escapeXml(lastmod)}</lastmod>\n`;

      for (const lang of SUPPORTED_LANGS) {
        const translatedSlug = getTranslatedSlug(postSlug, lang);
        if (translatedSlug && translatedSlug !== postSlug) {
          urls += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}/blog/${escapeXml(translatedSlug)}" />\n`;
        } else {
          urls += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}/${lang}/blog/${escapeXml(postSlug)}" />\n`;
        }
      }
      urls += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/es/blog/${escapeXml(postSlug)}" />\n`;
      urls += `  </url>\n`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}</urlset>`;

    sitemapCache = { xml, generatedAt: Date.now() };

    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.header("X-Cache", "MISS");
    return res.send(xml);
    } catch (err) {
      logger.error("Sitemap generation error:", "seo", err);
      return res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    try {
    if (robotsCache) {
      res.header("Content-Type", "text/plain");
      res.header("Cache-Control", "public, max-age=86400");
      return res.send(robotsCache);
    }

    robotsCache = [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /api/",
      "Disallow: /links",
      "Disallow: /start",
      "Disallow: /booking/",
      "",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "public, max-age=86400");
    return res.send(robotsCache);
    } catch (err) {
      logger.error("Robots.txt error:", "seo", err);
      return res.status(500).send("Error generating robots.txt");
    }
  });

  app.get("/api/seo/page-meta", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const { page } = req.query;
    if (!page || typeof page !== "string") return apiOk(res);
    const meta = PAGE_META[page] || {};
    return apiOk(res, meta as any);
  }));

  app.get("/api/newsletter/unsubscribe/:token", asyncHandler(async (req, res) => {
    const token = (req.params.token as string || "").trim();
    const lang = resolveRequestLang(req);
    if (!token || token.length > 200) {
      return res.status(400).send(unsubscribeHtml(backendLabel("unsubError", lang), backendLabel("unsubInvalidLink", lang), lang));
    }
    const subscriber = await findNewsletterByUnsubToken(token);
    if (!subscriber) {
      return res.status(200).send(unsubscribeHtml(backendLabel("unsubAlreadyTitle", lang), backendLabel("unsubAlreadyMsg", lang), lang));
    }
    await updateNewsletterSuscriptor(subscriber.id, { unsubscribedAt: new Date().toISOString() });
    logger.info(`Newsletter unsubscribe: ${subscriber.email}`, "newsletter");
    return res.status(200).send(unsubscribeHtml(backendLabel("unsubSuccessTitle", lang), backendLabel("unsubSuccessMsg", lang), lang));
  }));

}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function unsubscribeHtml(title: string, message: string, lang = "es"): string {
  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeLang = /^[a-z]{2}$/.test(lang) ? lang : "es";
  return `<!DOCTYPE html><html lang="${safeLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle} — Exentax</title>
<style>body{font-family:Inter,system-ui,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#F7F6F2;color:#0B0D0C}
.card{text-align:center;padding:48px 32px;max-width:400px;border-radius:16px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.06)}
h1{font-size:20px;margin:0 0 12px}p{font-size:15px;color:#6B7280;margin:0}</style></head>
<body><div class="card"><h1>${safeTitle}</h1><p>${safeMessage}</p></div></body></html>`;
}
