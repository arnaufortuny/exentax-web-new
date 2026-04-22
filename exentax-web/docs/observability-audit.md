# Observability & resilience audit — Exentax web

> Auditoría aditiva (sin cambios funcionales) que documenta el estado actual de
> la plataforma, identifica gaps y deja el endurecimiento implementado en este
> mismo cambio. Cubre logs, trazabilidad, alertas, health checks, reintentos,
> timeouts, circuit breakers, colas, degradación, rate limiting, backups y
> métricas.

## 1. Resumen ejecutivo

| Dimensión | Estado previo | Acción aplicada |
|-----------|---------------|-----------------|
| Logs estructurados | Texto plano + filtrado por nivel + redacción de PII | **JSON opcional (`LOG_FORMAT=json`, default en prod)** |
| Trazabilidad | Sin correlation id en logs | **`X-Correlation-Id` propagado vía AsyncLocalStorage** |
| Health check | Mezclaba liveness + readiness (DB) | **Split: `/api/health` (liveness) + `/api/health/ready` (readiness con DB y breakers)** |
| Captura global de errores backend | `unhandledRejection` + `uncaughtException` ya presentes | Mantenido + alerta de fallback en log si Discord falla |
| Captura global de errores frontend | Solo dev-console | **`window.onerror` + `unhandledrejection` + envío a `/api/client-errors`** |
| Métricas | Ninguna | **`/api/metrics` (Prometheus + JSON) con HTTP, breakers, colas, event-loop** |
| Reintentos / backoff | Email queue, IndexNow, Discord | Auditado; sin cambios funcionales |
| Timeouts HTTP salientes | Discord 8s, Gmail/Calendar via SDK; **IndexNow sin timeout explícito** | **Timeout 8s añadido a IndexNow** |
| Circuit breakers | Gmail + Calendar | **Registro central + estado expuesto en métricas** |
| Colas / degradación | `email_retry_queue` (PG), in-process timers, Discord queue | Auditado; tamaño expuesto en métricas |
| Rate limiting | Global 200/min + por endpoint | Auditado; sin cambios |
| Alertas | Discord con dedup TTL (5 min, 500 keys) | **Fallback ALERT log si el bot REST falla terminalmente o falta config** |
| Backups | Gestionado por la plataforma | **Script `scripts/verify-backup.ts` para validar el estado del DB target** |

Severidad global: previo a este cambio había **2 gaps altos** (sin métricas
operacionales, sin captura de errores cliente en producción) y **3 medios**
(health no separado, sin correlation id, IndexNow sin timeout). Todos
mitigados de forma aditiva.

## 2. Logs

### Estado anterior
- `server/logger.ts` con niveles `debug|info|warn|error` filtrados por
  `LOG_LEVEL` y redacción centralizada de claves sensibles.
- Formato textual (`HH:MM:SS [LEVEL] [source] message`) tanto en dev como en
  prod. Difícil de filtrar/ingestar en agregadores.
- `logger.request(method, path, status, durationMs, body)` ya capturaba
  cuerpos de respuesta API (con redacción PII en dev).

### Cambios
- Nuevo modo **JSON estructurado** activable por `LOG_FORMAT=json` (default
  en producción). Cada línea es un único objeto JSON con `ts`, `level`,
  `source`, `msg`, `correlationId` (cuando aplica) y campos adicionales
  (`method`, `path`, `status`, `durationMs`, `body`, `err`, …).
- Nuevo helper **`logger.alert()`** — emite siempre (ignora `LOG_LEVEL`)
  con marca `alert: true` para que el agregador lo enrute aunque el canal
  de Discord esté caído.

