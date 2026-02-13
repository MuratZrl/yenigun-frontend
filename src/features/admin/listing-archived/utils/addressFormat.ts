// src/features/admin/emlak-archived/utils/addressFormat.ts

import type { AdvertAddress } from "../types";

/**
 * Renders full address string safely, handling nested/malformed data.
 * Returns a human-readable string — never throws.
 */
export function renderAddressSafely(address: unknown): string {
  try {
    if (!address) return "Adres bilgisi yok";

    if (typeof address === "string") return address;

    if (typeof address !== "object") return "Geçersiz adres formatı";

    const obj = address as Record<string, any>;

    // Try full_address first
    if (obj.full_address) {
      if (typeof obj.full_address === "string") return obj.full_address;

      // Handle nested full_address object
      if (typeof obj.full_address === "object") {
        const nested = obj.full_address.full_address;
        if (typeof nested === "string") return nested;
      }
    }

    // Fall back to province / district / quarter
    const province = String(obj.province || "").trim();
    const district = String(obj.district || "").trim();
    const quarter = String(obj.quarter || "").trim();

    const parts = [province, district, quarter].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Adres bilgisi yok";
  } catch {
    return "Adres render hatası";
  }
}

/**
 * Renders location string (province / district / quarter) safely.
 * Separator is " / " for readability in compact UI elements.
 */
export function renderLocationSafely(address: unknown): string {
  try {
    if (!address) return "Konum bilgisi yok";

    if (typeof address === "string") return address;

    if (typeof address !== "object") return "Geçersiz konum formatı";

    const obj = address as Record<string, any>;

    const province = String(obj.province || "").trim();
    const district = String(obj.district || "").trim();
    const quarter = String(obj.quarter || "").trim();

    const parts = [province, district, quarter].filter(Boolean);
    return parts.length > 0 ? parts.join(" / ") : "Konum bilgisi yok";
  } catch {
    return "Konum render hatası";
  }
}