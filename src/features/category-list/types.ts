// src/features/category-list/types.ts
export interface Subcategory {
  _id: string;
  name: string;
  subcategories?: Subcategory[];
}

export interface Category {
  _id: string;
  name: string;
  subcategories?: Subcategory[];
}

export interface MainCategory {
  name: string;
  count: number;
  subcategories: {
    name: string;
    count: number;
  }[];
}
