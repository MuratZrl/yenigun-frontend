// src/features/home/image-slider/ui/SliderNav.client.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
};

export default function SliderNav({ onPrev, onNext }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Önceki"
        onClick={onPrev}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Sonraki"
        onClick={onNext}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
