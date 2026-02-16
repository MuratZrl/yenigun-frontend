"use client";

import {
  ArrowUp,
  ArrowDown,
  Users,
  Home,
  UserCheck,
  CheckCircle,
} from "lucide-react";

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

function miniAreaPath(data: number[], w: number, h: number) {
  return `${miniSparkPath(data, w, h)} L ${w} ${h} L 0 ${h} Z`;
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export type MetricCardsProps = {
  totalAdverts: number;
  activeAdverts: number;
  customerCount: number;
  advisorCount: number;
  loading?: boolean;
};

export default function MetricCards({
  totalAdverts,
  activeAdverts,
  customerCount,
  advisorCount,
  loading,
}: MetricCardsProps) {
  const inactiveAdverts = totalAdverts - activeAdverts;
  const activeRate = totalAdverts > 0 ? Math.round((activeAdverts / totalAdverts) * 100) : 0;

  const metrics = [
    {
      label: "Toplam İlan",
      value: loading ? "—" : formatCount(totalAdverts),
      sub: `${activeAdverts} aktif`,
      icon: Home,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      chartColor: "rgb(59, 130, 246)",
      spark: [3, 5, 4, 7, 6, 8, 7, totalAdverts > 0 ? 10 : 2],
    },
    {
      label: "Aktif İlanlar",
      value: loading ? "—" : formatCount(activeAdverts),
      sub: `%${activeRate} aktif oran`,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      chartColor: "rgb(22, 163, 74)",
      spark: [2, 4, 3, 5, 6, 5, 7, activeAdverts > 0 ? 9 : 2],
    },
    {
      label: "Müşteriler",
      value: loading ? "—" : formatCount(customerCount),
      sub: "Toplam müşteri",
      icon: Users,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      chartColor: "rgb(99, 102, 241)",
      spark: [4, 3, 5, 4, 6, 7, 6, customerCount > 0 ? 8 : 2],
    },
    {
      label: "Danışmanlar",
      value: loading ? "—" : String(advisorCount),
      sub: "Aktif danışman",
      icon: UserCheck,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      chartColor: "rgb(245, 158, 11)",
      spark: [1, 1, 2, 2, 2, 3, 3, advisorCount > 0 ? advisorCount : 1],
    },
  ];

  const sw = 80;
  const sh = 24;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        const gradId = `homeMetricGrad${i}`;
        return (
          <div
            key={i}
            className={`bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 ${metric.iconBg} rounded-lg flex items-center justify-center`}
              >
                <Icon size={16} className={metric.iconColor} />
              </div>
            </div>

            <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{metric.label}</p>
            <p className="text-[10px] text-gray-400 mb-2">{metric.sub}</p>

            <svg
              viewBox={`0 0 ${sw} ${sh}`}
              className="w-full h-6"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.chartColor} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={metric.chartColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={miniAreaPath(metric.spark, sw, sh)} fill={`url(#${gradId})`} />
              <path
                d={miniSparkPath(metric.spark, sw, sh)}
                fill="none"
                stroke={metric.chartColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
