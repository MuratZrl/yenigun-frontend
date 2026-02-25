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
    <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center mb-2.5">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
        <input
          type="text"
          placeholder="İsim, soyisim veya email ile ara..."
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white shadow-sm placeholder:text-gray-400 text-gray-800 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-150"
          type="button"
        >
          <Search size={14} />
          <span>Ara</span>
        </button>

        <button
          onClick={onOpenFilter}
          className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 active:bg-gray-100 px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-150"
          type="button"
        >
          <Filter size={14} />
          <span>Filtrele</span>
        </button>
      </div>
    </div>
  );
}
