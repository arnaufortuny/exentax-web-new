import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCountUp } from "@/hooks/useCountUp";
import { SOCIAL } from "@/lib/constants";

type StatDef = {
  value?: string;
  prefix?: string;
  suffix?: string;
  target?: number;
  duration?: number;
  label: string;
  href?: string;
  decimals?: number;
};

function fmtCount(n: number): string {
  return n >= 1000 ? n.toLocaleString() : String(n);
}

function StatCard({ value, suffix, prefix, label, target, duration, href, decimals }: StatDef) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { count, ref: countRef } = useCountUp(target ?? 0, duration ?? 1400);

  const displayed = value ?? (decimals ? (count / 10).toFixed(1) : fmtCount(count));
  const isGold = suffix === "★";

  const inner = (
    <div className="relative flex flex-col items-center justify-center text-center px-3 py-5 sm:py-6 rounded-2xl border border-[rgba(0,229,16,0.25)] overflow-hidden group"
      style={{
        background: "var(--bg-1)",
        boxShadow: "0 2px 16px rgba(0,229,16,0.08), 0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full bg-[#00E510] opacity-60" />

      <span
        className="font-heading font-extrabold leading-none tabular-nums tracking-tight mb-2"
        style={{ fontSize: "clamp(28px, 5vw, 40px)", color: isGold ? "#FFD700" : "#00E510" }}
      >
        {prefix}{displayed}{suffix}
      </span>
      <span className="font-body text-[11px] sm:text-[12px] uppercase tracking-[0.13em] text-[var(--text-1)] font-semibold leading-snug max-w-[120px]">
        {label}
      </span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        ref={(el) => {
          (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
          (countRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }}
        className="hover:scale-[1.03] transition-transform duration-200 block"
        data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (countRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {inner}
    </div>
  );
}

export function useStatsHome(): StatDef[] {
  const { t } = useTranslation();
  return [
    { prefix: "−", suffix: "%", target: 40, duration: 1600, label: t("heroStats.reductionLabel") },
    { prefix: "+", target: 50, duration: 1400, label: t("heroStats.clientsLabel") },
    { value: "5.0", suffix: "★", label: t("heroStats.ratingLabel"), href: SOCIAL.TRUSTPILOT },
  ];
}

export function useStatsPrecios(): StatDef[] {
  const { t } = useTranslation();
  return [
    { prefix: "", suffix: "€", target: 1099, duration: 1600, label: t("heroStats.pricingFrom") },
    { prefix: "", suffix: "", target: 0, duration: 800, label: t("heroStats.noCosts") },
    { value: "5.0", suffix: "★", label: t("heroStats.ratingLabel"), href: SOCIAL.TRUSTPILOT },
  ];
}

export default function HeroStats({
  align = "center",
  stats,
}: {
  align?: "left" | "center";
  stats?: StatDef[];
}) {
  const defaultStats = useStatsHome();
  const finalStats = stats ?? defaultStats;

  return (
    <div
      className={`grid grid-cols-3 gap-3 sm:gap-4 w-full ${
        align === "left" ? "max-w-[520px] mx-auto lg:mx-0" : "max-w-[520px] mx-auto"
      }`}
      data-testid="hero-stats"
    >
      {finalStats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
