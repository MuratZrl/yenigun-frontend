// src/features/admin/emlak-archived/ui/ArchivedHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  totalCount: number;
};

export default function ArchivedHeader({ totalCount }: Props) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Arşivlenen İlanlar
            </h1>
            <p className="text-gray-600 mt-1">
              Toplam {totalCount} arşivlenmiş ilan
            </p>
          </div>

          <Link
            href="/admin/emlak/add"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            Yeni İlan Ekle
          </Link>
        </div>
      </div>
    </div>
  );
}