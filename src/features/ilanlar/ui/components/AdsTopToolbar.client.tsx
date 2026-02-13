// src/features/ads/ui/components/AdsTopToolbar.client.tsx
"use client";

import React from "react";
import { LayoutGrid, List, Info } from "lucide-react";

type ViewMode = "list" | "grid";

export default function AdsTopToolbar({
  viewMode = "list",
  onViewChange,
  sortValue,
  onSortChange,
}: {
  viewMode?: ViewMode;
  onViewChange?: (v: ViewMode) => void;
  sortValue: string; // örn: "date_desc"
  onSortChange: (value: string) => void;
}) {
  return (
    <div
      className={[
        "hidden md:flex items-stretch justify-between",
        "bg-white",
        "relative z-10",
        // dış container border-top çizgisini “örtmek” için
        "-mt-px pt-px",
      ].join(" ")}
    >
      {/* SOL: sadece “Tümü” sekmesi */}
      <div className="flex items-stretch">
        <div
          className={[
            "relative",
            "px-4 flex items-center",
            "text-sm font-semibold text-blue-700",
            "bg-white",
            "border-r border-gray-200",
            // tab’ı 1px daha yukarı al, üst border çizgisini kapatsın
            "-mt-px pt-[3px]",
          ].join(" ")}
        >
          {/* border-top yerine mavi strip */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-blue-600" />
          Tümü
        </div>
      </div>

      {/* SAĞ: toolbar */}
      <div className="ml-auto flex items-center gap-2 px-2 py-1">
        <div className="inline-flex overflow-hidden border border-gray-300 bg-white">
          <button
            type="button"
            onClick={() => onViewChange?.("list")}
            className={[
              "h-8 w-9 grid place-items-center",
              viewMode === "list" ? "bg-gray-200 text-gray-900" : "hover:bg-gray-50 text-gray-700",
            ].join(" ")}
            aria-label="Liste görünümü"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => onViewChange?.("grid")}
            className={[
              "h-8 w-9 grid place-items-center border-l border-gray-300",
              viewMode === "grid" ? "bg-gray-200 text-gray-900" : "hover:bg-gray-50 text-gray-700",
            ].join(" ")}
            aria-label="Grid görünümü"
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-8 border border-gray-300 bg-white px-2 text-sm"
        >
          <option value="date_desc">Gelişmiş sıralama</option>
          <option value="date_asc">Eski ilanlar önce</option>
          <option value="price_asc">Ucuzdan pahalıya</option>
          <option value="price_desc">Pahalıdan ucuza</option>
        </select>

        <button
          type="button"
          className="h-8 w-8 grid place-items-center border border-gray-300 bg-white hover:bg-gray-50"
          aria-label="Bilgi"
        >
          <Info size={16} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
