// src/features/admin/emlak-archived-detail/ui/LocationSection.tsx

"use client";

import React from "react";
import { MapPin } from "lucide-react";
import MapComponent from "@/components/ui/MapComponnet";
import type { AdvertData } from "../types";
import { getAddressText } from "../utils/helpers";

type Props = {
  address: AdvertData["address"];
};

export default function LocationSection({ address }: Props) {
  const addressText = getAddressText(address);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Konum</h2>
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-start gap-3">
          <MapPin className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Tam Adres</p>
            <p className="text-sm text-gray-600 leading-relaxed">{addressText}</p>
          </div>
        </div>
      </div>
      <MapComponent
        lat={address?.mapCoordinates?.lat}
        lng={address?.mapCoordinates?.lng}
        address={addressText}
      />
    </div>
  );
}