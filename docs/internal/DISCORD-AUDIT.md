# DISCORD-AUDIT — Bloque 4

**Fecha medición**: 2026-04-25
**Resultado global**: ✅ **PASS** estructural — bot listo para deploy

---

## 1. Tests automatizados (output real medido)

### npm run test:discord-neon
```
✅ Discord neon policy OK — 23 embeds captured, all 0x00E510.
Exit: 0
```

Verifica que TODOS los embeds usan exclusivamente verde neón Exentax
`#00E510` — no hay rojos / azules / amarillos / colores
no-marca colándose en notificaciones.

### Verificación env requeridas (sandbox)
```
DISCORD_BOT_TOKEN set: NO
```
Esperado en sandbox sin secrets. En Replit/Hostinger con env reales,
el bot conectaría al servidor Discord vía gateway WebSocket.

---

## 2. Slash commands registrados (server/discord-bot.ts:253-340)

| Comando | Subcomando | Required | Descripción |
|---|---|---|---|
| `/ayuda` | — | — | Lista todos los comandos del bot de agenda Exentax |
| `/agenda` | `hoy` | — | Reservas de hoy |
| `/agenda` | `semana` | — | Reservas de los próximos 7 días |
| `/agenda` | `buscar` | `q` | Booking ID, nombre o email |
| `/agenda` | `libre` | `fecha` | Slots libres en un día (YYYY-MM-DD) |
| `/agenda` | `bloquear` | `fecha`, `motivo`(opt) | Bloquear un día |
| `/agenda` | `desbloquear` | `fecha` | Desbloquear un día |
| `/cita` | `ver` | `id` | Ver detalle de una cita |
| `/cita` | `confirmar` | `id` | Confirmar una cita pendiente |
| `/cita` | `cancelar` | `id` | Cancelar una cita |
| `/cita` | `noshow` | `id` | Marcar como no-show |
| `/cita` | `reprogramar` | `id`, `fecha`, `hora` | Reprogramar a nueva fecha y hora |
| `/cita` | `email` | `id`, `tipo` | Email manual: confirmation/recordatorio/noshow/seguimiento |
| `/cita` | `nueva` | `nombre`, `email`, `fecha`, `hora`, ... | Crear cita manualmente |

**Total**: 14 subcomandos registrados.

---

## 3. Routing eventos → canales (server/discord.ts:TYPE_TO_CHANNEL)

```typescript
const TYPE_TO_CHANNEL: Record<EventType, Channel> = {
  booking_created:     "agenda",
  booking_rescheduled: "agenda",
  booking_cancelled:   "agenda",
  booking_no_show:     "agenda",
  lead_new:            "registros",
  lead_calculator:     "calculadora",
  lead_newsletter:     "registros",
  consent_logged:      "consentimientos",
  user_activity:       "actividad",
  validation_failed:   "errores",
  system_error:        "errores",
  seo_indexing:        "errores",
  admin_action:        "auditoria",
};
```

**13 EVENT_TYPES → 7 canales únicos** (matching el setup descrito en
`docs/deploy/DISCORD-SETUP.md`).

---

## 4. Canales requeridos (server/discord.ts:CHANNEL_ENV)

| Canal | Env var | Eventos routed |
|---|---|---|
| `registros` | `DISCORD_CHANNEL_REGISTROS` | lead_new, lead_newsletter (+ fallback errores) |
| `calculadora` | `DISCORD_CHANNEL_CALCULADORA` | lead_calculator |
| `actividad` | `DISCORD_CHANNEL_ACTIVIDAD` | user_activity |
| `agenda` | `DISCORD_CHANNEL_AGENDA` | booking_created/rescheduled/cancelled/no_show |
| `consentimientos` | `DISCORD_CHANNEL_CONSENTIMIENTOS` | consent_logged |
| `errores` | `DISCORD_CHANNEL_ERRORES` | validation_failed, system_error, seo_indexing |
| `auditoria` | `DISCORD_CHANNEL_AUDITORIA` | admin_action (slash commands + buttons) |

