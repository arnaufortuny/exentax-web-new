-- Rename tables from Spanish to English
ALTER TABLE IF EXISTS "visitas" RENAME TO "visits";
ALTER TABLE IF EXISTS "calculadora" RENAME TO "calculations";
ALTER TABLE IF EXISTS "dias_bloqueados" RENAME TO "blocked_days";
ALTER TABLE IF EXISTS "newsletter_suscriptores" RENAME TO "newsletter_subscribers";

-- Rename indexes to match new English table names
ALTER INDEX IF EXISTS "calculadora_email_idx" RENAME TO "calculations_email_idx";
ALTER INDEX IF EXISTS "calculadora_fecha_creacion_idx" RENAME TO "calculations_created_at_idx";
ALTER INDEX IF EXISTS "calculadora_pais_idx" RENAME TO "calculations_country_idx";
ALTER INDEX IF EXISTS "visitas_ip_idx" RENAME TO "visits_ip_idx";
ALTER INDEX IF EXISTS "visitas_fecha_creacion_idx" RENAME TO "visits_created_at_idx";
ALTER INDEX IF EXISTS "dias_bloqueados_fecha_idx" RENAME TO "blocked_days_date_idx";

-- Drop old CHECK constraint FIRST (before updating values)
ALTER TABLE "agenda" DROP CONSTRAINT IF EXISTS "agenda_status_check";

-- Migrate status values from Spanish to English
UPDATE "agenda" SET "estado" = 'pending'     WHERE "estado" = 'Pendiente';
UPDATE "agenda" SET "estado" = 'contacted'   WHERE "estado" = 'Contactado';
UPDATE "agenda" SET "estado" = 'in_progress' WHERE "estado" = 'En proceso';
UPDATE "agenda" SET "estado" = 'closed'      WHERE "estado" = 'Cerrado';
UPDATE "agenda" SET "estado" = 'cancelled'   WHERE "estado" IN ('Cancelada', 'Cancelado');
UPDATE "agenda" SET "estado" = 'rescheduled' WHERE "estado" = 'Reagendada';
UPDATE "agenda" SET "estado" = 'no_show'     WHERE "estado" = 'No presentado';

-- Add new CHECK constraint with English values
ALTER TABLE "agenda" ADD CONSTRAINT "agenda_status_check"
  CHECK ("estado" IS NULL OR "estado" IN ('pending','contacted','in_progress','closed','cancelled','rescheduled','no_show'));

-- Update default value for status column
ALTER TABLE "agenda" ALTER COLUMN "estado" SET DEFAULT 'pending';
