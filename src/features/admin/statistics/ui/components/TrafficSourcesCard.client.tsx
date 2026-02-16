"use client";

import { Globe, Search, Share2, Link2, Mail, TrendingUp, TrendingDown } from "lucide-react";

function miniSparkPath(data: number[], w: number, h: number) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * step;
      const y = ((max - v) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const sources = [
  {
    name: "Doğrudan",
    count: 6840,
    percent: 40,
    change: 5.2,
    color: "#1f2937",
    icon: Globe,
    spark: [5200, 5400, 5800, 6100, 6400, 6600, 6840],
  },
  {
    name: "Organik Arama",
    count: 5130,
    percent: 30,
    change: 12.8,
    color: "#3b82f6",
    icon: Search,
    spark: [3800, 4100, 4400, 4600, 4800, 5000, 5130],
  },
  {
    name: "Sosyal Medya",
    count: 2565,
    percent: 15,
    change: 22.4,
    color: "#8b5cf6",
    icon: Share2,
    spark: [1400, 1600, 1800, 2000, 2200, 2400, 2565],
  },
  {
    name: "Yönlendirme",
    count: 1710,
    percent: 10,
    change: -3.6,
    color: "#06b6d4",
    icon: Link2,
    spark: [1900, 1850, 1800, 1780, 1750, 1720, 1710],
  },
  {
    name: "E-posta",
    count: 855,
    percent: 5,
    change: 8.1,
    color: "#f59e0b",
    icon: Mail,
    spark: [600, 650, 700, 740, 780, 820, 855],
  },
];

const total = sources.reduce((a, s) => a + s.count, 0);

export default function TrafficSourcesCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Kaynaklar</h3>
        <span className="text-[11px] text-gray-400">{total.toLocaleString("tr-TR")} toplam</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
        {sources.map((s) => (
          <div
            key={s.name}
            style={{ width: `${s.percent}%`, backgroundColor: s.color }}
            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      {/* Source list with sparklines */}
      <div className="space-y-2.5">
        {sources.map((source, idx) => {
          const Icon = source.icon;
          const isUp = source.change > 0;
          const sparkW = 48;
          const sparkH = 16;
          return (
            <div key={source.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${source.color}15` }}
                >
                  <Icon size={13} style={{ color: source.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors leading-none">
                    {source.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] text-gray-400">
                      %{source.percent}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-medium ${
                        isUp ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                      {Math.abs(source.change)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Mini sparkline */}
                <svg
                  viewBox={`0 0 ${sparkW} ${sparkH}`}
                  className="w-12 h-4"
                  preserveAspectRatio="none"
                >
                  <path
                    d={miniSparkPath(source.spark, sparkW, sparkH)}
                    fill="none"
                    stroke={source.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
                <span className="text-xs font-semibold text-gray-900 w-10 text-right">
                  {source.count.toLocaleString("tr-TR")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
