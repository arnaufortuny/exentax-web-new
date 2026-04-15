import { sendReminderEmail } from "./email";
import { logger } from "./logger";
import { AGENDA_STATUSES, DEFAULT_TIMEZONE, isCancelledStatus } from "./server-constants";
import { normalizeEmail } from "./storage/core";
import type { Request, Response, NextFunction } from "express";

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function getClientIp(req: Request): string {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

const BUSINESS_HOURS_START = 8;
const BUSINESS_HOURS_END = 20;
const SLOT_DURATION_MINUTES = 30;

const _cachedTimeSlots: string[] = [];
for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
  _cachedTimeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
  _cachedTimeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
}
Object.freeze(_cachedTimeSlots);

export function generateTimeSlots(): string[] {
  return _cachedTimeSlots;
}

export function getEndTime(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + SLOT_DURATION_MINUTES;
  const endH = Math.floor(totalMin / 60);
  const endM = totalMin % 60;
  return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
}

export function isWeekday(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

function getMeetingTimestampMs(date: string, startTime: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, min] = startTime.split(":").map(Number);
  const utcNoon = Date.UTC(year, month - 1, day, 12, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: DEFAULT_TIMEZONE,
    hour: "numeric", minute: "numeric", hour12: false,
  });
  const madridNoonParts = formatter.format(new Date(utcNoon)).split(":");
  const madridNoonH = parseInt(madridNoonParts[0], 10) || 12;
  const offsetHours = madridNoonH - 12;
  return Date.UTC(year, month - 1, day, hour - offsetHours, min);
}

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleReminderEmail(data: {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  manageUrl?: string | null;
  language?: string | null;
  agendaId?: string | null;
}) {
  const meetingMs = getMeetingTimestampMs(data.date, data.startTime);
  const reminderMs = meetingMs - 3 * 60 * 60 * 1000;
  const delay = reminderMs - Date.now();

  if (delay <= 0) {
    logger.info(`Meeting in less than 3h — skipping reminder for ${data.clientEmail}`, "reminder");
    return;
  }

  const MAX_TIMEOUT = 2_147_483_647;
  if (delay > MAX_TIMEOUT) {
    logger.info(`Delay too large (${Math.round(delay / 86_400_000)}d) — will be picked up by cron checker for ${data.clientEmail}`, "reminder");
    return;
  }

  const timerKey = `${data.date}_${data.startTime}_${normalizeEmail(data.clientEmail)}`;
  if (activeTimers.has(timerKey)) {
    clearTimeout(activeTimers.get(timerKey)!);
  }

  const reminderAt = new Date(reminderMs).toISOString();
  logger.info(`Scheduled for ${reminderAt} → ${data.clientEmail}`, "reminder");

  const timer = setTimeout(async () => {
    activeTimers.delete(timerKey);
    try {
      if (data.agendaId) {
        const { getAgendaById } = await import("./storage");
        const current = await getAgendaById(data.agendaId);
        if (!current || isCancelledStatus(current.status) || current.status === AGENDA_STATUSES.NO_SHOW) {
          logger.info(`Skipping reminder — booking ${data.agendaId} is ${current?.status ?? "deleted"}`, "reminder");
          return;
        }
        if (current.meetingDate !== data.date || current.startTime !== data.startTime) {
          logger.info(`Skipping reminder — booking ${data.agendaId} was rescheduled (${data.date} ${data.startTime} → ${current.meetingDate} ${current.startTime})`, "reminder");
          return;
        }
      }
      await sendReminderEmail(data);
      if (data.agendaId) {
        const { markReminderSent } = await import("./storage");
        await markReminderSent(data.agendaId);
      }
    } catch (err) {
      logger.error("Failed to send:", "reminder", err);
    }
  }, delay);
  activeTimers.set(timerKey, timer);
}

export function cancelReminderTimer(date: string, startTime: string, email: string) {
  const timerKey = `${date}_${startTime}_${normalizeEmail(email)}`;
  if (activeTimers.has(timerKey)) {
    clearTimeout(activeTimers.get(timerKey)!);
    activeTimers.delete(timerKey);
    logger.info(`Cancelled reminder for ${timerKey}`, "reminder");
  }
}

export { getMeetingTimestampMs };

/**
 * Trims whitespace from input strings. HTML entity escaping is handled
 * globally by autoSanitizeMiddleware (for JSON bodies). Do NOT rely on this
 * function for HTML escaping — use output encoding at render sinks instead.
 */
export function sanitizeInput(str: string): string {
  return str.trim();
}

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidISODate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

export const PHONE_MAX_LENGTH = 30;
export const PHONE_MIN_DIGITS = 7;

export function isValidPhone(val: string): boolean {
  if (val.length > PHONE_MAX_LENGTH) return false;
  const digits = val.replace(/\D/g, "");
  return digits.length >= PHONE_MIN_DIGITS && digits.length <= 15;
}

