// src/features/admin/emlak-list/ui/AdvertListAdCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Edit,
  Trash2,
  User,
  Users,
  Phone,
  MapPin,
  FileText,
  Printer,
} from "lucide-react";

import type { Advert } from "../types";
import { renderLocationSafely, renderAddressSafely } from "../../listing-archived/utils/addressFormat";
import { hasValidPhotos, getFirstValidPhoto } from "../../listing-archived/utils/photoHelpers";
import { printAdvert } from "../utils/printAdvert";

type Props = {
  ad: Advert;
  onToggleActivity: (uid: string) => void;
  onDelete: (ad: Advert) => void;
  onAdminNote: (ad: Advert) => void;
  onUserNotes: (ad: Advert) => void;
};

export default function AdvertListAdCard({
  ad,
  onToggleActivity,
  onDelete,
  onAdminNote,
  onUserNotes,
}: Props) {
  const hasPhotos = hasValidPhotos(ad.photos);
  const firstPhoto = getFirstValidPhoto(ad.photos);
  const location = renderLocationSafely(ad.address);
  const address = renderAddressSafely(ad.address);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 hover:border-[#035DBA]/40 hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
        {hasPhotos ? (
          <img
            src={firstPhoto || ""}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
              e.currentTarget.className =
                "w-full h-full object-contain p-8 bg-gray-100";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 object-contain opacity-50"
            />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#000066]/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-lg">
            {ad.steps.second}/{ad.steps.first}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/95 backdrop-blur-sm text-[#000066] text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
            {ad.fee}
          </span>
        </div>

        {/* Activity toggle */}
        <button
          onClick={() => onToggleActivity(ad.uid)}
          className={`absolute top-3 right-3 backdrop-blur-sm rounded-lg p-1.5 transition-all duration-200 hover:scale-110 ${
            ad.active
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {ad.active ? (
            <Eye size={16} />
          ) : (
            <EyeOff size={16} />
          )}
        </button>
      </div>

      {/* Content — grows to fill, pushes actions to bottom */}
      <div className="flex flex-col flex-1 p-4">
        {/* Top info section */}
        <div className="flex-1">
          {/* Title — fixed 2-line height */}
          <Link href={`/ads/${ad.uid}`} className="block mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem] hover:text-[#035DBA] transition-colors">
              {ad.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-1.5">
            <MapPin size={14} className="text-[#035DBA] shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Address — fixed 1-line */}
          <p className="text-gray-400 text-xs mb-3 line-clamp-1">{address}</p>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-3" />

          {/* Customer + advisor info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 rounded-md bg-[#035DBA]/10 flex items-center justify-center shrink-0">
                <User size={12} className="text-[#035DBA]" />
              </div>
              {ad.customer.uid ? (
                <Link
                  href={`/admin/customers/${ad.customer.uid}`}
                  className="truncate hover:text-[#035DBA] hover:underline underline-offset-2 transition-colors"
                >
                  {ad.customer.name} {ad.customer.surname}
                </Link>
              ) : (
                <span className="truncate">
                  {ad.customer.name} {ad.customer.surname}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 rounded-md bg-[#035DBA]/10 flex items-center justify-center shrink-0">
                <Phone size={12} className="text-[#035DBA]" />
              </div>
              <div className="flex gap-1 flex-wrap">
                {ad.customer?.phones?.slice(0, 2).map((phone, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5 text-xs text-gray-600"
                  >
                    {phone.number
                      ? phone.number.startsWith("0") ? phone.number : `0${phone.number}`
                      : "Bulunamadı"}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 rounded-md bg-[#035DBA]/10 flex items-center justify-center shrink-0">
                <Users size={12} className="text-[#035DBA]" />
              </div>
              <span className={ad.advisor.name ? "truncate" : "text-red-500 text-xs"}>
                {ad.advisor.name || "Danışman Yok"} {ad.advisor.surname}
              </span>
            </div>
          </div>

          {/* Admin note link */}
          {ad.adminNote && (
            <button
              onClick={() => onAdminNote(ad)}
              className="w-full text-left text-[#035DBA] hover:text-[#000066] text-sm mt-3 flex items-center gap-1.5 transition-colors"
            >
              <FileText size={14} />
              <span className="font-medium">Admin Notunu Gör</span>
            </button>
          )}
        </div>

        {/* Actions — always at the bottom */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <div className="flex gap-2">
            <Link
              href={`/admin/emlak/${ad.uid}`}
              className="flex-1 bg-[#035DBA] hover:bg-[#000066] text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-sm font-medium"
            >
              <Edit size={14} />
              Düzenle
            </Link>
            <button
              onClick={() => onDelete(ad)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-sm font-medium"
            >
              <Trash2 size={14} />
              Sil
            </button>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onUserNotes(ad)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-sm font-medium"
            >
              <Users size={14} />
              Kullanıcı Notları
            </button>
            <button
              onClick={() => printAdvert(ad)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center transition-colors"
              title="Yazdır"
            >
              <Printer size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
