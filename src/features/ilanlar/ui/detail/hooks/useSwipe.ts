// src/features/ads/ui/detail/hooks/useSwipe.ts
"use client";

import { useCallback, useMemo, useRef } from "react";

type SwipeDirection = "left" | "right";

type UseSwipeArgs = {
  minDistance?: number; // default: 50
  onSwipe?: (dir: SwipeDirection) => void;
  // Eğer sadece yatay swipe istiyorsan vertical ignore eder
  maxVerticalDelta?: number; // default: 80
};

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
};

export function useSwipe({
  minDistance = 50,
  onSwipe,
  maxVerticalDelta = 80,
}: UseSwipeArgs = {}): SwipeHandlers {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const endX = useRef<number | null>(null);
  const endY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.targetTouches[0];
    startX.current = t?.clientX ?? null;
    startY.current = t?.clientY ?? null;
    endX.current = null;
    endY.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.targetTouches[0];
    endX.current = t?.clientX ?? null;
    endY.current = t?.clientY ?? null;
  }, []);

  const onTouchEnd = useCallback(() => {
    const sx = startX.current;
    const sy = startY.current;
    const ex = endX.current;
    const ey = endY.current;

    startX.current = null;
    startY.current = null;
    endX.current = null;
    endY.current = null;

    if (sx === null || sy === null || ex === null || ey === null) return;

    const dx = sx - ex;
    const dy = sy - ey;

    // Dikey scroll hareketini swipe olarak sayma
    if (Math.abs(dy) > maxVerticalDelta) return;

    if (Math.abs(dx) < minDistance) return;

    const dir: SwipeDirection = dx > 0 ? "left" : "right";
    onSwipe?.(dir);
  }, [minDistance, maxVerticalDelta, onSwipe]);

  return useMemo(
    () => ({
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    }),
    [onTouchStart, onTouchMove, onTouchEnd],
  );
}
