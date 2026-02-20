// src/features/home/highlights/ui/HighlightMobileRow.client.tsx
"use client";

import React from "react";
import { Flame, MapPin, Bed, Bath } from "lucide-react";
import type { Listing } from "../types";
import {
  getAreaSqm,
  getFeeText,
  getFirstPhotoUrl,
  getLocationText,
} from "../utils/listingUtils";

type Props = {
  listing: Listing;
  onNavigate: (uid: string) => void;
};

export default function HighlightMobileRow({ listing, onNavigate }: Props) {
  const imgSrc = getFirstPhotoUrl(listing) || "/logo.png";
  const feeText = getFeeText(listing.fee) ?? "Fiyat Yok";
  const locationText = getLocationText(listing);
  const areaSqm = getAreaSqm(listing);

  const bedrooms = listing.features?.bedrooms;
  const bathrooms = listing.features?.bathrooms;

  return (
    <div
      onClick={() => onNavigate(listing.uid)}
      className="cursor-pointer flex overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm
                 active:border-indigo-200 transition-all duration-200"
      aria-label={listing.title || "İlan"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate(listing.uid);
      }}
    >
      {/* Left: Image */}
      <div className="relative w-32 shrink-0">
        <img
          src={imgSrc}
          alt={listing.title || "İlan görseli"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
            e.currentTarget.alt = "Logo";
            e.currentTarget.className =
              "absolute inset-0 w-full h-full object-contain p-4 bg-gray-50";
          }}
        />

        {listing.isHighlight && (
          <div className="absolute top-1.5 left-1.5">
            <span className="inline-flex items-center gap-0.5 py-0.5 px-1.5 rounded-md bg-orange-500 text-white text-[9px] font-semibold">
              <Flame size={8} />
              Öne Çıkan
            </span>
          </div>
        )}
      </div>

      {/* Right: Info */}
      <div className="flex-1 p-2.5 flex flex-col justify-between min-w-0">
        <div>
          <div className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
            {listing.title || "Başlık Yok"}
          </div>

          <div className="mt-1 flex items-center gap-1 min-w-0">
            <MapPin className="text-gray-400 shrink-0" size={10} />
            <span className="text-[10px] text-gray-500 truncate">
              {locationText}
            </span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="inline-block py-0.5 px-2 rounded-md bg-indigo-900 text-white text-[11px] font-bold">
            {feeText}
          </span>

          <div className="flex items-center gap-1">
            {areaSqm ? (
              <span className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md">
                {areaSqm}m²
              </span>
            ) : null}
            {bedrooms ? (
              <span className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Bed size={8} />{bedrooms}
              </span>
            ) : null}
            {bathrooms ? (
              <span className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Bath size={8} />{bathrooms}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
