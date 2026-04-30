import { pgTable, text, varchar, boolean, timestamp, serial, integer, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: text("fecha"),
  firstName: text("nombre").notNull(),
  lastName: text("apellido"),
  email: text("email").notNull(),
  phone: text("telefono"),
  source: text("fuente"),
  usedCalculator: boolean("uso_calculadora").default(false),
  scheduledCall: boolean("agendo_llamada").default(false),
  privacyAccepted: boolean("privacidad_aceptada").default(false),
  termsAccepted: boolean("terminos_aceptados").default(false),
  marketingAccepted: boolean("marketing_aceptado").default(false),
  economicActivity: text("actividad_economica"),
  estimatedProfit: text("beneficio_estimado"),
  ip: text("ip"),
  consentDateTime: text("consentimiento_fecha_hora"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("leads_email_idx").on(table.email),
  index("leads_fecha_creacion_idx").on(table.createdAt),
  index("leads_telefono_idx").on(table.phone),
  index("leads_fuente_idx").on(table.source),
  // Task #28 (2026-04-30): partial UNIQUE on `email` so a theoretical race
  // between two simultaneous POSTs (booking + calculator from the same
  // address at the same instant) cannot produce two rows. Task #18 already
  // moved both writers to a select-then-update path inside
  // `withLeadEmailLock`, so in practice no duplicates can be produced — but
  // the per-email lock relies on Redis (production) and a process-local map
  // (dev), neither of which can guarantee global mutual exclusion across a
  // partitioned cluster. This DB-level constraint makes the duplicate
  // impossible by design. Partial on `email <> ''` so legacy rows with an
  // empty placeholder email (none currently exist; defensive) cannot
  // collide. The matching idempotent `CREATE UNIQUE INDEX IF NOT EXISTS`
  // lives in `server/db.ts:runColumnMigrations` and dedupes any legacy
  // duplicates before creating the index — see that block for the
  // merge-and-delete strategy.
  uniqueIndex("leads_email_uniq_idx")
    .on(table.email)
    .where(sql`${table.email} <> ''`),
]);

