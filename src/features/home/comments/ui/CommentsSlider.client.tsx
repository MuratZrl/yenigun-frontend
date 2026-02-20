// src/features/home/comments/ui/CommentsSlider.client.tsx
"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import type { CommentItem } from "../types";
import CommentCard from "./CommentCard.client";

type Props = {
  items: CommentItem[];
};

export default function CommentsSlider({ items }: Props) {
  return (
    <div className="relative">
      <style jsx global>{`
        #comments .swiper-pagination {
          position: relative !important;
          bottom: auto !important;
          margin-top: 2rem;
          display: flex;
          gap: 6px;
          justify-content: center;
          align-items: center;
        }
        #comments .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          border-radius: 9999px;
          transition: all 0.3s;
        }
        #comments .swiper-pagination-bullet-active {
          background: #4f46e5;
          width: 24px;
        }
        #comments .swiper-slide {
          height: 280px !important;
        }
      `}</style>

      <Swiper
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        modules={[Pagination, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: false }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={`${item.title}-${index}`}>
            <CommentCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
