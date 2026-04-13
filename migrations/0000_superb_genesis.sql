CREATE TABLE "admin_users" (
	"id" varchar(64) NOT NULL,
	"username" varchar(64) PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'marketing' NOT NULL,
	"email" text,
	"sessions_invalid_before" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
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
CREATE TABLE "alertas_fiscales" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"llc_id" varchar(64),
	"client_id" varchar(64),
	"tax_calendar_id" varchar(64),
	"tipo" text,
	"asunto" text,
	"mensaje" text,
	"enviada" boolean DEFAULT false,
	"fecha_envio" text,
	"dias_antes" integer,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_user" text NOT NULL,
	"action" text NOT NULL,
	"target" text,
	"details" text,
	"ip" text,
	"created_at" timestamp DEFAULT now()
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
CREATE TABLE "calendario_fiscal" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"llc_id" varchar(64),
	"client_id" varchar(64),
	"tipo" text,
	"descripcion" text,
	"fecha_limite" text,
	"fecha_presentacion" text,
	"estado" text DEFAULT 'pendiente',
	"alerta_enviada" boolean DEFAULT false,
	"notas" text,
	"anio" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "calendario_fiscal_status_check" CHECK ("calendario_fiscal"."estado" IS NULL OR "calendario_fiscal"."estado" IN ('pendiente','cumplida','presentado','na','no_aplicable','cancelado','no_verificada','pendiente_info','regularizacion'))
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"telefono" text,
	"producto" text,
	"estado" text DEFAULT 'activo',
	"estado_llc" text,
	"nombre_llc" text,
	"ein" text,
	"estado_ein" text,
	"fecha_inicio" text,
	"fecha_constitucion" text,
	"pais" text,
	"ciudad" text,
	"direccion" text,
	"codigo_postal" text,
	"idioma" text DEFAULT 'es',
	"notas" text,
	"contrasena_hash" text,
	"bloqueado" boolean DEFAULT false,
	"lead_id" text,
	"unsubscribe_token" text,
	"newsletter_unsub" boolean DEFAULT false,
	"trustpilot_enviado" boolean DEFAULT false,
	"actividad_economica" text,
	"beneficio_mensual" text,
	"metodos_pago" text,
	"estado_cuenta" text DEFAULT 'Al día',
	"fecha_nacimiento" text,
	"dni" text,
	"tax_id" text,
	"id_type" text DEFAULT 'PASSPORT',
	"is_business" boolean DEFAULT false,
	"ip" text,
	"consentimiento_fecha_hora" text,
	"marketing_aceptado" boolean DEFAULT false,
	"privacidad_aceptada" boolean DEFAULT false,
	"cookies_aceptadas" boolean DEFAULT false,
	"fecha_creacion" timestamp DEFAULT now(),
	"ultima_actualizacion" timestamp DEFAULT now(),
	CONSTRAINT "clientes_status_check" CHECK ("clientes"."estado" IS NULL OR "clientes"."estado" IN ('activo','inactivo','bloqueado','en proceso','pendiente'))
);
--> statement-breakpoint
CREATE TABLE "comisiones" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fecha" text,
	"lead_id" text,
	"client_id" varchar(64),
	"invoice_id" varchar(64),
	"usuario" text,
	"tipo" text DEFAULT 'closer',
	"nombre_cliente" text,
	"producto" text,
	"importe_total" numeric(12, 2),
	"comision" numeric(12, 2),
	"moneda" text DEFAULT 'EUR' NOT NULL,
	"estado" text DEFAULT 'pending',
	"motivo" text,
	"ajustado_por" text,
	"fecha_ajuste" timestamp,
	"fecha_pago" text,
	"referencia_pago" text,
	"iban" text,
	"swift" text,
	"beneficiario" text,
	"notas" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "comisiones_status_check" CHECK ("comisiones"."estado" IS NULL OR "comisiones"."estado" IN ('pending','earned','paid','cancelled','reversed')),
	CONSTRAINT "comisiones_type_check" CHECK ("comisiones"."tipo" IS NULL OR "comisiones"."tipo" IN ('closer','marketing'))
);
--> statement-breakpoint
CREATE TABLE "consentimientos" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" text,
	"ip" text,
	"user_agent" text,
	"tipo" text,
	"version" text,
	"aceptado" boolean DEFAULT false,
	"fecha_iso" text,
	"timestamp_unix" text,
	"pais_detectado" text,
	"referrer" text,
	"idioma" text,
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
CREATE TABLE "documentos" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64),
	"llc_id" varchar(64),
	"nombre" text,
	"tipo" text,
	"url" text,
	"filename" text,
	"mime_type" text,
	"file_size" integer,
	"fecha_creacion" timestamp DEFAULT now(),
	"fecha_actualizacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"para" text,
	"asunto" text,
	"tipo" text,
	"estado" text,
	"error" text,
	"fecha_iso" text,
	"timestamp_unix" text,
	"idioma_cliente" text,
	"nombre_cliente" text,
	"canal" text,
	"related_id" text,
	"related_type" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "facturas" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"numero" text,
	"invoice_id" text,
	"client_id" varchar(64),
	"lead_id" varchar(64),
	"llc_id" varchar(64),
	"concepto" text,
	"importe" numeric(12, 2),
	"moneda" text DEFAULT 'EUR',
	"estado" text DEFAULT 'pendiente',
	"fecha_emision" text,
	"fecha_vencimiento" text,
	"fecha_pago" text,
	"notas" text,
	"items" jsonb,
	"empresa" text,
	"passport_number" text,
	"razon_social" text,
	"direccion_fiscal" text,
	"payment_account" text,
	"metodo_pago" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "facturas_status_check" CHECK ("facturas"."estado" IS NULL OR "facturas"."estado" IN ('pendiente','pagada','cancelada','vencida','anulada','reembolsada'))
);
--> statement-breakpoint
CREATE TABLE "gastos_negocio" (
	"id" serial PRIMARY KEY NOT NULL,
	"concepto" text NOT NULL,
	"importe" numeric(12, 2) NOT NULL,
	"moneda" text DEFAULT 'EUR',
	"categoria" text DEFAULT 'otros',
	"fecha" text NOT NULL,
	"notas" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE "legal_acceptances" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64),
	"email" text,
	"doc_type" text NOT NULL,
	"doc_version" text NOT NULL,
	"ip" text,
	"user_agent" text,
	"accepted_at" timestamp DEFAULT now(),
	"fecha_iso" text
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
CREATE TABLE "llc_miembros" (
	"id" serial PRIMARY KEY NOT NULL,
	"llc_id" varchar(64) NOT NULL,
	"client_id" varchar(64),
	"nombre" text NOT NULL,
	"apellido" text,
	"email" text,
	"telefono" text,
	"dni" text,
	"pais" text,
	"direccion" text,
	"porcentaje" numeric(5, 2) NOT NULL,
	"rol" text DEFAULT 'Miembro',
	"orden" integer DEFAULT 1,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "llc_miembros_porcentaje_check" CHECK ("llc_miembros"."porcentaje" >= 0 AND "llc_miembros"."porcentaje" <= 100)
);
--> statement-breakpoint
CREATE TABLE "llcs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64),
	"nombre" text NOT NULL,
	"estado" text,
	"fecha_constitucion" text,
	"ein" text,
	"ein_hash" text,
	"ein_type" text,
	"propietario" text,
	"registered_agent" text,
	"direccion" text,
	"fecha_aniversario" text,
	"status" text,
	"notas" text,
	"banco" text,
	"iban" text,
	"account_number" text,
	"routing_number" text,
	"filing_number" text,
	"compliance_status" text,
	"annual_report_due" text,
	"ra_renewal_due" text,
	"last_compliance_check" text,
	"fecha_disolucion" text,
	"fecha_creacion" timestamp DEFAULT now(),
	"ultima_actualizacion" timestamp DEFAULT now(),
	CONSTRAINT "llcs_status_check" CHECK ("llcs"."status" IS NULL OR "llcs"."status" IN ('Pendiente','En proceso','Activa','Suspendida','Disuelta')),
	CONSTRAINT "llcs_compliance_status_check" CHECK ("llcs"."compliance_status" IS NULL OR "llcs"."compliance_status" IN ('Activa','Compliance pendiente','Suspendida','Disuelta'))
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" text,
	"ip" text,
	"event_type" text,
	"success" boolean DEFAULT false,
	"user_agent" text,
	"details" text,
	"pais_detectado" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_campanas" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"subject" text,
	"html_body" text,
	"sent_count" integer DEFAULT 0,
	"sent_at" text,
	"created_by" text,
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
CREATE TABLE "notificaciones" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64) NOT NULL,
	"tipo" text NOT NULL,
	"titulo" text NOT NULL,
	"mensaje" text,
	"leida" boolean DEFAULT false,
	"enlace" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pagos" (
	"id" serial PRIMARY KEY NOT NULL,
	"factura_id" varchar(64),
	"client_id" varchar(64),
	"importe" numeric(12, 2) NOT NULL,
	"moneda" text DEFAULT 'EUR',
	"metodo_pago" text,
	"estado" text DEFAULT 'completado',
	"referencia" text,
	"notas" text,
	"fecha_pago" timestamp DEFAULT now(),
	CONSTRAINT "pagos_status_check" CHECK ("pagos"."estado" IS NULL OR "pagos"."estado" IN ('completado','reembolsado','pendiente','fallido'))
);
--> statement-breakpoint
CREATE TABLE "revoked_admin_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeline" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64),
	"evento" text,
	"descripcion" text,
	"fecha" text,
	"actor" text,
	"ip" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" varchar(64),
	"token" text NOT NULL,
	"tipo" text,
	"expires_at" text,
	"used" boolean DEFAULT false,
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
ALTER TABLE "alertas_fiscales" ADD CONSTRAINT "alertas_fiscales_llc_id_llcs_id_fk" FOREIGN KEY ("llc_id") REFERENCES "public"."llcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertas_fiscales" ADD CONSTRAINT "alertas_fiscales_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alertas_fiscales" ADD CONSTRAINT "alertas_fiscales_tax_calendar_id_calendario_fiscal_id_fk" FOREIGN KEY ("tax_calendar_id") REFERENCES "public"."calendario_fiscal"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendario_fiscal" ADD CONSTRAINT "calendario_fiscal_llc_id_llcs_id_fk" FOREIGN KEY ("llc_id") REFERENCES "public"."llcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendario_fiscal" ADD CONSTRAINT "calendario_fiscal_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comisiones" ADD CONSTRAINT "comisiones_invoice_id_facturas_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."facturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_llc_id_llcs_id_fk" FOREIGN KEY ("llc_id") REFERENCES "public"."llcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_llc_id_llcs_id_fk" FOREIGN KEY ("llc_id") REFERENCES "public"."llcs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_acceptances" ADD CONSTRAINT "legal_acceptances_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "llc_miembros" ADD CONSTRAINT "llc_miembros_llc_id_llcs_id_fk" FOREIGN KEY ("llc_id") REFERENCES "public"."llcs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "llc_miembros" ADD CONSTRAINT "llc_miembros_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "llcs" ADD CONSTRAINT "llcs_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_factura_id_facturas_id_fk" FOREIGN KEY ("factura_id") REFERENCES "public"."facturas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_client_id_clientes_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_id_idx" ON "admin_users" USING btree ("id");--> statement-breakpoint
CREATE INDEX "agenda_email_idx" ON "agenda" USING btree ("email");--> statement-breakpoint
CREATE INDEX "agenda_fecha_reunion_idx" ON "agenda" USING btree ("fecha_reunion");--> statement-breakpoint
CREATE INDEX "agenda_estado_idx" ON "agenda" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "agenda_email_fecha_reunion_idx" ON "agenda" USING btree ("email","fecha_reunion");--> statement-breakpoint
CREATE INDEX "agenda_manage_token_idx" ON "agenda" USING btree ("manage_token");--> statement-breakpoint
CREATE INDEX "agenda_hora_inicio_idx" ON "agenda" USING btree ("hora_inicio");--> statement-breakpoint
CREATE INDEX "agenda_fecha_creacion_idx" ON "agenda" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "agenda_estado_fecha_idx" ON "agenda" USING btree ("estado","fecha_reunion");--> statement-breakpoint
CREATE INDEX "alertas_fiscales_client_id_idx" ON "alertas_fiscales" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "alertas_fiscales_llc_id_idx" ON "alertas_fiscales" USING btree ("llc_id");--> statement-breakpoint
CREATE INDEX "alertas_fiscales_tax_calendar_id_idx" ON "alertas_fiscales" USING btree ("tax_calendar_id");--> statement-breakpoint
CREATE INDEX "alertas_fiscales_tipo_dias_idx" ON "alertas_fiscales" USING btree ("tipo","dias_antes");--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("admin_user");--> statement-breakpoint
CREATE INDEX "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "calculadora_email_idx" ON "calculadora" USING btree ("email");--> statement-breakpoint
CREATE INDEX "calculadora_fecha_creacion_idx" ON "calculadora" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "calculadora_pais_idx" ON "calculadora" USING btree ("pais");--> statement-breakpoint
CREATE INDEX "calendario_fiscal_client_id_idx" ON "calendario_fiscal" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "calendario_fiscal_llc_id_idx" ON "calendario_fiscal" USING btree ("llc_id");--> statement-breakpoint
CREATE INDEX "calendario_fiscal_fecha_limite_idx" ON "calendario_fiscal" USING btree ("fecha_limite");--> statement-breakpoint
CREATE INDEX "calendario_fiscal_estado_anio_idx" ON "calendario_fiscal" USING btree ("estado","anio");--> statement-breakpoint
CREATE UNIQUE INDEX "calendario_fiscal_llc_tipo_anio_uniq" ON "calendario_fiscal" USING btree ("llc_id","tipo","anio");--> statement-breakpoint
CREATE UNIQUE INDEX "clientes_email_idx" ON "clientes" USING btree ("email");--> statement-breakpoint
CREATE INDEX "clientes_estado_idx" ON "clientes" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "clientes_unsub_token_idx" ON "clientes" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "clientes_fecha_creacion_idx" ON "clientes" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "comisiones_estado_idx" ON "comisiones" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "comisiones_fecha_creacion_idx" ON "comisiones" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "comisiones_client_id_idx" ON "comisiones" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "comisiones_invoice_id_idx" ON "comisiones" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "comisiones_usuario_idx" ON "comisiones" USING btree ("usuario");--> statement-breakpoint
CREATE INDEX "comisiones_usuario_estado_idx" ON "comisiones" USING btree ("usuario","estado");--> statement-breakpoint
CREATE INDEX "consentimientos_email_idx" ON "consentimientos" USING btree ("email");--> statement-breakpoint
CREATE INDEX "dias_bloqueados_fecha_idx" ON "dias_bloqueados" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "documentos_client_id_idx" ON "documentos" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "documentos_llc_id_idx" ON "documentos" USING btree ("llc_id");--> statement-breakpoint
CREATE INDEX "documentos_client_tipo_idx" ON "documentos" USING btree ("client_id","tipo");--> statement-breakpoint
CREATE INDEX "documentos_client_llc_idx" ON "documentos" USING btree ("client_id","llc_id");--> statement-breakpoint
CREATE INDEX "emails_para_idx" ON "emails" USING btree ("para");--> statement-breakpoint
CREATE INDEX "emails_fecha_creacion_idx" ON "emails" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "emails_related_idx" ON "emails" USING btree ("related_id","related_type");--> statement-breakpoint
CREATE INDEX "emails_tipo_idx" ON "emails" USING btree ("tipo");--> statement-breakpoint
CREATE INDEX "emails_canal_idx" ON "emails" USING btree ("canal");--> statement-breakpoint
CREATE INDEX "facturas_client_id_idx" ON "facturas" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "facturas_lead_id_idx" ON "facturas" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "facturas_estado_idx" ON "facturas" USING btree ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "facturas_invoice_id_idx" ON "facturas" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "facturas_llc_id_idx" ON "facturas" USING btree ("llc_id");--> statement-breakpoint
CREATE INDEX "facturas_fecha_creacion_idx" ON "facturas" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "facturas_numero_idx" ON "facturas" USING btree ("numero");--> statement-breakpoint
CREATE INDEX "facturas_fecha_emision_idx" ON "facturas" USING btree ("fecha_emision");--> statement-breakpoint
CREATE INDEX "facturas_fecha_vencimiento_idx" ON "facturas" USING btree ("fecha_vencimiento");--> statement-breakpoint
CREATE INDEX "facturas_client_estado_idx" ON "facturas" USING btree ("client_id","estado");--> statement-breakpoint
CREATE INDEX "gastos_negocio_fecha_idx" ON "gastos_negocio" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "gastos_negocio_categoria_idx" ON "gastos_negocio" USING btree ("categoria");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_cliente_id_idx" ON "leads" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "leads_cerrado_idx" ON "leads" USING btree ("cerrado");--> statement-breakpoint
CREATE INDEX "leads_fecha_creacion_idx" ON "leads" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "leads_telefono_idx" ON "leads" USING btree ("telefono");--> statement-breakpoint
CREATE INDEX "leads_fuente_idx" ON "leads" USING btree ("fuente");--> statement-breakpoint
CREATE INDEX "leads_producto_idx" ON "leads" USING btree ("producto");--> statement-breakpoint
CREATE INDEX "leads_etapa_pipeline_idx" ON "leads" USING btree ("etapa_pipeline");--> statement-breakpoint
CREATE INDEX "leads_temperatura_idx" ON "leads" USING btree ("temperatura");--> statement-breakpoint
CREATE INDEX "leads_proximo_seguimiento_idx" ON "leads" USING btree ("proximo_seguimiento");--> statement-breakpoint
CREATE INDEX "leads_asignado_a_idx" ON "leads" USING btree ("asignado_a");--> statement-breakpoint
CREATE INDEX "leads_pipeline_temp_idx" ON "leads" USING btree ("etapa_pipeline","temperatura");--> statement-breakpoint
CREATE INDEX "legal_acceptances_client_idx" ON "legal_acceptances" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "legal_acceptances_email_idx" ON "legal_acceptances" USING btree ("email");--> statement-breakpoint
CREATE INDEX "legal_acceptances_type_idx" ON "legal_acceptances" USING btree ("doc_type");--> statement-breakpoint
CREATE INDEX "legal_doc_versions_type_idx" ON "legal_document_versions" USING btree ("doc_type");--> statement-breakpoint
CREATE INDEX "llc_miembros_llc_id_idx" ON "llc_miembros" USING btree ("llc_id");--> statement-breakpoint
CREATE INDEX "llc_miembros_client_id_idx" ON "llc_miembros" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "llc_miembros_llc_email_unique_idx" ON "llc_miembros" USING btree ("llc_id","email");--> statement-breakpoint
CREATE INDEX "llcs_client_id_idx" ON "llcs" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "llcs_estado_idx" ON "llcs" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "llcs_status_idx" ON "llcs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "llcs_ein_unique_idx" ON "llcs" USING btree ("ein");--> statement-breakpoint
CREATE INDEX "llcs_ein_hash_idx" ON "llcs" USING btree ("ein_hash");--> statement-breakpoint
CREATE INDEX "llcs_fecha_creacion_idx" ON "llcs" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "login_attempts_email_idx" ON "login_attempts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "login_attempts_fecha_creacion_idx" ON "login_attempts" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "login_attempts_event_fecha_idx" ON "login_attempts" USING btree ("event_type","fecha_creacion");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_suscriptores" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_unsub_token_idx" ON "newsletter_suscriptores" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "notificaciones_client_idx" ON "notificaciones" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "notificaciones_leida_idx" ON "notificaciones" USING btree ("leida");--> statement-breakpoint
CREATE INDEX "pagos_client_id_idx" ON "pagos" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "pagos_factura_id_idx" ON "pagos" USING btree ("factura_id");--> statement-breakpoint
CREATE INDEX "pagos_fecha_pago_idx" ON "pagos" USING btree ("fecha_pago");--> statement-breakpoint
CREATE UNIQUE INDEX "revoked_sessions_sid_idx" ON "revoked_admin_sessions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "timeline_client_id_idx" ON "timeline" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "tokens_client_id_idx" ON "tokens" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "tokens_token_idx" ON "tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "tokens_tipo_idx" ON "tokens" USING btree ("tipo");--> statement-breakpoint
CREATE INDEX "tokens_token_tipo_used_idx" ON "tokens" USING btree ("token","tipo","used");--> statement-breakpoint
CREATE INDEX "tokens_client_token_tipo_idx" ON "tokens" USING btree ("client_id","token","tipo");--> statement-breakpoint
CREATE INDEX "tokens_expires_at_idx" ON "tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "visitas_ip_idx" ON "visitas" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "visitas_fecha_creacion_idx" ON "visitas" USING btree ("fecha_creacion");