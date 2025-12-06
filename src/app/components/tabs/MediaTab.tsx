"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Camera,
  Video,
  X,
  Move,
  Trash2,
  CheckCircle,
  GripVertical,
} from "lucide-react";
import { ImageItem } from "@/app/types/property";

interface MediaTabProps {
  images: ImageItem[];
  setImages: (images: ImageItem[]) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  reOrderImages: boolean;
  setReOrderImages: (reorder: boolean) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
}

export default function MediaTab({
  images,
  setImages,
  videoFile,
  setVideoFile,
  reOrderImages,
  setReOrderImages,
  onImageChange,
  onVideoChange,
  onRemoveImage,
}: MediaTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && reOrderImages) {
        handleCompleteSorting();
      }
    };

    if (reOrderImages) {
      document.addEventListener("keydown", handleEscape);

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [reOrderImages]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerVideoInput = () => {
    videoInputRef.current?.click();
  };
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];

    newImages.splice(draggedIndex, 1);

    newImages.splice(index, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [newImages[index], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[index],
    ];

    setImages(newImages);
  };

  const handleCompleteSorting = () => {
    setReOrderImages(false);
    setDraggedIndex(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 relative"
      >
        {/* Video Upload */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-300 bg-gray-50">
          <input
            type="file"
            accept="video/*"
            onChange={onVideoChange}
            ref={videoInputRef}
            className="hidden"
          />

          <motion.div
            className="space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <button
                type="button"
                onClick={triggerVideoInput}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
              >
                Video Yükle
              </button>
              <p className="text-gray-600 text-sm mt-2">
                veya sürükleyip bırakın
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              MP4, MOV, AVI - Maksimum 100MB
            </p>
          </motion.div>
        </div>

        {videoFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border border-green-300 rounded-lg bg-green-50 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Video className="text-green-600" size={20} />
              <span className="font-medium text-green-800">
                {videoFile.name}
              </span>
            </div>
            <button
              onClick={() => setVideoFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}

        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center hover:border-blue-500 transition-all duration-300 bg-gray-50">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
            className="hidden"
          />

          <motion.div
            className="space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <button
                type="button"
                onClick={triggerFileInput}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
              >
                Resim Yükle
              </button>
              <p className="text-gray-600 text-sm mt-2">
                veya sürükleyip bırakın
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              PNG, JPG, GIF - Maksimum 10MB
            </p>
          </motion.div>
        </div>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Camera size={20} />
                Yüklenen Resimler ({images.length})
              </h4>
              <button
                type="button"
                onClick={() => setReOrderImages(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Move size={16} />
                Sırala
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-300"
                >
                  <img
                    src={URL.createObjectURL(img.src)}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Kapak
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    #{index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {reOrderImages && (
        <div className="fixed inset-0 ">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCompleteSorting}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Resim Sıralama
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {images.length} adet resim yüklendi
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteSorting}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-gray-600 mb-6">
                  Fotoğrafları sürükleyerek sıralayabilir veya aşağıdaki
                  butonlarla pozisyonunu değiştirebilirsiniz. İlk resim kapak
                  fotoğrafı olarak kullanılacaktır.
                </p>

                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        index === 0
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-white border-gray-200"
                      } ${
                        draggedIndex === index
                          ? "border-blue-500 shadow-lg bg-blue-50"
                          : ""
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg font-bold">
                        {index + 1}
                      </div>
                      <div className="w-20 h-16 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={URL.createObjectURL(image.src)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {image.src.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {(image.src.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {image.src.type.split("/")[1]}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                            Kapak
                          </span>
                        )}

                        <button
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          className={`p-2 rounded-lg transition-colors ${
                            index === 0
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveImage(index, "down")}
                          disabled={index === images.length - 1}
                          className={`p-2 rounded-lg transition-colors ${
                            index === images.length - 1
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          ↓
                        </button>

                        <button
                          onClick={() => onRemoveImage(image.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>

                        <div
                          className="p-2 text-gray-400 cursor-grab hover:bg-gray-100 rounded-lg transition-colors"
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          title="Sürükle"
                        >
                          <GripVertical size={18} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={handleCompleteSorting}
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
    </>
  );
}
