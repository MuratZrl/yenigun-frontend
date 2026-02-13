// src/features/ads/ui/detail/components/sections/HeaderSection.client.tsx
"use client";

import React, { useMemo } from "react";
import { ChevronLeft } from "lucide-react";

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
      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="flex items-center py-4">
          <h1 className="min-w-0 truncate text-lg font-bold text-gray-900 tracking-wide uppercase">
            {resolvedTitle}
          </h1>
        </div>
      </div>

      {/* MOBILE — Sticky top bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#1f6f93] text-white shadow-md">
        <div className="relative flex items-center h-12 px-3">
          <button
            type="button"
            className="p-1.5 -ml-1.5 rounded-full active:bg-white/20 transition-colors"
            onClick={handleBack}
            aria-label="Geri"
          >
            <ChevronLeft size={22} />
          </button>

          <span className="absolute left-1/2 -translate-x-1/2 font-semibold text-[15px] truncate max-w-[70%]">
            {mobileBarTitle}
          </span>
        </div>
      </div>

      {/* MOBILE — Title */}
      <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100">
        <h1 className="text-sm font-bold text-gray-900 leading-snug uppercase tracking-wide">
          {resolvedTitle}
        </h1>
      </div>
    </header>
  );
}
