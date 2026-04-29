/**
 * Recordatorio "Reserva incompleta" — Exentax Web
 *
 * Sweep periódico que recoge los drafts de booking generados al introducir
 * el email en el formulario (`/api/bookings/draft`) que ya tienen la edad
 * mínima sin completar y dispara `sendIncompleteBookingEmail` a esa dirección.
 *
 * Pasos por iteración:
 *  1. `getBookingDraftsForReminder()` — drafts >= MIN_AGE_MS y <= MAX_AGE_MS
 *     sin reminder enviado, sin completedAt, y cuyo email no pertenece ya a
 *     una agenda activa.
 *  2. `claimBookingDraftReminder(id)` — reclamo atómico: solo el worker que
 *     marca `reminder_sent_at` con éxito procede al envío.
 *  3. `sendIncompleteBookingEmail(...)` con el idioma persistido del draft.
 *  4. Si el envío falla, `unclaimBookingDraftReminder(id)` libera el reclamo
 *     para reintentar en el siguiente sweep.
 *
 * Cadencia: cada 5 minutos por defecto. Idempotente y seguro de ejecutar
 * en paralelo entre instancias gracias al reclamo atómico.
 */

import { logger } from "../logger";
import {
  getBookingDraftsForReminder,
  claimBookingDraftReminder,
  unclaimBookingDraftReminder,
} from "../storage";
import { sendIncompleteBookingEmail } from "../email";

const SWEEP_INTERVAL_MS = 5 * 60_000;
const MIN_AGE_MS = 30 * 60_000;       // esperar 30 min tras el draft
const MAX_AGE_MS = 24 * 60 * 60_000;  // descartar drafts > 24h
const BATCH_LIMIT = 25;

let _running = false;

export async function runIncompleteBookingsSweep(): Promise<{ scanned: number; sent: number; failed: number }> {
  if (_running) return { scanned: 0, sent: 0, failed: 0 };
  _running = true;
  let scanned = 0;
  let sent = 0;
  let failed = 0;
  try {
    const drafts = await getBookingDraftsForReminder({ minAgeMs: MIN_AGE_MS, maxAgeMs: MAX_AGE_MS, limit: BATCH_LIMIT });
    scanned = drafts.length;
    for (const draft of drafts) {
      const claimed = await claimBookingDraftReminder(draft.id);
      if (!claimed) continue; // otra instancia ya lo reclamó
      try {
        await sendIncompleteBookingEmail({
          clientEmail: draft.email,
          clientName: draft.name,
          language: draft.language,
        });
        sent++;
      } catch (err) {
        failed++;
        logger.warn(
          `Incomplete-booking send failed for draft ${draft.id}: ${err instanceof Error ? err.message : String(err)} — releasing claim for retry`,
          "incomplete-booking",
        );
        try { await unclaimBookingDraftReminder(draft.id); } catch (unclaimErr) {
          logger.error(`Failed to unclaim draft ${draft.id}`, "incomplete-booking", unclaimErr);
        }
      }
    }
    if (scanned > 0) {
      logger.info(`Incomplete-booking sweep: scanned=${scanned} sent=${sent} failed=${failed}`, "incomplete-booking");
    }
    return { scanned, sent, failed };
  } catch (err) {
    logger.error("Incomplete-booking sweep crashed", "incomplete-booking", err);
    return { scanned, sent, failed };
  } finally {
    _running = false;
  }
}

export function startIncompleteBookingsScheduler(): NodeJS.Timeout {
  // Primera pasada con un pequeño delay para dejar que arranque el resto.
  // `.unref()` para que este timer no impida que el proceso salga si
  // recibe SIGTERM dentro de los primeros 30 s (mismo patrón que
  // drip-worker, email-retry-queue, reconcile-zombies y periodic-reports).
  setTimeout(() => { void runIncompleteBookingsSweep(); }, 30_000).unref();
  const handle = setInterval(() => { void runIncompleteBookingsSweep(); }, SWEEP_INTERVAL_MS);
  return handle;
}
