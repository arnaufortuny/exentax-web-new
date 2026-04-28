import type { Express } from "express";
import { logger, maskIp } from "../logger";
import { z } from "zod";
import crypto from "crypto";
import { withTransaction } from "../db";
import { eq } from "drizzle-orm";
import * as schema from "../../shared/schema";
import {
  generateId, getAllBlockedDays, getBlockedDay, getBookedSlots, isSlotBooked,
  hasExistingBooking, insertAgenda, insertLead,
  insertVisit,
  upsertNewsletterSubscriber,
  getAgendaByIdAndToken, updateAgenda,
  findNewsletterByUnsubToken, updateNewsletterSubscriber,
  findDripEnrollmentByUnsubToken, unsubscribeDripEnrollment,
  insertConsentLog,
  upsertBookingDraft, markBookingDraftCompleted,
  SlotConflictError,
} from "../storage";
import { encryptField } from "../field-encryption";
import { sendRescheduleConfirmation, sendCancellationEmail, sendCalculatorEmail, renderCalculatorEmailHtml, maskEmail } from "../email";
import { sendImmediateStep1 } from "../scheduled/drip-worker";
import { tryCreateDripEnrollment } from "../storage/marketing";
import { enqueueEmail, triggerEmailDrain } from "../email-retry-queue";
import { LEAD_SOURCES, DEFAULT_TIMEZONE, todayMadridISO, nowMadrid, SUPPORTED_LANGS, AGENDA_STATUSES, isCancelledStatus, SITE_URL, HREFLANG_BCP47 } from "../server-constants";
import { ALL_ROUTE_KEYS, ROUTE_SLUGS, getLocalizedPath, type RouteKey } from "../../shared/routes";
import type { SupportedLang } from "../server-constants";
import { createGoogleMeetEvent, deleteGoogleMeetEvent } from "../google-meet";
import {
  generateTimeSlots, getEndTime, isWeekday, scheduleReminderEmail, cancelReminderTimer, sanitizeInput,
  checkBookingRateLimit, checkBookingEmailRateLimit, checkBookingDraftEmailRateLimit, checkBookingManageRateLimit, checkCalcRateLimit, checkPublicDataRateLimit, checkVisitorRateLimit,
  checkNewsletterRateLimit, checkConsentRateLimit, isNewVisitor, isBotVisitor, getClientIp, truncateIp, withSlotLock, withBookingLock,
  asyncHandler, PHONE_MAX_LENGTH, isValidPhone, ISO_DATE_RE, isValidISODate,
} from "../route-helpers";
import { backendLabel, resolveRequestLang, escapeHtml } from "./shared";
import { calculatorLeadSchema } from "./calculator-lead-schema";
import { BLOG_POSTS } from "../../client/src/data/blog-posts";
import { getTranslatedSlug, resolveToSpanishSlug } from "../../client/src/data/blog-posts-slugs";
import enBlogMeta from "../../client/src/data/blog-i18n/en";
import frBlogMeta from "../../client/src/data/blog-i18n/fr";
import deBlogMeta from "../../client/src/data/blog-i18n/de";
import ptBlogMeta from "../../client/src/data/blog-i18n/pt";
import caBlogMeta from "../../client/src/data/blog-i18n/ca";
import { readdirSync, existsSync, createReadStream, statSync } from "fs";
import { resolve as pathResolve, dirname as pathDirname } from "path";
import { fileURLToPath } from "url";
import { apiFail, apiOk, apiRateLimited, apiNotFound, apiValidationFail } from "./api-response";
import {
  notifyBookingCreated, notifyBookingRescheduled, notifyBookingCancelled,
  notifyCalculatorLead, notifyNewsletterSubscribe, notifyWebVisit, notifyConsent,
  notifyNewLead,
} from "../discord";

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

let sitemapIndexCache: { xml: string; generatedAt: number } | null = null;
let pagesSitemapCache: { xml: string; generatedAt: number } | null = null;
let faqSitemapCache: { xml: string; generatedAt: number } | null = null;
let blogSitemapCache: { xml: string; generatedAt: number } | null = null;
const SITEMAP_CACHE_TTL = 3600_000;
const FAQ_LASTMOD = "2026-04-19";
const PAGES_LASTMOD = "2026-04-19";

const BLOG_META_BY_LANG: Partial<Record<SupportedLang, Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>>> = {
  en: enBlogMeta as Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>,
  fr: frBlogMeta as Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>,
  de: deBlogMeta as Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>,
  pt: ptBlogMeta as Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>,
  ca: caBlogMeta as Record<string, { title?: string; excerpt?: string; metaTitle?: string; metaDescription?: string }>,
};

function hasCompleteMetaServer(slug: string, lang: SupportedLang): boolean {
  if (lang === "es") return true;
  const m = BLOG_META_BY_LANG[lang]?.[slug];
  if (!m) return false;
  return Boolean(m.title && m.excerpt && m.metaTitle && m.metaDescription);
}

const BLOG_AVAILABILITY: Record<string, Set<string>> = (() => {
  const map: Record<string, Set<string>> = {};
  try {
    const here = pathDirname(fileURLToPath(import.meta.url));
    const baseDir = pathResolve(here, "../../client/src/data/blog-content");
    for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
      try {
        const entries = readdirSync(pathResolve(baseDir, lang));
        const set = new Set<string>();
        for (const entry of entries) {
          if (!entry.endsWith(".ts")) continue;
          const slug = entry.slice(0, -3);
          if (hasCompleteMetaServer(slug, lang)) set.add(slug);
        }
        map[lang] = set;
      } catch {
        map[lang] = new Set();
      }
    }
  } catch (err) {
    logger.warn(`Could not load blog availability for sitemap: ${String(err)}`, "seo");
  }
  return map;
})();

function hasBlogTranslationServer(slug: string, lang: SupportedLang): boolean {
  return BLOG_AVAILABILITY[lang]?.has(slug) ?? false;
}

export function getAvailableLangsForSlugServer(slug: string): SupportedLang[] {
  const result: SupportedLang[] = [];
  for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
    if (hasBlogTranslationServer(slug, lang)) result.push(lang);
  }
  return result;
}

let robotsCache: string | null = null;

// --- Real source-file mtimes feed sitemap <lastmod> ----------------------
// Each main route maps to a page component file; FAQ data lives in
// faq-data.tsx + the locale files. We use the most recent mtime in the
// fileset so /sitemap.xml reflects when content was actually edited.
import { statSync as _statSync } from "fs";
const _here = pathDirname(fileURLToPath(import.meta.url));
const _clientSrc = pathResolve(_here, "../../client/src");
function _mtimeOf(rel: string): number {
  try { return _statSync(pathResolve(_clientSrc, rel)).mtimeMs; } catch { return 0; }
}
function _maxMtime(rels: string[]): string {
  let max = 0;
  for (const r of rels) max = Math.max(max, _mtimeOf(r));
  return (max ? new Date(max) : new Date()).toISOString().slice(0, 10);
}
const PAGE_FILES_BY_ROUTE: Record<string, string[]> = {
  home:             ["pages/home.tsx", "components/sections/hero.tsx"],
  our_services:     ["pages/services.tsx"],
  about_llc:        ["pages/about-llc.tsx"],
  how_we_work:      ["pages/how-we-work.tsx"],
  faq:              ["pages/faq-page.tsx", "components/sections/faq-data.tsx"],
  book:             ["pages/book.tsx"],
  legal_terms:      ["pages/legal/terms.tsx"],
  legal_privacy:    ["pages/legal/privacy.tsx"],
  legal_cookies:    ["pages/legal/cookies.tsx"],
  legal_refunds:    ["pages/legal/refunds.tsx"],
  legal_disclaimer: ["pages/legal/disclaimer.tsx"],
  pillar_open_llc:  ["pages/abrir-llc.tsx"],
};
function pageLastmod(routeKey: string): string {
  const files = PAGE_FILES_BY_ROUTE[routeKey];
  if (!files || files.length === 0) return PAGES_LASTMOD;
  return _maxMtime(files);
}
const FAQ_LASTMOD_DYNAMIC = (): string => _maxMtime([
  "pages/faq-page.tsx", "components/sections/faq-data.tsx",
  "i18n/locales/es.ts", "i18n/locales/en.ts", "i18n/locales/fr.ts",
  "i18n/locales/de.ts", "i18n/locales/pt.ts", "i18n/locales/ca.ts",
]);
const PAGES_INDEX_LASTMOD_DYNAMIC = (): string => _maxMtime(
  Object.values(PAGE_FILES_BY_ROUTE).flat()
);

