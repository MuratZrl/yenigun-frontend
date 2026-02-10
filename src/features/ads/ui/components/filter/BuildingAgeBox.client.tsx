// src/features/ads/ui/components/filter/BuildingAgeBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Mode = "years" | "ranges";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * FilterState içinde bina yaşını tuttuğun alan adı.
   * Varsayılan: "buildingAges"
   */
  filterKey?: string;

  /**
   * "years" => 0,1,2,3,4,5... (ilk görsel)
   * "ranges" => 6-10 arası, 11-15 arası... (ikinci görsel)
   */
  mode?: Mode;

  /**
   * Başlık
   */
  title?: string;

  /**
   * İlk açılış durumu
   */
  defaultOpen?: boolean;

  /**
   * Liste max yüksekliği (scroll için). Tailwind class ver.
   */
  maxHeightClass?: string;

  /**
   * years modu için max yıl.
   * 0 dahil olmak üzere 0..maxYear gösterir.
   */
  maxYear?: number;

  /**
   * ranges modu için aralık listesi.
   * Vermezsen TR emlak standardı gibi default gelir.
   */
  rangeOptions?: string[];

  className?: string;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function asStringArray(v: any): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string");
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

const DEFAULT_RANGES = [
  "6-10 arası",
  "11-15 arası",
  "16-20 arası",
  "21-25 arası",
  "26-30 arası",
  "31 ve üzeri",
];

export default function BuildingAgeBox({
  filters,
  setFilters,
  filterKey = "buildingAges",
  mode = "years",
  title = "Bina Yaşı",
  defaultOpen = true,
  maxHeightClass = "max-h-44",
  maxYear = 30,
  rangeOptions = DEFAULT_RANGES,
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const selected = useMemo(() => {
    const raw = (filters as any)?.[filterKey];
    return asStringArray(raw);
  }, [filters, filterKey]);

  const options = useMemo(() => {
    if (mode === "ranges") return rangeOptions;
    // years modu: 0..maxYear
    const list: string[] = [];
    for (let i = 0; i <= Math.max(0, maxYear); i++) list.push(String(i));
    // 0 için özel label istiyorsan: "0 (Yapım Aşamasında)"
    // Görseldeki gibi göstermek için ilk elemanı değiştiriyoruz ama value yine "0" kalıyor.
    if (list[0] === "0") list[0] = "0 (Yapım Aşamasında)";
    return list;
  }, [mode, rangeOptions, maxYear]);

  // years modunda "0 (Yapım Aşamasında)" label'ı var, state'e "0" yazmak istiyoruz.
  const normalizeValue = (label: string) => {
    if (mode !== "years") return label;
    if (label.startsWith("0")) return "0";
    return label;
  };

  const isChecked = (label: string) => {
    const v = normalizeValue(label);
    return selected.includes(v);
  };

  const toggleValue = (label: string) => {
    const v = normalizeValue(label);

    setFilters((prev) => {
      const current = asStringArray((prev as any)?.[filterKey]);
      const exists = current.includes(v);
      const next = exists ? current.filter((x) => x !== v) : [...current, v];

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
