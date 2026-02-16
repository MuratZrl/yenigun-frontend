// src/features/admin/statistics/ui/components/audience/UserTrendChart.client.tsx
"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

const periods = ["7 Gün", "30 Gün", "90 Gün"];

const trendData: Record<
  string,
  { label: string; users: number; sessions: number }[]
> = {
  "7 Gün": [
    { label: "Pzt", users: 980, sessions: 1240 },
    { label: "Sal", users: 1120, sessions: 1380 },
    { label: "Çar", users: 1340, sessions: 1620 },
    { label: "Per", users: 1050, sessions: 1310 },
    { label: "Cum", users: 1460, sessions: 1780 },
    { label: "Cmt", users: 870, sessions: 1040 },
    { label: "Paz", users: 720, sessions: 880 },
  ],
  "30 Gün": [
    { label: "1. H", users: 5200, sessions: 6400 },
    { label: "2. H", users: 6100, sessions: 7500 },
    { label: "3. H", users: 5800, sessions: 7100 },
    { label: "4. H", users: 7400, sessions: 9200 },
  ],
  "90 Gün": [
    { label: "Oca", users: 18200, sessions: 22400 },
    { label: "Şub", users: 21500, sessions: 26800 },
    { label: "Mar", users: 24800, sessions: 31000 },
  ],
};

function formatNum(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

/* Wide + short viewBox for a compact chart */
const CHART_W = 900;
const CHART_H = 180;
const PAD_X = 35;
const PAD_TOP = 10;
const PAD_BOT = 24; // space for labels

function toPoint(
  i: number,
  val: number,
  count: number,
  allVals: number[]
) {
  const max = Math.max(...allVals);
  const min = Math.min(...allVals);
  const range = max - min || 1;
  const x = PAD_X + ((CHART_W - PAD_X * 2) / (count - 1)) * i;
  const y = PAD_TOP + ((max - val) / range) * (CHART_H - PAD_TOP - PAD_BOT);
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
  const bottom = CHART_H - PAD_BOT;
  const last = toPoint(values.length - 1, values[values.length - 1], values.length, allVals);
  const first = toPoint(0, values[0], values.length, allVals);
  return `${linePath(values, allVals)} L ${last.x.toFixed(1)} ${bottom} L ${first.x.toFixed(1)} ${bottom} Z`;
}

export default function UserTrendChart() {
  const [activePeriod, setActivePeriod] = useState(0);

  const data = trendData[periods[activePeriod]];
  const users = data.map((d) => d.users);
  const sessions = data.map((d) => d.sessions);
  const allVals = [...users, ...sessions];
  const totalUsers = users.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Kullanıcı Trendi
            </h3>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-gray-900">
                {formatNum(totalUsers)}
              </span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-green-600 mb-0.5">
                <TrendingUp size={10} />
                +12.4%
              </span>
            </div>
          </div>
          {/* Legend inline */}
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[11px] text-gray-400">Kullanıcılar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-300" />
              <span className="text-[11px] text-gray-400">Oturumlar</span>
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

      {/* Compact chart */}
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ aspectRatio: `${CHART_W} / ${CHART_H}` }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="audUserGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="audSessionGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(165,180,252)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="rgb(165,180,252)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={PAD_X}
            y1={PAD_TOP + (CHART_H - PAD_TOP - PAD_BOT) * ratio}
            x2={CHART_W - PAD_X}
            y2={PAD_TOP + (CHART_H - PAD_TOP - PAD_BOT) * ratio}
            stroke="#f3f4f6"
            strokeWidth="0.8"
          />
        ))}

        {/* Sessions area + line */}
        <path d={areaPath(sessions, allVals)} fill="url(#audSessionGrad2)" />
        <path
          d={linePath(sessions, allVals)}
          fill="none"
          stroke="rgb(165,180,252)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Users area + line */}
        <path d={areaPath(users, allVals)} fill="url(#audUserGrad2)" />
        <path
          d={linePath(users, allVals)}
          fill="none"
          stroke="rgb(59,130,246)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on user line */}
        {users.map((v, i) => {
          const { x, y } = toPoint(i, v, users.length, allVals);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="rgb(59,130,246)"
              strokeWidth="2"
            />
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => {
          const { x } = toPoint(i, 0, data.length, allVals);
          return (
            <text
              key={i}
              x={x}
              y={CHART_H - 4}
              textAnchor="middle"
              className="fill-gray-400"
              fontSize="11"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
