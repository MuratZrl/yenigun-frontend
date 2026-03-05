// src/features/category-detail/ui/components/AdvertCardMobile.client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Calendar, User } from "lucide-react";
import { Advert } from "@/types/search";
import { getM2Text, formatDate, hasValidImage, LOGO_URL } from "../../utils";

interface AdvertCardMobileProps {
  advert: Advert;
}

export default function AdvertCardMobile({ advert }: AdvertCardMobileProps) {
  const ad = advert;
  const [imgError, setImgError] = useState(false);
  const m2Text = getM2Text(ad);
  const room =
    ad?.details?.roomCount ||
    ad?.featureValues?.find((f: { name?: string; value?: string | number }) =>
      f?.name?.toLowerCase().includes("oda"),
    )?.value ||
    "";

  const locationText = ad?.address?.province
    ? `${ad.address.province}${ad.address?.district ? ` / ${ad.address.district}` : ""}`
    : "Lokasyon yok";

  return (
    <Link href={`/ads/${ad.uid}`} className="group block md:hidden">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50 transition-colors">
        <div className="flex gap-3 p-3">
          <div className="relative w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
            {hasValidImage(advert) && !imgError ? (
              <Image
                src={imgError ? LOGO_URL : ad.photos[0]}
                alt={ad.title || "İlan görseli"}
                fill
                className={imgError ? "object-contain p-2" : "object-cover"}
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

          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-blue-700 line-clamp-2">
              {ad.title || "İsimsiz İlan"}
            </div>

            <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-600">
              {ad.steps?.second && (
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {ad.steps.second}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-gray-100">
                {m2Text || "-"}
              </span>
              <span className="px-2 py-0.5 rounded bg-gray-100">
                {room || "-"} Oda
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-gray-600 truncate max-w-[55%]">
                {locationText}
              </div>
              <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                {ad.fee || "Fiyat Yok"}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(ad.created?.createdTimestamp)}
              </span>

              {ad.advisor && (
                <span className="flex items-center gap-1 truncate max-w-[45%]">
                  <User className="w-3 h-3" />
                  {ad.advisor.name} {ad.advisor.surname}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