import { getRateLimitStore, type RateLimitStore } from "./rate-limit-store";

let _rlStore: RateLimitStore | null = null;
getRateLimitStore().then(s => { _rlStore = s; }).catch(err => {
  logger.warn(`[rate-limit] Route-level store init failed, using in-memory fallback: ${err instanceof Error ? err.message : String(err)}`, "rate-limit");
});

interface RateLimiter {
  check(key: string): Promise<boolean>;
  cleanup(): void;
}

const MAX_RL_ENTRIES = 10_000;

function localCheck(map: Map<string, { count: number; resetAt: number }>, key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    if (map.size > MAX_RL_ENTRIES) {
      let removed = 0;
      const overflow = map.size - MAX_RL_ENTRIES;
      for (const mapKey of map.keys()) {
        if (removed >= overflow) break;
        map.delete(mapKey);
        removed++;
      }
    }
    return true;
  }
  entry.count++;
  return entry.count <= maxRequests;
}

function createRateLimiter(name: string, maxRequests: number, windowMs: number): RateLimiter {
  const fallbackMap = new Map<string, { count: number; resetAt: number }>();

  return {
    async check(key: string): Promise<boolean> {
      if (_rlStore) {
        try {
          return await _rlStore.check(name, key, maxRequests, windowMs);
        } catch {
          return localCheck(fallbackMap, key, maxRequests, windowMs);
        }
      }
      return localCheck(fallbackMap, key, maxRequests, windowMs);
    },
    cleanup() {
      const now = Date.now();
      for (const [k, entry] of fallbackMap.entries()) {
        if (now > entry.resetAt) fallbackMap.delete(k);
      }
      if (_rlStore) _rlStore.cleanup().catch(err => {
        logger.warn(`[rate-limit] Endpoint store cleanup failed: ${err instanceof Error ? err.message : String(err)}`, "rate-limit");
      });
    },
  };
}

const allRateLimiters: RateLimiter[] = [];

function createAndTrackLimiter(name: string, maxRequests: number, windowMs: number): RateLimiter {
  const limiter = createRateLimiter(name, maxRequests, windowMs);
  allRateLimiters.push(limiter);
  return limiter;
}

const bookingLimiter = createAndTrackLimiter("booking", 5, 60 * 60 * 1000);
const calcLimiter = createAndTrackLimiter("calc", 10, 60 * 60 * 1000);
const newsletterLimiter = createAndTrackLimiter("newsletter", 3, 60 * 60 * 1000);
const publicDataLimiter = createAndTrackLimiter("publicData", 60, 60 * 1000);
const visitorLimiter = createAndTrackLimiter("visitor", 30, 60 * 1000);
const consentLimiter = createAndTrackLimiter("consent", 20, 60 * 1000);

const VISITOR_WINDOW = 24 * 60 * 60 * 1000;
const MAX_VISITOR_MAP_ENTRIES = 50_000;
const visitorSeenMap = new Map<string, number>();
/**
 * Slot Locking — prevents double-booking the same time slot.
 *
 * Current implementation: in-memory promise chain (single-instance only).
 * This is safe and correct for a single Node.js process. If Exentax scales
 * to multiple instances, replace the maps below with a distributed lock
 * (e.g. Redis SETNX with TTL or Redlock). The withSlotLock() interface
 * stays the same — only the internal acquire/release changes.
 *
 * Scaling path:
 *   1. Install ioredis
 *   2. Replace slotLocks Map with Redis SETNX + EX (TTL = LOCK_TIMEOUT_MS)
 *   3. Replace cleanup with Redis DEL on completion
 *   4. withSlotLock() signature unchanged — zero business logic changes
 */
const slotLocks = new Map<string, Promise<unknown>>();
const slotLockTimestamps = new Map<string, number>();
const slotLockSettled = new Map<string, boolean>();

