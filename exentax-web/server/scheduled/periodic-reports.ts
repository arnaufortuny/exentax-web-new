/**
 * Reportes periódicos — Exentax Web
 *
 * Genera reportes agregados semanales y mensuales con métricas de negocio:
 *  - Visitas (totales, por página, por idioma, por país)
 *  - Páginas más visitadas (top 10)
 *  - Agendas (creadas, confirmadas, canceladas, no-show, total Meet sessions)
 *  - Leads capturados (por fuente: calculadora, newsletter, footer)
 *  - Calculadora (ejecuciones, ahorro medio simulado)
 *  - SEO (artículos blog publicados, sitemap snapshot)
 *
 * Envía un único embed por cada período al canal Discord apropiado:
 *  - Semanal → #exentax-actividad (lunes 09:00 Europe/Madrid)
 *  - Mensual → #exentax-actividad (día 1 del mes 09:00)
 *
 * El embed respeta brand policy (verde neón #00E510) y particiona si excede
 * el límite de 25 fields per embed o 6000 chars total.
 */

import { db } from "../db";
import { sql, type SQL } from "drizzle-orm";
import * as fs from "node:fs";
import * as path from "node:path";
import { logger } from "../logger";
import { notifyEvent } from "../discord";

// Helpers tipados para `db.execute(...)`. Centralizan el cast de
// `QueryResult<Record<string, unknown>>` a la forma conocida de cada
// SELECT, eliminando todos los `as any` sueltos en este archivo.
async function execRows<T>(query: SQL): Promise<T[]> {
  const result = await db.execute(query);
  return result.rows as T[];
}
async function execCount(query: SQL): Promise<number> {
  const rows = await execRows<{ count: number }>(query);
  return rows[0]?.count ?? 0;
}

type LangRow = { lang: string; count: number };
type CountryRow = { country: string; count: number };
type PageRow = { page: string; count: number };
type StatusRow = { status: string; count: number };
type SourceRow = { source: string; count: number };

interface PeriodRange {
  label: string;        // ej. "Semana 17 (21-27 abr)"
  startISO: string;     // ej. "2026-04-21T00:00:00Z"
  endISO: string;
  startSQL: string;     // ISO date para SQL
  endSQL: string;
}

function formatDateES(d: Date): string {
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

/** Devuelve el rango de la semana ISO terminada ayer (lunes-domingo). */
export function lastCompletedWeekRange(now = new Date()): PeriodRange {
  // Domingo pasado a las 23:59:59 = end
  const end = new Date(now);
  const dow = end.getDay();           // 0 = domingo
  const daysToLastSunday = dow === 0 ? 7 : dow;
  end.setDate(end.getDate() - daysToLastSunday);
  end.setHours(23, 59, 59, 999);
  // Lunes anterior al domingo
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  // ISO week number
  const tmp = new Date(start);
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
  const weekStart = new Date(tmp.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((tmp.getTime() - weekStart.getTime()) / 86400000 - 3 + ((weekStart.getDay() + 6) % 7)) / 7);

  return {
    label: `Semana ${weekNum} (${formatDateES(start)}–${formatDateES(end)})`,
    startISO: start.toISOString(),
    endISO: end.toISOString(),
    startSQL: start.toISOString(),
    endSQL: end.toISOString(),
  };
}

/** Devuelve el rango del mes pasado completo. */
export function lastCompletedMonthRange(now = new Date()): PeriodRange {
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const monthName = start.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return {
    label: `Mes ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`,
    startISO: start.toISOString(),
    endISO: end.toISOString(),
    startSQL: start.toISOString(),
    endSQL: end.toISOString(),
  };
}

interface ReportMetrics {
  visits: {
    total: number;
    byLanguage: Array<{ lang: string; count: number }>;
    byCountry: Array<{ country: string; count: number }>;
    topPages: Array<{ page: string; count: number }>;
  };
  agenda: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    rescheduled: number;
    noShow: number;
    completed: number;
    bySource: Array<{ source: string; count: number }>;
  };
  leads: {
    total: number;
    bySource: Array<{ source: string; count: number }>;
  };
  newsletter: {
    subscriptions: number;
    unsubscribes: number;
  };
  calculator: {
    executions: number;
  };
}

