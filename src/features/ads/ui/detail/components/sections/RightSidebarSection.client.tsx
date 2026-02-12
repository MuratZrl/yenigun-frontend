// src/features/ads/ui/detail/components/sections/RightSidebarSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { PhoneCall, MessageSquareText } from "lucide-react";

import type { AdvertData } from "@/types/advert";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

type Props = {
  data: AdvertData;
  className?: string;
};

function safeText(v: unknown) {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

export default function RightSidebarSection({ data, className }: Props) {
  const advisorName = useMemo(() => {
    const n = safeText((data as any)?.advisor?.name);
    const s = safeText((data as any)?.advisor?.surname);
    const full = `${n} ${s}`.trim();
    return full || "Danışman";
  }, [data]);

  const accountCreatedText = useMemo(() => {
    // Backend çoğu zaman bunu vermez. Varsa kullan, yoksa “Bilinmiyor”.
    const createdAt =
      (data as any)?.advisor?.createdAt ||
      (data as any)?.advisor?.created ||
      (data as any)?.advisor?.registeredAt ||
      null;

    if (!createdAt) return "Bilinmiyor";

    const d = new Date(createdAt);
    if (Number.isNaN(d.getTime())) return "Bilinmiyor";

    return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
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

  return (
    <aside className={className ?? ""}>
      <div className="lg:sticky lg:top-4 space-y-3">
        {/* Danışman Kartı */}
        <div className="border border-gray-300 bg-white">
          <div className="p-3">
            <div className="text-[14px] font-semibold text-gray-900">
              {advisorName}
            </div>

            <div className="mt-3 border border-gray-200 bg-white">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-[13px] text-gray-700">Cep</div>
                <div className="text-[13px] font-semibold text-gray-900">
                  {phoneDisplay || "-"}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 w-full h-9 border border-gray-300 bg-white text-[13px] font-medium text-blue-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
              onClick={() => {
                // Şimdilik UI butonu; gerçek mesajlaşma varsa burada route/modal açarsın.
                console.log("Mesaj gönder");
              }}
            >
              <PhoneCall size={16} />
              Telefonla Ara
            </button>
            <button
              type="button"
              className="mt-3 w-full h-9 border border-gray-300 bg-white text-[13px] font-medium text-blue-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
              onClick={() => {
                // Şimdilik UI butonu; gerçek mesajlaşma varsa burada route/modal açarsın.
                console.log("Mesaj gönder");
              }}
            >
              <MessageSquareText size={16} />
              Mesaj gönder
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
