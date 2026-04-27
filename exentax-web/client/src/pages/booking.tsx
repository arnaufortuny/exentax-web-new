import { useState } from "react";
import { useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLangPath } from "@/hooks/useLangPath";
import { CheckCircleIcon, XCircleIcon, SpinnerIcon, CalendarIcon, ClockCircleIcon, VideoIcon, ArrowLeftIcon, CalendarXIcon, CalendarClockIcon, PhoneIcon } from "@/components/icons";
import { BRAND } from "@/lib/constants";
import SEO from "@/components/SEO";
import { todayMadridISO, tomorrowMadridISO, addDaysMadridISO } from "@/lib/madrid-time";
import { toast } from "@/components/Toast";
import MiniCalendar from "@/components/MiniCalendar";

const RESCHEDULE_ERROR_KEYS: Record<string, string> = {
  SLOT_TAKEN: "agenda.errSlotTaken",
  PAST_DATE: "agenda.errPastDate",
  PAST_TIME: "agenda.errPastDate",
  PAST_BOOKING: "agenda.errPastDate",
  BLOCKED_DATE: "agenda.errBlocked",
  SAME_SLOT: "agenda.errSameSlot",
  BOOKING_CANCELLED: "agenda.errCancelled",
  INVALID_DATE: "agenda.errInvalidDate",
  INVALID_TIME: "agenda.errInvalidTime",
};

async function extractRescheduleErrorCode(err: unknown): Promise<string | null> {
  try {
    const anyErr = err as { response?: Response; status?: number; message?: string } | null;
    if (anyErr && anyErr.response && typeof anyErr.response.json === "function") {
      const body = await anyErr.response.json().catch(() => null);
      const code = body && typeof body === "object" ? (body as { code?: string }).code : null;
      if (typeof code === "string") return code;
    }
    const msg = (anyErr && anyErr.message) || "";
    const m = /^(\d{3}):\s*(\{.*\})\s*$/.exec(msg);
    if (m) {
      const body = JSON.parse(m[2]);
      if (body && typeof body.code === "string") return body.code;
    }
  } catch {}
  return null;
}

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};

const STATUS = {
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
  NO_SHOW: "no_show",
} as const;

interface BookingData {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  googleMeet: string | null;
  meetingType?: "google_meet" | "phone_call";
  phone?: string | null;
  status: string;
  isPast: boolean;
}

