// src/features/ilanlar/ui/components/filter/FilterSidebar.client.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { FilterState, Category, Subcategory, Feature } from "@/types/advert";
import type { CategoryHandlerDeps, FeatureFilterValue, FeatureFiltersMap, CityData } from "./types";
import DesktopFiltersPanel from "./DesktopFiltersPanel.client";
import MobileFiltersPanel from "./MobileFiltersPanel.client";

import { buildMissingFeatureDefaults } from "./featureInit";
import {
  handleCategorySelect as handleCategorySelectCore,
  handleSubcategorySelect as handleSubcategorySelectCore,
  handleSubSubcategorySelect as handleSubSubcategorySelectCore,
} from "./categoryHandlers";

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

  /* Sync missing feature filter defaults when currentFeatures change. */
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
  const onSubSubcategorySelect = (subsub: Subcategory | null) => handleSubSubcategorySelectCore(subsub, deps);

  const handleFeatureFilterChange = (featureId: string, value: FeatureFilterValue) => {
    setFeatureFilters((prev) => ({ ...prev, [featureId]: value }));
  };

  return (
    <>
      <MobileFiltersPanel
        filters={filters}
        setFilters={setFilters}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        categories={categories}
        availableSubcategories={availableSubcategories}
        availableSubSubcategories={availableSubSubcategories}
        featureFilters={featureFilters}
        totalItems={totalItems}
        showMobileTopBar={showMobileTopBar}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={onCloseMobileSidebar}
        onOpenMobileSidebar={onOpenMobileSidebar}
        onOpenSortMenu={onOpenSortMenu}
        citiesData={citiesData}
        currentFeatures={currentFeatures}
        onCategorySelect={onCategorySelect}
        onSubcategorySelect={onSubcategorySelect}
        onSubSubcategorySelect={onSubSubcategorySelect}
        onFeatureFilterChange={handleFeatureFilterChange}
        handleFilter={handleFilter}
        clearFilters={clearFilters}
        showUrlDebug={showUrlDebug}
        urlParams={urlParams}
      />

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
    </>
  );
};

export default FilterSidebar;
