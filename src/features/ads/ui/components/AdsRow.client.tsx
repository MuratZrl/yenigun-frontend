// src/features/ads/ui/components/AdsRow.client.tsx
"use client";

import Link from "next/link";
import type { Advert } from "@/types/advert";
import { formatTRY, getCityDistrict, hasValidImage, getM2Text } from "../../model/utils";

/**
 * Kolon oranları (x bazlı):
 * Resim: 1x
 * Başlık: 3x
 * m²: 0.5x
 * Oda: 0.5x
 * Fiyat: 1x
 * Tarih: 0.75x
 * İl/İlçe: 1x
 */
const GRID_COLS = "grid-cols-[1fr_3fr_.5fr_.5fr_1fr_.75fr_1fr]";

function zebraClass(rowIndex?: number) {
  if (typeof rowIndex !== "number") return "bg-white";
  return rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
}

function formatTrDayMonth(ts?: number) {
  if (!ts) return { dm: "-", y: "-" };
  const d = new Date(ts);
  const dm = d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" }); // "10 Ocak"
  const y = d.toLocaleDateString("tr-TR", { year: "numeric" }); // "2026"
  return { dm, y };
}

/**
 * Oda sayısı alanı backend'e göre değişebilir.
 */
function getRoomText(ad: any): string {
  const v =
    ad?.rooms ??
    ad?.roomCount ??
    ad?.room ??
    ad?.oda ??
    ad?.details?.rooms ??
    ad?.specs?.rooms;

  if (v === 0) return "0";
  if (!v) return "-";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v.trim() || "-";
  return "-";
}

export function AdsTableHeader() {
  const cell = "px-3 py-2 flex items-center justify-center border-l border-white/90 first:border-l-0";

  return (
    <div
      className={[
        "hidden md:grid w-full",
        GRID_COLS,
        "bg-gray-100",              // ✅ hafif gri header bg
        "text-xs font-semibold text-gray-700",
        "border-b border-gray-200",
        "border-t border-gray-200",
        "items-center",
      ].join(" ")}
    >
      <div className={cell}>İlan Resmi</div>

      <div className={cell}>İlan Başlığı</div>

      <div className={cell}>
        <div className="text-center leading-tight">
          <div>m²</div>
          <div>(brüt)</div>
        </div>
      </div>

      <div className={cell}>
        <div className="text-center leading-tight">
          <div>Oda</div>
          <div>Sayısı</div>
        </div>
      </div>

      <div className={cell}>Fiyat</div>

      <div className={cell}>İlan Tarihi</div>

      <div className={cell}>İl / İlçe</div>
    </div>
  );
}


