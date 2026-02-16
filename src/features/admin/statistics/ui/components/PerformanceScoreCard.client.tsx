"use client";

import { Gauge, Zap, Image, FileCode, Wifi } from "lucide-react";

function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 90
      ? "rgb(22, 163, 74)"
      : score >= 50
      ? "rgb(245, 158, 11)"
      : "rgb(239, 68, 68)";
  const bgColor =
    score >= 90
      ? "rgba(22, 163, 74, 0.1)"
      : score >= 50
      ? "rgba(245, 158, 11, 0.1)"
      : "rgba(239, 68, 68, 0.1)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

const performanceMetrics = [
  { label: "FCP", value: "1.2s", icon: Zap, status: "good" as const },
  { label: "LCP", value: "2.4s", icon: Image, status: "good" as const },
  { label: "CLS", value: "0.08", icon: FileCode, status: "good" as const },
  { label: "TTFB", value: "0.6s", icon: Wifi, status: "good" as const },
];

export default function PerformanceScoreCard() {
  const overallScore = 92;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Gauge size={14} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Site Performansı</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <ScoreRing score={overallScore} />
        <div>
          <p className="text-xs text-gray-500 mb-1">Genel Skor</p>
          <p className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">
            İyi Performans
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2"
            >
              <Icon size={12} className="text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 leading-none">{metric.label}</p>
                <p className="text-xs font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
