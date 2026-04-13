import { useState, useCallback, useRef } from "react";

export type InlineMessageType = "success" | "error" | "info" | null;

export interface InlineMessageState {
  text: string;
  type: InlineMessageType;
}

export function useInlineMessage(autoClearMs = 5000) {
  const [msg, setMsg] = useState<InlineMessageState>({ text: "", type: null });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showMsg = useCallback((text: string, type: "success" | "error" | "info" = "info") => {
    if (timer.current) clearTimeout(timer.current);
    setMsg({ text, type });
    timer.current = setTimeout(() => setMsg({ text: "", type: null }), autoClearMs);
  }, [autoClearMs]);

  const clearMsg = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMsg({ text: "", type: null });
  }, []);

  return { msg, showMsg, clearMsg };
}
