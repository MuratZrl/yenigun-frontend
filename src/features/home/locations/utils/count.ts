// src/features/home/locations/utils/count.ts
import type { AdvertLike, ListingPhoto } from "../types";

export function countByDistrict(data: AdvertLike[], district: string): number {
  if (!Array.isArray(data) || !district) return 0;
  let count = 0;

  for (const x of data) {
    if (x?.address?.district === district) count += 1;
  }

  return count;
}

/** Extract a usable URL from a ListingPhoto. */
function photoToUrl(photo: ListingPhoto): string | null {
  if (!photo) return null;
  if (typeof photo === "string" && photo.trim()) return photo.trim();
  if (typeof photo === "object" && typeof photo.url === "string" && photo.url.trim())
    return photo.url.trim();
  return null;
}

/** Get the first usable photo URL from an advert. */
function getFirstPhoto(advert: AdvertLike): string | null {
  if (!advert.photos?.length) return null;
  for (const p of advert.photos) {
    const url = photoToUrl(p);
    if (url) return url;
  }
  return null;
}

export type CityData = {
  count: number;
  image: string;
};

/**
 * Count adverts grouped by province (city) and pick a representative image.
 * Returns a Map of province name → { count, image }, sorted descending by count.
 */
export function countByProvince(data: AdvertLike[]): Map<string, CityData> {
  if (!Array.isArray(data)) return new Map();

  const counts = new Map<string, CityData>();

  for (const x of data) {
    const province = x?.address?.province?.trim();
    if (!province) continue;

    const existing = counts.get(province);
    if (existing) {
      existing.count += 1;
      // If we don't have an image yet, try this advert
      if (!existing.image) {
        existing.image = getFirstPhoto(x) || "";
      }
    } else {
      counts.set(province, {
        count: 1,
        image: getFirstPhoto(x) || "",
      });
    }
  }

  // Sort descending by count
  const sorted = new Map(
    [...counts.entries()].sort((a, b) => b[1].count - a[1].count)
  );

  return sorted;
}
