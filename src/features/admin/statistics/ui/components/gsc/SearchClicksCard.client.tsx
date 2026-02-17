// src/features/admin/statistics/ui/components/gsc/SearchClicksCard.client.tsx
"use client";

import { MousePointerClick, Eye, Target, MapPin } from "lucide-react";
import type { GSCTotals } from "@/features/admin/statistics/api/gscApi";

interface Props {
  totals: GSCTotals | null;
  loading?: boolean;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const metrics = [
  {
    key: "clicks",
    label: "Toplam Tiklama",
    icon: MousePointerClick,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    format: (t: GSCTotals) => formatNum(t.clicks),
  },
  {
    key: "impressions",
    label: "Toplam Gosterim",
    icon: Eye,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    format: (t: GSCTotals) => formatNum(t.impressions),
  },
  {
    key: "ctr",
    label: "Ortalama CTR",
    icon: Target,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    format: (t: GSCTotals) => `%${(t.ctr * 100).toFixed(1)}`,
  },
  {
    key: "position",
    label: "Ort. Pozisyon",
    icon: MapPin,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    format: (t: GSCTotals) => t.position.toFixed(1),
  },
];

export default function SearchClicksCard({ totals, loading }: Props) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col justify-between ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Arama Tiklamalari
      </h3>

      <div className="space-y-3 flex-1">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 ${m.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <Icon size={15} className={m.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 leading-none mb-0.5">
                  {m.label}
                </p>
                <p className="text-base font-bold text-gray-900 leading-none">
                  {loading || !totals ? "\u2014" : m.format(totals)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
