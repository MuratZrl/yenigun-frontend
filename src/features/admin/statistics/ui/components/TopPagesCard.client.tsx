"use client";

import { ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

const topPages = [
  { label: "Ana Sayfa", path: "/", visits: 23956, change: 12.4, barColor: "#3b82f6" },
  { label: "İletişim", path: "/contact", visits: 962, change: 8.2, barColor: "#6366f1" },
  { label: "Konut Satılık", path: "/konut/satilik", visits: 785, change: -3.1, barColor: "#8b5cf6" },
  { label: "Hakkımızda", path: "/about", visits: 565, change: 5.7, barColor: "#06b6d4" },
  { label: "Arama", path: "/search", visits: 486, change: 22.3, barColor: "#14b8a6" },
  { label: "İlanlar", path: "/ilanlar", visits: 477, change: -1.8, barColor: "#f59e0b" },
];

const maxVisits = topPages[0].visits;

export default function TopPagesCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">En Çok Ziyaret Edilen</h3>
        <ExternalLink size={14} className="text-gray-300" />
      </div>

      <div className="flex-1 space-y-2.5">
        {topPages.map((page, i) => {
          const barWidth = Math.max((page.visits / maxVisits) * 100, 4);
          const isUp = page.change > 0;
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: page.barColor }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                    {page.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`flex items-center gap-0.5 text-[10px] font-medium ${
                      isUp ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isUp ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                    {Math.abs(page.change)}%
                  </span>
                  <span className="text-xs font-semibold text-gray-900 w-12 text-right">
                    {page.visits.toLocaleString("tr-TR")}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%`, backgroundColor: page.barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
