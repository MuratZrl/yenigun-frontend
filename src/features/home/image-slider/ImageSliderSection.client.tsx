// src/features/home/image-slider/ImageSliderSection.client.tsx
"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { slides } from "./data/slides";
import SliderSlideContent from "./ui/SliderSlideContent.client";

export default function ImageSliderSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section id="image-slider" className="relative h-screen overflow-hidden">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        speed={1200}
        effect="fade"
        style={{ height: "100vh" }}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            {/* Background image with zoom animation */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="object-cover h-full w-full scale-105 transition-transform duration-[8000ms] ease-out"
                style={{
                  transform: activeIndex === idx ? "scale(1.1)" : "scale(1)",
                }}
              />
            </div>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            {/* Content */}
            <SliderSlideContent slide={slide} isActive={activeIndex === idx} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => swiperRef.current?.slideToLoop(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              activeIndex === idx
                ? "w-8 bg-white"
                : "w-3 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2">
        <span className="text-white/50 text-xs tracking-widest uppercase rotate-90 origin-center translate-y-4">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent mt-6" />
      </div>
    </section>
  );
}
