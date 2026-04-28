import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const COUNTRY_PREFIXES = [
  { code: "ES", prefix: "+34", flag: "es", label: "España / Spain" },
  { code: "US", prefix: "+1", flag: "us", label: "United States" },
  { code: "GB", prefix: "+44", flag: "gb", label: "United Kingdom" },
  { code: "FR", prefix: "+33", flag: "fr", label: "France" },
  { code: "DE", prefix: "+49", flag: "de", label: "Germany" },
  { code: "IT", prefix: "+39", flag: "it", label: "Italy" },
  { code: "PT", prefix: "+351", flag: "pt", label: "Portugal" },
  { code: "AD", prefix: "+376", flag: "ad", label: "Andorra" },
  { code: "MX", prefix: "+52", flag: "mx", label: "Mexico" },
  { code: "AR", prefix: "+54", flag: "ar", label: "Argentina" },
  { code: "CO", prefix: "+57", flag: "co", label: "Colombia" },
  { code: "CL", prefix: "+56", flag: "cl", label: "Chile" },
  { code: "PE", prefix: "+51", flag: "pe", label: "Peru" },
  { code: "EC", prefix: "+593", flag: "ec", label: "Ecuador" },
  { code: "UY", prefix: "+598", flag: "uy", label: "Uruguay" },
  { code: "PY", prefix: "+595", flag: "py", label: "Paraguay" },
  { code: "BO", prefix: "+591", flag: "bo", label: "Bolivia" },
  { code: "VE", prefix: "+58", flag: "ve", label: "Venezuela" },
  { code: "CR", prefix: "+506", flag: "cr", label: "Costa Rica" },
  { code: "PA", prefix: "+507", flag: "pa", label: "Panama" },
  { code: "DO", prefix: "+1", flag: "do", label: "Dominican Republic" },
  { code: "GT", prefix: "+502", flag: "gt", label: "Guatemala" },
  { code: "HN", prefix: "+504", flag: "hn", label: "Honduras" },
  { code: "SV", prefix: "+503", flag: "sv", label: "El Salvador" },
  { code: "NI", prefix: "+505", flag: "ni", label: "Nicaragua" },
  { code: "CU", prefix: "+53", flag: "cu", label: "Cuba" },
  { code: "BR", prefix: "+55", flag: "br", label: "Brazil" },
  { code: "NL", prefix: "+31", flag: "nl", label: "Netherlands" },
  { code: "BE", prefix: "+32", flag: "be", label: "Belgium" },
  { code: "CH", prefix: "+41", flag: "ch", label: "Switzerland" },
  { code: "AT", prefix: "+43", flag: "at", label: "Austria" },
  { code: "IE", prefix: "+353", flag: "ie", label: "Ireland" },
  { code: "SE", prefix: "+46", flag: "se", label: "Sweden" },
  { code: "NO", prefix: "+47", flag: "no", label: "Norway" },
  { code: "DK", prefix: "+45", flag: "dk", label: "Denmark" },
  { code: "FI", prefix: "+358", flag: "fi", label: "Finland" },
  { code: "PL", prefix: "+48", flag: "pl", label: "Poland" },
  { code: "RO", prefix: "+40", flag: "ro", label: "Romania" },
  { code: "CZ", prefix: "+420", flag: "cz", label: "Czech Republic" },
  { code: "GR", prefix: "+30", flag: "gr", label: "Greece" },
  { code: "HU", prefix: "+36", flag: "hu", label: "Hungary" },
  { code: "AU", prefix: "+61", flag: "au", label: "Australia" },
  { code: "JP", prefix: "+81", flag: "jp", label: "Japan" },
  { code: "CN", prefix: "+86", flag: "cn", label: "China" },
  { code: "IN", prefix: "+91", flag: "in", label: "India" },
  { code: "KR", prefix: "+82", flag: "kr", label: "South Korea" },
  { code: "AE", prefix: "+971", flag: "ae", label: "UAE" },
  { code: "SA", prefix: "+966", flag: "sa", label: "Saudi Arabia" },
  { code: "IL", prefix: "+972", flag: "il", label: "Israel" },
  { code: "ZA", prefix: "+27", flag: "za", label: "South Africa" },
  { code: "NG", prefix: "+234", flag: "ng", label: "Nigeria" },
  { code: "EG", prefix: "+20", flag: "eg", label: "Egypt" },
  { code: "MA", prefix: "+212", flag: "ma", label: "Morocco" },
  { code: "CA", prefix: "+1", flag: "ca", label: "Canada" },
  { code: "RU", prefix: "+7", flag: "ru", label: "Russia" },
  { code: "TR", prefix: "+90", flag: "tr", label: "Turkey" },
  { code: "PH", prefix: "+63", flag: "ph", label: "Philippines" },
  { code: "TH", prefix: "+66", flag: "th", label: "Thailand" },
  { code: "SG", prefix: "+65", flag: "sg", label: "Singapore" },
  { code: "MY", prefix: "+60", flag: "my", label: "Malaysia" },
  { code: "ID", prefix: "+62", flag: "id", label: "Indonesia" },
];

