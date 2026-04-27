const MADRID_TZ = "Europe/Madrid";

function partsInMadrid(d: Date): { y: number; m: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), day: get("day") };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function fmtISO(y: number, m: number, day: number): string {
  return `${y}-${pad2(m)}-${pad2(day)}`;
}

export function todayMadridISO(): string {
  try {
    const { y, m, day } = partsInMadrid(new Date());
    if (Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(day)) {
      return fmtISO(y, m, day);
    }
  } catch {}
  return new Date().toISOString().split("T")[0];
}

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
