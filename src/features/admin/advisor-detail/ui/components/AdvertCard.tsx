// src/features/admin/advisor-detail/ui/components/AdvertCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import type { Advert } from "../../lib/types";

type Props = {
  advert: Advert;
  onClick: () => void;
};

const DEFAULT_IMAGE = "/logo.png";

export default function AdvertCard({ advert, onClick }: Props) {
  const firstPhoto = advert.photos?.find((photo) => photo.trim() !== "");
  const [imgError, setImgError] = useState(false);

  const showFallback = !firstPhoto || imgError;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full relative ${
          !advert.active ? "opacity-70" : ""
        }`}
      >
        <div className="relative h-40">
          <Image
            src={showFallback ? DEFAULT_IMAGE : firstPhoto}
            alt={advert.title}
            fill
            className={showFallback ? "object-contain p-4" : "object-cover"}
            style={{
              filter: advert.active ? "none" : "blur(1.5px)",
            }}
            onError={() => setImgError(true)}
            unoptimized
          />
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
            {advert.fee.toLocaleString()}
          </div>
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-medium text-white ${
              advert.active ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {advert.active ? "Aktif" : "Pasif"}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate mb-1">
            {advert.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {advert.address.district}, {advert.address.province}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-700">
            <div className="flex items-center gap-1">
              <Home size={14} />
              <span>{advert.details.roomCount} Oda</span>
            </div>
            <span>{advert.details.netArea} m²</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}