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
   }
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




export interface StepState {
  selected: {
    isSelect: boolean;
    value: string;
  };
  selections: any;
}

export interface PropertyData {
  uid: string;
  steps: {
    first: string;
    second: string;
    third: string;
  };
  title: string;
  customer: {
    uid: number;
    name: string;
    surname: string;
    phones: { number: string }[];
  };
  contract: {
    no: string;
    date: string;
    time: string;
  };
  eids?: {
    no: string;
    date: string;
    status: boolean;
  };
  advisor: {
    uid: number;
    name: string;
    surname: string;
    peopleCanSeeProfile: boolean;
  };
  questions: {
    agendaEmlak: boolean;
    homepageEmlak: boolean;
    new_emlak: boolean;
    chance_emlak: boolean;
    special_emlak: boolean;
    onweb_emlak: boolean;
  };
  thoughts: string;
  adminNote: string;
  whoseKey: string;
  fee: string;
  address: {
    province: string;
    district: string;
    quarter: string;
    full_address: string;
    mapCoordinates: number;
    parcel: string;
  };
  photos: string[];
  active: boolean;
  details: {
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
  };
}

export interface TurkeyCity {
  province: string;
  districts: {
    district: string;
    quarters: string[];
  }[];
}

