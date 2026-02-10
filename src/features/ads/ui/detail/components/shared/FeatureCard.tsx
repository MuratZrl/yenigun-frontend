// src/features/ads/ui/detail/components/shared/FeatureCard.tsx
"use client";

import React from "react";

export type FeatureCardProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string | number | boolean | null;
  className?: string;
};

function isEmpty(v: any) {
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  if (typeof v === "number" && (!Number.isFinite(v) || v === 0)) return true;
  if (v === "0") return true;
  if (v === "0 m²") return true;
  return false;
}

function formatValue(v: any): string {
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  return String(v);
}

/**
 * Küçük özellik kartı (ikon + label + value)
 * - boş value gelirse render etmez
 */
export default function FeatureCard({ icon, label, value, className }: FeatureCardProps) {
  if (isEmpty(value)) return null;

  return (
    <div className={["flex items-center gap-3 p-2 bg-gray-50 rounded-lg", className || ""].join(" ")}>
      {icon ? <div className="text-blue-600 text-lg">{icon}</div> : null}

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900 truncate">{formatValue(value)}</p>
      </div>
    </div>
  );
}
