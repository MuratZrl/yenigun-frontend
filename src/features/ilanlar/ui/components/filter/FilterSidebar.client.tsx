// src/features/ads/ui/components/filter/FilterSidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Building,
  Navigation,
  DollarSign,
  Tag,
  ChevronDown,
  X,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  Square,
} from "lucide-react";

import type { FilterState, Category, Subcategory, Feature } from "@/types/advert";
import type { CategoryHandlerDeps, FeatureFilterValue, FeatureFiltersMap } from "./types";
import DesktopFiltersPanel from "./DesktopFiltersPanel.client";
import FeatureInput from "./FeatureInput.client";

import {
  getCategoryDisplayName,
  getLocationDisplayValue,
  getPriceDisplayValue,
  getAreaDisplayValue,
  hasAreaFeature,
  findAreaFeature,
  getFeatureDisplayValue,
} from "./display";

import { buildMissingFeatureDefaults } from "./featureInit";
import {
  handleCategorySelect as handleCategorySelectCore,
  handleSubcategorySelect as handleSubcategorySelectCore,
  handleSubSubcategorySelect as handleSubSubcategorySelectCore,
} from "./categoryHandlers";

interface CityData {
  province: string;
  districts: Array<{ district: string; quarters: string[] }>;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;

  selectedSubcategory: Subcategory | null;
  setSelectedSubcategory: React.Dispatch<React.SetStateAction<Subcategory | null>>;

  selectedSubSubcategory: Subcategory | null;
  setSelectedSubSubcategory: React.Dispatch<React.SetStateAction<Subcategory | null>>;

  categories: Category[];
  loadingCategories: boolean;

  availableSubcategories: Subcategory[];
  setAvailableSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;

  availableSubSubcategories: Subcategory[];
  setAvailableSubSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;

  featureFilters: FeatureFiltersMap;
  setFeatureFilters: React.Dispatch<React.SetStateAction<FeatureFiltersMap>>;

  handleFilter: () => Promise<void>;
  clearFilters: () => Promise<void>;

  totalItems: number;

  showUrlDebug?: boolean;
  urlParams?: Record<string, string>;

  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;

  citiesData?: CityData[];
  showMobileTopBar?: boolean;

  onOpenMobileSidebar?: () => void;
  onOpenSortMenu?: () => void;

  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  handleSortChangeDesktop?: (sortBy: "date" | "price", sortOrder: "asc" | "desc") => Promise<void>;

  contextFeatures?: Feature[];

  // ✅ Dinamik filtreleme (controller'dan gelir)
  autoApply: boolean;
  setAutoApply: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,

  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSubSubcategory,
  setSelectedSubSubcategory,

  categories,
  loadingCategories,

  availableSubcategories,
  setAvailableSubcategories,
  availableSubSubcategories,
  setAvailableSubSubcategories,

  featureFilters,
  setFeatureFilters,

  handleFilter,
  clearFilters,

  totalItems,

  showUrlDebug = false,
  urlParams,

  isMobileSidebarOpen = false,
  onCloseMobileSidebar,

  citiesData = [],
  showMobileTopBar = true,

  onOpenMobileSidebar,
  onOpenSortMenu,

  handleSortChangeDesktop,
  setCurrentPage,

  contextFeatures = [],

