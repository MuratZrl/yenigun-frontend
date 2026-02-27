// src/components/modals/EditUserModal.tsx

import React, { useState, useEffect, useRef } from "react";
import JSONDATA from "../../../../../app/data.json";
import { Poppins } from "next/font/google";
import {
  X,
  UserPen,
  Mail,
  Phone,
  Plus,
  Trash2,
  MapPin,
  Hash,
  FileText,
  Link as LinkIcon,
  MessageSquareText,
  ImagePlus,
  Users,
} from "lucide-react";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import api from "@/lib/api";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/* ── Types ── */
interface PhoneEntry {
  number?: string;
  isAbleToSendSMS?: boolean;
}

interface ReactSelectOption {
  value: string;
  label: string;
}

interface TurkeyDistrict {
  district: string;
  quarters: string[];
}

interface TurkeyCity {
  province: string;
  districts: TurkeyDistrict[];
}

interface EditUserState {
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

interface UserProp {
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

interface EditUserModalProps {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- accepting both plain callback and setState dispatch
  setOpen: (state: { open: boolean; user: UserProp | null }) => void;
  user: UserProp | null;
  cookies: Record<string, string>;
  onSuccess?: () => void;
}

/* ── Helpers ── */
const initialUser: EditUserState = {
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

/* ── Styles ── */
const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

const labelClass =
  "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

const sectionClass = "space-y-4";

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: state.isFocused ? "#fff" : "rgb(249 250 251)",
    border: state.isFocused ? "2px solid rgb(59 130 246)" : "1px solid rgba(0,0,0,0.12)",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 0px rgb(59 130 246)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "rgb(59 130 246)" : "rgba(0,0,0,0.2)",
    },
    fontSize: "0.875rem",
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: "rgba(0,0,0,0.30)",
    fontSize: "0.875rem",
  }),
  singleValue: (base: Record<string, unknown>) => ({
    ...base,
    color: "rgba(0,0,0,0.87)",
    fontSize: "0.875rem",
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.06)",
    zIndex: 50,
  }),
  option: (base: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected
      ? "rgb(59 130 246)"
      : state.isFocused
        ? "rgb(239 246 255)"
        : "white",
    color: state.isSelected ? "white" : "rgba(0,0,0,0.87)",
    "&:active": {
      backgroundColor: "rgb(219 234 254)",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

/* ── Component ── */
const EditUserModal = ({ open, setOpen, user, onSuccess }: EditUserModalProps) => {
  const [newUser, setNewUser] = useState<EditUserState>({ ...initialUser });
  const [newPhone, setNewPhone] = useState<PhoneEntry[]>([]);
  const [firstPhone, setFirstPhone] = useState("");
  const [districts, setDistricts] = useState<TurkeyDistrict[]>([]);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    let formatted = numbers;
    if (numbers.length > 0 && !numbers.startsWith("0")) {
      formatted = "0" + numbers;
    }

    if (formatted.length > 1) {
      formatted = formatted.replace(
        /^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
        (_match, p1, p2, p3, p4, p5) => {
          let result = p1;
          if (p2) result += ` (${p2}`;
          if (p3) result += `) ${p3}`;
          if (p4) result += ` ${p4}`;
          if (p5) result += ` ${p5}`;
          return result;
        }
      );
    }

    return formatted;
  };

  const handlePhoneChange = (value: string, index: number | null = null) => {
    const formattedValue = formatPhoneNumber(value);

    if (index === null) {
      setFirstPhone(formattedValue);
    } else {
      setNewPhone((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, number: formattedValue } : item
        )
      );
    }
  };

  const cleanPhoneNumber = (formattedPhone: string) => {
    return formattedPhone.replace(/\D/g, "");
  };

  const turkeyCities: TurkeyCity[] = JSONDATA.map((city) => {
    return {
      province: city.name,
      districts: city.towns.map((district) => {
        return {
          district: district.name,
          quarters: district.districts.reduce<string[]>((acc, d) => {
            const quarterNames = d.quarters.map(
              (quarter) => quarter.name
            );
            return acc.concat(quarterNames);
          }, []),
        };
      }),
    };
  });

  const updateDistricts = (province: string) => {
    const selectedCity = turkeyCities.find(
      (city) => city.province === province
    );
    if (selectedCity) {
      setDistricts(selectedCity.districts || []);
    } else {
      setDistricts([]);
    }
    setQuarters([]);
  };

  const updateQuarters = (district: string) => {
    const selectedDistrict = districts.find(
      (dist) => dist.district === district
    );
    if (selectedDistrict) {
      setQuarters(selectedDistrict.quarters || []);
    } else {
      setQuarters([]);
    }
  };

  useEffect(() => {
    if (user) {
      const formattedPhones: PhoneEntry[] = user.phones
        ? user.phones.map((phone) => ({
            ...phone,
            number: formatPhoneNumber(phone.number ?? ""),
          }))
        : [];

      setNewUser({
        uid: String(user.uid ?? ""),
        image: user.image || "",
        name: user.name || "",
        lastname: user.surname || "",
        email: (typeof user.mail === "object" && user.mail !== null ? user.mail?.mail : typeof user.mail === "string" ? user.mail : "") || "",
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
        user.phones?.[0]?.number ? formatPhoneNumber(user.phones[0].number) : ""
      );
      setNewPhone(
        user.phones
          ? user.phones.slice(1).map((phone) => ({
              ...phone,
              number: formatPhoneNumber(phone.number ?? ""),
            }))
          : []
      );
      setFileName("");
      if (user.city) {
        updateDistricts(user.city);

        if (user.county) {
          const selectedCity = turkeyCities.find(
            (city) => city.province === user.city
          );
          if (selectedCity) {
            setDistricts(selectedCity.districts || []);
            const selectedDistrict = selectedCity.districts.find(
              (dist) => dist.district === user.county
            );
            if (selectedDistrict) {
              setQuarters(selectedDistrict.quarters || []);
            }
          }
        }
      }
    } else {
      setNewUser({ ...initialUser });
      setNewPhone([]);
      setFirstPhone("");
      setDistricts([]);
      setQuarters([]);
      setFileName("");
    }
  }, [user]);

  const userTypes = ["Mülk Sahibi", "Satınalan", "Kiralayan", "Özel Müşteri"];

  const handleClose = (shouldRefetch = false) => {
    setOpen({ open: false, user: null });
    setNewPhone([]);
    if (shouldRefetch && onSuccess) onSuccess();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanedFirstPhone = cleanPhoneNumber(firstPhone);
    const cleanedNewPhones = newPhone.map((phone) => ({
      ...phone,
      number: cleanPhoneNumber(phone.number ?? ""),
    }));

    const lastPhone = [
      {
        isAbleToSendSMS: newUser.isSmS,
        number: cleanedFirstPhone,
      },
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
      mail: {
        mail: newUser.email || "",
        isAbledToSendMail: true,
      },
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

    console.log("Güncellenecek veri:", payload);

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
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (selectedOption: SingleValue<ReactSelectOption>) => {
    const province = selectedOption?.value || "";
    setNewUser((prev) => ({
      ...prev,
      province: province,
      district: "",
      quarters: "",
    }));
    updateDistricts(province);
  };

  const handleDistrictChange = (selectedOption: SingleValue<ReactSelectOption>) => {
    const district = selectedOption?.value || "";
    setNewUser((prev) => ({
      ...prev,
      district: district,
      quarters: "",
    }));
    updateQuarters(district);
  };

  const handleQuarterChange = (selectedOption: SingleValue<ReactSelectOption>) => {
    const quarter = selectedOption?.value || "";
    setNewUser((prev) => ({
      ...prev,
      quarters: quarter,
    }));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={() => handleClose()}
    >
      <div
        className="bg-white w-full max-w-[540px] mx-4 max-h-[92vh] overflow-y-auto rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        style={PoppinsFont.style}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative px-6 pt-6 pb-5">
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <UserPen size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">Kullanıcıyı Düzenle</h2>
                <p className="text-xs text-black/38 mt-0.5">Kullanıcı bilgilerini güncelleyin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleClose()}
              className="p-2 text-black/30 hover:text-black/60 hover:bg-black/[0.04] rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">

          {/* ─ Section: Kişisel Bilgiler ─ */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Kişisel Bilgiler</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Ad & Soyad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Ad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  autoComplete="off"
                  placeholder="Ad"
                  className={`${inputBase} px-3 py-2.5`}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Soyad <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={newUser.lastname}
                  onChange={handleInputChange}
                  autoComplete="off"
                  placeholder="Soyad"
                  className={`${inputBase} px-3 py-2.5`}
                />
              </div>
            </div>

            {/* Cinsiyet */}
            <div>
              <label className={labelClass}>Cinsiyet</label>
              <div className="flex gap-3">
                {(["Erkek", "Kadın"] as const).map((g) => (
                  <label
                    key={g}
                    className={`flex-1 flex items-center justify-center gap-2 h-[42px] rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                      newUser.gender === g
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10"
                        : "border-black/8 bg-gray-50/50 text-black/40 hover:bg-gray-50 hover:text-black/60 hover:border-black/12"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={newUser.gender === g}
                      onChange={() => setNewUser((prev) => ({ ...prev, gender: g }))}
                      className="sr-only"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Müşteri Türü & Profil Resmi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Müşteri Türü <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none z-10" />
                  <Select
                    options={userTypes.map((type: string) => ({
                      value: type,
                      label: type,
                    }))}
                    value={
                      newUser.status
                        ? { value: newUser.status, label: newUser.status }
                        : null
                    }
                    styles={{
                      ...selectStyles,
                      control: (base, state) => ({
                        ...selectStyles.control(base as Record<string, unknown>, state),
                        paddingLeft: "1.75rem",
                      }),
                    }}
                    onChange={(selectedOption: SingleValue<ReactSelectOption>) => {
                      setNewUser((prev) => ({
                        ...prev,
                        status: selectedOption?.value || "",
                      }));
                    }}
                    placeholder="Tür seçin..."
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Profil Resmi</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      setNewUser((prev) => ({
                        ...prev,
                        image: file,
                      }));
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[42px] flex items-center gap-2.5 px-3 bg-gray-50 border border-black/12 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer text-left"
                >
                  <ImagePlus size={14} className="text-black/25 shrink-0" />
                  <span className={`text-xs truncate ${fileName ? "text-black/70" : "text-black/30"}`}>
                    {fileName || "Dosya seç..."}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ─ Section: İletişim ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">İletişim</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* E-posta */}
            <div>
              <label className={labelClass}>
                E-Posta <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="örn: yenigünemlak@gmail.com"
                  value={newUser.email}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className={`${inputBase} pl-9 pr-3 py-2.5`}
                />
              </div>
            </div>

            {/* Zorunlu Telefon */}
            <div>
              <label className={labelClass}>
                Telefon <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                <input
                  type="text"
                  name="phone"
                  placeholder="örn: 0 (555) 555 55 55"
                  value={firstPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlePhoneChange(e.target.value);
                  }}
                  autoComplete="off"
                  className={`${inputBase} pl-9 pr-3 py-2.5`}
                />
              </div>
            </div>

            {/* Ek Telefonlar */}
            {newPhone.map((phone, index) => (
              <div key={index}>
                <label className={labelClass}>
                  Ek {index + 2}. Telefon
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="örn: 0 (555) 555 55 55"
                      value={phone.number}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handlePhoneChange(e.target.value, index);
                      }}
                      autoComplete="off"
                      className={`${inputBase} pl-9 pr-3 py-2.5`}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setNewPhone((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="w-[42px] h-[42px] flex items-center justify-center bg-red-50 border border-red-200 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                    type="button"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            {/* Telefon Ekle + SMS İzni */}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-3.5 h-[36px] text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setNewPhone([
                    ...newPhone,
                    {
                      number: "",
                      isAbleToSendSMS: newUser.isSmS,
                    },
                  ]);
                }}
                type="button"
              >
                <Plus size={14} />
                Telefon Ekle
              </button>

              <label
                className={`flex items-center gap-2.5 px-3.5 h-[36px] rounded-lg border cursor-pointer transition-all text-xs font-medium ${
                  newUser.isSmS
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-black/8 bg-gray-50/50 text-black/40 hover:bg-gray-50 hover:border-black/12"
                }`}
              >
                <input
                  type="checkbox"
                  checked={newUser.isSmS}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, isSmS: e.target.checked }))}
                  name="isSmS"
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    newUser.isSmS ? "bg-blue-500 border-blue-500" : "border-black/20 bg-white"
                  }`}
                >
                  {newUser.isSmS && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                SMS İzni
              </label>
            </div>
          </div>

          {/* ─ Section: Kimlik Bilgileri ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Kimlik Bilgileri</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  TC Kimlik No <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="text"
                    name="turkish_id"
                    value={newUser.turkish_id}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="TC Kimlik No"
                    className={`${inputBase} pl-9 pr-3 py-2.5`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  Mernis No <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                  <input
                    type="text"
                    name="mernis_no"
                    value={newUser.mernis_no}
                    onChange={handleInputChange}
                    autoComplete="off"
                    placeholder="Mernis No"
                    className={`${inputBase} pl-9 pr-3 py-2.5`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─ Section: Adres Bilgileri ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Adres Bilgileri</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* İl / İlçe / Mahalle */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>İl</label>
                <Select
                  options={turkeyCities.map((city) => ({
                    value: city.province,
                    label: city.province,
                  }))}
                  value={
                    newUser.province
                      ? { value: newUser.province, label: newUser.province }
                      : null
                  }
                  styles={selectStyles}
                  onChange={handleProvinceChange}
                  placeholder="İl"
                  isClearable
                />
              </div>
              <div>
                <label className={labelClass}>İlçe</label>
                <Select
                  options={districts.map((dist) => ({
                    value: dist.district,
                    label: dist.district,
                  }))}
                  value={
                    newUser.district
                      ? { value: newUser.district, label: newUser.district }
                      : null
                  }
                  styles={selectStyles}
                  onChange={handleDistrictChange}
                  placeholder="İlçe"
                  isDisabled={!newUser.province}
                  isClearable
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Mahalle</label>
                <Select
                  options={quarters.map((quarter: string) => ({
                    value: quarter,
                    label: quarter,
                  }))}
                  value={
                    newUser.quarters
                      ? { value: newUser.quarters, label: newUser.quarters }
                      : null
                  }
                  styles={selectStyles}
                  onChange={handleQuarterChange}
                  placeholder="Mahalle"
                  isDisabled={!newUser.district}
                  isClearable
                />
              </div>
            </div>

            {/* Detaylı Adres */}
            <div>
              <label className={labelClass}>Detaylı Adres</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                <input
                  type="text"
                  name="address"
                  placeholder="örn: XXX Sokak, No: XX, Daire: XX, Kat: X"
                  value={newUser.address}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className={`${inputBase} pl-9 pr-3 py-2.5`}
                />
              </div>
            </div>
          </div>

          {/* ─ Section: Diğer Bilgiler ─ */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Diğer Bilgiler</span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Link */}
            <div>
              <label className={labelClass}>Link</label>
              <div className="relative">
                <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none" />
                <input
                  type="text"
                  name="owner_url"
                  value={newUser.owner_url}
                  onChange={handleInputChange}
                  autoComplete="off"
                  placeholder="örn: https://www.yenigunemlak.com"
                  className={`${inputBase} pl-9 pr-3 py-2.5`}
                />
              </div>
            </div>

            {/* Yetkili Notu */}
            <div>
              <label className={labelClass}>Yetkili Notu</label>
              <div className="relative">
                <MessageSquareText size={14} className="absolute left-3 top-3.5 text-black/25 pointer-events-none" />
                <textarea
                  name="comment"
                  value={newUser.comment}
                  onChange={handleInputChange}
                  autoComplete="off"
                  placeholder="Yetkili notu giriniz..."
                  className="w-full min-h-[84px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30 pl-9 pr-3 py-3 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-black/6">
            <button
              type="button"
              onClick={() => handleClose()}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-black/50 border border-black/10 rounded-xl hover:bg-black/[0.03] hover:text-black/70 transition-all"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 transition-all"
            >
              Kullanıcıyı Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
