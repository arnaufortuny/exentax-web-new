import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useTranslation } from "react-i18next";
import { CONTACT } from "@/lib/constants";
import { useInlineMessage } from "@/hooks/useInlineMessage";
import { InlineMessage } from "@/components/InlineMessage";
import { trackFormSubmit } from "@/components/Tracking";
import PhoneInput from "@/components/PhoneInput";
import { useLangPath } from "@/hooks/useLangPath";
import {
  isWeekdayYMD as isWeekday,
  todayMadridParts,
  todayMadridISO,
} from "@shared/madrid-time";

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

function formatDateISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function nowMadrid(): Date {
  const { year, month, day } = todayMadridParts();
  return new Date(year, month - 1, day);
}

function isPastDate(year: number, month: number, day: number): boolean {
  const { year: ty, month: tm, day: td } = todayMadridParts();
  const todayNum = ty * 10000 + tm * 100 + td;
  const dateNum = year * 10000 + (month + 1) * 100 + day;
  return dateNum < todayNum;
}

type Step = "qualify" | "date" | "time" | "form" | "confirming" | "success";

interface BookingCalendarProps {
  prefilledContext?: string;
  prefilledName?: string;
  prefilledEmail?: string;
  prefilledPhone?: string;
  prefilledBeneficio?: string;
  prefilledClientesMundiales?: boolean;
  prefilledOperaDigital?: boolean;
  prefilledActivity?: string;
}

const BENEFICIO_KEYS = [
  "< 1.000 €/mes",
  "1.000 – 3.000 €/mes",
  "3.000 – 5.000 €/mes",
  "5.000 – 10.000 €/mes",
  "10.000 – 20.000 €/mes",
  "> 20.000 €/mes",
];

