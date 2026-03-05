// src/features/ilanlar/ui/components/filter/MobileFiltersPanel.client.tsx
"use client";

import React from "react";
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
import type { CityData, FeatureFilterValue, FeatureFiltersMap } from "./types";
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

interface MobileFiltersPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;

  categories: Category[];

  availableSubcategories: Subcategory[];
  availableSubSubcategories: Subcategory[];

  featureFilters: FeatureFiltersMap;

  totalItems: number;

  showMobileTopBar: boolean;
  isMobileSidebarOpen: boolean;
  onCloseMobileSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  onOpenSortMenu?: () => void;

  citiesData: CityData[];

  currentFeatures: Feature[];
  onCategorySelect: (category: Category | null) => void;
  onSubcategorySelect: (subcategory: Subcategory | null) => void;
  onSubSubcategorySelect: (subsub: Subcategory | null) => void;
  onFeatureFilterChange: (featureId: string, value: FeatureFilterValue) => void;

  handleFilter: () => Promise<void>;
  clearFilters: () => Promise<void>;

  showUrlDebug: boolean;
  urlParams?: Record<string, string>;
}

const MobileFiltersPanel: React.FC<MobileFiltersPanelProps> = ({
  filters,
  setFilters,

  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,

  categories,

  availableSubcategories,
  availableSubSubcategories,

  featureFilters,

  totalItems,

  showMobileTopBar,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  onOpenMobileSidebar,
  onOpenSortMenu,

  citiesData,

  currentFeatures,
  onCategorySelect,
  onSubcategorySelect,
  onSubSubcategorySelect,
  onFeatureFilterChange,

  handleFilter,
  clearFilters,

  showUrlDebug,
  urlParams,
}) => {
  const [mobileActiveSection, setMobileActiveSection] = React.useState<string | null>(null);

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

  const areaFeature = React.useMemo(() => findAreaFeature(currentFeatures), [currentFeatures]);
  const showAreaCard = React.useMemo(() => hasAreaFeature(currentFeatures), [currentFeatures]);

  return (
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
                  <MobileCategorySection
                    categories={categories}
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    selectedSubSubcategory={selectedSubSubcategory}
                    availableSubcategories={availableSubcategories}
                    availableSubSubcategories={availableSubSubcategories}
                    onCategorySelect={(cat) => { onCategorySelect(cat); closeMobileSection(); }}
                    onSubcategorySelect={(sub) => { onSubcategorySelect(sub); closeMobileSection(); }}
                    onSubSubcategorySelect={(subsub) => { onSubSubcategorySelect(subsub); closeMobileSection(); }}
                    onBack={closeMobileSection}
                  />
                )}

                {mobileActiveSection === "location" && (
                  <MobileLocationSection
                    filters={filters}
                    setFilters={setFilters}
                    citiesData={citiesData}
                    onDone={closeMobileSection}
                  />
                )}

                {mobileActiveSection === "price" && (
                  <MobilePriceSection
                    filters={filters}
                    setFilters={setFilters}
                    onDone={closeMobileSection}
                  />
                )}

                {mobileActiveSection.startsWith("feature-") && (
                  <MobileFeatureSection
                    mobileActiveSection={mobileActiveSection}
                    currentFeatures={currentFeatures}
                    featureFilters={featureFilters}
                    onFeatureFilterChange={onFeatureFilterChange}
                    onDone={closeMobileSection}
                  />
                )}
              </>
            ) : (
              <>
                <div className="p-4 space-y-3">
                  <MobileMenuCard
                    icon={<Building size={20} className="text-blue-600" />}
                    iconBg="bg-blue-100"
                    title="Kategori"
                    subtitle={getCategoryDisplayName({ selectedCategory, selectedSubcategory, selectedSubSubcategory })}
                    onClick={() => openMobileSection("category")}
                  />

                  <MobileMenuCard
                    icon={<Navigation size={20} className="text-green-600" />}
                    iconBg="bg-green-100"
                    title="Konum"
                    subtitle={getLocationDisplayValue(filters)}
                    onClick={() => openMobileSection("location")}
                  />

                  <MobileMenuCard
                    icon={<DollarSign size={20} className="text-yellow-600" />}
                    iconBg="bg-yellow-100"
                    title="Fiyat"
                    subtitle={getPriceDisplayValue(filters)}
                    onClick={() => openMobileSection("price")}
                  />

                  {showAreaCard && areaFeature && (
                    <MobileMenuCard
                      icon={<Square size={20} className="text-purple-600" />}
                      iconBg="bg-purple-100"
                      title="Metrekare"
                      subtitle={getAreaDisplayValue({ currentFeatures, featureFilters })}
                      onClick={() => openMobileSection(`feature-${areaFeature._id}`)}
                    />
                  )}

                  {currentFeatures
                    .filter((f) => {
                      const n = String(f.name || "").toLowerCase();
                      return !n.includes("metre") && !n.includes("alan") && !n.includes("m²");
                    })
                    .map((feature) => (
                      <MobileMenuCard
                        key={feature._id}
                        icon={<Tag size={20} className="text-gray-600" />}
                        iconBg="bg-gray-100"
                        title={feature.name}
                        subtitle={getFeatureDisplayValue({ feature, featureFilters })}
                        onClick={() => openMobileSection(`feature-${feature._id}`)}
                      />
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
};

export default MobileFiltersPanel;

/* ─── Small sub-components ─── */

interface MobileMenuCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

function MobileMenuCard({ icon, iconBg, title, subtitle, onClick }: MobileMenuCardProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <ChevronDown size={20} className="text-gray-400" />
      </div>
    </div>
  );
}

/* ─── Mobile section sub-components ─── */

interface MobileCategorySectionProps {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;
  availableSubcategories: Subcategory[];
  availableSubSubcategories: Subcategory[];
  onCategorySelect: (cat: Category | null) => void;
  onSubcategorySelect: (sub: Subcategory) => void;
  onSubSubcategorySelect: (subsub: Subcategory) => void;
  onBack: () => void;
}

function MobileCategorySection({
  categories,
  selectedCategory,
  selectedSubcategory,
  selectedSubSubcategory,
  availableSubcategories,
  availableSubSubcategories,
  onCategorySelect,
  onSubcategorySelect,
  onSubSubcategorySelect,
  onBack,
}: MobileCategorySectionProps) {
  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800" type="button">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">Kategori Seç</h3>
      </div>

      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 mb-3">Ana Kategoriler</h4>

          <button
            onClick={() => onCategorySelect(null)}
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
              onClick={() => onCategorySelect(category)}
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
                onClick={() => onSubcategorySelect(subcategory)}
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
                onClick={() => onSubSubcategorySelect(subsub)}
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
  );
}

interface MobileLocationSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  citiesData: CityData[];
  onDone: () => void;
}

