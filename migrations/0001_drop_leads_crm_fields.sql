-- Remove CRM/admin/SaaS residue from leads table.
-- These columns were used by the removed admin portal, CRM pipeline, and client
-- onboarding flow. None are written or read by any public-web route.

-- Drop indexes that reference removed columns
DROP INDEX IF EXISTS "leads_cliente_id_idx";
DROP INDEX IF EXISTS "leads_producto_idx";
DROP INDEX IF EXISTS "leads_etapa_pipeline_idx";
DROP INDEX IF EXISTS "leads_temperatura_idx";
DROP INDEX IF EXISTS "leads_proximo_seguimiento_idx";
DROP INDEX IF EXISTS "leads_asignado_a_idx";
DROP INDEX IF EXISTS "leads_pipeline_temp_idx";

-- Drop pipeline-stage check constraint
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_pipeline_stage_check";

-- Drop CRM pipeline fields
ALTER TABLE "leads" DROP COLUMN IF EXISTS "etapa_pipeline";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "temperatura";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "proximo_seguimiento";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "proxima_accion";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "razon_perdida";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "asignado_a";

-- Drop client-portal / onboarding fields
ALTER TABLE "leads" DROP COLUMN IF EXISTS "cliente_id";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "fecha_cierre";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "trustpilot_enviado";

-- Drop internal sales/billing fields never populated by public routes
ALTER TABLE "leads" DROP COLUMN IF EXISTS "producto";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "facturacion";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "contabilidad";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "notas";

-- Drop personal document fields (admin-only, never collected via public forms)
ALTER TABLE "leads" DROP COLUMN IF EXISTS "fecha_nacimiento";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "dni";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "tax_id";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "id_type";

-- Drop address fields (admin-only, never populated by public routes)
ALTER TABLE "leads" DROP COLUMN IF EXISTS "pais";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "ciudad";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "direccion";
ALTER TABLE "leads" DROP COLUMN IF EXISTS "codigo_postal";

-- Drop language field (always defaulted to 'es', never written by public routes)
ALTER TABLE "leads" DROP COLUMN IF EXISTS "idioma";
