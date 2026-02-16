"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, Globe } from "lucide-react";

const months = ["Haziran", "Temmuz", "Ağustos"];

const deviceData: Record<
  string,
  { name: string; percent: number; color: string; icon: typeof Monitor; sessions: string }[]
> = {
  Haziran: [
    { name: "Masaüstü", percent: 48, color: "#1f2937", icon: Monitor, sessions: "5.2K" },
    { name: "Mobil", percent: 40, color: "#3b82f6", icon: Smartphone, sessions: "4.3K" },
    { name: "Tablet", percent: 12, color: "#93c5fd", icon: Tablet, sessions: "1.3K" },
  ],
  Temmuz: [
    { name: "Masaüstü", percent: 45, color: "#1f2937", icon: Monitor, sessions: "5.8K" },
    { name: "Mobil", percent: 42, color: "#3b82f6", icon: Smartphone, sessions: "5.4K" },
    { name: "Tablet", percent: 13, color: "#93c5fd", icon: Tablet, sessions: "1.7K" },
  ],
  Ağustos: [
    { name: "Masaüstü", percent: 44, color: "#1f2937", icon: Monitor, sessions: "6.1K" },
    { name: "Mobil", percent: 43, color: "#3b82f6", icon: Smartphone, sessions: "6.0K" },
    { name: "Tablet", percent: 13, color: "#93c5fd", icon: Tablet, sessions: "1.8K" },
  ],
};

function buildDonut(devices: { percent: number; color: string }[], r: number) {
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return devices.map((d) => {
    const dashLen = (d.percent / 100) * circ;
    const gap = circ - dashLen;
    const seg = { dasharray: `${dashLen} ${gap}`, dashoffset: -offset, color: d.color };
    offset += dashLen;
    return seg;
  });
}

const browsers = [
  { name: "Chrome", percent: 64, color: "#1f2937" },
  { name: "Safari", percent: 18, color: "#3b82f6" },
  { name: "Firefox", percent: 11, color: "#8b5cf6" },
  { name: "Diğer", percent: 7, color: "#d1d5db" },
];

export default function DevicesCard() {
  const [activeMonth, setActiveMonth] = useState(2);
  const devices = deviceData[months[activeMonth]];
  const r = 44;
  const segments = buildDonut(devices, r);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Cihazlar</h3>
        <div className="flex gap-1">
          {months.map((month, i) => (
            <button
              key={month}
              onClick={() => setActiveMonth(i)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activeMonth === i
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Donut + legend inline */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-shrink-0" style={{ width: 100, height: 100 }}>
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
            <span className="text-lg font-bold text-gray-900">{devices[0].percent}%</span>
            <span className="text-[9px] text-gray-400">Masaüstü</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: device.color }}
                  />
                  <Icon size={12} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{device.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">{device.sessions}</span>
                  <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                    {device.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Browser breakdown */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 mb-2">
          <Globe size={11} className="text-gray-400" />
          <span className="text-[11px] text-gray-500 font-medium">Tarayıcılar</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden mb-2">
          {browsers.map((b) => (
            <div
              key={b.name}
              style={{ width: `${b.percent}%`, backgroundColor: b.color }}
              className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          {browsers.map((b) => (
            <div key={b.name} className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-[10px] text-gray-400">
                {b.name} {b.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
