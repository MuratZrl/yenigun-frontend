// src/features/home/comments/ui/CommentsSlider.client.tsx
"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import type { CommentItem } from "../types";
import CommentCard from "./CommentCard.client";
import SwiperPaginationStyles from "./SwiperPaginationStyles.client";

type Props = {
  items: CommentItem[];
};

export default function CommentsSlider({ items }: Props) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative">
      <SwiperPaginationStyles />

      <Swiper
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 28 },
        }}
        style={{ padding: "3rem 1rem" }}
        modules={[Pagination, Navigation, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation
        onBeforeInit={(swiper) => {
          const s: any = swiper;
          s.params.navigation.prevEl = prevRef.current;
          s.params.navigation.nextEl = nextRef.current;
          s.params.pagination.el = paginationRef.current;
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.title}-${index}`}>
            <CommentCard item={item} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          ref={prevRef}
          type="button"
          aria-label="Önceki"
          className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={paginationRef} className="swiper-pagination" />

        <button
          ref={nextRef}
          type="button"
          aria-label="Sonraki"
          className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 border border-gray-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