export function AdsRowDesktop({
  ad,
  fallbackKey,
  rowIndex,
}: {
  ad: Advert;
  fallbackKey: number;
  rowIndex?: number;
}) {
  const ts = (ad as any)?.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const imgSrc =
    (hasValidImage(ad) ? (ad as any)?.photos?.find((p: any) => typeof p === "string") : null) ||
    "/logo.png";

  const m2Text = getM2Text(ad as any) || "-";
  const roomText = getRoomText(ad as any);

  return (
    <Link
      href={`/ilan/${(ad as any)?.uid}`}
      key={(ad as any)?.uid || fallbackKey}
      className={["block transition-colors hover:bg-gray-100/60", zebraClass(rowIndex)].join(" ")}
    >
      <div className={["hidden md:grid w-full", GRID_COLS, "items-stretch"].join(" ")}>
        {/* Resim */}
        <div className="px-3 py-2 flex items-center justify-center">
          <div className="w-full max-w-[120px] h-16 bg-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={imgSrc}
              alt={(ad as any)?.title || "İlan görseli"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
                e.currentTarget.className = "w-full h-full object-contain p-2";
              }}
            />
          </div>
        </div>

        {/* Başlık (alt satır YOK: Satılık/Kiralık vs yazmayacak) */}
        <div className="px-3 py-2 min-w-0 flex flex-col justify-center">
          <div className="text-[13px] font-semibold text-blue-700 hover:underline line-clamp-2">
            {(ad as any)?.title || "Başlık Yok"}
          </div>
        </div>

        {/* m² + (brüt) */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="leading-tight">
            <div className="text-[13px] text-gray-800 whitespace-nowrap">{m2Text}</div>
          </div>
        </div>

        {/* Oda */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="text-[13px] text-gray-800 whitespace-nowrap">{roomText}</div>
        </div>

        {/* Fiyat */}
        <div className="px-3 py-2 text-right border-l border-gray-100 flex items-center justify-end">
          <div className="text-[13px] font-medium text-red-600 whitespace-nowrap">
            {formatTRY((ad as any)?.fee) || "Fiyat Yok"}
          </div>
        </div>

        {/* Tarih */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="leading-tight">
            <div className="text-[13px] font-medium text-gray-900">{dm}</div>
            <div className="text-[12px] text-gray-500">{y}</div>
          </div>
        </div>

        {/* İl/İlçe */}
        <div className="px-3 py-2 text-center text-[13px] text-gray-800 border-l border-gray-100 flex items-center justify-center whitespace-pre-line">
          {getCityDistrict(ad as any) || "-"}
        </div>
      </div>
    </Link>
  );
}

export function AdsRowMobile({
  ad,
  fallbackKey,
  rowIndex,
}: {
  ad: Advert;
  fallbackKey: number;
  rowIndex?: number;
}) {
  const imgSrc =
    (hasValidImage(ad) ? (ad as any)?.photos?.find((p: any) => typeof p === "string") : null) ||
    "/logo.png";

  const ts = (ad as any)?.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const m2Text = getM2Text(ad as any) || "-";
  const roomText = getRoomText(ad as any);

  return (
    <Link
      href={`/ilan/${(ad as any)?.uid}`}
      key={(ad as any)?.uid || fallbackKey}
      className={["block transition-colors hover:bg-gray-100/60", zebraClass(rowIndex)].join(" ")}
    >
      <div className="md:hidden flex gap-3 p-3">
        <div className="w-24 h-20 bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={(ad as any)?.title || "İlan görseli"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
              e.currentTarget.className = "w-full h-full object-contain p-2";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-blue-700 line-clamp-2">
            {(ad as any)?.title || "Başlık Yok"}
          </div>

          <div className="text-xs text-gray-500 mt-1 truncate">
            {(ad as any)?.address?.province || ""}
            {(ad as any)?.address?.district ? ` - ${(ad as any)?.address.district}` : ""}
          </div>

          <div className="mt-1 text-[12px] text-gray-700 flex items-center gap-2">
            <span className="whitespace-nowrap">
            </span>
            <span className="text-gray-300">|</span>
            <span className="whitespace-nowrap">{roomText} oda</span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-[13px] font-medium text-red-600 whitespace-nowrap">
              {formatTRY((ad as any)?.fee) || "Fiyat Yok"}
            </div>

            <div className="text-right leading-tight whitespace-nowrap">
              <div className="text-[12px] font-medium text-gray-900">{dm}</div>
              <div className="text-[11px] text-gray-500">{y}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AdsGridCard({
  ad,
  fallbackKey,
}: {
  ad: Advert;
  fallbackKey: number;
}) {
  const uid = (ad as any)?.uid ?? fallbackKey;

  const imgSrc =
    (hasValidImage(ad) ? (ad as any)?.photos?.find((p: any) => typeof p === "string") : null) ||
    "/logo.png";

  const m2Text = getM2Text(ad as any) || "-";
  const roomText = getRoomText(ad as any);

  const ts = (ad as any)?.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const title = (ad as any)?.title || "Başlık Yok";
  const feeText = formatTRY((ad as any)?.fee) || "Fiyat Yok";
  const cityDistrict = getCityDistrict(ad as any) || "-";

  return (
    <Link
      href={`/ilan/${uid}`}
      key={uid}
      className="block bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="flex gap-3 p-3">
        {/* SOL: Resim */}
        <div className="w-32 h-24 bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
              e.currentTarget.className = "w-full h-full object-contain p-3";
            }}
          />
        </div>

        {/* SAĞ: Metin */}
        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-gray-400">
            #{uid}
          </div>

          <div className="text-[13px] font-semibold text-blue-700 line-clamp-2">
            {title}
          </div>
          <div className="mt-1 text-[13px] font-medium text-red-600 whitespace-nowrap">
            {feeText}
          </div>

          <div className="mt-2 text-[12px] text-gray-700 space-y-1">
            <div>
              m² (Brüt): <span className="font-semibold text-gray-900">{m2Text}</span>
            </div>
            <div>
              Oda Sayısı: <span className="font-semibold text-gray-900">{roomText}</span>
            </div>
            <div>
              İlan Tarihi: <span className="font-semibold text-gray-900">{dm} {y}</span>
            </div>
            <div>
              İl / İlçe: <span className="font-semibold text-gray-900">{cityDistrict}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