function formatDate(d: string, locale: string) {
  if (!d) return "–";
  try {
    return new Date(d + "T12:00:00").toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

const BADGE_BASE = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold";

function StatusBadge({ status, isPast }: { status: string; isPast: boolean }) {
  const { t } = useTranslation();
  if (status === STATUS.CANCELLED) return <span data-testid="badge-status-cancelled" className={BADGE_BASE} style={{ background: "rgba(220,38,38,0.10)", color: "var(--error)" }}><XCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.cancelled")}</span>;
  if (status === STATUS.NO_SHOW) return <span data-testid="badge-status-noshow" className={BADGE_BASE} style={{ background: "rgba(220,38,38,0.10)", color: "var(--error)" }}><XCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.noShow")}</span>;
  if (status === STATUS.RESCHEDULED) return <span data-testid="badge-status-rescheduled" className={BADGE_BASE} style={{ background: "rgba(37,99,235,0.10)", color: "var(--info)" }}><CalendarClockIcon className="w-3.5 h-3.5" />{t("agenda.status.rescheduled")}</span>;
  if (isPast) return <span data-testid="badge-status-completed" className={BADGE_BASE} style={{ background: "var(--bg-2)", color: "var(--muted)" }}><CheckCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.completed")}</span>;
  return <span data-testid="badge-status-confirmed" className={BADGE_BASE} style={{ background: "var(--green-soft)", color: "var(--green-hover)" }}><CheckCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.confirmed")}</span>;
}

function getEndTimeClient(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + 30;
  return `${Math.floor(totalMin / 60).toString().padStart(2, "0")}:${(totalMin % 60).toString().padStart(2, "0")}`;
}

function RescheduleForm({ bookingId, tokenQs, onSuccess }: { bookingId: string; tokenQs: string; onSuccess: () => void }) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [rescheduleErrorKey, setRescheduleErrorKey] = useState<string>("agenda.rescheduleError");

  const { data: availableSlots, isLoading: slotsLoading, isError: slotsError } = useQuery<Array<{ time: string; endTime: string }>>({
    queryKey: ["/api/bookings/available-slots", selectedDate],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/bookings/available-slots?date=${selectedDate}`);
      const data = await res.json();
      const slots: string[] = data?.slots || [];
      return slots.map(s => ({ time: s, endTime: getEndTimeClient(s) }));
    },
    enabled: !!selectedDate,
    retry: 1,
  });

  const rescheduleMutation = useMutation({
    mutationFn: async () => {
      const [startTime] = selectedSlot.split("|");
      const res = await apiRequest("POST", `/api/booking/${bookingId}/reschedule${tokenQs}`, { date: selectedDate, startTime });
      return res.json();
    },
    onSuccess: () => {
      toast.success(t("agenda.toastRescheduleSuccess"));
      onSuccess();
    },
    onError: async (err) => {
      const code = await extractRescheduleErrorCode(err);
      const key = (code && RESCHEDULE_ERROR_KEYS[code]) || "agenda.rescheduleError";
      setRescheduleErrorKey(key);
      toast.error(t(key));
      if (code === "SLOT_TAKEN") {
        qc.invalidateQueries({ queryKey: ["/api/bookings/available-slots", selectedDate] });
        setSelectedSlot("");
      }
    },
  });

  const minDate = tomorrowMadridISO();
  const maxDate = addDaysMadridISO(todayMadridISO(), 30);

  return (
    <div className="space-y-4 font-body">
      <div>
        <label className="block text-sm font-body font-medium text-[var(--text-2)] mb-2">{t("agenda.selectNewDate")}</label>
        <MiniCalendar
          value={selectedDate}
          onChange={(iso) => { setSelectedDate(iso); setSelectedSlot(""); }}
          minDate={minDate}
          maxDate={maxDate}
          testIdPrefix="reschedule-calendar"
        />
      </div>

      {selectedDate && (
        <div>
          <label className="block text-sm font-body font-medium text-[var(--text-2)] mb-2">{t("agenda.selectTime")}</label>
          {slotsLoading ? (
            <div className="flex items-center justify-center py-4">
              <SpinnerIcon className="w-5 h-5 animate-spin text-[var(--muted)]" />
            </div>
          ) : slotsError ? (
            <div className="flex items-center gap-2 p-3 rounded-token-sm font-body text-sm" style={{ background: "rgba(220,38,38,0.08)", color: "var(--error)" }}>
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              {t("agenda.slotsError")}
            </div>
          ) : availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === `${slot.time}|${slot.endTime}`;
                return (
                  <button
                    key={slot.time}
                    data-testid={`button-slot-${slot.time}`}
                    onClick={() => setSelectedSlot(`${slot.time}|${slot.endTime}`)}
                    className={`px-3 py-2.5 rounded-full font-body text-sm font-medium transition-all ${
                      isSelected
                        ? "btn-primary"
                        : "bg-[var(--bg-2)] text-[var(--text-2)] hover:bg-[var(--bg-1)] border border-[var(--border)]"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm font-body text-[var(--muted)] text-center py-4">{t("agenda.noSlotsAvailable")}</p>
          )}
        </div>
      )}

      {rescheduleMutation.isError && (
        <div data-testid="text-reschedule-error" className="flex items-center gap-2 p-3 rounded-token-sm font-body text-sm" style={{ background: "rgba(220,38,38,0.08)", color: "var(--error)" }}>
          <XCircleIcon className="w-4 h-4 flex-shrink-0" />
          {t(rescheduleErrorKey)}
        </div>
      )}

      <button
        data-testid="button-confirm-reschedule"
        onClick={() => rescheduleMutation.mutate()}
        disabled={!selectedSlot || rescheduleMutation.isPending}
        className="w-full btn-primary py-3.5 px-8 rounded-full font-body font-semibold text-base"
      >
        {rescheduleMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <SpinnerIcon className="w-4 h-4 animate-spin" />
            {t("agenda.rescheduling")}
          </span>
        ) : t("agenda.confirmNewDate")}
      </button>
    </div>
  );
}

