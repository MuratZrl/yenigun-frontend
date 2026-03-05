export interface ContractPart1 {
  city: string;
  county: string;
  neighbourhood: string;
  mainstreet: string;
  street: string;
  doorNumber: string;
  apartmentNumber: string;
  rentalType: string;
  renter: string;
  renterAddress: string;
  tenant: string;
  tenantAddress: string;
  guarantor: string;
  guarantorAddress: string;
}

export interface ContractPart2 {
  monthlyRent: number;
  yearlyRent: number;
  paymentType: string;
  rentalPeriod: string;
  rentalStartDate: string;
  deliveryStatus: string;
  usagePurpose: string;
}

export interface ContractPart3 {
  teslimAlinanDemirbaslar: string[];
  specialConditions: string;
}

export interface ContractPart4 {
  rentalDeposit: number;
  suretyBond: string;
  siteFee: number;
  otherFees: number;
  rentalAccountNumber: string;
  delayedPaymentInterest: string;
}

export interface ContractPart5 {
  stampDuty: string;
  contractStartDate: string;
  contractEndDate: string;
  notificationAddress: string;
  competentCourt: string;
}

export interface ContractState {
  part_1: ContractPart1;
  part_2: ContractPart2;
  part_3: ContractPart3;
  part_4: ContractPart4;
  part_5: ContractPart5;
}

export type ContractPartKey = keyof ContractState;

export interface DemirbasInput {
  name: string;
  quantity: number;
}

export interface ContractOpenState {
  open: boolean;
  id: number;
}

export interface RentContractProps {
  open: boolean;
  setOpen: (state: ContractOpenState) => void;
}
