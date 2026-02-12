// src/features/admin/emlak-archived-detail/ui/PhotoZoomModal.tsx

"use client";

import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import PhotoThumbnailsHorizontal from "./PhotoThumbnailsHorizontal";
import { handleImageError } from "../utils/helpers";
import type { ZoomState } from "../types";

type Props = {
  zoom: ZoomState;
  photos: string[];
  selectedPhoto: number;
  hasPhotos: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClickPhoto: (photo: string) => void;
  onSelectPhoto: (index: number) => void;
};

export default function PhotoZoomModal({
  zoom,
  photos,
  selectedPhoto,
  hasPhotos,
  onClose,
  onPrevious,
  onNext,
  onClickPhoto,
  onSelectPhoto,
}: Props) {
  if (!zoom.show) return null;

  return (
    <div
      className="pt-20 fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 backdrop-blur-sm"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <X size={24} />
        </button>

        {/* Nav arrows */}
        {hasPhotos && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Photo */}
        <div className="relative max-w-7xl max-h-[80vh] flex items-center justify-center mb-4">
          <img
            src={zoom.photo}
            onClick={(e) => { e.stopPropagation(); onClickPhoto(zoom.photo); }}
            className={`max-h-[70vh] max-w-full select-none object-contain transition-transform duration-300 cursor-zoom-out ${
              zoom.level === 2 ? "scale-150" : "scale-100"
            }`}
            onError={handleImageError}
          />
        </div>

        {/* Thumbnails */}
        {hasPhotos && photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3">
              <PhotoThumbnailsHorizontal
                photos={photos}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={onSelectPhoto}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}