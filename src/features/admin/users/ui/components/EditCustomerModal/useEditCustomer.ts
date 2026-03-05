// src/features/admin/users/ui/components/EditCustomerModal/useEditCustomer.ts
"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import type { SingleValue } from "react-select";
import api from "@/lib/api";

import type {
  EditUserState,
  UserProp,
  PhoneEntry,
  TurkeyDistrict,
  ReactSelectOption,
} from "./types";
import { INITIAL_USER } from "./types";
import {
  formatPhoneNumber,
  cleanPhoneNumber,
  buildTurkeyCities,
} from "./utils";

/* ------------------------------------------------------------------ */
/*  Hook options                                                       */
/* ------------------------------------------------------------------ */

interface UseEditCustomerOptions {
  user: UserProp | null;
  setOpen: (state: { open: boolean; user: UserProp | null }) => void;
  onSuccess?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export default function useEditCustomer({
  user,
  setOpen,
  onSuccess,
}: UseEditCustomerOptions) {
  /* ---------- state ---------- */
  const [newUser, setNewUser] = useState<EditUserState>({ ...INITIAL_USER });
  const [newPhone, setNewPhone] = useState<PhoneEntry[]>([]);
  const [firstPhone, setFirstPhone] = useState("");
  const [districts, setDistricts] = useState<TurkeyDistrict[]>([]);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- derived ---------- */
  const turkeyCities = useMemo(() => buildTurkeyCities(), []);

  /* ---------- location helpers ---------- */

  const updateDistricts = useCallback(
    (province: string) => {
      const selectedCity = turkeyCities.find(
        (city) => city.province === province,
      );
      setDistricts(selectedCity?.districts ?? []);
      setQuarters([]);
    },
    [turkeyCities],
  );

  const updateQuarters = useCallback(
    (district: string) => {
      const selectedDistrict = districts.find(
        (dist) => dist.district === district,
      );
      setQuarters(selectedDistrict?.quarters ?? []);
    },
    [districts],
  );

  /* ---------- init user data ---------- */

  useEffect(() => {
    if (!user) {
      setNewUser({ ...INITIAL_USER });
      setNewPhone([]);
      setFirstPhone("");
      setDistricts([]);
      setQuarters([]);
      setFileName("");
      return;
    }

    const formattedPhones: PhoneEntry[] = user.phones
      ? user.phones.map((phone) => ({
          ...phone,
          number: formatPhoneNumber(phone.number ?? ""),
        }))
      : [];

    const mailValue =
      typeof user.mail === "object" && user.mail !== null
        ? user.mail?.mail
        : typeof user.mail === "string"
          ? user.mail
          : "";

    setNewUser({
      uid: String(user.uid ?? ""),
      image: user.image || "",
      name: user.name || "",
      lastname: user.surname || "",
      email: mailValue || "",
      address: user.fulladdress || "",
      comment: user.ideasAboutCustomer || "",
      country: user.country || "",
      district: user.county || "",
      gender: user.gender === "male" ? "Erkek" : "Kadın",
      isSmS: user.phones?.[0]?.isAbleToSendSMS || false,
      mernis_no: user.mernisNo || "",
      owner_url: user.ownerUrl || "",
      phones: formattedPhones,
      province: user.city || "",
      quarters: user.neighbourhood || "",
      status: user.status || "",
      turkish_id: user.tcNumber || "",
    });

    setFirstPhone(
      user.phones?.[0]?.number
        ? formatPhoneNumber(user.phones[0].number)
        : "",
    );
    setNewPhone(
      user.phones
        ? user.phones.slice(1).map((phone) => ({
            ...phone,
            number: formatPhoneNumber(phone.number ?? ""),
          }))
        : [],
    );
    setFileName("");

    // Initialize location dropdowns
    if (user.city) {
      const city = turkeyCities.find((c) => c.province === user.city);
      const cityDistricts = city?.districts ?? [];
      setDistricts(cityDistricts);

      if (user.county) {
        const dist = cityDistricts.find((d) => d.district === user.county);
        setQuarters(dist?.quarters ?? []);
      } else {
        setQuarters([]);
      }
    } else {
      setDistricts([]);
      setQuarters([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ---------- handlers ---------- */

  const handleClose = useCallback(
    (shouldRefetch = false) => {
      setOpen({ open: false, user: null });
      setNewPhone([]);
      if (shouldRefetch && onSuccess) onSuccess();
    },
    [setOpen, onSuccess],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewUser((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handlePhoneChange = useCallback(
    (value: string, index: number | null = null) => {
      const formattedValue = formatPhoneNumber(value);
      if (index === null) {
        setFirstPhone(formattedValue);
      } else {
        setNewPhone((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, number: formattedValue } : item,
          ),
        );
      }
    },
    [],
  );

  const handleAddPhone = useCallback(() => {
    setNewPhone((prev) => [
      ...prev,
      { number: "", isAbleToSendSMS: newUser.isSmS },
    ]);
  }, [newUser.isSmS]);

  const handleRemovePhone = useCallback((index: number) => {
    setNewPhone((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProvinceChange = useCallback(
    (selectedOption: SingleValue<ReactSelectOption>) => {
      const province = selectedOption?.value || "";
      setNewUser((prev) => ({
        ...prev,
        province,
        district: "",
        quarters: "",
      }));
      updateDistricts(province);
    },
    [updateDistricts],
  );

  const handleDistrictChange = useCallback(
    (selectedOption: SingleValue<ReactSelectOption>) => {
      const district = selectedOption?.value || "";
      setNewUser((prev) => ({ ...prev, district, quarters: "" }));
      updateQuarters(district);
    },
    [updateQuarters],
  );

  const handleQuarterChange = useCallback(
    (selectedOption: SingleValue<ReactSelectOption>) => {
      setNewUser((prev) => ({
        ...prev,
        quarters: selectedOption?.value || "",
      }));
    },
    [],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        setNewUser((prev) => ({ ...prev, image: file }));
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const cleanedFirstPhone = cleanPhoneNumber(firstPhone);
      const cleanedNewPhones = newPhone.map((phone) => ({
        ...phone,
        number: cleanPhoneNumber(phone.number ?? ""),
      }));

      const lastPhone = [
        { isAbleToSendSMS: newUser.isSmS, number: cleanedFirstPhone },
        ...cleanedNewPhones.map((phone) => ({
          isAbleToSendSMS: newUser.isSmS,
          number: phone.number,
        })),
      ];

      const payload = {
        uid: newUser.uid,
        name: newUser.name,
        surname: newUser.lastname,
        gender: newUser.gender === "Erkek" ? "male" : "female",
        status: newUser.status,
        mail: { mail: newUser.email || "", isAbledToSendMail: true },
        phones: lastPhone,
        tcNumber: newUser.turkish_id || "",
        mernisNo: newUser.mernis_no || "",
        country: "Türkiye",
        city: newUser.province,
        owner_url: newUser.owner_url,
        county: newUser.district,
        neighbourhood: newUser.quarters,
        fulladdress: newUser.address || "",
        ideasAboutCustomer: newUser.comment || "",
      };

      api
        .post("/admin/update-customer", payload)
        .then(() => {
          toast.success("Kullanıcı başarıyla güncellendi.");
          handleClose(true);
        })
        .catch((err: unknown) => {
          toast.error("Kullanıcı güncellenirken bir hata oluştu.");
          console.error("Hata detayı:", err);
          handleClose();
        });
    },
    [firstPhone, handleClose, newPhone, newUser],
  );

  /* ---------- return ---------- */

  return {
    // state
    newUser,
    setNewUser,
    newPhone,
    firstPhone,
    districts,
    quarters,
    fileName,
    fileInputRef,

    // derived
    turkeyCities,

    // handlers
    handleClose,
    handleInputChange,
    handlePhoneChange,
    handleAddPhone,
    handleRemovePhone,
    handleProvinceChange,
    handleDistrictChange,
    handleQuarterChange,
    handleFileChange,
    handleSubmit,
  };
}
