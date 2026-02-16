// src/features/admin/statistics/ui/components/audience/DemographicsCard.client.tsx
"use client";

import { useState } from "react";

const tabs = ["Yaş", "Cinsiyet"];

const ageGroups = [
  { label: "18-24", male: 12, female: 14 },
  { label: "25-34", male: 28, female: 22 },
  { label: "35-44", male: 18, female: 15 },
  { label: "45-54", male: 10, female: 8 },
  { label: "55-64", male: 5, female: 4 },
  { label: "65+", male: 2, female: 2 },
];

const genderData = [
  { label: "Erkek", percent: 58, color: "#3b82f6" },
  { label: "Kadın", percent: 38, color: "#ec4899" },
  { label: "Belirtilmemiş", percent: 4, color: "#9ca3af" },
];

function buildDonutSegments(
  data: { percent: number; color: string }[],
  r: number
) {
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return data.map((d) => {
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

export default function DemographicsCard() {
  const [activeTab, setActiveTab] = useState(0);
  const maxBarVal = Math.max(
    ...ageGroups.flatMap((g) => [g.male, g.female])
  );
  const r = 48;
  const donut = buildDonutSegments(genderData, r);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Demografik</h3>
        <div className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === i
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 && (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-xs text-gray-500">Erkek</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-pink-500" />
              <span className="text-xs text-gray-500">Kadın</span>
            </div>
          </div>

          {/* Butterfly / paired horizontal bars */}
          <div className="space-y-3">
            {ageGroups.map((group) => (
              <div key={group.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">
                  {group.label}
                </span>
                {/* Male bar (right-aligned) */}
                <div className="flex-1 flex justify-end">
                  <div
                    className="bg-blue-500 h-5 rounded-l-md transition-all duration-500"
                    style={{
                      width: `${(group.male / maxBarVal) * 100}%`,
                    }}
                  />
                </div>
                {/* Female bar (left-aligned) */}
                <div className="flex-1">
                  <div
                    className="bg-pink-500 h-5 rounded-r-md transition-all duration-500"
                    style={{
                      width: `${(group.female / maxBarVal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-center gap-8 mt-5 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">%58</p>
              <p className="text-xs text-gray-400">Erkek</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-pink-500">%38</p>
              <p className="text-xs text-gray-400">Kadın</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-400">%4</p>
              <p className="text-xs text-gray-400">Diğer</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <div className="flex items-center gap-8">
          {/* Donut */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg viewBox="0 0 112 112" className="w-full h-full -rotate-90">
              {donut.map((seg, i) => (
                <circle
                  key={i}
                  cx="56"
                  cy="56"
                  r={r}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={seg.dasharray}
                  strokeDashoffset={seg.dashoffset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-900">8.249</span>
              <span className="text-[10px] text-gray-400">Toplam</span>
            </div>
          </div>

          {/* Legend list */}
          <div className="flex-1 space-y-4">
            {genderData.map((g) => (
              <div key={g.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    <span className="text-sm text-gray-700">{g.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    %{g.percent}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${g.percent}%`,
                      backgroundColor: g.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
