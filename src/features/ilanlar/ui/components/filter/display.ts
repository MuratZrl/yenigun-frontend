// src/features/ads/ui/components/filter/display.ts

import type { FilterState, Feature, Category, Subcategory } from "@/types/advert";
import { getActiveSortOption } from "./sortOptions";

export function getCategoryDisplayName(args: {
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
  selectedSubSubcategory: Subcategory | null;
  fallback?: string;
}) {
  const { selectedCategory, selectedSubcategory, selectedSubSubcategory, fallback = "Kategoriler" } = args;

  if (selectedSubSubcategory) {
    return `${selectedCategory?.name ?? ""} > ${selectedSubcategory?.name ?? ""} > ${selectedSubSubcategory.name}`.trim();
  }
  if (selectedSubcategory) {
    return `${selectedCategory?.name ?? ""} > ${selectedSubcategory.name}`.trim();
  }
  if (selectedCategory) return selectedCategory.name;
  return fallback;
}

export function getPriceDisplayValue(filters: Pick<FilterState, "minPrice" | "maxPrice">) {
  const min = filters.minPrice;
  const max = filters.maxPrice;

  if (min && max) return `${min} TL - ${max} TL`;
  if (min) return `${min} TL ve üzeri`;
  if (max) return `${max} TL ve altı`;
  return "Fiyat";
}

export function getLocationDisplayValue(filters: Pick<FilterState, "location" | "district">) {
  if (filters.location === "Hepsi") return "Tüm Türkiye";
  if (filters.district === "Hepsi") return filters.location;
  return `${filters.location}, ${filters.district}`;
}

export function getSortDisplayValue(filters: Pick<FilterState, "sortBy" | "sortOrder">) {
  return getActiveSortOption(filters).label;
}

export function hasAreaFeature(currentFeatures: Feature[]) {
  return currentFeatures.some(
    (f) =>
      f.name.toLowerCase().includes("metre") ||
      f.name.toLowerCase().includes("alan") ||
      f.name.toLowerCase().includes("m²") ||
      f.type === "range",
  );
}

export function findAreaFeature(currentFeatures: Feature[]) {
  return currentFeatures.find(
    (f) =>
      f.name.toLowerCase().includes("metre") ||
      f.name.toLowerCase().includes("alan") ||
      f.name.toLowerCase().includes("m²"),
  );
}

export function getAreaDisplayValue(args: {
  currentFeatures: Feature[];
  featureFilters: Record<string, any>;
}) {
  const { currentFeatures, featureFilters } = args;

  const areaFeature = findAreaFeature(currentFeatures);
  if (!areaFeature) return "Seçiniz";

  const v = featureFilters[areaFeature._id];
  if (!v) return "Seçiniz";

  if (areaFeature.type === "range") {
    const min = v?.min ?? null;
    const max = v?.max ?? null;
    if (min === null && max === null) return "Seçiniz";
    return `${min ?? "Min"} - ${max ?? "Max"} m²`;
  }

  if (areaFeature.type === "number") {
    return v ? `${v} m²` : "Seçiniz";
  }

  return String(v);
}

export function getFeatureDisplayValue(args: {
  feature: Feature;
  featureFilters: Record<string, any>;
}) {
  const { feature, featureFilters } = args;
  const v = featureFilters[feature._id];

  if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
    return "Seçiniz";
  }

  if (feature.type === "boolean") return v ? "Evet" : "Hayır";

  if (feature.type === "multi_select") {
    return Array.isArray(v) && v.length > 0 ? `${v.length} seçenek` : "Seçiniz";
  }

  if (feature.type === "range") {
    const min = v?.min ?? null;
    const max = v?.max ?? null;
    if (min === null && max === null) return "Seçiniz";
    return `${min ?? "Min"} - ${max ?? "Max"}`;
  }

  return String(v);
}
