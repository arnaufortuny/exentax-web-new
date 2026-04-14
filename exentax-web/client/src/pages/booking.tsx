import { useState } from "react";
import { useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLangPath } from "@/hooks/useLangPath";
import { CheckCircleIcon, XCircleIcon, SpinnerIcon, CalendarIcon, ClockCircleIcon, VideoIcon, ArrowLeftIcon, CalendarXIcon, CalendarClockIcon } from "@/components/icons";
import { BRAND } from "@/lib/constants";
import SEO from "@/components/SEO";

const LANG_LOCALE_MAP: Record<string, string> = {
  es: "es-ES", en: "en-US", fr: "fr-FR", de: "de-DE", pt: "pt-PT", ca: "ca-ES",
};

interface BookingData {
  id: string;
  nombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  googleMeet: string | null;
  estado: string;
  isPast: boolean;
}

function formatDate(d: string, locale: string = "es-ES") {
  if (!d) return "—";
  try {
    return new Date(d + "T12:00:00").toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
}

function StatusBadge({ estado, isPast }: { estado: string; isPast: boolean }) {
  const { t } = useTranslation();
  if (estado === "Cancelada" || estado === "Cancelado") return <span data-testid="badge-status-cancelled" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"><XCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.cancelled")}</span>;
  if (estado === "No presentado") return <span data-testid="badge-status-noshow" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"><XCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.noShow")}</span>;
  if (estado === "Reagendada") return <span data-testid="badge-status-rescheduled" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"><CalendarClockIcon className="w-3.5 h-3.5" />{t("agenda.status.rescheduled")}</span>;
  if (isPast) return <span data-testid="badge-status-completed" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-2)] text-[var(--muted)]"><CheckCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.completed")}</span>;
  return <span data-testid="badge-status-confirmed" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(0,229,16,0.08)", color: "#00E510" }}><CheckCircleIcon className="w-3.5 h-3.5" />{t("agenda.status.confirmed")}</span>;
}

function getEndTimeClient(startTime: string): string {
  const [h, m] = startTime.split(":").map(Number);
  const totalMin = h * 60 + m + 30;
  return `${Math.floor(totalMin / 60).toString().padStart(2, "0")}:${(totalMin % 60).toString().padStart(2, "0")}`;
}