**7 canales**, todos con env var requerida en producción
(fail-fast en `server/index.ts:22-33` si falta cualquiera).

---

## 5. Seguridad: Ed25519 signature verification

`server/discord-bot.ts`:

```typescript
export function verifyDiscordSignature(rawBody, signatureHex, timestamp) {
  const key = getPublicKey();           // DISCORD_PUBLIC_KEY env
  if (!key) return false;
  const sig = Buffer.from(signatureHex, "hex");
  if (sig.length !== 64) return false;  // Ed25519 = 64 bytes
  const message = Buffer.concat([Buffer.from(timestamp, "utf8"), rawBody]);
  return crypto.verify(null, message, key, sig);
}
```

Antes de procesar cualquier interaction:
- `x-signature-ed25519` header obligatorio.
- `x-signature-timestamp` header obligatorio.
- `req.rawBody` obligatorio.
- Firma inválida → `401 bad_signature`.
- Headers ausentes → `401 missing_signature`.

---

## 6. Role gate ADMIN_DISCORD_ROLE_ID

Aplicado en CADA interaction (no cache):

```typescript
// server/discord-bot.ts:60
export const ADMIN_DISCORD_ROLE_ID = process.env.ADMIN_DISCORD_ROLE_ID || "";

// línea 134
const isAuthorised = ADMIN_DISCORD_ROLE_ID
  ? roles.includes(ADMIN_DISCORD_ROLE_ID)
  : false;

// discord-bot-commands.ts:270 — mensaje educado
"Solo miembros con el rol `ADMIN_DISCORD_ROLE_ID` pueden invocar
 comandos o pulsar botones."
```

Si rol del usuario en Discord cambia, el siguiente comando refleja el
cambio inmediato (sin cache).

---

## 7. Rate limiting + retry exponencial

`server/discord.ts`:

| Aspecto | Valor / línea | Descripción |
|---|---|---|
| Drain interval base | `DRAIN_INTERVAL_MS` | base para backoff |
| Max retries | `MAX_RETRIES = 3` | tras 3 intentos, descarta |
| Retry trigger | `res.status === 429 || res.status >= 500` | Discord rate-limit + 5xx |
| Backoff | `Math.min(DRAIN_INTERVAL_MS * 2 ** item.attempt, 30_000)` | exponencial cap 30 s |
| Cap log line | `discord.ts:526` | `logger.warn(\`Discord HTTP ${status} — retry ${n}/${MAX_RETRIES} in ${backoff}ms\`)` |

---

## 8. Dedupe: idempotency

`server/discord.ts:709-729` (memoria en proceso):
- TTL: 5 minutos
- Max entries: 500 (purga oportunista)
- Hash: SHA-256 sobre dedupKey (no PII en logs)
- `dedupKey` opcional por evento; si presente, deduplica re-envíos

---

## 9. Color policy (brand enforcement)

```typescript
// server/discord.ts:73 + 805
embeds.forEach(e => { e.color = EXENTAX_NEON; });  // 0x00E510
```

Test `npm run test:discord-neon`:
- Captura 23 embeds simulados.
- Asserts: TODOS color === `0x00E510`.
- Resultado: ✅ PASS.

NO se permiten colores rojo/amarillo/azul/verde-distinto. La criticidad
se señala con prefijo textual del título: `[INFO]` / `[AVISO]` /
`[ERROR]`.

---

## 10. Webhooks legacy (eliminados)

```bash
grep -rE "DISCORD_WEBHOOK" client/ server/ shared/ scripts/ \
  --exclude-dir=archive --exclude="*.test.*" \
  | grep -v "deprecated\|legacy\|retired"
```
**Output**: 0 referencias activas.

Bot REST API moderna vía bot token. Todas las notificaciones se
entregan vía `POST /channels/{channel_id}/messages` con
`Authorization: Bot <token>`.

---

## 11. Observabilidad de eventos (server/discord.ts:EVENT_TYPES)