export const insertLeadSchema = createInsertSchema(leads).omit({ createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const agenda = pgTable("agenda", {
  id: varchar("id", { length: 64 }).primaryKey(),
  bookingDate: text("fecha_reserva"),
  name: text("nombre").notNull(),
  email: text("email").notNull(),
  phone: text("telefono"),
  meetingDate: text("fecha_reunion"),
  startTime: text("hora_inicio"),
  endTime: text("hora_fin"),
  googleMeet: text("google_meet"),
  googleMeetEventId: text("google_meet_event_id"),
  notes: text("notas"),
  context: text("contexto"),
  ip: text("ip"),
  privacy: boolean("privacidad").default(false),
  marketing: boolean("marketing").default(false),
  status: text("estado").default("pending"),
  consentDateTime: text("consentimiento_fecha_hora"),
  monthlyProfit: text("beneficio_mensual"),
  globalClients: text("clientes_mundiales"),
  digitalOperation: text("opera_digital"),
  shareNote: text("nota_compartir"),
  attendanceCommitment: text("compromiso_asistir"),
  manageToken: text("manage_token"),
  reminderSent: boolean("reminder_sent").default(false),
  language: text("idioma_booking"),
  meetingType: text("meeting_type").default("google_meet"),
  rescheduleCount: integer("reschedule_count").default(0),
  lastRescheduledAt: text("last_rescheduled_at"),
  cancelledAt: text("cancelled_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("agenda_email_idx").on(table.email),
  index("agenda_fecha_reunion_idx").on(table.meetingDate),
  index("agenda_estado_idx").on(table.status),
  index("agenda_email_fecha_reunion_idx").on(table.email, table.meetingDate),
  index("agenda_manage_token_idx").on(table.manageToken),
  index("agenda_hora_inicio_idx").on(table.startTime),
  index("agenda_fecha_creacion_idx").on(table.createdAt),
  index("agenda_estado_fecha_idx").on(table.status, table.meetingDate),
  uniqueIndex("agenda_active_slot_uniq_idx")
    .on(table.meetingDate, table.startTime)
    .where(sql`${table.status} IS NULL OR ${table.status} NOT IN ('cancelled','no_show')`),
  check("agenda_status_check", sql`${table.status} IS NULL OR ${table.status} IN ('pending','contacted','in_progress','closed','cancelled','rescheduled','no_show')`),
  check("agenda_meeting_type_check", sql`${table.meetingType} IS NULL OR ${table.meetingType} IN ('google_meet','phone_call')`),
]);

export const insertAgendaSchema = createInsertSchema(agenda).omit({ createdAt: true });
export type InsertAgenda = z.infer<typeof insertAgendaSchema>;
export type Agenda = typeof agenda.$inferSelect;

export const calculations = pgTable("calculations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: text("fecha"),
  email: text("email"),
  phone: text("telefono"),
  country: text("pais"),
  regime: text("regimen"),
  activity: text("actividad"),
  monthlyIncome: text("ingresos_mensuales"),
  annualIncome: text("ingresos_anuales"),
  currentTaxes: text("impuestos_actuales"),
  llcCost: text("coste_llc"),
  estimatedSavings: text("ahorro_estimado"),
  effectiveRate: text("tasa_efectiva"),
  deductibleExpenses: text("gastos_deducibles"),
  irpfSimulation: text("simulacion_irpf"),
  breakdown: text("desglose"),
  // Replay fingerprint: full input + result of the calculator submission.
  // Audit Task #8 (April 2026): persist the full input/result fingerprint
  // so support, fact-check and analytics can replay any past calculation.
  displayCurrency: text("display_currency"),     // EUR | USD | GBP
  options: text("opciones"),                     // JSON: { tarifaPlana?, franceMicro? }
  bestStructureId: text("mejor_estructura"),     // autonomo | sociedad | llc
  llcVsAutonomo: text("ahorro_llc_vs_autonomo"), // signed delta (€/year)
  llcVsSociedad: text("ahorro_llc_vs_sociedad"), // signed delta (€/year)
  expenseItems: text("expense_items"),           // JSON: full itemized list (replay)
  customExpenses: text("custom_expenses"),       // JSON: user-defined extras (replay)
  privacy: boolean("privacidad").default(false),
  marketing: boolean("marketing").default(false),
  ip: text("ip"),
  userAgent: text("user_agent"),
  locale: text("locale"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("calculations_email_idx").on(table.email),
  index("calculations_created_at_idx").on(table.createdAt),
  index("calculations_country_idx").on(table.country),
]);

export const insertCalculationSchema = createInsertSchema(calculations).omit({ createdAt: true });
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  date: text("fecha"),
  ip: text("ip"),
  page: text("pagina"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  language: text("idioma"),
  screen: text("pantalla"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  device: text("dispositivo"),
  sessionId: text("session_id"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("visits_ip_idx").on(table.ip),
  index("visits_created_at_idx").on(table.createdAt),
]);

export const insertVisitSchema = createInsertSchema(visits).omit({ id: true, createdAt: true });
export type InsertVisit = z.infer<typeof insertVisitSchema>;
export type Visit = typeof visits.$inferSelect;


export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  source: text("source"),
  interests: text("interests").array(),
  unsubscribeToken: text("unsubscribe_token"),
  subscribedAt: text("subscribed_at"),
  unsubscribedAt: text("unsubscribed_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  uniqueIndex("newsletter_email_idx").on(table.email),
  index("newsletter_unsub_token_idx").on(table.unsubscribeToken),
  // Partial index covering the active-subscriber filter used by the broadcast worker.
  index("newsletter_subs_active_idx").on(table.unsubscribedAt)
    .where(sql`${table.unsubscribedAt} IS NULL`),
]);

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ createdAt: true });
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// ─── Newsletter campaigns + jobs (broadcast a 10K+ suscriptores) ─────────────
// Modelo: una campaña tiene N jobs (uno por destinatario). Worker drena los
// jobs en pending respetando rate limit del proveedor SMTP. Resumible en
// reinicios — basta con buscar campañas en estado 'in_progress'.

export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: varchar("id", { length: 64 }).primaryKey(),
  subject: text("subject").notNull(),
  bodyHtml: text("body_html").notNull(),
  bodyText: text("body_text"),
  language: text("language"),                       // null = todos los idiomas
  status: text("status").default("queued"),         // queued | in_progress | completed | cancelled | failed
  totalRecipients: integer("total_recipients").default(0),
  sentCount: integer("sent_count").default(0),
  failedCount: integer("failed_count").default(0),
  createdBy: text("created_by"),                    // discord user id
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("newsletter_campaigns_status_idx").on(table.status),
  index("newsletter_campaigns_created_at_idx").on(table.createdAt),
  check("newsletter_campaigns_status_check",
    sql`${table.status} IN ('queued','in_progress','completed','cancelled','failed')`),
]);

