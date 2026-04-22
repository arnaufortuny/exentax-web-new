# Discord channel routing (Bot REST API)

> All notifications are delivered by the Exentax Discord bot via the REST
> API endpoint `POST /channels/{channel_id}/messages` using `Authorization:
> Bot <DISCORD_BOT_TOKEN>`.

## Required environment variables

| Variable                              | Purpose                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------- |
| `DISCORD_BOT_TOKEN`                   | Bot token used for both interactions and outbound `POST` to channels.      |
| `DISCORD_APP_ID`                      | Application ID (used for slash command registration).                      |
| `DISCORD_PUBLIC_KEY`                  | Ed25519 public key used to verify inbound interactions.                    |
| `DISCORD_GUILD_ID`                    | Guild whose roles are checked for `ADMIN_DISCORD_ROLE_ID`.                 |
| `ADMIN_DISCORD_ROLE_ID`               | Role required to invoke any `/agenda`, `/cita` or button action.           |
| `DISCORD_CHANNEL_REGISTROS`           | `#exentax-registros` — leads, newsletter sign-ups, fallback for errors.    |
| `DISCORD_CHANNEL_CALCULADORA`         | `#exentax-calculadora` — calculator submissions.                           |
| `DISCORD_CHANNEL_ACTIVIDAD`           | `#exentax-actividad` — visits and low-noise user-activity signals.         |
| `DISCORD_CHANNEL_AGENDA`              | `#exentax-agenda` — booking lifecycle (create / reschedule / cancel / NS). |
| `DISCORD_CHANNEL_CONSENTIMIENTOS`     | `#exentax-consentimientos` — privacy / cookie consent log.                 |
| `DISCORD_CHANNEL_ERRORES`             | `#exentax-errores` — critical errors, validation failures, SEO indexing.   |
| `DISCORD_CHANNEL_AUDITORIA`           | `#sistema-auditoria` — every bot-initiated operator action (button + slash).  |

If `DISCORD_CHANNEL_ERRORES` is unset, error events fall back to
`DISCORD_CHANNEL_REGISTROS` (see `getChannelId()` in `server/discord.ts`).

## Event → channel mapping

| Event type            | Channel             | Triggered by                                                |
| --------------------- | ------------------- | ----------------------------------------------------------- |
| `lead_new`            | `registros`         | New booking lead, contact form, etc.                        |
| `lead_calculator`     | `calculadora`       | Calculator submission.                                      |
| `lead_newsletter`     | `registros`         | Newsletter signup.                                          |
| `user_activity`       | `actividad`         | First-party visit ping (consented).                         |
| `booking_created`     | `agenda`            | New booking (web or `/cita nueva` from the bot).            |
| `booking_rescheduled` | `agenda`            | Reschedule from client portal or bot.                       |
| `booking_cancelled`   | `agenda`            | Cancellation from client portal or bot.                     |
| `booking_no_show`     | `agenda`            | `/cita noshow` or no-show button.                           |
| `consent_logged`      | `consentimientos`   | Booking, calculator, newsletter, cookie banner.             |
| `validation_failed`   | `errores`           | Zod / schema rejection on any public endpoint.              |
| `system_error`        | `errores`           | `notifyCriticalError` (uncaught, send failures, etc.).      |
| `seo_indexing`        | `errores`           | IndexNow + Google Indexing API outcomes.                    |
| `admin_action`        | `auditoria`         | Every action triggered by the Discord agenda bot (`notifyAdminAction`). |

## Brand & security policy

- **No emojis or icons** anywhere — buttons, embeds, status fields and
  titles are plain text. Severity is conveyed by the `[INFO] / [AVISO] /
  [ERROR]` prefix and by Discord's native button colour styles.
- **No `manage_token` ever leaves the email channel.** Discord embeds carry
  only the public-safe `bookingId`. The regression test
  `tests/discord-no-token-leak.test.ts` enforces this on every CI run.
- **Every consent record gets a stable `con_*` ID**, surfaced as the first
  field of the `#consentimientos` embed so a GDPR subject-access request
  can cross-reference the channel and the `consent_log` row in O(1).
- **Bot identity** (username + avatar) is fixed in the Discord developer
  portal; outbound payloads do NOT pass `username` / `avatar_url`.
