/**
 * Slash command dispatcher. Routes Discord interaction `type=2` payloads
 * (APPLICATION_COMMAND) to the appropriate per-command handler.
 */
import type { Response } from "express";
import {
  ActorContext, DiscordInteraction,
} from "../../discord-bot";
import { replyEphemeral, getSubcommand } from "./shared";
import { handleHelpCommand } from "./commands/help";
import { handleAgendaCommand } from "./commands/agenda";
import { handleCitaCommand } from "./commands/cita";
import { handleNewsletterCommand } from "./commands/newsletter";

export async function dispatchSlashCommand(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const data = interaction.data || {};
  const top = data.name as string;
  const sub = getSubcommand(data);

  if (top === "ayuda") {
    return handleHelpCommand(actor, res);
  }
  if (top === "agenda") {
    return handleAgendaCommand(sub.name, sub.options, interaction, actor, res);
  }
  if (top === "cita") {
    return handleCitaCommand(sub.name, sub.options, interaction, actor, res);
  }
  if (top === "newsletter") {
    return handleNewsletterCommand(sub.name, sub.options, actor, res);
  }
  replyEphemeral(res, `Comando no reconocido: \`${top}\``);
}
