// src/features/category-detail/types.ts

export interface Feature {
  _id: string;
  name: string;
  type: "single_select" | "multi_select" | "number" | "text" | "boolean";
  options?: string[];
}

export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  features: Feature[];
  subcategories?: Subcategory[];
}
