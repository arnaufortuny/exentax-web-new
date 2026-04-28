import { sendReminderEmail, maskEmail } from "./email";
import { logger } from "./logger";
import { AGENDA_STATUSES, isCancelledStatus } from "./server-constants";
import { madridWallTimeToUtcMs } from "../shared/madrid-time";
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

/**
 * Anonymize a client IP for storage in pure-analytics or compliance-log
 * tables (`consent_log`, `visits`). Implements the de-facto GDPR
 * pseudonymization standard (matches Google Analytics' `anonymizeIp`):
 *   - IPv4 → drop the last octet, replace with `0`
 *     (e.g. `203.0.113.45` → `203.0.113.0`)
 *   - IPv6 → keep the first /48, zero everything after
 *     (e.g. `2001:db8:abcd:1234::1` → `2001:db8:abcd::`)
 *
 * Preserves the input verbatim for sentinel values (`unknown`, `localhost`,
 * `::1`, `127.0.0.1`) so logs remain debuggable in dev and tests.
 *
 * IMPORTANT: do NOT use this for AML/KYC-relevant tables (`leads`,
 * `agenda`, `calculations`) where the full IP must be retained for the
 * 7-year regulatory window. See `docs/compliance/README.md` for the
 * full retention matrix.
 */
export function truncateIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const trimmed = ip.trim();
  if (!trimmed) return null;
  if (trimmed === "unknown" || trimmed === "localhost") return trimmed;
  if (trimmed === "127.0.0.1" || trimmed === "::1") return trimmed;
  // IPv4-mapped IPv6 (e.g. ::ffff:203.0.113.45) — strip the prefix and
  // recurse so the IPv4 anonymization branch handles it.
  const v4Mapped = trimmed.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
  if (v4Mapped) return truncateIp(v4Mapped[1]);
  if (trimmed.includes(".") && !trimmed.includes(":")) {
    const parts = trimmed.split(".");
    if (parts.length !== 4 || parts.some((p) => !/^\d+$/.test(p) || Number(p) > 255)) return trimmed;
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (trimmed.includes(":")) {
    // Expand `::` to keep the first 3 16-bit groups, zero the rest.
    const cleaned = trimmed.split("/")[0];
    const head = cleaned.split("::")[0];
    const groups = head.split(":").slice(0, 3);
    while (groups.length < 3) groups.push("0");
    return `${groups.join(":")}::`;
  }
  return trimmed;
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

export { isWeekdayISO as isWeekday } from "../shared/madrid-time";

// Centralised in shared/madrid-time so the client booking calendar and the
// server reminder scheduler agree on the absolute instant of a Madrid slot.
const getMeetingTimestampMs = madridWallTimeToUtcMs;

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleReminderEmail(data: {
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  meetLink: string | null;
  meetingType?: "google_meet" | "phone_call";
  phone?: string | null;
  manageUrl?: string | null;
  language?: string | null;
  agendaId?: string | null;
}) {
  const meetingMs = getMeetingTimestampMs(data.date, data.startTime);
  const reminderMs = meetingMs - 3 * 60 * 60 * 1000;
  const delay = reminderMs - Date.now();

  if (delay <= 0) {
    logger.info(`Meeting in less than 3h — skipping reminder for ${maskEmail(data.clientEmail)}`, "reminder");
    return;
  }

  const MAX_TIMEOUT = 2_147_483_647;
  if (delay > MAX_TIMEOUT) {
    logger.info(`Delay too large (${Math.round(delay / 86_400_000)}d) — will be picked up by cron checker for ${maskEmail(data.clientEmail)}`, "reminder");
    return;
  }

  const timerKey = `${data.date}_${data.startTime}_${normalizeEmail(data.clientEmail)}`;
  if (activeTimers.has(timerKey)) {
    clearTimeout(activeTimers.get(timerKey)!);
  }

  const reminderAt = new Date(reminderMs).toISOString();
  logger.info(`Scheduled for ${reminderAt} → ${maskEmail(data.clientEmail)}`, "reminder");

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
      // Atomic claim before sending so a concurrent recovery sweep cannot
      // also send the same reminder. If the claim fails, someone else already
      // sent it. If the email fails after a successful claim, release it so
      // the next sweep retries.
      if (data.agendaId) {
        const { markReminderSent, unmarkReminderSent } = await import("./storage");
        const claimed = await markReminderSent(data.agendaId);
        if (!claimed) {
          logger.info(`Skipping timer reminder — booking ${data.agendaId} already claimed`, "reminder");
          return;
        }
        try {
          await sendReminderEmail(data);
        } catch (err) {
          logger.error("Failed to send — releasing claim for retry", "reminder", err);
          try { await unmarkReminderSent(data.agendaId); } catch (revertErr) {
            logger.error(`Failed to release reminder claim for booking ${data.agendaId}`, "reminder", revertErr);
          }
        }
      } else {
        await sendReminderEmail(data);
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
import { getLockStore, type LockStore } from "./lock-store";

let _rlStore: RateLimitStore | null = null;
getRateLimitStore().then(s => { _rlStore = s; }).catch(err => {
  logger.warn(`[rate-limit] Route-level store init failed, using in-memory fallback: ${err instanceof Error ? err.message : String(err)}`, "rate-limit");
});

let _lockStore: LockStore | null = null;
const _lockStoreReady: Promise<LockStore | null> = getLockStore()
  .then((s) => { _lockStore = s; return s; })
  .catch((err) => {
    logger.warn(`[lock] Route-level lock store init failed, using in-memory fallback: ${err instanceof Error ? err.message : String(err)}`, "lock");
    return null;
  });

// Slot locks wrap booking creation, which includes external calls (Google Meet
// link creation, email send). TTL is generous so the auto-release safety net
// never fires mid-operation; callers still bound total runtime via waitMs.
const SLOT_LOCK_WAIT_MS = 15_000;
const SLOT_LOCK_TTL_MS = 90_000;
const BOOKING_LOCK_WAIT_MS = 15_000;
const BOOKING_LOCK_TTL_MS = 90_000;

async function withLockReady<T>(scope: string, key: string, ttlMs: number, waitMs: number, fn: () => Promise<T>): Promise<T> {
  const store = _lockStore ?? (await _lockStoreReady);
  if (!store) throw new Error(`Lock store unavailable for ${scope}:${key}`);
  return store.withLock(scope, key, ttlMs, waitMs, fn);
}

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
// Per-email throttle for `/api/bookings/book`. Independent of the IP
// limiter so a single visitor cannot bypass it by rotating IPs (mobile +
// VPN). 5/hour matches the IP cap; the duplicate-booking guard
// (hasExistingBooking) usually rejects long before we get here, but this
// adds defense in depth against scripted spam.
const bookingEmailLimiter = createAndTrackLimiter("bookingEmail", 5, 60 * 60 * 1000);
// Per-email throttle for `/api/bookings/draft`. The endpoint is upsert-
// idempotent and intentionally cheap, but unbounded per-email writes from
// rotating IPs would let an attacker pump arbitrary email addresses into
// the drafts table to scrape the rescue email funnel. 10/hour easily
// covers a real visitor that types and re-types their email.
const bookingDraftEmailLimiter = createAndTrackLimiter("bookingDraftEmail", 10, 60 * 60 * 1000);
const bookingManageLimiter = createAndTrackLimiter("bookingManage", 30, 60 * 60 * 1000);
const calcLimiter = createAndTrackLimiter("calc", 10, 60 * 60 * 1000);
const newsletterLimiter = createAndTrackLimiter("newsletter", 3, 60 * 60 * 1000);
const publicDataLimiter = createAndTrackLimiter("publicData", 60, 60 * 1000);
const visitorLimiter = createAndTrackLimiter("visitor", 30, 60 * 1000);
const consentLimiter = createAndTrackLimiter("consent", 20, 60 * 1000);

const VISITOR_WINDOW = 24 * 60 * 60 * 1000;
const MAX_VISITOR_MAP_ENTRIES = 50_000;
const visitorSeenMap = new Map<string, number>();
/**
 * Slot/Booking Locking — prevents double-booking the same time slot or
 * concurrent mutations on the same booking.
 *
 * Backed by `lock-store.ts`, which uses Redis SET NX PX when REDIS_URL is
 * configured (works across multiple Node.js instances) and falls back to
 * an in-memory promise chain otherwise. The withSlotLock / withBookingLock
 * interface is unchanged for callers.
 */
export function withBookingLock<T>(bookingId: string, fn: () => Promise<T>): Promise<T> {
  return withLockReady("booking", bookingId, BOOKING_LOCK_TTL_MS, BOOKING_LOCK_WAIT_MS, fn);
}

export function checkBookingRateLimit(ip: string): Promise<boolean> { return bookingLimiter.check(ip); }
// `email` is normalised by the caller (lowercased, trimmed) so the same
// inbox cannot evade the throttle by toggling case or whitespace.
export function checkBookingEmailRateLimit(email: string): Promise<boolean> { return bookingEmailLimiter.check(email); }
export function checkBookingDraftEmailRateLimit(email: string): Promise<boolean> { return bookingDraftEmailLimiter.check(email); }
export function checkBookingManageRateLimit(ip: string): Promise<boolean> { return bookingManageLimiter.check(ip); }
export function checkCalcRateLimit(ip: string): Promise<boolean> { return calcLimiter.check(ip); }
export function checkNewsletterRateLimit(ip: string): Promise<boolean> { return newsletterLimiter.check(ip); }
export function checkPublicDataRateLimit(ip: string): Promise<boolean> { return publicDataLimiter.check(ip); }
export function checkVisitorRateLimit(ip: string): Promise<boolean> { return visitorLimiter.check(ip); }
export function checkConsentRateLimit(ip: string): Promise<boolean> { return consentLimiter.check(ip); }

const ALLOWED_ORIGINS = new Set([
  "https://exentax.com",
  "https://www.exentax.com",
]);

// EXTRA_ALLOWED_ORIGINS lets ops add staging / preview origins without a code
// change. The format is a comma-separated list of fully-qualified origins
// (scheme + host[:port], no path). We validate every entry at boot and refuse
// to start in production if any entry is malformed — a typo here would silently
// expose the API to unintended origins.
function _validateExtraOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    if (!u.hostname) return false;
    // Origin must NOT contain a path / query / fragment.
    if (u.pathname && u.pathname !== "/") return false;
    if (u.search || u.hash) return false;
    // Reconstruct canonical origin and require it to match input verbatim
    // (case-insensitive on host) so that quirks like trailing slashes or
    // userinfo are rejected.
    const canonical = `${u.protocol}//${u.host}`;
    return canonical.toLowerCase() === origin.toLowerCase();
  } catch {
    return false;
  }
}
if (process.env.EXTRA_ALLOWED_ORIGINS) {
  const bad: string[] = [];
  for (const origin of process.env.EXTRA_ALLOWED_ORIGINS.split(",")) {
    const trimmed = origin.trim();
    if (!trimmed) continue;
    if (_validateExtraOrigin(trimmed)) {
      ALLOWED_ORIGINS.add(trimmed);
    } else {
      bad.push(trimmed);
    }
  }
  if (bad.length > 0) {
    if (process.env.NODE_ENV === "production") {
      logger.error(`FATAL: EXTRA_ALLOWED_ORIGINS contains malformed entries: ${bad.join(", ")}`, "csrf");
      // Fail-fast: a bad entry would either be silently ignored (bad UX) or,
      // worse, accepted and round-tripped to a permissive comparison.
      process.exit(1);
    } else {
      logger.warn(`[csrf] EXTRA_ALLOWED_ORIGINS dropped malformed entries: ${bad.join(", ")}`, "csrf");
    }
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
  return withLockReady("slot", slotKey, SLOT_LOCK_TTL_MS, SLOT_LOCK_WAIT_MS, fn);
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

  activeIntervals.push(setInterval(() => {
    if (_lockStore) {
      _lockStore.cleanup().catch(err => {
        logger.warn(`[lock] Lock store cleanup failed: ${err instanceof Error ? err.message : String(err)}`, "lock");
      });
    }
  }, 60_000));
}