// Cached privacy policy version (TTL: 10 min) — avoids a DB hit per consent log insertion
let _privacyVersionCache: string | null = null;
let _privacyVersionExpiry = 0;
async function getCachedPrivacyVersion(): Promise<string> {
  if (_privacyVersionCache && Date.now() < _privacyVersionExpiry) return _privacyVersionCache;
  try {
    const { getActiveLegalDocVersion } = await import("../storage/legal");
    const doc = await getActiveLegalDocVersion("privacy");
    _privacyVersionCache = doc?.version || "1.0";
  } catch (err) {
    logger.warn(`Failed to fetch privacy version, using fallback: ${err instanceof Error ? err.message : String(err)}`, "legal");
    _privacyVersionCache = "1.0";
  }
  _privacyVersionExpiry = Date.now() + 10 * 60_000;
  return _privacyVersionCache;
}

/**
 * Persist the consent record and return its generated `con_*` ID. The ID is
 * surfaced in the Discord `#consentimientos` notification so a subject-access
 * or deletion request can be cross-referenced one-to-one between the channel
 * and the database row. Failures are swallowed (consent logging must NEVER
 * block the user-facing flow) — we return `null` and the notification falls
 * back to "unknown".
 */
function logConsent(entry: Parameters<typeof insertConsentLog>[0]): Promise<string | null> {
  return insertConsentLog(entry).catch((err) => {
    logger.error(`Consent log failed [${entry.formType}]: ${err instanceof Error ? err.message : String(err)}`, "consent");
    return null;
  });
}

/**
 * Editorial duplicate-consolidation map (audit 2026-04, dimensión 06).
 *
 * Maps a deprecated ES slug → canonical ES slug. The 301 handler below
 * resolves the request language via `getTranslatedSlug` so the redirect lands
 * on the correctly localized URL in all 6 languages.
 *
 * Empty by default — the only Jaccard ≥ 0.5 pair detected
 * (`cuota-autonomo-2026` vs `tramos-irpf-2026`) was editorially classified as
 * `differentiate` (see `docs/audits/2026-04/06-duplicates.md`). Add entries
 * here whenever a future audit declares `decision: "consolidate"`.
 */
const _consolidationRedirects: Record<string, string> = Object.create(null);
export const BLOG_CONSOLIDATION_REDIRECTS: Record<string, string> = _consolidationRedirects;
/**
 * Test-only helper: lets the integration suite seed/clear consolidation
 * redirects and exercise the actual `registerPublicRoutes` handler instead
 * of a stubbed copy. Production code never calls this — name is mangled.
 */
export function __setConsolidationRedirectForTest(from: string, to: string | null): void {
  if (to === null) delete _consolidationRedirects[from];
  else _consolidationRedirects[from] = to;
}

