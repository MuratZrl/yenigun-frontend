// src/features/admin/emlak-archived-detail/ui/DetailsSection.tsx

import React from "react";
import DetailRow from "./DetailRow";
import type { AdvertData } from "../types";

type Props = {
  data: AdvertData;
};

export default function DetailsSection({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Detaylı Bilgiler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
        <DetailRow label="İlan No" value={data.uid} />
        <DetailRow label="Emlak Tipi" value={data.steps.first} />
        <DetailRow label="İlan Türü" value={data.steps.second} />
        <DetailRow label="Kontrat Süresi" value={data.contract.time || "1 Yıl"} />
        <DetailRow label="EIDS No" value={data.eidsNo} />
        <DetailRow
          label="EIDS Tarihi"
          value={data.eidsDate ? new Date(data.eidsDate).toLocaleDateString("tr-TR") : undefined}
        />
        <DetailRow label="Net m²" value={data.details.netArea} />
        <DetailRow label="Brüt m²" value={data.details.grossArea} />
        <DetailRow label="Oda Sayısı" value={data.details.roomCount} />
        <DetailRow label="Bina Yaşı" value={data.details.buildingAge} />
        <DetailRow label="Bulunduğu Kat" value={data.details.floor} />
        <DetailRow label="Kat Sayısı" value={data.details.totalFloor} />
        <DetailRow label="Isıtma" value={data.details.heating} />
        <DetailRow label="Banyo Sayısı" value={data.details.bathCount} />
        <DetailRow label="Balkon" value={data.details.balcony} />
        <DetailRow label="Eşyalı" value={data.details.furniture} />
        <DetailRow label="Asansör" value={data.details.elevator} />
        <DetailRow label="Site İçinde" value={data.details.inSite} />
        <DetailRow label="Balkon Sayısı" value={data.details.balconyCount} />
        <DetailRow label="Cephe" value={data.details.whichSide} />
        {data.steps.second?.includes("Satılık") && (
          <DetailRow label="Tapu Durumu" value={data.details.deed} />
        )}
      </div>
    </div>
  );
}