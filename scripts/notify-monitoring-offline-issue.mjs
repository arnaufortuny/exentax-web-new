#!/usr/bin/env node
/**
 * notify-monitoring-offline-issue.mjs (Task #61)
 *
 * Cuando el cron `live-verification` corre en un trigger privilegiado
 * (`schedule` / `workflow_dispatch` del repo canónico) y los secrets
 * `DISCORD_BOT_TOKEN` / `DISCORD_CHANNEL_ERRORES` faltan, el notifier
 * Discord sale 0 silente por diseño (para que PRs de fork no rompan
 * CI). Sin esa señal, una rotación accidental de token deja la
 * monitorización muerta y nadie se entera.
 *
 * Este script complementa el silencio creando un único "sticky issue"
 * titulado "Live-verification monitoring is offline" usando el
 * `GITHUB_TOKEN` del workflow:
 *
 *   - Si faltan secrets   → abre el issue (o actualiza el comentario
 *                           si ya existía). Etiqueta con `monitoring`
 *                           para que sea fácil de filtrar.
 *   - Si los secrets están → cierra el issue si está abierto. Es la
 *                           "auto-resolución" cuando alguien restaura
 *                           el secret en la org.
 *   - En triggers no privilegiados (PR / push) → no hace nada (los
 *                           runs de fork no tienen permisos issues:write
 *                           ni acceso a secrets).
 *
 * El script NO falla nunca por errores HTTP de la API de Issues:
 * loggea y sale 0 — un fallo del manager no debe enmascarar el resto
 * del run.
 *
 * ─── VARIABLES DE ENTORNO ──────────────────────────────────────────
 *   Requeridas:
 *     GITHUB_TOKEN        — token con permiso `issues: write` (provisto
 *                           por el workflow).
 *     GITHUB_REPOSITORY   — "owner/repo".
 *     GITHUB_EVENT_NAME   — `schedule` / `workflow_dispatch` / etc.
 *
 *   Opcionales:
 *     GITHUB_RUN_URL              — URL al run; se incluye en el body.
 *     DISCORD_BOT_TOKEN           — para detectar ausencia.
 *     DISCORD_CHANNEL_ERRORES     — idem.
 *     GITHUB_API_URL              — base API (por defecto api.github.com).
 *     MONITORING_ISSUE_TITLE      — override del título sticky (Task #63
 *                                   reutiliza este script desde otros
 *                                   workflows con títulos distintos —
 *                                   "Auditoria CI monitoring is offline" /
 *                                   "Perf-gate monitoring is offline" —
 *                                   y los tests también lo overridean).
 *     MONITORING_ISSUE_LABEL      — override de la label (tests).
 *     MONITORING_PRIVILEGED_TRIGGERS — lista CSV de triggers que se
 *                                   consideran "privilegiados" (con
 *                                   acceso a secrets). Por defecto:
 *                                   `schedule,workflow_dispatch` (cron de
 *                                   live-verification). Task #63 lo
 *                                   sobrescribe a `push` (auditoría CI)
 *                                   o `pull_request` (perf-gate bypass)
 *                                   para que el helper considere su
 *                                   propio trigger como con acceso a
 *                                   secrets en el repo canónico.
 *     MONITORING_BODY_CONTEXT     — texto humano corto que describe qué
 *                                   notifier está afectado (Task #63 —
 *                                   p. ej. "auditoría CI" / "perf-gate
 *                                   bypass"). Se inserta en la primera
 *                                   línea del body para que el operador
 *                                   identifique de qué pipeline viene
 *                                   el sticky sin abrir el código.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  decideStickyIssueAction,
} from "./notify-live-verification-discord.mjs";

const DEFAULT_TITLE = "Live-verification monitoring is offline";
const DEFAULT_LABEL = "monitoring";

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

async function ghFetch({ apiBase, token, method, pathSuffix, body }) {
  const url = `${apiBase.replace(/\/+$/, "")}${pathSuffix}`;
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent":
        "Exentax CI Live-Verification Monitoring Issue Manager (1.0)",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GitHub API ${method} ${pathSuffix} → ${res.status} ${res.statusText}: ${truncate(text, 400)}`,
    );
  }
  // 204 No Content (e.g. setting labels) → undefined.
  if (res.status === 204) return undefined;
  return res.json();
}

/**
 * Busca el issue sticky por título exacto entre los issues abiertos del
 * repo. Devuelve `null` si no existe. Filtramos client-side por título
 * exacto porque la search API hace fuzzy matching.
 */
