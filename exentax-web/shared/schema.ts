import { pgTable, text, varchar, integer, boolean, timestamp, numeric, jsonb, serial, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  clientId: varchar("cliente_id", { length: 64 }),
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
  product: text("producto"),
  billing: text("facturacion"),
  accounting: text("contabilidad"),
  notes: text("notas"),
  birthDate: text("fecha_nacimiento"),
  dni: text("dni"),
  taxId: text("tax_id"),
  idType: text("id_type").default("PASSPORT"),
  ip: text("ip"),
  consentDateTime: text("consentimiento_fecha_hora"),
  closeDate: text("fecha_cierre"),
  trustpilotSent: boolean("trustpilot_enviado").default(false),
  economicActivity: text("actividad_economica"),
  estimatedProfit: text("beneficio_estimado"),
  country: text("pais"),
  city: text("ciudad"),
  address: text("direccion"),
  postalCode: text("codigo_postal"),
  language: text("idioma").default("es"),
  pipelineStage: text("etapa_pipeline").default("nuevo"),
  temperature: text("temperatura"),
  nextFollowUp: text("proximo_seguimiento"),
  nextAction: text("proxima_accion"),
  lostReason: text("razon_perdida"),
  assignedTo: text("asignado_a"),
  createdAt: timestamp("fecha_creacion").defaultNow(),
}, (table) => [
  index("leads_email_idx").on(table.email),
  index("leads_cliente_id_idx").on(table.clientId),
  index("leads_cerrado_idx").on(table.closed),
  index("leads_fecha_creacion_idx").on(table.createdAt),
  index("leads_telefono_idx").on(table.phone),
  index("leads_fuente_idx").on(table.source),
  index("leads_producto_idx").on(table.product),
  index("leads_etapa_pipeline_idx").on(table.pipelineStage),
  index("leads_temperatura_idx").on(table.temperature),
  index("leads_proximo_seguimiento_idx").on(table.nextFollowUp),
  index("leads_asignado_a_idx").on(table.assignedTo),
  index("leads_pipeline_temp_idx").on(table.pipelineStage, table.temperature),
  check("leads_pipeline_stage_check", sql`${table.pipelineStage} IS NULL OR ${table.pipelineStage} IN ('nuevo','contactado','reunion_agendada','propuesta_enviada','negociacion','ganado','perdido')`),
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
