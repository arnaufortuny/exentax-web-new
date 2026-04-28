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
	"estado" text DEFAULT 'pending',
	"consentimiento_fecha_hora" text,
	"beneficio_mensual" text,
	"clientes_mundiales" text,
	"opera_digital" text,
	"nota_compartir" text,
	"compromiso_asistir" text,
	"manage_token" text,
	"reminder_sent" boolean DEFAULT false,
	"idioma_booking" text,
	"meeting_type" text DEFAULT 'google_meet',
	"reschedule_count" integer DEFAULT 0,
	"last_rescheduled_at" text,
	"cancelled_at" text,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "agenda_status_check" CHECK ("agenda"."estado" IS NULL OR "agenda"."estado" IN ('pending','contacted','in_progress','closed','cancelled','rescheduled','no_show')),
	CONSTRAINT "agenda_meeting_type_check" CHECK ("agenda"."meeting_type" IS NULL OR "agenda"."meeting_type" IN ('google_meet','phone_call'))
);
--> statement-breakpoint
CREATE TABLE "agenda_admin_actions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"booking_id" varchar(64),
	"actor_discord_id" text NOT NULL,
	"actor_discord_name" text,
	"action" text NOT NULL,
	"payload" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blocked_days" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"fecha" text,
	"motivo" text,
	"creado_por" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "booking_drafts" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"nombre" text,
	"idioma" text,
	"ip" text,
	"user_agent" text,
	"reminder_sent_at" text,
	"completed_at" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "calculations" (
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
	"display_currency" text,
	"opciones" text,
	"mejor_estructura" text,
	"ahorro_llc_vs_autonomo" text,
	"ahorro_llc_vs_sociedad" text,
	"expense_items" text,
	"custom_expenses" text,
	"privacidad" boolean DEFAULT false,
	"marketing" boolean DEFAULT false,
	"ip" text,
	"user_agent" text,
	"locale" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "consent_log" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"form_type" text NOT NULL,
	"email" text,
	"privacy_accepted" boolean NOT NULL,
	"marketing_accepted" boolean,
	"timestamp" text NOT NULL,
	"idioma" text,
	"source" text,
	"privacy_version" text,
	"ip" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_retry_queue" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"email_type" text NOT NULL,
	"payload" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 6 NOT NULL,
	"last_error" text,
	"next_attempt_at" text NOT NULL,
	"claimed_at" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
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
	"actividad_economica" text,
	"beneficio_estimado" text,
	"ip" text,
	"consentimiento_fecha_hora" text,
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
CREATE TABLE "newsletter_campaign_jobs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"campaign_id" varchar(64) NOT NULL,
	"subscriber_id" varchar(64) NOT NULL,
	"email" text NOT NULL,
	"unsubscribe_token" text,
	"status" text DEFAULT 'pending',
	"attempts" integer DEFAULT 0,
	"last_error" text,
	"attempted_at" timestamp,
	"sent_at" timestamp,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_jobs_status_check" CHECK ("newsletter_campaign_jobs"."status" IN ('pending','sending','sent','failed','skipped'))
);
--> statement-breakpoint
CREATE TABLE "newsletter_campaigns" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"body_html" text NOT NULL,
	"body_text" text,
	"language" text,
	"status" text DEFAULT 'queued',
	"total_recipients" integer DEFAULT 0,
	"sent_count" integer DEFAULT 0,
	"failed_count" integer DEFAULT 0,
	"created_by" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"fecha_creacion" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_campaigns_status_check" CHECK ("newsletter_campaigns"."status" IN ('queued','in_progress','completed','cancelled','failed'))
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
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
CREATE TABLE "seo_rankings" (
	"id" serial PRIMARY KEY NOT NULL,
	"snapshot_date" text NOT NULL,
	"slug" text NOT NULL,
	"lang" text NOT NULL,
	"keyword" text NOT NULL,
	"page_url" text NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"ctr" text DEFAULT '0' NOT NULL,
	"position" text DEFAULT '0' NOT NULL,
	"has_data" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "visits" (
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
	"dispositivo" text,
	"session_id" text,
	"fecha_creacion" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agenda_admin_actions" ADD CONSTRAINT "agenda_admin_actions_booking_id_agenda_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."agenda"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_campaign_jobs" ADD CONSTRAINT "newsletter_campaign_jobs_campaign_id_newsletter_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."newsletter_campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "newsletter_campaign_jobs" ADD CONSTRAINT "newsletter_campaign_jobs_subscriber_id_newsletter_subscribers_id_fk" FOREIGN KEY ("subscriber_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agenda_email_idx" ON "agenda" USING btree ("email");--> statement-breakpoint
CREATE INDEX "agenda_fecha_reunion_idx" ON "agenda" USING btree ("fecha_reunion");--> statement-breakpoint
CREATE INDEX "agenda_estado_idx" ON "agenda" USING btree ("estado");--> statement-breakpoint
CREATE INDEX "agenda_email_fecha_reunion_idx" ON "agenda" USING btree ("email","fecha_reunion");--> statement-breakpoint
CREATE INDEX "agenda_manage_token_idx" ON "agenda" USING btree ("manage_token");--> statement-breakpoint
CREATE INDEX "agenda_hora_inicio_idx" ON "agenda" USING btree ("hora_inicio");--> statement-breakpoint
CREATE INDEX "agenda_fecha_creacion_idx" ON "agenda" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "agenda_estado_fecha_idx" ON "agenda" USING btree ("estado","fecha_reunion");--> statement-breakpoint
CREATE UNIQUE INDEX "agenda_active_slot_uniq_idx" ON "agenda" USING btree ("fecha_reunion","hora_inicio") WHERE "agenda"."estado" IS NULL OR "agenda"."estado" NOT IN ('cancelled','no_show');--> statement-breakpoint
CREATE INDEX "agenda_admin_actions_booking_idx" ON "agenda_admin_actions" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "agenda_admin_actions_actor_idx" ON "agenda_admin_actions" USING btree ("actor_discord_id");--> statement-breakpoint
CREATE INDEX "agenda_admin_actions_created_at_idx" ON "agenda_admin_actions" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "blocked_days_date_idx" ON "blocked_days" USING btree ("fecha");--> statement-breakpoint
CREATE INDEX "booking_drafts_email_idx" ON "booking_drafts" USING btree ("email");--> statement-breakpoint
CREATE INDEX "booking_drafts_created_at_idx" ON "booking_drafts" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "booking_drafts_reminder_sent_at_idx" ON "booking_drafts" USING btree ("reminder_sent_at");--> statement-breakpoint
CREATE INDEX "booking_drafts_completed_at_idx" ON "booking_drafts" USING btree ("completed_at");--> statement-breakpoint
CREATE INDEX "booking_drafts_pending_sweep_idx" ON "booking_drafts" USING btree ("fecha_creacion") WHERE "booking_drafts"."completed_at" IS NULL AND "booking_drafts"."reminder_sent_at" IS NULL;--> statement-breakpoint
CREATE INDEX "calculations_email_idx" ON "calculations" USING btree ("email");--> statement-breakpoint
CREATE INDEX "calculations_created_at_idx" ON "calculations" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "calculations_country_idx" ON "calculations" USING btree ("pais");--> statement-breakpoint
CREATE INDEX "consent_log_email_idx" ON "consent_log" USING btree ("email");--> statement-breakpoint
CREATE INDEX "consent_log_form_type_idx" ON "consent_log" USING btree ("form_type");--> statement-breakpoint
CREATE INDEX "consent_log_created_at_idx" ON "consent_log" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "email_retry_next_attempt_idx" ON "email_retry_queue" USING btree ("next_attempt_at");--> statement-breakpoint
CREATE INDEX "email_retry_type_idx" ON "email_retry_queue" USING btree ("email_type");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_fecha_creacion_idx" ON "leads" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE INDEX "leads_telefono_idx" ON "leads" USING btree ("telefono");--> statement-breakpoint
CREATE INDEX "leads_fuente_idx" ON "leads" USING btree ("fuente");--> statement-breakpoint
CREATE INDEX "legal_doc_versions_type_idx" ON "legal_document_versions" USING btree ("doc_type");--> statement-breakpoint
CREATE INDEX "legal_doc_versions_effective_date_idx" ON "legal_document_versions" USING btree ("effective_date");--> statement-breakpoint
CREATE INDEX "legal_doc_versions_created_at_idx" ON "legal_document_versions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "newsletter_jobs_campaign_idx" ON "newsletter_campaign_jobs" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "newsletter_jobs_status_idx" ON "newsletter_campaign_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "newsletter_jobs_campaign_status_idx" ON "newsletter_campaign_jobs" USING btree ("campaign_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_jobs_campaign_subscriber_uniq" ON "newsletter_campaign_jobs" USING btree ("campaign_id","subscriber_id");--> statement-breakpoint
CREATE INDEX "newsletter_campaigns_status_idx" ON "newsletter_campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "newsletter_campaigns_created_at_idx" ON "newsletter_campaigns" USING btree ("fecha_creacion");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_unsub_token_idx" ON "newsletter_subscribers" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE INDEX "newsletter_subs_active_idx" ON "newsletter_subscribers" USING btree ("unsubscribed_at") WHERE "newsletter_subscribers"."unsubscribed_at" IS NULL;--> statement-breakpoint
CREATE INDEX "seo_rankings_snapshot_idx" ON "seo_rankings" USING btree ("snapshot_date");--> statement-breakpoint
CREATE INDEX "seo_rankings_slug_lang_idx" ON "seo_rankings" USING btree ("slug","lang");--> statement-breakpoint
CREATE UNIQUE INDEX "seo_rankings_snapshot_slug_lang_idx" ON "seo_rankings" USING btree ("snapshot_date","slug","lang");--> statement-breakpoint
CREATE INDEX "visits_ip_idx" ON "visits" USING btree ("ip");--> statement-breakpoint
CREATE INDEX "visits_created_at_idx" ON "visits" USING btree ("fecha_creacion");