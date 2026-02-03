"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  GripVertical,
  ImagePlus,
  X,
  ArrowUp,
  ArrowDown,
  ListOrdered,
} from "lucide-react";
import type { MediaItem } from "@/app/types/property";

type Props = {
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onPickImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  max?: number;
};

function isRemote(
  item: MediaItem,
): item is { id: string; kind: "remote"; url: string } {
  return item.kind === "remote";
}

function isLocal(
  item: MediaItem,
): item is { id: string; kind: "local"; file: File } {
  return item.kind === "local";
}

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [spliced] = copy.splice(from, 1);
  copy.splice(to, 0, spliced);
  return copy;
}

export default function EditMediaTab({
  mediaItems,
  setMediaItems,
  onPickImages,
  onRemove,
  max = 35,
}: Props) {
  const [openSortModal, setOpenSortModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const objectUrlMapRef = useRef<Map<string, string>>(new Map());

  const previewSrc = useMemo(() => {
    const map = new Map<string, string>();

    for (const item of mediaItems) {
      if (isRemote(item)) {
        map.set(item.id, item.url);
      } else if (isLocal(item)) {
        const cached = objectUrlMapRef.current.get(item.id);
        if (cached) {
          map.set(item.id, cached);
        } else {
          const url = URL.createObjectURL(item.file);
          objectUrlMapRef.current.set(item.id, url);
          map.set(item.id, url);
        }
      }
    }

    return map;
  }, [mediaItems]);

  useEffect(() => {
    const aliveIds = new Set(mediaItems.filter(isLocal).map((x) => x.id));
    for (const [id, url] of objectUrlMapRef.current.entries()) {
      if (!aliveIds.has(id)) {
        URL.revokeObjectURL(url);
        objectUrlMapRef.current.delete(id);
      }
    }
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      for (const url of objectUrlMapRef.current.values())
        URL.revokeObjectURL(url);
      objectUrlMapRef.current.clear();
    };
  }, []);

  const count = mediaItems.length;
  const remaining = Math.max(0, max - count);

  const handleRemoveClick = (item: MediaItem) => {
    if (item.kind === "remote") {
      const ok = confirm(
        "Bu fotoğraf yayındaki ilandan silinecek. Devam edilsin mi?",
      );
      if (!ok) return;
    }
    onRemove(item.id);
  };

  const handleMoveUp = (index: number) => {
    setMediaItems((prev) => move(prev, index, index - 1));
  };

  const handleMoveDown = (index: number) => {
    setMediaItems((prev) => move(prev, index, index + 1));
  };

  const closeModal = () => setOpenSortModal(false);

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">Fotoğraflar</div>
          <div className="mt-1 text-xs text-gray-500">
            {count}/{max} • Kapak: 1. fotoğraf
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenSortModal(true)}
            disabled={mediaItems.length < 2}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition
            ${
              mediaItems.length < 2
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            }`}
            title={
              mediaItems.length < 2
                ? "Sıralamak için en az 2 fotoğraf olmalı"
                : "Fotoğrafları sırala"
            }
          >
            <ListOrdered size={18} />
            Sırala
          </button>

          <label
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition
            ${
              remaining === 0
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "cursor-pointer border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            }`}
          >
            <ImagePlus size={18} />
            Fotoğraf Ekle
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onPickImages}
              disabled={remaining === 0}
            />
          </label>
        </div>
      </div>

      {mediaItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="text-sm font-semibold text-gray-900">
            Henüz fotoğraf yok
          </div>
          <div className="mt-1 text-xs text-gray-500">
            “Fotoğraf Ekle” ile görselleri yükleyebilirsin.
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item, index) => {
              const src = previewSrc.get(item.id) || "";
              const badge = isRemote(item) ? "Mevcut" : "Yeni";

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm ${
                    index === 0 ? "border-yellow-300" : "border-gray-200"
                  }`}
                >
                  <div className="relative h-40 w-full">
                    {src ? (
                      <Image
                        src={src}
                        alt={`photo-${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-linear-to-b from-black/35 to-transparent" />

                    <div className="absolute left-2 top-2 flex items-center gap-2">
                      <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 backdrop-blur">
                        {badge}
                      </span>
                      {index === 0 && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-[11px] font-semibold text-yellow-800">
                          Kapak
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveClick(item)}
                      className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-800 backdrop-blur transition hover:bg-white"
                      aria-label="Kaldır"
                      title="Kaldır"
                    >
                      <X size={16} />
                    </button>

                    <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-gray-500">
            Kalan hak: <span className="font-semibold">{remaining}</span>
          </div>
        </>
      )}

      {/* SORT MODAL */}
      <AnimatePresence>
        {openSortModal && (
          <div className="fixed inset-0 z-80">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Resim Sıralama
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {mediaItems.length} adet resim • İlk resim kapak olarak
                        kullanılacaktır
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Kapat"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <p className="text-sm text-gray-600 mb-6">
                    Sıralamak için ↑ / ↓ butonlarını kullan. Kapak fotoğrafı:{" "}
                    <b>1. sıradaki</b>.
                  </p>

                  <div className="space-y-4">
                    {mediaItems.map((item, index) => {
                      const src = previewSrc.get(item.id) || "";
                      const badge = isRemote(item) ? "Mevcut" : "Yeni";

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                          ${index === 0 ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"}`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-bold">
                            {index + 1}
                          </div>

                          <div className="w-24 h-16 overflow-hidden rounded-lg bg-gray-100 relative">
                            {src ? (
                              <Image
                                src={src}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                                  Kapak
                                </span>
                              )}
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                {badge}
                              </span>
                            </div>

                            <div className="mt-2 text-sm font-semibold text-gray-900 truncate">
                              {isRemote(item)
                                ? "Mevcut fotoğraf"
                                : isLocal(item)
                                  ? item.file.name
                                  : "Fotoğraf"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {isLocal(item)
                                ? `${(item.file.size / 1024 / 1024).toFixed(2)} MB • ${item.file.type.split("/")[1] || ""}`
                                : "Yayındaki görsel"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className={`p-2 rounded-lg transition-colors ${
                                index === 0
                                  ? "opacity-30 cursor-not-allowed"
                                  : "hover:bg-gray-100"
                              }`}
                              aria-label="Yukarı al"
                              title="Yukarı al"
                            >
                              <ArrowUp size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMoveDown(index)}
                              disabled={index === mediaItems.length - 1}
                              className={`p-2 rounded-lg transition-colors ${
                                index === mediaItems.length - 1
                                  ? "opacity-30 cursor-not-allowed"
                                  : "hover:bg-gray-100"
                              }`}
                              aria-label="Aşağı al"
                              title="Aşağı al"
                            >
                              <ArrowDown size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveClick(item)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="Sil"
                              title="Sil"
                            >
                              <X size={18} />
                            </button>

                            <div className="p-2 text-gray-400 rounded-lg">
                              <GripVertical size={18} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-3 rounded-lg font-semibold border border-gray-300 bg-white hover:bg-gray-50 transition"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle size={18} />
                      Sıralamayı Tamamla
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
