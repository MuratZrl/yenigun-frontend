// src/features/admin/users/ui/components/CustomersHeader.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";

type Props = {
  title?: string;
  subtitle?: string;
  onOpenCreate: () => void;
};

export default function CustomersHeader({
  title = "Müşteri Yönetimi",
  subtitle = "Müşterileri yönetin, filtreleyin ve notlarında arama yapın",
  onOpenCreate,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-sm text-black/54 mt-1">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={onOpenCreate}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 shadow-sm hover:shadow-md flex items-center gap-2 font-medium text-sm w-full lg:w-auto justify-center"
      >
        <Plus size={18} strokeWidth={2} />
        Yeni Müşteri Ekle
      </button>
    </div>
  );
}
