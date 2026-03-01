// src/features/admin/listing-edit/ui/components/EditImageReorderModal.tsx
"use client";

import React from "react";
import Image from "next/image";
import { X, ArrowUp, ArrowDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { MediaItem } from "@/types/property";
import { isRemote, isLocal } from "@/types/property";
import { move, formatMB } from "../../model/utils";

interface EditImageReorderModalProps {
  open: boolean;
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  previewSrc: Map<string, string>;
  onClose: () => void;
  onRemoveClick: (item: MediaItem) => void;
}

export default function EditImageReorderModal({ open, mediaItems, setMediaItems, previewSrc, onClose, onRemoveClick }: EditImageReorderModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Resim Sıralama</h2>
                  <p className="text-[12px] text-gray-500">{mediaItems.length} resim • İlk resim kapak olarak kullanılacaktır</p>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {mediaItems.map((item, i) => {
                  const src = previewSrc.get(item.id) || "";
                  const badge = isRemote(item) ? "Mevcut" : "Yeni";
                  return (
                    <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${i === 0 ? "bg-yellow-50 border-yellow-200" : "border-gray-200"}`}>
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-bold text-[13px]">{i + 1}</div>
                      <div className="w-16 h-12 overflow-hidden rounded bg-gray-100 relative">
                        {src ? <Image src={src} alt="" fill className="object-cover" sizes="64px" /> : <div className="w-full h-full bg-gray-100" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {i === 0 && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded-full">Kapak</span>}
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-full">{badge}</span>
                        </div>
                        <div className="mt-1 text-[13px] font-medium text-gray-900 truncate">
                          {isRemote(item) ? "Mevcut fotoğraf" : isLocal(item) ? item.file.name : "Fotoğraf"}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {isLocal(item) ? `${formatMB(item.file.size)} • ${item.file.type.split("/")[1] || ""}` : "Yayındaki görsel"}
                        </div>
                      </div>
                      <button type="button" onClick={() => setMediaItems(prev => move(prev, i, i - 1))} disabled={i === 0} className={`p-1.5 rounded ${i === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}><ArrowUp size={16} /></button>
                      <button type="button" onClick={() => setMediaItems(prev => move(prev, i, i + 1))} disabled={i === mediaItems.length - 1} className={`p-1.5 rounded ${i === mediaItems.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}><ArrowDown size={16} /></button>
                      <button type="button" onClick={() => onRemoveClick(item)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><X size={16} /></button>
                    </div>
                  );
                })}
              </div>
              <div className="p-5 border-t bg-gray-50 flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-[13px] hover:bg-gray-50">Vazgeç</button>
                <button type="button" onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-2"><CheckCircle size={16} /> Sıralamayı Tamamla</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
