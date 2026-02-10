// src/features/ads/ui/detail/components/shared/DesktopSpecRow.tsx
"use client";

import React from "react";

export type DesktopSpecRowProps = {
  label: string;
  value: React.ReactNode;
  important?: boolean;
  valueClassName?: string;
};

function isEmptyPrimitive(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (typeof v === "number" && (v === 0 || !Number.isFinite(v))) return true;
  if (v === "0") return true;
  return false;
}

/**
 * Desktop tablo satırı:
 * - value boşsa render etmez
 * - boolean ise Evet/Hayır’a çevirir
 * - important => kırmızı vurgular
 */
export default function DesktopSpecRow({
  label,
  value,
  important,
  valueClassName,
}: DesktopSpecRowProps) {
  // ReactNode boş kontrolü:
  // - string/number gibi primitive’leri kontrol et
  // - boolean React’te render edilmediği için burada çevir
  let displayValue: React.ReactNode = value;

  if (typeof value === "boolean") {
    displayValue = value ? "Evet" : "Hayır";
  }

  // ReactElement ise boş sayma (ör: <span/>)
  const isElement = React.isValidElement(displayValue);

  if (!isElement && isEmptyPrimitive(displayValue)) return null;

  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-[12px] leading-5 border-b border-dotted border-gray-300">
      <div className="text-gray-900 font-semibold whitespace-nowrap">{label}</div>

      <div
        className={[
          "text-right font-semibold",
          important ? "text-red-600" : "text-gray-900",
          valueClassName || "",
        ].join(" ")}
      >
        {displayValue}
      </div>
    </div>
  );
}
