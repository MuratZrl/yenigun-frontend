// src/features/admin/emlak-list/ui/AdvertListFilterBar.tsx

"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import type { FilterState } from "../types";

type Props = {
  filters: FilterState;
  loading: boolean;
  onTitleChange: (value: string) => void;
  onUidChange: (value: string) => void;
  onSearch: () => void;
  onOpenFilter: () => void;
};

export default function AdvertListFilterBar({
  filters,
  loading,
  onTitleChange,
  onUidChange,
  onSearch,
  onOpenFilter,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="px-6 py-4 bg-white border-b">
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex flex-1 gap-3 w-full">
          {/* Title search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="İlan başlığı ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-custom-orange focus:ring-1 focus:ring-custom-orange outline-none"
              value={filters.title}
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* UID search */}
          <input
            type="number"
            placeholder="ID ara..."
            className="w-32 px-3 py-2.5 border border-gray-300 rounded-lg focus:border-custom-orange focus:ring-1 focus:ring-custom-orange outline-none"
            value={filters.uid}
            onChange={(e) => onUidChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSearch}
            disabled={loading}
            className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                Aranıyor...
              </>
            ) : (
              <>
                <Search size={16} />
                Ara
              </>
            )}
          </button>

          <button
            onClick={onOpenFilter}
            className="border border-gray-300 hover:border-custom-orange text-gray-700 hover:text-custom-orange px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <Filter size={16} />
            Gelişmiş
          </button>
        </div>
      </div>
    </div>
  );
}