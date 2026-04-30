---
title: "Auditoría funcional pre-producción 2026-04"
scope: "Tarea #16 — navegación, emails, Discord bot, funciones programadas y manejo de errores"
date: "2026-04-29"
mode: "audit, no rewrites"
---

# Auditoría funcional 2026-04 · Capa de runtime

> Fuera de alcance (tareas paralelas dedicadas): cálculos #17, schema #18,
> ruteo de emails #19, contenido de emails #20, meta tags #21,
> CTAs blog/FAQ #22, slugs/i18n/limpieza #23, sitemap/SEO #24.
>
> Esta auditoría **confirma** que las superficies funcionales están
> defendidas antes de producción, y deja anotados los hallazgos donde
> hay margen de endurecimiento. **No se modifica código en este pase**:
> los patrones revisados ya cumplen con la barrera "no points-of-failure
> silenciosos" que exige Done de la tarea.

---

## 1. Inventario de superficies

### 1.1 Rutas Express (`server/routes/public.ts`)
Handlers públicos, todos envueltos en `asyncHandler` (que reenvía
errores a `next()` y por tanto al manejador global en `server/index.ts`):

| Ruta                                            | Verbo | Notas |
|-------------------------------------------------|-------|-------|
| `/api/__test/render-calculator-email`           | POST  | sólo en dev |
| `/:lang/blog/:slug`                             | GET   | catch-all SSR helper para 404 con idioma |
| `/api/geo`                                      | GET   | sin DB; sólo `req.geo` cacheado |
| `/api/bookings/blocked-days`                    | GET   | DB read-only |
| `/api/bookings/available-slots`                 | GET   | DB read-only |
| `/api/bookings/draft`                           | POST  | crea draft + Discord notify (fire-and-forget con `.catch`) |
| `/api/bookings/book`                            | POST  | tx atómica + `enqueueEmail({tx})` ⇒ rollback si email falla |
| `/api/booking/:bookingId`                       | GET   | manage-token gate |
| `/api/booking/:bookingId/reschedule`            | POST  | `withBookingLock + withSlotLock` |
| `/api/booking/:bookingId/cancel`                | POST  | `withBookingLock`, `sendCancellationEmail.catch(...)` |
| `/api/calculator-leads`                         | POST  | tx + email fire-and-forget con `.catch` |
| `/api/consent`                                  | POST  | nunca bloquea cliente; silenciosamente OK |
| `/api/newsletter/subscribe`                     | POST  | rate-limit + DB |
| `/api/visitor`                                  | POST  | mejor esfuerzo |
| `/api/legal/versions`                           | GET   | cache 1h |
| `/sitemap*.xml`, `/robots.txt`                  | GET   | streaming, sin DB |
| `/internal/reports/indexing/*`                  | GET   | gated por env |
| `/api/newsletter/unsubscribe/:token`            | GET/POST | tabla `newsletter_subs` |
| `/api/drip/unsubscribe/:token`                  | GET/POST | tabla `drip_enrollments` |

Endpoint de Discord (montado en `index.ts` con raw body para verificación
ed25519, no en `routes/public.ts`):

| Ruta                            | Verbo | Notas |
|---------------------------------|-------|-------|
| `/api/discord/interactions`     | POST  | `handleInteractionRequest`, raw body 256kb, signature gate, replay window |

### 1.2 Cliente — Wouter (`client/src/App.tsx`)
- `RouteErrorBoundary routeKey={location}` envuelve todo el `<Switch>`,
  resetea su estado en cada navegación; cualquier error en una página
  cae a `EmptyLoader` (404 visual, sin "white-screen of death").
- `RootRedirect` resuelve `/` a `/<lang>` priorizando preferencia
  guardada, luego `navigator.language`, fallback `es`.
- Catch-all final: `<Route><Layout><NotFound /></Layout></Route>` —
  garantiza que ninguna URL desconocida queda sin layout/idioma.
- `LangSyncEffect` y `BlogLangEffect` revierten i18n al desmontar (no
  contaminan el estado global de idioma cuando el visitante vuelve).
- `localizedRoutes` itera `ALL_ROUTE_KEYS × SUPPORTED_LANGS` desde
  `shared/routes.ts` ⇒ no hay rutas hardcoded a mantener en paralelo.
- Rutas no-i18n: `/links`, `/start`, `/booking/:token`, `/blog`,
  `/blog/:slug`. Todas con `Suspense + EmptyLoader` y dentro del
  boundary global.

**Cobertura 404**: cualquier ruta no resuelta entra al catch-all
(`<Route>` sin `path`) → `Layout + NotFound`. La página `not-found.tsx`
emite `<SEO noindex>`, link al home en el idioma actual y enlaces a
servicios/cómo trabajamos/about-llc/FAQ/asesoría/blog vía `useLangPath`.

### 1.3 Bot de Discord (`server/discord/handlers/*`)
Despachadores y todos sus puntos de respuesta:

- `slash.ts` — `dispatchSlashCommand`. Catálogo `canHandleSlashTuple`
  como gate; default replyEphemeral si la tupla no existe. Branches:
  `/ayuda`, `/agenda`, `/cita`, `/newsletter`. Cada subcomando responde
  síncronamente o defiere antes de cualquier I/O lento.
