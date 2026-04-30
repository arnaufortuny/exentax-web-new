---
title: "Auditoría #19 · Mapa de envíos de email (routing, dedupe, política)"
scope: "Tarea #19 — todos los caminos de envío de email del web app Exentax"
date: "2026-04-29"
mode: "audit, no rewrites"
out_of_scope:
  - "Contenido / CTAs / traducciones de los emails (#4)"
  - "Esquema de tablas de email (#5)"
  - "SEO de plantillas (#7)"
---

# Auditoría #19 · Routing y dedupe de emails — pre-producción 2026-04

> Una sola fila por **tipo** de email saliente. La columna *Trigger*
> identifica el origen exacto (ruta HTTP, handler de Discord, cron) que
> dispara el envío; *Dedupe key* es el mecanismo durable que garantiza
> que el mismo evento no produce dos envíos; *Header policy* es el
> identificador en `headerPolicyFor(...)` que rige el bloque de
> cabeceras de deliverability (Auto-Submitted / Precedence /
> List-Unsubscribe). Los detalles de copy / asunto se auditan en la
> tarea hermana #4.

---

## 1. Identidades remitentes y reply-to

Definidas en `server/email/transport.ts` (`FROM_NAME_BY_FAMILY`) y
resueltas vía `senderNameFor(identity)`. Todas usan el mismo buzón
físico (`CONTACT_EMAIL`); sólo cambia el `display name` del header
`From:` y el `Reply-To:`.

| Identidad        | `From` display name              | `Reply-To`                     | Quién la usa |
|------------------|----------------------------------|--------------------------------|--------------|
| `transactional`  | `Claudia Hinojosa · Exentax`     | `CONTACT_EMAIL`                | Confirmación, recordatorio, reschedule, cancelación, no-show, follow-up, incomplete-booking |
| `drip`           | `Claudia · Exentax`              | `CONTACT_EMAIL`                | Drip guía (6 pasos) y drip calculadora (3 pasos) |
| `newsletter`     | `Exentax`                        | `GMAIL_SENDER` (fallback `CONTACT_EMAIL`) | Newsletter broadcast |

Adicionalmente la calculadora envía con `senderNameFor("transactional")`
(es un 1:1 firmado por Claudia) pero monta la política de cabeceras
`marketing-1to1` (ver §3).

---

## 2. Política de cabeceras (`headerPolicyFor`)

Tabla declarativa única — fuente de verdad para la auditoría de
deliverability (`scripts/audit/lint-email-deliverability.mjs`):

| Familia          | `Auto-Submitted`    | `Precedence` | `List-Unsubscribe` | Footer visible "Darse de baja" |
|------------------|---------------------|--------------|--------------------|--------------------------------|
| `transactional`  | `auto-generated`    | —            | —                  | No (sólo nota "recibes esto porque…") |
| `marketing-1to1` | `auto-generated`    | —            | mailto             | Sí (`unsubFooterWithLink`)     |
| `marketing-bulk` | `auto-generated`    | `bulk`       | HTTPS one-click + footer link (legacy: mailto fallback) | Sí (`unsubFooterWithLink`) |

`List-Unsubscribe-Post: One-Click` (RFC 8058) sólo se emite cuando el
valor de `List-Unsubscribe` es HTTPS, gating dentro de `buildRaw()` —
los mailto nunca disparan POST one-click. Cabeceras `From`,
`Reply-To`, `X-Entity-Ref-ID` se imponen siempre via `sendEmail()` y
están centralizadas en `transport.ts`.

---

## 3. Resolución de idioma

Centralizada en `server/email-i18n.ts:resolveEmailLang(lang)`. Acepta
`SUPPORTED_LANGS = ["es","en","fr","de","pt","ca"]`; cualquier valor
fuera del set (incluyendo `null`/`undefined`) cae a **`es`**.

Origen del `language` por trigger:

