// src/features/admin/users/ui/components/CustomersSearchBar.tsx
"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onOpenFilter: () => void;
};

export default function CustomersSearchBar({
  value,
  onChange,
  onSearch,
  onOpenFilter,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="İsim, soyisim veya email ile ara..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onSearch}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
            type="button"
          >
            <Search size={18} className="sm:size-4" />
            <span>Ara</span>
          </button>

          <button
            onClick={onOpenFilter}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
            type="button"
          >
            <Filter size={16} className="sm:size-4" />
            <span>Filtrele</span>
          </button>
        </div>
      </div>
    </div>
  );
}
