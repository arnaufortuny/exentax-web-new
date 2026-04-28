import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DayPicker, type DayButtonProps } from "react-day-picker";
import { es } from "date-fns/locale/es";
import { enUS } from "date-fns/locale/en-US";
import { fr } from "date-fns/locale/fr";
import { de } from "date-fns/locale/de";
import { pt } from "date-fns/locale/pt";
import { ca } from "date-fns/locale/ca";
import type { Locale } from "date-fns";
import { todayMadridParts } from "@shared/madrid-time";
import "react-day-picker/style.css";

const LOCALES: Record<string, Locale> = { es, en: enUS, fr, de, pt, ca };

function isoToDate(iso: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return undefined;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function dateToISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export interface CalendarProps {
  value: string;
  onChange: (iso: string) => void;
  minDate: string;
  maxDate: string;
  disabledDates?: string[];
  testIdPrefix?: string;
}

export default function Calendar({ value, onChange, minDate, maxDate, disabledDates, testIdPrefix = "calendar" }: CalendarProps) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || "es").split("-")[0];
  const locale = LOCALES[lang] || es;

  const labelPrev = t("booking.prevMonth");
  const labelNxt = t("booking.nextMonth");
  const labelBlocked = t("booking.dayBlocked");

  const selected = useMemo(() => isoToDate(value), [value]);
  const min = useMemo(() => isoToDate(minDate), [minDate]);
  const max = useMemo(() => isoToDate(maxDate), [maxDate]);
  const disabledSet = useMemo(() => new Set(disabledDates ?? []), [disabledDates]);

  const tp = todayMadridParts();
  const todayMadrid = new Date(tp.year, tp.month - 1, tp.day);

  const defaultMonth = selected || min || todayMadrid;

  return (
    <div
      className="exentax-calendar rounded-token-sm border border-[var(--border)] bg-[var(--bg-input)] p-3"
      data-testid={`${testIdPrefix}-root`}
    >
      <DayPicker
        mode="single"
        locale={locale}
        weekStartsOn={1}
        selected={selected}
        onSelect={(d) => { if (d) onChange(dateToISO(d)); }}
        defaultMonth={defaultMonth}
        today={todayMadrid}
        startMonth={min}
        endMonth={max}
        disabled={[
          { dayOfWeek: [0, 6] },
          ...(min ? [{ before: min }] : []),
          ...(max ? [{ after: max }] : []),
          (date: Date) => disabledSet.has(dateToISO(date)),
        ]}
        showOutsideDays={false}
        labels={{
          labelPrevious: () => labelPrev,
          labelNext: () => labelNxt,
        }}
        components={{
          PreviousMonthButton: (props) => (
            <button {...props} data-testid={`${testIdPrefix}-prev`} />
          ),
          NextMonthButton: (props) => (
            <button {...props} data-testid={`${testIdPrefix}-next`} />
          ),
          DayButton: ({ day, modifiers, ...rest }: DayButtonProps) => {
            const iso = dateToISO(day.date);
            const blocked = disabledSet.has(iso);
            return (
              <button
                {...rest}
                data-testid={`${testIdPrefix}-day-${iso}`}
                title={blocked ? labelBlocked : undefined}
                aria-pressed={modifiers.selected || undefined}
              />
            );
          },
        }}
        classNames={{
          root: "rdp-root",
          month_caption: "flex items-center justify-center font-body font-semibold text-sm text-[var(--text-1)] mb-2",
          caption_label: "text-[var(--text-1)]",
          nav: "absolute top-3 inset-x-3 flex justify-between pointer-events-none",
          button_previous: "w-8 h-8 rounded-full hover:bg-[var(--green-soft)] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto",
          button_next: "w-8 h-8 rounded-full hover:bg-[var(--green-soft)] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto",
          weekdays: "grid grid-cols-7 gap-1 mb-1",
          weekday: "text-center text-xs font-medium text-[var(--text-3)] py-1",
          week: "grid grid-cols-7 gap-1",
          day: "aspect-square",
          day_button: "w-full h-full flex items-center justify-center rounded-full text-sm font-medium text-[var(--text-1)] hover:bg-[var(--green-soft)] cursor-pointer transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
          selected: "[&>button]:bg-[var(--green)] [&>button]:text-[var(--text-1)] [&>button]:shadow-[var(--shadow-green)] [&>button:hover]:bg-[var(--green)]",
          today: "[&>button]:font-bold [&>button]:relative [&>button]:after:content-[''] [&>button]:after:absolute [&>button]:after:bottom-1 [&>button]:after:left-1/2 [&>button]:after:-translate-x-1/2 [&>button]:after:w-1 [&>button]:after:h-1 [&>button]:after:rounded-full [&>button]:after:bg-[var(--green)]",
          disabled: "opacity-40 cursor-not-allowed",
          outside: "invisible",
        }}
        styles={{
          month_grid: { width: "100%", borderCollapse: "collapse" },
        }}
      />
    </div>
  );
}
