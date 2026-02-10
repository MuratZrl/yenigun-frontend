// src/features/home/locations/ui/SwiperPaginationStyles.client.tsx
"use client";

import React from "react";

export default function SwiperPaginationStyles() {
  return (
    <style jsx global>{`
      #locations .swiper-pagination {
        position: relative !important;
        bottom: auto !important;
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
      }
      #locations .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background: #d1d5db;
        opacity: 1;
      }
      #locations .swiper-pagination-bullet-active {
        background: #2563eb;
      }
    `}</style>
  );
}
