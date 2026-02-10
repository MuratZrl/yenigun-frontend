// src/features/ads/ui/components/fliter/types.ts
import type React from "react";
import type { Category, Feature, FilterState, Subcategory } from "@/types/advert";

export interface CityData {
  province: string;
  districts: Array<{
    district: string;
    quarters: string[];
  }>;
}

export type ExtendedFilterState = FilterState & Record<string, any>;
export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type CategoryHandlerDeps = {
  // ✅ EKLE: path bulmak için tüm ağaç lazım
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

  setFeatureFilters: SetState<Record<string, any>>;
  setCurrentFeatures: SetState<Feature[]>;
};