export function registerPublicRoutes(app: Express, activeIntervals?: ReturnType<typeof setInterval>[]) {

  // ─────────────────────────────────────────────────────────────────────
  // E2E test-only endpoint: render the branded calculator email HTML
  // ─────────────────────────────────────────────────────────────────────
  // Returns the exact HTML the user would receive after a successful
  // /api/calculator-leads POST, WITHOUT touching the database, Gmail
  // transport, rate limiter, or any other side-effect path. Used by
  // `tests/e2e/calculator-flow.spec.ts` to assert the branded email
  // payload (logo, brand color, savings figure, CTA, etc.) without
  // requiring a live mail provider in CI.
  //
  // Mounted in two cases:
  //   - NODE_ENV !== "production"  → local dev (Replit "Start application"
  //     workflow) so the calculator-flow E2E spec can hit it without any
  //     extra setup.
  //   - E2E_TEST_HOOKS === "1"     → CI smoke against the prod bundle
  //     (the bundle hard-codes NODE_ENV=production via esbuild's `define`,
  //     so the env-var path is the only way to opt in there).
  // Real production deployments set NODE_ENV=production and do NOT set
  // E2E_TEST_HOOKS, so the route literally does not exist in production.
  // Also gated behind the `x-e2e-test: 1` request header so a
  // misconfigured staging never serves it by accident.
  if (process.env.NODE_ENV !== "production" || process.env.E2E_TEST_HOOKS === "1") {
    app.post("/api/__test/render-calculator-email", asyncHandler(async (req, res) => {
      if (req.headers["x-e2e-test"] !== "1") {
        return apiNotFound(res, "not found");
      }
      const parsed = calculatorLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return apiValidationFail(res, parsed.error);
      }
      const expectedAhorro = parsed.data.sinLLC - parsed.data.conLLC;
      if (Math.abs(parsed.data.ahorro - expectedAhorro) > 1) {
        parsed.data.ahorro = Math.max(0, expectedAhorro);
      }
      const { html, subject, lang } = renderCalculatorEmailHtml({
        ...parsed.data,
        clientIp: "0.0.0.0",
        leadId: "TEST_LEAD_E2E",
      });
      return res.json({ html, subject, lang });
    }));
  }

  // 301 redirect to canonical localized blog slug (search-engine friendly).
  // Example: /en/blog/llc-estados-unidos-guia-completa-2026 -> /en/blog/llc-united-states-complete-guide-2026
  const SUPPORTED_LANG_SET = new Set<string>(SUPPORTED_LANGS as readonly string[]);
  const BLOG_SLUG_RE = /^[a-z0-9][a-z0-9-]+[a-z0-9]$/;

  // Editorial duplicate consolidation: 301 deprecated slugs → canonical slug
  // (per-language). Runs *before* the generic slug-normalization handler so
  // a deprecated ES slug requested in any language still lands on the
  // correctly localized canonical URL.
  app.get("/:lang/blog/:slug", (req, res, next) => {
    try {
      const lang = req.params.lang;
      const requested = req.params.slug;
      if (!SUPPORTED_LANG_SET.has(lang) || !BLOG_SLUG_RE.test(requested)) return next();
      const langTyped = lang as SupportedLang;
      const esSlug = resolveToSpanishSlug(requested, langTyped);
      if (!esSlug) return next();
      const canonicalEs = BLOG_CONSOLIDATION_REDIRECTS[esSlug];
      if (!canonicalEs) return next();
      const canonicalLocalized = getTranslatedSlug(canonicalEs, langTyped) || canonicalEs;
      const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
      return res.redirect(301, `/${langTyped}/blog/${canonicalLocalized}${qs}`);
    } catch {
      return next();
    }
  });
  app.get("/:lang/blog/:slug", (req, res, next) => {
    try {
      const lang = req.params.lang;
      const requestedSlug = req.params.slug;
      if (!SUPPORTED_LANG_SET.has(lang) || !BLOG_SLUG_RE.test(requestedSlug)) return next();
      const langTyped = lang as SupportedLang;
      const esSlug = resolveToSpanishSlug(requestedSlug, langTyped);
      if (!esSlug) return next();
      const post = BLOG_POSTS.find(p => p.slug === esSlug);
      if (!post) return next();
      const canonicalSlug = getTranslatedSlug(post.slug, langTyped) || post.slug;
      if (canonicalSlug && canonicalSlug !== requestedSlug) {
        const qs = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
        return res.redirect(301, `/${langTyped}/blog/${canonicalSlug}${qs}`);
      }
      return next();
    } catch {
      return next();
    }
  });

  // Calculator prefill (Task #11). Reads the country code resolved by
  // server/middleware/geo.ts (cf-ipcountry / x-vercel-ip-country /
  // fly-client-ip-country / accept-language fallback) and maps it to the
  // calculator country, default display currency, and CCAA profile. Returns
  // empty strings for unknown / unmapped countries so the client keeps its
  // current default. The raw IP is intentionally NOT exposed.
  app.get("/api/geo", (req, res) => {
    const country = (req as typeof req & { geo?: { country: string } }).geo?.country || "";
    let calculatorCountry = "";
    let currency = "";
    let ccaaProfile = "";
    switch (country) {
      case "ES":
        calculatorCountry = "espana"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "MX":
        calculatorCountry = "mexico"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "CL":
        calculatorCountry = "chile"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "GB":
      case "UK":
        calculatorCountry = "reino-unido"; currency = "GBP"; ccaaProfile = "medium"; break;
      case "BE":
        calculatorCountry = "belgica"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "FR":
        calculatorCountry = "francia"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "IT":
        calculatorCountry = "italia"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "AT":
        calculatorCountry = "austria"; currency = "EUR"; ccaaProfile = "medium"; break;
      case "PT":
      case "AD":
        // Eurozone neighbours without a calculator preset: prefill currency only.
        currency = "EUR"; break;
      default:
        break;
    }
    res.setHeader("Cache-Control", "private, max-age=600");
    return res.json({ country, calculatorCountry, currency, ccaaProfile });
  });

  // Defensive pagination contract. Today this endpoint returns ~tens of
  // dates so callers don't *need* to paginate, but accepting an explicit
  // `limit` (clamped to `BLOCKED_DAYS_MAX_LIMIT`) lets us reject unbounded
  // requests before they hit storage. Anything above the cap is rejected
  // with HTTP 400 — silent truncation would create the worst kind of bug
  // (calendar appears free for blocked days the client never received).
  const BLOCKED_DAYS_MAX_LIMIT = 1000;
  const blockedDaysQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(BLOCKED_DAYS_MAX_LIMIT).optional(),
    offset: z.coerce.number().int().min(0).optional(),
  }).strict();
  app.get("/api/bookings/blocked-days", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const parsed = blockedDaysQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return apiValidationFail(res, parsed.error);
    }
    const { limit, offset } = parsed.data;
    const rows = await getAllBlockedDays();
    const dates = rows.map(r => r.date).filter(Boolean);
    const start = offset ?? 0;
    const end = limit !== undefined ? start + limit : undefined;
    return apiOk(res, { data: dates.slice(start, end), total: dates.length });
  }));

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
    const todayStr = todayMadridISO();

    if (date < todayStr) {
      return apiOk(res, { date, slots: [] });
    }

    const [blockedDay, alreadyBooked] = await Promise.all([
      getBlockedDay(date),
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
    email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong").transform(e => e.trim().toLowerCase()),
    phone: z.string().max(PHONE_MAX_LENGTH, "zodPhoneTooLong").transform(sanitizeInput).refine(isValidPhone, "zodPhoneMinDigits"),
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
    meetingType: z.enum(["google_meet", "phone_call"]).optional().default("google_meet"),
    language: z.string().max(10).optional().nullable(),
  }).strict();

  /**
   * Captura "draft" cuando el visitante introduce su email en el formulario
   * de booking pero todavía no ha confirmado la cita. Si en N minutos no
   * llega la confirmación (POST /api/bookings/book), un cron envía el email
   * "Reserva incompleta" como rescate.
   *
   * Idempotente y barato: si ya hay un draft abierto reciente para el mismo
   * email, solo refresca nombre/idioma/IP. Tasa limitada con el bucket
   * público estándar.
   */
  const bookingDraftSchema = z.object({
    email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong").transform(e => e.trim().toLowerCase()),
    name: z.string().max(100, "zodNameTooLong").transform(sanitizeInput).optional().nullable(),
    language: z.string().max(10).optional().nullable(),
  }).strict();

  app.post("/api/bookings/draft", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const parsed = bookingDraftSchema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { email, name, language } = parsed.data;
    // Per-email throttle (defence in depth on top of the IP limiter, since
    // the upsert is keyed by email and could otherwise be spammed from
    // rotating IPs to flood the drafts table).
    if (!(await checkBookingDraftEmailRateLimit(email))) return apiRateLimited(res, "rateLimited");
    const userAgent = (req.headers["user-agent"] as string | undefined) || null;

    // No-op si el email ya tiene una agenda activa: el usuario ya reservó
    // (o reservó previamente) y no debemos volver a "engancharlo".
    if (await hasExistingBooking(email)) {
      return apiOk(res, { tracked: false, reason: "already_booked" });
    }

    try {
      await upsertBookingDraft({ email, name: name || null, language: language || null, ip, userAgent });
      return apiOk(res, { tracked: true });
    } catch (err) {
      logger.warn(`Booking draft upsert failed: ${err instanceof Error ? err.message : String(err)}`, "booking-draft");
      // Falla silenciosamente para no entorpecer el flujo del usuario.
      return apiOk(res, { tracked: false });
    }
  }));

  app.post("/api/bookings/book", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingRateLimit(ip))) {
      return apiRateLimited(res, "tooManyBookings");
    }

    const parsed = bookingRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return apiValidationFail(res, parsed.error);
    }

    const { name, lastName, email, phone, date, startTime, notes, context, activity, monthlyProfit, globalClients, digitalOperation, shareNote, privacyAccepted, marketingAccepted, meetingType, language } = parsed.data;
    // Per-email throttle: parallel to the IP limiter so an attacker cannot
    // burn through bookings for the same address from rotating IPs.
    // hasExistingBooking() below already blocks the duplicate-booking case;
    // this caps repeated attempts after a cancellation as well.
    if (!(await checkBookingEmailRateLimit(email))) {
      return apiRateLimited(res, "tooManyBookings");
    }

    if (!isWeekday(date)) {
      return apiFail(res, 400, backendLabel("weekdaysOnly", resolveRequestLang(req)), "INVALID_DATE");
    }

    const validSlots = generateTimeSlots();
    if (!validSlots.includes(startTime)) {
      return apiFail(res, 400, backendLabel("invalidTimeSlot", resolveRequestLang(req)), "INVALID_TIME");
    }

    const todayMadridStr = todayMadridISO();
    if (date < todayMadridStr) {
      return apiFail(res, 400, backendLabel("cannotBookPastDate", resolveRequestLang(req)), "INVALID_DATE");
    }

    const blockedDayCheck = await getBlockedDay(date);
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
        if (meetingType === "google_meet") {
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
        }

        const bookingLeadId = generateId("LEAD");
        const manageToken = crypto.randomBytes(24).toString("hex");
        const manageUrl = `${SITE_URL}/booking/${bookingLeadId}?token=${manageToken}`;

        const bookingEmailPayload = {
          clientName: name,
          clientEmail: email,
          phone,
          date,
          startTime,
          endTime,
          meetLink,
          meetingType,
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
        };

        try {
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
            globalClients: globalClients ? "yes" : "no",
            digitalOperation: digitalOperation ? "yes" : "no",
            shareNote,
            attendanceCommitment: "yes",
            manageToken,
            meetingType,
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
            economicActivity: activity || null,
            ip,
            date: todayMadridISO(),
          }, tx);

          // Atomicity: enqueue the confirmation email INSIDE the transaction
          // so it commits together with the agenda+lead rows. If anything
          // after the commit fails (including a process crash), the worker
          // will still send the email on its next drain cycle. If the tx
          // aborts, the email row is rolled back too — no orphan sends.
          await enqueueEmail("booking_confirmation", bookingEmailPayload, {
            reason: "atomic_enqueue",
            immediate: true,
            tx,
          });
        });
        } catch (err) {
          if (err instanceof SlotConflictError) {
            return { error: true as const, status: 409 as const, message: backendLabel("slotAlreadyBooked", resolveRequestLang(req)), code: "SLOT_TAKEN" };
          }
          throw err;
        }

        // Best-effort: kick the worker so the email goes out on the next
        // tick instead of waiting for the regular polling interval.
        triggerEmailDrain();

        // Cierra cualquier draft abierto para este email — evita que el cron
        // de "reserva incompleta" envíe el recordatorio cuando el usuario sí
        // ha terminado. Best-effort: errores no bloquean la respuesta OK.
        markBookingDraftCompleted(email).catch((err) => {
          logger.warn(`markBookingDraftCompleted failed for ${maskEmail(email)}: ${err instanceof Error ? err.message : String(err)}`, "booking-draft");
        });

        scheduleReminderEmail({
          clientName: name,
          clientEmail: email,
          date,
          startTime,
          endTime,
          meetLink,
          meetingType,
          phone,
          manageUrl,
          language,
          agendaId: bookingLeadId,
        });

        // Enroll booking lead in the 6-step drip sequence. Idempotent
        // (partial unique index on active enrollments) so a contact who
        // already signed up via the footer guide just keeps their
        // existing schedule — no duplicate sequence is started.
        // Await the row insert (the e2e test queries the table right
        // after the booking response). Step-1 send stays fire-and-forget.
        try {
          const enrollment = await tryCreateDripEnrollment({
            email,
            name: name || null,
            language: language || "es",
            source: "booking",
          });
          if (enrollment) {
            void sendImmediateStep1({
              id: enrollment.id,
              email: enrollment.email,
              name: enrollment.name ?? null,
              language: enrollment.language,
              unsubToken: enrollment.unsubscribeToken,
            });
          }
        } catch (err) {
          logger.warn(`Drip enrollment (booking) error: ${err instanceof Error ? err.message : String(err)}`, "drip");
        }

        notifyBookingCreated({ bookingId: bookingLeadId, name, lastName, email, phone, date, startTime, endTime, meetLink, meetingType, language, ip, activity, monthlyProfit, globalClients, digitalOperation, notes, context, shareNote, privacyAccepted, marketingAccepted });
        notifyNewLead({ leadId: bookingLeadId, name: `${name}${lastName ? " " + lastName : ""}`, email, phone, source: LEAD_SOURCES.BOOKING_WEB, language, ip, activity, bookingId: bookingLeadId });
        const bookingConsentIp = truncateIp(ip);
        const bookingConsentUa = (req.headers["user-agent"] as string | undefined) || null;
        getCachedPrivacyVersion().then(async (privacyVersion) => {
          const consentId = await logConsent({ formType: "booking", email, privacyAccepted, marketingAccepted, language: language || null, source: "booking", privacyVersion, ip: bookingConsentIp, userAgent: bookingConsentUa });
          notifyConsent({ consentId, formType: "booking", email, privacyAccepted, marketingAccepted, language: language || null, source: "booking", privacyVersion, ip: bookingConsentIp });
        }).catch(err => logger.warn(`Booking consent log error: ${err instanceof Error ? err.message : String(err)}`, "consent"));
        return { error: false as const, date, startTime, endTime, meetLink, meetingType, status: "confirmed" };
      });

    if (result.error) return apiFail(res, result.status, result.message, result.code);
    return apiOk(res, { date: result.date, startTime: result.startTime, endTime: result.endTime, meetLink: result.meetLink, meetingType: result.meetingType, status: result.status }, 201);
  }));

  app.get("/api/booking/:bookingId", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingManageRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token || token.length > 150 || bookingId.length > 100) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    const todayStr = todayMadridISO();
    const isPast = row.meetingDate ? row.meetingDate < todayStr : false;
    return apiOk(res, {
      id: row.id,
      name: row.name || "",
      date: row.meetingDate || "",
      startTime: row.startTime || "",
      endTime: row.endTime || "",
      googleMeet: row.googleMeet || null,
      meetingType: (row.meetingType === "phone_call" ? "phone_call" : "google_meet"),
      phone: row.phone || null,
      status: row.status || AGENDA_STATUSES.PENDING,
      isPast,
    });
  }));

  app.post("/api/booking/:bookingId/reschedule", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingManageRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token || token.length > 150 || bookingId.length > 100) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("cannotRescheduleCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");
    if (row.meetingDate) {
      const madridNowCheck = nowMadrid();
      const todayCheck = todayMadridISO();
      if (row.meetingDate < todayCheck) return apiFail(res, 400, backendLabel("cannotReschedulePast", resolveRequestLang(req)), "PAST_BOOKING");
      if (row.meetingDate === todayCheck && row.endTime) {
        const nowH = madridNowCheck.getHours();
        const nowM = madridNowCheck.getMinutes();
        const [endH, endM] = row.endTime.split(":").map(Number);
        if (endH < nowH || (endH === nowH && endM <= nowM)) return apiFail(res, 400, backendLabel("cannotReschedulePast", resolveRequestLang(req)), "PAST_BOOKING");
      }
    }
    const rescheduleSchema = z.object({
      date: z.string().regex(ISO_DATE_RE, "zodInvalidDate").refine(isValidISODate, "zodInvalidDate"),
      startTime: z.string().regex(/^\d{2}:\d{2}$/, "zodInvalidTime"),
    }).strict();
    const parsed = rescheduleSchema.safeParse(req.body);
    if (!parsed.success) return apiValidationFail(res, parsed.error);
    const { date, startTime } = parsed.data;

    if (row.meetingDate === date && row.startTime === startTime) return apiFail(res, 400, backendLabel("sameSlot", resolveRequestLang(req)), "SAME_SLOT");

    if (!isWeekday(date)) return apiFail(res, 400, backendLabel("weekdaysOnly", resolveRequestLang(req)), "INVALID_DATE");
    const madridNow = nowMadrid();
    const todayStr = todayMadridISO();
    if (date < todayStr) return apiFail(res, 400, backendLabel("cannotReschedulePastDate", resolveRequestLang(req)), "PAST_DATE");
    const blockedDay = await getBlockedDay(date);
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
    const newRescheduleCount = (row.rescheduleCount ?? 0) + 1;
    const nowIso = new Date().toISOString();

    const claimResult = await withBookingLock(bookingId, () =>
      withSlotLock(slotKey, async () => {
        const freshRow = await getAgendaByIdAndToken(bookingId, token);
        if (!freshRow || isCancelledStatus(freshRow.status)) return { error: "CANCELLED" as const };
        const booked = await isSlotBooked(date, startTime);
        if (booked) return { error: "SLOT_TAKEN" as const };
        try {
          await updateAgenda(bookingId, {
            meetingDate: date,
            startTime,
            endTime,
            status: AGENDA_STATUSES.RESCHEDULED,
            googleMeet: null,
            googleMeetEventId: null,
            rescheduleCount: newRescheduleCount,
            lastRescheduledAt: nowIso,
            // Reset reminder claim so the new slot gets its own reminder.
            reminderSent: false,
          });
        } catch (err) {
          if (err instanceof SlotConflictError) return { error: "SLOT_TAKEN" as const };
          throw err;
        }
        return { error: false as const };
      })
    );
    if (claimResult.error === "CANCELLED") return apiFail(res, 400, backendLabel("cannotRescheduleCancelled", resolveRequestLang(req)), "BOOKING_CANCELLED");
    if (claimResult.error === "SLOT_TAKEN") return apiFail(res, 409, backendLabel("slotAlreadyBooked", resolveRequestLang(req)), "SLOT_TAKEN");

    if (row.meetingDate && row.startTime && row.email) {
      cancelReminderTimer(row.meetingDate, row.startTime, row.email);
    }

    const oldMeetEventId = row.googleMeetEventId;
    const rowMeetingType = (row.meetingType === "phone_call" ? "phone_call" : "google_meet") as "google_meet" | "phone_call";

    let newMeetLink: string | null = null;
    let newEventId: string | null = null;
    if (rowMeetingType === "google_meet") {
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
    }

    if (oldMeetEventId) {
      deleteGoogleMeetEvent(oldMeetEventId).catch(err =>
        logger.error("Google Meet delete on reschedule failed", "app", err)
      );
    }

    // Update meet link after creation (separate from slot claim — acceptable non-atomic)
    if (newMeetLink || newEventId) {
      await updateAgenda(bookingId, {
        googleMeet: newMeetLink,
        googleMeetEventId: newEventId,
      });
    }

    const manageUrl = `${SITE_URL}/booking/${bookingId}?token=${token}`;
    sendRescheduleConfirmation({
      clientName: row.name || "",
      clientEmail: row.email || "",
      date,
      startTime,
      endTime,
      meetLink: newMeetLink,
      meetingType: rowMeetingType,
      phone: row.phone,
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
      meetingType: rowMeetingType,
      phone: row.phone,
      manageUrl,
      language: row.language || null,
      agendaId: bookingId,
    });
    notifyBookingRescheduled({ bookingId, name: row.name || "", email: row.email || "", phone: row.phone, oldDate: row.meetingDate, oldStartTime: row.startTime, newDate: date, newStartTime: startTime, newEndTime: endTime, newMeetLink: newMeetLink, meetingType: rowMeetingType, language: row.language, rescheduleCount: newRescheduleCount, ip, source: "client" });
    return apiOk(res, { date, startTime, endTime, status: "rescheduled" });
  }));

  app.post("/api/booking/:bookingId/cancel", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkBookingManageRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const bookingId = String(req.params.bookingId || "");
    const token = String(req.query.token || "");
    if (!bookingId || !token || token.length > 150 || bookingId.length > 100) return apiFail(res, 400, backendLabel("missingBookingIdOrToken", resolveRequestLang(req)), "MISSING_PARAMS");
    const row = await getAgendaByIdAndToken(bookingId, token);
    if (!row) return apiNotFound(res, "bookingNotFound");
    if (isCancelledStatus(row.status)) return apiFail(res, 400, backendLabel("alreadyCancelled", resolveRequestLang(req)), "ALREADY_CANCELLED");
    if (row.meetingDate) {
      const madridNowCancel = nowMadrid();
      const todayCancel = todayMadridISO();
      if (row.meetingDate < todayCancel) return apiFail(res, 400, backendLabel("cannotCancelPast", resolveRequestLang(req)), "PAST_BOOKING");
      if (row.meetingDate === todayCancel && row.endTime) {
        const nowH = madridNowCancel.getHours();
        const nowM = madridNowCancel.getMinutes();
        const [endH, endM] = row.endTime.split(":").map(Number);
        if (endH < nowH || (endH === nowH && endM <= nowM)) return apiFail(res, 400, backendLabel("cannotCancelPast", resolveRequestLang(req)), "PAST_BOOKING");
      }
    }

    const cancelResult = await withBookingLock(bookingId, async () => {
      const freshRow = await getAgendaByIdAndToken(bookingId, token);
      if (!freshRow || isCancelledStatus(freshRow.status)) return { error: "ALREADY_CANCELLED" as const, row: null };
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
        logger.error("Google Meet delete on public cancel failed", "app", err)
      );
    }
    sendCancellationEmail({
      clientName: confirmedRow.name || "",
      clientEmail: confirmedRow.email || "",
      date: confirmedRow.meetingDate || "",
      startTime: confirmedRow.startTime || "",
      endTime: confirmedRow.endTime || "",
      language: confirmedRow.language || null,
    }).catch((err) => logger.error("Cancellation email failed:", "email", err));
    notifyBookingCancelled({ bookingId, name: confirmedRow.name || "", email: confirmedRow.email || "", phone: confirmedRow.phone, date: confirmedRow.meetingDate, startTime: confirmedRow.startTime, endTime: confirmedRow.endTime, language: confirmedRow.language, meetingType: (confirmedRow.meetingType === "phone_call" ? "phone_call" : "google_meet"), ip, source: "client" });
    return apiOk(res, { status: "cancelled" });
  }));

  app.post("/api/calculator-leads", asyncHandler(async (req, res) => {
    const calcIp = getClientIp(req);
    const calcUa = (req.headers["user-agent"] || "").toString().slice(0, 500) || null;
    const calcLocale = (req.headers["accept-language"] || "").toString().slice(0, 100) || null;
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
          economicActivity: parsed.data.activity || null,
          estimatedProfit: Number.isFinite(annualIncome) ? String(annualIncome) : null,
          ip: calcIp,
          date: todayMadridISO(),
        });
      }

      const calcPhoneForCalc = parsed.data.phone || "";
      await tx.insert(schema.calculations).values({
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
        irpfSimulation: parsed.data.calcSpainIrpf ? "yes" : "no",
        breakdown: breakdownStr,
        // Audit Task #8 — extended persistence so a calculation can be
        // replayed for support / fact-check / analytics with full fidelity.
        displayCurrency: parsed.data.displayCurrency ?? null,
        options: parsed.data.options ? JSON.stringify(parsed.data.options) : null,
        bestStructureId: parsed.data.bestStructureId ?? null,
        llcVsAutonomo: typeof parsed.data.llcVsAutonomo === "number" ? String(parsed.data.llcVsAutonomo) : null,
        llcVsSociedad: typeof parsed.data.llcVsSociedad === "number" ? String(parsed.data.llcVsSociedad) : null,
        expenseItems: parsed.data.expenseItems && parsed.data.expenseItems.length > 0 ? JSON.stringify(parsed.data.expenseItems) : null,
        customExpenses: parsed.data.customExpenses && parsed.data.customExpenses.length > 0 ? JSON.stringify(parsed.data.customExpenses) : null,
        privacy: parsed.data.privacyAccepted,
        marketing: parsed.data.marketingAccepted,
        ip: calcIp,
        userAgent: calcUa,
        locale: calcLocale,
        date: todayMadridISO(),
      });
    }).catch((err) => {
      logger.error("Calculator lead+row transaction failed:", "db", err);
      throw err;
    });

    // Send email AFTER transaction commits — avoids orphan emails on TX failure
    sendCalculatorEmail({ ...parsed.data, clientIp: calcIp, leadId: calcLeadId }).catch((err) =>
      logger.error("Calculator email failed:", "app", err)
    );

    if (parsed.data.marketingAccepted) {
      upsertNewsletterSubscriber(
        normalizedEmail,
        "",
        "calculadora",
        ["fiscalidad", "llc"]
      ).catch((err) => logger.error("calculator subscribe error:", "newsletter", err));
      notifyNewsletterSubscribe({ email: normalizedEmail, source: "calculadora_marketing", language: parsed.data.language, ip: calcIp });
    }

    notifyCalculatorLead({
      leadId: calcLeadId, email: normalizedEmail, country: parsed.data.country, regime: parsed.data.regime,
      ahorro: parsed.data.ahorro, annualIncome, monthlyIncome, localTax: parsed.data.sinLLC, llcTax: parsed.data.conLLC,
      language: parsed.data.language, ip: calcIp, marketingAccepted: parsed.data.marketingAccepted, privacyAccepted: parsed.data.privacyAccepted,
    });
    const calcConsentIp = truncateIp(calcIp);
    const calcConsentUa = (req.headers["user-agent"] as string | undefined) || null;
    getCachedPrivacyVersion().then(async (privacyVersion) => {
      const consentId = await logConsent({ formType: "calculator", email: normalizedEmail, privacyAccepted: parsed.data.privacyAccepted, marketingAccepted: parsed.data.marketingAccepted, language: parsed.data.language || null, source: "calculator", privacyVersion, ip: calcConsentIp, userAgent: calcConsentUa });
      notifyConsent({ consentId, formType: "calculator", email: normalizedEmail, privacyAccepted: parsed.data.privacyAccepted, marketingAccepted: parsed.data.marketingAccepted, language: parsed.data.language || null, source: "calculator", privacyVersion, ip: calcConsentIp });
    }).catch(err => logger.warn(`Calculator consent log error: ${err instanceof Error ? err.message : String(err)}`, "consent"));
    return apiOk(res);
  }));

  // Cookie banner consent log — anonymous, no email required.
  //
  // GDPR / AEPD audit-trail requirement: every consent submission must
  // record the document version, the truncated IP, and the User-Agent so
  // we can reconstruct WHEN, WHICH version, and WHO consented in case of
  // a subject-access or supervisory-authority request. The IP is
  // truncated via `truncateIp` (data-minimization) — `consent_log` is a
  // compliance log, NOT an AML/KYC store, so the full IP would be
  // excessive. The User-Agent is capped at 300 chars in storage.
  const cookieConsentSchema = z.object({
    tipo: z.string().max(60),
    aceptado: z.boolean(),
    version: z.string().max(20).optional(),
    idioma: z.string().max(10).optional(),
    referrer: z.string().max(200).transform(s => s.trim()).optional(),
  }).strict();

  app.post("/api/consent", asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    if (!(await checkConsentRateLimit(ip))) return apiOk(res); // silent — never block the client
    const parsed = cookieConsentSchema.safeParse(req.body);
    if (!parsed.success) return apiOk(res); // silent — never block the client
    const { tipo, aceptado, version, idioma, referrer } = parsed.data;
    const userAgent = (req.headers["user-agent"] as string | undefined) || null;
    const consentData = {
      formType: `cookies:${tipo}`,
      email: null as string | null,
      privacyAccepted: true,
      marketingAccepted: tipo === "cookies_analiticas" ? aceptado : null,
      language: idioma || null,
      source: referrer || null,
      privacyVersion: version || null,
      ip: truncateIp(ip),
      userAgent,
    };
    // Cookies endpoint: log + notify in parallel-friendly order. The notify
    // is fire-and-forget but receives the persisted consent ID for traceability.
    // The .catch is mandatory: an unhandled rejection here was the only
    // floating promise in this file, sibling endpoints (booking, calculator,
    // newsletter) all wrap the same pattern with .catch + logger.warn.
    logConsent(consentData).then((consentId) => {
      notifyConsent({ ...consentData, consentId });
    }).catch(err => logger.warn(`Cookies consent log error: ${err instanceof Error ? err.message : String(err)}`, "consent"));
    return apiOk(res);
  }));

  const newsletterSubscribeSchema = z.object({
    email: z.string().email("zodInvalidEmail").max(254, "zodEmailTooLong"),
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
    if (!privacyAccepted) return apiFail(res, 400, backendLabel("zodMustAcceptPrivacy", resolveRequestLang(req)), "PRIVACY_REQUIRED");
    const normalizedEmail = email.trim().toLowerCase();
    const subscriber = await upsertNewsletterSubscriber(normalizedEmail, "", source || "footer", ["general"]);
    notifyNewsletterSubscribe({ email: normalizedEmail, source: source || "footer", language: language || null, ip, privacyAccepted: true, marketingAccepted: marketingAccepted ?? false });
    // Enroll in the 6-step drip sequence (days 0/3/6/9/12/15).
    // `isNew` (from the upsert's `xmax = 0` check) guards the happy path;
    // the drip helper itself is idempotent (partial unique index on
    // active enrollments), so concurrent submits cannot enroll twice.
    if (subscriber?.isNew) {
      // Await the row insert so the HTTP response only returns once the
      // enrollment is durably committed (the e2e test queries the table
      // immediately after subscribing). The expensive part — sending the
      // first email — stays fire-and-forget so the response stays fast.
      try {
        const enrollment = await tryCreateDripEnrollment({
          email: normalizedEmail,
          name: null, // footer guide form does not collect a name
          language: language || "es",
          source: "guide",
        });
        if (enrollment) {
          void sendImmediateStep1({
            id: enrollment.id,
            email: enrollment.email,
            name: enrollment.name ?? null,
            language: enrollment.language,
            unsubToken: enrollment.unsubscribeToken,
          });
        }
      } catch (err) {
        logger.warn(`Drip enrollment (guide) error: ${err instanceof Error ? err.message : String(err)}`, "drip");
      }
    }
    const newsletterConsentIp = truncateIp(ip);
    const newsletterConsentUa = (req.headers["user-agent"] as string | undefined) || null;
    getCachedPrivacyVersion().then(async (privacyVersion) => {
      const consentId = await logConsent({ formType: "newsletter_footer", email: normalizedEmail, privacyAccepted: true, marketingAccepted: marketingAccepted ?? false, language: language || null, source: source || "footer", privacyVersion, ip: newsletterConsentIp, userAgent: newsletterConsentUa });
      notifyConsent({ consentId, formType: "newsletter_footer", email: normalizedEmail, privacyAccepted: true, marketingAccepted: marketingAccepted ?? false, language: language || null, source: source || "footer", privacyVersion, ip: newsletterConsentIp });
    }).catch(err => logger.warn(`Newsletter consent log error: ${err instanceof Error ? err.message : String(err)}`, "consent"));
    return apiOk(res, { subscribed: true });
  }));

  const visitorSchema = z.object({
    consent: z.enum(["all", "essential"]).optional(),
    page: z.string().max(200).optional(),
    referrer: z.string().max(500).transform(s => s.trim()).optional(),
    language: z.string().max(10).optional(),
    screen: z.string().max(20).optional(),
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    sessionId: z.string().max(64).optional(),
  }).strict();

  app.post("/api/visitor", asyncHandler(async (req, res) => {
    const parsed = visitorSchema.safeParse(req.body);
    if (!parsed.success) return apiOk(res);
    const b = parsed.data;
    const consent = b.consent;
    if (consent !== "all") {
      return apiOk(res);
    }
    if (isBotVisitor(req)) {
      return apiOk(res);
    }
    const ip = getClientIp(req);
    if (!(await checkVisitorRateLimit(ip))) return apiRateLimited(res, "rateLimited");
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

    const isNew = isNewVisitor(ip);
    // GDPR data-minimization: `visits` is a pure analytics table. Truncate
    // the IP before persisting (keeps city-level geo, drops the last octet).
    // The full IP is still used for rate-limiting and `isNewVisitor` because
    // those are in-memory and not persisted beyond the dedupe window.
    const visitIp = truncateIp(ip);

    insertVisit({
      date: timestamp,
      ip: visitIp,
      page,
      referrer: str(b.referrer, 500),
      userAgent: ua,
      language: str(b.language, 10),
      screen: str(b.screen, 20),
      utmSource: str(b.utm_source, 100),
      utmMedium: str(b.utm_medium, 100),
      utmCampaign: str(b.utm_campaign, 200),
      utmContent: str(b.utm_content, 200),
      device: dispositivo,
      sessionId: str(b.sessionId, 64),
    }).catch((err) =>
      logger.error("DB append failed:", "visitor", err)
    );

    notifyWebVisit({
      ip: visitIp || "unknown",
      page,
      referrer: str(b.referrer, 500),
      language: str(b.language, 10),
      device: dispositivo,
      screen: str(b.screen, 20),
      userAgent: ua,
      utmSource: str(b.utm_source, 100),
      utmMedium: str(b.utm_medium, 100),
      utmCampaign: str(b.utm_campaign, 200),
      utmContent: str(b.utm_content, 200),
      sessionId: str(b.sessionId, 64),
      isNew,
    });

    if (isNew) {
      // RGPD: never log raw IPs. The masked form keeps enough signal to
      // distinguish "many requests from one network" vs "wildly different
      // visitors" without retaining a personal identifier. The persisted
      // `visitIp` (truncated via `truncateIp`) is what reaches the
      // analytics table; this log line uses the dedicated `maskIp`
      // helper for human-readable diagnostics.
      logger.info(`New visitor: ${maskIp(ip)}`, "visitor");
    }

    return apiOk(res);
  }));


  app.get("/api/legal/versions", asyncHandler(async (req, res) => {
    // Rate-limited: public DB lookup (1 SELECT per call). Without a limiter
    // an attacker can bombard this endpoint to exhaust DB connections or
    // probe legal-document versions. The shared `publicDataLimiter` (60
    // req/min/IP) is the right granularity — generous enough for normal
    // page loads that resolve current versions, restrictive enough to
    // block bursts.
    const ip = getClientIp(req);
    if (!(await checkPublicDataRateLimit(ip))) return apiRateLimited(res, "rateLimited");
    const { getActiveVersionsByType } = await import("../storage/legal");
    const versions = await getActiveVersionsByType();
    const result: Record<string, { version: string; effectiveDate: string }> = {};
    for (const [key, val] of Object.entries(versions)) {
      result[key] = { version: val.version, effectiveDate: val.effectiveDate };
    }
    return apiOk(res, { versions: result });
  }));

  // /sitemap.xml is now a sitemap-index that points to per-content-type
  // children (pages, blog, faq). See docs/indexing-audit-2026-04.md §3.
  app.get("/sitemap.xml", (_req, res) => {
    try {
      if (sitemapIndexCache && Date.now() - sitemapIndexCache.generatedAt < SITEMAP_CACHE_TTL) {
        res.header("Content-Type", "application/xml");
        res.header("Cache-Control", "public, max-age=3600");
        res.header("X-Cache", "HIT");
        return res.send(sitemapIndexCache.xml);
      }
      const today = new Date().toISOString().slice(0, 10);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${SITE_URL}/sitemap-pages.xml</loc>\n    <lastmod>${PAGES_INDEX_LASTMOD_DYNAMIC()}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${SITE_URL}/sitemap-blog.xml</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${SITE_URL}/sitemap-faq.xml</loc>\n    <lastmod>${FAQ_LASTMOD_DYNAMIC()}</lastmod>\n  </sitemap>\n</sitemapindex>`;
      sitemapIndexCache = { xml, generatedAt: Date.now() };
      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.header("X-Cache", "MISS");
      return res.send(xml);
    } catch (err) {
      logger.error("Sitemap index generation error:", "seo", err);
      return res.status(500).send("Error generating sitemap");
    }
  });

  // /sitemap-pages.xml — main public pages (home, services, about-llc,
  // how-we-work, book, blog index, legal/*) per language, with hreflang
  // alternates and x-default. FAQ pages live in /sitemap-faq.xml.
  app.get("/sitemap-pages.xml", (_req, res) => {
    try {
      if (pagesSitemapCache && Date.now() - pagesSitemapCache.generatedAt < SITEMAP_CACHE_TTL) {
        res.header("Content-Type", "application/xml");
        res.header("Cache-Control", "public, max-age=3600");
        res.header("X-Cache", "HIT");
        return res.send(pagesSitemapCache.xml);
      }

      // Priority/changefreq matrix (task #25 requirement):
      //   home               → 1.0 / weekly
      //   services (others)  → 0.9 / monthly  (cornerstone pages)
      //   blog index         → 0.8 / weekly   (emitted below)
      //   FAQ                → 0.7 / monthly  (sitemap-faq.xml)
      //   everything else    → 0.6 / monthly  (legal, booking, etc.)
      // <lastmod> is derived from the actual page-component file mtime.
      const routePriority: Partial<Record<RouteKey, { priority: string; changefreq: string; lastmod: string }>> = {
        home:             { priority: "1.0", changefreq: "weekly",  lastmod: pageLastmod("home") },
        our_services:     { priority: "0.9", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        about_llc:        { priority: "0.9", changefreq: "monthly", lastmod: pageLastmod("about_llc") },
        how_we_work:      { priority: "0.9", changefreq: "monthly", lastmod: pageLastmod("how_we_work") },
        pillar_open_llc:  { priority: "0.9", changefreq: "monthly", lastmod: pageLastmod("pillar_open_llc") },
        service_llc_nm:   { priority: "0.8", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        service_llc_wy:   { priority: "0.8", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        service_llc_de:   { priority: "0.8", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        service_llc_fl:   { priority: "0.8", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        service_itin:     { priority: "0.8", changefreq: "monthly", lastmod: pageLastmod("our_services") },
        book:             { priority: "0.6", changefreq: "monthly", lastmod: pageLastmod("book") },
        legal_terms:      { priority: "0.4", changefreq: "yearly",  lastmod: pageLastmod("legal_terms") },
        legal_privacy:    { priority: "0.4", changefreq: "yearly",  lastmod: pageLastmod("legal_privacy") },
        legal_cookies:    { priority: "0.4", changefreq: "yearly",  lastmod: pageLastmod("legal_cookies") },
        legal_refunds:    { priority: "0.4", changefreq: "yearly",  lastmod: pageLastmod("legal_refunds") },
        legal_disclaimer: { priority: "0.4", changefreq: "yearly",  lastmod: pageLastmod("legal_disclaimer") },
      };
      const urlParts: string[] = [];

      for (const routeKey of ALL_ROUTE_KEYS) {
        const meta = routePriority[routeKey];
        if (!meta) continue;
        for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
          const loc = getLocalizedPath(routeKey, lang);
          const parts = [`  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${meta.lastmod}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n`];
          for (const altLang of SUPPORTED_LANGS as readonly SupportedLang[]) {
            const altLoc = getLocalizedPath(routeKey, altLang);
            parts.push(`    <xhtml:link rel="alternate" hreflang="${HREFLANG_BCP47[altLang]}" href="${SITE_URL}${altLoc}" />\n`);
          }
          const esLoc = getLocalizedPath(routeKey, "es");
          parts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${esLoc}" />\n  </url>\n`);
          urlParts.push(parts.join(""));
        }
      }

      // Blog index per language.
      for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
        const parts = [`  <url>\n    <loc>${SITE_URL}/${lang}/blog</loc>\n    <lastmod>${PAGES_INDEX_LASTMOD_DYNAMIC()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n`];
        for (const altLang of SUPPORTED_LANGS as readonly SupportedLang[]) {
          parts.push(`    <xhtml:link rel="alternate" hreflang="${HREFLANG_BCP47[altLang]}" href="${SITE_URL}/${altLang}/blog" />\n`);
        }
        parts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/es/blog" />\n  </url>\n`);
        urlParts.push(parts.join(""));
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlParts.join("")}</urlset>`;
      pagesSitemapCache = { xml, generatedAt: Date.now() };
      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.header("X-Cache", "MISS");
      return res.send(xml);
    } catch (err) {
      logger.error("Pages sitemap generation error:", "seo", err);
      return res.status(500).send("Error generating pages sitemap");
    }
  });

  // /sitemap-faq.xml — FAQ page in 6 languages with full hreflang matrix.
  app.get("/sitemap-faq.xml", (_req, res) => {
    try {
      if (faqSitemapCache && Date.now() - faqSitemapCache.generatedAt < SITEMAP_CACHE_TTL) {
        res.header("Content-Type", "application/xml");
        res.header("Cache-Control", "public, max-age=3600");
        res.header("X-Cache", "HIT");
        return res.send(faqSitemapCache.xml);
      }
      const urlParts: string[] = [];
      for (const lang of SUPPORTED_LANGS as readonly SupportedLang[]) {
        const loc = getLocalizedPath("faq", lang);
        const parts = [`  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${FAQ_LASTMOD_DYNAMIC()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n`];
        for (const altLang of SUPPORTED_LANGS as readonly SupportedLang[]) {
          parts.push(`    <xhtml:link rel="alternate" hreflang="${HREFLANG_BCP47[altLang]}" href="${SITE_URL}${getLocalizedPath("faq", altLang)}" />\n`);
        }
        parts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${getLocalizedPath("faq", "es")}" />\n  </url>\n`);
        urlParts.push(parts.join(""));
      }
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlParts.join("")}</urlset>`;
      faqSitemapCache = { xml, generatedAt: Date.now() };
      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.header("X-Cache", "MISS");
      return res.send(xml);
    } catch (err) {
      logger.error("FAQ sitemap generation error:", "seo", err);
      return res.status(500).send("Error generating FAQ sitemap");
    }
  });

  app.get("/sitemap-blog.xml", (_req, res) => {
    try {
      if (blogSitemapCache && Date.now() - blogSitemapCache.generatedAt < SITEMAP_CACHE_TTL) {
        res.header("Content-Type", "application/xml");
        res.header("Cache-Control", "public, max-age=3600");
        res.header("X-Cache", "HIT");
        return res.send(blogSitemapCache.xml);
      }

      const PUBLICATION_NAME = "Exentax";
      const urlParts: string[] = [];

      for (const post of BLOG_POSTS) {
        const postSlug = post.slug;
        const lastmod = post.updatedAt || post.publishedAt;
        const publicationDate = post.publishedAt;
        const availableLangs = getAvailableLangsForSlugServer(postSlug);
        if (availableLangs.length === 0) continue;
        for (const lang of availableLangs) {
          const langSlug = getTranslatedSlug(postSlug, lang);
          const locSlug = langSlug && langSlug !== postSlug ? langSlug : postSlug;
          const langTitle = lang === "es" ? post.title : (BLOG_META_BY_LANG[lang]?.[postSlug]?.title || post.title);
          const parts = [
            `  <url>\n`,
            `    <loc>${SITE_URL}/${lang}/blog/${escapeXml(locSlug)}</loc>\n`,
          ];
          if (lastmod) parts.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>\n`);
          parts.push(`    <changefreq>monthly</changefreq>\n`);
          parts.push(`    <priority>0.8</priority>\n`);
          // Always emit all 6 hreflang alternates + x-default. When a locale
          // does not have its own translation yet, fall back to the ES URL
          // (Google's recommended interim behavior) so the matrix stays
          // complete and the audit can flag the gap explicitly.
          const ALL_LANGS: SupportedLang[] = ["es", "en", "fr", "de", "pt", "ca"];
          const esTranslatedSlug = getTranslatedSlug(postSlug, "es");
          const esBlogSlug = esTranslatedSlug && esTranslatedSlug !== postSlug ? esTranslatedSlug : postSlug;
          const esHref = `${SITE_URL}/es/blog/${escapeXml(esBlogSlug)}`;
          for (const altLang of ALL_LANGS) {
            if (availableLangs.includes(altLang)) {
              const translatedSlug = getTranslatedSlug(postSlug, altLang);
              const href = `${SITE_URL}/${altLang}/blog/${escapeXml(translatedSlug && translatedSlug !== postSlug ? translatedSlug : postSlug)}`;
              parts.push(`    <xhtml:link rel="alternate" hreflang="${HREFLANG_BCP47[altLang]}" href="${href}" />\n`);
            } else {
              // Fallback to ES until the translation ships.
              parts.push(`    <xhtml:link rel="alternate" hreflang="${HREFLANG_BCP47[altLang]}" href="${esHref}" />\n`);
            }
          }
          parts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esHref}" />\n`);
          // Google News spec: only articles published within the last 48 h
          // belong in <news:news>. Older entries are ignored by the crawler
          // anyway and bloat the sitemap, so we gate them server-side.
          const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000;
          const pubMs = publicationDate ? Date.parse(publicationDate) : NaN;
          const isFreshNews = Number.isFinite(pubMs) && Date.now() - pubMs <= NEWS_WINDOW_MS;
          if (isFreshNews) {
            parts.push(
              `    <news:news>\n`,
              `      <news:publication>\n`,
              `        <news:name>${PUBLICATION_NAME}</news:name>\n`,
              `        <news:language>${lang}</news:language>\n`,
              `      </news:publication>\n`,
              `      <news:publication_date>${escapeXml(publicationDate)}</news:publication_date>\n`,
              `      <news:title>${escapeXml(langTitle)}</news:title>\n`,
              `    </news:news>\n`,
            );
          }
          parts.push(`  </url>\n`);
          urlParts.push(parts.join(""));
        }
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${urlParts.join("")}</urlset>`;

      blogSitemapCache = { xml, generatedAt: Date.now() };

      res.header("Content-Type", "application/xml");
      res.header("Cache-Control", "public, max-age=3600");
      res.header("X-Cache", "MISS");
      return res.send(xml);
    } catch (err) {
      logger.error("Blog sitemap generation error:", "seo", err);
      return res.status(500).send("Error generating blog sitemap");
    }
  });

  // Internal indexing-audit reports (Task #26).
  // Generated by scripts/seo-indexing-publish.mjs into <cwd>/uploads/reports/indexing/
  // (overridable via INDEXING_REPORTS_DIR). Served behind X-Robots-Tag: noindex
  // and disallowed in robots.txt below.
  const INDEXING_REPORTS_DIR = pathResolve(
    process.env.INDEXING_REPORTS_DIR || pathResolve(process.cwd(), "uploads/reports/indexing"),
  );
  app.get(["/internal/reports/indexing", "/internal/reports/indexing/"], (_req, res) => {
    res.redirect(302, "/internal/reports/indexing/index.html");
  });
  app.get("/internal/reports/indexing/:file", (req, res) => {
    const file = String(req.params.file || "");
    if (!/^[A-Za-z0-9._-]+\.(html|json|md)$/.test(file)) {
      return res.status(400).type("text/plain").send("bad request");
    }
    const fullPath = pathResolve(INDEXING_REPORTS_DIR, file);
    if (!fullPath.startsWith(INDEXING_REPORTS_DIR + "/") && fullPath !== INDEXING_REPORTS_DIR) {
      return res.status(400).type("text/plain").send("bad request");
    }
    if (!existsSync(fullPath)) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
      return res.status(404).type("text/plain")
        .send("Indexing report not found yet. The audit runs after each deploy; try again in a minute.");
    }
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader(
      "Content-Type",
      file.endsWith(".json") ? "application/json; charset=utf-8"
        : file.endsWith(".md") ? "text/markdown; charset=utf-8"
        : "text/html; charset=utf-8",
    );
    res.setHeader("Content-Length", String(statSync(fullPath).size));
    createReadStream(fullPath).pipe(res);
  });

  app.get("/robots.txt", (_req, res) => {
    try {
    if (robotsCache) {
      res.header("Content-Type", "text/plain");
      res.header("Cache-Control", "public, max-age=86400");
      return res.send(robotsCache);
    }

    // ─── AI / generative-engine bots (Task #14) ──────────────────────────
    // We *want* the major LLM crawlers to see the public site so ChatGPT,
    // Claude, Gemini and Perplexity can cite Exentax when users ask about
    // LLCs, EIN, ITIN, Mercury, etc. Each bot is listed explicitly because
    // the spec says crawlers must look up their own user-agent token; many
    // honour `User-agent: *` for fetch but consult the explicit token for
    // training / answer-engine crawls (notably `Google-Extended` and
    // `OAI-SearchBot`). Keeping the list explicit makes the policy
    // auditable and survives future tooling that ignores the wildcard.
    const AI_BOTS: readonly string[] = [
      "GPTBot",                // OpenAI training crawler
      "OAI-SearchBot",         // ChatGPT Search index
      "ChatGPT-User",          // ChatGPT browse-on-behalf-of-user
      "ClaudeBot",             // Anthropic crawler
      "Claude-Web",            // Anthropic legacy crawler
      "anthropic-ai",          // Anthropic alt token
      "PerplexityBot",         // Perplexity crawler
      "Perplexity-User",       // Perplexity user-driven fetch
      "Google-Extended",       // Google Bard / SGE / AI Overview opt-in
      "Applebot-Extended",     // Apple Intelligence training opt-in
      "CCBot",                 // Common Crawl (feeds many LLM datasets)
      "FacebookBot",           // Meta AI / LLaMA crawler
      "Bytespider",            // ByteDance / Doubao crawler
      "Amazonbot",             // Amazon Alexa / Rufus crawler
      "DuckAssistBot",         // DuckDuckGo Assist crawler
      "Diffbot",               // Diffbot knowledge-graph crawler
      "MistralAI-User",        // Mistral Le Chat browse-on-behalf-of-user
      "cohere-ai",             // Cohere crawler
      "YouBot",                // You.com crawler
    ];

    const buildPolicyBlock = (agent: string): string => [
      `User-agent: ${agent}`,
      "Allow: /",
      "Allow: /es/",
      "Allow: /en/",
      "Allow: /fr/",
      "Allow: /de/",
      "Allow: /pt/",
      "Allow: /ca/",
      "Allow: /llms.txt",
      "Allow: /llms-full.txt",
      "Allow: /sitemap.xml",
      "Allow: /sitemap-pages.xml",
      "Allow: /sitemap-blog.xml",
      "Allow: /sitemap-faq.xml",
      "Disallow: /api/",
      "Disallow: /internal/",
      "Disallow: /private/",
      "Disallow: /booking/",
      "Disallow: /start",
      "Disallow: /go/",
      "Disallow: /links",
      "Disallow: /thank-you",
      "Disallow: /thanks",
      "Disallow: /preview/",
      "Disallow: /staging/",
      "Disallow: /dev/",
      "Disallow: /__mockup/",
    ].join("\n");

    robotsCache = [
      "User-agent: *",
      "Allow: /",
      "",
      "# Public localised routes (explicit allows, redundant with Allow: /,",
      "# kept here so robots-checkers can see the canonical surface).",
      "Allow: /es/",
      "Allow: /en/",
      "Allow: /fr/",
      "Allow: /de/",
      "Allow: /pt/",
      "Allow: /ca/",
      "Allow: /llms.txt",
      "Allow: /llms-full.txt",
      "Allow: /sitemap.xml",
      "Allow: /sitemap-pages.xml",
      "Allow: /sitemap-blog.xml",
      "Allow: /sitemap-faq.xml",
      "",
      "# Private / non-indexable surfaces.",
      "Disallow: /api/",
      "Disallow: /internal/",
      "Disallow: /private/",
      "Disallow: /booking/",
      "Disallow: /start",
      "Disallow: /go/",
      "Disallow: /links",
      "Disallow: /thank-you",
      "Disallow: /thanks",
      "Disallow: /preview/",
      "Disallow: /staging/",
      "Disallow: /dev/",
      "Disallow: /__mockup/",
      "",
      "# Block tracking/attribution query-string duplicates",
      "Disallow: /*?ref=",
      "Disallow: /*?utm_source=",
      "Disallow: /*?utm_medium=",
      "Disallow: /*?utm_campaign=",
      "Disallow: /*?utm_term=",
      "Disallow: /*?utm_content=",
      "Disallow: /*?gclid=",
      "Disallow: /*?fbclid=",
      "Disallow: /*?mc_cid=",
      "Disallow: /*?mc_eid=",
      "",
      "# ─── AI / generative-engine crawlers (GEO, Task #14) ─────────────",
      "# Explicit allow list so ChatGPT, Claude, Gemini, Perplexity and",
      "# friends can index and cite Exentax. Private surfaces are excluded.",
      ...AI_BOTS.flatMap((bot) => ["", buildPolicyBlock(bot)]),
      "",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      `Sitemap: ${SITE_URL}/sitemap-pages.xml`,
      `Sitemap: ${SITE_URL}/sitemap-blog.xml`,
      `Sitemap: ${SITE_URL}/sitemap-faq.xml`,
    ].join("\n");

    res.header("Content-Type", "text/plain");
    res.header("Cache-Control", "public, max-age=86400");
    return res.send(robotsCache);
    } catch (err) {
      logger.error("Robots.txt error:", "seo", err);
      return res.status(500).send("Error generating robots.txt");
    }
  });

  app.get("/api/newsletter/unsubscribe/:token", asyncHandler(async (req, res) => {
    // Rate-limited to stop brute-force token enumeration and DoS over the
    // newsletter table (1 SELECT per call, 1 UPDATE per hit). Applies before
    // any DB hit. `publicDataLimiter` (60/min/IP) is fine — real unsubscribe
    // links are clicked once; anything past that is abusive.
    const ip = getClientIp(req);
    const lang = resolveRequestLang(req);
    if (!(await checkPublicDataRateLimit(ip))) {
      return res.status(429).send(unsubscribeHtml(backendLabel("unsubError", lang), backendLabel("rateLimited", lang), lang));
    }
    const token = (req.params.token as string || "").trim();
    if (!token || token.length > 200) {
      return res.status(400).send(unsubscribeHtml(backendLabel("unsubError", lang), backendLabel("unsubInvalidLink", lang), lang));
    }
    const subscriber = await findNewsletterByUnsubToken(token);
    if (!subscriber) {
      return res.status(200).send(unsubscribeHtml(backendLabel("unsubAlreadyTitle", lang), backendLabel("unsubAlreadyMsg", lang), lang));
    }
    await updateNewsletterSubscriber(subscriber.id, { unsubscribedAt: new Date().toISOString() });
    logger.info(`Newsletter unsubscribe: ${subscriber.email.slice(0, 3)}***@${subscriber.email.split("@")[1] ?? ""}`, "newsletter");
    return res.status(200).send(unsubscribeHtml(backendLabel("unsubSuccessTitle", lang), backendLabel("unsubSuccessMsg", lang), lang));
  }));

  // RFC 8058 one-click unsubscribe for the drip nurture sequence (guide
  // download + post-booking nurture). Same shape as the newsletter route:
  //   GET  /api/drip/unsubscribe/:token  →  HTML confirmation page
  //   POST /api/drip/unsubscribe/:token  →  200 (Gmail / Yahoo one-click)
  // Both verbs flip `completed_at` so the worker stops claiming the row
  // and the partial unique index releases the email for any future
  // re-enrollment. Idempotent: a second hit just shows "already unsubscribed".
  const dripUnsubHandler = asyncHandler(async (req, res) => {
    const ip = getClientIp(req);
    const lang = resolveRequestLang(req);
    if (!(await checkPublicDataRateLimit(ip))) {
      return res.status(429).send(unsubscribeHtml(backendLabel("unsubError", lang), backendLabel("rateLimited", lang), lang));
    }
    const token = (req.params.token as string || "").trim();
    if (!token || token.length > 200) {
      return res.status(400).send(unsubscribeHtml(backendLabel("unsubError", lang), backendLabel("unsubInvalidLink", lang), lang));
    }
    const enrollment = await findDripEnrollmentByUnsubToken(token);
    if (!enrollment || enrollment.completedAt) {
      return res.status(200).send(unsubscribeHtml(backendLabel("unsubAlreadyTitle", lang), backendLabel("unsubAlreadyMsg", lang), lang));
    }
    await unsubscribeDripEnrollment(enrollment.id);
    logger.info(`Drip unsubscribe: ${enrollment.email.slice(0, 3)}***@${enrollment.email.split("@")[1] ?? ""}`, "drip");
    return res.status(200).send(unsubscribeHtml(backendLabel("unsubSuccessTitle", lang), backendLabel("unsubSuccessMsg", lang), lang));
  });
  app.get("/api/drip/unsubscribe/:token", dripUnsubHandler);
  app.post("/api/drip/unsubscribe/:token", dripUnsubHandler);

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
