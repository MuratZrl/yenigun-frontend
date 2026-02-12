// src/features/admin/emlak-archived-detail/ui/Sidebar.tsx

"use client";

import React from "react";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import type { AdvertData } from "../types";

type Props = {
  data: AdvertData;
  isReactivating: boolean;
  isDeleting: boolean;
  onReactivate: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

export default function Sidebar({
  data,
  isReactivating,
  isDeleting,
  onReactivate,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="sticky top-8 flex flex-col gap-6">
      {/* Price card */}
      <div className="bg-white rounded-2xl p-6 text-black shadow-sm border border-gray-200">
        <p className="text-sm opacity-90">Fiyat</p>
        <p className="text-3xl font-bold mt-1">{data.fee}</p>
        <p className="text-sm opacity-90 mt-2">{data.steps.second}</p>
        <p className="text-sm opacity-90 mt-1">⭐ Arşivlenmiş İlan</p>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-16 bg-white flex items-center justify-center rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <img
              src="/logo.png"
              alt="Yenigün Emlak"
              className="w-full h-full select-none object-contain p-2"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-logo.png"; }}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Yenigün Emlak</h3>
            <p className="text-sm text-gray-500">
              {data.advisor.name} {data.advisor.surname}
            </p>
            <p className="text-xs text-amber-600 font-medium mt-1">Danışman</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">Admin görünümü</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="space-y-3">
          <button
            onClick={onReactivate}
            disabled={isReactivating}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <RefreshCw className={isReactivating ? "animate-spin" : ""} size={16} />
            {isReactivating ? "Aktifleştiriliyor..." : "İlanı Aktif Et"}
          </button>

          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors text-sm font-medium"
          >
            <Edit size={16} />
            İlanı Düzenle
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isDeleting ? <RefreshCw className="animate-spin" size={16} /> : <Trash2 size={16} />}
            {isDeleting ? "Siliniyor..." : "İlanı Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}