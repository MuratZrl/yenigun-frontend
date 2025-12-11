 
export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface Address {
  full_address: string;
  province: string;
  district: string;
  quarter: string;
  parcel?: string;
  mapCoordinates?: MapCoordinates;
}

export interface Steps {
  first: string;
  second: string;
  third: string;
}

export interface Advisor {
  name: string;
  surname: string;
  [key: string]: any;
}

export interface AdvertDetails {
  roomCount?: number | null;
  netArea?: number | null;
  grossArea?: number | null;
  buildingAge?: number | null;
  elevator?: boolean;
  [key: string]: any;
}

export interface Advert {
  uid: number;
  title: string;
  fee: string;
  address: Address;
  thoughts?: string;
  details: AdvertDetails;
  photos: string[];
  created?: {
    createdTimestamp: number;
  };
  advisor?: Advisor;
  isNew?: boolean;
  steps?: Steps;
  [key: string]: any;
}