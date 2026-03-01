// src/features/admin/listing-edit/ui/components/EditPhotoSection.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload, X, ListOrdered } from "lucide-react";

import type { MediaItem } from "@/types/property";
import { isRemote } from "@/types/property";

import Section from "./Section";

interface EditPhotoSectionProps {
  mediaItems: MediaItem[];
  previewSrc: Map<string, string>;
  onPickImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveClick: (item: MediaItem) => void;
  onOpenSortModal: () => void;
}

export default function EditPhotoSection({ mediaItems, previewSrc, onPickImages, onRemoveClick, onOpenSortModal }: EditPhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title="Fotoğraflar" defaultOpen={true}>
      <input type="file" multiple accept="image/*" onChange={onPickImages} ref={fileInputRef} className="hidden" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] text-gray-500">{mediaItems.length}/35 • Kapak: 1. fotoğraf</span>
        <div className="flex items-center gap-2">
          {mediaItems.length >= 2 && (
            <button type="button" onClick={onOpenSortModal} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><ListOrdered size={14} /> Sırala</button>
          )}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><Upload size={14} /> Fotoğraf Ekle</button>
        </div>
      </div>

      {mediaItems.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
        >
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-[13px] text-blue-600 font-medium">Resim Yükle</p>
          <p className="text-[11px] text-gray-400 mt-1">PNG, JPG - Maksimum 35 resim</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {mediaItems.map((item, i) => {
            const src = previewSrc.get(item.id) || "";
            const badge = isRemote(item) ? "Mevcut" : "Yeni";
            return (
              <div key={item.id} className={`relative group aspect-square rounded-lg overflow-hidden border ${i === 0 ? "border-yellow-300" : "border-gray-200"}`}>
                {src ? (
                  <Image src={src} alt={`photo-${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 16vw" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                <button type="button" onClick={() => onRemoveClick(item)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"><X size={12} /></button>
                {i === 0 && <div className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">Kapak</div>}
                <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1 py-0.5 rounded text-[10px]">#{i + 1}</div>
                <div className="absolute bottom-1 right-1 bg-white/80 text-gray-600 px-1 py-0.5 rounded text-[9px]">{badge}</div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