export const newsletterCampaignJobs = pgTable("newsletter_campaign_jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  campaignId: varchar("campaign_id", { length: 64 }).notNull()
    .references(() => newsletterCampaigns.id, { onDelete: "cascade" }),
  subscriberId: varchar("subscriber_id", { length: 64 }).notNull()
    .references(() => newsletterSubscribers.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  unsubscribeToken: text("unsubscribe_token"),
  status: text("status").default("pending"),        // pending | sending | sent | failed | skipped
  attempts: integer("attempts").default(0),
  lastError: text("last_error"),
  attemptedAt: timestamp("attempted_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("newsletter_jobs_campaign_idx").on(table.campaignId),
  index("newsletter_jobs_status_idx").on(table.status),
  index("newsletter_jobs_campaign_status_idx").on(table.campaignId, table.status),
  uniqueIndex("newsletter_jobs_campaign_subscriber_uniq")
    .on(table.campaignId, table.subscriberId),
  check("newsletter_jobs_status_check",
    sql`${table.status} IN ('pending','sending','sent','failed','skipped')`),
]);

export type NewsletterCampaign = typeof newsletterCampaigns.$inferSelect;
export type InsertNewsletterCampaign = typeof newsletterCampaigns.$inferInsert;
export type NewsletterCampaignJob = typeof newsletterCampaignJobs.$inferSelect;
export type InsertNewsletterCampaignJob = typeof newsletterCampaignJobs.$inferInsert;

export const blockedDays = pgTable("blocked_days", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: text("fecha"),
  reason: text("motivo"),
  createdBy: text("creado_por"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("blocked_days_date_idx").on(table.date),
]);

export const insertBlockedDaySchema = createInsertSchema(blockedDays).omit({ createdAt: true });
export type InsertBlockedDay = z.infer<typeof insertBlockedDaySchema>;
export type BlockedDay = typeof blockedDays.$inferSelect;

export const LEGAL_DOC_TYPES = ["tos", "privacy", "cookies", "disclaimer", "refund"] as const;
export type LegalDocType = (typeof LEGAL_DOC_TYPES)[number];

export const legalDocumentVersions = pgTable("legal_document_versions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  docType: text("doc_type").notNull(),
  version: text("version").notNull(),
  effectiveDate: text("effective_date").notNull(),
  contentHash: text("content_hash"),
  changelog: text("changelog"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("legal_doc_versions_type_idx").on(table.docType),
  index("legal_doc_versions_effective_date_idx").on(table.effectiveDate),
  index("legal_doc_versions_created_at_idx").on(table.createdAt),
]);

export const insertLegalDocVersionSchema = createInsertSchema(legalDocumentVersions).omit({ createdAt: true });
export type InsertLegalDocVersion = z.infer<typeof insertLegalDocVersionSchema>;
export type LegalDocVersion = typeof legalDocumentVersions.$inferSelect;

export const consentLog = pgTable("consent_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  formType: text("form_type").notNull(),
  email: text("email"),
  privacyAccepted: boolean("privacy_accepted").notNull(),
  marketingAccepted: boolean("marketing_accepted"),
  timestamp: text("timestamp").notNull(),
  language: text("idioma"),
  source: text("source"),
  privacyVersion: text("privacy_version"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("consent_log_email_idx").on(table.email),
  index("consent_log_form_type_idx").on(table.formType),
  index("consent_log_created_at_idx").on(table.createdAt),
]);

/**
 * SEO rankings snapshot — to be populated from Google Search Console.
 * Reserved for the planned SEO task; not yet read or written by the server.
 * See `docs/data-model.md` for the rationale on keeping this table.
 */
export const seoRankings = pgTable("seo_rankings", {
  id: serial("id").primaryKey(),
  snapshotDate: text("snapshot_date").notNull(),
  slug: text("slug").notNull(),
  lang: text("lang").notNull(),
  keyword: text("keyword").notNull(),
  pageUrl: text("page_url").notNull(),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  ctr: text("ctr").notNull().default("0"),
  position: text("position").notNull().default("0"),
  hasData: boolean("has_data").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("seo_rankings_snapshot_idx").on(table.snapshotDate),
  index("seo_rankings_slug_lang_idx").on(table.slug, table.lang),
  uniqueIndex("seo_rankings_snapshot_slug_lang_idx").on(table.snapshotDate, table.slug, table.lang),
]);

export const insertSeoRankingSchema = createInsertSchema(seoRankings).omit({ id: true, createdAt: true });
export type InsertSeoRanking = z.infer<typeof insertSeoRankingSchema>;
export type SeoRanking = typeof seoRankings.$inferSelect;

export const insertConsentLogSchema = createInsertSchema(consentLog).omit({ createdAt: true });

/**
 * Persistent retry queue for transactional emails that could not be sent
 * at the moment of the originating event (Gmail unconfigured, transient
 * Gmail/SMTP failure, etc.). Drained by the worker in
 * `server/email-retry-queue.ts` with exponential backoff.
 *
 * `payload` is a JSON-encoded blob whose shape depends on `emailType`
 * (e.g. `BookingEmailData` for `booking_confirmation`).
 */
export const emailRetryQueue = pgTable("email_retry_queue", {
  id: varchar("id", { length: 64 }).primaryKey(),
  emailType: text("email_type").notNull(),
  payload: text("payload").notNull(),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(6),
  lastError: text("last_error"),
  nextAttemptAt: text("next_attempt_at").notNull(),
  // ISO timestamp set when a worker claims this row for processing. Cleared on
  // failure (so backoff alone governs the next attempt) and the row is deleted
  // on success. A stale claim (older than the configured threshold in
  // `server/email-retry-queue.ts`) is treated as abandoned by another worker
  // that crashed mid-send, and becomes re-claimable.
  claimedAt: text("claimed_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("email_retry_next_attempt_idx").on(table.nextAttemptAt),
  index("email_retry_type_idx").on(table.emailType),
]);

export const insertEmailRetryJobSchema = createInsertSchema(emailRetryQueue).omit({ createdAt: true });
export type InsertEmailRetryJob = z.infer<typeof insertEmailRetryJobSchema>;
export type EmailRetryJob = typeof emailRetryQueue.$inferSelect;

/**
 * Persistent outbound queue for Discord bot REST messages.
 *
 * The previous implementation kept the outbound queue purely in memory: any
 * message awaiting send (including a payload that was being retried after a
 * 429/5xx) was lost on process restart and only mirrored to the structured
 * fallback log line in `server/discord.ts`. This table is the durable
 * source-of-truth for `enqueueItem` so deploys / crashes / autoscaling
 * restarts no longer drop admin notifications.
 *
 * `payload` is the JSON-encoded `DiscordPayload` (already validated against
 * `discordPayloadSchema`) — we avoid re-validating on dequeue. `attempts`
 * mirrors the in-memory `attempt` field (0-based) and `next_attempt_at` is
 * the ISO timestamp at which the row becomes eligible for the next send,
 * computed using the existing exponential-backoff schedule. `claimed_at`
 * lets a worker mark a row in-flight so a second worker (or the same
 * worker after a transient burst) does not double-send the same payload;
 * stale claims are reclaimed exactly like `email_retry_queue`.
 */
export const discordOutboundQueue = pgTable("discord_outbound_queue", {
  id: varchar("id", { length: 64 }).primaryKey(),
  channelId: text("channel_id").notNull(),
  payload: text("payload").notNull(),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),
  lastError: text("last_error"),
  nextAttemptAt: text("next_attempt_at").notNull(),
  claimedAt: text("claimed_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("discord_outbound_next_attempt_idx").on(table.nextAttemptAt),
  index("discord_outbound_created_at_idx").on(table.createdAt),
]);

export const insertDiscordOutboundJobSchema = createInsertSchema(discordOutboundQueue).omit({ createdAt: true });
export type InsertDiscordOutboundJob = z.infer<typeof insertDiscordOutboundJobSchema>;
export type DiscordOutboundJob = typeof discordOutboundQueue.$inferSelect;

/**
 * Audit trail for every agenda action triggered from the Discord bot
 * (slash command or button). Persists who did what, when, and on which
 * booking — so the historical context survives even when the original
 * Discord message is later deleted or the channel is purged.
 */
export const agendaAdminActions = pgTable("agenda_admin_actions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  bookingId: varchar("booking_id", { length: 64 })
    .references(() => agenda.id, { onDelete: "set null" }),
  actorDiscordId: text("actor_discord_id").notNull(),
  actorDiscordName: text("actor_discord_name"),
  action: text("action").notNull(),
  payload: text("payload"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("agenda_admin_actions_booking_idx").on(table.bookingId),
  index("agenda_admin_actions_actor_idx").on(table.actorDiscordId),
  index("agenda_admin_actions_created_at_idx").on(table.createdAt),
]);

export const insertAgendaAdminActionSchema = createInsertSchema(agendaAdminActions).omit({ createdAt: true });
export type InsertAgendaAdminAction = z.infer<typeof insertAgendaAdminActionSchema>;
export type AgendaAdminAction = typeof agendaAdminActions.$inferSelect;

/**
 * Captura "draft" del flujo de reserva: se crea cuando el visitante introduce
 * su email en el formulario de booking pero todavía no ha completado la
 * reserva. Un cron periódico (`server/scheduled/incomplete-bookings.ts`)
 * recoge los drafts con cierta antigüedad sin completar y dispara el email
 * "Reserva incompleta" a esa dirección.
 *
 * - `completedAt` se sella cuando se confirma una reserva (POST
 *   /api/bookings/book) con el mismo email — sirve de freno para no enviar
 *   el recordatorio si el usuario sí terminó.
 * - `reminderSentAt` se sella cuando el cron envía con éxito el correo —
 *   garantiza unicidad y evita reenvíos.
 * - Sin PII más allá del email + idioma; phone/name no se capturan en este
 *   paso porque pueden no estar disponibles en el momento del blur.
 */
export const bookingDrafts = pgTable("booking_drafts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: text("email").notNull(),
  name: text("nombre"),
  language: text("idioma"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  reminderSentAt: text("reminder_sent_at"),
  completedAt: text("completed_at"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("booking_drafts_email_idx").on(table.email),
  index("booking_drafts_created_at_idx").on(table.createdAt),
  index("booking_drafts_reminder_sent_at_idx").on(table.reminderSentAt),
  index("booking_drafts_completed_at_idx").on(table.completedAt),
  // Partial index for the pending-draft sweep (`getBookingDraftsForReminder`).
  index("booking_drafts_pending_sweep_idx")
    .on(table.createdAt)
    .where(sql`${table.completedAt} IS NULL AND ${table.reminderSentAt} IS NULL`),
]);

export const insertBookingDraftSchema = createInsertSchema(bookingDrafts).omit({ createdAt: true });
export type InsertBookingDraft = z.infer<typeof insertBookingDraftSchema>;
export type BookingDraft = typeof bookingDrafts.$inferSelect;

/**
 * Drip enrollments — every footer guide signup or booking enrolls the
 * email into a 6-step nurture sequence (days 0/3/6/9/12/15). The worker
 * in `server/scheduled/drip-worker.ts` advances each row by claiming
 * `next_send_at <= now()` jobs and incrementing `current_step` until it
 * reaches 6, at which point `completed_at` is set.
 *
 * Dedup: a partial unique index on `(email)` filtered by
 * `completed_at IS NULL` guarantees that the same address can only have
 * one ACTIVE enrollment at a time. Re-enrollment after completion is
 * allowed (the prior row keeps `completed_at` set, the next row is new).
 */
export const dripEnrollments = pgTable("drip_enrollments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: text("email").notNull(),
  // First name for personalisation in the greeting line. Nullable
  // because footer guide signups today only ask for the email — only
  // booking enrollments arrive with a name. Sender falls back to the
  // bare cultural greeting when this is null/empty.
  name: text("name"),
  language: text("language").notNull(),
  source: text("source").notNull(), // 'guide' | 'calculator' (legacy 'booking' cohort retired in Task #41 — Audit 05 §5.2)
  currentStep: integer("current_step").notNull().default(0), // 0=not yet sent, 1..6=last sent step
  /**
   * Exactly-once dispatch sentinel. Updated by the drip-worker AFTER a
   * successful SMTP send for `step = lastSentStep + 1`, in a write that is
   * SEPARATE from the `currentStep` advance.
   *
   * Without this column, the failure mode was: SMTP send returns OK, then
   * `advanceDripEnrollment` (which moves `currentStep`) errors transiently
   * (network blip, deadlock, stale connection). The error handler resets
   * `claimedAt = null` but does NOT touch `currentStep`, so on the next
   * worker tick (every 60s) the same row is re-claimed at the same
   * `currentStep` and the worker happily re-fires the SAME drip step at
   * the recipient — a duplicate email of a marketing nurture sequence.
   *
   * With this column, the worker checks `lastSentStep >= stepToSend` at
   * the top of the dispatch loop. If true, the previous SMTP attempt
   * already succeeded; the worker SKIPS the send and only re-tries the
   * `currentStep` advance. The remaining race window is the single
   * `UPDATE drip_enrollments SET last_sent_step = ?` between Gmail's
   * SMTP ACK and that DB write — measurable in single-digit milliseconds
   * vs the 60-second worker tick the bug previously exposed.
   *
   * Defaults to 0 so legacy rows (created before this column existed)
   * continue from where they were: every step is "not yet sent at the
   * sentinel layer" and the worker advances them as before. See
   * `tests/drip-exactly-once.test.ts` for the regression coverage.
   */
  lastSentStep: integer("last_sent_step").notNull().default(0),
  nextSendAt: text("next_send_at"), // ISO; null when completed
  completedAt: text("completed_at"),
  claimedAt: text("claimed_at"),
  lastError: text("last_error"),
  // RFC 8058 one-click unsubscribe token. 32+ random bytes hex-encoded,
  // unique per enrollment so a single click in the recipient's MUA can
  // resolve to exactly one row without exposing the email address. Set
  // at insert time by `enrollDripContact`. Nullable for legacy rows that
  // pre-date this column; the public unsubscribe route falls back to a
  // `mailto:` instruction when missing.
  unsubscribeToken: text("unsubscribe_token"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("drip_enrollments_email_idx").on(table.email),
  index("drip_enrollments_next_send_idx").on(table.nextSendAt),
  uniqueIndex("drip_enrollments_active_email_uniq")
    .on(table.email)
    .where(sql`${table.completedAt} IS NULL`),
  check("drip_enrollments_source_check",
    sql`${table.source} IN ('guide','calculator')`),
  check("drip_enrollments_step_check",
    sql`${table.currentStep} >= 0 AND ${table.currentStep} <= 6`),
]);

export const insertDripEnrollmentSchema = createInsertSchema(dripEnrollments).omit({ createdAt: true });
export type InsertDripEnrollment = z.infer<typeof insertDripEnrollmentSchema>;
export type DripEnrollment = typeof dripEnrollments.$inferSelect;

/**
 * Transactional outbox for drip emails (Task #38, 2026-04-30). Eliminates
 * the three residuals documented in `docs/audits/produccion-2026-04/01-funcional.md`
 * row A2 (SMTP-ACK→sentinel window, lease overlap, sentinel + poison
 * double-fail) by making the "this email needs to be sent" intent durable
 * INSIDE the same transaction that creates the `drip_enrollments` row.
 *
 * Lifecycle:
 *   1. Route handler inserts a row alongside the enrollment, in the same
 *      `withTransaction` (atomic with consent_log + newsletter_subscribers).
 *      `sent_at IS NULL` and `next_attempt_at <= now` makes it immediately
 *      eligible for the worker.
 *   2. Worker `drainOutbox()` claims due rows (`SELECT … FOR UPDATE SKIP
 *      LOCKED` mirrors the email-retry-queue pattern) and bumps
 *      `claim_version` — the fencing token that every subsequent
 *      post-SMTP UPDATE on this row must match. A second worker that
 *      reclaims the row after a stale lease will get a HIGHER
 *      `claim_version`, so the original worker's belated UPDATE
 *      (`markOutboxRowSent` / `releaseOutboxRowOnError`) silently no-ops
 *      via the CAS — never a duplicate `sent_at` write. Lease overlap
 *      bound: at most one extra SMTP per stale-lease window, which the
 *      caps below (max_attempts) bound from above.
 *   3. After SMTP success, `markOutboxRowSent` sets `sent_at` and clears
 *      `claimed_at`, in the same transaction that advances
 *      `drip_enrollments.current_step` and inserts the NEXT step's
 *      outbox row. This is the single place the worker writes "the
 *      email was delivered" — once committed, the row's `sent_at`
 *      filter removes it from the claim selector forever.
 *   4. `attempts` is bumped on every claim, NOT on every dispatch. Even
 *      if the post-SMTP UPDATE fails AND `poisonOutboxRow` itself
 *      fails, after `MAX_ATTEMPTS` total claims the row falls out of
 *      the eligibility filter. This bounds residual (c) so the worst
 *      case is a fixed handful of duplicate sends over the lifetime
 *      of one row, instead of an unbounded retry loop.
 *
 * Indexing:
 *   - `(enrollment_id, step)` UNIQUE: idempotent enqueue (an enrollment's
 *     step N can only ever exist once, so `ON CONFLICT DO NOTHING` is
 *     a safe re-issue path on retry).
 *   - Partial index on `next_attempt_at WHERE sent_at IS NULL AND
 *     attempts < MAX_ATTEMPTS` is the hot path for `drainOutbox` and
 *     keeps the planner small even as the table grows historical rows.
 */
export const emailOutbox = pgTable("email_outbox", {
  id: varchar("id", { length: 64 }).primaryKey(),
  enrollmentId: varchar("enrollment_id", { length: 64 }).notNull()
    .references(() => dripEnrollments.id, { onDelete: "cascade" }),
  step: integer("step").notNull(),
  // JSON-encoded sender payload. Keeps the worker independent of route
  // schema changes and lets the test layer stub dispatch without
  // touching the DB row format.
  // Shape: { kind: "guide"|"calculator", email, name, language, unsubToken, step }.
  payload: text("payload").notNull(),
  claimedAt: text("claimed_at"),
  // Fencing token. Bumped atomically on every successful claim. Every
  // post-SMTP UPDATE on this row must include `WHERE claim_version = ?`
  // so a stale-lease re-claim by another worker invalidates the
  // original worker's belated writes.
  claimVersion: integer("claim_version").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(8),
  sentAt: text("sent_at"),
  lastError: text("last_error"),
  nextAttemptAt: text("next_attempt_at").notNull(),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  uniqueIndex("email_outbox_enrollment_step_uniq")
    .on(table.enrollmentId, table.step),
  // Hot-path index for `drainOutbox`: filters to pending rows
  // (sent_at IS NULL) ordered by next_attempt_at. The attempts <
  // max_attempts gate is applied as a regular WHERE clause at query
  // time rather than baked into the index predicate, since
  // max_attempts is a per-row column (not a constant) and Postgres
  // partial indexes only accept immutable predicates.
  index("email_outbox_pending_idx")
    .on(table.nextAttemptAt)
    .where(sql`${table.sentAt} IS NULL`),
  index("email_outbox_enrollment_idx").on(table.enrollmentId),
  check("email_outbox_step_check",
    sql`${table.step} >= 1 AND ${table.step} <= 6`),
]);

export type EmailOutboxRow = typeof emailOutbox.$inferSelect;
export type InsertEmailOutboxRow = typeof emailOutbox.$inferInsert;
