// src/features/admin/emlak-archived/ui/ArchivedWarningBanner.tsx

"use client";

import React from "react";
import type { Advert } from "../types";

type Props = {
  filteredAdverts: Advert[];
};

export default function ArchivedWarningBanner({ filteredAdverts }: Props) {
  const hasActiveAds = filteredAdverts.some((ad) => ad.active);

  if (!hasActiveAds) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">
            Arşivde olmayan ilanlar da bulunuyor
          </h3>
          <p className="text-yellow-700 text-xs sm:text-sm mt-1">
            Sadece arşivlenmiş ilanları görmek için sayfayı yenileyin.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
        >
          Sayfayı Yenile
        </button>
      </div>
    </div>
  );
}