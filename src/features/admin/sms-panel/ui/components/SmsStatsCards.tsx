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
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      glowColor: "shadow-blue-500/25",
      iconBg: "bg-white/15",
      trendIcon: null as typeof TrendingUp | null,
      progressTrack: "bg-white/15",
      progressBar: "bg-white",
      progressPercent: quotaPercent,
    },
    {
      key: "sent",
      label: "Toplam Gönderilen",
      icon: Send,
      value: stats.totalSent,
      subtitle: "Tüm zamanlar",
      gradient: "from-violet-600 via-purple-700 to-indigo-800",
      glowColor: "shadow-violet-500/25",
      iconBg: "bg-white/15",
      trendIcon: TrendingUp,
      progressTrack: "bg-white/15",
      progressBar: "bg-white",
      progressPercent: 100,
    },
    {
      key: "success",
      label: "Başarılı Gönderim",
      icon: CheckCircle2,
      value: stats.successCount,
      subtitle: `%${successRate} başarı oranı`,
      gradient: "from-emerald-500 via-emerald-600 to-teal-700",
      glowColor: "shadow-emerald-500/25",
      iconBg: "bg-white/15",
      trendIcon: TrendingUp,
      progressTrack: "bg-white/15",
      progressBar: "bg-white",
      progressPercent: stats.totalSent > 0 ? (stats.successCount / stats.totalSent) * 100 : 0,
    },
    {
      key: "fail",
      label: "Başarısız Gönderim",
      icon: XCircle,
      value: stats.failCount,
      subtitle: `%${failRate} hata oranı`,
      gradient: "from-rose-500 via-red-600 to-red-800",
      glowColor: "shadow-red-500/25",
      iconBg: "bg-white/15",
      trendIcon: TrendingDown,
      progressTrack: "bg-white/15",
      progressBar: "bg-white",
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
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 flex flex-col gap-4 shadow-lg ${card.glowColor} hover:shadow-xl transition-shadow duration-300 cursor-default`}
          >
            {/* Decorative blurred circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/10 blur-2xl pointer-events-none" />

            {/* Top row: icon + trend */}
            <div className="relative flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl ${card.iconBg} backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20`}>
                <Icon size={20} className="text-white" />
              </div>
              {TrendIcon && (
                <div className="flex items-center gap-1 text-white/60">
                  <TrendIcon size={14} />
                </div>
              )}
            </div>

            {/* Value */}
            <div className="relative">
              <div className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
                {card.value.toLocaleString("tr-TR")}
              </div>
              <div className="text-[13px] font-semibold text-white/70 mt-0.5 tracking-wide">
                {card.label}
              </div>
            </div>

            {/* Progress bar + subtitle */}
            <div className="relative space-y-2">
              <div className={`h-1.5 ${card.progressTrack} rounded-full overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${card.progressBar} transition-all duration-700 ease-out`}
                  style={{ width: `${card.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] font-medium text-white/50 tracking-wide">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
