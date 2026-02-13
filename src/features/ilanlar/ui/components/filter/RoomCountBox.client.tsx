// src/features/ads/ui/components/filter/RoomCountBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * FilterState içinde oda sayısını tuttuğun alan adı.
   * Varsayılan: "roomCounts"
   * Örn: "rooms", "roomCount", "odaSayisi" vs.
   */
  filterKey?: string;

  /**
   * Checkbox seçenekleri. Vermezsen TR emlak standart karması gelir.
   */
  options?: string[];

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
   * Varsayılan: "max-h-40"
   */
  maxHeightClass?: string;

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

const DEFAULT_OPTIONS = [
  "1+0",
  "1+1",
  "2+1",
  "3+1",
  "3+2",
  "4+1",
  "4+2",
  "5+1",
  "5+2",
  "6+1",
  "6+2",
  "6+3",
  "6+4",
  "7+1",
  "7+2",
  "7+3",
  "8+1",
  "8+2",
];

export default function RoomCountBox({
  filters,
  setFilters,
  filterKey = "roomCounts",
  options = DEFAULT_OPTIONS,
  title = "Oda Sayısı",
  defaultOpen = true,
  maxHeightClass = "max-h-40",
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const selected = useMemo(() => {
    const raw = (filters as any)?.[filterKey];
    return asStringArray(raw);
  }, [filters, filterKey]);

  const toggleValue = (value: string) => {
    setFilters((prev) => {
      const current = asStringArray((prev as any)?.[filterKey]);
      const exists = current.includes(value);
      const next = exists ? current.filter((x) => x !== value) : [...current, value];

      // boş kalırsa null yapıp query tarafını temiz tutalım (istersen [] da yapabilirsin)
      return { ...(prev as any), [filterKey]: next.length ? next : null } as any;
    });
  };

  const isChecked = (value: string) => selected.includes(value);

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
          className={cls(
            "text-gray-500 transition-transform",
            open && "rotate-180",
          )}
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
