// src/features/home/image-slider/ui/SliderSlideContent.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import type { SliderSlide } from "../types";

type Props = {
  slide: SliderSlide;
};

export default function SliderSlideContent({ slide }: Props) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-[5%] md:left-[15%] flex flex-col items-start gap-2 md:gap-3 max-w-[70%] md:max-w-none">
      <h1 className="text-white text-base md:text-xl lg:text-3xl font-semibold">
        {slide.heading}
      </h1>

      {slide.lines.map((line, i) => (
        <p key={i} className="text-white font-bold text-xl md:text-4xl lg:text-6xl">
          {line}
        </p>
      ))}

      <Link
        href={slide.cta.href}
        className="py-2 px-4 text-sm md:text-base bg-custom-orange text-white rounded-xl hover:bg-orange-600 transition-colors duration-300"
      >
        {slide.cta.label}
      </Link>
    </div>
  );
}
