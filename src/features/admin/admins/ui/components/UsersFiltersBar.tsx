// src/features/admin/admins/ui/components/UsersFiltersBar.tsx
"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onFilter: () => void;
  onClear: () => void;
  showClear: boolean;
};

export default function UsersFiltersBar({
  value,
  onChange,
  onFilter,
  onClear,
  showClear,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="İsim, email veya telefon ile ara..."
              className="w-full pl-10 pr-4 py-2 lg:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-sm lg:text-base"
              value={value}
              onChange={(e) => onChange(e.target.value.toLowerCase())}
              onKeyDown={(e) => e.key === "Enter" && onFilter()}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="bg-gray-800 text-white hover:bg-gray-900 duration-200 px-4 lg:px-6 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all hover:shadow-lg text-sm lg:text-base flex-1 sm:flex-none justify-center"
              onClick={onFilter}
              type="button"
            >
              <Filter size={16} />
              Filtrele
            </button>

            {showClear && (
              <button
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 duration-200 px-4 py-2 lg:py-3 rounded-xl flex items-center gap-2 font-medium transition-all text-sm lg:text-base flex-1 sm:flex-none justify-center"
                onClick={onClear}
                type="button"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
