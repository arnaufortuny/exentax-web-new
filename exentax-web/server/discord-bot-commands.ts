/**
 * Discord agenda bot — public dispatcher entry-points.
 *
 * The implementation is split into one file per surface under
 * `server/discord/handlers/`:
 *   - `handlers/slash.ts`      — `/ayuda`, `/agenda`, `/cita`, `/newsletter`
 *   - `handlers/components.ts` — booking action buttons + email select menu
 *   - `handlers/modals.ts`     — reschedule modal submit
 * Shared helpers, embeds and the booking-mutating logic live in
 * `handlers/shared.ts`, `handlers/patch-message.ts` and
 * `handlers/booking-actions.ts` respectively. This file is a thin re-export
 * so existing imports (`./discord-bot-commands`) keep working unchanged.
 */
export { dispatchSlashCommand } from "./discord/handlers/slash";
export { dispatchComponent } from "./discord/handlers/components";
export { dispatchModalSubmit } from "./discord/handlers/modals";
