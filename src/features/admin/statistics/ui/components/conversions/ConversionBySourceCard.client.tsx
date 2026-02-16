"use client";

import { Search, Globe, Share2, Link2, Mail } from "lucide-react";

const sources = [
  {
    name: "Organik Arama",
    conversions: 412,
    rate: "11.2%",
    barPercent: 85,
    color: "#1f2937",
    icon: Search,
  },
  {
    name: "Doğrudan Trafik",
    conversions: 328,
    rate: "9.8%",
    barPercent: 68,
    color: "#3b82f6",
    icon: Globe,
  },
  {
    name: "Sosyal Medya",
    conversions: 256,
    rate: "14.5%",
    barPercent: 53,
    color: "#8b5cf6",
    icon: Share2,
  },
  {
    name: "Yönlendirme",
    conversions: 164,
    rate: "7.3%",
    barPercent: 34,
    color: "#06b6d4",
    icon: Link2,
  },
  {
    name: "E-posta",
    conversions: 87,
    rate: "18.6%",
    barPercent: 18,
    color: "#f59e0b",
    icon: Mail,
  },
];

const total = sources.reduce((a, s) => a + s.conversions, 0);

export default function ConversionBySourceCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Kaynağa Göre Dönüşümler
        </h3>
        <span className="text-[11px] text-gray-400">{total.toLocaleString("tr-TR")} toplam</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
        {sources.map((s) => (
          <div
            key={s.name}
            style={{ width: `${s.barPercent}%`, backgroundColor: s.color }}
            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <div className="space-y-3">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <div key={source.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${source.color}15` }}
                >
                  <Icon size={13} style={{ color: source.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">
                    {source.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    oran: %{source.rate}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {source.conversions}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
