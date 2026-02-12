// src/features/admin/categories/lib/types.ts

export interface Attribute {
  id: string;
  name: string;
  type: string; // TEXT | SELECT | CHECKBOX
  options: string[];
  required: boolean;
  order?: number;
}

export interface Facility {
  title: string;
  features: string[];
}

export interface CategoryNode {
  uid: number;
  name: string;
  attributes: Attribute[];
  facilities: Facility[];
  children: CategoryNode[];
}