| Trigger                           | Fuente del campo language                                  |
|-----------------------------------|------------------------------------------------------------|
| `POST /api/bookings/book`         | body.language → fila `agenda.language` → payload del email |
| Recordatorio (cron + timer)       | `agenda.language` cargado por `getFutureAgenda()`          |
| `POST /api/booking/:id/reschedule`| `agenda.language` actual                                   |
| `POST /api/booking/:id/cancel`    | `agenda.language` actual                                   |
| Reschedule / cancel desde Discord | `agenda.language` (handler `booking-actions.ts`)           |
| Manual (`/cita email tipo:*`)     | `agenda.language` (con fallback `es` en el slash command)  |
| `POST /api/calculator-leads`      | body.language (`parsed.data.language`)                     |
| `POST /api/newsletter/subscribe`  | body.language → `drip_enrollments.language`                |
| Drip-worker (guía y calculadora)  | `drip_enrollments.language` persistido al enrollment       |
| Cron incomplete-bookings          | `booking_drafts.language` persistido al crear el draft     |
| Newsletter broadcast              | Idioma fijado en la campaña (HTML servido tal cual)        |

---

## 4. Tabla maestra — un envío por fila

> Convención: "✓ retry queue" = se enruta por `withRetryQueue` →
> `enqueueEmail(...)` con backoff `1m → 5m → 15m → 1h → 4h → 12h`,
> 6 intentos (`MAX_ATTEMPTS=6` en `server/email-retry-queue.ts:31`).
> "Self-managed" = el cron/worker tiene su propia tabla de
> checkpoints y no toca `email_retry_queue`. El worker de newsletter
> usa **su propio** `MAX_ATTEMPTS=3`
> (`server/scheduled/newsletter-broadcast.ts:32`) — distinto del de la
> retry queue.

