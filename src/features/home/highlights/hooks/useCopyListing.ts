// src/features/home/highlights/hooks/useCopyListing.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyListingLink(basePath = "/ads", resetMs = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const copy = useCallback(
    async (uid: string) => {
      const url = `${window.location.origin}${basePath}/${uid}`;

      try {
        await navigator.clipboard.writeText(url);
        setCopiedId(uid);
      } catch {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          setCopiedId(uid);
        } catch {
          // sessizce geç, kullanıcı zaten hayatın acımasızlığını biliyor
        }
      }

      clearTimer();
      timerRef.current = window.setTimeout(() => setCopiedId(null), resetMs);
    },
    [basePath, resetMs],
  );

  return { copiedId, copy };
}
