import { useState, useRef, useEffect, memo } from "react";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
        open
          ? "bg-[#00E510] rotate-180"
          : "bg-[var(--bg-2)] group-hover:bg-[rgba(0,229,16,0.12)]"
      }`}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <path
          d="m6 9 6 6 6-6"
          stroke={open ? "#0B0D0C" : "var(--text-2)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface AccordionItemProps {
  id: string;
  question: string;
  isOpen: boolean;
  onToggle: () => void;
  testIdPrefix?: string;
  variant?: "flat" | "card";
  children: React.ReactNode;
}

const AccordionItem = memo(function AccordionItem({
  id,
  question,
  isOpen,
  onToggle,
  testIdPrefix = "faq",
  variant = "flat",
  children,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (!contentRef.current) return;
    if (isOpen) {
      rafRef.current = requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
    } else {
      setHeight(0);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpen]);

  if (variant === "card") {
    return (
      <div
        className="overflow-hidden"
        style={{
          background: isOpen
            ? "linear-gradient(180deg, #FFFFFF 0%, var(--bg-1, #F7F4EE) 100%)"
            : "var(--bg-1, #F7F4EE)",
          border: `1.5px solid ${isOpen ? "rgba(0,229,16,0.62)" : "rgba(11,13,12,0.10)"}`,
          borderRadius: isOpen ? 26 : 9999,
          boxShadow: isOpen
            ? "0 22px 56px -24px rgba(0,229,16,0.34), 0 8px 22px -10px rgba(11,13,12,0.10), inset 0 1.5px 0 rgba(255,255,255,0.85)"
            : "0 1px 2px rgba(11,13,12,0.04)",
          transition:
            "border-radius 380ms cubic-bezier(0.22,1,0.36,1), box-shadow 380ms cubic-bezier(0.22,1,0.36,1), border-color 220ms ease, background 220ms ease",
        }}
        data-testid={`${testIdPrefix}-item-${id}`}
      >
        <button
          onClick={onToggle}
          className="group w-full flex items-center justify-between gap-4 text-left py-4 pl-6 pr-4 sm:pl-7 sm:pr-5 font-body font-semibold text-[15px] sm:text-base text-[var(--text-1)] transition-colors duration-150"
          aria-expanded={isOpen}
          data-testid={`${testIdPrefix}-trigger-${id}`}
        >
          <span className="flex-1">{question}</span>
          <ChevronIcon open={isOpen} />
        </button>
        <div
          className="overflow-hidden"
          style={{
            maxHeight: height,
            opacity: isOpen ? 1 : 0,
            transition:
              "max-height 420ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease",
            transitionDelay: isOpen ? "60ms, 120ms" : "0ms, 0ms",
          }}
        >
          <div
            ref={contentRef}
            style={{
              transform: isOpen ? "translateY(0)" : "translateY(-6px)",
              transition: "transform 360ms cubic-bezier(0.22,1,0.36,1)",
              transitionDelay: isOpen ? "100ms" : "0ms",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-[background-color,border-color,box-shadow,border-radius,margin] duration-300 ease-out ${
        isOpen
          ? "rounded-2xl my-2 border border-[rgba(0,229,16,0.28)] bg-[rgba(255,255,255,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(255,255,255,0.04)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_-14px_rgba(0,229,16,0.35)]"
          : "border-b border-[var(--border)]"
      }`}
      data-testid={`${testIdPrefix}-item-${id}`}
    >
      <button
        onClick={onToggle}
        className={`group w-full flex items-center justify-center text-center py-5 font-body font-semibold text-[15px] sm:text-base text-[var(--text-1)] hover:text-[#00E510] transition-[color,padding] duration-200 ${
          isOpen ? "px-5 sm:px-6" : ""
        }`}
        aria-expanded={isOpen}
        data-testid={`${testIdPrefix}-trigger-${id}`}
      >
        <span>{question}</span>
      </button>
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{ maxHeight: height, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={contentRef} className={isOpen ? "px-5 sm:px-6" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
});

export default AccordionItem;
