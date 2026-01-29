"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Reorder, motion } from "framer-motion";
import { GripVertical, ImagePlus, X } from "lucide-react";
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

export default function MediaTab({
  mediaItems,
  setMediaItems,
  onPickImages,
  onRemove,
  max = 35,
}: Props) {
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">Fotoğraflar</div>
          <div className="mt-1 text-xs text-gray-500">
            Sürükle-bırak ile sırala • Kaldır ile sil • {count}/{max}
          </div>
        </div>

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
          <Reorder.Group
            values={mediaItems}
            onReorder={setMediaItems}
            axis="y"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {mediaItems.map((item, index) => {
              const src = previewSrc.get(item.id) || "";
              const badge = isRemote(item) ? "Mevcut" : "Yeni";

              return (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  whileDrag={{ scale: 1.01 }}
                >
                  <div className="relative h-44 w-full">
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

                    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/35 to-transparent" />

                    <div className="absolute left-2 top-2 flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-gray-800 backdrop-blur"
                        title="Sırala"
                      >
                        <GripVertical size={14} />
                        Sırala
                      </motion.div>

                      <span className="rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 backdrop-blur">
                        {badge}
                      </span>
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

                    <div className="pointer-events-none absolute inset-0 opacity-0 ring-2 ring-blue-500/30 transition-opacity group-hover:opacity-100" />
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          <div className="text-[11px] text-gray-500">
            Kalan hak: <span className="font-semibold">{remaining}</span>
          </div>
        </>
      )}
    </div>
  );
}
