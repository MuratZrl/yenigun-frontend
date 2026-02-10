// src/features/ads/ui/components/filter/TotalFloorsBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * FilterState içinde kat sayısını tuttuğun alan adı.
   * Varsayılan: "totalFloors"
   * (çoklu seçim olduğu için string[] bekliyoruz; tekil tutuyorsan gene de diziye çeviriyoruz)
   */
  filterKey?: string;

  title?: string;
  defaultOpen?: boolean;

  /**
   * Scroll yüksekliği
   */
  maxHeightClass?: string;

  /**
   * Sayısal seçenek aralığı (1..maxFloor)
   */
  minFloor?: number;
  maxFloor?: number;

  /**
   * En sona "X ve üzeri" ekle.
   * Varsayılan: true
   */
  includePlusOption?: boolean;

  /**
   * "30 ve üzeri" label'ı.
   * Varsayılan maxFloor değerine göre otomatik üretilir.
   */
  plusLabel?: string;

  className?: string;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  if (typeof v === "string" && v.trim()) return [v.trim()];
  if (typeof v === "number" && Number.isFinite(v)) return [String(v)];
  return [];
}

export default function TotalFloorsBox({
  filters,
  setFilters,
  filterKey = "totalFloors",
  title = "Kat Sayısı",
  defaultOpen = true,
  maxHeightClass = "max-h-44",
  minFloor = 1,
  maxFloor = 30,
  includePlusOption = true,
  plusLabel,
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const selected = useMemo(() => {
    return asStringArray((filters as any)?.[filterKey]);
  }, [filters, filterKey]);

  const options = useMemo(() => {
    const list: string[] = [];

    const a = Math.max(1, Math.floor(minFloor));
    const b = Math.max(a, Math.floor(maxFloor));

    for (let i = a; i <= b; i++) list.push(String(i));

    if (includePlusOption) {
      list.push(plusLabel?.trim() || `${b} ve üzeri`);
    }

    return list;
  }, [minFloor, maxFloor, includePlusOption, plusLabel]);

  const isChecked = (value: string) => selected.includes(value);

  const toggleValue = (value: string) => {
    setFilters((prev) => {
      const current = asStringArray((prev as any)?.[filterKey]);
      const exists = current.includes(value);
      const next = exists ? current.filter((x) => x !== value) : [...current, value];

      return { ...(prev as any), [filterKey]: next.length ? next : null } as any;
    });
  };

  return (
    <div className={cls("border border-gray-200 bg-white", className)}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cls(
          "w-full flex items-center justify-between px-3 py-2",
          "border-b border-gray-200 bg-gray-50",
        )}
        aria-expanded={open}
      >
        <div className="text-[13px] font-semibold text-gray-900">{title}</div>
        <ChevronDown
          size={18}
          className={cls("text-gray-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className={cls("p-3 overflow-y-auto", maxHeightClass)}>
          <div className="space-y-2">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isChecked(opt)}
                  onChange={() => toggleValue(opt)}
                  className="h-4 w-4 border-gray-300"
                />
                <span className="text-[13px] text-blue-700 hover:underline">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
