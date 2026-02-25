// src/features/admin/admin-detail/ui/AdminDetailPage.client.tsx
"use client";

import React from "react";
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

  /* ── Loading state ── */
  if (c.loading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={c.goBack}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Yetkili Detayları
          </h1>
        </div>

        {/* Single Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Gradient Banner */}
          <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl" />

          <div className="px-6 pb-6">
            {/* Avatar + Name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mt-5 mb-6">
              {admin.profilePicture ? (
                <Image
                  width={96}
                  height={96}
                  className="w-20 h-20 rounded-2xl border-2 border-gray-200 shadow-sm object-cover shrink-0"
                  alt={`${admin.name} ${admin.surname}`}
                  src={admin.profilePicture}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl border-2 border-gray-200 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold shrink-0">
                  {initials}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-1">
                <h2 className="text-xl font-bold text-gray-800">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mail size={15} />
                E-posta Gönder
              </button>
              <button
                onClick={c.handleCall}
                disabled={!admin.gsmNumber}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Phone size={15} />
                Ara
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                icon={<Hash size={16} />}
                iconBg="bg-gray-100"
                iconColor="text-gray-500"
                label="Kullanıcı ID"
                value={String(admin.uid)}
              />

              <InfoRow
                icon={<Mail size={16} />}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-500"
                label="E-posta"
                value={admin.mail || "Belirtilmemiş"}
              />

              <InfoRow
                icon={<Phone size={16} />}
                iconBg="bg-green-50"
                iconColor="text-green-500"
                label="Telefon"
                value={
                  admin.gsmNumber
                    ? formatPhone(admin.gsmNumber)
                    : "Belirtilmemiş"
                }
              />

              <InfoRow
                icon={<User size={16} />}
                iconBg="bg-pink-50"
                iconColor="text-pink-500"
                label="Cinsiyet"
                value={getGenderText(admin.gender)}
              />

              <InfoRow
                icon={<Shield size={16} />}
                iconBg="bg-purple-50"
                iconColor="text-purple-500"
                label="Rol"
                value={getRoleLabel(admin.role)}
              />

              <InfoRow
                icon={<Calendar size={16} />}
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                label="Doğum Tarihi"
                value={formatBirthDate(admin.birth)}
              />

              <InfoRow
                icon={<CalendarPlus size={16} />}
                iconBg="bg-teal-50"
                iconColor="text-teal-500"
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
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div
        className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400 font-medium">{label}</div>
        <div className="text-sm font-semibold text-gray-800 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
