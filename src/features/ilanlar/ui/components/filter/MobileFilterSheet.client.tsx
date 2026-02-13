// src/features/ads/ui/components/filter-sidebar/MobileFilterSheet.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  Building,
  Navigation,
  DollarSign,
  Tag,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  Square,
  X,
} from "lucide-react";

import type { Category, Feature, FilterState, Subcategory } from "@/types/advert";
import FeatureInput from "./FeatureInput.client";
import {
  findAreaFeature,
  getAreaDisplayValue,
  getCategoryDisplayName,
  getFeatureDisplayValue,
  getLocationDisplayValue,
  getPriceDisplayValue,
  hasAreaFeature,
} from "./display";
import type { CityData } from "./types";

type Props = {
  showMobileTopBar?: boolean;

  totalItems: number;

  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

  onOpenSortMenu?: () => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  categories: Category[];
  loadingCategories?: boolean;

  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory?: Subcategory | null;

  availableSubcategories: Subcategory[];
  availableSubSubcategories?: Subcategory[];

  onCategorySelect: (category: Category | null) => void;
  onSubcategorySelect: (subcategory: Subcategory | null) => void;
  onSubSubcategorySelect?: (subsub: Subcategory | null) => void;

  currentFeatures: Feature[];

  featureFilters: Record<string, any>;
  onFeatureChange: (featureId: string, value: any) => void;

  citiesData: CityData[];

  onApply: () => Promise<void>;
  onClear: () => Promise<void>;
};