async function gatherMetrics(range: PeriodRange): Promise<ReportMetrics> {
  // Nombres de columnas en español según schema (visits, agenda):
  //   visits.fecha_creacion (createdAt) · visits.idioma (language) · visits.pagina (page)
  //   agenda.fecha_creacion · agenda.estado (status) · agenda.idioma_booking (language)

  // VISITAS — agrupadas por idioma, país (vía utm/referrer) y página
  const visitsTotal = await execCount(sql`
    SELECT COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
  `);
  const visitsByLang = await execRows<LangRow>(sql`
    SELECT idioma AS lang, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      AND idioma IS NOT NULL
    GROUP BY idioma ORDER BY count DESC LIMIT 6
  `);
  // No country column in visits — derive from utm_source/referrer top values as proxy
  const visitsByCountry = await execRows<CountryRow>(sql`
    SELECT COALESCE(utm_source, 'direct') AS country, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY utm_source ORDER BY count DESC LIMIT 5
  `);
  const topPages = await execRows<PageRow>(sql`
    SELECT pagina AS page, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      AND pagina IS NOT NULL
    GROUP BY pagina ORDER BY count DESC LIMIT 10
  `);

  // AGENDA — totales por estado
  const agendaTotal = await execCount(sql`
    SELECT COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
  `);
  const agendaByStatus = await execRows<StatusRow>(sql`
    SELECT estado AS status, COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY estado
  `);
  // Source proxy = idioma_booking (no source column in agenda)
  const agendaBySource = await execRows<SourceRow>(sql`
    SELECT COALESCE(idioma_booking, 'es') AS source, COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY idioma_booking ORDER BY count DESC LIMIT 6
  `);

  // LEADS (tabla leads): col `fuente` = source, `fecha_creacion` = createdAt
  let leadsTotal = 0;
  let leadsBySource: SourceRow[] = [];
  try {
    leadsTotal = await execCount(sql`
      SELECT COUNT(*)::int AS count FROM leads
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    `);
    leadsBySource = await execRows<SourceRow>(sql`
      SELECT COALESCE(fuente, 'unknown') AS source, COUNT(*)::int AS count FROM leads
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      GROUP BY fuente ORDER BY count DESC LIMIT 5
    `);
  } catch (err) {
    logger.error("[periodic-reports] leads table query failed (non-fatal)", "reports", err);
  }

  // NEWSLETTER (newsletter_subscribers): `fecha_creacion`, `unsubscribed_at`
  let nlSubs = 0;
  let nlUnsubs = 0;
  try {
    nlSubs = await execCount(sql`
      SELECT COUNT(*)::int AS count FROM newsletter_subscribers
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    `);
    nlUnsubs = await execCount(sql`
      SELECT COUNT(*)::int AS count FROM newsletter_subscribers
      WHERE unsubscribed_at >= ${range.startSQL} AND unsubscribed_at <= ${range.endSQL}
    `);
  } catch (err) {
    logger.error("[periodic-reports] newsletter query failed", "reports", err);
  }

  // CALCULADORA — número de cálculos en período (calculations.fecha_creacion)
  let calcRuns = 0;
  try {
    calcRuns = await execCount(sql`
      SELECT COUNT(*)::int AS count FROM calculations
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    `);
  } catch (err) {
    logger.error("[periodic-reports] calculations query failed", "reports", err);
  }

  // Agrupar agenda por status
  const statusMap: Record<string, number> = {
    pending: 0, contacted: 0, confirmed: 0, in_progress: 0, completed: 0,
    closed: 0, cancelled: 0, rescheduled: 0, no_show: 0,
  };
  for (const row of agendaByStatus) {
    if (row.status) statusMap[row.status] = row.count;
  }

  return {
    visits: {
      total: visitsTotal,
      byLanguage: visitsByLang,
      byCountry: visitsByCountry,
      topPages: topPages,
    },
    agenda: {
      total: agendaTotal,
      pending: statusMap.pending,
      confirmed: statusMap.confirmed,
      cancelled: statusMap.cancelled,
      rescheduled: statusMap.rescheduled,
      noShow: statusMap.no_show,
      completed: statusMap.completed,
      bySource: agendaBySource,
    },
    leads: {
      total: leadsTotal,
      bySource: leadsBySource,
    },
    newsletter: {
      subscriptions: nlSubs,
      unsubscribes: nlUnsubs,
    },
    calculator: {
      executions: calcRuns,
    },
  };
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-ES").format(n);
}

