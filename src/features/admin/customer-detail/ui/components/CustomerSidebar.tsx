// src/features/admin/customer-detail/ui/components/CustomerSidebar.tsx
"use client";

import React from "react";
import { Mail, Phone, Calendar, MapPin, User } from "lucide-react";
import type { Customer } from "../../lib/types";
import { formatTimestamp } from "../../lib/helpers";
import StatBox from "./StatBox";

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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex flex-col items-center gap-6">
        {/* Avatar */}
        <div className="w-32 h-32 bg-custom-orange rounded-full flex items-center justify-center text-white text-4xl font-semibold">
          {customer.name.charAt(0)}
          {customer.surname.charAt(0)}
        </div>

        {/* Name & Gender */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {customer.name} {customer.surname}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              customer.gender === "male"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {customer.gender === "male" ? "Erkek" : "Kadın"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 w-full">
          {customer.mail.mail && (
            <button
              onClick={onEmail}
              disabled={!customer.mail.isAbleToSendMail}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
              <Mail size={18} className="text-gray-600" />
              <span className="text-sm truncate">
                {customer.mail.mail || "E-posta Yok"}
              </span>
            </button>
          )}
          {primaryPhone && (
            <button
              onClick={onCall}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <Phone size={18} className="text-gray-600" />
              <span className="text-sm">{primaryPhone}</span>
            </button>
          )}
        </div>

        <div className="w-full border-t border-gray-200" />

        {/* Info */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>Durum: {customer.status || "Belirtilmemiş"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>
              Kayıt Tarihi: {formatTimestamp(customer.created.createdTimestamp)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span className="truncate">
              {customer.neighbourhood}, {customer.county}, {customer.city}
            </span>
          </div>
        </div>

        <div className="w-full border-t border-gray-200" />

        {/* Notes */}
        {customer.ideasAboutCustomer && (
          <>
            <div className="flex flex-col gap-2 w-full">
              <h3 className="text-sm font-semibold text-gray-800">
                Müşteri Hakkında Notlar
              </h3>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {customer.ideasAboutCustomer}
                </p>
              </div>
            </div>
            <div className="w-full border-t border-gray-200" />
          </>
        )}

        {/* Stats */}
        <div className="flex flex-col gap-3 w-full">
          <h3 className="text-sm font-semibold text-gray-800 text-center">
            İlan İstatistikleri
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <StatBox value={advertCount} label="Toplam İlan" />
            <StatBox value={activeCount} label="Aktif" color="success" />
            <StatBox value={passiveCount} label="Pasif" color="error" />
          </div>
        </div>
      </div>
    </div>
  );
}