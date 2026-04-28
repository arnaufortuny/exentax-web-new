/**
 * Modal submit dispatcher. Routes Discord interaction `type=5` payloads
 * (MODAL_SUBMIT) — currently just the reschedule modal opened from the
 * "Reprogramar" button.
 */
import type { Response } from "express";
import {
  ActorContext, DiscordInteraction, DiscordMessageComponent,
} from "../../discord-bot";
import {
  replyEphemeral, deferEphemeral, validBookingId,
} from "./shared";
import { rescheduleBooking } from "./booking-actions";

export async function dispatchModalSubmit(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const customId = String(interaction.data?.custom_id || "");
  const parts = customId.split(":");
  if (parts[0] !== "agenda" || parts[1] !== "reschedule_modal") {
    replyEphemeral(res, "Error: Modal no reconocido.");
    return;
  }
  const id = parts[2];
  if (!validBookingId(id)) { replyEphemeral(res, "Error: Booking ID inválido."); return; }

  const components: DiscordMessageComponent[] = interaction.data?.components || [];
  const flat: Record<string, string> = {};
  for (const row of components) {
    for (const c of (row.components || [])) {
      if (c.custom_id) flat[c.custom_id] = String(c.value || "");
    }
  }
  const fecha = flat["fecha"];
  const hora  = flat["hora"];
  if (!fecha || !hora) { replyEphemeral(res, "Error: Faltan campos."); return; }

  deferEphemeral(res);
  await rescheduleBooking(id, fecha, hora, actor, interaction);
}
