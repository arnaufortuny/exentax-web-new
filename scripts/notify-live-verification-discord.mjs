#!/usr/bin/env node
/**
 * notify-live-verification-discord.mjs (Task #56)
 *
 * Lee el reporte markdown que produce `scripts/live-verification.sh` y,
 * cuando hay degradación o recuperación de la web pública, publica un
 * embed en el canal Discord `#exentax-errores` usando el bot Exentax
 * (mismo patrón que `exentax-web/scripts/audit/auditoria-ci-notify-discord.mjs`
 * y `notify-perf-gate-bypass-discord.mjs`).
 *
 * ─── DECISIONES ───────────────────────────────────────────────────────
 * El notifier mantiene un fichero de estado JSON pequeño persistido
 * entre ejecuciones del cron (vía actions/cache en el workflow). El
 * estado tiene la forma:
 *
 *   {
 *     "status": "ok" | "down" | "vps-not-deployed",
 *     "since":  "2026-04-29T11:00:00.000Z",
 *     "lastFailCount": <number>
 *   }
 *
 * Con eso decide la acción a tomar respecto al estado anterior:
 *
 *   prev.status   current      → acción
 *   ─────────────  ──────────── ─────────────────────────
 *   ok            ok            silent
 *   ok            down          notify-down
 *   ok            vps-…         notify-vps-not-deployed
 *   down          ok            notify-recovery (con duración)
 *   down          down          silent (anti-spam)
 *   down          vps-…         notify-state-change → vps-…
 *   vps-…         ok            notify-recovery
 *   vps-…         down          notify-down (degradación)
 *   vps-…         vps-…         silent (anti-spam — el motivo del task)
 *
 * Si NO existe estado previo (primera ejecución):
 *   - current=ok                 → silent (escribe estado y sale)
 *   - current=down|vps-…         → notify (alerta inicial)
 *
 * ─── DETECCIÓN VPS-NOT-DEPLOYED ───────────────────────────────────────
 * El task pide que cuando el VPS aún no está desplegado (todos los
 * F-1..F-3 fallan con HTTP 404) se reporte una sola alerta tipo
 * "VPS-NOT-DEPLOYED" en lugar de spammear con 9 FAILs idénticos.
 * Heurística: si `GET /api/health` y `GET /api/health/ready` aparecen
 * como FAIL con `HTTP 404` en el detalle → clasificamos como
 * `vps-not-deployed`. Es la señal canónica "no hay backend Express".
 *
 * ─── POLÍTICA DE BRAND DISCORD (Exentax) ──────────────────────────────
 *  1. Sin emojis en title / description / fields.
 *  2. Solo dos colores admitidos: EXENTAX_NEON / EXENTAX_RED.
 *  3. Footer "Exentax · CI · live-verification" + timestamp.
 *
 * ─── VARIABLES DE ENTORNO ─────────────────────────────────────────────
 *   Requeridas:
 *     DISCORD_BOT_TOKEN          — token del bot Exentax (mismo de la app).
 *     DISCORD_CHANNEL_ERRORES    — ID del canal #exentax-errores.
 *
 *   Opcionales (datos de contexto):
 *     LIVE_VERIFICATION_REPORT   — ruta al .md generado por el runner
 *                                  (default: docs/internal/live-verification-latest.md).
 *     LIVE_VERIFICATION_STATE    — ruta al fichero de estado JSON
 *                                  (default: .live-verification-state/state.json).
 *     LIVE_VERIFICATION_EXIT     — exit code del runner (string "0"|"1"|"2").
 *     LIVE_VERIFICATION_BASE_URL — base URL probada (override del valor del reporte).
 *     GITHUB_RUN_URL             — URL al run de Actions (para el embed).
 *     GITHUB_REPOSITORY          — owner/repo (para el embed).
 *
 * Si faltan token o channel, el script sale 0 sin enviar nada (no
 * queremos que la falta de credenciales rompa el cron).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Paleta Exentax Discord (mantener sincronizado con
// `EXENTAX_NEON` en `exentax-web/server/discord.ts`).
const EXENTAX_NEON = 0x00e510;
const EXENTAX_RED = 0xe53935;

const DEFAULT_REPORT_PATH = "docs/internal/live-verification-latest.md";
const DEFAULT_STATE_PATH = ".live-verification-state/state.json";

function envOrEmpty(name) {
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

/**
 * `true` cuando el evento de GitHub Actions corresponde a un trigger
 * "privilegiado" — es decir, uno con acceso a `secrets.*` en el repo
 * canónico. Coincide con la lista de triggers que configuramos en
 * `.github/workflows/live-verification.yml` (`schedule` + `workflow_dispatch`).
 *
 * En PRs de fork, `github.event_name === "pull_request"` y los secrets
 * NO están disponibles, por lo que la ausencia de token es esperada y
 * NO debe abrir issue.
 */
