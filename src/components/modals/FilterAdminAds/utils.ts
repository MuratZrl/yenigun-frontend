// src/components/modals/FilterAdminAds/utils.ts

import JSONDATA from "@/app/data.json";
import type {
  TurkeyCity,
  RangeValue,
  FeatureFilterValue,
  ApiResponse,
  Feature,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Turkey cities from data.json                                       */
/* ------------------------------------------------------------------ */

interface JsonQuarter {
  name: string;
}
interface JsonDistrict {
  name: string;
  quarters?: JsonQuarter[];
}
interface JsonTown {
  name: string;
  districts?: JsonDistrict[];
}
interface JsonCity {
  name: string;
  towns?: JsonTown[];
}

export function buildTurkeyCities(): TurkeyCity[] {
  return (JSONDATA as JsonCity[]).map((city) => ({
    province: city.name,
    districts: (city.towns ?? []).map((town) => ({
      district: town.name,
      quarters: (town.districts ?? []).reduce<string[]>((acc, d) => {
        const names = (d.quarters ?? []).map((q) => q.name);
        return acc.concat(names);
      }, []),
    })),
  }));
}

/* ------------------------------------------------------------------ */
/*  API helpers                                                        */
/* ------------------------------------------------------------------ */

export function unwrapArray<T>(res: ApiResponse): T[] {
  const root = res?.data ?? res;
  const rootObj = root as Record<string, unknown>;
  const maybe =
    (rootObj?.data as Record<string, unknown>)?.data ??
    rootObj?.data ??
    rootObj?.items ??
    rootObj?.categories ??
    root;

  return Array.isArray(maybe) ? (maybe as T[]) : [];
}

/* ------------------------------------------------------------------ */
/*  General helpers                                                    */
/* ------------------------------------------------------------------ */

export function safeArr<T>(v: T[] | null | undefined): T[] {
  return Array.isArray(v) ? v : [];
}

export function normalizeCategoryPath(parts: (string | null | undefined)[]) {
  return parts.filter(Boolean).join(" > ");
}

export function countTruthy(
  obj: Record<string, string | number | boolean | null | undefined>,
) {
  return Object.values(obj).filter(Boolean).length;
}

export function isMeaningfulFeatureValue(v: FeatureFilterValue): boolean {
  if (v === undefined || v === null) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    const range = v as RangeValue;
    return (
      (range.min !== undefined && range.min !== null) ||
      (range.max !== undefined && range.max !== null)
    );
  }
  if (v === false) return false;
  return true;
}

export function initFeatureFilters(
  features: Feature[],
): Record<string, FeatureFilterValue> {
  const next: Record<string, FeatureFilterValue> = {};
  for (const f of features) {
    if (f.type === "multi_select") next[f._id] = [];
    else if (f.type === "range") next[f._id] = { min: null, max: null };
  }
  return next;
}