| # | Email (template)            | Trigger (ruta · cron · handler)                                                                                                                            | Condiciones                                                                                                                                                                                                  | Recipients                                  | From identity        | Header policy                                            | Idioma resuelto                                            | Dedupe key (durable)                                                                                                                                                                  | Retry / backoff                                                                              | Cobertura test                                                          |
|---|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|----------------------|-----------------------------------------------------------|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| 1 | `booking_confirmation`      | `POST /api/bookings/book` (`server/routes/public.ts:678`) — `enqueueEmail(..., {tx, immediate:true})` dentro de la misma transacción que el insert de agenda | Slot libre (lock), `manageToken` válido, slot no en pasado. Si la tx aborta, la fila de email también — sin orfanatos.                                                                                       | Cliente (1)                                  | `transactional`      | `transactional` + `entityRefId=booking-confirmation-<id>` | `agenda.language` (resuelto a `es` si null/no soportado)   | Capas: (a) `withSlotLock` + `hasExistingBooking` evitan doble insert de agenda; (b) `enqueueEmail({tx})` ata la fila de retry queue al commit del insert (rollback ⇒ no email); (c) `entityRefId=booking-confirmation-<agendaId>` es **header** Gmail (thread dedup), NO unique constraint en `email_retry_queue`. | ✓ retry queue (low-level `sendBookingConfirmationOnce` throws → backoff)                     | `npm run test:booking` — `test-booking-e2e.ts` valida book + reenvío   |
| 1b | `booking_confirmation` (reenvío manual) | Discord `/cita email tipo:confirmation` → `sendManualEmail()` (`server/discord/handlers/booking-actions.ts:263`) — usa `enqueueEmail("booking_confirmation", ..., {immediate:true})` + `triggerEmailDrain()` | Operador autorizado (`actor` validado), reserva existe                                                                                                                                                       | Cliente (1)                                  | `transactional`      | igual a #1                                                 | `agenda.language`                                          | Mismo `email_retry_queue` que #1; `triggerEmailDrain` corta latencia                                                                                                                  | ✓ retry queue                                                                                | `npm run test:discord-regression` (acción `cita.email.confirmation`)    |
| 2 | `booking_reminder`           | a) Timer in-process programado por `scheduleReminderEmail(...)` en `server/route-helpers.ts:92` al confirmar/reagendar.<br>b) Recovery sweep en `server/index.ts:842` (`recoverPendingReminders`) al arranque y cada 60 min. | a) Disparo a `meetingMs − 24h`. Skip si `delay ≤ 0` o `delay > 2_147_483_647`. Re-fetch antes de enviar; cancela si la cita está cancelled / no_show o si el slot cambió.<br>b) `getFutureAgenda()` filtra `meetingDate ≥ hoy`, `status ∉ {cancelled,no_show}`, `reminder_sent = false`. | Cliente (1) — adjunta `.ics` y URL Google Calendar | `transactional` | `transactional` (sin `List-Unsubscribe`)                  | `agenda.language`                                           | CAS sobre la propia fila de agenda: `markReminderSent(agendaId)` (UPDATE … WHERE `reminder_sent = false`) — sólo el primer worker que gana la fila envía. Falla del envío ⇒ `unmarkReminderSent` libera el flag. | ✓ retry queue (`booking_reminder`) si la baja capa lanza                                     | `test-booking-e2e.ts` step "agenda row reminder_sent=true after claim" (idempotencia del CAS) — sweep cubierto por inspección manual + lint deliverability |
| 2b | `booking_reminder` (manual) | Discord `/cita email tipo:recordatorio` → `sendReminderEmail(...)` directo (`booking-actions.ts:282`)                                                       | Reserva tiene `meetingDate`/`startTime`/`endTime`/`email`. **No** dispara CAS — el operador se hace responsable del posible duplicado.                                                                       | Cliente (1)                                  | `transactional`      | igual a #2                                                | `agenda.language`                                          | Sin dedupe (acción consciente del operador). Logs en `email_log` permiten auditar.                                                                                                  | ✓ retry queue                                                                                | `test:discord-regression`                                              |
| 3 | `reschedule_confirmation`    | a) `POST /api/booking/:bookingId/reschedule` (`public.ts:899`).<br>b) Discord `rescheduleBooking()` envía en `booking-actions.ts:213` (función definida en `:145`).                              | Reserva no cancelada, slot futuro, slot libre tras `withBookingLock + withSlotLock`. Resetea `reminder_sent=false` y reprograma timer 24h antes del nuevo slot.                                            | Cliente (1)                                  | `transactional`      | `transactional`                                           | `agenda.language`                                          | El propio update atómico de la fila evita doble reschedule; el email es fire-and-forget (`.catch(...)`) y se confía a `withRetryQueue` ante fallo Gmail.                            | ✓ retry queue (`reschedule_notification`)                                                    | `test-booking-e2e.ts` (step 3 "POST /api/booking/:id/reschedule") + `test:discord-regression` |
| 4 | `cancellation_confirmation`  | a) `POST /api/booking/:bookingId/cancel` (`public.ts:967`).<br>b) Discord `cancelBooking()` envía en `booking-actions.ts:100` (función definida en `:80`).                                       | Reserva existe y no estaba ya cancelada (`withBookingLock` re-fetch). Cancela timer de recordatorio y borra el evento Meet.                                                                                  | Cliente (1)                                  | `transactional`      | `transactional`                                           | `agenda.language`                                          | El UPDATE atómico a `status=cancelled` es la dedupe primaria — el segundo intento devuelve `ALREADY_CANCELLED` y no envía email. `withRetryQueue` cubre transitorios Gmail.         | ✓ retry queue (`cancellation_notification`)                                                  | `test-booking-e2e.ts` step "POST /api/booking/:id/cancel" + `test:discord-regression` |
| 5 | `noshow_reschedule`          | Discord `sendManualEmail(..., tipo:"noshow")` (`booking-actions.ts:252`). El cron de `reconcile-zombies` **sólo marca status=no_show**, no envía email. | Operador decide tras pasada la cita. La marca `status=no_show` se hace en `noShowBooking()` (handler aparte, `:121`) y no envía email automáticamente.                                                              | Cliente (1)                                  | `transactional`      | `transactional`                                           | `agenda.language`                                          | Sin dedupe automática (acción manual). Repetir `cita email tipo:noshow` reenviará — operador responsable.                                                                          | ✓ retry queue (`no_show_followup`)                                                           | `test:discord-regression` (tipo `noshow`)                              |
| 6 | `post_meeting_followup`      | Discord `sendManualEmail(..., tipo:"seguimiento")` (`booking-actions.ts:297`).                                                                              | Operador lo lanza tras una reunión cerrada / contactada. No automatizado.                                                                                                                                    | Cliente (1)                                  | `transactional`      | `transactional`                                           | `agenda.language`                                          | Sin dedupe automática (acción manual). `email_log` registra cada envío.                                                                                                              | ✓ retry queue (`post_meeting_followup`)                                                      | `test:discord-regression` (tipo `seguimiento`)                         |
| 7 | `incomplete_booking_reminder`| Cron `runIncompleteBookingsSweep()` cada 5 min (`server/scheduled/incomplete-bookings.ts`).                                                                  | Draft en `booking_drafts` con edad ≥ 30 min y ≤ 24 h, `reminder_sent_at IS NULL`, `completed_at IS NULL`, y cuyo email no aparece ya en una agenda activa.                                                  | Cliente (1)                                  | `transactional`      | `transactional`                                           | `booking_drafts.language` persistido en draft               | `claimBookingDraftReminder(id)` — UPDATE atómico que sólo prospera si `reminder_sent_at` aún era NULL. Fallo del envío ⇒ `unclaimBookingDraftReminder(id)` libera para reintento.   | ✓ retry queue (`incomplete_booking_reminder`)                                                | Cobertura indirecta: `lint-email-deliverability.mjs` valida policy + `test:newsletter` cubre el formulario hermano. **No hay cobertura E2E dedicada** (gap documentado). |
| 8 | `calculator_result`          | `POST /api/calculator-leads` (`public.ts:1086`) — `sendCalculatorEmail(...).catch(...)` AFTER commit.                                                       | Tx de `leads + calculations` commit; rate-limit IP (`checkCalcRateLimit`). El envío es fire-and-forget para no bloquear la respuesta HTTP.                                                                  | Cliente (1) — calculo personalizado          | `transactional` (display name) | `marketing-1to1` (`Auto-Submitted` + mailto unsub)        | body.language → `resolveEmailLang`                          | One-shot por submit; sin dedupe formal. Repetir el submit reenvía (gobernado por `checkCalcRateLimit` y por `email-suppression`).                                                  | ✓ retry queue (`calculator_report`)                                                          | `test:calculator` (lógica) + `test:e2e` `calculator-flow.spec.ts` (form)|
| 9 | `drip_step_1` (guía, inmediato) | `POST /api/newsletter/subscribe` → `tryCreateDripEnrollment({source:"guide"})` → `sendImmediateStep1(...)` (`public.ts:1212`).                            | Suscripción nueva (`subscriber.isNew`); el insert de `drip_enrollments` usa índice único parcial sobre activos ⇒ no enrolla dos veces.                                                                       | Cliente (1)                                  | `drip`               | `marketing-bulk` + `List-Unsubscribe` HTTPS one-click + footer | body.language (`drip_enrollments.language`)              | `tryCreateDripEnrollment` (índice único parcial sobre activos) + `advanceDripEnrollment` impone `current_step = 1` después del envío inmediato.                                     | Sin retry queue: si falla, `markDripEnrollmentError` deja `current_step=0` y el worker reintenta en su próximo tick (`next_send_at` no avanza en error). | `test:newsletter` (asserts: `drip_enrollments` row, `source=guide`, `language=es`, `completed_at=null`) |
| 10 | `drip_step_2..6` (guía, drip cron) | Worker `drip-worker.ts` (`startDripWorker`, intervalo 60 s).                                                                                                | Filas `source='guide'` con `next_send_at <= now()` y `current_step ∈ [1..5]`. Cadencia 3 días. `claimDueDripEnrollments(SKIP LOCKED, staleSeconds=600)` reclama atómicamente.                              | Cliente (1)                                  | `drip`               | `marketing-bulk`                                          | `drip_enrollments.language`                                 | Claim por SQL `FOR UPDATE SKIP LOCKED` + `advanceDripEnrollment(toStep)` previene doble envío del mismo paso. Token `entityRefId=drip-<unsubToken>-step<n>` sirve a Gmail dedup.    | Self-managed: error ⇒ `markDripEnrollmentError`, `next_send_at` queda igual y se reintenta en el siguiente tick. **No** pasa por `email_retry_queue`. | `test:newsletter` valida la creación de la enrollment; ejecución del worker monitorizada por `email_log` (no hay E2E que avance el reloj) |
| 11 | `calc_drip_step_1..3`        | Worker `drip-worker.ts` (mismo cron) para filas `source='calculator'` (cadencia 2 días, días 2/4/6 desde enroll).                                            | Enroll creado al final del POST `/api/calculator-leads` con `nextSendAt = now+2d` cuando `marketingAccepted=true`. Día 0 ya lo envió `sendCalculatorEmail` y NO es paso del drip.                            | Cliente (1)                                  | `drip`               | `marketing-bulk`                                          | `drip_enrollments.language`                                 | Mismo claim/`advanceDripEnrollment` que #10 con `total=3`.                                                                                                                            | Self-managed (igual que #10)                                                                  | `test:e2e` calculator-flow + cobertura de unsub via `lint-email-deliverability` |
| 12 | `newsletter_broadcast`       | Worker `newsletter-broadcast.ts` (`startBroadcastWorker`, tick cada 5 s) — drena `newsletter_campaigns` en estado `in_progress` con throttle 500 ms/job (≈2/seg ≈ 7 200/h). | Job lanzado por slash `/newsletter` o por planificador interno. Cada job vive en `newsletter_campaign_jobs` con `attempts++` y `status pending|sending|sent|failed`. Footer de unsub se inyecta defensivamente si la campaña no contiene `{{unsubscribe_url}}`. | Cliente (1) por job                          | `newsletter`         | `marketing-bulk` + `List-Unsubscribe` (URL única por suscriptor) | Idioma incrustado en el HTML de la campaña (no se reescribe) | Claim atómico via `UPDATE … RETURNING` con `FOR UPDATE SKIP LOCKED` sobre `newsletter_campaign_jobs.status='pending'`. El índice único `(campaign_id, subscriber_id)` evita encolar dos veces el mismo destinatario. `entityRefId=newsletter-<campaignId>-<jobId>` ayuda a Gmail a deduplicar reintentos. | Self-managed: `markJobResult('failed', err)` reintenta en próximo tick si `attempts + 1 < MAX_ATTEMPTS=3` (distinto del `MAX_ATTEMPTS=6` de la retry queue). **No** pasa por `email_retry_queue`. | `npm run test:newsletter` — `test-newsletter-e2e.ts` valida creación de subs + dedupe drip; el broadcast en sí queda cubierto por la unidad del worker (`scripts/audit/lint-email-deliverability.mjs`) |

