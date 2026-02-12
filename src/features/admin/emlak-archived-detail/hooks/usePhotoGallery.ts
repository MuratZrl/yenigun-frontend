// src/features/admin/emlak-archived-detail/hooks/usePhotoGallery.ts

"use client";

import { useState, useEffect, useCallback } from "react";
import type { ZoomState } from "../types";

export function usePhotoGallery(photos: string[]) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [zoom, setZoom] = useState<ZoomState>({ show: false, photo: "", level: 1 });
  const [openVideo, setOpenVideo] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);

  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[selectedPhoto] : "/logo.png";
  const shouldShowLoading = hasPhotos && imageLoading;

  /* ---- Lock body scroll when modal is open ---- */
  useEffect(() => {
    document.body.style.overflow = zoom.show || openVideo ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [zoom.show, openVideo]);

  /* ---- Photo click (toggle zoom level) ---- */
  const handleClickedPhoto = useCallback(
    (photo: string) => {
      if (zoom.show && zoom.photo === photo) {
        setZoom((prev) => ({ ...prev, level: prev.level === 1 ? 2 : 1 }));
      } else {
        setZoom({ show: true, photo, level: 1 });
      }
    },
    [zoom.show, zoom.photo]
  );

  /* ---- Navigation ---- */
  const goToPrevious = useCallback(() => {
    if (!hasPhotos) return;
    const prev = selectedPhoto === 0 ? photos.length - 1 : selectedPhoto - 1;
    setSelectedPhoto(prev);
    setZoom((z) => ({ ...z, photo: photos[prev] }));
  }, [hasPhotos, selectedPhoto, photos]);

  const goToNext = useCallback(() => {
    if (!hasPhotos) return;
    const next = selectedPhoto === photos.length - 1 ? 0 : selectedPhoto + 1;
    setSelectedPhoto(next);
    setZoom((z) => ({ ...z, photo: photos[next] }));
  }, [hasPhotos, selectedPhoto, photos]);

  /* ---- Close zoom ---- */
  const closeZoom = useCallback(() => {
    setZoom({ show: false, photo: "", level: 1 });
  }, []);

  /* ---- Select photo from thumbnail (also updates zoom if open) ---- */
  const selectPhoto = useCallback(
    (index: number) => {
      setSelectedPhoto(index);
      if (zoom.show) {
        setZoom((z) => ({ ...z, photo: photos[index] }));
      }
    },
    [zoom.show, photos]
  );

  return {
    selectedPhoto,
    setSelectedPhoto: selectPhoto,
    zoom,
    openVideo,
    setOpenVideo,
    imageLoading,
    setImageLoading,
    videoLoading,
    setVideoLoading,

    hasPhotos,
    currentPhoto,
    shouldShowLoading,

    handleClickedPhoto,
    goToPrevious,
    goToNext,
    closeZoom,
  };
}