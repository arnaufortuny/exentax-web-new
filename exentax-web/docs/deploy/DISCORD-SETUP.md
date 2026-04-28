# Discord — setup profesional para Exentax Web

Toda la superficie admin del proyecto vive en Discord (no hay panel web).
Las notificaciones operativas se entregan al workspace como **bot messages**
(no webhooks). Para que funcione necesitas exactamente lo descrito aquí,
ni más ni menos.

**Fuente de verdad del código:**
- `exentax-web/server/discord.ts` — routing `TYPE_TO_CHANNEL`, funciones
  `notify*`, `EVENT_TYPES`, `CRITICALITY_LABEL`.
- `exentax-web/server/discord-bot-commands.ts` — slash commands `/agenda`,
  `/cita`, botones interactivos del canal #agenda.
- `exentax-web/server/index.ts` — env vars REQUIRED fail-fast en producción.

## 1. Crear la aplicación de Discord (una sola vez)

1. Entra a https://discord.com/developers/applications → **New Application**.
2. Nombre: `Exentax Bot`.
3. En la pestaña **General Information** copia:
   - **APPLICATION ID** → será `DISCORD_APP_ID`.
   - **PUBLIC KEY** → será `DISCORD_PUBLIC_KEY` (32 bytes hex, 64 chars).
4. En **Bot** → **Reset Token** → copia el token (única vez visible). Será
   `DISCORD_BOT_TOKEN`. Activa estas toggles:
   - **Message Content Intent**: OFF (no leemos mensajes arbitrarios).
   - **Server Members Intent**: ON (necesario para comprobar el rol admin).
   - **Presence Intent**: OFF.
5. En **OAuth2 → URL Generator** marca:
   - Scopes: `bot`, `applications.commands`.
   - Bot permissions: `View Channels`, `Send Messages`, `Embed Links`,
     `Attach Files`, `Read Message History`, `Use Slash Commands`.
6. Abre la URL generada, elige **tu servidor (guild)** y autoriza.
7. En el servidor, **Settings → Widget**, anota el ID del servidor: será
   `DISCORD_GUILD_ID`.

## 2. Interactions endpoint (para que las slash commands funcionen)

El bot recibe comandos por dos caminos:
- **Gateway WebSocket** (automático con bot token, no requiere URL pública).
- **HTTP Interactions endpoint** (requerido por Discord aunque uses gateway,
  para verificaciones anti-replay).

En **General Information → Interactions Endpoint URL** pon:

```
https://exentax.com/api/discord/interactions
```

Discord enviará un ping firmado con Ed25519 a esa URL en cuanto la guardes.
La ruta ya está implementada en `server/routes/public.ts` y verifica la
firma con `DISCORD_PUBLIC_KEY`. Si falla la verificación, Discord no deja
guardar la configuración — señal inmediata de que `DISCORD_PUBLIC_KEY` está
mal copiado.

## 3. Los 7 canales que necesitas

Crea 7 **text channels** privados en tu servidor (recomendación: bajo una
categoría `📋 Exentax`). El bot debe tener permiso `View Channel` +
`Send Messages` + `Embed Links` en los siete.

| Canal sugerido | Env var | Qué recibe | Criticidad típica |
|---|---|---|---|
| `#exentax-registros` | `DISCORD_CHANNEL_REGISTROS` | Nuevos leads web (contacto, WhatsApp) + suscripciones newsletter + fallback de errores si `#errores` no está configurado | Business (info) |
| `#exentax-calculadora` | `DISCORD_CHANNEL_CALCULADORA` | Submissions de la calculadora de ahorro fiscal | Business (info) |
| `#exentax-actividad` | `DISCORD_CHANNEL_ACTIVIDAD` | Visitas web con UTM/device/referrer — volumen alto | Info |
| `#exentax-agenda` | `DISCORD_CHANNEL_AGENDA` | **Ciclo completo de citas**: creación, reagendamiento, cancelación, no-show. Cada mensaje lleva botones interactivos del bot | Business |
| `#exentax-consentimientos` | `DISCORD_CHANNEL_CONSENTIMIENTOS` | Log GDPR de todos los consentimientos (leads, bookings, newsletter, cookies) con `con_*` IDs | Info |
| `#exentax-errores` | `DISCORD_CHANNEL_ERRORES` | Errores de sistema (`uncaughtException`, `unhandledRejection`), validaciones fallidas, reporte post-deploy del pingeo de indexación | Warning / Error |
| `#exentax-auditoria` | `DISCORD_CHANNEL_AUDITORIA` | Cada acción admin disparada desde el propio bot (`/agenda listar`, `/cita reagendar`, botones) — trazabilidad obligatoria | Info |

