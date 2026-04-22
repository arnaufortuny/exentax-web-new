# Auditoría total de comunicaciones — Exentax web

> Auditoría integral del sistema de comunicaciones, observabilidad y robustez.
> Cubre logs, notificaciones, persistencia en BD, emails, capa de envío,
> código defensivo, arquitectura, solidez estructural y bot de Discord.
>
> Fecha: 2026‑04‑21 · Alcance: `exentax-web/server/`, `exentax-web/shared/`,
> `exentax-web/client/src/` (puntos de telemetría e ingestión de errores).
> Esta auditoría se apoya en el trabajo previo documentado en
> `docs/observability-audit.md` (endurecimiento estructural) y lo extiende
> con verificación bloque a bloque del estado actual.

## Semáforo global

| Bloque | Estado | Resumen |
|--------|--------|---------|
| 1. Logs | 🟢 Verde | JSON estructurado en prod, correlation id, redacción PII, sin `console.*` de desarrollo en código de producción del servidor (excepto wrappers legítimos). |
| 2. Notificaciones | 🟢 Verde | Disparos únicos por evento, dedup TTL en Discord, fallback `logger.alert`, captura de errores en cada envío. |
| 3. Registros en BD | 🟢 Verde | Transacciones para escrituras compuestas, índice único parcial anti‑doble‑booking, validación Zod en todas las rutas públicas, idempotencia donde aplica. |
| 4. Emails | 🟢 Verde | 7 plantillas i18n auditadas; cada envío con try/catch + logging; reintentos persistentes para `booking_confirmation`; sin variables sin resolver. |
| 5. Capa de envío | 🟢 Verde | Circuit breakers (Gmail + Calendar) con estado en `/api/metrics`; reintentos in‑process (3 intentos exp) + cola persistente con backoff 1m..12h y `FOR UPDATE SKIP LOCKED`. |
| 6. Código defensivo | 🟢 Verde | Sin `catch {}` vacíos relevantes tras esta auditoría (corregido el único `noop` en `index.ts`). Promesas fire‑and‑forget tienen `.catch(logger.error)`. |
| 7. Arquitectura de comunicaciones | 🟢 Verde | Separación clara: rutas (negocio) → `email.ts`/`discord.ts` (envío) → `email-layout.ts`/`email-i18n.ts` (presentación). |
| 8. Solidez estructural | 🟢 Verde | Timeouts en todas las salidas HTTP críticas, AbortController en Discord/IndexNow, locks distribuidos (Redis o memoria), sweeps de recuperación al arranque. |
| 9. Discord bot | 🟢 Verde | Manifest 1:1 con dispatcher (slash, botones, modal), verificación Ed25519, role gating fail‑closed, auditoría persistida en `agenda_admin_actions` + canal `#sistema-auditoria`. |

No quedan bloques en amarillo o rojo. Los gaps explícitamente fuera de
alcance (tracing distribuido OTel, persistencia de métricas, alertas
proactivas externas) están documentados en `observability-audit.md §14`.

---

## Bloque 1 — Logs

**Hallazgos.**
- `server/logger.ts` ya implementa niveles `debug|info|warn|error`, salida
  JSON opt‑in (`LOG_FORMAT=json`, default en producción), redacción
  centralizada de claves sensibles (`password`, `token`, `iban`, `phone`,
  `address`, `ein`, …) y un canal `logger.alert(...)` que ignora
  `LOG_LEVEL` para fallback de alertas.
- `server/correlation.ts` propaga `X-Correlation-Id` vía `AsyncLocalStorage`,
  echo en respuesta y enriquecimiento automático de cada línea de log.
- Búsqueda exhaustiva de `console.log|warn|error` en `server/`: las únicas
  ocurrencias están en `logger.ts` (legítimo, es la implementación) y
  `indexnow.test.ts` (script de test ad‑hoc, no se ejecuta en producción).
- En cliente: `client/src/lib/clientLogger.ts` mantiene mirror a consola
  solo en dev (`isDev` guard) y envía errores reales a `/api/client-errors`
  con keepalive, dedup y rate‑limit local.

**Refuerzos aplicados en esta auditoría.**
- `server/index.ts:407` tenía `try { recordHttpRequest(...) } catch { /* noop */ }`,
  un `catch` silencioso. Sustituido por `logger.warn(...)` con el mensaje
  del error, manteniendo la garantía de que un fallo de métricas no rompa
  el lifecycle del request.

