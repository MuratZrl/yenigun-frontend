// src/features/admin/statistics/ui/components/gsc/GSCDevicesCard.client.tsx
"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";

interface Props {
  byDevice: GSCRow[];
  loading?: boolean;
}

const DEVICE_META: Record<
  string,
  { name: string; color: string; bg: string; icon: typeof Monitor }
> = {
  DESKTOP: { name: "Masaüstü", color: "#000066", bg: "bg-[#000066]/10", icon: Monitor },
  MOBILE: { name: "Mobil", color: "#035DBA", bg: "bg-[#035DBA]/10", icon: Smartphone },
  TABLET: { name: "Tablet", color: "#03409F", bg: "bg-[#03409F]/10", icon: Tablet },
};

function buildDonut(
  devices: { percent: number; color: string }[],
  r: number
) {
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return devices.map((d) => {
    const dashLen = (d.percent / 100) * circ;
    const gap = circ - dashLen;
    const seg = {
      dasharray: `${dashLen} ${gap}`,
      dashoffset: -offset,
      color: d.color,
    };
    offset += dashLen;
    return seg;
  });
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function GSCDevicesCard({ byDevice, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full w-full animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
        <div className="flex items-center gap-4">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (byDevice.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full w-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz cihaz verisi yok</p>
      </div>
    );
  }

  const totalClicks = byDevice.reduce((a, d) => a + d.clicks, 0) || 1;

  const devices = byDevice.map((row) => {
    const key = row.keys[0]?.toUpperCase() ?? "DESKTOP";
    const meta = DEVICE_META[key] ?? DEVICE_META.DESKTOP;
    const percent = Math.round((row.clicks / totalClicks) * 100);
    return {
      ...meta,
      percent,
      clicks: row.clicks,
      impressions: row.impressions,
    };
  });

  // Sort by percent descending
  devices.sort((a, b) => b.percent - a.percent);

  const r = 44;
  const segments = buildDonut(devices, r);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full w-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Cihaz Dağılımı
      </h3>

      {/* Donut */}
      <div className="flex justify-center mb-4">
        <div
          className="relative flex-shrink-0"
          style={{ width: 130, height: 130 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="10"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[#000066]">
              {devices[0]?.percent ?? 0}%
            </span>
            <span className="text-[9px] text-gray-400 font-medium">
              {devices[0]?.name ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2.5">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <div
              key={device.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg ${device.bg} flex items-center justify-center`}
                >
                  <Icon size={14} style={{ color: device.color }} />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-800 block leading-tight">{device.name}</span>
                  <span className="text-[10px] text-gray-400">{formatNum(device.clicks)} tıklama</span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#000066]">
                {device.percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
