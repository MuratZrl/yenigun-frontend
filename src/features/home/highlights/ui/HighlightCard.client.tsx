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
    y: -6,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const imageVariants: Variants = {
  hover: { scale: 1.06, transition: { duration: 0.45, ease: "easeOut" } },
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

  const hasAnyFeatures =
    Boolean(listing.features?.bedrooms) ||
    Boolean(listing.features?.bathrooms) ||
    Boolean(listing.features?.size);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => onNavigate(listing.uid)}
      className="group cursor-pointer flex flex-col"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* ÜST: sadece resim */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
        <div className="relative aspect-[4/3]">
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
                "absolute inset-0 w-full h-full object-contain p-10 bg-gray-100";
            }}
          />

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-80" />

          {/* Öne çıkan */}
          {listing.isHighlight ? (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-xs shadow-lg">
                <Flame size={12} />
                <span>Öne Çıkan</span>
              </div>
            </div>
          ) : null}

          {/* Fiyat */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="inline-flex max-w-full py-2 px-4 rounded-lg bg-white/95 backdrop-blur-sm font-bold text-gray-900 text-base shadow-lg">
              <span className="truncate">{feeText}</span>
            </div>
          </div>

          {/* Copy link */}
          <div className="absolute top-3 right-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy(listing.uid);
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors duration-200 relative"
              aria-label="İlan linkini kopyala"
              type="button"
            >
              <LinkIcon className="text-gray-700" size={14} />
              {copiedId === listing.uid ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 py-1 px-2 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap"
                >
                  Link kopyalandı!
                </motion.span>
              ) : null}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ALT: info (resmin dışında) */}
      <div className="pt-4 px-1">
        <h3 className="font-bold text-base md:text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
          {listing.title || "Başlık Yok"}
        </h3>

        <div className="flex items-center justify-between text-muted-foreground mb-3 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <MapPin className="text-brand-red shrink-0" size={16} />
            <span className="text-xs md:text-sm font-medium truncate">
              {locationText}
            </span>
          </div>

          {areaSqm ? (
            <span className="text-[10px] md:text-xs text-foreground/80 whitespace-nowrap shrink-0">
              {areaSqm} m²
            </span>
          ) : null}
        </div>

        {hasAnyFeatures ? (
          <div className="flex items-center justify-between mb-3 bg-secondary rounded-lg p-2">
            {listing.features?.bedrooms ? (
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-1 text-foreground/80">
                  <Bed size={14} />
                  <span className="text-xs font-semibold">
                    {listing.features.bedrooms}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Yatak Odası
                </span>
              </div>
            ) : null}

            {listing.features?.bathrooms ? (
              <div className="flex flex-col items-center flex-1 border-x border-border">
                <div className="flex items-center gap-1 text-foreground/80">
                  <Bath size={14} />
                  <span className="text-xs font-semibold">
                    {listing.features.bathrooms}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Banyo
                </span>
              </div>
            ) : null}

            {listing.features?.size ? (
              <div className="flex flex-col items-center flex-1">
                <div className="flex items-center gap-1 text-foreground/80">
                  <Square size={14} />
                  <span className="text-xs font-semibold">
                    {listing.features.size}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  m²
                </span>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground/80 bg-secondary px-3 py-1.5 rounded-full">
            {listing.steps?.second || "Konut"}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            {listing.steps?.first || "Satılık"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}