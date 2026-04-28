# Discord Bot — Agenda Exentax

The agenda is operated **end-to-end from Discord**. There is no web admin
panel: all booking lifecycle actions (view, confirm, cancel, reschedule,
no-show, create, block days, send manual emails) are exposed as Discord
slash commands and as buttons attached to every booking notification
published in `#agenda`.

---

## 1. Required environment variables

| Variable                        | Purpose                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------- |
| `DISCORD_APP_ID`                | Discord application ID — used to register global slash commands                   |
| `DISCORD_BOT_TOKEN`             | Bot token — used to register slash commands and (optionally) call the REST API   |
| `DISCORD_PUBLIC_KEY`            | Application public key — verifies Ed25519 signature of every interaction         |
| `ADMIN_DISCORD_ROLE_ID`         | Role ID — only members carrying this role may invoke any agenda command/button    |
| `DISCORD_CHANNEL_AUDITORIA`     | Channel ID for `#sistema-auditoria` — every admin action is mirrored here via the bot |
| `DISCORD_CHANNEL_AGENDA`        | Channel ID for `#agenda` — booking notifications (delivered as bot messages by `discord.ts`) |

> **No webhooks are used anywhere.** Every notification (registros, calculadora, actividad, agenda, consentimientos, errores, auditoría) is published as a bot message via `POST /channels/{id}/messages`. After an admin acts on a booking, the original `#agenda` embed is updated in place via `PATCH /channels/{id}/messages/{id}` (see `editChannelMessage` in `server/discord.ts`).

When any of `DISCORD_APP_ID`, `DISCORD_BOT_TOKEN`, `DISCORD_PUBLIC_KEY`
or `ADMIN_DISCORD_ROLE_ID` is missing the bot is automatically disabled:
the interactions endpoint is not mounted and command sync is skipped. A
warning is logged at startup.

---

## 2. Discord application setup

1. Create an application at <https://discord.com/developers/applications>.
2. Copy the **Application ID**, **Public Key** and (under *Bot*) the
   **Bot Token** into the env vars above.
3. **Interactions Endpoint URL**: set it to
   `https://exentax.com/api/discord/interactions`. Discord will validate
   the URL by sending a `PING` — make sure the env vars are deployed
   before saving.
4. Invite the bot to the server with the `applications.commands` scope
   and the `bot` scope. Required permissions: **Send Messages**,
   **Embed Links** and **Read Message History** in every channel listed
   in §1 — the bot itself posts every operational notification (and
   later edits its own `#agenda` messages) via `POST /channels/{id}/messages`
   and `PATCH /channels/{id}/messages/{id}`. There are no Discord
   webhooks left in the system.
5. Capture the role ID of the team role that should be allowed to use
   the agenda (right-click → *Copy Role ID* with developer mode on) and
   set `ADMIN_DISCORD_ROLE_ID`.

Slash commands are registered **globally** at server startup. Discord
caches them for ~1 hour after the first publish; subsequent restarts
are no-ops.

### Standalone registration script (idempotent)

For deploys where bouncing the server just to refresh the manifest is
undesirable — or for inspecting what is currently published — use:

```
npm run discord:register          # publish (PUT)
npm run discord:register:dry      # print local manifest, no network call
npm run discord:register:diff     # show local vs live (read-only)
```

The script (`exentax-web/scripts/register-discord-commands.ts`) is
fully idempotent: Discord's `PUT /applications/{id}/commands` replaces
the manifest atomically and no-ops when the payload is byte-equal to
what is already registered. Requires `DISCORD_APP_ID` and
`DISCORD_BOT_TOKEN`; signature/role vars are not needed for publishing.

---

## 3. Slash command reference

### `/ayuda`

Single ephemeral embed listing every command, button and select option.
Always available. Logged in `agenda_admin_actions` with `action = "ayuda"`
so we can audit who consulted the help (useful for onboarding).

### `/agenda`

