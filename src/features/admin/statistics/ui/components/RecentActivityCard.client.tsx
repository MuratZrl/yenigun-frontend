"use client";

import { Activity, Home, User } from "lucide-react";

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
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Son Eklenen İlanlar</h3>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-start gap-2.5">
              <div className="w-7 h-7 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = recentAdverts.slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Son Eklenen İlanlar</h3>
        </div>
        {items.length > 0 && (
          <span className="text-[10px] text-gray-400">{items.length} ilan</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-gray-400">Henüz ilan bulunmuyor</p>
        </div>
      ) : (
        <div className="flex-1 space-y-1">
          {items.map((advert, i) => {
            const advisorName = advert.advisor
              ? `${advert.advisor.name || ""} ${advert.advisor.surname || ""}`.trim()
              : "";
            return (
              <div
                key={advert.uid ?? i}
                className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0 group"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    advert.active ? "bg-green-50" : "bg-gray-100"
                  }`}
                >
                  <Home
                    size={12}
                    className={advert.active ? "text-green-500" : "text-gray-400"}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-snug line-clamp-1">
                    {advert.title || `İlan #${advert.uid}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {advisorName && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                        <User size={8} />
                        {advisorName}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-300">
                      {timeAgo(advert.created?.createdTimestamp)}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    advert.active
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {advert.active ? "Aktif" : "Pasif"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
