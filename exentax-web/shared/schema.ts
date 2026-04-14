import { pgTable, text, varchar, boolean, timestamp, numeric, serial, integer, index, uniqueIndex, check } from "drizzle-orm/pg-core";
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
  closed: boolean("cerrado").default(false),
  amount: numeric("importe", { precision: 12, scale: 2 }),
  economicActivity: text("actividad_economica"),
  estimatedProfit: text("beneficio_estimado"),
  ip: text("ip"),
  consentDateTime: text("consentimiento_fecha_hora"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("leads_email_idx").on(table.email),
  index("leads_cerrado_idx").on(table.closed),
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
  status: text("estado").default("Pendiente"),
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
  check("agenda_status_check", sql`${table.status} IS NULL OR ${table.status} IN ('Pendiente','Contactado','En proceso','Cerrado','Cancelada','Cancelado','Reagendada','No presentado')`),
]);

export const insertAgendaSchema = createInsertSchema(agenda).omit({ createdAt: true });
export type InsertAgenda = z.infer<typeof insertAgendaSchema>;
export type Agenda = typeof agenda.$inferSelect;

export const calculadora = pgTable("calculadora", {
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
  index("calculadora_email_idx").on(table.email),
  index("calculadora_fecha_creacion_idx").on(table.createdAt),
  index("calculadora_pais_idx").on(table.country),
]);

export const insertCalculadoraSchema = createInsertSchema(calculadora).omit({ createdAt: true });
export type InsertCalculadora = z.infer<typeof insertCalculadoraSchema>;
export type Calculadora = typeof calculadora.$inferSelect;

export const visitas = pgTable("visitas", {
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
  country: text("pais"),
  device: text("dispositivo"),
  sessionId: text("session_id"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("visitas_ip_idx").on(table.ip),
  index("visitas_fecha_creacion_idx").on(table.createdAt),
]);

export const insertVisitaSchema = createInsertSchema(visitas).omit({ id: true, createdAt: true });
export type InsertVisita = z.infer<typeof insertVisitaSchema>;
export type Visita = typeof visitas.$inferSelect;


export const newsletterSuscriptores = pgTable("newsletter_suscriptores", {
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

export const insertNewsletterSuscriptorSchema = createInsertSchema(newsletterSuscriptores).omit({ createdAt: true });
export type InsertNewsletterSuscriptor = z.infer<typeof insertNewsletterSuscriptorSchema>;
export type NewsletterSuscriptor = typeof newsletterSuscriptores.$inferSelect;

export const diasBloqueados = pgTable("dias_bloqueados", {
  id: varchar("id", { length: 64 }).primaryKey(),
  date: text("fecha"),
  reason: text("motivo"),
  createdBy: text("creado_por"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("dias_bloqueados_fecha_idx").on(table.date),
]);

export const insertDiaBloqueadoSchema = createInsertSchema(diasBloqueados).omit({ createdAt: true });
export type InsertDiaBloqueado = z.infer<typeof insertDiaBloqueadoSchema>;
export type DiaBloqueado = typeof diasBloqueados.$inferSelect;

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
]);

export const insertLegalDocVersionSchema = createInsertSchema(legalDocumentVersions).omit({ createdAt: true });
export type InsertLegalDocVersion = z.infer<typeof insertLegalDocVersionSchema>;
export type LegalDocVersion = typeof legalDocumentVersions.$inferSelect;

// Audit trail for every consent event: form submissions, cookie banner decisions
export const consentLog = pgTable("consent_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  formType: text("form_type").notNull(),       // booking | calculator | newsletter_footer | cookies
  email: text("email"),                          // null for anonymous cookie consent
  privacyAccepted: boolean("privacy_accepted").notNull(),
  marketingAccepted: boolean("marketing_accepted"),
  timestamp: text("timestamp").notNull(),        // ISO 8601
  language: text("idioma"),
  source: text("source"),                        // page path or route
  privacyVersion: text("privacy_version"),       // version of privacy policy accepted
  ip: text("ip"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("consent_log_email_idx").on(table.email),
  index("consent_log_form_type_idx").on(table.formType),
  index("consent_log_created_at_idx").on(table.createdAt),
]);

export const insertConsentLogSchema = createInsertSchema(consentLog).omit({ createdAt: true });
export type InsertConsentLog = z.infer<typeof insertConsentLogSchema>;
export type ConsentLog = typeof consentLog.$inferSelect;
