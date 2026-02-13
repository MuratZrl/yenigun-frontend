// src/features/admin/customer-detail/lib/types.ts

export interface Customer {
  _id: string;
  uid: number;
  name: string;
  surname: string;
  gender: "male" | "female";
  status: string;
  mail: {
    mail: string;
    isAbleToSendMail: boolean;
  };
  phones: {
    number: string;
    isAbleToCall: boolean;
    isAbleToWhatsapp: boolean;
  }[];
  tcNumber: string;
  mernisNo: string;
  country: string;
  city: string;
  county: string;
  neighbourhood: string;
  fulladdress: string;
  ideasAboutCustomer: string;
  created: {
    uid: number;
    createdTimestamp: number;
  };
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
  customer: {
    uid: string;
  };
}