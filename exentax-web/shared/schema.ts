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
  check("agenda_status_check", sql`${table.status} IS NULL OR ${table.status} IN ('pending','contacted','in_progress','closed','cancelled','rescheduled','no_show')`),
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
  privacy: boolean("privacidad").default(false),
  marketing: boolean("marketing").default(false),
  ip: text("ip"),
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
]);

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({ createdAt: true });
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

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
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("consent_log_email_idx").on(table.email),
  index("consent_log_form_type_idx").on(table.formType),
  index("consent_log_created_at_idx").on(table.createdAt),
]);

export const insertConsentLogSchema = createInsertSchema(consentLog).omit({ createdAt: true });
