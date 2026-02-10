// src/features/home/representatives/ui/SwiperPaginationStyles.client.tsx
"use client";

import React from "react";

export default function SwiperPaginationStyles() {
  return (
    <style jsx global>{`
      #represent .swiper-pagination {
        position: relative !important;
        bottom: auto !important;
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
      }
      #represent .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background: #d1d5db;
        opacity: 1;
      }
      #represent .swiper-pagination-bullet-active {
        background: #2563eb;
      }
    `}</style>
  );
}
