export interface Address {
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  full_address: string;
  district: string;
  province: string;
  quarter: string;
  parcel?: string;
}

export interface PropertyListing {
  _id: string;
  uid: number;
  address: Address;
  title: string;
  fee: string;
  thoughts: string;
  photos: string[];
  categoryId: string;
  steps: {
    first: string;
    second: string;
  };
  details?: {
    netArea?: number;
    grossArea?: number;
  };
}
