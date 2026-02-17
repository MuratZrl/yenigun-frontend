// src/features/admin/statistics/ui/components/gsc/GSCTopPagesCard.client.tsx
"use client";

import { ExternalLink } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";

interface Props {
  byPage: GSCRow[];
  loading?: boolean;
}

const barColors = ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4", "#14b8a6", "#f59e0b"];

function extractPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function pathLabel(path: string): string {
  if (path === "/" || path === "") return "Ana Sayfa";
  // Remove leading slash and use last segment
  const segments = path.replace(/^\//, "").split("/");
  const last = segments[segments.length - 1];
  // Capitalize first letter
  return decodeURIComponent(last).replace(/[-_]/g, " ");
}

export default function GSCTopPagesCard({ byPage, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
              <div className="h-1.5 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (byPage.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henuz sayfa verisi yok</p>
      </div>
    );
  }

  const maxClicks = byPage[0]?.clicks ?? 1;
  const pages = byPage.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          En Cok Tiklanan Sayfalar
        </h3>
        <ExternalLink size={14} className="text-gray-300" />
      </div>

      <div className="flex-1 space-y-2.5">
        {pages.map((row, i) => {
          const path = extractPath(row.keys[0]);
          const label = pathLabel(path);
          const barWidth = Math.max((row.clicks / maxClicks) * 100, 4);
          const color = barColors[i % barColors.length];

          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-xs text-gray-600 truncate group-hover:text-gray-900 transition-colors"
                    title={path}
                  >
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-gray-400">
                    %{(row.ctr * 100).toFixed(1)}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 w-12 text-right">
                    {row.clicks.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
