// src/features/admin/emlak-archived-detail/ui/VideoModal.tsx

"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  videoUrl: string;
  onClose: () => void;
};

export default function VideoModal({ open, videoUrl, onClose }: Props) {
  const [loading, setLoading] = useState(true);

  if (!open || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] mx-2 sm:mx-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          onClick={onClose}
        >
          <X size={32} />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-none sm:rounded-2xl">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-white" />
          </div>
        )}

        <div className="relative flex-grow sm:flex-grow-0 sm:aspect-[16/9] bg-black rounded-none sm:rounded-2xl overflow-hidden">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}