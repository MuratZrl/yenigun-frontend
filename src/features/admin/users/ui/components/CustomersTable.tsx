// src/features/admin/users/ui/components/CustomersTable.tsx
"use client";

import React, { useMemo } from "react";
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
  Search,
} from "lucide-react";

import formatPhoneNumber from "@/utils/formatPhoneNumber";
import type { CustomerUser } from "@/features/admin/users/model/types";

type Props = {
  rows: CustomerUser[];
  expandedIds: Set<string>;
  onToggleExpand: (uid: string | number) => void;

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

function CustomersTableRow({
  user,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
}: {
  user: CustomerUser;
  isExpanded: boolean;
  onToggleExpand: (uid: string | number) => void;

  onEdit: (uid: string | number) => void;
  onDelete: (uid: string | number, user: CustomerUser) => void;
  onViewDetails: (uid: string | number) => void;
  onViewLists: (uid: string | number) => void;
}) {
  const uid = user?.uid;
  const fullName = getFullName(user);
  const mailValue = getMailValue(user?.mail);
  const phones = Array.isArray(user?.phones) ? user.phones : [];
  const genderLabel = getGenderLabel(user?.gender);
  const status = String(user?.status ?? "-");

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

  const tcNumber = String(user?.tcNumber ?? user?.turkish_id ?? "-");
  const mernisNo = String(user?.mernisNo ?? user?.mernis_no ?? "-");
  const country = String(user?.country ?? "-");
  const city = String(user?.city ?? "-");
  const county = String(user?.county ?? "-");
  const neighbourhood = String(user?.neighbourhood ?? user?.quarter ?? "-");
  const ideasAboutCustomer = String(
    user?.ideasAboutCustomer ?? user?.comment ?? "",
  );

  const genderLower = String(user?.gender ?? "").toLowerCase();
  const genderClass =
    genderLower === "male" || genderLower === "erkek"
      ? "bg-blue-100 text-blue-700 border border-blue-200"
      : genderLower === "female" || genderLower === "kadın" || genderLower === "kadin"
        ? "bg-pink-100 text-pink-700 border border-pink-200"
        : "bg-gray-100 text-gray-700 border border-gray-200";

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
              className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${genderClass}`}
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
              onClick={() => onToggleExpand(uid)}
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
                        {tcNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-600">Mernis:</span>
                      <span className="font-medium text-gray-900">
                        {mernisNo}
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
                        {country}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Adres:</span>
                        <p className="font-medium text-gray-900">
                          {city} / {county} / {neighbourhood}
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
                      {ideasAboutCustomer?.trim()
                        ? ideasAboutCustomer
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

export default function CustomersTable({
  rows,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  onViewDetails,
  onViewLists,
}: Props) {
  const hasRows = rows && rows.length > 0;

  const emptyRow = useMemo(() => {
    return (
      <tr>
        <td colSpan={5} className="px-6 py-12 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <Search size={48} className="text-gray-300" />
            <div className="text-lg font-medium">Kayıt bulunamadı</div>
            <p className="text-gray-400">
              Arama kriterlerinize uygun sonuç bulunamadı.
            </p>
          </div>
        </td>
      </tr>
    );
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
            <tr>
              <th className="p-4 pl-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kullanıcı Bilgisi
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                İletişim
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Durum
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Adres
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {!hasRows
              ? emptyRow
              : rows.map((user) => {
                  const key = String(user?.uid);
                  const isExpanded = expandedIds.has(key);

                  return (
                    <CustomersTableRow
                      key={key}
                      user={user}
                      isExpanded={isExpanded}
                      onToggleExpand={onToggleExpand}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                      onViewLists={onViewLists}
                    />
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
