// src/features/admin/emlak-list/ui/AdvertListHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  totalCount: number;
};

export default function AdvertListHeader({ totalCount }: Props) {
  return (
    <div className="bg-white border-b">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İlan Yönetimi</h1>
            <p className="text-gray-600 mt-1">Toplam {totalCount} ilan</p>
          </div>
          <Link
            href="/admin/emlak/add"
            className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            Yeni İlan Ekle
          </Link>
        </div>
      </div>
    </div>
  );
}