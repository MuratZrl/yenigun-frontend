export interface Category {
  _id: string; 
  name: string;
  subcategories: Subcategory[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  features: Feature[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Feature {
  _id: string; 
  name: string;
  type: 'text' | 'number' | 'single_select' | 'multi_select' | 'boolean';
  options?: string[];
  example?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FeatureValues {
  [featureId: string]: any;
}