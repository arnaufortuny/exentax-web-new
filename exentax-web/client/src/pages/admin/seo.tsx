import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Point {
  date: string;
  position: number;
  impressions: number;
  clicks: number;
  hasData: boolean;
}

interface Series {
  slug: string;
  lang: string;
  keyword: string;
  pageUrl: string;
  points: Point[];
  latest: Point | null;
  previous: Point | null;
  delta: number | null;
}

interface SnapshotsResponse {
  ok: boolean;
  dates: string[];
  series: Series[];
  message?: string;
  error?: string;
}

const FLAG: Record<string, string> = {
  es: "\u{1F1EA}\u{1F1F8}",
  en: "\u{1F1EC}\u{1F1E7}",
  fr: "\u{1F1EB}\u{1F1F7}",
  de: "\u{1F1E9}\u{1F1EA}",
  pt: "\u{1F1F5}\u{1F1F9}",
  ca: "\u{1F3F4}",
};

const LANGS = ["all", "es", "en", "fr", "de", "pt", "ca"] as const;
type LangFilter = (typeof LANGS)[number];

type SortKey = "biggest_drop" | "biggest_gain" | "best_position" | "worst_position" | "alpha";

function getAdminToken(): string {
  return new URLSearchParams(window.location.search).get("adminToken") || "";
}

function Sparkline({ points }: { points: Point[] }) {
  const valid = points.filter((p) => p.hasData && p.position > 0);
  if (valid.length === 0) {
    return <span className="text-xs text-[var(--text-3)]">—</span>;
  }
  const w = 120;
  const h = 28;
  const positions = valid.map((p) => p.position);
  const min = Math.min(...positions);
  const max = Math.max(...positions);
  const range = Math.max(0.5, max - min);
  // Lower position = better → invert Y (top = best)
  const coords = valid.map((p, i) => {
    const x = valid.length === 1 ? w / 2 : (i / (valid.length - 1)) * w;
    const norm = (p.position - min) / range;
    const y = 2 + norm * (h - 4);
    return [x, y] as const;
  });
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  const first = coords[0];
  const trend = valid[valid.length - 1].position - valid[0].position;
  const stroke = trend < -0.5 ? "#10B981" : trend > 0.5 ? "#EF4444" : "#9CA3AF";
  return (
    <svg width={w} height={h} role="img" aria-label="ranking sparkline" data-testid="sparkline">
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.5} />
      <circle cx={first[0]} cy={first[1]} r={1.8} fill={stroke} opacity={0.5} />
      <circle cx={last[0]} cy={last[1]} r={2.4} fill={stroke} />
    </svg>
  );
}

function formatPosition(p: Point | null): string {
  if (!p || !p.hasData || p.position <= 0) return "—";
  return p.position.toFixed(1);
}

function formatDelta(delta: number | null): { text: string; color: string } {
  if (delta === null || !isFinite(delta)) return { text: "—", color: "var(--text-3)" };
  if (Math.abs(delta) < 0.1) return { text: "0.0", color: "var(--text-3)" };
  if (delta < 0) return { text: `▲ ${Math.abs(delta).toFixed(1)}`, color: "#10B981" };
  return { text: `▼ ${delta.toFixed(1)}`, color: "#EF4444" };
}

