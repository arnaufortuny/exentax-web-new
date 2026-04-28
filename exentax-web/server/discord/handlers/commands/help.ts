/**
 * `/ayuda` — single self-contained reference card the operator can pull up
 * from inside Discord without leaving for the docs site. Kept as one
 * ephemeral embed so it never spams the channel and only the invoker sees
 * it. The structure mirrors `docs/discord-bot-agenda.md` exactly — when
 * adding a new command, update both places to keep them in sync.
 */
import type { Response } from "express";
import {
  ActorContext,
  INTERACTION_RESPONSE_TYPE, EPHEMERAL,
} from "../../../discord-bot";
import { logAdminAction } from "../../../storage";

export async function handleHelpCommand(actor: ActorContext, res: Response): Promise<void> {
  await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "ayuda" });
  const fields = [
    {
      name: "Consulta de agenda",
      value: [
        "`/agenda hoy` — reservas de hoy (Madrid).",
        "`/agenda semana` — reservas de los próximos 7 días.",
        "`/agenda buscar q:<texto>` — busca por booking ID, nombre o email.",
        "`/agenda libre fecha:YYYY-MM-DD` — slots libres del día.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Bloqueo de días",
      value: [
        "`/agenda bloquear fecha:YYYY-MM-DD motivo:<texto>` — marca el día como no disponible.",
        "`/agenda desbloquear fecha:YYYY-MM-DD` — quita el bloqueo.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Gestión de una cita",
      value: [
        "`/cita ver id:<bookingId>` — ficha completa con botones de acción.",
        "`/cita confirmar id:<bookingId>` — pasa a estado `contacted`.",
        "`/cita cancelar id:<bookingId> motivo:<texto>` — cancela y libera el slot (envía email).",
        "`/cita noshow id:<bookingId>` — marca no-show (envía email de reagenda).",
        "`/cita reprogramar id:<bookingId>` — abre formulario para nueva fecha/hora.",
        "`/cita nueva nombre:<…> email:<…> fecha:<…> hora:<…> [telefono] [notas] [idioma]` — alta manual.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Envío manual de emails",
      value: [
        "`/cita email id:<bookingId> tipo:<confirmation|recordatorio|noshow|seguimiento>`.",
        "También disponible como menú desplegable bajo cada notificación de #agenda.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Botones bajo cada notificación de #agenda",
      value: [
        "**Confirmar** · **Reprogramar** · **Cancelar** · **No-show**",
        "Selector **Enviar email manual…** con las 4 plantillas.",
        "Tras cualquier acción, el embed original se actualiza con estado + operador + hora; los botones desaparecen para evitar duplicar la acción.",
      ].join("\n"),
      inline: false,
    },
    {
      name: "Identidad de las reservas",
      value: "Toda gestión usa el **bookingId** corto (p.ej. `bk_a1b2c3d4`). El `manage_token` es secreto del cliente y nunca aparece en Discord ni en logs.",
      inline: false,
    },
    {
      name: "Auditoría",
      value: [
        "Cada acción queda registrada en la tabla `agenda_admin_actions` (DB) y replicada en **#sistema-auditoria**.",
        "Solo miembros con el rol `ADMIN_DISCORD_ROLE_ID` pueden invocar comandos o pulsar botones.",
      ].join("\n"),
      inline: false,
    },
  ];
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      flags: EPHEMERAL,
      embeds: [{
        title: "Bot de Agenda Exentax — Ayuda",
        description: "Referencia rápida de todos los comandos y componentes.",
        color: 0x00E510,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: "Documentación completa: docs/discord-bot-agenda.md" },
      }],
    },
  });
}
