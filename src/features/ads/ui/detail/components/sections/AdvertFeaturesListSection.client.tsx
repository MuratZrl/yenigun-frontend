// src/features/ads/ui/detail/components/sections/AdvertFeaturesListSection.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData, FeatureValue } from "@/types/advert";

type Row = {
  label: string;
  value: string;
};

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  if (typeof v === "number") return String(v);
  return String(v).trim();
}

// 24 hex Mongo ObjectId gibi mi?
function looksLikeObjectId(s: string) {
  return /^[a-f0-9]{24}$/i.test(s);
}

// "attr_room" gibi eski id’leri biraz okunur yap (çok basit)
function prettifyId(id: string) {
  const x = id.replace(/^attr_/, "").replace(/[_-]+/g, " ").trim();
  if (!x) return "";
  return x.charAt(0).toLocaleUpperCase("tr-TR") + x.slice(1);
}

function resolveLabel(fv: any): string {
  const name = toText(fv?.name || fv?.title || fv?.label);
  if (name) return name;

  const id = toText(fv?.featureId || fv?.id || fv?._id);
  if (!id) return "";

  // ObjectId ise ekranda göstermeyi bırak
  if (looksLikeObjectId(id)) return "";

  // "attr_room" gibi bir şeyse okunur hale getir
  const pretty = prettifyId(id);
  return pretty || "";
}

function normalizeRows(data: AdvertData): Row[] {
  const raw = (data as any)?.featureValues;
  const arr: FeatureValue[] = Array.isArray(raw) ? raw : [];

  const rows: Row[] = [];

  for (const fv of arr as any[]) {
    const label = resolveLabel(fv);
    const value = toText(fv?.value);

    // Hem label hem value boşsa geç
    if (!label && !value) continue;

    // label yoksa ama value varsa, en azından “Özellik” de (id basma!)
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
}: {
  data: AdvertData;
  className?: string;
  title?: string;
}) {
  const rows = useMemo(() => normalizeRows(data), [data]);

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
