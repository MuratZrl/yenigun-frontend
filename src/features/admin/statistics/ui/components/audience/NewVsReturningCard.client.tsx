// src/features/admin/statistics/ui/components/audience/NewVsReturningCard.client.tsx
"use client";

import { UserPlus, UserCheck, TrendingUp } from "lucide-react";

const segments = [
  {
    label: "Yeni Kullanıcılar",
    value: 74.3,
    count: 6128,
    color: "#1f2937",
    icon: UserPlus,
    trend: "+18.2%",
  },
  {
    label: "Geri Dönen",
    value: 25.7,
    count: 2121,
    color: "#3b82f6",
    icon: UserCheck,
    trend: "-3.8%",
  },
];

const total = 8249;

function buildDonutSegments(
  data: { value: number; color: string }[],
  r: number
) {
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return data.map((d) => {
    const dashLen = (d.value / 100) * circ;
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

export default function NewVsReturningCard() {
  const r = 56;
  const donut = buildDonutSegments(segments, r);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Yeni ve Geri Dönen
      </h3>

      <div className="flex items-center gap-8">
        {/* Donut */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
            {donut.map((seg, i) => (
              <circle
                key={i}
                cx="64"
                cy="64"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {total.toLocaleString("tr-TR")}
            </span>
            <span className="text-[10px] text-gray-400">Toplam</span>
          </div>
        </div>

        {/* Detailed breakdown */}
        <div className="flex-1 space-y-4">
          {segments.map((seg) => {
            const Icon = seg.icon;
            return (
              <div
                key={seg.label}
                className="bg-gray-50 rounded-xl p-3.5"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${seg.color}15` }}
                  >
                    <Icon size={16} style={{ color: seg.color }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {seg.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      {seg.count.toLocaleString("tr-TR")}
                    </span>
                    <span className="text-sm text-gray-400 ml-1.5">
                      (%{seg.value})
                    </span>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      seg.trend.startsWith("+")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <TrendingUp size={11} />
                    {seg.trend}
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
