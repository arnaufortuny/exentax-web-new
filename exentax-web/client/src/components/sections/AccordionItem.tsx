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
        className="rounded-2xl overflow-hidden transition-[box-shadow,border-color] duration-300"
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(20px) saturate(1.5)",
          WebkitBackdropFilter: "blur(20px) saturate(1.5)",
          border: `1px solid ${isOpen ? "rgba(0,229,16,0.28)" : "var(--border)"}`,
          boxShadow: isOpen
            ? "0 8px 32px rgba(0,229,16,0.07), 0 2px 8px rgba(0,0,0,0.04)"
            : "0 2px 8px rgba(0,0,0,0.03)",
        }}
        data-testid={`${testIdPrefix}-item-${id}`}
      >
        <button
          onClick={onToggle}
          className="group w-full flex items-center justify-between gap-4 py-5 px-5 sm:px-6 text-left font-body font-semibold text-[15px] sm:text-base text-[var(--text-1)] transition-colors duration-150"
          aria-expanded={isOpen}
          data-testid={`${testIdPrefix}-trigger-${id}`}
        >
          <span className={isOpen ? "text-[var(--text-1)]" : ""}>{question}</span>
          <ChevronIcon open={isOpen} />
        </button>
        <div
          className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
          style={{ maxHeight: height, opacity: isOpen ? 1 : 0 }}
        >
          <div ref={contentRef}>
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
        className={`group w-full flex items-center justify-between gap-4 py-5 text-left font-body font-semibold text-[15px] sm:text-base text-[var(--text-1)] hover:text-[#00E510] transition-[color,padding] duration-200 ${
          isOpen ? "px-5 sm:px-6" : ""
        }`}
        aria-expanded={isOpen}
        data-testid={`${testIdPrefix}-trigger-${id}`}
      >
        <span>{question}</span>
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke={isOpen ? "#00E510" : "var(--text-3)"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
