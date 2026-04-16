/**
 * Alert delivery channels for the SEO ranking monitor.
 *
 * Supports two channels, both opt-in via env vars. When nothing is configured
 * the sender is a silent no-op so the monitor still works in local dev.
 *
 *   Channel           Env vars
 *   ----------------  -----------------------------------------------------------
 *   slack             SEO_ALERTS_CHANNEL=slack
 *                     SEO_ALERTS_SLACK_WEBHOOK_URL=https://hooks.slack.com/...
 *
 *   email (SendGrid)  SEO_ALERTS_CHANNEL=email
 *                     SENDGRID_API_KEY=SG.xxx
 *                     SEO_ALERTS_EMAIL_TO=alerts@example.com[,second@example.com]
 *                     SEO_ALERTS_EMAIL_FROM=seo-bot@example.com
 *
 * Optional:
 *   SEO_SITE_BASE_URL=https://exentax.com   (used to build per-article links)
 */

export interface RankingDrop {
  /** Human-readable article title. */
  title: string;
  /** Site-relative path or absolute URL of the article. */
  url: string;
  /** Keyword/query the article was tracked for. */
  keyword: string;
  /** Previous Google position (lower = better). null = wasn't ranking before. */
  previousPosition: number | null;
  /** Current Google position. null = fell out of top 100. */
  currentPosition: number | null;
}

export interface DigestPayload {
  generatedAt: Date;
  /** All drops detected in this run, already sorted by severity (worst first). */
  drops: RankingDrop[];
}

export interface DeliveryResult {
  channel: "slack" | "email" | "none";
  delivered: boolean;
  reason?: string;
}

const MAX_DROPS_IN_DIGEST = 10;

function severity(d: RankingDrop): number {
  const prev = d.previousPosition ?? 0;
  const curr = d.currentPosition ?? 101;
  return curr - prev;
}

export function sortDropsBySeverity(drops: RankingDrop[]): RankingDrop[] {
  return [...drops].sort((a, b) => severity(b) - severity(a));
}

function articleLink(url: string): string {
  const base = process.env.SEO_SITE_BASE_URL?.replace(/\/+$/, "") ?? "";
  if (/^https?:\/\//i.test(url)) return url;
  if (!base) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function fmtPos(p: number | null): string {
  if (p === null) return "not ranking";
  return `#${p}`;
}

export function buildPlainTextDigest(payload: DigestPayload): string {
  const top = sortDropsBySeverity(payload.drops).slice(0, MAX_DROPS_IN_DIGEST);
  const lines: string[] = [];
  lines.push(
    `SEO ranking drops detected (${payload.generatedAt.toISOString()})`,
  );
  lines.push(`Showing worst ${top.length} of ${payload.drops.length} drop(s).`);
  lines.push("");
  for (const d of top) {
    lines.push(
      `- "${d.title}" [${d.keyword}] ${fmtPos(d.previousPosition)} -> ${fmtPos(
        d.currentPosition,
      )}  ${articleLink(d.url)}`,
    );
  }
  return lines.join("\n");
}

export function buildSlackBlocks(payload: DigestPayload): {
  text: string;
  blocks: unknown[];
} {
  const top = sortDropsBySeverity(payload.drops).slice(0, MAX_DROPS_IN_DIGEST);
  const summary = `:chart_with_downwards_trend: ${payload.drops.length} SEO ranking drop(s) detected — worst ${top.length} below.`;
  const blocks: unknown[] = [
    {
      type: "section",
      text: { type: "mrkdwn", text: `*${summary}*` },
    },
    { type: "divider" },
  ];
  for (const d of top) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*<${articleLink(d.url)}|${d.title}>*\n` +
          `_${d.keyword}_  •  ${fmtPos(d.previousPosition)} → *${fmtPos(
            d.currentPosition,
          )}*`,
      },
    });
  }
  return { text: summary, blocks };
}

export function buildHtmlDigest(payload: DigestPayload): string {
  const top = sortDropsBySeverity(payload.drops).slice(0, MAX_DROPS_IN_DIGEST);
  const rows = top
    .map(
      (d) =>
        `<tr>` +
        `<td><a href="${articleLink(d.url)}">${escapeHtml(d.title)}</a></td>` +
        `<td>${escapeHtml(d.keyword)}</td>` +
        `<td>${fmtPos(d.previousPosition)}</td>` +
        `<td><strong>${fmtPos(d.currentPosition)}</strong></td>` +
        `</tr>`,
    )
    .join("");
  return (
    `<p>${payload.drops.length} SEO ranking drop(s) detected on ` +
    `${payload.generatedAt.toISOString()}. Showing worst ${top.length}.</p>` +
    `<table border="1" cellpadding="6" cellspacing="0">` +
    `<thead><tr><th>Article</th><th>Keyword</th><th>Was</th><th>Now</th></tr></thead>` +
    `<tbody>${rows}</tbody></table>`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendSlack(payload: DigestPayload): Promise<DeliveryResult> {
  const url = process.env.SEO_ALERTS_SLACK_WEBHOOK_URL;
  if (!url) {
    return {
      channel: "slack",
      delivered: false,
      reason: "SEO_ALERTS_SLACK_WEBHOOK_URL not set",
    };
  }
  const body = buildSlackBlocks(payload);
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return {
      channel: "slack",
      delivered: false,
      reason: `Slack webhook returned ${res.status}: ${await res.text()}`,
    };
  }
  return { channel: "slack", delivered: true };
}

async function sendEmail(payload: DigestPayload): Promise<DeliveryResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.SEO_ALERTS_EMAIL_TO;
  const from = process.env.SEO_ALERTS_EMAIL_FROM;
  const missing: string[] = [];
  if (!apiKey) missing.push("SENDGRID_API_KEY");
  if (!to) missing.push("SEO_ALERTS_EMAIL_TO");
  if (!from) missing.push("SEO_ALERTS_EMAIL_FROM");
  if (missing.length) {
    return {
      channel: "email",
      delivered: false,
      reason: `missing env: ${missing.join(", ")}`,
    };
  }
  const recipients = to!
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((email) => ({ email }));
  const subject = `[SEO] ${payload.drops.length} ranking drop(s) detected`;
  const body = {
    personalizations: [{ to: recipients, subject }],
    from: { email: from! },
    content: [
      { type: "text/plain", value: buildPlainTextDigest(payload) },
      { type: "text/html", value: buildHtmlDigest(payload) },
    ],
  };
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 202) {
    return {
      channel: "email",
      delivered: false,
      reason: `SendGrid returned ${res.status}: ${await res.text()}`,
    };
  }
  return { channel: "email", delivered: true };
}

/**
 * Send a ranking-drop digest to whichever channel is configured.
 * Silent no-op (returns delivered: false) when nothing is configured, so the
 * surrounding monitor never breaks because alerts aren't wired up.
 */
export async function sendRankingDropDigest(
  payload: DigestPayload,
): Promise<DeliveryResult> {
  if (payload.drops.length === 0) {
    return { channel: "none", delivered: false, reason: "no drops" };
  }
  const channel = (process.env.SEO_ALERTS_CHANNEL ?? "").toLowerCase();
  if (channel === "slack") return sendSlack(payload);
  if (channel === "email") return sendEmail(payload);
  return {
    channel: "none",
    delivered: false,
    reason: "SEO_ALERTS_CHANNEL not set (expected 'slack' or 'email')",
  };
}