| Subcommand                          | Effect                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `/agenda hoy`                       | Lists today's bookings (Madrid time)                                                    |
| `/agenda semana`                    | Lists bookings for the next 7 days                                                      |
| `/agenda buscar q:<text>`           | Finds bookings by **booking ID, name or email** (substring on each)                     |
| `/agenda libre fecha:YYYY-MM-DD`    | Lists free time slots for that date                                                     |
| `/agenda bloquear fecha:YYYY-MM-DD motivo:<text>` | Marks the day as unavailable                                              |
| `/agenda desbloquear fecha:YYYY-MM-DD`            | Removes a day block                                                       |

### `/cita`

| Subcommand                          | Effect                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| `/cita ver id:<bookingId>`          | Shows the full booking card with the action buttons + email select                      |
| `/cita confirmar id:<bookingId>`    | Marks status = `contacted`, no email sent                                               |
| `/cita cancelar id:<bookingId> motivo:<text>` | Cancels booking, frees the slot, sends cancellation email                     |
| `/cita noshow id:<bookingId>`       | Marks status = `no_show` and sends the no-show / reschedule invitation email            |
| `/cita reprogramar id:<bookingId>`  | Opens a modal asking for new date/time, then reschedules + sends reschedule email       |
| `/cita email id:<bookingId> tipo:<confirmation\|recordatorio\|noshow\|seguimiento>` | Re-sends the chosen email template manually          |
| `/cita nueva …`                     | Creates a booking from scratch (name, email, date, time, optional phone, notas, idioma `es/en/fr/de/pt/ca`) |

**Booking identity.** Bookings are addressed by their short, public-safe
`bookingId` (e.g. `bk_a1b2c3d4`) in every command, button, audit row and
notification — never by the manage token. The `manage_token` column is
strictly the **client-facing** secret used to render the public
`/booking/:id?token=…` self-service page in the confirmation email; it
must never appear in Discord, logs or admin UI.

---

## 4. Interactive components

Every booking notification posted to `#agenda`
(`notifyBookingCreated`, `notifyBookingRescheduled`,
`notifyBookingCancelled`) carries **two action rows** built by
`bookingActionRows(bookingId)`:

**Brand policy**: NO emojis or icons anywhere — buttons, options, embeds,
status fields and titles are all plain text. Severity is conveyed via the
ASCII tags `[INFO]`, `[AVISO]`, `[ERROR]` prefixed to each event title.
Discord's native button colour-styles (success / primary / danger /
secondary) provide enough visual differentiation on their own.

There is no "Ver" button — `/cita ver` is the only entry point for the
booking detail card (it returns the same card with these same two rows
as components). Keeping the button set lean avoids accidentally
re-issuing a non-mutating action that would only spam the channel.

**Row 1 — state mutation buttons** (custom_id pattern `agenda:<verb>:<bookingId>`):

| Button       | Verb         | Style          | Behaviour                                                |
| ------------ | ------------ | -------------- | -------------------------------------------------------- |
| Confirmar    | `confirm`    | success/green  | Same as `/cita confirmar`                                |
| Reprogramar  | `reschedule` | primary/blue   | Opens the reschedule modal (date + time)                 |
| Cancelar     | `cancel`     | danger/red     | Cancels the booking with reason `Cancelada desde Discord`|
| No-show      | `noshow`     | secondary/grey | Same as `/cita noshow`                                   |

**Row 2 — email select menu** (custom_id `agenda:email_select:<bookingId>`):

| Option                | `value`        | Sends                                            |
| --------------------- | -------------- | ------------------------------------------------ |
| Confirmación          | `confirmation` | Booking confirmation (re-send) with manage URL   |
| Recordatorio          | `recordatorio` | 24-hour reminder with Meet link                  |
| No-show / reagenda    | `noshow`       | No-show + invitation to reschedule               |
| Seguimiento           | `seguimiento`  | Post-meeting follow-up                           |

The select menu replaces the earlier single "Email" button — operators
must now pick the template explicitly so an email type can never be
sent by accident on an active booking.

