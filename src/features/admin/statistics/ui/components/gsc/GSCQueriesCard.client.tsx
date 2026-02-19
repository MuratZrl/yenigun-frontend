// src/features/admin/statistics/ui/components/gsc/GSCQueriesCard.client.tsx
"use client";

import { Search, Target, MapPin } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";

interface Props {
  byQuery: GSCRow[];
  loading?: boolean;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function GSCQueriesCard({ byQuery, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-44 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-100 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (byQuery.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz sorgu verisi yok</p>
      </div>
    );
  }

  const queries = byQuery.slice(0, 8);
  const maxClicks = queries[0]?.clicks ?? 1;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Popüler Arama Sorguları
        </h3>
        <Search size={14} className="text-gray-300" />
      </div>

      <div className="flex-1 space-y-2">
        {queries.map((row, i) => {
          const query = row.keys[0] ?? "";
          const barWidth = Math.max((row.clicks / maxClicks) * 100, 4);
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-gray-600 truncate max-w-[55%] group-hover:text-gray-900 transition-colors">
                  {query}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <Target size={8} />
                    %{(row.ctr * 100).toFixed(1)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                    <MapPin size={8} />
                    {row.position.toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 w-10 text-right">
                    {formatNum(row.clicks)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-700"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