---

## 5. Notificaciones a Claudia (Discord, no email)

Las notificaciones operativas a Claudia no salen por correo: van al
canal de Discord `#exentax-actividad` desde `server/discord.ts` →
`notify*()`. Por tanto **no hay ningún tipo de email con destinatario
Claudia**: todas las filas de §4 son al cliente (recipient = 1).

| Evento                              | Función Discord                | Donde se llama                                       |
|-------------------------------------|--------------------------------|------------------------------------------------------|
| Nueva reserva                       | `notifyBookingCreated`         | `public.ts:734` (en booking handler)                 |
| Lead nuevo de booking               | `notifyNewLead`                | `public.ts:740` (sólo si `leadCreated`)              |
| Reschedule (cliente o admin)        | `notifyBookingRescheduled`     | `public.ts:924` y `booking-actions.ts:225`           |
| Cancelación (cliente o admin)       | `notifyBookingCancelled`       | `public.ts:975` y `booking-actions.ts:106`           |
| No-show marcado                     | `notifyNoShow`                 | `booking-actions.ts:130`                             |
| Lead de calculadora                 | `notifyCalculatorLead`         | `public.ts:1117`                                     |
| Suscripción a newsletter            | `notifyNewsletterSubscribe`    | `public.ts:1097` (calculadora) y `public.ts:1194` (footer) |
| Consentimiento (booking/calc/cookies/newsletter) | `notifyConsent`     | Varias rutas, vía `getCachedPrivacyVersion().then(...)` |

