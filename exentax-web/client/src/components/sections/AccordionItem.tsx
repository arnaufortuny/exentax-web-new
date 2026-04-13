import { useState, useRef, useEffect, memo } from "react";

function ChevronDown({ open, color = "#00E510" }: { open: boolean; color?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

  const wrapperClass = variant === "card"
    ? `border bg-[var(--bg-0)] rounded-2xl transition-all duration-200 ${isOpen ? "border-[#00E510]/30 shadow-[0_0_20px_rgba(0,229,16,0.06)]" : "border-[var(--border)] hover:border-[#00E510]/20"}`
    : "border-b border-[var(--border)] transition-colors duration-150";

  const buttonPadding = variant === "card" ? "py-5 px-5 sm:px-6" : "py-5";

  return (
    <div className={wrapperClass} data-testid={`${testIdPrefix}-item-${id}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 ${buttonPadding} text-left font-body font-semibold text-lg text-[var(--text-1)] hover:text-[#00E510] transition-colors duration-150`}
        aria-expanded={isOpen}
        data-testid={`${testIdPrefix}-trigger-${id}`}
      >
        <span>{question}</span>
        <ChevronDown open={isOpen} />
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
});

export default AccordionItem;
