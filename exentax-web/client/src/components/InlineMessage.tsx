import type { InlineMessageState } from "@/hooks/useInlineMessage";

const STYLES: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  success: {
    bg: "rgba(0,229,16,0.08)",
    border: "rgba(0,229,16,0.25)",
    color: "#00E510",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  error: {
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
    color: "#DC2626",
    icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
  },
  info: {
    bg: "rgba(212,154,0,0.06)",
    border: "rgba(212,154,0,0.22)",
    color: "#D49A00",
    icon: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
  },
};

export function InlineMessage({ msg, style }: { msg: InlineMessageState; style?: React.CSSProperties }) {
  if (!msg.type) return null;
  const s = STYLES[msg.type] || STYLES.info;
  return (
    <div
      data-testid={`inline-msg-${msg.type}`}
      style={{
        padding: "8px 18px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        animation: "fadeIn 0.25s ease",
        ...style,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d={s.icon} />
      </svg>
      <span>{msg.text}</span>
    </div>
  );
}
