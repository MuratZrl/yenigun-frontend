"use client";

import { ExternalLink } from "lucide-react";

const pages = [
  { path: "/contact", label: "İletişim", conversions: 87, rate: 22.1 },
  { path: "/ilan/satilik-daire-kadikoy", label: "Satılık Daire Kadıköy", conversions: 142, rate: 18.4 },
  { path: "/ilan/kiralik-ofis-levent", label: "Kiralık Ofis Levent", conversions: 98, rate: 15.2 },
  { path: "/ilan/satilik-villa-bodrum", label: "Satılık Villa Bodrum", conversions: 76, rate: 12.8 },
  { path: "/ilan/kiralik-dukkan-besiktas", label: "Kiralık Dükkan Beşiktaş", conversions: 52, rate: 11.7 },
  { path: "/ilanlar/istanbul", label: "İstanbul İlanları", conversions: 64, rate: 6.3 },
];

const maxConv = Math.max(...pages.map((p) => p.conversions));

export default function TopConvertingPagesCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          En Çok Dönüşüm Yapan Sayfalar
        </h3>
        <ExternalLink size={14} className="text-gray-300" />
      </div>

      <div className="space-y-2.5">
        {pages.map((page, i) => {
          const barW = Math.max((page.conversions / maxConv) * 100, 6);
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600 truncate mr-3 group-hover:text-gray-900 transition-colors">
                  {page.label}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-900">
                    {page.conversions}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                      page.rate >= 15
                        ? "bg-green-50 text-green-600"
                        : page.rate >= 10
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    %{page.rate}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500 bg-emerald-500"
                  style={{ width: `${barW}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
