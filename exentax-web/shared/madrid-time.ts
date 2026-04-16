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