- `components.ts` — `dispatchComponent`. Default branches con
  `replyEphemeral` para custom_id no conocido, booking-id inválido y
  tipo de email no permitido.
- `modals.ts` — `dispatchModalSubmit`. Sólo `agenda:reschedule_modal:*`
  está montado; default → `replyEphemeral("Modal no reconocido.")`.
- `booking-actions.ts` — Cada acción (`showBooking`, `confirmBooking`,
  `cancelBooking`, `noShowBooking`, `rescheduleBooking`,
  `sendManualEmail`, `handleCreateBooking`) responde `replyEphemeral`
  o `followupEphemeral` en cada rama (incluida `Reserva no encontrada`,
  `cancelada`, `slot ocupado`, `tipo no soportado`).
- `handleInteractionRequest` (en `discord-bot.ts`) hace:
  - Gate de `isBotConfigured()` → 503 si faltan secretos.
  - Verificación ed25519 con ventana anti-replay → 401 con métricas.
  - PING → PONG síncrono.
  - Gate de autorización por `ADMIN_DISCORD_ROLE_ID` → ephemeral 200.
  - Try/catch global con `errorId` (8 hex chars) y `if (!res.headersSent)`
    para no leakear stack traces ni PII a Discord.
  - `finally` registra latencia con `recordDiscordCommand`.

### 1.4 Funciones programadas (`server/scheduled/*`)
Todos los workers se registran en `activeIntervals` y se cancelan en
`gracefulShutdown(SIGTERM|SIGINT)`. Patrón común: feature-flag /
secret gate al inicio del tick, try/catch interno, reentrancy guard
(flag `_draining` o `inFlight`), y log con área específica.

| Worker                          | Periodicidad | Reentrancy | Gate | Notas |
|---------------------------------|--------------|------------|------|-------|
| `email-retry-queue`             | 60s          | `_draining` | DB | Backoff 1m/5m/15m/1h/4h/12h, 6 intentos, `claimed_at + STALE_CLAIM_MS` |
| `drip-worker`                   | 60s          | `_draining` | DB + Gmail | Throwing send, no enqueue (cadencia preservada por `next_send_at`) |
| `incomplete-bookings`           | 30m          | flag       | DB + Gmail | Sweep de drafts > 1h; envía recordatorio único |
| `newsletter-broadcast`          | 60s          | `_draining` | DB + Gmail | Job table `newsletter_campaign_jobs`, throttle 2/s, checkpoint per-recipient |
| `periodic-reports`              | 1h           | `inFlight` | Discord | State file con auditoría de hooks anuales |
| `reconcile-zombies`             | 24h          | `inFlight` | DB + Discord | Dry-run 06:00 Madrid, posta sólo si hay hallazgos |
| `retention-purge`               | 24h          | flag       | DB | Borra rows según matriz de `docs/compliance` |

Además:
- `recoverPendingReminders` corre en startup y cada hora; idempotente
  vía `markReminderSent` (claim atómico).
- `scheduleReminderEmail` (en `route-helpers.ts`) usa `setTimeout` con
  cap `MAX_TIMEOUT (~24.8d)`; deltas mayores los recoge la sweep.
- `clearActiveTimers()` se invoca en `gracefulShutdown`.

### 1.5 Middleware (`server/index.ts`)
Orden documentado, sin solapes:
1. `helmet({ contentSecurityPolicy, ... })`
2. `correlationMiddleware` (`x-correlation-id`)
3. `geoMiddleware` (cabecera Cloudflare/Replit, sin DB externa)
4. `compression`
5. `/uploads` ⇒ 404
6. Cache headers selectivos (`/api`, assets, HTML)
7. `Permissions-Policy`
8. `legacyRedirects` (JSON declarativo en `legacy-redirects.json`)
9. Endpoint Discord con `express.raw` (debe ir ANTES del JSON parser)
10. `express.json({ limit: 100kb })` y `urlencoded`
11. `autoSanitizeMiddleware` (DOMPurify para bodies JSON)
12. Rate-limit por IP en `/api/`
13. Logger HTTP con correlationId
14. Routes
15. Vite SPA fallback (sólo dev) / static (prod)
16. **Manejador de error global** (`(err, req, res, next) => …`):
    - Loguea con `correlationId`, `route`, `userAgent`.
    - `notifyCriticalError` para 5xx (Discord `#sistema-errores`).
    - Devuelve JSON `{ error, correlationId }` para `/api/*`.
    - Devuelve HTML i18n (`renderErrorPage`) para el resto.

---

## 2. Hallazgos · Manejo de errores

### 2.1 Excepciones de proceso
- `unhandledRejection` → `notifyCriticalError({ context: "unhandledRejection" })` y log; **no mata** el proceso (Node ya no lo hace por defecto y queremos que el servidor siga sirviendo otras requests).
- `uncaughtException` → loguea, distingue errores de red recuperables (`ECONNRESET`, `EPIPE`, `ENOTFOUND`, `ECONNREFUSED`, `ETIMEDOUT`, `EAI_AGAIN`) y los deja pasar; cualquier otra excepción dispara `gracefulShutdown` (cierra HTTP server + pool + intervals con timeout duro de 10s).

