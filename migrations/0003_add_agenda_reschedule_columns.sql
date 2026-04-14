-- Add reschedule tracking columns to agenda table (defined in schema but missing from initial migration)
-- Add missing indexes to legal_document_versions for effectiveDate queries

ALTER TABLE "agenda"
  ADD COLUMN IF NOT EXISTS "reschedule_count" integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "last_rescheduled_at" text,
  ADD COLUMN IF NOT EXISTS "cancelled_at" text;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "legal_doc_versions_effective_date_idx" ON "legal_document_versions" USING btree ("effective_date");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "legal_doc_versions_created_at_idx" ON "legal_document_versions" USING btree ("created_at");
