// src/features/admin/listing-create/ui/components/ImageReorderModal.tsx
"use client";

import React, { useState } from "react";
import { X, Trash2, GripVertical, CheckCircle } from "lucide-react";

interface ImageReorderModalProps {
  images: { id: string; src: File }[];
  setImages: (imgs: { id: string; src: File }[]) => void;
  onClose: () => void;
  onRemoveImage: (id: string) => void;
}

export default function ImageReorderModal({ images, setImages, onClose, onRemoveImage }: ImageReorderModalProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const newImages = [...images];
    const item = newImages.splice(draggedIndex, 1)[0];
    newImages.splice(index, 0, item);
    setImages(newImages);
    setDraggedIndex(null);
  };

  const moveImage = (index: number, dir: "up" | "down") => {
    if ((dir === "up" && index === 0) || (dir === "down" && index === images.length - 1)) return;
    const n = [...images];
    const ni = dir === "up" ? index - 1 : index + 1;
    [n[index], n[ni]] = [n[ni], n[index]];
    setImages(n);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Resim Sıralama</h2>
              <p className="text-[12px] text-gray-500">{images.length} resim</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 ${i === 0 ? "bg-yellow-50 border-yellow-200" : "border-gray-200"} ${draggedIndex === i ? "border-blue-500 bg-blue-50" : ""}`}
                draggable
                onDragStart={() => setDraggedIndex(i)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(i)}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-bold text-[13px]">{i + 1}</div>
                <div className="w-16 h-12 overflow-hidden rounded bg-gray-100">
                  <img src={URL.createObjectURL(img.src)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-[13px]">
                  <p className="font-medium text-gray-900 truncate">{img.src.name}</p>
                  <p className="text-gray-400">{(img.src.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                {i === 0 && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded-full">Kapak</span>}
                <button type="button" onClick={() => moveImage(i, "up")} disabled={i === 0} className={`p-1 rounded ${i === 0 ? "opacity-30" : "hover:bg-gray-100"}`}>↑</button>
                <button type="button" onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className={`p-1 rounded ${i === images.length - 1 ? "opacity-30" : "hover:bg-gray-100"}`}>↓</button>
                <button type="button" onClick={() => onRemoveImage(img.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                <div className="p-1 text-gray-400 cursor-grab"><GripVertical size={16} /></div>
              </div>
            ))}
          </div>
          <div className="p-5 border-t bg-gray-50 flex justify-end">
            <button type="button" onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-2"><CheckCircle size={16} /> Sıralamayı Tamamla</button>
          </div>
        </div>
      </div>
    </div>
  );
}
