// src/features/admin/users/ui/components/EditCustomerModal/utils.ts

import JSONDATA from "@/app/data.json";
import type { TurkeyCity } from "./types";

/* ------------------------------------------------------------------ */
/*  Phone formatting                                                   */
/* ------------------------------------------------------------------ */

export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");

  let formatted = numbers;
  if (numbers.length > 0 && !numbers.startsWith("0")) {
    formatted = "0" + numbers;
  }

  if (formatted.length > 1) {
    formatted = formatted.replace(
      /^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/,
      (_match, p1, p2, p3, p4, p5) => {
        let result = p1 as string;
        if (p2) result += ` (${p2}`;
        if (p3) result += `) ${p3}`;
        if (p4) result += ` ${p4}`;
        if (p5) result += ` ${p5}`;
        return result;
      },
    );
  }

  return formatted;
}

export function cleanPhoneNumber(formattedPhone: string): string {
  return formattedPhone.replace(/\D/g, "");
}

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
/*  Style constants                                                    */
/* ------------------------------------------------------------------ */

export const inputBase =
  "w-full h-[42px] text-sm text-black/87 bg-gray-50 border border-black/12 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-black/30";

export const labelClass =
  "block text-xs font-medium text-black/50 uppercase tracking-wider mb-1.5";

export const sectionClass = "space-y-4";

export const selectStyles = {
  control: (
    base: Record<string, unknown>,
    state: { isFocused: boolean },
  ) => ({
    ...base,
    minHeight: "42px",
    backgroundColor: state.isFocused ? "#fff" : "rgb(249 250 251)",
    border: state.isFocused
      ? "2px solid rgb(59 130 246)"
      : "1px solid rgba(0,0,0,0.12)",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 0px rgb(59 130 246)" : "none",
    "&:hover": {
      borderColor: state.isFocused
        ? "rgb(59 130 246)"
        : "rgba(0,0,0,0.2)",
    },
    fontSize: "0.875rem",
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: "rgba(0,0,0,0.30)",
    fontSize: "0.875rem",
  }),
  singleValue: (base: Record<string, unknown>) => ({
    ...base,
    color: "rgba(0,0,0,0.87)",
    fontSize: "0.875rem",
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    border: "1px solid rgba(0,0,0,0.06)",
    zIndex: 50,
  }),
  option: (
    base: Record<string, unknown>,
    state: { isSelected: boolean; isFocused: boolean },
  ) => ({
    ...base,
    fontSize: "0.875rem",
    backgroundColor: state.isSelected
      ? "rgb(59 130 246)"
      : state.isFocused
        ? "rgb(239 246 255)"
        : "white",
    color: state.isSelected ? "white" : "rgba(0,0,0,0.87)",
    "&:active": {
      backgroundColor: "rgb(219 234 254)",
    },
  }),
  indicatorSeparator: () => ({ display: "none" as const }),
};
