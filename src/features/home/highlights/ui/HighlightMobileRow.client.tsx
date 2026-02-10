// src/features/home/highlights/ui/HighlightMobileRow.client.tsx
"use client";

import React from "react";
import { Flame, MapPin } from "lucide-react";
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
      className="cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-md active:scale-[0.99] transition"
      aria-label={listing.title || "İlan"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onNavigate(listing.uid);
      }}
    >
      {/* ÜST: Görsel + overlay */}
      <div className="relative aspect-[4/3]">
        <img
          src={imgSrc}
          alt={listing.title || "İlan görseli"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
            e.currentTarget.alt = "Logo";
            e.currentTarget.className =
              "absolute inset-0 w-full h-full object-contain p-10 bg-gray-100";
          }}
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* Öne çıkan */}
        {listing.isHighlight ? (
          <div className="absolute top-3 left-3">
            <div className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-semibold shadow">
              <Flame size={12} />
              <span>Öne Çıkan</span>
            </div>
          </div>
        ) : null}

        {/* Fiyat */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-flex max-w-full py-1.5 px-3 rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold shadow">
            <span className="truncate">{feeText}</span>
          </div>
        </div>
      </div>

      {/* ALT: Bilgi */}
      <div className="p-3">
        <div className="text-sm font-bold text-gray-900 line-clamp-2">
          {listing.title || "Başlık Yok"}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 min-w-0">
          <MapPin size={14} className="shrink-0 text-gray-500" />
          <span className="truncate">{locationText}</span>
        </div>

        {/* küçük meta satırı */}
        {(areaSqm || bedrooms || bathrooms) ? (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-600">
            {areaSqm ? <span>{areaSqm} m²</span> : null}
            {bedrooms ? <span>• {bedrooms} oda</span> : null}
            {bathrooms ? <span>• {bathrooms} banyo</span> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
