// src/features/category-detail/ui/components/AdvertListDesktop.client.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Advert } from "@/types/search";
import { getM2Compact, formatShortDate, hasValidImage, LOGO_URL } from "../../utils";

interface AdvertListDesktopProps {
  adverts: Advert[];
}

function AdvertRowImage({ advert }: { advert: Advert }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = hasValidImage(advert) && !imgError;

  return (
    <div className="w-[92px] h-16 bg-gray-100 rounded-md overflow-hidden relative">
      {showPhoto ? (
        <Image
          src={advert.photos[0]}
          alt={advert.title || "İlan görseli"}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          unoptimized
        />
      ) : (
        <Image
          src={LOGO_URL}
          alt="Logo"
          fill
          className="object-contain p-2 opacity-70"
        />
      )}
    </div>
  );
}

export default function AdvertListDesktop({ adverts }: AdvertListDesktopProps) {
  return (
    <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[120px_1fr_120px_160px_140px_160px] bg-gray-50 border-b border-gray-200">
        <div className="px-4 py-3 text-xs font-semibold text-gray-700">
          {" "}
        </div>
        <div className="px-4 py-3 text-xs font-semibold text-gray-700">
          İlan Başlığı
        </div>
        <div className="px-4 py-3 text-xs font-semibold text-gray-700 text-center">
          m²
        </div>
        <div className="px-4 py-3 text-xs font-semibold text-gray-700 text-center">
          Fiyat
        </div>
        <div className="px-4 py-3 text-xs font-semibold text-gray-700 text-center">
          İlan Tarihi
        </div>
        <div className="px-4 py-3 text-xs font-semibold text-gray-700 text-center">
          İl / İlçe
        </div>
      </div>

      {/* Rows */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {adverts.map((advert, index) => {
          const m2Compact = getM2Compact(advert);
          const province = advert?.address?.province || "-";
          const district = advert?.address?.district || "-";
          const createdTs = advert?.created?.createdTimestamp;
          const dateText = formatShortDate(createdTs);
          const adType = advert?.steps?.second
            ? String(advert.steps.second).toUpperCase()
            : "";

          return (
            <Link
              href={`/ads/${advert.uid}`}
              key={advert.uid || index}
              className="group block"
            >
              <div className="grid grid-cols-[120px_1fr_120px_160px_140px_160px] items-stretch hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
                {/* Image */}
                <div className="px-4 py-4 border-r border-gray-200">
                  <AdvertRowImage advert={advert} />
                </div>

                {/* Title */}
                <div className="px-4 py-4 min-w-0 border-r border-gray-200">
                  <div className="text-[13px] font-bold text-blue-700 group-hover:underline line-clamp-2">
                    {(advert.title || "İsimsiz İlan").toUpperCase()}
                  </div>
                  {adType && (
                    <div className="mt-1 text-[12px] text-gray-500 font-medium">
                      {adType}
                    </div>
                  )}
                </div>

                {/* m² */}
                <div className="px-4 py-4 text-center text-sm text-gray-800 border-r border-gray-200 flex items-center justify-center">
                  {m2Compact}
                </div>

                {/* Price */}
                <div className="px-4 py-4 text-center border-r border-gray-200 flex items-center justify-center">
                  <div className="text-[14px] font-extrabold text-blue-700 whitespace-nowrap">
                    {advert.fee || "-"}
                  </div>
                </div>

                {/* Date */}
                <div className="px-4 py-4 text-center text-sm text-gray-800 whitespace-nowrap border-r border-gray-200 flex items-center justify-center">
                  {dateText}
                </div>

                {/* City / District */}
                <div className="px-4 py-4 text-center border-r-0 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-900 font-medium">
                    {province}
                  </div>
                  <div className="text-sm text-gray-700">{district}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
