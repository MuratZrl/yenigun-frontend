// src/features/admin/admins/ui/components/UsersStates.tsx
"use client";

import React from "react";
import { AlertTriangle, Search } from "lucide-react";

type BannerProps = {
  filteredOutCount: number;
  onClear: () => void;
};

export function UsersActiveFilterBanner({ filteredOutCount, onClear }: BannerProps) {
  if (!filteredOutCount) return null;

  return (
    <div className="mt-4 p-3 lg:p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
      <AlertTriangle size={18} className="text-yellow-600 shrink-0" />
      <div className="text-xs lg:text-sm text-yellow-800">
        <span className="font-medium">Aktif filtreleme:</span> {filteredOutCount} kayıt filtrelendi.{" "}
        <button
          className="underline font-medium hover:text-yellow-900 transition-colors"
          onClick={onClear}
          type="button"
        >
          Tümünü göster
        </button>
      </div>
    </div>
  );
}

export function UsersMobileLoadingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    </div>
  );
}

export function UsersMobileEmptyCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <Search size={48} className="text-gray-300" />
        <div className="text-lg font-medium">Kayıt bulunamadı</div>
        <p className="text-gray-400 text-sm">
          Arama kriterlerinize uygun sonuç bulunamadı.
        </p>
      </div>
    </div>
  );
}