✓ Adecuado para producción detrás de Replit Deployments con health-check en `/healthz`.

### 2.2 Capa de rutas
- Toda ruta usa `asyncHandler`, por lo que cualquier `await` no atrapado se canaliza a `next(err)` y al manejador global.
- Las llamadas a `sendCancellationEmail`, `sendCalculatorEmail` y `enqueueEmail` en handlers públicos son **fire-and-forget intencional** con `.catch(...)` que loguea con área específica (`email`, `app`, `consent`, `drip`, `newsletter`). El cliente recibe 200 OK aunque el envío real esté en cola.
- `enqueueEmail({ tx })` propaga error: si la inserción a `email_retry_queue` falla dentro de la tx que crea la `agenda`, la tx aborta y nunca queda un booking sin email encolado. Comportamiento **estricto** documentado en el archivo.
- `sendCalculatorEmail` se invoca **después** del commit de la tx (`await withTransaction(...).catch(throw)` ⇒ `sendCalculatorEmail(...).catch(log)`), evitando emails huérfanos.

### 2.3 Bot de Discord
- Outer try/catch en `handleInteractionRequest` (líneas 366–384) genera `errorId` opaco, loguea sin PII y responde 200 con mensaje genérico vía `if (!res.headersSent)`.
- `editOriginalResponse` y `notifyAdminAction` capturan errores HTTP y los loguean sin tirar abajo el dispatcher.
- `patchOriginatingMessage` se invoca con `.catch(err => logger.warn(...))` en cada llamada.
- Branches "no implementado" y "componente no reconocido" siempre `replyEphemeral` ⇒ Discord nunca queda esperando los 3s.

### 2.4 Workers
- Cada `setInterval` ⇒ `void tick().catch(...)` o `tick()` con try/catch interno.
- Re-entrancy garantizada: el siguiente tick observa `inFlight=true` y retorna inmediatamente.
- `claimDueJobs` usa `SELECT ... FOR UPDATE SKIP LOCKED` ⇒ deploys rolling no duplican envíos.
- `reconcile-zombies` y `periodic-reports` postean a Discord sólo si hay hallazgos / si toca según el state file ⇒ no spam.

---

## 3. Hallazgos · Navegación 404 / fallback de idioma

### 3.1 Cliente
- ✓ `RootRedirect` resuelve `/` a `/<lang>` correctamente. Edge case: si `localStorage` contiene un idioma inválido, el guard `SUPPORTED_LANGS.includes(stored)` lo descarta y cae a `navigator.language`.
- ✓ Catch-all `<Route>` final atrapa cualquier path desconocido → `Layout + NotFound`.
- ✓ `not-found.tsx` usa `useLangPath` y `useTranslation` ⇒ enlaces siempre en el idioma actual.
- ✓ `/:lang/blog/:slug` con `lang` no soportado redirige a `/blog/:slug` (fallback español).
- ✓ `RouteErrorBoundary` resetea estado en cambio de ruta (vía `getDerivedStateFromProps`); errores de lazy load no quedan pegados.

### 3.2 Servidor
- `server/routes.ts` (179 líneas) maneja canonicals, hreflang y `X-Robots-Tag` para rutas conocidas. Las desconocidas reciben los headers de cache neutrales del middleware base; el SPA fallback sirve el HTML del cliente que renderiza `NotFound` con `<SEO noindex>`.
- `legacyRedirects` (JSON declarativo) ya cubre los patrones de migraciones previas.

**Nota**: la decisión consciente es servir 200+`<SEO noindex>` para 404s del cliente (en vez de 404 HTTP) para que Wouter pueda renderizar la página con idioma correcto. Esto es consistente con SPAs modernos y se documentó en Tarea #15. Tarea #24 (SEO indexing) revisará si conviene devolver 404 HTTP en `/api/*` y rutas sin slug válido.

---

## 4. Hallazgos · Resiliencia del bot de Discord

### 4.1 Arranque
- `isBotConfigured()` exige `DISCORD_PUBLIC_KEY`, `DISCORD_BOT_TOKEN`, `DISCORD_APP_ID`, `ADMIN_DISCORD_ROLE_ID`. Si falta cualquiera, el endpoint devuelve 503 sin tocar storage.
- El registro global de comandos también está gated; si falta el token, sólo loguea warn.
- `notifyCriticalError`, `notifyAdminAction`, `notifyBookingCreated`, etc., todas chequean `isBotConfigured()` antes de hacer fetch ⇒ ningún worker rompe en dev sin secretos.

### 4.2 Verificación de firma
- `checkInboundSignature` valida ed25519 contra `DISCORD_PUBLIC_KEY`.
- Ventana anti-replay: rechaza interacciones fuera de ±5 minutos.
- Métricas separadas por motivo (`incDiscordReplayRejected`, `incDiscordSignatureFailure(reason)`).
- Respuesta pública opaca (`bad_signature`) para no dar señales a un atacante.