After any successful action the original `#agenda` embed is patched in
place (`PATCH /channels/{id}/messages/{id}` via `editChannelMessage`):
a "Última acción" field is added with the new status, the operator and
the timestamp, and the components row is dropped so the action cannot
be triggered twice.

Authorisation: every interaction (slash command, button, select,
modal submit) is gated by `ADMIN_DISCORD_ROLE_ID` — interactions from
members without the role receive an ephemeral "no autorizado" reply
and are **not** logged as actions.

---

## 5. Audit trail

Two parallel audit channels exist:

1. **Database** — every successful action inserts a row in
   `agenda_admin_actions` (`id`, `actor_discord_id`, `actor_name`,
   `action`, `booking_id`, `payload`, `created_at`). Useful for
   forensic queries (`who cancelled booking X?`).
2. **Discord** — every action is mirrored to `#sistema-auditoria` via
   `notifyAdminAction`, brand-styled like every other event. Useful for
   real-time visibility.

Failures of side-effects (email send, Google Meet event create) never
abort the action — they are logged but the booking state is updated
either way, since the source of truth is the database.

---

## 6. Endpoint contract

`POST /api/discord/interactions`

* Mounted **before** `express.json` so the raw body is preserved on
  `req.rawBody`. Ed25519 signature is verified against
  `DISCORD_PUBLIC_KEY` using Node's native `crypto.createPublicKey`.
* Returns `401` on bad signature, `200` with `type: 1 (PONG)` for
  `PING`, and `200` with the appropriate interaction response for
  every other type.
* Excluded from CSRF origin check (Discord does not send `Origin`,
  the Ed25519 signature is a strictly stronger proof of authenticity).

---

## 7. Automated end-to-end harness

Manual exercise of every command + button against a real staging guild
remains the gold standard, but for fast regression coverage there is an
in-process harness that drives `handleInteractionRequest` directly with
locally-generated Ed25519 signatures and intercepts every outbound
`discord.com/api/v10/*` HTTP call:

```
tsx exentax-web/scripts/test-discord-bot-e2e.ts
```

Requires `DATABASE_URL`. The harness:

* generates a fresh Ed25519 keypair and exposes the public half via
  `DISCORD_PUBLIC_KEY`, so signature verification is exercised end-to-end
  (PING + valid + invalid + tampered body all asserted)
* exercises every slash command in § 3 (`/ayuda`, all `/agenda *` and all
  `/cita *` subcommands including `cancelar`, `noshow`, `reprogramar`,
  and `email` for every `tipo`), every button + select-menu in § 4 and
  the reschedule modal — 68 assertions
* verifies (a) HTTP response shape, (b) DB-side effects in `agenda` and
  `agenda_admin_actions`, (c) outbound REST POSTs to the audit channel
  and PATCHes to the originating `#agenda` message
* tags every test row with `e2e-discord-bot-<timestamp>` and removes
  them on exit (success or failure)

What the harness still does NOT cover (genuine staging Discord required):
real signature checks against the live URL, real slash-command publish
round-trip, real button rendering / clicks in a Discord client, and real
Gmail / Google Meet side-effects (those are no-op'd by leaving
`GOOGLE_SERVICE_ACCOUNT_KEY` unset for the test process).

## 7b. Agenda system invariants (do NOT break)

Hard rules that the booking system relies on. Any future change that
violates one of these must be rejected — the safety properties below are
load-bearing for "no double bookings, no orphan reminders, no slot drift
across DST".

1. **One active booking per (date, startTime).** Enforced by both the
   in-process slot lock (`withSlotLock` in `server/route-helpers.ts`)
   AND the partial unique index `agenda_active_slot_uniq_idx` on
   `agenda(fecha_reunion, hora_inicio) WHERE estado IS NULL OR estado
   NOT IN ('cancelled','no_show')`. Either layer alone is sufficient
   for correctness; together they cover both single-instance bursts
   and any future horizontal scaling.

