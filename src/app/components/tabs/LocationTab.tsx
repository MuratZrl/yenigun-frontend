"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Hash } from "lucide-react";
import { FormData } from "@/app/types/property";
import Select from "react-select";
import SimpleInput from "@/app/components/ui/SimpleInput";
import AdminGoogleMap from "@/app/components/layout/AdminGoogleMap";

interface LocationTabProps {
  fourthStep: FormData;
  marker: any[];
  setMarker: (markers: any[]) => void;
  onProvinceChange: (value: any) => void;
  onDistrictChange: (value: any) => void;
  onQuarterChange: (value: any) => void;
  onAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onParselChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  turkeyCities: any[];
}

export default function LocationTab({
  fourthStep,
  marker,
  setMarker,
  onProvinceChange,
  onDistrictChange,
  onQuarterChange,
  onAddressChange,
  onParselChange,
  turkeyCities,
}: LocationTabProps) {
  const getSafeAddress = (address: any): string => {
    if (!address) return "";

    if (typeof address === "string") {
      return address;
    }

    if (typeof address === "object") {
      console.warn(
        "⚠️ Adres alanı obje içeriyor, string'e çevriliyor:",
        address
      );

      if (address.lat && address.lng) {
        return `Konum: ${address.lat}, ${address.lng}`;
      }

      return "";
    }

    return String(address);
  };

  React.useEffect(() => {
    console.log("🔍 Adres değeri:", fourthStep.address);
    console.log("🔍 Adres tipi:", typeof fourthStep.address);

    if (fourthStep.address && typeof fourthStep.address === "object") {
      console.log("🔍 Obje içeriği:", JSON.stringify(fourthStep.address));
    }
  }, [fourthStep.address]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Konum Bilgileri
          </h3>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              İl
            </label>
            <Select
              options={turkeyCities.map((city: any) => ({
                value: city.province,
                label: city.province,
              }))}
              value={{
                value: fourthStep.province,
                label: fourthStep.province,
              }}
              onChange={onProvinceChange}
              placeholder="İl seçin"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              İlçe
            </label>
            <Select
              options={turkeyCities
                .find((city: any) => city.province === fourthStep.province)
                ?.districts.map((district: any) => ({
                  value: district.district,
                  label: district.district,
                }))}
              value={{
                value: fourthStep.district,
                label: fourthStep.district,
              }}
              onChange={onDistrictChange}
              placeholder="İlçe seçin"
              noOptionsMessage={() => "İl seçiniz"}
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-900">
              Mahalle
            </label>
            <Select
              options={turkeyCities
                .find((city: any) => city.province === fourthStep.province)
                ?.districts.find(
                  (district: any) => district.district === fourthStep.district
                )
                ?.quarters.map((quarter: any) => ({
                  value: quarter,
                  label: quarter,
                }))}
              value={{
                value: fourthStep.quarter,
                label: fourthStep.quarter,
              }}
              onChange={onQuarterChange}
              placeholder="Mahalle seçin"
              noOptionsMessage={() => "İlçe seçiniz"}
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #D1D5DB",
                  borderRadius: "0.5rem",
                  padding: "0.25rem",
                }),
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Adres Bilgisi
          </h3>

          {/* Düzeltilmiş SimpleInput - [object Object] hatasını önler */}
          <SimpleInput
            label="Tam Adres"
            value={getSafeAddress(fourthStep.address)}
            onChange={onAddressChange}
            placeholder="Tam adres giriniz"
            icon={MapPin}
          />

          <SimpleInput
            label="Parsel No"
            value={fourthStep.parsel || ""}
            onChange={onParselChange}
            placeholder="Parsel numarası giriniz"
            icon={Hash}
          />
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-100 rounded-xl h-96 bg-gray-50">
        <AdminGoogleMap markers={marker} setMarkers={setMarker} />
      </div>
    </motion.div>
  );
}
