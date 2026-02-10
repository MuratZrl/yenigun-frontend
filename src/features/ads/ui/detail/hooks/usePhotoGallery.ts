// src/features/ads/ui/detail/hooks/usePhotoGallery.ts
"use client";

import { useCallback, useMemo, useState } from "react";

type UsePhotoGalleryArgs = {
  photos?: unknown;
  initialIndex?: number;
  fallbackPhoto?: string; // default: "/logo.png"
};

function sanitizePhotos(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((p) => typeof p === "string")
    .map((p) => p.trim())
    .filter(Boolean);
}

function clampIndex(i: number, len: number): number {
  if (len <= 0) return 0;
  if (!Number.isFinite(i)) return 0;
  if (i < 0) return 0;
  if (i >= len) return len - 1;
  return i;
}

/**
 * Foto galerisi state + next/prev + güvenli photo listesi
 * - photos sanitize edilir (string + trim + empty at)
 * - selectedIndex clamp edilir
 * - next/prev wrap-around çalışır
 */
export function usePhotoGallery({
  photos,
  initialIndex = 0,
  fallbackPhoto = "/logo.png",
}: UsePhotoGalleryArgs) {
  const safePhotos = useMemo(() => sanitizePhotos(photos), [photos]);
  const hasPhotos = safePhotos.length > 0;

  const [selectedIndex, setSelectedIndex] = useState(() =>
    clampIndex(initialIndex, safePhotos.length),
  );

  // photos değişince selectedIndex out-of-range kalmasın
  const selectedPhoto = useMemo(() => {
    if (!hasPhotos) return fallbackPhoto;
    const idx = clampIndex(selectedIndex, safePhotos.length);
    return safePhotos[idx] || fallbackPhoto;
  }, [hasPhotos, selectedIndex, safePhotos, fallbackPhoto]);

  const setIndex = useCallback(
    (index: number) => {
      if (!hasPhotos) {
        setSelectedIndex(0);
        return;
      }
      setSelectedIndex(clampIndex(index, safePhotos.length));
    },
    [hasPhotos, safePhotos.length],
  );

  const next = useCallback(() => {
    if (!hasPhotos) return;
    setSelectedIndex((prev) =>
      prev >= safePhotos.length - 1 ? 0 : prev + 1,
    );
  }, [hasPhotos, safePhotos.length]);

  const prev = useCallback(() => {
    if (!hasPhotos) return;
    setSelectedIndex((prev) => (prev <= 0 ? safePhotos.length - 1 : prev - 1));
  }, [hasPhotos, safePhotos.length]);

  const api = useMemo(
    () => ({
      safePhotos,
      hasPhotos,
      selectedIndex,
      selectedPhoto,
      setIndex,
      next,
      prev,
      total: safePhotos.length,
      fallbackPhoto,
    }),
    [
      safePhotos,
      hasPhotos,
      selectedIndex,
      selectedPhoto,
      setIndex,
      next,
      prev,
      fallbackPhoto,
    ],
  );

  return api;
}
