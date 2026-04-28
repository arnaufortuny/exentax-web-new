/**
 * Patches the originating Discord message that hosted a booking action button.
 *
 * When an operator clicks one of the action buttons under an `#agenda`
 * notification we update that message in place: the embed gains a new
 * "Última acción" field reflecting the latest status + actor + timestamp,
 * and the buttons row is dropped so further clicks can't duplicate the
 * action. The audit log + audit-channel echo remain the source of truth,
 * so failures here are intentionally non-fatal.
 */
import {
  ActorContext, DiscordInteraction, DiscordEmbedRef,
} from "../../discord-bot";
import { editChannelMessage } from "../../discord";

export function statusLabel(action: string): string {
  switch (action) {
    case "cita.confirmar":   return "Confirmada";
    case "cita.cancelar":    return "Cancelada";
    case "cita.noshow":      return "No-show";
    case "cita.reprogramar": return "Reprogramada";
    case "cita.email.confirmation": return "Confirmación reenviada";
    case "cita.email.recordatorio": return "Recordatorio enviado";
    case "cita.email.noshow":       return "Email no-show enviado";
    case "cita.email.seguimiento":  return "Seguimiento enviado";
    default: return action;
  }
}

export async function patchOriginatingMessage(
  interaction: DiscordInteraction, action: string, actor: ActorContext,
): Promise<void> {
  const channelId = interaction.channel_id;
  const messageId = interaction.message?.id;
  if (!channelId || !messageId) return; // not a button click — nothing to update
  const baseEmbeds = (interaction.message?.embeds || []) as DiscordEmbedRef[];
  const cloned = baseEmbeds.map(e => ({ ...e, fields: Array.isArray(e.fields) ? [...e.fields] : [] }));
  if (cloned.length === 0) {
    cloned.push({ title: "Reserva actualizada", color: 0x00E510, fields: [] });
  }
  const target = cloned[cloned.length - 1];
  const stamp = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid", hour12: false });
  const newField = {
    name: "Última acción",
    value: `${statusLabel(action)} · por **${actor.name}** \`${actor.id}\` · ${stamp}`,
    inline: false,
  };
  // Replace any prior "Última acción" so consecutive clicks don't pile up.
  target.fields = [
    ...target.fields.filter((f) => f?.name !== "Última acción"),
    newField,
  ];
  await editChannelMessage(channelId, messageId, { embeds: cloned, components: [] });
}
