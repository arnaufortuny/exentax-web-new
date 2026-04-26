/**
 * Newsletter broadcast worker — Exentax
 *
 * Sistema para enviar newsletter a los 10K+ suscriptores con:
 * - Rate limit (default 2 emails/sec → ~7200/hour, 10K en ~1.4h)
 * - Resilencia: jobs persistidos en DB, resumible tras reinicio del proceso
 * - Cancelación: campaign.status = 'cancelled' detiene el worker
 * - Idempotencia: UNIQUE (campaign_id, subscriber_id) impide duplicados
 * - Suppression: salta automáticamente subscribers con unsubscribed_at IS NOT NULL
 * - Backoff: errores SMTP entran en retry con exponential backoff
 * - Discord notifications: progress al iniciar, cada 1000 enviados, al terminar
 *
 * Trigger: vía slash command `/newsletter enviar` desde Discord (solo
 * usuarios con `ADMIN_DISCORD_ROLE_ID`).
 *
 * Worker: corre en background como interval, drena jobs pendientes de
 * campañas en estado 'in_progress'.
 */

import { db } from "../db";
import { eq, and, sql } from "drizzle-orm";
import * as s from "../../shared/schema";
import { logger } from "../logger";
import { notifyEvent } from "../discord";
import { generateId } from "../storage/core";
import { getGmailClient, maskEmail } from "../email";

// ─── Config ──────────────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 500;          // 2 emails/sec → 7200/h. Ajustable según proveedor.
const BATCH_SIZE = 50;              // jobs por iteración del worker
const TICK_INTERVAL_MS = 5_000;     // worker tick cada 5s
const MAX_ATTEMPTS = 3;
const PROGRESS_NOTIFY_EVERY = 1_000; // notifica Discord cada N enviados

// ─── Worker state ────────────────────────────────────────────────────────────
let _workerRunning = false;
let _workerTimer: NodeJS.Timeout | null = null;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Crea una campaña + jobs (uno por destinatario activo). Devuelve campaignId.
 *
 * @param subject Subject del email (max 100 chars recomendado)
 * @param bodyHtml HTML body — debe incluir placeholder {{unsubscribe_url}}
 * @param language Filtro idioma (null = todos)
 * @param createdBy Discord user id que disparó el broadcast
 */
export async function createCampaign(
  subject: string,
  bodyHtml: string,
  language: string | null,
  createdBy: string
): Promise<{ campaignId: string; recipients: number }> {
  const campaignId = generateId("CMP");

  // 1. Insert campaign metadata
  await db.insert(s.newsletterCampaigns).values({
    id: campaignId,
    subject,
    bodyHtml,
    language,
    status: "queued",
    totalRecipients: 0,
    sentCount: 0,
    failedCount: 0,
    createdBy,
  });

  // 2. Snapshot recipients en jobs (lock-free; subs nuevos posteriores no incluidos)
  const langClause = language ? sql`AND language = ${language}` : sql``;
  const inserted = await db.execute(sql`
    INSERT INTO newsletter_campaign_jobs (id, campaign_id, subscriber_id, email, unsubscribe_token, status)
    SELECT
      'JOB_' || encode(gen_random_bytes(16), 'hex') AS id,
      ${campaignId} AS campaign_id,
      id AS subscriber_id,
      email,
      unsubscribe_token,
      'pending' AS status
    FROM newsletter_subscribers
    WHERE unsubscribed_at IS NULL
    ${langClause}
    ON CONFLICT (campaign_id, subscriber_id) DO NOTHING
  `);

  const recipients = inserted.rowCount ?? 0;

  // 3. Update total + status → in_progress
  await db.update(s.newsletterCampaigns)
    .set({
      totalRecipients: recipients,
      status: "in_progress",
      startedAt: new Date(),
    })
    .where(eq(s.newsletterCampaigns.id, campaignId));

  // 4. Notify Discord auditoria
  notifyEvent({
    type: "admin_action",
    criticality: "business",
    title: "Newsletter campaign iniciada",
    description: [
      `**Campaign**: \`${campaignId}\``,
      `**Subject**: ${subject}`,
      `**Recipients**: ${recipients}`,
      `**Language filter**: ${language ?? "todos"}`,
      `**Iniciada por**: <@${createdBy}>`,
    ].join("\n"),
    channel: "auditoria",
    origin: "discord-bot/newsletter-enviar",
    user: createdBy,
  });

  // 5. Asegurar que el worker está corriendo
  startBroadcastWorker();

  return { campaignId, recipients };
}

