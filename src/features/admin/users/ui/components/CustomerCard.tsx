// src/features/admin/users/ui/components/CustomerCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Mail,
  Info,
  List,
  Edit,
  Trash2,
  IdCard,
  User as UserIcon,
} from "lucide-react";

import type { NormalizedCustomerUser } from "@/features/admin/users/model/types";
import { normalizePhoneForSearch, safeString } from "@/features/admin/users/model/utils";

type Props = {
  user: NormalizedCustomerUser;

  isExpanded: boolean;
  onToggleExpand: (uid: string | number) => void;

  onViewDetails: (uid: string | number) => void;
  onViewLists?: (uid: string | number) => void; // sadece Mülk Sahibi ise gösterilir
  onEdit: (uid: string | number) => void;
  onDelete: (uid: string | number, user: NormalizedCustomerUser) => void;
};

function genderBadge(gender?: string) {
  const g = safeString(gender).toLowerCase();
  const isMale = g === "male" || g === "erkek";
  const label = isMale ? "Erkek" : "Kadın";
  const cls = isMale
    ? "bg-blue-100 text-blue-800 border border-blue-200"
    : "bg-pink-100 text-pink-800 border border-pink-200";
  return { label, cls };
}

function statusBadge(status?: string) {
  const s = safeString(status).trim();
  if (s === "Mülk Sahibi") return { cls: "bg-emerald-100 text-emerald-700 border border-emerald-200", label: s };
  if (s === "Satınalan") return { cls: "bg-blue-100 text-blue-700 border border-blue-200", label: s };
  if (s === "Kiralayan") return { cls: "bg-amber-100 text-amber-700 border border-amber-200", label: s };
  return { cls: "bg-purple-100 text-purple-700 border border-purple-200", label: s || "-" };
}

function initials(name?: string, surname?: string) {
  const n = safeString(name).trim();
  const s = safeString(surname).trim();
  const a = n ? n[0].toUpperCase() : "";
  const b = s ? s[0].toUpperCase() : "";
  return (a + b) || "?";
}

function formatPhoneForUI(phone?: string) {
  // UI formatını projendeki formatPhoneNumber ile de yapabilirsin.
  // Burada en azından boşlukları temizliyoruz.
  const raw = safeString(phone);
  if (!raw) return "Yok";
  return raw;
}

export default function CustomerCard({
  user,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onViewLists,
  onEdit,
  onDelete,
}: Props) {
  const uid = user.uid;

  const gender = genderBadge(user.gender);
  const status = statusBadge(user.status);

  const mail = user.mail ? safeString(user.mail) : "";
  const phones = Array.isArray(user.phones) ? user.phones : [];
  const fullAddress = safeString(user.fulladdress);

  const canShowLists =
    safeString(user.status).trim() === "Mülk Sahibi" && typeof onViewLists === "function";

  // Extra (expanded) alanlar raw üstünden okunuyor çünkü normalize etmedik (ama var)
  const tc = safeString(user.raw?.tcNumber);
  const mernis = safeString(user.raw?.mernisNo);
  const country = safeString(user.raw?.country);
  const city = safeString(user.raw?.city);
  const county = safeString(user.raw?.county);
  const neighbourhood = safeString(user.raw?.neighbourhood);
  const ideas = safeString(user.raw?.ideasAboutCustomer);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {user.profilePicture ? (
              <Image
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full shrink-0"
                alt={`${safeString(user.name)} ${safeString(user.surname)}`}
                src={user.profilePicture}
              />
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {initials(user.name, user.surname)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {safeString(user.fullName) || `${safeString(user.name)} ${safeString(user.surname)}`.trim() || "-"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {mail || "-"}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleExpand(uid)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isExpanded ? "Detayları gizle" : "Detayları göster"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${gender.cls}`}>
              {gender.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Phones */}
        <div className="space-y-2">
          {phones.length === 0 ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>Yok</span>
              </div>
            </div>
          ) : (
            phones.map((p, idx) => {
              const num = safeString(p.number);
              const digits = normalizePhoneForSearch(num);
              const hasSms = Boolean(p.isAbleToSendSMS);
              return (
                <div key={`${digits || idx}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 min-w-0">
                    <Phone size={14} className="shrink-0" />
                    <span className="truncate">{formatPhoneForUI(num)}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      hasSms ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {hasSms ? "SMS Aktif" : "SMS Pasif"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{fullAddress || "-"}</span>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewDetails(uid)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
              title="Detaylar"
            >
              <Info size={16} />
            </button>

            {canShowLists && (
              <button
                onClick={() => onViewLists?.(uid)}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"
                title="Listeler"
              >
                <List size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(uid)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              title="Düzenle"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(uid, user)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Detaylı Bilgiler</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <IdCard size={14} className="text-gray-400" />
                <span className="text-gray-600">TC Kimlik:</span>
                <span className="font-medium text-gray-900">{tc || "-"}</span>
              </div>

              <div className="flex items-center gap-2">
                <UserIcon size={14} className="text-gray-400" />
                <span className="text-gray-600">Mernis No:</span>
                <span className="font-medium text-gray-900">{mernis || "-"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-gray-600">Ülke:</span>
                <span className="font-medium text-gray-900">{country || "-"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-600">Adres:</span>
                  <p className="font-medium text-gray-900">
                    {[city, county, neighbourhood].filter(Boolean).join(" / ") || "-"}
                  </p>
                </div>
              </div>

              {ideas ? (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600">Yorum:</span>
                  <p className="font-medium text-gray-900">{ideas}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
