// src/features/ads/ui/detail/components/sections/AdvisorSection.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Check, Copy, Phone, MessageCircle } from "lucide-react";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import type { AdvertData } from "@/types/advert";
import Image from "next/image";

type Props = {
  data: AdvertData;

  className?: string;

  // Logo alanı (mobile kartta)
  brandName?: string; // default: "Yenigün Emlak"
  logoSrc?: string; // default: "/logo.png"

  // Güvenlik ipucu metinleri
  showSafetyTips?: boolean; // default true
  safetyTitle?: string;
  safetyBody?: string;
  safetyLinkText?: string;
  onSafetyLinkClick?: () => void;

  // WhatsApp mesaj template override
  buildWhatsAppText?: (data: AdvertData) => string;

  // Kopyalama sonrası toast süresi
  copiedMs?: number; // default 2000

  // Eğer backend bazen phone boş dönüyorsa
  fallbackPhone?: string; // default "5322328405"
};

function safeStr(v: any): string {
  return typeof v === "string" ? v.trim() : String(v ?? "").trim();
}

function getAdvisorName(data: AdvertData): string {
  const n = safeStr((data as any)?.advisor?.name);
  const s = safeStr((data as any)?.advisor?.surname);
  const full = [n, s].filter(Boolean).join(" ").trim();
  return full || "Danışman";
}

function getAdvisorPhone(data: AdvertData, fallbackPhone: string): string {
  // senin eski dosyada data.advisor.gsmNumber kullanılıyordu
  const phone =
    safeStr((data as any)?.advisor?.gsmNumber) ||
    safeStr((data as any)?.advisor?.phone) ||
    safeStr((data as any)?.advisor?.mobile);

  // sade sayıya çevir (tel: ve wa için)
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits : fallbackPhone;
}

export default function AdvisorSection({
  data,
  className,

  brandName = "Yenigün Emlak",
  logoSrc = "/logo.png",

  showSafetyTips = true,
  safetyTitle = "Güvenlik İpuçları",
  safetyBody = "Kiralayacağınız gayrimenkulü görmeden kapora ve benzeri bir ödeme gerçekleştirmeyin.",
  safetyLinkText = "Detaylı bilgi için tıklayın.",
  onSafetyLinkClick,

  buildWhatsAppText,
  copiedMs = 2000,
  fallbackPhone = "5322328405",
}: Props) {
  const [copied, setCopied] = useState(false);

  const advisorName = useMemo(() => getAdvisorName(data), [data]);
  const phoneDigits = useMemo(
    () => getAdvisorPhone(data, fallbackPhone),
    [data, fallbackPhone],
  );

  const formattedPhone = useMemo(
    () => formatPhoneNumber(phoneDigits),
    [phoneDigits],
  );

  const waText = useMemo(() => {
    if (buildWhatsAppText) return buildWhatsAppText(data);

    const title = safeStr((data as any)?.title) || "ilan";
    const n = safeStr((data as any)?.advisor?.name);
    const s = safeStr((data as any)?.advisor?.surname);
    const who = [n, s].filter(Boolean).join(" ").trim();
    const prefix = who ? `Merhaba, ${who},` : "Merhaba,";
    return `${prefix} ${title} ilanınızla ilgileniyorum.`;
  }, [data, buildWhatsAppText]);

  const waUrl = useMemo(() => {
    // TR: 90 + 10 haneli
    return `https://wa.me/90${phoneDigits}?text=${encodeURIComponent(waText)}`;
  }, [phoneDigits, waText]);

  const telUrl = useMemo(() => `tel:${phoneDigits}`, [phoneDigits]);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneDigits);
      setCopied(true);
      window.setTimeout(() => setCopied(false), copiedMs);
    } catch {
      // clipboard yoksa da sessizce geç, dünya zaten yeterince kötü
      setCopied(false);
    }
  };

  return (
    <section className={["w-full", className || ""].join(" ")}>
      {/* DESKTOP: sağ kolon kartı + güvenlik ipuçları */}
      <div className="hidden lg:block">
        <div className="border border-gray-300 bg-white">
          <div className="p-3 border-b border-gray-300">
            <div className="text-[12px] font-semibold text-gray-900">
              {advisorName}
            </div>
          </div>

          <div className="p-3">
            <div className="text-[11px] text-gray-500">Cep</div>

            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="text-[12px] font-bold text-gray-900 whitespace-nowrap">
                {formattedPhone}
              </div>

              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-600" /> Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Kopyala
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href={telUrl}
                className="w-full h-8 border border-gray-300 bg-gray-50 text-[12px] font-semibold text-gray-700 hover:bg-white flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                Ara
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-8 border border-gray-300 bg-white text-[12px] font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => console.log("Mesaj Gönder")}
                className="w-full h-8 border border-gray-300 bg-gray-50 text-[12px] font-semibold text-gray-700 hover:bg-white"
              >
                Mesaj Gönder
              </button>
            </div>
          </div>
        </div>

        {showSafetyTips && (
          <div className="mt-3 border border-gray-300 bg-white p-3">
            <div className="text-[12px] font-bold text-blue-700">
              {safetyTitle}
            </div>
            <div className="mt-2 text-[11px] text-gray-700 leading-4">
              {safetyBody}
            </div>

            <button
              type="button"
              onClick={onSafetyLinkClick}
              className="mt-2 text-[11px] text-blue-700 hover:underline cursor-pointer"
            >
              {safetyLinkText}
            </button>
          </div>
        )}
      </div>

      {/* MOBILE: ayrı kart */}
      <div className="lg:hidden mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-14 bg-white flex items-center justify-center rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <Image
                src={logoSrc}
                alt={brandName}
                className="w-full h-full select-none object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.png";
                }}
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-lg text-gray-900">{brandName}</h3>
              <p className="text-sm text-gray-500 truncate">{advisorName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
              <span className="font-mono text-sm text-gray-900 tracking-wide">
                {formattedPhone}
              </span>
              <button
                type="button"
                onClick={copyNumber}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs"
              >
                {copied ? (
                  <Check className="text-green-500" size={16} />
                ) : (
                  <Copy className="text-gray-600" size={16} />
                )}
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>

            <a
              href={telUrl}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Phone size={16} />
              Telefonla Ara
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={16} />
              WhatsApp&apos;tan Yaz
            </a>
          </div>

          {showSafetyTips && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs font-semibold text-blue-700">
                {safetyTitle}
              </div>
              <div className="mt-2 text-xs text-gray-600 leading-5">
                {safetyBody}
              </div>
              <button
                type="button"
                onClick={onSafetyLinkClick}
                className="mt-2 text-xs text-blue-700 hover:underline"
              >
                {safetyLinkText}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
