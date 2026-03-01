// src/features/admin/listing-create/ui/components/VideoSection.tsx
"use client";

import React, { useRef } from "react";
import { Video, X } from "lucide-react";
import Section from "./Section";

interface VideoSectionProps {
  videoFile: File | null;
  setVideoFile: (f: File | null) => void;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function VideoSection({ videoFile, setVideoFile, onVideoChange }: VideoSectionProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title="Video" defaultOpen={false}>
      <input type="file" accept="video/*" onChange={onVideoChange} ref={videoInputRef} className="hidden" />

      <div
        onClick={() => videoInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
      >
        <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <p className="text-[13px] text-blue-600 font-medium">Video Yükle</p>
        <p className="text-[11px] text-gray-400 mt-1">MP4, MOV, AVI - Maksimum 100MB</p>
      </div>

      {videoFile && (
        <div className="mt-3 p-3 border border-green-200 rounded-lg bg-green-50 flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2">
            <Video className="text-green-600" size={16} />
            <span className="font-medium text-green-800">{videoFile.name}</span>
          </div>
          <button type="button" onClick={() => setVideoFile(null)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
        </div>
      )}
    </Section>
  );
}
