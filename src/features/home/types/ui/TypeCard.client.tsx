// src/features/home/types/ui/TypeCard.client.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PropertyTypeItem } from "../model";
import { cardVariants } from "../motion/variants";

type Props = {
  item: PropertyTypeItem;
};

export default function TypeCard({ item }: Props) {
  const Icon = item.icon;

  return (
    <Link href={`/ilanlar?type=${encodeURIComponent(item.type)}`} className="block w-full sm:w-64">
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200
                   hover:shadow-lg hover:border-blue-200
                   transition-all duration-300 px-8 py-8 text-center"
      >
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icon */}
        <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors duration-300">
          <Icon size={26} />
        </div>

        {/* Count */}
        <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors duration-300">
          {item.count}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-600 mb-4">
          {item.title} İlan
        </h3>

        {/* CTA hint */}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          İlanları Görüntüle
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </span>
      </motion.div>
    </Link>
  );
}