function ManageBookingContent({ booking, tokenQs, urlToken, dateLocale }: { booking: BookingData; tokenQs: string; urlToken: string; dateLocale: string }) {
  const { t } = useTranslation();
  const lp = useLangPath();
  const [view, setView] = useState<"main" | "reschedule" | "cancel-confirm">("main");
  const [actionDone, setActionDone] = useState<"cancelled" | "rescheduled" | null>(null);
  const qc = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/booking/${booking.id}/cancel${tokenQs}`);
    },
    onSuccess: () => {
      setActionDone("cancelled");
      toast.success(t("agenda.toastCancelSuccess"));
      qc.invalidateQueries({ queryKey: ["/api/booking", booking.id] });
    },
    onError: () => {
      toast.error(t("agenda.toastCancelError"));
    },
  });

  const isCancelled = booking.status === STATUS.CANCELLED || actionDone === "cancelled";
  const canManage = !booking.isPast && !isCancelled;

  if (actionDone === "rescheduled") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--green-soft)" }}>
          <CalendarClockIcon className="w-8 h-8" style={{ color: "var(--green)" }} />
        </div>
        <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-2">{t("agenda.rescheduledTitle")}</h2>
        <p className="font-body text-sm text-[var(--muted)]">{t("agenda.rescheduledDesc")}</p>
      </div>
    );
  }

  if (actionDone === "cancelled") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(220,38,38,0.10)" }}>
          <CalendarXIcon className="w-8 h-8" style={{ color: "var(--error)" }} />
        </div>
        <h2 className="font-heading font-bold text-xl text-[var(--text-1)] mb-2">{t("agenda.cancelledTitle")}</h2>
        <p className="font-body text-sm text-[var(--muted)]">{t("agenda.cancelledDesc")}</p>
        <a href={lp("book")} data-testid="link-new-booking" className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 btn-primary rounded-full font-body text-base font-semibold">
          {t("agenda.bookNew")}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-body text-[var(--muted)] mb-0.5">{t("agenda.date")}</p>
            <p data-testid="text-meeting-date" className="text-sm font-body font-semibold text-[var(--text-1)] capitalize">{formatDate(booking.date, dateLocale)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ClockCircleIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-body text-[var(--muted)] mb-0.5">{t("agenda.time")}</p>
            <p data-testid="text-meeting-time" className="text-sm font-body font-semibold text-[var(--text-1)]">{booking.startTime}, {booking.endTime}</p>
            <p className="text-[11px] font-body text-[var(--muted)] mt-0.5">{t("agenda.timezone")}</p>
          </div>
        </div>
        {!isCancelled && booking.meetingType === "phone_call" && (
          <div className="flex items-start gap-3">
            <PhoneIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-body text-[var(--muted)] mb-0.5">{t("agenda.modality")}</p>
              <p data-testid="text-phone-call" className="text-sm font-body font-medium" style={{ color: "var(--green-hover)" }}>
                {t("agenda.willCallYouAt", { phone: booking.phone || "" })}
              </p>
            </div>
          </div>
        )}
        {!isCancelled && booking.meetingType !== "phone_call" && booking.googleMeet && (
          <div className="flex items-start gap-3">
            <VideoIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-body text-[var(--muted)] mb-0.5">{t("agenda.videoCall")}</p>
              <a data-testid="link-google-meet" href={booking.googleMeet} target="_blank" rel="noopener noreferrer" className="text-sm font-body font-medium break-all" style={{ color: "var(--green-hover)" }}>
                {t("agenda.joinCall")}
              </a>
            </div>
          </div>
        )}
      </div>

      {canManage && view === "main" && (
        <div className="px-6 pb-6 space-y-3">
          <button
            data-testid="button-reschedule"
            onClick={() => setView("reschedule")}
            className="btn-outline-green w-full py-3.5 px-8 rounded-full font-body font-semibold text-base flex items-center justify-center gap-2"
          >
            <CalendarClockIcon className="w-4 h-4" />
            {t("agenda.reschedule")}
          </button>
          <button
            data-testid="button-cancel-booking"
            onClick={() => setView("cancel-confirm")}
            className="w-full py-3.5 px-8 rounded-full font-body font-semibold text-base border-2 transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
            style={{ borderColor: "rgba(220,38,38,0.30)", color: "var(--error)", background: "transparent" }}
          >
            <CalendarXIcon className="w-4 h-4" />
            {t("agenda.cancel")}
          </button>
        </div>
      )}

      {canManage && view === "reschedule" && (
        <div className="px-6 pb-6">
          <button data-testid="button-reschedule-back" onClick={() => setView("main")} className="text-xs font-body text-[var(--muted)] hover:text-[var(--text-2)] mb-4 flex items-center gap-1">
            <ArrowLeftIcon className="w-3 h-3" /> {t("agenda.back")}
          </button>
          <RescheduleForm bookingId={booking.id} tokenQs={tokenQs} onSuccess={() => { setActionDone("rescheduled"); qc.invalidateQueries({ queryKey: ["/api/booking", booking.id] }); }} />
        </div>
      )}

      {canManage && view === "cancel-confirm" && (
        <div className="px-6 pb-6 space-y-4">
          <button data-testid="button-cancel-back" onClick={() => setView("main")} className="text-xs font-body text-[var(--muted)] hover:text-[var(--text-2)] mb-2 flex items-center gap-1">
            <ArrowLeftIcon className="w-3 h-3" /> {t("agenda.back")}
          </button>
          <div className="rounded-token-lg p-5 text-center" style={{ background: "rgba(220,38,38,0.08)" }}>
            <CalendarXIcon className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--error)" }} />
            <p className="text-sm font-body font-semibold text-[var(--text-1)] mb-1">{t("agenda.cancelConfirmTitle")}</p>
            <p className="text-xs font-body text-[var(--muted)]">{t("agenda.cancelConfirmDesc")}</p>
          </div>
          {cancelMutation.isError && (
            <div className="flex items-center gap-2 p-3 rounded-token-sm font-body text-sm" style={{ background: "rgba(220,38,38,0.08)", color: "var(--error)" }}>
              <XCircleIcon className="w-4 h-4" /> {t("agenda.cancelError")}
            </div>
          )}
          <button
            data-testid="button-confirm-cancel"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="btn-destructive w-full py-3.5 px-8 rounded-full font-body font-semibold text-base flex items-center justify-center gap-2"
          >
            {cancelMutation.isPending ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <CalendarXIcon className="w-4 h-4" />}
            {cancelMutation.isPending ? t("agenda.cancelling") : t("agenda.confirmCancel")}
          </button>
        </div>
      )}

      {!canManage && !isCancelled && booking.isPast && (
        <div className="px-6 pb-6">
          <div className="rounded-token-lg p-5 text-center" style={{ background: "var(--bg-2)" }}>
            <p className="text-sm font-body text-[var(--muted)]">{t("agenda.pastSession")}</p>
            <a href={lp("book")} data-testid="link-book-again" className="mt-3 inline-flex items-center gap-2 px-8 py-3.5 btn-primary rounded-full font-body text-base font-semibold">
              {t("agenda.bookAnother")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MiAgendaPage() {
  const { t, i18n } = useTranslation();
  const params = useParams<{ token: string }>();
  const bookingId = params.token;
  const urlToken = new URLSearchParams(window.location.search).get("token") || "";
  const tokenQs = urlToken ? `?token=${encodeURIComponent(urlToken)}` : "";
  const lang = (i18n.language || "es").split("-")[0];
  const dateLocale = LANG_LOCALE_MAP[lang] ?? LANG_LOCALE_MAP.es;

  const { data: booking, isLoading, isError } = useQuery<BookingData>({
    queryKey: ["/api/booking", bookingId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/booking/${bookingId}${tokenQs}`);
      return res.json();
    },
    enabled: !!bookingId,
  });

  const seoTag = <SEO title={`${t("agenda.yourSession")} | ${BRAND.NAME}`} noindex />;

  if (isLoading) {
    return (
      <>{seoTag}
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src="/logo-tight.png" alt={BRAND.NAME} width={120} height={32} loading="eager" decoding="async" className="w-[120px] h-auto mb-6 opacity-60" data-testid="img-logo-booking-loading" />
          <SpinnerIcon className="w-8 h-8 animate-spin text-[var(--muted)]" />
        </div>
      </div>
      </>
    );
  }

  if (isError || !booking) {
    return (
      <>{seoTag}
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center p-4">
        <div className="max-w-sm text-center">
          <img src="/logo-tight.png" alt={BRAND.NAME} width={120} height={32} loading="eager" decoding="async" className="w-[120px] h-auto mx-auto mb-6 opacity-60" data-testid="img-logo-booking-error" />
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(220,38,38,0.10)" }}>
            <XCircleIcon className="w-7 h-7" style={{ color: "var(--error)" }} />
          </div>
          <h1 className="font-heading text-lg font-bold text-[var(--text-1)] mb-2">{t("agenda.notFound")}</h1>
          <p className="font-body text-sm text-[var(--muted)] mb-6">{t("agenda.notFoundDesc")}</p>
          <a href="/" data-testid="link-back-to-site" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full font-body text-sm font-medium bg-[var(--bg-2)] text-[var(--text-2)] hover:bg-[var(--bg-1)] transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            {t("agenda.backToSite")}
          </a>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      {seoTag}
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo-tight.png" alt={BRAND.NAME} width={140} height={37} loading="eager" decoding="async" fetchPriority="high" className="w-[140px] h-auto mb-2" data-testid="img-logo-booking" />
          </div>

          <div className="bg-[var(--card-bg-solid)] rounded-token-lg shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body text-[var(--muted)] font-medium mb-0.5">{t("agenda.yourSession")}</p>
                  <h1 data-testid="text-client-name" className="font-heading text-lg font-bold text-[var(--text-1)]">{booking.name}</h1>
                  <p className="text-[11px] font-body text-[var(--muted)] mt-0.5">{t("agenda.sessionType")}</p>
                </div>
                <StatusBadge status={booking.status} isPast={booking.isPast} />
              </div>
            </div>

            <ManageBookingContent booking={booking} tokenQs={tokenQs} urlToken={urlToken} dateLocale={dateLocale} />
          </div>

          <div className="mt-6 text-center">
            <a href="/" data-testid="link-booking-home" className="inline-flex items-center gap-1.5 font-body text-xs text-[var(--muted)] hover:text-[var(--text-2)] transition-colors">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              {BRAND.NAME.toLowerCase()}.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
