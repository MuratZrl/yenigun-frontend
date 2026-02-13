// src/features/ads/ui/components/filter/PriceBox.client.tsx
"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterState } from "@/types/advert";

type Currency = "TL" | "USD" | "EUR" | "GBP";

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  currencies?: Currency[];
  title?: string;
  className?: string;

  /**
   * Expand özelliği: ilk açılış durumu
   * Varsayılan: true
   */
  defaultOpen?: boolean;
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

export default function PriceBox({
  filters,
  setFilters,
  currencies = ["TL", "USD", "EUR", "GBP"],
  title = "Fiyat",
  className,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  const currencyKey = useMemo(() => {
    // projede isim farklı olabilir diye toleranslı: priceCurrency > currency
    const c = (filters as any)?.priceCurrency ?? (filters as any)?.currency ?? "TL";
    return (currencies.includes(c) ? c : "TL") as Currency;
  }, [filters, currencies]);

  const minValue = (filters as any)?.minPrice ?? null;
  const maxValue = (filters as any)?.maxPrice ?? null;

  const setCurrency = (c: Currency) => {
    setFilters((prev) => ({
      ...(prev as any),
      priceCurrency: c, // tercih edilen alan
      currency: c, // eski/alternatif alan (varsa)
    }));
  };

  const setMin = (v: string) => {
    const n = toNumberOrNull(v);
    setFilters((prev) => ({ ...(prev as any), minPrice: n } as any));
  };

  const setMax = (v: string) => {
    const n = toNumberOrNull(v);
    setFilters((prev) => ({ ...(prev as any), maxPrice: n } as any));
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
        <div className="p-3">
          <div className="border border-gray-300 rounded-sm overflow-hidden">
            <div className="grid grid-cols-4">
              {currencies.slice(0, 4).map((c) => {
                const active = c === currencyKey;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={cls(
                      "py-2 text-[12px] font-semibold",
                      "border-r border-gray-300 last:border-r-0",
                      active ? "bg-slate-500 text-white" : "bg-white text-blue-700 hover:bg-gray-50",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder={`min ${currencyKey}`}
              value={typeof minValue === "number" ? String(minValue) : ""}
              onChange={(e) => setMin(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder={`max ${currencyKey}`}
              value={typeof maxValue === "number" ? String(maxValue) : ""}
              onChange={(e) => setMax(e.target.value)}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