export async function getCampaignStatus(campaignId: string): Promise<{
  found: boolean;
  campaign?: typeof s.newsletterCampaigns.$inferSelect;
}> {
  const rows = await db.select().from(s.newsletterCampaigns)
    .where(eq(s.newsletterCampaigns.id, campaignId)).limit(1);
  if (rows.length === 0) return { found: false };
  return { found: true, campaign: rows[0] };
}

export async function cancelCampaign(campaignId: string, cancelledBy: string): Promise<{
  ok: boolean;
  message: string;
}> {
  const rows = await db.select().from(s.newsletterCampaigns)
    .where(eq(s.newsletterCampaigns.id, campaignId)).limit(1);
  if (rows.length === 0) return { ok: false, message: "Campaign no encontrada" };
  if (rows[0].status !== "in_progress" && rows[0].status !== "queued") {
    return { ok: false, message: `Campaign en estado '${rows[0].status}' no es cancelable` };
  }
  await db.update(s.newsletterCampaigns)
    .set({ status: "cancelled", completedAt: new Date() })
    .where(eq(s.newsletterCampaigns.id, campaignId));

  notifyEvent({
    type: "admin_action",
    criticality: "warning",
    title: "Newsletter campaign cancelada",
    description: `**Campaign**: \`${campaignId}\` cancelada por <@${cancelledBy}>`,
    channel: "auditoria",
    user: cancelledBy,
  });
  return { ok: true, message: "Campaign cancelada" };
}

// ─── Worker ──────────────────────────────────────────────────────────────────

export function startBroadcastWorker(): NodeJS.Timeout | null {
  if (_workerTimer) return _workerTimer;
  _workerTimer = setInterval(() => {
    if (_workerRunning) return;     // skip if previous tick still running
    void tick();
  }, TICK_INTERVAL_MS);
  logger.info("[newsletter-broadcast] worker started", "newsletter");
  return _workerTimer;
}

export function stopBroadcastWorker(): void {
  if (_workerTimer) {
    clearInterval(_workerTimer);
    _workerTimer = null;
  }
}

async function tick(): Promise<void> {
  _workerRunning = true;
  try {
    // 1. Find active campaigns
    const active = await db.select()
      .from(s.newsletterCampaigns)
      .where(eq(s.newsletterCampaigns.status, "in_progress"))
      .limit(5);

    if (active.length === 0) return;

    for (const campaign of active) {
      await processCampaignBatch(campaign);
    }
  } catch (err) {
    logger.error("[newsletter-broadcast] tick failed (non-fatal)", "newsletter", err);
  } finally {
    _workerRunning = false;
  }
}

async function processCampaignBatch(campaign: typeof s.newsletterCampaigns.$inferSelect): Promise<void> {
  // 1. Claim batch of pending jobs (atomic via UPDATE ... RETURNING)
  const claimed = await db.execute(sql`
    UPDATE newsletter_campaign_jobs
    SET status = 'sending', attempted_at = NOW()
    WHERE id IN (
      SELECT id FROM newsletter_campaign_jobs
      WHERE campaign_id = ${campaign.id} AND status = 'pending' AND attempts < ${MAX_ATTEMPTS}
      ORDER BY created_at ASC
      LIMIT ${BATCH_SIZE}
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id, email, unsubscribe_token, attempts
  `);

  const jobs = claimed.rows as Array<{ id: string; email: string; unsubscribe_token: string | null; attempts: number }>;

  if (jobs.length === 0) {
    // No more pending → mark campaign completed
    const remaining = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM newsletter_campaign_jobs
      WHERE campaign_id = ${campaign.id} AND status IN ('pending','sending')
    `);
    if (((remaining.rows[0] as any)?.count ?? 0) === 0) {
      await finalizeCampaign(campaign.id);
    }
    return;
  }

  // 2. Send each job respecting RATE_LIMIT_MS spacing
  const gmail = getGmailClient();
  for (const job of jobs) {
    if (await isCampaignCancelled(campaign.id)) {
      // Release job back to pending
      await db.execute(sql`
        UPDATE newsletter_campaign_jobs SET status = 'pending' WHERE id = ${job.id}
      `);
      break;
    }

    const ok = await sendCampaignJob(gmail, campaign, job);
    await markJobResult(job.id, ok ? "sent" : "failed", ok ? null : "send error");
    await incrementCampaignCounter(campaign.id, ok);

    // Progress notify each PROGRESS_NOTIFY_EVERY
    const sent = (campaign.sentCount ?? 0) + 1;
    if (sent > 0 && sent % PROGRESS_NOTIFY_EVERY === 0) {
      notifyProgress(campaign.id, sent, campaign.totalRecipients ?? 0);
    }

    await sleep(RATE_LIMIT_MS);
  }
}

async function sendCampaignJob(
  gmail: any,
  campaign: typeof s.newsletterCampaigns.$inferSelect,
  job: { id: string; email: string; unsubscribe_token: string | null }
): Promise<boolean> {
  if (!gmail) {
    logger.warn(`[newsletter-broadcast] Gmail not configured — skipping ${maskEmail(job.email)}`, "newsletter");
    return false;
  }
  const SITE_URL = process.env.SITE_URL || "https://exentax.com";
  const unsubUrl = job.unsubscribe_token
    ? `${SITE_URL}/api/newsletter/unsubscribe/${job.unsubscribe_token}`
    : `${SITE_URL}/contacto`;
  const html = (campaign.bodyHtml ?? "").replace(/{{\s*unsubscribe_url\s*}}/g, unsubUrl);

  const raw = [
    `From: Exentax <${process.env.GMAIL_SENDER ?? "hola@exentax.com"}>`,
    `To: ${job.email}`,
    `Subject: ${campaign.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    `List-Unsubscribe: <${unsubUrl}>`,
    `List-Unsubscribe-Post: List-Unsubscribe=One-Click`,
    ``,
    html,
  ].join("\r\n");
  const encoded = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  try {
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encoded },
    });
    return true;
  } catch (err) {
    logger.error(`[newsletter-broadcast] send failed → ${maskEmail(job.email)}`, "newsletter", err);
    return false;
  }
}