async function findStickyIssue({ apiBase, token, repo, title }) {
  const issues = await ghFetch({
    apiBase,
    token,
    method: "GET",
    pathSuffix: `/repos/${repo}/issues?state=open&per_page=100&sort=created&direction=desc`,
  });
  if (!Array.isArray(issues)) return null;
  return (
    issues.find((it) => it && !it.pull_request && it.title === title) || null
  );
}

function buildIssueBody({ missing, runUrl, repo, bodyContext }) {
  const lines = [];
  // `bodyContext` permite que workflows distintos (Task #63) personalicen
  // el sujeto de la primera línea sin tener que re-implementar el body
  // entero. Si no se provee, usamos el texto histórico del cron de
  // live-verification para no romper la copia existente.
  const subject = bodyContext
    ? `El notifier de Discord para **${bodyContext}**`
    : "El cron `live-verification`";
  lines.push(
    `${subject} está corriendo pero **no puede notificar a Discord** porque faltan secrets en el repo canónico.`,
  );
  lines.push("");
  lines.push("**Secrets ausentes:**");
  for (const m of missing) lines.push(`- \`${m}\``);
  lines.push("");
  lines.push(
    "Mientras este issue siga abierto, cualquier evento detectado por este pipeline pasará silencioso: el job aparecerá en rojo en la UI de Actions pero no llegará alerta a `#exentax-errores`.",
  );
  lines.push("");
  lines.push("**Cómo resolver:**");
  lines.push(
    "1. Re-genera el bot Discord o recupera el token / channel ID afectado.",
  );
  lines.push(
    "2. Actualiza los secrets en `Settings → Secrets and variables → Actions` del repo (" +
      (repo ? `\`${repo}\`` : "este repo") +
      ").",
  );
  lines.push(
    "3. El próximo run del workflow cerrará automáticamente este issue al detectar los secrets de nuevo (live-verification cada 20 min; auditoría CI en el próximo push a `main` con fallo de gate; perf-gate en el próximo merge con label `bypass-perf-gate`).",
  );
  if (runUrl) {
    lines.push("");
    lines.push(`Run que detectó la ausencia: ${runUrl}`);
  }
  lines.push("");
  lines.push(
    "_Issue sticky gestionado automáticamente por `scripts/notify-monitoring-offline-issue.mjs` (Task #61, ampliado a más notifiers en Task #63)._",
  );
  return lines.join("\n");
}

export async function manageStickyIssue({
  decision,
  apiBase,
  token,
  repo,
  title,
  label,
  runUrl,
  bodyContext,
}) {
  if (decision.action === "skip") {
    console.log(
      `[monitoring-offline-issue] ${decision.reason} — no se llama a la API.`,
    );
    return { result: "skipped" };
  }

  if (!token || !repo) {
    console.warn(
      "[monitoring-offline-issue] GITHUB_TOKEN o GITHUB_REPOSITORY ausentes — no puedo gestionar el issue sticky.",
    );
    return { result: "no-credentials" };
  }

  const existing = await findStickyIssue({ apiBase, token, repo, title });

  if (decision.action === "close-if-open") {
    if (!existing) {
      console.log(
        "[monitoring-offline-issue] Secrets OK y no hay issue sticky abierto — nada que hacer.",
      );
      return { result: "noop-already-closed" };
    }
    // Mensaje de auto-resolve: usa `bodyContext` cuando está presente
    // para que el comentario refleje qué workflow restauró los secrets
    // (auditoría CI / perf-gate / live-verification). Sin contexto
    // mantenemos el texto histórico del cron de live-verification.
    const closeSubject = bodyContext
      ? `el workflow de **${bodyContext}**`
      : "el cron `live-verification`";
    await ghFetch({
      apiBase,
      token,
      method: "POST",
      pathSuffix: `/repos/${repo}/issues/${existing.number}/comments`,
      body: {
        body: `Auto-resolución: ${closeSubject} detectó que los secrets de Discord están de nuevo presentes. Cerrando issue.${runUrl ? `\n\nRun: ${runUrl}` : ""}`,
      },
    });
    await ghFetch({
      apiBase,
      token,
      method: "PATCH",
      pathSuffix: `/repos/${repo}/issues/${existing.number}`,
      body: { state: "closed", state_reason: "completed" },
    });
    console.log(
      `[monitoring-offline-issue] Cerrado issue #${existing.number} (auto-resolve).`,
    );
    return { result: "closed", issueNumber: existing.number };
  }

  // action === "open-or-update"
  const body = buildIssueBody({
    missing: decision.missing,
    runUrl,
    repo,
    bodyContext,
  });

  if (existing) {
    await ghFetch({
      apiBase,
      token,
      method: "PATCH",
      pathSuffix: `/repos/${repo}/issues/${existing.number}`,
      body: { body },
    });
    await ghFetch({
      apiBase,
      token,
      method: "POST",
      pathSuffix: `/repos/${repo}/issues/${existing.number}/comments`,
      body: {
        body: `Sigue offline en otro run: \`${decision.missing.join(", ")}\`.${runUrl ? `\n\nRun: ${runUrl}` : ""}`,
      },
    });
    console.log(
      `[monitoring-offline-issue] Actualizado issue sticky #${existing.number}.`,
    );
    return { result: "updated", issueNumber: existing.number };
  }

  const created = await ghFetch({
    apiBase,
    token,
    method: "POST",
    pathSuffix: `/repos/${repo}/issues`,
    body: {
      title,
      body,
      labels: label ? [label] : undefined,
    },
  });
  console.log(
    `[monitoring-offline-issue] Creado issue sticky #${created?.number}.`,
  );
  return { result: "created", issueNumber: created?.number };
}

