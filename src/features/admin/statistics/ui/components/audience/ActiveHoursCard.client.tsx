// src/features/admin/statistics/ui/components/audience/ActiveHoursCard.client.tsx
"use client";

import { Clock } from "lucide-react";

// Hours 6-23 (active hours), days Mon-Sun
const hours = [
  "06", "07", "08", "09", "10", "11", "12",
  "13", "14", "15", "16", "17", "18", "19",
  "20", "21", "22", "23",
];
const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Intensity values 0-10 for each hour × day
const heatmapData: number[][] = [
  // Pzt  Sal  Çar  Per  Cum  Cmt  Paz
  [1, 1, 1, 1, 1, 0, 0],   // 06
  [2, 2, 2, 2, 2, 1, 0],   // 07
  [4, 3, 4, 3, 3, 1, 1],   // 08
  [6, 5, 6, 5, 5, 2, 1],   // 09
  [8, 7, 8, 7, 7, 3, 2],   // 10
  [9, 8, 9, 8, 8, 4, 2],   // 11
  [7, 6, 7, 6, 5, 5, 3],   // 12
  [8, 8, 9, 8, 7, 4, 2],   // 13
  [10, 9, 10, 9, 8, 3, 2], // 14
  [9, 9, 9, 9, 8, 3, 2],   // 15
  [8, 8, 8, 8, 7, 3, 2],   // 16
  [7, 7, 7, 7, 6, 4, 3],   // 17
  [6, 6, 6, 5, 5, 5, 4],   // 18
  [5, 5, 5, 5, 4, 6, 5],   // 19
  [6, 5, 6, 5, 5, 7, 6],   // 20
  [7, 6, 7, 6, 6, 8, 7],   // 21
  [5, 4, 5, 4, 5, 6, 5],   // 22
  [3, 2, 3, 2, 3, 4, 3],   // 23
];

function getColor(val: number): string {
  if (val === 0) return "rgb(243, 244, 246)";       // gray-100
  if (val <= 2) return "rgb(219, 234, 254)";        // blue-100
  if (val <= 4) return "rgb(147, 197, 253)";        // blue-300
  if (val <= 6) return "rgb(59, 130, 246)";          // blue-500
  if (val <= 8) return "rgb(37, 99, 235)";           // blue-600
  return "rgb(29, 78, 216)";                          // blue-700
}

export default function ActiveHoursCard() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={18} className="text-blue-400" />
          <h3 className="text-lg font-semibold">En Aktif Saatler</h3>
        </div>

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[340px]">
            {/* Day headers */}
            <div className="flex gap-1 mb-1.5 ml-10">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex-1 text-center text-[10px] text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {hours.map((hour, hIdx) => (
                <div key={hour} className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500 w-8 text-right flex-shrink-0">
                    {hour}:00
                  </span>
                  <div className="flex gap-1 flex-1">
                    {heatmapData[hIdx].map((val, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex-1 h-4 rounded-[3px] transition-colors"
                        style={{ backgroundColor: getColor(val) }}
                        title={`${days[dIdx]} ${hour}:00 — Yoğunluk: ${val}/10`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/10">
          <span className="text-[10px] text-gray-500 mr-1">Az</span>
          {[0, 2, 4, 6, 8, 10].map((v) => (
            <div
              key={v}
              className="w-4 h-3 rounded-[2px]"
              style={{ backgroundColor: getColor(v) }}
            />
          ))}
          <span className="text-[10px] text-gray-500 ml-1">Çok</span>
        </div>

        {/* Peak info */}
        <div className="flex items-center justify-center gap-6 mt-3">
          <div className="text-center">
            <p className="text-sm font-bold text-blue-400">14:00</p>
            <p className="text-[10px] text-gray-500">En Yoğun Saat</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-sm font-bold text-blue-400">Çarşamba</p>
            <p className="text-[10px] text-gray-500">En Yoğun Gün</p>
          </div>
        </div>
      </div>
    </div>
  );
}
