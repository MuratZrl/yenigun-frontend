"use client";

import { Activity, Eye, MousePointerClick, ArrowUpRight } from "lucide-react";

const sparkData = [32, 45, 38, 52, 48, 65, 58, 72, 68, 80, 72, 78, 85, 72, 88, 92, 86, 94];
const maxSpark = Math.max(...sparkData);

function buildSparklinePath(data: number[], w: number, h: number) {
  const step = w / (data.length - 1);
  return data
    .map((val, i) => {
      const x = i * step;
      const y = h - (val / maxSpark) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildAreaPath(data: number[], w: number, h: number) {
  return `${buildSparklinePath(data, w, h)} L ${w} ${h} L 0 ${h} Z`;
}

const miniStats = [
  { label: "Sayfa Gör.", value: "312", icon: Eye },
  { label: "Tıklama", value: "89", icon: MousePointerClick },
];

export default function ActiveUsersCard() {
  const w = 220;
  const h = 50;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl p-4 flex flex-col h-full relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/8 rounded-full blur-2xl" />

      <div className="relative flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Activity size={14} className="text-emerald-400" />
            </div>
            <p className="text-xs text-gray-400">Aktif Kullanıcılar</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Canlı</span>
          </div>
        </div>

        {/* Big number + change */}
        <div className="flex items-end gap-2 mb-3">
          <p className="text-4xl font-bold tracking-tight leading-none">72</p>
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400 mb-1">
            <ArrowUpRight size={10} />
            +18%
          </span>
        </div>

        {/* Sparkline */}
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
          <defs>
            <linearGradient id="liveSparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(52, 211, 153)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={buildAreaPath(sparkData, w, h)} fill="url(#liveSparkGrad)" />
          <path
            d={buildSparklinePath(sparkData, w, h)}
            fill="none"
            stroke="rgb(52, 211, 153)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Mini stats row */}
        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-white/10">
          {miniStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-1.5">
                <Icon size={10} className="text-gray-500" />
                <span className="text-[10px] text-gray-500">{s.label}</span>
                <span className="text-[11px] font-semibold text-gray-300">{s.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