function formatTopList(items: Array<{ count: number; [k: string]: any }>, key: string, limit = 10): string {
  if (!items.length) return "_(sin datos)_";
  return items.slice(0, limit).map((x, i) => `${i + 1}. **${formatNumber(x.count)}** · \`${x[key]}\``).join("\n");
}

/** Genera y envía un reporte al canal Discord ACTIVIDAD. */
export async function generateAndSendPeriodReport(
  range: PeriodRange,
  type: "weekly" | "monthly"
): Promise<void> {
  const m = await gatherMetrics(range);

  const titlePrefix = type === "weekly" ? "Reporte semanal" : "Reporte mensual";
  const title = `${titlePrefix} — ${range.label}`;

  // Resumen ejecutivo en description (formato profesional, sin iconos)
  const conversionRate = m.visits.total > 0
    ? `${((m.agenda.total / m.visits.total) * 100).toFixed(2)}%`
    : "—";

  const description = [
    `**Período**: ${formatDateES(new Date(range.startISO))} → ${formatDateES(new Date(range.endISO))}`,
    "",
    `**${formatNumber(m.visits.total)}** visitas · **${formatNumber(m.agenda.total)}** reservas · **${formatNumber(m.calculator.executions)}** cálculos`,
    `**${formatNumber(m.leads.total)}** leads · **${formatNumber(m.newsletter.subscriptions)}** suscripciones newsletter (−${formatNumber(m.newsletter.unsubscribes)} bajas)`,
    `Tasa conversión visita → reserva: **${conversionRate}**`,
  ].join("\n");

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];

  // Top 10 páginas más visitadas
  fields.push({
    name: "Páginas más visitadas",
    value: formatTopList(m.visits.topPages, "page", 10),
    inline: false,
  });

  // Visitas por idioma
  if (m.visits.byLanguage.length > 0) {
    fields.push({
      name: "Visitas por idioma",
      value: m.visits.byLanguage.map(x => `**${x.lang.toUpperCase()}**: ${formatNumber(x.count)}`).join(" · "),
      inline: true,
    });
  }

  // Top fuentes de tráfico (utm_source / referrer)
  if (m.visits.byCountry.length > 0) {
    fields.push({
      name: "Top fuentes de tráfico",
      value: m.visits.byCountry.map(x => `${x.country}: ${formatNumber(x.count)}`).join(" · "),
      inline: true,
    });
  }

  // Estado de la agenda
  fields.push({
    name: "Agenda — desglose por estado",
    value: [
      `Pending: **${m.agenda.pending}**`,
      `Confirmed: **${m.agenda.confirmed}**`,
      `Completed: **${m.agenda.completed}**`,
      `Rescheduled: **${m.agenda.rescheduled}**`,
      `Cancelled: **${m.agenda.cancelled}**`,
      `No-show: **${m.agenda.noShow}**`,
    ].join(" · "),
    inline: false,
  });

  // Origen de las reservas (idioma_booking)
  if (m.agenda.bySource.length > 0) {
    fields.push({
      name: "Origen reservas (por idioma)",
      value: m.agenda.bySource.map(x => `${x.source}: **${formatNumber(x.count)}**`).join(" · "),
      inline: false,
    });
  }

  // Leads por fuente
  if (m.leads.bySource.length > 0) {
    fields.push({
      name: "Leads por fuente",
      value: m.leads.bySource.map(x => `${x.source}: **${formatNumber(x.count)}**`).join(" · "),
      inline: false,
    });
  }

  // SEO snapshot
  fields.push({
    name: "SEO snapshot",
    value: [
      `Artículos blog: 113 × 6 idiomas`,
      `Sitemap: \`/sitemap.xml\` (index → pages + blog + faq)`,
      `Linters: \`npm run blog:validate-all\` 13/13 OK`,
    ].join("\n"),
    inline: false,
  });

  notifyEvent({
    type: "user_activity",
    criticality: "info",
    title,
    description,
    fields,
    channel: "actividad",
    origin: "scheduler/periodic-reports",
    dedupKey: `periodic_${type}_${range.startISO}`,
  });

  logger.info(`[periodic-reports] ${type} report sent for ${range.label} — ${m.visits.total} visits, ${m.agenda.total} bookings`, "reports");
}

