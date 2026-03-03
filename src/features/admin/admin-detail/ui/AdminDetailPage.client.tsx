// src/features/admin/admin-detail/ui/AdminDetailPage.client.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  CalendarPlus,
  Hash,
  Camera,
  Trash2,
  Loader2,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

import { useAdminDetailController } from "../hooks/useAdminDetailController";
import {
  formatBirthDate,
  formatPhone,
  getGenderText,
  getRoleLabel,
  getRoleBadgeClass,
  formatCreatedAt,
} from "../lib/helpers";

export default function AdminDetailPage() {
  const c = useAdminDetailController();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Loading state ── */
  if (c.loading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#035DBA] border-t-transparent rounded-full animate-spin" />
              <div className="text-base text-gray-500 font-medium">
                Yükleniyor...
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* ── Error state ── */
  if (c.error || !c.admin) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <User size={28} className="text-red-400" />
              </div>
              <div className="text-lg font-medium text-red-600">
                {c.error || "Yetkili bulunamadı"}
              </div>
              <button
                onClick={c.goBack}
                className="px-4 py-2 bg-[#035DBA] text-white rounded-lg hover:bg-[#000066] transition-colors text-sm font-medium"
              >
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const admin = c.admin;
  const initials =
    (admin.name?.charAt(0) || "") + (admin.surname?.charAt(0) || "");

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) c.handleUploadImage(file);
    e.target.value = "";
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={c.goBack}
            className="p-2 text-gray-500 hover:text-[#035DBA] hover:bg-[#E9EEF7] rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Yetkili Detayları
          </h1>
        </div>

        {/* Single Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-[#000066] via-[#03409F] to-[#035DBA]" />

          <div className="px-6 pb-6">
            {/* Avatar + Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
              {/* Avatar with upload/remove controls */}
              <div className="relative shrink-0">
                {admin.profilePicture ? (
                  <Image
                    width={96}
                    height={96}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover ring-1 ring-gray-100"
                    alt={`${admin.name} ${admin.surname}`}
                    src={admin.profilePicture}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-[#000066] to-[#035DBA] flex items-center justify-center text-white text-xl font-bold ring-1 ring-gray-100">
                    {initials}
                  </div>
                )}

                {/* Upload spinner overlay */}
                {c.uploading && (
                  <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center border-4 border-transparent">
                    <Loader2 size={24} className="text-white animate-spin" />
                  </div>
                )}

                {/* Camera button (upload) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={c.uploading}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#035DBA] text-white flex items-center justify-center shadow-md hover:bg-[#000066] transition-colors disabled:opacity-50"
                  title="Fotoğraf yükle"
                >
                  <Camera size={14} />
                </button>

                {/* Remove button (only when image exists) */}
                {admin.profilePicture && (
                  <button
                    type="button"
                    onClick={c.handleRemoveImage}
                    disabled={c.uploading}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Fotoğrafı kaldır"
                  >
                    <Trash2 size={12} />
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileSelect}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {admin.name} {admin.surname}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border w-fit ${getRoleBadgeClass(admin.role)}`}
                >
                  {getRoleLabel(admin.role)}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={c.handleEmail}
                disabled={!admin.mail}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E9EEF7] text-[#000066] rounded-xl hover:bg-[#035DBA]/15 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mail size={15} />
                E-posta Gönder
              </button>
              <button
                onClick={c.handleCall}
                disabled={!admin.gsmNumber}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Phone size={15} />
                Ara
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                icon={<Hash size={16} />}
                iconBg="bg-gray-100"
                iconColor="text-gray-500"
                label="Kullanıcı ID"
                value={String(admin.uid)}
              />

              <InfoRow
                icon={<Mail size={16} />}
                iconBg="bg-[#E9EEF7]"
                iconColor="text-[#035DBA]"
                label="E-posta"
                value={admin.mail || "Belirtilmemiş"}
              />

              <InfoRow
                icon={<Phone size={16} />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                label="Telefon"
                value={
                  admin.gsmNumber
                    ? formatPhone(admin.gsmNumber)
                    : "Belirtilmemiş"
                }
              />

              <InfoRow
                icon={<User size={16} />}
                iconBg="bg-[#E9EEF7]"
                iconColor="text-[#03409F]"
                label="Cinsiyet"
                value={getGenderText(admin.gender)}
              />

              <InfoRow
                icon={<Shield size={16} />}
                iconBg="bg-[#E9EEF7]"
                iconColor="text-[#000066]"
                label="Rol"
                value={getRoleLabel(admin.role)}
              />

              <InfoRow
                icon={<Calendar size={16} />}
                iconBg="bg-amber-50"
                iconColor="text-amber-600"
                label="Doğum Tarihi"
                value={formatBirthDate(admin.birth)}
              />

              <InfoRow
                icon={<CalendarPlus size={16} />}
                iconBg="bg-[#E9EEF7]"
                iconColor="text-[#035DBA]"
                label="Eklenme Tarihi"
                value={formatCreatedAt(admin.createdAt)}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ── Small helper component ── */
function InfoRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/60 border border-gray-100 hover:border-[#035DBA]/20 hover:bg-[#E9EEF7]/20 transition-all duration-200">
      <div
        className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</div>
        <div className="text-sm font-semibold text-gray-900 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