2. **All booking timestamps are interpreted in `Europe/Madrid` wall
   time.** The single canonical translation is
   `madridWallTimeToUtcMs(date, startTime)` in `shared/madrid-time.ts`,
   used by both the client calendar and the server reminder scheduler.
   Bypassing it (e.g. `new Date("2026-03-29T09:00")`) will silently
   shift bookings by ±1h on DST days. DST regression suite:
   `tsx tests/madrid-time-dst.test.ts`.

3. **Reminders survive process restarts.** `scheduleReminderEmail` does
   set an in-memory timer, but the source of truth is the `agenda`
   row's `reminder_sent` flag. On startup AND every hour, the recovery
   sweep `recoverPendingReminders` in `server/index.ts` calls
   `getFutureAgenda` and schedules / re-fires anything still pending,
   using the atomic `markReminderSent` claim so that the timer and the
   sweep cannot double-send.

4. **`manage_token` is a 24-byte CSPRNG secret per booking.** Generated
   with `crypto.randomBytes(24).toString("hex")` (≥ 192 bits). All
   comparisons go through `crypto.timingSafeEqual` (see
   `getAgendaByIdAndToken`). The token is never logged: the request
   logger uses `req.path` (no query string), the body redactor masks
   `token` / `managetoken`, and Discord notifications NEVER carry the
   token (asserted by `tests/discord-no-token-leak.test.ts`).

5. **Manage endpoints reject mutation after cancellation.** Even with a
   valid `manage_token`, `/api/booking/:id/cancel` and `…/reschedule`
   refuse a cancelled or past booking. The token itself stays valid for
   read-only `GET /api/booking/:id` so the client can render the final
   status, but cannot be re-used to revive a dead booking.

6. **Validation for every booking endpoint.** `book`, `draft`,
   `available-slots`, `reschedule`, `cancel` all run a `strict()` Zod
   schema before any DB call. Server-side guards re-check
   `isWeekday(date)`, `validSlots.includes(startTime)`,
   `date >= todayMadridISO()`, and `getBlockedDay(date)` so that a
   client bypassing the calendar UI cannot land an invalid slot.

7. **Rate limits are per-IP AND per-email.** Booking endpoints have
   parallel limiters (`bookingLimiter` keyed by IP, `bookingEmailLimiter`
   keyed by email; `bookingDraftEmailLimiter` for the draft endpoint).
   Both must pass — either dimension alone is bypassable by an
   attacker rotating the other.

8. **Google Calendar / Meet failures NEVER cancel a booking.** The Meet
   creation call is wrapped in `googleCalendarBreaker.execute(...)` in
   `server/google-meet.ts`; a transport failure leaves `meetLink=null`
   and the booking still confirms. The circuit-breaker state is
   exposed via `/api/metrics` and an OPEN transition is mirrored to
   the Discord errors channel. Stranded events are reconciled by
   `tsx scripts/reconcile-agenda-zombies.ts` (see §10 below).

9. **Every admin mutation is audited.** Any Discord slash command or
   button that mutates state writes a row to `agenda_admin_actions`
   via `logAdminAction(...)` (actor, action, payload). The schema is
   append-only — losing an audit line is a P1 incident.

10. **Drafts are kept lean.** `booking_drafts` is purely a rescue email
    funnel; the `incomplete-bookings` cron sweeps it every 5 min using
    the partial index `booking_drafts_open_created_idx WHERE
    reminder_sent_at IS NULL AND completed_at IS NULL`. Drafts older
    than 24h are dropped from the eligibility window so the table does
    not grow unbounded. `markBookingDraftCompleted(email)` is fired
    from `/api/bookings/book` so a confirmed booking immediately
    extinguishes any open draft for the same address.

## 7c. Operational scripts

