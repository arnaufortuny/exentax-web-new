# Auditoría de seguridad

**Última revisión:** 2026-04

Estado de hardening del backend y frontend, con referencias a fichero/línea
de la implementación verificada y comandos de validación reproducibles.

## 1. Headers de seguridad (helmet)

Implementación: `server/index.ts:57–86`.

| Header | Valor / configuración | Línea |
|--------|----------------------|-------|
| `Content-Security-Policy` | `default-src 'self'`, scripts/connect a Google Analytics, GTM y Facebook ads, `frameAncestors 'self'`, `objectSrc 'none'`, `upgradeInsecureRequests` en producción | 58–75 |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (sólo prod) | 77 |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` | 79 |
| `X-Frame-Options` | `SAMEORIGIN` (frameguard) | 80 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 81 |
| `X-Permitted-Cross-Domain-Policies` | `none` | 82 |
| `X-Content-Type-Options` | `nosniff` | 83 |
| `X-Powered-By` | deshabilitado por helmet | implícito |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), browsing-topics=()` | 137 |

**Verificación reproducible (tras despliegue):**
```bash
curl -sI https://exentax.com | grep -iE "content-security-policy|strict-transport-security|x-frame-options|referrer-policy|permissions-policy|x-content-type-options"
```

## 2. Validación y sanitización de entradas

- **Zod estricto** en cada handler público y administrador. Evidencia
  (`grep -nE "z\.object|safeParse" server/routes/public.ts`):
  - `server/routes/public.ts:142` (`slotsQuerySchema`)
  - `server/routes/public.ts:196` (`bookingRequestSchema`) — incluye
    `privacyAccepted: z.boolean().refine(v=>v===true, "zodMustAcceptPrivacy")`
    en la línea 211.
  - `server/routes/public.ts:426` (`rescheduleSchema`)
  - `server/routes/public.ts:599` (`calculatorLeadSchema`) — privacy
    obligatoria, marketing opcional con default false (líneas 619–620).
  - `server/routes/public.ts:741` (`cookieConsentSchema`)
  - `server/routes/public.ts:770` (`newsletterSubscribeSchema`)
- **Sanitización automática** del payload (`server/sanitize-middleware.ts`):
  recorta HTML, elimina prototipos peligrosos (`__proto__`, `constructor`,
  `prototype`), profundidad máx. 10, longitud de claves máx. 500.
- **Sanitización de HTML** en frontend (`client/src/lib/sanitize.ts`)
  para contenido renderizado con `dangerouslySetInnerHTML` (páginas
  legales).

**Smoke test:**
```bash
curl -sX POST https://exentax.com/api/calculator-leads \
  -H "Content-Type: application/json" -d '{"foo":"bar"}'
# Esperado: 400 con error de validación genérico
```

## 3. Rate limiting

Implementación: `server/rate-limit-store.ts` (Redis + fallback en memoria,
ventana deslizante con `resetAt`).

Configuración por endpoint (`server/route-helpers.ts:266–270`):

| Limiter | Máx. peticiones | Ventana |
|---------|-----------------|---------|
| `bookingManageLimiter` | 30 | 60 min |
| `publicDataLimiter` | 60 | 60 s |
| `visitorLimiter` | 30 | 60 s |

Aplicado en `server/routes/public.ts` (líneas 137, 148, 386, 408, 550, 820)
mediante `checkPublicDataRateLimit(ip)`, `checkBookingManageRateLimit(ip)`
y `checkVisitorRateLimit(ip)`.

## 4. Autenticación / autorización admin

- Verificación de sesión/token en cada handler de
  `server/discord-bot-commands.ts` (role gate Discord, no únicamente middleware global).
- Respuestas `401`/`403` sin filtrar información (usuario inexistente vs.
  password inválido se tratan igualmente).

## 5. Tokens de gestión de reserva

- **Generación**: `crypto.randomBytes(24).toString("hex")` → 48 chars hex
  (192 bits de entropía).
- **Almacenamiento**: campo `manageToken` cifrado
  (`server/field-encryption.ts`).
