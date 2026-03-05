// src/features/admin/users/ui/components/EditCustomerModal/EditCustomerModal.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import Select, { type SingleValue } from "react-select";
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

import type { EditUserModalProps, ReactSelectOption } from "./types";
import { USER_TYPES } from "./types";
import { inputBase, labelClass, sectionClass, selectStyles } from "./utils";
import useEditCustomer from "./useEditCustomer";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function EditCustomerModal({
  open,
  setOpen,
  user,
  onSuccess,
}: EditUserModalProps) {
  const {
    newUser,
    setNewUser,
    newPhone,
    firstPhone,
    districts,
    quarters,
    fileName,
    fileInputRef,
    turkeyCities,
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
  } = useEditCustomer({ user, setOpen, onSuccess });

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
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5">
          <div className="absolute top-0 left-6 right-6 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <UserPen size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-black/87">
                  Kullanıcıyı Düzenle
                </h2>
                <p className="text-xs text-black/38 mt-0.5">
                  Kullanıcı bilgilerini güncelleyin
                </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* ── Kişisel Bilgiler ── */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Kişisel Bilgiler
              </span>
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
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, gender: g }))
                      }
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
                <div className="relative">mi
                  <Users
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none z-10"
                  />
                  <Select
                    options={USER_TYPES.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    value={
                      newUser.status
                        ? {
                            value: newUser.status,
                            label: newUser.status,
                          }
                        : null
                    }
                    styles={{
                      ...selectStyles,
                      control: (base, state) => ({
                        ...selectStyles.control(
                          base as Record<string, unknown>,
                          state,
                        ),
                        paddingLeft: "1.75rem",
                      }),
                    }}
                    onChange={(
                      selectedOption: SingleValue<ReactSelectOption>,
                    ) => {
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
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[42px] flex items-center gap-2.5 px-3 bg-gray-50 border border-black/12 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer text-left"
                >
                  <ImagePlus size={14} className="text-black/25 shrink-0" />
                  <span
                    className={`text-xs truncate ${fileName ? "text-black/70" : "text-black/30"}`}
                  >
                    {fileName || "Dosya seç..."}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── İletişim ── */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                İletişim
              </span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* E-posta */}
            <div>
              <label className={labelClass}>
                E-Posta <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                />
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
                <Phone
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="örn: 0 (555) 555 55 55"
                  value={firstPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  autoComplete="off"
                  className={`${inputBase} pl-9 pr-3 py-2.5`}
                />
              </div>
            </div>

            {/* Ek Telefonlar */}
            {newPhone.map((phone, index) => (
              <div key={index}>
                <label className={labelClass}>Ek {index + 2}. Telefon</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="örn: 0 (555) 555 55 55"
                      value={phone.number}
                      onChange={(e) =>
                        handlePhoneChange(e.target.value, index)
                      }
                      autoComplete="off"
                      className={`${inputBase} pl-9 pr-3 py-2.5`}
                    />
                  </div>
                  <button
                    onClick={() => handleRemovePhone(index)}
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
                  handleAddPhone();
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
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      isSmS: e.target.checked,
                    }))
                  }
                  name="isSmS"
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    newUser.isSmS
                      ? "bg-blue-500 border-blue-500"
                      : "border-black/20 bg-white"
                  }`}
                >
                  {newUser.isSmS && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                SMS İzni
              </label>
            </div>
          </div>

          {/* ── Kimlik Bilgileri ── */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Kimlik Bilgileri
              </span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  TC Kimlik No <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                  />
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
                  <FileText
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                  />
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

          {/* ── Adres Bilgileri ── */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Adres Bilgileri
              </span>
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
                      ? {
                          value: newUser.province,
                          label: newUser.province,
                        }
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
                      ? {
                          value: newUser.district,
                          label: newUser.district,
                        }
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
                  options={quarters.map((quarter) => ({
                    value: quarter,
                    label: quarter,
                  }))}
                  value={
                    newUser.quarters
                      ? {
                          value: newUser.quarters,
                          label: newUser.quarters,
                        }
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
                <MapPin
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                />
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

          {/* ── Diğer Bilgiler ── */}
          <div className={`${sectionClass} mt-5`}>
            <div className="flex items-center gap-2 pb-1">
              <div className="h-px flex-1 bg-black/6" />
              <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                Diğer Bilgiler
              </span>
              <div className="h-px flex-1 bg-black/6" />
            </div>

            {/* Link */}
            <div>
              <label className={labelClass}>Link</label>
              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/25 pointer-events-none"
                />
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
                <MessageSquareText
                  size={14}
                  className="absolute left-3 top-3.5 text-black/25 pointer-events-none"
                />
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
}
