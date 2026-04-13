-- Exentax public web schema
-- Tables: leads, agenda, calculadora, visitas, newsletter_suscriptores,
--         dias_bloqueados, legal_document_versions
-- Removed: admin_users, clientes, llcs, llc_miembros, facturas, comisiones,
--          pagos, documentos, emails, consentimientos, legal_acceptances,
--          timeline, tokens, login_attempts, calendario_fiscal, alertas_fiscales,
--          notificaciones, gastos_negocio, newsletter_campanas, audit_logs,
--          revoked_admin_sessions

CREATE TABLE "leads" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"cliente_id" varchar(64),
	"fecha" text,
	"nombre" text NOT NULL,
	"apellido" text,
	"email" text NOT NULL,
	"telefono" text,
	"fuente" text,
	"uso_calculadora" boolean DEFAULT false,
	"agendo_llamada" boolean DEFAULT false,
	"privacidad_aceptada" boolean DEFAULT false,
	"terminos_aceptados" boolean DEFAULT false,
	"marketing_aceptado" boolean DEFAULT false,
	"cerrado" boolean DEFAULT false,
	"importe" numeric(12, 2),
	"producto" text,
	"facturacion" text,
	"contabilidad" text,
	"notas" text,
	"fecha_nacimiento" text,
	"dni" text,
	"tax_id" text,
	"id_type" text DEFAULT 'PASSPORT',
	"ip" text,
	"consentimiento_fecha_hora" text,
	"fecha_cierre" text,
	"trustpilot_enviado" boolean DEFAULT false,
	"actividad_economica" text,
	"beneficio_estimado" text,
	"pais" text,
	"ciudad" text,
	"direccion" text,
	"codigo_postal" text,
	"idioma" text DEFAULT 'es',
	"etapa_pipeline" text DEFAULT 'nuevo',
	"temperatura" text,
	"proximo_seguimiento" text,
	"proxima_accion" text,
	"razon_perdida" text,
	"asignado_a" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "leads_pipeline_stage_check" CHECK ("leads"."etapa_pipeline" IS NULL OR "leads"."etapa_pipeline" IN ('nuevo','contactado','reunion_agendada','propuesta_enviada','negociacion','ganado','perdido'))
);
--> statement-breakpoint
CREATE TABLE "agenda" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fecha_reserva" text,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"telefono" text,
	"fecha_reunion" text,
	"hora_inicio" text,
	"hora_fin" text,
	"google_meet" text,
	"google_meet_event_id" text,
	"notas" text,
	"contexto" text,
	"ip" text,
	"privacidad" boolean DEFAULT false,
	"marketing" boolean DEFAULT false,
	"estado" text DEFAULT 'Pendiente',
	"consentimiento_fecha_hora" text,
	"beneficio_mensual" text,
	"clientes_mundiales" text,
	"opera_digital" text,
	"nota_compartir" text,
	"compromiso_asistir" text,
	"manage_token" text,
	"reminder_sent" boolean DEFAULT false,
	"idioma_booking" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "agenda_status_check" CHECK ("agenda"."estado" IS NULL OR "agenda"."estado" IN ('Pendiente','Contactado','En proceso','Cerrado','Cancelada','Cancelado','Reagendada','No presentado'))
);
--> statement-breakpoint
CREATE TABLE "calculadora" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fecha" text,
	"email" text,
	"telefono" text,
	"pais" text,
	"regimen" text,
	"actividad" text,
	"ingresos_mensuales" text,
	"ingresos_anuales" text,
	"impuestos_actuales" text,
	"coste_llc" text,
	"ahorro_estimado" text,
	"tasa_efectiva" text,
	"gastos_deducibles" text,
	"simulacion_irpf" text,
	"desglose" text,
	"privacidad" boolean DEFAULT false,
	"marketing" boolean DEFAULT false,
	"ip" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "visitas" (
	"id" serial PRIMARY KEY NOT NULL,
	"fecha" text,
	"ip" text,
	"pagina" text,
	"referrer" text,
	"user_agent" text,
	"idioma" text,
	"pantalla" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"pais" text,
	"dispositivo" text,
	"session_id" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_suscriptores" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"source" text,
	"interests" text[],
	"unsubscribe_token" text,
	"subscribed_at" text,
	"unsubscribed_at" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dias_bloqueados" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fecha" text,
	"motivo" text,
	"creado_por" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "legal_document_versions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"doc_type" text NOT NULL,
	"version" text NOT NULL,
	"effective_date" text NOT NULL,
	"content_hash" text,
	"changelog" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "leads_cliente_id_idx" ON "leads" USING btree ("cliente_id");
--> statement-breakpoint
CREATE INDEX "leads_cerrado_idx" ON "leads" USING btree ("cerrado");
--> statement-breakpoint
CREATE INDEX "leads_fecha_creacion_idx" ON "leads" USING btree ("fecha_creacion");
--> statement-breakpoint
CREATE INDEX "leads_telefono_idx" ON "leads" USING btree ("telefono");
--> statement-breakpoint
CREATE INDEX "leads_fuente_idx" ON "leads" USING btree ("fuente");
--> statement-breakpoint
CREATE INDEX "leads_producto_idx" ON "leads" USING btree ("producto");
--> statement-breakpoint
CREATE INDEX "leads_etapa_pipeline_idx" ON "leads" USING btree ("etapa_pipeline");
--> statement-breakpoint
CREATE INDEX "leads_temperatura_idx" ON "leads" USING btree ("temperatura");
--> statement-breakpoint
CREATE INDEX "leads_proximo_seguimiento_idx" ON "leads" USING btree ("proximo_seguimiento");
--> statement-breakpoint
CREATE INDEX "leads_asignado_a_idx" ON "leads" USING btree ("asignado_a");
--> statement-breakpoint
CREATE INDEX "leads_pipeline_temp_idx" ON "leads" USING btree ("etapa_pipeline","temperatura");
--> statement-breakpoint
CREATE INDEX "agenda_email_idx" ON "agenda" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "agenda_fecha_reunion_idx" ON "agenda" USING btree ("fecha_reunion");
--> statement-breakpoint
CREATE INDEX "agenda_estado_idx" ON "agenda" USING btree ("estado");
--> statement-breakpoint
CREATE INDEX "agenda_email_fecha_reunion_idx" ON "agenda" USING btree ("email","fecha_reunion");
--> statement-breakpoint
CREATE INDEX "agenda_manage_token_idx" ON "agenda" USING btree ("manage_token");
--> statement-breakpoint
CREATE INDEX "agenda_hora_inicio_idx" ON "agenda" USING btree ("hora_inicio");
--> statement-breakpoint
CREATE INDEX "agenda_fecha_creacion_idx" ON "agenda" USING btree ("fecha_creacion");
--> statement-breakpoint
CREATE INDEX "agenda_estado_fecha_idx" ON "agenda" USING btree ("estado","fecha_reunion");
--> statement-breakpoint
CREATE INDEX "calculadora_email_idx" ON "calculadora" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "calculadora_fecha_creacion_idx" ON "calculadora" USING btree ("fecha_creacion");
--> statement-breakpoint
CREATE INDEX "calculadora_pais_idx" ON "calculadora" USING btree ("pais");
--> statement-breakpoint
CREATE INDEX "visitas_ip_idx" ON "visitas" USING btree ("ip");
--> statement-breakpoint
CREATE INDEX "visitas_fecha_creacion_idx" ON "visitas" USING btree ("fecha_creacion");
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_suscriptores" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "newsletter_unsub_token_idx" ON "newsletter_suscriptores" USING btree ("unsubscribe_token");
--> statement-breakpoint
CREATE INDEX "dias_bloqueados_fecha_idx" ON "dias_bloqueados" USING btree ("fecha");
--> statement-breakpoint
CREATE INDEX "legal_doc_versions_type_idx" ON "legal_document_versions" USING btree ("doc_type");