Para obtener el **ID de cada canal** (no el nombre): Settings cliente Discord
→ **Advanced → Developer Mode** ON. Luego click derecho sobre el canal →
**Copy Channel ID** (número de 18-19 dígitos).

## 4. El rol admin que gatea las slash commands

Crea un rol `Exentax Admin` en tu servidor. Asígnalo solo a las personas que
pueden ejecutar `/agenda` y `/cita`. Click derecho → **Copy Role ID**. Será
`ADMIN_DISCORD_ROLE_ID`.

El bot comprueba este rol **en cada interacción** (no en cache). Si se quita
el rol a un usuario, el siguiente `/cita reagendar` falla con
`permiso denegado` sin intervención manual.

## 5. Variables de entorno completas (para `.env`)

```dotenv
# — Bot identity —
DISCORD_BOT_TOKEN=<bot_token_del_paso_1.4>
DISCORD_PUBLIC_KEY=<public_key_del_paso_1.3>
DISCORD_APP_ID=<application_id_del_paso_1.3>
DISCORD_GUILD_ID=<server_id_del_paso_1.7>
ADMIN_DISCORD_ROLE_ID=<role_id_del_paso_4>

# — Canales (7, todos requeridos en producción) —
DISCORD_CHANNEL_REGISTROS=<id_canal>
DISCORD_CHANNEL_CALCULADORA=<id_canal>
DISCORD_CHANNEL_ACTIVIDAD=<id_canal>
DISCORD_CHANNEL_AGENDA=<id_canal>
DISCORD_CHANNEL_CONSENTIMIENTOS=<id_canal>
DISCORD_CHANNEL_ERRORES=<id_canal>
DISCORD_CHANNEL_AUDITORIA=<id_canal>
```

La app hace fail-fast en `NODE_ENV=production` si falta cualquiera de estas
(`server/index.ts:22-33`). En desarrollo solo emite `warn` para poder
probar sin Discord.

## 6. Mapa completo de eventos → canal → criticidad

Definido en `server/discord.ts:TYPE_TO_CHANNEL`:

| Evento (`EVENT_TYPES`) | Dispara desde | Canal | Criticidad | Prefijo título |
|---|---|---|---|---|
| `booking_created` | Form `/book` → agenda + Google Meet | `#exentax-agenda` | Business | `[INFO]` |
| `booking_rescheduled` | `/cita reagendar` o form cliente | `#exentax-agenda` | Business | `[INFO]` |
| `booking_cancelled` | `/cita cancelar` o form cliente | `#exentax-agenda` | Business | `[INFO]` |
| `booking_no_show` | `/cita no-show` | `#exentax-agenda` | Warning | `[AVISO]` |
| `lead_new` | Form contacto web | `#exentax-registros` | Business | `[INFO]` |
| `lead_calculator` | Submit calculadora | `#exentax-calculadora` | Business | `[INFO]` |
| `lead_newsletter` | Suscripción newsletter | `#exentax-registros` | Business | `[INFO]` |
| `consent_logged` | Cada consentimiento GDPR | `#exentax-consentimientos` | Info | `[INFO]` |
| `user_activity` | Visitas web (hook client) | `#exentax-actividad` | Info | `[INFO]` |
| `validation_failed` | Zod schema fail | `#exentax-errores` | Warning | `[AVISO]` |
| `system_error` | `uncaughtException`, `unhandledRejection`, fallo circuit breaker | `#exentax-errores` | Error | `[ERROR]` |
| `seo_indexing` | Post-deploy ping reports | `#exentax-errores` | Info | `[INFO]` |
| `admin_action` | Toda slash command `/agenda` `/cita` o botón | `#exentax-auditoria` | Info | `[INFO]` |

