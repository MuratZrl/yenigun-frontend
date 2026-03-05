// src/components/modals/FilterAdminAds/types.ts

import type React from "react";

export type Id = string;

export type FeatureType =
  | "boolean"
  | "text"
  | "number"
  | "single_select"
  | "multi_select"
  | "range"
  | string;

export type Feature = {
  _id: Id;
  name: string;
  type: FeatureType;
  options?: string[];
  example?: string;
};

export type SubcategoryNode = {
  _id: Id;
  name: string;
  subcategories?: SubcategoryNode[];
  features?: Feature[];
};

export type CategoryNode = {
  _id: Id;
  name: string;
  subcategories?: SubcategoryNode[];
};

export type FilterState = {
  search?: string | null;
  province?: string | null;
  district?: string | null;
  quarter?: string | null;

  type?: string | null;

  minFee?: number | null;
  maxFee?: number | null;

  advisor?: string | null;
  customer?: string | null;

  category?: string | null;
  subcategory?: string | null;
  subsubcategory?: string | null;
  categoryPath?: string | null;

  [k: string]: string | number | boolean | null | undefined;
};

export type RangeValue = { min: number | null; max: number | null };

export type FeatureFilterValue =
  | boolean
  | string
  | number
  | string[]
  | RangeValue
  | null
  | undefined;

export interface ReactSelectOption {
  value: string;
  label: string;
  color?: string;
}

export interface TurkeyDistrict {
  district: string;
  quarters: string[];
}

export interface TurkeyCity {
  province: string;
  districts: TurkeyDistrict[];
}

export interface ApiResponse {
  data?: {
    data?: unknown[];
    [key: string]: unknown;
  };
  items?: unknown[];
  categories?: unknown[];
  [key: string]: unknown;
}

export type FilterAdminAdsProps = {
  open: boolean;
  setOpen: (v: boolean) => void;

  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  handleFilter?: (...args: unknown[]) => void;
  handleCleanFilters: () => void;

  page?: number;
  limit?: number;

  onSearchResult?: (data: Record<string, unknown>) => void;
};
