// src/features/ads/ui/detail/components/shared/PhotoThumbnailsHorizontal.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type PhotoThumbnailsHorizontalProps = {
  photos: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  fallbackPhoto?: string; // default: "/logo.png"
  className?: string;
};

/**
 * Yatay thumbnail listesi
 * - touch ile drag-scroll
 * - seçili thumbnail otomatik merkeze kayar
 */
export default function PhotoThumbnailsHorizontal({
  photos,
  selectedIndex,
  onSelect,
  fallbackPhoto = "/logo.png",
  className,
}: PhotoThumbnailsHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const safePhotos = useMemo(
    () => (Array.isArray(photos) ? photos.map((p) => String(p ?? "").trim()).filter(Boolean) : []),
    [photos],
  );

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const child = el.children[selectedIndex] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className={["relative", className || ""].join(" ")}>
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2 touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {safePhotos.map((photo, index) => {
          const active = selectedIndex === index;

          return (
            <div
              key={`${photo}-${index}`}
              className="shrink-0 w-16 h-16 relative rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => onSelect(index)}
              title={`Thumbnail ${index + 1}`}
            >
              <img
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full select-none object-cover transition-all duration-300 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackPhoto;
                }}
                loading="lazy"
                decoding="async"
                draggable={false}
              />

              <div
                className={[
                  "absolute inset-0 border-2 transition-all",
                  active ? "border-blue-500 border-3" : "border-transparent group-hover:border-blue-300",
                ].join(" ")}
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

              {active && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
