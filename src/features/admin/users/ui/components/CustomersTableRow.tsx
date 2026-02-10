// src/features/admin/users/ui/components/CustomersTableRow.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  IdCard,
  User,
  Info,
  List,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import formatPhoneNumber from "@/utils/formatPhoneNumber";
import type { CustomerUser } from "@/features/admin/users/model/types";

export type CustomersTableRowProps = {
  user: CustomerUser;
  onEdit: (uid: string | number) => void;
  onDelete: (uid: string | number, user: CustomerUser) => void;
  onViewDetails: (uid: string | number) => void;
  onViewLists: (uid: string | number) => void;
};

function getMailValue(mail: CustomerUser["mail"]): string {
  if (!mail) return "";
  if (typeof mail === "string") return mail;
  return String(mail.mail ?? "");
}

function getFullName(u: CustomerUser): string {
  const name = String(u?.name ?? "");
  const surname = String(u?.surname ?? "");
  return `${name} ${surname}`.trim();
}

function getGenderLabel(g?: string) {
  if (!g) return "-";
  const v = g.toLowerCase();
  if (v === "male" || v === "erkek") return "Erkek";
  if (v === "female" || v === "kadın" || v === "kadin") return "Kadın";
  return g;
}

export default function CustomersTableRow({
  user,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
}: CustomersTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const uid = user?.uid;
  const fullName = getFullName(user);
  const mailValue = getMailValue(user?.mail);

  const phones = Array.isArray(user?.phones) ? user.phones : [];
  const status = String(user?.status ?? "-");
  const genderLabel = getGenderLabel(user?.gender);

  const profilePicture =
    (typeof user?.profilePicture === "string" && user.profilePicture) || "";

  const fullAddress =
    String(
      user?.fulladdress ??
        user?.full_address ??
        user?.address ??
        user?.fullAddress ??
        "",
    ) || "-";

  const details = useMemo(() => {
    return {
      tcNumber: String(user?.tcNumber ?? user?.turkish_id ?? "-"),
      mernisNo: String(user?.mernisNo ?? user?.mernis_no ?? "-"),
      country: String(user?.country ?? "-"),
      city: String(user?.city ?? "-"),
      county: String(user?.county ?? "-"),
      neighbourhood: String(user?.neighbourhood ?? user?.quarter ?? "-"),
      ideasAboutCustomer: String(
        user?.ideasAboutCustomer ?? user?.comment ?? "",
      ).trim(),
    };
  }, [user]);

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-200 group">
        <td className="p-4 pl-6">
          <div className="flex items-center gap-4">
            {profilePicture ? (
              <Image
                width={44}
                height={44}
                className="w-11 h-11 object-cover rounded-xl shrink-0 shadow-sm"
                alt={fullName || "User"}
                src={profilePicture}
              />
            ) : (
              <div className="w-11 h-11 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shrink-0 shadow-sm">
                {(user?.name?.[0] || "?").toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {fullName || "-"}
              </p>
              <p className="text-gray-500 text-xs truncate mt-0.5">
                {mailValue || "-"}
              </p>
            </div>
          </div>
        </td>

        <td className="p-4">
          <div className="flex flex-col gap-1.5">
            {phones.length ? (
              phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone size={12} className="text-gray-400 shrink-0" />
                    <span className="text-gray-700 text-sm font-medium truncate">
                      {phone?.number ? formatPhoneNumber(phone.number) : "Yok"}
                    </span>
                  </div>

                  {phone?.isAbleToSendSMS ? (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      SMS
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                      SMS
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone size={12} className="text-gray-400" />
                <span>Telefon yok</span>
              </div>
            )}
          </div>
        </td>

        <td className="p-4">
          <div className="flex flex-col gap-1.5">
            <span
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                String(user?.gender ?? "").toLowerCase() === "male"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-pink-100 text-pink-700 border border-pink-200"
              }`}
            >
              {genderLabel}
            </span>

            <span
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                status === "Mülk Sahibi"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : status === "Satınalan"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : status === "Kiralayan"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
              }`}
            >
              {status}
            </span>
          </div>
        </td>

        <td className="p-4">
          <div className="max-w-[240px]">
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {fullAddress}
            </p>
          </div>
        </td>

        <td className="p-4">
          <div className="flex items-center gap-1 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => onViewDetails(uid)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Detaylar"
            >
              <Info size={16} />
            </button>

            {status === "Mülk Sahibi" && (
              <button
                type="button"
                onClick={() => onViewLists(uid)}
                className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 shadow-sm"
                title="Listeler"
              >
                <List size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(uid)}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Düzenle"
            >
              <Edit size={16} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(uid, user)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-sm"
              title="Sil"
            >
              <Trash2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 shadow-sm"
              title={isExpanded ? "Detayları Gizle" : "Detayları Göster"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-linear-to-r from-blue-50/50 to-purple-50/50">
          <td colSpan={5} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Kimlik Bilgileri
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <IdCard size={14} className="text-gray-400" />
                      <span className="text-gray-600">TC:</span>
                      <span className="font-medium text-gray-900">
                        {details.tcNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-600">Mernis:</span>
                      <span className="font-medium text-gray-900">
                        {details.mernisNo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Konum Bilgisi
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-gray-600">Ülke:</span>
                      <span className="font-medium text-gray-900">
                        {details.country}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Adres:</span>
                        <p className="font-medium text-gray-900">
                          {details.city} / {details.county} /{" "}
                          {details.neighbourhood}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    İletişim
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900 truncate">
                        {mailValue || "-"}
                      </span>
                    </div>

                    {phones.map((phone, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-600">Tel {index + 1}:</span>
                        <span className="font-medium text-gray-900">
                          {phone?.number
                            ? formatPhoneNumber(phone.number)
                            : "Yok"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Notlar
                  </label>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {details.ideasAboutCustomer
                        ? details.ideasAboutCustomer
                        : "Not bulunmuyor"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
