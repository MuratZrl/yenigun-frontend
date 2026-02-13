// src/features/ads/ui/components/filter/FromWhoBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * FilterState içinde "kimden" bilgisini tuttuğun alan.
   * Varsayılan: "fromWho"
   * (string saklar)
   */
  filterKey?: string;

  title?: string;
  defaultOpen?: boolean;

  maxHeightClass?: string;

  /**
   * Radio seçenekleri. Vermezsen görseldeki gibi gelir.
   */
  options?: string[];

  className?: string;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeStr(v: any): string {
  return typeof v === "string" ? v : "";
}

const DEFAULT_OPTIONS = [
  "Sahibinden",
  "Emlak Ofisinden",
  "İnşaat Firmasından",
  "Bankadan",
  "Turizm İşletmesinden",
];

export default function FromWhoBox({
  filters,
  setFilters,
  filterKey = "fromWho",
  title = "Kimden",
  defaultOpen = true,
  maxHeightClass = "max-h-44",
  options = DEFAULT_OPTIONS,
  className,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const selected = useMemo(() => {
    const v = safeStr((filters as any)?.[filterKey]).trim();
    return v;
  }, [filters, filterKey]);

  const list = useMemo(() => {
    const cleaned = options
      .map((x) => (typeof x === "string" ? x.trim() : ""))
      .filter(Boolean);
    return Array.from(new Set(cleaned));
  }, [options]);

  const setValue = (value: string) => {
    setFilters((prev) => ({ ...(prev as any), [filterKey]: value } as any));
  };

  const clearValue = () => {
    setFilters((prev) => ({ ...(prev as any), [filterKey]: null } as any));
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
            {list.map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name={`radio-${filterKey}`}
                  checked={selected === opt}
                  onChange={() => setValue(opt)}
                  className="h-4 w-4 border-gray-300"
                />
                <span className="text-[13px] text-blue-700 hover:underline">{opt}</span>
              </label>
            ))}

            {selected && (
              <button
                type="button"
                onClick={clearValue}
                className="mt-2 text-[12px] text-gray-600 hover:underline"
              >
                Seçimi temizle
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