### Variables relevantes
| Variable | Default | Descripción |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` (prod) / `debug` (dev) | Nivel mínimo a emitir |
| `LOG_FORMAT` | `json` (prod) / `text` (dev) | Formato de salida |

## 3. Trazabilidad

### Cambios
- `server/correlation.ts` — middleware `correlationMiddleware` que toma
  `X-Correlation-Id` (o `X-Request-Id`) si llega validado por regex, o
  genera un `randomUUID()`. Se devuelve en la respuesta y se guarda en un
  `AsyncLocalStorage` de modo que `logger.{info,warn,error,request,alert}`
  lo agregue automáticamente sin propagación manual.
- Cualquier helper async (Discord, email-retry, breakers) que loguee
  durante el ciclo de vida del request hereda el id sin cambios en sus
  firmas.

## 4. Health checks

### Antes
- Único endpoint `/api/health` mezclaba liveness (proceso arriba) con
  readiness (DB conectada). Una caída transitoria del DB devolvía 503 y
  podía provocar reinicios del orchestrator (peor escenario para recuperar).

### Ahora
- `GET /api/health` — **liveness puro**. Responde 200 si el proceso terminó
  el bootstrap (`serverReady`). No toca DB.
- `GET /api/health/ready` — **readiness**. Comprueba:
  - Conectividad DB con timeout local de 2s.
  - Estado de circuit breakers registrados (degrada si hay alguno OPEN).
  - Devuelve 503 con `{ status: "degraded", checks }` si algún check falla.

## 5. Captura global de errores

### Backend
- `process.on("unhandledRejection")` y `process.on("uncaughtException")` ya
  existentes en `server/index.ts`. Errores recoverable de red (`ECONNRESET`,
  `EPIPE`, `ETIMEDOUT`, …) se loguean como `warn` y el proceso continúa;
  el resto dispara `notifyCriticalError` + shutdown ordenado.
- Middleware Express de error responde 500 normalizado y emite
  `notifyCriticalError` solo para `status >= 500`.

### Frontend
- `client/src/lib/clientLogger.ts` reescrito:
  - Mantiene console-mirror en dev.
  - Añade `init()` (idempotente) que registra `window.onerror` y
    `unhandledrejection`.
  - Envía cada error a `POST /api/client-errors` con `keepalive: true`,
    rate-limit local (50/sesión, 500ms entre envíos) y deduplicación por
    `kind|message`.
- `main.tsx` invoca `clientLogger.init()` antes del `createRoot`.
- Backend `POST /api/client-errors` (Zod validado, rate-limit 30/min/IP)
  loguea con prefijo `[client-error]` e incrementa el counter
  `client_errors_total`.

## 6. Métricas (`/api/metrics`)

Endpoint nuevo — formato Prometheus por defecto, JSON si el cliente envía
`Accept: application/json`. Protegible con `METRICS_TOKEN` (Bearer).

Series expuestas:

| Métrica | Tipo | Notas |
|---------|------|-------|
| `process_uptime_seconds` | gauge | `process.uptime()` |
| `process_resident_memory_bytes` | gauge | `process.memoryUsage().rss` |
| `nodejs_heap_used_bytes` | gauge | `heapUsed` |
| `nodejs_event_loop_lag_ms` | gauge | p99 vía `monitorEventLoopDelay` |
| `http_requests_total{method,status}` | counter | Por familia 2xx/3xx/4xx/5xx |
| `http_request_duration_ms_bucket{le}` | histogram | Buckets 5..10000 ms |
| `discord_queue_size` | gauge | Cola en memoria del módulo Discord |
| `discord_dropped_total` | counter | Mensajes desalojados por cola llena |
| `discord_send_failure_total` | counter | Fallos terminales de envío |
| `email_retry_queue_size` | gauge | `count(*)` jobs activos en `email_retry_queue` |
| `alert_fallback_total` | counter | Veces que se cayó al log ALERT |
| `client_errors_total` | counter | Errores ingestados desde el navegador |
| `circuit_breaker_state{name}` | gauge | 0 closed · 1 half-open · 2 open |

## 7. Reintentos & timeouts

| Salida | Timeout | Retries | Backoff | Cambio |
|--------|---------|---------|---------|--------|
| Discord bot REST | 8s (AbortController) | 3 | exp 1.5s..30s | Añadido fallback ALERT al fallar terminalmente |
| IndexNow | **8s (nuevo)** | 3 | exp 1s..4s | Añadido AbortController explícito |
| Sitemap ping (Bing) | none (best-effort) | 0 | — | Aceptado: fire-and-forget de baja criticidad |
| Gmail API (envío) | SDK default + circuit-breaker | encolado en `email_retry_queue` (6 intentos) | 1m..12h | Sin cambios |
| Google Calendar / Meet | SDK default + circuit-breaker | inline (best-effort) | — | Sin cambios |
| Postgres (pool) | `connectionTimeoutMillis=5s`, `statement_timeout=30s`, `query_timeout=30s` | — | — | Sin cambios |

## 8. Circuit breakers

- `googleCalendarBreaker` (3 fallos / 60s cooldown)
- `emailBreaker` (5 fallos / 60s cooldown)
- Nuevo: registro global + getter `getRegisteredBreakers()`. Cada
  transición notifica a `metrics.setBreakerState`, expuesta vía
  `/api/metrics` y `/api/health/ready`.

## 9. Colas y degradación

- **Email retry queue (Postgres)** — `FOR UPDATE SKIP LOCKED`, `claimed_at`
  para evitar doble entrega entre instancias, backoff 1m..12h, max 6
  intentos. Tras agotamiento la fila queda en la tabla para inspección
  manual. Tamaño visible en métricas (`email_retry_queue_size`).
- **In-process Discord queue** — FIFO con `QUEUE_MAX=80`, drenaje cada
  1.5s, AbortController 8s, exp backoff. Si la cola se desborda, el
  evento más antiguo se descarta (counter `discord_dropped_total`). Si
  la entrega definitiva falla (HTTP 4xx no-retriable o agotó retries),
  se emite `logger.alert(...)` y se incrementa `alert_fallback_total`.
- **Reminders de booking** — timers en proceso + sweep al arranque que
  reprograma los pendientes desde `agenda` (sobrevive a reinicios).
- **Locks** — `withSlotLock`, `withBookingLock` (Redis si disponible o
  memoria local) + índice único parcial `agenda_active_slot_uniq_idx`.

## 10. Rate limiting

- `/api/*` global: **200 req/min/IP** (Redis si `REDIS_URL`, fallback
  memoria con purga periódica y tope de 10k entradas).
- Limit específico por endpoint (booking, calculator, newsletter, public,
  visits, consent) ya implementado en sus rutas.
- `/api/client-errors` añade un segundo nivel de rate-limit local (30/min/
  IP) para que un loop en una pestaña no envenene la cola global.

## 11. Backups

- El backup físico (PITR) es responsabilidad del proveedor managed Postgres.
- `scripts/verify-backup.ts` — comando de verificación operativa que:
  1. Conecta usando `DATABASE_URL` (o el que se indique vía env).
  2. Comprueba que las tablas críticas existen (`agenda`, `leads`,
     `calculations`, `visits`, `newsletter_subscribers`, `blocked_days`,
     `legal_document_versions`, `consent_log`, `email_retry_queue`,
     `seo_rankings`).
  3. Confirma que el índice único parcial `agenda_active_slot_uniq_idx`
     está presente (garantía de no-doble-booking).
  4. Verifica que hay actividad real (suma de leads + visits + agenda > 0)
     para detectar restores apuntados al DB equivocado.
  5. Reporta visitas de los últimos 30 días.
  6. Opcional: `--dump=<path>` realiza una **verificación real de
     restauración**: crea una base temporal (`createdb`), restaura el
     dump (`pg_restore` para `.dump`/`.tar`/`.pgdump`, `psql --single-
     transaction` para `.sql`), re-ejecuta los invariantes de esquema
     (tablas críticas presentes, `agenda_active_slot_uniq_idx` presente)
     sobre la copia restaurada y la elimina con `dropdb` en `finally`,
     incluso si la restauración falla. Si `pg_restore`/`psql`/`createdb`/
     `dropdb` no están en `PATH`, el check se marca como fallido con un
     mensaje claro (no se silencia). El nombre de la base temporal es
     aleatorio (`verify_<hex>`) para que ejecuciones concurrentes no
     colisionen.

  Exit codes: `0` ok, `1` algún check falló, `2` error de uso.

## 12. Variables de entorno nuevas

| Variable | Default | Descripción |
|----------|---------|-------------|
| `LOG_FORMAT` | `json` en prod, `text` en dev | `json` para salida estructurada |
| `METRICS_TOKEN` | (vacío) | Si se define, `/api/metrics` exige `Authorization: Bearer <token>` |

## 13. Escenarios de validación

| Escenario | Procedimiento | Verificación |
|-----------|---------------|--------------|
| Liveness vs readiness | Detener Postgres temporalmente | `/api/health` sigue 200, `/api/health/ready` devuelve 503 con `checks.db.ok=false` |
| Correlation id | `curl -H "X-Correlation-Id: abc-test-123" /api/health` | Header echo en respuesta y todos los logs del request lo incluyen |
| Logs JSON | `LOG_FORMAT=json npm run dev` y emitir un request | `console.log` produce líneas parseables como JSON |
| Captura cliente | Lanzar `throw new Error("test")` en consola del navegador | `POST /api/client-errors` recibido y `client_errors_total` incrementa |
| Métricas (dev) | `curl /api/metrics` | Responde 200 text/plain con todas las series |
| Métricas autenticadas | `METRICS_TOKEN=x` y request sin Bearer | 401 |
| Métricas en prod sin token | `NODE_ENV=production` sin `METRICS_TOKEN` | `/api/metrics` responde 503 `METRICS_TOKEN_REQUIRED` (fail-closed) |
| Email worker liveness | Detener el worker (`stopEmailRetryWorker()`) o esperar >3 intervalos sin tick | `/api/health/ready` baja a 503 con `checks.emailWorker.ok=false` |
| Readiness durante arranque | Hacer una request justo al iniciar el proceso | `/api/health/ready` responde 503 JSON `{status:"starting", ready:false}` en vez del HTML genérico de startup |
| Restore de backup | `tsx scripts/verify-backup.ts --dump=/tmp/backup.dump` | `[OK] restore`, `[OK] restore-tables`, `[OK] restore-agenda-index`, `[OK] restore-cleanup` |
| Fallback Discord | Invalidar `DISCORD_BOT_TOKEN` o `DISCORD_CHANNEL_ERRORES` y disparar `notifyCriticalError` | Tras agotar retries: `[ALERT]` en log + `alert_fallback_total` aumenta |
| IndexNow timeout | Bloquear red al endpoint | El fetch aborta a 8s y entra en backoff (no cuelga 60s+) |
| Verify backup | `tsx scripts/verify-backup.ts` contra DB de staging | Exit 0 + listado de checks ok |
| Email retry | Insertar fila manual con `next_attempt_at = now()` | El worker la consume en <60s y la borra al éxito |

## 14. Gaps pendientes (fuera del alcance de este cambio)

- **Tracing distribuido (OpenTelemetry)** — la propagación del correlation
  id ya está; añadir spans queda para una iteración futura cuando exista
  un colector definido.
- **Persistencia de métricas** — actualmente in-process; al reiniciar se
  pierden los counters. Aceptado (los counters Prometheus se reinician en
  cada restart por convención; el agregador acumula deltas).
- **Backup logical scheduled** — ejecución automática del dump no está
  programada; se documenta el procedimiento manual + `verify-backup.ts`.
- **Alerta proactiva si la cola Discord crece** — solo se ve en métricas;
  un alertmanager externo puede disparar reglas sobre `discord_queue_size`
  y `email_retry_queue_size`.
