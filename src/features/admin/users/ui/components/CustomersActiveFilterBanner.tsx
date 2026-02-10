// src/features/admin/users/ui/components/CustomersActiveFilterBanner.tsx
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  filteredOutCount: number;
  onClear: () => void;
  noteSearchActive?: boolean;
};

export default function CustomersActiveFilterBanner({
  filteredOutCount,
  onClear,
  noteSearchActive,
}: Props) {
  const show = filteredOutCount > 0 || Boolean(noteSearchActive);
  if (!show) return null;

  return (
    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
      <AlertTriangle size={18} className="text-yellow-600 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-yellow-800 text-sm">
          <strong>Aktif filtreleme</strong> uygulanıyor.
          <button
            onClick={onClear}
            className="underline hover:text-yellow-900 font-medium ml-2"
            type="button"
          >
            Filtreleri temizle
          </button>
        </p>
      </div>
    </div>
  );
}
