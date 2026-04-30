-- Task #28 (2026-04-30): partial UNIQUE on `leads(email)`.
--
-- Belt-and-braces against the duplicate-lead bug Task #18 fixed in
-- application code. The `withLeadEmailLock` wrapper (process-local in
-- dev, Redis-backed in production) already serialises concurrent writes
-- for the same email; this DB-level constraint makes a duplicate row
-- physically impossible if the lock store ever degrades.
--
-- Pre-cleanup merges any legacy duplicate rows (none expected on a
-- healthy production DB post Task #18, but defensive). Strategy: keep
-- the OLDEST row per email by `fecha_creacion`, OR-merge the boolean
-- flags from each duplicate into the survivor so we never lose
-- `uso_calculadora=true` or `agendo_llamada=true` set on a younger
-- row, then DELETE the rest. The dedup runs in a single statement so
-- it is atomic with the index creation that follows.
--
-- The matching idempotent runtime fallback lives in
-- `server/db.ts:runColumnMigrations` so legacy production DBs that
-- never run drizzle-kit migrate still converge on the same schema.

WITH dups AS (
  SELECT id,
         email,
         row_number() OVER (
           PARTITION BY email
           ORDER BY fecha_creacion ASC NULLS LAST, id ASC
         ) AS rn
  FROM leads
  WHERE email IS NOT NULL AND email <> ''
),
survivors AS (
  SELECT email, id AS keep_id FROM dups WHERE rn = 1
),
merge AS (
  SELECT s.keep_id,
         bool_or(COALESCE(l.uso_calculadora, false))    AS uso_calculadora,
         bool_or(COALESCE(l.agendo_llamada, false))     AS agendo_llamada,
         bool_or(COALESCE(l.privacidad_aceptada, false)) AS privacidad_aceptada,
         bool_or(COALESCE(l.terminos_aceptados, false))  AS terminos_aceptados,
         bool_or(COALESCE(l.marketing_aceptado, false))  AS marketing_aceptado
  FROM survivors s
  JOIN leads l ON l.email = s.email
  GROUP BY s.keep_id
),
merged AS (
  UPDATE leads l
    SET uso_calculadora     = m.uso_calculadora,
        agendo_llamada      = m.agendo_llamada,
        privacidad_aceptada = m.privacidad_aceptada,
        terminos_aceptados  = m.terminos_aceptados,
        marketing_aceptado  = m.marketing_aceptado
    FROM merge m
    WHERE l.id = m.keep_id
      AND EXISTS (
        SELECT 1 FROM dups d WHERE d.email = l.email AND d.rn > 1
      )
    RETURNING l.id
)
DELETE FROM leads
  WHERE id IN (SELECT id FROM dups WHERE rn > 1);

CREATE UNIQUE INDEX IF NOT EXISTS leads_email_uniq_idx
  ON leads (email)
  WHERE email <> '';
