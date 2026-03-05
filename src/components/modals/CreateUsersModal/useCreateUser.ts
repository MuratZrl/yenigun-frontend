import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import api from "@/lib/api";

import type { PhoneEntry, NewUserState } from "./types";
import { initialUser, formatPhoneNumber, cleanPhoneNumber, turkeyCities } from "./utils";

interface UseCreateUserArgs {
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export function useCreateUser({ setOpen, onSuccess }: UseCreateUserArgs) {
  const [newUser, setNewUser] = useState<NewUserState>({ ...initialUser });
  const [newPhone, setNewPhone] = useState<PhoneEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handlePhoneChange = useCallback((value: string, index: number | null = null) => {
    const formattedValue = formatPhoneNumber(value);

    if (index === null) {
      setNewUser((prev) => ({
        ...prev,
        phones: [{ phone: formattedValue, isSmS: prev.phones[0]?.isSmS ?? true }],
      }));
    } else {
      setNewPhone((prev) =>
        prev.map((item, i) =>
          i === index ? { phone: formattedValue, isSmS: item.isSmS } : item
        )
      );
    }
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setNewPhone([]);
    setNewUser({ ...initialUser });
  }, [setOpen]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddPhone = useCallback(() => {
    setNewPhone((prev) => [...prev, { phone: "", isSmS: true }]);
  }, []);

  const handleRemovePhone = useCallback((index: number) => {
    setNewPhone((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleGenderChange = useCallback((gender: string) => {
    setNewUser((prev) => ({ ...prev, gender: { ...prev.gender, selected: gender } }));
  }, []);

  const handleStatusChange = useCallback((status: string) => {
    setNewUser((prev) => ({ ...prev, status: { ...prev.status, selected: status } }));
  }, []);

  const handleProvinceChange = useCallback((province: string) => {
    setNewUser((prev) => ({ ...prev, province, district: "", quarter: "" }));
  }, []);

  const handleDistrictChange = useCallback((district: string) => {
    setNewUser((prev) => ({ ...prev, district, quarter: "" }));
  }, []);

  const handleQuarterChange = useCallback((quarter: string) => {
    setNewUser((prev) => ({ ...prev, quarter }));
  }, []);

  const handleImageChange = useCallback((file: File | undefined) => {
    setNewUser((prev) => ({ ...prev, image: file ?? "" }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newUser.name || !newUser.lastname) {
      toast.error("Ad ve soyad alanları zorunludur");
      return;
    }

    if (!newUser.status.selected) {
      toast.error("Müşteri türü seçilmelidir");
      return;
    }

    const allPhones = [...newUser.phones, ...newPhone].filter(
      (phone) => phone.phone && phone.phone !== "0" && phone.phone !== ""
    );

    if (allPhones.length === 0) {
      toast.error("En az bir geçerli telefon numarası giriniz");
      return;
    }

    setLoading(true);

    try {
      const cleanedPhones = newUser.phones.map((phone) => ({
        ...phone,
        phone: cleanPhoneNumber(phone.phone),
      }));

      const cleanedNewPhones = newPhone.map((phone) => ({
        ...phone,
        phone: cleanPhoneNumber(phone.phone),
      }));

      const allCleanedPhones = [...cleanedPhones, ...cleanedNewPhones]
        .filter((phone) => phone.phone && phone.phone !== "0" && phone.phone !== "")
        .map((phone) => ({
          number: phone.phone.replace(/\D/g, "") || "",
          isAbleToSendSMS: phone.isSmS !== undefined ? phone.isSmS : newUser.isSmS,
          ownerFullName: `${newUser.name || ""} ${newUser.lastname || ""}`.trim() || "",
        }));

      const backendData = {
        name: newUser.name || "",
        surname: newUser.lastname || "",
        gender: newUser.gender.selected === "Erkek" ? "male" : "female",
        status: newUser.status.selected || "",
        mail: { mail: newUser.email || " ", isAbleToSendMail: true },
        phones: allCleanedPhones.length > 0
          ? allCleanedPhones
          : [{ number: "", isAbleToSendSMS: false, ownerFullName: "" }],
        tcNumber: newUser.turkish_id || " ",
        mernisNo: newUser.mernis_no || " ",
        country: "Türkiye",
        city: newUser.province || "",
        county: newUser.district || "",
        neighbourhood: newUser.quarter || "",
        fulladdress: newUser.address || " ",
        ideasAboutCustomer: newUser.note || " ",
        ownerUrl: newUser.owner_url || "",
      };

      const response = await api.post("/admin/add-customer", backendData);

      toast.success("Kullanıcı başarıyla oluşturuldu.");

      if (newUser.image) {
        const formData = new FormData();
        formData.append("uid", response.data.data.uid);
        formData.append("image", newUser.image);

        await api.post("/admin/upload-customer-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Kullanıcı resmi başarıyla yüklendi");
      }

      handleClose();
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error("Kullanıcı oluşturma hatası:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Kullanıcı oluşturulurken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [newUser, newPhone, handleClose, onSuccess]);

  return {
    newUser,
    setNewUser,
    newPhone,
    loading,
    turkeyCities,
    handleCheckboxChange,
    handlePhoneChange,
    handleClose,
    handleChange,
    handleAddPhone,
    handleRemovePhone,
    handleGenderChange,
    handleStatusChange,
    handleProvinceChange,
    handleDistrictChange,
    handleQuarterChange,
    handleImageChange,
    handleSubmit,
  };
}
