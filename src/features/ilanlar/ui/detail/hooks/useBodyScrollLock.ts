// src/features/ads/ui/detail/hooks/useBodyScrollLock.ts
"use client";

import { useEffect } from "react";

/**
 * Modal/overlay açıkken body scroll'u kilitler.
 * iOS Safari dahil daha stabil olsun diye:
 * - body overflow hidden
 * - mevcut scroll pozisyonunu koru
 * - cleanup'ta geri yükle
 *
 * Kullanım:
 * useBodyScrollLock(isOpen)
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const body = document.body;
    const html = document.documentElement;

    const prevOverflow = body.style.overflow;
    const prevPosition = body.style.position;
    const prevTop = body.style.top;
    const prevWidth = body.style.width;
    const prevScrollBehavior = html.style.scrollBehavior;

    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Scroll'u kilitle ama sayfa zıplamasın
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    // Overlay açılınca smooth scroll bazen saçmalıyor
    html.style.scrollBehavior = "auto";

    return () => {
      // restore
      body.style.overflow = prevOverflow;
      body.style.position = prevPosition;
      body.style.top = prevTop;
      body.style.width = prevWidth;
      html.style.scrollBehavior = prevScrollBehavior;

      // geri eski scroll pozisyonuna dön
      const y = prevTop ? Math.abs(parseInt(prevTop, 10)) : scrollY;
      window.scrollTo(0, Number.isFinite(y) ? y : scrollY);
    };
  }, [locked]);
}
