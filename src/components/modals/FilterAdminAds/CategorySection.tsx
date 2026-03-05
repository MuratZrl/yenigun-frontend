// src/components/modals/FilterAdminAds/CategorySection.tsx
"use client";

import React from "react";
import {
  Tag,
  Trash2,
  Building,
  Home,
  Check,
  Layers,
} from "lucide-react";

import type {
  CategoryNode,
  SubcategoryNode,
  Feature,
  FeatureFilterValue,
} from "./types";
import FeatureInput from "./FeatureInput";

type Props = {
  categories: CategoryNode[];
  loadingCategories: boolean;

  selectedCategory: CategoryNode | null;
  selectedSubcategory: SubcategoryNode | null;
  selectedSubSubcategory: SubcategoryNode | null;

  availableSubcategories: SubcategoryNode[];
  availableSubSubcategories: SubcategoryNode[];

  currentFeatures: Feature[];
  featureFilters: Record<string, FeatureFilterValue>;

  categoryPath: string | null | undefined;

  onSelectCategory: (cat: CategoryNode | null) => void;
  onSelectSubcategory: (sub: SubcategoryNode | null) => void;
  onSelectSubSubcategory: (subsub: SubcategoryNode | null) => void;
  onFeatureFilterChange: (featureId: string, value: FeatureFilterValue) => void;
  onClearCategory: () => void;
};

const selectedBtn =
  "bg-blue-100 border-blue-300 text-blue-700";
const unselectedBtn =
  "bg-gray-50 border-gray-200 hover:bg-gray-100";

export default function CategorySection({
  categories,
  loadingCategories,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  availableSubcategories,
  availableSubSubcategories,
  currentFeatures,
  featureFilters,
  categoryPath,
  onSelectCategory,
  onSelectSubcategory,
  onSelectSubSubcategory,
  onFeatureFilterChange,
  onClearCategory,
}: Props) {
  const hasSelection =
    !!selectedCategory || !!selectedSubcategory || !!selectedSubSubcategory;

  if (loadingCategories) {
    return (
      <div className="md:col-span-2 space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          <Building className="inline mr-2" size={16} />
          Kategori Filtreleme
        </label>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500" />
          <span className="ml-3 text-gray-600">Kategoriler yukleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        <Building className="inline mr-2" size={16} />
        Kategori Filtreleme
      </label>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        {/* Selected category path */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Tag size={16} className="text-blue-600" />
            <span className="font-medium text-blue-800">
              Secilen Kategori:
            </span>
            <div className="flex-1">
              <span className="text-blue-700">
                {categoryPath || "Tum Kategoriler"}
              </span>
            </div>

            {hasSelection && (
              <button
                type="button"
                onClick={onClearCategory}
                className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 size={12} />
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Three-column category tree */}
        <div className="grid grid-cols-3 gap-4">
          {/* Ana Kategoriler */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
              Ana Kategori
            </h4>

            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                !selectedCategory ? selectedBtn : unselectedBtn
              }`}
            >
              <div className="flex items-center gap-2">
                <Home size={16} />
                <span className="font-medium">Tumu</span>
              </div>
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedCategory?._id === cat._id
                    ? selectedBtn
                    : unselectedBtn
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  {selectedCategory?._id === cat._id && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Alt Kategoriler */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
              Alt Kategori
            </h4>
            {selectedCategory ? (
              <>
                <button
                  type="button"
                  onClick={() => onSelectSubcategory(null)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    !selectedSubcategory ? selectedBtn : unselectedBtn
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={16} />
                    <span className="font-medium">Tumu</span>
                  </div>
                </button>

                {availableSubcategories.map((sub) => (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => onSelectSubcategory(sub)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSubcategory?._id === sub._id
                        ? selectedBtn
                        : unselectedBtn
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{sub.name}</span>
                      {selectedSubcategory?._id === sub._id && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                Once ana kategori secin
              </div>
            )}
          </div>

          {/* Detay */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 pb-2 border-b">
              Detay
            </h4>
            {selectedSubcategory ? (
              <>
                <button
                  type="button"
                  onClick={() => onSelectSubSubcategory(null)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    !selectedSubSubcategory ? selectedBtn : unselectedBtn
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={16} />
                    <span className="font-medium">Tumu</span>
                  </div>
                </button>

                {availableSubSubcategories.map((subsub) => (
                  <button
                    key={subsub._id}
                    type="button"
                    onClick={() => onSelectSubSubcategory(subsub)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSubSubcategory?._id === subsub._id
                        ? selectedBtn
                        : unselectedBtn
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{subsub.name}</span>
                      {selectedSubSubcategory?._id === subsub._id && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                {selectedCategory
                  ? "Once alt kategori secin"
                  : "Once kategori secin"}
              </div>
            )}
          </div>
        </div>

        {/* Feature filters */}
        {currentFeatures.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Ozellik Filtreleri
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeatures.map((f) => (
                <div key={f._id} className="space-y-3">
                  <FeatureInput
                    feature={f}
                    value={featureFilters[f._id]}
                    onChange={(v) => onFeatureFilterChange(f._id, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
