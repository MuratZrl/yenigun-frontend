// src/features/home/image-slider/ui/SliderNav.client.tsx
"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  prevRef: React.RefObject<HTMLButtonElement | null>;
  nextRef: React.RefObject<HTMLButtonElement | null>;
};

export default function SliderNav({ prevRef, nextRef }: Props) {
  return (
    <div className="absolute top-[80%] md:top-1/2 -translate-y-1/2 right-1/4 z-70 flex flex-col items-center justify-center gap-10">
      <button
        ref={prevRef}
        type="button"
        aria-label="Önceki"
        className="p-3 rounded-full bg-white/80 text-gray-900 hover:bg-white transition-colors duration-300 shadow-lg backdrop-blur"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <button
        ref={nextRef}
        type="button"
        aria-label="Sonraki"
        className="p-3 rounded-full bg-white/80 text-gray-900 hover:bg-white transition-colors duration-300 shadow-lg backdrop-blur"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}
