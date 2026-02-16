"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

const periods = ["7 Gün", "30 Gün", "90 Gün"];

const chartData: Record<
  string,
  { label: string; conversions: number; visits: number }[]
> = {
  "7 Gün": [
    { label: "Pzt", conversions: 142, visits: 1280 },
    { label: "Sal", conversions: 168, visits: 1420 },
    { label: "Çar", conversions: 195, visits: 1560 },
    { label: "Per", conversions: 158, visits: 1340 },
    { label: "Cum", conversions: 210, visits: 1680 },
    { label: "Cmt", conversions: 124, visits: 980 },
    { label: "Paz", conversions: 98, visits: 820 },
  ],
  "30 Gün": [
    { label: "1. H", conversions: 680, visits: 6200 },
    { label: "2. H", conversions: 750, visits: 6800 },
    { label: "3. H", conversions: 820, visits: 7100 },
    { label: "4. H", conversions: 910, visits: 7500 },
  ],
  "90 Gün": [
    { label: "Oca", conversions: 2400, visits: 22000 },
    { label: "Şub", conversions: 2800, visits: 25000 },
    { label: "Mar", conversions: 3200, visits: 28000 },
  ],
};

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const CW = 900;
const CH = 180;
const PX = 35;
const PT = 10;
const PB = 24;

function toPoint(i: number, val: number, count: number, allVals: number[]) {
  const max = Math.max(...allVals);
  const min = Math.min(...allVals);
  const range = max - min || 1;
  const x = PX + ((CW - PX * 2) / (count - 1)) * i;
  const y = PT + ((max - val) / range) * (CH - PT - PB);
  return { x, y };
}

function linePath(values: number[], allVals: number[]) {
  return values
    .map((v, i) => {
      const { x, y } = toPoint(i, v, values.length, allVals);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function areaPath(values: number[], allVals: number[]) {
  const bottom = CH - PB;
  const last = toPoint(values.length - 1, values[values.length - 1], values.length, allVals);
  const first = toPoint(0, values[0], values.length, allVals);
  return `${linePath(values, allVals)} L ${last.x.toFixed(1)} ${bottom} L ${first.x.toFixed(1)} ${bottom} Z`;
}

export default function ConversionTrendChart() {
  const [activePeriod, setActivePeriod] = useState(0);

  const data = chartData[periods[activePeriod]];
  const conversions = data.map((d) => d.conversions);
  const visits = data.map((d) => d.visits);
  const allVals = [...conversions, ...visits];
  const totalConv = conversions.reduce((a, b) => a + b, 0);
  const totalVisits = visits.reduce((a, b) => a + b, 0);
  const avgRate = ((totalConv / totalVisits) * 100).toFixed(1);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Dönüşüm Trendi</h3>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-gray-900">
                {formatNum(totalConv)}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-green-600 mb-0.5">
                <TrendingUp size={10} />
                +22.3%
              </span>
              <span className="text-[11px] text-gray-400 mb-0.5 ml-1">
                ort. %{avgRate} oran
              </span>
            </div>
          </div>
          {/* Legend inline */}
          <div className="flex items-center gap-3 ml-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-[11px] text-gray-400">Ziyaretler</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-gray-400">Dönüşümler</span>
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

      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="w-full"
        style={{ aspectRatio: `${CW} / ${CH}` }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="convVisitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(209,213,219)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="rgb(209,213,219)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="convConvGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
          </linearGradient>
        </defs>

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

        {/* Visits area + line */}
        <path d={areaPath(visits, allVals)} fill="url(#convVisitGrad)" />
        <path
          d={linePath(visits, allVals)}
          fill="none"
          stroke="rgb(209,213,219)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Conversions area + line */}
        <path d={areaPath(conversions, allVals)} fill="url(#convConvGrad)" />
        <path
          d={linePath(conversions, allVals)}
          fill="none"
          stroke="rgb(16,185,129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on conversions */}
        {conversions.map((v, i) => {
          const { x, y } = toPoint(i, v, conversions.length, allVals);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="rgb(16,185,129)"
              strokeWidth="2"
            />
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          const { x } = toPoint(i, 0, data.length, allVals);
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
