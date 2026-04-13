import { useState, useRef, useEffect } from "react";
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
  variant?: "public" | "portal" | "admin";
  "data-testid"?: string;
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "612 345 678",
  error = false,
  compact = false,
  variant = "public",
  "data-testid": testId = "input-phone",
}: PhoneInputProps) {
  const { t } = useTranslation();
  const initial = detectPrefixFromValue(value);
  const [selectedCode, setSelectedCode] = useState(initial.prefixCode);
  const [number, setNumber] = useState(initial.number);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastEmitted = useRef(value);

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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

  const selected = COUNTRY_PREFIXES.find(c => c.code === selectedCode) || COUNTRY_PREFIXES[0];

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const filtered = e.target.value.replace(/[^\d\s\-()]/g, "");
    setNumber(filtered);
    const combined = `${selected.prefix} ${filtered}`.trim();
    lastEmitted.current = combined;
    onChange(combined);
  }

  function handleSelect(code: string) {
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

  if (variant === "admin") {
    return (
      <div ref={ref} style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 0, borderRadius: 9999, border: `1.5px solid ${error ? "#DC2626" : "var(--border-subtle, rgba(0,0,0,0.06))"}`, overflow: "hidden", background: "var(--bg-input, #FAFBFC)", transition: "border-color 0.2s, box-shadow 0.2s" }}
          onFocus={e => { if (!error) { e.currentTarget.style.borderColor = "#00E510"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,229,16,0.15)"; } }}
          onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { e.currentTarget.style.borderColor = error ? "#DC2626" : "var(--border-subtle, rgba(0,0,0,0.06))"; e.currentTarget.style.boxShadow = "none"; } }}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            data-testid={`${testId}-prefix`}
            style={{
              display: "flex", alignItems: "center", gap: 4, padding: "11px 8px 11px 14px",
              background: "transparent", border: "none", borderRight: "1.5px solid var(--border-subtle, rgba(0,0,0,0.06))",
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit", fontSize: 12, color: "var(--text-1, #1A1A1A)",
            }}
          >
            <img
              src={`https://flagcdn.com/w40/${selected.flag}.png`}
              alt={selected.label}
              width={16} height={12}
              style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
            />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{selected.prefix}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="#888"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <input
            type="tel"
            inputMode="tel"
            value={number}
            onChange={handleNumberChange}
            placeholder={placeholder}
            data-testid={testId}
            style={{
              flex: 1, padding: "11px 14px", border: "none", outline: "none",
              fontSize: 13, color: "var(--text-1, #1A1A1A)", fontFamily: "inherit", background: "transparent",
              minWidth: 0, boxSizing: "border-box",
            }}
          />
        </div>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
            background: "var(--card-bg, #fff)", borderRadius: 12, border: "1px solid var(--glass-border, rgba(0,0,0,0.08))",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)", width: 240, maxHeight: 240,
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "6px 8px", borderBottom: "1px solid var(--glass-border, rgba(0,0,0,0.06))" }}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("common.search")}
                data-testid={`${testId}-search`}
                style={{
                  width: "100%", padding: "6px 10px", border: "1px solid var(--glass-border, rgba(0,0,0,0.08))",
                  borderRadius: 20, fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  background: "var(--bg-input, #fff)", color: "var(--text-1, #1A1A1A)",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", maxHeight: 200 }}>
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  data-testid={`${testId}-option-${c.code}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "8px 12px", border: "none", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12, color: "var(--text-1, #1A1A1A)", textAlign: "left",
                    background: c.code === selectedCode ? "rgba(0,229,16,0.06)" : "transparent",
                  }}
                  onMouseEnter={e => { if (c.code !== selectedCode) (e.target as HTMLElement).style.background = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = c.code === selectedCode ? "rgba(0,229,16,0.06)" : "transparent"; }}
                >
                  <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt="" width={16} height={12} loading="lazy" style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  <span style={{ fontSize: 11, color: "#888", flexShrink: 0 }}>{c.prefix}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "portal") {
    return (
      <div ref={ref} style={{ position: "relative" }}>
        <div style={{
          display: "flex", gap: 0, borderRadius: 12, overflow: "hidden",
          border: `1.5px solid ${error ? "#DC2626" : "var(--glass-border-strong)"}`,
          background: "var(--bg-input)", transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={e => {
          const container = e.currentTarget;
          container.style.borderColor = "#00E510";
          container.style.background = "var(--card-bg)";
          container.style.boxShadow = "0 0 0 3px rgba(0,229,16,0.08)";
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            const container = e.currentTarget;
            container.style.borderColor = "var(--glass-border-strong)";
            container.style.background = "var(--bg-input)";
            container.style.boxShadow = "none";
          }
        }}
        >
          <button
            type="button"
            onClick={() => setOpen(!open)}
            data-testid={`${testId}-prefix`}
            style={{
              display: "flex", alignItems: "center", gap: 5, padding: "11px 8px 11px 14px",
              background: "transparent", border: "none", borderRight: "1.5px solid var(--glass-border-strong)",
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
            }}
          >
            <img
              src={`https://flagcdn.com/w40/${selected.flag}.png`}
              alt={selected.label}
              width={18} height={13}
              style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{selected.prefix}</span>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="var(--muted)"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <input
            type="tel"
            inputMode="tel"
            value={number}
            onChange={handleNumberChange}
            placeholder={placeholder}
            data-testid={testId}
            style={{
              flex: 1, padding: "11px 16px 11px 12px", border: "none", outline: "none",
              fontSize: 14, color: "var(--text-1)", fontFamily: "inherit", background: "transparent",
              minWidth: 0, boxSizing: "border-box",
            }}
          />
        </div>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50,
            background: "var(--card-bg)", borderRadius: 14, border: "1px solid var(--glass-border-strong)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)", width: 260, maxHeight: 260,
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            <div style={{ padding: "8px", borderBottom: "1px solid var(--border-subtle)" }}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("common.search")}
                data-testid={`${testId}-search`}
                style={{
                  width: "100%", padding: "8px 12px", border: "1px solid var(--glass-border-strong)",
                  borderRadius: 20, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  background: "var(--bg-input)", color: "var(--text-1)",
                }}
              />
            </div>
            <div style={{ overflowY: "auto", maxHeight: 210 }}>
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  data-testid={`${testId}-option-${c.code}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "9px 14px", border: "none", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 13, color: "var(--text-1)", textAlign: "left",
                    background: c.code === selectedCode ? "rgba(0,229,16,0.06)" : "transparent",
                  }}
                  onMouseEnter={e => { if (c.code !== selectedCode) (e.target as HTMLElement).style.background = "var(--inactive-bg)"; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.background = c.code === selectedCode ? "rgba(0,229,16,0.06)" : "transparent"; }}
                >
                  <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt="" width={18} height={13} loading="lazy" style={{ borderRadius: 2, objectFit: "cover", flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}>{c.prefix}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const sizeClasses = compact ? "text-xs" : "text-sm";
  const padClasses = compact ? "py-2.5" : "py-2.5";

  return (
    <div ref={ref} className="relative">
      <div className={`flex rounded-full overflow-hidden border transition-colors ${error ? "border-red-500" : "border-[var(--border)] focus-within:border-[#00E510]"} bg-[var(--bg-1)]`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          data-testid={`${testId}-prefix`}
          className={`flex items-center gap-1.5 px-3 border-r border-[var(--border)] bg-transparent cursor-pointer flex-shrink-0 hover:bg-[var(--bg-2)] transition-colors ${padClasses}`}
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
          value={number}
          onChange={handleNumberChange}
          placeholder={placeholder}
          data-testid={testId}
          className={`flex-1 min-w-0 px-3 bg-transparent outline-none text-[var(--text-1)] placeholder:text-[var(--text-3)] ${sizeClasses} ${padClasses}`}
        />
      </div>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 bg-[var(--bg-0)] rounded-xl border border-[var(--border)] shadow-lg w-[260px] max-h-[260px] overflow-hidden flex flex-col" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          <div className="p-2 border-b border-[var(--border)]">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("common.search")}
              data-testid={`${testId}-search`}
              className="w-full py-1.5 px-3 rounded-full border border-[var(--border)] text-xs outline-none focus:border-[#00E510] text-[var(--text-1)]"
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
                  c.code === selectedCode ? "bg-[#00E510]/5" : "hover:bg-[var(--bg-2)]"
                }`}
              >
                <img src={`https://flagcdn.com/w40/${c.flag}.png`} alt="" width={16} height={12} loading="lazy" className="rounded-[2px] object-cover flex-shrink-0" />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{c.label}</span>
                <span className="text-[11px] text-[var(--text-3)] flex-shrink-0">{c.prefix}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

