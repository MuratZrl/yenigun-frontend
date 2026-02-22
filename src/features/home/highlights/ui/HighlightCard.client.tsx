// src/features/home/highlights/ui/HighlightCard.client.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Bath,
  Bed,
  Flame,
  Link as LinkIcon,
  MapPin,
  Square,
} from "lucide-react";
import type { Listing } from "../types";
import {
  getAreaSqm,
  getFeeText,
  getFirstPhotoUrl,
  getLocationText,
} from "../utils/listingUtils";

type Props = {
  listing: Listing;
  index: number;
  copiedId: string | null;
  onNavigate: (uid: string) => void;
  onCopy: (uid: string) => Promise<void> | void;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

export default function HighlightCard({
  listing,
  index,
  copiedId,
  onNavigate,
  onCopy,
}: Props) {
  const imgSrc = getFirstPhotoUrl(listing);
  const feeText = getFeeText(listing.fee) ?? "Fiyat Yok";
  const locationText = getLocationText(listing);
  const areaSqm = getAreaSqm(listing);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => onNavigate(listing.uid)}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm
                 hover:shadow-md hover:border-blue-200 transition-all duration-300"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={imgSrc || "/logo.png"}
          alt={listing.title || "İlan görseli"}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
            e.currentTarget.alt = "Logo";
            e.currentTarget.className =
              "absolute inset-0 w-full h-full object-contain p-8 bg-gray-50";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          {listing.isHighlight ? (
            <span className="inline-flex items-center gap-1 py-1 px-2 rounded-md bg-orange-500 text-white text-[10px] font-semibold">
              <Flame size={10} />
              Öne Çıkan
            </span>
          ) : (
            <div />
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy(listing.uid);
            }}
            className="p-1.5 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 relative"
            aria-label="İlan linkini kopyala"
            type="button"
          >
            <LinkIcon className="text-gray-600" size={12} />
            {copiedId === listing.uid && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 py-0.5 px-2 bg-gray-900 text-white text-[10px] font-medium rounded whitespace-nowrap"
              >
                Kopyalandı!
              </motion.span>
            )}
          </button>
        </div>

        {/* Price */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-block py-1.5 px-3 rounded-md bg-white text-gray-900 text-xs font-bold shadow">
            {feeText}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors duration-200">
          {listing.title || "Başlık Yok"}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5">
          <MapPin className="text-gray-400 shrink-0" size={12} />
          <span className="text-xs text-gray-500 truncate">
            {locationText}
          </span>
        </div>

        {/* Feature tags */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            {listing.steps?.second || "Konut"}
          </span>
          <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
            {listing.steps?.first || "Satılık"}
          </span>
          {areaSqm ? (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
              {areaSqm} m²
            </span>
          ) : null}
          {listing.features?.bedrooms ? (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Bed size={10} /> {listing.features.bedrooms}
            </span>
          ) : null}
          {listing.features?.bathrooms ? (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Bath size={10} /> {listing.features.bathrooms}
            </span>
          ) : null}
          {listing.features?.size ? (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
              <Square size={10} /> {listing.features.size} m²
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
