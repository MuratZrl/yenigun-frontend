// src/features/home/locations/utils/count.ts
import type { AdvertLike } from "../types";

export function countByDistrict(data: AdvertLike[], district: string): number {
  if (!Array.isArray(data) || !district) return 0;
  let count = 0;

  for (const x of data) {
    if (x?.address?.district === district) count += 1;
  }

  return count;
}