export default function MobileFilterSheet({
  showMobileTopBar = true,

  totalItems,

  isOpen,
  onOpen,
  onClose,

  onOpenSortMenu,

  filters,
  setFilters,

  categories,

  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,

  availableSubcategories,
  availableSubSubcategories = [],

  onCategorySelect,
  onSubcategorySelect,
  onSubSubcategorySelect,

  currentFeatures,

  featureFilters,
  onFeatureChange,

  citiesData,

  onApply,
  onClear,
}: Props) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const areaFeature = useMemo(() => findAreaFeature(currentFeatures), [currentFeatures]);
  const showAreaCard = useMemo(() => hasAreaFeature(currentFeatures), [currentFeatures]);

  const openSection = (key: string) => setActiveSection(key);
  const closeSection = () => setActiveSection(null);

  const handleApply = async () => {
    await onApply();
    setActiveSection(null);
  };

  const featureListForCards = useMemo(() => {
    const lower = (s: string) => s.toLowerCase();
    return currentFeatures.filter(
      (f) =>
        !lower(f.name).includes("metre") &&
        !lower(f.name).includes("alan") &&
        !lower(f.name).includes("m²"),
    );
  }, [currentFeatures]);

  return (
    <>
      {showMobileTopBar && (
        <div className="md:hidden fixed top-24 left-0 right-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={onOpen}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex-1 mr-2 justify-center"
            >
              <Filter size={18} />
              <span className="font-medium">Filtrele</span>
              {totalItems > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSortMenu}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex-1 ml-2 justify-center"
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium">Sırala</span>
            </button>
          </div>
        </div>
      )}

      {!isOpen ? null : (
        <>
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

          <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-50">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft size={24} />
                <span className="font-medium">Geri Dön</span>
              </button>

              <h3 className="text-lg font-semibold text-gray-900">Filtrele</h3>

              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {activeSection ? (
              <>
                {activeSection === "category" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">Kategori Seç</h3>
                    </div>

                    <div className="p-4 space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Ana Kategoriler</h4>

                        <button
                          onClick={() => {
                            onCategorySelect(null);
                            closeSection();
                          }}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            !selectedCategory
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          Tüm Kategoriler
                        </button>

                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => {
                              onCategorySelect(cat);
                              // kategoriyi seçince aynı ekranda alt kategori alanı da görünsün, kapatmayalım
                            }}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                              selectedCategory?._id === cat._id
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      {selectedCategory && availableSubcategories.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 mb-3">Alt Kategoriler</h4>

                          <button
                            onClick={() => {
                              onSubcategorySelect(null);
                            }}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                              !selectedSubcategory
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            Tümü
                          </button>

                          {availableSubcategories.map((sub) => (
                            <button
                              key={sub._id}
                              onClick={() => {
                                onSubcategorySelect(sub);
                              }}
                              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                selectedSubcategory?._id === sub._id
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedSubcategory &&
                        availableSubSubcategories.length > 0 &&
                        onSubSubcategorySelect && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900 mb-3">Alt Alt Kategoriler</h4>

                            <button
                              onClick={() => onSubSubcategorySelect(null)}
                              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                !selectedSubSubcategory
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              Tümü
                            </button>

                            {availableSubSubcategories.map((subsub) => (
                              <button
                                key={subsub._id}
                                onClick={() => onSubSubcategorySelect(subsub)}
                                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                  selectedSubSubcategory?._id === subsub._id
                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                }`}
                              >
                                {subsub.name}
                              </button>
                            ))}
                          </div>
                        )}

                      <button
                        onClick={closeSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}

                {activeSection === "location" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">Konum Seç</h3>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">İl</label>
                        <select
                          value={filters.location}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              location: e.target.value,
                              district: "Hepsi",
                              quarter: "Hepsi",
                            } as any);
                          }}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Hepsi">Tüm İller</option>
                          {citiesData.map((city) => (
                            <option key={city.province} value={city.province}>
                              {city.province}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">İlçe</label>
                        <select
                          value={filters.district}
                          onChange={(e) => {
                            setFilters({
                              ...filters,
                              district: e.target.value,
                              quarter: "Hepsi",
                            } as any);
                          }}
                          disabled={filters.location === "Hepsi"}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="Hepsi">
                            {filters.location === "Hepsi" ? "Önce il seçiniz" : "Tüm İlçeler"}
                          </option>

                          {citiesData
                            .find((c) => c.province === filters.location)
                            ?.districts.map((d) => (
                              <option key={d.district} value={d.district}>
                                {d.district}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        onClick={closeSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}

                {activeSection === "price" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">Fiyat Aralığı</h3>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Min. TL</label>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ""}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minPrice: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Max. TL</label>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ""}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                maxPrice: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                          />
                        </div>
                      </div>

                      <button
                        onClick={closeSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}

                {activeSection.startsWith("feature-") && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentFeatures.find((f) => f._id === activeSection.replace("feature-", ""))?.name ||
                          "Özellik"}
                      </h3>
                    </div>

                    <div className="p-4">
                      {(() => {
                        const featureId = activeSection.replace("feature-", "");
                        const feature = currentFeatures.find((f) => f._id === featureId);

                        if (!feature) return <p className="text-gray-600 mb-4">Özellik bulunamadı.</p>;

                        return (
                          <FeatureInput
                            feature={feature}
                            value={featureFilters[feature._id]}
                            onChange={(value) => onFeatureChange(feature._id, value)}
                          />
                        );
                      })()}

                      <button
                        onClick={closeSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="p-4 space-y-3">
                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openSection("category")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Kategori</h4>
                          <p className="text-sm text-gray-600">
                            {getCategoryDisplayName({
                              selectedCategory,
                              selectedSubcategory,
                              selectedSubSubcategory: selectedSubSubcategory ?? null,
                            })}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openSection("location")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Navigation size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Konum</h4>
                          <p className="text-sm text-gray-600">{getLocationDisplayValue(filters)}</p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openSection("price")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <DollarSign size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Fiyat</h4>
                          <p className="text-sm text-gray-600">{getPriceDisplayValue(filters)}</p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  {showAreaCard && areaFeature && (
                    <div
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openSection(`feature-${areaFeature._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Square size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Metrekare</h4>
                            <p className="text-sm text-gray-600">
                              {getAreaDisplayValue({ currentFeatures, featureFilters })}
                            </p>
                          </div>
                        </div>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                    </div>
                  )}

                  {featureListForCards.map((feature) => (
                    <div
                      key={feature._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openSection(`feature-${feature._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <Tag size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{feature.name}</h4>
                            <p className="text-sm text-gray-600">
                              {getFeatureDisplayValue({ feature, featureFilters })}
                            </p>
                          </div>
                        </div>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button
                    onClick={onClear}
                    className="w-full mb-3 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>

                  <button
                    onClick={handleApply}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sonuçları Göster ({totalItems})
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
