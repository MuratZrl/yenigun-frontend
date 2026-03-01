// src/features/admin/listing-edit/ui/components/EditVideoSection.tsx
"use client";

import React, { useRef } from "react";
import { Video } from "lucide-react";

import { formatMB } from "../../model/utils";

import Section from "./Section";

interface EditVideoSectionProps {
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  onPickVideo?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  effectiveVideoSrc: string | null;
}

export default function EditVideoSection({ videoFile, setVideoFile, onPickVideo, effectiveVideoSrc }: EditVideoSectionProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title="Video" defaultOpen={false}>
      <input type="file" accept="video/*" onChange={onPickVideo} ref={videoInputRef} className="hidden" />

      {effectiveVideoSrc ? (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-black">
            <video controls className="w-full max-h-[280px]"><source src={effectiveVideoSrc} /></video>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-gray-500">
              {videoFile ? `Yeni: ${videoFile.name} (${formatMB(videoFile.size)})` : "Mevcut video"}
            </span>
            <div className="flex gap-2">
              {onPickVideo && (
                <button type="button" onClick={() => videoInputRef.current?.click()} className="text-[12px] text-blue-600 hover:underline">Değiştir</button>
              )}
              <button type="button" onClick={() => setVideoFile(null)} className="text-[12px] text-red-500 hover:underline">Kaldır</button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => videoInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        >
          <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-[13px] text-blue-600 font-medium">Video Yükle</p>
          <p className="text-[11px] text-gray-400 mt-1">MP4, MOV, AVI</p>
        </div>
      )}
    </Section>
  );
}
