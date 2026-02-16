// src/features/category-detail/ui/components/SortInfoBar.client.tsx
"use client";

import { ArrowUpDown } from "lucide-react";

interface SortInfoBarProps {
  totalItems: number;
  sortBy: string;
  sortOrder: string;
}

export default function SortInfoBar({
  totalItems,
  sortBy,
  sortOrder,
}: SortInfoBarProps) {
  return (
    <div className="hidden md:flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
      <div className="text-sm text-gray-600">
        <span className="font-medium">{totalItems}</span> ilan
        <span className="mx-2">•</span>
        <span className="text-blue-600 font-medium">
          {sortBy === "date"
            ? sortOrder === "asc"
              ? "Eski İlanlar Önce"
              : "Yeni İlanlar Önce"
            : sortOrder === "asc"
              ? "Ucuzdan Pahalıya"
              : "Pahalıdan Ucuza"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <ArrowUpDown className="w-4 h-4" />
        <span className="text-sm">Sıralı</span>
      </div>
    </div>
  );
}
