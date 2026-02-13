// src/features/admin/emlak-list/ui/AdvertListEmptyState.tsx

"use client";

import React from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default function AdvertListEmptyState() {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <FileText size={48} className="mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        İlan bulunamadı
      </h3>
      <p className="text-gray-600 mb-4">
        Filtrelerinizi değiştirmeyi deneyin veya yeni ilan ekleyin.
      </p>
      <Link
        href="/admin/emlak/add"
        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <Plus size={16} />
        Yeni İlan Ekle
      </Link>
    </div>
  );
}