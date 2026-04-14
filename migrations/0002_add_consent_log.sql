-- Consent audit log: records every consent event for GDPR traceability.
-- Captures form submissions (booking, calculator, newsletter), cookie banner
-- decisions, and any future consent touch-points.

CREATE TABLE IF NOT EXISTS "consent_log" (
  "id"                  varchar(64)   PRIMARY KEY,
  "form_type"           text          NOT NULL,
  "email"               text,
  "privacy_accepted"    boolean       NOT NULL,
  "marketing_accepted"  boolean,
  "timestamp"           text          NOT NULL,
  "idioma"              text,
  "source"              text,
  "privacy_version"     text,
  "ip"                  text,
  "fecha_creacion"      timestamp     DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "consent_log_email_idx"      ON "consent_log" ("email");
CREATE INDEX IF NOT EXISTS "consent_log_form_type_idx"  ON "consent_log" ("form_type");
CREATE INDEX IF NOT EXISTS "consent_log_created_at_idx" ON "consent_log" ("fecha_creacion");
