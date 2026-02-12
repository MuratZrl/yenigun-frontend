// src/features/ads/ui/detail/components/sections/BottomInfoSection.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData, FeatureValue } from "@/types/advert";

type SponsoredLink = {
  title: string;
  href: string;
  description?: string;
};

type Props = {
  data: AdvertData;
  className?: string;

  // Sponsorlu bağlantıları dışarıdan verebilirsin. Boş verince alan boş kalır.
  sponsoredLinks?: SponsoredLink[];
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  return String(v).trim();
}

// İstersen featureValues içinden de EIDS yakalamaya çalışır.
// (Backend resolve yokken “id/value” dünyasında yaşıyorsun, geçmiş olsun.)
function tryResolveEidsNoFromFeatureValues(data: AdvertData): string {
  const fv = (data as any)?.featureValues;
  const arr: FeatureValue[] = Array.isArray(fv) ? fv : [];

  // Senin örnekte EIDS No featureId: 69688c3fcd76859b79ca9772
  const EIDS_FEATURE_ID = "69688c3fcd76859b79ca9772";

  const hit = arr.find(
    (x) => String((x as any)?.featureId) === EIDS_FEATURE_ID,
  );
  const val = hit ? (hit as any)?.value : null;
  const t = toText(val);

  return t;
}

function SectionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-3 py-2 border-b border-gray-300 bg-gradient-to-b from-[#f7f7f7] to-[#e9e9e9]">
        <div className="text-[12px] font-semibold text-gray-900">{title}</div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function EidsBadge() {
  // Basit “onay” rozeti. İstersen bunu kendi asset’inle değiştir.
  return (
    <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center shrink-0">
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M7 12.5l3 3 7-8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function BottomInfoSection({
  data,
  className,
  sponsoredLinks = [],
}: Props) {
  const eidsNo = useMemo(() => {
    const direct = toText((data as any)?.eidsNo);
    if (direct) return direct;
    return tryResolveEidsNoFromFeatureValues(data);
  }, [data]);

  const hasEids = Boolean(eidsNo);

  return (
    <section className={cls("w-full mt-6 space-y-4", className)}>
      {/* EIDS */}
      {hasEids && (
        <SectionBox title="EİDS Bilgileri">
          <div className="flex items-center gap-4">
            <EidsBadge />
            <div className="text-[12px] text-gray-800 leading-5">
              Bu gayrimenkul için Ticaret Bakanlığı EİDS sisteminde ilan verme
              izni bulunmaktadır.
              <span className="text-gray-500"> (EİDS No: {eidsNo})</span>
            </div>
          </div>
        </SectionBox>
      )}
    </section>
  );
}
