// src/features/ads/ui/components/filter/MediaFilterBox.client.tsx
"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type MediaOption = {
  key: string;
  label: string;
  /**
   * FilterState içinde hangi alana yazacak?
   * Varsayılanlar: hasVideo, hasClip, hasVirtualTour
   */
  field: string;
};

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  title?: string;
  className?: string;

  /**
   * Dışarıdan kontrol edilebilir açık/kapalı
   */
  expanded?: boolean;
  onToggleExpanded?: () => void;

  /**
   * Varsayılan açık mı? (kontrollü kullanılmıyorsa)
   */
  defaultExpanded?: boolean;

  options?: MediaOption[];
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function MediaFilterBox({
  filters,
  setFilters,
  title = "Fotoğraf, Video",
  className,
  expanded,
  onToggleExpanded,
  defaultExpanded = false,
  options,
}: Props) {
  const isControlled = typeof expanded === "boolean" && typeof onToggleExpanded === "function";
  const [internalExpanded, setInternalExpanded] = React.useState<boolean>(defaultExpanded);
  const isOpen = isControlled ? (expanded as boolean) : internalExpanded;

  const mediaOptions: MediaOption[] = useMemo(
    () =>
      options ?? [
        { key: "video", label: "Videolu ilanlar", field: "hasVideo" },
        { key: "clip", label: "Klipli ilanlar", field: "hasClip" },
        { key: "tour", label: "Sanal Tur’a sahip ilanlar", field: "hasVirtualTour" },
      ],
    [options],
  );

  const toggleOpen = () => {
    if (isControlled) onToggleExpanded?.();
    else setInternalExpanded((p) => !p);
  };

  const getVal = (field: string) => Boolean((filters as any)?.[field]);

  const setVal = (field: string, v: boolean) => {
    setFilters((prev) => ({
      ...(prev as any),
      [field]: v,
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
        <ChevronDown
          size={18}
          className={cls("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="p-3 space-y-2">
          {mediaOptions.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-600"
                checked={getVal(opt.field)}
                onChange={(e) => setVal(opt.field, e.target.checked)}
              />
              <span className="hover:underline">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
