/**
 * `/newsletter` — broadcast a 10K+ subscribers con rate-limit + retry.
 *
 * Pipeline:
 *   1. /newsletter enviar asunto html [idioma] → crea campaign + jobs en DB
 *   2. Worker drena en background (server/scheduled/newsletter-broadcast.ts)
 *   3. /newsletter status id:<id>          → muestra progreso
 *   4. /newsletter cancelar id:<id>        → marca campaign cancelled
 */
import type { Response } from "express";
import {
  ActorContext, DiscordCommandOption,
} from "../../../discord-bot";
import { logAdminAction } from "../../../storage";
import { replyEphemeral, getOpt } from "../shared";

export async function handleNewsletterCommand(
  sub: string, options: DiscordCommandOption[], actor: ActorContext, res: Response
): Promise<void> {
  await logAdminAction({ actorDiscordId: actor.id, actorDiscordName: actor.name, action: `newsletter ${sub}` });

  if (sub === "enviar") {
    const asunto = (getOpt(options, "asunto") || "").trim();
    const htmlUrl = (getOpt(options, "html") || "").trim();
    const idioma = (getOpt(options, "idioma") || "all").trim();

    if (!asunto || asunto.length > 200) {
      return replyEphemeral(res, "❌ Asunto inválido (1-200 chars)");
    }
    if (!htmlUrl.startsWith("https://")) {
      return replyEphemeral(res, "❌ La URL del HTML debe empezar con https://");
    }

    let html = "";
    try {
      const r = await fetch(htmlUrl, { headers: { "User-Agent": "Exentax-Newsletter/1.0" } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      html = await r.text();
    } catch (err) {
      return replyEphemeral(res, `❌ No se pudo descargar el HTML: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!html.includes("{{unsubscribe_url}}")) {
      return replyEphemeral(res, "❌ El HTML debe incluir el placeholder {{unsubscribe_url}} (footer legal)");
    }

    try {
      const { createCampaign } = await import("../../../scheduled/newsletter-broadcast");
      const lang = idioma === "all" ? null : idioma;
      const { campaignId, recipients } = await createCampaign(asunto, html, lang, actor.id);
      return replyEphemeral(res,
        `✅ Campaign creada: \`${campaignId}\`\n` +
        `**Recipients**: ${recipients}\n` +
        `**Idioma**: ${lang ?? "todos"}\n` +
        `Worker drena en background a 2 emails/sec (~${Math.ceil(recipients / 7200)}h estimadas).\n` +
        `Status: \`/newsletter status id:${campaignId}\``
      );
    } catch (err) {
      return replyEphemeral(res, `❌ Error creando campaign: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (sub === "status") {
    const id = (getOpt(options, "id") || "").trim();
    if (!id || !id.startsWith("CMP_")) return replyEphemeral(res, "❌ Campaign ID inválido");
    try {
      const { getCampaignStatus } = await import("../../../scheduled/newsletter-broadcast");
      const r = await getCampaignStatus(id);
      if (!r.found || !r.campaign) return replyEphemeral(res, `❌ Campaign \`${id}\` no encontrada`);
      const c = r.campaign;
      const pct = c.totalRecipients ? ((c.sentCount! / c.totalRecipients) * 100).toFixed(1) : "0.0";
      return replyEphemeral(res,
        `**Campaign** \`${id}\`\n` +
        `**Subject**: ${c.subject}\n` +
        `**Status**: ${c.status}\n` +
        `**Progreso**: ${c.sentCount}/${c.totalRecipients} (${pct}%) · failed: ${c.failedCount}\n` +
        `**Idioma**: ${c.language ?? "todos"}\n` +
        `**Iniciada**: ${c.startedAt ? new Date(c.startedAt).toISOString() : "—"}\n` +
        `**Completada**: ${c.completedAt ? new Date(c.completedAt).toISOString() : "—"}`
      );
    } catch (err) {
      return replyEphemeral(res, `❌ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (sub === "cancelar") {
    const id = (getOpt(options, "id") || "").trim();
    if (!id || !id.startsWith("CMP_")) return replyEphemeral(res, "❌ Campaign ID inválido");
    try {
      const { cancelCampaign } = await import("../../../scheduled/newsletter-broadcast");
      const r = await cancelCampaign(id, actor.id);
      return replyEphemeral(res, r.ok ? `✅ ${r.message}` : `❌ ${r.message}`);
    } catch (err) {
      return replyEphemeral(res, `❌ ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  replyEphemeral(res, `Subcomando \`/newsletter ${sub}\` no reconocido`);
}