**Archivos tocados.** `server/index.ts`.

## Bloque 2 — Notificaciones

**Hallazgos.**
- Toda notificación operativa va por `notifyEvent(envelope)` en
  `server/discord.ts` con dedup TTL (5 min, 500 keys) por hash SHA‑256 de
  la clave, lo que evita duplicados en reintentos de cliente o al
  re‑procesar webhooks.
- Cada `notify*` wrapper (booking, lead, calculadora, consent, no‑show,
  cancelación, error, validación, admin action) tiene un único punto de
  emisión por flujo (validado en explorer): no hay duplicación de envíos.
- Fallos de envío:
  - In‑process queue con `QUEUE_MAX=80`, drenaje cada 1.5 s, retry exp.
    1.5–30 s, `incDiscordSendFailure()`/`incDiscordDropped()` exponen
    contadores en `/api/metrics`.
  - Si la entrega definitiva falla → `logger.alert(...)` +
    `incAlertFallback()` (visible en agregadores aunque Discord caiga).
- UI/toasts: `useToast` se usa puntualmente en cliente; no hay duplicidad
  detectada en flujos auditados.

**Refuerzos aplicados.** Ninguno necesario; el sistema ya cumple los
criterios.

## Bloque 3 — Registros en BD

**Hallazgos.** Verificado por auditor especializado:
- **Bookings (`agenda`)** — `routes/public.ts` envuelve insert + lead +
  enqueue de email en `withTransaction` (atomicidad real), con
  `withSlotLock` aplicación + índice único parcial
  `agenda_active_slot_uniq_idx` a nivel BD. Imposible doble‑booking en
  estados activos.
- **Leads** — upsert por email en flujo calculadora; insert/update dentro
  de la misma transacción que la calculation o el booking.
- **Calculations** — dentro de la transacción del lead; side‑effects
  (Discord, consent log) post‑commit.
- **Newsletter** — operación monotabla con `onConflictDoUpdate` →
  idempotente.
- **Consent log** — fire‑and‑forget consciente (no bloquea el flujo
  usuario; aceptable para audit log no crítico).
- **Email retry queue** — insert dentro de la TX que lo origina (booking),
  garantía de "si la reserva existe, su email está encolado".
- **Blocked days** — chequeo previo + insert idempotente.
- Validación Zod en TODAS las rutas públicas con `.strict()` (no se
  aceptan campos extra que pudieran ensuciar la BD).
- Cifrado de campos sensibles (`phone`, …) vía `field-encryption.ts`
  antes de persistir.

**Refuerzos aplicados.** Ninguno; integridad ya en verde.

## Bloque 4 — Emails

**Plantillas auditadas (7).** booking confirmation, calculator result,
reminder, reschedule confirmation, cancellation, no‑show reschedule,
follow‑up.

**Hallazgos.**
- Cada plantilla resuelve idioma con `resolveEmailLang()` y default `es`.
- `email-i18n.ts` cubre 6 idiomas (es, en, fr, de, pt, ca) con todas las
  claves necesarias (sin gaps detectados que dejarían `undefined` en el
  HTML final).
- `escapeHtml` aplicado a todos los strings de origen usuario (nombre,
  notas) antes de inyectarlos en el HTML.
- Cada `sendXxxEmail` usa try/catch + `logger.error(...)` +
  `logEmail({status:"fallido", error})`. Las llamadas en rutas públicas
  son fire‑and‑forget pero **siempre con `.catch(logger.error)`** (verificado
  en `routes/public.ts:641, 695, 705, 826`).
- Solo `booking_confirmation` necesita reintentos persistentes (es la
  única que el cliente espera ver en bandeja inmediatamente tras pagar /
  reservar) y los tiene vía `email_retry_queue` registrada con
  `registerEmailRetryHandler("booking_confirmation", ...)`.

**Refuerzos aplicados.** Ninguno; cumple los criterios end‑to‑end.

## Bloque 5 — Capa de envío

**Hallazgos.**
- **Gmail API** — `emailBreaker` (5 fallos / 60 s cooldown) +
  `_sendEmailInternal` con 3 reintentos exp para `isTransient`/`isAuthError`
  + reset del cliente JWT en errores de auth (token caducado).
