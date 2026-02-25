// src/features/admin/users/ui/components/CustomersTable.tsx
"use client";

import React from "react";
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

/* ── Types ── */
type Props = {
  rows: CustomerUser[];
  expandedIds: Set<string>;
  onToggleExpand: (uid: string | number) => void;

  onEdit: (uid: string | number) => void;
  onDelete: (uid: string | number, user: CustomerUser) => void;
  onViewDetails: (uid: string | number) => void;
  onViewLists: (uid: string | number) => void;
};

/* ── Helpers ── */
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

const HEADERS = [
  { label: "Profil", width: "w-18", pad: "pl-4 pr-4" },
  { label: "Ad Soyad", width: "", pad: "pl-2 pr-4" },
  { label: "İletişim", width: "", pad: "px-4" },
  { label: "Durum", width: "", pad: "px-4" },
  { label: "Adres", width: "", pad: "px-4" },
  { label: "İşlemler", width: "w-40", pad: "px-4" },
] as const;

/* ── Row Component ── */
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
      ? "bg-blue-50 text-blue-700"
      : genderLower === "female" || genderLower === "kadın" || genderLower === "kadin"
        ? "bg-pink-50 text-pink-700"
        : "bg-gray-100 text-black/60";

  return (
    <>
      {/* Main row */}
      <tr className="border-b border-black/6 last:border-b-0 hover:bg-black/[0.04] transition-colors">
        {/* Profil */}
        <td className="pl-4 pr-4 py-2 w-18">
          {profilePicture ? (
            <Image
              width={72}
              height={72}
              className="w-10 h-10 shrink-0 rounded-full"
              alt={fullName || "User"}
              src={profilePicture}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {(user?.name?.[0] || "?").toUpperCase()}
            </div>
          )}
        </td>

        {/* Ad Soyad */}
        <td className="pl-2 pr-4 py-2">
          <div className="text-[0.875rem] leading-6 text-black/87 truncate">
            {fullName || "-"}
          </div>
          <div className="text-xs leading-5 text-black/60 truncate">
            {mailValue || "-"}
          </div>
        </td>

        {/* İletişim */}
        <td className="px-4 py-2">
          <div className="flex flex-col gap-1">
            {phones.length ? (
              phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <span className="text-[0.875rem] leading-6 text-black/87 truncate">
                    {phone?.number ? formatPhoneNumber(phone.number) : "Yok"}
                  </span>
                  {phone?.isAbleToSendSMS ? (
                    <span className="text-[0.625rem] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                      SMS
                    </span>
                  ) : (
                    <span className="text-[0.625rem] font-medium text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                      SMS
                    </span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-[0.875rem] leading-6 text-black/38">Telefon yok</span>
            )}
          </div>
        </td>

        {/* Durum */}
        <td className="px-4 py-2">
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[0.6875rem] font-medium ${genderClass}`}
            >
              {genderLabel}
            </span>

            <span
              className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[0.6875rem] font-medium ${
                status === "Mülk Sahibi"
                  ? "bg-emerald-50 text-emerald-700"
                  : status === "Satınalan"
                    ? "bg-blue-50 text-blue-700"
                    : status === "Kiralayan"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-purple-50 text-purple-700"
              }`}
            >
              {status}
            </span>
          </div>
        </td>

        {/* Adres */}
        <td className="px-4 py-2">
          <p className="text-[0.875rem] leading-6 text-black/87 line-clamp-2 max-w-[240px]">
            {fullAddress}
          </p>
        </td>

        {/* İşlemler */}
        <td className="px-4 py-2">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onViewDetails(uid)}
              className="p-1.5 text-black/54 hover:text-blue-600 hover:bg-blue-600/8 rounded-full transition-colors"
              title="Detaylar"
            >
              <Info size={18} strokeWidth={1.5} />
            </button>

            {status === "Mülk Sahibi" && (
              <button
                type="button"
                onClick={() => onViewLists(uid)}
                className="p-1.5 text-black/54 hover:text-emerald-600 hover:bg-emerald-600/8 rounded-full transition-colors"
                title="Listeler"
              >
                <List size={18} strokeWidth={1.5} />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(uid)}
              className="p-1.5 text-black/54 hover:text-green-600 hover:bg-green-600/8 rounded-full transition-colors"
              title="Düzenle"
            >
              <Edit size={18} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(uid, user)}
              className="p-1.5 text-black/54 hover:text-red-600 hover:bg-red-600/8 rounded-full transition-colors"
              title="Sil"
            >
              <Trash2 size={18} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => onToggleExpand(uid)}
              className="p-1.5 text-black/54 hover:text-purple-600 hover:bg-purple-600/8 rounded-full transition-colors"
              title={isExpanded ? "Detayları Gizle" : "Detayları Göster"}
            >
              {isExpanded ? <ChevronUp size={18} strokeWidth={1.5} /> : <ChevronDown size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {isExpanded && (
        <tr className="bg-black/[0.02]">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Kimlik Bilgileri */}
              <div>
                <label className="text-[0.6875rem] font-semibold text-black/60 uppercase tracking-wide mb-2 block">
                  Kimlik Bilgileri
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[0.8125rem]">
                    <IdCard size={14} className="text-black/38" />
                    <span className="text-black/60">TC:</span>
                    <span className="font-medium text-black/87">{tcNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.8125rem]">
                    <User size={14} className="text-black/38" />
                    <span className="text-black/60">Mernis:</span>
                    <span className="font-medium text-black/87">{mernisNo}</span>
                  </div>
                </div>
              </div>

              {/* Konum Bilgisi */}
              <div>
                <label className="text-[0.6875rem] font-semibold text-black/60 uppercase tracking-wide mb-2 block">
                  Konum Bilgisi
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[0.8125rem]">
                    <MapPin size={14} className="text-black/38" />
                    <span className="text-black/60">Ülke:</span>
                    <span className="font-medium text-black/87">{country}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[0.8125rem]">
                    <MapPin size={14} className="text-black/38 mt-0.5" />
                    <div>
                      <span className="text-black/60">Adres:</span>
                      <p className="font-medium text-black/87">
                        {city} / {county} / {neighbourhood}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* İletişim */}
              <div>
                <label className="text-[0.6875rem] font-semibold text-black/60 uppercase tracking-wide mb-2 block">
                  İletişim
                </label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[0.8125rem]">
                    <Mail size={14} className="text-black/38" />
                    <span className="text-black/60">Email:</span>
                    <span className="font-medium text-black/87 truncate">{mailValue || "-"}</span>
                  </div>
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2 text-[0.8125rem]">
                      <Phone size={14} className="text-black/38" />
                      <span className="text-black/60">Tel {index + 1}:</span>
                      <span className="font-medium text-black/87">
                        {phone?.number ? formatPhoneNumber(phone.number) : "Yok"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notlar */}
              <div>
                <label className="text-[0.6875rem] font-semibold text-black/60 uppercase tracking-wide mb-2 block">
                  Notlar
                </label>
                <div className="bg-white rounded border border-black/12 p-3">
                  <p className="text-[0.8125rem] text-black/87 leading-relaxed">
                    {ideasAboutCustomer?.trim() ? ideasAboutCustomer : "Not bulunmuyor"}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ── Table Component ── */
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

  return (
    <div className="bg-white rounded-md shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead>
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h.label}
                  className={`${h.pad} py-3 text-left text-xs font-semibold tracking-wide text-black/60 border-b border-black/12 whitespace-nowrap ${h.width}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Empty state */}
            {!hasRows && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-black/38">
                    <Search size={32} strokeWidth={1.5} />
                    <span className="text-sm font-medium text-black/60">Kayıt bulunamadı</span>
                    <p className="text-xs text-black/38">Arama kriterlerinize uygun sonuç bulunamadı.</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {hasRows &&
              rows.map((user) => {
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
