// src/features/admin/emlak-archived-detail/ui/PhotoGallery.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, Play, Share2 } from "lucide-react";
import PhotoThumbnails from "./PhotoThumbnails";
import { isLowQualityImage } from "../utils/helpers";

type Props = {
  photos: string[];
  currentPhoto: string;
  selectedPhoto: number;
  hasPhotos: boolean;
  shouldShowLoading: boolean;
  copied: boolean;
  video?: string;
  onSelectPhoto: (index: number) => void;
  onClickPhoto: (photo: string) => void;
  onImageLoad: () => void;
  onOpenVideo: () => void;
  onShare: () => void;
};

export default function PhotoGallery({
  photos,
  currentPhoto,
  selectedPhoto,
  hasPhotos,
  shouldShowLoading,
  copied,
  video,
  onSelectPhoto,
  onClickPhoto,
  onImageLoad,
  onOpenVideo,
  onShare,
}: Props) {
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);

  const showFallback = erroredSrc === currentPhoto;
  const displaySrc = showFallback ? "/logo.png" : currentPhoto;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Main photo */}
      <div className="relative">
        {shouldShowLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}
        <div className="relative w-full h-96">
          <Image
            src={displaySrc}
            onClick={() => hasPhotos && onClickPhoto(currentPhoto)}
            onLoad={() => {
              setErroredSrc(null);
              onImageLoad();
            }}
            onError={() => setErroredSrc(currentPhoto)}
            fill
            className={`select-none transition-all duration-300 ${
              shouldShowLoading ? "opacity-0" : "opacity-100"
            } ${hasPhotos ? "cursor-zoom-in hover:scale-105" : "cursor-default"} ${
              showFallback ? "object-contain p-8" : "object-contain"
            }`}
            alt={hasPhotos ? `İlan Fotoğrafı ${selectedPhoto + 1}` : "Yenigün Emlak"}
            priority={!hasPhotos}
            unoptimized
          />
        </div>

        {/* Arrows */}
        {hasPhotos && photos.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              onClick={() => onSelectPhoto(selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1)}
            >
              <ChevronLeft className="text-gray-700" size={16} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
              onClick={() => onSelectPhoto(selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1)}
            >
              <ChevronRight className="text-gray-700" size={16} />
            </button>
          </>
        )}

        {/* Counter */}
        {hasPhotos && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {selectedPhoto + 1} / {photos.length}
          </div>
        )}

        {/* Low quality badge */}
        {isLowQualityImage(currentPhoto) && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            ⚠️ Düşük Çözünürlük
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {hasPhotos && (
              <button
                onClick={() => onClickPhoto(currentPhoto)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
              >
                <ZoomIn size={16} />
                Fotoğrafı Büyüt
              </button>
            )}
            {video && (
              <button
                onClick={onOpenVideo}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Play size={16} />
                Videoyu İzle
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <button
              className="p-2 bg-gray-100 text-gray-600 flex items-center gap-2 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={onShare}
            >
              <Share2 size={16} /> Paylaş
            </button>
            {copied && <span className="text-sm text-green-600">Link kopyalandı!</span>}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {hasPhotos && photos.length > 1 && (
        <div className="p-4 border-t border-gray-100">
          <div className="hidden md:block">
            <PhotoThumbnails photos={photos} selectedPhoto={selectedPhoto} setSelectedPhoto={onSelectPhoto} visibleCount={8} />
          </div>
          <div className="block md:hidden">
            <PhotoThumbnails photos={photos} selectedPhoto={selectedPhoto} setSelectedPhoto={onSelectPhoto} visibleCount={4} />
          </div>
        </div>
      )}
    </div>
  );
}