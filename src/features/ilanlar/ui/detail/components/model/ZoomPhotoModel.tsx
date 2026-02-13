// src/features/ads/ui/detail/components/modals/ZoomPhotoModal.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSwipe } from "../../hooks/useSwipe";

type Props = {
  open: boolean;

  photos: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;

  onPrev: () => void;
  onNext: () => void;

  zoomLevel: 1 | 2;
  onToggleZoom: () => void;

  onClose: () => void;

  fallbackPhoto?: string; // default: "/logo.png"
  title?: string;
};

function clamp(i: number, len: number) {
  if (len <= 0) return 0;
  if (i < 0) return 0;
  if (i >= len) return len - 1;
  return i;
}

export default function ZoomPhotoModal({
  open,
  photos,
  selectedIndex,
  onSelectIndex,
  onPrev,
  onNext,
  zoomLevel,
  onToggleZoom,
  onClose,
  fallbackPhoto = "/logo.png",
  title = "Fotoğraf",
}: Props) {
  useBodyScrollLock(open);

  const safePhotos = useMemo(() => {
    return Array.isArray(photos)
      ? photos.map((p) => String(p ?? "").trim()).filter(Boolean)
      : [];
  }, [photos]);

  const hasPhotos = safePhotos.length > 0;
  const idx = clamp(selectedIndex, safePhotos.length);
  const currentPhoto = hasPhotos ? safePhotos[idx] : fallbackPhoto;

  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => {
    if (!open) return;
    const el = thumbsRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [open, idx]);

  const swipe = useSwipe({
    minDistance: 50,
    maxVerticalDelta: 90,
    onSwipe: (dir) => {
      if (!hasPhotos) return;
      if (dir === "left") onNext();
      else onPrev();
    },
  });

  if (!open) return null;

  return (
    <div
      className="pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
        {...swipe}
      >
        <button
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Kapat"
          type="button"
        >
          <X size={24} />
        </button>

        {hasPhotos && safePhotos.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Önceki"
              type="button"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Sonraki"
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="relative max-w-7xl max-h-[80vh] flex items-center justify-center mb-4">
          <img
            src={currentPhoto}
            alt={hasPhotos ? `Fotoğraf ${idx + 1}` : "Fotoğraf"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleZoom();
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackPhoto;
            }}
            className={[
              "max-h-[70vh] max-w-full select-none object-contain transition-transform duration-300 cursor-zoom-out",
              zoomLevel === 2 ? "scale-150" : "scale-100",
            ].join(" ")}
            draggable={false}
          />
        </div>

        {hasPhotos && safePhotos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
              <div
                ref={thumbsRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-2 touch-pan-x"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {safePhotos.map((p, i) => {
                  const active = i === idx;
                  return (
                    <button
                      key={`${p}-${i}`}
                      type="button"
                      className="shrink-0 w-16 h-16 relative rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => onSelectIndex(i)}
                      title={`${i + 1}. Fotoğraf`}
                    >
                      <img
                        src={p}
                        alt={`thumb-${i + 1}`}
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
                    </button>
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
          </div>
        )}
      </div>
    </div>
  );
}
