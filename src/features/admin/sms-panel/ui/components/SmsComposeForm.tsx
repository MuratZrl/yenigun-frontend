// src/features/admin/sms-panel/ui/components/SmsComposeForm.tsx
"use client";

import React, { useState } from "react";
import {
  Send,
  RotateCcw,
  Users,
  MapPin,
  Tag,
  UserCheck,
  Info,
  MessageSquare,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Type,
  X,
  Plus,
} from "lucide-react";
import type { RecipientType, CustomerCategory } from "../../lib/types";
import { turkishCities, districtsByCity } from "../../lib/mockData";
import SmsPreview from "./SmsPreview";

type Props = {
  recipientType: RecipientType;
  selectedCities: string[];
  selectedDistricts: string[];
  selectedCategory: CustomerCategory | "";
  message: string;
  charCount: number;
  smsSegments: number;
  sending: boolean;
  estimatedRecipientCount: number;
  recipientSummary: string;
  onRecipientTypeChange: (type: RecipientType) => void;
  onToggleCity: (city: string) => void;
  onToggleDistrict: (district: string) => void;
  onCategoryChange: (category: CustomerCategory | "") => void;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onReset: () => void;
};

const recipientOptions: { type: RecipientType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: "all", label: "Tüm Kullanıcılar", icon: <Users size={20} />, desc: "Tüm kayıtlı kullanıcılara gönder" },
  { type: "specific", label: "Belirli Kullanıcılar", icon: <UserCheck size={20} />, desc: "Seçili kullanıcılara gönder" },
  { type: "city", label: "İl / İlçe Bazlı", icon: <MapPin size={20} />, desc: "İl ve ilçeye göre filtrele" },
  { type: "category", label: "Kategoriye Göre", icon: <Tag size={20} />, desc: "Müşteri kategorisine göre filtrele" },
];

const categories: CustomerCategory[] = ["Kiracı", "Ev Sahibi", "Mülk Sahibi"];

