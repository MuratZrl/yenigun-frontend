// src/features/ads/ui/components/filter/AreaBox.client.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

/* ── Shared helpers ── */

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toNumberOrNull(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function getNumber(filters: any, key: string): number | null {
  const v = filters?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/* ── GrossAreaBox ── */

type GrossAreaBoxProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  minKey?: string;
  maxKey?: string;
  defaultOpen?: boolean;
  className?: string;
};

export function GrossAreaBox({
  filters,
  setFilters,
  minKey = "minGrossM2",
  maxKey = "maxGrossM2",
  defaultOpen = false,
  className,
}: GrossAreaBoxProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const f: any = filters as any;

  const minValue = getNumber(f, minKey);
  const maxValue = getNumber(f, maxKey);

  const setKey = (key: string, raw: string) => {
    const n = toNumberOrNull(raw);
    setFilters((prev) => ({ ...(prev as any), [key]: n } as any));
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
        <div className="text-[13px] font-semibold text-gray-900">m² (Brüt)</div>
        <ChevronDown
          size={18}
          className={cls("text-gray-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="p-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="min"
              value={typeof minValue === "number" ? String(minValue) : ""}
              onChange={(e) => setKey(minKey, e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[13px] text-gray-500 select-none">-</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="max"
              value={typeof maxValue === "number" ? String(maxValue) : ""}
              onChange={(e) => setKey(maxKey, e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── NetAreaBox ── */

type NetAreaBoxProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  minKey?: string;
  maxKey?: string;
  defaultOpen?: boolean;
  className?: string;
};

export function NetAreaBox({
  filters,
  setFilters,
  minKey = "minNetM2",
  maxKey = "maxNetM2",
  defaultOpen = false,
  className,
}: NetAreaBoxProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const f: any = filters as any;

  const minValue = getNumber(f, minKey);
  const maxValue = getNumber(f, maxKey);

  const setKey = (key: string, raw: string) => {
    const n = toNumberOrNull(raw);
    setFilters((prev) => ({ ...(prev as any), [key]: n } as any));
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
        <div className="text-[13px] font-semibold text-gray-900">m² (Net)</div>
        <ChevronDown
          size={18}
          className={cls("text-gray-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="p-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder="min"
              value={typeof minValue === "number" ? String(minValue) : ""}
              onChange={(e) => setKey(minKey, e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[13px] text-gray-500 select-none">-</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="max"
              value={typeof maxValue === "number" ? String(maxValue) : ""}
              onChange={(e) => setKey(maxKey, e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Default export for backward compat ── */
export default GrossAreaBox;