function detectPrefixFromValue(value: string): { prefixCode: string; number: string } {
  let cleaned = value.trim();
  if (cleaned.startsWith("00")) cleaned = "+" + cleaned.slice(2);
  if (!cleaned.startsWith("+")) return { prefixCode: "ES", number: cleaned };
  const sorted = [...COUNTRY_PREFIXES].sort((a, b) => b.prefix.length - a.prefix.length);
  for (const cp of sorted) {
    if (cleaned.startsWith(cp.prefix)) {
      return { prefixCode: cp.code, number: cleaned.slice(cp.prefix.length).trim() };
    }
  }
  const digits = cleaned.replace(/\D/g, "");
  return { prefixCode: "ES", number: digits };
}

interface PhoneInputProps {
  value: string;
  onChange: (fullValue: string) => void;
  placeholder?: string;
  error?: boolean;
  compact?: boolean;
  size?: "sm" | "md";
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "data-testid"?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "612 345 678",
  error = false,
  compact = false,
  size,
  id,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "data-testid": testId = "input-phone",
}: PhoneInputProps) {
  const { t } = useTranslation();
  const initial = detectPrefixFromValue(value);
  const [selectedCode, setSelectedCode] = useState(initial.prefixCode);
  const [number, setNumber] = useState(initial.number);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef(value);
  const userTouchedPrefix = useRef(false);
  const ipDetectAttempted = useRef(false);

  useEffect(() => {
    if (value === lastEmitted.current) return;
    lastEmitted.current = value;
    if (value === "") {
      setNumber("");
      return;
    }
    const parsed = detectPrefixFromValue(value);
    setSelectedCode(parsed.prefixCode);
    setNumber(parsed.number);
  }, [value]);

  // IP-based country prefix detection — runs once per mount.
  // Skipped when the user has already typed a phone or manually picked a prefix.
  useEffect(() => {
    if (ipDetectAttempted.current) return;
    ipDetectAttempted.current = true;
    if (value && value.trim() !== "") return;
    if (userTouchedPrefix.current) return;
    let cancelled = false;
    fetch("/api/geo", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { country?: string } | null) => {
        if (cancelled || !data) return;
        if (userTouchedPrefix.current) return;
        if (lastEmitted.current && lastEmitted.current.trim() !== "") return;
        const raw = (data.country || "").toUpperCase();
        const iso = raw === "UK" ? "GB" : raw;
        if (!iso) return;
        const match = COUNTRY_PREFIXES.find((c) => c.code === iso);
        if (match) setSelectedCode(match.code);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const inTrigger = ref.current?.contains(target);
      const inMenu = menuRef.current?.contains(target);
      if (!inTrigger && !inMenu) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Position the portaled dropdown beneath the trigger; flip above
  // when there isn't enough room below.
  useLayoutEffect(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    function recompute() {
      const btn = triggerRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const menuH = 260;
      const margin = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top =
        spaceBelow >= menuH + margin
          ? rect.bottom + 4
          : Math.max(margin, rect.top - menuH - 4);
      const width = 260;
      const maxLeft = window.innerWidth - width - margin;
      const left = Math.max(margin, Math.min(rect.left, maxLeft));
      setMenuPos({ top, left, width });
    }
    recompute();
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
    };
  }, [open]);

  const selected = COUNTRY_PREFIXES.find(c => c.code === selectedCode) || COUNTRY_PREFIXES[0];

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filtered = e.target.value.replace(/[^\d\s\-()]/g, "");
    setNumber(filtered);
    const combined = `${selected.prefix} ${filtered}`.trim();
    lastEmitted.current = combined;
    onChange(combined);
  }

  function handleSelect(code: string) {
    userTouchedPrefix.current = true;
    setSelectedCode(code);
    const cp = COUNTRY_PREFIXES.find(c => c.code === code)!;
    const combined = `${cp.prefix} ${number}`.trim();
    lastEmitted.current = combined;
    onChange(combined);
    setOpen(false);
    setSearch("");
  }

  const filtered = search
    ? COUNTRY_PREFIXES.filter(c =>
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.prefix.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRY_PREFIXES;

  const sizeClasses = compact ? "text-xs" : "text-sm";
  const padY = size === "sm" ? "py-2.5" : compact ? "py-2.5" : "py-3";

  return (
    <div ref={ref} className="relative">
      <div className={`flex rounded-full overflow-hidden border transition-colors ${error ? "border-[var(--error)]" : "border-[var(--border)] focus-within:border-[var(--green)] focus-within:[outline:2px_solid_var(--green)] focus-within:[outline-offset:2px]"} bg-[var(--bg-1)]`}>
        <button
          type="button"
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          data-testid={`${testId}-prefix`}
          aria-label={`Select country code (current: ${selected.label} ${selected.prefix})`}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex items-center gap-1.5 px-3 border-r border-[var(--border)] bg-transparent cursor-pointer flex-shrink-0 hover:bg-[var(--bg-2)] transition-colors ${padY}`}
        >
          <img
            src={`https://flagcdn.com/w40/${selected.flag}.png`}
            alt={selected.label}
            width={16} height={12}
            className="rounded-[2px] object-cover flex-shrink-0"
          />
          <span className={`font-semibold text-[var(--text-1)] ${compact ? "text-[11px]" : "text-xs"}`}>{selected.prefix}</span>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--text-3)]"><path d="M7 10l5 5 5-5z"/></svg>
        </button>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          id={id}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          value={number}
          onChange={handleNumberChange}
          placeholder={placeholder}
          maxLength={20}
          data-testid={testId}
          className={`flex-1 min-w-0 px-3 bg-transparent outline-none focus:outline-none focus-visible:outline-none text-[var(--text-1)] placeholder:text-[var(--text-3)] ${sizeClasses} ${padY}`}
        />
      </div>
      {open && menuPos && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          className="fixed z-[2000] bg-[var(--bg-0)] rounded-xl border border-[var(--border)] shadow-lg max-h-[260px] overflow-hidden flex flex-col"
          style={{
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          <div className="p-2 border-b border-[var(--border)]">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("common.search")}
              data-testid={`${testId}-search`}
              className="w-full py-1.5 px-3 rounded-full border border-[var(--border)] text-xs outline-none focus:border-[var(--green)] text-[var(--text-1)] bg-[var(--bg-1)]"
            />
          </div>
          <div className="overflow-y-auto max-h-[210px]">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                data-testid={`${testId}-option-${c.code}`}
                className={`flex items-center gap-2 w-full py-2 px-3 border-none cursor-pointer text-left text-xs text-[var(--text-1)] transition-colors ${
                  c.code === selectedCode ? "bg-[var(--green-soft)]" : "hover:bg-[var(--bg-2)]"
                }`}
              >
                <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt="" width={16} height={12} loading="lazy" className="rounded-[2px] object-cover flex-shrink-0" />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{c.label}</span>
                <span className="text-[11px] text-[var(--text-3)] flex-shrink-0">{c.prefix}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

