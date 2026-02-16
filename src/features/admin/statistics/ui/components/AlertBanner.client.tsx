"use client";

import { Bell, ChevronRight, Sparkles } from "lucide-react";

export default function AlertBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/50 rounded-xl p-3.5 flex items-center justify-between group hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center relative">
          <Bell className="w-4 h-4 text-amber-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
            <Sparkles size={7} className="text-white" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Uyarı ayarlanmadı</p>
          <p className="text-[11px] text-gray-500">
            Verileriniz büyük ölçüde değiştiğinde bildirim alın
          </p>
        </div>
      </div>
      <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-[11px] font-medium text-white transition-colors flex items-center gap-1.5">
        Uyarı Ayarla
        <ChevronRight size={12} />
      </button>
    </div>
  );
}
