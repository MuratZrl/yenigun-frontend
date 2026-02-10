// src/features/ads/ui/detail/hooks/useCopyToClipboard.ts
"use client";

import { useCallback, useRef, useState } from "react";

type UseCopyToClipboardOptions = {
  resetAfterMs?: number; // default 2000
};

type CopyResult = {
  copied: boolean;
  error: string | null;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
};

/**
 * Clipboard'a kopyalama helper hook'u.
 * - başarılı olursa copied=true olur, resetAfterMs sonra false'a döner
 * - hata olursa error setlenir
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): CopyResult {
  const { resetAfterMs = 2000 } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (text: string) => {
      reset();

      const value = String(text ?? "");
      if (!value.trim()) {
        setError("Boş değer kopyalanamaz.");
        return false;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback: execCommand (eski ama bazı yerlerde işe yarar)
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          ta.style.left = "-9999px";
          ta.style.top = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand("copy");
          document.body.removeChild(ta);
          if (!ok) throw new Error("execCommand copy başarısız.");
        }

        setCopied(true);
        timerRef.current = window.setTimeout(() => {
          setCopied(false);
          timerRef.current = null;
        }, resetAfterMs);

        return true;
      } catch (e: any) {
        setCopied(false);
        setError(e?.message ? String(e.message) : "Kopyalama başarısız.");
        return false;
      }
    },
    [reset, resetAfterMs],
  );

  return { copied, error, copy, reset };
}
