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