Esta separación es intencional: cuando el cliente recibe un correo, el
operador recibe un mensaje en Discord — no se envía un email a Claudia
para cada acción del cliente, evitando ruido en el buzón compartido.

---

## 6. Bypass del retry queue — justificación por familia

| Familia                | Pasa por `email_retry_queue` | Justificación                                                                                                                                  |
|------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Booking transaccional  | **Sí**                       | Único camino que tolera corte total de Gmail al confirmar (`enqueueEmail({tx})` antes del commit garantiza durabilidad).                       |
| Calculator one-shot    | **Sí**                       | Un único envío crítico — sin retry quedaría en best-effort.                                                                                    |
| Reschedule/Cancel/No-show/Follow-up/Reminder/Incomplete | **Sí** | Caída de Gmail no debe perder un envío programado; backoff `1m → 12h` (cap 6 intentos).                                                       |
| Drip (guía + calc)     | **No** (self-managed)        | El worker tiene su propia tabla (`drip_enrollments`) y reintentará en el próximo tick sin avanzar `next_send_at` — encolar duplicaría retries. |
| Newsletter broadcast   | **No** (self-managed)        | `newsletter_campaign_jobs` ya checkpointea por destinatario y respeta el throttle 2/seg; encolar perdería el orden y duplicaría retries.        |

