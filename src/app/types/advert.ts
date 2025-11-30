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
  netArea: string;
  grossArea?: string;
  roomCount: string;
  buildingAge: string;
  floor: string;
  totalFloor?: string;
  heating: string;
  bathCount?: string;
  elevator: boolean;
  balcony: boolean;
  furniture: boolean;
  inSite: boolean;
  balconyCount?: string;
  whichSide?: string;
  deed?: string;
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
}

export interface FilterState {
  keyword: string;
  location: string;
  district: string;
  action: string;
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
}