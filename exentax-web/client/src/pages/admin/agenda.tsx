import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  meetingDate: string | null;
  startTime: string | null;
  endTime: string | null;
  googleMeet: string | null;
  notes: string | null;
  context: string | null;
  status: string | null;
  language: string | null;
  ip: string | null;
  monthlyProfit: string | null;
  globalClients: string | null;
  digitalOperation: string | null;
  shareNote: string | null;
  privacy: boolean | null;
  marketing: boolean | null;
  rescheduleCount: number | null;
  lastRescheduledAt: string | null;
  cancelledAt: string | null;
  reminderSent: boolean | null;
  bookingDate: string | null;
  createdAt: string | null;
  manageUrl: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pendiente", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  contacted: { label: "Contactado", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  in_progress: { label: "En progreso", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  closed: { label: "Cerrada", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  cancelled: { label: "Cancelada", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  rescheduled: { label: "Reagendada", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  no_show: { label: "No-show", color: "#F97316", bg: "rgba(249,115,22,0.1)" },
};

const FLAG: Record<string, string> = { es: "\u{1F1EA}\u{1F1F8}", en: "\u{1F1EC}\u{1F1E7}", fr: "\u{1F1EB}\u{1F1F7}", de: "\u{1F1E9}\u{1F1EA}", pt: "\u{1F1F5}\u{1F1F9}", ca: "\u{1F3F4}" };

function getAdminToken(): string {
  return new URLSearchParams(window.location.search).get("adminToken") || "";
}

function apiUrl(path: string): string {
  const token = getAdminToken();
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}adminToken=${token}`;
}

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(apiUrl(path), {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  });
  return res.json();
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-5 space-y-3">
      <h3 className="font-heading text-sm font-semibold text-[var(--text-1)] uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-semibold">{label}</span>
      <span className={`text-sm text-[var(--text-1)] ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs text-[#00E510] hover:text-[#00E510]/80 font-medium cursor-pointer transition-colors"
      data-testid={`button-copy-${label}`}
    >
      {copied ? "Copiado" : `Copiar ${label}`}
    </button>
  );
}

