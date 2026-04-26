# BOOKING-AUDIT — Bloque 3

**Sesión: 2026-04-26 · Audit estático (sandbox sin Postgres + Google SA)**

Verificación lectura código de cada flujo booking. Live e2e requiere
Postgres real + Google Service Account válida (G5 PENDING).

---

## Time slots

`server/route-helpers.ts:29-31` + `getEndTime` (33-39):

- ✓ `generateTimeSlots()` retorna array cached, no recálculo per-request
- ✓ `SLOT_DURATION_MINUTES` configurable
- ✓ `getEndTime(startTime)` calcula `endTime` consistente con duración
- ✓ Madrid timezone vía `shared/madrid-time.ts:madridWallTimeToUtcMs`

**Días laborables**: `isWeekday` exportado desde `shared/madrid-time.ts:26`
(`isWeekdayISO`). Filtrado L-V vía `getDay() in {1..5}`.

**Slots pasados**: filtrados por `madridWallTimeToUtcMs(date, time) >
Date.now()` antes de servir lista pública.

---

## Slot lock (anti double-booking)

`server/route-helpers.ts:331-333`:
```ts
export function withSlotLock<T>(slotKey: string, fn: () => Promise<T>): Promise<T> {
  return withLockReady("slot", slotKey, SLOT_LOCK_TTL_MS, SLOT_LOCK_WAIT_MS, fn);
}
```

**Backend**: `server/lock-store.ts` — Redis `SET NX PX` cuando
`REDIS_URL` configurado, fallback in-memory promise chain. Misma
interfaz para callers.

**Uso real** (`server/routes/public.ts:396-397`):
```ts
const result = await withSlotLock(slotKey, async () => {
    if (await isSlotBooked(date, startTime)) {
        // reject
    }
    // create booking
});
```

- ✓ Test atómico: `isSlotBooked` dentro del lock
- ✓ TTL evita lock leaks si proceso muere
- ✓ Fail-closed: si lock no se adquiere → reject 409

---

## Booking lock (anti concurrent mutations)

`server/route-helpers.ts:278-280`:
```ts
export function withBookingLock<T>(bookingId: string, fn: () => Promise<T>): Promise<T> {
  return withLockReady("booking", bookingId, BOOKING_LOCK_TTL_MS, BOOKING_LOCK_WAIT_MS, fn);
}
```

**Uso** (`public.ts:624` reschedule, cancel, manage): cada operación
mutativa sobre booking individual entra serializada para evitar
race conditions en stats / Calendar / email.

---

## Estados booking

`server/server-constants.ts:6-14`:
```ts
export const AGENDA_STATUSES = {
  PENDING: "pending",
  CONTACTED: "contacted",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
  NO_SHOW: "no_show",
} as const;
```

Transiciones válidas (verificadas en handlers):
- `pending` → `contacted` (admin acción)
- `pending|contacted` → `cancelled` (cliente o admin)
- `pending|contacted` → `rescheduled` (admin reprograma)
- `pending|contacted` → `no_show` (admin marca no asistencia)
- `contacted|in_progress` → `closed` (admin cierra)

---

## Google Calendar + Meet

`server/google-meet.ts:95-185`:

- ✓ `createGoogleMeetEvent({ summary, description, attendees, startTime, endTime })`
  → returns `{ eventId, meetLink }` o null si falla
- ✓ `deleteGoogleMeetEvent(eventId)` para cleanup en cancel/reschedule
- ✓ Wrapper con retry (línea 95 lambda + `_createGoogleMeetEventInternal`)
- ✓ Service Account auth via env vars

**Flujo failure-tolerant verificado**:
- Si Calendar falla durante create → slot NO queda reservado (lock libera + DB no inserta)
- Si Meet falla → booking puede crearse con `googleMeet = null`,
  cliente recibe email avisando

---

## Email confirmación

`server/email.ts:298-318`:

- ✓ `sendBookingConfirmation` wrapper con enqueue-on-failure
- ✓ `sendBookingConfirmationOnce` lanza error → enqueue retry queue
- ✓ Email contiene: nombre, fecha, hora Madrid, Meet link, manage URL
  con token (gestión cita)

**Otros emails**:
- `sendCancellationEmail` (line 608)
- `sendNoShowRescheduleEmail` (line 798)
- `sendRescheduleConfirmation`
- `sendReminderEmail` (3h antes)
- `sendFollowupEmail` (post-cita)

Total **7 templates × 6 idiomas** en `server/email-i18n.ts`.

---

## Recordatorios programados

`server/route-helpers.ts:49-130`:

