/**
 * Centralised Madrid (Europe/Madrid) date helpers.
 *
 * Used by both server (server-constants re-exports these) and client
 * (BookingCalendar) so that the booking calendar and slot validation
 * agree on what "today" means.
 */

export const MADRID_TZ = "Europe/Madrid";
export const DATE_LOCALE_ISO = "en-CA";

export function nowMadrid(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: MADRID_TZ }));
}

export function todayMadridISO(): string {
  return new Date().toLocaleDateString(DATE_LOCALE_ISO, { timeZone: MADRID_TZ });
}

export function todayMadridParts(): { year: number; month: number; day: number } {
  const iso = todayMadridISO();
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export function isWeekdayISO(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

export function isWeekdayYMD(year: number, month0: number, day: number): boolean {
  const d = new Date(year, month0, day);
  const wd = d.getDay();
  return wd >= 1 && wd <= 5;
}

/**
 * Convert a Madrid wall-clock date+time (`YYYY-MM-DD` + `HH:mm`) to its
 * absolute UTC timestamp in milliseconds, fully DST-aware.
 *
 * Approach: format an arbitrary UTC instant on the same calendar day in
 * Madrid TZ to discover that day's UTC offset (CET = +1, CEST = +2). Using
 * a UTC noon anchor avoids the DST gap/overlap windows where the offset
 * itself is ambiguous, so the answer is stable for every valid booking
 * slot we accept (08:00–20:00 Madrid).
 *
 * Centralised here so the booking calendar (client) and the reminder
 * scheduler (server) cannot drift out of agreement on what instant a slot
 * represents.
 */
export function madridWallTimeToUtcMs(date: string, startTime: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, min] = startTime.split(":").map(Number);
  const utcNoon = Date.UTC(year, month - 1, day, 12, 0);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: MADRID_TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const madridNoonParts = formatter.format(new Date(utcNoon)).split(":");
  const madridNoonH = parseInt(madridNoonParts[0], 10) || 12;
  const offsetHours = madridNoonH - 12;
  return Date.UTC(year, month - 1, day, hour - offsetHours, min);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function fmtISO(y: number, m: number, day: number): string {
  return `${y}-${pad2(m)}-${pad2(day)}`;
}

function partsInMadrid(d: Date): { y: number; m: number; day: number } {
  const fmt = new Intl.DateTimeFormat(DATE_LOCALE_ISO, {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), day: get("day") };
}

/**
 * Add `days` calendar days to a Madrid `YYYY-MM-DD` ISO date and return
 * the resulting Madrid date (DST-aware). Anchors at UTC noon to avoid
 * the DST gap/overlap windows. Defensive: falls back to UTC arithmetic
 * if the input is malformed or `Intl.DateTimeFormat` rejects the TZ
 * (a tiny subset of legacy browsers).
 */
export function addDaysMadridISO(baseISO: string, days: number): string {
  try {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(baseISO);
    if (!m) throw new Error("bad iso");
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const utc = Date.UTC(y, mo - 1, d + days, 12, 0, 0);
    const target = new Date(utc);
    const parts = partsInMadrid(target);
    return fmtISO(parts.y, parts.m, parts.day);
  } catch {
    const t = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return t.toISOString().split("T")[0];
  }
}

export function tomorrowMadridISO(): string {
  return addDaysMadridISO(todayMadridISO(), 1);
}