export default function SmsComposeForm(props: Props) {
  // Local pending selections (before clicking Onayla)
  const [pendingCity, setPendingCity] = useState("");
  const [pendingDistrict, setPendingDistrict] = useState("");

  // Districts for the currently selected pending city
  const pendingCityDistricts = pendingCity ? (districtsByCity[pendingCity] ?? []) : [];

  const totalSms = props.estimatedRecipientCount * props.smsSegments;
  const charPercent = Math.min((props.charCount / 160) * 100, 100);

  const handleConfirm = () => {
    if (!pendingCity) return;

    // Add city if not already selected
    if (!props.selectedCities.includes(pendingCity)) {
      props.onToggleCity(pendingCity);
    }

    // Add district if selected and not already added
    if (pendingDistrict && !props.selectedDistricts.includes(pendingDistrict)) {
      props.onToggleDistrict(pendingDistrict);
    }

    // Reset selects to initial state
    setPendingCity("");
    setPendingDistrict("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Form */}
      <div className="lg:col-span-2 space-y-5">
        {/* Step 1: Recipient Selection */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users size={14} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Adım 1 — Alıcı Seçimi</h3>
              <p className="text-xs text-gray-400">Mesajınızı kime göndermek istediğinizi seçin</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipientOptions.map((opt) => {
                const isActive = props.recipientType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => props.onRecipientTypeChange(opt.type)}
                    className={`group relative flex items-center gap-3.5 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isActive
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Selection indicator */}
                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}>
                      {isActive && <CheckCircle2 size={14} className="text-white" />}
                    </div>

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}>
                      {opt.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isActive ? "text-blue-800" : "text-gray-700"}`}>
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Conditional Filters */}
            {props.recipientType === "city" && (
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
                {/* İl + İlçe + Onayla in one row */}
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  {/* City select */}
                  <div className="flex-1 w-full">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                      <MapPin size={12} className="text-gray-400" />
                      İl
                    </label>
                    <div className="relative">
                      <select
                        value={pendingCity}
                        onChange={(e) => {
                          setPendingCity(e.target.value);
                          setPendingDistrict("");
                        }}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="">İl seçin...</option>
                        {turkishCities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* District select */}
                  <div className="flex-1 w-full">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                      <MapPin size={12} className="text-gray-400" />
                      İlçe
                      <span className="text-gray-400 font-normal">(opsiyonel)</span>
                    </label>
                    <div className="relative">
                      <select
                        value={pendingDistrict}
                        onChange={(e) => setPendingDistrict(e.target.value)}
                        disabled={pendingCityDistricts.length === 0}
                        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <option value="">İlçe seçin...</option>
                        {pendingCityDistricts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Onayla button */}
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!pendingCity}
                    className="inline-flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all flex-shrink-0"
                  >
                    <Plus size={15} />
                    Onayla
                  </button>
                </div>

                {/* Selected chips */}
                {(props.selectedCities.length > 0 || props.selectedDistricts.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {props.selectedCities.map((city) => (
                      <span
                        key={city}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium shadow-sm"
                      >
                        <MapPin size={11} />
                        {city}
                        <button type="button" onClick={() => props.onToggleCity(city)} className="hover:text-blue-200 transition-colors">
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                    {props.selectedDistricts.map((district) => (
                      <span
                        key={district}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm"
                      >
                        {district}
                        <button type="button" onClick={() => props.onToggleDistrict(district)} className="hover:text-blue-200 transition-colors">
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {props.recipientType === "category" && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                  <Tag size={12} className="text-gray-400" />
                  Kategori
                </label>
                <div className="relative">
                  <select
                    value={props.selectedCategory}
                    onChange={(e) => props.onCategoryChange(e.target.value as CustomerCategory | "")}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Kategori seçin...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {props.recipientType === "specific" && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
                  <UserCheck size={12} className="text-gray-400" />
                  Kullanıcı Ara
                </label>
                <input
                  type="text"
                  placeholder="İsim, telefon veya email ile ara..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
                <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                  <Info size={11} />
                  Backend entegrasyonu sonrası kullanıcı arama aktif olacaktır.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recipient Info Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Users size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">Alıcı Bilgisi</p>
            </div>
            <div className="flex-shrink-0 text-center px-4 py-2 bg-white rounded-xl border border-blue-100 shadow-sm">
              <p className="text-2xl font-bold text-blue-700 leading-none">{props.estimatedRecipientCount}</p>
              <p className="text-[10px] text-blue-500 uppercase tracking-wider font-semibold mt-1">Kişi</p>
            </div>
          </div>

          {/* City + District grouped list */}
          {props.recipientType === "city" && props.selectedCities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200/40 space-y-2">
              {props.selectedCities.map((city) => {
                const cityDistricts = (districtsByCity[city] ?? []).filter((d) =>
                  props.selectedDistricts.includes(d)
                );
                return (
                  <div key={city} className="flex items-start gap-2">
                    <MapPin size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">{city}</span>
                      {cityDistricts.length > 0 && (
                        <span className="text-gray-500">
                          {" — "}{cityDistricts.join(", ")}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {props.recipientType === "category" && props.selectedCategory && (
            <div className="mt-4 pt-4 border-t border-blue-200/40">
              <div className="flex items-center gap-2">
                <Tag size={13} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-gray-900">{props.selectedCategory}</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Message Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare size={14} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Adım 2 — Mesaj İçeriği</h3>
              <p className="text-xs text-gray-400">SMS mesajınızı oluşturun</p>
            </div>
          </div>

          <div className="p-6">
            <textarea
              value={props.message}
              onChange={(e) => props.onMessageChange(e.target.value)}
              placeholder="SMS mesajınızı buraya yazın..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white resize-none leading-relaxed transition-all"
            />

            {/* Character progress */}
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      props.charCount > 160 ? "bg-amber-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <span className={`text-xs font-medium tabular-nums ${
                  props.charCount > 160 ? "text-amber-500" : "text-gray-400"
                }`}>
                  {props.charCount}/160
                </span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-medium text-gray-500">
                  <Type size={11} />
                  {props.charCount} karakter
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-[11px] font-medium text-gray-500">
                  <Hash size={11} />
                  {props.smsSegments} segment
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg text-[11px] font-semibold text-blue-600">
                  <Send size={11} />
                  Toplam: {totalSms} SMS
                </span>
                {props.charCount > 160 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg text-[11px] font-medium text-amber-600">
                    <AlertTriangle size={11} />
                    Birden fazla SMS
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={props.onSend}
                disabled={!props.message.trim() || props.sending}
                className="inline-flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-200"
              >
                {props.sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {props.sending ? "Gönderiliyor..." : `SMS Gönder (${props.estimatedRecipientCount} kişi)`}
              </button>
              <button
                type="button"
                onClick={props.onReset}
                className="inline-flex items-center gap-2 px-5 py-3 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <RotateCcw size={15} />
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <SmsPreview
            message={props.message}
            charCount={props.charCount}
            smsSegments={props.smsSegments}
          />
        </div>
      </div>
    </div>
  );
}
