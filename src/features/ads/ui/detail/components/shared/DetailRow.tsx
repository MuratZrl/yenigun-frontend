// src/features/ads/ui/detail/components/shared/DetailRow.tsx
"use client";

import React, { useMemo } from "react";

export type DetailRowProps = {
  label: string;
  value: string | number | boolean | undefined | null;
  importantLabels?: string[]; // default: ["İlan No","İlan Türü","Emlak Tipi"]
};

function isEmptyValue(v: any): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (typeof v === "number" && (v === 0 || !Number.isFinite(v))) return true;
  if (v === "0") return true;
  return false;
}

/**
 * Mobil/Genel detay satırı:
 * - value boşsa render etmez
 * - boolean => Evet/Hayır
 * - belirli label’ları “important” yapar (kırmızı)
 */
export default function DetailRow({
  label,
  value,
  importantLabels = ["İlan No", "İlan Türü", "Emlak Tipi"],
}: DetailRowProps) {
  if (isEmptyValue(value)) return null;

  const displayValue = typeof value === "boolean" ? (value ? "Evet" : "Hayır") : value;

  const isImportant = useMemo(() => importantLabels.includes(label), [importantLabels, label]);

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className={["text-sm font-medium", isImportant ? "text-red-600 font-bold" : "text-gray-600"].join(" ")}>
        {label}
      </span>

      <span className={["text-sm", isImportant ? "text-red-600 font-bold" : "text-gray-900 font-semibold"].join(" ")}>
        {String(displayValue)}
      </span>
    </div>
  );
}