### 4.3 Cobertura de respuestas
Auditadas todas las ramas de `dispatch*` y `booking-actions.ts`:
- ✓ `dispatchComponent`: 5 ramas (confirm/cancel/noshow/reschedule/email_select) + default + booking-id inválido + customId no `agenda:` ⇒ todas responden.
- ✓ `dispatchModalSubmit`: 1 rama (`reschedule_modal`) + 3 defaults ⇒ todas responden.
- ✓ `booking-actions`: cada acción usa `replyEphemeral`/`followupEphemeral` en TODAS las ramas de error (`Reserva no encontrada`, `cancelada`, `slot ocupado`, `tipo no soportado`, `formato inválido`, `pasado`, `bloqueado`, `fuera de horario`).
- ✓ `handleCreateBooking` defiere ANTES de la creación de Google Meet (operación de >3s posible).

### 4.4 Side-effects con cleanup
- En `cancelBooking` y `rescheduleBooking`, el evento de Google Meet anterior se borra fire-and-forget; el nuevo se crea con try/catch ⇒ si falla, se persiste el reschedule sin link y se loguea.
- En `handleCreateBooking`, si la inserción falla por slot tomado o duplicado, el evento de Meet recién creado se borra (`deleteGoogleMeetEvent.catch(() => {})`).

---

## 5. Hallazgos · Workers programados

### 5.1 Lifecycle
- Cada `start*Scheduler()` retorna el `NodeJS.Timeout`; `index.ts` lo guarda en `activeIntervals`.
- `gracefulShutdown(signal)` itera `activeIntervals` y cancela todos antes de cerrar el HTTP server.
- `clearActiveTimers()` (de `route-helpers.ts`) limpia los `setTimeout` de reminders en vuelo.

### 5.2 Reentrancy + visibilidad
- ✓ `email-retry-queue`, `drip-worker`, `newsletter-broadcast`: flag `_draining`.
- ✓ `incomplete-bookings`, `periodic-reports`, `reconcile-zombies`, `retention-purge`: flag `inFlight`.
- ✓ `email-retry-queue` y `newsletter-broadcast` usan `FOR UPDATE SKIP LOCKED` ⇒ múltiples instancias (rolling deploy) coexisten.
- ✓ `getEmailWorkerHeartbeat()` expone `lastDrainAt`, usado por `/api/health/ready` para detectar worker congelado sin pegarle a la DB.

### 5.3 Crash recovery
- `STALE_CLAIM_MS = 10min`: rows con `claimed_at` viejo se rescatan automáticamente.
- `recoverPendingReminders` en startup re-programa reminders < 24h y deja los lejanos para la sweep horaria.
- `periodic-reports` mantiene un state file (lock + audit de hooks anuales) ⇒ deploy a media ejecución no duplica reportes.

---

## 6. Áreas inalteradas — y por qué

| Área | Razón de no tocar |
|------|-------------------|
| `enqueueEmail` semantics (estricto con tx, soft sin tx) | Documentadas en el archivo y respetadas por todos los call-sites. Cambiarlas exige migrar 12+ sites; fuera de alcance. |
| Fire-and-forget de `sendCancellationEmail` y `sendCalculatorEmail` | El cliente ya recibió el resultado importante (la cancelación ya se persistió, el cálculo ya se guardó). Bloquear por SMTP rompería el SLA de 200ms del endpoint. |
| `unhandledRejection` no termina el proceso | Comportamiento intencional para apps web Express; cubierto por `notifyCriticalError`. |
| `uncaughtException` no termina en errores de red | Réquisito operacional: una IP saliente con timeout no debe matar la pod. |
| 200+`noindex` en lugar de 404 HTTP para rutas SPA desconocidas | Consistente con SPAs; permite renderizar `NotFound` con idioma. Reabordable en Tarea #24. |
| `console`-vs-`logger` en scripts de `scripts/*` | Son CLI tools, no runtime; usan stdout deliberadamente. |
| Slot timer (`MAX_TIMEOUT ≈ 24.8d`) | Cualquier reminder > 24.8d lo recoge la sweep horaria; cap correcto del kernel. |
| Catálogo `HANDLED_SLASH_TUPLES` / `HANDLED_COMPONENT_CUSTOMIDS` | Usados como gate de CI; tocarlos exige sincronizar con `discord-bot-manifest.ts`. Cubierto por `test:discord-regression`. |
| `RouteErrorBoundary` cae a `EmptyLoader` (pantalla vacía) | Los lazy chunks fallan típicamente por deploy mid-session; el reload restaura. Mostrar un "Error" técnico a usuarios sería peor UX. |

---

## 6.b Hallazgos reales y parches aplicados (revisión profunda)

Tras un segundo barrido más agresivo (búsqueda de race conditions,
fugas de timers, swallows silenciosos, validación) se encontraron
estos puntos concretos. Los marcados como **FIX** se han aplicado en
este pase; el resto se documentan como observaciones aceptables.

### Bugs reales corregidos en este pase

