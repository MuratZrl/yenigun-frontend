import { useCallback, useState } from "react";

import type { ContractState, ContractPartKey, DemirbasInput } from "./types";

const initialContract: ContractState = {
  part_1: {
    city: "",
    county: "",
    neighbourhood: "",
    mainstreet: "",
    street: "",
    doorNumber: "",
    apartmentNumber: "",
    rentalType: "",
    renter: "",
    renterAddress: "",
    tenant: "",
    tenantAddress: "",
    guarantor: "",
    guarantorAddress: "",
  },
  part_2: {
    monthlyRent: 0,
    yearlyRent: 0,
    paymentType: "",
    rentalPeriod: "",
    rentalStartDate: "",
    deliveryStatus: "",
    usagePurpose: "",
  },
  part_3: {
    teslimAlinanDemirbaslar: [],
    specialConditions: "",
  },
  part_4: {
    rentalDeposit: 0,
    suretyBond: "",
    siteFee: 0,
    otherFees: 0,
    rentalAccountNumber: "",
    delayedPaymentInterest: "",
  },
  part_5: {
    stampDuty: "",
    contractStartDate: "",
    contractEndDate: "",
    notificationAddress: "",
    competentCourt: "",
  },
};

interface UseRentContractArgs {
  setOpen: (state: { open: boolean; id: number }) => void;
}

export function useRentContract({ setOpen }: UseRentContractArgs) {
  const [contract, setContract] = useState<ContractState>({ ...initialContract, part_3: { ...initialContract.part_3, teslimAlinanDemirbaslar: [] } });
  const [demirbasInput, setDemirbasInput] = useState<DemirbasInput>({ name: "", quantity: 1 });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, part: ContractPartKey) => {
      const { name, value } = e.target;
      setContract((prev) => ({
        ...prev,
        [part]: { ...prev[part], [name]: value },
      }));
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpen({ open: false, id: 0 });
  }, [setOpen]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const handleAddDemirbas = useCallback(() => {
    setContract((prev) => ({
      ...prev,
      part_3: {
        ...prev.part_3,
        teslimAlinanDemirbaslar: [
          ...prev.part_3.teslimAlinanDemirbaslar,
          `${demirbasInput.name} - ${demirbasInput.quantity} Adet`,
        ],
      },
    }));
    setDemirbasInput({ name: "", quantity: 1 });
  }, [demirbasInput]);

  const handleRemoveDemirbas = useCallback((index: number) => {
    setContract((prev) => ({
      ...prev,
      part_3: {
        ...prev.part_3,
        teslimAlinanDemirbaslar: prev.part_3.teslimAlinanDemirbaslar.filter((_, i) => i !== index),
      },
    }));
  }, []);

  return {
    contract,
    demirbasInput,
    setDemirbasInput,
    handleChange,
    handleClose,
    handleSubmit,
    handleAddDemirbas,
    handleRemoveDemirbas,
  };
}