export function isPrivilegedTrigger(eventName) {
  return eventName === "schedule" || eventName === "workflow_dispatch";
}

/**
 * Devuelve la lista (potencialmente vacía) de variables de entorno
 * Discord que faltan para que el notifier pueda postear. Se considera
 * "ausente" tanto si la variable no existe como si existe pero está
 * vacía / sólo tiene whitespace (caso típico cuando se rota un secret
 * sin actualizar el valor en la org).
 */
export function secretsMissing(env) {
  const missing = [];
  const token =
    typeof env?.DISCORD_BOT_TOKEN === "string"
      ? env.DISCORD_BOT_TOKEN.trim()
      : "";
  const channel =
    typeof env?.DISCORD_CHANNEL_ERRORES === "string"
      ? env.DISCORD_CHANNEL_ERRORES.trim()
      : "";
  if (!token) missing.push("DISCORD_BOT_TOKEN");
  if (!channel) missing.push("DISCORD_CHANNEL_ERRORES");
  return missing;
}

/**
 * Decide qué hacer con el "sticky issue" de monitorización offline en
 * función del trigger del workflow y la presencia de los secrets de
 * Discord. Devuelve:
 *
 *   - `{ action: "skip" }`            — trigger no privilegiado (PR/push):
 *                                       no se evalúa nada, el run en fork
 *                                       no tiene acceso a secrets y por
 *                                       diseño el notifier sale 0 silente.
 *   - `{ action: "open-or-update" }`  — trigger privilegiado (schedule /
 *                                       workflow_dispatch) y faltan uno o
 *                                       más secrets: hay que abrir o
 *                                       actualizar el issue sticky.
 *   - `{ action: "close-if-open" }`   — trigger privilegiado y los secrets
 *                                       están presentes: si hay un issue
 *                                       sticky abierto se cierra (auto-
 *                                       resolve cuando el operador
 *                                       restaura el secret).
 *
 * Esta función es pura y por eso vive en este módulo: los tests cubren
 * la rama "secrets ausentes en schedule" sin tener que tocar la red.
 */
export function decideStickyIssueAction({ eventName, env }) {
  if (!isPrivilegedTrigger(eventName)) {
    return {
      action: "skip",
      reason:
        "Trigger no privilegiado (pull_request / push). Los runs de fork no tienen acceso a secrets — silencio esperado.",
      missing: [],
    };
  }
  const missing = secretsMissing(env || {});
  if (missing.length === 0) {
    return {
      action: "close-if-open",
      reason:
        "Secrets de Discord presentes — si existe un sticky issue abierto se cierra automáticamente.",
      missing: [],
    };
  }
  return {
    action: "open-or-update",
    reason: `Faltan secrets en el repo canónico: ${missing.join(", ")}. La cron sigue verde pero las alertas Discord no llegan.`,
    missing,
  };
}

