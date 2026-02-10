// src/features/admin/users/ui/components/CustomersNoteSearchBar.tsx
"use client";

import React from "react";
import { StickyNote } from "lucide-react";

type Props = {
  value: string;
  loading: boolean;
  active: boolean;
  onChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function CustomersNoteSearchBar({
  value,
  loading,
  active,
  onChange,
  onSearch,
  onClear,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <StickyNote
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Müşteri notlarında ara..."
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none text-sm sm:text-base"
          type="button"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Aranıyor...</span>
            </>
          ) : (
            <>
              <StickyNote size={16} className="sm:size-4" />
              <span>Notlarda Ara</span>
            </>
          )}
        </button>

        {active ? (
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-200 flex-1 sm:flex-none text-sm sm:text-base"
            type="button"
          >
            <span>Not Aramayı Temizle</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
