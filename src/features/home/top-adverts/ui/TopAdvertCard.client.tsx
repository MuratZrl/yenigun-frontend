// src/features/home/top-adverts/ui/TopAdvertCard.client.tsx
"use client";

import React, { useState, useRef } from "react";
import ShareModal from "./ShareModal.client";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, ArrowUpRight, Camera, Upload } from "lucide-react";
import type { Listing } from "../../highlights/types";
import {
  getAreaSqm,
  getFeeText,
  getFirstPhotoUrl,
  getLocationText,
} from "../../highlights/utils/listingUtils";

type Props = {
  listing: Listing;
  index: number;
  onNavigate: (uid: string) => void;
};

export default function TopAdvertCard({ listing, index, onNavigate }: Props) {
  const imgSrc = getFirstPhotoUrl(listing);
  const feeText = getFeeText(listing.fee) ?? "Fiyat Yok";
  const locationText = getLocationText(listing);
  const areaSqm = getAreaSqm(listing);
  const photoCount = listing.photos?.filter(Boolean).length ?? 0;
  const [showShare, setShowShare] = useState(false);
  const shareBtnRef = useRef<HTMLButtonElement>(null);

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/ilan/${listing.uid}`
    : `/ilan/${listing.uid}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => !showShare && onNavigate(listing.uid)}
      className="group cursor-pointer relative rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-500"
    >
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        url={shareUrl}
        title={listing.title || "İlan"}
        anchorRef={shareBtnRef}
      />
      {/* Image section */}
      <div className="p-1.5 overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl rounded-b-none">
        <img
          src={imgSrc || "/logo.png"}
          alt={listing.title || "İlan görseli"}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
            e.currentTarget.alt = "Logo";
            e.currentTarget.className = "absolute inset-0 w-full h-full object-contain p-8 bg-gray-50";
          }}
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Navigate arrow */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-white/30">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>

        {/* Photo count badge */}
        {photoCount > 0 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium">
              <Camera size={12} />
              {photoCount}
            </span>
          </div>
        )}

      </div>
      </div>

      {/* Bottom info */}
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50/80 to-white space-y-2 rounded-b-2xl">
        {/* Title */}
        <h3 className="font-bold text-[15px] text-gray-900 line-clamp-1 group-hover:text-[#035DBA] transition-colors duration-200">
          {listing.title || "Başlık Yok"}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5">
          <MapPin className="text-gray-400 shrink-0" size={12} />
          <span className="text-[11px] text-gray-500 truncate">{locationText}</span>
        </div>

        {/* Price */}
        <p className="text-2xl font-medium text-gray-900">{feeText}</p>

        {/* Features + Share */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
            <span className="flex-shrink-0 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
              {listing.steps?.second || "Konut"}
            </span>
            <span className="flex-shrink-0 text-[11px] font-semibold text-[#035DBA] bg-[#E9EEF7] px-2.5 py-1 rounded-full">
              {listing.steps?.first || "Satılık"}
            </span>

            <div className="w-px h-4 bg-gray-200 flex-shrink-0" />

            {areaSqm ? (
              <span className="flex-shrink-0 text-[11px] font-medium text-gray-600 flex items-center gap-1">
                <Maximize size={11} className="text-gray-400" /> {areaSqm} m²
              </span>
            ) : null}
            {listing.features?.bedrooms ? (
              <span className="flex-shrink-0 text-[11px] font-medium text-gray-600 flex items-center gap-1">
                <Bed size={11} className="text-gray-400" /> {listing.features.bedrooms}
              </span>
            ) : null}
            {listing.features?.bathrooms ? (
              <span className="flex-shrink-0 text-[11px] font-medium text-gray-600 flex items-center gap-1">
                <Bath size={11} className="text-gray-400" /> {listing.features.bathrooms}
              </span>
            ) : null}
          </div>
          <button
            ref={shareBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShare(true);
            }}
            className="flex-shrink-0 flex items-center gap-1.5 text-[13px] font-medium text-[#035DBA] hover:text-[#03409F] transition-colors duration-200 ml-2"
          >
            <Upload size={15} />
            Paylaş
          </button>
        </div>
      </div>
    </motion.div>
  );
}