function truncate(s, max) {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

/**
 * Parsea el reporte markdown que escribe `scripts/live-verification.sh`.
 * Devuelve PASS/FAIL/SKIP, baseURL y la lista completa de filas FAIL
 * con label + detail (ya sin pipes escapados).
 */
export function parseReport(text) {
  const out = {
    baseUrl: "",
    pass: 0,
    fail: 0,
    skip: 0,
    total: 0,
    fails: [],
  };
  if (typeof text !== "string" || text.length === 0) return out;

  const baseMatch = text.match(/\*\*Base URL\*\*:\s*`([^`]+)`/);
  if (baseMatch) out.baseUrl = baseMatch[1];

  const resultMatch = text.match(
    /\*\*Result\*\*:\s*PASS=(\d+)\s*·\s*FAIL=(\d+)\s*·\s*SKIP=(\d+)\s*·\s*TOTAL=(\d+)/,
  );
  if (resultMatch) {
    out.pass = Number(resultMatch[1]);
    out.fail = Number(resultMatch[2]);
    out.skip = Number(resultMatch[3]);
    out.total = Number(resultMatch[4]);
  }

  // Filas: `| FAIL | label | detail |`. Aceptamos pipes literales
  // dentro de label/detail si vienen escapados como `\|` (tal como los
  // emite el runner vía `sed 's/|/\\|/g'`).
  const cell = "(?:\\\\\\||[^|])";
  const rowRe = new RegExp(
    `^\\|\\s*(PASS|FAIL|SKIP)\\s*\\|\\s*(${cell}+?)\\s*\\|\\s*(${cell}*?)\\s*\\|\\s*$`,
    "gm",
  );
  let m;
  while ((m = rowRe.exec(text)) !== null) {
    const status = m[1];
    if (status !== "FAIL") continue;
    const label = m[2].trim().replace(/\\\|/g, "|");
    // El runner escapa pipes literales como `\|`; deshacer.
    const detail = m[3].trim().replace(/\\\|/g, "|");
    out.fails.push({ label, detail });
  }

  return out;
}

/**
 * Clasifica el resultado actual del runner en uno de tres estados:
 *   - "ok"               → todo verde (FAIL=0).
 *   - "vps-not-deployed" → caso especial: no hay backend (F-1 health/ready
 *                          devuelve 404).
 *   - "down"             → cualquier otro escenario con FAIL>0.
 *
 * También devuelve `reason` con una descripción legible para humanos.
 */
export function classifyIncident(parsed) {
  if (!parsed || parsed.fail === 0) {
    return { status: "ok", reason: "Todos los chequeos automatizables PASS." };
  }

  // Heurística VPS-NOT-DEPLOYED: si los dos endpoints de salud devuelven
  // 404, no hay backend Express escuchando. El task pide notificar una
  // sola alerta en este caso en lugar de spammear con los 9 FAILs.
  const healthFail = parsed.fails.find((f) =>
    /GET \/api\/health\b/.test(f.label),
  );
  const readyFail = parsed.fails.find((f) =>
    /GET \/api\/health\/ready/.test(f.label),
  );
  const has404 = (f) => f && /HTTP\s+404\b/.test(f.detail);
  if (has404(healthFail) && has404(readyFail)) {
    return {
      status: "vps-not-deployed",
      reason:
        "Backend Express no responde: /api/health y /api/health/ready devuelven 404. El VPS aún no está desplegado (DNS apunta a un mirror estático).",
    };
  }

  return {
    status: "down",
    reason: `${parsed.fail} chequeo(s) FAIL en F-1..F-9.`,
  };
}

/**
 * Decide qué hacer con la transición prev → current.
 * Devuelve `{ action, since, durationMs }`:
 *   - action: 'silent' | 'notify-down' | 'notify-vps-not-deployed' | 'notify-recovery'
 *   - since:  ISO timestamp del inicio del estado actual (para persistir).
 *   - durationMs: duración del incidente (sólo para notify-recovery).
 */
export function decideAction(prev, currentStatus, nowIso) {
  const now = nowIso || new Date().toISOString();
  const prevStatus = prev?.status || null;
  const prevSince = prev?.since || null;

  // Sin estado previo: primera ejecución del cron.
  if (!prevStatus) {
    if (currentStatus === "ok") {
      return { action: "silent", since: now, durationMs: 0 };
    }
    return {
      action:
        currentStatus === "vps-not-deployed"
          ? "notify-vps-not-deployed"
          : "notify-down",
      since: now,
      durationMs: 0,
    };
  }

  // Mismo estado que antes → silent (anti-spam). El task dice
  // explícitamente: "Workflow no genera ruido cuando el VPS aún no está
  // desplegado".
  if (prevStatus === currentStatus) {
    return { action: "silent", since: prevSince || now, durationMs: 0 };
  }

  // Transición a OK desde cualquier estado de fallo → recuperación.
  if (currentStatus === "ok") {
    const start = prevSince ? Date.parse(prevSince) : NaN;
    const end = Date.parse(now);
    const durationMs = Number.isFinite(start) && Number.isFinite(end)
      ? Math.max(0, end - start)
      : 0;
    return { action: "notify-recovery", since: now, durationMs };
  }

  // Transición a vps-not-deployed desde down (o viceversa) → notificar
  // el cambio de naturaleza del incidente y reiniciar el contador.
  if (currentStatus === "vps-not-deployed") {
    return {
      action: "notify-vps-not-deployed",
      since: now,
      durationMs: 0,
    };
  }
  return { action: "notify-down", since: now, durationMs: 0 };
}

/** Formatea ms → "2 h 13 min", "47 s", etc. */
export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return "0 s";
  const totalSec = Math.round(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const parts = [];
  if (days) parts.push(`${days} d`);
  if (hours) parts.push(`${hours} h`);
  if (mins) parts.push(`${mins} min`);
  if (!days && !hours && !mins) parts.push(`${secs} s`);
  return parts.join(" ");
}

/**
 * Construye el embed Discord para una transición. La política de brand
 * exige sin emojis y solo EXENTAX_RED / EXENTAX_NEON (header del fichero).
 */
export function buildEmbed({
  action,
  parsed,
  classification,
  since,
  durationMs,
  baseUrl,
  runUrl,
  repo,
}) {
  const url = baseUrl || parsed.baseUrl || "(desconocida)";
  const fields = [];
  fields.push({ name: "Base URL", value: `\`${url}\``, inline: false });
  fields.push({
    name: "Resultado",
    value: `PASS=${parsed.pass} · FAIL=${parsed.fail} · SKIP=${parsed.skip} · TOTAL=${parsed.total}`,
    inline: false,
  });
  if (repo) fields.push({ name: "Repo", value: repo, inline: true });
  if (runUrl) fields.push({ name: "Run", value: runUrl, inline: true });

  let title;
  let color;
  let description;
  if (action === "notify-recovery") {
    title = "Web pública RECUPERADA";
    color = EXENTAX_NEON;
    description = [
      `La verificación periódica de \`${url}\` vuelve a estar verde.`,
      "",
      `Duración del incidente: **${formatDuration(durationMs)}**.`,
    ].join("\n");
    if (since) {
      fields.push({
        name: "Inicio del incidente",
        value: since,
        inline: false,
      });
    }
  } else if (action === "notify-vps-not-deployed") {
    title = "Web pública: VPS no desplegado";
    color = EXENTAX_RED;
    description = [
      `La verificación periódica de \`${url}\` detectó que **no hay backend Express respondiendo** (\`/api/health\` y \`/api/health/ready\` devuelven 404).`,
      "",
      "El runner agrupa este escenario en una única alerta para no spammear con los 9 FAILs derivados. La siguiente notificación llegará sólo cuando cambie el estado (recuperación o degradación a otro tipo de fallo).",
      "",
      "Pasos para destrabar: ver `docs/internal/LIVE-VERIFICATION-2026-04-29.md §5` (provisión Hostinger VPS, DNS, secrets, deploy + nginx).",
    ].join("\n");
  } else {
    title = "Web pública degradada";
    color = EXENTAX_RED;
    const top = parsed.fails.slice(0, 5);
    const failsBlock =
      top.length > 0
        ? top
            .map(
              (f) =>
                `• **${truncate(f.label, 120)}** — ${truncate(f.detail || "(sin detalle)", 200)}`,
            )
            .join("\n")
        : "(no se pudieron extraer filas FAIL del reporte)";
    description = [
      `La verificación periódica de \`${url}\` reporta **${parsed.fail} FAIL** sobre ${parsed.total} chequeos.`,
      "",
      "Top FAILs:",
      failsBlock,
      "",
      "Detalle completo: ver el artefacto `live-verification-report` del run.",
    ].join("\n");
  }

  return {
    title,
    description: truncate(description, 3800),
    color,
    fields,
    footer: { text: "Exentax · CI · live-verification" },
    timestamp: new Date().toISOString(),
    url: runUrl || undefined,
  };
}

