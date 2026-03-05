// src/components/modals/CreateUsersModal/CreateUsersModal.tsx
"use client";

import React from "react";
import Select, { type SingleValue } from "react-select";
import { X, Trash2 } from "lucide-react";

import type { CreateUserModalProps, ReactSelectOption } from "./types";
import { useCreateUser } from "./useCreateUser";

const selectStyles = {
  control: (baseStyles: Record<string, unknown>) => ({
    ...baseStyles,
    border: "1px solid #FFB6C1",
    boxShadow: "none",
    "&:hover": { border: "1px solid #FFB6C1" },
  }),
};

export default function CreateUserModal({ open, setOpen, onSuccess }: CreateUserModalProps) {
  const {
    newUser, newPhone, loading, turkeyCities,
    handleCheckboxChange, handlePhoneChange, handleClose,
    handleChange, handleAddPhone, handleRemovePhone,
    handleGenderChange, handleStatusChange,
    handleProvinceChange, handleDistrictChange, handleQuarterChange,
    handleImageChange, handleSubmit,
  } = useCreateUser({ setOpen, onSuccess });

  if (!open) return null;

  const districtOptions = turkeyCities
    .find((city) => city.province === newUser.province)
    ?.districts.map((d) => ({ value: d.district, label: d.district })) ?? [];

  const quarterOptions = turkeyCities
    .find((city) => city.province === newUser.province)
    ?.districts.find((d) => d.district === newUser.district)
    ?.quarters.map((q) => ({ value: q, label: q })) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[350px] sm:w-[500px] max-h-[95vh] overflow-y-auto flex flex-col relative p-5 gap-3 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Yeni Kullanıcı Oluştur</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Ad Soyad */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Ad Soyad<span className="text-red-500">*</span></label>
            <div className="flex flex-row justify-between">
              <input type="text" name="name" value={newUser.name} onChange={handleChange} autoComplete="off" placeholder="Ad" className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100" />
              <input type="text" name="lastname" value={newUser.lastname} onChange={handleChange} autoComplete="off" placeholder="Soyad" className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100" />
            </div>
          </div>

          {/* Cinsiyet */}
          <div className="flex flex-row justify-start gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newUser.gender.selected === "Erkek"} onChange={() => handleGenderChange("Erkek")} className="w-4 h-4" />
              Erkek
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newUser.gender.selected === "Kadın"} onChange={() => handleGenderChange("Kadın")} className="w-4 h-4" />
              Kadın
            </label>
          </div>

          {/* E-Posta */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">E-Posta</label>
            <input type="email" name="email" value={newUser.email} placeholder="örn: yenigünemlak@gmail.com" onChange={handleChange} autoComplete="off" className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100" />
          </div>

          {/* Telefon */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Telefon<span className="text-red-500">*</span></label>
            <input type="text" name="phone" placeholder="örn: 0 (555) 555 55 55" onChange={(e) => handlePhoneChange(e.target.value)} value={newUser.phones[0]?.phone || ""} autoComplete="off" className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100" />
          </div>

          {/* Ek Telefonlar */}
          <div className="flex flex-col gap-2">
            <button className="bg-custom-orange hover:bg-custom-orange-dark duration-300 text-white rounded-md px-2 focus:outline-none py-2" onClick={handleAddPhone} type="button">
              + Telefon Ekle
            </button>
            {newPhone.map((phone, index) => (
              <div key={index} className="flex flex-col gap-2">
                <label className="font-medium">Ek {index + 2}. Telefon</label>
                <div className="flex flex-row gap-2">
                  <input type="text" placeholder="örn: 0 (555) 555 55 55" onChange={(e) => handlePhoneChange(e.target.value, index)} value={phone.phone} autoComplete="off" className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100 w-[90%]" />
                  <button onClick={() => handleRemovePhone(index)} className="bg-red-500 hover:bg-red-600 duration-300 text-white rounded-md px-2 focus:outline-none flex items-center justify-center">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SMS & Resim */}
          <div className="flex flex-col items-center sm:flex-row justify-between gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={newUser.isSmS} onChange={handleCheckboxChange} name="isSmS" className="w-4 h-4" />
              SMS İzni
            </label>
            <input type="file" name="image" accept=".jpg, .jpeg, .png" onChange={(e) => handleImageChange(e.target.files?.[0])} className="border border-gray-300 rounded-md p-1 w-full sm:w-auto focus:outline-none" aria-label="Resim Yükle" />
          </div>

          {/* Müşteri Türü */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Müşteri Türü<span className="text-red-500">*</span></label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              options={newUser.status.options.map((type) => ({ value: type, label: type }))}
              value={newUser.status.selected ? { value: newUser.status.selected, label: newUser.status.selected } : null}
              styles={selectStyles}
              onChange={(e: SingleValue<ReactSelectOption>) => { if (e) handleStatusChange(e.value); }}
            />
          </div>

          {/* Mülk Sahibi Linki */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Mülk Sahibi Linki</label>
            <input type="text" name="owner_url" value={newUser.owner_url} placeholder="örn: https://www.yenigunemlak.com/mulk-sahibi/123" onChange={handleChange} autoComplete="off" className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100" />
          </div>

          {/* TC / Mernis */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Kimlik No / Mernis No</label>
            <div className="flex flex-row justify-between">
              <input type="number" name="turkish_id" value={newUser.turkish_id} onChange={handleChange} autoComplete="off" placeholder="TC Kimlik No" className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100" />
              <input type="text" name="mernis_no" value={newUser.mernis_no} onChange={handleChange} autoComplete="off" placeholder="Mernis No" className="px-2 py-1 focus:outline-none border w-[49%] border-gray-300 rounded-md bg-gray-100" />
            </div>
          </div>

          {/* Tam Adres */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Tam Adres</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Select
                className="basic-single" classNamePrefix="select"
                options={turkeyCities.map((city) => ({ value: city.province, label: city.province }))}
                value={newUser.province ? { value: newUser.province, label: newUser.province } : null}
                styles={selectStyles}
                onChange={(e: SingleValue<ReactSelectOption>) => { if (e) handleProvinceChange(e.value); }}
              />
              <Select
                className="basic-single" classNamePrefix="select"
                options={districtOptions}
                value={newUser.district ? { value: newUser.district, label: newUser.district } : null}
                styles={selectStyles}
                noOptionsMessage={() => "İlk önce il seçiniz"}
                onChange={(e: SingleValue<ReactSelectOption>) => { if (e) handleDistrictChange(e.value); }}
              />
              <Select
                className="basic-single col-span-2 sm:col-span-1" classNamePrefix="select"
                options={quarterOptions}
                value={newUser.quarter ? { value: newUser.quarter, label: newUser.quarter } : null}
                styles={selectStyles}
                noOptionsMessage={() => "İlk önce ilçe seçiniz"}
                onChange={(e: SingleValue<ReactSelectOption>) => { if (e) handleQuarterChange(e.value); }}
              />
            </div>
            <input type="text" name="address" value={newUser.address} placeholder="örn: XXX Sokak, No: XX, Daire: XX, Kat: X" onChange={handleChange} autoComplete="off" className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100" />
          </div>

          {/* Yetkili Notu */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Yetkili Notu</label>
            <textarea name="note" value={newUser.note} onChange={handleChange} autoComplete="off" placeholder="Yetkili notu giriniz..." className="px-2 py-1 focus:outline-none border border-gray-300 rounded-md bg-gray-100" />
          </div>

          <button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 duration-300 py-2 text-white rounded-md mt-3 text-lg focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {loading ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
          </button>
        </form>
      </div>
    </div>
  );
}
