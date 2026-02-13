// src/features/ads/ui/components/filter/MapFilterBox.client.tsx
"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  title?: string;
  className?: string;

  /**
   * FilterState içinde hangi alana yazsın?
   * Varsayılan: "hasMap"
   */
  fieldKey?: string;

  /**
   * Dışarıdan kontrol edilebilir açık/kapalı
   */
  expanded?: boolean;
  onToggleExpanded?: () => void;

  /**
   * Kontrollü kullanılmıyorsa varsayılan açık mı?
   */
  defaultExpanded?: boolean;

  label?: string;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function MapFilterBox({
  filters,
  setFilters,
  title = "Harita",
  className,
  fieldKey = "hasMap",
  expanded,
  onToggleExpanded,
  defaultExpanded = true,
  label = "Haritalı ilanlar",
}: Props) {
  const isControlled = typeof expanded === "boolean" && typeof onToggleExpanded === "function";
  const [internalExpanded, setInternalExpanded] = React.useState<boolean>(defaultExpanded);
  const isOpen = isControlled ? (expanded as boolean) : internalExpanded;

  const toggleOpen = () => {
    if (isControlled) onToggleExpanded?.();
    else setInternalExpanded((p) => !p);
  };

  const checked = Boolean((filters as any)?.[fieldKey]);

  const setChecked = (v: boolean) => {
    setFilters((prev) => ({
      ...(prev as any),
      [fieldKey]: v,
    }));
  };

  return (
    <div className={cls("border border-gray-200 bg-white", className)}>
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200"
      >
        <span className="text-[13px] font-semibold text-gray-900">{title}</span>
        <ChevronDown size={18} className={cls("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="p-3">
          <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <span className="hover:underline">{label}</span>
          </label>
        </div>
      )}
    </div>
  );
}
