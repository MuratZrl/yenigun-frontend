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
    <div className="flex flex-col sm:flex-row gap-2.5">
      <div className="relative flex-1">
        <StickyNote
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
        <input
          type="text"
          placeholder="Müşteri notlarında ara..."
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white shadow-sm placeholder:text-gray-400 text-gray-800 outline-none transition-all duration-150 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
              <span>Aranıyor...</span>
            </>
          ) : (
            <>
              <StickyNote size={14} />
              <span>Notlarda Ara</span>
            </>
          )}
        </button>

        {active && (
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 active:bg-gray-100 px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-150"
            type="button"
          >
            <span>Temizle</span>
          </button>
        )}
      </div>
    </div>
  );
}