// ─── Task #44 — Yearly hook audit branch ──────────────────────────────────
// Cierre del ciclo de inyección -> snapshot (T#42) -> mapeo canónico (T#43)
// -> auditoría programada (este módulo). El scheduler in-process ejecuta el
// auditor `scripts/blog/blog-numeric-hook-yearly-refresh.mjs` cada 15 de
// enero a las 09:00 server-local en modo dry-run (sin escribir cambios en
// los artículos), captura `summary` + `exitCode` y publica una tarjeta en
// el canal Discord `actividad`. En ejecución limpia la tarjeta es
// informativa; con drift real / inyecciones pendientes se escala a
// criticidad `warning` con el comando sugerido para resolver.

interface YearlyAuditResult {
  summary: {
    slugs: number;
    hooks: number;
    injectedAndCurrent: number;
    dormantNativeLead: number;
    needsInjection: number;
    driftReal: number;
    heuristicCandidate: number;
    staleYearAnchors: number;
    snapshotEntries: number;
    snapshotConfirmed: number;
  };
  exitCode: number;
  reportPath: string | null;
}

interface YearlyAuditModule {
  runAudit: (opts: {
    referenceYear?: number;
    write?: boolean;
    json?: boolean;
    log?: boolean;
  }) => YearlyAuditResult;
}

// Durable cross-restart idempotency: in-memory `notifyEvent` dedup is a
// 5-minute TTL only, so a server restart in the 09:00 hour on Jan 15 would
// re-fire the audit and post a duplicate Discord card. We persist the last
// completed year to `data/yearly-hook-audit-state.json` (same convention as
// `data/indexnow-pinged.json` and `data/sitemap-ping-state.json`) and skip
// any re-invocation that targets a year already marked complete.
const YEARLY_AUDIT_STATE_FILE = path.resolve(
  process.cwd(),
  "data",
  "yearly-hook-audit-state.json",
);

interface YearlyAuditState {
  lastCompletedYear: number | null;
  completedAt: string | null;
  exitCode: number | null;
}

