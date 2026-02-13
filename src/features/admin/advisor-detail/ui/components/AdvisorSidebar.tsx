// src/features/admin/advisor-detail/ui/components/AdvisorSidebar.tsx
"use client";

import React from "react";
import { Mail, Phone, Calendar, User } from "lucide-react";
import type { Advisor } from "../../lib/types";
import {
  formatBirthDate,
  formatPhone,
  getGenderText,
  getRoleText,
  getRoleBadgeClass,
} from "../../lib/helpers";
import StatBox from "./StatBox";

type Props = {
  advisor: Advisor;
  advertCount: number;
  activeCount: number;
  passiveCount: number;
  onEmail: () => void;
  onCall: () => void;
};

export default function AdvisorSidebar({
  advisor,
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
          {advisor.name.charAt(0)}
          {advisor.surname.charAt(0)}
        </div>

        {/* Name & Role */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {advisor.name} {advisor.surname}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(advisor.role)}`}
          >
            {getRoleText(advisor.role)}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onEmail}
            className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
          >
            <Mail size={18} className="text-gray-600" />
            <span className="text-sm">E-posta Gönder</span>
          </button>
          {advisor.gsmNumber && (
            <button
              onClick={onCall}
              className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full"
            >
              <Phone size={18} className="text-gray-600" />
              <span className="text-sm">{formatPhone(advisor.gsmNumber)}</span>
            </button>
          )}
        </div>

        <div className="w-full border-t border-gray-200" />

        {/* Personal info */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Doğum Tarihi: {formatBirthDate(advisor.birth)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>Cinsiyet: {getGenderText(advisor.gender)}</span>
          </div>
        </div>

        <div className="w-full border-t border-gray-200" />

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