function parsePrivilegedTriggers(raw) {
  if (typeof raw !== "string") return undefined;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return list.length > 0 ? list : undefined;
}

export async function main() {
  const eventName = envOrEmpty("GITHUB_EVENT_NAME");
  const privilegedTriggers = parsePrivilegedTriggers(
    envOrEmpty("MONITORING_PRIVILEGED_TRIGGERS"),
  );
  const decision = decideStickyIssueAction({
    eventName,
    env: process.env,
    privilegedTriggers,
  });

  console.log(
    `[monitoring-offline-issue] event=${eventName || "(none)"} privileged=[${(privilegedTriggers || ["schedule", "workflow_dispatch"]).join(",")}] action=${decision.action} reason="${decision.reason}"`,
  );

  // Si estamos en trigger privilegiado y faltan secrets, escupimos un
  // `::warning::` aquí también — este script corre siempre (incluso
  // cuando el notifier Discord salió en silent porque el cron está
  // verde) y queremos que la misconfiguración sea visible en la UI de
  // Actions sin depender del estado del runner.
  const title = envOrEmpty("MONITORING_ISSUE_TITLE") || DEFAULT_TITLE;
  const bodyContext = envOrEmpty("MONITORING_BODY_CONTEXT");

  if (decision.action === "open-or-update") {
    // El title del ::warning:: refleja el sticky issue concreto para
    // que la UI de Actions agrupe por workflow (live-verification,
    // auditoría CI, perf-gate) en lugar de mezclarlos todos bajo el
    // label histórico "Live-verification monitoring is offline".
    console.warn(
      `::warning title=${title}::Faltan secrets en el repo canónico (${decision.missing.join(", ")}). El workflow sigue corriendo pero ninguna alerta de Discord llegará. Revisa la configuración de secrets.`,
    );
  }

  if (decision.action === "skip") return;

  const token = envOrEmpty("GITHUB_TOKEN");
  const repo = envOrEmpty("GITHUB_REPOSITORY");
  const apiBase = envOrEmpty("GITHUB_API_URL") || "https://api.github.com";
  const runUrl = envOrEmpty("GITHUB_RUN_URL");
  const label = envOrEmpty("MONITORING_ISSUE_LABEL") || DEFAULT_LABEL;

  try {
    await manageStickyIssue({
      decision,
      apiBase,
      token,
      repo,
      title,
      label,
      runUrl,
      bodyContext,
    });
  } catch (err) {
    // Defensivo: jamás romper el job por un fallo en la API de Issues.
    console.error(
      `[monitoring-offline-issue] No pude gestionar el issue sticky: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

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
      `[monitoring-offline-issue] Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
}
