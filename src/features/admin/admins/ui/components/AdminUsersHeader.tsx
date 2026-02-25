// src/features/admin/admins/ui/components/AdminUsersHeader.tsx
"use client";

import React from "react";
import { Plus } from "lucide-react";

type Props = {
  totalCount: number;
  onOpenCreate: () => void;
};

export default function UsersHeader({ totalCount, onOpenCreate }: Props) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Yetkili Yönetimi
          </h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Toplam {totalCount} yetkili bulunuyor
          </p>
        </div>

        <button
          className="bg-slate-900 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 font-semibold text-sm lg:text-base w-full lg:w-auto justify-center"
          onClick={onOpenCreate}
          type="button"
        >
          <Plus size={18} />
          Yeni Yetkili Ekle
        </button>
      </div>
    </div>
  );
}
