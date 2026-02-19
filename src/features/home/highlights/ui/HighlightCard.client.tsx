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
  ArrowUpRight,
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
    y: -4,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const imageVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.4, ease: "easeOut" } },
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
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 group-hover:shadow-xl group-hover:shadow-indigo-500/8 group-hover:ring-indigo-200 transition-all duration-300"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <motion.img
          variants={imageVariants}
          whileHover="hover"
          src={imgSrc || "/logo.png"}
          alt={listing.title || "İlan görseli"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
            e.currentTarget.alt = "Logo";
            e.currentTarget.className =
              "absolute inset-0 w-full h-full object-contain p-8 bg-gray-50";
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges row */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between">
          {listing.isHighlight ? (
            <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-[11px] shadow-md">
              <Flame size={10} />
              <span>Öne Çıkan</span>
            </div>
          ) : <div />}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy(listing.uid);
            }}
            className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors duration-150 relative"
            aria-label="İlan linkini kopyala"
            type="button"
          >
            <LinkIcon className="text-indigo-600" size={12} />
            {copiedId === listing.uid ? (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 py-1 px-2.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-md"
              >
                Kopyalandı!
              </motion.span>
            ) : null}
          </motion.button>
        </div>

        {/* Price */}
        <div className="absolute bottom-2.5 left-2.5">
          <div className="inline-flex py-1.5 px-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold text-sm shadow-md">
            <span className="truncate">{feeText}</span>
          </div>
        </div>
      </div>

      {/* Info — compact */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
          {listing.title || "Başlık Yok"}
        </h3>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin className="text-indigo-500 shrink-0" size={12} />
            <span className="text-[11px] font-medium text-gray-500 truncate">
              {locationText}
            </span>
          </div>
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            <ArrowUpRight className="text-white" size={10} />
          </span>
        </div>

        {/* Features inline row */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            {listing.steps?.second || "Konut"}
          </span>
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
            {listing.steps?.first || "Satılık"}
          </span>
          {areaSqm ? (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {areaSqm} m²
            </span>
          ) : null}
          {listing.features?.bedrooms ? (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Bed size={10} /> {listing.features.bedrooms}
            </span>
          ) : null}
          {listing.features?.bathrooms ? (
            <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Bath size={10} /> {listing.features.bathrooms}
            </span>
          ) : null}
          {listing.features?.size ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <Square size={10} /> {listing.features.size} m²
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