const bookingLocks = new Map<string, Promise<unknown>>();
export function withBookingLock<T>(bookingId: string, fn: () => Promise<T>): Promise<T> {
  const LOCK_TIMEOUT_MS = 15_000;
  const prev = bookingLocks.get(bookingId) ?? Promise.resolve();
  const run = new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Booking lock timeout for ${bookingId}`)), LOCK_TIMEOUT_MS);
    prev.catch(() => {}).then(() => {
      fn().then((v) => { clearTimeout(timer); resolve(v); }).catch((e) => { clearTimeout(timer); reject(e); });
    });
  });
  const cleanup = run.then(() => {}, () => {});
  bookingLocks.set(bookingId, cleanup);
  cleanup.then(() => {
    if (bookingLocks.get(bookingId) === cleanup) bookingLocks.delete(bookingId);
  });
  return run;
}

export function checkBookingRateLimit(ip: string): Promise<boolean> { return bookingLimiter.check(ip); }
export function checkCalcRateLimit(ip: string): Promise<boolean> { return calcLimiter.check(ip); }
export function checkNewsletterRateLimit(ip: string): Promise<boolean> { return newsletterLimiter.check(ip); }
export function checkPublicDataRateLimit(ip: string): Promise<boolean> { return publicDataLimiter.check(ip); }
export function checkVisitorRateLimit(ip: string): Promise<boolean> { return visitorLimiter.check(ip); }
export function checkConsentRateLimit(ip: string): Promise<boolean> { return consentLimiter.check(ip); }

const ALLOWED_ORIGINS = new Set([
  "https://exentax.com",
  "https://www.exentax.com",
]);

if (process.env.EXTRA_ALLOWED_ORIGINS) {
  for (const origin of process.env.EXTRA_ALLOWED_ORIGINS.split(",")) {
    const trimmed = origin.trim();
    if (trimmed) ALLOWED_ORIGINS.add(trimmed);
  }
}

function isTrustedOrigin(originUrl: string): boolean {
  if (ALLOWED_ORIGINS.has(originUrl)) return true;
  try {
    const { hostname } = new URL(originUrl);
    if (process.env.NODE_ENV !== "production") {
      if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") return true;
      if (hostname.endsWith(".replit.dev") || hostname.endsWith(".repl.co")) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function checkCsrfOrigin(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  const origin = (req.headers["origin"] || "").toString();
  const referer = (req.headers["referer"] || "").toString();
  if (!origin && !referer) return false;
  if (origin && origin !== "null") return isTrustedOrigin(origin);
  if (referer) {
    try {
      return isTrustedOrigin(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return false;
}

export function withSlotLock<T>(slotKey: string, fn: () => Promise<T>): Promise<T> {
  const LOCK_TIMEOUT_MS = 15_000;
  const prev = slotLocks.get(slotKey) ?? Promise.resolve();
  const run = new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Slot lock timeout for ${slotKey}`)), LOCK_TIMEOUT_MS);
    prev.catch(() => {}).then(() => {
      fn().then((v) => { clearTimeout(timer); resolve(v); }).catch((e) => { clearTimeout(timer); reject(e); });
    });
  });
  const cleanup = run.then(() => {}, () => {});
  slotLocks.set(slotKey, cleanup);
  slotLockTimestamps.set(slotKey, Date.now());
  slotLockSettled.set(slotKey, false);
  cleanup.then(() => {
    slotLockSettled.set(slotKey, true);
    if (slotLocks.get(slotKey) === cleanup) {
      slotLocks.delete(slotKey);
      slotLockTimestamps.delete(slotKey);
      slotLockSettled.delete(slotKey);
    }
  });
  return run;
}

export function isBotVisitor(req: { headers: Record<string, string | string[] | undefined>; ip?: string }): boolean {
  const ua = (req.headers["user-agent"] || "") as string;
  return ua.includes("UptimeRobot") || ua.includes("HealthCheck") || ua.includes("Replit");
}

export function isNewVisitor(ip: string): boolean {
  const now = Date.now();
  const last = visitorSeenMap.get(ip);
  if (!last || now - last > VISITOR_WINDOW) {
    visitorSeenMap.set(ip, now);
    if (visitorSeenMap.size > MAX_VISITOR_MAP_ENTRIES) {
      let toRemove = visitorSeenMap.size - MAX_VISITOR_MAP_ENTRIES;
      for (const key of visitorSeenMap.keys()) {
        if (toRemove <= 0) break;
        visitorSeenMap.delete(key);
        toRemove--;
      }
    }
    return true;
  }
  return false;
}

export function clearActiveTimers() {
  for (const timer of activeTimers.values()) {
    clearTimeout(timer);
  }
  activeTimers.clear();
}

export function registerCleanupIntervals(activeIntervals: ReturnType<typeof setInterval>[]) {
  activeIntervals.push(setInterval(() => {
    for (const limiter of allRateLimiters) {
      limiter.cleanup();
    }
  }, 60 * 60 * 1000));

  activeIntervals.push(setInterval(() => {
    const now = Date.now();
    for (const [ip, ts] of visitorSeenMap.entries()) {
      if (now - ts > VISITOR_WINDOW) visitorSeenMap.delete(ip);
    }
  }, VISITOR_WINDOW));

  const SLOT_LOCK_MAX_AGE = 5 * 60_000;
  activeIntervals.push(setInterval(() => {
    const now = Date.now();
    for (const [key, ts] of slotLockTimestamps.entries()) {
      if (now - ts > SLOT_LOCK_MAX_AGE && slotLockSettled.get(key) === true) {
        slotLocks.delete(key);
        slotLockTimestamps.delete(key);
        slotLockSettled.delete(key);
      }
    }
  }, 60_000));
}

