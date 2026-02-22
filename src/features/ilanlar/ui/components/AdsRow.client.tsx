// src/features/ads/ui/components/AdsRow.client.tsx
"use client";

import Link from "next/link";
import type { Advert } from "@/types/advert";
import { formatTRY, getCityDistrict, hasValidImage, getGrossM2Text, getNetM2Text } from "../../model/utils";

/**
 * Kolon oranları (x bazlı):
 * Resim: 1x
 * Başlık: 3x
 * m² (net): 0.75x
 * m² (brüt): 0.75x
 * Oda: 0.5x
 * Fiyat: 1x
 * Tarih: 0.75x
 * İl/İlçe: 1x
 */
const GRID_COLS = "grid-cols-[1fr_3fr_.75fr_.75fr_.5fr_1fr_.75fr_1fr]";

function zebraClass(rowIndex?: number) {
  if (typeof rowIndex !== "number") return "bg-white";
  return rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
}

function formatTrDayMonth(ts?: number) {
  if (!ts) return { dm: "-", y: "-" };
  const d = new Date(ts);
  const dm = d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long" });
  const y = d.toLocaleDateString("tr-TR", { year: "numeric" });
  return { dm, y };
}

function getRoomText(ad: Advert): string {
  const v = ad.details?.roomCount;
  if (v === undefined || v === null) return "-";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v.trim() || "-";
  return "-";
}

function getFirstPhoto(ad: Advert): string | null {
  if (!ad.photos || !Array.isArray(ad.photos)) return null;
  return ad.photos.find((p) => typeof p === "string" && p.trim() !== "") ?? null;
}

export function AdsTableHeader() {
  const cell = "px-3 py-2 flex items-center justify-center border-l border-white/90 first:border-l-0";

  return (
    <div
      className={[
        "hidden md:grid w-full",
        GRID_COLS,
        "bg-gray-100",
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
          <div>(net)</div>
        </div>
      </div>

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
  const ts = ad.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const firstPhoto = hasValidImage(ad) ? getFirstPhoto(ad) : null;
  const imgSrc = firstPhoto || "/logo.png";
  const isFallback = !firstPhoto;

  const grossM2Text = getGrossM2Text(ad) || "-";
  const netM2Text = getNetM2Text(ad) || "-";
  const roomText = getRoomText(ad);

  return (
    <Link
      href={`/ilan/${ad.uid}`}
      key={ad.uid || fallbackKey}
      className={["block transition-colors hover:bg-gray-100/60", zebraClass(rowIndex)].join(" ")}
    >
      <div className={["hidden md:grid w-full", GRID_COLS, "items-stretch"].join(" ")}>
        {/* Resim */}
        <div className="px-3 py-2 flex items-center justify-center">
          <div className="w-full max-w-[120px] h-16 bg-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={imgSrc}
              alt={ad.title || "İlan görseli"}
              className={isFallback ? "w-full h-full object-contain p-2" : "w-full h-full object-cover"}
              onError={(e) => {
                e.currentTarget.src = "/logo.png";
                e.currentTarget.className = "w-full h-full object-contain p-2";
              }}
            />
          </div>
        </div>

        {/* Başlık */}
        <div className="px-3 py-2 min-w-0 flex flex-col justify-center">
          <div className="text-[13px] font-semibold text-blue-700 hover:underline line-clamp-2">
            {ad.title || "Başlık Yok"}
          </div>
        </div>

        {/* m² (net) */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="leading-tight">
            <div className="text-[13px] text-gray-800 whitespace-nowrap">{netM2Text}</div>
          </div>
        </div>

        {/* m² (brüt) */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="leading-tight">
            <div className="text-[13px] text-gray-800 whitespace-nowrap">{grossM2Text}</div>
          </div>
        </div>

        {/* Oda */}
        <div className="px-3 py-2 text-center border-l border-gray-100 flex items-center justify-center">
          <div className="text-[13px] text-gray-800 whitespace-nowrap">{roomText}</div>
        </div>

        {/* Fiyat */}
        <div className="px-3 py-2 text-right border-l border-gray-100 flex items-center justify-end">
          <div className="text-[13px] font-medium text-red-600 whitespace-nowrap">
            {formatTRY(ad.fee) || "Fiyat Yok"}
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
          {getCityDistrict(ad) || "-"}
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
  const firstPhotoMobile = hasValidImage(ad) ? getFirstPhoto(ad) : null;
  const imgSrc = firstPhotoMobile || "/logo.png";
  const isFallback = !firstPhotoMobile;

  const ts = ad.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const grossM2Text = getGrossM2Text(ad) || "-";
  const netM2Text = getNetM2Text(ad) || "-";
  const roomText = getRoomText(ad);

  return (
    <Link
      href={`/ilan/${ad.uid}`}
      key={ad.uid || fallbackKey}
      className={["block transition-colors hover:bg-gray-100/60", zebraClass(rowIndex)].join(" ")}
    >
      <div className="md:hidden flex gap-3 p-3">
        <div className="w-24 h-20 bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={ad.title || "İlan görseli"}
            className={isFallback ? "w-full h-full object-contain p-2" : "w-full h-full object-cover"}
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
              e.currentTarget.className = "w-full h-full object-contain p-2";
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-blue-700 line-clamp-2">
            {ad.title || "Başlık Yok"}
          </div>

          <div className="text-xs text-gray-500 mt-1 truncate">
            {ad.address?.province || ""}
            {ad.address?.district ? ` - ${ad.address.district}` : ""}
          </div>

          <div className="mt-1 text-[12px] text-gray-700 flex items-center gap-2">
            <span className="whitespace-nowrap">{netM2Text} net</span>
            <span className="text-gray-300">|</span>
            <span className="whitespace-nowrap">{grossM2Text} brüt</span>
            <span className="text-gray-300">|</span>
            <span className="whitespace-nowrap">{roomText} oda</span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-[13px] font-medium text-red-600 whitespace-nowrap">
              {formatTRY(ad.fee) || "Fiyat Yok"}
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
  const uid = ad.uid ?? fallbackKey;

  const firstPhotoGrid = hasValidImage(ad) ? getFirstPhoto(ad) : null;
  const imgSrc = firstPhotoGrid || "/logo.png";
  const isFallback = !firstPhotoGrid;

  const grossM2Text = getGrossM2Text(ad) || "-";
  const netM2Text = getNetM2Text(ad) || "-";
  const roomText = getRoomText(ad);

  const ts = ad.created?.createdTimestamp;
  const { dm, y } = formatTrDayMonth(ts);

  const title = ad.title || "Başlık Yok";
  const feeText = formatTRY(ad.fee) || "Fiyat Yok";
  const cityDistrict = getCityDistrict(ad) || "-";

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
            className={isFallback ? "w-full h-full object-contain p-3" : "w-full h-full object-cover"}
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
              m² (Net): <span className="font-semibold text-gray-900">{netM2Text}</span>
            </div>
            <div>
              m² (Brüt): <span className="font-semibold text-gray-900">{grossM2Text}</span>
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