async function postToDiscord({ token, channelId, payload }) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
      "User-Agent":
        "Exentax CI Live-Verification Notifier (https://exentax.com, 1.0)",
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

async function readState(statePath) {
  if (!existsSync(statePath)) return null;
  try {
    const raw = await readFile(statePath, "utf8");
    const json = JSON.parse(raw);
    if (
      json &&
      typeof json === "object" &&
      typeof json.status === "string" &&
      ["ok", "down", "vps-not-deployed"].includes(json.status)
    ) {
      return json;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeState(statePath, state) {
  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

export async function main() {
  const token = envOrEmpty("DISCORD_BOT_TOKEN");
  const channelId = envOrEmpty("DISCORD_CHANNEL_ERRORES");
  const reportPath = envOrEmpty("LIVE_VERIFICATION_REPORT") || DEFAULT_REPORT_PATH;
  const statePath = envOrEmpty("LIVE_VERIFICATION_STATE") || DEFAULT_STATE_PATH;
  const baseUrlOverride = envOrEmpty("LIVE_VERIFICATION_BASE_URL");
  const runUrl = envOrEmpty("GITHUB_RUN_URL");
  const repo = envOrEmpty("GITHUB_REPOSITORY");

  // Si el reporte no existe o no se puede parsear, caemos al exit code
  // del runner (LIVE_VERIFICATION_EXIT) para no dejar el cron mudo en
  // ese fallback. Tratamos exit != 0 como "down genérico" sin lista de
  // FAILs para que la alerta llegue igual.
  const exitRaw = envOrEmpty("LIVE_VERIFICATION_EXIT");
  const exitCode = exitRaw === "" ? null : Number(exitRaw);
  let parsed;
  let usedFallback = false;
  if (existsSync(reportPath)) {
    const text = await readFile(reportPath, "utf8");
    parsed = parseReport(text);
    // El runner siempre escribe el bloque "**Result**: PASS=…"; si
    // total=0 después de parsear es señal de que el reporte vino
    // truncado o vacío y no podemos confiar en sus contadores.
    if (parsed.total === 0 && exitCode !== null && exitCode !== 0) {
      usedFallback = true;
    }
  } else {
    console.warn(
      `[live-verification-notify] Report not found at ${reportPath} — falling back to exit code.`,
    );
    parsed = { baseUrl: "", pass: 0, fail: 0, skip: 0, total: 0, fails: [] };
    usedFallback = true;
  }

  if (usedFallback && exitCode !== null && exitCode !== 0) {
    // Sintetizar un FAIL genérico para que classifyIncident → "down"
    // y el embed lleve un mensaje útil indicando que el reporte está
    // ausente.
    parsed.fail = parsed.fail || 1;
    parsed.total = parsed.total || 1;
    parsed.fails.push({
      label: "Runner sin reporte legible",
      detail: `live-verification.sh salió con exit ${exitCode} y no dejó un reporte parseable en ${reportPath}.`,
    });
  }

  if (baseUrlOverride) parsed.baseUrl = baseUrlOverride;
  const classification = classifyIncident(parsed);
  const prev = await readState(statePath);
  const decision = decideAction(prev, classification.status);

  console.log(
    `[live-verification-notify] prev=${prev?.status || "(none)"} current=${classification.status} action=${decision.action} pass=${parsed.pass} fail=${parsed.fail} skip=${parsed.skip}`,
  );

  // Persistir el nuevo estado siempre (incluso en silent), para que el
  // próximo cron tenga referencia.
  await writeState(statePath, {
    status: classification.status,
    since: decision.since,
    lastFailCount: parsed.fail,
  });

  if (decision.action === "silent") return;

  if (!token || !channelId) {
    // Si el trigger es privilegiado (schedule / workflow_dispatch) y los
    // secrets faltan, gritamos en el log con `::warning::` para que la
    // misconfiguración sea visible en la UI de Actions. La rama
    // "abrir / cerrar issue sticky" se materializa en
    // `notify-monitoring-offline-issue.mjs` (paso aparte del workflow,
    // que tiene `permissions: issues: write`).
    const eventName = envOrEmpty("GITHUB_EVENT_NAME");
    if (isPrivilegedTrigger(eventName)) {
      const missing = secretsMissing(process.env);
      console.warn(
        `::warning title=Live-verification monitoring is offline::Faltan secrets en el repo canónico (${missing.join(", ")}). El cron sigue corriendo pero ninguna alerta de Discord llegará. Revisa la configuración de secrets.`,
      );
    } else {
      console.log(
        "[live-verification-notify] DISCORD_BOT_TOKEN or DISCORD_CHANNEL_ERRORES missing — skipping notification.",
      );
    }
    return;
  }

  const embed = buildEmbed({
    action: decision.action,
    parsed,
    classification,
    since: prev?.since || decision.since,
    durationMs: decision.durationMs,
    baseUrl: baseUrlOverride,
    runUrl,
    repo,
  });

  const url = baseUrlOverride || parsed.baseUrl || "(desconocida)";
  let headline;
  if (decision.action === "notify-recovery") {
    headline = `Web pública RECUPERADA: ${url} (incidente ${formatDuration(decision.durationMs)})`;
  } else if (decision.action === "notify-vps-not-deployed") {
    headline = `Web pública: VPS no desplegado en ${url}`;
  } else {
    headline = `Web pública degradada: ${url} (FAIL=${parsed.fail})`;
  }
  const content = truncate(
    runUrl ? `${headline} — ${runUrl}` : headline,
    1900,
  );

  try {
    await postToDiscord({
      token,
      channelId,
      payload: { content, embeds: [embed] },
    });
    console.log(
      `[live-verification-notify] Notification posted (action=${decision.action}).`,
    );
  } catch (err) {
    // No propagar: un fallo de notificación no debe enmascarar el
    // estado del runner.
    console.error(
      `[live-verification-notify] Failed to post: ${err instanceof Error ? err.message : String(err)}`,
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
      `[live-verification-notify] Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
    );
  });
}
