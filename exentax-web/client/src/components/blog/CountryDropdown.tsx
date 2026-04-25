import { useEffect, useRef, useState, useCallback, useId } from "react";
import { useTranslation } from "react-i18next";
import { BLOG_COUNTRIES, type BlogCountryCode } from "@/data/blog-posts";
import CountryFlagImg from "@/components/CountryFlagImg";

interface Props {
  value: BlogCountryCode | null;
  onChange: (code: BlogCountryCode | null) => void;
}

export default function CountryDropdown({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const items: Array<{ code: BlogCountryCode | null; label: string }> = [
    { code: null, label: t("blogPost.countryFilterAll") },
    ...BLOG_COUNTRIES.map((c) => ({
      code: c,
      label: t(`blogPost.countries.${c}`, c),
    })),
  ];

  const currentIndex = items.findIndex((i) => i.code === value);
  const current = items[currentIndex] ?? items[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [open, currentIndex]);

  const select = useCallback(
    (code: BlogCountryCode | null) => {
      onChange(code);
      setOpen(false);
      buttonRef.current?.focus();
    },
    [onChange],
  );

  const handleButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(items.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const item = items[activeIndex];
      if (item) select(item.code);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full sm:w-auto" data-testid="country-filter">
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={t("blogPost.countryFilterLabel")}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleButtonKey}
        className="appearance-none w-full sm:w-auto inline-flex items-center gap-2 pl-4 pr-10 py-3 rounded-full border border-[var(--border)] bg-[var(--card-bg-solid,#FFFFFF)] text-[var(--text-1)] text-sm font-body font-medium shadow-[0_1px_2px_rgba(11,13,12,0.06)] hover:border-[rgba(0,229,16,0.55)] focus:outline-none focus:border-[rgba(0,229,16,0.55)] transition-colors duration-200 cursor-pointer"
        data-testid="select-country"
      >
        {current.code && (
          <CountryFlagImg code={current.code} size={18} alt={current.label} />
        )}
        <span className="truncate">{current.label}</span>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none"
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={t("blogPost.countryFilterLabel")}
          tabIndex={-1}
          onKeyDown={handleListKey}
          ref={(el) => el?.focus()}
          className="absolute top-[calc(100%+8px)] left-0 sm:right-0 sm:left-auto z-[9999] min-w-full sm:min-w-[220px] max-h-[min(70vh,440px)] overflow-y-auto bg-[var(--card-bg-solid,#FFFFFF)] border border-[var(--border,rgba(0,0,0,0.08))] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] py-2 outline-none"
        >
          {items.map((item, idx) => {
            const selected = item.code === value;
            const active = idx === activeIndex;
            return (
              <li
                key={item.code ?? "__all"}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => select(item.code)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-[13px] font-body transition-colors duration-100 ${
                  selected
                    ? "bg-[rgba(0,229,16,0.06)] font-bold text-[var(--green)]"
                    : active
                    ? "bg-black/[0.04] text-[var(--text-1,#1A1A1A)] font-medium"
                    : "text-[var(--text-1,#1A1A1A)] font-medium"
                }`}
                data-testid={item.code ? `option-country-${item.code}` : "option-country-all"}
              >
                {item.code ? (
                  <CountryFlagImg code={item.code} size={20} alt={item.label} />
                ) : (
                  <span className="inline-block w-5 h-5 flex-shrink-0" aria-hidden="true" />
                )}
                <span className="truncate">{item.label}</span>
                {selected && (
                  <svg
                    width={10}
                    height={10}
                    viewBox="0 0 12 12"
                    fill="none"
                    className="ml-auto flex-shrink-0 text-[var(--green)]"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
