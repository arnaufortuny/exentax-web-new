/**
 * Message component dispatcher (buttons + select menus). Routes Discord
 * interaction `type=3` payloads (MESSAGE_COMPONENT) to the right booking
 * action and, for the reschedule button, opens a modal.
 */
import type { Response } from "express";
import {
  ActorContext, DiscordInteraction,
  INTERACTION_RESPONSE_TYPE,
} from "../../discord-bot";
import {
  replyEphemeral, deferEphemeral, validBookingId,
} from "./shared";
import {
  confirmBooking, cancelBooking, noShowBooking, sendManualEmail,
} from "./booking-actions";

export async function dispatchComponent(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const customId = String(interaction.data?.custom_id || "");
  const parts = customId.split(":");
  if (parts[0] !== "agenda") { replyEphemeral(res, "Error: Componente no reconocido."); return; }
  const action = parts[1];
  const id = parts[2];
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  switch (action) {
    case "confirm":   return confirmBooking(id, actor, interaction, res);
    case "cancel":    return cancelBooking(id, actor, interaction, res);
    case "noshow":    return noShowBooking(id, actor, interaction, res);
    case "reschedule":
      // Open a modal so the operator can type the new date/time.
      res.status(200).json({
        type: INTERACTION_RESPONSE_TYPE.MODAL,
        data: {
          custom_id: `agenda:reschedule_modal:${id}`,
          title: `Reprogramar ${id}`.slice(0, 45),
          components: [
            { type: 1, components: [{ type: 4, custom_id: "fecha", label: "Fecha (YYYY-MM-DD)", style: 1, min_length: 10, max_length: 10, required: true }] },
            { type: 1, components: [{ type: 4, custom_id: "hora",  label: "Hora (HH:MM)",       style: 1, min_length: 5,  max_length: 5,  required: true }] },
          ],
        },
      });
      return;
    case "email_select": {
      // String select menu under the booking message. The operator picks
      // the exact template they want — never a hard-coded default — so
      // we can't accidentally send a no-show email to an active booking
      // (the original generic "Email" button was rejected in code review
      // for exactly that reason).
      const values: string[] = Array.isArray(interaction.data?.values) ? interaction.data!.values : [];
      const tipo = String(values[0] || "");
      const ALLOWED = new Set(["confirmation", "recordatorio", "noshow", "seguimiento"]);
      if (!ALLOWED.has(tipo)) { replyEphemeral(res, "Error: Tipo de email no válido."); return; }
      deferEphemeral(res);
      await sendManualEmail(id, tipo, actor, interaction);
      return;
    }
    default:
      replyEphemeral(res, `Error: Acción de botón no implementada: \`${action}\``);
  }
}