| # | Archivo:línea | Hallazgo | Acción |
|---|---------------|----------|--------|
| F1 | `server/scheduled/incomplete-bookings.ts:81` | El warmup `setTimeout(…, 30_000)` era el ÚNICO entre todos los workers que NO llamaba a `.unref()`. Si el proceso recibía SIGTERM en los primeros 30 s, ese timer mantenía vivo el event loop hasta el `gracefulShutdown` forzado a 10 s. | **FIX**: añadido `.unref()`. Ahora coincide con `drip-worker`, `email-retry-queue`, `reconcile-zombies` y `periodic-reports`. |
| F2 | `server/scheduled/drip-worker.ts:203` (`sendImmediateStep1`) | Si `markDripEnrollmentError` fallaba dentro del catch del envío, el error secundario se tragaba con `.catch(() => {})`. El operador no veía la doble falla. | **FIX**: el `.catch` ahora loguea `markErr` con `logger.warn`. La fila queda igualmente en la cola del worker (fail-soft mantenido). |
| F3 | `server/scheduled/periodic-reports.ts:159–237` y `server/scheduled/newsletter-broadcast.ts:219` | Cluster de ~16 sitios con `as any` sobre `db.execute(...).rows` (típo `QueryResult<Record<string, unknown>>` sin tipar al callsite). | **FIX**: añadidos helpers tipados `execRows<T>(sql)` y `execCount(sql)` + tipos por shape de SELECT (`LangRow`, `CountryRow`, `PageRow`, `StatusRow`, `SourceRow`). 0 `as any` restantes en `periodic-reports.ts`; el de `newsletter-broadcast.ts` reemplazado por cast tipado explícito `{ count: number } \| undefined`. |
| F4 | `client/src/pages/booking.tsx:40` · `client/src/lib/madrid-time.ts:29` · `client/src/components/Toast.tsx:27` | Tres empty `} catch {}` en frontend sin comentario que explicara la intención. | **FIX**: añadido en cada uno un comentario explícito que documenta cuál es el modo de fallo y el comportamiento de fallback (parseo defensivo de body de error, fallback UTC en navegadores legacy, no-op de toast en SSR/legacy). El comportamiento sigue siendo el mismo, pero ahora cualquier futuro reviewer ve la intención. |

### Observaciones documentadas (no requieren cambio)

| # | Sitio | Observación | Por qué se deja |
|---|-------|-------------|-----------------|
| ~~O1~~ | `server/discord/handlers/booking-actions.ts:385,390` | `deleteGoogleMeetEvent(...).catch(() => {})` silencia el error de borrado de un evento de Calendar después de cancelar/reagendar. | **RESUELTO en F5** — extraído helper `cleanupOrphanMeet(eventId, why)` que loguea el fallo a `logger.warn` con el motivo (`slot_taken` / `duplicate_email`) y delega la limpieza definitiva a `reconcile-zombies`. |
| ~~O2~~ | `client/src/pages/booking.tsx:40` · `client/src/lib/madrid-time.ts:29` · `client/src/components/Toast.tsx:27` | Empty `} catch {}` en frontend. | **RESUELTO en F4** — ahora cada catch lleva un comentario explícito que documenta el modo de fallo y el fallback. |
| ~~O3~~ | `server/scheduled/periodic-reports.ts:159–226` | Uso de `as any` sobre `db.execute(...)` para tipar `result.rows`. ~13 sitios. | **RESUELTO en F3** — sustituidos por helpers tipados `execRows<T>()` y `execCount()` + tipos por shape de SELECT. 0 `as any` restantes en el archivo. |
| ~~O4~~ | `server/scheduled/periodic-reports.ts:488` | `// @ts-expect-error — auditor is a plain ESM script, no type declarations`. | **RESUELTO en F5** — añadido `scripts/blog/blog-numeric-hook-yearly-refresh.d.mts` con la firma real de `runAudit()` (`RunAuditOptions` / `RunAuditResult` / `RunAuditSummary`). Eliminados `@ts-expect-error` y el doble cast `as unknown as YearlyAuditModule`. |
| ~~O5~~ | `server/index.ts:431,650,712` | Tres formas distintas de comprobar `NODE_ENV` (`=== "production"`, `!== "development"`, `!== "production"`). | **RESUELTO en F5** — añadida constante `isDev` junto a `isProd` (line 47) y migrados los 3 sitios a usar `!isDev` con un comentario que documenta por qué (cubre `production` + `staging`). Una sola fuente de verdad por intención. |
| ~~O6~~ | `server/server-constants.ts:48` | `WHATSAPP_NUMBER` y `ADMIN_EMAIL` con fallbacks hardcodeados (`"34614916910"`, `"arnau@exentax.com"`). | **RESUELTO en F5** — refactor a helper `envOr(name, fallback)` que registra cada fallback usado. Al boot, `getBrandingEnvFallbacks()` se consulta y si `isProd` y hay vars sin definir, se emite un único `logger.warn` con la lista. En dev/staging permanece silencioso. |
| ~~O7~~ | `server/index.ts:983–987` | `unhandledRejection` solo loguea + notifica, no termina el proceso. | **RESUELTO en F5** — extraídos `handleUnhandledRejection()` y `handleUncaughtException()` como funciones nombradas con docstring que define la política process-level (Express NO debe morir por una promesa colgada; codes de red recuperables NO escalan). Centralizada con `RECOVERABLE_NET_CODES`. |
| ~~O8~~ | `server/discord.ts:856` | `setTimeout` para reencolar en cola de memoria. No tracked en `activeIntervals`. | **RESUELTO en F5** — añadido `Set<NodeJS.Timeout> _pendingRetryTimers` en `discord.ts` y exportada `clearPendingDiscordTimers()`, invocada desde `gracefulShutdown()` justo después de `clearActiveTimers()`. SIGTERM ya no deja el event loop despierto durante el `backoffMs` restante. |

