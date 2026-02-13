// src/features/admin/emlak-archived-detail/ui/DetailRow.tsx

import React from "react";

type Props = {
  label: string;
  value: string | number | boolean | undefined | null;
};

export default function DetailRow({ label, value }: Props) {
  if (value === undefined || value === null || value === "" || value === "0" || value === 0)
    return null;

  const displayValue = typeof value === "boolean" ? (value ? "Evet" : "Hayır") : value;
  const isImportant = label === "İlan No" || label === "İlan Türü" || label === "Emlak Tipi";

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className={`text-sm font-medium ${isImportant ? "text-red-600 font-bold" : "text-gray-600"}`}>
        {label}
      </span>
      <span className={`text-sm ${isImportant ? "text-red-600 font-bold" : "text-gray-900 font-semibold"}`}>
        {displayValue}
      </span>
    </div>
  );
}