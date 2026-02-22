// src/features/home/image-slider/ImageSliderSection.client.tsx
"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import { slides } from "./data/slides";
import SliderSlideContent from "./ui/SliderSlideContent.client";

const AUTOPLAY_DELAY = 6000;

export default function ImageSliderSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress bar animation
  const startProgress = useCallback(() => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);

    const step = 50; // update every 50ms
    let elapsed = 0;

    progressRef.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100));
      if (elapsed >= AUTOPLAY_DELAY) {
        if (progressRef.current) clearInterval(progressRef.current);
      }
    }, step);
  }, []);

  useEffect(() => {
    startProgress();
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [startProgress]);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.realIndex);
      startProgress();
    },
    [startProgress]
  );

  const goTo = useCallback((idx: number) => {
    swiperRef.current?.slideToLoop(idx);
  }, []);


  return (
    <section id="image-slider" className="relative h-screen overflow-hidden bg-black -mt-16">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        speed={1200}
        effect="fade"
        style={{ height: "100vh" }}
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            {/* Background image with Ken Burns */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full object-cover transition-transform duration-[8000ms] ease-out"
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/25" />

            {/* Content */}
            <SliderSlideContent slide={slide} isActive={activeIndex === idx} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom dots */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-center justify-center px-6 md:px-10 py-5">
          <div className="hidden md:flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all duration-400 ${
                  activeIndex === idx
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
