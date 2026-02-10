// src/features/ads/ui/components/filter/ListingDateBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Option = {
  id: string;
  label: string;
  days: number; // kaç gün içinde
};

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  title?: string;
  className?: string;

  /**
   * Expand: ilk açılış durumu
   * Varsayılan: true
   */
  defaultOpen?: boolean;

  /**
   * Filtre state'inde hangi anahtara yazsın?
   * Varsayılan: "postedWithinDays"
   * (Projende farklıysa burada değiştir veya prop ile ver.)
   */
  fieldKey?: string;

  options?: Option[];
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function ListingDateBox({
  filters,
  setFilters,
  title = "İlan Tarihi",
  className,
  defaultOpen = false,
  fieldKey = "postedWithinDays",
  options,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const dateOptions: Option[] = useMemo(
    () =>
      options ?? [
        { id: "24h", label: "Son 24 saat", days: 1 },
        { id: "3d", label: "Son 3 gün içinde", days: 3 },
        { id: "7d", label: "Son 7 gün içinde", days: 7 },
        { id: "15d", label: "Son 15 gün içinde", days: 15 },
        { id: "30d", label: "Son 30 gün içinde", days: 30 },
      ],
    [options],
  );

  const selectedDays = (filters as any)?.[fieldKey] ?? null;

  const onChange = (days: number | null) => {
    setFilters((prev) => ({
      ...(prev as any),
      [fieldKey]: days,
    }));
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
        <div className="p-3 space-y-2">
          {dateOptions.map((opt) => {
            const checked = Number(selectedDays) === opt.days;

            return (
              <label
                key={opt.id}
                className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="listing-date"
                  className="h-4 w-4 accent-blue-600"
                  checked={checked}
                  onChange={() => onChange(opt.days)}
                />
                <span className="hover:underline">{opt.label}</span>
              </label>
            );
          })}

          <button
            type="button"
            onClick={() => onChange(null)}
            className="pt-2 text-[12px] text-gray-500 hover:underline"
          >
            Seçimi temizle
          </button>
        </div>
      )}
    </div>
  );
}
