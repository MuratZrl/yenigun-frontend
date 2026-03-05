// src/features/admin/emlak-archived/types.ts

/* ------------------------------------------------------------------ */
/*  Advert                                                             */
/* ------------------------------------------------------------------ */

export interface AdvertAddress {
  province: string;
  district: string;
  quarter: string;
  full_address: string;
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
  parcel?: string;
}

export interface AdvertCustomer {
  uid?: string | number;
  name: string;
  surname: string;
  phones: Array<{ number: string }>;
}

export interface AdvertAdvisor {
  name: string;
  surname: string;
  profilePicture?: string;
}

export interface FeatureValue {
  featureId: string;
  value: string | number;
  name?: string;
  title?: string;
  description?: string;
}

export interface Advert {
  uid: string;
  title: string;
  active: boolean;
  fee: number;
  photos: string[];
  address: AdvertAddress;
  steps: {
    first: string;
    second: string;
  };
  customer: AdvertCustomer;
  advisor: AdvertAdvisor;
  adminNote?: string;
  created: {
    createdTimestamp: number;
  };
  details?: {
    netArea?: number | string | null;
    grossArea?: number | string | null;
    [key: string]: unknown;
  };
  featureValues?: FeatureValue[];
  thoughts?: string;
}

/* ------------------------------------------------------------------ */
/*  Filters                                                            */
/* ------------------------------------------------------------------ */

export interface FilterState {
  uid: string;
  title: string;
  province: string;
  district: string;
  quarter: string;
  type: string;
  otherType: string;
  minFee: string;
  maxFee: string;
  advisor: string;
  customer: string;
}

export const EMPTY_FILTERS: FilterState = {
  uid: "",
  title: "",
  province: "",
  district: "",
  quarter: "",
  type: "",
  otherType: "",
  minFee: "",
  maxFee: "",
  advisor: "",
  customer: "",
};

/* ------------------------------------------------------------------ */
/*  Modal states                                                       */
/* ------------------------------------------------------------------ */

export interface AdminNoteModal {
  isOpen: boolean;
  ad: Advert | Record<string, never>;
}

export interface DeleteConfirmModal {
  open: boolean;
  ad: Advert | null;
}

export interface AdUserNotesModal {
  isOpen: boolean;
  ad?: Advert;
}