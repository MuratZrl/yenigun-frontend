// src/features/home/image-slider/HeroSection.client.tsx
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { slides } from "./data/slides";
import HeroSearchBar from "./ui/HeroSearchBar.client";

const AUTOPLAY_DELAY = 6000;

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  return (
    <section id="hero" className="relative h-[70vh] overflow-hidden bg-black -mt-16">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        speed={1200}
        effect="fade"
        style={{ height: "70vh" }}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        loop
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover transition-transform duration-[8000ms] ease-out"
                style={{
                  transform:
                    activeIndex === idx
                      ? idx % 2 === 0
                        ? "scale(1.08)"
                        : "scale(1.12) translate(-1%, 0)"
                      : "scale(1)",
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Centered content: heading + search bar */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-10">
          <h1
            className="text-white font-medium text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05]"
            style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
          >
            Hayalinizdeki Eve{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-blue-100">
              Kavuşun
            </span>
          </h1>
        </div>
        <HeroSearchBar />
      </div>
    </section>
  );
}