`EmailRetryType` en `server/email-retry-queue.ts` mantiene los literales
`drip_step`, `calc_drip_step` y `newsletter_broadcast` en el unión de
tipos para que un caller ad-hoc (script de soporte, tests) pueda usar
`withRetryQueue(...)` sin churn de schema, pero los caminos de
producción no los emiten.

---

## 7. Verificación automatizada

| Comando                               | Qué cubre del routing de emails                                                                                |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `npm run lint:email-deliverability`   | Static-source: cada `sendEmail` lleva el `headerPolicyFor(...)` correcto, plantillas marketing tienen `unsubFooterWithLink`, plantillas operacionales NO tienen `List-Unsubscribe`. Falla en <100 ms — gate de cada PR. |
| `npm run test:booking`                | Confirma flujo completo book → reschedule → cancel + CAS de `markReminderSent` (filas #1, #2, #3, #4).         |
| `npm run test:newsletter`             | Confirma POST `/api/newsletter/subscribe` crea `drip_enrollments` con `source=guide`, `language=es`, activa (filas #9, #10). |
| `npm run test:calculator`             | Lógica del cálculo (input del email #8); el envío en sí va por `withRetryQueue`.                              |
| `npm run test:discord-regression`     | Slash commands `/cita email tipo:*` y reschedule/cancel desde Discord (filas #1b, #2b, #3, #4, #5, #6).        |
| `npm run check:serial`                | Ejecuta los anteriores en serie + el lint de deliverability.                                                   |

### Verificación contra código fuente (anclas anti-drift)

Las dos invariantes más auditables de esta tabla se verifican
explícitamente contra el código publicado:

- **Cadencia del drip de la guía** = 6 pasos cada 3 días
  (`días 0/3/6/9/12/15`):
  - `server/scheduled/drip-worker.ts:38-48` define
    `STEP_DELAY_MS_BY_SOURCE.guide = 3 * ONE_DAY_MS` y
    `DEFAULT_DELAY_MS = 3 * ONE_DAY_MS`.
  - `server/scheduled/drip-worker.ts:74` (`nextSendAtFor`) aplica ese
    mismo delta a cada paso 2..6.
  - `server/storage/marketing.ts:213` documenta la misma cadencia en
    el comentario adyacente al claim SQL (`day-3/6/9/12/15`).
  - El paso 1 se envía in-line en `sendImmediateStep1`
    (`drip-worker.ts:179-199`), por lo que el día 0 cuenta como
    paso 1 efectivo y los pasos 2..6 caen exactamente en
    `+3, +6, +9, +12, +15` días desde el enroll.
- **No-show NO dispara email automáticamente** (es manual por Discord):
  - `server/discord/handlers/booking-actions.ts:121-127`
    (`noShowBooking`) sólo ejecuta `updateAgenda(id, { status: NO_SHOW })`
    — no hay llamada a `sendNoShowRescheduleEmail` en esa ruta.
  - El único call site de `sendNoShowRescheduleEmail` está en
    `booking-actions.ts:251-260` dentro de `sendManualEmail`,
    invocado desde el slash command `/cita email tipo:noshow`.
  - El cron `reconcile-zombies` (`server/scheduled/reconcile-zombies.ts`)
    sólo barre eventos huérfanos de Google Meet; no toca el estado
    NO_SHOW ni dispara correos.

Si la cadencia o el comportamiento de no-show debiera cambiar en el
futuro, hay que actualizar **ambas** referencias (código + esta
auditoría) en el mismo PR — ese es el mecanismo de control.

### Gaps de cobertura observados (informativos — no se modifican en esta auditoría)

- **Incomplete-booking (fila #7)**: no hay E2E que cree un draft, espere
  el sweep y verifique el envío. La política de cabeceras y el CAS de
  `claimBookingDraftReminder` están cubiertos por inspección estática
  (`lint-email-deliverability`) y test unitario del storage helper.
- **Drip steps 2..6 y calc_drip 1..3 (filas #10, #11)**: el worker no
  se prueba avanzando el reloj — sólo se valida que la fila se cree
  con las invariantes correctas. La cadencia se verifica en producción
  vía `email_log`.
- **Newsletter broadcast (fila #12)**: el script `test:newsletter`
  cubre el camino de suscripción + drip; el broadcast en sí depende
  de la unidad estática del worker y del lint de deliverability.

---

## 8. Resumen ejecutivo

- **12 tipos de email** salientes, agrupados en 3 familias por política
  de cabeceras (`transactional`, `marketing-1to1`, `marketing-bulk`).
- **Cero notificaciones por email a Claudia**: todas las señales
  operativas viajan por Discord; el correo se reserva al cliente.
- **3 mecanismos de dedupe complementarios** según el tipo:
  - Atomicidad de transacción (`enqueueEmail({tx})` en booking) +
    `withSlotLock` / `withBookingLock` para impedir el evento duplicado
    aguas arriba. `entityRefId` es el header Gmail para thread dedup,
    no una unique constraint en `email_retry_queue` (la cola sólo tiene
    `id` PK; el durable es la atomicidad).
  - CAS sobre la fila propia (`markReminderSent`,
    `claimBookingDraftReminder`, `tryCreateDripEnrollment`,
    `claimDueDripEnrollments` con `SKIP LOCKED`).
  - Índice único `(campaign_id, subscriber_id)` (newsletter jobs) +
    claim `FOR UPDATE SKIP LOCKED` por job al enviar.
- **Idioma siempre persistido** en la fila de origen y resuelto vía
  `resolveEmailLang` con fallback `es` — ningún envío puede salir en
  un idioma desconocido.
- **Retry queue cubre** todo lo crítico transaccional (backoff
  `1m → 12h`, 6 intentos máximo); los workers self-managed (drip,
  newsletter) implementan su propio reintento sin doble cola.
- **Lint `email-deliverability`** garantiza estáticamente que cada
  exit del transport carga la política correcta — convierte la tabla
  §2 en una invariante revisable en cada PR.

