# Flujo de datos — única fuente de verdad

**Última revisión:** 2026-04

Mapa end-to-end por entidad (booking, lead calculadora, newsletter, contacto)
para garantizar que **email, Discord y panel admin muestran exactamente los
mismos datos** referenciados por un único `id` estable.

## Entidades y su tabla autoritativa

| Entidad | Tabla (Drizzle, `shared/schema.ts`) | ID |
|---------|-------------------------------------|-----|
| Reserva (booking) | `agenda` | `agenda.id` (uuid) |
| Lead calculadora | `leads` (con `source = "calculator"`) + `calculations` | `leads.id` |
| Newsletter | `newsletter_subscribers` | `id` (varchar 64, PK) — `email` con `uniqueIndex` para upserts |
| Contacto / lead genérico | `leads` (con `source = "contact"` u otro) | `leads.id` |
| Visita web | `visits` | `visits.id` |
| Consentimiento legal | `legal_document_versions` + campos `privacyAccepted` / `marketingAccepted` en la entidad correspondiente | n/a |

## Booking — flujo end-to-end

```
Cliente (BookingCalendar.tsx)
   │  POST /api/bookings/book  (Zod insertAgendaSchema + extras)
   ▼
server/routes/public.ts
   │  - Zod validate
   │  - rate limit por IP + email
   │  - genera agenda.id (uuid) + manageToken (24 bytes hex)
   │  - field-encryption sobre teléfono
   ▼
server/storage/scheduling.ts → tabla `agenda` (verdad)
   │
   ├──► Google Calendar / Meet (server/google-meet.ts)  → meetLink
   │
   ├──► Email transaccional (server/email.ts + email-i18n.ts)
   │       payload basado en agenda.id (mismos campos)
   │
   └──► Discord (server/discord.ts → notifyBookingCreated)
           payload normalizado (envelope) + dedupKey = booking_created:{id}
           campos idénticos a los del email + enlaces admin/cliente
```

**Reagendar / cancelar / no-show** siguen el mismo patrón con
`notifyBookingRescheduled` / `notifyBookingCancelled` / `notifyNoShow`,
`dedupKey` por `bookingId` y combinación de fecha cuando aplica.

## Lead calculadora

```
Calculator (client/src/components/calculator/EmailGateForm.tsx)
   │  POST /api/calculator-leads
   ▼
server/routes/public.ts → Zod validate
   ▼
server/storage/marketing.ts (upsert lead) + storage/scheduling? (calculations)
   │
   ├──► Email "tu cálculo + próximo paso" (email-i18n.ts)
   └──► Discord notifyCalculatorLead (mismo payload semántico que lead.row)
```

## Newsletter

```
NewsletterForm (Footer)
   │  POST /api/newsletter/subscribe (Zod)
   ▼
storage/marketing.ts → tabla newsletter_subscribers
   │  registra: email, language, privacyAccepted, marketingAccepted, ip
   │
   └──► Discord notifyNewsletterSubscription
```

## Reglas de coherencia

1. **Un solo id por entidad** (`agenda.id`, `leads.id`). Ningún canal
   genera ids paralelos.
2. **Sin divergencia entre canales**: email, Discord y admin se construyen
   a partir del mismo objeto recuperado de la tabla autoritativa, no a
   partir del payload original del cliente (que ya pasó por sanitización +
   Zod + cifrado).
3. **Idempotencia Discord**: `notifyEvent` deduplica por `dedupKey` con TTL
   de 5 minutos, evitando duplicados ante reintentos del cliente o del
   servidor.
4. **Sin PII innecesaria** en los embeds: el teléfono completo se muestra
   solo en canales privados (`registros`, `agenda`); la actividad pública
   (`actividad`) recibe IPs y tipo de visita, no datos personales.
5. **Errores de canal** (Discord caído, email rebota) **no rompen el
   flujo**: la entidad ya está persistida y se loguea via `logger.ts`.

## Verificación

Procedimiento manual periódico: crear una reserva real, comparar lo que
muestra el bot de Discord (`/cita ver <id>` en `#sistema-citas`), el
email recibido y el embed Discord. Los campos clave (nombre, email,
fecha, hora, teléfono, notas, marketing/privacy, manageUrl) deben
coincidir literalmente.