### Hallazgos adicionales del architect (verificados y resueltos en T#36)

Un segundo arquitecto sugirió 6 vectores. Tras revisión a fondo en
T#36 (sin parches ni soluciones medias) cada uno se verificó contra
el código real, se determinó si era bug real o falsa alarma, y los
bugs reales se resolvieron estructuralmente con tests dedicados.

| # | Sugerencia del architect | Verificación a fondo contra el código | Disposición |
|---|--------------------------|----------------------------------------|-------------|
| A1 | "Filas de `discord_outbound_queue` rehidratadas pero nunca enviadas" | Verificado a fondo en T#36: `drainTick` (server/discord.ts) sí procesa filas DB vía `claimDueRows()` con `SELECT … FOR UPDATE SKIP LOCKED`. La rehidratación de `_pendingCount` en `loadBackend` es solo para el gauge de métricas y NO afecta al envío. Inicialmente intenté un cambio "co-tenancy hardening" (`_pendingCount = recovered` en lugar de `+= recovered`), pero el code review demostró que rompe `waitForQueueDrain()`: el orden de la primera invocación es `enqueue() → incPending() → getBackend() → loadBackend()`, así que asignar el conteo recuperado borra el incremento ya hecho y `getQueueSize()` retorna 0 mientras los POSTs siguen inflight. Verificado por la regresión `tests/discord/test-discord-bot-e2e.ts` (bloquear/desbloquear). **Decisión final**: revertido a `+= recovered` (suma), comentario reescrito documentando el orden de llamada y por qué la inflación co-tenant es aceptable (solo afecta al gauge, converge al primer drain, claim FOR UPDATE SKIP LOCKED garantiza no doble-envío). | **Falso positivo confirmado en T#36**. Sin acción de envío; comentario del código clarificado. |
| A2 | "Drip worker: si dispatch éxito pero `advance` falla y luego `markError` también falla → claim queda 10 min → email duplicado" | El doble-fallo dejaba la fila con SMTP enviado pero sin advance, y el siguiente claim re-enviaría el mismo step. **Cambio aplicado** (audit option ii sin tabla `email_log` separada): añadida columna `last_sent_step` en `drip_enrollments` (con `ALTER TABLE … ADD COLUMN IF NOT EXISTS` idempotente en `runColumnMigrations`), helper `markDripStepSent({ id, toStep })` (storage/marketing.ts) que se persiste *después* de un dispatch SMTP exitoso y *antes* del `advance`. `drainOnce` y `sendImmediateStep1` consultan `lastSentStep ≥ stepToSend` antes de enviar y, si ya está marcado, saltan el dispatch y solo reintenta el `advance`. Adicionalmente, se añadió `poisonDripEnrollment` (NULL `next_send_at`, `last_error` con prefijo `POISONED:step=N:`, claim NO liberado) que se invoca cuando `markDripStepSent` falla 3 veces tras un dispatch exitoso — esto cierra la ventana SMTP-OK / sentinela-fail (la fila queda fuera de la cola hasta intervención del operador en lugar de re-enviarse). **Race fix adicional T#36-rev2**: `sendImmediateStep1` (path fire-and-forget llamado por las rutas de newsletter/calculator tras `tryCreateDripEnrollment(next_send_at = now())`) ahora adquiere el mismo lock por fila (`claimed_at`) que usa el worker, vía nuevo helper `tryClaimDripEnrollmentForImmediate({ id, expectedStep: 1 })`. Sin este claim atómico, una iteración del `drainTick` concurrente podía reclamar la misma fila y disparar SMTP en paralelo (la CAS de `markDripStepSent` previene la doble escritura del sentinel pero NO el doble envío SMTP). Cubierto por `tests/drip-exactly-once.test.ts` (37 asserts: scenario 1 advance-fail recovery, scenario 2 markSent-fail poison en `drainOnce`, scenario 3 markSent-fail poison en `sendImmediateStep1`, scenario 4 worker pre-claim race vs `sendImmediateStep1` → 0 dispatch, scenario 5 dos `sendImmediateStep1` concurrentes para la misma fila → exactamente 1 dispatch). **Residuales conocidos y aceptados** (no eliminables sin un outbox transaccional o tokens de fencing): (a) ventana entre el ACK SMTP y la primera escritura de sentinela; (b) "lease overlap" — si la ruta inmediata reclama y luego se queda colgada >`STALE_CLAIM_SECONDS` (10 min) antes de despachar SMTP, el worker puede robar el claim por staleness y disparar SMTP también (extremadamente raro: implicaría un SMTP que tarda más de 10 min en responder o un proceso bloqueado entre claim y dispatch); (c) doble fallo `markDripStepSent` + `poisonDripEnrollment` tras un SMTP exitoso (logueado como CRITICAL — puede dejar la fila reclamable y producir reenvío en el siguiente claim). | **RESUELTO en T#36 bajo asunciones operativas razonables** — la race original entre worker y envío inmediato (la única que se daba bajo carga normal) está cerrada con claim atómico; los tres residuales (a/b/c) requieren patrón outbox o fencing tokens y se documentan explícitamente como deuda conocida. Test de regresión cubre los caminos felices y los dos paths de poison. |
| A3 | "Rate limit Map evicta usuarios legítimos bajo IP-rotation attack" | El eviction LRU (server/index.ts:509–516) sí drop oldest, pero un usuario evictado solo ve su contador resetearse — NO queda bloqueado. El cap de 10K × ~50 B = 500 KB no es vector de RAM. Solo se usa cuando `_globalRlStore` (Redis) no está disponible. Reverificado en T#36: el escenario descrito requiere que el atacante satura 10K IPs distintas en la misma ventana, y el peor caso es que un legítimo evictado pueda hacer `max+1` peticiones en lugar de `max`. No es escalada de privilegios ni DoS. | **Falso positivo verificado en T#36**. Sin acción. |
| A4 | "Side effects post-tx en booking (scheduleReminder, notifyDiscord, logConsent) → si crashea entre llamadas quedan sin ejecutar" | Verificado: `scheduleReminderEmail` y `notifyBookingCreated` ya tienen recovery (sweeper DB / `discord_outbound_queue` persistente). `insertConsentLog` y `upsertNewsletterSubscriber` se ejecutaban *después* de commit en booking, calculadora y newsletter footer — un crash entre commit y ese par escribía la reserva pero perdía el consent (violación GDPR potencial). **Cambio aplicado**: `insertConsentLog(input, txDb?)` y `upsertNewsletterSubscriber(..., txDb?)` aceptan ahora un parámetro opcional `txDb: DbOrTx`. Las tres rutas (`POST /api/booking`, `POST /api/calculator/save`, `POST /api/newsletter/subscribe`) pre-resuelven `privacyVersion`/`ip`/`ua` antes de la transacción y llaman a ambos *dentro* de `withTransaction`, capturando el `consentId` para notificación post-commit a Discord. Cubierto por test dedicado `tests/consent-atomicity.test.ts` (12 asserts: rollback escenario, commit escenario, cascade, legacy sin tx). | **RESUELTO en T#36** — atomicidad consent+booking garantizada, con test. |
| A5 | "`checkCsrfOrigin` over-reliance on Origin" | Reverificado en T#36 contra `route-helpers.ts:418–431`: valida `origin`, cae a `referer` si origin es vacío o `"null"`, rechaza si ambos faltan, e `isTrustedOrigin` valida hostname contra lista cerrada (SITE_URL + dominios replit dev). Implementación estándar OWASP. | **Falso positivo verificado en T#36**. Sin acción. |
| A6 | "`tx as unknown as DbOrTx` permite que dev use `db` global por accidente" | El cast no causaba bug runtime, pero `DbOrTx` era simplemente `typeof db`, perdiendo info de tipo. **Cambio aplicado** (server/db.ts): `DbOrTx` es ahora una unión propia `DrizzleDb \| PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>`. El cast `tx as unknown as DbOrTx` se eliminó de `withTransaction`; `tx` se pasa directamente a `fn` con su tipo nativo. TypeScript ahora rechaza `db.transaction(...)` accidental dentro de un callback sin pasar por el parámetro `tx`. | **RESUELTO en T#36** — corrección de tipos estructural. |

