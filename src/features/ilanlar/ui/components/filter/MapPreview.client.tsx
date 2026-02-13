// src/features/ads/ui/components/filter/MapPreview.client.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FilterState } from "@/types/advert";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

type Props = {
  filters: FilterState;
  href?: string;
  heightClassName?: string;
};

export default function MapPreview({
  filters,
  href = "/ilanlar?view=map",
  heightClassName = "h-[120px]",
}: Props) {
  const router = useRouter();

  // ✅ JS API key (Embed değil)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: apiKey,
  });

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions | null>(null);

  useEffect(() => {
    // ✅ public/mapOptions.json
    fetch("/mapOptions.json")
      .then((r) => r.json())
      .then((json) => setMapOptions(json))
      .catch((e) => {
        console.error("mapOptions.json okunamadı:", e);
        setMapOptions({}); // map yine render etsin
      });
  }, []);

  // Embed’de query ile konum “otomatik” geliyordu.
  // JS API’de adresi koordinata çevirmek için geocoding gerekir.
  // Şimdilik TR merkez, sonra map view sayfasında geocode/marker eklersin.
  const center = useMemo(() => {
    const loc = (filters as any)?.location;
    // İstersen burada il bazlı center map’i kendin maplersin.
    // Şimdilik Türkiye ortası:
    return { lat: 39.0, lng: 35.0 };
  }, [filters]);

  const zoom = useMemo(() => {
    const loc = (filters as any)?.location;
    const dist = (filters as any)?.district;
    const q = (filters as any)?.quarter;
    if (q && q !== "Hepsi") return 13;
    if (dist && dist !== "Hepsi") return 11;
    if (loc && loc !== "Hepsi") return 8;
    return 5;
  }, [filters]);

  return (
    <div className={`relative w-full ${heightClassName} border border-gray-200 bg-gray-50 overflow-hidden`}>
      {!apiKey ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 px-3 text-center">
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY yok. JS map çizmem için bu key lazım.
        </div>
      ) : !isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-gray-100" />
      ) : (
        <GoogleMap
          mapContainerClassName="absolute inset-0 w-full h-full"
          center={center}
          zoom={zoom}
          options={mapOptions ?? undefined}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          onClick={() => router.push(href)}
          className="pointer-events-auto flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2"
          style={{ borderRadius: 2 }}
        >
          <MapPin size={18} className="text-red-500" />
          <span className="text-blue-700 font-semibold text-sm">Harita Görünümü</span>
        </button>
      </div>
    </div>
  );
}
