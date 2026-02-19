// src/features/ads/ui/components/filter/types.ts
import type React from "react";
import type { Category, Feature, FilterState, Subcategory } from "@/types/advert";

export interface CityData {
  province: string;
  districts: Array<{
    district: string;
    quarters: string[];
  }>;
}

/** Possible value types stored per feature filter. */
export type FeatureFilterValue =
  | string
  | string[]
  | boolean
  | { min: number | null; max: number | null };

export type FeatureFiltersMap = Record<string, FeatureFilterValue>;

export type ExtendedFilterState = FilterState & {
  category?: string;
  subcategory?: string;
  subsubcategory?: string;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type CategoryHandlerDeps = {
  categories: Category[];

  filters: ExtendedFilterState;

  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;

  setFilters: SetState<ExtendedFilterState>;

  setSelectedCategory: SetState<Category | null>;
  setSelectedSubcategory: SetState<Subcategory | null>;
  setSelectedSubSubcategory: SetState<Subcategory | null>;

  setAvailableSubcategories: SetState<Subcategory[]>;
  setAvailableSubSubcategories: SetState<Subcategory[]>;

  setFeatureFilters: SetState<FeatureFiltersMap>;
  setCurrentFeatures: SetState<Feature[]>;
};
