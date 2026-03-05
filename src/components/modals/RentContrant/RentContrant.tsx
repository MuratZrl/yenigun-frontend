// src/components/modals/RentContrant/RentContrant.tsx
"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { X, User, MapPin, FileText, CreditCard, Home } from "lucide-react";

import type { RentContractProps } from "./types";
import { useRentContract } from "./useRentContract";
import { FormSection } from "./FormSection";
import { ContractField } from "./ContractField";

const PoppinsFont = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export default function RentContract({ open, setOpen }: RentContractProps) {
  const {
    contract, demirbasInput, setDemirbasInput,
    handleChange, handleClose, handleSubmit,
    handleAddDemirbas, handleRemoveDemirbas,
  } = useRentContract({ setOpen });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b bg-[#f0f0f0] w-full max-w-[900px] h-[95vh] overflow-y-auto flex flex-col rounded-xl relative"
        style={PoppinsFont.style}
      >
        {/* Header */}
        <div className="flex flex-row justify-between items-center py-3 px-5 bg-custom-orange sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-white">Kira Sözleşmesi</h2>
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={handleClose} type="button">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Genel Bilgiler */}
          <FormSection icon={User} title="Genel Bilgiler" gridCols="grid-cols-3">
            <ContractField label="Kiraya Veren Ad/Soyad" name="renter" part="part_1" value={contract.part_1.renter} onChange={handleChange} />
            <ContractField label="Kiraya Veren Adres" name="renterAddress" part="part_1" value={contract.part_1.renterAddress} onChange={handleChange} colSpan="col-span-2" />
            <ContractField label="Kiracı Ad/Soyad" name="tenant" part="part_1" value={contract.part_1.tenant} onChange={handleChange} />
            <ContractField label="Kiracı Adres" name="tenantAddress" part="part_1" value={contract.part_1.tenantAddress} onChange={handleChange} colSpan="col-span-2" />
            <ContractField label="Kefil Ad/Soyad" name="guarantor" part="part_1" value={contract.part_1.guarantor} onChange={handleChange} />
            <ContractField label="Kefil Adres" name="guarantorAddress" part="part_1" value={contract.part_1.guarantorAddress} onChange={handleChange} colSpan="col-span-2" />
          </FormSection>

          {/* Kiralanan Yer Bilgileri */}
          <FormSection icon={Home} title="Kiralanan Yer Bilgileri">
            <ContractField label="İl" name="city" part="part_1" value={contract.part_1.city} onChange={handleChange} colSpan="col-span-3" />
            <ContractField label="İlçe" name="county" part="part_1" value={contract.part_1.county} onChange={handleChange} colSpan="col-span-3" />
            <ContractField label="Mahalle" name="neighbourhood" part="part_1" value={contract.part_1.neighbourhood} onChange={handleChange} />
            <ContractField label="Cadde" name="mainstreet" part="part_1" value={contract.part_1.mainstreet} onChange={handleChange} />
            <ContractField label="Sokak" name="street" part="part_1" value={contract.part_1.street} onChange={handleChange} />
            <ContractField label="Daire No" name="doorNumber" part="part_1" value={contract.part_1.doorNumber} onChange={handleChange} />
            <ContractField label="Kapı No" name="apartmentNumber" part="part_1" value={contract.part_1.apartmentNumber} onChange={handleChange} />
            <ContractField label="Kiralanan Yer Cinsi" name="rentalType" part="part_1" value={contract.part_1.rentalType} onChange={handleChange} />
          </FormSection>

          {/* Genel Ödeme Bilgileri */}
          <FormSection icon={CreditCard} title="Genel Ödeme Bilgileri">
            <ContractField label="Aylık Kira Bedeli" name="monthlyRent" part="part_2" value={contract.part_2.monthlyRent} onChange={handleChange} type="number" />
            <ContractField label="Yıllık Kira Bedeli" name="yearlyRent" part="part_2" value={contract.part_2.yearlyRent} onChange={handleChange} type="number" />
            <ContractField label="Ödeme Şekli" name="paymentType" part="part_2" value={contract.part_2.paymentType} onChange={handleChange} />
            <ContractField label="Kira Müddeti" name="rentalPeriod" part="part_2" value={contract.part_2.rentalPeriod} onChange={handleChange} />
            <ContractField label="Kira Başlangıç Tarihi" name="rentalStartDate" part="part_2" value={contract.part_2.rentalStartDate} onChange={handleChange} type="date" />
            <ContractField label="Teslim Durumu" name="deliveryStatus" part="part_2" value={contract.part_2.deliveryStatus} onChange={handleChange} />
            <ContractField label="Kullanım Amacı" name="usagePurpose" part="part_2" value={contract.part_2.usagePurpose} onChange={handleChange} colSpan="col-span-6" />
          </FormSection>

          {/* Koşullar ve Demirbaşlar */}
          <FormSection icon={FileText} title="Koşullar ve Demirbaşlar">
            <div className="flex flex-col gap-2 col-span-6 shrink-0">
              <label className="text-sm">
                Teslim Alınan Demirbaşlar <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-row mx-auto gap-2">
                <input
                  type="number"
                  name="quantity"
                  className="border border-gray-500 bg-transparent p-2 w-16 rounded"
                  placeholder="Adet"
                  min={1}
                  value={demirbasInput.quantity}
                  onChange={(e) => setDemirbasInput({ ...demirbasInput, quantity: Number(e.target.value) })}
                />
                <div className="flex items-end">Adet</div>
                <input
                  type="text"
                  name="name"
                  className="border border-gray-500 bg-transparent p-2 rounded flex-1"
                  placeholder="Demirbaş Adı"
                  value={demirbasInput.name}
                  onChange={(e) => setDemirbasInput({ ...demirbasInput, name: e.target.value })}
                />
                <button className="bg-custom-orange text-white py-2 px-4 rounded hover:bg-custom-orange-dark transition-colors" onClick={handleAddDemirbas} type="button">
                  Demirbaş Ekle
                </button>
              </div>
              <div className="flex flex-col mt-3 gap-2">
                {contract.part_3.teslimAlinanDemirbaslar.map((item, index) => (
                  <div className="flex flex-row gap-2 items-center" key={index}>
                    {index + 1}.<p>{item}</p>
                    <button className="text-red-500 underline hover:text-red-700" onClick={() => handleRemoveDemirbas(index)} type="button">
                      (Demirbaşı Sil)
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col col-span-6 gap-2">
              <label className="text-sm">
                Özel Koşullar <span className="text-red-500">*</span>
              </label>
              <textarea
                name="specialConditions"
                className="border border-gray-500 bg-transparent p-2 rounded h-24"
                value={contract.part_3.specialConditions}
                onChange={(e) => handleChange(e, "part_3")}
              />
            </div>
          </FormSection>

          {/* Ödeme Yükümlülükleri */}
          <FormSection icon={CreditCard} title="Ödeme Yükümlülükleri">
            <ContractField label="Kira Depozitosu" name="rentalDeposit" part="part_4" value={contract.part_4.rentalDeposit} onChange={handleChange} type="number" />
            <ContractField label="Site Aidatı" name="siteFee" part="part_4" value={contract.part_4.siteFee} onChange={handleChange} type="number" />
            <ContractField label="Diğer Ücretler" name="otherFees" part="part_4" value={contract.part_4.otherFees} onChange={handleChange} type="number" />
            <ContractField label="Kira Hesap Numarası" name="rentalAccountNumber" part="part_4" value={contract.part_4.rentalAccountNumber} onChange={handleChange} colSpan="col-span-4" />
            <ContractField label="Gecikme Faizi" name="delayedPaymentInterest" part="part_4" value={contract.part_4.delayedPaymentInterest} onChange={handleChange} />
            <ContractField label="Teminat Senedi" name="suretyBond" part="part_4" value={contract.part_4.suretyBond} onChange={handleChange} colSpan="col-span-6" />
          </FormSection>

          {/* Diğer Bilgiler */}
          <FormSection icon={MapPin} title="Diğer Bilgiler">
            <ContractField label="Sözleşme Başlangıç Tarihi" name="contractStartDate" part="part_5" value={contract.part_5.contractStartDate} onChange={handleChange} type="date" colSpan="col-span-3" />
            <ContractField label="Sözleşme Bitiş Tarihi" name="contractEndDate" part="part_5" value={contract.part_5.contractEndDate} onChange={handleChange} type="date" colSpan="col-span-3" />
            <ContractField label="Damga Vergisi" name="stampDuty" part="part_5" value={contract.part_5.stampDuty} onChange={handleChange} colSpan="col-span-3" />
            <ContractField label="Bildirim Adresi" name="notificationAddress" part="part_5" value={contract.part_5.notificationAddress} onChange={handleChange} colSpan="col-span-3" />
            <ContractField label="Yetkili Mahkeme" name="competentCourt" part="part_5" value={contract.part_5.competentCourt} onChange={handleChange} colSpan="col-span-6" />
          </FormSection>
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-[#f0f0f0] p-4 border-t">
          <button className="bg-custom-orange w-full shadow-xl text-white py-3 px-5 rounded-md hover:bg-custom-orange-dark transition-colors font-semibold" type="submit">
            Sözleşmeyi Oluştur
          </button>
        </div>
      </form>
    </div>
  );
}
