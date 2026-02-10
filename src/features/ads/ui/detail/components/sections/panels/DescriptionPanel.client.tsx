// src/features/ads/ui/detail/components/panels/DescriptionPanel.client.tsx
"use client";

import React, { useMemo } from "react";
import type { AdvertData } from "@/types/advert";
import { FileText } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type Props = {
  data: AdvertData;

  className?: string;

  // Başlık kontrolü
  title?: string; // default: "Açıklama"
  showTitle?: boolean; // default true

  // Desktop style: eski tasarıma benzer "border" kutu
  variant?: "card" | "tableBox"; // default "card"

  // Boş durumda gösterilecek metin
  emptyText?: string; // default "Açıklama bulunmuyor"
};

function cls(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeText(v: any): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

export default function DescriptionPanel({
  data,
  className,
  title = "Açıklama",
  showTitle = true,
  variant = "card",
  emptyText = "Açıklama bulunmuyor",
}: Props) {
  const content = useMemo(() => safeText((data as any)?.thoughts).trim(), [data]);
  const hasContent = content.length > 0;

  // İki farklı görünüm:
  // - card: rounded + shadow (mobil ve modern görünüm)
  // - tableBox: border + header row (senin eski desktop kutun)
  if (variant === "tableBox") {
    return (
      <div className={cls("border border-gray-300 bg-white", className)}>
        {showTitle && (
          <div className="px-3 py-2 border-b border-gray-300 bg-white">
            <div className="font-semibold text-[12px] text-gray-900">{title}</div>
          </div>
        )}

        <div className="p-3 text-[12px] leading-5 text-gray-800">
          {hasContent ? (
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer content={content} />
            </div>
          ) : (
            <div className="text-gray-600">{emptyText}</div>
          )}
        </div>
      </div>
    );
  }

  // default: card
  return (
    <div className={cls("bg-white rounded-2xl shadow-sm border border-gray-200 p-6", className)}>
      {showTitle && (
        <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
      )}

      {hasContent ? (
        <div className="prose prose-gray max-w-none">
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{emptyText}</p>
        </div>
      )}
    </div>
  );
}
