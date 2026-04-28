/**
 * Shared primitives for the Discord agenda bot handlers.
 *
 * Splitting these out of the legacy `discord-bot-commands.ts` keeps every
 * handler file (commands/, components, modals) small enough that a future
 * agent can read them top-to-bottom without scrolling. The contents are an
 * exact copy of the original helpers — they are unit-trivial and intentionally
 * identical so behaviour stays unchanged for the in-process E2E harness
 * (`scripts/discord/test-discord-bot-e2e.ts`).
 */
import type { Response } from "express";
import {
  DiscordCommandOption, DiscordEmbedRef,
  INTERACTION_RESPONSE_TYPE, EPHEMERAL,
  editOriginalResponse,
} from "../../discord-bot";
import type { Agenda } from "../../../shared/schema";

// ─── Reply helpers ───────────────────────────────────────────────────────────

export function replyEphemeral(res: Response, content: string, embeds?: DiscordEmbedRef[]): void {
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL, content, embeds },
  });
}

export function deferEphemeral(res: Response): void {
  res.status(200).json({
    type: INTERACTION_RESPONSE_TYPE.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL },
  });
}

export function deferUpdate(res: Response): void {
  res.status(200).json({ type: INTERACTION_RESPONSE_TYPE.DEFERRED_UPDATE_MESSAGE });
}

export async function followupEphemeral(
  token: string, content: string, embeds?: DiscordEmbedRef[],
): Promise<void> {
  await editOriginalResponse(token, { content, embeds: embeds || [], flags: EPHEMERAL });
}

// ─── Option / id parsing ─────────────────────────────────────────────────────

export function getSubcommand(
  data: { name?: string; options?: DiscordCommandOption[] } | undefined,
): { name: string; options: DiscordCommandOption[] } {
  const sub = data?.options?.[0];
  if (sub && sub.type === 1) return { name: sub.name, options: sub.options || [] };
  return { name: data?.name || "", options: data?.options || [] };
}

export function getOpt(options: DiscordCommandOption[], name: string): string | undefined {
  const o = options?.find?.((x) => x.name === name);
  if (!o) return undefined;
  return o.value == null ? undefined : String(o.value);
}

const ID_RE = /^[A-Za-z0-9_\-]{1,100}$/;
export function validBookingId(id: string | undefined): id is string {
  return !!id && ID_RE.test(id);
}

// ─── Embeds ──────────────────────────────────────────────────────────────────

export const NEON = 0x00E510;

export function bookingDetailEmbed(b: Agenda): DiscordEmbedRef {
  const isPhone = b.meetingType === "phone_call";
  const modality = isPhone ? "Llamada telefónica" : "Google Meet";
  return {
    color: NEON,
    title: `Cita ${b.id}`,
    description: `**${b.name || "—"}** · ${b.email || "—"}`,
    fields: [
      { name: "Fecha",    value: `${b.meetingDate || "—"} ${b.startTime || ""}—${b.endTime || ""}`, inline: true },
      { name: "Estado",   value: b.status || "pending", inline: true },
      { name: "Teléfono", value: b.phone || "—", inline: true },
      { name: "Idioma",   value: b.language || "es", inline: true },
      { name: "Modalidad", value: modality, inline: true },
      { name: "Reagendamientos", value: String(b.rescheduleCount ?? 0), inline: true },
      ...(isPhone
        ? []
        : [{ name: "Google Meet", value: b.googleMeet ? `[Unirse](${b.googleMeet})` : "—", inline: true }]),
      ...(b.notes ? [{ name: "Notas",    value: String(b.notes).slice(0, 1000), inline: false }] : []),
      ...(b.context ? [{ name: "Contexto", value: String(b.context).slice(0, 1000), inline: false }] : []),
    ],
  };
}

export function bookingListEmbed(title: string, rows: Agenda[]): DiscordEmbedRef {
  if (rows.length === 0) {
    return { color: NEON, title, description: "_Sin reservas en el rango seleccionado._" };
  }
  const lines = rows.slice(0, 25).map(r =>
    `• \`${r.id}\` · **${r.meetingDate} ${r.startTime}** · ${r.name || "—"} (${r.status || "pending"})`
  );
  return {
    color: NEON,
    title: `${title} — ${rows.length} resultado(s)`,
    description: lines.join("\n"),
  };
}

// ─── Misc helpers ───────────────────────────────────────────────────────────

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
