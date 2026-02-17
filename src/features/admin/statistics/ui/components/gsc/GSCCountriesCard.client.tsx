// src/features/admin/statistics/ui/components/gsc/GSCCountriesCard.client.tsx
"use client";

import { Globe } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";
import { resolveCountry } from "@/features/admin/statistics/utils/countryMap";

interface Props {
  byCountry: GSCRow[];
  loading?: boolean;
}

const BAR_COLORS = [
  "#1f2937",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#9ca3af",
  "#64748b",
];

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function GSCCountriesCard({ byCountry, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-3 bg-gray-100 rounded-full mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (byCountry.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henuz ulke verisi yok</p>
      </div>
    );
  }

  const totalClicks = byCountry.reduce((a, c) => a + c.clicks, 0) || 1;

  const countries = byCountry.slice(0, 8).map((row, i) => {
    const code = row.keys[0] ?? "";
    const { name, flag } = resolveCountry(code);
    const percent = Math.round((row.clicks / totalClicks) * 100);
    return {
      name,
      flag,
      clicks: row.clicks,
      percent,
      color: BAR_COLORS[i % BAR_COLORS.length],
    };
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Ulkelere Gore Arama
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <Globe size={12} />
          <span>{formatNum(totalClicks)} tiklama</span>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
        {countries.map((c) => (
          <div
            key={c.name}
            style={{
              width: `${Math.max(c.percent, 2)}%`,
              backgroundColor: c.color,
            }}
            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      {/* Country list */}
      <div className="flex-1 space-y-2">
        {countries.map((country) => (
          <div
            key={country.name}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm leading-none">{country.flag}</span>
              <div>
                <p className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors leading-none">
                  {country.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  {country.clicks.toLocaleString("tr-TR")} tiklama
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${country.percent}%`,
                    backgroundColor: country.color,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                %{country.percent}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
