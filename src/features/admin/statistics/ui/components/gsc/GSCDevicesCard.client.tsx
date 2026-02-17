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
  { name: string; color: string; icon: typeof Monitor }
> = {
  DESKTOP: { name: "Masaustu", color: "#1f2937", icon: Monitor },
  MOBILE: { name: "Mobil", color: "#3b82f6", icon: Smartphone },
  TABLET: { name: "Tablet", color: "#93c5fd", icon: Tablet },
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
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
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
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henuz cihaz verisi yok</p>
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Cihaz Dagilimi
      </h3>

      {/* Donut + legend */}
      <div className="flex items-center gap-4">
        <div
          className="relative flex-shrink-0"
          style={{ width: 100, height: 100 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
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
            <span className="text-lg font-bold text-gray-900">
              {devices[0]?.percent ?? 0}%
            </span>
            <span className="text-[9px] text-gray-400">
              {devices[0]?.name ?? ""}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div
                key={device.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: device.color }}
                  />
                  <Icon size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{device.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">
                    {formatNum(device.clicks)}
                  </span>
                  <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                    {device.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
