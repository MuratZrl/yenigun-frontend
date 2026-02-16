"use client";

import { ArrowUp, ArrowDown, MousePointerClick, Phone, MessageCircle, FileText } from "lucide-react";

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

const metrics = [
  {
    label: "Toplam Dönüşüm",
    value: "1.247",
    change: "+22.3%",
    isUp: true,
    icon: MousePointerClick,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    chartColor: "rgb(59, 130, 246)",
    spark: [680, 750, 820, 880, 960, 1050, 1140, 1247],
  },
  {
    label: "Telefon Aramaları",
    value: "384",
    change: "+8.6%",
    isUp: true,
    icon: Phone,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    chartColor: "rgb(22, 163, 74)",
    spark: [280, 300, 310, 320, 340, 350, 370, 384],
  },
  {
    label: "WhatsApp Mesajları",
    value: "562",
    change: "+34.1%",
    isUp: true,
    icon: MessageCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    chartColor: "rgb(16, 185, 129)",
    spark: [240, 290, 340, 380, 420, 470, 520, 562],
  },
  {
    label: "Form Gönderimleri",
    value: "301",
    change: "-5.2%",
    isUp: false,
    icon: FileText,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    chartColor: "rgb(147, 51, 234)",
    spark: [340, 330, 325, 318, 312, 308, 305, 301],
  },
];

export default function ConversionMetricCards() {
  const sw = 80;
  const sh = 24;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        const gradId = `convMetricGrad${i}`;
        return (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-8 h-8 ${metric.iconBg} rounded-lg flex items-center justify-center`}
              >
                <Icon size={16} className={metric.iconColor} />
              </div>
              <span
                className={`flex items-center gap-0.5 text-[11px] font-medium ${
                  metric.isUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {metric.isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {metric.change}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 mb-2">{metric.label}</p>

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
