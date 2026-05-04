import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons";

type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastDetail {
  message: string;
  variant: ToastVariant;
}

const EVENT_NAME = "exentax:toast";
const AUTO_DISMISS_MS = 5000;

let toastCounter = 0;

function emit(detail: ToastDetail): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT_NAME, { detail }));
  } catch {
    // Defensive: CustomEvent ctor or dispatchEvent may throw on
    // legacy browsers / SSR-hydration edge cases. A toast failure
    // must never escalate into a render error — silently drop.
  }
}

export const toast = {
  success(message: string) {
    emit({ message, variant: "success" });
  },
  error(message: string) {
    emit({ message, variant: "error" });
  },
  info(message: string) {
    emit({ message, variant: "info" });
  },
};

const VARIANT_STYLES: Record<ToastVariant, { bg: string; color: string; border: string; Icon: typeof CheckCircleIcon }> = {
  success: { bg: "var(--green-soft)", color: "var(--green-hover)", border: "var(--green)", Icon: CheckCircleIcon },
  error: { bg: "rgba(220,38,38,0.10)", color: "var(--error)", border: "var(--error)", Icon: XCircleIcon },
  info: { bg: "rgba(37,99,235,0.10)", color: "var(--info)", border: "var(--info)", Icon: CheckCircleIcon },
};

function ToastCard({ toast: item, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const { t } = useTranslation();
  const styles = VARIANT_STYLES[item.variant];
  const Icon = styles.Icon;
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid={`toast-${item.variant}-${item.id}`}
      className="flex items-start gap-2 px-4 py-3 rounded-token-sm font-body text-sm shadow-lg max-w-sm pointer-events-auto"
      style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.border}`, backdropFilter: "blur(8px)" }}
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span className="flex-1 leading-snug">{item.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label={t("agenda.toastClose")}
        data-testid={`button-dismiss-toast-${item.id}`}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity text-base leading-none px-1"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastHost() {
  const { t } = useTranslation();
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  useEffect(() => {
    const pendingTimers = new Set<ReturnType<typeof setTimeout>>();
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      if (!detail || typeof detail.message !== "string") return;
      const id = ++toastCounter;
      setItems((prev) => [...prev, { id, message: detail.message, variant: detail.variant || "info" }]);
      const timer = setTimeout(() => {
        pendingTimers.delete(timer);
        setItems((prev) => prev.filter((it) => it.id !== id));
      }, AUTO_DISMISS_MS);
      pendingTimers.add(timer);
    }
    window.addEventListener(EVENT_NAME, onToast as EventListener);
    return () => {
      window.removeEventListener(EVENT_NAME, onToast as EventListener);
      for (const t of pendingTimers) clearTimeout(t);
      pendingTimers.clear();
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-label={t("agenda.toastNotifications")}
      className="fixed z-[100] flex flex-col gap-2 pointer-events-none top-4 right-4 left-4 sm:left-auto sm:max-w-sm"
    >
      {items.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}
