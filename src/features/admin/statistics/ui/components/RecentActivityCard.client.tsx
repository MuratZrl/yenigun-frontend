// src/features/admin/statistics/ui/components/RecentActivityCard.client.tsx
"use client";

import Link from "next/link";
import { Clock, Home, User, ExternalLink, CheckCircle2, XCircle } from "lucide-react";

export type RecentAdvert = {
  uid?: number;
  title?: string;
  active?: boolean;
  advisor?: { name?: string; surname?: string };
  customer?: { name?: string; surname?: string };
  created?: { createdTimestamp?: number };
};

export type RecentActivityCardProps = {
  recentAdverts: RecentAdvert[];
  loading?: boolean;
};

const rowColors = [
  { light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", icon: "text-blue-500" },
  { light: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", icon: "text-indigo-500" },
  { light: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", icon: "text-violet-500" },
  { light: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200", icon: "text-cyan-500" },
  { light: "bg-teal-50", text: "text-teal-600", border: "border-teal-200", icon: "text-teal-500" },
  { light: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: "text-amber-500" },
  { light: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", icon: "text-rose-500" },
  { light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: "text-emerald-500" },
  { light: "bg-sky-50", text: "text-sky-600", border: "border-sky-200", icon: "text-sky-500" },
  { light: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", icon: "text-orange-500" },
];

function timeAgo(timestamp: number | undefined) {
  if (!timestamp) return "";
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function RecentActivityCard({
  recentAdverts,
  loading,
}: RecentActivityCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full animate-pulse">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gray-100" />
          <div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-1.5" />
            <div className="h-3 w-52 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-1.5" />
                <div className="h-2 bg-gray-50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = recentAdverts.slice(0, 9);
  const activeCount = items.filter((a) => a.active).length;
  const passiveCount = items.length - activeCount;

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
          <Clock size={18} className="text-gray-300" />
        </div>
        <p className="text-xs text-gray-400">Henüz ilan bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Clock size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Son Eklenen İlanlar
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              En son eklenen ilanların listesi
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50/60 rounded-xl px-3 py-2.5 border border-emerald-100">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 size={11} className="text-emerald-500" />
            <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">Aktif</span>
          </div>
          <span className="text-lg font-bold text-emerald-700">{activeCount}</span>
        </div>
        <div className="bg-gray-50/60 rounded-xl px-3 py-2.5 border border-gray-200">
          <div className="flex items-center gap-1.5 mb-1">
            <XCircle size={11} className="text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Pasif</span>
          </div>
          <span className="text-lg font-bold text-gray-600">{passiveCount}</span>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">İlan</span>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider w-20 text-right">Danışman</span>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider w-14 text-right">Durum</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 space-y-1.5">
        {items.map((advert, i) => {
          const advisorName = advert.advisor
            ? `${advert.advisor.name || ""} ${advert.advisor.surname || ""}`.trim()
            : "";
          const colorSet = rowColors[i % rowColors.length];

          return (
            <Link
              key={advert.uid ?? i}
              href={`/ilan/${advert.uid}`}
              target="_blank"
              className="group relative block rounded-xl px-3 py-2.5 hover:bg-gray-50/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg ${colorSet.light} ${colorSet.border} border flex items-center justify-center flex-shrink-0`}
                  >
                    <Home size={12} className={colorSet.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[13px] font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors"
                        title={advert.title || `İlan #${advert.uid}`}
                      >
                        {advert.title || `İlan #${advert.uid}`}
                      </span>
                      <ExternalLink
                        size={10}
                        className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-300 tabular-nums">
                        {timeAgo(advert.created?.createdTimestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {advisorName && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 w-20 text-right truncate" title={advisorName}>
                      <User size={10} className="text-gray-300 flex-shrink-0" />
                      {advisorName}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-lg w-14 text-center ${
                      advert.active
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-gray-50 text-gray-400 border border-gray-200"
                    }`}
                  >
                    {advert.active ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
