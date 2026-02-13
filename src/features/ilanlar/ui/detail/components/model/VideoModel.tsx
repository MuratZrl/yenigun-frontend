// src/features/ads/ui/detail/components/model/VideoModel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

type Props = {
  open: boolean;
  videoUrl?: string | null;
  onClose: () => void;
  title?: string;
};

export default function VideoModal({ open, videoUrl, onClose, title = "Video" }: Props) {
  const [loading, setLoading] = useState(true);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
  }, [open, videoUrl]);

  if (!open || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={title}
    >
      <div
        className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] mx-2 sm:mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          onClick={onClose}
          aria-label="Kapat"
          type="button"
        >
          <X size={32} />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-none sm:rounded-2xl">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white" />
          </div>
        )}

        <div className="relative grow sm:grow-0 sm:aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            frameBorder={0}
            allow="autoplay; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
