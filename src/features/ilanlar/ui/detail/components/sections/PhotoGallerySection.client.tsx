// src/features/ads/ui/detail/components/sections/PhotoGallerySection.client.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Play, X } from "lucide-react";
import type { AdvertData } from "@/types/advert";
import PhotoThumbnailsHorizontal from "../shared/PhotoThumbnailsHorizontal";

type Props = {
  data?: AdvertData;

  photos?: unknown;
  videoUrl?: string | null;

  fallbackPhoto?: string;
  className?: string;

  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

function safeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.map((x) => String(x ?? "").trim()).filter(Boolean);
}

function safeUrl(input: unknown): string | null {
  const s = String(input ?? "").trim();
  return s ? s : null;
}

export default function PhotoGallerySection({
  data,
  photos,
  videoUrl,
  fallbackPhoto = "/logo.png",
  className,
  initialIndex = 0,
  onIndexChange,
}: Props) {
  const resolvedPhotos = useMemo(() => {
    const raw = photos !== undefined ? photos : (data as any)?.photos;
    return safeStringArray(raw);
  }, [photos, data]);

  const resolvedVideoUrl = useMemo(() => {
    const raw = videoUrl !== undefined ? videoUrl : (data as any)?.video;
    return safeUrl(raw);
  }, [videoUrl, data]);

  const ilanNo =
  (data as any)?.uid ??
  (data as any)?.advertNo ??
  (data as any)?.ilanNo ??
  (data as any)?.no ??
  "";

  const quickLinks = [
    { label: "Emlak Endeksi", href: "/emlak-endeksi" },
    { label: "Gayrimenkul Ekspertizi", href: "/gayrimenkul-ekspertizi" },
    { label: "Emlak Alım Rehberi", href: "/emlak-alim-rehberi" },
  ];

  const hasPhotos = resolvedPhotos.length > 0;

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const i = Number.isFinite(initialIndex) ? initialIndex : 0;
    const max = Math.max(resolvedPhotos.length - 1, 0);
    return Math.min(Math.max(i, 0), max);
  });

  useEffect(() => {
    const i = Number.isFinite(initialIndex) ? initialIndex : 0;
    const max = Math.max(resolvedPhotos.length - 1, 0);
    const next = Math.min(Math.max(i, 0), max);
    setSelectedIndex(next);
    onIndexChange?.(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex]);

  useEffect(() => {
    setSelectedIndex((prev) => {
      const max = Math.max(resolvedPhotos.length - 1, 0);
      const next = Math.min(Math.max(prev, 0), max);
      if (next !== prev) onIndexChange?.(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedPhotos.length]);

  const [imageLoading, setImageLoading] = useState(hasPhotos);
  useEffect(() => {
    if (hasPhotos) setImageLoading(true);
  }, [selectedIndex, hasPhotos]);

  const currentPhoto = hasPhotos ? resolvedPhotos[selectedIndex] : fallbackPhoto;

  const setIndex = (next: number) => {
    const max = Math.max(resolvedPhotos.length - 1, 0);
    const clamped = Math.min(Math.max(next, 0), max);
    setSelectedIndex(clamped);
    onIndexChange?.(clamped);
  };

  const goPrev = () => {
    if (!hasPhotos) return;
    setIndex(selectedIndex === 0 ? resolvedPhotos.length - 1 : selectedIndex - 1);
  };

  const goNext = () => {
    if (!hasPhotos) return;
    setIndex(selectedIndex === resolvedPhotos.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = fallbackPhoto;
  };

  // Video modal
  const [openVideo, setOpenVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  // Zoom modal
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1);

  const openZoom = () => {
    if (!hasPhotos) return;
    setZoomLevel(1);
    setZoomOpen(true);
  };

  const toggleZoomLevel = () => {
    setZoomLevel((p) => (p === 1 ? 2 : 1));
  };

  // Body scroll lock
  useEffect(() => {
    const shouldLock = zoomOpen || openVideo;
    if (!shouldLock) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, [zoomOpen, openVideo]);

  // Swipe (mobile + zoom)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null || !hasPhotos) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goNext();
    if (distance < -minSwipeDistance) goPrev();
  };

  const handleTouchStartZoom = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMoveZoom = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEndZoom = () => {
    if (touchStart === null || touchEnd === null || !hasPhotos) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goNext();
    if (distance < -minSwipeDistance) goPrev();
  };

  // Desktop thumbnail paging (2 satır x 5 kolon = 10)
  const THUMBS_PER_PAGE = 10;
  const pageCount = Math.max(1, Math.ceil(resolvedPhotos.length / THUMBS_PER_PAGE));
  const [thumbPage, setThumbPage] = useState(0);

  useEffect(() => {
    setThumbPage((p) => Math.min(Math.max(p, 0), Math.max(pageCount - 1, 0)));
  }, [pageCount]);

  useEffect(() => {
    const targetPage = Math.floor(selectedIndex / THUMBS_PER_PAGE);
    if (targetPage !== thumbPage) setThumbPage(targetPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const thumbStart = thumbPage * THUMBS_PER_PAGE;
  const visibleThumbs = resolvedPhotos.slice(thumbStart, thumbStart + THUMBS_PER_PAGE);

  const prevThumbPage = () => setThumbPage((p) => Math.max(0, p - 1));
  const nextThumbPage = () => setThumbPage((p) => Math.min(pageCount - 1, p + 1));

  const dotCount = Math.min(pageCount, 3);

  // Sahibinden gibi 3 nokta hissi
    const activeDot =
    pageCount <= 3
        ? thumbPage
        : Math.round((thumbPage * (dotCount - 1)) / (pageCount - 1));

  return (
    <section className={["w-full", className || ""].join(" ")}>

      {/* DESKTOP */}
      <div className="hidden lg:block bg-white border border-gray-300">
        {/* Büyük foto (ok yok, tık = next) */}
        <div className="relative">
          <img
            ref={(el) => {
              if (el?.complete && el.naturalWidth > 0) setImageLoading(false);
            }}
            src={currentPhoto}
            onClick={() => {
              if (resolvedPhotos.length > 1) goNext();
            }}
            onLoad={() => setImageLoading(false)}
            onError={handleImageError}
            className={`w-full h-[360px] select-none ${hasPhotos ? "object-cover cursor-pointer" : "object-contain p-8 bg-gray-50"}`}
            alt={hasPhotos ? `İlan Fotoğrafı ${selectedIndex + 1}` : "İlan"}
            loading={hasPhotos ? "lazy" : "eager"}
            decoding="async"
            draggable={false}
          />

          {imageLoading && hasPhotos && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600" />
            </div>
          )}

            {!!ilanNo && (
                <div className="absolute left-2 top-2 text-[12px] text-gray-400 select-none">
                #{ilanNo}
                </div>
            )}
        </div>

        {/* Büyük Fotoğraf | Video bar (eşit + centered) */}
        <div className="grid grid-cols-2 border-t border-gray-300 bg-white text-[12px]">
        {/* SOL */}
        <button
            type="button"
            onClick={openZoom}
            className="h-9 flex items-center justify-center gap-1 text-blue-700 hover:underline underline-offset-2"
        >
            <ZoomIn size={14} />
            Büyük Fotoğraf
        </button>

        {/* SAĞ (divider bu hücrenin içinde) */}
        <div className="relative h-9 flex items-center justify-center">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-px bg-gray-300" />

            {resolvedVideoUrl ? (
            <button
                type="button"
                onClick={() => {
                setVideoLoading(true);
                setOpenVideo(true);
                }}
                className="inline-flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900 hover:underline underline-offset-2"
            >
                <Play size={14} />
                Video
            </button>
            ) : (
            <span className="inline-flex items-center justify-center gap-1 text-gray-300 select-none">
                <Play size={14} />
                Video
            </span>
            )}
        </div>
        </div>

        {/* Thumbnail grid + alt navigasyon */}
        {hasPhotos && resolvedPhotos.length > 1 && (
          <div className="border-t border-gray-300 bg-white px-3 py-3">
            <div className="grid grid-cols-5 gap-2">
              {visibleThumbs.map((p, i) => {
                const realIndex = thumbStart + i;
                const active = realIndex === selectedIndex;
                return (
                  <button
                    key={`${p}-${realIndex}`}
                    type="button"
                    onClick={() => setIndex(realIndex)}
                    className={[
                      "h-[54px] border overflow-hidden bg-white",
                      active ? "border-blue-600" : "border-gray-300 hover:border-gray-400",
                    ].join(" ")}
                    title={`${realIndex + 1}. Fotoğraf`}
                  >
                    <img
                      src={p}
                      alt={`thumb-${realIndex}`}
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = fallbackPhoto)}
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-2 grid grid-cols-3 items-center text-[12px] text-gray-700">
              <div>
                {selectedIndex + 1}/{resolvedPhotos.length} Fotoğraf
              </div>

              <div className="justify-self-center flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevThumbPage}
                  disabled={thumbPage === 0}
                  className={[
                    "w-7 h-7 border border-gray-300 bg-white flex items-center justify-center",
                    thumbPage === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50",
                  ].join(" ")}
                  aria-label="Önceki küçük resimler"
                >
                  <ChevronLeft size={16} className="text-gray-700" />
                </button>

                <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: dotCount }).map((_, d) => (
                        <span
                        key={d}
                        className={[
                            "w-2 h-2 rounded-full",
                            d === activeDot ? "bg-gray-600" : "bg-gray-300",
                        ].join(" ")}
                        />
                    ))}
                </div>

                <button
                  type="button"
                  onClick={nextThumbPage}
                  disabled={thumbPage >= pageCount - 1}
                  className={[
                    "w-7 h-7 border border-gray-300 bg-white flex items-center justify-center",
                    thumbPage >= pageCount - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50",
                  ].join(" ")}
                  aria-label="Sonraki küçük resimler"
                >
                  <ChevronRight size={16} className="text-gray-700" />
                </button>
              </div>

              <div />
            </div>
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div
        className="lg:hidden relative bg-white border border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {imageLoading && hasPhotos && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1f6f93]" />
          </div>
        )}

        <img
          ref={(el) => {
            if (el?.complete && el.naturalWidth > 0) setImageLoading(false);
          }}
          src={currentPhoto}
          onClick={() => resolvedPhotos.length > 1 && goNext()}
          onLoad={() => setImageLoading(false)}
          onError={handleImageError}
          className={[
            `w-full h-[260px] select-none ${hasPhotos ? "object-cover cursor-pointer" : "object-contain p-8 bg-gray-50"}`,
            imageLoading && hasPhotos ? "opacity-0" : "opacity-100",
          ].join(" ")}
          alt={hasPhotos ? `İlan Fotoğrafı ${selectedIndex + 1}` : "İlan"}
          loading={hasPhotos ? "lazy" : "eager"}
          decoding="async"
          draggable={false}
        />

        {!!ilanNo && (
          <div className="absolute left-2 top-2 text-[12px] text-white bg-black/40 px-2 py-1 rounded select-none">
            #{ilanNo}
          </div>
        )}

        {hasPhotos && resolvedPhotos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-700/70 text-white text-xs px-3 py-1 rounded-full">
            {selectedIndex + 1} / {resolvedPhotos.length}
          </div>
        )}
      </div>


      {/* VIDEO MODAL */}
      {openVideo && resolvedVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setOpenVideo(false)}
        >
          <div
            className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] mx-2 sm:mx-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setOpenVideo(false)}
              aria-label="Kapat"
            >
              <X size={32} />
            </button>

            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-none sm:rounded-2xl">
                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white" />
              </div>
            )}

            <div className="relative grow sm:grow-0 sm:aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden">
              <iframe
                src={resolvedVideoUrl}
                title="İlan Videosu"
                className="w-full h-full"
                frameBorder={0}
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={() => setVideoLoading(false)}
                onError={() => setVideoLoading(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ZOOM MODAL */}
      {zoomOpen && hasPhotos && (
        <div
          className="pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={() => {
            setZoomOpen(false);
            setZoomLevel(1);
          }}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStartZoom}
            onTouchMove={handleTouchMoveZoom}
            onTouchEnd={handleTouchEndZoom}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(false);
                setZoomLevel(1);
              }}
              aria-label="Kapat"
            >
              <X size={24} />
            </button>

            {resolvedPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Önceki"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Sonraki"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <div className="relative max-w-7xl max-h-[80vh] flex items-center justify-center mb-4">
              <img
                src={currentPhoto}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoomLevel();
                }}
                className={[
                  "max-h-[70vh] max-w-full select-none object-contain transition-transform duration-300 cursor-zoom-out",
                  zoomLevel === 2 ? "scale-150" : "scale-100",
                ].join(" ")}
                onError={handleImageError}
                draggable={false}
                alt="Zoom"
              />
            </div>

            {resolvedPhotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
                  <PhotoThumbnailsHorizontal
                    photos={resolvedPhotos}
                    selectedIndex={selectedIndex}
                    onSelect={(i) => setIndex(i)}
                    fallbackPhoto={fallbackPhoto}
                  />
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </section>
  );
}
