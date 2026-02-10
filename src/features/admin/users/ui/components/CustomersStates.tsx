// src/features/admin/users/ui/components/CustomersStates.tsx
"use client";

import React from "react";
import { User } from "lucide-react";

type Kind = "loading" | "mobileLoading" | "empty";

type Props = {
  kind: Kind;
  onOpenCreate?: () => void;
  onClear?: () => void;
};

export default function CustomersStates({ kind, onOpenCreate, onClear }: Props) {
  if (kind === "loading") {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (kind === "mobileLoading") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-600">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-gray-400" size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Kullanıcı bulunamadı
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Filtre kriterlerinize uygun kullanıcı bulunamadı.
        </p>
        {onOpenCreate ? (
          <button
            onClick={onOpenCreate}
            className="text-custom-orange hover:text-orange-600 font-medium text-sm"
            type="button"
          >
            Yeni kullanıcı ekle
          </button>
        ) : onClear ? (
          <button
            onClick={onClear}
            className="text-custom-orange hover:text-orange-600 font-medium text-sm"
            type="button"
          >
            Filtreleri temizle
          </button>
        ) : null}
      </div>
    </div>
  );
}
