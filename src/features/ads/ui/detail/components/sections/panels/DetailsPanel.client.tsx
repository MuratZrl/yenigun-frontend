// src/features/ads/ui/detail/components/sections/panels/DetailsPanel.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData } from "@/types/advert";
import { ChevronDown } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// ✅ satır satır tüm özellikleri basan bölüm
import AdvertFeaturesListSection from "../AdvertFeaturesListSection.client";

type Props = {
  data: AdvertData;
  className?: string;
  emptyText?: string; // default: "Detay bilgisi bulunamadı"
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function toText(v: any): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(", ");
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "Evet" : "Hayır";
  return String(v).trim();
}

function CollapsibleBox({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className={cls("group border border-gray-300 bg-white")}>
      <summary
        className={cls(
          "list-none [&::-webkit-details-marker]:hidden",
          "cursor-pointer select-none",
          "px-3 py-2",
          "border-b border-gray-300",
          "bg-gradient-to-b from-[#f7f7f7] to-[#e9e9e9]",
          "flex items-center justify-between",
        )}
      >
        <div className="text-[12px] font-semibold text-gray-900">{title}</div>
        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180" />
      </summary>

      <div className="p-3">{children}</div>
    </details>
  );
}

export default function DetailsPanel({
  data,
  className,
  emptyText = "Detay bilgisi bulunamadı",
}: Props) {
  const description = useMemo(() => toText((data as any)?.thoughts), [data]);
  const hasDescription = description.trim().length > 0;

  return (
    <div className={cls("w-full", className)}>
      <CollapsibleBox title="Açıklama" defaultOpen>
        {hasDescription ? (
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={description} />
          </div>
        ) : (
          <div className="text-[12px] text-gray-600">{emptyText}</div>
        )}
      </CollapsibleBox>

      <div className="mt-3" />

      {/* ✅ Burada artık hardcode “Cephe / Muhit / Belirtilmemiş” yok.
          ✅ Dinamik: normalize + featureValues üzerinden satır satır basar. */}
      <CollapsibleBox title="Özellikler" defaultOpen>
        <AdvertFeaturesListSection data={data} />
      </CollapsibleBox>
    </div>
  );
}