export default function BookingCalendar({ prefilledContext, prefilledName, prefilledEmail, prefilledPhone, prefilledBeneficio, prefilledClientesMundiales, prefilledOperaDigital, prefilledActivity }: BookingCalendarProps) {
  const { t, i18n } = useTranslation();
  const lp = useLangPath();
  const { msg: inlineMsg, showMsg } = useInlineMessage();
  const beneficioOptions = t("booking.beneficioOptions", { returnObjects: true }) as string[];
  const today = nowMadrid();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const hasPrefilledQualify = !!(prefilledBeneficio && prefilledClientesMundiales !== undefined && prefilledOperaDigital !== undefined);
  const [step, setStep] = useState<Step>(hasPrefilledQualify ? "date" : "qualify");

  const [formData, setFormData] = useState({
    name: prefilledName || "",
    lastName: "",
    email: prefilledEmail || "",
    phone: prefilledPhone || "",
    beneficioMensual: prefilledBeneficio || "",
    clientesMundiales: prefilledClientesMundiales ?? null as boolean | null,
    operaDigital: prefilledOperaDigital ?? null as boolean | null,
    notaCompartir: "",
    compromisoAsistir: hasPrefilledQualify ? true : null as boolean | null,
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [privacyError, setPrivacyError] = useState(false);
  const [compromisoError, setCompromisoError] = useState(false);

  const [bookingResult, setBookingResult] = useState<{
    date: string;
    startTime: string;
    endTime: string;
    meetLink: string | null;
  } | null>(null);

  const daysShort = t("booking.days", { returnObjects: true }) as string[];
  const monthNames = t("booking.months", { returnObjects: true }) as string[];
  const dayNamesFull = t("booking.dayNames", { returnObjects: true }) as string[];

  const blockedDaysQuery = useQuery<string[]>({
    queryKey: ["/api/bookings/blocked-days"],
    queryFn: async () => {
      const res = await fetch("/api/bookings/blocked-days");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || json;
    },
    staleTime: 300_000,
  });
  const blockedDates = useMemo(() => new Set(blockedDaysQuery.data || []), [blockedDaysQuery.data]);
  const todayStr = useMemo(() => todayMadridISO(), []);

  const slotsQuery = useQuery<{ date: string; slots: string[]; blocked?: boolean }>({
    queryKey: ["/api/bookings/available-slots", selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/available-slots?date=${selectedDate}`);
      if (!res.ok) throw new Error(`${res.status}: Failed to fetch slots`);
      const json = await res.json();
      return { date: json.date, slots: json.slots, blocked: json.blocked };
    },
    enabled: !!selectedDate,
    staleTime: 60_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const bookMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      lastName: string;
      email: string;
      phone: string;
      date: string;
      startTime: string;
      notes?: string;
      context?: string;
      activity?: string;
      monthlyProfit: string;
      globalClients: boolean;
      digitalOperation: boolean;
      shareNote: string;
      attendanceCommitment: boolean;
      privacyAccepted: boolean;
      marketingAccepted: boolean;
    }) => {
      const res = await fetch("/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: i18n.language }),
        credentials: "include",
      });
      let json: Record<string, unknown>;
      try {
        json = await res.json();
      } catch {
        throw new Error(t("booking.bookingError"));
      }
      if (!res.ok) {
        throw new Error((json.error as string) || t("booking.bookingError"));
      }
      return json as { date: string; startTime: string; endTime: string; meetLink: string | null; status: string };
    },
    onSuccess: (data) => {
      trackFormSubmit("booking");
      setBookingResult(data);
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/available-slots"] });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/available-slots"] });
      const msg = error.message?.includes("429") ? t("errors.rateLimited") : t("errors.serverError");
      showMsg(msg, "error");
    },
  });

  const days = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isBlockedDate = (year: number, month: number, day: number): boolean => {
    return blockedDates.has(formatDateISO(year, month, day));
  };

  const handleDayClick = (day: number) => {
    if (!isWeekday(currentYear, currentMonth, day)) return;
    if (isPastDate(currentYear, currentMonth, day)) return;
    if (isBlockedDate(currentYear, currentMonth, day)) return;
    const dateStr = formatDateISO(currentYear, currentMonth, day);
    setSelectedDate(dateStr);
    setSelectedTime(null);
    setStep("time");
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    setStep("form");
  };

  const [phoneError, setPhoneError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    if (!privacyAccepted) {
      setPrivacyError(true);
      return;
    }
    setPrivacyError(false);

    bookMutation.mutate({
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: selectedDate,
      startTime: selectedTime,
      notes: formData.notaCompartir.trim() || undefined,
      context: prefilledContext || undefined,
      activity: prefilledActivity || undefined,
      monthlyProfit: formData.beneficioMensual,
      globalClients: formData.clientesMundiales === true,
      digitalOperation: formData.operaDigital === true,
      shareNote: formData.notaCompartir.trim(),
      attendanceCommitment: formData.compromisoAsistir === true,
      privacyAccepted: true,
      marketingAccepted: marketingAccepted,
    });
  };

  const canGoPrev = !(currentYear === today.getFullYear() && currentMonth === today.getMonth());

  const selectedDateFormatted = selectedDate
    ? (() => {
        const d = new Date(selectedDate + "T12:00:00");
        return t("booking.dateFormat", {
          dayName: dayNamesFull[d.getDay()],
          day: d.getDate(),
          month: (monthNames[d.getMonth()] ?? "").toLowerCase(),
        });
      })()
    : "";

  if (step === "confirming") {
    return (
      <div className="glass-strong rounded-[var(--radius-lg)] !border-[rgba(0,229,16,0.20)] p-8 lg:p-10 text-center" data-testid="booking-confirming">
        <div className="flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 border-3 border-[#00E510] border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-2">{t("booking.confirmingTitle")}</h2>
        <p className="text-[var(--text-2)] text-sm">{t("booking.confirmingDesc")}</p>
      </div>
    );
  }

  if (step === "success" && bookingResult) {
    const d = new Date(bookingResult.date + "T12:00:00");
    const dateDisplay = t("booking.dateFormatYear", {
      dayName: dayNamesFull[d.getDay()],
      day: d.getDate(),
      month: (monthNames[d.getMonth()] ?? "").toLowerCase(),
      year: d.getFullYear(),
    });

    return (
      <div className="glass-strong rounded-[var(--radius-lg)] !border-[rgba(0,229,16,0.20)] p-8 lg:p-10 text-center" data-testid="booking-success">
        <div className="flex items-center justify-center mx-auto mb-6">
          <svg width={64} height={64} viewBox="0 0 52 52" fill="none">
            <rect x="1" y="1" width="50" height="50" rx="16" fill="#F7F8F7" stroke="rgba(0,229,16,0.25)" strokeWidth="1"/>
            <rect x="14" y="16" width="24" height="22" rx="4" stroke="#00E510" strokeWidth="2" fill="none"/>
            <path d="M19 12v6M33 12v6M14 24h24" stroke="#00E510" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="font-heading font-bold text-2xl text-[var(--text-1)] mb-2">{t("booking.successTitle")}</h2>
        <p className="text-[var(--text-2)] mb-6">
          {t("booking.successDesc")}
        </p>

        <div className="glass rounded-[var(--radius)] p-5 text-left max-w-md mx-auto mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg width={28} height={28} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                <rect x="0.5" y="0.5" width="27" height="27" rx="9" fill="#F7F8F7" stroke="rgba(0,229,16,0.25)" strokeWidth="1"/>
                <rect x="7" y="9" width="14" height="12" rx="2.5" stroke="#00E510" strokeWidth="1.5" fill="none"/>
                <path d="M10 7v4M18 7v4M7 13h14" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-[var(--text-1)] font-medium">{dateDisplay}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width={28} height={28} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                <rect x="0.5" y="0.5" width="27" height="27" rx="9" fill="#F7F8F7" stroke="rgba(0,229,16,0.25)" strokeWidth="1"/>
                <circle cx="14" cy="14" r="6" stroke="#00E510" strokeWidth="1.5" fill="none"/>
                <path d="M14 10v4l2.5 1.5" stroke="#00E510" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm text-[var(--text-1)] font-medium">{bookingResult.startTime} - {bookingResult.endTime} ({t("booking.spainTime")})</span>
            </div>
            {bookingResult.meetLink && (
              <div className="flex items-center gap-3">
                <svg width={28} height={28} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                  <rect x="0.5" y="0.5" width="27" height="27" rx="9" fill="#F7F8F7" stroke="rgba(0,229,16,0.25)" strokeWidth="1"/>
                  <rect x="5" y="9" width="13" height="10" rx="2.5" stroke="#00E510" strokeWidth="1.5" fill="none"/>
                  <polygon points="18,11 23,14 18,17" stroke="#00E510" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                </svg>
                <a href={bookingResult.meetLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#00E510] font-medium underline" data-testid="link-meet">
                  {t("booking.joinMeet")}
                </a>
              </div>
            )}
            <div className="flex items-center gap-3">
              <svg width={28} height={28} viewBox="0 0 28 28" fill="none" className="flex-shrink-0">
                <rect x="0.5" y="0.5" width="27" height="27" rx="9" fill="#F7F8F7" stroke="rgba(0,229,16,0.25)" strokeWidth="1"/>
                <circle cx="14" cy="14" r="5" stroke="#00E510" strokeWidth="1.5" fill="none"/>
                <circle cx="14" cy="14" r="2" fill="#00E510"/>
              </svg>
              <span className="text-sm text-[var(--text-1)] font-medium">{t("booking.bookingConfirmed")}</span>
            </div>
          </div>
        </div>

        <a
          href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("booking.whatsappConfirmMsg"))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full max-w-xs mx-auto px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity mb-4"
          data-testid="button-whatsapp-booking"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.11 1.521 5.838L0 24l6.335-1.488A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.924 0-3.753-.52-5.354-1.429l-.384-.228-3.965.932.998-3.848-.25-.398A9.717 9.717 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75S21.75 6.615 21.75 12s-4.365 9.75-9.75 9.75z"/></svg>
          {t("booking.whatsappCta")}
        </a>

        <button
          onClick={() => {
            setStep("date");
            setSelectedDate(null);
            setSelectedTime(null);
            setFormData({ name: "", lastName: "", email: "", phone: "", beneficioMensual: "", clientesMundiales: null, operaDigital: null, notaCompartir: "", compromisoAsistir: null });
            setBookingResult(null);
            setPrivacyAccepted(false);
            setMarketingAccepted(false);
            setPrivacyError(false);
            setCompromisoError(false);
            setPhoneError(false);
          }}
          className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          data-testid="button-new-booking"
        >
          {t("booking.newBooking")}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-[var(--radius-lg)] !border-[rgba(0,229,16,0.20)]" data-testid="booking-calendar">
      {inlineMsg.type && <div style={{ padding: "8px 16px" }}><InlineMessage msg={inlineMsg} /></div>}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          {step !== "qualify" && (
            <button
              onClick={() => {
                if (step === "form") { setStep("time"); setSelectedTime(null); }
                else if (step === "time") { setStep("date"); setSelectedDate(null); }
                else if (step === "date") { setStep("qualify"); }
              }}
              className="w-8 h-8 rounded-full hover:bg-[var(--green-dim)] flex items-center justify-center transition-colors"
              aria-label={t("booking.backStep")}
              data-testid="button-back"
            >
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <span className="font-heading font-semibold text-[var(--text-1)]">
            {step === "qualify" && t("booking.qualifyTitle")}
            {step === "date" && t("booking.selectDate")}
            {step === "time" && selectedDateFormatted}
            {step === "form" && `${selectedDateFormatted} ${t("booking.atTime", { time: selectedTime })}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!hasPrefilledQualify && <span className={`w-2 h-2 rounded-full ${step === "qualify" ? "bg-[#00E510]" : "bg-[rgba(0,229,16,0.18)]"}`} />}
          <span className={`w-2 h-2 rounded-full ${step === "date" ? "bg-[#00E510]" : "bg-[rgba(0,229,16,0.18)]"}`} />
          <span className={`w-2 h-2 rounded-full ${step === "time" ? "bg-[#00E510]" : "bg-[rgba(0,229,16,0.18)]"}`} />
          <span className={`w-2 h-2 rounded-full ${step === "form" ? "bg-[#00E510]" : "bg-[rgba(0,229,16,0.18)]"}`} />
        </div>
      </div>

      <div className="p-6">
        {step === "qualify" && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.beneficioLabel")} <span className="text-[#00E510]/70">*</span></label>
              <select
                required
                value={formData.beneficioMensual}
                onChange={(e) => setFormData({ ...formData, beneficioMensual: e.target.value })}
                className="w-full rounded-full py-2.5 px-5 text-sm text-[var(--text-1)] bg-[var(--bg-1)] border border-[var(--border)] focus:outline-none focus:border-[#00E510] transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
                data-testid="select-beneficio"
              >
                <option value="" disabled>{t("booking.beneficioPlaceholder")}</option>
                {BENEFICIO_KEYS.map((key, idx) => (
                  <option key={key} value={key}>{Array.isArray(beneficioOptions) && beneficioOptions[idx] ? beneficioOptions[idx] : key}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-2 block">
                {t("booking.clientesMundialesLabel")} <span className="text-[#00E510]/70">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, clientesMundiales: true })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.clientesMundiales === true
                      ? "border-[#00E510] bg-[#00E510]/10 text-[#00E510]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00E510]/40"
                  }`}
                  data-testid="button-clientes-mundiales-si"
                >
                  {t("booking.si")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, clientesMundiales: false })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.clientesMundiales === false
                      ? "border-[#00E510] bg-[#00E510]/10 text-[#00E510]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00E510]/40"
                  }`}
                  data-testid="button-clientes-mundiales-no"
                >
                  {t("booking.no")}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-2 block">
                {t("booking.operaDigitalLabel")} <span className="text-[#00E510]/70">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, operaDigital: true })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.operaDigital === true
                      ? "border-[#00E510] bg-[#00E510]/10 text-[#00E510]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00E510]/40"
                  }`}
                  data-testid="button-opera-digital-si"
                >
                  {t("booking.si")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, operaDigital: false })}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.operaDigital === false
                      ? "border-[#00E510] bg-[#00E510]/10 text-[#00E510]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00E510]/40"
                  }`}
                  data-testid="button-opera-digital-no"
                >
                  {t("booking.no")}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-2 block">
                {t("booking.compromisoLabel")} <span className="text-[#00E510]/70">*</span>
              </label>
              <p className="text-xs text-[var(--text-2)] mb-3 leading-relaxed">{t("booking.compromisoDesc")}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, compromisoAsistir: true }); setCompromisoError(false); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.compromisoAsistir === true
                      ? "border-[#00E510] bg-[#00E510]/10 text-[#00E510]"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-[#00E510]/40"
                  }`}
                  data-testid="button-compromiso-si"
                >
                  {t("booking.compromisoSi")}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, compromisoAsistir: false }); setCompromisoError(false); }}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                    formData.compromisoAsistir === false
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-[var(--border)] text-[var(--text-2)] hover:border-red-500/40"
                  }`}
                  data-testid="button-compromiso-no"
                >
                  {t("booking.compromisoNo")}
                </button>
              </div>
              {compromisoError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5" data-testid="text-compromiso-error">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {t("booking.compromisoError")}
                </p>
              )}
              {formData.compromisoAsistir === false && (
                <div className="glass rounded-xl p-3 mt-3 !border-red-500/20 text-xs text-red-400 leading-relaxed" data-testid="text-compromiso-warning">
                  {t("booking.compromisoWarning")}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (formData.compromisoAsistir !== true) {
                  setCompromisoError(true);
                  return;
                }
                setCompromisoError(false);
                setStep("date");
              }}
              disabled={!formData.beneficioMensual || formData.clientesMundiales === null || formData.operaDigital === null || formData.compromisoAsistir !== true}
              className="w-full inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,opacity,transform] duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
              data-testid="button-qualify-next"
            >
              {t("booking.qualifyNext")}
            </button>
          </div>
        )}

        {step === "date" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="w-8 h-8 rounded-full hover:bg-[var(--green-dim)] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={t("booking.prevMonth")}
                data-testid="button-prev-month"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="font-body font-semibold text-[var(--text-1)]">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full hover:bg-[var(--green-dim)] flex items-center justify-center transition-colors"
                aria-label={t("booking.nextMonth")}
                data-testid="button-next-month"
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {daysShort.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-[var(--text-3)] py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />;
                const weekday = isWeekday(currentYear, currentMonth, day);
                const past = isPastDate(currentYear, currentMonth, day);
                const dateStr = formatDateISO(currentYear, currentMonth, day);
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === todayStr;
                const blocked = isBlockedDate(currentYear, currentMonth, day);
                const disabled = !weekday || past || blocked;

                return (
                  <button
                    key={day}
                    onClick={() => !disabled && handleDayClick(day)}
                    disabled={disabled}
                    title={blocked ? t("booking.dayBlocked") : undefined}
                    className={`relative aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 ${
                      disabled
                        ? blocked
                          ? "text-[var(--text-3)] opacity-30 cursor-not-allowed line-through"
                          : "text-[var(--text-3)] opacity-40 cursor-not-allowed"
                        : isSelected
                        ? "bg-[#00E510] text-[#0F1A14] shadow-[var(--shadow-green)]"
                        : "text-[var(--text-1)] hover:bg-[var(--green-dim)] cursor-pointer"
                    }`}
                    data-testid={`day-${day}`}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00E510]" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[var(--text-3)] mt-4 text-center">
              {t("booking.availableHours")}
            </p>
          </div>
        )}

        {step === "time" && (
          <div>
            <p className="text-sm text-[var(--text-2)] mb-4">{t("booking.selectTime")}</p>
            {slotsQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#00E510] border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-sm text-[var(--text-2)]">{t("booking.loadingSlots")}</span>
              </div>
            ) : slotsQuery.isError ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-2)]">{t("booking.slotsError")}</p>
                <button
                  onClick={() => slotsQuery.refetch()}
                  className="mt-4 text-sm text-[#00E510] font-medium hover:underline"
                >
                  {t("booking.retry")}
                </button>
              </div>
            ) : slotsQuery.data?.slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--text-2)]">{t("booking.noSlots")}</p>
                <button
                  onClick={() => { setStep("date"); setSelectedDate(null); }}
                  className="mt-4 text-sm text-[#00E510] font-medium hover:underline"
                >
                  {t("booking.chooseOther")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[320px] overflow-y-auto pr-1">
                {slotsQuery.data?.slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => handleTimeClick(slot)}
                    className={`text-sm font-body font-medium rounded-full py-3 px-2 border transition-colors duration-150 tabular-nums ${
                      selectedTime === slot
                        ? "bg-[#00E510] text-[#0B0D0C] border-[#00E510] shadow-[var(--shadow-green)]"
                        : "bg-[var(--bg-1)] border-[var(--border)] hover:border-[#00E510]/40 text-[var(--text-1)]"
                    }`}
                    data-testid={`slot-${slot.replace(":", "")}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.firstNameLabel")}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-full py-2.5 px-5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] bg-[var(--bg-1)] border border-[var(--border)] focus:outline-none focus:border-[#00E510] transition-colors"
                  placeholder={t("booking.firstNamePlaceholder")}
                  data-testid="input-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.lastNameLabel")}</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-full py-2.5 px-5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] bg-[var(--bg-1)] border border-[var(--border)] focus:outline-none focus:border-[#00E510] transition-colors"
                  placeholder={t("booking.lastNamePlaceholder")}
                  data-testid="input-lastName"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.emailLabel")}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-full py-2.5 px-5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] bg-[var(--bg-1)] border border-[var(--border)] focus:outline-none focus:border-[#00E510] transition-colors"
                placeholder={t("booking.emailPlaceholder")}
                data-testid="input-email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.phoneLabel")}</label>
              <PhoneInput
                value={formData.phone}
                onChange={(v) => {
                  setFormData({ ...formData, phone: v });
                  setPhoneError(false);
                }}
                placeholder={t("booking.phonePlaceholder")}
                error={phoneError}
                data-testid="input-phone"
              />
              {phoneError && (
                <p className="text-xs text-red-500 mt-1">{t("booking.phoneError")}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text-1)] mb-1 block">{t("booking.notaCompartirLabel")}</label>
              <textarea
                value={formData.notaCompartir}
                onChange={(e) => setFormData({ ...formData, notaCompartir: e.target.value })}
                className="w-full rounded-[20px] py-2.5 px-5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] bg-[var(--bg-1)] border border-[var(--border)] focus:outline-none focus:border-[#00E510] transition-colors resize-none"
                rows={3}
                placeholder={t("booking.notaCompartirPlaceholder")}
                data-testid="input-nota-compartir"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={`flex items-start gap-3 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 px-4 py-3 ${
                privacyAccepted
                  ? "border-[#00E510]/40 bg-[#00E510]/5"
                  : privacyError
                  ? "border-red-500/50 bg-red-50"
                  : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[#00E510]/25"
              }`}>
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => { setPrivacyAccepted(e.target.checked); setPrivacyError(false); }}
                  className="sr-only"
                  data-testid="checkbox-privacy"
                />
                <span className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-[color,background-color,border-color,opacity,transform] duration-200 ${
                  privacyAccepted ? "bg-[#00E510] border-[#00E510]" : privacyError ? "border-red-500" : "border-[var(--border)] bg-transparent"
                }`}>
                  {privacyAccepted && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="text-xs text-[var(--text-3)] leading-relaxed">
                  {t("booking.privacyLabel")}{" "}
                  <a href={lp("legal_privacy")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#00E510] underline hover:text-[#00E510]/80">{t("booking.privacyPolicy")}</a>
                  {" "}{t("booking.privacyConsent")}{" "}
                  <a href={lp("legal_terms")} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#00E510] underline hover:text-[#00E510]/80">{t("booking.termsConditions")}</a>.{" "}
                  <span className="text-[#00E510]/70">*</span>
                </span>
              </label>
              {privacyError && (
                <p className="text-xs text-red-400 pl-1 flex items-center gap-1.5" data-testid="text-privacy-error">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M6 4v2.5M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {t("booking.privacyError")}
                </p>
              )}
              <label className={`flex items-start gap-3 cursor-pointer rounded-xl border transition-[color,background-color,border-color,opacity,transform] duration-200 px-4 py-3 ${
                marketingAccepted
                  ? "border-[#00E510]/40 bg-[#00E510]/5"
                  : "border-[var(--border)] bg-[var(--bg-1)] hover:border-[#00E510]/25"
              }`}>
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="sr-only"
                  data-testid="checkbox-marketing"
                />
                <span className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-[color,background-color,border-color,opacity,transform] duration-200 ${
                  marketingAccepted ? "bg-[#00E510] border-[#00E510]" : "border-[var(--border)] bg-transparent"
                }`}>
                  {marketingAccepted && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#0B0D0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className="text-xs text-[var(--text-3)] leading-relaxed">
                  {t("booking.marketingLabel")}{" "}
                  <span className="text-[var(--text-3)]/60">{t("booking.marketingOptional")}</span>
                </span>
              </label>
            </div>

            {bookMutation.isError && (
              <div className="glass rounded-xl p-3 !border-red-500/30 text-red-400 text-sm" data-testid="booking-error">
                {(bookMutation.error as Error)?.message || t("booking.bookingError")}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={bookMutation.isPending || !formData.name || !formData.email || !formData.phone}
                className="w-full inline-flex items-center justify-center bg-[#00E510] hover:bg-[#00E510] text-[#0B0D0C] font-body font-semibold px-6 py-3 text-sm rounded-full shadow-[var(--shadow-green)] hover:shadow-[var(--shadow-green-lg)] active:scale-[0.97] transition-[color,background-color,border-color,opacity,transform] duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                data-testid="button-confirm-booking"
              >
                {bookMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-[var(--text-1)] border-t-transparent rounded-full animate-spin" />
                ) : (
                  t("booking.submitCta")
                )}
              </button>


              <a
                href={`${CONTACT.WHATSAPP_URL}?text=${encodeURIComponent(t("booking.whatsappConfirmMsg"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[var(--bg-1)] border border-[var(--border)] hover:border-[#00E510]/40 text-[#00E510] font-body font-semibold px-6 py-3 text-sm rounded-full transition-[color,background-color,border-color,opacity,transform] duration-200"
                data-testid="button-booking-whatsapp"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t("booking.whatsappConfirmCta")}
              </a>
            </div>

            <p className="text-xs text-[var(--text-3)] text-center">
              {t("booking.confirmationNote")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
