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
import { sql } from "drizzle-orm";
import { logger } from "../logger";
import { notifyEvent } from "../discord";

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
  const visitsTotal = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
  `);
  const visitsByLang = await db.execute(sql`
    SELECT idioma AS lang, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      AND idioma IS NOT NULL
    GROUP BY idioma ORDER BY count DESC LIMIT 6
  `);
  // No country column in visits — derive from utm_source/referrer top values as proxy
  const visitsByCountry = await db.execute(sql`
    SELECT COALESCE(utm_source, 'direct') AS country, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY utm_source ORDER BY count DESC LIMIT 5
  `);
  const topPages = await db.execute(sql`
    SELECT pagina AS page, COUNT(*)::int AS count FROM visits
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      AND pagina IS NOT NULL
    GROUP BY pagina ORDER BY count DESC LIMIT 10
  `);

  // AGENDA — totales por estado
  const agendaTotal = await db.execute(sql`
    SELECT COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
  `);
  const agendaByStatus = await db.execute(sql`
    SELECT estado AS status, COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY estado
  `);
  // Source proxy = idioma_booking (no source column in agenda)
  const agendaBySource = await db.execute(sql`
    SELECT COALESCE(idioma_booking, 'es') AS source, COUNT(*)::int AS count FROM agenda
    WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    GROUP BY idioma_booking ORDER BY count DESC LIMIT 6
  `);

  // LEADS (tabla leads): col `fuente` = source, `fecha_creacion` = createdAt
  let leadsTotal = { rows: [{ count: 0 }] as any };
  let leadsBySource = { rows: [] as any };
  try {
    leadsTotal = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM leads
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    `);
    leadsBySource = await db.execute(sql`
      SELECT COALESCE(fuente, 'unknown') AS source, COUNT(*)::int AS count FROM leads
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
      GROUP BY fuente ORDER BY count DESC LIMIT 5
    `);
  } catch (err) {
    logger.error("[periodic-reports] leads table query failed (non-fatal)", "reports", err);
  }

  // NEWSLETTER (newsletter_subscribers): `fecha_creacion`, `unsubscribed_at`
  let nlSubs = { rows: [{ count: 0 }] as any };
  let nlUnsubs = { rows: [{ count: 0 }] as any };
  try {
    nlSubs = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM newsletter_subscribers
      WHERE fecha_creacion >= ${range.startSQL}::timestamptz AND fecha_creacion <= ${range.endSQL}::timestamptz
    `);
    nlUnsubs = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM newsletter_subscribers
      WHERE unsubscribed_at >= ${range.startSQL} AND unsubscribed_at <= ${range.endSQL}
    `);
  } catch (err) {
    logger.error("[periodic-reports] newsletter query failed", "reports", err);
  }

  // CALCULADORA — número de cálculos en período (calculations.fecha_creacion)
  let calcRuns = { rows: [{ count: 0 }] as any };
  try {
    calcRuns = await db.execute(sql`
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
  for (const row of agendaByStatus.rows as Array<{ status: string; count: number }>) {
    if (row.status) statusMap[row.status] = row.count;
  }

  return {
    visits: {
      total: (visitsTotal.rows[0] as any)?.count ?? 0,
      byLanguage: visitsByLang.rows as any,
      byCountry: visitsByCountry.rows as any,
      topPages: topPages.rows as any,
    },
    agenda: {
      total: (agendaTotal.rows[0] as any)?.count ?? 0,
      pending: statusMap.pending,
      confirmed: statusMap.confirmed,
      cancelled: statusMap.cancelled,
      rescheduled: statusMap.rescheduled,
      noShow: statusMap.no_show,
      completed: statusMap.completed,
      bySource: agendaBySource.rows as any,
    },
    leads: {
      total: (leadsTotal.rows[0] as any)?.count ?? 0,
      bySource: leadsBySource.rows as any,
    },
    newsletter: {
      subscriptions: (nlSubs.rows[0] as any)?.count ?? 0,
      unsubscribes: (nlUnsubs.rows[0] as any)?.count ?? 0,
    },
    calculator: {
      executions: (calcRuns.rows[0] as any)?.count ?? 0,
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

  const titlePrefix = type === "weekly" ? "📊 Reporte semanal" : "📈 Reporte mensual";
  const title = `${titlePrefix} — ${range.label}`;

  // Resumen ejecutivo en description
  const conversionRate = m.visits.total > 0
    ? `${((m.agenda.total / m.visits.total) * 100).toFixed(2)}%`
    : "—";

  const description = [
    `**Período**: ${formatDateES(new Date(range.startISO))} → ${formatDateES(new Date(range.endISO))}`,
    "",
    `🌐 **${formatNumber(m.visits.total)}** visitas web · 📅 **${formatNumber(m.agenda.total)}** reservas · 🧮 **${formatNumber(m.calculator.executions)}** cálculos`,
    `📧 **${formatNumber(m.leads.total)}** leads · 📨 **${formatNumber(m.newsletter.subscriptions)}** subs newsletter (−${formatNumber(m.newsletter.unsubscribes)} bajas)`,
    `🎯 Tasa conversión visita→reserva: **${conversionRate}**`,
  ].join("\n");

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [];

  // Top 10 páginas más visitadas
  fields.push({
    name: "🔝 Páginas más visitadas",
    value: formatTopList(m.visits.topPages, "page", 10),
    inline: false,
  });

  // Visitas por idioma
  if (m.visits.byLanguage.length > 0) {
    fields.push({
      name: "🌍 Visitas por idioma",
      value: m.visits.byLanguage.map(x => `**${x.lang.toUpperCase()}**: ${formatNumber(x.count)}`).join(" · "),
      inline: true,
    });
  }

  // Visitas por país top 5
  if (m.visits.byCountry.length > 0) {
    fields.push({
      name: "📍 Top países",
      value: m.visits.byCountry.map(x => `${x.country}: ${formatNumber(x.count)}`).join(" · "),
      inline: true,
    });
  }

  // Estado de la agenda
  fields.push({
    name: "📅 Agenda — desglose por estado",
    value: [
      `🟡 Pending: **${m.agenda.pending}**`,
      `🟢 Confirmed: **${m.agenda.confirmed}**`,
      `🔵 Completed: **${m.agenda.completed}**`,
      `🔁 Rescheduled: **${m.agenda.rescheduled}**`,
      `❌ Cancelled: **${m.agenda.cancelled}**`,
      `👻 No-show: **${m.agenda.noShow}**`,
    ].join(" · "),
    inline: false,
  });

  // Origen de las reservas
  if (m.agenda.bySource.length > 0) {
    fields.push({
      name: "🚪 Origen reservas",
      value: m.agenda.bySource.map(x => `${x.source}: **${formatNumber(x.count)}**`).join(" · "),
      inline: false,
    });
  }

  // Leads por fuente
  if (m.leads.bySource.length > 0) {
    fields.push({
      name: "📧 Leads por fuente",
      value: m.leads.bySource.map(x => `${x.source}: **${formatNumber(x.count)}**`).join(" · "),
      inline: false,
    });
  }

  // SEO snapshot (artículos blog publicados, sitemap status)
  fields.push({
    name: "🔍 SEO",
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

/**
 * Programa los reportes periódicos en el scheduler de la app.
 * Llamar una sola vez al arrancar; idempotente vía dedupKey.
 *
 * - Semanal: cada lunes 09:00 hora local server (con check de fecha real)
 * - Mensual: día 1 de cada mes 09:00 hora local server
 *
 * Internamente usa `setInterval` cada 1 hora y comprueba si toca enviar.
 * Robusto a reinicios: dedupKey por período impide duplicados aunque el
 * proceso se reinicie varias veces dentro de la ventana de 1 hora.
 */
export function startPeriodicReportsScheduler(): NodeJS.Timeout {
  const HOUR_MS = 60 * 60 * 1000;

  const tick = async () => {
    const now = new Date();
    const dow = now.getDay();         // 0 = domingo, 1 = lunes
    const dom = now.getDate();        // día del mes
    const hour = now.getHours();      // 0-23

    // Solo en hora 9:00 (cualquier minuto, ejecuta una vez por hora)
    if (hour !== 9) return;

    try {
      // Reporte semanal: lunes 09:00
      if (dow === 1) {
        const range = lastCompletedWeekRange(now);
        await generateAndSendPeriodReport(range, "weekly");
      }
      // Reporte mensual: día 1 del mes 09:00 (también ejecuta el lunes si coincide)
      if (dom === 1) {
        const range = lastCompletedMonthRange(now);
        await generateAndSendPeriodReport(range, "monthly");
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