export default function AdminAgenda() {
  const params = useParams<{ bookingId: string }>();
  const bookingId = params.bookingId || "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [actionResult, setActionResult] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch(`/api/admin/agenda/${bookingId}`);
      if (data.ok) {
        setBooking(data.booking);
      } else {
        setError(data.error || "Error al cargar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (action: string, label: string, body?: object) => {
    setActionLoading(action);
    setActionResult("");
    try {
      const data = await adminFetch(`/api/admin/agenda/${bookingId}/${action}`, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      });
      if (data.ok) {
        setActionResult(`${label} completado`);
        await load();
      } else {
        setActionResult(`Error: ${data.error}`);
      }
    } catch {
      setActionResult("Error de conexión");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center">
        <div className="text-[var(--text-3)] text-sm">Cargando reserva...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-red-500 text-sm" data-testid="text-admin-error">{error || "Reserva no encontrada"}</p>
          <button onClick={load} className="text-sm text-[#00E510] hover:underline cursor-pointer" data-testid="button-retry">Reintentar</button>
        </div>
      </div>
    );
  }

  const st = STATUS_LABELS[booking.status || "pending"] || STATUS_LABELS.pending;
  const isFinal = booking.status === "cancelled" || booking.status === "no_show";

  return (
    <div className="min-h-screen bg-[var(--bg-0)]" data-testid="admin-agenda-page">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-bold text-[var(--text-1)]" data-testid="text-admin-heading">Gestión de reserva</h1>
            <p className="text-xs font-mono text-[var(--text-3)] mt-0.5" data-testid="text-booking-id">{booking.id}</p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ color: st.color, backgroundColor: st.bg }}
            data-testid="text-booking-status"
          >
            {st.label}
          </span>
        </div>

        {actionResult && (
          <div className={`rounded-xl px-4 py-2.5 text-sm ${actionResult.startsWith("Error") ? "bg-red-500/10 text-red-500" : "bg-[#00E510]/10 text-[#00E510]"}`} data-testid="text-action-result">
            {actionResult}
          </div>
        )}

        <Section title="Cliente">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" value={booking.name} />
            <Field label="Email" value={booking.email} />
            <Field label="Teléfono" value={booking.phone} />
            <Field label="Idioma" value={booking.language ? `${FLAG[booking.language] || ""} ${booking.language.toUpperCase()}` : null} />
            <Field label="IP" value={booking.ip} mono />
          </div>
        </Section>

        <Section title="Asesoría">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha" value={booking.meetingDate} />
            <Field label="Horario" value={booking.startTime && booking.endTime ? `${booking.startTime} — ${booking.endTime}` : null} />
            <Field label="Reagendas" value={String(booking.rescheduleCount ?? 0)} />
            <Field label="Reminder enviado" value={booking.reminderSent ? "Sí" : "No"} />
          </div>
          {booking.googleMeet && (
            <div className="flex items-center gap-2 mt-1">
              <a href={booking.googleMeet} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00E510] hover:underline font-medium" data-testid="link-google-meet">
                Abrir Google Meet
              </a>
              <CopyButton text={booking.googleMeet} label="meet" />
            </div>
          )}
        </Section>

        {(booking.notes || booking.context || booking.shareNote || booking.monthlyProfit) && (
          <Section title="Contexto fiscal">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Beneficio mensual" value={booking.monthlyProfit ? `${Number(booking.monthlyProfit).toLocaleString("es-ES")} €` : null} />
              <Field label="Clientes internacionales" value={booking.globalClients === "true" ? "Sí" : booking.globalClients === "false" ? "No" : null} />
              <Field label="Operación digital" value={booking.digitalOperation === "true" ? "Sí" : booking.digitalOperation === "false" ? "No" : null} />
            </div>
            {booking.notes && (
              <div className="mt-2">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-semibold block mb-1">Notas del cliente</span>
                <p className="text-sm text-[var(--text-2)] bg-[var(--bg-0)] rounded-xl p-3 border border-[var(--border)]">{booking.notes}</p>
              </div>
            )}
            {booking.context && (
              <div className="mt-2">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-semibold block mb-1">Contexto</span>
                <p className="text-sm text-[var(--text-2)] bg-[var(--bg-0)] rounded-xl p-3 border border-[var(--border)]">{booking.context}</p>
              </div>
            )}
            {booking.shareNote && (
              <div className="mt-2">
                <span className="text-[10px] uppercase tracking-wide text-[var(--text-3)] font-semibold block mb-1">Nota adicional</span>
                <p className="text-sm text-[var(--text-2)] bg-[var(--bg-0)] rounded-xl p-3 border border-[var(--border)]">{booking.shareNote}</p>
              </div>
            )}
          </Section>
        )}

        <Section title="Metadatos">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha de reserva" value={booking.bookingDate} />
            <Field label="Creado" value={booking.createdAt ? new Date(booking.createdAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }) : null} />
            <Field label="Última reagenda" value={booking.lastRescheduledAt ? new Date(booking.lastRescheduledAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }) : null} />
            <Field label="Cancelado" value={booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }) : null} />
            <Field label="Privacidad aceptada" value={booking.privacy ? "Sí" : "No"} />
            <Field label="Marketing aceptado" value={booking.marketing ? "Sí" : "No"} />
          </div>
        </Section>

        {booking.manageUrl && (
          <Section title="Enlace de gestión del cliente">
            <div className="flex items-center gap-3">
              <a href={booking.manageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00E510] hover:underline font-medium break-all" data-testid="link-client-manage">
                {booking.manageUrl}
              </a>
              <CopyButton text={booking.manageUrl} label="enlace" />
            </div>
          </Section>
        )}

        <Section title="Acciones">
          <div className="grid grid-cols-2 gap-2">
            {!isFinal && (
              <>
                <button
                  onClick={() => doAction("cancel", "Cancelación")}
                  disabled={!!actionLoading}
                  className="px-4 py-2.5 rounded-full border border-red-500/30 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-40 cursor-pointer"
                  data-testid="button-cancel"
                >
                  {actionLoading === "cancel" ? "Cancelando..." : "Cancelar cita"}
                </button>
                <button
                  onClick={() => doAction("no-show", "No-show")}
                  disabled={!!actionLoading}
                  className="px-4 py-2.5 rounded-full border border-orange-500/30 text-orange-500 text-xs font-semibold hover:bg-orange-500/10 transition-colors disabled:opacity-40 cursor-pointer"
                  data-testid="button-noshow"
                >
                  {actionLoading === "no-show" ? "Marcando..." : "Marcar no-show"}
                </button>
              </>
            )}
            <button
              onClick={() => doAction("send-noshow", "Email no-show")}
              disabled={!!actionLoading}
              className="px-4 py-2.5 rounded-full border border-[var(--border)] text-[var(--text-2)] text-xs font-semibold hover:border-[#00E510]/40 hover:text-[var(--text-1)] transition-colors disabled:opacity-40 cursor-pointer"
              data-testid="button-send-noshow"
            >
              {actionLoading === "send-noshow" ? "Enviando..." : "Enviar email no-show"}
            </button>
            <button
              onClick={() => doAction("resend-confirmation", "Reenvío confirmación")}
              disabled={!!actionLoading}
              className="px-4 py-2.5 rounded-full border border-[var(--border)] text-[var(--text-2)] text-xs font-semibold hover:border-[#00E510]/40 hover:text-[var(--text-1)] transition-colors disabled:opacity-40 cursor-pointer"
              data-testid="button-resend-confirmation"
            >
              {actionLoading === "resend-confirmation" ? "Enviando..." : "Reenviar confirmación"}
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