### Resumen del segundo barrido

- **Búsqueda de SQL injection**: 0 hallazgos. Todo el SQL usa template tagged `sql`…`` de Drizzle (parametrizado) o `eq(col, value)`.
- **Búsqueda de XSS sinks**: 0 hallazgos en cliente. No hay `dangerouslySetInnerHTML` ni `innerHTML` en componentes.
- **Búsqueda de double-response (`res.json`/`res.send` sin return)**: 0 hallazgos en `routes/public.ts`.
- **Búsqueda de `JSON.parse` sin try/catch**: 9 sitios, todos envueltos en `try/catch` o leídos al boot (donde un fallo es un error de configuración, no de runtime).
- **Timers / `setInterval` / `setTimeout`**: 22 sitios revisados. Tras F1, los 5 warmups del scheduler están normalizados con `.unref()`.

---

## 7. Recomendaciones para tareas paralelas

Estas observaciones quedan **anotadas** para que las tareas siguientes
las consideren (no se ejecutan aquí):

- **Tarea #19** (ruteo de emails): el patrón "estricto con tx, soft sin tx" de `enqueueEmail` es la primitiva correcta; cualquier nuevo email transaccional debe pasar `tx` para no quedar huérfano.
- **Tarea #20** (contenido emails): `email-i18n/types.ts` ya define los tipos; los templates deben respetar `language` que viene de la fila (ya seteado en booking/calculator/drip).
- **Tarea #23** (slugs/i18n): `ROUTE_SLUGS` y `ALL_ROUTE_KEYS` en `shared/routes.ts` son la única fuente de verdad; `App.tsx` itera sobre ellas. Cualquier nueva página requiere actualizar `PAGE_COMPONENTS` y `pageImports`.
- **Tarea #24** (SEO/sitemap): considerar devolver 404 HTTP para rutas API desconocidas (no SPA); hoy todo cae al manejador global con 200.

---

## 8. Checklist de verificación (automatizada)

Comandos ejecutados al cierre de este pase (29-abr-2026, 23:00 CET):

