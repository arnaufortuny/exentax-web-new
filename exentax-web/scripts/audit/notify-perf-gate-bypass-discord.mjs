#!/usr/bin/env node
/**
 * notify-perf-gate-bypass-discord.mjs (Task #23)
 *
 * Publica una alerta en Discord (canal #exentax-errores) cuando un PR
 * con label `bypass-perf-gate` se mergea a `main`, dejando rastro
 * operativo más allá del comentario en el propio PR. Reutiliza el bot,
 * el canal y la paleta del notifier de bundle-diff (Task #50) para que
 * el equipo lo reconozca como una alerta canónica de auditoría CI.
 *
 * ─── DETECCIÓN DE QUÉ GATE FUE BYPASSADO ───────────────────────────
 * Inferimos los gates a partir de los marcadores HTML que dejaron los
 * workflows de Lighthouse y de quality-pipeline al detectar el label:
 *   - `lighthouse-bypass-comment:task-20`  → Lighthouse (desktop/mobile).
 *   - `bundle-bypass-comment:task-20`      → bundle-diff regression.
 * Si ningún marcador aparece en los comentarios del PR, asumimos que
 * el label se aplicó preventivamente sin que ningún gate llegara a
 * fallar. Aún así notificamos para que el equipo tenga constancia,
 * indicándolo explícitamente en el mensaje (no esconder el evento).
 *
 * El autor del label se recupera del timeline de issue events,
 * tomando el evento `labeled` más reciente para `bypass-perf-gate`.
 *
 * ─── POLÍTICA DE BRAND DISCORD (Exentax) ───────────────────────────
 *  1. Sin emojis en title / description / fields.
 *  2. Solo dos colores admitidos: EXENTAX_NEON / EXENTAX_RED.
 *  3. Footer "Exentax · CI · perf-gate-bypass" + timestamp.
 *
 * Variables de entorno requeridas:
 *   DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ERRORES — destino Discord.
 *   GITHUB_TOKEN, GITHUB_REPOSITORY            — para llamar a la API.
 *   PR_NUMBER, PR_URL, PR_TITLE                — datos del PR.
 *
 * Variables opcionales (proporcionadas por GitHub Actions):
 *   PR_AUTHOR, PR_HEAD_SHA, PR_MERGE_SHA, GITHUB_RUN_URL.
 *
 * Si faltan token / channel (p. ej. PR de fork), exit 0 sin enviar
 * (mismo patrón que el notifier de bundle-diff). Errores de red o de
 * la API se logean como warning para no convertir un fallo de
 * notificación en un fallo de pipeline.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

// Paleta Exentax Discord (mantener sincronizado con
// `EXENTAX_NEON` en `exentax-web/server/discord.ts`,
// `audit-bundle-diff-notify-discord.mjs` y `auditoria-ci-notify-discord.mjs`).
const EXENTAX_NEON = 0x00e510;
const EXENTAX_RED = 0xe53935;

const TARGET_LABEL = "bypass-perf-gate";
// Marcadores HTML que dejan los workflows existentes al activar el
// bypass; mantener sincronizado con `.github/workflows/lighthouse.yml`
// y `.github/workflows/quality-pipeline.yml`.
const LH_BYPASS_MARKER = "<!-- lighthouse-bypass-comment:task-20 -->";
const BUNDLE_BYPASS_MARKER = "<!-- bundle-bypass-comment:task-20 -->";

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

async function ghPaginate({ token, repo, prNumber, kind }) {
  // kind: "events" | "comments"
  // Cap defensivo a 5 páginas (500 entradas) para PRs anormalmente
  // largos; en la práctica un PR suele caber en una sola página.
  const out = [];
  let page = 1;
  while (page <= 5) {
    const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/${kind}?per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent":
          "Exentax CI Perf-Gate Bypass Notifier (https://exentax.com, 1.0)",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `GitHub API ${res.status} ${res.statusText} on ${kind}: ${truncate(body, 200)}`,
      );
    }
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return out;
}

async function postToDiscord({ token, channelId, payload }) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
      "User-Agent":
        "Exentax CI Perf-Gate Bypass Notifier (https://exentax.com, 1.0)",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Discord API ${res.status} ${res.statusText}: ${truncate(body, 400)}`,
    );
  }
  return res;
}

export async function main() {
  const token = envOrEmpty("DISCORD_BOT_TOKEN");
  const channelId = envOrEmpty("DISCORD_CHANNEL_ERRORES");
  if (!token || !channelId) {
    console.log(
      "[perf-gate-bypass-notify] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ERRORES missing — skipping notification.",
    );
    return;
  }

  const ghToken = envOrEmpty("GITHUB_TOKEN");
  const repo = envOrEmpty("GITHUB_REPOSITORY");
  const prNumber = envOrEmpty("PR_NUMBER");
  const prUrl = envOrEmpty("PR_URL");
  const prTitle = envOrEmpty("PR_TITLE") || `PR #${prNumber}`;
  const prAuthor = envOrEmpty("PR_AUTHOR");
  if (!ghToken || !repo || !prNumber) {
    console.warn(
      "[perf-gate-bypass-notify] GITHUB_TOKEN / GITHUB_REPOSITORY / PR_NUMBER missing — skipping notification.",
    );
    return;
  }

  // 1) Encontrar el autor del label `bypass-perf-gate` en el timeline.
  let labelAuthor = "desconocido";
  try {
    const events = await ghPaginate({
      token: ghToken,
      repo,
      prNumber,
      kind: "events",
    });
    const labeled = [...events]
      .reverse()
      .find(
        (e) =>
          e.event === "labeled" && e.label && e.label.name === TARGET_LABEL,
      );
    if (labeled?.actor?.login) labelAuthor = labeled.actor.login;
  } catch (err) {
    console.warn(
      `[perf-gate-bypass-notify] Could not determine label author: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 2) Detectar qué gate(s) fueron bypassados leyendo los marcadores
  //    HTML de los comentarios que dejaron los workflows.
  let bypassedLighthouse = false;
  let bypassedBundle = false;
  try {
    const comments = await ghPaginate({
      token: ghToken,
      repo,
      prNumber,
      kind: "comments",
    });
    for (const c of comments) {
      const body = c?.body || "";
      if (body.includes(LH_BYPASS_MARKER)) bypassedLighthouse = true;
      if (body.includes(BUNDLE_BYPASS_MARKER)) bypassedBundle = true;
    }
  } catch (err) {
    console.warn(
      `[perf-gate-bypass-notify] Could not list PR comments: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const gates = [];
  if (bypassedLighthouse) gates.push("Lighthouse");
  if (bypassedBundle) gates.push("bundle-diff");
  const hasRealBypass = gates.length > 0;
  const gatesLabel = hasRealBypass
    ? gates.join(" + ")
    : "ninguno detectado (label preventivo)";

  const runUrl = envOrEmpty("GITHUB_RUN_URL");
  const mergeSha = envOrEmpty("PR_MERGE_SHA");

  const description = [
    `PR [#${prNumber}](${prUrl}) **${truncate(prTitle, 200)}** se mergeó a \`main\` con el label \`${TARGET_LABEL}\` aplicado.`,
    "",
    `Gate(s) bypassado(s): **${gatesLabel}**.`,
    "",
    `Label aplicado por: **@${labelAuthor}**${prAuthor ? ` · PR autor: **@${prAuthor}**` : ""}.`,
    "",
    runUrl ? `Run de notificación: ${runUrl}` : "",
    "Documentar la razón del bypass en `docs/auditoria-2026-04/RESUMEN.md` (sección \"Lighthouse\" o \"Bundle por página\" según corresponda).",
  ]
    .filter((line) => line !== "")
    .join("\n");

  const fields = [];
  if (repo) fields.push({ name: "Repo", value: repo, inline: true });
  fields.push({ name: "PR", value: `#${prNumber}`, inline: true });
  if (mergeSha)
    fields.push({
      name: "Merge",
      value: `\`${mergeSha.slice(0, 7)}\``,
      inline: true,
    });
  fields.push({ name: "Gates", value: gatesLabel, inline: false });
  fields.push({ name: "Label por", value: `@${labelAuthor}`, inline: true });
  if (prAuthor)
    fields.push({ name: "PR autor", value: `@${prAuthor}`, inline: true });

  // Color: si algún gate falló de verdad → RED; si fue preventivo → NEON.
  const embed = {
    title: hasRealBypass
      ? "Performance gate bypassed — PR mergeado"
      : "Performance gate label aplicado — PR mergeado (sin fallo)",
    description: truncate(description, 3800),
    color: hasRealBypass ? EXENTAX_RED : EXENTAX_NEON,
    fields,
    footer: { text: "Exentax · CI · perf-gate-bypass" },
    timestamp: new Date().toISOString(),
    url: prUrl || runUrl || undefined,
  };

  const headline = `Perf-gate bypass mergeado: PR #${prNumber} (${gatesLabel})`;
  const linkSuffix = prUrl ? ` — ${prUrl}` : runUrl ? ` — ${runUrl}` : "";
  const content = truncate(`${headline}${linkSuffix}`, 1900);

  try {
    await postToDiscord({
      token,
      channelId,
      payload: { content, embeds: [embed] },
    });
    console.log(
      `[perf-gate-bypass-notify] Notification posted (gates=${gatesLabel}, author=@${labelAuthor}).`,
    );
  } catch (err) {
    // Importante: no propagar para no convertir un fallo de
    // notificación en un fallo del workflow.
    console.error(
      `[perf-gate-bypass-notify] Failed to post: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// Solo ejecutar `main()` cuando el script se invoca directamente desde
// la CLI. Cuando lo importa el test, la propia suite llama a `main()`.
const isCli = (() => {
  try {
    const invoked = process.argv[1] && path.resolve(process.argv[1]);
    const here = fileURLToPath(import.meta.url);
    return invoked === here;
  } catch {
    return false;
  }
})();

if (isCli) {
  main().catch((err) => {
    console.error(
      `[perf-gate-bypass-notify] Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    );
    // exit 0 a propósito: no enmascarar el evento de merge.
  });
}
