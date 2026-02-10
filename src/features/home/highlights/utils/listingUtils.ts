// src/features/home/highlights/utils/listingUtils.ts
import type { Listing, ListingPhoto } from "../types";

export function stripHtml(input?: string | null): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").trim();
}

export function truncate(text: string, maxLen: number): string {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "...";
}

function photoToUrl(photo: ListingPhoto): string | null {
  if (!photo) return null;
  if (typeof photo === "string") return photo;
  if (typeof photo === "object" && typeof photo.url === "string" && photo.url.trim())
    return photo.url.trim();
  return null;
}

export function getFirstPhotoUrl(listing: Listing): string | null {
  const photos = listing.photos ?? [];
  for (const p of photos) {
    const url = photoToUrl(p);
    if (url) return url;
  }
  return null;
}

export function hasValidPhoto(listing: Listing): boolean {
  return Boolean(getFirstPhotoUrl(listing));
}

export function getLocationText(listing: Listing): string {
  const province = listing.address?.province?.trim();
  const district = listing.address?.district?.trim();

  if (province && district) return `${province} / ${district}`;
  if (province) return province;
  if (district) return district;
  return "Lokasyon yok";
}

export function getFeeText(fee: Listing["fee"]): string | null {
  if (fee === null || fee === undefined) return null;
  if (typeof fee === "number" && Number.isFinite(fee)) return String(fee);
  if (typeof fee === "string") {
    const t = fee.trim();
    return t ? t : null;
  }
  return null;
}

export function getAreaSqm(listing: Listing): number | null {
  const raw = listing.details?.acre;

  if (raw === false || raw === null || raw === undefined) return null;

  const num =
    typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d]/g, ""));

  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}

export function getThoughtPreview(listing: Listing, maxLen = 80): string | null {
  const clean = stripHtml(listing.thoughts ?? "");
  if (!clean) return null;
  return truncate(clean, maxLen);
}
