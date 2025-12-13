"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Navigation,
  DollarSign,
  Tag,
  ChevronDown,
  Loader,
  X,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  Square,
} from "lucide-react";
import {
  FilterState,
  Category,
  Subcategory,
  Feature,
} from "@/app/types/advert";

interface FeatureInputProps {
  feature: Feature;
  value: any;
  onChange: (value: any) => void;
}

export const FeatureInput: React.FC<FeatureInputProps> = ({
  feature,
  value,
  onChange,
}) => {
  switch (feature.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`feature-${feature._id}`}
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label
            htmlFor={`feature-${feature._id}`}
            className="text-sm text-gray-700"
          >
            {feature.name}
          </label>
        </div>
      );

    case "single_select":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {feature.options?.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );

    case "multi_select":
      const safeValue = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {feature.options?.map((option: string, index: number) => {
              const isSelected = safeValue.includes(option);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const newValue = isSelected
                      ? safeValue.filter((v: string) => v !== option)
                      : [...safeValue, option];
                    onChange(newValue);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="number"
            value={value || ""}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : null)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );

    case "range":
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                value={value?.min || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    min: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                value={value?.max || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    max: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {feature.name}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`${feature.name} girin`}
          />
        </div>
      );
  }
};

interface CityData {
  province: string;
  districts: Array<{
    district: string;
    quarters: string[];
  }>;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  selectedSubcategory: Subcategory | null;
  setSelectedSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | null>
  >;
  selectedSubSubcategory: Subcategory | null;
  setSelectedSubSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | null>
  >;
  categories: Category[];
  loadingCategories: boolean;
  availableSubcategories: Subcategory[];
  setAvailableSubcategories: React.Dispatch<
    React.SetStateAction<Subcategory[]>
  >;
  availableSubSubcategories: Subcategory[];
  setAvailableSubSubcategories: React.Dispatch<
    React.SetStateAction<Subcategory[]>
  >;
  featureFilters: Record<string, any>;
  setFeatureFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleFilter: () => Promise<void>;
  clearFilters: () => Promise<void>;
  totalItems: number;
  showUrlDebug?: boolean;
  urlParams?: Record<string, any>;
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
  citiesData?: CityData[];
  showMobileTopBar?: boolean;
  onOpenMobileSidebar?: () => void;
  onOpenSortMenu?: () => void;
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
  urlParams = {},
  isMobileSidebarOpen = false,
  onCloseMobileSidebar,
  citiesData = [],
  showMobileTopBar = true,
  onOpenMobileSidebar,
  onOpenSortMenu,
}) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    location: true,
    category: true,
    price: true,
    features: true,
  });

  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(
    null
  );

  const [currentFeatures, setCurrentFeatures] = useState<Feature[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const buildApiFilters = () => {
    const apiFilters: any = {};

    if (filters.location && filters.location !== "Hepsi") {
      apiFilters.city = filters.location;
      if (filters.district && filters.district !== "Hepsi") {
        apiFilters.district = filters.district;
      }
    }

    if (selectedCategory) {
      apiFilters.category = selectedCategory.name;

      if (selectedSubcategory) {
        apiFilters.type = selectedSubcategory.name;

        if (selectedSubSubcategory) {
          apiFilters.subcategory = selectedSubSubcategory.name;
        }
      }
    }
    if (filters.minPrice && filters.minPrice > 0) {
      apiFilters.minPrice = filters.minPrice;
    }
    if (filters.maxPrice && filters.maxPrice > 0) {
      apiFilters.maxPrice = filters.maxPrice;
    }

    if (currentFeatures.length > 0) {
      const featureFiltersArray = Object.entries(featureFilters)
        .filter(([_, value]) => {
          if (value === undefined || value === null) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          if (typeof value === "number" && value === 0) return false;
          if (Array.isArray(value) && value.length === 0) return false;
          if (typeof value === "object" && value !== null) {
            if (value.min === null && value.max === null) return false;
            if (value.min === 0 && value.max === 0) return false;
          }
          return true;
        })
        .map(([featureId, value]) => ({
          featureId,
          value,
        }));

      if (featureFiltersArray.length > 0) {
        apiFilters.featureFilters = featureFiltersArray;
      }
    }

    return apiFilters;
  };

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});
    setCurrentFeatures([]);

    if (category) {
      setAvailableSubcategories(category.subcategories || []);

      setFilters((prev: FilterState) => ({
        ...prev,
        type: category.name,
        category: category.name,
        subcategory: undefined,
        subsubcategory: undefined,
        action: "Tümü",
      }));

      if (category.name === "Konut" && category.subcategories?.length > 0) {
        setCurrentFeatures([]);
      } else if (category.features && category.features.length > 0) {
        setCurrentFeatures(category.features);
        const initialFilters: Record<string, any> = {};
        category.features.forEach((feature: Feature) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          } else if (feature.type === "boolean") {
            initialFilters[feature._id] = false;
          } else if (feature.type === "range") {
            initialFilters[feature._id] = { min: null, max: null };
          }
        });
        setFeatureFilters(initialFilters);
      } else {
        setCurrentFeatures([]);
      }
    } else {
      setAvailableSubcategories([]);
      setAvailableSubSubcategories([]);
      setFilters((prev: FilterState) => ({
        ...prev,
        type: "Hepsi",
        category: undefined,
        subcategory: undefined,
        subsubcategory: undefined,
        action: "Tümü",
      }));
    }
  };

  const handleSubcategorySelect = (subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
    setSelectedSubSubcategory(null);
    setFeatureFilters({});

    if (subcategory) {
      setAvailableSubSubcategories(subcategory.subcategories || []);

      const actionMap: Record<string, string> = {
        Satılık: "Satılık",
        Kiralık: "Kiralık",
        "Günlük Kiralık": "Günlük Kiralık",
        "Devren Satılık": "Devren Satılık",
      };

      const action = actionMap[subcategory.name] || "Tümü";

      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${subcategory.name}`
        : subcategory.name;

      setFilters((prev: FilterState) => ({
        ...prev,
        type: categoryPath,
        category: selectedCategory?.name,
        subcategory: subcategory.name,
        subsubcategory: undefined,
        action: action,
      }));

      if (
        subcategory.name === "Kiralık" &&
        subcategory.subcategories?.length > 0
      ) {
        setCurrentFeatures([]);
      } else if (subcategory.features && subcategory.features.length > 0) {
        setCurrentFeatures(subcategory.features);
        const initialFilters: Record<string, any> = {};
        subcategory.features.forEach((feature: Feature) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          } else if (feature.type === "boolean") {
            initialFilters[feature._id] = false;
          } else if (feature.type === "range") {
            initialFilters[feature._id] = { min: null, max: null };
          }
        });
        setFeatureFilters(initialFilters);
      } else {
        if (
          selectedCategory?.features &&
          selectedCategory.features.length > 0
        ) {
          setCurrentFeatures(selectedCategory.features);
        } else {
          setCurrentFeatures([]);
        }
      }
    } else {
      setAvailableSubSubcategories([]);
      if (selectedCategory) {
        setFilters((prev: FilterState) => ({
          ...prev,
          type: selectedCategory.name,
          category: selectedCategory.name,
          subcategory: undefined,
          subsubcategory: undefined,
          action: "Tümü",
        }));

        if (selectedCategory.features && selectedCategory.features.length > 0) {
          setCurrentFeatures(selectedCategory.features);
        } else {
          setCurrentFeatures([]);
        }
      }
    }
  };

  const handleSubSubcategorySelect = (subsubcategory: Subcategory | null) => {
    setSelectedSubSubcategory(subsubcategory);
    setFeatureFilters({});

    if (subsubcategory) {
      const categoryPath =
        selectedCategory && selectedSubcategory
          ? `${selectedCategory.name} > ${selectedSubcategory.name} > ${subsubcategory.name}`
          : subsubcategory.name;

      const action =
        selectedSubcategory?.name === "Kiralık"
          ? "Kiralık"
          : selectedSubcategory?.name === "Satılık"
          ? "Satılık"
          : "Tümü";

      setFilters((prev: FilterState) => ({
        ...prev,
        type: categoryPath,
        category: selectedCategory?.name,
        subcategory: selectedSubcategory?.name,
        subsubcategory: subsubcategory.name,
        action: action,
      }));

      if (subsubcategory.features && subsubcategory.features.length > 0) {
        setCurrentFeatures(subsubcategory.features);
        const initialFilters: Record<string, any> = {};
        subsubcategory.features.forEach((feature: Feature) => {
          if (feature.type === "multi_select") {
            initialFilters[feature._id] = [];
          } else if (feature.type === "boolean") {
            initialFilters[feature._id] = false;
          } else if (feature.type === "range") {
            initialFilters[feature._id] = { min: null, max: null };
          } else if (feature.type === "single_select") {
            initialFilters[feature._id] = "";
          } else if (feature.type === "number") {
            initialFilters[feature._id] = "";
          }
        });
        setFeatureFilters(initialFilters);
      } else {
        if (
          selectedSubcategory?.features &&
          selectedSubcategory.features.length > 0
        ) {
          setCurrentFeatures(selectedSubcategory.features);
        } else if (
          selectedCategory?.features &&
          selectedCategory.features.length > 0
        ) {
          setCurrentFeatures(selectedCategory.features);
        } else {
          setCurrentFeatures([]);
        }
      }
    } else if (selectedSubcategory) {
      const categoryPath = selectedCategory
        ? `${selectedCategory.name} > ${selectedSubcategory.name}`
        : selectedSubcategory.name;

      setFilters((prev: FilterState) => ({
        ...prev,
        type: categoryPath,
        category: selectedCategory?.name,
        subcategory: selectedSubcategory.name,
        subsubcategory: undefined,
      }));

      if (
        selectedSubcategory.features &&
        selectedSubcategory.features.length > 0
      ) {
        setCurrentFeatures(selectedSubcategory.features);
      } else if (
        selectedCategory?.features &&
        selectedCategory.features.length > 0
      ) {
        setCurrentFeatures(selectedCategory.features);
      } else {
        setCurrentFeatures([]);
      }
    }
  };

  const handleFeatureFilterChange = (featureId: string, value: any) => {
    setFeatureFilters((prev: Record<string, any>) => ({
      ...prev,
      [featureId]: value,
    }));
  };

  useEffect(() => {
    const loadFeaturesFromUrl = () => {
      if (selectedSubSubcategory && selectedSubSubcategory.features) {
        setCurrentFeatures(selectedSubSubcategory.features);
      } else if (selectedSubcategory && selectedSubcategory.features) {
        setCurrentFeatures(selectedSubcategory.features);
      } else if (selectedCategory && selectedCategory.features) {
        setCurrentFeatures(selectedCategory.features);
      }
    };

    loadFeaturesFromUrl();
  }, [selectedCategory, selectedSubcategory, selectedSubSubcategory]);

  const getCategoryDisplayName = () => {
    if (selectedSubSubcategory) {
      return `${selectedCategory?.name} > ${selectedSubcategory?.name} > ${selectedSubSubcategory.name}`;
    }
    if (selectedSubcategory) {
      return `${selectedCategory?.name} > ${selectedSubcategory.name}`;
    }
    if (selectedCategory) {
      return selectedCategory.name;
    }
    return "Kategoriler";
  };

  const getPriceDisplayValue = () => {
    if (filters.minPrice && filters.maxPrice) {
      return `${filters.minPrice} TL - ${filters.maxPrice} TL`;
    }
    if (filters.minPrice) {
      return `${filters.minPrice} TL ve üzeri`;
    }
    if (filters.maxPrice) {
      return `${filters.maxPrice} TL ve altı`;
    }
    return "Fiyat";
  };

  const getLocationDisplayValue = () => {
    if (filters.location === "Hepsi") {
      return "Tüm Türkiye";
    }
    if (filters.district === "Hepsi") {
      return filters.location;
    }
    return `${filters.location}, ${filters.district}`;
  };

  const openMobileSection = (section: string) => {
    setMobileActiveSection(section);
  };

  const closeMobileSection = () => {
    setMobileActiveSection(null);
  };

  const handleFilterClick = () => {
    handleFilter();
    if (onCloseMobileSidebar) {
      onCloseMobileSidebar();
    }
    setMobileActiveSection(null);
  };

  const hasAreaFeature = currentFeatures.some(
    (f) =>
      f.name.toLowerCase().includes("metre") ||
      f.name.toLowerCase().includes("alan") ||
      f.name.toLowerCase().includes("m²") ||
      f.type === "range"
  );

  const getAreaDisplayValue = () => {
    const areaFeature = currentFeatures.find(
      (f) =>
        f.name.toLowerCase().includes("metre") ||
        f.name.toLowerCase().includes("alan") ||
        f.name.toLowerCase().includes("m²")
    );

    if (areaFeature && featureFilters[areaFeature._id]) {
      const value = featureFilters[areaFeature._id];
      if (areaFeature.type === "range") {
        return `${value.min || "Min"} - ${value.max || "Max"} m²`;
      } else if (areaFeature.type === "number") {
        return `${value} m²`;
      }
    }
    return "Seçiniz";
  };

  useEffect(() => {
    if (Object.keys(urlParams).length > 0) {
      const newFilters: FilterState = { ...filters };

      if (urlParams.city) {
        newFilters.location = urlParams.city;
      }
      if (urlParams.district) {
        newFilters.district = urlParams.district;
      }
      if (urlParams.category) {
        const category = categories.find((c) => c.name === urlParams.category);
        if (category) {
          handleCategorySelect(category);
        }
      }
      if (urlParams.type) {
        const subcategory = availableSubcategories.find(
          (s) => s.name === urlParams.type
        );
        if (subcategory) {
          handleSubcategorySelect(subcategory);
        }
      }
      if (urlParams.minPrice) {
        newFilters.minPrice = parseInt(urlParams.minPrice);
      }
      if (urlParams.maxPrice) {
        newFilters.maxPrice = parseInt(urlParams.maxPrice);
      }

      setFilters(newFilters);
    }
  }, [urlParams, categories]);

  return (
    <>
      {showMobileTopBar && (
        <div className="md:hidden fixed top-24 left-0 right-0 bg-white border-b border-gray-200 z-30">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={onOpenMobileSidebar}
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

      {/* MOBİL GÖRÜNÜM */}
      {isMobileSidebarOpen ? (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onCloseMobileSidebar}
          />

          <div className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-50">
              <button
                onClick={onCloseMobileSidebar}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft size={24} />
                <span className="font-medium">Geri Dön</span>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">Filtrele</h3>
              <div className="w-10"></div>
            </div>

            {mobileActiveSection ? (
              <>
                {mobileActiveSection === "category" && (
                  <>
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-50">
                      <button
                        onClick={closeMobileSection}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Kategori Seç
                      </h3>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Ana Kategoriler
                        </h4>
                        <button
                          onClick={() => {
                            handleCategorySelect(null);
                            closeMobileSection();
                          }}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            !selectedCategory
                              ? "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          Tüm Kategoriler
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => {
                              handleCategorySelect(category);
                              closeMobileSection();
                            }}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                              selectedCategory?._id === category._id
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>

                      {selectedCategory &&
                        availableSubcategories.length > 0 && (
                          <div className="space-y-2 mt-6">
                            <h4 className="font-medium text-gray-900 mb-3">
                              Alt Kategoriler
                            </h4>
                            {availableSubcategories.map((subcategory) => (
                              <button
                                key={subcategory._id}
                                onClick={() => {
                                  handleSubcategorySelect(subcategory);
                                  closeMobileSection();
                                }}
                                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                  selectedSubcategory?._id === subcategory._id
                                    ? "bg-blue-50 border-blue-300 text-blue-700"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                }`}
                              >
                                {subcategory.name}
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
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Konum Seç
                      </h3>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          İl
                        </label>
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
                          {citiesData.map((city: any) => (
                            <option key={city.province} value={city.province}>
                              {city.province}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          İlçe
                        </label>
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
                            {filters.location === "Hepsi"
                              ? "Önce il seçiniz"
                              : "Tüm İlçeler"}
                          </option>
                          {citiesData
                            .find(
                              (city: any) => city.province === filters.location
                            )
                            ?.districts.map((district: any) => (
                              <option
                                key={district.district}
                                value={district.district}
                              >
                                {district.district}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        onClick={closeMobileSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
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
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Fiyat Aralığı
                      </h3>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Min. TL
                          </label>
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice || ""}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minPrice: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Max. TL
                          </label>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice || ""}
                            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                maxPrice: e.target.value
                                  ? Number(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                      </div>

                      <button
                        onClick={closeMobileSection}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 mt-4"
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
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currentFeatures.find(
                          (f) =>
                            f._id ===
                            mobileActiveSection.replace("feature-", "")
                        )?.name || "Özellik"}
                      </h3>
                    </div>

                    <div className="p-4">
                      {(() => {
                        const featureId = mobileActiveSection.replace(
                          "feature-",
                          ""
                        );
                        const feature = currentFeatures.find(
                          (f) => f._id === featureId
                        );

                        if (feature) {
                          return (
                            <FeatureInput
                              feature={feature}
                              value={featureFilters[feature._id]}
                              onChange={(value) =>
                                handleFeatureFilterChange(feature._id, value)
                              }
                            />
                          );
                        }

                        return (
                          <p className="text-gray-600 mb-4">
                            Özellik bulunamadı.
                          </p>
                        );
                      })()}

                      <button
                        onClick={closeMobileSection}
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
                    onClick={() => openMobileSection("category")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Kategori
                          </h4>
                          <p className="text-sm text-gray-600">
                            {getCategoryDisplayName()}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openMobileSection("location")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Navigation size={20} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Konum</h4>
                          <p className="text-sm text-gray-600">
                            {getLocationDisplayValue()}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div
                    className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openMobileSection("price")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <DollarSign size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Fiyat</h4>
                          <p className="text-sm text-gray-600">
                            {getPriceDisplayValue()}
                          </p>
                        </div>
                      </div>
                      <ChevronDown size={20} className="text-gray-400" />
                    </div>
                  </div>

                  {hasAreaFeature && (
                    <div
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        const areaFeature = currentFeatures.find(
                          (f) =>
                            f.name.toLowerCase().includes("metre") ||
                            f.name.toLowerCase().includes("alan") ||
                            f.name.toLowerCase().includes("m²")
                        );
                        if (areaFeature) {
                          openMobileSection(`feature-${areaFeature._id}`);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Square size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Metrekare
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getAreaDisplayValue()}
                            </p>
                          </div>
                        </div>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                    </div>
                  )}

                  {currentFeatures.length > 0 &&
                    currentFeatures
                      .filter(
                        (f) =>
                          !f.name.toLowerCase().includes("metre") &&
                          !f.name.toLowerCase().includes("alan") &&
                          !f.name.toLowerCase().includes("m²")
                      )
                      .map((feature) => (
                        <div
                          key={feature._id}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() =>
                            openMobileSection(`feature-${feature._id}`)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-100 p-2 rounded-lg">
                                <Tag size={20} className="text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {feature.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {featureFilters[feature._id]
                                    ? feature.type === "boolean"
                                      ? featureFilters[feature._id]
                                        ? "Evet"
                                        : "Hayır"
                                      : feature.type === "multi_select"
                                      ? featureFilters[feature._id]?.length > 0
                                        ? `${
                                            featureFilters[feature._id].length
                                          } seçenek`
                                        : "Seçiniz"
                                      : featureFilters[feature._id] || "Seçiniz"
                                    : "Seçiniz"}
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
                    onClick={clearFilters}
                    className="w-full mb-3 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                  <button
                    onClick={handleFilterClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sonuçları Göster ({totalItems})
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        /* DESKTOP GÖRÜNÜM */
        <div className="hidden md:block w-80 bg-white border-r border-gray-200 h-[calc(100vh-5rem)] sticky top-20">
          <div className="h-[calc(100vh-10rem)] overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            <div className="p-4 space-y-4">
              <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => toggleSection("location")}
                  className="flex items-center justify-between w-full text-left pb-2"
                >
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Navigation size={18} />
                    Konum
                  </h4>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      expandedSections.location ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSections.location && (
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        İl
                      </label>
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="Hepsi">Tüm İller</option>
                        {citiesData.map((city: any) => (
                          <option key={city.province} value={city.province}>
                            {city.province}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        İlçe
                      </label>
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
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="Hepsi">
                          {filters.location === "Hepsi"
                            ? "Önce il seçiniz"
                            : "Tüm İlçeler"}
                        </option>
                        {citiesData
                          .find(
                            (city: any) => city.province === filters.location
                          )
                          ?.districts.map((district: any) => (
                            <option
                              key={district.district}
                              value={district.district}
                            >
                              {district.district}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Mahalle
                      </label>
                      <select
                        value={filters.quarter || "Hepsi"}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            quarter: e.target.value,
                          });
                        }}
                        disabled={
                          filters.location === "Hepsi" ||
                          filters.district === "Hepsi"
                        }
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="Hepsi">
                          {filters.location === "Hepsi" ||
                          filters.district === "Hepsi"
                            ? "Önce il ve ilçe seçiniz"
                            : "Tüm Mahalleler"}
                        </option>
                        {citiesData
                          .find(
                            (city: any) => city.province === filters.location
                          )
                          ?.districts.find(
                            (d: any) => d.district === filters.district
                          )
                          ?.quarters?.map((quarter: string) => (
                            <option key={quarter} value={quarter}>
                              {quarter}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full text-left pb-2"
                >
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Building size={18} />
                    Kategori
                  </h4>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      expandedSections.category ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSections.category && (
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    {loadingCategories ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader
                          size={18}
                          className="animate-spin text-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Yükleniyor...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Ana Kategori
                          </label>
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(null)}
                              className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                !selectedCategory
                                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              Tüm Kategoriler
                            </button>
                            {categories.map((category: Category) => (
                              <button
                                key={category._id}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                  selectedCategory?._id === category._id
                                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                                    : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedCategory &&
                          availableSubcategories.length > 0 && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Alt Kategori
                              </label>
                              <div className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => handleSubcategorySelect(null)}
                                  className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                    !selectedSubcategory
                                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  Tümü
                                </button>
                                {availableSubcategories.map(
                                  (subcategory: Subcategory) => (
                                    <button
                                      key={subcategory._id}
                                      type="button"
                                      onClick={() =>
                                        handleSubcategorySelect(subcategory)
                                      }
                                      className={`w-full text-left p-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                        selectedSubcategory?._id ===
                                        subcategory._id
                                          ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                                          : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {subcategory.name}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full text-left pb-2"
                >
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign size={18} />
                    Fiyat
                  </h4>
                  <ChevronDown
                    size={18}
                    className={`transform transition-transform ${
                      expandedSections.price ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSections.price && (
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">
                          Min. TL
                        </label>
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.minPrice || ""}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minPrice: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-600 font-medium">
                          Max. TL
                        </label>
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.maxPrice || ""}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxPrice: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {currentFeatures.length > 0 && (
                <div className="space-y-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <button
                    onClick={() => toggleSection("features")}
                    className="flex items-center justify-between w-full text-left pb-2"
                  >
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Tag size={18} />
                      Özellikler
                    </h4>
                    <ChevronDown
                      size={18}
                      className={`transform transition-transform ${
                        expandedSections.features ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedSections.features && (
                    <div className="space-y-4 border-t border-gray-100 pt-3">
                      {currentFeatures.map((feature) => (
                        <div key={feature._id} className="space-y-2">
                          <FeatureInput
                            feature={feature}
                            value={featureFilters[feature._id]}
                            onChange={(value) =>
                              handleFeatureFilterChange(feature._id, value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 mt-4">
              <div className="p-4 bg-linear-to-t from-white via-white to-transparent">
                <button
                  onClick={handleFilter}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Filtrele
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
