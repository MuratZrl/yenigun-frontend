// src/features/admin/emlak-archived/ui/ArchivedFilterBar.tsx

"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import type { FilterState } from "../types";

type Props = {
  filters: FilterState;
  onTitleChange: (value: string) => void;
  onUidChange: (value: string) => void;
  onSearch: () => void;
  onOpenFilter: () => void;
};

export default function ArchivedFilterBar({
  filters,
  onTitleChange,
  onUidChange,
  onSearch,
  onOpenFilter,
}: Props) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="bg-white rounded-xl shadow-sm border p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
          {/* Title search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="İlan başlığı ile arayın..."
              value={filters.title}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-orange focus:border-transparent text-sm sm:text-base"
              onChange={(e) => onTitleChange(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          {/* UID search */}
          <div className="relative w-full sm:w-32">
            <input
              type="number"
              placeholder="ID ara..."
              value={filters.uid}
              className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-orange focus:border-transparent text-sm sm:text-base"
              onChange={(e) => onUidChange(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base min-w-[80px]"
              onClick={onSearch}
            >
              <Search size={18} />
              <span>Ara</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base min-w-[100px]"
              onClick={onOpenFilter}
            >
              <Filter size={18} />
              <span>Filtrele</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}