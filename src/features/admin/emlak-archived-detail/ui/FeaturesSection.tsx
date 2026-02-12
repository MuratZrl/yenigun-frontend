// src/features/admin/emlak-archived-detail/ui/FeaturesSection.tsx

import React from "react";
import FeatureCard from "./FeatureCard";
import { FEATURE_ICONS } from "../types";
import type { AdvertData } from "../types";

type Props = {
  details: AdvertData["details"];
};

export default function FeaturesSection({ details }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Özellikler</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <FeatureCard icon={FEATURE_ICONS.area} label="Net m²" value={details.netArea} />
        <FeatureCard icon={FEATURE_ICONS.rooms} label="Oda Sayısı" value={details.roomCount} />
        <FeatureCard icon={FEATURE_ICONS.age} label="Bina Yaşı" value={details.buildingAge} />
        <FeatureCard icon={FEATURE_ICONS.floor} label="Bulunduğu Kat" value={details.floor} />
        <FeatureCard icon={FEATURE_ICONS.heating} label="Isıtma" value={details.heating} />
        <FeatureCard icon={FEATURE_ICONS.bathroom} label="Banyo Sayısı" value={details.bathCount || "1"} />
        <FeatureCard icon={FEATURE_ICONS.elevator} label="Asansör" value={details.elevator ? "Var" : "Yok"} />
        <FeatureCard icon={FEATURE_ICONS.balcony} label="Balkon" value={details.balcony ? "Var" : "Yok"} />
        <FeatureCard icon={FEATURE_ICONS.furniture} label="Eşyalı" value={details.furniture ? "Evet" : "Hayır"} />
        <FeatureCard icon={FEATURE_ICONS.site} label="Site İçinde" value={details.inSite ? "Evet" : "Hayır"} />
      </div>
    </div>
  );
}