  autoApply,
  setAutoApply,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    location: true,
    category: true,
    price: true,
    features: true,
  });

  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  /* Derive currentFeatures from the deepest selected category that has features. */
  const currentFeatures = useMemo<Feature[]>(() => {
    if (contextFeatures.length > 0) return contextFeatures;
    if (selectedSubSubcategory?.features?.length) return selectedSubSubcategory.features;
    if (selectedSubcategory?.features?.length) return selectedSubcategory.features;
    if (selectedCategory?.features?.length) return selectedCategory.features;
    return [];
  }, [contextFeatures, selectedSubSubcategory, selectedSubcategory, selectedCategory]);

  /* categoryHandlers calls setCurrentFeatures, but the value is now derived
     from the selected category/subcategory. Provide a no-op to satisfy the deps type. */
  const setCurrentFeatures = useCallback<React.Dispatch<React.SetStateAction<Feature[]>>>(
    () => { /* no-op: currentFeatures is derived via useMemo */ },
    [],
  );

  /* Sync missing feature filter defaults when currentFeatures change.
     We use a stable key to avoid re-running the effect when featureFilters
     change for unrelated reasons. */
  const featureIdsKey = currentFeatures.map((f) => f._id).join(",");

  useEffect(() => {
    if (!currentFeatures.length) return;
    const missing = buildMissingFeatureDefaults({ currentFeatures, featureFilters });
    if (Object.keys(missing).length === 0) return;
    setFeatureFilters((prev) => ({ ...prev, ...missing }));
  }, [featureIdsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const deps = useMemo<CategoryHandlerDeps>(
    () => ({
      filters,
      selectedCategory,
      selectedSubcategory,
      categories,

      setFilters: setFilters as CategoryHandlerDeps["setFilters"],
      setSelectedCategory,
      setSelectedSubcategory,
      setSelectedSubSubcategory,

      setAvailableSubcategories,
      setAvailableSubSubcategories,

      setFeatureFilters,
      setCurrentFeatures,
    }),
    [
      filters,
      selectedCategory,
      selectedSubcategory,
      categories,
      setFilters,
      setSelectedCategory,
      setSelectedSubcategory,
      setSelectedSubSubcategory,
      setAvailableSubcategories,
      setAvailableSubSubcategories,
      setFeatureFilters,
      setCurrentFeatures,
    ],
  );

  const onCategorySelect = (category: Category | null) => handleCategorySelectCore(category, deps);

  const onSubcategorySelect = (subcategory: Subcategory | null) => handleSubcategorySelectCore(subcategory, deps);

  const onSubSubcategorySelect = (subsub: Subcategory | null) =>
    handleSubSubcategorySelectCore(subsub, deps);

  const handleFeatureFilterChange = (featureId: string, value: FeatureFilterValue) => {
    setFeatureFilters((prev) => ({ ...prev, [featureId]: value }));
  };

  const openMobileSection = (section: string) => setMobileActiveSection(section);
  const closeMobileSection = () => setMobileActiveSection(null);

  const handleFilterClick = async () => {
    await handleFilter();
    onCloseMobileSidebar?.();
    setMobileActiveSection(null);
  };

  const handleClearClick = async () => {
    await clearFilters();
    onCloseMobileSidebar?.();
    setMobileActiveSection(null);
  };

  const areaFeature = useMemo(() => findAreaFeature(currentFeatures), [currentFeatures]);
  const showAreaCard = useMemo(() => hasAreaFeature(currentFeatures), [currentFeatures]);

  const renderMobile = () => (
    <>
      {showMobileTopBar && (
        <div className="md:hidden fixed top-24 left-0 right-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={onOpenMobileSidebar}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex-1 mr-2 justify-center"
              type="button"
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
              type="button"
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium">Sırala</span>
            </button>
          </div>
        </div>
      )}

      {isMobileSidebarOpen ? (
        <>
          <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onCloseMobileSidebar} />

          <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-50">
              <button
                onClick={onCloseMobileSidebar}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                type="button"
              >
                <ChevronLeft size={24} />
                <span className="font-medium">Geri Dön</span>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Filtrele</h3>
              <button
                onClick={onCloseMobileSidebar}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
                aria-label="Kapat"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {mobileActiveSection ? (
              <>
                {mobileActiveSection === "category" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeMobileSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">Kategori Seç</h3>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">Ana Kategoriler</h4>

                        <button
                          onClick={() => {
                            onCategorySelect(null);
                            closeMobileSection();
                          }}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            !selectedCategory
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          }`}
                          type="button"
                        >
                          Tüm Kategoriler
                        </button>

                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => {
                              onCategorySelect(category);
                              closeMobileSection();
                            }}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                              selectedCategory?._id === category._id
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                            type="button"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>

                      {selectedCategory && availableSubcategories.length > 0 && (
                        <div className="space-y-2 mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Alt Kategoriler</h4>

                          {availableSubcategories.map((subcategory) => (
                            <button
                              key={subcategory._id}
                              onClick={() => {
                                onSubcategorySelect(subcategory);
                                closeMobileSection();
                              }}
                              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                selectedSubcategory?._id === subcategory._id
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                              type="button"
                            >
                              {subcategory.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedSubcategory && availableSubSubcategories.length > 0 && (
                        <div className="space-y-2 mt-6">
                          <h4 className="font-medium text-gray-900 mb-3">Alt Alt Kategoriler</h4>

                          {availableSubSubcategories.map((subsub) => (
                            <button
                              key={subsub._id}
                              onClick={() => {
                                onSubSubcategorySelect(subsub);
                                closeMobileSection();
                              }}
                              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                selectedSubSubcategory?._id === subsub._id
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                              type="button"
                            >
                              {subsub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {mobileActiveSection === "location" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeMobileSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        type="button"
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
                            });
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
                            });
                          }}
                          disabled={filters.location === "Hepsi"}
                          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                        >
                          <option value="Hepsi">
                            {filters.location === "Hepsi" ? "Önce il seçiniz" : "Tüm İlçeler"}
                          </option>

                          {citiesData
                            .find((city) => city.province === filters.location)
                            ?.districts.map((district) => (
                              <option key={district.district} value={district.district}>
                                {district.district}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        onClick={closeMobileSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                        type="button"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}

                {mobileActiveSection === "price" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeMobileSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        type="button"
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
                        onClick={closeMobileSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                        type="button"
                      >
                        Tamam
                      </button>
                    </div>
                  </>
                )}

                {mobileActiveSection.startsWith("feature-") && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeMobileSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        type="button"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentFeatures.find((f) => f._id === mobileActiveSection.replace("feature-", ""))?.name ||
                          "Özellik"}
                      </h3>
                    </div>

                    <div className="p-4">
                      {(() => {
                        const featureId = mobileActiveSection.replace("feature-", "");
                        const feature = currentFeatures.find((f) => f._id === featureId);

                        if (!feature) return <p className="text-gray-600 mb-4">Özellik bulunamadı.</p>;

                        return (
                          <FeatureInput
                            feature={feature}
                            value={featureFilters[feature._id]}
                            onChange={(value) => handleFeatureFilterChange(feature._id, value)}
                          />
                        );
                      })()}

                      <button
                        onClick={closeMobileSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
                        type="button"
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
                    onClick={() => openMobileSection("category")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Kategori</h4>
                          <p className="text-sm text-gray-600">
                            {getCategoryDisplayName({ selectedCategory, selectedSubcategory, selectedSubSubcategory })}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openMobileSection("location")}
                    role="button"
                    tabIndex={0}
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
                    onClick={() => openMobileSection("price")}
                    role="button"
                    tabIndex={0}
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
                      onClick={() => openMobileSection(`feature-${areaFeature._id}`)}
                      role="button"
                      tabIndex={0}
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

                  {currentFeatures.length > 0 &&
                    currentFeatures
                      .filter((f) => {
                        const n = String(f.name || "").toLowerCase();
                        return !n.includes("metre") && !n.includes("alan") && !n.includes("m²");
                      })
                      .map((feature) => (
                        <div
                          key={feature._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => openMobileSection(`feature-${feature._id}`)}
                          role="button"
                          tabIndex={0}
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

                  {showUrlDebug && (
                    <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Debug</div>
                      <pre className="text-[11px] text-gray-700 whitespace-pre-wrap break-words">
                        {JSON.stringify({ urlParams, filters }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                  <button
                    onClick={handleClearClick}
                    className="w-full mb-3 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    type="button"
                  >
                    Filtreleri Temizle
                  </button>

                  <button
                    onClick={handleFilterClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
                    type="button"
                  >
                    Sonuçları Göster ({totalItems})
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  );

  const renderDesktop = () => (
    <div className="hidden md:block">
      <DesktopFiltersPanel
        filters={filters}
        setFilters={setFilters}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        categories={categories}
        loadingCategories={loadingCategories}
        availableSubcategories={availableSubcategories}
        availableSubSubcategories={availableSubSubcategories}
        citiesData={citiesData}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        totalItems={totalItems}
        handleFilter={handleFilter}
        clearFilters={clearFilters}
        handleSortChangeDesktop={handleSortChangeDesktop}
        setCurrentPage={setCurrentPage}
        onCategorySelect={onCategorySelect}
        onSubcategorySelect={onSubcategorySelect}
        onSubSubcategorySelect={onSubSubcategorySelect}
        autoApply={autoApply}
        setAutoApply={setAutoApply}
      />
    </div>
  );

  return (
    <>
      {renderMobile()}
      {renderDesktop()}
    </>
  );
};

export default FilterSidebar;
