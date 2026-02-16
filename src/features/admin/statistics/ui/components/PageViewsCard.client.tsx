"use client";

import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";

const periods = ["Bugün", "Bu Hafta", "Bu Ay"];

const chartDataMap: Record<string, { label: string; views: number; visitors: number }[]> = {
  Bugün: [
    { label: "00", views: 120, visitors: 80 },
    { label: "03", views: 85, visitors: 60 },
    { label: "06", views: 180, visitors: 130 },
    { label: "09", views: 420, visitors: 310 },
    { label: "12", views: 580, visitors: 400 },
    { label: "15", views: 640, visitors: 450 },
    { label: "18", views: 520, visitors: 380 },
    { label: "21", views: 380, visitors: 260 },
  ],
  "Bu Hafta": [
    { label: "Pzt", views: 3200, visitors: 2100 },
    { label: "Sal", views: 3800, visitors: 2500 },
    { label: "Çar", views: 3400, visitors: 2300 },
    { label: "Per", views: 4200, visitors: 2800 },
    { label: "Cum", views: 4600, visitors: 3100 },
    { label: "Cmt", views: 2800, visitors: 1900 },
    { label: "Paz", views: 2200, visitors: 1500 },
  ],
  "Bu Ay": [
    { label: "1.H", views: 18200, visitors: 12400 },
    { label: "2.H", views: 22400, visitors: 15200 },
    { label: "3.H", views: 25800, visitors: 17600 },
    { label: "4.H", views: 28200, visitors: 19100 },
  ],
};

const CW = 900;
const CH = 180;
const PX = 35;
const PT = 10;
const PB = 24;

function toPoint(i: number, val: number, count: number, maxVal: number, minVal: number) {
  const range = maxVal - minVal || 1;
  const x = PX + ((CW - PX * 2) / (count - 1)) * i;
  const y = PT + ((maxVal - val) / range) * (CH - PT - PB);
  return { x, y };
}

function linePath(values: number[], maxVal: number, minVal: number) {
  return values
    .map((v, i) => {
      const { x, y } = toPoint(i, v, values.length, maxVal, minVal);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function areaPath(values: number[], maxVal: number, minVal: number) {
  const bottom = CH - PB;
  const last = toPoint(values.length - 1, values[values.length - 1], values.length, maxVal, minVal);
  const first = toPoint(0, values[0], values.length, maxVal, minVal);
  return `${linePath(values, maxVal, minVal)} L ${last.x.toFixed(1)} ${bottom} L ${first.x.toFixed(1)} ${bottom} Z`;
}

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function PageViewsCard() {
  const [activePeriod, setActivePeriod] = useState(0);
  const data = chartDataMap[periods[activePeriod]];
  const views = data.map((d) => d.views);
  const visitors = data.map((d) => d.visitors);
  const allVals = [...views, ...visitors];
  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const totalViews = views.reduce((a, b) => a + b, 0);
  const totalVisitors = visitors.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <BarChart3 size={14} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Sayfa Görüntüleme</h3>
            </div>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-gray-900">{formatNum(totalViews)}</span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-green-600 mb-0.5">
                <TrendingUp size={10} />
                +12.5%
              </span>
              <span className="text-[11px] text-gray-400 mb-0.5 ml-1">
                {formatNum(totalVisitors)} ziyaretçi
              </span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] text-gray-400">Görüntüleme</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-300" />
              <span className="text-[11px] text-gray-400">Ziyaretçi</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {periods.map((period, i) => (
            <button
              key={period}
              onClick={() => setActivePeriod(i)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                activePeriod === i
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Dual line area chart */}
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full mt-2"
        style={{ aspectRatio: `${CW} / ${CH}` }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="pvViewGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pvVisitorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(165,180,252)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgb(165,180,252)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PX}
            y1={PT + (CH - PT - PB) * ratio}
            x2={CW - PX}
            y2={PT + (CH - PT - PB) * ratio}
            stroke="#f3f4f6"
            strokeWidth="0.8"
          />
        ))}

        {/* Visitors area + line */}
        <path d={areaPath(visitors, maxVal, minVal)} fill="url(#pvVisitorGrad)" />
        <path
          d={linePath(visitors, maxVal, minVal)}
          fill="none"
          stroke="rgb(165,180,252)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Views area + line */}
        <path d={areaPath(views, maxVal, minVal)} fill="url(#pvViewGrad)" />
        <path
          d={linePath(views, maxVal, minVal)}
          fill="none"
          stroke="rgb(59,130,246)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on views */}
        {views.map((v, i) => {
          const { x, y } = toPoint(i, v, views.length, maxVal, minVal);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="white"
              stroke="rgb(59,130,246)"
              strokeWidth="2"
            />
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          const { x } = toPoint(i, 0, data.length, maxVal, minVal);
          return (
            <text key={i} x={x} y={CH - 4} textAnchor="middle" className="fill-gray-400" fontSize="11">
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
