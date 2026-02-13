// src/features/ads/ui/detail/components/panels/LocationPanel.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData } from "@/types/advert";
import { MapPin, AlertTriangle } from "lucide-react";
import PublicGoogleMap from "@/components/PublicGoogleMap";

type Props = {
  data: AdvertData;

  className?: string;

  title?: string; // default: "Konum"
  showTitle?: boolean; // default true

  // "card": rounded modern kutu
  // "tableBox": eski desktop kutu (border + header)
  variant?: "card" | "tableBox"; // default "card"

  // Harita yüksekliği
  mapHeightClassName?: string; // default: "h-96" (card) / "h-[420px]" (tableBox gibi)

  // Adres kutusunu göster/gizle
  showAddressBox?: boolean; // default true

  // Koordinat yoksa ne yapalım?
  emptyText?: string; // default: "Konum bilgisi bulunamadı"
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeStr(v: any): string {
  return typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim();
}

function parseCoord(v: any): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function buildAddressText(data: AdvertData): string {
  const addr: any = (data as any)?.address;
  if (!addr) return "";

  const province = safeStr(addr?.province);
  const district = safeStr(addr?.district);
  const quarter = safeStr(addr?.quarter);
  const full = safeStr(addr?.full_address);

  const parts: string[] = [];
  if (quarter) parts.push(quarter);

  if (full && full !== quarter) parts.push(full);

  if (district) parts.push(district);
  if (province) parts.push(province);

  // unique
  return parts.filter((p, i) => parts.indexOf(p) === i).join(", ");
}

export default function LocationPanel({
  data,
  className,
  title = "Konum",
  showTitle = true,
  variant = "card",
  mapHeightClassName,
  showAddressBox = true,
  emptyText = "Konum bilgisi bulunamadı",
}: Props) {
  const addrText = useMemo(() => buildAddressText(data), [data]);

  const coords = useMemo(() => {
    const addr: any = (data as any)?.address || {};
    const mc: any = addr?.mapCoordinates || addr?.coordinates || {};
    const lat = parseCoord(mc?.lat ?? mc?.latitude);
    const lng = parseCoord(mc?.lng ?? mc?.lon ?? mc?.longitude);
    return { lat, lng, province: safeStr(addr?.province), district: safeStr(addr?.district) };
  }, [data]);

  const hasCoords = typeof coords.lat === "number" && typeof coords.lng === "number";

  const resolvedMapHeight =
    mapHeightClassName ?? (variant === "tableBox" ? "h-[420px]" : "h-96");

  if (variant === "tableBox") {
    return (
      <div className={cls("border border-gray-300 bg-white", className)}>
        {showTitle && (
          <div className="px-3 py-2 border-b border-gray-300 bg-white">
            <div className="font-semibold text-[12px] text-gray-900">
              Konumu ve Sokak Görünümü
            </div>
          </div>
        )}

        <div className="p-3">
          {showAddressBox && (
            <div className="text-[12px] text-gray-700 mb-2">
              {addrText || emptyText}
            </div>
          )}

          {hasCoords ? (
            <div className={cls("w-full overflow-hidden border border-gray-200", resolvedMapHeight)}>
              <PublicGoogleMap
                lat={coords.lat as number}
                lng={coords.lng as number}
                province={coords.province}
                district={coords.district}
              />
            </div>
          ) : (
            <div className="border border-gray-200 bg-gray-50 p-4 text-[12px] text-gray-700 flex items-start gap-2">
              <AlertTriangle size={14} className="text-gray-500 mt-[1px]" />
              <div>
                <div className="font-semibold text-gray-900">Harita gösterilemiyor</div>
                <div className="mt-1">{emptyText}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // card (default)
  return (
    <div className={cls("bg-white rounded-2xl shadow-sm border border-gray-200 p-6", className)}>
      {showTitle && (
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      )}

      {showAddressBox && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-600 mt-0.5 shrink-0" size={16} />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Tam Adres</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {addrText || emptyText}
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCoords ? (
        <div className={cls("w-full rounded-xl overflow-hidden", resolvedMapHeight)}>
          <PublicGoogleMap
            lat={coords.lat as number}
            lng={coords.lng as number}
            province={coords.province}
            district={coords.district}
          />
        </div>
      ) : (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle className="text-gray-500 mt-0.5" size={18} />
          <div>
            <div className="text-sm font-semibold text-gray-900">Harita gösterilemiyor</div>
            <div className="text-sm text-gray-600 mt-1">{emptyText}</div>
          </div>
        </div>
      )}
    </div>
  );
}
