// src/features/category-detail/types.ts
export interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  features: any[];
  subcategories?: Subcategory[];
}