Nota de marca: todos los embeds llevan exclusivamente el verde neón Exentax
(`#00E510`). No hay emojis, no hay rojos/amarillos, no hay iconos de otras
librerías. La criticidad se señala con el prefijo textual del título
(`[INFO]` / `[AVISO]` / `[ERROR]`), no con color. Esto viene impuesto por
`CRITICALITY_PREFIX` en `server/discord.ts:134`.

## 7. Slash commands y botones disponibles

El bot registra al arrancar:

### `/agenda` (solo rol admin)
- `/agenda listar [estado] [fecha]` — lista citas filtradas.
- `/agenda hoy` — citas de hoy (Europe/Madrid).
- `/agenda pendientes` — citas no confirmadas.

### `/cita <id>` (solo rol admin)
- `/cita ver <booking_id>` — detalle de una cita.
- `/cita reagendar <booking_id> <nueva_fecha> <hora>` — reprograma (dispara
  mail + nuevo Google Meet link + actualización calendario).
- `/cita cancelar <booking_id> [motivo]` — cancela + email al cliente.
- `/cita no-show <booking_id>` — marca como no-show.
- `/cita contactado <booking_id>` — marca como contactado.
- `/cita reenviar-email <booking_id>` — re-envía confirmación/reminder.

### Botones inline en cada `booking_created`
- `Confirmar` / `Reagendar` / `Cancelar` / `No-show` — acceso rápido sin
  teclear el booking_id.

Cada una de estas acciones se registra en `#exentax-auditoria` con el
usuario Discord que la disparó, el booking_id afectado, y la acción.

## 8. Recomendaciones de permisos por canal

| Canal | Quién ve | Quién escribe |
|---|---|---|
| `#exentax-agenda` | Admin + bot | Solo bot (los humanos usan `/cita`) |
| `#exentax-errores` | Admin + dev | Solo bot |
| `#exentax-auditoria` | Admin | Solo bot (append-only log) |
| `#exentax-consentimientos` | Legal + admin | Solo bot (append-only log GDPR) |
| `#exentax-registros` | Admin + comercial | Solo bot |
| `#exentax-calculadora` | Admin + comercial | Solo bot |
| `#exentax-actividad` | Admin | Solo bot (mute por defecto: volumen alto) |

En Discord: **Edit Channel → Permissions → @everyone: deny View Channel**;
añadir rol admin con permisos apropiados; añadir el bot con
`View + Send + Embed`.

## 9. Rate limits y back-pressure

Discord tiene un límite global de 50 requests/segundo por bot y 5 msgs/5s
por canal. El código implementa:

- **Circuit breaker** (`server/circuit-breaker.ts`) — abre el circuito
  tras 5 fallos consecutivos de Discord API y reintenta exponencial
  hasta 5 min.
- **Dedupe en memoria** (`dedupKey` en `EventEnvelope`) — evita enviar el
  mismo evento dos veces en 60 s.
- **Hash de PII en logs** — emails/ids se hashean antes de loguear el
  dedup hit, nunca aparecen en claro fuera del embed.

Si Discord cae, los eventos se acumulan en memoria hasta 500; después se
descartan los más antiguos para no OOM. Los bookings siempre persisten en
Postgres, así que la notificación fallida nunca se convierte en "cita
perdida" — `/agenda listar` sigue enseñando la cita aunque el Discord
embed no llegara.

## 10. Verificación tras el setup

Tras configurar todas las env vars y levantar el server:

```bash
pm2 logs exentax --lines 100 | grep -iE "discord|bot|slash"
# Debe aparecer:
#   discord bot ready: Exentax Bot#1234
#   registered 2 slash commands (/agenda, /cita)
#   channel routing: 7/7 resolved
```

Luego desde el servidor de Discord:

1. Ejecuta `/agenda hoy` — debe responder embed con "Sin citas hoy" (si no
   hay booking aún). Si dice "permiso denegado": el rol admin no está
   asignado o `ADMIN_DISCORD_ROLE_ID` no coincide.
2. Crea un lead de prueba desde `/contacto` → verifica embed en
   `#exentax-registros`.
3. Crea un booking de prueba → embed en `#exentax-agenda` con 4 botones
   abajo (Confirmar / Reagendar / Cancelar / No-show).
