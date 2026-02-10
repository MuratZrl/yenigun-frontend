// src/features/ads/ui/components/filter/KeywordFilterBox.client.tsx
"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  title?: string;
  className?: string;

  /**
   * FilterState alanları (projende farklıysa override et)
   */
  keywordFieldKey?: string; // default: "keyword"
  includeDescFieldKey?: string; // default: "includeDescription"

  /**
   * Expand/Collapse kontrolü
   */
  expanded?: boolean;
  onToggleExpanded?: () => void;
  defaultExpanded?: boolean;
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function KeywordFilterBox({
  filters,
  setFilters,
  title = "Kelime ile filtrele",
  className,
  keywordFieldKey = "keyword",
  includeDescFieldKey = "includeDescription",
  expanded,
  onToggleExpanded,
  defaultExpanded = false,
}: Props) {
  const isControlled = typeof expanded === "boolean" && typeof onToggleExpanded === "function";
  const [internalExpanded, setInternalExpanded] = React.useState<boolean>(defaultExpanded);
  const isOpen = isControlled ? (expanded as boolean) : internalExpanded;

  const toggleOpen = () => {
    if (isControlled) onToggleExpanded?.();
    else setInternalExpanded((p) => !p);
  };

  const value = String((filters as any)?.[keywordFieldKey] ?? "");
  const checked = Boolean((filters as any)?.[includeDescFieldKey]);

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
        <div className="p-3 space-y-2">
          <input
            type="text"
            placeholder="Kelime giriniz"
            value={value}
            onChange={(e) =>
              setFilters((prev) => ({
                ...(prev as any),
                [keywordFieldKey]: e.target.value,
              }))
            }
            className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2 text-[13px] text-blue-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={checked}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...(prev as any),
                  [includeDescFieldKey]: e.target.checked,
                }))
              }
            />
            <span className="hover:underline">İlan açıklamalarını dahil et.</span>
          </label>
        </div>
      )}
    </div>
  );
}
