// src/features/ads/ui/detail/components/shared/MarkdownBox.tsx
"use client";

import React from "react";
import { FileText } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export type MarkdownBoxProps = {
  title: string;
  content?: string | null;
  emptyText?: string; // default: "Açıklama bulunmuyor"
  className?: string;
};

/**
 * Başlıklı Markdown kutusu (Açıklama gibi)
 * - content yoksa “empty” state basar
 */
export default function MarkdownBox({
  title,
  content,
  emptyText = "Açıklama bulunmuyor",
  className,
}: MarkdownBoxProps) {
  const hasContent = typeof content === "string" && content.trim() !== "";

  return (
    <div className={["bg-white rounded-2xl shadow-sm border border-gray-200 p-6", className || ""].join(" ")}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

      {hasContent ? (
        <div className="prose prose-gray max-w-none">
          <MarkdownRenderer content={content as string} />
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
