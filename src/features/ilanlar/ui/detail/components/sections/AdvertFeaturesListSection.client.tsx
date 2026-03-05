// src/features/ads/ui/detail/components/sections/AdvertFeaturesListSection.client.tsx
"use client";
import React, { useMemo } from "react";
import type { AdvertData, FeatureValue } from "@/types/advert";

type Row = {
  label: string;
  value: string;
};

function toText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "number") return String(v);
  return String(v).trim();
}

function looksLikeObjectId(s: string) {
  return /^[a-f0-9]{24}$/i.test(s);
}

function prettifyId(id: string) {
  const x = id.replace(/^attr_/, "").replace(/[_-]+/g, " ").trim();
  if (!x) return "";
  return x.charAt(0).toLocaleUpperCase("tr-TR") + x.slice(1);
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveLabel(fv: any, nameMap?: Record<string, string>): string {
  const name = toText(fv?.name || fv?.title || fv?.label);
  if (name) return name;

  const id = toText(fv?.featureId || fv?.id || fv?._id);
  if (!id) return "";

  if (nameMap && id in nameMap) return nameMap[id];

  if (looksLikeObjectId(id)) return "";

  const pretty = prettifyId(id);
  return pretty || "";
}

function shouldSkipRow(label: string, value: string): boolean {
  if (!label && !value) return true;
  const lowerValue = value.toLowerCase();
  if (lowerValue === "no") return true;
  if (value === "0" || value === "") return true;
  if (value === "[]") return true;
  return false;
}

function normalizeRows(
  data: AdvertData,
  nameMap?: Record<string, string>,
  excludeFacilityTitles?: Set<string>,
): Row[] {
  const raw = (data as any)?.featureValues;
  const arr: FeatureValue[] = Array.isArray(raw) ? raw : [];
  const rows: Row[] = [];

  for (const fv of arr as any[]) {
    const label = resolveLabel(fv, nameMap);
    const value = toText(fv?.value);

    if (shouldSkipRow(label, value)) continue;

    // Skip facility rows — they're rendered separately as grids
    if (excludeFacilityTitles && excludeFacilityTitles.size > 0 && label) {
      if (excludeFacilityTitles.has(normalize(label))) continue;
    }

    rows.push({
      label: label || "Özellik",
      value: value || "-",
    });
  }

  return rows;
}

export default function AdvertFeaturesListSection({
  data,
  className = "",
  title = "Özellikler",
  featureNameMap,
  excludeFacilityTitles,
}: {
  data: AdvertData;
  className?: string;
  title?: string;
  featureNameMap?: Record<string, string>;
  excludeFacilityTitles?: Set<string>;
}) {
  const rows = useMemo(
    () => normalizeRows(data, featureNameMap, excludeFacilityTitles),
    [data, featureNameMap, excludeFacilityTitles],
  );

  if (!rows.length) return null;

  return (
    <section className={className}>
      <div className="text-[14px] font-semibold text-gray-900 mb-2">{title}</div>
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        {rows.map((r, i) => (
          <div
            key={`${r.label}-${i}`}
            className={[
              "grid grid-cols-[1fr_auto] gap-4 px-3 py-2 text-[12px]",
              "border-b border-gray-100 last:border-b-0",
            ].join(" ")}
          >
            <div className="text-gray-700 min-w-0 truncate">{r.label}</div>
            <div className="text-gray-900 font-medium text-right whitespace-nowrap">
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}