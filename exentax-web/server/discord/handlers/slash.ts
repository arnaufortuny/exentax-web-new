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
import { canHandleSlashTuple } from "./handled-slash-tuples";

export async function dispatchSlashCommand(
  interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  const data = interaction.data || {};
  const top = data.name as string;
  const sub = getSubcommand(data);
  // Discord delivers a subcommand as `data.options[0].type === 1`. When the
  // top-level command has no subcommand layer at all (e.g. `/ayuda`), there
  // is no such option and we treat the tuple's `sub` slot as `null` for the
  // purpose of the handled-tuples catalog. Keeping this calculation in
  // lockstep with `flattenManifestTuples()` is what makes the manifest-vs-
  // dispatcher gate meaningful.
  const hasSubcommand = Array.isArray(data.options)
    && data.options.length > 0
    && data.options[0]?.type === 1;
  const subKey = hasSubcommand ? sub.name : null;

  if (!canHandleSlashTuple(top, subKey)) {
    const label = subKey == null ? `/${top}` : `/${top} ${subKey}`;
    replyEphemeral(res, `Comando no reconocido: \`${label}\``);
    return;
  }

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
  // Defense-in-depth: the catalog said yes but no top-level branch claimed
  // it. This can only happen if HANDLED_SLASH_TUPLES drifts ahead of this
  // file; the CI gate will already have failed in that case, but we still
  // give the user a clear message at runtime.
  replyEphemeral(res, `Comando no reconocido: \`${top}\``);
}
