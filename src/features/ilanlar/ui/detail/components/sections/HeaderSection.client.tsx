// src/features/ads/ui/detail/components/sections/HeaderSection.client.tsx
"use client";

import React, { useMemo } from "react";

import type { AdvertData } from "@/types/advert";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type Props = {
  data?: AdvertData;
  title?: string | null;
  mobileBarTitle?: string;
  onBack?: () => void;

  // aşağıdakiler dışarıdaki call-site'ları kırmamak için dursun
  shareText?: string;
  shareUrl?: string;
  isFavorited?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  onPrint?: () => void;
  showActions?: boolean;

  className?: string;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function safeText(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeaderSection({
  data,
  title,
  mobileBarTitle = "İlan Detayı",
  onBack,
  className,
}: Props) {
  const resolvedTitle = useMemo(() => {
    const t = safeText(title) || safeText((data as any)?.title);
    return t || "İlan";
  }, [title, data]);

  const handleBack = () => {
    if (onBack) return onBack();
    if (typeof window !== "undefined") window.history.back();
  };

  return (
    <header className={className ?? "w-full"}>
      <div className="flex items-center py-3 sm:py-4 px-4 lg:px-0">
        <h1 className="min-w-0 truncate text-sm sm:text-lg font-bold text-gray-900 tracking-wide uppercase">
          {resolvedTitle}
        </h1>
      </div>
    </header>
  );
}
