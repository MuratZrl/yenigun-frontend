// src/features/home/image-slider/ImageSliderSection.client.tsx
"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";

import { PoppinsFont } from "./fonts";
import { slides } from "./data/slides";
import SliderNav from "./ui/SliderNav.client";
import SliderSlideContent from "./ui/SliderSlideContent.client";

export default function ImageSliderSection() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section id="image-slider" className="relative" style={PoppinsFont.style}>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        direction="vertical"
        speed={1500}
        style={{ height: "100vh" }}
        modules={[Navigation]}
        navigation
        onBeforeInit={(swiper) => {
          const s: any = swiper;
          s.params.navigation.prevEl = prevRef.current;
          s.params.navigation.nextEl = nextRef.current;
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="h-screen relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="object-cover h-screen w-full"
            />
            <SliderSlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      <SliderNav prevRef={prevRef} nextRef={nextRef} />
    </section>
  );
}
