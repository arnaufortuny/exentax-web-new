#!/usr/bin/env node
/**
 * Notifica al canal #exentax-errores cuando la auditoría diagnóstica
 * falla en CI. Usa el mismo bot que la app (Discord REST API con
 * `Authorization: Bot <TOKEN>`), no webhooks.
 *
 * ─── POLÍTICA DE BRAND DISCORD (Exentax) ───────────────────────────
 *  1. NO se permiten iconos / emojis en títulos, contenidos ni fields
 *     de los mensajes Discord. Texto plano siempre.
 *  2. SOLO dos colores admitidos en embeds:
 *       - EXENTAX_NEON (0x00E510) — éxito / informativo / brand.
 *       - EXENTAX_RED  (0xE53935) — error / alerta / fallo de gate.
 *     Cualquier otro color queda prohibido. Esta política se replica
 *     en `server/discord.ts` (que fuerza EXENTAX_NEON en todos sus
 *     embeds runtime; este script solo usa EXENTAX_RED porque vive en
 *     el camino de fallo).
 *  3. Estructura del embed: title (sin emoji) + description + fields
 *     [Repo, Branch, Commit] + footer "Exentax · CI · diagnostic-audit"
 *     + timestamp + url al run. Sin variantes ni colores condicionales.
 *
 * Variables de entorno requeridas:
 *   DISCORD_BOT_TOKEN          — token del bot Exentax (mismo de la app).
 *   DISCORD_CHANNEL_ERRORES    — ID del canal #exentax-errores.
 *
 * Variables de entorno opcionales (proporcionadas por GitHub Actions):
 *   GITHUB_RUN_URL             — URL al run que falló.
 *   GITHUB_SHA                 — commit SHA del trigger.
 *   GITHUB_REPOSITORY          — owner/repo.
 *   GITHUB_REF                 — branch (refs/heads/main).
 *
 * Si faltan token o channel, el script sale 0 sin enviar nada (no
 * queremos que la falta de credenciales rompa más el job ya fallido).
 *
 * Lee, si existe, `docs/auditoria-2026-04/calidad-global-report.json`
 * para resumir los top bloqueantes en el mensaje. Si no existe (porque
 * la auditoría falló antes de generarlo), publica un mensaje genérico
 * con el link al run.
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const REPORT_DIR = path.join(REPO_ROOT, "docs", "auditoria-2026-04");
const CALIDAD_REPORT = path.join(REPORT_DIR, "calidad-global-report.json");

// Paleta Exentax Discord (única permitida — ver header). Mantener
// sincronizado con `EXENTAX_NEON` en `exentax-web/server/discord.ts`.
const EXENTAX_NEON = 0x00e510;
const EXENTAX_RED = 0xe53935;

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

async function readTopBlockers() {
  if (!existsSync(CALIDAD_REPORT)) return [];
  try {
    const raw = await readFile(CALIDAD_REPORT, "utf8");
    const json = JSON.parse(raw);
    // El reporte usa `blockers`; aceptamos `topBlockers` también por
    // compatibilidad con generadores anteriores.
    const list = Array.isArray(json?.blockers)
      ? json.blockers
      : Array.isArray(json?.topBlockers)
        ? json.topBlockers
        : [];
    return list.slice(0, 5).map((s) => String(s));
  } catch {
    return [];
  }
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

async function postToDiscord({ token, channelId, payload }) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
      "User-Agent": "Exentax CI Audit Notifier (https://exentax.com, 1.0)",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Discord API ${res.status} ${res.statusText}: ${truncate(body, 400)}`);
  }
  return res;
}

async function main() {
  const token = envOrEmpty("DISCORD_BOT_TOKEN");
  const channelId = envOrEmpty("DISCORD_CHANNEL_ERRORES");
  if (!token || !channelId) {
    console.log("[notify-discord] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ERRORES missing — skipping notification.");
    return;
  }

  const runUrl = envOrEmpty("GITHUB_RUN_URL");
  const sha = envOrEmpty("GITHUB_SHA");
  const repo = envOrEmpty("GITHUB_REPOSITORY");
  const ref = envOrEmpty("GITHUB_REF") || "main";
  const branch = ref.replace(/^refs\/heads\//, "");

  const blockers = await readTopBlockers();
  const description =
    blockers.length > 0
      ? blockers.map((b) => `• ${truncate(b, 240)}`).join("\n")
      : "El gate de regresiones ha fallado. Revisa el run para ver los detalles y descarga el artefacto `diagnostic-audit-reports`.";

  const fields = [];
  if (repo) fields.push({ name: "Repo", value: repo, inline: true });
  if (branch) fields.push({ name: "Branch", value: branch, inline: true });
  if (sha) fields.push({ name: "Commit", value: `\`${sha.slice(0, 7)}\``, inline: true });

  const embed = {
    // Título sin emoji por política de brand Discord (ver header).
    title: "Auditoría diagnóstica fallida",
    description: truncate(description, 3800),
    // Siempre EXENTAX_RED: este script solo se ejecuta en `failure()`,
    // así que la alerta debe leerse como error aunque no hayamos podido
    // extraer la lista de bloqueantes del reporte. EXENTAX_NEON queda
    // referenciado en este archivo solo para que el contraste de la
    // política de paleta sea explícito a quien lea el código.
    color: EXENTAX_RED,
    fields,
    footer: { text: "Exentax · CI · diagnostic-audit" },
    timestamp: new Date().toISOString(),
  };
  void EXENTAX_NEON; // referenciado a propósito: ver comentario superior.
  if (runUrl) embed.url = runUrl;

  const content = runUrl ? `Auditoría diagnóstica fallida en \`${branch}\` — ${runUrl}` : `Auditoría diagnóstica fallida en \`${branch}\``;

  try {
    await postToDiscord({
      token,
      channelId,
      payload: { content: truncate(content, 1900), embeds: [embed] },
    });
    console.log("[notify-discord] Notification posted to channel.");
  } catch (err) {
    // Importante: no propagar para no enmascarar el fallo real del gate.
    console.error(`[notify-discord] Failed to post notification: ${err instanceof Error ? err.message : String(err)}`);
  }
}

main().catch((err) => {
  console.error(`[notify-discord] Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
  // exit 0 a propósito: el job ya falló por otra razón.
});
