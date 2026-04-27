import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { isWeekdayYMD, todayMadridParts } from "@shared/madrid-time";

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1);
  let startWeekday = firstDay.getDay();
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function ymdToISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isoToYMD(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]) - 1, d: Number(m[3]) };
}

export interface MiniCalendarProps {
  value: string;
  onChange: (iso: string) => void;
  minDate: string;
  maxDate: string;
  disabledDates?: string[];
  testIdPrefix?: string;
}

export default function MiniCalendar({ value, onChange, minDate, maxDate, disabledDates, testIdPrefix = "calendar" }: MiniCalendarProps) {
  const { t } = useTranslation();

  const initialFocus = useMemo(() => {
    const v = isoToYMD(value);
    if (v) return { year: v.y, month: v.m };
    const min = isoToYMD(minDate);
    if (min) return { year: min.y, month: min.m };
    const tp = todayMadridParts();
    return { year: tp.year, month: tp.month - 1 };
  }, [value, minDate]);

  const [currentYear, setCurrentYear] = useState(initialFocus.year);
  const [currentMonth, setCurrentMonth] = useState(initialFocus.month);

  const monthNames = t("booking.months", { returnObjects: true }) as string[];
  const daysShort = t("booking.days", { returnObjects: true }) as string[];

  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  const minYMD = isoToYMD(minDate);
  const maxYMD = isoToYMD(maxDate);
  const blockedSet = useMemo(() => new Set(disabledDates ?? []), [disabledDates]);
  const todayParts = todayMadridParts();
  const todayISO = ymdToISO(todayParts.year, todayParts.month - 1, todayParts.day);

  const minNum = minYMD ? minYMD.y * 10000 + (minYMD.m + 1) * 100 + minYMD.d : 0;
  const maxNum = maxYMD ? maxYMD.y * 10000 + (maxYMD.m + 1) * 100 + maxYMD.d : Number.MAX_SAFE_INTEGER;

  function dayNum(y: number, mZero: number, d: number): number {
    return y * 10000 + (mZero + 1) * 100 + d;
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }

  const canGoPrev = !(minYMD && (currentYear < minYMD.y || (currentYear === minYMD.y && currentMonth <= minYMD.m)));
  const canGoNext = !(maxYMD && (currentYear > maxYMD.y || (currentYear === maxYMD.y && currentMonth >= maxYMD.m)));

  return (
    <div className="rounded-token-sm border border-[var(--border)] bg-[var(--bg-input)] p-3" data-testid={`${testIdPrefix}-root`}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full hover:bg-[var(--green-soft)] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t("booking.prevMonth")}
          data-testid={`${testIdPrefix}-prev`}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-body font-semibold text-sm text-[var(--text-1)]" data-testid={`${testIdPrefix}-month-label`}>
          {monthNames[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 rounded-full hover:bg-[var(--green-soft)] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t("booking.nextMonth")}
          data-testid={`${testIdPrefix}-next`}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysShort.map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-xs font-medium text-[var(--text-3)] py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const iso = ymdToISO(currentYear, currentMonth, day);
          const num = dayNum(currentYear, currentMonth, day);
          const weekday = isWeekdayYMD(currentYear, currentMonth, day);
          const outOfRange = num < minNum || num > maxNum;
          const blocked = blockedSet.has(iso);
          const disabled = !weekday || outOfRange || blocked;
          const isSelected = value === iso;
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => !disabled && onChange(iso)}
              disabled={disabled}
              title={blocked ? t("booking.dayBlocked") : undefined}
              className={`relative aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 ${
                disabled
                  ? blocked
                    ? "text-[var(--text-3)] opacity-30 cursor-not-allowed line-through"
                    : "text-[var(--text-3)] opacity-40 cursor-not-allowed"
                  : isSelected
                  ? "bg-[var(--green)] text-[var(--text-1)] shadow-[var(--shadow-green)]"
                  : "text-[var(--text-1)] hover:bg-[var(--green-soft)] cursor-pointer"
              }`}
              data-testid={`${testIdPrefix}-day-${iso}`}
            >
              {day}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--green)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