function RescheduleForm({ bookingId, tokenQs, onSuccess }: { bookingId: string; tokenQs: string; onSuccess: () => void }) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const { data: availableSlots, isLoading: slotsLoading, isError: slotsError } = useQuery<Array<{ time: string; endTime: string }>>({
    queryKey: ["/api/bookings/available-slots", selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/available-slots?date=${selectedDate}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load slots");
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
    onSuccess: () => onSuccess(),
  });

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-2)] mb-2">{t("agenda.selectNewDate")}</label>
        <input
          data-testid="input-reschedule-date"
          type="date"
          min={minDate}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(""); }}
          className="w-full px-4 py-3 rounded-full border border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-1)] text-sm outline-none transition-all"
          style={{ boxShadow: selectedDate ? "0 0 0 2px rgba(0,229,16,0.2)" : "none", borderColor: selectedDate ? "rgba(0,229,16,0.4)" : undefined }}
        />
      </div>

      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-2)] mb-2">{t("agenda.selectTime")}</label>
          {slotsLoading ? (
            <div className="flex items-center justify-center py-4">
              <SpinnerIcon className="w-5 h-5 animate-spin text-[var(--muted)]" />
            </div>
          ) : slotsError ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              {t("agenda.slotsError")}
            </div>
          ) : availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  data-testid={`button-slot-${slot.time}`}
                  onClick={() => setSelectedSlot(`${slot.time}|${slot.endTime}`)}
                  className={`px-3 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedSlot === `${slot.time}|${slot.endTime}`
                      ? "text-black shadow-md"
                      : "bg-[var(--bg-2)] text-[var(--text-2)] hover:bg-[var(--bg-1)] border border-[var(--border)]"
                  }`}
                  style={selectedSlot === `${slot.time}|${slot.endTime}` ? { background: "#00E510" } : undefined}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] text-center py-4">{t("agenda.noSlotsAvailable")}</p>
          )}
        </div>
      )}

      {rescheduleMutation.isError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">
          <XCircleIcon className="w-4 h-4 flex-shrink-0" />
          {t("agenda.rescheduleError")}
        </div>
      )}

      <button
        data-testid="button-confirm-reschedule"
        onClick={() => rescheduleMutation.mutate()}
        disabled={!selectedSlot || rescheduleMutation.isPending}
        className="w-full py-3.5 px-8 rounded-full font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
        style={{ background: rescheduleMutation.isPending ? "#6B7280" : "#00E510", color: rescheduleMutation.isPending ? "#fff" : "#000", boxShadow: rescheduleMutation.isPending ? "none" : "0 8px 24px rgba(0,229,16,0.15)" }}
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
      qc.invalidateQueries({ queryKey: ["/api/booking", booking.id] });
    },
  });

  const isCancelled = booking.estado === "Cancelada" || booking.estado === "Cancelado" || actionDone === "cancelled";
  const canManage = !booking.isPast && !isCancelled;

  if (actionDone === "rescheduled") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(0,229,16,0.08)" }}>
          <CalendarClockIcon className="w-8 h-8" style={{ color: "#00E510" }} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">{t("agenda.rescheduledTitle")}</h2>
        <p className="text-sm text-[var(--muted)]">{t("agenda.rescheduledDesc")}</p>
      </div>
    );
  }

  if (actionDone === "cancelled") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4">
          <CalendarXIcon className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-2">{t("agenda.cancelledTitle")}</h2>
        <p className="text-sm text-[var(--muted)]">{t("agenda.cancelledDesc")}</p>
        <a href={lp("/agendar-asesoria")} data-testid="link-new-booking" className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold active:scale-[0.97] transition-all" style={{ background: "#00E510", color: "#000", boxShadow: "0 8px 24px rgba(0,229,16,0.15)" }}>
          {t("agenda.bookNew")}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-start gap-3">
          <CalendarIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)] mb-0.5">{t("agenda.date")}</p>
            <p data-testid="text-meeting-date" className="text-sm font-semibold text-[var(--text-1)] capitalize">{formatDate(booking.fecha, dateLocale)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ClockCircleIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--muted)] mb-0.5">{t("agenda.time")}</p>
            <p data-testid="text-meeting-time" className="text-sm font-semibold text-[var(--text-1)]">{booking.horaInicio} — {booking.horaFin}</p>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">{t("agenda.timezone")}</p>
          </div>
        </div>
        {booking.googleMeet && !isCancelled && (
          <div className="flex items-start gap-3">
            <VideoIcon className="w-4 h-4 text-[var(--muted)] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-[var(--muted)] mb-0.5">{t("agenda.videoCall")}</p>
              <a data-testid="link-google-meet" href={booking.googleMeet} target="_blank" rel="noopener noreferrer" className="text-sm font-medium break-all" style={{ color: "#00E510" }}>
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
            className="w-full py-3.5 px-8 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
            style={{ border: "2px solid rgba(0,229,16,0.4)", color: "#00E510", background: "rgba(0,229,16,0.04)" }}
          >
            <CalendarClockIcon className="w-4 h-4" />
            {t("agenda.reschedule")}
          </button>
          <button
            data-testid="button-cancel-booking"
            onClick={() => setView("cancel-confirm")}
            className="w-full py-3.5 px-8 rounded-full font-semibold text-base border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            <CalendarXIcon className="w-4 h-4" />
            {t("agenda.cancel")}
          </button>
        </div>
      )}

      {canManage && view === "reschedule" && (
        <div className="px-6 pb-6">
          <button data-testid="button-reschedule-back" onClick={() => setView("main")} className="text-xs text-[var(--muted)] hover:text-[var(--text-2)] mb-4 flex items-center gap-1">
            <ArrowLeftIcon className="w-3 h-3" /> {t("agenda.back")}
          </button>
          <RescheduleForm bookingId={booking.id} tokenQs={tokenQs} onSuccess={() => { setActionDone("rescheduled"); qc.invalidateQueries({ queryKey: ["/api/booking", booking.id] }); }} />
        </div>
      )}

      {canManage && view === "cancel-confirm" && (
        <div className="px-6 pb-6 space-y-4">
          <button data-testid="button-cancel-back" onClick={() => setView("main")} className="text-xs text-[var(--muted)] hover:text-[var(--text-2)] mb-2 flex items-center gap-1">
            <ArrowLeftIcon className="w-3 h-3" /> {t("agenda.back")}
          </button>
          <div className="bg-red-50 dark:bg-red-950/40 rounded-2xl p-5 text-center">
            <CalendarXIcon className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[var(--text-1)] mb-1">{t("agenda.cancelConfirmTitle")}</p>
            <p className="text-xs text-[var(--muted)]">{t("agenda.cancelConfirmDesc")}</p>
          </div>
          {cancelMutation.isError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-sm">
              <XCircleIcon className="w-4 h-4" /> {t("agenda.cancelError")}
            </div>
          )}
          <button
            data-testid="button-confirm-cancel"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
            className="w-full py-3.5 px-8 rounded-full font-semibold text-white text-base bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.97]"
          >
            {cancelMutation.isPending ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <CalendarXIcon className="w-4 h-4" />}
            {cancelMutation.isPending ? t("agenda.cancelling") : t("agenda.confirmCancel")}
          </button>
        </div>
      )}

      {!canManage && !isCancelled && booking.isPast && (
        <div className="px-6 pb-6">
          <div className="bg-[var(--bg-2)] rounded-2xl p-5 text-center">
            <p className="text-sm text-[var(--muted)]">{t("agenda.pastSession")}</p>
            <a href={lp("/agendar-asesoria")} data-testid="link-book-again" className="mt-3 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold active:scale-[0.97] transition-all" style={{ background: "#00E510", color: "#000", boxShadow: "0 8px 24px rgba(0,229,16,0.15)" }}>
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
  const dateLocale = LANG_LOCALE_MAP[lang] || "es-ES";

  const { data: booking, isLoading, isError } = useQuery<BookingData>({
    queryKey: ["/api/booking", bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/booking/${bookingId}${tokenQs}`, { credentials: "include" });
      if (!res.ok) throw new Error("Booking not found");
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
          <img src="/logo-tight.png" alt={BRAND.NAME} className="w-[120px] h-auto mb-6 opacity-60" data-testid="img-logo-booking-loading" />
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
          <img src="/logo-tight.png" alt={BRAND.NAME} className="w-[120px] h-auto mx-auto mb-6 opacity-60" data-testid="img-logo-booking-error" />
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-lg font-bold text-[var(--text-1)] mb-2">{t("agenda.notFound")}</h1>
          <p className="text-sm text-[var(--muted)] mb-6">{t("agenda.notFoundDesc")}</p>
          <a href="/" data-testid="link-back-to-site" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium bg-[var(--bg-2)] text-[var(--text-2)] hover:bg-[var(--bg-1)] transition-colors">
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
            <img src="/logo-tight.png" alt={BRAND.NAME} className="w-[140px] h-auto mb-2" data-testid="img-logo-booking" />
          </div>

          <div className="bg-[var(--card-bg)] rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-[var(--border)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wider mb-0.5">{t("agenda.yourSession")}</p>
                  <h1 data-testid="text-client-name" className="text-lg font-bold text-[var(--text-1)]">{booking.nombre}</h1>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">{t("agenda.sessionType")}</p>
                </div>
                <StatusBadge estado={booking.estado} isPast={booking.isPast} />
              </div>
            </div>

            <ManageBookingContent booking={booking} tokenQs={tokenQs} urlToken={urlToken} dateLocale={dateLocale} />
          </div>

          <div className="mt-6 text-center">
            <a href="/" data-testid="link-booking-home" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text-2)] transition-colors">
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              {BRAND.NAME.toLowerCase()}.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