13 tipos de evento estandarizados:
- `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`, `BOOKING_NO_SHOW`
- `LEAD_NEW`, `LEAD_CALCULATOR`, `LEAD_NEWSLETTER`
- `CONSENT_LOGGED`
- `USER_ACTIVITY`
- `VALIDATION_FAILED`
- `SYSTEM_ERROR`
- `SEO_INDEXING`
- `ADMIN_ACTION`

Cada evento lleva: `type`, `criticality`, `origin`, `method`,
`route`, `language`, `source`, `user`, `ip` (header fields del embed
para traceability).

---

## TOP — recomendaciones (no bugs)

| # | Hallazgo | Severidad | Acción |
|---|---|---|---|
| 1 | Tests neon policy: 23 embeds, todos `#00E510` | ✅ | ninguna |
| 2 | 14 subcomandos slash registrados | ✅ | ninguna |
| 3 | Ed25519 verification implementada | ✅ | ninguna |
| 4 | Role gate enforced en cada interaction | ✅ | ninguna |
| 5 | Retry exponencial 429/5xx con cap 30s | ✅ | ninguna |
| 6 | Dedupe SHA-256 hash (no PII) | ✅ | ninguna |
| 7 | 7 canales required env vars | ✅ | ninguna |
| 8 | 0 referencias DISCORD_WEBHOOK legacy | ✅ | ninguna |
| 9 | E2E con bot token real requerido | gris | Replit/Hostinger con env reales |

**Conclusión**: bot **estructuralmente correcto**, **seguridad sólida**
(Ed25519 + role gate + rate-limit + retry exponencial), **routing
limpio** (13 events → 7 canales), **brand consistency** (verde neón
forzado en todos los embeds). E2E real requiere tokens en Replit.

---

## Sesión 2026-04-26 · Re-verificación + tipos estrictos

### Tipos estrictos: 21 any → 0 (commit `154efc95`)

`server/discord-bot.ts`: añadidas 4 interfaces exportadas:
- `DiscordCommandOption` (subcomandos + opts)
- `DiscordInteractionData` (payload top-level)
- `DiscordEmbedRef` (forma minimal embed)
- `DiscordMessageComponent` (modal + select)

`server/discord.ts`: añadidas 5 interfaces internas:
- `DiscordButtonComponent`, `DiscordSelectOption`, `DiscordSelectMenuComponent`,
  `DiscordRowChild`, `DiscordActionRow`

`server/discord-bot-commands.ts`: 14 anys → 0 con signatures tipadas en
`replyEphemeral`, `followupEphemeral`, `getSubcommand`, `getOpt`,
`bookingDetailEmbed`, `bookingListEmbed`, `handleNewsletter/Agenda/
Cita/CreateBooking`, modal components.

### Slash commands estructura completa verificada

`server/discord-bot.ts:295-431` registra:

| Top-level | Subcomandos |
|---|---|
| `/ayuda` | — |
| `/agenda` | hoy · semana · buscar · libre · bloquear · desbloquear |
| `/cita` | ver · confirmar · cancelar · noshow · reprogramar · email · nueva |
| `/newsletter` | enviar · status · cancelar |

Todos con descripción ES + choices localizadas (idioma 6 langs).

### Audit log presente en TODOS los handlers (verificado)

Pattern consistente `discord-bot-commands.ts`:
1. `logAdminAction({ actorDiscordId, actorDiscordName, action, payload })`
   ANTES de operación
2. `notifyAdminAction({ actor, action, title, fields })` AL canal AUDITORIA
   DESPUÉS de operación exitosa

Líneas verificadas: 218 (newsletter), 307 (ayuda), 395-453 (agenda subs),
504-561+ (cita subs).

### Estado tras re-verificación

| Categoría | Estado | Cambio sesión |
|---|---|---|
| Tipos estrictos (any restantes) | ✓ 0 | -21 |
| `server/discord*.ts` líneas | 3078 | sin cambio funcional |
| Tests `test:discord-neon` | ✓ PASS | sin cambio |
| Live tests con token | 🟡 sandbox SKIP | mismo G5 PENDING |

**Recomendación**: ejecutar smoke test live en Replit/Hostinger con
DISCORD_BOT_TOKEN real tras próximo deploy. Estructura ya verificada
sin regresiones.