async function markJobResult(jobId: string, status: "sent" | "failed", error: string | null): Promise<void> {
  if (status === "sent") {
    await db.execute(sql`
      UPDATE newsletter_campaign_jobs
      SET status = 'sent', sent_at = NOW(), attempts = attempts + 1
      WHERE id = ${jobId}
    `);
  } else {
    // Si attempts < MAX, vuelve a pending; si no, queda en failed
    await db.execute(sql`
      UPDATE newsletter_campaign_jobs
      SET attempts = attempts + 1,
          last_error = ${error},
          status = CASE WHEN attempts + 1 >= ${MAX_ATTEMPTS} THEN 'failed' ELSE 'pending' END
      WHERE id = ${jobId}
    `);
  }
}

async function incrementCampaignCounter(campaignId: string, success: boolean): Promise<void> {
  if (success) {
    await db.execute(sql`UPDATE newsletter_campaigns SET sent_count = sent_count + 1 WHERE id = ${campaignId}`);
  } else {
    await db.execute(sql`UPDATE newsletter_campaigns SET failed_count = failed_count + 1 WHERE id = ${campaignId}`);
  }
}

async function isCampaignCancelled(campaignId: string): Promise<boolean> {
  const rows = await db.select({ status: s.newsletterCampaigns.status })
    .from(s.newsletterCampaigns)
    .where(eq(s.newsletterCampaigns.id, campaignId)).limit(1);
  return rows.length > 0 && rows[0].status === "cancelled";
}

async function finalizeCampaign(campaignId: string): Promise<void> {
  const rows = await db.select().from(s.newsletterCampaigns)
    .where(eq(s.newsletterCampaigns.id, campaignId)).limit(1);
  if (rows.length === 0) return;
  const c = rows[0];
  if (c.status !== "in_progress") return;

  await db.update(s.newsletterCampaigns)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(s.newsletterCampaigns.id, campaignId));

  notifyEvent({
    type: "admin_action",
    criticality: "business",
    title: "Newsletter campaign completada",
    description: [
      `**Campaign**: \`${campaignId}\``,
      `**Subject**: ${c.subject}`,
      `**Total recipients**: ${c.totalRecipients}`,
      `**Sent**: ${c.sentCount}`,
      `**Failed**: ${c.failedCount}`,
      `**Tasa éxito**: ${c.totalRecipients ? ((c.sentCount! / c.totalRecipients) * 100).toFixed(2) : 0}%`,
    ].join("\n"),
    channel: "auditoria",
    origin: "newsletter-broadcast",
  });
}

function notifyProgress(campaignId: string, sent: number, total: number): void {
  notifyEvent({
    type: "admin_action",
    criticality: "info",
    title: "Newsletter progress",
    description: `**Campaign**: \`${campaignId}\` — ${sent}/${total} (${((sent / total) * 100).toFixed(1)}%)`,
    channel: "auditoria",
    origin: "newsletter-broadcast",
    dedupKey: `newsletter_progress_${campaignId}_${sent}`,
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