- **Comparación**: `crypto.timingSafeEqual` en `getAgendaByIdAndToken`
  (resistente a timing attacks).
- **Expiración**: implícita — el endpoint rechaza acceso una vez la fecha
  de la reunión ha pasado (`isPast`). El token queda lógicamente
  invalidado al cancelar la reserva.
- **Indexación**: las páginas `/booking/manage/*` están marcadas
  `noindex` (cubierto en tarea #5).

## 6. Cifrado de datos sensibles

`server/field-encryption.ts` aplicado consistentemente sobre:

- `phone` en `storage/scheduling.ts` (tabla `agenda`).
- `phone` en `storage/marketing.ts` (tabla `leads`).
- `manageToken` en `storage/scheduling.ts`.

**Logs**: revisados — no contienen email completo ni teléfono completo;
solo dominios o últimos dígitos cuando es necesario para soporte.

## 7. Variables sensibles

- `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_*`, `GOOGLE_CREDENTIALS`, claves de cifrado y
  `DATABASE_URL` **nunca** se exponen al cliente. Convención: solo
  `VITE_*` puede aparecer en el bundle del cliente.

**Verificación post-build:**
```bash
npm run build && \
  grep -RIE "DISCORD_BOT_TOKEN|DISCORD_CHANNEL|GOOGLE_CREDENTIALS|DATABASE_URL|FIELD_ENCRYPTION_KEY|manage_token" dist/public/ \
  || echo "OK: no leak"
```

- Fail-fast en arranque si faltan variables críticas en producción
  (cubierto por tarea #5).

## 8. Compliance / GDPR

- **Checkboxes de consentimiento** explícitos (no premarcados) en:
  - `BookingCalendar` — privacidad obligatoria, marketing opcional.
  - `EmailGateForm` (calculadora) — privacidad obligatoria, marketing opcional.
  - `NewsletterForm` (footer) — privacidad obligatoria, marketing opcional.
- **Validación servidor**: ambos consentimientos exigidos vía Zod
  (`refine(val => val === true, "zodMustAcceptPrivacy")` en
  `server/routes/public.ts:211` y `:619`).
- **Registro de consentimiento**: `logConsent({ formType, email,
  privacyAccepted, marketingAccepted, language, source, privacyVersion,
  ip })` en `server/routes/public.ts:374` y `:734`. Persistido junto al
  lead/reserva y reflejado en Discord vía `notifyConsent`.
- **Páginas legales** (`/legal/{privacy,terms,cookies,disclaimer,refunds}`):
  responsable de tratamiento, base legal, derechos ARCO/portabilidad,
  retención, transferencias internacionales (Google, Discord, hosting),
  cookies reales y disclaimer fiscal coherente con la calculadora.
- **Banner de cookies**: bloquea scripts no esenciales (analytics, ads)
  hasta consentimiento. Tracking se carga solo tras opt-in.

## 9. Webhooks Discord

Implementación: `server/discord.ts`.

- **Versionado de payload**: `DISCORD_PAYLOAD_VERSION = 1` exportado.
  El sufijo `· v1` (constante `PAYLOAD_VERSION_TAG`) se inyecta en el
  texto del footer de **todo** embed saliente (`brandFooter`), de modo
  que el contrato es auto-descriptivo en el propio canal. La validación
  Zod del footer **rechaza** payloads sin el tag de versión.
- **Validación Zod del payload saliente** (`discordPayloadSchema`)
  ejecutada justo antes del `enqueue`. Si falla la validación se loguea
  y se descarta el envío en lugar de enviar un payload inconsistente.
- **Logs sin PII**: cuando se descarta una notificación duplicada se
  registra `keyHash=<sha256[:12]>` en lugar de la clave en claro,
  evitando exponer email/IDs en `logger.debug` (`hashKey()`).
- **Idempotencia** por `dedupKey` con TTL de 5 min (Map en memoria,
  máx. 500 entradas con purga oportunista, líneas 368–385). Aplicada a
  todos los wrappers de notificación:
  - `notifyBookingCreated` → `booking_created:{bookingId}`
  - `notifyBookingRescheduled` → `booking_rescheduled:{bookingId}:{newDate}:{newStartTime}`
  - `notifyBookingCancelled` → `booking_cancelled:{bookingId}`
  - `notifyNoShow` → `booking_no_show:{bookingId}`
  - `notifyCalculatorLead` → `lead_calculator:{email}:{ahorroRedondeado}`
  - `notifyNewsletterSubscribe` → `lead_newsletter:{email}`
  - `notifyNewLead` → `lead_new:{leadId}`
  - `notifyValidationFailed` → `validation_failed:{method}:{route}:{ip}`
  - `notifyCriticalError` → `system_error:{context}:{code}:{message[:80]}`
- **Backoff exponencial** acotado (3 reintentos, máx. 30 s) ante
  `429`/`5xx`/timeouts. Cola con tope (`QUEUE_MAX = 80`) para evitar
  acumulación bajo presión.
- **Logs estructurados** vía `logger.ts` ante fallos definitivos.
- **Sin PII innecesaria** en canales públicos (`actividad`).
- **Fallback**: canal `errores` cae sobre `registros` si no está configurado.

## 10. Auditoría de dependencias

Procedimiento periódico:

1. `npm audit --omit=dev` y revisar findings críticos/altos.
2. Ejecutar SAST (escaneo del workspace) — anotar la fecha y los
   findings priorizados aquí.
3. Para cada hallazgo crítico/alto: aplicar parche o documentar
   justificación de aceptación de riesgo (con fecha y responsable).

**Última ejecución:** 2026-04 — `npm audit --omit=dev`:
**8 vulnerabilidades (6 moderate, 2 high)**.

| Paquete | Severidad | Tipo | Vector | Estado |
|---------|-----------|------|--------|--------|
| `path-to-regexp` 8.0.0–8.3.0 | high | ReDoS — sequential optional groups (GHSA-j3q9-mxjg-w52f) | dependencia transitiva | Aceptado temporalmente: solo afecta a Express en rutas con patrones específicos no usados en este código; fix vía `npm audit fix` (no breaking) — aplicar en próximo ciclo |
| `picomatch` <2.3.2 | high | Method injection — POSIX classes (GHSA-3v7f-55p6-f55p) | transitiva (vite/chokidar) | Sin impacto en producción (solo dev-tools, no se ejecuta sobre input externo en runtime) |
| `esbuild` ≤0.24.2 | moderate | Dev-server CSRF (GHSA-67mh-4wv8-2f99) | transitiva (drizzle-kit) | Solo afecta a `vite` en dev local; no se ejecuta en producción |
| `@esbuild-kit/core-utils`, `@esbuild-kit/esm-loader` | moderate | propaga esbuild | transitiva (drizzle-kit) | Mismo análisis que esbuild |
| `drizzle-kit` 0.17.5–1.0.0-beta.1 | moderate | propaga esbuild | directa (devDependency) | Fix con SemVer major; planificar upgrade |
| `brace-expansion` 2.0.0–2.0.2 | moderate | DoS por bucle (GHSA-f886-m6hf-6m8v) | transitiva | Fix simple via `npm audit fix` |
| `yaml` (transitiva) | (clasificada con paquetes anteriores) | varios | transitiva | Fix via `npm audit fix` |

Todos los hallazgos high son **transitivos** y se aceptan
temporalmente porque no se ejecutan sobre input externo en runtime de
producción. Plan: aplicar `npm audit fix` (no breaking) y planificar el
upgrade major de `drizzle-kit` en el próximo ciclo de mantenimiento.
Sin findings críticos abiertos.

## Smoke test recomendado (orden)

1. `POST /api/calculator-leads` sin `privacyAccepted` → `400`.
2. `POST /api/bookings/book` con payload malformado → `400` limpio.
3. `GET /api/admin/...` (cualquier ruta) → `404` (superficie eliminada; admin vive en bot Discord).
4. Crear reserva real → comprobar email + Discord + admin coinciden.
5. Reintentar el mismo POST de reserva (mismo `bookingId`) → Discord
   no duplica (verificación dedupKey).
6. `curl -I https://exentax.com` → todos los headers de seguridad
   presentes.
