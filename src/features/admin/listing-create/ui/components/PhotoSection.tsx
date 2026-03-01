// src/features/admin/listing-create/ui/components/PhotoSection.tsx
"use client";

import React, { useRef } from "react";
import { Upload, X, Move } from "lucide-react";
import Section from "./Section";

interface PhotoSectionProps {
  images: { id: string; src: File }[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onOpenReorder: () => void;
}

export default function PhotoSection({ images, onImageChange, onRemoveImage, onOpenReorder }: PhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title="Fotoğraflar" defaultOpen={true}>
      <input type="file" multiple accept="image/*" onChange={onImageChange} ref={fileInputRef} className="hidden" />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
      >
        <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <p className="text-[13px] text-blue-600 font-medium">Resim Yükle</p>
        <p className="text-[11px] text-gray-400 mt-1">PNG, JPG - Maksimum 35 resim</p>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-gray-700">Yüklenen Resimler ({images.length})</span>
            <button type="button" onClick={onOpenReorder} className="text-[12px] text-blue-600 hover:underline flex items-center gap-1"><Move size={14} /> Sırala</button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {images.map((img, i) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={URL.createObjectURL(img.src)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => onRemoveImage(img.id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"><X size={12} /></button>
                {i === 0 && <div className="absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">Kapak</div>}
                <div className="absolute bottom-1 left-1 bg-black/60 text-white px-1 py-0.5 rounded text-[10px]">#{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
