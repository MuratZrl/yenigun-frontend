"use client";

import { Crown, Home, UserCheck } from "lucide-react";
import type { AdvisorStat } from "../../api/statisticsApi";

function RadialRing({
  percent,
  color,
  trackColor,
  size = 48,
  strokeWidth = 4,
}: {
  percent: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export type MoreStatsCardProps = {
  advisors: AdvisorStat[];
  loading?: boolean;
};

export default function MoreStatsCard({ advisors, loading }: MoreStatsCardProps) {
  const topAdvisors = [...advisors]
    .sort((a, b) => b.activeAdvertCount - a.activeAdvertCount)
    .slice(0, 3);

  const maxAdverts = topAdvisors.length > 0 ? topAdvisors[0].activeAdvertCount : 1;

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-xl p-4 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-400/15 rounded-full blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Crown size={14} className="text-amber-300" />
          <h3 className="text-sm font-semibold">Danışman Aktifliği</h3>
        </div>

        {loading ? (
          <div className="space-y-3.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                  <div className="h-2 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : topAdvisors.length === 0 ? (
          <p className="text-xs text-blue-200/60">Danışman verisi bulunamadı</p>
        ) : (
          <div className="space-y-3.5">
            {topAdvisors.map((stat, i) => {
              const name =
                `${stat.advisor.name || ""} ${stat.advisor.surname || ""}`.trim() ||
                "İsimsiz";
              const percent =
                maxAdverts > 0
                  ? Math.round((stat.activeAdvertCount / maxAdverts) * 100)
                  : 0;
              return (
                <div key={stat.advisor.uid} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <RadialRing
                      percent={percent}
                      color="rgba(255,255,255,0.85)"
                      trackColor="rgba(255,255,255,0.12)"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white/80">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-blue-200/70 leading-none truncate">
                      {name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-[10px] text-white/60">
                        <Home size={8} />
                        {stat.activeAdvertCount} aktif
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-white/40">
                        <UserCheck size={8} />
                        {stat.totalAdvertCount} toplam
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative mt-3 pt-3 border-t border-white/10">
        <p className="text-[10px] text-blue-200/50">
          Aktif ilan sayısına göre sıralanmıştır
        </p>
      </div>
    </div>
  );
}
