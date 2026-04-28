#!/usr/bin/env node
/**
 * audit-bundle-diff-notify-discord.mjs (Task #50)
 *
 * Publica en Discord el delta del bundle calculado por
 * `audit-bundle-diff.mjs`, para que una regresión >5% en cualquier chunk
 * se vea sin abrir el JSON. Reutiliza el mismo bot y canal que las
 * demás auditorías (`auditoria-ci-notify-discord.mjs`).
 *
 * ─── POLÍTICA DE BRAND DISCORD (Exentax) ───────────────────────────
 *  1. Sin emojis en títulos / descripciones / fields.
 *  2. Solo dos colores admitidos en embeds:
 *       - EXENTAX_NEON (0x00E510) — informativo / éxito.
 *       - EXENTAX_RED  (0xE53935) — regresión / alerta.
 *  3. Estructura: title + description + fields [Repo, Branch, Commit,
 *     Total, Entry-index] + footer "Exentax · CI · bundle-audit"
 *     + timestamp + url al run.
 *
 * Variables de entorno requeridas:
 *   DISCORD_BOT_TOKEN          — token del bot Exentax (mismo de la app).
 *   DISCORD_CHANNEL_ERRORES    — ID del canal #exentax-errores.
 *
 * Variables de entorno opcionales (proporcionadas por GitHub Actions):
 *   GITHUB_RUN_URL, GITHUB_SHA, GITHUB_REPOSITORY, GITHUB_REF.
 *   BUNDLE_DIFF_JSON           — ruta al JSON producido por
 *                                `audit-bundle-diff.mjs --json`.
 *                                Por defecto: docs/auditoria-2026-04/bundle-diff.json
 *   BUNDLE_DIFF_FORCE          — "1" para publicar incluso cuando no hay
 *                                regresión (debug). Por defecto solo se
 *                                publica si `pass === false`.
 *
 * Si faltan token o channel, el script sale 0 sin enviar nada.
 * Si el JSON no existe o no se puede leer, sale 0 con un warning (no
 * queremos enmascarar el fallo real del job de bundle).
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const DEFAULT_DIFF_JSON = path.join(
  REPO_ROOT,
  "docs",
  "auditoria-2026-04",
  "bundle-diff.json",
);

// Paleta Exentax Discord (mantener sincronizado con
// `EXENTAX_NEON` en `exentax-web/server/discord.ts` y con
// `auditoria-ci-notify-discord.mjs`).
const EXENTAX_NEON = 0x00e510;
const EXENTAX_RED = 0xe53935;

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function fmtPct(p) {
  if (p == null || Number.isNaN(p)) return "n/a";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

function fmtKb(v) {
  return v == null ? "n/a" : `${v.toFixed(1)} KB`;
}

function describeRegression(r) {
  const label =
    r.kind === "chunk"
      ? `${r.category}/${r.base}`
      : r.kind; // "total" | "entry-index"
  return `• \`${label}\`: ${fmtKb(r.prevKb)} → ${fmtKb(r.currKb)} (${fmtPct(r.pct)})`;
}

async function postToDiscord({ token, channelId, payload }) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
      "User-Agent": "Exentax CI Bundle-Diff Notifier (https://exentax.com, 1.0)",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Discord API ${res.status} ${res.statusText}: ${truncate(body, 400)}`);
  }
  return res;
}

export async function main() {
  const token = envOrEmpty("DISCORD_BOT_TOKEN");
  const channelId = envOrEmpty("DISCORD_CHANNEL_ERRORES");
  if (!token || !channelId) {
    console.log(
      "[bundle-diff-notify] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ERRORES missing — skipping notification.",
    );
    return;
  }

  const diffPath = envOrEmpty("BUNDLE_DIFF_JSON") || DEFAULT_DIFF_JSON;
  if (!existsSync(diffPath)) {
    console.warn(`[bundle-diff-notify] No se encontró ${diffPath} — nada que publicar.`);
    return;
  }

  let diff;
  try {
    diff = JSON.parse(await readFile(diffPath, "utf8"));
  } catch (err) {
    console.warn(
      `[bundle-diff-notify] No se pudo leer ${diffPath}: ${err instanceof Error ? err.message : String(err)} — nada que publicar.`,
    );
    return;
  }

  // No comparison available yet (first commit con histórico). Salir limpio.
  if (diff.status === "empty" || diff.status === "single-entry") {
    console.log(
      `[bundle-diff-notify] Histórico sin comparativa (status=${diff.status}) — nada que publicar.`,
    );
    return;
  }

  const force = envOrEmpty("BUNDLE_DIFF_FORCE") === "1";
  const regressions = Array.isArray(diff.regressions) ? diff.regressions : [];
  const hasRegression = regressions.length > 0 || diff.pass === false;

  if (!hasRegression && !force) {
    console.log(
      "[bundle-diff-notify] Sin regresión por encima del umbral — no se publica (usa BUNDLE_DIFF_FORCE=1 para forzar).",
    );
    return;
  }

  const runUrl = envOrEmpty("GITHUB_RUN_URL");
  const sha = envOrEmpty("GITHUB_SHA");
  const repo = envOrEmpty("GITHUB_REPOSITORY");
  const ref = envOrEmpty("GITHUB_REF") || "main";
  const branch = ref.replace(/^refs\/heads\//, "");

  const threshold = diff.thresholdPct ?? 5;
  const totalPct = diff?.deltas?.totalPct;
  const entryPct = diff?.deltas?.entryIndexPct;
  const gzipPct = diff?.deltas?.gzipPct;

  const description = hasRegression
    ? [
        `Umbral: \`+${threshold}%\`. Regresiones detectadas:`,
        ...regressions.map(describeRegression),
      ].join("\n")
    : `Umbral: \`+${threshold}%\`. Sin regresiones — bundle estable respecto al commit anterior.`;

  const fields = [];
  if (repo) fields.push({ name: "Repo", value: repo, inline: true });
  if (branch) fields.push({ name: "Branch", value: branch, inline: true });
  if (sha) fields.push({ name: "Commit", value: `\`${sha.slice(0, 7)}\``, inline: true });

  const totalLine =
    diff?.previous && diff?.current
      ? `${fmtKb(diff.previous.totalKb)} → ${fmtKb(diff.current.totalKb)} (${fmtPct(totalPct)})`
      : "n/a";
  const entryLine =
    diff?.previous && diff?.current
      ? `${fmtKb(diff.previous.entryIndexKb)} → ${fmtKb(diff.current.entryIndexKb)} (${fmtPct(entryPct)})`
      : "n/a";
  fields.push({ name: "Total", value: totalLine, inline: false });
  fields.push({ name: "Entry-index", value: entryLine, inline: false });
  if (gzipPct != null) {
    fields.push({ name: "Total (gzip)", value: fmtPct(gzipPct), inline: true });
  }

  const embed = {
    title: hasRegression
      ? "Regresión de bundle detectada"
      : "Bundle estable",
    description: truncate(description, 3800),
    color: hasRegression ? EXENTAX_RED : EXENTAX_NEON,
    fields,
    footer: { text: "Exentax · CI · bundle-audit" },
    timestamp: new Date().toISOString(),
  };
  if (runUrl) embed.url = runUrl;

  const headline = hasRegression
    ? `Regresión de bundle en \`${branch}\``
    : `Bundle estable en \`${branch}\``;
  const content = runUrl ? `${headline} — ${runUrl}` : headline;

  try {
    await postToDiscord({
      token,
      channelId,
      payload: { content: truncate(content, 1900), embeds: [embed] },
    });
    console.log(
      `[bundle-diff-notify] Notification posted (${regressions.length} regression(s)).`,
    );
  } catch (err) {
    // Importante: no propagar para no enmascarar el fallo del gate.
    console.error(
      `[bundle-diff-notify] Failed to post notification: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// Solo ejecutar `main()` cuando el script se invoca directamente desde
// la CLI. Cuando lo importa el test (`audit-bundle-diff-notify-discord.test.mjs`)
// la propia suite llamará a `main()` y podrá awaitear correctamente.
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
      `[bundle-diff-notify] Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    );
    // exit 0 a propósito: no enmascarar el fallo del job principal.
  });
}
