// src/features/admin/emlak-archived/ui/ArchivedAdCard.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

import type { Advert } from "../types";
import { renderLocationSafely, renderAddressSafely } from "../utils/addressFormat";
import { hasValidPhotos, getFirstValidPhoto } from "../utils/photoHelpers";

type Props = {
  ad: Advert;
  onToggleActivity: (uid: string) => void;
  onDelete: (ad: Advert) => void;
  onAdminNote: (ad: Advert) => void;
  onUserNotes: (ad: Advert) => void;
};

export default function ArchivedAdCard({
  ad,
  onToggleActivity,
  onDelete,
  onAdminNote,
  onUserNotes,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const hasPhotos = hasValidPhotos(ad.photos);
  const firstPhoto = getFirstValidPhoto(ad.photos);
  const location = renderLocationSafely(ad.address);
  const address = renderAddressSafely(ad.address);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-custom-orange transition-colors overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {hasPhotos && !imgError ? (
          <Image
            src={firstPhoto || "/logo.png"}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={64}
              className="h-16 w-auto object-contain opacity-50"
            />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
            {ad.steps.second}/{ad.steps.first}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-3 right-3">
          <span className="bg-custom-orange text-white text-sm font-bold px-3 py-1 rounded-lg">
            {ad.fee}
          </span>
        </div>

        {/* Activity toggle */}
        <button
          onClick={() => onToggleActivity(ad.uid)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 hover:scale-110 transition-transform"
          title={ad.active ? "Arşivle" : "Arşivden Çıkar"}
        >
          {ad.active ? (
            <Eye size={16} className="text-green-500" />
          ) : (
            <EyeOff size={16} className="text-red-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <Link
          href={`/admin/emlak/archived/${ad.uid}`}
          className="block mb-2"
        >
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-custom-orange transition-colors">
            {ad.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <MapPin size={14} className="text-custom-orange shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Address */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{address}</p>

        {/* Customer + advisor info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} className="text-custom-orange shrink-0" />
            <span>
              {ad.customer.name} {ad.customer.surname}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={14} className="text-custom-orange shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {ad.customer?.phones?.slice(0, 2).map((phone, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 rounded px-1.5 py-0.5 text-xs"
                >
                  {phone.number
                    ? phone.number.startsWith("0") ? phone.number : `0${phone.number}`
                    : "Bulunamadı"}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} className="text-custom-orange shrink-0" />
            <span className={ad.advisor.name ? "" : "text-red-500"}>
              {ad.advisor.name
                ? `${ad.advisor.name} ${ad.advisor.surname}`
                : "Danışman Yok"}
            </span>
          </div>
        </div>

        {/* Admin note link */}
        {ad.adminNote && (
          <button
            onClick={() => onAdminNote(ad)}
            className="w-full text-left text-blue-600 hover:text-blue-700 text-sm mb-3 flex items-center gap-1 transition-colors"
          >
            <FileText size={14} />
            <span>Admin Notunu Gör</span>
          </button>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={`/admin/emlak/uid=${ad.uid}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
          >
            <Edit size={14} />
            Düzenle
          </Link>
          <button
            onClick={() => onDelete(ad)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
          >
            <Trash2 size={14} />
            Sil
          </button>
        </div>

        {/* User notes */}
        <button
          onClick={() => onUserNotes(ad)}
          className="w-full mt-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors text-sm font-medium"
        >
          <User size={14} />
          Kullanıcı Notları
        </button>
      </div>
    </div>
  );
}