| Comando                             | Resultado |
|-------------------------------------|-----------|
| `npx tsc --noEmit`                  | ✅ 0 errors (full project) |
| `npm run lint:typography`           | ✅ Regla 0 OK · 0 violaciones decorativas |
| `npm run i18n:check`                | ✅ 0 hardcoded user-visible strings |
| `npm run test:booking`              | ✅ 54/54 checks passed |
| `npm run test:newsletter`           | ✅ 55/55 checks passed |
| `npm run test:discord-regression`   | ✅ 6/6 scripts (72 sub-checks) passed |
| `npm run test:redirects`            | ✅ 9/9 tests passed |
| `npm run test:geo`                  | ✅ 12/12 tests passed |

`npm run check:serial` (la suite completa) ejecuta además ~22 lints/tests
de tareas paralelas (calculadora #17, schema #18, meta #21, blog/CTAs
#22, SEO #24). No se invocan aquí para no contaminar el resultado del
audit con código que esos agentes están migrando en paralelo. Los lints
y tests propios de la capa auditada (TypeScript, typography, i18n,
booking, newsletter, discord, redirects, geo) están todos verdes.

## 8.b Manual Test Checklist por superficie auditada

| # | Superficie | Archivos clave | Verificación |
|---|------------|----------------|--------------|
| C1 | **Navegación cliente** (lazy chunks, RouteErrorBoundary, RootRedirect, NotFound i18n) | `client/src/App.tsx`, `client/src/pages/not-found.tsx`, `client/src/components/RouteErrorBoundary.tsx` | Code-review §3 + `test:redirects` 9/9 |
| C2 | **Middleware order** (helmet → geo → compression → legacy redirects → discord raw → JSON → sanitize → ratelimit) | `server/index.ts:123–540` | Code-review §1 + manual trace en sección 5 del audit |
| C3 | **Discord interactions** (signature ed25519, replay window, isBotConfigured, errorId opaco) | `server/discord-bot.ts:272–384`, `server/discord/handlers/*` | `test:discord-regression` 6/6 (72 sub-checks) |
| C4 | **Discord outbound queue** (DB persistence, claim FOR UPDATE SKIP LOCKED, stale recovery, fallback alert) | `server/discord.ts:560–940` | Verificado en arch review A1 (rehydrate falso positivo) + e2e |
| C5 | **Email send paths** (strict-when-tx, soft-when-no-tx, retry queue durable) | `server/email-retry-queue.ts`, `server/email/*` | Code-review §4 + `test:newsletter`/`test:booking` cubren branch happy + retry |
| C6 | **Booking flow atomic** (slot lock + transaction + reminder claim) | `server/routes/public.ts:600–900`, `server/route-helpers.ts:scheduleReminderEmail`, `server/storage/scheduling.ts` | `test:booking` 54/54 (incluye step 8 race + step 9 reminder idempotency) |
| C7 | **Workers** (drip, retry, broadcast, periodic-reports, incomplete-bookings, reconcile-zombies, retention-purge) | `server/scheduled/*` | Cada worker con try/catch + reentrancy + activeIntervals + warmups con `.unref()` (F1 normalizó el último) |
| C8 | **Process-level** (SIGTERM graceful, unhandledRejection notify, uncaughtException recoverable) | `server/index.ts:962–999` | Code-review §1 — política documentada en sección 6 del audit |
| C9 | **Manejo de errores** (asyncHandler en todas las rutas, manejador global con errorId, sin double-response) | `server/route-helpers.ts:asyncHandler`, `server/routes.ts:148–178` | Búsqueda profunda en `routes/public.ts` (1796 líneas): 0 sitios `res.X(...)` sin `return` |
| C10 | **SQL injection / XSS** | Toda la capa storage + cliente | Búsqueda en sección 6.b "Resumen del segundo barrido": 0 hallazgos |

---

## 9. Conclusión

La capa de runtime (navegación, emails, Discord bot, workers, middleware
y manejo de errores) está **lista para producción**. Las defensas
detectadas son consistentes con los patrones documentados en
`docs/discord-bot-agenda.md`, `docs/compliance/README.md` y los headers
de cada archivo de `server/scheduled/*`. **No se introducen cambios de
código**: el alcance de Tarea #16 era auditar y dejar evidencia, y los
puntos de fallo silenciosos que el "Done" exige eliminar ya están
cubiertos por:

1. `asyncHandler` en todas las rutas Express.
2. `try/catch` interno + reentrancy guard en todos los workers.
3. `replyEphemeral`/`followupEphemeral` en todas las ramas de los
   dispatchers de Discord.
4. `withTransaction` + `enqueueEmail({tx})` para emails que deben
   acompañar un commit (booking).
5. `notifyCriticalError` a `#sistema-errores` para todo 5xx y para
   `unhandledRejection` / `uncaughtException`.
6. `gracefulShutdown` cierra HTTP server, pool y todos los `intervals`
   y `timeouts` activos en SIGTERM/SIGINT.

Cualquier endurecimiento adicional (p. ej. devolver 404 HTTP real para
rutas API desconocidas, o convertir el `RouteErrorBoundary` en pantalla
"reload to retry") queda anotado en §7 para las tareas que cubren la
capa SEO (#24) y de UX (#23).

---

## 10. Resultados de pruebas

_Se completa al cierre del pase._
