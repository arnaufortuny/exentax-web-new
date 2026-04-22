import { ReactNode, useState } from "react";
import AccordionItem from "./AccordionItem";

export interface FaqAccordionEntry {
  id: string;
  question: string;
  answer: ReactNode;
}

interface FaqAccordionListProps {
  items: FaqAccordionEntry[];
  testIdPrefix: string;
  spacingClass?: string;
  answerExtraClass?: string;
  openId?: string | null;
  onToggle?: (id: string) => void;
}

export default function FaqAccordionList({
  items,
  testIdPrefix,
  spacingClass = "space-y-3",
  answerExtraClass = "",
  openId: openIdProp,
  onToggle,
}: FaqAccordionListProps) {
  const [internalOpen, setInternalOpen] = useState<string | null>(null);
  const isControlled = openIdProp !== undefined;
  const openId = isControlled ? openIdProp : internalOpen;

  const handleToggle = (id: string) => {
    if (onToggle) {
      onToggle(id);
    } else {
      setInternalOpen((prev) => (prev === id ? null : id));
    }
  };

  return (
    <div className={spacingClass}>
      {items.map((it) => (
        <AccordionItem
          key={it.id}
          id={it.id}
          question={it.question}
          isOpen={openId === it.id}
          onToggle={() => handleToggle(it.id)}
          testIdPrefix={testIdPrefix}
          variant="card"
        >
          <div
            className={`mx-6 sm:mx-7 pb-7 pt-6 border-t border-[rgba(11,13,12,0.06)] faq-prose text-[var(--text-2)] text-[15px] leading-relaxed ${answerExtraClass}`.trim()}
          >
            {it.answer}
          </div>
        </AccordionItem>
      ))}
    </div>
  );
}
