// src/features/ads/ui/components/AdsHeaderBar.tsx
"use client";

import React from "react";
import { Star } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  totalItems: number;
  featureFilters: Record<string, any>;
  onClear: () => void;

  // selectbox kalktığı için artık şart değil:
  // onSortChange: (sortBy: "date" | "price", sortOrder: "asc" | "desc") => void;

  onSaveSearch?: () => void;
};

export default function AdsHeaderBar({
  filters,
  totalItems,
  onSaveSearch,
}: Props) {
  const queryLabel =
    filters.type && filters.type !== "Hepsi"
      ? `"${filters.type}"`
      : `"Tüm İlanlar"`;

  return (
    <div className="border border-gray-200 rounded-sm bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-[13px] text-gray-700 truncate">
          <span className="font-semibold">{queryLabel}</span> aramanızda{" "}
          <span className="text-red-600 font-semibold">
            {totalItems.toLocaleString("tr-TR")}
          </span>{" "}
          ilan bulundu.
        </div>
      </div>
    </div>
  );
}
