// src/features/ads/ui/components/filter/FloorBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * FilterState içinde "bulunduğu kat" alanı.
   * Varsayılan: "floors"
   */
  filterKey?: string;

  /**
   * Başlık
   */
  title?: string;

  /**
   * İlk açılış durumu
   */
  defaultOpen?: boolean;

  /**
   * Liste max yüksekliği (scroll için). Tailwind class.
   */
  maxHeightClass?: string;

  /**
   * Özel kat seçenekleri (görseldeki gibi).
   * Vermezsen default set gelir.
   */
  specialOptions?: string[];

  /**
   * Sayısal kat aralığı.
   * Varsayılan: 1..30
   */
  minFloorNumber?: number;
  maxFloorNumber?: number;

  /**
   * Sayısal katları göstermek istemezsen kapat.
   */
  includeNumbers?: boolean;

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

const DEFAULT_SPECIAL = [
  "Giriş Altı Kot 4",
  "Giriş Altı Kot 3",
  "Giriş Altı Kot 2",
  "Giriş Altı Kot 1",
  "Bodrum Kat",
  "Zemin Kat",
  "Giriş Kat",
  "Yüksek Giriş",
  "Çatı Katı",
  "Bahçe Katı",
  "Asma Kat",
  "Teras Kat",
  "Dubleks",
  "Tripleks",
];

export default function FloorBox({
  filters,
  setFilters,
  filterKey = "floors",
  title = "Bulunduğu Kat",
  defaultOpen = true,
  maxHeightClass = "max-h-44",
  specialOptions = DEFAULT_SPECIAL,
  minFloorNumber = 1,
  maxFloorNumber = 30,
  includeNumbers = true,
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const selected = useMemo(() => {
    return asStringArray((filters as any)?.[filterKey]);
  }, [filters, filterKey]);

  const options = useMemo(() => {
    const list: string[] = [...specialOptions];

    if (includeNumbers) {
      const minN = Math.floor(minFloorNumber);
      const maxN = Math.floor(maxFloorNumber);
      const start = Number.isFinite(minN) ? minN : 1;
      const end = Number.isFinite(maxN) ? maxN : 30;

      const a = Math.min(start, end);
      const b = Math.max(start, end);

      for (let i = a; i <= b; i++) list.push(String(i));
    }

    // duplicates temizle
    return Array.from(new Set(list));
  }, [specialOptions, includeNumbers, minFloorNumber, maxFloorNumber]);

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
