/**
 * `/cita` — per-booking actions (view, confirm, cancel, no-show, reschedule,
 * manual email send, manual creation). All booking-mutating logic lives in
 * `../booking-actions.ts`; this module just wires subcommand strings to the
 * shared handlers and validates the booking ID.
 */
import type { Response } from "express";
import {
  ActorContext, DiscordCommandOption, DiscordInteraction,
} from "../../../discord-bot";
import {
  replyEphemeral, deferEphemeral, getOpt, validBookingId,
} from "../shared";
import {
  showBooking, confirmBooking, cancelBooking, noShowBooking,
  rescheduleBooking, sendManualEmail, handleCreateBooking,
} from "../booking-actions";

export async function handleCitaCommand(
  sub: string, options: DiscordCommandOption[], interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  if (sub === "nueva") return handleCreateBooking(options, interaction, actor, res);

  const id = getOpt(options, "id");
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  switch (sub) {
    case "ver":         return showBooking(id, actor, res);
    case "confirmar":   return confirmBooking(id, actor, interaction, res);
    case "cancelar":    return cancelBooking(id, actor, interaction, res);
    case "noshow":      return noShowBooking(id, actor, interaction, res);
    case "reprogramar": {
      const fecha = getOpt(options, "fecha");
      const hora  = getOpt(options, "hora");
      if (!fecha || !hora) { replyEphemeral(res, "Error: Fecha y hora son obligatorios."); return; }
      deferEphemeral(res);
      await rescheduleBooking(id, fecha, hora, actor, interaction);
      return;
    }
    case "email": {
      const tipo = getOpt(options, "tipo") || "";
      deferEphemeral(res);
      await sendManualEmail(id, tipo, actor, interaction);
      return;
    }
    default:
      replyEphemeral(res, `Subcomando \`/cita ${sub}\` no implementado.`);
  }
}
