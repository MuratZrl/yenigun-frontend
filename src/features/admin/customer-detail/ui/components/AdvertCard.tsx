// src/features/admin/customer-detail/ui/components/AdvertCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Home, MapPin, Maximize, Eye, EyeOff } from "lucide-react";
import type { Advert } from "../../lib/types";

type Props = {
  advert: Advert;
  onClick: () => void;
};

export default function AdvertCard({ advert, onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const imageUrl =
    advert.photos?.find((photo: string) => typeof photo === "string" && photo.trim()) ||
    "/logo.png";
  const hasRealPhoto = imageUrl !== "/logo.png";

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden h-full hover:border-[#035DBA]/40 hover:shadow-md transition-all duration-300 ${
        !advert.active ? "opacity-75" : ""
      }`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {hasRealPhoto && !imgError ? (
          <Image
            src={imgError ? "/logo.png" : imageUrl}
            alt={advert.title}
            fill
            className={imgError ? "object-contain p-8 bg-gray-100" : "object-cover group-hover:scale-105 transition-transform duration-500"}
            style={{ filter: advert.active ? "none" : "blur(1.5px)" }}
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Image
              src="/logo.png"
              alt="Logo"
              width={70}
              height={56}
              className="h-14 w-auto object-contain opacity-40"
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-[#000066] text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
            {advert.fee} TL
          </span>
        </div>

        {/* Active/Passive badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg ${
              advert.active ? "bg-emerald-500/90" : "bg-red-500/90"
            }`}
          >
            {advert.active ? <Eye size={12} /> : <EyeOff size={12} />}
            {advert.active ? "Aktif" : "Pasif"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem] group-hover:text-[#035DBA] transition-colors">
          {advert.title}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1.5">
          <MapPin size={13} className="text-[#035DBA] shrink-0" />
          <span className="truncate">
            {advert.address.district}, {advert.address.province}
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
          {advert.details.roomCount && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-[#E9EEF7] flex items-center justify-center shrink-0">
                <Home size={12} className="text-[#035DBA]" />
              </div>
              <span className="font-medium">{advert.details.roomCount}</span>
            </div>
          )}
          {advert.details.netArea && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-[#E9EEF7] flex items-center justify-center shrink-0">
                <Maximize size={12} className="text-[#035DBA]" />
              </div>
              <span className="font-medium">{advert.details.netArea} m²</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
