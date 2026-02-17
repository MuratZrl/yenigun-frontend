// src/features/admin/statistics/ui/components/gsc/SearchPerformanceChart.client.tsx
"use client";

import { BarChart3 } from "lucide-react";
import type { GSCRow } from "@/features/admin/statistics/api/gscApi";

interface Props {
  byDate: GSCRow[];
  loading?: boolean;
}

/* ── SVG chart constants ── */
const CW = 900;
const CH = 180;
const PX = 40;
const PT = 10;
const PB = 24;

function toPoint(
  i: number,
  val: number,
  count: number,
  maxVal: number,
  minVal: number
) {
  const range = maxVal - minVal || 1;
  const x = PX + ((CW - PX * 2) / Math.max(count - 1, 1)) * i;
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
  if (values.length === 0) return "";
  const bottom = CH - PB;
  const last = toPoint(
    values.length - 1,
    values[values.length - 1],
    values.length,
    maxVal,
    minVal
  );
  const first = toPoint(0, values[0], values.length, maxVal, minVal);
  return `${linePath(values, maxVal, minVal)} L ${last.x.toFixed(
    1
  )} ${bottom} L ${first.x.toFixed(1)} ${bottom} Z`;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ];
  return `${day} ${months[d.getMonth()]}`;
}

export default function SearchPerformanceChart({ byDate, loading }: Props) {
  const clicks = byDate.map((r) => r.clicks);
  const impressions = byDate.map((r) => r.impressions);
  const allVals = [...clicks, ...impressions];
  const maxVal = allVals.length > 0 ? Math.max(...allVals) : 1;
  const minVal = allVals.length > 0 ? Math.min(...allVals) : 0;
  const totalClicks = clicks.reduce((a, b) => a + b, 0);
  const totalImpressions = impressions.reduce((a, b) => a + b, 0);

  // Show every Nth label to avoid clutter
  const labelStep = Math.max(1, Math.floor(byDate.length / 7));

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-32 bg-gray-100 rounded" />
      </div>
    );
  }

  if (byDate.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400">Henüz veri yok</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <BarChart3 size={14} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">
              Arama Performansı
            </h3>
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-gray-900">
              {formatNum(totalClicks)}
            </span>
            <span className="text-[11px] text-gray-400 mb-0.5">tıklama</span>
            <span className="text-[11px] text-gray-400 mb-0.5 ml-1">
              {formatNum(totalImpressions)} gösterim
            </span>
          </div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[11px] text-gray-400">Tıklama</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-300" />
            <span className="text-[11px] text-gray-400">Gösterim</span>
          </div>
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
          <linearGradient id="gscClickGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.12" />
            <stop
              offset="100%"
              stopColor="rgb(59,130,246)"
              stopOpacity="0"
            />
          </linearGradient>
          <linearGradient id="gscImprGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="rgb(165,180,252)"
              stopOpacity="0.08"
            />
            <stop
              offset="100%"
              stopColor="rgb(165,180,252)"
              stopOpacity="0"
            />
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

        {/* Impressions area + line */}
        <path
          d={areaPath(impressions, maxVal, minVal)}
          fill="url(#gscImprGrad)"
        />
        <path
          d={linePath(impressions, maxVal, minVal)}
          fill="none"
          stroke="rgb(165,180,252)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clicks area + line */}
        <path d={areaPath(clicks, maxVal, minVal)} fill="url(#gscClickGrad)" />
        <path
          d={linePath(clicks, maxVal, minVal)}
          fill="none"
          stroke="rgb(59,130,246)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on clicks */}
        {clicks.map((v, i) => {
          if (i % labelStep !== 0 && i !== clicks.length - 1) return null;
          const { x, y } = toPoint(i, v, clicks.length, maxVal, minVal);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="white"
              stroke="rgb(59,130,246)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* X labels */}
        {byDate.map((row, i) => {
          if (i % labelStep !== 0 && i !== byDate.length - 1) return null;
          const { x } = toPoint(i, 0, byDate.length, maxVal, minVal);
          return (
            <text
              key={i}
              x={x}
              y={CH - 4}
              textAnchor="middle"
              className="fill-gray-400"
              fontSize="10"
            >
              {formatDate(row.keys[0])}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