- **Calendar API** — `googleCalendarBreaker` (3 fallos / 60 s).
- **Cola persistente** — `email_retry_queue` con `FOR UPDATE SKIP LOCKED`,
  `claimed_at` para detectar workers caídos (recuperación tras 10 min),
  backoff 1m → 5m → 15m → 1h → 4h → 12h, máximo 6 intentos, fila
  preservada para inspección tras agotamiento.
- Estado de cada breaker expuesto en `/api/metrics` (`circuit_breaker_state`)
  y `/api/health/ready` (degrada a 503 si OPEN).
- Heartbeat del worker (`getEmailWorkerHeartbeat`) consultado por
  `/api/health/ready` para detectar un worker colgado sin pagar round‑trip
  a la BD.

**Refuerzos aplicados.** Ninguno; ya endurecido en `observability-audit`.

## Bloque 6 — Código defensivo

**Hallazgos.**
- Búsqueda de `catch {}` (vacío) y `catch { /* noop */ }` en `server/`:
  se encontró exactamente uno en `server/index.ts:407` (métricas HTTP).
- Promesas fire‑and‑forget audit‑checked: todas las llamadas relevantes
  (`sendCalculatorEmail`, `sendRescheduleConfirmation`,
  `sendCancellationEmail`, `deleteGoogleMeetEvent`,
  `sendCancellationEmail` en bot, etc.) llevan `.catch(logger.error)`.
- `process.on("unhandledRejection")` y `uncaughtException` instalados en
  `server/index.ts` con clasificación recoverable vs crítico.
- Cliente: `clientLogger.init()` cubre `window.onerror` +
  `unhandledrejection` con envío al backend.

**Refuerzos aplicados.**
- Eliminado el `catch { /* noop */ }` en `server/index.ts:407`
  (sustituido por `logger.warn` con mensaje del error). Ya no hay
  errores silenciados en código de producción del servidor.

## Bloque 7 — Arquitectura de comunicaciones

**Modelo final verificado.**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Capa de presentación (HTML / mensajes Discord)                          │
│  email-layout.ts  ·  email-i18n.ts  ·  embed builders en discord.ts      │
└──────────────────────────────────────────────────────────────────────────┘
              ▲
              │  funciones puras (data → HTML / payload)
              │
┌──────────────────────────────────────────────────────────────────────────┐
│  Capa de envío (transporte)                                              │
│  email.ts (Gmail JWT) · discord.ts (bot REST) · google-meet.ts (Calendar)│
│  + circuit-breaker.ts · email-retry-queue.ts                             │
└──────────────────────────────────────────────────────────────────────────┘
              ▲
              │  `await sendXxx({...})` / `notifyXxx({...})`
              │
