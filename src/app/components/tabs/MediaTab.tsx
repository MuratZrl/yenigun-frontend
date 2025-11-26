"use client";
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Video,
  X,
  Move,
  Trash2,
  CheckCircle,
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerVideoInput = () => {
    videoInputRef.current?.click();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
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
              <AnimatePresence>
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Reorder Images Modal */}
      <AnimatePresence>
        {reOrderImages && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
              onClick={() => setReOrderImages(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-col gap-5 w-[90vw] max-w-2xl h-[85vh] overflow-y-auto p-5 bg-white rounded-lg shadow-lg fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <h1 className="text-center text-lg flex flex-col font-bold">
                Resim Sıralama Modu ({images.length} Adet Resim Yüklendi)
              </h1>
              <p className="text-xs text-center text-gray-400 mb-4">
                Fotoğraf Sıralaması İçin Gri Alana Basılı Tutup
                Sürükleyebilirsiniz. Lütfen Yavaş Sürükleyiniz.
              </p>

              <AnimatePresence>
                <motion.div className="flex flex-col mx-auto gap-2 max-h-[60vh] overflow-y-auto">
                  {images.map((image: any, index: number) => (
                    <motion.div
                      key={image.id}
                      className="relative flex items-center gap-3 p-3 bg-gray-100 rounded-lg border border-gray-300"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      <img
                        src={URL.createObjectURL(image.src)}
                        alt={image.id}
                        className="w-20 h-16 object-cover rounded shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {image.src.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(image.src.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveImage(image.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="p-2 text-gray-400 cursor-grab">
                        <Move size={16} />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setReOrderImages(false)}
                className="bg-custom-orange text-white p-3 rounded-lg font-bold hover:bg-custom-orange-dark duration-200 flex items-center justify-center gap-2 mt-4"
              >
                <CheckCircle size={16} />
                Sıralamayı Tamamla
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
