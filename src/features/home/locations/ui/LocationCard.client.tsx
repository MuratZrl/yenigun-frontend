// src/features/home/locations/ui/LocationCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { LocationItem } from "../types";
import { cardVariants, imageVariants } from "../motion/variants";

type Props = {
  item: LocationItem;
  index: number;
};

export default function LocationCard({ item, index }: Props) {
  return (
    <Link href={item.href} className="block">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true }}
        className="group cursor-pointer relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-blue-300 overflow-hidden"
      >
        <div className="relative overflow-hidden h-48">
          <motion.img
            variants={imageVariants}
            whileHover="hover"
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-300">
              <MapPin className="text-gray-700" size={14} />
              <span className="text-gray-800 font-semibold text-sm">
                {item.count} İlan
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            viewport={{ once: true }}
            className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
          >
            {item.title}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
          >
            <MapPin size={14} />
            <span className="text-sm font-medium">{item.provinceLabel}</span>
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.div>
    </Link>
  );
}
