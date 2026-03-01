// src/features/admin/listing-edit/ui/components/EditAddressSection.tsx
"use client";

import React from "react";
import Select from "react-select";
import AdminGoogleMap from "@/components/layout/AdminGoogleMap";

import type { FormData, TurkeyCity } from "@/types/property";
import type { FormDataValue, MapMarker } from "../../model/types";
import { getSafeAddress } from "../../model/utils";

import Section from "./Section";
import FieldRow from "./FieldRow";
import { inputCls, selectStyles } from "./styles";

interface EditAddressSectionProps {
  fourthStep: FormData;
  updateFourthStep: (field: keyof FormData, value: FormDataValue) => void;
  turkeyCities: TurkeyCity[];
  marker: MapMarker[];
  setMarker: (m: MapMarker[]) => void;
  boundaryCoords: { lat: number; lng: number }[];
}

export default function EditAddressSection({ fourthStep, updateFourthStep, turkeyCities, marker, setMarker, boundaryCoords }: EditAddressSectionProps) {
  return (
    <Section title="Adres Bilgileri" defaultOpen={true}>
      <FieldRow label="İl" required>
        <Select
          options={turkeyCities.map((c) => ({ value: c.province, label: c.province }))}
          value={fourthStep.province ? { value: fourthStep.province, label: fourthStep.province } : null}
          onChange={(v) => updateFourthStep("province", v?.value ?? "")}
          placeholder="İl seçin"
          styles={selectStyles}
        />
      </FieldRow>

      <FieldRow label="İlçe" required>
        <Select
          options={turkeyCities.find((c) => c.province === fourthStep.province)?.districts?.map((d) => ({ value: d.district, label: d.district })) ?? []}
          value={fourthStep.district ? { value: fourthStep.district, label: fourthStep.district } : null}
          onChange={(v) => updateFourthStep("district", v?.value ?? "")}
          placeholder="İlçe seçin"
          noOptionsMessage={() => "Önce il seçin"}
          styles={selectStyles}
        />
      </FieldRow>

      <FieldRow label="Mahalle" required>
        <Select
          options={turkeyCities.find((c) => c.province === fourthStep.province)?.districts?.find((d) => d.district === fourthStep.district)?.quarters?.map((q) => ({ value: q, label: q })) ?? []}
          value={fourthStep.quarter ? { value: fourthStep.quarter, label: fourthStep.quarter } : null}
          onChange={(v) => updateFourthStep("quarter", v?.value ?? "")}
          placeholder="Mahalle seçin"
          noOptionsMessage={() => "Önce ilçe seçin"}
          styles={selectStyles}
        />
      </FieldRow>

      <FieldRow label="Adres">
        <input type="text" value={getSafeAddress(fourthStep.address)} onChange={e => updateFourthStep("address", e.target.value)} placeholder="Tam adres" className={inputCls} />
      </FieldRow>

      <FieldRow label="Parsel No">
        <input type="text" value={fourthStep.parsel || ""} onChange={e => updateFourthStep("parsel", e.target.value)} placeholder="Parsel numarası" className={inputCls} />
      </FieldRow>

      <div className="border border-gray-200 rounded-lg h-80 bg-gray-50 mt-2 overflow-hidden">
        <AdminGoogleMap markers={marker} setMarkers={setMarker} boundaryCoords={boundaryCoords} />
      </div>
    </Section>
  );
}
