/**
 * `/agenda` — read-only agenda queries plus blocked-day toggles.
 *
 *   - `/agenda hoy`        → bookings for today (Madrid).
 *   - `/agenda semana`     → bookings for the next 7 days.
 *   - `/agenda buscar`     → free-text search by id / name / email.
 *   - `/agenda libre`      → free slots for a given day.
 *   - `/agenda bloquear`   → mark a day as not bookable.
 *   - `/agenda desbloquear`→ remove a previous block.
 */
import type { Response } from "express";
import {
  ActorContext, DiscordCommandOption, DiscordInteraction,
} from "../../../discord-bot";
import {
  getBlockedDay, insertBlockedDay, deleteBlockedDay,
  listAgendasFiltered, logAdminAction,
} from "../../../storage";
import { AGENDA_STATUSES, isCancelledStatus, todayMadridISO } from "../../../server-constants";
import {
  generateTimeSlots, isWeekday, ISO_DATE_RE, isValidISODate,
} from "../../../route-helpers";
import { notifyAdminAction } from "../../../discord";
import {
  replyEphemeral, getOpt, bookingListEmbed, addDaysISO, NEON,
} from "../shared";

export async function handleAgendaCommand(
  sub: string, options: DiscordCommandOption[], _interaction: DiscordInteraction, actor: ActorContext, res: Response,
): Promise<void> {
  switch (sub) {
    case "hoy": {
      const today = todayMadridISO();
      const rows = await listAgendasFiltered({ from: today, to: today, limit: 100 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.hoy", payload: { from: today } });
      replyEphemeral(res, "", [bookingListEmbed(`Reservas de hoy (${today})`, rows)]);
      return;
    }
    case "semana": {
      const today = todayMadridISO();
      const end = addDaysISO(today, 7);
      const rows = await listAgendasFiltered({ from: today, to: end, limit: 200 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.semana", payload: { from: today, to: end } });
      replyEphemeral(res, "", [bookingListEmbed(`Próxima semana (${today} → ${end})`, rows)]);
      return;
    }
    case "buscar": {
      const q = getOpt(options, "q") || "";
      if (!q || q.length > 120) { replyEphemeral(res, "Error: Texto de búsqueda inválido."); return; }
      const rows = await listAgendasFiltered({ q, limit: 50 });
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.buscar", payload: { q } });
      replyEphemeral(res, "", [bookingListEmbed(`Resultados para "${q}"`, rows)]);
      return;
    }
    case "libre": {
      const fecha = getOpt(options, "fecha");
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      if (!isWeekday(fecha)) { replyEphemeral(res, "Error: Solo se reserva entre lunes y viernes."); return; }
      const blocked = await getBlockedDay(fecha);
      if (blocked) { replyEphemeral(res, `Aviso: Día \`${fecha}\` bloqueado${blocked.reason ? ` — ${blocked.reason}` : ""}.`); return; }
      const allSlots = generateTimeSlots();
      const taken = (await listAgendasFiltered({ from: fecha, to: fecha, limit: 100 }))
        .filter(r => !isCancelledStatus(r.status) && r.status !== AGENDA_STATUSES.NO_SHOW)
        .map(r => r.startTime);
      const free = allSlots.filter(s => !taken.includes(s));
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.libre", payload: { fecha } });
      replyEphemeral(res, "", [{
        color: NEON,
        title: `Slots libres ${fecha}`,
        description: free.length ? free.map(s => `\`${s}\``).join("  ") : "_Sin slots libres._",
      }]);
      return;
    }
    case "bloquear": {
      const fecha = getOpt(options, "fecha");
      const motivo = getOpt(options, "motivo") || null;
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      const row = await insertBlockedDay(fecha, motivo);
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.bloquear", payload: { fecha, motivo } });
      notifyAdminAction({ actor, action: "agenda.bloquear", title: `Día bloqueado · ${fecha}`, fields: [
        { name: "Fecha", value: fecha, inline: true },
        { name: "Motivo", value: motivo || "—", inline: true },
      ]});
      replyEphemeral(res, `Día \`${row.date}\` bloqueado${row.reason ? ` — ${row.reason}` : ""}.`);
      return;
    }
    case "desbloquear": {
      const fecha = getOpt(options, "fecha");
      if (!fecha || !ISO_DATE_RE.test(fecha) || !isValidISODate(fecha)) { replyEphemeral(res, "Error: Fecha inválida (YYYY-MM-DD)."); return; }
      const removed = await deleteBlockedDay(fecha);
      await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: "agenda.desbloquear", payload: { fecha, removed } });
      if (removed) {
        notifyAdminAction({ actor, action: "agenda.desbloquear", title: `OK Día desbloqueado · ${fecha}`, fields: [
          { name: "Fecha", value: fecha, inline: true },
        ]});
      }
      replyEphemeral(res, removed ? `OK Día \`${fecha}\` desbloqueado.` : `\`${fecha}\` no estaba bloqueado.`);
      return;
    }
    default:
      replyEphemeral(res, `Subcomando \`/agenda ${sub}\` no implementado.`);
  }
}
