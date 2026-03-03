// src/features/ilanlar/ui/detail/components/sections/StickyInfoBar.client.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { MapPin, Home, Maximize } from "lucide-react";
import type { AdvertData } from "@/types/advert";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

type Props = {
  data: AdvertData;
};

function safeText(v: unknown) {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

export default function StickyInfoBar({ data }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const title = safeText(data?.title);

  const fee = useMemo(() => {
    const raw = safeText(data?.fee);
    if (!raw) return "Fiyat yok";
    const cleaned = raw.replace(/\s*(TL|₺|USD|\$|EUR|€|GBP|£)\s*/gi, "").trim();
    const match = raw.match(/(TL|₺|USD|\$|EUR|€|GBP|£)/i);
    const currency = match ? (match[1] === "₺" ? "TL" : match[1]) : "TL";
    return cleaned ? `${cleaned} ${currency}` : raw;
  }, [data]);

  const district = safeText(data?.address?.district);
  const grossArea = safeText(data?.details?.grossArea);
  const roomCount = safeText(data?.details?.roomCount);

  const advisorName = useMemo(() => {
    const n = safeText(data?.advisor?.name);
    const s = safeText(data?.advisor?.surname);
    return `${n} ${s}`.trim() || "Danışman";
  }, [data]);

  const profilePicture = useMemo(() => {
    return safeText((data as any)?.advisor?.profilePicture);
  }, [data]);

  const initials = useMemo(() => {
    const n = safeText(data?.advisor?.name);
    const s = safeText(data?.advisor?.surname);
    return `${n.charAt(0)}${s.charAt(0)}`.toUpperCase() || "D";
  }, [data]);

  const phoneRaw = useMemo(() => {
    return (
      safeText((data as any)?.advisor?.gsmNumber) ||
      safeText((data as any)?.advisor?.phone) ||
      safeText((data as any)?.advisor?.gsm) ||
      ""
    );
  }, [data]);

  const phoneDisplay = useMemo(() => {
    if (!phoneRaw) return "";
    try {
      return formatPhoneNumber(phoneRaw);
    } catch {
      return phoneRaw;
    }
  }, [phoneRaw]);

  const createdDate = useMemo(() => {
    const ts = (data as any)?.created?.createdTimestamp;
    if (!ts) return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  }, [data]);

  return (
    <div
      className={`fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 top-[104px] ${visible ? "translate-y-0" : "-translate-y-[200%]"}`}
    >
      <div className="max-w-6xl mx-auto px-3 lg:px-4 py-1 lg:py-0.5 flex items-center justify-between gap-3 lg:gap-6">
        {/* Left — listing info */}
        <div className="min-w-0 flex-1">
          <h2 className="text-xs sm:text-sm lg:text-base font-medium text-gray-900 truncate">
            {title}
          </h2>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mt-0.5 lg:mt-1 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-blue-700 whitespace-nowrap">
              {fee}
            </span>

            {district && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                <MapPin size={12} className="text-gray-400 sm:hidden" />
                <MapPin size={13} className="text-gray-400 hidden sm:block" />
                {district}
              </span>
            )}

            {grossArea && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                <Maximize size={12} className="text-gray-400 sm:hidden" />
                <Maximize size={13} className="text-gray-400 hidden sm:block" />
                {grossArea}m² (brüt)
              </span>
            )}

            {roomCount && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Home size={13} className="text-gray-400" />
                {roomCount}
              </span>
            )}
          </div>
        </div>

        {/* Right — advisor contact card (desktop + tablet only) */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0 relative top-4 rounded-lg px-6 lg:px-12 py-2 lg:py-3 min-w-[240px] lg:min-w-[320px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.15)]">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={advisorName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {initials}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {advisorName}
            </div>
            {createdDate && (
              <div className="text-xs text-gray-400 mt-1 lg:mt-1.5">
                Hesap açma tarihi  {createdDate}
              </div>
            )}
            {phoneDisplay && (
              <div className="text-xs text-blue-600 font-medium mt-1 lg:mt-1.5">
                {phoneDisplay}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