function MobileLocationSection({ filters, setFilters, citiesData, onDone }: MobileLocationSectionProps) {
  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
        <button onClick={onDone} className="flex items-center gap-2 text-blue-600 hover:text-blue-800" type="button">
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
          onClick={onDone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
          type="button"
        >
          Tamam
        </button>
      </div>
    </>
  );
}

interface MobilePriceSectionProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onDone: () => void;
}

function MobilePriceSection({ filters, setFilters, onDone }: MobilePriceSectionProps) {
  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
        <button onClick={onDone} className="flex items-center gap-2 text-blue-600 hover:text-blue-800" type="button">
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
          onClick={onDone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
          type="button"
        >
          Tamam
        </button>
      </div>
    </>
  );
}

interface MobileFeatureSectionProps {
  mobileActiveSection: string;
  currentFeatures: Feature[];
  featureFilters: FeatureFiltersMap;
  onFeatureFilterChange: (featureId: string, value: FeatureFilterValue) => void;
  onDone: () => void;
}

function MobileFeatureSection({
  mobileActiveSection,
  currentFeatures,
  featureFilters,
  onFeatureFilterChange,
  onDone,
}: MobileFeatureSectionProps) {
  const featureId = mobileActiveSection.replace("feature-", "");
  const feature = currentFeatures.find((f) => f._id === featureId);

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
        <button onClick={onDone} className="flex items-center gap-2 text-blue-600 hover:text-blue-800" type="button">
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">{feature?.name || "Özellik"}</h3>
      </div>

      <div className="p-4">
        {!feature ? (
          <p className="text-gray-600 mb-4">Özellik bulunamadı.</p>
        ) : (
          <FeatureInput
            feature={feature}
            value={featureFilters[feature._id]}
            onChange={(value) => onFeatureFilterChange(feature._id, value)}
          />
        )}

        <button
          onClick={onDone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
          type="button"
        >
          Tamam
        </button>
      </div>
    </>
  );
}
