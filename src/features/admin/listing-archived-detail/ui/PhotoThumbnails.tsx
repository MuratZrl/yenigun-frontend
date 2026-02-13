// src/features/admin/emlak-archived-detail/ui/PhotoThumbnails.tsx

"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { handleImageError } from "../utils/helpers";

type Props = {
  photos: string[];
  selectedPhoto: number;
  setSelectedPhoto: (index: number) => void;
  visibleCount?: number;
};

export default function PhotoThumbnails({
  photos,
  selectedPhoto,
  setSelectedPhoto,
  visibleCount = 8,
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(photos.length / visibleCount);
  const startIndex = currentPage * visibleCount;
  const visiblePhotos = photos.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-2">
        {visiblePhotos.map((photo, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedPhoto(actualIndex)}
            >
              <img
                src={photo}
                alt={`Thumbnail ${actualIndex + 1}`}
                className="w-full h-full object-cover select-none transition-all duration-300 group-hover:scale-110"
                onError={handleImageError}
                loading="lazy"
                decoding="async"
              />
              <div
                className={`absolute inset-0 border-2 transition-all ${
                  selectedPhoto === actualIndex
                    ? "border-blue-500"
                    : "border-transparent group-hover:border-blue-300"
                }`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <>
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={`absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronLeft className="text-gray-700" size={16} />
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className={`absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all ${
              currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChevronRight className="text-gray-700" size={16} />
          </button>

          <div className="flex justify-center mt-3 gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}