"use client";

import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { Advert, FilterState } from "@/types/advert";

type Props = {
  adverts: Advert[];
  filters: FilterState;
};

export default function AdsMap({ adverts, filters }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: apiKey,
  });

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions | undefined>(undefined);

  useEffect(() => {
    fetch("/mapOptions.json")
      .then((r) => r.json())
      .then((json) => setMapOptions(json))
      .catch(() => setMapOptions({}));
  }, []);

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 39.0, lng: 35.0 });
  const [zoom, setZoom] = useState<number>(6);

  useEffect(() => {
    if (!isLoaded) return;

    const parts = [
      (filters as any)?.quarter && (filters as any)?.quarter !== "Hepsi" ? (filters as any)?.quarter : null,
      (filters as any)?.district && (filters as any)?.district !== "Hepsi" ? (filters as any)?.district : null,
      (filters as any)?.location && (filters as any)?.location !== "Hepsi" ? (filters as any)?.location : null,
      "Türkiye",
    ].filter(Boolean);

    const query = parts.join(", ");
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: query }, (results, status) => {
      if (status !== "OK" || !results?.[0]) return;
      const loc = results[0].geometry.location;
      setCenter({ lat: loc.lat(), lng: loc.lng() });

      const q = (filters as any)?.quarter;
      const d = (filters as any)?.district;
      const l = (filters as any)?.location;
      if (q && q !== "Hepsi") setZoom(13);
      else if (d && d !== "Hepsi") setZoom(11);
      else if (l && l !== "Hepsi") setZoom(9);
      else setZoom(6);
    });
  }, [isLoaded, filters]);

  const points = useMemo(() => {
    return adverts
      .map((ad: any) => {
        const lat = ad?.address?.lat ?? ad?.lat ?? null;
        const lng = ad?.address?.lng ?? ad?.lng ?? null;
        if (typeof lat !== "number" || typeof lng !== "number") return null;
        return { id: ad.uid, pos: { lat, lng } as google.maps.LatLngLiteral };
      })
      .filter(Boolean) as Array<{ id: string; pos: google.maps.LatLngLiteral }>;
  }, [adverts]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY yok. Harita çizilemez.
      </div>
    );
  }

  if (!isLoaded) return <div className="w-full h-full animate-pulse bg-gray-100" />;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={zoom}
      options={mapOptions}
    >
      {points.map((p) => (
        <Marker key={p.id} position={p.pos} />
      ))}
    </GoogleMap>
  );
}