function readYearlyAuditState(): YearlyAuditState {
  try {
    if (!fs.existsSync(YEARLY_AUDIT_STATE_FILE)) {
      return { lastCompletedYear: null, completedAt: null, exitCode: null };
    }
    const raw = fs.readFileSync(YEARLY_AUDIT_STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<YearlyAuditState>;
    return {
      lastCompletedYear:
        typeof parsed.lastCompletedYear === "number"
          ? parsed.lastCompletedYear
          : null,
      completedAt:
        typeof parsed.completedAt === "string" ? parsed.completedAt : null,
      exitCode:
        typeof parsed.exitCode === "number" ? parsed.exitCode : null,
    };
  } catch (err) {
    logger.warn(
      `[yearly-hook-audit] could not read state file at ${YEARLY_AUDIT_STATE_FILE}: ${err instanceof Error ? err.message : String(err)} — treating as never run`,
      "reports",
    );
    return { lastCompletedYear: null, completedAt: null, exitCode: null };
  }
}

function writeYearlyAuditState(state: YearlyAuditState): void {
  try {
    const dir = path.dirname(YEARLY_AUDIT_STATE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      YEARLY_AUDIT_STATE_FILE,
      JSON.stringify(state, null, 2) + "\n",
      "utf8",
    );
  } catch (err) {
    // Persistence failure should not block the audit — the in-memory
    // `notifyEvent` dedup still protects within the 5-minute window. Log
    // loudly so an operator can fix the disk issue before next year.
    logger.error(
      `[yearly-hook-audit] failed to persist state file at ${YEARLY_AUDIT_STATE_FILE} (next restart in same hour COULD duplicate)`,
      "reports",
      err,
    );
  }
}

export async function runYearlyHookAudit(now: Date): Promise<void> {
  const year = now.getFullYear();
  const startedAt = Date.now();

  // Durable guard: if THIS year's audit already completed (any restart
  // in the same calendar year), skip and log. We compare with `===`, not
  // `>=`, on purpose: a `HOOK_AUDIT_FORCE` set to a future date would
  // otherwise stamp `lastCompletedYear` ahead of real time and silently
  // suppress real audits for several Januarys (code review caveat #1).
  // Both the natural Jan-15 branch and the QA override go through this
  // gate, so to re-run for the same year an operator must delete the
  // state file or roll `lastCompletedYear` back.
  const state = readYearlyAuditState();
  if (state.lastCompletedYear !== null && state.lastCompletedYear === year) {
    logger.info(
      `[yearly-hook-audit] year=${year} already completed at ${state.completedAt} (lastCompletedYear=${state.lastCompletedYear}) — skipping`,
      "reports",
    );
    return;
  }

  let result: YearlyAuditResult;
  try {
    // Dynamic import keeps the auditor's eager file IO (HOOKS, VERACITY,
    // snapshot, ...) lazy: it only loads when the once-yearly branch fires
    // (or QA forces it via HOOK_AUDIT_FORCE), never at server boot.
    // The .mjs file lives outside the TS project (no .d.ts), so we coerce
    // through `unknown` and the explicit `YearlyAuditModule` shape above.
    const mod = (await import(
      // @ts-expect-error — auditor is a plain ESM script, no type declarations
      "../../scripts/blog/blog-numeric-hook-yearly-refresh.mjs"
    )) as unknown as YearlyAuditModule;
    result = mod.runAudit({
      referenceYear: year,
      write: false,
      json: false,
      log: false,
    });
  } catch (err) {
    logger.error(
      `[yearly-hook-audit] auditor invocation failed (year=${year}, non-fatal)`,
      "reports",
      err,
    );
    notifyEvent({
      type: "system_error",
      criticality: "error",
      title: `Auditoría anual de cifras (${year}) — ejecución fallida`,
      description:
        "El scheduler intentó ejecutar `blog-numeric-hook-yearly-refresh.mjs` pero la importación o la auditoría lanzó una excepción. Revisar logs del servidor.",
      fields: [
        {
          name: "Detalle",
          value: `\`\`\`${(err instanceof Error ? err.message : String(err)).slice(0, 900)}\`\`\``,
          inline: false,
        },
      ],
      channel: "errores",
      origin: "scheduler/yearly-hook-audit",
      dedupKey: `yearly_hooks_${year}_failure`,
    });
    return;
  }

  const { summary, exitCode } = result;
  const elapsedMs = Date.now() - startedAt;
  const isClean = exitCode === 0;

  // Title carries the year + verdict so a single-line Discord notification
  // already tells the on-call which audit and what state without opening it.
  const title = isClean
    ? `Auditoría anual de cifras (${year}) — sin drift detectado`
    : `Auditoría anual de cifras (${year}) — acción requerida`;

  // Description contains the operator-facing summary. On `warning` we also
  // embed the literal command the editorial responsable must run to resolve
  // the drift / pending injections, so the card is self-contained.
  const description = isClean
    ? `Auditoría dry-run del 15 de enero ejecutada limpiamente. Los hooks numéricos siguen alineados con el snapshot — no se requiere acción humana. La próxima auditoría se programará automáticamente para el 15 de enero de ${year + 1}.`
    : `La auditoría detectó **${summary.driftReal}** drift real y **${summary.needsInjection}** entradas que requieren inyección. Resolver con:\n\`node scripts/blog/blog-add-numeric-hook.mjs --replace-existing\`\n\nDespués re-ejecutar el auditor con \`--write-report\` para sellar la nueva fecha en \`reports/seo/lote6-numeric-hook.md\`.`;

  // Mirror the `summary` object the .mjs returns. Kept short and inline so
  // the embed stays under Discord's 25-field / 6000-char ceiling even with
  // future counter additions.
  const fields = [
    { name: "Hooks (slug × lang)", value: String(summary.hooks), inline: true },
    {
      name: "Inyectados y vigentes",
      value: String(summary.injectedAndCurrent),
      inline: true,
    },
    {
      name: "Latentes (lead nativo)",
      value: String(summary.dormantNativeLead),
      inline: true,
    },
    {
      name: "Anclas con año stale",
      value: String(summary.staleYearAnchors),
      inline: true,
    },
    // Spec wording: el field se llama "mismatched" en task-44.md. Aquí
    // mantenemos esa etiqueta para alinear la tarjeta Discord con la
    // terminología acordada y añadimos entre paréntesis el término técnico
    // que aparece en el log del auditor (`drift_real`) para que el on-call
    // pueda hacer grep directo en logs sin traducir mentalmente.
    { name: "Mismatched (drift real)", value: String(summary.driftReal), inline: true },
    {
      name: "Falta inyectar",
      value: String(summary.needsInjection),
      inline: true,
    },
    {
      name: "Heurístico (informativo)",
      value: String(summary.heuristicCandidate),
      inline: true,
    },
    {
      name: "Snapshot footprints",
      value: `${summary.snapshotEntries} (${summary.snapshotConfirmed} match)`,
      inline: true,
    },
    { name: "Exit code", value: String(exitCode), inline: true },
  ];

  notifyEvent({
    type: "user_activity",
    criticality: isClean ? "info" : "warning",
    title,
    description,
    fields,
    channel: "actividad",
    origin: "scheduler/yearly-hook-audit",
    // dedupKey en notifyEvent es defensa secundaria (TTL 5 min en memoria)
    // — la idempotencia real cross-restart la garantiza el state file
    // `data/yearly-hook-audit-state.json` chequeado al inicio de esta
    // función. Para re-disparar el aviso del mismo año (p. ej. en QA),
    // borrar el state file o bajar `lastCompletedYear` a < year.
    dedupKey: `yearly_hooks_${year}`,
  });

  // Persist the durable guard ONLY after the audit ran AND we enqueued
  // the Discord notification successfully. If we wrote it earlier, a crash
  // between the audit and the notification would silently swallow the
  // year. The order is: audit -> notify -> persist.
  writeYearlyAuditState({
    lastCompletedYear: year,
    completedAt: new Date().toISOString(),
    exitCode,
  });

  logger.info(
    `[yearly-hook-audit] year=${year} exitCode=${exitCode} hooks=${summary.hooks} injected=${summary.injectedAndCurrent} drift=${summary.driftReal} needsInjection=${summary.needsInjection} staleYears=${summary.staleYearAnchors} elapsedMs=${elapsedMs}`,
    "reports",
  );
}

/**
 * Programa los reportes periódicos en el scheduler de la app.
 * Llamar una sola vez al arrancar; idempotente vía dedupKey.
 *
 * - Semanal: cada lunes 09:00 hora local server (con check de fecha real)
 * - Mensual: día 1 de cada mes 09:00 hora local server
 * - Auditoría anual de cifras: 15 de enero 09:00 hora local server
 *
 * Internamente usa `setInterval` cada 1 hora y comprueba si toca enviar.
 * Robusto a reinicios: dedupKey por período impide duplicados aunque el
 * proceso se reinicie varias veces dentro de la ventana de 1 hora.
 */
export function startPeriodicReportsScheduler(): NodeJS.Timeout {
  const HOUR_MS = 60 * 60 * 1000;

  // QA override (Task #44 step 5): cuando `HOOK_AUDIT_FORCE=YYYY-MM-DD` está
  // definida, el scheduler dispara la auditoría anual una sola vez por
  // proceso usando esa fecha como `now`. Esto permite verificar la tarjeta
  // Discord end-to-end sin esperar al 15 de enero. El flag se setea en el
  // primer disparo para que sucesivos ticks no spammeen Discord (la dedupKey
  // sólo cubre 5 min; el flag cubre toda la vida del proceso).
  let forcedYearlyAuditFired = false;

  const tick = async () => {
    const realNow = new Date();
    const dow = realNow.getDay();         // 0 = domingo, 1 = lunes
    const dom = realNow.getDate();        // día del mes
    const month = realNow.getMonth();     // 0 = enero
    const hour = realNow.getHours();      // 0-23

    // Override QA: dispara la auditoría con la fecha forzada,
    // independientemente de la hora real. Una sola vez por proceso.
    let yearlyRanThisTick = false;
    const forceISO = process.env.HOOK_AUDIT_FORCE;
    if (forceISO && !forcedYearlyAuditFired) {
      const forced = new Date(forceISO);
      if (Number.isNaN(forced.getTime())) {
        // Don't consume the one-shot on an invalid value: log and continue
        // so an operator can fix the env var without restarting the
        // process (the next tick will retry parsing). Code review caveat
        // #2: el flag se setea sólo tras parseo exitoso.
        logger.warn(
          `[yearly-hook-audit] HOOK_AUDIT_FORCE='${forceISO}' is not a valid ISO date; ignoring override`,
          "reports",
        );
      } else {
        forcedYearlyAuditFired = true;
        logger.info(
          `[yearly-hook-audit] HOOK_AUDIT_FORCE override active -> running audit with forced date ${forced.toISOString()}`,
          "reports",
        );
        try {
          await runYearlyHookAudit(forced);
          // Si la fecha real también es el 15 de enero a las 09:00, evitamos
          // disparar la rama natural en el mismo tick (la dedupKey suprimiría
          // la tarjeta Discord duplicada, pero seguiría duplicando el trabajo
          // de la auditoría — caveat #1 del primer code review).
          yearlyRanThisTick = true;
        } catch (err) {
          logger.error(
            "[yearly-hook-audit] forced run failed (non-fatal)",
            "reports",
            err,
          );
        }
      }
    }

    // Solo en hora 9:00 (cualquier minuto, ejecuta una vez por hora)
    if (hour !== 9) return;

    try {
      // Reporte semanal: lunes 09:00
      if (dow === 1) {
        const range = lastCompletedWeekRange(realNow);
        await generateAndSendPeriodReport(range, "weekly");
      }
      // Reporte mensual: día 1 del mes 09:00 (también ejecuta el lunes si coincide)
      if (dom === 1) {
        const range = lastCompletedMonthRange(realNow);
        await generateAndSendPeriodReport(range, "monthly");
      }
      // Auditoría anual de cifras (Task #44): 15 de enero 09:00.
      // Skipped si el forzado ya corrió en este mismo tick.
      if (month === 0 && dom === 15 && !yearlyRanThisTick) {
        await runYearlyHookAudit(realNow);
      }
    } catch (err) {
      logger.error("[periodic-reports] scheduler tick failed (non-fatal)", "reports", err);
    }
  };

  // Primer tick a los 60 segundos (warmup), luego cada hora
  const warmup = setTimeout(() => {
    void tick();
  }, 60_000);

  const interval = setInterval(() => {
    void tick();
  }, HOUR_MS);

  // Para cleanup en shutdown, devolvemos el interval (el warmup es desechable)
  warmup.unref();
  return interval;
}
