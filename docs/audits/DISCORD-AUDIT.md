# DISCORD AUDIT — bot, channels & alert routing

**Date:** 2026-04-28
**Scope:** Bloque 5 of the integral audit. Verifies the Discord bot
integration, channel mapping, slash-command surface, and that every
domain event ends in the right channel with the right message.

## 1. Channel inventory (`server/index.ts:32-40`, `server/discord.ts:14-22`)

| ENV var                              | Channel                       | Purpose                                                            |
|--------------------------------------|-------------------------------|--------------------------------------------------------------------|
| `DISCORD_CHANNEL_REGISTROS`          | `#exentax-registros`          | Newsletter subscriptions, lead form, contact requests              |
| `DISCORD_CHANNEL_AGENDA`             | `#exentax-agenda`             | Booking lifecycle (`created`, `rescheduled`, `cancelled`) + bot    |
| `DISCORD_CHANNEL_CALCULADORA`        | `#exentax-calculadora`        | Tax calculator submissions (anonymised)                            |
| `DISCORD_CHANNEL_ACTIVIDAD`          | `#exentax-actividad`          | Page-view & engagement events (sampled)                            |
| `DISCORD_CHANNEL_CONSENTIMIENTOS`    | `#exentax-consentimientos`    | GDPR consent log mirror (`con_*` IDs)                              |
| `DISCORD_CHANNEL_AUDITORIA`          | `#exentax-auditoria`          | Mandatory audit trail of `/agenda` and `/cita` slash actions       |
| `DISCORD_CHANNEL_ERRORES`            | `#exentax-errores`            | `system_error`, `validation_failed` (fallback: `#registros`)       |

All seven are PROD-ONLY env vars (validated at boot in
`server/index.ts:77-85` with the `isSnowflake` guard) — the dev workspace
intentionally leaves them blank, so live channel posting is short-circuited
by every notify-* helper before it touches the network.

## 2. Bot identity & gating (`server/discord-bot.ts:60-80`)

```ts
DISCORD_PUBLIC_KEY            // verifies signed interactions from Discord
DISCORD_BOT_TOKEN             // bot identity, used for both interactions and outbound posts
DISCORD_APP_ID                // application id
DISCORD_GUILD_ID              // guild whose roles are checked
ADMIN_DISCORD_ROLE_ID         // role required to invoke admin slash commands
```

`isDiscordBotConfigured()` returns `true` only when all four are present;
in dev (this workspace) it's `false`, so `/agenda` and `/cita` slash
commands are unregistered and never attempt to respond.

## 3. Notifier helpers (`server/discord.ts`)

Every notifier is a thin wrapper over `postToDiscordChannel(channelEnv, payload)`
and follows the same pattern:

1. Resolve the channel id from env.
2. If absent → log `discord-not-configured` and return `{ ok:false }`.
3. Otherwise POST a localised, sanitised embed to the Discord REST API.
4. On 5xx or 429, retry with exponential backoff up to 3 times via
   `server/circuit-breaker.ts` (state visible in `/api/health/ready`
   `breakers.ok` field — currently `true`).

| Notifier                            | Channel target                  |
|-------------------------------------|---------------------------------|
| `notifyLead(payload)`               | REGISTROS                       |
| `notifyNewsletter(payload)`         | REGISTROS                       |
| `notifyAgenda(payload, action)`     | AGENDA (action ∈ created\|rescheduled\|cancelled) |
| `notifyCalculator(payload)`         | CALCULADORA                     |
| `notifyConsent(payload)`            | CONSENTIMIENTOS                 |
| `notifyError(payload)`              | ERRORES (fallback: REGISTROS)   |
| `notifyActivity(payload)`           | ACTIVIDAD (sampled @10%)        |
| `notifyAudit(actorId, command,...)` | AUDITORIA                       |

## 4. Localisation in messages

Discord messages are emitted in **Spanish** (the operations team's
working language). The booking event mirrored to AGENDA includes the
**user's** locale label as a field so the team knows which language to
reply in:

```
Reserva confirmada:
- Cliente: <name>
- Email: <email>
- Idioma: ES | EN | FR | DE | PT | CA
- Slot: <slot in Madrid TZ>
- Notas: <notes or '—'>
```

The locale value is always one of the 6 SUPPORTED_LANGS — verified by
the type signature `lang: SupportedLang` in `server/booking-types.ts`.

## 5. Slash commands (`/agenda`, `/cita`)

Registered in production via `discord-bot.ts:registerCommands()`. Each
invocation is mirrored to AUDITORIA with actor, command, args and
result. Unauthorised attempts (missing `ADMIN_DISCORD_ROLE_ID`) are
rejected and ALSO logged to AUDITORIA with `result: "denied"`.

## 6. Lint coverage

- `npm run test:discord-neon` (`scripts/test/discord-neon-smoke.mjs`) —
  passes in baseline. Verifies `discord.ts` exports the expected
  notifier surface and that every notifier checks its env before
  hitting the network.

## 7. Verdict

| Concern                                       | Status |
|-----------------------------------------------|--------|
| 7 channel envs declared & validated at boot   | GREEN  |
| Bot identity gating gracefully degrades       | GREEN  |
| Each domain event has a dedicated notifier    | GREEN  |
| Audit trail mirrors every admin slash command | GREEN  |
| Circuit breaker around outbound REST          | GREEN  |
| Live channel verification (PROD ENVS only)    | NOT VERIFIABLE in this workspace — see PENDING-FINAL §"discord live verify" |

**Bloque 5 — DISCORD AUDIT: GREEN (with documented prod-only gap).**
