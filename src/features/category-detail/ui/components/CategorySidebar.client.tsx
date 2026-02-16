// src/features/category-detail/ui/components/CategorySidebar.client.tsx
"use client";

import { Building, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Category } from "../../types";

interface CategorySidebarProps {
  category: Category;
  totalItems: number;
  sortBy: string;
  sortOrder: string;
  onSubcategoryClick: (subcategoryId: string, subcategoryName: string) => void;
  onSortChange: (sortBy: string, sortOrder: string) => void;
}

export default function CategorySidebar({
  category,
  totalItems,
  sortBy,
  sortOrder,
  onSubcategoryClick,
  onSortChange,
}: CategorySidebarProps) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6"
      style={{
        position: "sticky",
        top: "6rem",
        maxHeight: "calc(100vh - 8rem)",
        overflowY: "auto",
      }}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <button
            onClick={() => {
              const p = new URLSearchParams();
              p.set("type", category.name);
              router.push(`/ads?${p.toString()}`);
            }}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1 border border-blue-200"
          >
            <Search className="w-3 h-3" />
            Tümü
          </button>
        </div>
        <p className="text-sm text-gray-600">{totalItems} ilan bulundu</p>
      </div>

      {category.subcategories.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Alt Kategoriler</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {category.subcategories.length}
            </span>
          </div>

          <div className="space-y-2">
            {category.subcategories.map((subcat) => (
              <button
                key={subcat._id}
                onClick={() => onSubcategoryClick(subcat._id, subcat.name)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Building className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-blue-700">
                    {subcat.name}
                  </span>
                </div>
                <div className="flex items-center">
                  {subcat.subcategories && subcat.subcategories.length > 0 && (
                    <span className="text-xs text-gray-500 mr-2">
                      {subcat.subcategories.length} alt
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ArrowUpDown className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Sırala</h3>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onSortChange("date", "asc")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                sortBy === "date" && sortOrder === "asc"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Eski ilanlar önce</span>
              {sortBy === "date" && sortOrder === "asc" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSortChange("date", "desc")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                sortBy === "date" && sortOrder === "desc"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Yeni ilanlar önce</span>
              {sortBy === "date" && sortOrder === "desc" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => onSortChange("price", "asc")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                sortBy === "price" && sortOrder === "asc"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Ucuzdan pahalıya</span>
              {sortBy === "price" && sortOrder === "asc" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onSortChange("price", "desc")}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center justify-between ${
                sortBy === "price" && sortOrder === "desc"
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>Pahalıdan ucuza</span>
              {sortBy === "price" && sortOrder === "desc" && (
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