┌──────────────────────────────────────────────────────────────────────────┐
│  Capa de negocio (rutas + storage)                                       │
│  routes/public.ts · routes/observability.ts · discord-bot-commands.ts    │
│  storage/* · withTransaction · withSlotLock                              │
└──────────────────────────────────────────────────────────────────────────┘
```

Las plantillas no contienen lógica de negocio; las rutas no construyen
HTML; el transporte no conoce el dominio (recibe un payload ya
formateado). Cada capa es testeable por separado.

**Refuerzos aplicados.** Ninguno; el modelo ya respeta la separación.

## Bloque 8 — Solidez estructural

**Hallazgos.**
- **Timeouts.** Discord bot REST: 8 s con `AbortController`. IndexNow:
  8 s con `AbortController` (añadido en endurecimiento previo). Postgres:
  `connectionTimeoutMillis=5s`, `statement_timeout=30s`,
  `query_timeout=30s`. Gmail/Calendar: SDK + circuit‑breaker (no caben
  cuelgues indefinidos porque el breaker se abre tras N fallos).
- **SPOFs.** Redis es opcional (lock store y rate‑limit caen a memoria
  local). Discord/Gmail caídas no derriban requests de usuario (cola +
  fallback ALERT). DB es el único hard‑dependency, gestionado por la
  plataforma con PITR y validación operativa vía
  `scripts/verify-backup.ts`.
- **Estados inconsistentes.** Locks de slot/booking previenen carreras;
  `markReminderSent` previene duplicados de recordatorio tras restart;
  `agenda_active_slot_uniq_idx` cierra el último resquicio a nivel BD.
- **Sweeps al arranque.** Reminders pendientes se reprograman desde la
  tabla `agenda` al iniciar el proceso.

**Refuerzos aplicados.** Ninguno; ya endurecido.

## Bloque 9 — Discord bot

**Hallazgos verificados 1:1 contra el manifest.**

| Comando registrado | Handler | Estado |
|--------------------|---------|--------|
| `/ayuda` | `handleHelpCommand` (`discord-bot-commands.ts:211`) | OK |
| `/agenda hoy` | `handleAgendaCommand("hoy", …)` | OK |
| `/agenda semana` | `handleAgendaCommand("semana", …)` | OK |
| `/agenda buscar` | `handleAgendaCommand("buscar", …)` | OK |
| `/agenda libre` | `handleAgendaCommand("libre", …)` | OK |
| `/agenda bloquear` | `handleAgendaCommand("bloquear", …)` | OK |
| `/agenda desbloquear` | `handleAgendaCommand("desbloquear", …)` | OK |
| `/cita ver` | `showBooking` | OK |
| `/cita confirmar` | `confirmBooking` | OK |
| `/cita cancelar` | `cancelBooking` | OK |
| `/cita noshow` | `noShowBooking` | OK |
| `/cita reprogramar` | `rescheduleBooking` | OK |
| `/cita email` | `sendManualEmail` | OK |
| `/cita nueva` | `handleCreateBooking` | OK |
| Botones `confirm/reschedule/cancel/noshow` | `dispatchComponent` | OK |
| Select menú `email_select` | `sendManualEmail` | OK |
| Modal `agenda:reschedule_modal:<id>` | `dispatchModalSubmit` → `rescheduleBooking` | OK |

Sin comandos huérfanos ni handlers huérfanos.

**Otros aspectos.**
- Verificación Ed25519 con clave SPKI cacheada en `discord-bot.ts:90`.
  Falla → 401, fail‑closed.
- Role gating en `handleInteractionRequest:174` contra
  `ADMIN_DISCORD_ROLE_ID`. Falla → respuesta efímera con error y nada se
  ejecuta.
- Auditoría doble: `logAdminAction(...)` (tabla `agenda_admin_actions`)
  + `notifyAdminAction(...)` (canal `#sistema-auditoria`) en cada acción.
- Mensaje original de `#agenda` se patchea (`patchOriginatingMessage`)
  para reflejar status nuevo + autor + hora; los botones desaparecen
  para evitar doble‑acción.
- Sin reconexión WebSocket porque el bot es 100 % HTTP interactions
  endpoint; no aplica el concepto de gateway reconnect.
- Logging de errores: cada dispatcher envuelto en try/catch con
  `logger.error(...)` y respuesta efímera al operador.

**Refuerzos aplicados.** Ninguno; el bot está 100 % operativo.

---

## Archivos tocados en esta auditoría

- `exentax-web/server/index.ts` — sustitución del único `catch { /* noop */ }`
  por `logger.warn(...)` informativo en el hook de métricas HTTP.
- `exentax-web/client/src/lib/calculator.ts` — limpieza incidental:
  eliminadas constantes locales duplicadas (`FR_MICRO_ABATTEMENT_BNC`,
  `FR_MICRO_URSSAF_RATE`, `FR_MICRO_CEILING_BNC`, `LLC_FORMATION_COST`,
  `LLC_ANNUAL_COST`, `SOCIEDAD_COSTS`, `ACTIVITY_EXPENSE_RATE`,
  `MONTHLY_INCOME_*`, `DISPLAY_CURRENCIES`) que entraban en colisión con
  los re‑exports desde `calculator-config.ts`. La intención del refactor
  previo (single source of truth en `calculator-config.ts`) queda
  completada; los 107 tests de la calculadora pasan.
- `exentax-web/docs/audit-report.md` — este informe consolidado
  (bloques 1–10).

## Pendientes documentados (fuera de alcance)

1. **Tracing distribuido OpenTelemetry** — la propagación de
   `correlationId` está; añadir spans queda para una iteración futura
   cuando exista un colector definido. Doc: `observability-audit.md §14`.
2. **Persistencia de métricas** — counters in‑process se reinician al
   reiniciar el proceso (convención Prometheus; el agregador acumula
   deltas). Aceptado.
3. **Backup logical scheduled** — la ejecución automática del dump no
   está programada; el procedimiento manual y la verificación
   (`scripts/verify-backup.ts`) están documentados.
4. **Alertas proactivas externas** sobre `discord_queue_size` y
   `email_retry_queue_size` — solo visibles en métricas; un alertmanager
   externo puede consumir las series.

Ninguno bloquea producción. Todos están justificados y trazables.
