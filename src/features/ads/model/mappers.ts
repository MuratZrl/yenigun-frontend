// src/features/ads/model/mappers.ts
import type { FilterState } from "@/types/advert";

export function buildApiFilters(
  filterValues: FilterState,
  currentFeatureFilters: Record<string, any> = {},
) {
  const apiFilters: any = {};

  if (filterValues.location && filterValues.location !== "Hepsi") {
    apiFilters.city = filterValues.location;
    if (filterValues.district && filterValues.district !== "Hepsi") {
      apiFilters.district = filterValues.district;
    }
  }

  if (filterValues.type && filterValues.type !== "Hepsi") {
    const categoryPath = filterValues.type.split(" > ");

    if (categoryPath.length > 0) {
      apiFilters.category = categoryPath[0];

      if (categoryPath.length > 1) {
        apiFilters.type = categoryPath[1];

        if (categoryPath.length > 2) {
          apiFilters.subcategory = categoryPath[2];
        }
      }
    }
  }

  if (filterValues.minPrice !== null && filterValues.minPrice > 0) {
    apiFilters.minPrice = filterValues.minPrice;
  }

  if (filterValues.maxPrice !== null && filterValues.maxPrice > 0) {
    apiFilters.maxPrice = filterValues.maxPrice;
  }

  if (filterValues.keyword && filterValues.keyword.trim() !== "") {
    apiFilters.search = filterValues.keyword.trim();
  }

  apiFilters.sortBy = filterValues.sortBy || "date";
  apiFilters.sortOrder = filterValues.sortOrder || "desc";

  const featureFiltersArray = Object.entries(currentFeatureFilters)
    .filter(([, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (typeof value === "number" && value === 0) return false;
      if (Array.isArray(value) && value.length === 0) return false;

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (value.min === null && value.max === null) return false;
        if (value.min === 0 && value.max === 0) return false;
      }

      return true;
    })
    .map(([featureId, value]) => {
      let formattedValue: any = value;

      if (Array.isArray(value)) formattedValue = value.join(",");
      if (typeof value === "boolean") formattedValue = value ? "true" : "false";

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (value.min !== null && value.max !== null) formattedValue = `${value.min}-${value.max}`;
        else if (value.min !== null) formattedValue = `${value.min}`;
        else if (value.max !== null) formattedValue = `${value.max}`;
      }

      return { featureId, value: formattedValue };
    });

  if (featureFiltersArray.length > 0) apiFilters.featureFilters = featureFiltersArray;

  return apiFilters;
}
