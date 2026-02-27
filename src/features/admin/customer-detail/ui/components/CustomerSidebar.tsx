// src/features/admin/customer-detail/ui/components/CustomerSidebar.tsx
"use client";

import React from "react";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  FileText,
  BarChart3,
} from "lucide-react";
import type { Customer } from "../../lib/types";
import { formatTimestamp } from "../../lib/helpers";

type Props = {
  customer: Customer;
  primaryPhone: string;
  advertCount: number;
  activeCount: number;
  passiveCount: number;
  onEmail: () => void;
  onCall: () => void;
};

export default function CustomerSidebar({
  customer,
  primaryPhone,
  advertCount,
  activeCount,
  passiveCount,
  onEmail,
  onCall,
}: Props) {
  const initials =
    (customer.name?.charAt(0) || "") + (customer.surname?.charAt(0) || "");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full">
      {/* Gradient Banner */}
      <div className="h-24 bg-gradient-to-r from-[#000066] via-[#03409F] to-[#035DBA]" />

      <div className="px-5 pb-5">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center -mt-12 mb-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-[#000066] to-[#035DBA] flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-1 ring-gray-100">
            {initials}
          </div>

          <h2 className="mt-3 text-lg font-bold text-gray-900 text-center">
            {customer.name} {customer.surname}
          </h2>

          <span
            className={`mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
              customer.gender === "male"
                ? "bg-[#E9EEF7] text-[#000066] border-[#035DBA]/20"
                : "bg-pink-50 text-pink-700 border-pink-200"
            }`}
          >
            {customer.gender === "male" ? "Erkek" : "Kadın"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-5">
          {customer.mail.mail && (
            <button
              onClick={onEmail}
              disabled={!customer.mail.isAbleToSendMail}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#E9EEF7] text-[#000066] rounded-xl hover:bg-[#035DBA]/15 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Mail size={15} />
              E-posta
            </button>
          )}
          {primaryPhone && (
            <button
              onClick={onCall}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium"
            >
              <Phone size={15} />
              Ara
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Info rows */}
        <div className="space-y-2.5">
          {customer.status && (
            <InfoRow
              icon={<User size={15} />}
              iconBg="bg-[#E9EEF7]"
              iconColor="text-[#03409F]"
              label="Durum"
              value={customer.status}
            />
          )}

          <InfoRow
            icon={<Calendar size={15} />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            label="Kayıt Tarihi"
            value={formatTimestamp(customer.created.createdTimestamp)}
          />

          {(customer.neighbourhood || customer.county || customer.city) && (
            <InfoRow
              icon={<MapPin size={15} />}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              label="Konum"
              value={[customer.neighbourhood, customer.county, customer.city]
                .filter(Boolean)
                .join(", ")}
            />
          )}

          {primaryPhone && (
            <InfoRow
              icon={<Phone size={15} />}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              label="Telefon"
              value={primaryPhone}
            />
          )}

          {customer.mail.mail && (
            <InfoRow
              icon={<Mail size={15} />}
              iconBg="bg-[#E9EEF7]"
              iconColor="text-[#035DBA]"
              label="E-posta"
              value={customer.mail.mail}
            />
          )}
        </div>

        {/* Notes */}
        {customer.ideasAboutCustomer && (
          <>
            <div className="border-t border-gray-100 my-4" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[#035DBA]" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Müşteri Notları
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {customer.ideasAboutCustomer}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Stats */}
        <div className="border-t border-gray-100 my-4" />
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={14} className="text-[#035DBA]" />
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              İlan İstatistikleri
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-3 rounded-xl bg-[#E9EEF7] border border-[#035DBA]/10">
              <div className="text-xl font-bold text-[#000066]">
                {advertCount}
              </div>
              <div className="text-[10px] font-semibold text-[#03409F] uppercase tracking-wide mt-0.5">
                Toplam
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-xl font-bold text-emerald-700">
                {activeCount}
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mt-0.5">
                Aktif
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 border border-red-100">
              <div className="text-xl font-bold text-red-600">
                {passiveCount}
              </div>
              <div className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mt-0.5">
                Pasif
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Info row helper ── */
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
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 border border-gray-100 hover:border-[#035DBA]/20 hover:bg-[#E9EEF7]/20 transition-all duration-200">
      <div
        className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </div>
        <div className="text-sm font-semibold text-gray-900 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
