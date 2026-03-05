// src/features/category-detail/ui/components/DynamicSearch/utils.ts

import JSONDATA from "@/app/data.json";
import type { Advert } from "@/types/search";
import type { JsonCity, JsonTown, JsonDistrict, JsonQuarter, TurkeyCity } from "./types";

/* ── Build city/district/quarter lookup from JSON ── */

export const turkeyCities: TurkeyCity[] = (JSONDATA as JsonCity[]).map(
  (city: JsonCity) => ({
    province: city.name,
    districts: city.towns.map((town: JsonTown) => ({
      district: town.name,
      quarters: town.districts.reduce<string[]>(
        (acc: string[], dist: JsonDistrict) => {
          const quarterNames = dist.quarters.map((q: JsonQuarter) => q.name);
          return acc.concat(quarterNames);
        },
        [],
      ),
    })),
  }),
);

/* ── Address cleaning (handles API inconsistency where full_address can be nested) ── */

interface RawAddress {
  province?: string;
  district?: string;
  quarter?: string;
  full_address?: string | { full_address?: string };
  [key: string]: unknown;
}

export const cleanAddressData = (
  address: RawAddress | undefined | null,
): RawAddress | undefined | null => {
  if (!address || typeof address !== "object") return address;

  const cleaned = { ...address };

  if (cleaned.full_address && typeof cleaned.full_address === "object") {
    cleaned.full_address =
      (cleaned.full_address as { full_address?: string }).full_address ||
      `${cleaned.province || ""}, ${cleaned.district || ""}, ${cleaned.quarter || ""}`;
  }

  return cleaned;
};

export const cleanAdvertData = (advert: Advert): Advert => {
  if (!advert.address) return advert;

  return {
    ...advert,
    address: cleanAddressData(advert.address as unknown as RawAddress) as unknown as Advert["address"],
  };
};
