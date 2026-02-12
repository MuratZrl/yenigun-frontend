// src/features/admin/emlak-archived-detail/ui/PhotoThumbnailsHorizontal.tsx

"use client";

import React, { useRef, useState, useEffect } from "react";
import { handleImageError } from "../utils/helpers";

type Props = {
  photos: string[];
  selectedPhoto: number;
  setSelectedPhoto: (index: number) => void;
};

export default function PhotoThumbnailsHorizontal({
  photos,
  selectedPhoto,
  setSelectedPhoto,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.children[selectedPhoto] as HTMLElement;
      el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedPhoto]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (containerRef.current.offsetLeft || 0);
    containerRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-2 touch-pan-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {photos.map((photo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedPhoto(index)}
          >
            <img
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full select-none object-cover transition-all duration-300 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
              decoding="async"
            />
            <div
              className={`absolute inset-0 border-2 transition-all ${
                selectedPhoto === index
                  ? "border-blue-500 border-3"
                  : "border-transparent group-hover:border-blue-300"
              }`}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {selectedPhoto === index && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}