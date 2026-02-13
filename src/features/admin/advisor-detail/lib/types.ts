// src/features/admin/advisor-detail/lib/types.ts

export interface Advisor {
  name: string;
  surname: string;
  role: "head_admin" | "advisor";
  mail: string;
  gsmNumber: string;
  birth: {
    day: number | null;
    month: number | null;
    year: number | null;
  };
  gender: "male" | "female";
}

export interface AdvertAddress {
  district: string;
  province: string;
}

export interface AdvertDetails {
  roomCount: string;
  netArea: number;
}

export interface Advert {
  _id: string;
  uid: string;
  title: string;
  fee: string;
  active: boolean;
  details: AdvertDetails;
  address: AdvertAddress;
  photos: string[];
}

export interface AdvisorDetailProps {
  advisor: Advisor;
  adverts: Advert[];
  advertCount: number;
}