// src/features/home/locations/ui/LocationCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { LocationItem } from "../types";
import { cardVariants } from "../motion/variants";

type Props = {
  item: LocationItem;
  index: number;
};

export default function LocationCard({ item }: Props) {
  return (
    <Link href={item.href} className="block">
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Count badge */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700">
              <MapPin size={12} />
              {item.count} İlan
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 text-center">
          <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-200">
            {item.title}
          </h3>
          <span className="text-xs text-gray-500">{item.provinceLabel}</span>
        </div>
      </motion.div>
    </Link>
  );
}
