// src/features/ads/model/defaults.ts
import type { FilterState } from "@/types/advert";

export const ITEMS_PER_PAGE = 20;

export const DEFAULT_FILTERS: FilterState = {
  keyword: "",
  location: "Hepsi",
  district: "Hepsi",
  type: "Hepsi",
  action: "Tümü",
  minPrice: null,
  maxPrice: null,
  sortBy: "date",
  sortOrder: "desc",
};
