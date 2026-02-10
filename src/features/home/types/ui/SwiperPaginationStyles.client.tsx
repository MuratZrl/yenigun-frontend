// src/features/home/types/ui/SwiperPaginationStyles.client.tsx
"use client";

import React from "react";

export default function SwiperPaginationStyles() {
  return (
    <style jsx global>{`
      #types .swiper-pagination {
        position: relative !important;
        bottom: auto !important;
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
      }
      #types .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background: #d1d5db;
        opacity: 1;
      }
      #types .swiper-pagination-bullet-active {
        background: #2563eb;
      }
    `}</style>
  );
}
