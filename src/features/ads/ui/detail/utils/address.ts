// src/features/ads/ui/detail/utils/address.ts

export type MapCoordinates = {
  lat?: number | string | null;
  lng?: number | string | null;
};

export type AddressLike = {
  province?: string | null;
  district?: string | null;
  quarter?: string | null;
  full_address?: string | null;
  mapCoordinates?: MapCoordinates | null;
};

function cleanText(v: unknown): string {
  const s = String(v ?? "").trim();
  return s;
}

function uniqStable(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const it of items) {
    if (!it) continue;
    if (seen.has(it)) continue;
    seen.add(it);
    out.push(it);
  }
  return out;
}

/**
 * UI’da gösterilecek “tam adres” metnini üretir.
 * quarter + full_address + district + province kombinasyonunu
 * boşluklardan arındırıp tekrarları atarak birleştirir.
 */
export function buildAddressText(address?: AddressLike | null): string {
  if (!address) return "Adres bilgisi bulunamadı";

  const province = cleanText(address.province);
  const district = cleanText(address.district);
  const quarter = cleanText(address.quarter);
  const full = cleanText(address.full_address);

  const parts: string[] = [];

  if (quarter) parts.push(quarter);

  if (full && full !== quarter) parts.push(full);

  if (district) parts.push(district);
  if (province) parts.push(province);

  const uniq = uniqStable(parts);
  return uniq.length ? uniq.join(", ") : "Adres bilgisi bulunamadı";
}

function toNumber(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Harita bileşeni için lat/lng’i güvenli şekilde sayıya çevirir.
 * Parse edilemiyorsa 0 döndürür ki component patlamasın.
 */
export function getLatLng(address?: AddressLike | null): { lat: number; lng: number } {
  const lat = toNumber(address?.mapCoordinates?.lat) ?? 0;
  const lng = toNumber(address?.mapCoordinates?.lng) ?? 0;
  return { lat, lng };
}
