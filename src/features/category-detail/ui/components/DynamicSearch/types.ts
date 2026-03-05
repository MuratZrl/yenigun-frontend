// src/features/category-detail/ui/components/DynamicSearch/types.ts

import { Advert } from "@/types/search";
import { Category, Subcategory } from "../../../types";

/* ── JSON data.json shape ── */

export interface JsonQuarter {
  name: string;
}

export interface JsonDistrict {
  name: string;
  quarters: JsonQuarter[];
}

export interface JsonTown {
  name: string;
  districts: JsonDistrict[];
}

export interface JsonCity {
  name: string;
  alpha_2_code: string;
  towns: JsonTown[];
}

/* ── Turkey location helpers ── */

export interface TurkeyCity {
  province: string;
  districts: {
    district: string;
    quarters: string[];
  }[];
}

/* ── Feature (from API subcategory) ── */

export interface Feature {
  _id: string;
  name: string;
  type: "single_select" | "multi_select" | "number" | "text" | "boolean";
  options?: string[];
}

/* ── Filter values (internal state) ── */

export interface FilterValues {
  minPrice: string;
  maxPrice: string;
  province: string;
  district: string;
  neighborhood: string;
  search: string;
  subcategory: string;
  [key: string]: string | string[] | boolean | Record<string, string>;
}

/* ── Search filters (output to parent) ── */

export type SearchFilters = Record<string, unknown>;

/* ── Component props ── */

export interface DynamicSearchProps {
  categoryId: string;
  categoryName: string;
  categoryData?: Category;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<FilterValues>;
  adverts?: Advert[];
}

/* ── Re-exports for convenience ── */
export type { Advert, Category, Subcategory };