4. Click en `Cancelar` → mensaje nuevo en `#exentax-auditoria` registrando
   la acción + tu usuario Discord.

Si cualquiera de estos pasos falla, el mapa `TYPE_TO_CHANNEL` o la env var
correspondiente está mal.

## 11. Runbook operativo del bot (Task #12)

Esta sección es el manual de a-bordo para guardia: cada síntoma incluye
qué métrica/log mirar y la acción correctora directa. Todas las métricas
viven en `GET /api/metrics` (header `Authorization: Bearer
$METRICS_TOKEN`).

### Endurecimiento del endpoint de interacciones

- Verificación **Ed25519 estricta** sobre el cuerpo crudo (`req.rawBody`),
  el cuerpo se preserva intacto por el middleware
  `express.raw({ type: "*/*", limit: "256kb" })` montado solo para
  `/api/discord/interactions` (`server/index.ts`).
- **Ventana anti-replay** de ±300 s sobre `X-Signature-Timestamp`. Las
  rechazadas suman a `discord_replay_rejected_total` y no a
  `discord_signature_failures_total{reason="bad_signature"}` para
  poder distinguir un bug de reloj de un ataque de firma. Constante
  exportada: `SIGNATURE_TIMESTAMP_WINDOW_SECONDS` en `discord-bot.ts`.
- **Validación de envs al arranque** en `server/index.ts` aborta el
  proceso en producción si:
  - `DISCORD_PUBLIC_KEY` no es exactamente 64 chars hex.
  - cualquier ID Discord (app/guild/role/canal) no es un snowflake (17–20
    dígitos numéricos).
  - cualquier env tiene espacios alrededor (copy/paste accidental).

### Métricas a vigilar (todas Prometheus, prefijo `discord_*`)

| Métrica | Significado | Umbral / acción |
|---|---|---|
| `discord_signature_failures_total{reason="missing"}` | Falta header — petición no proviene de Discord | Constantes ⇒ algún cliente externo está apuntando al endpoint; revisa CDN/firewall |
| `discord_signature_failures_total{reason="bad_format"}` | Timestamp no numérico | Indicio de payload manipulado |
| `discord_signature_failures_total{reason="bad_signature"}` | Firma inválida | >5/min sostenido ⇒ rotación de `DISCORD_PUBLIC_KEY` necesaria o intento de spoof |
| `discord_replay_rejected_total` | Timestamp fuera de ±5min | Si crece aislado: comprueba reloj NTP del host. Si crece junto a `bad_signature` ⇒ ataque |
| `discord_unauthorised_total` | Usuarios sin rol admin que invocaron al bot | Cada incidente queda en `agenda_admin_actions` con `action LIKE 'unauthorized:%'` |
| `discord_audit_write_failure_total` | Fallo al persistir fila de auditoría desde la ruta fire-and-forget de no-autorizados | ≠0 ⇒ Postgres degradado y se están perdiendo trazas de intentos no autorizados; investigar circuit_breaker_state{name="postgres"} |
| `discord_interactions_total{type="2"}` | Comandos slash recibidos | — |
| `discord_command_total{name="agenda.bloquear"}` | Conteo por comando | Pico anómalo ⇒ revisa abuso |
| `discord_command_duration_ms_*` | Latencia de despacho | p99 > 2.5s ⇒ riesgo de timeout Discord (3s para responder) |
| `discord_queue_size` | Pendientes en cola outbound | >50 sostenido ⇒ Discord lento o circuit breaker abierto |
| `discord_dropped_total` | Mensajes descartados al saturarse la cola | ≠0 ⇒ ya hubo pérdida; investigar `notifyEvent` críticos perdidos |
| `discord_send_failure_total` | POST/PATCH a discord.com/api fallidos | Crecimiento sostenido ⇒ rate-limit o token rotado |

### Síntomas y diagnóstico

**1. Discord responde "interactions endpoint inválido" al guardar la URL.**
- Causa típica: `DISCORD_PUBLIC_KEY` mal copiada (incluye espacios o solo
  los primeros 32 chars).
- El validador de arranque lo detecta — busca en logs
  `[env] DISCORD_PUBLIC_KEY has wrong format`.

