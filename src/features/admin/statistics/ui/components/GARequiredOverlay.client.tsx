"use client";

import { Search } from "lucide-react";

/**
 * Placeholder card for sections that require Google Search Console integration.
 * No fake data — just a clean empty state with description.
 */
export default function GSCPlaceholder({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2.5 h-full min-h-[160px] ${className ?? ""}`}
    >
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
        <Search size={18} className="text-blue-400" />
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700">{title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 max-w-[220px] leading-relaxed">
          {description ?? "Google Search Console entegrasyonu yapıldığında bu veriler görüntülenecektir"}
        </p>
      </div>
    </div>
  );
}