* **`tsx scripts/reconcile-agenda-zombies.ts`** — dry-run audit of
  drift between `agenda`, `booking_drafts`, blocked days, and Google
  Calendar events. Prints four buckets:
  - (A) cancelled/no-show bookings still holding a Google event id
  - (B) active `google_meet` bookings with a NULL event id
  - (C) drafts marked completed without a matching active booking
  - (D) active bookings sitting on a blocked day

  Add `--apply` to actually delete the stranded Google events from
  bucket (A) and clear their `google_meet_event_id` column. Add
  `--fail-on-zombies` to make the script exit non-zero on any finding
  (useful when wired into a periodic cron / CI alert).

  The detection / repair logic lives in `server/agenda-reconcile.ts`
  so it can be invoked both by this CLI script and by the daily
  scheduler described below — the script is now a thin wrapper.

  **Daily automated sweep** — `server/scheduled/reconcile-zombies.ts`
  runs the same dry-run detection once per day at 06:00 server time
  (wired alongside the periodic-reports scheduler in
  `server/index.ts`). Behaviour:

  - Always logs the full dry-run report to the application log under
    `[reconcile-zombies]`, regardless of outcome — this is the
    "preserved dry-run output" an operator reviews before re-running
    the script with `--apply`.
  - A clean run (zero items across all four buckets) is silent on
    Discord — only the per-bucket counts go to the log as a heartbeat.
  - Any non-zero finding posts **one** embed to the Discord
    `#sistema-errores` channel (event type `system_error`,
    severity `[AVISO]`) with the per-bucket counts and a pointer to
    re-run `tsx exentax-web/scripts/reconcile-agenda-zombies.ts --apply`
    after reviewing the full report in the log.
  - The Discord alert is deduped by date (`reconcile_zombies:YYYY-MM-DD`)
    so duplicate ticks within the same day never produce duplicate
    embeds.
  - The scheduler **never** auto-applies repairs. The repair path
    (delete the stranded Google Calendar events from bucket A) is
    idempotent and safe, but a human glance is still required so a
    Google API outage in progress isn't blindly papered over.

* **`tsx tests/madrid-time-dst.test.ts`** — DST regression suite for
  `madridWallTimeToUtcMs` and `isWeekdayISO`. Run after any change to
  `shared/madrid-time.ts` or to the reminder scheduling math.

## 8. Operational notes

* Slash command publication takes up to 1 hour to propagate globally
  the first time. For faster iteration during development, register
  guild-scoped commands by uncommenting the guild branch in
  `registerSlashCommands` and setting a `DISCORD_GUILD_ID` env var.
* Booking reads use the `IStorage` interface directly. There is no
  REST admin surface — the bot is the only way to read or mutate
  bookings outside the public booking flow. Any inbound `/api/admin/*`
  request hits the catch-all `apiNotFound` (404).
* The bot module is fully idempotent at startup: re-running the
  process re-publishes the manifest (Discord deduplicates) and
  re-mounts the interactions route on a fresh Express instance.
* **No webhooks anywhere.** All notification channels (registros,
  calculadora, actividad, agenda, consentimientos, errores,
  auditoría) are delivered as bot messages via
  `POST /channels/{id}/messages` with `Authorization: Bot <DISCORD_BOT_TOKEN>`.
  The bot identity (username + avatar) is configured once in the
  Discord developer portal — payloads no longer carry `username` /
  `avatar_url` overrides. Embed colour is forced to Exentax neon
  green (`#00E510`) on every send for brand consistency.

---

## 9. How to add a new slash command

Single source of truth: `exentax-web/server/discord-bot.ts::buildSlashCommandManifest`.
Every command you add MUST be wired in **all three** layers below — the
e2e harness asserts there are zero orphan handlers and zero registered
commands without a handler:

1. **Manifest** — append the command (or subcommand) to
   `buildSlashCommandManifest()` in `discord-bot.ts`. Keep the option
   schema strict (`required: true` where applicable, `choices` for
   enums) so Discord validates input client-side.
2. **Dispatcher** — in `discord-bot-commands.ts::dispatchSlashCommand`,
   route the new top-level name to a handler. For new subcommands,
   add a `case` in the existing top-level handler (e.g. `handleCitaCommand`).
