// src/features/admin/users/ui/components/CustomersHeader.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";

type Props = {
  title?: string; // default: "Müşteri Yönetimi"
  subtitle?: string; // default: "Müşterileri yönetin, filtreleyin ve notlarında arama yapın"
  onOpenCreate: () => void;
};

export default function CustomersHeader({
  title = "Müşteri Yönetimi",
  subtitle = "Müşterileri yönetin, filtreleyin ve notlarında arama yapın",
  onOpenCreate,
}: Props) {
  return (
    <div className="pt-5 pl-5 pr-5 mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 group font-semibold text-sm lg:text-base w-full lg:w-auto justify-center"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform duration-200"
          />
          Yeni Müşteri Ekle
        </button>
      </div>
    </div>
  );
}