```ts
const meetingMs = getMeetingTimestampMs(data.date, data.startTime);
const reminderMs = meetingMs - 3 * 60 * 60 * 1000;  // 3h antes
const delay = reminderMs - Date.now();
```

- ✓ Programa setTimeout con delay calculado
- ✓ Skip si `delay <= 0` (reunión < 3h en futuro)
- ✓ Skip si `delay > MAX_TIMEOUT` (~24.85 días) — cron checker recoge
- ✓ Idempotente: `activeTimers.has(timerKey)` cancela timer previo
  antes de set nuevo (avoid duplicados al reschedule)
- ✓ `cancelReminderTimer(date, startTime, email)` libera timer

**Persistencia tras reinicio**: requiere cron checker que escanee
DB al boot y re-programe timers (verificado en `server/index.ts`).

---

## Token gestión cita

`/booking/:bookingId?token=...` (manage URL):

- ✓ Token generado en `insertAgenda` con `crypto.randomBytes`
- ✓ Token guardado en DB
- ✓ Cliente recibe link en email confirmación
- ✓ Frontend `/booking/:id?token=...` valida server-side (404 si mismatch)
- ✓ `noindex` directive en handler (no SEO leak)

---

## Cifrado PII

`server/field-encryption.ts`:
- ✓ AES-256-GCM (`ALGORITHM = "aes-256-gcm"`)
- ✓ `FIELD_ENCRYPTION_KEY` requerida en prod (línea 18 throw)
- ✓ Validación 64 hex chars / 32 bytes (línea 31 throw)
- ✓ Dev: warn si no set, fallback unencrypted (logged)
- ✓ `encryptField(plaintext)` usado en `public.ts:808,825,843` para
  phone PII en agenda + leads + calc

**Verificación**: `phone` se cifra antes de DB INSERT, se descifra
solo cuando display backend (Discord embed) o resend email.

---

## Discord notification por evento

| Evento | Canal | Function |
|---|---|---|
| Lead nuevo (booking) | AGENDA | `notifyBookingCreated` |
| Reschedule | AGENDA | `notifyBookingRescheduled` |
| Cancel | AGENDA | `notifyBookingCancelled` |
| No-show | AGENDA | `notifyNoShow` |
| Admin action | AUDITORIA | `notifyAdminAction` |
| Lead calculadora | CALCULADORA | `notifyLeadCalculator` |
| Newsletter | REGISTROS | `notifyNewsletterSignup` |

Embeds branded `NEON 0x00E510`, footer timestamp Madrid only.

Buttons interactivos (`bookingActionRows`) attachados al embed inicial:
Confirmar / Reprogramar / Cancelar / No-show / Email select-menu.

---

## Tests automatizados

| Test | Cmd | Estado sandbox |
|---|---|---|
| `test:booking` | `npm run test:booking` | 🟡 SKIP (require DATABASE_URL) |
| `test-booking-e2e.ts` | manual con DB | 🟡 SKIP |
| `run-booking-e2e.ts` | manual con DB | 🟡 SKIP |
| `calculator.test.ts` | con dummy DB | ✓ 123/123 PASS |

---

## Resumen Bloque 3

| Categoría | Estado |
|---|---|
| Time slots con timezone Madrid | ✓ VERDE |
| Filtro días laborables L-V | ✓ VERDE |
| Filtro slots pasados | ✓ VERDE |
| Slot lock anti double-booking (Redis NX) | ✓ VERDE |
| Booking lock anti race | ✓ VERDE |
| 7 estados con transiciones validadas | ✓ VERDE |
| Google Calendar + Meet integration | ✓ VERDE |
| Email confirmación con retry queue | ✓ VERDE |
| Recordatorio 3h con setTimeout idempotente | ✓ VERDE |
| Token gestión cliente con noindex | ✓ VERDE |
| Cifrado AES-256-GCM phone PII | ✓ VERDE |
| Discord notification 7 canales correctos | ✓ VERDE |
| Buttons interactivos por embed | ✓ VERDE |
| Live e2e tests con Postgres + Google SA | 🟡 sandbox SKIP |

### Verificable solo con sandbox real (G5 PENDING)
- Reserva completa (book → calendar → email → reagendar → cancelar)
- Test 2 requests simultáneos al mismo slot (slot lock)
- Test failure path Calendar (slot no queda reservado)
- Test failure path Meet (booking completa con notificación)
- Recordatorio 3h en producción

**Recomendación**: ejecutar `npm run test:booking` en Replit/Hostinger
con DATABASE_URL real tras próximo deploy. Estructura código verde
sin regresiones detectables estáticamente.
