// src/types/advert.ts

export interface Address {
  province: string;
  district: string;
  quarter: string;
  full_address: string;
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Advisor {
  name: string;
  surname: string;
  gsmNumber?: string;
}

export interface Details {
  netArea: string | null;
  grossArea?: string | null;
  roomCount: string | null;
  buildingAge: string | null;
  floor: string | null;
  totalFloor?: string | null;
  heating: string | null;
  bathCount?: string | null;
  elevator: boolean;
  balcony: boolean;
  furniture: boolean;
  inSite: boolean;
  balconyCount?: string | null;
  whichSide?: string | null;
  deed?: string | null;
}

export interface Steps {
  first: string;
  second: string;
}

export interface Contract {
  time?: string;
}

export interface Created {
  createdTimestamp: number;
}

export interface AdvertData {
  uid: string;
  title: string;
  thoughts: string;
  fee: string;
  video?: string;
  eidsNo?: string;
  eidsDate?: string;
  address: Address;
  advisor: Advisor;
  details: Details;
  steps: Steps;
  contract: Contract;
  created: Created;
  photos: string[];
  active: boolean;
  categoryId:string;
  subcategoryId:string;
    isFeatures: boolean;
  featureValues: FeatureValue[];
}

export interface FeatureValue {
  featureId: string;
  value: string | number;
  name?: string;
  title?: string;
  description?: string;
}

export interface SimilarAd {
  uid: string;
  title: string;
  fee: string;
  photos: string[];
  address: Address;
  details: Details;
  steps: Steps;
  created: Created;
}

export interface Advert {
  uid: string;
  active: boolean;
  title: string;
  address?: {
    province?: string;
    district?: string;
    quarter?: string;
  };
  steps?: {
    first?: string;
    second?: string;
    third?: string;
  };
  details?: {
    roomCount?: string;
    floor?: string;
    netArea?: string;
    acre?: string;
  };
  fee?: string;
  photos?: string[];
  created?: {
    createdTimestamp: number;
  };
    isFeatures?: boolean; 
  featureValues?: FeatureValue[];  
  thoughts?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export interface FilterState {
  keyword: string;
  location: string;
  district: string;
  quarter?: string;
    sortBy?: string;   
  sortOrder?: string;
  action: string;
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
  categoryId?: string;  
  subcategoryId?: string;  
  subSubcategoryId?: string;  
}

export interface Category {
  _id: string;
  name: string;
  features?: Feature[];
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Subcategory {
  name: string;
  features: Feature[];
  subcategories: any[];
  _id: string;
}

export interface Feature {
  name: string;
  type: string;
  options: string[];
  _id: string;
}