
export interface OptionValue { 
  value: string; 
  label?: string;
  icon?: string;
}

export interface ImageItem { 
  src: File; 
  id: string;
}

export interface SelectionItem {
  value: string;
  selections: string[];
}


export interface Feature {
  _id: string;
  name: string;
  type: 'text' | 'number' | 'single_select' | 'multi_select' | 'boolean';
  options?: string[];
  required?: boolean;
  unit?: string;
  placeholder?: string;
}

export interface FeatureValue {
  featureId: string;
  value: string | number | boolean | string[];
  featureType: Feature['type'];
}

export interface FeaturesState {
  [key: string]: FeatureValue;
}

export interface SubCategory {
  _id: string;
  name: string;
  features: Feature[];
  subcategories: SubCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  value: string;
  img: string;
  subcategories: SubCategory[];
  features?: Feature[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
 
export interface FormData {
  title: string;
  description: string;
  customer: string;
  contract_no: string;
  contract_date: string;
  contract_time: SelectionItem;
  eids: { 
    no: string; 
    date: string;
    value?: string;
  };
  advisor: string;
  advisor_profile: SelectionItem;
  agenda_emlak: SelectionItem;
  homepage_emlak: SelectionItem;
  new_emlak: SelectionItem;
  chance_emlak: SelectionItem;
  special_emlak: SelectionItem;
  onweb_emlak: SelectionItem;
  adminNote: string;
  key: SelectionItem;
  price: { value: string; type: string; selections: string[] };
  province: string;
  district: string;
  quarter: string;
  address: string;
  parsel: string;
  roomCount: string;
  netArea: number;
  grossArea: number;
  buildingAge: number;
  elevator: SelectionItem;
  inSite: SelectionItem;
  whichSide: SelectionItem;
  acre: number;
  acreText: string;
  floor: number;
  totalFloor: number;
  balcony: SelectionItem;
  balconyCount: number;
  isFurnished: SelectionItem;
  heating: SelectionItem;
  deedStatus: SelectionItem;
  zoningStatus: SelectionItem;
}

export interface SelectedItem {
  isSelect: boolean;
  value: string;
  id?: string;
  name?: string;  
  type?: string;    
  options?: string[]; 
  categoryData?:any
  subcategoryData?: any;
 featureData?: Feature | null;
}

export interface StepState {
  selected: SelectedItem;
  selections?: any;
}

export interface CustomerPhone {
  number: string;
}

export interface Customer {
  uid: number;
  name: string;
  surname: string;
  phones: CustomerPhone[];
}

export interface Advisor {
  uid: number;
  name: string;
  surname: string;
  peopleCanSeeProfile: boolean;
}

 export interface Contract {
  no: string;
  date: string;
  time: string;
}

export interface Eids {
  no: string;
  date: string;
  status: boolean;
}
 
export interface Questions {
  agendaEmlak: boolean;
  homepageEmlak: boolean;
  new_emlak: boolean;
  chance_emlak: boolean;
  special_emlak: boolean;
  onweb_emlak: boolean;
}
 
export interface Address {
  province: string;
  district: string;
  quarter: string;
  full_address: string;
  mapCoordinates: number;
  parcel: string;
}
 
export interface PropertyDetails {
  roomCount?: string;
  netArea?: number;
  grossArea?: number;
  buildingAge?: number;
  elevator?: boolean;
  inSite?: boolean;
  whichSide?: string;
  acre?: string;
  floor?: number;
  totalFloor?: number;
  balcony?: boolean;
  balconyCount?: number;
  furniture?: boolean;
  heating?: string;
  deed?: string;
  zoningStatus?: string;
}
 
export interface PropertyData {
  uid: string;
  steps: {
    first: string;
    second: string;
    third: string;
  };
  title: string;
  customer: Customer;
  contract: Contract;
  eids?: Eids;
  advisor: Advisor;
  questions: Questions;
  thoughts: string;
  adminNote: string;
  whoseKey: string;
  fee: string;
  address: Address;
  photos: string[];
  active: boolean;
  details: PropertyDetails; 
  category?: {
    mainCategory: Category;
    subCategory?: SubCategory;
    nestedSubCategory?: SubCategory;
  };
}
 
export interface TurkeyDistrict {
  district: string;
  quarters: string[];
}

export interface TurkeyCity {
  province: string;
  districts: TurkeyDistrict[];
} 
export interface ApiResponse<T> {
  data?: T;
  categories?: T[];
  items?: T[];
  message?: string;
  success: boolean;
} 
export interface FeatureSelection {
  [key: string]: string[] | { [key: string]: string[] };
} 
export interface MultiStepFormState {
  currentStep: number;
  firstStep: StepState;
  secondStep: StepState;
  thirdStep: StepState;
  featuresStep: StepState;
  isCompleted: boolean;
}
 
export interface FilterOptions {
  categories?: string[];
  subcategories?: string[];
  priceRange?: { min: number; max: number };
  locations?: string[];
  features?: string[];
}
 
export interface SearchParams {
  category?: string;
  subcategory?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  features?: string[];
  sortBy?: string;
  page?: number;
  limit?: number;
}