**2. `/agenda hoy` devuelve "permiso denegado" a un admin legítimo.**
- Verifica que `ADMIN_DISCORD_ROLE_ID` coincide exactamente con el rol del
  servidor (Settings → Roles → Copy ID con Developer Mode ON).
- Confirma que `Server Members Intent` está ON en la pestaña Bot del
  Developer Portal (sin él, `member.roles` viene vacío).
- Revisa `agenda_admin_actions` para ver si la invocación ha caído como
  `unauthorized:agenda.hoy` — si es así el rol no está en la lista.

**3. Operador ve "Error interno procesando la acción. errorId=`abcd1234`".**
- El errorId es único por incidente. `grep "errorId=abcd1234"` en logs
  para ver el stack y la acción exacta.
- Una causa común es Google Calendar 401 (refresca
  `GOOGLE_SERVICE_ACCOUNT_KEY`) o Postgres en degradado (mira
  `circuit_breaker_state{name="postgres"}`).

**4. La cola Discord (`discord_queue_size`) crece sin parar.**
- Probablemente el circuito a Discord está abierto. Mira
  `circuit_breaker_state{name="discord-rest"}` (0=cerrado, 1=half-open,
  2=abierto).
- Razones habituales: rate-limit 429 sostenido (revisa
  `discord_send_failure_total` + logs `[discord] HTTP 429`), token rotado
  (rota también `DISCORD_BOT_TOKEN` en envs y reinicia), o caída del
  endpoint Discord (status.discord.com).
- Mensajes críticos perdidos quedan registrados como
  `[discord] FALLBACK alert: …` antes de incrementar
  `discord_dropped_total`.

**5. `/api/health/ready` devuelve 503 con `discord.ok=false`.**
- El health check hace un GET cacheado a `discord.com/api/v10/users/@me`
  con TTL 60 s. Mira el campo `message` para distinguir `timeout` /
  `HTTP 401` (token invalidado) / `HTTP 5xx` (Discord caído).
- En producción esto degrada readiness pero no liveness — el orquestador
  no reinicia el proceso, solo deja de enrutar tráfico.

**6. Los comandos slash no aparecen en Discord tras un deploy.**
- Reinicio en frío llama a `registerSlashCommands()` que ahora hace
  GET-luego-PUT solo si hay diferencia. El log `[discord-bot] Slash
  commands already up-to-date` indica no-op intencional.
- Para forzar resync sin tocar producción, ejecuta en local:
  `npx tsx exentax-web/scripts/register-discord-commands.ts --diff`
  con `DISCORD_APP_ID`/`DISCORD_BOT_TOKEN` apuntando al app de prod.
  Después `--dry-run` se omite y publica.
- Discord cachea hasta 1 h tras un PUT global, así que los cambios no
  son inmediatos en el cliente del usuario aunque la API ya devuelva
  el manifest nuevo.

**7. Spike de `unauthorized:*` en `agenda_admin_actions`.**
- Filtra por `actor_discord_id` para ver si es un único usuario probando
  o varios. Cualquier intento queda con `payload.guildId` y
  `payload.channelId` para reconstruir contexto.
- Si proviene de un guild externo (alguien añadió el bot a otro
  servidor), revoca esa instalación desde el Developer Portal.

### Incidentes de seguridad — pasos comunes

1. **Rotar `DISCORD_BOT_TOKEN`** (Bot → Reset Token). El token previo deja
   de funcionar al instante; las peticiones fallidas con HTTP 401
   incrementan `discord_send_failure_total`.
2. **Rotar `DISCORD_PUBLIC_KEY`** solo es necesario si Discord lo cambia
   (raro). El endpoint público sigue siendo el mismo.
3. **Bajar el rol admin** a un usuario sospechoso desde Discord — efecto
   inmediato: el siguiente `/cita …` cae a `unauthorized:cita.<sub>`.
4. **Auditoría completa**: cada acción admin (autorizada o no) es una
   fila en `agenda_admin_actions` con `actor_discord_id`,
   `actor_discord_name`, `action`, `payload` y `created_at`. La tabla es
   append-only (sin UPDATE/DELETE en código de producción).
