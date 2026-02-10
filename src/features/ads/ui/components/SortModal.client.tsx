// src/features/ads/ui/components/SortModal.tsx
"use client";

import { Check, X } from "lucide-react";
import type { FilterState } from "@/types/advert";

export default function SortModal({
  open,
  filters,
  currentPage,
  featureFilters,
  onClose,
  onApply,
}: {
  open: boolean;
  filters: FilterState;
  currentPage: number;
  featureFilters: Record<string, any>;
  onClose: () => void;
  onApply: (next: { sortBy: "date" | "price"; sortOrder: "asc" | "desc" }) => void;
}) {
  if (!open) return null;

  const options = [
    { id: "date_desc", label: "Yeni ilanlar önce", sortBy: "date", sortOrder: "desc" },
    { id: "date_asc", label: "Eski ilanlar önce", sortBy: "date", sortOrder: "asc" },
    { id: "price_asc", label: "Ucuzdan pahalıya", sortBy: "price", sortOrder: "asc" },
    { id: "price_desc", label: "Pahalıdan ucuza", sortBy: "price", sortOrder: "desc" },
  ] as const;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 p-6 max-h-[80vh] overflow-y-auto md:hidden animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Sıralama</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((opt) => {
            const isSelected = filters.sortBy === opt.sortBy && filters.sortOrder === opt.sortOrder;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onApply({ sortBy: opt.sortBy, sortOrder: opt.sortOrder });
                  onClose();
                }}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  isSelected
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opt.label}</span>
                  {isSelected && <Check size={20} className="text-blue-600" />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