3. **Handler** — implement the action. Every handler MUST:
   - Validate inputs with `zod` or the same `ISO_DATE_RE` / regex
     helpers used by existing handlers.
   - Persist an audit row via `logAdminAction({ action, actor, ... })`.
   - Echo the action to `#sistema-auditoria` via `notifyAdminAction(...)`.
   - Reply ephemerally (`replyEphemeral` or `deferEphemeral` + `followupEphemeral`).
4. **Docs** — update §3 of this file and the `/ayuda` embed in
   `handleHelpCommand` so operators can discover the command.
5. **Publish** — `npm run discord:register:diff` to verify the local
   manifest, then `npm run discord:register` to push it. Discord
   propagates global commands within ~1h.
6. **Tests** — add an assertion block to
   `exentax-web/scripts/test-discord-bot-e2e.ts` (signature, response
   shape, audit row, side effect). Run `tsx scripts/test-discord-bot-e2e.ts`.

Buttons and select options follow the same pattern — register the
custom ID under `bookingActionRows()` in `server/discord.ts`, add a
`case` in `dispatchComponent`, and assert the round-trip in
`test-discord-bot-buttons.ts` + `test-discord-bot-e2e.ts`.

## 10. Runbook — operación del bot endurecido (Task #12)

Punto único de entrada para guardia. La lista exhaustiva con métricas,
umbrales y procedimientos vive en
[`docs/deploy/DISCORD-SETUP.md` §11](./deploy/DISCORD-SETUP.md). Aquí
quedan los puntos imprescindibles para alguien que ya conoce la agenda.

### Endurecimientos vigentes (qué se puede asumir hoy)

- El endpoint `POST /api/discord/interactions` valida la firma Ed25519
  contra `req.rawBody` con ventana anti-replay de **±300 s**
  (`SIGNATURE_TIMESTAMP_WINDOW_SECONDS` en `discord-bot.ts`). Las
  rechazadas por ventana suman a `discord_replay_rejected_total` y no
  contaminan `discord_signature_failures_total{reason="bad_signature"}`.
- Cada intento sin rol admin queda en `agenda_admin_actions` con
  `action LIKE 'unauthorized:%'` además de incrementar
  `discord_unauthorised_total`. El usuario solo ve "permiso denegado".
- Los errores en dispatch responden ephemerally con
  `errorId=<8 hex>` correlacionable contra logs.
- `registerSlashCommands` hace **GET → diff → PUT** (idempotente). Si el
  manifest local coincide con el publicado, log
  `[discord-bot] Slash commands already up-to-date` y no se hace PUT.
- `/api/health/ready` ejecuta un ping cacheado (TTL 60 s) a
  `discord.com/api/v10/users/@me` y degrada readiness a 503 cuando falla
  (campo `checks.discord`).

### Comandos rápidos

| Necesidad | Comando |
|---|---|
| Ver el manifest publicado vs el local sin tocar nada | `npx tsx scripts/register-discord-commands.ts --diff` |
| Forzar re-publish del manifest | `npx tsx scripts/register-discord-commands.ts` |
| E2E end-to-end contra Postgres real | `DATABASE_URL=… npx tsx scripts/test-discord-bot-e2e.ts` |
| Ver últimos accesos no autorizados | `select created_at, actor_discord_id, action from agenda_admin_actions where action like 'unauthorized:%' order by created_at desc limit 50;` |
| Buscar el contexto de un errorId | `pm2 logs exentax \| grep "errorId=<id>"` |

### Métricas clave (ver §11 de DISCORD-SETUP.md para la tabla completa)

- `discord_signature_failures_total{reason="bad_signature"}` —
  >5/min sostenido sugiere rotación de `DISCORD_PUBLIC_KEY` o spoof.
- `discord_replay_rejected_total` — aislado ⇒ reloj NTP del host;
  acompañado de bad_signature ⇒ ataque.
- `discord_command_duration_ms_*` p99 > 2.5 s ⇒ riesgo de timeout
  Discord (3 s para responder).
- `discord_queue_size` >50 sostenido ⇒ Discord lento o circuit breaker
  abierto; vigilar `discord_dropped_total` para pérdidas reales.