export default function AdminSeoPage() {
  const [lang, setLang] = useState<LangFilter>("all");
  const [sort, setSort] = useState<SortKey>("biggest_drop");
  const [weeks, setWeeks] = useState(12);
  const [search, setSearch] = useState("");

  const token = getAdminToken();

  const { data, isLoading, error } = useQuery<SnapshotsResponse>({
    queryKey: ["/api/admin/seo/snapshots", weeks, token],
    queryFn: async () => {
      const res = await fetch(`/api/admin/seo/snapshots?weeks=${weeks}&adminToken=${encodeURIComponent(token)}`);
      return res.json();
    },
    enabled: !!token,
  });

  const filtered = useMemo(() => {
    const series = data?.series ?? [];
    let out = series;
    if (lang !== "all") out = out.filter((s) => s.lang === lang);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (s) =>
          s.slug.toLowerCase().includes(q) ||
          s.keyword.toLowerCase().includes(q),
      );
    }
    const sorted = [...out];
    sorted.sort((a, b) => {
      switch (sort) {
        case "biggest_drop":
          return (b.delta ?? -Infinity) - (a.delta ?? -Infinity);
        case "biggest_gain":
          return (a.delta ?? Infinity) - (b.delta ?? Infinity);
        case "best_position":
          return (a.latest?.position ?? Infinity) - (b.latest?.position ?? Infinity);
        case "worst_position":
          return (b.latest?.position ?? -Infinity) - (a.latest?.position ?? -Infinity);
        case "alpha":
          return a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang);
      }
    });
    return sorted;
  }, [data, lang, sort, search]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center">
        <p className="text-sm text-red-500" data-testid="text-no-token">
          Falta adminToken en la URL (añade ?adminToken=...).
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-0)]" data-testid="admin-seo-page">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-heading text-xl font-bold text-[var(--text-1)]" data-testid="text-heading">
              SEO rankings
            </h1>
            <p className="text-xs text-[var(--text-3)] mt-0.5" data-testid="text-subtitle">
              {data?.dates?.length ?? 0} snapshot(s) ·{" "}
              {data?.series?.length ?? 0} (artículo × idioma) tracked
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="search"
              placeholder="Buscar slug o keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-full text-xs bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-1)] focus:outline-none focus:border-[#00E510]/50 w-48"
              data-testid="input-search"
            />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangFilter)}
              className="px-3 py-1.5 rounded-full text-xs bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-1)] cursor-pointer"
              data-testid="select-lang"
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l === "all" ? "Todos los idiomas" : `${FLAG[l] ?? ""} ${l.toUpperCase()}`}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-1.5 rounded-full text-xs bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-1)] cursor-pointer"
              data-testid="select-sort"
            >
              <option value="biggest_drop">Mayor caída</option>
              <option value="biggest_gain">Mayor subida</option>
              <option value="best_position">Mejor posición</option>
              <option value="worst_position">Peor posición</option>
              <option value="alpha">Alfabético</option>
            </select>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="px-3 py-1.5 rounded-full text-xs bg-[var(--bg-1)] border border-[var(--border)] text-[var(--text-1)] cursor-pointer"
              data-testid="select-weeks"
            >
              {[4, 8, 12, 26, 52].map((n) => (
                <option key={n} value={n}>
                  Últimas {n} semanas
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-8 text-center text-sm text-[var(--text-3)]" data-testid="text-loading">
            Cargando snapshots...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500" data-testid="text-error">
            Error de conexión al cargar snapshots.
          </div>
        )}

        {data && !data.ok && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500" data-testid="text-api-error">
            {data.error || "Error al cargar snapshots"}
          </div>
        )}

        {data?.ok && data.series.length === 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] p-8 text-center text-sm text-[var(--text-3)]" data-testid="text-empty">
            {data.message || "No hay snapshots todavía. Ejecuta el monitor de rankings para generar los CSV."}
          </div>
        )}

        {data?.ok && filtered.length > 0 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-rankings">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wide text-[var(--text-3)] border-b border-[var(--border)]">
                    <th className="px-4 py-3 font-semibold">Artículo</th>
                    <th className="px-3 py-3 font-semibold">Lang</th>
                    <th className="px-3 py-3 font-semibold">Keyword</th>
                    <th className="px-3 py-3 font-semibold text-right">Pos.</th>
                    <th className="px-3 py-3 font-semibold text-right">Δ rango</th>
                    <th className="px-3 py-3 font-semibold">Tendencia</th>
                    <th className="px-3 py-3 font-semibold text-right">Impr.</th>
                    <th className="px-3 py-3 font-semibold text-right">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const delta = formatDelta(s.delta);
                    const id = `${s.slug}-${s.lang}`;
                    return (
                      <tr
                        key={id}
                        className="border-b border-[var(--border)]/40 hover:bg-[var(--bg-0)]/40"
                        data-testid={`row-series-${id}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--text-2)]">
                          <a
                            href={s.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#00E510] hover:underline"
                            data-testid={`link-page-${id}`}
                          >
                            {s.slug}
                          </a>
                        </td>
                        <td className="px-3 py-2.5 text-xs">
                          {FLAG[s.lang] ?? ""} {s.lang.toUpperCase()}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-[var(--text-2)] max-w-[260px] truncate" title={s.keyword}>
                          {s.keyword}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-[var(--text-1)]" data-testid={`text-position-${id}`}>
                          {formatPosition(s.latest)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs" style={{ color: delta.color }} data-testid={`text-delta-${id}`}>
                          {delta.text}
                        </td>
                        <td className="px-3 py-2.5">
                          <Sparkline points={s.points} />
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-[var(--text-2)]">
                          {s.latest?.impressions ?? 0}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-xs text-[var(--text-2)]">
                          {s.latest?.clicks ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-[10px] text-[var(--text-3)]">
          Δ rango = cambio en la posición media entre el primer y el último snapshot del rango. Verde = mejora (posición baja), rojo = empeora.
        </p>
      </div>
    </div>
  );
}
