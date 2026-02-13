// src/features/ads/ui/components/filter/AreaBox.client.tsx
"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;

  /**
   * Projedeki FilterState key'leri farklıysa buradan override edebilirsin.
   * Varsayılanlar:
   * gross: minGrossM2 / maxGrossM2
   * net:   minNetM2   / maxNetM2
   */
  grossMinKey?: string;
  grossMaxKey?: string;
  netMinKey?: string;
  netMaxKey?: string;

  /**
   * Brüt ve Net bölümlerinin ilk açılış durumu (default: true)
   */
  grossDefaultOpen?: boolean;
  netDefaultOpen?: boolean;

  className?: string;
};

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

type MinMaxInputsProps = {
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
};

function MinMaxInputs({ minValue, maxValue, onMinChange, onMaxChange }: MinMaxInputsProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        placeholder="min"
        value={typeof minValue === "number" ? String(minValue) : ""}
        onChange={(e) => onMinChange(e.target.value)}
        className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span className="text-[13px] text-gray-500 select-none">-</span>
      <input
        type="number"
        inputMode="numeric"
        placeholder="max"
        value={typeof maxValue === "number" ? String(maxValue) : ""}
        onChange={(e) => onMaxChange(e.target.value)}
        className="w-full border border-gray-300 rounded-sm px-2 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function AreaBox({
  filters,
  setFilters,
  grossMinKey = "minGrossM2",
  grossMaxKey = "maxGrossM2",
  netMinKey = "minNetM2",
  netMaxKey = "maxNetM2",
  grossDefaultOpen = true,
  netDefaultOpen = true,
  className,
}: Props) {
  const f: any = filters as any;

  const [grossOpen, setGrossOpen] = useState<boolean>(grossDefaultOpen);
  const [netOpen, setNetOpen] = useState<boolean>(netDefaultOpen);

  const grossMin = getNumber(f, grossMinKey);
  const grossMax = getNumber(f, grossMaxKey);
  const netMin = getNumber(f, netMinKey);
  const netMax = getNumber(f, netMaxKey);

  const setKey = (key: string, raw: string) => {
    const n = toNumberOrNull(raw);
    setFilters((prev) => ({ ...(prev as any), [key]: n } as any));
  };

  return (
    <div className={cls("border border-gray-200 bg-white", className)}>
      {/* Brüt */}
      <button
        type="button"
        onClick={() => setGrossOpen((s) => !s)}
        className={cls(
          "w-full flex items-center justify-between px-3 py-2",
          "border-b border-gray-200 bg-gray-50",
        )}
        aria-expanded={grossOpen}
      >
        <div className="text-[13px] font-semibold text-gray-900">m² (Brüt)</div>
        <ChevronDown
          size={18}
          className={cls("text-gray-500 transition-transform", grossOpen && "rotate-180")}
        />
      </button>

      {grossOpen && (
        <div className="p-3">
          <MinMaxInputs
            minValue={grossMin}
            maxValue={grossMax}
            onMinChange={(v) => setKey(grossMinKey, v)}
            onMaxChange={(v) => setKey(grossMaxKey, v)}
          />
        </div>
      )}

      {/* Net */}
      <button
        type="button"
        onClick={() => setNetOpen((s) => !s)}
        className={cls(
          "w-full flex items-center justify-between px-3 py-2",
          "border-t border-gray-200 bg-gray-50",
        )}
        aria-expanded={netOpen}
      >
        <div className="text-[13px] font-semibold text-gray-900">m² (Net)</div>
        <ChevronDown
          size={18}
          className={cls("text-gray-500 transition-transform", netOpen && "rotate-180")}
        />
      </button>

      {netOpen && (
        <div className="p-3">
          <MinMaxInputs
            minValue={netMin}
            maxValue={netMax}
            onMinChange={(v) => setKey(netMinKey, v)}
            onMaxChange={(v) => setKey(netMaxKey, v)}
          />
        </div>
      )}
    </div>
  );
}
