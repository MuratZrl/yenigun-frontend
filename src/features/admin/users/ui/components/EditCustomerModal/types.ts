// src/features/admin/users/ui/components/EditCustomerModal/types.ts

export interface PhoneEntry {
  number?: string;
  isAbleToSendSMS?: boolean;
}

export interface ReactSelectOption {
  value: string;
  label: string;
}

export interface TurkeyDistrict {
  district: string;
  quarters: string[];
}

export interface TurkeyCity {
  province: string;
  districts: TurkeyDistrict[];
}

export interface EditUserState {
  uid: string;
  image: File | string;
  name: string;
  lastname: string;
  email: string;
  address: string;
  comment: string;
  country: string;
  district: string;
  gender: string;
  isSmS: boolean;
  mernis_no: string;
  owner_url: string;
  phones: PhoneEntry[];
  province: string;
  quarters: string;
  status: string;
  turkish_id: string;
}

export interface UserProp {
  uid?: string | number;
  image?: string;
  name?: string;
  surname?: string;
  mail?: { mail?: string } | string | null;
  fulladdress?: string;
  ideasAboutCustomer?: string;
  country?: string;
  county?: string;
  gender?: string;
  phones?: PhoneEntry[];
  city?: string;
  neighbourhood?: string;
  status?: string;
  tcNumber?: string;
  mernisNo?: string;
  ownerUrl?: string;
  [key: string]: unknown;
}

export interface EditUserModalProps {
  open: boolean;
  setOpen: (state: { open: boolean; user: UserProp | null }) => void;
  user: UserProp | null;
  cookies: Record<string, string>;
  onSuccess?: () => void;
}

export const INITIAL_USER: EditUserState = {
  uid: "",
  image: "",
  name: "",
  lastname: "",
  email: "",
  address: "",
  comment: "",
  owner_url: "",
  country: "",
  district: "",
  gender: "",
  isSmS: false,
  mernis_no: "",
  phones: [],
  province: "",
  quarters: "",
  status: "",
  turkish_id: "",
};

export const USER_TYPES = [
  "Mülk Sahibi",
  "Satınalan",
  "Kiralayan",
  "Özel Müşteri",
] as const;
