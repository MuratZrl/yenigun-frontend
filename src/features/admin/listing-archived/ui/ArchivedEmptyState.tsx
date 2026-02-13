// src/features/admin/emlak-archived/ui/ArchivedEmptyState.tsx

"use client";

import React from "react";
import { Filter } from "lucide-react";

type Props = {
  onResetFilters: () => void;
};

export default function ArchivedEmptyState({ onResetFilters }: Props) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Filter size={48} className="mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        İlan bulunamadı
      </h3>
      <p className="text-gray-600 mb-4">
        Filtre kriterlerinize uygun arşivlenmiş ilan bulunamadı.
      </p>
      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 bg-custom-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}