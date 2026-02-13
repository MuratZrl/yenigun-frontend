// src/features/ads/ui/detail/components/sections/BottomActionBar.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData } from "@/types/advert";

type Props = {
  data: AdvertData;

  className?: string;

  // Eğer advisor telefonu bazen boş geliyorsa
  fallbackPhone?: string; // default: "5322328405"

  // WhatsApp metni override edilebilir
  buildWhatsAppText?: (data: AdvertData) => string;

  // Bar görünürlüğü (ör: belirli sayfalarda kapatmak istersin)
  enabled?: boolean; // default true

  // Desktop’ta da gösterilsin mi? (default false)
  showOnDesktop?: boolean; // default false

  // Buton yazıları
  callLabel?: string; // default "Ara"
  whatsappLabel?: string; // default "WhatsApp"
};

function safeStr(v: any): string {
  return typeof v === "string" ? v.trim() : String(v ?? "").trim();
}

function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

function getPhoneDigits(data: AdvertData, fallback: string): string {
  const raw =
    safeStr((data as any)?.advisor?.gsmNumber) ||
    safeStr((data as any)?.advisor?.phone) ||
    safeStr((data as any)?.advisor?.mobile) ||
    "";

  const d = digitsOnly(raw);
  return d.length >= 10 ? d : fallback;
}

export default function BottomActionBar({
  data,
  className,
  fallbackPhone = "5322328405",
  buildWhatsAppText,
  enabled = true,
  showOnDesktop = false,
  callLabel = "Ara",
  whatsappLabel = "WhatsApp",
}: Props) {
  const phoneDigits = useMemo(() => getPhoneDigits(data, fallbackPhone), [data, fallbackPhone]);

  const telHref = useMemo(() => `tel:${phoneDigits}`, [phoneDigits]);

  const waText = useMemo(() => {
    if (buildWhatsAppText) return buildWhatsAppText(data);

    const title = safeStr((data as any)?.title) || "ilan";
    return `Merhaba, ${title} ilanınızla ilgileniyorum.`;
  }, [data, buildWhatsAppText]);

  const waHref = useMemo(() => {
    // TR: 90 + 10 haneli varsayımı
    return `https://wa.me/90${phoneDigits}?text=${encodeURIComponent(waText)}`;
  }, [phoneDigits, waText]);

  if (!enabled) return null;

  return (
    <div className={showOnDesktop ? "" : "lg:hidden"}>
      <div
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white border-t border-gray-200",
          "px-3 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]",
          className || "",
        ].join(" ")}
        role="region"
        aria-label="İlan hızlı aksiyonlar"
      >
        <div className="grid grid-cols-2 gap-3">
          <a
            href={telHref}
            className="h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center active:opacity-90"
          >
            {callLabel}
          </a>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-md bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center active:opacity-90"
          >
            {whatsappLabel}
          </a>
        </div>
      </div>

      {/* Bar içerik kaplamasın diye sayfa sonuna boşluk */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
