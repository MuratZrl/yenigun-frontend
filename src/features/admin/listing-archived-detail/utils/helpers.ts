// src/features/admin/emlak-archived-detail/utils/helpers.ts

import type { AdvertData } from "../types";

export function stripHtml(html: string): string {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function getAddressText(address: AdvertData["address"]): string {
  if (!address) return "Adres bilgisi bulunamadı";
  const { province, district, quarter, full_address } = address;
  const parts = [quarter, full_address, district, province].filter(Boolean);
  return parts.join(", ");
}

export function isLowQualityImage(url: string | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("low-quality") || url.includes("thumbnail");
}

export function getSafePhotos(photos: unknown): string[] {
  if (!Array.isArray(photos)) return [];
  return photos.filter(
    (photo): photo is string => typeof photo === "string" && photo.trim() !== ""
  );
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  (e.target as HTMLImageElement).src = "/logo.png";
}