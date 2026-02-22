// src/features/admin/sms-panel/ui/components/SmsStatsCards.tsx
"use client";

import React from "react";
import { Mail, Send, CheckCircle2, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import type { SmsStats } from "../../lib/types";

type Props = {
  stats: SmsStats;
};

export default function SmsStatsCards({ stats }: Props) {
  const successRate = stats.totalSent > 0
    ? ((stats.successCount / stats.totalSent) * 100).toFixed(1)
    : "0.0";

  const failRate = stats.totalSent > 0
    ? ((stats.failCount / stats.totalSent) * 100).toFixed(1)
    : "0.0";

  const quotaPercent = stats.remainingQuota > 0
    ? Math.min(100, (stats.remainingQuota / (stats.remainingQuota + stats.totalSent)) * 100)
    : 0;

  const cards = [
    {
      key: "quota",
      label: "Kalan Mesaj Hakkı",
      icon: Mail,
      value: stats.remainingQuota,
      subtitle: `${quotaPercent.toFixed(0)}% kota kaldı`,
      iconBg: "bg-blue-600",
      trendIcon: null as typeof TrendingUp | null,
      trendColor: "",
      progressColor: "bg-blue-500",
      progressPercent: quotaPercent,
    },
    {
      key: "sent",
      label: "Toplam Gönderilen",
      icon: Send,
      value: stats.totalSent,
      subtitle: "Tüm zamanlar",
      iconBg: "bg-indigo-600",
      trendIcon: TrendingUp,
      trendColor: "text-indigo-500",
      progressColor: "bg-indigo-500",
      progressPercent: 100,
    },
    {
      key: "success",
      label: "Başarılı Gönderim",
      icon: CheckCircle2,
      value: stats.successCount,
      subtitle: `%${successRate} başarı oranı`,
      iconBg: "bg-emerald-600",
      trendIcon: TrendingUp,
      trendColor: "text-emerald-500",
      progressColor: "bg-emerald-500",
      progressPercent: stats.totalSent > 0 ? (stats.successCount / stats.totalSent) * 100 : 0,
    },
    {
      key: "fail",
      label: "Başarısız Gönderim",
      icon: XCircle,
      value: stats.failCount,
      subtitle: `%${failRate} hata oranı`,
      iconBg: "bg-red-500",
      trendIcon: TrendingDown,
      trendColor: "text-red-500",
      progressColor: "bg-red-500",
      progressPercent: stats.totalSent > 0 ? (stats.failCount / stats.totalSent) * 100 : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={card.key}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Top row: icon + trend */}
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center shadow-sm`}>
                <Icon size={20} className="text-white" />
              </div>
              {TrendIcon && (
                <div className={`flex items-center gap-1 ${card.trendColor}`}>
                  <TrendIcon size={14} />
                </div>
              )}
            </div>

            {/* Value */}
            <div>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">
                {card.value.toLocaleString("tr-TR")}
              </div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">{card.label}</div>
            </div>

            {/* Progress bar + subtitle */}
            <div className="space-y-1.5">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${card.progressColor} transition-all duration-500`}
                  style={{ width: `${card.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-400">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
