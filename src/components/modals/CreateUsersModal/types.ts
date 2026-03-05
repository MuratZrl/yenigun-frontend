export interface PhoneEntry {
  phone: string;
  isSmS: boolean;
}

export interface SelectOption {
  selected: string;
  options: string[];
}

export interface NewUserState {
  image: File | string;
  name: string;
  lastname: string;
  gender: SelectOption;
  status: SelectOption;
  phones: PhoneEntry[];
  turkish_id: string;
  mernis_no: string;
  province: string;
  district: string;
  quarter: string;
  address: string;
  comment: string;
  owner_url: string;
  email: string;
  note: string;
  isSmS: boolean;
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

export interface CreateUserModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}
